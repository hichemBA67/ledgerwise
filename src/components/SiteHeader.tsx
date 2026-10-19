"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GitHubIcon, Logo } from "./icons";
import { SearchPalette, type SearchItem } from "./SearchPalette";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "/ecosystem", label: "Ecosystem" },
  { href: "/ecosystem#database", label: "Database" },
  { href: "/players", label: "Players" },
  { href: "/globe", label: "Globe" },
  { href: "/products", label: "Products" },
  { href: "/learn", label: "Curriculum" },
];

const MORE = [
  { href: "/map", label: "Finance map" },
  { href: "/compare", label: "Compare" },
  { href: "/timeline", label: "Timeline" },
  { href: "/glossary", label: "Glossary" },
];

export function SiteHeader({ searchItems, repo }: { searchItems: SearchItem[]; repo: string }) {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setMenu(false)}>
          <Logo />
          <span className="font-serif text-[20px] font-medium tracking-tight text-ink">
            RL1 <span className="text-muted">Ecosystem Hub</span>
          </span>
        </Link>
        <nav className="ml-2 hidden items-center gap-0.5 lg:flex">
          {NAV.map((n) => {
            const active = pathname === n.href || pathname.startsWith(n.href + "/");
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-[14px] font-medium transition ${active ? "text-ink" : "text-muted hover:text-ink"}`}
              >
                {n.label}
                {active ? <span className="mx-auto mt-0.5 block h-0.5 w-4 rounded-full bg-accent" /> : null}
              </Link>
            );
          })}
          <details className="group relative">
            <summary className="cursor-pointer list-none rounded-lg px-3 py-2 text-[14px] font-medium text-muted transition hover:text-ink">More</summary>
            <div className="absolute right-0 z-50 mt-1 w-40 rounded-xl border border-line bg-surface p-1 shadow-lg">
              {MORE.map((m) => (
                <Link key={m.href} href={m.href} className="block rounded-lg px-3 py-2 text-[14px] text-ink hover:bg-surface-2">
                  {m.label}
                </Link>
              ))}
            </div>
          </details>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <SearchPalette items={searchItems} />
          <a
            href={repo}
            target="_blank"
            rel="noreferrer"
            aria-label="RL1 Ecosystem Hub on GitHub"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted transition hover:bg-surface hover:text-ink"
          >
            <GitHubIcon />
          </a>
          <ThemeToggle />
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={menu}
            onClick={() => setMenu((m) => !m)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted lg:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menu ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
      {menu ? (
        <nav className="border-t border-line bg-bg px-4 py-3 lg:hidden">
          {[...NAV, ...MORE].map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setMenu(false)} className="block rounded-lg px-3 py-2.5 text-[15px] font-medium text-ink hover:bg-surface">
              {n.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
