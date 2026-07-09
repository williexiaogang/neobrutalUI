---
"@neo-brutal-ui/core": minor
"@neo-brutal-ui/interactions": minor
---

Promote twenty components to `ready` status: Accordion, Avatar, Badge, Button, Button Group, Card, Carousel, Checkbox, Collapse, Drawer, Dropdown, Kbd, Link, Menu, Modal, Progress, Rating, Tabs, Toast, and Tooltip.

These components now pass the Ready acceptance gates:
- API docs match the current CSS and behavior
- All documented variants, sizes, and states are implemented
- Showcase demos wire the corresponding interaction modules where applicable
- Keyboard navigation, focus order, and ARIA attributes are implemented
- RTL layout verified via Playwright structural checks
- Responsive behavior verified down to 320px viewport
- Unit/visual tests cover core behavior

Additionally, the Tabs, Toast, Menu, Rating, and Carousel showcase demos initialize their JS modules (`createTabs`, `createToastManager`, `createMenu`, `createRating`, and `createCarousel`), satisfying the interactive demo wiring gate. Badge now includes the removable tag control pattern in CSS, demo, and API docs. Progress now documents the native, custom linear, and circular ARIA contracts and splits dense demos into focused examples. Avatar, Button Group, Kbd, and Link now have ready status with documented semantics, ARIA guidance, reduced-motion applicability, and forced-colors coverage.
