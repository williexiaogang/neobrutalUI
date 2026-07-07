# Field API

> **Component**: Field  
> **Category**: Forms  
> **Base class**: `.nb-field`  
> **Status**: Beta (CSS visual layer implemented; wrapper, group, row, and inline layouts available)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-field` | Component | Base field wrapper. Holds a label, control, and helper/error text. |
| `.nb-field-label` | Part | Bold label text for the control. |
| `.nb-field-description` | Part | Muted helper text shown below the control. |
| `.nb-field-hint` | Part | Italic, muted supplementary text (often used inside field groups). |
| `.nb-field-error` | Part | Bold error message in error color. |
| `.nb-field-required` | State | Adds a red asterisk after the label text. |
| `.nb-field-row` | Layout | Flex row layout for side-by-side fields. |
| `.nb-field-inline` | Layout | Inline flex layout for checkboxes, radios, and toggles with labels. |
| `.nb-field-group` | Component | Fieldset-like grouped container with border, padding, and shadow. |
| `.nb-field-group-legend` | Part | Legend-style title for `.nb-field-group`. |

### Class Combination Examples

```html
<!-- Basic field wrapper -->
<div class="nb-field">
  <label class="nb-field-label" for="email">Email</label>
  <input class="nb-input" id="email" type="email" />
  <span class="nb-field-description">We'll never share your email.</span>
</div>

<!-- Required field with error -->
<div class="nb-field nb-field-required">
  <label class="nb-field-label" for="password">Password</label>
  <input class="nb-input" id="password" type="password" aria-invalid="true" />
  <span class="nb-field-error">Password must be at least 8 characters.</span>
</div>

<!-- Inline checkbox group -->
<fieldset class="nb-field-group">
  <legend class="nb-field-group-legend">Preferences</legend>
  <label class="nb-field-inline">
    <input type="checkbox" class="nb-checkbox" />
    <span class="nb-field-label">Subscribe</span>
  </label>
  <span class="nb-field-hint">You can change these anytime.</span>
</fieldset>

<!-- Row layout -->
<div class="nb-field-row">
  <div class="nb-field">
    <label class="nb-field-label">First name</label>
    <input class="nb-input" type="text" />
  </div>
  <div class="nb-field">
    <label class="nb-field-label">Last name</label>
    <input class="nb-input" type="text" />
  </div>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-field">
  <label class="nb-field-label" for="username">Username</label>
  <input class="nb-input" id="username" type="text" name="username" />
  <span class="nb-field-description">Choose a unique username.</span>
</div>
```

### Semantic Element

- **Preferred**: `<div class="nb-field">` wrapping a `<label>` + control + optional description/error.
- **Group**: `<fieldset class="nb-field-group">` with `<legend class="nb-field-group-legend">` for related controls.
- Labels should use `for` to reference control `id`; or wrap the control directly in a `<label>`.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `for` | Recommended | Control `id` | Associates the visible label with the control. |
| `id` | Recommended | Unique string | Required when using `for` on the label. |
| `name` | Recommended | Form field name | Required for form submission. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-describedby` | Points to `.nb-field-description` or `.nb-field-error` to describe the control. |
| `aria-invalid="true"` | On the control when validation fails. Also triggers the error border on `.nb-field`. |
| `aria-required="true"` | When the control is required (redundant if `required` attribute is present). |
| `role="alert"` | On `.nb-field-error` if it appears dynamically. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus through label, control, and any focusable children inside `.nb-field`. |
| Standard typing | Delegated to the inner form control. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ❌ Not applicable | — | No hover styles on the wrapper itself. |
| **focus** | ❌ Not applicable | — | Focus styling is applied to the inner control (e.g. `.nb-input`). |
| **focus-visible** | ✅ (inner control) | `:focus-visible` on control | Global focus outline on the focused control. |
| **disabled** | ✅ (inner control) | Control `:disabled` | Inherited by control styling; wrapper does not change. |
| **invalid** | ✅ | `.nb-field:has([aria-invalid="true"])` | Red left border and padding on `.nb-field`; `.nb-field-label` turns error color. |
| **readonly** | ❌ Not styled | — | No wrapper-level readonly styling. |
| **required** | ✅ | `.nb-field-required` | Appends `" *"` to the label in error color. |
| **active / loading** | ❌ Not applicable | — | Not applicable to the field wrapper. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

`.nb-field` uses a flex column with a small gap:

```css
.nb-field {
  display: flex;
  flex-direction: column;
  gap: var(--nb-space-1);
}
```

`.nb-field-group` provides a bordered surface similar to a fieldset:

```css
.nb-field-group {
  display: flex;
  flex-direction: column;
  gap: var(--nb-space-3);
  padding: var(--nb-space-4);
  border: var(--nb-border-width) solid var(--nb-border);
  border-radius: var(--nb-radius-box);
  background: var(--nb-base-100);
  box-shadow: var(--nb-shadow-md);
}
```

### Reduced Motion

No transitions or animations on `.nb-field` or its parts; reduced-motion is not applicable.

### RTL

Uses logical properties; no special RTL overrides needed.

---

## Examples

### Basic Field

```html
<div class="nb-field">
  <label class="nb-field-label" for="email">Email</label>
  <input class="nb-input" id="email" type="email" placeholder="you@example.com" />
  <span class="nb-field-description">We'll never share your email with anyone.</span>
</div>
```

### Required Field with Error

```html
<div class="nb-field nb-field-required">
  <label class="nb-field-label" for="password">Password</label>
  <input class="nb-input" id="password" type="password" value="short" aria-invalid="true" />
  <span class="nb-field-error">Password must be at least 8 characters.</span>
</div>
```

### Field Group with Inline Controls

```html
<fieldset class="nb-field-group">
  <legend class="nb-field-group-legend">Preferences</legend>
  <label class="nb-field-inline">
    <input type="checkbox" class="nb-checkbox" checked />
    <span class="nb-field-label">Enable notifications</span>
  </label>
  <label class="nb-field-inline">
    <input type="checkbox" class="nb-checkbox" />
    <span class="nb-field-label">Subscribe to newsletter</span>
  </label>
  <span class="nb-field-hint">You can change these settings anytime.</span>
</fieldset>
```

### Side-by-Side Fields

```html
<div class="nb-field-row">
  <div class="nb-field">
    <label class="nb-field-label">First name</label>
    <input class="nb-input" type="text" placeholder="Jane" />
  </div>
  <div class="nb-field">
    <label class="nb-field-label">Last name</label>
    <input class="nb-input" type="text" placeholder="Doe" />
  </div>
</div>
```
