### divider
Base divider. Horizontal flex layout with optional label centered between two lines.

[Divider docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/divider.md)

#### Class names
- component: `nb-divider`
- style: `nb-divider-vertical`

#### Syntax

```html
<!-- Horizontal divider with label -->
<span class="nb-divider" role="separator">Section</span>

<!-- Vertical divider -->
<span class="nb-divider nb-divider-vertical" role="separator" aria-orientation="vertical"></span>
```

#### Rules
- Always include the base class `nb-divider`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
