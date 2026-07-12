### calendar
Root calendar container. Required.

[Calendar docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/calendar.md)

#### Class names
- component: `nb-calendar`
- part: `nb-calendar-header`, `nb-calendar-title`, `nb-calendar-nav`, `nb-calendar-nav-btn`, `nb-calendar-weekdays`, `nb-calendar-weekday`, `nb-calendar-grid`
- behavior: `nb-calendar-day-selected`, `nb-calendar-day-today`, `nb-calendar-day-range-start`, `nb-calendar-day-range-end`, `nb-calendar-day-range-mid`, `nb-calendar-day-outside`, `nb-calendar-day-disabled`
- size: `nb-calendar-sm`, `nb-calendar-lg`
- style: `nb-calendar-compact`
- color: `nb-calendar-primary`, `nb-calendar-secondary`, `nb-calendar-accent`, `nb-calendar-neutral`, `nb-calendar-info`, `nb-calendar-success`, `nb-calendar-warning`, `nb-calendar-error`

#### Syntax

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

#### Rules
- Always include the base class `nb-calendar`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
