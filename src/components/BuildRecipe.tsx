"use client";

import Link from "next/link";
import type { BuildRecipe as Recipe } from "@/content/types";
import { resetChecklist, toggleStep, useChecked } from "@/lib/checklist";
import { PlayerLogo } from "./PlayerLogo";

const PHASE: Record<string, { label: string; color: string }> = {
  legal: { label: "Legal", color: "var(--track-reg)" },
  ledger: { label: "Ledger", color: "var(--track-fixed)" },
  identity: { label: "Identity", color: "var(--track-markets)" },
  cash: { label: "Cash leg", color: "var(--track-money)" },
  custody: { label: "Custody", color: "var(--track-infra)" },
  lifecycle: { label: "Lifecycle", color: "var(--track-token)" },
  interop: { label: "Interop", color: "var(--track-foundations)" },
  controls: { label: "Controls", color: "var(--faint)" },
};

export function BuildRecipe({
  slug,
  recipe,
  players,
}: {
  slug: string;
  recipe: Recipe;
  players: Record<string, { name: string; domain: string }>;
}) {
  const checked = useChecked(slug);
  const done = recipe.steps.filter((s) => checked.includes(s.id)).length;
  const pct = Math.round((done / recipe.steps.length) * 100);

  return (
    <section id="build" className="scroll-mt-24 overflow-hidden rounded-2xl border border-token/30 bg-surface">
      <header className="border-b border-token/25 bg-token-soft px-6 py-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-token">◈ Build it tokenized</p>
            <h2 className="mt-1 font-serif text-[26px] leading-tight text-ink">{recipe.goal}</h2>
          </div>
          <div className="text-right">
            <p className="font-mono text-[13px] tabular-nums text-ink">
              {done}/{recipe.steps.length} steps
            </p>
            <div className="mt-1.5 h-1.5 w-28 overflow-hidden rounded-full bg-surface">
              <div className="h-full rounded-full bg-token transition-all" style={{ width: `${pct}%` }} />
            </div>
            {done > 0 ? (
              <button type="button" onClick={() => resetChecklist(slug)} className="mt-1.5 text-[11.5px] text-muted hover:text-ink">
                Reset
              </button>
            ) : null}
          </div>
        </div>

        {recipe.prereqs.length ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">You need first</span>
            {recipe.prereqs.map((p) =>
              p.product ? (
                <Link
                  key={p.label}
                  href={`/products/${p.product}`}
                  className="rounded-full border border-line bg-surface px-2.5 py-1 text-[12.5px] font-medium text-ink hover:border-token"
                >
                  {p.label} ↗
                </Link>
              ) : (
                <span key={p.label} className="rounded-full border border-line bg-surface px-2.5 py-1 text-[12.5px] text-muted">
                  {p.label}
                </span>
              ),
            )}
          </div>
        ) : null}
      </header>

      <ol className="divide-y divide-line">
        {recipe.steps.map((step, i) => {
          const on = checked.includes(step.id);
          const phase = PHASE[step.id] ?? { label: step.id, color: "var(--muted)" };
          return (
            <li key={step.id} className={`px-6 py-5 transition ${on ? "bg-token-soft/30" : ""}`}>
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={() => toggleStep(slug, step.id)}
                  aria-pressed={on}
                  aria-label={`Mark "${step.title}" as done`}
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-[13px] font-bold transition ${
                    on ? "border-token bg-token text-bg" : "border-line bg-bg text-transparent hover:border-token/60"
                  }`}
                >
                  ✓
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11.5px] text-faint">STEP {i + 1}</span>
                    <span className="rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-bg" style={{ background: phase.color }}>
                      {phase.label}
                    </span>
                  </div>
                  <h3 className={`mt-1 text-[17px] font-semibold text-ink ${on ? "line-through opacity-60" : ""}`}>{step.title}</h3>
                  <ul className="mt-2 space-y-1.5">
                    {step.do.map((d) => (
                      <li key={d} className="flex gap-2.5 text-[14.5px] leading-relaxed text-ink/85">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {d}
                      </li>
                    ))}
                  </ul>
                  {step.decide ? (
                    <p className="mt-2.5 rounded-lg border border-line bg-bg px-3 py-2 text-[13.5px] leading-relaxed text-muted">
                      <span className="font-semibold text-ink">Key decision: </span>
                      {step.decide}
                    </p>
                  ) : null}
                  {step.watch ? (
                    <p className="mt-2 rounded-lg border border-warn/25 bg-warn-soft px-3 py-2 text-[13.5px] leading-relaxed text-ink/85">
                      <span className="font-semibold text-warn">Watch out: </span>
                      {step.watch}
                    </p>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <footer className="grid gap-3 border-t border-line bg-surface-2/40 p-6 md:grid-cols-2">
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-token">Minimum viable version</p>
          <p className="mt-1.5 text-[14px] leading-relaxed text-ink/85">{recipe.mvp}</p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-warn">The part that actually blocks you</p>
          <p className="mt-1.5 text-[14px] leading-relaxed text-ink/85">{recipe.hard}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">Who has already done it</p>
          <ul className="mt-2 space-y-2">
            {recipe.precedents.map((p) => (
              <li key={p.what} className="flex flex-wrap items-center gap-2 text-[14px] text-ink/85">
                <span className="flex gap-1">
                  {p.players.map((id) => {
                    const pl = players[id];
                    return pl ? <PlayerLogo key={id} name={pl.name} domain={pl.domain} size={22} /> : null;
                  })}
                </span>
                {p.what}
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </section>
  );
}
