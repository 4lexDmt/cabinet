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
  BOUNDARY_INK,
  NEUTRAL_OBSERVER,
  ZONE_INK,
  buildMaritimeField,
  densify,
  emphasise,
  fitBounds,
  geometryPath,
  kmPerPixel,
  project,
  readBoundary,
  viewportBounds,
  zoneLadderPaths,
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

function graticulePath(bounds: BBox, project: Projector, step: number): string {
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
  for (let lon = start(w); lon <= e; lon += step) {
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

const HOME: Camera = { k: 1, x: 0, y: 0 };

// A reader can zoom in as far as the register allows, but never out past the
// sheet's own home framing — the same way a slippy map stops at world zoom 0
// rather than showing the frame repeat into empty space.
const MIN_ZOOM_K = 1;
const MAX_ZOOM_K = 48;

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
  const pixelsPerNm = 1.852 / kmPerPx;

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

  const clampCamera = useCallback(
    (cam: Camera): Camera => {
      const k = Math.min(MAX_ZOOM_K, Math.max(MIN_ZOOM_K, cam.k));
      const { x0, x1, y0, y1 } = sheetRect;
      const mapW = (x1 - x0) * k;
      const mapH = (y1 - y0) * k;
      const x = mapW <= width ? (width - mapW) / 2 - x0 * k : Math.min(-x0 * k, Math.max(width - x1 * k, cam.x));
      const y = mapH <= height ? (height - mapH) / 2 - y0 * k : Math.min(-y0 * k, Math.max(height - y1 * k, cam.y));
      return { k, x, y };
    },
    [sheetRect, width, height],
  );

  // The reader's own pan/zoom over the sheet. Reset whenever a different
  // sheet is chosen, so switching sheets always re-homes to its own frame.
  const [camera, setCamera] = useState<Camera>(HOME);
  useEffect(() => setCamera(HOME), [sheet.id]);
  // Re-clamp on resize: a camera that was valid at one viewport size can
  // otherwise leave the sheet short of covering a newly larger one.
  useEffect(() => setCamera((c) => clampCamera(c)), [clampCamera]);

  const fromScreen = useCallback((cam: Camera, p: Point): Point => [(p[0] - cam.x) / cam.k, (p[1] - cam.y) / cam.k], []);

  const zoomAt = useCallback(
    (screenPoint: Point, factor: number) => {
      setCamera((cam) => {
        const anchor = fromScreen(cam, screenPoint);
        const k = cam.k * factor;
        return clampCamera({ k, x: screenPoint[0] - anchor[0] * k, y: screenPoint[1] - anchor[1] * k });
      });
    },
    [fromScreen, clampCamera],
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
      setCamera(clampCamera({ k: g.k, x: point[0] - g.anchor[0] * g.k, y: point[1] - g.anchor[1] * g.k }));
    } else if (g.kind === "pinch" && pts.length >= 2 && g.dist) {
      const [a, b] = pts;
      const mid: Point = [(a![0] + b![0]) / 2, (a![1] + b![1]) / 2];
      const dist = Math.hypot(a![0] - b![0], a![1] - b![1]);
      const k = g.k * (dist / g.dist);
      setCamera(clampCamera({ k, x: mid[0] - g.anchor[0] * k, y: mid[1] - g.anchor[1] * k }));
    }
  }, [clampCamera]);

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
  const countries = useMemo(() => {
    const source = layers.countries;
    if (!source) return [];
    return source.features.filter(inFrame).map((feature) => ({
      iso3: String(feature.properties.iso_a3 ?? feature.properties.name ?? ""),
      name: String(feature.properties.name ?? "—"),
      path: geometryPath(feature.geometry as never, projector),
    }));
  }, [layers.countries, inFrame, projector]);

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
  // This is a per-pixel nearest-coastline search over the whole sheet — the
  // single most expensive computation on this page. It depends only on the
  // fixed projector above, never the live camera, so it runs once per
  // sheet/layer load rather than on every pan/zoom frame.
  //
  // Deliberately not computing median lines or the high-seas polygon here:
  // the equidistant field already makes every state's band mutually
  // exclusive with its neighbours (that is the whole point of computing
  // zones from one distance field rather than tracing them), so a band's own
  // edge already sits exactly on the median. Drawing that same line a second
  // time would cost one `medianLinePath` scan per PAIR of coastal states —
  // 26,796 pairs at world scale — for a purely decorative overlay this view
  // doesn't need.
  const maritime = useMemo(() => {
    if (!showMaritime || !layers.countries) return null;
    const cellSize = width > 1100 ? 5 : 4;
    const rings: Point[][] = [];
    const coasts: Array<{ id: string; points: Point[] }> = [];
    for (const feature of layers.countries.features) {
      if (!inFrame(feature)) continue;
      const iso = String(feature.properties.iso_a3 ?? "");
      const projected: Point[][] = [];
      const walk = (node: unknown, depth: number): void => {
        if (!Array.isArray(node)) return;
        if (depth === 1) {
          projected.push((node as LonLat[]).map((p) => projector(p)));
          return;
        }
        for (const child of node) walk(child, depth - 1);
      };
      const geometry = feature.geometry as { type: string; coordinates: unknown };
      if (geometry?.type === "Polygon") walk(geometry.coordinates, 2);
      else if (geometry?.type === "MultiPolygon") walk(geometry.coordinates, 3);
      if (projected.length === 0) continue;
      rings.push(...projected);
      const points: Point[] = [];
      for (const ring of projected) points.push(...densify(ring, 6));
      if (points.length > 4) coasts.push({ id: iso, points });
    }
    if (coasts.length === 0) return null;
    const field = buildMaritimeField({ width, height, cellSize, coasts, landRings: rings });
    const bands = coasts.map((coast, index) => ({
      id: coast.id,
      ladder: zoneLadderPaths(field, index, pixelsPerNm, era),
    }));
    return { bands };
  }, [showMaritime, layers.countries, inFrame, projector, width, height, pixelsPerNm, era]);

  const graticule = useMemo(
    () => graticulePath(frame, projector, pickGraticuleStep(frame[2] - frame[0])),
    [frame, projector],
  );

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
      if (unsettled.has(iso3)) return "var(--uncertainty-wash)";
      // A whisper of variation so adjacent states separate without colouring in.
      return countryKey(iso3) % 2 === 0 ? "var(--land)" : "var(--land-out)";
    }
    return "var(--land)";
  };

  const cameraTransform = `translate(${camera.x},${camera.y}) scale(${camera.k})`;

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
      </defs>

      <g clipPath="url(#sheet-frame)">
        <rect width={width} height={height} fill="var(--sea)" />

        <g transform={cameraTransform}>
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

          {maritime ? (
            <g className="maritime">
              {maritime.bands.map(({ id, ladder }) =>
                ladder
                  .filter(({ band }) => band.zone === "territorial" || band.zone === "eez")
                  .map(({ band, path }) => {
                    const ink = ZONE_INK[band.zone];
                    return (
                      <g key={`${id}-${band.zone}`}>
                        {demoted.has("maritime") || !ink.fill ? null : (
                          <path d={path} fill={ink.fill} />
                        )}
                        <path
                          d={path}
                          fill="none"
                          stroke={ink.stroke ?? "none"}
                          strokeWidth={ink.strokeWidth ?? undefined}
                          strokeDasharray={ink.dash ?? undefined}
                          opacity={ink.opacity}
                          vectorEffect="non-scaling-stroke"
                        />
                      </g>
                    );
                  }),
              )}
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
                style={{ cursor: "pointer" }}
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

          {layers.coastline ? (
            <g>
              {layers.coastline.features.filter(inFrame).map((feature, i) => (
                <path
                  key={`coast-${i}`}
                  d={geometryPath(feature.geometry as never, projector)}
                  fill="none"
                  stroke="var(--ink-2)"
                  strokeWidth="var(--w-line)"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </g>
          ) : null}

          <g className="boundaries">
            {boundaries.map((boundary) => {
              const specs =
                showDispute && boundary.dissents
                  ? emphasise(BOUNDARY_INK[boundary.cls])
                  : BOUNDARY_INK[boundary.cls];
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
        </g>
      </g>

      {/* Neatline. A sheet has an edge; a viewport does not. Fixed to the
          screen frame, not the camera — a border does not pan or zoom. */}
      <rect x={6} y={6} width={width - 12} height={height - 12} fill="none" stroke="var(--ink)" strokeWidth="var(--w-line)" />
      <rect x={10} y={10} width={width - 20} height={height - 20} fill="none" stroke="var(--ink-4)" strokeWidth="var(--w-hair)" />
    </svg>
  );
}
