export type TrackId =
  | "foundations"
  | "money-markets"
  | "fixed-income"
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
  | { type: "widget"; kind: WidgetKind };

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
  | "Data & Rating";

export type Region = "Americas" | "Europe" | "Asia-Pacific" | "Middle East" | "Global";

export type Player = {
  id: string;
  name: string;
  domain: string;
  category: PlayerCategory;
  region: Region;
  hq: string;
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
