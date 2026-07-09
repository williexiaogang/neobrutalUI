# Alert API

> **Component**: Alert  
> **Category**: Feedback  
> **Base class**: `.nb-alert`  
> **Status**: Ready

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-alert` | Component | Base alert container. Required. Sets flex layout, accent border, background, and shadow. |
| `.nb-alert-info` | Color | Sets accent color to `--nb-info`. |
| `.nb-alert-success` | Color | Sets accent color to `--nb-success`. |
| `.nb-alert-warning` | Color | Sets accent color to `--nb-warning`. |
| `.nb-alert-error` | Color | Sets accent color to `--nb-error`. |
| `.nb-alert-icon` | Part | Icon slot. Colored with the current accent and sized to `1.5rem`. |
| `.nb-alert-title` | Part | Bold title inside the alert message area. |
| `.nb-alert-body` | Part | Muted secondary text below the title. |

### Class Combination Examples

```html
<!-- Info alert with icon and title -->
<div class="nb-alert nb-alert-info" role="alert">
  <span class="nb-alert-icon" aria-hidden="true">ⓘ</span>
  <div>
    <p class="nb-alert-title">Heads up</p>
    <p class="nb-alert-body">This is a preview of the alert component styling.</p>
  </div>
</div>

<!-- Error alert -->
<div class="nb-alert nb-alert-error" role="alert">
  <span class="nb-alert-icon" aria-hidden="true">✕</span>
  <div>
    <p class="nb-alert-title">Error</p>
    <p class="nb-alert-body">Something went wrong. Please try again.</p>
  </div>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-alert nb-alert-info" role="alert">
  <span class="nb-alert-icon" aria-hidden="true">ⓘ</span>
  <div>
    <p class="nb-alert-title">Heads up</p>
    <p class="nb-alert-body">This is a preview of the alert component styling.</p>
  </div>
</div>
```

### Semantic Element

- **Preferred**: `<div role="alert">` or `<section aria-label="...">`.
- **For live regions**: Use `role="alert"` or `aria-live="polite"` so screen readers announce the alert when it appears.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `role` | Recommended | `"alert"` | Communicates the message to assistive technologies. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `role="alert"` | For error or important status messages that should be announced immediately. |
| `aria-live="polite"` | For non-critical alerts; announced when the user becomes idle. |
| `aria-labelledby` | Reference the alert title ID when the alert has a title. |
| `aria-describedby` | Reference the alert body ID for additional context. |
| `aria-hidden="true"` | On the decorative icon so it is not read by screen readers. |

### Keyboard Behavior

Alert is a **non-interactive container**. Keyboard navigation flows through any focusable children (e.g., a dismiss button). No alert-level keyboard handlers required.

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | — N/A | — | Alert is not interactive; hover state is not applicable. |
| **active** | — N/A | — | Alert is not interactive; active state is not applicable. |
| **focus-visible** | — N/A | — | Alert is not focusable by default. |
| **disabled** | — N/A | — | Alert is not an interactive element. |

> **Note**: A future dismissible alert variant may add an interactive close button with hover/focus states. That behavior is not in the current CSS build.

---

## CSS Implementation Notes

### Layout / Shadow / Motion

```css
.nb-alert {
  display: flex;
  gap: var(--nb-space-3);
  padding: var(--nb-space-4);
  border: var(--nb-border-width) solid var(--nb-border);
  border-inline-start-width: 6px;
  border-inline-start-color: var(--_accent);
  border-radius: var(--nb-radius-box);
  background: var(--nb-base-100);
  box-shadow: var(--nb-shadow-sm);
}
```

The accent color is stored in a private custom property `--_accent`, defaulting to `--nb-neutral`. Color modifier classes override `--_accent` to the relevant semantic token.

### Reduced Motion

No transitions or animations; reduced-motion is not applicable.

### RTL

Uses logical properties (`border-inline-start-width`, `border-inline-start-color`); no special RTL overrides needed.

### Forced Colors

```css
@media (forced-colors: active) {
  .nb-alert {
    border: 2px solid CanvasText;
    forced-color-adjust: none;
  }

  .nb-alert-icon {
    color: CanvasText;
  }
}
```

---

## Examples

### Basic Alert

```html
<div class="nb-alert nb-alert-info" role="alert">
  <span class="nb-alert-icon" aria-hidden="true">ⓘ</span>
  <div>
    <p class="nb-alert-title">Info</p>
    <p class="nb-alert-body">This is an informational message.</p>
  </div>
</div>
```

### Semantic Colors

```html
<div class="nb-alert nb-alert-success" role="alert">
  <span class="nb-alert-icon" aria-hidden="true">✓</span>
  <div>
    <p class="nb-alert-title">Success</p>
    <p class="nb-alert-body">Your changes have been saved.</p>
  </div>
</div>

<div class="nb-alert nb-alert-warning" role="alert">
  <span class="nb-alert-icon" aria-hidden="true">⚠</span>
  <div>
    <p class="nb-alert-title">Warning</p>
    <p class="nb-alert-body">Your subscription expires soon.</p>
  </div>
</div>

<div class="nb-alert nb-alert-error" role="alert">
  <span class="nb-alert-icon" aria-hidden="true">✕</span>
  <div>
    <p class="nb-alert-title">Error</p>
    <p class="nb-alert-body">Failed to save your changes.</p>
  </div>
</div>
```

### Alert Without Icon

```html
<div class="nb-alert nb-alert-info" role="alert">
  <div>
    <p class="nb-alert-title">Heads up</p>
    <p class="nb-alert-body">This alert has no icon.</p>
  </div>
</div>
```

---

## Known Issues

- Dismissible behavior is planned; no `.nb-alert-dismissible` or close-button styles exist in the current CSS build.
