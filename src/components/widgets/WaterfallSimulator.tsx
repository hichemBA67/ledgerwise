"use client";

import { useState } from "react";
import { Slider, WidgetShell, money } from "./ui";

const LAYERS = [
  { label: "Defaulter's initial margin", size: 800, color: "var(--track-fixed)" },
  { label: "Defaulter's default fund contribution", size: 150, color: "var(--track-infra)" },
  { label: "CCP skin-in-the-game", size: 60, color: "var(--track-money)" },
  { label: "Non-defaulters' default fund", size: 900, color: "var(--track-reg)" },
  { label: "Assessments / recovery tools", size: 500, color: "var(--faint)" },
];

export function WaterfallSimulator() {
  const [loss, setLoss] = useState(900);
  const rows = LAYERS.map((l, i) => {
    const before = LAYERS.slice(0, i).reduce((s, x) => s + x.size, 0);
    return { ...l, used: Math.min(l.size, Math.max(0, loss - before)) };
  });
  const remaining = Math.max(0, loss - LAYERS.reduce((s, x) => s + x.size, 0));
  const mutualised = rows[3].used + rows[4].used;

  return (
    <WidgetShell kicker="CCP default waterfall" title="Who pays when a clearing member defaults?">
      <Slider label="Close-out loss on defaulter's portfolio" value={loss} min={0} max={2600} step={10} onChange={setLoss} format={(v) => money(v * 1e6)} />
      <ul className="mt-5 space-y-2.5">
        {rows.map((r, i) => (
          <li key={r.label}>
            <div className="flex justify-between text-[13px]">
              <span className="text-ink">
                <span className="mr-2 font-mono text-faint">{i + 1}</span>
                {r.label}
              </span>
              <span className="font-mono tabular-nums text-muted">
                {money(r.used * 1e6)} / {money(r.size * 1e6)}
              </span>
            </div>
            <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full transition-all duration-300" style={{ width: `${(r.used / r.size) * 100}%`, background: r.color }} />
            </div>
          </li>
        ))}
      </ul>
      <p className={`mt-4 text-[13px] font-medium ${remaining > 0 ? "text-bad" : mutualised > 0 ? "text-warn" : "text-good"}`}>
        {remaining > 0
          ? `Waterfall exhausted, ${money(remaining * 1e6)} uncovered: recovery or resolution of the CCP.`
          : mutualised > 0
            ? `Loss mutualised: surviving members absorb ${money(mutualised * 1e6)}.`
            : "Defaulter pays: the loss is covered by the defaulter's own resources."}
      </p>
    </WidgetShell>
  );
}
