### table
Base table class. Required on the `<table>` element.

[Table docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/table.md)

#### Class names
- component: `nb-table`
- style: `nb-table-zebra`, `nb-table-compact`
- modifier: `nb-table-wrapper`
- behavior: `nb-table-empty`

#### Syntax

```html
<!-- Basic table -->
<table class="nb-table">...</table>

<!-- Zebra table inside responsive wrapper -->
<div class="nb-table-wrapper">
  <table class="nb-table nb-table-zebra">...</table>
</div>

<!-- Compact table -->
<div class="nb-table-wrapper">
  <table class="nb-table nb-table-compact">...</table>
</div>
```

#### Rules
- Always include the base class `nb-table`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
