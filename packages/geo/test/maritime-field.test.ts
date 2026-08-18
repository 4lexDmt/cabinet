/**
 * Computed zones, checked for the property that matters: they cannot overlap.
 *
 * This is guard 2 again, one level down. `maritime.test.ts` proves the ladder
 * is disjoint as an interval arithmetic. This proves the raster that renders it
 * is disjoint too — every cell of sea belongs to exactly one band, because
 * every cell has exactly one distance.
 */

import { describe, expect, it } from "vitest";
import {
  CANNON_SHOT_ERA,
  LAND,
  UNCLAIMED,
  UNCLOS_ERA,
  buildMaritimeField,
  densify,
  marchingSquares,
  medianLinePath,
  zoneBandPath,
  zoneLadderPaths,
  zoneLimitPath,
  type Point,
} from "../src/index.ts";

/** Two square islands facing each other across a channel. */
function twoIslands() {
  const left: Point[] = [
    [40, 60],
    [140, 60],
    [140, 240],
    [40, 240],
    [40, 60],
  ];
  const right: Point[] = [
    [360, 60],
    [460, 60],
    [460, 240],
    [360, 240],
    [360, 60],
  ];
  return buildMaritimeField({
    width: 500,
    height: 300,
    cellSize: 4,
    landPolygons: [[left], [right]],
    coasts: [
      { id: "WEST", points: densify(left, 4) },
      { id: "EAST", points: densify(right, 4) },
    ],
  });
}

/** A square, as one polygon's single ring. */
function square(x0: number, y0: number, x1: number, y1: number): Point[] {
  return [
    [x0, y0],
    [x1, y0],
    [x1, y1],
    [x0, y1],
    [x0, y0],
  ];
}

describe("the distance field", () => {
  const field = twoIslands();

  it("marks land as land, and never as anybody's sea", () => {
    const insideWest = field.owner[Math.floor(150 / 4) * field.cols + Math.floor(90 / 4)];
    expect(insideWest).toBe(LAND);
  });

  it("assigns every sea cell to exactly one state", () => {
    let assigned = 0;
    for (let i = 0; i < field.owner.length; i++) {
      const owner = field.owner[i]!;
      if (owner === LAND) continue;
      expect(owner).not.toBe(UNCLAIMED);
      assigned++;
    }
    expect(assigned).toBeGreaterThan(1000);
  });

  it("splits the channel down the middle, which is what equidistance means", () => {
    const row = Math.floor(150 / 4);
    const nearWest = field.owner[row * field.cols + Math.floor(180 / 4)];
    const nearEast = field.owner[row * field.cols + Math.floor(330 / 4)];
    expect(field.ids[nearWest!]).toBe("WEST");
    expect(field.ids[nearEast!]).toBe("EAST");
  });

  it("has no cell in two bands at once", () => {
    const bands = [
      [0, 20],
      [20, 40],
      [40, 200],
    ];
    for (let i = 0; i < field.owner.length; i++) {
      if (field.owner[i] === LAND) continue;
      const distance = field.distance[i]!;
      const claims = bands.filter(([inner, outer]) => distance > inner! && distance <= outer!);
      expect(claims.length).toBeLessThanOrEqual(1);
    }
  });
});

describe("zone bands", () => {
  const field = twoIslands();

  it("draw a ring of sea around a coast", () => {
    const path = zoneBandPath(field, 0, 0, 24);
    expect(path.startsWith("M")).toBe(true);
    expect(path.length).toBeGreaterThan(80);
  });

  it("produce the whole modern ladder", () => {
    const paths = zoneLadderPaths(field, 0, 0.9, UNCLOS_ERA);
    expect(paths.map((p) => p.band.zone)).toEqual(["territorial", "contiguous", "eez"]);
    for (const entry of paths) expect(entry.path.length).toBeGreaterThan(0);
  });

  it("produce only a territorial sea before UNCLOS", () => {
    const paths = zoneLadderPaths(field, 0, 3, CANNON_SHOT_ERA);
    expect(paths.map((p) => p.band.zone)).toEqual(["territorial"]);
  });

  it("never claim land as sea", () => {
    const path = zoneBandPath(field, 0, 0, 12);
    // The band hugs the island but the island itself is excluded from the mask,
    // so the ring must be a loop rather than a filled square.
    expect(path.split("Z").length).toBeGreaterThan(1);
  });

  it("emit no NaN, at any radius, on any sheet edge", () => {
    for (const outer of [8, 24, 60, 140, 400, 900]) {
      for (const stateIndex of [0, 1]) {
        expect(zoneBandPath(field, stateIndex, 0, outer)).not.toMatch(/NaN|Infinity/);
        expect(zoneLadderPaths(field, stateIndex, outer / 200, UNCLOS_ERA).map((p) => p.path).join("")).not.toMatch(
          /NaN|Infinity/,
        );
      }
      expect(medianLinePath(field, 0, 1, outer)).not.toMatch(/NaN|Infinity/);
    }
  });
});

describe("the land mask", () => {
  const landAt = (field: ReturnType<typeof twoIslands>, x: number, y: number) =>
    field.owner[Math.floor(y / field.cellSize) * field.cols + Math.floor(x / field.cellSize)];

  it("keeps land where two polygons overlap", () => {
    // Neighbours share a border, so their edges are duplicated. Filling every
    // ring in one even-odd pass cancels the overlap into phantom sea, and
    // along a geometric border that sliver is straight and hundreds of miles
    // long — a twelve mile limit then draws it across the middle of a desert.
    const field = buildMaritimeField({
      width: 400,
      height: 200,
      cellSize: 4,
      landPolygons: [[square(40, 40, 200, 160)], [square(120, 40, 280, 160)]],
      coasts: [{ id: "A", points: densify(square(40, 40, 280, 160), 4) }],
    });
    expect(landAt(field, 160, 100)).toBe(LAND);
    expect(landAt(field, 60, 100)).toBe(LAND);
    expect(landAt(field, 260, 100)).toBe(LAND);
  });

  it("does not fill the sea between two separate polygons", () => {
    // The other half of the same bug: crossings from unrelated polygons sorted
    // into one list get paired against each other, so a scanline leaving one
    // island and entering another fills the channel between them as land.
    const field = buildMaritimeField({
      width: 500,
      height: 200,
      cellSize: 4,
      landPolygons: [[square(40, 60, 140, 140)], [square(360, 60, 460, 140)]],
      coasts: [
        { id: "WEST", points: densify(square(40, 60, 140, 140), 4) },
        { id: "EAST", points: densify(square(360, 60, 460, 140), 4) },
      ],
    });
    expect(landAt(field, 90, 100)).toBe(LAND);
    expect(landAt(field, 400, 100)).toBe(LAND);
    expect(landAt(field, 250, 100)).not.toBe(LAND);
  });

  it("still cuts a lake out of the polygon that contains it", () => {
    const field = buildMaritimeField({
      width: 300,
      height: 300,
      cellSize: 4,
      landPolygons: [[square(40, 40, 260, 260), square(120, 120, 180, 180)]],
      coasts: [{ id: "A", points: densify(square(40, 40, 260, 260), 4) }],
    });
    expect(landAt(field, 60, 150)).toBe(LAND);
    expect(landAt(field, 150, 150)).not.toBe(LAND);
  });
});

describe("zone limit lines", () => {
  const field = twoIslands();

  /** Every vertex's distance to the nearest point of the west island's edge. */
  function distancesFromWestCoast(path: string): number[] {
    const points = [...path.matchAll(/[ML](-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)].map(
      (m) => [Number(m[1]), Number(m[2])] as Point,
    );
    // The west island spans x 40..140, y 60..240.
    return points
      .filter(([x, y]) => x < 250 && y > 20 && y < 280)
      .map(([x, y]) => {
        const dx = x < 40 ? 40 - x : x > 140 ? x - 140 : 0;
        const dy = y < 60 ? 60 - y : y > 240 ? y - 240 : 0;
        return Math.hypot(dx, dy);
      });
  }

  // The west island sits 40px from the left edge and 60px from the top and
  // bottom, so radii are kept under 40: past that the envelope is clipped to
  // the sheet and runs along the border, which is correct but not measurable.
  it("puts the limit at the requested distance from the coast", () => {
    for (const radius of [8, 12, 24, 36]) {
      const distances = distancesFromWestCoast(zoneLimitPath(field, radius));
      expect(distances.length).toBeGreaterThan(8);
      const mean = distances.reduce((a, b) => a + b, 0) / distances.length;
      // Within one grid cell of the requested radius: the isoline is
      // interpolated between samples, so it is not snapped to cell centres.
      expect(Math.abs(mean - radius), `radius ${radius} · mean ${mean}`).toBeLessThan(field.cellSize);
    }
  });

  it("still draws a limit thinner than a single grid cell", () => {
    // The mobile regression: a 12-mile territorial sea on a narrow viewport is
    // a fraction of a pixel wide. A band mask has no cell centre inside it and
    // renders nothing at all; an isoline is interpolated and survives.
    const radius = field.cellSize / 8;
    expect(zoneBandPath(field, 0, 0, radius)).toBe("");
    const limit = zoneLimitPath(field, radius);
    expect(limit.startsWith("M")).toBe(true);
    expect(limit).not.toMatch(/NaN|Infinity/);
  });

  it("scales the limit per row when the projection stretches with latitude", () => {
    // Halving the ground scale doubles the pixel distance the same limit
    // reaches, which is what a conformal projection does away from its
    // standard parallel.
    const plain = distancesFromWestCoast(zoneLimitPath(field, 16));
    const stretched = distancesFromWestCoast(zoneLimitPath(field, 16, () => 0.5));
    const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
    expect(mean(stretched)).toBeGreaterThan(mean(plain) * 1.7);
  });

  it("emits no NaN at any radius, including past the sheet edge", () => {
    for (const radius of [0.5, 8, 24, 140, 400, 900]) {
      expect(zoneLimitPath(field, radius)).not.toMatch(/NaN|Infinity/);
    }
  });
});

describe("median lines", () => {
  const field = twoIslands();

  it("appear where two zones meet", () => {
    const path = medianLinePath(field, 0, 1, 200);
    expect(path.length).toBeGreaterThan(0);
    const xs = [...path.matchAll(/[ML](-?\d+(?:\.\d+)?),/g)].map((m) => Number(m[1]));
    const mid = xs.reduce((a, b) => a + b, 0) / xs.length;
    // The islands' facing coasts are at x=140 and x=360; the median is at 250.
    expect(mid).toBeGreaterThan(215);
    expect(mid).toBeLessThan(285);
  });

  it("are absent where zones do not meet", () => {
    const far = buildMaritimeField({
      width: 400,
      height: 200,
      cellSize: 8,
      landPolygons: [[square(10, 40, 40, 160)]],
      coasts: [
        {
          id: "ONLY",
          points: densify(
            [
              [40, 40],
              [40, 160],
            ],
            4,
          ),
        },
      ],
    });
    expect(medianLinePath(far, 0, 1, 30)).toBe("");
  });
});

describe("marching squares", () => {
  it("finds a ring around a filled square", () => {
    const width = 12;
    const height = 12;
    const values = new Float32Array(width * height);
    for (let y = 3; y < 9; y++) for (let x = 3; x < 9; x++) values[y * width + x] = 1;
    const rings = marchingSquares(values, width, height, 0.5);
    expect(rings).toHaveLength(1);
    expect(rings[0]!.length).toBeGreaterThan(8);
  });

  it("finds nothing in an empty field", () => {
    expect(marchingSquares(new Float32Array(64), 8, 8, 0.5)).toEqual([]);
  });

  it("closes a saturated field along the sheet edge", () => {
    // A band covering the whole frame must still be a ring, or it renders as
    // nothing at all — the failure mode is silent and total.
    const rings = marchingSquares(new Float32Array(64).fill(1), 8, 8, 0.5);
    expect(rings).toHaveLength(1);
    expect(rings[0]!.every(([x, y]) => Number.isFinite(x) && Number.isFinite(y))).toBe(true);
  });

  it("does not close along the edge when told the outside is inside", () => {
    const values = new Float32Array(64).fill(1);
    expect(marchingSquares(values, 8, 8, 0.5, 1)).toEqual([]);
  });

  it("closes a region that runs off the grid without producing NaN", () => {
    // Regression: treating outside-the-grid as -Infinity turns the edge
    // interpolation into Infinity/Infinity, and every border vertex comes out
    // NaN. The browser then rejects the whole path and the band vanishes.
    const width = 10;
    const height = 10;
    const values = new Float32Array(width * height).fill(1);
    for (let y = 0; y < height; y++) values[y * width + width - 1] = 0;
    const rings = marchingSquares(values, width, height, 0.5);
    expect(rings.length).toBeGreaterThan(0);
    for (const ring of rings) {
      for (const [x, y] of ring) {
        expect(Number.isFinite(x)).toBe(true);
        expect(Number.isFinite(y)).toBe(true);
      }
    }
  });

  it("closes every ring it returns, on a field full of saddles", () => {
    // The failure this guards is loud and specific. A contour that comes back
    // as an open chain gets closed by whoever draws it, with one straight line
    // from its last vertex to its first — on a world sheet, a line from
    // Greenland to the Caribbean. It happens when a crossing has two
    // successors or none, which is what a single reversed saddle segment does.
    const width = 40;
    const height = 40;
    const values = new Float32Array(width * height);
    // A checkerboard-ish interference pattern: as many saddle cells as
    // possible, which is where the ambiguity lives.
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        values[y * width + x] = Math.sin(x * 1.1) * Math.cos(y * 0.9) + Math.sin((x + y) * 0.5) * 0.4;
      }
    }
    for (const threshold of [-0.6, -0.2, 0, 0.15, 0.5]) {
      const rings = marchingSquares(values, width, height, threshold);
      expect(rings.length).toBeGreaterThan(0);
      for (const ring of rings) {
        const first = ring[0]!;
        const last = ring[ring.length - 1]!;
        // Consecutive crossings are at most one cell apart, so a closed ring's
        // ends are adjacent. Anything more is a chord.
        const gap = Math.hypot(first[0] - last[0], first[1] - last[1]);
        expect(gap, `threshold ${threshold}, ring of ${ring.length}`).toBeLessThanOrEqual(1.5);
      }
    }
  });

  it("finds two rings for two blobs", () => {
    const width = 20;
    const values = new Float32Array(width * 10);
    for (let y = 2; y < 5; y++) {
      for (let x = 2; x < 5; x++) values[y * width + x] = 1;
      for (let x = 13; x < 17; x++) values[y * width + x] = 1;
    }
    expect(marchingSquares(values, width, 10, 0.5)).toHaveLength(2);
  });
});
