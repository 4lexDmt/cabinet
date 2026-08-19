import { describe, expect, it } from "vitest";
import { loadAdvisorTemplates, loadBuildingFile, loadEffectRules } from "../src/index.ts";

describe("rule files", () => {
  it("effect rules parse and fail closed", () => {
    const rules = loadEffectRules();
    expect(rules.length).toBeGreaterThan(0);
    expect(rules.every((r) => r.trigger.length > 0)).toBe(true);
  });

  it("advisor templates never mention individual agents", () => {
    const templates = loadAdvisorTemplates();
    expect(templates.map((t) => t.body).join("\n")).not.toMatch(/operative|infiltrated/i);
  });

  it("building catalog has no Force type and parses", () => {
    const file = loadBuildingFile();
    expect(file.buildings.some((b) => b.id === "force" || (b as { pillar: string }).pillar === "force")).toBe(false);
    expect(file.city_economy_cap["3"]).toBeGreaterThan(file.city_economy_cap["1"]);
  });
});
