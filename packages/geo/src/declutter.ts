/**
 * Label placement.
 *
 * A place that cannot be labelled is dropped, not shrunk and not overlapped.
 * Dropping is reported rather than hidden: the sheet's title block prints how
 * many places were placed and how many were dropped, because a cartographer
 * needs to know when a sheet is over-subscribed and a silent omission looks
 * exactly like missing data.
 */

import { LABEL_ANCHORS, PLACE_MARK } from "./cartography.ts";
import type { Place } from "./places.ts";
import type { Point } from "./types.ts";

export interface LabelBox {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface PlacedLabel {
  place: Place;
  /** Mark position in px. */
  at: Point;
  /** Label anchor position in px. */
  labelAt: Point;
  anchor: "start" | "end" | "middle";
  fontSize: number;
  box: LabelBox;
}

export interface DeclutterResult {
  placed: PlacedLabel[];
  dropped: Array<{ place: Place; why: "offscreen" | "mark collision" | "no free anchor" | "budget" }>;
}

function overlaps(a: LabelBox, b: LabelBox, gap: number): boolean {
  return !(a.x1 < b.x0 - gap || a.x0 > b.x1 + gap || a.y1 < b.y0 - gap || a.y0 > b.y1 + gap);
}

export interface DeclutterOptions {
  width: number;
  height: number;
  /** Minimum clear space between any two boxes, in px. */
  gap?: number;
  /** Boxes already claimed — sheet furniture, legend, title block. */
  reserved?: LabelBox[];
  /** Hard ceiling on placed labels. */
  budget?: number;
  margin?: number;
}

/**
 * Greedy placement in rank order, trying eight anchors around each mark.
 *
 * Greedy rather than optimal on purpose: a stable, explicable result matters
 * more than a maximal one. The same input must always produce the same sheet,
 * or two players comparing the same theatre would see different maps.
 */
export function declutter(
  places: Place[],
  project: (lonLat: [number, number]) => Point | null,
  options: DeclutterOptions,
): DeclutterResult {
  const gap = options.gap ?? 3;
  const margin = options.margin ?? 8;
  const budget = options.budget ?? Number.POSITIVE_INFINITY;
  const taken: LabelBox[] = [...(options.reserved ?? [])];
  const placed: PlacedLabel[] = [];
  const dropped: DeclutterResult["dropped"] = [];

  const ordered = [...places].sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name));

  for (const place of ordered) {
    if (placed.length >= budget) {
      dropped.push({ place, why: "budget" });
      continue;
    }
    const at = project(place.lonLat);
    if (
      !at ||
      !Number.isFinite(at[0]) ||
      !Number.isFinite(at[1]) ||
      at[0] < margin ||
      at[0] > options.width - margin ||
      at[1] < margin ||
      at[1] > options.height - margin
    ) {
      dropped.push({ place, why: "offscreen" });
      continue;
    }

    const mark = PLACE_MARK[place.tier];
    const markBox: LabelBox = {
      x0: at[0] - mark.radius - 1,
      y0: at[1] - mark.radius - 1,
      x1: at[0] + mark.radius + 1,
      y1: at[1] + mark.radius + 1,
    };
    if (taken.some((t) => overlaps(markBox, t, gap))) {
      dropped.push({ place, why: "mark collision" });
      continue;
    }

    const size = mark.fontSize;
    const textWidth = place.name.length * size * (place.tier === "minor" ? 0.46 : 0.5);
    const textHeight = size * 1.02;

    let chosen: { labelAt: Point; anchor: PlacedLabel["anchor"]; box: LabelBox } | null = null;
    for (const [dx, dy, anchor, dyEm] of LABEL_ANCHORS) {
      const ox = at[0] + dx * (mark.radius + 3.2);
      const oy = at[1] + dy * (mark.radius + 2) + dyEm * textHeight;
      const x0 = anchor === "start" ? ox : anchor === "end" ? ox - textWidth : ox - textWidth / 2;
      const box: LabelBox = {
        x0,
        y0: oy - textHeight * 0.8,
        x1: x0 + textWidth,
        y1: oy + textHeight * 0.22,
      };
      if (taken.some((t) => overlaps(box, t, gap))) continue;
      chosen = { labelAt: [ox, oy], anchor, box };
      break;
    }
    if (!chosen) {
      dropped.push({ place, why: "no free anchor" });
      continue;
    }

    taken.push(markBox, chosen.box);
    placed.push({
      place,
      at,
      labelAt: chosen.labelAt,
      anchor: chosen.anchor,
      fontSize: size,
      box: chosen.box,
    });
  }

  return { placed, dropped };
}
