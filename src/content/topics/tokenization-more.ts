import type { Topic } from "../types";

export const tokenizationMore: Topic[] = [
  {
    slug: "defi-and-institutional-defi",
    title: "DeFi & institutional DeFi",
    track: "tokenization",
    level: "Advanced",
    minutes: 16,
    summary:
      "Automated market makers, on-chain lending pools and stablecoin collateral, and how banks test permissioned DeFi under Project Guardian.",
    objectives: [
      "Explain AMMs and over-collateralised lending protocols",
      "Map DeFi functions to their TradFi equivalents",
      "Assess the risks and the permissioned-DeFi model",
    ],
    blocks: [
      { type: "h", text: "TradFi functions, rebuilt as code" },
      {
        type: "table",
        headers: ["Function", "TradFi", "DeFi"],
        rows: [
          ["Exchange", "Order book at an exchange or dealer", "Automated market maker (Uniswap): trade against a liquidity pool priced by a formula"],
          ["Secured lending", "Repo / margin lending", "Over-collateralised pools (Aave, Compound, Morpho) with automatic liquidation"],
          ["Money", "Deposits, MMFs", "Stablecoins; tokenized T-bill funds as yield-bearing collateral"],
          ["Clearing & settlement", "CCP + CSD, T+1", "Atomic in the same transaction; no netting"],
          ["Governance", "Board, regulator", "Token-holder votes, admin keys, timelocks"],
        ],
      },
      { type: "h", text: "How an AMM prices" },
      {
        type: "example",
        title: "Constant product (x · y = k)",
        lines: [
          "Pool: 1,000 ETH and 3,000,000 USDC → k = 3,000,000,000; price = 3,000",
          "Trader buys 10 ETH: new ETH = 990 → USDC must be 3,000,000,000 / 990 = 3,030,303",
          "Trader pays 30,303 USDC for 10 ETH = 3,030 per ETH (1% price impact, before fees)",
        ],
        result: "Liquidity providers earn fees but face impermanent loss",
      },
      { type: "diagram", product: "defi-lending-pool" },
      {
        type: "compare",
        left: {
          title: "Public DeFi",
          points: ["Anyone can use; pseudonymous", "Composable and transparent", "Smart contract exploits, oracle attacks, governance risk", "Unclear legal recourse"],
        },
        right: {
          title: "Institutional / permissioned DeFi",
          points: ["KYC'd participants only (allow-listed pools)", "Same code patterns, regulated entities", "Project Guardian: DBS, JPMorgan, SBI traded tokenized bonds & FX in a permissioned Aave-style pool (2022)", "Aave Horizon for tokenized RWAs"],
        },
      },
      {
        type: "callout",
        tone: "warn",
        title: "Risks in practice",
        text: "Billions have been lost to hacks and exploits (bridge hacks, oracle manipulation, re-entrancy bugs). Liquidation cascades can amplify price moves, like margin calls but automatic and instant.",
      },
    ],
    bridge: { slug: "prime-brokerage-and-margin", text: "The TradFi version of collateralised lending and liquidations." },
    players: ["aave", "uniswap", "chainlink", "mas", "dbs", "jpmorgan", "ethereum"],
    quiz: [
      {
        q: "In an AMM, the price is set by:",
        options: ["A market maker's quote", "A formula on the pool's reserves", "The central bank", "An auction"],
        answer: 1,
        explain: "E.g. x·y = k for constant-product pools.",
      },
      {
        q: "DeFi lending is typically:",
        options: ["Unsecured", "Over-collateralised with automatic liquidation", "Guaranteed by a CCP", "Only for banks"],
        answer: 1,
        explain: "Borrowers post more collateral than they borrow; positions are liquidated automatically.",
      },
    ],
  },
  {
    slug: "tokenized-equities-and-etfs",
    title: "Tokenized equities & ETFs",
    track: "tokenization",
    level: "Intermediate",
    minutes: 13,
    summary:
      "From offshore stock wrappers on crypto exchanges to SEC-registered on-chain shares and tokenized ETF share classes, and why investor rights matter.",
    objectives: [
      "Distinguish wrapped tokens, derivative tokens and native on-chain shares",
      "Describe the 2025 wave of tokenized stock offerings",
      "Assess investor protection questions",
    ],
    blocks: [
      { type: "h", text: "Three models" },
      {
        type: "table",
        headers: ["Model", "What you hold", "Examples"],
        rows: [
          ["Wrapped / tracker token", "A claim on an issuer (often an SPV) holding the share 1:1; no voting rights", "Backed xStocks on Solana/Kraken; Robinhood stock tokens in the EU (2025)"],
          ["Native tokenized share", "The actual share recorded on-chain by a registered transfer agent", "Superstate Opening Bell; issuers registering shares on-chain"],
          ["Tokenized fund / ETF share class", "Fund units recorded on-chain", "Franklin, WisdomTree, BlackRock share classes"],
        ],
      },
      { type: "diagram", product: "tokenized-stock" },
      {
        type: "callout",
        tone: "warn",
        title: "Not all 'stock tokens' are stocks",
        text: "Wrapped tokens may not carry voting rights or direct claims on the company, and some early products tracked private companies without their consent. Regulators (SEC, ESMA, IOSCO) have warned that investors may not get the rights they expect.",
      },
      {
        type: "list",
        items: [
          "**Benefits**: 24/7 trading, fractional shares, use as DeFi collateral, instant settlement.",
          "**Challenges**: best execution and NMS rules, corporate actions, market hours mismatch with the underlying, and fragmentation across chains.",
          "**Infrastructure moves**: Nasdaq's 2025 SEC filing to trade tokenized securities; DTCC tokenization initiatives.",
        ],
      },
    ],
    bridge: { slug: "equities-and-exchanges", text: "How stock markets work today." },
    players: ["backed", "nasdaq", "superstate", "coinbase", "securitize", "sec"],
    quiz: [
      {
        q: "A wrapped stock token typically gives you:",
        options: ["Direct voting rights", "A claim on an issuer holding the underlying share", "A central bank claim", "A bond"],
        answer: 1,
        explain: "You hold the issuer's token, which tracks the share it holds, often without voting.",
      },
    ],
  },
  {
    slug: "interoperability-and-bridges",
    title: "Interoperability, bridges & fragmentation",
    track: "tokenization",
    level: "Advanced",
    minutes: 14,
    summary:
      "Why many isolated ledgers are the biggest threat to tokenization's promise, and how bridges, Swift, Canton, unified ledgers and standards try to fix it.",
    objectives: [
      "Explain the fragmentation problem",
      "Compare bridge designs and their risks",
      "Know the institutional interoperability initiatives",
    ],
    blocks: [
      { type: "h", text: "The problem" },
      {
        type: "p",
        text: "Today's finance has one CSD per market and one RTGS per currency, linked by well-understood rules. Tokenization risks creating **dozens of islands**: a bond on Polygon, cash on a bank chain, collateral on Canton. Atomic DvP only works if asset and cash are on the same ledger or connected safely.",
      },
      {
        type: "table",
        headers: ["Approach", "How it works", "Risk / trade-off"],
        rows: [
          ["Lock-and-mint bridge", "Lock token on chain A, mint wrapped copy on chain B", "Bridge contract holds huge value → hack target (Ronin $600m+, Wormhole ~$320m in 2022)"],
          ["Burn-and-mint (native issuer)", "Issuer burns on A and mints on B (e.g. Circle CCTP)", "Relies on issuer; no wrapped IOUs"],
          ["Messaging protocols", "Cross-chain messages (Chainlink CCIP, LayerZero, Wormhole)", "Security of the messaging layer"],
          ["Interoperating permissioned networks", "Shared synchroniser across ledgers (Canton)", "Institutional, privacy-preserving; less open"],
          ["Unified ledger", "One programmable platform with CB money, deposits and assets (BIS Agorá)", "Governance and scope questions"],
          ["Legacy connectors", "Swift / existing FMIs orchestrate across chains", "Leverages existing trust; adds a hop"],
        ],
      },
      {
        type: "callout",
        tone: "token",
        title: "The emerging consensus",
        text: "Institutions are converging on a few 'hubs': regulated networks for cash (RTGS links, deposit token networks), a handful of public chains for distribution, and interoperability via Swift, CCIP and Canton, plus common data standards (ISIN/DTI, ICMA BDT, ISDA CDM).",
      },
    ],
    bridge: { slug: "messaging-and-standards", text: "Identifiers and data standards that make interoperability possible." },
    players: ["swift", "chainlink", "layerzero", "wormhole", "digitalasset", "circle", "bis"],
    quiz: [
      {
        q: "Why are lock-and-mint bridges risky?",
        options: ["They're slow", "The bridge contract holds large locked value and becomes a hack target", "They're illegal", "They need a CCP"],
        answer: 1,
        explain: "Several of the largest crypto hacks targeted bridges.",
      },
    ],
  },
];
