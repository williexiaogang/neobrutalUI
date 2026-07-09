# Pagination API

> **Component**: Pagination  
> **Category**: Navigation  
> **Base class**: `.nb-pagination`  
> **Status**: Ready (numbered pages, previous/next, active, disabled, size variants, reduced-motion, and forced-colors support included)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-pagination` | Component | Outer pagination wrapper. Required. |
| `.nb-pagination-list` | Component | List (`<ul>`) of pagination items. |
| `.nb-pagination-item` | Part | Individual list item. |
| `.nb-pagination-link` | Part | Numbered page control. |
| `.nb-pagination-prev` | Part | Previous-page control. |
| `.nb-pagination-next` | Part | Next-page control. |
| `.nb-pagination-active` | State | Marks the current page. |
| `.nb-pagination-disabled` | State | Dims and disables a control. |
| `.nb-pagination-ellipsis` | Part | Non-interactive ellipsis between page ranges. |
| `.nb-pagination-sm` | Size | Smaller pagination controls. |
| `.nb-pagination-lg` | Size | Larger pagination controls. |

### Class Combination Examples

```html
<!-- Basic pagination -->
<nav class="nb-pagination" aria-label="Pagination">
  <ul class="nb-pagination-list">
    <li class="nb-pagination-item">
      <a href="#" class="nb-pagination-prev" aria-disabled="true">&larr;</a>
    </li>
    <li class="nb-pagination-item">
      <a href="#" class="nb-pagination-link nb-pagination-active" aria-current="page">1</a>
    </li>
    <li class="nb-pagination-item">
      <a href="#" class="nb-pagination-link">2</a>
    </li>
    <li class="nb-pagination-item">
      <a href="#" class="nb-pagination-link">3</a>
    </li>
    <li class="nb-pagination-item">
      <span class="nb-pagination-ellipsis">&hellip;</span>
    </li>
    <li class="nb-pagination-item">
      <a href="#" class="nb-pagination-link">10</a>
    </li>
    <li class="nb-pagination-item">
      <a href="#" class="nb-pagination-next">&rarr;</a>
    </li>
  </ul>
</nav>

<!-- Small size -->
<nav class="nb-pagination nb-pagination-sm" aria-label="Small pagination">
  <ul class="nb-pagination-list">
    <li class="nb-pagination-item"><a href="#" class="nb-pagination-link nb-pagination-active" aria-current="page">1</a></li>
    <li class="nb-pagination-item"><a href="#" class="nb-pagination-link">2</a></li>
    <li class="nb-pagination-item"><a href="#" class="nb-pagination-link">3</a></li>
  </ul>
</nav>
```

---

## DOM Contract

### Recommended Structure

```html
<nav class="nb-pagination" aria-label="Pagination">
  <ul class="nb-pagination-list">
    <li class="nb-pagination-item">
      <a href="#" class="nb-pagination-prev" aria-disabled="true">Previous</a>
    </li>
    <li class="nb-pagination-item">
      <a href="#" class="nb-pagination-link nb-pagination-active" aria-current="page">1</a>
    </li>
    <li class="nb-pagination-item">
      <a href="#" class="nb-pagination-link">2</a>
    </li>
    <li class="nb-pagination-item">
      <span class="nb-pagination-ellipsis">&hellip;</span>
    </li>
    <li class="nb-pagination-item">
      <a href="#" class="nb-pagination-next">Next</a>
    </li>
  </ul>
</nav>
```

### Semantic Element

- **Preferred**: `<nav>` with `aria-label` around the pagination list.
- **List**: Use `<ul>` / `<li>` for page items.
- **Controls**: Use `<a>` for navigable pages or `<button>` for JS-driven pagination.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `aria-label` | Recommended | Description such as `"Pagination"` | Names the navigation landmark. |
| `aria-current="page"` | Recommended | `"page"` | Marks the active page. |
| `aria-disabled="true"` | Recommended | `"true"` | Disables previous/next controls at boundaries. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-label` | On `<nav>` to describe the pagination region. |
| `aria-current="page"` | On the active page control. |
| `aria-disabled="true"` | On prev/next or page controls that are not available. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus through available page controls. |
| `Enter` | Activates the focused page link or button. |
| `Space` | Activates button-based page controls. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ | `.nb-pagination-link:hover:not(:disabled):not(.nb-pagination-active)` | Shadow elevates to `--nb-shadow-md`, translate shifts `(-2px, -2px)`. |
| **hover** | ✅ | `.nb-pagination-prev:hover:not([aria-disabled="true"])`, `.nb-pagination-next:hover:not([aria-disabled="true"])` | Same shadow/transform elevation as page links. |
| **active** | ✅ | `.nb-pagination-link:active:not(:disabled):not(.nb-pagination-active)` | Shadow drops to `--nb-shadow-xs`, translate shifts `(2px, 2px)`. |
| **active** | ✅ | `.nb-pagination-prev:active:not([aria-disabled="true"])`, `.nb-pagination-next:active:not([aria-disabled="true"])` | Same pressed shadow/transform as page links. |
| **focus-visible** | ✅ | `.nb-pagination-link:focus-visible`, `.nb-pagination-prev:focus-visible`, `.nb-pagination-next:focus-visible` | `outline: 2px solid var(--nb-focus)` with 2px offset. |
| **disabled** | ✅ | `.nb-pagination-prev[aria-disabled="true"]`, `.nb-pagination-next[aria-disabled="true"]`, `.nb-pagination-disabled` | `opacity: 0.5`, `cursor: not-allowed`, shadow drops to `--nb-shadow-xs`, translate shifts `(2px, 2px)`. |
| **selected** | ✅ | `.nb-pagination-active` | Background changes to `var(--nb-primary)`, text to `var(--nb-primary-content)`, shadow set to `--nb-shadow-md`. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

- Pagination items lay out horizontally with Flexbox and wrap as needed.
- Page controls use the standard interactive surface shadow/transform pattern.
- Active pages are filled with the primary color and do not respond to hover/active transforms.
- Disabled controls visually match the pressed position.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-pagination-link,
  .nb-pagination-prev,
  .nb-pagination-next {
    transition: none;
  }
}
```

### RTL

Uses logical properties (`min-inline-size`, `min-block-size`, etc.); no special RTL overrides needed.

---

## Examples

### Basic Pagination

```html
<nav class="nb-pagination" aria-label="Pagination">
  <ul class="nb-pagination-list">
    <li class="nb-pagination-item">
      <a href="#" class="nb-pagination-prev" aria-disabled="true">&larr;</a>
    </li>
    <li class="nb-pagination-item">
      <a href="#" class="nb-pagination-link nb-pagination-active" aria-current="page">1</a>
    </li>
    <li class="nb-pagination-item">
      <a href="#" class="nb-pagination-link">2</a>
    </li>
    <li class="nb-pagination-item">
      <a href="#" class="nb-pagination-link">3</a>
    </li>
    <li class="nb-pagination-item">
      <span class="nb-pagination-ellipsis">&hellip;</span>
    </li>
    <li class="nb-pagination-item">
      <a href="#" class="nb-pagination-link">10</a>
    </li>
    <li class="nb-pagination-item">
      <a href="#" class="nb-pagination-next">&rarr;</a>
    </li>
  </ul>
</nav>
```

### Size Variants

```html
<nav class="nb-pagination nb-pagination-sm" aria-label="Small pagination">
  <ul class="nb-pagination-list">
    <li class="nb-pagination-item"><a href="#" class="nb-pagination-link nb-pagination-active" aria-current="page">1</a></li>
    <li class="nb-pagination-item"><a href="#" class="nb-pagination-link">2</a></li>
    <li class="nb-pagination-item"><a href="#" class="nb-pagination-link">3</a></li>
  </ul>
</nav>

<nav class="nb-pagination nb-pagination-lg" aria-label="Large pagination">
  <ul class="nb-pagination-list">
    <li class="nb-pagination-item"><a href="#" class="nb-pagination-link nb-pagination-active" aria-current="page">1</a></li>
    <li class="nb-pagination-item"><a href="#" class="nb-pagination-link">2</a></li>
    <li class="nb-pagination-item"><a href="#" class="nb-pagination-link">3</a></li>
  </ul>
</nav>
```

### Disabled / Active / Ellipsis

```html
<nav class="nb-pagination" aria-label="Pagination states">
  <ul class="nb-pagination-list">
    <li class="nb-pagination-item">
      <a href="#" class="nb-pagination-prev" aria-disabled="true">&larr;</a>
    </li>
    <li class="nb-pagination-item"><a href="#" class="nb-pagination-link">1</a></li>
    <li class="nb-pagination-item"><span class="nb-pagination-ellipsis">&hellip;</span></li>
    <li class="nb-pagination-item"><a href="#" class="nb-pagination-link nb-pagination-active" aria-current="page">6</a></li>
    <li class="nb-pagination-item"><a href="#" class="nb-pagination-link">7</a></li>
    <li class="nb-pagination-item"><span class="nb-pagination-ellipsis">&hellip;</span></li>
    <li class="nb-pagination-item"><a href="#" class="nb-pagination-link">12</a></li>
    <li class="nb-pagination-item"><a href="#" class="nb-pagination-next">&rarr;</a></li>
  </ul>
</nav>
```

