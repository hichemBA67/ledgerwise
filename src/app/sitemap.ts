import type { MetadataRoute } from "next";
import { topics } from "@/content";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...["", "/learn", "/compare", "/players", "/timeline", "/glossary"].map((p) => ({ url: `${base}${p}` })),
    ...topics.map((t) => ({ url: `${base}/learn/${t.slug}` })),
  ];
}
