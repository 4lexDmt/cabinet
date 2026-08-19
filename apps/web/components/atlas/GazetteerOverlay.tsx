"use client";

/**
 * Named gazetteer overlay for the tier1 sheet.
 *
 * Incorporated provinces are dissolved ADM1 polygons — New England is one
 * outline, not six states. Those lines are thinner and paler than the
 * international boundary drawn later in the same sheet, the same split
 * Google Maps makes between admin and country. Roads are not drawn.
 * Labels live in screen pixels (inverse-scaled) so names keep size while
 * the plate zooms, and they appear / disappear by zoom like Google Maps.
 */

import { useEffect, useMemo, useState } from "react";
import {
  TOKEN,
  countries,
  geometryPath,
  uniqueLakes,
  uniqueRivers,
  waterNoteOf,
  cityVisible,
  provinceBordersVisible,
  provinceLabelsVisible,
  GAZETTEER_ZOOM,
  type LonLat,
  type Projector,
} from "@cabinet/geo";
import { loadLayer, type LoadedLayer } from "@/lib/atlas/layers";

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

export function GazetteerOverlay(props: {
  projector: Projector;
  relativeK: number;
  cameraK: number;
  part: "admin" | "labels";
}) {
  const { projector, relativeK, cameraK, part } = props;
  const inv = 1 / Math.max(cameraK, 1e-6);

  const [admin, setAdmin] = useState<LoadedLayer | null>(null);
  useEffect(() => {
    let live = true;
    loadLayer("tier1_provinces")
      .then((layer) => {
        if (live) setAdmin(layer);
      })
      .catch(() => {
        if (live) setAdmin(null);
      });
    return () => {
      live = false;
    };
  }, []);

  const lakes = useMemo(() => uniqueLakes(), []);
  const rivers = useMemo(() => uniqueRivers(), []);
  const plate = useMemo(() => countries(), []);
  const saudiAssets = useMemo(() => waterNoteOf("SAU")?.assets ?? [], []);

  const provincePaths = useMemo(() => {
    if (!admin) return [];
    return admin.features
      .map((feature) => ({
        id: String(feature.properties.id ?? ""),
        name: String(feature.properties.name ?? ""),
        path: geometryPath(feature.geometry as never, projector),
      }))
      .filter((feature) => feature.id && feature.path);
  }, [admin, projector]);

  const cities = useMemo(
    () =>
      plate.flatMap((country) =>
        country.cities.map((city) => ({
          id: `${country.iso}:${city.name}`,
          name: city.name,
          coord: city.coord,
          tier: city.tier,
          capital: city.capital,
          port: city.port,
        })),
      ),
    [plate],
  );

  const provinces = useMemo(
    () => plate.flatMap((country) => country.provinces.map((province) => ({ ...province, iso: country.iso }))),
    [plate],
  );

  if (part === "admin") {
    const showBorders = provinceBordersVisible(relativeK);
    const showLakes = relativeK >= GAZETTEER_ZOOM.lakes;
    const showRivers = relativeK >= GAZETTEER_ZOOM.rivers;
    return (
      <g className="gazetteer gazetteer-admin" pointerEvents="visiblePainted">
        {showLakes
          ? lakes.map((lake) => {
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
                <ellipse
                  key={lake.id}
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
              );
            })
          : null}

        {showRivers
          ? rivers.map((river) => {
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
            })
          : null}

        {showBorders
          ? provincePaths.map((province) => (
              <path
                key={province.id}
                d={province.path}
                className="gazetteer-province-border"
                fill="none"
                stroke="var(--gmaps-admin)"
                strokeWidth={0.75}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              >
                <title>{province.name}</title>
              </path>
            ))
          : null}
      </g>
    );
  }

  const showProvinceNames = provinceLabelsVisible(relativeK);
  const showSaudi = relativeK >= GAZETTEER_ZOOM.saudiAssets;

  return (
    <g className="gazetteer gazetteer-labels" pointerEvents="none">
      {showSaudi
        ? saudiAssets.map((asset) => {
            const p = projected(projector, asset.coord);
            if (!p) return null;
            return (
              <g key={asset.name} transform={`translate(${p.x},${p.y}) scale(${inv})`}>
                <rect
                  x={-3.2}
                  y={-3.2}
                  width={6.4}
                  height={6.4}
                  fill={TOKEN.paper}
                  stroke={TOKEN.hostility}
                  strokeWidth={1.2}
                >
                  <title>{`${asset.name} · ${asset.type}`}</title>
                </rect>
              </g>
            );
          })
        : null}

      {showProvinceNames
        ? provinces.map((province) => {
            const p = projected(projector, province.centroid);
            if (!p) return null;
            return (
              <g key={`prov-${province.id}`} transform={`translate(${p.x},${p.y}) scale(${inv})`}>
                <text className="gazetteer-province-label" textAnchor="middle" dy="0.35em">
                  {province.name}
                </text>
              </g>
            );
          })
        : null}

      {cities.map((city) => {
        if (!cityVisible(relativeK, city.tier, city.capital)) return null;
        const p = projected(projector, city.coord);
        if (!p) return null;
        const major = city.tier >= 3;
        const mid = city.tier === 2;
        const r = major ? 3.4 : mid ? 2.6 : 2.1;
        const klass = major ? "gazetteer-city-t3" : mid ? "gazetteer-city-t2" : "gazetteer-city-t1";
        return (
          <g key={city.id} transform={`translate(${p.x},${p.y}) scale(${inv})`}>
            <circle
              r={r}
              className="gazetteer-city-mark"
              fill={city.capital ? "var(--gmaps-city-major)" : "#fff"}
              stroke="var(--gmaps-city-major)"
              strokeWidth={city.capital ? 1.6 : 1.15}
            >
              <title>{`${city.name}${city.capital ? " · capital" : ""}${city.port ? " · port" : ""}`}</title>
            </circle>
            <text className={`gazetteer-city ${klass}`} x={r + 4} y={4}>
              {city.name}
            </text>
          </g>
        );
      })}
    </g>
  );
}
