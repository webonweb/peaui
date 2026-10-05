import { mount, flushPromises } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import FormSelect from '../form/FormSelect/index.vue';
import FormMultiSelect from '../form/FormMultiSelect/index.vue';
import TransferList from '../data-entry/TransferList/index.vue';

const options = Array.from({ length: 5000 }, (_, value) => ({
  label: `Option ${value}`,
  value,
  key: value,
}));
afterEach(() => document.body.replaceChildren());

describe.each([FormSelect, FormMultiSelect])('virtual Vue select', (Component) => {
  it('bounds DOM, reveals End, filters and keeps ARIA references valid when scrolling', async () => {
    const wrapper = mount(Component, {
      attachTo: document.body,
      props: { id: 'virtual', name: 'virtual', value: [], options, virtual: true },
    });
    const toggle = Object.assign(new Event('toggle'), { newState: 'open' });
    wrapper.get('[popover]').element.dispatchEvent(toggle);
    await flushPromises();
    expect(wrapper.findAll('[role="option"]').length).toBeGreaterThan(0);
    expect(wrapper.findAll('[role="option"]').length).toBeLessThan(20);
    await wrapper.get('[role="combobox"]').trigger('keydown', { key: 'End' });
    await flushPromises();
    const input = wrapper.get('[role="combobox"]');
    const active = document.getElementById(input.attributes('aria-activedescendant')!);
    expect(active?.getAttribute('aria-posinset')).toBe('5000');
    const list = wrapper.get('[role="listbox"]');
    (list.element as HTMLElement).scrollTop = 0;
    await list.trigger('scroll');
    const activeId = input.attributes('aria-activedescendant');
    expect(activeId === undefined || document.getElementById(activeId) !== null).toBe(true);
    await input.setValue('Option 4999');
    await flushPromises();
    expect(wrapper.findAll('[role="option"]')).toHaveLength(1);
    wrapper.unmount();
  });
});

it('virtualizes both Vue TransferList panels and reveals the last option', async () => {
  const wrapper = mount(TransferList, {
    attachTo: document.body,
    props: { items: options, virtual: true, value: [0, 1] },
  });
  await flushPromises();
  expect(wrapper.findAll('[role="option"]').length).toBeLessThan(25);
  const source = wrapper.findAll('[role="listbox"]')[0]!;
  await source.trigger('keydown', { key: 'End' });
  await flushPromises();
  expect(
    document.getElementById(source.attributes('aria-activedescendant')!)?.textContent,
  ).toContain('Option 4999');
  wrapper.unmount();
});
