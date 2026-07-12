### alert
Base alert container. Required. Sets flex layout, accent border, background, and shadow.

[Alert docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/alert.md)

#### Class names
- component: `nb-alert`
- color: `nb-alert-info`, `nb-alert-success`, `nb-alert-warning`, `nb-alert-error`
- part: `nb-alert-icon`, `nb-alert-title`, `nb-alert-body`

#### Syntax

```html
<!-- Info alert with icon and title -->
<div class="nb-alert nb-alert-info" role="alert">
  <span class="nb-alert-icon" aria-hidden="true">ⓘ</span>
  <div>
    <p class="nb-alert-title">Heads up</p>
    <p class="nb-alert-body">This is a preview of the alert component styling.</p>
  </div>
</div>

<!-- Error alert -->
<div class="nb-alert nb-alert-error" role="alert">
  <span class="nb-alert-icon" aria-hidden="true">✕</span>
  <div>
    <p class="nb-alert-title">Error</p>
    <p class="nb-alert-body">Something went wrong. Please try again.</p>
  </div>
</div>
```

#### Rules
- Always include the base class `nb-alert`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
