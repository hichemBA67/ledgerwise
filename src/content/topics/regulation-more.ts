import type { Topic } from "../types";

export const regulationMore: Topic[] = [
  {
    slug: "prudential-regulation-basel",
    title: "Basel III: capital, liquidity & leverage",
    track: "regulation",
    level: "Advanced",
    minutes: 15,
    summary:
      "Risk-weighted assets, CET1, the leverage ratio, LCR and NSFR, and how each shapes repo, sec lending, custody and tokenized exposures.",
    objectives: [
      "Compute a simple capital ratio",
      "Explain why the leverage ratio affects repo",
      "Know how the Basel crypto standard treats tokenized assets",
    ],
    blocks: [
      { type: "h", text: "The pillars" },
      {
        type: "table",
        headers: ["Rule", "Formula", "Minimum"],
        rows: [
          ["CET1 ratio", "Common equity / risk-weighted assets", "4.5% + buffers (≈ 7–13% in practice)"],
          ["Leverage ratio", "Tier 1 capital / total exposure (not risk-weighted)", "3% (+ G-SIB buffer; US eSLR)"],
          ["LCR", "HQLA / 30-day stressed net outflows", "≥ 100%"],
          ["NSFR", "Available stable funding / required stable funding", "≥ 100%"],
        ],
      },
      {
        type: "example",
        title: "Risk weights at work",
        lines: [
          "€100m Bund (0% RW) → RWA €0",
          "€100m corporate loan, BBB (≈100% RW) → RWA €100m",
          "€100m reverse repo vs government bonds → small RWA, but full leverage exposure",
        ],
        result: "Low-risk repo is cheap under risk weights but expensive under the leverage ratio",
      },
      {
        type: "callout",
        tone: "info",
        title: "Quarter-end window dressing",
        text: "Non-US banks report leverage at quarter-end snapshots, so they shrink repo books on those dates: repo rates spike and MMFs park cash at the Fed's ON RRP. G-SIB scores make year-end even tighter.",
      },
      {
        type: "list",
        items: [
          "**Basel III 'endgame' / CRR3 / Basel 3.1**: final revisions (output floor, new market risk rules) phased in 2025+ at different speeds in the EU, UK and US.",
          "**Crypto standard**: Group 1a tokenized traditional assets treated like the underlying; Group 1b qualifying stablecoins; Group 2 unbacked crypto up to 1250% RW; permissionless-chain treatment under review.",
          "**Custody and client assets**: operational risk capital, and SAB 121/122 accounting in the US.",
        ],
      },
    ],
    bridge: { slug: "tokenization-regulation", text: "How regulators treat tokenized assets and stablecoins." },
    players: ["bis", "fed", "ecb", "eba", "occ-regulator", "fdic"],
    quiz: [
      {
        q: "Why is the leverage ratio a constraint on repo?",
        options: ["Repo has high risk weights", "It counts total exposure regardless of risk, and repo is balance-sheet heavy", "It bans repo", "It only applies to insurers"],
        answer: 1,
        explain: "Low-risk, high-volume activities consume leverage capacity.",
      },
    ],
  },
  {
    slug: "aml-kyc-and-sanctions",
    title: "AML, KYC & sanctions, on and off chain",
    track: "regulation",
    level: "Intermediate",
    minutes: 12,
    summary:
      "Customer due diligence, transaction monitoring, the FATF travel rule, sanctions screening, and how blockchain analytics and permissioned tokens enforce them.",
    objectives: [
      "Explain KYC, CDD and transaction monitoring",
      "Describe the FATF travel rule for crypto transfers",
      "See how token standards embed compliance",
    ],
    blocks: [
      { type: "h", text: "The basics" },
      {
        type: "list",
        items: [
          "**KYC / CDD**: identify customers and beneficial owners; enhanced due diligence for high-risk clients and PEPs.",
          "**Transaction monitoring**: detect suspicious patterns; file SARs/STRs.",
          "**Sanctions screening**: OFAC (US), EU and UK lists; blocking and reporting.",
          "**FATF** sets global standards; Recommendation 16 is the **travel rule** (originator/beneficiary info must travel with transfers), extended to virtual asset service providers.",
        ],
      },
      {
        type: "compare",
        left: {
          title: "Traditional rails",
          points: ["Identity known at each bank in the chain", "Screening per message (Swift)", "Opaque across borders"],
        },
        right: {
          title: "On-chain",
          points: ["Pseudonymous addresses; full public history", "Blockchain analytics (Chainalysis, Elliptic) trace flows", "Allow-listed tokens (ERC-3643) block transfers to unverified wallets", "Issuers can freeze addresses (USDC, USDT)"],
        },
      },
      {
        type: "callout",
        tone: "warn",
        title: "Tornado Cash & mixers",
        text: "OFAC sanctioned the Tornado Cash mixer in 2022 (later delisted in 2025 after court challenges), showing how sanctions law collides with immutable code. Stablecoin issuers regularly freeze addresses tied to sanctions and hacks.",
      },
    ],
    bridge: { slug: "blockchain-for-finance", text: "Permissioned token standards with built-in compliance." },
    players: ["chainalysis", "elliptic", "circle", "tether", "tokeny"],
    quiz: [
      {
        q: "The FATF travel rule requires:",
        options: ["Settlement in T+1", "Originator and beneficiary information to accompany transfers", "Stablecoins to pay interest", "Travel insurance"],
        answer: 1,
        explain: "It applies to banks and, since 2019, to VASPs.",
      },
    ],
  },
  {
    slug: "global-financial-centres",
    title: "Global financial centres & market structure",
    track: "regulation",
    level: "Beginner",
    minutes: 14,
    summary:
      "New York, London, Hong Kong, Singapore, Tokyo, Frankfurt, Zurich, Dubai and beyond: what each centre specialises in and how they compete on tokenization.",
    objectives: [
      "Know the specialisations of the main financial centres",
      "Understand the offshore dollar and euro markets",
      "Compare tokenization strategies by centre",
    ],
    blocks: [
      { type: "h", text: "Who does what" },
      {
        type: "table",
        headers: ["Centre", "Strengths", "Tokenization stance"],
        rows: [
          ["New York", "Deepest capital markets, USD funding, Treasuries, asset management", "Scale players (BlackRock, JPMorgan, DTCC); federal stablecoin law"],
          ["London", "FX (~38% of global), OTC derivatives, eurobonds, insurance", "Digital Securities Sandbox; digital gilt; Fnality"],
          ["Frankfurt / Paris / Luxembourg / Dublin", "Euro markets, ECB, funds (Lux/Dublin), CSDs/ICSDs", "MiCA, DLT Pilot, ECB Pontes, eWpG"],
          ["Zurich / Geneva", "Private banking, wealth, SIX", "DLT Act, SDX, Helvetia wCBDC"],
          ["Singapore", "FX hub for Asia, wealth, commodities", "Project Guardian, GL1, clear stablecoin rules"],
          ["Hong Kong", "China gateway (Stock Connect, Bond Connect), IPOs", "Tokenized green bonds, Ensemble, stablecoin law"],
          ["Tokyo", "JGBs, large pools of savings", "Security tokens, bank stablecoins"],
          ["Dubai / Abu Dhabi", "Regional hub, sovereign wealth", "VARA, ADGM, real estate tokenization"],
          ["Shanghai / Mumbai / São Paulo", "Large domestic markets", "e-CNY, e₹, Drex, Pix/UPI payments innovation"],
        ],
      },
      {
        type: "p",
        text: "Much of global finance happens **offshore**: eurodollars (USD deposits outside the US), eurobonds settled in Brussels and Luxembourg, and FX swaps booked in London. That's why cross-border infrastructure (ICSDs, CLS, Swift, correspondent banks) is so central, and why tokenized cross-border settlement is attractive.",
      },
      {
        type: "callout",
        tone: "info",
        title: "Explore visually",
        text: "See every institution on the [interactive globe](/globe) and compare regimes on the [Global comparison](/compare) page.",
      },
    ],
    bridge: { slug: "tokenization-regulation", text: "The rulebooks behind each centre's tokenization strategy." },
    players: ["nyse", "lseg", "hkex", "sgx", "six", "euroclear", "adgm", "b3", "nbim", "gic"],
    quiz: [
      {
        q: "Which centre handles the largest share of global FX trading?",
        options: ["New York", "London", "Singapore", "Tokyo"],
        answer: 1,
        explain: "London accounts for roughly 38% of global FX turnover.",
      },
    ],
  },
];
