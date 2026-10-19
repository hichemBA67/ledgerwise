export const site = {
  name: "RL1 Ecosystem Hub",
  tagline: "Who builds, runs and uses Regulated Layer One",
  description:
    "An independent map of the Regulated Layer One (RL1) ecosystem: members, validators, vendors, regulators, settlement assets and competing networks, laid out on the Access–Service–Asset–Platform stack, with the finance fundamentals behind them.",
  /** Set NEXT_PUBLIC_GITHUB_REPO to your repository URL, e.g. https://github.com/you/ledgerwise */
  repo: process.env.NEXT_PUBLIC_GITHUB_REPO ?? "https://github.com/hichemBA67/ledgerwise",
  branch: "main",
};

export function githubEditUrl(path: string) {
  return `${site.repo}/edit/${site.branch}/${path}`;
}

export function githubIssueUrl(title: string, body: string) {
  const q = new URLSearchParams({ title, body, labels: "content" });
  return `${site.repo}/issues/new?${q.toString()}`;
}
