import '@testing-library/jest-dom/vitest';

import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

import FormRatingInput from './index.vue';
import type { RatingValue } from './rating-input.shared';

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

function mountRating(props: Record<string, unknown> = {}) {
  let wrapper: ReturnType<typeof mount>;
  wrapper = mount(FormRatingInput, {
    attachTo: document.body,
    props: {
      id: 'quality-rating',
      name: 'quality',
      label: 'Ocena jakości',
      dataTestId: 'rating',
      value: null,
      'onUpdate:value': async (nextValue: RatingValue) => {
        await wrapper.setProps({ value: nextValue });
      },
      ...props,
    },
    global: {
      stubs: {
        SvgIcon: { props: ['name'], template: '<svg data-stub-icon aria-hidden="true" />' },
      },
    },
  });
  return wrapper;
}

describe('FormRatingInput Vue', () => {
  it('renderuje jeden nazwany suwak i kompletny opis ARIA', () => {
    const wrapper = mountRating({
      description: 'Wybierz ocenę.',
      error: 'Ocena jest wymagana.',
      labels: { '3.5': 'Bardzo dobra' },
      step: 0.5,
      value: 3.5,
    });
    const input = wrapper.get('input[type="range"]');
    expect(input.element).toHaveAccessibleName('Ocena jakości');
    expect(input.element).toHaveAttribute('aria-valuetext', '3,5 z 5 — Bardzo dobra');
    expect(input.element).toHaveAttribute('aria-invalid', 'true');
    expect(input.element.getAttribute('aria-describedby')).toContain('quality-rating-default');
    expect(input.element.getAttribute('aria-describedby')).toContain('quality-rating-error');
    expect(wrapper.findAll('.peaui-form-rating-input__item')).toHaveLength(5);
    expect(wrapper.get('input[type="hidden"]').element).toHaveValue('3.5');
    expect(wrapper.get('.peaui-form-rating-input__value-label').element).toHaveAttribute(
      'title',
      '3,5 z 5 — Bardzo dobra',
    );
  });

  it('oddziela hover preview od zatwierdzonego modelu', async () => {
    const wrapper = mountRating({ step: 0.5, value: 2 });
    const item = wrapper.findAll('.peaui-form-rating-input__item')[2]!;
    vi.spyOn(item.element, 'getBoundingClientRect').mockReturnValue({
      bottom: 44,
      height: 44,
      left: 0,
      right: 44,
      top: 0,
      width: 44,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    item.element.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX: 10 }));
    await wrapper.vm.$nextTick();
    expect(wrapper.attributes('data-preview-value')).toBe('2.5');
    expect(wrapper.props('value')).toBe(2);
    expect(wrapper.emitted('previewChange')?.at(-1)).toEqual([2.5]);
    await wrapper.get('.peaui-form-rating-input__control').trigger('pointerleave');
    expect(wrapper.emitted('previewChange')?.at(-1)).toEqual([null]);
  });

  it('zatwierdza kliknięcie połówki i czyści powtórny wybór tylko z allowClear', async () => {
    const wrapper = mountRating({ allowClear: true, step: 0.5, value: 2 });
    const item = wrapper.findAll('.peaui-form-rating-input__item')[2]!;
    vi.spyOn(item.element, 'getBoundingClientRect').mockReturnValue({
      bottom: 44,
      height: 44,
      left: 0,
      right: 44,
      top: 0,
      width: 44,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    item.element.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, clientX: 10 }));
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toBe(2.5);
    item.element.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, clientX: 10 }));
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('clear')).toHaveLength(1);
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toBeNull();
  });

  it('obsługuje precyzyjnie klawiaturę, granice i clear', async () => {
    const wrapper = mountRating({ allowClear: true, step: 0.5, value: 2.5 });
    const input = wrapper.get('input[type="range"]');
    await input.trigger('keydown', { key: 'ArrowRight' });
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toBe(3);
    await input.trigger('keydown', { key: 'Home' });
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toBe(0.5);
    await input.trigger('keydown', { key: 'End' });
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toBe(5);
    await input.trigger('keydown', { key: 'Delete' });
    expect(wrapper.emitted('clear')).toHaveLength(1);
    expect(wrapper.props('value')).toBeNull();
  });

  it('readonly jest nietabowalnym odczytem, a disabled wyłącza suwak', () => {
    const readonly = mountRating({ readonly: true, value: 4 });
    expect(readonly.find('input[type="range"]').exists()).toBe(false);
    expect(readonly.get('meter').attributes('tabindex')).toBeUndefined();
    expect(readonly.get('meter').attributes('aria-valuetext')).toBe('4 z 5');
    readonly.unmount();

    const disabled = mountRating({ disabled: true, value: 4 });
    expect(disabled.get('input[type="range"]').element).toBeDisabled();
    expect(disabled.find('input[type="hidden"]').exists()).toBe(false);
  });

  it('renderuje własną ikonę i widoczny opis wartości ze slotów', () => {
    const wrapper = mount(FormRatingInput, {
      attachTo: document.body,
      props: { id: 'custom-rating', max: 3, value: 2 },
      slots: {
        icon: '<span class="custom-icon">◆</span>',
        label: 'Własna etykieta',
        'value-label': '<span class="custom-value">Dwa punkty</span>',
      },
    });
    expect(wrapper.findAll('.custom-icon')).toHaveLength(6);
    expect(wrapper.get('.custom-value').element).toHaveTextContent('Dwa punkty');
    expect(wrapper.get('input').element).toHaveAccessibleName('Własna etykieta');
  });
});
