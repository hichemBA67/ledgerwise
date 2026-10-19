import { useSyncExternalStore } from "react";
import type { Rl1Group } from "@/content/rl1";

/** Validated categorical palette (dataviz reference), one step per mode. */
const PALETTE: Record<"light" | "dark", Record<Rl1Group, string>> = {
  light: { members: "#2a78d6", ecosystem: "#eb6834", adjacent: "#1baf7a", supporters: "#eda100", public: "#e87ba4", peers: "#008300", ops: "#4a3aa7", prospects: "#e34948" },
  dark: { members: "#3987e5", ecosystem: "#d95926", adjacent: "#199e70", supporters: "#c98500", public: "#d55181", peers: "#008300", ops: "#9085e9", prospects: "#e66767" },
};

export function isDarkMode() {
  return typeof document !== "undefined" && document.documentElement.classList.contains("dark");
}

export function groupColor(g: Rl1Group, dark = isDarkMode()) {
  return PALETTE[dark ? "dark" : "light"][g];
}

export function cssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Calls `fn` whenever the site theme (html.dark) flips. */
export function onThemeChange(fn: () => void) {
  const mo = new MutationObserver(fn);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => mo.disconnect();
}

/** For DOM swatches: resolves per theme via the --rl1-* tokens in globals.css. */
export function groupVar(g: Rl1Group) {
  return `var(--rl1-${g})`;
}

let webglCache: boolean | null = null;
const noop = () => () => {};

function detectWebGL() {
  if (webglCache === null) {
    try {
      const c = document.createElement("canvas");
      webglCache = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webglCache = false;
    }
  }
  return webglCache;
}

/** True on the server and wherever WebGL works. */
export function useWebGL() {
  return useSyncExternalStore(noop, detectWebGL, () => true);
}
