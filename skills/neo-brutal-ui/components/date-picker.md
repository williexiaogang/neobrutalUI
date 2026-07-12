### date-picker
Root wrapper for the input and dropdown panel. Required.

[Date Picker docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/date-picker.md)

#### Class names
- component: `nb-date-picker`
- part: `nb-date-picker-input-icon`, `nb-date-picker-input-placeholder`, `nb-date-picker-footer`, `nb-date-picker-footer-actions`, `nb-date-picker-footer-btn`, `nb-date-picker-calendars`
- style: `nb-date-picker-footer-btn-primary`, `nb-date-picker-range`, `nb-date-picker-inline`
- size: `nb-date-picker-sm`, `nb-date-picker-lg`
- color: `nb-date-picker-primary`, `nb-date-picker-secondary`, `nb-date-picker-accent`, `nb-date-picker-neutral`, `nb-date-picker-info`, `nb-date-picker-success`, `nb-date-picker-warning`, `nb-date-picker-error`

#### Syntax

```html
<!-- Single date picker -->
<div class="nb-date-picker">
  <div class="nb-date-picker-input">
    <input type="text" placeholder="Select a date" readonly />
    <button class="nb-btn nb-btn-sm" type="button" aria-label="Open calendar">📅</button>
  </div>
  <div class="nb-date-picker-panel">
    <div class="nb-calendar nb-calendar-sm">...</div>
    <div class="nb-date-picker-footer">
      <button class="nb-date-picker-footer-btn" type="button">Today</button>
      <button class="nb-date-picker-footer-btn" type="button">Clear</button>
    </div>
  </div>
</div>

<!-- Inline always-visible picker -->
<div class="nb-date-picker nb-date-picker-inline nb-date-picker-primary">
  <div class="nb-calendar nb-calendar-compact">...</div>
</div>

<!-- Range date picker -->
<div class="nb-date-picker nb-date-picker-range">
  <div class="nb-date-picker-input">
    <input type="text" placeholder="Start date" readonly />
    <span>→</span>
    <input type="text" placeholder="End date" readonly />
    <button class="nb-btn nb-btn-sm" type="button" aria-label="Open calendar">📅</button>
  </div>
</div>
```

#### Rules
- Always include the base class `nb-date-picker`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
