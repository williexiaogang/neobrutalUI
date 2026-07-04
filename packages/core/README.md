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

