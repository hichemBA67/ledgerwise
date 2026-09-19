import type { Metadata } from "next";
import { GlossaryExplorer } from "@/components/GlossaryExplorer";
import { topics } from "@/content";
import { glossary } from "@/content/glossary";

export const metadata: Metadata = {
  title: "Glossary",
  description: "Key terms in money markets, fixed income, market infrastructure and tokenization.",
};

export default function GlossaryPage() {
  const topicTitles = Object.fromEntries(topics.map((t) => [t.slug, t.title]));
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <header className="mb-8 max-w-3xl">
        <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-accent">Glossary</p>
        <h1 className="mt-2 font-serif text-5xl font-medium tracking-tight text-ink">Speak the language</h1>
        <p className="mt-4 text-[17px] leading-relaxed text-muted">Every term links back to the lesson where it is explained in context.</p>
      </header>
      <GlossaryExplorer terms={glossary} topicTitles={topicTitles} />
    </div>
  );
}
