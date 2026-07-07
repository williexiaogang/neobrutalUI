# Divider API

> **Component**: Divider  
> **Category**: Layout  
> **Base class**: `.nb-divider`  
> **Status**: In Progress (horizontal divider with text implemented; vertical orientation in progress)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-divider` | Component | Base divider. Horizontal flex layout with optional label centered between two lines. |
| `.nb-divider-vertical` | Variant | Vertical divider spanning full block height. |

### Class Combination Examples

```html
<!-- Horizontal divider with label -->
<span class="nb-divider" role="separator">Section</span>

<!-- Vertical divider -->
<span class="nb-divider nb-divider-vertical" role="separator" aria-orientation="vertical"></span>
```

---

## DOM Contract

### Recommended Structure

```html
<!-- Horizontal -->
<span class="nb-divider" role="separator">Section</span>

<!-- Vertical -->
<span class="nb-divider nb-divider-vertical" role="separator" aria-orientation="vertical"></span>
```

### Semantic Element

- **Preferred**: `<hr>` for horizontal separators, or `<span role="separator">` when a text label is needed.
- **Vertical**: Use `<span role="separator" aria-orientation="vertical">`.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `role` | Recommended | `"separator"` | Communicates the element's separator role to assistive technologies. |
| `aria-orientation` | Recommended (vertical) | `"vertical"` | Required for vertical dividers; omit or use `"horizontal"` for horizontal dividers. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-label` | When the divider has no visible text but needs an accessible name. |
| `aria-orientation="vertical"` | For `.nb-divider-vertical`. |

### Keyboard Behavior

Divider is a **non-interactive presentational element**. It is not focusable and has no keyboard behavior.

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | — N/A | — | Divider is not interactive; hover state is not applicable. |
| **active** | — N/A | — | Divider is not interactive; active state is not applicable. |
| **focus-visible** | — N/A | — | Divider is not focusable by default. |
| **disabled** | — N/A | — | Divider is not an interactive element. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

```css
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
```

The horizontal divider uses `::before` and `::after` pseudo-elements to draw the two lines on either side of the label. The vertical variant flips the flex direction and line dimensions.

### Reduced Motion

No transitions or animations; reduced-motion is not applicable.

### RTL

Uses logical properties (`inline-size`, `block-size`) and flex alignment; no special RTL overrides needed.

### Forced Colors

```css
@media (forced-colors: active) {
  .nb-divider::before,
  .nb-divider::after {
    background: CanvasText;
  }
}
```

---

## Examples

### Horizontal Divider with Label

```html
<span class="nb-divider" role="separator">Or continue with</span>
```

### Horizontal Divider Without Label

```html
<hr class="nb-divider" />
```

### Vertical Divider

```html
<div style="display: flex; gap: var(--nb-space-4); block-size: 4rem;">
  <span>Left</span>
  <span class="nb-divider nb-divider-vertical" role="separator" aria-orientation="vertical"></span>
  <span>Right</span>
</div>
```
