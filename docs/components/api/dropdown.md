# Dropdown API

> **Component**: Dropdown  
> **Category**: Overlay  
> **Base class**: `.nb-dropdown`  
> **Status**: Beta (CSS visual layer and JS interaction implemented)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-dropdown` | Component | Wrapper that positions the panel relative to the trigger. Required. |
| `.nb-dropdown-trigger` | Part | Trigger button wrapper; adds inline-flex layout and gap for trigger content. |
| `.nb-dropdown-panel` | Component | The dropdown menu panel. Hidden by default; shown with `.is-open` or via `[aria-expanded="true"]` on the trigger. |
| `.nb-dropdown-start` | Layout | Aligns panel to the inline start edge of the container. |
| `.nb-dropdown-end` | Layout | Aligns panel to the inline end edge of the container. |
| `.nb-dropdown-top` | Layout | Positions panel above the trigger. |
| `.nb-dropdown-bottom` | Layout | Positions panel below the trigger (default). |
| `.nb-dropdown-item` | Component | Individual selectable item. Use on `<button>` or `<a>`. |
| `.nb-dropdown-item-active` | State | Highlights the item as selected/active. |
| `.nb-dropdown-item-disabled` | State | Visual disabled state for an item. |
| `.nb-dropdown-divider` | Part | Horizontal separator between groups. |
| `.nb-dropdown-group-label` | Part | Non-interactive label for a group of items. |
| `.is-open` | State | Toggles `.nb-dropdown-panel` visibility. |

### Class Combination Examples

```html
<!-- Basic dropdown with groups -->
<div class="nb-dropdown" data-nb-dropdown>
  <button class="nb-btn nb-dropdown-trigger" type="button" aria-expanded="false" aria-haspopup="true">
    Options
    <span aria-hidden="true"> ▼</span>
  </button>
  <div class="nb-dropdown-panel">
    <div class="nb-dropdown-group-label">Actions</div>
    <button class="nb-dropdown-item" type="button">Edit</button>
    <button class="nb-dropdown-item" type="button">Duplicate</button>
    <div class="nb-dropdown-divider"></div>
    <div class="nb-dropdown-group-label">Danger</div>
    <button class="nb-dropdown-item" type="button" style="color: var(--nb-error);">Delete</button>
  </div>
</div>

<!-- End-aligned panel -->
<div class="nb-dropdown">
  <button class="nb-btn nb-dropdown-trigger" type="button" aria-expanded="false">Align End</button>
  <div class="nb-dropdown-panel nb-dropdown-end">
    <button class="nb-dropdown-item" type="button">Item</button>
  </div>
</div>

<!-- Top placement -->
<div class="nb-dropdown">
  <button class="nb-btn nb-dropdown-trigger" type="button" aria-expanded="false">Drop Up</button>
  <div class="nb-dropdown-panel nb-dropdown-top">
    <button class="nb-dropdown-item" type="button">Item</button>
  </div>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-dropdown" data-nb-dropdown>
  <button class="nb-btn nb-dropdown-trigger" type="button" aria-expanded="false" aria-haspopup="true">
    Menu
    <span aria-hidden="true"> ▼</span>
  </button>
  <div class="nb-dropdown-panel">
    <div class="nb-dropdown-group-label">Group</div>
    <button class="nb-dropdown-item" type="button">Action</button>
    <button class="nb-dropdown-item nb-dropdown-item-active" type="button" aria-selected="true">Selected</button>
    <button class="nb-dropdown-item nb-dropdown-item-disabled" type="button" disabled>Disabled</button>
    <div class="nb-dropdown-divider"></div>
    <button class="nb-dropdown-item" type="button">Another action</button>
  </div>
</div>
```

### Semantic Elements

| Element | Recommendation |
|---------|---------------|
| Trigger | `<button type="button">` with `aria-expanded` and `aria-haspopup`. |
| Panel | `<div>` or `<ul>`/`<li>` listbox structure depending on selection semantics. |
| Item | `<button type="button">` for actions; `<a>` for navigation. |
| Divider | `<div>` or `<li aria-hidden="true">`. |

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `aria-expanded` | Yes | `"true"` / `"false"` | Indicates panel visibility. CSS shows the panel via `[aria-expanded="true"] + .nb-dropdown-panel` or `.is-open`. |
| `aria-haspopup` | Recommended | `"true"` or `"menu"` / `"listbox"` | Communicates that the trigger opens a menu. |
| `type` | Yes (trigger) | `"button"` | Prevents accidental form submission. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-label` | Icon-only trigger. |
| `aria-selected="true"` | Selected dropdown item (also matched by CSS). |
| `disabled` / `aria-disabled="true"` | Disabled items. |
| `role="menu"` / `role="menuitem"` | When implementing as an ARIA menu. |
| `role="listbox"` / `role="option"` | When implementing as a selectable listbox. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Enter` / `Space` | Activates the focused item or opens the menu from the trigger. |
| `ArrowDown` / `ArrowUp` | Moves focus between items (requires JS). |
| `Home` / `End` | Moves focus to first/last item (requires JS). |
| `Escape` | Closes the panel (requires JS). |
| `Tab` | Moves focus out of the dropdown; panel should close on blur. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ | `.nb-dropdown-item:hover:not(:disabled):not(.nb-dropdown-item-disabled)` | Background fills with `--nb-base-200`. |
| **focus-visible** | ✅ | `.nb-dropdown-item:focus-visible` | `outline: 2px solid var(--nb-primary)`, background `--nb-base-200`. |
| **disabled** | ✅ | `.nb-dropdown-item:disabled`, `.nb-dropdown-item-disabled` | `opacity: 0.5`, `cursor: not-allowed`. |
| **active / selected** | ✅ | `.nb-dropdown-item-active`, `.nb-dropdown-item[aria-selected="true"]` | Background `--nb-base-200`, `font-weight: 700`. |
| **open** | ✅ | `.nb-dropdown-panel.is-open`, `.nb-dropdown-trigger[aria-expanded="true"] + .nb-dropdown-panel` | Panel changes from `display: none` to `display: block`. |
| **loading** | — N/A | — | Not applicable to Dropdown. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

The panel is absolutely positioned below the trigger by default with `z-index: var(--nb-z-dropdown)`. It has a `min-inline-size: 12rem`, `max-block-size: 60vh`, and scrolls when content overflows. The default shadow is `--nb-shadow-md`.

Items span the full panel width (`inline-size: 100%`), have left-aligned text, and transition background color on hover/focus.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-dropdown-item {
    transition: none;
  }
}
```

### Forced Colors

The panel border and divider switch to `CanvasText`, and item focus uses `Highlight`. `forced-color-adjust: none` preserves the custom border on the panel.

### RTL

Uses logical properties (`inset-inline-start/end`, `text-align: start`); no special RTL overrides needed.

---

## Examples

### Basic

```html
<div class="nb-dropdown">
  <button class="nb-btn nb-dropdown-trigger" type="button" aria-expanded="false">
    Options
  </button>
  <div class="nb-dropdown-panel">
    <button class="nb-dropdown-item" type="button">Edit</button>
    <button class="nb-dropdown-item" type="button">Duplicate</button>
    <button class="nb-dropdown-item" type="button">Delete</button>
  </div>
</div>
```

### With Groups and Divider

```html
<div class="nb-dropdown">
  <button class="nb-btn nb-dropdown-trigger" type="button" aria-expanded="false">Settings</button>
  <div class="nb-dropdown-panel">
    <div class="nb-dropdown-group-label">Account</div>
    <button class="nb-dropdown-item" type="button">Profile</button>
    <button class="nb-dropdown-item" type="button">Billing</button>
    <div class="nb-dropdown-divider"></div>
    <div class="nb-dropdown-group-label">Session</div>
    <button class="nb-dropdown-item" type="button">Sign out</button>
  </div>
</div>
```

### Disabled and Selected Items

```html
<div class="nb-dropdown">
  <button class="nb-btn nb-dropdown-trigger" type="button" aria-expanded="false">Pick a role</button>
  <div class="nb-dropdown-panel">
    <button class="nb-dropdown-item nb-dropdown-item-active" type="button" aria-selected="true">Admin</button>
    <button class="nb-dropdown-item" type="button">Editor</button>
    <button class="nb-dropdown-item nb-dropdown-item-disabled" type="button" disabled>Guest</button>
  </div>
</div>
```

### Placement Variants

```html
<div class="nb-dropdown">
  <button class="nb-btn nb-dropdown-trigger" type="button">Top</button>
  <div class="nb-dropdown-panel nb-dropdown-top">...</div>
</div>

<div class="nb-dropdown">
  <button class="nb-btn nb-dropdown-trigger" type="button">End Aligned</button>
  <div class="nb-dropdown-panel nb-dropdown-end">...</div>
</div>
```

---

## Known Issues

- None listed in component catalog.
