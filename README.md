# Ledgerwise: from repo to tokenized repo

An open-source learning platform for the plumbing of finance (money markets, repo, securities lending, money market funds, bonds, custody, clearing and settlement) and how **tokenization** is rebuilding each of them.

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript** and **Tailwind CSS v4**. Every page is statically generated.

## What's inside

| Area | Contents |
| --- | --- |
| **The finance map** (`/map`) | The mental model: 7 layers (end users → products → markets → intermediaries → infrastructure → money → oversight) × 6 lifecycle stages (issue, trade, clear, settle, service, finance). Interactive stack view, traditional-vs-tokenized lifecycle swimlanes, and a classifier that places any product, institution, concept or lesson on both axes |
| **Curriculum** (`/learn`) | 50 lessons in 7 tracks: Foundations → Money Markets & Funding → Bonds & Fixed Income → Equities, Funds & Derivatives → Market Infrastructure → Tokenization → Regulation & Global View |
| **Products & services** (`/products`) | 39 products and services, each with an animated party-by-party flow diagram (cash, assets, collateral, instructions), a risk profile, where it trades/clears/settles/is held, and its tokenized counterpart. Plus a tenor-vs-risk scatter map of the whole product universe |
| **Global institution map** (`/globe`) | Interactive WebGL-free canvas globe (d3-geo orthographic): every institution with an HQ, plotted by city, filterable by category, with a ranked list of financial centres |
| **Tokenization bridges** | Every traditional lesson links to its tokenized counterpart (repo ↔ intraday tokenized repo, MMF ↔ BUIDL/BENJI, bonds ↔ digital bonds, custody ↔ MPC key custody, T+1 ↔ atomic T+0) |
| **Interactive tools** | Repo calculator (incl. intraday), bond price/duration with price-yield curve, sec lending revenue, T+2/T+1/atomic settlement simulator, MMF "break the buck" stress test, CCP default waterfall |
| **Global comparison** (`/compare`) | 14 jurisdictions (US, EU, UK, Switzerland, Singapore, Hong Kong, Japan, UAE, China, India, Australia, Canada, Brazil, South Korea) across 14 dimensions: RTGS, RFRs, settlement cycles, CSDs, CCPs, repo, sec lending, MMF rules, tokenization law, stablecoin regimes, central bank DLT projects |
| **Major players** (`/players`) | 230+ custodians, CSDs/ICSDs, CCPs, banks, asset managers, tokenization platforms, stablecoin issuers, digital custodians and regulators, with logos, filters and their tokenization initiatives |
| **Timeline** (`/timeline`) | Tokenization milestones 2017 → 2027 |
| **Glossary** (`/glossary`) | 110+ terms, each linked to its lesson |
| **Quizzes & progress** | Per-lesson quizzes, completion tracking (saved in the browser), ⌘K search, light/dark themes |

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run validate   # checks every cross-reference in the content layer
npm run lint
npm run typecheck
npm run build
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_GITHUB_REPO` so the "Edit this lesson" and "Report an issue" links point at your repository.

## Project structure

```
src/
  app/                    routes (/, /learn, /learn/[slug], /compare, /players, /timeline, /glossary)
  components/             UI, block renderer, quiz, search, explorers
    widgets/              interactive calculators & simulators
  content/                ALL learning content as typed data
    topics/*.ts           lessons, grouped by track
    players.ts            market participants (logos fetched from each domain's favicon)
    players-more.ts       the rest of the institution directory
    products-a.ts / -b.ts products & services with flow diagrams
    map.ts                the mental model: layers, stages, nodes, coordinates
    cities.ts             HQ coordinates used by the globe
    jurisdictions.ts      global comparison matrix
    timeline.ts           tokenization milestones
    glossary.ts           glossary terms
    types.ts              content schema
scripts/validate-content.ts
```

## Adding content

Lessons are plain TypeScript objects made of blocks (`h`, `p`, `list`, `callout`, `flow`, `table`, `example`, `compare`, `stats`, `players`, `widget`, `diagram`). Inline text supports `**bold**`, `*italic*`, `` `code` `` and `[links](/learn/repo)`.

1. Add or edit a topic in `src/content/topics/<track>.ts`
2. Reference players by `id` from `src/content/players.ts`
3. Give every new lesson map coordinates in `src/content/map.ts` and add it to `curriculumOrder` in `src/content/index.ts`
4. Run `npm run validate`, which fails on broken links, unknown players, missing map coordinates, malformed flow diagrams or invalid quiz answers
5. Open a PR; CI runs validate, lint, typecheck and build

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Disclaimer

Educational content only, not investment, legal or tax advice. Figures are approximate and dated; check primary sources. Logos are trademarks of their respective owners and are shown for identification only.
