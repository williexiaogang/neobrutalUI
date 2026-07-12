### steps
Stepper container. Required.

[Steps docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/steps.md)

#### Class names
- component: `nb-steps`
- modifier: `nb-steps-vertical`
- part: `nb-step-indicator`, `nb-step-body`, `nb-step-label`, `nb-step-description`
- behavior: `nb-step-completed`, `nb-step-active`, `nb-step-disabled`
- color: `nb-step-primary`, `nb-step-secondary`, `nb-step-accent`, `nb-step-info`, `nb-step-success`, `nb-step-warning`, `nb-step-error`, `nb-step-neutral`
- size: `nb-steps-sm`, `nb-steps-lg`

#### Syntax

```html
<!-- Basic horizontal steps -->
<ol class="nb-steps">
  <li class="nb-step nb-step-completed">
    <span class="nb-step-indicator">1</span>
    <div class="nb-step-body">
      <span class="nb-step-label">Register</span>
      <span class="nb-step-description">Create an account</span>
    </div>
  </li>
  <li class="nb-step nb-step-active">
    <span class="nb-step-indicator">2</span>
    <div class="nb-step-body">
      <span class="nb-step-label">Profile</span>
      <span class="nb-step-description">Set up your info</span>
    </div>
  </li>
  <li class="nb-step">
    <span class="nb-step-indicator">3</span>
    <div class="nb-step-body">
      <span class="nb-step-label">Verify</span>
      <span class="nb-step-description">Confirm identity</span>
    </div>
  </li>
</ol>

<!-- Vertical steps with color -->
<ol class="nb-steps nb-steps-vertical">
  <li class="nb-step nb-step-completed nb-step-success">
    <span class="nb-step-indicator">1</span>
    <div class="nb-step-body">
      <span class="nb-step-label">Order</span>
    </div>
  </li>
  <li class="nb-step nb-step-active nb-step-success">
    <span class="nb-step-indicator">2</span>
    <div class="nb-step-body">
      <span class="nb-step-label">Payment</span>
    </div>
  </li>
  <li class="nb-step nb-step-success">
    <span class="nb-step-indicator">3</span>
    <div class="nb-step-body">
      <span class="nb-step-label">Shipping</span>
    </div>
  </li>
</ol>
```

#### Rules
- Always include the base class `nb-steps`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
