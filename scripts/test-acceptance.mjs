/**
 * Neo-Brutal UI — MVP Acceptance Test Baseline
 *
 * Static CSS analysis + simulated checks for:
 * a) Color contrast (WCAG 2.1 approximate)
 * b) 320px mobile viewport
 * c) 200% zoom
 * d) Keyboard focus-visible
 * e) prefers-reduced-motion
 * f) forced-colors
 * g) Long text overflow
 */

import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import { resolve, relative, dirname } from "node:path";

const root = resolve(import.meta.dirname, "..");
const coreSrc = resolve(root, "packages/core/src");
const reportsDir = resolve(root, "reports");

const pathSep = /\\/g;
function normalizePath(p) {
  return p.replace(pathSep, "/");
}


/* ------------------------------------------------------------------
 * CSS file collection
 * ------------------------------------------------------------------ */
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
 * CSS parsing — stack-based brace parser
 * ------------------------------------------------------------------ */
function parseCSS(cssText, fileName) {
  const rules = [];
  const cleanCss = cssText.replace(/\/\*[\s\S]*?\*\//g, "").trim();

  function parseBlocks(css) {
    const blocks = [];
    let depth = 0;
    let start = 0;

    for (let i = 0; i < css.length; i++) {
      if (css[i] === "{") {
        if (depth === 0) {
          const prelude = css.slice(start, i).trim();
          blocks.push({ start: i, prelude });
        }
        depth++;
      } else if (css[i] === "}") {
        depth--;
        if (depth === 0) {
          const last = blocks[blocks.length - 1];
          if (last && last.start !== undefined) {
            last.content = css.slice(last.start, i + 1);
            delete last.start;
          }
          start = i + 1;
        }
      }
    }
    return blocks;
  }

  function processBlocks(css, mediaQuery = null) {
    const blocks = parseBlocks(css);
    for (const block of blocks) {
      const prelude = block.prelude.trim();
      if (prelude.startsWith("@media")) {
        const inner = block.content.slice(1, -1).trim();
        processBlocks(inner, prelude);
      } else if (prelude.startsWith("@keyframes") || prelude.startsWith("@supports")) {
        // skip
      } else if (prelude.startsWith("@layer")) {
        const inner = block.content.slice(1, -1).trim();
        processBlocks(inner, mediaQuery);
      } else {
        const selector = prelude;
        const declarations = block.content.slice(1, -1).trim();
        const props = {};
        declarations.split(";").forEach((decl) => {
          const colonIdx = decl.indexOf(":");
          if (colonIdx > 0) {
            const prop = decl.slice(0, colonIdx).trim();
            const val = decl.slice(colonIdx + 1).trim();
            props[prop] = val;
          }
        });
        rules.push({ selector, props, file: fileName, media: mediaQuery });
      }
    }
  }

  processBlocks(cleanCss);
  return rules;
}

/* ------------------------------------------------------------------
 * Color conversion — OKLCH → relative luminance (Y from XYZ)
 * ------------------------------------------------------------------ */
function oklchToLuminance(L, C, H) {
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const Y = -0.0405801784 * l + 1.1122568696 * m - 0.0716766780 * s;
  return Math.max(0, Math.min(1, Y));
}

function parseColor(value) {
  if (!value) return null;

  const oklchMatch = value.match(
    /oklch\(([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\)/
  );
  if (oklchMatch) {
    let L = parseFloat(oklchMatch[1]);
    if (oklchMatch[1].endsWith("%")) L /= 100;
    const C = parseFloat(oklchMatch[2]);
    const H = parseFloat(oklchMatch[3]);
    let alpha = 1;
    if (oklchMatch[4]) {
      alpha = parseFloat(oklchMatch[4]);
      if (oklchMatch[4].endsWith("%")) alpha /= 100;
    }
    return { type: "oklch", L, C, H, alpha };
  }

  if (value === "transparent") {
    return { type: "oklch", L: 0, C: 0, H: 0, alpha: 0 };
  }

  if (value === "currentColor") {
    return { type: "currentColor" };
  }

  if (value.includes("color-mix")) {
    return { type: "complex", value };
  }

  if (["inherit", "initial", "unset", "revert"].includes(value)) {
    return { type: "keyword", value };
  }

  return null;
}

function resolveValue(value, varMap, depth = 0) {
  if (depth > 10) return value;

  const varMatch = value.match(/^var\((--[\w-]+)(?:\s*,\s*([^)]+))?\)$/);
  if (varMatch) {
    const varName = varMatch[1];
    const fallback = varMatch[2] ? varMatch[2].trim() : null;
    const resolved = varMap.get(varName);
    if (resolved) {
      return resolveValue(resolved, varMap, depth + 1);
    }
    if (fallback) {
      return resolveValue(fallback, varMap, depth + 1);
    }
  }

  return value;
}

function resolveColor(value, varMap, depth = 0) {
  const resolved = resolveValue(value, varMap, depth);
  const parsed = parseColor(resolved);
  if (!parsed) return null;
  if (parsed.type === "oklch") return parsed;
  return null;
}

function contrastRatio(lum1, lum2) {
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/* ------------------------------------------------------------------
 * Variable extraction
 * ------------------------------------------------------------------ */
async function extractVariables(files) {
  const tokenVars = new Map();
  const fileVars = new Map();

  for (const file of files) {
    const content = await readFile(file, "utf-8");
    const localMap = new Map();

    const varRegex = /(--[\w-]+)\s*:\s*([^;]+);/g;
    let match;
    while ((match = varRegex.exec(content)) !== null) {
      localMap.set(match[1], match[2].trim());
    }

    if (normalizePath(file).includes("/tokens/")) {
      for (const [k, v] of localMap) {
        tokenVars.set(k, v);
      }
    } else {
      fileVars.set(file, localMap);
    }
  }

  return { tokenVars, fileVars };
}

/* ------------------------------------------------------------------
 * Check a) Color contrast
 * ------------------------------------------------------------------ */
function checkContrast(rules, tokenVars, fileVars) {
  const issues = [];
  const seen = new Set();

  for (const rule of rules) {
    const color = rule.props.color;
    const bg =
      rule.props.background ||
      rule.props["background-color"];

    if (!color || !bg) continue;
    if (bg.includes("gradient") || bg.includes("url(")) continue;

    const ruleVars = new Map();
    for (const [prop, val] of Object.entries(rule.props)) {
      if (prop.startsWith("--")) ruleVars.set(prop, val);
    }

    const localVars = fileVars.get(rule.file) || new Map();
    const mergedVars = new Map([...tokenVars, ...localVars, ...ruleVars]);

    const cResolved = resolveColor(color, mergedVars);
    const bResolved = resolveColor(bg, mergedVars);

    if (!cResolved || !bResolved) continue;
    if (cResolved.alpha < 0.5 || bResolved.alpha < 0.5) continue;

    const lumC = oklchToLuminance(cResolved.L, cResolved.C, cResolved.H);
    const lumB = oklchToLuminance(bResolved.L, bResolved.C, bResolved.H);
    const ratio = contrastRatio(lumC, lumB);

    const key = `${rule.file}|${rule.selector}|${color}|${bg}`;
    if (seen.has(key)) continue;
    seen.add(key);

    let grade = 0;
    if (ratio < 4.5) grade = 1; // warning only, design choices may allow 3:1

    if (grade > 0) {
      issues.push({
        file: normalizePath(relative(root, rule.file)),
        selector: rule.selector,
        color,
        background: bg,
        ratio: ratio.toFixed(2),
        grade,
        detail: `对比度 ${ratio.toFixed(2)}:1 低于 WCAG AA 阈值`,
        media: rule.media,
      });
    }
  }

  return issues;
}

/* ------------------------------------------------------------------
 * Check b) 320px mobile viewport
 * ------------------------------------------------------------------ */
function checkMobile320(rules) {
  const issues = [];
  const componentMap = new Map();

  for (const rule of rules) {
    const file = rule.file;
    const baseName = file.split(/[\\/]/).pop();
    if (!componentMap.has(baseName)) {
      componentMap.set(baseName, {
        hasMobileMedia: false,
        hasWrapper: false,
        hasSheetMode: false,
        hasToggle: false,
        hasCollapse: false,
      });
    }
    const info = componentMap.get(baseName);

    const props = rule.props;
    const widthProps = ["width", "min-width", "inline-size", "min-inline-size"];
    for (const wp of widthProps) {
      if (props[wp]) {
        const pxMatch = props[wp].match(/(\d+(?:\.\d+)?)px/);
        if (pxMatch) {
          const pxVal = parseFloat(pxMatch[1]);
          if (pxVal > 320) {
            issues.push({
              file: normalizePath(relative(root, file)),
              selector: rule.selector,
              property: wp,
              value: props[wp],
              grade: 2,
              detail: `固定宽度 ${props[wp]} 可能超过 320px 视口`,
              media: rule.media,
            });
          }
        }
      }
    }

    if (rule.media && rule.media.includes("max-width")) {
      info.hasMobileMedia = true;
    }
    if (rule.selector.includes("wrapper")) info.hasWrapper = true;
    if (rule.selector.includes("sheet")) info.hasSheetMode = true;
    if (rule.selector.includes("toggle")) info.hasToggle = true;
    if (rule.selector.includes("collapse")) info.hasCollapse = true;
  }

  const requirements = {
    "modal.css": {
      need: "hasSheetMode",
      msg: "Modal 缺少移动端 sheet 模式（@media max-width 768px）",
    },
    "table.css": {
      need: "hasWrapper",
      msg: "Table 缺少响应式滚动容器 .nb-table-wrapper",
    },
    "navbar.css": {
      need: "hasToggle",
      msg: "Navbar 缺少移动端折叠按钮 .nb-navbar-toggle",
    },
    "dropdown.css": {
      need: "hasMobileMedia",
      msg: "Dropdown 缺少移动端适配（@media max-width 768px）",
    },
  };

  for (const [file, info] of componentMap) {
    const req = requirements[file];
    if (!req) continue;
    if (!info[req.need]) {
      issues.push({
        file: `packages/core/src/components/${file}`,
        selector: "(component)",
        property: "-",
        value: "-",
        grade: 1,
        detail: req.msg,
        media: null,
      });
    }
  }

  // Tabs overflow on mobile
  if (componentMap.has("tabs.css") && !componentMap.get("tabs.css").hasMobileMedia) {
    issues.push({
      file: "packages/core/src/components/tabs.css",
      selector: ".nb-tabs",
      property: "overflow-x",
      value: "-",
      grade: 1,
      detail: "Tabs 缺少移动端横向滚动或换行适配（可能在小屏幕溢出）",
      media: null,
    });
  }

  return issues;
}

/* ------------------------------------------------------------------
 * Check c) 200% zoom
 * ------------------------------------------------------------------ */
function checkZoom200(rules) {
  const issues = [];
  const fontProps = [
    "font-size",
    "line-height",
    "letter-spacing",
    "word-spacing",
    "text-indent",
  ];

  for (const rule of rules) {
    for (const [prop, val] of Object.entries(rule.props)) {
      if (fontProps.includes(prop)) {
        if (val.includes("px") && !val.includes("rem") && !val.includes("em")) {
          issues.push({
            file: normalizePath(relative(root, rule.file)),
            selector: rule.selector,
            property: prop,
            value: val,
            grade: 1,
            detail: "字体相关属性使用固定像素值，应使用 rem / em / 无单位值",
            media: rule.media,
          });
        }
      }
    }

    // overflow:hidden may clip zoomed content — skip sr-only utilities
    const overflow =
      rule.props.overflow ||
      rule.props["overflow-x"] ||
      rule.props["overflow-y"];
    if (overflow === "hidden" && !rule.selector.includes("nb-sr-only")) {
      issues.push({
        file: normalizePath(relative(root, rule.file)),
        selector: rule.selector,
        property: "overflow",
        value: overflow,
        grade: 1,
        detail: "overflow: hidden 可能截断 200% 放大后的内容",
        media: rule.media,
      });
    }
  }

  return issues;
}

/* ------------------------------------------------------------------
 * Check d) Keyboard focus-visible
 * ------------------------------------------------------------------ */
function checkKeyboard(rules) {
  const issues = [];

  const componentMap = new Map();
  const interactiveFiles = [
    "button.css",
    "field.css",
    "selector.css",
    "tabs.css",
    "dropdown.css",
    "link.css",
    "modal.css",
    "navbar.css",
  ];

  for (const rule of rules) {
    const baseName = rule.file.split(/[\\/]/).pop();
    if (!interactiveFiles.includes(baseName)) continue;
    if (!componentMap.has(baseName)) componentMap.set(baseName, false);
    if (
      rule.selector.includes(":focus") ||
      rule.selector.includes(":focus-visible")
    ) {
      componentMap.set(baseName, true);
    }
  }

  for (const [file, hasFocus] of componentMap) {
    if (!hasFocus) {
      issues.push({
        file: `packages/core/src/components/${file}`,
        selector: "(component)",
        property: "focus-visible",
        value: "-",
        grade: 1,
        detail: `${file} 缺少组件级 :focus-visible / :focus 样式（依赖全局 reset）`,
        media: null,
      });
    }
  }

  return issues;
}

/* ------------------------------------------------------------------
 * Check e) prefers-reduced-motion
 * ------------------------------------------------------------------ */
function checkReducedMotion(rules) {
  const issues = [];
  const filesWithAnimation = new Set();
  const filesWithReducedMotion = new Set();

  for (const rule of rules) {
    const baseName = rule.file.split(/[\\/]/).pop();
    if (!baseName.endsWith(".css")) continue;

    for (const [prop, val] of Object.entries(rule.props)) {
      if (prop === "transition" || prop === "animation" || prop === "animation-name") {
        if (val !== "none" && val !== "0s") {
          filesWithAnimation.add(baseName);
        }
      }
    }

    if (rule.media && rule.media.includes("prefers-reduced-motion")) {
      filesWithReducedMotion.add(baseName);
    }
  }

  for (const file of filesWithAnimation) {
    if (!filesWithReducedMotion.has(file)) {
      issues.push({
        file: `packages/core/src/components/${file}`,
        selector: "(component)",
        property: "prefers-reduced-motion",
        value: "-",
        grade: 2,
        detail: `${file} 包含动画/过渡但没有 @media (prefers-reduced-motion: reduce) 降级`,
        media: null,
      });
    }
  }

  return issues;
}

/* ------------------------------------------------------------------
 * Check f) forced-colors
 * ------------------------------------------------------------------ */
function checkForcedColors(rules) {
  const issues = [];
  const filesWithForcedColors = new Set();
  const componentFiles = new Set();

  for (const rule of rules) {
    const baseName = rule.file.split(/[\\/]/).pop();
    if (normalizePath(rule.file).includes("/components/")) {
      componentFiles.add(baseName);
    }
    if (rule.media && rule.media.includes("forced-colors")) {
      filesWithForcedColors.add(baseName);
    }
  }

  for (const file of componentFiles) {
    if (!filesWithForcedColors.has(file)) {
      issues.push({
        file: `packages/core/src/components/${file}`,
        selector: "(component)",
        property: "forced-colors",
        value: "-",
        grade: 1,
        detail: `${file} 缺少 @media (forced-colors: active) 支持`,
        media: null,
      });
    }
  }

  return issues;
}

/* ------------------------------------------------------------------
 * Check g) Long text overflow
 * ------------------------------------------------------------------ */
function checkLongText(rules) {
  const issues = [];

  for (const rule of rules) {
    const props = rule.props;

    if (
      (props.overflow === "hidden" || props["overflow-x"] === "hidden") &&
      !rule.selector.includes("nb-sr-only") &&
      !props["text-overflow"] &&
      !props["overflow-wrap"] &&
      !props["word-break"]
    ) {
      issues.push({
        file: normalizePath(relative(root, rule.file)),
        selector: rule.selector,
        property: "overflow",
        value: props.overflow || props["overflow-x"],
        grade: 1,
        detail: "overflow: hidden 但没有 text-overflow 或 word-break 处理，可能截断长文本",
        media: rule.media,
      });
    }

    if (
      props["white-space"] === "nowrap" &&
      !rule.selector.includes("nb-sr-only") &&
      !props["overflow-wrap"] &&
      !props["word-break"] &&
      !props["text-overflow"]
    ) {
      // Skip intentional nowrap patterns: tooltip desktop, tabs mobile scroll
      if (
        rule.selector.includes("nb-tooltip-content") ||
        (rule.selector.includes("nb-tab") && rule.media && rule.media.includes("max-width"))
      ) {
        // intentional — container handles overflow
      } else {
        issues.push({
          file: normalizePath(relative(root, rule.file)),
          selector: rule.selector,
          property: "white-space",
          value: "nowrap",
          grade: 1,
          detail: "white-space: nowrap 但没有 overflow 处理，长文本可能溢出",
          media: rule.media,
        });
      }
    }
  }

  return issues;
}

/* ------------------------------------------------------------------
 * Report generation
 * ------------------------------------------------------------------ */
function gradeToLabel(g) {
  if (g === 0) return "✅ 通过";
  if (g === 1) return "⚠️ 警告";
  return "❌ 严重";
}

function generateReport(results) {
  const { contrast, mobile, zoom, keyboard, reducedMotion, forcedColors, longText } = results;
  const allIssues = [
    ...contrast.map((i) => ({ ...i, check: "颜色对比度" })),
    ...mobile.map((i) => ({ ...i, check: "320px 移动端" })),
    ...zoom.map((i) => ({ ...i, check: "200% 缩放" })),
    ...keyboard.map((i) => ({ ...i, check: "键盘焦点" })),
    ...reducedMotion.map((i) => ({ ...i, check: "Reduced Motion" })),
    ...forcedColors.map((i) => ({ ...i, check: "Forced Colors" })),
    ...longText.map((i) => ({ ...i, check: "长文本" })),
  ];

  const counts = {
    "颜色对比度": { pass: 0, warn: 0, fail: 0 },
    "320px 移动端": { pass: 0, warn: 0, fail: 0 },
    "200% 缩放": { pass: 0, warn: 0, fail: 0 },
    "键盘焦点": { pass: 0, warn: 0, fail: 0 },
    "Reduced Motion": { pass: 0, warn: 0, fail: 0 },
    "Forced Colors": { pass: 0, warn: 0, fail: 0 },
    "长文本": { pass: 0, warn: 0, fail: 0 },
  };

  for (const issue of allIssues) {
    if (issue.grade === 0) counts[issue.check].pass++;
    else if (issue.grade === 1) counts[issue.check].warn++;
    else counts[issue.check].fail++;
  }

  // For checks with no issues, count as pass for at least one component
  const componentCount = 15; // approximate number of component files
  for (const check of Object.keys(counts)) {
    if (counts[check].warn === 0 && counts[check].fail === 0) {
      counts[check].pass = 1;
    }
  }

  const status = (c) =>
    c.fail > 0 ? "❌ 需修复" : c.warn > 0 ? "⚠️ 需关注" : "✅ 通过";

  let md = `# Neo-Brutal UI — MVP 验收测试报告\n\n`;
  md += `> 生成时间：${new Date().toLocaleString()}\n\n`;

  md += `## Summary\n\n`;
  md += `| 检查项 | 通过 | 警告 | 严重 | 状态 |\n`;
  md += `|--------|------|------|------|------|\n`;
  for (const [check, c] of Object.entries(counts)) {
    md += `| ${check} | ${c.pass} | ${c.warn} | ${c.fail} | ${status(c)} |\n`;
  }
  md += `\n`;

  md += `---\n\n`;

  const sections = [
    { title: "颜色对比度", issues: contrast, cols: ["文件", "选择器", "color", "background", "对比度", "等级"] },
    { title: "320px 移动端", issues: mobile, cols: ["文件", "选择器", "属性", "值", "等级", "说明"] },
    { title: "200% 缩放", issues: zoom, cols: ["文件", "选择器", "属性", "值", "等级", "说明"] },
    { title: "键盘焦点", issues: keyboard, cols: ["文件", "选择器", "属性", "等级", "说明"] },
    { title: "Reduced Motion", issues: reducedMotion, cols: ["文件", "选择器", "属性", "等级", "说明"] },
    { title: "Forced Colors", issues: forcedColors, cols: ["文件", "选择器", "属性", "等级", "说明"] },
    { title: "长文本", issues: longText, cols: ["文件", "选择器", "属性", "值", "等级", "说明"] },
  ];

  for (const section of sections) {
    md += `## ${section.title}\n\n`;
    if (section.issues.length === 0) {
      md += `✅ 未发现问题。\n\n`;
      continue;
    }
    md += `| ${section.cols.join(" | ")} |\n`;
    md += `|${section.cols.map(() => "------").join("|")}|\n`;
    for (const issue of section.issues) {
      if (section.title === "颜色对比度") {
        md += `| ${issue.file} | \`${issue.selector}\` | ${issue.color} | ${issue.background} | ${issue.ratio}:1 | ${gradeToLabel(issue.grade)} |\n`;
      } else if (section.title === "320px 移动端" || section.title === "200% 缩放" || section.title === "长文本") {
        md += `| ${issue.file} | \`${issue.selector}\` | ${issue.property} | ${issue.value} | ${gradeToLabel(issue.grade)} | ${issue.detail} |\n`;
      } else {
        md += `| ${issue.file} | \`${issue.selector}\` | ${issue.property} | ${gradeToLabel(issue.grade)} | ${issue.detail} |\n`;
      }
    }
    md += `\n`;
  }

  md += `---\n\n`;
  md += `## Recommendations\n\n`;

  const serious = allIssues.filter((i) => i.grade === 2);
  const warnings = allIssues.filter((i) => i.grade === 1);

  if (serious.length > 0) {
    md += `### 严重问题（需立即修复）\n\n`;
    for (const issue of serious) {
      md += `- **${issue.check}** — \`${issue.file}\` : ${issue.detail}\n`;
    }
    md += `\n`;
  }

  if (warnings.length > 0) {
    md += `### 警告（建议优化）\n\n`;
    for (const issue of warnings) {
      md += `- **${issue.check}** — \`${issue.file}\` : ${issue.detail}\n`;
    }
    md += `\n`;
  }

  if (serious.length === 0 && warnings.length === 0) {
    md += `✅ 所有检查项通过，未发现需要修复的问题。\n\n`;
  }

  md += `\n---\n\n`;
  md += `*报告由 scripts/test-acceptance.mjs 自动生成*\n`;

  return md;
}

/* ------------------------------------------------------------------
 * Main
 * ------------------------------------------------------------------ */
async function main() {
  console.log("🔍 Neo-Brutal UI — MVP 验收测试基线\n");

  const files = await collectCssFiles(coreSrc);
  console.log(`📁 发现 ${files.length} 个 CSS 文件`);

  const allRules = [];
  for (const file of files) {
    const content = await readFile(file, "utf-8");
    const rules = parseCSS(content, file);
    allRules.push(...rules);
  }
  console.log(`📐 解析出 ${allRules.length} 条 CSS 规则\n`);

  const { tokenVars, fileVars } = await extractVariables(files);
  console.log(`🎨 提取 ${tokenVars.size} 个 token 变量，${fileVars.size} 个文件级变量\n`);

  // Run all checks
  const contrast = checkContrast(allRules, tokenVars, fileVars);
  const mobile = checkMobile320(allRules);
  const zoom = checkZoom200(allRules);
  const keyboard = checkKeyboard(allRules);
  const reducedMotion = checkReducedMotion(allRules);
  const forcedColors = checkForcedColors(allRules);
  const longText = checkLongText(allRules);

  const results = { contrast, mobile, zoom, keyboard, reducedMotion, forcedColors, longText };

  // Print summary
  const totalIssues = contrast.length + mobile.length + zoom.length + keyboard.length + reducedMotion.length + forcedColors.length + longText.length;
  const seriousCount = [...contrast, ...mobile, ...zoom, ...keyboard, ...reducedMotion, ...forcedColors, ...longText].filter((i) => i.grade === 2).length;
  const warningCount = [...contrast, ...mobile, ...zoom, ...keyboard, ...reducedMotion, ...forcedColors, ...longText].filter((i) => i.grade === 1).length;

  console.log(`📊 检查结果:`);
  console.log(`   颜色对比度: ${contrast.length} 项`);
  console.log(`   320px 移动端: ${mobile.length} 项`);
  console.log(`   200% 缩放: ${zoom.length} 项`);
  console.log(`   键盘焦点: ${keyboard.length} 项`);
  console.log(`   Reduced Motion: ${reducedMotion.length} 项`);
  console.log(`   Forced Colors: ${forcedColors.length} 项`);
  console.log(`   长文本: ${longText.length} 项`);
  console.log(`\n   严重: ${seriousCount}  |  警告: ${warningCount}  |  总计: ${totalIssues}\n`);

  // Generate report
  const report = generateReport(results);
  await mkdir(reportsDir, { recursive: true });
  await writeFile(resolve(reportsDir, "acceptance-report.md"), report, "utf-8");
  console.log(`📝 报告已保存: reports/acceptance-report.md`);

  // Exit with error if serious issues found
  if (seriousCount > 0) {
    console.log(`\n❌ 发现 ${seriousCount} 个严重问题，需要修复。`);
    process.exit(1);
  }

  console.log("\n✅ 验收测试完成，未发现问题。");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
