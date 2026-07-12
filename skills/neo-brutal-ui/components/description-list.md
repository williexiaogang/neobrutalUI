### description-list
Base description list class. Required on `<dl>`.

[Description List docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/description-list.md)

#### Class names
- component: `nb-description-list`
- component / part: `nb-description-list-term`, `nb-description-list-description`
- variant / layout: `nb-description-list-horizontal`
- style: `nb-description-list-bordered`, `nb-description-list-divided`, `nb-description-list-compact`
- size: `nb-description-list-sm`, `nb-description-list-lg`
- color: `nb-description-list-primary`, `nb-description-list-secondary`, `nb-description-list-accent`, `nb-description-list-info`, `nb-description-list-success`, `nb-description-list-warning`, `nb-description-list-error`, `nb-description-list-neutral`

#### Syntax

```html
<!-- Default description list -->
<dl class="nb-description-list">
  <dt class="nb-description-list-term">Plan</dt>
  <dd class="nb-description-list-description">Professional</dd>
</dl>

<!-- Horizontal + primary accent -->
<dl class="nb-description-list nb-description-list-horizontal nb-description-list-primary">
  <dt class="nb-description-list-term">Region</dt>
  <dd class="nb-description-list-description">US-East</dd>
</dl>

<!-- Bordered + compact -->
<dl class="nb-description-list nb-description-list-bordered nb-description-list-compact">
  <dt class="nb-description-list-term">CPU</dt>
  <dd class="nb-description-list-description">8 cores</dd>
</dl>
```

#### Rules
- Always include the base class `nb-description-list`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
