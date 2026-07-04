import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

test("theme package emits CSS entry points", async () => {
  const theme = await readFile(new URL("../dist/theme.css", import.meta.url), "utf8");
  const tokens = await readFile(new URL("../dist/tokens.css", import.meta.url), "utf8");

  assert.match(theme, /@neo-brutal-ui\/theme-neo-brutal/);
  assert.match(theme, /@import "@neo-brutal-ui\/core\/css"/);
  assert.equal(tokens, theme);
});
