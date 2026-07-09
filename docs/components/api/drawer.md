# Drawer API

> **Component**: Drawer  
> **Category**: Overlay  
> **Base classes**: `.nb-drawer-backdrop`, `.nb-drawer`  
> **Status**: Ready (CSS visual layer and JS interaction implemented, documented, and tested)

---

## Class Names

### Container / Backdrop

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-drawer-backdrop` | Component | Fixed-position overlay behind the drawer. Required. |
| `.is-open` | State | Applied to `.nb-drawer-backdrop` to reveal the drawer and backdrop. |

### Drawer Panel

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-drawer` | Component | The sliding panel itself. Required inside backdrop. |
| `.nb-drawer-start` | Layout | Slides in from the start edge (left in LTR). |
| `.nb-drawer-end` | Layout | Slides in from the end edge (right in LTR); default. |
| `.nb-drawer-top` | Layout | Slides down from the top. |
| `.nb-drawer-bottom` | Layout | Slides up from the bottom. |

### Parts

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-drawer-header` | Part | Top section with title and close button. |
| `.nb-drawer-title` | Part | Drawer heading. |
| `.nb-drawer-close` | Part | Close button in header. |
| `.nb-drawer-body` | Part | Main scrollable content area. |
| `.nb-drawer-footer` | Part | Bottom section with action buttons. |

### Class Combination Examples

```html
<!-- Basic right drawer -->
<div class="nb-drawer-backdrop is-open" data-nb-drawer aria-hidden="false">
  <div class="nb-drawer nb-drawer-end" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
    <div class="nb-drawer-header">
      <span class="nb-drawer-title" id="drawer-title">Title</span>
      <button class="nb-drawer-close" type="button" aria-label="Close" data-drawer-close>×</button>
    </div>
    <div class="nb-drawer-body">Content</div>
  </div>
</div>

<!-- Left drawer with footer -->
<div class="nb-drawer-backdrop" id="drawer-left" data-nb-drawer aria-hidden="true">
  <div class="nb-drawer nb-drawer-start" role="dialog" aria-modal="true" aria-labelledby="drawer-left-title">
    <div class="nb-drawer-header">
      <span class="nb-drawer-title" id="drawer-left-title">Left Drawer</span>
      <button class="nb-drawer-close" type="button" aria-label="Close">×</button>
    </div>
    <div class="nb-drawer-body"><p>Content</p></div>
    <div class="nb-drawer-footer">
      <button class="nb-btn" type="button" data-drawer-close>Cancel</button>
      <button class="nb-btn nb-btn-primary" type="button">Save</button>
    </div>
  </div>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-drawer-backdrop" id="drawer-demo" data-nb-drawer aria-hidden="true">
  <div class="nb-drawer nb-drawer-end" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
    <div class="nb-drawer-header">
      <span class="nb-drawer-title" id="drawer-title">Drawer Title</span>
      <button class="nb-drawer-close" type="button" aria-label="Close" data-drawer-close>×</button>
    </div>
    <div class="nb-drawer-body">
      <p>Drawer content goes here.</p>
    </div>
    <div class="nb-drawer-footer">
      <button class="nb-btn" type="button" data-drawer-close>Cancel</button>
      <button class="nb-btn nb-btn-primary" type="button">Save</button>
    </div>
  </div>
</div>
```

### Semantic Elements

| Element | Recommendation |
|---------|---------------|
| Backdrop | `<div>` fixed overlay. |
| Panel | `<div>` with `role="dialog"` and `aria-modal="true"`. |
| Title | Heading element with `.nb-drawer-title` and an `id` referenced by `aria-labelledby`. |

### Part Usage Rules

| Part | Required? | Notes |
|------|-----------|-------|
| `.nb-drawer-header` | No | Omit for simple drawers. |
| `.nb-drawer-title` | No | Required for accessibility when a header is present. |
| `.nb-drawer-close` | No | Recommended unless the drawer is modal-required. |
| `.nb-drawer-body` | Recommended | At least one content container should exist. |
| `.nb-drawer-footer` | No | Omit for read-only drawers. |

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `role="dialog"` | Yes | `"dialog"` | Required on `.nb-drawer`. |
| `aria-modal="true"` | Yes | `"true"` | Indicates background content is inert. |
| `aria-labelledby` | Recommended | Title element ID | Required if a title is visible. |
| `aria-hidden` | Recommended | `"true"` when closed | Hide from assistive tech when closed. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-label` | Alternative to `aria-labelledby` if no visible title. |
| `aria-describedby` | Reference primary message in `.nb-drawer-body`. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` | Cycles focus within the drawer (requires JS focus trap). |
| `Shift + Tab` | Cycles focus backward within the drawer. |
| `Escape` | Closes the drawer (requires JS). |
| `Enter` / `Space` | Activates the focused button. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ (close button) | `.nb-drawer-close:hover` | Background `--nb-base-200`, shadow elevates, `translate(-2px, -2px)`. |
| **active** | ✅ (close button) | `.nb-drawer-close:active` | Shadow drops to `--nb-shadow-xs`, `translate(2px, 2px)`. |
| **focus-visible** | ✅ (close button) | `.nb-drawer-close:focus-visible` | `outline: 2px solid var(--nb-focus)`, `outline-offset: 2px`. |
| **disabled** | — N/A | — | Drawer is not a form element. |
| **open** | ✅ | `.nb-drawer-backdrop.is-open`, `.nb-drawer-backdrop.is-open .nb-drawer` | Backdrop fades in; drawer slides to `translate(0)` and opacity `1`. |
| **loading** | — N/A | — | Not applicable to Drawer. |

### Open State Transitions

```css
/* Closed state */
.nb-drawer-backdrop {
  opacity: 0;
  visibility: hidden;
}
.nb-drawer {
  opacity: 0;
  transform: translateX(100%); /* or translateX(-100%), translateY(±100%) */
}

/* Open state */
.nb-drawer-backdrop.is-open {
  opacity: 1;
  visibility: visible;
}
.nb-drawer-backdrop.is-open .nb-drawer {
  opacity: 1;
  transform: translateX(0) translateY(0);
}
```

---

## CSS Implementation Notes

### Backdrop

```css
.nb-drawer-backdrop {
  position: fixed;
  inset: 0;
  z-index: var(--nb-z-drawer);
  background: var(--nb-overlay);
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--nb-duration-slow) var(--nb-ease-out),
    visibility var(--nb-duration-slow) var(--nb-ease-out);
}
```

### Drawer Panel

```css
.nb-drawer {
  position: fixed;
  display: flex;
  flex-direction: column;
  background: var(--nb-base-100);
  border: var(--nb-border-width) solid var(--nb-border);
  box-shadow: var(--nb-shadow-xl);
  overflow: hidden;
  opacity: 0;
  transition: opacity var(--nb-duration-slow) var(--nb-ease-out),
    transform var(--nb-duration-slow) var(--nb-ease-out);
}
```

Default end/right drawer is `20rem` wide and full height. Top/bottom drawers are full width with a `max-block-size: 16rem`. On mobile, max inline size becomes `100%` and top/bottom drawers max out at `50%`.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-drawer-backdrop,
  .nb-drawer {
    transition: none;
    transform: none !important;
  }

  .nb-drawer-backdrop.is-open .nb-drawer {
    transform: none;
  }
}
```

### Forced Colors

The drawer border, header/footer borders, and close button border use `CanvasText`. The backdrop uses `Canvas` at `0.9` opacity. `forced-color-adjust: none` is applied to the panel.

### RTL

Uses logical properties (`inset-inline-start/end`); `nb-drawer-start`/`nb-drawer-end` adapt automatically to text direction.

---

## Examples

### Basic Right Drawer

```html
<div class="nb-drawer-backdrop" data-nb-drawer aria-hidden="true">
  <div class="nb-drawer nb-drawer-end" role="dialog" aria-modal="true" aria-labelledby="right-title">
    <div class="nb-drawer-header">
      <span class="nb-drawer-title" id="right-title">Settings</span>
      <button class="nb-drawer-close" type="button" aria-label="Close">×</button>
    </div>
    <div class="nb-drawer-body">
      <p>Drawer body content.</p>
    </div>
  </div>
</div>
```

### Left Drawer

```html
<div class="nb-drawer-backdrop" data-nb-drawer aria-hidden="true">
  <div class="nb-drawer nb-drawer-start" role="dialog" aria-modal="true" aria-labelledby="left-title">
    <div class="nb-drawer-header">
      <span class="nb-drawer-title" id="left-title">Navigation</span>
      <button class="nb-drawer-close" type="button" aria-label="Close">×</button>
    </div>
    <div class="nb-drawer-body">...</div>
  </div>
</div>
```

### Drawer with Footer

```html
<div class="nb-drawer-backdrop is-open" data-nb-drawer aria-hidden="false">
  <div class="nb-drawer nb-drawer-end" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
    <div class="nb-drawer-header">
      <span class="nb-drawer-title" id="confirm-title">Confirm</span>
      <button class="nb-drawer-close" type="button" aria-label="Close">×</button>
    </div>
    <div class="nb-drawer-body">
      <p>Are you sure you want to continue?</p>
    </div>
    <div class="nb-drawer-footer">
      <button class="nb-btn" type="button">Cancel</button>
      <button class="nb-btn nb-btn-primary" type="button">Confirm</button>
    </div>
  </div>
</div>
```

### Top/Bottom Drawers

```html
<div class="nb-drawer-backdrop" data-nb-drawer aria-hidden="true">
  <div class="nb-drawer nb-drawer-top" role="dialog" aria-modal="true">...</div>
</div>

<div class="nb-drawer-backdrop" data-nb-drawer aria-hidden="true">
  <div class="nb-drawer nb-drawer-bottom" role="dialog" aria-modal="true">...</div>
</div>
```

---

## Known Issues

- None listed in component catalog.
