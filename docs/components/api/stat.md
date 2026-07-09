# Stat API

> **Component**: Stat  
> **Category**: Data Display  
> **Base class**: `.nb-stat`  
> **Status**: Ready (vertical/horizontal layouts, trend arrows, color variants, sizes, compact, ghost, reduced-motion, and forced-colors support are implemented)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-stat` | Component | Base stat card class. Required. |
| `.nb-stat-title` | Part | Label above the value. |
| `.nb-stat-value` | Part | Large metric value. |
| `.nb-stat-desc` | Part | Description / trend line below the value. |
| `.nb-stat-trend-up` | Variant | Adds an upward triangle and success color to the description. |
| `.nb-stat-trend-down` | Variant | Adds a downward triangle and error color to the description. |
| `.nb-stat-horizontal` | Layout / Variant | Arranges title, value, and description in a row. |
| `.nb-stat-compact` | Variant | Reduces padding. |
| `.nb-stat-ghost` | Variant | Removes border, shadow, and background. |
| `.nb-stat-primary` | Color | Sets value color to `--nb-primary`. |
| `.nb-stat-secondary` | Color | Sets value color to `--nb-secondary`. |
| `.nb-stat-accent` | Color | Sets value color to `--nb-accent`. |
| `.nb-stat-success` | Color | Sets value color to `--nb-success`. |
| `.nb-stat-info` | Color | Sets value color to `--nb-info`. |
| `.nb-stat-warning` | Color | Sets value color to `--nb-warning`. |
| `.nb-stat-error` | Color | Sets value color to `--nb-error`. |
| `.nb-stat-sm` | Size | Smaller title, value, and description text. |
| `.nb-stat-lg` | Size | Larger title, value, and description text. |

### Class Combination Examples

```html
<!-- Vertical stat with trend -->
<div class="nb-stat nb-stat-trend-up">
  <p class="nb-stat-title">Revenue</p>
  <p class="nb-stat-value">$48,200</p>
  <p class="nb-stat-desc">+8.5% vs last quarter</p>
</div>

<!-- Horizontal + color + large -->
<div class="nb-stat nb-stat-horizontal nb-stat-primary nb-stat-lg nb-stat-trend-up">
  <p class="nb-stat-title">Active Users</p>
  <p class="nb-stat-value">7,821</p>
  <p class="nb-stat-desc">+18% growth</p>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-stat">
  <p class="nb-stat-title">Total Users</p>
  <p class="nb-stat-value">12,450</p>
  <p class="nb-stat-desc">+12% from last month</p>
</div>
```

### Semantic Element

- **Preferred**: `<div>` with `<p>` children for title/value/description.
- Use heading elements (`<h3>` etc.) for the value only when the stat introduces a document section.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| — | — | — | No component-specific required attributes. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-label` | When the value is numeric and needs a human-readable label. |
| `aria-describedby` | To associate the description with the value. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| — | Stat cards are not interactive by default. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **trend-up** | ✅ | `.nb-stat-trend-up .nb-stat-desc::before` | Upward triangle; description color changes to `--nb-success`. |
| **trend-down** | ✅ | `.nb-stat-trend-down .nb-stat-desc::before` | Downward triangle; description color changes to `--nb-error`. |
| **hover** | ❌ Not styled | — | No hover styles. |
| **focus-visible** | ✅ | `:focus-visible` (global) | Default outline if the stat is made focusable. |
| **disabled** | ❌ Not applicable | — | Stats are not interactive. |
| **active** | ❌ Not applicable | — | No active state. |
| **current** | ❌ Not applicable | — | No current state. |
| **selected** | ❌ Not applicable | — | No selected state. |
| **read-only** | ❌ Not applicable | — | Stats are inherently read-only. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

`.nb-stat` is a flex column with hard border, radius, and shadow. The value uses an extra-large bold font. Trend triangles are rendered with CSS border triangles on `.nb-stat-desc::before`.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-stat-value {
    transition: none;
  }
}
```

### RTL

Uses logical properties; no special RTL overrides needed.

---

## Examples

### Basic

```html
<div class="nb-stat">
  <p class="nb-stat-title">Total Users</p>
  <p class="nb-stat-value">12,450</p>
  <p class="nb-stat-desc">+12% from last month</p>
</div>
```

### Trend Variants

```html
<div class="nb-stat nb-stat-trend-up">
  <p class="nb-stat-title">Revenue</p>
  <p class="nb-stat-value">$48,200</p>
  <p class="nb-stat-desc">+8.5% vs last quarter</p>
</div>

<div class="nb-stat nb-stat-trend-down">
  <p class="nb-stat-title">Bounce Rate</p>
  <p class="nb-stat-value">24.8%</p>
  <p class="nb-stat-desc">-2.3% vs last week</p>
</div>
```

### Color Variants

```html
<div class="nb-stat nb-stat-primary"><p class="nb-stat-title">Primary</p><p class="nb-stat-value">1,234</p></div>
<div class="nb-stat nb-stat-success nb-stat-trend-up"><p class="nb-stat-title">Success</p><p class="nb-stat-value">+98%</p></div>
<div class="nb-stat nb-stat-error nb-stat-trend-down"><p class="nb-stat-title">Error</p><p class="nb-stat-value">-12%</p></div>
```

### Layout & Size Variants

```html
<div class="nb-stat nb-stat-horizontal nb-stat-success nb-stat-trend-up">
  <p class="nb-stat-title">Horizontal</p>
  <p class="nb-stat-value">+15%</p>
  <p class="nb-stat-desc">Horizontal layout</p>
</div>

<div class="nb-stat nb-stat-compact nb-stat-trend-down">
  <p class="nb-stat-title">Compact</p>
  <p class="nb-stat-value">42</p>
  <p class="nb-stat-desc">Compact padding</p>
</div>

<div class="nb-stat nb-stat-ghost nb-stat-trend-up">
  <p class="nb-stat-title">Ghost</p>
  <p class="nb-stat-value">99.9%</p>
  <p class="nb-stat-desc">Borderless style</p>
</div>
```
