### otp
Container for the segmented OTP input boxes.

[OTP Input docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/otp.md)

#### Class names
- component: `nb-otp`
- component / part: `nb-otp-field`
- size: `nb-otp-sm`, `nb-otp-lg`
- component / layout: `nb-otp-group`
- part: `nb-otp-label`, `nb-otp-error`
- style: `nb-otp-masked`

#### Syntax

```html
<!-- Default OTP -->
<div class="nb-otp-group">
  <span class="nb-otp-label">Enter code</span>
  <div class="nb-otp">
    <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" />
    <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" />
    <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" />
    <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" />
  </div>
</div>

<!-- Small size -->
<div class="nb-otp nb-otp-sm">
  <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" />
</div>

<!-- Masked OTP -->
<div class="nb-otp nb-otp-masked">
  <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" />
</div>
```

#### Rules
- Always include the base class `nb-otp`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
