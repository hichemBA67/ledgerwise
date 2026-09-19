import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Blocks } from "@/components/Blocks";
import { GitHubIcon } from "@/components/icons";
import { PlayerLogo } from "@/components/PlayerLogo";
import { CompleteButton, ProgressBar, TrackNav } from "@/components/ProgressControls";
import { Quiz } from "@/components/Quiz";
import { Toc } from "@/components/Toc";
import { getTopic, neighbours, topicSourceFile, topics, topicsForTrack } from "@/content";
import { playerById } from "@/content/players";
import { trackById } from "@/content/tracks";
import { githubEditUrl, githubIssueUrl } from "@/lib/site";
import { slugify } from "@/lib/slug";

export const dynamicParams = false;

export function generateStaticParams() {
  return topics.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/learn/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopic(slug);
  return topic ? { title: topic.title, description: topic.summary } : {};
}

export default async function TopicPage({ params }: PageProps<"/learn/[slug]">) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  const track = trackById[topic.track];
  const trackTopics = topicsForTrack(topic.track);
  const { prev, next } = neighbours(slug);
  const bridge = topic.bridge ? getTopic(topic.bridge.slug) : undefined;
  const toc = [
    ...topic.blocks.flatMap((b) => (b.type === "h" ? [{ id: slugify(b.text), text: b.text }] : [])),
    { id: "quiz", text: "Quiz" },
  ];
  const topicPlayers = (topic.players ?? []).map((id) => playerById.get(id)).filter((p) => p !== undefined);
  const sourceFile = topicSourceFile(slug);
  const isToken = topic.track === "tokenization";

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[250px_minmax(0,1fr)_210px]">
      {/* Left: track navigation */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-4">
          <Link href={`/learn#${track.id}`} className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em]" style={{ color: track.color }}>
            <span>{track.icon}</span> {track.title}
          </Link>
          <ProgressBar slugs={trackTopics.map((t) => t.slug)} color={track.color} />
          <TrackNav topics={trackTopics} current={slug} />
          <Link href="/learn" className="block px-2.5 pt-2 text-[13px] text-muted hover:text-ink">
            ← All tracks
          </Link>
        </div>
      </aside>

      {/* Main */}
      <article className="min-w-0">
        <nav className="flex items-center gap-2 text-[13px] text-muted" aria-label="Breadcrumb">
          <Link href="/learn" className="hover:text-ink">Curriculum</Link>
          <span className="text-faint">/</span>
          <Link href={`/learn#${track.id}`} className="hover:text-ink">{track.title}</Link>
        </nav>
        <header className="mt-4 border-b border-line pb-8">
          <div className="flex flex-wrap items-center gap-2 text-[12px]">
            <span className="rounded-full px-2.5 py-1 font-semibold text-bg" style={{ background: track.color }}>
              {track.title}
            </span>
            <span className="rounded-full border border-line px-2.5 py-1 font-medium text-muted">{topic.level}</span>
            <span className="rounded-full border border-line px-2.5 py-1 font-medium text-muted">{topic.minutes} min read</span>
          </div>
          <h1 className="mt-5 font-serif text-4xl font-medium leading-[1.1] tracking-tight text-ink sm:text-5xl">{topic.title}</h1>
          <p className="mt-4 max-w-2xl text-[18px] leading-relaxed text-muted">{topic.summary}</p>

          <div className="mt-6 rounded-xl border border-line bg-surface p-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-faint">You will learn to</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-1">
              {topic.objectives.map((o) => (
                <li key={o} className="flex gap-2.5 text-[14.5px] text-ink/90">
                  <span className="mt-[3px] text-token">✓</span>
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </header>

        <div className="mt-8">
          <Blocks blocks={topic.blocks} />
        </div>

        {bridge && topic.bridge ? (
          <Link
            href={`/learn/${bridge.slug}`}
            className={`mt-12 flex items-center justify-between gap-4 rounded-2xl border p-6 transition hover:shadow-md ${
              isToken ? "border-line bg-surface" : "border-token/40 bg-token-soft"
            }`}
          >
            <div>
              <p className={`text-[12px] font-semibold uppercase tracking-[0.12em] ${isToken ? "text-muted" : "text-token"}`}>
                {isToken ? "↩ Traditional counterpart" : "◈ Tokenization bridge"}
              </p>
              <p className="mt-1.5 font-serif text-2xl text-ink">{bridge.title}</p>
              <p className="mt-1 text-[14.5px] text-muted">{topic.bridge.text}</p>
            </div>
            <span className="text-2xl text-ink" aria-hidden>→</span>
          </Link>
        ) : null}

        {topicPlayers.length ? (
          <section className="mt-12">
            <h2 className="font-serif text-2xl font-medium text-ink">Players to know</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {topicPlayers.map((p) => (
                <Link key={p.id} href={`/players?focus=${p.id}`} className="flex gap-3 rounded-xl border border-line bg-surface p-4 transition hover:border-accent/40">
                  <PlayerLogo name={p.name} domain={p.domain} size={40} />
                  <div className="min-w-0">
                    <p className="font-semibold text-ink">{p.name}</p>
                    <p className="text-[12px] text-faint">{p.category} · {p.hq}</p>
                    <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-muted">{p.tokenization ?? p.what}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-12">
          <Quiz slug={slug} questions={topic.quiz} />
        </div>

        {topic.sources?.length ? (
          <section className="mt-10">
            <h2 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-faint">Primary sources & further reading</h2>
            <ul className="mt-3 space-y-1.5">
              {topic.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noreferrer" className="text-[14px] text-accent hover:underline">
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <CompleteButton slug={slug} />
          <div className="flex flex-wrap gap-4 text-[13px]">
            <a href={githubEditUrl(sourceFile)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-muted hover:text-ink">
              <GitHubIcon size={14} /> Edit this lesson
            </a>
            <a
              href={githubIssueUrl(`Correction: ${topic.title}`, `Lesson: /learn/${slug}\nSource file: ${sourceFile}\n\nWhat is wrong or outdated?\n\nSuggested fix / source:\n`)}
              target="_blank"
              rel="noreferrer"
              className="text-muted hover:text-ink"
            >
              Report an issue
            </a>
          </div>
        </div>

        <nav className="mt-8 grid gap-3 sm:grid-cols-2" aria-label="Lesson navigation">
          {prev ? (
            <Link href={`/learn/${prev.slug}`} className="rounded-xl border border-line bg-surface p-4 transition hover:border-accent/40">
              <p className="text-[12px] text-faint">← Previous</p>
              <p className="mt-1 font-medium text-ink">{prev.title}</p>
            </Link>
          ) : <span />}
          {next ? (
            <Link href={`/learn/${next.slug}`} className="rounded-xl border border-line bg-surface p-4 text-right transition hover:border-accent/40">
              <p className="text-[12px] text-faint">Next →</p>
              <p className="mt-1 font-medium text-ink">{next.title}</p>
            </Link>
          ) : null}
        </nav>
      </article>

      {/* Right: TOC */}
      <aside className="hidden xl:block">
        <div className="sticky top-24">
          <Toc items={toc} />
        </div>
      </aside>
    </div>
  );
}
