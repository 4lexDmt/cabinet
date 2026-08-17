/**
 * GeoJSON to SVG path, through a projector.
 *
 * Pure and dependency-free: the projector is any `(lonLat) => [x, y]`, so the
 * same code serves a conic theatre sheet, a Mercator inset and a unit test.
 */

import type { BBox, LonLat, Point } from "./types.ts";

export type Projector = (lonLat: LonLat) => Point;

interface Geometry {
  type: string;
  coordinates?: unknown;
  geometries?: Geometry[];
}

function fmt(value: number): string {
  // Two decimals is well under a pixel and keeps DOM payloads small.
  const rounded = Math.round(value * 100) / 100;
  return Object.is(rounded, -0) ? "0" : String(rounded);
}

function ringPath(ring: LonLat[], project: Projector, close: boolean): string {
  let out = "";
  let started = false;
  let lastX = NaN;
  let lastY = NaN;
  for (const position of ring) {
    const [x, y] = project(position);
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    // Drop points that land on the same device pixel as the previous one.
    if (started && Math.abs(x - lastX) < 0.05 && Math.abs(y - lastY) < 0.05) continue;
    out += `${started ? "L" : "M"}${fmt(x)},${fmt(y)}`;
    started = true;
    lastX = x;
    lastY = y;
  }
  if (!started) return "";
  return close ? `${out}Z` : out;
}

export function geometryPath(geometry: Geometry | null | undefined, project: Projector): string {
  if (!geometry) return "";
  const coords = geometry.coordinates as never;
  switch (geometry.type) {
    case "Point": {
      const [x, y] = project(coords as unknown as LonLat);
      return Number.isFinite(x) ? `M${fmt(x)},${fmt(y)}` : "";
    }
    case "LineString":
      return ringPath(coords as unknown as LonLat[], project, false);
    case "MultiLineString":
      return (coords as unknown as LonLat[][]).map((l) => ringPath(l, project, false)).join("");
    case "Polygon":
      return (coords as unknown as LonLat[][]).map((r) => ringPath(r, project, true)).join("");
    case "MultiPolygon":
      return (coords as unknown as LonLat[][][])
        .map((polygon) => polygon.map((r) => ringPath(r, project, true)).join(""))
        .join("");
    case "GeometryCollection":
      return (geometry.geometries ?? []).map((g) => geometryPath(g, project)).join("");
    default:
      return "";
  }
}

/** Cull before projecting. Cheap, and most features are off the sheet. */
export function bboxIntersects(a: BBox, b: BBox): boolean {
  return !(a[2] < b[0] || a[0] > b[2] || a[3] < b[1] || a[1] > b[3]);
}

export function geometryBbox(geometry: Geometry | null | undefined): BBox | null {
  if (!geometry) return null;
  let w = Infinity;
  let s = Infinity;
  let e = -Infinity;
  let n = -Infinity;
  const visit = (node: unknown): void => {
    if (!Array.isArray(node)) return;
    if (typeof node[0] === "number" && typeof node[1] === "number") {
      const [lon, lat] = node as [number, number];
      if (lon < w) w = lon;
      if (lon > e) e = lon;
      if (lat < s) s = lat;
      if (lat > n) n = lat;
      return;
    }
    for (const child of node) visit(child);
  };
  if (geometry.type === "GeometryCollection") {
    for (const part of geometry.geometries ?? []) {
      const box = geometryBbox(part);
      if (!box) continue;
      if (box[0] < w) w = box[0];
      if (box[1] < s) s = box[1];
      if (box[2] > e) e = box[2];
      if (box[3] > n) n = box[3];
    }
  } else {
    visit(geometry.coordinates);
  }
  return Number.isFinite(w) ? [w, s, e, n] : null;
}

/** Widen a bbox by a margin in degrees, so a stroke near the edge still draws. */
export function padBbox(bbox: BBox, margin: number): BBox {
  return [bbox[0] - margin, bbox[1] - margin, bbox[2] + margin, bbox[3] + margin];
}
