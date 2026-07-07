# Toast API

> **Component**: Toast  
> **Category**: Feedback  
> **Base class**: `.nb-toast`  
> **Status**: Beta (CSS visual layer and JS interaction implemented)

---

## Class Names

### Container

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-toast-container` | Component | Fixed-position container for one or more toasts. Required. |
| `.nb-toast-container-top-start` | Layout | Positions container at the top-start corner. |
| `.nb-toast-container-top-end` | Layout | Positions container at the top-end corner. |
| `.nb-toast-container-bottom-start` | Layout | Positions container at the bottom-start corner. |
| `.nb-toast-container-bottom-end` | Layout | Positions container at the bottom-end corner (default fallback). |

### Toast Item

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-toast` | Component | Individual toast message. Required. |
| `.is-entering` | State | Shows the toast with final opacity/position. |
| `.is-exiting` | State | Animates the toast out. |

### Semantic Color Variants

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-toast-info` | Color | Accent color from `--nb-info`. |
| `.nb-toast-success` | Color | Accent color from `--nb-success`. |
| `.nb-toast-warning` | Color | Accent color from `--nb-warning`. |
| `.nb-toast-error` | Color | Accent color from `--nb-error`. |

### Parts

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-toast-title` | Part | Bold title of the toast. |
| `.nb-toast-message` | Part | Smaller muted description. |
| `.nb-toast-close` | Part | Absolute-positioned close button. |
| `.nb-toast-progress` | Part | Optional auto-dismiss progress bar. |
| `.is-animating` | State | Triggers the progress-bar shrink animation. |

### Class Combination Examples

```html
<div class="nb-toast-container nb-toast-container-bottom-end" role="region" aria-live="polite" aria-label="Notifications">
  <div class="nb-toast nb-toast-success is-entering" role="status">
    <div>
      <div class="nb-toast-title">Success</div>
      <div class="nb-toast-message">Your action completed successfully.</div>
    </div>
    <button class="nb-toast-close" type="button" aria-label="Close notification">×</button>
  </div>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-toast-container nb-toast-container-bottom-end" role="region" aria-live="polite" aria-label="Notifications">
  <div class="nb-toast nb-toast-info is-entering" role="status">
    <div>
      <div class="nb-toast-title">Info</div>
      <div class="nb-toast-message">Here is a helpful message.</div>
    </div>
    <button class="nb-toast-close" type="button" aria-label="Close notification">×</button>
    <div class="nb-toast-progress is-animating" aria-hidden="true"></div>
  </div>
</div>
```

### Semantic Elements

| Element | Recommendation |
|---------|---------------|
| Container | `<div>` or `<ul>` with `role="region"`, `aria-live`, and `aria-label="Notifications"`. |
| Toast | `<div>` or `<li>` with `role="status"` for non-critical messages or `role="alert"` for errors/warnings. |
| Close | `<button type="button">` with `aria-label="Close notification"`. |

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `role` | Recommended | `"status"` / `"alert"` | Communicates urgency to assistive tech. |
| `aria-live` | Recommended | `"polite"` / `"assertive"` | Usually placed on the container. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-label="Notifications"` | Labels the toast region. |
| `aria-live="polite"` | For status toasts. |
| `aria-live="assertive"` | For error/alert toasts. |
| `aria-hidden="true"` | On decorative progress bars. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus to the close button when present. |
| `Enter` / `Space` | Activates the focused close button. |
| `Escape` | Recommended shortcut to dismiss the focused toast (requires JS). |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ (close button) | `.nb-toast-close:hover` | Background `--nb-base-200`, shadow `--nb-shadow-sm`, `translate(-1px, -1px)`. |
| **active** | ✅ (close button) | `.nb-toast-close:active` | Shadow removed, `translate(1px, 1px)`. |
| **focus-visible** | ✅ (close button) | `.nb-toast-close:focus-visible` | `outline: 2px solid var(--nb-focus)`, `outline-offset: 2px`. |
| **disabled** | — N/A | — | Toasts are not form elements. |
| **entering** | ✅ | `.nb-toast.is-entering` | Opacity `1`, `transform: translateY(0)`. |
| **exiting** | ✅ | `.nb-toast.is-exiting` | Opacity `0`, `transform: translateY(-20px)`. |
| **animating** | ✅ | `.nb-toast-progress.is-animating` | Progress bar shrinks from `scaleX(1)` to `scaleX(0)`. |

### Enter / Exit Motion

```css
.nb-toast {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity var(--nb-duration-slow) var(--nb-ease-out),
    transform var(--nb-duration-slow) var(--nb-ease-out);
}

.nb-toast.is-entering {
  opacity: 1;
  transform: translateY(0);
}

.nb-toast.is-exiting {
  opacity: 0;
  transform: translateY(-20px);
  transition: opacity var(--nb-duration-normal) var(--nb-ease-in-out),
    transform var(--nb-duration-normal) var(--nb-ease-in-out);
}
```

---

## CSS Implementation Notes

### Container Layout

The toast container is fixed-positioned at `bottom-end` by default (set with a layout class). It uses `flex-direction: column-reverse` so new toasts stack upward. `pointer-events: none` on the container lets clicks pass through; individual toasts restore `pointer-events: auto`.

### Toast Item

```css
.nb-toast {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: var(--nb-space-3);
  padding: var(--nb-space-3) var(--nb-space-4);
  padding-inline-end: calc(var(--nb-space-4) + 2rem);
  border: var(--nb-border-width) solid var(--nb-border);
  border-inline-start-width: 6px;
  border-inline-start-color: var(--_accent);
  border-radius: var(--nb-radius-box);
  background: var(--nb-base-100);
  color: var(--nb-base-content);
  box-shadow: var(--nb-shadow-md);
}
```

Color variants only change the `--_accent` custom property, which colors the left border and progress bar.

### Progress Bar

```css
.nb-toast-progress {
  position: absolute;
  inset-block-end: 0;
  inset-inline-start: 0;
  inline-size: 100%;
  block-size: 3px;
  background: var(--_accent);
  transform-origin: inline-start;
  transform: scaleX(1);
}

.nb-toast-progress.is-animating {
  animation: nb-toast-progress linear forwards;
}

@keyframes nb-toast-progress {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-toast,
  .nb-toast.is-exiting {
    transition: none;
    transform: none;
    opacity: 1;
  }

  .nb-toast-progress.is-animating {
    animation: none;
    transform: scaleX(0);
  }
}
```

### Forced Colors

Toast border, close button border, and progress bar use `CanvasText`. `forced-color-adjust: none` is applied to the toast.

### RTL

Uses logical properties (`border-inline-start-width/color`, `padding-inline-end`, `inset-inline-start/end`); no special RTL overrides needed.

---

## Examples

### Basic

```html
<div class="nb-toast-container nb-toast-container-bottom-end">
  <div class="nb-toast nb-toast-info is-entering" role="status">
    <div>
      <div class="nb-toast-title">Info</div>
      <div class="nb-toast-message">Something happened.</div>
    </div>
  </div>
</div>
```

### With Close Button

```html
<div class="nb-toast-container nb-toast-container-top-end">
  <div class="nb-toast nb-toast-success is-entering" role="status">
    <div>
      <div class="nb-toast-title">Success</div>
      <div class="nb-toast-message">Saved successfully.</div>
    </div>
    <button class="nb-toast-close" type="button" aria-label="Close notification">×</button>
  </div>
</div>
```

### Variants

```html
<div class="nb-toast nb-toast-info is-entering" role="status">...</div>
<div class="nb-toast nb-toast-success is-entering" role="status">...</div>
<div class="nb-toast nb-toast-warning is-entering" role="alert" aria-live="assertive">...</div>
<div class="nb-toast nb-toast-error is-entering" role="alert" aria-live="assertive">...</div>
```

### Auto-Dismiss with Progress Bar

```html
<div class="nb-toast-container nb-toast-container-bottom-end">
  <div class="nb-toast nb-toast-info is-entering" role="status">
    <div>
      <div class="nb-toast-title">Auto-dismiss</div>
      <div class="nb-toast-message">This toast will disappear shortly.</div>
    </div>
    <div class="nb-toast-progress is-animating" aria-hidden="true"></div>
  </div>
</div>
```

### Position Variants

```html
<div class="nb-toast-container nb-toast-container-top-start">...</div>
<div class="nb-toast-container nb-toast-container-top-end">...</div>
<div class="nb-toast-container nb-toast-container-bottom-start">...</div>
<div class="nb-toast-container nb-toast-container-bottom-end">...</div>
```

---

## Known Issues

- None listed in component catalog.
