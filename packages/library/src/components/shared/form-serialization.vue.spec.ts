import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { computeAccessibleName } from 'dom-accessibility-api';
import FormNumber from '../form/FormNumber/index.vue';
import FormSelect from '../form/FormSelect/index.vue';
import FormMultiSelect from '../form/FormMultiSelect/index.vue';
import ModalDialog from '../overlayer/ModalDialog/index.vue';

const cleanups: (() => void)[] = [];
afterEach(() => {
  cleanups.splice(0).forEach((fn) => fn());
  document.body.replaceChildren();
});
describe('regressions: Vue form contracts', () => {
  it('keeps zero bounds and an empty numeric value', async () => {
    const wrapper = mount(FormNumber, {
      props: { id: 'number', name: 'number', value: 1, min: 0, max: 0 },
    });
    cleanups.push(() => wrapper.unmount());
    const input = wrapper.get('input');
    expect(input.attributes('min')).toBe('0');
    expect(input.attributes('max')).toBe('0');
    input.element.value = '';
    await input.trigger('blur');
    expect(wrapper.emitted('update:value')?.at(-1)).toEqual([undefined]);
  });
  for (const multi of [false, true]) {
    it(`serializes ${multi ? 'multiple' : 'single'} selected values, not labels`, async () => {
      const form = document.createElement('form');
      document.body.append(form);
      const Component = multi ? FormMultiSelect : FormSelect;
      const wrapper = mount(Component, {
        attachTo: form,
        props: {
          id: 'select',
          name: 'choice',
          value: multi ? ['a', 'b'] : 'b',
          options: [
            { value: 'a', label: 'Alpha' },
            { value: 'b', label: 'Beta' },
          ],
        },
      });
      cleanups.push(() => wrapper.unmount());
      expect(new FormData(form).getAll('choice')).toEqual(multi ? ['a', 'b'] : ['b']);
      await wrapper.setProps({ disabled: true });
      expect(new FormData(form).has('choice')).toBe(false);
    });
  }
  it('enforces required for a select-only combobox and focuses the visible control', async () => {
    const form = document.createElement('form');
    document.body.append(form);
    const wrapper = mount(FormSelect, {
      attachTo: form,
      props: {
        id: 'choice',
        name: 'choice',
        value: '',
        searchable: false,
        required: true,
        options: [],
      },
    });
    cleanups.push(() => wrapper.unmount());
    expect(form.reportValidity()).toBe(false);
    expect(document.activeElement).toBe(wrapper.get('input[role="combobox"]').element);
    await wrapper.setProps({ value: 'a', options: [{ value: 'a', label: 'Alpha' }] });
    expect(wrapper.get('input').attributes('aria-invalid')).not.toBe('true');
  });
  it('preserves a standard dialog accessible name', () => {
    const wrapper = mount(ModalDialog, {
      props: { open: false },
      attrs: { 'aria-label': 'Explicit title' },
    });
    cleanups.push(() => wrapper.unmount());
    wrapper.get('dialog').element.setAttribute('open', '');
    expect(computeAccessibleName(wrapper.get('dialog').element)).toBe('Explicit title');
  });
});
