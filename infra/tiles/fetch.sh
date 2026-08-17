#!/usr/bin/env bash
#
# Download every automatically fetchable source and verify its checksum.
#
# Sources marked `manual_download` are skipped: Marine Regions requires a form
# submission and Overture is queried from S3 with DuckDB rather than downloaded.
# Both are documented in README.md.
#
#   ./fetch.sh          download, then verify against checksums.json
#   ./fetch.sh --record download, then WRITE checksums.json
#
# Verification exists so that a silent upstream change is loud. Natural Earth
# and Overture both revise in place; a boundary that moved without anyone
# noticing is exactly the failure this pipeline should not permit.

set -euo pipefail

cd "$(dirname "$0")"

CACHE=".cache"
MANIFEST="sources.json"
CHECKSUMS="checksums.json"
RECORD=0
[[ "${1:-}" == "--record" ]] && RECORD=1

command -v jq >/dev/null || { echo "fetch: jq is required" >&2; exit 1; }
command -v curl >/dev/null || { echo "fetch: curl is required" >&2; exit 1; }

mkdir -p "$CACHE"

# A source with no license is a source we are not allowed to ship.
missing_license=$(jq -r '.sources[] | select((.license // "") == "") | .id' "$MANIFEST")
if [[ -n "$missing_license" ]]; then
  echo "fetch: FAIL — sources with no license field:" >&2
  echo "$missing_license" >&2
  exit 1
fi

missing_attribution=$(jq -r '.sources[] | select(.attribution_required == true) | select((.attribution // "") == "") | .id' "$MANIFEST")
if [[ -n "$missing_attribution" ]]; then
  echo "fetch: FAIL — sources requiring attribution with none recorded:" >&2
  echo "$missing_attribution" >&2
  exit 1
fi

sha() {
  if command -v sha256sum >/dev/null; then sha256sum "$1" | cut -d' ' -f1
  else shasum -a 256 "$1" | cut -d' ' -f1; fi
}

declare -a RECORDED=()
failed=0

while IFS=$'\t' read -r id url; do
  target="$CACHE/$id.geojson"
  if [[ -f "$target" ]]; then
    echo "fetch: $id — cached"
  else
    echo "fetch: $id — downloading"
    curl -fsSL --retry 4 --retry-delay 4 -o "$target.part" "$url"
    mv "$target.part" "$target"
  fi

  actual=$(sha "$target")
  if [[ $RECORD -eq 1 ]]; then
    RECORDED+=("$(jq -nc --arg id "$id" --arg sha "$actual" --arg url "$url" \
      '{id: $id, sha256: $sha, url: $url}')")
    echo "fetch: $id — recorded $actual"
    continue
  fi

  if [[ -f "$CHECKSUMS" ]]; then
    expected=$(jq -r --arg id "$id" '.[] | select(.id == $id) | .sha256' "$CHECKSUMS")
    if [[ -z "$expected" || "$expected" == "null" ]]; then
      echo "fetch: $id — WARN no recorded checksum; run ./fetch.sh --record" >&2
    elif [[ "$expected" != "$actual" ]]; then
      echo "fetch: $id — FAIL upstream changed" >&2
      echo "  expected $expected" >&2
      echo "  actual   $actual" >&2
      failed=1
    else
      echo "fetch: $id — verified"
    fi
  else
    echo "fetch: $id — WARN no checksums.json; run ./fetch.sh --record" >&2
  fi
done < <(jq -r '.sources[] | select(.manual_download != true) | [.id, .url] | @tsv' "$MANIFEST")

if [[ $RECORD -eq 1 ]]; then
  printf '%s\n' "${RECORDED[@]}" | jq -s '.' > "$CHECKSUMS"
  echo "fetch: wrote $CHECKSUMS"
fi

manual=$(jq -r '.sources[] | select(.manual_download == true) | "  \(.id)  \(.url)"' "$MANIFEST")
if [[ -n "$manual" ]]; then
  echo
  echo "fetch: the following sources are not fetched automatically —"
  echo "$manual"
  echo "       see README.md for why, and what to do with them."
fi

exit $failed
