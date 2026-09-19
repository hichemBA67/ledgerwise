import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FlowDiagram, RiskBars } from "@/components/FlowDiagram";
import { MiniMap } from "@/components/MiniMap";
import { PlayerLogo } from "@/components/PlayerLogo";
import { topics } from "@/content";
import { families, productBySlug, products } from "@/content/products";
import { playerById } from "@/content/players";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = productBySlug.get(slug);
  return p ? { title: p.name, description: p.short } : {};
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = productBySlug.get(slug);
  if (!product) notFound();

  const family = families.find((f) => f.id === product.family)!;
  const related = products.filter((p) => p.family === product.family && p.slug !== product.slug).slice(0, 4);
  const lessonTitles = new Map(topics.map((t) => [t.slug, t.title]));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav className="flex items-center gap-2 text-[13px] text-muted">
        <Link href="/products" className="hover:text-ink">Products & services</Link>
        <span className="text-faint">/</span>
        <span>{product.family}</span>
      </nav>

      <header className="mt-4 border-b border-line pb-8">
        <div className="flex flex-wrap items-center gap-2 text-[12px]">
          <span className="rounded-full px-2.5 py-1 font-semibold text-bg" style={{ background: family.color }}>
            {product.family}
          </span>
          <span className="rounded-full border border-line px-2.5 py-1 font-medium text-muted">{product.kind}</span>
          <span className="rounded-full border border-line px-2.5 py-1 font-medium text-muted">{product.tenor}</span>
        </div>
        <h1 className="mt-5 font-serif text-4xl font-medium leading-tight tracking-tight text-ink sm:text-5xl">{product.name}</h1>
        <p className="mt-4 max-w-2xl text-[18px] leading-relaxed text-muted">{product.short}</p>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <p className="text-[16.5px] leading-[1.75] text-ink/90">{product.what}</p>

          <FlowDiagram product={product} />

          <section>
            <h2 className="font-serif text-2xl text-ink">Key points</h2>
            <ul className="mt-3 space-y-2">
              {product.keyPoints.map((k) => (
                <li key={k} className="flex gap-2.5 text-[15px] text-ink/85">
                  <span className="mt-[3px] text-accent">▸</span>
                  {k}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="font-serif text-2xl text-ink">Where it lives</h2>
            <dl className="mt-3 overflow-hidden rounded-xl border border-line bg-surface">
              {[
                ["Issued / provided by", product.issuer],
                ["Held by", product.holders],
                ["Traded", product.where.trade],
                ["Cleared", product.where.clear],
                ["Settled", product.where.settle],
                ["Held & serviced", product.where.hold],
                ...(product.size ? [["Market size", product.size]] : []),
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[150px_1fr] gap-3 border-b border-line px-4 py-2.5 text-[14px] last:border-0">
                  <dt className="font-medium text-muted">{k}</dt>
                  <dd className="text-ink/85">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          {product.tokenized ? (
            <section className="mt-8 rounded-2xl border border-token/30 bg-token-soft p-6">
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-token">◈ Tokenized version</p>
              <p className="mt-2 text-[15.5px] leading-relaxed text-ink/90">{product.tokenized.text}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.tokenized.examples.map((id) => {
                  const pl = playerById.get(id);
                  return pl ? (
                    <Link key={id} href={`/players?focus=${id}`} className="flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-3 text-[13px] font-medium text-ink">
                      <PlayerLogo name={pl.name} domain={pl.domain} size={24} />
                      {pl.name}
                    </Link>
                  ) : null;
                })}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-line bg-surface p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">Risk profile</p>
            <div className="mt-3">
              <RiskBars risk={product.risk} />
            </div>
          </div>

          <MiniMap coords={product.coords} />

          <div className="rounded-xl border border-line bg-surface p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">Learn more</p>
            <ul className="mt-2 space-y-1.5">
              {product.lessons.map((s) => (
                <li key={s}>
                  <Link href={`/learn/${s}`} className="text-[13.5px] font-medium text-accent hover:underline">
                    {lessonTitles.get(s) ?? s} →
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-line bg-surface p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">Who&apos;s involved</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.players.map((id) => {
                const pl = playerById.get(id);
                return pl ? (
                  <Link key={id} href={`/players?focus=${id}`} title={pl.name}>
                    <PlayerLogo name={pl.name} domain={pl.domain} size={32} />
                  </Link>
                ) : null;
              })}
            </div>
          </div>
        </aside>
      </div>

      {related.length ? (
        <section className="mt-14 border-t border-line pt-8">
          <h2 className="font-serif text-2xl text-ink">More in {product.family}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <Link key={r.slug} href={`/products/${r.slug}`} className="rounded-xl border border-line bg-surface p-4 hover:border-accent/40">
                <p className="font-semibold text-ink">{r.name}</p>
                <p className="mt-1 text-[13px] leading-snug text-muted">{r.short}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
