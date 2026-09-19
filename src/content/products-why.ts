/**
 * Plain-language "why does this exist" for every product, plus the real
 * institution that typically plays each role in its flow diagram.
 */
export type Why = {
  /** The everyday problem, in plain words. */
  problem: string;
  /** Who reaches for it and the reason. */
  users: { who: string; because: string }[];
  /** What would happen (or what people did) without it. */
  withoutIt?: string;
};

export const why: Record<string, Why> = {
  "central-bank-reserves": {
    problem:
      "When two banks settle a €500m payment, someone has to be trusted to hold the money in between. Any commercial bank can fail, so banks keep accounts at the one institution that cannot run out of its own currency: the central bank.",
    users: [
      { who: "Commercial banks", because: "they must settle payments with each other every day and want zero risk on the asset they settle in" },
      { who: "Central banks", because: "reserves are the lever for monetary policy: paying interest on them steers every other short-term rate" },
      { who: "Market infrastructures", because: "CCPs and CSDs are told by global standards (PFMI) to settle in central bank money where practical" },
    ],
    withoutIt: "Banks would settle in each other's IOUs, so one failure could cascade through everyone who was owed money that day.",
  },
  "bank-deposit": {
    problem:
      "Most people and companies need money that is safe, instantly spendable and does not have to be guarded personally. A deposit is the bank's promise to pay you on demand, and it is what the payment system actually moves.",
    users: [
      { who: "Households", because: "salary, rent and cards all run through a deposit account, and insurance covers small balances if the bank fails" },
      { who: "Corporate treasurers", because: "they need working cash on tap, though above the insured limit they spread it or move it into T-bills and MMFs" },
      { who: "Banks themselves", because: "deposits are their cheapest and stickiest funding, which is what lets them lend long-term" },
    ],
    withoutIt: "Everyone would hold cash or central bank accounts directly, and banks would lose the funding that makes mortgages and business loans possible.",
  },
  "rtgs-payment": {
    problem:
      "Big payments cannot wait until end of day to become final: if a €200m leg is still reversible, the receiver cannot safely use the money. RTGS settles each payment one by one, immediately and irrevocably.",
    users: [
      { who: "Banks", because: "they must move large sums with legal certainty, especially the cash leg of securities and FX trades" },
      { who: "CCPs and CSDs", because: "margin calls and settlement cash have hard deadlines several times a day" },
      { who: "Corporates", because: "high-value transfers such as acquisitions or tax payments need same-day finality" },
    ],
    withoutIt: "Large payments would settle net at day's end, leaving everyone exposed to whoever fails in between (the 1974 Herstatt failure is the classic case).",
  },
  "correspondent-payment": {
    problem:
      "There is no global payment system. To pay someone in another country, your bank needs an account with a bank that can reach the destination currency's home system, which is why cross-border payments hop through several banks.",
    users: [
      { who: "Importers and exporters", because: "trade invoices must be paid in a currency neither party's bank issues" },
      { who: "Migrant workers and families", because: "remittances still move mostly through this chain, which is why fees are high" },
      { who: "Banks without a global footprint", because: "renting access to a correspondent is cheaper than opening branches worldwide" },
    ],
    withoutIt: "Every bank would need an account with every other bank in the world, or direct access to every central bank.",
  },
  stablecoin: {
    problem:
      "Blockchains run 24/7 but bank transfers do not. A stablecoin is a dollar (or euro) claim that lives on the same rails as the assets being traded, so you can settle at 3am on a Sunday without waiting for a bank to open.",
    users: [
      { who: "Crypto traders and exchanges", because: "they need a stable unit to price and settle trades without touching the banking system each time" },
      { who: "Businesses in high-inflation or dollar-scarce countries", because: "a dollar token is easier to get and hold than a US bank account" },
      { who: "Fintechs and payment firms", because: "cross-border transfers settle in minutes rather than days" },
    ],
    withoutIt: "On-chain markets would have to price in volatile crypto, or stop every time they needed real money.",
  },
  "tokenized-deposit": {
    problem:
      "Corporate treasurers want bank money that behaves like software: moving instantly between subsidiaries at any hour, and able to pay automatically when a condition is met. Deposit tokens keep the deposit (and its protections) but put it on a programmable ledger.",
    users: [
      { who: "Multinational treasurers", because: "cash can move between Singapore and New York outside banking hours, cutting trapped balances" },
      { who: "Banks", because: "it defends deposits against stablecoins while staying inside banking regulation" },
      { who: "Tokenized markets", because: "an on-chain cash leg is what makes atomic delivery-versus-payment possible" },
    ],
    withoutIt: "Tokenized assets would settle against cash on separate, slower rails, losing most of the benefit.",
  },
  "wholesale-cbdc": {
    problem:
      "If tokenized bonds settle against a private token, the buyer still takes issuer risk on the cash. Wholesale CBDC is central bank money in token form, so the safest settlement asset can move on the same ledger as the security.",
    users: [
      { who: "Banks settling digital bonds", because: "it removes credit risk from the cash leg of an atomic trade" },
      { who: "Central banks", because: "it keeps central bank money at the centre of settlement as markets move to ledgers" },
      { who: "DLT market infrastructures", because: "regulators expect settlement in central bank money where practical" },
    ],
    withoutIt: "Tokenized settlement relies on commercial bank tokens, stablecoins, or a bridge back to the existing RTGS system.",
  },
  "treasury-bill": {
    problem:
      "A company with $500m of idle cash cannot leave it all in one bank: it would be far above insurance limits. T-bills let it lend to the government for a few weeks instead, with a deep market to sell into if plans change.",
    users: [
      { who: "Money market funds", because: "they need assets that mature constantly and can be sold instantly at a known price" },
      { who: "Corporate treasurers and central banks", because: "it is the safest way to park large sums in a currency" },
      { who: "Stablecoin issuers", because: "reserve rules require short, liquid government debt" },
    ],
    withoutIt: "Large cash balances would pile up as uninsured bank deposits, concentrating risk in banks.",
  },
  "commercial-paper": {
    problem:
      "Companies have gaps between paying suppliers and collecting from customers. Instead of drawing an expensive bank loan, strong names borrow directly from investors for a few weeks at a lower rate.",
    users: [
      { who: "Large corporates", because: "it funds payroll and inventory more cheaply than a bank credit line" },
      { who: "Banks and finance companies", because: "it is quick, flexible short-term funding" },
      { who: "Prime money market funds", because: "it pays more than government bills" },
    ],
    withoutIt: "Companies would depend entirely on banks for short-term credit, exactly what happened when CP froze in 2008 and March 2020.",
  },
  "certificate-of-deposit": {
    problem:
      "A bank wants funding it knows will stay for six months; an investor wants a bit more yield than an overnight deposit. A CD fixes the term, but stays tradable so the investor is not fully locked in.",
    users: [
      { who: "Banks", because: "term funding is more stable and counts better under liquidity rules" },
      { who: "Money market funds and treasurers", because: "it pays more than overnight cash while staying sellable" },
    ],
  },
  "money-market-fund": {
    problem:
      "Running a portfolio of T-bills and repo yourself takes a desk, credit limits and operations staff. An MMF does it for everyone at once: you buy a share, get a market yield, and can take your money out the same day.",
    users: [
      { who: "Corporate treasurers", because: "it diversifies cash across hundreds of issuers instead of one bank, with same-day access" },
      { who: "Asset managers and brokers", because: "it is where client cash sits between investments" },
      { who: "Retail savers", because: "it pays close to policy rates when deposit accounts do not" },
    ],
    withoutIt: "Cash would sit in uninsured deposits or require every company to build its own money market desk.",
  },
  repo: {
    problem:
      "A dealer holding $10bn of bonds needs cash today, and a money fund holding $10bn of cash wants a safe place to put it overnight. Repo matches them: cash against collateral, so neither side has to trust the other's name.",
    users: [
      { who: "Bond dealers", because: "it finances inventory cheaply, which is what lets them make markets" },
      { who: "Money market funds and corporates", because: "lending against government collateral is far safer than an unsecured deposit" },
      { who: "Hedge funds", because: "it provides the leverage behind strategies like the Treasury basis trade" },
      { who: "Central banks", because: "repo is how policy rates are implemented and emergency liquidity is supplied" },
    ],
    withoutIt: "Short-term wholesale lending would be unsecured again, and bond market liquidity would shrink sharply.",
  },
  "tri-party-repo": {
    problem:
      "A money fund lending to ten dealers every night cannot check, value and swap thousands of bonds itself. A tri-party agent does the collateral work for both sides automatically.",
    users: [
      { who: "Cash lenders (MMFs, corporates)", because: "they get collateral managed and revalued daily without building the capability" },
      { who: "Dealers", because: "they can substitute collateral freely during the day as securities are sold" },
      { who: "Both sides", because: "it makes large-scale overnight lending operationally possible at all" },
    ],
  },
  "securities-loan": {
    problem:
      "A pension fund holds shares it will not sell for years, earning nothing extra. Someone else urgently needs those exact shares, to deliver on a sale or to short the stock. Lending them earns the owner a fee, against collateral worth more than the shares.",
    users: [
      { who: "Pension funds, insurers and ETFs", because: "lending idle holdings adds a few basis points of return with collateral protection" },
      { who: "Broker-dealers", because: "borrowing prevents settlement fails and supports client short selling" },
      { who: "Market makers", because: "they can quote prices without owning every security first" },
    ],
    withoutIt: "Settlement failures would rise sharply and short selling, which helps price discovery, would be difficult.",
  },
  "fx-swap": {
    problem:
      "A Japanese insurer has yen but wants US Treasuries; it needs dollars for three months, not forever. An FX swap lends it dollars against yen and reverses at a rate agreed today, so it never takes currency risk.",
    users: [
      { who: "Insurers and pension funds", because: "they fund foreign bond portfolios without a naked currency bet" },
      { who: "Banks", because: "it is the cheapest way to move liquidity between currencies day to day" },
      { who: "Corporates", because: "it bridges timing gaps between receipts in one currency and payments in another" },
    ],
    withoutIt: "Cross-border investment would require borrowing dollars unsecured, which is scarcer and dearer, especially in a crisis.",
  },
  "margin-loan": {
    problem:
      "A fund believes a trade will return 4%. On its own money that is a modest result; with three times the position financed by its broker, it is meaningful. The broker lends against the portfolio and can sell it if values fall.",
    users: [
      { who: "Hedge funds", because: "leverage turns small, reliable spreads into a viable business" },
      { who: "Prime brokers", because: "financing spreads, stock lending and fees are a core revenue line" },
      { who: "Wealthy clients", because: "borrowing against a portfolio avoids selling assets and triggering tax" },
    ],
    withoutIt: "Many arbitrage strategies that keep prices consistent across markets would not be profitable enough to exist.",
  },
  "government-bond": {
    problem:
      "Governments spend before tax revenue arrives, and some projects last 30 years. Bonds spread that cost over time. For investors they are the one asset that reliably pays in the country's own currency, which is why everything else is priced off them.",
    users: [
      { who: "Governments", because: "it funds deficits and long-lived infrastructure without printing money" },
      { who: "Pension funds and insurers", because: "long bonds match pension and insurance promises decades ahead" },
      { who: "Banks", because: "they count as liquidity buffers and are the best collateral in repo" },
      { who: "Central banks and reserve managers", because: "foreign exchange reserves must be safe and instantly sellable" },
    ],
    withoutIt: "There would be no risk-free yield curve to price mortgages, corporate debt or swaps against.",
  },
  "corporate-bond": {
    problem:
      "A company that needs €2bn for ten years may not want to depend on a handful of banks. Issuing a bond borrows straight from hundreds of investors, usually cheaper and for longer than a loan, with no annual renewal risk.",
    users: [
      { who: "Companies", because: "long, fixed-rate funding that does not have to be renegotiated each year" },
      { who: "Insurers and pension funds", because: "they need yield above government bonds to meet their own promises" },
      { who: "Bond funds and ETFs", because: "credit is a core asset class for diversified portfolios" },
    ],
    withoutIt: "Corporate investment would depend entirely on bank lending capacity, which shrinks exactly when it is most needed.",
  },
  "covered-bond": {
    problem:
      "Banks make 25-year mortgages but fund themselves with short deposits. A covered bond raises long-term money secured on those mortgages, while keeping them on the bank's books, so investors have two layers of protection.",
    users: [
      { who: "Mortgage banks", because: "it is the cheapest long-term funding available, even in stressed markets" },
      { who: "Conservative investors", because: "dual recourse (the bank plus the ring-fenced pool) has produced almost no defaults in 200 years" },
      { who: "Central banks", because: "they accept them as high-quality collateral, which keeps the market liquid" },
    ],
  },
  "securitisation-abs": {
    problem:
      "A lender's capital is tied up in thousands of small loans. Selling them into a vehicle that issues bonds converts them into cash to lend again, and lets investors choose how much risk they want by picking a tranche.",
    users: [
      { who: "Banks and lenders", because: "it frees capital and funding to originate more loans" },
      { who: "Insurers and funds", because: "senior tranches offer a rated, diversified way to own consumer or mortgage credit" },
      { who: "Borrowers", because: "cheaper funding for lenders has historically meant cheaper mortgages and car loans" },
    ],
    withoutIt: "Lending would be limited by each bank's balance sheet, though 2008 showed what happens when the chain hides bad underwriting.",
  },
  "green-bond": {
    problem:
      "An investor with a climate mandate cannot tell where a normal bond's money goes. A green bond earmarks the proceeds for defined projects and reports on them, so the money can be tracked.",
    users: [
      { who: "Issuers", because: "it widens the investor base and signals a credible transition plan" },
      { who: "ESG funds and insurers", because: "mandates and regulation require evidence of what is financed" },
      { who: "Governments", because: "it funds energy and transport programmes while showing progress publicly" },
    ],
    withoutIt: "Sustainability claims would rest entirely on issuer-level reporting, with no project-level accounting.",
  },
  "common-share": {
    problem:
      "A growing business needs money it never has to repay, and its backers need a way to get their money out without breaking up the company. Shares do both: permanent capital for the company, tradable ownership for investors.",
    users: [
      { who: "Companies", because: "equity absorbs losses, so it funds risky growth that lenders would not touch" },
      { who: "Founders and venture investors", because: "listing turns paper stakes into cash and sets a public price" },
      { who: "Savers and pension funds", because: "equities have been the main long-run engine of retirement savings" },
    ],
    withoutIt: "Business expansion would depend on debt and retained profits, and ordinary savers could not own a slice of corporate growth.",
  },
  "mutual-fund": {
    problem:
      "Building a diversified portfolio takes capital, research and constant admin. A fund pools many investors so a €100 contribution buys a share of hundreds of securities, professionally managed and independently safeguarded.",
    users: [
      { who: "Retail savers", because: "diversification and professional management at small ticket sizes" },
      { who: "Pension schemes and advisers", because: "a regulated wrapper with daily pricing and clear rules" },
      { who: "Fund managers", because: "a scalable vehicle that can be sold across borders (UCITS)" },
    ],
  },
  etf: {
    problem:
      "Mutual funds price once a day, which is awkward if you want to buy or sell at 11am. An ETF trades on an exchange like a share, while a creation-and-redemption mechanism keeps its price close to the value of the assets inside.",
    users: [
      { who: "All investor types", because: "cheap, instant, diversified exposure to an index or bond market in one trade" },
      { who: "Institutions", because: "ETFs are a fast way to move large allocations or park cash" },
      { who: "Market makers", because: "the arbitrage between the ETF and the underlying basket is itself a business" },
    ],
  },
  "private-fund": {
    problem:
      "Buying companies, lending to mid-sized businesses or building infrastructure takes years and cannot be done from a daily-dealing fund. A closed-ended fund locks capital up long enough to do the work.",
    users: [
      { who: "Pension funds and endowments", because: "long horizons let them accept illiquidity in exchange for higher expected returns" },
      { who: "Companies", because: "it is a source of capital and credit outside banks and public markets" },
      { who: "Managers", because: "committed capital allows long-term operational changes rather than quick trades" },
    ],
    withoutIt: "Long-dated, illiquid investments would have no natural home in the financial system.",
  },
  futures: {
    problem:
      "A farmer wants to know in March what wheat will pay in September; an airline wants to fix fuel costs. A future locks tomorrow's price today, and because an exchange stands in the middle with daily margin, neither party has to trust the other.",
    users: [
      { who: "Producers and consumers", because: "hedging removes price uncertainty from planning and budgets" },
      { who: "Asset managers", because: "index and bond futures adjust exposure quickly and cheaply without trading hundreds of securities" },
      { who: "Speculators", because: "their risk-taking supplies liquidity to the hedgers" },
    ],
  },
  option: {
    problem:
      "Sometimes you want protection but not an obligation: insure a portfolio against a crash while keeping the upside. An option is exactly that, paid for with a premium.",
    users: [
      { who: "Portfolio managers", because: "puts limit losses without selling the portfolio" },
      { who: "Companies", because: "caps and floors bound borrowing costs or currency moves" },
      { who: "Traders", because: "options express views on volatility and timing, not just direction" },
    ],
  },
  "interest-rate-swap": {
    problem:
      "A company borrows at a floating rate but budgets in fixed numbers. A swap exchanges its floating payments for fixed ones without touching the loan, so its interest bill stops moving with central bank policy.",
    users: [
      { who: "Corporate borrowers", because: "they can fix interest costs while keeping a flexible bank loan" },
      { who: "Pension funds and insurers", because: "swaps match long liabilities more precisely than buying bonds (the core of LDI)" },
      { who: "Banks", because: "they hedge the rate risk created by lending long and funding short" },
    ],
    withoutIt: "Borrowers would have to refinance to change rate exposure, and long-dated liabilities would be far harder to hedge.",
  },
  "credit-default-swap": {
    problem:
      "A bank has lent heavily to one company and does not want to damage the relationship by selling the loan. A CDS lets it buy protection against that borrower's default, transferring the risk while keeping the client.",
    users: [
      { who: "Banks and insurers", because: "they can manage concentration limits without exiting positions" },
      { who: "Investors", because: "index CDS hedges broad credit risk quickly and cheaply" },
      { who: "Everyone", because: "CDS spreads are a live market read on how risky a borrower is" },
    ],
    withoutIt: "Credit risk could only be reduced by selling the underlying bond or loan, often at a bad time.",
  },
  "fx-forward": {
    problem:
      "An exporter invoicing in dollars will not be paid for 90 days. If the dollar falls, the profit disappears. A forward fixes the exchange rate now, turning an unknown into a budget line.",
    users: [
      { who: "Importers and exporters", because: "margins survive currency swings" },
      { who: "Asset managers", because: "hedging the currency of foreign holdings isolates the investment decision" },
      { who: "Companies with foreign subsidiaries", because: "it stabilises reported earnings" },
    ],
  },
  "custody-service": {
    problem:
      "A pension fund owning securities in 40 countries cannot hold them itself: each market has its own depository, rules, tax forms and corporate action deadlines. A custodian holds everything, settles trades and collects the income.",
    users: [
      { who: "Asset managers and pension funds", because: "one provider covers safekeeping, settlement, income and reporting everywhere" },
      { who: "Regulators and clients", because: "segregated custody keeps client assets separate if a manager or broker fails" },
      { who: "Funds", because: "an independent depositary is legally required for UCITS and similar vehicles" },
    ],
    withoutIt: "Every investor would need local accounts and operations staff in each market they invest in.",
  },
  "ccp-clearing": {
    problem:
      "In a market with 100 participants trading with each other, everybody must assess everybody's creditworthiness. A CCP steps into the middle of each trade so each firm faces only one, heavily regulated counterparty, and the mountain of offsetting trades nets down to a fraction.",
    users: [
      { who: "Banks and brokers", because: "netting cuts settlement flows and capital charges dramatically" },
      { who: "Funds", because: "they get access to markets without judging each dealer's credit" },
      { who: "Regulators", because: "risk is concentrated where it can be measured, margined and supervised" },
    ],
    withoutIt: "One default can spread through a web of bilateral exposures, as Lehman showed in 2008.",
  },
  "csd-settlement": {
    problem:
      "The moment of truth in any trade is the swap: if you deliver shares and the buyer fails to pay, you lose everything. A CSD holds the securities centrally in book-entry form and moves them only against payment.",
    users: [
      { who: "Every buyer and seller", because: "delivery-versus-payment removes the risk of losing the whole principal" },
      { who: "Issuers", because: "the CSD keeps the authoritative record of who owns their securities" },
      { who: "Markets", because: "without a central record, paper certificates and reconciliation would cap trading volumes" },
    ],
    withoutIt: "The 1960s 'paperwork crisis', when US exchanges closed early because certificates could not be processed.",
  },
  "fund-administration": {
    problem:
      "A fund must produce one fair price per day, process every subscription and redemption, and keep a legal record of who owns what. Doing that in-house creates a conflict of interest, so it is given to independent specialists.",
    users: [
      { who: "Fund managers", because: "an independent NAV is what investors and regulators trust" },
      { who: "Investors and distributors", because: "orders, statements and tax reporting have to be right every day" },
      { who: "Regulators", because: "independent valuation and record-keeping protect investors from the manager marking its own homework" },
    ],
  },
  "tokenized-bond": {
    problem:
      "A normal bond issue involves a chain of agents, depositaries and custodians, takes about five days to close, and each party keeps its own record. Issuing directly on a shared ledger lets settlement happen in minutes with one record everyone reads.",
    users: [
      { who: "Frequent issuers (EIB, World Bank, HK Government)", because: "faster closing, fewer intermediaries and a live view of who holds the bond" },
      { who: "Banks", because: "it is the practical way to learn how tokenized markets behave before they scale" },
      { who: "Investors", because: "coupons and redemptions pay automatically, with fewer reconciliation breaks" },
    ],
    withoutIt: "Nothing breaks: the traditional market works. The gain is operational cost and speed, which is why issues are still small.",
  },
  "tokenized-mmf": {
    problem:
      "On-chain investors face a choice between stablecoins, which pay no interest, and traditional funds, which settle slowly. A tokenized money market fund pays T-bill yield and moves at chain speed, and can be pledged as collateral while still earning.",
    users: [
      { who: "Crypto funds and exchanges", because: "idle margin earns Treasury yield instead of nothing" },
      { who: "Corporate treasuries on-chain", because: "it is a cash-equivalent with 24/7 transferability" },
      { who: "Banks in pilots", because: "fund units posted as derivatives margin move instantly instead of overnight" },
    ],
    withoutIt: "Billions of dollars on-chain sit in non-interest-bearing stablecoins.",
  },
  "intraday-tokenized-repo": {
    problem:
      "A bank may need billions for only a few hours to cover payments, but classic repo has an overnight minimum and settles in batch windows. Tokenized repo prices the loan by the hour and unwinds itself automatically.",
    users: [
      { who: "Large banks", because: "intraday liquidity buffers are expensive, and borrowing for four hours is cheaper than for a night" },
      { who: "Dealers", because: "collateral can be mobilised in minutes across entities and time zones" },
      { who: "Treasurers of financial groups", because: "cash can be moved to where it is needed precisely when it is needed" },
    ],
    withoutIt: "Banks hold larger idle liquidity buffers, which is capital that earns nothing.",
  },
  "tokenized-stock": {
    problem:
      "Stock exchanges close at night and in many countries buying US shares is difficult or expensive. A tokenized share trades 24/7 in small fractions on the same rails as crypto, though what you legally own varies by structure.",
    users: [
      { who: "Investors outside the US", because: "access to US equities without a US brokerage account, in small amounts" },
      { who: "Crypto-native traders", because: "equity exposure without leaving the chain, usable as collateral" },
      { who: "Brokers and exchanges", because: "a way to offer round-the-clock trading of familiar assets" },
    ],
    withoutIt: "The same exposure exists through brokers and ETFs, with clearer legal rights but market hours and minimums.",
  },
  "defi-lending-pool": {
    problem:
      "Lending on a blockchain has no courts, no credit files and no way to chase a borrower. The solution is to demand more collateral than the loan and let code sell it automatically the moment the cushion runs out.",
    users: [
      { who: "Token holders who want liquidity", because: "they can borrow stablecoins without selling their holdings and triggering tax" },
      { who: "Lenders", because: "they earn a variable yield on idle stablecoins, secured by over-collateralisation" },
      { who: "Traders", because: "it is the main source of leverage on-chain, with no application process" },
    ],
    withoutIt: "On-chain credit would require identity, courts and enforcement, none of which exist natively.",
  },
};

/** The real institution that typically plays each role in a product's flow diagram. */
export const partyExamples: Record<string, Record<string, string>> = {
  "central-bank-reserves": { cb: "fed", a: "jpmorgan", b: "bofa" },
  "bank-deposit": { bank: "hsbc", cb: "ecb" },
  "rtgs-payment": { a: "deutschebank", rtgs: "ecb", b: "bnpparibas", payer: "siemens" },
  "correspondent-payment": { s: "standardchartered", c1: "citi", c2: "jpmorgan", r: "deutschebank" },
  stablecoin: { issuer: "circle", reserve: "bny", chain: "ethereum" },
  "tokenized-deposit": { bank: "kinexys", corpA: "siemens" },
  "wholesale-cbdc": { cb: "snb", bank: "ubs", dlt: "sdx" },
  "treasury-bill": { tsy: "fed", pd: "goldman", mmf: "fidelity" },
  "commercial-paper": { corp: "siemens", dealer: "jpmorgan", ipa: "citi", inv: "federated" },
  "certificate-of-deposit": { bank: "bnpparibas", inv: "blackrock" },
  "money-market-fund": { fund: "blackrock", ta: "ssandc", inv: "siemens" },
  repo: { borrower: "goldman", lender: "fidelity" },
  "tri-party-repo": { agent: "bny", giver: "morganstanley", taker: "vanguard" },
  "securities-loan": { owner: "nbim", agent: "statestreet", borrower: "morganstanley" },
  "fx-swap": { jp: "gpif", bank: "mufg" },
  "margin-loan": { pb: "goldman" },
  "government-bond": { pd: "bofa", inv: "calpers", csd: "euroclear" },
  "corporate-bond": { corp: "siemens", book: "goldman", inv: "pimco", agent: "citi" },
  "covered-bond": { bank: "nordea", inv: "allianz" },
  "securitisation-abs": { orig: "figure", inv: "pimco", servicer: "figure" },
  "green-bond": { iss: "eib", rev: "spglobal", inv: "amundi" },
  "common-share": { co: "siemens", uw: "morganstanley", ex: "nyse", ccp: "dtcc", inv: "vanguard" },
  "mutual-fund": { plat: "calastone", ta: "ssandc", fund: "amundi", dep: "caceis" },
  etf: { etf: "blackrock", ap: "jpmorgan", ex: "nyse", inv: "vanguard" },
  "private-fund": { gp: "kkr", lp: "gpif" },
  futures: { ccp: "cme", fcm: "morganstanley" },
  option: { ccp: "occ", writer: "citadel" },
  "interest-rate-swap": { ccp: "lch", bank: "jpmorgan", corp: "siemens" },
  "credit-default-swap": { buyer: "deutschebank", seller: "pimco" },
  "fx-forward": { bank: "ubs" },
  "custody-service": { gc: "bny", sub: "citi", csd: "euroclear", am: "amundi" },
  "ccp-clearing": { ccp: "lch", a: "goldman", b: "barclays" },
  "csd-settlement": { csd: "euroclear", rtgs: "ecb", seller: "bny", buyer: "statestreet" },
  "fund-administration": { admin: "ssandc", ta: "ssandc", cust: "statestreet", dist: "calastone" },
  "tokenized-bond": { iss: "eib", plat: "hsbc", cash: "snb" },
  "tokenized-mmf": { ta: "securitize", fund: "blackrock", venue: "coinbase" },
  "intraday-tokenized-repo": { a: "jpmorgan", b: "goldman", ledger: "kinexys" },
  "tokenized-stock": { issuer: "backed", broker: "coinbase" },
  "defi-lending-pool": { pool: "aave" },
};
