### empty-state
Base empty-state container. Required. Centered flex column layout.

[Empty State docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/empty-state.md)

#### Class names
- component: `nb-empty`
- part: `nb-empty-icon`, `nb-empty-title`, `nb-empty-message`, `nb-empty-action`
- style: `nb-empty-compact`, `nb-empty-bordered`

#### Syntax

```html
<!-- Default empty state -->
<div class="nb-empty">
  <div class="nb-empty-icon" aria-hidden="true">📭</div>
  <h3 class="nb-empty-title">No messages</h3>
  <p class="nb-empty-message">You're all caught up.</p>
</div>

<!-- Compact bordered empty state -->
<div class="nb-empty nb-empty-compact nb-empty-bordered">
  <div class="nb-empty-icon" aria-hidden="true">🔍</div>
  <h3 class="nb-empty-title">No results</h3>
  <p class="nb-empty-message">Try adjusting your search filters.</p>
</div>
```

#### Rules
- Always include the base class `nb-empty`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
