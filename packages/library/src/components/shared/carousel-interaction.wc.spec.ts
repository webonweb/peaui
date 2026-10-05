import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CardCarousel from '../data-display/CardCarousel/index.wc';
beforeEach(() =>
  Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
    configurable: true,
    writable: true,
    value: vi.fn(),
  }),
);
afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
  Reflect.deleteProperty(HTMLElement.prototype, 'scrollTo');
});
describe('regressions: WC carousel', () => {
  it('honors a pointer pause click even when focus pauses rotation before click', () => {
    vi.useFakeTimers();
    const scroll = vi.spyOn(HTMLElement.prototype, 'scrollTo').mockImplementation(() => undefined);
    const carousel = new CardCarousel();
    Object.assign(carousel, {
      withAnimation: true,
      defaultVisibleSlides: 1,
      pauseLabel: 'Pause',
      resumeLabel: 'Resume',
    });
    carousel.innerHTML = '<div>One</div><div>Two</div>';
    document.body.append(carousel);
    const control = carousel.querySelector<HTMLButtonElement>('.peaui-card-carousel__rotation')!;
    control.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    control.focus();
    control.dispatchEvent(new Event('pointerup', { bubbles: true }));
    control.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    expect(control.textContent).toBe('Resume');
    vi.advanceTimersByTime(4000);
    expect(scroll).not.toHaveBeenCalled();
    control.click();
    expect(control.textContent).toBe('Pause');
    vi.advanceTimersByTime(2000);
    expect(scroll).toHaveBeenCalled();
  });
  it('stops rotation on focus until resumed and exposes a pause control', () => {
    vi.useFakeTimers();
    const scroll = vi.spyOn(HTMLElement.prototype, 'scrollTo').mockImplementation(() => undefined);
    const carousel = new CardCarousel();
    carousel.withAnimation = true;
    carousel.defaultVisibleSlides = 1;
    carousel.innerHTML = '<div>One</div><div>Two</div>';
    document.body.append(carousel);
    vi.advanceTimersByTime(2000);
    expect(scroll).toHaveBeenCalled();
    scroll.mockClear();
    carousel.dispatchEvent(new FocusEvent('focusin'));
    carousel.dispatchEvent(new FocusEvent('focusout'));
    vi.advanceTimersByTime(4000);
    expect(scroll).not.toHaveBeenCalled();
    carousel.querySelector<HTMLButtonElement>('.peaui-card-carousel__rotation')!.click();
    vi.advanceTimersByTime(2000);
    expect(scroll).toHaveBeenCalled();
  });
});
