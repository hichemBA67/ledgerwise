"use client";

import { useState } from "react";
import { Segmented, Slider, Stat, WidgetShell, money } from "./ui";

type Cycle = "t2" | "t1" | "t0";

const CYCLES: Record<
  Cycle,
  {
    label: string;
    hours: number;
    netting: boolean;
    steps: { at: number; label: string }[];
    note: string;
  }
> = {
  t2: {
    label: "T+2 (EU/UK today)",
    hours: 48,
    netting: true,
    steps: [
      { at: 0, label: "Trade" },
      { at: 0.2, label: "Allocation & confirm" },
      { at: 0.55, label: "CCP netting" },
      { at: 1, label: "CSD settlement (DvP)" },
    ],
    note: "Two days of counterparty exposure, but the CCP nets thousands of trades into a few payments.",
  },
  t1: {
    label: "T+1 (US since 2024)",
    hours: 24,
    netting: true,
    steps: [
      { at: 0, label: "Trade" },
      { at: 0.15, label: "Same-day affirmation" },
      { at: 0.5, label: "CCP netting" },
      { at: 1, label: "CSD settlement (DvP)" },
    ],
    note: "Half the exposure window and lower margin, but ops teams must affirm on trade date and FX funding gets tight.",
  },
  t0: {
    label: "Atomic T+0 (DLT)",
    hours: 0,
    netting: false,
    steps: [
      { at: 0, label: "Trade" },
      { at: 0.5, label: "Smart contract checks" },
      { at: 1, label: "Atomic swap: token ↔ cash" },
    ],
    note: "No exposure window and no fails, but every trade must be pre-funded gross: netting benefits are lost.",
  },
};

export function SettlementSimulator() {
  const [cycle, setCycle] = useState<Cycle>("t1");
  const [volume, setVolume] = useState(10_000_000_000);
  const [nettingPct, setNettingPct] = useState(95);
  const c = CYCLES[cycle];
  const cashNeed = c.netting ? volume * (1 - nettingPct / 100) : volume;
  const baselineNeed = volume * (1 - nettingPct / 100);

  return (
    <WidgetShell kicker="Settlement simulator" title="T+2 vs T+1 vs atomic settlement">
      <Segmented
        value={cycle}
        onChange={setCycle}
        options={(Object.keys(CYCLES) as Cycle[]).map((k) => ({ value: k, label: CYCLES[k].label }))}
      />

      <div className="mt-6">
        <div className="relative h-2 rounded-full bg-surface-2">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
            style={{
              width: cycle === "t0" ? "4%" : `${(c.hours / 48) * 100}%`,
              background: cycle === "t0" ? "var(--token)" : "var(--warn)",
            }}
          />
        </div>
        <div className="mt-1 flex justify-between font-mono text-[11px] text-faint">
          <span>Trade date</span>
          <span>+24h</span>
          <span>+48h</span>
        </div>
        <ol className="mt-5 grid gap-2 sm:grid-cols-4">
          {c.steps.map((s, i) => (
            <li key={s.label} className="flex items-start gap-2 rounded-lg border border-line bg-bg/60 p-2.5 text-[13px]">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft font-mono text-[11px] font-semibold text-accent">
                {i + 1}
              </span>
              <span className="text-ink">{s.label}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="space-y-4">
          <Slider label="Daily traded volume" value={volume} min={1_000_000_000} max={100_000_000_000} step={1_000_000_000} onChange={setVolume} format={(v) => money(v)} />
          <Slider label="CCP netting efficiency" value={nettingPct} min={50} max={99} step={1} onChange={setNettingPct} format={(v) => `${v}%`} />
        </div>
        <div className="grid grid-cols-2 content-start gap-3">
          <Stat label="Counterparty exposure window" value={c.hours ? `${c.hours}h` : "0 (atomic)"} tone={c.hours ? "warn" : "token"} />
          <Stat label="Principal settlement risk" value={cycle === "t0" ? "None" : "DvP-protected"} tone="good" />
          <Stat label="Cash needed to settle" value={money(cashNeed)} tone={c.netting ? "accent" : "bad"} hint={c.netting ? "After netting" : "Gross: no netting"} />
          <Stat label="vs netted baseline" value={`${(cashNeed / baselineNeed).toFixed(1)}×`} tone={c.netting ? "ink" : "bad"} />
        </div>
      </div>
      <p className="mt-4 text-[13px] leading-relaxed text-muted">{c.note}</p>
    </WidgetShell>
  );
}
