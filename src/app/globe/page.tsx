import type { Metadata } from "next";
import { Globe, type GlobeCity } from "@/components/Globe";
import { cities } from "@/content/cities";
import { players } from "@/content/players";
import type { PlayerCategory } from "@/content/types";

export const metadata: Metadata = {
  title: "Global institution map",
  description: "An interactive globe of the banks, exchanges, CSDs, CCPs, custodians, regulators and tokenization platforms that run global finance.",
};

export default function GlobePage() {
  const byCity = new Map<string, GlobeCity>();
  for (const p of players) {
    if (!p.city) continue;
    const c = cities[p.city];
    if (!c) continue;
    if (!byCity.has(p.city)) byCity.set(p.city, { key: p.city, name: c.name, country: c.country, lat: c.lat, lng: c.lng, players: [] });
    byCity.get(p.city)!.players.push({ id: p.id, name: p.name, domain: p.domain, category: p.category, region: p.region, hq: p.hq });
  }
  const list = [...byCity.values()].map((c) => ({ ...c, players: c.players.sort((a, b) => a.name.localeCompare(b.name)) }));
  const categories = [...new Set(players.map((p) => p.category))].sort() as PlayerCategory[];
  const placed = list.reduce((s, c) => s + c.players.length, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <header className="max-w-3xl">
        <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-accent">Global institution map</p>
        <h1 className="mt-2 font-serif text-5xl font-medium tracking-tight text-ink">The world&apos;s financial plumbing</h1>
        <p className="mt-4 text-[17px] leading-relaxed text-muted">
          {placed} institutions across {list.length} cities. Spin the globe, filter by type, and click a centre to see who is based there.
        </p>
      </header>
      <div className="mt-10">
        <Globe cities={list} categories={categories} />
      </div>
    </div>
  );
}
