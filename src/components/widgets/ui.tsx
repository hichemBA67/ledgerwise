"use client";

import type { ReactNode } from "react";

export function WidgetShell({
  title,
  kicker,
  children,
}: {
  title: string;
  kicker: string;
  children: ReactNode;
}) {
  return (
    <section className="not-prose my-8 overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_1px_0_rgba(0,0,0,0.02)]">
      <header className="flex items-center justify-between gap-3 border-b border-line bg-surface-2/60 px-5 py-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">{kicker}</p>
          <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
        </div>
        <span className="rounded-full border border-line px-2.5 py-1 text-[11px] font-medium text-muted">Interactive</span>
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-2 text-[13px]">
        <span className="text-muted">{label}</span>
        <span className="font-mono font-medium tabular-nums text-ink">{format(value)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1.5 w-full"
      />
    </label>
  );
}

export function Stat({
  label,
  value,
  tone = "ink",
  hint,
}: {
  label: string;
  value: string;
  tone?: "ink" | "accent" | "token" | "warn" | "good" | "bad";
  hint?: string;
}) {
  const color = {
    ink: "text-ink",
    accent: "text-accent",
    token: "text-token",
    warn: "text-warn",
    good: "text-good",
    bad: "text-bad",
  }[tone];
  return (
    <div className="rounded-xl border border-line bg-bg/60 px-3.5 py-3">
      <p className="text-[12px] text-muted">{label}</p>
      <p className={`mt-0.5 font-mono text-lg font-semibold tabular-nums ${color}`}>{value}</p>
      {hint ? <p className="mt-0.5 text-[11px] text-faint">{hint}</p> : null}
    </div>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex flex-wrap rounded-lg border border-line bg-surface-2 p-0.5 text-[13px]">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`rounded-md px-3 py-1.5 font-medium transition ${
            value === o.value ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export const money = (v: number, ccy = "$") => {
  const abs = Math.abs(v);
  const sign = v < 0 ? "–" : "";
  if (abs >= 1e9) return `${sign}${ccy}${(abs / 1e9).toFixed(2)}bn`;
  if (abs >= 1e6) return `${sign}${ccy}${(abs / 1e6).toFixed(2)}m`;
  if (abs >= 1e3) return `${sign}${ccy}${(abs / 1e3).toFixed(1)}k`;
  return `${sign}${ccy}${abs.toFixed(2)}`;
};

export const pct = (v: number, d = 2) => `${v.toFixed(d)}%`;
