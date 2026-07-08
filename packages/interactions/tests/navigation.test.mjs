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
  globalThis.IntersectionObserver = class {
    observe() {}
    disconnect() {}
    unobserve() {}
  };
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
  delete globalThis.IntersectionObserver;
});

test("rating selects value on click and keyboard", async () => {
  installDom(`
    <div id="rating" data-nb-rating role="radiogroup" aria-label="Rate">
      <span id="s1" data-nb-rating-item data-value="1" role="radio" aria-checked="false" tabindex="0">★</span>
      <span id="s2" data-nb-rating-item data-value="2" role="radio" aria-checked="false" tabindex="-1">★</span>
      <span id="s3" data-nb-rating-item data-value="3" role="radio" aria-checked="false" tabindex="-1">★</span>
      <span id="s4" data-nb-rating-item data-value="4" role="radio" aria-checked="false" tabindex="-1">★</span>
      <span id="s5" data-nb-rating-item data-value="5" role="radio" aria-checked="false" tabindex="-1">★</span>
    </div>
  `);

  const root = document.getElementById("rating");
  const s3 = document.getElementById("s3");

  const { createRating } = await import(`../dist/rating.js?test=${Date.now()}-rating`);
  const rating = createRating(root);

  assert.equal(rating.value, 0);

  s3.click();
  assert.equal(rating.value, 3);
  assert.equal(s3.getAttribute("aria-checked"), "true");
  assert.equal(s3.classList.contains("nb-rating-item-filled"), true);

  root.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
  assert.equal(rating.value, 4);

  root.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
  assert.equal(rating.value, 1);

  root.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  assert.equal(rating.value, 0);
});

test("rating supports half steps", async () => {
  installDom(`
    <div id="rating" data-nb-rating role="radiogroup" aria-label="Rate">
      <span id="s1" data-nb-rating-item data-value="1" role="radio" aria-checked="false" tabindex="0">★</span>
      <span id="s2" data-nb-rating-item data-value="2" role="radio" aria-checked="false" tabindex="-1">★</span>
    </div>
  `);

  const root = document.getElementById("rating");

  const { createRating } = await import(`../dist/rating.js?test=${Date.now()}-rating-half`);
  const rating = createRating(root, { allowHalf: true });

  root.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
  assert.equal(rating.value, 0.5);

  root.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
  assert.equal(rating.value, 1);
});

test("menu cycles through enabled items with arrow keys", async () => {
  installDom(`
    <ul id="menu" role="menubar">
      <li id="i0" class="nb-menu-item" role="menuitem" tabindex="0">Open</li>
      <li id="i1" class="nb-menu-item nb-menu-item-disabled" role="menuitem" tabindex="-1">Save</li>
      <li id="i2" class="nb-menu-item" role="menuitem" tabindex="-1">Close</li>
    </ul>
  `);

  const root = document.getElementById("menu");
  const i0 = document.getElementById("i0");

  const { createMenu } = await import(`../dist/menu.js?test=${Date.now()}-menu`);
  const menu = createMenu(root, { orientation: "vertical" });

  menu.open();
  assert.equal(document.activeElement, i0);

  i0.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

  const i2 = document.getElementById("i2");
  assert.equal(document.activeElement, i2);
  assert.equal(i2.getAttribute("tabindex"), "0");

  i2.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
  assert.equal(document.activeElement, i0);
});

test("menu selects an item on Enter", async () => {
  installDom(`
    <ul id="menu" role="menubar">
      <li id="i0" class="nb-menu-item" role="menuitem" tabindex="0">Open</li>
      <li id="i1" class="nb-menu-item" role="menuitem" tabindex="-1">Close</li>
    </ul>
  `);

  const root = document.getElementById("menu");
  const i0 = document.getElementById("i0");
  let selected = null;

  const { createMenu } = await import(`../dist/menu.js?test=${Date.now()}-menu-select`);
  const menu = createMenu(root, {
    orientation: "vertical",
    onSelect: (item) => {
      selected = item.id;
    },
  });

  menu.open();
  i0.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

  assert.equal(selected, "i0");
  assert.equal(menu.isOpen, false);
});

test("carousel navigates slides and syncs dots", async () => {
  installDom(`
    <div id="carousel" class="nb-carousel">
      <div class="nb-carousel-viewport">
        <div class="nb-carousel-track" role="region" aria-label="Items">
          <div class="nb-carousel-slide">Slide 1</div>
          <div class="nb-carousel-slide">Slide 2</div>
          <div class="nb-carousel-slide">Slide 3</div>
        </div>
      </div>
      <button class="nb-carousel-nav nb-carousel-nav-prev" type="button">Prev</button>
      <button class="nb-carousel-nav nb-carousel-nav-next" type="button">Next</button>
      <ol class="nb-carousel-dots" role="tablist">
        <li><button id="d0" class="nb-carousel-dot nb-carousel-dot-active" role="tab" aria-selected="true" aria-label="Slide 1"></button></li>
        <li><button id="d1" class="nb-carousel-dot" role="tab" aria-selected="false" aria-label="Slide 2"></button></li>
        <li><button id="d2" class="nb-carousel-dot" role="tab" aria-selected="false" aria-label="Slide 3"></button></li>
      </ol>
    </div>
  `);

  const root = document.getElementById("carousel");
  const nextBtn = root.querySelector(".nb-carousel-nav-next");
  const d0 = document.getElementById("d0");
  const d1 = document.getElementById("d1");
  const d2 = document.getElementById("d2");

  const { createCarousel } = await import(`../dist/carousel.js?test=${Date.now()}-carousel`);
  const carousel = createCarousel(root);

  assert.equal(carousel.activeIndex, 0);
  assert.equal(d0.getAttribute("aria-selected"), "true");
  assert.equal(d0.classList.contains("nb-carousel-dot-active"), true);

  nextBtn.click();
  assert.equal(carousel.activeIndex, 1);
  assert.equal(d1.getAttribute("aria-selected"), "true");
  assert.equal(d1.classList.contains("nb-carousel-dot-active"), true);
  assert.equal(d0.getAttribute("aria-selected"), "false");

  carousel.goTo(2);
  assert.equal(carousel.activeIndex, 2);
  assert.equal(d2.getAttribute("aria-selected"), "true");

  carousel.prev();
  assert.equal(carousel.activeIndex, 1);
});

test("carousel loops when enabled", async () => {
  installDom(`
    <div id="carousel" class="nb-carousel">
      <div class="nb-carousel-viewport">
        <div class="nb-carousel-track" role="region" aria-label="Items">
          <div class="nb-carousel-slide">Slide 1</div>
          <div class="nb-carousel-slide">Slide 2</div>
        </div>
      </div>
      <button class="nb-carousel-nav nb-carousel-nav-prev" type="button">Prev</button>
      <button class="nb-carousel-nav nb-carousel-nav-next" type="button">Next</button>
      <ol class="nb-carousel-dots" role="tablist">
        <li><button id="d0" class="nb-carousel-dot nb-carousel-dot-active" role="tab" aria-selected="true"></button></li>
        <li><button id="d1" class="nb-carousel-dot" role="tab" aria-selected="false"></button></li>
      </ol>
    </div>
  `);

  const root = document.getElementById("carousel");
  const nextBtn = root.querySelector(".nb-carousel-nav-next");

  const { createCarousel } = await import(`../dist/carousel.js?test=${Date.now()}-carousel-loop`);
  const carousel = createCarousel(root, { loop: true });

  nextBtn.click();
  assert.equal(carousel.activeIndex, 1);

  nextBtn.click();
  assert.equal(carousel.activeIndex, 0);
});
