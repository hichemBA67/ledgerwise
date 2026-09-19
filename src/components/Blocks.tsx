import Link from "next/link";
import { playerById } from "@/content/players";
import type { Block } from "@/content/types";
import { slugify } from "@/lib/slug";
import { Inline } from "./Inline";
import { PlayerLogo } from "./PlayerLogo";
import { productBySlug } from "@/content/products";
import { FlowDiagram } from "./FlowDiagram";
import { Widget } from "./widgets";

const calloutStyles = {
  info: { box: "border-accent/25 bg-accent-soft/60", label: "text-accent", icon: "i" },
  tip: { box: "border-tip/25 bg-tip-soft/70", label: "text-tip", icon: "★" },
  warn: { box: "border-warn/30 bg-warn-soft", label: "text-warn", icon: "!" },
  token: { box: "border-token/30 bg-token-soft", label: "text-token", icon: "◈" },
} as const;

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-5 text-[16.5px] leading-[1.75] text-ink/90">
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </div>
  );
}

function BlockView({ block: b }: { block: Block }) {
  switch (b.type) {
    case "h":
      return (
        <h2 id={slugify(b.text)} className="scroll-mt-24 pt-6 font-serif text-[1.7rem] font-medium leading-tight tracking-tight text-ink">
          {b.text}
        </h2>
      );
    case "p":
      return (
        <p>
          <Inline text={b.text} />
        </p>
      );
    case "list": {
      const Tag = b.ordered ? "ol" : "ul";
      return (
        <Tag className={`space-y-2 pl-1 ${b.ordered ? "list-decimal pl-6" : ""}`}>
          {b.items.map((it, i) => (
            <li key={i} className={b.ordered ? "" : "relative pl-5"}>
              {b.ordered ? null : <span className="absolute left-0 top-[0.7em] h-1.5 w-1.5 rounded-full bg-accent" />}
              <Inline text={it} />
            </li>
          ))}
        </Tag>
      );
    }
    case "callout": {
      const s = calloutStyles[b.tone];
      return (
        <aside className={`my-6 rounded-xl border px-5 py-4 ${s.box}`}>
          <p className={`mb-1 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wide ${s.label}`}>
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-[11px]">{s.icon}</span>
            {b.title}
          </p>
          <p className="text-[15.5px] leading-relaxed text-ink/85">
            <Inline text={b.text} />
          </p>
        </aside>
      );
    }
    case "flow":
      return (
        <figure className="my-7">
          {b.title ? <figcaption className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-muted">{b.title}</figcaption> : null}
          <ol className="grid gap-2" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(150px, 1fr))` }}>
            {b.steps.map((s, i) => (
              <li key={i} className="relative rounded-xl border border-line bg-surface p-3.5">
                <span className="font-mono text-[11px] font-semibold text-accent">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-1 text-[14px] font-semibold leading-snug text-ink">{s.label}</p>
                <p className="mt-1 text-[13px] leading-snug text-muted">{s.detail}</p>
                {i < b.steps.length - 1 ? (
                  <span aria-hidden className="absolute -right-2 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-bg text-[10px] text-faint lg:flex">
                    →
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </figure>
      );
    case "table":
      return (
        <figure className="my-7">
          {b.caption ? <figcaption className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-muted">{b.caption}</figcaption> : null}
          <div className="overflow-x-auto rounded-xl border border-line bg-surface">
            <table className="w-full min-w-[560px] border-collapse text-left text-[14px] leading-snug">
              <thead>
                <tr className="border-b border-line bg-surface-2/70">
                  {b.headers.map((h, i) => (
                    <th key={i} className="px-4 py-2.5 text-[12px] font-semibold uppercase tracking-wide text-muted">
                      <Inline text={h} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.map((r, i) => (
                  <tr key={i} className="border-b border-line/70 last:border-0">
                    {r.map((c, j) => (
                      <td key={j} className={`px-4 py-2.5 align-top ${j === 0 ? "font-medium text-ink" : "text-ink/80"}`}>
                        <Inline text={c} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </figure>
      );
    case "example":
      return (
        <figure className="my-6 rounded-xl border border-line bg-surface">
          <figcaption className="border-b border-line px-5 py-2.5 text-[13px] font-semibold text-muted">✎ {b.title}</figcaption>
          <div className="space-y-1 px-5 py-4 font-mono text-[13.5px] leading-relaxed text-ink/85">
            {b.lines.map((l, i) => (
              <p key={i}>{l}</p>
            ))}
            {b.result ? <p className="pt-2 font-semibold text-token">→ {b.result}</p> : null}
          </div>
        </figure>
      );
    case "compare":
      return (
        <div className="my-7 grid gap-3 md:grid-cols-2">
          {[b.left, b.right].map((side, i) => (
            <div key={i} className={`rounded-xl border p-5 ${i === 0 ? "border-line bg-surface" : "border-token/30 bg-token-soft/60"}`}>
              <p className={`text-[13px] font-semibold uppercase tracking-wide ${i === 0 ? "text-muted" : "text-token"}`}>{side.title}</p>
              <ul className="mt-3 space-y-2 text-[14.5px] leading-snug">
                {side.points.map((p, j) => (
                  <li key={j} className="flex gap-2">
                    <span className={i === 0 ? "text-faint" : "text-token"}>{i === 0 ? "–" : "+"}</span>
                    <span>
                      <Inline text={p} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    case "stats":
      return (
        <div className="my-7 grid gap-3 sm:grid-cols-3">
          {b.items.map((s, i) => (
            <div key={i} className="rounded-xl border border-line bg-surface p-4">
              <p className="font-serif text-3xl font-medium tracking-tight text-ink">{s.value}</p>
              <p className="mt-1 text-[13px] leading-snug text-muted">{s.label}</p>
              {s.source ? <p className="mt-1.5 font-mono text-[10.5px] uppercase tracking-wider text-faint">Source: {s.source}</p> : null}
            </div>
          ))}
        </div>
      );
    case "players":
      return (
        <div className="my-7">
          {b.title ? <p className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-muted">{b.title}</p> : null}
          <div className="flex flex-wrap gap-2">
            {b.ids.map((id) => {
              const p = playerById.get(id);
              if (!p) return null;
              return (
                <Link
                  key={id}
                  href={`/players?focus=${p.id}`}
                  className="flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-3 text-[13px] font-medium text-ink transition hover:border-accent/50"
                >
                  <PlayerLogo name={p.name} domain={p.domain} size={26} />
                  {p.name}
                </Link>
              );
            })}
          </div>
        </div>
      );
    case "widget":
      return <Widget kind={b.kind} />;
    case "diagram": {
      const p = productBySlug.get(b.product);
      return p ? (
        <div className="not-prose">
          <FlowDiagram product={p} />
          <p className="-mt-4 mb-2 text-[13px] text-muted">
            Full detail:{" "}
            <Link href={`/products/${p.slug}`} className="font-medium text-accent hover:underline">
              {p.name} →
            </Link>
          </p>
        </div>
      ) : null;
    }
  }
}
