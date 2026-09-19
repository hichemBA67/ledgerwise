import type { Metadata } from "next";
import { Suspense } from "react";
import { PlayersExplorer } from "@/components/PlayersExplorer";
import { topics } from "@/content";
import { players } from "@/content/players";

export const metadata: Metadata = {
  title: "Major players",
  description: "Custodians, CSDs, CCPs, banks, asset managers, tokenization platforms, stablecoin issuers and regulators.",
};

export default function PlayersPage() {
  const topicTitles = Object.fromEntries(topics.map((t) => [t.slug, t.title]));
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <header className="max-w-3xl">
        <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-accent">Major players</p>
        <h1 className="mt-2 font-serif text-5xl font-medium tracking-tight text-ink">Who runs the rails</h1>
        <p className="mt-4 text-[17px] leading-relaxed text-muted">
          {players.length} institutions across the value chain, what they do today, and what they are building in tokenization.
        </p>
      </header>
      <div className="mt-10">
        <Suspense fallback={<p className="text-muted">Loading players…</p>}>
          <PlayersExplorer players={players} topicTitles={topicTitles} />
        </Suspense>
      </div>
    </div>
  );
}
