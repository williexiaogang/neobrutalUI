### badge
Base badge class. Required.

[Badge docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/badge.md)

#### Class names
- component: `nb-badge`
- color: `nb-badge-primary`, `nb-badge-secondary`, `nb-badge-accent`, `nb-badge-info`, `nb-badge-success`, `nb-badge-warning`, `nb-badge-error`
- style: `nb-badge-outline`
- part: `nb-badge-remove`

#### Syntax

```html
<!-- Default badge -->
<span class="nb-badge">Default</span>

<!-- Color variant -->
<span class="nb-badge nb-badge-primary">Primary</span>

<!-- Outline variant -->
<span class="nb-badge nb-badge-outline">Outline</span>

<!-- Color + outline -->
<span class="nb-badge nb-badge-error nb-badge-outline">Error Outline</span>

<!-- Removable tag -->
<span class="nb-badge nb-badge-secondary">
  Filter
  <button class="nb-badge-remove" type="button" aria-label="Remove Filter">&times;</button>
</span>
```

#### Rules
- Always include the base class `nb-badge`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
