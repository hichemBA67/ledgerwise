"use client";

import { useState } from "react";
import type { Jurisdiction } from "@/content/types";

type Dim = { key: string; label: string; group: "Traditional" | "Tokenization" };

export function CompareExplorer({ jurisdictions, dimensions }: { jurisdictions: Jurisdiction[]; dimensions: Dim[] }) {
  const [selected, setSelected] = useState<string[]>(() => jurisdictions.map((j) => j.id));
  const [group, setGroup] = useState<"All" | "Traditional" | "Tokenization">("All");
  const [view, setView] = useState<"table" | "cards">("table");

  const cols = jurisdictions.filter((j) => selected.includes(j.id));
  const dims = dimensions.filter((d) => group === "All" || d.group === group);

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? (s.length > 1 ? s.filter((x) => x !== id) : s) : [...s, id]));
  }

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {jurisdictions.map((j) => {
            const on = selected.includes(j.id);
            return (
              <button
                key={j.id}
                type="button"
                onClick={() => toggle(j.id)}
                aria-pressed={on}
                className={`rounded-full border px-3 py-1.5 text-[13px] font-medium transition ${
                  on ? "border-accent/50 bg-accent-soft text-ink" : "border-line text-faint hover:text-ink"
                }`}
              >
                {j.flag} {j.name}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2">
          <Seg value={group} onChange={setGroup} options={["All", "Traditional", "Tokenization"]} />
          <Seg value={view} onChange={setView} options={["table", "cards"]} />
        </div>
      </div>

      {view === "table" ? (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full border-collapse text-left text-[13.5px] leading-snug" style={{ minWidth: 220 + cols.length * 210 }}>
            <thead>
              <tr className="border-b border-line">
                <th className="sticky left-0 z-10 w-[200px] bg-surface px-4 py-3" />
                {cols.map((j) => (
                  <th key={j.id} className="px-4 py-3 align-bottom">
                    <span className="text-2xl">{j.flag}</span>
                    <span className="mt-1 block text-[14px] font-semibold text-ink">{j.name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dims.map((d, i) => {
                const firstToken = d.group === "Tokenization" && dims[i - 1]?.group !== "Tokenization";
                return (
                  <tr key={d.key} className={`border-b border-line/70 last:border-0 ${firstToken && group === "All" ? "border-t-2 border-t-token/40" : ""}`}>
                    <th scope="row" className="sticky left-0 z-10 bg-surface px-4 py-3 align-top">
                      <span className={`text-[11px] font-semibold uppercase tracking-wider ${d.group === "Tokenization" ? "text-token" : "text-faint"}`}>
                        {d.group === "Tokenization" ? "◈ " : ""}
                        {d.group}
                      </span>
                      <span className="mt-0.5 block text-[13.5px] font-semibold text-ink">{d.label}</span>
                    </th>
                    {cols.map((j) => (
                      <td key={j.id} className="px-4 py-3 align-top text-ink/85">
                        {j.rows[d.key]}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {cols.map((j) => (
            <article key={j.id} className="rounded-2xl border border-line bg-surface p-6">
              <header className="flex items-center gap-3">
                <span className="text-3xl">{j.flag}</span>
                <h3 className="font-serif text-2xl text-ink">{j.name}</h3>
              </header>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {j.highlights.map((h) => (
                  <span key={h} className="rounded-full bg-token-soft px-2.5 py-1 text-[12px] font-medium text-token">
                    {h}
                  </span>
                ))}
              </div>
              <dl className="mt-4 divide-y divide-line/70">
                {dims.map((d) => (
                  <div key={d.key} className="grid grid-cols-[140px_1fr] gap-3 py-2 text-[13.5px]">
                    <dt className={`font-medium ${d.group === "Tokenization" ? "text-token" : "text-muted"}`}>{d.label}</dt>
                    <dd className="text-ink/85">{j.rows[d.key]}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function Seg<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: T[] }) {
  return (
    <div className="inline-flex rounded-lg border border-line bg-surface-2 p-0.5 text-[13px]">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`rounded-md px-3 py-1.5 font-medium capitalize transition ${value === o ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"}`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
