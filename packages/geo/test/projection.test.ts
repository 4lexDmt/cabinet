/**
 * Projection properties.
 *
 * Round-tripping and containment, checked as properties rather than against
 * golden numbers, because the point is that the functions are inverses — not
 * that they happen to agree with a table someone typed once.
 */

import { describe, expect, it } from "vitest";
import {
  bboxContains,
  compactMercator,
  COMPACT_CUT_DEG,
  conicConformal,
  equirectangular,
  fitBounds,
  groundScaleAt,
  kmPerPixel,
  mercator,
  project,
  projectionFor,
  projectionSuitsBbox,
  recommendProjection,
  unproject,
  viewportBounds,
  type BBox,
  type LonLat,
  type Projection,
} from "../src/index.ts";

const SAMPLES: LonLat[] = [
  [0, 0],
  [21.01, 52.23],
  [-74.0, 40.71],
  [139.69, 35.68],
  [-58.38, -34.6],
  [31.24, 30.04],
  [74.35, 34.05],
  [18.07, 59.33],
  [-0.13, 51.51],
  [172.6, -43.53],
  [15.6, 78.22],
  [-42.0, 72.0],
  [58.0, 81.0],
  [-85.0, 75.0],
  [96.0, 79.5],
];

const PROJECTIONS: Array<[string, Projection]> = [
  ["equirectangular", equirectangular()],
  ["equirectangular at 45°", equirectangular(45)],
  ["mercator", mercator()],
  ["mercator compact", compactMercator()],
  ["conic conformal 30/60", conicConformal([30, 60], 15)],
  ["conic conformal 54/69", conicConformal([54, 69], 20)],
  ["conic conformal tangent", conicConformal([45, 45], 0)],
];

describe("projections invert", () => {
  for (const [label, projection] of PROJECTIONS) {
    it(`${label}: forward then inverse returns the input`, () => {
      for (const sample of SAMPLES) {
        const [lon, lat] = projection.inverse(projection.forward(sample));
        expect(lon, `${label} lon of ${sample}`).toBeCloseTo(sample[0], 6);
        expect(lat, `${label} lat of ${sample}`).toBeCloseTo(sample[1], 6);
      }
    });

    it(`${label}: declares itself for the title block`, () => {
      expect(projection.declaration.length).toBeGreaterThan(8);
    });
  }
});

describe("viewports", () => {
  const frames: Array<[string, BBox]> = [
    ["Baltic approaches", [3, 52, 37, 67]],
    ["Suez", [31.65, 27.35, 35.95, 31.9]],
    ["Kashmir", [72.4, 31.6, 80.6, 37.4]],
    ["world", [-180, -85, 180, 85]],
  ];

  for (const [label, bbox] of frames) {
    for (const [pLabel, projection] of PROJECTIONS) {
      const suits = projectionSuitsBbox(projection, bbox);
      it(`${label} on ${pLabel}: ${suits ? "fitBounds contains the requested extent" : "is refused as unsuitable"}`, () => {
        if (!suits) {
          expect(bbox[2] - bbox[0]).toBeGreaterThan(projection.maxLongitudeSpan);
          return;
        }
        const viewport = fitBounds(projection, bbox, 960, 640, { padding: 24 });
        expect(bboxContains(viewportBounds(viewport), bbox, 1e-3)).toBe(true);
      });
    }

    it(`${label}: project then unproject returns the input`, () => {
      const viewport = fitBounds(equirectangular(), bbox, 900, 600, { padding: 16 });
      const inside: LonLat = [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2];
      const [lon, lat] = unproject(viewport, project(viewport, inside));
      expect(lon).toBeCloseTo(inside[0], 6);
      expect(lat).toBeCloseTo(inside[1], 6);
    });
  }

  it("centres the fitted extent in the frame", () => {
    const bbox: BBox = [3, 52, 37, 67];
    const viewport = fitBounds(equirectangular(), bbox, 800, 600, { padding: 0 });
    const centre = project(viewport, viewport.center);
    expect(centre[0]).toBeCloseTo(400, 6);
    expect(centre[1]).toBeCloseTo(300, 6);
  });

  it("reports a plausible ground scale", () => {
    const viewport = fitBounds(conicConformal([54, 69], 20), [3, 52, 37, 67], 960, 640, {
      padding: 26,
    });
    const km = kmPerPixel(viewport);
    expect(km).toBeGreaterThan(0.5);
    expect(km).toBeLessThan(20);
    expect(viewport.zoom).toBeGreaterThan(2);
    expect(viewport.zoom).toBeLessThan(9);
  });

  it("a tighter frame is a higher zoom", () => {
    const wide = fitBounds(mercator(), [-20, 30, 60, 70], 800, 600);
    const tight = fitBounds(mercator(), [20, 53, 25, 56], 800, 600);
    expect(tight.zoom).toBeGreaterThan(wide.zoom);
  });

  it("honours zoom clamps", () => {
    const viewport = fitBounds(mercator(), [20, 53, 20.4, 53.3], 800, 600, { maxZoom: 8 });
    expect(viewport.zoom).toBeLessThanOrEqual(8);
  });

  it("builds projections by kind", () => {
    expect(projectionFor("mercator").kind).toBe("mercator");
    expect(projectionFor("mercator_compact").kind).toBe("mercator_compact");
    expect(projectionFor("equirectangular").kind).toBe("equirectangular");
    expect(projectionFor("conic_conformal", { parallels: [54, 69], lon0: 20 }).kind).toBe(
      "conic_conformal",
    );
  });
});

describe("choosing a projection", () => {
  it("gives a mid-latitude regional theatre a conic", () => {
    expect(recommendProjection([3, 52, 37, 67]).kind).toBe("conic_conformal");
    expect(recommendProjection([17.4, 52.4, 27.6, 57.4]).kind).toBe("conic_conformal");
  });

  it("refuses a conic for a world frame, where the cone would lap itself", () => {
    expect(recommendProjection([-180, -85, 180, 85]).kind).toBe("equirectangular");
    expect(projectionSuitsBbox(conicConformal([30, 60], 0), [-180, -85, 180, 85])).toBe(false);
  });

  it("refuses a conic near the equator, where it has no advantage", () => {
    expect(recommendProjection([31.65, 27.35, 35.95, 31.9]).kind).toBe("conic_conformal");
    expect(recommendProjection([95, 5, 115, 25]).kind).toBe("equirectangular");
  });

  it("always recommends something that fits", () => {
    const frames: BBox[] = [
      [-180, -85, 180, 85],
      [3, 52, 37, 67],
      [72.4, 31.6, 80.6, 37.4],
      [-80, -60, -40, -30],
      [100, -12, 145, 12],
    ];
    for (const bbox of frames) {
      const projection = recommendProjection(bbox);
      expect(projectionSuitsBbox(projection, bbox), `${bbox}`).toBe(true);
      const viewport = fitBounds(projection, bbox, 960, 640, { padding: 20 });
      expect(bboxContains(viewportBounds(viewport), bbox, 1e-3), `${bbox}`).toBe(true);
    }
  });
});

describe("compact Mercator", () => {
  const plain = mercator();
  const compact = compactMercator();

  function height(projection: Projection, south: number, north: number): number {
    return projection.forward([0, north])[1]! - projection.forward([0, south])[1]!;
  }

  function planeDistance(projection: Projection, a: LonLat, b: LonLat): number {
    const [ax, ay] = projection.forward(a);
    const [bx, by] = projection.forward(b);
    return Math.hypot(bx - ax, by - ay);
  }

  it("is identical to Mercator through the inhabited latitudes", () => {
    for (const lat of [0, 30, 45, 55, COMPACT_CUT_DEG, -20, -55]) {
      const [cx, cy] = compact.forward([10, lat]);
      const [mx, my] = plain.forward([10, lat]);
      expect(cx, `x at ${lat}`).toBeCloseTo(mx, 12);
      expect(cy, `y at ${lat}`).toBeCloseTo(my, 12);
    }
  });

  it("joins the fold without a kink", () => {
    const y = (lat: number) => compact.forward([0, lat])[1]!;
    const left = (y(COMPACT_CUT_DEG) - y(COMPACT_CUT_DEG - 0.1)) / 0.1;
    const right = (y(COMPACT_CUT_DEG + 0.1) - y(COMPACT_CUT_DEG)) / 0.1;
    expect(right).toBeCloseTo(left, 3);
  });

  it("shortens Greenland and the Canadian archipelago without touching France", () => {
    expect(height(compact, 42.5, 51.1)).toBeCloseTo(height(plain, 42.5, 51.1), 12);
    // Kap Farvel to Cape Morris Jesup. Half the Mercator tower is the point;
    // flattening it to a pancake would be a different lie.
    expect(height(compact, 59.8, 83.6)).toBeLessThan(height(plain, 59.8, 83.6) * 0.55);
    expect(height(compact, 59.8, 83.6)).toBeGreaterThan(height(plain, 59.8, 83.6) * 0.35);
    // Ellesmere's north coast vs the mainland at 60°N.
    expect(height(compact, 60, 83)).toBeLessThan(height(plain, 60, 83) * 0.55);
  });

  it("brings Svalbard and the Russian Arctic islands back toward the mainland", () => {
    // Compared due south of each archipelago, so the unchanged longitude
    // does not mask the fold. These are the gaps Mercator had blown up.
    const svalbard: LonLat = [16.0, 78.2];
    const finnmark: LonLat = [16.0, 71.0];
    const franzJosef: LonLat = [58.0, 81.0];
    const pechora: LonLat = [58.0, 68.5];
    const severnaya: LonLat = [96.0, 79.5];
    const taymyr: LonLat = [96.0, 77.0];
    expect(planeDistance(compact, svalbard, finnmark)).toBeLessThan(
      planeDistance(plain, svalbard, finnmark) * 0.5,
    );
    expect(planeDistance(compact, franzJosef, pechora)).toBeLessThan(
      planeDistance(plain, franzJosef, pechora) * 0.5,
    );
    expect(planeDistance(compact, severnaya, taymyr)).toBeLessThan(
      planeDistance(plain, severnaya, taymyr) * 0.55,
    );
  });

  it("declares the fold for the title block", () => {
    expect(compact.declaration).toMatch(/COMPACT/);
    expect(compact.declaration).toMatch(/60/);
  });

  it("reports Mercator's own ground scale below the cut, and a larger one above it", () => {
    expect(groundScaleAt(plain, 0)).toBeCloseTo(1, 5);
    expect(groundScaleAt(plain, 60)).toBeCloseTo(0.5, 3);
    expect(groundScaleAt(compact, 45)).toBeCloseTo(groundScaleAt(plain, 45), 8);
    expect(groundScaleAt(compact, 60)).toBeCloseTo(groundScaleAt(plain, 60), 3);
    // Folded latitude is less stretched than Mercator at the same parallel, so
    // a plane unit covers more ground.
    expect(groundScaleAt(compact, 78)).toBeGreaterThan(groundScaleAt(plain, 78) * 1.5);
  });
});
