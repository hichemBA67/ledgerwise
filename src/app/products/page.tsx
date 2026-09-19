import type { Metadata } from "next";
import Link from "next/link";
import { ProductMap } from "@/components/ProductMap";
import { families, products } from "@/content/products";
import type { ProductFamily } from "@/content/types";

export const metadata: Metadata = {
  title: "Products & services",
  description: "Every financial product and service explained with a flow diagram: repo, bonds, funds, derivatives, custody, clearing, stablecoins and tokenized versions.",
};

export default function ProductsPage() {
  const colors = Object.fromEntries(families.map((f) => [f.id, f.color])) as Record<ProductFamily, string>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <header className="max-w-3xl">
        <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-accent">Products & services</p>
        <h1 className="mt-2 font-serif text-5xl font-medium tracking-tight text-ink">Every instrument, drawn</h1>
        <p className="mt-4 text-[17px] leading-relaxed text-muted">
          {products.length} products and services, each with the parties involved, the flow of cash and assets step by step, a risk profile, and its tokenized counterpart.
        </p>
      </header>

      <section className="mt-10">
        <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-muted">The map: tenor vs risk</h2>
        <ProductMap products={products} colors={colors} />
      </section>

      <div className="mt-14 space-y-12">
        {families.map((f) => {
          const list = products.filter((p) => p.family === f.id);
          return (
            <section key={f.id} id={f.id.toLowerCase().replace(/\W+/g, "-")}>
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full" style={{ background: f.color }} />
                <h2 className="font-serif text-3xl text-ink">{f.id}</h2>
                <p className="hidden text-[14px] text-muted sm:block">{f.blurb}</p>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {list.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/products/${p.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted">{p.kind}</span>
                      <span className="font-mono text-[11px] text-faint">{p.tenor}</span>
                    </div>
                    <h3 className="mt-3 text-[17px] font-semibold leading-snug text-ink group-hover:text-accent">{p.name}</h3>
                    <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-muted">{p.short}</p>
                    <div className="mt-4 flex items-center gap-2 text-[11.5px] text-faint">
                      <span>{p.parties.length} parties</span>
                      <span>·</span>
                      <span>{p.flows.length} flows</span>
                      {p.tokenized ? <span className="ml-auto text-token">◈ tokenized</span> : null}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
