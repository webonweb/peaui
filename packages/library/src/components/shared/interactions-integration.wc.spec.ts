import { nextTick } from 'vue';
import { afterEach, expect, it, vi } from 'vitest';
import CardPanel from '../layout/CardPanel/index.wc';
import Stepper from '../navigation/NavigationStepper/index.wc';
import Pagination from '../navigation/PaginationControl/index.wc';
import GuidedTour from '../overlayer/GuidedTour/index.wc';
vi.mock('@/components/layout/ScrollArea/scroll-area.controller', () => ({
  getScrollAreaRtlMode: () => 'negative',
}));

async function flush() {
  for (let i = 0; i < 6; i++) await nextTick();
}
afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it('V-I04: native CardPanel preserves and updates download on its anchor', async () => {
  const card = new CardPanel();
  card.as = 'a';
  card.setAttribute('href', '#file');
  card.setAttribute('download', 'file.pdf');
  document.body.append(card);
  await flush();
  expect(card.querySelector('a')!.getAttribute('download')).toBe('file.pdf');
  card.setAttribute('download', '');
  await flush();
  expect(card.querySelector('a')!.getAttribute('download')).toBe('');
  card.removeAttribute('download');
  await flush();
  expect(card.querySelector('a')!.hasAttribute('download')).toBe(false);
});

it('V-I07: native CardPanel reprojects the same node when its slot changes', async () => {
  const card = new CardPanel();
  const header = document.createElement('button');
  header.slot = 'header';
  header.textContent = 'Heading';
  const clicked = vi.fn();
  header.addEventListener('click', clicked);
  card.append(header);
  document.body.append(card);
  await flush();
  header.removeAttribute('slot');
  await flush();
  expect(card.querySelector('.peaui-card-panel__header')).toBeNull();
  expect(card.querySelector('.peaui-card-panel__content')!.contains(header)).toBe(true);
  header.click();
  expect(clicked).toHaveBeenCalledOnce();
  header.slot = 'header';
  await flush();
  expect(card.querySelector('.peaui-card-panel__header')!.contains(header)).toBe(true);
  header.remove();
  await flush();
  expect(card.querySelector('.peaui-card-panel__header')).toBeNull();
  card.append(header);
  await flush();
  card.remove();
  document.body.append(card);
  await flush();
  expect(card.querySelector('.peaui-card-panel__header')!.contains(header)).toBe(true);
});

it('V-I02/V-I03: stepper observes container size and respects the RTL scroll axis', async () => {
  const callbacks: ResizeObserverCallback[] = [];
  const disconnect = vi.fn();
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: ResizeObserverCallback) {
        callbacks.push(callback);
      }
      observe() {}
      disconnect = disconnect;
    },
  );
  const element = new Stepper();
  element.options = [{ key: 'a', label: 'Alpha', status: 'complete' }];
  document.body.append(element);
  await flush();
  const viewport = element.querySelector<HTMLElement>('nav')!;
  viewport.style.direction = 'rtl';
  Object.defineProperties(viewport, {
    scrollWidth: { value: 900 },
    clientWidth: { value: 200 },
    scrollLeft: { value: 0, writable: true },
  });
  viewport.scrollBy = vi.fn();
  window.dispatchEvent(new Event('resize'));
  await flush();
  element.querySelector<HTMLButtonElement>('.peaui-navigation-stepper__control--next')!.click();
  expect(viewport.scrollBy).toHaveBeenCalledWith({ left: -284, behavior: 'smooth' });
  viewport.scrollLeft = -700;
  viewport.dispatchEvent(new Event('scroll'));
  await flush();
  expect(
    element.querySelector<HTMLButtonElement>('.peaui-navigation-stepper__control--next')!.disabled,
  ).toBe(true);
  expect(callbacks.length).toBeGreaterThan(0);
  element.remove();
  await flush();
  expect(disconnect).toHaveBeenCalled();
});

it('V-I05: native child Escape consumption keeps GuidedTour open', async () => {
  const element = new GuidedTour();
  Object.assign(element, { open: true, mode: 'modal', steps: [{ id: 'one', title: 'Step' }] });
  const child = document.createElement('button');
  child.slot = 'content';
  child.textContent = 'Nested';
  child.addEventListener('keydown', (event) => event.preventDefault());
  element.append(child);
  const changed = vi.fn();
  element.addEventListener('update:open', changed);
  document.body.append(element);
  await flush();
  child.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
  );
  await flush();
  expect(changed).not.toHaveBeenCalled();
});

it('V-I09: page ranges remain unique and contain the current page', async () => {
  const element = new Pagination();
  Object.assign(element, { ariaLabel: 'Pages', totalPages: 6, page: 2 });
  document.body.append(element);
  for (let total = 1; total <= 12; total++)
    for (let page = 1; page <= total; page++) {
      Object.assign(element, { totalPages: total, page });
      await flush();
      const numbers = [...element.querySelectorAll('.peaui-pagination-control__button--page')].map(
        (button) => Number(button.textContent),
      );
      expect(new Set(numbers).size).toBe(numbers.length);
      expect(numbers).toContain(page);
      expect(numbers.every((number) => number >= 1 && number <= total)).toBe(true);
    }
});

for (const kind of ['popover', 'dialog'] as const) {
  it(`V-I05: an open native ${kind} handles Escape before GuidedTour`, async () => {
    const element = new GuidedTour();
    Object.assign(element, { open: true, mode: 'modal', steps: [{ id: 'one', title: 'Step' }] });
    const slot = document.createElement('div');
    slot.slot = 'content';
    element.append(slot);
    const changed = vi.fn();
    element.addEventListener('update:open', changed);
    document.body.append(element);
    await flush();
    const nested = document.createElement(kind === 'dialog' ? 'dialog' : 'div');
    if (kind === 'dialog') nested.setAttribute('open', '');
    else {
      nested.setAttribute('popover', 'auto');
      vi.spyOn(nested, 'matches').mockImplementation((selector) => selector === ':popover-open');
    }
    slot.append(nested);
    nested.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    expect(changed).not.toHaveBeenCalled();
    if (kind === 'popover') {
      const buttons = [
        ...element.querySelectorAll<HTMLButtonElement>(
          '.peaui-guided-tour__card button:not([disabled])',
        ),
      ];
      buttons.at(-1)!.focus();
      buttons
        .at(-1)!
        .dispatchEvent(
          new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }),
        );
      expect(document.activeElement).toBe(buttons[0]);
      buttons[0]!.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Tab',
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        }),
      );
      expect(document.activeElement).toBe(buttons.at(-1));
    }
    nested.remove();
    slot.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    await flush();
    expect(changed).toHaveBeenCalledOnce();
  });
}
