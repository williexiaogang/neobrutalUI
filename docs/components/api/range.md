# Range API

> **Component**: Range  
> **Category**: Forms  
> **Base class**: `.nb-range`  
> **Status**: Beta (CSS visual layer implemented; track, thumb, fill, color variants, sizes, and disabled state available)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-range` | Component | Base range/slider input. Required. |
| `.nb-range-vertical` | Layout | Vertical slider orientation. |
| `.nb-range-primary` | Color | Primary fill color. |
| `.nb-range-secondary` | Color | Secondary fill color. |
| `.nb-range-accent` | Color | Accent fill color. |
| `.nb-range-info` | Color | Info fill color. |
| `.nb-range-success` | Color | Success fill color. |
| `.nb-range-warning` | Color | Warning fill color. |
| `.nb-range-error` | Color | Error fill color. |
| `.nb-range-ticks` | Part | Tick mark labels below the slider. |
| `.nb-range-group` | Component | Wrapper for label + range + optional ticks. |

### Class Combination Examples

```html
<!-- Basic range -->
<input type="range" class="nb-range" min="0" max="100" value="50" />

<!-- Color variant -->
<input type="range" class="nb-range nb-range-primary" min="0" max="100" value="40" />

<!-- Vertical range -->
<input type="range" class="nb-range nb-range-vertical nb-range-primary" min="0" max="100" value="75" />

<!-- With ticks -->
<div class="nb-range-group">
  <label for="range-ticks">Stepped</label>
  <input type="range" id="range-ticks" class="nb-range nb-range-primary" min="0" max="100" step="10" />
  <div class="nb-range-ticks">
    <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
  </div>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-range-group">
  <label for="volume">Volume</label>
  <input type="range" id="volume" class="nb-range" min="0" max="100" value="50" />
</div>
```

### Semantic Element

- **Preferred**: `<input type="range">`.
- Wrap in `.nb-range-group` when a label and/or tick marks are needed.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `type="range"` | Yes | `"range"` | Required for slider behavior. |
| `min` / `max` | Recommended | Number | Defines the slider range. |
| `value` | Recommended | Number | Initial value. |
| `step` | Recommended | Number | Increment step. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-label` | If no visible label is present. |
| `aria-labelledby` | Reference a visible label by ID. |
| `aria-valuemin` / `aria-valuemax` | Managed automatically by the browser for native range inputs. |
| `aria-valuenow` | Managed automatically by the browser. |
| `disabled` | When the slider is not interactive. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus to the slider. |
| `↑` / `→` | Increases value by one step. |
| `↓` / `←` | Decreases value by one step. |
| `Home` / `End` | Jumps to min/max value. |
| `Page Up` / `Page Down` | Increases/decreases by a larger step (browser dependent). |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ | `.nb-range:hover::-webkit-slider-thumb`, `.nb-range:hover::-moz-range-thumb` | Thumb shadow elevates; thumb shifts `(-1px, -1px)`. |
| **active** | ✅ | `.nb-range:active::-webkit-slider-thumb`, `.nb-range:active::-moz-range-thumb` | Thumb shadow drops; thumb shifts `(1px, 1px)`. |
| **focus** | ✅ | `.nb-range:focus-visible` | `outline: 2px solid var(--nb-focus); outline-offset: 2px;` |
| **focus-visible** | ✅ | `:focus-visible` | Same as focus outline. |
| **disabled** | ✅ | `.nb-range:disabled` | `opacity: 0.6`, `cursor: not-allowed`; thumb transforms removed. |
| **checked / invalid / readonly / loading** | ❌ Not applicable | — | Not applicable. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

The range uses CSS custom properties for themable track/fill/thumb colors:

```css
.nb-range {
  --_track-bg: var(--nb-base-200);
  --_fill-bg: var(--nb-primary);
  --_thumb-bg: var(--nb-base-100);
  --_thumb-border: var(--nb-border);

  appearance: none;
  inline-size: 100%;
  block-size: 1.5rem;
  background: transparent;
  cursor: pointer;
  vertical-align: middle;
}
```

The thumb animates on hover/active:

```css
.nb-range::-webkit-slider-thumb {
  appearance: none;
  inline-size: 1.25rem;
  block-size: 1.25rem;
  margin-block-start: -0.4375rem;
  border: var(--nb-border-width) solid var(--_thumb-border);
  border-radius: var(--nb-radius-selector);
  background: var(--_thumb-bg);
  box-shadow: var(--nb-shadow-sm);
  transition: transform var(--nb-duration-fast) var(--nb-ease-out),
              box-shadow var(--nb-duration-fast) var(--nb-ease-out);
}
```

Vertical layout:

```css
.nb-range-vertical {
  writing-mode: vertical-lr;
  direction: rtl;
  inline-size: 1.5rem;
  block-size: 12rem;
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-range::-webkit-slider-thumb,
  .nb-range::-moz-range-thumb {
    transition: none;
  }
}
```

### RTL

Uses logical properties; no special RTL overrides needed. The vertical variant uses `direction: rtl` for bottom-to-top value progression.

---

## Examples

### Basic Range

```html
<div class="nb-range-group">
  <label for="range-basic">Basic Range</label>
  <input type="range" id="range-basic" class="nb-range" min="0" max="100" value="50" />
</div>
```

### Color Variants

```html
<input type="range" class="nb-range nb-range-primary" min="0" max="100" value="40" />
<input type="range" class="nb-range nb-range-secondary" min="0" max="100" value="60" />
<input type="range" class="nb-range nb-range-accent" min="0" max="100" value="30" />
<input type="range" class="nb-range nb-range-info" min="0" max="100" value="70" />
<input type="range" class="nb-range nb-range-success" min="0" max="100" value="80" />
<input type="range" class="nb-range nb-range-warning" min="0" max="100" value="55" />
<input type="range" class="nb-range nb-range-error" min="0" max="100" value="90" />
```

### With Tick Marks

```html
<div class="nb-range-group">
  <label for="range-ticks">With Tick Marks</label>
  <input type="range" id="range-ticks" class="nb-range nb-range-primary" min="0" max="100" value="50" step="10" />
  <div class="nb-range-ticks">
    <span>0</span>
    <span>25</span>
    <span>50</span>
    <span>75</span>
    <span>100</span>
  </div>
</div>
```

### Disabled State

```html
<input type="range" class="nb-range" min="0" max="100" value="50" disabled />
```

### Vertical Layout

```html
<div class="nb-range-group">
  <label for="range-vol">Vol</label>
  <input type="range" id="range-vol" class="nb-range nb-range-vertical nb-range-primary" min="0" max="100" value="75" />
</div>
```
