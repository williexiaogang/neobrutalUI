# Collapse API

> **Component**: Collapse  
> **Category**: Layout  
> **Base class**: `.nb-collapse`  
> **Status**: Beta (CSS visual layer and JS interaction implemented; supports smooth transitions, disabled state, and sm/lg sizes)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-collapse` | Component | Root container for a single collapsible section. Required. |
| `.nb-collapse-trigger` | Component | Button that toggles the panel open and closed. |
| `.nb-collapse-icon` | Part | Chevron icon inside the trigger. Rotates when open. |
| `.nb-collapse-panel` | Part | Expandable panel wrapper animated with `grid-template-rows`. |
| `.nb-collapse-panel-inner` | Part | Inner overflow-hidden wrapper for the panel content. |
| `.nb-collapse-content` | Part | Content area inside the panel. |
| `.nb-collapse-sm` | Size | Smaller trigger padding and font size. |
| `.nb-collapse-lg` | Size | Larger trigger padding and font size. |
| `.is-open` | State | Applied to `.nb-collapse` and `.nb-collapse-panel` when expanded. |
| `.nb-collapse-trigger-disabled` | State | Class-based disabled state for the trigger. |

### Class Combination Examples

```html
<!-- Default collapse (open) -->
<div class="nb-collapse is-open">
  <button class="nb-collapse-trigger" type="button" aria-expanded="true" aria-controls="collapse-panel" id="collapse-trigger">
    Shipping Details
    <span class="nb-collapse-icon" aria-hidden="true">▼</span>
  </button>
  <div class="nb-collapse-panel is-open" id="collapse-panel" role="region" aria-labelledby="collapse-trigger">
    <div class="nb-collapse-panel-inner">
      <div class="nb-collapse-content">
        <p>Free shipping on orders over $50.</p>
      </div>
    </div>
  </div>
</div>

<!-- Small size -->
<div class="nb-collapse nb-collapse-sm">...</div>

<!-- Disabled -->
<div class="nb-collapse">
  <button class="nb-collapse-trigger nb-collapse-trigger-disabled" type="button" disabled>...</button>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-collapse" data-nb-collapse>
  <button
    class="nb-collapse-trigger"
    data-nb-collapse-trigger
    type="button"
    aria-expanded="false"
    aria-controls="collapse-panel"
    id="collapse-trigger"
  >
    Section Title
    <span class="nb-collapse-icon" aria-hidden="true">
      <svg><!-- chevron --></svg>
    </span>
  </button>
  <div
    class="nb-collapse-panel"
    data-nb-collapse-panel
    id="collapse-panel"
    role="region"
    aria-labelledby="collapse-trigger"
  >
    <div class="nb-collapse-panel-inner">
      <div class="nb-collapse-content">
        <p>Expandable content goes here.</p>
      </div>
    </div>
  </div>
</div>
```

### Semantic Element

- **Preferred**: `<button type="button">` for the trigger. The panel should be a `<div role="region">` with `aria-labelledby` referencing the trigger.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `type` | Yes (trigger) | `"button"` | Prevents accidental form submission. |
| `aria-expanded` | Yes (trigger) | `"true"` / `"false"` | Communicates open/closed state. |
| `aria-controls` | Recommended | Panel ID | Links trigger to its panel. |
| `aria-labelledby` | Recommended | Trigger ID | Links panel to its title. |
| `disabled` | When disabled | — | Use native `disabled` or `.nb-collapse-trigger-disabled`. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `role="region"` | On the panel to expose it as a landmark region. |
| `aria-expanded` | On the trigger. Required for disclosure pattern. |
| `aria-controls` | On the trigger to programmatically associate the panel. |
| `aria-disabled="true"` | When the trigger is not native `disabled` but should appear inactive. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus to the trigger. |
| `Enter` / `Space` | Toggles the panel open or closed. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ | `.nb-collapse-trigger:hover:not(:disabled)` | Background changes to `--nb-base-200`. |
| **focus-visible** | ✅ | `.nb-collapse-trigger:focus-visible` | `outline: 2px solid var(--nb-focus); outline-offset: -2px;` |
| **disabled** | ✅ | `.nb-collapse-trigger:disabled`, `.nb-collapse-trigger-disabled` | `opacity: 0.5`, `cursor: not-allowed`. |
| **active** | — N/A | — | No explicit active styling; press feedback relies on panel toggle. |
| **open** | ✅ | `.nb-collapse.is-open` | Shadow elevates to `--nb-shadow-md`; trigger bottom border becomes visible; icon rotates 180°; panel expands. |
| **closed** | ✅ | `.nb-collapse-panel:not(.is-open)` | `grid-template-rows: 0fr`, `visibility: hidden`. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

The collapse root is a block-level container with a hard border and small shadow. The panel uses a CSS grid `grid-template-rows` trick for smooth height animation.

```css
.nb-collapse-panel {
  display: grid;
  grid-template-rows: 0fr;
  visibility: hidden;
  transition:
    grid-template-rows var(--nb-duration-normal) var(--nb-ease-out),
    visibility 0s var(--nb-duration-normal);
}

.nb-collapse.is-open .nb-collapse-panel {
  grid-template-rows: 1fr;
  visibility: visible;
}
```

The `.nb-collapse-panel-inner` wrapper provides `overflow: hidden` so the content clips cleanly during the transition.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-collapse-panel,
  .nb-collapse-icon,
  .nb-collapse-trigger,
  .nb-collapse {
    transition: none;
  }

  .nb-collapse.is-open .nb-collapse-panel {
    grid-template-rows: 1fr;
    visibility: visible;
  }
}
```

### RTL

Uses logical properties (`border-block-end`, `inline-size`, etc.); no special RTL overrides needed.

---

## Examples

### Basic Collapse

```html
<div class="nb-collapse is-open">
  <button class="nb-collapse-trigger" type="button" aria-expanded="true" aria-controls="panel-1" id="trigger-1">
    Shipping Details
    <span class="nb-collapse-icon" aria-hidden="true">▼</span>
  </button>
  <div class="nb-collapse-panel is-open" id="panel-1" role="region" aria-labelledby="trigger-1">
    <div class="nb-collapse-panel-inner">
      <div class="nb-collapse-content">
        <p>Free shipping on all orders over $50.</p>
      </div>
    </div>
  </div>
</div>
```

### Size Variants

```html
<div class="nb-collapse nb-collapse-sm">...</div>
<div class="nb-collapse nb-collapse-lg">...</div>
```

### Disabled Collapse

```html
<div class="nb-collapse">
  <button class="nb-collapse-trigger nb-collapse-trigger-disabled" type="button" disabled>
    Premium Support (Locked)
    <span class="nb-collapse-icon" aria-hidden="true">▼</span>
  </button>
  <div class="nb-collapse-panel" role="region">
    <div class="nb-collapse-panel-inner">
      <div class="nb-collapse-content">
        <p>Premium support is available for Enterprise customers only.</p>
      </div>
    </div>
  </div>
</div>
```

### Inside a Field Wrapper

```html
<div class="nb-field">
  <label class="nb-field-label">Advanced Settings</label>
  <div class="nb-collapse">
    <button class="nb-collapse-trigger" type="button" aria-expanded="false">Configure API Keys <span class="nb-collapse-icon" aria-hidden="true">▼</span></button>
    <div class="nb-collapse-panel" role="region">
      <div class="nb-collapse-panel-inner">
        <div class="nb-collapse-content">
          <input class="nb-input nb-input-sm" type="text" placeholder="Enter API key…" />
        </div>
      </div>
    </div>
  </div>
  <span class="nb-field-description">Expand to reveal advanced configuration options.</span>
</div>
```
