# Footer API

> **Component**: Footer  
> **Category**: Layout  
> **Base class**: `.nb-footer`  
> **Status**: Beta (brand, link groups, and bottom bar implemented; compact and color variants available)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-footer` | Component | Base footer container. Required. |
| `.nb-footer-brand` | Part | Brand area with name and tagline stacked vertically. |
| `.nb-footer-brand-name` | Part | Bold brand name. |
| `.nb-footer-brand-tagline` | Part | Muted tagline below the brand name. |
| `.nb-footer-links` | Part | Wrapper for link groups. |
| `.nb-footer-link-group` | Part | Vertical group of related links with a title. |
| `.nb-footer-link-title` | Part | Uppercase bold group title. |
| `.nb-footer-link` | Part | Individual footer link with hover underline. |
| `.nb-footer-divider` | Part | Horizontal rule separating links from the bottom bar. |
| `.nb-footer-bottom` | Part | Bottom bar with copyright and legal links. |
| `.nb-footer-copyright` | Part | Copyright text. |
| `.nb-footer-legal` | Part | List of legal links. |
| `.nb-footer-compact` | Variant | Reduces padding and link group min-width. |
| `.nb-footer-primary` | Color | Primary background and content colors. |
| `.nb-footer-neutral` | Color | Neutral background and content colors. |

### Class Combination Examples

```html
<footer class="nb-footer nb-footer-compact">
  <div class="nb-footer-brand">
    <p class="nb-footer-brand-name">NeoBrand</p>
  </div>
  <div class="nb-footer-links">
    <div class="nb-footer-link-group">
      <a href="#" class="nb-footer-link">Docs</a>
      <a href="#" class="nb-footer-link">GitHub</a>
    </div>
  </div>
  <hr class="nb-footer-divider" />
  <div class="nb-footer-bottom">
    <p class="nb-footer-copyright">© 2026 NeoBrand</p>
    <div class="nb-footer-legal">
      <a href="#">License</a>
    </div>
  </div>
</footer>
```

---

## DOM Contract

### Recommended Structure

```html
<footer class="nb-footer">
  <div class="nb-footer-brand">
    <p class="nb-footer-brand-name">NeoBrand</p>
    <p class="nb-footer-brand-tagline">Brutalist UI components for modern web apps.</p>
  </div>
  <div class="nb-footer-links">
    <div class="nb-footer-link-group">
      <p class="nb-footer-link-title">Product</p>
      <a href="#" class="nb-footer-link">Features</a>
      <a href="#" class="nb-footer-link">Pricing</a>
    </div>
  </div>
  <hr class="nb-footer-divider" />
  <div class="nb-footer-bottom">
    <p class="nb-footer-copyright">© 2026 NeoBrand Inc.</p>
    <div class="nb-footer-legal">
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </div>
  </div>
</footer>
```

### Semantic Element

- **Preferred**: `<footer>`.
- **Inside sectioning content**: Use `<footer>` if it is the nearest footer ancestor for that section; otherwise use `<div class="nb-footer" role="contentinfo">`.

### Part Usage Rules

| Part | Required? | Notes |
|------|-----------|-------|
| `.nb-footer-brand` | No | Omit if no brand area is needed. |
| `.nb-footer-links` | No | Omit if no link groups are needed. |
| `.nb-footer-divider` | No | Visual separator; can be omitted. |
| `.nb-footer-bottom` | No | Omit if no copyright/legal content. |
| `.nb-footer-legal` | No | Use a plain `<div>` or `<ul>` inside `.nb-footer-bottom`. |

### Required Attributes

No component-specific required attributes.

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `role="contentinfo"` | If not using the `<footer>` element directly. |
| `aria-label` | If the page has multiple footers. |

### Keyboard Behavior

Footer is a **non-interactive container**. Keyboard navigation flows through footer links. Links receive focus and use standard `Tab` / `Shift+Tab` behavior.

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ | `.nb-footer-link:hover`, `.nb-footer-legal a:hover` | Color darkens to `--nb-base-content` and an underline appears. |
| **active** | ✅ (implicit) | `:active` | No explicit active styles; browser default applies. |
| **focus-visible** | ✅ | `:focus-visible` (global) | `outline: 2px solid var(--nb-focus); outline-offset: 2px;` |
| **disabled** | — N/A | — | Footer is not an interactive element. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

```css
.nb-footer {
  --_bg: var(--nb-base-100);
  --_fg: var(--nb-base-content);
  --_border: var(--nb-border);
  --_padding: var(--nb-space-8);

  display: flex;
  flex-direction: column;
  gap: var(--nb-space-6);
  padding: var(--_padding);
  border: var(--nb-border-width) solid var(--_border);
  border-radius: var(--nb-radius-box);
  background: var(--_bg);
  color: var(--_fg);
  box-shadow: var(--nb-shadow-sm);
}

.nb-footer-link {
  transition: color var(--nb-duration-fast) var(--nb-ease-out);
}
```

Color variants override `--_bg`, `--_fg`, and link/title colors. Compact reduces `--_padding` and link-group min-width.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-footer-link,
  .nb-footer-legal a {
    transition: none;
  }
}
```

### RTL

Uses logical properties and flex wrap; no special RTL overrides needed.

### Forced Colors

```css
@media (forced-colors: active) {
  .nb-footer {
    border: 2px solid CanvasText;
    forced-color-adjust: none;
  }

  .nb-footer-divider {
    background: CanvasText;
  }

  .nb-footer-link,
  .nb-footer-legal a {
    color: LinkText;
  }
}
```

---

## Examples

### Default Footer

```html
<footer class="nb-footer">
  <div class="nb-footer-brand">
    <p class="nb-footer-brand-name">NeoBrand</p>
    <p class="nb-footer-brand-tagline">Brutalist UI components for modern web apps.</p>
  </div>
  <div class="nb-footer-links">
    <div class="nb-footer-link-group">
      <p class="nb-footer-link-title">Product</p>
      <a href="#" class="nb-footer-link">Features</a>
      <a href="#" class="nb-footer-link">Pricing</a>
    </div>
  </div>
  <hr class="nb-footer-divider" />
  <div class="nb-footer-bottom">
    <p class="nb-footer-copyright">© 2026 NeoBrand Inc.</p>
    <div class="nb-footer-legal">
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </div>
  </div>
</footer>
```

### Compact Footer

```html
<footer class="nb-footer nb-footer-compact">
  <div class="nb-footer-brand">
    <p class="nb-footer-brand-name">NeoBrand</p>
  </div>
  <div class="nb-footer-links">
    <div class="nb-footer-link-group">
      <a href="#" class="nb-footer-link">Docs</a>
      <a href="#" class="nb-footer-link">GitHub</a>
      <a href="#" class="nb-footer-link">Twitter</a>
    </div>
  </div>
  <hr class="nb-footer-divider" />
  <div class="nb-footer-bottom">
    <p class="nb-footer-copyright">© 2026 NeoBrand</p>
    <div class="nb-footer-legal">
      <a href="#">License</a>
    </div>
  </div>
</footer>
```

### Primary Footer

```html
<footer class="nb-footer nb-footer-primary">
  <div class="nb-footer-brand">
    <p class="nb-footer-brand-name">NeoBrand</p>
    <p class="nb-footer-brand-tagline">Built for the bold.</p>
  </div>
  <div class="nb-footer-links">
    <div class="nb-footer-link-group">
      <p class="nb-footer-link-title">Platform</p>
      <a href="#" class="nb-footer-link">Dashboard</a>
      <a href="#" class="nb-footer-link">API</a>
    </div>
  </div>
  <hr class="nb-footer-divider" />
  <div class="nb-footer-bottom">
    <p class="nb-footer-copyright">© 2026 NeoBrand Inc.</p>
    <div class="nb-footer-legal">
      <a href="#">Contact</a>
    </div>
  </div>
</footer>
```
