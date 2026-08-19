/**
 * Integer corridors compiled from the gazetteer.
 *
 * Geometry lives here: lake radii, river polylines, ice-month parsing.
 * The tick sees only ids, travel_ticks, and closed_months 1–12.
 */

import chokepointRaw from "../data/tier1-chokepoints.json";
import { EARTH_RADIUS_M } from "./projection.ts";
import {
  gazetteer,
  iceMonthsToClosed,
  isoOfProvince,
  uniqueLakes,
  uniqueRivers,
} from "./gazetteer.ts";
import { chokepointFileSchema, type Chokepoint, type Lake } from "./schema.ts";
import type { Country, Province, River } from "./schema.ts";
import type { LonLat } from "./types.ts";

const DEG = Math.PI / 180;
const EARTH_KM = EARTH_RADIUS_M / 1000;

export const NAVIGABLE_LAKE = new Set([
  "sea",
  "seaway",
  "lake",
  "barge",
  "lock",
  "canal",
  "ferry",
]);

const KM_PER_TICK: Record<CorridorMode, number> = {
  road: 400,
  rail: 500,
  sea: 800,
  water: 250,
  canal: 80,
};

const BARRIER_PENALTY_TICKS = 3;
const SHORE_KM = 40;

export type CorridorMode = "road" | "rail" | "sea" | "water" | "canal";

export interface CorridorDraft {
  id: string;
  from: string;
  to: string;
  travel_ticks: number;
  mode: CorridorMode;
  capacity?: number;
  closed_months?: number[];
  water_id?: string;
}

export interface SiteDraft {
  id: string;
  kind: "province" | "city";
  nationId: string;
  slots: number;
  tier?: 1 | 2 | 3;
  water_ids: string[];
  coastal: boolean;
}

export const tier1Chokepoints: Chokepoint[] = chokepointFileSchema.parse(chokepointRaw).chokepoints;

export function citySiteId(iso: string, cityName: string): string {
  return `city:${iso}:${cityName}`;
}

export function haversineKm(a: LonLat, b: LonLat): number {
  const lat1 = a[1] * DEG;
  const lat2 = b[1] * DEG;
  const dLat = (b[1] - a[1]) * DEG;
  const dLon = (b[0] - a[0]) * DEG;
  const sin = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_KM * Math.asin(Math.min(1, Math.sqrt(sin)));
}

export function lakeRadiusKm(areaKm2: number): number {
  return Math.sqrt(areaKm2 / Math.PI);
}

function lerpLonLat(a: LonLat, b: LonLat, t: number): LonLat {
  let dLon = b[0] - a[0];
  if (dLon > 180) dLon -= 360;
  if (dLon < -180) dLon += 360;
  return [a[0] + dLon * t, a[1] + (b[1] - a[1]) * t];
}

function sampleSegment(a: LonLat, b: LonLat, steps = 8): LonLat[] {
  const out: LonLat[] = [];
  for (let i = 0; i <= steps; i++) out.push(lerpLonLat(a, b, i / steps));
  return out;
}

function minDistanceKm(samples: LonLat[], point: LonLat): number {
  let best = Infinity;
  for (const sample of samples) {
    const d = haversineKm(sample, point);
    if (d < best) best = d;
  }
  return best;
}

function polylineDistanceKm(a: LonLat[], b: LonLat[]): number {
  let best = Infinity;
  for (let i = 0; i < a.length - 1; i++) {
    const samples = sampleSegment(a[i]!, a[i + 1]!);
    for (const pt of b) {
      const d = minDistanceKm(samples, pt);
      if (d < best) best = d;
    }
  }
  return best;
}

/** True when a road chord crosses open water without a shore endpoint. */
export function chordCrossesWater(from: LonLat, to: LonLat, lakes: Lake[], rivers: River[]): boolean {
  const samples = sampleSegment(from, to);
  for (const lake of lakes) {
    if (lake.navigable === "none") continue;
    const radius = lakeRadiusKm(lake.area_km2);
    if (radius < 15) continue;
    const mid = minDistanceKm(samples, lake.centroid);
    const shoreA = haversineKm(from, lake.centroid);
    const shoreB = haversineKm(to, lake.centroid);
    if (mid < radius && shoreA > radius + SHORE_KM && shoreB > radius + SHORE_KM) return true;
  }
  for (const river of rivers) {
    if (river.navigable_km <= 0) continue;
    const mid = polylineDistanceKm([from, to], river.course);
    const endA = Math.min(...river.course.map((pt) => haversineKm(from, pt)));
    const endB = Math.min(...river.course.map((pt) => haversineKm(to, pt)));
    if (mid < 25 && endA > SHORE_KM && endB > SHORE_KM) return true;
  }
  return false;
}

function ticksFromKm(km: number, mode: CorridorMode): number {
  return Math.max(1, Math.ceil(km / KM_PER_TICK[mode]));
}

function ticksFromHours(hours: number): number {
  return Math.max(1, Math.ceil(hours / 24));
}

function undirectedKey(a: string, b: string, mode: string): string {
  return a < b ? `${mode}:${a}:${b}` : `${mode}:${b}:${a}`;
}

function ordered(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

function addCorridor(
  bag: Map<string, CorridorDraft>,
  draft: Omit<CorridorDraft, "from" | "to"> & { from: string; to: string },
): void {
  if (draft.from === draft.to) return;
  const [from, to] = ordered(draft.from, draft.to);
  const key = undirectedKey(from, to, draft.mode);
  const existing = bag.get(key);
  const next: CorridorDraft = { ...draft, from, to, id: draft.id };
  if (!existing || next.travel_ticks < existing.travel_ticks) bag.set(key, next);
}

function nodeGraphId(country: Country, nodeName: string): string | null {
  const node = country.nodes.find((n) => n.name === nodeName);
  if (!node) return null;
  if (node.kind === "province_seat") {
    const province = country.provinces.find((p) => p.seat === node.name);
    if (province) return province.id;
  }
  const city = country.cities.find((c) => c.name === node.name);
  if (city) return citySiteId(country.iso, city.name);
  return node.id;
}

function nodeCoord(country: Country, nodeName: string): LonLat | null {
  const node = country.nodes.find((n) => n.name === nodeName);
  return node ? node.coord : null;
}

function countryByIso(iso: string): Country | undefined {
  return gazetteer.countries.find((c) => c.iso === iso);
}

function iceForProvinces(ids: string[], lakes: Lake[]): number[] {
  const months = new Set<number>();
  for (const lake of lakes) {
    if (!ids.includes(lake.nearest_province)) continue;
    for (const m of iceMonthsToClosed(lake.ice_months)) months.add(m);
  }
  return [...months].sort((a, b) => a - b);
}

export function compileCorridors(): CorridorDraft[] {
  const bag = new Map<string, CorridorDraft>();
  const lakes = uniqueLakes();
  const rivers = uniqueRivers();

  for (const country of gazetteer.countries) {
    for (const province of country.provinces) {
      for (const neighbour of province.borders) {
        const other = gazetteer.countries
          .flatMap((c) => c.provinces)
          .find((p) => p.id === neighbour);
        if (!other) continue;
        const km = haversineKm(province.centroid, other.centroid);
        addCorridor(bag, {
          id: `land:${province.id}:${neighbour}`,
          from: province.id,
          to: neighbour,
          travel_ticks: ticksFromKm(km, "road"),
          mode: "road",
        });
      }
    }

    for (const edge of country.edges) {
      const fromId = nodeGraphId(country, edge.from_name);
      const toId = nodeGraphId(country, edge.to_name);
      if (!fromId || !toId) continue;
      const fromCoord = nodeCoord(country, edge.from_name);
      const toCoord = nodeCoord(country, edge.to_name);
      const mode: CorridorMode = edge.mode === "sea" ? "sea" : "road";
      let ticks = edge.hours > 0 ? ticksFromHours(edge.hours) : ticksFromKm(edge.km, mode);
      if (fromCoord && toCoord && mode === "road" && chordCrossesWater(fromCoord, toCoord, lakes, rivers)) {
        ticks += BARRIER_PENALTY_TICKS;
      }
      addCorridor(bag, {
        id: `edge:${country.iso}:${edge.from_name}:${edge.to_name}`,
        from: fromId,
        to: toId,
        travel_ticks: ticks,
        mode,
      });
    }

    for (const lane of country.international) {
      const fromCountry = countryByIso(lane.from_iso);
      const toCountry = countryByIso(lane.to_iso);
      if (!fromCountry || !toCountry) continue;
      const fromId = nodeGraphId(fromCountry, lane.from_name);
      const toId = nodeGraphId(toCountry, lane.to_name);
      if (!fromId || !toId) continue;
      const mode: CorridorMode = lane.mode === "rail" ? "rail" : lane.mode === "road" ? "road" : "sea";
      addCorridor(bag, {
        id: `intl:${lane.route}`,
        from: fromId,
        to: toId,
        travel_ticks: ticksFromKm(lane.km, mode),
        mode,
      });
    }
  }

  for (const lake of lakes) {
    if (!NAVIGABLE_LAKE.has(lake.navigable)) continue;
    const members = lakeProvinces(lake);
    const hub = lake.nearest_province;
    const closed = iceMonthsToClosed(lake.ice_months);
    for (const member of members) {
      if (member === hub) continue;
      const fromP = provinceCentroid(hub);
      const toP = provinceCentroid(member);
      const km = fromP && toP ? haversineKm(fromP, toP) : 200;
      addCorridor(bag, {
        id: `water:${lake.id}:${hub}:${member}`,
        from: hub,
        to: member,
        travel_ticks: ticksFromKm(km, "water"),
        mode: "water",
        closed_months: closed,
        water_id: lake.id,
      });
    }
  }

  for (const river of rivers) {
    if (river.navigable_km <= 0) continue;
    const chain = riverProvinceChain(river);
    const closed = iceForProvinces(chain, lakes);
    for (let i = 0; i < chain.length - 1; i++) {
      const a = chain[i]!;
      const b = chain[i + 1]!;
      const fromP = provinceCentroid(a);
      const toP = provinceCentroid(b);
      const km = fromP && toP ? haversineKm(fromP, toP) : river.navigable_km / Math.max(1, chain.length - 1);
      addCorridor(bag, {
        id: `water:${river.id}:${a}:${b}`,
        from: a,
        to: b,
        travel_ticks: ticksFromKm(km, "water"),
        mode: "water",
        closed_months: closed,
        water_id: river.id,
      });
    }
  }

  for (const choke of tier1Chokepoints) {
    addCorridor(bag, {
      id: choke.id,
      from: choke.from,
      to: choke.to,
      travel_ticks: ticksFromKm(choke.km, "canal"),
      mode: "canal",
      capacity: choke.capacity,
      closed_months: choke.closed_months,
      water_id: choke.id,
    });
  }

  return [...bag.values()].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

function provinceCentroid(id: string): LonLat | null {
  for (const country of gazetteer.countries) {
    const province = country.provinces.find((p) => p.id === id);
    if (province) return province.centroid;
  }
  return null;
}

function lakeProvinces(lake: Lake): string[] {
  const radius = lakeRadiusKm(lake.area_km2) * 2;
  const ids = new Set<string>([lake.nearest_province]);
  for (const country of gazetteer.countries) {
    if (!lake.riparian.includes(country.iso) && country.iso !== isoOfProvince(lake.nearest_province)) {
      continue;
    }
    for (const province of country.provinces) {
      if (haversineKm(province.centroid, lake.centroid) <= Math.max(radius, 180)) ids.add(province.id);
    }
  }
  return [...ids].sort();
}

function riverProvinceChain(river: River): string[] {
  const pool: Province[] = [];
  for (const country of gazetteer.countries) {
    if (!river.riparian.includes(country.iso)) continue;
    pool.push(...country.provinces);
  }
  if (pool.length === 0) {
    for (const country of gazetteer.countries) pool.push(...country.provinces);
  }
  const chain: string[] = [];
  for (const waypoint of river.course) {
    let best: Province | null = null;
    let bestD = Infinity;
    for (const province of pool) {
      const d = haversineKm(province.centroid, waypoint);
      if (d < bestD) {
        bestD = d;
        best = province;
      }
    }
    if (best && chain[chain.length - 1] !== best.id) chain.push(best.id);
  }
  return chain;
}

function watersTouchingProvince(province: Province, iso: string): string[] {
  const ids = new Set<string>();
  for (const lake of uniqueLakes()) {
    if (lake.nearest_province === province.id) ids.add(lake.id);
    else if (
      lake.riparian.includes(iso) &&
      haversineKm(province.centroid, lake.centroid) <= Math.max(lakeRadiusKm(lake.area_km2) * 2, 150)
    ) {
      ids.add(lake.id);
    }
  }
  for (const river of uniqueRivers()) {
    if (!river.riparian.includes(iso)) continue;
    const near = river.course.some((pt) => haversineKm(province.centroid, pt) <= 180);
    if (near) ids.add(river.id);
  }
  return [...ids].sort();
}

function provinceIsCoastal(country: Country, province: Province): boolean {
  if (country.cities.some((c) => c.province === province.id && c.port)) return true;
  if (country.nodes.some((n) => n.port && n.kind === "province_seat" && n.name === province.seat)) return true;
  if (country.edges.some((e) => e.mode === "sea" && (e.from_name === province.seat || e.to_name === province.seat))) {
    return true;
  }
  const note = country.water_note;
  if (note) {
    for (const asset of note.assets) {
      if (asset.type !== "desalination") continue;
      const nearest = country.provinces.reduce((best, p) =>
        haversineKm(p.centroid, asset.coord) < haversineKm(best.centroid, asset.coord) ? p : best,
      );
      if (nearest.id === province.id) return true;
    }
  }
  return false;
}

export function compileSites(): SiteDraft[] {
  const sites: SiteDraft[] = [];
  for (const country of gazetteer.countries) {
    for (const province of country.provinces) {
      sites.push({
        id: province.id,
        kind: "province",
        nationId: country.iso,
        slots: province.build_slots,
        water_ids: watersTouchingProvince(province, country.iso),
        coastal: provinceIsCoastal(country, province),
      });
    }
    for (const city of country.cities) {
      const province = country.provinces.find((p) => p.id === city.province);
      const water = province ? watersTouchingProvince(province, country.iso) : [];
      sites.push({
        id: citySiteId(country.iso, city.name),
        kind: "city",
        nationId: country.iso,
        slots: city.build_slots,
        tier: city.tier,
        water_ids: water,
        coastal: city.port || (province ? provinceIsCoastal(country, province) : false),
      });
    }
  }
  return sites.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

export function volgaProvinceChain(): string[] {
  const volga = uniqueRivers().find((r) => r.id === "rv-volga");
  if (!volga) return [];
  return riverProvinceChain(volga);
}
