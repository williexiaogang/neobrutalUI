/**
 * Theme Generator — Contrast & Accessibility Checks
 *
 * Provides WCAG 2.1 contrast-ratio evaluation and OKLCH-based
 * perceptual contrast estimation.
 */

import { oklchToSRGB } from "./color-utils.mjs";

// ────────────────────────────────────────────────────────────────────────────
// Relative luminance (sRGB)
// ────────────────────────────────────────────────────────────────────────────

function channelLum(c) {
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(rgb) {
  const [r, g, b] = rgb;
  return 0.2126 * channelLum(r) + 0.7152 * channelLum(g) + 0.0722 * channelLum(b);
}

/**
 * Compute WCAG 2.1 contrast ratio between two OKLCH colors.
 * Returns a value from 1 to 21.
 */
export function contrastRatio(lch1, lch2) {
  const lum1 = relativeLuminance(oklchToSRGB(...lch1));
  const lum2 = relativeLuminance(oklchToSRGB(...lch2));
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check whether a color pair meets WCAG AA (4.5:1 for normal text).
 */
export function passesAA(lchFg, lchBg, { largeText = false } = {}) {
  const threshold = largeText ? 3.0 : 4.5;
  return contrastRatio(lchFg, lchBg) >= threshold;
}

/**
 * Check whether a color pair meets WCAG AAA (7:1 for normal text).
 */
export function passesAAA(lchFg, lchBg, { largeText = false } = {}) {
  const threshold = largeText ? 4.5 : 7.0;
  return contrastRatio(lchFg, lchBg) >= threshold;
}

/**
 * Auto-adjust a foreground color until it passes AA against a background.
 * Modifies Lightness (and optionally Chroma) in steps.
 */
export function adjustForContrast(fgLCH, bgLCH, { targetRatio = 4.5, maxSteps = 20 } = {}) {
  let [L, C, H] = fgLCH;
  const bgL = bgLCH[0];
  const direction = bgL > 0.5 ? -1 : 1; // darker if bg is light, lighter if bg is dark

  for (let i = 0; i < maxSteps; i++) {
    const ratio = contrastRatio([L, C, H], bgLCH);
    if (ratio >= targetRatio) return [L, C, H];
    L = Math.max(0, Math.min(1, L + direction * 0.03));
  }
  return [L, C, H];
}

/**
 * Run a full accessibility report on a theme.
 *
 * Returns an object with:
 *   - passed: boolean
 *   - checks: array of { token1, token2, ratio, required, ok }
 *   - warnings: array of strings
 */
export function auditTheme(theme) {
  const checks = [];
  const warnings = [];

  function check(name1, lch1, name2, lch2, required = 4.5) {
    const ratio = contrastRatio(lch1, lch2);
    const ok = ratio >= required;
    checks.push({ token1: name1, token2: name2, ratio, required, ok });
    if (!ok) {
      warnings.push(
        `${name1} ↔ ${name2}: contrast ${ratio.toFixed(2)}:1 < ${required}:1`
      );
    }
  }

  // Semantic pairs
  check("primary-content", theme.primaryContent, "primary", theme.primary, 4.5);
  check("secondary-content", theme.secondaryContent, "secondary", theme.secondary, 4.5);
  check("accent-content", theme.accentContent, "accent", theme.accent, 4.5);
  check("neutral-content", theme.neutralContent, "neutral", theme.neutral, 4.5);
  check("base-content", theme.baseContent, "base-100", theme.base100, 4.5);
  check("base-content-muted", theme.baseContentMuted, "base-100", theme.base100, 3.0);

  // State colors
  check("info-content", theme.infoContent, "info", theme.info, 4.5);
  check("success-content", theme.successContent, "success", theme.success, 4.5);
  check("warning-content", theme.warningContent, "warning", theme.warning, 4.5);
  check("error-content", theme.errorContent, "error", theme.error, 4.5);

  // Distinguishability of state colors against base-100
  const statePairs = [
    ["info", theme.info],
    ["success", theme.success],
    ["warning", theme.warning],
    ["error", theme.error],
  ];
  for (let i = 0; i < statePairs.length; i++) {
    for (let j = i + 1; j < statePairs.length; j++) {
      const [n1, c1] = statePairs[i];
      const [n2, c2] = statePairs[j];
      const r = contrastRatio(c1, c2);
      checks.push({ token1: n1, token2: n2, ratio: r, required: 1.5, ok: r >= 1.5 });
      if (r < 1.5) {
        warnings.push(`${n1} ↔ ${n2}: state distinguishability ${r.toFixed(2)}:1 < 1.5:1`);
      }
    }
  }

  return {
    passed: warnings.length === 0,
    checks,
    warnings,
  };
}
