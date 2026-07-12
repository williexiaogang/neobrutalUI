# Neo-Brutal UI

Neo-Brutal UI is a bold, accessible component library for Tailwind CSS v4 and modern CSS pipelines. The core package is CSS-first and framework-agnostic; optional JavaScript interactions are published separately so apps can import only what they need.

**59 CSS components** and **18 JS interactions** — zero runtime, fully themeable, and built for modern browsers.

## Packages

| Package | Purpose |
| --- | --- |
| `@neo-brutal-ui/core` | Core CSS tokens, reset, components, and utilities. |
| `@neo-brutal-ui/theme-neo-brutal` | Default theme entry for `neo-brutal`, `neo-brutal-dark`, and `emerald`. |
| `@neo-brutal-ui/interactions` | Optional native JavaScript interactions. |

## Install

Install the core CSS, default theme, and optional interactions:

```sh
npm install @neo-brutal-ui/core @neo-brutal-ui/theme-neo-brutal @neo-brutal-ui/interactions tailwindcss
```

Or with **pnpm** (recommended):

```sh
pnpm add @neo-brutal-ui/core @neo-brutal-ui/theme-neo-brutal @neo-brutal-ui/interactions tailwindcss
```

Or with **yarn**:

```sh
yarn add @neo-brutal-ui/core @neo-brutal-ui/theme-neo-brutal @neo-brutal-ui/interactions tailwindcss
```

> **Requirements**: Node.js 20+ and Tailwind CSS v4+. See [docs/support-policy.md](docs/support-policy.md) for full browser support details.

## Usage

Import the default theme from your app stylesheet:

```css
@import "@neo-brutal-ui/theme-neo-brutal/css";
```

Use Neo-Brutal UI classes in your markup:

```html
<main data-theme="neo-brutal">
  <button class="nb-btn nb-btn-primary">Create project</button>
</main>
```

Switch to the dark theme with `data-theme`:

```html
<main data-theme="neo-brutal-dark">
  <button class="nb-btn nb-btn-primary">Dark action</button>
</main>
```

Use the built-in `emerald` theme:

```html
<main data-theme="emerald">
  <button class="nb-btn nb-btn-primary">Emerald action</button>
</main>
```

Import optional interactions by subpath:

```js
import { createDialog } from "@neo-brutal-ui/interactions/dialog";

const dialog = document.querySelector("dialog");
const instance = createDialog(dialog);

document.querySelector("[data-open-dialog]").addEventListener("click", () => {
  instance.open();
});
```

## CSS Entry Points

```css
@import "@neo-brutal-ui/core/css";
@import "@neo-brutal-ui/core/tokens";
@import "@neo-brutal-ui/core/base";
@import "@neo-brutal-ui/core/components";
@import "@neo-brutal-ui/core/utilities";
@import "@neo-brutal-ui/theme-neo-brutal/css";
```

Use `@neo-brutal-ui/theme-neo-brutal/css` for the normal themed import. Use the split core entry points only when an advanced build needs finer CSS control.

## Quick Start

### 1. Import the CSS

```css
@import "tailwindcss";
@import "@neo-brutal-ui/theme-neo-brutal/css";
```

### 2. Wrap your app in a theme container

```html
<html data-theme="neo-brutal">
  <body>
    <button class="nb-btn nb-btn-primary">Get started</button>
    <div class="nb-card">
      <div class="nb-card-header">Hello</div>
      <div class="nb-card-body">Neo-Brutal UI is ready.</div>
    </div>
  </body>
</html>
```

### 3. Optional: add a theme toggle

```js
function toggleTheme() {
  const html = document.documentElement;
  const themes = ["neo-brutal", "neo-brutal-dark", "emerald", "emerald-dark"];
  const current = html.getAttribute("data-theme") || "neo-brutal";
  const next = themes[(themes.indexOf(current) + 1) % themes.length];
  html.setAttribute("data-theme", next);
  localStorage.setItem("nb-theme", next);
}

// Restore on load
const saved = localStorage.getItem("nb-theme");
if (saved) document.documentElement.setAttribute("data-theme", saved);
```

## Integration Guides

Step-by-step guides for popular frameworks and build tools:

| Guide | Framework | Tailwind |
|---|---|---|
| [Vite](docs/guides/vite.md) | Vite (vanilla, React, Vue, etc.) | v4+ |
| [React](docs/guides/react.md) | React 18+ | v4+ |
| [Vue](docs/guides/vue.md) | Vue 3 / Nuxt | v4+ |
| [Next.js](docs/guides/nextjs.md) | Next.js 14+ (App & Pages Router) | v4+ |
| [Astro](docs/guides/astro.md) | Astro 4+ | v4+ |
| [Pure CSS](docs/guides/pure-css.md) | Any (no framework) | — |
| [Tailwind mix](docs/guides/tailwind-mix.md) | Any (with existing Tailwind utilities) | v4+ |
| [Coexisting with daisyUI](docs/guides/daisyui-coexist.md) | Any (migration or hybrid) | v4+ |

## Component Documentation

Every component follows a standardized documentation template: [docs/templates/component-doc.md](docs/templates/component-doc.md). The template covers purpose, class names, DOM contract, variants, sizes, state matrix, accessibility, keyboard behavior, RTL, reduced motion, JS enhancement, tokens, common errors, and API stability.

## Interactive Playground

Explore components live in the showcase app:

```sh
pnpm --filter @neo-brutal-ui/showcase dev
```

Then visit `/playground` to toggle themes, RTL, reduced motion, viewport sizes, and customize tokens in real time.

## Development

```sh
pnpm install
pnpm run build
pnpm run lint
pnpm run test
pnpm run test:package
```

Run the showcase locally:

```sh
pnpm --filter @neo-brutal-ui/showcase dev
```

Build the showcase:

```sh
pnpm --filter @neo-brutal-ui/showcase build
```

## Package Smoke Test

`pnpm run test:package` builds the packages, packs local tarballs, installs them into a temporary consumer project, verifies public exports, checks CSS entry points, confirms npm metadata, and fails if package tarballs contain `src/` or source map files.

## Release

This repository uses Changesets. See [docs/release.md](docs/release.md) for the release checklist.

## Support

Neo-Brutal UI targets Tailwind CSS v4+, Node.js 20+, and modern browsers. See [docs/support-policy.md](docs/support-policy.md) for the support policy.

## License

MIT
