"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Player, PlayerCategory, Region } from "@/content/types";
import { PlayerLogo } from "./PlayerLogo";

export function PlayersExplorer({ players, topicTitles }: { players: Player[]; topicTitles: Record<string, string> }) {
  const focus = useSearchParams().get("focus");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<PlayerCategory | "All">("All");
  const [region, setRegion] = useState<Region | "All">("All");
  const [tokenOnly, setTokenOnly] = useState(false);

  const categories = useMemo(() => {
    const counts = new Map<PlayerCategory, number>();
    players.forEach((p) => counts.set(p.category, (counts.get(p.category) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [players]);
  const regions: Region[] = ["Americas", "Europe", "Asia-Pacific", "Middle East", "Global"];

  const shown = players.filter((p) => {
    if (cat !== "All" && p.category !== cat) return false;
    if (region !== "All" && p.region !== region) return false;
    if (tokenOnly && !p.tokenization) return false;
    const term = q.trim().toLowerCase();
    if (!term) return true;
    return [p.name, p.what, p.tokenization ?? "", p.hq, p.category].join(" ").toLowerCase().includes(term);
  });

  useEffect(() => {
    if (!focus) return;
    // Wait for the router's own scroll-to-top after navigation before focusing the card.
    const t = window.setTimeout(() => {
      document.getElementById(`player-${focus}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
    return () => window.clearTimeout(t);
  }, [focus]);

  return (
    <div>
      <div className="space-y-4 rounded-2xl border border-line bg-surface p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search players, e.g. custody, BUIDL, Luxembourg…"
            className="h-10 flex-1 rounded-lg border border-line bg-bg px-3.5 text-[14px] text-ink outline-none placeholder:text-faint focus:border-accent/60"
          />
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as Region | "All")}
            className="h-10 rounded-lg border border-line bg-bg px-3 text-[14px] text-ink"
            aria-label="Region"
          >
            <option value="All">All regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <label className="flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-line bg-bg px-3 text-[14px] text-ink">
            <input type="checkbox" checked={tokenOnly} onChange={(e) => setTokenOnly(e.target.checked)} />
            <span className="text-token">◈</span> Tokenization activity
          </label>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Chip on={cat === "All"} onClick={() => setCat("All")}>All · {players.length}</Chip>
          {categories.map(([c, n]) => (
            <Chip key={c} on={cat === c} onClick={() => setCat(c)}>
              {c} · {n}
            </Chip>
          ))}
        </div>
      </div>

      <p className="mt-6 text-[13px] text-muted">{shown.length} players</p>
      <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {shown.map((p) => (
          <article
            key={p.id}
            id={`player-${p.id}`}
            className={`flex scroll-mt-24 flex-col rounded-2xl border bg-surface p-5 transition ${
              focus === p.id ? "border-accent ring-4 ring-accent/15" : "border-line"
            }`}
          >
            <header className="flex items-start gap-3.5">
              <PlayerLogo name={p.name} domain={p.domain} size={48} />
              <div className="min-w-0">
                <h3 className="text-[16px] font-semibold leading-tight text-ink">{p.name}</h3>
                <p className="mt-1 text-[12px] text-faint">
                  {p.hq} · {p.region}
                </p>
                <span className="mt-1.5 inline-block rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted">{p.category}</span>
              </div>
            </header>
            <p className="mt-4 text-[13.5px] leading-relaxed text-ink/85">{p.what}</p>
            {p.tokenization ? (
              <p className="mt-3 rounded-lg bg-token-soft px-3 py-2 text-[13px] leading-relaxed text-ink/90">
                <span className="font-semibold text-token">◈ Tokenization: </span>
                {p.tokenization}
              </p>
            ) : null}
            <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
              {p.topics.slice(0, 4).map((t) => (
                <Link key={t} href={`/learn/${t}`} className="rounded-md border border-line px-2 py-1 text-[11.5px] text-muted hover:border-accent/50 hover:text-ink">
                  {topicTitles[t] ?? t}
                </Link>
              ))}
              <a href={`https://${p.domain}`} target="_blank" rel="noreferrer" className="ml-auto self-center text-[12px] text-faint hover:text-accent">
                {p.domain} ↗
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`rounded-full border px-3 py-1 text-[12.5px] font-medium transition ${
        on ? "border-ink bg-ink text-bg" : "border-line text-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
