"use client";

import { useState } from "react";
import type { FlowKind, Product } from "@/content/types";

const KIND: Record<FlowKind, { color: string; label: string; dash?: string }> = {
  cash: { color: "var(--accent)", label: "Cash" },
  asset: { color: "var(--token)", label: "Asset / security" },
  collateral: { color: "var(--warn)", label: "Collateral" },
  info: { color: "var(--faint)", label: "Instruction / data", dash: "5 4" },
  risk: { color: "var(--track-reg)", label: "Risk / credit event", dash: "2 3" },
};

const W = 860;
const ROW = 50;
const PHASE_H = 30;
const TOP = 86;

export function FlowDiagram({ product }: { product: Product }) {
  const [step, setStep] = useState<number | null>(null);
  const parties = product.parties;
  const flows = product.flows;

  const colX = (id: string) => {
    const i = parties.findIndex((p) => p.id === id);
    const n = Math.max(parties.length, 2);
    const left = 80;
    const right = W - 80;
    return left + (i / (n - 1)) * (right - left);
  };

  // Lay out rows, inserting a header row whenever the phase changes.
  type Row = { kind: "phase"; label: string; y: number } | { kind: "flow"; index: number; y: number };
  const rows: Row[] = [];
  let y = TOP;
  let phase = "";
  flows.forEach((f, index) => {
    if (f.phase !== phase) {
      phase = f.phase;
      rows.push({ kind: "phase", label: f.phase, y });
      y += PHASE_H;
    }
    rows.push({ kind: "flow", index, y });
    y += ROW;
  });
  const H = y + 16;

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-2xl border border-line bg-surface">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface-2/60 px-5 py-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">How it works</p>
          <h3 className="text-[15px] font-semibold text-ink">{product.name}: flow of cash and assets</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setStep((s) => (s === null ? 0 : Math.max(0, s - 1)))}
            className="rounded-lg border border-line px-2.5 py-1.5 text-[12px] font-medium text-muted hover:text-ink"
          >
            ‹ Prev
          </button>
          <button
            type="button"
            onClick={() => setStep((s) => (s === null ? 0 : s + 1 >= flows.length ? null : s + 1))}
            className="rounded-lg border border-line px-2.5 py-1.5 text-[12px] font-medium text-muted hover:text-ink"
          >
            {step === null ? "Step through" : step + 1 >= flows.length ? "Show all" : "Next ›"}
          </button>
        </div>
      </header>

      <div className="overflow-x-auto px-3 py-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[640px]" role="img" aria-label={`${product.name} flow diagram`}>
          <defs>
            {Object.entries(KIND).map(([k, v]) => (
              <marker key={k} id={`arrow-${product.slug}-${k}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill={v.color} />
              </marker>
            ))}
          </defs>

          {/* lifelines */}
          {parties.map((p) => (
            <g key={p.id}>
              <line x1={colX(p.id)} y1={62} x2={colX(p.id)} y2={H - 8} stroke="var(--line)" strokeWidth={1.5} />
              <rect x={colX(p.id) - 68} y={14} width={136} height={p.sub ? 42 : 32} rx={8} fill="var(--surface-2)" stroke="var(--line)" />
              <text x={colX(p.id)} y={p.sub ? 32 : 34} textAnchor="middle" fontSize="12.5" fontWeight="600" fill="var(--ink)">
                {p.label.length > 20 ? p.label.slice(0, 19) + "…" : p.label}
              </text>
              {p.sub ? (
                <text x={colX(p.id)} y={46} textAnchor="middle" fontSize="10.5" fill="var(--muted)">
                  {p.sub}
                </text>
              ) : null}
            </g>
          ))}

          {/* rows */}
          {rows.map((r, i) => {
            if (r.kind === "phase") {
              return (
                <g key={`p${i}`}>
                  <line x1={20} y1={r.y + 12} x2={W - 20} y2={r.y + 12} stroke="var(--line)" strokeDasharray="2 5" />
                  <rect x={20} y={r.y} width={r.label.length * 7.2 + 18} height={22} rx={11} fill="var(--bg)" />
                  <text x={30} y={r.y + 15} fontSize="11" fontWeight="600" fill="var(--faint)" letterSpacing="0.06em">
                    {r.label.toUpperCase()}
                  </text>
                </g>
              );
            }
            const f = flows[r.index];
            const k = KIND[f.kind];
            const x1 = colX(f.from);
            const x2 = colX(f.to);
            const active = step === null || step === r.index;
            const self = f.from === f.to;
            return (
              <g key={`f${i}`} opacity={active ? 1 : 0.18} style={{ transition: "opacity .25s" }}>
                {self ? (
                  <path
                    d={`M${x1},${r.y + 26} c 46,-6 46,26 0,20`}
                    fill="none"
                    stroke={k.color}
                    strokeWidth={2}
                    strokeDasharray={k.dash}
                    markerEnd={`url(#arrow-${product.slug}-${f.kind})`}
                  />
                ) : (
                  <line
                    x1={x1 + Math.sign(x2 - x1) * 4}
                    y1={r.y + 30}
                    x2={x2 - Math.sign(x2 - x1) * 10}
                    y2={r.y + 30}
                    stroke={k.color}
                    strokeWidth={2.25}
                    strokeDasharray={k.dash}
                    markerEnd={`url(#arrow-${product.slug}-${f.kind})`}
                  />
                )}
                <text
                  x={self ? x1 + 60 : (x1 + x2) / 2}
                  y={r.y + 22}
                  textAnchor={self ? "start" : "middle"}
                  fontSize="12"
                  fill="var(--ink)"
                  fontWeight={step === r.index ? 700 : 500}
                >
                  {f.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <footer className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-line px-5 py-2.5">
        {Object.entries(KIND).map(([k, v]) => (
          <span key={k} className="flex items-center gap-1.5 text-[11.5px] text-muted">
            <span className="h-0.5 w-4 rounded" style={{ background: v.color }} />
            {v.label}
          </span>
        ))}
        {step !== null ? (
          <span className="ml-auto font-mono text-[11.5px] text-accent">
            Step {step + 1} / {flows.length}
          </span>
        ) : null}
      </footer>
    </figure>
  );
}

export function RiskBars({ risk }: { risk: Product["risk"] }) {
  const items: [string, number][] = [
    ["Credit risk", risk.credit],
    ["Market risk", risk.market],
    ["Illiquidity", risk.liquidity],
    ["Complexity", risk.complexity],
  ];
  return (
    <div className="space-y-2.5">
      {items.map(([label, v]) => (
        <div key={label} className="flex items-center gap-3">
          <span className="w-24 shrink-0 text-[12.5px] text-muted">{label}</span>
          <span className="flex gap-1" aria-label={`${label}: ${v} of 5`}>
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className="h-2.5 w-6 rounded-sm"
                style={{
                  background:
                    i <= v
                      ? v >= 4
                        ? "var(--bad)"
                        : v === 3
                          ? "var(--warn)"
                          : "var(--token)"
                      : "var(--surface-2)",
                }}
              />
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}
