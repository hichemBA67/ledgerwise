"use client";

import { geoEquirectangular, geoGraticule10, geoPath } from "d3-geo";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CSS2DObject, CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import type { FeatureCollection } from "geojson";
import world from "world-atlas/countries-110m.json";
import { GROUPS, RELATION_LABEL, entities, groupOf } from "@/content/rl1";
import { MACROS, categoryLabel, macroOf, universe } from "@/content/universe";
import { PlayerLogo } from "../PlayerLogo";
import { cssVar, groupColor, groupVar, isDarkMode, onThemeChange, useWebGL } from "./theme";

const land = feature(world as unknown as Topology, (world as unknown as Topology).objects.countries as GeometryCollection) as unknown as FeatureCollection;

const R = 10;
const SEG = 0.75;

function toVec(lat: number, lng: number, r = R) {
  const phi = ((lng + 180) * Math.PI) / 180;
  const theta = ((90 - lat) * Math.PI) / 180;
  return new THREE.Vector3(-r * Math.sin(theta) * Math.cos(phi), r * Math.cos(theta), r * Math.sin(theta) * Math.sin(phi));
}

type Mode = "rl1" | "universe";
type Item = { id: string; name: string; web: string; series: string; sub: string };
type City = { key: string; city: string; country: string; lat: number; lng: number; items: Item[] };

/** Macro groups take the first five validated categorical slots, in fixed order. */
const MACRO_COLOR: Record<"light" | "dark", string[]> = {
  light: ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4"],
  dark: ["#3987e5", "#d95926", "#199e70", "#c98500", "#d55181"],
};
const SERIES: Record<Mode, { id: string; label: string }[]> = { rl1: GROUPS, universe: MACROS };
const DEFAULTS: Record<Mode, string[]> = { rl1: ["members", "ops", "supporters"], universe: MACROS.map((m) => m.id) };

function seriesColor(mode: Mode, id: string, dark: boolean) {
  if (mode === "rl1") return groupColor(id as Parameters<typeof groupColor>[0], dark);
  return MACRO_COLOR[dark ? "dark" : "light"][MACROS.findIndex((m) => m.id === id)];
}
function seriesVar(mode: Mode, id: string) {
  return mode === "rl1" ? groupVar(id as Parameters<typeof groupVar>[0]) : `var(--macro-${id})`;
}

function cityList(mode: Mode, active: Set<string>) {
  const map = new Map<string, City>();
  const names = new Map<string, Map<string, number>>();
  const push = (key: string, city: string, country: string, lat: number, lng: number, item: Item) => {
    if (!map.has(key)) map.set(key, { key, city, country, lat, lng, items: [] });
    const c = map.get(key)!;
    c.items.push(item);
    // Name a bucket after its most common city (Frankfurt, not neighbouring Eschborn).
    const tally = (names.get(key) ?? new Map<string, number>()).set(city, (names.get(key)?.get(city) ?? 0) + 1);
    names.set(key, tally);
    c.city = [...tally.entries()].sort((a, b) => b[1] - a[1] || a[0].length - b[0].length)[0][0];
  };
  if (mode === "rl1") {
    for (const e of entities) {
      const g = groupOf(e);
      if (active.has(g)) push(`${e.city}|${e.country}`, e.city, e.country, e.lat, e.lng, { id: e.id, name: e.name, web: e.domain, series: g, sub: RELATION_LABEL[e.rel] + (e.validator ? " · validator" : "") });
    }
  } else {
    for (const r of universe) {
      const g = macroOf(r.cat);
      if (r.lat == null || r.lng == null || !active.has(g)) continue;
      // Same city from different sources can carry different names or coordinates: bucket by ~10 km.
      push(`${Math.round(r.lat * 8)}|${Math.round(r.lng * 8)}`, r.city, r.country, r.lat, r.lng, { id: r.id, name: r.name, web: r.web ?? r.name, series: g, sub: categoryLabel[r.cat] + (r.geo === "capital" ? " · capital used" : "") });
    }
  }
  return [...map.values()];
}

function drawTexture(canvas: HTMLCanvasElement) {
  const w = 2048;
  const h = 1024;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const proj = geoEquirectangular().scale(w / (2 * Math.PI)).translate([w / 2, h / 2]);
  const path = geoPath(proj, ctx);
  ctx.fillStyle = cssVar("--surface");
  ctx.fillRect(0, 0, w, h);
  ctx.beginPath();
  path(geoGraticule10());
  ctx.strokeStyle = cssVar("--line");
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.beginPath();
  path(land);
  ctx.fillStyle = cssVar("--surface-2");
  ctx.fill();
  ctx.strokeStyle = cssVar("--faint");
  ctx.lineWidth = 0.8;
  ctx.stroke();
}

export function MemberGlobe3D() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("rl1");
  const [groups, setGroups] = useState<Set<string>>(() => new Set(DEFAULTS.rl1));
  const [selected, setSelected] = useState<string | null>("Frankfurt|Germany");
  const webgl = useWebGL();
  const api = useRef<{ rebuild: (cities: City[], mode: Mode) => void; focus: (lat: number, lng: number) => void } | null>(null);
  const selectRef = useRef(setSelected);
  const cities = useMemo(() => cityList(mode, groups), [mode, groups]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (!webgl) return;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 400);
    // Look obliquely at Europe so the columns read as columns, not dots.
    camera.position.copy(toVec(24, 8, 30));
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.display = "block";
    wrap.appendChild(renderer.domElement);
    const labels = new CSS2DRenderer();
    labels.domElement.style.position = "absolute";
    labels.domElement.style.inset = "0";
    labels.domElement.style.pointerEvents = "none";
    wrap.appendChild(labels.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.target.copy(toVec(50, 8, 5));
    controls.minDistance = 14;
    controls.maxDistance = 70;
    controls.autoRotateSpeed = 0.6;

    scene.add(new THREE.AmbientLight(0xffffff, 1.9));
    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(20, 30, 30);
    scene.add(sun);

    const texCanvas = document.createElement("canvas");
    drawTexture(texCanvas);
    const texture = new THREE.CanvasTexture(texCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    const globe = new THREE.Mesh(new THREE.SphereGeometry(R, 96, 64), new THREE.MeshStandardMaterial({ map: texture, roughness: 1 }));
    scene.add(globe);

    const dynamic = new THREE.Group();
    scene.add(dynamic);
    const hit: THREE.Mesh[] = [];
    const up = new THREE.Vector3(0, 1, 0);
    const hub = toVec(49.61, 6.13);

    const rebuild = (list: City[], mode: Mode) => {
      dynamic.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.Line) {
          o.geometry.dispose();
          (o.material as THREE.Material).dispose();
        }
        if (o instanceof CSS2DObject) o.element.remove();
      });
      dynamic.clear();
      hit.length = 0;
      const dark = isDarkMode();
      for (const c of list) {
        const n = toVec(c.lat, c.lng).normalize();
        const q = new THREE.Quaternion().setFromUnitVectors(up, n);
        let h = 0;
        const counts = SERIES[mode].map((g) => ({ g: g.id, n: c.items.filter((e) => e.series === g.id).length })).filter((x) => x.n);
        // RL1 view: linear height. Universe view: total height grows with the square root so Frankfurt doesn't leave orbit.
        const total = c.items.length;
        const height = mode === "rl1" ? total * SEG : 0.5 + 1.1 * Math.sqrt(total);
        for (const { g, n: count } of counts) {
          const len = (count / total) * height;
          const geo = new THREE.CylinderGeometry(0.2, 0.2, Math.max(0.04, len - 0.06), 20);
          const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: seriesColor(mode, g, dark), roughness: 0.5 }));
          m.quaternion.copy(q);
          m.position.copy(n.clone().multiplyScalar(R + h + len / 2));
          m.userData.key = c.key;
          dynamic.add(m);
          hit.push(m);
          h += len;
        }
        // Fat invisible hit target so short columns stay clickable.
        const target = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, h + 0.6, 8), new THREE.MeshBasicMaterial({ visible: false }));
        target.quaternion.copy(q);
        target.position.copy(n.clone().multiplyScalar(R + h / 2));
        target.userData.key = c.key;
        dynamic.add(target);
        hit.push(target);

        if (mode === "rl1" && c.city !== "Luxembourg") {
          const a = hub.clone().normalize();
          const b = n.clone();
          const ang = a.angleTo(b);
          const pts: THREE.Vector3[] = [];
          for (let i = 0; i <= 48; i++) {
            const t = i / 48;
            const v = a.clone().lerp(b, t).normalize();
            pts.push(v.multiplyScalar(R + 0.05 + Math.sin(Math.PI * t) * Math.min(6, 0.6 + ang * 3.2)));
          }
          const dom = counts.sort((x, y) => y.n - x.n)[0].g;
          const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: seriesColor(mode, dom, dark), transparent: true, opacity: 0.55 }));
          dynamic.add(line);
        }

        const div = document.createElement("div");
        div.className = "rl1-node-label";
        div.dataset.state = "idle";
        div.dataset.key = c.key;
        // In busy views, single-entity cities only label on selection (the list on the right names them).
        div.dataset.minor = (mode === "universe" ? c.items.length < 12 : list.length > 10 && c.items.length < 2) ? "1" : "0";
        div.textContent = `${c.city} ${c.items.length}`;
        div.style.pointerEvents = "auto";
        div.addEventListener("click", () => selectRef.current(c.key));
        const obj = new CSS2DObject(div);
        obj.position.copy(n.clone().multiplyScalar(R + h + 0.6));
        dynamic.add(obj);
      }
      // Hub marker
      const ringGeo = new THREE.TorusGeometry(0.6, 0.07, 8, 40);
      const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: new THREE.Color(cssVar("--ink")) }));
      ring.quaternion.copy(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), hub.clone().normalize()));
      ring.position.copy(hub.clone().normalize().multiplyScalar(R + 0.03));
      dynamic.add(ring);
    };

    let focusTarget: { cam: THREE.Vector3; look: THREE.Vector3 } | null = null;
    api.current = {
      rebuild,
      focus: (lat, lng) => {
        focusTarget = { cam: toVec(Math.max(-80, lat - 22), lng, 30), look: toVec(lat, lng, 5) };
      },
    };

    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let down: [number, number] | null = null;
    const pick = (ev: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      ndc.set(((ev.clientX - rect.left) / rect.width) * 2 - 1, -((ev.clientY - rect.top) / rect.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      return ray.intersectObjects(hit)[0]?.object.userData.key as string | undefined;
    };
    const onDown = (ev: PointerEvent) => (down = [ev.clientX, ev.clientY]);
    const onUp = (ev: PointerEvent) => {
      if (!down || Math.hypot(ev.clientX - down[0], ev.clientY - down[1]) > 5) return;
      const k = pick(ev);
      if (k) selectRef.current(k);
    };
    const onMove = (ev: PointerEvent) => (renderer.domElement.style.cursor = pick(ev) ? "pointer" : "grab");
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("pointermove", onMove);
    controls.addEventListener("start", () => (focusTarget = null));

    const resize = () => {
      const w = wrap.clientWidth;
      const h = Math.max(380, Math.min(600, w * 0.8));
      renderer.setSize(w, h);
      labels.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const stopTheme = onThemeChange(() => {
      drawTexture(texCanvas);
      texture.needsUpdate = true;
    });

    renderer.setAnimationLoop(() => {
      if (focusTarget) {
        camera.position.lerp(focusTarget.cam, 0.06);
        controls.target.lerp(focusTarget.look, 0.06);
        if (camera.position.distanceTo(focusTarget.cam) < 0.05) focusTarget = null;
      }
      controls.update();
      renderer.render(scene, camera);
      labels.render(scene, camera);
    });

    return () => {
      renderer.setAnimationLoop(null);
      ro.disconnect();
      stopTheme();
      controls.dispose();
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointerup", onUp);
      renderer.domElement.removeEventListener("pointermove", onMove);
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.Line) {
          o.geometry.dispose();
          (o.material as THREE.Material).dispose();
        }
      });
      texture.dispose();
      renderer.dispose();
      wrap.replaceChildren();
      api.current = null;
    };
  }, [webgl]);

  useEffect(() => {
    if (!api.current) return;
    api.current.rebuild(cities, mode);
    return onThemeChange(() => api.current?.rebuild(cities, mode));
  }, [cities, mode]);

  useEffect(() => {
    wrapRef.current?.querySelectorAll<HTMLElement>(".rl1-node-label").forEach((el) => {
      el.dataset.state = el.dataset.key === selected ? "active" : "idle";
    });
  }, [selected, cities]);

  const sel = cities.find((c) => c.key === selected) ?? null;
  const countries = new Set(cities.map((c) => c.country)).size;
  const total = cities.reduce((s, c) => s + c.items.length, 0);
  const ranked = [...cities].sort((a, b) => b.items.length - a.items.length);

  function switchMode(m: Mode) {
    setMode(m);
    setGroups(new Set(DEFAULTS[m]));
  }

  function toggle(g: string) {
    setGroups((prev) => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      return next;
    });
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-1.5">
          {(["rl1", "universe"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => switchMode(m)}
              className={`rounded-full border px-3 py-1 text-[12px] font-semibold transition ${mode === m ? "border-ink bg-ink text-bg" : "border-line text-muted hover:text-ink"}`}
            >
              {m === "rl1" ? "RL1 map" : `Whole universe (${universe.filter((r) => r.lat != null).length.toLocaleString()} located)`}
            </button>
          ))}
          <span className="ml-2 mr-1 font-mono text-[11px] uppercase tracking-wider text-faint">Show</span>
          {SERIES[mode].map((g) => (
            <button
              key={g.id}
              type="button"
              aria-pressed={groups.has(g.id)}
              onClick={() => toggle(g.id)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium transition ${groups.has(g.id) ? "border-ink text-ink" : "border-line text-faint"}`}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: groups.has(g.id) ? seriesVar(mode, g.id) : "var(--line)" }} />
              {g.label}
            </button>
          ))}
        </div>
        <div ref={wrapRef} className="rl1-stage relative mt-3 overflow-hidden rounded-2xl border border-line bg-surface" />
        {!webgl ? <p className="mt-3 text-[14px] text-muted">WebGL is unavailable in this browser. The city list is on the right.</p> : null}
        <p className="mt-2 text-[12px] text-faint">
          {mode === "rl1"
            ? "Column height = number of entities in that city, stacked by group. Arcs run to RL1's seat in Luxembourg (ringed)."
            : "Column height grows with the square root of institutions per city, stacked by macro group. On-chain entities (dApps, chains, CEXs) have no HQ and are not shown; cities with fewer than 12 are labelled on selection."}
        </p>
      </div>
      <aside className="rounded-2xl border border-line bg-surface p-5 lg:max-h-[680px] lg:overflow-y-auto">
        <p className="font-mono text-[11px] uppercase tracking-wider text-faint">In view</p>
        <p className="mt-1 text-[14px] text-ink">
          <span className="font-serif text-3xl">{total.toLocaleString()}</span> institutions · {cities.length} cities · {countries} countries
        </p>
        {sel ? (
          <div className="mt-4 rounded-xl border border-line p-3">
            <h3 className="font-serif text-xl text-ink">
              {sel.city}, {sel.country}
            </h3>
            <ul className="mt-2 space-y-2">
              {sel.items.map((e) => (
                <li key={e.id} className="flex items-center gap-2.5">
                  <PlayerLogo name={e.name} domain={e.web} size={28} />
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-semibold text-ink">{e.name}</span>
                    <span className="flex items-center gap-1.5 text-[12px] text-muted">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: seriesVar(mode, e.series) }} />
                      {e.sub}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <ul className="mt-4 space-y-0.5">
          {ranked.map((c) => (
            <li key={c.key}>
              <button
                type="button"
                onClick={() => {
                  setSelected(c.key);
                  api.current?.focus(c.lat, c.lng);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-[13px] ${selected === c.key ? "bg-surface-2 text-ink" : "text-muted hover:bg-surface-2"}`}
              >
                <span>
                  {c.city} <span className="text-faint">· {c.country}</span>
                </span>
                <span className="font-mono text-ink">{c.items.length}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
