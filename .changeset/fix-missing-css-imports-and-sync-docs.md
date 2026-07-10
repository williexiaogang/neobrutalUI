---
"@neo-brutal-ui/core": patch
---

Fix missing CSS imports and synchronize documentation status.

- Added `@import url("./components/kbd.css")` and `@import url("./components/chat-bubble.css")` to `packages/core/src/index.css` so the `Kbd` and `Chat` ready components are exported through the core package entry point.
- Updated API doc status for `Accordion`, `Collapse`, `Dropdown`, `Tabs`, `Toast`, and `Tooltip` from `beta` to `ready` to match the showcase catalog and existing changesets.
- Regenerated `reports/component-audit-list.md` to reflect the current 57 ready / 0 beta / 2 in-progress split.
