// ── Inline OKLCH math for client-side preview ─────────────────────────────

type Vec3 = [number, number, number];
type Vec4 = [number, number, number, number];
type Mat3 = [Vec3, Vec3, Vec3];
type ColorTuple = Vec3 | Vec4;

const XYZ_TO_LMS: Mat3 = [
  [0.8189, 0.3619, -0.1289],
  [0.033, 0.9293, 0.0361],
  [0.0482, 0.2644, 0.6339],
];
const LMS_TO_XYZ: Mat3 = [
  [1.227, -0.5578, 0.2813],
  [-0.0406, 1.1123, -0.0717],
  [-0.0764, -0.4215, 1.5862],
];
const LMS_TO_LAB: Mat3 = [
  [0.2105, 0.7936, -0.0041],
  [1.978, -2.4286, 0.4506],
  [0.0259, 0.7828, -0.8087],
];
const LAB_TO_LMS: Mat3 = [
  [1, 0.3963, 0.2158],
  [1, -0.1056, -0.0639],
  [1, -0.0895, -1.2915],
];
const SRGB_TO_XYZ: Mat3 = [
  [0.4124, 0.3576, 0.1805],
  [0.2127, 0.7152, 0.0722],
  [0.0193, 0.1192, 0.9505],
];
const XYZ_TO_SRGB: Mat3 = [
  [3.241, -1.5374, -0.4986],
  [-0.9692, 1.876, 0.0416],
  [0.0556, -0.204, 1.057],
];

function mul(m: Mat3, v: Vec3): Vec3 {
  return [
    m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
    m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
    m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2],
  ];
}
function cbrt(x: number): number {
  return Math.cbrt(x);
}
function toLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function toGamma(c: number): number {
  return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}
function clamp(v: number): number {
  return Math.max(0, Math.min(1, v));
}
function hexToRgb(hex: string): Vec3 {
  const c = hex.replace('#', '');
  if (c.length === 3) {
    return [
      parseInt(c[0] + c[0], 16) / 255,
      parseInt(c[1] + c[1], 16) / 255,
      parseInt(c[2] + c[2], 16) / 255,
    ];
  }
  return [
    parseInt(c.slice(0, 2), 16) / 255,
    parseInt(c.slice(2, 4), 16) / 255,
    parseInt(c.slice(4, 6), 16) / 255,
  ];
}
function rgbToOklch(r: number, g: number, b: number): Vec3 {
  const lin: Vec3 = [toLinear(r), toLinear(g), toLinear(b)];
  const xyz = mul(SRGB_TO_XYZ, lin);
  const lms: Vec3 = [cbrt(xyz[0]), cbrt(xyz[1]), cbrt(xyz[2])];
  const lab = mul(LMS_TO_LAB, lms);
  const C = Math.sqrt(lab[1] * lab[1] + lab[2] * lab[2]);
  let H = (Math.atan2(lab[2], lab[1]) * 180) / Math.PI;
  if (H < 0) H += 360;
  return [lab[0], C, H];
}
function oklchToRgb(L: number, C: number, H: number): Vec3 {
  const hr = (H * Math.PI) / 180;
  const a = C * Math.cos(hr);
  const b = C * Math.sin(hr);
  const lms = mul(LAB_TO_LMS, [L, a, b]);
  const lmsL: Vec3 = [lms[0] ** 3, lms[1] ** 3, lms[2] ** 3];
  const xyz = mul(LMS_TO_XYZ, lmsL);
  const lin = mul(XYZ_TO_SRGB, xyz);
  return [
    clamp(toGamma(clamp(lin[0]))),
    clamp(toGamma(clamp(lin[1]))),
    clamp(toGamma(clamp(lin[2]))),
  ];
}
function luminance(r: number, g: number, b: number): number {
  const f = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function contrast(lch1: Vec3, lch2: Vec3): number {
  const lum1 = luminance(...oklchToRgb(...lch1));
  const lum2 = luminance(...oklchToRgb(...lch2));
  const L = Math.max(lum1, lum2);
  const D = Math.min(lum1, lum2);
  return (L + 0.05) / (D + 0.05);
}
function fmt(n: number): string {
  return n.toFixed(3).replace(/\.?0+$/, '');
}
function toCss(L: number, C: number, H: number, a?: number): string {
  const s = `oklch(${fmt(L * 100)}% ${fmt(C)} ${fmt(H)}`;
  return a !== undefined ? `${s} / ${a})` : `${s})`;
}
function modHue(h: number): number {
  let hh = h % 360;
  if (hh < 0) hh += 360;
  return hh;
}

interface GenerateOptions {
  primary: string;
  name: string;
  strategy: string;
  intensity: number;
  borderContrast: number;
  shadowOffset: string;
  colorSpace: string;
}

function generatePreviewCSS(opts: GenerateOptions): string {
  const primary = rgbToOklch(...hexToRgb(opts.primary));
  const [pL, pC, pH] = primary;
  const I = clamp(opts.intensity);
  const nh = 260;

  // Strategy
  let sH: number;
  let aH: number;
  switch (opts.strategy) {
    case 'analogous':
      sH = pH + 30;
      aH = pH + 60;
      break;
    case 'complementary':
      sH = pH + 180;
      aH = pH + 30;
      break;
    case 'split-complementary':
      sH = pH + 150;
      aH = pH + 60;
      break;
    case 'triadic':
      sH = pH + 120;
      aH = pH + 240;
      break;
    default:
      sH = pH + 30;
      aH = pH + 60;
  }
  sH = modHue(sH);
  aH = modHue(aH);

  const primaryC: Vec3 = [pL, pC * I, pH];
  const secondaryC: Vec3 = [pL, pC * 0.8 * I, sH];
  const accentC: Vec3 = [pL, pC * 0.9 * I, aH];
  const infoC: Vec3 = [0.68, 0.18 * I, 255];
  const successC: Vec3 = [0.72, 0.2 * I, 145];
  const warningC: Vec3 = [0.8, 0.17 * I, 75];
  const errorC: Vec3 = [0.62, 0.22 * I, 25];
  const neutralC: Vec3 = [0.25, 0.03 * I, nh];
  const base100: Vec3 = [1.0, 0.01, pH];
  const base200: Vec3 = [0.95, 0.02, pH];
  const base300: Vec3 = [0.9, 0.03, pH];
  const borderL = 0.15 + (1 - clamp(opts.borderContrast)) * 0.35;
  const borderC: Vec3 = [borderL, 0.03, nh];
  const overlayC: Vec4 = [0.25, 0.03, nh, 0.6];

  const content = (bg: Vec3): Vec3 =>
    bg[0] > 0.68 ? [0.15, 0.05, bg[2]] : [0.98, 0.01, bg[2]];
  const contentMuted = (bg: Vec3): Vec3 =>
    bg[0] > 0.68 ? [0.45, 0.05, bg[2]] : [0.65, 0.03, bg[2]];
  const state = (lch: Vec3) => {
    const d = lch[0] > 0.5 ? -1 : 1;
    return {
      hover: [clamp(lch[0] + d * 0.05), lch[1] * 1.1 * I, lch[2]] as Vec3,
      active: [clamp(lch[0] + d * 0.1), lch[1] * 0.85 * I, lch[2]] as Vec3,
    };
  };
  const shadowMap: Record<string, number> = { xs: 1, sm: 2, md: 4, lg: 6, xl: 8 };
  const sh = shadowMap[opts.shadowOffset] || 4;
  const name = opts.name;

  const tokens: Array<[string, string]> = [
    ['--nb-color-black', 'oklch(0% 0 0)'],
    ['--nb-color-white', 'oklch(100% 0 0)'],
    ['--nb-color-yellow-400', toCss(...warningC)],
    ['--nb-color-pink-400', toCss(...primaryC)],
    ['--nb-color-blue-400', toCss(...infoC)],
    ['--nb-color-green-400', toCss(...successC)],
    ['--nb-color-red-400', toCss(...errorC)],
    ['--nb-color-orange-400', toCss(...accentC)],
    ['--nb-color-gray-100', toCss(0.96, 0.01, nh)],
    ['--nb-color-gray-200', toCss(0.9, 0.015, nh)],
    ['--nb-color-gray-800', toCss(0.3, 0.03, nh)],
    ['--nb-base-100', toCss(...base100)],
    ['--nb-base-200', toCss(...base200)],
    ['--nb-base-300', toCss(...base300)],
    ['--nb-base-content', toCss(...content(base100))],
    ['--nb-base-content-muted', toCss(...contentMuted(base100))],
    ['--nb-neutral', toCss(...neutralC)],
    ['--nb-neutral-content', toCss(...content(neutralC))],
    ['--nb-primary', toCss(...primaryC)],
    ['--nb-primary-content', toCss(...content(primaryC))],
    ['--nb-secondary', toCss(...secondaryC)],
    ['--nb-secondary-content', toCss(...content(secondaryC))],
    ['--nb-accent', toCss(...accentC)],
    ['--nb-accent-content', toCss(...content(accentC))],
    ['--nb-info', toCss(...infoC)],
    ['--nb-info-content', toCss(...content(infoC))],
    ['--nb-success', toCss(...successC)],
    ['--nb-success-content', toCss(...content(successC))],
    ['--nb-warning', toCss(...warningC)],
    ['--nb-warning-content', toCss(...content(warningC))],
    ['--nb-error', toCss(...errorC)],
    ['--nb-error-content', toCss(...content(errorC))],
    ['--nb-border', toCss(...borderC)],
    ['--nb-focus', toCss(...primaryC)],
    ['--nb-overlay', toCss(...overlayC)],
  ];

  const stateTokens = (prefix: string, lch: Vec3) => {
    const s = state(lch);
    return [
      [`--nb-${prefix}-hover`, toCss(...s.hover)],
      [`--nb-${prefix}-active`, toCss(...s.active)],
    ] as Array<[string, string]>;
  };
  tokens.push(
    ...stateTokens('primary', primaryC),
    ...stateTokens('secondary', secondaryC),
    ...stateTokens('accent', accentC),
    ...stateTokens('info', infoC),
    ...stateTokens('success', successC),
    ...stateTokens('warning', warningC),
    ...stateTokens('error', errorC),
    ...stateTokens('neutral', neutralC)
  );

  // Shadow tokens
  tokens.push(
    ['--nb-shadow-xs', `1px 1px 0 var(--nb-border)`],
    ['--nb-shadow-sm', `2px 2px 0 var(--nb-border)`],
    ['--nb-shadow-md', `${sh}px ${sh}px 0 var(--nb-border)`],
    ['--nb-shadow-lg', `${sh + 2}px ${sh + 2}px 0 var(--nb-border)`],
    ['--nb-shadow-xl', `${sh + 4}px ${sh + 4}px 0 var(--nb-border)`]
  );

  const lines = tokens.map((t) => `    ${t[0]}: ${t[1]};`);
  return `@layer nb.theme {\n  [data-theme="${name}"] {\n${lines.join('\n')}\n  }\n}`;
}

function generateDarkPreviewCSS(opts: GenerateOptions): string {
  const css = generatePreviewCSS(opts);
  // Naive dark invert: swap base hues, darken semantic slightly, lighten border
  return css
    .replace(`[data-theme="${opts.name}"]`, `[data-theme="${opts.name}-dark"]`)
    .replace(/--nb-base-100: oklch\([^)]+\);/, '--nb-base-100: oklch(18% 0.03 260);')
    .replace(/--nb-base-200: oklch\([^)]+\);/, '--nb-base-200: oklch(25% 0.03 260);')
    .replace(/--nb-base-300: oklch\([^)]+\);/, '--nb-base-300: oklch(35% 0.03 260);')
    .replace(/--nb-base-content: oklch\([^)]+\);/, '--nb-base-content: oklch(98% 0.01 260);')
    .replace(
      /--nb-base-content-muted: oklch\([^)]+\);/,
      '--nb-base-content-muted: oklch(65% 0.03 260);'
    )
    .replace(/--nb-border: oklch\([^)]+\);/, '--nb-border: oklch(78% 0.024 260);')
    .replace(/--nb-overlay: oklch\([^)]+\);/, '--nb-overlay: oklch(0% 0 0 / 0.7);');
}

// ── UI wiring ─────────────────────────────────────────────────────────────

function initThemeGenerator(): void {
  const primaryInput = document.getElementById('primary') as HTMLInputElement;
  const primaryPicker = document.getElementById('primaryPicker') as HTMLInputElement;
  const strategySelect = document.getElementById('strategy') as HTMLSelectElement;
  const intensityInput = document.getElementById('intensity') as HTMLInputElement;
  const intensityValue = document.getElementById('intensityValue') as HTMLElement;
  const borderContrastInput = document.getElementById('borderContrast') as HTMLInputElement;
  const borderContrastValue = document.getElementById('borderContrastValue') as HTMLElement;
  const shadowOffsetSelect = document.getElementById('shadowOffset') as HTMLSelectElement;
  const colorSpaceSelect = document.getElementById('colorSpace') as HTMLSelectElement;
  const darkCheckbox = document.getElementById('dark') as HTMLInputElement;
  const previewDarkCheckbox = document.getElementById('previewDark') as HTMLInputElement;
  const generateBtn = document.getElementById('generateBtn') as HTMLButtonElement;
  const copyCssBtn = document.getElementById('copyCssBtn') as HTMLButtonElement;
  const copyJsonBtn = document.getElementById('copyJsonBtn') as HTMLButtonElement;
  const cssOutput = document.getElementById('cssOutput') as HTMLElement;
  const warningsPanel = document.getElementById('warnings') as HTMLElement;
  const previewPanel = document.getElementById('previewPanel') as HTMLElement;
  const previewBadge = document.getElementById('previewBadge') as HTMLElement;

  let lastCSS = '';
  let lastJSON = '';

  primaryPicker.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement;
    primaryInput.value = target.value;
    generate();
  });
  primaryInput.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement;
    if (target.value.startsWith('#') && target.value.length === 7) {
      primaryPicker.value = target.value;
    }
    generate();
  });
  intensityInput.addEventListener('input', (e) => {
    intensityValue.textContent = (e.target as HTMLInputElement).value;
    generate();
  });
  borderContrastInput.addEventListener('input', (e) => {
    borderContrastValue.textContent = (e.target as HTMLInputElement).value;
    generate();
  });
  strategySelect.addEventListener('change', generate);
  shadowOffsetSelect.addEventListener('change', generate);
  colorSpaceSelect.addEventListener('change', generate);
  darkCheckbox.addEventListener('change', generate);
  previewDarkCheckbox.addEventListener('change', () => {
    previewPanel.setAttribute(
      'data-theme',
      previewDarkCheckbox.checked ? 'preview-dark' : 'preview'
    );
    previewBadge.textContent = previewDarkCheckbox.checked ? 'Preview Dark' : 'Preview';
    previewBadge.className = previewDarkCheckbox.checked
      ? 'nb-badge nb-badge-secondary'
      : 'nb-badge nb-badge-primary';
    generate();
  });

  generateBtn.addEventListener('click', generate);
  copyCssBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(lastCSS).then(() => {
      copyCssBtn.textContent = 'Copied!';
      setTimeout(() => (copyCssBtn.textContent = 'Copy CSS'), 1500);
    });
  });
  copyJsonBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(lastJSON).then(() => {
      copyJsonBtn.textContent = 'Copied!';
      setTimeout(() => (copyJsonBtn.textContent = 'Copy JSON'), 1500);
    });
  });

  function applyStyles(css: string, themeName: string): void {
    let style = document.getElementById('style-' + themeName);
    if (!style) {
      style = document.createElement('style');
      style.id = 'style-' + themeName;
      document.head.appendChild(style);
    }
    style.textContent = css;
  }

  function generate(): void {
    const opts: GenerateOptions = {
      primary: primaryInput.value.trim() || '#3498db',
      name: 'preview',
      strategy: strategySelect.value,
      intensity: parseFloat(intensityInput.value),
      borderContrast: parseFloat(borderContrastInput.value),
      shadowOffset: shadowOffsetSelect.value,
      colorSpace: colorSpaceSelect.value,
    };
    const lightCSS = generatePreviewCSS(opts);
    applyStyles(lightCSS, 'preview');
    lastCSS = lightCSS;
    lastJSON = JSON.stringify(
      {
        name: opts.name,
        strategy: opts.strategy,
        tokens: Object.fromEntries(
          lightCSS
            .split('\n')
            .filter((l) => l.includes(':'))
            .map((l) => {
              const m = l.match(/(--nb-[^:]+):\s*([^;]+);?/);
              return m ? [m[1].trim(), m[2].trim()] : null;
            })
            .filter(Boolean) as Array<[string, string]>
        ),
      },
      null,
      2
    );
    const codeEl = cssOutput.querySelector('code');
    if (codeEl) {
      codeEl.textContent = lightCSS;
    }
    copyCssBtn.disabled = false;
    copyJsonBtn.disabled = false;

    if (darkCheckbox.checked) {
      const darkCSS = generateDarkPreviewCSS({ ...opts, name: 'preview-dark' });
      applyStyles(darkCSS, 'preview-dark');
    } else {
      const s = document.getElementById('style-preview-dark');
      if (s) s.textContent = '';
    }
    warningsPanel.style.display = 'none';
  }

  generate();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThemeGenerator);
} else {
  initThemeGenerator();
}

// Unused variables referenced by original math are preserved for future use.
void XYZ_TO_LMS;
void contrast;
