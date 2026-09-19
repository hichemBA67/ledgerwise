import type { Topic } from "../types";

export const infrastructureMore: Topic[] = [
  {
    slug: "payments-and-rtgs",
    title: "Payment systems: RTGS, correspondent banking & instant payments",
    track: "infrastructure",
    level: "Intermediate",
    minutes: 16,
    summary:
      "How money actually moves: RTGS for large values, ACH and instant payments for retail, correspondent banking for cross-border, and CLS for FX.",
    objectives: [
      "Distinguish RTGS, deferred net settlement and instant payment systems",
      "Explain correspondent banking and nostro/vostro accounts",
      "Place stablecoins and tokenized deposits in the payments landscape",
    ],
    blocks: [
      { type: "h", text: "The payment system map" },
      {
        type: "table",
        headers: ["Type", "What moves", "Examples"],
        rows: [
          ["RTGS (large value)", "Interbank payments, gross in central bank money", "Fedwire Funds, T2, CHAPS, SIC, BOJ-NET, CNAPS HVPS"],
          ["Private large-value (net)", "Netted bank payments", "CHIPS (US), EURO1 (EU)"],
          ["ACH / batch retail", "Payroll, direct debits", "US ACH (Nacha), SEPA credit transfers"],
          ["Instant payments", "24/7 retail in seconds", "FedNow, RTP, TIPS/SCT Inst, Faster Payments, UPI, Pix, PayNow"],
          ["Card networks", "Card purchases", "Visa, Mastercard, UnionPay"],
          ["FX PvP", "Both currency legs simultaneously", "CLS"],
          ["Messaging (not settlement)", "Payment instructions", "Swift (ISO 20022)"],
        ],
      },
      { type: "diagram", product: "rtgs-payment" },
      { type: "h", text: "Cross-border: correspondent banking" },
      {
        type: "p",
        text: "To send dollars from a bank in Kenya to a bank in Germany, the payment hops through **correspondent banks** holding each other's accounts (**nostro** = 'our account at you', **vostro** = 'your account at us'), messaging via Swift, and ultimately settles in Fedwire between US banks. This is slow, costly and opaque; the G20 set targets for faster, cheaper cross-border payments by 2027.",
      },
      { type: "diagram", product: "correspondent-payment" },
      {
        type: "stats",
        items: [
          { value: "~$4T/day", label: "Fedwire Funds average daily value", source: "Federal Reserve" },
          { value: "10bn+/month", label: "UPI transactions in India", source: "NPCI" },
          { value: "2027", label: "G20 cross-border payments targets", source: "FSB" },
        ],
      },
      {
        type: "callout",
        tone: "token",
        title: "Where on-chain money fits",
        text: "Stablecoins and tokenized deposits compete mainly in **cross-border** and **24/7 wholesale** payments, where legacy rails are weakest. Domestic instant payment systems (Pix, UPI, FedNow) already make retail payments fast and cheap without blockchains.",
      },
    ],
    bridge: { slug: "stablecoins-and-tokenized-cash", text: "Stablecoins, deposit tokens and wCBDC as new payment rails." },
    players: ["fed", "ecb", "swift", "cls", "tch", "ebaclearing", "npci", "bcb", "visa", "mastercard"],
    quiz: [
      {
        q: "An RTGS system settles payments:",
        options: ["Net at end of day", "Individually and in real time, in central bank money", "Only on weekends", "Via Swift"],
        answer: 1,
        explain: "Real-time gross settlement: each payment is final as it happens.",
      },
      {
        q: "Swift is:",
        options: ["A settlement system", "A messaging network, not a settlement system", "A central bank", "A CCP"],
        answer: 1,
        explain: "Swift carries instructions; money settles in accounts at banks and central banks.",
      },
      {
        q: "A 'nostro' account is:",
        options: ["Our account held at another bank", "Their account held at our bank", "A central bank account", "A crypto wallet"],
        answer: 0,
        explain: "Nostro = ours (at you); vostro = yours (at us).",
      },
    ],
  },
  {
    slug: "asset-servicing-and-corporate-actions",
    title: "Asset servicing & corporate actions",
    track: "infrastructure",
    level: "Intermediate",
    minutes: 13,
    summary:
      "Income collection, mandatory and voluntary corporate actions, proxy voting and tax: the unglamorous work that costs the industry billions.",
    objectives: [
      "Distinguish mandatory, voluntary and mandatory-with-options events",
      "Trace a dividend through the custody chain",
      "See why corporate actions are a prime automation target",
    ],
    blocks: [
      { type: "h", text: "What servicing covers" },
      {
        type: "table",
        headers: ["Event type", "Examples", "Investor decision?"],
        rows: [
          ["Mandatory", "Cash dividend, coupon, redemption, stock split, merger", "No"],
          ["Mandatory with options", "Scrip dividend (cash or shares)", "Yes, with a default"],
          ["Voluntary", "Tender offer, rights issue, exchange offer", "Yes"],
          ["Meetings", "AGM/EGM proxy voting", "Yes"],
        ],
      },
      { type: "diagram", product: "custody-service" },
      {
        type: "p",
        text: "A dividend announcement has to cascade from issuer → CSD → sub-custodian → global custodian → asset manager → fund, with each layer re-keying and reconciling key dates (**ex-date, record date, pay date**). Errors are common, and elections for voluntary events must flow back up the chain before deadlines.",
      },
      {
        type: "callout",
        tone: "warn",
        title: "Cost of complexity",
        text: "Industry studies have long estimated that corporate action errors and processing cost the industry billions per year. EU SRD II (shareholder rights) and ISO 20022 messages aim to standardise the chain.",
      },
      {
        type: "callout",
        tone: "token",
        title: "Tokenization angle",
        text: "When the register is on-chain, the issuer can pay coupons or dividends directly to token holders' wallets, snapshot the record date on the ledger, and run votes on-chain. This removes several reconciliation layers. Tax withholding and investor identification remain the hard parts.",
      },
    ],
    bridge: { slug: "digital-asset-custody", text: "What stays and what changes for custodians on-chain." },
    players: ["bny", "statestreet", "jpmorgan", "caceis", "broadridge", "swift"],
    quiz: [
      {
        q: "A tender offer is a:",
        options: ["Mandatory event", "Voluntary event", "Settlement fail", "Coupon payment"],
        answer: 1,
        explain: "Holders choose whether to tender their shares.",
      },
    ],
  },
  {
    slug: "fund-administration-and-transfer-agency",
    title: "Fund administration & transfer agency",
    track: "infrastructure",
    level: "Intermediate",
    minutes: 12,
    summary:
      "NAV calculation, shareholder registers, dealing cut-offs and depositary oversight: the back office every fund needs, and the first thing tokenization digitises.",
    objectives: [
      "Describe the daily NAV cycle",
      "Explain the transfer agent's role and dealing process",
      "See why tokenized funds start with the register",
    ],
    blocks: [
      { type: "h", text: "The daily cycle" },
      { type: "diagram", product: "fund-administration" },
      {
        type: "flow",
        steps: [
          { label: "Orders", detail: "Investors/platforms send subscriptions and redemptions before the cut-off" },
          { label: "Pricing", detail: "Administrator values holdings and accrues income and fees" },
          { label: "NAV", detail: "NAV per share struck and published (e.g. 4pm ET)" },
          { label: "Dealing", detail: "Transfer agent issues/cancels units at NAV and updates the register" },
          { label: "Cash settlement", detail: "Cash moves T+1 to T+3; custodian settles underlying trades" },
        ],
      },
      {
        type: "list",
        items: [
          "**Fund administrator**: accounting, NAV, financial statements (SS&C, BNY, State Street, Citco, Apex).",
          "**Transfer agent**: investor register, AML/KYC, dealing, distributions.",
          "**Depositary (UCITS/AIFMD)**: safekeeping plus independent oversight and liability for loss.",
          "**Order routing**: Calastone, Swift, Allfunds, FNZ connect distributors to TAs.",
        ],
      },
      {
        type: "callout",
        tone: "token",
        title: "Why the register goes on-chain first",
        text: "Tokenizing a fund doesn't touch its portfolio, only its register and dealing. Franklin's BENJI, BlackRock's BUIDL (Securitize as TA) and Calastone's tokenised distribution all start there, enabling instant settlement in stablecoins and 24/7 transfers.",
      },
    ],
    bridge: { slug: "tokenized-money-market-funds", text: "On-chain registers in action." },
    players: ["ssandc", "bny", "statestreet", "caceis", "calastone", "fnz", "securitize"],
    quiz: [
      {
        q: "Who maintains a fund's shareholder register?",
        options: ["Fund administrator", "Transfer agent", "Depositary", "Auditor"],
        answer: 1,
        explain: "The TA keeps the register and processes dealing.",
      },
    ],
  },
  {
    slug: "messaging-and-standards",
    title: "Messaging, identifiers & data standards",
    track: "infrastructure",
    level: "Intermediate",
    minutes: 12,
    summary:
      "Swift, ISO 20022, FIX, ISIN, LEI, CFI, UPI and ICMA's Bond Data Taxonomy: the shared language that lets thousands of firms interoperate.",
    objectives: [
      "Name the key identifiers and what they identify",
      "Explain the ISO 20022 migration",
      "See why standards matter even more for tokenization",
    ],
    blocks: [
      { type: "h", text: "Identifiers" },
      {
        type: "table",
        headers: ["Code", "Identifies", "Example / issuer"],
        rows: [
          ["ISIN (ISO 6166)", "A security", "US91282CJL54, issued by national numbering agencies"],
          ["LEI (ISO 17442)", "A legal entity", "20-character code, GLEIF system"],
          ["BIC (ISO 9362)", "A financial institution for messaging", "CHASUS33 (JPMorgan NY)"],
          ["CFI (ISO 10962)", "Type of instrument", "DBFTFB = fixed-rate bond"],
          ["UTI / UPI", "A derivatives trade / product", "Required for trade reporting"],
          ["DTI (ISO 24165)", "A digital token", "Links a token to its ledger & contract"],
        ],
      },
      { type: "h", text: "Messaging" },
      {
        type: "list",
        items: [
          "**Swift**: secure network for payments (MT103 → pacs.008), securities (MT54x settlement instructions) and more.",
          "**ISO 20022**: rich, structured XML data standard; cross-border payments migrated by Nov 2025; RTGS systems (T2, CHAPS, Fedwire) moved too.",
          "**FIX protocol**: order and execution messaging for trading.",
          "**ISDA CDM / ICMA Bond Data Taxonomy**: machine-readable models of trades and bonds, used for smart contracts.",
        ],
      },
      {
        type: "callout",
        tone: "token",
        title: "Standards make tokenization work",
        text: "A token that can't be mapped to an ISIN, LEI and DTI is invisible to risk, reporting and custody systems. Interoperability between chains and legacy systems depends on shared data models, which is why ICMA's BDT and ISDA's CDM feature in almost every serious digital bond or repo pilot.",
      },
    ],
    bridge: { slug: "interoperability-and-bridges", text: "Connecting ledgers to each other and to legacy systems." },
    players: ["swift", "icma", "isda", "fis", "broadridge"],
    quiz: [
      {
        q: "Which code identifies a legal entity?",
        options: ["ISIN", "LEI", "CFI", "DTI"],
        answer: 1,
        explain: "The Legal Entity Identifier (ISO 17442).",
      },
      {
        q: "ISO 20022 is:",
        options: ["A blockchain", "A financial messaging data standard", "A capital rule", "A stablecoin"],
        answer: 1,
        explain: "Rich structured data for payments and securities messaging.",
      },
    ],
  },
];
