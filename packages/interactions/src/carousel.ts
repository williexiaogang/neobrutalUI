// ============================================================================
// Neo-Brutal UI Interactions — Carousel
// WAI-ARIA compliant keyboard navigation + scroll snapping + optional auto-play.
// ============================================================================

import type { CarouselOptions, CarouselInstance } from './types.js';
import {
  createEventManager,
  createStateManager,
  initRegistry,
  isInitialized,
  registerInstance,
  getInstance,
  dispatchNamespacedEvent,
} from './factory.js';

const NAMESPACE = 'nb:carousel';
const EVENT_CHANGE = `${NAMESPACE}:change`;

/**
 * Create a carousel interaction instance.
 *
 * Expected markup (simplified):
 *   <div data-nb-carousel class="nb-carousel">
 *     <div class="nb-carousel-viewport">
 *       <div class="nb-carousel-track" role="region" aria-label="Featured items" aria-roledescription="carousel">
 *         <div class="nb-carousel-slide" role="group" aria-roledescription="slide" aria-label="1 of 3">…</div>
 *         <div class="nb-carousel-slide" role="group" aria-roledescription="slide" aria-label="2 of 3">…</div>
 *         <div class="nb-carousel-slide" role="group" aria-roledescription="slide" aria-label="3 of 3">…</div>
 *       </div>
 *     </div>
 *     <button class="nb-carousel-nav nb-carousel-nav-prev" aria-controls="track-id">‹</button>
 *     <button class="nb-carousel-nav nb-carousel-nav-next" aria-controls="track-id">›</button>
 *     <div class="nb-carousel-dots" role="tablist" aria-label="Slides">
 *       <button class="nb-carousel-dot nb-carousel-dot-active" role="tab" aria-selected="true" aria-label="Slide 1" aria-controls="track-id"></button>
 *       <button class="nb-carousel-dot" role="tab" aria-selected="false" aria-label="Slide 2" aria-controls="track-id"></button>
 *     </div>
 *   </div>
 */
export function createCarousel(element: HTMLElement, options: CarouselOptions = {}): CarouselInstance {
  if (!element || !(element instanceof HTMLElement)) {
    throw new TypeError(`[${NAMESPACE}] createCarousel requires a valid HTMLElement. Received: ${typeof element}`);
  }

  if (isInitialized(element)) {
    console.warn(`[${NAMESPACE}] Element already initialized. Returning existing instance.`);
    return (getInstance(element) as unknown as CarouselInstance) ?? createCarousel(element, options);
  }

  const {
    defaultIndex = 0,
    autoPlay = 0,
    pauseOnHover = true,
    pauseOnFocus = true,
    loop = false,
    onChange,
    onPlay,
    onPause,
  } = options;

  const track = element.querySelector<HTMLElement>('.nb-carousel-track');
  if (!track) {
    throw new Error(`[${NAMESPACE}] No .nb-carousel-track found inside the provided element.`);
  }

  const slides = Array.from(track.querySelectorAll<HTMLElement>('.nb-carousel-slide'));
  if (slides.length === 0) {
    throw new Error(`[${NAMESPACE}] No .nb-carousel-slide elements found inside the track.`);
  }

  const prevBtn = element.querySelector<HTMLButtonElement>('.nb-carousel-nav-prev');
  const nextBtn = element.querySelector<HTMLButtonElement>('.nb-carousel-nav-next');
  const dots = Array.from(element.querySelectorAll<HTMLButtonElement>('.nb-carousel-dot'));

  const events = createEventManager();
  const state = createStateManager(false);
  let activeIndex = -1;
  let autoPlayTimer: ReturnType<typeof setInterval> | null = null;
  let cleanupState: (() => void) | undefined;

  // --------------------------------------------------------------------------
  // Core navigation
  // --------------------------------------------------------------------------

  function syncDots(index: number): void {
    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i];
      const isActive = i === index;
      dot.setAttribute('aria-selected', String(isActive));
      dot.setAttribute('tabindex', isActive ? '0' : '-1');
      dot.classList.toggle('nb-carousel-dot-active', isActive);
    }
  }

  function syncNavButtons(index: number): void {
    if (prevBtn) {
      prevBtn.disabled = !loop && index === 0;
    }
    if (nextBtn) {
      nextBtn.disabled = !loop && index === slides.length - 1;
    }
  }

  function scrollToSlide(index: number): void {
    const slide = slides[index];
    if (!slide) return;
    track!.scrollTo({
      left: slide.offsetLeft - track!.offsetLeft,
      behavior: 'smooth',
    });
  }

  function goTo(index: number): void {
    if (index < 0 || index >= slides.length) return;
    if (index === activeIndex) return;

    const previousIndex = activeIndex;
    activeIndex = index;

    const allowed = dispatchNamespacedEvent(slides[index], EVENT_CHANGE, {
      previousIndex: previousIndex >= 0 ? previousIndex : null,
      activeIndex: index,
      slide: slides[index],
    });

    if (!allowed) {
      activeIndex = previousIndex;
      return;
    }

    scrollToSlide(index);
    syncDots(index);
    syncNavButtons(index);
    state.set(true);

    onChange?.(index, previousIndex >= 0 ? previousIndex : 0);
  }

  function next(): void {
    if (activeIndex < slides.length - 1) {
      goTo(activeIndex + 1);
    } else if (loop) {
      goTo(0);
    }
  }

  function prev(): void {
    if (activeIndex > 0) {
      goTo(activeIndex - 1);
    } else if (loop) {
      goTo(slides.length - 1);
    }
  }

  // --------------------------------------------------------------------------
  // Auto-play
  // --------------------------------------------------------------------------

  function startAutoPlay(): void {
    if (autoPlay <= 0 || autoPlayTimer) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    autoPlayTimer = setInterval(() => {
      next();
    }, autoPlay);
    onPlay?.();
  }

  function stopAutoPlay(): void {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
      onPause?.();
    }
  }

  // --------------------------------------------------------------------------
  // Keyboard navigation
  // --------------------------------------------------------------------------

  function handleKeydown(e: KeyboardEvent): void {
    const keys = {
      next: 'ArrowRight',
      prev: 'ArrowLeft',
      first: 'Home',
      last: 'End',
    };

    let targetIndex = -1;

    if (e.key === keys.next) {
      targetIndex = activeIndex + 1 < slides.length ? activeIndex + 1 : (loop ? 0 : -1);
    } else if (e.key === keys.prev) {
      targetIndex = activeIndex - 1 >= 0 ? activeIndex - 1 : (loop ? slides.length - 1 : -1);
    } else if (e.key === keys.first) {
      targetIndex = 0;
    } else if (e.key === keys.last) {
      targetIndex = slides.length - 1;
    }

    if (targetIndex >= 0) {
      e.preventDefault();
      goTo(targetIndex);
    }
  }

  // --------------------------------------------------------------------------
  // Event wiring
  // --------------------------------------------------------------------------

  if (prevBtn) {
    events.add(prevBtn, 'click', () => {
      prev();
    });
  }

  if (nextBtn) {
    events.add(nextBtn, 'click', () => {
      next();
    });
  }

  dots.forEach((dot, index) => {
    events.add(dot, 'click', () => goTo(index));
  });

  events.add(track, 'keydown', handleKeydown);

  // Pause on hover / focus
  if (pauseOnHover) {
    events.add(element, 'mouseenter', stopAutoPlay);
    events.add(element, 'mouseleave', startAutoPlay);
  }

  if (pauseOnFocus) {
    events.add(element, 'focusin', stopAutoPlay);
    events.add(element, 'focusout', startAutoPlay);
  }

  // IntersectionObserver for scroll-snap sync (optional refinement)
  const intersectionObserver = typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = slides.indexOf(entry.target as HTMLElement);
              if (index !== -1 && index !== activeIndex) {
                // Silent sync — don't fire goTo to avoid scroll fight
                const previousIndex = activeIndex;
                activeIndex = index;
                syncDots(index);
                syncNavButtons(index);
                onChange?.(index, previousIndex >= 0 ? previousIndex : 0);
              }
            }
          });
        },
        { root: track, threshold: 0.6 }
      )
    : null;

  slides.forEach((slide) => intersectionObserver?.observe(slide));

  // --------------------------------------------------------------------------
  // Instance
  // --------------------------------------------------------------------------

  const instance: CarouselInstance = {
    open() {
      if (activeIndex < 0) goTo(defaultIndex);
      state.set(true);
    },
    close() {
      stopAutoPlay();
      state.set(false);
    },
    toggle() {
      if (state.value) {
        this.close();
      } else {
        this.open();
      }
    },
    goTo,
    next,
    prev,
    play: startAutoPlay,
    pause: stopAutoPlay,
    destroy() {
      stopAutoPlay();
      events.destroy();
      intersectionObserver?.disconnect();
      cleanupState?.();
      state.clear();
      initRegistry.delete(element);
    },
    get isOpen(): boolean {
      return state.value;
    },
    get activeIndex(): number {
      return activeIndex;
    },
    get isPlaying(): boolean {
      return autoPlayTimer !== null;
    },
    get slideCount(): number {
      return slides.length;
    },
  };

  registerInstance(element, instance);
  cleanupState = state.subscribe((isOpen) => {
    element.setAttribute('data-nb-state', isOpen ? 'open' : 'closed');
  });

  // Initialize
  const initial = Math.min(Math.max(defaultIndex, 0), slides.length - 1);
  activeIndex = initial;
  syncDots(initial);
  syncNavButtons(initial);
  scrollToSlide(initial);

  if (autoPlay > 0) {
    startAutoPlay();
  }

  return instance;
}
