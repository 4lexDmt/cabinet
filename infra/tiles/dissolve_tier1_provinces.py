#!/usr/bin/env python3
"""
Dissolve Natural Earth 10m admin-1 into the gazetteer's incorporated provinces.

Offline. Never imported by the app. Output:

  apps/web/public/geo/mapkit/tier1_provinces.geojson

One MultiPolygon per gazetteer province. Internal ADM1 lines (Maine/New Hampshire
inside New England, départements inside Île-de-France) are gone after the union.
California is the documented split (CA-N / CA-S), not a real ADM1.

Natural Earth is public domain. Do not use GADM.
"""

from __future__ import annotations

import json
import math
import re
import sys
import unicodedata
import urllib.request
from collections import defaultdict
from pathlib import Path

from shapely.geometry import box, mapping, shape
from shapely.ops import unary_union
from shapely.validation import make_valid

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parent.parent
CACHE = ROOT / ".cache"
OUT = REPO / "apps" / "web" / "public" / "geo" / "mapkit" / "tier1_provinces.geojson"
GAZETTEER = REPO / "packages" / "geo" / "data" / "tier1-complete.json"
SOURCE_ID = "ne_10m_admin_1_states_provinces"
SOURCE_URL = (
    "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/"
    "geojson/ne_10m_admin_1_states_provinces.geojson"
)

TIER1 = {
    "USA",
    "BRA",
    "DEU",
    "GBR",
    "FRA",
    "CHN",
    "IND",
    "JPN",
    "IDN",
    "RUS",
    "TUR",
    "IRN",
    "SAU",
    "NGA",
}

# Hong Kong and Macau are ADM0 in Natural Earth, merged into cn-hk.
EXTRA_ADM0 = {"HKG": "CHN", "MAC": "CHN"}

# Not in the gazetteer; swallowing them into a Russian province would take a
# side on Crimea on a plate that already carries perspective for that line.
SKIP_FOLD = {
    "crimea",
    "sevastopol",
    "autonomous republic of crimea",
    "paracel islands",
}

# Tehachapi / Santa Barbara line: SF stays north, LA stays south.
CALIFORNIA_SPLIT_LAT = 35.8

# Planned Indonesian capital, carved from East Kalimantan.
IKN_BOX = (116.72, -0.94, 0.55, 0.45)

GBR_KENT_SUSSEX = {
    "kent",
    "medway",
    "east sussex",
    "brighton and hove",
    "west sussex",
}

GBR_REGION = {
    "greater london": "gb-lon",
    "northern ireland": "gb-nir",
    "north west": "gb-nw",
    "south west": "gb-sw",
    "yorkshire and the humber": "gb-yh",
    "west midlands": "gb-wm",
    "east midlands": "gb-em",
    "east": "gb-ee",
    "north east": "gb-ne",
    "highlands and islands": "gb-hig",
    "eastern": "gb-sct",
    "south western": "gb-sct",
    "north eastern": "gb-sct",
    "east wales": "gb-wal",
    "west wales and the valleys": "gb-wal",
}

FRA_REGION = {
    "ile de france": "fr-idf",
    "auvergne rhone alpes": "fr-ara",
    "provence alpes cote d azur": "fr-pac",
    "occitanie": "fr-occ",
    "nouvelle aquitaine": "fr-naq",
    "hauts de france": "fr-hdf",
    "grand est": "fr-ges",
    "pays de la loire": "fr-pdl",
    "normandie": "fr-nor",
    "bretagne": "fr-bre",
    "bourgogne franche comte": "fr-bfc",
    "centre val de loire": "fr-cvl",
    "corse": "fr-cor",
    "guyane francaise": "fr-guf",
    "reunion": "fr-reu",
    "martinique": "fr-ant",
    "guadeloupe": "fr-ant",
}

# Extra folded names that should hit a gazetteer merged_from token.
ALIASES: dict[str, list[str]] = {
    "nei mongol": ["inner mongol", "inner mongolia"],
    "hong kong": ["hong kong"],
    "macau": ["macau", "macao"],
    "xizang": ["tibet"],
    "dki jakarta": ["jakarta raya", "jakarta"],
    "ntb": ["nusa tenggara barat", "west nusa tenggara"],
    "ntt": ["nusa tenggara timur", "east nusa tenggara"],
    "bangka belitung": ["bangka belitung", "bangka-belitung"],
    "n ossetia": ["north ossetia", "north ossetia alania", "republic of north ossetia alania"],
    "st petersburg": ["city of st petersburg", "saint petersburg"],
    "leningrad oblast": ["leningrad"],
    "moscow oblast": ["moskovskaya"],
    "moscow": ["moskva"],
    "altai krai": ["altay"],
    "altai rep": ["gorno altay", "altai republic"],
    "jewish ao": ["yevrey", "jewish"],
    "zabaykalsky": ["chita", "zabaykalsky krai"],
    "primorsky": ["primorye", "primor ye"],
    "magadan": ["maga buryatdan"],
    "chukotka": ["chukchi autonomous okrug", "chukotka autonomous okrug"],
    "khanty mansi": ["khanty mansiy", "khanty mansi autonomous okrug"],
    "yamalo nenets": ["yamal nenets", "yamalo nenets autonomous okrug"],
    "sakha": ["sakha yakutia", "sakha republic"],
    "adygea": ["adygey", "republic of adygea"],
    "kabardino balkaria": ["kabardin balkar", "kabardino balkaria"],
    "karachay cherkessia": ["karachay cherkess"],
    "ingushetia": ["ingush", "republic of ingushetia"],
    "kalmykia": ["kalmyk", "republic of kalmykia"],
    "khakassia": ["khakass", "republic of khakassia"],
    "buryatia": ["buryat", "republic of buryatia"],
    "tuva": ["tyva", "tuva republic"],
    "chuvashia": ["chuvash", "chuvash republic"],
    "udmurtia": ["udmurt", "udmurt republic"],
    "mari el": ["mariy el", "mari el republic"],
    "nizhny novgorod": ["nizhegorod"],
    "oryol": ["orel"],
    "arkhangelsk": ["arkhangel sk"],
    "tyumen": ["tyumen"],
    "nenets": ["nenets autonomous okrug"],
    "komi": ["komi republic"],
    "mordovia": ["republic of mordovia"],
    "tatarstan": ["republic of tatarstan"],
    "bashkortostan": ["bashkortostan"],
    "stavropol": ["stavropol"],
    "krasnodar": ["krasnodar"],
    "khabarovsk": ["khabarovsk"],
    "kamchatka": ["kamchatka"],
    "arunachal": ["arunachal pradesh"],
    "daman diu": ["dadra and nagar haveli and daman and diu", "daman and diu"],
    "jammu and kashmir": ["jammu and kashmir"],
    "eastern province": ["ash sharqiyah", "eastern"],
    "madinah": ["al madinah"],
    "riyadh": ["ar riyad"],
    "northern borders": ["al hudud ash shamaliyah"],
    "al jawf": ["al jowf", "al jawf"],
    "asir": ["asir"],
    "jazan": ["jizan"],
    "qassim": ["al quassim", "al qassim"],
    "al bahah": ["al baha", "al bahah"],
    "makkah": ["makkah"],
    "fct": ["federal capital territory"],
    "nasarawa": ["nassarawa"],
    "chaharmahal": ["chahar mahall and bakhtiari", "chaharmahal and bakhtiari"],
    "kohgiluyeh and boyer ahmad": ["kohgiluyeh and buyer ahmad", "kohgiluyeh and boyer ahmad"],
    "sistan and baluchestan": ["sistan and baluchestan"],
    "east azerbaijan": ["east azarbaijan"],
    "west azerbaijan": ["west azarbaijan"],
    "ardabil": ["ardebil"],
    "kurdistan": ["kordestan"],
    "isfahan": ["esfahan"],
    "tehran": ["tehran", "alborz"],
    "hokkaido": ["hokkaido"],
    "tokyo": ["tokyo"],
    "osaka": ["osaka"],
    "kyoto": ["kyoto"],
    "hyogo": ["hyogo"],
    "kochi": ["kochi"],
    "oita": ["oita"],
}


def fold(value: str | None) -> str:
    if not value:
        return ""
    text = unicodedata.normalize("NFKD", str(value))
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    text = text.replace("İ", "I").replace("ı", "i").replace("ß", "ss")
    text = text.lower()
    text = text.replace("&", " ").replace("+", " ").replace("/", " ")
    text = re.sub(r"[^a-z0-9]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def compact(value: str) -> str:
    return fold(value).replace(" ", "")


def variants(value: str | None) -> set[str]:
    spaced = fold(value)
    if not spaced:
        return set()
    out = {spaced, spaced.replace(" ", "")}
    for suffix in (
        " autonomous okrug",
        " autonomous region",
        " autonomous prefecture",
        " autonomous republic",
        " autonomous oblast",
        " prefecture",
        " province",
        " state",
        " krai",
        " oblast",
        " republic",
        " region",
        " territory",
        " governorate",
        " islands",
    ):
        if spaced.endswith(suffix.strip()) or spaced.endswith(suffix):
            trimmed = spaced[: -len(suffix)].strip() if spaced.endswith(suffix) else spaced
            if trimmed:
                out.add(trimmed)
                out.add(trimmed.replace(" ", ""))
    return {item for item in out if item}


def feature_keys(props: dict) -> set[str]:
    keys: set[str] = set()
    for field in ("name", "name_en", "name_alt", "woe_name", "gn_name", "postal", "iso_3166_2"):
        raw = props.get(field)
        if not raw:
            continue
        for part in re.split(r"[|;]", str(raw)):
            keys |= variants(part)
            if field == "iso_3166_2" and "-" in part:
                keys |= variants(part.split("-")[-1])
    return keys


def haversine_km(a: tuple[float, float], b: tuple[float, float]) -> float:
    lon1, lat1 = a
    lon2, lat2 = b
    p = math.pi / 180
    dlat = (lat2 - lat1) * p
    dlon = (lon2 - lon1) * p
    h = math.sin(dlat / 2) ** 2 + math.cos(lat1 * p) * math.cos(lat2 * p) * math.sin(dlon / 2) ** 2
    return 12742 * math.asin(min(1.0, math.sqrt(h)))


def polygonal(geom):
    geom = make_valid(geom)
    if geom.is_empty:
        return None
    if geom.geom_type == "Polygon":
        return geom
    if geom.geom_type == "MultiPolygon":
        return geom
    if geom.geom_type == "GeometryCollection":
        parts = [g for g in geom.geoms if g.geom_type in ("Polygon", "MultiPolygon") and not g.is_empty]
        if not parts:
            return None
        return unary_union(parts)
    return None


def round_coords(node, digits: int = 4):
    if isinstance(node, (float, int)):
        return round(float(node), digits)
    if isinstance(node, list):
        if node and isinstance(node[0], (float, int)):
            return [round(float(x), digits) for x in node]
        return [round_coords(child, digits) for child in node]
    return node


def load_admin1() -> dict:
    CACHE.mkdir(parents=True, exist_ok=True)
    path = CACHE / f"{SOURCE_ID}.geojson"
    if not path.exists():
        fallback = Path("/tmp/ne_admin1.geojson")
        if fallback.exists():
            path.write_bytes(fallback.read_bytes())
        else:
            print(f"dissolve: downloading {SOURCE_ID}", file=sys.stderr)
            urllib.request.urlretrieve(SOURCE_URL, path)
    return json.loads(path.read_text())


def province_index(gazetteer: dict):
    provinces = []
    by_iso: dict[str, list] = defaultdict(list)
    keys_by_id: dict[str, set[str]] = {}
    postal_by_iso: dict[str, dict[str, str]] = defaultdict(dict)
    for country in gazetteer["countries"]:
        iso = country["iso"]
        for province in country["provinces"]:
            pid = province["id"]
            provinces.append(province | {"iso": iso})
            by_iso[iso].append(province | {"iso": iso})
            keys: set[str] = set()
            keys |= variants(province["name"])
            suffix = pid.split("-", 1)[-1]
            if len(compact(suffix)) >= 4:
                keys |= variants(suffix)
            for token in province.get("merged_from") or []:
                keys |= variants(token)
                for extra in ALIASES.get(fold(token), []):
                    keys |= variants(extra)
                folded = fold(token)
                if re.fullmatch(r"[a-z]{2,3}", folded) or re.fullmatch(r"[a-z]{2}", folded):
                    postal_by_iso[iso][folded.upper()] = pid
                    postal_by_iso[iso][folded] = pid
            keys_by_id[pid] = keys
    return provinces, by_iso, keys_by_id, postal_by_iso


def match_gbr(props: dict) -> str | None:
    region = fold(props.get("region"))
    name = fold(props.get("name"))
    if region == "south east":
        return "gb-ken" if name in GBR_KENT_SUSSEX else "gb-se"
    return GBR_REGION.get(region)


def match_usa(props: dict, postal_map: dict[str, str]) -> str | None:
    postal = (props.get("postal") or "").upper()
    if postal == "CA":
        return "__CA__"
    if postal == "DC":
        return "us-chesapeake"
    return postal_map.get(postal)


def match_deu(props: dict, postal_map: dict[str, str]) -> str | None:
    name = fold(props.get("name")) or fold(props.get("name_en"))
    if "brandenburg" in name:
        return "de-bb"
    if name == "berlin":
        return "de-be"
    postal = (props.get("postal") or "").upper()
    return postal_map.get(postal)


def match_generic(iso: str, props: dict, keys_by_id: dict[str, set[str]], by_iso: dict) -> str | None:
    feat = feature_keys(props)
    if not feat:
        return None
    hits: list[tuple[int, str]] = []
    for province in by_iso[iso]:
        overlap = feat & keys_by_id[province["id"]]
        if not overlap:
            continue
        score = max(len(item) for item in overlap)
        if score < 3:
            continue
        hits.append((score, province["id"]))
    if not hits:
        return None
    hits.sort(reverse=True)
    best = hits[0][0]
    winners = [pid for score, pid in hits if score == best]
    if len(set(winners)) == 1:
        return winners[0]
    return None


def nearest_province(iso: str, lon: float, lat: float, by_iso: dict) -> str | None:
    best_id = None
    best_d = 1e18
    for province in by_iso[iso]:
        centroid = province["centroid"]
        dist = haversine_km((lon, lat), (centroid[0], centroid[1]))
        if dist < best_d:
            best_d = dist
            best_id = province["id"]
    return best_id if best_d <= 900 else None


def main() -> int:
    gazetteer = json.loads(GAZETTEER.read_text())
    provinces, by_iso, keys_by_id, postal_by_iso = province_index(gazetteer)
    admin = load_admin1()

    assigned: dict[str, list] = defaultdict(list)
    leftovers: list[tuple[str, str, str]] = []
    skipped: list[str] = []

    for feature in admin["features"]:
        props = feature.get("properties") or {}
        adm0 = props.get("adm0_a3")
        iso = EXTRA_ADM0.get(adm0, adm0)
        if iso not in TIER1:
            continue
        name = props.get("name") or props.get("name_en") or ""
        if fold(name) in SKIP_FOLD or not name:
            skipped.append(f"{iso}:{name or props.get('adm1_code')}")
            continue
        if iso == "CHN" and fold(name) in {"paracel islands"}:
            skipped.append(f"{iso}:{name}")
            continue

        pid = None
        if adm0 in {"HKG", "MAC"}:
            pid = "cn-hk"
        elif iso == "USA":
            pid = match_usa(props, postal_by_iso["USA"])
        elif iso == "GBR":
            pid = match_gbr(props)
        elif iso == "FRA":
            pid = FRA_REGION.get(fold(props.get("region")))
        elif iso == "DEU":
            pid = match_deu(props, postal_by_iso["DEU"])
        elif iso == "BRA":
            postal = (props.get("postal") or "").upper()
            pid = postal_by_iso["BRA"].get(postal)

        if pid is None:
            pid = match_generic(iso, props, keys_by_id, by_iso)

        if pid is None:
            lon = float(props.get("longitude") or 0)
            lat = float(props.get("latitude") or 0)
            pid = nearest_province(iso, lon, lat, by_iso)
            if pid:
                leftovers.append((iso, name, pid))

        if not pid:
            skipped.append(f"{iso}:{name}")
            continue
        assigned[pid].append(feature)

    geoms: dict[str, object] = {}
    for pid, features in assigned.items():
        if pid == "__CA__":
            unioned = polygonal(unary_union([shape(f["geometry"]) for f in features if f.get("geometry")]))
            if unioned is None:
                continue
            south = polygonal(unioned.intersection(box(-180, -90, 180, CALIFORNIA_SPLIT_LAT)))
            north = polygonal(unioned.intersection(box(-180, CALIFORNIA_SPLIT_LAT, 180, 90)))
            if south:
                geoms["us-socal"] = south
            if north:
                geoms["us-norcal"] = north
            continue
        parts = [shape(f["geometry"]) for f in features if f.get("geometry")]
        if not parts:
            continue
        unioned = polygonal(unary_union(parts))
        if unioned is not None:
            geoms[pid] = unioned

    # Nusantara is a split of East Kalimantan, not a second copy of it.
    if "id-kat" in geoms:
        cx, cy, dx, dy = IKN_BOX
        clip = box(cx - dx, cy - dy, cx + dx, cy + dy)
        kat = geoms["id-kat"]
        piece = polygonal(kat.intersection(clip))
        rest = polygonal(kat.difference(clip))
        if piece is not None and not piece.is_empty:
            geoms["id-ibn"] = piece
        if rest is not None and not rest.is_empty:
            geoms["id-kat"] = rest

    missing = [p["id"] for p in provinces if p["id"] not in geoms]
    if leftovers:
        print(f"dissolve: {len(leftovers)} ADM1 assigned by nearest centroid:")
        for iso, name, pid in leftovers:
            print(f"  {iso:3} {name:40} -> {pid}")
    if skipped:
        print(f"dissolve: skipped {len(skipped)}: {', '.join(skipped)}")
    if missing:
        print("dissolve: missing provinces after union:", file=sys.stderr)
        for pid in missing:
            print(f"  {pid}", file=sys.stderr)
        return 1

    features_out = []
    for province in provinces:
        geom = geoms[province["id"]]
        geom = polygonal(geom.simplify(0.035, preserve_topology=True)) or geom
        payload = mapping(geom)
        payload["coordinates"] = round_coords(payload["coordinates"], 4)
        features_out.append(
            {
                "type": "Feature",
                "properties": {
                    "id": province["id"],
                    "name": province["name"],
                    "iso": province["iso"],
                    "seat": province["seat"],
                    "merged_from": province.get("merged_from") or [],
                },
                "geometry": payload,
            }
        )

    collection = {
        "type": "FeatureCollection",
        "name": "tier1_provinces",
        "note": (
            "Gazetteer provinces dissolved from Natural Earth 10m admin-1. "
            "Internal ADM1 borders inside an incorporated province are not drawn. "
            "Natural Earth. Free vector and raster map data @ naturalearthdata.com."
        ),
        "features": features_out,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(collection, ensure_ascii=False, separators=(",", ":")))
    size_kb = OUT.stat().st_size / 1024
    print(f"dissolve: {len(features_out)} provinces -> {OUT.relative_to(REPO)} ({size_kb:.0f} KB)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
