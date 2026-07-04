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
  globalThis.HTMLDialogElement = window.HTMLDialogElement;
  globalThis.CustomEvent = window.CustomEvent;
  globalThis.KeyboardEvent = window.KeyboardEvent;
  globalThis.MouseEvent = window.MouseEvent;
  globalThis.Event = window.Event;
}

beforeEach(() => {
  installDom();
});

afterEach(() => {
  window?.close();
  delete globalThis.window;
  delete globalThis.document;
  delete globalThis.HTMLElement;
  delete globalThis.HTMLDialogElement;
  delete globalThis.CustomEvent;
  delete globalThis.KeyboardEvent;
  delete globalThis.MouseEvent;
  delete globalThis.Event;
});

test("tabs initialize aria state and support arrow-key navigation", async () => {
  installDom(`
    <div id="tabs">
      <div role="tablist" aria-label="Settings">
        <button id="tab-general" role="tab" aria-controls="panel-general">General</button>
        <button id="tab-billing" role="tab" aria-controls="panel-billing">Billing</button>
      </div>
      <section id="panel-general" role="tabpanel" aria-labelledby="tab-general">General panel</section>
      <section id="panel-billing" role="tabpanel" aria-labelledby="tab-billing">Billing panel</section>
    </div>
  `);

  const root = document.getElementById("tabs");
  const tabGeneral = document.getElementById("tab-general");
  const tabBilling = document.getElementById("tab-billing");
  const panelGeneral = document.getElementById("panel-general");
  const panelBilling = document.getElementById("panel-billing");
  const { createTabs } = await import(`../dist/tabs.js?test=${Date.now()}-tabs`);

  const tabs = createTabs(root);

  assert.equal(tabs.activeIndex, 0);
  assert.equal(tabGeneral.getAttribute("aria-selected"), "true");
  assert.equal(tabBilling.getAttribute("aria-selected"), "false");
  assert.equal(panelGeneral.hidden, false);
  assert.equal(panelBilling.hidden, true);

  tabGeneral.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));

  assert.equal(tabs.activeIndex, 1);
  assert.equal(tabGeneral.getAttribute("aria-selected"), "false");
  assert.equal(tabBilling.getAttribute("aria-selected"), "true");
  assert.equal(panelGeneral.hidden, true);
  assert.equal(panelBilling.hidden, false);
  assert.equal(document.activeElement, tabBilling);
});

test("dropdown opens from trigger and closes on escape and outside click", async () => {
  installDom(`
    <div id="dropdown" class="nb-dropdown">
      <button class="nb-dropdown-trigger" type="button">Options</button>
      <div class="nb-dropdown-panel">
        <button class="nb-dropdown-item" type="button">Edit</button>
      </div>
    </div>
    <button id="outside" type="button">Outside</button>
  `);

  const root = document.getElementById("dropdown");
  const trigger = root.querySelector(".nb-dropdown-trigger");
  const panel = root.querySelector(".nb-dropdown-panel");
  const { createDropdown } = await import(`../dist/dropdown.js?test=${Date.now()}-dropdown`);
  const dropdown = createDropdown(root);

  assert.equal(trigger.getAttribute("aria-expanded"), "false");
  assert.equal(dropdown.isOpen, false);

  trigger.click();

  assert.equal(dropdown.isOpen, true);
  assert.equal(trigger.getAttribute("aria-expanded"), "true");
  assert.equal(panel.classList.contains("is-open"), true);

  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

  assert.equal(dropdown.isOpen, false);
  assert.equal(trigger.getAttribute("aria-expanded"), "false");
  assert.equal(panel.classList.contains("is-open"), false);

  trigger.click();
  document.getElementById("outside").click();

  assert.equal(dropdown.isOpen, false);
});

test("dialog opens, traps tab focus, and restores focus on close", async () => {
  installDom(`
    <button id="launcher" type="button">Open</button>
    <dialog id="dialog">
      <button id="first" type="button">First</button>
      <button id="last" type="button">Last</button>
    </dialog>
  `);

  const launcher = document.getElementById("launcher");
  const dialogElement = document.getElementById("dialog");
  const first = document.getElementById("first");
  const last = document.getElementById("last");
  const { createDialog } = await import(`../dist/dialog.js?test=${Date.now()}-dialog`);

  launcher.focus();
  const dialog = createDialog(dialogElement);

  dialog.open();

  assert.equal(dialog.isOpen, true);
  assert.equal(dialogElement.open, true);
  assert.equal(document.activeElement, first);

  first.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true }));
  assert.equal(document.activeElement, last);

  last.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));
  assert.equal(document.activeElement, first);

  dialog.close();

  assert.equal(dialog.isOpen, false);
  assert.equal(dialogElement.open, false);
  assert.equal(document.activeElement, launcher);
});
