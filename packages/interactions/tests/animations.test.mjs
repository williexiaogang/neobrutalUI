import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { Window } from "happy-dom";

let window;
let reducedMotion = false;

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
  globalThis.requestAnimationFrame = window.requestAnimationFrame.bind(window);
  globalThis.cancelAnimationFrame = window.cancelAnimationFrame.bind(window);
  globalThis.IntersectionObserver = class {
    constructor(callback) {
      this.callback = callback;
      this.entries = [];
    }
    observe(target) {
      this.entries.push({ target, isIntersecting: true });
      // Trigger immediately for tests
      this.callback(this.entries, this);
    }
    unobserve() {}
    disconnect() {}
  };

  window.matchMedia = (query) => ({
    matches: reducedMotion,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent() {
      return false;
    },
  });
}

beforeEach(() => {
  reducedMotion = false;
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
  delete globalThis.requestAnimationFrame;
  delete globalThis.cancelAnimationFrame;
  delete globalThis.IntersectionObserver;
});

test("reveal animates elements into view", async () => {
  installDom(`
    <div class="reveal-item" style="opacity: 0;">One</div>
    <div class="reveal-item" style="opacity: 0;">Two</div>
  `);

  const { reveal } = await import(`../dist/animations.js?test=${Date.now()}-reveal`);
  const destroy = reveal(".reveal-item", { duration: 300 });

  const items = document.querySelectorAll(".reveal-item");
  // After IntersectionObserver triggers and rAF runs, styles should be animated
  assert.equal(items[0].style.willChange, "transform, opacity");

  destroy();
});

test("reveal skips animation under reduced motion", async () => {
  reducedMotion = true;
  installDom(`
    <div class="reveal-item" style="opacity: 0;">One</div>
    <div class="reveal-item" style="opacity: 0;">Two</div>
  `);

  const { reveal } = await import(`../dist/animations.js?test=${Date.now()}-reveal-reduced`);
  reveal(".reveal-item", { duration: 300 });

  const items = document.querySelectorAll(".reveal-item");
  assert.equal(items[0].style.opacity, "1");
  assert.equal(items[0].style.transform, "translateY(0)");
  assert.equal(items[1].style.opacity, "1");
  assert.equal(items[1].style.transform, "translateY(0)");
});

test("countUp animates to target value", async () => {
  installDom(`<span id="counter">0</span>`);

  const { countUp } = await import(`../dist/animations.js?test=${Date.now()}-countup`);
  const destroy = countUp(document.getElementById("counter"), 100, { duration: 200 });

  // After initialization, rAF should have updated at least once
  const value = parseInt(document.getElementById("counter").textContent, 10);
  assert.ok(value >= 0);

  destroy();
  assert.equal(document.getElementById("counter").textContent, "100");
});

test("countUp sets final value immediately under reduced motion", async () => {
  reducedMotion = true;
  installDom(`<span id="counter">0</span>`);

  const { countUp } = await import(`../dist/animations.js?test=${Date.now()}-countup-reduced`);
  countUp(document.getElementById("counter"), 2500, { duration: 200 });

  assert.equal(document.getElementById("counter").textContent, "2,500");
});

test("stagger animates multiple elements", async () => {
  installDom(`
    <div class="stagger-item">A</div>
    <div class="stagger-item">B</div>
    <div class="stagger-item">C</div>
  `);

  const { stagger } = await import(`../dist/animations.js?test=${Date.now()}-stagger`);
  const destroy = stagger(".stagger-item", { interval: 50, duration: 200 });

  const items = document.querySelectorAll(".stagger-item");
  assert.equal(items[0].style.willChange, "transform, opacity");

  destroy();
});

test("stagger skips animation under reduced motion", async () => {
  reducedMotion = true;
  installDom(`
    <div class="stagger-item" style="opacity: 0;">A</div>
    <div class="stagger-item" style="opacity: 0;">B</div>
  `);

  const { stagger } = await import(`../dist/animations.js?test=${Date.now()}-stagger-reduced`);
  stagger(".stagger-item", { interval: 50, duration: 200 });

  const items = document.querySelectorAll(".stagger-item");
  assert.equal(items[0].style.opacity, "");
  assert.equal(items[0].style.transform, "");
  assert.equal(items[0].style.willChange, "auto");
  assert.equal(items[1].style.opacity, "");
  assert.equal(items[1].style.transform, "");
});
