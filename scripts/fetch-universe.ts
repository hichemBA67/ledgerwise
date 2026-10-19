/**
 * Builds the RL1 ecosystem universe from public registers plus the curated layer.
 *
 *   npm run universe            # use cached downloads in data/raw when present
 *   npm run universe -- --fresh # re-download every source
 *
 * Writes src/content/universe.json (records) and src/content/universe-sources.json (provenance:
 * source URLs, fetch time, raw row counts, rows kept and the inclusion rule for each source).
 */
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import ExcelJS from "exceljs";
import { strFromU8, unzipSync } from "fflate";
import { cities as playerCities } from "../src/content/cities";
import { players } from "../src/content/players";
import { entities as coreEntities, typeBucket, type Rl1Entity } from "../src/content/rl1";
import { curated } from "../src/content/universe-curated";
import { CATEGORY_BY_ID, fitFor, type UCategory, type URecord, type USource } from "../src/content/universe-taxonomy";

const RAW = "data/raw";
const OUT = "src/content/universe.json";
const MANIFEST = "src/content/universe-sources.json";
const FRESH = process.argv.includes("--fresh");
const UA = { "User-Agent": "Mozilla/5.0 (rl1-ecosystem-hub data refresh)" };
const fetchedAt: Record<string, string> = {};

async function cached(file: string, url: string): Promise<Buffer> {
  const path = `${RAW}/${file}`;
  if (!FRESH && existsSync(path)) {
    fetchedAt[file] = JSON.parse((await readFile(`${RAW}/_fetched.json`, "utf8").catch(() => "{}")) || "{}")[file] ?? "cached";
    return readFile(path);
  }
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(path, buf);
  fetchedAt[file] = new Date().toISOString();
  return buf;
}

// ── Small helpers ─────────────────────────────────────────────────────────
function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  if (cell || row.length) rows.push([...row, cell]);
  const head = rows[0].map((h) => h.replace(/^﻿/, "").trim());
  return rows.slice(1).filter((r) => r.some((x) => x.trim())).map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] ?? "").trim()])));
}

const fold = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ß/g, "ss")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const LEGAL = new Set(
  "a ua ag sa nv bv gmbh plc se spa s p a as asa ab abp oyj kgaa co ltd limited inc llc sarl sas srl eg mbh kg ad dd zrt nyrt sca scrl cv sc sl slu ehf hf aps a s ag& the de du of la le et e c sv".split(" "),
);
export function normName(s: string) {
  return fold(s.split(" ; ")[0].replace(/\(.*?\)/g, " ").replace(/\./g, ""))
    .split(" ")
    .filter((w) => w && !LEGAL.has(w))
    .join(" ");
}

const domainOf = (url?: string) => {
  if (!url) return undefined;
  try {
    return new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
};

const prettyUsd = (n: number) => (n >= 1e9 ? `$${(n / 1e9).toFixed(1)}bn` : `$${Math.round(n / 1e6)}m`);

// ── Geography: GeoNames cities + country info ────────────────────────────
type Country = { iso: string; name: string; capital: string };
const countriesByIso = new Map<string, Country>();
const isoByName = new Map<string, string>();
const cityIndex = new Map<string, { name: string; lat: number; lng: number; pop: number }>();

async function loadGeo() {
  const info = (await cached("countryInfo.txt", "https://download.geonames.org/export/dump/countryInfo.txt")).toString("utf8");
  for (const line of info.split("\n")) {
    if (!line || line.startsWith("#")) continue;
    const f = line.split("\t");
    countriesByIso.set(f[0], { iso: f[0], name: f[4].replace(/^The /, ""), capital: f[5] });
    isoByName.set(fold(f[4]), f[0]);
  }
  for (const [alias, iso] of [
    ["czechia", "CZ"], ["czech republic", "CZ"], ["united states of america", "US"], ["usa", "US"], ["uk", "GB"], ["great britain", "GB"],
    ["korea", "KR"], ["uae", "AE"], ["netherlands", "NL"], ["hong kong sar", "HK"], ["republic of korea", "KR"], ["slovak republic", "SK"], ["the netherlands", "NL"], ["turkiye", "TR"],
  ] as const)
    isoByName.set(alias, iso);
  const zip = unzipSync(new Uint8Array(await cached("cities15000.zip", "https://download.geonames.org/export/dump/cities15000.zip")));
  const txt = strFromU8(zip["cities15000.txt"]);
  for (const line of txt.split("\n")) {
    const f = line.split("\t");
    if (f.length < 15) continue;
    const pop = Number(f[14]) || 0;
    const rec = { name: f[1], lat: Number(f[4]), lng: Number(f[5]), pop };
    const names = new Set([f[1], f[2], ...f[3].split(",")].map(fold).filter((n) => n.length > 1));
    for (const n of names) {
      const key = `${f[8]}|${n}`;
      const cur = cityIndex.get(key);
      if (!cur || cur.pop < pop) cityIndex.set(key, rec);
    }
  }
}

function geocodeCity(city: string, cc: string) {
  const base = fold(city).replace(/\b(cedex|am main)\b/g, (m) => (m === "am main" ? "am main" : "")).trim();
  const words = base.split(" ").filter((w) => !/^\d+$/.test(w));
  const tries = [base, words.join(" "), words.slice(0, 2).join(" "), words[0] ?? "", words.at(-1) ?? ""];
  for (const t of tries) {
    const hit = t && cityIndex.get(`${cc}|${t}`);
    if (hit) return hit;
  }
  return null;
}

/** Walk an address from the end (city usually sits near it), stripping postcodes. */
function geocodeAddress(address: string, cc: string) {
  const parts = address.split(/[,\n]/).map((p) => p.replace(/\b[A-Z]{0,2}-?\d[\d\s-]*\b/g, " ").trim()).filter(Boolean);
  for (const p of parts.reverse()) {
    const hit = geocodeCity(p, cc);
    if (hit) return hit;
  }
  return null;
}

function locate(cc: string, opts: { city?: string; address?: string }) {
  const country = countriesByIso.get(cc);
  const hit = (opts.city && geocodeCity(opts.city, cc)) || (opts.address && geocodeAddress(opts.address, cc));
  if (hit) return { city: hit.name, lat: hit.lat, lng: hit.lng, geo: "city" as const, country: country?.name ?? cc };
  const cap = country && geocodeCity(country.capital, cc);
  if (cap) return { city: cap.name, lat: cap.lat, lng: cap.lng, geo: "capital" as const, country: country.name };
  return { city: "", lat: null, lng: null, geo: "none" as const, country: country?.name ?? "" };
}

// ── GLEIF legal-entity lookups ───────────────────────────────────────────
type Lei = { name: string; city: string; cc: string };
async function gleif(leis: string[]): Promise<Map<string, Lei>> {
  const path = `${RAW}/gleif.json`;
  const store: Record<string, Lei> = existsSync(path) ? JSON.parse(await readFile(path, "utf8")) : {};
  const todo = [...new Set(leis)].filter((l) => /^[A-Z0-9]{20}$/.test(l) && (FRESH || !store[l]));
  for (let i = 0; i < todo.length; i += 200) {
    const batch = todo.slice(i, i + 200);
    const url = `https://api.gleif.org/api/v1/lei-records?filter%5Blei%5D=${batch.join(",")}&page%5Bsize%5D=200`;
    const res = await fetch(url, { headers: UA });
    if (!res.ok) throw new Error(`GLEIF HTTP ${res.status}`);
    const json = (await res.json()) as { data: { id: string; attributes: { entity: { legalName: { name: string }; headquartersAddress: { city: string; country: string } } } }[] };
    for (const d of json.data) {
      const e = d.attributes.entity;
      store[d.id] = { name: e.legalName.name, city: e.headquartersAddress.city, cc: e.headquartersAddress.country };
    }
    process.stdout.write(`  GLEIF ${Math.min(i + 200, todo.length)}/${todo.length}\r`);
  }
  await writeFile(path, JSON.stringify(store));
  fetchedAt["gleif.json"] = new Date().toISOString();
  return new Map(Object.entries(store));
}

// ── Records & de-duplication ─────────────────────────────────────────────
const records: URecord[] = [];
const byLei = new Map<string, URecord>();
const byName = new Map<string, URecord>();
const kept: Record<string, number> = {};
const FMI_CATS: UCategory[] = ["csd", "ccp", "venue", "dlt-fmi", "custodian"];

/** Aliases from register legal names to entities in the detailed RL1 map. */
const CORE_ALIASES: Record<string, string> = {
  "landesbank baden wurttemberg": "lbbw",
  "bayerische landesbank": "bayernlb",
  "landesbank hessen thuringen girozentrale": "helaba",
  "banque federative du credit mutuel": "creditmutuel",
  "ing groep": "ing",
  "banco bilbao vizcaya argentaria": "bbva",
  "banco santander": "santander",
  "banco sabadell": "sabadell",
  "cooperatieve rabobank u a": "rabobank",
  "cooperatieve rabobank": "rabobank",
  "op osuuskunta": "op",
  "banque et caisse d epargne l etat luxembourg": "bcee",
  "landeskreditbank baden wurttemberg forderbank": "lbank",
  "b metzler seel sohn": "metzler",
  "groupe bpce": "bpce",
  "bpce": "bpce",
  "standard chartered": "standardchartered",
  "natwest group": "natwest",
  "danske bank": "danske",
  "handelsbanken": "handelsbanken",
  "svenska handelsbanken": "handelsbanken",
  "skandinaviska enskilda banken": "seb",
  "seb": "seb",
  "swedbank": "swedbank",
  "jyske bank": "jyske",
  "bank polska kasa opieki": "pekao",
  "landsbankinn": "landsbankinn",
  "aib group": "aib",
  "bank ireland group": "boi",
  "piraeus financial holdings": "piraeus",
  "national bank greece": "nbg",
  "nordea bank": "nordea",
  "erste group bank": "erste",
  "raiffeisen bank international": "rbi",
  "kbc group": "kbc",
  "abn amro bank": "abnamro",
};
const coreAliases = Object.fromEntries(Object.entries(CORE_ALIASES).map(([k, v]) => [normName(k), v]));
const coreNames = coreEntities.map((e) => ({ id: e.id, n: normName(e.name), s: e.short ? normName(e.short) : "" }));

function matchCore(name: string): string | undefined {
  const n = normName(name);
  if (coreAliases[n]) return coreAliases[n];
  for (const c of coreNames) if (c.n === n || (c.s && c.s === n && c.s.length > 3)) return c.id;
  for (const c of coreNames) if (c.n.length >= 4 && n.startsWith(c.n + " ")) return c.id;
  return undefined;
}

function add(r: Omit<URecord, "fit" | "layer" | "srcs"> & { fit?: URecord["fit"]; layer?: URecord["layer"] }, src: string) {
  const key = normName(r.name);
  const coreId = r.core ?? (src === "rl1-core" ? undefined : matchCore(r.name));
  const existing =
    (r.lei && byLei.get(r.lei)) ||
    byName.get(key) ||
    (coreId ? records.find((x) => x.core === coreId) : undefined);
  if (existing) {
    if (!existing.srcs.includes(src)) existing.srcs.push(src);
    existing.lei ??= r.lei;
    existing.web ??= r.web;
    if (r.ref && !existing.ref?.includes(r.ref)) existing.ref = existing.ref ? `${existing.ref} · ${r.ref}` : r.ref;
    if (existing.geo !== "city" && r.geo === "city") Object.assign(existing, { city: r.city, lat: r.lat, lng: r.lng, geo: r.geo, cc: r.cc, country: r.country });
    // The ECB list is authoritative on significant vs less significant.
    // (A subsidiary merged into its group never downgrades it, and a foreign parent keeps its own category.)
    const downgrade = src === "ecb-lsi" && existing.srcs.includes("ecb-si");
    if ((src === "ecb-si" || src === "ecb-lsi") && existing.cat.startsWith("bank-") && !downgrade && existing.cc === r.cc) {
      existing.cat = src === "ecb-si" ? "bank-si" : "bank-lsi";
      existing.fit = fitFor(existing.cat, existing.cc);
    }
    if ((existing.cat === "bank-lsi" || existing.cat === "bank-si" || existing.cat === "bank-intl") && FMI_CATS.includes(r.cat) && !existing.core) {
      existing.cat = r.cat;
      existing.layer = CATEGORY_BY_ID[r.cat].layer;
    }
    if (r.cat === "dapp" && existing.cat === "network" && !existing.core) {
      existing.cat = "dapp";
      existing.layer = CATEGORY_BY_ID.dapp.layer;
      existing.fit = r.fit ?? fitFor("dapp", "");
    }
    existing.core ??= coreId;
    if (r.lei) byLei.set(r.lei, existing);
    return;
  }
  const rec: URecord = {
    ...r,
    core: coreId,
    layer: r.layer ?? CATEGORY_BY_ID[r.cat].layer,
    fit: r.fit ?? fitFor(r.cat, r.cc),
    srcs: [src],
  };
  records.push(rec);
  kept[src] = (kept[src] ?? 0) + 1;
  if (rec.lei) byLei.set(rec.lei, rec);
  byName.set(key, rec);
}

const EURO = new Set(["AT", "BE", "BG", "HR", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PT", "SK", "SI", "ES"]);

/** RL1-map entities that belong to a significant banking group but aren't its head entity in the ECB list. */
const SI_GROUP_PARTS = new Set(["natixis", "natixispfb", "creditmutuel", "berlinhyp", "dekabank", "dzbank", "lbbw", "bayernlb", "helaba"]);

function coreCategory(e: Rl1Entity, cc: string): UCategory {
  const t = e.type.toLowerCase();
  const b = typeBucket(e.type);
  // Euro-area banks default to less significant; the ECB list upgrades them on merge, and parts of SI groups are set here.
  if (b === "Bank") return !EURO.has(cc) ? "bank-intl" : SI_GROUP_PARTS.has(e.id) ? "bank-si" : "bank-lsi";
  if (b === "Bank venture arm") return "bank-intl";
  if (b === "Development bank / public") return "issuer";
  if (b === "Central bank / regulator") return t.includes("standard") ? "industry-body" : t.includes("central bank") || t.includes("settlement link") ? "central-bank" : "regulator";
  if (b === "Infrastructure & wallet tech") return /wallet|custody/.test(t) ? "digital-custody" : "infra-tech";
  if (b === "Technology operator" || b === "IT services (validator)") return "infra-tech";
  if (b === "Digital-asset custodian") return "digital-custody";
  if (b === "Issuance & settlement service") return "dlt-fmi";
  if (b === "Venue") return "venue";
  if (b === "Stablecoin issuer") return "emt";
  if (b === "Corporate issuer") return "issuer";
  if (b === "Asset manager") return "asset-manager";
  return /public|l1|network|ledger|payment system|reference|correspondent|future cb|shared/.test(t) ? "network" : "dlt-fmi";
}

async function main() {
  await mkdir(RAW, { recursive: true });
  console.log("Loading GeoNames…");
  await loadGeo();
  const sources: USource[] = [];
  const iso = (name: string) => isoByName.get(fold(name)) ?? "";

  // 1. Detailed RL1 map ------------------------------------------------------
  for (const e of coreEntities) {
    const cc = iso(e.country);
    add({ id: `core:${e.id}`, name: e.name, cat: coreCategory(e, cc), layer: e.layer, cc, country: e.country, city: e.city, lat: e.lat, lng: e.lng, geo: "city", web: e.domain, core: e.id, ref: e.type }, "rl1-core");
  }
  sources.push({ id: "rl1-core", label: "Detailed RL1 map", publisher: "This hub (src/content/rl1.ts)", url: "https://www.rl1.network/", fetchedAt: "2026-10-03", rows: coreEntities.length, kept: kept["rl1-core"] ?? 0, rule: "Every entity with a sourced or graded relationship to RL1 (members, validators, operator, supporters, ecosystem, vendors, peers, prospects)." });

  // 2. ECB list of supervised entities --------------------------------------
  const page = (await cached("ssm.html", "https://www.bankingsupervision.europa.eu/banking/list/html/index.en.html")).toString("utf8");
  const xlsxPath = page.match(/href="([^"]*listofsupervisedentities\d+\.en\.xlsx)"/)?.[1];
  if (!xlsxPath) throw new Error("ECB list link not found");
  const xlsxUrl = new URL(xlsxPath, "https://www.bankingsupervision.europa.eu").toString();
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load((await cached("ssm.xlsx", xlsxUrl)) as unknown as ArrayBuffer);
  const cellValues = (row: ExcelJS.Row) =>
    (row.values as unknown[]).slice(1).map((v) => (v && typeof v === "object" && "richText" in v ? (v as { richText: { text: string }[] }).richText.map((t) => t.text).join("") : v)).filter((v, i, all) => v !== null && v !== undefined && v !== "" && v !== all[i - 1]) as (string | number)[]; // merged cells repeat

  const si: { lei: string; name: string; country: string; ground: string }[] = [];
  wb.getWorksheet("SIs")!.eachRow((row) => {
    const v = cellValues(row);
    if (typeof v[0] === "number" && typeof v[1] === "string" && /^[A-Z0-9]{20}$/.test(v[1])) {
      const rest = v.slice(3).map(String).filter((x) => !["Approved", "Exempted", "Not approved"].includes(x));
      si.push({ lei: v[1], name: rest[0], country: rest[1], ground: rest[2] ?? "" });
    }
  });
  const LOCAL = /sparkasse|volksbank|raiffeisen(bank|kasse|landesbank)?\b(?! bank international)|vr[ -]?bank|caja rural|credito cooperativo|cassa rurale|banca di credito|cassa raiffeisen|caisse r[ée]gionale|spar- und|spar und|bausparkasse|genossenschaft|raiffeisenbank|kreditgenossenschaft|bcc |banca popolare|landessparkasse|hypo noe|sparda|pszh|psd bank/i;
  const lsiAll: { lei: string; name: string; type: string; country: string }[] = [];
  let lsiCountry = "";
  wb.getWorksheet("LSIs")!.eachRow((row) => {
    const v = cellValues(row);
    if (v.length === 1 && typeof v[0] === "string" && iso(v[0])) lsiCountry = v[0];
    else if (v.length >= 3 && typeof v[0] === "string" && v[0].length >= 18 && typeof v[1] === "string") lsiAll.push({ lei: v[0], name: String(v[2]), type: v[1], country: lsiCountry });
  });
  const LOCAL2 = /osuuspankki|s[äa]{2}st[öo]pankki|sparbank|caixa de cr[ée]dito agr[íi]cola m[úu]tuo|caja r\.|caixa r\.|caja rural|caixa rural|\bc\.r\. |s\.c\.c|caisse de cr[ée]dit municipal/i;
  const isLocal = (name: string) => LOCAL.test(name) || LOCAL2.test(name) || /\beG(en)?\b/.test(name);
  const lsiCi = lsiAll.filter((x) => x.type === "CI");
  const lsiLocal = lsiCi.filter((x) => isLocal(x.name));
  const lsi = lsiCi.filter((x) => !isLocal(x.name));
  const lei1 = await gleif([...si.map((x) => x.lei), ...lsi.map((x) => x.lei)]);
  for (const b of si) {
    const g = lei1.get(b.lei);
    const cc = g?.cc ?? iso(b.country);
    add({ id: `lei:${b.lei}`, name: b.name.split(" ; ")[0].replace(/^Exempted\. Designated entity: /, ""), cat: "bank-si", cc, ...locate(cc, { city: g?.city }), lei: b.lei, ref: `ECB significant institution · ${b.ground}` }, "ecb-si");
  }
  for (const b of lsi) {
    const g = lei1.get(b.lei);
    const cc = g?.cc ?? iso(b.country);
    add({ id: `lei:${b.lei}`, name: b.name.split(" ; ")[0], cat: "bank-lsi", cc, ...locate(cc, { city: g?.city }), lei: b.lei, ref: "ECB less significant institution" }, "ecb-lsi");
  }
  sources.push({ id: "ecb-si", label: "ECB list of supervised entities: significant institutions", publisher: "European Central Bank (SSM)", url: xlsxUrl, fetchedAt: fetchedAt["ssm.xlsx"], rows: si.length, kept: kept["ecb-si"] ?? 0, rule: "Every significant banking group, listed by its head entity (subsidiaries roll up)." });
  sources.push({
    id: "ecb-lsi", label: "ECB list of supervised entities: less significant institutions", publisher: "European Central Bank (SSM)", url: xlsxUrl, fetchedAt: fetchedAt["ssm.xlsx"], rows: lsiAll.length, kept: kept["ecb-lsi"] ?? 0,
    rule: `Credit institutions only (${lsiCi.length}). Excluded ${lsiLocal.length} local savings, cooperative, Raiffeisen, rural and municipal banks (name match incl. German "eG", Finnish Osuuspankki/Säästöpankki, Spanish Cajas Rurales, Portuguese Crédito Agrícola caixas), which reach RL1 through their central institutions (DekaBank and Landesbanken, DZ BANK, Raiffeisen Landesbanken, ICCREA/Cassa Centrale, Crédit Agricole SA); holding companies and branches also excluded.`,
  });

  // 3. ESMA trading venues ----------------------------------------------------
  const venueJson = JSON.parse(
    (await cached("esma-venues.json", "https://registers.esma.europa.eu/solr/esma_registers_upreg/select?q=entity_type:ae%20AND%20ae_entityTypeCode:(MIR%20OR%20MIT%20OR%20MIO%20OR%20MIE)&rows=3000&wt=json")).toString("utf8"),
  ) as { response: { docs: Record<string, string>[] } };
  const venues = venueJson.response.docs.filter((d) => d.ae_status === "Active");
  const venueGroups = new Map<string, Record<string, string>[]>();
  for (const d of venues) {
    const k = d.ae_lei || normName(d.ae_entityName);
    venueGroups.set(k, [...(venueGroups.get(k) ?? []), d]);
  }
  const lei2 = await gleif(venues.map((d) => d.ae_lei).filter(Boolean));
  for (const [k, docs] of venueGroups) {
    const d = docs[0];
    const g = d.ae_lei ? lei2.get(d.ae_lei) : undefined;
    const cc = g?.cc ?? iso(d.ae_homeMemberState);
    const types = [...new Set(docs.map((x) => ({ MIR: "RM", MIT: "MTF", MIO: "OTF", MIE: "SME GM" })[x.ae_entityTypeCode] ?? x.ae_entityTypeCode))].join("/");
    const mics = [...new Set(docs.map((x) => x.ae_micLeiEsmaId).filter(Boolean))].slice(0, 6).join(", ");
    const name = g?.name ? g.name : d.ae_entityName;
    add({ id: d.ae_lei ? `lei:${d.ae_lei}` : `esma:${k}`, name, cat: "venue", cc, ...locate(cc, { city: g?.city, address: d.ae_headOfficeAddress }), lei: d.ae_lei || undefined, web: domainOf(d.ae_website), ref: `${types} · MIC ${mics}` }, "esma-venues");
  }
  sources.push({ id: "esma-venues", label: "ESMA register: regulated markets, MTFs, OTFs, SME growth markets", publisher: "European Securities and Markets Authority", url: "https://registers.esma.europa.eu/publication/searchRegister?core=esma_registers_upreg", fetchedAt: fetchedAt["esma-venues.json"], rows: venueJson.response.docs.length, kept: kept["esma-venues"] ?? 0, rule: "Active venues, grouped by operator LEI (one institution per operator, its MIC codes kept in the reference)." });

  // 4. ESMA interim MiCA register ---------------------------------------------
  const casps = parseCsv((await cached("CASPS.csv", "https://www.esma.europa.eu/sites/default/files/2024-12/CASPS.csv")).toString("utf8"));
  const emts = parseCsv((await cached("EMTWP.csv", "https://www.esma.europa.eu/sites/default/files/2024-12/EMTWP.csv")).toString("utf8"));
  const lei3 = await gleif([...casps, ...emts].map((r) => r.ae_lei).filter(Boolean));
  for (const r of emts.filter((x) => !x.ac_authorisationEndDate)) {
    const g = lei3.get(r.ae_lei);
    const cc = (r.ae_lei_cou_code || r.ae_homeMemberState || g?.cc || "").toUpperCase();
    add({ id: r.ae_lei ? `lei:${r.ae_lei}` : `mica:${normName(r.ae_commercial_name || r.ae_lei_name).replace(/ /g, "-")}`, name: (r.ae_commercial_name || r.ae_lei_name).split("|")[0].trim(), cat: "emt", cc, ...locate(cc, { city: g?.city, address: r.ae_address }), lei: r.ae_lei || undefined, web: domainOf(r.ae_website), ref: `MiCA EMT issuer (${r.ae_authorisation_other_emt || "authorised"})` }, "mica-emt");
  }
  for (const r of casps.filter((x) => !x.ac_authorisationEndDate)) {
    const g = lei3.get(r.ae_lei);
    const cc = (r.ae_lei_cou_code || r.ae_homeMemberState || g?.cc || "").toUpperCase();
    const services = [...new Set((r.ac_serviceCode.match(/(^|\| )([a-j])\./g) ?? []).map((m) => m.replace(/[|. ]/g, "")))].join("");
    add({ id: r.ae_lei ? `lei:${r.ae_lei}` : `mica:${normName(r.ae_commercial_name || r.ae_lei_name).replace(/ /g, "-")}`, name: (r.ae_commercial_name || r.ae_lei_name).split("|")[0].trim(), cat: "casp", cc, ...locate(cc, { city: g?.city, address: r.ae_address }), lei: r.ae_lei || undefined, web: domainOf(r.ae_website), ref: `MiCA CASP · services ${services}` }, "mica-casp");
  }
  sources.push({ id: "mica-emt", label: "ESMA interim MiCA register: e-money token issuers", publisher: "European Securities and Markets Authority", url: "https://www.esma.europa.eu/sites/default/files/2024-12/EMTWP.csv", fetchedAt: fetchedAt["EMTWP.csv"], rows: emts.length, kept: kept["mica-emt"] ?? 0, rule: "Issuers without an authorisation end date, one row per issuer (several tokens roll up)." });
  sources.push({ id: "mica-casp", label: "ESMA interim MiCA register: crypto-asset service providers", publisher: "European Securities and Markets Authority", url: "https://www.esma.europa.eu/sites/default/files/2024-12/CASPS.csv", fetchedAt: fetchedAt["CASPS.csv"], rows: casps.length, kept: kept["mica-casp"] ?? 0, rule: "Authorised CASPs without an end date, one per LEI; service codes a–j as in MiCA Art. 3(1)(16)." });

  // 5. Players dataset + curated layer ---------------------------------------
  const playerCat = (c: string, name: string, cc: string): UCategory =>
    ({
      Custodian: "custodian", "CSD / ICSD": "csd", "CCP / Clearing": "ccp", "Tri-party & Collateral": "custodian", "Asset Manager": "asset-manager", "Asset Owner": "asset-manager",
      "Tokenization Platform": "dlt-fmi", "DLT Network": "network", "Stablecoin / Cash Token": "emt", "Digital Asset Custody": "digital-custody", "Exchange / Venue": "venue",
      "Data & Rating": "infra-tech", "Payments & Messaging": "infra-tech", "Market Technology": "infra-tech", Issuer: "issuer", "Industry Body": "industry-body",
    })[c] as UCategory ?? (c === "Bank / Dealer" ? (EURO.has(cc) ? "bank-si" : "bank-intl") : /bank|reserve|monetary|banca|banque|bundesbank|riksbank/i.test(name) ? "central-bank" : "regulator");
  for (const p of players) {
    const c = p.city ? playerCities[p.city] : undefined;
    const cc = c ? iso(c.country) : "";
    add({ id: `player:${p.id}`, name: p.name, cat: playerCat(p.category, p.name, cc), cc, country: c?.country ?? "", city: c?.name ?? "", lat: c?.lat ?? null, lng: c?.lng ?? null, geo: c ? "city" : "none", web: p.domain, ref: p.category }, "players");
  }
  sources.push({ id: "players", label: "Hub players dataset", publisher: "This hub (src/content/players*.ts)", url: "https://github.com/hichemBA67/ledgerwise/blob/main/src/content/players.ts", fetchedAt: "2026-09-20", rows: players.length, kept: kept.players ?? 0, rule: "Global market-infrastructure players already documented in the hub, with HQ city." });
  for (const [name, cat, cc, city, web] of curated) {
    add({ id: `cur:${normName(name).replace(/ /g, "-")}`, name, cat, cc, ...locate(cc, { city }), web }, "curated");
  }
  sources.push({ id: "curated", label: "Curated: global FMIs, banks, exchanges, asset managers, digital-asset infrastructure", publisher: "This hub (src/content/universe-curated.ts)", url: "https://github.com/hichemBA67/ledgerwise/blob/main/src/content/universe-curated.ts", fetchedAt: "2026-10-03", rows: curated.length, kept: kept.curated ?? 0, rule: "Institutions no machine-readable public register lists: CSDs and CCPs outside the ESMA registers, banks outside the euro area, non-EU exchanges, large asset managers, tokenisation and custody firms. Compiled, not register-verified." });

  // 6. DefiLlama: chains, CEXs, dApps ----------------------------------------
  type Protocol = { name: string; category: string; tvl: number | null; url?: string; chains: string[]; parentProtocol?: string; slug: string };
  const protocols = JSON.parse((await cached("defillama-protocols.json", "https://api.llama.fi/protocols")).toString("utf8")) as Protocol[];
  const chains = JSON.parse((await cached("defillama-chains.json", "https://api.llama.fi/v2/chains")).toString("utf8")) as { name: string; tvl: number }[];
  for (const c of chains.sort((a, b) => b.tvl - a.tvl).slice(0, 40)) {
    add({ id: `chain:${normName(c.name).replace(/ /g, "-")}`, name: c.name === "Ethereum" ? "Ethereum (public)" : c.name, cat: "network", cc: "", country: "", city: "", lat: null, lng: null, geo: "none", ref: `Public chain · DeFi TVL ${prettyUsd(c.tvl)}` }, "defillama-chains");
  }
  sources.push({ id: "defillama-chains", label: "DefiLlama: chains by DeFi TVL", publisher: "DefiLlama", url: "https://api.llama.fi/v2/chains", fetchedAt: fetchedAt["defillama-chains.json"], rows: chains.length, kept: kept["defillama-chains"] ?? 0, rule: "Top 40 chains by total value locked." });

  const cex = protocols.filter((p) => p.category === "CEX" && (p.tvl ?? 0) >= 1e6).sort((a, b) => (b.tvl ?? 0) - (a.tvl ?? 0));
  for (const p of cex) add({ id: `llama:${p.slug}`, name: p.name, cat: "cex", cc: "", country: "", city: "", lat: null, lng: null, geo: "none", web: domainOf(p.url), ref: `On-chain reserves ${prettyUsd(p.tvl ?? 0)}` }, "defillama-cex");
  sources.push({ id: "defillama-cex", label: "DefiLlama: centralised exchanges (proof of reserves)", publisher: "DefiLlama", url: "https://api.llama.fi/protocols", fetchedAt: fetchedAt["defillama-protocols.json"], rows: protocols.filter((p) => p.category === "CEX").length, kept: kept["defillama-cex"] ?? 0, rule: "Every CEX with at least $1m of tracked on-chain reserves; headquarters not geocoded." });

  const EXCLUDED = new Set(["CEX", "Chain", "Ponzi", "Luck Games", "Yield Lottery", "Gamified Mining", "Telegram Bot", "Physical TCG", "Canonical Bridge"]);
  const MIN_TVL = 75e6;
  const parents = new Map<string, { name: string; category: string; tvl: number; url?: string; chains: Set<string>; slug: string; top: number }>();
  for (const p of protocols) {
    if (EXCLUDED.has(p.category) || !p.tvl || p.tvl <= 0) continue;
    const key = p.parentProtocol ?? p.slug;
    const cur = parents.get(key) ?? { name: p.name, category: p.category, tvl: 0, url: p.url, chains: new Set<string>(), slug: key.replace(/^parent#/, ""), top: 0 };
    cur.tvl += p.tvl;
    p.chains.forEach((c) => cur.chains.add(c));
    if (p.tvl > cur.top) Object.assign(cur, { top: p.tvl, category: p.category, url: p.url, name: p.parentProtocol ? p.name.replace(/\s+(v\d+|V\d+.*|Lend|Pools?|AMM|CLMM|Perps?)$/i, "") : p.name });
    parents.set(key, cur);
  }
  const dapps = [...parents.values()].filter((p) => p.tvl >= MIN_TVL).sort((a, b) => b.tvl - a.tvl);
  for (const p of dapps) {
    add(
      { id: `llama:${p.slug}`, name: p.name, cat: "dapp", cc: "", country: "", city: "", lat: null, lng: null, geo: "none", web: domainOf(p.url), fit: fitFor("dapp", "", { rwa: p.category === "RWA" }), ref: `${p.category} · TVL ${prettyUsd(p.tvl)} · ${[...p.chains].slice(0, 3).join(", ")}${p.chains.size > 3 ? ` +${p.chains.size - 3}` : ""}` },
      "defillama-dapps",
    );
  }
  sources.push({ id: "defillama-dapps", label: "DefiLlama: dApp / DeFi protocols", publisher: "DefiLlama", url: "https://api.llama.fi/protocols", fetchedAt: fetchedAt["defillama-protocols.json"], rows: protocols.length, kept: kept["defillama-dapps"] ?? 0, rule: `Protocols grouped by parent (versions roll up), TVL ≥ ${prettyUsd(MIN_TVL)}; excluded categories: ${[...EXCLUDED].join(", ")}.` });

  sources.push({ id: "gleif", label: "GLEIF LEI records (legal name and HQ city)", publisher: "Global Legal Entity Identifier Foundation", url: "https://api.gleif.org/api/v1/lei-records", fetchedAt: fetchedAt["gleif.json"], rows: 0, kept: 0, rule: "Used to resolve legal names and HQ cities for every record with an LEI; not a source of institutions." });
  sources.push({ id: "geonames", label: "GeoNames cities15000 + country info", publisher: "GeoNames (CC BY 4.0)", url: "https://download.geonames.org/export/dump/", fetchedAt: fetchedAt["cities15000.zip"], rows: cityIndex.size, kept: 0, rule: "Geocodes HQ cities; falls back to the national capital (marked) when the city can't be matched." });

  records.sort((a, b) => a.cat.localeCompare(b.cat) || a.name.localeCompare(b.name));
  await writeFile(OUT, JSON.stringify(records));
  await writeFile(MANIFEST, JSON.stringify(sources, null, 2) + "\n");
  await writeFile(`${RAW}/_fetched.json`, JSON.stringify({ ...JSON.parse((await readFile(`${RAW}/_fetched.json`, "utf8").catch(() => "{}")) || "{}"), ...Object.fromEntries(Object.entries(fetchedAt).filter(([, v]) => v !== "cached")) }, null, 2));

  const byCat: Record<string, number> = {};
  for (const r of records) byCat[r.cat] = (byCat[r.cat] ?? 0) + 1;
  const geo = { city: records.filter((r) => r.geo === "city").length, capital: records.filter((r) => r.geo === "capital").length, none: records.filter((r) => r.geo === "none").length };
  console.log(`\n✓ ${records.length} institutions → ${OUT}`);
  console.log(byCat);
  console.log("kept per source", kept, "geo", geo, "matched to core", records.filter((r) => r.core).length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
