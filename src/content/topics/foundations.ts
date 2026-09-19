import type { Topic } from "../types";

export const foundations: Topic[] = [
  {
    slug: "money-and-banking",
    title: "What money really is",
    track: "foundations",
    level: "Beginner",
    minutes: 12,
    summary:
      "Money is a hierarchy of IOUs. Knowing who owes what to whom explains central banks, deposits, stablecoins and tokenized cash.",
    objectives: [
      "Distinguish central bank money, commercial bank money and private money",
      "Explain why settlement in central bank money is the gold standard",
      "Place stablecoins, tokenized deposits and wholesale CBDC in the money hierarchy",
    ],
    blocks: [
      { type: "h", text: "Money is a promise" },
      {
        type: "p",
        text: "Almost all modern money is a **liability** of someone. A banknote is a liability of the central bank. Your bank balance is a liability of your commercial bank: the bank owes you that money. A stablecoin is a liability of its issuer. So the key question for any form of money is: **whose promise is it, and how safe is that promise?**",
      },
      {
        type: "table",
        caption: "The money hierarchy",
        headers: ["Layer", "Whose liability", "Who can hold it", "Examples"],
        rows: [
          ["Central bank money", "Central bank", "Banks (reserves) and the public (cash)", "Fed reserves, ECB T2 balances, banknotes"],
          ["Commercial bank money", "Commercial bank", "Everyone with a bank account", "Deposits at JPMorgan, BNP Paribas, HSBC"],
          ["Tokenized deposits", "Commercial bank", "Bank clients on a ledger", "Kinexys (JPM Coin), Citi Token Services, HSBC TDS"],
          ["Stablecoins / e-money", "Non-bank issuer", "Anyone with a wallet", "USDC, USDT, EURC, PYUSD"],
          ["Wholesale CBDC", "Central bank", "Banks and FMIs", "Project Helvetia (SNB), ECB Pontes, mBridge"],
        ],
      },
      { type: "diagram", product: "bank-deposit" },
      { type: "h", text: "Why settlement asset matters" },
      {
        type: "p",
        text: "When two banks settle a large payment or a securities trade, the question is what they end up holding. If they settle in **central bank money** (reserves at the central bank), there is no credit risk on the settlement asset. That is why the CPMI-IOSCO *Principles for Financial Market Infrastructures* (PFMI) say FMIs should settle in central bank money where practical.",
      },
      {
        type: "callout",
        tone: "token",
        title: "Tokenization link",
        text: "The biggest open question in tokenization is the **cash leg**. A tokenized bond is only half a trade: you also need money on the same ledger (or linked to it) to achieve delivery-versus-payment. Options are wholesale CBDC, tokenized deposits, regulated stablecoins, or a bridge to existing RTGS systems (e.g. the Bundesbank trigger solution, Swiss SIC link, or ECB Pontes).",
      },
      { type: "h", text: "How banks create money" },
      {
        type: "p",
        text: "When a bank makes a loan, it credits the borrower's account with a new deposit. Lending creates deposits, not the other way round. Banks are limited by capital rules (Basel III), liquidity rules (LCR, NSFR) and the demand for credit, not by a fixed multiple of reserves.",
      },
      {
        type: "flow",
        title: "A payment between two banks",
        steps: [
          { label: "Instruction", detail: "Alice (Bank A) pays Bob (Bank B) €1m" },
          { label: "Debit", detail: "Bank A reduces Alice's deposit" },
          { label: "Interbank", detail: "Bank A pays Bank B in reserves via RTGS (T2, Fedwire, CHAPS)" },
          { label: "Credit", detail: "Bank B increases Bob's deposit" },
        ],
      },
      { type: "h", text: "Key takeaways" },
      {
        type: "list",
        items: [
          "Money has layers. The layer you hold decides the credit risk you take.",
          "Wholesale markets settle interbank in central bank reserves through RTGS systems.",
          "Stablecoins and tokenized deposits are new forms of private money on programmable ledgers.",
        ],
      },
    ],
    bridge: {
      slug: "stablecoins-and-tokenized-cash",
      text: "See how the same hierarchy is being rebuilt on-chain with stablecoins, tokenized deposits and wholesale CBDC.",
    },
    players: ["fed", "ecb", "jpmorgan", "circle", "tether", "snb"],
    quiz: [
      {
        q: "A customer deposit at a commercial bank is a liability of:",
        options: ["The central bank", "The commercial bank", "The government", "The customer"],
        answer: 1,
        explain: "Deposits are IOUs of the commercial bank. That is why deposit insurance and bank regulation exist.",
      },
      {
        q: "Why do FMIs prefer settling in central bank money?",
        options: [
          "It is faster",
          "It carries no credit or liquidity risk on the settlement asset",
          "It is cheaper",
          "It is required for retail payments",
        ],
        answer: 1,
        explain: "Central bank money cannot default in its own currency, so the settlement asset itself carries no credit risk (PFMI Principle 9).",
      },
      {
        q: "Which of these is a tokenized form of commercial bank money?",
        options: ["USDT", "Wholesale CBDC", "JPMorgan's Kinexys deposit tokens", "Banknotes"],
        answer: 2,
        explain: "Tokenized deposits remain liabilities of the issuing bank, just recorded on a ledger.",
      },
    ],
    sources: [
      { label: "BIS – The money hierarchy & tokenisation (Annual Economic Report 2025)", url: "https://www.bis.org/publ/arpdf/ar2025e3.htm" },
      { label: "Bank of England – Money creation in the modern economy", url: "https://www.bankofengland.co.uk/quarterly-bulletin/2014/q1/money-creation-in-the-modern-economy" },
    ],
  },
  {
    slug: "financial-markets-map",
    title: "The map of financial markets",
    track: "foundations",
    level: "Beginner",
    minutes: 10,
    summary:
      "Who issues, who invests, who intermediates and who keeps the records: a single map of the capital markets value chain.",
    objectives: [
      "Name the main market segments and instruments",
      "Follow a trade through front, middle and back office",
      "Identify the role of each intermediary in the chain",
    ],
    blocks: [
      { type: "h", text: "Segments" },
      {
        type: "table",
        headers: ["Market", "Tenor", "Main instruments", "Why it exists"],
        rows: [
          ["Money market", "Overnight to 1 year", "Repo, T-bills, CP, CDs, MMFs", "Short-term liquidity management"],
          ["Bond (debt) market", "1 to 30+ years", "Government, corporate, covered bonds", "Long-term borrowing"],
          ["Equity market", "Perpetual", "Shares, ETFs", "Ownership and risk capital"],
          ["Derivatives", "Any", "Swaps, futures, options", "Hedging and transferring risk"],
          ["FX", "Spot to years", "Spot, forwards, swaps", "Exchanging currencies"],
        ],
      },
      { type: "h", text: "Primary vs secondary" },
      {
        type: "p",
        text: "In the **primary market** an issuer (a government, bank or company) sells new securities to investors, usually through underwriting banks. In the **secondary market** investors trade existing securities with each other, on exchanges, on electronic platforms (Tradeweb, MarketAxess, Bloomberg) or over-the-counter (OTC) with dealers.",
      },
      { type: "h", text: "The trade lifecycle" },
      {
        type: "flow",
        steps: [
          { label: "Pre-trade", detail: "Research, pricing, limits, KYC" },
          { label: "Execution", detail: "Order hits exchange, venue or dealer" },
          { label: "Confirmation", detail: "Both sides agree terms (affirmation)" },
          { label: "Clearing", detail: "Netting and, often, a CCP guarantee" },
          { label: "Settlement", detail: "Securities vs cash at the CSD (DvP)" },
          { label: "Custody & servicing", detail: "Safekeeping, income, corporate actions" },
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Post-trade is where the cost hides",
        text: "Execution takes milliseconds. Clearing, settlement, reconciliation and custody can take days and involve many intermediaries each keeping their own records. Removing reconciliation between these records is the main promise of shared ledgers.",
      },
      { type: "h", text: "Who does what" },
      {
        type: "list",
        items: [
          "**Issuers** raise money: sovereigns, supranationals (EIB, World Bank), banks, corporates.",
          "**Investors**: pension funds, insurers, asset managers, MMFs, hedge funds, central banks, retail.",
          "**Dealers / broker-dealers** make markets and underwrite: JPMorgan, Goldman Sachs, Citi, BNP Paribas.",
          "**Venues**: exchanges (NYSE, LSE, Deutsche Börse, SIX) and multilateral trading platforms.",
          "**FMIs**: CCPs (LCH, Eurex Clearing, DTCC's NSCC/FICC), CSDs (DTC, Euroclear, Clearstream), payment systems.",
          "**Custodians**: BNY, State Street, JPMorgan, Citi, BNP Paribas, HSBC, Northern Trust.",
        ],
      },
      {
        type: "players",
        title: "Examples along the chain",
        ids: ["jpmorgan", "goldman", "tradeweb", "lseg", "dtcc", "euroclear", "clearstream", "bny", "statestreet"],
      },
    ],
    bridge: {
      slug: "tokenization-101",
      text: "Tokenization mostly compresses the post-trade half of this lifecycle. See how.",
    },
    players: ["jpmorgan", "goldman", "tradeweb", "dtcc", "euroclear", "bny"],
    quiz: [
      {
        q: "A government selling a brand new 10-year bond is a transaction in the:",
        options: ["Secondary market", "Primary market", "Derivatives market", "Repo market"],
        answer: 1,
        explain: "New issuance happens in the primary market; later trading happens in the secondary market.",
      },
      {
        q: "Which step legally transfers ownership of securities against cash?",
        options: ["Execution", "Confirmation", "Clearing", "Settlement"],
        answer: 3,
        explain: "Settlement at the CSD is when securities and cash actually move, ideally delivery-versus-payment.",
      },
    ],
  },
  {
    slug: "interest-rates-and-yield-curve",
    title: "Interest rates & the yield curve",
    track: "foundations",
    level: "Beginner",
    minutes: 14,
    summary:
      "Time value of money, policy rates, overnight benchmarks (SOFR, €STR, SONIA) and how the yield curve prices everything.",
    objectives: [
      "Discount a future cash flow to a present value",
      "Explain how central banks steer overnight rates",
      "Read a yield curve and name the major risk-free rates",
    ],
    blocks: [
      { type: "h", text: "Time value of money" },
      {
        type: "p",
        text: "€100 today is worth more than €100 in a year because you could invest it. The **present value** of a future cash flow CF received in t years at rate r is `PV = CF / (1 + r)^t`. Every bond, loan and fund valuation is built on this one formula.",
      },
      {
        type: "example",
        title: "Worked example",
        lines: [
          "You will receive €1,000 in 3 years. The 3-year rate is 3%.",
          "PV = 1,000 / (1.03)^3 = 1,000 / 1.0927",
        ],
        result: "PV ≈ €915.14",
      },
      { type: "h", text: "How central banks set the price of money" },
      {
        type: "p",
        text: "Central banks set a **policy rate** and keep overnight market rates close to it with standing facilities: the Fed uses interest on reserve balances (IORB) and the overnight reverse repo facility (ON RRP); the ECB uses its deposit facility rate (DFR). Overnight benchmarks then transmit that rate into all other markets.",
      },
      {
        type: "table",
        caption: "Overnight risk-free reference rates (RFRs)",
        headers: ["Currency", "Benchmark", "Administrator", "Secured?"],
        rows: [
          ["USD", "SOFR", "Federal Reserve Bank of New York", "Yes (Treasury repo)"],
          ["EUR", "€STR", "European Central Bank", "No"],
          ["GBP", "SONIA", "Bank of England", "No"],
          ["CHF", "SARON", "SIX", "Yes (CHF repo)"],
          ["JPY", "TONA", "Bank of Japan", "No"],
          ["SGD", "SORA", "Monetary Authority of Singapore", "No"],
          ["HKD", "HONIA", "Treasury Markets Association", "No"],
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "The end of LIBOR",
        text: "After the LIBOR manipulation scandals, markets moved to transaction-based RFRs. Panel LIBOR settings ended by mid-2023, and SOFR is literally computed from overnight Treasury repo trades. This is why the repo market is the base of the USD rate structure.",
      },
      { type: "h", text: "The yield curve" },
      {
        type: "p",
        text: "Plot government bond yields against maturity and you get the **yield curve**. Normally it slopes upward (investors want more to lock money away longer). An **inverted** curve, where short rates exceed long rates, has historically preceded recessions. The curve is the discounting base for pricing bonds, swaps and loans.",
      },
      {
        type: "list",
        items: [
          "**Level**: the general height of rates, driven by policy and inflation expectations.",
          "**Slope**: long minus short rates, e.g. 10y – 2y.",
          "**Term premium**: extra yield demanded for holding duration risk.",
        ],
      },
    ],
    bridge: {
      slug: "tokenized-money-market-funds",
      text: "Tokenized Treasury funds pass these overnight and T-bill yields on-chain. See how they work.",
    },
    players: ["fed", "ecb", "boe", "six"],
    quiz: [
      {
        q: "Which benchmark is calculated from overnight Treasury repo transactions?",
        options: ["€STR", "SONIA", "SOFR", "TONA"],
        answer: 2,
        explain: "SOFR (Secured Overnight Financing Rate) is based on overnight repo collateralised by US Treasuries.",
      },
      {
        q: "An inverted yield curve means:",
        options: [
          "Long rates are above short rates",
          "Short rates are above long rates",
          "All rates are negative",
          "The curve is flat at zero",
        ],
        answer: 1,
        explain: "Inversion is when short-term yields exceed long-term yields.",
      },
      {
        q: "PV of €1,100 in one year at 10% is:",
        options: ["€990", "€1,000", "€1,010", "€1,100"],
        answer: 1,
        explain: "1,100 / 1.10 = 1,000.",
      },
    ],
    sources: [
      { label: "NY Fed – SOFR", url: "https://www.newyorkfed.org/markets/reference-rates/sofr" },
      { label: "ECB – €STR", url: "https://www.ecb.europa.eu/stats/financial_markets_and_interest_rates/euro_short-term_rate/html/index.en.html" },
    ],
  },
  {
    slug: "risk-in-finance",
    title: "The risks that matter",
    track: "foundations",
    level: "Beginner",
    minutes: 11,
    summary:
      "Credit, counterparty, market, liquidity, operational and settlement risk, plus how collateral, CCPs and DvP each tackle one of them.",
    objectives: [
      "Define the six core risk types",
      "Map each post-trade mechanism to the risk it reduces",
      "Spot which risks tokenization reduces and which it introduces",
    ],
    blocks: [
      { type: "h", text: "Six risks" },
      {
        type: "table",
        headers: ["Risk", "Question it asks", "Typical mitigant"],
        rows: [
          ["Credit risk", "Will the issuer/borrower pay me back?", "Ratings, spreads, diversification"],
          ["Counterparty risk", "Will the other side of my trade perform?", "Collateral, CCP clearing, netting"],
          ["Market risk", "What if prices or rates move?", "Hedging, duration management, VaR limits"],
          ["Liquidity risk", "Can I get cash or sell quickly without a big loss?", "Liquidity buffers (LCR), repo access"],
          ["Operational risk", "What if people, systems or processes fail?", "Controls, automation, resilience (DORA)"],
          ["Settlement risk", "Will I deliver but not get paid?", "Delivery-versus-payment (DvP), PvP (CLS)"],
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "Herstatt risk",
        text: "In 1974 Bankhaus Herstatt was closed after receiving Deutsche Marks but before paying out US dollars. Its counterparties lost the full principal. This principal settlement risk is why CLS Bank (payment-versus-payment for FX) was created in 2002, and why atomic settlement is such a big promise of tokenization.",
      },
      { type: "h", text: "Mechanism to risk map" },
      {
        type: "list",
        items: [
          "**Haircuts and margin** reduce counterparty credit exposure in repo, sec lending and derivatives.",
          "**CCPs** replace bilateral counterparty risk with exposure to a heavily regulated central counterparty.",
          "**DvP** removes principal risk by linking securities delivery and payment.",
          "**Shorter settlement cycles (T+1)** cut the time window in which counterparties can default.",
        ],
      },
      {
        type: "compare",
        left: {
          title: "Risks tokenization can reduce",
          points: [
            "Settlement risk, via atomic DvP",
            "Operational/reconciliation risk, via a single shared record",
            "Intraday liquidity needs, via precise timing (e.g. intraday repo)",
            "Collateral immobility, via faster mobility across venues",
          ],
        },
        right: {
          title: "Risks tokenization introduces",
          points: [
            "Smart contract bugs and oracle failures",
            "Private key loss or theft (custody risk)",
            "Legal uncertainty about finality and ownership",
            "Liquidity fragmentation across chains; stablecoin issuer risk",
          ],
        },
      },
    ],
    bridge: {
      slug: "atomic-settlement-and-dlt-fmi",
      text: "See how atomic DvP on a shared ledger tackles settlement risk.",
    },
    players: ["cls", "lch", "dtcc"],
    quiz: [
      {
        q: "Which risk does delivery-versus-payment (DvP) primarily remove?",
        options: ["Market risk", "Principal settlement risk", "Interest rate risk", "Model risk"],
        answer: 1,
        explain: "DvP ensures securities move only if cash moves, removing the risk of losing the full principal.",
      },
      {
        q: "Which is a risk introduced rather than reduced by tokenization?",
        options: ["Reconciliation breaks", "Private key compromise", "Settlement fails from manual errors", "Herstatt risk"],
        answer: 1,
        explain: "Key management becomes a new, critical risk for tokenized assets.",
      },
    ],
  },
];
