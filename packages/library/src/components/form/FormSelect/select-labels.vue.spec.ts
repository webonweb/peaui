import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import FormSelect from './index.vue';
import FormMultiSelect from '../FormMultiSelect/index.vue';

describe.each([FormSelect, FormMultiSelect])('select label localization', (Component) => {
  it('uses a localized search placeholder and empty message', async () => {
    const wrapper = mount(Component, {
      props: {
        id: 'localized',
        name: 'localized',
        value: Component === FormMultiSelect ? [] : '',
        options: [],
        labels: { placeholder: 'Choose', searchPlaceholder: 'Search', empty: 'No matches' },
      },
    });
    const input = wrapper.get('input[role="combobox"]');
    await wrapper.get('[popover]').trigger('toggle', { newState: 'open' });
    expect(input.attributes('placeholder')).toBe('Search');
    expect(wrapper.text()).toContain('No matches');
    wrapper.unmount();
  });
});
