import type { Topic } from "../types";

export const fixedIncome: Topic[] = [
  {
    slug: "bonds-basics",
    title: "Bonds: the anatomy",
    track: "fixed-income",
    level: "Beginner",
    minutes: 12,
    summary:
      "Face value, coupon, maturity, ISIN and the inverse relationship between price and yield: everything a term sheet tells you.",
    objectives: [
      "Read a bond term sheet",
      "Explain why prices fall when yields rise",
      "Know the main bond types by issuer",
    ],
    blocks: [
      { type: "h", text: "A bond is a loan you can trade" },
      {
        type: "p",
        text: "A bond is a debt security: the issuer borrows money and promises to pay **coupons** and repay the **face value** (principal) at **maturity**. Because it is a security with an identifier (an **ISIN**, e.g. US91282CJL54), it can be held in custody, traded, lent and used as repo collateral.",
      },
      {
        type: "table",
        caption: "Reading a term sheet",
        headers: ["Field", "Example", "Meaning"],
        rows: [
          ["Issuer", "European Investment Bank", "Who owes the money"],
          ["Face value", "€1,000 per bond; €3bn total", "Amount repaid at maturity"],
          ["Coupon", "2.75% annual, fixed", "Interest paid on face value"],
          ["Maturity", "15 Jan 2030", "Final repayment date"],
          ["Day count", "ACT/ACT", "How accrued interest is computed"],
          ["Rating", "AAA / Aaa", "Credit quality (S&P / Moody's / Fitch)"],
          ["Settlement", "T+2 via Euroclear / Clearstream", "Where and when it settles"],
          ["Governing law", "Luxembourg / English law", "Which courts decide disputes"],
        ],
      },
      { type: "h", text: "Price and yield move in opposite directions" },
      {
        type: "p",
        text: "A bond's price is the present value of its future cash flows. If market yields rise, those fixed cash flows are discounted more heavily, so the price falls. A bond paying 3% becomes less attractive when new bonds pay 5%, so its price drops until its **yield to maturity** matches the market.",
      },
      { type: "widget", kind: "bond" },
      { type: "h", text: "Types by issuer" },
      {
        type: "list",
        items: [
          "**Sovereigns**: US Treasuries, German Bunds, UK Gilts, JGBs. The risk-free benchmark in their currency.",
          "**Supranationals & agencies (SSA)**: EIB, World Bank, KfW. AAA issuers and the most active digital bond pioneers.",
          "**Financials**: senior, subordinated (AT1, Tier 2) and **covered bonds** (secured on mortgage pools, big in Europe).",
          "**Corporates**: investment grade (BBB– and above) or high yield.",
          "**Securitised**: ABS, MBS, CLOs. Backed by pools of loans.",
          "**Green / social / sustainability-linked**: use-of-proceeds or KPI-linked, under ICMA principles or the EU Green Bond Standard.",
        ],
      },
      {
        type: "stats",
        items: [
          { value: "~$145T", label: "Global bond market outstanding", source: "SIFMA, 2024" },
          { value: "~$28T+", label: "Marketable US Treasuries", source: "US Treasury, 2025" },
        ],
      },
    ],
    bridge: {
      slug: "tokenized-bonds",
      text: "Bonds were the first real-world asset tokenized at scale. See EIB, World Bank, Siemens, HK Government and more.",
    },
    players: ["eib", "worldbank", "spglobal", "moodys", "fitch"],
    quiz: [
      {
        q: "If market yields rise, the price of an existing fixed-rate bond:",
        options: ["Rises", "Falls", "Stays the same", "Doubles"],
        answer: 1,
        explain: "Higher discount rates reduce the present value of fixed cash flows.",
      },
      {
        q: "A covered bond is:",
        options: [
          "An unsecured corporate bond",
          "A bank bond with recourse to the issuer and a segregated cover pool",
          "A government bill",
          "A derivative",
        ],
        answer: 1,
        explain: "Covered bond investors have dual recourse: the issuing bank and the cover pool.",
      },
      {
        q: "What uniquely identifies a bond issue internationally?",
        options: ["LEI", "ISIN", "BIC", "IBAN"],
        answer: 1,
        explain: "The International Securities Identification Number (ISO 6166) identifies securities. LEI identifies legal entities.",
      },
    ],
  },
  {
    slug: "bond-pricing-and-duration",
    title: "Pricing, yield & duration",
    track: "fixed-income",
    level: "Intermediate",
    minutes: 18,
    summary:
      "YTM, clean vs dirty price, accrued interest, duration and convexity: the maths used on every trading desk.",
    objectives: [
      "Price a bond from its cash flows",
      "Compute accrued interest and dirty price",
      "Use modified duration to estimate price sensitivity",
    ],
    blocks: [
      { type: "h", text: "Pricing formula" },
      {
        type: "p",
        text: "For a bond with annual coupon C, face F, n years and yield y: `Price = Σ C/(1+y)^t + F/(1+y)^n`. When coupon = yield, price = par (100). Coupon above yield means premium; coupon below yield means discount.",
      },
      {
        type: "example",
        title: "Premium bond",
        lines: [
          "5-year bond, 5% annual coupon, face 100, market yield 4%",
          "PV coupons = 5 × [1 – 1.04^-5] / 0.04 = 22.26",
          "PV principal = 100 / 1.04^5 = 82.19",
        ],
        result: "Price ≈ 104.45 (premium, because coupon > yield)",
      },
      { type: "h", text: "Clean vs dirty price" },
      {
        type: "p",
        text: "Bonds are quoted at a **clean price** (excluding accrued interest). The buyer actually pays the **dirty price** = clean + accrued interest, because the seller held the bond for part of the coupon period. Settlement systems compute the cash amount from the dirty price, and so must tokenized bond smart contracts.",
      },
      { type: "h", text: "Duration and convexity" },
      {
        type: "list",
        items: [
          "**Macaulay duration**: the weighted-average time to receive cash flows (in years).",
          "**Modified duration**: % price change for a 1% (100bp) change in yield. `ΔP/P ≈ –D_mod × Δy`.",
          "**DV01 / PV01**: price change for a 1bp move; how desks size hedges.",
          "**Convexity**: the curvature. Prices rise more when yields fall than they drop when yields rise.",
        ],
      },
      {
        type: "example",
        title: "Duration in action",
        lines: ["Modified duration = 7.2; yields rise 50bp", "ΔP/P ≈ –7.2 × 0.005 = –3.6%"],
        result: "A €10m position loses about €360k",
      },
      {
        type: "callout",
        tone: "warn",
        title: "SVB, 2023",
        text: "Silicon Valley Bank held long-duration Treasuries and MBS funded by flighty deposits. When rates rose around 4-5 percentage points, unrealised losses exceeded its capital. Duration risk plus liquidity risk led to a bank run in days.",
      },
    ],
    bridge: {
      slug: "tokenized-bonds",
      text: "On-chain bonds must encode coupon schedules, day counts and accrued interest in smart contracts.",
    },
    players: ["bloomberg", "tradeweb", "marketaxess"],
    quiz: [
      {
        q: "A bond with a 3% coupon when market yields are 4% trades at:",
        options: ["Premium", "Par", "Discount", "Cannot tell"],
        answer: 2,
        explain: "Coupon below yield means the price must be below par to compensate.",
      },
      {
        q: "Modified duration 5, yields fall 1%. Approximate price change?",
        options: ["–5%", "+5%", "+1%", "–1%"],
        answer: 1,
        explain: "ΔP/P ≈ –5 × (–0.01) = +5%.",
      },
      {
        q: "The buyer of a bond pays:",
        options: ["Clean price", "Dirty price (clean + accrued)", "Face value", "Coupon only"],
        answer: 1,
        explain: "Accrued interest compensates the seller for the part of the coupon period they held the bond.",
      },
    ],
  },
  {
    slug: "bond-issuance-and-trading",
    title: "Issuance & trading of bonds",
    track: "fixed-income",
    level: "Intermediate",
    minutes: 14,
    summary:
      "Auctions, syndications, bookbuilding, primary dealers and how OTC bond trading works on electronic venues.",
    objectives: [
      "Describe government auctions vs syndicated deals",
      "Follow a eurobond issuance from mandate to closing",
      "Understand the dealer-to-client and dealer-to-dealer market",
    ],
    blocks: [
      { type: "h", text: "Two ways to issue" },
      {
        type: "compare",
        left: {
          title: "Auctions (sovereigns)",
          points: [
            "Regular calendar (e.g. US Treasury weekly bills)",
            "Primary dealers must bid (the Fed has about 25 PDs)",
            "Single-price (US) or multiple-price auctions",
          ],
        },
        right: {
          title: "Syndication (SSA, banks, corporates)",
          points: [
            "Joint bookrunners gather orders (bookbuilding)",
            "Price guidance tightens as book grows",
            "Allocation, pricing, then closing at T+5 typical",
          ],
        },
      },
      {
        type: "flow",
        title: "Eurobond syndication timeline",
        steps: [
          { label: "Mandate", detail: "Issuer appoints bookrunners; documentation (prospectus / EMTN programme)" },
          { label: "Announcement", detail: "Initial price thoughts (IPTs) to investors" },
          { label: "Bookbuilding", detail: "Orders collected, spread guidance tightened" },
          { label: "Pricing", detail: "Final spread and coupon set; allocation" },
          { label: "Closing", detail: "Issuing & paying agent, common depositary; settlement in Euroclear/Clearstream" },
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "The chain behind one eurobond",
        text: "A typical eurobond involves the issuer, bookrunners, lawyers for both sides, a fiscal or issuing & paying agent, a common depositary and a common safekeeper holding the global note, the ICSDs (Euroclear Bank and Clearstream Banking), custodians and investors. Digital bond issuances collapse many of these roles into the ledger.",
      },
      { type: "h", text: "Secondary trading" },
      {
        type: "p",
        text: "Most bonds trade **OTC**. Dealers quote prices and hold inventory. Electronic platforms now handle a large share: **Tradeweb** and **Bloomberg** for rates and **MarketAxess** for credit, with request-for-quote (RFQ) and all-to-all protocols. Post-trade transparency: TRACE in the US; MiFID II/MiFIR in the EU.",
      },
      {
        type: "players",
        title: "Venues and dealers",
        ids: ["tradeweb", "marketaxess", "bloomberg", "jpmorgan", "goldman", "citi", "bnpparibas"],
      },
    ],
    bridge: {
      slug: "tokenized-bonds",
      text: "Digital-native bonds issue directly on DLT, with registrar and CSD functions merged.",
    },
    players: ["tradeweb", "marketaxess", "bloomberg", "euroclear", "clearstream"],
    quiz: [
      {
        q: "Who must participate in US Treasury auctions?",
        options: ["Retail investors", "Primary dealers", "MMFs", "Custodians"],
        answer: 1,
        explain: "Primary dealers are expected to bid in every auction.",
      },
      {
        q: "Where do most eurobonds settle?",
        options: ["DTC", "Euroclear Bank and Clearstream Banking (ICSDs)", "CLS", "SWIFT"],
        answer: 1,
        explain: "The two ICSDs are the settlement hubs of the eurobond market.",
      },
    ],
  },
  {
    slug: "credit-and-ratings",
    title: "Credit, spreads & ratings",
    track: "fixed-income",
    level: "Intermediate",
    minutes: 12,
    summary:
      "Why corporate bonds yield more than government bonds, how rating agencies grade issuers and what drives credit spreads.",
    objectives: [
      "Decompose a bond yield into risk-free rate + spread",
      "Read the rating scale and the investment grade cut-off",
      "Explain the role of CDS",
    ],
    blocks: [
      { type: "h", text: "Yield = risk-free + spread" },
      {
        type: "p",
        text: "A corporate bond yield = the government yield of similar maturity + a **credit spread**. The spread pays for expected default losses, uncertainty and liquidity. Spreads widen in stress (2008, March 2020) and tighten in calm markets.",
      },
      {
        type: "table",
        caption: "Rating scale (S&P / Fitch vs Moody's)",
        headers: ["Grade", "S&P / Fitch", "Moody's", "Meaning"],
        rows: [
          ["Prime", "AAA", "Aaa", "Highest quality: US agencies, EIB, World Bank"],
          ["High grade", "AA+ to AA–", "Aa1 to Aa3", "Very strong"],
          ["Upper medium", "A+ to A–", "A1 to A3", "Strong"],
          ["Lower medium", "BBB+ to BBB–", "Baa1 to Baa3", "Adequate: lowest investment grade"],
          ["Speculative", "BB+ and below", "Ba1 and below", "High yield / junk"],
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "Fallen angels",
        text: "A bond downgraded from BBB– to BB+ becomes a 'fallen angel'. Many funds must sell it, which can depress prices sharply. Rating thresholds are hard-coded into mandates, CCP collateral schedules and central bank eligibility rules.",
      },
      { type: "h", text: "Credit default swaps" },
      {
        type: "p",
        text: "A **CDS** is insurance on a borrower's default: the buyer pays a periodic premium; the seller pays out if a credit event occurs. CDS indices (CDX, iTraxx) are centrally cleared at ICE Clear Credit and LCH CDSClear.",
      },
    ],
    bridge: {
      slug: "tokenized-private-credit-and-rwa",
      text: "Private credit is one of the fastest-growing tokenized real-world asset classes.",
    },
    players: ["spglobal", "moodys", "fitch", "ice"],
    quiz: [
      {
        q: "The lowest investment-grade rating at S&P is:",
        options: ["A–", "BBB–", "BB+", "B"],
        answer: 1,
        explain: "BBB– (Baa3 at Moody's) is the cut-off for investment grade.",
      },
      {
        q: "Credit spreads typically ___ during financial stress.",
        options: ["Tighten", "Widen", "Stay flat", "Turn negative"],
        answer: 1,
        explain: "Investors demand more compensation for default and liquidity risk.",
      },
    ],
  },
];
