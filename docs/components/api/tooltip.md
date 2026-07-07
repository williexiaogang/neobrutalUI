# Tooltip API

> **Component**: Tooltip  
> **Category**: Overlay  
> **Base class**: `.nb-tooltip`  
> **Status**: Beta (CSS visual layer and JS interaction implemented)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-tooltip` | Component | Wrapper around the trigger and tooltip content. Required. |
| `.nb-tooltip-content` | Component | The tooltip bubble itself. Hidden by default; shown with `.is-visible`. |
| `.is-visible` | State | Makes the tooltip content visible. |
| `.nb-tooltip-top` | Layout | Positions the tooltip above the trigger. |
| `.nb-tooltip-bottom` | Layout | Positions the tooltip below the trigger. |
| `.nb-tooltip-start` | Layout | Positions the tooltip at the start (left in LTR) of the trigger. |
| `.nb-tooltip-end` | Layout | Positions the tooltip at the end (right in LTR) of the trigger. |

### Class Combination Examples

```html
<!-- Default (bottom-ish fallback) tooltip -->
<span class="nb-tooltip" data-nb-tooltip>
  <button class="nb-btn nb-btn-sm" type="button">Hover me</button>
  <span class="nb-tooltip-content" role="tooltip">Tooltip text</span>
</span>

<!-- Explicit placement -->
<span class="nb-tooltip nb-tooltip-bottom" data-nb-tooltip>
  <input class="nb-input" type="text" aria-label="Focus tooltip demo" />
  <span class="nb-tooltip-content" role="tooltip">Appears on focus</span>
</span>
```

---

## DOM Contract

### Recommended Structure

```html
<span class="nb-tooltip nb-tooltip-top" data-nb-tooltip>
  <button class="nb-btn" type="button" aria-describedby="tooltip-id">Trigger</button>
  <span id="tooltip-id" class="nb-tooltip-content" role="tooltip">Helpful hint</span>
</span>
```

### Semantic Elements

| Element | Recommendation |
|---------|---------------|
| Wrapper | `<span>` or `<div>` with `display: inline-block`. Keeps the tooltip positioned relative to the trigger. |
| Trigger | `<button>`, `<input>`, or any focusable element. |
| Tooltip | `<span>` with `role="tooltip"`. |

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `role="tooltip"` | Yes | `"tooltip"` | Required on `.nb-tooltip-content`. |
| `aria-describedby` | Recommended | Tooltip ID | Links the trigger to the tooltip content for screen readers. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-describedby` | Associates tooltip text with the trigger. |
| `aria-label` | Alternative if the trigger has no visible text. |
| `tabindex="0"` | When the trigger is a non-focusable element (e.g., `<span>`). |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus to the trigger; tooltip should show on focus (requires JS). |
| `Escape` | Hides tooltip when open (recommended by JS). |
| Hover / pointer | Pointer enters trigger region shows tooltip; pointer leaves hides it. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ (implicit trigger) | JS toggles `.is-visible` | Tooltip is shown by JS on hover/focus. |
| **focus-visible** | ✅ (implicit trigger) | JS toggles `.is-visible` | Tooltip is shown by JS on focus. |
| **visible** | ✅ | `.nb-tooltip-content.is-visible` | Opacity `1`, visibility `visible`, `transform: translateY(0)` / placement-correct transform. |
| **disabled** | — N/A | — | Tooltips are not form elements. |
| **active** | — N/A | — | Not styled. |
| **open** | ✅ (mapped) | `.nb-tooltip-content.is-visible` | Equivalent to the visible state. |

### Hidden State

```css
.nb-tooltip-content {
  opacity: 0;
  visibility: hidden;
  transform: translateY(4px);
}
```

### Visible State

```css
.nb-tooltip-content.is-visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
```

---

## CSS Implementation Notes

### Layout / Shadow / Motion

The tooltip content is absolutely positioned with `z-index: var(--nb-z-tooltip)`. The default placement is not shifted by a placement class and simply offsets `translateY(4px)`. Placement classes (`nb-tooltip-top`, `nb-tooltip-bottom`, `nb-tooltip-start`, `nb-tooltip-end`) center the tooltip on the corresponding edge of the trigger and animate the appropriate axis.

Tooltip content uses `white-space: nowrap` by default and wraps only on small screens (`max-width: 768px`). The max inline size is `20rem` (16rem on mobile).

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-tooltip-content {
    transition: none;
    transform: none !important;
  }

  .nb-tooltip-top .nb-tooltip-content.is-visible,
  .nb-tooltip-bottom .nb-tooltip-content.is-visible,
  .nb-tooltip-start .nb-tooltip-content.is-visible,
  .nb-tooltip-end .nb-tooltip-content.is-visible {
    transform: none;
  }
}
```

### Forced Colors

Tooltip content border is set to `2px solid CanvasText` with `forced-color-adjust: none`.

### RTL

Uses logical properties (`inset-inline-start/end`) and centered transforms; no special RTL overrides needed.

---

## Examples

### Basic

```html
<span class="nb-tooltip" data-nb-tooltip>
  <button class="nb-btn" type="button">Hover me</button>
  <span class="nb-tooltip-content" role="tooltip">This tooltip appears on hover</span>
</span>
```

### With Placement

```html
<span class="nb-tooltip nb-tooltip-top" data-nb-tooltip>
  <button class="nb-btn" type="button">Top</button>
  <span class="nb-tooltip-content" role="tooltip">Above the trigger</span>
</span>

<span class="nb-tooltip nb-tooltip-bottom" data-nb-tooltip>
  <input class="nb-input" type="text" aria-label="Focus tooltip" />
  <span class="nb-tooltip-content" role="tooltip">Below the trigger</span>
</span>

<span class="nb-tooltip nb-tooltip-start" data-nb-tooltip>
  <button class="nb-btn" type="button">Start</button>
  <span class="nb-tooltip-content" role="tooltip">To the start</span>
</span>

<span class="nb-tooltip nb-tooltip-end" data-nb-tooltip>
  <button class="nb-btn" type="button">End</button>
  <span class="nb-tooltip-content" role="tooltip">To the end</span>
</span>
```

### Programmatic Visibility

```html
<span class="nb-tooltip" data-nb-tooltip>
  <button class="nb-btn" type="button" aria-describedby="save-tip">Save</button>
  <span id="save-tip" class="nb-tooltip-content is-visible" role="tooltip">Save your changes</span>
</span>
```

---

## Known Issues

- None listed in component catalog.
