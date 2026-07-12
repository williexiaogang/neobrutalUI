### input
Base text input class. Required.

[Input docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/input.md)

#### Class names
- component: `nb-input`
- size: `nb-input-sm`, `nb-input-lg`
- part: `nb-field-label`, `nb-field-description`, `nb-field-error`

#### Syntax

```html
<!-- Standalone input -->
<input class="nb-input" type="text" placeholder="Enter text..." />

<!-- Input with field wrapper -->
<div class="nb-field">
  <label class="nb-field-label" for="email">Email</label>
  <input class="nb-input" id="email" type="email" />
  <span class="nb-field-description">We'll never share your email.</span>
</div>

<!-- Invalid input -->
<div class="nb-field">
  <label class="nb-field-label" for="username">Username</label>
  <input class="nb-input" id="username" type="text" aria-invalid="true" aria-describedby="username-error" />
  <span class="nb-field-error" id="username-error">Username is required.</span>
</div>
```

#### Rules
- Always include the base class `nb-input`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
