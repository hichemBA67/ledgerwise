import Link from "next/link";
import { PlayerLogo } from "@/components/PlayerLogo";
import { ContinueLink, ProgressBar } from "@/components/ProgressControls";
import { topics, topicsForTrack, tracks } from "@/content";
import { glossary } from "@/content/glossary";
import { jurisdictions } from "@/content/jurisdictions";
import { playerById, players } from "@/content/players";
import { milestones } from "@/content/timeline";

const bridges = [
  { from: "Repo", fromSlug: "repo", to: "Intraday tokenized repo", toSlug: "tokenized-repo-and-collateral" },
  { from: "Money market funds", fromSlug: "money-market-funds", to: "Tokenized MMFs (BUIDL, BENJI)", toSlug: "tokenized-money-market-funds" },
  { from: "Bonds", fromSlug: "bonds-basics", to: "Digital-native bonds", toSlug: "tokenized-bonds" },
  { from: "Custody", fromSlug: "custody", to: "Key management & MPC custody", toSlug: "digital-asset-custody" },
  { from: "Settlement (T+1)", fromSlug: "settlement-and-csds", to: "Atomic T+0 settlement", toSlug: "atomic-settlement-and-dlt-fmi" },
  { from: "Bank money", fromSlug: "money-and-banking", to: "Stablecoins, deposit tokens, wCBDC", toSlug: "stablecoins-and-tokenized-cash" },
  { from: "Collateral management", fromSlug: "collateral-management", to: "24/7 collateral mobility", toSlug: "tokenized-repo-and-collateral" },
];

const wallIds = ["bny", "statestreet", "jpmorgan", "euroclear", "clearstream", "dtcc", "lch", "blackrock", "franklin", "goldman", "hsbc", "ubs", "securitize", "circle", "broadridge", "sdx", "fidelity", "citi", "bnpparibas", "coinbase", "fireblocks", "ecb", "fed", "mas"];

export default function Home() {
  const order = topics.map((t) => ({ slug: t.slug, title: t.title }));
  const totalMinutes = topics.reduce((s, t) => s + t.minutes, 0);
  const widgets = new Set(topics.flatMap((t) => t.blocks.filter((b) => b.type === "widget").map((b) => (b.type === "widget" ? b.kind : "")))).size;
  const recent = [...milestones].filter((m) => m.year >= 2024 && m.year <= 2025).slice(-4);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-[12px] font-medium text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-token" /> Finance fundamentals × tokenization
            </p>
            <h1 className="mt-6 font-serif text-[2.6rem] font-medium leading-[1.05] tracking-tight text-ink sm:text-6xl">
              Learn the plumbing of finance.
              <br />
              <span className="italic text-token">Then see it rebuilt on-chain.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted">
              Repo, securities lending, money market funds, bonds, custody, clearing and settlement, each explained from first principles and linked to its tokenized counterpart, with real players, global comparisons and hands-on calculators.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ContinueLink order={order} />
              <Link href="/compare" className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 text-[15px] font-semibold text-ink transition hover:border-accent/50">
                Global comparison
              </Link>
            </div>
            <div className="mt-8 max-w-sm">
              <ProgressBar slugs={order.map((o) => o.slug)} color="var(--token)" />
            </div>
          </div>

          {/* Bridge map */}
          <div className="rounded-2xl border border-line bg-surface p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)]">
            <div className="mb-3 grid grid-cols-[1fr_28px_1fr] items-center px-1 text-[11px] font-semibold uppercase tracking-[0.14em]">
              <span className="text-muted">Traditional</span>
              <span />
              <span className="text-token">Tokenized</span>
            </div>
            <ul className="space-y-1.5">
              {bridges.map((b) => (
                <li key={b.from} className="grid grid-cols-[1fr_28px_1fr] items-center gap-0">
                  <Link href={`/learn/${b.fromSlug}`} className="rounded-lg border border-line bg-bg px-3 py-2.5 text-[13.5px] font-medium text-ink transition hover:border-accent/50">
                    {b.from}
                  </Link>
                  <span className="relative mx-auto block h-px w-full bg-line" aria-hidden>
                    <span className="absolute -top-[3px] right-0 h-[7px] w-[7px] rotate-45 border-r border-t border-token" />
                  </span>
                  <Link href={`/learn/${b.toSlug}`} className="rounded-lg border border-token/30 bg-token-soft px-3 py-2.5 text-[13.5px] font-medium text-ink transition hover:border-token">
                    {b.to}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-line bg-surface/50">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 sm:px-6 md:grid-cols-5">
          {[
            [topics.length, "lessons"],
            [`${Math.round(totalMinutes / 60)}h`, "of content"],
            [widgets, "interactive tools"],
            [players.length, "market players"],
            [glossary.length, "glossary terms"],
          ].map(([v, l]) => (
            <div key={l as string} className="py-6">
              <dt className="sr-only">{l}</dt>
              <dd className="font-serif text-3xl text-ink">{v}</dd>
              <dd className="text-[13px] text-muted">{l}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Tracks */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHead kicker="Curriculum" title="Six tracks, one mental model" text="Start with the foundations or jump into any track. Every traditional lesson links to its tokenized counterpart." href="/learn" cta="See the full curriculum" />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tracks.map((t, i) => {
            const list = topicsForTrack(t.id);
            return (
              <Link key={t.id} href={`/learn#${t.id}`} className="group flex flex-col rounded-2xl border border-line bg-surface p-6 transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl text-lg text-bg" style={{ background: t.color }}>
                    {t.icon}
                  </span>
                  <span className="font-mono text-[11px] text-faint">TRACK {i + 1}</span>
                </div>
                <h3 className="mt-5 font-serif text-2xl font-medium text-ink">{t.title}</h3>
                <p className="mt-2 flex-1 text-[14px] leading-relaxed text-muted">{t.description}</p>
                <p className="mt-4 text-[12.5px] text-faint">
                  {list.length} lessons · {list.reduce((s, x) => s + x.minutes, 0)} min
                </p>
                <div className="mt-3">
                  <ProgressBar slugs={list.map((x) => x.slug)} color={t.color} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Compare preview */}
      <section className="border-y border-line bg-surface/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <SectionHead kicker="Global comparison" title="Eight markets, side by side" text="Settlement cycles, CSDs, CCPs, benchmarks, MMF rules, stablecoin regimes and flagship tokenization projects." href="/compare" cta="Open the comparison" />
          <div className="mt-10 overflow-x-auto rounded-2xl border border-line bg-surface">
            <table className="w-full min-w-[760px] text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-line bg-surface-2/60">
                  <th className="px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-muted">Market</th>
                  <th className="px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-muted">Settlement</th>
                  <th className="px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-muted">Benchmark</th>
                  <th className="px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-token">Stablecoin regime</th>
                </tr>
              </thead>
              <tbody>
                {jurisdictions.map((j) => (
                  <tr key={j.id} className="border-b border-line/70 last:border-0">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-ink">
                      <span className="mr-2">{j.flag}</span>
                      {j.name}
                    </td>
                    <td className="px-4 py-3 text-ink/80">{j.rows.settlement}</td>
                    <td className="px-4 py-3 text-ink/80">{j.rows.rfr}</td>
                    <td className="px-4 py-3 text-ink/80">{j.rows.stablecoin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Players wall */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHead kicker="Major players" title="Who runs the rails" text="Custodians, CSDs, CCPs, dealers, asset managers, tokenization platforms, stablecoin issuers and regulators, with what each is building." href="/players" cta="Browse all players" />
        <div className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {wallIds.map((id) => {
            const p = playerById.get(id)!;
            return (
              <Link key={id} href={`/players?focus=${id}`} className="flex flex-col items-center gap-2 rounded-xl border border-line bg-surface p-4 text-center transition hover:border-accent/50">
                <PlayerLogo name={p.name} domain={p.domain} size={44} />
                <span className="line-clamp-1 text-[12px] font-medium text-ink">{p.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Timeline preview */}
      <section className="border-t border-line bg-surface/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <SectionHead kicker="Timeline" title="Tokenization is already happening" text="From the World Bank's bond-i in 2018 to BUIDL, the GENIUS Act and the ECB's Pontes." href="/timeline" cta="See all milestones" />
          <ol className="mt-10 grid gap-4 md:grid-cols-4">
            {recent.map((m) => (
              <li key={m.title} className="rounded-2xl border border-line bg-surface p-5">
                <p className="font-mono text-[12px] text-token">{m.date}</p>
                <p className="mt-2 font-medium leading-snug text-ink">{m.title}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">{m.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}

function SectionHead({ kicker, title, text, href, cta }: { kicker: string; title: string; text: string; href: string; cta: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-2xl">
        <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-accent">{kicker}</p>
        <h2 className="mt-2 font-serif text-4xl font-medium tracking-tight text-ink">{title}</h2>
        <p className="mt-3 text-[16px] leading-relaxed text-muted">{text}</p>
      </div>
      <Link href={href} className="text-[14px] font-semibold text-accent hover:underline">
        {cta} →
      </Link>
    </div>
  );
}
