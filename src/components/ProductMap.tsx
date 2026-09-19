"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product, ProductFamily } from "@/content/types";

type Lite = Pick<Product, "slug" | "name" | "family" | "tenorDays" | "risk" | "short">;

const W = 860;
const H = 420;
const PAD = { l: 58, r: 20, t: 26, b: 52 };

const TICKS: [number, string][] = [
  [1, "1d"],
  [7, "1w"],
  [30, "1m"],
  [365, "1y"],
  [1825, "5y"],
  [3650, "10y"],
  [36500, "∞"],
];

export function ProductMap({ products, colors }: { products: Lite[]; colors: Record<ProductFamily, string> }) {
  const router = useRouter();
  const [hover, setHover] = useState<string | null>(null);
  const items = products.filter((p) => p.tenorDays !== undefined);

  const x = (d: number) => PAD.l + (Math.log10(Math.max(0.2, d)) + 0.7) / (Math.log10(36500) + 0.7) * (W - PAD.l - PAD.r);
  const score = (p: Lite) => (p.risk.credit + p.risk.market + p.risk.liquidity) / 3;
  const y = (s: number) => H - PAD.b - ((s - 1) / 4) * (H - PAD.t - PAD.b);

  const hovered = items.find((p) => p.slug === hover);

  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="overflow-x-auto p-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[640px]" role="img" aria-label="Products by tenor and risk">
          {[1, 2, 3, 4, 5].map((s) => (
            <g key={s}>
              <line x1={PAD.l} x2={W - PAD.r} y1={y(s)} y2={y(s)} stroke="var(--line)" strokeDasharray="3 5" />
              <text x={PAD.l - 10} y={y(s) + 4} textAnchor="end" fontSize="11" fill="var(--faint)">
                {s}
              </text>
            </g>
          ))}
          {TICKS.map(([d, label]) => (
            <g key={label}>
              <line x1={x(d)} x2={x(d)} y1={PAD.t} y2={H - PAD.b} stroke="var(--line)" strokeDasharray="3 5" opacity={0.6} />
              <text x={x(d)} y={H - PAD.b + 18} textAnchor="middle" fontSize="11" fill="var(--faint)">
                {label}
              </text>
            </g>
          ))}
          <text x={W / 2} y={H - 10} textAnchor="middle" fontSize="12" fill="var(--muted)">
            Typical tenor (log scale)
          </text>
          <text x={16} y={H / 2} textAnchor="middle" fontSize="12" fill="var(--muted)" transform={`rotate(-90 16 ${H / 2})`}>
            Risk (credit + market + illiquidity)
          </text>

          {items.map((p) => {
            const cx = x(p.tenorDays!);
            const cy = y(score(p));
            const on = hover === p.slug;
            return (
              <g
                key={p.slug}
                onMouseEnter={() => setHover(p.slug)}
                onMouseLeave={() => setHover(null)}
                onClick={() => router.push(`/products/${p.slug}`)}
                style={{ cursor: "pointer" }}
              >
                <circle cx={cx} cy={cy} r={on ? 11 : 7} fill={colors[p.family]} opacity={on ? 1 : 0.85} stroke="var(--surface)" strokeWidth={2} />
                {on ? null : (
                  <text x={cx} y={cy - 12} textAnchor="middle" fontSize="10.5" fill="var(--muted)">
                    {p.name.length > 18 ? p.name.slice(0, 17) + "…" : p.name}
                  </text>
                )}
              </g>
            );
          })}

          {hovered ? (
            <g>
              <rect x={x(hovered.tenorDays!) - 110} y={y(score(hovered)) - 78} width={220} height={58} rx={8} fill="var(--ink)" opacity={0.95} />
              <text x={x(hovered.tenorDays!)} y={y(score(hovered)) - 56} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--bg)">
                {hovered.name}
              </text>
              <text x={x(hovered.tenorDays!)} y={y(score(hovered)) - 38} textAnchor="middle" fontSize="11" fill="var(--bg)" opacity={0.85}>
                {hovered.short.length > 44 ? hovered.short.slice(0, 43) + "…" : hovered.short}
              </text>
            </g>
          ) : null}
        </svg>
      </div>
      <figcaption className="flex flex-wrap gap-x-4 gap-y-1.5 border-t border-line px-5 py-2.5">
        {Object.entries(colors).map(([f, c]) => (
          <span key={f} className="flex items-center gap-1.5 text-[11.5px] text-muted">
            <span className="h-2 w-2 rounded-full" style={{ background: c }} />
            {f}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
