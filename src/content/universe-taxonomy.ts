import type { Rl1Layer } from "./rl1";

/**
 * The ecosystem universe: every institution in scope, from public registers plus a curated layer.
 * Built by `npm run universe` (scripts/fetch-universe.ts) into src/content/universe.json.
 */

export type UCategory =
  | "bank-si"
  | "bank-lsi"
  | "bank-intl"
  | "central-bank"
  | "regulator"
  | "csd"
  | "ccp"
  | "venue"
  | "dlt-fmi"
  | "network"
  | "casp"
  | "emt"
  | "cex"
  | "dapp"
  | "custodian"
  | "digital-custody"
  | "asset-manager"
  | "infra-tech"
  | "issuer"
  | "industry-body";

export type Fit = "high" | "medium" | "low" | "na";

export type UGeo = "city" | "capital" | "none";

export type URecord = {
  id: string;
  name: string;
  cat: UCategory;
  layer: Rl1Layer;
  /** ISO 3166-1 alpha-2, empty for on-chain entities. */
  cc: string;
  country: string;
  city: string;
  lat: number | null;
  lng: number | null;
  /** How precise the location is: HQ city, country capital fallback, or none (on-chain). */
  geo: UGeo;
  lei?: string;
  web?: string;
  /** Every source the institution appears in (ids from SOURCES in universe-sources.json). */
  srcs: string[];
  /** Register reference, e.g. MIC codes, ECB size band, MiCA service codes, DefiLlama TVL. */
  ref?: string;
  fit: Fit;
  /** Matches an entity in the detailed RL1 map (src/content/rl1.ts). */
  core?: string;
};

export type USource = {
  id: string;
  label: string;
  publisher: string;
  url: string;
  fetchedAt: string;
  /** Rows in the raw source. */
  rows: number;
  /** Institutions kept after the inclusion rule and de-duplication. */
  kept: number;
  rule: string;
};

export const CATEGORIES: { id: UCategory; label: string; layer: Rl1Layer; fitRule: string }[] = [
  { id: "bank-si", label: "Bank · significant (ECB-supervised)", layer: "access-participants", fitRule: "High: euro-area significant institution, the core membership pool." },
  { id: "bank-lsi", label: "Bank · less significant (euro area)", layer: "access-participants", fitRule: "Medium: direct member possible, more often reaches RL1 via a central institution." },
  { id: "bank-intl", label: "Bank · outside the euro area", layer: "access-participants", fitRule: "Medium in EEA/UK/CH (SCE membership open to EU entities and branches); low elsewhere." },
  { id: "central-bank", label: "Central bank", layer: "governance", fitRule: "Not applicable: settlement provider or overseer, not a member." },
  { id: "regulator", label: "Regulator / supervisor", layer: "governance", fitRule: "Not applicable." },
  { id: "csd", label: "CSD / ICSD", layer: "asset-securities", fitRule: "High in EEA (issuer CSD or registrar role); low elsewhere." },
  { id: "ccp", label: "CCP / clearing house", layer: "service-market", fitRule: "High in EEA (collateral and margin use cases); low elsewhere." },
  { id: "venue", label: "Exchange / trading venue", layer: "service-market", fitRule: "Medium in EEA (regulated market, MTF, OTF, SME growth market); low elsewhere." },
  { id: "dlt-fmi", label: "DLT market infrastructure / tokenisation platform", layer: "asset-securities", fitRule: "Medium in EEA (could issue or settle on RL1, often competes); low elsewhere." },
  { id: "network", label: "DLT network / public chain", layer: "platform-ledger", fitRule: "Not applicable: peer ledger, an interoperability target." },
  { id: "casp", label: "Crypto-asset service provider (MiCA)", layer: "service-market", fitRule: "Medium: MiCA-authorised, could offer custody, trading or settlement of RL1 assets." },
  { id: "emt", label: "E-money token / stablecoin issuer", layer: "asset-cash", fitRule: "High in EEA (on-chain cash leg); low elsewhere." },
  { id: "cex", label: "Centralised crypto exchange", layer: "service-market", fitRule: "Low: distribution channel, no access to a permissioned bank ledger." },
  { id: "dapp", label: "dApp / DeFi protocol", layer: "service-dapps", fitRule: "Low: public-chain application; medium for tokenised real-world-asset (RWA) protocols." },
  { id: "custodian", label: "Custodian / asset servicer", layer: "service-market", fitRule: "High in EEA (asset servicing on RL1); medium elsewhere." },
  { id: "digital-custody", label: "Digital-asset custody & wallet technology", layer: "access-wallets", fitRule: "Medium: key management and wallets for members." },
  { id: "asset-manager", label: "Asset manager / asset owner", layer: "access-participants", fitRule: "Medium in EEA (tokenised funds, collateral); low elsewhere." },
  { id: "infra-tech", label: "Market technology, data & messaging", layer: "service-tech", fitRule: "Medium: integration vendor or data provider." },
  { id: "issuer", label: "Issuer (corporate, sovereign, supranational)", layer: "asset-securities", fitRule: "Medium in EEA (issues digital securities on RL1); low elsewhere." },
  { id: "industry-body", label: "Industry body / standard setter", layer: "governance", fitRule: "Not applicable." },
];

export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<UCategory, (typeof CATEGORIES)[number]>;

/** EEA + UK + CH: the jurisdictions where RL1 membership is realistic. */
export const NEAR_EU = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  "IS", "LI", "NO", "GB", "CH",
]);

export function fitFor(cat: UCategory, cc: string, opts: { rwa?: boolean } = {}): Fit {
  const eu = NEAR_EU.has(cc);
  switch (cat) {
    case "bank-si":
      return "high";
    case "bank-lsi":
      return "medium";
    case "bank-intl":
      return eu ? "medium" : "low";
    case "csd":
    case "ccp":
    case "emt":
      return eu ? "high" : "low";
    case "custodian":
      return eu ? "high" : "medium";
    case "venue":
    case "dlt-fmi":
    case "asset-manager":
    case "issuer":
      return eu ? "medium" : "low";
    case "casp":
    case "digital-custody":
    case "infra-tech":
      return "medium";
    case "cex":
      return "low";
    case "dapp":
      return opts.rwa ? "medium" : "low";
    default:
      return "na";
  }
}

export const FIT_LABEL: Record<Fit, string> = { high: "High", medium: "Medium", low: "Low", na: "n/a" };
