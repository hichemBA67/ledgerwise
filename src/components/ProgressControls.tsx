"use client";

import Link from "next/link";
import type { Topic } from "@/content/types";
import { setCompleted, useProgress } from "@/lib/progress";

export function CompleteButton({ slug }: { slug: string }) {
  const { completed } = useProgress();
  const done = Boolean(completed[slug]);
  return (
    <button
      type="button"
      onClick={() => setCompleted(slug, !done)}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[14px] font-semibold transition ${
        done ? "border border-token/40 bg-token-soft text-token" : "bg-ink text-bg hover:opacity-90"
      }`}
    >
      {done ? "✓ Completed" : "Mark as complete"}
    </button>
  );
}

export function DoneDot({ slug }: { slug: string }) {
  const { completed } = useProgress();
  return completed[slug] ? (
    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-token text-[9px] text-bg" aria-label="Completed">
      ✓
    </span>
  ) : (
    <span className="h-4 w-4 shrink-0 rounded-full border border-line" aria-hidden />
  );
}

export function ProgressBar({ slugs, color = "var(--accent)" }: { slugs: string[]; color?: string }) {
  const { completed } = useProgress();
  const done = slugs.filter((s) => completed[s]).length;
  const pct = slugs.length ? (done / slugs.length) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="font-mono text-[11px] tabular-nums text-muted">
        {done}/{slugs.length}
      </span>
    </div>
  );
}

export function TrackNav({ topics, current }: { topics: Pick<Topic, "slug" | "title">[]; current: string }) {
  return (
    <ul className="space-y-0.5">
      {topics.map((t) => (
        <li key={t.slug}>
          <Link
            href={`/learn/${t.slug}`}
            aria-current={t.slug === current ? "page" : undefined}
            className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] leading-snug transition ${
              t.slug === current ? "bg-surface font-semibold text-ink shadow-sm ring-1 ring-line" : "text-muted hover:bg-surface/70 hover:text-ink"
            }`}
          >
            <DoneDot slug={t.slug} />
            {t.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ContinueLink({ order }: { order: { slug: string; title: string }[] }) {
  const { completed } = useProgress();
  const next = order.find((t) => !completed[t.slug]) ?? order[0];
  const started = Object.keys(completed).length > 0;
  return (
    <Link
      href={`/learn/${next.slug}`}
      className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-[15px] font-semibold text-bg transition hover:opacity-90"
    >
      {started ? `Continue: ${next.title}` : "Start learning"} <span aria-hidden>→</span>
    </Link>
  );
}
