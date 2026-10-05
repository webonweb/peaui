/** @jsxImportSource react */
import { act, type ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot, type Root } from 'react-dom/client';
import { fireEvent, render, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import PopoverButton from '../overlayer/PopoverButton/index';
import PopoverOverlayer from '../overlayer/PopoverOverlayer/index';
import FormSelect from '../form/FormSelect/index';
import FormColorPicker from '../form/FormColorPicker/index';
import FormTimePicker from '../form/FormTimePicker/index';
import FormDateTimePicker from '../form/FormDateTimePicker/index';

const fixtures: Array<[string, () => ReactElement]> = [
  [
    'PopoverButton',
    () => <PopoverButton content={<button type="button">Inside</button>}>Open</PopoverButton>,
  ],
  [
    'PopoverOverlayer',
    () => <PopoverOverlayer content={<button type="button">Inside</button>}>Open</PopoverOverlayer>,
  ],
  [
    'FormSelect',
    () => (
      <FormSelect
        id="choice"
        name="choice"
        label="Choice"
        options={[{ value: 'a', label: 'Alpha' }]}
      />
    ),
  ],
  ['FormColorPicker', () => <FormColorPicker id="color" name="color" label="Color" />],
  ['FormTimePicker', () => <FormTimePicker id="time" name="time" label="Time" />],
  [
    'FormDateTimePicker',
    () => <FormDateTimePicker id="date-time" name="date-time" label="Date and time" />,
  ],
];
let hydratedRoot: Root | undefined;
const nativeMethods = new Map(
  ['showPopover', 'hidePopover'].map((name) => [
    name,
    Object.getOwnPropertyDescriptor(HTMLElement.prototype, name),
  ]),
);
afterEach(async () => {
  if (hydratedRoot) await act(async () => hydratedRoot?.unmount());
  hydratedRoot = undefined;
  cleanup();
  document.body.replaceChildren();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  for (const [name, descriptor] of nativeMethods) {
    if (descriptor) Object.defineProperty(HTMLElement.prototype, name, descriptor);
    else Reflect.deleteProperty(HTMLElement.prototype, name);
  }
});

describe('V-A01: server markup and native popover hydration', () => {
  it.each(fixtures)(
    '%s preserves native popover markup across server and browser',
    async (_name, fixture) => {
      const htmlElement = globalThis.HTMLElement;
      vi.stubGlobal('HTMLElement', undefined);
      const markup = renderToString(fixture());
      vi.stubGlobal('HTMLElement', htmlElement);
      expect(markup).toContain('popover="auto"');

      // Native support exists only in the browser, after the server produced markup.
      Object.defineProperty(HTMLElement.prototype, 'showPopover', {
        configurable: true,
        value: vi.fn(),
      });
      Object.defineProperty(HTMLElement.prototype, 'hidePopover', {
        configurable: true,
        value: vi.fn(),
      });
      const matches = Element.prototype.matches;
      vi.spyOn(Element.prototype, 'matches').mockImplementation(function (this: Element, selector) {
        return selector === ':popover-open' ? false : matches.call(this, selector);
      });
      const host = document.createElement('div');
      host.innerHTML = markup;
      document.body.append(host);
      const panel = host.querySelector('[popover]');
      const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      const recoverable = vi.fn();
      await act(async () => {
        hydratedRoot = hydrateRoot(host, fixture(), { onRecoverableError: recoverable });
      });
      expect(host.querySelector('[popover]')).toBe(panel);
      expect(panel).toHaveAttribute('popover', 'auto');
      expect(recoverable).not.toHaveBeenCalled();
      expect(errors.mock.calls.flat().join(' ')).not.toMatch(/hydrat|didn't match/i);
    },
  );

  it.each(fixtures.slice(0, 2))(
    '%s still hides, opens and closes without native support',
    (_name, fixture) => {
      const result = render(fixture());
      const trigger = result.getByRole('button', { name: 'Open' });
      const panel = result.getByRole('dialog', { hidden: true });
      expect(panel.hidden).toBe(true);
      fireEvent.click(trigger);
      expect(panel.hidden).toBe(false);
      expect(result.getByRole('dialog')).toBe(panel);
      expect(panel).toBeVisible();
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      fireEvent.keyDown(panel, { key: 'Escape' });
      expect(panel.hidden).toBe(true);
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    },
  );
});
