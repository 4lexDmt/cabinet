/**
 * Google-Maps-like zoom gates and label collision for the tier-1 overlay.
 *
 * `relativeK` is camera.k / minK: 1 is the world fitted to the frame.
 * Labels appear as the sheet is zoomed, then lesser names yield — cities
 * stay, province names drop — the same way Google Maps does not draw
 * every ADM1 at world scale, and does not let two names occupy one spot.
 *
 * Presentation, not simulation. Kept here so the gates are tested with
 * the gazetteer rather than living only in a React file.
 */

import { LABEL_ANCHORS } from "./cartography.ts";

export const GAZETTEER_ZOOM = {
  lakes: 1.0,
  rivers: 1.35,
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

export function cityRank(tier: number, capital: boolean, population: number): number {
  const tierPenalty = tier >= 3 ? 0 : tier >= 2 ? 2 : 4;
  const cap = capital ? -0.5 : 0;
  return tierPenalty + cap - Math.min(population, 40_000_000) / 1e8;
}

export const PROVINCE_LABEL_RANK = 10;

export function cityFontSize(tier: number): number {
  if (tier >= 3) return 12.5;
  if (tier >= 2) return 11;
  return 10;
}

export function cityMarkRadius(tier: number): number {
  if (tier >= 3) return 3.2;
  if (tier >= 2) return 2.4;
  return 2;
}

export interface GazetteerLabelInput {
  id: string;
  kind: "city" | "province";
  name: string;
  /** Projected sheet coordinates. */
  x: number;
  y: number;
  rank: number;
  fontSize: number;
  markRadius: number;
  showMark: boolean;
  capital?: boolean;
  tier?: number;
}

export interface GazetteerLabelPlaced extends GazetteerLabelInput {
  textAnchor: "start" | "end" | "middle";
  /** Screen-pixel offset from the mark, for the inverse-scaled <text>. */
  dx: number;
  dy: number;
}

interface Box {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

function overlaps(a: Box, b: Box, gap: number): boolean {
  return !(a.x1 < b.x0 - gap || a.x0 > b.x1 + gap || a.y1 < b.y0 - gap || a.y0 > b.y1 + gap);
}

/**
 * Greedy, rank-ordered placement. A name that cannot sit clear of what is
 * already on the plate is dropped, never shrunk. Cities outrank provinces.
 * The same input always produces the same labels.
 */
export function placeGazetteerLabels(
  inputs: GazetteerLabelInput[],
  cameraK: number,
  gapPx = 6,
): GazetteerLabelPlaced[] {
  const k = Math.max(cameraK, 1e-6);
  const ordered = [...inputs].sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name));
  const taken: Box[] = [];
  const placed: GazetteerLabelPlaced[] = [];

  for (const item of ordered) {
    const px = item.x * k;
    const py = item.y * k;
    const mark = item.showMark ? item.markRadius : 0;
    const textW = Math.max(8, item.name.length * item.fontSize * 0.52);
    const textH = item.fontSize * 1.12;

    if (item.showMark) {
      const markBox: Box = {
        x0: px - mark - 1,
        y0: py - mark - 1,
        x1: px + mark + 1,
        y1: py + mark + 1,
      };
      if (taken.some((box) => overlaps(markBox, box, gapPx))) continue;
    }

    const anchors: ReadonlyArray<[number, number, "start" | "end" | "middle", number]> =
      item.kind === "province" ? [[0, 0, "middle", 0.35]] : LABEL_ANCHORS;

    let chosen: { textAnchor: GazetteerLabelPlaced["textAnchor"]; dx: number; dy: number; box: Box } | null =
      null;

    for (const [adx, ady, anchor, dyEm] of anchors) {
      const dx = item.kind === "province" ? 0 : adx * (mark + 4);
      const dy = item.kind === "province" ? item.fontSize * dyEm : ady * (mark + 2) + dyEm * textH;
      const ox = px + dx;
      const oy = py + dy;
      const x0 = anchor === "start" ? ox : anchor === "end" ? ox - textW : ox - textW / 2;
      const box: Box = {
        x0,
        y0: oy - textH * 0.82,
        x1: x0 + textW,
        y1: oy + textH * 0.28,
      };
      if (taken.some((existing) => overlaps(box, existing, gapPx))) continue;
      chosen = { textAnchor: anchor, dx, dy, box };
      break;
    }

    if (!chosen) continue;

    if (item.showMark) {
      taken.push({
        x0: px - mark - 1,
        y0: py - mark - 1,
        x1: px + mark + 1,
        y1: py + mark + 1,
      });
    }
    taken.push(chosen.box);
    placed.push({ ...item, textAnchor: chosen.textAnchor, dx: chosen.dx, dy: chosen.dy });
  }

  return placed;
}
