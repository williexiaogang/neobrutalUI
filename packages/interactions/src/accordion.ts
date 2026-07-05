// ============================================================================
// Neo-Brutal UI Interactions — Accordion
// WAI-ARIA compliant keyboard navigation + panel open/close with
// single-open and multi-open modes.
// ============================================================================

import type { DisclosureOptions, AccordionInstance } from './types.js';
import {
  createEventManager,
  createStateManager,
  initRegistry,
  isInitialized,
  registerInstance,
  getInstance,
  dispatchNamespacedEvent,
} from './factory.js';

const NAMESPACE = 'nb:accordion';
const EVENT_OPEN = `${NAMESPACE}:open`;
const EVENT_CLOSE = `${NAMESPACE}:close`;
const EVENT_TOGGLE = `${NAMESPACE}:toggle`;


/**
 * Create an accordion interaction instance.
 *
 * Expected markup (simplified):
 *   <div data-nb-accordion>
 *     <div class="nb-accordion-item" data-nb-accordion-item>
 *       <button data-nb-accordion-trigger aria-expanded="false" aria-controls="panel-1" id="trigger-1">
 *         Section 1
 *       </button>
 *       <div data-nb-accordion-panel id="panel-1" role="region" aria-labelledby="trigger-1">
 *         <div class="nb-accordion-panel-inner"><div class="nb-accordion-content">…</div></div>
 *       </div>
 *     </div>
 *     …
 *   </div>
 */
export function createAccordion(element: HTMLElement, options: DisclosureOptions = {}): AccordionInstance {
  if (!element || !(element instanceof HTMLElement)) {
    throw new TypeError(`[${NAMESPACE}] createAccordion requires a valid HTMLElement. Received: ${typeof element}`);
  }

  if (isInitialized(element)) {
    console.warn(`[${NAMESPACE}] Element already initialized. Returning existing instance.`);
    return getInstance(element) as AccordionInstance ?? createAccordion(element, options);
  }

  const {
    allowMultiple = false,
    closeOthers = true,
    onOpen,
    onClose,
    onToggle,
  } = options;

  const items = Array.from(element.querySelectorAll<HTMLElement>('[data-nb-accordion-item]'));
  if (items.length === 0) {
    throw new Error(`[${NAMESPACE}] No [data-nb-accordion-item] elements found inside the provided element.`);
  }

  const triggers = items.map((item) => item.querySelector<HTMLElement>('[data-nb-accordion-trigger]')).filter((el): el is HTMLElement => el !== null);
  const panels = items.map((item) => item.querySelector<HTMLElement>('[data-nb-accordion-panel]')).filter((el): el is HTMLElement => el !== null);

  if (triggers.length !== items.length) {
    console.warn(`[${NAMESPACE}] Some accordion items are missing [data-nb-accordion-trigger] elements.`);
  }

  const events = createEventManager();
  const state = createStateManager(false);
  const openIndices = new Set<number>();
  let cleanupState: (() => void) | undefined;

  // --------------------------------------------------------------------------
  // Core panel control
  // --------------------------------------------------------------------------

  function syncAttributes(index: number, isOpen: boolean): void {
    const item = items[index];
    const trigger = triggers[index];
    const panel = panels[index];

    if (!item || !trigger || !panel) return;

    item.classList.toggle('is-open', isOpen);
    trigger.setAttribute('aria-expanded', String(isOpen));
    panel.classList.toggle('is-open', isOpen);
    panel.setAttribute('aria-hidden', String(!isOpen));
  }

  function openPanel(index: number): void {
    if (index < 0 || index >= items.length) return;
    if (openIndices.has(index)) return;

    const trigger = triggers[index];
    if (!trigger) return;

    const allowed = dispatchNamespacedEvent(trigger, EVENT_OPEN, { index });
    if (!allowed) return;

    // Close others if configured
    if (!allowMultiple && closeOthers) {
      for (const existing of Array.from(openIndices)) {
        if (existing !== index) {
          closePanel(existing);
        }
      }
    }

    openIndices.add(index);
    syncAttributes(index, true);
    state.set(true);

    dispatchNamespacedEvent(trigger, EVENT_TOGGLE, { index, isOpen: true });
    onOpen?.();
    onToggle?.(true);
  }

  function closePanel(index: number): void {
    if (index < 0 || index >= items.length) return;
    if (!openIndices.has(index)) return;

    const trigger = triggers[index];
    if (!trigger) return;

    const allowed = dispatchNamespacedEvent(trigger, EVENT_CLOSE, { index });
    if (!allowed) return;

    openIndices.delete(index);
    syncAttributes(index, false);

    if (openIndices.size === 0) {
      state.set(false);
    }

    dispatchNamespacedEvent(trigger, EVENT_TOGGLE, { index, isOpen: false });
    onClose?.();
    onToggle?.(false);
  }

  function togglePanel(index: number): void {
    if (openIndices.has(index)) {
      closePanel(index);
    } else {
      openPanel(index);
    }
  }

  function open(): void {
    // Open the first closed panel, or all if none are open and allowMultiple
    const closed = items.map((_, i) => i).filter((i) => !openIndices.has(i));
    if (closed.length > 0) {
      openPanel(closed[0]);
      if (allowMultiple) {
        for (let i = 1; i < closed.length; i++) {
          openPanel(closed[i]);
        }
      }
    }
  }

  function close(): void {
    for (const index of Array.from(openIndices)) {
      closePanel(index);
    }
  }

  function toggle(): void {
    if (openIndices.size > 0) {
      close();
    } else {
      open();
    }
  }

  // --------------------------------------------------------------------------
  // Keyboard navigation
  // --------------------------------------------------------------------------

  function handleTriggerKeydown(e: KeyboardEvent, index: number): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      togglePanel(index);
      return;
    }

    let targetIndex = -1;

    if (e.key === 'ArrowDown') {
      targetIndex = (index + 1) % triggers.length;
    } else if (e.key === 'ArrowUp') {
      targetIndex = (index - 1 + triggers.length) % triggers.length;
    } else if (e.key === 'Home') {
      targetIndex = 0;
    } else if (e.key === 'End') {
      targetIndex = triggers.length - 1;
    }

    if (targetIndex >= 0) {
      e.preventDefault();
      triggers[targetIndex]?.focus();
    }
  }

  // --------------------------------------------------------------------------
  // Event wiring
  // --------------------------------------------------------------------------

  triggers.forEach((trigger, index) => {
    events.add(trigger, 'click', () => togglePanel(index));
    events.add(trigger, 'keydown', (e: KeyboardEvent) => handleTriggerKeydown(e, index));
  });

  // --------------------------------------------------------------------------
  // Instance
  // --------------------------------------------------------------------------

  const instance: AccordionInstance = {
    open,
    close,
    toggle,
    openPanel,
    closePanel,
    togglePanel,
    destroy() {
      events.destroy();
      cleanupState?.();
      state.clear();
      initRegistry.delete(element);
      // Leave DOM attributes as-is to avoid breaking static markup assumptions
    },
    get isOpen(): boolean {
      return openIndices.size > 0;
    },
    get activeIndices(): number[] {
      return Array.from(openIndices).sort((a, b) => a - b);
    },
  };

  registerInstance(element, instance);
  cleanupState = state.subscribe((isOpen) => {
    element.setAttribute('data-nb-state', isOpen ? 'open' : 'closed');
  });

  // --------------------------------------------------------------------------
  // Initialize from markup
  // --------------------------------------------------------------------------

  triggers.forEach((trigger, index) => {
    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      openIndices.add(index);
      syncAttributes(index, true);
    } else {
      syncAttributes(index, false);
    }
  });

  if (openIndices.size > 0) {
    state.set(true);
  }

  return instance;
}
