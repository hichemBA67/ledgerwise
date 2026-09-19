"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ProductFamily } from "@/content/types";

export type ProductCard = {
  slug: string;
  name: string;
  family: ProductFamily;
  kind: "Product" | "Service";
  short: string;
  need: string;
  tenor: string;
  tokenized: boolean;
  search: string;
};

export function ProductsExplorer({
  cards,
  families,
}: {
  cards: ProductCard[];
  families: { id: ProductFamily; color: string; blurb: string }[];
}) {
  const [q, setQ] = useState("");
  const [family, setFamily] = useState<ProductFamily | "all">("all");
  const [kind, setKind] = useState<"all" | "Product" | "Service">("all");

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return cards.filter(
      (c) =>
        (family === "all" || c.family === family) &&
        (kind === "all" || c.kind === kind) &&
        (!term || c.search.includes(term)),
    );
  }, [cards, q, family, kind]);

  const groups = families
    .map((f) => ({ ...f, list: shown.filter((c) => c.family === f.id) }))
    .filter((g) => g.list.length > 0);

  return (
    <div>
      <div className="sticky top-16 z-20 -mx-4 border-y border-line bg-bg/92 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${cards.length} products and services…`}
            className="h-10 flex-1 rounded-lg border border-line bg-surface px-3.5 text-[14px] text-ink outline-none placeholder:text-faint focus:border-accent/60"
          />
          <div className="inline-flex rounded-lg border border-line bg-surface-2 p-0.5 text-[13px]">
            {(["all", "Product", "Service"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                className={`rounded-md px-3 py-1.5 font-medium transition ${kind === k ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"}`}
              >
                {k === "all" ? "Everything" : k === "Product" ? "Instruments" : "Services"}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <Chip on={family === "all"} onClick={() => setFamily("all")} color="var(--ink)">
            All families
          </Chip>
          {families.map((f) => (
            <Chip key={f.id} on={family === f.id} onClick={() => setFamily(f.id)} color={f.color}>
              {f.id}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-12">
        {groups.map((g) => (
          <section key={g.id} id={g.id.toLowerCase().replace(/\W+/g, "-")} className="scroll-mt-40">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="h-3 w-3 rounded-full" style={{ background: g.color }} />
              <h2 className="font-serif text-3xl text-ink">{g.id}</h2>
              <p className="text-[14px] text-muted">{g.blurb}</p>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {g.list.map((c) => (
                <Link
                  key={c.slug}
                  href={`/products/${c.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[18px] font-semibold leading-snug text-ink group-hover:text-accent">{c.name}</h3>
                    <span className="mt-0.5 shrink-0 rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted">
                      {c.kind === "Service" ? "Service" : c.tenor}
                    </span>
                  </div>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink/80">{c.short}</p>
                  <p className="mt-3 border-t border-line pt-3 text-[13px] leading-relaxed text-muted">
                    <span className="font-semibold text-ink/70">Why: </span>
                    {c.need}
                  </p>
                  {c.tokenized ? (
                    <p className="mt-3 text-[11.5px] font-semibold text-token">◈ Has a tokenized version</p>
                  ) : null}
                </Link>
              ))}
            </div>
          </section>
        ))}
        {groups.length === 0 ? <p className="py-12 text-center text-muted">Nothing matches “{q}”.</p> : null}
      </div>
    </div>
  );
}

function Chip({ on, onClick, color, children }: { on: boolean; onClick: () => void; color: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12.5px] font-medium transition ${
        on ? "border-ink bg-ink text-bg" : "border-line text-muted hover:text-ink"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: on ? "var(--bg)" : color }} />
      {children}
    </button>
  );
}
