# Loading API

> **Component**: Loading  
> **Category**: Feedback  
> **Base class**: `.nb-loading`  
> **Status**: Ready

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-loading` | Component | Base spinner. A `1.5rem` circle with a partial primary border and infinite rotation. |

### Class Combination Examples

```html
<!-- Standalone spinner -->
<span class="nb-loading" aria-label="Loading"></span>

<!-- Inline spinner inside a button -->
<button class="nb-btn nb-btn-primary" type="button" disabled>
  <span class="nb-loading" aria-hidden="true" style="inline-size: 1rem; block-size: 1rem; border-width: 2px;"></span>
  Saving
</button>
```

---

## DOM Contract

### Recommended Structure

```html
<span class="nb-loading" aria-label="Loading"></span>
```

### Semantic Element

- **Preferred**: `<span>` with an accessible label.
- **Inside buttons**: Use `aria-hidden="true"` on the spinner and `aria-busy="true"` + `disabled` on the button to avoid duplicate announcements.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `aria-label` / `aria-labelledby` | Recommended | Accessible name | Provides an accessible name for the loading indicator. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-label="Loading"` | For standalone spinners. |
| `aria-hidden="true"` | When the spinner is decorative (e.g., inside a button that already announces its busy state). |
| `aria-busy="true"` | On a parent region or button while content is loading. |
| `role="status"` | On a wrapper when the loading state should be announced as a status update. |

### Screen-reader Strategy

Standalone spinners should carry an accessible name via `aria-label` or `aria-labelledby`. When the loading state represents a page-level or region-level update, wrap the spinner and descriptive text in a live region so screen readers announce the change:

```html
<div role="status" aria-live="polite" aria-label="Loading results">
  <span class="nb-loading" aria-hidden="true"></span>
  <span>Loading results…</span>
</div>
```

### Keyboard Behavior

Loading is a **non-interactive visual indicator**. It is not focusable. When paired with a button, that button should be `disabled` and use `aria-busy="true"`.

### Size Variants

The core CSS currently ships with a single base spinner size (`1.5rem`). Additional sizes are not implemented as modifier classes; use inline `inline-size`, `block-size`, and `border-width` styles for custom dimensions (see the inline-button example above).

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | — N/A | — | Loading is not interactive; hover state is not applicable. |
| **active** | — N/A | — | Loading is not interactive; active state is not applicable. |
| **focus-visible** | — N/A | — | Loading is not focusable by default. |
| **disabled** | — N/A | — | Loading is not an interactive element. |
| **reduced-motion** | ✅ | `@media (prefers-reduced-motion: reduce)` | Animation removed; spinner becomes a dashed ring. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

```css
.nb-loading {
  display: inline-block;
  inline-size: 1.5rem;
  block-size: 1.5rem;
  border: 3px solid var(--nb-base-300);
  border-block-start-color: var(--nb-primary);
  border-radius: 50%;
  animation: nb-spin 0.8s linear infinite;
}

@keyframes nb-spin {
  to {
    transform: rotate(360deg);
  }
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-loading {
    animation: none;
    border: 3px dashed var(--nb-primary);
  }
}
```

### RTL

Spinner rotation is direction-neutral; no special RTL overrides needed.

### Forced Colors

```css
@media (forced-colors: active) {
  .nb-loading {
    border-color: CanvasText;
    border-block-start-color: Highlight;
  }
}
```

---

## Examples

### Standalone Spinner

```html
<span class="nb-loading" aria-label="Loading content"></span>
```

### Spinner Inside a Button

```html
<button class="nb-btn nb-btn-primary" type="button" disabled aria-busy="true">
  <span class="nb-loading" aria-hidden="true" style="inline-size: 1rem; block-size: 1rem; border-width: 2px;"></span>
  Saving
</button>
```

### Loading Region

```html
<div role="status" aria-live="polite" aria-label="Loading results">
  <span class="nb-loading" aria-hidden="true"></span>
  <span>Loading results…</span>
</div>
```
