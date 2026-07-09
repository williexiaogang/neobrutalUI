# Card API

> **Component**: Card  
> **Category**: Layout  
> **Base class**: `.nb-card`  
> **Status**: Ready

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-card` | Component | Base card container. Required. |
| `.nb-card-interactive` | State | Adds hover, focus-visible, and active lift/press feedback for clickable cards. |
| `.nb-card-media` | Part | Media slot for image, video, or SVG content. Adds a bottom divider and overflow clipping. |
| `.nb-card-header` | Part | Header section with bottom border and bold text. |
| `.nb-card-body` | Part | Main content area with standard padding. |
| `.nb-card-footer` | Part | Footer section with top border. |
| `.nb-card-title` | Part | Title element inside header. Removes default margins. |

### Class Combination Examples

```html
<!-- Minimal card -->
<div class="nb-card">
  <div class="nb-card-body">Content</div>
</div>

<!-- Full card with all parts -->
<article class="nb-card">
  <div class="nb-card-media">
    <img src="/preview.png" alt="" />
  </div>
  <header class="nb-card-header">
    <h2 class="nb-card-title">Card Title</h2>
  </header>
  <div class="nb-card-body">Main content goes here.</div>
  <footer class="nb-card-footer">Footer actions</footer>
</article>
```

---

## DOM Contract

### Recommended Structure

```html
<article class="nb-card">
  <header class="nb-card-header">
    <h2 class="nb-card-title">Card Title</h2>
  </header>
  <div class="nb-card-body">
    <p>Card content paragraph.</p>
  </div>
  <footer class="nb-card-footer">
    <button class="nb-btn">Action</button>
  </footer>
</article>
```

### Semantic Elements

| Element | Recommendation |
|---------|---------------|
| `<article>` | Preferred for standalone, self-contained content. |
| `<section>` | Acceptable for grouped content within a larger context. |
| `<div>` | Neutral fallback. Add `role="region"` and `aria-labelledby` if the card has a title. |

### Part Usage Rules

| Part | Required? | Notes |
|------|-----------|-------|
| `.nb-card-media` | No | Place before header/body for image, video, or SVG previews. Provide `alt` text for meaningful media; use empty `alt=""` for decorative media. |
| `.nb-card-header` | No | Omit if the card has no title or header content. |
| `.nb-card-body` | No | If omitted, place content directly inside `.nb-card` (flex column layout handles spacing). |
| `.nb-card-footer` | No | Omit if no footer actions or metadata. |
| `.nb-card-title` | No | Only use inside `.nb-card-header`. Can be any heading level (`h1`–`h6`). |

### ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-labelledby` | Reference the card title ID when using `role="region"`. |
| `aria-label` | If no visible title exists, provide an accessible name. |

### Keyboard Behavior

Card is a **non-interactive container** by default. Keyboard navigation flows through its child elements (buttons, links, form controls). If `.nb-card-interactive` is used on the card itself, make the element focusable (`tabindex="0"`) and provide role/keyboard activation semantics appropriate to the action.

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ | `.nb-card-interactive:hover` | Shadow elevates to `--nb-shadow-lg`, `translate(-2px, -2px)`. |
| **active** | ✅ | `.nb-card-interactive:active` | Shadow drops to `--nb-shadow-xs`, `translate(2px, 2px)`. |
| **focus-visible** | ✅ | `.nb-card-interactive:focus-visible` | Focus outline uses `--nb-focus`. |
| **disabled** | — N/A | — | Card is not an interactive element. |
| **loading** | ❌ Not implemented | — | No `.nb-card-loading` or `.is-loading` styles. |

> **Note**: Loading is intentionally handled by composing Card with Skeleton rather than a card-level loading state.

---

## CSS Implementation Notes

### Layout

```css
.nb-card {
  display: flex;
  flex-direction: column;
  border: var(--nb-border-width) solid var(--nb-border);
  border-radius: var(--nb-radius-box);    /* 0px */
  background: var(--nb-base-100);
  box-shadow: var(--nb-shadow-md);
}
```

### Interactive State

```css
.nb-card-interactive:hover {
  box-shadow: var(--nb-shadow-lg);
  transform: translate(-2px, -2px);
}
```

### Media Part

```css
.nb-card-media {
  display: block;
  inline-size: 100%;
  border-block-end: var(--nb-border-width) solid var(--nb-border);
  background: var(--nb-base-200);
  overflow: hidden;
}
```

### Parts

| Part | Padding | Border |
|------|---------|--------|
| `.nb-card-header` | `var(--nb-space-4)` (1rem) | Bottom: `var(--nb-border-width) solid var(--nb-border)` |
| `.nb-card-body` | `var(--nb-space-4)` (1rem) | None |
| `.nb-card-footer` | `var(--nb-space-4)` (1rem) | Top: `var(--nb-border-width) solid var(--nb-border)` |
| `.nb-card-title` | 0 | None. `font-size: var(--nb-text-xl)`, `font-weight: 700`. |

---

## Examples

### Minimal Card

```html
<div class="nb-card">
  <div class="nb-card-body">A simple card with only body content.</div>
</div>
```

### Card with Header and Body

```html
<article class="nb-card">
  <header class="nb-card-header">
    <h3 class="nb-card-title">Article Title</h3>
  </header>
  <div class="nb-card-body">
    <p>This card has a header and body but no footer.</p>
  </div>
</article>
```

### Full Card with All Parts

```html
<article class="nb-card">
  <header class="nb-card-header">
    <h2 class="nb-card-title">Project Settings</h2>
  </header>
  <div class="nb-card-body">
    <p>Configure your project preferences here.</p>
    <div class="nb-field">
      <label class="nb-field-label" for="project-name">Project Name</label>
      <input class="nb-input" id="project-name" type="text" />
    </div>
  </div>
  <footer class="nb-card-footer">
    <button class="nb-btn nb-btn-ghost">Cancel</button>
    <button class="nb-btn nb-btn-primary">Save</button>
  </footer>
</article>
```

### Card with Multiple Body Sections

```html
<article class="nb-card">
  <header class="nb-card-header">
    <h3 class="nb-card-title">Order Summary</h3>
  </header>
  <div class="nb-card-body">
    <p>Items in your cart:</p>
    <ul>
      <li>Widget A — $29.00</li>
      <li>Widget B — $15.00</li>
    </ul>
  </div>
  <div class="nb-card-body" style="border-top: var(--nb-border-width) solid var(--nb-border);">
    <p><strong>Total: $44.00</strong></p>
  </div>
  <footer class="nb-card-footer">
    <button class="nb-btn nb-btn-primary nb-btn-block">Checkout</button>
  </footer>
</article>
```

### Media Card

```html
<article class="nb-card">
  <div class="nb-card-media">
    <img src="/preview.png" alt="Dashboard preview" />
  </div>
  <div class="nb-card-body">
    <p>Media content follows the same hard-bordered card structure.</p>
  </div>
</article>
```

### Interactive Card

```html
<article
  class="nb-card nb-card-interactive"
  tabindex="0"
  role="button"
  aria-labelledby="project-card-title"
>
  <header class="nb-card-header">
    <h3 class="nb-card-title" id="project-card-title">Open project</h3>
  </header>
  <div class="nb-card-body">Project summary.</div>
</article>
```

---

## Known Issues

- None listed in component catalog.
