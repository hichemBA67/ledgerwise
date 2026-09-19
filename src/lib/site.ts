export const site = {
  name: "Ledgerwise",
  tagline: "From repo to tokenized repo",
  description:
    "A free learning platform for the plumbing of finance (money markets, repo, securities lending, MMFs, bonds, custody, clearing and settlement) and how tokenization is rebuilding each of them.",
  /** Set NEXT_PUBLIC_GITHUB_REPO to your repository URL, e.g. https://github.com/you/ledgerwise */
  repo: process.env.NEXT_PUBLIC_GITHUB_REPO ?? "https://github.com/ledgerwise/ledgerwise",
  branch: "main",
};

export function githubEditUrl(path: string) {
  return `${site.repo}/edit/${site.branch}/${path}`;
}

export function githubIssueUrl(title: string, body: string) {
  const q = new URLSearchParams({ title, body, labels: "content" });
  return `${site.repo}/issues/new?${q.toString()}`;
}
