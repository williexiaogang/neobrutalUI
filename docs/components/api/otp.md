# OTP Input API

> **Component**: OTP Input  
> **Category**: Forms  
> **Base class**: `.nb-otp`  
> **Status**: Ready

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-otp` | Component | Container for the segmented OTP input boxes. |
| `.nb-otp-field` | Component / Part | Single-character input box. Required child of `.nb-otp`. |
| `.nb-otp-sm` | Size | Small OTP boxes. |
| `.nb-otp-lg` | Size | Large OTP boxes. |
| `.nb-otp-group` | Component / Layout | Outer wrapper aligning label, OTP boxes, and error text. |
| `.nb-otp-label` | Part | Label above the OTP input. |
| `.nb-otp-error` | Part | Error message below the OTP input. |
| `.nb-otp-masked` | Variant | Masks entered characters as password dots. |

### Class Combination Examples

```html
<!-- Default OTP -->
<div class="nb-otp-group">
  <span class="nb-otp-label">Enter code</span>
  <div class="nb-otp">
    <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" />
    <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" />
    <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" />
    <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" />
  </div>
</div>

<!-- Small size -->
<div class="nb-otp nb-otp-sm">
  <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" />
</div>

<!-- Masked OTP -->
<div class="nb-otp nb-otp-masked">
  <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" />
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-otp-group">
  <span class="nb-otp-label">Default (6 digits)</span>
  <div class="nb-otp" role="group" aria-label="One-time password">
    <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" aria-label="Digit 1 of 6" />
    <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" aria-label="Digit 2 of 6" />
    <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" aria-label="Digit 3 of 6" />
    <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" aria-label="Digit 4 of 6" />
    <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" aria-label="Digit 5 of 6" />
    <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" aria-label="Digit 6 of 6" />
  </div>
  <span class="nb-otp-error">Invalid code. Please try again.</span>
</div>
```

### Semantic Element

- **Preferred**: A set of `<input type="text">` elements with `maxlength="1"` inside a wrapper with `role="group"`.
- Each field should have an accessible name indicating its position.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `type="text"` | Yes | `"text"` | Accepts numeric or alphanumeric characters. |
| `maxlength="1"` | Yes | `"1"` | Restricts each box to a single character. |
| `inputmode="numeric"` | Recommended | `"numeric"` | Shows a numeric keyboard on mobile devices. |
| `aria-label` | Recommended | Position label | Required for screen reader users to understand each box. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `role="group"` | On `.nb-otp` to group the segmented inputs. |
| `aria-label` | On the group to name the OTP purpose. |
| `aria-describedby` | Reference `.nb-otp-error` or helper text. |
| `aria-invalid="true"` | On fields when the entered code is invalid. |
| `disabled` | When the OTP input is not interactive. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus between OTP fields. |
| `0-9` / alphanumeric | Enters a character and typically moves focus to the next field (requires JS). |
| `Backspace` | Clears the current field and may move focus to the previous field (requires JS). |
| `Arrow Left` / `Arrow Right` | Moves focus between fields (requires JS). |
| `Paste` | Distributes pasted characters across fields (requires JS). |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ❌ Not styled | — | No explicit hover styles. |
| **focus** | ✅ | `.nb-otp-field:focus` | `border-color: var(--nb-focus)`, `box-shadow: var(--nb-shadow-md)`, `outline: none`. |
| **focus-visible** | ✅ | `.nb-otp-field:focus-visible` | Same as focus border/shadow; no additional outline. |
| **disabled** | ✅ | `.nb-otp-field:disabled` | `background: var(--nb-base-200)`, `opacity: 0.7`, `cursor: not-allowed`. |
| **invalid** | ✅ | `.nb-otp-field[aria-invalid="true"]` | `border-color: var(--nb-error)`. |
| **active / readonly / loading** | ❌ Not applicable | — | Not applicable. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

The OTP container lays out fields horizontally with a small gap:

```css
.nb-otp {
  display: flex;
  flex-direction: row;
  gap: var(--nb-space-2);
}
```

Each field is a fixed-size box with centered bold text:

```css
.nb-otp-field {
  --_bg: var(--nb-base-100);

  inline-size: 3rem;
  block-size: 3.5rem;
  padding: 0;
  border: var(--nb-border-width) solid var(--nb-border);
  border-radius: var(--nb-radius-field);
  background: var(--_bg);
  color: var(--nb-base-content);
  font-family: inherit;
  font-size: var(--nb-text-xl);
  font-weight: 700;
  text-align: center;
  line-height: 1;
  box-shadow: var(--nb-shadow-sm);
  transition: box-shadow var(--nb-duration-fast) var(--nb-ease-out),
              border-color var(--nb-duration-fast) var(--nb-ease-out);
}
```

Size variants apply to children:

```css
.nb-otp-sm .nb-otp-field {
  inline-size: 2.25rem;
  block-size: 2.75rem;
  font-size: var(--nb-text-lg);
}

.nb-otp-lg .nb-otp-field {
  inline-size: 3.75rem;
  block-size: 4.25rem;
  font-size: var(--nb-text-2xl);
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-otp-field {
    transition: none;
  }
}
```

### RTL

Uses logical properties; no special RTL overrides needed.

---

## Examples

### Basic OTP (6 Digits)

```html
<div class="nb-otp-group">
  <span class="nb-otp-label">Default (6 digits)</span>
  <div class="nb-otp">
    <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" value="1" />
    <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" value="2" />
    <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" value="3" />
    <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" value="4" />
    <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" />
    <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" />
  </div>
</div>
```

### Size Variants

```html
<div class="nb-otp nb-otp-sm">
  <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" value="4" />
  <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" value="2" />
  <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" value="9" />
  <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" value="6" />
</div>

<div class="nb-otp nb-otp-lg">
  <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" value="8" />
  <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" value="3" />
  <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" value="7" />
  <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" value="0" />
</div>
```

### Disabled State

```html
<div class="nb-otp">
  <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" value="5" disabled />
  <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" value="5" disabled />
  <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" value="5" disabled />
  <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" value="5" disabled />
</div>
```

### Invalid State

```html
<div class="nb-otp-group">
  <span class="nb-otp-label">Error State</span>
  <div class="nb-otp">
    <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" value="0" aria-invalid="true" />
    <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" value="0" aria-invalid="true" />
    <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" value="0" aria-invalid="true" />
    <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" value="0" aria-invalid="true" />
  </div>
  <span class="nb-otp-error">Invalid code. Please try again.</span>
</div>
```

### Masked OTP

```html
<div class="nb-otp nb-otp-masked">
  <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" value="1" />
  <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" value="2" />
  <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" value="3" />
  <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" value="4" />
  <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" value="5" />
  <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" value="6" />
</div>
```
