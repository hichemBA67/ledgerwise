import type { Metadata } from "next";
import Link from "next/link";
import { CompareExplorer } from "@/components/CompareExplorer";
import { dimensions, jurisdictions } from "@/content/jurisdictions";

export const metadata: Metadata = {
  title: "Global comparison",
  description: "US, EU, UK, Switzerland, Singapore, Hong Kong, Japan and UAE compared across market infrastructure and tokenization.",
};

const functions = [
  { fn: "Issuance", trad: "Bookrunners, prospectus, global note at a CSD/common depositary; T+5 closing", token: "Tokens minted on-chain into whitelisted wallets; T+0/T+1 closing", slug: "tokenized-bonds" },
  { fn: "Record of ownership", trad: "Layered books: CSD → custodian → sub-custodian → investor", token: "Shared ledger as golden source (native) or mirror (twin)", slug: "tokenization-101" },
  { fn: "Custody", trad: "Global custodians and sub-custody networks; asset servicing", token: "Key management (HSM/MPC), wallet whitelisting, node ops", slug: "digital-asset-custody" },
  { fn: "Clearing", trad: "CCP novation, multilateral netting, margin", token: "Pre-funded atomic trades; tokenized collateral for CCP margin", slug: "clearing-and-ccps" },
  { fn: "Settlement", trad: "DvP at CSD; T+1 (US) / T+2 (EU/UK until Oct 2027)", token: "Atomic DvP on-chain, 24/7, with same-ledger or linked cash", slug: "atomic-settlement-and-dlt-fmi" },
  { fn: "Cash leg", trad: "Central bank money via RTGS (Fedwire, T2, CHAPS)", token: "wCBDC, tokenized deposits, regulated stablecoins, RTGS triggers", slug: "stablecoins-and-tokenized-cash" },
  { fn: "Funding & collateral", trad: "Overnight+ repo, tri-party agents, sec lending", token: "Intraday repo, collateral mobility across entities in minutes", slug: "tokenized-repo-and-collateral" },
  { fn: "Funds", trad: "Transfer agent registers; daily NAV; T+1 subscriptions", token: "On-chain share registers; instant transfer; usable as collateral", slug: "tokenized-money-market-funds" },
];

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <header className="max-w-3xl">
        <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-accent">Global comparison</p>
        <h1 className="mt-2 font-serif text-5xl font-medium tracking-tight text-ink">Eight financial centres, side by side</h1>
        <p className="mt-4 text-[17px] leading-relaxed text-muted">
          Compare traditional market infrastructure and tokenization regimes. Toggle markets, switch between a table and cards, and filter to the tokenization rows.
        </p>
      </header>

      <div className="mt-10">
        <CompareExplorer jurisdictions={jurisdictions} dimensions={dimensions} />
      </div>

      <section className="mt-20">
        <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-token">Function by function</p>
        <h2 className="mt-2 font-serif text-4xl font-medium tracking-tight text-ink">Traditional vs tokenized rails</h2>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full min-w-[760px] text-left text-[14px] leading-snug">
            <thead>
              <tr className="border-b border-line bg-surface-2/60">
                <th className="px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-muted">Function</th>
                <th className="px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-muted">Traditional</th>
                <th className="px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-token">Tokenized</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {functions.map((f) => (
                <tr key={f.fn} className="border-b border-line/70 last:border-0">
                  <td className="px-4 py-3.5 font-semibold text-ink">{f.fn}</td>
                  <td className="px-4 py-3.5 text-ink/80">{f.trad}</td>
                  <td className="bg-token-soft/40 px-4 py-3.5 text-ink/90">{f.token}</td>
                  <td className="px-4 py-3.5 text-right">
                    <Link href={`/learn/${f.slug}`} className="whitespace-nowrap text-[13px] font-semibold text-accent hover:underline">
                      Lesson →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[12.5px] text-faint">
          Data reflects publicly announced frameworks and dates as of 2025–26. Regulation evolves quickly; check primary sources before relying on any row.
        </p>
      </section>
    </div>
  );
}
