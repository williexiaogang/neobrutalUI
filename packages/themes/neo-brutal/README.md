# @neo-brutal-ui/theme-neo-brutal

Default Neo-Brutal theme entry for Neo-Brutal UI. It imports the core CSS package and exposes the built-in theme roots: `neo-brutal`, `neo-brutal-dark`, `emerald`, and `emerald-dark`.

> **Note:** Theme token definitions live in `@neo-brutal-ui/core` (`packages/core/src/tokens/`). This package is a convenience entry point that imports the core CSS so consumers can load the theme with a single import.

## Install

```sh
npm install @neo-brutal-ui/core @neo-brutal-ui/theme-neo-brutal tailwindcss
```

## Usage

Import the theme CSS from your app stylesheet:

```css
@import "@neo-brutal-ui/theme-neo-brutal/css";
```

Use a theme root in your markup:

```html
<main data-theme="neo-brutal">
  <button class="nb-btn nb-btn-primary">Light theme</button>
</main>
```

Switch to another built-in theme by changing the `data-theme` value:

```html
<main data-theme="neo-brutal-dark">
  <button class="nb-btn nb-btn-primary">Dark theme</button>
</main>

<main data-theme="emerald">
  <button class="nb-btn nb-btn-primary">Emerald theme</button>
</main>
```

## Entry Points

```css
@import "@neo-brutal-ui/theme-neo-brutal/css";
@import "@neo-brutal-ui/theme-neo-brutal/tokens";
```

The theme package depends on `@neo-brutal-ui/core`; the published CSS entry imports `@neo-brutal-ui/core/css`.

