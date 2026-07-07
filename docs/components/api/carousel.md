# Carousel API

> **Component**: Carousel  
> **Category**: Data Display  
> **Base class**: `.nb-carousel`  
> **Status**: Beta (scroll-snap, size variants, color accent borders, overlay/inline nav modes, multi-slide visible modes, keyboard navigation, auto-play, and reduced-motion support are implemented)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-carousel` | Component | Root carousel container. Required. |
| `.nb-carousel-viewport` | Part | Masking wrapper with border, radius, and shadow. |
| `.nb-carousel-track` | Part | Horizontal scroll-snap flex track. |
| `.nb-carousel-slide` | Part | Individual carousel slide. |
| `.nb-carousel-show-2` | Layout | Shows two slides at a time. |
| `.nb-carousel-show-3` | Layout | Shows three slides at a time. |
| `.nb-carousel-show-4` | Layout | Shows four slides at a time. |
| `.nb-carousel-nav` | Component / Part | Previous / next arrow button. |
| `.nb-carousel-nav-prev` | Part | Previous arrow modifier. |
| `.nb-carousel-nav-next` | Part | Next arrow modifier. |
| `.nb-carousel-nav-overlay` | Layout | Positions arrows absolutely over the viewport. |
| `.nb-carousel-dots` | Part | Dot indicator list container. |
| `.nb-carousel-dot` | Part | Individual dot button. |
| `.nb-carousel-dot-active` | State | Active / current slide dot. |
| `.nb-carousel-caption` | Part | Caption area below the viewport. |
| `.nb-carousel-caption-title` | Part | Caption title. |
| `.nb-carousel-caption-body` | Part | Caption body text. |
| `.nb-carousel-primary` | Color | Accent viewport border with `--nb-primary`. |
| `.nb-carousel-secondary` | Color | Accent viewport border with `--nb-secondary`. |
| `.nb-carousel-accent` | Color | Accent viewport border with `--nb-accent`. |
| `.nb-carousel-info` | Color | Accent viewport border with `--nb-info`. |
| `.nb-carousel-success` | Color | Accent viewport border with `--nb-success`. |
| `.nb-carousel-warning` | Color | Accent viewport border with `--nb-warning`. |
| `.nb-carousel-error` | Color | Accent viewport border with `--nb-error`. |
| `.nb-carousel-sm` | Size | Smaller slide, nav, and caption sizing. |
| `.nb-carousel-lg` | Size | Larger slide, nav, and caption sizing. |
| `.nb-carousel-vertical` | Layout | Vertical scrolling track. |

### Class Combination Examples

```html
<!-- Basic inline-nav carousel -->
<div class="nb-carousel">
  <div class="nb-carousel-viewport">
    <div class="nb-carousel-track">
      <div class="nb-carousel-slide">Slide 1</div>
      <div class="nb-carousel-slide">Slide 2</div>
    </div>
  </div>
  <button class="nb-carousel-nav nb-carousel-nav-prev" type="button">‹</button>
  <button class="nb-carousel-nav nb-carousel-nav-next" type="button">›</button>
</div>

<!-- Overlay nav + primary accent -->
<div class="nb-carousel nb-carousel-primary nb-carousel-nav-overlay">
  <div class="nb-carousel-viewport">...</div>
  <button class="nb-carousel-nav nb-carousel-nav-prev" type="button">‹</button>
  <button class="nb-carousel-nav nb-carousel-nav-next" type="button">›</button>
</div>

<!-- Multi-slide visible -->
<div class="nb-carousel nb-carousel-show-2">
  <div class="nb-carousel-viewport">
    <div class="nb-carousel-track">
      <div class="nb-carousel-slide">A</div>
      <div class="nb-carousel-slide">B</div>
      <div class="nb-carousel-slide">C</div>
    </div>
  </div>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-carousel" data-nb-carousel>
  <div class="nb-carousel-viewport">
    <div class="nb-carousel-track" role="region" aria-label="Featured items" aria-roledescription="carousel">
      <div class="nb-carousel-slide" role="group" aria-roledescription="slide" aria-label="1 of 3">
        Slide 1
      </div>
      <div class="nb-carousel-slide" role="group" aria-roledescription="slide" aria-label="2 of 3">
        Slide 2
      </div>
    </div>
  </div>

  <button class="nb-carousel-nav nb-carousel-nav-prev" type="button" aria-label="Previous slide">‹</button>
  <ol class="nb-carousel-dots" role="tablist" aria-label="Slide indicators">
    <li><button class="nb-carousel-dot nb-carousel-dot-active" role="tab" aria-selected="true" aria-label="Slide 1" type="button"></button></li>
    <li><button class="nb-carousel-dot" role="tab" aria-selected="false" aria-label="Slide 2" type="button"></button></li>
  </ol>
  <button class="nb-carousel-nav nb-carousel-nav-next" type="button" aria-label="Next slide">›</button>
</div>
```

### Semantic Element

- **Preferred**: `<div>` with `role="region" aria-roledescription="carousel"` on the track.
- Each slide should use `role="group" aria-roledescription="slide"`.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `type="button"` | Yes (for nav/dot buttons) | `"button"` | Prevents form submission. |
| `aria-label` | Recommended | Text | Required on nav and dot buttons for accessible names. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `role="region"` / `aria-roledescription="carousel"` | On `.nb-carousel-track` to convey carousel semantics. |
| `role="group"` / `aria-roledescription="slide"` | On each `.nb-carousel-slide`. |
| `aria-label="X of N"` | On each slide for position context. |
| `role="tablist"` / `role="tab"` | On dot indicators. |
| `aria-selected` | On active dot. |
| `aria-disabled="true"` | On nav buttons when at the first/last slide. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus to nav buttons / dot indicators. |
| `Enter` / `Space` | Activates focused nav or dot button. |
| `←` / `→` | Moves to previous / next slide (requires JS). |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **active dot** | ✅ | `.nb-carousel-dot-active` | Dot scales up and uses primary fill. |
| **hover** | ✅ | `.nb-carousel-nav:hover:not(:disabled)` / `.nb-carousel-dot:hover` | Nav lifts and shadow grows; dot scales and darkens. |
| **focus-visible** | ✅ | `.nb-carousel-nav:focus-visible` / `.nb-carousel-dot:focus-visible` | `outline: 2px solid var(--nb-focus); outline-offset: 2px;` |
| **disabled** | ✅ | `.nb-carousel-nav:disabled` | Opacity 0.5, `cursor: not-allowed`, shadow removed, pressed position. |
| **active** | ✅ | `.nb-carousel-nav:active:not(:disabled)` | Shadow shrinks and nav shifts down. |
| **current** | ✅ | `.nb-carousel-dot-active` | Indicates the current slide. |
| **selected** | ✅ | `aria-selected="true"` on dots | Mirrors current dot state. |
| **read-only** | ❌ Not applicable | — | Carousels are not read-only form controls. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

`.nb-carousel` lays out a viewport, a horizontal scroll-snap track, nav buttons, dots, and an optional caption. The track hides scrollbars and uses smooth scroll. Nav buttons follow the standard interactive surface pattern (hover lift, active press, disabled state). Color variants only recolor the viewport border.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-carousel-track {
    scroll-behavior: auto;
  }

  .nb-carousel-nav,
  .nb-carousel-dot {
    transition: none;
  }
}
```

### RTL

Uses logical properties (`inset-inline-start`, `inset-inline-end`) for overlay nav positioning; no special RTL overrides needed.

---

## Examples

### Inline Navigation

```html
<div class="nb-carousel">
  <div class="nb-carousel-viewport">
    <div class="nb-carousel-track">
      <div class="nb-carousel-slide">Slide 1</div>
      <div class="nb-carousel-slide">Slide 2</div>
      <div class="nb-carousel-slide">Slide 3</div>
    </div>
  </div>
  <div style="display: flex; justify-content: center; gap: var(--nb-space-3);">
    <button class="nb-carousel-nav nb-carousel-nav-prev" type="button" aria-label="Previous slide">‹</button>
    <button class="nb-carousel-nav nb-carousel-nav-next" type="button" aria-label="Next slide">›</button>
  </div>
</div>
```

### Overlay Navigation with Accent

```html
<div class="nb-carousel nb-carousel-primary nb-carousel-nav-overlay">
  <div class="nb-carousel-viewport">...</div>
  <button class="nb-carousel-nav nb-carousel-nav-prev" type="button" aria-label="Previous slide">‹</button>
  <button class="nb-carousel-nav nb-carousel-nav-next" type="button" aria-label="Next slide">›</button>
</div>
```

### Multi-Slide Visible

```html
<div class="nb-carousel nb-carousel-show-2">
  <div class="nb-carousel-viewport">
    <div class="nb-carousel-track">
      <div class="nb-carousel-slide">A</div>
      <div class="nb-carousel-slide">B</div>
      <div class="nb-carousel-slide">C</div>
    </div>
  </div>
</div>
```

### Dots

```html
<ol class="nb-carousel-dots" role="tablist" aria-label="Slide indicators">
  <li><button class="nb-carousel-dot nb-carousel-dot-active" role="tab" aria-selected="true" aria-label="Slide 1" type="button"></button></li>
  <li><button class="nb-carousel-dot" role="tab" aria-selected="false" aria-label="Slide 2" type="button"></button></li>
</ol>
```
