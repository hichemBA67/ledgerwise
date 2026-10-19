import data from "./universe.json";
import sources from "./universe-sources.json";
import { CATEGORIES, type UCategory, type URecord, type USource } from "./universe-taxonomy";

export const universe = data as URecord[];
export const universeSources = sources as USource[];
export const UNIVERSE_AS_OF = universeSources.map((s) => s.fetchedAt).filter((d) => /^\d{4}-/.test(d)).sort().at(-1)?.slice(0, 10) ?? "";

/** Five macro groups for maps and charts (fixed categorical order). */
export type Macro = "banks" | "fmi" | "crypto" | "public" | "buyside";
export const MACROS: { id: Macro; label: string; cats: UCategory[] }[] = [
  { id: "banks", label: "Banks", cats: ["bank-si", "bank-lsi", "bank-intl"] },
  { id: "fmi", label: "Market infrastructure", cats: ["csd", "ccp", "venue", "dlt-fmi", "custodian"] },
  { id: "crypto", label: "Crypto & on-chain", cats: ["casp", "emt", "cex", "dapp", "network", "digital-custody"] },
  { id: "public", label: "Public sector & standards", cats: ["central-bank", "regulator", "industry-body"] },
  { id: "buyside", label: "Investors, issuers & vendors", cats: ["asset-manager", "issuer", "infra-tech"] },
];
export const macroOf = (c: UCategory): Macro => MACROS.find((m) => m.cats.includes(c))!.id;

export const categoryLabel = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label])) as Record<UCategory, string>;
export const sourceLabel = Object.fromEntries(universeSources.map((s) => [s.id, s.label]));
