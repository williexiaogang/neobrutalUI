# @neo-brutal-ui/core

Core CSS for Neo-Brutal UI. It provides the design tokens, base reset, component classes, and utilities used by the rest of the package family.

## Install

```sh
npm install @neo-brutal-ui/core tailwindcss
```

Neo-Brutal UI targets Tailwind CSS v4+ and modern CSS import pipelines.

## Usage

Import the complete CSS entry in your app stylesheet:

```css
@import "@neo-brutal-ui/core/css";
```

Use the component classes in your markup:

```html
<div data-theme="neo-brutal">
  <button class="nb-btn nb-btn-primary">Create project</button>
</div>
```

Compact density keeps the same classes and tightens padding, gaps, and shadow offsets for small screens. Targets stay at least 24px (44px on a coarse pointer) and body text stays at least 14px:

```html
<main data-nb-density="compact">
  <button class="nb-btn nb-btn-primary">Save</button>
</main>
```

`class="nb-compact"` on one component does the same thing for that subtree. See `docs/guides/compact-density.md`.

Dark mode is selected with a theme root:

```html
<div data-theme="neo-brutal-dark">
  <button class="nb-btn nb-btn-primary">Dark action</button>
</div>
```

## CSS Entry Points

```css
@import "@neo-brutal-ui/core/css";
@import "@neo-brutal-ui/core/tokens";
@import "@neo-brutal-ui/core/base";
@import "@neo-brutal-ui/core/components";
@import "@neo-brutal-ui/core/utilities";
```

Use `@neo-brutal-ui/core/css` for the normal full import. The split entry points are available for advanced builds that want finer CSS layering.

