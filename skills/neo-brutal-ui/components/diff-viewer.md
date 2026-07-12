### diff-viewer
Base diff viewer class. Required.

[Diff Viewer docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/diff-viewer.md)

#### Class names
- component: `nb-diff`
- part: `nb-diff-header`, `nb-diff-stats`, `nb-diff-body`, `nb-diff-hunk`, `nb-diff-line`, `nb-diff-gutter`, `nb-diff-gutter-number`, `nb-diff-content`, `nb-diff-sign`
- part / state: `nb-diff-file-old`, `nb-diff-file-new`, `nb-diff-stat-added`, `nb-diff-stat-removed`
- state / color: `nb-diff-added`, `nb-diff-removed`, `nb-diff-unchanged`
- size: `nb-diff-sm`, `nb-diff-lg`
- style: `nb-diff-full`, `nb-diff-plain`

#### Syntax

```html
<div class="nb-diff">
  <div class="nb-diff-header">
    <span class="nb-diff-file-old">old.ts</span>
    <span>→</span>
    <span class="nb-diff-file-new">new.ts</span>
    <div class="nb-diff-stats">
      <span class="nb-diff-stat-added">+12</span>
      <span class="nb-diff-stat-removed">-4</span>
    </div>
  </div>
  <div class="nb-diff-body">
    <div class="nb-diff-hunk">@@ -1,5 +1,8 @@</div>
    <div class="nb-diff-line nb-diff-added">
      <span class="nb-diff-gutter"><span class="nb-diff-gutter-number">1</span></span>
      <span class="nb-diff-sign">+</span>
      <span class="nb-diff-content">export const foo = 1;</span>
    </div>
  </div>
</div>
```

#### Rules
- Always include the base class `nb-diff`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
