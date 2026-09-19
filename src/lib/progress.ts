"use client";

import { useSyncExternalStore } from "react";

const KEY = "ledgerwise:progress:v1";

export type Progress = {
  completed: Record<string, number>;
  quiz: Record<string, { score: number; total: number }>;
};

const EMPTY: Progress = { completed: {}, quiz: {} };
let cache: Progress | null = null;
const listeners = new Set<() => void>();

function load(): Progress {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return { completed: parsed.completed ?? {}, quiz: parsed.quiz ?? {} };
  } catch {
    return EMPTY;
  }
}

function snapshot(): Progress {
  if (cache === null) cache = load();
  return cache;
}

function write(next: Progress) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable (private mode); progress stays in memory for this session.
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

export function useProgress() {
  return useSyncExternalStore(subscribe, snapshot, () => EMPTY);
}

export function setCompleted(slug: string, done: boolean) {
  const cur = snapshot();
  const completed = { ...cur.completed };
  if (done) completed[slug] = Date.now();
  else delete completed[slug];
  write({ ...cur, completed });
}

export function recordQuiz(slug: string, score: number, total: number) {
  const cur = snapshot();
  const prev = cur.quiz[slug];
  if (prev && prev.score >= score) return;
  write({ ...cur, quiz: { ...cur.quiz, [slug]: { score, total } } });
}

export function resetProgress() {
  write(EMPTY);
}
