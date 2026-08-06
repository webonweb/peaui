import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

import FormContainer from './index.vue';

const SpinnerLoaderStub = {
  name: 'SpinnerLoader',
  template: '<div data-testid="spinner-loader" />',
};

const ButtonActionStub = {
  name: 'ButtonAction',
  inheritAttrs: false,
  props: {
    disabled: Boolean,
    type: String,
    ariaLabel: String,
    size: String,
  },
  emits: ['click', 'keyup'],
  template: `
    <button
      :disabled="disabled"
      :type="type"
      :aria-label="ariaLabel"
      :data-size="size"
      :data-testid="$attrs['data-testid']"
      @click="$emit('click', $event)"
      @keyup="$emit('keyup', $event)"
    >
      <slot />
    </button>
  `,
};

const mountComponent = (
  props: Partial<{
    label: string;
    submitButtonLabel?: string;
    cancelButtonLabel?: string;
    isLoading?: boolean;
    showActions?: boolean;
    dataTestId?: string;
    disabled?: boolean;
    actionsPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    showCancelButton?: boolean;
    sizeButton?: 'xxs' | 'xs' | 's' | 'm' | 'l';
    useAriaLabelledby?: boolean;
  }> = {},
  slots: Record<string, any> = {},
) =>
  mount(FormContainer, {
    props: {
      label: 'Formularz',
      ...props,
    },
    slots,
    global: {
      stubs: {
        SpinnerLoader: SpinnerLoaderStub,
        ButtonAction: ButtonActionStub,
      },
    },
  });

describe('FormContainer', () => {
  it('renderuje <form> z klasą bazową i domyślną pozycją akcji', () => {
    const wrapper = mountComponent();
    const form = wrapper.get('form');

    expect(form.classes()).toContain('peaui-form-container');
    expect(form.classes()).toContain('peaui-form-container--bottom-left');
  });

  it('ustawia data-testid na <form>', () => {
    const wrapper = mountComponent({ dataTestId: 'form' });
    expect(wrapper.get('form').attributes('data-testid')).toBe('form');
  });

  it('renderuje label gdy label jest podany', () => {
    const wrapper = mountComponent({ label: 'Edycja danych' });
    const label = wrapper.get('.peaui-form-container__label');

    expect(label.text()).toBe('Edycja danych');
    expect(label.attributes('id')).toBeTruthy();
    expect(wrapper.get('form').attributes('aria-labelledby')).toBe(label.attributes('id'));
  });

  it('renderuje label bez aria-labelledby gdy useAriaLabelledby=false', () => {
    const wrapper = mountComponent({
      label: 'Edycja danych',
      useAriaLabelledby: false,
    });
    const label = wrapper.get('.peaui-form-container__label');

    expect(label.text()).toBe('Edycja danych');
    expect(label.attributes('id')).toBeUndefined();
    expect(wrapper.get('form').attributes('aria-labelledby')).toBeUndefined();
  });

  it('nie renderuje label gdy label jest pusty', () => {
    const wrapper = mountComponent({ label: '' });
    expect(wrapper.find('.peaui-form-container__label').exists()).toBe(false);
    expect(wrapper.get('form').attributes('aria-labelledby')).toBeUndefined();
  });

  it('renderuje slot default wewnątrz formularza', () => {
    const wrapper = mountComponent({}, { default: '<div data-testid="content" />' });
    expect(wrapper.find('[data-testid="content"]').exists()).toBe(true);
  });

  it('pokazuje SpinnerLoader, ustawia aria-busy i przenosi inert poza loader gdy isLoading=true', () => {
    const wrapper = mountComponent({ isLoading: true });

    expect(wrapper.find('[data-testid="spinner-loader"]').exists()).toBe(true);
    expect(wrapper.get('form').attributes('aria-busy')).toBe('true');
    expect(wrapper.get('form').attributes()).not.toHaveProperty('inert');
    expect(wrapper.get('.peaui-form-container__body').attributes()).toHaveProperty('inert');
  });

  it('renderuje sekcję akcji gdy showActions=true', () => {
    const wrapper = mountComponent({ dataTestId: 'form' });
    expect(wrapper.find('.peaui-form-container__actions').exists()).toBe(true);
    expect(wrapper.get('.peaui-form-container__actions').attributes('data-testid')).toBe(
      'form-actions',
    );
  });

  it('nie renderuje sekcji akcji gdy showActions=false', () => {
    const wrapper = mountComponent({ showActions: false });
    expect(wrapper.find('.peaui-form-container__actions').exists()).toBe(false);
  });

  it('renderuje slot additional-before i additional-after', () => {
    const wrapper = mountComponent(
      { dataTestId: 'form' },
      {
        'additional-before': '<div data-testid="before" />',
        'additional-after': '<div data-testid="after" />',
      },
    );

    expect(wrapper.find('[data-testid="form-additional-before"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="form-additional-after"]').exists()).toBe(true);
  });

  it('emituje on:submit po natywnym submit formularza', async () => {
    const wrapper = mountComponent({ dataTestId: 'form' });

    await wrapper.get('form').trigger('submit');
    expect(wrapper.emitted('on:submit')).toBeTruthy();
  });

  it('nie emituje on:submit po keyup.enter na przycisku submit, bo obsluga jest na formularzu', async () => {
    const wrapper = mountComponent({ dataTestId: 'form' });
    const submit = wrapper.get('button[data-testid="form-actions-submit"]');

    await submit.trigger('keyup', { key: 'Enter' });
    expect(wrapper.emitted('on:submit')).toBeUndefined();
  });

  it('nie emituje on:submit gdy formularz jest disabled albo loading', async () => {
    const disabledWrapper = mountComponent({ disabled: true });
    await disabledWrapper.get('form').trigger('submit');
    expect(disabledWrapper.emitted('on:submit')).toBeUndefined();

    const loadingWrapper = mountComponent({ isLoading: true });
    await loadingWrapper.get('form').trigger('submit');
    expect(loadingWrapper.emitted('on:submit')).toBeUndefined();
  });

  it('renderuje wlasny label przycisku anulowania gdy cancelButtonLabel jest podany', async () => {
    const wrapper = mountComponent({ cancelButtonLabel: 'Wroc' });
    const cancel = wrapper.findAll('button').find((button) => button.text() === 'Wroc');

    expect(cancel).toBeTruthy();

    await cancel!.trigger('click');
    expect(wrapper.emitted('on:cancel')).toBeTruthy();
  });

  it('renderuje przycisk Anuluj domyślnie i emituje on:cancel', async () => {
    const wrapper = mountComponent();
    const cancel = wrapper.findAll('button').find((b) => b.text() === 'Anuluj');

    expect(cancel).toBeTruthy();

    await cancel!.trigger('click');
    expect(wrapper.emitted('on:cancel')).toBeTruthy();
  });

  it('nie renderuje przycisku Anuluj gdy showCancelButton=false', () => {
    const wrapper = mountComponent({ showCancelButton: false });
    expect(wrapper.findAll('button').some((b) => b.text() === 'Anuluj')).toBe(false);
  });

  it('ustawia disabled na submit gdy disabled=true', () => {
    const wrapper = mountComponent({ disabled: true });
    const submit = wrapper.get('button');

    expect(submit.attributes('disabled')).toBeDefined();
  });

  it('ustawia disabled na submit i cancel gdy isLoading=true', () => {
    const wrapper = mountComponent({ isLoading: true });
    const buttons = wrapper.findAll('button');

    buttons.forEach((btn) => {
      expect(btn.attributes('disabled')).toBeDefined();
    });
  });

  it('ustawia domyslny rozmiar przyciskow na xs', () => {
    const wrapper = mountComponent({ dataTestId: 'form' });
    const submit = wrapper.get('button[data-testid="form-actions-submit"]');
    const cancel = wrapper.get('button[data-testid="form-actions-cancel"]');

    expect(submit.attributes('data-size')).toBe('xs');
    expect(cancel.attributes('data-size')).toBe('xs');
  });

  it('przekazuje sizeButton do przyciskow akcji', () => {
    const wrapper = mountComponent({ dataTestId: 'form', sizeButton: 'm' });
    const submit = wrapper.get('button[data-testid="form-actions-submit"]');
    const cancel = wrapper.get('button[data-testid="form-actions-cancel"]');

    expect(submit.attributes('data-size')).toBe('m');
    expect(cancel.attributes('data-size')).toBe('m');
  });

  it('ustawia poprawny modyfikator klasy dla actionsPosition', () => {
    const wrapper = mountComponent({ actionsPosition: 'top-right' });
    expect(wrapper.get('form').classes()).toContain('peaui-form-container--top-right');
  });
});
