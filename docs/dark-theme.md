# Themes

Neo-Brutal UI provides multiple built-in themes out of the box. Switching is a single attribute change — no extra CSS classes or component overrides are required.

Built-in themes:

- `neo-brutal` — default light theme
- `neo-brutal-dark` — dark variant
- `emerald` — emerald-green accented light theme
- `emerald-dark` — emerald dark variant

## Usage

Apply a theme by setting `data-theme` on the `<html>` element (or any ancestor container):

```html
<html data-theme="neo-brutal-dark">
  <body>
    <button class="nb-btn nb-btn-primary">Button</button>
  </body>
</html>
```

You can also nest themes for side-by-side comparison:

```html
<div data-theme="neo-brutal">
  <!-- Default light components -->
</div>
<div data-theme="neo-brutal-dark">
  <!-- Dark components -->
</div>
<div data-theme="emerald">
  <!-- Emerald light components -->
</div>
<div data-theme="emerald-dark">
  <!-- Emerald dark components -->
</div>
```

## Color Mapping

### Primitive Colors (unchanged)

Primitive brand colors are identical in both themes to preserve brand identity:

| Token | Value | Purpose |
|-------|-------|---------|
| `--nb-color-black` | `oklch(0% 0 0)` | Pure black |
| `--nb-color-white` | `oklch(100% 0 0)` | Pure white |
| `--nb-color-yellow-400` | `oklch(88% 0.17 95)` | Brand yellow |
| `--nb-color-pink-400` | `oklch(72% 0.22 350)` | Brand pink |
| `--nb-color-blue-400` | `oklch(68% 0.18 255)` | Brand blue |
| `--nb-color-green-400` | `oklch(72% 0.2 145)` | Brand green |
| `--nb-color-red-400` | `oklch(62% 0.22 25)` | Brand red |
| `--nb-color-orange-400` | `oklch(75% 0.18 65)` | Brand orange |

### Semantic Colors (inverted)

Semantic tokens are reversed for dark mode — dark backgrounds with light text:

| Token | Light | Dark | Notes |
|-------|-------|------|-------|
| `--nb-base-100` | `oklch(98% 0.01 95)` | `oklch(18% 0.03 260)` | Page background |
| `--nb-base-200` | `oklch(95% 0.02 95)` | `oklch(25% 0.03 260)` | Elevated surfaces |
| `--nb-base-300` | `oklch(90% 0.03 95)` | `oklch(35% 0.03 260)` | Borders, dividers |
| `--nb-base-content` | `oklch(18% 0.05 95)` | `oklch(95% 0.01 260)` | Primary text |
| `--nb-base-content-muted` | `oklch(45% 0.05 95)` | `oklch(65% 0.03 260)` | Secondary text |
| `--nb-border` | `var(--nb-base-content)` | `oklch(60% 0.03 260)` | Visible in dark mode |
| `--nb-overlay` | `oklch(25% 0.03 260 / 0.6)` | `oklch(0% 0 0 / 0.7)` | Darker overlay |

### Accent Colors (adapted)

Brand accent colors are slightly adjusted for dark-mode visibility while preserving identity:

| Token | Light | Dark | Content Pairing |
|-------|-------|------|-----------------|
| `--nb-primary` | `oklch(65% 0.2 350)` | `oklch(65% 0.2 350)` | White text |
| `--nb-secondary` | `oklch(75% 0.15 255)` | `oklch(60% 0.15 255)` | White text |
| `--nb-accent` | `oklch(88% 0.17 95)` | `oklch(75% 0.17 95)` | Dark text |
| `--nb-info` | `oklch(68% 0.18 255)` | `oklch(60% 0.18 255)` | White text |
| `--nb-success` | `oklch(72% 0.2 145)` | `oklch(65% 0.2 145)` | White text |
| `--nb-warning` | `oklch(80% 0.17 75)` | `oklch(70% 0.17 75)` | Dark text |
| `--nb-error` | `oklch(62% 0.22 25)` | `oklch(55% 0.22 25)` | White text |

## Contrast Guarantee

All dark-theme color combinations are designed to meet WCAG 2.1 AA standards (4.5:1 contrast ratio or higher):

- **Base text**: `oklch(95% 0.01 260)` on `oklch(18% 0.03 260)` → ~95% vs 18% lightness = **excellent contrast**
- **Primary content**: White on `oklch(65% 0.2 350)` → **passes AA**
- **Accent content**: `oklch(15% 0.05 95)` on `oklch(75% 0.17 95)` → 75% vs 15% = **excellent contrast**
- **Border**: `oklch(60% 0.03 260)` on `oklch(18% 0.03 260)` → 60% vs 18% = **clearly visible**

## Differences from Light Theme

1. **Background inversion**: All base surfaces flip from light to dark.
2. **Border brightness**: Borders are explicitly set to `oklch(60% 0.03 260)` instead of inheriting from `base-content`, ensuring they remain visible against dark backgrounds.
3. **Overlay opacity**: The modal/drawer overlay is darker (`oklch(0% 0 0 / 0.7)` vs `oklch(25% 0.03 260 / 0.6)`) for better emphasis in dark mode.
4. **Shadow visibility**: Shadows use the same offset structure but reference `--nb-border`, which is lighter in dark mode, so shadows remain crisp and visible.
5. **Secondary & accent adjustments**: `--nb-secondary` and `--nb-accent` are slightly darkened in dark mode to maintain visual weight without becoming garish.

## Customizing a Theme

Override any semantic token inside the theme selector:

```css
@layer nb.theme {
  [data-theme="neo-brutal-dark"] {
    --nb-primary: oklch(70% 0.25 350);   /* Brighter pink */
    --nb-base-100: oklch(15% 0.02 260); /* Deeper background */
    --nb-border: oklch(50% 0.03 260);    /* Softer borders */
  }

  [data-theme="emerald"] {
    --nb-primary: oklch(55% 0.2 155);    /* Deeper emerald */
  }
}
```

Always ensure your custom colors maintain adequate contrast ratios.

## JavaScript Toggle

A minimal theme toggle implementation that cycles through all built-in themes:

```javascript
const themes = ["neo-brutal", "neo-brutal-dark", "emerald", "emerald-dark"];

function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute("data-theme") || "neo-brutal";
  const next = themes[(themes.indexOf(current) + 1) % themes.length];
  html.setAttribute("data-theme", next);
  localStorage.setItem("nb-theme", next);
}

// Restore on load (whitelist only known themes)
const saved = localStorage.getItem("nb-theme");
if (themes.includes(saved)) {
  document.documentElement.setAttribute("data-theme", saved);
}
```

For SSR safety, run the restoration script inline and synchronously before the first paint to avoid a flash of unstyled content.
