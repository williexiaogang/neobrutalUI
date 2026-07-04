# Neo-Brutal UI Showcase — Agent Notes

## Project

This is the preview / showcase site for the Neo-Brutal UI component library.
It is built with Astro and consumes the workspace package `@neo-brutal-ui/core`
for its component styles.

## Development

```bash
# From the workspace root
pnpm --filter @neo-brutal-ui/showcase dev

# Or from this directory
pnpm dev
```

## Build

```bash
pnpm build
pnpm preview
```

## Architecture

- `src/data/components.ts` is the single source of truth for component status.
  Do not hard-code status counts anywhere else.
- `src/data/site.ts` holds site metadata (title, package names, version, links).
- Components in `src/components/showcase/` map to sections on the homepage.
- Demos in `src/components/demos/` render real Neo-Brutal UI CSS classes.
- Interactions live in `src/scripts/` and are loaded only where needed.

## Constraints

- Do not introduce another UI framework (React, Vue, Svelte, etc.).
- Do not fake a component status in the data file.
- Status counts must be computed from `components.ts`.
- Only components with an existing demo file should set `demo` in the data.
- Keep install/import examples in `site.ts` aligned with the publishable package names.
