import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const simRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

function read(rel: string): string {
  return readFileSync(join(simRoot, rel), "utf8");
}

describe("belief isolation", () => {
  it("advisor rendering never imports world truth helpers", () => {
    const render = read("src/briefing/render.ts");
    expect(render).not.toMatch(/WorldState/);
    expect(render).not.toMatch(/forceOf/);
    expect(render).not.toMatch(/ctx\.state\.nations/);
    expect(render).not.toMatch(/ctx\.state\.pacts/);
  });

  it("briefing phase never reads nation stats or pacts", () => {
    const briefing = read("src/phases/07-briefings.ts");
    expect(briefing).not.toMatch(/ctx\.state\.nations/);
    expect(briefing).not.toMatch(/ctx\.state\.pacts/);
    expect(briefing).not.toMatch(/forceOf/);
    expect(briefing).not.toMatch(/world_state/);
  });
});

describe("delegation limits", () => {
  it("Posture.delegation cannot include break_pact or declare_war at the type level", () => {
    const types = read("src/types.ts");
    expect(types).toMatch(/Exclude<OrderKind, "break_pact" \| "declare_war">/);
  });
});
