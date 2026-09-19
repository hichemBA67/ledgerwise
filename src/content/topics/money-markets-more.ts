import type { Topic } from "../types";

export const moneyMarketsMore: Topic[] = [
  {
    slug: "fx-swaps-and-dollar-funding",
    title: "FX swaps & global dollar funding",
    track: "money-markets",
    level: "Advanced",
    minutes: 15,
    summary:
      "How non-US banks and investors borrow dollars through FX swaps, why the cross-currency basis exists, and the 'missing' dollar debt off balance sheets.",
    objectives: [
      "Explain an FX swap as a collateralised loan in another currency",
      "Interpret the cross-currency basis",
      "Understand CLS settlement and central bank swap lines",
    ],
    blocks: [
      { type: "h", text: "An FX swap is a repo with currencies" },
      {
        type: "p",
        text: "A Japanese insurer holding yen wants to buy US Treasuries. It **swaps** yen for dollars today (spot leg) and agrees to swap them back at a fixed rate in three months (forward leg). Economically it has borrowed dollars and lent yen: each currency is the other's collateral.",
      },
      { type: "diagram", product: "fx-swap" },
      {
        type: "example",
        title: "Covered interest parity",
        lines: [
          "Spot EUR/USD = 1.1000; USD 3m rate 4.3%; EUR 3m rate 2.0%",
          "Forward = 1.1000 × (1 + 0.043 × 90/360) / (1 + 0.020 × 90/360)",
          "= 1.1000 × 1.01075 / 1.00500",
        ],
        result: "Forward ≈ 1.1063 (the rate differential is priced into forward points)",
      },
      { type: "h", text: "The cross-currency basis" },
      {
        type: "p",
        text: "In theory the forward rate removes any arbitrage (covered interest parity). Since 2008 it doesn't hold: borrowing dollars via FX swaps usually costs **more** than direct dollar rates, a negative **cross-currency basis**. Reasons: dollar demand from non-US institutions, bank balance sheet costs (leverage ratio, G-SIB scores at year-end) and limits on arbitrage.",
      },
      {
        type: "stats",
        items: [
          { value: "$7.5T", label: "Average daily FX turnover (April 2022)", source: "BIS Triennial Survey" },
          { value: "~$80T+", label: "Outstanding FX swaps/forwards: largely off-balance-sheet dollar debt", source: "BIS Quarterly Review" },
          { value: "~51%", label: "Share of FX turnover settled via CLS or PvP (est.)", source: "BIS" },
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Swap lines as the backstop",
        text: "When dollar funding froze in 2008 and March 2020, the Fed provided dollars to the ECB, BoJ, BoE, SNB and BoC through **central bank liquidity swap lines**, which they on-lent to their banks. The Fed also runs the FIMA repo facility for other central banks holding Treasuries.",
      },
      {
        type: "callout",
        tone: "token",
        title: "Tokenization angle",
        text: "Cross-currency PvP is a flagship use case for shared ledgers: Partior, BIS Project Agorá, mBridge and Fnality all target atomic payment-versus-payment across currencies, 24/7, which would remove Herstatt risk for the half of FX not settled in CLS.",
      },
    ],
    bridge: { slug: "stablecoins-and-tokenized-cash", text: "Multi-currency tokenized cash could make FX swaps atomic." },
    players: ["cls", "fed", "boj", "ecb", "jpmorgan", "partior"],
    quiz: [
      {
        q: "An FX swap is economically:",
        options: ["An equity trade", "A collateralised loan in one currency against another", "A CDS", "A bond issuance"],
        answer: 1,
        explain: "Each currency acts as collateral for the other, like a cross-currency repo.",
      },
      {
        q: "A negative USD cross-currency basis means:",
        options: [
          "Dollars are cheaper via FX swaps",
          "Borrowing dollars via FX swaps costs more than implied by interest rate differentials",
          "FX markets are closed",
          "Covered interest parity holds perfectly",
        ],
        answer: 1,
        explain: "Synthetic dollar funding carries a premium over the direct dollar rate.",
      },
    ],
    sources: [{ label: "BIS Triennial Central Bank Survey", url: "https://www.bis.org/statistics/rpfx22.htm" }],
  },
  {
    slug: "prime-brokerage-and-margin",
    title: "Prime brokerage & margin lending",
    track: "money-markets",
    level: "Intermediate",
    minutes: 13,
    summary:
      "How hedge funds get leverage, borrow stock and consolidate trades through prime brokers, and what the Archegos collapse taught the industry.",
    objectives: [
      "List prime brokerage services",
      "Explain margin lending and rehypothecation",
      "Describe the lessons of Archegos (2021)",
    ],
    blocks: [
      { type: "h", text: "The hedge fund's bank" },
      {
        type: "p",
        text: "A **prime broker** (Goldman Sachs, Morgan Stanley, JPMorgan, BofA and others) bundles everything a hedge fund needs: custody of assets, financing (margin loans), securities borrowing for shorts, trade clearing and settlement, capital introduction and reporting. In return it earns financing spreads and fees and gains a view of the fund's positions.",
      },
      { type: "diagram", product: "margin-loan" },
      {
        type: "list",
        items: [
          "**Margin lending**: the fund buys $100 of stock with $30 of equity and $70 borrowed from the prime broker.",
          "**Short financing**: the PB borrows stock (via sec lending) so the fund can sell short.",
          "**Rehypothecation**: the PB re-uses client collateral to fund itself (limited: 140% of the client's debit in the US under Rule 15c3-3; negotiated in the UK).",
          "**Synthetic prime**: exposure through total return swaps instead of cash positions.",
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "Archegos, March 2021",
        text: "Archegos Capital built huge concentrated positions through **total return swaps** at several prime brokers, none of whom saw the full picture. When the stocks fell, margin calls went unmet; banks lost over $10bn, including about $5.5bn at Credit Suisse. Lessons: concentration limits, better margin models, and disclosure of swap exposures.",
      },
      {
        type: "callout",
        tone: "token",
        title: "Tokenization angle",
        text: "On-chain collateral lets margin be called and moved 24/7, and crypto prime brokers already offer cross-margining. Real-time margin on tokenized collateral could have made Archegos-style exposures visible, but only if positions are shared across brokers.",
      },
    ],
    bridge: { slug: "tokenized-repo-and-collateral", text: "Programmable collateral and 24/7 margin calls." },
    players: ["goldman", "morganstanley", "jpmorgan", "bofa", "barclays"],
    quiz: [
      {
        q: "Rehypothecation means:",
        options: ["Issuing a new bond", "The broker re-using client collateral for its own funding", "Closing a short", "Settling at T+0"],
        answer: 1,
        explain: "Prime brokers can pledge client assets onwards, within legal limits.",
      },
      {
        q: "Archegos hid its exposure mainly through:",
        options: ["Bank deposits", "Total return swaps across multiple prime brokers", "Stablecoins", "Government bonds"],
        answer: 1,
        explain: "Synthetic positions at several banks meant nobody saw the full concentration.",
      },
    ],
  },
];
