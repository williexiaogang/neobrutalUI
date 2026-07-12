### collapse
Root container for a single collapsible section. Required.

[Collapse docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/collapse.md)

#### Class names
- component: `nb-collapse`
- part: `nb-collapse-icon`, `nb-collapse-panel`, `nb-collapse-panel-inner`, `nb-collapse-content`
- size: `nb-collapse-sm`, `nb-collapse-lg`
- behavior: `is-open`, `nb-collapse-trigger-disabled`

#### Syntax

```html
<!-- Default collapse (open) -->
<div class="nb-collapse is-open">
  <button class="nb-collapse-trigger" type="button" aria-expanded="true" aria-controls="collapse-panel" id="collapse-trigger">
    Shipping Details
    <span class="nb-collapse-icon" aria-hidden="true">▼</span>
  </button>
  <div class="nb-collapse-panel is-open" id="collapse-panel" role="region" aria-labelledby="collapse-trigger">
    <div class="nb-collapse-panel-inner">
      <div class="nb-collapse-content">
        <p>Free shipping on orders over $50.</p>
      </div>
    </div>
  </div>
</div>

<!-- Small size -->
<div class="nb-collapse nb-collapse-sm">...</div>

<!-- Disabled -->
<div class="nb-collapse">
  <button class="nb-collapse-trigger nb-collapse-trigger-disabled" type="button" disabled>...</button>
</div>
```

#### Rules
- Always include the base class `nb-collapse`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
