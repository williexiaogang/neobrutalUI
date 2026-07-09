---
"@neo-brutal-ui/core": minor
---

Promote Divider, Loading, and Skeleton to `ready` status.

These components now pass the Ready acceptance gates:
- API docs exist at `docs/components/api/<slug>.md` and match the current CSS
- CSS implements all documented variants, sizes, states, and color accents
- Showcase demos cover the component surface
- Accessibility semantics are documented, including screen-reader strategy for Loading
- RTL layout verified via logical CSS properties
- Responsive behavior verified down to 320px viewport
- Reduced-motion and disabled states marked as N/A for the static Divider and Skeleton shapes; Loading includes a reduced-motion dashed-ring fallback

Divider now demonstrates horizontal (with and without label) and vertical orientations. Loading documents the `role="status"` / `aria-live="polite"` live-region strategy and notes that size variants are not implemented (use inline sizing). Skeleton documents pulse/wave animations, the reduced-motion alternative, and common text-line, avatar, and card patterns.
