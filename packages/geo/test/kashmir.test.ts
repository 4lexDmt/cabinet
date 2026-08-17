/**
 * GUARD 3 of 4 — protects the point-of-view mechanic.
 *
 * The mandated case. One geometry, three readings:
 *
 *   neutral  -> line_of_control
 *   India    -> international
 *   Pakistan -> administrative
 *
 * If Pakistan's view does not come out as `administrative`, the normalization
 * is wrong, and wrong in the specific way that matters: from Islamabad the Line
 * of Control is an internal line pending plebiscite, not an international
 * border. That single field difference is a complete geopolitical argument, and
 * reproducing it is the whole reason this layer carries per-perspective
 * properties instead of one classification.
 */

import { describe, expect, it } from "vitest";
import {
  NEUTRAL_OBSERVER,
  boundaryPerspectives,
  disagreements,
  normalizeBoundaryClass,
  povKey,
  readBoundary,
} from "../src/index.ts";

/** A Natural Earth row as it appears in ne_10m_admin_0_boundary_lines_land. */
const KASHMIR_LOC: Record<string, unknown> = {
  FEATURECLA: "Line of control (please verify)",
  NAME: "Line of Control",
  FCLASS_ISO: "Line of control",
  FCLASS_IN: "International boundary (verify)",
  FCLASS_PK: "Admin-1 boundary",
  FCLASS_CN: "Disputed (please verify)",
  FCLASS_US: null,
  FCLASS_RU: null,
  FCLASS_TLC: "Line of control",
};

/** An ordinary, undisputed segment: every FCLASS_* is NULL. */
const UNDISPUTED: Record<string, unknown> = {
  FEATURECLA: "International boundary (verify)",
  FCLASS_ISO: null,
  FCLASS_IN: null,
  FCLASS_PK: null,
  FCLASS_CN: null,
};

describe("Kashmir Line of Control", () => {
  const { properties, unmapped } = boundaryPerspectives(KASHMIR_LOC);

  it("normalizes every source value it is given", () => {
    expect(unmapped).toEqual([]);
  });

  it("reads as a line of control from no particular desk", () => {
    expect(properties.pov_neutral).toBe("line_of_control");
    expect(readBoundary(properties, NEUTRAL_OBSERVER)).toBe("line_of_control");
  });

  it("reads as an international boundary from Delhi", () => {
    expect(properties.pov_in).toBe("international");
    expect(readBoundary(properties, "IN")).toBe("international");
  });

  it("reads as an internal administrative line from Islamabad", () => {
    expect(properties.pov_pk).toBe("administrative");
    expect(readBoundary(properties, "PK")).toBe("administrative");
  });

  it("has a third claimant, and says so", () => {
    expect(properties.pov_cn).toBe("disputed");
    expect(disagreements(properties).map((d) => d.observer)).toEqual(["CN", "IN", "PK"]);
  });

  it("carries all three readings on one feature, so one tileset serves every desk", () => {
    const keys = Object.keys(properties).filter((k) => k.startsWith("pov_"));
    expect(keys).toContain("pov_neutral");
    expect(keys).toContain("pov_in");
    expect(keys).toContain("pov_pk");
  });
});

describe("undisputed boundaries", () => {
  it("emit only the neutral reading, because NULL means agreement", () => {
    const { properties } = boundaryPerspectives(UNDISPUTED);
    expect(properties).toEqual({ pov_neutral: "international" });
  });

  it("read the same from every desk", () => {
    const { properties } = boundaryPerspectives(UNDISPUTED);
    for (const observer of ["IN", "PK", "CN", "RU", "US", NEUTRAL_OBSERVER]) {
      expect(readBoundary(properties, observer)).toBe("international");
    }
    expect(disagreements(properties)).toEqual([]);
  });
});

describe("the Natural Earth vocabulary", () => {
  it("maps every value seen in the data", () => {
    expect(normalizeBoundaryClass("International boundary (verify)")).toBe("international");
    expect(normalizeBoundaryClass("Disputed (please verify)")).toBe("disputed");
    expect(normalizeBoundaryClass("Unrecognized")).toBe("unrecognized");
    expect(normalizeBoundaryClass("Line of control")).toBe("line_of_control");
    expect(normalizeBoundaryClass("Admin-1 boundary")).toBe("administrative");
    expect(normalizeBoundaryClass("Indefinite (please verify)")).toBe("indefinite");
    expect(normalizeBoundaryClass("Indeterminant frontier")).toBe("indefinite");
    expect(normalizeBoundaryClass("Lease limit")).toBe("administrative");
    expect(normalizeBoundaryClass("Overlay limit")).toBe("administrative");
    expect(normalizeBoundaryClass("Claim boundary")).toBe("disputed");
    expect(normalizeBoundaryClass("Breakaway")).toBe("disputed");
    expect(normalizeBoundaryClass("Map unit boundary")).toBe("administrative");
  });

  it("returns null for NULL, so absence stays distinguishable from agreement", () => {
    expect(normalizeBoundaryClass(null)).toBeNull();
    expect(normalizeBoundaryClass(undefined)).toBeNull();
    expect(normalizeBoundaryClass("")).toBeNull();
  });

  it("returns null for a value it does not recognise, so the pipeline can fail loudly", () => {
    expect(normalizeBoundaryClass("Ceasefire line pending arbitration under Annex VII")).toBeNull();
  });

  it("names perspective properties predictably", () => {
    expect(povKey("IN")).toBe("pov_in");
    expect(povKey("pk")).toBe("pov_pk");
    expect(povKey("ISO")).toBe("pov_neutral");
    expect(povKey(NEUTRAL_OBSERVER)).toBe("pov_neutral");
  });
});
