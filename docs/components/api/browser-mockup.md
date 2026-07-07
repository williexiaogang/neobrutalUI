# Browser Mockup API

> **Component**: Browser Mockup  
> **Category**: Data Display  
> **Base class**: `.nb-browser`  
> **Status**: Beta (size and color header variants implemented; dark content fill available)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-browser` | Component | Base browser frame container. Required. |
| `.nb-browser-header` | Part | Top toolbar area with dots and address bar. |
| `.nb-browser-dots` | Part | Container for the three traffic-light dots. |
| `.nb-browser-dot` | Part | Single traffic-light dot. |
| `.nb-browser-dot-red` | Color | Red dot (`--nb-error`). |
| `.nb-browser-dot-yellow` | Color | Yellow dot (`--nb-warning`). |
| `.nb-browser-dot-green` | Color | Green dot (`--nb-success`). |
| `.nb-browser-address` | Part | Address bar with placeholder text. |
| `.nb-browser-address-text` | Part | Truncated address text. |
| `.nb-browser-toolbar` | Part | Optional secondary toolbar below the header. |
| `.nb-browser-body` | Part | Main content area. |
| `.nb-browser-sm` | Size | Smaller frame, dots, and body padding. |
| `.nb-browser-lg` | Size | Larger frame and body padding. |
| `.nb-browser-primary` | Color | Primary header background. |
| `.nb-browser-secondary` | Color | Secondary header background. |
| `.nb-browser-accent` | Color | Accent header background. |
| `.nb-browser-dark` | Variant | Dark content fill in the body. |

> **Naming note**: The catalog slug is `browser-mockup`. The CSS filename is `browser.css` and the base class is `.nb-browser`.

### Class Combination Examples

```html
<div class="nb-browser nb-browser-lg nb-browser-primary">
  <div class="nb-browser-header">
    <div class="nb-browser-dots">
      <span class="nb-browser-dot nb-browser-dot-red"></span>
      <span class="nb-browser-dot nb-browser-dot-yellow"></span>
      <span class="nb-browser-dot nb-browser-dot-green"></span>
    </div>
    <div class="nb-browser-address">
      <span class="nb-browser-address-text">dashboard.example.com</span>
    </div>
  </div>
  <div class="nb-browser-body">
    <!-- content -->
  </div>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-browser">
  <div class="nb-browser-header">
    <div class="nb-browser-dots">
      <span class="nb-browser-dot nb-browser-dot-red" aria-hidden="true"></span>
      <span class="nb-browser-dot nb-browser-dot-yellow" aria-hidden="true"></span>
      <span class="nb-browser-dot nb-browser-dot-green" aria-hidden="true"></span>
    </div>
    <div class="nb-browser-address">
      <span class="nb-browser-address-text">neo-brutal-ui.dev</span>
    </div>
  </div>
  <div class="nb-browser-body">
    <p>Browser content goes here.</p>
  </div>
</div>
```

### Semantic Element

- **Preferred**: `<figure>` with an optional `<figcaption>` for screenshots, or `<div>` for UI previews.
- **Images**: Use `<img>` inside `.nb-browser-body` with an appropriate `alt` attribute.

### Part Usage Rules

| Part | Required? | Notes |
|------|-----------|-------|
| `.nb-browser-header` | Recommended | Contains the dots and address bar. |
| `.nb-browser-dots` | No | Decorative traffic-light dots. |
| `.nb-browser-address` | No | Optional address bar. |
| `.nb-browser-toolbar` | No | Optional secondary toolbar. |
| `.nb-browser-body` | Recommended | Main content area. |

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `aria-hidden` | Recommended (dots) | `"true"` | Traffic-light dots are decorative. |
| `alt` | Recommended (images) | Descriptive text | For screenshots inside the body. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-label` | On the frame to describe the preview (e.g., "Browser preview of dashboard"). |
| `aria-hidden="true"` | On decorative dots and toolbars. |

### Keyboard Behavior

Browser Mockup is a **non-interactive container**. Keyboard navigation flows through any interactive content placed inside `.nb-browser-body`.

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | — N/A | — | Browser Mockup is not interactive; hover state is not applicable. |
| **active** | — N/A | — | Browser Mockup is not interactive; active state is not applicable. |
| **focus-visible** | — N/A | — | Browser Mockup is not focusable by default. |
| **disabled** | — N/A | — | Browser Mockup is not an interactive element. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

```css
.nb-browser {
  --_bg: var(--nb-base-100);
  --_header-bg: var(--nb-base-200);
  --_border: var(--nb-border);
  --_shadow: var(--nb-shadow-md);

  display: flex;
  flex-direction: column;
  inline-size: 100%;
  border: var(--nb-border-width) solid var(--_border);
  border-radius: var(--nb-radius-box);
  background: var(--_bg);
  box-shadow: var(--_shadow);
  overflow: hidden;
}
```

The body renders a subtle striped placeholder when empty via `:empty::before`.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-browser {
    transition: none;
  }
}
```

> **Note**: The base browser does not define any transitions; this rule is present for forward compatibility.

### RTL

Uses logical properties; no special RTL overrides needed.

### Forced Colors

```css
@media (forced-colors: active) {
  .nb-browser {
    border: 2px solid CanvasText;
    forced-color-adjust: none;
  }

  .nb-browser-header,
  .nb-browser-toolbar {
    border-color: CanvasText;
  }

  .nb-browser-dot {
    forced-color-adjust: none;
  }
}
```

---

## Examples

### Basic Browser Mockup

```html
<div class="nb-browser" aria-label="Browser preview">
  <div class="nb-browser-header">
    <div class="nb-browser-dots">
      <span class="nb-browser-dot nb-browser-dot-red" aria-hidden="true"></span>
      <span class="nb-browser-dot nb-browser-dot-yellow" aria-hidden="true"></span>
      <span class="nb-browser-dot nb-browser-dot-green" aria-hidden="true"></span>
    </div>
    <div class="nb-browser-address">
      <span class="nb-browser-address-text">neo-brutal-ui.dev</span>
    </div>
  </div>
  <div class="nb-browser-body">
    <p>Welcome to the brutalist component library showcase.</p>
  </div>
</div>
```

### Large Primary Browser Mockup

```html
<div class="nb-browser nb-browser-lg nb-browser-primary" aria-label="Dashboard preview">
  <div class="nb-browser-header">
    <div class="nb-browser-dots">
      <span class="nb-browser-dot" aria-hidden="true"></span>
      <span class="nb-browser-dot" aria-hidden="true"></span>
      <span class="nb-browser-dot" aria-hidden="true"></span>
    </div>
    <div class="nb-browser-address">
      <span class="nb-browser-address-text">dashboard.example.com/overview</span>
    </div>
  </div>
  <div class="nb-browser-body">
    <img src="dashboard.png" alt="Dashboard screenshot" />
  </div>
</div>
```

### Dark Browser Mockup

```html
<div class="nb-browser nb-browser-dark nb-browser-accent" aria-label="API docs preview">
  <div class="nb-browser-header">
    <div class="nb-browser-dots">
      <span class="nb-browser-dot" aria-hidden="true"></span>
      <span class="nb-browser-dot" aria-hidden="true"></span>
      <span class="nb-browser-dot" aria-hidden="true"></span>
    </div>
    <div class="nb-browser-address">
      <span class="nb-browser-address-text">api.docs.example.com</span>
    </div>
  </div>
  <div class="nb-browser-body">
    <pre><code>GET /v1/users
200 OK</code></pre>
  </div>
</div>
```

---

## Known Issues

- The showcase demo uses `.nb-browser-toolbar` and `.nb-browser-content` class names that do not match the current CSS build. The CSS expects `.nb-browser-header` for the top bar and `.nb-browser-body` for the content area. Demo markup should be updated to use the CSS-defined classes.
