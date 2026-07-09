# Radio API

> **Component**: Radio  
> **Category**: Forms  
> **Base class**: `.nb-radio`  
> **Status**: Ready

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-radio` | Component | Base radio input. Required. |

> **Note**: `.nb-radio` shares a base reset with `.nb-checkbox` in `selector.css`. Only radio-specific styles are documented here.

### Class Combination Examples

```html
<!-- Basic radio group -->
<label class="nb-cluster">
  <input class="nb-radio" type="radio" name="option" checked />
  <span>Option A</span>
</label>
<label class="nb-cluster">
  <input class="nb-radio" type="radio" name="option" />
  <span>Option B</span>
</label>
```

---

## DOM Contract

### Recommended Structure

```html
<fieldset class="nb-field-group">
  <legend class="nb-field-group-legend">Choose one</legend>
  <label class="nb-field-inline">
    <input class="nb-radio" type="radio" name="plan" value="free" />
    <span class="nb-field-label">Free</span>
  </label>
  <label class="nb-field-inline">
    <input class="nb-radio" type="radio" name="plan" value="pro" checked />
    <span class="nb-field-label">Pro</span>
  </label>
</fieldset>
```

### Semantic Element

- **Preferred**: `<input type="radio">` inside a `<label>`.
- Group related radios with the same `name` attribute.
- For larger groups, wrap in `<fieldset>` with `<legend>`.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `type="radio"` | Yes | `radio` | Required for radio behavior. |
| `name` | Yes | Shared group name | Only one radio per group can be checked. |
| `value` | Recommended | Option value | Required for form submission. |
| `id` | Recommended | Unique string | Needed when label uses `for`. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-checked` | Managed automatically by the browser; generally not needed for native radios. |
| `aria-describedby` | Reference helper or error text. |
| `disabled` | When the option is not interactive. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus to the checked radio in the group, or to the first radio if none is checked. |
| `↑` / `↓` / `←` / `→` | Changes the checked option within the same `name` group. |
| `Space` | Checks the focused radio if it is not already checked. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ❌ Not styled | — | No explicit hover styles. |
| **focus** | ✅ | `.nb-radio:focus-visible` | `outline: 2px solid var(--nb-focus); outline-offset: 2px;` |
| **focus-visible** | ✅ | `:focus-visible` | Same as focus outline. |
| **disabled** | ✅ | `.nb-radio:disabled` | `opacity: 0.5`, `cursor: not-allowed`. |
| **checked** | ✅ | `.nb-radio:checked` | Background turns `--nb-primary`; shows filled dot via `::after`. |
| **invalid** | ❌ Not styled | — | No explicit invalid styling. |
| **readonly / loading** | ❌ Not applicable | — | Not applicable. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

`.nb-radio` is a 1.25rem circular selector with a custom checked dot:

```css
.nb-radio {
  appearance: none;
  inline-size: 1.25rem;
  block-size: 1.25rem;
  border: var(--nb-border-width) solid var(--nb-border);
  border-radius: 9999px;
  background: var(--nb-base-100);
  box-shadow: var(--nb-shadow-sm);
  cursor: pointer;
  display: inline-grid;
  place-content: center;
  vertical-align: middle;
  transition: background var(--nb-duration-fast) var(--nb-ease-out);
}

.nb-radio:checked {
  background: var(--nb-primary);
  border-color: var(--nb-border);
}

.nb-radio:checked::after {
  content: "";
  inline-size: 0.5rem;
  block-size: 0.5rem;
  border-radius: 9999px;
  background: var(--nb-primary-content);
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-radio {
    transition: none;
  }
}
```

### RTL

Uses logical properties; no special RTL overrides needed.

---

## Examples

### Basic Radio Group

```html
<label class="nb-cluster">
  <input class="nb-radio" type="radio" name="radio-demo" checked />
  <span>Option A</span>
</label>
<label class="nb-cluster">
  <input class="nb-radio" type="radio" name="radio-demo" />
  <span>Option B</span>
</label>
```

### Disabled Radio

```html
<label class="nb-field-inline">
  <input class="nb-radio" type="radio" name="plan" disabled />
  <span class="nb-field-label">Free</span>
</label>
```

### Field Group

```html
<fieldset class="nb-field-group">
  <legend class="nb-field-group-legend">Plan</legend>
  <label class="nb-field-inline">
    <input class="nb-radio" type="radio" name="plan" value="free" />
    <span class="nb-field-label">Free</span>
  </label>
  <label class="nb-field-inline">
    <input class="nb-radio" type="radio" name="plan" value="pro" checked />
    <span class="nb-field-label">Pro</span>
  </label>
</fieldset>
```
