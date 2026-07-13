import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(projectRoot, "public");
const html = fs.readFileSync(path.join(publicRoot, "index.html"), "utf8");

const mediaFiles = new Map([
  ["brand-white", "stepup-white-20260713.png"],
  ["hero-stage", "harold-hero-296.jpg"],
  ["stage", "harold-stage.jpg"],
  ["candid", "harold-candid.jpeg"],
  ["authority", "harold-authority.jpeg"],
  ["investor-report", "harold-investor-report-20260713.jpg"],
  ["investor-editorial", "harold-investor-editorial.jpg"],
  ["power", "harold-power.jpeg"],
]);

function sha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

const references = [...html.matchAll(/(?:src|href)="\.\/media\/([^"]+)"/g)].map((match) => match[1]);
assert.equal(references.length, 9, "The public package must retain all nine media references.");

for (const route of new Set(references)) {
  const sourceName = mediaFiles.get(route);
  assert.ok(sourceName, `Unexpected public media route: ${route}`);
  const publicPath = path.join(publicRoot, "media", route);
  const sourcePath = path.join(projectRoot, "src", "assets", sourceName);
  assert.ok(fs.existsSync(publicPath), `Missing public media file: ${route}`);
  assert.equal(sha256(publicPath), sha256(sourcePath), `Public media bytes differ: ${route}`);
}

console.log("Public media tests passed: every CDN-safe route is packaged with source-identical bytes.");
