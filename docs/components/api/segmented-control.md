# Segmented Control API

> **Component**: Segmented Control  
> **Category**: Forms  
> **Base class**: `.nb-segmented`  
> **Status**: Ready

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-segmented` | Component | Base segmented control container. Required. |
| `.nb-segmented-item` | Component / Part | Individual selectable segment (label wrapping a hidden radio). |
| `.nb-segmented-block` | Layout | Full-width block variant. |
| `.nb-segmented-sm` | Size | Small segment padding and font size. |
| `.nb-segmented-lg` | Size | Large segment padding and font size. |
| `.nb-segmented-vertical` | Layout | Vertical stacked layout. |
| `.nb-segmented-primary` | Color | Primary background on checked segment. |
| `.nb-segmented-secondary` | Color | Secondary background on checked segment. |
| `.nb-segmented-accent` | Color | Accent background on checked segment. |

### Class Combination Examples

```html
<!-- Default horizontal -->
<div class="nb-segmented" role="radiogroup" aria-label="View type">
  <label class="nb-segmented-item">
    <input type="radio" name="view" value="list" />
    List
  </label>
  <label class="nb-segmented-item">
    <input type="radio" name="view" value="grid" checked />
    Grid
  </label>
</div>

<!-- Block + large + primary -->
<div class="nb-segmented nb-segmented-block nb-segmented-lg nb-segmented-primary" role="radiogroup" aria-label="Billing">
  <label class="nb-segmented-item">
    <input type="radio" name="billing" value="monthly" />
    Monthly
  </label>
  <label class="nb-segmented-item">
    <input type="radio" name="billing" value="yearly" checked />
    Yearly
  </label>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-segmented" role="radiogroup" aria-label="View type">
  <label class="nb-segmented-item">
    <input type="radio" name="view" value="list" />
    List
  </label>
  <label class="nb-segmented-item">
    <input type="radio" name="view" value="grid" checked />
    Grid
  </label>
  <label class="nb-segmented-item">
    <input type="radio" name="view" value="map" />
    Map
  </label>
</div>
```

### Semantic Element

- **Preferred**: A `<div>` with `role="radiogroup"` containing `<label class="nb-segmented-item">` elements that wrap hidden `<input type="radio">` controls.
- The checked state is driven by the native radio input.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `role="radiogroup"` | Yes | `"radiogroup"` | Required for accessibility semantics. |
| `aria-label` | Recommended | Purpose of the group | Provides an accessible name for the group. |
| `type="radio"` | Yes (on input) | `"radio"` | Required for selection behavior. |
| `name` | Yes (on input) | Shared group name | Only one segment per group can be checked. |
| `value` | Recommended | Segment value | Required for form submission. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-label` / `aria-labelledby` | On `.nb-segmented` to name the radiogroup. |
| `aria-describedby` | Reference helper or error text. |
| `disabled` | On a radio input to disable that segment. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus into the radiogroup. |
| `↑` / `↓` / `←` / `→` | Changes the checked segment within the group (requires JS for roving focus if inputs are hidden). |
| `Space` | Checks the focused segment. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ | `.nb-segmented-item:hover:not(:checked):not(:disabled)` | Background turns `--nb-base-300`. |
| **focus** | ✅ | `.nb-segmented-item:focus-visible` | `outline: 2px solid var(--nb-focus); outline-offset: 2px;` |
| **focus-visible** | ✅ | `:focus-visible` | Same as focus outline. |
| **disabled** | ✅ | `.nb-segmented-item:disabled` (input) | `opacity: 0.5`, `cursor: not-allowed`. |
| **checked** | ✅ | `.nb-segmented-item > input:checked` (or `.nb-segmented-item:has(:checked)`) | Segment background turns `--nb-base-100`, gains border and shadow, shifts `(-1px, -1px)`. Color variants change background to the accent color. |
| **invalid / readonly / loading** | ❌ Not applicable | — | Not applicable. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

The container is a flex row with an inset shadow:

```css
.nb-segmented {
  display: inline-flex;
  flex-direction: row;
  max-inline-size: 100%;
  overflow-x: auto;
  padding: var(--nb-space-1);
  border: var(--nb-border-width) solid var(--nb-border);
  border-radius: var(--nb-radius-field);
  background: var(--nb-base-200);
  box-shadow: inset var(--nb-shadow-xs);
  gap: var(--nb-space-1);
}
```

Each segment is a styled label/button with transitions:

```css
.nb-segmented-item {
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--nb-space-2) var(--nb-space-4);
  border: var(--nb-border-width) solid transparent;
  border-radius: var(--nb-radius-field);
  background: transparent;
  color: var(--nb-base-content);
  font-family: inherit;
  font-size: var(--nb-text-sm);
  font-weight: 700;
  cursor: pointer;
  transition: background var(--nb-duration-fast) var(--nb-ease-out),
              box-shadow var(--nb-duration-fast) var(--nb-ease-out),
              transform var(--nb-duration-fast) var(--nb-ease-out);
}

.nb-segmented-item > input:checked ~ .nb-segmented-item,
.nb-segmented-item:has(:checked) {
  background: var(--nb-base-100);
  border-color: var(--nb-border);
  box-shadow: var(--nb-shadow-sm);
  transform: translate(-1px, -1px);
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-segmented-item {
    transition: none;
  }
}
```

### RTL

Uses logical properties; no special RTL overrides needed.

---

## Examples

### Default Horizontal

```html
<div class="nb-segmented" role="radiogroup" aria-label="View type">
  <label class="nb-segmented-item">
    <input type="radio" name="view-default" value="list" />
    List
  </label>
  <label class="nb-segmented-item">
    <input type="radio" name="view-default" value="grid" checked />
    Grid
  </label>
  <label class="nb-segmented-item">
    <input type="radio" name="view-default" value="map" />
    Map
  </label>
</div>
```

### Block Variant

```html
<div class="nb-segmented nb-segmented-block" role="radiogroup" aria-label="Priority">
  <label class="nb-segmented-item">
    <input type="radio" name="priority" value="low" />
    Low
  </label>
  <label class="nb-segmented-item">
    <input type="radio" name="priority" value="medium" />
    Medium
  </label>
  <label class="nb-segmented-item">
    <input type="radio" name="priority" value="high" checked />
    High
  </label>
</div>
```

### Size Variants

```html
<div class="nb-segmented nb-segmented-sm" role="radiogroup" aria-label="Size small">
  <label class="nb-segmented-item"><input type="radio" name="size-sm" value="xs" checked /> XS</label>
  <label class="nb-segmented-item"><input type="radio" name="size-sm" value="sm" /> SM</label>
  <label class="nb-segmented-item"><input type="radio" name="size-sm" value="md" /> MD</label>
</div>

<div class="nb-segmented nb-segmented-lg" role="radiogroup" aria-label="Size large">
  <label class="nb-segmented-item"><input type="radio" name="size-lg" value="sm" /> Small</label>
  <label class="nb-segmented-item"><input type="radio" name="size-lg" value="md" checked /> Medium</label>
  <label class="nb-segmented-item"><input type="radio" name="size-lg" value="lg" /> Large</label>
</div>
```

### Vertical Layout

```html
<div class="nb-segmented nb-segmented-vertical" role="radiogroup" aria-label="Alignment">
  <label class="nb-segmented-item">
    <input type="radio" name="align" value="left" checked />
    Left
  </label>
  <label class="nb-segmented-item">
    <input type="radio" name="align" value="center" />
    Center
  </label>
  <label class="nb-segmented-item">
    <input type="radio" name="align" value="right" />
    Right
  </label>
</div>
```

### Color Variants

```html
<div class="nb-segmented nb-segmented-primary" role="radiogroup" aria-label="Theme">
  <label class="nb-segmented-item"><input type="radio" name="theme" value="light" /> Light</label>
  <label class="nb-segmented-item"><input type="radio" name="theme" value="dark" checked /> Dark</label>
  <label class="nb-segmented-item"><input type="radio" name="theme" value="auto" /> Auto</label>
</div>

<div class="nb-segmented nb-segmented-secondary" role="radiogroup" aria-label="Status">
  <label class="nb-segmented-item"><input type="radio" name="status" value="draft" checked /> Draft</label>
  <label class="nb-segmented-item"><input type="radio" name="status" value="review" /> Review</label>
  <label class="nb-segmented-item"><input type="radio" name="status" value="published" /> Published</label>
</div>

<div class="nb-segmented nb-segmented-accent" role="radiogroup" aria-label="Plan">
  <label class="nb-segmented-item"><input type="radio" name="plan" value="free" /> Free</label>
  <label class="nb-segmented-item"><input type="radio" name="plan" value="pro" checked /> Pro</label>
  <label class="nb-segmented-item"><input type="radio" name="plan" value="team" /> Team</label>
</div>
```

### Disabled State

```html
<div class="nb-segmented" role="radiogroup" aria-label="Disabled example">
  <label class="nb-segmented-item">
    <input type="radio" name="disabled-demo" value="edit" disabled />
    Edit
  </label>
  <label class="nb-segmented-item">
    <input type="radio" name="disabled-demo" value="preview" disabled checked />
    Preview
  </label>
  <label class="nb-segmented-item">
    <input type="radio" name="disabled-demo" value="export" disabled />
    Export
  </label>
</div>
```

### Combined Variant

```html
<div class="nb-segmented nb-segmented-block nb-segmented-lg nb-segmented-primary" role="radiogroup" aria-label="Combined variant">
  <label class="nb-segmented-item">
    <input type="radio" name="billing" value="monthly" />
    Monthly
  </label>
  <label class="nb-segmented-item">
    <input type="radio" name="billing" value="quarterly" checked />
    Quarterly
  </label>
  <label class="nb-segmented-item">
    <input type="radio" name="billing" value="yearly" />
    Yearly
  </label>
</div>
```
