"use client";

/**
 * The sheet.
 *
 * Everything drawn here comes from real geometry through pure functions in
 * @cabinet/geo. There is no freehand line anywhere on the plate, and the
 * maritime bands are computed by equidistance from sampled coastline rather
 * than traced — the same principle as UNCLOS Article 15 median lines, so where
 * two states' zones meet, the line that appears is a genuine median.
 */

import { useEffect, useMemo } from "react";
import {
  BOUNDARY_INK,
  NEUTRAL_OBSERVER,
  PLACE_MARK,
  ZONE_INK,
  buildMaritimeField,
  declutter,
  densify,
  emphasise,
  fitBounds,
  geometryPath,
  highSeasPath,
  kmPerPixel,
  medianLinePath,
  placeFrom,
  project,
  readBoundary,
  viewportBounds,
  zoneLadderPaths,
  type BBox,
  type BoundaryClass,
  type LonLat,
  type MaritimeEra,
  type Place,
  type PlacedLabel,
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

  const viewport: Viewport = useMemo(
    () => fitBounds(projection, sheet.bbox, width, height, { padding: 26 }),
    [projection, sheet.bbox, width, height],
  );

  const projector: Projector = useMemo(
    () => (lonLat: LonLat) => project(viewport, lonLat),
    [viewport],
  );

  const frame = useMemo(() => viewportBounds(viewport), [viewport]);
  const kmPerPx = useMemo(() => kmPerPixel(viewport), [viewport]);
  const pixelsPerNm = 1.852 / kmPerPx;

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
    const outerNm = era.hasEez ? 200 : era.hasContiguousZone ? era.territorialSeaNm * 2 : era.territorialSeaNm;
    const medians: string[] = [];
    for (let a = 0; a < coasts.length; a++) {
      for (let b = a + 1; b < coasts.length; b++) {
        const path = medianLinePath(field, a, b, outerNm * pixelsPerNm);
        if (path) medians.push(path);
      }
    }
    return { bands, medians, highSeas: highSeasPath(field, outerNm * pixelsPerNm) };
  }, [showMaritime, layers.countries, inFrame, projector, width, height, pixelsPerNm, era]);

  // ── settlements ───────────────────────────────────────────────────────────
  const labels = useMemo(() => {
    const source = layers.places;
    if (!source) return { placed: [] as PlacedLabel[], dropped: 0 };
    const places: Place[] = [];
    for (const feature of source.features) {
      const coords = (feature.geometry as { coordinates?: LonLat })?.coordinates;
      if (!coords) continue;
      const place = placeFrom(feature.properties, coords);
      if (!register.tiers.includes(place.tier)) continue;
      // A capital is a decision point whatever its size, so it is never
      // filtered out by zoom. Density is controlled by the label budget below,
      // which drops from the bottom of the ranking rather than by rule.
      if (place.tier !== "capital" && place.minZoom > register.zoom + 1.5) continue;
      places.push(place);
    }
    const result = declutter(places, projector, {
      width,
      height,
      gap: width < 700 ? 6 : 3,
      margin: 14,
      budget: width < 700 ? 22 : register.labelBudget,
      reserved: [
        // The legend and title block own their corners; labels do not fight them.
        { x0: 0, y0: height - 220, x1: 320, y1: height },
        { x0: width - 190, y0: height - 60, x1: width, y1: height },
      ],
    });
    return { placed: result.placed, dropped: result.dropped.length };
  }, [layers.places, projector, register, width, height]);

  const graticule = useMemo(
    () => graticulePath(frame, projector, pickGraticuleStep(frame[2] - frame[0])),
    [frame, projector],
  );

  useEffect(() => {
    onMeasured({
      placed: labels.placed.length,
      dropped: labels.dropped,
      kmPerPx,
      declaration: projection.declaration,
    });
  }, [labels, kmPerPx, projection.declaration, onMeasured]);

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

  return (
    <svg
      className="sheet"
      width={width}
      height={height}
      role="img"
      aria-label={`${sheet.label}, drawn from the ${observer === NEUTRAL_OBSERVER ? "disinterested" : observer} reading`}
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
            {demoted.has("maritime") ? null : (
              <path d={maritime.highSeas} fill="var(--sea-deep)" />
            )}
            {maritime.bands.map(({ id, ladder }) =>
              ladder.map(({ band, path }) => {
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
                    />
                  </g>
                );
              }),
            )}
            {maritime.medians.map((path, i) => (
              <path
                key={`median-${i}`}
                d={path}
                fill="none"
                stroke="var(--alliance)"
                strokeWidth="var(--w-line)"
                strokeDasharray="8 3 1.5 3"
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
        />

        <g className="land">
          {countries.map((country) => (
            <path
              key={country.iso3 || country.name}
              d={country.path}
              fill={fillFor(country.iso3)}
              onClick={() => onSelect(country.iso3 === selected ? null : country.iso3)}
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
                  />
                ) : null}
              </g>
            );
          })}
        </g>

        <g className="places">
          {labels.placed.map((label) => {
            const mark = PLACE_MARK[label.place.tier];
            const [x, y] = label.at;
            return (
              <g key={`${label.place.name}-${x.toFixed(1)}-${y.toFixed(1)}`}>
                {mark.mark === "capital" ? (
                  <>
                    <circle cx={x} cy={y} r={mark.radius} fill="var(--paper)" stroke="var(--ink)" strokeWidth={1.1} />
                    <rect x={x - 1.5} y={y - 1.5} width={3} height={3} fill="var(--ink)" />
                  </>
                ) : mark.mark === "square" ? (
                  <rect
                    x={x - mark.radius}
                    y={y - mark.radius}
                    width={mark.radius * 2}
                    height={mark.radius * 2}
                    fill="var(--ink)"
                    stroke="var(--paper)"
                    strokeWidth={0.8}
                  />
                ) : mark.mark === "disc" ? (
                  <circle cx={x} cy={y} r={mark.radius} fill="var(--ink-2)" />
                ) : mark.mark === "ring" ? (
                  <circle cx={x} cy={y} r={mark.radius} fill="none" stroke="var(--ink-3)" strokeWidth={1} />
                ) : (
                  <circle cx={x} cy={y} r={mark.radius} fill="var(--ink-4)" />
                )}
                {/* Halo by knockout, never a drop shadow. */}
                <text
                  className={mark.labelClass}
                  x={label.labelAt[0]}
                  y={label.labelAt[1]}
                  textAnchor={label.anchor}
                  stroke="var(--paper)"
                  strokeWidth={2.4}
                  strokeLinejoin="round"
                  opacity={0.82}
                  fill="none"
                >
                  {label.place.name}
                </text>
                <text
                  className={mark.labelClass}
                  x={label.labelAt[0]}
                  y={label.labelAt[1]}
                  textAnchor={label.anchor}
                >
                  {label.place.name}
                </text>
              </g>
            );
          })}
        </g>
      </g>

      {/* Neatline. A sheet has an edge; a viewport does not. */}
      <rect x={6} y={6} width={width - 12} height={height - 12} fill="none" stroke="var(--ink)" strokeWidth="var(--w-line)" />
      <rect x={10} y={10} width={width - 20} height={height - 20} fill="none" stroke="var(--ink-4)" strokeWidth="var(--w-hair)" />
    </svg>
  );
}
