/** @jsxImportSource react */
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { computeAccessibleDescription } from 'dom-accessibility-api';
import PopoverButton from '../overlayer/PopoverButton';
import PopoverOverlayer from '../overlayer/PopoverOverlayer';
import GuidedTour from '../overlayer/GuidedTour';
import NavigationStepper from '../navigation/NavigationStepper';
import NavigationLink from '../navigation/NavigationLink';
import NavigationCard from '../navigation/NavigationCard';
import NavigationIconCard from '../navigation/NavigationIconCard';
import NavigationDisclosureCard from '../navigation/NavigationDisclosureCard';
import CardPanel from '../layout/CardPanel';
import PaginationControl from '../navigation/PaginationControl';
vi.mock('@/components/layout/ScrollArea/scroll-area.controller', () => ({
  getScrollAreaRtlMode: () => 'negative',
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

for (const Component of [PopoverButton, PopoverOverlayer]) {
  it(`V-I01: ${Component.displayName} leaves Tab between popup controls to the browser`, () => {
    const { getByRole } = render(
      <Component
        ariaLabel="Open"
        content={
          <>
            <button>First</button>
            <button>Second</button>
          </>
        }
      >
        Open
      </Component>,
    );
    fireEvent.click(getByRole('button', { name: 'Open' }));
    const first = getByRole('button', { name: 'First', hidden: true });
    first.focus();
    fireEvent.keyDown(first, { key: 'Tab' });
    expect(getByRole('button', { name: 'Open' }).getAttribute('aria-expanded')).toBe('true');
    expect(getByRole('button', { name: 'Second', hidden: true })).toBeTruthy();
  });
}

it('V-I02/V-I03: stepper follows RTL boundaries and observes container resizing', () => {
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
  const { container, unmount } = render(
    <NavigationStepper options={[{ key: 'a', label: 'Alpha', status: 'complete' }]} />,
  );
  const viewport = container.querySelector<HTMLElement>('nav')!;
  viewport.style.direction = 'rtl';
  Object.defineProperties(viewport, {
    scrollWidth: { value: 900, configurable: true },
    clientWidth: { value: 200, configurable: true },
    scrollLeft: { value: 0, writable: true },
  });
  const scrollBy = vi.fn();
  viewport.scrollBy = scrollBy;
  act(() => window.dispatchEvent(new Event('resize')));
  const next = container.querySelector<HTMLButtonElement>(
    '.peaui-navigation-stepper__control--next',
  )!;
  fireEvent.click(next);
  expect(scrollBy.mock.calls[0]?.[0]).toMatchObject({ left: -284 });
  viewport.scrollLeft = -700;
  fireEvent.scroll(viewport);
  expect(next.disabled).toBe(true);
  expect(
    container.querySelector<HTMLButtonElement>('.peaui-navigation-stepper__control--prev')!
      .disabled,
  ).toBe(false);
  viewport.scrollLeft = 0;
  Object.defineProperty(viewport, 'clientWidth', { value: 1000 });
  act(() => callbacks.forEach((callback) => callback([], {} as ResizeObserver)));
  expect(next.disabled).toBe(true);
  unmount();
  expect(disconnect).toHaveBeenCalled();
});

it('V-I04: all anchor renderers preserve native target/rel/download attributes', () => {
  const attributes = {
    target: '_blank',
    rel: 'noopener',
    download: 'file.pdf',
    hrefLang: 'pl',
    referrerPolicy: 'no-referrer' as const,
  };
  const { container } = render(
    <>
      <NavigationLink path="#file" {...attributes}>
        File
      </NavigationLink>
      <NavigationCard title="File" description="Download" path="#file" {...attributes} />
      <NavigationIconCard icon="home" text="File" path="#file" {...attributes} />
      <CardPanel as="a" href="#file" {...attributes}>
        File
      </CardPanel>
    </>,
  );
  expect(container.querySelectorAll('a')).toHaveLength(4);
  for (const link of container.querySelectorAll('a')) {
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener');
    expect(link.getAttribute('download')).toBe('file.pdf');
    expect(link.getAttribute('hreflang')).toBe('pl');
    expect(link.getAttribute('referrerpolicy')).toBe('no-referrer');
  }
});

it('V-I05: a child consuming Escape keeps GuidedTour open', async () => {
  const onOpenChange = vi.fn();
  const { findByRole } = render(
    <GuidedTour
      open
      mode="modal"
      steps={[{ id: 'one', title: 'Step' }]}
      onOpenChange={onOpenChange}
    >
      <button onKeyDown={(event) => event.preventDefault()}>Nested</button>
    </GuidedTour>,
  );
  const nested = await findByRole('button', { name: 'Nested' });
  fireEvent.keyDown(nested, { key: 'Escape' });
  await act(async () => {
    await Promise.resolve();
  });
  expect(onOpenChange).not.toHaveBeenCalled();
});

it('V-I06: the navigation disclosure link owns its name and description', () => {
  const { getByRole, rerender } = render(
    <NavigationDisclosureCard
      id="details"
      title=""
      description=""
      path="#target"
      ariaLabel="Destination"
    />,
  );
  expect(getByRole('link', { name: 'Destination' })).toBeTruthy();
  rerender(
    <NavigationDisclosureCard
      id="details"
      title="Destination"
      description="Account details"
      path="#target"
    />,
  );
  expect(computeAccessibleDescription(getByRole('link', { name: 'Destination' }))).toBe(
    'Account details',
  );
});

for (const kind of ['popover', 'dialog'] as const) {
  it(`V-I05: an open native ${kind} handles Escape before GuidedTour`, async () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <GuidedTour
        open
        mode="modal"
        steps={[{ id: 'one', title: 'Step' }]}
        onOpenChange={onOpenChange}
      >
        <div data-nested />
      </GuidedTour>,
    );
    const slot = container.querySelector('[data-nested]')!;
    const nested = document.createElement(kind === 'dialog' ? 'dialog' : 'div');
    if (kind === 'dialog') nested.setAttribute('open', '');
    else {
      nested.setAttribute('popover', 'auto');
      vi.spyOn(nested, 'matches').mockImplementation((selector) => selector === ':popover-open');
    }
    slot.append(nested);
    await act(async () => {
      fireEvent.keyDown(nested, { key: 'Escape' });
    });
    expect(onOpenChange).not.toHaveBeenCalled();
    if (kind === 'popover') {
      const buttons = [
        ...container.querySelectorAll<HTMLButtonElement>(
          '.peaui-guided-tour__card button:not([disabled])',
        ),
      ];
      buttons.at(-1)!.focus();
      fireEvent.keyDown(buttons.at(-1)!, { key: 'Tab' });
      expect(document.activeElement).toBe(buttons[0]);
      fireEvent.keyDown(buttons[0]!, { key: 'Tab', shiftKey: true });
      expect(document.activeElement).toBe(buttons.at(-1));
    }
    nested.remove();
    await act(async () => {
      fireEvent.keyDown(slot, { key: 'Escape' });
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
}

it('V-I08: NavigationCard uses the shared small title by default', () => {
  const { container } = render(
    <NavigationCard title="Destination" description="Details" path="#target" />,
  );
  expect(container.querySelector('.peaui-navigation-card__title--size-s')).not.toBeNull();
});

it('V-I09: page ranges are unique, valid and include the current page', () => {
  const { container, rerender } = render(
    <PaginationControl ariaLabel="Pages" totalPages={6} page={2} />,
  );
  for (let total = 1; total <= 12; total++)
    for (let page = 1; page <= total; page++) {
      rerender(<PaginationControl ariaLabel="Pages" totalPages={total} page={page} />);
      const numbers = [
        ...container.querySelectorAll('.peaui-pagination-control__button--page'),
      ].map((button) => Number(button.textContent));
      expect(new Set(numbers).size).toBe(numbers.length);
      expect(numbers).toContain(page);
      expect(numbers.every((number) => number >= 1 && number <= total)).toBe(true);
    }
});
