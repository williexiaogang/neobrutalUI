### feature-grid
Base grid container. Required.

[Feature Grid docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/feature-grid.md)

#### Class names
- component: `nb-feature-grid`
- part: `nb-feature-grid-icon`, `nb-feature-grid-title`, `nb-feature-grid-description`
- modifier: `nb-feature-grid-cols-2`, `nb-feature-grid-cols-3`, `nb-feature-grid-cols-4`, `nb-feature-grid-gap-sm`, `nb-feature-grid-gap-lg`
- color: `nb-feature-grid-primary`, `nb-feature-grid-secondary`, `nb-feature-grid-accent`, `nb-feature-grid-neutral`
- size: `nb-feature-grid-sm`, `nb-feature-grid-lg`

#### Syntax

```html
<div class="nb-feature-grid nb-feature-grid-cols-3 nb-feature-grid-primary">
  <div class="nb-feature-grid-item">
    <div class="nb-feature-grid-icon" aria-hidden="true">⚡</div>
    <div class="nb-feature-grid-title">Lightning Fast</div>
    <div class="nb-feature-grid-description">Optimized for speed.</div>
  </div>
</div>
```

#### Rules
- Always include the base class `nb-feature-grid`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
