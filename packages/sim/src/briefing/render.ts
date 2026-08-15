import type { AdvisorTemplate, Belief, GameEvent } from "../types.ts";

export interface BriefingInput {
  nationId: string;
  tick: number;
  beliefs: Belief[];
  events: GameEvent[];
  templates: AdvisorTemplate[];
}

export interface BriefingProjection {
  nationId: string;
  tick: number;
  lede: string;
  paragraphs: BriefingParagraph[];
  requiring: string[];
}

export interface BriefingParagraph {
  text: string;
  confidence: "confirmed" | "probable" | "unverified";
  sourceEventId: string | null;
}

/**
 * Advisor rendering. Reads only the provided beliefs and already-filtered events.
 * Must never import world truth.
 */
export function renderBriefing(input: BriefingInput): BriefingProjection {
  const paragraphs: BriefingParagraph[] = [];
  const notable = input.events.filter((e) => e.type !== "belief.updated" && e.type !== "briefing.compiled");

  if (notable.length === 0) {
    paragraphs.push({
      text: "The desk is quiet. Nothing in file since the last sitting requires a new reading.",
      confidence: "confirmed",
      sourceEventId: null,
    });
  }

  for (const event of notable) {
    paragraphs.push(paragraphFor(event, input.beliefs));
  }

  const requiring = notable
    .filter((e) => e.type === "pact.proposed" || e.type === "pact.breached" || e.type === "war.declared")
    .map((e) => e.id);

  const lede =
    requiring.length > 0
      ? `${requiring.length} matter${requiring.length === 1 ? "" : "s"} now need your hand.`
      : "The situation has moved, but nothing on the desk is irreversible tonight.";

  return {
    nationId: input.nationId,
    tick: input.tick,
    lede,
    paragraphs,
    requiring,
  };
}

function paragraphFor(event: GameEvent, beliefs: Belief[]): BriefingParagraph {
  const related = beliefs.find((b) => event.subject_ids.includes(b.subject_id));
  const confidence = confidenceFrom(related?.confidence ?? 80, related?.source);
  const text = proseFor(event);
  return { text, confidence, sourceEventId: event.id };
}

function confidenceFrom(
  score: number,
  source: Belief["source"] | undefined,
): BriefingParagraph["confidence"] {
  if (source === "purchased_intel") return "unverified";
  if (score >= 80) return "confirmed";
  if (score >= 50) return "probable";
  return "unverified";
}

function proseFor(event: GameEvent): string {
  switch (event.type) {
    case "pact.proposed":
      return `An instrument titled “${String(event.payload.title ?? "Untitled")}” has been put to the parties.`;
    case "pact.signed":
      return "An instrument has been executed. The obligations are now in force.";
    case "pact.breached":
      return `An obligation was not honoured. The instrument is broken${event.payload.must ? ` — ${String(event.payload.must).replaceAll("_", " ")}` : ""}.`;
    case "pact.leaked":
      return "A secret understanding has come into file that was not transmitted to you by its signatories.";
    case "pact.broken":
      return "A party has renounced an instrument in force.";
    case "war.declared":
      return "A state of war has been declared.";
    case "standing.changed": {
      const delta = Number(event.payload.delta ?? 0);
      const dir = delta < 0 ? "fell" : "rose";
      return `Standing ${dir} by ${Math.abs(delta)}, attributed to ${event.cause_event_id ?? event.id}.`;
    }
    case "economy.pressured":
      return "Economic pressure has been applied. The effect is on the ledger.";
    case "formation.arrived":
      return "A formation has arrived at a new position.";
    case "engagement.continued":
      return "An engagement continues. No resolution this sitting — the fighting is not decided in an afternoon.";
    default:
      return `A matter of record (${event.type}) was entered as ${event.id}.`;
  }
}
