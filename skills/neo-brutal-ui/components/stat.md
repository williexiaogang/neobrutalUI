### stat
Base stat card class. Required.

[Stat docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/stat.md)

#### Class names
- component: `nb-stat`
- part: `nb-stat-title`, `nb-stat-value`, `nb-stat-desc`
- style: `nb-stat-trend-up`, `nb-stat-trend-down`, `nb-stat-compact`, `nb-stat-ghost`
- layout / variant: `nb-stat-horizontal`
- color: `nb-stat-primary`, `nb-stat-secondary`, `nb-stat-accent`, `nb-stat-success`, `nb-stat-info`, `nb-stat-warning`, `nb-stat-error`
- size: `nb-stat-sm`, `nb-stat-lg`

#### Syntax

```html
<!-- Vertical stat with trend -->
<div class="nb-stat nb-stat-trend-up">
  <p class="nb-stat-title">Revenue</p>
  <p class="nb-stat-value">$48,200</p>
  <p class="nb-stat-desc">+8.5% vs last quarter</p>
</div>

<!-- Horizontal + color + large -->
<div class="nb-stat nb-stat-horizontal nb-stat-primary nb-stat-lg nb-stat-trend-up">
  <p class="nb-stat-title">Active Users</p>
  <p class="nb-stat-value">7,821</p>
  <p class="nb-stat-desc">+18% growth</p>
</div>
```

#### Rules
- Always include the base class `nb-stat`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
