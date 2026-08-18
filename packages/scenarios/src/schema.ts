import { z } from "zod";

const obligationSchema = z.object({
  id: z.string(),
  party: z.string(),
  must: z.enum([
    "not_move_forces_into",
    "maintain_trade_route",
    "not_declare_war_on",
    "share_intelligence_on",
    "provide_passage",
    "pay_tribute",
  ]),
  target: z.string().optional(),
  params: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
});

const termsSchema = z.object({
  title: z.string(),
  type: z.enum(["defense", "non_aggression", "trade", "passage", "tribute", "custom"]),
  duration_ticks: z.number().int().optional(),
  secret: z.boolean(),
  obligations: z.array(obligationSchema),
});

const victoryNodeSchema: z.ZodType<unknown> = z.lazy(() =>
  z.union([
    z.object({ all_of: z.array(victoryNodeSchema) }),
    z.object({ any_of: z.array(victoryNodeSchema) }),
    z.object({ gte: z.tuple([z.string(), z.number().int()]) }),
    z.object({ lte: z.tuple([z.string(), z.number().int()]) }),
    z.object({ control: z.string() }),
    z.object({ status_not: z.string() }),
    z.object({ retain: z.string() }),
    z.object({ flag_eq: z.tuple([z.string(), z.union([z.string(), z.number(), z.boolean()])]) }),
  ]),
);

/**
 * Geography is config, same as nations and pacts — but it is not simulation
 * state. The tick never reads this block. The shape is duplicated from
 * `@cabinet/geo` on purpose: importing geo here would pull projection math
 * onto the tick-worker path, and the architecture test forbids that.
 */
export const scenarioGeoSchema = z.object({
  year: z.number().int(),
  theatre_bbox: z.tuple([z.number(), z.number(), z.number(), z.number()]),
  boundaries_source: z.string(),
  projection: z
    .object({
      kind: z.enum(["equirectangular", "mercator", "mercator_compact", "conic_conformal"]).default("equirectangular"),
      parallels: z.tuple([z.number(), z.number()]).optional(),
      lon0: z.number().optional(),
    })
    .default({ kind: "equirectangular" }),
  territorial_sea_nm: z.number().positive().optional(),
  has_contiguous_zone: z.boolean().optional(),
  has_eez: z.boolean().optional(),
  has_fir: z.boolean().optional(),
  road_era: z.enum(["none", "post_roads", "rail_and_road", "motorway"]).optional(),
  note: z.string().optional(),
});

export const scenarioSchema = z.object({
  id: z.string(),
  display_name: z.string(),
  duration_ticks: z.number().int().positive(),
  player_slots: z.number().int().positive(),
  requires_systems: z.array(z.string()),
  nations: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      shortName: z.string(),
      adjective: z.string(),
      standing_external: z.number().int(),
      standing_internal: z.number().int(),
      economy: z.number().int(),
      intelligence_capacity: z.number().int(),
      supply: z.number().int(),
      status: z.enum(["sovereign", "rump", "occupied", "exile", "client"]).default("sovereign"),
      territories: z.array(z.string()),
      social_tree_unlocks: z.array(z.string()),
      advisor_set: z.string(),
    }),
  ),
  territories: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      owner: z.string(),
      controller: z.string(),
      region: z.string(),
      supplyValue: z.number().int(),
    }),
  ),
  formations: z
    .array(
      z.object({
        id: z.string(),
        nationId: z.string(),
        location: z.string(),
        strength: z.number().int(),
      }),
    )
    .default([]),
  starting_pacts: z.array(
    z.object({
      id: z.string(),
      parties: z.array(z.string()).min(2),
      type: z.enum(["defense", "non_aggression", "trade", "passage", "tribute", "custom"]),
      secret: z.boolean(),
      terms: termsSchema,
      private_terms: termsSchema.optional(),
    }),
  ),
  trade_routes: z
    .array(
      z.object({
        id: z.string(),
        from: z.string(),
        to: z.string(),
        open: z.boolean(),
      }),
    )
    .default([]),
  flags: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).default({}),
  victory_conditions: z.record(z.string(), victoryNodeSchema),
  tuning: z.object({
    secret_pact_leak_base_chance: z.number().min(0).max(1),
    standing_penalty_on_breach: z.number().int(),
    cascade_depth_cap: z.number().int().min(1).max(8),
  }),
  geo: scenarioGeoSchema.optional(),
});

export type ScenarioConfig = z.infer<typeof scenarioSchema>;
export type ScenarioGeoConfig = z.infer<typeof scenarioGeoSchema>;
