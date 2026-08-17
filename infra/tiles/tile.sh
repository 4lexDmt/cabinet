#!/usr/bin/env bash
#
# Normalized GeoJSON -> PMTiles v3, via tippecanoe.
#
# This is the production tile path. The app ships the normalized GeoJSON
# directly at present, which is correct while the whole world fits in a few
# megabytes; run this when a layer outgrows that.
#
# Max zoom 8. This is a theatre map, not turn-by-turn navigation, and z8 keeps
# the world basemap in the low hundreds of megabytes rather than gigabytes.
# Dropping max zoom is always the first lever before reducing visual quality.
#
# tippecanoe rather than ogr2ogr: GDAL has written PMTiles natively since 3.8.0,
# but tippecanoe generates materially better overview tiles, and overviews are
# what a theatre map is almost entirely made of.

set -euo pipefail

cd "$(dirname "$0")"

SRC="../../apps/web/public/geo/mapkit"
OUT="build"
MAXZOOM="${MAXZOOM:-8}"

command -v tippecanoe >/dev/null || {
  echo "tile: tippecanoe not found." >&2
  echo "      brew install tippecanoe   |   https://github.com/felt/tippecanoe" >&2
  exit 1
}
command -v tile-join >/dev/null || { echo "tile: tile-join not found (ships with tippecanoe)" >&2; exit 1; }

mkdir -p "$OUT"

layer() {
  local name="$1"; shift
  local input="$SRC/$name.geojson"
  [[ -f "$input" ]] || { echo "tile: $name — absent, skipped"; return 0; }
  echo "tile: $name"
  tippecanoe -q --force -o "$OUT/$name.pmtiles" -l "$name" -z0 -Z"$MAXZOOM" "$@" "$input"
}

# Boundaries carry one property per perspective, so a single layer serves every
# desk. Switching from a neutral reading to Delhi's is a paint-property change,
# not a refetch — do not split these into per-perspective tilesets.
layer boundaries --no-feature-limit --no-tile-size-limit
layer countries --coalesce-densest-as-needed --detect-shared-borders
layer coastline --no-tile-size-limit
layer ocean
layer bathymetry --coalesce-densest-as-needed
layer lakes --drop-densest-as-needed
layer rivers --drop-densest-as-needed

# Places and roads get per-zoom feature dropping so density scales with zoom
# automatically, rather than through hand-tuned style filters that drift.
layer places --drop-densest-as-needed -B4
layer roads --drop-densest-as-needed

for zone in internal territorial contiguous eez sovereign_waters; do
  layer "maritime_$zone" --coalesce-densest-as-needed
done

echo "tile: joining"
# shellcheck disable=SC2046
tile-join -q --force -o "$OUT/cabinet.pmtiles" $(ls "$OUT"/*.pmtiles | grep -v cabinet.pmtiles)

cp "$SRC/attribution.json" "$OUT/attribution.json"

echo
echo "tile: wrote $OUT/cabinet.pmtiles  ($(du -h "$OUT/cabinet.pmtiles" | cut -f1))"
echo "tile: attribution sidecar at $OUT/attribution.json — ship it with the archive."
echo
cat <<'NOTE'
tile: hosting

  Cloudflare R2 is the natural host: free egress, and PMTiles reads via HTTP
  range requests, so there is no tile server, no database and no API key.

  CORS must allow the Range header and expose it back, or range reads fail
  silently and the map renders empty:

    [{ "AllowedOrigins": ["https://aevanormap.com"],
       "AllowedMethods": ["GET", "HEAD"],
       "AllowedHeaders": ["range", "if-match"],
       "ExposeHeaders": ["etag", "content-range", "content-length"],
       "MaxAgeSeconds": 86400 }]

  The archive is read-only by design. Updating means rewriting the file, which
  is the correct trade for a basemap that regenerates monthly at most.
NOTE
