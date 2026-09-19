import type { Topic } from "../types";

export const moneyMarkets: Topic[] = [
  {
    slug: "money-markets",
    title: "Money markets 101",
    track: "money-markets",
    level: "Beginner",
    minutes: 10,
    summary:
      "Where institutions borrow and lend cash for a day to a year: T-bills, commercial paper, CDs, repo and the funds that invest in them.",
    objectives: [
      "Name the core money market instruments",
      "Explain secured vs unsecured funding",
      "Understand why money markets matter for financial stability",
    ],
    blocks: [
      { type: "h", text: "The short end" },
      {
        type: "p",
        text: "Money markets are wholesale markets for short-term funding, usually under one year. They let banks cover daily payment flows, dealers finance inventories, corporates park cash and central banks implement monetary policy.",
      },
      {
        type: "table",
        headers: ["Instrument", "Issuer / borrower", "Secured?", "Typical tenor"],
        rows: [
          ["Treasury bills", "Governments", "Sovereign credit", "4 weeks – 1 year"],
          ["Commercial paper (CP)", "Corporates, banks", "No", "1 – 270 days (US)"],
          ["Certificates of deposit (CD)", "Banks", "No", "1 month – 1 year"],
          ["Repo", "Dealers, banks, funds", "Yes (collateral)", "Overnight – 1 year"],
          ["Fed funds / interbank", "Banks", "No", "Overnight"],
        ],
      },
      { type: "h", text: "Secured vs unsecured" },
      {
        type: "p",
        text: "After 2008, wholesale funding shifted massively from **unsecured** (interbank lending) to **secured** (repo). Lenders want collateral. Regulation (LCR, leverage ratio) also shapes who lends to whom. Today repo is the dominant short-term funding market in the US and Europe.",
      },
      {
        type: "stats",
        items: [
          { value: "$7T+", label: "US money market fund assets (2025)", source: "ICI" },
          { value: "$2T+", label: "Daily SOFR-eligible repo volume", source: "NY Fed" },
          { value: "€10T+", label: "European repo market outstanding", source: "ICMA survey" },
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "Stress episodes",
        text: "Money markets are where stress shows first: the 2008 run on the Reserve Primary Fund, the September 2019 US repo spike (SOFR briefly above 5%), and the March 2020 'dash for cash'. Each led to reforms or new central bank facilities such as the Fed's Standing Repo Facility (2021).",
      },
    ],
    bridge: {
      slug: "tokenized-money-market-funds",
      text: "Tokenized MMFs and T-bill tokens bring money market yields onto public and private chains.",
    },
    players: ["fed", "ici", "blackrock", "jpmorgan"],
    quiz: [
      {
        q: "Which money market instrument is secured by collateral?",
        options: ["Commercial paper", "Certificate of deposit", "Repo", "Fed funds"],
        answer: 2,
        explain: "A repo is a collateralised loan: cash against securities.",
      },
      {
        q: "After 2008, wholesale funding moved mainly towards:",
        options: ["Unsecured interbank loans", "Secured repo funding", "Equity issuance", "Retail deposits only"],
        answer: 1,
        explain: "Counterparty concerns and regulation pushed funding to collateralised repo.",
      },
    ],
  },
  {
    slug: "repo",
    title: "Repo (repurchase agreements)",
    track: "money-markets",
    level: "Intermediate",
    minutes: 18,
    summary:
      "A sale and repurchase of securities that is economically a collateralised loan. The core of dealer funding, central bank operations and SOFR.",
    objectives: [
      "Compute the repurchase price, haircut and interest of a repo",
      "Distinguish bilateral, tri-party, cleared (FICC/LCH/Eurex) and GC vs special repo",
      "Explain the US Treasury clearing mandate and why intraday repo on DLT matters",
    ],
    blocks: [
      { type: "h", text: "The mechanics" },
      {
        type: "p",
        text: "In a repo, party A **sells** securities to party B and agrees to **buy them back** at a fixed later date and price. Economically A has borrowed cash against collateral. From B's side it is a **reverse repo**: lending cash, receiving collateral. Legal title passes to the cash lender (under the GMRA in Europe or the MRA in the US), which is what protects them if the borrower defaults.",
      },
      {
        type: "flow",
        title: "Life of a repo",
        steps: [
          { label: "Start leg (T)", detail: "Borrower delivers bonds; lender pays cash (bond value minus haircut)" },
          { label: "Term", detail: "Collateral is marked to market daily; margin calls if value moves" },
          { label: "Close leg", detail: "Borrower repays cash + repo interest; lender returns equivalent bonds" },
        ],
      },
      { type: "widget", kind: "repo" },
      { type: "h", text: "Key terms" },
      {
        type: "list",
        items: [
          "**Haircut**: the discount applied to collateral value. €100m of bonds with a 2% haircut funds €98m cash.",
          "**Repo rate**: the interest rate on the cash, usually quoted ACT/360.",
          "**General collateral (GC)**: any bond from an agreed basket; the lender cares about cash return.",
          "**Special**: a specific bond in high demand (e.g. to cover a short). The repo rate falls, sometimes below zero, because cash lenders are really borrowing that bond.",
          "**Tri-party**: a third-party agent (BNY in the US; Euroclear, Clearstream, JPMorgan in Europe) handles collateral selection, valuation and substitution.",
        ],
      },
      { type: "h", text: "Market structure" },
      {
        type: "table",
        headers: ["Segment", "How it works", "Main players"],
        rows: [
          ["Bilateral uncleared", "Direct agreement between two firms", "Dealers, hedge funds"],
          ["Tri-party", "Agent manages collateral; cash from MMFs, corporates", "BNY, Euroclear, Clearstream, JPMorgan"],
          ["Cleared (DvP / GC)", "CCP novates trades and nets them", "FICC (US), LCH RepoClear, Eurex Repo"],
          ["Sponsored repo", "Dealer sponsors clients (MMFs) into FICC", "FICC and sponsoring banks"],
          ["Central bank ops", "Open market operations, standing facilities", "Fed (SRF, ON RRP), ECB, BoE"],
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "US Treasury clearing mandate",
        text: "In December 2023 the SEC adopted rules requiring most cash Treasury and Treasury repo trades to be centrally cleared. After an extension, compliance is due by 31 December 2026 for eligible cash trades and 30 June 2027 for repo. Expect big growth in FICC and new CCP entrants (CME Securities Clearing, ICE Clear Credit).",
      },
      { type: "h", text: "Why tokenization loves repo" },
      {
        type: "p",
        text: "Traditional repo runs on settlement windows. Tokenized repo can be **intraday**, measured in hours or minutes, with atomic swaps of tokenized collateral against tokenized cash. That frees intraday liquidity and lets banks mobilise collateral that would otherwise be stuck.",
      },
      {
        type: "compare",
        left: {
          title: "Traditional repo",
          points: [
            "Overnight minimum, settled via CSD/tri-party",
            "Collateral movements in batches",
            "Separate records at each party and agent",
          ],
        },
        right: {
          title: "Tokenized repo",
          points: [
            "Intraday tenors (e.g. Kinexys intraday repo, Broadridge DLR)",
            "Atomic DvP of collateral token vs cash token",
            "Single shared ledger of ownership and obligations",
          ],
        },
      },
    ],
    bridge: {
      slug: "tokenized-repo-and-collateral",
      text: "Broadridge DLR, JPMorgan Kinexys and HQLAx already process tokenized repo and collateral at scale.",
    },
    players: ["bny", "fed", "dtcc", "lch", "eurex", "euroclear", "clearstream", "broadridge", "kinexys"],
    quiz: [
      {
        q: "Collateral worth $50m with a 4% haircut supports a cash loan of:",
        options: ["$50m", "$52m", "$48m", "$46m"],
        answer: 2,
        explain: "$50m × (1 – 0.04) = $48m.",
      },
      {
        q: "When a bond trades 'special' in repo, its repo rate typically:",
        options: ["Rises above GC", "Falls below GC", "Equals SOFR exactly", "Becomes fixed at zero"],
        answer: 1,
        explain: "High demand to borrow a specific bond means cash lenders accept a lower rate to get it.",
      },
      {
        q: "Who is the main US tri-party repo agent?",
        options: ["State Street", "BNY", "Citi", "DTCC"],
        answer: 1,
        explain: "BNY has been the sole US tri-party agent since JPMorgan exited in 2019.",
      },
      {
        q: "Which is a key benefit of tokenized repo?",
        options: ["Higher haircuts", "Intraday tenors with atomic DvP", "No collateral required", "No legal agreement needed"],
        answer: 1,
        explain: "Programmable settlement enables hours-long repos and atomic exchange of collateral and cash.",
      },
    ],
    sources: [
      { label: "ICMA – What is repo?", url: "https://www.icmagroup.org/market-practice-and-regulatory-policy/repo-and-collateral-markets/icma-ercc-publications/frequently-asked-questions-on-repo/" },
      { label: "OFR – U.S. Repo Markets Data", url: "https://www.financialresearch.gov/short-term-funding-monitor/" },
      { label: "SEC – Treasury clearing rule", url: "https://www.sec.gov/newsroom/press-releases/2023-247" },
    ],
  },
  {
    slug: "securities-lending",
    title: "Securities lending",
    track: "money-markets",
    level: "Intermediate",
    minutes: 16,
    summary:
      "Institutions lend securities to borrowers (usually dealers covering shorts or delivery needs) against collateral and earn a fee.",
    objectives: [
      "Explain why beneficial owners lend and why borrowers borrow",
      "Compare cash vs non-cash collateral and the rebate rate",
      "Name the agent lenders, legal agreements and reporting regimes",
    ],
    blocks: [
      { type: "h", text: "What happens" },
      {
        type: "p",
        text: "A **beneficial owner** (a pension fund, insurer, ETF or sovereign fund) lends securities, usually through an **agent lender**, to a **borrower** (a broker-dealer). The borrower posts collateral worth more than the loan (typically 102–105%) and pays a fee. Legal title transfers, but the lender keeps economic exposure: it receives **manufactured dividends** or coupons and can recall the securities.",
      },
      {
        type: "flow",
        title: "Loan lifecycle",
        steps: [
          { label: "Demand", detail: "Borrower needs stock to cover a short or avoid a settlement fail" },
          { label: "Loan", detail: "Agent lender allocates from its client pool" },
          { label: "Collateral", detail: "Borrower posts cash or securities (102–105%)" },
          { label: "Mark-to-market", detail: "Daily margining; manufactured income paid" },
          { label: "Return / recall", detail: "Securities returned; collateral released" },
        ],
      },
      { type: "widget", kind: "seclending" },
      { type: "h", text: "Cash vs non-cash collateral" },
      {
        type: "table",
        headers: ["", "Cash collateral (dominant in US)", "Non-cash collateral (dominant in Europe)"],
        rows: [
          ["How lender earns", "Reinvests cash; pays borrower a **rebate rate**", "Charges an explicit lending fee"],
          ["Key risk", "Reinvestment risk (AIG's 2008 losses)", "Collateral value and liquidity"],
          ["Typical collateral", "USD cash", "Govt bonds, equities (often via tri-party)"],
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "The AIG lesson",
        text: "In 2008 AIG's securities lending unit had reinvested cash collateral in mortgage-backed securities. When borrowers returned the securities and wanted their cash back, the collateral pool was illiquid and impaired: a key part of AIG's rescue.",
      },
      { type: "h", text: "Industry structure" },
      {
        type: "list",
        items: [
          "**Agent lenders**: BNY, State Street, JPMorgan, BlackRock, Northern Trust, Citi, eSecLending, Deutsche Bank.",
          "**Legal agreements**: GMSLA (ISLA, Europe/international), MSLA (US).",
          "**Data**: S&P Global (DataLend), EquiLend, Markit Securities Finance.",
          "**Reporting**: EU SFTR (since 2020); US SEC Rule 10c-1a loan-level reporting to FINRA (compliance phased in).",
          "**Market size**: roughly $35–45tn of lendable assets globally, with around $2.5–3tn on loan at any time.",
        ],
      },
      {
        type: "callout",
        tone: "token",
        title: "Tokenization angle",
        text: "Sec lending is collateral-heavy and reconciliation-heavy: an ideal fit for tokenized collateral and smart-contract margining. Collateral mobility networks (HQLAx, Kinexys, Canton-based pilots) and EquiLend's 1Source standardised data layer are early building blocks.",
      },
    ],
    bridge: {
      slug: "tokenized-repo-and-collateral",
      text: "Tokenized collateral networks move sec lending and repo collateral atomically.",
    },
    players: ["bny", "statestreet", "jpmorgan", "blackrock", "northerntrust", "equilend", "spglobal", "hqlax"],
    quiz: [
      {
        q: "In a US cash-collateralised loan, the lender earns by:",
        options: [
          "Charging a fixed fee only",
          "Reinvesting cash and paying the borrower a rebate below the reinvestment return",
          "Keeping the dividends",
          "Selling the securities",
        ],
        answer: 1,
        explain: "Lender income = reinvestment yield minus rebate paid to the borrower.",
      },
      {
        q: "During a loan, who receives dividends on the lent shares?",
        options: ["The borrower keeps them", "The lender, via manufactured dividends", "Nobody", "The CSD"],
        answer: 1,
        explain: "The borrower passes equivalent payments (manufactured income) back to the lender.",
      },
      {
        q: "Which EU regulation requires reporting of securities financing transactions?",
        options: ["MiFID II", "EMIR", "SFTR", "CSDR"],
        answer: 2,
        explain: "The Securities Financing Transactions Regulation covers repo, sec lending, buy/sell-backs and margin lending.",
      },
    ],
    sources: [
      { label: "ISLA – Securities lending market report", url: "https://www.islaemea.org/" },
      { label: "SEC Rule 10c-1a", url: "https://www.sec.gov/rules-regulations/2023/10/s7-18-21" },
    ],
  },
  {
    slug: "money-market-funds",
    title: "Money market funds (MMFs)",
    track: "money-markets",
    level: "Intermediate",
    minutes: 15,
    summary:
      "Funds that invest in short-term, high-quality debt and act as cash for institutions. The main buyers of T-bills and lenders in repo.",
    objectives: [
      "Distinguish government, prime and tax-exempt funds; CNAV, LVNAV and VNAV",
      "Explain 'breaking the buck' and the reforms that followed",
      "See why MMFs were the first fund type to be tokenized at scale",
    ],
    blocks: [
      { type: "h", text: "What MMFs are for" },
      {
        type: "p",
        text: "An MMF offers daily liquidity and a yield close to overnight rates with very low price volatility. Treasurers, asset managers and increasingly crypto-native firms use them as a cash management tool. US MMFs manage more than **$7 trillion**, and they are the largest cash lenders in the US tri-party and Fed ON RRP markets.",
      },
      {
        type: "table",
        caption: "Main regimes",
        headers: ["Regime", "Fund types", "Key rules"],
        rows: [
          ["US – SEC Rule 2a-7", "Government, Prime (retail / institutional), Tax-exempt", "Maturity/liquidity limits; 25% daily & 50% weekly liquid assets (2023 reform); mandatory liquidity fees for institutional prime"],
          ["EU – MMF Regulation (2017)", "Public debt CNAV, LVNAV, VNAV (short-term & standard)", "Liquidity buckets, KYC on investors, ban on sponsor support"],
          ["UK", "Onshored EU MMFR", "FCA consulted in 2023 on stronger liquidity rules"],
        ],
      },
      { type: "h", text: "Breaking the buck" },
      {
        type: "p",
        text: "Constant-NAV funds aim to hold a share price of $1.00. In September 2008 the Reserve Primary Fund held Lehman commercial paper, its NAV fell to $0.97, and it **broke the buck**, triggering a run on prime funds. The US Treasury temporarily guaranteed MMFs. Further stress in March 2020 led to the Fed's MMLF facility and the 2023 SEC reforms.",
      },
      { type: "widget", kind: "mmf" },
      { type: "h", text: "Why MMFs tokenized first" },
      {
        type: "list",
        items: [
          "Simple, transparent assets (T-bills, repo) and a stable NAV.",
          "Demand from on-chain users for a **yield-bearing cash equivalent** that is not a stablecoin.",
          "Usable as **collateral**: tokenized MMF shares can be posted as margin (e.g. BlackRock BUIDL accepted as collateral on crypto venues; JPMorgan TCN pledging BlackRock MMF shares to Barclays in 2023).",
          "Transfer agent records can be kept on-chain, cutting subscription/redemption friction.",
        ],
      },
      {
        type: "players",
        title: "Largest MMF managers",
        ids: ["jpmorgan", "blackrock", "fidelity", "vanguard", "goldman", "federated", "franklin"],
      },
    ],
    bridge: {
      slug: "tokenized-money-market-funds",
      text: "BUIDL, BENJI, Fidelity FDIT and others: how the MMF became the flagship tokenized asset.",
    },
    players: ["blackrock", "fidelity", "vanguard", "jpmorgan", "franklin", "federated", "ici"],
    quiz: [
      {
        q: "'Breaking the buck' means:",
        options: [
          "An MMF's NAV per share falls below $1.00",
          "A dollar devaluation",
          "An MMF exceeding $1bn",
          "A stablecoin depeg",
        ],
        answer: 0,
        explain: "Stable-NAV funds aim for $1.00; falling below it (Reserve Primary, 2008) is breaking the buck.",
      },
      {
        q: "Under the EU MMF Regulation, which is NOT a fund type?",
        options: ["LVNAV", "Public debt CNAV", "VNAV", "Prime institutional"],
        answer: 3,
        explain: "'Prime institutional' is a US category under Rule 2a-7.",
      },
      {
        q: "Why are tokenized MMF shares useful on-chain?",
        options: [
          "They are guaranteed by the Fed",
          "They are yield-bearing and can be posted as collateral",
          "They are not securities",
          "They never lose value",
        ],
        answer: 1,
        explain: "They combine cash-like stability and yield with on-chain transferability as collateral.",
      },
    ],
    sources: [
      { label: "ICI – Money market fund assets", url: "https://www.ici.org/research/stats/mmf" },
      { label: "SEC – 2023 MMF reforms", url: "https://www.sec.gov/newsroom/press-releases/2023-129" },
    ],
  },
];
