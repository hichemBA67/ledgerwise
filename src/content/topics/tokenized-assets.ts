import type { Topic } from "../types";

export const tokenizedAssets: Topic[] = [
  {
    slug: "tokenized-bonds",
    title: "Tokenized & digital bonds",
    track: "tokenization",
    level: "Intermediate",
    minutes: 18,
    summary:
      "From World Bank bond-i (2018) to EIB, Siemens, UBS and Hong Kong's multi-currency green bonds: how digital bonds are issued, settled and serviced.",
    objectives: [
      "Describe the digital bond issuance flow and the roles it merges",
      "Know the landmark issuances and platforms",
      "Assess where digital bonds deliver value today",
    ],
    blocks: [
      { type: "h", text: "Why bonds went first" },
      {
        type: "list",
        items: [
          "Standardised cash flows that are easy to code (coupons, redemption).",
          "Frequent, repeat issuers (SSAs, banks) willing to experiment with small deals.",
          "Heavy post-trade chain (agents, depositaries, ICSDs), so the savings potential is clear.",
          "Natural collateral for repo, which links to tokenized funding markets.",
        ],
      },
      { type: "h", text: "Issuance on DLT" },
      {
        type: "flow",
        steps: [
          { label: "Structure", detail: "Terms, legal framework (eWpG, DLT Act, English/Lux law)" },
          { label: "Mint", detail: "Registrar/platform mints bond tokens on the ledger" },
          { label: "Book & allocate", detail: "Bookrunners allocate to whitelisted investor wallets" },
          { label: "Atomic settlement", detail: "Tokens vs cash (wCBDC, tokenized deposit, stablecoin, or RTGS trigger)" },
          { label: "Lifecycle", detail: "Smart contract pays coupons and redeems at maturity" },
        ],
      },
      {
        type: "table",
        caption: "Landmark digital bond issuances",
        headers: ["Year", "Issuer", "Size", "Platform / notes"],
        rows: [
          ["2018", "World Bank bond-i", "A$110m", "Private Ethereum, arranged by Commonwealth Bank of Australia"],
          ["2019", "Société Générale SFH", "€100m covered bond", "Ethereum, SG-FORGE"],
          ["2021", "European Investment Bank", "€100m", "Ethereum; settlement with Banque de France experimental wCBDC; Goldman, SocGen, Santander"],
          ["2022", "UBS", "CHF 375m", "Dual-listed on SIX Swiss Exchange and SDX"],
          ["2022–23", "EIB (Project Venus / Sterling)", "€100m / £50m", "Goldman Sachs GS DAP; HSBC Orion"],
          ["2023", "Siemens", "€60m", "Polygon; eWpG crypto securities register, paid without stablecoins"],
          ["2023", "Hong Kong Government", "HK$800m green", "GS DAP, first tokenized government green bond"],
          ["2024", "Hong Kong Government", "~HK$6bn multi-currency green", "HSBC Orion; HKD, CNH, USD, EUR tranches"],
          ["2024", "Siemens", "€300m", "Settled in central bank money via Bundesbank trigger (ECB trials)"],
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "What issuers actually report",
        text: "Settlement in minutes instead of T+5, fewer intermediaries, real-time visibility of holders and automated coupon payments. The limits so far: small sizes, little secondary trading, and cash-leg workarounds.",
      },
      {
        type: "compare",
        left: {
          title: "Traditional eurobond",
          points: [
            "Global note at common safekeeper",
            "Issuing & paying agent, ICSDs, custodians",
            "T+5 closing, manual coupon processing",
          ],
        },
        right: {
          title: "Digital bond",
          points: [
            "Ledger is the register (native) or mirror",
            "Platform merges registrar, CSD-like and paying functions",
            "T+0 to T+1 closing; programmable coupons",
          ],
        },
      },
      {
        type: "players",
        title: "Issuers & platforms",
        ids: ["eib", "worldbank", "siemens", "ubs", "hkma", "hsbc", "goldman", "sgforge", "sdx", "clearstream"],
      },
    ],
    bridge: {
      slug: "bonds-basics",
      text: "Refresh bond anatomy: the same cash flows, now in a smart contract.",
    },
    players: ["eib", "worldbank", "siemens", "ubs", "hsbc", "goldman", "sgforge", "sdx"],
    quiz: [
      {
        q: "Which was the first blockchain bond issued by the World Bank?",
        options: ["Project Venus", "bond-i", "Neobond", "Helvetia"],
        answer: 1,
        explain: "bond-i (2018, A$110m) was arranged by Commonwealth Bank of Australia.",
      },
      {
        q: "How was the Siemens €300m digital bond (2024) settled?",
        options: ["In USDC", "In central bank money via the Bundesbank trigger solution", "In Bitcoin", "Through DTC"],
        answer: 1,
        explain: "It was part of the Eurosystem's 2024 DLT settlement trials.",
      },
      {
        q: "A current limitation of most digital bonds is:",
        options: ["Settlement is slower", "Limited secondary market liquidity", "They can't pay coupons", "They are not legally valid anywhere"],
        answer: 1,
        explain: "Sizes are small and trading venues/investors are still limited.",
      },
    ],
  },
  {
    slug: "tokenized-money-market-funds",
    title: "Tokenized MMFs & Treasury funds",
    track: "tokenization",
    level: "Intermediate",
    minutes: 16,
    summary:
      "BENJI, BUIDL, FDIT, uMINT, USYC, OUSG: the fastest-growing tokenized asset class and why it's becoming on-chain collateral.",
    objectives: [
      "Explain how a tokenized MMF share is issued and redeemed",
      "Compare the main products and chains",
      "Understand their use as collateral and stablecoin reserves",
    ],
    blocks: [
      { type: "h", text: "How it works" },
      {
        type: "p",
        text: "The fund itself is a normal regulated fund (a 1940 Act MMF, a BVI or Luxembourg fund, or a Singapore VCC) investing in T-bills and repo. What changes is the **share register**: the transfer agent records ownership on a blockchain, and shares exist as tokens in investors' whitelisted wallets. Income is often paid as new tokens daily.",
      },
      {
        type: "table",
        caption: "Notable tokenized fund products",
        headers: ["Product", "Manager", "Launched", "Notes"],
        rows: [
          ["FOBXX / BENJI", "Franklin Templeton", "2021", "First US-registered fund with on-chain share register (Stellar, later Polygon, Arbitrum, Base and more)"],
          ["BUIDL", "BlackRock (with Securitize)", "Mar 2024", "Ethereum then multi-chain; largest tokenized Treasury fund in 2025; accepted as exchange collateral"],
          ["uMINT", "UBS Asset Management", "2024", "USD money market investment fund token on Ethereum"],
          ["WTGXX", "WisdomTree", "2023", "Government MMF digital fund"],
          ["FDIT (OnChain share class)", "Fidelity", "2025", "Treasury digital fund share class on Ethereum"],
          ["OUSG / USDY", "Ondo Finance", "2023", "Tokenized Treasury exposure; OUSG invests largely in BUIDL"],
          ["USYC", "Circle (ex-Hashnote)", "2023", "Tokenized yield fund used as collateral by crypto venues"],
          ["Tokenized MMF shares", "BNY + Goldman Sachs", "2025", "BNY LiquidityDirect clients' MMF holdings mirrored on GS DAP"],
        ],
      },
      {
        type: "stats",
        items: [
          { value: "$7B+", label: "Tokenized US Treasuries on public chains (mid-2025)", source: "rwa.xyz" },
          { value: "~$2.9B", label: "BUIDL peak AUM (2025)", source: "rwa.xyz" },
        ],
      },
      { type: "h", text: "Why they matter" },
      {
        type: "list",
        items: [
          "**Yield-bearing collateral**: posted as margin at crypto venues and in bank pilots, like JPMorgan TCN, where BlackRock MMF shares were pledged to Barclays in 2023.",
          "**Stablecoin reserves**: stablecoin and DeFi protocols hold tokenized T-bill funds as reserves.",
          "**24/7 subscriptions/redemptions**: some funds offer instant redemption into USDC via smart contracts.",
          "**Distribution**: new investor channels (crypto funds, fintechs, treasuries of on-chain firms).",
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "Watch-outs",
        text: "Eligibility (often qualified purchasers only), regulatory status of on-chain transfers, NAV oracle integrity, run dynamics if used as collateral, and the fact that the underlying fund still settles through traditional rails.",
      },
    ],
    bridge: {
      slug: "money-market-funds",
      text: "Refresh the MMF rules (Rule 2a-7, EU MMFR) that still apply to the tokenized versions.",
    },
    players: ["franklin", "blackrock", "securitize", "fidelity", "ubs", "wisdomtree", "ondo", "circle", "bny", "goldman"],
    quiz: [
      {
        q: "What is tokenized in a tokenized MMF like BENJI?",
        options: ["The T-bills directly", "The fund's share register", "The Fed's reserves", "The NAV oracle only"],
        answer: 1,
        explain: "The fund is conventional; its share ownership record lives on-chain.",
      },
      {
        q: "Which firm acts as tokenization and transfer agent for BlackRock BUIDL?",
        options: ["Ondo", "Securitize", "Circle", "Coinbase"],
        answer: 1,
        explain: "Securitize is the tokenization platform and transfer agent for BUIDL.",
      },
      {
        q: "A key use of tokenized MMF shares is:",
        options: ["Retail lottery", "Yield-bearing collateral", "Mining rewards", "Replacing CCPs"],
        answer: 1,
        explain: "They are increasingly posted as margin/collateral while still earning yield.",
      },
    ],
    sources: [{ label: "rwa.xyz – Tokenized Treasuries", url: "https://app.rwa.xyz/treasuries" }],
  },
  {
    slug: "tokenized-repo-and-collateral",
    title: "Tokenized repo & collateral mobility",
    track: "tokenization",
    level: "Advanced",
    minutes: 17,
    summary:
      "The largest real volumes in institutional DLT: intraday repo on Kinexys and Broadridge DLR, collateral swaps on HQLAx and tokenized collateral networks.",
    objectives: [
      "Explain intraday repo and why it needs programmable settlement",
      "Describe how DLR, Kinexys and HQLAx work",
      "Evaluate the collateral mobility business case",
    ],
    blocks: [
      { type: "h", text: "The problem" },
      {
        type: "p",
        text: "Banks need large intraday liquidity to make payments, and they hold large portfolios of HQLA that can't move fast enough to generate it. Traditional repo settles in windows and is overnight at minimum. Tokenized repo lets a bank borrow cash **for two hours** against Treasuries and unwind automatically.",
      },
      {
        type: "flow",
        title: "Intraday repo on a shared ledger",
        steps: [
          { label: "Agree", detail: "Bank A borrows $500m from Bank B 10:00–14:00 at an agreed rate" },
          { label: "Tokenize", detail: "A's Treasuries (held at custodian) are encumbered and represented on the ledger" },
          { label: "Atomic start", detail: "Collateral token → B; deposit token/cash → A, simultaneously" },
          { label: "Auto-unwind", detail: "At 14:00 the contract returns cash + interest and releases collateral" },
        ],
      },
      { type: "widget", kind: "repo" },
      {
        type: "table",
        headers: ["Platform", "Operator", "What it does"],
        rows: [
          ["Kinexys Digital Assets (ex-Onyx)", "JPMorgan", "Intraday repo since 2020, well over $1.5 trillion processed; Tokenized Collateral Network (TCN)"],
          ["Distributed Ledger Repo (DLR)", "Broadridge", "Tokenizes repo obligations and collateral; trillions of dollars a month by 2025; users include SocGen, UBS, Tradeweb flows"],
          ["HQLAx", "HQLAx (with Deutsche Börse)", "DLT ownership registry for collateral swaps across custodians without moving securities"],
          ["Canton Network pilots", "Digital Asset, Goldman, DTCC, BNP & others", "Tokenized Treasuries and collateral mobility trials"],
          ["Euroclear / Clearstream DLT", "ICSDs", "Tokenized collateral and digital securities on D-FMI / D7"],
        ],
      },
      {
        type: "callout",
        tone: "token",
        title: "Collateral mobility is the killer app",
        text: "Unlike tokenized bonds, repo platforms already run at trillion-dollar scale because they solve a painful, daily problem: moving collateral between entities and time zones in minutes rather than days. The EU, UK and US tokenized collateral initiatives (e.g. CFTC discussions on tokenized MMF shares as margin) all build on this.",
      },
      {
        type: "list",
        items: [
          "**Benefits**: intraday liquidity, lower buffers, fewer fails, precise interest calculations.",
          "**Remaining hurdles**: legal enforceability of ledger-based pledges, CCP acceptance of tokenized collateral, interoperability with tri-party agents and RTGS cash.",
        ],
      },
    ],
    bridge: {
      slug: "repo",
      text: "Refresh traditional repo mechanics: haircuts, GC vs special, tri-party and cleared repo.",
    },
    players: ["kinexys", "jpmorgan", "broadridge", "hqlax", "deutscheboerse", "digitalasset", "euroclear", "clearstream"],
    quiz: [
      {
        q: "What does intraday repo make possible?",
        options: [
          "Borrowing for a few hours against collateral",
          "Borrowing without collateral",
          "Longer settlement windows",
          "Issuing new bonds",
        ],
        answer: 0,
        explain: "Programmable settlement allows tenors of hours instead of overnight minimum.",
      },
      {
        q: "HQLAx's main innovation is:",
        options: [
          "A stablecoin",
          "Swapping collateral ownership on a DLT registry without moving securities between custodians",
          "An exchange for equities",
          "A CBDC",
        ],
        answer: 1,
        explain: "Ownership changes on the ledger while securities stay put at their custodians.",
      },
    ],
  },
  {
    slug: "tokenized-private-credit-and-rwa",
    title: "Private credit, funds & other RWAs",
    track: "tokenization",
    level: "Intermediate",
    minutes: 13,
    summary:
      "Tokenized private credit, private equity funds, real estate and commodities: the long tail of real-world assets (RWA).",
    objectives: [
      "Size the RWA market by asset class",
      "Give examples of tokenized private funds",
      "Identify the specific risks of illiquid tokenized assets",
    ],
    blocks: [
      { type: "h", text: "The RWA landscape" },
      {
        type: "table",
        headers: ["Asset class", "Examples", "Notes"],
        rows: [
          ["Private credit", "Figure (Provenance), Centrifuge, Maple, Apollo ACRED (Securitize)", "Largest RWA segment by value on public chain trackers"],
          ["Treasuries & MMFs", "BUIDL, BENJI, OUSG, USYC", "Most liquid, used as collateral"],
          ["Private equity / funds", "KKR (Avalanche), Hamilton Lane, Apollo via Securitize; ADDX", "Feeder funds with lower minimums"],
          ["Commodities", "PAX Gold (PAXG), Tether Gold (XAUT)", "Gold tokens backed by allocated bars"],
          ["Real estate", "Japan security tokens (Progmat, ODX), RealT", "Popular in Japan's ST market"],
          ["Equities", "Tokenized stock offerings (2025) by crypto exchanges and brokers", "Regulatory status varies widely"],
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "Liquidity mismatch",
        text: "Tokenizing an illiquid loan doesn't make the loan liquid. If a token trades 24/7 but the underlying redeems quarterly, stress can create large discounts. Look for clear redemption terms, independent valuation and bankruptcy-remote structures.",
      },
      {
        type: "players",
        title: "Platforms",
        ids: ["securitize", "figure", "centrifuge", "ondo", "kkr", "apollo", "progmat", "addx"],
      },
    ],
    bridge: {
      slug: "credit-and-ratings",
      text: "Credit analysis still applies: spreads, ratings and default risk.",
    },
    players: ["securitize", "figure", "centrifuge", "kkr", "apollo", "progmat"],
    quiz: [
      {
        q: "The main risk when tokenizing an illiquid loan fund is:",
        options: ["Too much liquidity", "Liquidity mismatch between token and underlying", "No yield", "Excessive transparency"],
        answer: 1,
        explain: "24/7 tradable tokens on quarterly-redeeming assets can dislocate under stress.",
      },
    ],
  },
];
