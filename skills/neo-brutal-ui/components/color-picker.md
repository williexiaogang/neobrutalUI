### color-picker
Wrapper for the color input, label, and value text.

[Color Picker docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/color-picker.md)

#### Class names
- component: `nb-color-picker`
- part: `nb-color-picker-input`, `nb-color-picker-label`, `nb-color-picker-value`
- size: `nb-color-picker-sm`, `nb-color-picker-lg`

#### Syntax

```html
<!-- Basic color picker -->
<label class="nb-color-picker">
  <input type="color" class="nb-color-picker-input" value="#3b82f6" aria-label="Pick a color" />
  <span class="nb-color-picker-label">Primary</span>
</label>

<!-- With value display -->
<label class="nb-color-picker">
  <input type="color" class="nb-color-picker-input" value="#10b981" />
  <span class="nb-color-picker-label">Success</span>
  <span class="nb-color-picker-value">#10B981</span>
</label>

<!-- Large -->
<label class="nb-color-picker nb-color-picker-lg">
  <input type="color" class="nb-color-picker-input" value="#ef4444" />
  <span class="nb-color-picker-label">Danger</span>
</label>
```

#### Rules
- Always include the base class `nb-color-picker`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
