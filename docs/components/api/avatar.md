# Avatar API

> **Component**: Avatar  
> **Category**: Data Display  
> **Base class**: `.nb-avatar`  
> **Status**: Beta (image, initials, status dots, grouped avatars, sizes, reduced-motion, and forced-colors support are implemented)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-avatar` | Component | Base avatar class. Required. |
| `.nb-avatar-image` | Part | Image element inside an avatar. |
| `.nb-avatar-initials` | Part | Initials / fallback text element. |
| `.nb-avatar-status` | Part | Status dot indicator. |
| `.nb-avatar-status-online` | State / Color | Green status dot (`--nb-success`). |
| `.nb-avatar-status-busy` | State / Color | Red status dot (`--nb-error`). |
| `.nb-avatar-status-away` | State / Color | Yellow status dot (`--nb-warning`). |
| `.nb-avatar-status-offline` | State / Color | Gray status dot (`--nb-neutral`). |
| `.nb-avatar-sm` | Size | Small avatar and status dot. |
| `.nb-avatar-lg` | Size | Large avatar and status dot. |
| `.nb-avatar-xl` | Size | Extra-large avatar and status dot. |
| `.nb-avatar-group` | Layout | Overlapping avatar group wrapper. |

### Class Combination Examples

```html
<!-- Initials avatar -->
<div class="nb-avatar">
  <span class="nb-avatar-initials">AB</span>
</div>

<!-- Image avatar with online status -->
<div class="nb-avatar nb-avatar-lg">
  <img class="nb-avatar-image" src="avatar.jpg" alt="Alice Chen" />
  <span class="nb-avatar-status nb-avatar-status-online" aria-label="Online"></span>
</div>

<!-- Grouped avatars -->
<div class="nb-avatar-group">
  <div class="nb-avatar"><span class="nb-avatar-initials">AA</span></div>
  <div class="nb-avatar"><span class="nb-avatar-initials">BB</span></div>
  <div class="nb-avatar"><span class="nb-avatar-initials">CC</span></div>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-avatar" aria-label="Alice Chen">
  <img class="nb-avatar-image" src="avatar.jpg" alt="Alice Chen" />
  <span class="nb-avatar-status nb-avatar-status-online" aria-label="Online"></span>
</div>
```

### Fallback Initials Structure

```html
<div class="nb-avatar" aria-label="Alice Chen" role="img">
  <span class="nb-avatar-initials">AC</span>
</div>
```

### Semantic Element

- **Preferred**: `<div>` with `aria-label` or `role="img"`.
- Use `<img class="nb-avatar-image">` for photos and `<span class="nb-avatar-initials">` for text fallbacks.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `alt` | Recommended | Text | Required on `.nb-avatar-image` for meaningful accessible names. |
| `aria-label` | Recommended | Text | Use when an avatar has no visible text or image alt. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `role="img"` | On the `.nb-avatar` container when it represents a user/entity image. |
| `aria-label` | Provides an accessible name for the avatar. |
| `aria-hidden="true"` | On decorative avatars that are redundant with adjacent text. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| — | Avatars are not interactive by default. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **status online** | ✅ | `.nb-avatar-status-online` | Green dot. |
| **status busy** | ✅ | `.nb-avatar-status-busy` | Red dot. |
| **status away** | ✅ | `.nb-avatar-status-away` | Yellow dot. |
| **status offline** | ✅ | `.nb-avatar-status-offline` | Gray dot. |
| **hover** | ❌ Not styled | — | No hover styles. |
| **focus-visible** | ✅ | `:focus-visible` (global) | Default outline if the avatar is made focusable. |
| **disabled** | ❌ Not applicable | — | Avatars are not interactive. |
| **active** | ❌ Not applicable | — | No active state. |
| **current** | ❌ Not applicable | — | No current state. |
| **selected** | ❌ Not applicable | — | No selected state. |
| **read-only** | ❌ Not applicable | — | Avatars are inherently read-only. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

`.nb-avatar` is a square inline-flex container with a hard border, small radius, and shadow. The status dot is absolutely positioned using logical inset (`inset-block-end`, `inset-inline-end`). Grouped avatars overlap via negative `margin-inline-start` and a light border.

### Reduced Motion

No transitions or animations; reduced-motion is not applicable.

### RTL

Uses logical properties (`margin-inline-start`, `inset-inline-end`, etc.); no special RTL overrides needed.

---

## Examples

### Sizes

```html
<div class="nb-avatar nb-avatar-sm"><span class="nb-avatar-initials">AB</span></div>
<div class="nb-avatar"><span class="nb-avatar-initials">CD</span></div>
<div class="nb-avatar nb-avatar-lg"><span class="nb-avatar-initials">EF</span></div>
<div class="nb-avatar nb-avatar-xl"><span class="nb-avatar-initials">GH</span></div>
```

### Status Dots

```html
<div class="nb-avatar">
  <span class="nb-avatar-initials">JL</span>
  <span class="nb-avatar-status nb-avatar-status-online"></span>
</div>
<div class="nb-avatar">
  <span class="nb-avatar-initials">MS</span>
  <span class="nb-avatar-status nb-avatar-status-busy"></span>
</div>
```

### Avatar Group

```html
<div class="nb-avatar-group">
  <div class="nb-avatar"><span class="nb-avatar-initials">AA</span></div>
  <div class="nb-avatar"><span class="nb-avatar-initials">BB</span></div>
  <div class="nb-avatar"><span class="nb-avatar-initials">CC</span></div>
</div>
```
