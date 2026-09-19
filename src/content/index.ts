import { fixedIncome } from "./topics/fixed-income";
import { fixedIncomeMore } from "./topics/fixed-income-more";
import { foundations } from "./topics/foundations";
import { foundationsMore } from "./topics/foundations-more";
import { infrastructure } from "./topics/infrastructure";
import { infrastructureMore } from "./topics/infrastructure-more";
import { markets } from "./topics/markets";
import { moneyMarkets } from "./topics/money-markets";
import { moneyMarketsMore } from "./topics/money-markets-more";
import { regulation } from "./topics/regulation";
import { regulationMore } from "./topics/regulation-more";
import { tokenization } from "./topics/tokenization";
import { tokenizationMore } from "./topics/tokenization-more";
import { tokenizedAssets } from "./topics/tokenized-assets";
import { tracks } from "./tracks";
import type { Topic, TrackId } from "./types";

const files: [Topic[], string][] = [
  [foundations, "foundations"],
  [foundationsMore, "foundations-more"],
  [moneyMarkets, "money-markets"],
  [moneyMarketsMore, "money-markets-more"],
  [fixedIncome, "fixed-income"],
  [fixedIncomeMore, "fixed-income-more"],
  [markets, "markets"],
  [infrastructure, "infrastructure"],
  [infrastructureMore, "infrastructure-more"],
  [tokenization, "tokenization"],
  [tokenizedAssets, "tokenized-assets"],
  [tokenizationMore, "tokenization-more"],
  [regulation, "regulation"],
  [regulationMore, "regulation-more"],
];

/** Curriculum order. Every topic must appear here exactly once (checked by npm run validate). */
export const curriculumOrder = [
  // Foundations
  "the-finance-stack",
  "money-and-banking",
  "central-banks-and-monetary-policy",
  "how-banks-work",
  "financial-markets-map",
  "interest-rates-and-yield-curve",
  "risk-in-finance",
  // Money markets
  "money-markets",
  "repo",
  "securities-lending",
  "money-market-funds",
  "fx-swaps-and-dollar-funding",
  "prime-brokerage-and-margin",
  // Fixed income
  "bonds-basics",
  "bond-pricing-and-duration",
  "bond-issuance-and-trading",
  "government-bond-markets",
  "credit-and-ratings",
  "securitization",
  "green-and-sustainable-bonds",
  // Equities, funds & derivatives
  "equities-and-exchanges",
  "funds-etfs-and-structures",
  "derivatives-101",
  "otc-derivatives-and-swaps",
  "fx-markets",
  // Infrastructure
  "payments-and-rtgs",
  "custody",
  "asset-servicing-and-corporate-actions",
  "fund-administration-and-transfer-agency",
  "clearing-and-ccps",
  "settlement-and-csds",
  "collateral-management",
  "messaging-and-standards",
  // Tokenization
  "tokenization-101",
  "blockchain-for-finance",
  "stablecoins-and-tokenized-cash",
  "tokenized-bonds",
  "tokenized-money-market-funds",
  "tokenized-repo-and-collateral",
  "tokenized-equities-and-etfs",
  "tokenized-private-credit-and-rwa",
  "digital-asset-custody",
  "atomic-settlement-and-dlt-fmi",
  "defi-and-institutional-defi",
  "interoperability-and-bridges",
  // Regulation
  "tradfi-regulation",
  "prudential-regulation-basel",
  "tokenization-regulation",
  "aml-kyc-and-sanctions",
  "global-financial-centres",
];

const all = files.flatMap(([list]) => list);
const bySlug = new Map(all.map((t) => [t.slug, t]));

export const topics: Topic[] = curriculumOrder.map((s) => bySlug.get(s)).filter((t): t is Topic => Boolean(t));
export const allAuthoredTopics = all;

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
