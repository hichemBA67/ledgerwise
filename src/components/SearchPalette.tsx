"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export type SearchItem = { kind: "Topic" | "Player" | "Term" | "Page" | "Product"; title: string; text: string; href: string };

export function SearchPalette({ items }: { items: SearchItem[] }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "/" && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items.filter((i) => i.kind === "Topic" || i.kind === "Page").slice(0, 8);
    const scored = items
      .map((i) => {
        const t = i.title.toLowerCase();
        const score = t === term ? 100 : t.startsWith(term) ? 60 : t.includes(term) ? 40 : i.text.toLowerCase().includes(term) ? 10 : 0;
        return { i, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);
    return scored.slice(0, 12).map((x) => x.i);
  }, [q, items]);

  function close() {
    setOpen(false);
    setQ("");
    setSel(0);
  }

  function go(item: SearchItem | undefined) {
    if (!item) return;
    close();
    router.push(item.href);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 items-center gap-2 rounded-lg border border-line bg-surface/70 px-3 text-[13px] text-muted transition hover:text-ink md:w-36 xl:w-64"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <span className="hidden whitespace-nowrap md:inline">Search<span className="hidden xl:inline"> topics, players…</span></span>
        <kbd className="ml-auto hidden rounded border border-line px-1.5 font-mono text-[10px] md:inline">⌘K</kbd>
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-[12vh] backdrop-blur-sm" onClick={close}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setSel(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") close();
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setSel((s) => Math.min(s + 1, results.length - 1));
                }
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setSel((s) => Math.max(s - 1, 0));
                }
                if (e.key === "Enter") go(results[sel]);
              }}
              placeholder="Search repo, BUIDL, T+1, custody, Euroclear…"
              className="w-full border-b border-line bg-transparent px-5 py-4 text-[16px] text-ink outline-none placeholder:text-faint"
            />
            <ul className="max-h-[55vh] overflow-y-auto p-2">
              {results.length === 0 ? <li className="px-3 py-6 text-center text-[14px] text-muted">No results for “{q}”</li> : null}
              {results.map((r, i) => (
                <li key={r.kind + r.href + r.title}>
                  <button
                    type="button"
                    onMouseEnter={() => setSel(i)}
                    onClick={() => go(r)}
                    className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left ${i === sel ? "bg-accent-soft/70" : ""}`}
                  >
                    <span className="mt-0.5 w-14 shrink-0 font-mono text-[10px] uppercase tracking-wider text-faint">{r.kind}</span>
                    <span className="min-w-0">
                      <span className="block text-[14px] font-medium text-ink">{r.title}</span>
                      <span className="block truncate text-[12.5px] text-muted">{r.text}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
