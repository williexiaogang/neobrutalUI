# Diff Viewer API

> **Component**: Diff Viewer  
> **Category**: Data Display  
> **Base class**: `.nb-diff`  
> **Status**: Ready (file header, hunk markers, added/removed/unchanged line styling, gutters, sizes, plain/full variants, forced-colors support, and reduced-motion/disabled N/A guidance included)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-diff` | Component | Base diff viewer class. Required. |
| `.nb-diff-header` | Part | File header bar with old/new names and stats. |
| `.nb-diff-file-old` | Part / State | Strikethrough old filename. |
| `.nb-diff-file-new` | Part / State | New filename. |
| `.nb-diff-stats` | Part | Stats container. |
| `.nb-diff-stat-added` | Part / State | Added-line count (success color). |
| `.nb-diff-stat-removed` | Part / State | Removed-line count (error color). |
| `.nb-diff-body` | Part | Scrollable diff body. |
| `.nb-diff-hunk` | Part | Hunk marker / range header. |
| `.nb-diff-line` | Part | Single diff line. |
| `.nb-diff-gutter` | Part | Line-number gutter container. |
| `.nb-diff-gutter-number` | Part | Line number in the gutter. |
| `.nb-diff-content` | Part | Line text content. |
| `.nb-diff-added` | State / Color | Added line styling. |
| `.nb-diff-removed` | State / Color | Removed line styling. |
| `.nb-diff-unchanged` | State / Color | Unchanged line styling. |
| `.nb-diff-sign` | Part | Leading `+`, `-`, or space prefix. |
| `.nb-diff-sm` | Size | Smaller header/hunk/content padding and font. |
| `.nb-diff-lg` | Size | Larger header/hunk/content padding and font. |
| `.nb-diff-full` | Variant | Removes `max-block-size` on the body. |
| `.nb-diff-plain` | Variant | Hides the file header. |

### Class Combination Examples

```html
<div class="nb-diff">
  <div class="nb-diff-header">
    <span class="nb-diff-file-old">old.ts</span>
    <span>→</span>
    <span class="nb-diff-file-new">new.ts</span>
    <div class="nb-diff-stats">
      <span class="nb-diff-stat-added">+12</span>
      <span class="nb-diff-stat-removed">-4</span>
    </div>
  </div>
  <div class="nb-diff-body">
    <div class="nb-diff-hunk">@@ -1,5 +1,8 @@</div>
    <div class="nb-diff-line nb-diff-added">
      <span class="nb-diff-gutter"><span class="nb-diff-gutter-number">1</span></span>
      <span class="nb-diff-sign">+</span>
      <span class="nb-diff-content">export const foo = 1;</span>
    </div>
  </div>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-diff">
  <div class="nb-diff-header">
    <span class="nb-diff-file-old">src/utils/helpers.ts</span>
    <span>→</span>
    <span class="nb-diff-file-new">src/utils/helpers.ts</span>
    <div class="nb-diff-stats">
      <span class="nb-diff-stat-added">+12</span>
      <span class="nb-diff-stat-removed">-4</span>
    </div>
  </div>
  <div class="nb-diff-body">
    <div class="nb-diff-hunk">@@ -14,7 +14,10 @@</div>
    <div class="nb-diff-line nb-diff-removed">
      <span class="nb-diff-gutter"><span class="nb-diff-gutter-number">14</span></span>
      <span class="nb-diff-sign">-</span>
      <span class="nb-diff-content">old line</span>
    </div>
    <div class="nb-diff-line nb-diff-added">
      <span class="nb-diff-gutter"><span class="nb-diff-gutter-number">14</span></span>
      <span class="nb-diff-sign">+</span>
      <span class="nb-diff-content">new line</span>
    </div>
  </div>
</div>
```

### Semantic Element

- **Preferred**: `<div>` with explicit ARIA labels.
- Consider wrapping the diff body in `<table>` or using `role="table"`/`role="row"` if you need screen-reader row/column semantics for line numbers.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| — | — | — | No component-specific required attributes. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-label` | On `.nb-diff` to describe the file being compared. |
| `aria-hidden="true"` | On visual `+`/`-` signs if redundant with line type. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| Standard document navigation | The diff body is scrollable; no custom keyboard handling. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **added** | ✅ | `.nb-diff-added` | Green-tinted background and gutter. |
| **removed** | ✅ | `.nb-diff-removed` | Red-tinted background and gutter. |
| **unchanged** | ✅ | `.nb-diff-unchanged` | Default background. |
| **hover** | ❌ Not styled | — | No hover styles. |
| **focus-visible** | ✅ | `:focus-visible` (global) | Default outline if a line is focusable. |
| **disabled** | ❌ Not applicable | — | Diff viewers are not interactive. |
| **active** | ❌ Not applicable | — | No active state. |
| **current** | ❌ Not applicable | — | No current-line styles. |
| **selected** | ❌ Not applicable | — | No selected-line styles. |
| **read-only** | ❌ Not applicable | — | Diff viewers are inherently read-only. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

`.nb-diff` is a flex column with a hard border, radius, and shadow. The body scrolls and contains hunks and lines. Each line is a flex row with a gutter and content. Added/removed states recolor background, text, and gutter borders. In forced-colors mode, added and removed lines map to `Mark` and `Highlight` system colors.

### Reduced Motion

No transitions or animations; reduced-motion is not applicable.

### RTL

Uses logical properties (`border-inline-end`, `margin-inline-end`, etc.); no special RTL overrides needed.

---

## Examples

### File Change Diff

```html
<div class="nb-diff">
  <div class="nb-diff-header">
    <span class="nb-diff-file-old">src/utils/helpers.ts</span>
    <span>→</span>
    <span class="nb-diff-file-new">src/utils/helpers.ts</span>
    <div class="nb-diff-stats">
      <span class="nb-diff-stat-added">+12</span>
      <span class="nb-diff-stat-removed">-4</span>
    </div>
  </div>
  <div class="nb-diff-body">
    <div class="nb-diff-hunk">@@ -14,7 +14,10 @@</div>
    <div class="nb-diff-line nb-diff-removed">
      <span class="nb-diff-gutter"><span class="nb-diff-gutter-number">14</span></span>
      <span class="nb-diff-sign">-</span>
      <span class="nb-diff-content">old line</span>
    </div>
    <div class="nb-diff-line nb-diff-added">
      <span class="nb-diff-gutter"><span class="nb-diff-gutter-number">14</span></span>
      <span class="nb-diff-sign">+</span>
      <span class="nb-diff-content">new line</span>
    </div>
  </div>
</div>
```

### Compact Diff Without Header

```html
<div class="nb-diff nb-diff-sm nb-diff-plain">
  <div class="nb-diff-body">
    <div class="nb-diff-hunk">@@ -1,3 +1,3 @@</div>
    <div class="nb-diff-line nb-diff-added">
      <span class="nb-diff-gutter"><span class="nb-diff-gutter-number">1</span></span>
      <span class="nb-diff-sign">+</span>
      <span class="nb-diff-content"># Neo-Brutal UI</span>
    </div>
  </div>
</div>
```

### Large Diff

```html
<div class="nb-diff nb-diff-lg nb-diff-full">
  <div class="nb-diff-header">...</div>
  <div class="nb-diff-body">...</div>
</div>
```
