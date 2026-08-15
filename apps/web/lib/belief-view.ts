import type { Belief, Formation, Nation, Territory, WorldState } from "@cabinet/sim";
import { beliefsOf } from "@cabinet/sim";

/** Visual confidence only. Planted is never a fifth fill. */
export type VisualConfidence = "confirmed" | "probable" | "unverified";

export type DisplayProvenance = "own" | "ally" | "purchased" | "inferred";

export type Staleness = "fresh" | "recent" | "stale" | "old";

export interface TerritoryReading {
  territoryId: string;
  controllerId: string | null;
  visual: VisualConfidence | "blind";
  provenance: DisplayProvenance | null;
  lastUpdatedTick: number | null;
  stale: Staleness | null;
  occupied: boolean;
  contested: boolean;
  nothingInFile: boolean;
  assessedPlanted: boolean;
}

/**
 * Map a stored belief onto what the desk may show.
 * `source === "planted"` is collapsed into inferred provenance and ordinary
 * confidence. The plum planted treatment is only for an assessment, which
 * this engine does not yet emit — so it never appears here.
 */
export function deskBelief(belief: Belief): {
  visual: VisualConfidence;
  provenance: DisplayProvenance;
} {
  const visual: VisualConfidence =
    belief.confidence >= 80 ? "confirmed" : belief.confidence >= 50 ? "probable" : "unverified";
  const provenance: DisplayProvenance =
    belief.source === "direct_observation"
      ? "own"
      : belief.source === "ally_share"
        ? "ally"
        : belief.source === "purchased_intel"
          ? "purchased"
          : "inferred";
  return { visual, provenance };
}

export function provenanceCopy(kind: DisplayProvenance): string {
  switch (kind) {
    case "own":
      return "Observed by our own stations";
    case "ally":
      return "Shared by an ally";
    case "purchased":
      return "Purchased";
    case "inferred":
      return "Inferred";
  }
}

export function stalenessOf(tick: number, lastUpdatedTick: number): Staleness {
  const age = tick - lastUpdatedTick;
  if (age <= 1) return "fresh";
  if (age <= 6) return "recent";
  if (age <= 18) return "stale";
  return "old";
}

export function territoryReading(
  world: WorldState,
  nationId: string,
  territory: Territory,
): TerritoryReading {
  const mine = territory.controller === nationId || territory.owner === nationId;
  const beliefs = beliefsOf(world.beliefs, nationId).filter(
    (b) => b.subject_type === "territory" && b.subject_id === territory.id && b.field === "controller",
  );
  const belief = beliefs[0];
  if (mine) {
    return {
      territoryId: territory.id,
      controllerId: territory.controller,
      visual: "confirmed",
      provenance: "own",
      lastUpdatedTick: world.tick,
      stale: "fresh",
      occupied: territory.owner !== territory.controller,
      contested: false,
      nothingInFile: false,
      assessedPlanted: false,
    };
  }
  if (!belief) {
    return {
      territoryId: territory.id,
      controllerId: null,
      visual: "blind",
      provenance: null,
      lastUpdatedTick: null,
      stale: null,
      occupied: false,
      contested: false,
      nothingInFile: true,
      assessedPlanted: false,
    };
  }
  const view = deskBelief(belief);
  const values = new Set(beliefs.map((b) => String(b.believed_value)));
  return {
    territoryId: territory.id,
    controllerId: String(belief.believed_value),
    visual: view.visual,
    provenance: view.provenance,
    lastUpdatedTick: belief.last_updated_tick,
    stale: stalenessOf(world.tick, belief.last_updated_tick),
    occupied: false,
    contested: values.size > 1,
    nothingInFile: false,
    assessedPlanted: false,
  };
}

export function formationReadings(
  world: WorldState,
  nationId: string,
): Array<{ location: string; weight: number; visual: VisualConfidence }> {
  const out: Array<{ location: string; weight: number; visual: VisualConfidence }> = [];
  for (const formation of Object.values(world.formations) as Formation[]) {
    if (formation.nationId === nationId) {
      out.push({ location: formation.location, weight: formation.strength, visual: "confirmed" });
      continue;
    }
    const belief = beliefsOf(world.beliefs, nationId).find(
      (b) => b.subject_type === "formation" && b.subject_id === formation.id,
    );
    if (!belief) continue;
    const view = deskBelief(belief);
    const weight = typeof belief.believed_value === "number" ? belief.believed_value : formation.strength;
    out.push({ location: formation.location, weight, visual: view.visual });
  }
  return out;
}

export function coverageOf(world: WorldState, nationId: string): Set<string> {
  const covered = new Set<string>();
  for (const t of Object.values(world.territories) as Territory[]) {
    const reading = territoryReading(world, nationId, t);
    if (!reading.nothingInFile) covered.add(t.id);
  }
  return covered;
}

export function nationInk(nationId: string): string {
  const inks: Record<string, string> = {
    uk: "#3d4a52",
    fr: "#4a3f38",
    eg: "#5a4a32",
    il: "#3f4638",
    us: "#2f3d44",
    su: "#4a3838",
    at: "#3a3a42",
    gb: "#3d4a52",
    ru: "#4a3838",
    pr: "#3a3a38",
    se: "#3a4448",
    es: "#4a3a32",
    de: "#3a3a38",
    ah: "#3a3a42",
    rs: "#4a3a32",
    ot: "#4a4232",
  };
  return inks[nationId] ?? "#3a3f44";
}

export function shortNation(nations: Record<string, Nation>, id: string | null): string {
  if (!id) return "unknown";
  return nations[id]?.shortName ?? id;
}
