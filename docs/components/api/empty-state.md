# Empty State API

> **Component**: Empty State  
> **Category**: Layout  
> **Base class**: `.nb-empty`  
> **Status**: Ready (CSS visual layer, compact and bordered variants, ARIA guidance, and forced-colors support included)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-empty` | Component | Base empty-state container. Required. Centered flex column layout. |
| `.nb-empty-icon` | Part | Icon area. Defaults to a `3rem` muted-colored box. |
| `.nb-empty-title` | Part | Bold title. |
| `.nb-empty-message` | Part | Muted description with a max width of `24rem`. |
| `.nb-empty-action` | Part | Action button area with a small gap and top margin. |
| `.nb-empty-compact` | Variant | Reduces padding, gap, icon size, and font sizes for inline use. |
| `.nb-empty-bordered` | Variant | Adds a border, background, and small shadow. |

### Class Combination Examples

```html
<!-- Default empty state -->
<div class="nb-empty">
  <div class="nb-empty-icon" aria-hidden="true">📭</div>
  <h3 class="nb-empty-title">No messages</h3>
  <p class="nb-empty-message">You're all caught up.</p>
</div>

<!-- Compact bordered empty state -->
<div class="nb-empty nb-empty-compact nb-empty-bordered">
  <div class="nb-empty-icon" aria-hidden="true">🔍</div>
  <h3 class="nb-empty-title">No results</h3>
  <p class="nb-empty-message">Try adjusting your search filters.</p>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-empty">
  <div class="nb-empty-icon" aria-hidden="true">
    <svg><!-- icon --></svg>
  </div>
  <h3 class="nb-empty-title">No photos yet</h3>
  <p class="nb-empty-message">
    Get started by uploading your first image to the gallery.
  </p>
  <div class="nb-empty-action">
    <button class="nb-btn nb-btn-primary" type="button">Upload</button>
    <button class="nb-btn nb-btn-outline" type="button">Browse</button>
  </div>
</div>
```

### Semantic Element

- **Preferred**: `<div>` or `<section>`.
- **Heading level**: Use the appropriate heading level for `.nb-empty-title` based on page outline (`h1`–`h6`).

### Part Usage Rules

| Part | Required? | Notes |
|------|-----------|-------|
| `.nb-empty-icon` | No | Omit if no icon is needed. Mark decorative icons with `aria-hidden="true"`. |
| `.nb-empty-title` | No | Provides the main message; recommended for context. |
| `.nb-empty-message` | No | Provides additional explanation. |
| `.nb-empty-action` | No | Wraps one or more action buttons. Omit if there is no call to action. |

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `aria-hidden` | Recommended (icon) | `"true"` | On the icon when it is decorative. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-hidden="true"` | On `.nb-empty-icon` when the icon is decorative. |
| `role="status"` | On the wrapper when the empty state replaces previously populated content. |

### Keyboard Behavior

Empty State is a **non-interactive container**. Keyboard navigation flows through any action buttons or links inside `.nb-empty-action`.

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | — N/A | — | Empty State is not interactive; hover state is not applicable. |
| **active** | — N/A | — | Empty State is not interactive; active state is not applicable. |
| **focus-visible** | — N/A | — | Empty State is not focusable by default. |
| **disabled** | — N/A | — | Empty State is not an interactive element. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

```css
.nb-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--nb-empty-gap, var(--nb-space-4));
  padding: var(--nb-space-8) var(--nb-space-4);
  text-align: center;
  inline-size: 100%;
}

.nb-empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  inline-size: var(--nb-empty-icon-size, 3rem);
  block-size: var(--nb-empty-icon-size, 3rem);
  color: var(--nb-empty-icon-color, var(--nb-base-content-muted));
}

.nb-empty-bordered {
  border: var(--nb-border-width) solid var(--nb-border);
  background: var(--nb-base-100);
  box-shadow: var(--nb-shadow-sm);
}
```

### Reduced Motion

No transitions or animations; reduced-motion is not applicable.

### RTL

Uses logical properties and centered text alignment; no special RTL overrides needed.

### Forced Colors

```css
@media (forced-colors: active) {
  .nb-empty-bordered {
    border: 2px solid CanvasText;
    forced-color-adjust: none;
  }

  .nb-empty-icon {
    color: CanvasText;
  }
}
```

---

## Examples

### Basic Empty State

```html
<div class="nb-empty">
  <div class="nb-empty-icon" aria-hidden="true">📭</div>
  <h3 class="nb-empty-title">No messages</h3>
  <p class="nb-empty-message">You're all caught up.</p>
</div>
```

### Empty State with Action

```html
<div class="nb-empty">
  <div class="nb-empty-icon" aria-hidden="true">📷</div>
  <h3 class="nb-empty-title">No photos yet</h3>
  <p class="nb-empty-message">Get started by uploading your first image to the gallery.</p>
  <div class="nb-empty-action">
    <button class="nb-btn nb-btn-primary" type="button">Upload</button>
    <button class="nb-btn nb-btn-outline" type="button">Browse</button>
  </div>
</div>
```

### Compact Bordered Empty State

```html
<div class="nb-empty nb-empty-compact nb-empty-bordered">
  <div class="nb-empty-icon" aria-hidden="true">🔍</div>
  <h3 class="nb-empty-title">No results</h3>
  <p class="nb-empty-message">Try adjusting your search filters.</p>
</div>
```

---
