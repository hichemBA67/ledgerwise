"use client";

import Link from "next/link";
import { useState } from "react";
import type { FlowKind, Product } from "@/content/types";
import { PlayerLogo } from "./PlayerLogo";

const KIND: Record<FlowKind, { color: string; label: string; dash?: string }> = {
  cash: { color: "var(--accent)", label: "Cash" },
  asset: { color: "var(--token)", label: "Asset / security" },
  collateral: { color: "var(--warn)", label: "Collateral" },
  info: { color: "var(--faint)", label: "Instruction / data", dash: "6 5" },
  risk: { color: "var(--track-reg)", label: "Risk / credit event", dash: "2 4" },
};

const W = 780;
const GUTTER = 44;
const ROW = 62;
const PHASE_H = 34;
const HEAD_H = 66;

export function FlowDiagram({
  product,
  players,
}: {
  product: Product;
  players?: Record<string, { name: string; domain: string }>;
}) {
  const [step, setStep] = useState<number | null>(null);
  const { parties, flows } = product;

  const colX = (id: string) => {
    const i = Math.max(0, parties.findIndex((p) => p.id === id));
    const n = Math.max(parties.length, 2);
    const left = GUTTER + 72;
    const right = W - 72;
    return left + (i / (n - 1)) * (right - left);
  };

  type Row = { kind: "phase"; label: string; y: number } | { kind: "flow"; index: number; y: number };
  const rows: Row[] = [];
  let y = HEAD_H + 12;
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
  const H = y + 10;

  const cast = parties.filter((p) => p.example && players?.[p.example]);

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-2xl border border-line bg-surface">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface-2/60 px-5 py-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">Step by step</p>
          <h3 className="text-[15px] font-semibold text-ink">
            {product.name}: who pays whom, and what moves
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="mr-1 hidden text-[12px] text-muted sm:inline">
            {step === null ? `${flows.length} steps` : `Step ${step + 1} of ${flows.length}`}
          </span>
          <button
            type="button"
            onClick={() => setStep((s) => (s === null ? flows.length - 1 : Math.max(0, s - 1)))}
            className="rounded-lg border border-line px-2.5 py-1.5 text-[12px] font-medium text-muted transition hover:bg-bg hover:text-ink"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setStep((s) => (s === null ? 0 : s + 1 >= flows.length ? null : s + 1))}
            className="rounded-lg border border-line px-3 py-1.5 text-[12px] font-medium text-muted transition hover:bg-bg hover:text-ink"
          >
            {step === null ? "Walk through it" : step + 1 >= flows.length ? "Show all" : "Next ›"}
          </button>
        </div>
      </header>

      <div className="overflow-x-auto px-3 py-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[600px]" role="img" aria-label={`${product.name} flow diagram`}>
          <defs>
            {Object.entries(KIND).map(([k, v]) => (
              <marker key={k} id={`ar-${product.slug}-${k}`} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill={v.color} />
              </marker>
            ))}
          </defs>

          {/* party columns */}
          {parties.map((p) => {
            const x = colX(p.id);
            const ex = p.example ? players?.[p.example] : undefined;
            return (
              <g key={p.id}>
                <line x1={x} y1={HEAD_H} x2={x} y2={H - 6} stroke="var(--line)" strokeWidth={1.5} />
                <rect x={x - 72} y={8} width={144} height={HEAD_H - 16} rx={10} fill="var(--bg)" stroke="var(--line)" />
                <text x={x} y={p.sub || ex ? 28 : 34} textAnchor="middle" fontSize="13.5" fontWeight="700" fill="var(--ink)">
                  {trim(p.label, 20)}
                </text>
                {p.sub ? (
                  <text x={x} y={42} textAnchor="middle" fontSize="11.5" fill="var(--muted)">
                    {trim(p.sub, 22)}
                  </text>
                ) : null}
                {ex ? (
                  <text x={x} y={p.sub ? 54 : 44} textAnchor="middle" fontSize="11.5" fontWeight="600" fill="var(--accent)">
                    e.g. {trim(short(ex.name), 20)}
                  </text>
                ) : null}
              </g>
            );
          })}

          {rows.map((r, i) => {
            if (r.kind === "phase") {
              return (
                <g key={`p${i}`}>
                  <rect x={8} y={r.y + 4} width={W - 16} height={24} rx={6} fill="var(--surface-2)" opacity={0.75} />
                  <text x={20} y={r.y + 20} fontSize="11.5" fontWeight="700" fill="var(--muted)" letterSpacing="0.1em">
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
            const mid = self ? x1 + 70 : (x1 + x2) / 2;
            const yLine = r.y + 40;
            const chipW = Math.min(f.label.length * 7.2 + 20, 340);
            return (
              <g key={`f${i}`} opacity={active ? 1 : 0.16} style={{ transition: "opacity .25s" }}>
                {/* step number */}
                <circle cx={24} cy={yLine} r={13} fill={k.color} opacity={0.14} />
                <text x={24} y={yLine + 4.5} textAnchor="middle" fontSize="12.5" fontWeight="700" fill={k.color}>
                  {r.index + 1}
                </text>

                {self ? (
                  <path d={`M${x1},${yLine - 10} c 56,-4 56,24 0,20`} fill="none" stroke={k.color} strokeWidth={2.5} strokeDasharray={k.dash} markerEnd={`url(#ar-${product.slug}-${f.kind})`} />
                ) : (
                  <line
                    x1={x1 + Math.sign(x2 - x1) * 6}
                    y1={yLine}
                    x2={x2 - Math.sign(x2 - x1) * 12}
                    y2={yLine}
                    stroke={k.color}
                    strokeWidth={2.5}
                    strokeDasharray={k.dash}
                    markerEnd={`url(#ar-${product.slug}-${f.kind})`}
                  />
                )}

                {/* label on a chip so it never sits on a line */}
                <rect x={mid - chipW / 2} y={yLine - 31} width={chipW} height={24} rx={6} fill="var(--surface)" />
                <text x={mid} y={yLine - 14.5} textAnchor="middle" fontSize="13.5" fontWeight={step === r.index ? 700 : 500} fill="var(--ink)">
                  {trim(f.label, 44)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {cast.length ? (
        <div className="border-t border-line px-5 py-3">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">Who plays these roles in practice</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {cast.map((p) => {
              const ex = players![p.example!];
              return (
                <Link key={p.id} href={`/players?focus=${p.example}`} className="flex items-center gap-2 text-[12.5px] hover:opacity-80">
                  <PlayerLogo name={ex.name} domain={ex.domain} size={22} />
                  <span className="text-muted">{p.label}:</span>
                  <span className="font-semibold text-ink">{ex.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}

      <footer className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-line bg-surface-2/40 px-5 py-2.5">
        {Object.entries(KIND).map(([k, v]) => (
          <span key={k} className="flex items-center gap-1.5 text-[11.5px] text-muted">
            <span className="h-0.5 w-5 rounded" style={{ background: v.color }} />
            {v.label}
          </span>
        ))}
      </footer>
    </figure>
  );
}

const trim = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

/** Shorter labels so long institution names fit inside the party boxes. */
const SHORT: Record<string, string> = {
  "Norges Bank Investment Management": "Norges Bank IM",
  "Fidelity Investments": "Fidelity",
  "Kinexys by J.P. Morgan": "Kinexys (JPM)",
  "SG-FORGE (Société Générale)": "SG-FORGE",
  "Commonwealth Bank of Australia": "CBA",
  "European Investment Bank": "EIB",
  "Clearing Corporation of India": "CCIL",
  "Digital Asset (Canton)": "Digital Asset",
  "National Stock Exchange of India": "NSE India",
  "Korea Securities Depository": "KSD",
  "OCC (Comptroller of the Currency)": "OCC",
  "The Clearing House": "The Clearing House",
  "Monetary Authority of Singapore": "MAS",
  "Swiss National Bank": "SNB",
  "Banco Central do Brasil": "BCB",
  "Reserve Bank of Australia": "RBA",
  "Deutsche Bundesbank": "Bundesbank",
  "Sveriges Riksbank": "Riksbank",
  "SS&C Technologies": "SS&C",
  "Citadel Securities": "Citadel",
  "Federal Reserve": "the Fed",
  "European Central Bank": "ECB",
  "Bank of England": "Bank of England",
  "Standard Chartered": "StanChart",
  "Hamilton Lane": "Hamilton Lane",
  "Morningstar DBRS": "DBRS",
};

const short = (name: string) => SHORT[name] ?? name;

export function RiskBars({ risk }: { risk: Product["risk"] }) {
  const items: [string, number, string][] = [
    ["Credit risk", risk.credit, "Chance the other side doesn't pay"],
    ["Market risk", risk.market, "How much the price moves"],
    ["Illiquidity", risk.liquidity, "How hard it is to sell quickly"],
    ["Complexity", risk.complexity, "How much expertise it needs"],
  ];
  return (
    <div className="space-y-3">
      {items.map(([label, v, hint]) => (
        <div key={label}>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[13px] font-medium text-ink">{label}</span>
            <span className="flex gap-1" aria-label={`${label}: ${v} of 5`}>
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className="h-2.5 w-5 rounded-sm"
                  style={{
                    background: i <= v ? (v >= 4 ? "var(--bad)" : v === 3 ? "var(--warn)" : "var(--token)") : "var(--surface-2)",
                  }}
                />
              ))}
            </span>
          </div>
          <p className="mt-0.5 text-[11.5px] text-faint">{hint}</p>
        </div>
      ))}
    </div>
  );
}
