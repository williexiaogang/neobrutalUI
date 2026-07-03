// ============================================================================
// Neo-Brutal UI Interactions — Shared Factory
// Provides SSR-safe primitives for event management, state, and init guards.
// ============================================================================

import type { ComponentInstance } from './types.js';

// ============================================================================
// SSR guard
// ============================================================================

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

// ============================================================================
// Event Manager
// ============================================================================

export interface EventManager {
  /** Add an event listener with namespace tracking */
  add<K extends keyof HTMLElementEventMap>(
    element: HTMLElement | Window | Document,
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => unknown,
    options?: boolean | AddEventListenerOptions
  ): void;
  add(
    element: HTMLElement | Window | Document,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  /** Remove all tracked listeners for a given element */
  removeAll(element: HTMLElement | Window | Document): void;
  /** Remove all tracked listeners everywhere */
  destroy(): void;
}

/** Create a namespaced event manager that auto-tracks listeners for cleanup */
export function createEventManager(): EventManager {
  const registry = new Map<HTMLElement | Window | Document, Map<string, EventListenerOrEventListenerObject[]>>();

  function add(
    element: HTMLElement | Window | Document,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void {
    if (!isBrowser) return;

    element.addEventListener(type, listener, options);

    let byElement = registry.get(element);
    if (!byElement) {
      byElement = new Map<string, EventListenerOrEventListenerObject[]>();
      registry.set(element, byElement);
    }

    const listeners = byElement.get(type) ?? [];
    listeners.push(listener);
    byElement.set(type, listeners);
  }

  function removeAll(element: HTMLElement | Window | Document): void {
    if (!isBrowser) return;

    const byElement = registry.get(element);
    if (!byElement) return;

    for (const [type, listeners] of byElement) {
      for (const listener of listeners) {
        element.removeEventListener(type, listener);
      }
    }
    registry.delete(element);
  }

  function destroy(): void {
    if (!isBrowser) return;

    for (const [element, byElement] of registry) {
      for (const [type, listeners] of byElement) {
        for (const listener of listeners) {
          element.removeEventListener(type, listener);
        }
      }
    }
    registry.clear();
  }

  return { add, removeAll, destroy };
}

// ============================================================================
// State Manager
// ============================================================================

export interface StateManager {
  /** Current state value */
  get value(): boolean;
  /** Update state and notify listeners if changed */
  set(value: boolean): void;
  /** Toggle the current state */
  toggle(): void;
  /** Register a listener; returns an unsubscribe function */
  subscribe(fn: (value: boolean) => void): () => void;
  /** Remove all listeners */
  clear(): void;
}

/** Create a reactive boolean state manager */
export function createStateManager(initial = false): StateManager {
  let _value = initial;
  const listeners = new Set<(value: boolean) => void>();

  return {
    get value(): boolean {
      return _value;
    },
    set(value: boolean): void {
      if (_value === value) return;
      _value = value;
      for (const fn of listeners) {
        fn(value);
      }
    },
    toggle(): void {
      this.set(!_value);
    },
    subscribe(fn: (value: boolean) => void): () => void {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    clear(): void {
      listeners.clear();
    },
  };
}

// ============================================================================
// Init Registry (WeakMap = automatic GC when element is removed from DOM)
// ============================================================================

export const initRegistry = new WeakMap<HTMLElement, ComponentInstance>();

/** Check if an element has already been initialized */
export function isInitialized(element: HTMLElement): boolean {
  return initRegistry.has(element);
}

/** Register a component instance against its root element */
export function registerInstance(element: HTMLElement, instance: ComponentInstance): void {
  initRegistry.set(element, instance);
}

/** Retrieve an existing instance for an element */
export function getInstance(element: HTMLElement): ComponentInstance | undefined {
  return initRegistry.get(element);
}

// ============================================================================
// Focus helpers
// ============================================================================

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable]',
  'details > summary',
].join(', ');

/** Get all focusable descendants inside a container, sorted by tabindex then DOM order */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  if (!isBrowser) return [];

  const elements = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));
  return elements
    .filter((el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true')
    .sort((a, b) => {
      const aTab = parseInt(a.getAttribute('tabindex') || '0', 10);
      const bTab = parseInt(b.getAttribute('tabindex') || '0', 10);
      return aTab - bTab;
    });
}

/** Save a reference to the currently focused element */
export function saveActiveElement(): Element | null {
  if (!isBrowser) return null;
  return document.activeElement;
}

/** Restore focus to a previously saved element */
export function restoreActiveElement(element: Element | null): void {
  if (!isBrowser || !element) return;
  if (element instanceof HTMLElement && element.isConnected) {
    element.focus();
  }
}

// ============================================================================
// Custom event helpers
// ============================================================================

/** Dispatch a namespaced, cancellable custom event */
export function dispatchNamespacedEvent(
  target: HTMLElement,
  name: string,
  detail?: Record<string, unknown>
): boolean {
  if (!isBrowser) return true;
  const event = new CustomEvent(name, {
    bubbles: true,
    cancelable: true,
    detail,
  });
  target.dispatchEvent(event);
  return !event.defaultPrevented;
}
