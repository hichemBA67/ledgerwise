"use client";

import { useState } from "react";
import { entities } from "@/content/rl1";
import { categoryLabel, macroOf, universe } from "@/content/universe";
import type { URecord } from "@/content/universe-taxonomy";

const relOf = Object.fromEntries(entities.map((e) => [e.id, e.rel]));
const IN_RL1 = new Set(["platform", "founding", "joining", "supporter", "observer", "operator", "validator"]);

const SCOPES: { id: string; label: string; note: string; test: (r: URecord) => boolean }[] = [
  { id: "all", label: "Whole universe", note: "Every institution in the database", test: () => true },
  { id: "high", label: "Potential members", note: "Membership fit high: euro-area significant banks, EEA CSDs, CCPs, custodians and EMT issuers", test: (r) => r.fit === "high" },
  { id: "rl1", label: "Inside RL1", note: "Members, joining, supporters, observers, operator and validators", test: (r) => !!r.core && IN_RL1.has(relOf[r.core]) },
  { id: "banks", label: "Banks", note: "Significant, less significant and non-euro banks", test: (r) => macroOf(r.cat) === "banks" },
  { id: "fmi", label: "Market infrastructure", note: "CSDs, CCPs, venues, DLT FMIs, custodians", test: (r) => macroOf(r.cat) === "fmi" },
  { id: "crypto", label: "Crypto & on-chain", note: "CASPs, EMT issuers, CEXs, dApps, chains, digital custody", test: (r) => macroOf(r.cat) === "crypto" },
];

function count(list: URecord[], key: (r: URecord) => string, top: number) {
  const m = new Map<string, URecord[]>();
  for (const r of list) m.set(key(r), [...(m.get(key(r)) ?? []), r]);
  const sorted = [...m.entries()].map(([k, v]) => ({ k, v })).sort((a, b) => b.v.length - a.v.length || a.k.localeCompare(b.k));
  if (sorted.length <= top) return sorted;
  const rest = sorted.slice(top);
  return [...sorted.slice(0, top), { k: `Other (${rest.length})`, v: rest.flatMap((x) => x.v) }];
}

function Bars({ title, rows, total }: { title: string; rows: { k: string; v: URecord[] }[]; total: number }) {
  const max = Math.max(1, ...rows.map((r) => r.v.length));
  const [hover, setHover] = useState<string | null>(null);
  return (
    <figure className="rounded-2xl border border-line bg-surface p-5">
      <figcaption className="text-[14px] font-semibold text-ink">{title}</figcaption>
      <ul className="mt-4 space-y-1.5">
        {rows.map((r) => {
          const pct = Math.round((r.v.length / total) * 100);
          return (
            <li key={r.k} className="relative grid grid-cols-[minmax(0,11rem)_1fr_4.5rem] items-center gap-3" onMouseEnter={() => setHover(r.k)} onMouseLeave={() => setHover(null)}>
              <span className="truncate text-[13px] text-muted" title={r.k}>
                {r.k}
              </span>
              <span className="h-4">
                <span className="block h-full rounded-r-[4px]" style={{ width: `${(r.v.length / max) * 100}%`, background: "var(--rl1-bar)", opacity: hover && hover !== r.k ? 0.45 : 1 }} />
              </span>
              <span className="text-right font-mono text-[12px] text-ink">
                {r.v.length} <span className="text-faint">{pct}%</span>
              </span>
              {hover === r.k ? (
                <span className="pointer-events-none absolute left-44 top-6 z-10 max-w-sm rounded-lg border border-line bg-surface px-3 py-2 text-[12px] text-ink shadow-lg">
                  {r.v
                    .slice(0, 12)
                    .map((e) => e.name)
                    .join(", ")}
                  {r.v.length > 12 ? ` and ${r.v.length - 12} more` : ""}
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </figure>
  );
}

export function Distribution() {
  const [scope, setScope] = useState("all");
  const s = SCOPES.find((x) => x.id === scope)!;
  const list = universe.filter(s.test);
  const located = list.filter((r) => r.country);
  const countries = new Set(located.map((r) => r.country)).size;
  const de = located.filter((r) => r.cc === "DE").length;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5" role="tablist">
        {SCOPES.map((x) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            aria-selected={scope === x.id}
            onClick={() => setScope(x.id)}
            className={`rounded-full border px-3 py-1 text-[13px] font-medium transition ${scope === x.id ? "border-ink bg-ink text-bg" : "border-line text-muted hover:text-ink"}`}
          >
            {x.label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-[13px] text-faint">{s.note}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <Stat value={list.length.toLocaleString()} label="institutions in scope" />
        <Stat value={String(countries)} label="countries (HQ)" />
        <Stat value={`${Math.round((de / Math.max(1, located.length)) * 100)}%`} label="of located ones in Germany" />
        <Stat value={String(list.length - located.length)} label="on-chain, no HQ" />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Bars title="By country of headquarters (top 18)" rows={count(list, (r) => r.country || "On-chain (no HQ)", 18)} total={list.length} />
        <Bars title="By category" rows={count(list, (r) => categoryLabel[r.cat], 20)} total={list.length} />
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface px-5 py-4">
      <div className="font-serif text-4xl text-ink">{value}</div>
      <div className="mt-1 text-[13px] text-muted">{label}</div>
    </div>
  );
}
