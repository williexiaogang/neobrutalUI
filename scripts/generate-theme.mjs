#!/usr/bin/env node
/**
 * Neo-Brutal UI — Theme Generator (Stage 14)
 *
 * CLI tool that generates a complete Neo-Brutal UI theme from a primary color.
 *
 * Usage:
 *   node scripts/generate-theme.mjs \
 *     --primary="#ff6b6b" \
 *     --name="my-theme" \
 *     --strategy="analogous" \
 *     --dark \
 *     --output="./themes/my-theme.css"
 *
 * Supports: hex, oklch, rgb, hsl input formats.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import {
  parseColor,
  parseOKLCH,
  srgbToOKLCH,
  oklchToCSS,
  oklchToSRGB,
  mapToGamut,
  gamutMapWithLog,
  relativeLuminance,
  contrastRatio,
  passesAA,
  adjustForContrast,
  contentColorFor,
  contentColorMuted,
  deriveStateColors,
  colorDistance,
  distinguishability,
  shadowOffsetToPx,
  modHue,
  clamp01,
} from "./lib/color-math.mjs";

// ──────────────────────────────────────────────────────────────────────────────
// CLI argument parser
// ──────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {
    primary: null,
    baseBg: null,
    neutral: null,
    intensity: 0.85,
    borderContrast: 0.8,
    shadowOffset: "md",
    dark: false,
    colorSpace: "srgb",
    strategy: "analogous",
    output: null,
    name: "custom",
    help: false,
  };

  // Map stripped CLI keys to camelCase property names
  const keyMap = {
    basebg: "baseBg",
    bordercontrast: "borderContrast",
    shadowoffset: "shadowOffset",
    colorspace: "colorSpace",
  };

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      args.help = true;
      continue;
    }
    if (arg.startsWith("--")) {
      // Handle --key=value syntax
      const eqIndex = arg.indexOf("=");
      let key, value;
      if (eqIndex !== -1) {
        key = arg.slice(2, eqIndex).replace(/-/g, "");
        value = arg.slice(eqIndex + 1);
      } else {
        key = arg.replace(/^--/, "").replace(/-/g, "");
        const next = argv[i + 1];
        if (next && !next.startsWith("--")) {
          value = next;
          i++;
        } else {
          value = true;
        }
      }
      const mappedKey = keyMap[key] || key;
      args[mappedKey] = value;
    }
  }

  // Normalize types
  args.dark = args.dark === true || args.dark === "true";
  args.intensity = Number(args.intensity) || 0.85;
  args.borderContrast = Number(args.borderContrast) || 0.8;
  args.shadowOffset = String(args.shadowOffset).toLowerCase();
  args.colorSpace = String(args.colorSpace).toLowerCase();
  args.strategy = String(args.strategy).toLowerCase();
  args.name = String(args.name);

  if (args.output) {
    args.output = String(args.output);
  }

  return args;
}

function printHelp() {
  console.log(`
Neo-Brutal UI Theme Generator

Options:
  --primary <color>          Primary brand color (hex, oklch, rgb, hsl)
  --base-bg <color>          Page background color (optional)
  --neutral <hue|color>        Neutral gray hue (0-360) or color (optional)
  --intensity <0-1>            Chroma/saturation multiplier (default: 0.85)
  --border-contrast <0-1>      Border darkness/lightness (default: 0.8)
  --shadow-offset <size>       Shadow offset: xs, sm, md, lg, xl (default: md)
  --dark                       Also generate a dark variant
  --color-space <srgb|display-p3>  Target gamut (default: srgb)
  --strategy <name>            Color strategy: analogous, complementary,
                               split-complementary, triadic, manual (default: analogous)
  --output <path>              Path to output CSS file (default: stdout)
  --name <string>              Theme data-theme name (default: custom)
  --help                       Show this help

Examples:
  node scripts/generate-theme.mjs --primary="#3498db" --name="ocean" --strategy="analogous"
  node scripts/generate-theme.mjs --primary="#e74c3c" --name="cherry" --dark
  node scripts/generate-theme.mjs --primary="oklch(65% 0.2 250)" --output="themes/my-theme.css"
`);
}

// ──────────────────────────────────────────────────────────────────────────────
// Color parsing helpers
// ──────────────────────────────────────────────────────────────────────────────

function parseColorInput(input) {
  input = input.trim();

  if (input.startsWith("#")) {
    const rgb = parseColor(input);
    return srgbToOKLCH(...rgb);
  }

  if (input.startsWith("oklch(")) {
    return parseOKLCH(input);
  }

  if (input.startsWith("rgb") || input.startsWith("hsl")) {
    const rgb = parseColor(input);
    return srgbToOKLCH(...rgb);
  }

  // If it's a plain number, treat it as a hue angle (0-360)
  const num = Number(input);
  if (!isNaN(num) && num >= 0 && num <= 360) {
    return null; // signal: it's a hue, not a color
  }

  throw new Error(`Unsupported color format: ${input}`);
}

function resolveNeutralHue(input, primaryHue) {
  if (input === null || input === undefined) return 260;
  const num = Number(input);
  if (!isNaN(num) && num >= 0 && num <= 360) return num;
  // Parse as color and extract hue
  try {
    const lch = parseColorInput(input);
    if (lch === null) return Number(input);
    return lch[2];
  } catch {
    return 260;
  }
}

function resolveBaseBg(input, primaryLCH) {
  if (input) {
    try {
      return parseColorInput(input);
    } catch (e) {
      throw new Error(`Failed to parse --base-bg: ${e.message}`);
    }
  }
  // Default: derive from primary lightness
  const [pL, , pH] = primaryLCH;
  if (pL > 0.5) {
    return [0.98, 0.01, pH]; // light background
  }
  return [0.18, 0.03, 260]; // dark background (neutral hue)
}

// ──────────────────────────────────────────────────────────────────────────────
// Strategy helpers
// ──────────────────────────────────────────────────────────────────────────────

function computePalette(primaryLCH, strategy) {
  const [L, C, H] = primaryLCH;

  switch (strategy) {
    case "analogous":
      return {
        primary: [L, C, modHue(H)],
        secondary: [L, C * 0.8, modHue(H + 30)],
        accent: [L, C * 0.9, modHue(H + 60)],
      };
    case "complementary":
      return {
        primary: [L, C, modHue(H)],
        secondary: [L, C * 0.75, modHue(H + 180)],
        accent: [L, C * 0.85, modHue(H + 30)],
      };
    case "split-complementary":
      return {
        primary: [L, C, modHue(H)],
        secondary: [L, C * 0.75, modHue(H + 150)],
        accent: [L, C * 0.75, modHue(H + 60)],
      };
    case "triadic":
      return {
        primary: [L, C, modHue(H)],
        secondary: [L, C * 0.8, modHue(H + 120)],
        accent: [L, C * 0.8, modHue(H + 240)],
      };
    case "manual":
      // For manual, use primary for all or allow custom hues via future params
      return {
        primary: [L, C, modHue(H)],
        secondary: [L, C * 0.8, modHue(H + 30)],
        accent: [L, C * 0.85, modHue(H + 60)],
      };
    default:
      throw new Error(`Unknown color strategy: ${strategy}`);
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Theme builder
// ──────────────────────────────────────────────────────────────────────────────

function buildLightTheme(args) {
  const warnings = [];
  const gamutWarnings = [];
  const contrastAdjustments = [];
  const contrastRatios = {};

  // Parse primary
  let primaryLCH;
  try {
    const input = args.primary.trim().toLowerCase();
    if (input.startsWith("oklch(")) {
      primaryLCH = parseOKLCH(input);
    } else {
      const rgb = parseColor(input);
      primaryLCH = srgbToOKLCH(...rgb);
    }
  } catch (e) {
    throw new Error(`Failed to parse --primary: ${e.message}`);
  }

  // Gamut-map primary
  const primaryMapped = gamutMapWithLog(primaryLCH[0], primaryLCH[1], primaryLCH[2], args.colorSpace);
  if (primaryMapped.wasClamped) {
    gamutWarnings.push(`Primary color required gamut mapping (chroma reduced from ${primaryLCH[1].toFixed(3)} to ${primaryMapped.lch[1].toFixed(3)})`);
  }
  primaryLCH = primaryMapped.lch;

  // Base background
  const baseBgLCH = resolveBaseBg(args.baseBg, primaryLCH);

  // Neutral hue
  const neutralHue = resolveNeutralHue(args.neutral, primaryLCH[2]);

  // Palette (primary, secondary, accent)
  const palette = computePalette(primaryLCH, args.strategy);

  // Intensity multiplier
  const I = clamp01(args.intensity);

  // Helper to gamut-map, log, and apply intensity
  function mkColor(L, C, H, label) {
    const scaledC = C * I;
    const mapped = gamutMapWithLog(L, scaledC, H, args.colorSpace);
    if (mapped.wasClamped) {
      gamutWarnings.push(`${label} required gamut mapping (chroma reduced from ${scaledC.toFixed(3)} to ${mapped.lch[1].toFixed(3)})`);
    }
    return mapped.lch;
  }

  // Semantic colors
  const primary = mkColor(palette.primary[0], palette.primary[1], palette.primary[2], "Primary");
  const secondary = mkColor(palette.secondary[0], palette.secondary[1], palette.secondary[2], "Secondary");
  const accent = mkColor(palette.accent[0], palette.accent[1], palette.accent[2], "Accent");

  const info = mkColor(0.68, 0.18, 255, "Info");
  const success = mkColor(0.72, 0.20, 145, "Success");
  const warning = mkColor(0.80, 0.17, 75, "Warning");
  const error = mkColor(0.62, 0.22, 25, "Error");
  const neutral = mkColor(0.25, 0.03, neutralHue, "Neutral");

  // Base surface colors
  const isLightBase = baseBgLCH[0] > 0.5;
  const baseH = baseBgLCH[2];
  let base100, base200, base300;
  if (isLightBase) {
    base100 = [clamp01(baseBgLCH[0] + 0.02), 0.01, baseH];
    base200 = [clamp01(baseBgLCH[0] - 0.03), 0.02, baseH];
    base300 = [clamp01(baseBgLCH[0] - 0.08), 0.03, baseH];
  } else {
    base100 = [clamp01(baseBgLCH[0]), 0.03, baseH];
    base200 = [clamp01(baseBgLCH[0] + 0.07), 0.03, baseH];
    base300 = [clamp01(baseBgLCH[0] + 0.17), 0.03, baseH];
  }

  // Ensure bases are in gamut (they usually are, but check)
  base100 = mapToGamut(base100[0], base100[1], base100[2], args.colorSpace);
  base200 = mapToGamut(base200[0], base200[1], base200[2], args.colorSpace);
  base300 = mapToGamut(base300[0], base300[1], base300[2], args.colorSpace);

  // Content colors (auto-generated, then contrast-adjusted)
  function makeContent(bg, fg, label) {
    const initial = contentColorFor(bg);
    const ratio = contrastRatio(initial, bg);
    contrastRatios[label] = ratio;
    if (ratio < 4.5) {
      const adjusted = adjustForContrast(initial, bg, { targetRatio: 4.5 });
      const newRatio = contrastRatio(adjusted, bg);
      contrastAdjustments.push(
        `${label} contrast adjusted from ${ratio.toFixed(2)}:1 to ${newRatio.toFixed(2)}:1`
      );
      contrastRatios[label] = newRatio;
      return adjusted;
    }
    return initial;
  }

  function makeContentMuted(bg, label) {
    const initial = contentColorMuted(bg);
    const ratio = contrastRatio(initial, bg);
    contrastRatios[label] = ratio;
    if (ratio < 3.0) {
      const adjusted = adjustForContrast(initial, bg, { targetRatio: 3.0 });
      const newRatio = contrastRatio(adjusted, bg);
      contrastAdjustments.push(
        `${label} contrast adjusted from ${ratio.toFixed(2)}:1 to ${newRatio.toFixed(2)}:1`
      );
      contrastRatios[label] = newRatio;
      return adjusted;
    }
    return initial;
  }

  const primaryContent = makeContent(primary, contentColorFor(primary), "primary-content");
  const secondaryContent = makeContent(secondary, contentColorFor(secondary), "secondary-content");
  const accentContent = makeContent(accent, contentColorFor(accent), "accent-content");
  const neutralContent = makeContent(neutral, contentColorFor(neutral), "neutral-content");

  const baseContent = makeContent(base100, contentColorFor(base100), "base-content");
  const baseContentMuted = makeContentMuted(base100, "base-content-muted");

  const infoContent = makeContent(info, contentColorFor(info), "info-content");
  const successContent = makeContent(success, contentColorFor(success), "success-content");
  const warningContent = makeContent(warning, contentColorFor(warning), "warning-content");
  const errorContent = makeContent(error, contentColorFor(error), "error-content");

  // Border
  const borderL = 0.15 + (1 - clamp01(args.borderContrast)) * 0.35;
  const border = [borderL, 0.03, neutralHue];

  // Focus
  const focus = primary;

  // Overlay
  const overlay = [0.25, 0.03, neutralHue, 0.6];

  // State colors (hover / active)
  const primaryStates = deriveStateColors(primary, { intensity: I });
  const secondaryStates = deriveStateColors(secondary, { intensity: I });
  const accentStates = deriveStateColors(accent, { intensity: I });
  const infoStates = deriveStateColors(info, { intensity: I });
  const successStates = deriveStateColors(success, { intensity: I });
  const warningStates = deriveStateColors(warning, { intensity: I });
  const errorStates = deriveStateColors(error, { intensity: I });
  const neutralStates = deriveStateColors(neutral, { intensity: I });

  // Distinguishability checks for state colors
  const stateColors = [
    ["info", info],
    ["success", success],
    ["warning", warning],
    ["error", error],
  ];
  for (let i = 0; i < stateColors.length; i++) {
    for (let j = i + 1; j < stateColors.length; j++) {
      const [n1, c1] = stateColors[i];
      const [n2, c2] = stateColors[j];
      const dist = colorDistance(c1, c2);
      if (dist < 0.08) {
        warnings.push(`${n1} and ${n2} may be visually similar (distance ${dist.toFixed(3)})`);
      }
    }
  }

  // Also check primary vs secondary vs accent distinguishability
  if (colorDistance(primary, secondary) < 0.05) {
    warnings.push(`Primary and secondary may be visually similar`);
  }
  if (colorDistance(primary, accent) < 0.05) {
    warnings.push(`Primary and accent may be visually similar`);
  }
  if (colorDistance(secondary, accent) < 0.05) {
    warnings.push(`Secondary and accent may be visually similar`);
  }

  const theme = {
    base100,
    base200,
    base300,
    baseContent,
    baseContentMuted,
    neutral,
    neutralContent,
    primary,
    primaryContent,
    secondary,
    secondaryContent,
    accent,
    accentContent,
    info,
    infoContent,
    success,
    successContent,
    warning,
    warningContent,
    error,
    errorContent,
    border,
    focus,
    overlay,
    primaryHover: primaryStates.hover,
    primaryActive: primaryStates.active,
    secondaryHover: secondaryStates.hover,
    secondaryActive: secondaryStates.active,
    accentHover: accentStates.hover,
    accentActive: accentStates.active,
    infoHover: infoStates.hover,
    infoActive: infoStates.active,
    successHover: successStates.hover,
    successActive: successStates.active,
    warningHover: warningStates.hover,
    warningActive: warningStates.active,
    errorHover: errorStates.hover,
    errorActive: errorStates.active,
    neutralHover: neutralStates.hover,
    neutralActive: neutralStates.active,
  };

  warnings.push(...gamutWarnings);
  warnings.push(...contrastAdjustments);

  return { theme, palette, warnings, contrastRatios, gamutWarnings, contrastAdjustments };
}

// ──────────────────────────────────────────────────────────────────────────────
// Dark theme builder
// ──────────────────────────────────────────────────────────────────────────────

function buildDarkTheme(lightTheme, args) {
  const warnings = [];
  const contrastRatios = {};

  const neutralHue = lightTheme.border[2];

  // Darken a semantic color for dark mode (mild reduction, matching existing theme)
  function darkifySemantic(L) {
    if (L > 0.75) return Math.max(0.35, L - 0.13);
    if (L > 0.65) return Math.max(0.35, L - 0.10);
    if (L > 0.55) return Math.max(0.35, L - 0.07);
    if (L < 0.30) return Math.min(0.65, L + 0.08);
    return L;
  }

  const dark = {};
  for (const [key, value] of Object.entries(lightTheme)) {
    if (!Array.isArray(value)) {
      dark[key] = value;
      continue;
    }
    const [L, C, H, a] = value;

    if (key === "border") {
      const borderL = 0.85 - (1 - clamp01(args.borderContrast)) * 0.35;
      dark[key] = [borderL, C * 0.8, H, a];
    } else if (key === "overlay") {
      dark[key] = [0, 0, 0, 0.7];
    } else if (key.startsWith("base") && !key.includes("Content")) {
      // Base surface colors: dark neutral palette
      if (key === "base100") dark[key] = [0.18, 0.03, neutralHue, a];
      else if (key === "base200") dark[key] = [0.25, 0.03, neutralHue, a];
      else if (key === "base300") dark[key] = [0.35, 0.03, neutralHue, a];
      else dark[key] = [invertL(L), C * 0.8, neutralHue, a];
    } else if (key.startsWith("baseContent")) {
      // Recompute base content from dark base
      const base = dark.base100 || [0.18, 0.03, neutralHue];
      dark[key] = key.includes("Muted")
        ? contentColorMuted(base)
        : contentColorFor(base);
    } else if (key.endsWith("Content") && !key.includes("Hover") && !key.includes("Active")) {
      // Semantic content: recompute based on darkified semantic color
      const semanticKey = key.replace("Content", "");
      const semantic = dark[semanticKey] || [darkifySemantic(L), C, H, a];
      dark[key] = contentColorFor(semantic);
    } else if (key.endsWith("Hover") || key.endsWith("Active")) {
      // Recompute state colors from darkified semantic
      const semanticKey = key.replace(/Hover$/, "").replace(/Active$/, "");
      const semantic = dark[semanticKey] || [darkifySemantic(L), C, H, a];
      const states = deriveStateColors(semantic, { intensity: clamp01(args.intensity) });
      dark[key] = key.endsWith("Hover") ? states.hover : states.active;
    } else {
      // Semantic colors (primary, secondary, accent, info, success, warning, error, neutral, focus)
      dark[key] = [darkifySemantic(L), C, H, a];
    }
  }

  // Ensure all semantic colors are in gamut
  const semanticKeys = ["primary", "secondary", "accent", "info", "success", "warning", "error", "neutral", "focus"];
  for (const key of semanticKeys) {
    if (dark[key]) {
      dark[key] = mapToGamut(dark[key][0], dark[key][1], dark[key][2], args.colorSpace);
    }
  }

  // Re-check content contrasts in dark
  const pairs = [
    ["primary", "primaryContent"],
    ["secondary", "secondaryContent"],
    ["accent", "accentContent"],
    ["neutral", "neutralContent"],
    ["base100", "baseContent"],
    ["base100", "baseContentMuted"],
    ["info", "infoContent"],
    ["success", "successContent"],
    ["warning", "warningContent"],
    ["error", "errorContent"],
  ];

  for (const [bgKey, fgKey] of pairs) {
    const bg = dark[bgKey];
    const fg = dark[fgKey];
    if (!bg || !fg) continue;
    let ratio = contrastRatio(fg, bg);
    contrastRatios[fgKey] = ratio;
    const target = fgKey.includes("Muted") ? 3.0 : 4.5;
    if (ratio < target) {
      // Try stronger adjustment: larger step, more steps, and also try opposite polarity
      let adjusted = adjustForContrast(fg, bg, { targetRatio: target, maxSteps: 50 });
      let newRatio = contrastRatio(adjusted, bg);
      // If still failing, try the opposite color polarity
      if (newRatio < target) {
        const opposite = fg[0] > 0.5 ? [0.12, 0.03, bg[2]] : [0.98, 0.01, bg[2]];
        const oppRatio = contrastRatio(opposite, bg);
        if (oppRatio > newRatio) {
          adjusted = opposite;
          newRatio = oppRatio;
        }
      }
      dark[fgKey] = adjusted;
      contrastRatios[fgKey] = newRatio;
      if (newRatio < target) {
        warnings.push(`Dark ${fgKey} could not reach ${target}:1 (reached ${newRatio.toFixed(2)}:1)`);
      } else {
        warnings.push(`Dark ${fgKey} contrast adjusted from ${ratio.toFixed(2)}:1 to ${newRatio.toFixed(2)}:1`);
      }
    }
  }

  return { theme: dark, warnings, contrastRatios };
}

function invertL(L) {
  return Math.max(0, Math.min(1, 1.0 - L * 0.85));
}

// ──────────────────────────────────────────────────────────────────────────────
// Output formatting
// ──────────────────────────────────────────────────────────────────────────────

function renderCSS(theme, themeName, args) {
  const sh = shadowOffsetToPx(args.shadowOffset);

  const lines = [
    `/**`,
    ` * Neo-Brutal UI — Generated Theme: ${themeName}`,
    ` *`,
    ` * Strategy: ${args.strategy}`,
    ` * Intensity: ${args.intensity}`,
    ` * Color Space: ${args.colorSpace}`,
    ` * Generated by @neo-brutal-ui/theme-generator`,
    ` */`,
    ``,
    `@layer nb.theme {`,
    `  [data-theme="${themeName}"] {`,
    ``,
    `    /* Primitive colors */`,
    `    --nb-color-black: oklch(0% 0 0);`,
    `    --nb-color-white: oklch(100% 0 0);`,
    `    --nb-color-yellow-400: ${oklchToCSS(...theme.warning)};`,
    `    --nb-color-pink-400: ${oklchToCSS(...theme.primary)};`,
    `    --nb-color-blue-400: ${oklchToCSS(...theme.info)};`,
    `    --nb-color-green-400: ${oklchToCSS(...theme.success)};`,
    `    --nb-color-red-400: ${oklchToCSS(...theme.error)};`,
    `    --nb-color-orange-400: ${oklchToCSS(...theme.accent)};`,
    `    --nb-color-gray-100: ${oklchToCSS(0.96, 0.01, theme.neutral[2])};`,
    `    --nb-color-gray-200: ${oklchToCSS(0.90, 0.015, theme.neutral[2])};`,
    `    --nb-color-gray-800: ${oklchToCSS(0.30, 0.03, theme.neutral[2])};`,
    ``,
    `    /* Semantic colors */`,
  ];

  const tokenMap = [
    ["base-100", "base100"],
    ["base-200", "base200"],
    ["base-300", "base300"],
    ["base-content", "baseContent"],
    ["base-content-muted", "baseContentMuted"],
    ["neutral", "neutral"],
    ["neutral-content", "neutralContent"],
    ["primary", "primary"],
    ["primary-content", "primaryContent"],
    ["secondary", "secondary"],
    ["secondary-content", "secondaryContent"],
    ["accent", "accent"],
    ["accent-content", "accentContent"],
    ["info", "info"],
    ["info-content", "infoContent"],
    ["success", "success"],
    ["success-content", "successContent"],
    ["warning", "warning"],
    ["warning-content", "warningContent"],
    ["error", "error"],
    ["error-content", "errorContent"],
    ["border", "border"],
    ["focus", "focus"],
    ["overlay", "overlay"],
  ];

  for (const [cssName, jsKey] of tokenMap) {
    const val = theme[jsKey];
    if (!val) continue;
    const alpha = val.length === 4 ? val[3] : undefined;
    lines.push(`    --nb-${cssName}: ${oklchToCSS(val[0], val[1], val[2], alpha)};`);
  }

  // State tokens (hover / active)
  const stateMap = [
    ["primary-hover", "primaryHover"],
    ["primary-active", "primaryActive"],
    ["secondary-hover", "secondaryHover"],
    ["secondary-active", "secondaryActive"],
    ["accent-hover", "accentHover"],
    ["accent-active", "accentActive"],
    ["info-hover", "infoHover"],
    ["info-active", "infoActive"],
    ["success-hover", "successHover"],
    ["success-active", "successActive"],
    ["warning-hover", "warningHover"],
    ["warning-active", "warningActive"],
    ["error-hover", "errorHover"],
    ["error-active", "errorActive"],
    ["neutral-hover", "neutralHover"],
    ["neutral-active", "neutralActive"],
  ];

  lines.push(``, `    /* State colors */`);
  for (const [cssName, jsKey] of stateMap) {
    const val = theme[jsKey];
    if (!val) continue;
    lines.push(`    --nb-${cssName}: ${oklchToCSS(val[0], val[1], val[2])};`);
  }

  // Shadow tokens
  lines.push(
    ``,
    `    /* Shadows */`,
    `    --nb-shadow-xs: 1px 1px 0 var(--nb-border);`,
    `    --nb-shadow-sm: 2px 2px 0 var(--nb-border);`,
    `    --nb-shadow-md: ${sh}px ${sh}px 0 var(--nb-border);`,
    `    --nb-shadow-lg: ${sh + 2}px ${sh + 2}px 0 var(--nb-border);`,
    `    --nb-shadow-xl: ${sh + 4}px ${sh + 4}px 0 var(--nb-border);`,
    `  }`,
    `}`
  );

  return lines.join("\n") + "\n";
}

function renderJSON(lightTheme, darkTheme, palette, args, lightWarnings, darkWarnings, lightRatios, darkRatios) {
  const out = {
    name: args.name,
    strategy: args.strategy,
    intensity: args.intensity,
    borderContrast: args.borderContrast,
    shadowOffset: args.shadowOffset,
    colorSpace: args.colorSpace,
    darkVariant: args.dark,
    generatedAt: new Date().toISOString(),
    tokens: {},
    darkTokens: args.dark ? {} : undefined,
    palette: {
      primary: oklchToCSS(...palette.primary),
      secondary: oklchToCSS(...palette.secondary),
      accent: oklchToCSS(...palette.accent),
    },
    contrastRatios: {
      light: {},
      dark: args.dark ? {} : undefined,
    },
    warnings: {
      light: lightWarnings,
      dark: darkWarnings,
    },
  };

  const tokenMap = [
    ["base-100", "base100"],
    ["base-200", "base200"],
    ["base-300", "base300"],
    ["base-content", "baseContent"],
    ["base-content-muted", "baseContentMuted"],
    ["neutral", "neutral"],
    ["neutral-content", "neutralContent"],
    ["primary", "primary"],
    ["primary-content", "primaryContent"],
    ["secondary", "secondary"],
    ["secondary-content", "secondaryContent"],
    ["accent", "accent"],
    ["accent-content", "accentContent"],
    ["info", "info"],
    ["info-content", "infoContent"],
    ["success", "success"],
    ["success-content", "successContent"],
    ["warning", "warning"],
    ["warning-content", "warningContent"],
    ["error", "error"],
    ["error-content", "errorContent"],
    ["border", "border"],
    ["focus", "focus"],
    ["overlay", "overlay"],
    ["primary-hover", "primaryHover"],
    ["primary-active", "primaryActive"],
    ["secondary-hover", "secondaryHover"],
    ["secondary-active", "secondaryActive"],
    ["accent-hover", "accentHover"],
    ["accent-active", "accentActive"],
    ["info-hover", "infoHover"],
    ["info-active", "infoActive"],
    ["success-hover", "successHover"],
    ["success-active", "successActive"],
    ["warning-hover", "warningHover"],
    ["warning-active", "warningActive"],
    ["error-hover", "errorHover"],
    ["error-active", "errorActive"],
    ["neutral-hover", "neutralHover"],
    ["neutral-active", "neutralActive"],
  ];

  for (const [cssName, jsKey] of tokenMap) {
    const val = lightTheme[jsKey];
    if (!val) continue;
    const alpha = val.length === 4 ? val[3] : undefined;
    out.tokens[cssName] = oklchToCSS(val[0], val[1], val[2], alpha);

    if (args.dark && darkTheme) {
      const dval = darkTheme[jsKey];
      if (dval) {
        const dalpha = dval.length === 4 ? dval[3] : undefined;
        out.darkTokens[cssName] = oklchToCSS(dval[0], dval[1], dval[2], dalpha);
      }
    }
  }

  out.contrastRatios.light = lightRatios;
  if (args.dark && darkRatios) {
    out.contrastRatios.dark = darkRatios;
  }

  return JSON.stringify(out, null, 2);
}

// ──────────────────────────────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv);

  if (args.help || !args.primary) {
    printHelp();
    if (!args.primary && !args.help) {
      console.error("\n❌ Error: --primary is required.");
      process.exit(1);
    }
    process.exit(0);
  }

  console.log("🎨 Neo-Brutal UI Theme Generator");
  console.log(`   Primary: ${args.primary}`);
  console.log(`   Strategy: ${args.strategy}`);
  console.log(`   Intensity: ${args.intensity}`);
  console.log(`   Color Space: ${args.colorSpace}`);
  console.log(`   Dark variant: ${args.dark ? "yes" : "no"}`);
  console.log();

  // Build light theme
  const { theme, palette, warnings, contrastRatios, gamutWarnings, contrastAdjustments } = buildLightTheme(args);

  // Build dark theme
  let darkTheme, darkWarnings, darkRatios;
  if (args.dark) {
    const darkResult = buildDarkTheme(theme, args);
    darkTheme = darkResult.theme;
    darkWarnings = darkResult.warnings;
    darkRatios = darkResult.contrastRatios;
  }

  // Render outputs
  const lightCSS = renderCSS(theme, args.name, args);
  const darkCSS = args.dark ? renderCSS(darkTheme, `${args.name}-dark`, args) : null;
  const json = renderJSON(theme, darkTheme, palette, args, warnings, darkWarnings || [], contrastRatios, darkRatios);

  // Determine output paths
  let cssPath, jsonPath, darkCssPath;
  if (args.output) {
    cssPath = resolve(args.output);
    const base = cssPath.replace(/\.css$/i, "");
    jsonPath = base + ".json";
    if (args.dark) {
      darkCssPath = base + "-dark.css";
    }
  } else {
    // Default to stdout for CSS, but write JSON alongside
    cssPath = null;
    jsonPath = resolve(`themes/${args.name}.json`);
    if (args.dark) {
      darkCssPath = resolve(`themes/${args.name}-dark.css`);
    }
  }

  // Write files
  if (cssPath) {
    await mkdir(dirname(cssPath), { recursive: true });
    await writeFile(cssPath, lightCSS, "utf-8");
    console.log(`✅ Generated light theme: ${cssPath}`);
  } else {
    console.log("--- Light Theme CSS ---");
    console.log(lightCSS);
  }

  if (darkCssPath) {
    await mkdir(dirname(darkCssPath), { recursive: true });
    await writeFile(darkCssPath, darkCSS, "utf-8");
    console.log(`✅ Generated dark theme: ${darkCssPath}`);
  }

  if (jsonPath) {
    await mkdir(dirname(jsonPath), { recursive: true });
    await writeFile(jsonPath, json, "utf-8");
    console.log(`✅ Generated tokens JSON: ${jsonPath}`);
  }

  // Warnings summary
  if (gamutWarnings.length) {
    console.log();
    console.log("⚠️  Gamut mapping warnings:");
    for (const w of gamutWarnings) {
      console.log(`   • ${w}`);
    }
  }

  if (contrastAdjustments.length) {
    console.log();
    console.log("⚠️  Contrast auto-adjustments:");
    for (const w of contrastAdjustments) {
      console.log(`   • ${w}`);
    }
  }

  if (warnings.length > (gamutWarnings.length + contrastAdjustments.length)) {
    console.log();
    console.log("⚠️  Other warnings:");
    for (const w of warnings) {
      if (!gamutWarnings.includes(w) && !contrastAdjustments.includes(w)) {
        console.log(`   • ${w}`);
      }
    }
  }

  if (darkWarnings && darkWarnings.length) {
    console.log();
    console.log("⚠️  Dark theme warnings:");
    for (const w of darkWarnings) {
      console.log(`   • ${w}`);
    }
  }

  // Contrast audit summary
  const lightPairs = Object.entries(contrastRatios);
  const passedLight = lightPairs.filter(([, r]) => r >= 4.5).length;
  console.log();
  console.log(`📊 Light theme contrast: ${passedLight}/${lightPairs.length} pairs ≥ 4.5:1`);

  if (darkRatios) {
    const darkPairs = Object.entries(darkRatios);
    const passedDark = darkPairs.filter(([, r]) => r >= 4.5).length;
    console.log(`📊 Dark theme contrast:  ${passedDark}/${darkPairs.length} pairs ≥ 4.5:1`);
  }

  console.log();
  if (cssPath) {
    console.log("🎉 Done! Import the theme in your CSS:");
    console.log(`   @import url("${cssPath}");`);
    console.log(`   <body data-theme="${args.name}">`);
  } else {
    console.log("🎉 Done! Pipe the CSS above into your stylesheet.");
  }
}

main().catch((err) => {
  console.error("\n❌ Theme generation failed:", err.message);
  if (err.stack) {
    console.error(err.stack.split("\n").slice(0, 3).join("\n"));
  }
  process.exit(1);
});
