import type { MetadataRoute } from "next";
import { topics } from "@/content";
import { products } from "@/content/products";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...["", "/map", "/learn", "/products", "/globe", "/compare", "/players", "/timeline", "/glossary"].map((p) => ({ url: `${base}${p}` })),
    ...products.map((p) => ({ url: `${base}/products/${p.slug}` })),
    ...topics.map((t) => ({ url: `${base}/learn/${t.slug}` })),
  ];
}
