import { readFile, readdir } from "node:fs/promises";
import { resolve, relative } from "node:path";

const root = resolve(import.meta.dirname, "..");
const coreSrc = resolve(root, "packages/core/src");

async function collectCssFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectCssFiles(path)));
    } else if (entry.name.endsWith(".css")) {
      files.push(path);
    }
  }
  return files;
}

async function checkUndefinedTokens(files) {
  const defined = new Set();
  const used = [];

  for (const file of files) {
    const content = await readFile(file, "utf-8");
    const defs = content.matchAll(/(--nb-[\w-]+)\s*:/g);
    for (const m of defs) defined.add(m[1]);
    const uses = content.matchAll(/var\((--nb-[\w-]+)\)/g);
    for (const m of uses) {
      used.push({ var: m[1], file: relative(root, file) });
    }
  }

  const missing = used.filter((u) => !defined.has(u.var));
  const map = new Map();
  for (const u of missing) {
    if (!map.has(u.var)) map.set(u.var, u.file);
  }
  return { defined: defined.size, undefined: Array.from(map.entries()) };
}

async function checkHardcodedColors(files) {
  const issues = [];
  const hexRegex = /#[0-9a-fA-F]{3,8}\b/g;
  const rgbRegex = /rgba?\s*\(/g;

  for (const file of files) {
    const content = await readFile(file, "utf-8");
    const rel = relative(root, file);
    let m;
    while ((m = hexRegex.exec(content)) !== null) {
      issues.push({ type: "hex", value: m[0], file: rel });
    }
    while ((m = rgbRegex.exec(content)) !== null) {
      issues.push({ type: "rgb", value: m[0], file: rel });
    }
  }
  return issues;
}

async function checkLayerNames(files) {
  const valid = new Set([
    "nb.theme",
    "nb.base",
    "nb.components",
    "nb.utilities"
  ]);
  const issues = [];

  for (const file of files) {
    const content = await readFile(file, "utf-8");
    const rel = relative(root, file);
    const matches = content.matchAll(/@layer\s+([^{;]+)/g);
    for (const m of matches) {
      const names = m[1]
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      for (const n of names) {
        if (!valid.has(n)) {
          issues.push({ layer: n, file: rel });
        }
      }
    }
  }
  return issues;
}

async function checkComponentPrefixes(files) {
  const issues = [];
  const seen = new Set();

  for (const file of files) {
    if (!file.includes("/components/")) continue;
    const content = await readFile(file, "utf-8");
    const rel = relative(root, file);
    const matches = content.matchAll(/\.(\w[\w-]*)/g);
    for (const m of matches) {
      const cls = m[1];
      if (!cls.startsWith("nb-")) {
        const key = `${cls}@${rel}`;
        if (!seen.has(key)) {
          seen.add(key);
          issues.push({ className: cls, file: rel });
        }
      }
    }
  }
  return issues;
}

async function main() {
  const files = await collectCssFiles(coreSrc);
  console.log(
    `🔍 Found ${files.length} CSS files in ${relative(root, coreSrc)}\n`
  );

  let allPassed = true;

  // 1. Token definitions
  const { defined, undefined } = await checkUndefinedTokens(files);
  console.log("1. Token Definitions");
  console.log(`   Defined: ${defined}`);
  if (undefined.length) {
    console.log("   ❌ Undefined tokens found:");
    for (const [token, file] of undefined) {
      console.log(`      - ${token} in ${file}`);
    }
    allPassed = false;
  } else {
    console.log("   ✅ All var(--nb-*) tokens are defined");
  }

  // 2. Hardcoded colors
  const colorIssues = await checkHardcodedColors(files);
  console.log("\n2. Hardcoded Colors");
  if (colorIssues.length) {
    console.log("   ❌ Found hardcoded colors:");
    for (const issue of colorIssues) {
      console.log(
        `      - ${issue.type}: ${issue.value} in ${issue.file}`
      );
    }
    allPassed = false;
  } else {
    console.log("   ✅ No hardcoded #hex or rgb() colors");
  }

  // 3. Layer names
  const layerIssues = await checkLayerNames(files);
  console.log("\n3. Layer Names");
  if (layerIssues.length) {
    console.log("   ❌ Invalid layer names:");
    for (const issue of layerIssues) {
      console.log(`      - "${issue.layer}" in ${issue.file}`);
    }
    allPassed = false;
  } else {
    console.log("   ✅ All @layer declarations use valid names");
  }

  // 4. Component prefixes
  const prefixIssues = await checkComponentPrefixes(files);
  console.log("\n4. Component Prefixes");
  if (prefixIssues.length) {
    console.log("   ❌ Missing nb- prefix:");
    for (const issue of prefixIssues) {
      console.log(`      - .${issue.className} in ${issue.file}`);
    }
    allPassed = false;
  } else {
    console.log("   ✅ All component classes use nb- prefix");
  }

  // Summary
  console.log(
    `\n${allPassed ? "✅ All checks passed" : "❌ Some checks failed"}`
  );
  process.exit(allPassed ? 0 : 1);
}

await main();
