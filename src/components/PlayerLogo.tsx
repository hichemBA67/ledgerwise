"use client";

import { useState } from "react";
import logos from "@/content/logos.json";

/** domain → logo file in /public/logos (see `npm run logos`). */
const manifest = logos as Record<string, { file: string; light?: boolean }>;

function hue(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}

function initials(name: string) {
  return name
    .replace(/\(.*\)/, "")
    .split(/\s+/)
    .filter((w) => /[A-Za-z0-9]/.test(w[0] ?? ""))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function PlayerLogo({ name, domain, size = 40 }: { name: string; domain: string; size?: number }) {
  const entry = manifest[domain];
  const [broken, setBroken] = useState(false);

  if (!entry || broken) {
    const h = hue(domain);
    return (
      <span
        className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line font-semibold text-white"
        style={{ width: size, height: size, background: `hsl(${h} 42% 38%)`, fontSize: size * 0.36 }}
        title={name}
        aria-label={`${name} logo`}
      >
        {initials(name)}
      </span>
    );
  }

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line"
      style={{ width: size, height: size, background: entry.light ? "#1b1f27" : "#fff" }}
      title={name}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/logos/${entry.file}`}
        alt={`${name} logo`}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className="h-[74%] w-[74%] object-contain"
        onError={() => setBroken(true)}
      />
    </span>
  );
}
