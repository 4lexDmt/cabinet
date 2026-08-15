import type { MatchRecord } from "@cabinet/db";
import type { Nation } from "@cabinet/sim";
import { alignmentPairs, knownPacts, obligationsOnTerritory, pillarReading } from "@/lib/desk-model";
import {
  coverageOf,
  formationReadings,
  provenanceCopy,
  shortNation,
  territoryReading,
  type DisplayProvenance,
  type Staleness,
  type VisualConfidence,
} from "@/lib/belief-view";

export type MapMode = "political" | "period" | "alignment" | "intel";

export const MAP_MODES: MapMode[] = ["political", "period", "alignment", "intel"];

/** HOI4-like political fills. Distinct per chair, never neon. */
export const NATION_FILL: Record<string, string> = {
  uk: "#2f5f8f",
  gb: "#2f5f8f",
  fr: "#4a7cb0",
  eg: "#c4a056",
  il: "#3d7a58",
  us: "#3a6b5c",
  su: "#8b3d3d",
  at: "#c4b06a",
  ah: "#c4b06a",
  ru: "#7a4048",
  pr: "#5c5c58",
  de: "#6a6a64",
  se: "#3d7a88",
  es: "#b05a40",
  rs: "#8a4a42",
  ot: "#8a7a48",
};

export function fillForNation(nationId: string | null): string {
  if (!nationId) return "#2a333c";
  if (NATION_FILL[nationId]) return NATION_FILL[nationId];
  let hash = 0;
  for (const ch of nationId) hash = (hash * 33 + ch.charCodeAt(0)) >>> 0;
  const hues = [
    "#2f5f8f",
    "#4a7cb0",
    "#c4a056",
    "#3d7a58",
    "#8b3d3d",
    "#c4b06a",
    "#7a4048",
    "#b05a40",
    "#3d7a88",
    "#8a7a48",
    "#6a6a64",
    "#5a4a78",
  ];
  return hues[hash % hues.length] ?? "#4a5560";
}

export interface PeriodChart {
  url: string;
  /** Leaflet bounds: [[south, west], [north, east]] */
  bounds: [[number, number], [number, number]];
  opacity: number;
  credit: string;
}

export interface TheatreCamera {
  center: [number, number];
  zoom: number;
  minZoom: number;
  maxZoom: number;
}

export interface TerritoryInstrument {
  id: string;
  title: string;
  status: string;
  youAreParty: boolean;
}

export interface TerritoryPaint {
  id: string;
  name: string;
  region: string;
  supplyValue: number;
  controllerId: string | null;
  holderName: string;
  visual: VisualConfidence | "blind";
  provenance: DisplayProvenance | null;
  provenanceLabel: string | null;
  stale: Staleness | null;
  lastUpdatedTick: number | null;
  occupied: boolean;
  contested: boolean;
  nothingInFile: boolean;
  covered: boolean;
  instruments: TerritoryInstrument[];
}

export interface ForceMark {
  location: string;
  weight: number;
  visual: VisualConfidence;
}

export interface AlignmentLink {
  a: string;
  b: string;
  title: string;
  secret: boolean;
}

export interface TheatreView {
  matchId: string;
  scenarioId: string;
  tick: number;
  nationId: string;
  nationName: string;
  territories: TerritoryPaint[];
  formations: ForceMark[];
  alignments: AlignmentLink[];
  allyIds: string[];
  warIds: string[];
  nations: Array<{ id: string; name: string; shortName: string }>;
  pillars: {
    standingExternal: number;
    standingInternal: number;
    intel: number;
    economy: number;
    force: number;
  };
}

const EUROPE_1914: PeriodChart = {
  url: "/maps/europe-1914-usma.jpg",
  bounds: [
    [32, -12],
    [72, 48],
  ],
  opacity: 0.78,
  credit: "USMA, Europe 1914 — Central, Entente and Neutral powers. PD-USGov.",
};

const EUROPE_1815: PeriodChart = {
  url: "/maps/europe-1815-nie.jpg",
  bounds: [
    [35, -15],
    [60, 25],
  ],
  opacity: 0.8,
  credit: "New International Encyclopædia, 1905. Europe after the Congress of Vienna. PD-US.",
};

const SUEZ_1956: PeriodChart = {
  url: "/maps/suez-1956-usma.jpg",
  bounds: [
    [27.35, 31.65],
    [31.9, 35.95],
  ],
  opacity: 0.82,
  credit: "USMA, Conquest of Sinai, 1–5 November 1956. PD-USGov.",
};

const PERIOD_CHART: Record<string, PeriodChart> = {
  sevres_1956: SUEZ_1956,
  the_concept_1967: SUEZ_1956,
  vienna_1815: EUROPE_1815,
  july_crisis_1914: EUROPE_1914,
  munich_1938: EUROPE_1914,
  molotov_ribbentrop_1939: EUROPE_1914,
  grand_alliance_1939: EUROPE_1914,
  fragmentation_1991: EUROPE_1914,
};

const EUROPE: TheatreCamera = { center: [49.8, 18.2], zoom: 4.4, minZoom: 2, maxZoom: 8 };
const WORLD: TheatreCamera = { center: [20, 20], zoom: 2.4, minZoom: 2, maxZoom: 8 };

const CAMERA: Record<string, TheatreCamera> = {
  sevres_1956: { center: [31.1, 32.4], zoom: 6, minZoom: 2, maxZoom: 9 },
  thirteen_days_1962: { center: [23, -72], zoom: 4, minZoom: 2, maxZoom: 8 },
  munich_1938: EUROPE,
  molotov_ribbentrop_1939: { center: [48, 40], zoom: 3.4, minZoom: 2, maxZoom: 8 },
  vienna_1815: { center: [49.4, 14.2], zoom: 4.2, minZoom: 3, maxZoom: 8 },
  july_crisis_1914: EUROPE,
  vietnam_1964: { center: [16, 106], zoom: 5, minZoom: 2, maxZoom: 8 },
  afghanistan_1979: { center: [33.5, 66], zoom: 5.2, minZoom: 2, maxZoom: 8 },
  korea_1950: { center: [38, 127], zoom: 5.5, minZoom: 2, maxZoom: 9 },
  the_concept_1967: { center: [31.4, 35.2], zoom: 6, minZoom: 2, maxZoom: 9 },
  malvinas_1982: { center: [-45, -50], zoom: 3.2, minZoom: 2, maxZoom: 8 },
  tanker_war_1980: { center: [29, 48], zoom: 5, minZoom: 2, maxZoom: 8 },
  long_telegram_1947: WORLD,
  berlin_conference_1884: { center: [5, 15], zoom: 3.2, minZoom: 2, maxZoom: 8 },
  fragmentation_1991: { center: [44.5, 18.5], zoom: 6, minZoom: 2, maxZoom: 9 },
  grand_alliance_1939: { center: [35, 40], zoom: 3, minZoom: 2, maxZoom: 8 },
};

export function periodChartOf(scenarioId: string): PeriodChart | null {
  return PERIOD_CHART[scenarioId] ?? null;
}

export function cameraOf(scenarioId: string): TheatreCamera {
  return CAMERA[scenarioId] ?? EUROPE;
}

export function asMapMode(value: string | undefined): MapMode {
  return MAP_MODES.includes(value as MapMode) ? (value as MapMode) : "political";
}

/**
 * Belief-only paint list. Advisors never call this; the map HUD may.
 * Planted provenance is already collapsed in territoryReading.
 */
export function buildTheatreView(match: MatchRecord, nation: Nation): TheatreView {
  const coverage = coverageOf(match.world, nation.id);
  const territories = Object.values(match.world.territories).map((territory) => {
    const reading = territoryReading(match.world, nation.id, territory);
    const instruments = obligationsOnTerritory(match, nation.id, territory.id).map((p) => ({
      id: p.id,
      title: p.public_terms.title,
      status: p.status,
      youAreParty: p.parties.includes(nation.id),
    }));
    return {
      id: territory.id,
      name: territory.name,
      region: territory.region,
      supplyValue: territory.supplyValue,
      controllerId: reading.controllerId,
      holderName: shortNation(match.world.nations, reading.controllerId),
      visual: reading.visual,
      provenance: reading.provenance,
      provenanceLabel: reading.provenance ? provenanceCopy(reading.provenance) : null,
      stale: reading.stale,
      lastUpdatedTick: reading.lastUpdatedTick,
      occupied: reading.occupied,
      contested: reading.contested,
      nothingInFile: reading.nothingInFile,
      covered: coverage.has(territory.id),
      instruments,
    } satisfies TerritoryPaint;
  });

  const allyIds = [
    ...new Set(
      knownPacts(match, nation.id)
        .filter((p) => p.status === "active" && p.parties.includes(nation.id))
        .flatMap((p) => p.parties.filter((id) => id !== nation.id)),
    ),
  ];
  const warIds = [
    ...new Set(
      match.world.wars.flatMap((w) => {
        if (w.attacker === nation.id) return [w.defender];
        if (w.defender === nation.id) return [w.attacker];
        return [];
      }),
    ),
  ];
  const pillars = pillarReading(match, nation);

  return {
    matchId: match.id,
    scenarioId: match.world.scenarioId,
    tick: match.world.tick,
    nationId: nation.id,
    nationName: nation.shortName,
    territories,
    formations: formationReadings(match.world, nation.id),
    alignments: alignmentPairs(match, nation.id),
    allyIds,
    warIds,
    nations: Object.values(match.world.nations).map((n) => ({
      id: n.id,
      name: n.name,
      shortName: n.shortName,
    })),
    pillars: {
      standingExternal: pillars.standingExternal,
      standingInternal: pillars.standingInternal,
      intel: pillars.intelAvailable,
      economy: pillars.economyAvailable,
      force: pillars.force,
    },
  };
}
