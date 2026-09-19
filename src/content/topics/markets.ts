import type { Topic } from "../types";

export const markets: Topic[] = [
  {
    slug: "equities-and-exchanges",
    title: "Equities & stock exchanges",
    track: "markets",
    level: "Beginner",
    minutes: 14,
    summary:
      "Shares, IPOs, order books, market makers, dark pools and the exchange–CCP–CSD chain behind every stock trade.",
    objectives: [
      "Explain what a share represents and how IPOs work",
      "Describe order books, market makers and fragmentation",
      "Follow an equity trade from exchange to CSD",
    ],
    blocks: [
      { type: "h", text: "A share is ownership" },
      {
        type: "p",
        text: "A share gives a residual claim on a company's profits and assets, plus voting rights. Unlike bonds there's no maturity and no promised payment: dividends are discretionary. Shares are issued in an **IPO** (or follow-on offering) and then trade on exchanges.",
      },
      { type: "diagram", product: "common-share" },
      { type: "h", text: "How trading works" },
      {
        type: "list",
        items: [
          "**Central limit order book**: buy and sell orders matched by price-time priority.",
          "**Market makers / designated liquidity providers** quote both sides.",
          "**Fragmentation**: in the US a stock trades across 16+ exchanges, ATSs and wholesalers; in Europe across regulated markets and MTFs (Cboe Europe, Aquis).",
          "**Dark pools**: venues without pre-trade transparency for large orders.",
          "**Auctions**: opening and closing auctions set official prices (index funds trade the close).",
        ],
      },
      {
        type: "table",
        caption: "Largest exchange groups",
        headers: ["Group", "Main venue(s)", "Post-trade"],
        rows: [
          ["ICE", "NYSE", "Uses DTCC (NSCC/DTC)"],
          ["Nasdaq", "Nasdaq, Nasdaq Nordic", "DTCC in US; Nasdaq Clearing in Nordics"],
          ["Euronext", "Paris, Amsterdam, Milan, Oslo and more", "Euronext Clearing, Euronext Securities"],
          ["LSEG", "London Stock Exchange", "LCH, Euroclear UK & International (CREST)"],
          ["Deutsche Börse", "Xetra, Eurex", "Eurex Clearing, Clearstream"],
          ["JPX", "Tokyo Stock Exchange", "JSCC, JASDEC"],
          ["SSE / SZSE", "Shanghai, Shenzhen", "ChinaClear"],
          ["NSE India", "NSE", "NSE Clearing, NSDL/CDSL"],
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Vertical vs horizontal",
        text: "Deutsche Börse, B3, ASX and JPX own their exchange, CCP and CSD (vertical silos). The US separates exchanges from the utility DTCC (horizontal). The debate over which model is better applies equally to future tokenized venues.",
      },
    ],
    bridge: { slug: "tokenized-equities-and-etfs", text: "Tokenized stocks: from crypto-exchange wrappers to SEC-registered on-chain shares." },
    players: ["nyse", "nasdaq", "euronext", "lseg", "deutscheboerse", "jpx", "sse", "nse", "morganstanley"],
    quiz: [
      {
        q: "Which equity market structure keeps the exchange separate from clearing and settlement utilities?",
        options: ["Vertical silo", "Horizontal (e.g. US with DTCC)", "Dark pool", "Auction"],
        answer: 1,
        explain: "US exchanges compete while clearing and settlement go through DTCC.",
      },
      {
        q: "Dividends on common shares are:",
        options: ["Contractually guaranteed", "Discretionary, decided by the board", "Paid by the CSD", "Fixed at issuance"],
        answer: 1,
        explain: "Equity has no promised payments, unlike bond coupons.",
      },
    ],
  },
  {
    slug: "funds-etfs-and-structures",
    title: "Funds, ETFs & fund structures",
    track: "markets",
    level: "Intermediate",
    minutes: 16,
    summary:
      "Mutual funds, UCITS, AIFs, 40 Act funds and ETFs: how pooled vehicles are built, who services them and how ETF creation/redemption works.",
    objectives: [
      "Compare open-ended, closed-ended, ETFs and private funds",
      "Explain the ETF creation/redemption mechanism",
      "Name the service providers around a fund",
    ],
    blocks: [
      { type: "h", text: "Pooled investing" },
      {
        type: "table",
        headers: ["Vehicle", "Liquidity", "Regime", "Example"],
        rows: [
          ["Open-ended mutual fund", "Daily at NAV", "US 1940 Act; EU UCITS", "Vanguard 500 Index Fund"],
          ["ETF", "Intraday on exchange; creation/redemption by APs", "1940 Act / UCITS", "SPY, iShares Core S&P 500"],
          ["Money market fund", "Daily, stable or variable NAV", "Rule 2a-7 / MMFR", "BlackRock, Fidelity MMFs"],
          ["Closed-ended / interval fund", "Exchange-traded or periodic redemptions", "1940 Act; AIFMD", "Investment trusts, BDCs"],
          ["Private fund (PE, credit, hedge)", "Lock-ups, capital calls", "AIFMD; US private placement", "KKR, Apollo, Blackstone funds"],
        ],
      },
      { type: "diagram", product: "etf" },
      { type: "h", text: "ETF creation & redemption" },
      {
        type: "p",
        text: "When ETF shares trade above the value of their holdings, **authorised participants (APs)** deliver the basket of securities to the fund and receive new ETF shares (creation), then sell them. When they trade below, APs do the reverse (redemption). This in-kind arbitrage keeps prices near NAV and makes US ETFs tax-efficient.",
      },
      { type: "h", text: "The fund's ecosystem" },
      {
        type: "list",
        items: [
          "**Management company / investment manager** runs the portfolio.",
          "**Depositary / custodian** (BNY, State Street, CACEIS) holds assets and oversees the fund (UCITS).",
          "**Fund administrator** calculates NAV and keeps the books.",
          "**Transfer agent** keeps the register of unitholders and processes subscriptions/redemptions.",
          "**Distributors & platforms** (Allfunds, Calastone, FNZ) connect investors.",
          "**Auditors, index providers (MSCI, S&P), regulators (SEC, CSSF, Central Bank of Ireland)**.",
        ],
      },
      {
        type: "stats",
        items: [
          { value: "~$70T+", label: "Global regulated open-ended fund assets", source: "ICI / EFAMA" },
          { value: "$14T+", label: "Global ETF assets (2025)", source: "ETFGI" },
          { value: "Luxembourg & Ireland", label: "Europe's largest cross-border fund domiciles", source: "EFAMA" },
        ],
      },
      {
        type: "callout",
        tone: "token",
        title: "Tokenization angle",
        text: "Funds are the fastest-growing tokenized asset: the **transfer agent's register moves on-chain**. That enables instant subscription/redemption with stablecoins, 24/7 transfers and use of fund units as collateral.",
      },
    ],
    bridge: { slug: "tokenized-money-market-funds", text: "Tokenized funds in practice: BUIDL, BENJI, FDIT." },
    players: ["vanguard", "blackrock", "amundi", "invesco", "dws", "cssf", "msci", "calastone"],
    quiz: [
      {
        q: "Who creates and redeems ETF shares in-kind?",
        options: ["Retail investors", "Authorised participants", "The CSD", "The index provider"],
        answer: 1,
        explain: "APs (large broker-dealers) exchange baskets for ETF shares and vice versa.",
      },
      {
        q: "Who keeps the register of a fund's unitholders?",
        options: ["The custodian", "The transfer agent", "The auditor", "The index provider"],
        answer: 1,
        explain: "Transfer agents maintain the shareholder register, the record tokenization moves on-chain.",
      },
    ],
  },
  {
    slug: "derivatives-101",
    title: "Derivatives 101",
    track: "markets",
    level: "Beginner",
    minutes: 15,
    summary:
      "Forwards, futures, options and swaps: contracts whose value derives from something else, used to hedge, speculate and transfer risk.",
    objectives: [
      "Define forwards, futures, options and swaps",
      "Compute a simple option payoff",
      "Explain why futures are exchange-traded and centrally cleared",
    ],
    blocks: [
      { type: "h", text: "Four building blocks" },
      {
        type: "table",
        headers: ["Instrument", "What it is", "Where it trades"],
        rows: [
          ["Forward", "Agreement to buy/sell at a fixed price on a future date", "OTC (e.g. FX forwards)"],
          ["Future", "Standardised forward with daily margining", "Exchanges (CME, Eurex, ICE) + CCP"],
          ["Option", "Right, not obligation, to buy (call) or sell (put) at a strike", "Exchanges (Cboe, Eurex) and OTC"],
          ["Swap", "Exchange of cash flows (fixed vs floating, currency, credit)", "OTC, mostly centrally cleared"],
        ],
      },
      { type: "diagram", product: "futures" },
      {
        type: "example",
        title: "Call option payoff",
        lines: [
          "Buy a 3-month call on a stock, strike $100, premium $5",
          "At expiry stock = $120 → payoff = 120 – 100 = $20; profit = 20 – 5 = $15",
          "At expiry stock = $90 → option expires worthless; loss = premium $5",
        ],
        result: "Max loss = premium; upside unlimited",
      },
      {
        type: "stats",
        items: [
          { value: "~$700T+", label: "OTC derivatives notional outstanding", source: "BIS OTC statistics" },
          { value: "~80%", label: "Share of OTC notional that is interest rate contracts", source: "BIS" },
          { value: "100bn+", label: "Exchange-traded contracts per year (mostly index options in India)", source: "FIA" },
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Notional ≠ risk",
        text: "Headline notional is huge, but gross market value is a few percent of it, and after netting and collateral actual exposure is far smaller. Always ask about **market value** and **net exposure**.",
      },
    ],
    bridge: { slug: "otc-derivatives-and-swaps", text: "Swaps, ISDA documentation and margin rules." },
    players: ["cme", "eurex", "ice", "cboe", "nse", "cftc", "fia"],
    quiz: [
      {
        q: "Main difference between a future and a forward?",
        options: ["Futures are standardised, exchange-traded and margined daily", "Forwards are always cash-settled", "Futures have no expiry", "Forwards trade on exchanges"],
        answer: 0,
        explain: "Standardisation plus CCP clearing and daily variation margin define futures.",
      },
      {
        q: "Maximum loss for an option buyer is:",
        options: ["Unlimited", "The premium paid", "The strike price", "Zero"],
        answer: 1,
        explain: "The buyer can simply let the option expire.",
      },
    ],
  },
  {
    slug: "otc-derivatives-and-swaps",
    title: "OTC derivatives, swaps & margin rules",
    track: "markets",
    level: "Advanced",
    minutes: 16,
    summary:
      "Interest rate swaps, CDS, the ISDA Master Agreement and CSA, the clearing mandate and uncleared margin rules (UMR).",
    objectives: [
      "Value the legs of a vanilla interest rate swap",
      "Explain the ISDA/CSA legal architecture",
      "Understand the clearing mandate and UMR",
    ],
    blocks: [
      { type: "h", text: "The interest rate swap" },
      {
        type: "p",
        text: "In a vanilla **IRS**, party A pays a fixed rate and receives a floating rate (e.g. SOFR compounded) on a notional amount; only net interest is exchanged, never the notional. Corporates use swaps to fix loan costs; banks and insurers hedge duration.",
      },
      { type: "diagram", product: "interest-rate-swap" },
      { type: "h", text: "Legal architecture" },
      {
        type: "list",
        items: [
          "**ISDA Master Agreement**: one umbrella contract per counterparty pair; close-out netting on default.",
          "**Schedule & confirmations**: trade-specific terms.",
          "**Credit Support Annex (CSA)**: collateral terms: eligible assets, thresholds, haircuts, VM/IM.",
          "**ISDA definitions** (2021 Interest Rate Definitions) and **CDM**, a machine-readable model of trade events used in DLT pilots.",
        ],
      },
      { type: "h", text: "Post-2008 reforms" },
      {
        type: "compare",
        left: {
          title: "Cleared swaps",
          points: ["Mandatory for standard IRS and index CDS", "Cleared at LCH SwapClear, CME, Eurex, JSCC", "Daily VM, IM at the CCP"],
        },
        right: {
          title: "Uncleared swaps (UMR)",
          points: ["Bilateral IM and VM phased in 2016–2022", "IM held at third-party custodians (segregated)", "SIMM model for IM calculation"],
        },
      },
      { type: "diagram", product: "credit-default-swap" },
      {
        type: "callout",
        tone: "token",
        title: "Tokenization angle",
        text: "Derivatives are collateral machines: every day trillions in VM and IM move. Tokenized MMF shares and bonds as margin (JPMorgan TCN's first trade was OTC derivatives collateral) and CDM-based smart contracts for lifecycle events are the main use cases.",
      },
    ],
    bridge: { slug: "tokenized-repo-and-collateral", text: "Tokenized collateral for margin: the biggest near-term use case." },
    players: ["isda", "lch", "cme", "eurex", "ice", "cftc", "murex"],
    quiz: [
      {
        q: "In a vanilla IRS, the notional is:",
        options: ["Exchanged at start and end", "Never exchanged, only used to compute interest", "Paid to the CCP", "Held in escrow"],
        answer: 1,
        explain: "Only net interest payments flow.",
      },
      {
        q: "Which document sets collateral terms between swap counterparties?",
        options: ["GMRA", "Credit Support Annex", "Prospectus", "GMSLA"],
        answer: 1,
        explain: "The CSA under the ISDA Master Agreement.",
      },
    ],
  },
  {
    slug: "fx-markets",
    title: "The FX market",
    track: "markets",
    level: "Beginner",
    minutes: 12,
    summary:
      "The world's largest market: spot, forwards, swaps, the dealer structure, settlement risk and CLS.",
    objectives: [
      "Read an FX quote and forward points",
      "Describe FX market structure and main centres",
      "Explain FX settlement risk and PvP",
    ],
    blocks: [
      { type: "h", text: "Structure" },
      {
        type: "p",
        text: "FX trades OTC around the clock, 24 hours a day on weekdays. London handles ~38% of turnover, New York ~19%, then Singapore, Hong Kong and Tokyo. The US dollar is on one side of ~88% of trades. Dealers (JPMorgan, UBS, Deutsche Bank, Citi, XTX and other non-bank market makers) stream prices to clients on platforms such as 360T, FXall and EBS.",
      },
      { type: "diagram", product: "fx-forward" },
      {
        type: "table",
        headers: ["Instrument", "Share of turnover (2022)"],
        rows: [
          ["FX swaps", "~51%"],
          ["Spot", "~28%"],
          ["Outright forwards", "~15%"],
          ["Options & currency swaps", "~6%"],
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "Settlement risk still large",
        text: "About a third of FX settlement obligations are still settled without payment-versus-payment protection, exposing banks to Herstatt risk, according to BIS estimates. Emerging-market currencies outside CLS are the main gap.",
      },
    ],
    bridge: { slug: "fx-swaps-and-dollar-funding", text: "FX swaps as a funding market, and where tokenized PvP fits." },
    players: ["cls", "jpmorgan", "ubs", "deutschebank", "citi", "lseg"],
    quiz: [
      {
        q: "What is the largest FX instrument by turnover?",
        options: ["Spot", "FX swaps", "Options", "Futures"],
        answer: 1,
        explain: "FX swaps are about half of daily turnover.",
      },
    ],
  },
];
