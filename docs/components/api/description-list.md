# Description List API

> **Component**: Description List  
> **Category**: Data Display  
> **Base class**: `.nb-description-list`  
> **Status**: Ready

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-description-list` | Component | Base description list class. Required on `<dl>`. |
| `.nb-description-list-term` | Component / Part | Base class for a term (`<dt>`). |
| `.nb-description-list-description` | Component / Part | Base class for a definition (`<dd>`). |
| `.nb-description-list-horizontal` | Variant / Layout | Two-column grid layout (term / description). |
| `.nb-description-list-bordered` | Variant | Terms and descriptions render as individual bordered cards. |
| `.nb-description-list-divided` | Variant | Thick separators between rows. |
| `.nb-description-list-compact` | Variant | Reduces padding and term font size. |
| `.nb-description-list-sm` | Size | Smaller term/description font sizes. |
| `.nb-description-list-lg` | Size | Larger term/description font sizes and padding. |
| `.nb-description-list-primary` | Color | Accent term color set to `--nb-primary`. |
| `.nb-description-list-secondary` | Color | Accent term color set to `--nb-secondary`. |
| `.nb-description-list-accent` | Color | Accent term color set to `--nb-accent`. |
| `.nb-description-list-info` | Color | Accent term color set to `--nb-info`. |
| `.nb-description-list-success` | Color | Accent term color set to `--nb-success`. |
| `.nb-description-list-warning` | Color | Accent term color set to `--nb-warning`. |
| `.nb-description-list-error` | Color | Accent term color set to `--nb-error`. |
| `.nb-description-list-neutral` | Color | Accent term color set to `--nb-neutral`. |

### Class Combination Examples

```html
<!-- Default description list -->
<dl class="nb-description-list">
  <dt class="nb-description-list-term">Plan</dt>
  <dd class="nb-description-list-description">Professional</dd>
</dl>

<!-- Horizontal + primary accent -->
<dl class="nb-description-list nb-description-list-horizontal nb-description-list-primary">
  <dt class="nb-description-list-term">Region</dt>
  <dd class="nb-description-list-description">US-East</dd>
</dl>

<!-- Bordered + compact -->
<dl class="nb-description-list nb-description-list-bordered nb-description-list-compact">
  <dt class="nb-description-list-term">CPU</dt>
  <dd class="nb-description-list-description">8 cores</dd>
</dl>
```

---

## DOM Contract

### Recommended Structure

```html
<dl class="nb-description-list">
  <dt class="nb-description-list-term">Plan</dt>
  <dd class="nb-description-list-description">Professional</dd>

  <dt class="nb-description-list-term">Price</dt>
  <dd class="nb-description-list-description">$29 per user / month</dd>
</dl>
```

When multiple term/description pairs are grouped, wrap each pair in a `<div>` to keep associations clear:

```html
<dl class="nb-description-list nb-description-list-horizontal">
  <div>
    <dt class="nb-description-list-term">Region</dt>
    <dd class="nb-description-list-description">US-East</dd>
  </div>
</dl>
```

### Semantic Elements

- **Preferred**: `<dl>` with `<dt>` and `<dd>` children.
- Native elements carry the correct description-list semantics automatically.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| — | — | — | No component-specific required attributes. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `role="list"` | If a non-`<dl>` element is used as the container. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| Standard reading order | Screen readers announce term/description pairs. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ❌ Not styled | — | No hover styles are provided. |
| **focus-visible** | ✅ | `:focus-visible` (global) | Default focus outline. |
| **disabled** | ❌ Not applicable | — | Description lists are not interactive. |
| **active** | ❌ Not applicable | — | No active state. |
| **current** | ❌ Not applicable | — | No current-item styles. |
| **selected** | ❌ Not applicable | — | No selected-item styles. |
| **read-only** | ❌ Not applicable | — | Description lists are inherently read-only. |
| **reduced-motion** | ❌ Not applicable | — | Description lists are static data displays; no component-level motion. |
| **disabled** | ❌ Not applicable | — | Description lists are not interactive. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

`.nb-description-list` is a bordered block with a shadow. Terms use uppercase, bold text with a small colored marker pseudo-element. The horizontal variant switches the container to a two-column grid.

### Reduced Motion

No component-level transitions or animations; reduced-motion is not applicable.

### Responsive Behavior

The horizontal variant uses `grid-template-columns: minmax(8rem, 1fr) 2fr`, so the term column can shrink to `8rem` on narrow viewports while the description column wraps long content. For very narrow containers, consider switching to the default stacked layout. Long descriptions wrap by default; apply custom truncation only when needed.

### RTL

Uses logical properties (`border-inline-end`, `text-align: start`, etc.); no special RTL overrides needed.

---

## Examples

### Default

```html
<dl class="nb-description-list">
  <dt class="nb-description-list-term">Plan</dt>
  <dd class="nb-description-list-description">Professional</dd>
  <dt class="nb-description-list-term">Billing</dt>
  <dd class="nb-description-list-description">Annual</dd>
</dl>
```

### Horizontal

```html
<dl class="nb-description-list nb-description-list-horizontal">
  <div>
    <dt class="nb-description-list-term">Region</dt>
    <dd class="nb-description-list-description">US-East</dd>
  </div>
  <div>
    <dt class="nb-description-list-term">Instance</dt>
    <dd class="nb-description-list-description">c7g.2xlarge</dd>
  </div>
</dl>
```

### Bordered + Color Accent

```html
<dl class="nb-description-list nb-description-list-bordered nb-description-list-primary">
  <dt class="nb-description-list-term">Project</dt>
  <dd class="nb-description-list-description">Neo-Brutal UI</dd>
  <dt class="nb-description-list-term">License</dt>
  <dd class="nb-description-list-description">MIT</dd>
</dl>
```

### Compact

```html
<dl class="nb-description-list nb-description-list-compact nb-description-list-success">
  <dt class="nb-description-list-term">CPU</dt>
  <dd class="nb-description-list-description">8 cores</dd>
  <dt class="nb-description-list-term">RAM</dt>
  <dd class="nb-description-list-description">16 GB</dd>
</dl>
```
