### button
Base button class. Required.

[Button docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/button.md)

#### Class names
- component: `nb-btn`
- color: `nb-btn-primary`, `nb-btn-secondary`, `nb-btn-accent`, `nb-btn-neutral`
- style: `nb-btn-outline`, `nb-btn-ghost`
- size: `nb-btn-sm`, `nb-btn-lg`
- modifier: `nb-btn-block`, `nb-btn-icon`
- behavior: `nb-btn-loading`

#### Syntax

```html
<!-- Base button -->
<button class="nb-btn">Default</button>

<!-- Color + size -->
<button class="nb-btn nb-btn-primary nb-btn-lg">Large Primary</button>

<!-- Variant + size -->
<button class="nb-btn nb-btn-outline nb-btn-sm">Small Outline</button>

<!-- Ghost + block -->
<button class="nb-btn nb-btn-ghost nb-btn-block">Full-width Ghost</button>

<!-- Icon-only -->
<button class="nb-btn nb-btn-icon" type="button" aria-label="Close">
  <span aria-hidden="true">×</span>
</button>

<!-- Loading -->
<button class="nb-btn nb-btn-primary nb-btn-loading" type="button" aria-busy="true">
  Saving
</button>
```

#### Rules
- Always include the base class `nb-btn`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
