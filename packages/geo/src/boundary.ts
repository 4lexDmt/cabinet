/**
 * Boundary classification and point of view.
 *
 * A boundary is one geometry with several readings. Natural Earth ships those
 * readings today in its `FCLASS_*` fields — one per government — and they are
 * sparsely populated by design: NULL means "this government has no quarrel with
 * this line", so the neutral rendering applies.
 *
 * The worked case, and the one the tests pin:
 *
 *   Kashmir Line of Control
 *     neutral  -> line_of_control    a de facto military line, no agreed status
 *     India    -> international      the whole of J&K is Indian territory
 *     Pakistan -> administrative     an internal line pending plebiscite
 *
 * Pakistan's official view renders the LoC as a sub-national administrative
 * line, because from Islamabad it is not an international border at all. One
 * field, a complete geopolitical argument.
 */

import type { BoundaryClass, BoundaryPerspective } from "./types.ts";

/**
 * The 33 point-of-view fields Natural Earth carries on
 * `ne_10m_admin_0_boundary_lines_land`. `ISO` is the disinterested reading.
 */
export const PERSPECTIVE_CODES = [
  "ISO",
  "US",
  "FR",
  "RU",
  "ES",
  "CN",
  "TW",
  "IN",
  "NP",
  "PK",
  "DE",
  "GB",
  "BR",
  "IL",
  "PS",
  "SA",
  "EG",
  "MA",
  "PT",
  "AR",
  "JP",
  "KO",
  "VN",
  "TR",
  "ID",
  "PL",
  "GR",
  "IT",
  "NL",
  "SE",
  "BD",
  "UA",
  "TLC",
] as const;

export type PerspectiveCode = (typeof PERSPECTIVE_CODES)[number];

export const NEUTRAL_OBSERVER = "NEUTRAL";

/** Property key a perspective is emitted under, e.g. `IN` -> `pov_in`. */
export function povKey(observer: string): string {
  const code = observer.trim().toUpperCase();
  if (code === "ISO" || code === NEUTRAL_OBSERVER || code === "") return "pov_neutral";
  return `pov_${code.toLowerCase()}`;
}

/** Natural Earth source field for a perspective, e.g. `IN` -> `FCLASS_IN`. */
export function fclassField(code: string): string {
  return `FCLASS_${code.trim().toUpperCase()}`;
}

/**
 * Natural Earth's vocabulary, normalized.
 *
 * Returns `null` for a value we do not recognise. That is deliberate: the tile
 * pipeline fails loudly on an unmapped value rather than quietly defaulting it
 * to `international`, because defaulting a disputed line to an agreed one is
 * exactly the error this whole mechanism exists to prevent.
 */
export function normalizeBoundaryClass(raw: unknown): BoundaryClass | null {
  if (raw === null || raw === undefined) return null;
  const value = String(raw)
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (value === "" || value === "null" || value === "none") return null;

  if (value.includes("line of control")) return "line_of_control";
  if (value.includes("unrecognized") || value.includes("unrecognised")) return "unrecognized";
  if (value.includes("disputed") || value.includes("claim") || value.includes("breakaway")) return "disputed";
  if (value.includes("indefinite") || value.includes("indeterminant") || value.includes("elusive")) {
    return "indefinite";
  }
  if (
    value.includes("admin-1") ||
    value.includes("admin-0 region") ||
    value.includes("map unit") ||
    value.includes("administrative") ||
    value.includes("lease limit") ||
    value.includes("overlay limit")
  ) {
    return "administrative";
  }
  if (value.includes("international") || value.includes("country") || value.includes("boundary")) {
    return "international";
  }
  return null;
}

export interface UnmappedBoundaryValue {
  field: string;
  value: string;
}

export interface PerspectiveResult {
  /** `pov_neutral`, `pov_in`, `pov_pk`, ... -> classification. */
  properties: Record<string, BoundaryClass>;
  /** Values the normalizer did not recognise. The pipeline must fail on these. */
  unmapped: UnmappedBoundaryValue[];
}

/**
 * Turn one Natural Earth boundary row into one property per perspective.
 *
 * Emitting every perspective onto a single feature is what lets a single tile
 * layer be restyled per observer at runtime — no per-perspective tilesets, no
 * refetching when a player switches desks.
 */
export function boundaryPerspectives(
  properties: Record<string, unknown>,
  codes: readonly string[] = PERSPECTIVE_CODES,
): PerspectiveResult {
  const unmapped: UnmappedBoundaryValue[] = [];
  const read = (field: string): BoundaryClass | null => {
    const raw = properties[field] ?? properties[field.toLowerCase()];
    if (raw === null || raw === undefined || String(raw).trim() === "") return null;
    const cls = normalizeBoundaryClass(raw);
    if (!cls) unmapped.push({ field, value: String(raw) });
    return cls;
  };

  const featurecla = read("FEATURECLA");
  const neutral = read(fclassField("ISO")) ?? featurecla ?? "international";

  const out: Record<string, BoundaryClass> = { pov_neutral: neutral };
  for (const code of codes) {
    if (code.toUpperCase() === "ISO") continue;
    const cls = read(fclassField(code));
    if (cls) out[povKey(code)] = cls;
  }
  return { properties: out, unmapped };
}

/**
 * Read a boundary from one government's desk.
 *
 * Absence is not an error, it is agreement: a government with no entry on a
 * segment simply accepts the neutral reading.
 */
export function readBoundary(
  povProperties: Record<string, unknown>,
  observer: string = NEUTRAL_OBSERVER,
): BoundaryClass {
  const own = povProperties[povKey(observer)];
  if (typeof own === "string" && isBoundaryClass(own)) return own;
  const neutral = povProperties.pov_neutral;
  if (typeof neutral === "string" && isBoundaryClass(neutral)) return neutral;
  return "international";
}

export function isBoundaryClass(value: string): value is BoundaryClass {
  return (
    value === "international" ||
    value === "disputed" ||
    value === "line_of_control" ||
    value === "unrecognized" ||
    value === "administrative" ||
    value === "indefinite"
  );
}

/** Every perspective that disagrees with the neutral reading of a segment. */
export function disagreements(povProperties: Record<string, unknown>): BoundaryPerspective[] {
  const neutral = readBoundary(povProperties, NEUTRAL_OBSERVER);
  const out: BoundaryPerspective[] = [];
  for (const [key, value] of Object.entries(povProperties)) {
    if (!key.startsWith("pov_") || key === "pov_neutral") continue;
    if (typeof value !== "string" || !isBoundaryClass(value)) continue;
    if (value === neutral) continue;
    out.push({ observer: key.slice(4).toUpperCase(), classification: value });
  }
  return out.sort((a, b) => a.observer.localeCompare(b.observer));
}

export interface BoundaryLegendEntry {
  label: string;
  gloss: string;
}

/** Legend copy. Stated plainly, because a legend that hedges teaches nothing. */
export const BOUNDARY_LEGEND: Record<BoundaryClass, BoundaryLegendEntry> = {
  international: { label: "International boundary", gloss: "Mutually recognised." },
  disputed: { label: "Disputed", gloss: "Claimed by more than one party. No agreed line." },
  line_of_control: { label: "Line of control", gloss: "De facto military line. Not a legal border." },
  unrecognized: {
    label: "Unrecognized",
    gloss: "This perspective does not accept that this line exists.",
  },
  administrative: { label: "Administrative", gloss: "Internal, sub-national." },
  indefinite: { label: "Indefinite", gloss: "Location genuinely unknown or unsurveyed." },
};
