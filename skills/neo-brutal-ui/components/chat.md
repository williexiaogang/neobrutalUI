### chat
Conversation container. Stacks rows with a gap.

[Chat docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/chat.md)

#### Class names
- component: `nb-chat-bubble`
- part: `nb-chat-row`, `nb-chat-avatar`, `nb-chat-meta`
- variant / state: `nb-chat-row-sent`
- style: `nb-chat-bubble-received`, `nb-chat-bubble-sent`
- color: `nb-chat-bubble-primary`, `nb-chat-bubble-secondary`, `nb-chat-bubble-accent`, `nb-chat-bubble-neutral`, `nb-chat-bubble-info`, `nb-chat-bubble-success`, `nb-chat-bubble-warning`, `nb-chat-bubble-error`
- size: `nb-chat-bubble-sm`, `nb-chat-bubble-lg`

#### Syntax

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

#### Rules
- Always include the base class `nb-chat-bubble`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
