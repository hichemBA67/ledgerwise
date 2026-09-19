"use client";

import { geoDistance, geoGraticule10, geoOrthographic, geoPath } from "d3-geo";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import type { FeatureCollection } from "geojson";
import world from "world-atlas/countries-110m.json";
import type { PlayerCategory, Region } from "@/content/types";
import { PlayerLogo } from "./PlayerLogo";

export type GlobePlayer = { id: string; name: string; domain: string; category: PlayerCategory; region: Region; hq: string };
export type GlobeCity = { key: string; name: string; country: string; lat: number; lng: number; players: GlobePlayer[] };

const land = feature(
  world as unknown as Topology,
  (world as unknown as Topology).objects.countries as GeometryCollection,
) as unknown as FeatureCollection;

const CATEGORY_COLOR: Partial<Record<PlayerCategory, string>> = {
  "Bank / Dealer": "var(--track-money)",
  "CSD / ICSD": "var(--track-infra)",
  "CCP / Clearing": "var(--track-infra)",
  Custodian: "var(--track-fixed)",
  "Exchange / Venue": "var(--track-markets)",
  "Asset Manager": "var(--track-fixed)",
  "Central Bank / Regulator": "var(--track-reg)",
  "Tokenization Platform": "var(--track-token)",
  "Digital Asset Custody": "var(--track-token)",
  "Stablecoin / Cash Token": "var(--track-token)",
  "DLT Network": "var(--track-token)",
};

export function Globe({ cities, categories }: { cities: GlobeCity[]; categories: PlayerCategory[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const rot = useRef<[number, number]>([-20, -25]);
  const target = useRef<[number, number] | null>(null);
  const dragging = useRef(false);
  const last = useRef<[number, number] | null>(null);
  const spin = useRef(true);
  const markersRef = useRef<{ key: string; x: number; y: number; r: number }[]>([]);

  const [size, setSize] = useState(560);
  const [selected, setSelected] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [cat, setCat] = useState<PlayerCategory | "all">("all");
  const [tokenOnly, setTokenOnly] = useState(false);

  const filtered = useMemo(
    () =>
      cities
        .map((c) => ({
          ...c,
          players: c.players.filter(
            (p) => (cat === "all" || p.category === cat) && (!tokenOnly || ["Tokenization Platform", "Digital Asset Custody", "Stablecoin / Cash Token", "DLT Network"].includes(p.category)),
          ),
        }))
        .filter((c) => c.players.length > 0),
    [cities, cat, tokenOnly],
  );

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize(Math.max(280, Math.min(e.contentRect.width, 620))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== size * dpr) {
      canvas.width = size * dpr;
      canvas.height = size * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    const css = getComputedStyle(document.documentElement);
    const v = (name: string) => css.getPropertyValue(name).trim();
    const colors = {
      ocean: v("--bg"),
      land: v("--surface-2"),
      stroke: v("--line"),
      grid: v("--line"),
      ink: v("--ink"),
      accent: v("--accent"),
      token: v("--token"),
      muted: v("--muted"),
    };

    const r = size / 2 - 6;
    const projection = geoOrthographic().translate([size / 2, size / 2]).scale(r).rotate(rot.current);
    const path = geoPath(projection, ctx);

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, r, 0, 2 * Math.PI);
    ctx.fillStyle = colors.ocean;
    ctx.fill();

    ctx.beginPath();
    path(geoGraticule10());
    ctx.strokeStyle = colors.grid;
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.beginPath();
    path(land);
    ctx.fillStyle = colors.land;
    ctx.fill();
    ctx.strokeStyle = colors.stroke;
    ctx.lineWidth = 0.6;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, r, 0, 2 * Math.PI);
    ctx.strokeStyle = colors.stroke;
    ctx.lineWidth = 1;
    ctx.stroke();

    const center: [number, number] = [-rot.current[0], -rot.current[1]];
    const markers: { key: string; x: number; y: number; r: number }[] = [];
    const maxCount = Math.max(1, ...filtered.map((c) => c.players.length));

    for (const city of filtered) {
      const visible = geoDistance([city.lng, city.lat], center) < Math.PI / 2;
      if (!visible) continue;
      const p = projection([city.lng, city.lat]);
      if (!p) continue;
      const [x, y] = p;
      const rad = 4 + 9 * Math.sqrt(city.players.length / maxCount);
      markers.push({ key: city.key, x, y, r: rad });
      const isActive = selected === city.key || hover === city.key;

      ctx.beginPath();
      ctx.arc(x, y, rad + (isActive ? 5 : 2.5), 0, 2 * Math.PI);
      ctx.fillStyle = colors.accent;
      ctx.globalAlpha = isActive ? 0.28 : 0.14;
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.beginPath();
      ctx.arc(x, y, rad, 0, 2 * Math.PI);
      ctx.fillStyle = isActive ? colors.token : colors.accent;
      ctx.fill();
      ctx.strokeStyle = colors.ocean;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      if (isActive || city.players.length >= Math.max(4, maxCount * 0.35)) {
        ctx.font = `600 ${isActive ? 13 : 11.5}px ui-sans-serif, system-ui, sans-serif`;
        ctx.fillStyle = isActive ? colors.ink : colors.muted;
        ctx.textAlign = "center";
        ctx.fillText(`${city.name} (${city.players.length})`, x, y - rad - 7);
      }
    }
    markersRef.current = markers;
  }, [size, filtered, selected, hover]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (target.current) {
        const [tl, tp] = target.current;
        const [cl, cp] = rot.current;
        const dl = ((tl - cl + 540) % 360) - 180;
        const dp = tp - cp;
        if (Math.abs(dl) < 0.4 && Math.abs(dp) < 0.4) {
          rot.current = [tl, tp];
          target.current = null;
        } else {
          rot.current = [cl + dl * 0.08, cp + dp * 0.08];
        }
      } else if (spin.current && !dragging.current && !selected) {
        rot.current = [rot.current[0] + 0.12, rot.current[1]];
      }
      draw();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [draw, selected]);

  function pointer(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top] as [number, number];
  }

  function nearest(x: number, y: number) {
    let best: { key: string; d: number } | null = null;
    for (const m of markersRef.current) {
      const d = Math.hypot(m.x - x, m.y - y);
      if (d < m.r + 8 && (!best || d < best.d)) best = { key: m.key, d };
    }
    return best?.key ?? null;
  }

  const flyTo = (c: GlobeCity) => {
    target.current = [-c.lng, -c.lat];
    setSelected(c.key);
  };

  const selectedCity = filtered.find((c) => c.key === selected) ?? null;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value as PlayerCategory | "all")}
            className="h-9 rounded-lg border border-line bg-surface px-2.5 text-[13px] text-ink"
            aria-label="Filter by category"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <label className="flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-line bg-surface px-3 text-[13px] text-ink">
            <input type="checkbox" checked={tokenOnly} onChange={(e) => setTokenOnly(e.target.checked)} />
            <span className="text-token">◈</span> Digital-asset firms
          </label>
          {selected ? (
            <button type="button" onClick={() => setSelected(null)} className="h-9 rounded-lg border border-line px-3 text-[13px] text-muted hover:text-ink">
              Resume spin
            </button>
          ) : null}
        </div>
        <div ref={wrapRef} className="flex justify-center rounded-2xl border border-line bg-surface p-4">
          <canvas
            ref={canvasRef}
            style={{ width: size, height: size, touchAction: "none", cursor: hover ? "pointer" : "grab" }}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              dragging.current = true;
              last.current = pointer(e);
              target.current = null;
            }}
            onPointerMove={(e) => {
              const [x, y] = pointer(e);
              if (dragging.current && last.current) {
                const [lx, ly] = last.current;
                rot.current = [rot.current[0] + (x - lx) * 0.35, Math.max(-85, Math.min(85, rot.current[1] - (y - ly) * 0.35))];
                last.current = [x, y];
              } else {
                const k = nearest(x, y);
                if (k !== hover) setHover(k);
              }
            }}
            onPointerUp={(e) => {
              const [x, y] = pointer(e);
              const moved = last.current && Math.hypot(x - last.current[0], y - last.current[1]) > 3;
              dragging.current = false;
              last.current = null;
              if (!moved) {
                const k = nearest(x, y);
                if (k) {
                  const c = filtered.find((f) => f.key === k);
                  if (c) flyTo(c);
                }
              }
            }}
            onPointerLeave={() => {
              dragging.current = false;
              setHover(null);
            }}
            aria-label="Interactive globe of financial institutions"
            role="img"
          />
        </div>
        <p className="mt-2 text-center text-[12.5px] text-faint">
          Drag to spin · click a city to see its institutions · {filtered.reduce((s, c) => s + c.players.length, 0)} institutions in {filtered.length} cities
        </p>
      </div>

      <aside className="lg:sticky lg:top-24 lg:max-h-[80vh] lg:self-start lg:overflow-y-auto">
        {selectedCity ? (
          <div className="rounded-2xl border border-line bg-surface p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">{selectedCity.country}</p>
            <h3 className="font-serif text-3xl text-ink">{selectedCity.name}</h3>
            <p className="mt-1 text-[13px] text-muted">{selectedCity.players.length} institutions</p>
            <ul className="mt-4 space-y-2">
              {selectedCity.players.map((p) => (
                <li key={p.id}>
                  <Link href={`/players?focus=${p.id}`} className="flex items-start gap-2.5 rounded-lg border border-line bg-bg p-2.5 hover:border-accent/50">
                    <PlayerLogo name={p.name} domain={p.domain} size={30} />
                    <span className="min-w-0">
                      <span className="block text-[13.5px] font-semibold text-ink">{p.name}</span>
                      <span className="block text-[11.5px]" style={{ color: CATEGORY_COLOR[p.category] ?? "var(--muted)" }}>
                        {p.category}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="rounded-2xl border border-line bg-surface p-5">
            <h3 className="font-serif text-2xl text-ink">Financial centres</h3>
            <p className="mt-1 text-[13.5px] text-muted">Ranked by institutions in this view.</p>
            <ol className="mt-4 space-y-1">
              {[...filtered]
                .sort((a, b) => b.players.length - a.players.length)
                .slice(0, 14)
                .map((c, i, arr) => (
                  <li key={c.key}>
                    <button
                      type="button"
                      onClick={() => flyTo(c)}
                      onMouseEnter={() => setHover(c.key)}
                      onMouseLeave={() => setHover(null)}
                      className="flex w-full items-center gap-3 rounded-lg px-2.5 py-1.5 text-left hover:bg-surface-2"
                    >
                      <span className="w-4 font-mono text-[11px] text-faint">{i + 1}</span>
                      <span className="flex-1 text-[14px] font-medium text-ink">{c.name}</span>
                      <span className="h-1.5 rounded-full bg-accent" style={{ width: 8 + (c.players.length / arr[0].players.length) * 70 }} />
                      <span className="w-6 text-right font-mono text-[12px] text-muted">{c.players.length}</span>
                    </button>
                  </li>
                ))}
            </ol>
          </div>
        )}
      </aside>
    </div>
  );
}
