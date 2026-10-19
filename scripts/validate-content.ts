/**
 * Validates cross-references in the content layer. Run with `npm run validate`.
 * Fails CI when a lesson links to a missing topic, player or quiz answer.
 */
import { allAuthoredTopics, curriculumOrder, topics } from "../src/content";
import { categoryCoords, mapNodes, topicCoords } from "../src/content/map";
import { products } from "../src/content/products";
import { cities } from "../src/content/cities";
import { glossary } from "../src/content/glossary";
import { players } from "../src/content/players";
import * as rl1 from "../src/content/rl1";
import { universe, universeSources } from "../src/content/universe";
import { CATEGORY_BY_ID } from "../src/content/universe-taxonomy";
import { milestones } from "../src/content/timeline";
import { tracks } from "../src/content/tracks";

const errors: string[] = [];
const slugs = new Set<string>();
const playerIds = new Set(players.map((p) => p.id));
const trackIds = new Set(tracks.map((t) => t.id));

for (const t of allAuthoredTopics) {
  if (slugs.has(t.slug)) errors.push(`Duplicate topic slug: ${t.slug}`);
  slugs.add(t.slug);
}
for (const s of curriculumOrder) if (!slugs.has(s)) errors.push(`curriculumOrder references missing topic: ${s}`);
for (const t of allAuthoredTopics) if (!curriculumOrder.includes(t.slug)) errors.push(`Topic missing from curriculumOrder: ${t.slug}`);
if (topics.length !== allAuthoredTopics.length) errors.push(`Ordered topics (${topics.length}) != authored topics (${allAuthoredTopics.length})`);

const productSlugs = new Set(products.map((p) => p.slug));
for (const p of products) {
  const at = `[product ${p.slug}]`;
  const ids = new Set(p.parties.map((x) => x.id));
  for (const f of p.flows) {
    if (!ids.has(f.from)) errors.push(`${at} flow from unknown party ${f.from}`);
    if (!ids.has(f.to)) errors.push(`${at} flow to unknown party ${f.to}`);
  }
  for (const s of p.lessons) if (!slugs.has(s)) errors.push(`${at} unknown lesson ${s}`);
  for (const id of p.players) if (!playerIds.has(id)) errors.push(`${at} unknown player ${id}`);
  for (const id of p.tokenized?.examples ?? []) if (!playerIds.has(id)) errors.push(`${at} tokenized example unknown player ${id}`);
  for (const party of p.parties) if (party.example && !playerIds.has(party.example)) errors.push(`${at} party ${party.id} names unknown player ${party.example}`);
  if (!p.build) errors.push(`${at} missing build recipe in products-build-*.ts`);
  else {
    const PHASES = ["legal", "ledger", "identity", "cash", "custody", "lifecycle", "interop", "controls"];
    if (p.build.steps.length < 4) errors.push(`${at} build recipe needs at least four steps`);
    const seen = new Set<string>();
    for (const st of p.build.steps) {
      if (!PHASES.includes(st.id)) errors.push(`${at} build step uses unknown phase "${st.id}"`);
      if (seen.has(st.id)) errors.push(`${at} build phase "${st.id}" appears twice`);
      seen.add(st.id);
      if (!st.do.length) errors.push(`${at} build step "${st.id}" has no actions`);
    }
    for (const pre of p.build.prereqs) if (pre.product && !productSlugs.has(pre.product)) errors.push(`${at} build prereq → unknown product ${pre.product}`);
    for (const pre of p.build.precedents) for (const id of pre.players) if (!playerIds.has(id)) errors.push(`${at} build precedent → unknown player ${id}`);
  }
  if (!p.why) errors.push(`${at} missing "why" entry in products-why.ts`);
  else {
    if (p.why.problem.length < 80) errors.push(`${at} "why.problem" is too short to explain anything`);
    if (p.why.users.length < 2) errors.push(`${at} needs at least two "who needs it" entries`);
  }
  if (!p.coords.layers.length || !p.coords.stages.length) errors.push(`${at} incomplete map coordinates`);
}

for (const n of mapNodes) {
  const at = `[map node ${n.id}]`;
  for (const id of n.examples ?? []) if (!playerIds.has(id)) errors.push(`${at} unknown player ${id}`);
  for (const s of n.lessons ?? []) if (!slugs.has(s)) errors.push(`${at} unknown lesson ${s}`);
  for (const s of n.products ?? []) if (!productSlugs.has(s)) errors.push(`${at} unknown product ${s}`);
}

for (const t of allAuthoredTopics) if (!topicCoords[t.slug]) errors.push(`[map] missing coordinates for topic ${t.slug}`);
for (const s of Object.keys(topicCoords)) if (!slugs.has(s)) errors.push(`[map] coordinates for unknown topic ${s}`);
for (const p of players) {
  if (p.city && !cities[p.city]) errors.push(`[player ${p.id}] unknown city ${p.city}`);
  if (!categoryCoords[p.category]) errors.push(`[player ${p.id}] category without map coordinates: ${p.category}`);
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
    if (b.type === "diagram" && !products.some((p) => p.slug === b.product)) errors.push(`${at} diagram → unknown product ${b.product}`);
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

const rl1Ids = new Set<string>();
for (const e of rl1.entities) {
  if (rl1Ids.has(e.id)) errors.push(`Duplicate RL1 entity id: ${e.id}`);
  rl1Ids.add(e.id);
  for (const s of e.sources) if (!rl1.SOURCES[s]) errors.push(`[rl1 ${e.id}] unknown source ${s}`);
  if (Math.abs(e.lat) > 90 || Math.abs(e.lng) > 180) errors.push(`[rl1 ${e.id}] bad coordinates`);
  for (const l of e.alsoIn ?? []) if (l === e.layer) errors.push(`[rl1 ${e.id}] alsoIn repeats its primary layer ${l}`);
}
for (const ed of rl1.edges) for (const id of [ed.from, ed.to]) if (!rl1Ids.has(id)) errors.push(`[rl1 edge ${ed.from}→${ed.to}] unknown entity ${id}`);
for (const fl of rl1.flows)
  for (const st of fl.steps) {
    const e = rl1.entities.find((x) => x.id === st.node);
    if (!e) errors.push(`[rl1 flow ${fl.id}] unknown entity ${st.node}`);
    else if (st.layer && st.layer !== e.layer && !e.alsoIn?.includes(st.layer)) errors.push(`[rl1 flow ${fl.id}] ${st.node} is not in layer ${st.layer}`);
  }
for (const p of rl1.positions) if (!rl1Ids.has(p.id)) errors.push(`[rl1 position] unknown entity ${p.id}`);

const uIds = new Set<string>();
const layerIds = new Set(rl1.LAYERS.map((l) => l.id));
const srcIds = new Set(universeSources.map((x) => x.id));
for (const r of universe) {
  if (uIds.has(r.id)) errors.push(`Duplicate universe id: ${r.id}`);
  uIds.add(r.id);
  if (!CATEGORY_BY_ID[r.cat]) errors.push(`[universe ${r.id}] unknown category ${r.cat}`);
  if (!layerIds.has(r.layer)) errors.push(`[universe ${r.id}] unknown layer ${r.layer}`);
  for (const x of r.srcs) if (!srcIds.has(x)) errors.push(`[universe ${r.id}] unknown source ${x}`);
  if (r.core && !rl1Ids.has(r.core)) errors.push(`[universe ${r.id}] unknown core entity ${r.core}`);
}
for (const id of rl1Ids) if (!universe.some((r) => r.core === id)) errors.push(`[universe] RL1 entity ${id} missing from the universe`);
if (universe.length < 1000) errors.push(`Universe has ${universe.length} institutions, expected at least 1000`);

if (errors.length) {
  console.error(`✗ ${errors.length} content error(s):\n  ` + errors.join("\n  "));
  process.exit(1);
}
console.log(`✓ Content OK: ${topics.length} topics, ${products.length} products (${products.reduce((n, p) => n + p.build.steps.length, 0)} build steps), ${players.length} players (${new Set(players.filter((p) => p.city).map((p) => p.city)).size} cities), ${mapNodes.length} map nodes, ${glossary.length} terms, ${milestones.length} milestones, ${rl1.entities.length} RL1 entities (${rl1.edges.length} links), ${universe.length} universe institutions`);
