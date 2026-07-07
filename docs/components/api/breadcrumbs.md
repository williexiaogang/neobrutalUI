# Breadcrumbs API

> **Component**: Breadcrumbs  
> **Category**: Navigation  
> **Base class**: `.nb-breadcrumb`  
> **Status**: Beta (CSS visual layer implemented; reduced-motion and forced-colors support included)

> **Note**: The catalog slug is `breadcrumbs`, while the CSS source file is named `breadcrumb.css`.

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-breadcrumb` | Component | Outer breadcrumb wrapper. Required. |
| `.nb-breadcrumb-list` | Component | Ordered list (`<ol>`) of breadcrumb items. |
| `.nb-breadcrumb-item` | Part | Individual list item containing a link, current text, or separator. |
| `.nb-breadcrumb-link` | Part | Anchor for ancestor pages. |
| `.nb-breadcrumb-current` | State | Text for the current page. |
| `.nb-breadcrumb-separator` | Part | Visual separator between breadcrumb items. |
| `.nb-breadcrumb-collapsed` | Variant | Collapses middle items on small screens. |
| `.nb-breadcrumb-separator-wrap` | Part | Helper class to keep separators visible in collapsed mode. |

### Class Combination Examples

```html
<!-- Standard breadcrumb -->
<nav aria-label="Breadcrumb" class="nb-breadcrumb">
  <ol class="nb-breadcrumb-list">
    <li class="nb-breadcrumb-item">
      <a href="#" class="nb-breadcrumb-link">Home</a>
      <span class="nb-breadcrumb-separator" aria-hidden="true">/</span>
    </li>
    <li class="nb-breadcrumb-item">
      <a href="#" class="nb-breadcrumb-link">Products</a>
      <span class="nb-breadcrumb-separator" aria-hidden="true">/</span>
    </li>
    <li class="nb-breadcrumb-item">
      <span class="nb-breadcrumb-current" aria-current="page">Laptops</span>
    </li>
  </ol>
</nav>

<!-- Collapsed breadcrumb (mobile) -->
<nav aria-label="Breadcrumb" class="nb-breadcrumb nb-breadcrumb-collapsed">
  <ol class="nb-breadcrumb-list">
    <li class="nb-breadcrumb-item">
      <a href="#" class="nb-breadcrumb-link">Home</a>
    </li>
    <li class="nb-breadcrumb-item nb-breadcrumb-separator-wrap">
      <span class="nb-breadcrumb-separator" aria-hidden="true">/</span>
    </li>
    <li class="nb-breadcrumb-item">
      <a href="#" class="nb-breadcrumb-link">Products</a>
    </li>
    <li class="nb-breadcrumb-item nb-breadcrumb-separator-wrap">
      <span class="nb-breadcrumb-separator" aria-hidden="true">/</span>
    </li>
    <li class="nb-breadcrumb-item">
      <span class="nb-breadcrumb-current" aria-current="page">Laptops</span>
    </li>
  </ol>
</nav>
```

---

## DOM Contract

### Recommended Structure

```html
<nav aria-label="Breadcrumb" class="nb-breadcrumb">
  <ol class="nb-breadcrumb-list">
    <li class="nb-breadcrumb-item">
      <a href="#" class="nb-breadcrumb-link">Home</a>
      <span class="nb-breadcrumb-separator" aria-hidden="true">/</span>
    </li>
    <li class="nb-breadcrumb-item">
      <a href="#" class="nb-breadcrumb-link">Products</a>
      <span class="nb-breadcrumb-separator" aria-hidden="true">/</span>
    </li>
    <li class="nb-breadcrumb-item">
      <span class="nb-breadcrumb-current" aria-current="page">Laptops</span>
    </li>
  </ol>
</nav>
```

### Semantic Element

- **Preferred**: `<nav>` with `aria-label="Breadcrumb"`.
- **List**: Use `<ol>` to communicate hierarchy.
- **Items**: Use `<li>` for each crumb.
- **Current page**: Use a `<span>` with `aria-current="page"` rather than a link.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `aria-label` | Recommended | `"Breadcrumb"` | Identifies the navigation landmark. |
| `aria-current="page"` | Recommended | `"page"` | Marks the current page crumb. |
| `aria-hidden="true"` | Recommended | `"true"` | Hide purely visual separators from assistive tech. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-label` | On `<nav>` to name the breadcrumb landmark. |
| `aria-current="page"` | On the current page element. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus between breadcrumb links. The current page span is not focusable. |
| `Enter` | Activates the focused link. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ | `.nb-breadcrumb-link:hover` | Background changes to `var(--nb-base-200)` and border color changes to `var(--nb-border)`. |
| **active** | ❌ Not styled | — | No explicit `:active` styles. |
| **focus-visible** | ✅ | `.nb-breadcrumb-link:focus-visible` | `outline: 2px solid var(--nb-focus)` with 2px offset. |
| **disabled** | ❌ Not applicable | — | Breadcrumb links do not have a disabled state. |
| **current** | ✅ | `.nb-breadcrumb-current` | Bold text in `var(--nb-base-content)` with no link styling. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

- Breadcrumb items lay out horizontally with Flexbox and wrap on narrow viewports.
- Links have a fast background and border-color transition on hover.
- Separators are non-interactive text elements.
- The collapsed variant hides middle items while preserving separators marked with `.nb-breadcrumb-separator-wrap`.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-breadcrumb-link {
    transition: none;
  }
}
```

### RTL

Uses logical properties and inline layout; no special RTL overrides needed.

---

## Examples

### Basic Breadcrumb

```html
<nav aria-label="Breadcrumb" class="nb-breadcrumb">
  <ol class="nb-breadcrumb-list">
    <li class="nb-breadcrumb-item">
      <a href="#" class="nb-breadcrumb-link">Home</a>
      <span class="nb-breadcrumb-separator" aria-hidden="true">/</span>
    </li>
    <li class="nb-breadcrumb-item">
      <a href="#" class="nb-breadcrumb-link">Products</a>
      <span class="nb-breadcrumb-separator" aria-hidden="true">/</span>
    </li>
    <li class="nb-breadcrumb-item">
      <span class="nb-breadcrumb-current" aria-current="page">Laptops</span>
    </li>
  </ol>
</nav>
```

### Custom Separator

```html
<nav aria-label="Breadcrumb" class="nb-breadcrumb">
  <ol class="nb-breadcrumb-list">
    <li class="nb-breadcrumb-item">
      <a href="#" class="nb-breadcrumb-link">User</a>
      <span class="nb-breadcrumb-separator" aria-hidden="true">&gt;</span>
    </li>
    <li class="nb-breadcrumb-item">
      <a href="#" class="nb-breadcrumb-link">Profile</a>
      <span class="nb-breadcrumb-separator" aria-hidden="true">&gt;</span>
    </li>
    <li class="nb-breadcrumb-item">
      <span class="nb-breadcrumb-current" aria-current="page">Settings</span>
    </li>
  </ol>
</nav>
```

### Collapsed Mobile Breadcrumb

```html
<nav aria-label="Breadcrumb" class="nb-breadcrumb nb-breadcrumb-collapsed">
  <ol class="nb-breadcrumb-list">
    <li class="nb-breadcrumb-item">
      <a href="#" class="nb-breadcrumb-link">Home</a>
    </li>
    <li class="nb-breadcrumb-item nb-breadcrumb-separator-wrap">
      <span class="nb-breadcrumb-separator" aria-hidden="true">/</span>
    </li>
    <li class="nb-breadcrumb-item">
      <a href="#" class="nb-breadcrumb-link">Products</a>
    </li>
    <li class="nb-breadcrumb-item nb-breadcrumb-separator-wrap">
      <span class="nb-breadcrumb-separator" aria-hidden="true">/</span>
    </li>
    <li class="nb-breadcrumb-item">
      <span class="nb-breadcrumb-current" aria-current="page">Laptops</span>
    </li>
  </ol>
</nav>
```

