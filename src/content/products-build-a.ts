import type { BuildRecipe } from "./types";

/**
 * "How would you actually build this tokenized?" recipes.
 * Phase ids are shared across all products: legal, ledger, identity, cash,
 * custody, lifecycle, interop, controls.
 */
export const buildA: Record<string, BuildRecipe> = {
  "central-bank-reserves": {
    goal: "Put central bank money on a ledger, or link a ledger to the RTGS system that already holds it.",
    prereqs: [
      { label: "A central bank willing to run or connect to the platform" },
      { label: "A DLT settlement venue to serve", product: "tokenized-bond" },
    ],
    steps: [
      {
        id: "legal",
        title: "Establish the legal basis",
        do: [
          "Confirm the central bank's statute allows issuing a liability in token form, or restrict the design to a payment trigger that leaves reserves where they are",
          "Designate the system under settlement finality law (in the EU, the Settlement Finality Directive) so transfers cannot be unwound in insolvency",
          "Define who may hold the token: banks only, or also non-bank FMIs",
        ],
        decide: "Issue a real wholesale CBDC, or keep reserves in RTGS and trigger payments from the ledger.",
        watch: "A trigger solution is far quicker to launch; a true token is what enables full atomic settlement.",
      },
      {
        id: "ledger",
        title: "Choose the platform model",
        do: [
          "Decide whether the central bank operates the ledger (Helvetia: wCBDC issued onto SDX) or connects to third-party ledgers (Pontes, Bundesbank trigger)",
          "Specify access: direct accounts versus an omnibus account held by the operator (the Bank of England model used by Fnality)",
          "Fix operating hours, because 24/7 tokenized markets will otherwise stall when RTGS closes",
        ],
      },
      {
        id: "identity",
        title: "Set participation rules",
        do: [
          "Reuse existing RTGS eligibility criteria rather than inventing new ones",
          "Map each participant's wallet to its legal entity identifier and RTGS account",
          "Agree monitoring and reporting duties with the overseer",
        ],
      },
      {
        id: "lifecycle",
        title: "Build issuance and redemption",
        do: [
          "Mint on receipt of reserves; burn and return to the RTGS account at end of day or on demand",
          "Automate the end-of-day sweep so no balance is stranded on the ledger overnight",
          "Model intraday liquidity: gross settlement without netting needs more of it",
        ],
        watch: "Balances trapped on a ledger after cut-off are an operational incident, not a rounding error.",
      },
      {
        id: "interop",
        title: "Link to securities settlement",
        do: [
          "Implement atomic DvP with the securities platform (single ledger, hash-time-locked contracts, or a trigger to RTGS)",
          "Test the failure path: what happens when the asset leg succeeds and the cash leg times out",
        ],
      },
      {
        id: "controls",
        title: "Prove resilience before go-live",
        do: [
          "Meet the PFMI expectations the central bank applies to any settlement system it oversees",
          "Run a real-value pilot with capped volumes and named participants",
          "Publish the exit plan: how the market keeps settling if the platform is switched off",
        ],
      },
    ],
    mvp: "A trigger solution: keep reserves in RTGS and let a smart-contract event instruct a normal payment. Germany's Bundesbank did exactly this for Siemens' €300m bond.",
    hard: "Not the technology. It is a policy question about who gets access to central bank money, and central banks move slowly and deliberately on that.",
    precedents: [
      { what: "SNB Project Helvetia: real wholesale CBDC on SDX since Dec 2023", players: ["snb", "sdx"] },
      { what: "Bundesbank trigger solution in the 2024 ECB trials", players: ["bundesbank", "ecb"] },
      { what: "Fnality: bank-owned system backed by a BoE omnibus account", players: ["fnality", "boe"] },
    ],
  },

  "bank-deposit": {
    goal: "Represent ordinary bank deposits as tokens so they can move 24/7 and settle atomically against tokenized assets.",
    prereqs: [
      { label: "A licensed bank (this is a bank liability, not a new instrument)" },
      { label: "Core banking integration so the ledger and the general ledger never disagree" },
    ],
    steps: [
      {
        id: "legal",
        title: "Confirm it is still a deposit",
        do: [
          "Get written supervisory comfort that the token is the deposit, not a new instrument, so deposit insurance and banking rules carry over",
          "Update account terms and conditions to cover token transfers, finality and cut-offs",
          "Decide which legal entities and jurisdictions are in scope (branch versus subsidiary matters for insurance)",
        ],
        watch: "If the token looks like e-money or a stablecoin to the regulator, you inherit a different rulebook (MiCA, GENIUS Act).",
      },
      {
        id: "ledger",
        title: "Pick the ledger and standard",
        do: [
          "Start on a permissioned ledger you operate (Kinexys, Citi Token Services) to keep balances private",
          "Use an account-based model that mirrors core banking, not bearer-style tokens",
          "Plan for a public-chain version later if clients want DeFi interoperability (JPMD on Base is the precedent)",
        ],
        decide: "Private control and privacy now, or public reach and composability later.",
      },
      {
        id: "identity",
        title: "Reuse the bank's KYC",
        do: [
          "Whitelist wallets per onboarded client; no anonymous holders",
          "Run sanctions screening on every transfer, not just at onboarding",
          "Keep the travel rule in scope if tokens can ever leave the bank's own ledger",
        ],
      },
      {
        id: "lifecycle",
        title: "Build mint, move and burn",
        do: [
          "Mint on debit of the client's normal account; burn on credit back",
          "Reconcile the token ledger to the core banking ledger continuously, not overnight",
          "Add programmable payments: pay on delivery, scheduled sweeps, conditional escrow",
        ],
        watch: "Two records of the same deposit is exactly the reconciliation problem tokenization is meant to remove. Make one of them authoritative.",
      },
      {
        id: "interop",
        title: "Solve bank-to-bank transfer",
        do: [
          "Define what happens when a client pays a client of another bank: burn and settle in central bank money, or join a shared network (Partior, Fnality)",
          "Support ISO 20022 messages so the payment still looks normal to everything downstream",
        ],
        watch: "A deposit token that only works inside one bank is a closed-loop cash pool, not a payment system.",
      },
      {
        id: "controls",
        title: "Operational readiness",
        do: [
          "Set exposure and velocity limits for the first clients",
          "Run 24/7 support and liquidity coverage, since the token does not sleep but treasury desks do",
          "Test the emergency stop: freeze, reverse (or compensate), and communicate",
        ],
      },
    ],
    mvp: "Intragroup treasury: one corporate client moving cash between its own subsidiaries on the bank's ledger, outside banking hours.",
    hard: "Interoperability between banks. Each deposit token is a different issuer's liability, so they do not exchange one-for-one without a settlement mechanism behind them.",
    precedents: [
      { what: "Kinexys (JPM Coin) processing billions a day in deposit token payments", players: ["kinexys", "jpmorgan"] },
      { what: "Citi Token Services for 24/7 cross-border treasury", players: ["citi"] },
      { what: "Partior: multi-bank settlement network", players: ["partior", "dbs", "standardchartered"] },
    ],
  },

  "rtgs-payment": {
    goal: "Give a tokenized market access to final settlement in central bank money without rebuilding the RTGS system.",
    prereqs: [{ label: "Central bank cooperation" }, { label: "A DLT platform with real transactions to settle" }],
    steps: [
      {
        id: "legal",
        title: "Anchor finality",
        do: [
          "Establish which record is legally final: the RTGS booking, not the ledger entry, in a trigger design",
          "Document the moment of finality in the system rules so courts and insolvency practitioners can follow it",
        ],
      },
      {
        id: "ledger",
        title: "Choose the linking pattern",
        do: [
          "Trigger: the ledger emits an instruction, RTGS makes the payment (Bundesbank)",
          "Hash-link: lock the asset until proof of payment is revealed (Banca d'Italia TIPS Hash-Link)",
          "Full DLT: issue central bank money onto the ledger (Banque de France, SNB)",
        ],
        decide: "Trigger is fastest to build; hash-links keep both systems independent; full DLT gives true atomicity.",
      },
      {
        id: "cash",
        title: "Handle timing",
        do: [
          "Extend or align operating hours, or buffer trades that arrive after cut-off",
          "Plan intraday liquidity: gross settlement consumes far more cash than netted batches",
        ],
        watch: "A 24/7 ledger connected to a 10-hour payment system settles on the payment system's clock, not yours.",
      },
      {
        id: "interop",
        title: "Speak the existing language",
        do: [
          "Use ISO 20022 messages so the payment is indistinguishable from any other to downstream systems",
          "Map each ledger participant to a BIC and account at the central bank",
        ],
      },
      {
        id: "controls",
        title: "Test the unhappy paths",
        do: [
          "Simulate: payment succeeds, ledger confirmation lost; payment fails, asset already delivered",
          "Agree the reconciliation and compensation process in the rulebook before go-live",
        ],
      },
    ],
    mvp: "One issuance, one currency, a handful of banks, with the central bank in the room, exactly how the 2024 Eurosystem trials were run.",
    hard: "Operating hours and liquidity, not cryptography. Central bank money is only available when the central bank's system is open.",
    precedents: [
      { what: "Eurosystem 2024 DLT settlement trials: 60+ participants, three solutions", players: ["ecb", "bundesbank", "banquedefrance", "bancaditalia"] },
      { what: "ECB Pontes: a permanent DLT-to-TARGET link, pilot planned for 2026", players: ["ecb"] },
    ],
  },

  "correspondent-payment": {
    goal: "Replace a chain of correspondent banks with a shared ledger where both currencies move at once.",
    prereqs: [
      { label: "Tokenized cash in at least two currencies", product: "tokenized-deposit" },
      { label: "Banks in both jurisdictions willing to join the same network" },
    ],
    steps: [
      {
        id: "legal",
        title: "Get the network rulebook right",
        do: [
          "Draft one multilateral agreement covering finality, liability, error handling and governing law across jurisdictions",
          "Confirm each participant's local regulator accepts settlement on the shared network",
        ],
        watch: "Cross-border legal certainty, not throughput, is what kills these projects.",
      },
      {
        id: "ledger",
        title: "Build the shared network",
        do: [
          "Choose a permissioned ledger with strong privacy: banks cannot see each other's flows",
          "Model each currency as a token issued by a bank licensed in that currency",
          "Design payment-versus-payment so both legs move atomically and Herstatt risk disappears",
        ],
      },
      {
        id: "identity",
        title: "Keep compliance ahead of speed",
        do: [
          "Embed travel-rule data in the transaction, not in a separate message that can arrive later",
          "Run sanctions screening before the atomic swap, since afterwards there is nothing to stop",
          "Agree a common data standard so screening results are portable between members",
        ],
        watch: "Instant settlement removes the window in which compliance teams traditionally intervene.",
      },
      {
        id: "cash",
        title: "Fund the network",
        do: [
          "Decide how banks pre-fund positions and how they convert back to RTGS money",
          "Provide an FX mechanism: a market maker, an auction, or linked central bank money (mBridge, Agorá)",
        ],
      },
      {
        id: "interop",
        title: "Keep the old rails working",
        do: [
          "Accept and emit ISO 20022 so clients and downstream systems see a normal payment",
          "Support fallback to correspondent banking when the destination is not on the network",
        ],
      },
      {
        id: "controls",
        title: "Prove the economics",
        do: [
          "Measure end-to-end cost against Swift gpi, not against the worst legacy case",
          "Start on one corridor with real volume before adding currencies",
        ],
      },
    ],
    mvp: "One corridor, two currencies, a handful of banks, settling intragroup flows first (Partior began with SGD and USD).",
    hard: "Network effects. A payment network is worthless until the other side joins, which is why bank consortia and central banks lead these.",
    precedents: [
      { what: "Partior: JPMorgan, DBS, Standard Chartered and Temasek", players: ["partior", "jpmorgan", "dbs"] },
      { what: "BIS Project Agorá: 7 central banks and 40+ firms on a unified ledger", players: ["bis"] },
      { what: "Swift's blockchain-based shared ledger announced in 2025", players: ["swift"] },
    ],
  },

  stablecoin: {
    goal: "Issue a token that is always redeemable one-for-one for fiat, under a regulator that supervises you.",
    prereqs: [{ label: "A licence or licensed issuing entity" }, { label: "A reserve manager and a banking relationship" }],
    steps: [
      {
        id: "legal",
        title: "Pick the regime and get licensed",
        do: [
          "Choose the jurisdiction: US GENIUS Act, EU MiCA (EMT), Hong Kong Stablecoins Ordinance, MAS, Japan PSA",
          "Establish a bankruptcy-remote structure so reserves are not part of your estate if you fail",
          "Write redemption rights into the terms: who can redeem, at what price, in how many days",
        ],
        watch: "Under most regimes you cannot pay interest to holders; the yield stays with the issuer.",
      },
      {
        id: "cash",
        title: "Build the reserve",
        do: [
          "Hold cash, short T-bills, government repo and MMFs only, matched to redemption expectations",
          "Split custody across several banks; SVB showed what single-bank concentration does to a peg",
          "Publish monthly attestations and, ideally, daily holdings",
        ],
        decide: "Yield versus liquidity: reaching for duration is how stablecoins break.",
      },
      {
        id: "ledger",
        title: "Deploy the contracts",
        do: [
          "Use a standard, audited token contract with pause, freeze and blacklist functions",
          "Deploy natively on each chain rather than bridging, and use a burn-and-mint transfer protocol between them",
          "Separate minting keys from admin keys, with multi-signature control and timelocks",
        ],
      },
      {
        id: "identity",
        title: "Control the perimeter",
        do: [
          "KYC every direct minter and redeemer; screen wallets continuously",
          "Build the legal and operational process for freezing addresses on law-enforcement request",
          "Implement travel-rule messaging with exchange partners",
        ],
      },
      {
        id: "lifecycle",
        title: "Run mint and redeem operations",
        do: [
          "Automate mint on fiat receipt and burn on redemption, with same-day settlement targets",
          "Keep a liquidity buffer for redemption spikes; model a 20% day",
          "Monitor secondary market price and be ready to arbitrage the peg yourself",
        ],
      },
      {
        id: "controls",
        title: "Audit and disclose",
        do: [
          "Get contracts audited by two independent firms and run a bug bounty",
          "Publish reserve composition, attestations and the redemption policy prominently",
          "Rehearse a depeg: comms, redemption capacity, banking backup",
        ],
      },
    ],
    mvp: "A single-chain, institution-only token with daily mint and redeem windows and a fully T-bill reserve.",
    hard: "Distribution and trust, not issuance. Anyone can mint a token; getting exchanges, market makers and treasurers to hold it is the business.",
    precedents: [
      { what: "Circle's USDC: regulated issuance with published reserves", players: ["circle"] },
      { what: "Paxos issuing PYUSD for PayPal under NYDFS supervision", players: ["paxos", "paypal"] },
      { what: "SG-FORGE EURCV: a bank-issued, MiCA-compliant euro token", players: ["sgforge"] },
    ],
  },

  "tokenized-deposit": {
    goal: "Give corporate clients programmable, 24/7 bank money that stays inside banking regulation.",
    prereqs: [{ label: "A bank licence and core banking integration" }, { label: "Clients with a real 24/7 or intraday need" }],
    steps: [
      {
        id: "legal",
        title: "Keep it a deposit",
        do: [
          "Confirm with the supervisor that tokenisation does not change the liability's legal nature",
          "Document finality on the bank's ledger and the cut-off for conversion back to RTGS money",
        ],
      },
      {
        id: "ledger",
        title: "Run the ledger",
        do: [
          "Deploy a permissioned ledger with per-client privacy, or a public chain with a permissioned token if clients need DeFi access",
          "Model balances per legal entity and per currency",
        ],
      },
      {
        id: "identity",
        title: "Onboard wallets like accounts",
        do: [
          "Treat each wallet as an account: KYC, mandates, authorised signatories, limits",
          "Apply the same screening and monitoring as normal payments",
        ],
      },
      {
        id: "lifecycle",
        title: "Add programmability",
        do: [
          "Build conditional payments: release on delivery, on document match, or at a set time",
          "Offer automated sweeps between entities and currencies",
          "Expose an API so treasury systems (SAP, Kyriba) can drive it",
        ],
        watch: "The selling point is the condition, not the token. Start from a treasury pain point, not the technology.",
      },
      {
        id: "interop",
        title: "Connect outward",
        do: [
          "Settle inter-bank legs in central bank money or through a shared network",
          "Support ISO 20022 and normal statement reporting so accounting does not change",
        ],
      },
      {
        id: "controls",
        title: "Operate it around the clock",
        do: [
          "Staff 24/7 support and intraday liquidity monitoring",
          "Set client limits and a kill switch, and test both",
        ],
      },
    ],
    mvp: "One multinational client sweeping cash between two of its own subsidiaries at the weekend.",
    hard: "Proving the savings. Treasurers will not re-plumb for novelty; they move for trapped liquidity, cut-off times or working capital.",
    precedents: [
      { what: "Kinexys Digital Payments for corporate treasury", players: ["kinexys"] },
      { what: "HSBC Tokenised Deposit Service in the UK and Hong Kong", players: ["hsbc"] },
      { what: "Bank of Korea Project Hangang deposit-token pilot", players: ["bok"] },
    ],
  },

  "wholesale-cbdc": {
    goal: "Issue central bank money on a DLT so tokenized securities can settle in the safest asset.",
    prereqs: [{ label: "A central bank as issuer" }, { label: "A regulated DLT securities platform", product: "tokenized-bond" }],
    steps: [
      {
        id: "legal",
        title: "Authorise the issuance",
        do: [
          "Confirm the statutory power to issue a tokenized liability and to restrict who holds it",
          "Designate the platform under settlement finality legislation",
          "Set the policy frame: pilot with an end date, or permanent infrastructure",
        ],
      },
      {
        id: "ledger",
        title: "Choose where it lives",
        do: [
          "Issue onto an existing regulated DLT venue (Helvetia on SDX) rather than building a new one first",
          "Define minting against reserves already held, so money supply is unchanged",
        ],
      },
      {
        id: "identity",
        title: "Restrict holding",
        do: [
          "Limit holders to banks and FMIs with existing central bank accounts",
          "Publish eligibility criteria and the onboarding process",
        ],
      },
      {
        id: "lifecycle",
        title: "Automate the day",
        do: [
          "Mint at the start of the settlement window, redeem to reserves at the end",
          "Meter usage and report on velocity and balances for policy analysis",
        ],
      },
      {
        id: "controls",
        title: "Pilot with real value",
        do: [
          "Start with real but capped transactions and named participants",
          "Publish findings: these pilots are as much about policy learning as technology",
        ],
      },
    ],
    mvp: "A single bond settlement in real wholesale CBDC with two banks and a defined end date.",
    hard: "The policy question of extending central bank money onto new infrastructure, which most central banks will only do in bounded pilots.",
    precedents: [
      { what: "Project Helvetia III: real CHF wCBDC on SDX since Dec 2023", players: ["snb", "sdx"] },
      { what: "Banque de France's full-DLT settlement in the ECB trials", players: ["banquedefrance", "ecb"] },
    ],
  },

  "treasury-bill": {
    goal: "Give on-chain holders exposure to short government debt, usually through a fund wrapper rather than the bill itself.",
    prereqs: [
      { label: "A regulated fund or note structure", product: "tokenized-mmf" },
      { label: "A custodian for the underlying securities", product: "custody-service" },
    ],
    steps: [
      {
        id: "legal",
        title: "Choose the wrapper",
        do: [
          "Decide between a fund share class (BUIDL, BENJI), a note issued by an SPV, or a direct digital issuance by the treasury itself",
          "Confirm investor eligibility: qualified purchasers only, or retail-accessible",
        ],
        decide: "A fund wrapper can launch today; a natively digital bill needs the sovereign's own DMO and legal framework.",
      },
      {
        id: "ledger",
        title: "Issue the token",
        do: [
          "Use a permissioned token standard (ERC-3643 or similar) with allow-listed holders",
          "Deploy on chains where your investors already hold cash",
        ],
      },
      {
        id: "identity",
        title: "Onboard investors",
        do: [
          "Run KYC and accreditation checks; maintain an on-chain allow-list",
          "Block secondary transfers to unverified wallets at the contract level",
        ],
      },
      {
        id: "custody",
        title: "Hold the underlying",
        do: [
          "Appoint a regulated custodian for the bills; the token must be fully backed at all times",
          "Publish holdings and, ideally, a proof-of-reserve feed",
        ],
      },
      {
        id: "lifecycle",
        title: "Accrue and redeem",
        do: [
          "Choose accumulating (price rises) or distributing (new tokens daily) yield mechanics",
          "Define redemption: T+0 into stablecoin, or T+1 into fiat, with capacity limits",
        ],
      },
      {
        id: "controls",
        title: "Operate as a regulated product",
        do: [
          "Appoint a transfer agent and an auditor; file what the wrapper requires",
          "Monitor redemption capacity against the underlying market's settlement cycle",
        ],
        watch: "The token can trade 24/7, but the Treasury market settles T+1 and closes at weekends. Size the liquidity buffer for that gap.",
      },
    ],
    mvp: "A tokenized share class of an existing government MMF, sold to qualified investors on one chain.",
    hard: "Nothing technical: it is distribution, eligibility rules and being comfortable that on-chain redemptions can outrun the underlying market's settlement cycle.",
    precedents: [
      { what: "BlackRock BUIDL with Securitize as transfer agent", players: ["blackrock", "securitize"] },
      { what: "Franklin Templeton BENJI, the first US fund with an on-chain register", players: ["franklin"] },
      { what: "Superstate USTB", players: ["superstate"] },
    ],
  },

  "commercial-paper": {
    goal: "Issue short-term corporate debt directly onto a ledger, cutting the agent chain for a two-week instrument.",
    prereqs: [{ label: "A legal framework for digital debt (eWpG, DLT Act, or note documentation)" }, { label: "Investors with wallets and cash tokens" }],
    steps: [
      {
        id: "legal",
        title: "Set the issuance frame",
        do: [
          "Issue under an electronic securities law (Germany's eWpG) or as a note governed by English or Luxembourg law",
          "Appoint a crypto securities registrar if the law requires one",
          "Reuse the existing CP programme documentation where possible",
        ],
      },
      {
        id: "ledger",
        title: "Mint the paper",
        do: [
          "Encode face value, discount, maturity date and day count in the contract",
          "Keep denominations institutional; CP investors are funds and treasurers",
        ],
      },
      {
        id: "identity",
        title: "Restrict holders",
        do: [
          "Allow-list eligible investors; most CP is sold to professional investors only",
          "Automate eligibility checks at transfer, not just at issuance",
        ],
      },
      {
        id: "cash",
        title: "Settle the money",
        do: [
          "Pay on a DvP basis against a cash token, or use an RTGS trigger",
          "For same-day issuance, the cash leg must be available intraday",
        ],
        watch: "CP is issued and repaid within weeks; a slow cash leg removes the whole advantage.",
      },
      {
        id: "lifecycle",
        title: "Automate redemption",
        do: [
          "Repay at par automatically at maturity from a funded account",
          "Handle rollovers as burn-and-mint in one transaction",
        ],
      },
      {
        id: "interop",
        title: "Keep it recognisable",
        do: [
          "Obtain an ISIN so investors' systems, limits and reporting still work",
          "Provide standard settlement and accounting reporting to buyers",
        ],
      },
    ],
    mvp: "One issuer, one investor, a two-week note settled the same day on a digital post-trade platform.",
    hard: "Investor onboarding. A treasurer will not open a wallet for a two-week trade unless the platform already holds their other cash.",
    precedents: [
      { what: "Siemens digital commercial paper on Clearstream D7", players: ["siemens", "clearstream"] },
      { what: "Cashlink as BaFin-registered crypto securities registrar", players: ["cashlink"] },
    ],
  },

  "certificate-of-deposit": {
    goal: "Issue tradable bank term funding as a token, settled and transferred without the usual paperwork.",
    prereqs: [{ label: "A bank issuer" }, { label: "A digital issuance platform or registrar" }],
    steps: [
      { id: "legal", title: "Document the instrument", do: ["Issue under an electronic securities law or as a note; confirm treatment for liquidity ratios (LCR/NSFR)", "Check whether the token counts as a deposit for insurance purposes in each jurisdiction"] },
      { id: "ledger", title: "Mint with terms encoded", do: ["Encode principal, rate, term and day count", "Support partial transfers if investors expect secondary liquidity"] },
      { id: "identity", title: "Allow-list investors", do: ["Professional investors only in most markets", "Automate eligibility at transfer"] },
      { id: "cash", title: "Settle both legs", do: ["Pay against a deposit token or via RTGS trigger", "Automate interest at maturity"] },
      { id: "interop", title: "Fit existing workflows", do: ["Obtain an ISIN and feed normal position reporting", "Make sure treasury and risk systems can consume the position"] },
    ],
    mvp: "A single-bank programme where the bank's own corporate clients buy term CDs from their tokenized deposit balance.",
    hard: "There is little pain in today's CD market, so the business case has to come from bundling it with a tokenized cash and collateral offering.",
    precedents: [{ what: "Digital notes and CP on Clearstream D7 and SDX", players: ["clearstream", "sdx"] }],
  },

  "money-market-fund": {
    goal: "Move a regulated money market fund's share register on-chain so units settle instantly and can be pledged as collateral.",
    prereqs: [
      { label: "An existing regulated fund (do not build a new one first)" },
      { label: "A transfer agent willing to keep the register on a ledger" },
      { label: "A cash token for subscriptions", product: "stablecoin" },
    ],
    steps: [
      {
        id: "legal",
        title: "Work inside the fund's existing rules",
        do: [
          "Confirm with the regulator that an on-chain register satisfies record-keeping duties (SEC transfer agent rules, UCITS/AIFMD depositary duties)",
          "Amend the prospectus for the new share class, transfer restrictions and settlement mechanics",
          "Decide domicile: a US 1940 Act fund, a Luxembourg or Irish vehicle, a BVI fund, or a Singapore VCC",
        ],
        watch: "You are tokenizing the register, not the portfolio. The fund still buys ordinary T-bills and repo.",
      },
      {
        id: "ledger",
        title: "Choose chain and standard",
        do: [
          "Use a permissioned token standard with forced transfer and recovery for lost keys",
          "Launch on the chain where your investors' cash already sits, then expand multi-chain with a burn-and-mint bridge",
        ],
      },
      {
        id: "identity",
        title: "Build the allow-list",
        do: [
          "KYC and accredit every holder; encode eligibility (qualified purchaser, professional investor) in the contract",
          "Support forced transfers for court orders and sanctions",
        ],
      },
      {
        id: "cash",
        title: "Accept on-chain subscriptions",
        do: [
          "Accept stablecoin or fiat; define the cut-off and the NAV strike used for each",
          "Offer instant redemption into stablecoin via a liquidity provider if you want a 24/7 product",
        ],
        watch: "Instant on-chain redemption against a T+1 underlying market is a liquidity mismatch. Cap it and fund it.",
      },
      {
        id: "lifecycle",
        title: "Automate NAV and yield",
        do: [
          "Publish NAV to the chain through an oracle with clear failure behaviour if the feed stops",
          "Distribute yield daily as new tokens, or accumulate into the price",
        ],
      },
      {
        id: "interop",
        title: "Make the units useful",
        do: [
          "Get the token accepted as collateral by an exchange, CCP or bank counterparty: that is where the demand is",
          "Feed positions into fund accounting, custody reporting and investor statements",
        ],
      },
      {
        id: "controls",
        title: "Audit and monitor",
        do: [
          "Audit contracts; rehearse pausing transfers and recovering a lost wallet",
          "Monitor concentration: a few holders redeeming at once is the real stress case",
        ],
      },
    ],
    mvp: "A new share class of an existing government MMF, one chain, qualified purchasers only, daily subscriptions.",
    hard: "Getting the token accepted as collateral. Without that, you have rebuilt a fund that already worked fine.",
    precedents: [
      { what: "BlackRock BUIDL, largest tokenized Treasury fund", players: ["blackrock", "securitize"] },
      { what: "Franklin BENJI: first US fund with an on-chain register", players: ["franklin"] },
      { what: "BNY and Goldman mirroring MMF shares on GS DAP", players: ["bny", "goldman"] },
    ],
  },

  repo: {
    goal: "Exchange tokenized collateral for tokenized cash atomically, with tenors measured in hours.",
    prereqs: [
      { label: "Tokenized or ledger-encumbered collateral", product: "government-bond" },
      { label: "A cash token both parties accept", product: "tokenized-deposit" },
      { label: "Legal certainty over on-ledger title transfer" },
    ],
    steps: [
      {
        id: "legal",
        title: "Paper the trade",
        do: [
          "Use the GMRA with a digital assets annex: same title transfer, close-out netting and default rights",
          "Get a legal opinion that on-ledger transfer perfects title in each relevant jurisdiction",
          "Confirm the insolvency treatment: netting must survive a counterparty failure",
        ],
        watch: "Enforceability of on-ledger collateral is the single biggest blocker, not the code.",
      },
      {
        id: "ledger",
        title: "Represent the collateral",
        do: [
          "Either tokenize the security itself, or leave it at the custodian and tokenize the entitlement (the HQLAx model)",
          "Encode haircut, rate, start and end time, and the automatic unwind",
        ],
        decide: "Moving the security is cleaner; immobilising it at the custodian is far easier to launch.",
      },
      {
        id: "cash",
        title: "Provide the cash leg",
        do: [
          "Use deposit tokens, wCBDC or an RTGS trigger; stablecoins rarely satisfy bank treasury policy",
          "Ensure the cash token is available during the hours you intend to trade",
        ],
      },
      {
        id: "lifecycle",
        title: "Automate start, margin and unwind",
        do: [
          "Atomic delivery-versus-payment on the opening leg",
          "Automate margin calls against a price oracle, with a defined fallback if the feed fails",
          "Auto-unwind at maturity, computing interest to the minute",
        ],
      },
      {
        id: "interop",
        title: "Report like any other repo",
        do: [
          "Report under SFTR or the US regime as normal; regulators do not accept 'it was on a blockchain' as a reason not to report",
          "Feed positions into collateral, liquidity and capital systems",
        ],
      },
      {
        id: "controls",
        title: "Prove capital and risk treatment",
        do: [
          "Agree the capital treatment with your regulator (a tokenized government bond should remain Basel Group 1a)",
          "Set counterparty and platform limits; run the default simulation end to end",
        ],
      },
    ],
    mvp: "Intragroup intraday repo: two entities of the same bank, one collateral type, a four-hour tenor.",
    hard: "Legal enforceability of the collateral transfer, and getting a second bank to join. This is why the successful platforms started inside one institution.",
    precedents: [
      { what: "JPMorgan Kinexys intraday repo, live since 2020", players: ["kinexys", "jpmorgan"] },
      { what: "Broadridge DLR, trillions of dollars a month", players: ["broadridge"] },
      { what: "HQLAx collateral swaps without moving securities", players: ["hqlax", "deutscheboerse"] },
    ],
  },

  "tri-party-repo": {
    goal: "Make collateral mobile across custodians and time zones by moving ownership records, not securities.",
    prereqs: [{ label: "Participating custodians willing to immobilise assets" }, { label: "A shared eligibility and valuation engine" }],
    steps: [
      { id: "legal", title: "Create the legal link", do: ["Agree how an on-ledger transfer changes legal ownership while the security stays at the custodian", "Get opinions in each custodian's jurisdiction", "Define default rights: how the receiver takes possession if the giver fails"], watch: "This is the whole product. Without enforceable title, it is a messaging system." },
      { id: "ledger", title: "Build the registry", do: ["Record baskets and ownership on a permissioned ledger (HQLAx uses Corda)", "Support fractional transfer of a basket rather than individual ISINs"] },
      { id: "lifecycle", title: "Automate collateral management", do: ["Encode eligibility schedules, haircuts and concentration limits", "Automate daily revaluation, substitution and margin calls"] },
      { id: "interop", title: "Connect custodians", do: ["Integrate with each custodian's books so immobilisation is real and reconciled", "Connect to the trading platforms where the swaps are agreed"] },
      { id: "controls", title: "Operate as an FMI-grade service", do: ["Expect FMI-style scrutiny if volumes grow", "Test the default and unwind path with each custodian"] },
    ],
    mvp: "Two banks swapping one basket of government bonds for another across two custodians, with no securities moving.",
    hard: "Getting several custodians, who compete with each other, onto the same network.",
    precedents: [{ what: "HQLAx with Deutsche Börse, live collateral swaps", players: ["hqlax", "deutscheboerse"] }, { what: "Euroclear and Clearstream tokenized collateral work", players: ["euroclear", "clearstream"] }],
  },

  "securities-loan": {
    goal: "Automate lending, collateral and recalls on a shared ledger so both sides read the same record.",
    prereqs: [{ label: "Tokenized or ledger-tracked collateral", product: "tri-party-repo" }, { label: "Agent lender participation" }],
    steps: [
      { id: "legal", title: "Extend the GMSLA", do: ["Add a digital assets annex covering on-ledger title transfer and manufactured payments", "Confirm treatment of the borrower's collateral in insolvency"] },
      { id: "ledger", title: "Model the loan", do: ["Represent the loan, the collateral and the fee schedule as one contract", "Support open loans with daily reprice and recall"] },
      { id: "identity", title: "Keep lender permissions", do: ["Encode each beneficial owner's restrictions (no lending over record dates, approved borrower lists)", "Preserve the agent lender's discretion"] },
      { id: "lifecycle", title: "Automate the hard parts", do: ["Manufactured dividends paid automatically on the ex-date", "Recall and return with deadline enforcement", "Daily mark-to-market and margin movement"], watch: "Corporate actions during a loan are where the manual errors are; automate them first." },
      { id: "interop", title: "Standardise the data", do: ["Adopt a common data model (EquiLend 1Source, ISLA's CDM work) so both sides stop reconciling", "Report under SFTR and SEC Rule 10c-1a"] },
      { id: "controls", title: "Protect the beneficial owner", do: ["Prove segregation of collateral", "Model the reinvestment risk if cash collateral is accepted; AIG is the cautionary tale"] },
    ],
    mvp: "One agent lender and one borrower running a small book on a shared ledger, with automated recalls.",
    hard: "The industry already has working plumbing and thin margins, so the case rests on data standardisation and fewer breaks rather than speed.",
    precedents: [{ what: "EquiLend 1Source shared lifecycle record", players: ["equilend"] }, { what: "HQLAx for the collateral leg", players: ["hqlax"] }],
  },

  "fx-swap": {
    goal: "Settle both currency legs simultaneously on a shared ledger, removing Herstatt risk.",
    prereqs: [{ label: "Tokenized cash in both currencies", product: "tokenized-deposit" }, { label: "Both counterparties on the same network" }],
    steps: [
      { id: "legal", title: "Document PvP", do: ["Amend the FX master agreement to cover on-ledger settlement and finality", "Confirm netting still works across both legs in insolvency"] },
      { id: "ledger", title: "Implement atomic PvP", do: ["Swap both currency tokens in one transaction, or hash-link two ledgers", "Encode the near and far legs, with the far leg time-locked"] },
      { id: "cash", title: "Source both currencies", do: ["Each leg needs an issuer licensed in that currency", "Pre-fund or arrange intraday liquidity on both sides"], watch: "Atomic settlement means no netting, so both sides need the full amount at the moment of settlement." },
      { id: "identity", title: "Screen before settlement", do: ["Run sanctions checks pre-trade; there is no window to intervene afterwards"] },
      { id: "controls", title: "Measure against CLS", do: ["Compare cost and risk against CLS, which already provides PvP for major currencies", "Target currencies and hours CLS does not cover: that is the real gap"] },
    ],
    mvp: "One currency pair, two banks, intragroup or a single corridor, during the hours both cash tokens exist.",
    hard: "CLS already solves this for the major pairs. The opportunity is in emerging-market currencies and out-of-hours settlement.",
    precedents: [{ what: "Partior multi-currency atomic settlement", players: ["partior"] }, { what: "BIS Agorá and mBridge cross-currency work", players: ["bis"] }],
  },

  "margin-loan": {
    goal: "Finance a portfolio against tokenized collateral with real-time margining.",
    prereqs: [{ label: "Tokenized collateral with reliable prices" }, { label: "A prime broker or lending desk" }],
    steps: [
      { id: "legal", title: "Set the security interest", do: ["Confirm how a pledge or title transfer over tokens is perfected in the governing jurisdiction", "Agree rehypothecation rights explicitly"] },
      { id: "ledger", title: "Lock the collateral", do: ["Use a smart contract that holds collateral and enforces the loan-to-value limit", "Support multiple collateral types with per-asset haircuts"] },
      { id: "lifecycle", title: "Automate margining", do: ["Continuous mark-to-market with oracle prices and a stale-price fallback", "Automated margin calls with a grace period, then liquidation"], watch: "Automated liquidation at scale can cascade. Add circuit breakers and partial liquidation." },
      { id: "identity", title: "Keep it institutional", do: ["Allow-list borrowers, run credit assessment as usual", "Set per-client and aggregate exposure limits"] },
      { id: "controls", title: "Stress it", do: ["Model a 30% collateral drop with thin liquidity", "Rehearse the liquidation waterfall and who buys the collateral"] },
    ],
    mvp: "Lending stablecoins against tokenized MMF shares for a small set of known clients.",
    hard: "Pricing and liquidating collateral in stress, exactly as in traditional prime brokerage, but faster.",
    precedents: [{ what: "Crypto venues accepting BUIDL and USYC as margin", players: ["blackrock", "circle"] }, { what: "JPMorgan TCN pledging tokenized MMF shares", players: ["kinexys", "blackrock"] }],
  },

  "government-bond": {
    goal: "Issue sovereign debt natively on a ledger, settled in central bank money.",
    prereqs: [{ label: "A debt management office willing to issue" }, { label: "Central bank money on or linked to the ledger", product: "wholesale-cbdc" }],
    steps: [
      { id: "legal", title: "Create the legal basis", do: ["Ensure national law recognises the ledger as the register of a government security (Switzerland's DLT Act, Germany's eWpG, the UK's DSS)", "Confirm eligibility as HQLA, central bank collateral and repo collateral: if it is not eligible, nobody will buy it"], watch: "If the bond is not eligible for liquidity buffers and repo, it prices worse than the paper version." },
      { id: "ledger", title: "Choose the venue", do: ["Use a regulated DLT CSD or sandbox venue (SDX, the UK's Digital Securities Sandbox)", "Decide public versus permissioned: sovereign issues have favoured permissioned so far"] },
      { id: "identity", title: "Keep primary dealers in place", do: ["Onboard existing primary dealers as ledger participants", "Preserve auction mechanics rather than reinventing distribution"] },
      { id: "cash", title: "Settle in the safest asset", do: ["Use wholesale CBDC or an RTGS trigger; a sovereign issue settling in a stablecoin is a hard sell", "Automate coupon payments from the treasury account"] },
      { id: "interop", title: "Make it a normal bond downstream", do: ["Obtain an ISIN; feed index providers, custodians and risk systems", "Enable repo and central bank collateral use from day one"] },
      { id: "controls", title: "Plan for scale and exit", do: ["Publish how holders are made whole if the platform is retired", "Start small: pilots have been in the tens or hundreds of millions"] },
    ],
    mvp: "A short, small digital issue in a sandbox, sold to existing dealers, settled in central bank money.",
    hard: "Collateral eligibility and secondary liquidity. A bond that cannot be repo'd or held in an index is worth less to investors.",
    precedents: [
      { what: "Hong Kong Government tokenized green bonds (2023, 2024)", players: ["hkma", "goldman", "hsbc"] },
      { what: "UK DIGIT digital gilt pilot in the Digital Securities Sandbox", players: ["boe", "fca"] },
      { what: "World Bank and canton issues on SDX", players: ["worldbank", "sdx"] },
    ],
  },

  "corporate-bond": {
    goal: "Issue a corporate bond directly onto a ledger, with the register, paying agent and settlement collapsed into one platform.",
    prereqs: [{ label: "A legal framework for digital securities" }, { label: "A cash token or RTGS trigger for the settlement leg" }],
    steps: [
      {
        id: "legal",
        title: "Choose framework and documentation",
        do: [
          "Issue under an electronic securities law (eWpG), the Swiss DLT Act, Luxembourg blockchain laws, or as English-law notes",
          "Appoint a registrar where required, and define the register's legal status",
          "Prepare the prospectus or exemption analysis as for any other issue",
        ],
        decide: "Native issuance (the ledger is the register) or a digital twin (the ledger mirrors a CSD position).",
      },
      { id: "ledger", title: "Mint the bond", do: ["Encode coupon, day count, business day convention and redemption in the contract", "Choose the platform: bank-operated (GS DAP, HSBC Orion), CSD-operated (D7, D-FMI) or public chain"] },
      { id: "identity", title: "Allow-list the book", do: ["KYC investors and encode transfer restrictions (professional investors, jurisdictions)", "Integrate with bookrunners' allocation process"] },
      { id: "cash", title: "Settle the primary leg", do: ["Atomic DvP against a cash token, or trigger an RTGS payment on allocation", "Target T+0 or T+1 closing instead of the usual T+5"] },
      { id: "lifecycle", title: "Automate servicing", do: ["Pay coupons by smart contract from a funded account", "Handle early redemption, tax withholding and reporting"], watch: "Withholding tax and investor reporting are where automation quietly stops and humans start again." },
      { id: "interop", title: "Stay visible to the market", do: ["Obtain an ISIN and consider a listing for index eligibility", "Deliver positions and events to investors' custodians and accounting systems"] },
      { id: "controls", title: "Audit and document", do: ["Audit the contracts; keep a signed record of the terms outside the chain too", "Agree what happens if the platform fails: how holders prove entitlement"] },
    ],
    mvp: "A small, short-dated issue to a handful of known investors, on a platform your bank already operates.",
    hard: "Secondary liquidity. Almost all digital bonds are bought and held, so the saving is operational, not in the spread.",
    precedents: [
      { what: "Siemens €60m on Polygon (2023) and €300m with Bundesbank settlement (2024)", players: ["siemens", "bundesbank"] },
      { what: "EIB digital bonds on Ethereum, GS DAP and HSBC Orion", players: ["eib", "goldman", "hsbc"] },
      { what: "UBS CHF 375m dual-listed digital bond", players: ["ubs", "sdx"] },
    ],
  },

  "covered-bond": {
    goal: "Issue a covered bond digitally while keeping the cover pool's legal ring-fence intact.",
    prereqs: [{ label: "A covered bond programme and cover pool monitor" }, { label: "A digital issuance framework" }],
    steps: [
      { id: "legal", title: "Protect the dual recourse", do: ["Confirm the national covered bond law works with an electronic register", "Keep the cover pool monitor's role and reporting unchanged"], watch: "The whole value of a covered bond is its legal ring-fence. Do not let tokenisation weaken it." },
      { id: "ledger", title: "Issue the notes", do: ["Mint on a platform recognised by the covered bond framework", "Encode coupon and maturity; consider on-chain cover pool reporting"] },
      { id: "cash", title: "Settle and service", do: ["DvP against a cash token or RTGS trigger", "Automate coupons from the issuer's account"] },
      { id: "interop", title: "Keep eligibility", do: ["Preserve central bank collateral eligibility and LCR treatment", "Obtain an ISIN and rating as usual"] },
      { id: "controls", title: "Report the pool", do: ["Publish pool data on a fixed schedule; consider a verifiable on-chain feed", "Test the resolution path with the regulator"] },
    ],
    mvp: "A small tranche under an existing programme, issued digitally with everything else unchanged.",
    hard: "Investors buy covered bonds for legal certainty. Any novelty in the structure has to be demonstrably risk-neutral.",
    precedents: [{ what: "SG-FORGE €100m OFH covered bond on Ethereum (2019)", players: ["sgforge"] }],
  },

  "securitisation-abs": {
    goal: "Originate and securitise loans with the loan data on-chain, so investors see pool performance directly.",
    prereqs: [{ label: "Loan origination that can write to a ledger" }, { label: "An SPV and trustee structure" }],
    steps: [
      { id: "legal", title: "Keep the structure standard", do: ["Use a normal bankruptcy-remote SPV; tokenize the notes it issues, not the legal structure", "Confirm true sale and risk retention (5%) are satisfied"] },
      { id: "ledger", title: "Put the pool data on-chain", do: ["Record loans, payments and delinquencies at loan level (the Provenance/Figure model)", "Encode the waterfall so tranche payments compute automatically"] },
      { id: "identity", title: "Restrict the notes", do: ["Allow-list investors per tranche; some tranches are institutional only", "Automate transfer restrictions and lock-ups"] },
      { id: "lifecycle", title: "Automate servicing", do: ["Servicer writes collections to the ledger; waterfall distributes on schedule", "Publish pool performance continuously instead of monthly reports"], watch: "Garbage in, garbage out: on-chain data is only as good as the originator's underwriting." },
      { id: "interop", title: "Satisfy the market", do: ["Provide rating agency data in the format they require", "Meet disclosure rules (EU STS, US Reg AB) with the on-chain record as the source"] },
      { id: "controls", title: "Prove the data", do: ["Independent verification of loan data at origination", "Audit the waterfall contract against the legal documents line by line"] },
    ],
    mvp: "A single-originator pool of one loan type with on-chain loan records and off-chain notes.",
    hard: "Convincing investors and rating agencies to rely on the on-chain record rather than the traditional reporting stack.",
    precedents: [{ what: "Figure originating and securitising HELOCs on Provenance", players: ["figure", "provenance"] }, { what: "Centrifuge tokenized credit pools", players: ["centrifuge"] }],
  },

  "green-bond": {
    goal: "Issue a green bond where allocation and impact reporting are verifiable on the same ledger as the bond.",
    prereqs: [{ label: "A green bond framework and second-party opinion" }, { label: "A digital issuance platform", product: "tokenized-bond" }],
    steps: [
      { id: "legal", title: "Align to a standard", do: ["Follow the ICMA Green Bond Principles or the EU Green Bond Standard", "Obtain a second-party opinion on the framework as usual"] },
      { id: "ledger", title: "Issue and tag", do: ["Mint the bond with project metadata attached", "Consider linking disbursements to project milestones"] },
      { id: "lifecycle", title: "Automate reporting", do: ["Publish allocation and impact data on a fixed cadence, ideally from verified sources", "Use oracles for measured data (generation, emissions) where available"], watch: "On-chain data is not automatically true. The verification step still needs a trusted reporter." },
      { id: "cash", title: "Settle", do: ["DvP against central bank money or a cash token; most sovereign green digital bonds used wCBDC or a trigger"] },
      { id: "controls", title: "Prove the claim", do: ["Independent verification of impact figures", "Keep the audit trail from project data to published report"] },
    ],
    mvp: "A digital green bond with quarterly allocation reporting published to the ledger.",
    hard: "Impact measurement is a data problem, not a blockchain problem. The ledger makes reporting tamper-evident, not accurate.",
    precedents: [
      { what: "Hong Kong Government multi-currency tokenized green bonds", players: ["hkma", "hsbc"] },
      { what: "EIB Climate Awareness digital bonds", players: ["eib"] },
      { what: "ICMA's Bond Data Taxonomy for machine-readable bond terms", players: ["icma"] },
    ],
  },
};
