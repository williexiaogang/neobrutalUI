# @neo-brutal-ui/theme-neo-brutal

Default Neo-Brutal theme entry for Neo-Brutal UI. It imports the core CSS package and exposes the standard `neo-brutal` and `neo-brutal-dark` theme roots.

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

Switch to the dark theme by changing the `data-theme` value:

```html
<main data-theme="neo-brutal-dark">
  <button class="nb-btn nb-btn-primary">Dark theme</button>
</main>
```

## Entry Points

```css
@import "@neo-brutal-ui/theme-neo-brutal/css";
@import "@neo-brutal-ui/theme-neo-brutal/tokens";
```

The theme package depends on `@neo-brutal-ui/core`; the published CSS entry imports `@neo-brutal-ui/core/css`.

