# Navbar API

> **Component**: Navbar  
> **Category**: Navigation  
> **Base class**: `.nb-navbar`  
> **Status**: Ready (visual structure, responsive layout, and collapse interaction implemented)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-navbar` | Component | Top navigation bar container. Required. |
| `.nb-navbar-brand` | Part | Brand link or heading on the left side of the navbar. |
| `.nb-navbar-nav` | Part | Navigation link list. |
| `.nb-navbar-actions` | Part | Action buttons area on the right side of the navbar. |
| `.nb-navbar-toggle` | Part | Mobile collapse toggle button. |
| `.nb-navbar-collapse` | Part | Collapsible wrapper for nav links and actions. |
| `.is-open` | State | Utility class on `.nb-navbar-collapse` that forces visibility on mobile. |

### Class Combination Examples

```html
<!-- Default navbar -->
<nav class="nb-navbar" aria-label="Main navigation">
  <a href="#" class="nb-navbar-brand">NeoBrand</a>
  <div class="nb-navbar-collapse is-open" id="navbar-collapse">
    <ul class="nb-navbar-nav">
      <li><a href="#">Home</a></li>
      <li><a href="#">Features</a></li>
      <li><a href="#">Pricing</a></li>
    </ul>
    <div class="nb-navbar-actions">
      <button class="nb-btn nb-btn-sm" type="button">Sign In</button>
      <button class="nb-btn nb-btn-sm nb-btn-primary" type="button">Get Started</button>
    </div>
  </div>
  <button class="nb-navbar-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false" aria-controls="navbar-collapse">
    <span aria-hidden="true">☰</span>
  </button>
</nav>
```

---

## DOM Contract

### Recommended Structure

```html
<nav class="nb-navbar" aria-label="Main navigation">
  <a href="#" class="nb-navbar-brand">Brand</a>
  <div class="nb-navbar-collapse is-open" id="navbar-collapse">
    <ul class="nb-navbar-nav">
      <li><a href="#home">Home</a></li>
      <li><a href="#features">Features</a></li>
      <li><a href="#pricing">Pricing</a></li>
    </ul>
    <div class="nb-navbar-actions">
      <button class="nb-btn nb-btn-sm" type="button">Sign In</button>
    </div>
  </div>
  <button class="nb-navbar-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false" aria-controls="navbar-collapse">
    <span aria-hidden="true">☰</span>
  </button>
</nav>
```

### Semantic Element

- **Preferred**: `<nav>` with an `aria-label` describing its purpose.
- **Brand**: Use `<a>` with `.nb-navbar-brand` when it links to the home page.
- **Nav links**: Wrap links in `<ul>` / `<li>` with `.nb-navbar-nav`.
- **Toggle**: Use a `<button>` with visible icon and accessible label.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `aria-label` | Recommended | Description of navigation | Distinguishes nav landmarks when multiple navbars exist. |
| `aria-expanded` | Recommended | `"true"` / `"false"` | Indicates collapse state on the toggle button. |
| `aria-controls` | Recommended | ID of `.nb-navbar-collapse` | Associates toggle with the collapsible region. |
| `type="button"` | Recommended | `"button"` | Prevents accidental form submission. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-label` | On the mobile toggle when it contains only an icon. |
| `aria-current="page"` | On the active nav link. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus through brand, toggle (on mobile), nav links, and actions. |
| `Enter` / `Space` | Activates the toggle button to open/close the mobile menu. |
| `Escape` | Closes an open mobile menu. |
| Standard link keys | Nav links follow native anchor behavior. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ | `.nb-navbar-nav a:hover` | Link background changes to `var(--nb-base-200)`. |
| **hover** | ✅ | `.nb-navbar-toggle:hover` | Shadow elevates to `--nb-shadow-md` and translate shifts `(-2px, -2px)`. |
| **active** | ✅ | `.nb-navbar-toggle:active` | Shadow drops to `--nb-shadow-xs` and translate shifts `(2px, 2px)`. |
| **focus-visible** | ✅ | `.nb-navbar-nav a:focus-visible`, `.nb-navbar-toggle:focus-visible` | `outline: 2px solid var(--nb-focus)` with 2px offset. |
| **disabled** | ❌ Not applicable | — | Navbar links/toggle are not designed for a disabled state. |
| **open** | ✅ | `.nb-navbar-collapse.is-open` | Forces the collapse region to display as flex on mobile. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

- Navbar uses Flexbox with `space-between` alignment and a bottom border.
- Collapse region is a flex row on desktop and a full-width column on mobile.
- Mobile toggle is hidden on desktop and visible below `768px`.
- Toggle uses the standard interactive surface shadow/transform pattern.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-navbar-nav a,
  .nb-navbar-toggle {
    transition: none;
  }
}
```

### RTL

Uses logical properties (`border-block-end`, `border-block-start`, `padding-block-start`, etc.); no special RTL overrides needed.

---

## Examples

### Basic Navbar

```html
<nav class="nb-navbar" data-nb-navbar aria-label="Main navigation">
  <a href="#" class="nb-navbar-brand">NeoBrand</a>
  <div class="nb-navbar-collapse is-open" id="navbar-collapse">
    <ul class="nb-navbar-nav">
      <li><a href="#home">Home</a></li>
      <li><a href="#features">Features</a></li>
      <li><a href="#pricing">Pricing</a></li>
    </ul>
    <div class="nb-navbar-actions">
      <button class="nb-btn nb-btn-sm" type="button">Sign In</button>
      <button class="nb-btn nb-btn-sm nb-btn-primary" type="button">Get Started</button>
    </div>
  </div>
  <button class="nb-navbar-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false" aria-controls="navbar-collapse">
    <span aria-hidden="true">☰</span>
  </button>
</nav>
```

### Collapsed Mobile Navbar

```html
<nav class="nb-navbar" data-nb-navbar aria-label="Mobile navigation preview">
  <a href="#" class="nb-navbar-brand">NeoBrand</a>
  <div class="nb-navbar-collapse" id="navbar-collapse-closed">
    <ul class="nb-navbar-nav">
      <li><a href="#docs">Docs</a></li>
      <li><a href="#blog">Blog</a></li>
    </ul>
  </div>
  <button class="nb-navbar-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false" aria-controls="navbar-collapse-closed">
    <span aria-hidden="true">☰</span>
  </button>
</nav>
```

---

## JavaScript Interaction

The optional interaction module adds toggle behavior, keyboard support, and ARIA synchronization.

### Initialization

```ts
import { createNavbar } from "@neo-brutal-ui/interactions/navbar";

document.querySelectorAll<HTMLElement>("[data-nb-navbar]").forEach((navbar) => {
  createNavbar(navbar);
});
```

### API

| Method | Description |
|--------|-------------|
| `open()` | Opens the collapse menu and focuses the first nav link. |
| `close()` | Closes the collapse menu and returns focus to the toggle. |
| `toggle()` | Opens if closed, closes if open. |
| `destroy()` | Removes all event listeners and cleans up state. |
| `isOpen` | Read-only boolean state. |

### Events

The module dispatches bubbling, cancellable custom events:

- `nb:navbar:open`
- `nb:navbar:close`
- `nb:navbar:toggle`

