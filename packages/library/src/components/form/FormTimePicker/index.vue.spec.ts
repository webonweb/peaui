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
            'aria-label': props.label ? undefined : props.name,
            'aria-labelledby': props.label ? `label-${props.id}` : undefined,
            class: 'peaui-form-field__element',
            disabled: props.disabled,
            id: props.id,
            name: props.name,
            placeholder: props.placeholder,
            readonly: props.readonly,
            required: props.required,
            style: '--pr:44px',
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
    expose({ hidePopover, refreshPopoverPosition: vi.fn(), showPopover });
    return () =>
      h('div', { 'data-testid': props.dataTestId }, [
        slots.default?.(),
        visible.value ? h('div', { 'data-popover-content': '' }, slots.content?.()) : null,
      ]);
  },
});

const SvgIconStub = defineComponent({
  name: 'SvgIcon',
  setup: () => () => h('svg', { 'aria-hidden': 'true' }),
});

import FormTimePicker from './index.vue';

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

function mountPicker(props: Record<string, unknown> = {}, attrs: Record<string, unknown> = {}) {
  const wrapper = mount(FormTimePicker, {
    attachTo: document.body,
    props: {
      id: 'meeting-time',
      name: 'meetingTime',
      value: '09:30',
      label: 'Godzina spotkania',
      dataTestId: 'time-picker',
      'onUpdate:value': async (nextValue: string | undefined) => {
        await wrapper.setProps({ value: nextValue });
      },
      'onUpdate:open': async (nextOpen: boolean) => {
        await wrapper.setProps({ open: nextOpen });
      },
      ...props,
    },
    attrs,
    global: {
      stubs: {
        FormField: FormFieldStub,
        PopoverOverlayer: PopoverStub,
        SvgIcon: SvgIconStub,
      },
    },
  });
  return wrapper;
}

describe('FormTimePicker Vue', () => {
  it('renderuje edytowalny combobox z kompletnymi relacjami ARIA', () => {
    const wrapper = mountPicker({ description: 'Czas lokalny' });
    const input = wrapper.get('input[type="text"]');

    expect(input.attributes('role')).toBe('combobox');
    expect(input.attributes('aria-haspopup')).toBe('dialog');
    expect(input.attributes('aria-controls')).toBe('meeting-time-time-panel');
    expect(input.attributes('aria-expanded')).toBe('false');
    expect(input.attributes('aria-labelledby')).toBe('label-meeting-time');
    expect(input.attributes('placeholder')).toBe('gg:mm');
    expect(input.element).toHaveValue('09:30');
  });

  it('parsuje ręczny czas 24h i emituje neutralny model bez cichej korekty', async () => {
    const wrapper = mountPicker({ minuteStep: 5 });
    const input = wrapper.get('input[type="text"]');
    await input.setValue('14:45');
    await input.trigger('change');

    expect(wrapper.emitted('update:value')?.at(-1)).toEqual(['14:45']);
    expect(wrapper.emitted('change')?.at(-1)).toEqual([
      '14:45',
      { hour: 14, minute: 45, second: 0 },
    ]);
    expect(wrapper.emitted('invalid')).toBeUndefined();
  });

  it('obsługuje format 12h i sekundy, zachowując model 24h', async () => {
    const wrapper = mountPicker({
      format: '12h',
      showSeconds: true,
      secondStep: 1,
      value: '13:05:09',
    });
    const input = wrapper.get('input[type="text"]');
    expect((input.element as HTMLInputElement).value).toMatch(/^01:05:09\s/);

    await input.setValue('11:10:07 PM');
    await input.trigger('change');
    expect(wrapper.emitted('update:value')?.at(-1)).toEqual(['23:10:07']);
  });

  it.each([
    ['tekst', 'format'],
    ['07:30', 'range'],
    ['09:32', 'step'],
  ] as const)('odrzuca %s z powodem %s i nie zmienia modelu', async (inputValue, reason) => {
    const wrapper = mountPicker({ min: '08:00', max: '18:00', minuteStep: 5 });
    const input = wrapper.get('input[type="text"]');
    await input.setValue(inputValue);
    await input.trigger('change');

    expect(wrapper.emitted('invalid')?.at(-1)).toEqual([{ input: inputValue, reason }]);
    expect(wrapper.emitted('update:value')).toBeUndefined();
    expect(input.attributes('aria-invalid')).toBe('true');
  });

  it('otwiera panel klawiaturą, wybiera opcję i przywraca focus po Escape', async () => {
    const wrapper = mountPicker();
    const input = wrapper.get('input[type="text"]');
    (input.element as HTMLInputElement).focus();
    await input.trigger('keydown', { key: 'ArrowDown' });
    await nextTick();

    expect(input.attributes('aria-expanded')).toBe('true');
    expect(wrapper.get('[role="dialog"]').attributes('aria-labelledby')).toBe(
      'meeting-time-time-panel-label',
    );
    expect(wrapper.get('#meeting-time-time-panel-label').text()).toBe(
      'Wybór czasu: Godzina spotkania',
    );
    const selectedHour = wrapper.get('[data-time-option-segment="hour"][aria-selected="true"]');
    expect(selectedHour.element).toHaveFocus();

    await wrapper
      .get('[data-time-option-segment="minute"][data-time-option-value="35"]')
      .trigger('click');
    expect(wrapper.emitted('update:value')?.at(-1)).toEqual(['09:35']);

    await wrapper.get('[role="dialog"]').trigger('keydown', { key: 'Escape' });
    await nextTick();
    expect(input.element).toHaveFocus();
    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('udostępnia listboxy, wyłącza wartości poza zakresem i opcje zachowują target 44px przez klasę', async () => {
    const wrapper = mountPicker({ min: '09:30', max: '10:30', value: '09:30' });
    await wrapper.get('input').trigger('click');
    await nextTick();

    const lists = wrapper.findAll('[role="listbox"]');
    expect(lists).toHaveLength(2);
    expect(
      wrapper.get('[data-time-option-segment="minute"][data-time-option-value="25"]').element,
    ).toBeDisabled();
    expect(
      wrapper.get('[data-time-option-segment="minute"][data-time-option-value="30"]').element,
    ).toBeEnabled();
    expect(wrapper.get('[role="option"]').classes()).toContain('peaui-form-time-picker__option');
  });

  it('wariant segmented udostępnia spinbuttony oraz obsługuje strzałki, cyfry i zmianę segmentu', async () => {
    const wrapper = mountPicker({ variant: 'segmented', value: '09:30' });
    const spinbuttons = wrapper.findAll('[data-testid="time-picker-element"] [role="spinbutton"]');
    expect(spinbuttons).toHaveLength(2);
    expect(spinbuttons[0]?.attributes('aria-controls')).toBeUndefined();
    expect(wrapper.get('[data-peaui-popover-trigger]').attributes('aria-controls')).toBeTruthy();
    expect(spinbuttons[0]?.attributes('aria-valuenow')).toBe('9');
    expect(spinbuttons[1]?.attributes('aria-valuenow')).toBe('30');

    await spinbuttons[1]!.trigger('keydown', { key: 'ArrowUp' });
    expect(wrapper.emitted('update:value')?.at(-1)).toEqual(['09:35']);
    await spinbuttons[0]!.trigger('keydown', { key: '1' });
    expect(wrapper.emitted('update:value')?.at(-1)).toEqual(['01:35']);

    const updatedSpinbuttons = wrapper.findAll(
      '[data-testid="time-picker-element"] [role="spinbutton"]',
    );
    (updatedSpinbuttons[0]!.element as HTMLInputElement).focus();
    await updatedSpinbuttons[0]!.trigger('keydown', { key: 'ArrowRight' });
    expect(updatedSpinbuttons[1]!.element).toHaveFocus();
  });

  it.each(['disabled', 'readonly', 'loading'] as const)(
    'blokuje otwarcie i zmianę w stanie %s',
    async (state) => {
      const wrapper = mountPicker({ [state]: true });
      const trigger = wrapper.find('input').exists()
        ? wrapper.get('input')
        : wrapper.get('[role="spinbutton"]');
      await trigger.trigger('click');
      await trigger.trigger('keydown', { key: 'ArrowDown' });

      expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
      expect(wrapper.emitted('update:value')).toBeUndefined();
      if (state === 'loading') expect(wrapper.get('[role="status"]').text()).toContain('Ładowanie');
    },
  );

  it('usuwa wartość, wspiera required i wiąże błąd z polem', async () => {
    const wrapper = mountPicker({ required: true });
    await wrapper.get('[data-testid="time-picker-erase-button"]').trigger('click');
    expect(wrapper.emitted('update:value')?.at(-1)).toEqual([undefined]);
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true');
    expect(wrapper.get('#meeting-time-error').text()).toContain('Wybierz czas');
  });
});
