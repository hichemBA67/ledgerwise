import Link from "next/link";
import { site } from "@/lib/site";
import { GitHubIcon, Logo } from "./icons";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <Logo />
            <span className="font-serif text-lg text-ink">{site.name}</span>
          </div>
          <p className="mt-3 max-w-sm text-[13.5px] leading-relaxed text-muted">{site.description}</p>
          <p className="mt-3 max-w-sm text-[12px] leading-relaxed text-faint">
            Independent research. Not affiliated with or endorsed by the RL1 cooperative, SWIAT or any institution shown.
          </p>
        </div>
        <FooterCol
          title="Learn"
          links={[
            ["/#learn", "Learning platform"],
            ["/learn", "Curriculum"],
            ["/map", "The finance map"],
            ["/learn/repo", "Repo"],
            ["/learn/tokenization-101", "Tokenization 101"],
            ["/glossary", "Glossary"],
          ]}
        />
        <FooterCol
          title="Explore"
          links={[
            ["/ecosystem", "RL1 ecosystem"],
            ["/ecosystem#database", "Ecosystem database"],
            ["/products", "Products & services"],
            ["/globe", "Global institution map"],
            ["/compare", "Global comparison"],
            ["/players", "Major players"],
            ["/timeline", "Tokenization timeline"],
          ]}
        />
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-faint">Open source</p>
          <a href={site.repo} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-[14px] text-ink hover:text-accent">
            <GitHubIcon /> Contribute on GitHub
          </a>
          <a href={`${site.repo}/issues/new/choose`} target="_blank" rel="noreferrer" className="mt-2 block text-[14px] text-muted hover:text-ink">
            Report a correction
          </a>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-7xl px-4 py-5 text-[12px] leading-relaxed text-faint sm:px-6">
          Educational content only, not investment, legal or tax advice. Figures are approximate and dated; always check the linked primary sources. Logos are trademarks of their respective owners and are shown for identification only.
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-faint">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map(([href, label]) => (
          <li key={href}>
            <Link href={href} className="text-[14px] text-muted hover:text-ink">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
