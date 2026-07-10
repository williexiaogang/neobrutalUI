# Tabs API

> **Component**: Tabs  
> **Category**: Navigation  
> **Base class**: `.nb-tabs`  
> **Status**: Ready (CSS visual layer implemented; JS tab switching is optional)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-tabs` | Component | Tab list container. Required on the element that wraps the tabs. |
| `.nb-tabs-vertical` | Layout | Stacks the tab list vertically with a trailing inline border. |
| `.nb-tab` | Component | Individual tab control. Required on each tab. |
| `.nb-tab-active` | State | Visually marks the currently selected tab with an active border. |
| `.nb-tab-disabled` | State | Visually dims the tab and removes pointer cursor. |
| `.nb-tab-panel` | Component | Content panel associated with a tab. |

### Class Combination Examples

```html
<!-- Horizontal tabs -->
<div class="nb-tabs" role="tablist" aria-label="Settings">
  <button class="nb-tab nb-tab-active" role="tab" aria-selected="true" type="button">General</button>
  <button class="nb-tab" role="tab" aria-selected="false" type="button">Security</button>
  <button class="nb-tab nb-tab-disabled" role="tab" aria-selected="false" disabled type="button">Billing</button>
</div>
<div class="nb-tab-panel" role="tabpanel">
  <p>General settings content.</p>
</div>

<!-- Vertical tabs -->
<div class="nb-tabs nb-tabs-vertical" role="tablist" aria-label="Profile">
  <button class="nb-tab nb-tab-active" role="tab" aria-selected="true" type="button">Profile</button>
  <button class="nb-tab" role="tab" aria-selected="false" type="button">Notifications</button>
  <button class="nb-tab" role="tab" aria-selected="false" type="button">Integrations</button>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-tabs" role="tablist" aria-label="Demo tabs">
  <button class="nb-tab nb-tab-active" role="tab" aria-selected="true" id="tab-1" type="button">
    Tab One
  </button>
  <button class="nb-tab" role="tab" aria-selected="false" id="tab-2" tabindex="-1" type="button">
    Tab Two
  </button>
</div>
<div class="nb-tab-panel" role="tabpanel" aria-labelledby="tab-1">
  <p>Panel content for tab one.</p>
</div>
```

### Semantic Element

- **Preferred**: `<button type="button">` for each tab with `role="tab"`.
- **Tab list**: The container should use `role="tablist"`.
- **Tab panels**: Use `role="tabpanel"` on the corresponding content containers.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `role="tablist"` | Recommended | `"tablist"` | Identifies the tab container to assistive technologies. |
| `role="tab"` | Recommended | `"tab"` | Identifies each tab control. |
| `aria-selected` | Recommended | `"true"` / `"false"` | Indicates which tab is active. |
| `type="button"` | Recommended | `"button"` | Prevents accidental form submission when inside `<form>`. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-label` | When the tab list purpose is not obvious from visible content. |
| `aria-controls` | Reference the associated `tabpanel` ID on each tab. |
| `aria-labelledby` | Reference the tab ID on each `tabpanel`. |
| `disabled` | When a tab is not interactive. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus into/out of the tab list. |
| `ArrowLeft` / `ArrowRight` | Moves focus between horizontal tabs (recommended JS behavior). |
| `ArrowUp` / `ArrowDown` | Moves focus between vertical tabs (recommended JS behavior). |
| `Home` | Moves focus to the first tab (recommended JS behavior). |
| `End` | Moves focus to the last tab (recommended JS behavior). |
| `Enter` / `Space` | Activates the focused tab (recommended JS behavior). |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ | `.nb-tab:hover:not(:disabled):not(.nb-tab-disabled)` | Background changes to `var(--nb-base-200)`. |
| **active** | ❌ Not styled | — | No explicit `:active` styles. |
| **focus-visible** | ✅ | `.nb-tab:focus-visible` | `outline: 2px solid var(--nb-focus)` with 2px offset. |
| **disabled** | ✅ | `.nb-tab:disabled`, `.nb-tab-disabled` | `opacity: 0.5`, `cursor: not-allowed`. |
| **selected** | ✅ | `.nb-tab-active`, `[aria-selected="true"]` | Background changes to `var(--nb-base-200)` and an active border appears on the block-end (or inline-end for vertical). |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

- The tab list uses Flexbox with a default row direction and a bottom border.
- The vertical variant switches to column direction and moves the border to the inline-end.
- Tabs have a fast background transition on hover; no shadow or transform is used.
- On mobile viewports (`max-width: 768px`), horizontal tab lists scroll horizontally and hide the scrollbar.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-tab,
  .nb-tabs [role="tab"] {
    transition: none;
  }
}
```

### RTL

Uses logical properties (`border-block-end`, `border-inline-end`, `inset-inline-start`, etc.); no special RTL overrides needed.

---

## Examples

### Basic Horizontal Tabs

```html
<div class="nb-tabs" role="tablist" aria-label="Account">
  <button class="nb-tab nb-tab-active" role="tab" aria-selected="true" type="button">Profile</button>
  <button class="nb-tab" role="tab" aria-selected="false" type="button">Settings</button>
  <button class="nb-tab" role="tab" aria-selected="false" type="button">Security</button>
</div>
<div class="nb-tab-panel" role="tabpanel">
  <p>Profile content.</p>
</div>
```

### Vertical Tabs

```html
<div class="nb-tabs nb-tabs-vertical" role="tablist" aria-label="Preferences">
  <button class="nb-tab nb-tab-active" role="tab" aria-selected="true" type="button">General</button>
  <button class="nb-tab" role="tab" aria-selected="false" type="button">Display</button>
  <button class="nb-tab" role="tab" aria-selected="false" type="button">Notifications</button>
</div>
```

### Disabled Tab

```html
<div class="nb-tabs" role="tablist" aria-label="Checkout">
  <button class="nb-tab nb-tab-active" role="tab" aria-selected="true" type="button">Shipping</button>
  <button class="nb-tab nb-tab-disabled" role="tab" aria-selected="false" disabled type="button">Payment</button>
  <button class="nb-tab" role="tab" aria-selected="false" type="button">Review</button>
</div>
```

