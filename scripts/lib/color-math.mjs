/**
 * Neo-Brutal UI — Color Math Library
 *
 * Self-contained OKLCH <-> sRGB conversion, gamut mapping, contrast
 * checking, and color-theory utilities. No external dependencies.
 *
 * Based on Björn Ottosson's OKLab / OKLCH specification.
 * https://bottosson.github.io/posts/oklab/
 */

// ────────────────────────────────────────────────────────────────────────────
// Matrices (D65, from the OKLab paper)
// ────────────────────────────────────────────────────────────────────────────

const XYZ_TO_LMS_LINEAR = [
  [0.8189330101, 0.3618667424, -0.1288597137],
  [0.0329845436, 0.9293118715, 0.0361456387],
  [0.0482003018, 0.2643662691, 0.6338517070],
];

const LMS_LINEAR_TO_XYZ = [
  [1.227013851, -0.557799289, 0.281256149],
  [-0.040580178, 1.112256869, -0.071676678],
  [-0.076381285, -0.421481978, 1.586163220],
];

const LMS_TO_OKLAB = [
  [0.2104542553, 0.7936177850, -0.0040720468],
  [1.9779984951, -2.4285922050, 0.4505937099],
  [0.0259040371, 0.7827717662, -0.8086757660],
];

const OKLAB_TO_LMS = [
  [1.0, 0.3963377774, 0.2158037573],
  [1.0, -0.1055613458, -0.0638541728],
  [1.0, -0.0894841775, -1.2914855480],
];

const SRGB_LINEAR_TO_XYZ = [
  [0.4123907993, 0.3575843394, 0.1804807884],
  [0.2126390059, 0.7151686788, 0.0721923154],
  [0.0193308187, 0.1191947798, 0.9505321523],
];

const XYZ_TO_SRGB_LINEAR = [
  [3.2409699419, -1.5373831776, -0.4986107603],
  [-0.9692436363, 1.8759675015, 0.0415550574],
  [0.0556300797, -0.2039769589, 1.0569715142],
];

// Display-P3 to/from XYZ (D65)
const DISPLAY_P3_LINEAR_TO_XYZ = [
  [0.4865709486, 0.2656676932, 0.1982172853],
  [0.2289745641, 0.6917385211, 0.0792869148],
  [0.0000000000, 0.0451133819, 1.0439443689],
];

const XYZ_TO_DISPLAY_P3_LINEAR = [
  [2.4934969119, -0.9313836179, -0.4027107845],
  [-0.8294891896, 1.7626640603, 0.0236246858],
  [0.0358458302, -0.0761723893, 0.9568845240],
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
// sRGB <-> OKLCH
// ────────────────────────────────────────────────────────────────────────────

/**
 * Convert sRGB [r,g,b] in 0-1 range to OKLCH [L(0-1), C, H(deg)].
 */
export function srgbToOKLCH(r, g, b) {
  const linR = sRGBToLinear(r);
  const linG = sRGBToLinear(g);
  const linB = sRGBToLinear(b);

  const xyz = multiplyMatrixVec(SRGB_LINEAR_TO_XYZ, [linR, linG, linB]);
  const lmsLinear = multiplyMatrixVec(XYZ_TO_LMS_LINEAR, xyz);
  const lms = [cbrt(lmsLinear[0]), cbrt(lmsLinear[1]), cbrt(lmsLinear[2])];
  const lab = multiplyMatrixVec(LMS_TO_OKLAB, lms);

  const L = lab[0];
  const C = Math.sqrt(lab[1] * lab[1] + lab[2] * lab[2]);
  let H = (Math.atan2(lab[2], lab[1]) * 180) / Math.PI;
  if (H < 0) H += 360;

  return [L, C, H];
}

/**
 * Convert OKLCH [L(0-1), C, H(deg)] to sRGB [r,g,b] in 0-1 range.
 */
export function oklchToSRGB(L, C, H) {
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  const lms = multiplyMatrixVec(OKLAB_TO_LMS, [L, a, b]);
  const lmsLinear = [lms[0] ** 3, lms[1] ** 3, lms[2] ** 3];
  const xyz = multiplyMatrixVec(LMS_LINEAR_TO_XYZ, lmsLinear);
  const linRGB = multiplyMatrixVec(XYZ_TO_SRGB_LINEAR, xyz);

  return [
    clamp01(linearToSRGB(clamp01(linRGB[0]))),
    clamp01(linearToSRGB(clamp01(linRGB[1]))),
    clamp01(linearToSRGB(clamp01(linRGB[2]))),
  ];
}

/**
 * Convert OKLCH to linear Display-P3 [r,g,b] in 0-1 range (for gamut checking).
 */
function oklchToLinearDisplayP3(L, C, H) {
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  const lms = multiplyMatrixVec(OKLAB_TO_LMS, [L, a, b]);
  const lmsLinear = [lms[0] ** 3, lms[1] ** 3, lms[2] ** 3];
  const xyz = multiplyMatrixVec(LMS_LINEAR_TO_XYZ, lmsLinear);
  const linP3 = multiplyMatrixVec(XYZ_TO_DISPLAY_P3_LINEAR, xyz);

  return [linP3[0], linP3[1], linP3[2]];
}

// ────────────────────────────────────────────────────────────────────────────
// Formatting
// ────────────────────────────────────────────────────────────────────────────

export function oklchToCSS(L, C, H, alpha) {
  const lStr = `${fmt(L * 100)}%`;
  const cStr = fmt(C);
  const hStr = fmt(H);
  if (alpha !== undefined) {
    return `oklch(${lStr} ${cStr} ${hStr} / ${alpha})`;
  }
  return `oklch(${lStr} ${cStr} ${hStr})`;
}

function fmt(n) {
  const s = n.toFixed(3);
  return s.replace(/\.?0+$/, "");
}

// ────────────────────────────────────────────────────────────────────────────
// Color parsing
// ────────────────────────────────────────────────────────────────────────────

export function parseColor(input) {
  input = input.trim().toLowerCase();

  if (input.startsWith("#")) {
    return hexToSRGB(input);
  }

  if (input.startsWith("oklch(")) {
    return parseOKLCH(input);
  }

  if (input.startsWith("rgb")) {
    return parseRGB(input);
  }

  if (input.startsWith("hsl")) {
    return parseHSL(input);
  }

  throw new Error(`Unsupported color format: ${input}`);
}

export function parseOKLCH(input) {
  const match = input.match(/oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)\s*\)/);
  if (!match) throw new Error(`Invalid oklch() syntax: ${input}`);
  const L = match[1].endsWith("%") ? parseFloat(match[1]) / 100 : parseFloat(match[1]);
  const C = parseFloat(match[2]);
  const H = parseFloat(match[3]);
  return [L, C, H];
}

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

export function srgbToHex(r, g, b) {
  const toHex = (c) => {
    const h = Math.round(clamp01(c) * 255).toString(16);
    return h.length === 1 ? "0" + h : h;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function parseRGB(input) {
  const match = input.match(/rgba?\(\s*([\d.]+%?)\s*[ ,/]\s*([\d.]+%?)\s*[ ,/]\s*([\d.]+%?)\s*\)/);
  if (!match) throw new Error(`Invalid rgb() syntax: ${input}`);
  const parse = (v) => (v.endsWith("%") ? parseFloat(v) / 100 : parseFloat(v) / 255);
  return [parse(match[1]), parse(match[2]), parse(match[3])];
}

export function parseHSL(input) {
  const match = input.match(/hsla?\(\s*([\d.]+)\s*[ ,/]\s*([\d.]+%?)\s*[ ,/]\s*([\d.]+%?)\s*\)/);
  if (!match) throw new Error(`Invalid hsl() syntax: ${input}`);
  const h = parseFloat(match[1]);
  const s = parseFloat(match[2]) / 100;
  const l = parseFloat(match[3]) / 100;
  return hslToSRGB(h, s, l);
}

export function hslToSRGB(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r, g, b;

  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  return [r + m, g + m, b + m];
}

// ────────────────────────────────────────────────────────────────────────────
// Gamut mapping
// ────────────────────────────────────────────────────────────────────────────

export function mapToGamut(L, C, H, colorSpace = "srgb") {
  let low = 0;
  let high = C;
  let best = [L, 0, H];

  const inGamut = (rgb) => rgb.every((c) => c >= -0.0001 && c <= 1.0001);
  const toRGB =
    colorSpace === "display-p3"
      ? (l, c, h) => oklchToLinearDisplayP3(l, c, h)
      : (l, c, h) => oklchToSRGB(l, c, h);

  for (let i = 0; i < 16; i++) {
    const mid = (low + high) / 2;
    const rgb = toRGB(L, mid, H);
    if (inGamut(rgb)) {
      best = [L, mid, H];
      low = mid;
    } else {
      high = mid;
    }
  }
  return best;
}

export function gamutMapWithLog(L, C, H, colorSpace = "srgb") {
  const mapped = mapToGamut(L, C, H, colorSpace);
  const wasClamped = Math.abs(mapped[1] - C) > 0.001;
  return { lch: mapped, wasClamped };
}

// ────────────────────────────────────────────────────────────────────────────
// Contrast & luminance
// ────────────────────────────────────────────────────────────────────────────

function channelLum(c) {
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(rgb) {
  const [r, g, b] = rgb;
  return 0.2126 * channelLum(r) + 0.7152 * channelLum(g) + 0.0722 * channelLum(b);
}

export function contrastRatio(lch1, lch2) {
  const lum1 = relativeLuminance(oklchToSRGB(...lch1));
  const lum2 = relativeLuminance(oklchToSRGB(...lch2));
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function passesAA(lchFg, lchBg, { largeText = false } = {}) {
  const threshold = largeText ? 3.0 : 4.5;
  return contrastRatio(lchFg, lchBg) >= threshold;
}

export function passesAAA(lchFg, lchBg, { largeText = false } = {}) {
  const threshold = largeText ? 4.5 : 7.0;
  return contrastRatio(lchFg, lchBg) >= threshold;
}

export function adjustForContrast(fgLCH, bgLCH, { targetRatio = 4.5, maxSteps = 50 } = {}) {
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

// ────────────────────────────────────────────────────────────────────────────
// Content & state colors
// ────────────────────────────────────────────────────────────────────────────

export function contentColorFor(bgLCH) {
  const [L, , H] = bgLCH;
  if (L > 0.68) {
    return [0.15, 0.05, H]; // dark text
  }
  return [0.98, 0.01, H]; // light text
}

export function contentColorMuted(bgLCH) {
  const [L, , H] = bgLCH;
  if (L > 0.68) {
    return [0.45, 0.05, H];
  }
  return [0.65, 0.03, H];
}

export function deriveStateColors(lch, { intensity = 0.85 } = {}) {
  const [L, C, H] = lch;
  const direction = L > 0.5 ? -1 : 1;

  const hoverL = clamp01(L + direction * 0.05);
  const hoverC = C * 1.10 * intensity;
  const activeL = clamp01(L + direction * 0.10);
  const activeC = C * 0.85 * intensity;

  return {
    hover: [hoverL, hoverC, H],
    active: [activeL, activeC, H],
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Color distance
// ────────────────────────────────────────────────────────────────────────────

export function colorDistance(lch1, lch2) {
  const dL = lch1[0] - lch2[0];
  const dC = lch1[1] - lch2[1];
  let dH = lch1[2] - lch2[2];
  if (dH > 180) dH -= 360;
  if (dH < -180) dH += 360;
  return Math.sqrt(dL * dL + dC * dC + (dH / 360) * (dH / 360));
}

export function distinguishability(lch1, lch2) {
  return contrastRatio(lch1, lch2);
}

// ────────────────────────────────────────────────────────────────────────────
// Shadow offset mapping
// ────────────────────────────────────────────────────────────────────────────

export function shadowOffsetToPx(offset) {
  const map = { xs: 1, sm: 2, md: 4, lg: 6, xl: 8 };
  return map[offset] || map.md;
}

export { modHue, clamp01 };
