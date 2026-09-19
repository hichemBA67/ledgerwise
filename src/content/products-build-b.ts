import type { BuildRecipe } from "./types";

export const buildB: Record<string, BuildRecipe> = {
  "common-share": {
    goal: "Record company shares on a ledger as the legal register, not as a wrapper around a brokerage position.",
    prereqs: [
      { label: "Company law that recognises an electronic or DLT share register" },
      { label: "A registered transfer agent (in the US) or equivalent" },
    ],
    steps: [
      {
        id: "legal",
        title: "Make the ledger the register",
        do: [
          "Check the corporate law of the state or country of incorporation (Delaware allows DLT share ledgers; Germany's eWpG covers shares since 2023)",
          "Appoint a transfer agent that will maintain the register on-chain",
          "Decide whether shares are registered to identified holders or held through nominees",
        ],
        watch: "Voting, dividends and shareholder rights all attach to the register. If it is not legally the register, you have built a tracker, not a share.",
      },
      {
        id: "ledger",
        title: "Issue restricted tokens",
        do: [
          "Use a permissioned standard with forced transfer, freeze and recovery (courts order share transfers; code must comply)",
          "Encode transfer restrictions: lock-ups, accreditation, jurisdiction limits",
        ],
      },
      {
        id: "identity",
        title: "Know every shareholder",
        do: [
          "KYC each holder; maintain the allow-list as the register of members",
          "Support beneficial-owner reporting duties in each market",
        ],
      },
      {
        id: "lifecycle",
        title: "Automate corporate actions",
        do: [
          "Dividends paid directly to holders' wallets in a cash token",
          "Snapshot the register on the record date for votes and distributions",
          "Handle splits, buybacks and mergers as contract upgrades with governance",
        ],
      },
      {
        id: "interop",
        title: "Bridge to public markets",
        do: [
          "If the shares are listed, decide how the on-chain register reconciles with the CSD position",
          "Obtain an ISIN and feed market data and index providers",
        ],
        watch: "A dual register (CSD and chain) reintroduces exactly the reconciliation the token was meant to remove.",
      },
      {
        id: "controls",
        title: "Plan for lost keys and court orders",
        do: [
          "Document the recovery process for a shareholder who loses access",
          "Rehearse a forced transfer under a court order",
        ],
      },
    ],
    mvp: "A private company's cap table on-chain with a registered transfer agent, before touching listed equity.",
    hard: "Listed shares sit inside a national market structure (best execution, CSD, CCP). Private company shares are where native issuance actually works today.",
    precedents: [
      { what: "Superstate's Opening Bell for SEC-registered on-chain shares", players: ["superstate"] },
      { what: "Nasdaq's 2025 filing to trade tokenized securities", players: ["nasdaq"] },
    ],
  },

  "mutual-fund": {
    goal: "Move the fund's unitholder register on-chain so dealing settles instantly and units can move 24/7.",
    prereqs: [{ label: "An existing regulated fund" }, { label: "A transfer agent and depositary that will support it" }],
    steps: [
      { id: "legal", title: "Amend the fund documents", do: ["Add a tokenized share class to the prospectus with its own dealing terms", "Confirm the depositary's oversight duties are satisfied by an on-chain register (UCITS/AIFMD)", "Agree the treatment with the fund's auditor"] },
      { id: "ledger", title: "Tokenize the class", do: ["Permissioned token, one contract per share class and currency", "Support fractional units to match NAV-based dealing"] },
      { id: "identity", title: "Onboard through distributors", do: ["Keep the distributor's KYC; map investors to wallets", "Encode eligibility per class (retail, professional, jurisdiction)"] },
      { id: "cash", title: "Take on-chain subscriptions", do: ["Accept stablecoin or fiat with a clear cut-off and NAV point", "Decide the settlement cycle: T+0 on-chain versus the fund's T+2 underlying"], watch: "Faster dealing than the portfolio can trade creates a liquidity mismatch; that is what gates and swing pricing exist for." },
      { id: "lifecycle", title: "Automate dealing and distributions", do: ["Mint and burn units against NAV; publish NAV via an oracle", "Pay distributions to wallets, or accumulate"] },
      { id: "interop", title: "Keep reporting intact", do: ["Feed fund accounting, investor statements and tax reporting from the same record", "Connect to fund networks (Calastone, Swift) so traditional distributors still work"] },
      { id: "controls", title: "Test the boring things", do: ["Lost wallet recovery, forced transfer, class closure", "Reconcile on-chain units to the administrator's books daily"] },
    ],
    mvp: "One tokenized share class of an existing fund, sold through one distributor.",
    hard: "Distribution. Platforms and advisers have to support the new class, and their systems expect the old plumbing.",
    precedents: [
      { what: "Calastone tokenised distribution for existing funds", players: ["calastone"] },
      { what: "UBS uMINT and other tokenized fund classes", players: ["ubs"] },
      { what: "Securitize as on-chain transfer agent", players: ["securitize"] },
    ],
  },

  etf: {
    goal: "Represent ETF shares on-chain while keeping the creation and redemption mechanism that holds the price to NAV.",
    prereqs: [{ label: "An existing ETF and authorised participants" }, { label: "A venue where the token can trade" }],
    steps: [
      { id: "legal", title: "Decide the model", do: ["Tokenized share class of the fund itself, or a wrapper issued by a third party holding ETF shares", "Confirm exchange and listing rules allow the on-chain class"], decide: "A wrapper is fast but adds issuer risk; a real share class needs the ETF issuer and its regulator on board." },
      { id: "ledger", title: "Issue the token", do: ["Permissioned token with allow-listed holders and jurisdiction restrictions", "Fractional units, since ETF share prices are high relative to crypto tickets"] },
      { id: "lifecycle", title: "Preserve the arbitrage", do: ["Keep APs able to create and redeem in kind; otherwise the token drifts from NAV", "Publish an on-chain NAV or intraday indicative value feed"], watch: "Without a working creation/redemption link, the token trades at whatever the secondary market decides, which defeats the point." },
      { id: "cash", title: "Handle market hours", do: ["Decide what happens when the token trades while the underlying market is closed", "Widen spreads or pause trading out of hours rather than pretending prices are live"] },
      { id: "interop", title: "Keep the listing working", do: ["Reconcile the on-chain class with the CSD position", "Feed index providers and market data as normal"] },
      { id: "controls", title: "Monitor the premium", do: ["Track token price versus NAV continuously and publish it", "Have a plan to close the class if the arbitrage breaks"] },
    ],
    mvp: "A tokenized feeder holding a single liquid ETF, with published NAV and one market maker.",
    hard: "Keeping price and NAV together outside market hours, which is exactly when on-chain investors want to trade.",
    precedents: [{ what: "Backed's xStocks tokenized ETFs and equities", players: ["backed"] }, { what: "WisdomTree Connect digital funds", players: ["wisdomtree"] }],
  },

  "private-fund": {
    goal: "Tokenize fund interests so minimums fall and secondary transfers become possible.",
    prereqs: [{ label: "A feeder fund structure" }, { label: "An administrator willing to run an on-chain register" }],
    steps: [
      { id: "legal", title: "Build the feeder", do: ["Create a feeder vehicle that invests into the master fund; tokenize the feeder's interests", "Confirm eligibility rules: most jurisdictions still restrict private funds to professional or accredited investors", "Set transfer restrictions that match the fund's LPA"] },
      { id: "ledger", title: "Issue the interests", do: ["Permissioned tokens with lock-ups encoded", "Support capital calls and distributions as contract functions"] },
      { id: "identity", title: "Accreditation and AML", do: ["Verify investor status; re-verify on transfer", "Maintain a register the administrator recognises"] },
      { id: "lifecycle", title: "Automate calls and distributions", do: ["Issue capital call notices on-chain with a deadline; handle defaults per the LPA", "Distribute proceeds pro rata, net of carry"], watch: "Capital call defaults have real legal consequences. The contract must mirror the LPA exactly, not approximate it." },
      { id: "interop", title: "Enable secondary transfers", do: ["Permit peer-to-peer transfers between eligible investors with GP consent encoded", "Publish NAV from the administrator on a fixed cadence"] },
      { id: "controls", title: "Be honest about liquidity", do: ["Disclose that the underlying is illiquid and the token does not change that", "Avoid promising a secondary market you cannot provide"] },
    ],
    mvp: "A tokenized feeder into one existing fund, sold to qualified investors with a $10k minimum instead of $5m.",
    hard: "Liquidity mismatch and valuation. A quarterly-valued, decade-long asset does not become liquid because its register is on a chain.",
    precedents: [
      { what: "Hamilton Lane and Apollo feeders via Securitize", players: ["hamiltonlane", "apollo", "securitize"] },
      { what: "KKR's health care fund feeder on Avalanche", players: ["kkr", "avalanche"] },
    ],
  },

  futures: {
    goal: "Use tokenized assets as exchange margin, or run a futures-like contract on-chain.",
    prereqs: [{ label: "A CCP or venue that accepts the collateral" }, { label: "Reliable price feeds" }],
    steps: [
      { id: "legal", title: "Get the collateral accepted", do: ["Work with the CCP to add tokenized MMF shares or bonds to the eligible collateral schedule", "Agree haircuts and the legal path to seize collateral on default"], watch: "A CCP must be able to liquidate collateral in a default within hours. That is the bar for eligibility." },
      { id: "ledger", title: "Connect collateral to margin", do: ["Pledge or transfer tokens to the CCP's account with the custodian", "Automate the margin call to collateral movement loop"] },
      { id: "lifecycle", title: "Run variation margin", do: ["Support intraday and 24/7 calls if the venue trades outside banking hours", "Reconcile positions and collateral continuously"] },
      { id: "controls", title: "Model the default", do: ["Rehearse a member default including seizing and selling tokenized collateral", "Check the CCP's regulatory capital treatment of the new collateral type"] },
    ],
    mvp: "One CCP accepting one tokenized money market fund as initial margin, with conservative haircuts.",
    hard: "CCPs are conservative by design and regulated as systemically important. Collateral eligibility moves slowly and correctly so.",
    precedents: [
      { what: "CME tokenized collateral work with Google Cloud Universal Ledger", players: ["cme"] },
      { what: "JPMorgan TCN posting tokenized MMF shares as margin", players: ["kinexys", "blackrock"] },
    ],
  },

  option: {
    goal: "Write and settle option contracts on-chain with collateral locked in the contract.",
    prereqs: [{ label: "A reliable price oracle" }, { label: "A cash or collateral token" }],
    steps: [
      { id: "legal", title: "Classify the instrument", do: ["Options are regulated derivatives almost everywhere; confirm licensing before offering them", "Document it under an ISDA or the venue's rulebook"] },
      { id: "ledger", title: "Build the contract", do: ["Encode strike, expiry, exercise style and settlement (cash or physical)", "Lock the writer's collateral in the contract for the full obligation"] },
      { id: "lifecycle", title: "Settle at expiry", do: ["Use a price oracle with a time-weighted average to resist manipulation", "Auto-exercise in-the-money options to avoid user error"], watch: "Oracle manipulation at expiry is the classic on-chain attack. Use multiple sources and TWAPs." },
      { id: "identity", title: "Restrict participation", do: ["Allow-list eligible counterparties if you are regulated", "Set position limits"] },
      { id: "controls", title: "Margin properly", do: ["Fully collateralise writers, or build a margin engine with liquidation", "Stress-test gap moves through the strike"] },
    ],
    mvp: "Fully collateralised, cash-settled options on one asset with a single trusted oracle.",
    hard: "Margining. Fully collateralised options are capital-inefficient; partial margin needs a risk engine and a liquidation path.",
    precedents: [{ what: "Deribit and on-chain option protocols; institutional adoption remains limited", players: ["cboe"] }],
  },

  "interest-rate-swap": {
    goal: "Automate swap lifecycle events and post tokenized collateral for margin.",
    prereqs: [{ label: "ISDA documentation with a digital annex" }, { label: "Tokenized collateral", product: "tokenized-mmf" }],
    steps: [
      { id: "legal", title: "Extend the ISDA", do: ["Use ISDA's digital asset definitions and a CSA that recognises tokenized collateral", "Confirm close-out netting still holds with on-ledger collateral"] },
      { id: "ledger", title: "Model the trade", do: ["Use ISDA's Common Domain Model so both parties compute the same events", "Encode payment dates, resets and the floating index source"] },
      { id: "lifecycle", title: "Automate events", do: ["Compute resets from a benchmark oracle (SOFR, €STR) with a fallback", "Net and settle periodic payments automatically", "Automate margin calls and collateral movement"], watch: "Benchmark data licensing is a real constraint: the rate feeds are commercial products." },
      { id: "interop", title: "Report and clear", do: ["Report to trade repositories under EMIR or Dodd-Frank as normal", "For clearable swaps, route to the CCP; tokenization applies to collateral, not to the clearing mandate"] },
      { id: "controls", title: "Reconcile", do: ["Run portfolio reconciliation against the counterparty's system until you trust the shared record", "Test close-out with a simulated default"] },
    ],
    mvp: "Two dealers exchanging tokenized MMF shares as variation margin on an existing swap portfolio.",
    hard: "Cleared swaps already work well. The realistic win is collateral mobility and fewer reconciliation breaks, not the trade itself.",
    precedents: [{ what: "JPMorgan TCN: first live tokenized collateral for an OTC derivative", players: ["kinexys", "blackrock", "barclays"] }, { what: "ISDA's Common Domain Model", players: ["isda"] }],
  },

  "credit-default-swap": {
    goal: "Automate CDS premium payments and credit-event settlement with a verifiable trigger.",
    prereqs: [{ label: "ISDA documentation" }, { label: "An authoritative credit-event source" }],
    steps: [
      { id: "legal", title: "Keep ISDA determinations", do: ["A credit event is decided by ISDA's Determinations Committee, not by code", "Document how the committee's decision is fed to the contract"], watch: "Automating the trigger without an authoritative source is how you get disputes instead of settlement." },
      { id: "ledger", title: "Encode the contract", do: ["Premium schedule, notional, reference entity, maturity", "Escrow or margin the protection seller's obligation"] },
      { id: "lifecycle", title: "Automate the routine parts", do: ["Quarterly premium payments settle automatically", "On a determined credit event, settle at the auction-determined recovery"] },
      { id: "interop", title: "Report and clear", do: ["Index CDS is clearing-mandated; report as usual", "Feed positions into credit risk systems"] },
      { id: "controls", title: "Watch wrong-way risk", do: ["Do not accept collateral correlated with the reference entity", "Test the settlement path with a simulated default"] },
    ],
    mvp: "Automating premium flows and collateral on existing bilateral CDS, leaving determinations with ISDA.",
    hard: "Credit events are legal judgements about messy facts. That part does not automate.",
    precedents: [{ what: "ISDA CDM modelling of credit derivative events", players: ["isda", "ice"] }],
  },

  "fx-forward": {
    goal: "Lock a rate and settle both legs atomically at maturity.",
    prereqs: [{ label: "Tokenized cash in both currencies", product: "tokenized-deposit" }],
    steps: [
      { id: "legal", title: "Document it", do: ["Standard FX documentation plus an annex for on-ledger settlement", "Confirm netting across the FX portfolio still applies"] },
      { id: "ledger", title: "Encode the forward", do: ["Fix rate, amounts and value date; time-lock settlement", "Support early termination and rolls"] },
      { id: "cash", title: "Settle PvP at maturity", do: ["Atomic exchange of both currency tokens on the value date", "Pre-fund or arrange liquidity: atomic means gross"] },
      { id: "controls", title: "Margin the credit risk", do: ["Collateralise mark-to-market between trade and maturity, as CSAs do today", "Monitor concentration per counterparty"] },
    ],
    mvp: "Short-dated forwards between two banks already exchanging tokenized cash.",
    hard: "The credit exposure between trade date and value date still needs margining; tokenization only fixes the settlement moment.",
    precedents: [{ what: "Project Guardian FX and bond trades on public chains", players: ["mas", "dbs", "jpmorgan"] }],
  },

  "custody-service": {
    goal: "Safekeep tokenized assets to institutional standards: keys, segregation, servicing and audit.",
    prereqs: [{ label: "A custody licence or trust charter" }, { label: "Key management infrastructure (HSM or MPC)" }],
    steps: [
      {
        id: "legal",
        title: "Get the permissions",
        do: [
          "Obtain the right status: OCC national trust charter, NYDFS trust, MiCA CASP authorisation, or FINMA licence",
          "Structure for client asset segregation and bankruptcy remoteness",
          "Confirm the accounting treatment (post-SAB 122 in the US, client assets stay off balance sheet)",
        ],
      },
      {
        id: "custody",
        title: "Build key management",
        do: [
          "Choose HSM-based or MPC key generation and signing; no single person or machine should reconstruct a key",
          "Define hot, warm and cold tiers with different approval quorums",
          "Run a documented key ceremony with independent witnesses and recorded procedures",
        ],
        watch: "Key loss is unrecoverable. Backup, inheritance and disaster recovery must be tested, not documented and forgotten.",
      },
      {
        id: "identity",
        title: "Control who can move assets",
        do: [
          "Multi-person approval workflows mapped to client mandates",
          "Wallet allow-lists and per-address policy engines",
          "Full audit trail of every approval and signature",
        ],
      },
      {
        id: "lifecycle",
        title: "Service the assets",
        do: [
          "Collect on-chain income and distributions; handle token migrations and forks",
          "Support staking or governance participation only where the client mandates it",
          "Produce statements that reconcile to the chain",
        ],
      },
      {
        id: "interop",
        title: "Connect to the rest of the bank",
        do: [
          "Feed positions into the core custody platform so clients see one portfolio",
          "Run nodes or use a reputable provider for each supported chain",
        ],
      },
      {
        id: "controls",
        title: "Prove it to auditors",
        do: [
          "SOC 1 and SOC 2 reports, penetration tests, and insurance",
          "Proof-of-reserves reporting where clients expect it",
          "Rehearse an incident: key compromise, chain halt, contract exploit",
        ],
      },
    ],
    mvp: "Custody of one asset type on one chain for a small set of institutional clients, with cold storage and dual approval.",
    hard: "Operational rigour, not cryptography. Auditability, segregation and 24/7 operations are what make it institutional.",
    precedents: [
      { what: "BNY digital asset custody platform", players: ["bny"] },
      { what: "Anchorage Digital, a federally chartered crypto bank", players: ["anchorage"] },
      { what: "State Street and Deutsche Bank building on Taurus", players: ["statestreet", "taurus", "deutschebank"] },
    ],
  },

  "ccp-clearing": {
    goal: "Adapt central clearing to tokenized markets: accept tokenized collateral and clear tokenized instruments.",
    prereqs: [{ label: "An authorised CCP" }, { label: "Legally enforceable tokenized collateral" }],
    steps: [
      { id: "legal", title: "Extend the rulebook", do: ["Add tokenized instruments and collateral to the CCP's rules with regulator approval", "Confirm the default management process works when assets are on a ledger"], watch: "A CCP must be able to port or close out a defaulter's positions in hours. Any new asset must fit that timetable." },
      { id: "ledger", title: "Connect to the venues", do: ["Ingest trades from DLT venues in the CCP's format", "Decide whether netting happens on-ledger or in the CCP's engine"] },
      { id: "lifecycle", title: "Margin in real time", do: ["Support intraday and out-of-hours margin calls if the market trades 24/7", "Accept tokenized collateral with appropriate haircuts and concentration limits"] },
      { id: "controls", title: "Preserve the waterfall", do: ["Model how tokenized collateral is liquidated in a default auction", "Keep skin-in-the-game and default fund arrangements unchanged"] },
      { id: "interop", title: "Answer the netting question", do: ["Be explicit about the trade-off: atomic settlement removes netting, which increases liquidity needs", "Consider clearing forward-dated tokenized trades while leaving spot atomic"] },
    ],
    mvp: "Accepting one tokenized collateral type for margin, before clearing any tokenized instrument.",
    hard: "The existential question: if trades settle atomically there is nothing to clear. CCPs add most value for forward-dated risk and netting.",
    precedents: [{ what: "LCH DigitalAssetClear for crypto derivatives", players: ["lch"] }, { what: "Eurex accepting digital securities as collateral in D7 pilots", players: ["eurex", "clearstream"] }],
  },

  "csd-settlement": {
    goal: "Run a regulated settlement system where the ledger is the book of record.",
    prereqs: [{ label: "A CSD licence or a sandbox authorisation" }, { label: "Central bank money or a cash token on or beside the ledger" }],
    steps: [
      {
        id: "legal",
        title: "Get authorised",
        do: [
          "Apply under CSDR, the EU DLT Pilot Regime (DLT SS or TSS), the Swiss DLT Act, or the UK Digital Securities Sandbox",
          "Get the system designated under settlement finality law",
          "Accept the size caps that come with sandbox regimes and plan for growth beyond them",
        ],
      },
      { id: "ledger", title: "Build the settlement engine", do: ["Atomic DvP with the cash leg: same-ledger tokens, hash-links, or an RTGS trigger", "Support issuance (notary function) and account maintenance, not just transfer"] },
      { id: "identity", title: "Admit participants", do: ["Define participation criteria as for any CSD; map to LEIs and BICs", "Decide whether retail can hold directly, which the Pilot Regime permits"] },
      { id: "lifecycle", title: "Service the assets", do: ["Corporate actions, income, tax and reporting still have to happen", "Automate what you can and staff the rest"] },
      { id: "interop", title: "Link to traditional CSDs", do: ["Build a link so securities can move between the DLT platform and the legacy CSD", "Obtain ISINs and support standard messaging"], watch: "Without a link, the DLT venue is an island and investors need two sets of accounts." },
      { id: "controls", title: "Meet PFMI expectations", do: ["Operational resilience, cyber, business continuity and recovery plans at FMI standard", "Publish an orderly wind-down plan"] },
    ],
    mvp: "A sandbox venue issuing and settling one asset class for a handful of participants, with a link to the incumbent CSD.",
    hard: "Regulatory authorisation and liquidity. SDX has been live since 2021 and volumes are still modest, because markets follow liquidity, not technology.",
    precedents: [
      { what: "SIX Digital Exchange: licensed DLT CSD and exchange", players: ["sdx", "six"] },
      { what: "21X: first DLT TSS licensed under the EU Pilot Regime", players: ["21x", "bafin"] },
      { what: "Euroclear D-FMI and Clearstream D7", players: ["euroclear", "clearstream"] },
    ],
  },

  "fund-administration": {
    goal: "Run NAV, dealing and the unitholder register with the ledger as the shared source of truth.",
    prereqs: [{ label: "An administrator and transfer agent" }, { label: "Funds willing to move the register" }],
    steps: [
      { id: "legal", title: "Satisfy the record-keeping rules", do: ["Confirm the on-chain register meets transfer agent and depositary obligations", "Agree with auditors how they will verify on-chain positions"] },
      { id: "ledger", title: "Put the register on-chain", do: ["One contract per share class; fractional units", "Keep an authoritative off-chain backup of the register state"] },
      { id: "lifecycle", title: "Automate the daily cycle", do: ["Publish NAV to the chain with a signed feed; define behaviour if the feed fails", "Mint and burn units at the struck NAV; handle cut-offs and late orders explicitly"], watch: "NAV is the product. An oracle publishing a wrong NAV mints units at the wrong price, and unwinding that is painful." },
      { id: "interop", title: "Keep distribution working", do: ["Accept orders from existing fund networks and platforms", "Deliver contract notes, statements and tax data as today"] },
      { id: "controls", title: "Reconcile relentlessly", do: ["Daily reconciliation between chain, register and fund accounting", "Rehearse recovery of a lost investor wallet and a forced transfer"] },
    ],
    mvp: "One share class of one fund, dealing once a day, with the register on-chain and everything else unchanged.",
    hard: "Nothing is allowed to break. Administration is a zero-error business, so change lands as a parallel class rather than a migration.",
    precedents: [{ what: "Securitize as SEC-registered transfer agent for tokenized funds", players: ["securitize"] }, { what: "Calastone moving existing funds on-chain", players: ["calastone"] }],
  },

  "tokenized-bond": {
    goal: "Take a bond from term sheet to on-chain settlement and servicing, end to end.",
    prereqs: [
      { label: "A legal framework for digital securities" },
      { label: "A cash leg: wCBDC, deposit token or RTGS trigger", product: "wholesale-cbdc" },
      { label: "Investors able to hold tokens", product: "custody-service" },
    ],
    steps: [
      {
        id: "legal",
        title: "Choose the framework and the register",
        do: [
          "Pick the law: eWpG (Germany), the Swiss DLT Act, Luxembourg blockchain laws, or English-law notes with a contractual register",
          "Decide native issuance versus a digital twin of a CSD position",
          "Appoint the registrar and document who maintains the register if the platform fails",
        ],
        decide: "Native issuance gives the real operational savings; a twin is easier but keeps the old chain of records.",
      },
      {
        id: "ledger",
        title: "Pick the platform and mint",
        do: [
          "Choose a venue: bank platform (GS DAP, HSBC Orion), CSD platform (D7, D-FMI), DLT CSD (SDX), or a public chain under eWpG",
          "Encode the terms: coupon, day count, business day convention, redemption, ISIN",
          "Test the contract against the term sheet clause by clause",
        ],
      },
      {
        id: "identity",
        title: "Allow-list the investors",
        do: [
          "KYC every investor; map wallets to legal entities",
          "Encode transfer restrictions by jurisdiction and investor type",
          "Give bookrunners a way to allocate into those wallets",
        ],
      },
      {
        id: "cash",
        title: "Solve the cash leg early",
        do: [
          "Line up wholesale CBDC, a deposit token, or a central bank trigger before pricing",
          "If none is available, accept off-chain payment and lose atomicity, which most early deals did",
          "Confirm the cash leg is available on the intended settlement day and hour",
        ],
        watch: "This is the step that decides whether the deal is genuinely atomic or just a ledger with a normal payment beside it.",
      },
      {
        id: "lifecycle",
        title: "Automate coupons and redemption",
        do: [
          "Fund and pay coupons by contract; handle non-business days correctly",
          "Automate redemption and burn at maturity",
          "Decide how tax withholding is handled, because it rarely automates cleanly",
        ],
      },
      {
        id: "interop",
        title: "Make it look normal",
        do: [
          "Obtain an ISIN (and a DTI for the token); feed data vendors and index providers",
          "Deliver positions and events to investors' custodians and accounting systems",
          "Aim for central bank collateral and repo eligibility if you want secondary demand",
        ],
      },
      {
        id: "controls",
        title: "Audit, rehearse, then price",
        do: [
          "Independent smart contract audit and a dry run with test wallets",
          "Document the fallback: how holders prove entitlement if the platform is unavailable",
          "Keep the first deal small and short-dated",
        ],
      },
    ],
    mvp: "A €50–100m, one to three year bond to a club of known investors, on a platform your bank or CSD already runs.",
    hard: "The cash leg and secondary liquidity. Everything else has been done repeatedly since 2021.",
    precedents: [
      { what: "EIB: serial digital bond issuer since 2021", players: ["eib", "goldman", "hsbc"] },
      { what: "Siemens €300m settled in central bank money via the Bundesbank trigger", players: ["siemens", "bundesbank"] },
      { what: "Hong Kong Government multi-currency tokenized green bonds", players: ["hkma", "hsbc"] },
    ],
  },

  "tokenized-mmf": {
    goal: "Launch a tokenized money market fund that people actually use as collateral.",
    prereqs: [
      { label: "An existing regulated MMF", product: "money-market-fund" },
      { label: "A tokenization agent and transfer agent" },
      { label: "A stablecoin or cash token for subscriptions", product: "stablecoin" },
    ],
    steps: [
      { id: "legal", title: "Add the share class", do: ["Amend the prospectus; set eligibility (often qualified purchasers only)", "Appoint a transfer agent that can keep the register on-chain", "Confirm the depositary and auditor are comfortable"] },
      { id: "ledger", title: "Mint the units", do: ["Permissioned token with freeze, forced transfer and recovery", "Launch on the chain where your target holders keep cash, then expand with burn-and-mint"] },
      { id: "identity", title: "Allow-list holders", do: ["KYC and accreditation before any wallet can receive units", "Block transfers to unverified addresses at the contract level"] },
      { id: "cash", title: "Accept stablecoin subscriptions", do: ["Define the NAV point for stablecoin versus fiat subscriptions", "Arrange a liquidity provider if you promise instant redemption"], watch: "Instant redemption is a promise against a T+1 market. Size the buffer or state the limits plainly." },
      { id: "lifecycle", title: "Accrue yield on-chain", do: ["Distribute daily as new tokens, or accumulate in the price", "Publish NAV through a signed oracle with a documented failure mode"] },
      { id: "interop", title: "Win collateral acceptance", do: ["Get exchanges, CCPs or bank counterparties to accept the token as margin", "Support tri-party style pledging so the holder keeps the yield"], watch: "Without collateral acceptance the product is a slower version of a fund that already worked." },
      { id: "controls", title: "Operate and audit", do: ["Audit contracts; monitor holder concentration and redemption capacity", "Reconcile on-chain units to the administrator's register daily"] },
    ],
    mvp: "One share class of an existing government MMF on one chain, sold to a handful of crypto-native institutions.",
    hard: "Distribution and collateral acceptance, not issuance. The first $100m comes from firms that already needed on-chain yield.",
    precedents: [
      { what: "BlackRock BUIDL with Securitize, accepted as exchange collateral", players: ["blackrock", "securitize"] },
      { what: "Franklin BENJI across several chains", players: ["franklin"] },
      { what: "Fidelity's on-chain Treasury fund share class", players: ["fidelity"] },
    ],
  },

  "intraday-tokenized-repo": {
    goal: "Borrow cash for hours against tokenized collateral, with an automatic unwind.",
    prereqs: [
      { label: "Tokenized or encumbered collateral", product: "tri-party-repo" },
      { label: "A cash token available intraday", product: "tokenized-deposit" },
      { label: "A legal opinion on on-ledger title transfer" },
    ],
    steps: [
      { id: "legal", title: "Paper it under the GMRA", do: ["Add a digital annex; confirm title transfer and close-out netting on-ledger", "Get opinions in every jurisdiction where a counterparty sits"], watch: "Intraday tenors give you minutes to enforce rights. The legal path must be unambiguous in advance." },
      { id: "ledger", title: "Build the trade contract", do: ["Encode start time, end time, rate, haircut and the automatic unwind", "Compute interest by the minute, not by the day"] },
      { id: "custody", title: "Immobilise the collateral", do: ["Either tokenize the security or lock it at the custodian with an on-ledger entitlement", "Prove the encumbrance is visible to both parties and to the custodian"] },
      { id: "cash", title: "Guarantee intraday cash", do: ["Use deposit tokens or wCBDC available in the trading window", "Pre-fund both sides: atomic settlement means no netting"] },
      { id: "lifecycle", title: "Automate margin and unwind", do: ["Mark collateral during the trade; call margin automatically", "Unwind at the agreed minute and release collateral atomically", "Define the failure path if the borrower cannot repay at unwind"] },
      { id: "interop", title: "Report and account", do: ["Report under SFTR or the US regime; intraday trades are still trades", "Feed liquidity and capital systems so the benefit shows up in the LCR"], watch: "If treasury and regulatory reporting cannot see the intraday borrowing, you get no capital or liquidity credit for it." },
      { id: "controls", title: "Start inside one group", do: ["Run intragroup first, then add a second institution", "Set platform and counterparty limits and test the default simulation"] },
    ],
    mvp: "Two entities of the same bank, one collateral basket, a four-hour tenor, settled atomically.",
    hard: "Getting a second institution to join with the same legal comfort. Volume is concentrated on the platforms that cleared that hurdle first.",
    precedents: [
      { what: "Kinexys intraday repo, over $1.5tn notional processed", players: ["kinexys", "jpmorgan"] },
      { what: "Broadridge DLR, trillions of dollars a month", players: ["broadridge"] },
    ],
  },

  "tokenized-stock": {
    goal: "Offer on-chain exposure to a listed share, and be precise about what the holder actually owns.",
    prereqs: [{ label: "A regulated issuer or broker-dealer" }, { label: "Custody of the underlying shares" }],
    steps: [
      {
        id: "legal",
        title: "Decide what the token is",
        do: [
          "Wrapper: an SPV or issuer holds the share and issues a tracking token; the holder's claim is on the issuer",
          "Native: the company's transfer agent records the share itself on-chain",
          "Disclose voting, dividend and insolvency rights in plain language: they differ sharply between models",
        ],
        watch: "Regulators have warned that 'stock tokens' often do not carry shareholder rights. Overstating them is the fastest way to enforcement.",
      },
      { id: "ledger", title: "Issue with restrictions", do: ["Permissioned token with jurisdiction blocks (US persons are usually excluded for wrappers)", "Fractional units, since the point is small tickets"] },
      { id: "custody", title: "Hold and prove the backing", do: ["Segregate the underlying shares with a regulated custodian", "Publish proof of reserves or independent attestation"] },
      { id: "lifecycle", title: "Pass through corporate actions", do: ["Dividends passed through net of withholding tax", "Handle splits, mergers and delistings explicitly in the terms"] },
      { id: "cash", title: "Manage market hours", do: ["Decide pricing and halts when the underlying market is closed", "Provide a market maker or a redemption route so the price stays anchored"] },
      { id: "controls", title: "Be conservative on claims", do: ["Independent audit of backing; clear risk disclosure", "Plan for a delisting or trading halt of the underlying"] },
    ],
    mvp: "A wrapper on a handful of liquid large-cap shares, sold outside the US, with daily proof of reserves.",
    hard: "Rights and regulation. Delivering genuine shareholder rights requires the issuer and its transfer agent, not just a custodian.",
    precedents: [{ what: "Backed xStocks distributed via crypto exchanges", players: ["backed", "coinbase"] }, { what: "Superstate Opening Bell for SEC-registered on-chain shares", players: ["superstate"] }],
  },

  "defi-lending-pool": {
    goal: "Run an over-collateralised lending market that institutions can actually use.",
    prereqs: [{ label: "Audited protocol code" }, { label: "Reliable oracles and liquidators" }],
    steps: [
      { id: "legal", title: "Decide permissioned or public", do: ["Institutional pools require KYC'd participants and a legal operator (Aave Arc/Horizon model)", "Get clarity on whether operating the pool is a regulated lending or trading activity in your jurisdiction"] },
      { id: "ledger", title: "Configure the market", do: ["Set loan-to-value, liquidation threshold and interest rate curve per collateral type", "Cap exposure per asset; new collateral types are the main risk vector"] },
      { id: "identity", title: "Gate access if institutional", do: ["Allow-list wallets; integrate KYC and sanctions screening", "Keep an audit trail of who borrowed what"] },
      { id: "lifecycle", title: "Make liquidation robust", do: ["Use multiple oracle sources with staleness checks and circuit breakers", "Incentivise a competitive set of liquidators; test with a simulated crash", "Support partial liquidation to avoid cascades"], watch: "Most DeFi losses trace back to an oracle or a thinly traded collateral asset, not to a broken lending formula." },
      { id: "interop", title: "Add real-world collateral", do: ["Accept tokenized T-bill funds as collateral to bring in institutional borrowers", "Handle the fact that real-world assets do not trade 24/7"] },
      { id: "controls", title: "Govern it", do: ["Two independent audits, a bug bounty and a timelock on parameter changes", "Publish an incident response plan and who can pause the market"] },
    ],
    mvp: "A permissioned pool with one stablecoin, one collateral type and conservative LTVs.",
    hard: "Liquidating real-world collateral on a weekend. Code can seize a token instantly, but the underlying market is closed.",
    precedents: [{ what: "Aave's permissioned pools for institutions", players: ["aave"] }, { what: "Project Guardian's permissioned liquidity pool trade", players: ["mas", "dbs", "jpmorgan"] }],
  },
};
