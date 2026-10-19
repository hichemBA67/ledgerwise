/**
 * Regulated Layer One (RL1) ecosystem: entities, relationships, flows and blind spots.
 *
 * Every entity and edge carries an evidence grade:
 * - confirmed: stated by RL1, SWIAT, the ECB or the entity itself
 * - reported:  stated by trade press (Ledger Insights, etc.) or listed without detail
 * - inferred:  our reading of public facts; no source states it directly
 *
 * Snapshot date: 3 October 2026.
 */

export const RL1_AS_OF = "2026-10-03";

export type Rl1Relation =
  | "platform"
  | "founding"
  | "joining"
  | "supporter"
  | "observer"
  | "operator"
  | "validator"
  | "ecosystem"
  | "public"
  | "adjacent"
  | "peer"
  | "prospect"
  | "former";

/**
 * Layers follow the Access / Service / Asset / Platform ("ASAP") stack from MAS Project Guardian's
 * interoperable-networks work, split one level deeper, with governance as the foundation.
 */
export type Rl1Layer =
  | "governance"
  | "platform-ledger"
  | "platform-nodes"
  | "asset-cash"
  | "asset-securities"
  | "service-tech"
  | "service-dapps"
  | "service-market"
  | "access-wallets"
  | "access-participants";

export type Evidence = "confirmed" | "reported" | "inferred";

export type Rl1Entity = {
  id: string;
  name: string;
  short?: string;
  domain: string;
  type: string;
  layer: Rl1Layer;
  rel: Rl1Relation;
  /** Also runs a validator node on RL1. */
  validator?: boolean;
  /** Other layers this entity also acts in (drawn as linked ghost nodes in 3D). */
  alsoIn?: Rl1Layer[];
  country: string;
  city: string;
  lat: number;
  lng: number;
  what: string;
  role: string;
  evidence: Evidence;
  sources: string[];
};

export type EdgeKind = "governance" | "ops" | "ownership" | "transaction" | "cash" | "vendor" | "regulation" | "peer" | "potential";

export type Rl1Edge = { from: string; to: string; kind: EdgeKind; label: string; evidence: Evidence };

export const SOURCES: Record<string, { label: string; url: string }> = {
  rl1: { label: "rl1.network", url: "https://www.rl1.network/" },
  rl1launch: { label: "RL1 launch release, 28 Jul 2026", url: "https://www.rl1.network/news/rl1-launch/" },
  li_launch: { label: "Ledger Insights: Cecabank, Crédit Mutuel join RL1 as it launches", url: "https://www.ledgerinsights.com/cecabank-credit-mutuel-join-regulated-layer-one-tokenization-platform-as-it-launches/" },
  li_2025: { label: "Ledger Insights: 10 institutions launch RL1 (Sep 2025)", url: "https://www.ledgerinsights.com/10-eu-banks-launch-regulated-layer-1-blockchain-network-for-tokenization/" },
  kfw2025: { label: "KfW: RL1 initiative to start with 10 institutions (29 Sep 2025)", url: "https://www.kfw.de/About-KfW/Newsroom/Latest-News/News-Details_864832.html" },
  swiatpress: { label: "SWIAT press archive", url: "https://www.swiat.io/about-us/press/" },
  adesso: { label: "adesso becomes a validator for SWIAT", url: "https://www.adesso.de/en/news/presse/adesso-becomes-a-validator-for-swiat-blockchains.jsp" },
  itfm: { label: "IT-Finanzmagazin: SWIAT gains four validators (Sep 2023)", url: "https://www.it-finanzmagazin.de/swiat-gewinnt-vier-validatoren-fuer-finanz-blockchains-160786" },
  deka_cb: { label: "Deka: Natixis Pfandbriefbank digital covered bond on SWIAT", url: "https://www.deka.de/deka-group/media-research-en/media-releases/archive/archive2024/august-1/natixis-pfandbriefbank-and-dekabank-realise-first-digital-registered-covered-bond-on-swiat-blockchain" },
  kfw_bh: { label: "KfW: first blockchain-based investment (Apr 2025)", url: "https://www.kfw.de/About-KfW/Newsroom/Latest-News/Pressemitteilungen-Details_848192.html" },
  berlinhyp: { label: "PostTrade360: Berlin Hyp €100m digital bond on SWIAT", url: "https://posttrade360.com/news/infrastructure/berlin-hyp-to-issue-e100m-digital-bond-on-swiat-blockchain/" },
  chartered: { label: "Chartered Investment joins RL1", url: "https://chartered-investment.com/en/media/news/chartered-investment-joins-the-regulated-layer-one-rl1-initiative/" },
  seturion: { label: "Blockworks: Boerse Stuttgart launches Seturion", url: "https://blockworks.co/news/seturion-settlement-platform" },
  pontes: { label: "ECB press release on Pontes launch (21 Sep 2026)", url: "https://www.banque-france.fr/system/files/2026-09/ecb.pr260921.en_.pdf" },
  qivalis: { label: "Qivalis: 25 new banks join the consortium", url: "https://qivalis.eu/press/news/qivalis-more-than-triples-in-size-as-25-new-banks-join-the-consortium-accelerating-institutional-shift-towards-a-fully-regulated-euro-stablecoin" },
  kaleido: { label: "kaleido.io (customers, products, open source)", url: "https://kaleido.io/llms.txt" },
  kaleido_citi: { label: "Kaleido customer story: Citi", url: "https://www.kaleido.io/customer-stories/citi" },
  paladin: { label: "LF Decentralized Trust: Paladin privacy framework", url: "https://ledgerinsights.com/paladin-privacy-framework-graduates-as-bank-of-korea-joins-lf-decentralized-trust/" },
  dfns: { label: "dfns.co (customers incl. ABN AMRO, Zodia Custody)", url: "https://dfns.co" },
  fireblocks_abn: { label: "Fireblocks customer story: ABN AMRO", url: "https://www.fireblocks.com/customers/abn-amro" },
  anchorage: { label: "Anchorage Digital", url: "https://www.anchorage.com/" },
};

const LUX = { country: "Luxembourg", city: "Luxembourg", lat: 49.61, lng: 6.13 };
const FRA = { country: "Germany", city: "Frankfurt", lat: 50.11, lng: 8.68 };
const STR = { country: "Germany", city: "Stuttgart", lat: 48.78, lng: 9.18 };
const MUC = { country: "Germany", city: "Munich", lat: 48.14, lng: 11.58 };
const BER = { country: "Germany", city: "Berlin", lat: 52.52, lng: 13.4 };
const PAR = { country: "France", city: "Paris", lat: 48.86, lng: 2.35 };
const LON = { country: "United Kingdom", city: "London", lat: 51.51, lng: -0.13 };
const AMS = { country: "Netherlands", city: "Amsterdam", lat: 52.37, lng: 4.9 };
const SIN = { country: "Singapore", city: "Singapore", lat: 1.35, lng: 103.82 };
const NYC = { country: "United States", city: "New York", lat: 40.71, lng: -74.01 };

export const entities: Rl1Entity[] = [
  // ── Platform ────────────────────────────────────────────────────────────
  {
    id: "rl1", name: "Regulated Layer One", short: "RL1", domain: "rl1.network", type: "DLT network (cooperative)", layer: "platform-ledger", rel: "platform", ...LUX,
    what: "Private, permissioned DLT network for tokenised assets and digital money, owned by its members as a European Cooperative Society (SCE). Live since 28 July 2026 on the network SWIAT built and ran in production for ~3 years (50+ transactions, €700m+).",
    role: "The platform layer. General Assembly of equal-vote members, Supervisory Board, Management Board (MD Henning Vollbehr, ex-SWIAT); SWIAT GmbH is technical infrastructure operator. Use cases: digital bonds, RWAs, collateral, bank stablecoins, CeBM interop, funds, repo & sec lending, derivatives margining.",
    evidence: "confirmed", sources: ["rl1", "rl1launch"],
  },

  // ── Founding members ────────────────────────────────────────────────────
  {
    id: "abnamro", name: "ABN AMRO", domain: "abnamro.com", type: "Universal bank", layer: "access-participants", rel: "founding", ...AMS,
    what: "Third-largest Dutch bank; first Dutch bank to issue digital bonds for corporate clients.",
    role: "Founding member. Only Dutch member. Public client of both Dfns and Fireblocks for wallets/keys, and a Qivalis euro-stablecoin bank.",
    evidence: "confirmed", sources: ["rl1launch", "dfns", "fireblocks_abn", "qivalis"],
  },
  {
    id: "cecabank", name: "Cecabank", domain: "cecabank.es", type: "Wholesale & custody bank", layer: "access-participants", alsoIn: ["service-market"], rel: "founding", country: "Spain", city: "Madrid", lat: 40.42, lng: -3.7,
    what: "Spanish wholesale bank: securities services, depositary and payments for savings banks and funds.",
    role: "Founding member, joined at launch (not in the Sep 2025 cohort). Only Spanish member. Also a Pontes market participant and a Qivalis bank.",
    evidence: "confirmed", sources: ["rl1launch", "li_launch", "pontes", "qivalis"],
  },
  {
    id: "chartered", name: "Chartered Investment", domain: "chartered-investment.com", type: "Issuance platform", layer: "asset-securities", rel: "founding", country: "Germany", city: "Düsseldorf", lat: 51.23, lng: 6.78,
    what: "BaFin-regulated 'capital markets as a service' firm: structured products and securitisations (1,000+ since 2013) for partners such as Vontobel.",
    role: "Founding (shareholding) member. Brings issuance volume and a structured-products pipeline rather than balance sheet.",
    evidence: "confirmed", sources: ["rl1launch", "chartered"],
  },
  {
    id: "creditmutuel", name: "Crédit Mutuel Alliance Fédérale", short: "Crédit Mutuel", domain: "creditmutuel.com", type: "Cooperative banking group", layer: "access-participants", rel: "founding", country: "France", city: "Strasbourg", lat: 48.58, lng: 7.75,
    what: "Large French cooperative banking group.",
    role: "Founding member, joined at launch. Also a Qivalis bank.",
    evidence: "confirmed", sources: ["rl1launch", "li_launch", "qivalis"],
  },
  {
    id: "dekabank", name: "DekaBank", domain: "deka.de", type: "Savings-bank central institution", layer: "access-participants", alsoIn: ["platform-nodes", "asset-securities"], rel: "founding", validator: true, ...FRA,
    what: "Securities house and asset manager of the German Sparkassen. BaFin-licensed crypto-securities registrar (2024).",
    role: "Founding member, validator, SWIAT co-founder and shareholder. Arranger/registrar on most SWIAT-era deals; ECB trials with Metzler, LBBW, NatWest. Pontes participant; Qivalis bank.",
    evidence: "confirmed", sources: ["rl1", "rl1launch", "swiatpress", "pontes", "qivalis"],
  },
  {
    id: "dzbank", name: "DZ BANK", domain: "dzbank.de", type: "Cooperative central bank", layer: "access-participants", alsoIn: ["service-market"], rel: "founding", ...FRA,
    what: "Central institution of ~700 German cooperative banks; runs its own digital-asset custody platform.",
    role: "Founding member (not a validator). Pontes participant; Qivalis bank.",
    evidence: "confirmed", sources: ["rl1launch", "pontes", "qivalis"],
  },
  {
    id: "lbbw", name: "LBBW", domain: "lbbw.de", type: "Landesbank", layer: "access-participants", alsoIn: ["platform-nodes"], rel: "founding", validator: true, ...STR,
    what: "Germany's largest Landesbank; parent of Berlin Hyp.",
    role: "Founding member, validator, SWIAT shareholder. Settled automated DvP with central bank money in the 2024 ECB trials.",
    evidence: "confirmed", sources: ["rl1", "swiatpress"],
  },
  {
    id: "natixis", name: "Natixis CIB", domain: "natixis.com", type: "Corporate & investment bank", layer: "access-participants", rel: "founding", ...PAR,
    what: "CIB arm of Groupe BPCE.",
    role: "Founding member. Natixis Pfandbriefbank issued a €100m digital registered covered bond on SWIAT (Aug 2024). Parent BPCE is a Qivalis bank.",
    evidence: "confirmed", sources: ["rl1launch", "deka_cb", "qivalis"],
  },
  {
    id: "scventures", name: "SC Ventures", domain: "sc.com", type: "Bank venture arm", layer: "access-participants", alsoIn: ["platform-nodes"], rel: "founding", validator: true, ...LON,
    what: "Innovation and ventures unit of Standard Chartered (operating hub in Singapore). Backer of Zodia Custody, Zodia Markets, Libeara, Olea.",
    role: "Founding member, validator, SWIAT shareholder. The only non-EU member, and the only bridge into Asia and into Partior (Standard Chartered is a co-founder).",
    evidence: "confirmed", sources: ["rl1", "rl1launch", "swiatpress"],
  },
  {
    id: "seturion", name: "Seturion", domain: "seturion.com", type: "Settlement platform (FMI)", layer: "service-market", rel: "founding", ...STR,
    what: "Boerse Stuttgart Group's pan-European settlement platform for tokenised assets; settles in central bank money or on-chain cash; live at BX Digital; DLT Pilot Regime application with BaFin.",
    role: "Founding member. The post-trade/settlement specialist in the cooperative: the natural RL1 settlement front-end for venues and brokers.",
    evidence: "confirmed", sources: ["rl1launch", "seturion"],
  },

  // ── Pending ─────────────────────────────────────────────────────────────
  {
    id: "natwest", name: "NatWest", domain: "natwestgroup.com", type: "Universal bank", layer: "access-participants", rel: "joining", ...LON,
    what: "UK banking group.",
    role: "Active in Phase 1; listed as 'joining soon'. Ran two intraday repos with DekaBank on SWIAT in the ECB trials (Nov 2024).",
    evidence: "reported", sources: ["rl1", "li_launch", "swiatpress"],
  },

  // ── Supporters & observers ──────────────────────────────────────────────
  {
    id: "kfw", name: "KfW", domain: "kfw.de", type: "Development bank", layer: "access-participants", rel: "supporter", ...FRA,
    what: "German federal development bank; a top-tier SSA issuer.",
    role: "Member since 2025, now a supporter rather than a cooperative member. Invested €10m in Berlin Hyp's digital Pfandbrief (Apr 2025). Pontes participant.",
    evidence: "confirmed", sources: ["rl1launch", "li_launch", "kfw_bh", "pontes"],
  },
  {
    id: "lbank", name: "L-Bank", domain: "l-bank.de", type: "Development bank", layer: "access-participants", rel: "supporter", country: "Germany", city: "Karlsruhe", lat: 49.01, lng: 8.4,
    what: "Development bank of Baden-Württemberg.",
    role: "Joined Feb 2026; supporter at launch.",
    evidence: "confirmed", sources: ["rl1launch", "swiatpress"],
  },
  {
    id: "vbank", name: "V-Bank", domain: "v-bank.com", type: "Custody bank", layer: "access-participants", rel: "observer", ...MUC,
    what: "Custody and transaction bank for independent asset managers.",
    role: "One of the ten Phase-1 funders (Sep 2025) but not a founding member at launch; listed under supporters & observers.",
    evidence: "reported", sources: ["kfw2025", "rl1", "li_launch"],
  },
  {
    id: "imf", name: "IMF", domain: "imf.org", type: "Supranational", layer: "governance", rel: "observer", country: "United States", city: "Washington, DC", lat: 38.9, lng: -77.04,
    what: "International Monetary Fund.",
    role: "Listed observer: the only non-European public body in the perimeter.",
    evidence: "confirmed", sources: ["rl1"],
  },

  // ── Operator & validators ───────────────────────────────────────────────
  {
    id: "swiat", name: "SWIAT", domain: "swiat.io", type: "Technology operator", layer: "platform-nodes", alsoIn: ["asset-securities", "service-tech", "access-wallets"], rel: "operator", validator: true, ...FRA,
    what: "Frankfurt fintech (spun out of DekaBank 2022) that built the network. Owned by DekaBank, LBBW, SC Ventures and Comyno. BaFin permission for crypto-securities registers (Nov 2025); ISO 27001. Co-CEOs Timo Reinschmidt and Felix Miederer.",
    role: "Technical infrastructure operator and validator. Transferred the network to RL1 but keeps its applications (SWIAT Access, registry and settlement engine). Connected to Pontes as a DLT platform operator.",
    evidence: "confirmed", sources: ["rl1", "swiatpress", "pontes", "li_launch"],
  },
  {
    id: "adesso", name: "adesso SE", short: "adesso", domain: "adesso.de", type: "IT services", layer: "platform-nodes", alsoIn: ["service-tech"], rel: "validator", country: "Germany", city: "Dortmund", lat: 51.51, lng: 7.47,
    what: "German IT services group.",
    role: "Validator since 2023; co-developed SWIAT Access, the plug-and-play onboarding product.",
    evidence: "confirmed", sources: ["rl1", "adesso"],
  },
  {
    id: "gft", name: "GFT Technologies", short: "GFT", domain: "gft.com", type: "IT services", layer: "platform-nodes", rel: "validator", ...STR,
    what: "Banking-focused IT services firm.",
    role: "Validator since 2023.",
    evidence: "confirmed", sources: ["rl1", "itfm"],
  },
  {
    id: "nttdata", name: "NTT DATA Deutschland", short: "NTT DATA", domain: "nttdata.com", type: "IT services", layer: "platform-nodes", rel: "validator", ...MUC,
    what: "German arm of Japan's NTT DATA.",
    role: "Validator since Feb 2024. Indirect Japanese footprint in the node set.",
    evidence: "confirmed", sources: ["rl1", "swiatpress"],
  },
  {
    id: "soprasteria", name: "Sopra Steria", domain: "soprasteria.com", type: "IT services", layer: "platform-nodes", rel: "validator", ...PAR,
    what: "French IT services group.",
    role: "Validator since 2023; the only non-German operator besides SC Ventures.",
    evidence: "confirmed", sources: ["rl1", "itfm"],
  },
  {
    id: "thinktank", name: "think tank Business Solutions", short: "think tank BS", domain: "think-tank.de", type: "IT services", layer: "platform-nodes", rel: "former", ...MUC,
    what: "German IT consultancy.",
    role: "One of four validators added in Sep 2023; not on RL1's eight-validator list at launch.",
    evidence: "inferred", sources: ["itfm", "rl1"],
  },
  {
    id: "comyno", name: "Comyno", domain: "comyno.com", type: "Securities-finance fintech", layer: "service-tech", rel: "ecosystem", ...FRA,
    what: "Securities lending and repo software vendor.",
    role: "SWIAT shareholder (since 2023 investor round); relevant to repo and sec-lending use cases.",
    evidence: "reported", sources: ["swiatpress"],
  },

  // ── Ecosystem: issuers, investors, counterparties ───────────────────────
  {
    id: "siemens", name: "Siemens", domain: "siemens.com", type: "Corporate issuer", layer: "asset-securities", rel: "ecosystem", ...MUC,
    what: "German industrial group and repeat digital-bond issuer.",
    role: "€300m crypto security settled DvP with digital wholesale euro (Sep 2024); DvP in commercial money; secondary-market trade (Aug 2025).",
    evidence: "confirmed", sources: ["swiatpress"],
  },
  {
    id: "berlinhyp", name: "Berlin Hyp", domain: "berlinhyp.de", type: "Pfandbrief bank", layer: "asset-securities", rel: "ecosystem", ...BER,
    what: "Commercial real estate lender, part of LBBW.",
    role: "€100m digital mortgage Pfandbrief (Aug 2024), Germany's first under eWpG; KfW bought €10m.",
    evidence: "confirmed", sources: ["berlinhyp", "kfw_bh"],
  },
  {
    id: "natixispfb", name: "Natixis Pfandbriefbank", domain: "natixis.com", type: "Pfandbrief bank", layer: "asset-securities", rel: "ecosystem", ...FRA,
    what: "German covered-bond subsidiary of Natixis.",
    role: "€100m digital registered covered bond with DekaBank (Aug 2024).",
    evidence: "confirmed", sources: ["deka_cb"],
  },
  {
    id: "bayernlb", name: "BayernLB", domain: "bayernlb.de", type: "Landesbank", layer: "access-participants", rel: "ecosystem", ...MUC,
    what: "Bavarian Landesbank.",
    role: "Digital registered bond DvP with Stadtsparkasse München in the ECB trials (Jul 2024). Pontes participant, but not an RL1 member.",
    evidence: "confirmed", sources: ["swiatpress", "pontes"],
  },
  {
    id: "sskm", name: "Stadtsparkasse München", domain: "sskm.de", type: "Savings bank", layer: "access-participants", rel: "ecosystem", ...MUC,
    what: "Munich's municipal savings bank.",
    role: "Investor in BayernLB's digital bond during the ECB trials.",
    evidence: "confirmed", sources: ["swiatpress"],
  },
  {
    id: "metzler", name: "Bankhaus Metzler", short: "Metzler", domain: "metzler.com", type: "Private bank", layer: "access-participants", rel: "ecosystem", ...FRA,
    what: "Frankfurt private bank.",
    role: "First crypto-securities trade with digital wholesale euro, with DekaBank (Jul 2024).",
    evidence: "confirmed", sources: ["swiatpress"],
  },
  {
    id: "berlinervb", name: "Berliner Volksbank", domain: "berliner-volksbank.de", type: "Cooperative bank", layer: "access-participants", rel: "ecosystem", ...BER,
    what: "One of Germany's largest Volksbanks.",
    role: "First blockchain-based investment using SWIAT (Jun 2025).",
    evidence: "confirmed", sources: ["swiatpress"],
  },
  {
    id: "helaba", name: "Helaba", domain: "helaba.com", type: "Landesbank", layer: "access-participants", rel: "ecosystem", ...FRA,
    what: "Landesbank Hessen-Thüringen.",
    role: "Named as a SWIAT transaction party; Qivalis bank; not an RL1 member.",
    evidence: "reported", sources: ["swiatpress", "qivalis"],
  },
  {
    id: "unioninvest", name: "Union Investment", domain: "union-investment.de", type: "Asset manager", layer: "access-participants", rel: "ecosystem", ...FRA,
    what: "Asset manager of the cooperative banking group (DZ BANK group).",
    role: "Named as a SWIAT transaction party.",
    evidence: "reported", sources: ["swiatpress"],
  },
  {
    id: "deutschebank", name: "Deutsche Bank", domain: "db.com", type: "Universal bank", layer: "access-participants", rel: "ecosystem", ...FRA,
    what: "Germany's largest bank; Partior shareholder; Taurus-based custody.",
    role: "Named as a SWIAT transaction party and a Pontes participant, yet not an RL1 member: the most conspicuous absence.",
    evidence: "reported", sources: ["swiatpress", "pontes"],
  },
  {
    id: "hal", name: "Hauck Aufhäuser Lampe", domain: "hal-privatbank.com", type: "Private bank", layer: "access-participants", rel: "ecosystem", ...FRA,
    what: "Private and fund-services bank.",
    role: "Named as a SWIAT transaction party.",
    evidence: "reported", sources: ["swiatpress"],
  },
  {
    id: "sparkassen", name: "Sparkassen (Dortmund, KSK Ludwigsburg, Schwarzwald-Baar)", short: "Sparkassen", domain: "sparkasse.de", type: "Savings banks", layer: "access-participants", rel: "ecosystem", country: "Germany", city: "Ludwigsburg", lat: 48.9, lng: 9.19,
    what: "Local German savings banks, distribution base of DekaBank.",
    role: "Bought and settled digital registered bonds DvP on SWIAT (2024); rely on Deka's registry.",
    evidence: "confirmed", sources: ["swiatpress"],
  },
  {
    id: "vasakronan", name: "Vasakronan", domain: "vasakronan.se", type: "Corporate issuer", layer: "asset-securities", rel: "ecosystem", country: "Sweden", city: "Stockholm", lat: 59.33, lng: 18.07,
    what: "Swedish property company.",
    role: "Digital green debt instrument on the DekaBank platform (Dec 2021), the precursor network.",
    evidence: "confirmed", sources: ["swiatpress"],
  },
  {
    id: "olea", name: "Olea", domain: "olea.com", type: "Trade-finance platform", layer: "service-market", rel: "ecosystem", ...SIN,
    what: "Trade-finance distribution platform backed by SC Ventures.",
    role: "Tokenised trade receivables on SWIAT (Sep 2024).",
    evidence: "reported", sources: ["swiatpress"],
  },
  {
    id: "360x", name: "360X", domain: "360x.com", type: "Tokenisation marketplace", layer: "service-market", rel: "ecosystem", ...FRA,
    what: "Marketplace for tokenised real-world assets.",
    role: "Named in SWIAT press material; nature of integration not detailed.",
    evidence: "reported", sources: ["swiatpress"],
  },

  // ── Public sector & money ───────────────────────────────────────────────
  {
    id: "ecb", name: "ECB / Eurosystem", short: "ECB", domain: "ecb.europa.eu", type: "Central bank", layer: "governance", rel: "public", ...FRA,
    what: "Runs TARGET Services; ran the 2024 DLT exploratory trials; Pontes (short term) and Appia (long term) roadmap.",
    role: "Policy anchor for RL1 ('DLT-based single capital market'). SWIAT completed 8 trial transactions in 2024.",
    evidence: "confirmed", sources: ["swiatpress", "rl1launch"],
  },
  {
    id: "pontes", name: "Pontes", domain: "ecb.europa.eu", type: "Central-bank settlement link", layer: "asset-cash", rel: "public", ...FRA,
    what: "Eurosystem bridge between market DLT platforms and TARGET, live 21 Sep 2026. Connected DLT operators: Axiology, Cashlink, Clearstream, SWIAT.",
    role: "RL1's cash leg in central bank money, via SWIAT. Participants include Cecabank, DekaBank, DZ BANK, KfW, BayernLB, Deutsche Bank, Société Générale, Santander, EIB, CDC, NRW.BANK, Abanca, Memo Bank.",
    evidence: "confirmed", sources: ["pontes"],
  },
  {
    id: "bundesbank", name: "Deutsche Bundesbank", short: "Bundesbank", domain: "bundesbank.de", type: "Central bank", layer: "governance", rel: "public", ...FRA,
    what: "German central bank.",
    role: "Its Trigger Solution carried the cash leg in SWIAT's 2024 trials; onboarded to Pontes as a market participant.",
    evidence: "confirmed", sources: ["swiatpress", "pontes"],
  },
  {
    id: "bafin", name: "BaFin", domain: "bafin.de", type: "Regulator", layer: "governance", rel: "public", country: "Germany", city: "Bonn", lat: 50.74, lng: 7.1,
    what: "German financial supervisor.",
    role: "Licensed DekaBank (2024) and SWIAT (2025) to run crypto-securities registers under eWpG; reviewing Seturion's DLT Pilot Regime application.",
    evidence: "confirmed", sources: ["swiatpress", "seturion"],
  },
  {
    id: "cssf", name: "CSSF", domain: "cssf.lu", type: "Regulator", layer: "governance", rel: "public", ...LUX,
    what: "Luxembourg financial supervisor.",
    role: "Home supervisor of the SCE's domicile; whether the cooperative itself needs a licence has not been disclosed.",
    evidence: "inferred", sources: ["rl1launch"],
  },
  {
    id: "esma", name: "ESMA", domain: "esma.europa.eu", type: "Regulator", layer: "governance", rel: "public", ...PAR,
    what: "EU securities markets authority.",
    role: "Sets the DLT Pilot Regime and MiCA perimeter that RL1 use cases sit inside.",
    evidence: "inferred", sources: [],
  },
  {
    id: "bankofgreece", name: "Bank of Greece", domain: "bankofgreece.gr", type: "Central bank", layer: "governance", alsoIn: ["asset-securities"], rel: "public", country: "Greece", city: "Athens", lat: 37.98, lng: 23.73,
    what: "Greek central bank.",
    role: "Project Sovereign with SWIAT and 7 partners (report Feb 2026): sovereign debt use case.",
    evidence: "confirmed", sources: ["swiatpress"],
  },
  {
    id: "qivalis", name: "Qivalis", domain: "qivalis.eu", type: "Bank euro stablecoin (EMI)", layer: "asset-cash", rel: "adjacent", ...AMS,
    what: "Bank-consortium euro stablecoin, 37 institutions, EMI licence under DNB, launch H2 2026.",
    role: "Not linked to RL1, but five RL1 founding members (ABN AMRO, Cecabank, Crédit Mutuel, DekaBank, DZ BANK), Natixis's parent BPCE and Helaba are Qivalis banks: the obvious on-chain cash leg.",
    evidence: "inferred", sources: ["qivalis"],
  },

  // ── Adjacent infrastructure & services ──────────────────────────────────
  {
    id: "kaleido", name: "Kaleido", domain: "kaleido.io", type: "Blockchain infrastructure & middleware", layer: "service-tech", alsoIn: ["platform-nodes", "access-wallets"], rel: "adjacent", country: "United States", city: "Raleigh", lat: 35.78, lng: -78.64,
    what: "Full-stack enterprise chain platform: node/network ops, tokenisation, custody, Digital FMI and CBDC platforms. Created Hyperledger FireFly and Paladin (EVM programmable privacy). Customers: Citi, SWIFT, Deutsche Börse/Clearstream, BIS, HKMA, RBA, Bank Indonesia, BCB.",
    role: "No public RL1 or SWIAT link. Sits one layer below members: could run a member's node, wallets and privacy layer on RL1; overlaps SWIAT Access; already powers competitor Clearstream.",
    evidence: "confirmed", sources: ["kaleido", "kaleido_citi", "paladin"],
  },
  {
    id: "dfns", name: "Dfns", domain: "dfns.co", type: "Wallet-as-a-service / key management", layer: "access-wallets", rel: "adjacent", ...PAR,
    what: "Programmable wallet and key-orchestration platform (MPC/HSM). Clients include ABN AMRO, Fidelity, Zodia Custody, Banca Sella, FAB, Broadridge; 300+ institutions.",
    role: "No public RL1 integration, but already in an RL1 founding member (ABN AMRO) and in an SC Ventures portfolio company (Zodia). The closest vendor to RL1 of the three.",
    evidence: "confirmed", sources: ["dfns"],
  },
  {
    id: "anchorage", name: "Anchorage Digital", domain: "anchorage.com", type: "Federally chartered crypto bank", layer: "service-market", alsoIn: ["access-wallets"], rel: "adjacent", country: "United States", city: "San Francisco", lat: 37.77, lng: -122.42,
    what: "First OCC-chartered digital-asset bank (2021): qualified custody, staking, settlement, stablecoin issuance for US institutions; Singapore entity.",
    role: "No RL1 link and no public EU licence found. Represents what RL1 lacks: a US-regulated custodian and route to US investors and USD.",
    evidence: "confirmed", sources: ["anchorage"],
  },
  {
    id: "fireblocks", name: "Fireblocks", domain: "fireblocks.com", type: "Custody technology (MPC)", layer: "access-wallets", rel: "adjacent", ...NYC,
    what: "MPC wallet and tokenisation infrastructure.",
    role: "Public ABN AMRO vendor; competes with Dfns and Kaleido for RL1 members' key management.",
    evidence: "confirmed", sources: ["fireblocks_abn"],
  },
  {
    id: "taurus", name: "Taurus", domain: "taurushq.com", type: "Custody & tokenisation tech", layer: "access-wallets", rel: "adjacent", country: "Switzerland", city: "Geneva", lat: 46.2, lng: 6.14,
    what: "Swiss custody, tokenisation and node software; used by Deutsche Bank and State Street.",
    role: "No RL1 link; the incumbent vendor of the biggest German non-member.",
    evidence: "reported", sources: [],
  },
  {
    id: "zodia", name: "Zodia Custody", domain: "zodia-custody.com", type: "Digital-asset custodian", layer: "service-market", rel: "adjacent", ...LON,
    what: "Institutional custodian backed by SC Ventures/Standard Chartered.",
    role: "Dfns client in the SC Ventures orbit: candidate third-party custodian for RL1 assets.",
    evidence: "reported", sources: ["dfns"],
  },

  // ── Peer & competing networks ───────────────────────────────────────────
  {
    id: "d7", name: "Clearstream D7", short: "D7", domain: "clearstream.com", type: "Digital post-trade platform", layer: "platform-ledger", rel: "peer", ...LUX,
    what: "Deutsche Börse's digital issuance and post-trade platform (eWpG securities).",
    role: "Direct competitor for German digital issuance; Pontes-connected; Kaleido is a technology provider.",
    evidence: "confirmed", sources: ["pontes", "kaleido"],
  },
  {
    id: "euroclear", name: "Euroclear D-FMI", short: "D-FMI", domain: "euroclear.com", type: "Digital FMI (ICSD)", layer: "platform-ledger", rel: "peer", country: "Belgium", city: "Brussels", lat: 50.85, lng: 4.35,
    what: "Euroclear's DLT issuance platform for digital bonds.",
    role: "ICSD alternative; issuers who want Eurobond distribution default here.",
    evidence: "inferred", sources: [],
  },
  {
    id: "cashlink", name: "Cashlink", domain: "cashlink.de", type: "Crypto-securities registrar", layer: "asset-securities", rel: "peer", ...FRA,
    what: "BaFin-licensed registrar and tokenisation platform on public chains.",
    role: "Pontes-connected DLT operator competing with SWIAT for German registry business.",
    evidence: "confirmed", sources: ["pontes"],
  },
  {
    id: "axiology", name: "Axiology", domain: "axiology.xyz", type: "DLT trading & settlement system", layer: "platform-ledger", rel: "peer", country: "Lithuania", city: "Vilnius", lat: 54.69, lng: 25.28,
    what: "DLT Pilot Regime TSS.",
    role: "Pontes-connected DLT operator.",
    evidence: "confirmed", sources: ["pontes"],
  },
  {
    id: "21x", name: "21X", domain: "21x.eu", type: "DLT trading & settlement system", layer: "platform-ledger", rel: "peer", ...FRA,
    what: "First EU DLT TSS licence (Dec 2024), public-chain based.",
    role: "Venue alternative to Seturion-on-RL1.",
    evidence: "inferred", sources: [],
  },
  {
    id: "sgforge", name: "SG-FORGE", domain: "sgforge.com", type: "Bank tokenisation unit", layer: "platform-ledger", alsoIn: ["asset-cash"], rel: "peer", ...PAR,
    what: "Société Générale's digital-asset arm: digital bonds on public chains, EURCV/USDCV stablecoins.",
    role: "French G-SIB running its own stack; parent is a Pontes participant; not in RL1.",
    evidence: "inferred", sources: ["pontes"],
  },
  {
    id: "canton", name: "Canton Network", short: "Canton", domain: "canton.network", type: "Public-permissioned L1", layer: "platform-ledger", rel: "peer", ...NYC,
    what: "Privacy-enabled interoperable network (Digital Asset) used by global banks and FMIs.",
    role: "The global alternative many EU G-SIBs already sit on; Kaleido supports it.",
    evidence: "inferred", sources: ["kaleido"],
  },
  {
    id: "partior", name: "Partior", domain: "partior.com", type: "Multi-currency settlement network", layer: "platform-ledger", rel: "peer", ...SIN,
    what: "Atomic multi-currency payment network founded by JPMorgan, DBS, Standard Chartered, Temasek; Deutsche Bank a shareholder.",
    role: "Standard Chartered straddles Partior and RL1: a natural bridge for cross-currency legs.",
    evidence: "inferred", sources: [],
  },
  {
    id: "kinexys", name: "Kinexys by J.P. Morgan", short: "Kinexys", domain: "kinexys.com", type: "Bank blockchain network", layer: "platform-ledger", alsoIn: ["asset-cash"], rel: "peer", ...NYC,
    what: "JPMorgan's deposit-token, intraday repo and tokenised collateral network.",
    role: "Named in SWIAT press material; nature of any link not detailed.",
    evidence: "reported", sources: ["swiatpress"],
  },
  {
    id: "fnality", name: "Fnality", domain: "fnality.com", type: "Wholesale payment system", layer: "asset-cash", rel: "peer", ...LON,
    what: "Tokenised central-bank-money payment system (UK, US).",
    role: "Alternative on-chain cash leg outside the euro area.",
    evidence: "inferred", sources: [],
  },
  {
    id: "gl1", name: "Global Layer One", short: "GL1", domain: "mas.gov.sg", type: "Reference architecture (MAS)", layer: "platform-ledger", rel: "peer", ...SIN,
    what: "MAS-led initiative for shared, regulated multi-jurisdiction ledgers.",
    role: "The Asian model RL1 is compared to; potential interop target.",
    evidence: "reported", sources: ["li_2025"],
  },
  {
    id: "rln", name: "UK RLN / GBTD", short: "RLN", domain: "ukfinance.org.uk", type: "Shared ledger (UK)", layer: "platform-ledger", rel: "peer", ...LON,
    what: "UK Finance-led regulated liability network for tokenised sterling deposits.",
    role: "Payments-first UK counterpart; NatWest's other home.",
    evidence: "reported", sources: ["li_2025"],
  },

  // ── Relevant institutions not (yet) in RL1 ──────────────────────────────
  // All Qivalis banks not already in RL1, plus Pontes participants and other EU majors.
  {
    id: "bnpparibas", name: "BNP Paribas", domain: "bnpparibas.com", type: "Universal bank", layer: "access-participants", rel: "prospect", country: "France", city: "Paris", lat: 48.86, lng: 2.35,
    what: "Largest euro-area bank and Europe's biggest custodian; Neobonds/AssetFoundry tokenisation; Canton Network participant.",
    role: "Qivalis bank; on Canton; not in RL1. The single largest absence.",
    evidence: "confirmed", sources: ["qivalis"],
  },
  {
    id: "ing", name: "ING", domain: "ing.com", type: "Universal bank", layer: "access-participants", rel: "prospect", country: "Netherlands", city: "Amsterdam", lat: 52.37, lng: 4.9,
    what: "Dutch universal bank; long-running DLT and tokenisation programme.",
    role: "Qivalis founding bank; not in RL1 (ABN AMRO is the only Dutch member).",
    evidence: "confirmed", sources: ["qivalis"],
  },
  {
    id: "unicredit", name: "UniCredit", domain: "unicreditgroup.eu", type: "Universal bank", layer: "access-participants", rel: "prospect", country: "Italy", city: "Milan", lat: 45.46, lng: 9.19,
    what: "Pan-European bank (Italy, Germany via HVB, CEE).",
    role: "Qivalis founding bank; not in RL1. No Italian institution is in RL1.",
    evidence: "confirmed", sources: ["qivalis"],
  },
  {
    id: "intesa", name: "Intesa Sanpaolo", domain: "intesasanpaolo.com", type: "Universal bank", layer: "access-participants", rel: "prospect", country: "Italy", city: "Turin", lat: 45.07, lng: 7.69,
    what: "Italy's largest bank.",
    role: "Qivalis bank; not in RL1.",
    evidence: "confirmed", sources: ["qivalis"],
  },
  {
    id: "caixabank", name: "CaixaBank", domain: "caixabank.com", type: "Universal bank", layer: "access-participants", rel: "prospect", country: "Spain", city: "Valencia", lat: 39.47, lng: -0.38,
    what: "Spain's largest domestic bank.",
    role: "Qivalis founding bank; not in RL1 (Cecabank is the only Spanish member).",
    evidence: "confirmed", sources: ["qivalis"],
  },
  {
    id: "bbva", name: "BBVA", domain: "bbva.com", type: "Universal bank", layer: "access-participants", rel: "prospect", country: "Spain", city: "Bilbao", lat: 43.26, lng: -2.93,
    what: "Spanish global bank with a MiCA crypto custody and trading service.",
    role: "Qivalis bank; not in RL1.",
    evidence: "confirmed", sources: ["qivalis"],
  },
  {
    id: "bancasella", name: "Banca Sella", domain: "sella.it", type: "Private & retail bank", layer: "access-participants", rel: "prospect", country: "Italy", city: "Biella", lat: 45.57, lng: 8.05,
    what: "Italian banking group with an active digital-asset unit.",
    role: "Qivalis founding bank and a public Dfns client; not in RL1.",
    evidence: "confirmed", sources: ["qivalis"],
  },
  {
    id: "kbc", name: "KBC", domain: "kbc.com", type: "Universal bank", layer: "access-participants", rel: "prospect", country: "Belgium", city: "Brussels", lat: 50.85, lng: 4.35,
    what: "Belgian bank-insurer.",
    role: "Qivalis founding bank; not in RL1. No Belgian member.",
    evidence: "confirmed", sources: ["qivalis"],
  },
  {
    id: "danske", name: "Danske Bank", domain: "danskebank.com", type: "Universal bank", layer: "access-participants", rel: "prospect", country: "Denmark", city: "Copenhagen", lat: 55.68, lng: 12.57,
    what: "Largest Danish bank.",
    role: "Qivalis founding bank; not in RL1. No Nordic member.",
    evidence: "confirmed", sources: ["qivalis"],
  },
  {
    id: "seb", name: "SEB", domain: "sebgroup.com", type: "Universal bank", layer: "access-participants", rel: "prospect", country: "Sweden", city: "Stockholm", lat: 59.33, lng: 18.07,
    what: "Swedish corporate and investment bank.",
    role: "Qivalis founding bank; not in RL1.",
    evidence: "confirmed", sources: ["qivalis"],
  },
  {
    id: "rbi", name: "Raiffeisen Bank International", domain: "rbinternational.com", type: "Universal bank", layer: "access-participants", rel: "prospect", country: "Austria", city: "Vienna", lat: 48.21, lng: 16.37,
    what: "Austrian bank with a large CEE network.",
    role: "Qivalis founding bank; not in RL1. No Austrian member.",
    evidence: "confirmed", sources: ["qivalis"],
  },
  {
    id: "abanca", name: "Abanca", domain: "abanca.com", type: "Retail bank", layer: "access-participants", rel: "prospect", country: "Spain", city: "A Coruña", lat: 43.36, lng: -8.41,
    what: "Galician bank.",
    role: "Qivalis bank and Pontes market participant; not in RL1.",
    evidence: "confirmed", sources: ["qivalis"],
  },
  {
    id: "aib", name: "AIB", domain: "aib.ie", type: "Universal bank", layer: "access-participants", rel: "prospect", country: "Ireland", city: "Dublin", lat: 53.35, lng: -6.26,
    what: "Allied Irish Banks.",
    role: "Qivalis bank; not in RL1.",
    evidence: "confirmed", sources: ["qivalis"],
  },
  {
    id: "sabadell", name: "Banco Sabadell", domain: "bancsabadell.com", type: "Universal bank", layer: "access-participants", rel: "prospect", country: "Spain", city: "Sabadell", lat: 41.55, lng: 2.11,
    what: "Spanish banking group.",
    role: "Qivalis bank; not in RL1.",
    evidence: "confirmed", sources: ["qivalis"],
  },
  {
    id: "boi", name: "Bank of Ireland", domain: "bankofireland.com", type: "Universal bank", layer: "access-participants", rel: "prospect", country: "Ireland", city: "Dublin", lat: 53.35, lng: -6.26,
    what: "Irish banking group.",
    role: "Qivalis bank; not in RL1.",
    evidence: "confirmed", sources: ["qivalis"],
  },
  {
    id: "pekao", name: "Bank Pekao", domain: "pekao.com.pl", type: "Universal bank", layer: "access-participants", rel: "prospect", country: "Poland", city: "Warsaw", lat: 52.23, lng: 21.01,
    what: "Polish bank.",
    role: "Qivalis bank; not in RL1. Only non-euro CEE bank in the Qivalis list.",
    evidence: "confirmed", sources: ["qivalis"],
  },
  {
    id: "bankinter", name: "Bankinter", domain: "bankinter.com", type: "Universal bank", layer: "access-participants", rel: "prospect", country: "Spain", city: "Madrid", lat: 40.42, lng: -3.7,
    what: "Spanish bank.",
    role: "Qivalis bank; not in RL1.",
    evidence: "confirmed", sources: ["qivalis"],
  },
  {
    id: "bcee", name: "Spuerkeess (BCEE)", domain: "spuerkeess.lu", type: "State savings bank", layer: "access-participants", rel: "prospect", country: "Luxembourg", city: "Luxembourg", lat: 49.61, lng: 6.13,
    what: "Banque et Caisse d'Épargne de l'État, Luxembourg.",
    role: "Qivalis bank in RL1's home country; not in RL1.",
    evidence: "confirmed", sources: ["qivalis"],
  },
  {
    id: "bper", name: "BPER Banca", domain: "bper.it", type: "Universal bank", layer: "access-participants", rel: "prospect", country: "Italy", city: "Modena", lat: 44.65, lng: 10.93,
    what: "Italian banking group.",
    role: "Qivalis bank; not in RL1.",
    evidence: "confirmed", sources: ["qivalis"],
  },
  {
    id: "erste", name: "Erste Group", domain: "erstegroup.com", type: "Universal bank", layer: "access-participants", rel: "prospect", country: "Austria", city: "Vienna", lat: 48.21, lng: 16.37,
    what: "Austrian bank with a large CEE network.",
    role: "Qivalis bank; not in RL1.",
    evidence: "confirmed", sources: ["qivalis"],
  },
  {
    id: "bpce", name: "Groupe BPCE", domain: "groupebpce.com", type: "Cooperative banking group", layer: "access-participants", rel: "prospect", country: "France", city: "Paris", lat: 48.86, lng: 2.35,
    what: "French cooperative group; parent of Natixis CIB.",
    role: "Qivalis bank; its CIB Natixis is an RL1 founder.",
    evidence: "confirmed", sources: ["qivalis"],
  },
  {
    id: "handelsbanken", name: "Handelsbanken", domain: "handelsbanken.com", type: "Universal bank", layer: "access-participants", rel: "prospect", country: "Sweden", city: "Stockholm", lat: 59.33, lng: 18.07,
    what: "Swedish bank.",
    role: "Qivalis bank; not in RL1.",
    evidence: "confirmed", sources: ["qivalis"],
  },
  {
    id: "jyske", name: "Jyske Bank", domain: "jyskebank.dk", type: "Universal bank", layer: "access-participants", rel: "prospect", country: "Denmark", city: "Silkeborg", lat: 56.17, lng: 9.55,
    what: "Danish bank.",
    role: "Qivalis bank; not in RL1.",
    evidence: "confirmed", sources: ["qivalis"],
  },
  {
    id: "kutxabank", name: "Kutxabank", domain: "kutxabank.es", type: "Savings-bank group", layer: "access-participants", rel: "prospect", country: "Spain", city: "Bilbao", lat: 43.26, lng: -2.93,
    what: "Basque savings-bank group.",
    role: "Qivalis bank; not in RL1.",
    evidence: "confirmed", sources: ["qivalis"],
  },
  {
    id: "landsbankinn", name: "Landsbankinn", domain: "landsbankinn.is", type: "Universal bank", layer: "access-participants", rel: "prospect", country: "Iceland", city: "Reykjavík", lat: 64.15, lng: -21.94,
    what: "Icelandic bank (EEA).",
    role: "Qivalis bank; not in RL1.",
    evidence: "confirmed", sources: ["qivalis"],
  },
  {
    id: "nbg", name: "National Bank of Greece", domain: "nbg.gr", type: "Universal bank", layer: "access-participants", rel: "prospect", country: "Greece", city: "Athens", lat: 37.98, lng: 23.73,
    what: "Greek bank.",
    role: "Qivalis bank; Greece already worked with SWIAT via the Bank of Greece (Project Sovereign).",
    evidence: "confirmed", sources: ["qivalis"],
  },
  {
    id: "nordea", name: "Nordea", domain: "nordea.com", type: "Universal bank", layer: "access-participants", rel: "prospect", country: "Finland", city: "Helsinki", lat: 60.17, lng: 24.94,
    what: "Largest Nordic bank.",
    role: "Qivalis bank; not in RL1.",
    evidence: "confirmed", sources: ["qivalis"],
  },
  {
    id: "op", name: "OP Financial Group", domain: "op.fi", type: "Cooperative banking group", layer: "access-participants", rel: "prospect", country: "Finland", city: "Helsinki", lat: 60.17, lng: 24.94,
    what: "Finnish cooperative group.",
    role: "Qivalis bank; not in RL1.",
    evidence: "confirmed", sources: ["qivalis"],
  },
  {
    id: "piraeus", name: "Piraeus Bank", domain: "piraeusbank.gr", type: "Universal bank", layer: "access-participants", rel: "prospect", country: "Greece", city: "Athens", lat: 37.98, lng: 23.73,
    what: "Greek bank.",
    role: "Qivalis bank; not in RL1.",
    evidence: "confirmed", sources: ["qivalis"],
  },
  {
    id: "rabobank", name: "Rabobank", domain: "rabobank.com", type: "Cooperative bank", layer: "access-participants", rel: "prospect", country: "Netherlands", city: "Utrecht", lat: 52.09, lng: 5.12,
    what: "Dutch cooperative bank.",
    role: "Qivalis bank; not in RL1.",
    evidence: "confirmed", sources: ["qivalis"],
  },
  {
    id: "swedbank", name: "Swedbank", domain: "swedbank.com", type: "Universal bank", layer: "access-participants", rel: "prospect", country: "Sweden", city: "Stockholm", lat: 59.33, lng: 18.07,
    what: "Swedish bank.",
    role: "Qivalis bank; not in RL1.",
    evidence: "confirmed", sources: ["qivalis"],
  },
  {
    id: "socgen", name: "Société Générale", domain: "societegenerale.com", type: "Universal bank", layer: "access-participants", rel: "prospect", country: "France", city: "Paris", lat: 48.86, lng: 2.35,
    what: "French G-SIB; parent of SG-FORGE (digital bonds, EURCV/USDCV).",
    role: "Pontes market participant running its own stack; not in RL1.",
    evidence: "confirmed", sources: ["pontes"],
  },
  {
    id: "santander", name: "Santander", domain: "santander.com", type: "Universal bank", layer: "access-participants", rel: "prospect", country: "Spain", city: "Madrid", lat: 40.42, lng: -3.7,
    what: "Largest euro-area bank by customers.",
    role: "Pontes market participant; not in RL1.",
    evidence: "confirmed", sources: ["pontes"],
  },
  {
    id: "commerzbank", name: "Commerzbank", domain: "commerzbank.com", type: "Universal bank", layer: "access-participants", rel: "prospect", country: "Germany", city: "Frankfurt", lat: 50.11, lng: 8.68,
    what: "Germany's second-largest private bank; BaFin crypto-custody licence.",
    role: "Neither in RL1 nor in the Pontes or Qivalis lists cited here: the big German gap after Deutsche Bank.",
    evidence: "reported", sources: [],
  },
  {
    id: "nrwbank", name: "NRW.BANK", domain: "nrwbank.de", type: "Development bank", layer: "access-participants", rel: "prospect", country: "Germany", city: "Düsseldorf", lat: 51.23, lng: 6.78,
    what: "Development bank of North Rhine-Westphalia; digital-bond issuer.",
    role: "Pontes market participant; peer of RL1 supporters KfW and L-Bank, but not in RL1.",
    evidence: "confirmed", sources: ["pontes"],
  },
  {
    id: "cdc", name: "Caisse des Dépôts", domain: "caissedesdepots.fr", type: "Public financial institution", layer: "access-participants", rel: "prospect", country: "France", city: "Paris", lat: 48.86, lng: 2.35,
    what: "French state financial institution.",
    role: "Pontes market participant; not in RL1.",
    evidence: "confirmed", sources: ["pontes"],
  },
  {
    id: "memobank", name: "Memo Bank", domain: "memo.bank", type: "Corporate bank", layer: "access-participants", rel: "prospect", country: "France", city: "Paris", lat: 48.86, lng: 2.35,
    what: "French independent corporate bank with direct central-bank access.",
    role: "Pontes market participant; not in RL1.",
    evidence: "confirmed", sources: ["pontes"],
  },
  {
    id: "eib", name: "European Investment Bank", domain: "eib.org", type: "Supranational issuer", layer: "asset-securities", rel: "prospect", country: "Luxembourg", city: "Luxembourg", lat: 49.61, lng: 6.13,
    what: "EU bank; the most prolific digital-bond issuer (Banque de France trials, Goldman GS DAP, HSBC Orion).",
    role: "Pontes market participant headquartered in RL1's home city, issuing elsewhere.",
    evidence: "confirmed", sources: ["pontes"],
  },
  {
    id: "dws", name: "DWS", domain: "dws.com", type: "Asset manager", layer: "access-participants", rel: "prospect", country: "Germany", city: "Frankfurt", lat: 50.11, lng: 8.68,
    what: "Deutsche Bank's asset manager; co-founder of AllUnity (EURAU).",
    role: "Owns part of a competing euro stablecoin; not in RL1.",
    evidence: "reported", sources: [],
  },
  {
    id: "standardchartered", name: "Standard Chartered", domain: "sc.com", type: "Universal bank", layer: "access-participants", rel: "ecosystem", country: "United Kingdom", city: "London", lat: 51.51, lng: -0.13,
    what: "Parent of SC Ventures; co-founder of Partior; backer of Zodia Custody and Libeara.",
    role: "In RL1 indirectly through SC Ventures, also on Partior.",
    evidence: "confirmed", sources: ["rl1launch"],
  },

  // ── More public sector & standard setters ─────────────────────────────
  {
    id: "banquedefrance", name: "Banque de France", domain: "banque-france.fr", type: "Central bank", layer: "governance", rel: "public", country: "France", city: "Paris", lat: 48.86, lng: 2.35,
    what: "French central bank; its ACPR licenses e-money issuers such as Circle's EU entity.",
    role: "Co-developer of Pontes with the Bundesbank and Banca d'Italia (reported).",
    evidence: "reported", sources: [],
  },
  {
    id: "bancaditalia", name: "Banca d'Italia", domain: "bancaditalia.it", type: "Central bank", layer: "governance", rel: "public", country: "Italy", city: "Rome", lat: 41.9, lng: 12.5,
    what: "Italian central bank.",
    role: "Co-developer of Pontes (reported).",
    evidence: "reported", sources: [],
  },
  {
    id: "dnb", name: "De Nederlandsche Bank", domain: "dnb.nl", type: "Central bank / supervisor", layer: "governance", rel: "public", country: "Netherlands", city: "Amsterdam", lat: 52.37, lng: 4.9,
    what: "Dutch central bank and prudential supervisor.",
    role: "Supervises Qivalis's e-money licence and ABN AMRO.",
    evidence: "confirmed", sources: ["qivalis"],
  },
  {
    id: "amf", name: "AMF", domain: "amf-france.org", type: "Regulator", layer: "governance", rel: "public", country: "France", city: "Paris", lat: 48.86, lng: 2.35,
    what: "French markets regulator.",
    role: "Supervises French members' securities activities.",
    evidence: "inferred", sources: [],
  },
  {
    id: "eucommission", name: "European Commission", domain: "commission.europa.eu", type: "EU executive", layer: "governance", rel: "public", country: "Belgium", city: "Brussels", lat: 50.85, lng: 4.35,
    what: "Author of MiCA, the DLT Pilot Regime and the Savings and Investments Union agenda.",
    role: "Sets the legislative frame RL1 depends on; DLT Pilot Regime review pending.",
    evidence: "inferred", sources: [],
  },
  {
    id: "finma", name: "FINMA", domain: "finma.ch", type: "Regulator", layer: "governance", rel: "public", country: "Switzerland", city: "Bern", lat: 46.95, lng: 7.45,
    what: "Swiss financial supervisor.",
    role: "Licenses BX Digital, where Seturion is live.",
    evidence: "confirmed", sources: ["seturion"],
  },
  {
    id: "fca", name: "FCA", domain: "fca.org.uk", type: "Regulator", layer: "governance", rel: "public", country: "United Kingdom", city: "London", lat: 51.51, lng: -0.13,
    what: "UK conduct regulator.",
    role: "Home regulator of NatWest and SC Ventures' parent; UK Digital Securities Sandbox.",
    evidence: "inferred", sources: [],
  },
  {
    id: "mas", name: "MAS", domain: "mas.gov.sg", type: "Central bank / regulator", layer: "governance", rel: "public", country: "Singapore", city: "Singapore", lat: 1.35, lng: 103.82,
    what: "Monetary Authority of Singapore; runs Project Guardian and GL1.",
    role: "Source of the Access/Service/Asset/Platform layer model used here.",
    evidence: "reported", sources: ["li_2025"],
  },
  {
    id: "bis", name: "BIS", domain: "bis.org", type: "Supranational", layer: "governance", rel: "public", country: "Switzerland", city: "Basel", lat: 47.56, lng: 7.59,
    what: "Bank for International Settlements.",
    role: "Runs Project Agorá on tokenised correspondent banking.",
    evidence: "inferred", sources: [],
  },
  {
    id: "icma", name: "ICMA", domain: "icmagroup.org", type: "Standard setter", layer: "governance", rel: "public", country: "Switzerland", city: "Zurich", lat: 47.37, lng: 8.54,
    what: "International Capital Market Association; Bond Data Taxonomy for digital bonds.",
    role: "Common bond data standard that RL1 issuance could adopt.",
    evidence: "inferred", sources: [],
  },

  // ── More platforms, settlement assets and services ─────────────────────
  {
    id: "appia", name: "Appia (Eurosystem)", short: "Appia", domain: "ecb.europa.eu", type: "Future CB settlement design", layer: "platform-ledger", rel: "public", country: "Germany", city: "Frankfurt", lat: 50.11, lng: 8.68,
    what: "The Eurosystem's long-term blueprint for an integrated DLT-based wholesale settlement ecosystem.",
    role: "Long-term successor to Pontes; could make RL1 one of several connected ledgers or redundant.",
    evidence: "reported", sources: ["rl1launch"],
  },
  {
    id: "sdx", name: "SIX Digital Exchange", short: "SDX", domain: "sdx.com", type: "DLT CSD & venue", layer: "platform-ledger", rel: "peer", country: "Switzerland", city: "Zurich", lat: 47.37, lng: 8.54,
    what: "FINMA-licensed DLT CSD settling digital bonds with SNB wholesale CBDC.",
    role: "Swiss alternative for European issuers.",
    evidence: "inferred", sources: [],
  },
  {
    id: "ethereum", name: "Ethereum (public)", short: "Ethereum", domain: "ethereum.org", type: "Public blockchain", layer: "platform-ledger", rel: "peer", country: "Switzerland", city: "Zug", lat: 47.17, lng: 8.52,
    what: "Largest public smart-contract chain; home of most tokenised funds and stablecoins.",
    role: "Where SG-FORGE, EURC and tokenised MMFs live; no RL1 bridge announced.",
    evidence: "inferred", sources: [],
  },
  {
    id: "hsbcorion", name: "HSBC Orion", short: "HSBC Orion", domain: "hsbc.com", type: "Bank tokenisation platform", layer: "platform-ledger", rel: "peer", country: "United Kingdom", city: "London", lat: 51.51, lng: -0.13,
    what: "HSBC's digital-bond platform (EIB, Hong Kong government).",
    role: "Competes for SSA digital-bond issuance.",
    evidence: "inferred", sources: [],
  },
  {
    id: "agora", name: "Project Agorá", short: "Agorá", domain: "bis.org", type: "Tokenised correspondent banking", layer: "platform-ledger", rel: "peer", country: "Switzerland", city: "Basel", lat: 47.56, lng: 7.59,
    what: "BIS-led project with central banks and 40+ private firms on tokenised deposits and wholesale CBDC.",
    role: "Several RL1-adjacent banks take part; cross-border model RL1 lacks.",
    evidence: "inferred", sources: [],
  },
  {
    id: "allunity", name: "AllUnity", domain: "allunity.com", type: "Euro stablecoin (EMI)", layer: "asset-cash", rel: "adjacent", country: "Germany", city: "Frankfurt", lat: 50.11, lng: 8.68,
    what: "BaFin-licensed e-money institution issuing EURAU; founded by DWS, Galaxy and Flow Traders.",
    role: "German euro stablecoin outside the bank consortia: alternative cash leg.",
    evidence: "reported", sources: [],
  },
  {
    id: "circle", name: "Circle (EURC)", short: "Circle EURC", domain: "circle.com", type: "Euro stablecoin (EMI)", layer: "asset-cash", rel: "adjacent", country: "France", city: "Paris", lat: 48.86, lng: 2.35,
    what: "MiCA-compliant EURC, issued by Circle's French e-money entity.",
    role: "Largest MiCA euro stablecoin; public-chain only.",
    evidence: "reported", sources: [],
  },
  {
    id: "bsdigital", name: "Boerse Stuttgart Digital", domain: "boerse-stuttgart.de", type: "Crypto custody & trading", layer: "service-market", rel: "adjacent", country: "Germany", city: "Stuttgart", lat: 48.78, lng: 9.18,
    what: "MiCA-licensed crypto trading and custody for banks, sibling of Seturion.",
    role: "Brokerage/custody rail in the same group as RL1 founder Seturion.",
    evidence: "reported", sources: [],
  },
  {
    id: "bxdigital", name: "BX Digital", domain: "bxswiss.com", type: "DLT trading facility", layer: "service-market", rel: "adjacent", country: "Switzerland", city: "Zurich", lat: 47.37, lng: 8.54,
    what: "FINMA-licensed DLT trading facility.",
    role: "First live Seturion deployment.",
    evidence: "confirmed", sources: ["seturion"],
  },
  {
    id: "cryptofinance", name: "Crypto Finance", domain: "crypto-finance.com", type: "Digital-asset custody & trading", layer: "service-market", rel: "adjacent", country: "Switzerland", city: "Zurich", lat: 47.37, lng: 8.54,
    what: "Deutsche Börse's crypto custody, trading and settlement arm with BaFin licences.",
    role: "Deutsche Börse's custody arm, aligned with Clearstream D7 rather than RL1.",
    evidence: "reported", sources: [],
  },
  {
    id: "ripplecustody", name: "Ripple Custody (ex-Metaco)", short: "Ripple Custody", domain: "ripple.com", type: "Custody technology", layer: "access-wallets", rel: "adjacent", country: "Switzerland", city: "Lausanne", lat: 46.52, lng: 6.63,
    what: "Bank-grade custody and tokenisation orchestration (ex-Metaco).",
    role: "Wallet stack used by several European banks; no RL1 link.",
    evidence: "reported", sources: [],
  },
];

export const edges: Rl1Edge[] = [
  // Governance
  ...["abnamro", "cecabank", "chartered", "creditmutuel", "dekabank", "dzbank", "lbbw", "natixis", "scventures", "seturion"].map(
    (id): Rl1Edge => ({ from: id, to: "rl1", kind: "governance", label: "Founding member (equal vote)", evidence: "confirmed" }),
  ),
  { from: "natwest", to: "rl1", kind: "governance", label: "Joining soon (Phase 1 participant)", evidence: "reported" },
  { from: "kfw", to: "rl1", kind: "governance", label: "Supporter (member 2025, now supporter)", evidence: "confirmed" },
  { from: "lbank", to: "rl1", kind: "governance", label: "Supporter (joined Feb 2026)", evidence: "confirmed" },
  { from: "vbank", to: "rl1", kind: "governance", label: "Supporter / observer (Phase 1 funder)", evidence: "reported" },
  { from: "imf", to: "rl1", kind: "governance", label: "Observer", evidence: "confirmed" },

  // Operations
  { from: "swiat", to: "rl1", kind: "ops", label: "Technical infrastructure operator + validator", evidence: "confirmed" },
  ...["adesso", "gft", "nttdata", "soprasteria", "dekabank", "lbbw", "scventures"].map(
    (id): Rl1Edge => ({ from: id, to: "rl1", kind: "ops", label: "Validator node", evidence: "confirmed" }),
  ),
  { from: "thinktank", to: "swiat", kind: "ops", label: "Validator 2023, not in RL1 set", evidence: "inferred" },
  { from: "adesso", to: "swiat", kind: "ops", label: "Co-built SWIAT Access onboarding", evidence: "confirmed" },

  // Ownership
  { from: "dekabank", to: "swiat", kind: "ownership", label: "Founder & shareholder", evidence: "confirmed" },
  { from: "lbbw", to: "swiat", kind: "ownership", label: "Shareholder", evidence: "confirmed" },
  { from: "scventures", to: "swiat", kind: "ownership", label: "Shareholder", evidence: "confirmed" },
  { from: "comyno", to: "swiat", kind: "ownership", label: "Shareholder", evidence: "reported" },
  { from: "lbbw", to: "berlinhyp", kind: "ownership", label: "Parent", evidence: "confirmed" },
  { from: "natixis", to: "natixispfb", kind: "ownership", label: "Parent", evidence: "confirmed" },
  { from: "scventures", to: "zodia", kind: "ownership", label: "Backer", evidence: "confirmed" },
  { from: "scventures", to: "olea", kind: "ownership", label: "Backer", evidence: "reported" },
  { from: "standardchartered", to: "scventures", kind: "ownership", label: "Parent", evidence: "confirmed" },
  { from: "standardchartered", to: "partior", kind: "ownership", label: "Co-founder", evidence: "confirmed" },
  { from: "deutschebank", to: "partior", kind: "ownership", label: "Shareholder", evidence: "reported" },

  // Transactions (SWIAT era, now RL1)
  { from: "siemens", to: "swiat", kind: "transaction", label: "€300m crypto security, DvP in wholesale euro (2024)", evidence: "confirmed" },
  { from: "berlinhyp", to: "swiat", kind: "transaction", label: "€100m digital mortgage Pfandbrief (2024)", evidence: "confirmed" },
  { from: "natixispfb", to: "dekabank", kind: "transaction", label: "€100m digital covered bond, Deka registrar (2024)", evidence: "confirmed" },
  { from: "kfw", to: "berlinhyp", kind: "transaction", label: "Bought €10m of the digital Pfandbrief (2025)", evidence: "confirmed" },
  { from: "bayernlb", to: "swiat", kind: "transaction", label: "Digital bond DvP in ECB trials (2024)", evidence: "confirmed" },
  { from: "sskm", to: "bayernlb", kind: "transaction", label: "Investor in BayernLB digital bond", evidence: "confirmed" },
  { from: "metzler", to: "dekabank", kind: "transaction", label: "Crypto securities vs wholesale euro (2024)", evidence: "confirmed" },
  { from: "natwest", to: "dekabank", kind: "transaction", label: "2 intraday repos in ECB trials (2024)", evidence: "confirmed" },
  { from: "lbbw", to: "dekabank", kind: "transaction", label: "Automated DvP in CeBM (2024)", evidence: "confirmed" },
  { from: "berlinervb", to: "swiat", kind: "transaction", label: "First blockchain investment (2025)", evidence: "confirmed" },
  { from: "sparkassen", to: "dekabank", kind: "transaction", label: "DvP purchases; use Deka registry", evidence: "confirmed" },
  { from: "vasakronan", to: "dekabank", kind: "transaction", label: "Digital green debt (2021)", evidence: "confirmed" },
  { from: "olea", to: "swiat", kind: "transaction", label: "Tokenised trade receivables (2024)", evidence: "reported" },
  { from: "bankofgreece", to: "swiat", kind: "transaction", label: "Project Sovereign (2026)", evidence: "confirmed" },
  ...["helaba", "unioninvest", "deutschebank", "hal", "360x", "kinexys"].map(
    (id): Rl1Edge => ({ from: id, to: "swiat", kind: "transaction", label: "Named in SWIAT transaction/press material", evidence: "reported" }),
  ),

  // Cash & settlement
  { from: "swiat", to: "pontes", kind: "cash", label: "Connected DLT operator (live 21 Sep 2026)", evidence: "confirmed" },
  { from: "pontes", to: "ecb", kind: "cash", label: "Settles in TARGET central bank money", evidence: "confirmed" },
  { from: "bundesbank", to: "pontes", kind: "cash", label: "Trigger Solution in trials; Pontes co-developer and participant", evidence: "confirmed" },
  ...["dekabank", "dzbank", "cecabank", "kfw", "bayernlb", "deutschebank"].map(
    (id): Rl1Edge => ({ from: id, to: "pontes", kind: "cash", label: "Pontes market participant", evidence: "confirmed" }),
  ),
  ...["d7", "cashlink", "axiology"].map((id): Rl1Edge => ({ from: id, to: "pontes", kind: "cash", label: "Connected DLT operator", evidence: "confirmed" })),
  { from: "seturion", to: "rl1", kind: "cash", label: "Settlement front-end: CeBM or on-chain cash", evidence: "inferred" },
  ...["abnamro", "cecabank", "creditmutuel", "dekabank", "dzbank", "helaba"].map(
    (id): Rl1Edge => ({ from: id, to: "qivalis", kind: "cash", label: "Qivalis consortium bank", evidence: "confirmed" }),
  ),
  { from: "natixis", to: "qivalis", kind: "cash", label: "Via parent Groupe BPCE", evidence: "confirmed" },

  // Vendors
  { from: "dfns", to: "abnamro", kind: "vendor", label: "Wallet / key infrastructure client", evidence: "confirmed" },
  { from: "fireblocks", to: "abnamro", kind: "vendor", label: "MPC custody client", evidence: "confirmed" },
  { from: "dfns", to: "zodia", kind: "vendor", label: "Wallet infrastructure client", evidence: "reported" },
  { from: "taurus", to: "deutschebank", kind: "vendor", label: "Custody technology", evidence: "reported" },
  { from: "kaleido", to: "d7", kind: "vendor", label: "Technology for Deutsche Börse / Clearstream digital Eurobond", evidence: "confirmed" },
  { from: "kaleido", to: "canton", kind: "vendor", label: "Supported chain", evidence: "confirmed" },

  // Regulation
  { from: "bafin", to: "swiat", kind: "regulation", label: "Crypto-securities register permission (2025)", evidence: "confirmed" },
  { from: "bafin", to: "dekabank", kind: "regulation", label: "Crypto-securities registrar licence (2024)", evidence: "confirmed" },
  { from: "bafin", to: "seturion", kind: "regulation", label: "DLT Pilot Regime application", evidence: "confirmed" },
  { from: "cssf", to: "rl1", kind: "regulation", label: "Domicile supervisor (role undisclosed)", evidence: "inferred" },
  { from: "esma", to: "seturion", kind: "regulation", label: "DLT Pilot Regime framework", evidence: "inferred" },

  // Peers
  ...["d7", "euroclear", "cashlink", "axiology", "21x", "sgforge", "canton"].map(
    (id): Rl1Edge => ({ from: id, to: "rl1", kind: "peer", label: "Competes for EU issuance & settlement", evidence: "inferred" }),
  ),
  ...["gl1", "rln", "partior", "kinexys", "fnality"].map(
    (id): Rl1Edge => ({ from: id, to: "rl1", kind: "peer", label: "Comparable network; no interop announced", evidence: "inferred" }),
  ),

  // Relevant institutions not in RL1
  ...[
    "bnpparibas", "ing", "unicredit", "intesa", "caixabank", "bbva", "bancasella", "kbc", "danske", "seb", "rbi", "abanca", "aib", "sabadell", "boi", "pekao", "bankinter", "bcee", "bper", "erste", "bpce", "handelsbanken", "jyske", "kutxabank", "landsbankinn", "nbg", "nordea", "op", "piraeus", "rabobank", "swedbank",
  ].map((id): Rl1Edge => ({ from: id, to: "qivalis", kind: "cash", label: "Qivalis consortium bank", evidence: "confirmed" })),
  ...["socgen", "santander", "abanca", "nrwbank", "cdc", "memobank", "eib"].map(
    (id): Rl1Edge => ({ from: id, to: "pontes", kind: "cash", label: "Pontes market participant", evidence: "confirmed" }),
  ),
  { from: "bpce", to: "natixis", kind: "ownership", label: "Parent of RL1 founder Natixis CIB", evidence: "confirmed" },
  { from: "socgen", to: "sgforge", kind: "ownership", label: "Parent", evidence: "confirmed" },
  { from: "dws", to: "allunity", kind: "ownership", label: "Co-founder (with Galaxy, Flow Traders)", evidence: "reported" },
  { from: "deutschebank", to: "dws", kind: "ownership", label: "Majority owner", evidence: "confirmed" },
  { from: "dfns", to: "bancasella", kind: "vendor", label: "Wallet infrastructure client", evidence: "confirmed" },
  { from: "bnpparibas", to: "canton", kind: "peer", label: "Canton Network participant", evidence: "reported" },
  { from: "eib", to: "hsbcorion", kind: "transaction", label: "Digital bond issuance", evidence: "reported" },
  { from: "sgforge", to: "ethereum", kind: "transaction", label: "Digital bonds and EURCV on public chain", evidence: "reported" },
  { from: "circle", to: "ethereum", kind: "cash", label: "EURC issued on public chains", evidence: "reported" },
  { from: "allunity", to: "ethereum", kind: "cash", label: "EURAU issued on public chain", evidence: "inferred" },
  { from: "bsdigital", to: "seturion", kind: "ownership", label: "Sister company (Boerse Stuttgart Group)", evidence: "confirmed" },
  { from: "dzbank", to: "bsdigital", kind: "vendor", label: "Crypto trading for cooperative banks", evidence: "reported" },
  { from: "seturion", to: "bxdigital", kind: "vendor", label: "Live settlement deployment", evidence: "confirmed" },
  { from: "cryptofinance", to: "d7", kind: "ownership", label: "Sister company (Deutsche Börse Group)", evidence: "reported" },
  { from: "ripplecustody", to: "sgforge", kind: "vendor", label: "Custody technology", evidence: "reported" },
  { from: "sdx", to: "rl1", kind: "peer", label: "Competes for European digital bonds", evidence: "inferred" },
  { from: "ethereum", to: "rl1", kind: "peer", label: "Public alternative; no bridge announced", evidence: "inferred" },
  { from: "hsbcorion", to: "rl1", kind: "peer", label: "Competes for SSA digital bonds", evidence: "inferred" },
  { from: "agora", to: "rl1", kind: "peer", label: "Cross-border tokenised deposits; no link", evidence: "inferred" },
  { from: "bis", to: "agora", kind: "regulation", label: "Runs the project", evidence: "confirmed" },
  { from: "mas", to: "gl1", kind: "regulation", label: "Leads the initiative", evidence: "confirmed" },
  { from: "ecb", to: "appia", kind: "regulation", label: "Long-term blueprint", evidence: "confirmed" },
  { from: "appia", to: "rl1", kind: "potential", label: "Long-term CB settlement layer RL1 must connect to", evidence: "inferred" },
  { from: "banquedefrance", to: "pontes", kind: "cash", label: "Co-developer", evidence: "reported" },
  { from: "bancaditalia", to: "pontes", kind: "cash", label: "Co-developer", evidence: "reported" },
  { from: "banquedefrance", to: "circle", kind: "regulation", label: "ACPR e-money licence", evidence: "reported" },
  { from: "dnb", to: "qivalis", kind: "regulation", label: "E-money licence supervisor", evidence: "confirmed" },
  { from: "dnb", to: "abnamro", kind: "regulation", label: "Prudential supervisor (with ECB SSM)", evidence: "inferred" },
  { from: "bafin", to: "allunity", kind: "regulation", label: "E-money licence", evidence: "reported" },
  { from: "finma", to: "bxdigital", kind: "regulation", label: "DLT trading facility licence", evidence: "confirmed" },
  { from: "fca", to: "natwest", kind: "regulation", label: "Home conduct regulator", evidence: "inferred" },
  { from: "eucommission", to: "esma", kind: "regulation", label: "DLT Pilot Regime and MiCA legislation", evidence: "inferred" },
  { from: "icma", to: "rl1", kind: "potential", label: "Bond Data Taxonomy for digital issues", evidence: "inferred" },

  // Potential (not announced)
  { from: "kaleido", to: "rl1", kind: "potential", label: "Node, middleware, privacy (Paladin) for a member", evidence: "inferred" },
  { from: "dfns", to: "rl1", kind: "potential", label: "Keys & wallets for members' RL1 addresses", evidence: "inferred" },
  { from: "anchorage", to: "rl1", kind: "potential", label: "US custody / USD gateway, no route today", evidence: "inferred" },
  { from: "qivalis", to: "rl1", kind: "potential", label: "Euro stablecoin as on-chain cash leg", evidence: "inferred" },
  { from: "zodia", to: "rl1", kind: "potential", label: "Third-party custodian for RL1 assets", evidence: "inferred" },
];

export type Rl1Flow = {
  id: string;
  title: string;
  status: "live" | "trial" | "prospective" | "gap";
  summary: string;
  /** `layer` picks which of the node's positions (primary or ghost) the flow passes through. */
  steps: { node: string; layer?: Rl1Layer; text: string }[];
};

export const flows: Rl1Flow[] = [
  {
    id: "bond-cebm",
    title: "Digital bond, DvP in central bank money",
    status: "live",
    summary: "The flagship pattern: the Siemens and Berlin Hyp deals, now with Pontes instead of trial infrastructure.",
    steps: [
      { node: "siemens", text: "Issuer mandates the deal and signs terms under eWpG." },
      { node: "dekabank", layer: "asset-securities", text: "Arranger and BaFin-licensed crypto-securities registrar records the issue." },
      { node: "swiat", layer: "service-tech", text: "SWIAT's registry and settlement engine prepares the DvP instruction." },
      { node: "rl1", text: "Security token minted and locked on RL1." },
      { node: "adesso", text: "Validator nodes (SWIAT, DekaBank, LBBW, SC Ventures, adesso, GFT, NTT DATA, Sopra Steria) finalise the block." },
      { node: "pontes", text: "Pontes moves the euro leg in TARGET when the lock is confirmed." },
      { node: "ecb", text: "Central bank money settles; Pontes releases the token." },
      { node: "kfw", text: "Investor's RL1 address receives the bond." },
    ],
  },
  {
    id: "repo",
    title: "Intraday repo between banks",
    status: "trial",
    summary: "DekaBank and NatWest ran two intraday repos in the 2024 ECB trials; the RL1 use case list includes repo and securities lending.",
    steps: [
      { node: "natwest", text: "Cash borrower delivers digital bonds as collateral." },
      { node: "rl1", text: "Collateral moves on RL1 against the repo smart contract." },
      { node: "pontes", text: "Cash leg in central bank money." },
      { node: "dekabank", text: "Cash lender; unwind at end of day reverses both legs." },
    ],
  },
  {
    id: "stablecoin",
    title: "Euro stablecoin as the cash leg",
    status: "prospective",
    summary: "Not announced. Five RL1 founding members, plus Natixis via BPCE, are Qivalis banks; a bank stablecoin on RL1 would give 24/7 settlement without Pontes hours.",
    steps: [
      { node: "qivalis", text: "Qivalis issues EMT under its DNB e-money licence." },
      { node: "abnamro", text: "Member bank mints/receives euro tokens for a client." },
      { node: "dfns", text: "Keys held in the bank's wallet stack (Dfns is an ABN AMRO vendor today)." },
      { node: "rl1", text: "Atomic swap against a security token on RL1." },
      { node: "seturion", text: "Seturion finalises and reports the trade." },
      { node: "dzbank", text: "Counterparty member receives tokens." },
    ],
  },
  {
    id: "qivalis-gap",
    title: "Where Qivalis banks would plug in",
    status: "gap",
    summary: "37 banks in 15 countries back Qivalis; RL1's founders cover 5 countries. A Qivalis bank holding euro tokens has no RL1 route unless the stablecoin is issued there.",
    steps: [
      { node: "unicredit", text: "Qivalis bank (Italy: no Italian RL1 member) wants to buy an RL1 digital bond." },
      { node: "qivalis", text: "Holds Qivalis euro tokens, issued on other chains." },
      { node: "pontes", text: "Fallback: central bank money via Pontes, during TARGET hours." },
      { node: "rl1", text: "Bond settles on RL1 only if the bank is onboarded as a participant." },
    ],
  },
  {
    id: "onboard",
    title: "A non-member bank connects",
    status: "prospective",
    summary: "How Deutsche Bank-type institutions could join without building a node team: vendor stack plus SWIAT Access.",
    steps: [
      { node: "deutschebank", text: "Bank decides to participate (today: transacts via SWIAT, not a member)." },
      { node: "taurus", text: "Keys stay in the bank's incumbent custody stack (Taurus today)." },
      { node: "kaleido", text: "Middleware connects core banking to the ledger; Kaleido could also run the node and privacy layer." },
      { node: "swiat", layer: "access-wallets", text: "SWIAT Access onboards the participant." },
      { node: "rl1", text: "Bank becomes a participant; membership vote by the General Assembly." },
    ],
  },
  {
    id: "us",
    title: "US investor buys an RL1 bond",
    status: "gap",
    summary: "No route exists today: no US member, custodian or USD leg. This is what Anchorage-type players would fill.",
    steps: [
      { node: "anchorage", text: "US qualified custodian for the investor." },
      { node: "partior", text: "Possible USD/EUR leg via a network with RL1-member ties (Standard Chartered)." },
      { node: "standardchartered", text: "Parent of SC Ventures, co-founder of Partior: the only bridge in the map." },
      { node: "scventures", text: "The only member with a non-EU footprint." },
      { node: "rl1", text: "Bond held on RL1, recognised under eWpG; US securities-law wrapper unresolved." },
    ],
  },
];

export type BlindSpot = { title: string; lens: string; severity: "high" | "medium" | "low"; text: string; ask: string };

export const blindSpots: BlindSpot[] = [
  {
    title: "Germany is the network",
    lens: "Geography",
    severity: "high",
    text: "Five of ten founding members, six of eight validators, the operator, the registrar licences and the cash-leg history are German. The SCE sits in Luxembourg, but the legal and operational centre of gravity is Frankfurt-Stuttgart.",
    ask: "Which non-German member will run a validator first, and under which national e-securities law will French, Dutch and Spanish issuers register?",
  },
  {
    title: "Europe's largest banks are elsewhere",
    lens: "Membership",
    severity: "high",
    text: "BNP Paribas, Société Générale, Deutsche Bank, Commerzbank, ING, UniCredit, Santander and Intesa are absent, and no Italian, Belgian, Austrian, Irish or Nordic institution is in RL1. The same banks are organising a euro stablecoin together (Qivalis: 37 banks, 15 countries), so the cooperation exists, just not on RL1. Deutsche Bank, BayernLB, Société Générale and Santander are on Pontes; Deutsche Bank has even transacted via SWIAT. They are choosing other rails (Canton, SG-FORGE, own platforms).",
    ask: "What would make a G-SIB join: governance weight, interop with its existing network, or a cash leg it already funds (Qivalis)?",
  },
  {
    title: "Membership churn before launch",
    lens: "Membership",
    severity: "medium",
    text: "Of the ten Sep 2025 Phase-1 funders, KfW stepped down to supporter, V-Bank to observer, NatWest is still pending, and one 2023 validator (think tank Business Solutions) is no longer listed. Cecabank and Crédit Mutuel filled the gaps.",
    ask: "Is the equal-cost cooperative model too expensive for smaller or public institutions?",
  },
  {
    title: "The cash leg is borrowed",
    lens: "Money",
    severity: "high",
    text: "RL1 has no native money. Central bank money comes via Pontes (live 21 Sep 2026, TARGET hours, interim solution until Appia). Bank stablecoins are listed as a use case, yet Qivalis, whose 37 banks in 15 countries include five RL1 founders and Natixis's parent BPCE, has no announced RL1 deployment. AllUnity (DWS) and Circle's EURC are further euro tokens with no RL1 presence.",
    ask: "Will Qivalis or member deposit tokens issue natively on RL1, and who runs the liquidity bridge to Pontes?",
  },
  {
    title: "No CSD or ICSD inside",
    lens: "Competition",
    severity: "high",
    text: "Clearstream (D7) and Euroclear (D-FMI) are both building competing platforms and Clearstream is already Pontes-connected. Collateral eligibility, Eurobond distribution and asset servicing still run through them.",
    ask: "Is RL1 a competitor to the ICSDs or a ledger they could connect to? Neither is said publicly.",
  },
  {
    title: "Wallet and custody layer unspecified",
    lens: "Vendors",
    severity: "medium",
    text: "Nothing public says how members hold RL1 keys or whether third-party custodians are admitted. Today ABN AMRO uses Dfns and Fireblocks, DZ BANK has its own custody platform, Deutsche Bank uses Taurus. Each member is solving key management alone.",
    ask: "Will RL1 publish a wallet/custody standard or an approved-provider list? That is the opening for Dfns, Kaleido, Fireblocks and Taurus.",
  },
  {
    title: "Owners don't run nodes",
    lens: "Operations",
    severity: "medium",
    text: "Seven of ten members do not validate (ABN AMRO, Cecabank, Chartered Investment, Crédit Mutuel, DZ BANK, Natixis, Seturion). Four of eight validators are IT consultancies. Governance and consensus are held by different groups.",
    ask: "How are validators admitted, paid and replaced, and how is that treated under DORA third-party risk rules?",
  },
  {
    title: "Single technology supplier",
    lens: "Operations",
    severity: "medium",
    text: "SWIAT built the network, operates it, runs a validator, sells the onboarding product and the registry/settlement apps, and is owned by three members. The cooperative owns the ledger but depends on one vendor for almost everything around it.",
    ask: "Is there an exit plan or second implementation if SWIAT is acquired or fails?",
  },
  {
    title: "Technical stack not disclosed",
    lens: "Technology",
    severity: "medium",
    text: "Client software, consensus, finality guarantees, privacy model and throughput are not public. On a shared permissioned ledger, competing banks and validators may see each other's positions unless a privacy layer (e.g. Paladin, zero-knowledge) is in place.",
    ask: "Which client and consensus does RL1 run, and who can read what?",
  },
  {
    title: "No route outside Europe",
    lens: "Geography",
    severity: "medium",
    text: "No US, Middle East or Asian bank is a member; the IMF is an observer and SC Ventures is the only non-EU member. No interop is announced with Canton, Partior, Kinexys, GL1 or public chains, so USD liquidity and tokenised money-market funds can't be used as collateral.",
    ask: "Is interop on the roadmap, and through whom: Standard Chartered/Partior, Kaleido-style middleware, or Pontes alone?",
  },
  {
    title: "Small volume so far",
    lens: "Scale",
    severity: "low",
    text: "€700m+ over 50+ transactions in three years: Siemens alone is €300m. Averages are ~€14m per deal and the volume is mostly primary issuance in German formats.",
    ask: "What is the 2027 volume target and which member brings repeat flow (repo, funds, collateral) rather than one-off issues?",
  },
];

export const RELATION_LABEL: Record<Rl1Relation, string> = {
  platform: "Platform",
  founding: "Founding member",
  joining: "Joining",
  supporter: "Supporter",
  observer: "Observer",
  operator: "Operator",
  validator: "Validator",
  ecosystem: "Ecosystem participant",
  public: "Public sector & money",
  adjacent: "Adjacent (no RL1 link)",
  peer: "Peer / competing network",
  prospect: "Not in RL1 (relevant)",
  former: "Former",
};

/** Colour groups (max 7, validated categorical palette order). */
export type Rl1Group = "members" | "ecosystem" | "adjacent" | "supporters" | "public" | "peers" | "ops" | "prospects";

export const GROUPS: { id: Rl1Group; label: string }[] = [
  { id: "members", label: "Members" },
  { id: "ecosystem", label: "Ecosystem" },
  { id: "adjacent", label: "Adjacent vendors" },
  { id: "supporters", label: "Supporters & observers" },
  { id: "public", label: "Public sector & money" },
  { id: "peers", label: "Peer networks" },
  { id: "ops", label: "Operator & validators" },
  { id: "prospects", label: "Not in RL1 (relevant)" },
];

export function groupOf(e: Pick<Rl1Entity, "rel">): Rl1Group {
  switch (e.rel) {
    case "platform":
    case "founding":
    case "joining":
      return "members";
    case "supporter":
    case "observer":
      return "supporters";
    case "operator":
    case "validator":
    case "former":
      return "ops";
    case "ecosystem":
      return "ecosystem";
    case "public":
      return "public";
    case "adjacent":
      return "adjacent";
    case "peer":
      return "peers";
    case "prospect":
      return "prospects";
  }
}

export type Asap = "Governance" | "Platform" | "Asset" | "Service" | "Access";

/** Bottom → top. */
export const LAYERS: { id: Rl1Layer; asap: Asap; label: string; question: string; detail: string }[] = [
  {
    id: "governance", asap: "Governance", label: "Supervision & standards",
    question: "Who sets the rules and provides final settlement?",
    detail: "Central banks, supervisors, EU legislators and standard setters. Not a layer in the ASAP model itself: the frame the stack sits in.",
  },
  {
    id: "platform-ledger", asap: "Platform", label: "Ledger",
    question: "Which shared ledger records ownership?",
    detail: "RL1 at the centre; competing and comparable ledgers around it (CSD platforms, bank networks, public chains, central-bank designs).",
  },
  {
    id: "platform-nodes", asap: "Platform", label: "Node operations",
    question: "Who runs and validates the ledger?",
    detail: "The technical operator and validator nodes. Ghost nodes mark members that also validate.",
  },
  {
    id: "asset-cash", asap: "Asset", label: "Settlement assets",
    question: "What is the cash leg?",
    detail: "Central bank money via Pontes, bank stablecoins and e-money tokens, tokenised wholesale money.",
  },
  {
    id: "asset-securities", asap: "Asset", label: "Securities, issuers & registrars",
    question: "What gets tokenised, by whom, under which register?",
    detail: "Issuers of digital bonds and crypto securities, and the licensed registrars that keep the legal register.",
  },
  {
    id: "service-tech", asap: "Service", label: "Middleware & integration",
    question: "What connects a bank's systems to the ledger?",
    detail: "Middleware, orchestration, privacy layers and securities-finance software.",
  },
  {
    id: "service-dapps", asap: "Service", label: "On-chain applications (dApps)",
    question: "Which public-chain applications hold the liquidity RL1 is walled off from?",
    detail: "DeFi protocols, tokenised real-world-asset (RWA) platforms, bridges and oracles on public chains. None connects to RL1 today; they show the interoperability gap.",
  },
  {
    id: "service-market", asap: "Service", label: "Market services",
    question: "Who settles, trades and holds for others?",
    detail: "Settlement platforms, trading venues, custodians and trade-finance services.",
  },
  {
    id: "access-wallets", asap: "Access", label: "Wallets, keys & onboarding",
    question: "Whose software signs the transactions?",
    detail: "Wallet-as-a-service, MPC/HSM key management and onboarding products.",
  },
  {
    id: "access-participants", asap: "Access", label: "Participants",
    question: "Who owns, uses and could join the network?",
    detail: "Members in the inner ring; supporters and ecosystem participants in the middle; relevant institutions not in RL1 on the outside.",
  },
];

export const EDGE_KINDS: { id: EdgeKind; label: string }[] = [
  { id: "governance", label: "Membership" },
  { id: "ops", label: "Validation & ops" },
  { id: "ownership", label: "Ownership" },
  { id: "transaction", label: "Transactions" },
  { id: "cash", label: "Cash & settlement" },
  { id: "vendor", label: "Vendor / client" },
  { id: "regulation", label: "Regulation" },
  { id: "peer", label: "Competition" },
  { id: "potential", label: "Potential (unannounced)" },
];

/** Where the named infrastructure players sit relative to RL1. */
export type Position = {
  id: string;
  layer: string;
  sells: string;
  proof: string;
  link: string;
  linkLevel: 0 | 1 | 2 | 3;
  plugIn: string;
  tension: string;
};

export const positions: Position[] = [
  {
    id: "swiat",
    layer: "Operator · node operations",
    sells: "Network operation, SWIAT Access onboarding, crypto-securities registry, settlement engine",
    proof: "50+ deals, €700m+; BaFin register permission; Pontes-connected",
    link: "Built and operates RL1; validator; owned by 3 members",
    linkLevel: 3,
    plugIn: "Already inside: every member touches SWIAT software",
    tension: "Single-vendor dependency; conflicts with members who want to bring their own vendors",
  },
  {
    id: "dfns",
    layer: "Infrastructure · keys & wallets",
    sells: "Wallet-as-a-service, MPC/HSM key orchestration, policy engine",
    proof: "ABN AMRO, Fidelity, Zodia Custody, Banca Sella, FAB, Broadridge",
    link: "No announced link; already serves founding member ABN AMRO",
    linkLevel: 2,
    plugIn: "Signing and policy for members' RL1 addresses, if RL1's (undisclosed) chain stack is one Dfns supports",
    tension: "Competes with Fireblocks inside ABN AMRO and with in-house custody (DZ BANK)",
  },
  {
    id: "kaleido",
    layer: "Infrastructure · nodes, middleware, privacy",
    sells: "Managed nodes/networks, FireFly middleware, Paladin privacy, tokenisation, custody, Digital FMI",
    proof: "Citi, SWIFT, Clearstream/Deutsche Börse, BIS, HKMA, RBA, Bank Indonesia, BCB",
    link: "No announced link; powers competitor Clearstream",
    linkLevel: 1,
    plugIn: "Run a member's or newcomer's node and integration; supply the privacy layer RL1 hasn't disclosed; bridge to Canton/public chains",
    tension: "Overlaps SWIAT Access; Clearstream ties may look like a conflict to the cooperative",
  },
  {
    id: "anchorage",
    layer: "Market services · custody bank",
    sells: "OCC-chartered qualified custody, settlement, staking, stablecoin issuance",
    proof: "US institutions; Singapore entity",
    link: "None; no public EU licence found",
    linkLevel: 0,
    plugIn: "US investor custody and USD leg if RL1 opens to non-EU distribution",
    tension: "RL1 is EU-first by design; no legal wrapper for US investors yet",
  },
];

/** Broad institution type, used for distribution charts. */
const BUCKETS: Record<string, string[]> = {
  Bank: ["Universal bank", "Wholesale & custody bank", "Cooperative banking group", "Savings-bank central institution", "Cooperative central bank", "Landesbank", "Corporate & investment bank", "Custody bank", "Pfandbrief bank", "Savings bank", "Savings banks", "Private bank", "Cooperative bank", "Private & retail bank", "Retail bank", "State savings bank", "Savings-bank group", "Corporate bank"],
  "Development bank / public": ["Development bank", "Public financial institution", "Supranational issuer"],
  "Bank venture arm": ["Bank venture arm"],
  "Asset manager": ["Asset manager"],
  "Corporate issuer": ["Corporate issuer"],
  "Issuance & settlement service": ["Issuance platform", "Settlement platform (FMI)", "Tokenisation marketplace", "Trade-finance platform"],
  "Technology operator": ["Technology operator"],
  "IT services (validator)": ["IT services"],
  "Infrastructure & wallet tech": ["Blockchain infrastructure & middleware", "Custody technology (MPC)", "Securities-finance fintech", "Wallet-as-a-service / key management", "Custody & tokenisation tech", "Custody technology"],
  "Digital-asset custodian": ["Digital-asset custodian", "Federally chartered crypto bank", "Crypto custody & trading", "Digital-asset custody & trading"],
  "Stablecoin issuer": ["Bank euro stablecoin (EMI)", "Euro stablecoin (EMI)"],
  "Venue": ["DLT trading facility"],
  "Central bank / regulator": ["Central bank", "Central-bank settlement link", "Regulator", "Supranational", "Central bank / supervisor", "Central bank / regulator", "EU executive", "Standard setter"],
};
const bucketOf = Object.fromEntries(Object.entries(BUCKETS).flatMap(([b, types]) => types.map((t) => [t, b])));

export function typeBucket(type: string): string {
  return bucketOf[type] ?? "Network / FMI";
}
