"use client";

/**
 * The legend states what each treatment means, in plain words.
 *
 * The maritime rows exist to prevent one specific misreading: an EEZ is not
 * territory. It confers sovereign rights over resources and nothing else, and
 * the surface waters remain international. Rendering it in the land fill would
 * be the interface taking a side in every maritime dispute on the sheet.
 */

import {
  BOUNDARY_INK,
  BOUNDARY_LEGEND,
  ZONE_INK,
  ZONE_LADDER,
  characterOf,
  zoneBands,
  type BoundaryClass,
  type MaritimeEra,
} from "@cabinet/geo";
import type { OverlayId } from "@/lib/atlas/overlays";

const BOUNDARY_ORDER: BoundaryClass[] = [
  "international",
  "line_of_control",
  "disputed",
  "unrecognized",
  "administrative",
  "indefinite",
];

function BoundarySwatch({ cls }: { cls: BoundaryClass }) {
  return (
    <svg width={48} height={12} aria-hidden>
      {BOUNDARY_INK[cls].map((spec, i) => (
        <path
          key={i}
          d="M2,6 H46"
          fill="none"
          stroke={spec.stroke}
          strokeWidth={spec.width}
          strokeDasharray={spec.dash ?? undefined}
          opacity={spec.opacity}
          transform={spec.offset ? `translate(0,${spec.offset})` : undefined}
        />
      ))}
    </svg>
  );
}

export function Legend({
  active,
  observer,
  era,
}: {
  active: OverlayId[];
  observer: string;
  era: MaritimeEra;
}) {
  const rows: Array<[React.ReactNode, string]> = [];

  if (active.includes("political") || active.includes("dispute")) {
    for (const cls of BOUNDARY_ORDER) {
      rows.push([<BoundarySwatch key={cls} cls={cls} />, BOUNDARY_LEGEND[cls].label]);
    }
  }

  if (active.includes("dispute")) {
    rows.push([
      <svg key="dissent" width={48} height={12} aria-hidden>
        <path d="M2,6 H46" fill="none" stroke="var(--ink)" strokeWidth="var(--w-heavy)" />
        <path d="M2,6 H46" fill="none" stroke="var(--breach)" strokeWidth={5.5} strokeDasharray="1 6" opacity={0.75} />
      </svg>,
      `Read differently from ${observer === "NEUTRAL" ? "the neutral line" : "everyone else"}`,
    ]);
  }

  if (active.includes("maritime")) {
    const bands = zoneBands(era).filter((b) => b.zone !== "internal" && b.zone !== "high_seas");
    rows.push([
      <svg key="zones" width={48} height={12} aria-hidden>
        {bands.map((band, i) => (
          <rect
            key={band.zone}
            x={2 + i * (44 / Math.max(1, bands.length))}
            y={2}
            width={44 / Math.max(1, bands.length)}
            height={8}
            fill={ZONE_INK[band.zone].fill ?? "none"}
          />
        ))}
      </svg>,
      bands.map((b) => `${b.zone === "territorial" ? "TS" : b.zone === "contiguous" ? "CZ" : "EEZ"} ${b.outerNm}`).join(" · ") + " nm",
    ]);
    rows.push([
      <svg key="median" width={48} height={12} aria-hidden>
        <path d="M2,6 H46" fill="none" stroke="var(--alliance)" strokeWidth={1} strokeDasharray="8 3 1.5 3" />
      </svg>,
      "Maritime boundary — computed median line",
    ]);
    rows.push([
      <svg key="eezline" width={48} height={12} aria-hidden>
        <path d="M2,6 H46" fill="none" stroke="var(--alliance)" strokeWidth={0.6} strokeDasharray="1 3" />
      </svg>,
      era.hasEez ? "EEZ outer limit — resource rights, not territory" : "Outer limit of the claim",
    ]);
    rows.push([
      <svg key="highseas" width={48} height={12} aria-hidden>
        <rect x={2} y={2} width={44} height={8} fill="var(--sea-deep)" />
      </svg>,
      characterOf("high_seas").legend.replace("High seas — ", "High seas — "),
    ]);
  }

  if (active.includes("physical")) {
    rows.push([
      <svg key="bath" width={48} height={12} aria-hidden>
        <rect x={2} y={2} width={44} height={8} fill="var(--sea-deep)" opacity={0.55} />
      </svg>,
      "Below the 200m shelf break",
    ]);
  }

  if (rows.length === 0) return null;

  return (
    <div className="atlas-legend">
      <h3>Legend — this sheet</h3>
      {rows.map(([swatch, text], i) => (
        <div className="row" key={i}>
          {swatch}
          <em>{text}</em>
        </div>
      ))}
      {active.includes("maritime") ? (
        <p style={{ margin: "8px 0 0", font: "italic 400 9.5px/1.4 var(--serif)", color: "var(--ink-3)" }}>
          {ZONE_LADDER.find((z) => z.zone === "eez")!.legend}
        </p>
      ) : null}
    </div>
  );
}
