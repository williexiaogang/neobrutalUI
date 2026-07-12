### select
Base native select dropdown. Required.

[Select docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/select.md)

#### Class names
- component: `nb-select`
- size: `nb-select-sm`, `nb-select-lg`

#### Syntax

```html
<!-- Basic select -->
<select class="nb-select">
  <option value="">Choose an option</option>
  <option value="a">Option A</option>
</select>

<!-- Small select -->
<select class="nb-select nb-select-sm">
  <option>Small</option>
</select>

<!-- Inside a field wrapper -->
<div class="nb-field">
  <label class="nb-field-label" for="priority">Priority</label>
  <select class="nb-select" id="priority">
    <option>Low</option>
    <option selected>Medium</option>
    <option>High</option>
  </select>
</div>
```

#### Rules
- Always include the base class `nb-select`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
