"use client";

import { useSyncExternalStore } from "react";

const KEY = "ledgerwise:build:v1";

/** productSlug → ticked step ids */
export type Checked = Record<string, string[]>;

const EMPTY: Checked = {};
let cache: Checked | null = null;
const listeners = new Set<() => void>();

function load(): Checked {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Checked) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function snapshot(): Checked {
  if (cache === null) cache = load();
  return cache;
}

function write(next: Checked) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable; ticks stay in memory for this session.
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = load();
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useChecked(slug: string): string[] {
  const all = useSyncExternalStore(subscribe, snapshot, () => EMPTY);
  return all[slug] ?? [];
}

export function toggleStep(slug: string, stepId: string) {
  const all = snapshot();
  const cur = all[slug] ?? [];
  const next = cur.includes(stepId) ? cur.filter((s) => s !== stepId) : [...cur, stepId];
  write({ ...all, [slug]: next });
}

export function resetChecklist(slug: string) {
  const rest = Object.fromEntries(Object.entries(snapshot()).filter(([k]) => k !== slug));
  write(rest);
}
