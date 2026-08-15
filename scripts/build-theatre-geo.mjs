/**
 * Build scenario GeoJSON from Natural Earth 110m (public domain).
 * https://www.naturalearthdata.com — public domain.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ne = JSON.parse(readFileSync("/tmp/ne_110m_admin_0_countries.geojson", "utf8"));
const byCode = new Map(ne.features.map((f) => [f.properties.ADM0_A3, f]));

function feat(id, nationId, name, codes, extraGeometry) {
  const geoms = [];
  for (const code of codes) {
    const source = byCode.get(code);
    if (!source) {
      console.warn("missing", code, "for", id);
      continue;
    }
    geoms.push(source.geometry);
  }
  if (extraGeometry) geoms.push(extraGeometry);
  if (geoms.length === 0) return [];
  return geoms.map((geometry, i) => ({
    type: "Feature",
    properties: { id, nationId, name, part: i },
    geometry,
  }));
}

const canal = {
  type: "Polygon",
  coordinates: [[
    [32.22, 29.88], [32.58, 29.88], [32.58, 31.42], [32.22, 31.42], [32.22, 29.88],
  ]],
};
const sinai = {
  type: "Polygon",
  coordinates: [[
    [32.55, 31.22], [34.95, 31.38], [34.55, 29.48], [34.05, 27.92], [32.52, 29.55], [32.55, 31.22],
  ]],
};
const tiran = {
  type: "Polygon",
  coordinates: [[
    [33.92, 28.15], [34.72, 28.38], [34.62, 27.68], [33.9, 27.68], [33.92, 28.15],
  ]],
};
const malta = {
  type: "Polygon",
  coordinates: [[
    [14.18, 35.8], [14.58, 35.8], [14.58, 36.1], [14.18, 36.1], [14.18, 35.8],
  ]],
};
const cyprus = {
  type: "Polygon",
  coordinates: [[
    [32.25, 34.55], [34.6, 34.55], [34.6, 35.7], [32.25, 35.7], [32.25, 34.55],
  ]],
};
/** Distinct patch for the German States chair; Prussia already paints DEU. */
const frankfurt = {
  type: "Polygon",
  coordinates: [[
    [7.45, 47.55], [13.85, 47.55], [13.85, 51.35], [7.45, 51.35], [7.45, 47.55],
  ]],
};
function box(west, south, east, north) {
  return {
    type: "Polygon",
    coordinates: [[[west, south], [east, south], [east, north], [west, north], [west, south]]],
  };
}

const scenarios = {
  sevres_1956: [
    ...feat("egypt_home", "eg", "Egypt", ["EGY"]),
    ...feat("canal_zone", "eg", "Canal Zone", [], canal),
    ...feat("sinai", "eg", "Sinai", [], sinai),
    ...feat("straits_tiran", "eg", "Straits of Tiran", [], tiran),
    ...feat("israel_home", "il", "Israel", ["ISR"]),
    ...feat("cyprus", "uk", "Cyprus", ["CYP"], cyprus),
    ...feat("malta", "uk", "Malta", [], malta),
    ...feat("algeria", "fr", "Algeria", ["DZA"]),
    ...feat("home_isles", "uk", "Home Isles", ["GBR"]),
    ...feat("metropolitan_france", "fr", "Metropolitan France", ["FRA"]),
    ...feat("united_states_home", "us", "United States", ["USA"]),
    ...feat("soviet_home", "su", "Soviet Union", ["RUS"]),
    ...feat("hungary", "su", "Hungary", ["HUN"]),
  ],
  vienna_1815: [
    ...feat("vienna", "at", "Austrian Empire", ["AUT", "HUN", "CZE", "SVK", "SVN", "HRV"]),
    ...feat("london", "gb", "Britain", ["GBR"]),
    ...feat("petersburg", "ru", "Russia", ["RUS", "UKR", "BLR", "LTU", "LVA", "EST", "FIN"]),
    ...feat("berlin", "pr", "Prussia", ["DEU", "POL"]),
    ...feat("paris", "fr", "France", ["FRA"]),
    ...feat("stockholm", "se", "Sweden", ["SWE", "NOR"]),
    ...feat("madrid", "es", "Spain", ["ESP"]),
    ...feat("frankfurt", "de", "German Confederation", ["CHE", "LUX"], frankfurt),
  ],
  july_crisis_1914: [
    ...feat("vienna", "ah", "Austria-Hungary", ["AUT", "HUN", "CZE", "SVK", "SVN", "HRV", "BIH"]),
    ...feat("berlin", "de", "German Empire", ["DEU"]),
    ...feat("petersburg", "ru", "Russian Empire", ["RUS", "UKR", "BLR", "LTU", "LVA", "EST", "FIN", "MDA", "POL"]),
    ...feat("paris", "fr", "France", ["FRA"]),
    ...feat("london", "gb", "Britain", ["GBR"]),
    ...feat("belgrade", "rs", "Serbia", ["SRB"]),
    ...feat("constantinople", "ot", "Ottoman Empire", ["TUR", "SYR", "IRQ", "LBN", "JOR", "ISR"]),
  ],
  thirteen_days_1962: [
    ...feat("united_states_home", "us", "United States", ["USA"]),
    ...feat("jupiter_sites", "us", "Jupiter sites", [], box(32.4, 38.2, 33.6, 39.4)),
    ...feat("soviet_home", "su", "Soviet Union", ["RUS"]),
    ...feat("cuba_missiles", "su", "Missile sites", [], box(-82.6, 21.4, -80.4, 23.2)),
    ...feat("cuba_home", "cu", "Cuba", ["CUB"]),
    ...feat("turkey_home", "tr", "Turkey", ["TUR"]),
    ...feat("un_hq", "un", "Headquarters", [], box(-74.05, 40.68, -73.95, 40.78)),
  ],
  munich_1938: [
    ...feat("berlin", "de", "Berlin", ["DEU"]),
    ...feat("london", "gb", "London", ["GBR"]),
    ...feat("paris", "fr", "Paris", ["FRA"]),
    ...feat("prague", "cz", "Prague", ["CZE", "SVK"]),
    ...feat("sudetenland", "cz", "Sudetenland", [], box(12.4, 49.8, 16.8, 51.15)),
    ...feat("rome", "it", "Rome", ["ITA"]),
    ...feat("moscow", "su", "Moscow", ["RUS"]),
    ...feat("warsaw", "pl", "Warsaw", ["POL"]),
    ...feat("budapest", "hu", "Budapest", ["HUN"]),
  ],
  molotov_ribbentrop_1939: [
    ...feat("berlin", "de", "Berlin", ["DEU"]),
    ...feat("moscow", "su", "Moscow", ["RUS"]),
    ...feat("warsaw", "pl", "Warsaw", ["POL"]),
    ...feat("london", "gb", "London", ["GBR"]),
    ...feat("paris", "fr", "Paris", ["FRA"]),
    ...feat("tokyo", "jp", "Tokyo", ["JPN"]),
  ],
  vietnam_1964: [
    ...feat("united_states_home", "us", "United States", ["USA"]),
    ...feat("hanoi", "drv", "Hanoi", [], box(102.2, 16.6, 109.5, 23.4)),
    ...feat("rural_south", "nlf", "The southern countryside", [], box(105.4, 9.2, 109.3, 13.9)),
    ...feat("saigon", "rvn", "Saigon", [], box(104.5, 8.5, 109.5, 16.5)),
    ...feat("soviet_home", "su", "Soviet Union", ["RUS"]),
    ...feat("beijing", "cn", "Beijing", ["CHN"]),
    ...feat("phnom_penh", "kh", "Phnom Penh", ["KHM"]),
    ...feat("vientiane", "la", "Vientiane", ["LAO"]),
    ...feat("canberra", "au", "Canberra", ["AUS"]),
  ],
  afghanistan_1979: [
    ...feat("soviet_home", "su", "Soviet Union", ["RUS"]),
    ...feat("kabul", "dra", "Kabul", ["AFG"]),
    ...feat("nangarhar", "hiz", "Nangarhar", [], box(69.7, 33.9, 71.3, 34.85)),
    ...feat("panjshir", "jam", "Panjshir", [], box(69.15, 35.15, 70.25, 35.95)),
    ...feat("paktia", "har", "Paktia", [], box(68.7, 32.75, 70.05, 33.85)),
    ...feat("islamabad", "pk", "Islamabad", ["PAK"]),
    ...feat("united_states_home", "us", "United States", ["USA"]),
    ...feat("riyadh", "sa", "Riyadh", ["SAU"]),
    ...feat("tehran", "ir", "Tehran", ["IRN"]),
  ],
  korea_1950: [
    ...feat("united_states_home", "us", "United States", ["USA"]),
    ...feat("seoul", "kr", "Seoul", ["KOR"]),
    ...feat("pyongyang", "kp", "Pyongyang", ["PRK"]),
    ...feat("beijing", "cn", "Beijing", ["CHN"]),
    ...feat("soviet_home", "su", "Soviet Union", ["RUS"]),
    ...feat("home_isles", "uk", "Home Isles", ["GBR"]),
    ...feat("japan_home", "jp", "Japan", ["JPN"]),
  ],
  the_concept_1967: [
    ...feat("israel_home", "il", "Israel", ["ISR"]),
    ...feat("egypt_home", "eg", "Egypt", ["EGY"]),
    ...feat("sinai", "eg", "Sinai", [], sinai),
    ...feat("syria_home", "sy", "Syria", ["SYR"]),
    ...feat("golan", "sy", "Golan", [], box(35.55, 32.68, 35.98, 33.32)),
    ...feat("jordan_home", "jo", "Jordan", ["JOR"]),
    ...feat("west_bank", "jo", "West Bank", [], box(34.86, 31.33, 35.58, 32.56)),
    ...feat("iraq_home", "iq", "Iraq", ["IRQ"]),
    ...feat("soviet_home", "su", "Soviet Union", ["RUS"]),
    ...feat("united_states_home", "us", "United States", ["USA"]),
    ...feat("metropolitan_france", "fr", "Metropolitan France", ["FRA"]),
  ],
  malvinas_1982: [
    ...feat("home_isles", "uk", "Home Isles", ["GBR"]),
    ...feat("falklands", "uk", "the Falklands", [], box(-61.5, -52.55, -57.65, -51.15)),
    ...feat("buenos_aires", "ar", "Buenos Aires", ["ARG"]),
    ...feat("united_states_home", "us", "United States", ["USA"]),
    ...feat("santiago", "cl", "Santiago", ["CHL"]),
    ...feat("metropolitan_france", "fr", "Metropolitan France", ["FRA"]),
    ...feat("soviet_home", "su", "Soviet Union", ["RUS"]),
  ],
  tanker_war_1980: [
    ...feat("baghdad", "iq", "Baghdad", ["IRQ"]),
    ...feat("tehran", "ir", "Tehran", ["IRN"]),
    ...feat("united_states_home", "us", "United States", ["USA"]),
    ...feat("soviet_home", "su", "Soviet Union", ["RUS"]),
    ...feat("metropolitan_france", "fr", "Metropolitan France", ["FRA"]),
    ...feat("kuwait_home", "kw", "Kuwait", ["KWT"]),
    ...feat("riyadh", "sa", "Riyadh", ["SAU"]),
    ...feat("damascus", "sy", "Damascus", ["SYR"]),
  ],
  long_telegram_1947: [
    ...feat("united_states_home", "us", "United States", ["USA"]),
    ...feat("soviet_home", "su", "Soviet Union", ["RUS"]),
    ...feat("beijing", "cn", "Beijing", ["CHN"]),
    ...feat("home_isles", "uk", "Home Isles", ["GBR"]),
    ...feat("metropolitan_france", "fr", "Metropolitan France", ["FRA"]),
    ...feat("bonn", "de", "Bonn", ["DEU"]),
    ...feat("belgrade", "yu", "Belgrade", ["SRB"]),
    ...feat("delhi", "in", "Delhi", ["IND"]),
    ...feat("egypt_home", "eg", "Egypt", ["EGY"]),
    ...feat("cuba_home", "cu", "Cuba", ["CUB"]),
    ...feat("hanoi", "drv", "Hanoi", [], box(102.2, 16.6, 109.5, 23.4)),
    ...feat("saigon", "rvn", "Saigon", [], box(104.5, 8.5, 109.5, 16.5)),
    ...feat("pyongyang", "kp", "Pyongyang", ["PRK"]),
    ...feat("seoul", "kr", "Seoul", ["KOR"]),
    ...feat("tehran", "ir", "Tehran", ["IRN"]),
    ...feat("israel_home", "il", "Israel", ["ISR"]),
    ...feat("warsaw", "pl", "Warsaw", ["POL"]),
    ...feat("budapest", "hu", "Budapest", ["HUN"]),
    ...feat("prague", "cz", "Prague", ["CZE"]),
    ...feat("santiago", "cl", "Santiago", ["CHL"]),
    ...feat("leopoldville", "cg", "Léopoldville", ["COD"]),
    ...feat("jakarta", "id", "Jakarta", ["IDN"]),
    ...feat("luanda", "ao", "Luanda", ["AGO"]),
  ],
  berlin_conference_1884: [
    ...feat("london", "gb", "London", ["GBR"]),
    ...feat("paris", "fr", "Paris", ["FRA"]),
    ...feat("berlin", "de", "Berlin", ["DEU"]),
    ...feat("brussels", "be", "Brussels", ["BEL"]),
    ...feat("lisbon", "pt", "Lisbon", ["PRT"]),
    ...feat("rome", "it", "Rome", ["ITA"]),
    ...feat("madrid", "es", "Madrid", ["ESP"]),
    ...feat("addis", "et", "Addis Ababa", ["ETH"]),
    ...feat("kumasi", "as", "Kumasi", ["GHA"]),
    ...feat("sokoto", "sk", "Sokoto", [], box(4.4, 11.4, 6.6, 13.9)),
    ...feat("ulundi", "zu", "Ulundi", [], box(30.7, -29.25, 32.25, -27.7)),
    ...feat("mengo", "bg", "Mengo", ["UGA"]),
    ...feat("antananarivo", "mg", "Antananarivo", ["MDG"]),
  ],
  fragmentation_1991: [
    ...feat("belgrade", "rs", "Belgrade", ["SRB"]),
    ...feat("zagreb", "hr", "Zagreb", ["HRV"]),
    ...feat("sarajevo", "ba", "Sarajevo", ["BIH"]),
    ...feat("ljubljana", "si", "Ljubljana", ["SVN"]),
    ...feat("skopje", "mk", "Skopje", ["MKD"]),
    ...feat("pristina", "xk", "Pristina", [], box(20.85, 42.35, 21.55, 42.95)),
    ...feat("brussels", "eu", "Brussels", ["BEL"]),
    ...feat("united_states_home", "us", "United States", ["USA"]),
    ...feat("moscow", "ru", "Moscow", ["RUS"]),
    ...feat("un_hq", "un", "Headquarters", [], box(-74.05, 40.68, -73.95, 40.78)),
  ],
  grand_alliance_1939: [
    ...feat("berlin", "de", "Berlin", ["DEU"]),
    ...feat("rome", "it", "Rome", ["ITA"]),
    ...feat("tokyo", "jp", "Tokyo", ["JPN"]),
    ...feat("london", "uk", "London", ["GBR"]),
    ...feat("paris", "fr", "Paris", ["FRA"]),
    ...feat("moscow", "su", "Moscow", ["RUS"]),
    ...feat("united_states_home", "us", "United States", ["USA"]),
    ...feat("chongqing", "cn", "Chongqing", ["CHN"]),
    ...feat("warsaw", "pl", "Warsaw", ["POL"]),
    ...feat("helsinki", "fi", "Helsinki", ["FIN"]),
    ...feat("budapest", "hu", "Budapest", ["HUN"]),
    ...feat("bucharest", "ro", "Bucharest", ["ROU"]),
    ...feat("belgrade", "yu", "Belgrade", ["SRB"]),
    ...feat("madrid", "es", "Madrid", ["ESP"]),
    ...feat("stockholm", "se", "Stockholm", ["SWE"]),
  ],
};

const outDir = join(root, "apps/web/public/geo");
mkdirSync(outDir, { recursive: true });
for (const [id, features] of Object.entries(scenarios)) {
  const collection = { type: "FeatureCollection", features };
  writeFileSync(join(outDir, `${id}.geojson`), JSON.stringify(collection));
  console.log(id, features.length, "features");
}

const land = {
  type: "FeatureCollection",
  features: ne.features.map((f) => ({
    type: "Feature",
    properties: {},
    geometry: f.geometry,
  })),
};
writeFileSync(join(outDir, "land.geojson"), JSON.stringify(land));
console.log("land", land.features.length, "features");
