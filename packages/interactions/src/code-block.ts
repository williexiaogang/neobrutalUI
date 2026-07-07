// ============================================================================
// Neo-Brutal UI Interactions — Code Block Copy
// Adds copy-to-clipboard behavior to code block copy buttons.
// ============================================================================

import type { CodeBlockOptions, CodeBlockInstance } from './types.js';
import {
  createEventManager,
  createStateManager,
  initRegistry,
  isInitialized,
  registerInstance,
  getInstance,
  dispatchNamespacedEvent,
} from './factory.js';

const NAMESPACE = 'nb:code-block';
const EVENT_COPY = `${NAMESPACE}:copy`;

function fallbackCopy(text: string): boolean {
  if (typeof document === 'undefined') return false;

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);

  textarea.select();
  let success = false;
  try {
    success = document.execCommand('copy');
  } catch {
    success = false;
  }

  document.body.removeChild(textarea);
  return success;
}

async function copyText(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return fallbackCopy(text);
    }
  }
  return fallbackCopy(text);
}

function getCodeText(block: HTMLElement): string {
  const code = block.querySelector('.nb-code-block-code');
  if (!code) return '';

  // Prefer the raw text content; strip line-number elements if present.
  const clone = code.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('.nb-code-block-line-number').forEach((el) => el.remove());

  return clone.textContent?.replace(/\n\s*\n/g, '\n').trim() ?? '';
}

/**
 * Create a code block copy interaction instance.
 *
 * Expected markup:
 *   <div class="nb-code-block" data-nb-code-block>
 *     <div class="nb-code-block-header">
 *       <span class="nb-code-block-lang">TypeScript</span>
 *       <div class="nb-code-block-actions">
 *         <button class="nb-btn nb-btn-sm" type="button" data-nb-code-block-copy>Copy</button>
 *       </div>
 *     </div>
 *     <div class="nb-code-block-body">
 *       <pre class="nb-code-block-pre"><code class="nb-code-block-code">...</code></pre>
 *     </div>
 *   </div>
 */
export function createCodeBlock(element: HTMLElement, options: CodeBlockOptions = {}): CodeBlockInstance {
  if (!element || !(element instanceof HTMLElement)) {
    throw new TypeError(`[${NAMESPACE}] createCodeBlock requires a valid HTMLElement. Received: ${typeof element}`);
  }

  if (isInitialized(element)) {
    console.warn(`[${NAMESPACE}] Element already initialized. Returning existing instance.`);
    return getInstance(element) as CodeBlockInstance ?? createCodeBlock(element, options);
  }

  const {
    copyButtonSelector = '[data-nb-code-block-copy], .nb-code-block-actions button',
    successText = 'Copied!',
    resetDelay = 2000,
    onCopy,
  } = options;

  const events = createEventManager();
  const state = createStateManager(false);
  let cleanupState: (() => void) | undefined;
  const buttons = Array.from(element.querySelectorAll<HTMLButtonElement>(copyButtonSelector));
  const originalLabels = new Map<HTMLButtonElement, string>();

  async function handleCopy(button: HTMLButtonElement): Promise<void> {
    if (button.disabled) return;

    const text = getCodeText(element);
    const success = await copyText(text);

    if (success) {
      if (!originalLabels.has(button)) {
        originalLabels.set(button, button.textContent ?? '');
      }
      button.textContent = successText;
      button.setAttribute('aria-live', 'polite');

      setTimeout(() => {
        const original = originalLabels.get(button);
        if (original !== undefined) {
          button.textContent = original;
        }
      }, resetDelay);
    }

    onCopy?.(text, success);
    dispatchNamespacedEvent(element, EVENT_COPY, { text, success, button });
  }

  buttons.forEach((button) => {
    events.add(button, 'click', () => handleCopy(button));
  });

  const instance: CodeBlockInstance = {
    copy: () => handleCopy(buttons[0]),
    get isOpen(): boolean {
      return state.value;
    },
    open() {
      state.set(true);
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
  return instance;
}
