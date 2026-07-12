### tooltip
Wrapper around the trigger and tooltip content. Required.

[Tooltip docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/tooltip.md)

#### Class names
- component: `nb-tooltip`
- behavior: `is-visible`
- modifier: `nb-tooltip-top`, `nb-tooltip-bottom`, `nb-tooltip-start`, `nb-tooltip-end`

#### Syntax

```html
<!-- Default (bottom-ish fallback) tooltip -->
<span class="nb-tooltip" data-nb-tooltip>
  <button class="nb-btn nb-btn-sm" type="button">Hover me</button>
  <span class="nb-tooltip-content" role="tooltip">Tooltip text</span>
</span>

<!-- Explicit placement -->
<span class="nb-tooltip nb-tooltip-bottom" data-nb-tooltip>
  <input class="nb-input" type="text" aria-label="Focus tooltip demo" />
  <span class="nb-tooltip-content" role="tooltip">Appears on focus</span>
</span>
```

#### Rules
- Always include the base class `nb-tooltip`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
