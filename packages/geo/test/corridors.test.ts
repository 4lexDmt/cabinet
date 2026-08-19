import { describe, expect, it } from "vitest";
import {
  chordCrossesWater,
  compileCorridors,
  compileSites,
  lakeRadiusKm,
  uniqueLakes,
  uniqueRivers,
  volgaProvinceChain,
  type LonLat,
} from "../src/index.ts";

describe("corridor compile", () => {
  it("Volga adds a navigable sub-network through Russian provinces", () => {
    const chain = volgaProvinceChain();
    expect(chain).toContain("ru-mow");
    expect(chain).toContain("ru-nzh");
    expect(chain).toContain("ru-tat");
    expect(chain).toContain("ru-sam");
    expect(chain).toContain("ru-vol");
    const corridors = compileCorridors().filter((c) => c.water_id === "rv-volga");
    expect(corridors.length).toBeGreaterThanOrEqual(chain.length - 1);
    const nodes = new Set(corridors.flatMap((c) => [c.from, c.to]));
    expect(nodes.has("ru-mow")).toBe(true);
    expect(nodes.has("ru-vol")).toBe(true);
    expect(corridors.every((c) => c.mode === "water" && Number.isInteger(c.travel_ticks))).toBe(true);
  });

  it("St. Lawrence Seaway closes January through March", () => {
    const seaway = compileCorridors().find((c) => c.id === "canal-stlawrence");
    expect(seaway).toBeDefined();
    expect(seaway!.closed_months).toEqual([1, 2, 3]);
    expect(seaway!.mode).toBe("canal");
    expect(seaway!.capacity).toBe(1);
  });

  it("Great Lakes canals inherit winter closure", () => {
    const soo = compileCorridors().find((c) => c.id === "canal-soo");
    const welland = compileCorridors().find((c) => c.id === "canal-welland");
    expect(soo?.closed_months).toEqual([1, 2, 3]);
    expect(welland?.closed_months).toEqual([1, 2, 3]);
  });

  it("a chord across Superior without a shore landing is a barrier", () => {
    const superior = uniqueLakes().find((l) => l.id === "lk-superior");
    expect(superior).toBeDefined();
    const west: LonLat = [superior!.centroid[0] - 8, superior!.centroid[1]];
    const east: LonLat = [superior!.centroid[0] + 8, superior!.centroid[1]];
    expect(chordCrossesWater(west, east, [superior!], [])).toBe(true);
    expect(chordCrossesWater(superior!.centroid, west, [superior!], [])).toBe(false);
  });

  it("emits integer travel_ticks and no coordinates", () => {
    const corridors = compileCorridors();
    expect(corridors.length).toBeGreaterThan(100);
    for (const corridor of corridors) {
      expect(Number.isInteger(corridor.travel_ticks)).toBe(true);
      expect(corridor.travel_ticks).toBeGreaterThanOrEqual(1);
      expect(JSON.stringify(corridor)).not.toMatch(/lonLat|centroid|geojson/i);
    }
  });

  it("Saudi sites have no hydro water but desalination coasts", () => {
    const sites = compileSites().filter((s) => s.nationId === "SAU");
    const hydro = sites.filter((s) => s.water_ids.length > 0);
    expect(hydro).toEqual([]);
    expect(sites.some((s) => s.coastal)).toBe(true);
  });

  it("hydro sites exist on the Volga and city tiers keep 3/5/8 slots", () => {
    const moscow = compileSites().find((s) => s.id === "city:RUS:Moscow");
    expect(moscow?.tier).toBe(3);
    expect(moscow?.slots).toBe(8);
    const volgograd = compileSites().find((s) => s.id === "ru-vol");
    expect(volgograd?.water_ids).toContain("rv-volga");
  });

  it("lake radius is derived from area, not a constant", () => {
    expect(lakeRadiusKm(Math.PI * 100)).toBeCloseTo(10, 8);
    const mississippi = uniqueRivers().find((r) => r.id === "rv-mississippi");
    expect(mississippi?.course.length).toBeGreaterThanOrEqual(2);
  });
});
