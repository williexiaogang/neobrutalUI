### browser-mockup
Base browser frame container. Required.

[Browser Mockup docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/browser-mockup.md)

#### Class names
- component: `nb-browser`
- part: `nb-browser-header`, `nb-browser-dots`, `nb-browser-dot`, `nb-browser-address`, `nb-browser-address-text`, `nb-browser-toolbar`, `nb-browser-body`
- color: `nb-browser-dot-red`, `nb-browser-dot-yellow`, `nb-browser-dot-green`, `nb-browser-primary`, `nb-browser-secondary`, `nb-browser-accent`
- size: `nb-browser-sm`, `nb-browser-lg`
- style: `nb-browser-dark`

#### Syntax

```html
<div class="nb-browser nb-browser-lg nb-browser-primary">
  <div class="nb-browser-header">
    <div class="nb-browser-dots">
      <span class="nb-browser-dot nb-browser-dot-red"></span>
      <span class="nb-browser-dot nb-browser-dot-yellow"></span>
      <span class="nb-browser-dot nb-browser-dot-green"></span>
    </div>
    <div class="nb-browser-address">
      <span class="nb-browser-address-text">dashboard.example.com</span>
    </div>
  </div>
  <div class="nb-browser-body">
    <!-- content -->
  </div>
</div>
```

#### Rules
- Always include the base class `nb-browser`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
