/**
 * Retrieves the computed right padding of the given input element,
 * subtracts a fixed offset (16px), and returns the result as a number.
 * @param element - The HTMLInputElement to inspect, or null.
 * @returns The adjusted right padding in pixels, or 0 if no element is provided.
 */
export function getPaddingRight(element: HTMLInputElement | null): number {
  if (element === null) {
    return 0;
  }

  const computedPaddingRight = window.getComputedStyle(element).paddingRight;

  return Number(computedPaddingRight.replace('px', '')) - 16;
}

export type ClipboardMethod = 'api' | 'fallback';
export type ClipboardErrorCode = 'unavailable' | 'write-failed';

export class ClipboardError extends Error {
  readonly code: ClipboardErrorCode;

  constructor(code: ClipboardErrorCode, options?: ErrorOptions) {
    super(code === 'unavailable' ? 'Clipboard is unavailable' : 'Clipboard write failed', options);
    this.name = 'ClipboardError';
    this.code = code;
  }
}

function restoreSelection(ranges: readonly Range[]): void {
  const selection = document.getSelection();
  if (!selection) return;

  selection.removeAllRanges();
  ranges.forEach((range) => selection.addRange(range));
}

function fallbackCopyToClipboard(text: string): boolean {
  if (typeof document === 'undefined' || typeof document.execCommand !== 'function') return false;

  const activeElement =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const selection = document.getSelection();
  const ranges = selection
    ? Array.from({ length: selection.rangeCount }, (_, index) =>
        selection.getRangeAt(index).cloneRange(),
      )
    : [];
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.setAttribute('aria-hidden', 'true');
  textarea.style.position = 'fixed';
  textarea.style.inset = '0 auto auto -9999px';
  textarea.style.opacity = '0';

  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  try {
    return document.execCommand('copy');
  } finally {
    textarea.remove();
    restoreSelection(ranges);
    activeElement?.focus({ preventScroll: true });
  }
}

/**
 * Copies plain text with the asynchronous Clipboard API and a focus-safe textarea fallback.
 * The helper is safe to call in environments without DOM globals and always reports failure.
 *
 * @param text - Exact plain-text value to copy.
 * @returns The browser mechanism that completed the operation.
 */
export async function copyToClipboard(text: string): Promise<ClipboardMethod> {
  let apiError: unknown;
  const clipboard =
    typeof navigator === 'undefined'
      ? undefined
      : (navigator as Navigator & { clipboard?: Clipboard }).clipboard;

  if (typeof clipboard?.writeText === 'function') {
    try {
      await clipboard.writeText(text);
      return 'api';
    } catch (error) {
      apiError = error;
    }
  }

  try {
    if (fallbackCopyToClipboard(text)) return 'fallback';
  } catch (error) {
    throw new ClipboardError('write-failed', { cause: error });
  }

  if (apiError !== undefined) {
    throw new ClipboardError('write-failed', { cause: apiError });
  }

  throw new ClipboardError('unavailable');
}

/**
 * Removes HTML tags from a string using DOM parsing.
 *
 * @param html - HTML source.
 * @returns Plain text content.
 */
export function stripHtmlUsingDom(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc.body.textContent;
}

/**
 * A debounce function that limits the number of calls to a given function within a specified time.
 * @param func - the function to be called
 * @param wait - waiting time in milliseconds
 * @returns - the function that will be called after the waiting time has elapsed
 */
export function debounce<T extends (...args: unknown[] | boolean[] | string[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null;

  return function (...args: Parameters<T>): void {
    if (timeout !== null) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}
