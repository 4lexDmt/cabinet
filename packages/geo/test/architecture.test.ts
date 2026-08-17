/**
 * GUARD 1 of 4 — protects determinism.
 *
 * `packages/sim` must not import `packages/geo`, transitively or otherwise, and
 * the simulation source must not contain geometry of any kind. Geometry is
 * float-heavy and platform-dependent; a single coordinate on the tick path
 * could break byte-identical determinism, and the cross-process determinism
 * test would then start failing intermittently in a way that is miserable to
 * debug.
 *
 * The reverse direction is guarded too. If geo ever imported sim, the map would
 * acquire opinions about world truth, and rule 3 — world truth and belief are
 * separate — would have a hole in it.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const geoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(geoRoot, "..", "..");
const simRoot = join(repoRoot, "packages", "sim");
const scenariosRoot = join(repoRoot, "packages", "scenarios");
const workerRoot = join(repoRoot, "apps", "tick-worker");

function sourceFiles(root: string): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      if (entry === "node_modules" || entry === "dist") continue;
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (full.endsWith(".ts")) out.push(full);
    }
  };
  walk(root);
  return out;
}

function importsOf(file: string): string[] {
  const text = readFileSync(file, "utf8");
  const specifiers: string[] = [];
  const pattern = /(?:from\s+|import\s*\(\s*|require\s*\(\s*)["']([^"']+)["']/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) specifiers.push(match[1]!);
  return specifiers;
}

describe("map domain boundary", () => {
  it("packages/sim never imports packages/geo", () => {
    const offenders: string[] = [];
    for (const file of sourceFiles(join(simRoot, "src"))) {
      for (const specifier of importsOf(file)) {
        if (specifier.includes("@cabinet/geo") || specifier.includes("packages/geo")) {
          offenders.push(`${relative(repoRoot, file)} -> ${specifier}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("packages/sim declares no dependency on packages/geo", () => {
    const pkg = JSON.parse(readFileSync(join(simRoot, "package.json"), "utf8")) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const all = { ...pkg.dependencies, ...pkg.devDependencies };
    expect(Object.keys(all)).not.toContain("@cabinet/geo");
  });

  it("packages/scenarios never imports packages/geo — the Zod shape is local", () => {
    const offenders: string[] = [];
    for (const file of sourceFiles(join(scenariosRoot, "src"))) {
      for (const specifier of importsOf(file)) {
        if (specifier.includes("@cabinet/geo") || specifier.includes("packages/geo")) {
          offenders.push(`${relative(repoRoot, file)} -> ${specifier}`);
        }
      }
    }
    const pkg = JSON.parse(readFileSync(join(scenariosRoot, "package.json"), "utf8")) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const all = { ...pkg.dependencies, ...pkg.devDependencies };
    expect(Object.keys(all)).not.toContain("@cabinet/geo");
    expect(offenders).toEqual([]);
  });

  it("the tick worker never imports packages/geo", () => {
    const offenders: string[] = [];
    for (const file of sourceFiles(join(workerRoot, "src"))) {
      for (const specifier of importsOf(file)) {
        if (specifier.includes("@cabinet/geo") || specifier.includes("packages/geo")) {
          offenders.push(`${relative(repoRoot, file)} -> ${specifier}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("packages/geo never imports the simulation, the database, or React", () => {
    const forbidden = ["@cabinet/sim", "@cabinet/db", "@cabinet/runtime", "react", "next"];
    const offenders: string[] = [];
    for (const file of sourceFiles(join(geoRoot, "src"))) {
      for (const specifier of importsOf(file)) {
        if (forbidden.some((f) => specifier === f || specifier.startsWith(`${f}/`))) {
          offenders.push(`${relative(repoRoot, file)} -> ${specifier}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("packages/geo performs no I/O and reads no clock", () => {
    const offenders: string[] = [];
    for (const file of sourceFiles(join(geoRoot, "src"))) {
      const text = readFileSync(file, "utf8");
      if (/\bfrom\s+["']node:(fs|http|https|net|child_process)["']/.test(text)) {
        offenders.push(`${relative(repoRoot, file)}: node I/O`);
      }
      if (/\bDate\.now\(/.test(text)) offenders.push(`${relative(repoRoot, file)}: Date.now`);
      if (/\bMath\.random\(/.test(text)) offenders.push(`${relative(repoRoot, file)}: Math.random`);
    }
    expect(offenders).toEqual([]);
  });

  it("the simulation contains no coordinates or geometry", () => {
    // Note the absence of a bare /projection/ rule. "Projection" is a domain
    // word here — a briefing is a projection over the event log — so banning it
    // would fight rule 6 rather than protect rule 1. The terms below are
    // cartographic and have no legitimate meaning inside the tick path.
    const banned = [
      /\blongitude\b/i,
      /\blatitude\b/i,
      /\blonLat\b/i,
      /\bmercator\b/i,
      /\bequirectangular\b/i,
      /\bconicConformal\b/i,
      /\bgeojson\b/i,
      /\bcentroid\b/i,
      /\bbbox\b/i,
      /\bgeoPath\b/,
    ];
    const offenders: string[] = [];
    for (const file of sourceFiles(join(simRoot, "src"))) {
      const code = readFileSync(file, "utf8")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/.*$/gm, "");
      for (const rule of banned) {
        if (rule.test(code)) offenders.push(`${relative(repoRoot, file)}: ${rule}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
