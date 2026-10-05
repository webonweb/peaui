import '@testing-library/jest-dom/vitest';

import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

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
    value: String,
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
          ? h(
              'button',
              {
                type: 'button',
                'data-testid': `${props.dataTestId}-erase-button`,
                onClick: () => emit('on:remove'),
              },
              'erase',
            )
          : null,
        slots.description?.(),
        slots.error ? h('p', { id: `${props.id}-error` }, slots.error()) : null,
      ]);
  },
});

const PopoverStub = defineComponent({
  name: 'PopoverOverlayer',
  props: { disabled: Boolean, dataTestId: String },
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

const SvgIconStub = defineComponent({
  name: 'SvgIcon',
  setup: () => () => h('svg', { 'aria-hidden': 'true' }),
});

import FormDateTimePicker from './index.vue';
import type { LocalDateTimeValue } from './date-time-picker.shared';

const initialValue: LocalDateTimeValue = { date: '2026-08-18', time: '09:30' };

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

function mountPicker(props: Record<string, unknown> = {}) {
  const wrapper = mount(FormDateTimePicker, {
    attachTo: document.body,
    props: {
      id: 'meeting-date-time',
      name: 'meetingDateTime',
      label: 'Termin spotkania',
      dataTestId: 'date-time-picker',
      value: initialValue,
      'onUpdate:value': async (nextValue: LocalDateTimeValue | undefined) => {
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
        SvgIcon: SvgIconStub,
      },
    },
  });
  return wrapper;
}

describe('FormDateTimePicker Vue', () => {
  it('renderuje nazwany combobox i dostępny dialog z dwiema sekcjami', async () => {
    const wrapper = mountPicker({ description: 'Czas lokalny', showTimeZone: true });
    const input = wrapper.get('[role="combobox"]');
    expect(input.element).toHaveAttribute('aria-haspopup', 'dialog');
    expect(input.element).toHaveAttribute('aria-controls', 'meeting-date-time-panel');
    expect(input.element).toHaveAttribute('aria-expanded', 'false');
    expect(input.element).toHaveAccessibleName('Termin spotkania');
    expect(input.element).toHaveValue('18.08.2026 09:30');

    await input.trigger('keydown', { key: 'ArrowDown' });
    await nextTick();
    const dialog = wrapper.get('[role="dialog"]');
    expect(dialog.element).toHaveAttribute('aria-label', 'Wybierz datę i czas');
    expect(dialog.findAll('[role="grid"]')).toHaveLength(1);
    expect(dialog.findAll('[role="spinbutton"]')).toHaveLength(2);
    expect(dialog.text()).toContain('Strefa:');
  });

  it('parsuje wpis ręczny do jawnego modelu bez konwersji strefy', async () => {
    const wrapper = mountPicker({ dateFormat: 'iso', timeZone: 'Europe/Warsaw' });
    const input = wrapper.get('[role="combobox"]');
    await input.setValue('2026-10-25 02:30');
    await input.trigger('blur');

    expect(wrapper.emitted('update:value')?.at(-1)).toEqual([
      { date: '2026-10-25', time: '02:30' },
    ]);
    expect(wrapper.emitted('change')?.at(-1)).toEqual([{ date: '2026-10-25', time: '02:30' }]);
  });

  it('synchronizuje wybór dnia i zmianę czasu w trybie immediate', async () => {
    const wrapper = mountPicker();
    await wrapper.get('[role="combobox"]').trigger('click');
    await wrapper.get('[data-date="2026-08-20"]').trigger('click');
    expect(wrapper.emitted('dateChange')?.at(-1)).toEqual(['2026-08-20']);
    expect(wrapper.emitted('update:value')?.at(-1)).toEqual([
      { date: '2026-08-20', time: '09:30' },
    ]);

    const increaseHour = wrapper.get('button[aria-label="Zwiększ: godzina"]');
    await increaseHour.trigger('click');
    expect(wrapper.emitted('timeChange')?.at(-1)).toEqual(['10:30']);
    expect(wrapper.emitted('update:value')?.at(-1)).toEqual([
      { date: '2026-08-20', time: '10:30' },
    ]);
  });

  it('w trybie confirm nie publikuje szkicu i przywraca wartość po anulowaniu', async () => {
    const wrapper = mountPicker({ confirm: true });
    await wrapper.get('[role="combobox"]').trigger('click');
    await wrapper.get('[data-date="2026-08-20"]').trigger('click');
    expect(wrapper.emitted('update:value')).toBeUndefined();

    await wrapper.get('button.peaui-form-date-time-picker__button--secondary').trigger('click');
    expect(wrapper.emitted('cancel')).toHaveLength(1);
    expect(wrapper.get('[role="combobox"]').element).toHaveValue('18.08.2026 09:30');

    await wrapper.get('[role="combobox"]').trigger('click');
    await wrapper.get('[data-date="2026-08-20"]').trigger('click');
    await wrapper.get('button.peaui-form-date-time-picker__button--primary').trigger('click');
    expect(wrapper.emitted('apply')?.at(-1)).toEqual([{ date: '2026-08-20', time: '09:30' }]);
  });

  it('zgłasza precyzyjny błąd częściowej wartości w wariancie split', async () => {
    const wrapper = mountPicker({ value: undefined, variant: 'split-input' });
    const date = wrapper.get('[data-testid="date-time-picker-date-input"]');
    expect(date.attributes('role')).toBe('combobox');
    await date.setValue('18.08.2026');
    await date.trigger('blur');
    expect(wrapper.emitted('invalid')).toBeUndefined();

    const time = wrapper.get('[data-testid="date-time-picker-time-input"]');
    expect(time.attributes('role')).toBe('combobox');
    await time.setValue('tekst');
    await time.trigger('blur');
    expect(wrapper.emitted('invalid')?.at(-1)).toEqual([
      { input: 'tekst', reason: 'time', section: 'time' },
    ]);
    expect(date.element).toHaveAttribute('aria-invalid', 'true');
  });

  it('tworzy unikalne relacje ARIA sekcji dla wielu instancji', async () => {
    const first = mountPicker();
    await first.get('[role="combobox"]').trigger('click');
    const firstHeadingIds = first
      .findAll('section[aria-labelledby]')
      .map((section) => section.attributes('aria-labelledby'));
    for (const headingId of firstHeadingIds) {
      expect(document.querySelectorAll(`#${headingId}`)).toHaveLength(1);
    }
    first.unmount();

    const second = mountPicker({ id: 'second-date-time', name: 'secondDateTime' });
    await second.get('[role="combobox"]').trigger('click');
    const secondHeadingIds = second
      .findAll('section[aria-labelledby]')
      .map((section) => section.attributes('aria-labelledby'));
    const headingIds = [...firstHeadingIds, ...secondHeadingIds];
    expect(headingIds).toEqual([
      'meeting-date-time-date-section-heading',
      'meeting-date-time-time-section-heading',
      'second-date-time-date-section-heading',
      'second-date-time-time-section-heading',
    ]);
    for (const headingId of secondHeadingIds) {
      expect(document.querySelectorAll(`#${headingId}`)).toHaveLength(1);
    }
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
