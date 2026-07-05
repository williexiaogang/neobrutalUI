/**
 * Theme Generator — Unit Tests
 *
 * Run with: node --test tests/theme-generator/*.test.mjs
 */

import { describe, it } from "node:test";
import assert from "node:assert";
import {
  hexToSRGB,
  srgbToOKLCH,
  oklchToSRGB,
  oklchToCSS,
  mapToGamut,
  generatePalette,
  contentColorFor,
} from "../../scripts/theme-generator/color-utils.mjs";
import { contrastRatio, passesAA, adjustForContrast } from "../../scripts/theme-generator/contrast.mjs";
import { validateSemanticTokens } from "../../scripts/theme-generator/schema.mjs";

// ────────────────────────────────────────────────────────────────────────────
// Color conversion round-trips
// ────────────────────────────────────────────────────────────────────────────

describe("hexToSRGB / srgbToOKLCH / oklchToSRGB", () => {
  it("round-trips a common red hex", () => {
    const rgb = hexToSRGB("#ff0000");
    assert.deepStrictEqual(rgb.map((c) => Math.round(c * 255)), [255, 0, 0]);
    const lch = srgbToOKLCH(...rgb);
    const back = oklchToSRGB(...lch);
    assert.ok(Math.abs(back[0] - rgb[0]) < 0.03);
    assert.ok(Math.abs(back[1] - rgb[1]) < 0.03);
    assert.ok(Math.abs(back[2] - rgb[2]) < 0.03);
    assert.ok(Math.abs(back[1] - rgb[1]) < 0.01);
    assert.ok(Math.abs(back[2] - rgb[2]) < 0.01);
  });

  it("round-trips a mid-gray", () => {
    const rgb = hexToSRGB("#808080");
    const lch = srgbToOKLCH(...rgb);
    const back = oklchToSRGB(...lch);
    assert.ok(Math.abs(back[0] - rgb[0]) < 0.03);
    assert.ok(Math.abs(back[1] - rgb[1]) < 0.03);
    assert.ok(Math.abs(back[2] - rgb[2]) < 0.03);
    assert.ok(Math.abs(back[1] - rgb[1]) < 0.01);
    assert.ok(Math.abs(back[2] - rgb[2]) < 0.01);
  });

  it("round-trips white", () => {
    const rgb = hexToSRGB("#ffffff");
    const lch = srgbToOKLCH(...rgb);
    const back = oklchToSRGB(...lch);
    assert.ok(Math.abs(back[0] - 1.0) < 0.03);
    assert.ok(Math.abs(back[1] - 1.0) < 0.01);
    assert.ok(Math.abs(back[2] - 1.0) < 0.01);
  });

  it("round-trips black", () => {
    const rgb = hexToSRGB("#000000");
    const lch = srgbToOKLCH(...rgb);
    const back = oklchToSRGB(...lch);
    assert.ok(Math.abs(back[0]) < 0.03);
    assert.ok(Math.abs(back[1]) < 0.01);
    assert.ok(Math.abs(back[2]) < 0.01);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Gamut mapping
// ────────────────────────────────────────────────────────────────────────────

describe("mapToGamut", () => {
  it("maps an out-of-gamut OKLCH color back into sRGB", () => {
    // Highly saturated color that may exceed sRGB
    const lch = [0.6, 0.5, 120];
    const mapped = mapToGamut(...lch);
    const rgb = oklchToSRGB(...mapped);
    assert.ok(rgb.every((c) => c >= 0 && c <= 1));
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Palette generation
// ────────────────────────────────────────────────────────────────────────────

describe("generatePalette", () => {
  it("generates analogous palette with correct hue offsets", () => {
    const primary = [0.65, 0.2, 350];
    const palette = generatePalette(primary, "analogous");
    assert.ok(palette.primary);
    assert.ok(palette.secondary);
    assert.ok(palette.accent);
    // Secondary should be shifted by ~30 degrees
    const secDiff = Math.abs(palette.secondary[2] - (350 - 30));
    assert.ok(secDiff < 1 || secDiff > 359, "secondary hue should be analogous");
  });

  it("generates complementary palette", () => {
    const primary = [0.65, 0.2, 350];
    const palette = generatePalette(primary, "complementary");
    const diff = Math.abs(palette.secondary[2] - ((350 + 180) % 360));
    assert.ok(diff < 1, "secondary should be complementary");
  });

  it("generates split-complementary palette", () => {
    const primary = [0.65, 0.2, 350];
    const palette = generatePalette(primary, "split-complementary");
    const diff1 = Math.abs(palette.secondary[2] - ((350 + 150) % 360));
    const diff2 = Math.abs(palette.accent[2] - ((350 + 210) % 360));
    assert.ok(diff1 < 1 || diff1 > 359, "secondary should be +150");
    assert.ok(diff2 < 1 || diff2 > 359, "accent should be +210");
  });

  it("generates triadic palette", () => {
    const primary = [0.65, 0.2, 350];
    const palette = generatePalette(primary, "triadic");
    const diff1 = Math.abs(palette.secondary[2] - ((350 + 120) % 360));
    const diff2 = Math.abs(palette.accent[2] - ((350 + 240) % 360));
    assert.ok(diff1 < 1 || diff1 > 359, "secondary should be +120");
    assert.ok(diff2 < 1 || diff2 > 359, "accent should be +240");
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Contrast
// ────────────────────────────────────────────────────────────────────────────

describe("contrastRatio", () => {
  it("returns 21 for black vs white", () => {
    const black = [0, 0, 0];
    const white = [1, 0, 0];
    const ratio = contrastRatio(black, white);
    assert.ok(Math.abs(ratio - 21) < 0.5, `expected ~21, got ${ratio}`);
  });

  it("returns 1 for identical colors", () => {
    const gray = [0.5, 0, 0];
    const ratio = contrastRatio(gray, gray);
    assert.ok(Math.abs(ratio - 1) < 0.01);
  });
});

describe("passesAA", () => {
  it("passes for black on white", () => {
    assert.strictEqual(passesAA([0, 0, 0], [1, 0, 0]), true);
  });

  it("fails for light-gray on white", () => {
    const lightGray = [0.85, 0, 0];
    const white = [1, 0, 0];
    assert.strictEqual(passesAA(lightGray, white), false);
  });
});

describe("adjustForContrast", () => {
  it("adjusts a low-contrast pair to meet AA", () => {
    const bg = [0.95, 0.01, 95]; // near-white
    const fg = [0.8, 0.01, 95]; // light gray
    const adjusted = adjustForContrast(fg, bg, { targetRatio: 4.5 });
    assert.ok(passesAA(adjusted, bg), `adjusted contrast should pass AA`);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Content color derivation
// ────────────────────────────────────────────────────────────────────────────

describe("contentColorFor", () => {
  it("returns dark text for light backgrounds", () => {
    const bg = [0.9, 0.01, 95];
    const fg = contentColorFor(bg);
    assert.ok(fg[0] < 0.5, "foreground should be dark");
  });

  it("returns light text for dark backgrounds", () => {
    const bg = [0.15, 0.03, 260];
    const fg = contentColorFor(bg);
    assert.ok(fg[0] > 0.5, "foreground should be light");
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Schema validation
// ────────────────────────────────────────────────────────────────────────────

describe("validateSemanticTokens", () => {
  it("passes for a complete theme", () => {
    const theme = {
      base100: [0.98, 0.01, 95],
      base200: [0.95, 0.02, 95],
      base300: [0.9, 0.03, 95],
      baseContent: [0.18, 0.05, 95],
      baseContentMuted: [0.45, 0.05, 95],
      neutral: [0.25, 0.03, 260],
      neutralContent: [0.98, 0.01, 260],
      primary: [0.65, 0.2, 350],
      primaryContent: [1, 0, 0],
      secondary: [0.75, 0.15, 255],
      secondaryContent: [0.15, 0.05, 255],
      accent: [0.88, 0.17, 95],
      accentContent: [0.18, 0.05, 95],
      info: [0.68, 0.18, 255],
      infoContent: [1, 0, 0],
      success: [0.72, 0.2, 145],
      successContent: [0.15, 0.05, 145],
      warning: [0.8, 0.17, 75],
      warningContent: [0.18, 0.05, 75],
      error: [0.62, 0.22, 25],
      errorContent: [1, 0, 0],
      border: [0.18, 0.05, 95],
      focus: [0.65, 0.2, 350],
      overlay: [0.25, 0.03, 260, 0.6],
    };
    const result = validateSemanticTokens(theme);
    assert.strictEqual(result.valid, true);
    assert.deepStrictEqual(result.missing, []);
  });

  it("fails when tokens are missing", () => {
    const theme = { base100: [0.98, 0.01, 95] };
    const result = validateSemanticTokens(theme);
    assert.strictEqual(result.valid, false);
    assert.ok(result.missing.length > 0);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// CSS output formatting
// ────────────────────────────────────────────────────────────────────────────

describe("oklchToCSS", () => {
  it("formats without alpha", () => {
    const css = oklchToCSS(0.65, 0.2, 350);
    assert.ok(css.startsWith("oklch("));
    assert.ok(!css.includes("/"));
  });

  it("formats with alpha", () => {
    const css = oklchToCSS(0.25, 0.03, 260, 0.6);
    assert.ok(css.includes("/ 0.6"));
  });
});
