#!/usr/bin/env node
// ============================================================================
// Neo-Brutal UI — RTL CSS Checker
// ============================================================================
// Scans CSS files for physical direction properties (left, right, margin-left,
// margin-right, padding-left, padding-right, border-left, border-right,
// float: left/right, text-align: left/right, clear: left/right) that should be
// logical properties (inline-start, inline-end, etc.) for full RTL support.
//
// Usage:
//   node scripts/test-rtl.mjs
//   node scripts/test-rtl.mjs --fix-suggestions
//
// Exit codes:
//   0 = no physical direction properties found (pass)
//   1 = physical properties found (fail)
// ============================================================================

import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = resolve(__dirname, "..");
const cssDir = resolve(rootDir, "packages", "core", "src", "components");

const args = process.argv.slice(2);
const showSuggestions = args.includes("--fix-suggestions");
const ciMode = args.includes("--ci") || process.env.CI === "true";

// ── Colours ──
const c = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

function log(msg, colour = c.reset) {
  console.log(`${colour}${msg}${c.reset}`);
}

// ============================================================================
// Physical property patterns
// ============================================================================
const physicalPatterns = [
  {
    name: "left",
    regex: /(^\s*left\s*:)/gm,
    suggestion: "Use `inset-inline-start` or logical transform for positioning.",
  },
  {
    name: "right",
    regex: /(^\s*right\s*:)/gm,
    suggestion: "Use `inset-inline-end` or logical transform for positioning.",
  },
  {
    name: "margin-left",
    regex: /(^\s*margin-left\s*:)/gm,
    suggestion: "Use `margin-inline-start`.",
  },
  {
    name: "margin-right",
    regex: /(^\s*margin-right\s*:)/gm,
    suggestion: "Use `margin-inline-end`.",
  },
  {
    name: "padding-left",
    regex: /(^\s*padding-left\s*:)/gm,
    suggestion: "Use `padding-inline-start`.",
  },
  {
    name: "padding-right",
    regex: /(^\s*padding-right\s*:)/gm,
    suggestion: "Use `padding-inline-end`.",
  },
  {
    name: "border-left",
    regex: /(^\s*border-left\s*:)/gm,
    suggestion: "Use `border-inline-start` or `border-inline-start-width`/`border-inline-start-color`.",
  },
  {
    name: "border-right",
    regex: /(^\s*border-right\s*:)/gm,
    suggestion: "Use `border-inline-end` or `border-inline-end-width`/`border-inline-end-color`.",
  },
  {
    name: "float-left",
    regex: /(^\s*float\s*:\s*left\s*;)/gim,
    suggestion: "Avoid float for layout; use Flexbox or Grid. If unavoidable, wrap in RTL-aware container.",
  },
  {
    name: "float-right",
    regex: /(^\s*float\s*:\s*right\s*;)/gim,
    suggestion: "Avoid float for layout; use Flexbox or Grid. If unavoidable, wrap in RTL-aware container.",
  },
  {
    name: "text-align-left",
    regex: /(^\s*text-align\s*:\s*left\s*;)/gim,
    suggestion: "Use `text-align: start` or `text-align: match-parent`.",
  },
  {
    name: "text-align-right",
    regex: /(^\s*text-align\s*:\s*right\s*;)/gim,
    suggestion: "Use `text-align: end` or `text-align: match-parent`.",
  },
  {
    name: "clear-left",
    regex: /(^\s*clear\s*:\s*left\s*;)/gim,
    suggestion: "Avoid clear with physical directions; use flow-root or layout alternatives.",
  },
  {
    name: "clear-right",
    regex: /(^\s*clear\s*:\s*right\s*;)/gim,
    suggestion: "Avoid clear with physical directions; use flow-root or layout alternatives.",
  },
];

// Known exceptions: these are physical properties that are intentionally used
// and have been reviewed for RTL correctness. Each entry is { file, lineRegex }
const knownExceptions = [
  // Steps connector pseudo-elements use absolute positioning for a geometric
  // horizontal line. In RTL this line should still span from center to next
  // center; using left:50% is a common technique but should ideally be replaced
  // with inset-inline-start. We flag it but note it as a known exception.
  {
    file: "steps.css",
    pattern: /^\s*left\s*:/,
    note: "Steps connector pseudo-element uses physical left for center-based positioning. Consider `inset-inline-start: 50%` for full RTL correctness.",
  },
];

function isKnownException(fileName, lineText) {
  for (const exc of knownExceptions) {
    if (fileName === exc.file && exc.pattern.test(lineText)) {
      return exc.note;
    }
  }
  return null;
}

// ============================================================================
// Scan files
// ============================================================================
function findCssFiles(dir) {
  const results = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isFile() && entry.endsWith(".css")) {
      results.push(full);
    }
  }
  return results.sort();
}

function scanFile(filePath) {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const fileName = relative(cssDir, filePath).replace(/\\/g, "/");
  const findings = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    for (const pat of physicalPatterns) {
      if (pat.regex.test(line)) {
        // Reset regex lastIndex because we use global flag
        pat.regex.lastIndex = 0;

        const exceptionNote = isKnownException(fileName, line);
        findings.push({
          file: fileName,
          line: lineNum,
          text: line.trim(),
          property: pat.name,
          suggestion: pat.suggestion,
          knownException: exceptionNote,
        });
      }
      // Reset again to be safe
      pat.regex.lastIndex = 0;
    }
  }

  return findings;
}

// ============================================================================
// Main
// ============================================================================
function main() {
  log("╔══════════════════════════════════════════════════════════════╗", c.cyan);
  log("║   Neo-Brutal UI — RTL CSS Checker                            ║", c.cyan);
  log("╚══════════════════════════════════════════════════════════════╝", c.cyan);

  if (!existsSync(cssDir)) {
    log(`\n❌ CSS directory not found: ${cssDir}`, c.red);
    process.exit(2);
  }

  const files = findCssFiles(cssDir);
  log(`\n📁 Scanning ${files.length} CSS file(s) in packages/core/src/components/…`, c.blue);

  const allFindings = [];
  for (const file of files) {
    const findings = scanFile(file);
    allFindings.push(...findings);
  }

  const exceptions = allFindings.filter((f) => f.knownException);
  const violations = allFindings.filter((f) => !f.knownException);

  // Print findings
  if (allFindings.length === 0) {
    log("\n✅ No physical direction properties found. All components use logical properties.", c.green);
  } else {
    if (violations.length > 0) {
      log("\n❌ Violations (must be fixed):", c.red);
      for (const v of violations) {
        log(`\n  ${c.red}${v.file}:${v.line}${c.reset}  ${c.gray}${v.text}${c.reset}`);
        log(`    Property: ${c.yellow}${v.property}${c.reset}`);
        if (showSuggestions) {
          log(`    Suggestion: ${c.cyan}${v.suggestion}${c.reset}`);
        }
      }
    }

    if (exceptions.length > 0) {
      log("\n⚠ Known exceptions (reviewed but not ideal):", c.yellow);
      for (const e of exceptions) {
        log(`\n  ${c.yellow}${e.file}:${e.line}${c.reset}  ${c.gray}${e.text}${c.reset}`);
        log(`    Note: ${c.cyan}${e.knownException}${c.reset}`);
      }
    }
  }

  // Summary
  log("\n┌────────────────────────────────────────────────────────────┐", c.cyan);
  log("│  Summary                                                   │", c.cyan);
  log("├────────────────────────────────────────────────────────────┤", c.cyan);
  log(`│  Files scanned      : ${String(files.length).padEnd(27)}│`, c.cyan);
  log(`│  Violations         : ${String(violations.length).padEnd(27)}│`, violations.length > 0 ? c.red : c.cyan);
  log(`│  Known exceptions   : ${String(exceptions.length).padEnd(27)}│`, c.cyan);
  log("└────────────────────────────────────────────────────────────┘", c.cyan);

  if (violations.length > 0) {
    log("\n❌ FAILED: Physical direction properties found that should be logical.", c.red);
    if (showSuggestions) {
      log("   Run without --fix-suggestions to see a compact list.", c.gray);
    } else {
      log("   Run with --fix-suggestions to see replacement hints.", c.gray);
    }
    if (ciMode) process.exit(1);
    else log("   (Non-CI mode: exiting with 1 to signal the issue)", c.yellow);
    process.exit(1);
  }

  if (exceptions.length > 0) {
    log("\n⚠ Only known exceptions remain. Review them periodically.", c.yellow);
  }

  log("\n✅ All CSS files pass the RTL logical-property check.", c.green);
  process.exit(0);
}

main();
