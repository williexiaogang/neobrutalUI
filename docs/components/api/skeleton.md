# Skeleton API

> **Component**: Skeleton  
> **Category**: Feedback  
> **Base class**: `.nb-skeleton`  
> **Status**: In Progress (base pulse animation and reduced-motion fallback implemented; avatar and card skeleton patterns in progress)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-skeleton` | Component | Base skeleton block. Required. |
| `.nb-skeleton-wave` | Variant | Wave/shimmer animation instead of the default pulse. |
| `.nb-skeleton-circle` | Shape | Circular skeleton (avatar placeholder). |
| `.nb-skeleton-text` | Shape | Text-line skeleton with default height. |
| `.nb-skeleton-image` | Shape | 16:9 image placeholder. |
| `.nb-skeleton-card` | Shape | Card-shaped placeholder with border. |
| `.nb-skeleton-button` | Shape | Button-shaped placeholder with border. |
| `.nb-skeleton-xs` | Size | Extra-small height (`0.5rem`). |
| `.nb-skeleton-sm` | Size | Small height (`0.75rem`). |
| `.nb-skeleton-md` | Size | Medium height (`1rem`). |
| `.nb-skeleton-lg` | Size | Large height (`1.25rem`). |
| `.nb-skeleton-xl` | Size | Extra-large height (`1.5rem`). |
| `.nb-skeleton-text-1` | Layout | Text line at `100%` width. |
| `.nb-skeleton-text-2` | Layout | Text line at `75%` width. |
| `.nb-skeleton-text-3` | Layout | Text line at `50%` width. |
| `.nb-skeleton-text-4` | Layout | Text line at `25%` width. |
| `.nb-skeleton-group` | Layout | Vertical stack of skeleton items. |
| `.nb-skeleton-group-horizontal` | Layout | Horizontal row of skeleton items. |

### Class Combination Examples

```html
<!-- Text lines -->
<span class="nb-skeleton" style="inline-size: 60%; block-size: 1.25rem;"></span>
<span class="nb-skeleton nb-skeleton-text nb-skeleton-text-2"></span>

<!-- Avatar + text group -->
<div class="nb-skeleton-group-horizontal">
  <span class="nb-skeleton nb-skeleton-circle"></span>
  <div class="nb-skeleton-group">
    <span class="nb-skeleton nb-skeleton-text nb-skeleton-text-1"></span>
    <span class="nb-skeleton nb-skeleton-text nb-skeleton-text-3"></span>
  </div>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-skeleton-group" aria-hidden="true">
  <span class="nb-skeleton nb-skeleton-text nb-skeleton-text-1"></span>
  <span class="nb-skeleton nb-skeleton-text nb-skeleton-text-2"></span>
  <span class="nb-skeleton nb-skeleton-text nb-skeleton-text-3"></span>
</div>
```

### Semantic Element

- **Preferred**: `<span>` or `<div>`. Skeletons are visual placeholders and should generally be hidden from assistive technologies (`aria-hidden="true"`) while the real content loads.
- **Live region**: Wrap the loading area in a parent with `aria-busy="true"` and announce meaningful loading text instead of exposing skeleton shapes.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `aria-hidden` | Recommended | `"true"` | Skeleton shapes are decorative; hide them from screen readers and announce loading state via a live region instead. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-hidden="true"` | On every skeleton element. |
| `aria-busy="true"` | On the parent region that is still loading. |
| `aria-live="polite"` | On a wrapper with descriptive loading text. |

### Keyboard Behavior

Skeleton is a **non-interactive placeholder**. It is not focusable. Keyboard users should land on the loaded content once it replaces the skeleton state.

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | — N/A | — | Skeleton is not interactive; hover state is not applicable. |
| **active** | — N/A | — | Skeleton is not interactive; active state is not applicable. |
| **focus-visible** | — N/A | — | Skeleton is not focusable by default. |
| **disabled** | — N/A | — | Skeleton is not an interactive element. |
| **reduced-motion** | ✅ | `@media (prefers-reduced-motion: reduce)` | Animation removed; solid background only. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

```css
.nb-skeleton {
  display: block;
  inline-size: 100%;
  block-size: 1em;
  border-radius: var(--nb-radius-field);
  background: var(--nb-skeleton-bg);
  animation: nb-skeleton-pulse 1.5s ease-in-out infinite;
}

.nb-skeleton-wave {
  background: linear-gradient(
    90deg,
    var(--nb-skeleton-bg) 25%,
    var(--nb-skeleton-shimmer) 50%,
    var(--nb-skeleton-bg) 75%
  );
  background-size: 200% 100%;
  animation: nb-skeleton-wave 1.5s ease-in-out infinite;
}
```

Shape classes set dimensions and aspect ratios; size classes only adjust `block-size`. Text-width classes control inline size for paragraph placeholders.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-skeleton,
  .nb-skeleton-wave {
    animation: none;
    background: var(--nb-skeleton-bg);
  }
}
```

### RTL

No directional properties; no special RTL overrides needed.

### Forced Colors

```css
@media (forced-colors: active) {
  .nb-skeleton,
  .nb-skeleton-wave {
    background: GrayText;
    border-color: CanvasText;
    forced-color-adjust: none;
  }
}
```

---

## Examples

### Text Lines

```html
<div class="nb-skeleton-group" aria-hidden="true">
  <span class="nb-skeleton nb-skeleton-text nb-skeleton-text-1"></span>
  <span class="nb-skeleton nb-skeleton-text nb-skeleton-text-2"></span>
  <span class="nb-skeleton nb-skeleton-text nb-skeleton-text-3"></span>
</div>
```

### Card Placeholder

```html
<div class="nb-skeleton nb-skeleton-card" aria-hidden="true"></div>
```

### Avatar + Lines

```html
<div class="nb-skeleton-group-horizontal" aria-hidden="true">
  <span class="nb-skeleton nb-skeleton-circle"></span>
  <div class="nb-skeleton-group">
    <span class="nb-skeleton nb-skeleton-text nb-skeleton-text-2 nb-skeleton-lg"></span>
    <span class="nb-skeleton nb-skeleton-text nb-skeleton-text-4 nb-skeleton-sm"></span>
  </div>
</div>
```

### Wave Animation

```html
<span class="nb-skeleton nb-skeleton-wave nb-skeleton-text nb-skeleton-text-1" aria-hidden="true"></span>
```
