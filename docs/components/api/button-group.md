# Button Group API

> **Component**: Button Group  
> **Category**: Actions  
> **Base class**: `.nb-btn-group`  
> **Status**: Ready (horizontal, vertical, block layouts, hover/active/disabled states, focus-visible, group ARIA guidance, reduced-motion, and forced-colors support included)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-btn-group` | Component | Joined button group container. Required. |
| `.nb-btn-group-vertical` | Layout | Stacks buttons vertically. |
| `.nb-btn-group-block` | Layout | Makes the group full-width with equal button distribution. |

### Class Combination Examples

```html
<!-- Horizontal group -->
<div class="nb-btn-group">
  <button class="nb-btn" type="button">Left</button>
  <button class="nb-btn" type="button">Center</button>
  <button class="nb-btn" type="button">Right</button>
</div>

<!-- Vertical group -->
<div class="nb-btn-group nb-btn-group-vertical">
  <button class="nb-btn nb-btn-primary" type="button">Top</button>
  <button class="nb-btn nb-btn-primary" type="button">Middle</button>
  <button class="nb-btn nb-btn-primary" type="button">Bottom</button>
</div>

<!-- Full-width block group -->
<div class="nb-btn-group nb-btn-group-block">
  <button class="nb-btn nb-btn-primary" type="button">Confirm</button>
  <button class="nb-btn" type="button">Cancel</button>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-btn-group" role="group" aria-label="Text alignment">
  <button class="nb-btn" type="button">Left</button>
  <button class="nb-btn" type="button">Center</button>
  <button class="nb-btn" type="button">Right</button>
</div>
```

### Semantic Element

- **Preferred**: `<div>` with `role="group"`.
- **Buttons**: Use standard `<button>` elements with `.nb-btn` classes inside the group.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `role="group"` | Recommended | `"group"` | Communicates the related grouping to assistive tech. |
| `aria-label` | Recommended | Description of the group | Names the group when no visible label is present. |
| `type="button"` | Recommended | `"button"` | Prevents accidental form submission. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-label` | When the button group lacks a visible label. |
| `aria-pressed` | For toggle buttons inside the group. |
| `disabled` | For buttons that are not interactive. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus between buttons in the group. |
| `Enter` / `Space` | Activates the focused button. |
| `ArrowLeft` / `ArrowRight` | Optional JS behavior for moving focus between grouped buttons. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ | `.nb-btn-group .nb-btn:hover:not(:disabled)` | Button translates up 1px (`translate(0, -1px)`). |
| **active** | ✅ | `.nb-btn-group .nb-btn:active:not(:disabled)` | Button translates down 1px (`translate(0, 1px)`). |
| **focus-visible** | ✅ | `.nb-btn-group .nb-btn:focus-visible` | `outline: 2px solid var(--nb-focus)` with -2px inset offset and `z-index: 1`. |
| **disabled** | ✅ | `.nb-btn-group .nb-btn:disabled` | `opacity: 0.6`, `cursor: not-allowed`, transform reset. |
| **selected** | ❌ Not styled | — | No dedicated selected state in the button-group layer; use button color/variant classes. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

- The group wraps child buttons in a single shared border and shadow.
- Child buttons lose their individual border, border-radius, and shadow.
- Buttons are separated by an inline-end border (or block-end border for vertical).
- Block groups expand to full width and distribute buttons equally with `flex: 1 1 0%`.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-btn-group .nb-btn {
    transition: none;
  }
}
```

### RTL

Uses logical properties (`border-inline-end`, `border-block-end`, `inline-size`); no special RTL overrides needed.

---

## Examples

### Basic Group

```html
<div class="nb-btn-group">
  <button class="nb-btn" type="button">Left</button>
  <button class="nb-btn" type="button">Center</button>
  <button class="nb-btn" type="button">Right</button>
</div>
```

### With Color Variants

```html
<div class="nb-btn-group">
  <button class="nb-btn nb-btn-primary" type="button">Save</button>
  <button class="nb-btn nb-btn-secondary" type="button">Edit</button>
  <button class="nb-btn nb-btn-accent" type="button">Delete</button>
</div>
```

### Vertical Group

```html
<div class="nb-btn-group nb-btn-group-vertical">
  <button class="nb-btn nb-btn-primary" type="button">Top</button>
  <button class="nb-btn nb-btn-primary" type="button">Middle</button>
  <button class="nb-btn nb-btn-primary" type="button">Bottom</button>
</div>
```

### Block Group

```html
<div class="nb-btn-group nb-btn-group-block">
  <button class="nb-btn nb-btn-primary" type="button">Confirm</button>
  <button class="nb-btn" type="button">Cancel</button>
</div>
```

### Disabled Button in a Group

```html
<div class="nb-btn-group">
  <button class="nb-btn nb-btn-primary" type="button">Active</button>
  <button class="nb-btn" type="button" disabled>Disabled</button>
  <button class="nb-btn nb-btn-secondary" type="button">Normal</button>
</div>
```
