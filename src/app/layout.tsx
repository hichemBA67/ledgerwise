import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import type { SearchItem } from "@/components/SearchPalette";
import { themeScript } from "@/components/ThemeToggle";
import { topics } from "@/content";
import { glossary } from "@/content/glossary";
import { players } from "@/content/players";
import { products } from "@/content/products";
import { site } from "@/lib/site";
import { slugify } from "@/lib/slug";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const newsreader = Newsreader({ variable: "--font-newsreader", subsets: ["latin"], style: ["normal", "italic"] });

export const metadata: Metadata = {
  title: { default: `${site.name}: ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.description,
};

const searchItems: SearchItem[] = [
  { kind: "Page", title: "The finance map", text: "Mental model: 7 layers × 6 lifecycle stages", href: "/map" },
  { kind: "Page", title: "Curriculum", text: "All tracks and lessons", href: "/learn" },
  { kind: "Page", title: "Products & services", text: "Flow diagrams for every instrument", href: "/products" },
  { kind: "Page", title: "Global institution map", text: "Interactive globe of institutions", href: "/globe" },
  { kind: "Page", title: "RL1 ecosystem", text: "Regulated Layer One in 3D: members, validators, vendors, geography, blind spots", href: "/" },
  { kind: "Page", title: "Fundamentals", text: "Finance fundamentals and tokenization learning path", href: "/fundamentals" },
  { kind: "Page", title: "Global comparison", text: "US, EU, UK, CH, SG, HK, JP, UAE side by side", href: "/compare" },
  { kind: "Page", title: "Major players", text: "Custodians, CSDs, CCPs, banks, tokenization platforms", href: "/players" },
  { kind: "Page", title: "Tokenization timeline", text: "Milestones from 2017 to 2027", href: "/timeline" },
  { kind: "Page", title: "Glossary", text: "Key terms A–Z", href: "/glossary" },
  ...topics.map((t) => ({ kind: "Topic" as const, title: t.title, text: t.summary, href: `/learn/${t.slug}` })),
  ...products.map((p) => ({ kind: "Product" as const, title: p.name, text: p.short, href: `/products/${p.slug}` })),
  ...players.map((p) => ({ kind: "Player" as const, title: p.name, text: `${p.category} · ${p.what}`, href: `/players?focus=${p.id}` })),
  ...glossary.map((g) => ({ kind: "Term" as const, title: g.term, text: g.def, href: `/glossary#${slugify(g.term)}` })),
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <SiteHeader searchItems={searchItems} repo={site.repo} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
