import type { Topic } from "../types";

export const infrastructure: Topic[] = [
  {
    slug: "custody",
    title: "Custody & asset servicing",
    track: "infrastructure",
    level: "Beginner",
    minutes: 15,
    summary:
      "Who actually holds your securities: global custodians, sub-custodians, the holding chain, omnibus vs segregated accounts and asset servicing.",
    objectives: [
      "Trace the intermediated holding chain from investor to CSD",
      "Compare omnibus and segregated accounts",
      "List the services custodians provide beyond safekeeping",
    ],
    blocks: [
      { type: "h", text: "The holding chain" },
      {
        type: "p",
        text: "Investors rarely hold securities directly at a CSD. A pension fund holds with a **global custodian** (e.g. BNY), which holds through **sub-custodians** in each market (or directly as a CSD participant), which hold at the **CSD**. Each layer keeps its own books, and each layer must reconcile with the next.",
      },
      {
        type: "flow",
        title: "Intermediated securities",
        steps: [
          { label: "Investor", detail: "Pension fund, asset manager, insurer" },
          { label: "Global custodian", detail: "BNY, State Street, JPMorgan, Citi, BNP Paribas" },
          { label: "Sub-custodian", detail: "Local agent bank in each market" },
          { label: "CSD / ICSD", detail: "DTC, Euroclear, Clearstream, SIX SIS, JASDEC" },
          { label: "Issuer register", detail: "Legal record of ownership (often the CSD itself)" },
        ],
      },
      { type: "diagram", product: "custody-service" },
      { type: "h", text: "Omnibus vs segregated" },
      {
        type: "compare",
        left: {
          title: "Omnibus account",
          points: ["Many clients pooled in one account", "Cheaper, operationally simpler", "Relies on custodian's books to identify owners"],
        },
        right: {
          title: "Individually segregated (ISA)",
          points: ["One account per client at the CSD/CCP", "Stronger asset protection in insolvency", "More expensive; required by some regimes"],
        },
      },
      { type: "h", text: "Services beyond safekeeping" },
      {
        type: "list",
        items: [
          "**Settlement** of trades on behalf of clients",
          "**Income collection**: coupons, dividends, redemptions",
          "**Corporate actions**: splits, rights issues, tenders, proxy voting",
          "**Tax reclaim** and withholding tax relief",
          "**Fund administration**, NAV calculation, transfer agency, depositary services (UCITS/AIFMD)",
          "**Securities lending**, FX, collateral management and cash sweeps",
        ],
      },
      {
        type: "table",
        caption: "Largest custodians (approximate assets under custody/administration)",
        headers: ["Custodian", "HQ", "AUC/A", "Digital asset activity"],
        rows: [
          ["BNY", "New York", "~$50T+", "Digital asset custody platform since 2022; tokenized MMF with Goldman (2025)"],
          ["State Street", "Boston", "~$45T+", "Digital asset custody with Taurus technology"],
          ["JPMorgan", "New York", "~$35T+", "Kinexys: deposit tokens, TCN, intraday repo"],
          ["Citi", "New York", "~$25T+", "Citi Token Services; tokenized private-markets pilots"],
          ["BNP Paribas", "Paris", "~€13T+", "Neobonds; AssetFoundry tokenization platform"],
          ["Northern Trust", "Chicago", "~$15T+", "Matrix Zenith digital asset platform"],
        ],
      },
      {
        type: "callout",
        tone: "token",
        title: "Custody in a tokenized world",
        text: "When assets live on a blockchain, custody means **controlling private keys**. The custodian's job shifts from holding records to securing keys (HSM, MPC), whitelisting wallets, and running node infrastructure, while still servicing income, corporate actions and tax.",
      },
    ],
    bridge: {
      slug: "digital-asset-custody",
      text: "MPC wallets, qualified custodians and bank-grade key management: digital asset custody explained.",
    },
    players: ["bny", "statestreet", "jpmorgan", "citi", "bnpparibas", "northerntrust", "hsbc"],
    quiz: [
      {
        q: "Which account structure offers the strongest client asset protection?",
        options: ["Omnibus", "Individually segregated", "Nostro", "Suspense account"],
        answer: 1,
        explain: "Individual segregation makes client ownership identifiable at each level, which helps in insolvency.",
      },
      {
        q: "Handling a rights issue for clients is an example of:",
        options: ["Clearing", "Corporate actions servicing", "Execution", "Market making"],
        answer: 1,
        explain: "Corporate actions are a core custodian asset-servicing function.",
      },
    ],
  },
  {
    slug: "clearing-and-ccps",
    title: "Clearing & central counterparties",
    track: "infrastructure",
    level: "Intermediate",
    minutes: 17,
    summary:
      "How CCPs novate trades, net exposures, collect margin and survive member defaults with a default waterfall.",
    objectives: [
      "Explain novation and multilateral netting",
      "Distinguish initial and variation margin",
      "Walk through a CCP default waterfall",
    ],
    blocks: [
      { type: "h", text: "What clearing does" },
      {
        type: "p",
        text: "Clearing is everything between trade and settlement: confirming, calculating obligations and managing risk. A **central counterparty (CCP)** goes further: through **novation** it becomes buyer to every seller and seller to every buyer. Bilateral exposures become exposures to the CCP.",
      },
      {
        type: "compare",
        left: {
          title: "Bilateral (uncleared)",
          points: ["N×(N–1)/2 exposures in a network", "Each firm assesses every counterparty", "Default can cascade (Lehman 2008)"],
        },
        right: {
          title: "Centrally cleared",
          points: ["Each member faces only the CCP", "Multilateral netting shrinks settlement flows by ~95%+", "Standardised margin & default management"],
        },
      },
      { type: "diagram", product: "ccp-clearing" },
      { type: "h", text: "Margin" },
      {
        type: "list",
        items: [
          "**Variation margin (VM)**: daily (or intraday) settlement of mark-to-market gains and losses, in cash.",
          "**Initial margin (IM)**: collateral to cover potential future losses while the CCP closes out a defaulter (typically 99%+ confidence over 2-5 days).",
          "**Default fund**: mutualised contributions from all clearing members.",
        ],
      },
      { type: "widget", kind: "waterfall" },
      {
        type: "table",
        caption: "Major CCPs",
        headers: ["CCP", "Owner", "Key products"],
        rows: [
          ["NSCC / FICC", "DTCC", "US equities; US Treasuries & repo"],
          ["CME Clearing", "CME Group", "Futures, options, IRS"],
          ["OCC", "Industry-owned", "US listed options"],
          ["LCH Ltd / LCH SA", "LSEG", "SwapClear (IRS), RepoClear, CDSClear"],
          ["Eurex Clearing", "Deutsche Börse", "Futures, IRS, repo"],
          ["ICE Clear Europe / US / Credit", "ICE", "Energy, CDS, softs"],
          ["JSCC", "Japan Exchange Group", "Japanese equities, JGB, IRS"],
          ["SIX x-clear", "SIX", "Swiss and European equities"],
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Post-2008 mandates",
        text: "G20 leaders agreed in 2009 that standardised OTC derivatives should be centrally cleared. That led to Dodd-Frank Title VII (US), EMIR (EU), and later the SEC's Treasury clearing mandate. CCPs are now systemically critical and supervised under the PFMI and EU CCP recovery & resolution rules.",
      },
      {
        type: "callout",
        tone: "token",
        title: "Do we still need CCPs with atomic settlement?",
        text: "Atomic DvP removes **settlement** risk, but not **replacement-cost** risk between trade and settlement for forward-dated trades, nor the netting benefits. Real-time settlement also removes netting, so pre-funding everything increases liquidity needs. Expect CCPs to adapt (tokenized collateral for margin, 24/7 margin calls) rather than disappear.",
      },
    ],
    bridge: {
      slug: "atomic-settlement-and-dlt-fmi",
      text: "Atomic settlement trades netting efficiency for zero settlement risk. See the trade-offs.",
    },
    players: ["dtcc", "cme", "lch", "eurex", "ice", "jscc", "occ"],
    quiz: [
      {
        q: "Novation means:",
        options: [
          "The CCP becomes the counterparty to both sides of the trade",
          "Trades are cancelled",
          "The custodian takes ownership",
          "Settlement moves to T+0",
        ],
        answer: 0,
        explain: "The original bilateral contract is replaced by two contracts with the CCP.",
      },
      {
        q: "Which is used first when a clearing member defaults?",
        options: ["Other members' default fund", "The defaulter's initial margin", "CCP skin-in-the-game", "Government bailout"],
        answer: 1,
        explain: "Defaulter-pays: the defaulter's own margin and default fund contribution are used first.",
      },
      {
        q: "Variation margin covers:",
        options: ["Potential future exposure", "Realised daily mark-to-market moves", "Operational losses", "Legal fees"],
        answer: 1,
        explain: "VM settles actual price changes; IM covers potential future exposure.",
      },
    ],
    sources: [
      { label: "CPMI-IOSCO – Principles for FMIs", url: "https://www.bis.org/cpmi/info_pfmi.htm" },
    ],
  },
  {
    slug: "settlement-and-csds",
    title: "Settlement, CSDs & T+1",
    track: "infrastructure",
    level: "Intermediate",
    minutes: 17,
    summary:
      "How ownership actually transfers: CSDs, ICSDs, DvP models, settlement cycles, fails and the global move to T+1.",
    objectives: [
      "Explain the three core CSD functions",
      "Compare BIS DvP models 1, 2 and 3",
      "Summarise the T+1 migration timeline across regions",
    ],
    blocks: [
      { type: "h", text: "What a CSD does" },
      {
        type: "list",
        items: [
          "**Notary**: initial recording of securities in book-entry form (the issuance).",
          "**Central maintenance**: keeping top-tier securities accounts.",
          "**Settlement**: operating the securities settlement system (SSS), ideally with DvP.",
        ],
      },
      {
        type: "p",
        text: "National CSDs serve their domestic market (DTC in the US, Euroclear France, Clearstream Banking Frankfurt, SIX SIS, JASDEC). The two **ICSDs**, Euroclear Bank (Brussels) and Clearstream Banking (Luxembourg), settle eurobonds and cross-border trades and are connected by the 'Bridge'. In the euro area, **TARGET2-Securities (T2S)** is a single ECB-run settlement platform used by most CSDs, settling in central bank money.",
      },
      { type: "diagram", product: "csd-settlement" },
      { type: "h", text: "DvP models" },
      {
        type: "table",
        headers: ["Model", "Securities", "Cash", "Example"],
        rows: [
          ["DvP 1", "Gross, trade-by-trade", "Gross, trade-by-trade", "Fedwire Securities, T2S, atomic DLT settlement"],
          ["DvP 2", "Gross", "Net at end of cycle", "Some ICSD/CSD batch models"],
          ["DvP 3", "Net", "Net", "NSCC/DTC for US equities (CNS)"],
        ],
      },
      { type: "widget", kind: "settlement" },
      { type: "h", text: "The global race to T+1" },
      {
        type: "table",
        headers: ["Market", "Cycle", "Date"],
        rows: [
          ["India", "T+1 (optional T+0 since 2024)", "Phased 2021–Jan 2023"],
          ["US, Canada, Mexico", "T+1", "May 2024"],
          ["EU", "T+1 (planned)", "11 October 2027"],
          ["UK", "T+1 (planned)", "11 October 2027"],
          ["Switzerland & Liechtenstein", "T+1 (planned)", "11 October 2027 (aligned with EU)"],
          ["Japan, Hong Kong, Singapore, Australia", "T+2", "Under review"],
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "Settlement fails and CSDR",
        text: "When a seller cannot deliver, the trade fails. The EU's CSDR introduced cash penalties for fails in 2022 (mandatory buy-ins were postponed and then reformed). Sec lending is a key tool to avoid fails, which is why shorter cycles put pressure on recall and lending processes.",
      },
      { type: "h", text: "Finality" },
      {
        type: "p",
        text: "**Settlement finality** means a transfer is irrevocable and unconditional, even if a participant becomes insolvent. In the EU, the Settlement Finality Directive (SFD) gives designated systems this protection. It is a key legal question for DLT systems: when is an on-chain transfer legally final?",
      },
    ],
    bridge: {
      slug: "atomic-settlement-and-dlt-fmi",
      text: "T+0 and atomic settlement on DLT: SDX, 21X, DLT Pilot Regime and the ECB's Pontes.",
    },
    players: ["dtcc", "euroclear", "clearstream", "six", "jasdec", "ecb", "hkex"],
    quiz: [
      {
        q: "Which is an ICSD?",
        options: ["DTC", "Euroclear Bank", "JASDEC", "NSCC"],
        answer: 1,
        explain: "Euroclear Bank and Clearstream Banking Luxembourg are the two ICSDs.",
      },
      {
        q: "In DvP model 1, securities and cash settle:",
        options: ["Both net", "Both gross, trade-by-trade", "Securities net, cash gross", "Without linkage"],
        answer: 1,
        explain: "Model 1 is gross simultaneous settlement of both legs, like atomic on-chain DvP.",
      },
      {
        q: "When is the EU planned to move to T+1?",
        options: ["May 2024", "October 2027", "January 2026", "It already did in 2025"],
        answer: 1,
        explain: "EU, UK and Switzerland target 11 October 2027.",
      },
    ],
    sources: [
      { label: "ESMA – T+1 report", url: "https://www.esma.europa.eu/" },
      { label: "DTCC – T+1", url: "https://www.dtcc.com/ust1" },
    ],
  },
  {
    slug: "collateral-management",
    title: "Collateral management",
    track: "infrastructure",
    level: "Advanced",
    minutes: 15,
    summary:
      "Eligibility, haircuts, margin calls, tri-party, collateral optimisation and transformation: the machinery that keeps secured markets running.",
    objectives: [
      "Explain eligibility schedules, haircuts and concentration limits",
      "Describe tri-party collateral management and optimisation",
      "See why collateral mobility is the killer use case of tokenization",
    ],
    blocks: [
      { type: "h", text: "Collateral everywhere" },
      {
        type: "p",
        text: "Repo, sec lending, cleared and uncleared derivatives (UMR), central bank credit and payment systems all require collateral. Banks and funds must constantly source, move, value and substitute it. The global pool of collateral in use runs into the tens of trillions of dollars.",
      },
      {
        type: "list",
        items: [
          "**Eligibility**: which assets are accepted (e.g. G7 govvies, IG corporates, equities in main indices).",
          "**Haircuts**: risk-based discount by asset type, maturity, rating and currency mismatch.",
          "**Concentration limits**: max share of one issuer or asset class.",
          "**Wrong-way risk**: collateral that correlates with the giver's default (e.g. a bank's own bonds).",
        ],
      },
      { type: "diagram", product: "tri-party-repo" },
      { type: "h", text: "Tri-party collateral management" },
      {
        type: "p",
        text: "In tri-party, the collateral giver and receiver agree an eligibility schedule; the agent (Euroclear, Clearstream, BNY, JPMorgan) allocates, values, substitutes and re-allocates collateral automatically every day. Clearstream and Euroclear each manage well over €1 trillion of collateral outstanding.",
      },
      {
        type: "callout",
        tone: "info",
        title: "Collateral transformation",
        text: "A pension fund needs cash for CCP variation margin but holds only bonds. It repos the bonds to a bank for cash: that is collateral transformation. The UK LDI crisis in 2022 showed how fast VM calls can force fire sales when this chain is not ready.",
      },
      {
        type: "compare",
        left: {
          title: "Today: collateral is sticky",
          points: [
            "Held across CSDs, custodians, time zones",
            "Moves in settlement windows",
            "Trapped buffers in each location",
          ],
        },
        right: {
          title: "Tokenized: collateral is mobile",
          points: [
            "Ownership changes on a shared ledger, 24/7",
            "Pledge or transfer without moving underlying assets",
            "Smaller buffers, faster margin calls",
          ],
        },
      },
    ],
    bridge: {
      slug: "tokenized-repo-and-collateral",
      text: "JPMorgan TCN, HQLAx, Broadridge DLR and Clearstream/Euroclear DLT pilots are building collateral mobility.",
    },
    players: ["euroclear", "clearstream", "bny", "jpmorgan", "hqlax", "kinexys"],
    quiz: [
      {
        q: "A bank posting its own bonds as collateral creates:",
        options: ["Diversification", "Wrong-way risk", "Lower haircuts", "Settlement finality"],
        answer: 1,
        explain: "The collateral loses value exactly when the giver defaults.",
      },
      {
        q: "Collateral transformation typically means:",
        options: [
          "Converting non-cash collateral into cash (or HQLA) via repo or sec lending",
          "Changing a bond's ISIN",
          "Minting a stablecoin",
          "Cancelling margin",
        ],
        answer: 0,
        explain: "Upgrading collateral to meet margin requirements, usually via repo.",
      },
    ],
  },
];
