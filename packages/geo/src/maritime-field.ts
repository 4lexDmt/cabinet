/**
 * Maritime zones, computed rather than traced.
 *
 * The zones are derived by equidistance from real sampled coastline — the same
 * principle as UNCLOS Article 15 median lines — so where two states' zones meet,
 * the line that appears is a genuine median rather than a drawn guess.
 *
 * Two consequences worth stating.
 *
 * First, this works without the Marine Regions download, which is gated behind
 * a form and therefore cannot be part of an automated pipeline. When those
 * files are present the published polygons win; until then these are honest.
 *
 * Second, the zones come out of a single distance field, so they cannot
 * overlap: each cell has exactly one distance and therefore falls in exactly
 * one band. The published polygons overlap by construction and have to be
 * differenced. This does not.
 */

import { marchingSquares, ringsToPath, type Ring } from "./contour.ts";
import { zoneBands, type MaritimeEra, type ZoneBand } from "./maritime.ts";
import type { Point } from "./types.ts";

/** Sentinel owners. */
export const LAND = -2;
export const UNCLAIMED = -1;

export interface CoastSamples {
  id: string;
  /** Coastline vertices in pixel space, already densified. */
  points: Point[];
}

export interface MaritimeField {
  cellSize: number;
  cols: number;
  rows: number;
  /** Index into `ids`, or LAND / UNCLAIMED. */
  owner: Int16Array;
  /** Pixels to the nearest coastline sample. */
  distance: Float32Array;
  ids: string[];
}

export interface FieldOptions {
  width: number;
  height: number;
  /** Grid resolution in pixels. Smaller is smoother and slower. */
  cellSize?: number;
  coasts: CoastSamples[];
  /**
   * Land in pixel space, as one entry per POLYGON, each entry being that
   * polygon's own closed rings — outer ring first, holes after. The nesting
   * matters: see `rasterizeLand`.
   */
  landPolygons: Point[][][];
}

/**
 * Scanline polygon fill, one polygon at a time, unioned.
 *
 * Even-odd WITHIN a polygon, because Natural Earth rings are not reliably wound
 * and even-odd gives that polygon's lakes and enclosed seas for free. Union
 * ACROSS polygons, which is the part that has to be done separately.
 *
 * Filling every ring on earth in a single even-odd pass looks equivalent and is
 * not, in two ways that both show up as long straight lines in the sea:
 *
 * - Adjacent countries share a border, so their edges are duplicated. Two
 *   coincident edges cancel under even-odd, opening a sliver of phantom sea
 *   along the shared border. Along a geometric border — Libya/Chad, Egypt/Sudan
 *   — that sliver is dead straight and hundreds of miles long, and the twelve
 *   mile limit dutifully traces it across the Sahara.
 *
 * - Worse, crossings from unrelated polygons get sorted into one list and
 *   paired off against each other. A scanline that leaves Tunisia and enters
 *   Turkey pairs those two crossings and fills the Mediterranean between them
 *   as land.
 */
function rasterizeLand(polygons: Point[][][], cols: number, rows: number, cellSize: number): Uint8Array {
  const mask = new Uint8Array(cols * rows);
  const crossings: number[] = [];
  for (let row = 0; row < rows; row++) {
    const y = (row + 0.5) * cellSize;
    for (const rings of polygons) {
      crossings.length = 0;
      for (const ring of rings) {
        for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
          const a = ring[j]!;
          const b = ring[i]!;
          if (a[1] === b[1]) continue;
          if (y < Math.min(a[1], b[1]) || y >= Math.max(a[1], b[1])) continue;
          crossings.push(a[0] + ((y - a[1]) / (b[1] - a[1])) * (b[0] - a[0]));
        }
      }
      if (crossings.length < 2) continue;
      crossings.sort((p, q) => p - q);
      for (let k = 0; k + 1 < crossings.length; k += 2) {
        const from = Math.max(0, Math.ceil(crossings[k]! / cellSize - 0.5));
        const to = Math.min(cols - 1, Math.floor(crossings[k + 1]! / cellSize - 0.5));
        for (let col = from; col <= to; col++) mask[row * cols + col] = 1;
      }
    }
  }
  return mask;
}

/** Uniform spatial hash. Enough for a few tens of thousands of coastline samples. */
function buildIndex(points: Array<{ x: number; y: number; owner: number }>, cell: number) {
  const buckets = new Map<number, number[]>();
  let minX = Infinity;
  let minY = Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
  }
  const hash = (cx: number, cy: number) => cx * 73856093 + cy * 19349663;
  points.forEach((p, i) => {
    const cx = Math.floor((p.x - minX) / cell);
    const cy = Math.floor((p.y - minY) / cell);
    const k = hash(cx, cy);
    const bucket = buckets.get(k);
    if (bucket) bucket.push(i);
    else buckets.set(k, [i]);
  });
  return { buckets, minX, minY, cell, hash };
}

export function buildMaritimeField(options: FieldOptions): MaritimeField {
  const cellSize = options.cellSize ?? 4;
  const cols = Math.max(1, Math.ceil(options.width / cellSize));
  const rows = Math.max(1, Math.ceil(options.height / cellSize));
  const ids = options.coasts.map((c) => c.id);

  const samples: Array<{ x: number; y: number; owner: number }> = [];
  options.coasts.forEach((coast, index) => {
    for (const [x, y] of coast.points) {
      if (Number.isFinite(x) && Number.isFinite(y)) samples.push({ x, y, owner: index });
    }
  });

  const owner = new Int16Array(cols * rows).fill(UNCLAIMED);
  const distance = new Float32Array(cols * rows).fill(Number.POSITIVE_INFINITY);
  const land = rasterizeLand(options.landPolygons, cols, rows, cellSize);

  if (samples.length === 0) {
    for (let i = 0; i < land.length; i++) if (land[i]) owner[i] = LAND;
    return { cellSize, cols, rows, owner, distance, ids };
  }

  const index = buildIndex(samples, Math.max(cellSize * 4, 24));

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const i = row * cols + col;
      if (land[i]) {
        owner[i] = LAND;
        distance[i] = 0;
        continue;
      }
      const x = (col + 0.5) * cellSize;
      const y = (row + 0.5) * cellSize;
      let best = Number.POSITIVE_INFINITY;
      let bestOwner = UNCLAIMED;
      // Expanding ring search. Stops as soon as the next ring cannot beat the
      // current best, so a mid-ocean cell does not scan the whole coastline.
      for (let radius = 0; radius < 64; radius++) {
        const cx = Math.floor((x - index.minX) / index.cell);
        const cy = Math.floor((y - index.minY) / index.cell);
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            if (radius > 0 && Math.max(Math.abs(dx), Math.abs(dy)) !== radius) continue;
            const bucket = index.buckets.get(index.hash(cx + dx, cy + dy));
            if (!bucket) continue;
            for (const s of bucket) {
              const sample = samples[s]!;
              const d = Math.hypot(sample.x - x, sample.y - y);
              if (d < best) {
                best = d;
                bestOwner = sample.owner;
              }
            }
          }
        }
        if (bestOwner !== UNCLAIMED && best <= radius * index.cell) break;
      }
      owner[i] = bestOwner;
      distance[i] = best;
    }
  }

  return { cellSize, cols, rows, owner, distance, ids };
}

function maskFor(
  field: MaritimeField,
  predicate: (owner: number, distance: number) => boolean,
): Float32Array {
  const mask = new Float32Array(field.cols * field.rows);
  for (let i = 0; i < mask.length; i++) {
    mask[i] = predicate(field.owner[i]!, field.distance[i]!) ? 1 : 0;
  }
  return mask;
}

function ringsOf(field: MaritimeField, mask: Float32Array): Ring[] {
  return marchingSquares(mask, field.cols, field.rows, 0.5);
}

/**
 * One state's band between two radii. Sea only: land is excluded, so a band
 * never washes over the territory it belongs to.
 */
export function zoneBandPath(
  field: MaritimeField,
  stateIndex: number,
  innerPx: number,
  outerPx: number,
): string {
  const mask = maskFor(
    field,
    (owner, distance) => owner === stateIndex && distance > innerPx && distance <= outerPx,
  );
  return ringsToPath(ringsOf(field, mask), field.cellSize, [-field.cellSize / 2, -field.cellSize / 2]);
}

/** Everything beyond every state's outer limit. No national jurisdiction. */
export function highSeasPath(field: MaritimeField, outerPx: number): string {
  const mask = maskFor(field, (owner, distance) => owner !== LAND && distance > outerPx);
  return ringsToPath(ringsOf(field, mask), field.cellSize, [-field.cellSize / 2, -field.cellSize / 2]);
}

/**
 * The limit line at one distance from the coast, for every coastal state at
 * once: a closed envelope enclosing everything within `radiusPx` of land.
 *
 * Taken as an isoline of the distance field itself rather than as the edge of a
 * thresholded band, which matters for two reasons.
 *
 * First, precision. A band mask asks "is this cell's centre inside the zone",
 * so a zone thinner than one cell produces no cells and therefore no geometry
 * at all. On a narrow viewport a 12-mile territorial sea is a fraction of a
 * pixel wide and used to disappear entirely. An isoline is interpolated between
 * samples, so it exists — in the right place — at any width.
 *
 * Second, shape. Contouring a binary mask can only ever step between cell
 * centres, which reads as pixel-art. Contouring the distance field puts each
 * vertex where the distance actually equals the limit.
 *
 * `groundScale`, given a grid row, returns the factor converting a pixel
 * distance at that row into a true ground distance. On a conformal projection
 * the scale factor varies with latitude, so without this a 200-mile limit is
 * drawn short in the north and long at the equator.
 */
export function zoneLimitPath(
  field: MaritimeField,
  radiusPx: number,
  groundScale?: (row: number) => number,
): string {
  const { cols, rows, cellSize } = field;
  // Negated, because marching squares encloses values at or above the
  // threshold and the zone is the region within the limit, not beyond it.
  const values = new Float32Array(cols * rows);
  for (let row = 0; row < rows; row++) {
    const factor = groundScale ? groundScale(row) : 1;
    for (let col = 0; col < cols; col++) {
      const i = row * cols + col;
      values[i] = -(field.distance[i]! * factor);
    }
  }
  const rings = marchingSquares(values, cols, rows, -radiusPx);
  return ringsToPath(rings, cellSize, [cellSize / 2, cellSize / 2]);
}

export interface ZoneBandPath {
  band: ZoneBand;
  path: string;
}

/**
 * The whole ladder for one state, in one pass.
 *
 * The bands come from `zoneBands`, which is the same differenced ladder the
 * rest of the domain uses, so the era rules apply here without restating them:
 * a 1956 scenario gets a three-mile territorial sea and nothing beyond it.
 */
export function zoneLadderPaths(
  field: MaritimeField,
  stateIndex: number,
  pixelsPerNm: number,
  era?: MaritimeEra,
): ZoneBandPath[] {
  const out: ZoneBandPath[] = [];
  for (const band of zoneBands(era)) {
    if (band.zone === "internal" || band.zone === "high_seas") continue;
    const inner = Math.max(0, band.innerNm) * pixelsPerNm;
    const outer = (band.outerNm ?? 0) * pixelsPerNm;
    const path = zoneBandPath(field, stateIndex, inner, outer);
    if (path) out.push({ band, path });
  }
  return out;
}

/**
 * The median line where two states' zones meet.
 *
 * Taken as the zero-crossing of (distance to B − distance to A), clipped to the
 * corridor where both are within reach and neither is land. What survives is
 * the true equidistance line and nothing else.
 */
export function medianLinePath(
  field: MaritimeField,
  aIndex: number,
  bIndex: number,
  maxPx: number,
): string {
  const { cols, rows, cellSize } = field;
  const ownerAt = (col: number, row: number): number => {
    if (col < 0 || row < 0 || col >= cols || row >= rows) return UNCLAIMED;
    return field.owner[row * cols + col]!;
  };
  const withinReach = (col: number, row: number): boolean =>
    col >= 0 && row >= 0 && col < cols && row < rows && field.distance[row * cols + col]! <= maxPx;

  let touching = false;
  for (let i = 0; i < field.owner.length && !touching; i++) {
    touching = field.owner[i] === aIndex || field.owner[i] === bIndex;
  }
  if (!touching) return "";

  // A signed field: positive on A's side, negative on B's. Its zero crossing is
  // the median. Everything else sits on the positive side so it introduces no
  // crossing of its own.
  const signed = new Float32Array(cols * rows);
  for (let i = 0; i < signed.length; i++) {
    signed[i] = field.owner[i] === bIndex ? -1 : 1;
  }

  // Outside the grid counts as A's side rather than the usual "below
  // threshold". A band must close along the sheet edge; a median line must not,
  // or the whole border reads as an equidistance line.
  const rings = marchingSquares(signed, cols, rows, 0, 1);
  const offset = -cellSize / 2;
  let out = "";
  for (const ring of rings) {
    let open = false;
    for (const [gx, gy] of ring) {
      // A vertex is on the median only if the cells it separates are A's sea
      // and B's sea. A crossing that merely leaves a coastline is A's water
      // meeting land, which is a shoreline and already drawn as one.
      const cols2 = [Math.floor(gx), Math.ceil(gx)];
      const rows2 = [Math.floor(gy), Math.ceil(gy)];
      let sawA = false;
      let sawB = false;
      let sawLand = false;
      let reachable = false;
      for (const col of cols2) {
        for (const row of rows2) {
          const owner = ownerAt(col, row);
          if (owner === aIndex) sawA = true;
          else if (owner === bIndex) sawB = true;
          else if (owner === LAND) sawLand = true;
          if (withinReach(col, row)) reachable = true;
        }
      }
      if (!sawA || !sawB || sawLand || !reachable) {
        open = false;
        continue;
      }
      const x = Math.round((gx * cellSize + offset) * 10) / 10;
      const y = Math.round((gy * cellSize + offset) * 10) / 10;
      out += `${open ? "L" : "M"}${x},${y}`;
      open = true;
    }
  }
  return out;
}

/** Densify a projected polyline so the distance field sees an even coastline. */
export function densify(points: Point[], spacing = 5, maxJump = 4000): Point[] {
  const out: Point[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]!;
    const b = points[i + 1]!;
    if (!Number.isFinite(a[0]) || !Number.isFinite(b[0])) continue;
    const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (length > maxJump) continue;
    const steps = Math.max(1, Math.ceil(length / spacing));
    for (let step = 0; step < steps; step++) {
      out.push([a[0] + ((b[0] - a[0]) * step) / steps, a[1] + ((b[1] - a[1]) * step) / steps]);
    }
  }
  const last = points[points.length - 1];
  if (last && Number.isFinite(last[0])) out.push(last);
  return out;
}
