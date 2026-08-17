/**
 * Perspectives.
 *
 * These are the thirty-two governments Natural Earth records a boundary opinion
 * for, plus the disinterested reading. The disinterested one is offered as a
 * reference plate and labelled as such: in play no perspective is neutral, and
 * a map that pretends otherwise is making the strongest claim on the sheet.
 */

import { NEUTRAL_OBSERVER, PERSPECTIVE_CODES } from "@cabinet/geo";

export interface Perspective {
  code: string;
  label: string;
  /** How this government describes its own reading. */
  stance: string;
}

const NAMES: Record<string, string> = {
  US: "United States",
  FR: "France",
  RU: "Russia",
  ES: "Spain",
  CN: "China",
  TW: "Taiwan",
  IN: "India",
  NP: "Nepal",
  PK: "Pakistan",
  DE: "Germany",
  GB: "United Kingdom",
  BR: "Brazil",
  IL: "Israel",
  PS: "Palestine",
  SA: "Saudi Arabia",
  EG: "Egypt",
  MA: "Morocco",
  PT: "Portugal",
  AR: "Argentina",
  JP: "Japan",
  KO: "Korea",
  VN: "Vietnam",
  TR: "Türkiye",
  ID: "Indonesia",
  PL: "Poland",
  GR: "Greece",
  IT: "Italy",
  NL: "Netherlands",
  SE: "Sweden",
  BD: "Bangladesh",
  UA: "Ukraine",
  TLC: "Turkish Cypriot administration",
};

/** Stated in each government's own terms, not in a summary of the dispute. */
const STANCE: Record<string, string> = {
  IN: "The whole of Jammu and Kashmir is Indian territory. The line is India's border.",
  PK: "Not an international border at all — a provisional administrative line pending plebiscite.",
  CN: "Claims across the Aksai Chin and the southern sea are shown as settled; several neighbours' lines are not accepted.",
  RU: "Crimea and the Union State frontier are shown as internal. Several post-1991 lines are read differently from Kyiv's.",
  UA: "The 1991 frontiers are the frontiers. Lines drawn since are shown as unrecognised.",
  IL: "The 1974 ceasefire lines and the Golan are shown as boundary; several neighbours read the same arcs as unrecognised.",
  PS: "The same arcs Israel reads as boundary are shown here as unrecognised.",
  MA: "Western Sahara is shown as internal administration, not as a disputed territory.",
  AR: "The Malvinas are shown as Argentine.",
  GB: "The Falklands, Gibraltar and the Cyprus base areas are shown as British.",
  TW: "The mainland claim and the strait are shown from Taipei, not Beijing.",
  TR: "Northern Cyprus is shown as a separate administration.",
  GR: "Cyprus is shown whole.",
  [NEUTRAL_OBSERVER]:
    "A reading no player is entitled to. Provided as a reference plate only — in play, no perspective is neutral.",
};

export const PERSPECTIVES: Perspective[] = [
  {
    code: NEUTRAL_OBSERVER,
    label: "Disinterested observer",
    stance: STANCE[NEUTRAL_OBSERVER]!,
  },
  ...PERSPECTIVE_CODES.filter((code) => code !== "ISO").map((code) => ({
    code,
    label: NAMES[code] ?? code,
    stance:
      STANCE[code] ??
      `${NAMES[code] ?? code} records a different reading on the segments where it has one; elsewhere it accepts the neutral line.`,
  })),
];

export function perspectiveOf(code: string): Perspective {
  return PERSPECTIVES.find((p) => p.code === code) ?? PERSPECTIVES[0]!;
}

export function labelOf(code: string): string {
  return perspectiveOf(code).label;
}
