# Select API

> **Component**: Select  
> **Category**: Forms  
> **Base class**: `.nb-select`  
> **Status**: Ready

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-select` | Component | Base native select dropdown. Required. |
| `.nb-select-sm` | Size | Smaller padding and font size. |
| `.nb-select-lg` | Size | Larger padding and font size. |

> **Note**: `.nb-select` shares base styles with `.nb-input` and `.nb-textarea` from `field.css`.

### Class Combination Examples

```html
<!-- Basic select -->
<select class="nb-select">
  <option value="">Choose an option</option>
  <option value="a">Option A</option>
</select>

<!-- Small select -->
<select class="nb-select nb-select-sm">
  <option>Small</option>
</select>

<!-- Inside a field wrapper -->
<div class="nb-field">
  <label class="nb-field-label" for="priority">Priority</label>
  <select class="nb-select" id="priority">
    <option>Low</option>
    <option selected>Medium</option>
    <option>High</option>
  </select>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<label class="nb-field" style="inline-size: 100%;">
  <span class="nb-field-label">Priority</span>
  <select class="nb-select">
    <option>Low</option>
    <option selected>Medium</option>
    <option>High</option>
  </select>
</label>
```

### Semantic Element

- **Preferred**: `<select>` with `<option>` and optional `<optgroup>` children.
- Use the `multiple` attribute for multi-select; styling is inherited from the base class.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `id` | Recommended | Unique string | Pair with `<label for="...">`. |
| `name` | Recommended | Form field name | Required for form submission. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-label` | If no visible label is present. |
| `aria-labelledby` | Reference a visible label by ID. |
| `aria-describedby` | Reference helper or error text. |
| `aria-invalid="true"` | When validation fails. |
| `aria-required="true"` | When the field is required. |
| `disabled` | When the select is not interactive. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus into/out of the select. |
| `Space` / `Enter` | Opens the native option list. |
| `↑` / `↓` | Changes the selected option when open or closed. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ | `.nb-select:hover:not(:disabled)` | Accent arrow tile and `box-shadow: var(--nb-shadow-md)`. |
| **focus** | ✅ | `.nb-select:focus` | `border-color: var(--nb-focus)`, `box-shadow: var(--nb-shadow-md)`. |
| **focus-visible** | ✅ | `:focus-visible` (global) | `outline: 3px solid var(--nb-focus); outline-offset: 2px;` |
| **disabled** | ✅ | `.nb-select:disabled` | Muted arrow, `background-color: var(--nb-base-200)`, `opacity: 0.7`, `cursor: not-allowed`. |
| **readonly** | ❌ Not styled | — | Native `<select>` does not support `readonly`. |
| **invalid** | ✅ | `.nb-select[aria-invalid="true"]` | Error border and error-colored arrow tile. |
| **valid** | ❌ Not styled | `:valid` | No explicit valid styles. |
| **active / loading** | ❌ Not applicable | — | Not applicable. |

---

## CSS Implementation Notes

The closed trigger is fully styled. The open option list remains native so keyboard interaction, mobile presentation, and form semantics stay consistent across platforms. Use `.nb-dropdown` when a fully custom menu is required.

### Layout / Shadow / Motion

`.nb-select` shares the standard form control base with `.nb-input` and `.nb-textarea`:

```css
.nb-select {
  display: block;
  inline-size: 100%;
  padding: var(--nb-space-2) var(--nb-space-3);
  border: var(--nb-border-width) solid var(--nb-border);
  border-radius: var(--nb-radius-field);
  background: var(--nb-base-100);
  color: var(--nb-base-content);
  font-family: inherit;
  font-size: var(--nb-text-base);
  line-height: var(--nb-leading-normal);
  box-shadow: var(--nb-shadow-sm);
  transition: box-shadow var(--nb-duration-fast) var(--nb-ease-out),
              border-color var(--nb-duration-fast) var(--nb-ease-out);
}
```

Select-specific overrides remove the native closed-trigger appearance and draw a chevron, separator, and 2.25rem arrow tile with CSS gradients. Hover, invalid, and disabled states update the tile through internal custom properties. The logical `padding-inline-end` reserves space for the tile.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-select {
    transition: none;
  }
}
```

### RTL

The arrow tile moves to the inline-start side and text padding moves to the inline-end side:

```css
[dir="rtl"] .nb-select {
  background-position: 0.875rem center, 1.25rem center,
    var(--_select-affordance-width) center, 0 center;
  padding-inline: var(--nb-space-3)
    calc(var(--_select-affordance-width) + var(--nb-space-3));
}
```

### Forced Colors

Under `forced-colors: active`, the custom arrow tile is removed and native select appearance is restored. The control keeps a 2px `CanvasText` border and a 2px `Highlight` focus outline.

---

## Examples

### Basic Select

```html
<select class="nb-select">
  <option value="">Choose an option</option>
  <option value="a">Option A</option>
  <option value="b">Option B</option>
</select>
```

### Size Variants

```html
<select class="nb-select nb-select-sm">
  <option>Small</option>
</select>
<select class="nb-select">
  <option>Default</option>
</select>
<select class="nb-select nb-select-lg">
  <option>Large</option>
</select>
```

### With Field Wrapper

```html
<div class="nb-field">
  <label class="nb-field-label" for="priority">Priority</label>
  <select class="nb-select" id="priority">
    <option>Low</option>
    <option selected>Medium</option>
    <option>High</option>
  </select>
</div>
```

### Disabled State

```html
<select class="nb-select" disabled>
  <option>Disabled option</option>
</select>
```

### Invalid State

```html
<select class="nb-select" aria-invalid="true">
  <option value="">Required</option>
</select>
```
