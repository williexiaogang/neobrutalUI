### window-mockup
Base window frame container. Required.

[Window Mockup docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/window-mockup.md)

#### Class names
- component: `nb-window`
- part: `nb-window-header`, `nb-window-title`, `nb-window-title-icon`, `nb-window-title-text`, `nb-window-controls`, `nb-window-body`, `nb-window-footer`
- component/part: `nb-window-control`
- style: `nb-window-control-minimize`, `nb-window-control-maximize`, `nb-window-control-close`, `nb-window-dark`
- size: `nb-window-sm`, `nb-window-lg`
- color: `nb-window-primary`, `nb-window-secondary`, `nb-window-accent`, `nb-window-neutral`

#### Syntax

```html
<div class="nb-window nb-window-lg nb-window-primary">
  <div class="nb-window-header">
    <div class="nb-window-title">
      <span class="nb-window-title-icon" aria-hidden="true">📝</span>
      <span class="nb-window-title-text">notes.txt</span>
    </div>
    <div class="nb-window-controls">
      <button class="nb-window-control nb-window-control-minimize" aria-label="Minimize" type="button"></button>
      <button class="nb-window-control nb-window-control-maximize" aria-label="Maximize" type="button"></button>
      <button class="nb-window-control nb-window-control-close" aria-label="Close" type="button"></button>
    </div>
  </div>
  <div class="nb-window-body">
    <!-- content -->
  </div>
</div>
```

#### Rules
- Always include the base class `nb-window`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
