# Tile pipeline

An **offline build step**. It never runs at request time and is never imported
by the app. Run it, commit what it produces, forget it until a source revises.

```
make all      # fetch + verify + build
make tiles    # PMTiles, when a layer outgrows shipping raw GeoJSON
```

Output lands in `apps/web/public/geo/mapkit/`.

---

## Attribution — non-negotiable

Reproduced verbatim because these are legal obligations, not courtesies.

| Source | Licence | Required credit |
|---|---|---|
| Natural Earth | Public domain | None required. Credited anyway: *Natural Earth. Free vector and raster map data @ naturalearthdata.com.* |
| Marine Regions | CC BY 4.0 | *Flanders Marine Institute (2023). Maritime Boundaries Geodatabase, version 12.* Plus the per-product DOI recorded in `sources.json`. |
| Overture divisions | **ODbL** | *© OpenStreetMap contributors.* Attribution **and share-alike** on derived databases. |
| Overture transportation | **ODbL** | *© OpenStreetMap contributors.* Attribution **and share-alike**. |
| geoBoundaries | CC BY 4.0 | Cite Runfola et al. 2020. |
| GRIP4 | **Disputed — verify** | Reported as ODbL (FAO), CC-0 (GLOBIO) and CC BY 4.0 (Earth Engine catalog). Verify at `globio.info` before shipping; assume ODbL if unresolved. |
| **GADM** | **Non-commercial** | **Do not use.** Widely recommended, and disqualifying for a product with a paid tier. |

`fetch.sh` and `build.py` both **fail if a source has no `license` field**, and
fail if a source marked `attribution_required` records no attribution text.
That is deliberate: an unattributed ODbL layer is a licence breach that ships
silently and is discovered by someone else.

### The share-alike question, stated plainly

ODbL share-alike attaches to derived **databases**. Rendered map images and
tiles are a *Produced Work* and do not trigger it — but the tile *data* may.
Cabinet has a paid tier, so get a lawyer's read before monetising.

The clean structural answer, and the one this pipeline is arranged around: keep
every Overture/OSM-derived layer as a **separately attributed basemap**, and keep
game state — territories, control, beliefs — in **our own layer**. The two never
merge into one database.

Everything the app currently ships is public-domain Natural Earth, so it carries
no obligation at all today. That is a deliberate starting position, not an
accident.

---

## Sources that are not fetched automatically

`fetch.sh` downloads what it can and lists the rest. Two reasons a source is
marked `manual_download`:

**Marine Regions** requires a form submission per product, so it cannot be
scripted. Download the ZIPs listed by `fetch.sh`, convert each to GeoJSON, and
drop the result in `.cache/<source id>.geojson`. `build.py` picks them up
automatically and builds the maritime stack.

```bash
ogr2ogr -f GeoJSON .cache/marineregions_eez_v12.geojson eez_v12_lowres.shp
```

**Overture** is 300M+ transportation segments and 5.5M divisions. Query the
GeoParquet on S3 with DuckDB rather than downloading the theme:

```sql
INSTALL spatial; LOAD spatial;
INSTALL httpfs;  LOAD httpfs;
SET s3_region = 'us-west-2';

COPY (
  SELECT id, class, subtype, ST_AsText(geometry) AS wkt
  FROM read_parquet(
    's3://overturemaps-us-west-2/release/2026-07-22.0/theme=transportation/type=segment/*',
    hive_partitioning = 1)
  WHERE subtype = 'road'
    AND class IN ('motorway', 'trunk', 'primary')
    AND bbox.xmin BETWEEN  3 AND 37
    AND bbox.ymin BETWEEN 52 AND 67
) TO 'roads.geojson' WITH (FORMAT GDAL, DRIVER 'GeoJSON');
```

Filter **at the query**, not after. Keeping only `motorway`, `trunk` and
`primary` cuts the dataset by well over an order of magnitude and makes
supply-line rendering legible. Everything below `primary` is noise on a theatre
map.

---

## The three processing steps that are easy to get wrong

### 1. Boundaries carry one property per perspective

`ne_10m_admin_0_boundary_lines_land` ships 33 point-of-view fields — `FCLASS_ISO`
plus `FCLASS_*` for 32 governments. They are **sparsely populated by design**:
NULL means that government has no quarrel with the line, so the neutral
rendering applies. Verified in the current release: `FCLASS_CN` on 38 of 515
segments, `FCLASS_RU` on 30, `FCLASS_IN` on 28.

`build.py` normalizes each field and emits `pov_neutral`, `pov_in`, `pov_pk` and
so on **onto a single feature**. One tile layer then serves every desk, restyled
at runtime with a data expression. Do not split this into per-perspective
tilesets; switching perspective must not refetch.

An unrecognised classification is **fatal**, not defaulted. Defaulting a
disputed line to `international` turns a contested claim into an agreed one,
which is exactly the error the whole mechanism exists to prevent.

The case to check after any change:

| Perspective | Kashmir Line of Control |
|---|---|
| Neutral | `line_of_control` |
| India | `international` |
| Pakistan | `administrative` |

If Pakistan's view is not `administrative`, the normalization is wrong. From
Islamabad the LoC is an internal line pending plebiscite, not a border at all.
`packages/geo/test/pipeline-output.test.ts` pins this against the generated file.

### 2. Maritime zones must be differenced

Marine Regions' EEZ polygons **include** archipelagic, internal and territorial
waters — a deliberate deviation from the UNCLOS definition. Stacking the
published layers double-renders the inner zones and produces both wrong colours
and wrong areas.

```
eez_only = eez − (territorial ∪ contiguous ∪ internal ∪ archipelagic)
```

`build.py` differences landward-to-seaward and then **asserts the result is
disjoint** before writing. Needs `shapely`.

Use the low-resolution EEZ (Visvalingam, 10% retention) below z6 and full
resolution above. `sovereign_waters = internal ∪ archipelagic ∪ territorial` is
emitted separately: that is what actually counts as national territory at sea,
and it is what airspace derives from.

### 3. Airspace is derived, never sourced

```
sovereign_airspace = land ∪ internal ∪ archipelagic ∪ territorial_sea
```

One union of layers the pipeline already has, more accurate than anything
downloadable, and free.

Do **not** conflate this with Flight Information Regions. A FIR is an ICAO
service and control area, not sovereignty, and FIRs routinely extend far over
the high seas. If FIRs are added later they are `airspace_fir`, a separate layer
with separate semantics, never merged. ICAO's official product is commercially
licensed; EUROCONTROL EAD is the best open source.

---

## Sizing

| Lever | Effect |
|---|---|
| Max zoom 15 → 14 | Roughly halves the archive |
| Max zoom → 8 | World basemap in the low hundreds of MB |
| `--drop-densest-as-needed` | Density scales with zoom without style filters |

For Cabinet, **z8 is plenty**. Nothing here is turn-by-turn navigation.

PMTiles deduplicates internally — 70%+ reduction on a global vector basemap —
and reads over HTTP range requests, so there is no tile server, no database and
no API key. The alternative, uploading hundreds of millions of individual tiles,
would cost around $1,500 in request fees alone and take days.

## Verifying an upstream change

```bash
make verify
```

Re-downloads everything and checks sha256 against `checksums.json`. Natural
Earth and Overture both revise in place, so this is the only way to notice that
a border moved.
