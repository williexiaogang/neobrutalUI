#!/usr/bin/env node
// ============================================================================
// Neo-Brutal UI — API Snapshot Test
//
// Extracts public CSS classes, tokens, and JS exports into a versioned
// snapshot. Fails CI if the API surface changes without explicit snapshot update.
//
// Usage:
//   node scripts/snapshot-api.mjs          # generate snapshot + compare
//   UPDATE_SNAPSHOT=1 node scripts/snapshot-api.mjs   # overwrite snapshot
// ============================================================================

import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createHash } from "node:crypto";

const root = resolve(import.meta.dirname, "..");
const snapshotPath = resolve(root, "reports", "api-snapshot.json");

/* ───────────────────────── helpers ───────────────────────── */

async function readText(path) {
  try {
    return await readFile(path, "utf-8");
  } catch {
    return null;
  }
}

function hash(content) {
  return createHash("sha256").update(content).digest("hex").slice(0, 16);
}

function uniqueSorted(arr) {
  return [...new Set(arr)].sort();
}

/* ───────────────────────── extractors ───────────────────────── */

async function extractCssClasses() {
  const componentsDir = resolve(root, "packages/core/src/components");
  const entries = await readdir(componentsDir, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile() && e.name.endsWith(".css"));

  const allClasses = [];
  for (const f of files) {
    const content = await readText(resolve(componentsDir, f.name));
    if (!content) continue;
    // Match .nb-... class selectors
    const re = /\.nb-[a-z0-9-]+/g;
    let m;
    while ((m = re.exec(content)) !== null) {
      allClasses.push(m[0].slice(1)); // drop leading dot
    }
  }
  return uniqueSorted(allClasses);
}

async function extractTokens() {
  const tokensDir = resolve(root, "packages/core/src/tokens");
  const entries = await readdir(tokensDir, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile() && e.name.endsWith(".css"));

  const allTokens = [];
  for (const f of files) {
    const content = await readText(resolve(tokensDir, f.name));
    if (!content) continue;
    const re = /--nb-[a-z0-9-]+/g;
    let m;
    while ((m = re.exec(content)) !== null) {
      allTokens.push(m[0]);
    }
  }
  return uniqueSorted(allTokens);
}

async function extractJsExports() {
  const indexPath = resolve(root, "packages/interactions/src/index.ts");
  const content = await readText(indexPath);
  if (!content) return { named: [], types: [] };

  const named = [];
  const types = [];

  // export { foo, bar } from './module'
  const namedRe = /export\s+\{([^}]+)\}\s*(?:from\s*['"][^'"]+['"])?\s*;?/g;
  let m;
  while ((m = namedRe.exec(content)) !== null) {
    m[1].split(",").forEach((s) => {
      const name = s.trim().split(/\s+as\s+/)[0].trim();
      if (name) named.push(name);
    });
  }

  // export function foo(
  const fnRe = /export\s+function\s+([a-zA-Z0-9_]+)/g;
  while ((m = fnRe.exec(content)) !== null) {
    named.push(m[1]);
  }

  // export const foo =
  const constRe = /export\s+const\s+([a-zA-Z0-9_]+)/g;
  while ((m = constRe.exec(content)) !== null) {
    named.push(m[1]);
  }

  // export type { ... }
  const typeRe = /export\s+type\s+\{([^}]+)\}\s*(?:from\s*['"][^'"]+['"])?\s*;?/g;
  while ((m = typeRe.exec(content)) !== null) {
    m[1].split(",").forEach((s) => {
      const name = s.trim().split(/\s+as\s+/)[0].trim();
      if (name) types.push(name);
    });
  }

  return { named: uniqueSorted(named), types: uniqueSorted(types) };
}

/* ───────────────────────── main ───────────────────────── */

async function main() {
  console.log("📸 API Snapshot\n");

  const [cssClasses, tokens, jsExports] = await Promise.all([
    extractCssClasses(),
    extractTokens(),
    extractJsExports(),
  ]);

  const snapshot = {
    meta: {
      generatedAt: new Date().toISOString(),
      version: "0.0.2",
    },
    css: {
      classCount: cssClasses.length,
      classes: cssClasses,
      hash: hash(cssClasses.join("\n")),
    },
    tokens: {
      tokenCount: tokens.length,
      tokens,
      hash: hash(tokens.join("\n")),
    },
    js: {
      namedExportCount: jsExports.named.length,
      namedExports: jsExports.named,
      typeExportCount: jsExports.types.length,
      typeExports: jsExports.types,
      hash: hash(jsExports.named.join("\n") + "\n" + jsExports.types.join("\n")),
    },
  };

  const update = process.env.UPDATE_SNAPSHOT === "1";
  const previousRaw = await readText(snapshotPath);

  if (previousRaw && !update) {
    const previous = JSON.parse(previousRaw);
    const diffs = [];

    if (previous.css?.hash !== snapshot.css.hash) {
      diffs.push("CSS class surface changed");
    }
    if (previous.tokens?.hash !== snapshot.tokens.hash) {
      diffs.push("Token surface changed");
    }
    if (previous.js?.hash !== snapshot.js.hash) {
      diffs.push("JS export surface changed");
    }

    if (diffs.length > 0) {
      console.error("❌ API snapshot mismatch:");
      diffs.forEach((d) => console.error(`   - ${d}`));
      console.error("\nRun with UPDATE_SNAPSHOT=1 to accept the new surface.");
      process.exit(1);
    } else {
      console.log("✅ API snapshot matches — no breaking changes detected.");
    }
  } else if (update) {
    console.log("🔄 Updating API snapshot…");
  } else {
    console.log("🆕 Creating initial API snapshot…");
  }

  // Always write the latest snapshot so it can be inspected / committed
  await writeFile(snapshotPath, JSON.stringify(snapshot, null, 2) + "\n", "utf-8");
  console.log(`   ${snapshot.css.classCount} CSS classes`);
  console.log(`   ${snapshot.tokens.tokenCount} tokens`);
  console.log(`   ${snapshot.js.namedExportCount} named JS exports`);
  console.log(`   ${snapshot.js.typeExportCount} type JS exports`);
  console.log(`\n📁 Written to ${snapshotPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
