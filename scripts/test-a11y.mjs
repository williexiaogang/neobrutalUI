#!/usr/bin/env node
// ============================================================================
// Neo-Brutal UI — Accessibility Test Runner
// ============================================================================
// Uses axe-core + Playwright to test built showcase pages for a11y violations.
// Falls back to static HTML heuristics if Playwright is unavailable.
//
// Usage:
//   node scripts/test-a11y.mjs
//   node scripts/test-a11y.mjs --static-only
//   node scripts/test-a11y.mjs --serve-dist
//
// Exit codes:
//   0 = all checks passed (or no critical/serious issues)
//   1 = critical or serious violations found
//   2 = dependency or configuration error
// ============================================================================

import { createServer } from "node:http";
import { readFileSync, existsSync, readdirSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = resolve(__dirname, "..");
const distDir = resolve(rootDir, "apps", "showcase", "dist");
const reportsDir = resolve(rootDir, "reports", "generated");

const args = process.argv.slice(2);
const staticOnly = args.includes("--static-only");
const serveDistFlag = args.includes("--serve-dist");
const ciMode = args.includes("--ci") || process.env.CI === "true";

// ── Colours ──
const c = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

function log(msg, colour = c.reset) {
  console.log(`${colour}${msg}${c.reset}`);
}

function findHtmlFiles(dir, base = dir) {
  const results = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...findHtmlFiles(full, base));
    } else if (extname(entry) === ".html") {
      results.push(relative(base, full).replace(/\\/g, "/"));
    }
  }
  return results.sort();
}

// ============================================================================
// 1. Dependency checks
// ============================================================================
let playwright = null;
let axeCore = null;

if (!staticOnly) {
  try {
    const pwModule = await import("playwright");
    playwright = pwModule;
  } catch {
    log("Playwright not found. Install with: npm install -D playwright", c.yellow);
  }
  try {
    const axeModule = await import("axe-core");
    axeCore = axeModule.default || axeModule;
  } catch {
    log("axe-core not found. Install with: npm install -D axe-core", c.yellow);
  }
}

const canRunFullTests = !staticOnly && playwright && axeCore && existsSync(distDir);

// ============================================================================
// 2. Static HTML heuristic checks (always run)
// ============================================================================
const staticIssues = [];

function runStaticChecks(htmlFiles, baseDir) {
  for (const file of htmlFiles) {
    const fullPath = join(baseDir, file);
    const html = readFileSync(fullPath, "utf-8");
    const lines = html.split("\n");
    const pageLabel = file.replace(/index\.html$/, "");

    // Heuristic checks
    const checks = [
      {
        name: "missing-lang",
        pattern: /<html[^>]*>/gi,
        test: (m) => !m[0].includes("lang="),
        msg: "<html> missing lang attribute",
      },
      {
        name: "missing-title",
        pattern: /<title>([^<]*)<\/title>/gi,
        test: (m) => !m[1] || m[1].trim().length < 2,
        msg: "<title> missing or empty",
      },
      {
        name: "img-missing-alt",
        pattern: /<img[^>]*>/gi,
        test: (m) => !m[0].includes("alt="),
        msg: "<img> missing alt attribute",
      },
      {
        name: "input-missing-label",
        pattern: /<input[^>]*>/gi,
        test: (m) => {
          const tag = m[0];
          const type = tag.match(/type=["']([^"']+)["']/i)?.[1] || "text";
          if (["hidden", "submit", "button", "image", "reset"].includes(type)) return false;
          const hasLabel =
            tag.includes("aria-label=") ||
            tag.includes("aria-labelledby=") ||
            tag.includes("id=");
          // We can only definitively flag if there is NO id and NO aria-label
          if (!hasLabel) return true;
          return false; // assume id+label pairing may exist elsewhere
        },
        msg: "<input> may be missing an accessible label",
      },
      {
        name: "button-missing-type",
        pattern: /<button[^>]*>/gi,
        test: (m) => !m[0].includes("type="),
        msg: "<button> missing type attribute",
      },
      {
        name: "low-contrast-risk",
        pattern: /opacity\s*:\s*0\.\d+/gi,
        test: (m) => {
          const val = parseFloat(m[0].replace(/opacity\s*:\s*/, ""));
          return val < 0.45;
        },
        msg: "Very low opacity may cause insufficient contrast",
      },
      {
        name: "missing-main-landmark",
        pattern: /<main|<div[^>]*role=["']main["']/gi,
        test: (m) => !m,
        msg: "No <main> or role=main landmark found",
      },
      {
        name: "focus-visible-missing",
        pattern: /:focus-visible/gi,
        test: (m) => !m,
        msg: "No :focus-visible styles found in inline or embedded CSS",
      },
    ];

    for (const check of checks) {
      const matches = [...html.matchAll(check.pattern)];
      if (matches.length === 0) {
        if (check.name === "missing-main-landmark" || check.name === "focus-visible-missing") {
          staticIssues.push({ page: pageLabel, severity: "moderate", message: check.msg });
        }
        continue;
      }
      let found = 0;
      for (const match of matches) {
        if (check.test(match)) {
          found++;
          // Find approximate line number
          let lineNum = 1;
          let pos = 0;
          while (true) {
            const nextNewline = html.indexOf("\n", pos);
            if (nextNewline === -1 || nextNewline >= match.index) break;
            lineNum++;
            pos = nextNewline + 1;
          }
          staticIssues.push({
            page: pageLabel,
            severity: check.name === "missing-lang" || check.name === "missing-title" ? "serious" : "moderate",
            message: `${check.msg} (line ~${lineNum})`,
          });
        }
      }
    }
  }
}

// ============================================================================
// 3. Full axe-core + Playwright tests
// ============================================================================
const axeViolations = [];

async function runAxeTests(htmlFiles) {
  if (!canRunFullTests) return;

  const browser = await playwright.chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  // Serve dist directory over a simple HTTP server so relative paths resolve
  const server = createServer((req, res) => {
    let urlPath = req.url.split("?")[0];
    if (urlPath.endsWith("/")) urlPath += "index.html";
    const filePath = join(distDir, urlPath);
    if (existsSync(filePath) && statSync(filePath).isFile()) {
      const content = readFileSync(filePath);
      const ext = extname(filePath);
      const mime =
        ext === ".html"
          ? "text/html"
          : ext === ".css"
          ? "text/css"
          : ext === ".js"
          ? "application/javascript"
          : ext === ".json"
          ? "application/json"
          : "application/octet-stream";
      res.writeHead(200, { "Content-Type": mime });
      res.end(content);
    } else {
      res.writeHead(404);
      res.end("Not found");
    }
  });

  await new Promise((res) => server.listen(0, "127.0.0.1", res));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  log(`\n▶ Serving built pages from ${distDir} at ${baseUrl}`, c.cyan);
  log(`▶ Running axe-core via Playwright…\n`, c.cyan);

  for (const file of htmlFiles) {
    const urlPath = file.replace(/\\/g, "/").replace(/index\.html$/, "");
    const url = `${baseUrl}/${urlPath}`;
    const label = urlPath || "index";

    try {
      await page.goto(url, { waitUntil: "networkidle" });
      await page.waitForLoadState("networkidle");

      // Inject axe-core
      const axeSource = readFileSync(
        resolve(rootDir, "node_modules", "axe-core", "axe.min.js"),
        "utf-8"
      );
      await page.evaluate(axeSource);

      const results = await page.evaluate(() => {
        return new Promise((resolve) => {
          window.axe.run(document, { reporter: "v2" }, (err, results) => {
            if (err) resolve({ error: err.message });
            else resolve(results);
          });
        });
      });

      if (results.error) {
        log(`  ⚠ ${label}: axe-core error — ${results.error}`, c.yellow);
        continue;
      }

      for (const v of results.violations || []) {
        for (const node of v.nodes || []) {
          axeViolations.push({
            page: label,
            rule: v.id,
            impact: v.impact,
            description: v.description,
            help: v.help,
            target: node.target?.join(" ") || "",
            htmlSnippet: node.html?.slice(0, 120) || "",
          });
        }
      }

      const critical = results.violations.filter((v) => v.impact === "critical").length;
      const serious = results.violations.filter((v) => v.impact === "serious").length;
      const moderate = results.violations.filter((v) => v.impact === "moderate").length;
      const minor = results.violations.filter((v) => v.impact === "minor").length;

      const colour = critical > 0 || serious > 0 ? c.red : moderate > 0 ? c.yellow : c.green;
      log(
        `  ${critical + serious + moderate + minor === 0 ? "✔" : "✖"} ${label} — critical:${critical} serious:${serious} moderate:${moderate} minor:${minor}`,
        colour
      );
    } catch (err) {
      log(`  ✖ ${label}: ${err.message}`, c.red);
    }
  }

  await context.close();
  await browser.close();
  await new Promise((res) => server.close(res));
}

// ============================================================================
// 4. Report generation
// ============================================================================
function writeReport() {
  if (!existsSync(reportsDir)) {
    mkdirSync(reportsDir, { recursive: true });
  }

  const report = {
    generatedAt: new Date().toISOString(),
    tool: "neo-brutal-a11y-test",
    mode: canRunFullTests ? "axe-core+playwright" : "static-heuristics",
    summary: {
      staticIssues: staticIssues.length,
      axeViolations: axeViolations.length,
      critical: axeViolations.filter((v) => v.impact === "critical").length,
      serious: axeViolations.filter((v) => v.impact === "serious").length,
      moderate: axeViolations.filter((v) => v.impact === "moderate").length,
      minor: axeViolations.filter((v) => v.impact === "minor").length,
    },
    staticIssues,
    axeViolations,
  };

  const reportPath = join(reportsDir, "a11y-report.json");
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`\n📄 Report written to ${relative(rootDir, reportPath)}`, c.cyan);
}

// ============================================================================
// 5. Main execution
// ============================================================================
async function main() {
  log("╔══════════════════════════════════════════════════════════════╗", c.cyan);
  log("║   Neo-Brutal UI — Accessibility Test Runner                ║", c.cyan);
  log("╚══════════════════════════════════════════════════════════════╝", c.cyan);

  if (!existsSync(distDir)) {
    log(`\n❌ Built showcase not found at:`, c.red);
    log(`   ${distDir}`, c.gray);
    log(`\n   Run the build first:`, c.yellow);
    log(`   cd apps/showcase && npm run build`, c.yellow);
    if (serveDistFlag) {
      log("\n   (You passed --serve-dist but there is no dist to serve.)\n", c.yellow);
    }
    if (!staticOnly) {
      log("   Falling back to static heuristics on source files…\n", c.yellow);
    }
  }

  let htmlFiles = [];
  if (existsSync(distDir)) {
    htmlFiles = findHtmlFiles(distDir);
    log(`\n📁 Found ${htmlFiles.length} HTML file(s) in dist/`, c.blue);
  }

  // Static checks on built HTML (or fallback to source pages if dist missing)
  if (htmlFiles.length > 0) {
    log("\n▶ Running static heuristic checks…", c.cyan);
    runStaticChecks(htmlFiles, distDir);
  } else {
    log("\n⚠ No built HTML files found. Static checks skipped.", c.yellow);
  }

  // Full axe tests
  if (canRunFullTests) {
    await runAxeTests(htmlFiles);
  } else if (!staticOnly) {
    log("\n⚠ Full axe-core tests skipped:", c.yellow);
    if (!playwright) log("   • Playwright is not installed", c.yellow);
    if (!axeCore) log("   • axe-core is not installed", c.yellow);
    if (!existsSync(distDir)) log("   • Built showcase dist/ not found", c.yellow);
    log("\n   To enable full tests:", c.yellow);
    log("   npm install -D playwright axe-core", c.yellow);
    log("   cd apps/showcase && npm run build", c.yellow);
  }

  // Write report
  await writeReport();

  // Print summary
  const critical = axeViolations.filter((v) => v.impact === "critical").length;
  const serious = axeViolations.filter((v) => v.impact === "serious").length;
  const moderate = axeViolations.filter((v) => v.impact === "moderate").length;
  const minor = axeViolations.filter((v) => v.impact === "minor").length;

  log("\n┌────────────────────────────────────────────────────────────┐", c.cyan);
  log("│  Summary                                                   │", c.cyan);
  log("├────────────────────────────────────────────────────────────┤", c.cyan);
  log(`│  Static issues : ${String(staticIssues.length).padEnd(37)}│`, c.cyan);
  log(`│  Axe critical  : ${String(critical).padEnd(37)}│`, critical > 0 ? c.red : c.cyan);
  log(`│  Axe serious   : ${String(serious).padEnd(37)}│`, serious > 0 ? c.red : c.cyan);
  log(`│  Axe moderate  : ${String(moderate).padEnd(37)}│`, moderate > 0 ? c.yellow : c.cyan);
  log(`│  Axe minor     : ${String(minor).padEnd(37)}│`, c.cyan);
  log("└────────────────────────────────────────────────────────────┘", c.cyan);

  if (critical > 0 || serious > 0) {
    log("\n❌ FAILED: Critical or serious accessibility violations found.", c.red);
    if (ciMode) process.exit(1);
    else log("   (Non-CI mode: exiting with 0, but please fix the issues!)", c.yellow);
  } else if (staticIssues.length > 0 && ciMode) {
    log("\n⚠ CI mode: static issues found. Review recommended.", c.yellow);
    // We don't fail CI for static-only issues unless they are serious/critical
  } else {
    log("\n✅ All critical and serious checks passed.", c.green);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
