# Neo-Brutal UI Showcase

A static preview site for the Neo-Brutal UI component library.

## Quick start

```bash
# From the monorepo root
pnpm install
pnpm --filter @neo-brutal-ui/showcase dev
```

## Build

```bash
pnpm --filter @neo-brutal-ui/showcase build
pnpm --filter @neo-brutal-ui/showcase preview
```

## Key files

- `src/data/components.ts` — component catalog and status counts.
- `src/data/site.ts` — site metadata, package name, and links.
- `src/components/showcase/` — page sections.
- `src/components/demos/` — live CSS component previews.
- `src/scripts/` — minimal native JS for filtering and copy-to-clipboard.

## Notes

- The site uses `@neo-brutal-ui/core` workspace CSS via a relative import.
- Component statuses are data-driven and reflect the actual library progress.
- The npm package name shown on the site is provisional.
