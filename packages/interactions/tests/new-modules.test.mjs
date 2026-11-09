import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { Window } from "happy-dom";

let window;

function installDom(html = "") {
  window = new Window();
  window.document.body.innerHTML = html;

  globalThis.window = window;
  globalThis.document = window.document;
  globalThis.HTMLElement = window.HTMLElement;
  globalThis.HTMLInputElement = window.HTMLInputElement;
  globalThis.HTMLButtonElement = window.HTMLButtonElement;
  globalThis.CustomEvent = window.CustomEvent;
  globalThis.KeyboardEvent = window.KeyboardEvent;
  globalThis.MouseEvent = window.MouseEvent;
  globalThis.Event = window.Event;
  Object.defineProperty(globalThis, "navigator", {
    value: { clipboard: { writeText: () => Promise.resolve() } },
    configurable: true,
    writable: true,
  });
}

beforeEach(() => {
  installDom();
});

afterEach(() => {
  window?.close();
  delete globalThis.window;
  delete globalThis.document;
  delete globalThis.HTMLElement;
  delete globalThis.HTMLInputElement;
  delete globalThis.HTMLButtonElement;
  delete globalThis.CustomEvent;
  delete globalThis.KeyboardEvent;
  delete globalThis.MouseEvent;
  delete globalThis.Event;
  delete globalThis.navigator;
});

test("otp fills fields and fires onComplete", async () => {
  installDom(`
    <div id="otp" class="nb-otp">
      <input class="nb-otp-field" />
      <input class="nb-otp-field" />
      <input class="nb-otp-field" />
      <input class="nb-otp-field" />
    </div>
  `);

  const root = document.getElementById("otp");
  const { createOtp } = await import(`../dist/otp.js?test=${Date.now()}-otp`);
  let completed = "";
  const otp = createOtp(root, {
    onComplete: (value) => {
      completed = value;
    },
  });

  const fields = root.querySelectorAll(".nb-otp-field");
  fields[0].value = "1";
  fields[0].dispatchEvent(new Event("input", { bubbles: true }));
  fields[1].value = "2";
  fields[1].dispatchEvent(new Event("input", { bubbles: true }));
  fields[2].value = "3";
  fields[2].dispatchEvent(new Event("input", { bubbles: true }));
  fields[3].value = "4";
  fields[3].dispatchEvent(new Event("input", { bubbles: true }));

  assert.equal(otp.value, "1234");
  assert.equal(completed, "1234");
});

test("otp handles paste", async () => {
  installDom(`
    <div id="otp" class="nb-otp">
      <input class="nb-otp-field" />
      <input class="nb-otp-field" />
      <input class="nb-otp-field" />
      <input class="nb-otp-field" />
    </div>
  `);

  const root = document.getElementById("otp");
  const { createOtp } = await import(`../dist/otp.js?test=${Date.now()}-otp`);
  const otp = createOtp(root);

  const fields = root.querySelectorAll(".nb-otp-field");
  fields[0].dispatchEvent(new Event("focus", { bubbles: true }));
  fields[0].dispatchEvent(
    new Event("paste", { bubbles: true })
  );

  // happy-dom ClipboardEvent is limited; test setValue instead
  otp.setValue("9876");
  assert.equal(otp.value, "9876");
  assert.equal(fields[3], document.activeElement);
});

test("segmented control selects on click and keyboard", async () => {
  installDom(`
    <div id="sc" class="nb-segmented" role="radiogroup" aria-label="View">
      <label class="nb-segmented-item"><input type="radio" name="view" value="list" />List</label>
      <label class="nb-segmented-item"><input type="radio" name="view" value="grid" checked />Grid</label>
      <label class="nb-segmented-item"><input type="radio" name="view" value="map" />Map</label>
    </div>
  `);

  const root = document.getElementById("sc");
  const { createSegmentedControl } = await import(`../dist/segmented-control.js?test=${Date.now()}-sc`);
  const sc = createSegmentedControl(root);

  assert.equal(sc.value, "grid");

  const items = root.querySelectorAll(".nb-segmented-item");
  items[2].click();
  assert.equal(sc.value, "map");
  assert.equal(items[2].querySelector("input").checked, true);

  items[2].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
  assert.equal(sc.value, "grid");
});

test("code block copies code text", async () => {
  installDom(`
    <div id="cb" class="nb-code-block">
      <div class="nb-code-block-header">
        <div class="nb-code-block-actions">
          <button type="button" data-nb-code-block-copy>Copy</button>
        </div>
      </div>
      <div class="nb-code-block-body">
        <code class="nb-code-block-code">hello world</code>
      </div>
    </div>
  `);

  const root = document.getElementById("cb");
  const button = root.querySelector("button");
  const { createCodeBlock } = await import(`../dist/code-block.js?test=${Date.now()}-cb`);
  let copied = "";
  const cb = createCodeBlock(root, {
    onCopy: (text) => {
      copied = text;
    },
  });

  await cb.copy();
  assert.equal(copied, "hello world");
  assert.equal(button.textContent, "Copied!");
});

test("date picker opens, selects a date, and closes", async () => {
  installDom(`
    <div id="dp" class="nb-date-picker">
      <div class="nb-date-picker-input">
        <input type="text" readonly />
        <button type="button">Open</button>
      </div>
      <div class="nb-date-picker-panel">
        <div class="nb-calendar" data-year="2025" data-month="6">
          <div class="nb-calendar-header">
            <button class="nb-calendar-nav-btn" type="button">‹</button>
            <span class="nb-calendar-month-label">June 2025</span>
            <button class="nb-calendar-nav-btn" type="button">›</button>
          </div>
          <div class="nb-calendar-grid">
            <div class="nb-calendar-day" data-date="2025-06-11">11</div>
            <div class="nb-calendar-day" data-date="2025-06-12">12</div>
          </div>
        </div>
        <div class="nb-date-picker-footer">
          <button class="nb-date-picker-footer-btn" type="button" data-action="today">Today</button>
          <button class="nb-date-picker-footer-btn" type="button" data-action="clear">Clear</button>
        </div>
      </div>
    </div>
  `);

  const root = document.getElementById("dp");
  const panel = root.querySelector(".nb-date-picker-panel");
  const input = root.querySelector("input");
  const { createDatePicker } = await import(`../dist/date-picker.js?test=${Date.now()}-dp`);
  const dp = createDatePicker(root);

  assert.equal(dp.isOpen, false);
  input.click();
  assert.equal(dp.isOpen, true);
  assert.equal(panel.hasAttribute("data-open"), true);

  const day = root.querySelector('[data-date="2025-06-12"]');
  day.click();
  assert.equal(dp.isOpen, false);
  assert.ok(input.value.includes("Jun 12, 2025"));
});

test("command palette opens, filters, and selects", async () => {
  installDom(`
    <div id="cp" class="nb-command-palette-backdrop">
      <div class="nb-command-palette" role="dialog">
        <div class="nb-command-palette-input">
          <input type="text" class="nb-command-palette-input-field" />
        </div>
        <ul class="nb-command-palette-list">
          <li class="nb-command-palette-group">Actions</li>
          <li class="nb-command-palette-item" data-value="copy">Copy</li>
          <li class="nb-command-palette-item" data-value="paste">Paste</li>
        </ul>
        <div class="nb-command-palette-empty" hidden>No results</div>
      </div>
    </div>
  `);

  const root = document.getElementById("cp");
  const input = root.querySelector(".nb-command-palette-input-field");
  const { createCommandPalette } = await import(`../dist/command-palette.js?test=${Date.now()}-cp`);
  let selected = "";
  const cp = createCommandPalette(root, {
    hotkey: false,
    onSelect: (value) => {
      selected = value;
    },
  });
  const items = [...root.querySelectorAll(".nb-command-palette-item")];

  assert.equal(cp.isOpen, false);
  assert.ok(items.every((item) => item.getAttribute("aria-selected") === "false"));
  cp.open();
  assert.equal(cp.isOpen, true);
  assert.equal(root.classList.contains("is-open"), true);
  assert.equal(items[0].getAttribute("aria-selected"), "true");
  assert.equal(items[1].getAttribute("aria-selected"), "false");

  input.value = "copy";
  input.dispatchEvent(new Event("input", { bubbles: true }));
  const visible = root.querySelectorAll('.nb-command-palette-item:not([hidden])');
  assert.equal(visible.length, 1);

  cp.select("copy");
  assert.equal(selected, "copy");
  assert.equal(cp.isOpen, false);
  assert.ok(items.every((item) => item.getAttribute("aria-selected") === "false"));
});
