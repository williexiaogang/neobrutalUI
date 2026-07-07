# Color Picker API

> **Component**: Color Picker  
> **Category**: Forms  
> **Base class**: `.nb-color-picker`  
> **Status**: Beta (CSS visual layer implemented; native color input styling, swatch display, and size variants available)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-color-picker` | Component | Wrapper for the color input, label, and value text. |
| `.nb-color-picker-input` | Part | Native color input with styled swatch. |
| `.nb-color-picker-label` | Part | Text label next to the swatch. |
| `.nb-color-picker-value` | Part | Monospaced hex value display. |
| `.nb-color-picker-sm` | Size | Small swatch, label, and value text. |
| `.nb-color-picker-lg` | Size | Large swatch, label, and value text. |

### Class Combination Examples

```html
<!-- Basic color picker -->
<label class="nb-color-picker">
  <input type="color" class="nb-color-picker-input" value="#3b82f6" aria-label="Pick a color" />
  <span class="nb-color-picker-label">Primary</span>
</label>

<!-- With value display -->
<label class="nb-color-picker">
  <input type="color" class="nb-color-picker-input" value="#10b981" />
  <span class="nb-color-picker-label">Success</span>
  <span class="nb-color-picker-value">#10B981</span>
</label>

<!-- Large -->
<label class="nb-color-picker nb-color-picker-lg">
  <input type="color" class="nb-color-picker-input" value="#ef4444" />
  <span class="nb-color-picker-label">Danger</span>
</label>
```

---

## DOM Contract

### Recommended Structure

```html
<label class="nb-color-picker">
  <input type="color" class="nb-color-picker-input" value="#3b82f6" aria-label="Primary color" />
  <span class="nb-color-picker-label">Primary</span>
  <span class="nb-color-picker-value">#3B82F6</span>
</label>
```

### Semantic Element

- **Preferred**: `<label class="nb-color-picker">` wrapping an `<input type="color">`.
- Label and optional value text are sibling elements to the input.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `type="color"` | Yes | `"color"` | Required for color selection. |
| `value` | Recommended | Hex color | Sets the initial color. |
| `aria-label` | Recommended | Purpose label | Required if no visible `.nb-color-picker-label` is present. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-label` | On the input when there is no visible label. |
| `aria-labelledby` | Reference a visible label by ID. |
| `disabled` | When the color picker is not interactive. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus to the color input. |
| `Enter` / `Space` | Opens the native color picker dialog. |
| Standard typing | Inside the native color dialog. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ | `.nb-color-picker:hover` | Shadow elevates to `md`. |
| **focus** | ✅ | `.nb-color-picker:focus-within` | `border-color: var(--nb-focus)`, `box-shadow: var(--nb-shadow-md)`, `outline: none`. |
| **focus-visible** | ✅ | `:focus-within` | Same as focus border/shadow change. |
| **disabled** | ✅ | `.nb-color-picker:has(.nb-color-picker-input:disabled)` | Wrapper opacity drops to `0.6`, cursor becomes `not-allowed`. |
| **checked / invalid / readonly / loading** | ❌ Not applicable | — | Not applicable. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

The wrapper is an inline-flex row with a small shadow:

```css
.nb-color-picker {
  display: inline-flex;
  align-items: center;
  gap: var(--nb-space-2);
  padding: var(--nb-space-1);
  border: var(--nb-border-width) solid var(--nb-border);
  border-radius: var(--nb-radius-field);
  background: var(--nb-base-100);
  box-shadow: var(--nb-shadow-sm);
  cursor: pointer;
  transition: box-shadow var(--nb-duration-fast) var(--nb-ease-out);
}
```

The native color input is styled into a square swatch:

```css
.nb-color-picker-input {
  appearance: none;
  inline-size: 2.5rem;
  block-size: 2.5rem;
  padding: 0;
  border: var(--nb-border-width) solid var(--nb-border);
  border-radius: var(--nb-radius-selector);
  background: none;
  cursor: pointer;
  overflow: hidden;
}
```

Size variants target the swatch and label:

```css
.nb-color-picker-sm .nb-color-picker-input {
  inline-size: 1.75rem;
  block-size: 1.75rem;
}

.nb-color-picker-lg .nb-color-picker-input {
  inline-size: 3rem;
  block-size: 3rem;
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-color-picker {
    transition: none;
  }
}
```

### RTL

Uses logical properties; no special RTL overrides needed.

---

## Examples

### Basic Color Pickers

```html
<label class="nb-color-picker">
  <input type="color" class="nb-color-picker-input" value="#3b82f6" aria-label="Pick a color" />
  <span class="nb-color-picker-label">Primary</span>
</label>

<label class="nb-color-picker">
  <input type="color" class="nb-color-picker-input" value="#10b981" />
  <span class="nb-color-picker-label">Success</span>
</label>

<label class="nb-color-picker">
  <input type="color" class="nb-color-picker-input" value="#ef4444" />
  <span class="nb-color-picker-label">Danger</span>
</label>
```

### With Hex Value

```html
<label class="nb-color-picker">
  <input type="color" class="nb-color-picker-input" value="#8b5cf6" />
  <span class="nb-color-picker-label">Accent</span>
  <span class="nb-color-picker-value">#8B5CF6</span>
</label>
```

### Size Variants

```html
<label class="nb-color-picker nb-color-picker-sm">
  <input type="color" class="nb-color-picker-input" value="#64748b" />
  <span class="nb-color-picker-label">Small</span>
</label>

<label class="nb-color-picker">
  <input type="color" class="nb-color-picker-input" value="#64748b" />
  <span class="nb-color-picker-label">Default</span>
</label>

<label class="nb-color-picker nb-color-picker-lg">
  <input type="color" class="nb-color-picker-input" value="#64748b" />
  <span class="nb-color-picker-label">Large</span>
</label>
```

### Disabled State

```html
<label class="nb-color-picker">
  <input type="color" class="nb-color-picker-input" value="#94a3b8" disabled />
  <span class="nb-color-picker-label">Disabled</span>
</label>
```
