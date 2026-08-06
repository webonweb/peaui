import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import Component, { type NavStepper } from './index.vue';

vi.mock('@/constants', () => ({ UIKIT_NAME: 'uikit' }));
vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
  configurable: true,
  value: vi.fn(),
});

const SvgIconStub = defineComponent({
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  setup(props, { attrs }) {
    return () => h('svg', { ...attrs, 'data-icon-name': props.name });
  },
});

const ButtonActionStub = defineComponent({
  name: 'ButtonAction',
  props: {
    ariaLabel: String,
    disabled: Boolean,
    dataTestId: String,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'button',
        {
          ...attrs,
          type: 'button',
          disabled: props.disabled,
          'aria-label': props.ariaLabel,
          'data-testid': props.dataTestId,
        },
        slots.default?.(),
      );
  },
});

function createOptions(): NavStepper[] {
  return [
    {
      key: 'schedule',
      label: '1. Harmonogram uzytkowania',
      status: 'complete',
    },
    {
      key: 'ventilation',
      label: '2. Przenoszenie przez wentylacje',
      status: 'during',
    },
    {
      key: 'permeation',
      label: '3. Przenoszenie przez przenikanie',
      status: 'default',
    },
    {
      key: 'summary',
      label: '4. Podsumowanie',
      status: 'disabled',
    },
  ];
}

function factory(props?: Partial<InstanceType<typeof Component>['$props']>) {
  return mount(Component, {
    attachTo: document.body,
    props: {
      options: createOptions(),
      ...props,
    } as never,
    global: {
      stubs: {
        SvgIcon: SvgIconStub,
        ButtonAction: ButtonActionStub,
      },
    },
  });
}

describe('NavigationStepper (index.vue)', () => {
  it('renders controls, navigation semantics and steps', () => {
    const wrapper = factory({ dataTestId: 'stepper' });

    expect(wrapper.get('[data-testid="stepper-control-prev"]').attributes('aria-label')).toBe(
      'Przewin do poprzednich krokow',
    );
    expect(wrapper.get('[data-testid="stepper-control-next"]').attributes('aria-label')).toBe(
      'Przewin do kolejnych krokow',
    );
    expect(wrapper.get('nav').attributes('aria-label')).toBe('Nawigacja kroków');
    expect(wrapper.findAll('ol > li')).toHaveLength(4);
  });

  it('renders progressFinish icon for complete steps', () => {
    const wrapper = factory();
    const icons = wrapper.findAll('[data-icon-name]');
    const iconNames = icons.map((icon) => icon.attributes('data-icon-name'));

    expect(iconNames).toContain('progressFinish');
    expect(iconNames.filter((name) => name === 'arrow')).toHaveLength(2);
  });

  it("emits 'on:select' only for interactive step statuses", async () => {
    const wrapper = factory({ dataTestId: 'stepper' });

    await wrapper.get('[data-testid="stepper-step-schedule"]').trigger('click');
    await wrapper.get('[data-testid="stepper-step-ventilation"]').trigger('click');
    await wrapper.get('[data-testid="stepper-step-permeation"]').trigger('click');

    expect(wrapper.emitted('on:select')).toEqual([
      [expect.objectContaining({ key: 'schedule' })],
      [expect.objectContaining({ key: 'ventilation' })],
    ]);
  });

  it('marks current step with aria-current and blocks non-interactive steps', () => {
    const wrapper = factory({ dataTestId: 'stepper' });

    expect(wrapper.get('[data-testid="stepper-step-ventilation"]').attributes('aria-current')).toBe(
      'step',
    );
    expect(
      wrapper.get('[data-testid="stepper-step-permeation"]').attributes('disabled'),
    ).toBeDefined();
    expect(wrapper.get('[data-testid="stepper-step-summary"]').attributes('aria-disabled')).toBe(
      'true',
    );
  });

  it('supports horizontal keyboard navigation between interactive steps', async () => {
    const wrapper = factory({ dataTestId: 'stepper' });
    const completeStep = wrapper.get('[data-testid="stepper-step-schedule"]');
    const currentStep = wrapper.get('[data-testid="stepper-step-ventilation"]');
    const completeStepElement = completeStep.element as HTMLButtonElement;
    const currentStepElement = currentStep.element as HTMLButtonElement;

    completeStepElement.focus();
    await completeStep.trigger('keydown', { key: 'ArrowRight' });

    expect((document.activeElement as HTMLElement | null)?.id).toBe(currentStepElement.id);

    await currentStep.trigger('keydown', { key: 'ArrowLeft' });
    expect((document.activeElement as HTMLElement | null)?.id).toBe(completeStepElement.id);
  });

  it('scrolls the viewport when control buttons are clicked', async () => {
    const wrapper = factory({ dataTestId: 'stepper' });
    const navElement = wrapper.get('nav').element as HTMLElement;
    const scrollBy = vi.fn();

    Object.defineProperty(navElement, 'scrollWidth', { configurable: true, value: 1200 });
    Object.defineProperty(navElement, 'clientWidth', { configurable: true, value: 400 });
    Object.defineProperty(navElement, 'scrollLeft', {
      configurable: true,
      value: 100,
      writable: true,
    });
    navElement.scrollBy = scrollBy;

    await wrapper.get('nav').trigger('scroll');
    await wrapper.get('[data-testid="stepper-control-next"]').trigger('click');

    expect(scrollBy).toHaveBeenCalledWith({
      left: 284,
      behavior: 'smooth',
    });
  });
});
