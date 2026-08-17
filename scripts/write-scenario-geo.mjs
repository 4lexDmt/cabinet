/**
 * Write the `geo` block into every scenario.
 *
 * Run once, and again whenever a scenario's geometry changes:
 *
 *   node scripts/write-scenario-geo.mjs
 *
 * The theatre frame is taken from the territory manifest the tile pipeline
 * produces, so a scenario's frame is derived from the geometry it actually has
 * rather than from a number somebody eyeballed. Everything else is stated per
 * scenario, because the era decides which layers may exist at all and a wrong
 * default there is a map asserting something that had not been invented.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repo = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const manifestPath = join(repo, "apps/web/public/geo/mapkit/territory-manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

/**
 * Year, theatre frame, and the note a player sees when a layer is missing.
 *
 * The frame is stated rather than derived. A scenario's nations are frequently
 * global — London and Washington are players in a canal crisis — so the union
 * of their holdings is the whole world, which is not the theatre. The theatre
 * is where the contested ground is, and that is a judgement, so it is written
 * down. `[west, south, east, north]`.
 *
 * Anything else present is an override: something the year alone gets wrong.
 */
const SCENARIOS = [
  {
    file: "vienna-1815.json",
    id: "vienna_1815",
    year: 1815,
    bbox: [-11, 35, 42, 61],
    note: "Post roads and rivers, no engineered network. The territorial sea is three nautical miles — the cannon-shot rule — and no zone exists beyond it.",
  },
  {
    file: "berlin-conference-1884.json",
    id: "berlin_conference_1884",
    year: 1884,
    bbox: [-20, -36, 53, 38],
    note: "Boundaries drawn in a room in Berlin over territory none of the parties had surveyed. Many are marked indefinite because that is what they were.",
  },
  {
    file: "july-crisis-1914.json",
    id: "july_crisis_1914",
    year: 1914,
    bbox: [-11, 35, 46, 61],
    note: "No flight information regions: ICAO is thirty-three years away. Airspace is not yet a category anyone argues about.",
  },
  {
    file: "munich-1938.json",
    id: "munich_1938",
    year: 1938,
    bbox: [-7, 36, 34, 58],
    note: "The Reichsautobahn exists; almost nothing else does. Roads are shown only where a trunk network was actually built.",
  },
  {
    file: "molotov-ribbentrop-1939.json",
    id: "molotov_ribbentrop_1939",
    year: 1939,
    bbox: [9, 33, 70, 62],
    note: "A secret protocol divides territory the map still shows as sovereign. The boundary layer is the public one.",
  },
  {
    file: "grand-alliance-1939.json",
    id: "grand_alliance_1939",
    year: 1939,
    bbox: [-16, 20, 96, 63],
    note: "A theatre spanning three continents, before any of the maritime instruments that would later govern it.",
  },
  {
    file: "long-telegram-1947.json",
    id: "long_telegram_1947",
    year: 1947,
    bbox: [-170, -52, 179, 76],
    has_fir: true,
    note: "ICAO establishes flight information regions this year. They are administrative reach, not sovereignty, and the difference is about to matter.",
  },
  {
    file: "korea-1950.json",
    id: "korea_1950",
    year: 1950,
    bbox: [122, 32, 133, 44],
    note: "A military demarcation line, not a border. It reads as a line of control from every desk, which is a rare agreement.",
  },
  {
    file: "sevres-1956.json",
    id: "sevres_1956",
    year: 1956,
    bbox: [28, 25, 39, 34],
    note: "The territorial sea is three nautical miles. In a canal crisis that is not a detail — it is the substance of the dispute.",
  },
  {
    file: "thirteen-days-1962.json",
    id: "thirteen_days_1962",
    year: 1962,
    bbox: [-91, 15, -55, 33],
    note: "A quarantine line drawn at 500 and then 800 nautical miles, in an ocean where no state had jurisdiction beyond three.",
  },
  {
    file: "vietnam-1964.json",
    id: "vietnam_1964",
    year: 1964,
    bbox: [99, 6, 113, 24],
    note: "An incident in a gulf, at a time when the water it happened in belonged to nobody.",
  },
  {
    file: "the-concept-1967.json",
    id: "the_concept_1967",
    year: 1967,
    bbox: [30, 26, 40, 35],
    note: "The Straits of Tiran are the casus belli, and at three nautical miles the strait is territorial water on both sides with no corridor between.",
  },
  {
    file: "afghanistan-1979.json",
    id: "afghanistan_1979",
    year: 1979,
    bbox: [58, 27, 76, 40],
    road_era: "rail_and_road",
    note: "Landlocked: no maritime layer applies. The Salang tunnel is the theatre, and there is one of it.",
  },
  {
    file: "tanker-war-1980.json",
    id: "tanker_war_1980",
    year: 1980,
    bbox: [43, 21, 61, 34],
    note: "A shipping war in a gulf with no agreed maritime boundaries. UNCLOS is two years from signature and fourteen from force.",
  },
  {
    file: "malvinas-1982.json",
    id: "malvinas_1982",
    year: 1982,
    bbox: [-71, -58, -34, -31],
    has_eez: false,
    note: "UNCLOS is signed in December of this year and does not enter force until 1994. The exclusion zone declared here is a belligerent act, not a maritime zone.",
  },
  {
    file: "fragmentation-1991.json",
    id: "fragmentation_1991",
    year: 1991,
    bbox: [11, 39, 25, 49],
    has_eez: false,
    note: "Republics becoming states, and internal administrative lines becoming international boundaries overnight. UNCLOS is three years from force.",
  },
];

/**
 * The stated frame must actually contain the scenario.
 *
 * Territory bounding boxes are no use for framing — France reaches across four
 * oceans — and neither is a majority of centroids. London and Washington are
 * players in a canal crisis; they do not live in the canal. The check is only
 * that the frame is not empty of the scenario, and not the whole globe unless
 * the scenario is.
 */
function checkFrame(id, bbox) {
  const entries = manifest.scenarios[id];
  if (!entries?.length) throw new Error(`no geometry for ${id}`);
  const inside = entries.filter(
    ({ centroid: [lon, lat] }) =>
      lon >= bbox[0] && lon <= bbox[2] && lat >= bbox[1] && lat <= bbox[3],
  );
  if (inside.length === 0) {
    throw new Error(`${id}: frame [${bbox}] contains none of the scenario's territories`);
  }
  const spanLon = bbox[2] - bbox[0];
  const spanLat = bbox[3] - bbox[1];
  const worldwide = spanLon > 300 && spanLat > 120;
  if (worldwide && entries.length < 12) {
    throw new Error(`${id}: frame [${bbox}] is the whole world for a ${entries.length}-territory scenario`);
  }
  return { inside: inside.length, total: entries.length };
}

let written = 0;
for (const entry of SCENARIOS) {
  const path = join(repo, "packages/scenarios", entry.file);
  const scenario = JSON.parse(readFileSync(path, "utf8"));
  if (scenario.id !== entry.id) throw new Error(`${entry.file}: expected ${entry.id}, found ${scenario.id}`);

  const bbox = entry.bbox;
  const coverage = checkFrame(entry.id, bbox);
  const spanLon = bbox[2] - bbox[0];
  const midLat = (bbox[1] + bbox[3]) / 2;
  const conic = spanLon <= 120 && Math.abs(midLat) >= 22;

  const geo = {
    year: entry.year,
    theatre_bbox: bbox,
    boundaries_source: `geo/${entry.id}.geojson`,
    projection: conic
      ? {
          kind: "conic_conformal",
          parallels: [
            Math.round((bbox[1] + (bbox[3] - bbox[1]) / 6) * 10) / 10,
            Math.round((bbox[3] - (bbox[3] - bbox[1]) / 6) * 10) / 10,
          ],
          lon0: Math.round(((bbox[0] + bbox[2]) / 2) * 10) / 10,
        }
      : { kind: "equirectangular" },
    note: entry.note,
  };
  if (entry.has_eez !== undefined) geo.has_eez = entry.has_eez;
  if (entry.has_fir !== undefined) geo.has_fir = entry.has_fir;
  if (entry.road_era !== undefined) geo.road_era = entry.road_era;
  if (entry.territorial_sea_nm !== undefined) geo.territorial_sea_nm = entry.territorial_sea_nm;

  scenario.geo = geo;
  writeFileSync(path, `${JSON.stringify(scenario, null, 2)}\n`);
  written++;
  console.log(
    `${entry.id.padEnd(26)} ${entry.year}  [${bbox.join(", ")}]`.padEnd(66) +
      `${geo.projection.kind.padEnd(17)} ${coverage.inside}/${coverage.total} in frame`,
  );
}
console.log(`\nwrote geo blocks into ${written} scenarios`);
