/**
 * Airspace.
 *
 * The distinction this module encodes, and which public discourse — including
 * governments during crises — collapses constantly:
 *
 *   Sovereign national airspace is the air over land territory, internal
 *   waters, archipelagic waters, and the territorial sea. The state has
 *   complete and exclusive sovereignty there. Unlike ships, aircraft have NO
 *   right of innocent passage over the territorial sea. Beyond that limit the
 *   airspace is international.
 *
 *   A Flight Information Region is an ICAO service and control area. It is not
 *   sovereignty, and FIRs routinely extend far over the high seas. An aircraft
 *   inside a state's FIR but outside its territorial sea needs no permission
 *   and is not in that state's airspace.
 *
 * For a game about competing claims the gap between administrative reach and
 * sovereign reach is not a nuisance to be smoothed over. It is material. So the
 * two are separate layers and are never merged.
 */

import type { MaritimeEra } from "./maritime.js";

export type AirspaceLayer = "airspace_sovereign" | "airspace_fir";

/**
 * Sovereign airspace is derived, never sourced:
 *
 *   sovereign_airspace = land ∪ internal ∪ archipelagic ∪ territorial_sea
 *
 * One union of layers the pipeline already has. More accurate than anything
 * downloadable, and free.
 */
export const SOVEREIGN_AIRSPACE_COMPONENTS = [
  "land",
  "internal_waters",
  "archipelagic_waters",
  "territorial_sea",
] as const;

export type AirspaceComponent = (typeof SOVEREIGN_AIRSPACE_COMPONENTS)[number];

/** ICAO established Flight Information Regions in 1947. */
export const FIR_ESTABLISHED_YEAR = 1947;

export function firsExistInYear(year: number): boolean {
  return year >= FIR_ESTABLISHED_YEAR;
}

/**
 * The seaward reach of sovereign airspace for an era. Pre-UNCLOS this is the
 * 3nm cannon-shot limit, so a 1956 canal crisis has a very different ceiling of
 * national air sovereignty from a modern one.
 */
export function sovereignAirspaceReachNm(era: MaritimeEra): number {
  return era.territorialSeaNm;
}

/**
 * The vertical limit is undefined in treaty. The Kármán line is convention, not
 * law, and the United States uses a lower threshold for its own purposes. If a
 * scenario models altitude bands it should model the ambiguity too rather than
 * assert a boundary that no instrument establishes.
 */
export const VERTICAL_LIMIT = {
  karmanLineKm: 100,
  usAstronautThresholdKm: 80.467,
  establishedByTreaty: false,
  note: "No treaty fixes the upper limit of national airspace. Both figures are conventions.",
} as const;

export interface AirspaceRules {
  /** Aircraft have no innocent-passage right over the territorial sea. */
  innocentPassageForAircraft: false;
  innocentPassageForShips: true;
  seawardReachNm: number;
  firsAvailable: boolean;
}

export function airspaceRules(era: MaritimeEra, year: number): AirspaceRules {
  return {
    innocentPassageForAircraft: false,
    innocentPassageForShips: true,
    seawardReachNm: sovereignAirspaceReachNm(era),
    firsAvailable: firsExistInYear(year),
  };
}
