# Form Summary API

> **Component**: Form Summary  
> **Category**: Forms  
> **Base class**: `.nb-form-summary`  
> **Status**: Ready (CSS visual layer, error and warning variants, message list, field links, compact variant, RTL logical border, and forced-colors support included)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-form-summary` | Component | Base validation summary panel. |
| `.nb-form-summary-title` | Part | Title row with icon and message count. |
| `.nb-form-summary-list` | Part | List of validation messages. |
| `.nb-form-summary-item` | Part | Individual validation message with a bullet. |
| `.nb-form-summary-link` | Part | Clickable field name within an item. |
| `.nb-form-summary-warning` | Variant | Warning accent variant (yellow border and text). |
| `.nb-form-summary-compact` | Size / Variant | Smaller padding and gap. |

### Class Combination Examples

```html
<!-- Default error summary -->
<div class="nb-form-summary" role="alert" aria-labelledby="fs-title">
  <h3 class="nb-form-summary-title" id="fs-title">
    <span aria-hidden="true">⚠️</span> There are 2 errors in your form
  </h3>
  <ul class="nb-form-summary-list">
    <li class="nb-form-summary-item">
      <button class="nb-form-summary-link" type="button">Username</button> is required.
    </li>
  </ul>
</div>

<!-- Warning + compact -->
<div class="nb-form-summary nb-form-summary-warning nb-form-summary-compact" role="alert" aria-labelledby="fs-warning">
  <h3 class="nb-form-summary-title" id="fs-warning">1 notice</h3>
  <ul class="nb-form-summary-list">
    <li class="nb-form-summary-item">Bio is close to the character limit.</li>
  </ul>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-form-summary" role="alert" aria-labelledby="fs-title">
  <h3 class="nb-form-summary-title" id="fs-title">
    <span aria-hidden="true">⚠️</span> There are 3 errors in your form
  </h3>
  <ul class="nb-form-summary-list">
    <li class="nb-form-summary-item">
      <button class="nb-form-summary-link" type="button">Username</button> must be at least 3 characters.
    </li>
    <li class="nb-form-summary-item">
      <button class="nb-form-summary-link" type="button">Email</button> is not a valid address.
    </li>
    <li class="nb-form-summary-item">
      <button class="nb-form-summary-link" type="button">Password</button> must contain a number.
    </li>
  </ul>
</div>
```

### Semantic Element

- **Preferred**: `<div class="nb-form-summary" role="alert">` containing a heading and an unordered list.
- Use `aria-labelledby` to reference the title heading.
- Use `<button class="nb-form-summary-link" type="button">` for clickable field names that move focus to the offending control.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `role="alert"` | Recommended | `"alert"` | Announces the summary to screen readers. |
| `aria-labelledby` | Recommended | Title `id` | Associates the alert with the summary title. |
| `id` | Recommended (on title) | Unique string | Target for `aria-labelledby`. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `role="alert"` | On `.nb-form-summary` to announce validation feedback. |
| `aria-labelledby` | Reference the title heading. |
| `aria-hidden="true"` | On decorative icons inside the title. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus through `.nb-form-summary-link` buttons (if present). |
| `Enter` / `Space` | Activates a `.nb-form-summary-link` to focus the associated field (requires JS). |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ (link only) | `.nb-form-summary-link:hover` | Underline removed. |
| **focus** | ✅ (link only) | `.nb-form-summary-link:focus-visible` | `outline: 2px solid var(--nb-focus); outline-offset: 2px;` |
| **focus-visible** | ✅ (link only) | `:focus-visible` | Same as focus outline. |
| **disabled** | ❌ Not applicable | — | Summary is not an interactive control. |
| **warning** | ✅ | `.nb-form-summary-warning` | Border and title text turn `--nb-warning`; bullet turns `--nb-warning`; links turn `--nb-warning`. |
| **compact** | ✅ | `.nb-form-summary-compact` | Reduced padding and gap. |
| **active / checked / invalid / readonly / loading** | ❌ Not applicable | — | Not applicable. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

The summary panel is a flex column with a thick left border:

```css
.nb-form-summary {
  display: flex;
  flex-direction: column;
  gap: var(--nb-space-3);
  padding: var(--nb-space-4);
  border: var(--nb-border-width) solid var(--nb-error);
  border-inline-start-width: 6px;
  border-radius: var(--nb-radius-box);
  background: var(--nb-base-100);
  box-shadow: var(--nb-shadow-sm);
}
```

Message items use a custom bullet via `::before`:

```css
.nb-form-summary-list {
  display: flex;
  flex-direction: column;
  gap: var(--nb-space-2);
  margin: 0;
  padding: 0;
  padding-inline-start: var(--nb-space-6);
  list-style: none;
}

.nb-form-summary-item::before {
  content: "";
  position: absolute;
  inset-inline-start: calc(-1 * var(--nb-space-4));
  inset-block-start: 0.5rem;
  inline-size: 0.375rem;
  block-size: 0.375rem;
  background: var(--nb-error);
  border: var(--nb-border-width) solid var(--nb-border);
}
```

### Reduced Motion

No transitions or animations; reduced-motion is not applicable.

### RTL

Uses logical properties; the left border uses `border-inline-start-width`, so it correctly appears on the right in RTL layouts.

---

## Examples

### Default Error Summary

```html
<div class="nb-form-summary" role="alert" aria-labelledby="fs-title-1">
  <h3 class="nb-form-summary-title" id="fs-title-1">
    <span aria-hidden="true">⚠️</span> There are 3 errors in your form
  </h3>
  <ul class="nb-form-summary-list">
    <li class="nb-form-summary-item">
      <button class="nb-form-summary-link" type="button">Username</button> must be at least 3 characters
    </li>
    <li class="nb-form-summary-item">
      <button class="nb-form-summary-link" type="button">Email</button> is not a valid address
    </li>
    <li class="nb-form-summary-item">
      <button class="nb-form-summary-link" type="button">Password</button> must contain a number
    </li>
  </ul>
</div>
```

### Warning Variant

```html
<div class="nb-form-summary nb-form-summary-warning" role="alert" aria-labelledby="fs-title-2">
  <h3 class="nb-form-summary-title" id="fs-title-2">
    <span aria-hidden="true">🔶</span> 2 fields need attention
  </h3>
  <ul class="nb-form-summary-list">
    <li class="nb-form-summary-item">
      <button class="nb-form-summary-link" type="button">Bio</button> is close to the character limit
    </li>
    <li class="nb-form-summary-item">
      <button class="nb-form-summary-link" type="button">Avatar</button> may be slow to load
    </li>
  </ul>
</div>
```

### Compact Variant

```html
<div class="nb-form-summary nb-form-summary-compact" role="alert" aria-labelledby="fs-title-3">
  <h3 class="nb-form-summary-title" id="fs-title-3">
    <span aria-hidden="true">⚠️</span> 1 error
  </h3>
  <ul class="nb-form-summary-list">
    <li class="nb-form-summary-item">
      <button class="nb-form-summary-link" type="button">Phone</button> is required
    </li>
  </ul>
</div>
```

### Compact + Warning Combined

```html
<div class="nb-form-summary nb-form-summary-warning nb-form-summary-compact" role="alert" aria-labelledby="fs-title-4">
  <h3 class="nb-form-summary-title" id="fs-title-4">
    <span aria-hidden="true">🔶</span> 1 notice
  </h3>
  <ul class="nb-form-summary-list">
    <li class="nb-form-summary-item">
      <button class="nb-form-summary-link" type="button">Website</button> URL is not secure
    </li>
  </ul>
</div>
```

### Without Links (Plain Text)

```html
<div class="nb-form-summary" role="alert" aria-labelledby="fs-title-5">
  <h3 class="nb-form-summary-title" id="fs-title-5">
    <span aria-hidden="true">❌</span> Server-side validation failed
  </h3>
  <ul class="nb-form-summary-list">
    <li class="nb-form-summary-item">Invoice total exceeds account limit</li>
    <li class="nb-form-summary-item">Selected SKU is out of stock</li>
    <li class="nb-form-summary-item">Coupon code has expired</li>
  </ul>
</div>
```
