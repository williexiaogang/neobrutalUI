### carousel
Root carousel container. Required.

[Carousel docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/carousel.md)

#### Class names
- component: `nb-carousel`
- part: `nb-carousel-viewport`, `nb-carousel-track`, `nb-carousel-slide`, `nb-carousel-nav-prev`, `nb-carousel-nav-next`, `nb-carousel-dots`, `nb-carousel-dot`, `nb-carousel-caption`, `nb-carousel-caption-title`, `nb-carousel-caption-body`
- modifier: `nb-carousel-show-2`, `nb-carousel-show-3`, `nb-carousel-show-4`, `nb-carousel-nav-overlay`, `nb-carousel-vertical`
- component / part: `nb-carousel-nav`
- behavior: `nb-carousel-dot-active`
- color: `nb-carousel-primary`, `nb-carousel-secondary`, `nb-carousel-accent`, `nb-carousel-info`, `nb-carousel-success`, `nb-carousel-warning`, `nb-carousel-error`
- size: `nb-carousel-sm`, `nb-carousel-lg`

#### Syntax

```html
<!-- Basic inline-nav carousel -->
<div class="nb-carousel">
  <div class="nb-carousel-viewport">
    <div class="nb-carousel-track">
      <div class="nb-carousel-slide">Slide 1</div>
      <div class="nb-carousel-slide">Slide 2</div>
    </div>
  </div>
  <button class="nb-carousel-nav nb-carousel-nav-prev" type="button">‹</button>
  <button class="nb-carousel-nav nb-carousel-nav-next" type="button">›</button>
</div>

<!-- Overlay nav + primary accent -->
<div class="nb-carousel nb-carousel-primary nb-carousel-nav-overlay">
  <div class="nb-carousel-viewport">...</div>
  <button class="nb-carousel-nav nb-carousel-nav-prev" type="button">‹</button>
  <button class="nb-carousel-nav nb-carousel-nav-next" type="button">›</button>
</div>

<!-- Multi-slide visible -->
<div class="nb-carousel nb-carousel-show-2">
  <div class="nb-carousel-viewport">
    <div class="nb-carousel-track">
      <div class="nb-carousel-slide">A</div>
      <div class="nb-carousel-slide">B</div>
      <div class="nb-carousel-slide">C</div>
    </div>
  </div>
</div>
```

#### Rules
- Always include the base class `nb-carousel`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
