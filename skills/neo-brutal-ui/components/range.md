### range
Base range/slider input. Required.

[Range docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/range.md)

#### Class names
- component: `nb-range`
- modifier: `nb-range-vertical`
- color: `nb-range-primary`, `nb-range-secondary`, `nb-range-accent`, `nb-range-info`, `nb-range-success`, `nb-range-warning`, `nb-range-error`
- part: `nb-range-ticks`

#### Syntax

```html
<!-- Basic range -->
<input type="range" class="nb-range" min="0" max="100" value="50" />

<!-- Color variant -->
<input type="range" class="nb-range nb-range-primary" min="0" max="100" value="40" />

<!-- Vertical range -->
<input type="range" class="nb-range nb-range-vertical nb-range-primary" min="0" max="100" value="75" />

<!-- With ticks -->
<div class="nb-range-group">
  <label for="range-ticks">Stepped</label>
  <input type="range" id="range-ticks" class="nb-range nb-range-primary" min="0" max="100" step="10" />
  <div class="nb-range-ticks">
    <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
  </div>
</div>
```

#### Rules
- Always include the base class `nb-range`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
