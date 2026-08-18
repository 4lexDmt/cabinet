#!/usr/bin/env python3
"""
Build the Stage 1 Eastern Europe / Black Sea dataset.

Provinces, cities, and the integer corridor graph are our layer (geoBoundaries
CC BY, GeoNames CC BY, WPI public domain, OurAirports CC0). Roads and rail are
a separately attributed ODbL basemap and are never dissolved into game state.
"""

from __future__ import annotations

import csv
import json
import math
import re
import sys
import unicodedata
from collections import defaultdict
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parent.parent
CACHE = ROOT / ".cache"
OUT = REPO / "apps" / "web" / "public" / "geo" / "mapkit"
CONFIG = ROOT / "config" / "nations.json"

try:
    from shapely.geometry import LineString, MultiPolygon, Point, Polygon, mapping, shape
    from shapely.ops import unary_union
except ImportError as error:  # pragma: no cover
    raise SystemExit("build_world: shapely is required. pip install shapely") from error


def load_json(path: Path) -> dict:
    return json.loads(path.read_text())


def fold_name(value: str) -> str:
    text = unicodedata.normalize("NFKD", value)
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    text = text.lower()
    text = re.sub(
        r"\b(oblast|krai|kraj|province|il|governorate|county|judet|județ|region|republic|autonomous|okruh|okrug|city|municipality|of|the|raion|voivodeship|voivodship)\b",
        "",
        text,
    )
    return re.sub(r"[^a-z0-9]", "", text)


def slug(value: str) -> str:
    text = unicodedata.normalize("NFKD", value)
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    text = text.replace("ł", "l").replace("Ł", "l").replace("đ", "d").replace("Đ", "d")
    text = re.sub(r"[^a-z0-9]+", "", text.lower())
    return text[:48] or "unnamed"


def haversine_km(a: tuple[float, float], b: tuple[float, float]) -> float:
    lon1, lat1 = a
    lon2, lat2 = b
    p = math.pi / 180
    dlat = (lat2 - lat1) * p
    dlon = (lon2 - lon1) * p
    h = math.sin(dlat / 2) ** 2 + math.cos(lat1 * p) * math.cos(lat2 * p) * math.sin(dlon / 2) ** 2
    return 6371 * 2 * math.asin(min(1, math.sqrt(h)))


def ticks_for(km: float, km_per_tick: float, floor: int = 1) -> int:
    return max(floor, int(round(km / km_per_tick)))


def geom_valid(geom: Any) -> Any:
    if geom.is_empty:
        return None
    if not geom.is_valid:
        geom = geom.buffer(0)
    if geom.is_empty:
        return None
    return geom


def feature_geom(feature: dict) -> Any | None:
    raw = feature.get("geometry")
    if not raw:
        return None
    try:
        return geom_valid(shape(raw))
    except Exception:
        return None


def load_adm1(iso3: str) -> list[dict]:
    path = CACHE / f"geoboundaries_{iso3}_ADM1.geojson"
    if not path.exists():
        raise SystemExit(f"build_world: FAIL — missing {path.name}; run python3 fetch_world.py")
    data = load_json(path)
    return data.get("features") or []


def name_of(props: dict) -> str:
    for key in ("shapeName", "shapeGroup", "name", "NAME_1", "NAME", "admin1Name"):
        value = props.get(key)
        if value:
            return str(value)
    return "unnamed"


def contested_of(roster: dict, folded: str) -> dict | None:
    for case in roster.get("contested", []):
        if folded in case["match"] or any(folded.startswith(m) or m in folded for m in case["match"]):
            return case
    return None


def group_of(roster: dict, iso3: str, folded: str) -> str | None:
    groups = roster.get("aggregation", {}).get(iso3, {})
    for group_name, members in groups.items():
        if folded in members or any(folded.startswith(m) or m in folded for m in members):
            return group_name
    return None


def bbox_intersects(geom: Any, west: float, south: float, east: float, north: float) -> bool:
    minx, miny, maxx, maxy = geom.bounds
    return not (maxx < west or minx > east or maxy < south or miny > north)


def collect_provinces(roster: dict) -> list[dict]:
    west, south, east, north = roster["theatre"]["bbox"]
    clip = Polygon([(west, south), (east, south), (east, north), (west, north)])
    out: list[dict] = []
    seen_contested: set[str] = set()
    rus_contested: list[tuple[str, Any, dict]] = []

    for iso3 in roster["theatre"]["iso3"]:
        nation = next(n for n in roster["nations"] if n["iso3"] == iso3)
        recipe = nation["adm"]
        buckets: dict[str, list[Any]] = defaultdict(list)
        leftover: list[tuple[str, Any]] = []
        raw_kept: list[tuple[str, Any, dict | None]] = []

        for feature in load_adm1(iso3):
            geom = feature_geom(feature)
            if geom is None or not bbox_intersects(geom, west, south, east, north):
                continue
            clipped = geom_valid(geom.intersection(clip))
            if clipped is None:
                continue
            nm = name_of(feature.get("properties") or {})
            folded = fold_name(nm)
            case = contested_of(roster, folded)
            if iso3 == "RUS" and case:
                # World truth is Ukrainian geography. Keep the Russian polygon
                # only as a backfill if Ukraine's ADM1 file omitted it.
                rus_contested.append((nm, clipped, case))
                continue
            if case:
                raw_kept.append((nm, clipped, case))
                continue
            if recipe in ("federal_districts", "nuts1", "development_regions"):
                group = group_of(roster, iso3, folded)
                if group:
                    buckets[group].append(clipped)
                else:
                    leftover.append((nm, clipped))
            else:
                raw_kept.append((nm, clipped, None))

        # Name-map misses merge into the nearest named group so Turkey/Romania/
        # Russia cannot exceed the roster cap by leaking raw ADM1.
        if leftover and buckets:
            centroids = {key: unary_union(geoms).centroid for key, geoms in buckets.items() if geoms}
            for _nm, geom in leftover:
                nearest = min(centroids, key=lambda key: centroids[key].distance(geom.centroid))
                buckets[nearest].append(geom)
        else:
            for nm, geom in leftover:
                buckets[nm].append(geom)

        for nm, geom, case in raw_kept:
            pid = f"{iso3.lower()}-{slug(case['id'] if case else nm)}"
            if case:
                if case["id"] in seen_contested:
                    continue
                seen_contested.add(case["id"])
                pid = f"ukr-{case['id']}"
            out.append(make_province(pid, case["id"].title() if case else nm, "UKR" if case else iso3, geom, nation, case))

        for group_name, geoms in buckets.items():
            merged = geom_valid(unary_union(geoms))
            if merged is None:
                continue
            pid = f"{iso3.lower()}-{slug(group_name)}"
            out.append(make_province(pid, group_name, iso3, merged, nation, None))

    ukr_nation = next(n for n in roster["nations"] if n["iso3"] == "UKR")
    for _nm, geom, case in rus_contested:
        if case["id"] in seen_contested:
            continue
        seen_contested.add(case["id"])
        out.append(make_province(f"ukr-{case['id']}", case["id"].title(), "UKR", geom, ukr_nation, case))

    if len(out) < 10:
        raise SystemExit(f"build_world: FAIL — only {len(out)} provinces; ADM1 join is broken")
    return out


def make_province(pid: str, name: str, iso3: str, geom: Any, nation: dict, contested: dict | None) -> dict:
    props = {
        "id": pid,
        "name": name,
        "iso3": iso3,
        "tier": nation["tier"],
        "contested": bool(contested),
    }
    if contested:
        props["contested_id"] = contested["id"]
        props["neutral_controller"] = contested["neutral_controller"]
        if contested.get("pov_ua_label"):
            props["pov_ua"] = contested["pov_ua_label"]
        if contested.get("pov_ru_label"):
            props["pov_ru"] = contested["pov_ru_label"]
    centroid = geom.representative_point()
    return {
        "type": "Feature",
        "properties": props,
        "geometry": mapping(geom.simplify(0.02, preserve_topology=True)),
        "_geom": geom,
        "_centroid": (centroid.x, centroid.y),
    }


def assign_cities(roster: dict, provinces: list[dict]) -> list[dict]:
    path = CACHE / "geonames_cities15000.txt"
    if not path.exists():
        raise SystemExit("build_world: FAIL — missing geonames_cities15000.txt")
    west, south, east, north = roster["theatre"]["bbox"]
    iso2 = {n["iso3"]: n["iso2"] for n in roster["nations"]}
    wanted = {iso2[i] for i in roster["theatre"]["iso3"]}
    prepared = [(p, p["_geom"]) for p in provinces]
    by_province: dict[str, list[dict]] = defaultdict(list)

    with path.open(encoding="utf-8") as handle:
        for line in handle:
            parts = line.rstrip("\n").split("\t")
            if len(parts) < 15:
                continue
            cc = parts[8]
            if cc not in wanted:
                continue
            lon, lat = float(parts[5]), float(parts[4])
            if lon < west or lon > east or lat < south or lat > north:
                continue
            pop = int(parts[14] or 0)
            code = parts[7]
            point = Point(lon, lat)
            host = None
            for province, geom in prepared:
                if geom.contains(point) or geom.touches(point):
                    host = province
                    break
            if host is None:
                continue
            by_province[host["properties"]["id"]].append(
                {
                    "name": parts[1],
                    "ascii": parts[2],
                    "lon": lon,
                    "lat": lat,
                    "population": pop,
                    "feature_code": code,
                    "province_id": host["properties"]["id"],
                    "iso3": host["properties"]["iso3"],
                }
            )

    cities: list[dict] = []
    for province in provinces:
        pid = province["properties"]["id"]
        candidates = by_province.get(pid, [])
        if not candidates:
            lon, lat = province["_centroid"]
            candidates = [
                {
                    "name": province["properties"]["name"],
                    "ascii": province["properties"]["name"],
                    "lon": lon,
                    "lat": lat,
                    "population": 0,
                    "feature_code": "PPLA",
                    "province_id": pid,
                    "iso3": province["properties"]["iso3"],
                }
            ]
        seats = [c for c in candidates if c["feature_code"] in {"PPLC", "PPLA", "PPLA2"}]
        seats.sort(key=lambda c: -c["population"])
        rest = [c for c in candidates if c not in seats]
        rest.sort(key=lambda c: -c["population"])
        chosen = []
        if seats:
            chosen.append(seats[0])
        else:
            chosen.append(rest[0])
            rest = rest[1:]
        for extra in rest:
            if len(chosen) >= 3:
                break
            if extra["population"] >= 80_000:
                chosen.append(extra)
        for city in chosen:
            cities.append(
                {
                    "type": "Feature",
                    "properties": {
                        "id": f"city-{slug(city['ascii'] or city['name'])}-{pid}",
                        "name": city["name"],
                        "province_id": pid,
                        "iso3": city["iso3"],
                        "population": city["population"],
                        "seat": city["feature_code"] in {"PPLC", "PPLA", "PPLA2"},
                    },
                    "geometry": {"type": "Point", "coordinates": [round(city["lon"], 4), round(city["lat"], 4)]},
                }
            )
    return cities


def parse_gauge(raw: str | None) -> int | None:
    if not raw:
        return None
    match = re.search(r"(\d{3,4})", raw)
    return int(match.group(1)) if match else None


def osm_lines(bbox: list[float] | None = None) -> tuple[list[dict], list[dict]]:
    roads_path = CACHE / "osm_slice_roads.geojson"
    rails_path = CACHE / "osm_slice_rail.geojson"
    clip = None
    if bbox:
        west, south, east, north = bbox
        clip = Polygon([(west, south), (east, south), (east, north), (west, north)])
    if roads_path.exists() and rails_path.exists():
        return _features_to_lines(load_json(roads_path).get("features") or [], "road", clip), _features_to_lines(
            load_json(rails_path).get("features") or [], "rail", clip
        )

    paths: list[Path] = []
    manifest_path = CACHE / "osm_slice_transport.json"
    if manifest_path.exists():
        payload = load_json(manifest_path)
        if payload.get("tiles"):
            paths = [CACHE / name for name in payload["tiles"]]
        elif payload.get("elements"):
            paths = [manifest_path]
    if not paths:
        paths = sorted(CACHE.glob("osm_slice_tile_*.json"))
    if not paths:
        raise SystemExit("build_world: FAIL — missing osm_slice_roads.geojson; run python3 fetch_world.py")
    roads: list[dict] = []
    rails: list[dict] = []
    seen: set[int] = set()
    for path in paths:
        if not path.exists():
            raise SystemExit(f"build_world: FAIL — missing {path.name}")
        payload = load_json(path)
        for element in payload.get("elements", []):
            eid = int(element.get("id", -1))
            if eid in seen:
                continue
            seen.add(eid)
            geom = element.get("geometry") or []
            if len(geom) < 2:
                continue
            coords = [[n["lon"], n["lat"]] for n in geom if "lon" in n and "lat" in n]
            if len(coords) < 2:
                continue
            tags = element.get("tags") or {}
            highway = tags.get("highway")
            railway = tags.get("railway")
            line = {"type": "LineString", "coordinates": coords}
            if railway == "rail" and not tags.get("service"):
                gauge = parse_gauge(tags.get("gauge"))
                rails.append(
                    {
                        "type": "Feature",
                        "properties": {
                            "id": f"rail-{element.get('id')}",
                            "name": tags.get("name"),
                            "usage": tags.get("usage") or "main",
                            "gauge": gauge,
                            "electrified": tags.get("electrified"),
                        },
                        "geometry": line,
                        "_geom": LineString(coords),
                        "_gauge": gauge,
                    }
                )
            elif highway in {"motorway", "trunk", "primary"}:
                klass = "strategic" if highway in {"motorway", "trunk"} else "primary"
                roads.append(
                    {
                        "type": "Feature",
                        "properties": {
                            "id": f"road-{element.get('id')}",
                            "name": tags.get("name"),
                            "class": klass,
                        },
                        "geometry": line,
                        "_geom": LineString(coords),
                    }
                )
    return roads, rails


def _features_to_lines(features: list[dict], kind: str, clip: Any | None = None) -> list[dict]:
    out: list[dict] = []
    for feature in features:
        geom = feature_geom(feature)
        if geom is None:
            continue
        if clip is not None:
            geom = geom_valid(geom.intersection(clip))
            if geom is None:
                continue
        if geom.geom_type == "MultiLineString":
            parts = list(geom.geoms)
        elif geom.geom_type == "LineString":
            parts = [geom]
        elif geom.geom_type == "GeometryCollection":
            parts = [g for g in geom.geoms if g.geom_type in {"LineString", "MultiLineString"}]
            extra = []
            for part in parts:
                extra.extend(list(part.geoms) if part.geom_type == "MultiLineString" else [part])
            parts = extra
        else:
            continue
        props = dict(feature.get("properties") or {})
        for i, part in enumerate(parts):
            if part.is_empty or part.length < 0.002:
                continue
            item = {
                "type": "Feature",
                "properties": {**props, "id": f"{props.get('id', kind)}-{i}"},
                "geometry": mapping(part),
                "_geom": part,
            }
            if kind == "rail":
                item["_gauge"] = props.get("gauge")
            out.append(item)
    return out


GAUGE_BY_ISO3 = {"RUS": 1520, "UKR": 1520, "POL": 1435, "TUR": 1435, "ROU": 1435}
MAX_LAYER_BYTES = 600_000


def infer_rail_gauge(rails: list[dict], provinces: list[dict]) -> list[dict]:
    """Fill untagged OSM gauge from the host nation's family (1520 vs 1435)."""
    from shapely import STRtree

    geoms = [p["_geom"] for p in provinces]
    tree = STRtree(geoms)
    for rail in rails:
        if rail.get("_gauge"):
            continue
        hits = tree.query(rail["_geom"])
        host = None
        for index in hits:
            province = provinces[int(index)]
            if province["_geom"].intersects(rail["_geom"]):
                host = province
                break
        if host is None:
            continue
        gauge = GAUGE_BY_ISO3.get(host["properties"]["iso3"])
        if not gauge:
            continue
        rail["_gauge"] = gauge
        rail["properties"]["gauge"] = gauge
    return rails


def cap_line_layer(features: list[dict], tolerances: list[float]) -> list[dict]:
    current = features
    for tolerance in tolerances:
        encoded = json.dumps({"features": drop_private(current)}, separators=(",", ":"))
        if len(encoded.encode()) <= MAX_LAYER_BYTES:
            return current
        current = simplify_lines(current, tolerance)
    encoded = json.dumps({"features": drop_private(current)}, separators=(",", ":"))
    if len(encoded.encode()) > MAX_LAYER_BYTES:
        current = [f for f in current if f["properties"].get("class") != "primary"]
    return current


def simplify_lines(features: list[dict], tolerance: float) -> list[dict]:
    out = []
    for feature in features:
        geom = feature["_geom"].simplify(tolerance, preserve_topology=True)
        if geom.is_empty or geom.length < 0.02:
            continue
        props = {k: v for k, v in feature["properties"].items()}
        out.append({"type": "Feature", "properties": props, "geometry": mapping(geom), "_geom": geom, "_gauge": feature.get("_gauge")})
    return out


def load_ports(roster: dict) -> list[dict]:
    path = CACHE / "wpi.csv"
    west, south, east, north = roster["theatre"]["bbox"]
    if not path.exists():
        raise SystemExit("build_world: FAIL — missing wpi.csv")
    ports = []
    with path.open(encoding="utf-8", errors="replace", newline="") as handle:
        sample = handle.read(4096)
        handle.seek(0)
        dialect = csv.Sniffer().sniff(sample, delimiters=",;\t")
        reader = csv.DictReader(handle, dialect=dialect)
        for row in reader:
            lat = _first_float(row, ["Latitude", "LATITUDE", "lat", "Latitude_Decimal"])
            lon = _first_float(row, ["Longitude", "LONGITUDE", "lon", "Longitude_Decimal"])
            if lat is None or lon is None:
                lat, lon = _parse_wpi_dms(row)
            if lat is None or lon is None:
                continue
            if lon < west or lon > east or lat < south or lat > north:
                continue
            name = _first_str(row, ["Main Port Name", "Port Name", "PORT_NAME", "name"]) or "Port"
            size = _first_str(row, ["Harbor Size", "HARBORSIZE", "size"]) or ""
            ports.append(
                {
                    "type": "Feature",
                    "properties": {
                        "id": f"port-{slug(name)}",
                        "name": name,
                        "harbor_size": size,
                    },
                    "geometry": {"type": "Point", "coordinates": [round(lon, 4), round(lat, 4)]},
                    "_xy": (lon, lat),
                }
            )
    return ports


def load_airports(roster: dict) -> list[dict]:
    path = CACHE / "ourairports.csv"
    west, south, east, north = roster["theatre"]["bbox"]
    if not path.exists():
        raise SystemExit("build_world: FAIL — missing ourairports.csv")
    airports = []
    with path.open(encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            kind = (row.get("type") or "").strip()
            if kind not in {"large_airport", "medium_airport"}:
                continue
            if (row.get("scheduled_service") or "") != "yes":
                continue
            try:
                lat = float(row["latitude_deg"])
                lon = float(row["longitude_deg"])
            except (KeyError, ValueError, TypeError):
                continue
            if lon < west or lon > east or lat < south or lat > north:
                continue
            name = row.get("name") or row.get("ident") or "Airport"
            airports.append(
                {
                    "type": "Feature",
                    "properties": {
                        "id": f"airport-{(row.get('ident') or slug(name)).lower()}",
                        "name": name,
                        "icao": row.get("ident"),
                        "iata": row.get("iata_code"),
                        "kind": kind,
                    },
                    "geometry": {"type": "Point", "coordinates": [round(lon, 4), round(lat, 4)]},
                    "_xy": (lon, lat),
                }
            )
    return airports


def _first_float(row: dict, keys: list[str]) -> float | None:
    for key in keys:
        if key in row and row[key] not in (None, ""):
            try:
                return float(str(row[key]).replace(",", "."))
            except ValueError:
                continue
    return None


def _first_str(row: dict, keys: list[str]) -> str | None:
    for key in keys:
        if row.get(key):
            return str(row[key]).strip()
    return None


def _parse_wpi_dms(row: dict) -> tuple[float | None, float | None]:
    lat = row.get("Latitude") or row.get("LAT")
    lon = row.get("Longitude") or row.get("LON")
    if not lat or not lon:
        return None, None
    return _dms(str(lat)), _dms(str(lon))


def _dms(value: str) -> float | None:
    match = re.search(r"(-?\d+)[^\d]+(\d+)[^\d]+(\d+(?:\.\d+)?)?\s*([NSEW])?", value, re.I)
    if not match:
        try:
            return float(value)
        except ValueError:
            return None
    deg, minutes, seconds, hemi = match.group(1), match.group(2), match.group(3) or "0", (match.group(4) or "").upper()
    number = abs(int(deg)) + int(minutes) / 60 + float(seconds) / 3600
    if hemi in {"S", "W"} or int(deg) < 0:
        number = -number
    return number


def nearest_province(provinces: list[dict], xy: tuple[float, float]) -> dict:
    point = Point(xy)
    best, best_d = provinces[0], 1e18
    for province in provinces:
        d = province["_geom"].distance(point)
        if d < best_d:
            best, best_d = province, d
    return best


def build_corridors(
    roster: dict,
    provinces: list[dict],
    roads: list[dict],
    rails: list[dict],
    ports: list[dict],
    airports: list[dict],
) -> tuple[list[dict], list[dict], dict]:
    from shapely import STRtree

    corridors: list[dict] = []
    edges_fc: list[dict] = []
    gauge_breaks: list[dict] = []
    nodes: dict[str, tuple[float, float]] = {p["properties"]["id"]: p["_centroid"] for p in provinces}
    rail_tree = STRtree([r["_geom"] for r in rails]) if rails else None
    road_tree = STRtree([r["_geom"] for r in roads]) if roads else None

    seen_ids: set[str] = set()

    def add_edge(a: str, b: str, kind: str, ticks: int, extra: dict | None = None) -> None:
        if a == b or ticks < 1:
            return
        left, right = (a, b) if a < b else (b, a)
        cid = f"{kind}:{left}:{right}"
        if cid in seen_ids:
            return
        seen_ids.add(cid)
        record = {"id": cid, "a": left, "b": right, "travel_ticks": int(ticks), "kind": kind}
        if extra:
            record.update(extra)
        corridors.append(record)
        if left in nodes and right in nodes:
            edges_fc.append(
                {
                    "type": "Feature",
                    "properties": {k: v for k, v in record.items()},
                    "geometry": {"type": "LineString", "coordinates": [list(nodes[left]), list(nodes[right])]},
                }
            )

    geoms = [p["_geom"] for p in provinces]
    province_tree = STRtree(geoms)
    padded = [g.buffer(0.12) for g in geoms]
    for i, a in enumerate(provinces):
        for raw_j in province_tree.query(padded[i]):
            j = int(raw_j)
            if j <= i:
                continue
            b = provinces[j]
            km = haversine_km(a["_centroid"], b["_centroid"])
            search = padded[i].intersection(padded[j])
            rail_hit = None
            road_hit = False
            if not search.is_empty and rail_tree is not None:
                for index in rail_tree.query(search):
                    rail = rails[int(index)]
                    if rail["_geom"].intersects(search):
                        rail_hit = rail
                        break
            if not search.is_empty and road_tree is not None:
                for index in road_tree.query(search):
                    if roads[int(index)]["_geom"].intersects(search):
                        road_hit = True
                        break
            extra: dict[str, Any] = {}
            if rail_hit is not None:
                kind = "rail"
                ticks = ticks_for(km, 140)
                gauge_a = GAUGE_BY_ISO3.get(a["properties"]["iso3"])
                gauge_b = GAUGE_BY_ISO3.get(b["properties"]["iso3"])
                if gauge_a:
                    extra["gauge_from"] = gauge_a
                if gauge_b:
                    extra["gauge_to"] = gauge_b
                if gauge_a and gauge_b and gauge_a != gauge_b:
                    ticks += 2
            elif road_hit:
                kind = "land"
                ticks = ticks_for(km, 90)
            else:
                kind = "land"
                ticks = ticks_for(km, 45, floor=2)
            add_edge(a["properties"]["id"], b["properties"]["id"], kind, ticks, extra)

    by_id = {p["properties"]["id"]: p for p in provinces}
    for corridor in corridors:
        if corridor["kind"] != "rail":
            continue
        a, b = by_id.get(corridor["a"]), by_id.get(corridor["b"])
        if not a or not b:
            continue
        gauge_a = GAUGE_BY_ISO3.get(a["properties"]["iso3"])
        gauge_b = GAUGE_BY_ISO3.get(b["properties"]["iso3"])
        if not (gauge_a and gauge_b and gauge_a != gauge_b):
            continue
        corridor["gauge_from"] = gauge_a
        corridor["gauge_to"] = gauge_b
        if corridor.get("travel_ticks", 1) < 3:
            corridor["travel_ticks"] = int(corridor["travel_ticks"]) + 2
        mid = (
            (a["_centroid"][0] + b["_centroid"][0]) / 2,
            (a["_centroid"][1] + b["_centroid"][1]) / 2,
        )
        gauge_breaks.append(
            {
                "type": "Feature",
                "properties": {
                    "id": f"gauge-break:{corridor['a']}:{corridor['b']}",
                    "name": "Gauge break",
                    "kind": "gauge_break",
                    "gauge_from": gauge_a,
                    "gauge_to": gauge_b,
                },
                "geometry": {"type": "Point", "coordinates": [round(mid[0], 4), round(mid[1], 4)]},
            }
        )

    for port in ports:
        host = nearest_province(provinces, port["_xy"])
        pid = port["properties"]["id"]
        nodes[pid] = port["_xy"]
        add_edge(pid, host["properties"]["id"], "transfer", 1)

    for airport in airports:
        host = nearest_province(provinces, airport["_xy"])
        aid = airport["properties"]["id"]
        nodes[aid] = airport["_xy"]
        add_edge(aid, host["properties"]["id"], "transfer", 1)

    bosphorus = next(c for c in roster["theatre"]["chokepoints"] if c["id"] == "bosphorus")
    b_id = "chokepoint-bosphorus"
    nodes[b_id] = tuple(bosphorus["from"])
    host = nearest_province(provinces, tuple(bosphorus["from"]))
    add_edge(b_id, host["properties"]["id"], "strait", 1)
    black_sea_ports = [
        p for p in ports if 27.0 <= p["_xy"][0] <= 42.0 and 40.8 <= p["_xy"][1] <= 47.5
    ]
    for port in black_sea_ports:
        km = haversine_km(port["_xy"], tuple(bosphorus["from"]))
        add_edge(port["properties"]["id"], b_id, "sea", ticks_for(km, 220))

    # Marmara / Aegean side of the strait so closing it actually cuts a path.
    south_ports = [p for p in ports if 26.0 <= p["_xy"][0] <= 30.5 and 38.0 <= p["_xy"][1] <= 41.1]
    for port in south_ports:
        km = haversine_km(port["_xy"], tuple(bosphorus["from"]))
        add_edge(port["properties"]["id"], b_id, "sea", max(1, ticks_for(km, 220)))

    if not any(c["a"] == b_id or c["b"] == b_id for c in corridors):
        raise SystemExit("build_world: FAIL — Bosphorus is missing from the corridor graph")

    allowed = {"id", "a", "b", "travel_ticks", "kind", "gauge_from", "gauge_to"}
    corridors = [{k: v for k, v in c.items() if k in allowed} for c in corridors]

    choke_features = [
        {
            "type": "Feature",
            "properties": {"id": b_id, "name": bosphorus["name"], "kind": "strait"},
            "geometry": {"type": "LineString", "coordinates": [bosphorus["from"], bosphorus["to"]]},
        },
        *gauge_breaks,
    ]
    return corridors, edges_fc, {"type": "FeatureCollection", "features": choke_features}


def drop_private(features: list[dict]) -> list[dict]:
    clean = []
    for feature in features:
        clean.append({"type": "Feature", "properties": feature["properties"], "geometry": feature["geometry"]})
    return clean


def write_fc(name: str, features: list[dict], note: str) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    payload = {"type": "FeatureCollection", "note": note, "features": drop_private(features)}
    path = OUT / name
    path.write_text(json.dumps(payload, separators=(",", ":")))
    print(f"build_world: {name:18} {len(features):5} features  {path.stat().st_size // 1024}k")


def main() -> int:
    roster = load_json(CONFIG)
    print("build_world: provinces")
    provinces = collect_provinces(roster)
    turkey = [p for p in provinces if p["properties"]["iso3"] == "TUR"]
    romania = [p for p in provinces if p["properties"]["iso3"] == "ROU"]
    russia = [p for p in provinces if p["properties"]["iso3"] == "RUS"]
    if len(turkey) > 12:
        raise SystemExit(f"build_world: FAIL — Turkey has {len(turkey)} provinces, cap is 12")
    if len(romania) > 8:
        raise SystemExit(f"build_world: FAIL — Romania has {len(romania)} provinces, cap is 8")
    if len(russia) > 8:
        raise SystemExit(f"build_world: FAIL — Russia has {len(russia)} districts in-slice, cap is 8")

    print("build_world: cities")
    cities = assign_cities(roster, provinces)
    per: dict[str, int] = defaultdict(int)
    for city in cities:
        per[city["properties"]["province_id"]] += 1
    for province in provinces:
        count = per[province["properties"]["id"]]
        if count < 1 or count > 3:
            raise SystemExit(f"build_world: FAIL — {province['properties']['id']} has {count} cities")

    print("build_world: osm lines")
    roads, rails = osm_lines(roster["theatre"]["bbox"])
    roads = simplify_lines(roads, 0.03)
    rails = simplify_lines(rails, 0.02)
    rails = infer_rail_gauge(rails, provinces)
    roads = cap_line_layer(roads, [0.04, 0.06, 0.08, 0.12])
    rails = cap_line_layer(rails, [0.03, 0.05, 0.08])
    if len(rails) > 1200:
        rails = sorted(rails, key=lambda r: -r["_geom"].length)[:1200]
    print(f"build_world: transport {len(roads)} roads, {len(rails)} rails")
    if not any(r.get("_gauge") == 1520 for r in rails) or not any(r.get("_gauge") == 1435 for r in rails):
        # Allow nearby gauges (1524) but require both families.
        broad_1520 = any((r.get("_gauge") or 0) in {1520, 1524} for r in rails)
        broad_1435 = any((r.get("_gauge") or 0) in {1435, 1445} for r in rails)
        if not (broad_1520 and broad_1435):
            raise SystemExit("build_world: FAIL — rail extract lacks both 1520 and 1435 gauge families")

    print("build_world: ports / airports")
    ports = load_ports(roster)
    airports = load_airports(roster)
    if len(ports) < 5:
        raise SystemExit(f"build_world: FAIL — only {len(ports)} ports in theatre")
    if len(airports) < 5:
        raise SystemExit(f"build_world: FAIL — only {len(airports)} airports in theatre")

    print("build_world: corridor graph")
    corridors, edge_features, chokepoints = build_corridors(roster, provinces, roads, rails, ports, airports)
    if any("lon" in c or "lat" in c or "coordinates" in c for c in corridors):
        raise SystemExit("build_world: FAIL — corridors.json must not carry coordinates")
    if not any(c["travel_ticks"] > 0 for c in corridors):
        raise SystemExit("build_world: FAIL — corridor travel_ticks missing")

    provenance = "osm"
    prov_path = CACHE / "transport_provenance.json"
    if prov_path.exists():
        provenance = json.loads(prov_path.read_text()).get("source", "osm")
    note_transport = (
        "Natural Earth public domain. Theatre clip of major highways / railroads. Gauge inferred from host nation."
        if provenance == "natural_earth"
        else "© OpenStreetMap contributors. ODbL. Separately attributed basemap; not game state."
    )
    note_gb = "geoBoundaries (CC BY 4.0). Game-state provinces."
    write_fc("provinces.geojson", provinces, note_gb)
    write_fc("cities.geojson", cities, "GeoNames CC BY 4.0. 1–3 cities per province.")
    write_fc("roads.geojson", roads, note_transport)
    write_fc("rail.geojson", rails, note_transport)
    write_fc("ports.geojson", ports, "World Port Index, US Government public domain.")
    write_fc("airports.geojson", airports, "OurAirports CC0.")
    write_fc("corridors.geojson", edge_features, "Render-only edges. Simulation reads corridors.json.")
    (OUT / "chokepoints.geojson").write_text(json.dumps(chokepoints, separators=(",", ":")))
    (OUT / "corridors.json").write_text(json.dumps({"note": "Integer graph. No coordinates.", "corridors": corridors}, separators=(",", ":")))
    print(f"build_world: corridors.json     {len(corridors)} edges")

    # Refresh attribution now that outputs exist.
    sys.path.insert(0, str(ROOT))
    from build import load_manifest, write_attribution

    write_attribution(load_manifest())
    print("build_world: ok")
    return 0


if __name__ == "__main__":
    sys.exit(main())
