import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const tokenFiles = [
  "src/tokens/colors.css",
  "src/tokens/component.css",
  "src/tokens/motion.css",
  "src/tokens/shadows.css",
  "src/tokens/spacing.css",
  "src/tokens/z-index.css",
];

test("theme tokens are scoped to theme roots only", async () => {
  for (const file of tokenFiles) {
    const css = await readFile(new URL(`../${file}`, import.meta.url), "utf8");

    assert.equal(
      css.includes('[data-theme="neo-brutal"] *'),
      false,
      `${file} must not define tokens on every light descendant`
    );
    assert.equal(
      css.includes('[data-theme="neo-brutal-dark"] *'),
      false,
      `${file} must not define tokens on every dark descendant`
    );
  }
});

test("base reset supports light and dark theme roots", async () => {
  const css = await readFile(new URL("../src/base/reset.css", import.meta.url), "utf8");

  assert.match(css, /\[data-theme="neo-brutal"\]/);
  assert.match(css, /\[data-theme="neo-brutal-dark"\]/);
  assert.match(css, /color:\s*var\(--nb-base-content\)/);
});
