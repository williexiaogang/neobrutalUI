# Badge API

> **Component**: Badge  
> **Category**: Data Display  
> **Base class**: `.nb-badge`  
> **Status**: Ready (base visuals, semantic colors, outline variant, and removable tag control styling implemented)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-badge` | Component | Base badge class. Required. |
| `.nb-badge-primary` | Color | Primary background with primary-content text. |
| `.nb-badge-secondary` | Color | Secondary background with secondary-content text. |
| `.nb-badge-accent` | Color | Accent background with accent-content text. |
| `.nb-badge-info` | Color | Info background with info-content text. |
| `.nb-badge-success` | Color | Success background with success-content text. |
| `.nb-badge-warning` | Color | Warning background with warning-content text. |
| `.nb-badge-error` | Color | Error background with error-content text. |
| `.nb-badge-outline` | Variant | Transparent background with border and content color. |
| `.nb-badge-remove` | Part | Small inline remove button for removable tags. |

### Class Combination Examples

```html
<!-- Default badge -->
<span class="nb-badge">Default</span>

<!-- Color variant -->
<span class="nb-badge nb-badge-primary">Primary</span>

<!-- Outline variant -->
<span class="nb-badge nb-badge-outline">Outline</span>

<!-- Color + outline -->
<span class="nb-badge nb-badge-error nb-badge-outline">Error Outline</span>

<!-- Removable tag -->
<span class="nb-badge nb-badge-secondary">
  Filter
  <button class="nb-badge-remove" type="button" aria-label="Remove Filter">&times;</button>
</span>
```

---

## DOM Contract

### Recommended Structure

```html
<span class="nb-badge nb-badge-primary">New</span>
```

### Recommended Structure (Removable Tag)

```html
<span class="nb-badge nb-badge-secondary">
  Filter
  <button class="nb-badge-remove" type="button" aria-label="Remove Filter">&times;</button>
</span>
```

### Semantic Element

- **Preferred**: `<span>` for static labels.
- **For status with meaning**: `<span>` with a descriptive `title` or visually-hidden text.
- **For removable tags**: Keep the badge wrapper as a `<span>` and place a real `<button type="button">` inside it.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| — | — | — | No required attributes for the base badge. |
| `type` | Yes (remove button) | `"button"` | Prevents form submission when the badge is rendered inside a form. |
| `aria-label` | Yes (remove button) | Action text | Gives the icon-only remove control an accessible name. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `title` | To expose the full label on hover when text is truncated. |
| visually hidden text | When the badge conveys important status (e.g., "Unread messages: 3"). |
| `aria-label` | On `.nb-badge-remove` buttons to identify the removed item. |

### Keyboard Behavior

Static badges do not receive keyboard focus. Removable badges expose the nested `.nb-badge-remove` button in the tab order.

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ❌ Not applicable | — | Badges are non-interactive. |
| **focus** | ❌ Not applicable | — | Badges are non-interactive. |
| **disabled** | ❌ Not applicable | — | Badges are non-interactive. |
| **color variants** | ✅ | `.nb-badge-primary`, `.nb-badge-secondary`, etc. | Changes background and text color. |
| **outline** | ✅ | `.nb-badge-outline` | Transparent background with border. |
| **remove hover** | ✅ | `.nb-badge-remove:hover` | Adds a subtle current-color fill to the remove button. |
| **remove focus** | ✅ | `.nb-badge-remove:focus-visible` | Shows the shared focus outline. |

---

## CSS Implementation Notes

### Layout

Badges are `inline-flex` pills with a large border radius (`9999px`), uppercase text, and a small letter spacing. They use CSS custom properties `--_bg` and `--_fg` internally, although most variants set `background` and `color` directly.

```css
.nb-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--nb-space-1);
  padding: var(--nb-space-1) var(--nb-space-2);
  border: var(--nb-border-width) solid var(--nb-border);
  border-radius: 9999px;
  background: var(--nb-base-200);
  color: var(--nb-base-content);
  font-size: var(--nb-text-xs);
  font-weight: 700;
  line-height: var(--nb-leading-none);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}
```

Remove buttons inherit the badge color, use a 1rem circular hit target, and keep a visible focus outline.

### Reduced Motion

No transitions or animations are used; `prefers-reduced-motion` is not applicable.

### Forced Colors

```css
@media (forced-colors: active) {
  .nb-badge {
    border: 2px solid CanvasText;
    forced-color-adjust: none;
  }
}
```

### RTL

Uses logical properties; no special RTL overrides needed.

---

## Examples

### Basic Badges

```html
<span class="nb-badge">Default</span>
<span class="nb-badge nb-badge-primary">Primary</span>
<span class="nb-badge nb-badge-secondary">Secondary</span>
<span class="nb-badge nb-badge-accent">Accent</span>
```

### Semantic Color Badges

```html
<span class="nb-badge nb-badge-info">Info</span>
<span class="nb-badge nb-badge-success">Success</span>
<span class="nb-badge nb-badge-warning">Warning</span>
<span class="nb-badge nb-badge-error">Error</span>
```

### Outline Badges

```html
<span class="nb-badge nb-badge-outline">Outline</span>
<span class="nb-badge nb-badge-primary nb-badge-outline">Primary Outline</span>
<span class="nb-badge nb-badge-error nb-badge-outline">Error Outline</span>
```

### Removable Tag

```html
<span class="nb-badge nb-badge-secondary">
  Filter
  <button class="nb-badge-remove" type="button" aria-label="Remove Filter">&times;</button>
</span>
```

---

## Known Issues

- None.
