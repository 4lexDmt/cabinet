#!/usr/bin/env python3
"""
Fetch Stage 1 (Eastern Europe / Black Sea) sources into infra/tiles/.cache.

Natural Earth continues to go through fetch.sh. This script handles the 2026
dataset sources: geoBoundaries ADM1, GeoNames, OSM transport for the theatre
bbox, World Port Index, OurAirports.

Failures are loud. An empty layer is worse than a missing one.
Transport geometry comes from Geofabrik shapefile extracts (ODbL), not Overpass.
"""

from __future__ import annotations

import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CACHE = ROOT / ".cache"
CONFIG = ROOT / "config" / "nations.json"
MANIFEST = ROOT / "sources.json"

USER_AGENT = "CabinetTiles/0.1 (https://github.com/4lexDmt/cabinet; dataset pipeline)"


def log(message: str) -> None:
    print(message, flush=True)


def load_json(path: Path) -> dict:
    return json.loads(path.read_text())


def source_by_id(manifest: dict, source_id: str) -> dict:
    for source in manifest["sources"]:
        if source["id"] == source_id:
            return source
    raise SystemExit(f"fetch_world: unknown source {source_id}")


def license_ok(source: dict) -> None:
    if not source.get("license"):
        raise SystemExit(f"fetch_world: FAIL — {source['id']} has no license field")
    if source.get("attribution_required") and not source.get("attribution"):
        raise SystemExit(f"fetch_world: FAIL — {source['id']} requires attribution with none recorded")


def download(url: str, dest: Path, retries: int = 4) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    last_error: Exception | None = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=600) as response:
                dest.write_bytes(response.read())
            return
        except (urllib.error.URLError, TimeoutError, OSError) as error:
            last_error = error
            time.sleep(2 ** attempt)
    raise SystemExit(f"fetch_world: FAIL downloading {url}: {last_error}")


def post(url: str, body: str, dest: Path, retries: int = 1) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    last_error: Exception | None = None
    payload = urllib.parse.urlencode({"data": body}).encode()
    for attempt in range(retries):
        try:
            req = urllib.request.Request(
                url,
                data=payload,
                headers={"User-Agent": USER_AGENT, "Content-Type": "application/x-www-form-urlencoded"},
            )
            with urllib.request.urlopen(req, timeout=60) as response:
                dest.write_bytes(response.read())
            return
        except (urllib.error.URLError, TimeoutError, OSError) as error:
            last_error = error
            time.sleep(2 * (attempt + 1))
    raise SystemExit(f"fetch_world: FAIL overpass {url}: {last_error}")


def fetch_geoboundaries(source: dict, iso3_list: list[str]) -> None:
    license_ok(source)
    for iso3 in iso3_list:
        dest = CACHE / f"geoboundaries_{iso3}_ADM1.geojson"
        if dest.exists() and dest.stat().st_size > 100:
            log(f"fetch_world: geoboundaries {iso3} — cached")
            continue
        api = source["url"].replace("{ISO3}", iso3)
        log(f"fetch_world: geoboundaries {iso3} — {api}")
        meta_path = CACHE / f"geoboundaries_{iso3}_ADM1.meta.json"
        download(api, meta_path)
        meta = json.loads(meta_path.read_text())
        gj_url = meta.get("gjDownloadURL") or meta.get("simplifiedGeometryGeoJSON")
        if not gj_url:
            raise SystemExit(f"fetch_world: FAIL — geoBoundaries {iso3} returned no GeoJSON URL: {meta_path}")
        download(gj_url, dest)
        if dest.stat().st_size < 100:
            raise SystemExit(f"fetch_world: FAIL — geoBoundaries {iso3} empty")


def fetch_geonames(source: dict) -> None:
    license_ok(source)
    zip_path = CACHE / "geonames_cities15000.zip"
    txt_path = CACHE / "geonames_cities15000.txt"
    if txt_path.exists() and txt_path.stat().st_size > 1000:
        log("fetch_world: geonames — cached")
        return
    log(f"fetch_world: geonames — {source['url']}")
    download(source["url"], zip_path)
    with zipfile.ZipFile(zip_path) as archive:
        name = next((n for n in archive.namelist() if n.endswith(".txt")), None)
        if not name:
            raise SystemExit("fetch_world: FAIL — cities15000.zip had no txt")
        txt_path.write_bytes(archive.read(name))


def fetch_csv(source: dict, dest_name: str, fallbacks: list[str] | None = None) -> None:
    license_ok(source)
    dest = CACHE / dest_name
    if dest.exists() and dest.stat().st_size > 100:
        log(f"fetch_world: {source['id']} — cached")
        return
    urls = [source["url"], *(fallbacks or [])]
    last_error = None
    for url in urls:
        try:
            log(f"fetch_world: {source['id']} — {url}")
            download(url, dest)
            if dest.stat().st_size > 100:
                return
        except SystemExit as error:
            last_error = error
            continue
    raise SystemExit(f"fetch_world: FAIL — {source['id']} could not be fetched ({last_error})")


def overpass_query(west: float, south: float, east: float, north: float) -> str:
    bbox = f"{south},{west},{north},{east}"
    # Motorway + trunk is the strategic cut the domain already enforces.
    # Unfiltered primary ways explode Overpass; they are not the corridor graph.
    return f"""
[out:json][timeout:90];
(
  way["highway"~"^(motorway|trunk)$"]({bbox});
  way["railway"="rail"]["usage"~"^(main|branch)$"]({bbox});
  way["railway"="rail"]["gauge"]({bbox});
);
out geom;
""".strip()


OVERPASS_ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.openstreetmap.fr/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
]


def fetch_overpass_bbox(
    endpoints: list[str],
    west: float,
    south: float,
    east: float,
    north: float,
    depth: int,
    tile_id: str,
) -> Path:
    """Fetch one bbox to disk. On timeout, split into four. Fail loud at depth 3."""
    dest = CACHE / f"osm_slice_tile_{tile_id}.json"
    if dest.exists() and dest.stat().st_size > 100:
        try:
            payload = json.loads(dest.read_text())
            if isinstance(payload.get("elements"), list):
                return dest
        except json.JSONDecodeError:
            dest.unlink()
    query = overpass_query(west, south, east, north)
    last_error: Exception | None = None
    for endpoint in endpoints:
        try:
            log(f"fetch_world: osm {tile_id} — {endpoint}")
            post(endpoint, query, dest)
            payload = json.loads(dest.read_text())
            if payload.get("remark") and "error" in str(payload["remark"]).lower():
                raise SystemExit(f"overpass remark: {payload['remark']}")
            elements = payload.get("elements")
            if not isinstance(elements, list):
                raise SystemExit(f"overpass returned no elements array for {tile_id}")
            return dest
        except (SystemExit, json.JSONDecodeError, OSError) as error:
            last_error = error
            if dest.exists():
                dest.unlink()
            continue
    if depth >= 3:
        raise SystemExit(f"fetch_world: FAIL — OSM tile {tile_id} could not be fetched ({last_error})")
    log(f"fetch_world: osm {tile_id} — splitting")
    mid_x = (west + east) / 2
    mid_y = (south + north) / 2
    parts = [
        (west, south, mid_x, mid_y, f"{tile_id}a"),
        (mid_x, south, east, mid_y, f"{tile_id}b"),
        (west, mid_y, mid_x, north, f"{tile_id}c"),
        (mid_x, mid_y, east, north, f"{tile_id}d"),
    ]
    for w, s, e, n, kid in parts:
        fetch_overpass_bbox(endpoints, w, s, e, n, depth + 1, kid)
    return dest


def fetch_osm(source: dict, bbox: list[float]) -> None:
    license_ok(source)
    dest = CACHE / "osm_slice_transport.json"
    if dest.exists() and dest.stat().st_size > 50:
        log("fetch_world: osm — cached")
        return
    west, south, east, north = bbox
    endpoints = [source["url"], *[e for e in OVERPASS_ENDPOINTS if e != source["url"]]]
    nx, ny = 3, 2
    for iy in range(ny):
        for ix in range(nx):
            w = west + (east - west) * ix / nx
            e = west + (east - west) * (ix + 1) / nx
            s = south + (north - south) * iy / ny
            n = south + (north - south) * (iy + 1) / ny
            tile_id = f"{ix}_{iy}"
            fetch_overpass_bbox(endpoints, w, s, e, n, 0, tile_id)
    tiles = sorted(p.name for p in CACHE.glob("osm_slice_tile_*.json"))
    total = 0
    for name in tiles:
        payload = json.loads((CACHE / name).read_text())
        total += len(payload.get("elements") or [])
    dest.write_text(json.dumps({"tiles": tiles, "ways": total}))
    log(f"fetch_world: osm — {total} ways across {len(tiles)} tiles")
    if total < 50:
        raise SystemExit("fetch_world: FAIL — OSM extract too small to be a transport network")


GEOFABRIK_EXTRACTS = [
    "https://download.geofabrik.de/europe/poland-latest-free.shp.zip",
    "https://download.geofabrik.de/europe/romania-latest-free.shp.zip",
    "https://download.geofabrik.de/europe/ukraine-latest-free.shp.zip",
    "https://download.geofabrik.de/europe/turkey-latest-free.shp.zip",
    "https://download.geofabrik.de/russia/central-fed-district-latest-free.shp.zip",
    "https://download.geofabrik.de/russia/southern-fed-district-latest-free.shp.zip",
    "https://download.geofabrik.de/russia/north-caucasus-fed-district-latest-free.shp.zip",
    "https://download.geofabrik.de/russia/northwestern-fed-district-latest-free.shp.zip",
]


def _shp_in_bbox(shape: object, west: float, south: float, east: float, north: float) -> bool:
    bbox = getattr(shape, "bbox", None)
    if bbox and len(bbox) >= 4:
        minx, miny, maxx, maxy = bbox[0], bbox[1], bbox[2], bbox[3]
        return not (maxx < west or minx > east or maxy < south or miny > north)
    return True


def fetch_geofabrik(source: dict, bbox: list[float]) -> None:
    """Country shapefile extracts — repeatable, checksummable, no Overpass timeout."""
    license_ok(source)
    try:
        import shapefile  # type: ignore
    except ImportError as error:
        raise SystemExit("fetch_world: pyshp is required. pip install pyshp") from error

    west, south, east, north = bbox
    dest_roads = CACHE / "osm_slice_roads.geojson"
    dest_rails = CACHE / "osm_slice_rail.geojson"
    if dest_roads.exists() and dest_roads.stat().st_size > 1000 and dest_rails.exists():
        log("fetch_world: geofabrik shp — cached")
        return

    roads: list[dict] = []
    rails: list[dict] = []
    seen_road: set[str] = set()
    seen_rail: set[str] = set()

    for url in GEOFABRIK_EXTRACTS:
        name = url.rsplit("/", 1)[-1]
        zip_path = CACHE / name
        if not (zip_path.exists() and zip_path.stat().st_size > 1000):
            log(f"fetch_world: geofabrik — {url}")
            download(url, zip_path)
        try:
            with zipfile.ZipFile(zip_path) as probe:
                probe.namelist()
        except zipfile.BadZipFile as error:
            zip_path.unlink(missing_ok=True)
            raise SystemExit(f"fetch_world: FAIL — {name} is not a zip (Geofabrik blocked or redirected)") from error
        extract_dir = CACHE / name.replace(".zip", "")
        extract_dir.mkdir(parents=True, exist_ok=True)
        if not any(extract_dir.glob("*.shp")):
            log(f"fetch_world: geofabrik — unzip {name}")
            with zipfile.ZipFile(zip_path) as archive:
                archive.extractall(extract_dir)

        road_shp = next(extract_dir.rglob("*roads_free*.shp"), None) or next(
            extract_dir.rglob("*roads*.shp"), None
        )
        rail_shp = next(extract_dir.rglob("*railways_free*.shp"), None) or next(
            extract_dir.rglob("*railways*.shp"), None
        )
        if road_shp is None or rail_shp is None:
            raise SystemExit(f"fetch_world: FAIL — {name} missing roads/railways shapefiles")

        with shapefile.Reader(str(road_shp)) as reader:
            fields = [str(f[0]) for f in reader.fields[1:]]
            for item in reader.shapeRecords():
                rec = dict(zip(fields, item.record, strict=False))
                fclass = str(rec.get("fclass") or rec.get("FCLASS") or "")
                if fclass not in {"motorway", "trunk", "primary"}:
                    continue
                if not _shp_in_bbox(item.shape, west, south, east, north):
                    continue
                osm_id = str(rec.get("osm_id") or rec.get("OSM_ID") or len(roads))
                if osm_id in seen_road:
                    continue
                seen_road.add(osm_id)
                geom = item.shape.__geo_interface__
                roads.append(
                    {
                        "type": "Feature",
                        "properties": {
                            "id": f"road-{osm_id}",
                            "name": rec.get("name") or rec.get("NAME"),
                            "class": "strategic" if fclass in {"motorway", "trunk"} else "primary",
                            "fclass": fclass,
                        },
                        "geometry": geom,
                    }
                )

        with shapefile.Reader(str(rail_shp)) as reader:
            fields = [str(f[0]) for f in reader.fields[1:]]
            for item in reader.shapeRecords():
                rec = dict(zip(fields, item.record, strict=False))
                fclass = str(rec.get("fclass") or rec.get("FCLASS") or "")
                if fclass != "rail":
                    continue
                if not _shp_in_bbox(item.shape, west, south, east, north):
                    continue
                osm_id = str(rec.get("osm_id") or rec.get("OSM_ID") or len(rails))
                if osm_id in seen_rail:
                    continue
                seen_rail.add(osm_id)
                geom = item.shape.__geo_interface__
                rails.append(
                    {
                        "type": "Feature",
                        "properties": {
                            "id": f"rail-{osm_id}",
                            "name": rec.get("name") or rec.get("NAME"),
                            "usage": "main",
                            "gauge": None,
                            "electrified": None,
                        },
                        "geometry": geom,
                    }
                )
        log(f"fetch_world: geofabrik {name} — {len(roads)} roads / {len(rails)} rails so far")

    if len(roads) < 20 or len(rails) < 10:
        raise SystemExit(f"fetch_world: FAIL — Geofabrik extract too small ({len(roads)} roads, {len(rails)} rails)")
    dest_roads.write_text(json.dumps({"type": "FeatureCollection", "features": roads}, separators=(",", ":")))
    dest_rails.write_text(json.dumps({"type": "FeatureCollection", "features": rails}, separators=(",", ":")))
    (CACHE / "osm_slice_transport.json").write_text(
        json.dumps({"roads": dest_roads.name, "rails": dest_rails.name, "ways": len(roads) + len(rails)})
    )
    log(f"fetch_world: geofabrik — wrote {len(roads)} roads, {len(rails)} rails")
    (CACHE / "transport_provenance.json").write_text(json.dumps({"source": "osm"}))


def _coords_in_bbox(geom: dict, west: float, south: float, east: float, north: float) -> bool:
    coords = geom.get("coordinates")
    if not coords:
        return False

    def walk(node: object) -> bool:
        if not isinstance(node, list) or not node:
            return False
        if isinstance(node[0], (int, float)) and len(node) >= 2:
            lon, lat = float(node[0]), float(node[1])
            return west <= lon <= east and south <= lat <= north
        return any(walk(child) for child in node)

    return walk(coords)


def fetch_ne_transport(manifest: dict, bbox: list[float]) -> None:
    """Public-domain theatre clip when OSM extracts cannot be retrieved."""
    west, south, east, north = bbox
    roads_src = source_by_id(manifest, "ne_10m_roads_strategic")
    rail_src = source_by_id(manifest, "ne_10m_railroads")
    license_ok(roads_src)
    license_ok(rail_src)
    roads_raw = CACHE / "ne_10m_roads.geojson"
    rail_raw = CACHE / "ne_10m_railroads.geojson"
    if not (roads_raw.exists() and roads_raw.stat().st_size > 1000):
        log(f"fetch_world: ne roads — {roads_src['url']}")
        download(roads_src["url"], roads_raw)
    if not (rail_raw.exists() and rail_raw.stat().st_size > 1000):
        log(f"fetch_world: ne rail — {rail_src['url']}")
        download(rail_src["url"], rail_raw)

    kept_road_types = {
        "major highway",
        "secondary highway",
        "beltway",
        "motorway",
        "trunk",
        "primary",
    }
    roads: list[dict] = []
    for feature in load_json(roads_raw).get("features") or []:
        geom = feature.get("geometry") or {}
        if geom.get("type") not in {"LineString", "MultiLineString"}:
            continue
        if not _coords_in_bbox(geom, west, south, east, north):
            continue
        props = feature.get("properties") or {}
        kind = str(props.get("type") or props.get("TYPE") or "").lower().strip()
        if kind not in kept_road_types:
            continue
        roads.append(
            {
                "type": "Feature",
                "properties": {
                    "id": f"road-ne-{len(roads)}",
                    "name": props.get("name") or props.get("NAME"),
                    "class": "strategic" if kind in {"major highway", "beltway", "motorway", "trunk"} else "primary",
                },
                "geometry": geom,
            }
        )

    rails: list[dict] = []
    for feature in load_json(rail_raw).get("features") or []:
        geom = feature.get("geometry") or {}
        if geom.get("type") not in {"LineString", "MultiLineString"}:
            continue
        if not _coords_in_bbox(geom, west, south, east, north):
            continue
        props = feature.get("properties") or {}
        rails.append(
            {
                "type": "Feature",
                "properties": {
                    "id": f"rail-ne-{len(rails)}",
                    "name": props.get("name") or props.get("NAME") or props.get("featurecla"),
                    "usage": "main",
                    "gauge": None,
                    "electrified": None,
                },
                "geometry": geom,
            }
        )

    if len(roads) < 10 or len(rails) < 10:
        raise SystemExit(f"fetch_world: FAIL — Natural Earth theatre clip too small ({len(roads)} roads, {len(rails)} rails)")
    dest_roads = CACHE / "osm_slice_roads.geojson"
    dest_rails = CACHE / "osm_slice_rail.geojson"
    dest_roads.write_text(json.dumps({"type": "FeatureCollection", "features": roads, "note": "Natural Earth theatre clip"}, separators=(",", ":")))
    dest_rails.write_text(json.dumps({"type": "FeatureCollection", "features": rails, "note": "Natural Earth theatre clip"}, separators=(",", ":")))
    (CACHE / "osm_slice_transport.json").write_text(json.dumps({"roads": dest_roads.name, "rails": dest_rails.name, "ways": len(roads) + len(rails), "source": "natural_earth"}))
    (CACHE / "transport_provenance.json").write_text(json.dumps({"source": "natural_earth"}))
    log(f"fetch_world: ne transport — {len(roads)} roads, {len(rails)} rails")


def main() -> int:
    roster = load_json(CONFIG)
    manifest = load_json(MANIFEST)
    CACHE.mkdir(parents=True, exist_ok=True)

    fetch_geoboundaries(source_by_id(manifest, "geoboundaries_adm1"), roster["theatre"]["iso3"])
    fetch_geonames(source_by_id(manifest, "geonames_cities15000"))
    fetch_csv(source_by_id(manifest, "ourairports"), "ourairports.csv")
    fetch_csv(
        source_by_id(manifest, "nga_wpi"),
        "wpi.csv",
        fallbacks=[
            "https://raw.githubusercontent.com/rrwen/world_port_index/master/data/UpdatedPub150.csv",
            "https://msi.nga.mil/api/publications/download?type=view&key=16920959/SFH00000/UpdatedPub150.csv",
        ],
    )
    try:
        fetch_geofabrik(source_by_id(manifest, "osm_slice_transport"), roster["theatre"]["bbox"])
    except SystemExit as error:
        log(f"fetch_world: OSM extract unavailable ({error}); using Natural Earth theatre clip")
        fetch_ne_transport(manifest, roster["theatre"]["bbox"])
    log("fetch_world: ok")
    return 0


if __name__ == "__main__":
    sys.exit(main())
