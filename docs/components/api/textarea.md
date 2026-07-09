# Textarea API

> **Component**: Textarea  
> **Category**: Forms  
> **Base class**: `.nb-textarea`  
> **Status**: Ready

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-textarea` | Component | Base multi-line text input. Required. |
| `.nb-textarea-sm` | Size | Smaller padding and font size. |
| `.nb-textarea-lg` | Size | Larger padding and font size. |

> **Note**: `.nb-textarea` shares base styles with `.nb-input` and `.nb-select` from `field.css`. Size variants `.nb-textarea-sm` and `.nb-textarea-lg` are implemented.

### Class Combination Examples

```html
<!-- Basic textarea -->
<textarea class="nb-textarea" rows="4" placeholder="Enter your message..."></textarea>

<!-- Large textarea -->
<textarea class="nb-textarea nb-textarea-lg" rows="6"></textarea>

<!-- Inside a field wrapper -->
<div class="nb-field">
  <label class="nb-field-label" for="feedback">Feedback</label>
  <textarea class="nb-textarea" id="feedback" rows="2"></textarea>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<label class="nb-field" style="inline-size: 100%;">
  <span class="nb-field-label">Feedback</span>
  <textarea class="nb-textarea" rows="2">Looks great so far!</textarea>
</label>
```

### Semantic Element

- **Preferred**: `<textarea>`.
- Use `rows` to suggest initial height; users can resize vertically by default.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `rows` | Recommended | Number | Provides an initial visible height. |
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
| `disabled` | When the field is not interactive. |
| `readonly` | When the value is visible but not editable. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus into/out of the textarea. |
| `Enter` | Inserts a newline. |
| Standard typing | All standard text entry keys function normally. |

### Character Counter

There is no dedicated counter class. Use `.nb-field-hint` or `.nb-field-description` with `aria-live="polite"` so screen readers announce changes as the user types:

```html
<div class="nb-field">
  <label class="nb-field-label" for="bio">Bio</label>
  <textarea class="nb-textarea" id="bio" rows="4" maxlength="200" aria-describedby="bio-counter"></textarea>
  <span class="nb-field-hint" id="bio-counter" aria-live="polite">0 / 200</span>
</div>
```

Keep the counter visible and update it from JavaScript. The counter text should not replace the label or error message.

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ (implicit) | Browser default | No explicit hover styles. |
| **focus** | ✅ | `.nb-textarea:focus` | `border-color: var(--nb-focus)`, `box-shadow: var(--nb-shadow-md)`. |
| **focus-visible** | ✅ | `:focus-visible` (global) | `outline: 3px solid var(--nb-focus); outline-offset: 2px;` |
| **disabled** | ✅ | `.nb-textarea:disabled` | `background: var(--nb-base-200)`, `opacity: 0.7`, `cursor: not-allowed`. |
| **readonly** | ❌ Not styled | `[readonly]` | No explicit readonly styles. |
| **invalid** | ✅ | `.nb-textarea[aria-invalid="true"]` | `border-color: var(--nb-error)`. |
| **valid** | ❌ Not styled | `:valid` | No explicit valid styles. |
| **active / loading** | ❌ Not applicable | — | Not applicable. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

`.nb-textarea` shares the standard form control base with `.nb-input` and `.nb-select`:

```css
.nb-textarea {
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

Textarea-specific overrides:

```css
.nb-textarea {
  resize: vertical;
  min-block-size: 6rem;
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-textarea {
    transition: none;
  }
}
```

### RTL

Uses logical properties; no special RTL overrides needed.

### Forced Colors

Under `forced-colors: active`, `.nb-textarea` inherits the same forced-colors treatment as `.nb-input`: a 2px `CanvasText` border, `forced-color-adjust: none`, and a 2px `Highlight` outline on focus.

---

## Examples

### Basic Textarea

```html
<textarea class="nb-textarea" rows="4" placeholder="Enter your message..."></textarea>
```

### Size Variants

```html
<textarea class="nb-textarea nb-textarea-sm" rows="2"></textarea>
<textarea class="nb-textarea" rows="4">Default</textarea>
<textarea class="nb-textarea nb-textarea-lg" rows="6"></textarea>
```

### With Field Wrapper

```html
<div class="nb-field">
  <label class="nb-field-label" for="feedback">Feedback</label>
  <textarea class="nb-textarea" id="feedback" rows="2">Looks great so far!</textarea>
</div>
```

### Disabled State

```html
<textarea class="nb-textarea" disabled>Disabled value</textarea>
```

### Invalid State

```html
<textarea class="nb-textarea" aria-invalid="true"></textarea>
```
