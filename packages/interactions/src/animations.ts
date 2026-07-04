// ============================================================================
// Neo-Brutal UI Interactions — Animation Helpers
// Zero-dependency, SSR-safe, reduced-motion-aware animation utilities.
// Uses only transform + opacity to avoid layout thrashing.
// ============================================================================

// ============================================================================
// SSR & motion preference guards
// ============================================================================

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

function prefersReducedMotion(): boolean {
  return isBrowser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ============================================================================
// Easing helpers
// ============================================================================

/** Easing map for countUp() */
const EASING_MAP: Record<string, (t: number) => number> = {
  linear: (t: number) => t,
  easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOut: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
};

/** Normalize CSS easing strings to JS easing functions */
function normalizeEasing(cssEasing: string): (t: number) => number {
  const key = cssEasing.toLowerCase().replace(/[\s-]/g, '');
  const map: Record<string, (t: number) => number> = {
    linear: EASING_MAP.linear,
    ease: EASING_MAP.easeOut,
    easein: EASING_MAP.easeInOut,
    easeout: EASING_MAP.easeOut,
    easeinout: EASING_MAP.easeInOut,
  };
  return map[key] ?? EASING_MAP.easeOut;
}

// ============================================================================
// Reveal — IntersectionObserver-triggered entrance animation
// ============================================================================

export interface RevealOptions {
  /** Intersection threshold. Default: 0.1 */
  threshold?: number;
  /** Root margin for the observer. Default: '0px' */
  rootMargin?: string;
  /** Animation duration in ms. Default: 300 */
  duration?: number;
  /** Animation delay in ms. Default: 0 */
  delay?: number;
  /** CSS easing function. Default: 'ease-out' */
  easing?: string;
  /** Vertical translate distance in px. Default: 20 */
  translateY?: number;
  /** Stagger delay between sibling elements in ms. Default: 0 */
  stagger?: number;
  /** Only trigger once. Default: true */
  once?: boolean;
}

interface RevealItem {
  element: HTMLElement;
  startTime: number | null;
  delay: number;
  done: boolean;
}

/**
 * Reveal elements as they scroll into view using IntersectionObserver.
 * Returns a destroy function to cancel the observer and any pending animations.
 */
export function reveal(selector: string, options: RevealOptions = {}): () => void {
  if (!isBrowser) return () => {};

  const {
    threshold = 0.1,
    rootMargin = '0px',
    duration = 300,
    delay = 0,
    easing = 'ease-out',
    translateY = 20,
    stagger = 0,
    once = true,
  } = options;

  const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
  if (elements.length === 0) return () => {};

  const easingFn = normalizeEasing(easing);

  // Reduced-motion: show final state immediately, skip animation
  if (prefersReducedMotion()) {
    for (const el of elements) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      el.style.willChange = 'auto';
    }
    return () => {};
  }

  // Prepare initial hidden state
  for (const el of elements) {
    el.style.opacity = '0';
    el.style.transform = `translateY(${translateY}px)`;
    el.style.willChange = 'transform, opacity';
  }

  const items = new Map<HTMLElement, RevealItem>();
  let rafId: number | null = null;

  function step(now: number): void {
    for (const [, item] of items) {
      if (item.done) continue;

      if (item.startTime === null) {
        item.startTime = now + item.delay;
      }

      if (now < item.startTime) continue;

      const elapsed = now - item.startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easingFn(progress);

      const y = translateY * (1 - eased);
      const opacity = eased;

      item.element.style.transform = `translateY(${y}px)`;
      item.element.style.opacity = `${opacity}`;

      if (progress >= 1) {
        item.element.style.willChange = 'auto';
        item.element.style.transform = '';
        item.element.style.opacity = '';
        item.done = true;
      }
    }

    const hasPending = Array.from(items.values()).some((item) => !item.done);
    if (hasPending) {
      rafId = requestAnimationFrame(step);
    } else {
      rafId = null;
    }
  }

  function startAnimation(target: HTMLElement, allElements: HTMLElement[], index: number): void {
    const staggerDelay = stagger > 0 && allElements.length > 1 ? index * stagger : 0;
    const item = {
      element: target,
      startTime: null,
      delay: delay + staggerDelay,
      done: false,
    };
    items.set(target, item);

    if (rafId === null) {
      rafId = requestAnimationFrame(step);
    }
  }

  const observerCallback: IntersectionObserverCallback = (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;

      const target = entry.target as HTMLElement;

      if (!items.has(target)) {
        const visibleIndex = elements.indexOf(target);
        startAnimation(target, elements, visibleIndex);
      }

      if (once) {
        observer.unobserve(target);
      }
    }
  };

  const observer = new IntersectionObserver(observerCallback, {
    threshold,
    rootMargin,
  });

  for (const el of elements) {
    observer.observe(el);
  }

  return function destroy(): void {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    observer.disconnect();
    for (const [, item] of items) {
      if (!item.done) {
        item.element.style.willChange = 'auto';
        item.element.style.transform = '';
        item.element.style.opacity = '';
      }
    }
    items.clear();
  };
}

// ============================================================================
// CountUp — Animate a number from 0 to a target value
// ============================================================================

export interface CountUpOptions {
  /** Animation duration in ms. Default: 2000 */
  duration?: number;
  /** Easing curve. Default: 'easeOut' */
  easing?: 'linear' | 'easeOut' | 'easeInOut';
  /** Thousands separator. Default: ',' */
  separator?: string;
  /** Decimal separator. Default: '.' */
  decimal?: string;
  /** Number of decimal places. Default: 0 */
  decimals?: number;
  /** Prefix string (e.g. '$'). Default: '' */
  prefix?: string;
  /** Suffix string (e.g. '%'). Default: '' */
  suffix?: string;
}

/**
 * Animate a number from 0 to the target value inside the given element.
 * Returns a destroy function that stops the animation and sets the final value.
 */
export function countUp(
  element: HTMLElement,
  target: number,
  options: CountUpOptions = {}
): () => void {
  if (!isBrowser) return () => {};

  const {
    duration = 2000,
    easing = 'easeOut',
    separator = ',',
    decimal = '.',
    decimals = 0,
    prefix = '',
    suffix = '',
  } = options;

  const easingFn = EASING_MAP[easing] ?? EASING_MAP.easeOut;
  let rafId: number | null = null;
  let startTime: number | null = null;

  function formatValue(value: number): string {
    const fixed = value.toFixed(decimals);
    const [intPart, decPart] = fixed.split('.');
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return `${prefix}${formattedInt}${decPart ? `${decimal}${decPart}` : ''}${suffix}`;
  }

  // Reduced-motion: set final value immediately
  if (prefersReducedMotion()) {
    element.textContent = formatValue(target);
    return () => {};
  }

  function step(now: number): void {
    if (startTime === null) startTime = now;
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easingFn(progress);
    const current = eased * target;

    element.textContent = formatValue(current);

    if (progress < 1) {
      rafId = requestAnimationFrame(step);
    } else {
      rafId = null;
    }
  }

  rafId = requestAnimationFrame(step);

  return function destroy(): void {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    // Ensure final value is set
    element.textContent = formatValue(target);
  };
}

// ============================================================================
// Stagger — Add a staggered entrance animation to multiple elements
// ============================================================================

export interface StaggerOptions {
  /** Delay between each element in ms. Default: 100 */
  interval?: number;
  /** Animation duration per element in ms. Default: 300 */
  duration?: number;
  /** CSS easing function. Default: 'ease-out' */
  easing?: string;
  /** Vertical translate distance in px. Default: 20 */
  translateY?: number;
  /** Animate opacity from 0 to 1. Default: true */
  opacity?: boolean;
}

/** Internal state for a single staggered element */
interface StaggerItem {
  element: HTMLElement;
  startTime: number | null;
  delay: number;
  done: boolean;
}

/**
 * Apply a staggered entrance animation to elements matching the selector.
 * Returns a destroy function that cancels all animations and resets styles.
 */
export function stagger(selector: string, options: StaggerOptions = {}): () => void {
  if (!isBrowser) return () => {};

  const {
    interval = 100,
    duration = 300,
    easing = 'ease-out',
    translateY = 20,
    opacity = true,
  } = options;

  const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
  if (elements.length === 0) return () => {};

  const easingFn = normalizeEasing(easing);

  // Reduced-motion: show final state immediately, skip animation
  if (prefersReducedMotion()) {
    for (const el of elements) {
      el.style.opacity = '';
      el.style.transform = '';
      el.style.willChange = 'auto';
    }
    return () => {};
  }

  // Prepare initial hidden state
  for (const el of elements) {
    el.style.opacity = opacity ? '0' : '';
    el.style.transform = `translateY(${translateY}px)`;
    el.style.willChange = 'transform, opacity';
  }

  const items = new Map<HTMLElement, StaggerItem>();
  let rafId: number | null = null;

  function step(now: number): void {
    for (const [, item] of items) {
      if (item.done) continue;

      if (item.startTime === null) {
        item.startTime = now + item.delay;
      }

      if (now < item.startTime) continue;

      const elapsed = now - item.startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easingFn(progress);

      const y = translateY * (1 - eased);
      item.element.style.transform = `translateY(${y}px)`;
      if (opacity) {
        item.element.style.opacity = `${eased}`;
      }

      if (progress >= 1) {
        item.element.style.willChange = 'auto';
        item.element.style.transform = '';
        if (opacity) item.element.style.opacity = '';
        item.done = true;
      }
    }

    const hasPending = Array.from(items.values()).some((item) => !item.done);
    if (hasPending) {
      rafId = requestAnimationFrame(step);
    } else {
      rafId = null;
    }
  }

  // Initialize each item with its staggered delay
  for (let i = 0; i < elements.length; i++) {
    const staggerDelay = elements.length > 1 ? i * interval : 0;
    items.set(elements[i], {
      element: elements[i],
      startTime: null,
      delay: staggerDelay,
      done: false,
    });
  }

  // Kick off the animation loop
  rafId = requestAnimationFrame(step);

  return function destroy(): void {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    for (const [, item] of items) {
      if (!item.done) {
        item.element.style.willChange = 'auto';
        item.element.style.transform = '';
        if (opacity) item.element.style.opacity = '';
      }
    }
    items.clear();
  };
}
