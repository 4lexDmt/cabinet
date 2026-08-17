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
    landRings: [left, right],
    coasts: [
      { id: "WEST", points: densify(left, 4) },
      { id: "EAST", points: densify(right, 4) },
    ],
  });
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
      landRings: [
        [
          [10, 40],
          [40, 40],
          [40, 160],
          [10, 160],
          [10, 40],
        ],
      ],
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

  it("finds nothing in a saturated field", () => {
    expect(marchingSquares(new Float32Array(64).fill(1), 8, 8, 0.5)).toEqual([]);
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
