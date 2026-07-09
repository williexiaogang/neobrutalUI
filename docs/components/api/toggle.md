# Toggle API

> **Component**: Toggle  
> **Category**: Forms  
> **Base class**: `.nb-toggle`  
> **Status**: Ready

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-toggle` | Component | Base switch/toggle input. Required. |

### Class Combination Examples

```html
<!-- Basic toggle -->
<label class="nb-cluster">
  <input class="nb-toggle" type="checkbox" checked />
  <span>Airplane mode</span>
</label>
```

---

## DOM Contract

### Recommended Structure

```html
<label class="nb-field-inline">
  <input class="nb-toggle" type="checkbox" role="switch" checked />
  <span class="nb-field-label">Notifications</span>
</label>
```

### Semantic Element

- **Preferred**: `<input type="checkbox">` with `role="switch"`.
- Wrap in a `<label>` for click target and accessibility.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `type="checkbox"` | Yes | `"checkbox"` | Required for switch behavior. |
| `role="switch"` | Recommended | `"switch"` | Communicates switch semantics to assistive tech. |
| `id` | Recommended | Unique string | Pair with `<label for="...">` if not wrapped in a label. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-checked` | Managed automatically by the browser; generally not needed for native checkbox switches. |
| `aria-label` | If no visible label text is present. |
| `aria-describedby` | Reference helper or error text. |
| `disabled` | When the switch is not interactive. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus to the toggle. |
| `Space` | Toggles the switch on/off. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ❌ Not styled | — | No explicit hover styles. |
| **focus** | ✅ | `.nb-toggle:focus-visible` | `outline: 2px solid var(--nb-focus); outline-offset: 2px;` |
| **focus-visible** | ✅ | `:focus-visible` | Same as focus outline. |
| **disabled** | ✅ | `.nb-toggle:disabled` | `opacity: 0.5`, `cursor: not-allowed`. |
| **checked** | ✅ | `.nb-toggle:checked` | Background turns `--nb-primary`; thumb slides to the right (reverses in RTL). |
| **active** | ❌ Not styled | — | No explicit active styles. |
| **invalid / readonly / loading** | ❌ Not applicable | — | Not applicable. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

`.nb-toggle` is a pill-shaped switch with an animated thumb:

```css
.nb-toggle {
  appearance: none;
  inline-size: 2.75rem;
  block-size: 1.5rem;
  border: var(--nb-border-width) solid var(--nb-border);
  border-radius: 9999px;
  background: var(--nb-base-300);
  box-shadow: inset 0 0 0 0 var(--nb-primary);
  position: relative;
  cursor: pointer;
  transition: background var(--nb-duration-normal) var(--nb-ease-in-out);
}

.nb-toggle::after {
  content: "";
  position: absolute;
  inset-block-start: 2px;
  inset-inline-start: 2px;
  inline-size: calc(1.5rem - 6px);
  block-size: calc(1.5rem - 6px);
  border: var(--nb-border-width) solid var(--nb-border);
  border-radius: 9999px;
  background: var(--nb-base-100);
  box-shadow: var(--nb-shadow-sm);
  transition: transform var(--nb-duration-normal) var(--nb-ease-in-out);
}

.nb-toggle:checked {
  background: var(--nb-primary);
}

.nb-toggle:checked::after {
  transform: translateX(1.25rem);
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-toggle,
  .nb-toggle::after {
    transition: none;
  }
}
```

### RTL

The thumb animation flips in right-to-left layouts:

```css
[dir="rtl"] .nb-toggle:checked::after {
  transform: translateX(-1.25rem);
}
```

---

## Examples

### Basic Toggle

```html
<label class="nb-cluster">
  <input class="nb-toggle" type="checkbox" checked />
  <span>Airplane mode</span>
</label>
<label class="nb-cluster">
  <input class="nb-toggle" type="checkbox" />
  <span>Bluetooth</span>
</label>
```

### Accessible Switch

```html
<label class="nb-field-inline">
  <input class="nb-toggle" type="checkbox" role="switch" id="notifications" />
  <span class="nb-field-label">Enable notifications</span>
</label>
```

### Disabled Toggle

```html
<label class="nb-field-inline">
  <input class="nb-toggle" type="checkbox" role="switch" disabled checked />
  <span class="nb-field-label">Always on</span>
</label>
```
