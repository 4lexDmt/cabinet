"use client";

/**
 * Named gazetteer overlay for the tier1 sheet.
 *
 * Incorporated provinces are dissolved ADM1 polygons — New England is one
 * outline, not six states. Those lines are thinner and paler than the
 * international boundary drawn later in the same sheet. Roads are not
 * drawn. Lakes and rivers are real Natural Earth geometry on the sheet
 * itself, not ellipses or waypoint chords. Labels live in screen pixels
 * and are greedily placed so two names never occupy the same spot.
 */

import { useEffect, useMemo, useState } from "react";
import {
  countries,
  geometryPath,
  cityFontSize,
  cityMarkRadius,
  cityRank,
  cityVisible,
  placeGazetteerLabels,
  provinceBordersVisible,
  provinceLabelsVisible,
  PROVINCE_LABEL_RANK,
  type GazetteerLabelInput,
  type LonLat,
  type Projector,
} from "@cabinet/geo";
import { loadLayer, type LoadedLayer } from "@/lib/atlas/layers";

function projected(projector: Projector, coord: LonLat): { x: number; y: number } | null {
  const [x, y] = projector(coord);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return { x, y };
}

function labelCoord(feature: { properties: Record<string, unknown> }): LonLat | null {
  const raw = feature.properties.label;
  if (Array.isArray(raw) && typeof raw[0] === "number" && typeof raw[1] === "number") {
    return [raw[0], raw[1]];
  }
  return null;
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

  const plate = useMemo(() => countries(), []);

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
          population: city.population,
        })),
      ),
    [plate],
  );

  if (part === "admin") {
    if (!provinceBordersVisible(relativeK)) return null;
    return (
      <g className="gazetteer gazetteer-admin" pointerEvents="visiblePainted">
        {provincePaths.map((province) => (
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
        ))}
      </g>
    );
  }

  const candidates = useMemo(() => {
    const out: GazetteerLabelInput[] = [];
    for (const city of cities) {
      if (!cityVisible(relativeK, city.tier, city.capital)) continue;
      const p = projected(projector, city.coord);
      if (!p) continue;
      out.push({
        id: city.id,
        kind: "city",
        name: city.name,
        x: p.x,
        y: p.y,
        rank: cityRank(city.tier, city.capital, city.population),
        fontSize: cityFontSize(city.tier),
        markRadius: cityMarkRadius(city.tier),
        showMark: true,
        capital: city.capital,
        tier: city.tier,
      });
    }
    if (admin && provinceLabelsVisible(relativeK)) {
      for (const feature of admin.features) {
        const coord = labelCoord(feature);
        if (!coord) continue;
        const p = projected(projector, coord);
        if (!p) continue;
        const name = String(feature.properties.name ?? "");
        const id = String(feature.properties.id ?? name);
        out.push({
          id: `prov-${id}`,
          kind: "province",
          name,
          x: p.x,
          y: p.y,
          rank: PROVINCE_LABEL_RANK,
          fontSize: 9.5,
          markRadius: 0,
          showMark: false,
        });
      }
    }
    return out;
  }, [admin, cities, projector, relativeK]);

  const labels = useMemo(() => placeGazetteerLabels(candidates, cameraK), [candidates, cameraK]);

  return (
    <g className="gazetteer gazetteer-labels" pointerEvents="none">
      {labels.map((label) => (
        <g key={label.id} transform={`translate(${label.x},${label.y}) scale(${inv})`}>
          {label.showMark ? (
            <circle
              r={label.markRadius}
              className="gazetteer-city-mark"
              fill={label.capital ? "var(--gmaps-city-major)" : "#fff"}
              stroke="var(--gmaps-city-major)"
              strokeWidth={label.capital ? 1.5 : 1.1}
            >
              <title>{label.name}</title>
            </circle>
          ) : null}
          <text
            className={
              label.kind === "province"
                ? "gazetteer-province-label"
                : label.tier === 3
                  ? "gazetteer-city gazetteer-city-t3"
                  : label.tier === 2
                    ? "gazetteer-city gazetteer-city-t2"
                    : "gazetteer-city gazetteer-city-t1"
            }
            x={label.dx}
            y={label.dy}
            textAnchor={label.textAnchor}
          >
            {label.name}
          </text>
        </g>
      ))}
    </g>
  );
}
