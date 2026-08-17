#!/usr/bin/env python3
"""
Process raw sources into normalized GeoJSON for the map domain.

This is an OFFLINE build step. It never runs at request time and is never
imported by the app. Run it, commit what it produces, and forget it until a
source revises.

What it produces, into apps/web/public/geo/mapkit/:

  boundaries.geojson   one property per perspective (pov_neutral, pov_in, ...)
  countries.geojson    political polygons, simplified for theatre scale
  countries_low.geojson  the same at 110m, for world frames
  places.geojson       decluttered settlements with tier and min_zoom
  coastline.geojson    physical, shared by every scenario regardless of era
  ocean / lakes / rivers / bathymetry
  maritime_*.geojson   only when the Marine Regions sources are present
  attribution.json     every source and the credit it requires
  territory-manifest.json  the sim <-> geo bridge

Three things this script refuses to do quietly:

  1. Ship a source with no license field.
  2. Default an unrecognised boundary classification to "international".
     Defaulting a disputed line to an agreed one is precisely the error the
     perspective mechanism exists to prevent, so an unmapped value is fatal.
  3. Emit overlapping maritime zones. Marine Regions' EEZ polygons include the
     inner zones; they are differenced out and the result is asserted disjoint.
"""

from __future__ import annotations

import argparse
import json
import math
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable, Iterable

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parent.parent
CACHE = ROOT / ".cache"
OUT = REPO / "apps" / "web" / "public" / "geo" / "mapkit"
SCENARIO_GEO = REPO / "apps" / "web" / "public" / "geo"
SCENARIOS = REPO / "packages" / "scenarios"


# ─────────────────────────────────────────────────────────────────────────────
# Boundary classification — mirrors packages/geo/src/boundary.ts
#
# The two implementations are kept in step by a test that reads this script's
# own output and asserts the Kashmir case: neutral reads line_of_control, Delhi
# reads international, Islamabad reads administrative.
# ─────────────────────────────────────────────────────────────────────────────

PERSPECTIVE_CODES = [
    "ISO", "US", "FR", "RU", "ES", "CN", "TW", "IN", "NP", "PK", "DE", "GB",
    "BR", "IL", "PS", "SA", "EG", "MA", "PT", "AR", "JP", "KO", "VN", "TR",
    "ID", "PL", "GR", "IT", "NL", "SE", "BD", "UA", "TLC",
]


class UnmappedBoundaryValue(Exception):
    pass


def normalize_boundary_class(raw: Any) -> str | None:
    if raw is None:
        return None
    value = re.sub(r"\(.*?\)", "", str(raw)).lower()
    value = re.sub(r"\s+", " ", value).strip()
    if value in ("", "null", "none"):
        return None
    if "line of control" in value:
        return "line_of_control"
    if "unrecognized" in value or "unrecognised" in value:
        return "unrecognized"
    if "disputed" in value or "claim" in value or "breakaway" in value:
        return "disputed"
    if "indefinite" in value or "indeterminant" in value or "elusive" in value:
        return "indefinite"
    if any(
        token in value
        for token in ("admin-1", "admin-0 region", "map unit", "administrative",
                      "lease limit", "overlay limit")
    ):
        return "administrative"
    if "international" in value or "country" in value or "boundary" in value:
        return "international"
    return None


def boundary_perspectives(props: dict[str, Any]) -> dict[str, str]:
    """One property per perspective. NULL means agreement, so it is omitted."""
    unmapped: list[str] = []

    def read(field: str) -> str | None:
        raw = props.get(field, props.get(field.lower()))
        if raw is None or str(raw).strip() == "":
            return None
        cls = normalize_boundary_class(raw)
        if cls is None:
            unmapped.append(f"{field}={raw!r}")
        return cls

    featurecla = read("FEATURECLA")
    neutral = read("FCLASS_ISO") or featurecla or "international"
    out = {"pov_neutral": neutral}
    for code in PERSPECTIVE_CODES:
        if code == "ISO":
            continue
        cls = read(f"FCLASS_{code}")
        if cls:
            out[f"pov_{code.lower()}"] = cls
    if unmapped:
        raise UnmappedBoundaryValue("; ".join(unmapped))
    return out


# ─────────────────────────────────────────────────────────────────────────────
# Geometry helpers. Deterministic, dependency-free.
# ─────────────────────────────────────────────────────────────────────────────


def _perpendicular_distance(p, a, b) -> float:
    (px, py), (ax, ay), (bx, by) = p, a, b
    dx, dy = bx - ax, by - ay
    if dx == 0 and dy == 0:
        return math.hypot(px - ax, py - ay)
    t = ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)
    t = max(0.0, min(1.0, t))
    return math.hypot(px - (ax + t * dx), py - (ay + t * dy))


def simplify(points: list, tolerance: float) -> list:
    """Douglas-Peucker, iterative so a long coastline cannot blow the stack."""
    if tolerance <= 0 or len(points) < 3:
        return points
    keep = [False] * len(points)
    keep[0] = keep[-1] = True
    stack = [(0, len(points) - 1)]
    while stack:
        start, end = stack.pop()
        if end <= start + 1:
            continue
        worst, index = 0.0, -1
        for i in range(start + 1, end):
            d = _perpendicular_distance(points[i], points[start], points[end])
            if d > worst:
                worst, index = d, i
        if worst > tolerance and index != -1:
            keep[index] = True
            stack.append((start, index))
            stack.append((index, end))
    return [p for p, k in zip(points, keep) if k]


def _ring(points: list, tolerance: float, precision: int, closed: bool) -> list | None:
    """
    Simplify, round, dedupe.

    Rounding can collapse a genuinely short segment — a two-point boundary a few
    metres long — into a single point. Dropping it would delete a real border
    without saying so, which is the one thing this pipeline must never do, so
    short geometry is retried at finer precision instead of discarded.
    """
    out = simplify(points, tolerance)
    minimum = 4 if closed else 2
    if len(out) < minimum:
        if len(points) < minimum:
            return None
        out = points[:]

    for attempt in range(3):
        digits = precision + attempt * 3
        rounded = [[round(x, digits), round(y, digits)] for x, y in out]
        deduped = [rounded[0]]
        for point in rounded[1:]:
            if point != deduped[-1]:
                deduped.append(point)
        if closed:
            if len(deduped) < 3:
                continue
            if deduped[0] != deduped[-1]:
                deduped.append(deduped[0])
            if len(deduped) < 4:
                continue
            return deduped
        if len(deduped) >= 2:
            return deduped
    return None


def process_geometry(geom: dict | None, tolerance: float, precision: int) -> dict | None:
    if not geom:
        return None
    kind = geom.get("type")
    coords = geom.get("coordinates")
    if kind == "Point":
        return {"type": kind, "coordinates": [round(coords[0], precision), round(coords[1], precision)]}
    if kind == "MultiPoint":
        return {"type": kind, "coordinates": [[round(x, precision), round(y, precision)] for x, y in coords]}
    if kind == "LineString":
        line = _ring(coords, tolerance, precision, closed=False)
        return {"type": kind, "coordinates": line} if line else None
    if kind == "MultiLineString":
        lines = [line for line in (_ring(c, tolerance, precision, False) for c in coords) if line]
        return {"type": kind, "coordinates": lines} if lines else None
    if kind == "Polygon":
        rings = [r for r in (_ring(c, tolerance, precision, True) for c in coords) if r]
        return {"type": kind, "coordinates": rings} if rings else None
    if kind == "MultiPolygon":
        polygons = []
        for polygon in coords:
            rings = [r for r in (_ring(c, tolerance, precision, True) for c in polygon) if r]
            if rings:
                polygons.append(rings)
        return {"type": kind, "coordinates": polygons} if polygons else None
    if kind == "GeometryCollection":
        parts = [g for g in (process_geometry(g, tolerance, precision) for g in geom.get("geometries", [])) if g]
        return {"type": kind, "geometries": parts} if parts else None
    return geom


def each_position(geom: dict | None) -> Iterable[tuple[float, float]]:
    if not geom:
        return
    if geom["type"] == "GeometryCollection":
        for part in geom.get("geometries", []):
            yield from each_position(part)
        return
    stack: list[Any] = [geom.get("coordinates")]
    while stack:
        node = stack.pop()
        if not isinstance(node, list):
            continue
        if node and isinstance(node[0], (int, float)):
            yield (node[0], node[1])
        else:
            stack.extend(node)


def bbox_of(geom: dict | None) -> list[float] | None:
    xs, ys = [], []
    for x, y in each_position(geom):
        xs.append(x)
        ys.append(y)
    if not xs:
        return None
    return [round(min(xs), 4), round(min(ys), 4), round(max(xs), 4), round(max(ys), 4)]


def centroid_of(geom: dict | None) -> list[float] | None:
    """Area-weighted for polygons so slivers do not drag the label off the mass."""
    if not geom:
        return None
    rings: list[list] = []
    if geom["type"] == "Polygon":
        rings = geom["coordinates"][:1]
    elif geom["type"] == "MultiPolygon":
        rings = [poly[0] for poly in geom["coordinates"] if poly]
    if rings:
        total, cx, cy = 0.0, 0.0, 0.0
        for ring in rings:
            for i in range(len(ring)):
                ax, ay = ring[i - 1]
                bx, by = ring[i]
                cross = ax * by - bx * ay
                total += cross
                cx += (ax + bx) * cross
                cy += (ay + by) * cross
        if total != 0:
            return [round(cx / (3 * total), 4), round(cy / (3 * total), 4)]
    positions = list(each_position(geom))
    if not positions:
        return None
    return [
        round(sum(p[0] for p in positions) / len(positions), 4),
        round(sum(p[1] for p in positions) / len(positions), 4),
    ]


# ─────────────────────────────────────────────────────────────────────────────
# I/O
# ─────────────────────────────────────────────────────────────────────────────


def load_manifest() -> dict:
    manifest = json.loads((ROOT / "sources.json").read_text())
    unlicensed = [s["id"] for s in manifest["sources"] if not s.get("license")]
    if unlicensed:
        raise SystemExit(f"build: FAIL — sources with no license field: {unlicensed}")
    uncredited = [
        s["id"]
        for s in manifest["sources"]
        if s.get("attribution_required") and not s.get("attribution")
    ]
    if uncredited:
        raise SystemExit(f"build: FAIL — attribution required but not recorded: {uncredited}")
    return manifest


def read_source(source_id: str) -> dict | None:
    path = CACHE / f"{source_id}.geojson"
    if not path.exists():
        return None
    return json.loads(path.read_text())


def write_layer(name: str, features: list[dict], note: str) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    payload = {
        "type": "FeatureCollection",
        "note": note,
        "features": features,
    }
    path = OUT / f"{name}.geojson"
    path.write_text(json.dumps(payload, separators=(",", ":"), ensure_ascii=False))
    size = path.stat().st_size
    print(f"build: {name:22s} {len(features):6d} features  {size / 1024:8.1f} KB")


def num(value: Any, fallback: float = 0) -> float:
    try:
        if value is None:
            return fallback
        return float(value)
    except (TypeError, ValueError):
        return fallback


def prop(props: dict, *names: str, default: Any = None) -> Any:
    for name in names:
        if name in props and props[name] is not None:
            return props[name]
        lower = name.lower()
        if lower in props and props[lower] is not None:
            return props[lower]
    return default


# ─────────────────────────────────────────────────────────────────────────────
# Layers
# ─────────────────────────────────────────────────────────────────────────────


def build_boundaries() -> int:
    raw = read_source("ne_10m_admin_0_boundary_lines_land")
    if not raw:
        print("build: boundaries — source missing, run ./fetch.sh", file=sys.stderr)
        return 0

    features: list[dict] = []
    unmapped: list[str] = []
    dropped: list[int] = []
    for index, feature in enumerate(raw["features"]):
        props = feature.get("properties") or {}
        try:
            pov = boundary_perspectives(props)
        except UnmappedBoundaryValue as error:
            unmapped.append(f"feature {index}: {error}")
            continue
        geometry = process_geometry(feature.get("geometry"), tolerance=0.012, precision=4)
        if not geometry:
            dropped.append(index)
            continue
        out = {
            "type": "Feature",
            "id": f"b{index}",
            "properties": {
                "id": f"b{index}",
                "name": prop(props, "NAME", default=None),
                "adm0_a": prop(props, "ADM0_A3_L", "adm0_left", default=None),
                "adm0_b": prop(props, "ADM0_A3_R", "adm0_right", default=None),
                **pov,
            },
            "geometry": geometry,
        }
        features.append(out)

    if unmapped:
        raise SystemExit(
            "build: FAIL — unrecognised boundary classifications. Defaulting these\n"
            "to `international` would turn a contested line into an agreed one, so\n"
            "the pipeline stops instead. Extend normalize_boundary_class:\n  "
            + "\n  ".join(unmapped)
        )
    if dropped:
        raise SystemExit(
            f"build: FAIL — {len(dropped)} boundary segments produced no geometry "
            f"(source indices {dropped[:12]}). A border that disappears without a "
            "reason is worse than a coarse one; loosen the precision rather than "
            "letting it go."
        )

    disputed = sum(1 for f in features if len([k for k in f["properties"] if k.startswith("pov_")]) > 1)
    write_layer(
        "boundaries",
        features,
        "Natural Earth 10m admin-0 boundary lines. One property per perspective; "
        "absence of a pov_* key means that government accepts the neutral reading.",
    )
    print(f"build:   {disputed} segments carry at least one dissenting perspective")
    return len(features)


def build_countries(source_id: str, name: str, tolerance: float) -> int:
    raw = read_source(source_id)
    if not raw:
        print(f"build: {name} — source missing, run ./fetch.sh", file=sys.stderr)
        return 0
    features = []
    for feature in raw["features"]:
        props = feature.get("properties") or {}
        geometry = process_geometry(feature.get("geometry"), tolerance=tolerance, precision=3)
        if not geometry:
            continue
        iso = prop(props, "ISO_A2_EH", "ISO_A2", default=None)
        features.append(
            {
                "type": "Feature",
                "id": prop(props, "ADM0_A3", "SOV_A3", default=None),
                "properties": {
                    "name": prop(props, "NAME", "ADMIN", default="—"),
                    "name_long": prop(props, "NAME_LONG", "ADMIN", default=None),
                    "iso_a2": None if iso in ("-99", -99) else iso,
                    "iso_a3": prop(props, "ADM0_A3", default=None),
                    "continent": prop(props, "CONTINENT", default=None),
                    "region": prop(props, "SUBREGION", "REGION_UN", default=None),
                },
                "geometry": geometry,
            }
        )
    write_layer(name, features, "Natural Earth admin-0 countries, simplified for theatre scale.")
    return len(features)


PLACE_TIER_NOTE = (
    "Natural Earth populated places. Ranking is editorial, not population-driven — "
    "Washington DC outranks larger cities because it anchors a metro and is a world "
    "city. Trust rank over POP_MAX."
)


def place_tier(props: dict) -> str:
    if num(prop(props, "ADM0CAP", default=0)) == 1:
        return "capital"
    if num(prop(props, "WORLDCITY", default=0)) == 1 or num(prop(props, "MEGACITY", default=0)) == 1:
        return "world_city"
    rank = num(prop(props, "RANK_MAX", default=None), num(prop(props, "SCALERANK", default=10), 10))
    if rank >= 12:
        return "major"
    if rank >= 8:
        return "regional"
    return "minor"


def build_places(scalerank_max: int = 6) -> int:
    raw = read_source("ne_50m_populated_places")
    if not raw:
        print("build: places — source missing, run ./fetch.sh", file=sys.stderr)
        return 0
    features = []
    for feature in raw["features"]:
        props = feature.get("properties") or {}
        scalerank = num(prop(props, "SCALERANK", default=10), 10)
        if scalerank > scalerank_max:
            continue
        geometry = process_geometry(feature.get("geometry"), tolerance=0, precision=4)
        if not geometry:
            continue
        labelrank = num(prop(props, "LABELRANK", default=scalerank), scalerank)
        min_zoom = num(prop(props, "MIN_ZOOM", "min_zoom", default=scalerank), scalerank)
        min_label = max(min_zoom, num(prop(props, "MIN_LABEL", "min_label", default=labelrank), labelrank))
        features.append(
            {
                "type": "Feature",
                "properties": {
                    "name": prop(props, "NAME", "NAMEASCII", default="—"),
                    "tier": place_tier(props),
                    "rank": int(scalerank * 10 + labelrank),
                    "min_zoom": round(min_zoom, 2),
                    "min_label": round(min_label, 2),
                    "iso_a2": prop(props, "ISO_A2", default=None),
                    "adm0": prop(props, "ADM0NAME", default=None),
                    "adm1": prop(props, "ADM1NAME", default=None),
                    "capital": int(num(prop(props, "ADM0CAP", default=0)) == 1),
                },
                "geometry": geometry,
            }
        )
    features.sort(key=lambda f: (f["properties"]["rank"], f["properties"]["name"]))
    write_layer("places", features, PLACE_TIER_NOTE)
    return len(features)


def build_physical(source_id: str, name: str, tolerance: float, keep: Callable[[dict], bool] | None = None,
                   properties: Callable[[dict], dict] | None = None) -> int:
    raw = read_source(source_id)
    if not raw:
        print(f"build: {name} — source missing, skipped", file=sys.stderr)
        return 0
    features = []
    for feature in raw["features"]:
        props = feature.get("properties") or {}
        if keep and not keep(props):
            continue
        geometry = process_geometry(feature.get("geometry"), tolerance=tolerance, precision=3)
        if not geometry:
            continue
        features.append(
            {
                "type": "Feature",
                "properties": properties(props) if properties else {},
                "geometry": geometry,
            }
        )
    write_layer(name, features, "Natural Earth physical. Shared by every scenario regardless of era.")
    return len(features)


# ─────────────────────────────────────────────────────────────────────────────
# Maritime — only when the Marine Regions sources have been placed in .cache
# ─────────────────────────────────────────────────────────────────────────────


def build_maritime() -> int:
    """
    Difference the published zones into a mutually exclusive ladder:

        eez_only = eez − (territorial ∪ contiguous ∪ internal ∪ archipelagic)

    Marine Regions' EEZ deliberately includes the inner zones, so stacking the
    published layers double-renders them. The result is asserted disjoint before
    it is written; a pipeline that emits overlapping zones is worse than one
    that emits none, because the overlap is invisible until someone measures an
    area and finds it wrong.
    """
    layers = {
        "internal": "marineregions_internal_waters_v4",
        "archipelagic": "marineregions_archipelagic_v4",
        "territorial": "marineregions_territorial_seas_v4",
        "contiguous": "marineregions_contiguous_v4",
        "eez": "marineregions_eez_v12",
    }
    present = {zone: read_source(sid) for zone, sid in layers.items()}
    if not any(present.values()):
        print(
            "build: maritime — Marine Regions sources absent (they need a form\n"
            "       submission, see README.md). Skipping the maritime stack; the\n"
            "       renderer computes territorial seas by equidistance meanwhile."
        )
        return 0

    try:
        from shapely.geometry import mapping, shape
        from shapely.ops import unary_union
    except ImportError:
        raise SystemExit(
            "build: FAIL — maritime differencing needs shapely.\n"
            "       pip install shapely, or remove the Marine Regions sources from .cache."
        )

    def union_of(zone: str):
        raw = present.get(zone)
        if not raw:
            return None
        geoms = [shape(f["geometry"]) for f in raw["features"] if f.get("geometry")]
        return unary_union([g.buffer(0) for g in geoms]) if geoms else None

    unions = {zone: union_of(zone) for zone in layers}
    # Archipelagic waters carry the same sovereignty as internal waters, so they
    # are folded together for rendering while remaining separate at the source.
    if unions["archipelagic"] is not None:
        unions["internal"] = (
            unary_union([unions["internal"], unions["archipelagic"]])
            if unions["internal"] is not None
            else unions["archipelagic"]
        )

    order = ["internal", "territorial", "contiguous", "eez"]
    differenced: dict[str, Any] = {}
    accumulated = None
    for zone in order:
        geom = unions.get(zone)
        if geom is None:
            continue
        only = geom.difference(accumulated) if accumulated is not None else geom
        differenced[zone] = only
        accumulated = unary_union([accumulated, geom]) if accumulated is not None else geom

    zones = list(differenced)
    for i, a in enumerate(zones):
        for b in zones[i + 1:]:
            overlap = differenced[a].intersection(differenced[b])
            if not overlap.is_empty and overlap.area > 1e-9:
                raise SystemExit(
                    f"build: FAIL — {a} and {b} overlap by {overlap.area:.6f} sq deg after "
                    "differencing. The zone ladder must be mutually exclusive."
                )

    total = 0
    for zone, geom in differenced.items():
        feature = {
            "type": "Feature",
            "properties": {"zone": zone},
            "geometry": process_geometry(mapping(geom), tolerance=0.02, precision=3),
        }
        write_layer(f"maritime_{zone}", [feature], f"Marine Regions {zone}, differenced disjoint.")
        total += 1

    sovereign = unary_union([differenced[z] for z in ("internal", "territorial") if z in differenced])
    write_layer(
        "sovereign_waters",
        [{"type": "Feature", "properties": {"zone": "sovereign"},
          "geometry": process_geometry(mapping(sovereign), tolerance=0.02, precision=3)}],
        "internal + archipelagic + territorial. This is what counts as national "
        "territory at sea, and what sovereign airspace derives from. NOT the EEZ.",
    )
    return total + 1


# ─────────────────────────────────────────────────────────────────────────────
# The sim <-> geo bridge
# ─────────────────────────────────────────────────────────────────────────────


def build_territory_manifest() -> int:
    """
    Every territory in every scenario needs a geometry entry.

    The test that enforces this currently reports a gap, and that is the point:
    most scenarios carry one territory per nation while the geojson has richer
    geometry. Reconciling them is real work, and the manifest tells you its size
    rather than letting it stay invisible.
    """
    scenarios: dict[str, list[dict]] = {}
    for path in sorted(SCENARIO_GEO.glob("*.geojson")):
        if path.stem in ("land",) or path.parent.name == "mapkit":
            continue
        raw = json.loads(path.read_text())
        entries: dict[str, dict] = {}
        for feature in raw.get("features", []):
            props = feature.get("properties") or {}
            territory_id = props.get("id")
            if not territory_id:
                continue
            geometry = feature.get("geometry")
            box = bbox_of(geometry)
            centre = centroid_of(geometry)
            if not box or not centre:
                continue
            existing = entries.get(territory_id)
            if existing:
                existing["bbox"] = [
                    min(existing["bbox"][0], box[0]),
                    min(existing["bbox"][1], box[1]),
                    max(existing["bbox"][2], box[2]),
                    max(existing["bbox"][3], box[3]),
                ]
                continue
            entries[territory_id] = {
                "territoryId": territory_id,
                "featureId": f"{path.stem}:{territory_id}",
                "centroid": centre,
                "bbox": box,
            }
        if entries:
            scenarios[path.stem] = [entries[k] for k in sorted(entries)]

    manifest = {
        "generatedFrom": "infra/tiles/build.py",
        "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "scenarios": scenarios,
    }
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "territory-manifest.json").write_text(json.dumps(manifest, separators=(",", ":")))
    covered = sum(len(v) for v in scenarios.values())
    print(f"build: territory-manifest    {len(scenarios)} scenarios, {covered} territories")
    return covered


def write_attribution(manifest: dict) -> None:
    entries = []
    for source in manifest["sources"]:
        path = CACHE / f"{source['id']}.geojson"
        entries.append(
            {
                "id": source["id"],
                "layer": source["layer"],
                "version": source["version"],
                "license": source["license"],
                "attribution": source["attribution"],
                "required": bool(source.get("attribution_required")),
                "shareAlike": bool(source.get("share_alike")),
                "used": path.exists(),
            }
        )
    payload = {
        "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "note": (
            "ODbL share-alike applies to derived DATABASES. Rendered tiles and images "
            "are a Produced Work and do not trigger it, but the tile data itself may. "
            "Keep Overture/OSM-derived layers as a separately attributed basemap and "
            "keep game state — territories, control, beliefs — in a layer of our own."
        ),
        "sources": entries,
        "rejected": manifest.get("rejected", []),
    }
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "attribution.json").write_text(json.dumps(payload, indent=2))
    required = [e["id"] for e in entries if e["required"] and e["used"]]
    print(f"build: attribution.json      {len(entries)} sources, {len(required)} require credit")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--only", nargs="*", help="build only these layers")
    args = parser.parse_args()
    wanted = set(args.only) if args.only else None

    def want(name: str) -> bool:
        return wanted is None or name in wanted

    manifest = load_manifest()
    print(f"build: manifest retrieved {manifest['retrieved']}, {len(manifest['sources'])} sources")

    if want("boundaries"):
        build_boundaries()
    if want("countries"):
        build_countries("ne_50m_admin_0_countries", "countries", tolerance=0.05)
        build_countries("ne_110m_admin_0_countries", "countries_low", tolerance=0.12)
    if want("places"):
        build_places()
    if want("physical"):
        build_physical("ne_50m_coastline", "coastline", tolerance=0.03)
        build_physical("ne_50m_ocean", "ocean", tolerance=0.08)
        build_physical(
            "ne_50m_lakes", "lakes", tolerance=0.03,
            keep=lambda p: num(prop(p, "scalerank", default=10), 10) <= 3,
            properties=lambda p: {"name": prop(p, "name", default=None)},
        )
        build_physical(
            "ne_50m_rivers_lake_centerlines", "rivers", tolerance=0.03,
            keep=lambda p: num(prop(p, "scalerank", default=10), 10) <= 4,
            properties=lambda p: {
                "name": prop(p, "name", default=None),
                "width": round(num(prop(p, "strokeweig", "strokeweight", default=1), 1), 2),
            },
        )
        build_physical("ne_10m_bathymetry_K_200", "bathymetry", tolerance=0.06)
    if want("maritime"):
        build_maritime()
    if want("manifest"):
        build_territory_manifest()

    write_attribution(manifest)
    return 0


if __name__ == "__main__":
    sys.exit(main())
