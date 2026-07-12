### phone-mockup
Base phone frame container. Required.

[Phone Mockup docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/phone-mockup.md)

#### Class names
- component: `nb-phone`
- part: `nb-phone-notch`, `nb-phone-notch-bar`, `nb-phone-screen`, `nb-phone-screen-content`, `nb-phone-indicator`, `nb-phone-indicator-bar`, `nb-phone-button`
- size: `nb-phone-sm`, `nb-phone-lg`
- color: `nb-phone-primary`, `nb-phone-secondary`, `nb-phone-accent`, `nb-phone-neutral`
- style: `nb-phone-dark`

#### Syntax

```html
<div class="nb-phone nb-phone-lg nb-phone-primary">
  <div class="nb-phone-notch">
    <div class="nb-phone-notch-bar"></div>
  </div>
  <div class="nb-phone-screen">
    <div class="nb-phone-screen-content">
      <!-- content -->
    </div>
  </div>
  <div class="nb-phone-indicator">
    <div class="nb-phone-indicator-bar"></div>
  </div>
</div>
```

#### Rules
- Always include the base class `nb-phone`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
