---
"@neo-brutal-ui/interactions": minor
"@neo-brutal-ui/core": patch
---

Promote Calendar to `ready` and add the `createCalendar()` interaction module.

- Added `packages/interactions/src/calendar.ts` with `createCalendar()` factory for standalone month calendars.
- Exported `./calendar` subpath from `@neo-brutal-ui/interactions`.
- Wired `createCalendar()` into `CalendarDemo.astro`; the demo now uses dynamically generated grids with month navigation and selection.
- Added behavior tests covering month navigation, single/range selection, min/max disabled dates, and keyboard navigation.
- Updated `apps/showcase/src/data/components.ts` to mark Calendar as `ready` and `interactive: true`.
- Updated `docs/components/api/calendar.md` to `Ready` status and documented the JS initialization contract.
