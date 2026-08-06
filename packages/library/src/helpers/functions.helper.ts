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

/**
 * Copies plain text to the clipboard with a textarea fallback.
 *
 * @param text - Text to copy.
 */
export async function copyToClipboard(text: string): Promise<void> {
  if (
    typeof navigator.clipboard !== 'undefined' &&
    typeof navigator.clipboard.writeText === 'function'
  ) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';

  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand('copy');
  } finally {
    document.body.removeChild(textarea);
  }
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
