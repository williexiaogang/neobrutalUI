### form-summary
Base validation summary panel.

[Form Summary docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/form-summary.md)

#### Class names
- component: `nb-form-summary`
- part: `nb-form-summary-title`, `nb-form-summary-list`, `nb-form-summary-item`, `nb-form-summary-link`
- style: `nb-form-summary-warning`
- size / variant: `nb-form-summary-compact`

#### Syntax

```html
<!-- Default error summary -->
<div class="nb-form-summary" role="alert" aria-labelledby="fs-title">
  <h3 class="nb-form-summary-title" id="fs-title">
    <span aria-hidden="true">⚠️</span> There are 2 errors in your form
  </h3>
  <ul class="nb-form-summary-list">
    <li class="nb-form-summary-item">
      <button class="nb-form-summary-link" type="button">Username</button> is required.
    </li>
  </ul>
</div>

<!-- Warning + compact -->
<div class="nb-form-summary nb-form-summary-warning nb-form-summary-compact" role="alert" aria-labelledby="fs-warning">
  <h3 class="nb-form-summary-title" id="fs-warning">1 notice</h3>
  <ul class="nb-form-summary-list">
    <li class="nb-form-summary-item">Bio is close to the character limit.</li>
  </ul>
</div>
```

#### Rules
- Always include the base class `nb-form-summary`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
