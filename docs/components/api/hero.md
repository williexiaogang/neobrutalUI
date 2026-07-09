# Hero API

> **Component**: Hero  
> **Category**: Layout  
> **Base class**: `.nb-hero`  
> **Status**: Ready (size, alignment, and color variants implemented; JS interactions optional; reduced-motion and disabled states are N/A)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-hero` | Component | Base hero container. Required. |
| `.nb-hero-content` | Part | Wraps title, subtitle, description, and actions. |
| `.nb-hero-title` | Part | Main hero heading. |
| `.nb-hero-subtitle` | Part | Smaller muted label above the title. |
| `.nb-hero-description` | Part | Body text below the title. |
| `.nb-hero-actions` | Part | Button/action row. |
| `.nb-hero-media` | Part | Optional media area with border and background. |
| `.nb-hero-center` | Variant | Centers text and actions horizontally. |
| `.nb-hero-sm` | Size | Reduced padding and smaller title/subtitle. |
| `.nb-hero-lg` | Size | Increased padding and larger title. |
| `.nb-hero-primary` | Color | Primary background and content colors. |
| `.nb-hero-secondary` | Color | Secondary background and content colors. |
| `.nb-hero-accent` | Color | Accent background and content colors. |
| `.nb-hero-neutral` | Color | Neutral background and content colors. |

### Class Combination Examples

```html
<!-- Centered large primary hero -->
<div class="nb-hero nb-hero-lg nb-hero-center nb-hero-primary">
  <div class="nb-hero-content">
    <p class="nb-hero-subtitle">v2.0 is here</p>
    <h1 class="nb-hero-title">Ship faster</h1>
    <p class="nb-hero-description">Everything you need to build brutalist web apps.</p>
    <div class="nb-hero-actions">
      <button class="nb-btn nb-btn-accent" type="button">Download</button>
      <button class="nb-btn nb-btn-ghost" type="button">Read Changelog</button>
    </div>
  </div>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-hero">
  <div class="nb-hero-content">
    <p class="nb-hero-subtitle">Neo-Brutal UI</p>
    <h1 class="nb-hero-title">Build bold interfaces</h1>
    <p class="nb-hero-description">
      A modern component library with hard shadows, thick borders, and zero ambiguity.
    </p>
    <div class="nb-hero-actions">
      <button class="nb-btn nb-btn-primary" type="button">Get Started</button>
      <button class="nb-btn" type="button">View Docs</button>
    </div>
  </div>
</div>
```

### Semantic Element

- **Preferred**: `<section>` with an `aria-label` or `aria-labelledby` pointing to the title.
- **Heading level**: `.nb-hero-title` is typically `<h1>` on landing pages, but can be any heading level appropriate to the document outline.

### Part Usage Rules

| Part | Required? | Notes |
|------|-----------|-------|
| `.nb-hero-content` | No | Wraps text content and actions. Can be omitted only if the hero contains only media. |
| `.nb-hero-title` | Recommended | Provides the main accessible name for the section. |
| `.nb-hero-subtitle` | No | Optional eyebrow text. |
| `.nb-hero-description` | No | Optional supporting text. |
| `.nb-hero-actions` | No | Optional CTA row. |
| `.nb-hero-media` | No | Optional image/video area. |

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `aria-label` / `aria-labelledby` | Recommended | — | Provide an accessible name for the `<section>` wrapper. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-labelledby` | Reference the hero title ID when using `<section>`. |
| `aria-label` | If no visible title exists. |

### Keyboard Behavior

Hero is a **non-interactive container**. Keyboard navigation flows through action buttons or links inside `.nb-hero-actions`.

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | — N/A | — | Hero is not interactive; hover state is not applicable. |
| **active** | — N/A | — | Hero is not interactive; active state is not applicable. |
| **focus-visible** | — N/A | — | Hero is not focusable by default. |
| **disabled** | — N/A | — | Hero is not an interactive element. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

```css
.nb-hero {
  --_bg: var(--nb-base-100);
  --_fg: var(--nb-base-content);
  --_border: var(--nb-border);
  --_padding: var(--nb-space-12);

  display: flex;
  flex-direction: column;
  gap: var(--nb-space-6);
  padding: var(--_padding);
  border: var(--nb-border-width) solid var(--_border);
  border-radius: var(--nb-radius-box);
  background: var(--_bg);
  color: var(--_fg);
  box-shadow: var(--nb-shadow-md);
}
```

Color variants override `--_bg` and `--_fg` and adjust subtitle/description opacity. Size variants only adjust `--_padding` and type scale.

### Reduced Motion

No transitions or animations; reduced-motion is not applicable.

### RTL

Uses logical properties (`padding`, `margin-inline`, etc.); no special RTL overrides needed.

### Forced Colors

```css
@media (forced-colors: active) {
  .nb-hero {
    border: 2px solid CanvasText;
    forced-color-adjust: none;
  }

  .nb-hero-media {
    border: 2px solid CanvasText;
  }
}
```

---

## Examples

### Default Hero

```html
<section class="nb-hero" aria-labelledby="hero-title">
  <div class="nb-hero-content">
    <p class="nb-hero-subtitle">Neo-Brutal UI</p>
    <h1 id="hero-title" class="nb-hero-title">Build bold interfaces</h1>
    <p class="nb-hero-description">
      A modern component library with hard shadows, thick borders, and zero ambiguity.
    </p>
    <div class="nb-hero-actions">
      <button class="nb-btn nb-btn-primary" type="button">Get Started</button>
      <button class="nb-btn" type="button">View Docs</button>
    </div>
  </div>
</section>
```

### Centered Large Primary Hero

```html
<section class="nb-hero nb-hero-lg nb-hero-center nb-hero-primary" aria-labelledby="hero-title">
  <div class="nb-hero-content">
    <p class="nb-hero-subtitle">v2.0 is here</p>
    <h1 id="hero-title" class="nb-hero-title">Ship faster</h1>
    <p class="nb-hero-description">Everything you need to build brutalist web apps.</p>
    <div class="nb-hero-actions">
      <button class="nb-btn nb-btn-accent" type="button">Download</button>
      <button class="nb-btn nb-btn-ghost" type="button">Read Changelog</button>
    </div>
  </div>
</section>
```

### Hero with Media

```html
<section class="nb-hero nb-hero-sm" aria-labelledby="hero-title">
  <div class="nb-hero-content">
    <h1 id="hero-title" class="nb-hero-title">Ready for production</h1>
    <p class="nb-hero-description">Battle-tested components with accessibility baked in.</p>
    <div class="nb-hero-actions">
      <button class="nb-btn nb-btn-sm nb-btn-secondary" type="button">Learn More</button>
    </div>
  </div>
  <div class="nb-hero-media">
    <img src="hero-image.png" alt="" />
  </div>
</section>
```
