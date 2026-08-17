/**
 * Projections and viewports. Pure functions — no DOM, no side effects.
 *
 * Three projections, each earning its place:
 *
 * - `equirectangular` for theatre views. Trivial to reason about and it keeps
 *   historical scenario geometry honest: nothing is silently stretched.
 * - `mercator` for zoomed views, because that is what tiled data assumes.
 * - `conicConformal` for printed theatre sheets, which is the register the
 *   cartography is drawn in. Standard parallels are declared on the sheet.
 */

import type { BBox, LonLat, Point } from "./types.ts";

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

/** Equatorial radius, WGS84, metres. Used only to express ground resolution. */
export const EARTH_RADIUS_M = 6_378_137;
/** Ground resolution in metres per pixel at zoom 0, latitude 0, 256px tiles. */
export const RESOLUTION_Z0 = (2 * Math.PI * EARTH_RADIUS_M) / 256;

export type ProjectionKind = "equirectangular" | "mercator" | "conic_conformal";

export interface Projection {
  kind: ProjectionKind;
  /** Human-readable declaration for the sheet's title block. */
  declaration: string;
  /**
   * Widest longitude span this projection can render without folding onto
   * itself. A conic wraps its cone well before a full turn, so a world sheet on
   * a conic is not a stylistic choice — it is a broken map.
   */
  maxLongitudeSpan: number;
  /** Degrees to abstract plane units. Y increases northward. */
  forward(lonLat: LonLat): Point;
  /** Plane units back to degrees. */
  inverse(point: Point): LonLat;
}

export interface Viewport {
  width: number;
  height: number;
  center: LonLat;
  /** Slippy-map zoom equivalent, derived from ground resolution at centre. */
  zoom: number;
  /** Geographic extent actually covered, [west, south, east, north]. */
  bounds: BBox;
  projection: Projection;
  /** Plane units to pixels. */
  scale: number;
  /** Pixel offset applied after scaling. */
  translate: Point;
}

function clampLat(lat: number): number {
  return Math.max(-89.999999, Math.min(89.999999, lat));
}

export function equirectangular(standardParallel = 0): Projection {
  const k = Math.cos(standardParallel * DEG);
  return {
    kind: "equirectangular",
    declaration: `EQUIRECTANGULAR · SP ${standardParallel}°`,
    maxLongitudeSpan: 360,
    forward: ([lon, lat]) => [lon * DEG * k, lat * DEG],
    inverse: ([x, y]) => [(x / k) * RAD, y * RAD],
  };
}

export function mercator(): Projection {
  return {
    kind: "mercator",
    declaration: "WEB MERCATOR · EPSG:3857",
    maxLongitudeSpan: 360,
    forward: ([lon, lat]) => {
      const phi = clampLat(lat) * DEG;
      return [lon * DEG, Math.log(Math.tan(Math.PI / 4 + phi / 2))];
    },
    inverse: ([x, y]) => [x * RAD, (2 * Math.atan(Math.exp(y)) - Math.PI / 2) * RAD],
  };
}

/**
 * Lambert conformal conic. `parallels` are the two standard parallels where
 * scale is true; `lon0` is the central meridian. Both appear in the title block
 * because a projection that is not declared is a projection that is hiding.
 */
export function conicConformal(parallels: [number, number], lon0: number, lat0?: number): Projection {
  const [p1, p2] = parallels;
  const phi1 = p1 * DEG;
  const phi2 = p2 * DEG;
  const lambda0 = lon0 * DEG;
  const phi0 = (lat0 ?? (p1 + p2) / 2) * DEG;

  const t = (phi: number) => Math.tan(Math.PI / 4 + phi / 2);
  const n =
    Math.abs(phi1 - phi2) < 1e-10
      ? Math.sin(phi1)
      : Math.log(Math.cos(phi1) / Math.cos(phi2)) / Math.log(t(phi2) / t(phi1));
  const f = (Math.cos(phi1) * Math.pow(t(phi1), n)) / n;
  const rho0 = f / Math.pow(t(phi0), n);

  // Beyond |n·Δλ| = π the cone laps itself and the sheet folds into a fan.
  // Two thirds of that is the practical ceiling for a legible regional sheet.
  const maxLongitudeSpan = Math.min(360, ((2 * Math.PI) / Math.abs(n)) * RAD * (2 / 3));

  return {
    kind: "conic_conformal",
    declaration: `CONIC CONFORMAL · SP ${p1}°/${p2}° · CM ${lon0}°`,
    maxLongitudeSpan,
    forward: ([lon, lat]) => {
      const phi = clampLat(lat) * DEG;
      const rho = f / Math.pow(t(phi), n);
      let dLambda = lon * DEG - lambda0;
      while (dLambda > Math.PI) dLambda -= 2 * Math.PI;
      while (dLambda < -Math.PI) dLambda += 2 * Math.PI;
      const theta = n * dLambda;
      return [rho * Math.sin(theta), rho0 - rho * Math.cos(theta)];
    },
    inverse: ([x, y]) => {
      const dy = rho0 - y;
      const sign = n < 0 ? -1 : 1;
      const rho = sign * Math.hypot(x, dy);
      const theta = Math.atan2(sign * x, sign * dy);
      const phi = 2 * Math.atan(Math.pow(f / rho, 1 / n)) - Math.PI / 2;
      return [(lambda0 + theta / n) * RAD, phi * RAD];
    },
  };
}

export function projectionFor(kind: ProjectionKind, options?: {
  parallels?: [number, number];
  lon0?: number;
  standardParallel?: number;
}): Projection {
  switch (kind) {
    case "mercator":
      return mercator();
    case "conic_conformal":
      return conicConformal(options?.parallels ?? [30, 60], options?.lon0 ?? 0);
    case "equirectangular":
      return equirectangular(options?.standardParallel ?? 0);
  }
}

/** Degrees to pixels, through the viewport. */
export function project(viewport: Viewport, lonLat: LonLat): Point {
  const [x, y] = viewport.projection.forward(lonLat);
  return [x * viewport.scale + viewport.translate[0], viewport.translate[1] - y * viewport.scale];
}

/** Pixels back to degrees. */
export function unproject(viewport: Viewport, point: Point): LonLat {
  const x = (point[0] - viewport.translate[0]) / viewport.scale;
  const y = (viewport.translate[1] - point[1]) / viewport.scale;
  return viewport.projection.inverse([x, y]);
}

/**
 * Sample the perimeter of a bbox rather than only its corners.
 *
 * On a conic projection the extreme x or y of a region is frequently on an
 * edge, not at a corner — fitting to corners alone silently crops the theatre.
 */
function perimeter(bbox: BBox, steps = 16): LonLat[] {
  const [w, s, e, n] = bbox;
  const out: LonLat[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    out.push([w + (e - w) * t, s], [w + (e - w) * t, n], [w, s + (n - s) * t], [e, s + (n - s) * t]);
  }
  return out;
}

/** Ground resolution in metres per pixel at a given latitude and scale. */
function groundResolution(projection: Projection, scale: number, center: LonLat): number {
  const delta = 0.01;
  const a = projection.forward(center);
  const b = projection.forward([center[0], clampLat(center[1] + delta)]);
  const planeDistance = Math.hypot(b[0] - a[0], b[1] - a[1]);
  if (planeDistance === 0) return Number.POSITIVE_INFINITY;
  const metres = delta * DEG * EARTH_RADIUS_M;
  return metres / (planeDistance * scale);
}

/** Slippy-map zoom equivalent, so `min_zoom` filters work under any projection. */
export function zoomOf(projection: Projection, scale: number, center: LonLat): number {
  const res = groundResolution(projection, scale, center);
  if (!Number.isFinite(res) || res <= 0) return 0;
  return Math.log2((RESOLUTION_Z0 * Math.cos(clampLat(center[1]) * DEG)) / res);
}

export interface FitOptions {
  padding?: number;
  /** Clamp the resulting zoom, in slippy-map terms. */
  minZoom?: number;
  maxZoom?: number;
}

/** Build a viewport that contains `bbox` inside `width` x `height`. */
export function fitBounds(
  projection: Projection,
  bbox: BBox,
  width: number,
  height: number,
  options: FitOptions = {},
): Viewport {
  const padding = options.padding ?? 0;
  const points = perimeter(bbox).map((p) => projection.forward(p));
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const [x, y] of points) {
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }
  const spanX = Math.max(x1 - x0, 1e-12);
  const spanY = Math.max(y1 - y0, 1e-12);
  const usableW = Math.max(width - padding * 2, 1);
  const usableH = Math.max(height - padding * 2, 1);
  const scale = Math.min(usableW / spanX, usableH / spanY);

  const midX = (x0 + x1) / 2;
  const midY = (y0 + y1) / 2;
  const translate: Point = [width / 2 - midX * scale, height / 2 + midY * scale];
  const center = projection.inverse([midX, midY]);

  const viewport: Viewport = {
    width,
    height,
    center,
    zoom: zoomOf(projection, scale, center),
    bounds: bbox,
    projection,
    scale,
    translate,
  };
  viewport.bounds = viewportBounds(viewport);
  if (options.minZoom !== undefined && viewport.zoom < options.minZoom) viewport.zoom = options.minZoom;
  if (options.maxZoom !== undefined && viewport.zoom > options.maxZoom) viewport.zoom = options.maxZoom;
  return viewport;
}

/** The geographic extent actually visible, by sampling the pixel frame. */
export function viewportBounds(viewport: Viewport): BBox {
  const { width, height } = viewport;
  let w = Infinity;
  let s = Infinity;
  let e = -Infinity;
  let n = -Infinity;
  const steps = 12;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const samples: Point[] = [
      [width * t, 0],
      [width * t, height],
      [0, height * t],
      [width, height * t],
    ];
    for (const p of samples) {
      const [lon, lat] = unproject(viewport, p);
      if (!Number.isFinite(lon) || !Number.isFinite(lat)) continue;
      if (lon < w) w = lon;
      if (lon > e) e = lon;
      if (lat < s) s = lat;
      if (lat > n) n = lat;
    }
  }
  return [w, s, e, n];
}

/** Kilometres per pixel at the viewport centre. Drives the scale bar. */
export function kmPerPixel(viewport: Viewport): number {
  return groundResolution(viewport.projection, viewport.scale, viewport.center) / 1000;
}

export function bboxContains(outer: BBox, inner: BBox, tolerance = 1e-6): boolean {
  return (
    outer[0] <= inner[0] + tolerance &&
    outer[1] <= inner[1] + tolerance &&
    outer[2] >= inner[2] - tolerance &&
    outer[3] >= inner[3] - tolerance
  );
}

/** Can this projection carry this extent without folding onto itself? */
export function projectionSuitsBbox(projection: Projection, bbox: BBox): boolean {
  return bbox[2] - bbox[0] <= projection.maxLongitudeSpan;
}

/**
 * Pick a projection for an extent.
 *
 * Conic conformal is the register the sheets are drawn in, but it earns that
 * only for mid-latitude regional frames. A hemispheric or equatorial theatre
 * gets equirectangular, which is honest about what it is doing and keeps
 * historical geometry undistorted.
 */
export function recommendProjection(bbox: BBox): Projection {
  const [w, s, e, n] = bbox;
  const spanLon = e - w;
  const midLat = (s + n) / 2;
  const wide = spanLon > 120;
  const equatorial = Math.abs(midLat) < 22;
  if (wide || equatorial) return equirectangular(equatorial ? 0 : midLat);
  const inset = (n - s) / 6;
  const conic = conicConformal([s + inset, n - inset], (w + e) / 2, midLat);
  return projectionSuitsBbox(conic, bbox) ? conic : equirectangular(midLat);
}
