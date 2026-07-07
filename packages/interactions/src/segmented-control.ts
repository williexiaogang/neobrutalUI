// ============================================================================
// Neo-Brutal UI Interactions — Segmented Control
// Keyboard navigation and focus management for radio-based segmented controls.
// ============================================================================

import type { SegmentedControlOptions, SegmentedControlInstance } from './types.js';
import {
  createEventManager,
  createStateManager,
  initRegistry,
  isInitialized,
  registerInstance,
  getInstance,
  dispatchNamespacedEvent,
} from './factory.js';

const NAMESPACE = 'nb:segmented';
const EVENT_CHANGE = `${NAMESPACE}:change`;

/**
 * Create a segmented control interaction instance.
 *
 * Expected markup:
 *   <div class="nb-segmented" role="radiogroup" aria-label="View type" data-nb-segmented>
 *     <label class="nb-segmented-item">
 *       <input type="radio" name="view" value="list" />
 *       List
 *     </label>
 *     ...
 *   </div>
 */
export function createSegmentedControl(
  element: HTMLElement,
  options: SegmentedControlOptions = {}
): SegmentedControlInstance {
  if (!element || !(element instanceof HTMLElement)) {
    throw new TypeError(
      `[${NAMESPACE}] createSegmentedControl requires a valid HTMLElement. Received: ${typeof element}`
    );
  }

  if (isInitialized(element)) {
    console.warn(`[${NAMESPACE}] Element already initialized. Returning existing instance.`);
    return getInstance(element) as SegmentedControlInstance ?? createSegmentedControl(element, options);
  }

  const { defaultValue, onChange } = options;

  const items = Array.from(element.querySelectorAll<HTMLElement>('.nb-segmented-item'));
  if (items.length === 0) {
    throw new Error(`[${NAMESPACE}] No .nb-segmented-item elements found inside the provided element.`);
  }

  const radios = items
    .map((item) => item.querySelector<HTMLInputElement>('input[type="radio"]'))
    .filter((radio): radio is HTMLInputElement => radio !== null);

  if (radios.length === 0) {
    throw new Error(`[${NAMESPACE}] No radio inputs found inside .nb-segmented-item elements.`);
  }

  const events = createEventManager();
  const state = createStateManager(false);
  let cleanupState: (() => void) | undefined;
  let activeIndex = radios.findIndex((radio) => radio.checked);
  if (activeIndex < 0 && defaultValue) {
    activeIndex = radios.findIndex((radio) => radio.value === defaultValue);
  }
  if (activeIndex < 0) activeIndex = 0;

  const isVertical = element.classList.contains('nb-segmented-vertical');

  function updateFocusTargets(): void {
    radios.forEach((_, index) => {
      const item = items[index];
      if (!item) return;
      item.setAttribute('tabindex', index === activeIndex ? '0' : '-1');
    });
  }

  function select(index: number): void {
    if (index < 0 || index >= radios.length) return;
    if (index === activeIndex && radios[index].checked) return;

    const previousIndex = activeIndex;
    activeIndex = index;

    radios.forEach((radio, i) => {
      radio.checked = i === index;
      radio.setAttribute('aria-checked', String(i === index));
    });

    const value = radios[index].value;
    onChange?.(value, index);
    dispatchNamespacedEvent(element, EVENT_CHANGE, {
      value,
      index,
      previousIndex,
      radio: radios[index],
    });

    updateFocusTargets();
    items[index]?.focus();
  }

  function focusItem(index: number): void {
    const target = items[Math.min(Math.max(index, 0), items.length - 1)];
    if (target) {
      target.focus();
    }
  }

  function handleKeydown(e: KeyboardEvent, index: number): void {
    const keys = {
      next: isVertical ? 'ArrowDown' : 'ArrowRight',
      prev: isVertical ? 'ArrowUp' : 'ArrowLeft',
      first: 'Home',
      last: 'End',
    };

    let targetIndex = -1;

    if (e.key === keys.next) {
      targetIndex = (index + 1) % radios.length;
    } else if (e.key === keys.prev) {
      targetIndex = (index - 1 + radios.length) % radios.length;
    } else if (e.key === keys.first) {
      targetIndex = 0;
    } else if (e.key === keys.last) {
      targetIndex = radios.length - 1;
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      select(index);
      return;
    }

    if (targetIndex >= 0) {
      e.preventDefault();
      activeIndex = targetIndex;
      updateFocusTargets();
      focusItem(targetIndex);
    }
  }

  function handleClick(index: number): void {
    select(index);
  }

  items.forEach((item, index) => {
    events.add(item, 'keydown', (e: KeyboardEvent) => handleKeydown(e, index));
    events.add(item, 'click', () => handleClick(index));
    // Clicking the native radio also triggers the label click; we handle it on the label.
  });

  const instance: SegmentedControlInstance = {
    select,
    get value(): string {
      return radios[activeIndex]?.value ?? '';
    },
    get activeIndex(): number {
      return activeIndex;
    },
    get isOpen(): boolean {
      return state.value;
    },
    open() {
      state.set(true);
      items[activeIndex]?.focus();
    },
    close() {
      state.set(false);
    },
    toggle() {
      state.toggle();
    },
    destroy() {
      events.destroy();
      cleanupState?.();
      state.clear();
      initRegistry.delete(element);
    },
  };

  registerInstance(element, instance);
  cleanupState = state.subscribe((isOpen) => {
    element.setAttribute('data-nb-state', isOpen ? 'open' : 'closed');
  });

  // Initial sync
  select(activeIndex);

  return instance;
}
