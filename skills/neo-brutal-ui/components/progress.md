### progress
Base linear progress class for `<progress>` elements.

[Progress docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/progress.md)

#### Class names
- component: `nb-progress`
- component / part: `nb-progress-track`
- part: `nb-progress-fill`, `nb-progress-circular-track`, `nb-progress-circular-fill`, `nb-progress-circular-label`
- behavior: `nb-progress-indeterminate`
- style: `nb-progress-striped`
- color: `nb-progress-primary`, `nb-progress-success`, `nb-progress-warning`, `nb-progress-error`, `nb-progress-neutral`, `nb-progress-info`
- size: `nb-progress-sm`, `nb-progress-lg`

#### Syntax

```html
<!-- Native linear progress -->
<progress class="nb-progress nb-progress-success" value="75" max="100">75%</progress>

<!-- Div-based striped fill -->
<div class="nb-progress-track nb-progress-striped" role="progressbar" aria-label="Upload progress" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
  <div class="nb-progress-fill nb-progress-success" style="width: 75%;"></div>
</div>

<!-- Indeterminate -->
<div class="nb-progress-track nb-progress-indeterminate" role="progressbar" aria-label="Loading preview">
  <div class="nb-progress-fill nb-progress-primary"></div>
</div>

<!-- Circular with label -->
<div class="nb-progress-circular nb-progress-success" role="progressbar" aria-label="Disk usage" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
  <div class="nb-progress-circular-label">75%</div>
  <svg viewBox="0 0 36 36">
    <circle class="nb-progress-circular-track" cx="18" cy="18" r="15"></circle>
    <circle class="nb-progress-circular-fill" cx="18" cy="18" r="15"
            stroke-dasharray="94.2" stroke-dashoffset="23.55"></circle>
  </svg>
</div>
```

#### Rules
- Always include the base class `nb-progress`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
