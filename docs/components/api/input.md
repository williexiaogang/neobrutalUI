# Input API

> **Component**: Input  
> **Category**: Forms  
> **Base class**: `.nb-input`  
> **Status**: Beta (focus, disabled, invalid implemented; readonly, valid pending)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-input` | Component | Base text input class. Required. |
| `.nb-textarea` | Component | Multi-line text input. Shares most styles with `.nb-input`. |
| `.nb-select` | Component | Native select dropdown. Shares most styles with `.nb-input`. |
| `.nb-field` | Component | Wrapper for label + control + helper text. |
| `.nb-field-label` | Part | Label text above a control. Bold, small font. |
| `.nb-field-description` | Part | Helper text below a control. Muted color. |
| `.nb-field-error` | Part | Error message below a control. Error color, bold. |

> **Note**: Size variants (`nb-input-sm`, `nb-input-lg`) and color variants (`nb-input-primary`, etc.) are **not implemented** in the current CSS build. Only the base `.nb-input` size exists.

### Class Combination Examples

```html
<!-- Standalone input -->
<input class="nb-input" type="text" placeholder="Enter text..." />

<!-- Input with field wrapper -->
<div class="nb-field">
  <label class="nb-field-label" for="email">Email</label>
  <input class="nb-input" id="email" type="email" />
  <span class="nb-field-description">We'll never share your email.</span>
</div>

<!-- Invalid input -->
<div class="nb-field">
  <label class="nb-field-label" for="username">Username</label>
  <input class="nb-input" id="username" type="text" aria-invalid="true" aria-describedby="username-error" />
  <span class="nb-field-error" id="username-error">Username is required.</span>
</div>
```

---

## DOM Contract

### Recommended Structure (Standalone)

```html
<input class="nb-input" type="text" name="username" placeholder="Username" />
```

### Recommended Structure (With Field Wrapper)

```html
<div class="nb-field">
  <label class="nb-field-label" for="email">Email Address</label>
  <input class="nb-input" id="email" type="email" name="email" />
  <span class="nb-field-description">We’ll never share your email with anyone.</span>
</div>
```

### Recommended Structure (With Error)

```html
<div class="nb-field">
  <label class="nb-field-label" for="password">Password</label>
  <input
    class="nb-input"
    id="password"
    type="password"
    name="password"
    aria-invalid="true"
    aria-describedby="password-error"
  />
  <span class="nb-field-error" id="password-error">Password must be at least 8 characters.</span>
</div>
```

### Semantic Elements

| Element | Usage |
|---------|-------|
| `<input>` | All single-line text inputs. Use appropriate `type` (`text`, `email`, `password`, `number`, `tel`, `url`, `search`, `date`, etc.). |
| `<textarea>` | Multi-line text. Add `rows` attribute for initial height. |
| `<select>` | Single or multiple selection. `<option>` and `<optgroup>` children. |

### Required Attributes

| Attribute | Required? | Notes |
|-----------|-----------|-------|
| `type` | Yes (for `<input>`) | Always specify the input type explicitly. |
| `id` | Recommended | Required for `<label for="...">` association. |
| `name` | Recommended | Required for form submission. |

### ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-label` | If no visible `<label>` exists. |
| `aria-labelledby` | Reference a visible label element by ID. |
| `aria-describedby` | Reference helper text or error message element(s). |
| `aria-invalid="true"` | When validation fails. Triggers the invalid visual state. |
| `aria-required="true"` | When the field is required (redundant if `required` attribute is present). |
| `disabled` | When the field is not interactive. |
| `readonly` | When the field value is visible but not editable. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus into/out of the field. |
| `Enter` | Submits the enclosing form (for `<input>`). Inserts newline (for `<textarea>`). |
| Standard typing | All standard text entry keys function normally. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ (implicit) | Browser default | No explicit hover styles in current CSS. Browser native hover behavior applies. |
| **active** | ✅ (implicit) | Browser default | No explicit active styles. |
| **focus** | ✅ | `.nb-input:focus` | `border-color: var(--nb-focus)`, `box-shadow: var(--nb-shadow-md)`. |
| **focus-visible** | ✅ | `:focus-visible` (global) | `outline: 3px solid var(--nb-focus); outline-offset: 2px;` |
| **disabled** | ✅ | `.nb-input:disabled` | `background: var(--nb-base-200)`, `opacity: 0.7`, `cursor: not-allowed`. |
| **readonly** | ❌ Not styled | `[readonly]` | No explicit readonly styles. Field renders with native browser styling for readonly. |
| **invalid** | ✅ | `.nb-input[aria-invalid="true"]` | `border-color: var(--nb-error)`. |
| **valid** | ❌ Not styled | `:valid` | No explicit valid styles. Valid state is the visual default. |

### State Notes

- **Focus**: The focus state elevates the shadow from `sm` to `md` and changes border color to `--nb-focus`. This is the primary visual indicator for active fields.
- **Invalid**: Only triggered by `[aria-invalid="true"]` (not `:invalid`). This gives JS frameworks control over when validation styling appears.
- **Disabled**: Background changes to `--nb-base-200` and opacity drops to `0.7`. Shadow is not removed (remains `sm`).
- **Readonly / Valid**: These states have no custom styling in the current build. They rely on browser defaults.

---

## CSS Implementation Notes

### Shared Form Field Styles

`.nb-input`, `.nb-textarea`, and `.nb-select` share a common base:

```css
.nb-input, .nb-textarea, .nb-select {
  display: block;
  inline-size: 100%;
  padding: var(--nb-space-2) var(--nb-space-3);
  border: var(--nb-border-width) solid var(--nb-border);
  border-radius: var(--nb-radius-field);    /* 0px */
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

### Textarea Specifics

```css
.nb-textarea {
  resize: vertical;
  min-block-size: 6rem;
}
```

### Select Specifics

```css
.nb-select {
  appearance: none;
  background-image: /* custom chevron arrows */;
  background-position: calc(100% - 1rem) center, calc(100% - 0.625rem) center;
  background-size: 0.375rem 0.375rem, 0.375rem 0.375rem;
  background-repeat: no-repeat;
  padding-inline-end: var(--nb-space-8);
}
```

**RTL Support**: Arrow position flips for `[dir="rtl"]`:

```css
[dir="rtl"] .nb-select {
  background-position: 0.625rem center, 1rem center;
  padding-inline-end: var(--nb-space-3);
  padding-inline-start: var(--nb-space-8);
}
```

### Field Wrapper

```css
.nb-field {
  display: flex;
  flex-direction: column;
  gap: var(--nb-space-1);
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-input, .nb-textarea, .nb-select {
    transition: none;
  }
}
```

---

## Examples

### Basic Inputs

```html
<input class="nb-input" type="text" placeholder="Text input" />
<input class="nb-input" type="email" placeholder="Email input" />
<input class="nb-input" type="password" placeholder="Password input" />
<input class="nb-input" type="number" placeholder="Number input" />
```

### Textarea

```html
<textarea class="nb-textarea" placeholder="Enter your message..."></textarea>
```

### Select

```html
<select class="nb-select">
  <option value="">Choose an option</option>
  <option value="a">Option A</option>
  <option value="b">Option B</option>
</select>
```

### Disabled State

```html
<input class="nb-input" type="text" value="Disabled value" disabled />
```

### Invalid State

```html
<input class="nb-input" type="email" value="not-an-email" aria-invalid="true" />
```

### Complete Form Field

```html
<div class="nb-field">
  <label class="nb-field-label" for="full-name">Full Name</label>
  <input
    class="nb-input"
    id="full-name"
    type="text"
    name="fullName"
    placeholder="Jane Doe"
    required
  />
  <span class="nb-field-description">Enter your legal full name.</span>
</div>
```

### Complete Form Field with Error

```html
<div class="nb-field">
  <label class="nb-field-label" for="email">Email</label>
  <input
    class="nb-input"
    id="email"
    type="email"
    name="email"
    aria-invalid="true"
    aria-describedby="email-error"
  />
  <span class="nb-field-error" id="email-error">Please enter a valid email address.</span>
</div>
```

---

## Known Issues

- Browser autofill styling still needs refinement.
- Prefix/suffix containers for icons or text inside inputs are not yet styled.
- Size variants (`nb-input-sm`, `nb-input-lg`) are not implemented.
- Readonly state has no custom visual treatment.
