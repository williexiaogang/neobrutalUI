### textarea
Base multi-line text input. Required.

[Textarea docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/textarea.md)

#### Class names
- component: `nb-textarea`
- size: `nb-textarea-sm`, `nb-textarea-lg`

#### Syntax

```html
<!-- Basic textarea -->
<textarea class="nb-textarea" rows="4" placeholder="Enter your message..."></textarea>

<!-- Large textarea -->
<textarea class="nb-textarea nb-textarea-lg" rows="6"></textarea>

<!-- Inside a field wrapper -->
<div class="nb-field">
  <label class="nb-field-label" for="feedback">Feedback</label>
  <textarea class="nb-textarea" id="feedback" rows="2"></textarea>
</div>
```

#### Rules
- Always include the base class `nb-textarea`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
