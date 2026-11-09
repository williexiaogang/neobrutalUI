# @neo-brutal-ui/interactions

## 1.0.1

### Patch Changes

- cc50af3: Support native-button menu markup, keep command palette selection states valid, and remove unsupported dialog expansion attributes.
- Updated dependencies [cc50af3]
- Updated dependencies [38ec673]
  - @neo-brutal-ui/core@1.0.1

## 1.0.0

### Minor Changes

- 3fa66d1: Promote Calendar to `ready` and add the `createCalendar()` interaction module.

  - Added `packages/interactions/src/calendar.ts` with `createCalendar()` factory for standalone month calendars.
  - Exported `./calendar` subpath from `@neo-brutal-ui/interactions`.
  - Wired `createCalendar()` into `CalendarDemo.astro`; the demo now uses dynamically generated grids with month navigation and selection.
  - Added behavior tests covering month navigation, single/range selection, min/max disabled dates, and keyboard navigation.
  - Updated `apps/showcase/src/data/components.ts` to mark Calendar as `ready` and `interactive: true`.
  - Updated `docs/components/api/calendar.md` to `Ready` status and documented the JS initialization contract.

- 29510c6: Promote Navbar to `ready` and add the `createNavbar()` interaction module.

  - Added `packages/interactions/src/navbar.ts` with `createNavbar()` factory for mobile collapse toggles.
  - Exported `./navbar` subpath from `@neo-brutal-ui/interactions`.
  - Wired `createNavbar()` into `NavbarDemo.astro` so the hamburger button now toggles the collapse menu.
  - Added behavior tests covering click/keyboard toggle, Escape close, markup initialization, and cleanup.
  - Updated `apps/showcase/src/data/components.ts` to mark Navbar as `ready` and `interactive: true`.
  - Updated `docs/components/api/navbar.md` to `Ready` status and documented the JS initialization contract.

- dfa114e: Promote twenty components to `ready` status: Accordion, Avatar, Badge, Button, Button Group, Card, Carousel, Checkbox, Collapse, Drawer, Dropdown, Kbd, Link, Menu, Modal, Progress, Rating, Tabs, Toast, and Tooltip.

  These components now pass the Ready acceptance gates:
  - API docs match the current CSS and behavior
  - All documented variants, sizes, and states are implemented
  - Showcase demos wire the corresponding interaction modules where applicable
  - Keyboard navigation, focus order, and ARIA attributes are implemented
  - RTL layout verified via Playwright structural checks
  - Responsive behavior verified down to 320px viewport
  - Unit/visual tests cover core behavior

  Additionally, the Tabs, Toast, Menu, Rating, and Carousel showcase demos initialize their JS modules (`createTabs`, `createToastManager`, `createMenu`, `createRating`, and `createCarousel`), satisfying the interactive demo wiring gate. Badge now includes the removable tag control pattern in CSS, demo, and API docs. Progress now documents the native, custom linear, and circular ARIA contracts and splits dense demos into focused examples. Avatar, Button Group, Kbd, and Link now have ready status with documented semantics, ARIA guidance, reduced-motion applicability, and forced-colors coverage.

### Patch Changes

- Updated dependencies [3fa66d1]
- Updated dependencies [a615eb6]
- Updated dependencies [5a1b51f]
- Updated dependencies [29510c6]
- Updated dependencies [198cb26]
- Updated dependencies [d14238d]
- Updated dependencies [c13e07e]
- Updated dependencies [2620988]
- Updated dependencies [f6ae9fb]
- Updated dependencies [3d027b9]
- Updated dependencies [60af10b]
- Updated dependencies [b9b3845]
- Updated dependencies [dfa114e]
- Updated dependencies [edfdb36]
  - @neo-brutal-ui/core@1.0.0

## 0.0.2

### Patch Changes

- 810d09c: Prepare packages for npm release with public publish metadata, scoped install examples, package README files, and tarball smoke checks.
- Updated dependencies [810d09c]
  - @neo-brutal-ui/core@0.0.2
