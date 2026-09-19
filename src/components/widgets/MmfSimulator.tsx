"use client";

import { useState } from "react";
import { Slider, Stat, WidgetShell, money, pct } from "./ui";

export function MmfSimulator() {
  const [aum, setAum] = useState(50_000_000_000);
  const [exposure, setExposure] = useState(1.2);
  const [recovery, setRecovery] = useState(40);
  const [dailyLiquid, setDailyLiquid] = useState(25);
  const [redemptions, setRedemptions] = useState(15);

  const loss = (exposure / 100) * (1 - recovery / 100);
  const shadowNav = 1 - loss;
  const broke = shadowNav < 0.995;
  const liquidityGap = redemptions - dailyLiquid;

  return (
    <WidgetShell kicker="MMF stress test" title="Will this fund break the buck?">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-4">
          <Slider label="Fund size" value={aum} min={1_000_000_000} max={200_000_000_000} step={1_000_000_000} onChange={setAum} format={(v) => money(v)} />
          <Slider label="Exposure to defaulting issuer" value={exposure} min={0} max={5} step={0.1} onChange={setExposure} format={(v) => pct(v, 1)} />
          <Slider label="Recovery rate" value={recovery} min={0} max={100} step={5} onChange={setRecovery} format={(v) => `${v}%`} />
          <Slider label="Daily liquid assets" value={dailyLiquid} min={10} max={60} step={1} onChange={setDailyLiquid} format={(v) => `${v}%`} />
          <Slider label="Redemptions on day 1" value={redemptions} min={0} max={60} step={1} onChange={setRedemptions} format={(v) => `${v}%`} />
        </div>
        <div className="space-y-3">
          <div
            className={`rounded-xl border p-4 text-center ${broke ? "border-bad/40 bg-warn-soft" : "border-token/40 bg-token-soft"}`}
          >
            <p className="text-[12px] text-muted">Shadow NAV per share</p>
            <p className={`font-mono text-4xl font-semibold tabular-nums ${broke ? "text-bad" : "text-token"}`}>
              ${shadowNav.toFixed(4)}
            </p>
            <p className="mt-1 text-[13px] font-medium text-ink">
              {broke ? "Broke the buck: rounds to $0.99" : "Holds $1.00 (within ½ cent)"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Credit loss" value={money(aum * loss)} tone="bad" />
            <Stat
              label="Liquidity gap"
              value={liquidityGap > 0 ? `${liquidityGap}% of AUM` : "Covered"}
              tone={liquidityGap > 0 ? "bad" : "good"}
              hint={liquidityGap > 0 ? "Must sell less-liquid assets" : "Paid from daily liquid assets"}
            />
          </div>
        </div>
      </div>
      <p className="mt-4 text-[13px] leading-relaxed text-muted">
        Reserve Primary Fund in 2008: roughly 1.2% in Lehman paper wiped out, NAV fell to $0.97 and ~$60bn of redemption requests arrived within days. The 2023 SEC rules raised daily/weekly liquid asset minimums to 25%/50%.
      </p>
    </WidgetShell>
  );
}
