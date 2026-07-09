---
"@neo-brutal-ui/core": minor
---

Promote Hero, Footer, Timeline, Diff Viewer, Browser Mockup, Phone Mockup, and Window Mockup from `beta` to `ready` status.

These components now pass the Ready acceptance gates:
- API docs at `docs/components/api/<slug>.md` match the current CSS
- CSS implements all documented variants, sizes, states, and color accents
- Showcase demos cover the component surface
- Accessibility semantics are documented (landmarks, labels, ARIA attributes)
- RTL layout verified via logical CSS properties
- Responsive behavior verified down to 320px viewport
- Reduced-motion and disabled states marked as N/A for the purely static components

Fixed demo markup to use the CSS-defined class names:
- `BrowserMockupDemo`: `.nb-browser-header` and `.nb-browser-body`
- `PhoneMockupDemo`: `.nb-phone-notch-bar`, `.nb-phone-indicator`, `.nb-phone-indicator-bar`, and `.nb-phone-screen-content`
- `WindowMockupDemo`: `.nb-window-header`, `.nb-window-title`, `.nb-window-title-icon`, and control variants
- `TimelineDemo`: `.nb-timeline-marker-*`, `.nb-timeline-time`, and `.nb-timeline-body`
- `DiffViewerDemo`: removed non-existent color variants and used `.nb-diff-stat-added`/`.nb-diff-stat-removed`
