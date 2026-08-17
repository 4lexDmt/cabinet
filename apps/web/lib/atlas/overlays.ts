/**
 * Overlays. Each answers a different question, and each costs area ink.
 *
 * The budget is a hard rule rather than a guideline: only the first activated
 * overlay keeps its fills, and anything after it yields area ink and renders as
 * line only. Two full-area overlays stacked are simply unreadable, and no
 * amount of care with opacity fixes that.
 */

import type { OverlayCost } from "@cabinet/geo";

export type OverlayId = "political" | "maritime" | "physical" | "dispute";

export interface OverlayDef extends OverlayCost {
  id: OverlayId;
  name: string;
  question: string;
  defaultOn: boolean;
}

export const OVERLAYS: OverlayDef[] = [
  {
    id: "political",
    name: "Political",
    question: "Who holds what, and what is contested?",
    area: 0.55,
    defaultOn: true,
  },
  {
    id: "dispute",
    name: "Dispute",
    question: "Where does this government disagree with everyone else?",
    area: 0.45,
    defaultOn: false,
  },
  {
    id: "maritime",
    name: "Maritime",
    question: "Where does sovereignty end and jurisdiction begin?",
    area: 0.6,
    defaultOn: false,
  },
  {
    id: "physical",
    name: "Physical",
    question: "What does the ground do to a plan?",
    area: 0.35,
    defaultOn: false,
  },
];

export function overlayById(id: OverlayId): OverlayDef {
  return OVERLAYS.find((o) => o.id === id)!;
}
