# List API

> **Component**: List  
> **Category**: Data Display  
> **Base class**: `.nb-list`  
> **Status**: Beta (base styling, numbered, bulleted, striped, divided, bordered, inline, compact, size, and color variants are implemented)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-list` | Component | Base list class. Required on `<ul>` or `<ol>`. |
| `.nb-list-item` | Component | Base class for each list item (`<li>`). |
| `.nb-list-numbered` | Variant | Adds brutalist numeric counter markers. |
| `.nb-list-bulleted` | Variant | Adds square bullet markers. |
| `.nb-list-striped` | Variant | Alternating background on odd items. |
| `.nb-list-divided` | Variant | Thick (`--nb-border-width`) separators between items. |
| `.nb-list-bordered` | Variant | Items render as individual bordered cards. |
| `.nb-list-inline` | Variant / Layout | Horizontal chip layout with wrapping. |
| `.nb-list-compact` | Variant | Reduces item padding. |
| `.nb-list-sm` | Size | Smaller font size. |
| `.nb-list-lg` | Size | Larger font size and padding. |
| `.nb-list-primary` | Color | Sets accent marker color to `--nb-primary`. |
| `.nb-list-secondary` | Color | Sets accent marker color to `--nb-secondary`. |
| `.nb-list-accent` | Color | Sets accent marker color to `--nb-accent`. |
| `.nb-list-info` | Color | Sets accent marker color to `--nb-info`. |
| `.nb-list-success` | Color | Sets accent marker color to `--nb-success`. |
| `.nb-list-warning` | Color | Sets accent marker color to `--nb-warning`. |
| `.nb-list-error` | Color | Sets accent marker color to `--nb-error`. |
| `.nb-list-neutral` | Color | Sets accent marker color to `--nb-neutral`. |

### Class Combination Examples

```html
<!-- Bulleted list -->
<ul class="nb-list nb-list-bulleted">
  <li class="nb-list-item">Feature one</li>
  <li class="nb-list-item">Feature two</li>
</ul>

<!-- Numbered, compact, success accent -->
<ol class="nb-list nb-list-numbered nb-list-compact nb-list-success">
  <li class="nb-list-item">Step one</li>
  <li class="nb-list-item">Step two</li>
</ol>

<!-- Inline chips -->
<ul class="nb-list nb-list-inline">
  <li class="nb-list-item">Docs</li>
  <li class="nb-list-item">Blog</li>
</ul>
```

---

## DOM Contract

### Recommended Structure

```html
<ul class="nb-list nb-list-bulleted">
  <li class="nb-list-item">Unlimited projects</li>
  <li class="nb-list-item">Real-time sync</li>
</ul>
```

### Semantic Elements

- **Preferred**: `<ul>` for unordered lists, `<ol>` for ordered lists, `<li>` for items.
- A `<div role="list">` with child `<div role="listitem" class="nb-list-item">` is also styled, but native list elements are recommended for accessibility.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| — | — | — | No component-specific required attributes. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `role="list"` | If a non-list element is used as the container. |
| `role="listitem"` | If a non-`<li>` element is used as an item. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| Standard list navigation | Lists are static; no custom keyboard handling needed. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ | `.nb-list-item:hover` / `.nb-list li:hover` | Item background changes to `--nb-base-200`. Inline items also lift `-1px` and shadow grows. |
| **focus-visible** | ✅ | `:focus-visible` (global) | Default focus outline. |
| **disabled** | ❌ Not applicable | — | List items are not interactive by default. |
| **active** | ❌ Not applicable | — | No active item state. |
| **current** | ❌ Not applicable | — | No current-item styles. |
| **selected** | ❌ Not applicable | — | No selected-item styles. |
| **read-only** | ❌ Not applicable | — | Lists are inherently read-only. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

`.nb-list` is a block container with hard border, radius, shadow, and hidden overflow. Items use flex alignment with a `gap` and a bottom border. Color variants reassign the `--_list-accent` custom property used by marker pseudo-elements.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-list-item,
  .nb-list li,
  .nb-list-inline .nb-list-item,
  .nb-list-inline li {
    transition: none;
  }
}
```

### RTL

Uses logical properties; no special RTL overrides needed.

---

## Examples

### Bulleted List

```html
<ul class="nb-list nb-list-bulleted">
  <li class="nb-list-item">Authentication module</li>
  <li class="nb-list-item">Database migrations</li>
</ul>
```

### Numbered List

```html
<ol class="nb-list nb-list-numbered">
  <li class="nb-list-item">Create account</li>
  <li class="nb-list-item">Invite teammates</li>
</ol>
```

### Inline Chips

```html
<ul class="nb-list nb-list-inline">
  <li class="nb-list-item">Docs</li>
  <li class="nb-list-item">Blog</li>
  <li class="nb-list-item">Support</li>
</ul>
```

### Bordered with Color Accent

```html
<ul class="nb-list nb-list-bordered nb-list-primary">
  <li class="nb-list-item">System status: Operational</li>
  <li class="nb-list-item">Active incidents: 0</li>
</ul>
```
