import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

import FormCheckbox from './index.vue';

describe('FormCheckbox (index.vue)', () => {
  it('renders checkbox input with expected attrs and test ids', () => {
    const wrapper = mount(FormCheckbox, {
      props: {
        id: 'agreement',
        name: 'agreement',
        value: true,
        dataTestId: 'form-checkbox',
      },
    });

    const input = wrapper.get('input');

    expect(input.attributes('type')).toBe('checkbox');
    expect(input.attributes('id')).toBe('agreement');
    expect(input.attributes('name')).toBe('agreement');
    expect(input.attributes('data-testid')).toBe('form-checkbox-element');
    expect((input.element as HTMLInputElement).checked).toBe(true);
  });

  it('falls back to name for accessible name only when no label slot or explicit aria attrs exist', () => {
    const wrapperWithoutLabel = mount(FormCheckbox, {
      props: {
        id: 'agreement',
        name: 'agreement',
        value: false,
      },
    });

    expect(wrapperWithoutLabel.get('input').attributes('aria-label')).toBe('agreement');
    expect(wrapperWithoutLabel.get('input').attributes('aria-labelledby')).toBeUndefined();

    const wrapperWithLabelledBy = mount(FormCheckbox, {
      props: {
        id: 'agreement',
        name: 'agreement',
        value: false,
      },
      attrs: {
        'aria-labelledby': 'agreement-label',
      },
    });

    expect(wrapperWithLabelledBy.get('input').attributes('aria-labelledby')).toBe(
      'agreement-label',
    );
    expect(wrapperWithLabelledBy.get('input').attributes('aria-label')).toBeUndefined();

    const wrapperWithSlot = mount(FormCheckbox, {
      props: {
        id: 'agreement',
        name: 'agreement',
        value: false,
      },
      slots: {
        default: 'Akceptuje',
      },
    });

    expect(wrapperWithSlot.get('input').attributes('aria-label')).toBeUndefined();
  });

  it('emits update:value when checkbox state changes', async () => {
    const wrapper = mount(FormCheckbox, {
      props: {
        id: 'agreement',
        name: 'agreement',
        value: false,
      },
    });

    await wrapper.get('input').setValue(true);

    expect(wrapper.emitted('update:value')).toEqual([[true]]);
  });

  it('toggles value on Enter keydown', async () => {
    const wrapper = mount(FormCheckbox, {
      props: {
        id: 'agreement',
        name: 'agreement',
        value: true,
      },
    });

    await wrapper.get('input').trigger('keydown', { key: 'Enter' });

    expect(wrapper.emitted('update:value')).toEqual([[false]]);
  });

  it('sets aria attrs for invalid and required states', () => {
    const wrapper = mount(FormCheckbox, {
      props: {
        id: 'agreement',
        name: 'agreement',
        value: false,
        isValid: false,
        required: true,
      },
    });

    const input = wrapper.get('input');

    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('aria-required')).toBe('true');
  });

  it('preserves checked state and sets disabled attr when disabled=true', () => {
    const wrapper = mount(FormCheckbox, {
      props: {
        id: 'agreement',
        name: 'agreement',
        value: true,
        disabled: true,
      },
    });

    const input = wrapper.get('input');

    expect(input.attributes()).toHaveProperty('disabled');
    expect((input.element as HTMLInputElement).checked).toBe(true);
  });

  it('applies medium label class when checkbox is checked', () => {
    const wrapper = mount(FormCheckbox, {
      props: {
        id: 'agreement',
        name: 'agreement',
        value: true,
      },
      slots: {
        default: 'Akceptuje',
      },
    });

    const label = wrapper.get('label');

    expect(label.classes()).toContain('peaui-form-field-checkbox__label--medium');
    expect(label.classes()).not.toContain('peaui-form-field-checkbox__label--normal');
  });

  it('applies normal label class when checkbox is unchecked', () => {
    const wrapper = mount(FormCheckbox, {
      props: {
        id: 'agreement',
        name: 'agreement',
        value: false,
      },
      slots: {
        default: 'Akceptuje',
      },
    });

    const label = wrapper.get('label');

    expect(label.classes()).toContain('peaui-form-field-checkbox__label--normal');
    expect(label.classes()).not.toContain('peaui-form-field-checkbox__label--medium');
  });
});
