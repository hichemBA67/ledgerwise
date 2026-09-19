"use client";

import { useState } from "react";
import { Segmented, Slider, Stat, WidgetShell, money, pct } from "./ui";

export function RepoCalculator() {
  const [mode, setMode] = useState<"overnight" | "intraday">("overnight");
  const [mv, setMv] = useState(100_000_000);
  const [haircut, setHaircut] = useState(2);
  const [rate, setRate] = useState(4.3);
  const [days, setDays] = useState(7);
  const [hours, setHours] = useState(4);

  const cash = mv * (1 - haircut / 100);
  const yearFrac = mode === "overnight" ? days / 360 : hours / 24 / 360;
  const interest = cash * (rate / 100) * yearFrac;
  const repurchase = cash + interest;

  return (
    <WidgetShell kicker="Repo calculator" title="Price a repo trade (ACT/360)">
      <div className="mb-4">
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: "overnight", label: "Term repo (days)" },
            { value: "intraday", label: "Tokenized intraday (hours)" },
          ]}
        />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-4">
          <Slider label="Collateral market value" value={mv} min={10_000_000} max={1_000_000_000} step={10_000_000} onChange={setMv} format={(v) => money(v)} />
          <Slider label="Haircut" value={haircut} min={0} max={15} step={0.5} onChange={setHaircut} format={(v) => pct(v, 1)} />
          <Slider label="Repo rate (annual)" value={rate} min={0} max={8} step={0.05} onChange={setRate} format={(v) => pct(v)} />
          {mode === "overnight" ? (
            <Slider label="Term" value={days} min={1} max={90} step={1} onChange={setDays} format={(v) => `${v} day${v > 1 ? "s" : ""}`} />
          ) : (
            <Slider label="Term" value={hours} min={1} max={12} step={1} onChange={setHours} format={(v) => `${v} hour${v > 1 ? "s" : ""}`} />
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 self-start">
          <Stat label="Cash lent (start leg)" value={money(cash)} tone="accent" />
          <Stat label="Repo interest" value={money(interest)} />
          <Stat label="Repurchase price (close leg)" value={money(repurchase)} tone="token" />
          <Stat label="Over-collateralisation" value={money(mv - cash)} hint="Protects the cash lender" />
        </div>
      </div>
      <p className="mt-4 text-[13px] leading-relaxed text-muted">
        Interest = cash × rate × {mode === "overnight" ? "days" : "hours ÷ 24"} ÷ 360.{" "}
        {mode === "intraday"
          ? "With atomic settlement, the unwind happens automatically at the agreed hour, which is impossible when repo settles in end-of-day batches."
          : "Switch to intraday mode to see how tokenized repo prices a loan of just a few hours."}
      </p>
    </WidgetShell>
  );
}
