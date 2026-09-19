"use client";

import { useMemo, useState } from "react";
import { Segmented, Slider, Stat, WidgetShell, pct } from "./ui";

function analytics(coupon: number, years: number, y: number, freq: number) {
  const n = Math.max(1, Math.round(years * freq));
  const c = (coupon / 100) * 100 / freq;
  const r = y / 100 / freq;
  let price = 0;
  let weighted = 0;
  for (let t = 1; t <= n; t++) {
    const cf = t === n ? c + 100 : c;
    const pv = cf / Math.pow(1 + r, t);
    price += pv;
    weighted += (t / freq) * pv;
  }
  const mac = weighted / price;
  const mod = mac / (1 + r);
  return { price, mac, mod, dv01: (mod * price) / 10000 };
}

export function BondCalculator() {
  const [coupon, setCoupon] = useState(4);
  const [years, setYears] = useState(10);
  const [yld, setYld] = useState(4.5);
  const [freq, setFreq] = useState<"1" | "2">("2");
  const f = Number(freq);
  const a = analytics(coupon, years, yld, f);

  const curve = useMemo(() => {
    const pts: [number, number][] = [];
    for (let y = 0; y <= 10; y += 0.25) pts.push([y, analytics(coupon, years, y, f).price]);
    return pts;
  }, [coupon, years, f]);

  const W = 320;
  const H = 170;
  const maxP = Math.max(...curve.map((p) => p[1]));
  const minP = Math.min(...curve.map((p) => p[1]));
  const x = (v: number) => 28 + (v / 10) * (W - 40);
  const yPx = (p: number) => 12 + (1 - (p - minP) / (maxP - minP || 1)) * (H - 36);
  const path = curve.map(([yy, p], i) => `${i ? "L" : "M"}${x(yy).toFixed(1)},${yPx(p).toFixed(1)}`).join(" ");
  const status = Math.abs(a.price - 100) < 0.05 ? "Par" : a.price > 100 ? "Premium" : "Discount";

  return (
    <WidgetShell kicker="Bond calculator" title="Price, duration & the price-yield curve">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Slider label="Coupon" value={coupon} min={0} max={10} step={0.25} onChange={setCoupon} format={(v) => pct(v)} />
          <Slider label="Maturity" value={years} min={1} max={30} step={1} onChange={setYears} format={(v) => `${v}y`} />
          <Slider label="Market yield (YTM)" value={yld} min={0} max={10} step={0.05} onChange={setYld} format={(v) => pct(v)} />
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-muted">Coupon frequency</span>
            <Segmented value={freq} onChange={setFreq} options={[{ value: "1", label: "Annual" }, { value: "2", label: "Semi-annual" }]} />
          </div>
        </div>
        <div>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Price versus yield curve">
            <line x1={28} y1={H - 24} x2={W - 12} y2={H - 24} stroke="var(--line)" />
            <line x1={28} y1={8} x2={28} y2={H - 24} stroke="var(--line)" />
            {minP < 100 && maxP > 100 ? (
              <>
                <line x1={28} x2={W - 12} y1={yPx(100)} y2={yPx(100)} stroke="var(--faint)" strokeDasharray="3 4" />
                <text x={W - 14} y={yPx(100) - 4} textAnchor="end" fontSize="10" fill="var(--faint)">par 100</text>
              </>
            ) : null}
            <path d={path} fill="none" stroke="var(--accent)" strokeWidth={2.25} />
            <circle cx={x(yld)} cy={yPx(a.price)} r={5} fill="var(--token)" stroke="var(--surface)" strokeWidth={2} />
            <text x={28} y={H - 8} fontSize="10" fill="var(--faint)">0%</text>
            <text x={W - 12} y={H - 8} fontSize="10" fill="var(--faint)" textAnchor="end">10% yield</text>
          </svg>
          <p className="text-center text-[12px] text-faint">Convex curve: prices rise faster than they fall</p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label={`Price (${status})`} value={a.price.toFixed(3)} tone={status === "Premium" ? "good" : status === "Discount" ? "bad" : "ink"} />
        <Stat label="Macaulay duration" value={`${a.mac.toFixed(2)}y`} />
        <Stat label="Modified duration" value={a.mod.toFixed(2)} tone="accent" hint="% move per 1% yield" />
        <Stat label="DV01 per 100" value={a.dv01.toFixed(4)} hint="Price change per 1bp" />
      </div>
    </WidgetShell>
  );
}
