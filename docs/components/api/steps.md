# Steps API

> **Component**: Steps  
> **Category**: Navigation  
> **Base class**: `.nb-steps`  
> **Status**: Beta (horizontal/vertical layouts, completed/active/disabled states, color/size variants, responsive scroll, and forced-colors support included)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-steps` | Component | Stepper container. Required. |
| `.nb-steps-vertical` | Layout | Stacks steps vertically with vertical connectors. |
| `.nb-step` | Component | Individual step item. Required. |
| `.nb-step-indicator` | Part | Circle containing the step number or icon. |
| `.nb-step-body` | Part | Container for step label and description. |
| `.nb-step-label` | Part | Step title text. |
| `.nb-step-description` | Part | Optional step helper text. |
| `.nb-step-completed` | State | Marks a completed step. |
| `.nb-step-active` | State | Marks the current step. |
| `.nb-step-disabled` | State | Dims the step and disables interaction. |
| `.nb-step-primary` | Color | Primary accent for active/completed indicators. |
| `.nb-step-secondary` | Color | Secondary accent for active/completed indicators. |
| `.nb-step-accent` | Color | Accent color for active/completed indicators. |
| `.nb-step-info` | Color | Info color for active/completed indicators. |
| `.nb-step-success` | Color | Success color for active/completed indicators. |
| `.nb-step-warning` | Color | Warning color for active/completed indicators. |
| `.nb-step-error` | Color | Error color for active/completed indicators. |
| `.nb-step-neutral` | Color | Neutral color for active/completed indicators. |
| `.nb-steps-sm` | Size | Compact stepper with smaller indicators and text. |
| `.nb-steps-lg` | Size | Larger stepper with bigger indicators and text. |

### Class Combination Examples

```html
<!-- Basic horizontal steps -->
<ol class="nb-steps">
  <li class="nb-step nb-step-completed">
    <span class="nb-step-indicator">1</span>
    <div class="nb-step-body">
      <span class="nb-step-label">Register</span>
      <span class="nb-step-description">Create an account</span>
    </div>
  </li>
  <li class="nb-step nb-step-active">
    <span class="nb-step-indicator">2</span>
    <div class="nb-step-body">
      <span class="nb-step-label">Profile</span>
      <span class="nb-step-description">Set up your info</span>
    </div>
  </li>
  <li class="nb-step">
    <span class="nb-step-indicator">3</span>
    <div class="nb-step-body">
      <span class="nb-step-label">Verify</span>
      <span class="nb-step-description">Confirm identity</span>
    </div>
  </li>
</ol>

<!-- Vertical steps with color -->
<ol class="nb-steps nb-steps-vertical">
  <li class="nb-step nb-step-completed nb-step-success">
    <span class="nb-step-indicator">1</span>
    <div class="nb-step-body">
      <span class="nb-step-label">Order</span>
    </div>
  </li>
  <li class="nb-step nb-step-active nb-step-success">
    <span class="nb-step-indicator">2</span>
    <div class="nb-step-body">
      <span class="nb-step-label">Payment</span>
    </div>
  </li>
  <li class="nb-step nb-step-success">
    <span class="nb-step-indicator">3</span>
    <div class="nb-step-body">
      <span class="nb-step-label">Shipping</span>
    </div>
  </li>
</ol>
```

---

## DOM Contract

### Recommended Structure

```html
<ol class="nb-steps">
  <li class="nb-step nb-step-completed">
    <span class="nb-step-indicator">1</span>
    <div class="nb-step-body">
      <span class="nb-step-label">Register</span>
      <span class="nb-step-description">Create an account</span>
    </div>
  </li>
  <li class="nb-step nb-step-active">
    <span class="nb-step-indicator">2</span>
    <div class="nb-step-body">
      <span class="nb-step-label">Profile</span>
      <span class="nb-step-description">Set up your info</span>
    </div>
  </li>
  <li class="nb-step">
    <span class="nb-step-indicator">3</span>
    <div class="nb-step-body">
      <span class="nb-step-label">Verify</span>
      <span class="nb-step-description">Confirm identity</span>
    </div>
  </li>
</ol>
```

### Semantic Element

- **Preferred**: `<ol>` for ordered progress through steps.
- **Items**: Use `<li>` for each step.
- **Indicator**: Use `<span>` for the step number or icon.
- **Body**: Use `<div>` with `.nb-step-body` for label/description.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| None | — | — | The component is purely presentational. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-current="step"` | On the active step element. |
| `disabled` | On the step indicator when a step is disabled. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus to focusable content inside steps if present. |
| Standard keys | Steps themselves are not interactive; behavior depends on any nested controls. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ❌ Not styled | — | No explicit hover styles. |
| **active** | ❌ Not styled | — | No explicit `:active` styles. |
| **focus-visible** | ✅ | `.nb-step:focus-visible`, `.nb-step-indicator:focus-visible` | `outline: 2px solid var(--nb-focus)` with 2px offset. |
| **disabled** | ✅ | `.nb-step-disabled`, `.nb-step:has(.nb-step-indicator[disabled])` | `opacity: 0.5`, `cursor: not-allowed`, indicator shadow removed. |
| **completed** | ✅ | `.nb-step-completed` | Indicator filled with active color, connector line filled with active color, shadow removed. |
| **active** / **current** | ✅ | `.nb-step-active` | Indicator filled with active color and uses a stronger shadow; label color changes to active color. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

- Steps use Flexbox with equal flex distribution in horizontal mode.
- Connector lines are rendered with `::after` pseudo-elements positioned between indicators.
- Vertical layout flips step and connector orientation.
- The active step indicator uses a stronger shadow (`--nb-steps-active-shadow`, default `--nb-shadow-md`).
- Step indicators transition background, color, and box-shadow.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-step-indicator {
    transition: none;
  }
}
```

### RTL

Uses logical properties (`inline-size`, `block-size`, `inset-inline-start`, etc.); no special RTL overrides needed.

---

## Examples

### Default Steps

```html
<ol class="nb-steps">
  <li class="nb-step nb-step-completed">
    <span class="nb-step-indicator">1</span>
    <div class="nb-step-body">
      <span class="nb-step-label">Register</span>
      <span class="nb-step-description">Create an account</span>
    </div>
  </li>
  <li class="nb-step nb-step-active">
    <span class="nb-step-indicator">2</span>
    <div class="nb-step-body">
      <span class="nb-step-label">Profile</span>
      <span class="nb-step-description">Set up your info</span>
    </div>
  </li>
  <li class="nb-step">
    <span class="nb-step-indicator">3</span>
    <div class="nb-step-body">
      <span class="nb-step-label">Verify</span>
      <span class="nb-step-description">Confirm identity</span>
    </div>
  </li>
</ol>
```

### Color Variants

```html
<ol class="nb-steps">
  <li class="nb-step nb-step-completed nb-step-success">
    <span class="nb-step-indicator">1</span>
    <div class="nb-step-body"><span class="nb-step-label">Done</span></div>
  </li>
  <li class="nb-step nb-step-active nb-step-success">
    <span class="nb-step-indicator">2</span>
    <div class="nb-step-body"><span class="nb-step-label">Active</span></div>
  </li>
  <li class="nb-step nb-step-success">
    <span class="nb-step-indicator">3</span>
    <div class="nb-step-body"><span class="nb-step-label">Next</span></div>
  </li>
</ol>
```

### Size Variants

```html
<ol class="nb-steps nb-steps-sm">
  <li class="nb-step nb-step-completed">
    <span class="nb-step-indicator">1</span>
    <div class="nb-step-body"><span class="nb-step-label">Small</span></div>
  </li>
  <li class="nb-step nb-step-active">
    <span class="nb-step-indicator">2</span>
    <div class="nb-step-body"><span class="nb-step-label">Active</span></div>
  </li>
</ol>

<ol class="nb-steps nb-steps-lg">
  <li class="nb-step nb-step-completed">
    <span class="nb-step-indicator">1</span>
    <div class="nb-step-body"><span class="nb-step-label">Large</span></div>
  </li>
  <li class="nb-step nb-step-active">
    <span class="nb-step-indicator">2</span>
    <div class="nb-step-body"><span class="nb-step-label">Active</span></div>
  </li>
</ol>
```

### Vertical Layout

```html
<ol class="nb-steps nb-steps-vertical">
  <li class="nb-step nb-step-completed">
    <span class="nb-step-indicator">1</span>
    <div class="nb-step-body">
      <span class="nb-step-label">Order</span>
      <span class="nb-step-description">Place your order</span>
    </div>
  </li>
  <li class="nb-step nb-step-active">
    <span class="nb-step-indicator">2</span>
    <div class="nb-step-body">
      <span class="nb-step-label">Payment</span>
      <span class="nb-step-description">Complete payment</span>
    </div>
  </li>
  <li class="nb-step">
    <span class="nb-step-indicator">3</span>
    <div class="nb-step-body">
      <span class="nb-step-label">Shipping</span>
      <span class="nb-step-description">Wait for delivery</span>
    </div>
  </li>
</ol>
```

### Disabled Steps

```html
<ol class="nb-steps">
  <li class="nb-step nb-step-completed">
    <span class="nb-step-indicator">1</span>
    <div class="nb-step-body"><span class="nb-step-label">Done</span></div>
  </li>
  <li class="nb-step nb-step-active">
    <span class="nb-step-indicator">2</span>
    <div class="nb-step-body"><span class="nb-step-label">Active</span></div>
  </li>
  <li class="nb-step nb-step-disabled">
    <span class="nb-step-indicator" disabled>3</span>
    <div class="nb-step-body"><span class="nb-step-label">Disabled</span></div>
  </li>
</ol>
```

