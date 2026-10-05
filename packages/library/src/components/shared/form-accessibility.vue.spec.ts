import { mount } from '@vue/test-utils';
import { h, nextTick, ref, type Component } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import { computeAccessibleDescription } from 'dom-accessibility-api';
import FormPinInput from '../form/FormPinInput/index.vue';
import FormRatingInput from '../form/FormRatingInput/index.vue';
import FormSwitchToggle from '../form/FormSwitchToggle/index.vue';
import FormTagsInput from '../form/FormTagsInput/index.vue';
import FormFileUploadSimple from '../form/FormFileUploadSimple/index.vue';
import FormDateRangePicker from '../form/FormDateRangePicker/index.vue';
import FormDatePicker from '../form/FormDatePicker/index.vue';
import FormYearPicker from '../form/FormYearPicker/index.vue';
import FormButtonGroup from '../form/FormButtonGroup/index.vue';
import ToggleGroup from '../data-entry/ToggleGroup/index.vue';
import SelectableCard from '../data-entry/SelectableCard/index.vue';

const cleanup: (() => void)[] = [];
afterEach(() => {
  cleanup.splice(0).forEach((unmount) => unmount());
  document.body.replaceChildren();
});
describe('form accessibility regressions: Vue', () => {
  for (const [name, component, value] of [
    ['Pin', FormPinInput, '123456'],
    ['Rating', FormRatingInput, 2],
    ['Switch', FormSwitchToggle, false],
    ['Tags', FormTagsInput, []],
  ] as const) {
    it(`F01 responds to adding and removing ${name} label/error slots`, async () => {
      const visible = ref(false);
      const wrapper = mount(
        {
          render: () =>
            h(
              component as Component,
              { value, id: 'field', name: 'field' },
              visible.value ? { label: () => 'Async label', error: () => 'Async error' } : {},
            ),
        },
        { attachTo: document.body },
      );
      cleanup.push(() => wrapper.unmount());
      visible.value = true;
      await nextTick();
      const input = wrapper.get('input:not([type=hidden])').element;
      expect(wrapper.text()).toContain('Async label');
      expect(computeAccessibleDescription(input)).toContain('Async error');
      expect(input.getAttribute('aria-invalid')).toBe('true');
      visible.value = false;
      await nextTick();
      expect(computeAccessibleDescription(input)).not.toContain('Async error');
    });
  }
  it('F03 omits disabled ranges from native submission', () => {
    const wrapper = mount(
      {
        render: () =>
          h(
            'form',
            h(FormDateRangePicker, {
              id: 'dates',
              name: 'dates',
              value: ['2026-10-02', '2026-10-05'],
              disabled: true,
            }),
          ),
      },
      { attachTo: document.body },
    );
    cleanup.push(() => wrapper.unmount());
    expect([...new FormData(wrapper.get('form').element)]).toEqual([]);
  });
  for (const variant of ['single-input', 'two-inputs'] as const) {
    it(`F03 submits only canonical date endpoints for ${variant}`, () => {
      const wrapper = mount(
        {
          render: () =>
            h(
              'form',
              h(FormDateRangePicker, {
                id: 'dates',
                name: 'dates',
                value: ['2026-10-02', '2026-10-05'],
                variant,
              }),
            ),
        },
        { attachTo: document.body },
      );
      cleanup.push(() => wrapper.unmount());
      expect([...new FormData(wrapper.get('form').element)]).toEqual([
        ['dates.start', '2026-10-02'],
        ['dates.end', '2026-10-05'],
      ]);
    });
  }
  it('F05 reflects externally replaced and cleared files', async () => {
    const wrapper = mount(FormFileUploadSimple, { props: { files: [] } });
    cleanup.push(() => wrapper.unmount());
    await wrapper.setProps({
      files: [new File(['test'], 'external.pdf', { type: 'application/pdf' })],
    });
    expect(wrapper.text()).toContain('external.pdf');
    await wrapper.setProps({ files: [] });
    expect(wrapper.text()).not.toContain('external.pdf');
  });
  it('F06 exposes selection state', async () => {
    const wrapper = mount(SelectableCard, { props: { active: true } });
    cleanup.push(() => wrapper.unmount());
    expect(wrapper.get('button').attributes('aria-pressed')).toBe('true');
    await wrapper.setProps({ active: false });
    expect(wrapper.get('button').attributes('aria-pressed')).toBe('false');
  });
  for (const [name, component, value] of [
    ['Date', FormDatePicker, '2026-10-02'],
    ['Year', FormYearPicker, 2026],
    ['Rating', FormRatingInput, 2],
    ['ButtonGroup', FormButtonGroup, 'a'],
    ['ToggleGroup', ToggleGroup, 'a'],
  ] as const) {
    it(`F10 validates required ${name} without disabling readonly exemption`, async () => {
      const model = ref<unknown>(undefined);
      const disabled = ref(false);
      const readonly = ref(false);
      const options = [{ key: 'a', value: 'a', label: 'Alpha' }];
      const wrapper = mount(
        {
          render: () =>
            h(
              'form',
              h(component as Component, {
                value: model.value,
                id: 'field',
                name: 'field',
                required: true,
                disabled: disabled.value,
                readonly: readonly.value,
                options,
                items: options,
              }),
            ),
        },
        { attachTo: document.body },
      );
      cleanup.push(() => wrapper.unmount());
      const form = wrapper.get('form').element;
      expect(form.checkValidity()).toBe(false);
      expect(document.activeElement).not.toBe(document.body);
      expect(document.activeElement?.getAttribute('aria-hidden')).not.toBe('true');
      model.value = value;
      await nextTick();
      expect(form.checkValidity()).toBe(true);
      model.value = undefined;
      disabled.value = true;
      await nextTick();
      expect(form.checkValidity()).toBe(true);
      disabled.value = false;
      readonly.value = true;
      await nextTick();
      expect(form.checkValidity()).toBe(true);
    });
  }
});
