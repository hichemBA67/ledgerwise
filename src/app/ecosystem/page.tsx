import type { Metadata } from "next";
import { PlayerLogo } from "@/components/PlayerLogo";
import { Coverage, CoverageFindings, SourcesTable } from "@/components/rl1/Coverage";
import { Distribution } from "@/components/rl1/Distribution";
import { EcosystemStack3D } from "@/components/rl1/EcosystemStack3D";
import { MemberGlobe3D } from "@/components/rl1/MemberGlobe3D";
import { Rl1Database } from "@/components/rl1/Rl1Database";
import { universe, universeSources } from "@/content/universe";
import { CATEGORIES } from "@/content/universe-taxonomy";
import { LAYERS, RL1_AS_OF, SOURCES, blindSpots, entities, positions, type Rl1Entity } from "@/content/rl1";

export const metadata: Metadata = {
  title: "RL1 ecosystem",
  description:
    "Regulated Layer One in 3D: members, validators, operator, vendors, regulators and competing networks, how they interact, where they are, and what the map leaves out.",
};

const byId = Object.fromEntries(entities.map((e) => [e.id, e])) as Record<string, Rl1Entity>;

const ROSTER: { title: string; note: string; ids: string[] }[] = [
  { title: "Founding members", note: "Equal-vote SCE members since 28 Jul 2026", ids: entities.filter((e) => e.rel === "founding").map((e) => e.id) },
  { title: "Joining", note: "Phase-1 participant, listed 'joining soon'", ids: ["natwest"] },
  { title: "Supporters & observers", note: "Back the network without a member vote", ids: ["kfw", "lbank", "vbank", "imf"] },
  { title: "Validators", note: "The eight nodes listed on rl1.network", ids: ["swiat", "dekabank", "lbbw", "scventures", "adesso", "gft", "nttdata", "soprasteria"] },
];

const SECTIONS = [
  ["stack", "3D stack"],
  ["roster", "Who's in"],
  ["positioning", "Positioning"],
  ["geography", "Geography"],
  ["coverage", "Coverage"],
  ["distribution", "Distribution"],
  ["blind-spots", "Blind spots"],
  ["database", "Database"],
  ["method", "Method"],
];

export default function Rl1Page() {
  const founding = entities.filter((e) => e.rel === "founding");
  const foundingCountries = new Set(founding.map((e) => e.country)).size;
  const prospects = entities.filter((e) => e.rel === "prospect");
  const prospectCountries = [...new Set(prospects.map((e) => e.country))].sort();
  const uCountries = new Set(universe.map((r) => r.cc).filter(Boolean)).size;
  const registerSources = universeSources.filter((s) => !["rl1-core", "players", "curated", "gleif", "geonames"].includes(s.id)).length;
  const highFit = universe.filter((r) => r.fit === "high").length;
  const memberCountries = new Set(entities.filter((e) => ["founding", "joining"].includes(e.rel)).map((e) => e.country));

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <header className="max-w-3xl">
        <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-accent">RL1 Ecosystem Hub · snapshot {RL1_AS_OF}</p>
        <h1 className="mt-2 font-serif text-5xl font-medium tracking-tight text-ink sm:text-6xl">Regulated Layer One, mapped</h1>
        <p className="mt-4 text-[17px] leading-relaxed text-muted">
          RL1 is the platform layer: a bank-owned, permissioned ledger run as a European Cooperative Society in Luxembourg. On top of it sit the asset,
          service and access layers (the ASAP stack), resting on supervisors and central-bank money. This hub maps every institution that builds, runs,
          uses or could join it ({universe.length.toLocaleString()} institutions in {uCountries} countries, from {registerSources} public datasets published by the ECB, ESMA and DefiLlama,
          plus a labelled curated layer), how they connect, and where the map has holes.
        </p>
        <p className="mt-3 text-[13px] text-faint">Independent research. Not affiliated with or endorsed by the RL1 cooperative, SWIAT or any institution shown.</p>
      </header>

      <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          ["10", `founding members in ${foundingCountries} countries`],
          ["8", "validator nodes, 6 in Germany"],
          ["€700m+", "settled in 50+ transactions since 2023"],
          ["21 Sep 2026", "Pontes live: central bank money via SWIAT"],
          [universe.length.toLocaleString(), `institutions in ${CATEGORIES.length} categories, ${uCountries} countries`],
          [String(highFit), `potential members (membership fit high); ${prospects.length} named prospects`],
        ].map(([v, l]) => (
          <div key={l} className="rounded-2xl border border-line bg-surface px-5 py-4">
            <div className="font-serif text-3xl text-ink">{v}</div>
            <div className="mt-1 text-[13px] leading-snug text-muted">{l}</div>
          </div>
        ))}
      </div>

      <nav aria-label="On this page" className="sticky top-16 z-30 -mx-4 mt-8 flex gap-1 overflow-x-auto border-y border-line bg-bg/90 px-4 py-2 backdrop-blur sm:mx-0 sm:rounded-xl sm:border">
        {SECTIONS.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-medium text-muted hover:bg-surface hover:text-ink">
            {label}
          </a>
        ))}
      </nav>

      <Section id="stack" kicker="Mental model · ASAP stack" title="Ten planes, one ledger">
        <p>
          The layering follows the Access, Service, Asset and Platform model from MAS&apos;s Project Guardian work on interoperable networks, split one level
          deeper and set on a governance foundation. RL1 is the platform. Institutions that play several roles appear once per layer (↳), linked by a
          dashed line. Zoom in to reveal every label, isolate a layer, or run a flow to watch a deal travel through the stack, including the ones that have
          no route today.
        </p>
      </Section>
      <div className="relative left-1/2 mt-6 w-screen -translate-x-1/2 px-4 sm:px-6">
        <div className="mx-auto max-w-[1720px]">
          <EcosystemStack3D />
        </div>
      </div>
      <div className="mt-8 grid gap-3 md:grid-cols-3 xl:grid-cols-5">
        {(["Access", "Service", "Asset", "Platform", "Governance"] as const).map((a) => (
          <div key={a} className="rounded-2xl border border-line bg-surface p-4">
            <p className="font-mono text-[11px] uppercase tracking-wider text-accent">{a}</p>
            {LAYERS.filter((l) => l.asap === a)
              .reverse()
              .map((l) => (
                <div key={l.id} className="mt-2">
                  <p className="text-[14px] font-semibold text-ink">
                    {l.label} <span className="font-mono text-[12px] font-normal text-faint">{entities.filter((e) => e.layer === l.id).length}</span>
                  </p>
                  <p className="text-[12.5px] leading-snug text-muted">{l.question}</p>
                </div>
              ))}
          </div>
        ))}
      </div>

      <Section id="roster" kicker="Full list" title="Who is in, and in what capacity">
        <p>
          Membership, node operation and support are three different things. Only three founders also run validators; four validators are IT firms that
          are not members. Below them, every relevant institution that is not in RL1.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {ROSTER.map((r) => (
            <div key={r.title} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-[15px] font-semibold text-ink">{r.title}</h3>
                <span className="font-mono text-[13px] text-faint">{r.ids.length}</span>
              </div>
              <p className="text-[13px] text-muted">{r.note}</p>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {r.ids.map((id) => {
                  const e = byId[id];
                  return (
                    <li key={id} className="flex items-center gap-2.5">
                      <PlayerLogo name={e.name} domain={e.domain} size={30} />
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-semibold text-ink">{e.name}</span>
                        <span className="block truncate text-[12px] text-muted">
                          {e.type} · {e.country}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-[15px] font-semibold text-ink">Relevant institutions not in RL1</h3>
            <span className="font-mono text-[13px] text-faint">{prospects.length}</span>
          </div>
          <p className="text-[13px] text-muted">
            All Qivalis euro-stablecoin banks not already in RL1, plus Pontes participants and other European majors. Countries in bold have no RL1 member
            at all.
          </p>
          <div className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
            {prospectCountries.map((c) => (
              <div key={c}>
                <p className={`text-[12px] uppercase tracking-wide ${memberCountries.has(c) ? "text-faint" : "font-bold text-ink"}`}>{c}</p>
                <ul className="mt-1.5 space-y-1.5">
                  {prospects
                    .filter((e) => e.country === c)
                    .map((e) => (
                      <li key={e.id} className="flex items-center gap-2">
                        <PlayerLogo name={e.name} domain={e.domain} size={22} />
                        <span className="truncate text-[13px] text-ink">{e.name}</span>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="positioning" kicker="Infrastructure players" title="Where SWIAT, Dfns, Kaleido and Anchorage sit">
        <p>
          Same ecosystem, different distances from the ledger. Proximity runs from 0 (no route today) to 3 (inside the network). None of the three outside
          vendors has an announced RL1 integration; the gaps they would fill are listed under blind spots.
        </p>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {[...positions].sort((a, b) => b.linkLevel - a.linkLevel).map((p) => {
            const e = byId[p.id];
            return (
              <article key={p.id} className="rounded-2xl border border-line bg-surface p-5">
                <div className="flex items-center gap-3">
                  <PlayerLogo name={e.name} domain={e.domain} size={40} />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif text-2xl leading-tight text-ink">{e.name}</h3>
                    <p className="text-[13px] text-muted">
                      {p.layer} · {e.city}, {e.country}
                    </p>
                  </div>
                  <div className="text-right" aria-label={`Proximity to RL1: ${p.linkLevel} of 3`}>
                    <div className="flex gap-1">
                      {[1, 2, 3].map((i) => (
                        <span key={i} className={`h-2.5 w-5 rounded-sm ${i <= p.linkLevel ? "bg-accent" : "bg-surface-2"}`} />
                      ))}
                    </div>
                    <div className="mt-1 font-mono text-[11px] text-faint">proximity {p.linkLevel}/3</div>
                  </div>
                </div>
                <dl className="mt-4 grid gap-2.5 text-[14px]">
                  {[
                    ["Sells", p.sells],
                    ["Proof points", p.proof],
                    ["Link to RL1 today", p.link],
                    ["Where it plugs in", p.plugIn],
                    ["Tension", p.tension],
                  ].map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[8.5rem_1fr] gap-3">
                      <dt className="text-[12px] font-semibold uppercase tracking-wide text-faint">{k}</dt>
                      <dd className="leading-snug text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            );
          })}
        </div>
      </Section>

      <Section id="coverage" kicker="Categorised and transparent" title="Coverage: how much of the ecosystem RL1 touches">
        <p>
          Every institution sits in exactly one of {CATEGORIES.length} categories, each mapped to an ASAP layer and a membership-fit rule. &ldquo;Inside RL1&rdquo;
          means member, joining, supporter, observer, operator or validator; &ldquo;linked&rdquo; means a sourced or graded relationship in the detailed map.
          Everything else is the addressable ecosystem RL1 has not reached.
        </p>
        <div className="mt-6">
          <CoverageFindings />
        </div>
        <div className="mt-6">
          <Coverage />
        </div>
      </Section>

      <Section id="geography" kicker="3D globe" title="Geographic footprint">
        <p>
          A European network with a German core. Switch to the whole universe to see where the {universe.length.toLocaleString()} institutions sit, and how far
          the ecosystem reaches beyond RL1&apos;s members.
        </p>
        <div className="mt-6">
          <MemberGlobe3D />
        </div>
      </Section>

      <Section id="distribution" kicker="By country and type" title="Distribution">
        <p>Switch scope to compare the whole universe, the potential-member pool, what is already inside RL1, or one part of the ecosystem.</p>
        <div className="mt-6">
          <Distribution />
        </div>
      </Section>

      <Section id="blind-spots" kicker="What the map leaves out" title="Blind spots">
        <p>Each is a gap between what RL1 says it is for and who or what is actually in place, with the question to put to RL1 or its members.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {blindSpots.map((b) => (
            <article key={b.title} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${b.severity === "high" ? "border-bad text-bad" : b.severity === "medium" ? "border-warn text-warn" : "border-faint text-faint"}`}
                >
                  <span aria-hidden>{b.severity === "high" ? "▲" : b.severity === "medium" ? "■" : "●"}</span>
                  {b.severity}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-faint">{b.lens}</span>
              </div>
              <h3 className="mt-2 font-serif text-xl text-ink">{b.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{b.text}</p>
              <p className="mt-3 rounded-xl bg-surface-2 p-3 text-[13px] leading-relaxed text-ink">
                <span className="font-semibold">Ask: </span>
                {b.ask}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="database" kicker="Every institution" title="Database">
        <p>
          All {universe.length.toLocaleString()} institutions. Filter by category, layer, country, membership fit, source or RL1 link; open a row for its
          register reference, LEI, sources and (where mapped) its RL1 role and connections; export the filtered view, the full universe or the relationships
          as CSV.
        </p>
        <div className="mt-6">
          <Rl1Database />
        </div>
      </Section>

      <Section id="method" kicker="How this was built" title="Method and sources">
        <p>
          Every entity and relationship carries an evidence grade. <strong className="text-ink">Confirmed</strong>: stated by RL1, SWIAT, the ECB or the
          entity itself. <strong className="text-ink">Reported</strong>: stated by trade press or listed without detail.{" "}
          <strong className="text-ink">Inferred</strong>: our reading of public facts, such as competitive overlaps or plausible integrations; nothing
          inferred should be quoted as fact. The technical stack (client, consensus, privacy) is not public and is not guessed here.
        </p>
        <p>
          The universe is rebuilt with <code className="rounded bg-surface-2 px-1.5 py-0.5 text-[13px]">npm run universe</code>, which downloads each register,
          applies the inclusion rule below, resolves legal names and HQ cities through GLEIF, geocodes with GeoNames and de-duplicates by LEI and normalised
          name (an institution found in several sources keeps every source). Membership fit is a rule per category and jurisdiction, not a judgement on
          individual institutions. Curated rows are compiled, not register-verified, and are labelled as such.
        </p>
        <div className="mt-6">
          <SourcesTable />
        </div>
        <p className="mt-6">Sources for the detailed RL1 map:</p>
        <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
          {Object.values(SOURCES).map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer" className="text-[14px] text-accent hover:underline">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

function Section({ id, kicker, title, children }: { id: string; kicker: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-16 scroll-mt-32">
      <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-accent">{kicker}</p>
      <h2 className="mt-1 font-serif text-4xl font-medium tracking-tight text-ink">{title}</h2>
      <div className="mt-3 text-[16px] leading-relaxed text-muted [&>p]:max-w-3xl">{children}</div>
    </section>
  );
}
