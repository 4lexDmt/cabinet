import standing from "../effects/standing.json";
import whitehall from "../advisors/whitehall_1956.json";
import { advisorFileSchema, effectRuleFileSchema, type AdvisorTemplateData, type EffectRuleData } from "./schema.ts";

export function loadEffectRules(): EffectRuleData[] {
  return effectRuleFileSchema.parse(standing);
}

export function loadAdvisorTemplates(): AdvisorTemplateData[] {
  return advisorFileSchema.parse(whitehall);
}

export { effectRuleSchema, advisorTemplateSchema, effectRuleFileSchema, advisorFileSchema } from "./schema.ts";
