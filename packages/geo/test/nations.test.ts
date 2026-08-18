/**
 * Roster config — the 2026 dataset is data, not an engine fork.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { provinceCap, tierOf, worldRosterSchema } from "../src/index.ts";

const roster = worldRosterSchema.parse(
  JSON.parse(
    readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "infra", "tiles", "config", "nations.json"), "utf8"),
  ),
);

describe("2026 nation roster", () => {
  it("lists fourteen Tier-1 nations and twenty-six Tier-2", () => {
    const t1 = roster.nations.filter((n) => n.tier === 1);
    const t2 = roster.nations.filter((n) => n.tier === 2);
    expect(t1).toHaveLength(14);
    expect(t2).toHaveLength(26);
  });

  it("caps the Stage-1 aggregations the spec called out", () => {
    expect(provinceCap(roster, "RUS")).toBe(8);
    expect(provinceCap(roster, "TUR")).toBe(12);
    expect(provinceCap(roster, "ROU")).toBe(8);
    expect(provinceCap(roster, "POL")).toBe(16);
    expect(provinceCap(roster, "UKR")).toBe(27);
  });

  it("treats an unlisted state as simplified", () => {
    expect(tierOf(roster, "AND")).toBe("simplified");
    expect(provinceCap(roster, "AND")).toBe(5);
  });

  it("names the Black Sea theatre and the Bosphorus", () => {
    expect(roster.theatre.id).toBe("ee_black_sea_2026");
    expect(roster.theatre.iso3).toEqual(["POL", "ROU", "UKR", "TUR", "RUS"]);
    expect(roster.theatre.chokepoints.some((c) => c.id === "bosphorus")).toBe(true);
  });

  it("flags Crimea as contested, not as a second geometry", () => {
    const crimea = roster.contested.find((c) => c.id === "crimea");
    expect(crimea?.neutral_controller).toBe("UKR");
    expect(roster.aggregation.RUS?.Southern).not.toContain("crimea");
  });
});
