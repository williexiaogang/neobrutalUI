# Feature Grid API

> **Component**: Feature Grid  
> **Category**: Layout  
> **Base class**: `.nb-feature-grid`  
> **Status**: Ready

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-feature-grid` | Component | Base grid container. Required. |
| `.nb-feature-grid-item` | Component | Individual feature card inside the grid. |
| `.nb-feature-grid-icon` | Part | Icon box with accent background and border. |
| `.nb-feature-grid-title` | Part | Feature title. |
| `.nb-feature-grid-description` | Part | Feature description. |
| `.nb-feature-grid-cols-2` | Layout | 2-column grid. |
| `.nb-feature-grid-cols-3` | Layout | 3-column grid. |
| `.nb-feature-grid-cols-4` | Layout | 4-column grid. |
| `.nb-feature-grid-primary` | Color | Uses `--nb-primary` as accent. |
| `.nb-feature-grid-secondary` | Color | Uses `--nb-secondary` as accent. |
| `.nb-feature-grid-accent` | Color | Uses `--nb-accent` as accent. |
| `.nb-feature-grid-neutral` | Color | Uses `--nb-neutral` as accent. |
| `.nb-feature-grid-sm` | Size | Smaller padding, icon, and type scale. |
| `.nb-feature-grid-lg` | Size | Larger padding, icon, and type scale. |
| `.nb-feature-grid-gap-sm` | Layout | Smaller grid gap. |
| `.nb-feature-grid-gap-lg` | Layout | Larger grid gap. |

### Class Combination Examples

```html
<div class="nb-feature-grid nb-feature-grid-cols-3 nb-feature-grid-primary">
  <div class="nb-feature-grid-item">
    <div class="nb-feature-grid-icon" aria-hidden="true">⚡</div>
    <div class="nb-feature-grid-title">Lightning Fast</div>
    <div class="nb-feature-grid-description">Optimized for speed.</div>
  </div>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-feature-grid nb-feature-grid-cols-3 nb-feature-grid-primary">
  <article class="nb-feature-grid-item">
    <div class="nb-feature-grid-icon" aria-hidden="true">⚡</div>
    <h3 class="nb-feature-grid-title">Lightning Fast</h3>
    <p class="nb-feature-grid-description">Optimized for speed with zero runtime overhead.</p>
  </article>
  <!-- more items -->
</div>
```

### Semantic Element

- **Preferred**: `<section>` for the grid wrapper and `<article>` for each item.
- **Heading level**: Use the appropriate heading level for `.nb-feature-grid-title`.

### Part Usage Rules

| Part | Required? | Notes |
|------|-----------|-------|
| `.nb-feature-grid-item` | Yes | Each feature must be wrapped in this class. |
| `.nb-feature-grid-icon` | No | Decorative icon area; use `aria-hidden="true"` when decorative. |
| `.nb-feature-grid-title` | Recommended | Provides the accessible name for the item. |
| `.nb-feature-grid-description` | No | Optional supporting text. |

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `aria-hidden` | Recommended (icon) | `"true"` | On `.nb-feature-grid-icon` when the icon is decorative. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-hidden="true"` | On `.nb-feature-grid-icon` when it is decorative. |
| `aria-labelledby` | On `.nb-feature-grid-item` to reference the title ID. |

### Keyboard Behavior

Feature Grid is a **non-interactive container**. Keyboard navigation flows through any interactive children inside feature items.

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ | `.nb-feature-grid-item:hover` | Shadow elevates to `--nb-shadow-md`, item translates `(-2px, -2px)`. |
| **active** | ✅ (implicit) | `:active` | No explicit active styles; browser default applies. |
| **focus-visible** | — N/A | — | Grid items are not focusable by default. |
| **disabled** | — N/A | — | Feature Grid is not an interactive element. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

```css
.nb-feature-grid {
  --_grid-cols: 1;
  --_gap: var(--nb-space-4);
  --_item-bg: var(--nb-base-100);
  --_item-border: var(--nb-border);
  --_item-shadow: var(--nb-shadow-sm);
  --_accent: var(--nb-primary);

  display: grid;
  grid-template-columns: repeat(var(--_grid-cols), minmax(0, 1fr));
  gap: var(--_gap);
  inline-size: 100%;
}

.nb-feature-grid-item {
  display: flex;
  flex-direction: column;
  gap: var(--nb-space-3);
  padding: var(--nb-space-4);
  border: var(--nb-border-width) solid var(--_item-border);
  border-radius: var(--nb-radius-box);
  background: var(--_item-bg);
  box-shadow: var(--_item-shadow);
  transform: translate(0, 0);
  transition: transform var(--nb-duration-fast) var(--nb-ease-out),
    box-shadow var(--nb-duration-fast) var(--nb-ease-out);
}

.nb-feature-grid-item:hover {
  box-shadow: var(--nb-shadow-md);
  transform: translate(-2px, -2px);
}
```

Column classes are responsive: 2/3/4-column grids collapse to 1 column below `768px`, and 3/4-column grids collapse to 2 columns between `769px` and `1024px`.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-feature-grid-item {
    transition: none;
  }
}
```

### RTL

Uses logical properties and grid layout; no special RTL overrides needed.

### Forced Colors

```css
@media (forced-colors: active) {
  .nb-feature-grid-item {
    border: 2px solid CanvasText;
    forced-color-adjust: none;
  }

  .nb-feature-grid-icon {
    border: 2px solid CanvasText;
    background: CanvasText;
    color: Canvas;
  }
}
```

---

## Examples

### 3-Column Feature Grid

```html
<section class="nb-feature-grid nb-feature-grid-cols-3 nb-feature-grid-primary">
  <article class="nb-feature-grid-item">
    <div class="nb-feature-grid-icon" aria-hidden="true">⚡</div>
    <h3 class="nb-feature-grid-title">Lightning Fast</h3>
    <p class="nb-feature-grid-description">Optimized for speed with zero runtime overhead.</p>
  </article>
  <article class="nb-feature-grid-item">
    <div class="nb-feature-grid-icon" aria-hidden="true">🎨</div>
    <h3 class="nb-feature-grid-title">Bold Design</h3>
    <p class="nb-feature-grid-description">High-contrast neo-brutalist visuals.</p>
  </article>
  <article class="nb-feature-grid-item">
    <div class="nb-feature-grid-icon" aria-hidden="true">♿</div>
    <h3 class="nb-feature-grid-title">Accessible</h3>
    <p class="nb-feature-grid-description">WCAG compliant with keyboard navigation.</p>
  </article>
</section>
```

### 2-Column Large Accent Grid

```html
<section class="nb-feature-grid nb-feature-grid-cols-2 nb-feature-grid-lg nb-feature-grid-accent nb-feature-grid-gap-lg">
  <article class="nb-feature-grid-item">
    <div class="nb-feature-grid-icon" aria-hidden="true">🔒</div>
    <h3 class="nb-feature-grid-title">Enterprise Security</h3>
    <p class="nb-feature-grid-description">SOC 2 Type II certified infrastructure.</p>
  </article>
  <article class="nb-feature-grid-item">
    <div class="nb-feature-grid-icon" aria-hidden="true">📊</div>
    <h3 class="nb-feature-grid-title">Real-time Analytics</h3>
    <p class="nb-feature-grid-description">Live dashboards and event streams.</p>
  </article>
</section>
```

### 4-Column Compact Neutral Grid

```html
<section class="nb-feature-grid nb-feature-grid-cols-4 nb-feature-grid-sm nb-feature-grid-neutral nb-feature-grid-gap-sm">
  <article class="nb-feature-grid-item">
    <div class="nb-feature-grid-icon" aria-hidden="true">🚀</div>
    <h3 class="nb-feature-grid-title">Deploy</h3>
    <p class="nb-feature-grid-description">One-click deploy to any edge network.</p>
  </article>
  <!-- more items -->
</section>
```
