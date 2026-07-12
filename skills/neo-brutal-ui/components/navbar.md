### navbar
Top navigation bar container. Required.

[Navbar docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/navbar.md)

#### Class names
- component: `nb-navbar`
- part: `nb-navbar-brand`, `nb-navbar-nav`, `nb-navbar-actions`, `nb-navbar-toggle`, `nb-navbar-collapse`
- behavior: `is-open`

#### Syntax

```html
<!-- Default navbar -->
<nav class="nb-navbar" aria-label="Main navigation">
  <a href="#" class="nb-navbar-brand">NeoBrand</a>
  <div class="nb-navbar-collapse is-open" id="navbar-collapse">
    <ul class="nb-navbar-nav">
      <li><a href="#">Home</a></li>
      <li><a href="#">Features</a></li>
      <li><a href="#">Pricing</a></li>
    </ul>
    <div class="nb-navbar-actions">
      <button class="nb-btn nb-btn-sm" type="button">Sign In</button>
      <button class="nb-btn nb-btn-sm nb-btn-primary" type="button">Get Started</button>
    </div>
  </div>
  <button class="nb-navbar-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false" aria-controls="navbar-collapse">
    <span aria-hidden="true">☰</span>
  </button>
</nav>
```

#### Rules
- Always include the base class `nb-navbar`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
