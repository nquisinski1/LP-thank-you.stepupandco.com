"use strict";

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const root = path.join(__dirname, "src");
const port = Number.parseInt(process.env.PORT || "3000", 10);
const host = "0.0.0.0";

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".webp": "image/webp"
};

const mediaFiles = new Map([
  ["brand-white", "stepup-white-20260713.png"],
  ["hero-stage", "harold-hero-296.jpg"],
  ["stage", "harold-stage.jpg"],
  ["candid", "harold-candid.jpeg"],
  ["authority", "harold-authority.jpeg"],
  ["investor-report", "harold-investor-report-20260713.jpg"],
  ["investor-editorial", "harold-investor-editorial.jpg"],
  ["power", "harold-power.jpeg"]
]);

function sendText(response, statusCode, message) {
  response.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "X-Content-Type-Options": "nosniff"
  });
  response.end(message);
}

function serveFile(filePath, response) {
  const extension = path.extname(filePath).toLowerCase();
  const cacheControl = extension === ".html" || extension === ".js" ? "no-cache" : "public, max-age=3600";

  response.writeHead(200, {
    "Cache-Control": cacheControl,
    "Content-Type": contentTypes[extension] || "application/octet-stream",
    "X-Content-Type-Options": "nosniff"
  });

  const stream = fs.createReadStream(filePath);
  stream.on("error", () => {
    if (!response.headersSent) sendText(response, 500, "Internal server error");
    else response.destroy();
  });
  stream.pipe(response);
}

function serveMedia(filename, requestMethod, response) {
  const filePath = path.join(root, "assets", filename);

  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      sendText(response, 404, "Not found");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      "Cache-Control": "no-store, no-transform",
      "Content-Length": stats.size,
      "Content-Type": contentTypes[extension] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff"
    });

    if (requestMethod === "HEAD") {
      response.end();
      return;
    }

    const stream = fs.createReadStream(filePath);
    stream.on("error", () => response.destroy());
    stream.pipe(response);
  });
}

const server = http.createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.setHeader("Allow", "GET, HEAD");
    sendText(response, 405, "Method not allowed");
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  } catch {
    sendText(response, 400, "Bad request");
    return;
  }

  if (pathname === "/healthz") {
    sendText(response, 200, "ok");
    return;
  }

  if (pathname.startsWith("/media/")) {
    const mediaKey = pathname.slice("/media/".length);
    const filename = mediaFiles.get(mediaKey);
    if (!filename) {
      sendText(response, 404, "Not found");
      return;
    }
    serveMedia(filename, request.method, response);
    return;
  }

  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.resolve(root, `.${requestedPath}`);

  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
    sendText(response, 403, "Forbidden");
    return;
  }

  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      sendText(response, 404, "Not found");
      return;
    }

    if (request.method === "HEAD") {
      const extension = path.extname(filePath).toLowerCase();
      response.writeHead(200, {
        "Content-Type": contentTypes[extension] || "application/octet-stream",
        "X-Content-Type-Options": "nosniff"
      });
      response.end();
      return;
    }

    serveFile(filePath, response);
  });
});

server.listen(port, host, () => {
  console.log(`StepUp thank-you page listening on ${host}:${port}`);
});
