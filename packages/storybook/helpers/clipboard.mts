import type { Locator } from '@playwright/test';

/** Synthetic paste with data attached to the event's own clipboard store. */
export async function pasteText(locator: Locator, text: string): Promise<void> {
  await locator.evaluate((element, value) => {
    const event = new ClipboardEvent('paste', {
      bubbles: true,
      cancelable: true,
      clipboardData: new DataTransfer(),
    });
    // Firefox creates a separate store instead of retaining clipboardData.
    if (!event.clipboardData) throw new Error('Synthetic clipboard is unavailable');
    event.clipboardData.setData('text/plain', value);
    element.dispatchEvent(event);
  }, text);
}
