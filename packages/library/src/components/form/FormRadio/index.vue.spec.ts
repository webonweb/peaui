import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

import FormRadio from './index.vue';

describe('FormRadio (index.vue)', () => {
  it('renders radio input with BEM root, attrs and test ids', () => {
    const wrapper = mount(FormRadio, {
      props: {
        id: 'contact-email',
        name: 'contact-method',
        optionValue: 'email',
        value: 'email',
        dataTestId: 'form-radio',
      },
      slots: {
        default: 'E-mail',
      },
    });

    const input = wrapper.get('input');

    expect(wrapper.classes()).toContain('peaui-form-field-radio');
    expect(input.attributes('type')).toBe('radio');
    expect(input.attributes('id')).toBe('contact-email');
    expect(input.attributes('name')).toBe('contact-method');
    expect(input.attributes('value')).toBe('email');
    expect(input.attributes('data-testid')).toBe('form-radio-element');
    expect(wrapper.get('[data-testid="form-radio-label"]').text()).toContain('E-mail');
    expect((input.element as HTMLInputElement).checked).toBe(true);
  });

  it('falls back to name for accessible name only when no label slot or explicit aria attrs exist', () => {
    const wrapperWithoutLabel = mount(FormRadio, {
      props: {
        id: 'contact-email',
        name: 'contact-method',
        optionValue: 'email',
        value: undefined,
      },
    });

    expect(wrapperWithoutLabel.get('input').attributes('aria-label')).toBe('contact-method');
    expect(wrapperWithoutLabel.get('input').attributes('aria-labelledby')).toBeUndefined();

    const wrapperWithLabelledBy = mount(FormRadio, {
      props: {
        id: 'contact-email',
        name: 'contact-method',
        optionValue: 'email',
        value: undefined,
      },
      attrs: {
        'aria-labelledby': 'contact-method-label',
      },
    });

    expect(wrapperWithLabelledBy.get('input').attributes('aria-labelledby')).toBe(
      'contact-method-label',
    );
    expect(wrapperWithLabelledBy.get('input').attributes('aria-label')).toBeUndefined();

    const wrapperWithSlot = mount(FormRadio, {
      props: {
        id: 'contact-email',
        name: 'contact-method',
        optionValue: 'email',
        value: undefined,
      },
      slots: {
        default: 'E-mail',
      },
    });

    expect(wrapperWithSlot.get('input').attributes('aria-label')).toBeUndefined();
  });

  it('emits update:value with optionValue when radio is selected', async () => {
    const wrapper = mount(FormRadio, {
      props: {
        id: 'contact-email',
        name: 'contact-method',
        optionValue: 'email',
        value: 'phone',
      },
    });

    await wrapper.get('input').setValue(true);

    expect(wrapper.emitted('update:value')).toEqual([['email']]);
  });

  it('selects optionValue on Enter key press', async () => {
    const wrapper = mount(FormRadio, {
      props: {
        id: 'contact-email',
        name: 'contact-method',
        optionValue: 'email',
        value: 'phone',
      },
    });

    await wrapper.get('input').trigger('keydown', { key: 'Enter' });

    expect(wrapper.emitted('update:value')).toEqual([['email']]);
  });

  it('sets aria attrs for invalid and required states', () => {
    const wrapper = mount(FormRadio, {
      props: {
        id: 'contact-email',
        name: 'contact-method',
        optionValue: 'email',
        value: undefined,
        isValid: false,
        required: true,
      },
    });

    const input = wrapper.get('input');

    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('aria-required')).toBe('true');
  });

  it('keeps checked state when disabled and does not emit updates', async () => {
    const wrapper = mount(FormRadio, {
      props: {
        id: 'contact-email',
        name: 'contact-method',
        optionValue: 'email',
        value: 'email',
        disabled: true,
      },
    });

    const input = wrapper.get('input');

    expect(input.attributes()).toHaveProperty('disabled');
    expect((input.element as HTMLInputElement).checked).toBe(true);

    await input.trigger('change');
    await input.trigger('keydown', { key: 'Enter' });

    expect(wrapper.emitted('update:value')).toBeUndefined();
  });
});
