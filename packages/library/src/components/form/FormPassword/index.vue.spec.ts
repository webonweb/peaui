import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { copyToClipboardMock } = vi.hoisted(() => ({
  copyToClipboardMock: vi.fn(),
}));

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

vi.mock('@/helpers/functions.helper', () => ({
  copyToClipboard: copyToClipboardMock,
}));

const FormFieldStub = defineComponent({
  name: 'FormField',
  props: {
    id: { type: String, required: false },
    name: { type: String, required: false },
    placeholder: { type: String, required: false },
    value: { type: [String, Number, Array, Object], required: false },
  },
  setup(props, { slots }) {
    return () =>
      h('div', { 'data-testid': 'form-field-stub' }, [
        slots.hint?.(),
        slots.additional?.(),
        slots.default?.({
          props: {
            id: props.id,
            name: props.name,
            class: 'field-element',
            placeholder: props.placeholder,
            value: props.value,
            style: '--pl:12px; --pr:12px;',
          },
        }),
        slots.description?.(),
        slots.error?.(),
        slots.success?.(),
      ]);
  },
});

const SvgIconStub = defineComponent({
  name: 'SvgIcon',
  props: {
    name: { type: String, required: true },
  },
  template: '<svg :data-icon="name" aria-hidden="true" />',
});

import FormPassword from './index.vue';

const mountComponent = (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) =>
  mount(FormPassword, {
    props: {
      id: 'user-password',
      name: 'userPassword',
      value: 'TajneHaslo123!',
      placeholder: 'Wpisz haslo',
      ...props,
    },
    slots,
    global: {
      stubs: {
        FormField: FormFieldStub,
        SvgIcon: SvgIconStub,
      },
    },
  });

describe('FormPassword (index.vue)', () => {
  beforeEach(() => {
    copyToClipboardMock.mockReset();
  });

  it('does not render password strength meter by default', () => {
    const wrapper = mountComponent({
      dataTestId: 'form-password',
    });

    expect(wrapper.find('[data-testid="form-password-strength-meter"]').exists()).toBe(false);
  });

  it('renders password input with derived test ids and action buttons', () => {
    const wrapper = mountComponent({
      dataTestId: 'form-password',
    });

    const input = wrapper.get('[data-testid="form-password-element"]');
    const toggleButton = wrapper.get('[data-testid="form-password-toggle-button"]');
    const copyButton = wrapper.get('[data-testid="form-password-copy-button"]');

    expect(input.attributes('type')).toBe('password');
    expect(input.attributes('id')).toBe('user-password');
    expect(input.attributes('name')).toBe('userPassword');
    expect(input.attributes('placeholder')).toBe('Wpisz haslo');
    expect(input.classes()).toContain('field-element');
    expect(input.attributes('style')).toContain('--pr: 5.75rem;');
    expect(toggleButton.attributes('aria-controls')).toBe('user-password');
    expect(copyButton.attributes('aria-label')).toBe('Kopiuj haslo');
  });

  it('renders password strength meter and marks a compliant password as strong', () => {
    const wrapper = mountComponent({
      dataTestId: 'form-password',
      enablePasswordStrengthMeter: true,
      value: 'BezpieczneHaslo34!$',
    });

    const rootWrapper = wrapper.get('.peaui-form-field-password__wrapper');
    const input = wrapper.get('[data-testid="form-password-element"]').element as HTMLInputElement;
    const meter = wrapper.get('[data-testid="form-password-strength-meter"]');
    const label = wrapper.get('[data-testid="form-password-strength-label"]');
    const activeSegments = wrapper.findAll(
      '.peaui-form-field-password__strength-segment[data-active="true"]',
    );

    expect(rootWrapper.find('[data-testid="form-field-stub"]').exists()).toBe(true);
    expect(rootWrapper.find('[data-testid="form-password-strength-meter"]').exists()).toBe(true);
    expect(meter.attributes('data-tone')).toBe('success');
    expect(label.text()).toBe('Silne');
    expect(activeSegments).toHaveLength(4);
    expect(input.validationMessage).toBe('');
    expect(input.getAttribute('aria-describedby')).toContain('user-password-strength-status');
  });

  it('shows validation feedback for a weak password when strength meter is enabled', async () => {
    const wrapper = mountComponent({
      dataTestId: 'form-password',
      enablePasswordStrengthMeter: true,
      value: 'abc',
    });

    await flushPromises();

    const input = wrapper.get('[data-testid="form-password-element"]').element as HTMLInputElement;
    const label = wrapper.get('[data-testid="form-password-strength-label"]');
    const activeSegments = wrapper.findAll(
      '.peaui-form-field-password__strength-segment[data-active="true"]',
    );

    expect(label.text()).toBe('Slabe');
    expect(activeSegments).toHaveLength(2);
    expect(input.validationMessage).toContain('co najmniej 12 znakow');
  });

  it('emits update:value on input', async () => {
    const wrapper = mountComponent();

    await wrapper.get('input').setValue('NoweHaslo456!');

    expect(wrapper.emitted('update:value')).toEqual([['NoweHaslo456!']]);
  });

  it('toggles password visibility and updates accessibility state', async () => {
    const wrapper = mountComponent({
      dataTestId: 'form-password',
    });

    const input = wrapper.get('[data-testid="form-password-element"]');
    const toggleButton = wrapper.get('[data-testid="form-password-toggle-button"]');

    expect(toggleButton.attributes('aria-label')).toBe('Pokaz haslo');
    expect(toggleButton.attributes('aria-pressed')).toBe('false');

    await toggleButton.trigger('click');

    expect(input.attributes('type')).toBe('text');
    expect(toggleButton.attributes('aria-label')).toBe('Ukryj haslo');
    expect(toggleButton.attributes('aria-pressed')).toBe('true');
  });

  it('hides copy button when canCopy is false and reduces input padding to a single action', () => {
    const wrapper = mountComponent({
      canCopy: false,
      dataTestId: 'form-password',
    });

    const input = wrapper.get('[data-testid="form-password-element"]');

    expect(wrapper.get('[data-testid="form-password-toggle-button"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="form-password-copy-button"]').exists()).toBe(false);
    expect(input.attributes('style')).toContain('--pr: 2.875rem;');
  });

  it('hides toggle button when canVisible is false and keeps the password masked', async () => {
    const wrapper = mountComponent({
      canVisible: false,
      dataTestId: 'form-password',
    });

    const input = wrapper.get('[data-testid="form-password-element"]');

    expect(wrapper.find('[data-testid="form-password-toggle-button"]').exists()).toBe(false);
    expect(wrapper.get('[data-testid="form-password-copy-button"]').exists()).toBe(true);
    expect(input.attributes('type')).toBe('password');
    expect(input.attributes('style')).toContain('--pr: 2.875rem;');
  });

  it('copies current password value and announces success', async () => {
    copyToClipboardMock.mockResolvedValue(undefined);

    const wrapper = mountComponent({
      dataTestId: 'form-password',
    });

    await wrapper.get('[data-testid="form-password-copy-button"]').trigger('click');
    await flushPromises();

    expect(copyToClipboardMock).toHaveBeenCalledWith('TajneHaslo123!');
    expect(wrapper.get('[data-testid="form-password-copy-status"]').text()).toBe(
      'Haslo skopiowano do schowka.',
    );
  });

  it('announces copy error when clipboard write fails', async () => {
    copyToClipboardMock.mockRejectedValue(new Error('Clipboard unavailable'));

    const wrapper = mountComponent({
      dataTestId: 'form-password',
    });

    await wrapper.get('[data-testid="form-password-copy-button"]').trigger('click');
    await flushPromises();

    expect(wrapper.get('[data-testid="form-password-copy-status"]').text()).toBe(
      'Nie udalo sie skopiowac hasla.',
    );
  });

  it('disables action buttons when field is disabled', async () => {
    const wrapper = mountComponent({
      disabled: true,
      dataTestId: 'form-password',
    });

    const input = wrapper.get('[data-testid="form-password-element"]');
    const toggleButton = wrapper.get('[data-testid="form-password-toggle-button"]');
    const copyButton = wrapper.get('[data-testid="form-password-copy-button"]');

    expect(toggleButton.attributes('disabled')).toBeDefined();
    expect(copyButton.attributes('disabled')).toBeDefined();

    await toggleButton.trigger('click');

    expect(input.attributes('type')).toBe('password');
  });

  it('does not render the actions container when canCopy and canVisible are false', () => {
    const wrapper = mountComponent({
      canCopy: false,
      canVisible: false,
      dataTestId: 'form-password',
    });

    const input = wrapper.get('[data-testid="form-password-element"]');

    expect(wrapper.find(`.${'peaui-form-field-password'}__actions`).exists()).toBe(false);
    expect(wrapper.find('[data-testid="form-password-toggle-button"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="form-password-copy-button"]').exists()).toBe(false);
    expect(input.attributes('style')).not.toContain('2.875rem');
    expect(input.attributes('style')).not.toContain('5.75rem');
  });

  it('forwards hint, description, error and success slots', () => {
    const wrapper = mountComponent(
      {},
      {
        hint: 'Hint content',
        description: 'Description content',
        error: 'Error content',
        success: 'Success content',
      },
    );

    expect(wrapper.text()).toContain('Hint content');
    expect(wrapper.text()).toContain('Description content');
    expect(wrapper.text()).toContain('Error content');
    expect(wrapper.text()).toContain('Success content');
  });
});
