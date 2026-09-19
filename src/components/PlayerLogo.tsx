"use client";

import { useState } from "react";

function sources(domain: string) {
  return [
    `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
  ];
}

function hue(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}

export function PlayerLogo({
  name,
  domain,
  size = 40,
}: {
  name: string;
  domain: string;
  size?: number;
}) {
  const [attempt, setAttempt] = useState(0);
  const srcs = sources(domain);
  const initials = name
    .replace(/\(.*\)/, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const h = hue(domain);

  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-white"
      style={{ width: size, height: size }}
      title={name}
    >
      {attempt < srcs.length ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={attempt}
          src={srcs[attempt]}
          alt={`${name} logo`}
          width={size}
          height={size}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-[72%] w-[72%] object-contain"
          ref={(el) => {
            // Handles images that finished loading before hydration attached onLoad/onError.
            if (el?.complete && el.naturalWidth < 32) setAttempt((a) => a + 1);
          }}
          onError={() => setAttempt((a) => a + 1)}
          onLoad={(e) => {
            // Favicon services return a tiny generic globe when a site has no icon.
            if (e.currentTarget.naturalWidth < 32) setAttempt((a) => a + 1);
          }}
        />
      ) : (
        <span
          className="flex h-full w-full items-center justify-center font-semibold text-white"
          style={{ background: `hsl(${h} 55% 42%)`, fontSize: size * 0.36 }}
          aria-label={`${name} logo`}
        >
          {initials}
        </span>
      )}
    </span>
  );
}
