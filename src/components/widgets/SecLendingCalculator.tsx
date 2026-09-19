"use client";

import { useState } from "react";
import { Segmented, Slider, Stat, WidgetShell, money, pct } from "./ui";

export function SecLendingCalculator() {
  const [coll, setColl] = useState<"noncash" | "cash">("noncash");
  const [loan, setLoan] = useState(50_000_000);
  const [feeBps, setFeeBps] = useState(35);
  const [reinvest, setReinvest] = useState(4.4);
  const [rebate, setRebate] = useState(4.1);
  const [days, setDays] = useState(30);
  const [split, setSplit] = useState(80);
  const [margin, setMargin] = useState(102);

  const gross =
    coll === "noncash"
      ? loan * (feeBps / 10000) * (days / 360)
      : loan * ((reinvest - rebate) / 100) * (days / 360);
  const owner = gross * (split / 100);
  const agent = gross - owner;
  const collateral = loan * (margin / 100);

  return (
    <WidgetShell kicker="Securities lending" title="What does a lender actually earn?">
      <div className="mb-4">
        <Segmented
          value={coll}
          onChange={setColl}
          options={[
            { value: "noncash", label: "Non-cash collateral (fee)" },
            { value: "cash", label: "Cash collateral (rebate)" },
          ]}
        />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-4">
          <Slider label="Loan value" value={loan} min={1_000_000} max={500_000_000} step={1_000_000} onChange={setLoan} format={(v) => money(v)} />
          {coll === "noncash" ? (
            <Slider label="Lending fee" value={feeBps} min={5} max={500} step={5} onChange={setFeeBps} format={(v) => `${v} bps${v >= 200 ? " (hard-to-borrow)" : v <= 25 ? " (GC)" : ""}`} />
          ) : (
            <>
              <Slider label="Cash reinvestment yield" value={reinvest} min={0} max={6} step={0.05} onChange={setReinvest} format={(v) => pct(v)} />
              <Slider label="Rebate paid to borrower" value={rebate} min={-2} max={6} step={0.05} onChange={setRebate} format={(v) => pct(v)} />
            </>
          )}
          <Slider label="Loan term" value={days} min={1} max={180} step={1} onChange={setDays} format={(v) => `${v} days`} />
          <Slider label="Beneficial owner share" value={split} min={50} max={95} step={5} onChange={setSplit} format={(v) => `${v}/${100 - v}`} />
          <Slider label="Collateral margin" value={margin} min={100} max={110} step={1} onChange={setMargin} format={(v) => `${v}%`} />
        </div>
        <div className="grid grid-cols-2 content-start gap-3">
          <Stat label="Gross revenue" value={money(gross)} tone={gross < 0 ? "bad" : "accent"} />
          <Stat label="Beneficial owner" value={money(owner)} tone={owner < 0 ? "bad" : "token"} />
          <Stat label="Agent lender" value={money(agent)} />
          <Stat label="Collateral required" value={money(collateral)} hint={`${margin}% of loan value`} />
        </div>
      </div>
      <p className="mt-4 text-[13px] leading-relaxed text-muted">
        {coll === "cash"
          ? "Cash collateral: the spread between reinvestment yield and rebate is the income. A negative rebate means the stock is 'hot': the borrower effectively pays to borrow it. If reinvestment losses exceed the spread, the lender loses money (AIG, 2008)."
          : "Non-cash collateral: the borrower pays an explicit fee. General collateral stocks earn a few bps; hard-to-borrow names can earn hundreds."}
      </p>
    </WidgetShell>
  );
}
