### file-input
Base wrapper for the file input and optional file list.

[File Input docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/file-input.md)

#### Class names
- component: `nb-file-input`
- part: `nb-file-input-area`, `nb-file-input-native`, `nb-file-input-icon`, `nb-file-input-hint`, `nb-file-input-btn`, `nb-file-list`, `nb-file-item`, `nb-file-item-name`, `nb-file-item-size`, `nb-file-item-remove`, `nb-file-input-error`
- behavior: `is-dragover`

#### Syntax

```html
<!-- Basic file input -->
<div class="nb-file-input">
  <label class="nb-file-input-area" for="file-upload">
    <input class="nb-file-input-native" id="file-upload" type="file" />
    <svg class="nb-file-input-icon"><!-- upload icon --></svg>
    <span class="nb-file-input-hint">Drag & drop files here or click to browse</span>
    <span class="nb-file-input-btn">Choose File</span>
  </label>
</div>

<!-- With selected files and error -->
<div class="nb-file-input">
  <label class="nb-file-input-area" for="file-upload" aria-invalid="true">
    <input class="nb-file-input-native" id="file-upload" type="file" aria-invalid="true" />
    <span class="nb-file-input-hint">File must be under 5MB</span>
    <span class="nb-file-input-btn">Retry Upload</span>
  </label>
  <ul class="nb-file-list">
    <li class="nb-file-item">
      <span class="nb-file-item-name">document.pdf</span>
      <span class="nb-file-item-size">2.4 MB</span>
      <button class="nb-file-item-remove" type="button" aria-label="Remove file">×</button>
    </li>
  </ul>
  <span class="nb-file-input-error">File too large.</span>
</div>
```

#### Rules
- Always include the base class `nb-file-input`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
