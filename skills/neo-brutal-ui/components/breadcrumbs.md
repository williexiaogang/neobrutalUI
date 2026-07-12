### breadcrumbs
Outer breadcrumb wrapper. Required.

[Breadcrumbs docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/breadcrumbs.md)

#### Class names
- component: `nb-breadcrumb`
- part: `nb-breadcrumb-item`, `nb-breadcrumb-link`, `nb-breadcrumb-separator`, `nb-breadcrumb-separator-wrap`
- behavior: `nb-breadcrumb-current`
- style: `nb-breadcrumb-collapsed`

#### Syntax

```html
<!-- Standard breadcrumb -->
<nav aria-label="Breadcrumb" class="nb-breadcrumb">
  <ol class="nb-breadcrumb-list">
    <li class="nb-breadcrumb-item">
      <a href="#" class="nb-breadcrumb-link">Home</a>
      <span class="nb-breadcrumb-separator" aria-hidden="true">/</span>
    </li>
    <li class="nb-breadcrumb-item">
      <a href="#" class="nb-breadcrumb-link">Products</a>
      <span class="nb-breadcrumb-separator" aria-hidden="true">/</span>
    </li>
    <li class="nb-breadcrumb-item">
      <span class="nb-breadcrumb-current" aria-current="page">Laptops</span>
    </li>
  </ol>
</nav>

<!-- Collapsed breadcrumb (mobile) -->
<nav aria-label="Breadcrumb" class="nb-breadcrumb nb-breadcrumb-collapsed">
  <ol class="nb-breadcrumb-list">
    <li class="nb-breadcrumb-item">
      <a href="#" class="nb-breadcrumb-link">Home</a>
    </li>
    <li class="nb-breadcrumb-item nb-breadcrumb-separator-wrap">
      <span class="nb-breadcrumb-separator" aria-hidden="true">/</span>
    </li>
    <li class="nb-breadcrumb-item">
      <a href="#" class="nb-breadcrumb-link">Products</a>
    </li>
    <li class="nb-breadcrumb-item nb-breadcrumb-separator-wrap">
      <span class="nb-breadcrumb-separator" aria-hidden="true">/</span>
    </li>
    <li class="nb-breadcrumb-item">
      <span class="nb-breadcrumb-current" aria-current="page">Laptops</span>
    </li>
  </ol>
</nav>
```

#### Rules
- Always include the base class `nb-breadcrumb`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
