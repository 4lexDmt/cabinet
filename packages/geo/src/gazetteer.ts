/**
 * Tier-1 named gazetteer. Centroids, adjacency and named water.
 *
 * ADM1 polygons are not stored here — they are dissolved offline into
 * `apps/web/public/geo/mapkit/tier1_provinces.geojson`. This package
 * performs no I/O. Validate at load; throw on a malformed file so a
 * silent schema drift cannot reach the plate.
 */

import raw from "../data/tier1-complete.json";
import {
  gazetteerSchema,
  type City,
  type Country,
  type Gazetteer,
  type Lake,
  type Province,
  type River,
  type WaterNote,
} from "./schema.ts";

export const TIER1_ISOS = [
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
] as const;

export type Tier1Iso = (typeof TIER1_ISOS)[number];

export const ISLAND_PROVINCES = ["us-hawaii", "fr-reu"] as const;

export const SHARED_LAKE_IDS = [
  "lk-superior",
  "lk-huron",
  "lk-erie",
  "lk-ontario",
  "lk-caspian",
  "lk-chad",
  "lk-itaipu",
  "lk-constance",
  "lk-geneva",
] as const;

export const SHARED_RIVER_IDS = [
  "rv-amazon",
  "rv-amur",
  "rv-benue",
  "rv-brahmaputra",
  "rv-colorado",
  "rv-columbia",
  "rv-danube-de",
  "rv-elbe",
  "rv-euphrates",
  "rv-ganges",
  "rv-indus",
  "rv-niger",
  "rv-parana",
  "rv-rhine",
  "rv-rhone",
  "rv-stlawrence",
  "rv-tigris",
] as const;

export const PROVINCE_COUNT_BANDS: Record<Tier1Iso, readonly [number, number]> = {
  RUS: [24, 30],
  USA: [24, 30],
  CHN: [24, 30],
  IND: [20, 26],
  BRA: [18, 24],
  IDN: [18, 24],
  IRN: [16, 22],
  NGA: [15, 20],
  TUR: [15, 20],
  DEU: [14, 18],
  JPN: [14, 18],
  FRA: [13, 18],
  GBR: [12, 16],
  SAU: [12, 16],
};

export const BUILD_CAPACITY: Record<Tier1Iso, number> = {
  USA: 115,
  BRA: 100,
  DEU: 64,
  GBR: 67,
  FRA: 67,
  CHN: 130,
  IND: 119,
  JPN: 83,
  IDN: 87,
  RUS: 90,
  TUR: 85,
  IRN: 79,
  SAU: 60,
  NGA: 81,
};

const MONTH_INDEX: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

export const gazetteer: Gazetteer = gazetteerSchema.parse(raw);

const byIso = new Map<string, Country>();
const provinceIndex = new Map<string, Province>();
const provinceIso = new Map<string, string>();

for (const country of gazetteer.countries) {
  byIso.set(country.iso, country);
  for (const province of country.provinces) {
    provinceIndex.set(province.id, province);
    provinceIso.set(province.id, country.iso);
  }
}

function requireCountry(iso: string): Country {
  const country = byIso.get(iso);
  if (!country) throw new Error(`unknown gazetteer iso ${iso}`);
  return country;
}

export function countryOf(iso: string): Country {
  return requireCountry(iso);
}

export function countries(): Country[] {
  return gazetteer.countries;
}

export function provincesOf(iso: string): Province[] {
  return requireCountry(iso).provinces;
}

export function citiesOf(iso: string): City[] {
  return requireCountry(iso).cities;
}

export function lakesOf(iso: string): Lake[] {
  return requireCountry(iso).lakes;
}

export function riversOf(iso: string): River[] {
  return requireCountry(iso).rivers;
}

export function bordersOf(provinceId: string): string[] {
  const province = provinceIndex.get(provinceId);
  if (!province) throw new Error(`unknown province ${provinceId}`);
  return province.borders;
}

export function provinceById(provinceId: string): Province | undefined {
  return provinceIndex.get(provinceId);
}

export function isoOfProvince(provinceId: string): string | undefined {
  return provinceIso.get(provinceId);
}

export function waterNoteOf(iso: string): WaterNote | undefined {
  return requireCountry(iso).water_note;
}

export function buildCapacityOf(iso: string): number {
  const country = requireCountry(iso);
  let total = 0;
  for (const province of country.provinces) total += province.build_slots;
  for (const city of country.cities) total += city.build_slots;
  return total;
}

function firstById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

export function uniqueLakes(): Lake[] {
  return firstById(gazetteer.countries.flatMap((c) => c.lakes));
}

export function uniqueRivers(): River[] {
  return firstById(gazetteer.countries.flatMap((c) => c.rivers));
}

/** Unique lakes and rivers that carry diplomatic weight (`shared: true`). */
export function sharedWaters(): Array<Lake | River> {
  const lakes = uniqueLakes().filter((lake) => lake.shared);
  const rivers = uniqueRivers().filter((river) => river.shared);
  return [...lakes, ...rivers];
}

export function allProvinces(): Province[] {
  return gazetteer.countries.flatMap((c) => c.provinces);
}

/**
 * Parse a gazetteer `ice_months` string into calendar months 1–12.
 * Parentheticals are ignored. `"none"` / null / empty → closed never.
 * Wrap-around ranges (`Sep-Jun`) are inclusive.
 */
export function iceMonthsToClosed(raw: string | null | undefined): number[] {
  if (raw == null) return [];
  const stripped = raw.replace(/\([^)]*\)/g, " ").trim().toLowerCase();
  if (stripped === "" || stripped === "none" || stripped === "null") return [];
  const match = stripped.match(/^([a-z]{3})\s*[-–—to]+\s*([a-z]{3})$/);
  if (!match) {
    const single = MONTH_INDEX[stripped.slice(0, 3)];
    return single ? [single] : [];
  }
  const start = MONTH_INDEX[match[1]!];
  const end = MONTH_INDEX[match[2]!];
  if (!start || !end) return [];
  const months: number[] = [];
  let cursor = start;
  for (let i = 0; i < 12; i++) {
    months.push(cursor);
    if (cursor === end) break;
    cursor = cursor === 12 ? 1 : cursor + 1;
  }
  return months;
}
