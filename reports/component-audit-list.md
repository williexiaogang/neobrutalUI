# Component Audit List

Date: 2026-07-06

Scope: 59 components from `apps/showcase/src/data/components.ts`, cross-checked against core CSS, showcase demos, interaction modules, API docs, and rendered showcase layout at `http://localhost:4321/#components`.

## Summary

- Total catalog components: 59
- Demos present by import name: 59 / 59
- Core CSS coverage: 58 / 59 direct or aliased; `input` is cataloged separately but implemented through `field.css`
- Interaction modules present for: accordion, carousel, collapse, dialog/modal, drawer, dropdown, menu, rating, tabs, toast, tooltip
- API docs are sparse: only early components have `docs/components/api/*.md`
- Forced-colors support is present across all core CSS files

## Priority Findings

| Priority | Area | Components | Issue | Recommended action |
| --- | --- | --- | --- | --- |
| P1 | Status model | All 59 | Every component is marked `beta`, while catalog comments still say no component has reached Ready. This makes maturity hard to trust. | Reclassify components into `ready`, `beta`, `in-progress`, and `planned` based on explicit acceptance gates. |
| P1 | Docs | Most components after Modal | API docs exist for only a small subset. Users cannot rely on stable class names, anatomy, states, or accessibility guidance. | Create API docs in batches by family: forms, navigation, overlays, data display, layout/marketing. |
| P1 | Showcase demo structure | Card, Alert, Color Picker | Rendered audit finds `demoCount: 0` because these demos do not use `.nb-component-card__demo`, so spacing/overflow diagnostics and visual framing are inconsistent. | Wrap demo content with `.nb-component-card__demo`. |
| P1 | Layout sizing | List | Still renders as a narrow default card while reaching ~2471px height. | Mark as full-width or split its variants into multiple cards/sections. |
| P1 | Layout sizing | Calendar, Date Picker | Narrow cards show internal horizontal overflow. | Mark as wide/full, or make calendar/date-picker min widths adapt better inside narrow containers. |
| P1 | Interaction metadata | Tabs, Menu, Rating, Carousel, Toast | JS modules exist, but catalog `interactive` is missing/false. | Set `interactive: true` or clarify that JS is optional but not active in the demo. |
| P1 | Interaction metadata | Date Picker, Command Palette | Catalog says interactive, but no matching interaction module exists. | Either add interaction modules or mark as CSS-only/preview until behavior exists. |
| P1 | CSS ownership | Input | Catalog has `input` as a component, docs imply input, but no `input.css`; styles are in `field.css`. | Either add a thin `input.css` entrypoint or document the `field.css` ownership clearly. |
| P2 | Showcase layout | Browser Mockup, Phone Mockup, Window Mockup, File Input, Range, Empty State | These are tall in narrow cards and would scan better as wide cards or split demos. | Promote to wide/full in showcase or reduce demo density. |
| P2 | Reduced motion consistency | Alert, Avatar, Badge, Card, Divider, Empty State, Form Summary, Link | These files lack `prefers-reduced-motion`. Some are static, but the policy is inconsistent. | Add only where transitions/animations exist; otherwise mark as not applicable in the audit. |
| P2 | Disabled-state consistency | Link, Drawer, Modal, Navbar, Rating, Toast, Timeline, File Input and static display components | Some interactive-looking components lack disabled selectors. Some are static and may not need them. | Separate "not applicable" from missing disabled support in docs/tests. |
| P2 | RTL claims | Button, Collapse, Link, List, Loading, Modal, Pagination, Progress, Table | Some files lack explicit RTL-sensitive selectors or logical-property evidence. | Run RTL visual checks and add targeted fixes only where layout changes under `dir=rtl`. |

## Component Checklist

| Component | Status | CSS | Demo | JS | API doc | Audit state | Optimization notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Button | beta | `button.css` | yes | no | yes | needs polish | Known issues: loading spinner alignment, icon-only accessible-name docs. |
| Card | beta | `card.css` | import exists, wrapper missing | no | yes | needs showcase fix | Wrap demo in `.nb-component-card__demo`; consider media/interactive variants later. |
| Input | beta | shared `field.css` | yes | no | yes | needs ownership fix | Decide whether input deserves `input.css` or explicit docs saying it is field-owned. |
| Field | beta | `field.css` | yes | no | no | needs docs | Minor demo overflow in narrow card; API docs missing. |
| Textarea | beta | shared `field.css` | yes | no | no | needs docs | Document textarea sizing/counter plan. |
| Select | beta | shared `field.css` | yes | no | no | needs docs | RTL arrow and forced-colors review should be captured in tests. |
| Checkbox | beta | `selector.css` | yes | no | yes | near stable | Add indeterminate docs/examples before Ready. |
| Radio | beta | `selector.css` | yes | no | no | needs docs | Add radio group anatomy and keyboard expectations. |
| Toggle | beta | `selector.css` | yes | no | no | needs docs/tests | Confirm reduced-motion and RTL thumb positioning. |
| Badge | beta | `badge.css` | yes | no | no | needs docs | Removable tag behavior remains undefined. |
| Alert | beta | `alert.css` | import exists, wrapper missing | no | no | needs showcase fix | Wrap demo; decide dismissible behavior/API. |
| Divider | beta | `divider.css` | yes | no | no | needs docs | Vertical orientation still noted as in progress. |
| Loading | beta | `loading.css` | yes | no | no | needs a11y docs | Add screen-reader strategy and size variants. |
| Skeleton | beta | `skeleton.css` | yes | no | no | needs docs | Add avatar/card skeleton patterns or re-scope notes. |
| Modal | beta | `modal.css` | yes | dialog module | yes | needs JS polish | Known issue: div fallback focus trap. |
| Tabs | beta | `tabs.css` | yes | tabs module | no | metadata mismatch | Mark interactive or clarify CSS-only demo. |
| Dropdown | beta | `dropdown.css` | yes | dropdown module | no | needs docs | Add API docs and interaction tests if not already covered. |
| Tooltip | beta | `tooltip.css` | yes | tooltip module | no | needs docs | CSS focus/hover behavior needs documented trigger pattern. |
| Table | beta | `table.css` | yes | no | no | needs docs | Confirm responsive wrapper pattern. |
| List | beta | `list.css` | yes | no | no | layout issue | Promote to full-width or split variants; currently too tall in default card. |
| Description List | beta | `description-list.css` | yes | no | no | needs docs | Full-width showcase works; add API docs. |
| Navbar | beta | `navbar.css` | yes | no | no | needs behavior decision | Collapse behavior requires optional JS but no module exists. |
| Drawer | beta | `drawer.css` | yes | drawer module | no | needs docs | Add API docs and disabled/edge-case states if applicable. |
| Toast | beta | `toast.css` | yes | toast module | no | metadata mismatch | Mark interactive or clarify demo behavior. |
| Accordion | beta | `accordion.css` | yes | accordion module | no | needs docs | Good CSS/JS coverage; API docs missing. |
| Collapse | beta | `collapse.css` | yes | collapse module | no | needs docs | Good coverage; API docs missing. |
| Progress | beta | `progress.css` | yes | no | no | needs docs | Define native vs div-based API clearly. |
| Avatar | beta | `avatar.css` | yes | no | no | needs docs | Static component; focus/disabled likely not applicable. |
| Stat | beta | `stat.css` | yes | no | no | showcase ok | Wide layout helps; docs missing. |
| Steps | beta | `steps.css` | yes | no | no | showcase ok | Full-width demo is appropriate; docs missing. |
| Breadcrumbs | beta | `breadcrumb.css` | yes | no | no | needs docs | Slug plural maps to singular CSS; document naming. |
| Pagination | beta | `pagination.css` | yes | no | no | showcase ok | Full-width demo is appropriate; docs missing. |
| Button Group | beta | `button-group.css` | yes | no | no | showcase ok | Docs missing. |
| Link | beta | `link.css` | yes | no | no | needs docs | Reduced-motion/disabled applicability should be clarified. |
| Menu | beta | `menu.css` | yes | menu module | no | metadata mismatch | Mark interactive if JS is active; full-width demo is appropriate. |
| Empty State | beta | `empty-state.css` | yes | no | no | layout polish | Consider wide showcase or split variants. |
| Form Summary | beta | `form-summary.css` | yes | no | no | showcase ok | Add reduced-motion only if transitions exist. |
| File Input | beta | `file-input.css` | yes | no | no | layout polish | Tall in narrow card; consider wide layout and document drag/drop limits. |
| Range | beta | `range.css` | yes | no | no | layout polish | Tall in narrow card; consider wide layout or split variants. |
| OTP Input | beta | `otp.css` | yes | no | no | behavior gap | Notes mention auto-focus/paste JS but no module exists. |
| Segmented Control | beta | `segmented-control.css` | yes | no | no | showcase ok | Notes mention keyboard JS optional but no module exists. |
| Color Picker | beta | `color-picker.css` | import exists, wrapper missing | no | no | needs showcase fix | Wrap demo and document native input limitations. |
| Hero | beta | `hero.css` | yes | no | no | showcase ok | Full-width demo is appropriate; docs missing. |
| Footer | beta | `footer.css` | yes | no | no | showcase ok | Full-width demo is appropriate; docs missing. |
| Timeline | beta | `timeline.css` | yes | no | no | showcase ok | Full-width demo is appropriate; docs missing. |
| Rating | beta | `rating.css` | yes | rating module | no | metadata mismatch | Mark interactive or clarify CSS-only demo. |
| Chat | beta | `chat-bubble.css` | yes | no | no | needs naming docs | Catalog slug maps to `chat-bubble.css`; document naming. |
| Carousel | beta | `carousel.css` | yes | carousel module | no | metadata mismatch | Mark interactive if JS is active. |
| Kbd | beta | `kbd.css` | yes | no | no | needs docs | Static component; focus/disabled likely not applicable. |
| Code Block | beta | `code-block.css` | yes | no | no | behavior gap | Notes mention copy interaction but no module exists. |
| Diff Viewer | beta | `diff-viewer.css` | yes | no | no | showcase ok | Docs missing. |
| Pricing Card | beta | `pricing-card.css` | yes | no | no | showcase ok | Full-width demo is appropriate; docs missing. |
| Feature Grid | beta | `feature-grid.css` | yes | no | no | showcase ok | Full-width demo is appropriate; docs missing. |
| Calendar | beta | `calendar.css` | yes | no | no | layout issue | Narrow card has internal overflow; promote to wide/full or improve responsive layout. |
| Date Picker | beta | `date-picker.css` | yes | no | no | layout/behavior issue | Mark wide/full; catalog says interactive but no JS module exists. |
| Command Palette | beta | `command-palette.css` | yes | no | no | behavior mismatch | Catalog says interactive but no JS module exists. |
| Browser Mockup | beta | `browser.css` | yes | no | no | layout polish | Tall in narrow card; consider wide layout. |
| Phone Mockup | beta | `phone.css` | yes | no | no | layout polish | Tall in narrow card; consider wide layout. |
| Window Mockup | beta | `window.css` | yes | no | no | layout polish | Tall in narrow card; consider wide layout. |

## Suggested Work Order

1. Fix showcase wrappers: Card, Alert, Color Picker.
2. Reclassify catalog status and interactive flags.
3. Promote/split layout-heavy demos: List, Calendar, Date Picker, Browser/Phone/Window Mockups, File Input, Range, Empty State.
4. Create API docs batch by batch.
5. Add targeted tests for responsive overflow, RTL, reduced-motion, and interaction modules.
