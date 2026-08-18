/**
 * 2026 world-dataset roster. Config, not code: adding a nation or changing an
 * ADM recipe must not require an engine change.
 *
 * The JSON lives at infra/tiles/config/nations.json and is loaded by the
 * offline pipeline. This module is the Zod shape and the lookup helpers the
 * rest of geo uses. It performs no I/O.
 */

import { z } from "zod";

export const NATION_TIERS = ["1", "2", "3", "simplified"] as const;
export type NationTier = (typeof NATION_TIERS)[number];

export const ADM_RECIPES = [
  "raw",
  "federal_districts",
  "nuts1",
  "development_regions",
  "regions",
  "uk_regions",
  "city_state",
] as const;
export type AdmRecipe = (typeof ADM_RECIPES)[number];

const ADM_RECIPE_ENUM = ADM_RECIPES as unknown as [AdmRecipe, ...AdmRecipe[]];

export const nationEntrySchema = z.object({
  iso3: z.string().length(3),
  iso2: z.string().min(2).max(2),
  name: z.string().min(1),
  tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  adm: z.enum(ADM_RECIPE_ENUM),
  cap: z.number().int().positive(),
  notes: z.string().optional(),
});

export const contestedSchema = z.object({
  id: z.string().min(1),
  match: z.array(z.string().min(1)).min(1),
  neutral_controller: z.string().length(3),
  pov_ua_label: z.string().optional(),
  pov_ru_label: z.string().optional(),
});

export const chokepointSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  kind: z.enum(["strait", "canal", "cape"]),
  from: z.tuple([z.number(), z.number()]),
  to: z.tuple([z.number(), z.number()]),
});

export const theatreSchema = z.object({
  id: z.string().min(1),
  year: z.number().int(),
  bbox: z.tuple([z.number(), z.number(), z.number(), z.number()]),
  iso3: z.array(z.string().length(3)).min(1),
  chokepoints: z.array(chokepointSchema).default([]),
});

export const worldRosterSchema = z.object({
  theatre: theatreSchema,
  contested: z.array(contestedSchema).default([]),
  nations: z.array(nationEntrySchema).min(1),
  aggregation: z.record(z.string(), z.record(z.string(), z.array(z.string()))).default({}),
});

export type NationEntry = z.infer<typeof nationEntrySchema>;
export type ContestedCase = z.infer<typeof contestedSchema>;
export type TheatreConfig = z.infer<typeof theatreSchema>;
export type WorldRoster = z.infer<typeof worldRosterSchema>;

export const DEFAULT_SIMPLIFIED_CAP = 5;

export function nationByIso3(roster: WorldRoster, iso3: string): NationEntry | null {
  return roster.nations.find((n) => n.iso3 === iso3) ?? null;
}

export function tierOf(roster: WorldRoster, iso3: string): NationTier {
  const entry = nationByIso3(roster, iso3);
  if (!entry) return "simplified";
  return String(entry.tier) as NationTier;
}

export function provinceCap(roster: WorldRoster, iso3: string): number {
  return nationByIso3(roster, iso3)?.cap ?? DEFAULT_SIMPLIFIED_CAP;
}
