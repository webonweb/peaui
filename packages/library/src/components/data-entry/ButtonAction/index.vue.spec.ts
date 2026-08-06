import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import ButtonAction from './index.vue';

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

describe('ButtonAction (index.vue)', () => {
  it('renders default slot content', () => {
    const wrapper = mount(ButtonAction, {
      props: {
        ariaLabel: 'Przycisk akcji',
      },
      slots: {
        default: 'Zapisz',
      },
    });

    expect(wrapper.text()).toContain('Zapisz');
  });

  it('applies default props (size=m, variant=primary, type=button, disabled=false)', () => {
    const wrapper = mount(ButtonAction, {
      props: {
        ariaLabel: 'Default button',
      },
      slots: {
        default: 'Button',
      },
    });

    const btn = wrapper.get('button');

    expect(btn.attributes('type')).toBe('button');
    expect(btn.attributes('aria-label')).toBeUndefined();

    expect(btn.attributes('disabled')).toBeUndefined();
    expect(btn.attributes('aria-disabled')).toBeUndefined();

    expect(btn.classes()).toContain('peaui-button-action');
    expect(btn.classes()).toContain('peaui-button-action--size-m');
    expect(btn.classes()).toContain('peaui-button-action--variant-primary');
    expect(btn.classes()).not.toContain('peaui-button-action--is-disabled');
  });

  it('sets size and variant classes from props', () => {
    const wrapper = mount(ButtonAction, {
      props: {
        ariaLabel: 'Rozmiar i wariant',
        size: 'l',
        variant: 'danger',
      },
      slots: {
        default: 'Usuń',
      },
    });

    const btn = wrapper.get('button');
    expect(btn.classes()).toContain('peaui-button-action--size-l');
    expect(btn.classes()).toContain('peaui-button-action--variant-danger');
  });

  it('sets type attribute from props', () => {
    const wrapper = mount(ButtonAction, {
      props: {
        ariaLabel: 'Submit',
        type: 'submit',
      },
      slots: {
        default: 'Wyślij',
      },
    });

    expect(wrapper.get('button').attributes('type')).toBe('submit');
  });

  it('when disabled=true, sets disabled attribute and aria-disabled=true and disabled class', () => {
    const wrapper = mount(ButtonAction, {
      props: {
        ariaLabel: 'Disabled',
        disabled: true,
      },
      slots: {
        default: 'Nieaktywny',
      },
    });

    const btn = wrapper.get('button');

    expect(btn.attributes()).toHaveProperty('disabled');
    expect(btn.classes()).toContain('peaui-button-action--is-disabled');
  });

  it('sets data-testid from dataTestId prop', () => {
    const wrapper = mount(ButtonAction, {
      props: {
        ariaLabel: 'Test id',
        dataTestId: 'button-action-save',
      },
      slots: {
        default: 'Zapisz',
      },
    });

    expect(wrapper.get('button').attributes('data-testid')).toBe('button-action-save');
  });

  it('spreads arbitrary attrs to the button (useAttrs)', () => {
    const wrapper = mount(ButtonAction, {
      props: {
        ariaLabel: 'Attrs',
      },
      attrs: {
        id: 'my-btn',
        name: 'saveButton',
        title: 'Kliknij aby zapisać',
      },
      slots: {
        default: 'Zapisz',
      },
    });

    const btn = wrapper.get('button');
    expect(btn.attributes('id')).toBe('my-btn');
    expect(btn.attributes('name')).toBe('saveButton');
    expect(btn.attributes('title')).toBe('Kliknij aby zapisać');
  });

  it('does not set aria-label from ariaLabel prop when button has visible text', () => {
    const wrapper = mount(ButtonAction, {
      props: {
        ariaLabel: 'Etykieta a11y',
      },
      slots: {
        default: 'OK',
      },
    });

    expect(wrapper.get('button').attributes('aria-label')).toBeUndefined();
  });

  it('sets aria-label automatically when button has no visible text content', () => {
    const wrapper = mount(ButtonAction, {
      props: {
        ariaLabel: 'Etykieta a11y',
      },
      slots: {
        default: () => h('span', { 'aria-hidden': 'true', class: 'icon-only' }),
      },
    });

    expect(wrapper.get('button').attributes('aria-label')).toBe('Etykieta a11y');
  });

  it('falls back to a generic accessible name when icon-only button has no explicit label', () => {
    const wrapper = mount(ButtonAction, {
      slots: {
        default: () => h('span', { 'aria-hidden': 'true', class: 'icon-only' }),
      },
    });

    expect(wrapper.get('button').attributes('aria-label')).toBe('Przycisk akcji');
  });

  it('uses aria-label from attrs when icon-only button has no ariaLabel prop', () => {
    const wrapper = mount(ButtonAction, {
      attrs: {
        'aria-label': 'Filtruj wyniki',
      },
      slots: {
        default: () => h('span', { 'aria-hidden': 'true', class: 'icon-only' }),
      },
    });

    expect(wrapper.get('button').attributes('aria-label')).toBe('Filtruj wyniki');
  });

  it('preserves aria-labelledby from attrs without adding fallback aria-label', () => {
    const wrapper = mount(ButtonAction, {
      attrs: {
        'aria-labelledby': 'button-action-label',
      },
      slots: {
        default: () => h('span', { 'aria-hidden': 'true', class: 'icon-only' }),
      },
    });

    const button = wrapper.get('button');

    expect(button.attributes('aria-labelledby')).toBe('button-action-label');
    expect(button.attributes('aria-label')).toBeUndefined();
  });

  it('sets aria-label when useAriaLabel is enabled', () => {
    const wrapper = mount(ButtonAction, {
      props: {
        ariaLabel: 'Etykieta a11y',
        useAriaLabel: true,
      },
      slots: {
        default: 'OK',
      },
    });

    expect(wrapper.get('button').attributes('aria-label')).toBe('Etykieta a11y');
  });
});
