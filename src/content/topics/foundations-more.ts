import type { Topic } from "../types";

export const foundationsMore: Topic[] = [
  {
    slug: "the-finance-stack",
    title: "The finance stack: a mental model",
    track: "foundations",
    level: "Beginner",
    minutes: 15,
    summary:
      "Seven layers and six lifecycle stages: a grid where every product, institution and regulation in finance has exactly one home.",
    objectives: [
      "Name the seven layers of the finance stack",
      "Place any activity on the trade lifecycle: issue, trade, clear, settle, service, finance",
      "Use five questions to classify anything you meet, from a CCP to a stablecoin",
    ],
    blocks: [
      { type: "h", text: "Why you need a map" },
      {
        type: "p",
        text: "Finance looks chaotic because the same words mean different things and the same firm plays many roles. JPMorgan is a bank, a dealer, a custodian, a tri-party agent, an MMF manager *and* runs a blockchain. The trick is to stop sorting **firms** and start sorting **functions**. Every function lives on a layer of the stack and acts at a stage of the lifecycle.",
      },
      { type: "h", text: "The seven layers" },
      {
        type: "table",
        caption: "From who uses finance (top) to what holds it together (bottom)",
        headers: ["#", "Layer", "Question it answers", "Examples"],
        rows: [
          ["7", "End users", "Who needs money or wants a return?", "Governments, corporates, pension funds, households"],
          ["6", "Products", "What claim changes hands?", "T-bill, bond, share, fund unit, swap, stablecoin"],
          ["5", "Markets & venues", "Where do buyers and sellers meet?", "Auctions, exchanges, OTC dealers, Tradeweb, DLT venues"],
          ["4", "Intermediaries", "Who stands in between and takes a role?", "Banks, dealers, asset managers, agent lenders, tokenization platforms"],
          ["3", "Market infrastructure", "Which utilities make trades final and safe?", "CSDs, CCPs, custodians, tri-party agents, trade repositories, Swift"],
          ["2", "Money & payments", "What do we settle in and how does it move?", "Central bank reserves, deposits, RTGS, CLS, stablecoins"],
          ["1", "Rules & oversight", "Who sets and enforces the rules?", "BIS/FSB/IOSCO, central banks, SEC, ESMA, contracts like GMRA and ISDA"],
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "Rule of thumb",
        text: "Higher layers are **what** people want (returns, funding, hedges). Lower layers are **how** it becomes safe and final. Crises usually start in the upper layers and are contained, or not, by the lower ones.",
      },
      { type: "h", text: "The six lifecycle stages" },
      {
        type: "flow",
        steps: [
          { label: "Issue", detail: "A new claim is created: bond auction, IPO, fund subscription, stablecoin mint" },
          { label: "Trade", detail: "Buyer and seller agree price and quantity on a venue or OTC" },
          { label: "Clear", detail: "Obligations are confirmed, netted and often guaranteed by a CCP" },
          { label: "Settle", detail: "Asset and cash change hands, ideally DvP, at a CSD or on-chain" },
          { label: "Service", detail: "Custody, income, corporate actions, tax, reporting, NAV" },
          { label: "Finance", detail: "The asset is lent, repo'd or pledged as collateral to fund more activity" },
        ],
      },
      {
        type: "p",
        text: "Notice the loop: **finance** feeds back into **trade**. A bond bought on Monday is repo'd on Monday night to fund Tuesday's purchase. That loop, collateral re-use, is where leverage and liquidity come from.",
      },
      { type: "h", text: "Five questions to place anything" },
      {
        type: "list",
        ordered: true,
        items: [
          "**What is it?** A user, a claim (product), a meeting place (venue), a firm acting for others (intermediary), a utility (infrastructure), money, or a rule-maker? That gives the **layer**.",
          "**When does it act?** Issue, trade, clear, settle, service or finance? That gives the **stage(s)**.",
          "**Which asset class?** Cash, money market, fixed income, equity, funds, derivatives, FX or digital assets.",
          "**What risk does it carry or remove?** Credit, market, liquidity, operational or settlement risk (see [The risks that matter](/learn/risk-in-finance)).",
          "**Which rails?** Traditional (CSD, RTGS) or tokenized (shared ledger, on-chain cash)?",
        ],
      },
      {
        type: "table",
        caption: "Classification in practice",
        headers: ["Thing", "Layer", "Stage(s)", "Asset class", "Rails"],
        rows: [
          ["US Treasury bill", "Products", "Issue, trade", "Money market", "Traditional (Fedwire Securities)"],
          ["LCH SwapClear", "Infrastructure", "Clear", "Derivatives", "Traditional"],
          ["BNY tri-party", "Infrastructure", "Finance, settle", "Money market / fixed income", "Traditional"],
          ["BlackRock BUIDL", "Products", "Issue, service, finance", "Funds / digital", "Tokenized"],
          ["USDC", "Money", "Settle", "Digital cash", "Tokenized"],
          ["Securitize", "Intermediaries", "Issue, service", "Funds / digital", "Tokenized"],
          ["MiCA", "Oversight", "All", "Digital", "Tokenized"],
        ],
      },
      {
        type: "callout",
        tone: "token",
        title: "Tokenization collapses layers",
        text: "On a shared ledger, the registrar (issue), the CSD (settle), the custodian's books (service) and the collateral agent (finance) can all be the **same smart contract**. That is the real disruption: not faster trading but fewer layers of reconciled records.",
      },
      {
        type: "callout",
        tone: "info",
        title: "Explore it interactively",
        text: "Open the [interactive Finance Map](/map) to click through every layer, see which institutions sit where, and classify any product, player or lesson.",
      },
    ],
    bridge: { slug: "tokenization-101", text: "See which layers tokenization merges, and which it leaves untouched." },
    players: ["jpmorgan", "bny", "lch", "blackrock", "circle", "securitize"],
    quiz: [
      {
        q: "A CCP like LCH belongs to which layer?",
        options: ["Products", "Intermediaries", "Market infrastructure", "Rules & oversight"],
        answer: 2,
        explain: "CCPs are financial market infrastructures: utilities that make trades safe and final.",
      },
      {
        q: "Using a bond as repo collateral happens at which lifecycle stage?",
        options: ["Issue", "Clear", "Service", "Finance"],
        answer: 3,
        explain: "Financing (lending, repo, pledging) is the stage where assets are put to work to raise cash.",
      },
      {
        q: "Why sort functions rather than firms?",
        options: [
          "Firms are too small",
          "One firm often performs many functions across layers",
          "Functions never change",
          "Regulators only regulate firms",
        ],
        answer: 1,
        explain: "JPMorgan alone is a bank, dealer, custodian, tri-party agent, asset manager and blockchain operator.",
      },
      {
        q: "A stablecoin sits primarily on which layer?",
        options: ["Money & payments", "Market infrastructure", "End users", "Rules & oversight"],
        answer: 0,
        explain: "It's a form of (private) money used to settle and pay.",
      },
    ],
  },
  {
    slug: "central-banks-and-monetary-policy",
    title: "Central banks & monetary policy",
    track: "foundations",
    level: "Intermediate",
    minutes: 16,
    summary:
      "How central banks set rates (corridor vs floor systems), why their balance sheets matter (QE and QT), and how policy flows through repo into every price.",
    objectives: [
      "Explain corridor and floor systems for steering overnight rates",
      "Describe QE, QT and their effect on reserves and repo",
      "Know the central bank facilities that backstop money markets",
    ],
    blocks: [
      { type: "h", text: "Three jobs" },
      {
        type: "list",
        items: [
          "**Monetary policy**: price stability (usually a ~2% inflation target), and in the US also maximum employment.",
          "**Financial stability**: lender of last resort, oversight of FMIs, macroprudential policy.",
          "**Payments**: issuing banknotes and running RTGS systems (Fedwire, T2, CHAPS, SIC, BOJ-NET).",
        ],
      },
      { type: "h", text: "Steering the overnight rate" },
      {
        type: "compare",
        left: {
          title: "Corridor system (scarce reserves)",
          points: [
            "Lending facility = ceiling; deposit facility = floor",
            "Central bank keeps reserves scarce with daily operations",
            "Pre-2008 Fed and ECB; still used by some central banks",
          ],
        },
        right: {
          title: "Floor system (ample reserves)",
          points: [
            "So many reserves that the rate sinks to the deposit rate (IORB, ECB DFR)",
            "ON RRP (Fed) extends the floor to MMFs and non-banks",
            "Fed, ECB, BoE today",
          ],
        },
      },
      { type: "h", text: "Balance sheet: QE and QT" },
      {
        type: "p",
        text: "In **quantitative easing (QE)** the central bank buys government bonds and pays with new reserves, pushing down long-term yields. **Quantitative tightening (QT)** lets bonds mature without reinvesting, draining reserves. The Fed's balance sheet peaked near **$9 trillion** in 2022; QT then drained first the ON RRP facility and then bank reserves, which is why repo rates became more sensitive in 2025 and the Fed slowed and ended QT.",
      },
      {
        type: "stats",
        items: [
          { value: "~$9T", label: "Fed balance sheet peak (2022)", source: "Federal Reserve H.4.1" },
          { value: "$2.5T+", label: "Peak ON RRP usage (Dec 2022)", source: "NY Fed" },
          { value: "4%", label: "ECB deposit rate peak (2023–24)", source: "ECB" },
        ],
      },
      { type: "h", text: "Backstop facilities" },
      {
        type: "table",
        headers: ["Facility", "Central bank", "What it does"],
        rows: [
          ["Standing Repo Facility (SRF)", "Fed", "Lends cash against Treasuries/agencies to primary dealers and banks, capping repo rates"],
          ["ON RRP", "Fed", "Takes cash from MMFs and GSEs, putting a floor under rates"],
          ["Discount window", "Fed", "Lender of last resort for banks"],
          ["MRO / LTRO / TLTRO", "ECB", "Weekly and longer refinancing operations against collateral"],
          ["Marginal lending facility", "ECB", "Overnight ceiling facility"],
          ["Short-Term Repo (STR) & ILTR", "BoE", "Demand-driven repo to supply reserves"],
          ["Central bank liquidity swap lines", "Fed + major CBs", "Provide USD to foreign central banks in stress (2008, 2020)"],
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Collateral frameworks are policy",
        text: "Which assets a central bank accepts, and at what haircut, shapes the whole market: eligible bonds are more liquid, cheaper to fund and more attractive to hold. The ECB's framework accepts a wide range including covered bonds, ABS and credit claims. Several central banks are studying whether to accept **tokenized** collateral.",
      },
    ],
    bridge: { slug: "stablecoins-and-tokenized-cash", text: "Central banks' answer to tokenization: wholesale CBDC and RTGS links." },
    players: ["fed", "ecb", "boe", "boj", "snb", "pboc", "rbi", "bis"],
    quiz: [
      {
        q: "In a floor system, the overnight rate trades close to:",
        options: ["The lending facility rate", "The deposit / interest-on-reserves rate", "The 10-year yield", "Zero always"],
        answer: 1,
        explain: "With ample reserves, banks lend excess at no more than what the central bank pays on reserves.",
      },
      {
        q: "QT drains:",
        options: ["Bank capital", "Central bank reserves (and ON RRP balances)", "Deposit insurance", "Stablecoin supply"],
        answer: 1,
        explain: "As bonds run off, the Treasury pays the Fed by draining reserves from the system.",
      },
      {
        q: "The Fed's Standing Repo Facility acts as:",
        options: ["A floor", "A ceiling on repo rates", "A deposit insurer", "A clearing house"],
        answer: 1,
        explain: "Eligible firms can borrow at the SRF rate, capping market repo spikes.",
      },
    ],
    sources: [
      { label: "Federal Reserve – Policy tools", url: "https://www.federalreserve.gov/monetarypolicy/policytools.htm" },
      { label: "ECB – Monetary policy instruments", url: "https://www.ecb.europa.eu/mopo/implement/html/index.en.html" },
    ],
  },
  {
    slug: "how-banks-work",
    title: "How a bank actually works",
    track: "foundations",
    level: "Beginner",
    minutes: 14,
    summary:
      "A bank's balance sheet, net interest margin, maturity transformation, capital and liquidity: the business model behind deposits, repo desks and custody.",
    objectives: [
      "Read a simplified bank balance sheet",
      "Explain maturity and liquidity transformation",
      "Distinguish capital from liquidity",
    ],
    blocks: [
      { type: "h", text: "The balance sheet" },
      {
        type: "table",
        caption: "A simplified bank",
        headers: ["Assets (what it owns)", "€bn", "Liabilities & equity (how it's funded)", "€bn"],
        rows: [
          ["Reserves at central bank", "80", "Retail deposits", "450"],
          ["Government bonds (HQLA)", "150", "Corporate deposits", "200"],
          ["Loans (mortgages, corporate)", "600", "Wholesale funding (repo, CP, bonds)", "200"],
          ["Reverse repo & trading assets", "150", "Subordinated debt / AT1", "30"],
          ["Other", "20", "Equity (CET1 capital)", "120"],
          ["**Total**", "**1,000**", "**Total**", "**1,000**"],
        ],
      },
      { type: "h", text: "The business model" },
      {
        type: "list",
        items: [
          "**Net interest margin**: earn more on loans and bonds than paid on deposits and funding.",
          "**Maturity transformation**: fund 25-year mortgages with deposits that can leave tomorrow.",
          "**Fees**: payments, custody, asset servicing, underwriting, FX, advisory.",
          "**Markets**: dealers make money on bid-ask spreads, financing (repo desks) and risk-taking.",
        ],
      },
      {
        type: "compare",
        left: {
          title: "Capital (solvency)",
          points: ["Absorbs losses", "Measured vs risk-weighted assets (CET1 ratio)", "Leverage ratio as a backstop", "Failure mode: losses > equity"],
        },
        right: {
          title: "Liquidity",
          points: ["Pays outflows on time", "LCR: 30-day stress buffer of HQLA", "NSFR: stable funding for long assets", "Failure mode: a run (SVB, 2023)"],
        },
      },
      {
        type: "callout",
        tone: "warn",
        title: "Runs are faster now",
        text: "Silicon Valley Bank lost about $42bn of deposits in a single day in March 2023, driven by social media and mobile banking. This is why regulators now worry about how quickly tokenized deposits or stablecoins could move in a panic.",
      },
      { type: "h", text: "Where banks show up in the stack" },
      {
        type: "p",
        text: "A large bank is at once an **intermediary** (lender, dealer, broker), an **infrastructure provider** (custodian, tri-party agent, clearing member), an issuer of **money** (deposits), and a heavily regulated entity under **Basel III**. Understanding which hat is on explains most of its behaviour, such as why repo desks shrink balance sheets at quarter-end.",
      },
    ],
    bridge: { slug: "stablecoins-and-tokenized-cash", text: "Tokenized deposits keep the bank model; stablecoins unbundle it." },
    players: ["jpmorgan", "bofa", "hsbc", "icbc", "mufg", "fdic"],
    quiz: [
      {
        q: "Which ratio measures whether a bank can survive 30 days of stressed outflows?",
        options: ["CET1", "LCR", "NSFR", "Leverage ratio"],
        answer: 1,
        explain: "The Liquidity Coverage Ratio requires enough HQLA to cover 30-day stressed net outflows.",
      },
      {
        q: "Maturity transformation means:",
        options: [
          "Converting bonds into shares",
          "Funding long-term assets with short-term liabilities",
          "Extending settlement cycles",
          "Changing a loan's currency",
        ],
        answer: 1,
        explain: "Banks borrow short (deposits) and lend long (mortgages).",
      },
    ],
  },
];
