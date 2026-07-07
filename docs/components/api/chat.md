# Chat API

> **Component**: Chat  
> **Category**: Data Display  
> **Base class**: `.nb-chat-bubble`  
> **Status**: Beta (sent/received directional variants, semantic colors, sizes, avatar, meta timestamp, tail pointers, reduced-motion, and forced-colors support are implemented)

> **Note**: The catalog slug is `chat`, but the CSS file is `packages/core/src/components/chat-bubble.css` and the base bubble class is `.nb-chat-bubble`.

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-chat` | Component | Conversation container. Stacks rows with a gap. |
| `.nb-chat-row` | Part | Flex wrapper for an avatar + bubble group. |
| `.nb-chat-row-sent` | Variant / State | Reverses row direction for sent (right-aligned) messages. |
| `.nb-chat-bubble` | Component | Base chat bubble class. Required on the message element. |
| `.nb-chat-bubble-received` | Variant | Positions the tail on the start (left) side. |
| `.nb-chat-bubble-sent` | Variant | Positions the tail on the end (right) side. |
| `.nb-chat-bubble-primary` | Color | Primary background with matching tail. |
| `.nb-chat-bubble-secondary` | Color | Secondary background with matching tail. |
| `.nb-chat-bubble-accent` | Color | Accent background with matching tail. |
| `.nb-chat-bubble-neutral` | Color | Neutral background with matching tail. |
| `.nb-chat-bubble-info` | Color | Info background with matching tail. |
| `.nb-chat-bubble-success` | Color | Success background with matching tail. |
| `.nb-chat-bubble-warning` | Color | Warning background with matching tail. |
| `.nb-chat-bubble-error` | Color | Error background with matching tail. |
| `.nb-chat-bubble-sm` | Size | Smaller padding and font size. |
| `.nb-chat-bubble-lg` | Size | Larger padding and font size. |
| `.nb-chat-avatar` | Part | Avatar placeholder next to a bubble. |
| `.nb-chat-meta` | Part | Author / timestamp line below a bubble. |

### Class Combination Examples

```html
<!-- Received message -->
<div class="nb-chat-row nb-chat-row-received">
  <div class="nb-chat-avatar" aria-hidden="true">JD</div>
  <div>
    <div class="nb-chat-bubble nb-chat-bubble-received">Hey there!</div>
    <div class="nb-chat-meta"><span>Jordan</span><span>10:42 AM</span></div>
  </div>
</div>

<!-- Sent message with color accent -->
<div class="nb-chat-row nb-chat-row-sent">
  <div class="nb-chat-avatar" aria-hidden="true">ME</div>
  <div>
    <div class="nb-chat-bubble nb-chat-bubble-sent nb-chat-bubble-primary">Love it.</div>
    <div class="nb-chat-meta"><span>10:44 AM</span></div>
  </div>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-chat">
  <div class="nb-chat-row nb-chat-row-received">
    <div class="nb-chat-avatar" aria-hidden="true">JD</div>
    <div>
      <div class="nb-chat-bubble nb-chat-bubble-received">
        Hey, how does the new component library look?
      </div>
      <div class="nb-chat-meta">
        <span>Jordan</span>
        <span>10:42 AM</span>
      </div>
    </div>
  </div>

  <div class="nb-chat-row nb-chat-row-sent">
    <div class="nb-chat-avatar" aria-hidden="true">ME</div>
    <div>
      <div class="nb-chat-bubble nb-chat-bubble-sent nb-chat-bubble-primary">
        Pretty brutal — thick borders, hard shadows, zero radius.
      </div>
      <div class="nb-chat-meta">
        <span>10:43 AM</span>
      </div>
    </div>
  </div>
</div>
```

### Semantic Element

- **Preferred**: `<div>` with ARIA roles. Wrap the conversation in a `<div role="log" aria-live="polite">` if messages update dynamically.
- Use `<article>` or `<div role="article">` for individual messages when appropriate.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| — | — | — | No component-specific required attributes. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `role="log"` / `aria-live="polite"` | On `.nb-chat` when messages are appended dynamically. |
| `aria-label` | On `.nb-chat-avatar` if it contains only initials and no image alt. |
| `aria-hidden="true"` | On decorative avatars that repeat the author name elsewhere. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| Standard document navigation | Chat bubbles are static content. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **sent** | ✅ | `.nb-chat-bubble-sent` | Tail appears on the inline-end side. |
| **received** | ✅ | `.nb-chat-bubble-received` | Tail appears on the inline-start side. |
| **hover** | ❌ Not styled | — | No hover styles. |
| **focus-visible** | ✅ | `:focus-visible` (global) | Default outline if a bubble is made focusable. |
| **disabled** | ❌ Not applicable | — | Chat bubbles are not interactive. |
| **active** | ❌ Not applicable | — | No active state. |
| **current** | ❌ Not applicable | — | No current state. |
| **selected** | ❌ Not applicable | — | No selected state. |
| **read-only** | ❌ Not applicable | — | Chat is inherently read-only. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

`.nb-chat` stacks rows. `.nb-chat-row-sent` reverses flex direction. `.nb-chat-bubble` renders a hard border, radius, shadow, and two pseudo-element triangles for the tail. Color variants reassign `--_bg`, `--_fg`, and `--_tail-color`. In forced-colors mode the tail is hidden to avoid color-dependency issues.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-chat-bubble {
    transition: none;
  }
}
```

### RTL

Uses logical properties (`inset-inline-start`, `inset-inline-end`, `flex-direction: row-reverse`) throughout; no special RTL overrides needed.

---

## Examples

### Basic Conversation

```html
<div class="nb-chat">
  <div class="nb-chat-row nb-chat-row-received">
    <div class="nb-chat-avatar" aria-hidden="true">JD</div>
    <div>
      <div class="nb-chat-bubble nb-chat-bubble-received">Hey!</div>
      <div class="nb-chat-meta"><span>Jordan</span><span>10:42 AM</span></div>
    </div>
  </div>
  <div class="nb-chat-row nb-chat-row-sent">
    <div class="nb-chat-avatar" aria-hidden="true">ME</div>
    <div>
      <div class="nb-chat-bubble nb-chat-bubble-sent">Hi!</div>
      <div class="nb-chat-meta"><span>10:43 AM</span></div>
    </div>
  </div>
</div>
```

### Color Accents

```html
<div class="nb-chat-bubble nb-chat-bubble-received nb-chat-bubble-accent">Love it.</div>
<div class="nb-chat-bubble nb-chat-bubble-sent nb-chat-bubble-primary">Ship it.</div>
```

### Sizes

```html
<div class="nb-chat-bubble nb-chat-bubble-received nb-chat-bubble-sm">Small</div>
<div class="nb-chat-bubble nb-chat-bubble-received">Default</div>
<div class="nb-chat-bubble nb-chat-bubble-received nb-chat-bubble-lg">Large</div>
```
