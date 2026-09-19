import type { Topic } from "../types";

export const regulation: Topic[] = [
  {
    slug: "tradfi-regulation",
    title: "The post-2008 rulebook",
    track: "regulation",
    level: "Intermediate",
    minutes: 14,
    summary:
      "Basel III, PFMI, Dodd-Frank, EMIR, MiFID II, CSDR, SFTR: the global rulebook that shapes repo, clearing, custody and settlement.",
    objectives: [
      "Map the global standard setters to national rules",
      "Link each regulation to the market it shapes",
      "Understand why capital rules move repo and sec lending markets",
    ],
    blocks: [
      { type: "h", text: "Standard setters" },
      {
        type: "list",
        items: [
          "**FSB**: G20 coordinator for financial stability.",
          "**BCBS (Basel Committee)**: bank capital & liquidity (Basel III, crypto standard).",
          "**CPMI-IOSCO**: principles for FMIs (PFMI) covering CCPs, CSDs and payment systems.",
          "**IOSCO**: securities markets and funds (MMF recommendations).",
        ],
      },
      {
        type: "table",
        headers: ["Area", "US", "EU", "UK"],
        rows: [
          ["Bank capital & liquidity", "Basel III endgame (Fed/OCC/FDIC)", "CRR III / CRD VI", "PRA Basel 3.1"],
          ["Derivatives clearing", "Dodd-Frank Title VII (CFTC/SEC)", "EMIR / EMIR 3", "UK EMIR"],
          ["Trading & transparency", "Reg NMS, TRACE", "MiFID II / MiFIR", "UK MiFIR (Wholesale Markets Review)"],
          ["Settlement & CSDs", "SEC T+1, DTC rules", "CSDR, T2S; T+1 in 2027", "CREST; T+1 in 2027"],
          ["Securities financing", "SEC 10c-1a; Treasury clearing mandate", "SFTR", "UK SFTR"],
          ["Money market funds", "SEC Rule 2a-7", "MMFR", "UK MMFR"],
          ["Operational resilience", "Interagency guidance", "DORA (from Jan 2025)", "PRA/FCA op-res rules"],
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Why capital rules shape repo",
        text: "The Basel III **leverage ratio** counts repo balance sheet regardless of collateral quality, which makes low-margin repo expensive for banks, especially at quarter ends. Netting via CCPs (FICC, LCH RepoClear) reduces balance sheet use. That's a big reason cleared and sponsored repo grew.",
      },
    ],
    bridge: {
      slug: "tokenization-regulation",
      text: "See how the same regulators handle tokenized securities, stablecoins and DLT FMIs.",
    },
    players: ["fsb", "bis", "sec", "esma", "fca", "fed", "ecb"],
    quiz: [
      {
        q: "Which EU regulation governs central counterparties and derivatives clearing?",
        options: ["MiFID II", "EMIR", "CSDR", "UCITS"],
        answer: 1,
        explain: "The European Market Infrastructure Regulation covers OTC derivatives, CCPs and trade repositories.",
      },
      {
        q: "The PFMI are issued by:",
        options: ["ECB", "CPMI-IOSCO", "SEC", "FSB alone"],
        answer: 1,
        explain: "The Principles for Financial Market Infrastructures (2012) come from CPMI and IOSCO.",
      },
    ],
  },
  {
    slug: "tokenization-regulation",
    title: "Regulating tokenization worldwide",
    track: "regulation",
    level: "Advanced",
    minutes: 18,
    summary:
      "MiCA, the DLT Pilot Regime, Germany's eWpG, Swiss DLT Act, the US GENIUS Act and SEC stance, MAS Project Guardian, HK Ensemble, Japan's STO rules and UAE regimes.",
    objectives: [
      "Apply 'same activity, same risk, same regulation' to tokenized assets",
      "Compare legal bases for DLT securities by jurisdiction",
      "Know the sandboxes and central bank projects in each hub",
    ],
    blocks: [
      { type: "h", text: "Guiding principle" },
      {
        type: "p",
        text: "Almost every regulator follows **technology neutrality**: a tokenized bond is still a bond (a MiFID financial instrument in the EU, a security under US law), and it's regulated as such. New laws mostly (1) recognise ledgers as valid registers, (2) regulate genuinely new instruments like stablecoins and crypto-assets, and (3) create sandboxes for DLT FMIs.",
      },
      {
        type: "table",
        headers: ["Jurisdiction", "Tokenized securities", "Stablecoins / crypto", "Sandbox / CB projects"],
        rows: [
          ["EU", "MiFID/CSDR apply; DLT Pilot Regime (since Mar 2023)", "MiCA (fully applicable Dec 2024)", "ECB Pontes & Appia; DLT Pilot (21X, 360X, CSD Prague)"],
          ["Germany", "eWpG (2021): electronic & crypto securities registers", "MiCA + BaFin", "Bundesbank trigger solution"],
          ["Luxembourg / France", "Blockchain laws I–IV; DEEP register (2017)", "MiCA", "Banque de France wCBDC experiments"],
          ["Switzerland", "DLT Act (2021): ledger-based securities", "FINMA guidance; stablecoin guidance", "SNB Helvetia; SDX, BX Digital"],
          ["UK", "Digital Securities Sandbox (2024); DIGIT digital gilt pilot", "New stablecoin & crypto regime being phased in", "BoE/FCA DSS"],
          ["US", "Securities laws apply; SEC 'Project Crypto' (2025)", "GENIUS Act (July 2025); market structure bill in Congress", "DTCC, Fed pilots; OCC charters"],
          ["Singapore", "SFA applies; MAS tokenization guidance", "Stablecoin framework (2023); PSA", "Project Guardian, GL1, Orchid"],
          ["Hong Kong", "SFC tokenized securities circulars (2023)", "Stablecoins Ordinance (Aug 2025); VATP licensing", "Project Ensemble, mBridge"],
          ["Japan", "Security tokens under FIEA (2020)", "PSA stablecoin regime (2023)", "Progmat, ODX START market"],
          ["UAE", "ADGM/DIFC frameworks; SCA", "VARA (Dubai), CBUAE payment tokens", "mBridge; ADGM sandbox"],
        ],
      },
      { type: "h", text: "EU DLT Pilot Regime in detail" },
      {
        type: "list",
        items: [
          "Three licence types: **DLT MTF**, **DLT SS** (settlement system) and **DLT TSS** (trading + settlement).",
          "Temporary exemptions from CSDR/MiFID rules (e.g. allowing direct retail access, settlement in e-money tokens).",
          "Size caps: shares of issuers < €500m market cap, bonds < €1bn issue size, UCITS < €500m, and total €6bn per infrastructure. Reform proposals aim to raise these.",
        ],
      },
      { type: "h", text: "Bank capital for crypto exposures" },
      {
        type: "table",
        headers: ["Basel group", "What", "Treatment"],
        rows: [
          ["Group 1a", "Tokenized traditional assets", "Same as underlying (plus infrastructure risk add-on)"],
          ["Group 1b", "Stablecoins meeting redemption & reserve tests", "Based on underlying reserve assets"],
          ["Group 2", "Unbacked crypto, non-qualifying stablecoins", "Up to 1250% risk weight; exposure limits"],
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "Explore the full comparison",
        text: "The [Global comparison](/compare) page puts all eight jurisdictions side by side: settlement cycles, CSDs, CCPs, RFRs, MMF regimes, stablecoin regimes and flagship tokenization projects.",
      },
    ],
    bridge: {
      slug: "tradfi-regulation",
      text: "The underlying rulebook that still applies to tokenized instruments.",
    },
    players: ["esma", "sec", "finma", "mas", "hkma", "sfc", "fsa-japan", "vara", "bis"],
    quiz: [
      {
        q: "Under MiCA, a tokenized bond is:",
        options: [
          "A crypto-asset regulated by MiCA",
          "Excluded from MiCA because it is a MiFID financial instrument",
          "An e-money token",
          "Unregulated",
        ],
        answer: 1,
        explain: "MiCA explicitly excludes crypto-assets that qualify as financial instruments.",
      },
      {
        q: "Which Swiss law introduced ledger-based securities?",
        options: ["FinSA", "DLT Act (2021)", "MiCA", "eWpG"],
        answer: 1,
        explain: "The Federal Act on the Adaptation of Federal Law to Developments in DLT.",
      },
      {
        q: "Under the Basel crypto standard, unbacked crypto like Bitcoin falls into:",
        options: ["Group 1a", "Group 1b", "Group 2", "It is exempt"],
        answer: 2,
        explain: "Group 2 exposures face up to 1250% risk weight.",
      },
    ],
    sources: [
      { label: "ESMA – DLT Pilot Regime", url: "https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/dlt-pilot-regime" },
      { label: "MAS – Project Guardian", url: "https://www.mas.gov.sg/schemes-and-initiatives/project-guardian" },
      { label: "BCBS – Prudential treatment of cryptoasset exposures", url: "https://www.bis.org/bcbs/publ/d545.htm" },
    ],
  },
];
