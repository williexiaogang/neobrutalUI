### radio
Base radio input. Required.

[Radio docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/radio.md)

#### Class names
- component: `nb-radio`

#### Syntax

```html
<!-- Basic radio group -->
<label class="nb-cluster">
  <input class="nb-radio" type="radio" name="option" checked />
  <span>Option A</span>
</label>
<label class="nb-cluster">
  <input class="nb-radio" type="radio" name="option" />
  <span>Option B</span>
</label>
```

#### Rules
- Always include the base class `nb-radio`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
