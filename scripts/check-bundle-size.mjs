#!/usr/bin/env node
// ============================================================================
// Neo-Brutal UI — Bundle Size Monitor
//
// Reads built artifacts, reports gzip sizes, and enforces thresholds.
// Fails CI if thresholds are exceeded.
//
// Thresholds:
//   - core CSS (index.css)   ≤ 30 KB gzip
//   - interactions JS (index.js) ≤ 15 KB gzip
// ============================================================================

import { readFile, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createGzip } from "node:zlib";
import { promisify } from "node:util";
import { pipeline } from "node:stream";

const root = resolve(import.meta.dirname, "..");
const reportPath = resolve(root, "reports", "bundle-size.json");

const THRESHOLDS = {
  "core-css": 30 * 1024,      // 30 KB gzip
  "interactions-js": 15 * 1024, // 15 KB gzip
};

/* ───────────────────────── helpers ───────────────────────── */

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(2)} KB`;
}

async function gzipSize(filePath) {
  const source = await readFile(filePath);
  const gzip = createGzip({ level: 9 });
  const chunks = [];

  const pump = promisify(pipeline);
  const { Readable } = await import("node:stream");

  return new Promise((resolve, reject) => {
    const readable = Readable.from([source]);
    readable.on("error", reject);
    gzip.on("data", (chunk) => chunks.push(chunk));
    gzip.on("end", () => resolve(Buffer.concat(chunks).length));
    gzip.on("error", reject);
    readable.pipe(gzip);
  });
}

async function fileSize(filePath) {
  const s = await stat(filePath);
  return s.size;
}

/* ───────────────────────── main ───────────────────────── */

async function main() {
  console.log("📦 Bundle Size Monitor\n");

  const coreCssPath = resolve(root, "packages/core/dist/index.css");
  const interactionsJsPath = resolve(root, "packages/interactions/dist/index.js");

  const results = [];
  let allPassed = true;

  // Core CSS
  {
    const raw = await fileSize(coreCssPath);
    const gz = await gzipSize(coreCssPath);
    const limit = THRESHOLDS["core-css"];
    const passed = gz <= limit;
    if (!passed) allPassed = false;

    results.push({
      name: "core-css",
      file: "packages/core/dist/index.css",
      rawBytes: raw,
      gzipBytes: gz,
      thresholdBytes: limit,
      passed,
    });

    console.log(`  ${passed ? "✅" : "❌"} core-css`);
    console.log(`     raw:  ${formatBytes(raw)}`);
    console.log(`     gzip: ${formatBytes(gz)}  (threshold: ${formatBytes(limit)})`);
  }

  // Interactions JS
  {
    const raw = await fileSize(interactionsJsPath);
    const gz = await gzipSize(interactionsJsPath);
    const limit = THRESHOLDS["interactions-js"];
    const passed = gz <= limit;
    if (!passed) allPassed = false;

    results.push({
      name: "interactions-js",
      file: "packages/interactions/dist/index.js",
      rawBytes: raw,
      gzipBytes: gz,
      thresholdBytes: limit,
      passed,
    });

    console.log(`  ${passed ? "✅" : "❌"} interactions-js`);
    console.log(`     raw:  ${formatBytes(raw)}`);
    console.log(`     gzip: ${formatBytes(gz)}  (threshold: ${formatBytes(limit)})`);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    allPassed,
    results,
  };

  await writeFile(reportPath, JSON.stringify(report, null, 2) + "\n", "utf-8");
  console.log(`\n📁 Report written to ${reportPath}`);

  if (!allPassed) {
    console.error("\n❌ Bundle size thresholds exceeded.");
    process.exit(1);
  } else {
    console.log("\n✅ All bundle size thresholds passed.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
