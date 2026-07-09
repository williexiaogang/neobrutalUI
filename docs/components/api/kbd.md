# Kbd API

> **Component**: Kbd  
> **Category**: Data Display  
> **Base class**: `.nb-kbd`  
> **Status**: Ready (sizes, colors, pressed/active state, grouping, ARIA labels, reduced-motion, and forced-colors support are implemented)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-kbd` | Component | Base keyboard key class. Required. |
| `.nb-kbd-sm` | Size | Smaller key cap. |
| `.nb-kbd-lg` | Size | Larger key cap. |
| `.nb-kbd-primary` | Color | Primary background and content colors. |
| `.nb-kbd-secondary` | Color | Secondary background and content colors. |
| `.nb-kbd-accent` | Color | Accent background and content colors. |
| `.nb-kbd-neutral` | Color | Neutral background and content colors. |
| `.nb-kbd-pressed` | State | Depressed visual (small shadow, shifted transform). |
| `.nb-kbd-group` | Layout | Wrapper for key combos (adds `+` separators). |

### Class Combination Examples

```html
<!-- Single keys -->
<kbd class="nb-kbd">Ctrl</kbd>
<kbd class="nb-kbd nb-kbd-lg nb-kbd-pressed">Space</kbd>

<!-- Combo group -->
<div class="nb-kbd-group">
  <kbd class="nb-kbd nb-kbd-sm">Cmd</kbd>
  <kbd class="nb-kbd nb-kbd-sm">Shift</kbd>
  <kbd class="nb-kbd nb-kbd-sm">N</kbd>
</div>

<!-- Colored combo -->
<div class="nb-kbd-group">
  <kbd class="nb-kbd nb-kbd-primary">Esc</kbd>
  <kbd class="nb-kbd nb-kbd-accent">Enter</kbd>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<kbd class="nb-kbd">Ctrl</kbd>
```

### Combo Group Structure

```html
<div class="nb-kbd-group" aria-label="Keyboard shortcut: Command Shift N">
  <kbd class="nb-kbd nb-kbd-sm">Cmd</kbd>
  <kbd class="nb-kbd nb-kbd-sm">Shift</kbd>
  <kbd class="nb-kbd nb-kbd-sm">N</kbd>
</div>
```

### Semantic Element

- **Preferred**: `<kbd>` for individual keys.
- Use `<div class="nb-kbd-group">` with an `aria-label` for combinations.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| — | — | — | No component-specific required attributes. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-label` | On `.nb-kbd-group` to describe the full shortcut. |
| `aria-hidden="true"` | On decorative visual `+` separators if manually added. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| — | `<kbd>` elements are not interactive; they display shortcut text. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ | `.nb-kbd:hover` | Shadow grows and key lifts. |
| **active** | ✅ | `.nb-kbd:active`, `.nb-kbd-pressed` | Key shifts down with a small shadow. |
| **focus-visible** | ✅ | `:focus-visible` (global) | Default focus outline if the element is focusable. |
| **pressed** | ✅ | `.nb-kbd-pressed` | Persistent depressed visual. |
| **disabled** | ❌ Not applicable | — | Kbd keys are not interactive controls. |
| **current** | ❌ Not applicable | — | No current state. |
| **selected** | ❌ Not applicable | — | No selected state. |
| **read-only** | ❌ Not applicable | — | Kbd is inherently read-only. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

`.nb-kbd` renders an inline-flex key cap with a mono font, hard border, radius, and a raised shadow. Hover lifts the key; active/pressed depresses it. Color variants reassign `--_bg` and `--_fg`. The group wrapper uses a `+` pseudo-element between adjacent keys.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-kbd {
    transition: none;
  }
}
```

### RTL

Uses logical properties; no special RTL overrides needed.

---

## Examples

### Basic Key

```html
<kbd class="nb-kbd">Ctrl</kbd>
<kbd class="nb-kbd">K</kbd>
```

### Sizes

```html
<kbd class="nb-kbd nb-kbd-sm">Esc</kbd>
<kbd class="nb-kbd">Tab</kbd>
<kbd class="nb-kbd nb-kbd-lg">Space</kbd>
```

### Pressed State

```html
<kbd class="nb-kbd nb-kbd-pressed">Space</kbd>
```

### Shortcut Combo

```html
<div class="nb-kbd-group" aria-label="Command Shift N">
  <kbd class="nb-kbd nb-kbd-sm">Cmd</kbd>
  <kbd class="nb-kbd nb-kbd-sm">Shift</kbd>
  <kbd class="nb-kbd nb-kbd-sm">N</kbd>
</div>
```

### Colored Keys

```html
<kbd class="nb-kbd nb-kbd-primary">Esc</kbd>
<kbd class="nb-kbd nb-kbd-accent">Enter</kbd>
<kbd class="nb-kbd nb-kbd-secondary">Tab</kbd>
```
