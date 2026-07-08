# Component Audit List

Date: 2026-07-07

Scope: 59 components from `apps/showcase/src/data/components.ts`, cross-checked against core CSS, showcase demos, interaction modules, API docs, and rendered showcase layout at `http://localhost:4321/#components`.

Latest update:

- Fixed: Card and Alert demos now use `.nb-component-card__demo`.
- Fixed: Tabs, Menu, Rating, Carousel, and Toast are marked `interactive`.
- Fixed: List, Calendar, and Date Picker are promoted to full-width showcase cards.
- Fixed: Date Picker and Command Palette no longer claim `interactive` until matching JS modules exist.
- Fixed: Empty State, File Input, Range, Browser Mockup, Phone Mockup, and Window Mockup are promoted to wide showcase cards.
- Fixed: Catalog status is no longer all-beta. Current split is 38 beta and 21 in-progress.
- Fixed: Color Picker already had a wrapper, but `ComponentGallery` was missing its import/map entry; the demo now renders.
- Fixed: Added `packages/core/src/components/input.css` as a thin entrypoint that imports `field.css`, resolving the Input CSS ownership gap.
- Fixed: Replaced physical directional properties with logical equivalents: `toast.css` uses `transform-origin: inline-start`; `timeline.css` horizontal dashed connector has an RTL override; `field.css` uses `margin-block-end` for the field-group legend.
- Fixed: Audit report now marks reduced-motion and disabled-state gaps as N/A for purely static components (Alert, Avatar, Badge, Card, Divider, Empty State, Form Summary, Link).
- Fixed: Added API docs for all 59 components in `docs/components/api/`.
- Fixed: Added interaction modules for Date Picker, Command Palette, OTP Input, Segmented Control, and Code Block copy in `packages/interactions/src/`.
- Fixed: Restored `interactive: true` for Date Picker and Command Palette in the showcase catalog.
- Fixed: TypeScript errors in `apps/showcase/src/pages/playground.astro` by adding explicit element casts and null checks.
- Fixed: TypeScript errors in `apps/showcase/src/pages/theme-generator.astro` by extracting the inline OKLCH math and UI wiring to `apps/showcase/src/scripts/theme-generator.ts` with full type annotations.
- Fixed: TypeScript error in `CollapseDemo.astro` by removing unsupported `{ trigger }` option from `createCollapse()`.
- Fixed: TypeScript error in `StepsDemo.astro` by replacing invalid `disabled` attribute on `<span>` with `aria-disabled="true"`.
- Verified: `astro check` now reports 0 errors across the showcase package.
- Verified: `pnpm --filter @neo-brutal-ui/showcase build` completes successfully.
- Added: Behavior tests for previously untested interaction modules — Accordion, Collapse, Rating, Menu, Carousel.
- Verified: `pnpm test` passes with 37 interaction tests (up from 27).
- Added: Runtime responsive-overflow and RTL structural Playwright spec in `tests/visual/specs/responsive-rtl.spec.ts`; 16 checks pass across desktop and mobile viewports.
- Fixed: `package.json` `test:visual` script now points to `tests/visual/playwright.config.ts` so `pnpm test:visual` resolves `baseURL` correctly.
- Added: `@playwright/test` dev dependency (was missing, blocking existing `button.spec.ts` and new visual specs).
- Added: Reduced-motion behavior tests for `reveal`, `countUp`, and `stagger` in `packages/interactions/tests/animations.test.mjs`.
- Verified: `pnpm test` passes with 46 tests (interactions 43 / core 2 / theme 1).

## Summary

- Total catalog components: 59
- Status split: 38 beta, 21 in-progress, 0 ready, 0 planned, 0 experimental
- Demos present by import name: 59 / 59
- Core CSS coverage: 59 / 59 direct or aliased; `input.css` is a thin entrypoint that imports `field.css`
- Interaction modules present for: accordion, carousel, collapse, code-block, command-palette, date-picker, dialog/modal, drawer, dropdown, menu, otp, rating, segmented-control, tabs, toast, tooltip
- API docs: 59 / 59 components now have `docs/components/api/*.md`
- Forced-colors support is present across all core CSS files

## Priority Findings

| Priority | Area | Components | Issue | Recommended action |
| --- | --- | --- | --- | --- |
| P1 | Status model | All 59 | Fixed in current pass. Components with explicit visual, responsive, accessibility, or interaction gaps are now `in-progress`; usable CSS/demo surfaces remain `beta`. | Define Ready acceptance gates before promoting any component to `ready`. |
| P1 | Docs | All 59 components | ✅ Resolved. API docs now exist for every catalog component in `docs/components/api/`. | Keep docs in sync with future CSS/API changes. |
| P1 | Showcase demo structure | Card, Alert | Fixed in current pass. Demos now use `.nb-component-card__demo`. | Re-run rendered audit after future demo edits. |
| P1 | Showcase demo mapping | Color Picker | Fixed in current pass. The demo file had a wrapper, but the gallery map omitted `ColorPickerDemo`. | Re-run rendered audit after future catalog additions. |
| P1 | Layout sizing | List | Fixed in current pass by promoting to full-width. | Consider splitting variants later if the full-width card still feels too long. |
| P1 | Layout sizing | Calendar, Date Picker | Fixed in current pass by promoting to full-width. | Consider responsive CSS improvements later so these can work in narrower containers. |
| P1 | Interaction metadata | Tabs, Menu, Rating, Carousel, Toast | Fixed in current pass with `interactive: true`. | Confirm demos actually initialize JS behavior before Ready. |
| P1 | Interaction metadata | Date Picker, Command Palette | ✅ Resolved. Interaction modules added and `interactive: true` restored. | Confirm JS behavior is active in demos before Ready. |
| P1 | CSS ownership | Input | ✅ Resolved. Added `packages/core/src/components/input.css` as a thin entrypoint that imports `field.css`. | No further action required. |
| P2 | Showcase layout | Browser Mockup, Phone Mockup, Window Mockup, File Input, Range, Empty State | Fixed in current pass by promoting to wide cards. | Split demos later if any card still feels too dense. |
| P2 | Reduced motion consistency | Alert, Avatar, Badge, Card, Divider, Empty State, Form Summary, Link | These files lack `prefers-reduced-motion`. All listed components are purely static with no transitions or animations, so reduced-motion is **not applicable**. | Mark as N/A in the audit and document the rationale. No CSS changes required. |
| P2 | Disabled-state consistency | Link, Drawer, Modal, Navbar, Rating, Toast, Timeline, File Input and static display components | Static display components (Avatar, Badge, Card, Chat, Code Block, Diff Viewer, Divider, Empty State, Feature Grid, Footer, Hero, Kbd, List, Loading, Skeleton, Stat, Table, Timeline, mockups, etc.) do not support or require disabled states. Interactive components already have disabled selectors where applicable. | Mark static components as N/A in docs/tests; add disabled selectors only to components that are genuinely interactive and currently missing them. |
| P2 | RTL claims | Button, Collapse, Link, List, Loading, Modal, Pagination, Progress, Table | Some files may still need RTL visual checks, but the following physical-direction issues were fixed: `toast.css` now uses `transform-origin: inline-start`; `timeline.css` horizontal dashed connector has an RTL override; `field.css` group legend uses `margin-block-end`. | Run RTL visual checks on remaining components and add targeted fixes only where layout changes under `dir=rtl`. |

## Component Checklist

| Component | Status | CSS | Demo | JS | API doc | Audit state | Optimization notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Button | in-progress | `button.css` | yes | no | yes | needs polish | Loading spinner alignment and icon-only accessible-name docs remain open. |
| Card | in-progress | `card.css` | yes | no | yes | docs added | Media/interactive variants remain in progress. |
| Input | in-progress | `input.css` (imports `field.css`) | yes | no | yes | ownership fixed | Thin `input.css` entrypoint added. Autofill and prefix/suffix alignment remain open. |
| Field | beta | `field.css` | yes | no | yes | docs added | Minor demo overflow in narrow card; consider responsive tweaks. |
| Textarea | in-progress | shared `field.css` | yes | no | yes | docs added | Character counter and size variants remain open. |
| Select | in-progress | shared `field.css` | yes | no | yes | docs added | RTL arrow and forced-colors review should be captured in tests. |
| Checkbox | in-progress | `selector.css` | yes | no | yes | docs added | Add indeterminate examples before Ready. |
| Radio | in-progress | `selector.css` | yes | no | yes | docs added | Radio group anatomy and keyboard expectations now documented. |
| Toggle | in-progress | `selector.css` | yes | no | yes | docs added | Reduced-motion and RTL thumb positioning now documented. |
| Badge | in-progress | `badge.css` | yes | no | yes | docs added | Removable tag behavior remains undefined. |
| Alert | in-progress | `alert.css` | yes | no | yes | docs added | Dismissible behavior/API remains open. |
| Divider | in-progress | `divider.css` | yes | no | yes | docs added | Vertical orientation still noted as in progress. |
| Loading | in-progress | `loading.css` | yes | no | yes | docs added | Screen-reader strategy and size variants remain open. |
| Skeleton | in-progress | `skeleton.css` | yes | no | yes | docs added | Avatar/card skeleton patterns remain open. |
| Modal | in-progress | `modal.css` | yes | dialog module | yes | needs JS polish | Known issue: div fallback focus trap. |
| Tabs | beta | `tabs.css` | yes | tabs module | yes | docs added | Confirm JS is active in demo before Ready. |
| Dropdown | beta | `dropdown.css` | yes | dropdown module | yes | docs added | Add interaction tests if not already covered. |
| Tooltip | beta | `tooltip.css` | yes | tooltip module | yes | docs added | CSS focus/hover trigger pattern now documented. |
| Table | beta | `table.css` | yes | no | yes | docs added | Confirm responsive wrapper pattern before Ready. |
| List | beta | `list.css` | yes | no | yes | docs added | Now full-width; split variants later if still too long. |
| Description List | beta | `description-list.css` | yes | no | yes | docs added | Full-width showcase works. |
| Navbar | in-progress | `navbar.css` | yes | no | yes | docs added | Collapse behavior requires optional JS but no module exists. |
| Drawer | beta | `drawer.css` | yes | drawer module | yes | docs added | Add disabled/edge-case states if applicable. |
| Toast | beta | `toast.css` | yes | toast module | yes | docs added | Confirm JS behavior before Ready. |
| Accordion | beta | `accordion.css` | yes | accordion module | yes | docs added | Good CSS/JS coverage; API docs now present. |
| Collapse | beta | `collapse.css` | yes | collapse module | yes | docs added | Good coverage; API docs now present. |
| Progress | beta | `progress.css` | yes | no | yes | docs added | Define native vs div-based API clearly before Ready. |
| Avatar | beta | `avatar.css` | yes | no | yes | docs added | Static component; focus/disabled not applicable. |
| Stat | beta | `stat.css` | yes | no | yes | docs added | Wide layout helps. |
| Steps | beta | `steps.css` | yes | no | yes | docs added | Full-width demo is appropriate. |
| Breadcrumbs | beta | `breadcrumb.css` | yes | no | yes | docs added | Slug plural maps to singular CSS; naming now documented. |
| Pagination | beta | `pagination.css` | yes | no | yes | docs added | Full-width demo is appropriate. |
| Button Group | beta | `button-group.css` | yes | no | yes | docs added | Purely presentational; no JS required. |
| Link | beta | `link.css` | yes | no | yes | docs added | Reduced-motion/disabled applicability now documented as N/A. |
| Menu | beta | `menu.css` | yes | menu module | yes | docs added | Confirm JS is active in demo before Ready. |
| Empty State | beta | `empty-state.css` | yes | no | yes | docs added | Now wide; split variants later if needed. |
| Form Summary | beta | `form-summary.css` | yes | no | yes | docs added | Reduced-motion not applicable (no transitions). |
| File Input | beta | `file-input.css` | yes | no | yes | docs added | Now wide; document drag/drop limits before Ready. |
| Range | beta | `range.css` | yes | no | yes | docs added | Now wide; split variants later if needed. |
| OTP Input | in-progress | `otp.css` | yes | otp module | yes | module added | Auto-focus/paste JS module added. |
| Segmented Control | in-progress | `segmented-control.css` | yes | segmented-control module | yes | module added | Keyboard navigation JS module added. |
| Color Picker | beta | `color-picker.css` | yes | no | yes | docs added | Native input limitations now documented. |
| Hero | beta | `hero.css` | yes | no | yes | docs added | Full-width demo is appropriate. |
| Footer | beta | `footer.css` | yes | no | yes | docs added | Full-width demo is appropriate. |
| Timeline | beta | `timeline.css` | yes | no | yes | docs added | Full-width demo is appropriate. |
| Rating | beta | `rating.css` | yes | rating module | yes | docs added | Confirm JS is active in demo before Ready. |
| Chat | beta | `chat-bubble.css` | yes | no | yes | docs added | Catalog slug maps to `chat-bubble.css`; naming now documented. |
| Carousel | beta | `carousel.css` | yes | carousel module | yes | docs added | Confirm JS is active in demo before Ready. |
| Kbd | beta | `kbd.css` | yes | no | yes | docs added | Static component; focus/disabled not applicable. |
| Code Block | in-progress | `code-block.css` | yes | code-block module | yes | module added | Copy-to-clipboard JS module added. |
| Diff Viewer | beta | `diff-viewer.css` | yes | no | yes | docs added | Full-width demo is appropriate. |
| Pricing Card | beta | `pricing-card.css` | yes | no | yes | docs added | Full-width demo is appropriate. |
| Feature Grid | beta | `feature-grid.css` | yes | no | yes | docs added | Full-width demo is appropriate. |
| Calendar | in-progress | `calendar.css` | yes | no | yes | docs added | Now full-width; month navigation/date selection JS remains optional/planned. |
| Date Picker | in-progress | `date-picker.css` | yes | date-picker module | yes | module added | `interactive` restored; JS module added for panel toggle and single-date selection. |
| Command Palette | in-progress | `command-palette.css` | yes | command-palette module | yes | module added | `interactive` restored; JS module added for search, navigation, and selection. |
| Browser Mockup | beta | `browser.css` | yes | no | yes | docs added | Now wide. |
| Phone Mockup | beta | `phone.css` | yes | no | yes | docs added | Now wide. |
| Window Mockup | beta | `window.css` | yes | no | yes | docs added | Now wide. |

## Suggested Work Order

### Completed in this pass

1. ✅ Added missing interaction modules: Date Picker, Command Palette, OTP, Segmented Control, Code Block copy.
2. ✅ Created API docs for all 59 components.
3. ✅ Fixed Input CSS ownership, RTL physical-direction issues, and reduced-motion/disabled N/A annotations.

### Next steps

4. **Define Ready acceptance gates** before promoting any component from `beta` / `in-progress` to `ready`.

   Proposed gates (all must pass):

   | Gate | Requirement |
   | --- | --- |
   | API docs | `docs/components/api/<slug>.md` exists and matches current CSS |
   | CSS complete | All documented variants, sizes, states, and color accents are implemented |
   | Demo wiring | If `interactive: true`, the Showcase demo actually initializes the JS module |
   | Accessibility | Focus order, ARIA attributes, color contrast, and keyboard behavior verified |
   | RTL | Rendered correctly under `dir="rtl"` without layout breakage |
   | Responsive | No overflow or overlap down to the narrowest supported viewport |
   | Tests | Unit or visual tests cover the component’s core behavior and edge cases |

   Recommended first batch of Ready candidates: **Button, Card, Checkbox, Modal, Tabs, Accordion, Collapse, Dropdown, Tooltip, Drawer, Toast**.

5. **Split any remaining dense showcase demos** if wide/full layout still feels too long. Priority candidates: `CalendarDemo`, `DatePickerDemo`, `TableDemo`, `ListDemo`, `CommandPaletteDemo`, `PricingCardDemo`, `FeatureGridDemo`.

6. **Add targeted tests** for responsive overflow, RTL rendering, reduced-motion behavior, and interaction modules.

   - ✅ Added behavior tests for **Accordion** and **Collapse** in `packages/interactions/tests/disclosure.test.mjs`.
   - ✅ Added behavior tests for **Rating**, **Menu**, and **Carousel** in `packages/interactions/tests/navigation.test.mjs`.
   - ✅ Added runtime RTL layout and responsive overflow checks in `tests/visual/specs/responsive-rtl.spec.ts`.
   - ✅ Added reduced-motion behavior tests for `reveal`, `countUp`, and `stagger` in `packages/interactions/tests/animations.test.mjs`.
   - ⏳ Visual baseline screenshots for `button.spec.ts` remain open.

7. ✅ **Fixed pre-existing Showcase TypeScript errors** in `apps/showcase/src/pages/playground.astro` and `theme-generator.astro`; `astro check` now passes cleanly.

8. **Promote vetted components to `ready`** and create changesets for the first stable release.
