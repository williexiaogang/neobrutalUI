### button-group
Joined button group container. Required.

[Button Group docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/button-group.md)

#### Class names
- component: `nb-btn-group`
- modifier: `nb-btn-group-vertical`, `nb-btn-group-block`

#### Syntax

```html
<!-- Horizontal group -->
<div class="nb-btn-group">
  <button class="nb-btn" type="button">Left</button>
  <button class="nb-btn" type="button">Center</button>
  <button class="nb-btn" type="button">Right</button>
</div>

<!-- Vertical group -->
<div class="nb-btn-group nb-btn-group-vertical">
  <button class="nb-btn nb-btn-primary" type="button">Top</button>
  <button class="nb-btn nb-btn-primary" type="button">Middle</button>
  <button class="nb-btn nb-btn-primary" type="button">Bottom</button>
</div>

<!-- Full-width block group -->
<div class="nb-btn-group nb-btn-group-block">
  <button class="nb-btn nb-btn-primary" type="button">Confirm</button>
  <button class="nb-btn" type="button">Cancel</button>
</div>
```

#### Rules
- Always include the base class `nb-btn-group`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
