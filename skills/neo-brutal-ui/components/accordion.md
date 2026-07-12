### accordion
Root container for the accordion. Required.

[Accordion docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/accordion.md)

#### Class names
- component: `nb-accordion`
- part: `nb-accordion-icon`, `nb-accordion-panel`, `nb-accordion-panel-inner`, `nb-accordion-content`
- style: `nb-accordion-flush`
- size: `nb-accordion-sm`, `nb-accordion-lg`
- behavior: `is-open`, `nb-accordion-trigger-disabled`

#### Syntax

```html
<!-- Basic accordion -->
<div class="nb-accordion">
  <div class="nb-accordion-item is-open">
    <button class="nb-accordion-trigger" type="button" aria-expanded="true" aria-controls="panel-1" id="trigger-1">
      Section One
      <span class="nb-accordion-icon" aria-hidden="true">▼</span>
    </button>
    <div class="nb-accordion-panel is-open" id="panel-1" role="region" aria-labelledby="trigger-1">
      <div class="nb-accordion-panel-inner">
        <div class="nb-accordion-content">
          <p>Content for section one.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Flush variant -->
<div class="nb-accordion nb-accordion-flush">
  <div class="nb-accordion-item">...</div>
</div>

<!-- Large size -->
<div class="nb-accordion nb-accordion-lg">
  <div class="nb-accordion-item">...</div>
</div>
```

#### Rules
- Always include the base class `nb-accordion`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
