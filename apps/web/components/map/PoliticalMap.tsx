"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  CircleMarker,
  GeoJSON,
  ImageOverlay,
  MapContainer,
  Polyline,
  useMap,
} from "react-leaflet";
import type { GeoJsonObject, Feature, FeatureCollection, Geometry } from "geojson";
import type { Layer, Path, PathOptions } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  cameraOf,
  fillForNation,
  periodChartOf,
  type MapMode,
  type TheatreView,
  type TerritoryPaint,
} from "@/lib/theatre-view";

type TheatreFeature = Feature<Geometry, { id: string; nationId: string; name: string }>;

function paintById(view: TheatreView): Map<string, TerritoryPaint> {
  return new Map(view.territories.map((t) => [t.id, t]));
}

function staleOpacity(stale: TerritoryPaint["stale"]): number {
  if (stale === "old") return 0.42;
  if (stale === "stale") return 0.62;
  if (stale === "recent") return 0.85;
  return 1;
}

function politicalStyle(
  paint: TerritoryPaint | undefined,
  selected: boolean,
  mode: MapMode,
  view: TheatreView,
): PathOptions {
  const weight = selected ? 2.4 : 1;
  const color = selected ? "#E7E3D9" : "#0c1218";
  if (!paint || paint.nothingInFile || paint.visual === "blind") {
    return {
      color: selected ? "#E7E3D9" : "#8A6D24",
      weight: selected ? 2.4 : 1,
      dashArray: "5 4",
      fillColor: "#1a242c",
      fillOpacity: mode === "period" ? 0.08 : 0.35,
    };
  }

  let fillColor = fillForNation(paint.controllerId);
  if (mode === "alignment") {
    if (paint.controllerId === view.nationId) fillColor = fillForNation(view.nationId);
    else if (paint.controllerId && view.warIds.includes(paint.controllerId)) fillColor = "#8C332A";
    else if (paint.controllerId && view.allyIds.includes(paint.controllerId)) fillColor = "#2C5A66";
    else fillColor = "#3d444c";
  }
  if (paint.contested) fillColor = "#8A6D24";
  if (paint.visual === "unverified") fillColor = "#8A6D24";

  const fillOpacity =
    mode === "period"
      ? 0.12
      : mode === "intel" && !paint.covered
        ? 0.12
        : paint.visual === "confirmed"
          ? 0.82 * staleOpacity(paint.stale)
          : paint.visual === "probable"
            ? 0.48 * staleOpacity(paint.stale)
            : 0.28;

  return {
    color,
    weight,
    dashArray: paint.visual === "unverified" ? "4 3" : undefined,
    fillColor,
    fillOpacity,
  };
}

function centroidsOf(geo: FeatureCollection): Record<string, [number, number]> {
  const groups: Record<string, Array<[number, number]>> = {};
  const layer = L.geoJSON(geo as GeoJsonObject);
  layer.eachLayer((entry) => {
    const feature = (entry as Layer & { feature?: TheatreFeature }).feature;
    const id = feature?.properties?.id;
    if (!id || !("getBounds" in entry)) return;
    const c = (entry as L.Polygon).getBounds().getCenter();
    (groups[id] ??= []).push([c.lat, c.lng]);
  });
  const out: Record<string, [number, number]> = {};
  for (const [id, pts] of Object.entries(groups)) {
    out[id] = [
      pts.reduce((s, p) => s + p[0], 0) / pts.length,
      pts.reduce((s, p) => s + p[1], 0) / pts.length,
    ];
  }
  return out;
}

function TheatrePanes({ children }: { children: ReactNode }) {
  const map = useMap();
  const panes: Array<[string, string]> = [
    ["theatre-land", "200"],
    ["theatre-period", "250"],
    ["theatre-political", "350"],
    ["theatre-force", "450"],
    ["theatre-names", "500"],
  ];
  for (const [name, z] of panes) {
    if (!map.getPane(name)) {
      const pane = map.createPane(name);
      pane.style.zIndex = z;
    }
  }
  return <>{children}</>;
}

function ZoomBottomLeft() {
  const map = useMap();
  useEffect(() => {
    map.zoomControl?.setPosition("bottomleft");
  }, [map]);
  return null;
}

function FlyToHolding({
  geo,
  selectedId,
  jumpNonce,
}: {
  geo: FeatureCollection;
  selectedId: string | null;
  jumpNonce: number;
}) {
  const map = useMap();
  const seen = useRef(0);
  useEffect(() => {
    if (!selectedId || jumpNonce === 0 || jumpNonce === seen.current) return;
    seen.current = jumpNonce;
    const feats = geo.features.filter((f) => f.properties && (f.properties as { id?: string }).id === selectedId);
    if (feats.length === 0) return;
    const bounds = L.geoJSON({
      type: "FeatureCollection",
      features: feats,
    } as FeatureCollection).getBounds();
    if (!bounds.isValid()) return;
    map.flyToBounds(bounds.pad(0.4), { duration: 0.45, maxZoom: 6 });
  }, [geo, map, selectedId, jumpNonce]);
  return null;
}

function ClickBackground({
  onClear,
  ignoreRef,
}: {
  onClear: () => void;
  ignoreRef: { current: boolean };
}) {
  const map = useMap();
  const onClearRef = useRef(onClear);
  onClearRef.current = onClear;
  useEffect(() => {
    const onClick = () => {
      if (ignoreRef.current) {
        ignoreRef.current = false;
        return;
      }
      onClearRef.current();
    };
    map.on("click", onClick);
    return () => {
      map.off("click", onClick);
    };
  }, [map, ignoreRef]);
  return null;
}

export function PoliticalMap({
  view,
  mode,
  showForce,
  selectedId,
  jumpNonce,
  onSelect,
}: {
  view: TheatreView;
  mode: MapMode;
  showForce: boolean;
  selectedId: string | null;
  jumpNonce: number;
  onSelect: (id: string | null) => void;
}) {
  const camera = cameraOf(view.scenarioId);
  const chart = periodChartOf(view.scenarioId);
  const paints = useMemo(() => paintById(view), [view]);
  const [land, setLand] = useState<FeatureCollection | null>(null);
  const [theatre, setTheatre] = useState<FeatureCollection | null>(null);
  const geoRef = useRef<L.GeoJSON | null>(null);
  const ignoreMapClick = useRef(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/geo/land.geojson").then((r) => r.json() as Promise<FeatureCollection>),
      fetch(`/geo/${view.scenarioId}.geojson`).then((r) => r.json() as Promise<FeatureCollection>),
    ]).then(([landGeo, theatreGeo]) => {
      if (cancelled) return;
      setLand(landGeo);
      setTheatre(theatreGeo);
    });
    return () => {
      cancelled = true;
    };
  }, [view.scenarioId]);

  const styleFn = useCallback(
    (feature?: Feature) => {
      const id = (feature?.properties as { id?: string } | undefined)?.id;
      return politicalStyle(id ? paints.get(id) : undefined, id === selectedId, mode, view);
    },
    [mode, paints, selectedId, view],
  );

  const styleRef = useRef(styleFn);
  styleRef.current = styleFn;
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const paintsRef = useRef(paints);
  paintsRef.current = paints;

  useEffect(() => {
    geoRef.current?.eachLayer((layer) => {
      const feature = (layer as Layer & { feature?: Feature }).feature;
      (layer as Path).setStyle(styleRef.current(feature));
    });
  }, [styleFn]);

  const centers = useMemo(() => (theatre ? centroidsOf(theatre) : {}), [theatre]);

  const nationCenter = useCallback(
    (nationId: string): [number, number] | null => {
      const pts = view.territories
        .filter((t) => t.controllerId === nationId)
        .map((t) => centers[t.id])
        .filter((p): p is [number, number] => Boolean(p));
      if (pts.length === 0) return null;
      return [
        pts.reduce((s, p) => s + p[0], 0) / pts.length,
        pts.reduce((s, p) => s + p[1], 0) / pts.length,
      ];
    },
    [centers, view.territories],
  );

  const onEach = useCallback((feature: Feature, layer: Layer) => {
    const id = (feature.properties as { id?: string } | undefined)?.id;
    if (!id) return;
    layer.on({
      click: (event) => {
        ignoreMapClick.current = true;
        if (event.originalEvent) L.DomEvent.stopPropagation(event.originalEvent);
        onSelectRef.current(id);
      },
      mouseover: (event) => {
        const path = event.target as Path;
        path.setStyle({ weight: 2.4, color: "#E7E3D9" });
      },
      mouseout: (event) => {
        (event.target as Path).setStyle(styleRef.current(feature));
      },
    });
    const paint = paintsRef.current.get(id);
    const tip = paint
      ? `${paint.name} · ${paint.nothingInFile ? "nothing in file" : paint.holderName} · ${paint.visual}`
      : id;
    layer.bindTooltip(tip, { sticky: true, className: "theatre-tip", opacity: 0.96 });
  }, []);

  if (!land || !theatre) {
    return <div className="theatre-loading">Charting the theatre…</div>;
  }

  return (
    <MapContainer
      key={view.scenarioId}
      className="theatre-leaflet"
      center={camera.center}
      zoom={camera.zoom}
      minZoom={camera.minZoom}
      maxZoom={camera.maxZoom}
      zoomSnap={0.25}
      zoomDelta={0.5}
      attributionControl={false}
      zoomControl
      worldCopyJump={false}
    >
      <ZoomBottomLeft />
      <ClickBackground onClear={() => onSelect(null)} ignoreRef={ignoreMapClick} />
      <TheatrePanes>
      <GeoJSON data={land as GeoJsonObject} pane="theatre-land" interactive={false} style={() => ({
        color: "#152028",
        weight: 0.6,
        fillColor: "#243038",
        fillOpacity: 1,
      })} />

      {chart && mode === "period" ? (
        <ImageOverlay url={chart.url} bounds={chart.bounds} opacity={chart.opacity} pane="theatre-period" />
      ) : null}

      <GeoJSON
        ref={geoRef}
        key={view.scenarioId}
        data={theatre as GeoJsonObject}
        pane="theatre-political"
        style={styleFn}
        onEachFeature={onEach}
      />

      {mode === "alignment"
        ? view.alignments.map((link, i) => {
            const a = nationCenter(link.a);
            const b = nationCenter(link.b);
            if (!a || !b) return null;
            return (
              <Polyline
                key={`${link.a}-${link.b}-${i}`}
                positions={[a, b]}
                pathOptions={{
                  color: link.secret ? "#6E3A5E" : "#9ec4c9",
                  weight: link.secret ? 1.2 : 2,
                  dashArray: link.secret ? "3 6" : undefined,
                  opacity: 0.85,
                }}
                pane="theatre-force"
                interactive={false}
              />
            );
          })
        : null}

      {showForce
        ? view.formations.map((mark, i) => {
            const pt = centers[mark.location];
            if (!pt) return null;
            const r = 8 + Math.min(18, mark.weight / 2);
            return (
              <CircleMarker
                key={`${mark.location}-${i}`}
                center={pt}
                radius={r}
                pane="theatre-force"
                interactive={false}
                pathOptions={{
                  color: "#E7E3D9",
                  weight: mark.visual === "confirmed" ? 2 : 1,
                  dashArray: mark.visual === "unverified" ? "3 3" : undefined,
                  fillColor: "#E7E3D9",
                  fillOpacity: 0.08,
                }}
              />
            );
          })
        : null}

      <FlyToHolding geo={theatre} selectedId={selectedId} jumpNonce={jumpNonce} />
      </TheatrePanes>
    </MapContainer>
  );
}
