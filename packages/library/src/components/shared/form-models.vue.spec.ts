import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { computeAccessibleName, computeAccessibleDescription } from 'dom-accessibility-api';
import FormInput from '../form/FormInput/index.vue';
import FormSelect from '../form/FormSelect/index.vue';
import FormCheckbox from '../form/FormCheckbox/index.vue';

const cleanups: (() => void)[] = [];
afterEach(() => {
  cleanups.splice(0).forEach((cleanup) => cleanup());
  document.body.replaceChildren();
});

describe('shared form contracts: Vue', () => {
  for (const slot of ['description', 'error', 'success']) {
    it(`connects the real ${slot} message to its input`, () => {
      const wrapper = mount(FormInput, {
        attachTo: document.body,
        props: { id: 'field', name: 'field', label: 'Field', value: '' },
        slots: { [slot]: 'Supporting text' },
      });
      cleanups.push(() => wrapper.unmount());
      expect(computeAccessibleDescription(wrapper.get('input').element)).toBe('Supporting text');
    });
  }
  it('respects an explicit accessible name in Select', () => {
    const wrapper = mount(FormSelect, {
      attachTo: document.body,
      props: { id: 'select', name: 'machine', value: '', options: [] },
      attrs: { 'aria-label': 'Choose a country' },
    });
    cleanups.push(() => wrapper.unmount());
    expect(computeAccessibleName(wrapper.get('input').element)).toBe('Choose a country');
  });
  it('does not expose a destructive action for a readonly input', () => {
    const wrapper = mount(FormInput, {
      props: { id: 'field', name: 'field', value: 'Keep', readonly: true, canErase: true },
    });
    cleanups.push(() => wrapper.unmount());
    expect(wrapper.find('.peaui-form-field__erase-button').exists()).toBe(false);
  });
  it('preserves checked state when disabled and enforces required when enabled', async () => {
    const wrapper = mount(FormCheckbox, {
      props: { id: 'choice', name: 'choice', value: true, disabled: true, required: true },
      slots: { default: 'Accept terms' },
    });
    cleanups.push(() => wrapper.unmount());
    expect(wrapper.get('input').element.checked).toBe(true);
    await wrapper.setProps({ value: false, disabled: false });
    expect(wrapper.get('input').element.validity.valueMissing).toBe(true);
  });
});
