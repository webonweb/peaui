/** @jsxImportSource react */
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CardCarousel from '../data-display/CardCarousel';
beforeEach(() =>
  Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
    configurable: true,
    writable: true,
    value: vi.fn(),
  }),
);
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
  Reflect.deleteProperty(HTMLElement.prototype, 'scrollTo');
});
describe('regressions: React carousel', () => {
  it('honors a pointer pause click even when focus pauses rotation before click', () => {
    vi.useFakeTimers();
    const scroll = vi.spyOn(HTMLElement.prototype, 'scrollTo').mockImplementation(() => undefined);
    const { getByRole } = render(
      <CardCarousel withAnimation defaultVisibleSlides={1} pauseLabel="Pause" resumeLabel="Resume">
        <div>One</div>
        <div>Two</div>
      </CardCarousel>,
    );
    const control = getByRole('button', { name: 'Pause' });
    fireEvent.pointerDown(control);
    fireEvent.focus(control);
    fireEvent.pointerUp(control);
    fireEvent.click(control, { detail: 1 });
    expect(control.textContent).toBe('Resume');
    act(() => vi.advanceTimersByTime(4000));
    expect(scroll).not.toHaveBeenCalled();
    fireEvent.click(control, { detail: 0 });
    expect(control.textContent).toBe('Pause');
    act(() => vi.advanceTimersByTime(2000));
    expect(scroll).toHaveBeenCalled();
  });
  it('scrolls actual slides, reflects manual scroll and clamps after resize', () => {
    let resize: ResizeObserverCallback = () => undefined;
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: ResizeObserverCallback) {
          resize = callback;
        }
        observe() {}
        unobserve() {}
        disconnect() {}
      } as typeof ResizeObserver,
    );
    let width = 300;
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(() => width);
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(150);
    const scroll = vi.spyOn(HTMLElement.prototype, 'scrollTo').mockImplementation(() => undefined);
    const { container, getByRole } = render(
      <CardCarousel defaultVisibleSlides={2}>
        {[1, 2, 3, 4].map((n) => (
          <div key={n}>{n}</div>
        ))}
      </CardCarousel>,
    );
    fireEvent.click(getByRole('button', { name: /następne|nastepne/i }));
    expect(scroll).toHaveBeenLastCalledWith({ left: 150, behavior: 'smooth' });
    const viewport = container.querySelector<HTMLElement>('.peaui-card-carousel__viewport')!;
    viewport.scrollLeft = 300;
    fireEvent.scroll(viewport);
    expect(
      (getByRole('button', { name: /następne|nastepne/i }) as HTMLButtonElement).disabled,
    ).toBe(true);
    width = 600;
    act(() => resize([], {} as ResizeObserver));
    expect(viewport.scrollLeft).toBe(0);
    expect(container.querySelectorAll('.peaui-card-carousel__dot')).toHaveLength(0);
  });
  it('stops rotation on focus until the user explicitly resumes', () => {
    vi.useFakeTimers();
    const scroll = vi.spyOn(HTMLElement.prototype, 'scrollTo').mockImplementation(() => undefined);
    const { container, getByRole } = render(
      <CardCarousel withAnimation defaultVisibleSlides={1}>
        <div>One</div>
        <div>Two</div>
      </CardCarousel>,
    );
    act(() => vi.advanceTimersByTime(2000));
    expect(scroll).toHaveBeenCalled();
    scroll.mockClear();
    fireEvent.focus(container.querySelector('.peaui-card-carousel__viewport')!);
    fireEvent.blur(container.querySelector('.peaui-card-carousel__viewport')!);
    act(() => vi.advanceTimersByTime(4000));
    expect(scroll).not.toHaveBeenCalled();
    fireEvent.click(getByRole('button', { name: /Wznów/ }));
    act(() => vi.advanceTimersByTime(2000));
    expect(scroll).toHaveBeenCalled();
  });
});
