# Button API

> **Component**: Button  
> **Category**: Actions  
> **Base class**: `.nb-btn`  
> **Status**: Beta (CSS implemented; loading state pending)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-btn` | Component | Base button class. Required. |
| `.nb-btn-primary` | Color | Primary background (`--nb-primary`) with primary-content text. |
| `.nb-btn-secondary` | Color | Secondary background (`--nb-secondary`) with secondary-content text. |
| `.nb-btn-accent` | Color | Accent background (`--nb-accent`) with accent-content text. |
| `.nb-btn-neutral` | Color | Neutral background (`--nb-neutral`) with neutral-content text. |
| `.nb-btn-outline` | Variant | Transparent background, thicker border (`calc(var(--nb-border-width) * 1.5)`). |
| `.nb-btn-ghost` | Variant | Transparent background, no shadow. Hover fills with `--nb-base-200`. |
| `.nb-btn-sm` | Size | Small padding and font size. |
| `.nb-btn-lg` | Size | Large padding and font size. |
| `.nb-btn-block` | Layout | Full-width (`display: flex; inline-size: 100%`). |

### Class Combination Examples

```html
<!-- Base button -->
<button class="nb-btn">Default</button>

<!-- Color + size -->
<button class="nb-btn nb-btn-primary nb-btn-lg">Large Primary</button>

<!-- Variant + size -->
<button class="nb-btn nb-btn-outline nb-btn-sm">Small Outline</button>

<!-- Ghost + block -->
<button class="nb-btn nb-btn-ghost nb-btn-block">Full-width Ghost</button>
```

---

## DOM Contract

### Recommended Structure

```html
<button class="nb-btn nb-btn-primary" type="button">
  <span>Label</span>
</button>
```

### Semantic Element

- **Preferred**: `<button type="button">`
- **For navigation**: `<a>` with `role="button"` is discouraged. Use a real `<button>` and handle navigation in JS, or use `.nb-link` for true links.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `type` | Recommended | `"button"` | Prevents accidental form submission when inside `<form>`. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-label` | Icon-only buttons (no visible text). |
| `aria-expanded` | Buttons that toggle a menu or panel. |
| `aria-haspopup` | Buttons that open a dropdown, dialog, or menu. |
| `aria-pressed` | Toggle buttons (pressed/unpressed state). |
| `aria-busy="true"` | When button is in loading state. |
| `disabled` | When button is not interactive. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus to the button. |
| `Enter` | Activates the button. |
| `Space` | Activates the button. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ | `.nb-btn:hover:not(:disabled)` | Shadow elevates to `--nb-shadow-lg`, `translate(-2px, -2px)`. |
| **active** | ✅ | `.nb-btn:active:not(:disabled)` | Shadow drops to `--nb-shadow-xs`, `translate(2px, 2px)`. |
| **focus-visible** | ✅ | `:focus-visible` (global) | `outline: 3px solid var(--nb-focus); outline-offset: 2px;` |
| **disabled** | ✅ | `.nb-btn:disabled` | `opacity: 0.6`, `cursor: not-allowed`, shadow reset, `translate(2px, 2px)`. |
| **loading** | ❌ Not implemented | — | `.nb-btn-loading` does not exist in current CSS. Use `[aria-busy="true"]` with a spinner child or wait for future implementation. |

### State Priority

When multiple states apply, CSS specificity determines rendering:

1. `disabled` overrides hover and active.
2. `active` overrides hover.
3. `focus-visible` coexists with hover (outline visible + shadow elevated).

---

## CSS Implementation Notes

### Shadow & Motion

Button follows the standard interactive surface pattern:

| State | Shadow | Transform |
|-------|--------|-----------|
| Default | `var(--nb-shadow-md)` (4px 4px) | `translate(0, 0)` |
| Hover | `var(--nb-shadow-lg)` (6px 6px) | `translate(-2px, -2px)` |
| Active | `var(--nb-shadow-xs)` (1px 1px) | `translate(2px, 2px)` |
| Disabled | `var(--nb-shadow-xs)` (1px 1px) | `translate(2px, 2px)` |

> **Note**: The disabled state visually matches the "pressed" position to communicate inactivity.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-btn { transition: none; }
}
```

---

## Examples

### Basic Buttons

```html
<button class="nb-btn">Default</button>
<button class="nb-btn nb-btn-primary">Primary</button>
<button class="nb-btn nb-btn-secondary">Secondary</button>
<button class="nb-btn nb-btn-accent">Accent</button>
<button class="nb-btn nb-btn-neutral">Neutral</button>
```

### Size Variants

```html
<button class="nb-btn nb-btn-sm">Small</button>
<button class="nb-btn">Medium (default)</button>
<button class="nb-btn nb-btn-lg">Large</button>
```

### Appearance Variants

```html
<button class="nb-btn nb-btn-outline">Outline</button>
<button class="nb-btn nb-btn-ghost">Ghost</button>
```

### Disabled State

```html
<button class="nb-btn" disabled>Disabled</button>
<button class="nb-btn nb-btn-primary" disabled>Disabled Primary</button>
```

### Block Layout

```html
<button class="nb-btn nb-btn-primary nb-btn-block">Full-width Button</button>
```

### Icon-Only Button (Accessible)

```html
<button class="nb-btn" aria-label="Close dialog">
  <svg aria-hidden="true"><!-- icon --></svg>
</button>
```

---

## Known Issues

- Loading state spinner alignment needs refinement (tracked in `apps/showcase/src/data/components.ts`).
- Icon-only button accessible name pattern is not yet fully documented.
- `.nb-btn-loading` class does not exist in the current CSS build.
