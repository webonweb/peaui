import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import FormSelect from './index.vue';
import FormMultiSelect from '../FormMultiSelect/index.vue';

const cleanups: (() => void)[] = [];
afterEach(() => {
  cleanups.splice(0).forEach((cleanup) => cleanup());
  document.body.replaceChildren();
});

describe('Select native form regressions: Vue', () => {
  for (const multi of [false, true]) {
    it(`validates ${multi ? 'multiple' : 'single'} selected values while search is open`, async () => {
      const form = document.createElement('form');
      document.body.append(form);
      const wrapper = mount(multi ? FormMultiSelect : FormSelect, {
        attachTo: form,
        props: {
          id: 'choice',
          name: 'choice',
          required: true,
          value: multi ? ['a'] : 'a',
          options: [{ value: 'a', label: 'Alpha' }],
        },
      });
      cleanups.push(() => wrapper.unmount());
      expect(form.checkValidity()).toBe(true);
      await wrapper.get('[popover]').trigger('toggle', { newState: 'open' });
      const input = wrapper.get<HTMLInputElement>('input[role="combobox"]');
      expect(input.element.value).toBe('');
      expect(input.attributes('aria-required')).toBe('true');
      expect(form.checkValidity()).toBe(true);
      await input.setValue('No match');
      expect(form.checkValidity()).toBe(true);
      expect(new FormData(form).getAll('choice')).toEqual(['a']);
      await wrapper.setProps({ value: multi ? [] : '' });
      expect(form.reportValidity()).toBe(false);
      expect(document.activeElement).toBe(input.element);
    });
  }

  it('preserves and submits writable values after Tab and reopening', async () => {
    const form = document.createElement('form');
    document.body.append(form);
    const wrapper = mount(FormSelect, {
      attachTo: form,
      props: {
        id: 'choice',
        name: 'choice',
        canWrite: true,
        required: true,
        value: '',
        options: [],
      },
    });
    cleanups.push(() => wrapper.unmount());
    await wrapper.get('[popover]').trigger('toggle', { newState: 'open' });
    const input = wrapper.get<HTMLInputElement>('input[role="combobox"]');
    await input.setValue('Custom choice');
    expect(wrapper.emitted('update:value')?.at(-1)).toEqual(['Custom choice']);
    await input.trigger('keydown', { key: 'Tab' });
    expect(input.element.value).toBe('Custom choice');
    expect(new FormData(form).get('choice')).toBe('Custom choice');
    await wrapper.get('[popover]').trigger('toggle', { newState: 'open' });
    expect(input.element.value).toBe('Custom choice');
    await input.setValue('');
    expect(form.checkValidity()).toBe(false);
  });
});
