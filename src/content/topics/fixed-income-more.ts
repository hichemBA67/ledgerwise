import type { Topic } from "../types";

export const fixedIncomeMore: Topic[] = [
  {
    slug: "government-bond-markets",
    title: "Government bond markets",
    track: "fixed-income",
    level: "Intermediate",
    minutes: 16,
    summary:
      "Treasuries, Bunds, gilts, JGBs and BTPs: how sovereigns issue, who buys, why these markets anchor every other price, and what the basis trade is.",
    objectives: [
      "Compare the major sovereign markets",
      "Explain primary dealers, auctions and debt management offices",
      "Understand the Treasury cash-futures basis trade and its risks",
    ],
    blocks: [
      { type: "h", text: "The risk-free anchor" },
      {
        type: "p",
        text: "Government bonds in a country's own currency are the benchmark **risk-free** asset: they price the yield curve, serve as the main collateral in repo and at CCPs, fill banks' liquidity buffers and are held as reserves by central banks worldwide.",
      },
      { type: "diagram", product: "government-bond" },
      {
        type: "table",
        caption: "Major sovereign markets (approximate, 2025)",
        headers: ["Market", "Issuer", "Outstanding", "Settles at"],
        rows: [
          ["US Treasuries", "US Treasury (Bureau of the Fiscal Service)", "~$28T+ marketable", "Fedwire Securities (FICC for cleared)"],
          ["Japanese JGBs", "Ministry of Finance", "~¥1,000T+ (BoJ holds ~half)", "BOJ-NET"],
          ["Italian BTPs", "Tesoro (MEF)", "~€2.5T+", "Euronext Securities Milan / T2S"],
          ["French OATs", "Agence France Trésor", "~€2.5T+", "Euroclear France / T2S"],
          ["UK gilts", "UK Debt Management Office", "~£2.5T+", "CREST"],
          ["German Bunds", "Finanzagentur", "~€1.7T+", "Clearstream Frankfurt / T2S"],
          ["Chinese CGBs", "Ministry of Finance", "~¥35T+", "CCDC"],
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "EU bonds",
        text: "Since the NextGenerationEU recovery programme (2021) the European Commission has become one of Europe's largest issuers, with ~€700bn+ of EU-Bonds including the world's largest green bond programme.",
      },
      { type: "h", text: "The basis trade" },
      {
        type: "p",
        text: "Hedge funds buy cash Treasuries, sell Treasury futures, and finance the bonds in repo, earning the small gap (the basis) with high leverage. It supplies liquidity to asset managers who prefer futures. In March 2020 margin calls forced a disorderly unwind, one reason for the SEC's Treasury clearing mandate and the Fed's standing facilities.",
      },
      {
        type: "flow",
        title: "Basis trade mechanics",
        steps: [
          { label: "Buy cash bond", detail: "Hedge fund buys Treasuries" },
          { label: "Repo it", detail: "Finances ~98% via repo (often cleared at FICC)" },
          { label: "Sell futures", detail: "Short CME Treasury futures against the position" },
          { label: "Converge", detail: "Cash and futures converge at delivery and the basis is earned" },
        ],
      },
    ],
    bridge: { slug: "tokenized-money-market-funds", text: "Tokenized Treasury funds are the on-chain doorway to this market." },
    players: ["fed", "dtcc", "cme", "bofa", "mizuho", "intesa", "ccdc", "sifma"],
    quiz: [
      {
        q: "The Treasury basis trade combines:",
        options: [
          "Long cash Treasuries financed in repo + short Treasury futures",
          "Long equities + short bonds",
          "Buying stablecoins",
          "Selling CDS",
        ],
        answer: 0,
        explain: "Funds earn the gap between cash and futures, financed with repo leverage.",
      },
      {
        q: "Which is the depository for China's interbank government bond market?",
        options: ["JASDEC", "CCDC", "DTC", "SIX SIS"],
        answer: 1,
        explain: "China Central Depository & Clearing (ChinaBond).",
      },
    ],
  },
  {
    slug: "securitization",
    title: "Securitization: ABS, MBS & CLOs",
    track: "fixed-income",
    level: "Advanced",
    minutes: 16,
    summary:
      "Pooling loans into an SPV and slicing the cash flows into tranches, from US agency MBS to CLOs and European covered bonds.",
    objectives: [
      "Walk through a securitization structure",
      "Explain tranching and the waterfall",
      "Compare agency MBS, ABS, CLOs and covered bonds",
    ],
    blocks: [
      { type: "h", text: "Turning loans into bonds" },
      {
        type: "p",
        text: "A bank (the **originator**) sells a pool of loans (mortgages, auto loans, credit cards, corporate loans) to a bankruptcy-remote **special purpose vehicle (SPV)**. The SPV funds the purchase by issuing notes in **tranches**. Cash from borrowers flows through a **waterfall**: senior notes are paid first, junior notes absorb losses first.",
      },
      { type: "diagram", product: "securitisation-abs" },
      {
        type: "table",
        headers: ["Type", "Collateral", "Notes"],
        rows: [
          ["Agency MBS", "US mortgages guaranteed by Fannie Mae, Freddie Mac, Ginnie Mae", "~$9T market; trades 'TBA'; settles at FICC MBSD"],
          ["Non-agency RMBS / CMBS", "Residential / commercial mortgages", "Epicentre of 2007–08 crisis"],
          ["ABS", "Auto loans, credit cards, student loans", "Short, amortising"],
          ["CLO", "Leveraged corporate loans", "Actively managed; ~$1T+ US market"],
          ["Covered bonds", "Mortgages or public loans kept on the bank's balance sheet", "Dual recourse; ~€3T global, huge in Denmark and Germany (Pfandbriefe)"],
          ["STS securitisation", "EU simple, transparent & standardised label", "Lower capital charges"],
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "2008 lessons",
        text: "Originate-to-distribute weakened lending standards; ratings overstated senior tranche safety; complex resecuritisations (CDO²) hid risk. Reforms: risk retention (issuers keep 5%), loan-level disclosure, STS labels and rating agency oversight.",
      },
      {
        type: "callout",
        tone: "token",
        title: "Tokenization angle",
        text: "Securitisation is data-heavy: loan-level tapes, servicer reports, waterfall calculations. Figure originates HELOCs on the Provenance blockchain and securitises them with on-chain loan data; smart contracts can compute waterfalls and give investors real-time pool performance.",
      },
    ],
    bridge: { slug: "tokenized-private-credit-and-rwa", text: "On-chain loan origination and tokenized credit pools." },
    players: ["figure", "provenance", "dbrs", "moodys", "nordea", "spglobal"],
    quiz: [
      {
        q: "In a securitization waterfall, which tranche absorbs losses first?",
        options: ["Senior", "Mezzanine", "Equity / first-loss", "All equally"],
        answer: 2,
        explain: "The junior (equity) tranche takes first losses, protecting the seniors.",
      },
      {
        q: "A key difference between covered bonds and ABS is that covered bonds:",
        options: [
          "Have no collateral",
          "Stay on the issuer's balance sheet with recourse to the bank",
          "Are equity instruments",
          "Can't be rated",
        ],
        answer: 1,
        explain: "Covered bond investors have dual recourse: issuer + cover pool.",
      },
    ],
  },
  {
    slug: "green-and-sustainable-bonds",
    title: "Green, social & sustainable bonds",
    track: "fixed-income",
    level: "Beginner",
    minutes: 11,
    summary:
      "Use-of-proceeds bonds, sustainability-linked bonds, the ICMA principles and EU Green Bond Standard, and why many digital bonds are green.",
    objectives: [
      "Distinguish use-of-proceeds from sustainability-linked bonds",
      "Know the main standards (ICMA GBP, EU GBS)",
      "See how tokenization helps impact reporting",
    ],
    blocks: [
      { type: "h", text: "Labelled bonds" },
      { type: "diagram", product: "green-bond" },
      {
        type: "compare",
        left: {
          title: "Use-of-proceeds (green/social/sustainability)",
          points: ["Money earmarked for eligible projects", "Reporting on allocation and impact", "ICMA Green/Social Bond Principles; EU GBS"],
        },
        right: {
          title: "Sustainability-linked bonds (SLBs)",
          points: ["General-purpose money", "Coupon steps up if KPIs (e.g. CO₂ cuts) are missed", "ICMA Sustainability-Linked Bond Principles"],
        },
      },
      {
        type: "stats",
        items: [
          { value: "$1T/yr", label: "Approximate annual GSS+ bond issuance", source: "Climate Bonds Initiative" },
          { value: "€250bn+", label: "NextGenerationEU green bond target", source: "European Commission" },
        ],
      },
      {
        type: "list",
        items: [
          "**EU Green Bond Standard** (applies since Dec 2024): voluntary gold standard aligned with the EU Taxonomy and external reviewer supervision by ESMA.",
          "**Greenium**: green bonds sometimes price slightly tighter than conventional equivalents.",
          "**Greenwashing risk**: weak project definitions; regulators increasingly scrutinise claims.",
        ],
      },
      {
        type: "callout",
        tone: "token",
        title: "Why so many digital bonds are green",
        text: "Hong Kong's tokenized government bonds (2023, 2024), EIB Climate Awareness digital bonds and SG-FORGE's 2023 green bond combine two innovations: tokens can carry impact data and link to real-time reporting (e.g. HKMA's Project Genesis explored this).",
      },
    ],
    bridge: { slug: "tokenized-bonds", text: "The landmark digital bonds, many of them green." },
    players: ["icma", "eib", "hkma", "pif", "sgforge"],
    quiz: [
      {
        q: "In a sustainability-linked bond, proceeds are:",
        options: ["Ring-fenced for green projects", "General purpose, with coupon tied to KPIs", "Paid to charities", "Held in escrow"],
        answer: 1,
        explain: "SLBs are KPI-based, not use-of-proceeds.",
      },
    ],
  },
];
