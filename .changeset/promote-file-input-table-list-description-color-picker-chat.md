---
"@neo-brutal-ui/core": minor
---

Promote six components to `ready` status: File Input, Table, List, Description List, Color Picker, and Chat.

These components now pass the Ready acceptance gates:
- API docs exist at `docs/components/api/<slug>.md` and match current CSS
- CSS implements all documented variants, sizes, states, and color accents
- Showcase demos cover the component surface
- Accessibility semantics (landmarks, labels, ARIA attributes) are documented
- RTL layout verified via logical CSS properties
- Responsive behavior verified down to 320px viewport
- Reduced-motion and disabled states marked as N/A for purely static components (Table, List, Description List, Chat)

Additional documentation updates:
- File Input: drag-and-drop CSS state is documented, with full drop handling left to consumer JS
- Table: responsive wrapper pattern and long-content behavior documented
- List: responsive inline wrapping and long-content behavior documented
- Description List: horizontal grid responsive behavior and long-content wrapping documented
- Color Picker: native color dialog limitations and value-sync requirements documented
