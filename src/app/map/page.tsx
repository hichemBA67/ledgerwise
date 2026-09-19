import type { Metadata } from "next";
import Link from "next/link";
import { MapExplorer, type LiteItem } from "@/components/MapExplorer";
import { topics } from "@/content";
import { categoryCoords, layers, mapNodes, stages, topicCoords } from "@/content/map";
import { players } from "@/content/players";
import { products } from "@/content/products";

export const metadata: Metadata = {
  title: "The finance map",
  description: "A mental model for all of finance: seven layers, six lifecycle stages, and a classifier that places any product, institution or rule.",
};

export default function MapPage() {
  const playerMeta = Object.fromEntries(players.map((p) => [p.id, { name: p.name, domain: p.domain }]));
  const productNames = Object.fromEntries(products.map((p) => [p.slug, p.name]));
  const lessonNames = Object.fromEntries(topics.map((t) => [t.slug, t.title]));

  const items: LiteItem[] = [
    ...mapNodes.map((n) => ({ kind: "Node" as const, id: n.id, label: n.label, sub: n.desc, href: "/map", coords: n })),
    ...products.map((p) => ({ kind: "Product" as const, id: p.slug, label: p.name, sub: p.short, href: `/products/${p.slug}`, coords: p.coords })),
    ...players.map((p) => ({
      kind: "Player" as const,
      id: p.id,
      label: p.name,
      sub: `${p.category} · ${p.hq}`,
      href: `/players?focus=${p.id}`,
      coords: categoryCoords[p.category],
      domain: p.domain,
    })),
    ...topics.map((t) => ({ kind: "Lesson" as const, id: t.slug, label: t.title, sub: t.summary, href: `/learn/${t.slug}`, coords: topicCoords[t.slug] })),
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <header className="max-w-3xl">
        <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-accent">The finance map</p>
        <h1 className="mt-2 font-serif text-5xl font-medium tracking-tight text-ink">Where everything fits</h1>
        <p className="mt-4 text-[17px] leading-relaxed text-muted">
          Finance looks chaotic because one firm plays many roles. Sort <strong className="text-ink">functions</strong>, not firms: every function sits on one of seven layers and acts at one or more of six lifecycle stages.
        </p>
        <p className="mt-3 text-[15px] text-muted">
          New here? Read <Link href="/learn/the-finance-stack" className="font-medium text-accent hover:underline">The finance stack</Link> first.
        </p>
      </header>

      <section className="mt-10 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">Axis 1 · The stack</p>
          <ol className="mt-3 space-y-1.5">
            {layers.map((l) => (
              <li key={l.id} className="flex items-baseline gap-2.5 text-[14px]">
                <span className="h-2 w-2 shrink-0 translate-y-[-1px] rounded-full" style={{ background: l.color }} />
                <span className="font-semibold text-ink">{l.label}</span>
                <span className="text-muted">{l.question}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">Axis 2 · The lifecycle</p>
          <ol className="mt-3 space-y-1.5">
            {stages.map((s, i) => (
              <li key={s.id} className="flex items-baseline gap-2.5 text-[14px]">
                <span className="font-mono text-[11px] text-faint">{i + 1}</span>
                <span className="font-semibold text-ink">{s.label}</span>
                <span className="text-muted">{s.question}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="mt-8">
        <MapExplorer nodes={mapNodes} items={items} playerMeta={playerMeta} productNames={productNames} lessonNames={lessonNames} />
      </div>
    </div>
  );
}
