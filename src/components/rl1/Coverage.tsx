import { entities } from "@/content/rl1";
import { MACROS, universe, universeSources } from "@/content/universe";
import { CATEGORY_BY_ID, NEAR_EU } from "@/content/universe-taxonomy";

const relOf = Object.fromEntries(entities.map((e) => [e.id, e.rel]));
const IN_RL1 = new Set(["platform", "founding", "joining", "supporter", "observer", "operator", "validator"]);

/** Category × relationship to RL1: how much of each part of the ecosystem RL1 actually touches. */
export function Coverage() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full min-w-[880px] text-left text-[13px]">
        <thead className="border-b border-line text-[12px] text-faint">
          <tr>
            <th className="px-4 py-2.5 font-medium">Category</th>
            <th className="px-3 py-2.5 text-right font-medium">Total</th>
            <th className="px-3 py-2.5 text-right font-medium">EEA + UK + CH</th>
            <th className="px-3 py-2.5 text-right font-medium">Inside RL1</th>
            <th className="px-3 py-2.5 text-right font-medium">Linked</th>
            <th className="w-[200px] px-3 py-2.5 font-medium">Share inside · linked · not touched</th>
            <th className="px-3 py-2.5 font-medium">Membership-fit rule</th>
          </tr>
        </thead>
        <tbody>
          {MACROS.map((m) => (
            <Group key={m.id} label={m.label} cats={m.cats} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Group({ label, cats }: { label: string; cats: (typeof MACROS)[number]["cats"] }) {
  return (
    <>
      <tr className="border-b border-line bg-surface-2/60">
        <td colSpan={7} className="px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider text-faint">
          {label}
        </td>
      </tr>
      {cats.map((c) => {
        const list = universe.filter((r) => r.cat === c);
        const inside = list.filter((r) => r.core && IN_RL1.has(relOf[r.core])).length;
        const linked = list.filter((r) => r.core && !IN_RL1.has(relOf[r.core])).length;
        const eu = list.filter((r) => NEAR_EU.has(r.cc)).length;
        const t = Math.max(1, list.length);
        return (
          <tr key={c} className="border-b border-line last:border-0">
            <td className="px-4 py-2 font-medium text-ink">{CATEGORY_BY_ID[c].label}</td>
            <td className="px-3 py-2 text-right font-mono text-ink">{list.length}</td>
            <td className="px-3 py-2 text-right font-mono text-muted">{eu}</td>
            <td className="px-3 py-2 text-right font-mono text-ink">{inside || "–"}</td>
            <td className="px-3 py-2 text-right font-mono text-muted">{linked || "–"}</td>
            <td className="px-3 py-2">
              <span className="flex h-3 w-full overflow-hidden rounded-[3px] bg-surface-2" title={`${inside} inside, ${linked} linked, ${list.length - inside - linked} not touched`}>
                <span style={{ width: `${(inside / t) * 100}%`, background: "var(--accent)" }} />
                <span style={{ width: `${(linked / t) * 100}%`, background: "color-mix(in srgb, var(--accent) 35%, var(--surface-2))" }} />
              </span>
            </td>
            <td className="px-3 py-2 text-[12px] leading-snug text-muted">{CATEGORY_BY_ID[c].fitRule}</td>
          </tr>
        );
      })}
    </>
  );
}

/** Provenance: every source, when it was fetched, how many rows it had, how many institutions it contributes. */
export function SourcesTable() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full min-w-[880px] text-left text-[13px]">
        <thead className="border-b border-line text-[12px] text-faint">
          <tr>
            <th className="px-4 py-2.5 font-medium">Source</th>
            <th className="px-3 py-2.5 font-medium">Fetched</th>
            <th className="px-3 py-2.5 text-right font-medium">Raw rows</th>
            <th className="px-3 py-2.5 text-right font-medium">Appears in</th>
            <th className="px-3 py-2.5 text-right font-medium">Only source</th>
            <th className="px-3 py-2.5 font-medium">Inclusion rule</th>
          </tr>
        </thead>
        <tbody>
          {universeSources.map((s) => {
            const appears = universe.filter((r) => r.srcs.includes(s.id)).length;
            const only = universe.filter((r) => r.srcs.length === 1 && r.srcs[0] === s.id).length;
            return (
              <tr key={s.id} className="border-b border-line align-top last:border-0">
                <td className="px-4 py-2.5">
                  <a href={s.url} target="_blank" rel="noreferrer" className="font-medium text-accent hover:underline">
                    {s.label}
                  </a>
                  <span className="block text-[12px] text-faint">{s.publisher}</span>
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 font-mono text-[12px] text-muted">{s.fetchedAt.slice(0, 10)}</td>
                <td className="px-3 py-2.5 text-right font-mono text-muted">{s.rows ? s.rows.toLocaleString() : "–"}</td>
                <td className="px-3 py-2.5 text-right font-mono text-ink">{appears || "–"}</td>
                <td className="px-3 py-2.5 text-right font-mono text-muted">{only || "–"}</td>
                <td className="px-3 py-2.5 text-[12px] leading-snug text-muted">{s.rule}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Headline gaps computed from the universe, so they stay true after every refresh. */
export function CoverageFindings() {
  const stat = (test: (r: (typeof universe)[number]) => boolean) => {
    const list = universe.filter(test);
    return {
      total: list.length,
      inside: list.filter((r) => r.core && IN_RL1.has(relOf[r.core])).length,
      linked: list.filter((r) => r.core && !IN_RL1.has(relOf[r.core])).length,
    };
  };
  const eu = (r: (typeof universe)[number]) => NEAR_EU.has(r.cc);
  const si = stat((r) => r.cat === "bank-si");
  const lsi = stat((r) => r.cat === "bank-lsi");
  const csd = stat((r) => r.cat === "csd" && eu(r));
  const ccp = stat((r) => r.cat === "ccp" && eu(r));
  const venue = stat((r) => r.cat === "venue" && eu(r));
  const casp = stat((r) => r.cat === "casp");
  const emt = stat((r) => r.cat === "emt" && eu(r));
  const dapp = stat((r) => r.cat === "dapp");
  const highOut = universe.filter((r) => r.fit === "high" && !(r.core && IN_RL1.has(relOf[r.core]))).length;
  const items = [
    `${si.inside} of ${si.total} significant euro-area banks are inside RL1; ${si.linked} more are linked (prospects, ecosystem). The rest have no visible relationship.`,
    `Only ${lsi.inside} of ${lsi.total} less significant euro-area banks in scope are inside RL1; most would reach it through central institutions such as DekaBank or DZ BANK.`,
    `${csd.inside + csd.linked} of ${csd.total} CSDs and ${ccp.inside + ccp.linked} of ${ccp.total} CCPs in the EEA, UK and Switzerland are inside or linked: post-trade infrastructure is ${csd.inside + csd.linked + ccp.inside + ccp.linked === 0 ? "entirely" : "almost entirely"} outside.`,
    `${venue.inside + venue.linked} of ${venue.total} European trading-venue operators ${venue.inside + venue.linked === 1 ? "is" : "are"} inside or linked; Seturion is the only settlement venue among the members.`,
    `${casp.inside + casp.linked} of ${casp.total} MiCA-authorised crypto-asset service providers and ${emt.inside} of ${emt.total} European e-money-token issuers are inside RL1 (${emt.linked} EMT issuers are linked as adjacent).`,
    `${dapp.total} public-chain dApp providers hold the on-chain liquidity; none connects to RL1.`,
    `${highOut} institutions with a high membership fit are not in RL1: the core pipeline for the cooperative.`,
  ];
  return (
    <ul className="grid gap-2 md:grid-cols-2">
      {items.map((t) => (
        <li key={t} className="rounded-xl border border-line bg-surface p-3 text-[14px] leading-relaxed text-ink">
          {t}
        </li>
      ))}
    </ul>
  );
}
