/**
 * Theme Generator — Token Schema
 *
 * Defines the canonical token names and types for Neo-Brutal UI themes.
 */

/**
 * Semantic color token names in the order they appear in generated CSS.
 */
export const SEMANTIC_COLOR_TOKENS = [
  "base-100",
  "base-200",
  "base-300",
  "base-content",
  "base-content-muted",
  "neutral",
  "neutral-content",
  "primary",
  "primary-content",
  "secondary",
  "secondary-content",
  "accent",
  "accent-content",
  "info",
  "info-content",
  "success",
  "success-content",
  "warning",
  "warning-content",
  "error",
  "error-content",
  "border",
  "focus",
  "overlay",
];

/**
 * Primitive color token names (brand palette + grays).
 */
export const PRIMITIVE_COLOR_TOKENS = [
  "color-black",
  "color-white",
  "color-yellow-400",
  "color-pink-400",
  "color-blue-400",
  "color-green-400",
  "color-red-400",
  "color-orange-400",
  "color-gray-100",
  "color-gray-200",
  "color-gray-800",
];

/**
 * Shadow token names.
 */
export const SHADOW_TOKENS = [
  "shadow-xs",
  "shadow-sm",
  "shadow-md",
  "shadow-lg",
  "shadow-xl",
];

/**
 * Spacing token names.
 */
export const SPACING_TOKENS = [
  "space-0",
  "space-1",
  "space-2",
  "space-3",
  "space-4",
  "space-5",
  "space-6",
  "space-8",
  "space-10",
  "space-12",
  "space-16",
];

/**
 * Typography token names.
 */
export const TYPOGRAPHY_TOKENS = [
  "font-sans",
  "font-mono",
  "text-xs",
  "text-sm",
  "text-base",
  "text-lg",
  "text-xl",
  "text-2xl",
  "text-3xl",
  "text-4xl",
  "leading-none",
  "leading-tight",
  "leading-normal",
  "leading-relaxed",
];

/**
 * Border & radius token names.
 */
export const BORDER_TOKENS = [
  "border-width",
  "radius-selector",
  "radius-field",
  "radius-box",
  "radius-overlay",
];

/**
 * Motion token names.
 */
export const MOTION_TOKENS = [
  "duration-fast",
  "duration-normal",
  "duration-slow",
  "ease-out",
  "ease-in-out",
];

/**
 * Z-index token names.
 */
export const Z_INDEX_TOKENS = [
  "z-dropdown",
  "z-sticky",
  "z-drawer",
  "z-modal",
  "z-toast",
  "z-tooltip",
];

/**
 * Validate that a generated theme contains all required semantic tokens.
 */
export function validateSemanticTokens(theme) {
  const missing = [];
  for (const name of SEMANTIC_COLOR_TOKENS) {
    const key = name.replace(/-([a-z0-9])/gi, (_, ch) => ch.toUpperCase());
    if (theme[key] == null) missing.push(name);
  }
  return {
    valid: missing.length === 0,
    missing,
  };
}
