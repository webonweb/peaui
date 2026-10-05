import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import FullscreenContainer from '../layout/FullscreenContainer/index.wc';
afterEach(() => document.body.replaceChildren());
describe('regressions: WC fullscreen', () => {
  it('closes on Escape and restores the toggle focus', async () => {
    const element = new FullscreenContainer();
    document.body.append(element);
    await nextTick();
    const button = element.querySelector('button')!;
    button.click();
    await nextTick();
    expect(button.getAttribute('aria-pressed')).toBe('true');
    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await nextTick();
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(document.activeElement).toBe(button);
  });
});
