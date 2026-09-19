import { productsA } from "./products-a";
import { productsB } from "./products-b";
import { buildA } from "./products-build-a";
import { buildB } from "./products-build-b";
import { partyExamples, why } from "./products-why";
import type { Product, ProductFamily } from "./types";

/** Merges the authored product specs with their "why" copy and named example institutions. */
export const products: Product[] = [...productsA, ...productsB].map((p) => ({
  ...p,
  why: why[p.slug],
  build: { ...buildA, ...buildB }[p.slug],
  parties: p.parties.map((party) => ({ ...party, example: partyExamples[p.slug]?.[party.id] ?? party.example })),
}));
export const productBySlug = new Map(products.map((p) => [p.slug, p]));

export const families: { id: ProductFamily; color: string; blurb: string }[] = [
  { id: "Money & Payments", color: "var(--track-foundations)", blurb: "The settlement assets and the rails money moves on." },
  { id: "Money Market", color: "var(--track-money)", blurb: "Short-term debt under one year." },
  { id: "Financing", color: "var(--track-infra)", blurb: "Borrowing cash or securities against collateral." },
  { id: "Bonds", color: "var(--track-fixed)", blurb: "Long-term debt: sovereign, corporate, secured and structured." },
  { id: "Equity & Funds", color: "var(--track-markets)", blurb: "Ownership claims and pooled vehicles." },
  { id: "Derivatives", color: "var(--track-reg)", blurb: "Contracts that transfer risk." },
  { id: "Infrastructure Services", color: "var(--faint)", blurb: "The utilities that clear, settle and safekeep." },
  { id: "Tokenized", color: "var(--track-token)", blurb: "The same products rebuilt on shared ledgers." },
];
