### timeline
Base timeline container. Required.

[Timeline docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/timeline.md)

#### Class names
- component: `nb-timeline`
- part: `nb-timeline-item`, `nb-timeline-marker`, `nb-timeline-connector`, `nb-timeline-content`, `nb-timeline-card`, `nb-timeline-time`, `nb-timeline-title`, `nb-timeline-body`
- color: `nb-timeline-marker-primary`, `nb-timeline-marker-secondary`, `nb-timeline-marker-accent`, `nb-timeline-marker-info`, `nb-timeline-marker-success`, `nb-timeline-marker-warning`, `nb-timeline-marker-error`, `nb-timeline-marker-neutral`
- style: `nb-timeline-marker-icon`, `nb-timeline-dashed`
- modifier: `nb-timeline-alternate`, `nb-timeline-horizontal`, `nb-timeline-opposite`
- size: `nb-timeline-sm`, `nb-timeline-lg`

#### Syntax

```html
<!-- Vertical timeline with colored markers -->
<div class="nb-timeline">
  <div class="nb-timeline-item">
    <div class="nb-timeline-marker nb-timeline-marker-primary"></div>
    <div class="nb-timeline-content">
      <div class="nb-timeline-title">Project Kickoff</div>
      <div class="nb-timeline-time">Jan 15, 2026</div>
      <div class="nb-timeline-body">Initial planning and scope.</div>
    </div>
  </div>
</div>

<!-- Horizontal timeline -->
<div class="nb-timeline nb-timeline-horizontal">
  <div class="nb-timeline-item">
    <div class="nb-timeline-marker nb-timeline-marker-secondary"></div>
    <div class="nb-timeline-content">
      <div class="nb-timeline-title">Research</div>
      <div class="nb-timeline-time">Week 1</div>
    </div>
  </div>
</div>

<!-- Dashed alternate timeline -->
<div class="nb-timeline nb-timeline-dashed nb-timeline-alternate">
  <div class="nb-timeline-item">
    <div class="nb-timeline-marker nb-timeline-marker-info"></div>
    <div class="nb-timeline-content">
      <div class="nb-timeline-title">Discovery</div>
      <div class="nb-timeline-body">Interviews and audits.</div>
    </div>
  </div>
</div>
```

#### Rules
- Always include the base class `nb-timeline`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
