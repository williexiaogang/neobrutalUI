# Progress API

> **Component**: Progress  
> **Category**: Feedback  
> **Base class**: `.nb-progress`  
> **Status**: Ready (native linear, custom linear, circular, striped, indeterminate, color, size, reduced-motion, forced-colors, and ARIA patterns implemented)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-progress` | Component | Base linear progress class for `<progress>` elements. |
| `.nb-progress-track` | Component / Part | Custom linear track container (`<div>`). |
| `.nb-progress-fill` | Part | Fill bar inside `.nb-progress-track`. |
| `.nb-progress-indeterminate` | State | Applies infinite sliding animation to the fill. |
| `.nb-progress-striped` | Variant | Applies diagonal stripe pattern to the fill. |
| `.nb-progress-circular` | Component | Circular progress container. |
| `.nb-progress-circular-track` | Part | SVG circle for the circular track. |
| `.nb-progress-circular-fill` | Part | SVG circle for the circular fill. |
| `.nb-progress-circular-label` | Part | Centered percentage label. |
| `.nb-progress-primary` | Color | Sets fill color to `--nb-primary`. |
| `.nb-progress-success` | Color | Sets fill color to `--nb-success`. |
| `.nb-progress-warning` | Color | Sets fill color to `--nb-warning`. |
| `.nb-progress-error` | Color | Sets fill color to `--nb-error`. |
| `.nb-progress-neutral` | Color | Sets fill color to `--nb-neutral`. |
| `.nb-progress-info` | Color | Sets fill color to `--nb-info`. |
| `.nb-progress-sm` | Size | Small height / circular size. |
| `.nb-progress-lg` | Size | Large height / circular size. |

### Class Combination Examples

```html
<!-- Native linear progress -->
<progress class="nb-progress nb-progress-success" value="75" max="100">75%</progress>

<!-- Div-based striped fill -->
<div class="nb-progress-track nb-progress-striped" role="progressbar" aria-label="Upload progress" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
  <div class="nb-progress-fill nb-progress-success" style="width: 75%;"></div>
</div>

<!-- Indeterminate -->
<div class="nb-progress-track nb-progress-indeterminate" role="progressbar" aria-label="Loading preview">
  <div class="nb-progress-fill nb-progress-primary"></div>
</div>

<!-- Circular with label -->
<div class="nb-progress-circular nb-progress-success" role="progressbar" aria-label="Disk usage" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
  <div class="nb-progress-circular-label">75%</div>
  <svg viewBox="0 0 36 36">
    <circle class="nb-progress-circular-track" cx="18" cy="18" r="15"></circle>
    <circle class="nb-progress-circular-fill" cx="18" cy="18" r="15"
            stroke-dasharray="94.2" stroke-dashoffset="23.55"></circle>
  </svg>
</div>
```

---

## DOM Contract

### Recommended Structure (Native Linear)

```html
<progress class="nb-progress" value="60" max="100">60%</progress>
```

### Recommended Structure (Div-Based Linear)

```html
<div class="nb-progress-track nb-progress-striped" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" aria-label="Upload progress">
  <div class="nb-progress-fill nb-progress-success" style="width: 75%;"></div>
</div>
```

### Recommended Structure (Circular)

```html
<div class="nb-progress-circular" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" aria-label="Disk usage">
  <div class="nb-progress-circular-label">75%</div>
  <svg viewBox="0 0 36 36">
    <circle class="nb-progress-circular-track" cx="18" cy="18" r="15"></circle>
    <circle class="nb-progress-circular-fill" cx="18" cy="18" r="15"
            stroke-dasharray="94.2" stroke-dashoffset="23.55"></circle>
  </svg>
</div>
```

### Semantic Elements

- **Preferred**: `<progress>` for linear determinate bars.
- Use `<div role="progressbar">` for custom div-based or circular indicators.
- Use native `<progress>` when the browser should own semantics and value updates.
- Use `.nb-progress-track` + `.nb-progress-fill` when striped, custom indeterminate, or custom layout control is needed.
- Use `.nb-progress-circular` for SVG circular indicators; update `stroke-dashoffset` and ARIA values together.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `value` / `max` | Yes (for `<progress>`) | Numeric | The native element requires these for a determinate bar. |
| `role` | Yes (custom indicators) | `"progressbar"` | Required on `.nb-progress-track` and `.nb-progress-circular`. |
| `aria-valuenow` / `aria-valuemin` / `aria-valuemax` | Yes (custom determinate indicators) | Numeric | Required when using a determinate `<div>` implementation. |
| `aria-label` | Recommended | Text | Required when no visible label names the indicator. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-label` | Provides an accessible name for the progress indicator. |
| `aria-valuetext` | When a textual description of the current value is more useful than a number. |
| omit `aria-valuenow` | For indeterminate custom progressbars where the current value is unknown. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| — | Progress indicators are not focusable; screen readers announce `aria-valuenow`. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **indeterminate** | ✅ | `.nb-progress:indeterminate` / `.nb-progress-indeterminate .nb-progress-fill` | Fill animates horizontally. |
| **hover** | ❌ Not applicable | — | Progress bars are not interactive. |
| **focus-visible** | ❌ Not applicable | — | Not focusable by default. |
| **disabled** | ❌ Not applicable | — | No disabled state. |
| **active** | ❌ Not applicable | — | No active state. |
| **current** | ❌ Not applicable | — | No current state. |
| **selected** | ❌ Not applicable | — | No selected state. |
| **read-only** | ❌ Not applicable | — | Progress is inherently read-only. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

Linear progress uses a hard border, rounded field radius, and shadow. Native `<progress>` bars inherit color variants through component custom properties. Custom `.nb-progress-track` bars use `.nb-progress-fill` width for determinate values and `.nb-progress-indeterminate` when the value is unknown. Circular progress uses SVG circles with `stroke-dashoffset` transitions. Striped and indeterminate variants run CSS animations.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-progress-fill,
  .nb-progress::-webkit-progress-value,
  .nb-progress::-moz-progress-bar {
    transition: none;
  }

  .nb-progress-indeterminate .nb-progress-fill,
  .nb-progress-striped .nb-progress-fill {
    animation: none;
  }

  .nb-progress-circular-fill {
    transition: none;
  }
}
```

### RTL

Uses logical properties; no special RTL overrides needed.

---

## Examples

### Native Linear Sizes

```html
<progress class="nb-progress nb-progress-sm" value="40" max="100">40%</progress>
<progress class="nb-progress" value="60" max="100">60%</progress>
<progress class="nb-progress nb-progress-lg" value="80" max="100">80%</progress>
```

### Native Linear Colors

```html
<progress class="nb-progress nb-progress-success" value="75" max="100">75%</progress>
<progress class="nb-progress nb-progress-warning" value="50" max="100">50%</progress>
<progress class="nb-progress nb-progress-error" value="25" max="100">25%</progress>
```

### Div-Based Striped

```html
<div class="nb-progress-track nb-progress-striped" role="progressbar" aria-label="Build progress" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
  <div class="nb-progress-fill nb-progress-success" style="width: 75%;"></div>
</div>
```

### Indeterminate

```html
<div class="nb-progress-track nb-progress-indeterminate" role="progressbar" aria-label="Syncing data">
  <div class="nb-progress-fill nb-progress-primary"></div>
</div>
```

### Circular with Label

```html
<div class="nb-progress-circular nb-progress-success" role="progressbar" aria-label="Disk usage" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
  <div class="nb-progress-circular-label">75%</div>
  <svg viewBox="0 0 36 36">
    <circle class="nb-progress-circular-track" cx="18" cy="18" r="15"></circle>
    <circle class="nb-progress-circular-fill" cx="18" cy="18" r="15"
            stroke-dasharray="94.2" stroke-dashoffset="23.55"></circle>
  </svg>
</div>
```
