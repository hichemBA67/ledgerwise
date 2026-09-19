import type { Metadata } from "next";
import { ProductMap } from "@/components/ProductMap";
import { ProductsExplorer, type ProductCard } from "@/components/ProductsExplorer";
import { families, products } from "@/content/products";
import type { ProductFamily } from "@/content/types";

export const metadata: Metadata = {
  title: "Products & services",
  description: "Every financial product and service explained in plain language: why it exists, who needs it, and a step-by-step diagram of how cash and assets move.",
};

export default function ProductsPage() {
  const colors = Object.fromEntries(families.map((f) => [f.id, f.color])) as Record<ProductFamily, string>;
  const cards: ProductCard[] = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    family: p.family,
    kind: p.kind,
    short: p.short,
    need: p.why.users[0] ? `${p.why.users[0].who} use it because ${p.why.users[0].because}.` : p.why.problem,
    tenor: p.tenor,
    tokenized: Boolean(p.tokenized),
    search: [p.name, p.short, p.why.problem, p.family, p.issuer, p.holders].join(" ").toLowerCase(),
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <header className="max-w-3xl">
        <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-accent">Products & services</p>
        <h1 className="mt-2 font-serif text-5xl font-medium tracking-tight text-ink">Every instrument, explained</h1>
        <p className="mt-4 text-[17px] leading-relaxed text-muted">
          {products.length} products and services. Each page answers the same four questions: <strong className="text-ink">why does this exist</strong>, who needs it, how does cash and collateral actually move between the parties, and what does the tokenized version look like.
        </p>
      </header>

      <div className="mt-10">
        <ProductsExplorer cards={cards} families={families} />
      </div>

      <section className="mt-16">
        <h2 className="font-serif text-3xl text-ink">The whole universe on one chart</h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
          Left to right: how long your money is tied up, from overnight to perpetual. Bottom to top: how risky it is (credit, market and illiquidity combined). Safe and short sits bottom-left; long and risky sits top-right. Hover a dot for the product, click to open it.
        </p>
        <div className="mt-5">
          <ProductMap products={products} colors={colors} />
        </div>
      </section>
    </div>
  );
}
