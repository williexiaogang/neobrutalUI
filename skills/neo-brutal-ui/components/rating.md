### rating
Root container for the rating stars. Required.

[Rating docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/rating.md)

#### Class names
- component: `nb-rating`
- behavior: `nb-rating-item-filled`, `nb-rating-item-half`
- style: `nb-rating-interactive`, `nb-rating-readonly`
- color: `nb-rating-primary`, `nb-rating-secondary`, `nb-rating-accent`, `nb-rating-info`, `nb-rating-success`, `nb-rating-warning`, `nb-rating-error`, `nb-rating-neutral`
- size: `nb-rating-sm`, `nb-rating-lg`, `nb-rating-xl`
- part: `nb-rating-caption`

#### Syntax

```html
<!-- Read-only 4 out of 5 -->
<div class="nb-rating nb-rating-readonly" role="img" aria-label="Rating: 4 out of 5">
  <span class="nb-rating-item nb-rating-item-filled nb-rating-warning"></span>
  <span class="nb-rating-item nb-rating-item-filled nb-rating-warning"></span>
  <span class="nb-rating-item nb-rating-item-filled nb-rating-warning"></span>
  <span class="nb-rating-item nb-rating-item-filled nb-rating-warning"></span>
  <span class="nb-rating-item nb-rating-warning"></span>
</div>

<!-- Half-star rating -->
<div class="nb-rating nb-rating-readonly nb-rating-lg" role="img" aria-label="Rating: 2.5 out of 5">
  <span class="nb-rating-item nb-rating-item-filled nb-rating-accent"></span>
  <span class="nb-rating-item nb-rating-item-filled nb-rating-accent"></span>
  <span class="nb-rating-item nb-rating-item-half nb-rating-accent"></span>
  <span class="nb-rating-item nb-rating-accent"></span>
  <span class="nb-rating-item nb-rating-accent"></span>
</div>

<!-- Interactive -->
<div class="nb-rating nb-rating-interactive nb-rating-primary" data-nb-rating role="radiogroup" aria-label="Rate this product">
  <span class="nb-rating-item" data-nb-rating-item data-value="1" role="radio" aria-checked="false" tabindex="0" aria-label="1 star"></span>
  <span class="nb-rating-item" data-nb-rating-item data-value="2" role="radio" aria-checked="false" tabindex="-1" aria-label="2 stars"></span>
  <span class="nb-rating-item" data-nb-rating-item data-value="3" role="radio" aria-checked="false" tabindex="-1" aria-label="3 stars"></span>
  <span class="nb-rating-item" data-nb-rating-item data-value="4" role="radio" aria-checked="false" tabindex="-1" aria-label="4 stars"></span>
  <span class="nb-rating-item" data-nb-rating-item data-value="5" role="radio" aria-checked="false" tabindex="-1" aria-label="5 stars"></span>
</div>
```

#### Rules
- Always include the base class `nb-rating`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
