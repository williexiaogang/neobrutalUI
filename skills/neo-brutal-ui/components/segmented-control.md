### segmented-control
Base segmented control container. Required.

[Segmented Control docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/segmented-control.md)

#### Class names
- component: `nb-segmented`
- component / part: `nb-segmented-item`
- modifier: `nb-segmented-block`, `nb-segmented-vertical`
- size: `nb-segmented-sm`, `nb-segmented-lg`
- color: `nb-segmented-primary`, `nb-segmented-secondary`, `nb-segmented-accent`

#### Syntax

```html
<!-- Default horizontal -->
<div class="nb-segmented" role="radiogroup" aria-label="View type">
  <label class="nb-segmented-item">
    <input type="radio" name="view" value="list" />
    List
  </label>
  <label class="nb-segmented-item">
    <input type="radio" name="view" value="grid" checked />
    Grid
  </label>
</div>

<!-- Block + large + primary -->
<div class="nb-segmented nb-segmented-block nb-segmented-lg nb-segmented-primary" role="radiogroup" aria-label="Billing">
  <label class="nb-segmented-item">
    <input type="radio" name="billing" value="monthly" />
    Monthly
  </label>
  <label class="nb-segmented-item">
    <input type="radio" name="billing" value="yearly" checked />
    Yearly
  </label>
</div>
```

#### Rules
- Always include the base class `nb-segmented`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
