### toast
Fixed-position container for one or more toasts. Required.

[Toast docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/toast.md)

#### Class names
- component: `nb-toast`
- modifier: `nb-toast-container-top-start`, `nb-toast-container-top-end`, `nb-toast-container-bottom-start`, `nb-toast-container-bottom-end`

#### Syntax

```html
<div class="nb-toast-container nb-toast-container-bottom-end" role="region" aria-live="polite" aria-label="Notifications">
  <div class="nb-toast nb-toast-success is-entering" role="status">
    <div>
      <div class="nb-toast-title">Success</div>
      <div class="nb-toast-message">Your action completed successfully.</div>
    </div>
    <button class="nb-toast-close" type="button" aria-label="Close notification">×</button>
  </div>
</div>
```

#### Rules
- Always include the base class `nb-toast`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
