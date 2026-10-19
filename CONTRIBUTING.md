# Contributing

Thanks for helping keep the RL1 Ecosystem Hub accurate. Finance and tokenization change fast.

## Ground rules

- **Cite primary sources** (regulators, central banks, FMIs, issuers) for any figure or date.
- **Date your numbers** ("~$7T+ (ICI, 2025)"), because markets move.
- **Stay neutral.** Describe what players do; don't promote products.
- Keep lessons **self-contained**: define terms or link to the glossary.

## Workflow

1. Fork and create a branch: `git checkout -b content/tokenized-repo-update`
2. Edit files in `src/content/`
3. Run `npm run validate && npm run lint && npm run build`
4. Open a pull request using the template

## Adding a player

Add an entry to `src/content/players.ts` with a unique `id`, the company's primary `domain` (used to fetch the logo), a `category`, `region` and the `topics` it relates to.

## Adding an interactive widget

Create a client component in `src/components/widgets/`, register it in `widgets/index.tsx`, add the kind to `WidgetKind` in `src/content/types.ts`, and embed it in a lesson with `{ type: "widget", kind: "<kind>" }`.
