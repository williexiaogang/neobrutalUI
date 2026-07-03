import { readFile, writeFile, mkdir, stat, access } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { execSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");

/* ─────────────────────────── helpers ─────────────────────────── */

async function ensureDir(filePath) {
  await mkdir(dirname(filePath), { recursive: true });
}

async function writeFileSafe(filePath, content) {
  await ensureDir(filePath);
  await writeFile(filePath, content, "utf-8");
}

async function readFileSafe(filePath) {
  return readFile(filePath, "utf-8");
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function getPackageMeta(pkgPath) {
  try {
    const pkg = JSON.parse(await readFileSafe(resolve(pkgPath, "package.json")));
    return { name: pkg.name || "unknown", version: pkg.version || "0.0.0" };
  } catch {
    return { name: "unknown", version: "0.0.0" };
  }
}

function buildBanner(name, version) {
  const date = new Date().toISOString().split("T")[0];
  return `/*! ${name} v${version} | ${date} */\n`;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/* ─────────────────────────── validation ─────────────────────────── */

function hasHardcodedHex(content) {
  const regex = /#[0-9a-fA-F]{3,8}\b/;
  return regex.test(content);
}

function hasUnbalancedBrackets(content) {
  const stripped = content.replace(/\/\*[\s\S]*?\*\//g, "");
  const openCurly = (stripped.match(/\{/g) || []).length;
  const closeCurly = (stripped.match(/\}/g) || []).length;
  const openParen = (stripped.match(/\(/g) || []).length;
  const closeParen = (stripped.match(/\)/g) || []).length;
  return openCurly !== closeCurly || openParen !== closeParen;
}

/* ─────────────────────────── core ─────────────────────────── */

async function buildCore() {
  const pkgPath = resolve(root, "packages/core");
  const dist = resolve(pkgPath, "dist");
  const src = resolve(pkgPath, "src");
  const indexPath = resolve(src, "index.css");

  const { name, version } = await getPackageMeta(pkgPath);
  const banner = buildBanner(name, version);

  const indexContent = await readFileSafe(indexPath);

  // Parse @import paths from index.css
  const importRegex = /@import\s+(?:url\()?["']([^"']+)["']\)?\s*;?/g;
  const imports = [];
  let m;
  while ((m = importRegex.exec(indexContent)) !== null) {
    imports.push(m[1]);
  }

  // Group by CSS layer
  const layers = {
    "nb.theme": [],
    "nb.base": [],
    "nb.components": [],
    "nb.utilities": []
  };

  const layerMap = {
    tokens: "nb.theme",
    base: "nb.base",
    components: "nb.components",
    utilities: "nb.utilities"
  };

  for (const imp of imports) {
    const dir = imp.split("/")[1]; // e.g. "tokens" from "./tokens/colors.css"
    const layerName = layerMap[dir];
    if (!layerName) {
      throw new Error(`Unknown import directory in ${imp}`);
    }
    const filePath = resolve(src, imp);
    if (!(await fileExists(filePath))) {
      throw new Error(`Missing source file: ${filePath}`);
    }
    const content = await readFileSafe(filePath);
    layers[layerName].push(content);
  }

  // Build header: keep comments and @layer ordering, drop @import lines
  const headerLines = indexContent.split("\n").filter((line) => {
    const t = line.trim();
    return !t.startsWith("@import") && t !== "";
  });
  const header = headerLines.join("\n");

  const layerOrder = ["nb.theme", "nb.base", "nb.components", "nb.utilities"];

  const indexBody = layerOrder
    .map((layer) => layers[layer].join("\n\n"))
    .join("\n\n");

  const indexCss = banner + header + "\n\n" + indexBody + "\n";
  const tokensCss = banner + layers["nb.theme"].join("\n\n") + "\n";
  const baseCss = banner + layers["nb.base"].join("\n\n") + "\n";
  const componentsCss = banner + layers["nb.components"].join("\n\n") + "\n";
  const utilitiesCss = banner + layers["nb.utilities"].join("\n\n") + "\n";

  await writeFileSafe(resolve(dist, "index.css"), indexCss);
  await writeFileSafe(resolve(dist, "tokens.css"), tokensCss);
  await writeFileSafe(resolve(dist, "base.css"), baseCss);
  await writeFileSafe(resolve(dist, "components.css"), componentsCss);
  await writeFileSafe(resolve(dist, "utilities.css"), utilitiesCss);

  // Post-build validation
  console.log("\n📋 CSS Validation");
  const files = ["index.css", "tokens.css", "base.css", "components.css", "utilities.css"];
  let allValid = true;

  for (const file of files) {
    const fpath = resolve(dist, file);
    const content = await readFileSafe(fpath);
    const stats = await stat(fpath);

    const hex = hasHardcodedHex(content);
    const bad = hasUnbalancedBrackets(content);
    const ok = !hex && !bad;

    if (hex) {
      console.error(`  ❌ ${file}: hardcoded hex color found`);
      allValid = false;
    }
    if (bad) {
      console.error(`  ❌ ${file}: unbalanced brackets`);
      allValid = false;
    }

    console.log(`  ${ok ? "✅" : "⚠️"} ${file} — ${formatBytes(stats.size)}`);
  }

  if (!allValid) {
    console.error("  ⚠️ Some CSS files failed validation");
    process.exit(1);
  } else {
    console.log("  ✅ All CSS files passed validation");
  }
}

/* ─────────────────────────── interactions ─────────────────────────── */

function stripTypeAnnotations(code) {
  let result = code;
  // Remove function return types: foo(): never { -> foo() {
  result = result.replace(/function\s+(\w+)\s*\([^)]*\)\s*:\s*\w+\s*\{/g, (match) => {
    return match.replace(/:\s*\w+\s*\{/, " {");
  });
  return result;
}

function generateCJS(esmSource) {
  let code = esmSource.trim();
  const exports = [];
  const requires = [];

  // Remove export type { ... } from './module'
  code = code.replace(/export\s+type\s+\{[^}]*\}\s*from\s*['"][^'"]+['"]\s*;?/g, "");

  // export { a, b } from './module.js';
  code = code.replace(/export\s+\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]\s*;?/g, (match, names, modulePath) => {
    const cleanNames = names.split(",").map(s => s.trim()).filter(Boolean);
    const cjsModule = modulePath.replace(/\.js$/, "");
    requires.push(`const { ${cleanNames.join(", ")} } = require('${cjsModule}');`);
    exports.push(...cleanNames);
    return "";
  });

  // export function foo(
  code = code.replace(/export\s+function\s+(\w+)\s*\(/g, (_, name) => {
    exports.push(name);
    return `function ${name}(`;
  });

  // export const foo =
  code = code.replace(/export\s+const\s+(\w+)\s*=/g, (_, name) => {
    exports.push(name);
    return `const ${name} =`;
  });

  // export class Foo
  code = code.replace(/export\s+class\s+(\w+)\s*/g, (_, name) => {
    exports.push(name);
    return `class ${name} `;
  });

  // export { foo, bar } (without from)
  const namedMatch = code.match(/export\s+\{\s*([^}]+)\s*\}\s*;?/);
  if (namedMatch) {
    namedMatch[1].split(",").forEach((item) => {
      exports.push(item.trim());
    });
    code = code.replace(/export\s+\{\s*([^}]+)\s*\}\s*;?/, "");
  }

  // export default foo;
  const defaultMatch = code.match(/export\s+default\s+(\w+)\s*;?/);
  if (defaultMatch) {
    code = code.replace(/export\s+default\s+(\w+)\s*;?/, "");
    exports.push(`default: ${defaultMatch[1]}`);
  }

  // Strip TypeScript type annotations for preview builds
  code = stripTypeAnnotations(code);

  if (exports.length === 0 && requires.length === 0) {
    return `"use strict";\n\n${code}\n`;
  }

  const entries = exports.map((e) =>
    e.startsWith("default:") ? e : `${e}: ${e}`
  );

  let result = `"use strict";\n\n`;
  if (requires.length) {
    result += requires.join("\n") + "\n\n";
  }
  result += `${code}\n\nmodule.exports = {\n  ${entries.join(",\n  ")}\n};\n`;
  return result;
}

function generateDTS(sourceCode) {
  let dts = sourceCode;

  // export function foo(): never { ... } -> export declare function foo(): never;
  dts = dts.replace(
    /export\s+function\s+(\w+)\s*\(([\s\S]*?)\)\s*(?::\s*([^{]+))?\s*\{[\s\S]*?\n\}/g,
    (_, name, params, returnType) => {
      const cleanParams = params.replace(/\n\s+/g, " ").trim();
      const rt = returnType ? returnType.trim() : "any";
      return `export declare function ${name}(${cleanParams}): ${rt};`;
    }
  );

  // export { ... } from './module' -> export { ... };
  dts = dts.replace(/export\s+\{([^}]+)\}\s*from\s*['"][^'"]+['"]\s*;?/g, (_, names) => {
    return `export { ${names.trim()} };`;
  });

  // Keep export type { ... } as is
  // Remove any remaining runtime assignments
  dts = dts.replace(/\n\s*(const|let|var)\s+[\w\s,=]+;?/g, "");

  return dts;
}

async function buildInteractions() {
  const pkgPath = resolve(root, "packages/interactions");
  const dist = resolve(pkgPath, "dist");
  const src = resolve(pkgPath, "src");

  const tsConfigPath = resolve(pkgPath, "tsconfig.json");
  if (await fileExists(tsConfigPath)) {
    const tscCommands = ["pnpm exec tsc", "npx tsc"];
    let compiled = false;
    for (const cmd of tscCommands) {
      try {
        console.log(`  Trying ${cmd}...`);
        execSync(cmd, { cwd: pkgPath, stdio: "inherit" });
        compiled = true;
        break;
      } catch {
        // try next command
      }
    }
    if (!compiled) {
      throw new Error(
        "TypeScript compiler (tsc) not available. Install typescript or remove tsconfig.json to use fallback build."
      );
    }
    return;
  }

  // Fallback: simple copy logic (no tsconfig)
  let entry = resolve(src, "index.ts");
  if (!(await fileExists(entry))) {
    entry = resolve(src, "index.js");
    if (!(await fileExists(entry))) {
      throw new Error(
        "No entry file found (index.ts or index.js) in packages/interactions/src"
      );
    }
  }

  const sourceCode = await readFileSafe(entry);
  const isTs = entry.endsWith(".ts");

  // ESM: remove type-only exports for preview builds
  let esm = sourceCode;
  if (isTs) {
    esm = esm.replace(
      /export\s+type\s+\{[^}]*\}\s*from\s*['"][^'"]+['"]\s*;?/g,
      ""
    );
  }
  await writeFileSafe(resolve(dist, "index.js"), esm);

  // CJS
  const cjs = generateCJS(sourceCode);
  await writeFileSafe(resolve(dist, "index.cjs"), cjs);

  // Types
  const dts = generateDTS(sourceCode);
  await writeFileSafe(resolve(dist, "index.d.ts"), dts);

  console.log("  Generated ESM, CJS, and type definitions");
}

/* ─────────────────────────── theme ─────────────────────────── */

async function buildThemeNeoBrutal() {
  const pkgPath = resolve(root, "packages/themes/neo-brutal");
  const dist = resolve(pkgPath, "dist");
  const src = resolve(pkgPath, "src");

  const { name, version } = await getPackageMeta(pkgPath);
  const banner = buildBanner(name, version);

  const themePath = resolve(src, "theme.css");
  const content = await readFileSafe(themePath);

  await writeFileSafe(resolve(dist, "theme.css"), banner + content + "\n");
  await writeFileSafe(resolve(dist, "tokens.css"), banner + content + "\n");

  const s = await stat(resolve(dist, "theme.css"));
  console.log(`  ✅ theme.css — ${formatBytes(s.size)}`);
}

/* ─────────────────────────── dispatch ─────────────────────────── */

const target = process.argv[2];

if (!target) {
  console.error("Usage: node build-package.mjs <core|interactions|theme-neo-brutal>");
  process.exit(1);
}

switch (target) {
  case "core":
    console.log("🔨 Building @neo-brutal-ui/core...");
    await buildCore();
    break;
  case "interactions":
    console.log("🔨 Building @neo-brutal-ui/interactions...");
    await buildInteractions();
    break;
  case "theme-neo-brutal":
    console.log("🔨 Building @neo-brutal-ui/theme-neo-brutal...");
    await buildThemeNeoBrutal();
    break;
  default:
    console.error(`Unknown package build target: ${target}`);
    process.exit(1);
}
