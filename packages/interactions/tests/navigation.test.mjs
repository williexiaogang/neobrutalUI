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

test("navbar toggles collapse on click and keyboard", async () => {
  installDom(`
    <nav id="navbar" class="nb-navbar" data-nb-navbar aria-label="Main navigation">
      <a href="#" class="nb-navbar-brand">NeoBrand</a>
      <div id="collapse" class="nb-navbar-collapse">
        <ul class="nb-navbar-nav">
          <li><a href="#">Home</a></li>
        </ul>
      </div>
      <button id="toggle" class="nb-navbar-toggle" type="button" aria-expanded="false" aria-controls="collapse">
        <span aria-hidden="true">☰</span>
      </button>
    </nav>
  `);

  const root = document.getElementById("navbar");
  const toggle = document.getElementById("toggle");
  const collapse = document.getElementById("collapse");

  const { createNavbar } = await import(`../dist/navbar.js?test=${Date.now()}-navbar`);
  const navbar = createNavbar(root);

  assert.equal(navbar.isOpen, false);
  assert.equal(toggle.getAttribute("aria-expanded"), "false");
  assert.equal(collapse.classList.contains("is-open"), false);

  toggle.click();
  assert.equal(navbar.isOpen, true);
  assert.equal(toggle.getAttribute("aria-expanded"), "true");
  assert.equal(collapse.classList.contains("is-open"), true);

  toggle.click();
  assert.equal(navbar.isOpen, false);
  assert.equal(toggle.getAttribute("aria-expanded"), "false");
  assert.equal(collapse.classList.contains("is-open"), false);

  toggle.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
  assert.equal(navbar.isOpen, true);

  toggle.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
  assert.equal(navbar.isOpen, false);
});

test("navbar closes on Escape and destroys cleanly", async () => {
  installDom(`
    <nav id="navbar" class="nb-navbar" data-nb-navbar aria-label="Main navigation">
      <a href="#" class="nb-navbar-brand">NeoBrand</a>
      <div id="collapse" class="nb-navbar-collapse">
        <ul class="nb-navbar-nav">
          <li><a id="link" href="#">Home</a></li>
        </ul>
      </div>
      <button id="toggle" class="nb-navbar-toggle" type="button" aria-expanded="false" aria-controls="collapse">
        <span aria-hidden="true">☰</span>
      </button>
    </nav>
  `);

  const root = document.getElementById("navbar");
  const toggle = document.getElementById("toggle");

  const { createNavbar } = await import(`../dist/navbar.js?test=${Date.now()}-navbar-escape`);
  const navbar = createNavbar(root);

  navbar.open();
  assert.equal(navbar.isOpen, true);

  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  assert.equal(navbar.isOpen, false);
  assert.equal(toggle.getAttribute("aria-expanded"), "false");

  navbar.open();
  navbar.destroy();

  // After destroy, clicking toggle should no longer toggle the state.
  toggle.click();
  assert.equal(root.querySelector("#collapse").classList.contains("is-open"), true);
  // The class was set by the initial open() call; since we destroyed the instance,
  // the click should not have closed it again.
});

test("navbar initializes from markup when aria-expanded is true", async () => {
  installDom(`
    <nav id="navbar" class="nb-navbar" data-nb-navbar aria-label="Main navigation">
      <a href="#" class="nb-navbar-brand">NeoBrand</a>
      <div id="collapse" class="nb-navbar-collapse">
        <ul class="nb-navbar-nav">
          <li><a href="#">Home</a></li>
        </ul>
      </div>
      <button id="toggle" class="nb-navbar-toggle" type="button" aria-expanded="true" aria-controls="collapse">
        <span aria-hidden="true">☰</span>
      </button>
    </nav>
  `);

  const root = document.getElementById("navbar");
  const collapse = document.getElementById("collapse");

  const { createNavbar } = await import(`../dist/navbar.js?test=${Date.now()}-navbar-init`);
  const navbar = createNavbar(root);

  assert.equal(navbar.isOpen, true);
  assert.equal(collapse.classList.contains("is-open"), true);
});

test("calendar renders grid and navigates months", async () => {
  installDom(`
    <div id="cal" class="nb-calendar" data-nb-calendar data-year="2025" data-month="6" role="application" aria-label="Calendar">
      <div class="nb-calendar-header">
        <button class="nb-calendar-nav-btn" type="button" aria-label="Previous month">‹</button>
        <span class="nb-calendar-title" aria-live="polite">June 2025</span>
        <button class="nb-calendar-nav-btn" type="button" aria-label="Next month">›</button>
      </div>
      <div class="nb-calendar-weekdays" aria-hidden="true"></div>
      <div class="nb-calendar-grid" role="grid"></div>
    </div>
  `);

  const root = document.getElementById("cal");
  const title = root.querySelector(".nb-calendar-title");

  const { createCalendar } = await import(`../dist/calendar.js?test=${Date.now()}-calendar-nav`);
  const calendar = createCalendar(root);

  const days = root.querySelectorAll(".nb-calendar-day");
  assert.equal(days.length > 0, true);
  assert.equal(title.textContent, "June 2025");

  const nextBtn = root.querySelectorAll(".nb-calendar-nav-btn")[1];
  nextBtn.click();
  assert.equal(title.textContent, "July 2025");

  const prevBtn = root.querySelectorAll(".nb-calendar-nav-btn")[0];
  prevBtn.click();
  assert.equal(title.textContent, "June 2025");
});

test("calendar selects a single date", async () => {
  installDom(`
    <div id="cal" class="nb-calendar" data-nb-calendar data-year="2025" data-month="6" role="application" aria-label="Calendar">
      <div class="nb-calendar-header">
        <button class="nb-calendar-nav-btn" type="button" aria-label="Previous month">‹</button>
        <span class="nb-calendar-title" aria-live="polite">June 2025</span>
        <button class="nb-calendar-nav-btn" type="button" aria-label="Next month">›</button>
      </div>
      <div class="nb-calendar-weekdays" aria-hidden="true"></div>
      <div class="nb-calendar-grid" role="grid"></div>
    </div>
  `);

  const root = document.getElementById("cal");

  const { createCalendar } = await import(`../dist/calendar.js?test=${Date.now()}-calendar-select`);
  const calendar = createCalendar(root, { today: "2025-06-06" });

  const day = root.querySelector('[data-date="2025-06-15"]');
  day.click();

  assert.equal(calendar.value.getDate(), 15);
  assert.equal(day.classList.contains("nb-calendar-day-selected"), true);
  assert.equal(day.getAttribute("aria-selected"), "true");
});

test("calendar selects a range", async () => {
  installDom(`
    <div id="cal" class="nb-calendar" data-nb-calendar data-year="2025" data-month="6" role="application" aria-label="Calendar">
      <div class="nb-calendar-header">
        <button class="nb-calendar-nav-btn" type="button" aria-label="Previous month">‹</button>
        <span class="nb-calendar-title" aria-live="polite">June 2025</span>
        <button class="nb-calendar-nav-btn" type="button" aria-label="Next month">›</button>
      </div>
      <div class="nb-calendar-weekdays" aria-hidden="true"></div>
      <div class="nb-calendar-grid" role="grid"></div>
    </div>
  `);

  const root = document.getElementById("cal");

  const { createCalendar } = await import(`../dist/calendar.js?test=${Date.now()}-calendar-range`);
  const calendar = createCalendar(root, { mode: "range", today: "2025-06-06" });

  root.querySelector('[data-date="2025-06-10"]').click();
  root.querySelector('[data-date="2025-06-14"]').click();

  assert.equal(calendar.range.start.getDate(), 10);
  assert.equal(calendar.range.end.getDate(), 14);
  assert.equal(root.querySelector('[data-date="2025-06-10"]').classList.contains("nb-calendar-day-range-start"), true);
  assert.equal(root.querySelector('[data-date="2025-06-14"]').classList.contains("nb-calendar-day-range-end"), true);
  assert.equal(root.querySelector('[data-date="2025-06-12"]').classList.contains("nb-calendar-day-range-mid"), true);
});

test("calendar disables dates outside min and max", async () => {
  installDom(`
    <div id="cal" class="nb-calendar" data-nb-calendar data-year="2025" data-month="6" role="application" aria-label="Calendar">
      <div class="nb-calendar-header">
        <button class="nb-calendar-nav-btn" type="button" aria-label="Previous month">‹</button>
        <span class="nb-calendar-title" aria-live="polite">June 2025</span>
        <button class="nb-calendar-nav-btn" type="button" aria-label="Next month">›</button>
      </div>
      <div class="nb-calendar-weekdays" aria-hidden="true"></div>
      <div class="nb-calendar-grid" role="grid"></div>
    </div>
  `);

  const root = document.getElementById("cal");

  const { createCalendar } = await import(`../dist/calendar.js?test=${Date.now()}-calendar-disabled`);
  createCalendar(root, { minDate: "2025-06-05", maxDate: "2025-06-25", today: "2025-06-06" });

  assert.equal(root.querySelector('[data-date="2025-06-04"]').classList.contains("nb-calendar-day-disabled"), true);
  assert.equal(root.querySelector('[data-date="2025-06-26"]').classList.contains("nb-calendar-day-disabled"), true);
  assert.equal(root.querySelector('[data-date="2025-06-10"]').classList.contains("nb-calendar-day-disabled"), false);
});

test("calendar keyboard navigation moves focus", async () => {
  installDom(`
    <div id="cal" class="nb-calendar" data-nb-calendar data-year="2025" data-month="6" role="application" aria-label="Calendar">
      <div class="nb-calendar-header">
        <button class="nb-calendar-nav-btn" type="button" aria-label="Previous month">‹</button>
        <span class="nb-calendar-title" aria-live="polite">June 2025</span>
        <button class="nb-calendar-nav-btn" type="button" aria-label="Next month">›</button>
      </div>
      <div class="nb-calendar-weekdays" aria-hidden="true"></div>
      <div class="nb-calendar-grid" role="grid"></div>
    </div>
  `);

  const root = document.getElementById("cal");

  const { createCalendar } = await import(`../dist/calendar.js?test=${Date.now()}-calendar-keyboard`);
  const calendar = createCalendar(root, { today: "2025-06-10" });

  const day10 = root.querySelector('[data-date="2025-06-10"]');
  day10.focus();
  assert.equal(document.activeElement, day10);

  day10.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
  assert.equal(document.activeElement.getAttribute("data-date"), "2025-06-11");

  document.activeElement.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
  assert.equal(document.activeElement.getAttribute("data-date"), "2025-06-18");
});
