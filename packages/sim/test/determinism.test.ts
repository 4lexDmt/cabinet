import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";
import { runSequence } from "./sequence.ts";

const root = dirname(fileURLToPath(import.meta.url));
const SEED = 20260815;
const TICKS = 1000;
const NATIONS = 30;

describe("determinism", () => {
  it("same seed and orders produce an identical hash across 1000 ticks", () => {
    const a = runSequence(SEED, TICKS, NATIONS);
    const b = runSequence(SEED, TICKS, NATIONS);
    expect(a.hash).toBe(b.hash);
  });

  it("the identical sequence in a fresh process matches the in-process hash", () => {
    const local = runSequence(SEED, TICKS, NATIONS);
    const hash = execFileSync(
      process.execPath,
      ["--import", "tsx", join(root, "hash-run.ts"), String(SEED), String(TICKS), String(NATIONS)],
      { encoding: "utf8", cwd: join(root, "../../..") },
    ).trim();
    expect(hash).toBe(local.hash);
  });

  it("shuffling internal iteration changes the result — the test is not vacuous", () => {
    const stable = runSequence(SEED, TICKS, NATIONS, false);
    const shuffled = runSequence(SEED, TICKS, NATIONS, true);
    expect(shuffled.hash).not.toBe(stable.hash);
  });
});
