const fs = require('fs');
const path = require('path');

// Read original CSS from prompt - we have it embedded above
// Instead, let's do a block-by-block comparison using the actual file content
// Since we overwrote the original, we use the prompt content.
// But we can verify more simply: check that every CSS selector block from the prompt
// exists identically in the new files.

const srcDir = 'packages/core/src';

const files = [
  'tokens/colors.css',
  'tokens/spacing.css',
  'tokens/shadows.css',
  'tokens/motion.css',
  'tokens/z-index.css',
  'base/reset.css',
  'components/button.css',
  'components/card.css',
  'components/field.css',
  'components/selector.css',
  'components/badge.css',
  'components/alert.css',
  'components/divider.css',
  'components/loading.css',
  'components/modal.css',
  'components/link.css',
  'utilities/sr-only.css',
];

let combined = '';
for (const f of files) {
  combined += fs.readFileSync(path.join(srcDir, f), 'utf-8') + '\n';
}

// Extract all rules: key = "selector{...}", value = normalized declarations
function extractRules(css) {
  const rules = new Map();
  // Remove comments
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Match @keyframes blocks separately
  const keyframesPattern = /@keyframes\s+([\w-]+)\s*\{([^}]*)\}/g;
  let m;
  while ((m = keyframesPattern.exec(css)) !== null) {
    const name = m[1];
    const body = m[2].replace(/\s+/g, ' ').trim();
    rules.set(`@keyframes ${name}`, body);
  }
  
  // Match @media blocks
  const mediaPattern = /@media\s*\([^)]*\)\s*\{([^}]*)\}/g;
  css = css.replace(mediaPattern, (match, body) => {
    // Extract rules inside media queries
    const innerRules = extractInnerRules(body);
    for (const [sel, decl] of innerRules) {
      rules.set(`@media ${sel}`, decl);
    }
    return '';
  });
  
  // Extract remaining regular rules
  const innerRules = extractInnerRules(css);
  for (const [sel, decl] of innerRules) {
    if (!rules.has(sel)) {
      rules.set(sel, decl);
    }
  }
  
  return rules;
}

function extractInnerRules(css) {
  const rules = new Map();
  // Match selector blocks: capture selector and body
  const pattern = /([^{@][^{]*)\{([^}]*)\}/g;
  let m;
  while ((m = pattern.exec(css)) !== null) {
    const sel = m[1].trim();
    const decl = m[2].replace(/\s+/g, ' ').trim();
    if (sel && decl) {
      rules.set(sel, decl);
    }
  }
  return rules;
}

const origCSS = `/**
 * Neo-Brutal UI — Core CSS (preview implementation)
 *
 * This is the first runnable CSS build for the Neo-Brutal UI component library.
 * It is intentionally minimal: only the primitives and a small set of core
 * components needed by the showcase site are implemented. Complex components
 * (Modal, Dropdown, Tabs, etc.) are still in planning and are not styled here.
 */

@layer nb.theme, nb.base, nb.components, nb.utilities;

/* --------------------------------------------------------------------------
 * Theme layer
 * -------------------------------------------------------------------------- */
@layer nb.theme {
  [data-theme="neo-brutal"],
  [data-theme="neo-brutal"] * {
    /* Primitive colors (OKLCH) */
    --nb-color-black: oklch(0% 0 0);
    --nb-color-white: oklch(100% 0 0);
    --nb-color-yellow-400: oklch(88% 0.17 95);
    --nb-color-pink-400: oklch(72% 0.22 350);
    --nb-color-blue-400: oklch(68% 0.18 255);
    --nb-color-green-400: oklch(72% 0.2 145);
    --nb-color-red-400: oklch(62% 0.22 25);
    --nb-color-orange-400: oklch(75% 0.18 65);
    --nb-color-gray-100: oklch(96% 0.01 260);
    --nb-color-gray-200: oklch(90% 0.015 260);
    --nb-color-gray-800: oklch(30% 0.03 260);

    /* Semantic colors */
    --nb-base-100: oklch(98% 0.01 95);
    --nb-base-200: oklch(95% 0.02 95);
    --nb-base-300: oklch(90% 0.03 95);
    --nb-base-content: oklch(18% 0.05 95);
    --nb-base-content-muted: oklch(45% 0.05 95);

    --nb-neutral: oklch(25% 0.03 260);
    --nb-neutral-content: oklch(98% 0.01 260);

    --nb-primary: oklch(65% 0.2 350);
    --nb-primary-content: oklch(100% 0 0);

    --nb-secondary: oklch(75% 0.15 255);
    --nb-secondary-content: oklch(15% 0.05 255);

    --nb-accent: oklch(88% 0.17 95);
    --nb-accent-content: oklch(18% 0.05 95);

    --nb-info: oklch(68% 0.18 255);
    --nb-info-content: oklch(100% 0 0);

    --nb-success: oklch(72% 0.2 145);
    --nb-success-content: oklch(15% 0.05 145);

    --nb-warning: oklch(80% 0.17 75);
    --nb-warning-content: oklch(18% 0.05 75);

    --nb-error: oklch(62% 0.22 25);
    --nb-error-content: oklch(100% 0 0);

    --nb-border: var(--nb-base-content);
    --nb-focus: var(--nb-primary);
    --nb-overlay: oklch(25% 0.03 260 / 0.6);

    /* Spacing */
    --nb-space-0: 0;
    --nb-space-1: 0.25rem;
    --nb-space-2: 0.5rem;
    --nb-space-3: 0.75rem;
    --nb-space-4: 1rem;
    --nb-space-5: 1.25rem;
    --nb-space-6: 1.5rem;
    --nb-space-8: 2rem;
    --nb-space-10: 2.5rem;
    --nb-space-12: 3rem;
    --nb-space-16: 4rem;

    /* Typography */
    --nb-font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    --nb-font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
      monospace;
    --nb-text-xs: 0.75rem;
    --nb-text-sm: 0.875rem;
    --nb-text-base: 1rem;
    --nb-text-lg: 1.125rem;
    --nb-text-xl: 1.25rem;
    --nb-text-2xl: 1.5rem;
    --nb-text-3xl: 2rem;
    --nb-text-4xl: 2.5rem;
    --nb-leading-none: 1;
    --nb-leading-tight: 1.25;
    --nb-leading-normal: 1.5;
    --nb-leading-relaxed: 1.625;

    /* Border & radius */
    --nb-border-width: 2px;
    --nb-radius-selector: 0px;
    --nb-radius-field: 0px;
    --nb-radius-box: 0px;
    --nb-radius-overlay: 0px;

    /* Shadows */
    --nb-shadow-xs: 1px 1px 0 var(--nb-border);
    --nb-shadow-sm: 2px 2px 0 var(--nb-border);
    --nb-shadow-md: 4px 4px 0 var(--nb-border);
    --nb-shadow-lg: 6px 6px 0 var(--nb-border);

    /* Motion */
    --nb-duration-fast: 120ms;
    --nb-duration-normal: 180ms;
    --nb-duration-slow: 300ms;
    --nb-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
    --nb-ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);

    /* Z-index */
    --nb-z-sticky: 100;
    --nb-z-dropdown: 200;
    --nb-z-drawer: 300;
    --nb-z-modal: 400;
    --nb-z-tooltip: 500;
    --nb-z-toast: 600;
  }
}

/* --------------------------------------------------------------------------
 * Base layer
 * -------------------------------------------------------------------------- */
@layer nb.base {
  [data-theme="neo-brutal"] {
    color: var(--nb-base-content);
    font-family: var(--nb-font-sans);
    line-height: var(--nb-leading-normal);
  }

  [data-theme="neo-brutal"] *,
  [data-theme="neo-brutal"] *::before,
  [data-theme="neo-brutal"] *::after {
    box-sizing: border-box;
  }

  [data-theme="neo-brutal"] :focus-visible {
    outline: 3px solid var(--nb-focus);
    outline-offset: 2px;
  }

  [data-theme="neo-brutal"] ::selection {
    background: var(--nb-accent);
    color: var(--nb-accent-content);
  }
}

/* --------------------------------------------------------------------------
 * Components layer
 * -------------------------------------------------------------------------- */
@layer nb.components {
  /* Button */
  .nb-btn {
    --_bg: var(--nb-base-100);
    --_fg: var(--nb-base-content);
    --_border: var(--nb-border);

    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--nb-space-2);
    padding: var(--nb-space-2) var(--nb-space-4);
    min-block-size: 2.5rem;
    border: var(--nb-border-width) solid var(--_border);
    border-radius: var(--nb-radius-field);
    background: var(--_bg);
    color: var(--_fg);
    font-family: inherit;
    font-size: var(--nb-text-base);
    font-weight: 700;
    line-height: var(--nb-leading-none);
    text-decoration: none;
    cursor: pointer;
    box-shadow: var(--nb-shadow-md);
    transform: translate(0, 0);
    transition: transform var(--nb-duration-fast) var(--nb-ease-out),
      box-shadow var(--nb-duration-fast) var(--nb-ease-out);
  }

  @media (prefers-reduced-motion: reduce) {
    .nb-btn {
      transition: none;
    }
  }

  .nb-btn:hover:not(:disabled) {
    box-shadow: var(--nb-shadow-lg);
    transform: translate(-2px, -2px);
  }

  .nb-btn:active:not(:disabled) {
    box-shadow: var(--nb-shadow-xs);
    transform: translate(2px, 2px);
  }

  .nb-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: var(--nb-shadow-xs);
    transform: translate(2px, 2px);
  }

  .nb-btn-primary {
    --_bg: var(--nb-primary);
    --_fg: var(--nb-primary-content);
  }

  .nb-btn-secondary {
    --_bg: var(--nb-secondary);
    --_fg: var(--nb-secondary-content);
  }

  .nb-btn-accent {
    --_bg: var(--nb-accent);
    --_fg: var(--nb-accent-content);
  }

  .nb-btn-neutral {
    --_bg: var(--nb-neutral);
    --_fg: var(--nb-neutral-content);
  }

  .nb-btn-outline {
    --_bg: transparent;
    --_fg: var(--nb-base-content);
    border-width: calc(var(--nb-border-width) * 1.5);
  }

  .nb-btn-ghost {
    --_bg: transparent;
    --_fg: var(--nb-base-content);
    box-shadow: none;
  }

  .nb-btn-ghost:hover:not(:disabled) {
    --_bg: var(--nb-base-200);
    box-shadow: none;
    transform: none;
  }

  .nb-btn-sm {
    padding: var(--nb-space-1) var(--nb-space-3);
    min-block-size: 2rem;
    font-size: var(--nb-text-sm);
  }

  .nb-btn-lg {
    padding: var(--nb-space-3) var(--nb-space-6);
    min-block-size: 3rem;
    font-size: var(--nb-text-lg);
  }

  .nb-btn-block {
    display: flex;
    inline-size: 100%;
  }

  /* Card */
  .nb-card {
    display: flex;
    flex-direction: column;
    border: var(--nb-border-width) solid var(--nb-border);
    border-radius: var(--nb-radius-box);
    background: var(--nb-base-100);
    box-shadow: var(--nb-shadow-md);
  }

  .nb-card-header,
  .nb-card-body,
  .nb-card-footer {
    padding: var(--nb-space-4);
  }

  .nb-card-header {
    border-block-end: var(--nb-border-width) solid var(--nb-border);
    font-weight: 700;
  }

  .nb-card-footer {
    border-block-start: var(--nb-border-width) solid var(--nb-border);
  }

  .nb-card-title {
    margin: 0;
    font-size: var(--nb-text-xl);
    line-height: var(--nb-leading-tight);
  }

  /* Input / Field */
  .nb-input,
  .nb-textarea,
  .nb-select {
    display: block;
    inline-size: 100%;
    padding: var(--nb-space-2) var(--nb-space-3);
    border: var(--nb-border-width) solid var(--nb-border);
    border-radius: var(--nb-radius-field);
    background: var(--nb-base-100);
    color: var(--nb-base-content);
    font-family: inherit;
    font-size: var(--nb-text-base);
    line-height: var(--nb-leading-normal);
    box-shadow: var(--nb-shadow-sm);
    transition: box-shadow var(--nb-duration-fast) var(--nb-ease-out),
      border-color var(--nb-duration-fast) var(--nb-ease-out);
  }

  @media (prefers-reduced-motion: reduce) {
    .nb-input,
    .nb-textarea,
    .nb-select {
      transition: none;
    }
  }

  .nb-input:focus,
  .nb-textarea:focus,
  .nb-select:focus {
    border-color: var(--nb-focus);
    box-shadow: var(--nb-shadow-md);
  }

  .nb-input:disabled,
  .nb-textarea:disabled,
  .nb-select:disabled {
    background: var(--nb-base-200);
    opacity: 0.7;
    cursor: not-allowed;
  }

  .nb-input[aria-invalid="true"],
  .nb-textarea[aria-invalid="true"],
  .nb-select[aria-invalid="true"] {
    border-color: var(--nb-error);
  }

  .nb-textarea {
    resize: vertical;
    min-block-size: 6rem;
  }

  .nb-select {
    appearance: none;
    background-image: linear-gradient(45deg, transparent 50%, currentColor 50%),
      linear-gradient(135deg, currentColor 50%, transparent 50%);
    background-position: calc(100% - 1rem) center, calc(100% - 0.625rem) center;
    background-size: 0.375rem 0.375rem, 0.375rem 0.375rem;
    background-repeat: no-repeat;
    padding-inline-end: var(--nb-space-8);
  }

  [dir="rtl"] .nb-select {
    background-position: 0.625rem center, 1rem center;
    padding-inline-end: var(--nb-space-3);
    padding-inline-start: var(--nb-space-8);
  }

  .nb-field {
    display: flex;
    flex-direction: column;
    gap: var(--nb-space-1);
  }

  .nb-field-label {
    font-weight: 700;
    font-size: var(--nb-text-sm);
  }

  .nb-field-description {
    font-size: var(--nb-text-sm);
    color: var(--nb-base-content-muted);
  }

  .nb-field-error {
    font-size: var(--nb-text-sm);
    color: var(--nb-error);
    font-weight: 700;
  }

  /* Checkbox & Radio */
  .nb-checkbox,
  .nb-radio {
    appearance: none;
    inline-size: 1.25rem;
    block-size: 1.25rem;
    border: var(--nb-border-width) solid var(--nb-border);
    background: var(--nb-base-100);
    box-shadow: var(--nb-shadow-sm);
    cursor: pointer;
    display: inline-grid;
    place-content: center;
    vertical-align: middle;
    transition: background var(--nb-duration-fast) var(--nb-ease-out);
  }

  @media (prefers-reduced-motion: reduce) {
    .nb-checkbox,
    .nb-radio {
      transition: none;
    }
  }

  .nb-checkbox {
    border-radius: var(--nb-radius-selector);
  }

  .nb-radio {
    border-radius: 9999px;
  }

  .nb-checkbox:checked,
  .nb-radio:checked {
    background: var(--nb-primary);
    border-color: var(--nb-border);
  }

  .nb-checkbox:checked::after {
    content: "";
    inline-size: 0.5rem;
    block-size: 0.875rem;
    border: solid var(--nb-primary-content);
    border-width: 0 2px 2px 0;
    transform: rotate(45deg) translate(-1px, -1px);
  }

  .nb-radio:checked::after {
    content: "";
    inline-size: 0.5rem;
    block-size: 0.5rem;
    border-radius: 9999px;
    background: var(--nb-primary-content);
  }

  .nb-checkbox:disabled,
  .nb-radio:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Toggle */
  .nb-toggle {
    appearance: none;
    inline-size: 2.75rem;
    block-size: 1.5rem;
    border: var(--nb-border-width) solid var(--nb-border);
    border-radius: 9999px;
    background: var(--nb-base-300);
    box-shadow: inset 0 0 0 0 var(--nb-primary);
    position: relative;
    cursor: pointer;
    transition: background var(--nb-duration-normal) var(--nb-ease-in-out);
  }

  @media (prefers-reduced-motion: reduce) {
    .nb-toggle {
      transition: none;
    }
  }

  .nb-toggle::after {
    content: "";
    position: absolute;
    inset-block-start: 2px;
    inset-inline-start: 2px;
    inline-size: calc(1.5rem - 6px);
    block-size: calc(1.5rem - 6px);
    border: var(--nb-border-width) solid var(--nb-border);
    border-radius: 9999px;
    background: var(--nb-base-100);
    box-shadow: var(--nb-shadow-sm);
    transition: transform var(--nb-duration-normal) var(--nb-ease-in-out);
  }

  .nb-toggle:checked {
    background: var(--nb-primary);
  }

  .nb-toggle:checked::after {
    transform: translateX(1.25rem);
  }

  [dir="rtl"] .nb-toggle:checked::after {
    transform: translateX(-1.25rem);
  }

  .nb-toggle:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Badge */
  .nb-badge {
    --_bg: var(--nb-base-200);
    --_fg: var(--nb-base-content);

    display: inline-flex;
    align-items: center;
    gap: var(--nb-space-1);
    padding: var(--nb-space-1) var(--nb-space-2);
    border: var(--nb-border-width) solid var(--nb-border);
    border-radius: 9999px;
    background: var(--nb-base-200);
    color: var(--nb-base-content);
    font-size: var(--nb-text-xs);
    font-weight: 700;
    line-height: var(--nb-leading-none);
    text-transform: uppercase;
    letter-spacing: 0.025em;
  }

  .nb-badge-primary {
    --_bg: var(--nb-primary);
    --_fg: var(--nb-primary-content);
    background: var(--nb-primary);
    color: var(--nb-primary-content);
  }

  .nb-badge-secondary {
    background: var(--nb-secondary);
    color: var(--nb-secondary-content);
  }

  .nb-badge-accent {
    background: var(--nb-accent);
    color: var(--nb-accent-content);
  }

  .nb-badge-info {
    background: var(--nb-info);
    color: var(--nb-info-content);
  }

  .nb-badge-success {
    background: var(--nb-success);
    color: var(--nb-success-content);
  }

  .nb-badge-warning {
    background: var(--nb-warning);
    color: var(--nb-warning-content);
  }

  .nb-badge-error {
    background: var(--nb-error);
    color: var(--nb-error-content);
  }

  .nb-badge-outline {
    background: transparent;
    color: var(--nb-base-content);
  }

  /* Alert */
  .nb-alert {
    --_accent: var(--nb-neutral);

    display: flex;
    gap: var(--nb-space-3);
    padding: var(--nb-space-4);
    border: var(--nb-border-width) solid var(--nb-border);
    border-inline-start-width: 6px;
    border-inline-start-color: var(--_accent);
    border-radius: var(--nb-radius-box);
    background: var(--nb-base-100);
    box-shadow: var(--nb-shadow-sm);
  }

  .nb-alert-info {
    --_accent: var(--nb-info);
  }

  .nb-alert-success {
    --_accent: var(--nb-success);
  }

  .nb-alert-warning {
    --_accent: var(--nb-warning);
  }

  .nb-alert-error {
    --_accent: var(--nb-error);
  }

  .nb-alert-icon {
    flex-shrink: 0;
    inline-size: 1.5rem;
    block-size: 1.5rem;
    color: var(--_accent);
  }

  .nb-alert-title {
    margin: 0 0 var(--nb-space-1);
    font-size: var(--nb-text-base);
    font-weight: 700;
  }

  .nb-alert-body {
    font-size: var(--nb-text-sm);
    color: var(--nb-base-content-muted);
  }

  /* Divider */
  .nb-divider {
    display: flex;
    align-items: center;
    gap: var(--nb-space-3);
    border: 0;
    color: var(--nb-base-content-muted);
    font-size: var(--nb-text-sm);
    font-weight: 700;
  }

  .nb-divider::before,
  .nb-divider::after {
    content: "";
    flex: 1;
    block-size: 2px;
    background: var(--nb-border);
  }

  .nb-divider-vertical {
    flex-direction: column;
    inline-size: 2px;
    block-size: 100%;
  }

  .nb-divider-vertical::before,
  .nb-divider-vertical::after {
    inline-size: 2px;
    block-size: auto;
  }

  /* Loading */
  .nb-loading {
    display: inline-block;
    inline-size: 1.5rem;
    block-size: 1.5rem;
    border: 3px solid var(--nb-base-300);
    border-block-start-color: var(--nb-primary);
    border-radius: 50%;
    animation: nb-spin 0.8s linear infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .nb-loading {
      animation: none;
      border: 3px dashed var(--nb-primary);
    }
  }

  @keyframes nb-spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Skeleton */
  .nb-skeleton {
    display: block;
    inline-size: 100%;
    block-size: 1em;
    border-radius: var(--nb-radius-field);
    background: linear-gradient(
      90deg,
      var(--nb-base-200) 25%,
      var(--nb-base-300) 50%,
      var(--nb-base-200) 75%
    );
    background-size: 200% 100%;
    animation: nb-skeleton-pulse 1.5s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .nb-skeleton {
      animation: none;
      background: var(--nb-base-200);
    }
  }

  @keyframes nb-skeleton-pulse {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  /* Link */
  .nb-link {
    color: var(--nb-primary);
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 2px;
    font-weight: 700;
  }

  .nb-link:hover {
    background: var(--nb-accent);
    color: var(--nb-accent-content);
    text-decoration: none;
  }

  /* Modal */
  .nb-modal-backdrop {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--nb-space-4);
    z-index: var(--nb-z-modal);
    opacity: 0;
    visibility: hidden;
    transition: opacity var(--nb-duration-slow) var(--nb-ease-out),
      visibility var(--nb-duration-slow) var(--nb-ease-out);
  }

  dialog.nb-modal-backdrop {
    border: none;
    padding: var(--nb-space-4);
    background: none;
    max-width: none;
    max-height: none;
    margin: 0;
    inset: 0;
  }

  dialog.nb-modal-backdrop::backdrop {
    background: var(--nb-overlay);
    opacity: 0;
    transition: opacity var(--nb-duration-slow) var(--nb-ease-out);
  }

  dialog.nb-modal-backdrop.is-open::backdrop,
  dialog.nb-modal-backdrop[open]::backdrop {
    opacity: 1;
  }

  .nb-modal-backdrop:not(dialog) {
    background: var(--nb-overlay);
  }

  .nb-modal-backdrop.is-open,
  dialog.nb-modal-backdrop[open] {
    opacity: 1;
    visibility: visible;
  }

  .nb-modal {
    position: relative;
    inline-size: 100%;
    max-inline-size: 28rem;
    max-block-size: calc(100vh - var(--nb-space-8));
    overflow: auto;
    background: var(--nb-base-100);
    border: var(--nb-border-width) solid var(--nb-border);
    border-radius: var(--nb-radius-overlay);
    box-shadow: var(--nb-shadow-xl);
    opacity: 0;
    transform: translateY(8px) scale(0.98);
    transition: opacity var(--nb-duration-slow) var(--nb-ease-out),
      transform var(--nb-duration-slow) var(--nb-ease-out);
  }

  .nb-modal-backdrop.is-open .nb-modal,
  dialog.nb-modal-backdrop[open] .nb-modal {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  .nb-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--nb-space-3);
    padding: var(--nb-space-4);
    border-block-end: var(--nb-border-width) solid var(--nb-border);
    background: var(--nb-base-200);
  }

  .nb-modal-title {
    margin: 0;
    font-size: var(--nb-text-lg);
    font-weight: 700;
    line-height: var(--nb-leading-tight);
  }

  .nb-modal-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: 2rem;
    block-size: 2rem;
    padding: 0;
    background: var(--nb-base-100);
    color: var(--nb-base-content);
    border: var(--nb-border-width) solid var(--nb-border);
    font-size: var(--nb-text-xl);
    line-height: 1;
    cursor: pointer;
    box-shadow: var(--nb-shadow-sm);
    transition: transform var(--nb-duration-fast) var(--nb-ease-out),
      box-shadow var(--nb-duration-fast) var(--nb-ease-out);
  }

  .nb-modal-close:hover {
    background: var(--nb-base-200);
    box-shadow: var(--nb-shadow-md);
    transform: translate(-2px, -2px);
  }

  .nb-modal-close:active {
    box-shadow: var(--nb-shadow-xs);
    transform: translate(2px, 2px);
  }

  .nb-modal-body {
    padding: var(--nb-space-4);
  }

  .nb-modal-footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: var(--nb-space-3);
    padding: var(--nb-space-4);
    border-block-start: var(--nb-border-width) solid var(--nb-border);
    background: var(--nb-base-200);
  }

  /* Modal size variants */
  .nb-modal-xs { max-inline-size: 20rem; }
  .nb-modal-sm { max-inline-size: 24rem; }
  .nb-modal-md { max-inline-size: 28rem; }
  .nb-modal-lg { max-inline-size: 32rem; }
  .nb-modal-xl { max-inline-size: 40rem; }
  .nb-modal-full {
    max-inline-size: 100%;
    min-block-size: 100vh;
    border-radius: 0;
  }

  /* Modal color variants */
  .nb-modal-primary .nb-modal-header {
    background: var(--nb-primary);
    color: var(--nb-primary-content);
    border-block-end-color: color-mix(in oklch, var(--nb-primary-content) 20%, transparent);
  }

  .nb-modal-danger .nb-modal-header {
    background: var(--nb-error);
    color: var(--nb-error-content);
    border-block-end-color: color-mix(in oklch, var(--nb-error-content) 20%, transparent);
  }

  .nb-modal-warning .nb-modal-header {
    background: var(--nb-warning);
    color: var(--nb-warning-content);
    border-block-end-color: color-mix(in oklch, var(--nb-warning-content) 20%, transparent);
  }

  .nb-modal-success .nb-modal-header {
    background: var(--nb-success);
    color: var(--nb-success-content);
    border-block-end-color: color-mix(in oklch, var(--nb-success-content) 20%, transparent);
  }

  /* Mobile sheet variant */
  @media (max-width: 768px) {
    .nb-modal-sheet {
      max-inline-size: 100%;
      margin-block-start: auto;
      margin-block-end: 0;
      border-radius: 0;
      box-shadow: 0 -4px 0 var(--nb-border);
    }

    .nb-modal-backdrop:has(.nb-modal-sheet) {
      align-items: flex-end;
      padding: 0;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .nb-modal-backdrop,
    .nb-modal {
      transition: none;
      animation: none;
      transform: none !important;
    }

    .nb-modal-backdrop.is-open .nb-modal,
    dialog.nb-modal-backdrop[open] .nb-modal {
      transform: none;
    }
  }

  /* Forced colors */
  @media (forced-colors: active) {
    .nb-modal {
      border: 2px solid CanvasText;
      forced-color-adjust: none;
    }

    .nb-modal-header,
    .nb-modal-footer {
      border-color: CanvasText;
    }

    .nb-modal-backdrop:not(dialog) {
      background: Canvas;
      opacity: 0.9;
    }

    dialog.nb-modal-backdrop::backdrop {
      background: Canvas;
      opacity: 0.9;
    }

    .nb-modal-close {
      border: 2px solid CanvasText;
    }
  }
}

/* --------------------------------------------------------------------------
 * Utilities layer
 * -------------------------------------------------------------------------- */
@layer nb.utilities {
  .nb-sr-only {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
}`;

function getDeclarations(css) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const decls = new Set();
  const pattern = /([^{@][^{]*)\{([^}]*)\}/g;
  let m;
  while ((m = pattern.exec(css)) !== null) {
    const sel = m[1].trim();
    const body = m[2].replace(/\s+/g, ' ').trim();
    decls.add(`${sel} { ${body} }`);
  }
  return decls;
}

function getKeyframes(css) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const frames = new Set();
  const pattern = /@keyframes\s+([\w-]+)\s*\{([^}]*)\}/g;
  let m;
  while ((m = pattern.exec(css)) !== null) {
    frames.add(`@keyframes ${m[1]} { ${m[2].replace(/\s+/g, ' ').trim()} }`);
  }
  return frames;
}

function getMediaQueries(css) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const media = new Set();
  const pattern = /@media\s*\(([^)]*)\)\s*\{([^}]*)\}/g;
  let m;
  while ((m = pattern.exec(css)) !== null) {
    const inner = m[2];
    const innerRules = getDeclarations(inner);
    for (const r of innerRules) {
      media.add(`@media(${m[1].trim()}) ${r}`);
    }
  }
  return media;
}

const origDecls = getDeclarations(origCSS);
const origFrames = getKeyframes(origCSS);
const origMedia = getMediaQueries(origCSS);

const newDecls = getDeclarations(combined);
const newFrames = getKeyframes(combined);
const newMedia = getMediaQueries(combined);

let ok = true;

for (const d of origDecls) {
  if (!newDecls.has(d)) {
    console.log('❌ Missing declaration:', d.slice(0, 200));
    ok = false;
  }
}
for (const d of newDecls) {
  if (!origDecls.has(d)) {
    console.log('❌ Extra declaration:', d.slice(0, 200));
    ok = false;
  }
}

for (const f of origFrames) {
  if (!newFrames.has(f)) {
    console.log('❌ Missing keyframes:', f);
    ok = false;
  }
}
for (const f of newFrames) {
  if (!origFrames.has(f)) {
    console.log('❌ Extra keyframes:', f);
    ok = false;
  }
}

for (const m of origMedia) {
  if (!newMedia.has(m)) {
    console.log('❌ Missing media query rule:', m.slice(0, 200));
    ok = false;
  }
}
for (const m of newMedia) {
  if (!origMedia.has(m)) {
    console.log('❌ Extra media query rule:', m.slice(0, 200));
    ok = false;
  }
}

if (ok) {
  console.log('✅ All declarations, keyframes, and media queries match!');
  console.log('Declarations:', origDecls.size);
  console.log('Keyframes:', origFrames.size);
  console.log('Media queries:', origMedia.size);
} else {
  process.exit(1);
}
