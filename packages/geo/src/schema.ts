/**
 * Tier-1 gazetteer shapes. Loaded as data, validated once, never inferred
 * from TypeScript types alone — a malformed centroid would silently corrupt
 * every overlay that reads it.
 */

import { z } from "zod";

export const lonLatSchema = z.tuple([z.number(), z.number()]);

export const navigableSchema = z.enum([
  "sea",
  "seaway",
  "lake",
  "river",
  "barge",
  "lock",
  "canal",
  "ferry",
  "none",
]);

export const provinceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  merged_from: z.array(z.string()),
  seat: z.string().min(1),
  centroid: lonLatSchema,
  merged_count: z.number().int().nonnegative(),
  borders: z.array(z.string()),
  build_slots: z.union([z.literal(1), z.literal(2)]),
});

export const citySchema = z.object({
  name: z.string().min(1),
  province: z.string().min(1),
  coord: lonLatSchema,
  population: z.number().int().nonnegative(),
  capital: z.boolean(),
  port: z.boolean(),
  tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  build_slots: z.union([z.literal(3), z.literal(5), z.literal(8)]),
});

export const lakeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  local_name: z.string().nullable(),
  centroid: lonLatSchema,
  area_km2: z.number().nonnegative(),
  max_depth_m: z.number().nonnegative(),
  riparian: z.array(z.string().regex(/^[A-Z]{3}$/)),
  navigable: navigableSchema,
  ice_months: z.string().nullable(),
  shared: z.boolean(),
  nearest_province: z.string().min(1),
  note: z.string(),
});

export const riverSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  local_name: z.string().nullable(),
  riparian: z.array(z.string().regex(/^[A-Z]{3}$/)),
  length_km: z.number().nonnegative(),
  navigable_km: z.number().nonnegative(),
  mouth: lonLatSchema,
  course: z.array(lonLatSchema).min(2),
  shared: z.boolean(),
  note: z.string(),
});

export const roadNodeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  coord: lonLatSchema,
  kind: z.enum(["city", "junction", "province_seat"]),
  pop: z.number().nullable(),
  capital: z.boolean(),
  port: z.boolean(),
});

export const roadEdgeSchema = z.object({
  from_name: z.string().min(1),
  to_name: z.string().min(1),
  class: z.enum(["trunk", "primary", "secondary", "spur", "coastal"]),
  mode: z.enum(["road", "sea"]),
  route: z.string().nullable(),
  km: z.number().nonnegative(),
  hours: z.number().nonnegative(),
});

export const internationalLaneSchema = z.object({
  route: z.string().min(1),
  mode: z.enum(["sea", "road", "rail", "contested"]),
  from_name: z.string().min(1),
  from_iso: z.string().regex(/^[A-Z]{3}$/),
  to_name: z.string().min(1),
  to_iso: z.string().regex(/^[A-Z]{3}$/),
  km: z.number().nonnegative(),
});

export const waterAssetSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["wadi", "desalination", "fossil_aquifer"]),
  coord: lonLatSchema,
});

export const waterNoteSchema = z.object({
  natural_lakes: z.number().int().nonnegative(),
  perennial_rivers: z.number().int().nonnegative(),
  structure: z.string(),
  assets: z.array(waterAssetSchema),
  game_effect: z.string(),
});

export const countrySchema = z.object({
  iso: z.string().regex(/^[A-Z]{3}$/),
  name: z.string().min(1),
  adm1_real: z.number().int().nonnegative(),
  adm1_note: z.string(),
  provinces: z.array(provinceSchema),
  cities: z.array(citySchema),
  lakes: z.array(lakeSchema).default([]),
  rivers: z.array(riverSchema).default([]),
  nodes: z.array(roadNodeSchema),
  edges: z.array(roadEdgeSchema),
  international: z.array(internationalLaneSchema),
  water_note: waterNoteSchema.optional(),
});

export const gazetteerSchema = z.object({
  version: z.string(),
  generated: z.string(),
  tier: z.number().int(),
  countries: z.array(countrySchema).min(1),
});

export const chokepointSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
  mode: z.enum(["canal", "lock", "seaway", "water"]),
  km: z.number().nonnegative(),
  capacity: z.number().int().positive(),
  closed_months: z.array(z.number().int().min(1).max(12)).default([]),
});

export const chokepointFileSchema = z.object({
  chokepoints: z.array(chokepointSchema),
});

export type Province = z.infer<typeof provinceSchema>;
export type City = z.infer<typeof citySchema>;
export type Lake = z.infer<typeof lakeSchema>;
export type River = z.infer<typeof riverSchema>;
export type RoadNode = z.infer<typeof roadNodeSchema>;
export type RoadEdge = z.infer<typeof roadEdgeSchema>;
export type InternationalLane = z.infer<typeof internationalLaneSchema>;
export type WaterNote = z.infer<typeof waterNoteSchema>;
export type WaterAsset = z.infer<typeof waterAssetSchema>;
export type Country = z.infer<typeof countrySchema>;
export type Gazetteer = z.infer<typeof gazetteerSchema>;
export type Chokepoint = z.infer<typeof chokepointSchema>;
export type Navigable = z.infer<typeof navigableSchema>;
