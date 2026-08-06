import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

import FormButtonCheckbox from './index.vue';

describe('FormButtonCheckbox (index.vue)', () => {
  it('renders checkbox input with expected attrs, size class and test ids', () => {
    const wrapper = mount(FormButtonCheckbox, {
      props: {
        id: 'heating',
        name: 'heating',
        value: true,
        size: 's',
        dataTestId: 'form-button-checkbox',
      },
      slots: {
        default: 'Ogrzewanie',
      },
    });

    const root = wrapper.get('[data-testid="form-button-checkbox"]');
    const input = wrapper.get('input');

    expect(root.classes()).toContain('peaui-form-button-checkbox--size-s');
    expect(input.attributes('type')).toBe('checkbox');
    expect(input.attributes('id')).toBe('heating');
    expect(input.attributes('name')).toBe('heating');
    expect(input.attributes('data-testid')).toBe('form-button-checkbox-element');
    expect(wrapper.get('[data-testid="form-button-checkbox-label"]')).toBeTruthy();
    expect(wrapper.get('[data-testid="form-button-checkbox-marker"]')).toBeTruthy();
    expect(wrapper.get('[data-testid="form-button-checkbox-text"]').text()).toBe('Ogrzewanie');
    expect((input.element as HTMLInputElement).checked).toBe(true);
  });

  it('emits update:value when checkbox state changes', async () => {
    const wrapper = mount(FormButtonCheckbox, {
      props: {
        id: 'heating',
        name: 'heating',
        value: false,
      },
      slots: {
        default: 'Ogrzewanie',
      },
    });

    await wrapper.get('input').setValue(true);

    expect(wrapper.emitted('update:value')).toEqual([[true]]);
  });

  it('toggles value on Enter key press', async () => {
    const wrapper = mount(FormButtonCheckbox, {
      props: {
        id: 'heating',
        name: 'heating',
        value: true,
      },
      slots: {
        default: 'Ogrzewanie',
      },
    });

    await wrapper.get('input').trigger('keydown', { key: 'Enter' });

    expect(wrapper.emitted('update:value')).toEqual([[false]]);
  });

  it('sets aria attrs for invalid and required states and accepts ariaLabel fallback', () => {
    const wrapper = mount(FormButtonCheckbox, {
      props: {
        id: 'heating',
        name: 'heating',
        value: false,
        isValid: false,
        required: true,
        ariaLabel: 'Ogrzewanie',
      },
    });

    const input = wrapper.get('input');

    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('aria-required')).toBe('true');
    expect(input.attributes('aria-label')).toBe('Ogrzewanie');
  });

  it('falls back to name for accessible name only when no visible text or explicit aria attrs exist', () => {
    const wrapperWithoutLabel = mount(FormButtonCheckbox, {
      props: {
        id: 'heating',
        name: 'heating',
        value: false,
        dataTestId: 'form-button-checkbox',
      },
    });

    expect(wrapperWithoutLabel.get('input').attributes('aria-label')).toBe('heating');
    expect(wrapperWithoutLabel.get('input').attributes('aria-labelledby')).toBeUndefined();
    expect(wrapperWithoutLabel.get('[data-testid="form-button-checkbox-text"]').text()).toBe(
      'heating',
    );

    const wrapperWithLabelledBy = mount(FormButtonCheckbox, {
      props: {
        id: 'heating',
        name: 'heating',
        value: false,
        dataTestId: 'form-button-checkbox-external',
      },
      attrs: {
        'aria-labelledby': 'heating-label',
      },
    });

    expect(wrapperWithLabelledBy.get('input').attributes('aria-labelledby')).toBe('heating-label');
    expect(wrapperWithLabelledBy.get('input').attributes('aria-label')).toBeUndefined();
    expect(
      wrapperWithLabelledBy.find('[data-testid="form-button-checkbox-external-text"]').exists(),
    ).toBe(false);
  });

  it('applies checked classes to the button label and marker', () => {
    const wrapper = mount(FormButtonCheckbox, {
      props: {
        id: 'heating',
        name: 'heating',
        value: true,
        dataTestId: 'form-button-checkbox',
      },
      slots: {
        default: 'Ogrzewanie',
      },
    });

    expect(wrapper.get('label').classes()).toContain('peaui-form-button-checkbox__label--checked');
    expect(wrapper.get('[data-testid="form-button-checkbox-marker"]').classes()).toContain(
      'peaui-form-button-checkbox__marker--checked',
    );
    expect(wrapper.get('[data-testid="form-button-checkbox-text"]').classes()).toContain(
      'peaui-form-button-checkbox__text--checked',
    );
  });

  it('does not toggle on Enter when disabled', async () => {
    const wrapper = mount(FormButtonCheckbox, {
      props: {
        id: 'heating',
        name: 'heating',
        value: false,
        disabled: true,
      },
      slots: {
        default: 'Ogrzewanie',
      },
    });

    const input = wrapper.get('input');

    expect(input.attributes()).toHaveProperty('disabled');

    await input.trigger('keydown', { key: 'Enter' });

    expect(wrapper.emitted('update:value')).toBeUndefined();
  });
});
