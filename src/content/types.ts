import type { Why } from "./products-why";
export type TrackId =
  | "foundations"
  | "money-markets"
  | "fixed-income"
  | "markets"
  | "infrastructure"
  | "tokenization"
  | "regulation";

export type Level = "Beginner" | "Intermediate" | "Advanced";

/** Inline text supports **bold**, *italic*, `code` and [label](/href). */
export type Block =
  | { type: "h"; text: string }
  | { type: "p"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | {
      type: "callout";
      tone: "info" | "tip" | "warn" | "token";
      title: string;
      text: string;
    }
  | { type: "flow"; title?: string; steps: { label: string; detail: string }[] }
  | { type: "table"; caption?: string; headers: string[]; rows: string[][] }
  | { type: "example"; title: string; lines: string[]; result?: string }
  | {
      type: "compare";
      left: { title: string; points: string[] };
      right: { title: string; points: string[] };
    }
  | { type: "stats"; items: { value: string; label: string; source?: string }[] }
  | { type: "players"; title?: string; ids: string[] }
  | { type: "widget"; kind: WidgetKind }
  /** Embeds the flow diagram of a product from src/content/products. */
  | { type: "diagram"; product: string };

export type WidgetKind =
  | "repo"
  | "bond"
  | "seclending"
  | "settlement"
  | "mmf"
  | "waterfall";

export type QuizQuestion = {
  q: string;
  options: string[];
  answer: number;
  explain: string;
};

export type Topic = {
  slug: string;
  title: string;
  track: TrackId;
  level: Level;
  minutes: number;
  summary: string;
  objectives: string[];
  blocks: Block[];
  /** The tokenized (or traditional) counterpart of this topic. */
  bridge?: { slug: string; text: string };
  players?: string[];
  quiz: QuizQuestion[];
  sources?: { label: string; url: string }[];
};

export type Track = {
  id: TrackId;
  title: string;
  short: string;
  description: string;
  color: string;
  icon: string;
};

export type PlayerCategory =
  | "Custodian"
  | "CSD / ICSD"
  | "CCP / Clearing"
  | "Tri-party & Collateral"
  | "Bank / Dealer"
  | "Asset Manager"
  | "Tokenization Platform"
  | "DLT Network"
  | "Stablecoin / Cash Token"
  | "Digital Asset Custody"
  | "Exchange / Venue"
  | "Central Bank / Regulator"
  | "Data & Rating"
  | "Payments & Messaging"
  | "Market Technology"
  | "Industry Body"
  | "Asset Owner"
  | "Issuer";

export type Region = "Americas" | "Europe" | "Asia-Pacific" | "Middle East" | "Global";

export type Player = {
  id: string;
  name: string;
  domain: string;
  category: PlayerCategory;
  region: Region;
  hq: string;
  /** Key into src/content/cities.ts; omitted for decentralised networks. */
  city?: string;
  what: string;
  tokenization?: string;
  topics: string[];
};

export type Jurisdiction = {
  id: string;
  name: string;
  flag: string;
  rows: Record<string, string>;
  highlights: string[];
};

export type GlossaryTerm = { term: string; def: string; topic?: string };

export type Milestone = {
  year: number;
  date: string;
  title: string;
  text: string;
  kind: "Bond" | "Fund" | "Repo / Collateral" | "Cash" | "Infrastructure" | "Regulation";
  players?: string[];
};

/* ---------- Mental model ---------- */

export type Layer = "users" | "products" | "markets" | "intermediaries" | "infrastructure" | "money" | "oversight";
export type Stage = "issue" | "trade" | "clear" | "settle" | "service" | "finance";
export type AssetClass = "cash" | "money-market" | "fixed-income" | "equity" | "funds" | "derivatives" | "fx" | "digital";

export type Coords = { layers: Layer[]; stages: Stage[]; assets: AssetClass[] };

export type MapNode = Coords & {
  id: string;
  label: string;
  desc: string;
  tokenized?: string;
  examples?: string[];
  lessons?: string[];
  products?: string[];
};

/* ---------- Products & services ---------- */

export type ProductFamily =
  | "Money & Payments"
  | "Money Market"
  | "Financing"
  | "Bonds"
  | "Equity & Funds"
  | "Derivatives"
  | "Infrastructure Services"
  | "Tokenized";

export type FlowKind = "cash" | "asset" | "collateral" | "info" | "risk";

/** One step of a product's "build it tokenized" recipe. */
export type BuildStep = {
  /** Canonical phase id, shared across products: legal, ledger, identity, cash, custody, lifecycle, interop, controls. */
  id: string;
  title: string;
  /** Concrete things to do, in order. */
  do: string[];
  /** The decision or trade-off this step turns on. */
  decide?: string;
  /** The classic mistake. */
  watch?: string;
};

export type BuildRecipe = {
  /** What you are actually building, in one line. */
  goal: string;
  prereqs: { label: string; product?: string }[];
  steps: BuildStep[];
  /** The smallest thing worth shipping. */
  mvp: string;
  /** The part that actually blocks projects. */
  hard: string;
  precedents: { what: string; players: string[] }[];
};

export type Product = {
  slug: string;
  name: string;
  family: ProductFamily;
  kind: "Product" | "Service";
  short: string;
  what: string;
  issuer: string;
  holders: string;
  /** Typical tenor in days (for the tenor/risk map); omitted for services. */
  tenorDays?: number;
  tenor: string;
  size?: string;
  /** 1 (low) – 5 (high) */
  risk: { credit: number; market: number; liquidity: number; complexity: number };
  where: { trade: string; clear: string; settle: string; hold: string };
  /** `example` is a player id: the real institution that typically plays this role. */
  parties: { id: string; label: string; sub?: string; example?: string }[];
  flows: { from: string; to: string; label: string; kind: FlowKind; phase: string }[];
  /** Plain-language reason the product exists (see products-why.ts). */
  why: Why;
  /** Step-by-step recipe for building the tokenized version (see products-build-*.ts). */
  build: BuildRecipe;
  keyPoints: string[];
  tokenized?: { text: string; examples: string[] };
  coords: Coords;
  lessons: string[];
  players: string[];
};

export type City = { name: string; country: string; lat: number; lng: number };
