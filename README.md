# Neo-Brutal UI

Neo-Brutal UI is a bold, accessible component library for Tailwind CSS v4 and modern CSS pipelines. The core package is CSS-first and framework-agnostic; optional JavaScript interactions are published separately so apps can import only what they need.

## Packages

| Package | Purpose |
| --- | --- |
| `@neo-brutal-ui/core` | Core CSS tokens, reset, components, and utilities. |
| `@neo-brutal-ui/theme-neo-brutal` | Default theme entry for `neo-brutal` and `neo-brutal-dark`. |
| `@neo-brutal-ui/interactions` | Optional native JavaScript interactions. |

## Install

```sh
npm install @neo-brutal-ui/core @neo-brutal-ui/theme-neo-brutal @neo-brutal-ui/interactions tailwindcss
```

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
