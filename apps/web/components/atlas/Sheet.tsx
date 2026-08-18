"use client";

/**
 * The sheet.
 *
 * Everything drawn here comes from real geometry through pure functions in
 * @cabinet/geo. There is no freehand line anywhere on the plate, and the
 * maritime bands are computed by equidistance from sampled coastline rather
 * than traced — the same principle as UNCLOS Article 15 median lines, so where
 * two states' zones meet, the line that appears is a genuine median.
 *
 * Geometry is projected exactly once, into the sheet's own fixed frame
 * (`baseViewport`). Panning and zooming are a cheap SVG transform layered on
 * top of that fixed projection, never a re-projection: reprojecting on every
 * pointer-move — in particular rebuilding the maritime equidistance field,
 * which is a per-pixel nearest-coastline search over the whole sheet — is
 * expensive enough at world scale to freeze the tab mid-gesture.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from "react";
import {
  NEUTRAL_OBSERVER,
  PLAIN_BOUNDARY_INK,
  buildMaritimeField,
  densify,
  emphasise,
  fitBounds,
  geometryPath,
  groundScaleAt,
  kmPerPixel,
  project,
  readBoundary,
  unproject,
  viewportBounds,
  zoneAsWater,
  zoneBands,
  zoneLimitPath,
  type BBox,
  type BoundaryClass,
  type LonLat,
  type MaritimeEra,
  type Point,
  type Projection,
  type Projector,
  type Viewport,
} from "@cabinet/geo";
import type { LoadedFeature, LoadedLayer } from "@/lib/atlas/layers";
import type { OverlayId } from "@/lib/atlas/overlays";
import { registerOf, type SheetConfig } from "@/lib/atlas/sheets";

export interface SheetProps {
  sheet: SheetConfig;
  projection: Projection;
  width: number;
  height: number;
  observer: string;
  active: OverlayId[];
  areaHolder: OverlayId | null;
  demoted: Set<OverlayId>;
  era: MaritimeEra;
  layers: Record<string, LoadedLayer | undefined>;
  selected: string | null;
  onSelect: (iso3: string | null) => void;
  onMeasured: (info: { placed: number; dropped: number; kmPerPx: number; declaration: string }) => void;
}

const GRATICULE_STEPS = [1, 2, 5, 10, 15, 30];

function graticulePath(bounds: BBox, project: Projector, step: number, wrapped = false): string {
  const [w, s, e, n] = bounds;
  let out = "";
  const line = (points: LonLat[]) => {
    points.forEach((position, i) => {
      const [x, y] = project(position);
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;
      out += `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    });
  };
  const start = (value: number) => Math.ceil(value / step) * step;
  // The east edge's meridian is the west edge's on a wrapping sheet, so drawing
  // both puts a double-weight line down the seam.
  const lastLon = wrapped ? e - step / 2 : e;
  for (let lon = start(w); lon <= lastLon; lon += step) {
    const points: LonLat[] = [];
    for (let lat = Math.max(-89, s); lat <= Math.min(89, n); lat += 1) points.push([lon, lat]);
    line(points);
  }
  for (let lat = start(Math.max(-89, s)); lat <= Math.min(89, n); lat += step) {
    const points: LonLat[] = [];
    for (let lon = w; lon <= e; lon += 1) points.push([lon, lat]);
    line(points);
  }
  return out;
}

function pickGraticuleStep(spanDegrees: number): number {
  for (const step of GRATICULE_STEPS) {
    if (spanDegrees / step <= 14) return step;
  }
  return 30;
}

/**
 * The smallest a polygon may be drawn, in square screen pixels. Below this an
 * island is a dot that carries no shape and no information.
 */
const MIN_ISLAND_PIXELS = 7;

function pathOfRing(ring: Point[]): string {
  let out = "";
  for (let i = 0; i < ring.length; i++) {
    const [x, y] = ring[i]!;
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    out += `${out === "" || i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }
  return out ? `${out}Z` : "";
}

/** Shoelace. Sign is winding, which is not interesting here; size is. */
function ringArea(ring: Point[]): number {
  let twice = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[j]!;
    const b = ring[i]!;
    twice += a[0] * b[1] - b[0] * a[1];
  }
  return Math.abs(twice) / 2;
}

/** Deterministic, so the same country is the same tone on every load. */
function countryKey(iso3: string): number {
  let hash = 0;
  for (const ch of iso3) hash = (hash * 33 + ch.charCodeAt(0)) >>> 0;
  return hash;
}

interface DrawnBoundary {
  id: string;
  path: string;
  cls: BoundaryClass;
  neutral: BoundaryClass;
  dissents: boolean;
  name: string | null;
  pair: [string | null, string | null];
}

/**
 * The camera: a plain 2D affine transform (`screen = base * k + [x, y]`) over
 * the sheet's fixed projection. It never touches geometry, so panning and
 * zooming cost nothing beyond what the browser already does for any CSS/SVG
 * transform.
 */
interface Camera {
  k: number;
  x: number;
  y: number;
}

/**
 * How far in a reader may go past the sheet's own minimum framing. Beyond
 * roughly this the 1:50m geometry is being enlarged past what it knows, and
 * the coastline starts reading as the polygon it is.
 */
const ZOOM_RANGE = 24;

/**
 * Grid cells to spend on one maritime pass. Cost is roughly linear in this, so
 * it is a budget rather than a resolution: the frame the cells are spread over
 * follows the reader, so the same budget buys world-scale zones at world zoom
 * and harbour-scale zones close in.
 */
const MARITIME_CELL_BUDGET = 48_000;

/**
 * How long the view must hold still before the zones are recomputed for it.
 *
 * The zones are the expensive thing on this sheet — a per-cell nearest
 * coastline search — so they are computed for a SETTLED view, never per frame.
 * While a gesture is in flight the previous pass stays on screen, correct in
 * position because it is geographic geometry, just coarser than the new zoom
 * deserves until the next pass lands.
 */
const MARITIME_SETTLE_MS = 110;

/**
 * How far the view may drift before the zones are recomputed for it: a fraction
 * of the shorter side in pan, and this many octaves in zoom. The frame's
 * overhang is sized from both, so drift within these bounds is already covered.
 */
const ZONE_DRIFT_FRACTION = 0.18;
const ZONE_DRIFT_OCTAVES = 0.15;

export function Sheet(props: SheetProps) {
  const {
    sheet,
    projection,
    width,
    height,
    observer,
    active,
    areaHolder,
    demoted,
    era,
    layers,
    selected,
    onSelect,
    onMeasured,
  } = props;

  const register = registerOf(sheet);
  const showMaritime = active.includes("maritime");
  const showPhysical = active.includes("physical");
  const showDispute = active.includes("dispute");

  // The sheet's fixed projection. Every path below is computed from this and
  // only this — never from the live camera — so a pan/zoom gesture is purely
  // a transform on already-computed paths, not a recomputation of them.
  const baseViewport: Viewport = useMemo(
    () => fitBounds(projection, sheet.bbox, width, height, { padding: 26 }),
    [projection, sheet.bbox, width, height],
  );

  const projector: Projector = useMemo(
    () => (lonLat: LonLat) => project(baseViewport, lonLat),
    [baseViewport],
  );

  const frame = useMemo(() => viewportBounds(baseViewport), [baseViewport]);
  const kmPerPx = useMemo(() => kmPerPixel(baseViewport), [baseViewport]);

  // The sheet's own extent in the fixed projection's pixel space, so
  // panning/zooming can be kept from ever revealing empty canvas past its
  // edges — the frame has a hard border, the way a printed sheet does.
  const sheetRect = useMemo(() => {
    const [w, s, e, n] = sheet.bbox;
    const corners = [projector([w, s]), projector([w, n]), projector([e, s]), projector([e, n])];
    const xs = corners.map((c) => c[0]);
    const ys = corners.map((c) => c[1]);
    return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
  }, [projector, sheet.bbox]);

  /**
   * One period of longitude in the fixed projection's pixels. A wrapping sheet
   * repeats every `period`, so panning east off Chukotka arrives at Alaska.
   */
  const period = sheet.wraps ? Math.abs(sheetRect.x1 - sheetRect.x0) : 0;

  /**
   * The floor on zoom: the scale at which the sheet still covers the whole
   * viewport.
   *
   * `fitBounds` fits the sheet *inside* the frame, which on a tall phone leaves
   * the world as a strip with empty sea above and below it. A slippy map does
   * not do that — it never lets you see past the edge of the world — so the
   * floor is the covering scale, not the containing one, and the reader pans
   * along the long axis instead of zooming out into nothing.
   *
   * A wrapping sheet covers horizontally at any scale, by repeating, so only
   * its vertical extent constrains the floor.
   */
  const minK = useMemo(() => {
    const spanX = Math.max(sheetRect.x1 - sheetRect.x0, 1e-9);
    const spanY = Math.max(sheetRect.y1 - sheetRect.y0, 1e-9);
    const vertical = height / spanY;
    return sheet.wraps ? vertical : Math.max(width / spanX, vertical);
  }, [sheetRect, width, height, sheet.wraps]);

  const clampK = useCallback((k: number) => Math.min(minK * ZOOM_RANGE, Math.max(minK, k)), [minK]);

  const clampCamera = useCallback(
    (cam: Camera): Camera => {
      const k = clampK(cam.k);
      const { x0, x1, y0, y1 } = sheetRect;
      const mapW = (x1 - x0) * k;
      const mapH = (y1 - y0) * k;
      // East-west is normalised rather than clamped when the sheet wraps. The
      // reader can travel forever in one direction; only the offset within a
      // single period is kept, so the copy drawn first always starts within one
      // period to the left of the frame and the numbers never grow.
      let x: number;
      if (sheet.wraps) {
        const screenPeriod = period * k;
        const westEdgeAtZero = -x0 * k;
        const lowest = westEdgeAtZero - screenPeriod;
        const offset = (((cam.x - lowest) % screenPeriod) + screenPeriod) % screenPeriod;
        x = lowest + offset;
      } else if (mapW <= width) {
        x = (width - mapW) / 2 - x0 * k;
      } else {
        x = Math.min(-x0 * k, Math.max(width - x1 * k, cam.x));
      }
      const y = mapH <= height ? (height - mapH) / 2 - y0 * k : Math.min(-y0 * k, Math.max(height - y1 * k, cam.y));
      return { k, x, y };
    },
    [clampK, sheetRect, width, height, sheet.wraps, period],
  );

  /** The minimum framing, centred. Where a sheet opens, and where it re-homes. */
  const homeCamera = useMemo(
    (): Camera =>
      clampCamera({
        k: minK,
        x: (width - (sheetRect.x1 - sheetRect.x0) * minK) / 2 - sheetRect.x0 * minK,
        y: (height - (sheetRect.y1 - sheetRect.y0) * minK) / 2 - sheetRect.y0 * minK,
      }),
    [clampCamera, minK, sheetRect, width, height],
  );

  // What the reader has done to the camera, or null if they have not touched
  // it. Kept separate from the framing itself so that a resize re-frames
  // rather than resets: an untouched sheet re-homes to the new viewport, and
  // a sheet the reader has zoomed keeps that zoom, re-clamped to fit.
  const [moved, setMoved] = useState<Camera | null>(null);
  useEffect(() => setMoved(null), [sheet.id]);
  const camera = moved ? clampCamera(moved) : homeCamera;

  const fromScreen = useCallback((cam: Camera, p: Point): Point => [(p[0] - cam.x) / cam.k, (p[1] - cam.y) / cam.k], []);

  const zoomAt = useCallback(
    (screenPoint: Point, factor: number) => {
      setMoved((current) => {
        const cam = current ? clampCamera(current) : homeCamera;
        const anchor = fromScreen(cam, screenPoint);
        // Clamp the scale BEFORE deriving the offset from it. Deriving first
        // and clamping after leaves an offset computed for a scale the camera
        // never reaches, which the bounds then pull to the nearest edge — so
        // scrolling out at minimum zoom would walk the sheet into a corner.
        const k = clampK(cam.k * factor);
        return clampCamera({ k, x: screenPoint[0] - anchor[0] * k, y: screenPoint[1] - anchor[1] * k });
      });
    },
    [fromScreen, clampCamera, clampK, homeCamera],
  );

  // ── pointer interaction: drag to pan, pinch to zoom, wheel to zoom ────────
  //
  // Deliberately NOT using setPointerCapture here: capturing the pointer to
  // the <svg> root retargets the synthesized `click` event to the root too,
  // which silently breaks clicking a country to open its dossier. Tracking
  // is done on `window` instead, so a drag keeps working even once the
  // pointer leaves the sheet, without stealing clicks from the paths below.
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pointers = useRef(new Map<number, Point>());
  const gesture = useRef<{ kind: "pan" | "pinch"; anchor: Point; k: number; dist?: number } | null>(null);
  const dragged = useRef(false);
  const moveAccum = useRef(0);
  const cameraRef = useRef(camera);
  cameraRef.current = camera;

  const pointFromClient = (clientX: number, clientY: number): Point => {
    const rect = svgRef.current?.getBoundingClientRect();
    return rect ? [clientX - rect.left, clientY - rect.top] : [clientX, clientY];
  };

  const beginGesture = useCallback(() => {
    const pts = [...pointers.current.values()];
    const cam = cameraRef.current;
    if (pts.length === 1) {
      gesture.current = { kind: "pan", anchor: fromScreen(cam, pts[0]!), k: cam.k };
    } else if (pts.length >= 2) {
      const [a, b] = pts;
      const mid: Point = [(a![0] + b![0]) / 2, (a![1] + b![1]) / 2];
      const dist = Math.hypot(a![0] - b![0], a![1] - b![1]);
      gesture.current = { kind: "pinch", anchor: fromScreen(cam, mid), k: cam.k, dist };
    } else {
      gesture.current = null;
    }
  }, [fromScreen]);

  const applyGestureMove = useCallback(() => {
    const g = gesture.current;
    if (!g) return;
    const pts = [...pointers.current.values()];
    if (g.kind === "pan" && pts.length === 1) {
      const point = pts[0]!;
      setMoved(clampCamera({ k: g.k, x: point[0] - g.anchor[0] * g.k, y: point[1] - g.anchor[1] * g.k }));
    } else if (g.kind === "pinch" && pts.length >= 2 && g.dist) {
      const [a, b] = pts;
      const mid: Point = [(a![0] + b![0]) / 2, (a![1] + b![1]) / 2];
      const dist = Math.hypot(a![0] - b![0], a![1] - b![1]);
      const k = clampK(g.k * (dist / g.dist));
      setMoved(clampCamera({ k, x: mid[0] - g.anchor[0] * k, y: mid[1] - g.anchor[1] * k }));
    }
  }, [clampCamera, clampK]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!pointers.current.has(e.pointerId)) return;
      const previous = pointers.current.get(e.pointerId)!;
      const next = pointFromClient(e.clientX, e.clientY);
      moveAccum.current += Math.hypot(next[0] - previous[0], next[1] - previous[1]);
      if (moveAccum.current > 6) dragged.current = true;
      pointers.current.set(e.pointerId, next);
      applyGestureMove();
    };
    const onUp = (e: PointerEvent) => {
      if (!pointers.current.has(e.pointerId)) return;
      pointers.current.delete(e.pointerId);
      if (pointers.current.size > 0) beginGesture();
      else gesture.current = null;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [applyGestureMove, beginGesture]);

  // A native, non-passive listener: React's onWheel is registered passive at
  // the root, so calling preventDefault from a synthetic handler just warns
  // and does nothing.
  useEffect(() => {
    const node = svgRef.current;
    if (!node) return;
    const onNativeWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomAt(pointFromClient(e.clientX, e.clientY), Math.exp(-e.deltaY * 0.0018));
    };
    node.addEventListener("wheel", onNativeWheel, { passive: false });
    return () => node.removeEventListener("wheel", onNativeWheel);
  }, [zoomAt]);

  const onPointerDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (pointers.current.size === 0) {
      dragged.current = false;
      moveAccum.current = 0;
    }
    pointers.current.set(e.pointerId, pointFromClient(e.clientX, e.clientY));
    beginGesture();
  };

  const onDoubleClick = (e: ReactMouseEvent<SVGSVGElement>) => {
    zoomAt(pointFromClient(e.clientX, e.clientY), 1.8);
  };

  const selectUnlessDragged = (iso3: string) => {
    if (dragged.current) return;
    onSelect(iso3 === selected ? null : iso3);
  };

  const inFrame = useMemo(
    () => (feature: LoadedFeature) =>
      !feature.bbox ||
      !(
        feature.bbox[2] < frame[0] ||
        feature.bbox[0] > frame[2] ||
        feature.bbox[3] < frame[1] ||
        feature.bbox[1] > frame[3]
      ),
    [frame],
  );

  // ── land ──────────────────────────────────────────────────────────────────
  //
  // Kept per POLYGON rather than per country, each with the area it covers, so
  // an island too small to read can be left out. At world scale a pixel is
  // twenty-five kilometres across: every atoll in the Pacific is a speck of
  // dirt on the plate that says nothing except that something is there.
  const countryParts = useMemo(() => {
    const source = layers.countries;
    if (!source) return [];
    return source.features.filter(inFrame).map((feature) => {
      const geometry = feature.geometry as { type: string; coordinates: unknown };
      const polygons: unknown[] =
        geometry?.type === "Polygon"
          ? [geometry.coordinates]
          : geometry?.type === "MultiPolygon"
            ? (geometry.coordinates as unknown[])
            : [];
      const parts: Array<{ path: string; area: number }> = [];
      for (const polygon of polygons) {
        if (!Array.isArray(polygon)) continue;
        let path = "";
        let area = 0;
        (polygon as LonLat[][]).forEach((ring, index) => {
          const projected = ring.map((p) => projector(p));
          path += pathOfRing(projected);
          if (index === 0) area = ringArea(projected);
        });
        if (path) parts.push({ path, area });
      }
      // Largest first, so the rule below can always keep a state's mainland.
      parts.sort((a, b) => b.area - a.area);
      return {
        iso3: String(feature.properties.iso_a3 ?? feature.properties.name ?? ""),
        name: String(feature.properties.name ?? "—"),
        parts,
      };
    });
  }, [layers.countries, inFrame, projector]);

  /**
   * The smallest area, in the fixed projection's units, that still earns ink at
   * the zoom actually on screen. Quantised by octave so a gesture does not
   * rebuild every path on the plate.
   */
  const zoomOctave = Math.pow(2, Math.round(Math.log2(camera.k)));
  const islandFloor = MIN_ISLAND_PIXELS / (zoomOctave * zoomOctave);

  const countries = useMemo(
    () =>
      countryParts.map((country) => ({
        iso3: country.iso3,
        name: country.name,
        // A state is never erased outright, however small: its largest polygon
        // always draws. What goes is the scatter around it.
        path: country.parts
          .filter((part, index) => index === 0 || part.area >= islandFloor)
          .map((part) => part.path)
          .join(""),
      })),
    [countryParts, islandFloor],
  );

  // ── boundaries, read from one desk ────────────────────────────────────────
  const boundaries = useMemo<DrawnBoundary[]>(() => {
    const source = layers.boundaries;
    if (!source) return [];
    const out: DrawnBoundary[] = [];
    for (const feature of source.features) {
      if (!inFrame(feature)) continue;
      if (Number(feature.properties.min_zoom ?? 0) > register.zoom + 3) continue;
      const path = geometryPath(feature.geometry as never, projector);
      if (!path) continue;
      const neutral = readBoundary(feature.properties, NEUTRAL_OBSERVER);
      const cls = readBoundary(feature.properties, observer);
      out.push({
        id: String(feature.properties.id),
        path,
        cls,
        neutral,
        dissents: cls !== neutral,
        name: (feature.properties.name as string) ?? null,
        pair: [
          (feature.properties.adm0_a as string) ?? null,
          (feature.properties.adm0_b as string) ?? null,
        ],
      });
    }
    return out;
  }, [layers.boundaries, inFrame, projector, observer, register.zoom]);

  // Coastline, held with the size of what it encloses so the same island rule
  // applies to it. A coast drawn around an island that is not drawn reads as a
  // stray mark in open water.
  const coastlineParts = useMemo(() => {
    const source = layers.coastline;
    if (!source) return [];
    const out: Array<{ path: string; extent: number }> = [];
    for (const feature of source.features.filter(inFrame)) {
      const path = geometryPath(feature.geometry as never, projector);
      if (!path) continue;
      const box = feature.bbox;
      let extent = Infinity;
      if (box) {
        const [x0, y0] = projector([box[0], box[1]]);
        const [x1, y1] = projector([box[2], box[3]]);
        extent = Math.abs((x1 - x0) * (y1 - y0));
      }
      out.push({ path, extent });
    }
    return out;
  }, [layers.coastline, inFrame, projector]);

  const coastline = useMemo(
    () => coastlineParts.filter((line) => line.extent >= islandFloor).map((line) => line.path),
    [coastlineParts, islandFloor],
  );

  /** Countries touching a line this desk does not read as an ordinary border. */
  const unsettled = useMemo(() => {
    const set = new Set<string>();
    for (const boundary of boundaries) {
      if (boundary.cls === "international") continue;
      for (const iso of boundary.pair) if (iso) set.add(iso);
    }
    return set;
  }, [boundaries]);

  const dissenting = useMemo(() => {
    const set = new Set<string>();
    for (const boundary of boundaries) {
      if (!boundary.dissents) continue;
      for (const iso of boundary.pair) if (iso) set.add(iso);
    }
    return set;
  }, [boundaries]);

  // ── maritime, computed by equidistance ────────────────────────────────────
  //
  // Built in a reference frame fixed to the sheet rather than to the viewport,
  // for the reason given at MARITIME_REFERENCE_WIDTH, and drawn as two limit
  // lines rather than per-state bands.
  //
  // Two limit lines, not 232 ladders: the field is equidistant, so each
  // state's zone already stops where its neighbour's begins and the boundary
  // between them is implicit in the geometry. One isoline per limit therefore
  // says everything a per-state pass would, at two marching-squares passes
  // instead of several hundred.
  // The view the zones were last computed for.
  //
  // Kept as the exact camera it was captured from, never rounded. An offset is
  // only meaningful paired with the scale it was measured at — zoomed in, the
  // offset is tens of thousands of pixels, so rounding the scale even slightly
  // while keeping the offset puts the computed frame somewhere else entirely.
  // Held still instead by refusing immaterial updates. The thresholds are what
  // the frame's overhang is sized against below: a view allowed to drift
  // further than the frame reaches shows the frame's own edge as a straight
  // line across the water, with no zones at all past it.
  const [zoneView, setZoneView] = useState<Camera | null>(null);
  useEffect(() => {
    const id = setTimeout(() => {
      setZoneView((previous) => {
        const next = { k: camera.k, x: camera.x, y: camera.y };
        if (!previous) return next;
        const growth = next.k / previous.k;
        const moved = Math.hypot(next.x - previous.x * growth, next.y - previous.y * growth);
        const material =
          Math.abs(Math.log2(growth)) > ZONE_DRIFT_OCTAVES || moved > Math.min(width, height) * ZONE_DRIFT_FRACTION;
        return material ? next : previous;
      });
    }, MARITIME_SETTLE_MS);
    return () => clearTimeout(id);
  }, [camera.k, camera.x, camera.y, width, height]);

  const viewK = zoneView?.k ?? camera.k;
  const viewX = zoneView?.x ?? camera.x;
  const viewY = zoneView?.y ?? camera.y;

  /**
   * Land in the projection's own plane units, once, with each polygon's extent
   * alongside it.
   *
   * A zone pass needs land in the frame's pixels, and the pixels change every
   * pass while the plane coordinates never do — the two differ by one uniform
   * scale and offset. Projecting properly means a logarithm and a tangent per
   * vertex; doing that for every polygon on earth on every pass is most of what
   * a pass used to cost. Done once, a pass is a multiply and an add, and the
   * extents let it skip whole polygons before touching their vertices.
   */
  const landPlane = useMemo(() => {
    const source = layers.countries;
    if (!source) return [];
    const out: Array<{
      iso: string;
      rings: Point[][];
      area: number;
      x0: number;
      y0: number;
      x1: number;
      y1: number;
    }> = [];
    for (const feature of source.features) {
      const iso = String(feature.properties.iso_a3 ?? "");
      const geometry = feature.geometry as { type: string; coordinates: unknown };
      const polygons: unknown[] =
        geometry?.type === "Polygon"
          ? [geometry.coordinates]
          : geometry?.type === "MultiPolygon"
            ? (geometry.coordinates as unknown[])
            : [];
      for (const polygon of polygons) {
        if (!Array.isArray(polygon)) continue;
        const rings: Point[][] = [];
        let x0 = Infinity;
        let y0 = Infinity;
        let x1 = -Infinity;
        let y1 = -Infinity;
        let area = 0;
        for (const ring of polygon as LonLat[][]) {
          const plane = ring.map((p) => projection.forward(p));
          for (const [x, y] of plane) {
            if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
            if (x < x0) x0 = x;
            if (x > x1) x1 = x;
            if (y < y0) y0 = y;
            if (y > y1) y1 = y;
          }
          if (rings.length === 0) area = ringArea(plane);
          rings.push(plane);
        }
        if (rings.length > 0 && Number.isFinite(x0)) out.push({ iso, rings, area, x0, y0, x1, y1 });
      }
    }
    return out;
  }, [layers.countries, projection]);

  const maritime = useMemo(() => {
    if (!showMaritime || landPlane.length === 0) return null;

    const scale = baseViewport.scale * viewK;
    // Nautical miles to pixels at this scale, measured at the equator; the
    // per-row correction below carries it to every other latitude.
    const equator: Viewport = { ...baseViewport, scale, center: [baseViewport.center[0], 0] };
    const pixelsPerNm = 1.852 / kmPerPixel(equator);

    // The frame overhangs the viewport for two separate reasons, and needs
    // room for both at once.
    //
    // Reach: a coast up to 200 miles off screen still casts water into view,
    // and a projection's scale typically grows with latitude, so that same 200
    // miles is more pixels the further from the equator the frame sits.
    //
    // Drift: the view is allowed to move without earning a recomputation, and
    // it may move again while one is pending. Whatever the thresholds above
    // tolerate, the frame has to already cover — otherwise panning reveals the
    // frame's edge as a straight line with empty water past it.
    const stretch = Math.max(0.3, Math.cos(Math.max(-80, Math.min(80, baseViewport.center[1])) * (Math.PI / 180)));
    const reach = Math.min(900, Math.ceil((200 * pixelsPerNm) / stretch));
    // Half a viewport of slack in each direction, which is more than the
    // thresholds tolerate and more than a flick travels before the next pass
    // lands. It costs resolution, not time: the cell budget is fixed, so a
    // larger frame spends the same cells on bigger ones.
    const drift = Math.min(width, height) * ZONE_DRIFT_FRACTION + 24;
    const slack = Math.max(Math.min(width, height) * 0.5, drift);
    const marginX = Math.ceil(reach + slack);
    const marginY = Math.ceil(reach + slack);
    const frameWidth = width + marginX * 2;
    const frameHeight = height + marginY * 2;
    let cellSize = width < 700 ? 4 : 5;
    while ((frameWidth / cellSize) * (frameHeight / cellSize) > MARITIME_CELL_BUDGET) cellSize += 1;

    // The settled view's own viewport, offset by the margin, so the field's
    // coordinates are screen coordinates and the algorithm's pixel-scale
    // heuristics mean what they say at every zoom.
    const ref: Viewport = {
      ...baseViewport,
      width: frameWidth,
      height: frameHeight,
      scale,
      translate: [
        baseViewport.translate[0] * viewK + viewX + marginX,
        baseViewport.translate[1] * viewK + viewY + marginY,
      ],
    };
    // Plane units to this frame's pixels: the affine step that replaces
    // reprojecting, and the reason a pass can afford to run on every settle.
    const [tx, ty] = ref.translate;
    const toFrame = (plane: Point, shift: number): Point => [
      (plane[0] + shift) * scale + tx,
      ty - plane[1] * scale,
    ];

    // A wrapping sheet is entered from either side, so each polygon is offered
    // at three longitudes and kept wherever it lands inside the frame. One
    // period is a constant offset in plane units, so this costs nothing. It is
    // also what makes the zones continuous across the antimeridian: the field
    // sees Chukotka's coast while computing Alaska's water.
    const period = sheet.wraps
      ? projection.forward([180, 0])[0] - projection.forward([-180, 0])[0]
      : 0;
    const shifts = sheet.wraps ? [-period, 0, period] : [0];
    const pad = Math.max(marginX, marginY);

    // Polygon nesting is preserved rather than flattened to a ring list: the
    // land mask unions polygons and only applies even-odd within one, which is
    // what keeps a shared border from cancelling into a sliver of phantom sea.
    // An island the sheet does not draw casts no water either: a two hundred
    // mile zone around nothing visible is the most confusing thing this plate
    // could show.
    const zoneIslandFloor = MIN_ISLAND_PIXELS / (scale * scale);

    const landPolygons: Point[][][] = [];
    const byState = new Map<string, Point[]>();
    for (const polygon of landPlane) {
      if (polygon.area < zoneIslandFloor) continue;
      for (const shift of shifts) {
        // The polygon's own extent, carried into the frame, decides whether any
        // of its vertices are worth transforming.
        const bx0 = (polygon.x0 + shift) * scale + tx;
        const bx1 = (polygon.x1 + shift) * scale + tx;
        const by0 = ty - polygon.y1 * scale;
        const by1 = ty - polygon.y0 * scale;
        if (bx1 < -pad || bx0 > frameWidth + pad || by1 < -pad || by0 > frameHeight + pad) continue;

        const rings = polygon.rings.map((ring) => ring.map((p) => toFrame(p, shift)));
        landPolygons.push(rings);
        const points = byState.get(polygon.iso) ?? [];
        for (const ring of rings) points.push(...densify(ring, 6));
        byState.set(polygon.iso, points);
      }
    }
    const coasts: Array<{ id: string; points: Point[] }> = [];
    for (const [id, points] of byState) if (points.length > 4) coasts.push({ id, points });
    if (coasts.length === 0) return null;

    const field = buildMaritimeField({ width: frameWidth, height: frameHeight, cellSize, coasts, landPolygons });

    // A projection's scale typically grows away from the equator, so a fixed
    // number of pixels is a shorter distance on the ground the further north it
    // sits. Correcting per row from the projection itself — not from cos(lat),
    // which is only Mercator's answer — is what keeps a 200-mile limit 200
    // miles wide off Norway as well as off Somalia, including across the
    // compact-Mercator fold.
    const rowGround: number[] = [];
    for (let row = 0; row < field.rows; row++) {
      const [, lat] = unproject(ref, [frameWidth / 2, (row + 0.5) * cellSize]);
      rowGround.push(groundScaleAt(projection, lat));
    }
    const groundScale = (row: number) => rowGround[row] ?? 1;

    const limits: Array<{ zone: "territorial" | "eez"; path: string }> = [];
    for (const band of zoneBands(era)) {
      if (band.zone !== "territorial" && band.zone !== "eez") continue;
      const outerNm = band.outerNm ?? band.innerNm;
      const path = zoneLimitPath(field, outerNm * pixelsPerNm, groundScale);
      if (path) limits.push({ zone: band.zone, path });
    }

    // Field coordinates are the settled view's screen coordinates plus the
    // margin, and the group these paths sit in is already carrying base space
    // to the screen, so this undoes exactly the settled camera.
    const transform = `scale(${1 / viewK}) translate(${-(viewX + marginX)},${-(viewY + marginY)})`;

    return { limits, transform };
  }, [showMaritime, landPlane, projection, baseViewport, viewK, viewX, viewY, width, height, sheet.wraps, era]);

  const graticule = useMemo(() => {
    // A wrapping sheet draws its grid over one period only. The frame is wider
    // than the sheet, so grid drawn to the frame's edges would be redrawn over
    // the neighbouring copy.
    const bounds: BBox = sheet.wraps
      ? [sheet.bbox[0], frame[1], sheet.bbox[2], frame[3]]
      : frame;
    return graticulePath(bounds, projector, pickGraticuleStep(bounds[2] - bounds[0]), sheet.wraps);
  }, [frame, projector, sheet.wraps, sheet.bbox]);

  useEffect(() => {
    onMeasured({ placed: 0, dropped: 0, kmPerPx, declaration: projection.declaration });
  }, [kmPerPx, projection.declaration, onMeasured]);

  const politicalHolder = areaHolder === "political";
  const disputeHolder = areaHolder === "dispute";

  const fillFor = (iso3: string): string => {
    if (iso3 === selected) return "rgba(46,92,110,.20)";
    if (disputeHolder) {
      if (dissenting.has(iso3)) return "var(--hostility-wash)";
      if (unsettled.has(iso3)) return "var(--uncertainty-wash)";
      return "var(--land)";
    }
    if (politicalHolder) {
      // No wash for a state touching an unsettled line: an olive tint on a
      // handful of countries is a claim about them, and a plate with no legend
      // gives a reader no way to read it as one.
      // A whisper of variation so adjacent states separate without colouring in.
      return countryKey(iso3) % 2 === 0 ? "var(--land)" : "var(--land-out)";
    }
    return "var(--land)";
  };

  const cameraTransform = `translate(${camera.x},${camera.y}) scale(${camera.k})`;

  // How many copies of the sheet it takes to cover the frame. One more than
  // strictly fits, because the first copy starts up to a period to the left.
  const repeats = sheet.wraps && period > 0 ? Math.ceil(width / (period * camera.k)) + 1 : 1;

  const content = (
    <>
      {showPhysical && layers.bathymetry ? (
        <g opacity={demoted.has("physical") ? 0.4 : 1}>
          {layers.bathymetry.features.filter(inFrame).map((feature, i) => (
            <path
              key={`bath-${i}`}
              d={geometryPath(feature.geometry as never, projector)}
              fill="var(--sea-deep)"
              opacity={0.55}
            />
          ))}
        </g>
      ) : null}

      <path
        d={graticule}
        fill="none"
        stroke="var(--ink-5)"
        strokeWidth="var(--w-hair)"
        opacity={0.5}
        vectorEffect="non-scaling-stroke"
      />

      <g className="land">
        {countries.map((country) => (
          <path
            key={country.iso3 || country.name}
            d={country.path}
            fill={fillFor(country.iso3)}
            onClick={() => selectUnlessDragged(country.iso3)}
          >
            <title>{country.name}</title>
          </path>
        ))}
      </g>

      {showPhysical && layers.lakes ? (
        <g>
          {layers.lakes.features.filter(inFrame).map((feature, i) => (
            <path key={`lake-${i}`} d={geometryPath(feature.geometry as never, projector)} fill="var(--sea)" />
          ))}
        </g>
      ) : null}

      {showPhysical && layers.rivers ? (
        <g>
          {layers.rivers.features.filter(inFrame).map((feature, i) => (
            <path
              key={`river-${i}`}
              d={geometryPath(feature.geometry as never, projector)}
              fill="none"
              stroke="var(--sea-deep)"
              strokeWidth={Math.max(0.4, Number(feature.properties.width ?? 1) * 0.5)}
              opacity={0.85}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
      ) : null}

      {coastline.length > 0 ? (
        <g>
          {coastline.map((line, i) => (
            <path
              key={`coast-${i}`}
              d={line}
              fill="none"
              stroke="var(--ink-2)"
              strokeWidth="var(--w-line)"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
      ) : null}

      {/* Ship canals. Water, drawn over the land it cuts through, because that
          is what they are and what they are for: without the Suez line, Sinai
          is simply part of Egypt at every zoom this sheet reaches. */}
      {layers.canals ? (
        <g className="canals">
          {layers.canals.features.map((feature, i) => {
            const d = geometryPath(feature.geometry as never, projector);
            const name = String(feature.properties.name ?? "Canal");
            return (
              <g key={`canal-${i}`}>
                {/* Banks, then water. A single pale line on pale ground is not
                    a canal, it is a scratch. */}
                <path
                  d={d}
                  fill="none"
                  stroke="var(--ink-3)"
                  strokeWidth={3.6}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d={d}
                  fill="none"
                  stroke="var(--sea)"
                  strokeWidth={2}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                >
                  <title>{name}</title>
                </path>
              </g>
            );
          })}
        </g>
      ) : null}

      <g className="boundaries">
        {boundaries.map((boundary) => {
          const specs = showDispute && boundary.dissents
            ? emphasise(PLAIN_BOUNDARY_INK[boundary.cls])
            : PLAIN_BOUNDARY_INK[boundary.cls];
          return (
            <g key={boundary.id} data-class={boundary.cls}>
              {specs.map((spec, i) => (
                <path
                  key={i}
                  d={boundary.path}
                  fill="none"
                  stroke={spec.stroke}
                  strokeWidth={spec.width}
                  strokeDasharray={spec.dash ?? undefined}
                  strokeLinecap="butt"
                  opacity={spec.opacity}
                  transform={spec.offset ? `translate(0,${spec.offset})` : undefined}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {showDispute && boundary.dissents ? (
                <path
                  d={boundary.path}
                  fill="none"
                  stroke="var(--breach)"
                  strokeWidth="5.5"
                  strokeDasharray="1 6"
                  opacity={0.75}
                  vectorEffect="non-scaling-stroke"
                />
              ) : null}
            </g>
          );
        })}
      </g>
    </>
  );

  return (
    <svg
      ref={svgRef}
      className="sheet"
      width={width}
      height={height}
      role="img"
      aria-label={`${sheet.label}, drawn from the ${observer === NEUTRAL_OBSERVER ? "disinterested" : observer} reading. Scroll or pinch to zoom, drag to pan.`}
      onPointerDown={onPointerDown}
      onDoubleClick={onDoubleClick}
    >
      <defs>
        <pattern id="p-blind" width="7" height="7" patternUnits="userSpaceOnUse">
          <rect width="7" height="7" fill="var(--land-blind)" />
          <path d="M0,7 L7,0" stroke="var(--ink-5)" strokeWidth="0.45" />
          <path d="M0,0 L7,7" stroke="var(--ink-5)" strokeWidth="0.45" />
        </pattern>
        <pattern id="p-thin" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0,3 H6" stroke="var(--ink-5)" strokeWidth="0.5" />
        </pattern>
        <pattern id="p-dissent" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <path d="M0,2.5 H5" stroke="var(--hostility)" strokeWidth="0.55" opacity="0.42" />
        </pattern>
        <clipPath id="sheet-frame">
          <rect x="0" y="0" width={width} height={height} />
        </clipPath>
        {/* One period exactly. Each repeat is clipped to the sheet's own extent
            so nothing is drawn twice where two copies meet: the zone washes are
            translucent, and a strip of doubled alpha down the seam is visible
            as a line even though the geometry either side of it is right. */}
        <clipPath id="sheet-extent">
          <rect
            x={sheetRect.x0}
            y={sheetRect.y0}
            width={sheetRect.x1 - sheetRect.x0}
            height={sheetRect.y1 - sheetRect.y0}
          />
        </clipPath>
      </defs>

      <g clipPath="url(#sheet-frame)">
        <rect width={width} height={height} fill="var(--sea)" />

        {/* Water first, and once — not per repeat.
            The zones are computed for the view rather than for the sheet, so
            they neither need repeating nor tolerate being clipped to one
            period: a zone straddling the antimeridian would have the far half
            clipped away by the copy it belongs to and redrawn a whole period
            off by the next, which reads as the water simply stopping in a
            straight line down the seam. Drawn once, under the land, it lands
            where it is. */}
        {maritime ? (
          <g transform={cameraTransform}>
            <g className="maritime" transform={maritime.transform}>
              {/* Widest zone first: each nearer band of water is darker, so the
                  ladder reads seaward without a single line being drawn. */}
              {[...maritime.limits].reverse().map(({ zone, path }) => {
                const ink = zoneAsWater(zone);
                return ink.fill ? <path key={zone} d={path} fill={ink.fill} fillRule="evenodd" /> : null;
              })}
            </g>
          </g>
        ) : null}

        {Array.from({ length: repeats }, (_, i) => (
          <g key={i} transform={cameraTransform}>
            <g transform={i === 0 ? undefined : `translate(${i * period},0)`}>
              <g clipPath="url(#sheet-extent)">{content}</g>
            </g>
          </g>
        ))}
      </g>

      {/* Neatline. A sheet has an edge; a viewport does not. Fixed to the
          screen frame, not the camera — a border does not pan or zoom. */}
      <rect x={6} y={6} width={width - 12} height={height - 12} fill="none" stroke="var(--ink)" strokeWidth="var(--w-line)" />
      <rect x={10} y={10} width={width - 20} height={height - 20} fill="none" stroke="var(--ink-4)" strokeWidth="var(--w-hair)" />
    </svg>
  );
}
