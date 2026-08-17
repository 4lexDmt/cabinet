/**
 * Maritime zones.
 *
 * Two errors this module exists to make impossible.
 *
 * 1. An EEZ is not territory. It confers sovereign rights over resources and
 *    nothing else; the surface waters are international. Rendering it in the
 *    land fill is the most common cartographic lie on geopolitical maps, and in
 *    a game about competing claims it would be the interface taking a side.
 *
 * 2. Marine Regions' EEZ polygons *include* archipelagic, internal, and
 *    territorial waters — a deliberate deviation from the UNCLOS definition.
 *    Stacking the published layers double-renders the inner zones and produces
 *    both wrong colours and wrong areas. The zones must be differenced into a
 *    single ladder where each point of sea belongs to exactly one zone.
 */

import type { MaritimeZone, ZoneCharacter } from "./types.ts";

export const NAUTICAL_MILE_KM = 1.852;

export function nmToKm(nm: number): number {
  return nm * NAUTICAL_MILE_KM;
}

export function kmToNm(km: number): number {
  return km / NAUTICAL_MILE_KM;
}

/**
 * True of the published Marine Regions product, and the reason
 * `differenceOrder` exists. Kept as a named constant so the assumption is
 * visible at the point of use rather than buried in a build script.
 */
export const PUBLISHED_EEZ_INCLUDES_INNER_ZONES = true;

/**
 * The sovereignty ladder. Ordered landward to seaward.
 *
 * Note the absence of a "sovereign waters" entry: sovereignty is a property of
 * a zone, not a zone of its own. `SOVEREIGN_ZONES` derives it.
 */
export const ZONE_LADDER: readonly ZoneCharacter[] = [
  {
    zone: "internal",
    outerLimitNm: 0,
    sovereignty: "full",
    legend: "Internal waters — landward of the baseline. Full sovereignty.",
  },
  {
    zone: "territorial",
    outerLimitNm: 12,
    sovereignty: "full",
    legend: "Territorial sea — full sovereignty, subject to innocent passage by ships.",
  },
  {
    zone: "contiguous",
    outerLimitNm: 24,
    sovereignty: "enforcement_only",
    legend: "Contiguous zone — customs, fiscal, immigration and sanitary enforcement only.",
  },
  {
    zone: "eez",
    outerLimitNm: 200,
    sovereignty: "resource_rights_only",
    legend: "Exclusive economic zone — sovereign rights over resources. Not territory.",
  },
  {
    zone: "high_seas",
    outerLimitNm: null,
    sovereignty: "none",
    legend: "High seas — no national jurisdiction.",
  },
] as const;

/** Zones that are national territory at sea. Airspace derives from exactly these. */
export const SOVEREIGN_ZONES: readonly MaritimeZone[] = ["internal", "territorial"];

export function characterOf(zone: MaritimeZone): ZoneCharacter {
  const found = ZONE_LADDER.find((z) => z.zone === zone);
  if (!found) throw new Error(`unknown maritime zone: ${zone}`);
  return found;
}

/** An EEZ is never territory. Guard game logic with this, not with a colour. */
export function isTerritorialWater(zone: MaritimeZone): boolean {
  return SOVEREIGN_ZONES.includes(zone);
}

/**
 * "International waters" is not one thing. Freedom of navigation and overflight
 * already apply on the surface of an EEZ, so a two-way split would be wrong.
 */
export type WaterClass = "sovereign" | "resource_jurisdiction" | "high_seas";

export function waterClassOf(zone: MaritimeZone): WaterClass {
  if (zone === "internal" || zone === "territorial") return "sovereign";
  if (zone === "contiguous" || zone === "eez") return "resource_jurisdiction";
  return "high_seas";
}

/**
 * What a scenario's era actually supports.
 *
 * The 12nm territorial sea and the EEZ both arrive with UNCLOS (1982, in force
 * 1994). Before that the territorial sea is 3nm — the cannon-shot rule — and
 * there is no EEZ at all. For a canal crisis that is not a detail; it is the
 * substance of the dispute.
 */
export interface MaritimeEra {
  territorialSeaNm: number;
  hasContiguousZone: boolean;
  hasEez: boolean;
}

export const UNCLOS_ERA: MaritimeEra = {
  territorialSeaNm: 12,
  hasContiguousZone: true,
  hasEez: true,
};

export const CANNON_SHOT_ERA: MaritimeEra = {
  territorialSeaNm: 3,
  hasContiguousZone: false,
  hasEez: false,
};

export interface ZoneBand {
  zone: MaritimeZone;
  /** Inclusive lower bound in nautical miles from the baseline. */
  innerNm: number;
  /** Exclusive upper bound. `null` is unbounded. */
  outerNm: number | null;
}

/**
 * The differenced ladder for an era: contiguous bands, no overlaps, no gaps.
 *
 * This is the shape the renderer must consume. Consuming the published,
 * overlapping polygons directly is the bug described at the top of this file.
 */
export function zoneBands(era: MaritimeEra = UNCLOS_ERA): ZoneBand[] {
  const bands: ZoneBand[] = [{ zone: "internal", innerNm: -Infinity, outerNm: 0 }];
  let edge = 0;
  if (era.territorialSeaNm > 0) {
    bands.push({ zone: "territorial", innerNm: edge, outerNm: era.territorialSeaNm });
    edge = era.territorialSeaNm;
  }
  if (era.hasContiguousZone) {
    const outer = Math.max(edge, era.territorialSeaNm * 2);
    bands.push({ zone: "contiguous", innerNm: edge, outerNm: outer });
    edge = outer;
  }
  if (era.hasEez) {
    bands.push({ zone: "eez", innerNm: edge, outerNm: 200 });
    edge = 200;
  }
  bands.push({ zone: "high_seas", innerNm: edge, outerNm: null });
  return bands;
}

/** The one zone that owns a given distance from the baseline. */
export function zoneAtDistanceNm(distanceNm: number, era: MaritimeEra = UNCLOS_ERA): MaritimeZone {
  for (const band of zoneBands(era)) {
    const under = band.outerNm === null || distanceNm < band.outerNm;
    if (distanceNm >= band.innerNm && under) return band.zone;
  }
  return "high_seas";
}

export interface BandOverlap {
  a: MaritimeZone;
  b: MaritimeZone;
}

/**
 * Structural check that a ladder is mutually exclusive and covers the sea.
 * Runs in the tile pipeline's test and in the renderer's own assertions.
 */
export function bandOverlaps(bands: ZoneBand[]): BandOverlap[] {
  const out: BandOverlap[] = [];
  for (let i = 0; i < bands.length; i++) {
    for (let j = i + 1; j < bands.length; j++) {
      const a = bands[i]!;
      const b = bands[j]!;
      const aOuter = a.outerNm ?? Infinity;
      const bOuter = b.outerNm ?? Infinity;
      if (a.innerNm < bOuter && b.innerNm < aOuter) out.push({ a: a.zone, b: b.zone });
    }
  }
  return out;
}

export function bandGaps(bands: ZoneBand[]): Array<[number, number]> {
  const sorted = [...bands].sort((a, b) => a.innerNm - b.innerNm);
  const gaps: Array<[number, number]> = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    const outer = sorted[i]!.outerNm;
    const next = sorted[i + 1]!.innerNm;
    if (outer !== null && outer < next) gaps.push([outer, next]);
  }
  return gaps;
}

/**
 * The order the pipeline must difference published polygons in, seaward last:
 *
 *   eez_only = eez − (territorial ∪ contiguous ∪ internal ∪ archipelagic)
 *
 * Archipelagic waters are folded into `internal` for rendering because they
 * carry the same sovereignty; they remain a separate source layer.
 */
export const DIFFERENCE_ORDER: readonly MaritimeZone[] = [
  "internal",
  "territorial",
  "contiguous",
  "eez",
] as const;
