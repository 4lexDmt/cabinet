"use client";

/**
 * Named gazetteer overlay for the tier1 sheet.
 *
 * Centroids and Delaunay adjacency, not ADM1 polygons. Ink is TOKEN — lakes
 * are water, shared water is hostility (contested), trunk roads are the oxide
 * accent, never a second palette.
 */

import { useMemo } from "react";
import {
  TOKEN,
  WEIGHT,
  countries,
  uniqueLakes,
  uniqueRivers,
  waterNoteOf,
  type LonLat,
  type Projector,
} from "@cabinet/geo";

const BORDER_AT = 1.6;
const SEATS_AT = 1.7;
const SECONDARY_ROADS_AT = 2.4;
const LABELS_AT = 3;

function projected(projector: Projector, coord: LonLat): { x: number; y: number } | null {
  const [x, y] = projector(coord);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return { x, y };
}

function lakeAxes(projector: Projector, centroid: LonLat, radiusKm: number): { rx: number; ry: number } {
  const lat = centroid[1];
  const cos = Math.max(0.2, Math.cos((lat * Math.PI) / 180));
  const east = projected(projector, [centroid[0] + radiusKm / (111.32 * cos), centroid[1]]);
  const north = projected(projector, [centroid[0], centroid[1] + radiusKm / 110.57]);
  const centre = projected(projector, centroid);
  if (!east || !north || !centre) return { rx: 2, ry: 2 };
  return {
    rx: Math.max(1.2, Math.abs(east.x - centre.x)),
    ry: Math.max(1.2, Math.abs(north.y - centre.y)),
  };
}

function polyPath(projector: Projector, course: LonLat[]): string {
  let d = "";
  course.forEach((pt, i) => {
    const p = projected(projector, pt);
    if (!p) return;
    d += `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`;
  });
  return d;
}

export function GazetteerOverlay(props: { projector: Projector; relativeK: number }) {
  const { projector, relativeK } = props;

  const lakes = useMemo(() => uniqueLakes(), []);
  const rivers = useMemo(() => uniqueRivers(), []);
  const plate = useMemo(() => countries(), []);
  const saudiAssets = useMemo(() => waterNoteOf("SAU")?.assets ?? [], []);

  const borders = useMemo(() => {
    const seen = new Set<string>();
    const lines: Array<{ id: string; a: LonLat; b: LonLat }> = [];
    const byId = new Map(plate.flatMap((c) => c.provinces.map((p) => [p.id, p] as const)));
    for (const province of byId.values()) {
      for (const neighbour of province.borders) {
        const key = province.id < neighbour ? `${province.id}:${neighbour}` : `${neighbour}:${province.id}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const other = byId.get(neighbour);
        if (!other) continue;
        lines.push({ id: key, a: province.centroid, b: other.centroid });
      }
    }
    return lines;
  }, [plate]);

  const roads = useMemo(() => {
    const lines: Array<{ id: string; a: LonLat; b: LonLat; cls: string }> = [];
    for (const country of plate) {
      const nodes = new Map(country.nodes.map((n) => [n.name, n]));
      for (const edge of country.edges) {
        const from = nodes.get(edge.from_name);
        const to = nodes.get(edge.to_name);
        if (!from || !to) continue;
        lines.push({
          id: `${country.iso}:${edge.from_name}:${edge.to_name}`,
          a: from.coord,
          b: to.coord,
          cls: edge.class,
        });
      }
    }
    return lines;
  }, [plate]);

  const seats = useMemo(
    () => plate.flatMap((c) => c.provinces.map((p) => ({ id: p.id, name: p.seat, coord: p.centroid }))),
    [plate],
  );

  const cities = useMemo(
    () =>
      plate.flatMap((c) =>
        c.cities.map((city) => ({
          id: `${c.iso}:${city.name}`,
          name: city.name,
          coord: city.coord,
          tier: city.tier,
          capital: city.capital,
          port: city.port,
        })),
      ),
    [plate],
  );

  const showBorders = relativeK >= BORDER_AT;
  const showSeats = relativeK >= SEATS_AT;
  const showSecondary = relativeK >= SECONDARY_ROADS_AT;
  const showLabels = relativeK >= LABELS_AT;

  return (
    <g className="gazetteer" pointerEvents="visiblePainted">
      {lakes.map((lake) => {
        const centre = projected(projector, lake.centroid);
        if (!centre) return null;
        const { rx, ry } = lakeAxes(projector, lake.centroid, Math.sqrt(lake.area_km2 / Math.PI));
        const title = [
          lake.name,
          `${Math.round(lake.area_km2).toLocaleString()} km²`,
          lake.max_depth_m ? `${lake.max_depth_m} m` : null,
          lake.navigable,
          lake.riparian.join(", "),
          lake.note,
        ]
          .filter(Boolean)
          .join(" · ");
        return (
          <g key={lake.id}>
            <ellipse
              cx={centre.x}
              cy={centre.y}
              rx={rx}
              ry={ry}
              fill={TOKEN.sea}
              stroke={lake.shared ? TOKEN.hostility : TOKEN.seaDeep}
              strokeWidth={lake.shared ? 2.4 : 1}
              opacity={0.92}
              vectorEffect="non-scaling-stroke"
            >
              <title>{title}</title>
            </ellipse>
          </g>
        );
      })}

      {rivers.map((river) => {
        const d = polyPath(projector, river.course);
        if (!d) return null;
        const navigable = river.navigable_km > 0;
        const title = [
          river.name,
          `${river.length_km} km`,
          navigable ? `${river.navigable_km} km navigable` : "not navigable",
          river.riparian.join(", "),
          river.note,
        ]
          .filter(Boolean)
          .join(" · ");
        return (
          <g key={river.id}>
            <path
              d={d}
              fill="none"
              stroke={TOKEN.paper}
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={d}
              fill="none"
              stroke={TOKEN.ink}
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={navigable ? undefined : "4 3"}
              vectorEffect="non-scaling-stroke"
            >
              <title>{title}</title>
            </path>
          </g>
        );
      })}

      {showBorders
        ? borders.map((border) => {
            const a = projected(projector, border.a);
            const b = projected(projector, border.b);
            if (!a || !b) return null;
            return (
              <line
                key={border.id}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={TOKEN.ink3}
                strokeWidth={WEIGHT.hair}
                strokeDasharray="2 3"
                opacity={0.55}
                vectorEffect="non-scaling-stroke"
              />
            );
          })
        : null}

      {roads.map((road) => {
        if (road.cls === "secondary" || road.cls === "spur") {
          if (!showSecondary) return null;
        }
        const a = projected(projector, road.a);
        const b = projected(projector, road.b);
        if (!a || !b) return null;
        const trunk = road.cls === "trunk";
        const d = `M${a.x.toFixed(2)},${a.y.toFixed(2)} L${b.x.toFixed(2)},${b.y.toFixed(2)}`;
        return (
          <g key={road.id}>
            <path
              d={d}
              fill="none"
              stroke={TOKEN.paper}
              strokeWidth={trunk ? 3.2 : 2.2}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={d}
              fill="none"
              stroke={trunk ? TOKEN.hostility : TOKEN.ink2}
              strokeWidth={trunk ? 1.4 : 0.8}
              strokeLinecap="round"
              opacity={road.cls === "secondary" || road.cls === "spur" ? 0.7 : 1}
              vectorEffect="non-scaling-stroke"
            />
          </g>
        );
      })}

      {saudiAssets.map((asset) => {
        const p = projected(projector, asset.coord);
        if (!p) return null;
        const r = 3.2;
        return (
          <g key={asset.name} transform={`translate(${p.x},${p.y})`}>
            <rect
              x={-r}
              y={-r}
              width={r * 2}
              height={r * 2}
              fill={TOKEN.paper}
              stroke={TOKEN.hostility}
              strokeWidth={1.2}
              vectorEffect="non-scaling-stroke"
            >
              <title>{`${asset.name} · ${asset.type}`}</title>
            </rect>
          </g>
        );
      })}

      {showSeats
        ? seats.map((seat) => {
            const p = projected(projector, seat.coord);
            if (!p) return null;
            return (
              <circle
                key={`seat-${seat.id}`}
                cx={p.x}
                cy={p.y}
                r={1.4}
                fill={TOKEN.ink}
                vectorEffect="non-scaling-stroke"
              >
                <title>{seat.name}</title>
              </circle>
            );
          })
        : null}

      {cities.map((city) => {
        const p = projected(projector, city.coord);
        if (!p) return null;
        const r = city.tier === 3 ? 3.2 : city.tier === 2 ? 2.4 : 1.8;
        return (
          <g key={city.id} transform={`translate(${p.x},${p.y})`}>
            <circle
              r={r}
              fill={city.capital ? TOKEN.ink : TOKEN.paper}
              stroke={TOKEN.ink}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            >
              <title>{`${city.name}${city.capital ? " · capital" : ""}${city.port ? " · port" : ""}`}</title>
            </circle>
            {showLabels ? (
              <text
                x={r + 3}
                y={3}
                fill={TOKEN.ink}
                fontSize={city.tier === 3 ? 10 : 8.5}
                style={{ fontFamily: "var(--cond)" }}
              >
                {city.name}
              </text>
            ) : null}
          </g>
        );
      })}
    </g>
  );
}
