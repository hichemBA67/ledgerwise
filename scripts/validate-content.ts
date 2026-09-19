/**
 * Validates cross-references in the content layer. Run with `npm run validate`.
 * Fails CI when a lesson links to a missing topic, player or quiz answer.
 */
import { topics } from "../src/content";
import { glossary } from "../src/content/glossary";
import { players } from "../src/content/players";
import { milestones } from "../src/content/timeline";
import { tracks } from "../src/content/tracks";

const errors: string[] = [];
const slugs = new Set<string>();
const playerIds = new Set(players.map((p) => p.id));
const trackIds = new Set(tracks.map((t) => t.id));

for (const t of topics) {
  if (slugs.has(t.slug)) errors.push(`Duplicate topic slug: ${t.slug}`);
  slugs.add(t.slug);
}

for (const t of topics) {
  const at = `[topic ${t.slug}]`;
  if (!trackIds.has(t.track)) errors.push(`${at} unknown track ${t.track}`);
  if (t.bridge && !slugs.has(t.bridge.slug)) errors.push(`${at} bridge → missing topic ${t.bridge.slug}`);
  if (!t.blocks.some((b) => b.type === "h")) errors.push(`${at} has no section headings`);
  if (t.quiz.length < 1) errors.push(`${at} has no quiz`);
  t.quiz.forEach((q, i) => {
    if (q.answer < 0 || q.answer >= q.options.length) errors.push(`${at} quiz Q${i + 1} answer index out of range`);
  });
  for (const id of t.players ?? []) if (!playerIds.has(id)) errors.push(`${at} unknown player ${id}`);
  for (const b of t.blocks) {
    if (b.type === "players") for (const id of b.ids) if (!playerIds.has(id)) errors.push(`${at} players block → unknown ${id}`);
    if (b.type === "table") b.rows.forEach((r, i) => r.length !== b.headers.length && errors.push(`${at} table row ${i} has ${r.length} cells, expected ${b.headers.length}`));
    const texts = b.type === "p" || b.type === "callout" ? [b.text] : b.type === "list" ? b.items : [];
    for (const text of texts) for (const m of text.matchAll(/\]\(\/learn\/([^)#]+)\)/g)) if (!slugs.has(m[1])) errors.push(`${at} inline link → missing topic ${m[1]}`);
  }
}

const ids = new Set<string>();
for (const p of players) {
  if (ids.has(p.id)) errors.push(`Duplicate player id: ${p.id}`);
  ids.add(p.id);
  for (const s of p.topics) if (!slugs.has(s)) errors.push(`[player ${p.id}] unknown topic ${s}`);
}
for (const g of glossary) if (g.topic && !slugs.has(g.topic)) errors.push(`[glossary ${g.term}] unknown topic ${g.topic}`);
for (const m of milestones) for (const id of m.players ?? []) if (!playerIds.has(id)) errors.push(`[timeline ${m.title}] unknown player ${id}`);

if (errors.length) {
  console.error(`✗ ${errors.length} content error(s):\n  ` + errors.join("\n  "));
  process.exit(1);
}
console.log(`✓ Content OK: ${topics.length} topics, ${players.length} players, ${glossary.length} terms, ${milestones.length} milestones`);
