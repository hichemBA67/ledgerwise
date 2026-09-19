import type { Metadata } from "next";
import Link from "next/link";
import { PlayerLogo } from "@/components/PlayerLogo";
import { playerById } from "@/content/players";
import { milestones } from "@/content/timeline";
import type { Milestone } from "@/content/types";

export const metadata: Metadata = {
  title: "Tokenization timeline",
  description: "Milestones in tokenized bonds, funds, repo, cash and regulation from 2017 to 2027.",
};

const kindColor: Record<Milestone["kind"], string> = {
  Bond: "var(--track-fixed)",
  Fund: "var(--track-money)",
  "Repo / Collateral": "var(--track-infra)",
  Cash: "var(--track-token)",
  Infrastructure: "var(--track-foundations)",
  Regulation: "var(--track-reg)",
};

export default function TimelinePage() {
  const years = [...new Set(milestones.map((m) => m.year))].sort();
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <header className="max-w-3xl">
        <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-accent">Timeline</p>
        <h1 className="mt-2 font-serif text-5xl font-medium tracking-tight text-ink">A decade of tokenization</h1>
        <p className="mt-4 text-[17px] leading-relaxed text-muted">From blockchain bond experiments to trillion-dollar repo ledgers and national stablecoin laws.</p>
        <div className="mt-6 flex flex-wrap gap-3 text-[12px]">
          {Object.entries(kindColor).map(([k, c]) => (
            <span key={k} className="flex items-center gap-1.5 text-muted">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
              {k}
            </span>
          ))}
        </div>
      </header>

      <div className="mt-12 space-y-12">
        {years.map((y) => (
          <section key={y} className="grid gap-4 md:grid-cols-[110px_1fr]">
            <h2 className="font-serif text-4xl text-ink md:sticky md:top-24 md:self-start">
              {y}
              {y >= 2026 ? <span className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-faint">Upcoming</span> : null}
            </h2>
            <ol className="relative space-y-4 border-l border-line pl-6">
              {milestones
                .filter((m) => m.year === y)
                .map((m) => (
                  <li key={m.title} className="relative">
                    <span className="absolute -left-[31px] top-5 h-3 w-3 rounded-full border-2 border-bg" style={{ background: kindColor[m.kind] }} />
                    <div className="rounded-2xl border border-line bg-surface p-5">
                      <div className="flex flex-wrap items-center gap-2 text-[12px]">
                        <span className="font-mono text-muted">{m.date}</span>
                        <span className="rounded-full px-2 py-0.5 font-medium text-bg" style={{ background: kindColor[m.kind] }}>
                          {m.kind}
                        </span>
                      </div>
                      <h3 className="mt-2 text-[17px] font-semibold text-ink">{m.title}</h3>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{m.text}</p>
                      {m.players?.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {m.players.map((id) => {
                            const p = playerById.get(id);
                            return p ? (
                              <Link key={id} href={`/players?focus=${id}`} className="flex items-center gap-1.5 rounded-full border border-line py-0.5 pl-0.5 pr-2.5 text-[12px] text-ink hover:border-accent/50">
                                <PlayerLogo name={p.name} domain={p.domain} size={20} />
                                {p.name}
                              </Link>
                            ) : null;
                          })}
                        </div>
                      ) : null}
                    </div>
                  </li>
                ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
