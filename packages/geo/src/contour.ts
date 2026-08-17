/**
 * Marching squares.
 *
 * Used to turn a scalar field into closed rings — specifically, to turn a
 * distance-from-coastline field into maritime zone bands. Written here rather
 * than pulled from a plotting library because it must be deterministic and
 * dependency-free: two players looking at the same theatre must see the same
 * line, down to the vertex.
 */

export type Ring = Array<[number, number]>;

interface Segment {
  a: [number, number];
  b: [number, number];
}

function interpolate(
  x0: number,
  y0: number,
  v0: number,
  x1: number,
  y1: number,
  v1: number,
  threshold: number,
): [number, number] {
  const denominator = v1 - v0;
  const t = denominator === 0 ? 0.5 : (threshold - v0) / denominator;
  const clamped = t < 0 ? 0 : t > 1 ? 1 : t;
  return [x0 + (x1 - x0) * clamped, y0 + (y1 - y0) * clamped];
}

/**
 * Rings enclosing the region where `values >= threshold`.
 *
 * Rings are returned in grid coordinates; scale them to pixels at the call
 * site. Open ends at the grid border are closed along the border so a band that
 * runs off the sheet still fills.
 */
export function marchingSquares(
  values: Float32Array | number[],
  width: number,
  height: number,
  threshold = 0.5,
): Ring[] {
  const at = (x: number, y: number): number => {
    if (x < 0 || y < 0 || x >= width || y >= height) return -Infinity;
    return values[y * width + x] ?? -Infinity;
  };

  const segments: Segment[] = [];
  for (let y = -1; y < height; y++) {
    for (let x = -1; x < width; x++) {
      const tl = at(x, y);
      const tr = at(x + 1, y);
      const br = at(x + 1, y + 1);
      const bl = at(x, y + 1);
      let index = 0;
      if (tl >= threshold) index |= 8;
      if (tr >= threshold) index |= 4;
      if (br >= threshold) index |= 2;
      if (bl >= threshold) index |= 1;
      if (index === 0 || index === 15) continue;

      const top = () => interpolate(x, y, tl, x + 1, y, tr, threshold);
      const right = () => interpolate(x + 1, y, tr, x + 1, y + 1, br, threshold);
      const bottom = () => interpolate(x + 1, y + 1, br, x, y + 1, bl, threshold);
      const left = () => interpolate(x, y + 1, bl, x, y, tl, threshold);

      // Segments are wound so the inside stays on the left, which keeps ring
      // orientation consistent and lets the SVG even-odd rule cut holes.
      switch (index) {
        case 1: segments.push({ a: left(), b: bottom() }); break;
        case 2: segments.push({ a: bottom(), b: right() }); break;
        case 3: segments.push({ a: left(), b: right() }); break;
        case 4: segments.push({ a: right(), b: top() }); break;
        case 5:
          segments.push({ a: left(), b: top() });
          segments.push({ a: bottom(), b: right() });
          break;
        case 6: segments.push({ a: bottom(), b: top() }); break;
        case 7: segments.push({ a: left(), b: top() }); break;
        case 8: segments.push({ a: top(), b: left() }); break;
        case 9: segments.push({ a: top(), b: bottom() }); break;
        case 10:
          segments.push({ a: top(), b: right() });
          segments.push({ a: bottom(), b: left() });
          break;
        case 11: segments.push({ a: top(), b: right() }); break;
        case 12: segments.push({ a: right(), b: left() }); break;
        case 13: segments.push({ a: right(), b: bottom() }); break;
        case 14: segments.push({ a: bottom(), b: left() }); break;
      }
    }
  }

  return stitch(segments);
}

const KEY_PRECISION = 1e4;

function key(point: [number, number]): string {
  return `${Math.round(point[0] * KEY_PRECISION)},${Math.round(point[1] * KEY_PRECISION)}`;
}

/** Join segments end to end into rings. Unclosed chains are closed directly. */
function stitch(segments: Segment[]): Ring[] {
  const heads = new Map<string, Segment[]>();
  for (const segment of segments) {
    const k = key(segment.a);
    const bucket = heads.get(k);
    if (bucket) bucket.push(segment);
    else heads.set(k, [segment]);
  }

  const used = new Set<Segment>();
  const rings: Ring[] = [];

  for (const segment of segments) {
    if (used.has(segment)) continue;
    const ring: Ring = [segment.a, segment.b];
    used.add(segment);
    let cursor = segment.b;
    for (let guard = 0; guard < segments.length + 4; guard++) {
      const candidates = heads.get(key(cursor));
      const next = candidates?.find((c) => !used.has(c));
      if (!next) break;
      used.add(next);
      ring.push(next.b);
      cursor = next.b;
      if (key(cursor) === key(segment.a)) break;
    }
    if (ring.length >= 4) rings.push(ring);
  }
  return rings;
}

/** Rings in grid space to an SVG path in pixel space. */
export function ringsToPath(rings: Ring[], cellSize: number, offset: [number, number] = [0, 0]): string {
  let out = "";
  for (const ring of rings) {
    if (ring.length < 3) continue;
    for (let i = 0; i < ring.length; i++) {
      const x = Math.round((ring[i]![0] * cellSize + offset[0]) * 10) / 10;
      const y = Math.round((ring[i]![1] * cellSize + offset[1]) * 10) / 10;
      out += `${i === 0 ? "M" : "L"}${x},${y}`;
    }
    out += "Z";
  }
  return out;
}
