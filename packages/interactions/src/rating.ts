// ============================================================================
// Neo-Brutal UI Interactions — Rating
// Click-to-select star rating with keyboard navigation and ARIA support.
// ============================================================================

import type { RatingOptions, RatingInstance } from './types.js';
import {
  createEventManager,
  initRegistry,
  isInitialized,
  registerInstance,
  getInstance,
  dispatchNamespacedEvent,
} from './factory.js';

const NAMESPACE = 'nb:rating';
const EVENT_CHANGE = `${NAMESPACE}:change`;
const EVENT_HOVER = `${NAMESPACE}:hover`;
const EVENT_LEAVE = `${NAMESPACE}:leave`;

/**
 * Create a rating interaction instance.
 *
 * Expected markup:
 *   <div data-nb-rating aria-label="Rate this product" role="radiogroup">
 *     <span data-nb-rating-item data-value="1" role="radio" aria-checked="false" tabindex="0">★</span>
 *     <span data-nb-rating-item data-value="2" role="radio" aria-checked="false" tabindex="-1">★</span>
 *     ...
 *   </div>
 */
export function createRating(element: HTMLElement, options: RatingOptions = {}): RatingInstance {
  if (!element || !(element instanceof HTMLElement)) {
    throw new TypeError(`[${NAMESPACE}] createRating requires a valid HTMLElement. Received: ${typeof element}`);
  }

  if (isInitialized(element)) {
    console.warn(`[${NAMESPACE}] Element already initialized. Returning existing instance.`);
    return (getInstance(element) as unknown as RatingInstance) ?? createRating(element, options);
  }

  const {
    max = 5,
    value = 0,
    readOnly = false,
    allowHalf = false,
    onChange,
    onHover,
    onLeave,
  } = options;

  const items = Array.from(element.querySelectorAll<HTMLElement>('[data-nb-rating-item]'));
  if (items.length === 0) {
    throw new Error(`[${NAMESPACE}] No [data-nb-rating-item] elements found inside the provided element.`);
  }

  const events = createEventManager();
  let _value = value;
  let hoverValue = 0;

  // --------------------------------------------------------------------------
  // Sync DOM with current value
  // --------------------------------------------------------------------------

  function syncAttributes(currentValue: number): void {
    items.forEach((item) => {
      const itemValue = parseFloat(item.getAttribute('data-value') || '0');
      const isFilled = itemValue <= currentValue;
      const isHalf = allowHalf && !isFilled && itemValue - 0.5 <= currentValue;

      item.classList.toggle('nb-rating-item-filled', isFilled);
      item.classList.toggle('nb-rating-item-half', isHalf);
      item.setAttribute('aria-checked', String(isFilled || isHalf));
    });
  }

  function syncHover(hoveredValue: number): void {
    items.forEach((item) => {
      const itemValue = parseFloat(item.getAttribute('data-value') || '0');
      const isFilled = itemValue <= hoveredValue;
      const isHalf = allowHalf && !isFilled && itemValue - 0.5 <= hoveredValue;
      item.classList.toggle('is-hovered', isFilled || isHalf);
    });
  }

  function clearHover(): void {
    items.forEach((item) => item.classList.remove('is-hovered'));
  }

  // --------------------------------------------------------------------------
  // Value control
  // --------------------------------------------------------------------------

  function setValue(newValue: number): void {
    const clamped = Math.max(0, Math.min(newValue, max));
    if (clamped === _value) return;

    const trigger = items[Math.min(Math.ceil(clamped), items.length) - 1] ?? element;
    const allowed = dispatchNamespacedEvent(trigger, EVENT_CHANGE, { value: clamped });
    if (!allowed) return;

    _value = clamped;
    syncAttributes(clamped);
    onChange?.(clamped);
  }

  function clear(): void {
    setValue(0);
  }

  // --------------------------------------------------------------------------
  // Pointer interaction
  // --------------------------------------------------------------------------

  function handleItemClick(e: Event): void {
    if (readOnly) return;
    const item = e.currentTarget as HTMLElement;
    const newValue = parseFloat(item.getAttribute('data-value') || '0');
    setValue(newValue);
  }

  function handleItemMouseEnter(e: Event): void {
    if (readOnly) return;
    const item = e.currentTarget as HTMLElement;
    hoverValue = parseFloat(item.getAttribute('data-value') || '0');
    syncHover(hoverValue);
    dispatchNamespacedEvent(element, EVENT_HOVER, { value: hoverValue });
    onHover?.(hoverValue);
  }

  function handleMouseLeave(): void {
    if (readOnly) return;
    clearHover();
    hoverValue = 0;
    dispatchNamespacedEvent(element, EVENT_LEAVE, {});
    onLeave?.();
  }

  // --------------------------------------------------------------------------
  // Keyboard navigation
  // --------------------------------------------------------------------------

  function handleKeydown(e: KeyboardEvent): void {
    if (readOnly) return;
    const currentValue = _value;
    let newValue = currentValue;

    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      newValue = Math.min(currentValue + (allowHalf ? 0.5 : 1), max);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      newValue = Math.max(currentValue - (allowHalf ? 0.5 : 1), 0);
    } else if (e.key === 'Home') {
      e.preventDefault();
      newValue = allowHalf ? 0.5 : 1;
    } else if (e.key === 'End') {
      e.preventDefault();
      newValue = max;
    } else if (e.key === 'Escape') {
      e.preventDefault();
      clear();
      return;
    } else {
      return;
    }

    setValue(newValue);
  }

  // --------------------------------------------------------------------------
  // Event wiring
  // --------------------------------------------------------------------------

  if (!readOnly) {
    items.forEach((item) => {
      events.add(item, 'click', handleItemClick);
      events.add(item, 'mouseenter', handleItemMouseEnter);
    });
    events.add(element, 'mouseleave', handleMouseLeave);
    events.add(element, 'keydown', handleKeydown);
  }

  // --------------------------------------------------------------------------
  // Instance
  // --------------------------------------------------------------------------

  const instance: RatingInstance = {
    open() {
      if (_value <= 0) setValue(allowHalf ? 0.5 : 1);
    },
    close() {
      clear();
    },
    toggle() {
      if (_value > 0) clear();
      else this.open();
    },
    get value(): number {
      return _value;
    },
    setValue,
    clear,
    destroy() {
      events.destroy();
      initRegistry.delete(element);
    },
    get isOpen(): boolean {
      return _value > 0;
    },
  };

  registerInstance(element, instance);

  // Initialize from markup
  syncAttributes(_value);

  return instance;
}
