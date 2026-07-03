import { execSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

const packages = [
  { name: "core", script: "node scripts/build-package.mjs core" },
  {
    name: "interactions",
    script: "node scripts/build-package.mjs interactions"
  },
  {
    name: "theme-neo-brutal",
    script: "node scripts/build-package.mjs theme-neo-brutal"
  }
];

const results = [];

console.log("🏗️  Neo-Brutal UI — Build All\n");

for (const pkg of packages) {
  console.log(`\n🔨 Building ${pkg.name}...`);
  const start = Date.now();
  try {
    execSync(pkg.script, { cwd: root, stdio: "inherit" });
    results.push({
      name: pkg.name,
      status: "success",
      duration: Date.now() - start
    });
  } catch (error) {
    results.push({
      name: pkg.name,
      status: "failed",
      duration: Date.now() - start,
      error: error.message
    });
  }
}

const reportPath = resolve(root, "BUILD_REPORT.md");
const lines = [
  "# Neo-Brutal UI — Build Report",
  "",
  `**Date:** ${new Date().toISOString()}`,
  "",
  "| Package | Status | Duration |",
  "|---------|--------|----------|"
];

for (const r of results) {
  const icon = r.status === "success" ? "✅" : "❌";
  lines.push(`| ${r.name} | ${icon} ${r.status} | ${r.duration}ms |`);
}

lines.push("");

if (results.some((r) => r.status === "failed")) {
  lines.push("## Failures");
  for (const r of results) {
    if (r.status === "failed") {
      lines.push(`- **${r.name}**: ${r.error}`);
    }
  }
} else {
  lines.push("✅ All packages built successfully.");
}

await writeFile(reportPath, lines.join("\n"), "utf-8");
console.log(`\n📄 Build report written to ${reportPath}`);
