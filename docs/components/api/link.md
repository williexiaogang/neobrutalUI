# Link API

> **Component**: Link  
> **Category**: Navigation  
> **Base class**: `.nb-link`  
> **Status**: Beta (underline, hover background, focus-visible, and forced-colors support included)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-link` | Component | Brutalist link style. Required. |

### Class Combination Examples

```html
<!-- Inline link -->
<p>
  Read the <a href="#" class="nb-link">documentation</a> for more details.
</p>

<!-- Standalone link -->
<a href="#" class="nb-link">Get Started</a>
```

---

## DOM Contract

### Recommended Structure

```html
<a href="#" class="nb-link">Learn more</a>
```

### Semantic Element

- **Preferred**: `<a>` with a valid `href`.
- **Avoid**: Using a `<button>` with `.nb-link`; use `.nb-btn` for actions instead.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `href` | Yes | Valid URL | Links must have a destination to be keyboard-accessible. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-label` | When the link text alone does not describe the destination. |
| `aria-current="page"` | When the link points to the current page. |
| `rel` | For external links, security, or SEO (e.g. `rel="noopener noreferrer"`). |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus to the link. |
| `Enter` | Activates the link. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ | `.nb-link:hover` | Background changes to `var(--nb-accent)`, text to `var(--nb-accent-content)`, underline removed. |
| **active** | ❌ Not styled | — | No explicit `:active` styles. |
| **focus-visible** | ✅ | `.nb-link:focus-visible` | `outline: 2px solid var(--nb-focus)` with 2px offset. |
| **disabled** | ❌ Not applicable | — | Disabled links are not a supported pattern; remove the `href` or use a `<span>` instead. |
| **current** | ❌ Not styled | — | No dedicated current-page styling; rely on `.nb-breadcrumb-current` or add your own. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

- Links use a 2px underline with 2px underline offset.
- On hover the underline is removed and the background is filled with the accent color.
- No transitions or shadows are applied.

### Reduced Motion

No transitions or animations; reduced-motion is not applicable.

### RTL

Uses text-decoration and background properties; no special RTL overrides needed.

---

## Examples

### Inline Link

```html
<p>
  This is a paragraph with an <a href="#" class="nb-link">inline link</a> inside body text.
</p>
```

### Standalone Link

```html
<a href="#" class="nb-link">Get Started</a>
<a href="#" class="nb-link">Documentation</a>
<a href="#" class="nb-link">User Profile</a>
```

### External Link

```html
<a href="https://example.com" class="nb-link" target="_blank" rel="noopener noreferrer">
  External URL
</a>
```

