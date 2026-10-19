import Link from "next/link";
import { LearningLanding } from "@/components/LearningLanding";
import { CoverageFindings } from "@/components/rl1/Coverage";
import { EcosystemStack3D } from "@/components/rl1/EcosystemStack3D";
import { topics, tracks } from "@/content";
import { products } from "@/content/products";
import { RL1_AS_OF, entities } from "@/content/rl1";
import { universe } from "@/content/universe";
import { CATEGORIES } from "@/content/universe-taxonomy";

const HUB_LINKS = [
  ["/ecosystem#roster", "Who's in"],
  ["/ecosystem#positioning", "SWIAT, Dfns, Kaleido, Anchorage"],
  ["/ecosystem#coverage", "Coverage by category"],
  ["/ecosystem#geography", "3D globe"],
  ["/ecosystem#blind-spots", "Blind spots"],
  ["/ecosystem#database", "Database"],
];

export default function Home() {
  const founding = entities.filter((e) => e.rel === "founding").length;
  const validators = entities.filter((e) => e.validator || e.rel === "validator").length;
  const countries = new Set(universe.map((r) => r.cc).filter(Boolean)).size;
  const minutes = topics.reduce((s, t) => s + t.minutes, 0);

  return (
    <>
      {/* Two pillars */}
      <section className="relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 md:pt-20">
          <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-accent">RL1 Ecosystem Hub</p>
          <h1 className="mt-3 max-w-4xl font-serif text-[2.6rem] font-medium leading-[1.05] tracking-tight text-ink sm:text-6xl">
            Map the RL1 ecosystem.
            <br />
            <span className="italic text-token">Learn the plumbing underneath.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-muted">
            Two halves of one hub: a sourced, categorised model of Regulated Layer One and the {universe.length.toLocaleString()} institutions around it, and a
            free curriculum on the money markets, bonds, custody and settlement it is built to tokenise.
          </p>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <Pillar
              kicker="Ecosystem"
              title="Regulated Layer One, mapped"
              text="Members, validators, operator, vendors, regulators, settlement assets and competing networks on the Access / Service / Asset / Platform stack, with evidence grades and blind spots."
              stats={[
                [universe.length.toLocaleString(), "institutions"],
                [String(founding), "founding members"],
                [String(validators), "validators"],
                [String(CATEGORIES.length), "categories"],
              ]}
              primary={["/ecosystem", "Explore the ecosystem"]}
              secondary={["/ecosystem#database", "Open the database"]}
            />
            <Pillar
              kicker="Learning platform"
              title="Finance fundamentals × tokenization"
              text="Repo, securities lending, money market funds, bonds, custody, clearing and settlement, each explained from first principles and linked to its tokenized counterpart."
              stats={[
                [String(topics.length), "lessons"],
                [String(tracks.length), "tracks"],
                [String(products.length), "products"],
                [`${Math.round(minutes / 60)}h`, "of reading"],
              ]}
              primary={["/learn", "Start the curriculum"]}
              secondary={["#learn", "Jump to learning"]}
            />
          </div>
        </div>
      </section>

      {/* RL1 in 3D */}
      <section id="ecosystem" className="scroll-mt-16 border-t border-line">
        <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-3xl">
              <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-accent">Ecosystem · snapshot {RL1_AS_OF}</p>
              <h2 className="mt-2 font-serif text-4xl font-medium tracking-tight text-ink">RL1 and everyone around it, in 3D</h2>
              <p className="mt-3 text-[16px] leading-relaxed text-muted">
                RL1 sits on the platform layer; the planes above and below show who issues, settles, holds keys, supervises and could join. Zoom in, search
                any of the {universe.length.toLocaleString()} institutions in {countries} countries, or run a flow.
              </p>
            </div>
            <Link href="/ecosystem" className="text-[14px] font-semibold text-accent hover:underline">
              Full ecosystem hub →
            </Link>
          </div>
        </div>
        <div className="relative left-1/2 mt-6 w-screen -translate-x-1/2 px-4 sm:px-6">
          <div className="mx-auto max-w-[1720px]">
            <EcosystemStack3D />
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6">
          <h3 className="font-serif text-2xl text-ink">What the data says</h3>
          <div className="mt-4">
            <CoverageFindings />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {HUB_LINKS.map(([href, label]) => (
              <Link key={href} href={href} className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-[13px] font-medium text-ink hover:border-accent/50">
                {label} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Learning platform */}
      <LearningLanding />
    </>
  );
}

function Pillar({
  kicker,
  title,
  text,
  stats,
  primary,
  secondary,
}: {
  kicker: string;
  title: string;
  text: string;
  stats: [string, string][];
  primary: [string, string];
  secondary: [string, string];
}) {
  return (
    <article className="flex flex-col rounded-2xl border border-line bg-surface p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)]">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">{kicker}</p>
      <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight text-ink">{title}</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">{text}</p>
      <dl className="mt-5 grid grid-cols-4 gap-3 border-y border-line py-4">
        {stats.map(([v, l]) => (
          <div key={l}>
            <dt className="sr-only">{l}</dt>
            <dd className="font-serif text-2xl text-ink">{v}</dd>
            <dd className="text-[12px] text-muted">{l}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href={primary[0]} className="rounded-xl bg-ink px-4 py-2.5 text-[14px] font-semibold text-bg transition hover:opacity-90">
          {primary[1]}
        </Link>
        <Link href={secondary[0]} className="rounded-xl border border-line px-4 py-2.5 text-[14px] font-semibold text-ink transition hover:border-accent/50">
          {secondary[1]}
        </Link>
      </div>
    </article>
  );
}
