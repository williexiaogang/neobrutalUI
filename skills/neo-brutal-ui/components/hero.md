### hero
Base hero container. Required.

[Hero docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/hero.md)

#### Class names
- component: `nb-hero`
- part: `nb-hero-content`, `nb-hero-title`, `nb-hero-subtitle`, `nb-hero-description`, `nb-hero-actions`, `nb-hero-media`
- style: `nb-hero-center`
- size: `nb-hero-sm`, `nb-hero-lg`
- color: `nb-hero-primary`, `nb-hero-secondary`, `nb-hero-accent`, `nb-hero-neutral`

#### Syntax

```html
<!-- Centered large primary hero -->
<div class="nb-hero nb-hero-lg nb-hero-center nb-hero-primary">
  <div class="nb-hero-content">
    <p class="nb-hero-subtitle">v2.0 is here</p>
    <h1 class="nb-hero-title">Ship faster</h1>
    <p class="nb-hero-description">Everything you need to build brutalist web apps.</p>
    <div class="nb-hero-actions">
      <button class="nb-btn nb-btn-accent" type="button">Download</button>
      <button class="nb-btn nb-btn-ghost" type="button">Read Changelog</button>
    </div>
  </div>
</div>
```

#### Rules
- Always include the base class `nb-hero`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
