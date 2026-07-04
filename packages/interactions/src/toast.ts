// ============================================================================
// Neo-Brutal UI Interactions — Toast
// Zero-framework, SSR-safe toast manager with auto-dismiss, stacking,
// and reduced-motion support.
// ============================================================================

import { createEventManager } from './factory.js';

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

export interface ToastOptions {
  /** Title text shown in bold */
  title?: string;
  /** Message body text */
  message?: string;
  /** Semantic variant. Default: 'info' */
  type?: 'info' | 'success' | 'warning' | 'error';
  /** Auto-dismiss duration in ms. Default: 5000. 0 = no auto-dismiss. */
  duration?: number;
  /** Container position. Default: 'bottom-end' */
  position?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
  /** Show a close button. Default: true */
  closable?: boolean;
  /** Callback fired when the toast is closed (auto or manual) */
  onClose?: () => void;
}

// --------------------------------------------------------------------------
// SSR guard
// --------------------------------------------------------------------------

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

// --------------------------------------------------------------------------
// Constants
// --------------------------------------------------------------------------

const CONTAINER_CLASS = 'nb-toast-container';

const POSITION_CLASSES: Record<NonNullable<ToastOptions['position']>, string> = {
  'top-start': `${CONTAINER_CLASS}-top-start`,
  'top-end': `${CONTAINER_CLASS}-top-end`,
  'bottom-start': `${CONTAINER_CLASS}-bottom-start`,
  'bottom-end': `${CONTAINER_CLASS}-bottom-end`,
};

// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------

/** Detect if the user prefers reduced motion */
function prefersReducedMotion(): boolean {
  if (!isBrowser) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Get or create a toast container for the given position */
function getContainer(position: NonNullable<ToastOptions['position']>): HTMLElement {
  if (!isBrowser) return document.createElement('div');

  const className = POSITION_CLASSES[position];
  const existing = document.querySelector<HTMLElement>(`.${className}`);
  if (existing) return existing;

  const container = document.createElement('div');
  container.className = `${CONTAINER_CLASS} ${className}`;
  container.setAttribute('role', 'region');
  container.setAttribute('aria-live', 'polite');
  container.setAttribute('aria-label', 'Notifications');
  document.body.appendChild(container);
  return container;
}

/** Build a toast DOM element from options */
function buildToastElement(options: ToastOptions): HTMLElement {
  const type = options.type ?? 'info';
  const closable = options.closable ?? true;

  const toast = document.createElement('div');
  toast.className = `nb-toast nb-toast-${type}`;
  toast.setAttribute('role', 'status');

  // Content wrapper
  const content = document.createElement('div');
  content.style.flex = '1';
  content.style.minInlineSize = '0';

  if (options.title) {
    const titleEl = document.createElement('p');
    titleEl.className = 'nb-toast-title';
    titleEl.textContent = options.title;
    content.appendChild(titleEl);
  }

  if (options.message) {
    const msgEl = document.createElement('p');
    msgEl.className = 'nb-toast-message';
    msgEl.textContent = options.message;
    content.appendChild(msgEl);
  }

  toast.appendChild(content);

  // Close button
  if (closable) {
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'nb-toast-close';
    closeBtn.setAttribute('aria-label', 'Close notification');
    closeBtn.textContent = '×';
    toast.appendChild(closeBtn);
  }

  // Progress bar
  const duration = options.duration ?? 5000;
  if (duration > 0) {
    const progress = document.createElement('div');
    progress.className = 'nb-toast-progress';
    progress.style.animationDuration = `${duration}ms`;
    toast.appendChild(progress);
  }

  return toast;
}

// --------------------------------------------------------------------------
// Toast Manager
// --------------------------------------------------------------------------

export interface ToastManager {
  /** Show a toast. Returns a function that forces immediate close. */
  show(options: ToastOptions): () => void;
  /** Destroy all toasts and remove containers from the DOM */
  destroy(): void;
}

/** Create a toast manager bound to the document */
export function createToastManager(): ToastManager {
  const events = createEventManager();
  const activeTimers = new Set<ReturnType<typeof setTimeout>>();
  const activeToasts = new Set<HTMLElement>();

  function removeToast(toast: HTMLElement, container: HTMLElement, onClose?: () => void): void {
    if (!isBrowser || !toast.isConnected) return;

    // Avoid double-removal
    if (activeToasts.has(toast)) {
      activeToasts.delete(toast);
    } else {
      return;
    }

    if (prefersReducedMotion()) {
      toast.remove();
      if (container.childElementCount === 0) {
        container.remove();
      }
      onClose?.();
      return;
    }

    toast.classList.remove('is-entering');
    toast.classList.add('is-exiting');

    const onTransitionEnd = (e: Event): void => {
      if (e.target !== toast) return;
      toast.removeEventListener('transitionend', onTransitionEnd);
      toast.remove();
      if (container.childElementCount === 0) {
        container.remove();
      }
      onClose?.();
    };

    toast.addEventListener('transitionend', onTransitionEnd);

    // Fallback: force removal after transition max time + buffer
    setTimeout(() => {
      if (toast.isConnected) {
        toast.removeEventListener('transitionend', onTransitionEnd);
        toast.remove();
        if (container.childElementCount === 0) {
          container.remove();
        }
        onClose?.();
      }
    }, 400);
  }

  function show(options: ToastOptions = {}): () => void {
    if (!isBrowser) return () => {};

    const position = options.position ?? 'bottom-end';
    const duration = options.duration ?? 5000;
    const container = getContainer(position);
    const toast = buildToastElement(options);

    container.appendChild(toast);
    activeToasts.add(toast);

    // Trigger enter animation in next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (toast.isConnected) {
          toast.classList.add('is-entering');
        }
      });
    });

    // Start progress bar animation
    const progress = toast.querySelector<HTMLElement>('.nb-toast-progress');
    if (progress && duration > 0) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (progress.isConnected) {
            progress.classList.add('is-animating');
          }
        });
      });
    }

    // Auto-dismiss timer
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (duration > 0) {
      timer = setTimeout(() => {
        removeToast(toast, container, options.onClose);
      }, duration + 100); // +100ms buffer for enter transition
      activeTimers.add(timer);
    }

    // Close button handler
    const closeBtn = toast.querySelector<HTMLButtonElement>('.nb-toast-close');
    if (closeBtn) {
      const handler = (): void => {
        if (timer) {
          clearTimeout(timer);
          activeTimers.delete(timer);
          timer = null;
        }
        removeToast(toast, container, options.onClose);
      };
      events.add(closeBtn, 'click', handler);
    }

    // Return manual close function
    return (): void => {
      if (timer) {
        clearTimeout(timer);
        activeTimers.delete(timer);
        timer = null;
      }
      removeToast(toast, container, options.onClose);
    };
  }

  function destroy(): void {
    for (const timer of activeTimers) {
      clearTimeout(timer);
    }
    activeTimers.clear();

    for (const toast of activeToasts) {
      if (toast.isConnected) toast.remove();
    }
    activeToasts.clear();

    if (isBrowser) {
      for (const posClass of Object.values(POSITION_CLASSES)) {
        const container = document.querySelector<HTMLElement>(`.${posClass}`);
        if (container) container.remove();
      }
    }

    events.destroy();
  }

  return { show, destroy };
}
