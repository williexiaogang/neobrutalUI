import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import { resolve, relative, dirname } from "node:path";

const root = resolve(import.meta.dirname, "..");
const coreSrc = resolve(root, "packages/core/src");

const pathSep = /\\/g;
function normalizePath(p) {
  return p.replace(pathSep, "/");
}

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

/* ------------------------------------------------------------------
 * a) Circular reference detection
 * ------------------------------------------------------------------ */
async function buildImportGraph(files) {
  const graph = new Map();
  for (const file of files) {
    const content = await readFile(file, "utf-8");
    const rel = normalizePath(relative(root, file));
    const imports = [];
    const importMatches = content.matchAll(
      /@import\s+url\(["']?([^"')]+)["']?\)/g
    );
    for (const m of importMatches) {
      const importedPath = resolve(dirname(file), m[1]);
      imports.push(normalizePath(relative(root, importedPath)));
    }
    graph.set(rel, imports);
  }
  return graph;
}

function detectCycles(graph) {
  const cycles = [];
  const visited = new Set();
  const recStack = new Set();

  function dfs(node, path) {
    visited.add(node);
    recStack.add(node);
    const neighbors = graph.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        const result = dfs(neighbor, [...path, neighbor]);
        if (result) return result;
      } else if (recStack.has(neighbor)) {
        const cycleStart = path.indexOf(neighbor);
        return [...path.slice(cycleStart), neighbor];
      }
    }
    recStack.delete(node);
    return null;
  }

  for (const node of graph.keys()) {
    if (!visited.has(node)) {
      const cycle = dfs(node, [node]);
      if (cycle) cycles.push(cycle);
    }
  }
  return cycles;
}

/* ------------------------------------------------------------------
 * b) Undefined token use detection (definitions only from tokens/*.css)
 * ------------------------------------------------------------------ */
async function checkUndefinedTokens(files) {
  const tokenDefinitionFiles = files.filter((f) => normalizePath(f).includes("/tokens/"));
  const defined = new Set();
  const used = [];

  // Collect definitions from tokens/*.css
  for (const file of tokenDefinitionFiles) {
    const content = await readFile(file, "utf-8");
    const defs = content.matchAll(/(--nb-[\w-]+)\s*:/g);
    for (const m of defs) defined.add(m[1]);
  }

  for (const file of files) {
    const content = await readFile(file, "utf-8");
    const rel = relative(root, file);
    // Match var(--nb-...) with optional fallback: var(--nb-xxx, fallback)
    const uses = content.matchAll(/var\((--nb-[\w-]+)(?:\s*,\s*[^)]+)?\)/g);
    for (const m of uses) {
      used.push({ var: m[1], file: rel });
    }
  }

  const missing = used.filter((u) => !defined.has(u.var));
  const map = new Map();
  for (const u of missing) {
    if (!map.has(u.var)) map.set(u.var, new Set());
    map.get(u.var).add(u.file);
  }
  return { defined: defined.size, undefined: Array.from(map.entries()) };
}

/* ------------------------------------------------------------------
 * c) Public / internal token boundary detection
 * ------------------------------------------------------------------ */
async function checkPublicInternalBoundary(files) {
  const issues = [];
  for (const file of files) {
    if (!normalizePath(file).includes("/components/")) continue;
    const content = await readFile(file, "utf-8");
    const rel = relative(root, file);
    const defs = content.matchAll(/(--nb-[\w-]+)\s*:/g);
    for (const m of defs) {
      issues.push({ var: m[1], file: rel });
    }
  }
  return issues;
}

/* ------------------------------------------------------------------
 * d) CSS brace balance and nesting
 * ------------------------------------------------------------------ */
async function checkBraceBalance(files) {
  const issues = [];

  for (const file of files) {
    const content = await readFile(file, "utf-8");
    const rel = relative(root, file);

    let depth = 0;
    let line = 1;
    let inString = false;
    let stringChar = null;
    let inComment = false;

    for (let i = 0; i < content.length; i++) {
      const ch = content[i];
      const next = content[i + 1];

      if (ch === "\n") line++;

      // Handle comments
      if (!inString && !inComment && ch === "/" && next === "*") {
        inComment = true;
        i++;
        continue;
      }
      if (inComment && ch === "*" && next === "/") {
        inComment = false;
        i++;
        continue;
      }
      if (inComment) continue;

      // Handle strings
      if (!inString && (ch === '"' || ch === "'")) {
        inString = true;
        stringChar = ch;
        continue;
      }
      if (inString && ch === stringChar && content[i - 1] !== "\\") {
        inString = false;
        stringChar = null;
        continue;
      }
      if (inString) continue;

      if (ch === "{") depth++;
      if (ch === "}") {
        depth--;
        if (depth < 0) {
          issues.push({
            type: "unbalanced",
            detail: `Unexpected closing brace at line ${line}`,
            file: rel,
          });
          depth = 0;
        }
      }
    }

    if (depth > 0) {
      issues.push({
        type: "unbalanced",
        detail: `Missing ${depth} closing brace(s)`,
        file: rel,
      });
    }

    // Check @media and @layer nesting
    const atRuleRegex = /@(media|layer|supports)\s+([^{]+)\{/g;
    let match;
    while ((match = atRuleRegex.exec(content)) !== null) {
      let braceDepth = 1;
      let j = match.index + match[0].length;
      let foundClose = false;
      while (j < content.length) {
        if (content[j] === "{") braceDepth++;
        if (content[j] === "}") {
          braceDepth--;
          if (braceDepth === 0) {
            foundClose = true;
            break;
          }
        }
        j++;
      }
      if (!foundClose) {
        issues.push({
          type: "nesting",
          detail: `Unclosed @${match[1]} rule`,
          file: rel,
        });
      }
    }
  }
  return issues;
}

/* ------------------------------------------------------------------
 * Existing checks
 * ------------------------------------------------------------------ */
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
    "nb.utilities",
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
    if (!normalizePath(file).includes("/components/")) continue;
    const content = await readFile(file, "utf-8");
    const rel = relative(root, file);

    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Skip at-rules and closing braces
      if (trimmed.startsWith("@") || trimmed.startsWith("}")) continue;

      // Extract selector part (before first `{` on this line)
      const selectorPart = trimmed.split("{")[0];
      if (!selectorPart) continue;

      // Skip lines that look like property declarations:
      // if there's a `:` before any `.` / `#` / `[` and no `{` on the line
      if (!trimmed.includes("{") && !trimmed.includes("}")) {
        const colonIdx = selectorPart.indexOf(":");
        if (colonIdx !== -1) {
          const beforeColon = selectorPart.slice(0, colonIdx);
          if (!beforeColon.includes(".") && !beforeColon.includes("#") && !beforeColon.includes("[")) {
            continue; // property line like `opacity: 0.6;`
          }
        }
      }

      // Find class selectors in the selector part
      const classMatches = selectorPart.matchAll(/\.([a-zA-Z][\w-]*)/g);
      for (const m of classMatches) {
        const cls = m[1];
        // Allow state/helper classes (is-*, has-*) as they are common modifier
        // patterns not considered part of the nb- component namespace.
        if (cls.startsWith("is-") || cls.startsWith("has-")) continue;
        if (!cls.startsWith("nb-")) {
          const key = `${cls}@${rel}`;
          if (!seen.has(key)) {
            seen.add(key);
            issues.push({ className: cls, file: rel, line: i + 1 });
          }
        }
      }
    }
  }
  return issues;
}

/* ------------------------------------------------------------------
 * Report generation
 * ------------------------------------------------------------------ */
async function generateReport(results, files, totalDefined, passed) {
  const reportDir = resolve(root, "reports");
  await mkdir(reportDir, { recursive: true });
  const reportPath = resolve(reportDir, "verify-report.md");

  const totalIssues = results.reduce(
    (sum, r) => sum + (r.status === "fail" ? r.details.length : 0),
    0
  );
  const passCount = results.filter((r) => r.status === "pass").length;
  const failCount = results.filter((r) => r.status === "fail").length;

  const lines = [
    "# CSS Verification Report",
    "",
    `**Generated:** ${new Date().toISOString()}`,
    `**Files Scanned:** ${files.length}`,
    `**Total Token Definitions:** ${totalDefined}`,
    "",
    "## Summary",
    "",
    "| Check | Status | Issues |",
    "|-------|--------|--------|",
    ...results.map(
      (r) =>
        `| ${r.name} | ${r.status === "pass" ? "✅ Pass" : "❌ Fail"} | ${r.details.length} |`
    ),
    "",
    `**Result:** ${passCount}/${results.length} checks passed`,
    `**Total Issues:** ${totalIssues}`,
    "",
    "## Details",
    "",
  ];

  for (const result of results) {
    lines.push(`### ${result.name}`);
    lines.push("");
    if (result.status === "pass") {
      lines.push("✅ **Passed**");
    } else {
      lines.push(`❌ **Failed** — ${result.details.length} issue(s) found:`);
      lines.push("");
      for (const detail of result.details) {
        lines.push(`- ${detail}`);
      }
    }
    lines.push("");
  }

  lines.push("## File-Level Statistics");
  lines.push("");
  lines.push("| File | Layer | Classes | Tokens Used |");
  lines.push("|------|-------|---------|-------------|");

  for (const file of files.sort()) {
    const rel = relative(root, file);
    const content = await readFile(file, "utf-8");
    const hasLayer = content.includes("@layer");
    const classCount = (content.match(/\.(nb-[\w-]+)/g) || []).length;
    const tokenUses = (content.match(/var\(--nb-[\w-]+\)/g) || []).length;
    lines.push(
      `| ${rel} | ${hasLayer ? "Yes" : "No"} | ${classCount} | ${tokenUses} |`
    );
  }

  lines.push("");
  lines.push("## How to Fix");
  lines.push("");
  lines.push("| Issue | Fix |");
  lines.push("|-------|-----|");
  lines.push(
    "| Undefined Token | Define the missing `--nb-*` variable in the appropriate `tokens/*.css` file, or check for typos. |"
  );
  lines.push(
    "| Hardcoded Color | Replace `#hex` or `rgb()` with a semantic token like `var(--nb-primary)` or `var(--nb-base-content)`. |"
  );
  lines.push(
    "| Invalid Layer Name | Use one of: `nb.theme`, `nb.base`, `nb.components`, `nb.utilities`. |"
  );
  lines.push("| Missing Prefix | Rename the class to start with `nb-`. |");
  lines.push(
    "| Circular Import | Reorder or remove `@import url()` statements to break the cycle. |"
  );
  lines.push(
    "| Public Token in Component | Rename `--nb-*` to `--_*` in component files, or move the definition to `tokens/*.css`. |"
  );
  lines.push(
    "| Unbalanced Braces | Check for missing or extra `{` / `}` in the reported file. |"
  );
  lines.push("");

  await writeFile(reportPath, lines.join("\n"), "utf-8");
  return relative(root, reportPath);
}

/* ------------------------------------------------------------------
 * Main
 * ------------------------------------------------------------------ */
async function main() {
  const files = await collectCssFiles(coreSrc);
  console.log(
    `🔍 Found ${files.length} CSS files in ${relative(root, coreSrc)}\n`
  );

  let allPassed = true;
  const results = [];

  // 1. Token definitions
  const { defined, undefined } = await checkUndefinedTokens(files);
  console.log("1. Token Definitions");
  console.log(`   Defined: ${defined}`);
  const tokenDefOk = undefined.length === 0;
  if (!tokenDefOk) {
    console.log("   ❌ Undefined tokens found:");
    for (const [token, fileSet] of undefined) {
      const filesStr = Array.from(fileSet).join(", ");
      console.log(`      - ${token} in ${filesStr}`);
    }
    allPassed = false;
  } else {
    console.log("   ✅ All var(--nb-*) tokens are defined");
  }
  results.push({
    name: "Token Definitions",
    status: tokenDefOk ? "pass" : "fail",
    details: undefined.map(([t, f]) => `${t} in ${Array.from(f).join(", ")}`),
  });

  // 2. Hardcoded colors
  const colorIssues = await checkHardcodedColors(files);
  console.log("\n2. Hardcoded Colors");
  const colorOk = colorIssues.length === 0;
  if (!colorOk) {
    console.log("   ❌ Found hardcoded colors:");
    for (const issue of colorIssues) {
      console.log(`      - ${issue.type}: ${issue.value} in ${issue.file}`);
    }
    allPassed = false;
  } else {
    console.log("   ✅ No hardcoded #hex or rgb() colors");
  }
  results.push({
    name: "Hardcoded Colors",
    status: colorOk ? "pass" : "fail",
    details: colorIssues.map((i) => `${i.type}: ${i.value} in ${i.file}`),
  });

  // 3. Layer names
  const layerIssues = await checkLayerNames(files);
  console.log("\n3. Layer Names");
  const layerOk = layerIssues.length === 0;
  if (!layerOk) {
    console.log("   ❌ Invalid layer names:");
    for (const issue of layerIssues) {
      console.log(`      - "${issue.layer}" in ${issue.file}`);
    }
    allPassed = false;
  } else {
    console.log("   ✅ All @layer declarations use valid names");
  }
  results.push({
    name: "Layer Names",
    status: layerOk ? "pass" : "fail",
    details: layerIssues.map((i) => `"${i.layer}" in ${i.file}`),
  });

  // 4. Component prefixes
  const prefixIssues = await checkComponentPrefixes(files);
  console.log("\n4. Component Prefixes");
  const prefixOk = prefixIssues.length === 0;
  if (!prefixOk) {
    console.log("   ❌ Missing nb- prefix:");
    for (const issue of prefixIssues) {
      console.log(`      - .${issue.className} in ${issue.file}`);
    }
    allPassed = false;
  } else {
    console.log("   ✅ All component classes use nb- prefix");
  }
  results.push({
    name: "Component Prefixes",
    status: prefixOk ? "pass" : "fail",
    details: prefixIssues.map((i) => `.${i.className} in ${i.file}`),
  });

  // 5. Circular references
  const graph = await buildImportGraph(files);
  const cycles = detectCycles(graph);
  console.log("\n5. Circular References");
  const cycleOk = cycles.length === 0;
  if (!cycleOk) {
    console.log("   ❌ Circular imports detected:");
    for (const cycle of cycles) {
      console.log(`      - ${cycle.join(" → ")}`);
    }
    allPassed = false;
  } else {
    console.log("   ✅ No circular @import references");
  }
  results.push({
    name: "Circular References",
    status: cycleOk ? "pass" : "fail",
    details: cycles.map((c) => c.join(" → ")),
  });

  // 6. Public / Internal boundary
  const boundaryIssues = await checkPublicInternalBoundary(files);
  console.log("\n6. Public / Internal Token Boundary");
  const boundaryOk = boundaryIssues.length === 0;
  if (!boundaryOk) {
    console.log("   ❌ Public token definitions found in component files:");
    for (const issue of boundaryIssues) {
      console.log(`      - ${issue.var} in ${issue.file}`);
    }
    allPassed = false;
  } else {
    console.log("   ✅ No --nb-* definitions in component files");
  }
  results.push({
    name: "Public / Internal Boundary",
    status: boundaryOk ? "pass" : "fail",
    details: boundaryIssues.map((i) => `${i.var} in ${i.file}`),
  });

  // 7. Brace balance & nesting
  const braceIssues = await checkBraceBalance(files);
  console.log("\n7. Brace Balance & Nesting");
  const braceOk = braceIssues.length === 0;
  if (!braceOk) {
    console.log("   ❌ CSS nesting issues found:");
    for (const issue of braceIssues) {
      console.log(`      - ${issue.detail} in ${issue.file}`);
    }
    allPassed = false;
  } else {
    console.log("   ✅ All CSS braces are balanced");
  }
  results.push({
    name: "Brace Balance & Nesting",
    status: braceOk ? "pass" : "fail",
    details: braceIssues.map((i) => `${i.detail} in ${i.file}`),
  });

  // Summary
  console.log(`\n${allPassed ? "✅ All checks passed" : "❌ Some checks failed"}`);

  // Generate report
  const reportPath = await generateReport(results, files, defined, allPassed);
  console.log(`📄 Report saved to ${reportPath}`);

  process.exit(allPassed ? 0 : 1);
}

await main();
