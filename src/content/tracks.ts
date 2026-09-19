import type { Track } from "./types";

export const tracks: Track[] = [
  {
    id: "foundations",
    title: "Foundations",
    short: "Money, markets, rates & risk",
    description:
      "The mental model everything else builds on: what money is, how markets are organised, how interest rates work and which risks matter.",
    color: "var(--track-foundations)",
    icon: "◎",
  },
  {
    id: "money-markets",
    title: "Money Markets & Funding",
    short: "Repo, sec lending, MMFs",
    description:
      "The overnight plumbing of finance: how banks, dealers and funds borrow cash and securities every single day.",
    color: "var(--track-money)",
    icon: "⇄",
  },
  {
    id: "fixed-income",
    title: "Bonds & Fixed Income",
    short: "Pricing, yield, duration, credit",
    description:
      "How bonds are built, issued, priced and traded, and why they are the natural first asset class for tokenization.",
    color: "var(--track-fixed)",
    icon: "▤",
  },
  {
    id: "infrastructure",
    title: "Market Infrastructure",
    short: "Custody, clearing, settlement, collateral",
    description:
      "The post-trade world: who holds the assets, who guarantees the trade and how ownership actually changes hands.",
    color: "var(--track-infra)",
    icon: "⌗",
  },
  {
    id: "tokenization",
    title: "Tokenization",
    short: "On-chain assets, cash & settlement",
    description:
      "How every topic above is being rebuilt on shared ledgers: tokenized bonds, funds, repo, collateral, cash and custody.",
    color: "var(--track-token)",
    icon: "◈",
  },
  {
    id: "regulation",
    title: "Regulation & Global View",
    short: "Rules, regimes and the world map",
    description:
      "How the US, EU, UK, Switzerland, Singapore, Hong Kong, Japan and the UAE regulate traditional and tokenized markets.",
    color: "var(--track-reg)",
    icon: "⚖",
  },
];

export const trackById = Object.fromEntries(tracks.map((t) => [t.id, t])) as Record<
  Track["id"],
  Track
>;
