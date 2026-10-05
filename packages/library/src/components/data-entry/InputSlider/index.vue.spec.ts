import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

const ButtonActionStub = defineComponent({
  name: 'ButtonAction',
  props: {
    ariaLabel: { type: String, required: false },
    disabled: { type: Boolean, required: false },
    type: { type: String, required: false },
  },
  emits: ['click'],
  setup(props, { attrs, slots, emit }) {
    return () =>
      h(
        'button',
        {
          ...attrs,
          type: props.type ?? 'button',
          disabled: props.disabled,
          'aria-label': props.ariaLabel,
          onClick: (event: MouseEvent) => emit('click', event),
        },
        slots.default?.(),
      );
  },
});

import InputSlider from './index.vue';

const mountComponent = (props: Record<string, unknown> = {}) => {
  const wrapper = mount(InputSlider, {
    props: {
      name: 'intensity',
      value: 0.5,
      'onUpdate:value': async (value: number) => {
        await wrapper.setProps({ value });
      },
      ...props,
    },
    global: {
      stubs: {
        ButtonAction: ButtonActionStub,
      },
    },
  });

  return wrapper;
};

describe('InputSlider (index.vue)', () => {
  it('renders slider with related controls and data-testid suffixes', () => {
    const wrapper = mountComponent({
      dataTestId: 'input-slider',
      ariaLabel: 'Poziom powiekszenia',
    });

    const root = wrapper.get('[data-testid="input-slider"]');
    const slider = wrapper.get('input[type="range"]');

    expect(root.classes()).toContain('peaui-input-slider');
    expect(slider.attributes('name')).toBe('intensity');
    expect(slider.attributes('min')).toBe('0');
    expect(slider.attributes('max')).toBe('1');
    expect(slider.attributes('step')).toBe('0.1');
    expect(slider.attributes('aria-label')).toBe('Poziom powiekszenia');
    expect(slider.attributes('data-testid')).toBe('input-slider-slider');
    expect(wrapper.get('[data-testid="input-slider-button-decrement"]')).toBeTruthy();
    expect(wrapper.get('[data-testid="input-slider-button-increment"]')).toBeTruthy();
    expect(
      wrapper.get('[data-testid="input-slider-button-decrement"]').attributes('aria-label'),
    ).toBe('Zmniejsz wartość. Obecna: 0.5');
    expect(
      wrapper.get('[data-testid="input-slider-button-increment"]').attributes('aria-label'),
    ).toBe('Zwiększ wartość. Obecna: 0.5');
  });

  it('falls back to accessible name derived from name when ariaLabel is not provided', () => {
    const wrapper = mountComponent({
      dataTestId: 'input-slider',
    });

    const slider = wrapper.get('input[type="range"]');

    expect(slider.attributes('aria-label')).toBe('Suwak intensity');
  });

  it('emits incremented value after clicking increment button', async () => {
    const wrapper = mountComponent({ value: 0.5 });

    await wrapper.get('.peaui-input-slider__button--increment').trigger('click');

    expect(wrapper.emitted('update:value')?.[0]?.[0]).toBeCloseTo(0.6);
  });

  it('emits decremented value and floors at zero', async () => {
    const wrapper = mountComponent({ value: 0.1 });

    await wrapper.get('.peaui-input-slider__button--decrement').trigger('click');

    expect(wrapper.emitted('update:value')?.[0]).toEqual([0]);
  });

  it('caps increment at one', async () => {
    const wrapper = mountComponent({ value: 0.95 });

    await wrapper.get('.peaui-input-slider__button--increment').trigger('click');

    expect(wrapper.emitted('update:value')?.[0]).toEqual([1]);
  });

  it('emits numeric value from range input and disables controls when disabled=true', async () => {
    const wrapper = mountComponent({ disabled: true, dataTestId: 'input-slider' });
    const slider = wrapper.get('input[type="range"]');

    expect(slider.attributes()).toHaveProperty('disabled');
    expect(
      wrapper.get('[data-testid="input-slider-button-decrement"]').attributes(),
    ).toHaveProperty('disabled');
    expect(
      wrapper.get('[data-testid="input-slider-button-increment"]').attributes(),
    ).toHaveProperty('disabled');

    const enabledWrapper = mountComponent({ dataTestId: 'enabled-input-slider' });
    await enabledWrapper.get('input[type="range"]').setValue('0.4');

    expect(enabledWrapper.emitted('update:value')?.[0]).toEqual([0.4]);
  });
});
