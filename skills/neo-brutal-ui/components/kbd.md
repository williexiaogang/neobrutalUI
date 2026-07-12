### kbd
Base keyboard key class. Required.

[Kbd docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/kbd.md)

#### Class names
- component: `nb-kbd`
- size: `nb-kbd-sm`, `nb-kbd-lg`
- color: `nb-kbd-primary`, `nb-kbd-secondary`, `nb-kbd-accent`, `nb-kbd-neutral`
- behavior: `nb-kbd-pressed`
- modifier: `nb-kbd-group`

#### Syntax

```html
<!-- Single keys -->
<kbd class="nb-kbd">Ctrl</kbd>
<kbd class="nb-kbd nb-kbd-lg nb-kbd-pressed">Space</kbd>

<!-- Combo group -->
<div class="nb-kbd-group">
  <kbd class="nb-kbd nb-kbd-sm">Cmd</kbd>
  <kbd class="nb-kbd nb-kbd-sm">Shift</kbd>
  <kbd class="nb-kbd nb-kbd-sm">N</kbd>
</div>

<!-- Colored combo -->
<div class="nb-kbd-group">
  <kbd class="nb-kbd nb-kbd-primary">Esc</kbd>
  <kbd class="nb-kbd nb-kbd-accent">Enter</kbd>
</div>
```

#### Rules
- Always include the base class `nb-kbd`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
