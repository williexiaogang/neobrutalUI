# Checkbox API

> **Component**: Checkbox  
> **Category**: Forms  
> **Base class**: `.nb-checkbox`  
> **Status**: Ready

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-checkbox` | Component | Base checkbox class. Required. |
| `.nb-radio` | Component | Radio button. Shares most styles with checkbox but uses circular shape. |

> **Note**: No color, size, or variant modifiers exist for Checkbox or Radio in the current CSS build. Both use `--nb-primary` for the checked state.

---

## DOM Contract

### Recommended Structure (Checkbox)

```html
<label>
  <input class="nb-checkbox" type="checkbox" name="terms" />
  <span>I agree to the terms and conditions</span>
</label>
```

### Recommended Structure (With ARIA)

```html
<div>
  <input
    class="nb-checkbox"
    type="checkbox"
    id="newsletter"
    name="newsletter"
    aria-describedby="newsletter-desc"
  />
  <label for="newsletter">Subscribe to newsletter</label>
  <span id="newsletter-desc">Receive weekly updates about our products.</span>
</div>
```

### Recommended Structure (Indeterminate)

```html
<label>
  <input class="nb-checkbox" type="checkbox" id="projects" />
  <span>Some projects selected</span>
</label>

<script>
  document.getElementById("projects").indeterminate = true;
</script>
```

### Recommended Structure (Radio Group)

```html
<fieldset>
  <legend>Choose a plan</legend>
  <div>
    <input class="nb-radio" type="radio" id="plan-free" name="plan" value="free" />
    <label for="plan-free">Free</label>
  </div>
  <div>
    <input class="nb-radio" type="radio" id="plan-pro" name="plan" value="pro" checked />
    <label for="plan-pro">Pro</label>
  </div>
  <div>
    <input class="nb-radio" type="radio" id="plan-team" name="plan" value="team" />
    <label for="plan-team">Team</label>
  </div>
</fieldset>
```

### Semantic Elements

| Element | Usage |
|---------|-------|
| `<input type="checkbox">` | Binary selection ( Checkbox). |
| `<input type="radio">` | Single selection within a group (Radio). |
| `<label>` | Always associate with the input via `for` attribute or nesting. |
| `<fieldset>` | Group related radio buttons. |
| `<legend>` | Describe the radio group purpose. |

### Required Attributes

| Attribute | Required? | Notes |
|-----------|-----------|-------|
| `type="checkbox"` / `type="radio"` | Yes | Distinguishes checkbox from radio. |
| `name` | Yes (Radio) | All radios in a group must share the same `name`. |
| `value` | Recommended | Sent with form data. |

### ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-checked` | Managed by browser for native inputs. Required for custom implementations only. |
| `aria-describedby` | Reference helper text or error message. |
| `aria-invalid="true"` | When validation fails (e.g., required checkbox not checked). |
| `disabled` | When the control is not interactive. |

### Keyboard Behavior

#### Checkbox

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus to the checkbox. |
| `Space` | Toggles checked state. |

#### Radio Group

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus into the radio group (to the checked radio, or first if none checked). |
| `Space` | Selects the focused radio if not already selected. |
| `Arrow Up` / `Arrow Left` | Moves focus and selection to the previous radio in the group. |
| `Arrow Down` / `Arrow Right` | Moves focus and selection to the next radio in the group. |

---

## State Matrix

### Checkbox

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ (implicit) | Browser default | No explicit hover styles. Native cursor change applies. |
| **active** | ✅ (implicit) | Browser default | No explicit active styles. |
| **focus-visible** | ✅ | `:focus-visible` (global) | `outline: 3px solid var(--nb-focus); outline-offset: 2px;` |
| **disabled** | ✅ | `.nb-checkbox:disabled` | `opacity: 0.5`, `cursor: not-allowed`. |
| **checked** | ✅ | `.nb-checkbox:checked` | Background fills with `--nb-primary`, border changes. Pseudo-element renders a checkmark. |
| **indeterminate** | ✅ | `.nb-checkbox:indeterminate` | Background fills with `--nb-primary`; pseudo-element renders a horizontal mixed-state mark. |
| **invalid** | ❌ Not styled | `:invalid` / `[aria-invalid="true"]` | No custom invalid styling. |

### Radio

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ (implicit) | Browser default | No explicit hover styles. |
| **active** | ✅ (implicit) | Browser default | No explicit active styles. |
| **focus-visible** | ✅ | `:focus-visible` (global) | `outline: 3px solid var(--nb-focus); outline-offset: 2px;` |
| **disabled** | ✅ | `.nb-radio:disabled` | `opacity: 0.5`, `cursor: not-allowed`. |
| **checked** | ✅ | `.nb-radio:checked` | Background fills with `--nb-primary`, border changes. Pseudo-element renders a filled circle. |
| **invalid** | ❌ Not styled | `:invalid` / `[aria-invalid="true"]` | No custom invalid styling. |

---

## CSS Implementation Notes

### Shared Base Styles

`.nb-checkbox` and `.nb-radio` share a common base:

```css
.nb-checkbox, .nb-radio {
  appearance: none;
  inline-size: 1.25rem;      /* 20px */
  block-size: 1.25rem;       /* 20px */
  border: var(--nb-border-width) solid var(--nb-border);
  background: var(--nb-base-100);
  box-shadow: var(--nb-shadow-sm);
  cursor: pointer;
  display: inline-grid;
  place-content: center;
  vertical-align: middle;
  transition: background var(--nb-duration-fast) var(--nb-ease-out);
}
```

### Shape Differences

```css
.nb-checkbox {
  border-radius: var(--nb-radius-selector);   /* 0px — square */
}

.nb-radio {
  border-radius: 9999px;                       /* Circle — functional exception */
}
```

### Checked State

```css
.nb-checkbox:checked, .nb-radio:checked {
  background: var(--nb-primary);
  border-color: var(--nb-border);
}
```

### Checkmark (Checkbox)

```css
.nb-checkbox:checked::after {
  content: "";
  inline-size: 0.5rem;
  block-size: 0.875rem;
  border: solid var(--nb-primary-content);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) translate(-1px, -1px);
}
```

### Indeterminate Mark (Checkbox)

```css
.nb-checkbox:indeterminate::after {
  content: "";
  inline-size: 0.75rem;
  block-size: 0.1875rem;
  background: var(--nb-primary-content);
}
```

### Filled Circle (Radio)

```css
.nb-radio:checked::after {
  content: "";
  inline-size: 0.5rem;
  block-size: 0.5rem;
  border-radius: 9999px;
  background: var(--nb-primary-content);
}
```

### Disabled State

```css
.nb-checkbox:disabled, .nb-radio:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-checkbox, .nb-radio {
    transition: none;
  }
}
```

---

## Examples

### Basic Checkbox

```html
<label>
  <input class="nb-checkbox" type="checkbox" name="subscribe" />
  <span>Subscribe to newsletter</span>
</label>
```

### Checked by Default

```html
<label>
  <input class="nb-checkbox" type="checkbox" name="agree" checked />
  <span>I agree to the terms</span>
</label>
```

### Disabled Checkbox

```html
<label>
  <input class="nb-checkbox" type="checkbox" name="disabled-opt" disabled />
  <span>Unavailable option</span>
</label>
```

### Radio Group

```html
<fieldset>
  <legend>Notification preferences</legend>
  <label>
    <input class="nb-radio" type="radio" name="notifications" value="all" checked />
    <span>All notifications</span>
  </label>
  <label>
    <input class="nb-radio" type="radio" name="notifications" value="important" />
    <span>Important only</span>
  </label>
  <label>
    <input class="nb-radio" type="radio" name="notifications" value="none" />
    <span>None</span>
  </label>
</fieldset>
```

### Checkbox with ARIA

```html
<div>
  <input
    class="nb-checkbox"
    type="checkbox"
    id="marketing"
    name="marketing"
    aria-describedby="marketing-desc"
  />
  <label for="marketing">Receive marketing emails</label>
  <p id="marketing-desc">You can unsubscribe at any time.</p>
</div>
```

---

## Known Issues

- Indeterminate state styling is not implemented.
- Label association examples and documentation are in progress.
- Radio group keyboard navigation documentation is in progress.
- No explicit invalid/error styling for checkboxes or radios.
