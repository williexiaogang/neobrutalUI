# Pricing Card API

> **Component**: Pricing Card  
> **Category**: Layout  
> **Base class**: `.nb-pricing-card`  
> **Status**: Ready

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-pricing-card` | Component | Base pricing card container. Required. |
| `.nb-pricing-card-header` | Part | Top section with plan name and description. |
| `.nb-pricing-card-name` | Part | Plan name heading; colored with the accent. |
| `.nb-pricing-card-description` | Part | Short plan description. |
| `.nb-pricing-card-price-block` | Part | Wraps price and billing period. |
| `.nb-pricing-card-price` | Part | Large price value. |
| `.nb-pricing-card-period` | Part | Billing period label (e.g., `/mo`). |
| `.nb-pricing-card-features` | Part | Feature list (`<ul>`). |
| `.nb-pricing-card-feature` | Part | Individual feature item. |
| `.nb-pricing-card-feature-muted` | State | Muted/excluded feature with strikethrough. |
| `.nb-pricing-card-cta` | Part | Call-to-action area at the bottom. |
| `.nb-pricing-card-primary` | Color | Uses `--nb-primary` as accent. |
| `.nb-pricing-card-secondary` | Color | Uses `--nb-secondary` as accent. |
| `.nb-pricing-card-accent` | Color | Uses `--nb-accent` as accent. |
| `.nb-pricing-card-neutral` | Color | Uses `--nb-neutral` as accent. |
| `.nb-pricing-card-featured` | Variant | Larger shadow and thicker accent border. |
| `.nb-pricing-card-sm` | Size | Smaller max-width and padding. |
| `.nb-pricing-card-lg` | Size | Larger max-width and padding. |

> **Naming note**: The catalog slug is `pricing-card`. The CSS base class is `.nb-pricing-card`.

### Class Combination Examples

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

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-pricing-card nb-pricing-card-primary">
  <div class="nb-pricing-card-header">
    <div class="nb-pricing-card-name">Starter</div>
    <div class="nb-pricing-card-description">For individuals</div>
  </div>
  <div class="nb-pricing-card-price-block">
    <p class="nb-pricing-card-price">$0<span class="nb-pricing-card-period">/mo</span></p>
  </div>
  <ul class="nb-pricing-card-features">
    <li class="nb-pricing-card-feature">1 project</li>
    <li class="nb-pricing-card-feature">Community support</li>
    <li class="nb-pricing-card-feature nb-pricing-card-feature-muted">Custom domains</li>
  </ul>
  <div class="nb-pricing-card-cta">
    <button class="nb-btn nb-btn-primary nb-btn-block" type="button">Get Started</button>
  </div>
</div>
```

### Semantic Element

- **Preferred**: `<article>` for a self-contained pricing plan.
- **Lists**: Use `<ul>` for `.nb-pricing-card-features` and `<li>` for `.nb-pricing-card-feature`.

### Part Usage Rules

| Part | Required? | Notes |
|------|-----------|-------|
| `.nb-pricing-card-header` | Recommended | Contains plan name and description. |
| `.nb-pricing-card-price-block` | Recommended | Displays price and period. |
| `.nb-pricing-card-features` | Recommended | Feature list. |
| `.nb-pricing-card-cta` | No | Optional CTA button area. |

### Required Attributes

No component-specific required attributes.

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-label` / `aria-labelledby` | On the card to reference the plan name, especially when multiple cards appear together. |

### Keyboard Behavior

Pricing Card is a **non-interactive container**. Keyboard navigation flows through the CTA button or any links inside the card.

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ | `.nb-pricing-card:hover` | Shadow elevates to `--nb-shadow-lg`, card translates `(-2px, -2px)`. |
| **active** | ✅ (implicit) | `:active` | No explicit active styles; browser default applies. |
| **focus-visible** | ✅ | `.nb-pricing-card-cta .nb-btn:focus-visible` | Inherited from the focused button. |
| **disabled** | — N/A | — | Pricing Card is not an interactive element. |

### State Priority

- `.nb-pricing-card-featured:hover` uses a larger translate (`-3px, -3px`) and keeps the `xl` shadow.

---

## CSS Implementation Notes

### Layout / Shadow / Motion

```css
.nb-pricing-card {
  --_bg: var(--nb-base-100);
  --_fg: var(--nb-base-content);
  --_accent: var(--nb-primary);
  --_border: var(--nb-border);
  --_shadow: var(--nb-shadow-md);

  display: flex;
  flex-direction: column;
  inline-size: 100%;
  max-inline-size: 24rem;
  border: var(--nb-border-width) solid var(--_border);
  border-radius: var(--nb-radius-box);
  background: var(--_bg);
  color: var(--_fg);
  box-shadow: var(--_shadow);
  transform: translate(0, 0);
  transition: transform var(--nb-duration-fast) var(--nb-ease-out),
    box-shadow var(--nb-duration-fast) var(--nb-ease-out);
}

.nb-pricing-card:hover {
  box-shadow: var(--nb-shadow-lg);
  transform: translate(-2px, -2px);
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-pricing-card {
    transition: none;
  }
}
```

### RTL

Uses logical properties; no special RTL overrides needed.

### Forced Colors

```css
@media (forced-colors: active) {
  .nb-pricing-card {
    border: 2px solid CanvasText;
    forced-color-adjust: none;
  }

  .nb-pricing-card-header,
  .nb-pricing-card-price-block,
  .nb-pricing-card-cta {
    border-color: CanvasText;
  }

  .nb-pricing-card-feature::before {
    color: CanvasText;
  }
}
```

---

## Examples

### Basic Pricing Card

```html
<article class="nb-pricing-card nb-pricing-card-primary" aria-labelledby="plan-starter">
  <div class="nb-pricing-card-header">
    <div id="plan-starter" class="nb-pricing-card-name">Starter</div>
    <div class="nb-pricing-card-description">For individuals</div>
  </div>
  <div class="nb-pricing-card-price-block">
    <p class="nb-pricing-card-price">$0<span class="nb-pricing-card-period">/mo</span></p>
  </div>
  <ul class="nb-pricing-card-features">
    <li class="nb-pricing-card-feature">1 project</li>
    <li class="nb-pricing-card-feature">Community support</li>
  </ul>
  <div class="nb-pricing-card-cta">
    <button class="nb-btn nb-btn-primary nb-btn-block" type="button">Get Started</button>
  </div>
</article>
```

### Featured Plan

```html
<article class="nb-pricing-card nb-pricing-card-featured nb-pricing-card-accent" aria-labelledby="plan-pro">
  <div class="nb-pricing-card-header">
    <div id="plan-pro" class="nb-pricing-card-name">Pro</div>
    <div class="nb-pricing-card-description">For growing teams</div>
  </div>
  <div class="nb-pricing-card-price-block">
    <p class="nb-pricing-card-price">$29<span class="nb-pricing-card-period">/mo</span></p>
  </div>
  <ul class="nb-pricing-card-features">
    <li class="nb-pricing-card-feature">Unlimited projects</li>
    <li class="nb-pricing-card-feature">Priority support</li>
    <li class="nb-pricing-card-feature nb-pricing-card-feature-muted">SSO</li>
  </ul>
  <div class="nb-pricing-card-cta">
    <button class="nb-btn nb-btn-primary nb-btn-block" type="button">Upgrade to Pro</button>
  </div>
</article>
```

### Size Variants

```html
<article class="nb-pricing-card nb-pricing-card-sm nb-pricing-card-neutral">…</article>
<article class="nb-pricing-card nb-pricing-card-lg nb-pricing-card-secondary">…</article>
```

---
