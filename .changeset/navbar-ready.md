---
"@neo-brutal-ui/interactions": minor
"@neo-brutal-ui/core": patch
---

Promote Navbar to `ready` and add the `createNavbar()` interaction module.

- Added `packages/interactions/src/navbar.ts` with `createNavbar()` factory for mobile collapse toggles.
- Exported `./navbar` subpath from `@neo-brutal-ui/interactions`.
- Wired `createNavbar()` into `NavbarDemo.astro` so the hamburger button now toggles the collapse menu.
- Added behavior tests covering click/keyboard toggle, Escape close, markup initialization, and cleanup.
- Updated `apps/showcase/src/data/components.ts` to mark Navbar as `ready` and `interactive: true`.
- Updated `docs/components/api/navbar.md` to `Ready` status and documented the JS initialization contract.
