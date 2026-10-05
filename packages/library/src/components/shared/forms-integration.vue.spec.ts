import { mount } from '@vue/test-utils';
import { h, nextTick, ref, type Component } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import FormButtonCheckbox from '../form/FormButtonCheckbox/index.vue';
import FormTimePicker from '../form/FormTimePicker/index.vue';
import FormDateTimePicker from '../form/FormDateTimePicker/index.vue';
import FormColorPicker from '../form/FormColorPicker/index.vue';
import FormDateRangePicker from '../form/FormDateRangePicker/index.vue';
import FormPinInput from '../form/FormPinInput/index.vue';
import FormTagsInput from '../form/FormTagsInput/index.vue';
import FormRatingInput from '../form/FormRatingInput/index.vue';
import FormButtonGroup from '../form/FormButtonGroup/index.vue';
import InputSlider from '../data-entry/InputSlider/index.vue';

const cleanups: (() => void)[] = [];
afterEach(() => {
  cleanups.splice(0).forEach((cleanup) => cleanup());
  document.body.replaceChildren();
});
function fixture(component: Component, props: Record<string, unknown>, external = false) {
  props = { id: 'field', ...props };
  const wrapper = mount(
    {
      render: () =>
        external
          ? h('div', [h('form', { id: 'owner' }), h(component, props)])
          : h('form', h(component, props)),
    },
    { attachTo: document.body },
  );
  cleanups.push(() => wrapper.unmount());
  return { wrapper, form: wrapper.get('form').element };
}
describe('form integration: Vue', () => {
  for (const [name, component, value] of [
    ['Color', FormColorPicker, '#4C9A2A'],
    ['Time', FormTimePicker, '10:30'],
    ['DateTime', FormDateTimePicker, { date: '2026-10-02', time: '10:30' }],
    ['DateRange', FormDateRangePicker, ['2026-10-02', '2026-10-05']],
  ] as const) {
    it(`V-F01 resets an invalid ${name} draft without altering the owned model`, async () => {
      const { wrapper, form } = fixture(component, { value, name: 'field' });
      const control = wrapper.get('input:not([type=hidden]):not([aria-hidden=true])');
      const input = control.element as HTMLInputElement;
      const before = input.value;
      await control.setValue('invalid');
      await control.trigger('blur');
      expect(input.value).not.toBe(before);
      form.reset();
      await new Promise((resolve) => setTimeout(resolve, 0));
      await nextTick();
      expect(input.value).toBe(before);
      expect(input.getAttribute('aria-invalid')).not.toBe('true');
    });
  }
  it('V-F02 uses native required validation for button checkbox', async () => {
    const value = ref(false);
    const { wrapper, form } = fixture(
      {
        render: () =>
          h(FormButtonCheckbox, {
            id: 'agree',
            name: 'agree',
            required: true,
            value: value.value,
            'onUpdate:value': (next: boolean | undefined) => {
              value.value = next ?? false;
            },
          }),
      },
      {},
    );
    expect(form.checkValidity()).toBe(false);
    await wrapper.get('input').setValue(true);
    expect(form.checkValidity()).toBe(true);
  });
  it('V-F03 validates empty segmented time', () => {
    const { form } = fixture(FormTimePicker, {
      name: 'time',
      variant: 'segmented',
      required: true,
    });
    expect(form.checkValidity()).toBe(false);
  });
  it('V-F03 omits disabled segmented time', () => {
    const { form } = fixture(FormTimePicker, {
      name: 'time',
      variant: 'segmented',
      value: '10:30',
      disabled: true,
    });
    expect([...new FormData(form)]).toEqual([]);
  });
  it('V-F04 preserves the split date-time serialization contract', () => {
    const { form } = fixture(FormDateTimePicker, {
      name: 'when',
      variant: 'split-input',
      value: { date: '2026-10-02', time: '10:30' },
      required: true,
    });
    expect([...new FormData(form)]).toEqual([
      ['when', '02.10.2026'],
      ['when', '10:30'],
    ]);
    expect(form.checkValidity()).toBe(true);
  });
  for (const [name, component, selector] of [
    ['Pin', FormPinInput, 'input:not([type=hidden])'],
    ['Tags', FormTagsInput, 'input:not([type=hidden])'],
    ['Rating', FormRatingInput, 'input[type=range]'],
  ] as const) {
    it(`V-F05 associates ${name} native controls with external form`, () => {
      const { wrapper, form } = fixture(
        component,
        { name: 'field', form: 'owner', required: true },
        true,
      );
      expect((wrapper.get(selector).element as HTMLInputElement).form).toBe(form);
      expect(form.checkValidity()).toBe(false);
    });
  }
  it('V-F06/V-F14 forwards external form and label id to native slider', () => {
    const { wrapper, form } = fixture(
      InputSlider,
      { id: 'volume', name: 'volume', form: 'owner', value: 0.5 },
      true,
    );
    const input = wrapper.get('input').element;
    expect(input.form).toBe(form);
    expect(input.id).toBe('volume');
    expect(wrapper.findAll('#volume')).toHaveLength(1);
    expect([...new FormData(form)]).toEqual([['volume', '0.5']]);
  });
  it('V-F09 uses a single active fallback for selection, validation and submission', () => {
    const { wrapper, form } = fixture(FormButtonGroup, {
      name: 'choice',
      required: true,
      options: [
        { key: 'a', label: 'Alpha', active: true },
        { key: 'b', label: 'Beta', active: true },
      ],
    });
    expect(wrapper.findAll('[role=radio][aria-checked=true]')).toHaveLength(1);
    expect(form.checkValidity()).toBe(true);
    expect([...new FormData(form)]).toEqual([['choice', 'a']]);
  });
  it('V-F09 permits toggling an active default off and clearing a controlled model', async () => {
    const props = {
      name: 'choice',
      isToggle: true,
      options: [{ key: 'a', label: 'Alpha', active: true }],
    };
    const { wrapper } = fixture(FormButtonGroup, props);
    await wrapper.get('[role=radio]').trigger('click');
    expect(wrapper.get('[role=radio]').attributes('aria-checked')).toBe('false');
    const value = ref<string | undefined>('a');
    const controlled = fixture(
      { render: () => h(FormButtonGroup, { ...props, id: 'controlled', value: value.value }) },
      {},
    );
    value.value = undefined;
    await nextTick();
    expect(controlled.wrapper.get('[role=radio]').attributes('aria-checked')).toBe('false');
  });
  it('V-F13 filters suggestions with linear identity reads', async () => {
    const tags = Array.from({ length: 200 }, (_, i) => ({ id: i, label: `Tag ${i}` }));
    const suggestions = Array.from({ length: 200 }, (_, i) => ({
      id: i + 200,
      label: `Next ${i}`,
    }));
    const getTagKey = vi.fn((tag: { id: number }) => tag.id);
    const { wrapper } = fixture(FormTagsInput, {
      name: 'tags',
      value: tags,
      suggestions,
      getTagKey,
    });
    await wrapper.get('input:not([type=hidden])').trigger('focus');
    expect(getTagKey.mock.calls.length).toBeLessThan(tags.length * 50);
  });
});
