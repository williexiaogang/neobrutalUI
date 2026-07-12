### field
Base field wrapper. Holds a label, control, and helper/error text.

[Field docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/field.md)

#### Class names
- component: `nb-field`
- part: `nb-field-label`, `nb-field-description`, `nb-field-hint`, `nb-field-error`, `nb-field-group-legend`
- behavior: `nb-field-required`
- modifier: `nb-field-row`, `nb-field-inline`

#### Syntax

```html
<!-- Basic field wrapper -->
<div class="nb-field">
  <label class="nb-field-label" for="email">Email</label>
  <input class="nb-input" id="email" type="email" />
  <span class="nb-field-description">We'll never share your email.</span>
</div>

<!-- Required field with error -->
<div class="nb-field nb-field-required">
  <label class="nb-field-label" for="password">Password</label>
  <input class="nb-input" id="password" type="password" aria-invalid="true" />
  <span class="nb-field-error">Password must be at least 8 characters.</span>
</div>

<!-- Inline checkbox group -->
<fieldset class="nb-field-group">
  <legend class="nb-field-group-legend">Preferences</legend>
  <label class="nb-field-inline">
    <input type="checkbox" class="nb-checkbox" />
    <span class="nb-field-label">Subscribe</span>
  </label>
  <span class="nb-field-hint">You can change these anytime.</span>
</fieldset>

<!-- Row layout -->
<div class="nb-field-row">
  <div class="nb-field">
    <label class="nb-field-label">First name</label>
    <input class="nb-input" type="text" />
  </div>
  <div class="nb-field">
    <label class="nb-field-label">Last name</label>
    <input class="nb-input" type="text" />
  </div>
</div>
```

#### Rules
- Always include the base class `nb-field`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
