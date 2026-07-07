# Accordion API

> **Component**: Accordion  
> **Category**: Layout  
> **Base class**: `.nb-accordion`  
> **Status**: Beta (CSS visual layer and JS interaction implemented; supports single/multi-open, flush, and size variants)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-accordion` | Component | Root container for the accordion. Required. |
| `.nb-accordion-item` | Component | Individual collapsible section wrapper. |
| `.nb-accordion-trigger` | Component | Button that toggles its associated panel. |
| `.nb-accordion-icon` | Part | Chevron icon inside the trigger. Rotates when open. |
| `.nb-accordion-panel` | Part | Expandable panel wrapper animated with `grid-template-rows`. |
| `.nb-accordion-panel-inner` | Part | Inner overflow-hidden wrapper for the panel content. |
| `.nb-accordion-content` | Part | Content area inside the panel. |
| `.nb-accordion-flush` | Variant | Removes gaps and shadows for a connected border style. |
| `.nb-accordion-sm` | Size | Smaller trigger padding and font size. |
| `.nb-accordion-lg` | Size | Larger trigger padding and font size. |
| `.is-open` | State | Applied to `.nb-accordion-item` and `.nb-accordion-panel` when expanded. |
| `.nb-accordion-trigger-disabled` | State | Class-based disabled state for the trigger. |

### Class Combination Examples

```html
<!-- Basic accordion -->
<div class="nb-accordion">
  <div class="nb-accordion-item is-open">
    <button class="nb-accordion-trigger" type="button" aria-expanded="true" aria-controls="panel-1" id="trigger-1">
      Section One
      <span class="nb-accordion-icon" aria-hidden="true">▼</span>
    </button>
    <div class="nb-accordion-panel is-open" id="panel-1" role="region" aria-labelledby="trigger-1">
      <div class="nb-accordion-panel-inner">
        <div class="nb-accordion-content">
          <p>Content for section one.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Flush variant -->
<div class="nb-accordion nb-accordion-flush">
  <div class="nb-accordion-item">...</div>
</div>

<!-- Large size -->
<div class="nb-accordion nb-accordion-lg">
  <div class="nb-accordion-item">...</div>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-accordion" data-nb-accordion>
  <div class="nb-accordion-item" data-nb-accordion-item>
    <button
      class="nb-accordion-trigger"
      data-nb-accordion-trigger
      type="button"
      aria-expanded="false"
      aria-controls="panel-1"
      id="trigger-1"
    >
      Section Title
      <span class="nb-accordion-icon" aria-hidden="true">
        <svg><!-- chevron --></svg>
      </span>
    </button>
    <div
      class="nb-accordion-panel"
      data-nb-accordion-panel
      id="panel-1"
      role="region"
      aria-labelledby="trigger-1"
      aria-hidden="true"
    >
      <div class="nb-accordion-panel-inner">
        <div class="nb-accordion-content">
          <p>Section content goes here.</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Semantic Element

- **Preferred**: `<button type="button">` for the trigger. Each panel should be a `<div role="region">` with `aria-labelledby` referencing the trigger.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `type` | Yes (trigger) | `"button"` | Prevents accidental form submission. |
| `aria-expanded` | Yes (trigger) | `"true"` / `"false"` | Communicates open/closed state to assistive tech. |
| `aria-controls` | Recommended | Panel ID | Links trigger to its panel. |
| `aria-labelledby` | Recommended | Trigger ID | Links panel to its title. |
| `aria-hidden` | Recommended | `"true"` / `"false"` | Mirrors panel visibility for older AT when not using `hidden`. |
| `disabled` | When disabled | — | Use native `disabled` or `.nb-accordion-trigger-disabled`. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `role="region"` | On each panel to expose it as a landmark region. |
| `aria-expanded` | On every trigger. Required for disclosure pattern. |
| `aria-controls` | On every trigger to programmatically associate the panel. |
| `aria-disabled="true"` | When the trigger is not disabled via native `disabled` but should appear inactive. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus through accordion triggers. |
| `Enter` / `Space` | Toggles the focused panel open or closed. |
| `Home` | Moves focus to the first trigger (JS optional). |
| `End` | Moves focus to the last trigger (JS optional). |
| `ArrowDown` / `ArrowUp` | Moves focus between triggers (JS optional). |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ | `.nb-accordion-trigger:hover:not(:disabled)` | Background changes to `--nb-base-200`. |
| **focus-visible** | ✅ | `.nb-accordion-trigger:focus-visible` | `outline: 2px solid var(--nb-focus); outline-offset: -2px;` |
| **disabled** | ✅ | `.nb-accordion-trigger:disabled`, `.nb-accordion-trigger-disabled` | `opacity: 0.5`, `cursor: not-allowed`. |
| **active** | — N/A | — | No explicit active styling; press feedback relies on panel toggle. |
| **open** | ✅ | `.nb-accordion-item.is-open` | Item shadow elevates to `--nb-shadow-md`; trigger bottom border becomes visible; icon rotates 180°; panel expands via grid. |
| **closed** | ✅ | `.nb-accordion-panel:not(.is-open)` | `grid-template-rows: 0fr`, `visibility: hidden`. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

The accordion root is a vertical flex container with a gap between items. Each item has a hard border and small shadow. The panel uses a CSS grid `grid-template-rows` trick for smooth, hardware-friendly height animation without measuring JavaScript.

```css
.nb-accordion-panel {
  display: grid;
  grid-template-rows: 0fr;
  visibility: hidden;
  transition:
    grid-template-rows var(--nb-duration-normal) var(--nb-ease-out),
    visibility 0s var(--nb-duration-normal);
}

.nb-accordion-panel.is-open {
  grid-template-rows: 1fr;
  visibility: visible;
}
```

The `.nb-accordion-panel-inner` wrapper provides `overflow: hidden` so the content clips cleanly during the transition.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-accordion-panel,
  .nb-accordion-icon,
  .nb-accordion-item,
  .nb-accordion-trigger {
    transition: none;
  }

  .nb-accordion-panel.is-open {
    grid-template-rows: 1fr;
    visibility: visible;
  }
}
```

### RTL

Uses logical properties (`border-block-end`, `inline-size`, `margin-inline-start`, etc.); no special RTL overrides needed.

---

## Examples

### Basic Accordion

```html
<div class="nb-accordion">
  <div class="nb-accordion-item is-open">
    <button class="nb-accordion-trigger" type="button" aria-expanded="true" aria-controls="panel-1" id="trigger-1">
      General Settings
      <span class="nb-accordion-icon" aria-hidden="true">▼</span>
    </button>
    <div class="nb-accordion-panel is-open" id="panel-1" role="region" aria-labelledby="trigger-1">
      <div class="nb-accordion-panel-inner">
        <div class="nb-accordion-content">
          <p>Configure your account preferences.</p>
        </div>
      </div>
    </div>
  </div>

  <div class="nb-accordion-item">
    <button class="nb-accordion-trigger" type="button" aria-expanded="false" aria-controls="panel-2" id="trigger-2">
      Security
      <span class="nb-accordion-icon" aria-hidden="true">▼</span>
    </button>
    <div class="nb-accordion-panel" id="panel-2" role="region" aria-labelledby="trigger-2" aria-hidden="true">
      <div class="nb-accordion-panel-inner">
        <div class="nb-accordion-content">
          <p>Manage passwords and two-factor authentication.</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Flush Variant

```html
<div class="nb-accordion nb-accordion-flush">
  <div class="nb-accordion-item">...</div>
  <div class="nb-accordion-item">...</div>
</div>
```

### Disabled Item

```html
<div class="nb-accordion-item">
  <button class="nb-accordion-trigger" type="button" aria-expanded="false" disabled>
    Billing (Locked)
    <span class="nb-accordion-icon" aria-hidden="true">▼</span>
  </button>
  <div class="nb-accordion-panel" role="region" aria-hidden="true">
    <div class="nb-accordion-panel-inner">
      <div class="nb-accordion-content">
        <p>This section is currently unavailable.</p>
      </div>
    </div>
  </div>
</div>
```

### Size Variants

```html
<div class="nb-accordion nb-accordion-sm">...</div>
<div class="nb-accordion nb-accordion-lg">...</div>
```
