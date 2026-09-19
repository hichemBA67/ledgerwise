import type { AssetClass, Coords, Layer, MapNode, PlayerCategory, Stage } from "./types";

export const layers: { id: Layer; n: number; label: string; question: string; color: string; tokenized: string }[] = [
  { id: "users", n: 7, label: "End users", question: "Who needs money or wants a return?", color: "var(--track-foundations)", tokenized: "Same users, plus crypto-native firms and DAOs; direct wallet access can cut out distributors." },
  { id: "products", n: 6, label: "Products & instruments", question: "What claim changes hands?", color: "var(--track-fixed)", tokenized: "Same economic claims, recorded as tokens with programmable rules (coupons, transfer restrictions)." },
  { id: "markets", n: 5, label: "Markets & venues", question: "Where do buyers and sellers meet?", color: "var(--track-markets)", tokenized: "DLT MTFs/TSS, crypto venues, AMMs; 24/7 trading." },
  { id: "intermediaries", n: 4, label: "Intermediaries", question: "Who acts for others or takes risk in between?", color: "var(--track-money)", tokenized: "Tokenization agents, digital transfer agents, on-chain market makers; some roles shrink." },
  { id: "infrastructure", n: 3, label: "Market infrastructure", question: "Which utilities make trades safe and final?", color: "var(--track-infra)", tokenized: "Shared ledgers merge registrar, CSD and custody records; atomic settlement replaces some clearing." },
  { id: "money", n: 2, label: "Money & payments", question: "What do we settle in, and how does it move?", color: "var(--track-token)", tokenized: "Stablecoins, deposit tokens, wholesale CBDC and RTGS links provide on-chain cash." },
  { id: "oversight", n: 1, label: "Rules & oversight", question: "Who sets and enforces the rules?", color: "var(--track-reg)", tokenized: "Same principles ('same activity, same risk, same rules') plus MiCA, DLT Pilot, GENIUS Act, sandboxes." },
];

export const stages: { id: Stage; label: string; question: string; trad: string; token: string; tradWho: string[]; tokenWho: string[] }[] = [
  { id: "issue", label: "Issue", question: "How is a new claim created?", trad: "Auctions, syndication, IPOs, fund subscriptions; registrar/CSD records the new security (T+5 closing for eurobonds).", token: "Tokens minted directly into investor wallets; the ledger can be the legal register; T+0 closing.", tradWho: ["goldman", "jpmorgan", "euroclear", "dtcc"], tokenWho: ["securitize", "hsbc", "sdx", "tokeny"] },
  { id: "trade", label: "Trade", question: "Where do buyer and seller agree?", trad: "Exchanges (order books), OTC dealers, electronic platforms (Tradeweb, MarketAxess).", token: "DLT MTFs (21X, SDX), crypto venues, AMMs; 24/7, fractional.", tradWho: ["nyse", "lseg", "tradeweb", "marketaxess"], tokenWho: ["21x", "archax", "uniswap", "coinbase"] },
  { id: "clear", label: "Clear", question: "Who confirms, nets and guarantees?", trad: "CCPs novate and net; margin and default funds; bilateral for the rest.", token: "Often skipped: atomic settlement means no pending obligations, but also no netting. CCPs accept tokenized collateral.", tradWho: ["lch", "cme", "eurex", "dtcc"], tokenWho: ["kinexys", "cme"] },
  { id: "settle", label: "Settle", question: "When does ownership actually change?", trad: "DvP at CSDs (T+1/T+2) with cash in central bank money via RTGS/T2S.", token: "Atomic DvP on the ledger against wCBDC, deposit tokens or stablecoins; or via RTGS triggers.", tradWho: ["dtcc", "euroclear", "clearstream", "fed"], tokenWho: ["sdx", "circle", "snb", "bundesbank"] },
  { id: "service", label: "Hold & service", question: "Who keeps it safe and processes events?", trad: "Custody chains, corporate actions, income, tax, NAV, transfer agency.", token: "Key management (MPC/HSM), smart-contract coupons and dividends, on-chain registers.", tradWho: ["bny", "statestreet", "caceis", "ssandc"], tokenWho: ["fireblocks", "anchorage", "taurus", "securitize"] },
  { id: "finance", label: "Finance & collateralise", question: "How is the asset put to work?", trad: "Repo, securities lending, tri-party, margin at CCPs; moves in settlement windows.", token: "Intraday repo, 24/7 collateral mobility, tokenized MMFs as margin, DeFi lending.", tradWho: ["bny", "euroclear", "equilend", "morganstanley"], tokenWho: ["broadridge", "hqlax", "blackrock", "aave"] },
];

export const assetClasses: { id: AssetClass; label: string }[] = [
  { id: "cash", label: "Cash & money" },
  { id: "money-market", label: "Money market" },
  { id: "fixed-income", label: "Fixed income" },
  { id: "equity", label: "Equity" },
  { id: "funds", label: "Funds" },
  { id: "derivatives", label: "Derivatives" },
  { id: "fx", label: "FX" },
  { id: "digital", label: "Digital assets" },
];

const n = (x: MapNode) => x;

export const mapNodes: MapNode[] = [
  // Users
  n({ id: "sovereigns", label: "Governments & SSAs", layers: ["users"], stages: ["issue"], assets: ["fixed-income", "money-market"], desc: "Borrow through bills and bonds to fund deficits; SSAs (EIB, World Bank, KfW) fund development lending.", tokenized: "Early digital bond issuers (EIB, World Bank, HK Government).", examples: ["eib", "worldbank", "hkma"], lessons: ["government-bond-markets"], products: ["government-bond", "treasury-bill"] }),
  n({ id: "corporates", label: "Corporates & treasurers", layers: ["users"], stages: ["issue", "finance"], assets: ["fixed-income", "equity", "money-market", "fx"], desc: "Issue shares, bonds and CP; hedge FX and rates; park cash in deposits and MMFs.", tokenized: "Digital bonds (Siemens), tokenized deposits for 24/7 treasury, tokenized MMFs for cash.", examples: ["siemens"], lessons: ["bonds-basics", "equities-and-exchanges"], products: ["corporate-bond", "commercial-paper", "fx-forward"] }),
  n({ id: "banks-issuers", label: "Banks as issuers", layers: ["users"], stages: ["issue", "finance"], assets: ["fixed-income", "money-market"], desc: "Fund themselves with deposits, CDs, covered bonds, senior and subordinated debt.", tokenized: "Digital covered bonds, deposit tokens.", examples: ["sgforge", "nordea"], lessons: ["how-banks-work"], products: ["covered-bond", "certificate-of-deposit"] }),
  n({ id: "asset-owners", label: "Asset owners", layers: ["users"], stages: ["service", "finance"], assets: ["equity", "fixed-income", "funds"], desc: "Pension funds, insurers, sovereign wealth funds, endowments: the ultimate investors, often lenders of securities.", tokenized: "Test tokenized funds and collateral; long-term holders of digital bonds.", examples: ["nbim", "gic", "calpers", "gpif"], lessons: ["securities-lending", "global-financial-centres"] }),
  n({ id: "households", label: "Households & retail", layers: ["users"], stages: ["trade", "service"], assets: ["cash", "funds", "equity"], desc: "Hold deposits, funds and pensions; increasingly trade directly via apps.", tokenized: "Stablecoins, tokenized stocks, fractional real-world assets.", lessons: ["funds-etfs-and-structures"], products: ["bank-deposit", "mutual-fund"] }),

  // Products
  n({ id: "p-cash", label: "Cash & payment instruments", layers: ["products", "money"], stages: ["settle"], assets: ["cash"], desc: "Reserves, deposits, e-money, stablecoins.", products: ["central-bank-reserves", "bank-deposit", "stablecoin", "tokenized-deposit"], lessons: ["money-and-banking"] }),
  n({ id: "p-mm", label: "Money market instruments", layers: ["products"], stages: ["issue", "trade"], assets: ["money-market"], desc: "T-bills, CP, CDs, MMFs: debt under one year.", products: ["treasury-bill", "commercial-paper", "certificate-of-deposit", "money-market-fund"], lessons: ["money-markets"], tokenized: "Tokenized T-bill funds." }),
  n({ id: "p-financing", label: "Financing transactions", layers: ["products"], stages: ["finance"], assets: ["money-market", "fixed-income", "equity", "fx"], desc: "Repo, securities loans, FX swaps, margin loans: temporary exchanges secured by collateral.", products: ["repo", "securities-loan", "fx-swap", "margin-loan"], lessons: ["repo", "securities-lending"], tokenized: "Intraday tokenized repo, tokenized collateral." }),
  n({ id: "p-bonds", label: "Bonds", layers: ["products"], stages: ["issue", "trade"], assets: ["fixed-income"], desc: "Government, corporate, covered, securitised, green.", products: ["government-bond", "corporate-bond", "covered-bond", "securitisation-abs", "green-bond"], lessons: ["bonds-basics"], tokenized: "Digital bonds." }),
  n({ id: "p-equity", label: "Equity & funds", layers: ["products"], stages: ["issue", "trade"], assets: ["equity", "funds"], desc: "Shares, mutual funds, ETFs, private funds.", products: ["common-share", "mutual-fund", "etf", "private-fund"], lessons: ["equities-and-exchanges", "funds-etfs-and-structures"], tokenized: "Tokenized stocks and fund share classes." }),
  n({ id: "p-deriv", label: "Derivatives", layers: ["products"], stages: ["trade", "clear"], assets: ["derivatives"], desc: "Futures, options, swaps, CDS, FX forwards.", products: ["futures", "option", "interest-rate-swap", "credit-default-swap", "fx-forward"], lessons: ["derivatives-101", "otc-derivatives-and-swaps"], tokenized: "Tokenized collateral for margin; perpetual futures on crypto venues." }),
  n({ id: "p-token", label: "Natively digital products", layers: ["products"], stages: ["issue", "settle", "finance"], assets: ["digital"], desc: "Digital bonds, tokenized funds, tokenized repo, DeFi pools.", products: ["tokenized-bond", "tokenized-mmf", "intraday-tokenized-repo", "tokenized-stock", "defi-lending-pool"], lessons: ["tokenization-101"] }),

  // Markets
  n({ id: "primary", label: "Primary markets", layers: ["markets"], stages: ["issue"], assets: ["fixed-income", "equity", "money-market"], desc: "Auctions (sovereigns), bookbuilt syndications, IPOs, private placements.", tokenized: "Direct on-chain issuance to wallets.", lessons: ["bond-issuance-and-trading", "government-bond-markets"], examples: ["goldman", "jpmorgan"] }),
  n({ id: "exchanges", label: "Exchanges", layers: ["markets"], stages: ["trade"], assets: ["equity", "derivatives", "funds"], desc: "Central limit order books for shares, ETFs, futures and options.", tokenized: "Exchanges filing to list tokenized securities; DLT exchanges.", examples: ["nyse", "nasdaq", "lseg", "euronext", "cme", "jpx"], lessons: ["equities-and-exchanges"] }),
  n({ id: "otc", label: "OTC dealer markets", layers: ["markets"], stages: ["trade"], assets: ["fixed-income", "fx", "derivatives", "money-market"], desc: "Bonds, FX, swaps and repo trade bilaterally with dealers.", tokenized: "Bilateral atomic settlement of tokenized bonds and repo.", examples: ["jpmorgan", "goldman", "citi"], lessons: ["bond-issuance-and-trading", "fx-markets"] }),
  n({ id: "platforms", label: "Electronic platforms (MTF/ATS/SEF)", layers: ["markets"], stages: ["trade"], assets: ["fixed-income", "derivatives", "money-market"], desc: "RFQ and all-to-all venues for bonds, swaps and repo.", examples: ["tradeweb", "marketaxess", "bloomberg"], lessons: ["bond-issuance-and-trading"] }),
  n({ id: "sft-markets", label: "Repo & sec lending markets", layers: ["markets"], stages: ["finance"], assets: ["money-market", "fixed-income", "equity"], desc: "Where cash and securities are borrowed daily.", tokenized: "DLR, Kinexys, HQLAx.", examples: ["equilend", "broadridge"], lessons: ["repo", "securities-lending"] }),
  n({ id: "digital-venues", label: "Digital venues", layers: ["markets"], stages: ["trade", "settle"], assets: ["digital"], desc: "DLT MTFs and TSSs, crypto exchanges, AMMs.", examples: ["21x", "sdx", "archax", "coinbase", "uniswap"], lessons: ["atomic-settlement-and-dlt-fmi", "defi-and-institutional-defi"] }),

  // Intermediaries
  n({ id: "commercial-banks", label: "Commercial banks", layers: ["intermediaries", "money"], stages: ["finance", "settle"], assets: ["cash", "money-market"], desc: "Take deposits, lend, make payments.", tokenized: "Deposit tokens.", examples: ["jpmorgan", "hsbc", "bnpparibas", "icbc"], lessons: ["how-banks-work"] }),
  n({ id: "dealers", label: "Dealers & primary dealers", layers: ["intermediaries"], stages: ["issue", "trade", "finance"], assets: ["fixed-income", "fx", "derivatives", "equity"], desc: "Underwrite, make markets, run repo desks.", tokenized: "Arrange digital bonds; run tokenization platforms (GS DAP, Kinexys).", examples: ["goldman", "jpmorgan", "morganstanley", "barclays"], lessons: ["bond-issuance-and-trading", "government-bond-markets"] }),
  n({ id: "asset-managers", label: "Asset managers", layers: ["intermediaries"], stages: ["trade", "service"], assets: ["funds", "equity", "fixed-income", "money-market"], desc: "Invest on behalf of clients via funds and mandates.", tokenized: "Tokenized funds (BUIDL, BENJI, FDIT).", examples: ["blackrock", "vanguard", "fidelity", "amundi", "pimco"], lessons: ["funds-etfs-and-structures"] }),
  n({ id: "prime-brokers", label: "Prime brokers", layers: ["intermediaries"], stages: ["finance", "service"], assets: ["equity", "fixed-income"], desc: "Financing, securities borrowing and custody for hedge funds.", examples: ["goldman", "morganstanley", "jpmorgan"], lessons: ["prime-brokerage-and-margin"], products: ["margin-loan"] }),
  n({ id: "agent-lenders", label: "Agent lenders", layers: ["intermediaries"], stages: ["finance"], assets: ["equity", "fixed-income"], desc: "Lend securities on behalf of beneficial owners.", examples: ["bny", "statestreet", "blackrock", "northerntrust"], lessons: ["securities-lending"], products: ["securities-loan"] }),
  n({ id: "fund-services", label: "Transfer agents & fund admins", layers: ["intermediaries", "infrastructure"], stages: ["service", "issue"], assets: ["funds"], desc: "Registers, NAV, dealing.", tokenized: "On-chain transfer agents (Securitize).", examples: ["ssandc", "calastone", "securitize"], lessons: ["fund-administration-and-transfer-agency"], products: ["fund-administration"] }),
  n({ id: "ratings-data", label: "Ratings, data & indices", layers: ["intermediaries"], stages: ["trade", "service"], assets: ["fixed-income", "equity"], desc: "Credit ratings, prices, benchmarks, analytics.", tokenized: "On-chain oracles (Chainlink), blockchain analytics.", examples: ["spglobal", "moodys", "bloomberg", "msci", "chainalysis"], lessons: ["credit-and-ratings"] }),
  n({ id: "token-platforms", label: "Tokenization platforms", layers: ["intermediaries", "infrastructure"], stages: ["issue", "service"], assets: ["digital"], desc: "Mint, register and manage tokenized assets.", examples: ["securitize", "tokeny", "kinexys", "sgforge", "progmat"], lessons: ["tokenization-101"] }),

  // Infrastructure
  n({ id: "csds", label: "CSDs & ICSDs", layers: ["infrastructure"], stages: ["issue", "settle", "service"], assets: ["fixed-income", "equity", "money-market"], desc: "Notary, central maintenance, settlement.", tokenized: "DLT CSDs (SDX, D-FMI, D7, 21X).", examples: ["dtcc", "euroclear", "clearstream", "six", "jasdec"], lessons: ["settlement-and-csds"], products: ["csd-settlement"] }),
  n({ id: "ccps", label: "CCPs", layers: ["infrastructure"], stages: ["clear"], assets: ["derivatives", "equity", "fixed-income", "money-market"], desc: "Novation, netting, margin, default management.", tokenized: "Tokenized collateral for margin; 24/7 margin calls.", examples: ["lch", "cme", "eurex", "ice", "dtcc"], lessons: ["clearing-and-ccps"], products: ["ccp-clearing"] }),
  n({ id: "custodians", label: "Custodians", layers: ["infrastructure", "intermediaries"], stages: ["service", "settle"], assets: ["equity", "fixed-income", "funds"], desc: "Safekeeping and asset servicing.", tokenized: "Digital asset custody (keys).", examples: ["bny", "statestreet", "jpmorgan", "citi", "caceis"], lessons: ["custody", "digital-asset-custody"], products: ["custody-service"] }),
  n({ id: "triparty", label: "Tri-party & collateral agents", layers: ["infrastructure"], stages: ["finance"], assets: ["money-market", "fixed-income"], desc: "Collateral allocation, valuation, substitution.", tokenized: "Collateral mobility networks.", examples: ["bny", "euroclear", "clearstream", "hqlax"], lessons: ["collateral-management"], products: ["tri-party-repo"] }),
  n({ id: "trade-repos", label: "Trade repositories & reporting", layers: ["infrastructure", "oversight"], stages: ["trade", "clear"], assets: ["derivatives", "money-market"], desc: "Store transaction reports (EMIR, SFTR, Dodd-Frank).", examples: ["dtcc"], lessons: ["tradfi-regulation"] }),
  n({ id: "messaging", label: "Messaging & standards", layers: ["infrastructure"], stages: ["trade", "settle", "service"], assets: ["cash", "equity", "fixed-income"], desc: "Swift, ISO 20022, FIX, ISIN, LEI.", tokenized: "Interop connectors, DTI identifiers, CDM/BDT.", examples: ["swift", "broadridge"], lessons: ["messaging-and-standards"] }),
  n({ id: "dlt-networks", label: "DLT networks", layers: ["infrastructure"], stages: ["issue", "settle", "finance"], assets: ["digital"], desc: "Public and permissioned ledgers hosting tokens.", examples: ["ethereum", "polygon", "digitalasset", "solana", "r3"], lessons: ["blockchain-for-finance", "interoperability-and-bridges"] }),

  // Money
  n({ id: "cb-money", label: "Central bank money & RTGS", layers: ["money"], stages: ["settle"], assets: ["cash"], desc: "Reserves and RTGS systems: the final settlement asset.", tokenized: "wCBDC, RTGS–DLT links (Pontes).", examples: ["fed", "ecb", "boe", "snb"], lessons: ["money-and-banking", "payments-and-rtgs"], products: ["central-bank-reserves", "rtgs-payment", "wholesale-cbdc"] }),
  n({ id: "retail-payments", label: "Retail & instant payments", layers: ["money"], stages: ["settle"], assets: ["cash"], desc: "Cards, ACH, instant payments (UPI, Pix, FedNow).", examples: ["visa", "mastercard", "npci", "bcb"], lessons: ["payments-and-rtgs"] }),
  n({ id: "cross-border", label: "Cross-border & FX settlement", layers: ["money"], stages: ["settle"], assets: ["fx", "cash"], desc: "Correspondent banking and CLS.", tokenized: "Partior, Agorá, mBridge, stablecoins.", examples: ["cls", "swift", "partior"], lessons: ["payments-and-rtgs", "fx-swaps-and-dollar-funding"], products: ["correspondent-payment"] }),
  n({ id: "private-onchain-money", label: "Stablecoins & deposit tokens", layers: ["money"], stages: ["settle", "finance"], assets: ["cash", "digital"], desc: "Private money on programmable ledgers.", examples: ["circle", "tether", "paxos", "kinexys"], lessons: ["stablecoins-and-tokenized-cash"], products: ["stablecoin", "tokenized-deposit"] }),

  // Oversight
  n({ id: "standard-setters", label: "Global standard setters", layers: ["oversight"], stages: ["issue", "trade", "clear", "settle", "service", "finance"], assets: ["cash", "money-market", "fixed-income", "equity", "funds", "derivatives", "fx", "digital"], desc: "BIS/BCBS, CPMI, FSB, IOSCO, FATF.", examples: ["bis", "fsb", "iosco", "imf"], lessons: ["tradfi-regulation", "prudential-regulation-basel"] }),
  n({ id: "central-banks", label: "Central banks", layers: ["oversight", "money"], stages: ["settle", "finance"], assets: ["cash", "money-market"], desc: "Monetary policy, lender of last resort, FMI oversight.", examples: ["fed", "ecb", "boj", "pboc", "boe"], lessons: ["central-banks-and-monetary-policy"] }),
  n({ id: "securities-regs", label: "Securities & markets regulators", layers: ["oversight"], stages: ["issue", "trade", "clear", "settle"], assets: ["equity", "fixed-income", "funds", "derivatives", "digital"], desc: "SEC, CFTC, ESMA, FCA, SFC, FINMA…", examples: ["sec", "cftc", "esma", "fca", "sfc", "finma"], lessons: ["tokenization-regulation"] }),
  n({ id: "prudential", label: "Prudential & banking supervisors", layers: ["oversight"], stages: ["finance", "service"], assets: ["cash", "money-market", "fixed-income"], desc: "Capital, liquidity, resolution.", examples: ["eba", "occ-regulator", "fdic"], lessons: ["prudential-regulation-basel"] }),
  n({ id: "contracts", label: "Contracts & industry bodies", layers: ["oversight"], stages: ["trade", "finance"], assets: ["money-market", "derivatives", "equity", "fixed-income"], desc: "GMRA, GMSLA, ISDA Master Agreement; ICMA, ISLA, ISDA, SIFMA.", tokenized: "Digital-asset annexes, CDM, BDT.", examples: ["icma", "isla", "isda", "sifma"], lessons: ["otc-derivatives-and-swaps", "repo"] }),
  n({ id: "aml", label: "AML, KYC & sanctions", layers: ["oversight"], stages: ["issue", "trade", "settle"], assets: ["cash", "digital"], desc: "FATF standards, travel rule, sanctions lists.", examples: ["chainalysis", "elliptic"], lessons: ["aml-kyc-and-sanctions"] }),
];

/** Where each player category sits on the map. */
export const categoryCoords: Record<PlayerCategory, Coords> = {
  Custodian: { layers: ["infrastructure", "intermediaries"], stages: ["service", "settle", "finance"], assets: ["equity", "fixed-income", "funds"] },
  "CSD / ICSD": { layers: ["infrastructure"], stages: ["issue", "settle", "service"], assets: ["equity", "fixed-income", "money-market"] },
  "CCP / Clearing": { layers: ["infrastructure"], stages: ["clear"], assets: ["derivatives", "equity", "fixed-income"] },
  "Tri-party & Collateral": { layers: ["infrastructure"], stages: ["finance"], assets: ["money-market", "fixed-income", "equity"] },
  "Bank / Dealer": { layers: ["intermediaries", "money"], stages: ["issue", "trade", "finance"], assets: ["cash", "fixed-income", "fx", "derivatives"] },
  "Asset Manager": { layers: ["intermediaries"], stages: ["trade", "service"], assets: ["funds", "equity", "fixed-income"] },
  "Tokenization Platform": { layers: ["intermediaries", "infrastructure"], stages: ["issue", "settle", "service"], assets: ["digital"] },
  "DLT Network": { layers: ["infrastructure"], stages: ["issue", "settle", "finance"], assets: ["digital"] },
  "Stablecoin / Cash Token": { layers: ["money"], stages: ["settle"], assets: ["cash", "digital"] },
  "Digital Asset Custody": { layers: ["infrastructure"], stages: ["service"], assets: ["digital"] },
  "Exchange / Venue": { layers: ["markets"], stages: ["trade"], assets: ["equity", "derivatives"] },
  "Central Bank / Regulator": { layers: ["oversight"], stages: ["issue", "trade", "clear", "settle", "service", "finance"], assets: ["cash"] },
  "Data & Rating": { layers: ["intermediaries"], stages: ["trade", "service"], assets: ["fixed-income", "equity"] },
  "Payments & Messaging": { layers: ["money", "infrastructure"], stages: ["settle"], assets: ["cash", "fx"] },
  "Market Technology": { layers: ["infrastructure"], stages: ["trade", "settle", "service"], assets: ["funds", "derivatives"] },
  "Industry Body": { layers: ["oversight"], stages: ["trade", "finance"], assets: ["fixed-income", "derivatives"] },
  "Asset Owner": { layers: ["users"], stages: ["service", "finance"], assets: ["equity", "fixed-income", "funds"] },
  Issuer: { layers: ["users"], stages: ["issue"], assets: ["fixed-income"] },
};

const c = (layers: Layer[], stages: Stage[], assets: AssetClass[]): Coords => ({ layers, stages, assets });

/** Where each lesson sits on the map. */
export const topicCoords: Record<string, Coords> = {
  "the-finance-stack": c(["users", "products", "markets", "intermediaries", "infrastructure", "money", "oversight"], ["issue", "trade", "clear", "settle", "service", "finance"], ["cash", "money-market", "fixed-income", "equity", "funds", "derivatives", "fx", "digital"]),
  "money-and-banking": c(["money"], ["settle"], ["cash"]),
  "financial-markets-map": c(["markets", "intermediaries", "infrastructure"], ["issue", "trade", "clear", "settle", "service"], ["equity", "fixed-income"]),
  "interest-rates-and-yield-curve": c(["products", "money"], ["trade"], ["money-market", "fixed-income"]),
  "risk-in-finance": c(["products", "infrastructure"], ["clear", "settle", "finance"], ["fixed-income", "derivatives", "fx"]),
  "central-banks-and-monetary-policy": c(["money", "oversight"], ["settle", "finance"], ["cash", "money-market"]),
  "how-banks-work": c(["intermediaries", "money"], ["finance"], ["cash", "money-market"]),
  "money-markets": c(["products", "markets"], ["issue", "trade", "finance"], ["money-market"]),
  repo: c(["products", "markets", "infrastructure"], ["finance", "clear", "settle"], ["money-market", "fixed-income"]),
  "securities-lending": c(["products", "intermediaries"], ["finance"], ["equity", "fixed-income"]),
  "money-market-funds": c(["products", "intermediaries"], ["issue", "service", "finance"], ["money-market", "funds"]),
  "fx-swaps-and-dollar-funding": c(["products", "money"], ["finance", "settle"], ["fx", "money-market"]),
  "prime-brokerage-and-margin": c(["intermediaries"], ["finance", "service"], ["equity"]),
  "bonds-basics": c(["products"], ["issue", "trade"], ["fixed-income"]),
  "bond-pricing-and-duration": c(["products"], ["trade"], ["fixed-income"]),
  "bond-issuance-and-trading": c(["markets", "intermediaries"], ["issue", "trade"], ["fixed-income"]),
  "credit-and-ratings": c(["products", "intermediaries"], ["trade"], ["fixed-income", "derivatives"]),
  "government-bond-markets": c(["products", "markets", "users"], ["issue", "trade", "finance"], ["fixed-income"]),
  securitization: c(["products"], ["issue", "service"], ["fixed-income"]),
  "green-and-sustainable-bonds": c(["products"], ["issue"], ["fixed-income"]),
  "equities-and-exchanges": c(["products", "markets"], ["issue", "trade", "clear", "settle"], ["equity"]),
  "funds-etfs-and-structures": c(["products", "intermediaries"], ["issue", "trade", "service"], ["funds"]),
  "derivatives-101": c(["products", "markets"], ["trade", "clear"], ["derivatives"]),
  "otc-derivatives-and-swaps": c(["products", "infrastructure", "oversight"], ["trade", "clear", "finance"], ["derivatives"]),
  "fx-markets": c(["products", "markets"], ["trade", "settle"], ["fx"]),
  custody: c(["infrastructure"], ["service", "settle"], ["equity", "fixed-income", "funds"]),
  "clearing-and-ccps": c(["infrastructure"], ["clear"], ["derivatives", "equity", "fixed-income"]),
  "settlement-and-csds": c(["infrastructure"], ["settle"], ["equity", "fixed-income"]),
  "collateral-management": c(["infrastructure"], ["finance"], ["money-market", "fixed-income"]),
  "payments-and-rtgs": c(["money", "infrastructure"], ["settle"], ["cash", "fx"]),
  "asset-servicing-and-corporate-actions": c(["infrastructure"], ["service"], ["equity", "fixed-income"]),
  "fund-administration-and-transfer-agency": c(["infrastructure", "intermediaries"], ["service", "issue"], ["funds"]),
  "messaging-and-standards": c(["infrastructure"], ["trade", "settle", "service"], ["cash", "equity", "fixed-income"]),
  "tokenization-101": c(["products", "infrastructure"], ["issue", "settle", "service"], ["digital"]),
  "blockchain-for-finance": c(["infrastructure"], ["issue", "settle"], ["digital"]),
  "stablecoins-and-tokenized-cash": c(["money"], ["settle"], ["cash", "digital"]),
  "tokenized-bonds": c(["products"], ["issue", "settle", "service"], ["fixed-income", "digital"]),
  "tokenized-money-market-funds": c(["products"], ["issue", "service", "finance"], ["funds", "money-market", "digital"]),
  "tokenized-repo-and-collateral": c(["products", "infrastructure"], ["finance", "settle"], ["money-market", "digital"]),
  "digital-asset-custody": c(["infrastructure"], ["service"], ["digital"]),
  "atomic-settlement-and-dlt-fmi": c(["infrastructure", "money"], ["clear", "settle"], ["digital"]),
  "tokenized-private-credit-and-rwa": c(["products"], ["issue", "service"], ["fixed-income", "funds", "digital"]),
  "defi-and-institutional-defi": c(["markets", "products"], ["trade", "finance"], ["digital"]),
  "tokenized-equities-and-etfs": c(["products", "markets"], ["issue", "trade"], ["equity", "digital"]),
  "interoperability-and-bridges": c(["infrastructure"], ["settle"], ["digital"]),
  "tradfi-regulation": c(["oversight"], ["trade", "clear", "settle", "finance"], ["equity", "fixed-income", "derivatives", "money-market"]),
  "tokenization-regulation": c(["oversight"], ["issue", "trade", "settle"], ["digital"]),
  "prudential-regulation-basel": c(["oversight"], ["finance"], ["cash", "money-market"]),
  "aml-kyc-and-sanctions": c(["oversight"], ["issue", "settle"], ["cash", "digital"]),
  "global-financial-centres": c(["users", "markets", "oversight"], ["trade"], ["equity", "fixed-income", "fx"]),
};
