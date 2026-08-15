import { z } from "zod";

export const nationNumericFieldSchema = z.enum([
  "standing_external",
  "standing_internal",
  "economy",
  "intelligence_capacity",
  "supply",
]);

export const effectTargetSchema = z.union([
  z.object({ nation: z.enum(["event.actor_id", "event.subject"]), field: nationNumericFieldSchema }),
  z.object({ nationId: z.string().min(1), field: nationNumericFieldSchema }),
]);

export const effectRuleSchema = z.object({
  id: z.string().min(1),
  trigger: z.string().min(1),
  condition: z.string().optional(),
  effects: z.array(
    z.object({
      target: effectTargetSchema,
      delta: z.number().int(),
    }),
  ),
  emits: z.array(z.string()),
});

export const effectRuleFileSchema = z.array(effectRuleSchema);

export const advisorTemplateSchema = z.object({
  id: z.string().min(1),
  advisor_set: z.string().min(1),
  when: z.string().min(1),
  voice: z.string().min(1),
  body: z.string().min(1).refine((text) => !/\b(operative|agent|infiltrated|spy)\b/i.test(text), {
    message: "advisor templates must not reference individual agents",
  }),
});

export const advisorFileSchema = z.array(advisorTemplateSchema);

export type EffectRuleData = z.infer<typeof effectRuleSchema>;
export type AdvisorTemplateData = z.infer<typeof advisorTemplateSchema>;
