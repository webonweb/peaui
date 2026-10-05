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
            'aria-describedby': slots.error
              ? `${props.id}-error`
              : slots.description
                ? `${props.id}-description`
                : undefined,
            class: 'peaui-form-field__element',
            disabled: props.disabled,
            id: props.id,
            name: props.name,
            readonly: props.readonly,
            required: props.required,
          },
        }),
        props.value
          ? h(
              'button',
              {
                type: 'button',
                'aria-label': 'Wyczyść',
                onClick: () => emit('on:remove'),
              },
              '×',
            )
          : null,
        slots.description ? h('p', { id: `${props.id}-description` }, slots.description()) : null,
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

import FormColorPicker from './index.vue';

afterEach(() => {
  document.body.replaceChildren();
  Reflect.deleteProperty(window, 'EyeDropper');
  Object.defineProperty(window, 'isSecureContext', { configurable: true, value: false });
  vi.restoreAllMocks();
});

function mountPicker(props: Record<string, unknown> = {}) {
  const wrapper = mount(FormColorPicker, {
    attachTo: document.body,
    props: {
      id: 'brand-color',
      name: 'brandColor',
      label: 'Kolor marki',
      dataTestId: 'color-picker',
      value: '#33669980',
      alpha: true,
      'onUpdate:value': async (nextValue: string) => wrapper.setProps({ value: nextValue }),
      'onUpdate:open': async (nextOpen: boolean) => wrapper.setProps({ open: nextOpen }),
      ...props,
    },
    global: { stubs: { FormField: FormFieldStub, PopoverOverlayer: PopoverStub } },
  });
  return wrapper;
}

describe('FormColorPicker Vue', () => {
  it('używa systemowej strzałki selecta jako osobnej ikony SVG', async () => {
    const wrapper = mountPicker();
    const toggle = wrapper.get('.peaui-form-color-picker__toggle');

    await vi.waitFor(() => {
      expect(toggle.find('svg.peaui-form-color-picker__toggle-icon').exists()).toBe(true);
    });
    expect(toggle.text()).toBe('');
  });

  it('renderuje nazwane pole i kompletny dialog ARIA', async () => {
    const wrapper = mountPicker({
      description: 'Wartość koloru z kanałem alpha.',
      'aria-describedby': 'external-color-help',
    });
    const input = wrapper.get('[role="combobox"]');
    expect(input.element).toHaveAccessibleName('Kolor marki');
    expect(input.element).toHaveAttribute('aria-controls', 'brand-color-panel');
    expect(input.element).toHaveAttribute('aria-expanded', 'false');
    expect(input.element).toHaveAttribute(
      'aria-describedby',
      'external-color-help brand-color-description',
    );

    await input.trigger('keydown', { key: 'ArrowDown' });
    const dialog = wrapper.get('[role="dialog"]');
    expect(dialog.element).toHaveAccessibleName('Wybierz kolor');
    expect(dialog.get('[role="slider"]').element).toHaveAccessibleName(
      'Nasycenie i jasność koloru',
    );
    expect(dialog.get('input[aria-label="Odcień"]').element).toHaveAttribute('type', 'range');
    expect(dialog.get('input[aria-label="Krycie"]').element).toHaveAttribute('type', 'range');
  });

  it('parsuje ręczny RGB do kontrolowanego formatu bez dryfu', async () => {
    const wrapper = mountPicker({ format: 'hex' });
    const input = wrapper.get('[role="combobox"]');
    await input.setValue('rgba(255, 0, 0, 0.5)');
    await input.trigger('blur');
    expect(wrapper.emitted('update:value')?.at(-1)).toEqual(['#FF000080']);
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['#FF000080']);
    expect(wrapper.emitted('commit')?.at(-1)).toEqual(['#FF000080']);
  });

  it('pozostawia niepoprawny tekst edytowalny i zgłasza format', async () => {
    const wrapper = mountPicker();
    const input = wrapper.get('[role="combobox"]');
    await input.setValue('niebieskawy');
    await input.trigger('blur');
    expect(input.element).toHaveValue('niebieskawy');
    expect(input.element).toHaveAttribute('aria-invalid', 'true');
    expect(wrapper.emitted('invalid')?.at(-1)).toEqual([
      { input: 'niebieskawy', reason: 'format' },
    ]);
  });

  it('obsługuje obszar 2D klawiaturą i publikuje pojedynczy commit', async () => {
    const wrapper = mountPicker();
    await wrapper.get('[role="combobox"]').trigger('click');
    const saturation = wrapper.get('[role="slider"]');
    const before = Number(saturation.attributes('aria-valuenow'));
    await saturation.trigger('keydown', { key: 'ArrowRight', shiftKey: true });
    expect(Number(saturation.attributes('aria-valuenow'))).toBeGreaterThan(before);
    expect(wrapper.emitted('change')).toHaveLength(1);
    expect(wrapper.emitted('commit')).toHaveLength(1);
  });

  it('rozdziela zmianę suwaka od końcowego zatwierdzenia', async () => {
    const wrapper = mountPicker();
    await wrapper.get('[role="combobox"]').trigger('click');
    const hue = wrapper.get('input[aria-label="Odcień"]');
    await hue.setValue('210');
    expect(wrapper.emitted('change')?.length).toBeGreaterThan(0);
    const commitsBefore = wrapper.emitted('commit')?.length ?? 0;
    await hue.trigger('change');
    expect(wrapper.emitted('commit')).toHaveLength(commitsBefore + 1);
  });

  it('zwalnia aktywny pointer capture podczas odmontowania', async () => {
    const wrapper = mountPicker({ variant: 'inline' });
    const saturation = wrapper.get('[role="slider"]');
    const setPointerCapture = vi.fn();
    const releasePointerCapture = vi.fn();
    Object.assign(saturation.element, {
      getBoundingClientRect: () => ({
        bottom: 100,
        height: 100,
        left: 0,
        right: 100,
        top: 0,
        width: 100,
      }),
      hasPointerCapture: () => true,
      releasePointerCapture,
      setPointerCapture,
    });
    const event = new Event('pointerdown', { bubbles: true, cancelable: true });
    Object.defineProperties(event, {
      clientX: { value: 25 },
      clientY: { value: 25 },
      pointerId: { value: 7 },
    });
    saturation.element.dispatchEvent(event);
    await nextTick();
    expect(setPointerCapture).toHaveBeenCalledWith(7);
    wrapper.unmount();
    expect(releasePointerCapture).toHaveBeenCalledWith(7);
  });

  it('wybiera nazwaną próbkę i ignoruje błędne wpisy palety', async () => {
    const wrapper = mountPicker({
      savedColors: ['błąd', { label: 'Czerwień alarmowa', value: '#FF0000' }],
    });
    await wrapper.get('[role="combobox"]').trigger('click');
    const swatches = wrapper.findAll('.peaui-form-color-picker__swatch');
    expect(swatches).toHaveLength(1);
    expect(swatches[0]!.element).toHaveAccessibleName('Czerwień alarmowa');
    await swatches[0]!.trigger('click');
    expect(wrapper.emitted('commit')?.at(-1)).toEqual(['#FF0000FF']);
  });

  it('wariant inline używa nazwanej grupy bez semantyki combobox', () => {
    const wrapper = mountPicker({ variant: 'inline' });
    expect(wrapper.find('[role="combobox"]').exists()).toBe(false);
    expect(wrapper.get('[role="group"]').element).toHaveAccessibleName('Wybierz kolor');
  });

  it('pokazuje bezpieczny fallback, gdy EyeDropper jest niedostępny', async () => {
    const wrapper = mountPicker({ showEyedropper: true });
    await wrapper.get('[role="combobox"]').trigger('click');
    const button = wrapper.get('.peaui-form-color-picker__eyedropper');
    expect(button.element).toBeDisabled();
    expect(wrapper.text()).toContain('EyeDropper jest niedostępny');
    expect(wrapper.emitted('eyedropperError')).toBeUndefined();
  });

  it('obsługuje EyeDropper jako progressive enhancement', async () => {
    const open = vi.fn().mockResolvedValue({ sRGBHex: '#00FF00' });
    Object.defineProperty(window, 'isSecureContext', { configurable: true, value: true });
    Object.defineProperty(window, 'EyeDropper', {
      configurable: true,
      value: class EyeDropperMock {
        open = open;
      },
    });
    const wrapper = mountPicker({ showEyedropper: true });
    await wrapper.get('[role="combobox"]').trigger('click');
    await wrapper.get('.peaui-form-color-picker__eyedropper').trigger('click');
    await nextTick();
    await vi.waitFor(() => expect(wrapper.emitted('commit')?.at(-1)).toEqual(['#00FF00FF']));
    expect(wrapper.emitted('eyedropperStart')).toHaveLength(1);
    expect(wrapper.emitted('eyedropperError')).toBeUndefined();
  });

  it.each(['disabled', 'readonly', 'loading'] as const)(
    'blokuje zmianę i panel w stanie %s',
    async (state) => {
      const wrapper = mountPicker({ [state]: true });
      const input = wrapper.get('input');
      await input.trigger('click');
      await input.trigger('keydown', { key: 'ArrowDown' });
      expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
      if (state === 'readonly') expect(input.element).toHaveAttribute('aria-readonly', 'true');
      else expect(input.element).toBeDisabled();
      if (state === 'loading') expect(wrapper.find('[role="status"]').exists()).toBe(true);
    },
  );
});
