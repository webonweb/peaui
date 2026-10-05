/** @jsxImportSource react */
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { computeAccessibleName } from 'dom-accessibility-api';
import { afterEach, expect, it, vi } from 'vitest';
import Breadcrumbs from '../navigation/Breadcrumbs';
import NavigationTabs from '../navigation/NavigationTabs';
import NavigationStepper from '../navigation/NavigationStepper';
import NavigationLink from '../navigation/NavigationLink';
import NavigationIconCard from '../navigation/NavigationIconCard';
import PopoverButton from '../overlayer/PopoverButton';
import PopoverOverlayer from '../overlayer/PopoverOverlayer';
import DisclosurePanel from '../data-display/DisclosurePanel';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it('O10: a card without a path remains a named disabled link', () => {
  const { getByRole } = render(
    <NavigationIconCard icon="home" text="" path="   " ariaLabel="Unavailable" />,
  );
  const link = getByRole('link', { name: 'Unavailable' });
  expect(link.hasAttribute('href')).toBe(false);
  expect(link.getAttribute('aria-disabled')).toBe('true');
  expect(link.tabIndex).toBe(-1);
});

it('O03: mobile breadcrumbs expose working ancestor links and original navigation items', () => {
  const items = [
    { key: 'home', label: 'Home', path: '/home' },
    { key: 'current', label: 'Current' },
  ];
  const onNavigate = vi.fn((...args: unknown[]) => {
    const event = args[1];
    if (typeof event !== 'object' || event === null) return;
    const preventDefault: unknown = Reflect.get(event, 'preventDefault');
    if (typeof preventDefault === 'function') Reflect.apply(preventDefault, event, []);
  });
  const { container } = render(<Breadcrumbs items={items} onNavigate={onNavigate} />);
  const mobile = container.querySelector('.peaui-breadcrumbs__mobile')!;
  const trigger = mobile.querySelector('button')!;
  expect(trigger).not.toBeNull();
  fireEvent.click(trigger);
  const link = mobile.querySelector('a')!;
  expect(link.getAttribute('href')).toBe('/home');
  fireEvent.click(link);
  expect(onNavigate.mock.calls[0]?.[0]).toBe(items[0]);
});

it('O05/O06: navigation keys skip disabled tabs and emit the original public object', () => {
  const tabs = [
    { key: 'a', label: 'Alpha', active: true },
    { key: 'b', label: 'Blocked', disabled: true },
    { key: 'c', label: 'Charlie' },
  ];
  const onSelect = vi.fn();
  const { getByRole } = render(
    <NavigationTabs ariaLabel="Sections" tabs={tabs} onSelect={onSelect} />,
  );
  const first = getByRole('button', { name: 'Alpha' });
  const last = getByRole('button', { name: 'Charlie' });
  first.focus();
  fireEvent.keyDown(first, { key: 'ArrowRight' });
  expect(document.activeElement).toBe(last);
  fireEvent.keyDown(last, { key: 'Home' });
  expect(document.activeElement).toBe(first);
  fireEvent.keyDown(first, { key: 'End' });
  expect(document.activeElement).toBe(last);
  fireEvent.click(last);
  expect(onSelect).toHaveBeenCalledWith(tabs[2]);
  expect(onSelect.mock.calls[0]?.[0]).toBe(tabs[2]);
});

it('O04: stepper controls react to overflow and keyboard navigation skips unavailable steps', () => {
  const options = [
    { key: 'a', label: 'Alpha', status: 'complete' as const },
    { key: 'b', label: 'Blocked', status: 'disabled' as const },
    { key: 'c', label: 'Charlie', status: 'during' as const },
  ];
  const { container } = render(<NavigationStepper options={options} />);
  const viewport = container.querySelector<HTMLElement>('.peaui-navigation-stepper__viewport')!;
  Object.defineProperties(viewport, {
    scrollWidth: { configurable: true, value: 900 },
    clientWidth: { configurable: true, value: 250 },
  });
  const scrollBy = vi.fn();
  viewport.scrollBy = scrollBy;
  act(() => window.dispatchEvent(new Event('resize')));
  const next = container.querySelector<HTMLButtonElement>(
    '.peaui-navigation-stepper__control--next',
  )!;
  expect(next.disabled).toBe(false);
  fireEvent.click(next);
  expect(scrollBy).toHaveBeenCalledWith(expect.objectContaining({ left: 284 }));
  const steps = container.querySelectorAll<HTMLButtonElement>('.peaui-navigation-stepper__step');
  steps[0]!.focus();
  fireEvent.keyDown(steps[0]!, { key: 'End' });
  expect(document.activeElement).toBe(steps[2]);
  viewport.scrollLeft = 650;
  fireEvent.scroll(viewport);
  expect(next.disabled).toBe(true);
});

it.each([PopoverButton, PopoverOverlayer])(
  'O07: default popover dialog is named by its trigger',
  (Component) => {
    const { getByRole } = render(<Component content="Details">Open details</Component>);
    fireEvent.click(getByRole('button', { name: 'Open details' }));
    expect(computeAccessibleName(getByRole('dialog'))).toBe('Open details');
  },
);

it('O08: a nested native trigger owns semantics and receives restored focus', () => {
  const { getByRole, container } = render(
    <PopoverOverlayer content={<button>Inner action</button>}>
      <button>Open details</button>
    </PopoverOverlayer>,
  );
  const wrapper = container.querySelector('.peaui-popover-overlayer')!;
  const trigger = getByRole('button', { name: 'Open details' });
  expect(wrapper.hasAttribute('role')).toBe(false);
  expect(wrapper.hasAttribute('tabindex')).toBe(false);
  expect(trigger.getAttribute('aria-expanded')).toBe('false');
  fireEvent.click(trigger);
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
  const inner = getByRole('button', { name: 'Inner action' });
  inner.focus();
  fireEvent.keyDown(inner, { key: 'Escape' });
  expect(document.activeElement).toBe(trigger);
});

it('O12: ariaLabel names the actionable disclosure summary', () => {
  const { container } = render(<DisclosurePanel ariaLabel="More details">Content</DisclosurePanel>);
  expect(computeAccessibleName(container.querySelector('summary')!)).toBe('More details');
});

it('O13: NavigationLink uses the shared small default', () => {
  const { getByRole } = render(<NavigationLink path="/home">Home</NavigationLink>);
  expect(getByRole('link').classList.contains('peaui-navigation-link--size-s')).toBe(true);
});
