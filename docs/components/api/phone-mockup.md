# Phone Mockup API

> **Component**: Phone Mockup  
> **Category**: Data Display  
> **Base class**: `.nb-phone`  
> **Status**: Beta (size and color frame variants implemented; dark screen fill available)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-phone` | Component | Base phone frame container. Required. |
| `.nb-phone-notch` | Part | Notch area at the top of the frame. |
| `.nb-phone-notch-bar` | Part | The actual notch bar. |
| `.nb-phone-screen` | Part | Main screen area. |
| `.nb-phone-screen-content` | Part | Padding wrapper for screen content. |
| `.nb-phone-indicator` | Part | Home indicator area at the bottom. |
| `.nb-phone-indicator-bar` | Part | The actual home indicator bar. |
| `.nb-phone-button` | Part | Optional circular home button below the screen. |
| `.nb-phone-sm` | Size | Smaller frame and screen. |
| `.nb-phone-lg` | Size | Larger frame and screen. |
| `.nb-phone-primary` | Color | Primary frame background. |
| `.nb-phone-secondary` | Color | Secondary frame background. |
| `.nb-phone-accent` | Color | Accent frame background. |
| `.nb-phone-neutral` | Color | Neutral frame background. |
| `.nb-phone-dark` | Variant | Dark screen fill. |

> **Naming note**: The catalog slug is `phone-mockup`. The CSS filename is `phone.css` and the base class is `.nb-phone`.

### Class Combination Examples

```html
<div class="nb-phone nb-phone-lg nb-phone-primary">
  <div class="nb-phone-notch">
    <div class="nb-phone-notch-bar"></div>
  </div>
  <div class="nb-phone-screen">
    <div class="nb-phone-screen-content">
      <!-- content -->
    </div>
  </div>
  <div class="nb-phone-indicator">
    <div class="nb-phone-indicator-bar"></div>
  </div>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-phone">
  <div class="nb-phone-notch">
    <div class="nb-phone-notch-bar"></div>
  </div>
  <div class="nb-phone-screen">
    <div class="nb-phone-screen-content">
      <p>Mobile screen content goes here.</p>
    </div>
  </div>
  <div class="nb-phone-indicator">
    <div class="nb-phone-indicator-bar"></div>
  </div>
</div>
```

### Semantic Element

- **Preferred**: `<figure>` with an optional `<figcaption>` for app screenshots, or `<div>` for UI previews.
- **Images**: Use `<img>` inside `.nb-phone-screen` or `.nb-phone-screen-content` with an appropriate `alt` attribute.

### Part Usage Rules

| Part | Required? | Notes |
|------|-----------|-------|
| `.nb-phone-notch` / `.nb-phone-notch-bar` | Recommended | Decorative notch at the top. |
| `.nb-phone-screen` | Recommended | Main screen area. |
| `.nb-phone-screen-content` | No | Optional padding wrapper for screen content. |
| `.nb-phone-indicator` / `.nb-phone-indicator-bar` | No | Decorative home indicator. |
| `.nb-phone-button` | No | Optional home button. |

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `alt` | Recommended (images) | Descriptive text | For screenshots inside the screen. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-label` | On the frame to describe the preview (e.g., "Mobile app preview"). |
| `aria-hidden="true"` | On decorative notch and indicator elements. |

### Keyboard Behavior

Phone Mockup is a **non-interactive container**. Keyboard navigation flows through any interactive content placed inside `.nb-phone-screen`.

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | — N/A | — | Phone Mockup is not interactive; hover state is not applicable. |
| **active** | — N/A | — | Phone Mockup is not interactive; active state is not applicable. |
| **focus-visible** | — N/A | — | Phone Mockup is not focusable by default. |
| **disabled** | — N/A | — | Phone Mockup is not an interactive element. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

```css
.nb-phone {
  --_bg: var(--nb-base-100);
  --_frame-bg: var(--nb-base-300);
  --_border: var(--nb-border);
  --_shadow: var(--nb-shadow-lg);

  display: flex;
  flex-direction: column;
  inline-size: 100%;
  max-inline-size: 20rem;
  border: var(--nb-border-width) solid var(--_border);
  border-radius: var(--nb-radius-box);
  background: var(--_frame-bg);
  box-shadow: var(--_shadow);
  overflow: hidden;
  padding: var(--nb-space-3);
}
```

The screen renders a subtle striped placeholder when empty via `:empty::before`.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-phone {
    transition: none;
  }
}
```

> **Note**: The base phone does not define any transitions; this rule is present for forward compatibility.

### RTL

Uses logical properties; no special RTL overrides needed.

### Forced Colors

```css
@media (forced-colors: active) {
  .nb-phone {
    border: 2px solid CanvasText;
    forced-color-adjust: none;
  }

  .nb-phone-notch-bar,
  .nb-phone-screen,
  .nb-phone-indicator-bar,
  .nb-phone-button {
    border-color: CanvasText;
  }
}
```

---

## Examples

### Basic Phone Mockup

```html
<div class="nb-phone" aria-label="Mobile app preview">
  <div class="nb-phone-notch">
    <div class="nb-phone-notch-bar"></div>
  </div>
  <div class="nb-phone-screen">
    <div class="nb-phone-screen-content">
      <h5>Neo-Brutal</h5>
      <p>Mobile-first components.</p>
    </div>
  </div>
  <div class="nb-phone-indicator">
    <div class="nb-phone-indicator-bar"></div>
  </div>
</div>
```

### Large Primary Phone Mockup

```html
<div class="nb-phone nb-phone-lg nb-phone-primary" aria-label="Fitness app preview">
  <div class="nb-phone-notch">
    <div class="nb-phone-notch-bar"></div>
  </div>
  <div class="nb-phone-screen">
    <img src="app-screenshot.png" alt="Fitness app dashboard" />
  </div>
  <div class="nb-phone-indicator">
    <div class="nb-phone-indicator-bar"></div>
  </div>
</div>
```

### Dark Phone Mockup

```html
<div class="nb-phone nb-phone-dark nb-phone-accent" aria-label="Music player preview">
  <div class="nb-phone-notch">
    <div class="nb-phone-notch-bar"></div>
  </div>
  <div class="nb-phone-screen">
    <div class="nb-phone-screen-content">
      <p>Now Playing</p>
      <h5>Midnight City</h5>
      <p>M83 • Hurry Up, We're Dreaming</p>
    </div>
  </div>
  <div class="nb-phone-indicator">
    <div class="nb-phone-indicator-bar"></div>
  </div>
</div>
```

---

## Known Issues

- The showcase demo uses `.nb-phone-home`, which does not exist in the current CSS build. Use `.nb-phone-indicator` and `.nb-phone-indicator-bar` for the home indicator, or `.nb-phone-button` for a circular home button.
- The demo does not include `.nb-phone-notch-bar`, `.nb-phone-screen-content`, `.nb-phone-indicator`, or `.nb-phone-indicator-bar`, so the current CSS will not fully render the demo markup as intended.
