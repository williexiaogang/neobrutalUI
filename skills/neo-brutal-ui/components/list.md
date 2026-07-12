### list
Base list class. Required on `<ul>` or `<ol>`.

[List docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/list.md)

#### Class names
- component: `nb-list`
- style: `nb-list-numbered`, `nb-list-bulleted`, `nb-list-striped`, `nb-list-divided`, `nb-list-bordered`, `nb-list-compact`
- variant / layout: `nb-list-inline`
- size: `nb-list-sm`, `nb-list-lg`
- color: `nb-list-primary`, `nb-list-secondary`, `nb-list-accent`, `nb-list-info`, `nb-list-success`, `nb-list-warning`, `nb-list-error`, `nb-list-neutral`

#### Syntax

```html
<!-- Bulleted list -->
<ul class="nb-list nb-list-bulleted">
  <li class="nb-list-item">Feature one</li>
  <li class="nb-list-item">Feature two</li>
</ul>

<!-- Numbered, compact, success accent -->
<ol class="nb-list nb-list-numbered nb-list-compact nb-list-success">
  <li class="nb-list-item">Step one</li>
  <li class="nb-list-item">Step two</li>
</ol>

<!-- Inline chips -->
<ul class="nb-list nb-list-inline">
  <li class="nb-list-item">Docs</li>
  <li class="nb-list-item">Blog</li>
</ul>
```

#### Rules
- Always include the base class `nb-list`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
