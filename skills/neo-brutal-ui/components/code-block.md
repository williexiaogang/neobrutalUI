### code-block
Base code block class. Required.

[Code Block docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/code-block.md)

#### Class names
- component: `nb-code-block`
- part: `nb-code-block-header`, `nb-code-block-lang`, `nb-code-block-actions`, `nb-code-block-body`, `nb-code-block-pre`, `nb-code-block-code`, `nb-code-block-line`, `nb-code-block-line-number`, `nb-code-block-line-content`
- part / variant: `nb-code-block-lines`
- color: `nb-code-block-primary`, `nb-code-block-secondary`, `nb-code-block-accent`, `nb-code-block-info`, `nb-code-block-success`, `nb-code-block-warning`, `nb-code-block-error`
- size: `nb-code-block-sm`, `nb-code-block-lg`
- style: `nb-code-block-plain`, `nb-code-block-full`

#### Syntax

```html
<!-- Code block with header, line numbers, and primary accent -->
<div class="nb-code-block nb-code-block-primary">
  <div class="nb-code-block-header">
    <span class="nb-code-block-lang">TypeScript</span>
    <div class="nb-code-block-actions">
      <button class="nb-btn nb-btn-sm" type="button" aria-label="Copy code">Copy</button>
    </div>
  </div>
  <div class="nb-code-block-body">
    <div class="nb-code-block-pre">
      <code class="nb-code-block-code">...</code>
    </div>
  </div>
</div>

<!-- Small inline-ish code block without header -->
<div class="nb-code-block nb-code-block-sm nb-code-block-accent">
  <div class="nb-code-block-body">
    <div class="nb-code-block-pre">
      <code class="nb-code-block-code">npm install @neo-brutal-ui</code>
    </div>
  </div>
</div>
```

#### Rules
- Always include the base class `nb-code-block`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
