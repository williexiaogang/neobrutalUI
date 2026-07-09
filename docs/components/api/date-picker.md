# Date Picker API

> **Component**: Date Picker  
> **Category**: Forms  
> **Base class**: `.nb-date-picker`  
> **Status**: Ready

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-date-picker` | Component | Root wrapper for the input and dropdown panel. Required. |
| `.nb-date-picker-input` | Component | Trigger area containing the input text and optional calendar button. |
| `.nb-date-picker-input-icon` | Part | Icon inside the input trigger. |
| `.nb-date-picker-input-placeholder` | Part | Placeholder text style inside the input trigger. |
| `.nb-date-picker-panel` | Component | Dropdown panel containing the calendar and footer. |
| `.nb-date-picker-footer` | Part | Footer bar with action buttons. |
| `.nb-date-picker-footer-actions` | Part | Container for footer action buttons. |
| `.nb-date-picker-footer-btn` | Part | Footer action button (e.g., Today, Clear). |
| `.nb-date-picker-footer-btn-primary` | Variant | Primary-styled footer button. |
| `.nb-date-picker-range` | Variant | Wide panel layout for dual-calendar range mode. |
| `.nb-date-picker-calendars` | Part | Container holding two calendars in range mode. |
| `.nb-date-picker-inline` | Variant | Always-visible panel with no input trigger. |
| `.nb-date-picker-sm` | Size | Smaller input padding and icon size. |
| `.nb-date-picker-lg` | Size | Larger input padding and icon size. |
| `.nb-date-picker-primary` | Color | Primary accent color. |
| `.nb-date-picker-secondary` | Color | Secondary accent color. |
| `.nb-date-picker-accent` | Color | Accent color. |
| `.nb-date-picker-neutral` | Color | Neutral accent color. |
| `.nb-date-picker-info` | Color | Info accent color. |
| `.nb-date-picker-success` | Color | Success accent color. |
| `.nb-date-picker-warning` | Color | Warning accent color. |
| `.nb-date-picker-error` | Color | Error accent color. |

### Class Combination Examples

```html
<!-- Single date picker -->
<div class="nb-date-picker">
  <div class="nb-date-picker-input">
    <input type="text" placeholder="Select a date" readonly />
    <button class="nb-btn nb-btn-sm" type="button" aria-label="Open calendar">📅</button>
  </div>
  <div class="nb-date-picker-panel">
    <div class="nb-calendar nb-calendar-sm">...</div>
    <div class="nb-date-picker-footer">
      <button class="nb-date-picker-footer-btn" type="button">Today</button>
      <button class="nb-date-picker-footer-btn" type="button">Clear</button>
    </div>
  </div>
</div>

<!-- Inline always-visible picker -->
<div class="nb-date-picker nb-date-picker-inline nb-date-picker-primary">
  <div class="nb-calendar nb-calendar-compact">...</div>
</div>

<!-- Range date picker -->
<div class="nb-date-picker nb-date-picker-range">
  <div class="nb-date-picker-input">
    <input type="text" placeholder="Start date" readonly />
    <span>→</span>
    <input type="text" placeholder="End date" readonly />
    <button class="nb-btn nb-btn-sm" type="button" aria-label="Open calendar">📅</button>
  </div>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-date-picker" role="combobox" aria-expanded="false" aria-haspopup="dialog" aria-label="Choose a date">
  <div class="nb-date-picker-input">
    <input type="text" placeholder="Select a date" readonly />
    <button class="nb-btn nb-btn-sm" type="button" aria-label="Open calendar">📅</button>
  </div>
  <div class="nb-date-picker-panel" role="dialog" aria-label="Calendar dialog" data-open>
    <div class="nb-calendar nb-calendar-sm">
      <!-- calendar markup -->
    </div>
    <div class="nb-date-picker-footer">
      <div class="nb-date-picker-footer-actions">
        <button class="nb-date-picker-footer-btn nb-date-picker-footer-btn-primary" type="button">Today</button>
        <button class="nb-date-picker-footer-btn" type="button">Clear</button>
      </div>
    </div>
  </div>
</div>
```

### Semantic Element

- **Preferred**: The root should be a `<div>` with `role="combobox"` or a `<label>` wrapping the input. The panel should use `role="dialog"`. Use native `<input>` and `<button>` elements for the trigger.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `type` | Yes (buttons/input) | `"text"`, `"button"` | Use `readonly` on the text input to prevent direct typing. |
| `readonly` | Recommended (input) | — | Indicates the value is selected from the panel, not typed. |
| `aria-expanded` | Recommended | `"true"` / `"false"` | Communicates panel state. |
| `aria-haspopup` | Recommended | `"dialog"` | Indicates the trigger opens a dialog. |
| `aria-label` | Recommended | Descriptive text | On the root, trigger button, and dialog panel. |
| `data-open` | When open | — | Shows the dropdown panel (`display: block`). |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `role="combobox"` | On the root or trigger wrapper for input-triggered pickers. |
| `role="dialog"` | On the dropdown panel. |
| `aria-expanded` | On the trigger or root to indicate panel state. |
| `aria-controls` | Links the trigger to the panel ID. |
| `aria-label` / `aria-labelledby` | Describes the picker and the currently selected date. |
| `aria-live="polite"` | On the input to announce selected date changes. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus between the input trigger, calendar grid, and footer buttons. |
| `Enter` / `Space` | Opens the panel when focus is on the trigger; selects a focused day. |
| `Escape` | Closes the panel (JS optional). |
| `Arrow*` / `PageUp` / `PageDown` | Navigates the calendar grid (JS optional). |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ (input) | `.nb-date-picker-input:hover:not(:disabled)` | Shadow elevates to `--nb-shadow-md`. |
| **hover** | ✅ (footer btn) | `.nb-date-picker-footer-btn:hover:not(:disabled)` | Shadow elevates; button translates up 1px. |
| **active** | ✅ (footer btn) | `.nb-date-picker-footer-btn:active:not(:disabled)` | Shadow drops; button translates down 1px. |
| **focus-visible** | ✅ | `.nb-date-picker-input:focus-visible` | `outline: 2px solid var(--nb-focus); outline-offset: 2px;` |
| **disabled** | ✅ | `.nb-date-picker-input:disabled` | `opacity: 0.6`, `cursor: not-allowed`, no shadow. |
| **open** | ✅ | `.nb-date-picker-panel[data-open]` | Panel becomes visible (`display: block`). |
| **selected** | ✅ | Inherited from `.nb-calendar-day-selected` | Day cell uses accent colors. |
| **today** | ✅ | Inherited from `.nb-calendar-day-today` | Day cell border uses accent color. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

The date picker is an inline-flex column positioned relatively. The panel is absolutely placed below the input with a large shadow. The range variant increases panel width and lays out two calendars side by side.

```css
.nb-date-picker-panel {
  position: absolute;
  inset-block-start: calc(100% + var(--nb-space-1));
  inset-inline-start: 0;
  z-index: 50;
  display: none;
  inline-size: var(--_panel-width);
  padding: var(--nb-space-3);
  border: var(--nb-border-width) solid var(--nb-border);
  border-radius: var(--nb-radius-box);
  background: var(--_panel-bg);
  box-shadow: var(--_panel-shadow);
}

.nb-date-picker-panel[data-open] {
  display: block;
}
```

The inline variant removes the input trigger and makes the panel static and always visible.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-date-picker-input,
  .nb-date-picker-footer-btn {
    transition: none;
  }
}
```

### RTL

Uses logical properties (`inset-inline-start`, `inset-block-start`, `margin-inline-start`, etc.); no special RTL overrides needed.

---

## Examples

### Single Date Picker

```html
<div class="nb-date-picker">
  <div class="nb-date-picker-input">
    <input type="text" placeholder="Select a date" value="Jun 11, 2025" readonly style="inline-size: 100%;" />
    <button class="nb-btn nb-btn-sm" type="button" aria-label="Open calendar">📅</button>
  </div>
  <div class="nb-date-picker-panel" role="dialog" aria-label="Choose a date">
    <div class="nb-calendar nb-calendar-sm">...</div>
    <div class="nb-date-picker-footer">
      <div class="nb-date-picker-footer-actions">
        <button class="nb-date-picker-footer-btn nb-date-picker-footer-btn-primary" type="button">Today</button>
        <button class="nb-date-picker-footer-btn" type="button">Clear</button>
      </div>
    </div>
  </div>
</div>
```

### Inline Date Picker

```html
<div class="nb-date-picker nb-date-picker-inline nb-date-picker-primary">
  <div class="nb-calendar nb-calendar-compact">
    <div class="nb-calendar-header">...</div>
    <div class="nb-calendar-grid">...</div>
  </div>
</div>
```

### Range Date Picker

```html
<div class="nb-date-picker nb-date-picker-range">
  <div class="nb-date-picker-input">
    <input type="text" placeholder="Start date" value="Jun 16, 2025" readonly />
    <span>→</span>
    <input type="text" placeholder="End date" value="Jun 19, 2025" readonly />
    <button class="nb-btn nb-btn-sm" type="button" aria-label="Open calendar">📅</button>
  </div>
  <div class="nb-date-picker-panel" role="dialog" aria-label="Choose a date range">
    <div class="nb-date-picker-calendars">
      <div class="nb-calendar">...</div>
      <div class="nb-calendar">...</div>
    </div>
    <div class="nb-date-picker-footer">
      <button class="nb-date-picker-footer-btn nb-date-picker-footer-btn-primary" type="button">Today</button>
      <button class="nb-date-picker-footer-btn" type="button">Clear</button>
    </div>
  </div>
</div>
```

### Size Variants

```html
<div class="nb-date-picker nb-date-picker-sm">...</div>
<div class="nb-date-picker nb-date-picker-lg">...</div>
```

### Color Variants

```html
<div class="nb-date-picker nb-date-picker-primary">...</div>
<div class="nb-date-picker nb-date-picker-accent">...</div>
<div class="nb-date-picker nb-date-picker-success">...</div>
```
