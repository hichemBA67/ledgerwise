import Link from "next/link";
import { Fragment, type ReactNode } from "react";

const TOKEN = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

/** Renders the small inline markup used in content: **bold**, *italic*, `code`, [label](href). */
export function Inline({ text }: { text: string }) {
  const parts = text.split(TOKEN).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>{renderPart(part)}</Fragment>
      ))}
    </>
  );
}

function renderPart(part: string): ReactNode {
  if (part.startsWith("**") && part.endsWith("**")) {
    return <strong className="font-semibold text-ink">{part.slice(2, -2)}</strong>;
  }
  if (part.startsWith("`") && part.endsWith("`")) {
    return (
      <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">
        {part.slice(1, -1)}
      </code>
    );
  }
  const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  if (link) {
    const [, label, href] = link;
    return href.startsWith("/") ? (
      <Link href={href} className="font-medium text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent">
        {label}
      </Link>
    ) : (
      <a href={href} target="_blank" rel="noreferrer" className="font-medium text-accent underline decoration-accent/30 underline-offset-2">
        {label}
      </a>
    );
  }
  if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
    return <em>{part.slice(1, -1)}</em>;
  }
  return part;
}
