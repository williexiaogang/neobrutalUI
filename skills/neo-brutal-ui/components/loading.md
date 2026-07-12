### loading
Base spinner. A `1.5rem` circle with a partial primary border and infinite rotation.

[Loading docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/loading.md)

#### Class names
- component: `nb-loading`

#### Syntax

```html
<!-- Standalone spinner -->
<span class="nb-loading" aria-label="Loading"></span>

<!-- Inline spinner inside a button -->
<button class="nb-btn nb-btn-primary" type="button" disabled>
  <span class="nb-loading" aria-hidden="true" style="inline-size: 1rem; block-size: 1rem; border-width: 2px;"></span>
  Saving
</button>
```

#### Rules
- Always include the base class `nb-loading`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
