# Calendar API

> **Component**: Calendar  
> **Category**: Data Display  
> **Base class**: `.nb-calendar`  
> **Status**: In Progress (CSS visual layer implemented; JS for month navigation and date selection is optional)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-calendar` | Component | Root calendar container. Required. |
| `.nb-calendar-header` | Part | Top bar with title and navigation buttons. |
| `.nb-calendar-title` | Part | Month/year heading text. |
| `.nb-calendar-nav` | Part | Container for previous/next navigation buttons. |
| `.nb-calendar-nav-btn` | Part | Previous/next month button. |
| `.nb-calendar-weekdays` | Part | Grid header row for weekday abbreviations. |
| `.nb-calendar-weekday` | Part | Individual weekday cell. |
| `.nb-calendar-grid` | Part | 7-column grid of day cells. |
| `.nb-calendar-day` | Component | Individual selectable day cell. |
| `.nb-calendar-day-selected` | State | Selected single date. |
| `.nb-calendar-day-today` | State | Current date indicator. |
| `.nb-calendar-day-range-start` | State | First day of a selected range. |
| `.nb-calendar-day-range-end` | State | Last day of a selected range. |
| `.nb-calendar-day-range-mid` | State | Day inside a selected range (between start and end). |
| `.nb-calendar-day-outside` | State | Day from the previous or next month. |
| `.nb-calendar-day-disabled` | State | Non-selectable day. |
| `.nb-calendar-sm` | Size | Compact day cells and padding. |
| `.nb-calendar-lg` | Size | Larger day cells and padding. |
| `.nb-calendar-compact` | Variant | Removes padding and uses a smaller shadow. |
| `.nb-calendar-primary` | Color | Primary accent color. |
| `.nb-calendar-secondary` | Color | Secondary accent color. |
| `.nb-calendar-accent` | Color | Accent color. |
| `.nb-calendar-neutral` | Color | Neutral accent color. |
| `.nb-calendar-info` | Color | Info accent color. |
| `.nb-calendar-success` | Color | Success accent color. |
| `.nb-calendar-warning` | Color | Warning accent color. |
| `.nb-calendar-error` | Color | Error accent color. |

### Class Combination Examples

```html
<!-- Standard calendar -->
<div class="nb-calendar">
  <div class="nb-calendar-header">
    <button class="nb-calendar-nav-btn" type="button" aria-label="Previous month">‹</button>
    <span class="nb-calendar-title">June 2025</span>
    <button class="nb-calendar-nav-btn" type="button" aria-label="Next month">›</button>
  </div>
  <div class="nb-calendar-weekdays">...</div>
  <div class="nb-calendar-grid">...</div>
</div>

<!-- Compact accent calendar -->
<div class="nb-calendar nb-calendar-compact nb-calendar-accent">...</div>

<!-- Large primary calendar with selected today -->
<div class="nb-calendar nb-calendar-lg nb-calendar-primary">
  <div class="nb-calendar-grid">
    <div class="nb-calendar-day nb-calendar-day-today nb-calendar-day-selected">6</div>
  </div>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-calendar" role="application" aria-label="Calendar">
  <div class="nb-calendar-header">
    <button class="nb-calendar-nav-btn" type="button" aria-label="Previous month">‹</button>
    <span class="nb-calendar-title" aria-live="polite" aria-atomic="true">June 2025</span>
    <button class="nb-calendar-nav-btn" type="button" aria-label="Next month">›</button>
  </div>
  <div class="nb-calendar-weekdays" aria-hidden="true">
    <div class="nb-calendar-weekday">Su</div>
    <div class="nb-calendar-weekday">Mo</div>
    ...
  </div>
  <div class="nb-calendar-grid" role="grid">
    <div class="nb-calendar-day" role="gridcell" tabindex="0">1</div>
    <div class="nb-calendar-day nb-calendar-day-today" role="gridcell" tabindex="-1">6</div>
    <div class="nb-calendar-day nb-calendar-day-selected" role="gridcell" aria-selected="true" tabindex="-1">11</div>
    <div class="nb-calendar-day nb-calendar-day-disabled" role="gridcell" aria-disabled="true" tabindex="-1">13</div>
    ...
  </div>
</div>
```

### Semantic Element

- **Preferred**: Use `role="application"` or `role="group"` on the root, `role="grid"` on the day grid, and `role="gridcell"` on each day. Navigation buttons should be native `<button>` elements.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `type` | Yes (nav buttons) | `"button"` | Prevents form submission. |
| `role` | Recommended | `"gridcell"` | For day cells in a grid pattern. |
| `aria-label` / `aria-labelledby` | Recommended | Descriptive text | For navigation buttons and the calendar root. |
| `aria-selected` | When selected | `"true"` | On selected day cells. |
| `aria-disabled` | When disabled | `"true"` | On disabled day cells. |
| `tabindex` | Recommended | `"0"` on focused day, `"-1"` otherwise | For roving tabindex keyboard navigation (JS optional). |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-label` | On the calendar root to describe its purpose. |
| `aria-live="polite"` | On the title element so month changes are announced. |
| `aria-selected` | On selected day cells. |
| `aria-disabled` | On disabled day cells. |
| `aria-current="date"` | On today's cell. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus into/out of the calendar grid. |
| `ArrowLeft` / `ArrowRight` | Moves focus between days (JS optional). |
| `ArrowUp` / `ArrowDown` | Moves focus by one week (JS optional). |
| `Enter` / `Space` | Selects the focused day (JS optional). |
| `PageUp` / `PageDown` | Navigates to previous/next month (JS optional). |
| `Home` / `End` | Moves to start/end of the current week (JS optional). |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ | `.nb-calendar-day:hover:not(:disabled, .nb-calendar-day-selected, .nb-calendar-day-disabled)` | Shadow elevates slightly; day translates up 1px. |
| **active** | ✅ | `.nb-calendar-day:active:not(:disabled, .nb-calendar-day-selected, .nb-calendar-day-disabled)` | Shadow removed; day translates down 1px. |
| **focus-visible** | ✅ | `.nb-calendar-day:focus-visible` | `outline: 2px solid var(--nb-focus); outline-offset: 2px;` |
| **disabled** | ✅ | `.nb-calendar-day-disabled` | `opacity: 0.4`, `cursor: not-allowed`, no shadow, line-through text. |
| **selected** | ✅ | `.nb-calendar-day-selected` | Background and text use accent colors; small shadow. |
| **today** | ✅ | `.nb-calendar-day-today:not(.nb-calendar-day-selected)` | Border color changes to accent and border width increases. |
| **range-start** | ✅ | `.nb-calendar-day-range-start` | Accent background with start-side border radius. |
| **range-end** | ✅ | `.nb-calendar-day-range-end` | Accent background with end-side border radius. |
| **range-mid** | ✅ | `.nb-calendar-day-range-mid` | Tinted accent background with squared corners. |
| **outside-month** | ✅ | `.nb-calendar-day-outside` | Muted text color with reduced opacity. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

The calendar is a flex column with a hard border, rounded corners, and a shadow. Days are arranged in a 7-column grid with consistent `--_day-size`. Navigation buttons and day cells both have tactile press feedback via shadow and transform transitions.

```css
.nb-calendar-day {
  display: flex;
  align-items: center;
  justify-content: center;
  inline-size: var(--_day-size);
  block-size: var(--_day-size);
  border: var(--nb-border-width) solid var(--nb-border);
  border-radius: var(--nb-radius-field);
  background: var(--nb-base-100);
  box-shadow: var(--nb-shadow-xs);
  transform: translate(0, 0);
  transition: transform var(--nb-duration-fast) var(--nb-ease-out),
    box-shadow var(--nb-duration-fast) var(--nb-ease-out),
    background var(--nb-duration-fast) var(--nb-ease-out),
    color var(--nb-duration-fast) var(--nb-ease-out);
}
```

Range states use `border-start-*-radius` and `border-end-*-radius` physical properties to shape the selection endpoints. The mid-range uses `color-mix` to tint the accent with the page background.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-calendar-day,
  .nb-calendar-nav-btn {
    transition: none;
  }
}
```

### RTL

The calendar uses logical properties for layout and text alignment. Range endpoints use physical `border-start-*` / `border-end-*` radius properties, which automatically adapt to the writing direction; no special RTL overrides needed.

---

## Examples

### Basic Calendar

```html
<div class="nb-calendar">
  <div class="nb-calendar-header">
    <button class="nb-calendar-nav-btn" type="button" aria-label="Previous month">‹</button>
    <span class="nb-calendar-title">June 2025</span>
    <button class="nb-calendar-nav-btn" type="button" aria-label="Next month">›</button>
  </div>
  <div class="nb-calendar-weekdays" aria-hidden="true">
    <div class="nb-calendar-weekday">Su</div>
    <div class="nb-calendar-weekday">Mo</div>
    <div class="nb-calendar-weekday">Tu</div>
    <div class="nb-calendar-weekday">We</div>
    <div class="nb-calendar-weekday">Th</div>
    <div class="nb-calendar-weekday">Fr</div>
    <div class="nb-calendar-weekday">Sa</div>
  </div>
  <div class="nb-calendar-grid">
    <div class="nb-calendar-day">1</div>
    <div class="nb-calendar-day">2</div>
    <div class="nb-calendar-day nb-calendar-day-today">6</div>
    <div class="nb-calendar-day nb-calendar-day-selected">11</div>
    <div class="nb-calendar-day nb-calendar-day-disabled">13</div>
  </div>
</div>
```

### Range Selection

```html
<div class="nb-calendar nb-calendar-primary">
  <div class="nb-calendar-grid">
    <div class="nb-calendar-day nb-calendar-day-range-start">16</div>
    <div class="nb-calendar-day nb-calendar-day-range-mid">17</div>
    <div class="nb-calendar-day nb-calendar-day-range-mid">18</div>
    <div class="nb-calendar-day nb-calendar-day-range-end">19</div>
  </div>
</div>
```

### Size Variants

```html
<div class="nb-calendar nb-calendar-sm">...</div>
<div class="nb-calendar nb-calendar-lg">...</div>
```

### Color Variants

```html
<div class="nb-calendar nb-calendar-primary">...</div>
<div class="nb-calendar nb-calendar-accent">...</div>
<div class="nb-calendar nb-calendar-success">...</div>
<div class="nb-calendar nb-calendar-error">...</div>
```

### Compact Calendar

```html
<div class="nb-calendar nb-calendar-compact nb-calendar-accent">
  <div class="nb-calendar-header">...</div>
  <div class="nb-calendar-grid">...</div>
</div>
```
