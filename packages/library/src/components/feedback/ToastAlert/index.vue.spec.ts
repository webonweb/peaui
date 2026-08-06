import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ToastAlert from './index.vue';

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

vi.mock('@/assets/global.scss', () => ({}), { virtual: true });
vi.mock('./styles.scss', () => ({}), { virtual: true });

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue');
  return {
    ...actual,
    useId: () => 'unit',
  };
});

describe('ToastAlert (index.vue)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses default variant="info" and renders base + variant classes', () => {
    const wrapper = mount(ToastAlert);

    const root = wrapper.get('div');
    expect(root.classes()).toContain('peaui-toast-alert');
    expect(root.classes()).toContain('peaui-toast-alert--variant-info');
  });

  it('sets role/status and aria-live/polite for non-assertive variants (info/success)', () => {
    const wrapperInfo = mount(ToastAlert, { props: { variant: 'info' } });
    expect(wrapperInfo.get('div').attributes('role')).toBe('status');
    expect(wrapperInfo.get('div').attributes('aria-live')).toBe('polite');

    const wrapperSuccess = mount(ToastAlert, { props: { variant: 'success' } });
    expect(wrapperSuccess.get('div').attributes('role')).toBe('status');
    expect(wrapperSuccess.get('div').attributes('aria-live')).toBe('polite');
  });

  it('sets role/alert and aria-live/assertive for assertive variants (error/danger)', () => {
    const wrapperError = mount(ToastAlert, { props: { variant: 'error' } });
    expect(wrapperError.get('div').attributes('role')).toBe('alert');
    expect(wrapperError.get('div').attributes('aria-live')).toBe('assertive');

    const wrapperDanger = mount(ToastAlert, { props: { variant: 'danger' } });
    expect(wrapperDanger.get('div').attributes('role')).toBe('alert');
    expect(wrapperDanger.get('div').attributes('aria-live')).toBe('assertive');
  });

  it('always sets aria-atomic="true"', () => {
    const wrapper = mount(ToastAlert);
    expect(wrapper.get('div').attributes('aria-atomic')).toBe('true');
  });

  it('does not render close button by default', () => {
    const wrapper = mount(ToastAlert);

    expect(wrapper.find('button').exists()).toBe(false);
  });

  it('when title is provided: sets aria-labelledby and DOES NOT set aria-label', () => {
    const wrapper = mount(ToastAlert, {
      props: { title: 'Tytul' },
    });

    const root = wrapper.get('div');
    expect(root.attributes('aria-labelledby')).toBe('toast-unit-title');
    expect(root.attributes('aria-label')).toBeUndefined();

    const titleEl = wrapper.get('strong');
    expect(titleEl.text()).toBe('Tytul');
    expect(titleEl.attributes('id')).toBe('toast-unit-title');
  });

  it('applies default title size class "m" when title is rendered', () => {
    const wrapper = mount(ToastAlert, {
      props: { title: 'Tytul' },
    });

    expect(wrapper.get('strong').classes()).toContain('peaui-toast-alert__title--size-m');
  });

  it('applies title size class based on size prop', () => {
    const wrapper = mount(ToastAlert, {
      props: {
        title: 'Tytul',
        size: 's',
      },
    });

    const titleEl = wrapper.get('strong');
    expect(titleEl.classes()).toContain('peaui-toast-alert__title--size-s');
    expect(titleEl.classes()).not.toContain('peaui-toast-alert__title--size-m');
  });

  it('adds border modifier class when withBorder is true', () => {
    const wrapper = mount(ToastAlert, {
      props: {
        withBorder: true,
        variant: 'success',
      },
    });

    expect(wrapper.get('div').classes()).toContain('peaui-toast-alert--border');
  });

  it('when description is provided: sets aria-describedby', () => {
    const wrapper = mount(ToastAlert, {
      props: { description: 'Opis' },
    });

    const root = wrapper.get('div');
    expect(root.attributes('aria-describedby')).toBe('toast-unit-desc');

    const descEl = wrapper.get('p');
    expect(descEl.text()).toContain('Opis');
    expect(descEl.attributes('id')).toBe('toast-unit-desc');
    expect(descEl.classes()).toContain('peaui-toast-alert__description--size-m');
  });

  it('applies description size class based on size prop', () => {
    const wrapper = mount(ToastAlert, {
      props: {
        description: 'Opis',
        size: 's',
      },
    });

    const descEl = wrapper.get('p');
    expect(descEl.classes()).toContain('peaui-toast-alert__description--size-s');
    expect(descEl.classes()).not.toContain('peaui-toast-alert__description--size-m');
  });

  it('when BOTH title and description are provided: sets labelledby + describedby', () => {
    const wrapper = mount(ToastAlert, {
      props: { title: 'Tytul', description: 'Opis' },
    });

    const root = wrapper.get('div');
    expect(root.attributes('aria-labelledby')).toBe('toast-unit-title');
    expect(root.attributes('aria-describedby')).toBe('toast-unit-desc');
    expect(root.attributes('aria-label')).toBeUndefined();
  });

  it('when title is NOT provided: sets aria-label based on description fallback', () => {
    const wrapper = mount(ToastAlert, {
      props: { description: 'Opis tylko' },
    });

    const root = wrapper.get('div');
    expect(root.attributes('aria-label')).toBe('Opis tylko');
    expect(root.attributes('aria-labelledby')).toBeUndefined();
  });

  it('when neither title nor description is provided: uses aria-label fallback "Powiadomienie"', () => {
    const wrapper = mount(ToastAlert);
    expect(wrapper.get('div').attributes('aria-label')).toBe('Powiadomienie');
  });

  it('sets data-testid on root and generates *-icon/*-title/*-description ids', () => {
    const wrapper = mount(ToastAlert, {
      props: {
        dataTestId: 'toast',
        title: 'Tytul',
        description: 'Opis',
      },
    });

    const root = wrapper.get('div');
    expect(root.attributes('data-testid')).toBe('toast');

    const svg = wrapper.get('svg');
    expect(svg.attributes('data-testid')).toBe('toast-icon');

    const titleEl = wrapper.get('strong');
    expect(titleEl.attributes('data-testid')).toBe('toast-title');

    const descEl = wrapper.get('p');
    expect(descEl.attributes('data-testid')).toBe('toast-description');
  });

  it('renders close button with aria attributes and data test ids when canClose is true', () => {
    const wrapper = mount(ToastAlert, {
      props: {
        canClose: true,
        dataTestId: 'toast',
        title: 'Tytul',
      },
    });

    const root = wrapper.get('div');
    const button = wrapper.get('button');

    expect(root.attributes('id')).toBe('toast-unit-region');
    expect(button.attributes('type')).toBe('button');
    expect(button.attributes('data-testid')).toBe('toast-close-button');
    expect(button.attributes('aria-controls')).toBe('toast-unit-region');
    expect(button.attributes('aria-label')).toBe('Zamknij powiadomienie: Tytul');

    const closeIcon = wrapper.get('[data-testid="toast-close-button-icon"]');
    expect(closeIcon.attributes('aria-hidden')).toBe('true');
    expect(closeIcon.attributes('focusable')).toBe('false');
  });

  it('emits on:close after clicking close button', async () => {
    const wrapper = mount(ToastAlert, {
      props: {
        canClose: true,
      },
    });

    await wrapper.get('button').trigger('click');

    expect(wrapper.emitted('on:close')).toHaveLength(1);
  });

  it('does not emit on:close on keyup.enter from the native close button', async () => {
    const wrapper = mount(ToastAlert, {
      props: {
        canClose: true,
      },
    });

    await wrapper.get('button').trigger('keyup', { key: 'Enter' });

    expect(wrapper.emitted('on:close')).toBeUndefined();
  });

  it('svg is aria-hidden and not focusable', () => {
    const wrapper = mount(ToastAlert);
    const svg = wrapper.get('svg');
    expect(svg.attributes('aria-hidden')).toBe('true');
    expect(svg.attributes('focusable')).toBe('false');
  });

  it('renders the correct icon path variant (smoke tests)', () => {
    const info = mount(ToastAlert, { props: { variant: 'info' } });
    expect(info.findAll('path').length).toBeGreaterThan(0);

    const success = mount(ToastAlert, { props: { variant: 'success' } });
    expect(success.find('path[fill="#10893C"]').exists()).toBe(true);

    const error = mount(ToastAlert, { props: { variant: 'error' } });
    expect(error.find('path[fill="#10893C"]').exists()).toBe(false);
    expect(error.findAll('path').length).toBeGreaterThan(0);
  });

  it('applies correct variant class for each variant', () => {
    const variants: Array<'info' | 'error' | 'success' | 'danger'> = [
      'info',
      'error',
      'success',
      'danger',
    ];

    for (const v of variants) {
      const wrapper = mount(ToastAlert, { props: { variant: v } });
      const root = wrapper.get('div');
      expect(root.classes()).toContain(`peaui-toast-alert--variant-${v}`);
    }
  });
});
