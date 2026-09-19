import type { Metadata } from "next";
import Link from "next/link";
import { DoneDot, ProgressBar } from "@/components/ProgressControls";
import { topicsForTrack, tracks } from "@/content";

export const metadata: Metadata = {
  title: "Curriculum",
  description: "All tracks and lessons: foundations, money markets, bonds, market infrastructure, tokenization and regulation.",
};

const levelColor = { Beginner: "text-good", Intermediate: "text-accent", Advanced: "text-tip" } as const;

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <header className="max-w-3xl">
        <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-accent">Curriculum</p>
        <h1 className="mt-2 font-serif text-5xl font-medium tracking-tight text-ink">From money to tokenized markets</h1>
        <p className="mt-4 text-[17px] leading-relaxed text-muted">
          Tracks build on each other, but every lesson stands alone. Your progress is saved in this browser.
        </p>
      </header>

      <nav className="mt-10 flex flex-wrap gap-2" aria-label="Tracks">
        {tracks.map((t) => (
          <a key={t.id} href={`#${t.id}`} className="flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-[13px] font-medium text-ink hover:border-accent/50">
            <span className="h-2 w-2 rounded-full" style={{ background: t.color }} />
            {t.title}
          </a>
        ))}
      </nav>

      <div className="mt-12 space-y-16">
        {tracks.map((t, ti) => {
          const list = topicsForTrack(t.id);
          return (
            <section key={t.id} id={t.id} className="scroll-mt-24">
              <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
                <div className="lg:sticky lg:top-24 lg:self-start">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl text-lg text-bg" style={{ background: t.color }}>
                      {t.icon}
                    </span>
                    <span className="font-mono text-[11px] text-faint">TRACK {ti + 1}</span>
                  </div>
                  <h2 className="mt-4 font-serif text-3xl font-medium text-ink">{t.title}</h2>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{t.description}</p>
                  <div className="mt-4">
                    <ProgressBar slugs={list.map((x) => x.slug)} color={t.color} />
                  </div>
                </div>
                <ol className="grid gap-3 sm:grid-cols-2">
                  {list.map((topic, i) => (
                    <li key={topic.slug}>
                      <Link href={`/learn/${topic.slug}`} className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[11px] text-faint">
                            {String(ti + 1)}.{i + 1}
                          </span>
                          <DoneDot slug={topic.slug} />
                        </div>
                        <h3 className="mt-2 text-[17px] font-semibold leading-snug text-ink group-hover:text-accent">{topic.title}</h3>
                        <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-muted">{topic.summary}</p>
                        <p className="mt-4 flex items-center gap-3 text-[12px]">
                          <span className={`font-semibold ${levelColor[topic.level]}`}>{topic.level}</span>
                          <span className="text-faint">{topic.minutes} min</span>
                          {topic.blocks.some((b) => b.type === "widget") ? <span className="rounded-full bg-accent-soft px-2 py-0.5 font-medium text-accent">Interactive</span> : null}
                          {topic.bridge && t.id !== "tokenization" ? <span className="rounded-full bg-token-soft px-2 py-0.5 font-medium text-token">◈ Token link</span> : null}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
