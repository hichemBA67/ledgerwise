import { foundations } from "./topics/foundations";
import { moneyMarkets } from "./topics/money-markets";
import { fixedIncome } from "./topics/fixed-income";
import { infrastructure } from "./topics/infrastructure";
import { tokenization } from "./topics/tokenization";
import { tokenizedAssets } from "./topics/tokenized-assets";
import { regulation } from "./topics/regulation";
import { tracks } from "./tracks";
import type { Topic, TrackId } from "./types";

const tokenOrder = [
  "tokenization-101",
  "blockchain-for-finance",
  "stablecoins-and-tokenized-cash",
  "tokenized-bonds",
  "tokenized-money-market-funds",
  "tokenized-repo-and-collateral",
  "digital-asset-custody",
  "atomic-settlement-and-dlt-fmi",
  "tokenized-private-credit-and-rwa",
];

const tokenTopics = [...tokenization, ...tokenizedAssets].sort(
  (a, b) => tokenOrder.indexOf(a.slug) - tokenOrder.indexOf(b.slug),
);

/** Topics in curriculum order: tracks in order, topics in authored order. */
export const topics: Topic[] = [
  ...foundations,
  ...moneyMarkets,
  ...fixedIncome,
  ...infrastructure,
  ...tokenTopics,
  ...regulation,
];

const files: [Topic[], string][] = [
  [foundations, "foundations"],
  [moneyMarkets, "money-markets"],
  [fixedIncome, "fixed-income"],
  [infrastructure, "infrastructure"],
  [tokenization, "tokenization"],
  [tokenizedAssets, "tokenized-assets"],
  [regulation, "regulation"],
];

const sourceFiles = new Map(
  files.flatMap(([list, file]) => list.map((t) => [t.slug, `src/content/topics/${file}.ts`] as const)),
);

export function topicSourceFile(slug: string) {
  return sourceFiles.get(slug) ?? "src/content/topics";
}

export const topicBySlug = new Map(topics.map((t) => [t.slug, t]));

export function getTopic(slug: string) {
  return topicBySlug.get(slug);
}

export function topicsForTrack(id: TrackId) {
  return topics.filter((t) => t.track === id);
}

export function neighbours(slug: string) {
  const i = topics.findIndex((t) => t.slug === slug);
  return { prev: topics[i - 1], next: topics[i + 1] };
}

export { tracks };
