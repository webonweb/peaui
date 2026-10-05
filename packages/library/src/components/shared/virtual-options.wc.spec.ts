import { flushPromises } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { FormSelectElement } from '../form/FormSelect/index.wc';
import { FormMultiSelectElement } from '../form/FormMultiSelect/index.wc';
import { TransferListElement } from '../data-entry/TransferList/index.wc';

const options = Array.from({ length: 5000 }, (_, value) => ({
  label: `Option ${value}`,
  value,
  key: value,
}));
afterEach(() => document.body.replaceChildren());
describe.each([FormSelectElement, FormMultiSelectElement])('virtual WC select', (Element) => {
  it('bounds DOM, reveals End and removes stale ARIA references on scroll', async () => {
    const element = new Element();
    Object.assign(element, { id: 'virtual', name: 'virtual', value: [], options, virtual: true });
    document.body.append(element);
    await flushPromises();
    element
      .querySelector('[popover]')!
      .dispatchEvent(Object.assign(new Event('toggle'), { newState: 'open' }));
    await flushPromises();
    expect(element.querySelectorAll('[role="option"]').length).toBeGreaterThan(0);
    expect(element.querySelectorAll('[role="option"]').length).toBeLessThan(20);
    const input = element.querySelector('[role="combobox"]')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await flushPromises();
    expect(
      document
        .getElementById(input.getAttribute('aria-activedescendant')!)
        ?.getAttribute('aria-posinset'),
    ).toBe('5000');
    const list = element.querySelector<HTMLElement>('[role="listbox"]')!;
    list.scrollTop = 0;
    list.dispatchEvent(new Event('scroll'));
    await flushPromises();
    const activeId = input.getAttribute('aria-activedescendant');
    expect(activeId === null || document.getElementById(activeId) !== null).toBe(true);
  });
});
it('virtualizes both WC TransferList panels', async () => {
  const element = new TransferListElement();
  Object.assign(element, { items: options, virtual: true, value: [0, 1] });
  document.body.append(element);
  await flushPromises();
  expect(element.querySelectorAll('[role="option"]').length).toBeLessThan(25);
  const source = element.querySelector('[role="listbox"]')!;
  source.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
  await flushPromises();
  expect(
    document.getElementById(source.getAttribute('aria-activedescendant')!)?.textContent,
  ).toContain('Option 4999');
});
