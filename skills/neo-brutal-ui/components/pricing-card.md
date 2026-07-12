### pricing-card
Base pricing card container. Required.

[Pricing Card docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/pricing-card.md)

#### Class names
- component: `nb-pricing-card`
- part: `nb-pricing-card-header`, `nb-pricing-card-name`, `nb-pricing-card-description`, `nb-pricing-card-price-block`, `nb-pricing-card-price`, `nb-pricing-card-period`, `nb-pricing-card-features`, `nb-pricing-card-feature`, `nb-pricing-card-cta`
- behavior: `nb-pricing-card-feature-muted`
- color: `nb-pricing-card-primary`, `nb-pricing-card-secondary`, `nb-pricing-card-accent`, `nb-pricing-card-neutral`
- style: `nb-pricing-card-featured`
- size: `nb-pricing-card-sm`, `nb-pricing-card-lg`

#### Syntax

```html
<div class="nb-pricing-card nb-pricing-card-featured nb-pricing-card-primary">
  <div class="nb-pricing-card-header">
    <div class="nb-pricing-card-name">Pro</div>
    <div class="nb-pricing-card-description">For growing teams</div>
  </div>
  <div class="nb-pricing-card-price-block">
    <p class="nb-pricing-card-price">$29<span class="nb-pricing-card-period">/mo</span></p>
  </div>
  <ul class="nb-pricing-card-features">
    <li class="nb-pricing-card-feature">Unlimited projects</li>
    <li class="nb-pricing-card-feature nb-pricing-card-feature-muted">SSO</li>
  </ul>
  <div class="nb-pricing-card-cta">
    <button class="nb-btn nb-btn-primary nb-btn-block" type="button">Upgrade</button>
  </div>
</div>
```

#### Rules
- Always include the base class `nb-pricing-card`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
