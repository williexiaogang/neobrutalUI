# Rating API

> **Component**: Rating  
> **Category**: Forms  
> **Base class**: `.nb-rating`  
> **Status**: Ready (filled, half-filled, read-only, interactive radiogroup behavior, keyboard selection, size, and color variants implemented)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-rating` | Component | Root container for the rating stars. Required. |
| `.nb-rating-item` | Component | Individual star or icon element. |
| `.nb-rating-item-filled` | State | Filled star state. Uses `--_star-color`. |
| `.nb-rating-item-half` | State | Half-filled star state rendered with a clipped pseudo-element. |
| `.nb-rating-interactive` | Variant | Enables hover selection and pointer cursor on items. |
| `.nb-rating-readonly` | Variant | Sets items to `cursor: default` for non-interactive display. |
| `.nb-rating-primary` | Color | Sets star color to `--nb-primary`. |
| `.nb-rating-secondary` | Color | Sets star color to `--nb-secondary`. |
| `.nb-rating-accent` | Color | Sets star color to `--nb-accent`. |
| `.nb-rating-info` | Color | Sets star color to `--nb-info`. |
| `.nb-rating-success` | Color | Sets star color to `--nb-success`. |
| `.nb-rating-warning` | Color | Sets star color to `--nb-warning`. |
| `.nb-rating-error` | Color | Sets star color to `--nb-error`. |
| `.nb-rating-neutral` | Color | Sets star color to `--nb-neutral`. |
| `.nb-rating-sm` | Size | Small stars (`1rem`). |
| `.nb-rating-lg` | Size | Large stars (`2rem`). |
| `.nb-rating-xl` | Size | Extra-large stars (`2.5rem`). |
| `.nb-rating-caption` | Part | Numeric caption displayed next to the rating. |

### Class Combination Examples

```html
<!-- Read-only 4 out of 5 -->
<div class="nb-rating nb-rating-readonly" role="img" aria-label="Rating: 4 out of 5">
  <span class="nb-rating-item nb-rating-item-filled nb-rating-warning"></span>
  <span class="nb-rating-item nb-rating-item-filled nb-rating-warning"></span>
  <span class="nb-rating-item nb-rating-item-filled nb-rating-warning"></span>
  <span class="nb-rating-item nb-rating-item-filled nb-rating-warning"></span>
  <span class="nb-rating-item nb-rating-warning"></span>
</div>

<!-- Half-star rating -->
<div class="nb-rating nb-rating-readonly nb-rating-lg" role="img" aria-label="Rating: 2.5 out of 5">
  <span class="nb-rating-item nb-rating-item-filled nb-rating-accent"></span>
  <span class="nb-rating-item nb-rating-item-filled nb-rating-accent"></span>
  <span class="nb-rating-item nb-rating-item-half nb-rating-accent"></span>
  <span class="nb-rating-item nb-rating-accent"></span>
  <span class="nb-rating-item nb-rating-accent"></span>
</div>

<!-- Interactive -->
<div class="nb-rating nb-rating-interactive nb-rating-primary" data-nb-rating role="radiogroup" aria-label="Rate this product">
  <span class="nb-rating-item" data-nb-rating-item data-value="1" role="radio" aria-checked="false" tabindex="0" aria-label="1 star"></span>
  <span class="nb-rating-item" data-nb-rating-item data-value="2" role="radio" aria-checked="false" tabindex="-1" aria-label="2 stars"></span>
  <span class="nb-rating-item" data-nb-rating-item data-value="3" role="radio" aria-checked="false" tabindex="-1" aria-label="3 stars"></span>
  <span class="nb-rating-item" data-nb-rating-item data-value="4" role="radio" aria-checked="false" tabindex="-1" aria-label="4 stars"></span>
  <span class="nb-rating-item" data-nb-rating-item data-value="5" role="radio" aria-checked="false" tabindex="-1" aria-label="5 stars"></span>
</div>
```

---

## DOM Contract

### Recommended Structure (Read-only)

```html
<div class="nb-rating nb-rating-readonly" role="img" aria-label="Rating: 3.5 out of 5">
  <span class="nb-rating-item nb-rating-item-filled nb-rating-warning" aria-hidden="true"></span>
  <span class="nb-rating-item nb-rating-item-filled nb-rating-warning" aria-hidden="true"></span>
  <span class="nb-rating-item nb-rating-item-filled nb-rating-warning" aria-hidden="true"></span>
  <span class="nb-rating-item nb-rating-item-half nb-rating-warning" aria-hidden="true"></span>
  <span class="nb-rating-item nb-rating-warning" aria-hidden="true"></span>
</div>
```

### Recommended Structure (Interactive)

```html
<div class="nb-rating nb-rating-interactive nb-rating-primary" data-nb-rating role="radiogroup" aria-label="Rate this product">
  <span class="nb-rating-item" data-nb-rating-item data-value="1" role="radio" aria-checked="false" tabindex="0" aria-label="1 star"></span>
  <span class="nb-rating-item" data-nb-rating-item data-value="2" role="radio" aria-checked="false" tabindex="-1" aria-label="2 stars"></span>
  <span class="nb-rating-item" data-nb-rating-item data-value="3" role="radio" aria-checked="false" tabindex="-1" aria-label="3 stars"></span>
  <span class="nb-rating-item" data-nb-rating-item data-value="4" role="radio" aria-checked="false" tabindex="-1" aria-label="4 stars"></span>
  <span class="nb-rating-item" data-nb-rating-item data-value="5" role="radio" aria-checked="false" tabindex="-1" aria-label="5 stars"></span>
</div>
```

### Semantic Element

- **Read-only**: Use a `<div>` or `<span>` with `role="img"` and a concise `aria-label` describing the rating value.
- **Interactive**: Use a `<div>` or `<span>` with `data-nb-rating`, `role="radiogroup"`, and `aria-label`. Individual stars use `data-nb-rating-item`, `data-value`, `role="radio"`, `aria-checked`, `tabindex`, and `aria-label`.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `role` | Recommended | `"img"` or `"radiogroup"` | Exposes the rating as an image or interactive radio group. |
| `aria-label` | Recommended | Descriptive text | Required when no visible label is present. |
| `aria-hidden` | Recommended | `"true"` | Use on decorative star icons in read-only mode. |
| `data-nb-rating-item` | Yes (interactive items) | empty | Lets `createRating()` discover rating items. |
| `data-value` | Yes (interactive items) | numeric value | Defines the value selected by each item. |
| `aria-checked` | Yes (interactive items) | `"true"` / `"false"` | Mirrors the selected value. |
| `tabindex` | Yes (interactive items) | `"0"` / `"-1"` | Supports roving focus. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `role="img"` | Read-only rating to expose the visual value as a single image. |
| `role="radiogroup"` | Interactive rating to group radio-like star items. |
| `aria-label` | On the root to describe the rating purpose or value. |
| `aria-label` | On each interactive star item to label its value. |
| `aria-checked` | On each interactive star item to expose selection state. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus into/out of the interactive rating group. |
| `ArrowLeft` / `ArrowRight` | Changes the selected value. |
| `ArrowUp` / `ArrowDown` | Changes the selected value. |
| `Home` / `End` | Moves to the minimum / maximum value. |
| `Enter` / `Space` | Selects the focused star value. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ (interactive) | `.nb-rating-interactive .nb-rating-item:hover` | Hovered star and preceding stars fill with `--_star-color`; hovered star scales to `1.15`. |
| **active** | ✅ (interactive) | `.nb-rating-interactive .nb-rating-item:active` | Star scales down to `0.95`. |
| **focus-visible** | ✅ (interactive) | `.nb-rating-interactive .nb-rating-item:focus-visible` | `outline: 2px solid var(--nb-focus); outline-offset: 2px; border-radius: var(--nb-radius-box);` |
| **disabled** | — N/A | — | No explicit disabled state in current CSS. Use `disabled` on interactive buttons if implemented in JS. |
| **filled** | ✅ | `.nb-rating-item-filled` | Item color changes to `--_star-color`. |
| **half-filled** | ✅ | `.nb-rating-item-half` | Left half of the star uses `--_star-color` via `clip-path`. |
| **read-only** | ✅ | `.nb-rating-readonly .nb-rating-item` | `cursor: default`. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

Rating uses an inline flex container with a gap between stars. Each star is sized with a private `--_star-size` custom property that changes with size variants. Hover interactions use the general sibling combinator to fill preceding stars.

```css
.nb-rating-interactive:hover .nb-rating-item {
  color: var(--_star-empty);
}

.nb-rating-interactive .nb-rating-item:hover,
.nb-rating-interactive .nb-rating-item:hover ~ .nb-rating-item {
  color: var(--_star-color);
}
```

Half-filled stars render a second glyph layered with `clip-path: inset(0 50% 0 0)`.

`createRating()` manages `.nb-rating-item-filled`, `.nb-rating-item-half`, roving `tabindex`, `aria-checked`, pointer selection, keyboard selection, optional half values, and `onChange` callbacks.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-rating-item {
    transition: none;
  }
}
```

### RTL

Uses logical properties (`margin-inline-start`, `inline-size`); no special RTL overrides needed.

---

## Examples

### Read-only Rating

```html
<div class="nb-rating nb-rating-readonly" role="img" aria-label="Rating: 4 out of 5">
  <span class="nb-rating-item nb-rating-item-filled nb-rating-warning" aria-hidden="true"></span>
  <span class="nb-rating-item nb-rating-item-filled nb-rating-warning" aria-hidden="true"></span>
  <span class="nb-rating-item nb-rating-item-filled nb-rating-warning" aria-hidden="true"></span>
  <span class="nb-rating-item nb-rating-item-filled nb-rating-warning" aria-hidden="true"></span>
  <span class="nb-rating-item nb-rating-warning" aria-hidden="true"></span>
</div>
```

### Half-star Rating

```html
<div class="nb-rating nb-rating-readonly nb-rating-lg" role="img" aria-label="Rating: 2.5 out of 5">
  <span class="nb-rating-item nb-rating-item-filled nb-rating-accent" aria-hidden="true"></span>
  <span class="nb-rating-item nb-rating-item-filled nb-rating-accent" aria-hidden="true"></span>
  <span class="nb-rating-item nb-rating-item-half nb-rating-accent" aria-hidden="true"></span>
  <span class="nb-rating-item nb-rating-accent" aria-hidden="true"></span>
  <span class="nb-rating-item nb-rating-accent" aria-hidden="true"></span>
</div>
```

### Interactive Rating

```html
<div class="nb-rating nb-rating-interactive nb-rating-primary" data-nb-rating role="radiogroup" aria-label="Rate this product">
  <span class="nb-rating-item" data-nb-rating-item data-value="1" role="radio" aria-checked="false" tabindex="0" aria-label="1 star"></span>
  <span class="nb-rating-item" data-nb-rating-item data-value="2" role="radio" aria-checked="false" tabindex="-1" aria-label="2 stars"></span>
  <span class="nb-rating-item" data-nb-rating-item data-value="3" role="radio" aria-checked="false" tabindex="-1" aria-label="3 stars"></span>
  <span class="nb-rating-item" data-nb-rating-item data-value="4" role="radio" aria-checked="false" tabindex="-1" aria-label="4 stars"></span>
  <span class="nb-rating-item" data-nb-rating-item data-value="5" role="radio" aria-checked="false" tabindex="-1" aria-label="5 stars"></span>
</div>
```

### Size Variants

```html
<div class="nb-rating nb-rating-readonly nb-rating-sm">...</div>
<div class="nb-rating nb-rating-readonly nb-rating-lg">...</div>
<div class="nb-rating nb-rating-readonly nb-rating-xl">...</div>
```

### With Caption

```html
<div style="display: inline-flex; align-items: center;">
  <div class="nb-rating nb-rating-readonly nb-rating-sm" role="img" aria-label="Rating: 3 out of 5">
    <span class="nb-rating-item nb-rating-item-filled nb-rating-primary" aria-hidden="true"></span>
    <span class="nb-rating-item nb-rating-item-filled nb-rating-primary" aria-hidden="true"></span>
    <span class="nb-rating-item nb-rating-item-filled nb-rating-primary" aria-hidden="true"></span>
    <span class="nb-rating-item nb-rating-primary" aria-hidden="true"></span>
    <span class="nb-rating-item nb-rating-primary" aria-hidden="true"></span>
  </div>
  <span class="nb-rating-caption">3.0</span>
</div>
```
