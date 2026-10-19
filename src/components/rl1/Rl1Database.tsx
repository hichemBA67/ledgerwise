"use client";

import { Fragment, useState } from "react";
import { EDGE_KINDS, LAYERS, RELATION_LABEL, RL1_AS_OF, SOURCES, edges, entities, groupOf, type Rl1Entity } from "@/content/rl1";
import { categoryLabel, universe, universeSources } from "@/content/universe";
import { CATEGORIES, CATEGORY_BY_ID, FIT_LABEL, type Fit, type URecord } from "@/content/universe-taxonomy";
import { PlayerLogo } from "../PlayerLogo";
import { EvidenceBadge } from "./EcosystemStack3D";
import { groupVar } from "./theme";

const coreById = Object.fromEntries(entities.map((e) => [e.id, e])) as Record<string, Rl1Entity>;
const layerLabel = Object.fromEntries(LAYERS.map((l) => [l.id, `${l.asap} · ${l.label}`]));
const kindLabel = Object.fromEntries(EDGE_KINDS.map((k) => [k.id, k.label]));
const sourceById = Object.fromEntries(universeSources.map((s) => [s.id, s]));
const countries = [...new Set(universe.map((r) => r.country).filter(Boolean))].sort();
const PAGE = 50;
const FIT_ORDER: Fit[] = ["high", "medium", "low", "na"];

function csv(rows: (string | number | boolean | null | undefined)[][]) {
  return rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
}

function download(name: string, body: string, type: string) {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

type SortKey = "name" | "cat" | "country" | "fit" | "link";
const relation = (r: URecord) => (r.core ? RELATION_LABEL[coreById[r.core].rel] : "Not in RL1 map");

export function Rl1Database() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [layer, setLayer] = useState("all");
  const [country, setCountry] = useState("all");
  const [fit, setFit] = useState("all");
  const [src, setSrc] = useState("all");
  const [link, setLink] = useState("all");
  const [sort, setSort] = useState<SortKey>("fit");
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState<string | null>(null);

  const needle = q.trim().toLowerCase();
  const rows = universe
    .filter((r) => cat === "all" || r.cat === cat)
    .filter((r) => layer === "all" || r.layer === layer)
    .filter((r) => country === "all" || r.country === country)
    .filter((r) => fit === "all" || r.fit === fit)
    .filter((r) => src === "all" || r.srcs.includes(src))
    .filter((r) => link === "all" || (link === "in" ? !!r.core : !r.core))
    .filter((r) => !needle || `${r.name} ${r.city} ${r.country} ${r.ref ?? ""} ${r.lei ?? ""} ${r.web ?? ""}`.toLowerCase().includes(needle))
    .sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "cat") return a.cat.localeCompare(b.cat) || a.name.localeCompare(b.name);
      if (sort === "country") return a.country.localeCompare(b.country) || a.name.localeCompare(b.name);
      if (sort === "link") return Number(!!b.core) - Number(!!a.core) || a.name.localeCompare(b.name);
      return FIT_ORDER.indexOf(a.fit) - FIT_ORDER.indexOf(b.fit) || Number(!!b.core) - Number(!!a.core) || a.name.localeCompare(b.name);
    });
  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const current = Math.min(page, pages - 1);
  const view = rows.slice(current * PAGE, current * PAGE + PAGE);

  function exportRows(list: URecord[], name: string) {
    const head = ["id", "name", "category", "asap_layer", "membership_fit", "rl1_relation", "country_iso", "country", "city", "geo_precision", "lat", "lng", "lei", "website", "reference", "sources", "source_urls"];
    const body = list.map((r) => [
      r.id, r.name, categoryLabel[r.cat], layerLabel[r.layer], FIT_LABEL[r.fit], relation(r), r.cc, r.country, r.city, r.geo, r.lat, r.lng, r.lei, r.web, r.ref,
      r.srcs.map((s) => sourceById[s]?.label ?? s).join("; "), r.srcs.map((s) => sourceById[s]?.url ?? "").join(" "),
    ]);
    download(name, csv([head, ...body]), "text/csv");
  }

  function exportEdges() {
    const head = ["from_id", "from", "to_id", "to", "kind", "label", "evidence"];
    const body = edges.map((e) => [e.from, coreById[e.from]?.name, e.to, coreById[e.to]?.name, kindLabel[e.kind], e.label, e.evidence]);
    download(`rl1-relationships-${RL1_AS_OF}.csv`, csv([head, ...body]), "text/csv");
  }

  const reset = (fn: (v: string) => void) => (v: string) => {
    fn(v);
    setPage(0);
  };
  const select = "max-w-[220px] rounded-lg border border-line bg-surface px-2.5 py-2 text-[13px] text-ink";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={q}
          onChange={(e) => reset(setQ)(e.target.value)}
          placeholder="Search name, city, LEI, reference…"
          aria-label="Search institutions"
          className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-[14px] text-ink placeholder:text-faint sm:w-72"
        />
        <select aria-label="Category" value={cat} onChange={(e) => reset(setCat)(e.target.value)} className={select}>
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <select aria-label="Layer" value={layer} onChange={(e) => reset(setLayer)(e.target.value)} className={select}>
          <option value="all">All layers</option>
          {LAYERS.map((l) => (
            <option key={l.id} value={l.id}>
              {layerLabel[l.id]}
            </option>
          ))}
        </select>
        <select aria-label="Country" value={country} onChange={(e) => reset(setCountry)(e.target.value)} className={select}>
          <option value="all">All countries</option>
          {countries.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select aria-label="Membership fit" value={fit} onChange={(e) => reset(setFit)(e.target.value)} className={select}>
          <option value="all">Any fit</option>
          {FIT_ORDER.map((f) => (
            <option key={f} value={f}>
              Fit: {FIT_LABEL[f]}
            </option>
          ))}
        </select>
        <select aria-label="Source" value={src} onChange={(e) => reset(setSrc)(e.target.value)} className={select}>
          <option value="all">Any source</option>
          {universeSources
            .filter((s) => s.kept > 0)
            .map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
        </select>
        <select aria-label="RL1 link" value={link} onChange={(e) => reset(setLink)(e.target.value)} className={select}>
          <option value="all">In map or not</option>
          <option value="in">In the RL1 map</option>
          <option value="out">Not in the RL1 map</option>
        </select>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <p className="text-[13px] text-faint">
          {rows.length.toLocaleString()} of {universe.length.toLocaleString()} institutions · {edges.length} mapped relationships · RL1 map {RL1_AS_OF}
        </p>
        <div className="ml-auto flex flex-wrap gap-2">
          <button type="button" onClick={() => exportRows(rows, "rl1-universe-filtered.csv")} className="rounded-lg border border-line px-3 py-2 text-[13px] font-medium text-ink hover:bg-surface-2">
            Filtered CSV ({rows.length})
          </button>
          <button type="button" onClick={() => exportRows(universe, "rl1-universe-all.csv")} className="rounded-lg border border-line px-3 py-2 text-[13px] font-medium text-ink hover:bg-surface-2">
            All institutions CSV
          </button>
          <button type="button" onClick={exportEdges} className="rounded-lg border border-line px-3 py-2 text-[13px] font-medium text-ink hover:bg-surface-2">
            Relationships CSV
          </button>
        </div>
      </div>

      <div className="mt-3 overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full min-w-[900px] text-left text-[13px]">
          <thead className="border-b border-line text-[12px] text-faint">
            <tr>
              {(
                [
                  ["name", "Institution"],
                  ["cat", "Category"],
                  [null, "Layer"],
                  ["country", "HQ"],
                  ["fit", "Membership fit"],
                  ["link", "Relation to RL1"],
                  [null, "Sources"],
                ] as [SortKey | null, string][]
              ).map(([k, label]) => (
                <th key={label} className="px-3 py-2.5 font-medium">
                  {k ? (
                    <button type="button" onClick={() => setSort(k)} className={sort === k ? "text-ink" : "hover:text-ink"}>
                      {label}
                      {sort === k ? " ↓" : ""}
                    </button>
                  ) : (
                    label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {view.map((r) => {
              const core = r.core ? coreById[r.core] : null;
              return (
                <Fragment key={r.id}>
                  <tr className="cursor-pointer border-b border-line last:border-0 hover:bg-surface-2" onClick={() => setOpen(open === r.id ? null : r.id)} aria-expanded={open === r.id}>
                    <td className="px-3 py-2">
                      <span className="flex items-center gap-2.5">
                        <PlayerLogo name={r.name} domain={r.web ?? r.name} size={24} />
                        <span className="font-semibold text-ink">{r.name}</span>
                      </span>
                    </td>
                    <td className="px-3 py-2 text-muted">{categoryLabel[r.cat]}</td>
                    <td className="px-3 py-2 text-muted">{layerLabel[r.layer]}</td>
                    <td className="px-3 py-2 text-muted">
                      {r.country ? `${r.city || "–"}, ${r.country}` : "On-chain"}
                      {r.geo === "capital" ? (
                        <span className="text-faint" title="HQ city not matched; capital used">
                          {" "}
                          *
                        </span>
                      ) : null}
                    </td>
                    <td className="px-3 py-2">
                      <FitBadge fit={r.fit} />
                    </td>
                    <td className="px-3 py-2">
                      {core ? (
                        <span className="inline-flex items-center gap-1.5 text-ink">
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: groupVar(groupOf(core)) }} />
                          {RELATION_LABEL[core.rel]}
                        </span>
                      ) : (
                        <span className="text-faint">Not in map</span>
                      )}
                    </td>
                    <td className="px-3 py-2 font-mono text-[12px] text-muted">{r.srcs.length}</td>
                  </tr>
                  {open === r.id ? (
                    <tr className="border-b border-line bg-surface-2/50">
                      <td colSpan={7} className="px-4 py-4">
                        <Detail r={r} core={core} />
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-between text-[13px] text-muted">
        <span>
          Page {current + 1} of {pages} · * HQ city not matched, national capital used
        </span>
        <span className="flex gap-2">
          <button type="button" disabled={current === 0} onClick={() => setPage(current - 1)} className="rounded-lg border border-line px-3 py-1.5 disabled:opacity-40">
            Previous
          </button>
          <button type="button" disabled={current >= pages - 1} onClick={() => setPage(current + 1)} className="rounded-lg border border-line px-3 py-1.5 disabled:opacity-40">
            Next
          </button>
        </span>
      </div>
    </div>
  );
}

export function FitBadge({ fit }: { fit: Fit }) {
  const cls = fit === "high" ? "bg-ink text-bg" : fit === "medium" ? "border border-ink text-ink" : fit === "low" ? "border border-line text-muted" : "text-faint";
  return <span className={`inline-block rounded-full px-2 py-0.5 text-[12px] font-semibold ${cls}`}>{FIT_LABEL[fit]}</span>;
}

function Detail({ r, core }: { r: URecord; core: Rl1Entity | null }) {
  const conn = core ? edges.filter((x) => x.from === core.id || x.to === core.id) : [];
  const stop = (e: React.MouseEvent) => e.stopPropagation();
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="space-y-2 text-[13px] leading-relaxed">
        {core ? (
          <>
            <p className="text-[14px] text-ink">{core.what}</p>
            <p className="text-muted">
              <span className="font-semibold text-ink">RL1 role: </span>
              {core.role}
            </p>
            <EvidenceBadge level={core.evidence} />
          </>
        ) : (
          <p className="text-muted">No known relationship to RL1. Listed as part of the addressable ecosystem.</p>
        )}
        {r.ref ? (
          <p className="text-muted">
            <span className="font-semibold text-ink">Register reference: </span>
            {r.ref}
          </p>
        ) : null}
        <p className="text-muted">
          <span className="font-semibold text-ink">Fit rule ({FIT_LABEL[r.fit]}): </span>
          {CATEGORY_BY_ID[r.cat].fitRule}
        </p>
        <p className="flex flex-wrap gap-3">
          {r.lei ? (
            <a href={`https://search.gleif.org/#/record/${r.lei}`} target="_blank" rel="noreferrer" className="text-accent hover:underline" onClick={stop}>
              LEI {r.lei}
            </a>
          ) : null}
          {r.web ? (
            <a href={`https://${r.web}`} target="_blank" rel="noreferrer" className="text-accent hover:underline" onClick={stop}>
              {r.web}
            </a>
          ) : null}
        </p>
      </div>
      <div className="space-y-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-faint">Appears in</p>
          <ul className="mt-1 space-y-0.5">
            {r.srcs.map((s) => (
              <li key={s}>
                <a href={sourceById[s]?.url} target="_blank" rel="noreferrer" className="text-[13px] text-accent hover:underline" onClick={stop}>
                  {sourceById[s]?.label ?? s}
                </a>
              </li>
            ))}
            {core?.sources.map((s) => (
              <li key={s}>
                <a href={SOURCES[s].url} target="_blank" rel="noreferrer" className="text-[13px] text-accent hover:underline" onClick={stop}>
                  {SOURCES[s].label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        {conn.length ? (
          <ul className="space-y-1">
            {conn.map((c, i) => {
              const other = coreById[c.from === core!.id ? c.to : c.from];
              return (
                <li key={i} className="text-[13px] text-muted">
                  <span className="font-semibold text-ink">
                    {c.from === core!.id ? "→" : "←"} {other?.short ?? other?.name}
                  </span>{" "}
                  · {kindLabel[c.kind]} · {c.label}
                  {c.evidence !== "confirmed" ? <em className="text-faint"> ({c.evidence})</em> : null}
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
