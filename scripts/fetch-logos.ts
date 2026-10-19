/**
 * Downloads a real logo for every institution in the directory and stores it
 * locally in public/logos, so the site never depends on a third-party favicon
 * service at runtime.
 *
 * Run with `npm run logos`. Writes src/content/logos.json, which maps a domain
 * to its logo file plus a `light` flag for logos that need a dark tile.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";
import { players } from "../src/content/players";
import { entities as rl1Entities } from "../src/content/rl1";

const OUT_DIR = "public/logos";
const MANIFEST = "src/content/logos.json";
const SIZE = 96;
const MIN_SOURCE_PX = 32;
/** Last resort: some institutions only publish a 16px favicon. */
const FALLBACK_SOURCE_PX = 16;
const CONCURRENCY = 8;

const sources = (domain: string) => [
  `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=256`,
  `https://${domain}/apple-touch-icon.png`,
  `https://www.${domain}/apple-touch-icon.png`,
  `https://${domain}/apple-touch-icon-precomposed.png`,
  `https://icons.duckduckgo.com/ip3/${domain}.ico`,
  `https://${domain}/favicon.ico`,
  `https://www.${domain}/favicon.ico`,
];

type Candidate = { buf: Buffer; px: number; url: string };

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";

/** Reads a site's HTML and pulls out whatever icons it declares. */
async function discoverFromHtml(domain: string): Promise<string[]> {
  const out: string[] = [];
  for (const base of [`https://${domain}`, `https://www.${domain}`]) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 9000);
      const res = await fetch(base, { signal: ctrl.signal, redirect: "follow", headers: { "user-agent": UA } });
      clearTimeout(timer);
      if (!res.ok) continue;
      const html = (await res.text()).slice(0, 400_000);
      const rels = [...html.matchAll(/<link[^>]+>/gi)]
        .filter((m) => /rel=["'][^"']*(icon|apple-touch-icon|mask-icon)/i.test(m[0]))
        .map((m) => m[0].match(/href=["']([^"']+)["']/i)?.[1])
        .filter((h): h is string => Boolean(h));
      const og = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1];
      for (const href of [...rels, ...(og ? [og] : [])]) {
        try {
          out.push(new URL(href, res.url || base).toString());
        } catch {
          /* ignore malformed href */
        }
      }
      if (out.length) break;
    } catch {
      /* site unreachable */
    }
  }
  // Bigger icons first: apple-touch-icons and files with a size in the name.
  return out
    .filter((u) => !u.endsWith(".svg"))
    .sort((a, b) => score(b) - score(a))
    .slice(0, 6);
}

const score = (u: string) => {
  const n = Number(u.match(/(\d{2,4})x?\1?/)?.[1] ?? 0);
  return (/apple-touch/i.test(u) ? 500 : 0) + (/og[-_]?image|logo/i.test(u) ? 200 : 0) + n;
};

async function tryFetch(url: string, minPx = MIN_SOURCE_PX): Promise<Candidate | null> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 9000);
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: { "user-agent": UA },
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 100) return null;
    const meta = await sharp(buf, { pages: 1 }).metadata();
    const px = Math.max(meta.width ?? 0, meta.height ?? 0);
    if (px < minPx) return null;
    return { buf, px, url };
  } catch {
    return null;
  }
}

/** Rejects blank images and flags logos that are too light for a white tile. */
async function analyse(buf: Buffer) {
  const { data, info } = await sharp(buf, { pages: 1 })
    .resize(64, 64, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let opaque = 0;
  let lum = 0;
  let minL = 1;
  let maxL = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    const a = data[i + 3] / 255;
    if (a < 0.35) continue;
    opaque++;
    const l = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
    lum += l;
    minL = Math.min(minL, l);
    maxL = Math.max(maxL, l);
  }
  const total = 64 * 64;
  const coverage = opaque / total;
  const mean = opaque ? lum / opaque : 0;
  return { coverage, mean, contrast: maxL - minL };
}

async function processPlayer(p: { id: string; name: string; domain: string }) {
  const urls = [...sources(p.domain), ...(await discoverFromHtml(p.domain))];
  // Two passes: prefer a crisp icon, fall back to a small favicon if that is all there is.
  for (const minPx of [MIN_SOURCE_PX, FALLBACK_SOURCE_PX]) {
    const got = await firstUsable(urls, minPx, p.domain);
    if (got) return got;
  }
  return null;
}

async function firstUsable(urls: string[], minPx: number, domain = "") {
  for (const url of urls) {
    const cand = await tryFetch(url, minPx);
    if (!cand) continue;
    let stats;
    try {
      stats = await analyse(cand.buf);
    } catch {
      continue;
    }
    // Blank or near-empty icon: keep looking.
    if (stats.coverage < 0.03) continue;

    const file = `${domain.replace(/[^a-z0-9]+/gi, "-")}.png`;
    try {
      await sharp(cand.buf, { pages: 1 })
        .resize(SIZE, SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png({ compressionLevel: 9, palette: true })
        .toFile(`${OUT_DIR}/${file}`);
    } catch {
      continue;
    }
    // A very light logo (white wordmark on transparent) needs a dark tile.
    const light = stats.mean > 0.78 && stats.contrast < 0.75;
    return { file, light, px: cand.px, source: url };
  }
  return null;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const all = process.argv.includes("--all");
  let existing: Record<string, { file: string; light?: boolean }> = {};
  if (!all) {
    try {
      existing = JSON.parse(await readFile(MANIFEST, "utf8"));
    } catch {
      existing = {};
    }
  }
  // Players plus RL1 ecosystem entities, one entry per domain.
  const targets = [...new Map([...players, ...rl1Entities].map((p) => [p.domain, p])).values()];
  const queue = targets.filter((p) => all || !existing[p.domain]);
  console.log(`Fetching ${queue.length} logo(s)${all ? " (full refresh)" : ""}…`);
  const manifest: Record<string, { file: string; light?: boolean }> = { ...existing };
  const missing: string[] = [];
  let done = 0;

  async function worker() {
    for (;;) {
      const p = queue.shift();
      if (!p) return;
      const got = await processPlayer(p);
      done++;
      if (got) {
        manifest[p.domain] = got.light ? { file: got.file, light: true } : { file: got.file };
      } else {
        missing.push(`${p.name} (${p.domain})`);
      }
      if (done % 25 === 0) console.log(`  …${done}/${queue.length + done}`);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const sorted = Object.fromEntries(Object.keys(manifest).sort().map((k) => [k, manifest[k]]));
  await writeFile(MANIFEST, JSON.stringify(sorted, null, 2) + "\n");

  const lightCount = Object.values(manifest).filter((m) => m.light).length;
  console.log(`\n✓ ${Object.keys(manifest).length}/${targets.length} logos available (${lightCount} need a dark tile)`);
  if (missing.length) console.log(`✗ no logo for ${missing.length}:\n  ${missing.join("\n  ")}`);
}

main();
