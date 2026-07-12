#!/usr/bin/env node
/**
 * Generate concise skill component references from docs/components/api/*.md
 *
 * Output: skills/neo-brutal-ui/components/{slug}.md
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const apiDir = path.join(root, "docs", "components", "api");
const outDir = path.join(root, "skills", "neo-brutal-ui", "components");

const files = fs.readdirSync(apiDir).filter((f) => f.endsWith(".md"));

function slugify(filename) {
  return filename.replace(/\.md$/, "");
}

function extractComponentName(content) {
  const m = content.match(/^#\s+(.+?)\s+API$/m);
  return m ? m[1].trim() : "Component";
}

function extractBaseClass(content) {
  const m = content.match(/\*\*Base class\*\*:\s+`(.+?)`/);
  return m ? m[1].trim() : null;
}

function extractCategory(content) {
  const m = content.match(/\*\*Category\*\*:\s+(.+?)(?:\r?\n|\*\*)/);
  return m ? m[1].trim() : "UI";
}

function extractDescription(content) {
  // Try to pull the first sentence after "Class Names" table description column
  const tableMatch = content.match(/\| Class Name \| Category \| Description \|\s*\n[|:\-\s]+\n((?:\|.+\|\r?\n?)+)/);
  if (tableMatch) {
    const rows = tableMatch[1]
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    for (const row of rows) {
      const cells = row.split("|").map((c) => c.trim());
      if (cells.length >= 4) {
        const desc = cells[3];
        if (desc && desc !== "Description") return desc.replace(/\.$/, "");
      }
    }
  }
  return `${extractComponentName(content)} component`;
}

function cleanClassName(raw) {
  return raw
    .replace(/^`+|`+$/g, "") // remove surrounding backticks
    .replace(/^\./, ""); // remove leading dot
}

function extractClassRows(content) {
  const tableMatch = content.match(/\| Class Name \| Category \| Description \|\s*\n[|:\-\s]+\n((?:\|.+\|\r?\n?)+)/);
  if (!tableMatch) return [];

  return tableMatch[1]
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((row) => {
      const cells = row.split("|").map((c) => c.trim());
      if (cells.length < 4) return null;
      return {
        className: cleanClassName(cells[1]),
        category: cells[2],
        description: cells[3],
      };
    })
    .filter(Boolean);
}

function extractFirstHtmlExample(content) {
  const m = content.match(/```html\s*\n([\s\S]*?)\n```/);
  return m ? m[1].trim() : null;
}

function groupByCategory(rows) {
  const groups = {};
  for (const row of rows) {
    const cat = row.category.toLowerCase();
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(row.className);
  }
  return groups;
}

function generateSkillDoc(filename) {
  const content = fs.readFileSync(path.join(apiDir, filename), "utf8");
  const slug = slugify(filename);
  const name = extractComponentName(content);
  const baseClass = extractBaseClass(content);
  const category = extractCategory(content);
  const description = extractDescription(content);
  const rows = extractClassRows(content);
  const example = extractFirstHtmlExample(content);
  const groups = groupByCategory(rows);

  let md = `### ${slug}\n${description.replace(/\.$/, "")}.\n\n[${name} docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/${filename})\n\n`;

  md += `#### Class names\n`;
  if (baseClass) {
    md += `- component: \`${baseClass.replace(/^\./, "")}\`\n`;
  }

  const categoryLabels = {
    color: "color",
    variant: "style",
    size: "size",
    state: "behavior",
    layout: "modifier",
    placement: "placement",
    part: "part",
  };

  for (const [cat, classes] of Object.entries(groups)) {
    if (cat === "component") continue;
    const label = categoryLabels[cat] || cat;
    const unique = [...new Set(classes)];
    md += `- ${label}: ${unique.map((c) => `\`${c}\``).join(", ")}\n`;
  }

  md += `\n`;
  if (example) {
    md += `#### Syntax\n\n\`\`\`html\n${example}\n\`\`\`\n\n`;
  }

  md += `#### Rules\n- Always include the base class \`${baseClass ? baseClass.replace(/^\./, "") : `nb-${slug}`}\`.\n`;
  md += `- Modifiers are optional and can be combined when documented.\n`;
  md += `- Prefer native HTML states (disabled, checked, open) over custom state classes.\n`;

  return md;
}

fs.mkdirSync(outDir, { recursive: true });

for (const filename of files) {
  const doc = generateSkillDoc(filename);
  const slug = slugify(filename);
  fs.writeFileSync(path.join(outDir, `${slug}.md`), doc, "utf8");
}

console.log(`Generated ${files.length} component skill files in ${outDir}`);
