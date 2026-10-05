import '@testing-library/jest-dom/vitest';

import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));
vi.mock('@/constants', () => ({ UIKIT_NAME: 'peaui' }));

const FormFieldStub = defineComponent({
  name: 'FormField',
  props: {
    id: String,
    label: String,
    name: String,
    placeholder: String,
    value: [String, Array],
    disabled: Boolean,
    readonly: Boolean,
    required: Boolean,
    dataTestId: String,
  },
  emits: ['on:remove'],
  setup(props, { emit, slots }) {
    return () =>
      h('div', { 'data-testid': props.dataTestId }, [
        props.label ? h('label', { for: props.id, id: `label-${props.id}` }, props.label) : null,
        slots.default?.({
          props: {
            'aria-describedby': slots.error ? `${props.id}-error` : undefined,
            class: 'peaui-form-field__element',
            disabled: props.disabled,
            id: props.id,
            name: props.name,
            placeholder: props.placeholder,
            readonly: props.readonly,
            required: props.required,
          },
        }),
        props.value
          ? h('button', { type: 'button', onClick: () => emit('on:remove') }, 'erase')
          : null,
        slots.description?.(),
        slots.error ? h('p', { id: `${props.id}-error` }, slots.error()) : null,
      ]);
  },
});

const PopoverStub = defineComponent({
  name: 'PopoverOverlayer',
  props: { disabled: Boolean },
  emits: ['update:open'],
  setup(props, { emit, expose, slots }) {
    const visible = ref(false);
    const showPopover = () => {
      if (props.disabled || visible.value) return;
      visible.value = true;
      emit('update:open', true);
    };
    const hidePopover = () => {
      if (!visible.value) return;
      visible.value = false;
      emit('update:open', false);
    };
    expose({ hidePopover, showPopover });
    return () => h('div', [slots.default?.(), visible.value ? h('div', slots.content?.()) : null]);
  },
});

const PickerNavigationStub = defineComponent({
  name: 'PickerNavigation',
  emits: ['on:previous', 'on:next'],
  setup(_, { emit }) {
    return () =>
      h('div', [
        h('button', { type: 'button', onClick: () => emit('on:previous') }, 'Poprzedni miesiąc'),
        h('button', { type: 'button', onClick: () => emit('on:next') }, 'Następny miesiąc'),
      ]);
  },
});

import FormDateRangePicker from './index.vue';
import type { DateRangeValue } from './date-range-picker.shared';

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 7, 1, 12));
});

afterEach(() => vi.useRealTimers());

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

function mountPicker(props: Record<string, unknown> = {}) {
  const wrapper = mount(FormDateRangePicker, {
    attachTo: document.body,
    props: {
      id: 'report-range',
      name: 'reportRange',
      label: 'Zakres raportu',
      dataTestId: 'range-picker',
      value: undefined,
      'onUpdate:value': async (nextValue: DateRangeValue | undefined) => {
        await wrapper.setProps({ value: nextValue });
      },
      'onUpdate:open': async (nextOpen: boolean) => {
        await wrapper.setProps({ open: nextOpen });
      },
      ...props,
    },
    global: {
      stubs: {
        FormField: FormFieldStub,
        PickerNavigation: PickerNavigationStub,
        PopoverOverlayer: PopoverStub,
      },
    },
  });
  return wrapper;
}

describe('FormDateRangePicker Vue', () => {
  it('renderuje dwa nazwane comboboksy i dwa spójne gridy kalendarza', async () => {
    const wrapper = mountPicker({ description: 'Okres raportowania' });
    const inputs = wrapper.findAll('[role="combobox"]');
    expect(inputs).toHaveLength(2);
    expect(inputs[0]!.element).toHaveAccessibleName('Data początkowa');
    expect(inputs[1]!.element).toHaveAccessibleName('Data końcowa');
    expect(inputs[0]!.element).toHaveAttribute('aria-controls', 'report-range-panel');
    await inputs[0]!.trigger('keydown', { key: 'ArrowDown' });
    await nextTick();
    const dialog = wrapper.get('[role="dialog"]');
    expect(dialog.element).toHaveAccessibleName('Wybierz zakres dat');
    expect(dialog.findAll('[role="grid"]')).toHaveLength(2);
    expect(dialog.findAll('[role="gridcell"]')).toHaveLength(84);
  });

  it('publikuje początek, koniec i kompletny model w trybie immediate', async () => {
    const wrapper = mountPicker({ calendars: 1, dateFormat: 'iso' });
    await wrapper.get('[role="combobox"]').trigger('click');
    await wrapper.get('[data-date="2026-08-10"]').trigger('click');
    expect(wrapper.emitted('startChange')?.at(-1)).toEqual(['2026-08-10']);
    expect(wrapper.emitted('update:value')?.at(-1)).toEqual([['2026-08-10', undefined]]);
    await wrapper.get('[data-date="2026-08-18"]').trigger('click');
    expect(wrapper.emitted('endChange')?.at(-1)).toEqual(['2026-08-18']);
    expect(wrapper.emitted('change')?.at(-1)).toEqual([['2026-08-10', '2026-08-18']]);
  });

  it('synchronizuje ręczne pola i stosuje politykę swap', async () => {
    const wrapper = mountPicker({ dateFormat: 'iso' });
    const start = wrapper.get('[data-testid="range-picker-start-input"]');
    const end = wrapper.get('[data-testid="range-picker-end-input"]');
    await start.setValue('2026-08-18');
    await start.trigger('blur');
    await end.setValue('2026-08-10');
    await end.trigger('blur');
    expect(wrapper.emitted('update:value')?.at(-1)).toEqual([['2026-08-10', '2026-08-18']]);
    expect(start.element).toHaveValue('2026-08-10');
    expect(end.element).toHaveValue('2026-08-18');
  });

  it('w trybie confirm przywraca wartość po cancel i publikuje dopiero apply', async () => {
    const value: DateRangeValue = ['2026-08-10', '2026-08-18'];
    const wrapper = mountPicker({ calendars: 1, confirm: true, value });
    await wrapper.get('[role="combobox"]').trigger('click');
    await wrapper.get('[data-date="2026-08-20"]').trigger('click');
    await wrapper.get('[data-date="2026-08-25"]').trigger('click');
    expect(wrapper.emitted('update:value')).toBeUndefined();
    const cancelButton = wrapper.get(`.${'peaui-form-date-range-picker'}__button--secondary`);
    expect(cancelButton.classes()).toEqual(
      expect.arrayContaining([
        'peaui-button-action',
        'peaui-button-action--size-xs',
        'peaui-button-action--variant-secondary',
      ]),
    );
    await cancelButton.trigger('click');
    expect(wrapper.emitted('cancel')).toHaveLength(1);

    await wrapper.get('[role="combobox"]').trigger('click');
    await wrapper.get('[data-date="2026-08-20"]').trigger('click');
    await wrapper.get('[data-date="2026-08-25"]').trigger('click');
    const applyButton = wrapper.get('.peaui-form-date-range-picker__button--primary');
    expect(applyButton.classes()).toEqual(
      expect.arrayContaining([
        'peaui-button-action',
        'peaui-button-action--size-xs',
        'peaui-button-action--variant-primary',
      ]),
    );
    await applyButton.trigger('click');
    expect(wrapper.emitted('apply')?.at(-1)).toEqual([['2026-08-20', '2026-08-25']]);
  });

  it('zgłasza order w polityce reject i respektuje disabled', async () => {
    const wrapper = mountPicker({
      calendars: 1,
      selectionOrder: 'reject',
      isDateDisabled: (date: string) => date === '2026-08-12',
    });
    await wrapper.get('[role="combobox"]').trigger('click');
    expect(wrapper.get('[data-date="2026-08-12"]').element).toBeDisabled();
    await wrapper.get('[data-date="2026-08-18"]').trigger('click');
    await wrapper.get('[data-date="2026-08-10"]').trigger('click');
    expect(wrapper.emitted('invalid')?.at(-1)?.[0]).toMatchObject({
      reason: 'order',
      section: 'end',
    });
  });

  it('wybiera poprawny preset i publikuje jego zakres', async () => {
    const preset: DateRangeValue = ['2026-08-03', '2026-08-09'];
    const wrapper = mountPicker({
      calendars: 1,
      presets: [{ id: 'previous-week', label: 'Poprzedni tydzień', value: preset }],
    });
    await wrapper.get('[role="combobox"]').trigger('click');
    const presetButton = wrapper.get('.peaui-form-date-range-picker__preset');
    expect(presetButton.classes()).toEqual(
      expect.arrayContaining([
        'peaui-button-action',
        'peaui-button-action--size-xxs',
        'peaui-button-action--variant-ghost',
      ]),
    );
    await presetButton.trigger('click');
    expect(wrapper.emitted('change')?.at(-1)).toEqual([preset]);
    expect(wrapper.emitted('update:value')?.at(-1)).toEqual([preset]);
  });

  it.each(['disabled', 'readonly', 'loading'] as const)(
    'nie otwiera panelu w stanie %s',
    async (state) => {
      const wrapper = mountPicker({ [state]: true });
      const input = wrapper.get('[role="combobox"]');
      await input.trigger('click');
      await input.trigger('keydown', { key: 'ArrowDown' });
      expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
      if (state === 'readonly') expect(input.element).toHaveAttribute('aria-readonly', 'true');
      else expect(input.element).toBeDisabled();
    },
  );
});
