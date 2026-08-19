/**
 * Google-Maps-like zoom gates for the tier-1 gazetteer overlay.
 *
 * `relativeK` is camera.k / minK: 1 is the world fitted to the frame.
 * Labels and admin lines appear as the sheet is zoomed, then lesser names
 * yield — cities stay, province names drop — the same way Google Maps
 * does not draw every ADM1 at world scale.
 *
 * Presentation numbers, not simulation. Kept here so the gates are tested
 * with the gazetteer rather than living only in a React file.
 */

export const GAZETTEER_ZOOM = {
  lakes: 1.05,
  rivers: 2.4,
  /** Megacities. Visible on the world plate. */
  cityT3: 1.0,
  /** Major cities. Appear once a theatre is readable. */
  cityT2: 4.2,
  /** Secondary cities. Appear at country / regional scale. */
  cityT1: 7.4,
  /** Capitals one step earlier than their tier, never later than T2. */
  capital: 3.6,
  /** Incorporated-province outlines. Thinner and paler than the state line. */
  provinceBorders: 4.0,
  provinceLabels: 6.0,
  provinceLabelsUntil: 18,
  saudiAssets: 8.5,
} as const;

export function cityVisible(relativeK: number, tier: number, capital: boolean): boolean {
  if (capital && relativeK >= GAZETTEER_ZOOM.capital) return true;
  if (tier >= 3) return relativeK >= GAZETTEER_ZOOM.cityT3;
  if (tier >= 2) return relativeK >= GAZETTEER_ZOOM.cityT2;
  return relativeK >= GAZETTEER_ZOOM.cityT1;
}

export function provinceBordersVisible(relativeK: number): boolean {
  return relativeK >= GAZETTEER_ZOOM.provinceBorders;
}

export function provinceLabelsVisible(relativeK: number): boolean {
  return relativeK >= GAZETTEER_ZOOM.provinceLabels && relativeK < GAZETTEER_ZOOM.provinceLabelsUntil;
}
