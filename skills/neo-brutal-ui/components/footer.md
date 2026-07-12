### footer
Base footer container. Required.

[Footer docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/footer.md)

#### Class names
- component: `nb-footer`
- part: `nb-footer-brand`, `nb-footer-brand-name`, `nb-footer-brand-tagline`, `nb-footer-links`, `nb-footer-link-group`, `nb-footer-link-title`, `nb-footer-link`, `nb-footer-divider`, `nb-footer-bottom`, `nb-footer-copyright`, `nb-footer-legal`
- style: `nb-footer-compact`
- color: `nb-footer-primary`, `nb-footer-neutral`

#### Syntax

```html
<footer class="nb-footer nb-footer-compact">
  <div class="nb-footer-brand">
    <p class="nb-footer-brand-name">NeoBrand</p>
  </div>
  <div class="nb-footer-links">
    <div class="nb-footer-link-group">
      <a href="#" class="nb-footer-link">Docs</a>
      <a href="#" class="nb-footer-link">GitHub</a>
    </div>
  </div>
  <hr class="nb-footer-divider" />
  <div class="nb-footer-bottom">
    <p class="nb-footer-copyright">© 2026 NeoBrand</p>
    <div class="nb-footer-legal">
      <a href="#">License</a>
    </div>
  </div>
</footer>
```

#### Rules
- Always include the base class `nb-footer`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
