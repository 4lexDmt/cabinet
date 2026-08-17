/**
 * Rebuild FETCH.md and files.json from the committed tree.
 *
 *   node scripts/write-raw-index.mjs
 *
 * GitHub's directory pages are JavaScript. Fetchers that only follow
 * raw.githubusercontent.com need a static list.
 */

import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repo = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const RAW = "https://raw.githubusercontent.com/4lexDmt/cabinet/main/";
const files = execSync("git ls-files", { cwd: repo, encoding: "utf8" })
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean)
  .filter((path) => !path.startsWith(".git/"));

function rawUrl(path) {
  return RAW + path.split("/").map(encodeURIComponent).join("/");
}

const md = [
  "# Raw file index",
  "",
  "Allowlisted hosts only. No auth. Nested GitHub directory pages are JS and are not used.",
  "",
  "- repo: https://github.com/4lexDmt/cabinet",
  "- this file: https://raw.githubusercontent.com/4lexDmt/cabinet/main/FETCH.md",
  "- json: https://raw.githubusercontent.com/4lexDmt/cabinet/main/files.json",
  "- zip: https://github.com/4lexDmt/cabinet/archive/refs/heads/main.zip",
  "- codeload: https://codeload.github.com/4lexDmt/cabinet/zip/refs/heads/main",
  "- tree: https://api.github.com/repos/4lexDmt/cabinet/git/trees/main?recursive=1",
  "",
  "## Files",
  "",
];

for (const path of files) {
  md.push(`- \`${path}\``);
  md.push(`  ${rawUrl(path)}`);
  md.push("");
}

writeFileSync(join(repo, "FETCH.md"), `${md.join("\n").trimEnd()}\n`);

writeFileSync(
  join(repo, "files.json"),
  `${JSON.stringify(
    {
      repo: "https://github.com/4lexDmt/cabinet",
      branch: "main",
      raw_base: RAW,
      zip: "https://github.com/4lexDmt/cabinet/archive/refs/heads/main.zip",
      codeload_zip: "https://codeload.github.com/4lexDmt/cabinet/zip/refs/heads/main",
      tree: "https://api.github.com/repos/4lexDmt/cabinet/git/trees/main?recursive=1",
      files: files.map((path) => ({ path, raw: rawUrl(path) })),
    },
    null,
    2,
  )}\n`,
);

console.log(`wrote FETCH.md and files.json (${files.length} paths)`);
