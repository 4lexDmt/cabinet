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
  // A non-finite sample would propagate NaN into the path and the whole ring
  // would be discarded by the renderer. Fall back to the cell midpoint instead.
  const clamped = Number.isFinite(t) ? (t < 0 ? 0 : t > 1 ? 1 : t) : 0.5;
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
  /**
   * Value assumed outside the grid. Must be finite and below `threshold`, so a
   * band running off the sheet closes along the border rather than dividing by
   * infinity. Using -Infinity here was a real bug: it turns the interpolation
   * into Infinity/Infinity and every vertex on the border comes out NaN.
   */
  outside = threshold - 1,
): Ring[] {
  const at = (x: number, y: number): number => {
    if (x < 0 || y < 0 || x >= width || y >= height) return outside;
    const value = values[y * width + x];
    return value === undefined || !Number.isFinite(value) ? outside : value;
  };

  // A crossing is identified by the GRID EDGE it sits on, not by its
  // coordinates. Two adjacent cells share an edge, so an edge identity makes
  // the join between their segments exact — where matching interpolated
  // coordinates is ambiguous at a saddle, and leaves contours broken into
  // pieces that then get closed with a chord straight across the sheet.
  //
  // Each edge carries at most one crossing and is shared by exactly two cells,
  // one of which contributes it as an exit and the other as an entry. Every
  // crossing therefore has exactly one successor, so every contour closes.
  const vertex = new Map<number, [number, number]>();
  const horizontal = (x: number, y: number, a: number, b: number): number => {
    const id = ((y + 1) * (width + 2) + (x + 1)) * 2;
    if (!vertex.has(id)) vertex.set(id, interpolate(x, y, a, x + 1, y, b, threshold));
    return id;
  };
  const vertical = (x: number, y: number, a: number, b: number): number => {
    const id = ((y + 1) * (width + 2) + (x + 1)) * 2 + 1;
    if (!vertex.has(id)) vertex.set(id, interpolate(x, y, a, x, y + 1, b, threshold));
    return id;
  };

  const successor = new Map<number, number[]>();
  const link = (a: number, b: number) => {
    const bucket = successor.get(a);
    if (bucket) bucket.push(b);
    else successor.set(a, [b]);
  };

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

      // Edges are always interpolated in a canonical direction — horizontals
      // left to right, verticals top to bottom — so both cells sharing an edge
      // compute the identical vertex.
      const top = () => horizontal(x, y, tl, tr);
      const bottom = () => horizontal(x, y + 1, bl, br);
      const left = () => vertical(x, y, tl, bl);
      const right = () => vertical(x + 1, y, tr, br);

      // Segments are wound so the inside stays on the left, which keeps ring
      // orientation consistent and lets the SVG even-odd rule cut holes.
      switch (index) {
        case 1: link(left(), bottom()); break;
        case 2: link(bottom(), right()); break;
        case 3: link(left(), right()); break;
        case 4: link(right(), top()); break;
        // Both saddle segments cut off an OUTSIDE corner here (tl and br), so
        // both run with the cell's interior on the same hand as every other
        // case. Emitting the second one as bottom→right — the orientation case
        // 2 uses, where br is inside — reverses it, and that single flipped
        // segment leaves one crossing with two successors and another with
        // none. The contour through it cannot then be closed.
        case 5:
          link(left(), top());
          link(right(), bottom());
          break;
        case 6: link(bottom(), top()); break;
        case 7: link(left(), top()); break;
        case 8: link(top(), left()); break;
        case 9: link(top(), bottom()); break;
        case 10:
          link(top(), right());
          link(bottom(), left());
          break;
        case 11: link(top(), right()); break;
        case 12: link(right(), left()); break;
        case 13: link(right(), bottom()); break;
        case 14: link(bottom(), left()); break;
      }
    }
  }

  return stitch(vertex, successor);
}

/**
 * Follow each crossing to its successor until the contour returns to where it
 * started. Because the links are keyed by grid edge, a contour cannot break
 * part-way and be closed later with a chord across the sheet.
 */
function stitch(vertex: Map<number, [number, number]>, successor: Map<number, number[]>): Ring[] {
  const walked = new Set<number>();
  const rings: Ring[] = [];

  for (const start of successor.keys()) {
    if (walked.has(start)) continue;
    const ring: Ring = [];
    let cursor: number | undefined = start;
    while (cursor !== undefined && !walked.has(cursor)) {
      walked.add(cursor);
      const point = vertex.get(cursor);
      if (!point) break;
      ring.push(point);
      // A saddle contributes two crossings to one cell, so an edge can hold
      // more than one candidate; take the first not yet walked.
      cursor = successor.get(cursor)?.find((next) => !walked.has(next) || next === start);
      if (cursor === start) break;
    }
    if (ring.length >= 3 && ring.every((p) => Number.isFinite(p[0]) && Number.isFinite(p[1]))) {
      rings.push(ring);
    }
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
