/**
 * Sheets — config, not code.
 *
 * A sheet is a frame, a projection and a register. Adding one requires no
 * engine change, which is the same rule scenarios follow. Each sheet names the
 * governments whose reading of it actually differs, so the perspective control
 * offers the arguments this frame contains rather than all thirty-two.
 */

import {
  REGISTERS,
  conicConformal,
  projectionFor,
  recommendProjection,
  type BBox,
  type Projection,
  type ProjectionKind,
  type ZoomRegister,
} from "@cabinet/geo";

export interface SheetConfig {
  id: string;
  label: string;
  /** Printed in the title block. */
  scale: string;
  bbox: BBox;
  register: ZoomRegister["id"];
  /** Governments whose reading of this frame differs from the neutral one. */
  parties: string[];
  /** What this sheet is for. Shown under the frame, not as a tooltip. */
  brief: string;
  /** Explicit projection override; otherwise the frame chooses. */
  projection?: { kind?: ProjectionKind; parallels?: [number, number]; lon0?: number };
  /**
   * Whether east and west edges are the same meridian, so the sheet repeats
   * horizontally instead of ending. Only true for a frame that spans a full
   * 360°: anything narrower would repeat with a gap in it.
   */
  wraps?: boolean;
}

export const SHEETS: SheetConfig[] = [
  {
    id: "world",
    label: "The world",
    scale: "1:110M",
    // The full 360°, not -179..179: the sheet has to carry a whole period of
    // longitude for its east edge to meet its west one when it repeats.
    //
    // North to 84°, which is past Cape Morris Jesup, Ellesmere and Svalbard —
    // the usual 79° or 80° cut takes the top off Greenland and most of the
    // Canadian archipelago, and an arctic power whose territory is missing
    // from the plate is a poor start for a game about territory. Mercator
    // inflates all of it, which the title block declares.
    bbox: [-180, -58, 180, 84],
    register: "theatre",
    parties: ["CN", "RU", "IN", "PK", "IL", "PS", "MA", "AR", "GB", "TR", "GR", "UA"],
    brief:
      "Every boundary on earth, and 72 segments where at least one government reads the line differently from everyone else.",
    // Mercator rather than the frame's own recommendation. A plate carrée
    // world draws a degree of longitude the same width at 60° as at the
    // equator, so every northern country comes out smeared sideways and
    // squashed flat. Mercator is conformal: it lies about area — declared in
    // the title block — but keeps each country the shape it actually is,
    // which is the shape readers know. It also makes the maritime zones
    // honest, because a circle of sea stays a circle under a conformal
    // projection and the distance field is isotropic.
    projection: { kind: "mercator" },
    wraps: true,
  },
  {
    id: "kashmir",
    label: "Kashmir",
    scale: "1:4M",
    bbox: [72.4, 30.6, 81.6, 37.6],
    register: "regional",
    parties: ["IN", "PK", "CN"],
    brief:
      "One geometry, three readings. From Delhi the Line of Control is an international boundary; from Islamabad it is an internal administrative line pending plebiscite; to nobody in particular it is a de facto military line with no agreed legal status.",
  },
  {
    id: "baltic",
    label: "Baltic approaches",
    scale: "1:9M",
    bbox: [3, 52, 37, 67],
    register: "theatre",
    parties: ["RU", "UA", "PL", "SE", "DE"],
    brief:
      "A closed sea with one surface exit. Maritime zones matter more here than land boundaries: the Gulf of Finland narrows to a corridor of international water roughly 25 nautical miles wide.",
    projection: { parallels: [54, 66], lon0: 20 },
  },
  {
    id: "levant",
    label: "Eastern Mediterranean",
    scale: "1:6M",
    bbox: [24, 27, 43, 38],
    register: "regional",
    parties: ["IL", "PS", "EG", "SA", "TR", "GR"],
    brief:
      "Six governments, six readings, and a canal whose crises turn on where the territorial sea ends. In 1956 that was three nautical miles, not twelve.",
  },
  {
    id: "east_asia",
    label: "East Asia",
    scale: "1:22M",
    bbox: [95, 5, 148, 47],
    register: "theatre",
    parties: ["CN", "TW", "JP", "KO", "VN", "ID"],
    brief:
      "Where the gap between an exclusive economic zone and territory does the most work. An EEZ confers sovereign rights over resources; the surface waters remain international.",
  },
  {
    id: "maghreb",
    label: "Western Sahara",
    scale: "1:12M",
    bbox: [-19, 19, 4, 37],
    register: "regional",
    parties: ["MA", "ES", "FR"],
    brief:
      "A boundary that Rabat draws as internal and most of the world draws as indefinite. Read it from both desks in turn.",
  },
  {
    id: "black_sea",
    label: "The Black Sea",
    scale: "1:12M",
    bbox: [26, 40, 48, 53],
    register: "regional",
    parties: ["RU", "UA", "TR"],
    brief:
      "Crimea renders differently from Kyiv's desk and from Moscow's. Both readings are shipped in the same file, on the same geometry.",
  },
];

export function sheetById(id: string): SheetConfig {
  return SHEETS.find((s) => s.id === id) ?? SHEETS[0]!;
}

export function registerOf(sheet: SheetConfig): ZoomRegister {
  return REGISTERS[sheet.register];
}

export function projectionOf(sheet: SheetConfig): Projection {
  const declared = sheet.projection;
  if (!declared) return recommendProjection(sheet.bbox);
  if (declared.kind) {
    return projectionFor(declared.kind, { parallels: declared.parallels, lon0: declared.lon0 });
  }
  if (declared.parallels) return conicConformal(declared.parallels, declared.lon0 ?? 0);
  return recommendProjection(sheet.bbox);
}
