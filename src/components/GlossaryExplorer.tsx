"use client";

import Link from "next/link";
import { useState } from "react";
import type { GlossaryTerm } from "@/content/types";
import { slugify } from "@/lib/slug";

export function GlossaryExplorer({ terms, topicTitles }: { terms: GlossaryTerm[]; topicTitles: Record<string, string> }) {
  const [q, setQ] = useState("");
  const sorted = [...terms].sort((a, b) => a.term.localeCompare(b.term));
  const term = q.trim().toLowerCase();
  const shown = term ? sorted.filter((t) => (t.term + " " + t.def).toLowerCase().includes(term)) : sorted;
  const letter = (t: GlossaryTerm) => (/[A-Z]/.test(t.term[0].toUpperCase()) ? t.term[0].toUpperCase() : "#");
  const letters = [...new Set(shown.map(letter))];

  return (
    <div>
      <div className="sticky top-16 z-20 -mx-4 border-b border-line bg-bg/90 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Filter ${terms.length} terms…`}
          className="h-10 w-full rounded-lg border border-line bg-surface px-3.5 text-[14px] text-ink outline-none placeholder:text-faint focus:border-accent/60"
        />
        <div className="mt-2 flex flex-wrap gap-1">
          {letters.map((l) => (
            <a key={l} href={`#letter-${l}`} className="rounded px-2 py-0.5 font-mono text-[12px] text-muted hover:bg-surface hover:text-ink">
              {l}
            </a>
          ))}
        </div>
      </div>
      <div className="mt-8 space-y-10">
        {letters.map((l) => (
          <section key={l} id={`letter-${l}`} className="scroll-mt-44">
            <h2 className="font-serif text-3xl text-ink">{l}</h2>
            <dl className="mt-3 divide-y divide-line rounded-2xl border border-line bg-surface">
              {shown
                .filter((t) => letter(t) === l)
                .map((t) => (
                  <div key={t.term} id={slugify(t.term)} className="grid scroll-mt-44 gap-1 px-5 py-4 target:bg-accent-soft/50 md:grid-cols-[220px_1fr]">
                    <dt className="font-semibold text-ink">{t.term}</dt>
                    <dd className="text-[14.5px] leading-relaxed text-ink/80">
                      {t.def}
                      {t.topic ? (
                        <Link href={`/learn/${t.topic}`} className="ml-2 whitespace-nowrap text-[13px] font-medium text-accent hover:underline">
                          {topicTitles[t.topic] ?? "Lesson"} →
                        </Link>
                      ) : null}
                    </dd>
                  </div>
                ))}
            </dl>
          </section>
        ))}
        {shown.length === 0 ? <p className="text-muted">No terms match “{q}”.</p> : null}
      </div>
    </div>
  );
}
