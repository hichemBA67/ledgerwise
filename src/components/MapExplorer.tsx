"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { assetClasses, layers, stages } from "@/content/map";
import type { AssetClass, Coords, MapNode, Stage } from "@/content/types";
import { PlayerLogo } from "./PlayerLogo";

export type LiteItem = {
  kind: "Node" | "Product" | "Player" | "Lesson";
  id: string;
  label: string;
  sub: string;
  href: string;
  coords: Coords;
  domain?: string;
};

type Props = {
  nodes: MapNode[];
  items: LiteItem[];
  playerMeta: Record<string, { name: string; domain: string }>;
  productNames: Record<string, string>;
  lessonNames: Record<string, string>;
};

export function MapExplorer({ nodes, items, playerMeta, productNames, lessonNames }: Props) {
  const [tab, setTab] = useState<"stack" | "lifecycle" | "classify">("stack");
  const [asset, setAsset] = useState<AssetClass | "all">("all");
  const [stage, setStage] = useState<Stage | "all">("all");
  const [openNode, setOpenNode] = useState<string | null>(null);
  const [lens, setLens] = useState(false);
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<LiteItem | null>(null);

  const matches = (c: Coords) =>
    (asset === "all" || c.assets.includes(asset)) && (stage === "all" || c.stages.includes(stage));

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return items
      .filter((i) => i.label.toLowerCase().includes(term) || i.sub.toLowerCase().includes(term))
      .slice(0, 8);
  }, [q, items]);

  const node = nodes.find((n) => n.id === openNode) ?? null;

  return (
    <div>
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="inline-flex rounded-lg border border-line bg-surface-2 p-0.5 text-[13px]">
          {(["stack", "lifecycle", "classify"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-md px-3.5 py-1.5 font-medium capitalize transition ${tab === t ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"}`}
            >
              {t === "stack" ? "The stack" : t === "lifecycle" ? "Lifecycle" : "Classify anything"}
            </button>
          ))}
        </div>
        {tab !== "classify" ? (
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={asset}
              onChange={(e) => setAsset(e.target.value as AssetClass | "all")}
              className="h-9 rounded-lg border border-line bg-bg px-2.5 text-[13px] text-ink"
              aria-label="Asset class filter"
            >
              <option value="all">All asset classes</option>
              {assetClasses.map((a) => (
                <option key={a.id} value={a.id}>{a.label}</option>
              ))}
            </select>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as Stage | "all")}
              className="h-9 rounded-lg border border-line bg-bg px-2.5 text-[13px] text-ink"
              aria-label="Lifecycle stage filter"
            >
              <option value="all">All lifecycle stages</option>
              {stages.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
            <label className="flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-line bg-bg px-3 text-[13px] text-ink">
              <input type="checkbox" checked={lens} onChange={(e) => setLens(e.target.checked)} />
              <span className="text-token">◈</span> Tokenization lens
            </label>
          </div>
        ) : null}
      </div>

      {tab === "stack" ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-2">
            {layers.map((l) => {
              const ns = nodes.filter((n) => n.layers.includes(l.id));
              return (
                <section key={l.id} className="overflow-hidden rounded-2xl border border-line bg-surface">
                  <div className="flex items-baseline gap-3 border-b border-line px-4 py-2.5" style={{ borderLeft: `4px solid ${l.color}` }}>
                    <span className="font-mono text-[12px] text-faint">L{l.n}</span>
                    <h3 className="text-[15px] font-semibold text-ink">{l.label}</h3>
                    <p className="hidden text-[12.5px] text-muted sm:block">{l.question}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 p-3">
                    {ns.map((n) => {
                      const on = matches(n);
                      return (
                        <button
                          key={n.id}
                          type="button"
                          onClick={() => setOpenNode(n.id)}
                          className={`rounded-lg border px-2.5 py-1.5 text-[13px] font-medium transition ${
                            openNode === n.id ? "border-accent bg-accent-soft text-ink" : on ? "border-line bg-bg text-ink hover:border-accent/50" : "border-transparent bg-bg/40 text-faint"
                          }`}
                        >
                          {n.label}
                          {lens && n.tokenized ? <span className="ml-1.5 text-token">◈</span> : null}
                        </button>
                      );
                    })}
                  </div>
                  {lens ? (
                    <p className="border-t border-token/20 bg-token-soft/40 px-4 py-2 text-[12.5px] leading-snug text-ink/85">
                      <span className="font-semibold text-token">◈ Tokenized: </span>
                      {l.tokenized}
                    </p>
                  ) : null}
                </section>
              );
            })}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            {node ? (
              <div className="rounded-2xl border border-line bg-surface p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">
                  {layers.filter((l) => node.layers.includes(l.id)).map((l) => l.label).join(" · ")}
                </p>
                <h3 className="mt-1 font-serif text-2xl text-ink">{node.label}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{node.desc}</p>
                {node.tokenized ? (
                  <p className="mt-3 rounded-lg bg-token-soft px-3 py-2 text-[13px] leading-relaxed text-ink/90">
                    <span className="font-semibold text-token">◈ Tokenized: </span>
                    {node.tokenized}
                  </p>
                ) : null}
                <Coordinates coords={node} />
                {node.examples?.length ? (
                  <>
                    <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">Who</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {node.examples.map((id) => {
                        const p = playerMeta[id];
                        return p ? (
                          <Link key={id} href={`/players?focus=${id}`} className="flex items-center gap-1.5 rounded-full border border-line py-0.5 pl-0.5 pr-2.5 text-[12px] text-ink hover:border-accent/50">
                            <PlayerLogo name={p.name} domain={p.domain} size={20} />
                            {p.name}
                          </Link>
                        ) : null;
                      })}
                    </div>
                  </>
                ) : null}
                {node.products?.length ? (
                  <>
                    <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">Products</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {node.products.map((s) => (
                        <Link key={s} href={`/products/${s}`} className="rounded-md border border-line px-2 py-1 text-[12px] text-muted hover:text-ink">
                          {productNames[s] ?? s}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : null}
                {node.lessons?.length ? (
                  <>
                    <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">Lessons</p>
                    <ul className="mt-2 space-y-1">
                      {node.lessons.map((s) => (
                        <li key={s}>
                          <Link href={`/learn/${s}`} className="text-[13.5px] font-medium text-accent hover:underline">
                            {lessonNames[s] ?? s} →
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-line p-6 text-center text-[14px] text-muted">
                Click any block to see what it is, who does it, and what changes when it is tokenized.
              </div>
            )}
          </aside>
        </div>
      ) : null}

      {tab === "lifecycle" ? (
        <div className="mt-6 overflow-x-auto">
          <div className="grid min-w-[900px] gap-3" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0,1fr))` }}>
            {stages.map((s, i) => (
              <div key={s.id} className="rounded-t-xl border border-line bg-surface p-3">
                <p className="font-mono text-[11px] text-faint">STAGE {i + 1}</p>
                <h3 className="text-[15px] font-semibold text-ink">{s.label}</h3>
                <p className="mt-1 text-[12.5px] leading-snug text-muted">{s.question}</p>
              </div>
            ))}
            {stages.map((s) => (
              <div key={s.id + "t"} className="border border-line bg-bg p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Traditional</p>
                <p className="mt-1.5 text-[13px] leading-snug text-ink/85">{s.trad}</p>
                <Logos ids={s.tradWho} meta={playerMeta} />
              </div>
            ))}
            {stages.map((s) => (
              <div key={s.id + "k"} className="rounded-b-xl border border-token/30 bg-token-soft/50 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-token">◈ Tokenized</p>
                <p className="mt-1.5 text-[13px] leading-snug text-ink/85">{s.token}</p>
                <Logos ids={s.tokenWho} meta={playerMeta} />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "classify" ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div>
            <label className="text-[13px] font-medium text-muted" htmlFor="classify-input">
              Type anything: a product, an institution, a concept
            </label>
            <input
              id="classify-input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="repo, BUIDL, Euroclear, MiCA…"
              className="mt-2 h-11 w-full rounded-lg border border-line bg-surface px-3.5 text-[15px] text-ink outline-none focus:border-accent/60"
            />
            <ul className="mt-2 space-y-1">
              {results.map((r) => (
                <li key={r.kind + r.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setPicked(r);
                      setQ("");
                    }}
                    className="flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left hover:bg-surface"
                  >
                    <span className="mt-0.5 w-14 shrink-0 font-mono text-[10px] uppercase tracking-wider text-faint">{r.kind}</span>
                    <span className="min-w-0">
                      <span className="block text-[14px] font-medium text-ink">{r.label}</span>
                      <span className="block truncate text-[12px] text-muted">{r.sub}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-xl border border-line bg-surface p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">Try</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {["Repo", "BlackRock", "Euroclear", "Stablecoin", "MiCA", "ETF"].map((t) => (
                  <button key={t} type="button" onClick={() => setQ(t)} className="rounded-full border border-line px-2.5 py-1 text-[12px] text-muted hover:text-ink">
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            {picked ? (
              <article className="rounded-2xl border border-line bg-surface p-6">
                <div className="flex items-center gap-3">
                  {picked.domain ? <PlayerLogo name={picked.label} domain={picked.domain} size={40} /> : null}
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent">{picked.kind}</p>
                    <h3 className="font-serif text-3xl text-ink">{picked.label}</h3>
                  </div>
                </div>
                <p className="mt-2 text-[14.5px] text-muted">{picked.sub}</p>

                <dl className="mt-5 space-y-3">
                  <Answer q="1. What is it?" a={layers.filter((l) => picked.coords.layers.includes(l.id)).map((l) => `${l.label} (layer ${l.n})`).join(" + ")} />
                  <Answer q="2. When does it act?" a={stages.filter((s) => picked.coords.stages.includes(s.id)).map((s) => s.label).join(" → ") || "Across the lifecycle"} />
                  <Answer q="3. Which asset class?" a={assetClasses.filter((a) => picked.coords.assets.includes(a.id)).map((a) => a.label).join(", ")} />
                  <Answer q="4. Which rails?" a={picked.coords.assets.includes("digital") ? "Tokenized (shared ledger)" : "Traditional (CSD / RTGS)"} />
                </dl>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-line bg-bg p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">Stack position</p>
                    <ul className="mt-2 space-y-1">
                      {layers.map((l) => {
                        const on = picked.coords.layers.includes(l.id);
                        return (
                          <li key={l.id} className="flex items-center gap-2">
                            <span className="h-1.5 rounded-full" style={{ width: on ? 26 : 10, background: on ? l.color : "var(--line)" }} />
                            <span className={`text-[12px] ${on ? "font-semibold text-ink" : "text-faint"}`}>{l.label}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-line bg-bg p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">Lifecycle</p>
                    <ul className="mt-2 space-y-1">
                      {stages.map((s) => {
                        const on = picked.coords.stages.includes(s.id);
                        return (
                          <li key={s.id} className={`text-[12px] ${on ? "font-semibold text-ink" : "text-faint"}`}>
                            {on ? "●" : "○"} {s.label}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                <Link href={picked.href} className="mt-5 inline-block rounded-lg bg-ink px-4 py-2.5 text-[14px] font-semibold text-bg">
                  Open {picked.kind.toLowerCase()} →
                </Link>
              </article>
            ) : (
              <div className="rounded-2xl border border-dashed border-line p-10 text-center text-muted">
                Search for anything in finance and see exactly where it sits: layer, lifecycle stage, asset class and rails.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Answer({ q, a }: { q: string; a: string }) {
  return (
    <div className="border-b border-line pb-2.5 last:border-0">
      <dt className="text-[12.5px] font-medium text-muted">{q}</dt>
      <dd className="mt-0.5 text-[15px] font-semibold text-ink">{a || "—"}</dd>
    </div>
  );
}

function Coordinates({ coords }: { coords: Coords }) {
  return (
    <div className="mt-4 flex flex-wrap gap-1">
      {stages.filter((s) => coords.stages.includes(s.id)).map((s) => (
        <span key={s.id} className="rounded-md bg-accent-soft px-1.5 py-0.5 text-[11px] font-semibold text-accent">
          {s.label}
        </span>
      ))}
      {assetClasses.filter((a) => coords.assets.includes(a.id)).map((a) => (
        <span key={a.id} className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[11px] text-muted">
          {a.label}
        </span>
      ))}
    </div>
  );
}

function Logos({ ids, meta }: { ids: string[]; meta: Record<string, { name: string; domain: string }> }) {
  return (
    <div className="mt-2.5 flex flex-wrap gap-1">
      {ids.map((id) => {
        const p = meta[id];
        return p ? <PlayerLogo key={id} name={p.name} domain={p.domain} size={24} /> : null;
      })}
    </div>
  );
}
