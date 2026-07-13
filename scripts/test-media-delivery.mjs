import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const mediaCases = [
  ["brand-white", "stepup-white-20260713.png", "image/png"],
  ["hero-stage", "harold-hero-296.jpg", "image/jpeg"],
  ["stage", "harold-stage.jpg", "image/jpeg"],
  ["candid", "harold-candid.jpeg", "image/jpeg"],
  ["authority", "harold-authority.jpeg", "image/jpeg"],
  ["investor-report", "harold-investor-report-20260713.jpg", "image/jpeg"],
  ["investor-editorial", "harold-investor-editorial.jpg", "image/jpeg"],
  ["power", "harold-power.jpeg", "image/jpeg"],
];

function sha256(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

async function getFreePort() {
  const server = net.createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  await new Promise((resolve) => server.close(resolve));
  return address.port;
}

async function waitForServer(baseUrl, child) {
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`Application exited with code ${child.exitCode}.`);
    try {
      const response = await fetch(`${baseUrl}/healthz`);
      if (response.ok) return;
    } catch {
      // The child process may still be opening the port.
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error("Application did not become ready in time.");
}

const port = await getFreePort();
const baseUrl = `http://127.0.0.1:${port}`;
const child = spawn(process.execPath, ["app.js"], {
  cwd: projectRoot,
  env: { ...process.env, PORT: String(port) },
  stdio: ["ignore", "pipe", "pipe"],
});

try {
  await waitForServer(baseUrl, child);

  for (const [route, filename, contentType] of mediaCases) {
    const response = await fetch(`${baseUrl}/media/${route}`);
    assert.equal(response.status, 200, `${route} should be served.`);
    assert.equal(response.headers.get("content-type"), contentType, `${route} content type.`);
    assert.match(response.headers.get("cache-control") || "", /no-store/i, `${route} must not be cached by the CDN.`);
    assert.match(response.headers.get("cache-control") || "", /no-transform/i, `${route} must not be transformed by the CDN.`);

    const liveBytes = Buffer.from(await response.arrayBuffer());
    const sourceBytes = fs.readFileSync(path.join(projectRoot, "src/assets", filename));
    assert.equal(Number(response.headers.get("content-length")), sourceBytes.length, `${route} content length.`);
    assert.equal(sha256(liveBytes), sha256(sourceBytes), `${route} byte integrity.`);
  }

  const headResponse = await fetch(`${baseUrl}/media/brand-white`, { method: "HEAD" });
  assert.equal(headResponse.status, 200, "Media HEAD request should succeed.");
  assert.match(headResponse.headers.get("cache-control") || "", /no-transform/i);
  assert.equal((await headResponse.arrayBuffer()).byteLength, 0, "HEAD must not return a body.");

  for (const unknownRoute of ["not-configured", "toString", "__proto__"]) {
    const missingResponse = await fetch(`${baseUrl}/media/${unknownRoute}`);
    assert.equal(missingResponse.status, 404, `Unknown media route must fail closed: ${unknownRoute}`);
  }
} finally {
  child.kill("SIGTERM");
}

console.log("Media delivery tests passed: byte integrity, no-store and no-transform controls.");
