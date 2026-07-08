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
  globalThis.HTMLButtonElement = window.HTMLButtonElement;
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
  delete globalThis.HTMLButtonElement;
  delete globalThis.CustomEvent;
  delete globalThis.KeyboardEvent;
  delete globalThis.MouseEvent;
  delete globalThis.Event;
});

test("accordion initializes from markup and toggles panels", async () => {
  installDom(`
    <div id="accordion" data-nb-accordion>
      <div class="nb-accordion-item" data-nb-accordion-item>
        <button id="t0" data-nb-accordion-trigger aria-expanded="false" aria-controls="p0">One</button>
        <div id="p0" data-nb-accordion-panel role="region">Panel one</div>
      </div>
      <div class="nb-accordion-item" data-nb-accordion-item>
        <button id="t1" data-nb-accordion-trigger aria-expanded="true" aria-controls="p1">Two</button>
        <div id="p1" data-nb-accordion-panel role="region">Panel two</div>
      </div>
      <div class="nb-accordion-item" data-nb-accordion-item>
        <button id="t2" data-nb-accordion-trigger aria-expanded="false" aria-controls="p2">Three</button>
        <div id="p2" data-nb-accordion-panel role="region">Panel three</div>
      </div>
    </div>
  `);

  const root = document.getElementById("accordion");
  const t0 = document.getElementById("t0");
  const t1 = document.getElementById("t1");
  const p0 = document.getElementById("p0");
  const p1 = document.getElementById("p1");

  const { createAccordion } = await import(`../dist/accordion.js?test=${Date.now()}-accordion`);
  const accordion = createAccordion(root);

  assert.deepEqual(accordion.activeIndices, [1]);
  assert.equal(t0.getAttribute("aria-expanded"), "false");
  assert.equal(t1.getAttribute("aria-expanded"), "true");
  assert.equal(p0.getAttribute("aria-hidden"), "true");
  assert.equal(p1.getAttribute("aria-hidden"), "false");

  t0.click();
  assert.deepEqual(accordion.activeIndices, [0]);
  assert.equal(t0.getAttribute("aria-expanded"), "true");
  assert.equal(p0.getAttribute("aria-hidden"), "false");
  assert.equal(t1.getAttribute("aria-expanded"), "false");
  assert.equal(p1.getAttribute("aria-hidden"), "true");
});

test("accordion supports allowMultiple mode", async () => {
  installDom(`
    <div id="accordion" data-nb-accordion>
      <div class="nb-accordion-item" data-nb-accordion-item>
        <button id="t0" data-nb-accordion-trigger aria-expanded="false" aria-controls="p0">One</button>
        <div id="p0" data-nb-accordion-panel role="region">Panel one</div>
      </div>
      <div class="nb-accordion-item" data-nb-accordion-item>
        <button id="t1" data-nb-accordion-trigger aria-expanded="false" aria-controls="p1">Two</button>
        <div id="p1" data-nb-accordion-panel role="region">Panel two</div>
      </div>
    </div>
  `);

  const root = document.getElementById("accordion");
  const t0 = document.getElementById("t0");
  const t1 = document.getElementById("t1");

  const { createAccordion } = await import(`../dist/accordion.js?test=${Date.now()}-accordion-multi`);
  const accordion = createAccordion(root, { allowMultiple: true });

  assert.deepEqual(accordion.activeIndices, []);

  t0.click();
  t1.click();

  assert.deepEqual(accordion.activeIndices, [0, 1]);
  assert.equal(t0.getAttribute("aria-expanded"), "true");
  assert.equal(t1.getAttribute("aria-expanded"), "true");
});

test("accordion keyboard navigation cycles through triggers", async () => {
  installDom(`
    <div id="accordion" data-nb-accordion>
      <div class="nb-accordion-item" data-nb-accordion-item>
        <button id="t0" data-nb-accordion-trigger aria-expanded="false" aria-controls="p0">One</button>
        <div id="p0" data-nb-accordion-panel role="region">Panel one</div>
      </div>
      <div class="nb-accordion-item" data-nb-accordion-item>
        <button id="t1" data-nb-accordion-trigger aria-expanded="false" aria-controls="p1">Two</button>
        <div id="p1" data-nb-accordion-panel role="region">Panel two</div>
      </div>
      <div class="nb-accordion-item" data-nb-accordion-item>
        <button id="t2" data-nb-accordion-trigger aria-expanded="false" aria-controls="p2">Three</button>
        <div id="p2" data-nb-accordion-panel role="region">Panel three</div>
      </div>
    </div>
  `);

  const root = document.getElementById("accordion");
  const t0 = document.getElementById("t0");

  const { createAccordion } = await import(`../dist/accordion.js?test=${Date.now()}-accordion-kbd`);
  createAccordion(root);

  t0.focus();
  t0.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

  const t1 = document.getElementById("t1");
  assert.equal(document.activeElement, t1);

  t1.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
  const t2 = document.getElementById("t2");
  assert.equal(document.activeElement, t2);

  t2.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
  assert.equal(document.activeElement, t0);
});

test("collapse toggles from trigger click and keyboard", async () => {
  installDom(`
    <div id="collapse" data-nb-collapse>
      <button id="trigger" data-nb-collapse-trigger aria-expanded="false" aria-controls="panel" type="button">Trigger</button>
      <div id="panel" data-nb-collapse-panel role="region">Content</div>
    </div>
  `);

  const root = document.getElementById("collapse");
  const trigger = document.getElementById("trigger");
  const panel = document.getElementById("panel");

  const { createCollapse } = await import(`../dist/collapse.js?test=${Date.now()}-collapse`);
  const collapse = createCollapse(root);

  assert.equal(collapse.isOpen, false);
  assert.equal(trigger.getAttribute("aria-expanded"), "false");
  assert.equal(panel.getAttribute("aria-hidden"), "true");

  trigger.click();
  assert.equal(collapse.isOpen, true);
  assert.equal(trigger.getAttribute("aria-expanded"), "true");
  assert.equal(panel.getAttribute("aria-hidden"), "false");

  trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
  assert.equal(collapse.isOpen, false);
  assert.equal(trigger.getAttribute("aria-expanded"), "false");

  trigger.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
  assert.equal(collapse.isOpen, true);
});
