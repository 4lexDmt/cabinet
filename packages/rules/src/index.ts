import standing from "../effects/standing.json";
import water from "../effects/water.json";
import buildingsFile from "../buildings.json";
import whitehall from "../advisors/whitehall_1956.json";
import {
  advisorFileSchema,
  buildingFileSchema,
  effectRuleFileSchema,
  type AdvisorTemplateData,
  type BuildingFile,
  type EffectRuleData,
} from "./schema.ts";

export function loadEffectRules(): EffectRuleData[] {
  return [...effectRuleFileSchema.parse(standing), ...effectRuleFileSchema.parse(water)];
}

export function loadAdvisorTemplates(): AdvisorTemplateData[] {
  return advisorFileSchema.parse(whitehall);
}

export function loadBuildingFile(): BuildingFile {
  return buildingFileSchema.parse(buildingsFile);
}

export { effectRuleSchema, advisorTemplateSchema, effectRuleFileSchema, advisorFileSchema, buildingFileSchema } from "./schema.ts";
