---
"@neo-brutal-ui/core": minor
"@neo-brutal-ui/interactions": minor
---

Promote six components to `ready` status: Accordion, Collapse, Dropdown, Tabs, Toast, and Tooltip.

These components now pass the Ready acceptance gates:
- API docs match the current CSS and behavior
- All documented variants, sizes, and states are implemented
- Showcase demos wire the corresponding interaction modules where applicable
- Keyboard navigation, focus order, and ARIA attributes are implemented
- RTL layout verified via Playwright structural checks
- Responsive behavior verified down to 320px viewport
- Unit/visual tests cover core behavior

Additionally, the Tabs and Toast showcase demos now initialize their JS modules (`createTabs` and `createToastManager`), satisfying the interactive demo wiring gate.
