/**
 * Theme Generator — Color Utilities
 *
 * OKLCH <-> sRGB conversions, hue rotations, gamut mapping,
 * and color-theory palette generation.
 *
 * Based on Björn Ottosson’s OKLab / OKLCH specification.
 */

// ────────────────────────────────────────────────────────────────────────────
// Matrices (D65, exact rational approximations from the OKLab paper)
// ────────────────────────────────────────────────────────────────────────────

const XYZ_TO_LMS = [
  [0.8190224379967030, 0.3619062562552799, -0.1288737826755183],
  [0.0299830001400643, 0.4148227624703080, 0.2032568850774759],
  [-0.0481719818269724, 0.0447938925121633, 0.9638539909120231],
];

const LMS_TO_XYZ = [
  [1.2268798758459243, -0.5578142675475156, 0.2813910459042212],
  [-0.0405757452142238, 1.1122868047248344, -0.0717110580386548],
  [-0.0763729366806605, -0.4214933327573082, 1.5869240632042790],
];

const LMS_TO_LAB = [
  [0.2104542553, 0.7936177850, -0.0040720468],
  [1.9779984951, -2.4285922050, 0.4505937099],
  [0.0259040371, 0.7827717662, -0.8086757660],
];

const LAB_TO_LMS = [
  [1.0, 0.3963377773761749, 0.2158037573099136],
  [1.0, -0.1055613458156586, -0.0638541728258133],
  [1.0, -0.0894841775298119, -1.2914855480194092],
];

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

function multiplyMatrixVec(m, v) {
  return [
    m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
    m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
    m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2],
  ];
}

function cbrt(x) {
  return Math.cbrt ? Math.cbrt(x) : (x >= 0 ? Math.pow(x, 1 / 3) : -Math.pow(-x, 1 / 3));
}

function sRGBToLinear(c) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearToSRGB(c) {
  return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

function modHue(h) {
  let hh = h % 360;
  if (hh < 0) hh += 360;
  return hh;
}

// ────────────────────────────────────────────────────────────────────────────
// OKLCH <-> sRGB
// ────────────────────────────────────────────────────────────────────────────

/**
 * Convert OKLCH [L(0-1), C, H(deg)] to sRGB [r,g,b] in 0-1 range.
 */
export function oklchToSRGB(L, C, H) {
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  // Lab -> LMS
  const lms = multiplyMatrixVec(LAB_TO_LMS, [L, a, b]);

  // Linear LMS -> LMS (cube)
  const lmsC = [
    lms[0] ** 3,
    lms[1] ** 3,
    lms[2] ** 3,
  ];

  // LMS -> XYZ
  const xyz = multiplyMatrixVec(LMS_TO_XYZ, lmsC);

  // XYZ -> linear RGB
  const linRGB = multiplyMatrixVec(
    [
      [3.240969941904522, -1.537383177570093, -0.498610760293056],
      [-0.96924363628088, 1.875967501507721, 0.041555057407176],
      [0.055630079696993, -0.203976958888976, 1.056971514242878],
    ],
    xyz
  );

  return [
    linearToSRGB(clamp01(linRGB[0])),
    linearToSRGB(clamp01(linRGB[1])),
    linearToSRGB(clamp01(linRGB[2])),
  ];
}

/**
 * Convert sRGB [r,g,b] in 0-1 range to OKLCH [L(0-1), C, H(deg)].
 */
export function srgbToOKLCH(r, g, b) {
  // sRGB -> linear RGB
  const linR = sRGBToLinear(r);
  const linG = sRGBToLinear(g);
  const linB = sRGBToLinear(b);

  // linear RGB -> XYZ
  const xyz = multiplyMatrixVec(
    [
      [0.412390799265959, 0.357584339383878, 0.180480788401834],
      [0.21263900587151, 0.715168678767756, 0.072192315360734],
      [0.019330818715592, 0.11919477979462, 0.950532152249661],
    ],
    [linR, linG, linB]
  );

  // XYZ -> LMS (cube root)
  const lms = [
    cbrt(xyz[0]),
    cbrt(xyz[1]),
    cbrt(xyz[2]),
  ];

  // LMS -> OKLab
  const lab = multiplyMatrixVec(LMS_TO_LAB, lms);

  const L = lab[0];
  const C = Math.sqrt(lab[1] * lab[1] + lab[2] * lab[2]);
  let H = (Math.atan2(lab[2], lab[1]) * 180) / Math.PI;
  if (H < 0) H += 360;

  return [L, C, H];
}

/**
 * Parse a hex color string to sRGB [r,g,b] in 0-1.
 */
export function hexToSRGB(hex) {
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16) / 255;
    const g = parseInt(clean[1] + clean[1], 16) / 255;
    const b = parseInt(clean[2] + clean[2], 16) / 255;
    return [r, g, b];
  }
  if (clean.length === 6 || clean.length === 8) {
    const r = parseInt(clean.slice(0, 2), 16) / 255;
    const g = parseInt(clean.slice(2, 4), 16) / 255;
    const b = parseInt(clean.slice(4, 6), 16) / 255;
    return [r, g, b];
  }
  throw new Error(`Invalid hex color: ${hex}`);
}

/**
 * Convert sRGB [r,g,b] in 0-1 to hex string.
 */
export function srgbToHex(r, g, b) {
  const toHex = (c) => {
    const h = Math.round(clamp01(c) * 255).toString(16);
    return h.length === 1 ? "0" + h : h;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Format OKLCH as a CSS `oklch()` string.
 */
export function oklchToCSS(L, C, H, alpha) {
  if (alpha !== undefined) {
    return `oklch(${fmt(L * 100)}% ${fmt(C)} ${fmt(H)} / ${alpha})`;
  }
  return `oklch(${fmt(L * 100)}% ${fmt(C)} ${fmt(H)})`;
}

function fmt(n) {
  const s = n.toFixed(3);
  return s.replace(/\.?0+$/, "");
}

// ────────────────────────────────────────────────────────────────────────────
// Gamut mapping
// ────────────────────────────────────────────────────────────────────────────

/**
 * Map OKLCH color into sRGB gamut by reducing Chroma.
 * Returns [L, C, H] that is guaranteed in-gamut.
 */
export function mapToGamut(L, C, H) {
  let low = 0;
  let high = C;
  let best = [L, 0, H];

  for (let i = 0; i < 12; i++) {
    const mid = (low + high) / 2;
    const rgb = oklchToSRGB(L, mid, H);
    const inGamut = rgb.every((c) => c >= -0.0001 && c <= 1.0001);
    if (inGamut) {
      best = [L, mid, H];
      low = mid;
    } else {
      high = mid;
    }
  }
  return best;
}

// ────────────────────────────────────────────────────────────────────────────
// Color theory strategies
// ────────────────────────────────────────────────────────────────────────────

/** Generate a palette from a primary OKLCH color. */
export function generatePalette(primaryLCH, strategy, options = {}) {
  const [, , H] = primaryLCH;

  switch (strategy) {
    case "analogous":
      return analogousPalette(primaryLCH, options);
    case "complementary":
      return complementaryPalette(primaryLCH, options);
    case "split-complementary":
      return splitComplementaryPalette(primaryLCH, options);
    case "triadic":
      return triadicPalette(primaryLCH, options);
    case "manual":
      return manualPalette(primaryLCH, options);
    default:
      throw new Error(`Unknown color strategy: ${strategy}`);
  }
}

function analogousPalette([L, C, H], { angle = 30 } = {}) {
  return {
    primary: [L, C, modHue(H)],
    secondary: [L, C * 0.8, modHue(H - angle)],
    accent: [L, C * 0.9, modHue(H + angle)],
  };
}

function complementaryPalette([L, C, H], {}) {
  return {
    primary: [L, C, modHue(H)],
    secondary: [L, C * 0.75, modHue(H + 180)],
    accent: [L, C * 0.85, modHue(H + 30)],
  };
}

function splitComplementaryPalette([L, C, H], {}) {
  return {
    primary: [L, C, modHue(H)],
    secondary: [L, C * 0.75, modHue(H + 150)],
    accent: [L, C * 0.75, modHue(H + 210)],
  };
}

function triadicPalette([L, C, H], {}) {
  return {
    primary: [L, C, modHue(H)],
    secondary: [L, C * 0.8, modHue(H + 120)],
    accent: [L, C * 0.8, modHue(H + 240)],
  };
}

function manualPalette([L, C, H], { secondaryHue, accentHue } = {}) {
  if (secondaryHue == null || accentHue == null) {
    throw new Error('Manual strategy requires "secondaryHue" and "accentHue"');
  }
  return {
    primary: [L, C, modHue(H)],
    secondary: [L, C * 0.8, modHue(secondaryHue)],
    accent: [L, C * 0.85, modHue(accentHue)],
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Semantic color derivation
// ────────────────────────────────────────────────────────────────────────────

/**
 * Derive state colors (info, success, warning, error) from base palette.
 */
export function deriveStateColors(palette, options = {}) {
  const { infoHue = 255, successHue = 145, warningHue = 75, errorHue = 25 } = options;
  const L = palette.primary[0];
  const C = palette.primary[1];

  return {
    info: mapToGamut(L, C * 0.85, infoHue),
    success: mapToGamut(L, C * 0.9, successHue),
    warning: mapToGamut(L, C * 0.85, warningHue),
    error: mapToGamut(L, C * 0.9, errorHue),
  };
}

/**
 * Derive base surface colors from a background color.
 * bgLCH: OKLCH of the desired page background.
 */
export function deriveBaseColors(bgLCH, { intensity = "medium" } = {}) {
  const [L] = bgLCH;
  const step = intensity === "high" ? 0.06 : intensity === "low" ? 0.03 : 0.045;

  if (L >= 0.5) {
    // Light theme
    return {
      base100: [clamp01(L + step * 2), bgLCH[1] * 0.5, bgLCH[2]],
      base200: [clamp01(L + step), bgLCH[1] * 0.5, bgLCH[2]],
      base300: [clamp01(L), bgLCH[1] * 0.5, bgLCH[2]],
    };
  }
  // Dark theme
  return {
    base100: [clamp01(L), bgLCH[1] * 0.5, bgLCH[2]],
    base200: [clamp01(L + step), bgLCH[1] * 0.5, bgLCH[2]],
    base300: [clamp01(L + step * 2), bgLCH[1] * 0.5, bgLCH[2]],
  };
}

/**
 * Pick a readable content color for a given background.
 * Returns OKLCH for either black-ish or white-ish text.
 */
export function contentColorFor(bgLCH, { muted = false } = {}) {
  const [L] = bgLCH;
  if (L >= 0.55) {
    return muted ? [0.45, 0.05, bgLCH[2]] : [0.18, 0.05, bgLCH[2]];
  }
  return muted ? [0.65, 0.03, bgLCH[2]] : [0.98, 0.01, bgLCH[2]];
}

/**
 * Generate hover / active variants by shifting L and C.
 */
export function deriveInteractionStates(lch, { direction = "darker" } = {}) {
  const [L, C, H] = lch;
  const deltaL = direction === "darker" ? -0.06 : 0.06;
  return {
    hover: mapToGamut(clamp01(L + deltaL), C * 1.05, H),
    active: mapToGamut(clamp01(L - deltaL * 0.5), C * 0.95, H),
  };
}
