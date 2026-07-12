---
name: neo-brutal-ui-colors
description: Mandatory color and theme usage rules for Neo-Brutal UI
---

## Neo-Brutal UI colors

### Semantic color tokens

Neo-Brutal UI exposes these semantic tokens. They change value based on the active `data-theme`.

- `base-100`: default surface background
- `base-200`: slightly darker surface for elevation
- `base-300`: darker surface for further elevation
- `base-content`: primary text color on base surfaces
- `base-content-muted`: secondary/muted text color
- `neutral`: neutral surface/background
- `neutral-content`: text color on neutral surfaces
- `primary`: primary brand color
- `primary-content`: text color on primary surfaces
- `secondary`: secondary brand color
- `secondary-content`: text color on secondary surfaces
- `accent`: accent color
- `accent-content`: text color on accent surfaces
- `info`: informative color
- `info-content`: text color on info surfaces
- `success`: success color
- `success-content`: text color on success surfaces
- `warning`: warning color
- `warning-content`: text color on warning surfaces
- `error`: error/danger color
- `error-content`: text color on error surfaces
- `border`: default border color
- `focus`: focus ring color
- `overlay`: backdrop/overlay color

### Color rules

1. Prefer Neo-Brutal UI semantic color tokens over raw Tailwind colors so themes can change consistently.
2. In markup, color tokens are consumed through component classes (e.g. `nb-btn-primary`), not through arbitrary `bg-*` utilities.
3. `*-content` tokens are chosen to maintain contrast on their matching background tokens. Pair them together.
4. Do not hard-code hex or OKLCH values in markup.
5. Avoid `dark:` Tailwind prefixes; use `data-theme="neo-brutal-dark"` or another built-in dark theme instead.
6. Use `base-*` colors for the majority of the page. Use `primary` only for the most important action on the page.

### Themes

Activate a theme by placing `data-theme` on an ancestor:

```html
<html data-theme="neo-brutal">
  ...
</html>
```

Built-in themes:

- `neo-brutal`
- `neo-brutal-dark`
- `emerald`
- `emerald-dark`

Multiple themes can be nested on the same page:

```html
<body data-theme="neo-brutal">
  <section data-theme="emerald">
    <!-- emerald-themed content -->
  </section>
</body>
```

### Custom themes

Advanced users can author a custom theme by defining the same semantic tokens under a new `data-theme` selector. Refer to the theme generator documentation for tooling that validates contrast and gamut mapping.
