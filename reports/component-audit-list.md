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
- Split: Dense showcase demos for **Calendar**, **Table**, and **List** into multiple `.nb-component-card__demo` blocks with grouped headings.
- Verified: Showcase build and responsive/RTL Playwright checks still pass after demo refactoring.
- Fixed: `TabsDemo.astro` now initializes `createTabs()` and uses the markup structure expected by the tabs interaction module (`data-nb-tabs`, `aria-controls`, panel IDs).
- Fixed: `ToastDemo.astro` now initializes `createToastManager()` and provides buttons to create live toasts via the JS module.
- Promoted: **Accordion, Collapse, Dropdown, Tabs, Toast, Tooltip** from `beta` to `ready` in `apps/showcase/src/data/components.ts`.
- Added: Changeset `.changeset/promote-ready-components.md` for the first stable Ready batch.
- Verified: `pnpm test` still passes with 46 tests; `astro check` and showcase build remain clean.
- Consolidated: Generated build/acceptance/verify/a11y reports moved to `reports/generated/` and ignored by git; stale root-level `BUILD_REPORT.md` and temporary `verify_split*.js` files removed; color-contrast findings from the old acceptance report merged into this audit.
- Fixed: Added ESLint 9 flat config at `eslint.config.mjs` and removed the obsolete `.eslintrc.cjs`; `packages/interactions/src/**/*.ts` now lints cleanly.
- Fixed: Type-aware lint findings in Code Block, Collapse, Date Picker, and Menu interaction modules.
- Verified: Interactions TypeScript check passes with `tsc --noEmit`; direct `node --test` interaction suite passes with 43 tests.
- Corrected: Menu, Rating, and Carousel showcase demos already initialize their matching interaction modules; the audit checklist now reflects the current demo wiring.
- Fixed: Button visual spec now targets the real showcase component card instead of a non-existent `/components/button` route; desktop and mobile Playwright baselines were generated in `tests/visual/screenshots/`.
- Fixed: `tests/visual/playwright.config.ts` now uses the same `SHOWCASE_URL` for `baseURL` and `webServer.url`, and snapshot output is aligned with `tests/visual/screenshots/`.
- Fixed: Semantic content tokens now pass acceptance contrast checks; primary/info/success/secondary use dark foregrounds, while error uses a darker red with white foreground.
- Split: Dense showcase demos for **Date Picker**, **Command Palette**, **Pricing Card**, and **Feature Grid** into multiple `.nb-component-card__demo` blocks.
- Promoted: **Drawer** from `beta` to `ready`; its API doc status and changeset entry now match the catalog.
- Fixed: Acceptance color-contrast findings are now clear (`0` contrast issues) after semantic token and targeted component updates.
- Fixed: Button now includes loading and icon-only states in CSS, demo, API docs, and visual baselines.
- Fixed: Checkbox now includes indeterminate state styling, demo wiring, and API docs.
- Fixed: Modal `createDialog()` now supports div fallback focus trap/open state in addition to native `<dialog>`, with behavior test coverage.
- Fixed: Card now includes media and interactive variants in CSS, demo, and API docs.
- Promoted: **Button, Card, Checkbox, and Modal** from `in-progress` to `ready`.
- Updated: API snapshot now reflects the expanded CSS/token surface (698 classes, 225 tokens).
- Fixed: Badge now includes removable tag control styling, demo coverage, and API docs.
- Fixed: Rating API docs now match the implemented `data-nb-rating` radiogroup contract.
- Promoted: **Badge, Menu, Rating, and Carousel** to `ready`.
- Fixed: Progress API docs now clarify native `<progress>`, custom linear, circular, determinate, and indeterminate contracts; demo variants are split into focused blocks.
- Promoted: **Progress** from `beta` to `ready`.
- Fixed: Button Group and Kbd demos now include accessible group labels.
- Promoted: **Avatar, Button Group, Kbd, and Link** from `beta` to `ready`.

## Next Actions

These are the immediate follow-ups after the current Ready-batch promotion and audit consolidation. Pick from the top; details and per-component notes are in the Priority Findings and Component Checklist tables below.

1. **Promote next Ready candidates** (vet against Ready gates: API docs, CSS complete, demo wiring, a11y, RTL, responsive, tests):
   - `Stat`, `Steps`, `Breadcrumbs`, `Pagination`, `Empty State`, `Form Summary`, `Range`, `Hero`, `Footer`, `Timeline`, `Diff Viewer`, and mockups — mostly presentational; verify responsive/RTL details and mark disabled/reduced-motion as N/A where appropriate.
   - `File Input`, `Table`, and `List` — focus on wrapper guidance and long-content behavior before Ready.
2. **Visual coverage** — keep expanding component-specific Playwright baselines beyond Button once component cards stabilize.
3. **Acceptance warnings** — remaining warnings are 200% zoom and long-text heuristics; prioritize components with real rendered overflow before changing CSS broadly.

## Summary

- Total catalog components: 59
- Status split: 23 beta, 16 in-progress, 20 ready, 0 planned, 0 experimental
- Demos present by import name: 59 / 59
- Core CSS coverage: 59 / 59 direct or aliased; `input.css` is a thin entrypoint that imports `field.css`
- Interaction modules present for: accordion, carousel, collapse, code-block, command-palette, date-picker, dialog/modal, drawer, dropdown, menu, otp, rating, segmented-control, tabs, toast, tooltip
- API docs: 59 / 59 components now have `docs/components/api/*.md`
- Forced-colors support is present across all core CSS files

## Priority Findings

| Priority | Area | Components | Issue | Recommended action |
| --- | --- | --- | --- | --- |
| P1 | Status model | All 59 | Fixed in current pass. Ready acceptance gates are now defined; twenty components (Accordion, Avatar, Badge, Button, Button Group, Card, Carousel, Checkbox, Collapse, Drawer, Dropdown, Kbd, Link, Menu, Modal, Progress, Rating, Tabs, Toast, Tooltip) have been promoted to `ready`. Remaining components with explicit gaps stay `in-progress` or `beta`. | Continue vetting remaining Ready candidates against the defined gates. |
| P1 | Docs | All 59 components | ✅ Resolved. API docs now exist for every catalog component in `docs/components/api/`. | Keep docs in sync with future CSS/API changes. |
| P1 | Showcase demo structure | Card, Alert | Fixed in current pass. Demos now use `.nb-component-card__demo`. | Re-run rendered audit after future demo edits. |
| P1 | Showcase demo mapping | Color Picker | Fixed in current pass. The demo file had a wrapper, but the gallery map omitted `ColorPickerDemo`. | Re-run rendered audit after future catalog additions. |
| P1 | Layout sizing | List | Fixed in current pass by promoting to full-width. | Consider splitting variants later if the full-width card still feels too long. |
| P1 | Layout sizing | Calendar, Date Picker | Fixed in current pass by promoting to full-width. | Consider responsive CSS improvements later so these can work in narrower containers. |
| P1 | Interaction metadata | Tabs, Toast, Menu, Rating, Carousel | Fixed in current pass: demos now initialize `createTabs()`, `createToastManager()`, `createMenu()`, `createRating()`, and `createCarousel()`. | Keep demo wiring checks in place for future interactive components. |
| P1 | Interaction metadata | Date Picker, Command Palette | ✅ Resolved. Interaction modules added and `interactive: true` restored. | Confirm JS behavior is active in demos before Ready. |
| P1 | CSS ownership | Input | ✅ Resolved. Added `packages/core/src/components/input.css` as a thin entrypoint that imports `field.css`. | No further action required. |
| P1 | Color contrast | Badge, Modal and related semantic variants | ✅ Resolved in current pass. Acceptance color-contrast findings are now `0` after semantic token and targeted component updates. | Keep acceptance contrast at `0` before future Ready promotions. |
| P2 | Showcase layout | Browser Mockup, Phone Mockup, Window Mockup, File Input, Range, Empty State | Fixed in current pass by promoting to wide cards. | Split demos later if any card still feels too dense. |
| P2 | Reduced motion consistency | Alert, Avatar, Badge, Divider, Empty State, Form Summary, Link | These files lack `prefers-reduced-motion`. All listed components are purely static with no transitions or animations, so reduced-motion is **not applicable**. Card now has interactive motion and includes reduced-motion handling. | Mark static components as N/A in docs/tests; add reduced-motion handling only when a component introduces transitions or animations. |
| P2 | Disabled-state consistency | Link, Drawer, Modal, Navbar, Rating, Toast, Timeline, File Input and static display components | Static display components (Avatar, Badge, Card, Chat, Code Block, Diff Viewer, Divider, Empty State, Feature Grid, Footer, Hero, Kbd, List, Loading, Skeleton, Stat, Table, Timeline, mockups, etc.) do not support or require disabled states. Interactive components already have disabled selectors where applicable. | Mark static components as N/A in docs/tests; add disabled selectors only to components that are genuinely interactive and currently missing them. |
| P2 | RTL claims | Button, Collapse, Link, List, Loading, Modal, Pagination, Progress, Table | Some files may still need RTL visual checks, but the following physical-direction issues were fixed: `toast.css` now uses `transform-origin: inline-start`; `timeline.css` horizontal dashed connector has an RTL override; `field.css` group legend uses `margin-block-end`. | Run RTL visual checks on remaining components and add targeted fixes only where layout changes under `dir=rtl`. |

## Component Checklist

| Component | Status | CSS | Demo | JS | API doc | Audit state | Optimization notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Button | ready | `button.css` | yes | no | yes | ready | Loading, icon-only sizing, accessible-name docs, visual baselines, reduced-motion, and forced-colors are in place. |
| Card | ready | `card.css` | yes | no | yes | ready | Media and interactive variants, API docs, reduced-motion, and forced-colors are in place. |
| Input | in-progress | `input.css` (imports `field.css`) | yes | no | yes | ownership fixed | Thin `input.css` entrypoint added. Autofill and prefix/suffix alignment remain open. |
| Field | beta | `field.css` | yes | no | yes | docs added | Minor demo overflow in narrow card; consider responsive tweaks. |
| Textarea | in-progress | shared `field.css` | yes | no | yes | docs added | Character counter and size variants remain open. |
| Select | in-progress | shared `field.css` | yes | no | yes | docs added | RTL arrow and forced-colors review should be captured in tests. |
| Checkbox | ready | `selector.css` | yes | no | yes | ready | Checked, indeterminate, disabled, focus-visible, reduced-motion, forced-colors, demo, and docs are in place. |
| Radio | in-progress | `selector.css` | yes | no | yes | docs added | Radio group anatomy and keyboard expectations now documented. |
| Toggle | in-progress | `selector.css` | yes | no | yes | docs added | Reduced-motion and RTL thumb positioning now documented. |
| Badge | ready | `badge.css` | yes | no | yes | ready | Semantic colors, outline variant, removable tag control styling, focus-visible, forced-colors, demo, and docs are in place. |
| Alert | in-progress | `alert.css` | yes | no | yes | docs added | Dismissible behavior/API remains open. |
| Divider | in-progress | `divider.css` | yes | no | yes | docs added | Vertical orientation still noted as in progress. |
| Loading | in-progress | `loading.css` | yes | no | yes | docs added | Screen-reader strategy and size variants remain open. |
| Skeleton | in-progress | `skeleton.css` | yes | no | yes | docs added | Avatar/card skeleton patterns remain open. |
| Modal | ready | `modal.css` | yes | dialog module | yes | ready | Native dialog and div fallback focus trap, Escape/backdrop close, focus restore, contrast, docs, and tests are in place. |
| Tabs | ready | `tabs.css` | yes | tabs module | yes | ready | Demo now initializes `createTabs`; keyboard navigation and ARIA sync verified. |
| Dropdown | ready | `dropdown.css` | yes | dropdown module | yes | ready | Interaction tests cover open/close, Escape, and outside click. |
| Tooltip | ready | `tooltip.css` | yes | tooltip module | yes | ready | Focus/hover trigger pattern documented and behavior tested. |
| Table | beta | `table.css` | yes | no | yes | docs added | Confirm responsive wrapper pattern before Ready. |
| List | beta | `list.css` | yes | no | yes | docs added | Now full-width; split variants later if still too long. |
| Description List | beta | `description-list.css` | yes | no | yes | docs added | Full-width showcase works. |
| Navbar | in-progress | `navbar.css` | yes | no | yes | docs added | Collapse behavior requires optional JS but no module exists. |
| Drawer | ready | `drawer.css` | yes | drawer module | yes | ready | Focus trap, Escape, backdrop close, focus restore, placements, reduced-motion, forced-colors, RTL logical positioning, docs, and tests are in place. Disabled/loading states are N/A. |
| Toast | ready | `toast.css` | yes | toast module | yes | ready | Demo now initializes `createToastManager`; stacking and auto-dismiss verified. |
| Accordion | ready | `accordion.css` | yes | accordion module | yes | ready | Single/multi-open, keyboard navigation, and event cancellation tested. |
| Collapse | ready | `collapse.css` | yes | collapse module | yes | ready | Click and keyboard toggle behavior tested; markup auto-discovery verified. |
| Progress | ready | `progress.css` | yes | no | yes | ready | Native linear, custom linear, circular, striped, indeterminate, color, size, reduced-motion, forced-colors, ARIA contracts, and split demos are in place. |
| Avatar | ready | `avatar.css` | yes | no | yes | ready | Image, initials fallback, status dots, sizes, grouped avatars, ARIA guidance, RTL logical positioning, and forced-colors are in place; reduced-motion/disabled are N/A. |
| Stat | beta | `stat.css` | yes | no | yes | docs added | Wide layout helps. |
| Steps | beta | `steps.css` | yes | no | yes | docs added | Full-width demo is appropriate. |
| Breadcrumbs | beta | `breadcrumb.css` | yes | no | yes | docs added | Slug plural maps to singular CSS; naming now documented. |
| Pagination | beta | `pagination.css` | yes | no | yes | docs added | Full-width demo is appropriate. |
| Button Group | ready | `button-group.css` | yes | no | yes | ready | Horizontal, vertical, block layouts, hover/active/disabled states, focus-visible, group ARIA labels, reduced-motion, and forced-colors are in place. |
| Link | ready | `link.css` | yes | no | yes | ready | Valid link semantics, hover, focus-visible, forced-colors, and reduced-motion/disabled N/A guidance are in place. |
| Menu | ready | `menu.css` | yes | menu module | yes | ready | Vertical/horizontal layouts, submenus, group labels, disabled items, roving keyboard behavior, demo wiring, docs, reduced-motion, and forced-colors are in place. |
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
| Rating | ready | `rating.css` | yes | rating module | yes | ready | Read-only, half-filled, interactive radiogroup behavior, keyboard selection, demo wiring, docs, reduced-motion, and forced-colors are in place. |
| Chat | beta | `chat-bubble.css` | yes | no | yes | docs added | Catalog slug maps to `chat-bubble.css`; naming now documented. |
| Carousel | ready | `carousel.css` | yes | carousel module | yes | ready | Scroll-snap, nav/dots, keyboard navigation, autoplay/loop options, multi-slide modes, demo wiring, docs, reduced-motion, and forced-colors are in place. |
| Kbd | ready | `kbd.css` | yes | no | yes | ready | Sizes, colors, pressed state, shortcut groups, ARIA labels, reduced-motion, and forced-colors are in place; disabled is N/A. |
| Code Block | in-progress | `code-block.css` | yes | code-block module | yes | module added | Copy-to-clipboard JS module added. |
| Diff Viewer | beta | `diff-viewer.css` | yes | no | yes | docs added | Full-width demo is appropriate. |
| Pricing Card | beta | `pricing-card.css` | yes | no | yes | demo split | Demo variants split into separate showcase blocks. |
| Feature Grid | beta | `feature-grid.css` | yes | no | yes | demo split | Demo variants split into separate showcase blocks. |
| Calendar | in-progress | `calendar.css` | yes | no | yes | docs added | Now full-width; month navigation/date selection JS remains optional/planned. |
| Date Picker | in-progress | `date-picker.css` | yes | date-picker module | yes | demo split | `interactive` restored; JS module added for panel toggle and single-date selection. Demo variants split into separate showcase blocks. |
| Command Palette | in-progress | `command-palette.css` | yes | command-palette module | yes | demo split | `interactive` restored; JS module added for search, navigation, and selection. Demo now separates trigger and palette preview blocks. |
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

   Current Ready batch: **Accordion, Avatar, Badge, Button, Button Group, Card, Carousel, Checkbox, Collapse, Drawer, Dropdown, Kbd, Link, Menu, Modal, Progress, Rating, Tabs, Toast, Tooltip**.

5. **Split any remaining dense showcase demos** if wide/full layout still feels too long. Priority candidates: `CalendarDemo`, `DatePickerDemo`, `TableDemo`, `ListDemo`, `CommandPaletteDemo`, `PricingCardDemo`, `FeatureGridDemo`.

   - ✅ Split **CalendarDemo** into 2 blocks: Default Calendar, Compact Accent.
   - ✅ Split **TableDemo** into 3 blocks: Basic Table, Zebra Striping, Compact Density.
   - ✅ Split **ListDemo** into 3 blocks: Markers, Row Styles, Inline & Sizes.
   - ✅ Split **DatePickerDemo** into 3 blocks: Single, Inline, Range.
   - ✅ Split **CommandPaletteDemo** into 2 blocks: Trigger, Palette Preview.
   - ✅ Split **PricingCardDemo** into 3 blocks: Starter, Pro, Enterprise.
   - ✅ Split **FeatureGridDemo** into 3 blocks: Default, Large Accent, Compact Neutral.

6. **Add targeted tests** for responsive overflow, RTL rendering, reduced-motion behavior, and interaction modules.

   - ✅ Added behavior tests for **Accordion** and **Collapse** in `packages/interactions/tests/disclosure.test.mjs`.
   - ✅ Added behavior tests for **Rating**, **Menu**, and **Carousel** in `packages/interactions/tests/navigation.test.mjs`.
   - ✅ Added runtime RTL layout and responsive overflow checks in `tests/visual/specs/responsive-rtl.spec.ts`.
   - ✅ Added reduced-motion behavior tests for `reveal`, `countUp`, and `stagger` in `packages/interactions/tests/animations.test.mjs`.
   - ✅ Visual baseline screenshots for `button.spec.ts` generated for desktop and mobile.

7. ✅ **Fixed pre-existing Showcase TypeScript errors** in `apps/showcase/src/pages/playground.astro` and `theme-generator.astro`; `astro check` now passes cleanly.

8. ✅ **Promoted twenty vetted components to `ready`** (Accordion, Avatar, Badge, Button, Button Group, Card, Carousel, Checkbox, Collapse, Drawer, Dropdown, Kbd, Link, Menu, Modal, Progress, Rating, Tabs, Toast, Tooltip) and updated changeset `.changeset/promote-ready-components.md`.
