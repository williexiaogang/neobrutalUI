### card
Base card container. Required.

[Card docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/card.md)

#### Class names
- component: `nb-card`
- behavior: `nb-card-interactive`
- part: `nb-card-media`, `nb-card-header`, `nb-card-body`, `nb-card-footer`, `nb-card-title`

#### Syntax

```html
<!-- Minimal card -->
<div class="nb-card">
  <div class="nb-card-body">Content</div>
</div>

<!-- Full card with all parts -->
<article class="nb-card">
  <div class="nb-card-media">
    <img src="/preview.png" alt="" />
  </div>
  <header class="nb-card-header">
    <h2 class="nb-card-title">Card Title</h2>
  </header>
  <div class="nb-card-body">Main content goes here.</div>
  <footer class="nb-card-footer">Footer actions</footer>
</article>
```

#### Rules
- Always include the base class `nb-card`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
