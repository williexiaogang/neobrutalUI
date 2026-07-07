// ============================================================================
// Neo-Brutal UI Interactions — OTP Input
// Auto-focus chaining, paste handling, and completion detection for OTP grids.
// ============================================================================

import type { OtpOptions, OtpInstance } from './types.js';
import {
  createEventManager,
  createStateManager,
  initRegistry,
  isInitialized,
  registerInstance,
  getInstance,
  dispatchNamespacedEvent,
} from './factory.js';

const NAMESPACE = 'nb:otp';
const EVENT_COMPLETE = `${NAMESPACE}:complete`;
const EVENT_CHANGE = `${NAMESPACE}:change`;

/**
 * Create an OTP input interaction instance.
 *
 * Expected markup:
 *   <div data-nb-otp>
 *     <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" />
 *     <input type="text" inputmode="numeric" maxlength="1" class="nb-otp-field" />
 *     ...
 *   </div>
 */
export function createOtp(element: HTMLElement, options: OtpOptions = {}): OtpInstance {
  if (!element || !(element instanceof HTMLElement)) {
    throw new TypeError(`[${NAMESPACE}] createOtp requires a valid HTMLElement. Received: ${typeof element}`);
  }

  if (isInitialized(element)) {
    console.warn(`[${NAMESPACE}] Element already initialized. Returning existing instance.`);
    return getInstance(element) as OtpInstance ?? createOtp(element, options);
  }

  const {
    length,
    allowAlpha = false,
    onComplete,
    onChange,
  } = options;

  const fields = Array.from(element.querySelectorAll<HTMLInputElement>('.nb-otp-field'));
  if (fields.length === 0) {
    throw new Error(`[${NAMESPACE}] No .nb-otp-field inputs found inside the provided element.`);
  }

  const resolvedLength = length ?? fields.length;
  const events = createEventManager();
  const state = createStateManager(false);
  let cleanupState: (() => void) | undefined;
  let value = '';

  function isValidChar(char: string): boolean {
    if (char.length !== 1) return false;
    if (allowAlpha) return /^[a-zA-Z0-9]$/.test(char);
    return /^[0-9]$/.test(char);
  }

  function updateValue(): void {
    value = fields.map((f) => f.value).join('');
    onChange?.(value);
    dispatchNamespacedEvent(element, EVENT_CHANGE, { value });

    if (value.length === resolvedLength && fields.every((f) => f.value !== '')) {
      onComplete?.(value);
      dispatchNamespacedEvent(element, EVENT_COMPLETE, { value });
    }
  }

  function focusField(index: number): void {
    const target = fields[Math.min(Math.max(index, 0), fields.length - 1)];
    if (target && !target.disabled) {
      target.focus();
      target.select();
    }
  }

  function setValue(nextValue: string): void {
    const chars = nextValue.split('').filter((c) => isValidChar(c)).slice(0, resolvedLength);
    fields.forEach((field, index) => {
      field.value = chars[index] ?? '';
    });
    updateValue();
    focusField(chars.length);
  }

  function clear(): void {
    fields.forEach((field) => {
      field.value = '';
    });
    updateValue();
    focusField(0);
  }

  function handleInput(field: HTMLInputElement, index: number): void {
    if (field.disabled) return;

    // Enforce single valid character
    const chars = field.value.split('').filter(isValidChar);
    const char = chars[chars.length - 1] ?? '';

    if (char && field.value !== char) {
      field.value = char;
    }

    if (char) {
      updateValue();
      focusField(index + 1);
    }
  }

  function handleKeydown(e: KeyboardEvent, index: number): void {
    const field = fields[index];
    if (!field || field.disabled) return;

    if (e.key === 'Backspace') {
      if (field.value === '') {
        e.preventDefault();
        focusField(index - 1);
      } else {
        // Let the default backspace happen, then update value on input event.
        // If the field becomes empty after backspace, move focus left.
        const cleanup = () => {
          field.removeEventListener('input', cleanup);
          if (field.value === '') {
            focusField(index - 1);
          }
          updateValue();
        };
        field.addEventListener('input', cleanup, { once: true });
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusField(index - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusField(index + 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusField(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      focusField(fields.length - 1);
    }
  }

  function handlePaste(e: ClipboardEvent, index: number): void {
    e.preventDefault();
    const pasted = e.clipboardData?.getData('text') ?? '';
    if (!pasted) return;

    const chars = pasted.split('').filter(isValidChar).slice(0, resolvedLength);
    if (chars.length === 0) return;

    // Fill from the current index onward
    for (let i = 0; i < chars.length; i++) {
      const targetIndex = index + i;
      if (targetIndex >= fields.length) break;
      fields[targetIndex].value = chars[i];
    }

    updateValue();
    focusField(index + chars.length);
  }

  // Wire events
  fields.forEach((field, index) => {
    events.add(field, 'input', () => handleInput(field, index));
    events.add(field, 'keydown', (e: KeyboardEvent) => handleKeydown(e, index));
    events.add(field, 'paste', (e: ClipboardEvent) => handlePaste(e, index));
    // Prevent non-numeric keys when not allowing alpha
    events.add(field, 'keypress', (e: KeyboardEvent) => {
      if (field.disabled) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key.length === 1 && !isValidChar(e.key)) {
        e.preventDefault();
      }
    });
  });

  const instance: OtpInstance = {
    get value(): string {
      return value;
    },
    get length(): number {
      return resolvedLength;
    },
    get isOpen(): boolean {
      return state.value;
    },
    setValue,
    clear,
    open() {
      // OTP has no open/close concept; focus the first field.
      focusField(0);
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
  updateValue();

  return instance;
}
