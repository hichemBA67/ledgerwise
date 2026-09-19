import type { Topic } from "../types";

export const tokenization: Topic[] = [
  {
    slug: "tokenization-101",
    title: "Tokenization 101",
    track: "tokenization",
    level: "Beginner",
    minutes: 14,
    summary:
      "What it means to represent a financial asset as a token on a programmable ledger, and what actually changes (and what doesn't).",
    objectives: [
      "Distinguish native digital issuance from tokenized (wrapped) assets",
      "Explain the tokenization value chain",
      "Evaluate realistic benefits vs hype",
    ],
    blocks: [
      { type: "h", text: "Definition" },
      {
        type: "p",
        text: "**Tokenization** is recording claims on real-world or financial assets as **tokens** on a programmable, shared ledger (a blockchain or other DLT). The token carries ownership information and rules (who may hold it, how it pays income, how it settles), enforced by **smart contracts**.",
      },
      {
        type: "compare",
        left: {
          title: "Native (digital-first) issuance",
          points: [
            "The ledger IS the legal register",
            "e.g. Siemens eWpG crypto securities, EIB digital bonds, SDX bonds",
            "Requires legal recognition (eWpG, Swiss DLT Act, DLT Pilot)",
          ],
        },
        right: {
          title: "Tokenized / wrapped (digital twin)",
          points: [
            "Asset stays in traditional custody/CSD; token mirrors it",
            "e.g. many tokenized MMFs, tokenized gold, Treasury tokens",
            "Easier to launch, but two records must stay in sync",
          ],
        },
      },
      { type: "h", text: "The tokenization stack" },
      {
        type: "flow",
        steps: [
          { label: "Asset", detail: "Bond, fund share, deposit, loan, real estate" },
          { label: "Legal wrapper", detail: "Direct issuance, SPV, fund share class, trust" },
          { label: "Token standard", detail: "ERC-20, ERC-3643, ERC-1400, Canton/Daml templates" },
          { label: "Ledger", detail: "Public (Ethereum, Polygon, Solana, Stellar) or permissioned (Canton, Kinexys, GS DAP)" },
          { label: "Cash leg", detail: "Stablecoin, tokenized deposit, wCBDC, RTGS link" },
          { label: "Distribution & custody", detail: "Wallets, custodians, transfer agents, venues" },
        ],
      },
      { type: "h", text: "What changes" },
      {
        type: "list",
        items: [
          "**Atomic settlement**: asset and cash swap in one indivisible step (T+0).",
          "**Single source of truth**: fewer reconciliations between custodians, CSDs, agents.",
          "**Programmability**: coupons, redemptions, compliance checks and margining as code.",
          "**24/7 operation and fractionalisation**: smaller ticket sizes, round-the-clock transfer.",
          "**Composability**: a token can be used as collateral in another contract without moving between systems.",
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "What doesn't change",
        text: "Credit risk of the issuer, market risk, securities law, investor protection, KYC/AML, tax and insolvency law all still apply. A tokenized junk bond is still a junk bond. And liquidity doesn't appear by magic: many early tokenized assets saw very little secondary trading.",
      },
      {
        type: "stats",
        items: [
          { value: "$25B+", label: "Tokenized RWAs on public chains ex-stablecoins (2025)", source: "rwa.xyz" },
          { value: "$250B+", label: "Stablecoin supply (2025)", source: "DefiLlama" },
          { value: "Trillions", label: "Monthly volume on permissioned repo ledgers (Broadridge DLR, Kinexys)", source: "Company reports" },
        ],
      },
      {
        type: "players",
        title: "Key builders",
        ids: ["blackrock", "franklin", "securitize", "kinexys", "broadridge", "digitalasset", "ondo", "hsbc"],
      },
    ],
    bridge: {
      slug: "financial-markets-map",
      text: "Refresh the traditional trade lifecycle that tokenization compresses.",
    },
    players: ["blackrock", "securitize", "kinexys", "broadridge", "digitalasset", "ethereum"],
    quiz: [
      {
        q: "A Siemens bond issued directly into a crypto securities register under Germany's eWpG is:",
        options: ["A wrapped digital twin", "A native digital security", "A stablecoin", "A derivative"],
        answer: 1,
        explain: "Under eWpG the crypto securities register is the legal record, so it's native issuance.",
      },
      {
        q: "Which risk does tokenization NOT remove?",
        options: ["Reconciliation effort", "Settlement lag", "Issuer credit risk", "Manual corporate action processing"],
        answer: 2,
        explain: "The issuer can still default. Tokenization changes the rails, not the credit.",
      },
      {
        q: "ERC-3643 is:",
        options: [
          "A permissioned token standard with built-in identity/compliance checks",
          "A stablecoin",
          "A CBDC",
          "An EU regulation",
        ],
        answer: 0,
        explain: "ERC-3643 (originating from Tokeny's T-REX) enforces transfer rules based on verified identities.",
      },
    ],
    sources: [
      { label: "BIS – Tokenisation in the context of money and other assets (CPMI, 2024)", url: "https://www.bis.org/cpmi/publ/d225.htm" },
      { label: "rwa.xyz – Tokenized asset data", url: "https://app.rwa.xyz/" },
    ],
  },
  {
    slug: "blockchain-for-finance",
    title: "Blockchains for finance",
    track: "tokenization",
    level: "Intermediate",
    minutes: 16,
    summary:
      "Public vs permissioned ledgers, smart contracts, token standards, privacy, oracles and interoperability: the tech choices institutions make.",
    objectives: [
      "Compare public, public-permissioned and private ledgers",
      "Know the main token standards and networks",
      "Understand privacy and interoperability solutions",
    ],
    blocks: [
      { type: "h", text: "Ledger choices" },
      {
        type: "table",
        headers: ["Model", "Who validates", "Examples", "Pros / cons"],
        rows: [
          ["Public permissionless", "Anyone", "Ethereum, Solana, Stellar, Avalanche C-chain", "Reach, composability, liquidity / privacy & control concerns"],
          ["Public, permissioned tokens", "Anyone validates; tokens restrict holders", "BUIDL, BENJI on public chains with whitelists", "Best of both for many issuers"],
          ["Permissioned / consortium", "Known institutions", "Canton, Kinexys, GS DAP, HSBC Orion, Partior", "Privacy, control / smaller network, silos"],
          ["Layer 2 / app chains", "Rollup operators, subnets", "Arbitrum, Base, Polygon, Avalanche L1s, ZKsync", "Cheaper, configurable / bridging risk"],
        ],
      },
      { type: "h", text: "Smart contracts & token standards" },
      {
        type: "list",
        items: [
          "**ERC-20**: fungible token standard (most stablecoins, many fund tokens).",
          "**ERC-3643 (T-REX)** and **ERC-1400**: security tokens with on-chain identity, transfer restrictions, forced transfers and recovery.",
          "**Daml** (Canton): contracts with built-in privacy, where only parties to a contract see it.",
          "**Oracles** (e.g. Chainlink): bring off-chain data such as NAVs, prices and proof-of-reserve on-chain.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Regulated features institutions need",
        text: "Allow-lists (only KYC'd wallets), freeze and forced transfer (court orders, lost keys), pausing, role-based admin keys, auditability and privacy of positions. These are why security token standards differ from open crypto tokens.",
      },
      { type: "h", text: "Privacy" },
      {
        type: "p",
        text: "Banks can't reveal positions and counterparties on a public ledger. Solutions include permissioned subnets, **zero-knowledge proofs** (e.g. JPMorgan/Kinexys and Polygon work, ZKsync-based bank chains), Canton's sub-transaction privacy, and confidential tokens.",
      },
      { type: "h", text: "Interoperability" },
      {
        type: "p",
        text: "Fragmentation is the main risk: an asset on chain A and cash on chain B can't settle atomically without a bridge. Approaches include **Swift** connecting banks to multiple ledgers (Chainlink CCIP experiments in 2023, a Swift shared ledger with Consensys announced in 2025), the BIS **unified ledger** concept (Project Agorá), and cross-chain protocols. The **Global Layer One (GL1)** initiative led by MAS aims at common, regulated public infrastructure.",
      },
      {
        type: "players",
        title: "Networks & tech",
        ids: ["ethereum", "polygon", "stellar", "avalanche", "solana", "digitalasset", "chainlink", "swift"],
      },
    ],
    bridge: {
      slug: "atomic-settlement-and-dlt-fmi",
      text: "How these ledgers deliver DvP and where they plug into existing FMIs.",
    },
    players: ["ethereum", "polygon", "digitalasset", "chainlink", "swift", "kinexys"],
    quiz: [
      {
        q: "BlackRock's BUIDL on Ethereum is best described as:",
        options: [
          "A permissioned token on a public permissionless chain",
          "A private bank ledger",
          "A CBDC",
          "An unregulated crypto token",
        ],
        answer: 0,
        explain: "Anyone can validate Ethereum, but only whitelisted investors can hold BUIDL tokens.",
      },
      {
        q: "What does an oracle do?",
        options: ["Mines blocks", "Brings off-chain data on-chain", "Stores private keys", "Issues stablecoins"],
        answer: 1,
        explain: "Oracles feed external data (prices, NAVs, reserves) to smart contracts.",
      },
    ],
  },
  {
    slug: "stablecoins-and-tokenized-cash",
    title: "Stablecoins, tokenized deposits & wCBDC",
    track: "tokenization",
    level: "Intermediate",
    minutes: 18,
    summary:
      "The cash leg of tokenized finance: fiat-backed stablecoins, bank deposit tokens, wholesale CBDC and bridges to RTGS systems.",
    objectives: [
      "Compare the three forms of on-chain money",
      "Explain the reserve model and risks of stablecoins",
      "Summarise the main stablecoin regimes: GENIUS Act, MiCA, HK, Singapore",
    ],
    blocks: [
      { type: "h", text: "Three forms of on-chain money" },
      {
        type: "table",
        headers: ["", "Stablecoin", "Tokenized deposit", "Wholesale CBDC"],
        rows: [
          ["Issuer", "Non-bank (e-money / trust)", "Commercial bank", "Central bank"],
          ["Backing", "Reserves: T-bills, repo, bank deposits", "Bank balance sheet, deposit insurance (varies)", "Central bank liability"],
          ["Who holds", "Anyone with a wallet (KYC at on/off-ramp)", "Bank clients", "Banks, FMIs"],
          ["Examples", "USDC, USDT, EURC, PYUSD, EURCV", "Kinexys (JPM Coin, JPMD), Citi Token Services, HSBC TDS", "SNB Helvetia, mBridge; ECB Pontes (RTGS link)"],
          ["Key risk", "Reserve quality, run risk, depeg", "Bank credit risk; interoperability", "Policy & design; limited reach"],
        ],
      },
      { type: "h", text: "How a fiat-backed stablecoin works" },
      {
        type: "flow",
        steps: [
          { label: "Mint", detail: "Client wires $1m to issuer; issuer mints 1m tokens" },
          { label: "Reserves", detail: "Issuer invests in T-bills, repo, MMFs, bank deposits" },
          { label: "Circulate", detail: "Tokens move 24/7 on chains; used for trading, DvP, payments" },
          { label: "Redeem", detail: "Client returns tokens; issuer burns them and pays $1m" },
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "Depeg lessons",
        text: "In March 2023 USDC briefly traded near $0.88 when about $3.3bn of its reserves were stuck at failing Silicon Valley Bank. Terra's algorithmic UST collapsed completely in May 2022. Reserve quality, segregation and redemption rights are what regulation now targets.",
      },
      { type: "h", text: "Regimes" },
      {
        type: "table",
        headers: ["Jurisdiction", "Framework", "Key points"],
        rows: [
          ["US", "GENIUS Act (signed July 2025)", "Federal framework for payment stablecoins; 1:1 reserves in cash, T-bills, repo; issuer licensing; no interest to holders"],
          ["EU", "MiCA (stablecoin rules from June 2024)", "EMTs and ARTs; issuer must be credit or e-money institution; caps on non-euro stablecoins used for payments"],
          ["Hong Kong", "Stablecoins Ordinance (effective Aug 2025)", "HKMA licensing of fiat-referenced stablecoin issuers"],
          ["Singapore", "MAS stablecoin framework (2023)", "Single-currency stablecoins pegged to SGD or G10; reserve & redemption rules"],
          ["Japan", "Payment Services Act (2023)", "Stablecoins issued by banks, trust companies, fund transfer providers"],
          ["UAE", "CBUAE Payment Token Services Regulation (2024)", "Only licensed AED tokens for payments onshore"],
        ],
      },
      { type: "h", text: "Wholesale CBDC and RTGS bridges" },
      {
        type: "list",
        items: [
          "**Project Helvetia (SNB)**: wholesale CHF CBDC issued on SIX Digital Exchange, live pilot since Dec 2023, used to settle real digital bonds.",
          "**ECB Pontes**: links DLT platforms to TARGET services for settlement in central bank money, following 2024 trials (Bundesbank trigger, Banque de France full DLT, Banca d'Italia TIPS Hash-Link). Pilot planned for 2026; long-term track called Appia.",
          "**BIS Project Agorá**: 7 central banks + 40 firms testing tokenized correspondent banking on a unified ledger.",
          "**Fnality**: a sterling payment system backed by funds at the Bank of England, live since Dec 2023.",
          "**Partior**: JPMorgan, DBS, Standard Chartered and Temasek's multi-currency settlement network.",
        ],
      },
    ],
    bridge: {
      slug: "money-and-banking",
      text: "Revisit the money hierarchy that decides which on-chain cash is safest.",
    },
    players: ["circle", "tether", "paypal", "sgforge", "kinexys", "citi", "hsbc", "snb", "ecb", "fnality", "partior"],
    quiz: [
      {
        q: "A tokenized deposit is a liability of:",
        options: ["The central bank", "A commercial bank", "A stablecoin issuer", "The blockchain"],
        answer: 1,
        explain: "Deposit tokens are ordinary bank deposits recorded on a ledger.",
      },
      {
        q: "Under the US GENIUS Act, payment stablecoin issuers:",
        options: [
          "Can pay interest to holders",
          "Must hold 1:1 high-quality reserves such as cash and T-bills",
          "Can be algorithmic",
          "Are unregulated",
        ],
        answer: 1,
        explain: "1:1 reserves in cash, short T-bills and similar, and a ban on paying interest to holders.",
      },
      {
        q: "What caused USDC's March 2023 depeg?",
        options: ["A smart contract hack", "Reserves stuck at Silicon Valley Bank", "An algorithm failure", "A regulatory ban"],
        answer: 1,
        explain: "About $3.3bn of reserves were at SVB when it failed; the peg recovered after the FDIC backstop.",
      },
    ],
    sources: [
      { label: "ECB – Pontes & Appia", url: "https://www.ecb.europa.eu/paym/integration/distributed/html/index.en.html" },
      { label: "BIS – Project Agorá", url: "https://www.bis.org/about/bisih/topics/fmis/agora.htm" },
    ],
  },
  {
    slug: "digital-asset-custody",
    title: "Digital asset custody",
    track: "tokenization",
    level: "Intermediate",
    minutes: 15,
    summary:
      "Keys are the asset: HSMs, MPC, cold/warm/hot wallets, qualified custodians and how banks entered the market after SAB 121 was rescinded.",
    objectives: [
      "Explain key management models (HSM, MPC, multisig)",
      "Compare self-custody, third-party and bank custody",
      "Summarise the regulatory landscape for digital custody",
    ],
    blocks: [
      { type: "h", text: "Keys = control" },
      {
        type: "p",
        text: "On a blockchain, whoever controls the **private key** can move the tokens. Digital custody is therefore about generating, storing and using keys safely, while also providing the classic custody services: segregation, reporting, asset servicing and insolvency protection.",
      },
      {
        type: "table",
        headers: ["Technology", "How it works", "Used by"],
        rows: [
          ["HSM", "Keys live in tamper-proof hardware security modules", "Banks, Taurus, Metaco (Ripple), Anchorage"],
          ["MPC", "Key split into shares; signing without ever reassembling the key", "Fireblocks, Copper, BitGo, Zodia"],
          ["Multisig", "M-of-N on-chain signatures required", "DAOs, some custodians"],
          ["Cold / warm / hot", "Offline vs semi-online vs online signing", "All custodians mix these tiers"],
        ],
      },
      { type: "h", text: "Custody models" },
      {
        type: "compare",
        left: {
          title: "Institutional third-party custody",
          points: [
            "Qualified custodian, segregated accounts",
            "Insurance, SOC reports, audited controls",
            "Examples: Coinbase Custody, Anchorage Digital, BitGo, BNY, State Street",
          ],
        },
        right: {
          title: "Self-custody / tech providers",
          points: [
            "Firm runs its own wallets with vendor tech",
            "Fireblocks, Taurus, Ripple Custody (Metaco)",
            "Full control, full operational responsibility",
          ],
        },
      },
      {
        type: "callout",
        tone: "info",
        title: "SAB 121 → SAB 122",
        text: "SEC Staff Accounting Bulletin 121 (2022) required custodians to put client crypto on their own balance sheet, which made bank custody capital-intensive. It was rescinded by SAB 122 in January 2025, opening the door for more US banks to offer digital asset custody.",
      },
      {
        type: "list",
        items: [
          "**US**: qualified custodian rules for advisers; OCC trust charters (Anchorage Digital Bank); state trust companies (NYDFS).",
          "**EU**: MiCA licenses crypto-asset custody (CASPs); tokenized securities fall under MiFID/CSDR custody rules.",
          "**Switzerland**: DLT Act gives segregation of crypto assets in bankruptcy.",
          "**Basel**: the prudential standard for banks' crypto exposures, due to take effect 1 January 2026 and under review.",
        ],
      },
      {
        type: "players",
        title: "Digital custody landscape",
        ids: ["coinbase", "anchorage", "bitgo", "fireblocks", "taurus", "ripple", "zodia", "copper", "bny", "statestreet"],
      },
    ],
    bridge: {
      slug: "custody",
      text: "Compare with the traditional global custodian and sub-custody chain.",
    },
    players: ["coinbase", "anchorage", "bitgo", "fireblocks", "taurus", "zodia"],
    quiz: [
      {
        q: "MPC custody means:",
        options: [
          "Keys stored on paper",
          "The key is split into shares and signing happens without reconstructing it",
          "A single employee holds the key",
          "The blockchain holds the key",
        ],
        answer: 1,
        explain: "Multi-party computation removes the single point of compromise.",
      },
      {
        q: "What did SAB 122 do in January 2025?",
        options: ["Banned crypto custody", "Rescinded SAB 121's balance-sheet requirement", "Created MiCA", "Approved Bitcoin ETFs"],
        answer: 1,
        explain: "It removed the on-balance-sheet treatment that deterred bank custody.",
      },
    ],
  },
  {
    slug: "atomic-settlement-and-dlt-fmi",
    title: "Atomic settlement & DLT market infrastructure",
    track: "tokenization",
    level: "Advanced",
    minutes: 18,
    summary:
      "DvP on a single ledger, cross-chain settlement, the liquidity cost of losing netting, and the new DLT FMIs: SDX, 21X, D7, D-FMI and more.",
    objectives: [
      "Explain atomic DvP and why it removes principal risk",
      "Weigh T+0 benefits against liquidity and netting costs",
      "Map the DLT FMIs live in Europe, Switzerland and Asia",
    ],
    blocks: [
      { type: "h", text: "Atomic DvP" },
      {
        type: "p",
        text: "In an **atomic** swap, a smart contract moves the security token to the buyer and the cash token to the seller in one transaction: either both happen or neither does. That's DvP model 1 by design, with no settlement window and no principal risk.",
      },
      { type: "widget", kind: "settlement" },
      {
        type: "compare",
        left: {
          title: "Benefits",
          points: [
            "No settlement or Herstatt risk",
            "No fails from mismatched instructions",
            "Collateral and cash freed instantly",
            "24/7 and cross-border by default",
          ],
        },
        right: {
          title: "Costs & challenges",
          points: [
            "Loses multilateral netting, so needs pre-funding (more liquidity)",
            "Needs cash on the same ledger or an interop bridge",
            "Legal finality must be recognised (SFD, DLT Act)",
            "Short-selling and sec lending must adapt to T+0",
          ],
        },
      },
      { type: "h", text: "Cross-ledger settlement" },
      {
        type: "list",
        items: [
          "**Same ledger**: asset and cash on one chain (e.g. SDX with SNB wCBDC).",
          "**Hash-time-locked contracts (HTLC)**: lock asset on chain A until a secret revealed on chain B releases cash (Banca d'Italia TIPS Hash-Link).",
          "**Trigger solutions**: DLT event triggers an RTGS payment (Bundesbank trigger, used by Siemens 2024 bond).",
          "**Interop protocols**: Swift, Chainlink CCIP, Canton global synchronizer.",
        ],
      },
      { type: "h", text: "DLT market infrastructures" },
      {
        type: "table",
        headers: ["FMI", "Jurisdiction", "What it does"],
        rows: [
          ["SIX Digital Exchange (SDX)", "Switzerland", "Regulated DLT CSD & exchange; settles with SNB wCBDC in Helvetia"],
          ["BX Digital", "Switzerland", "FINMA-licensed DLT trading facility (2024)"],
          ["21X", "Germany / EU", "First DLT trading & settlement system (DLT TSS) licence under the DLT Pilot Regime (Dec 2024)"],
          ["Clearstream D7", "Germany / Lux", "Digital post-trade platform for eWpG electronic securities"],
          ["Euroclear D-FMI", "Belgium", "DLT issuance & settlement for digital bonds (2023)"],
          ["HSBC Orion", "UK / HK", "Digital assets platform used for EIB and HK Government digital bonds"],
          ["GS DAP", "US / global", "Goldman's DLT platform; EIB and HK green bond issuances"],
          ["Broadridge DLR", "US", "Distributed ledger repo platform, very high daily volumes"],
          ["DTCC Project Ion", "US", "Parallel DLT settlement of equities (100k+ trades/day in pilot)"],
        ],
      },
      {
        type: "callout",
        tone: "token",
        title: "The realistic path",
        text: "Most regulators and FMIs expect a long period of coexistence: DLT islands linked to existing RTGS systems and CSDs, 'T+0 when you want it' rather than for everything, and gradual migration of issuance where the benefits are highest (repo, collateral, funds, SSA bonds).",
      },
    ],
    bridge: {
      slug: "settlement-and-csds",
      text: "Compare with how CSDs, T2S and T+1 settlement work today.",
    },
    players: ["six", "sdx", "21x", "clearstream", "euroclear", "hsbc", "goldman", "broadridge", "dtcc", "ecb", "snb"],
    quiz: [
      {
        q: "The main liquidity cost of real-time atomic settlement is:",
        options: ["Higher trading fees", "Loss of netting, requiring pre-funding", "More settlement fails", "Longer settlement"],
        answer: 1,
        explain: "Without netting each trade must be funded gross at the moment it settles.",
      },
      {
        q: "Which institution received the first DLT TSS licence under the EU DLT Pilot Regime?",
        options: ["SDX", "21X", "Euroclear", "Broadridge"],
        answer: 1,
        explain: "21X was authorised by BaFin in December 2024.",
      },
      {
        q: "The Bundesbank 'trigger solution' does what?",
        options: [
          "Mints a euro stablecoin",
          "Lets a DLT event trigger a payment in central bank money via TARGET",
          "Replaces T2S",
          "Clears derivatives",
        ],
        answer: 1,
        explain: "It links on-chain settlement to central bank money without a wholesale CBDC.",
      },
    ],
  },
];
