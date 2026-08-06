import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';

import Component from './index.vue';

vi.mock('@/constants', () => ({ UIKIT_NAME: 'uikit' }));
vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

const ButtonActionStub = defineComponent({
  name: 'ButtonAction',
  props: {
    disabled: { type: Boolean, default: false },
    ariaControls: { type: String, default: '' },
    ariaLabel: { type: String, default: '' },
    size: { type: String, default: '' },
    dataTestid: { type: String, default: undefined },
    class: { type: [String, Object, Array], default: '' },
  },
  emits: ['click'],
  setup(props, { emit, slots, attrs }) {
    return () =>
      h(
        'button',
        {
          type: 'button',
          disabled: props.disabled,
          'aria-controls': props.ariaControls,
          'aria-label': props.ariaLabel,
          'data-testid': props.dataTestid,
          class: props.class,
          onClick: (e: Event) => emit('click', e),
          ...attrs,
        },
        slots.default?.(),
      );
  },
});

function factory(props?: Partial<InstanceType<typeof Component>['$props']>) {
  return mount(Component, {
    props: {
      label: 'Label',
      ...props,
    } as any,
    global: {
      stubs: {
        ButtonAction: ButtonActionStub,
      },
    },
  });
}

describe('Calculation result component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders label (v-html) and result when not loading', () => {
    const wrapper = factory({
      label: '<b>Result</b>',
      result: '123',
      isLoading: false,
    });

    const labelSpan = wrapper.get('label span');
    expect((labelSpan.element as HTMLElement).innerHTML).toBe('<b>Result</b>');

    const output = wrapper.get('output');
    expect(output.text()).toContain('123');
    expect(output.attributes('role')).toBe('status');
    expect(output.attributes('aria-live')).toBe('polite');
    expect(output.attributes('aria-atomic')).toBe('true');

    expect(wrapper.get('div').attributes('aria-busy')).toBe('false');
  });

  it('shows loading state when isLoading is true', () => {
    const wrapper = factory({
      result: '999',
      isLoading: true,
    });

    const root = wrapper.get('div');
    expect(root.attributes('aria-busy')).toBe('true');
    expect(root.attributes()).not.toHaveProperty('inert');

    const output = wrapper.get('output');
    expect(output.text()).toContain('Trwa obliczanie');
    expect(output.text()).not.toContain('999');
    expect(output.attributes('role')).toBe('status');
    expect(output.attributes('aria-live')).toBe('polite');
    expect(output.attributes('aria-atomic')).toBe('true');
  });

  it("shows placeholder '-/-' when result is not provided", () => {
    const wrapper = factory({ isLoading: false });
    expect(wrapper.get('output').text()).toContain('-/-');
  });

  it('sets data-testid attributes when dataTestId is provided', () => {
    const wrapper = factory({
      dataTestId: 'calc',
      result: '10',
      isLoading: false,
    });

    expect(wrapper.find('[data-testid="calc"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="calc-label"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="calc-output"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="calc-button"]').exists()).toBe(true);
  });

  it('does not set data-testid attributes when dataTestId is not provided', () => {
    const wrapper = factory({
      isLoading: false,
      result: '10',
    });

    expect(wrapper.attributes('data-testid')).toBeUndefined();
    expect(wrapper.get('label').attributes('data-testid')).toBeUndefined();
    expect(wrapper.get('output').attributes('data-testid')).toBeUndefined();

    const button = wrapper.get('button');
    expect(button.attributes('data-testid')).toBeUndefined();
  });

  it("emits 'on:simulate' event when the button is clicked", async () => {
    const wrapper = factory({
      isLoading: false,
      disabled: false,
    });

    await wrapper.get('button').trigger('click');

    expect(wrapper.emitted('on:simulate')).toBeTruthy();
    expect(wrapper.emitted('on:simulate')!.length).toBe(1);
  });

  it('disables the button when disabled prop is true', () => {
    const wrapper = factory({
      disabled: true,
      isLoading: false,
    });

    expect(wrapper.get('button').attributes()).toHaveProperty('disabled');
  });

  it('disables the button when isLoading is true', () => {
    const wrapper = factory({
      disabled: false,
      isLoading: true,
    });

    expect(wrapper.get('button').attributes()).toHaveProperty('disabled');
  });

  it('does not render the calculate button when showCalculateButton is false', () => {
    const wrapper = factory({
      showCalculateButton: false,
    });

    expect(wrapper.find('button').exists()).toBe(false);
  });

  it('connects the button with output using aria-controls', () => {
    const wrapper = factory({
      isLoading: false,
    });

    const outputId = wrapper.get('output').attributes('id');
    const ariaControls = wrapper.get('button').attributes('aria-controls');

    expect(outputId).toBeTruthy();
    expect(ariaControls).toBe(outputId);
  });

  it('renders simple variant with output in action area and hides the button', () => {
    const wrapper = factory({
      dataTestId: 'calc-simple',
      isSimple: true,
      result: '321',
      showCalculateButton: true,
    });

    expect(wrapper.classes()).toContain('uikit-calculation-results--simple');
    expect(wrapper.find('button').exists()).toBe(false);
    expect(wrapper.get('label').classes()).toContain(
      'uikit-calculation-results__content-label--simple',
    );

    const content = wrapper.get('.uikit-calculation-results__content');
    expect(content.find('output').exists()).toBe(false);

    const output = wrapper.get('output');
    expect(output.classes()).toContain('uikit-calculation-results__content-output--simple');
    expect(output.text()).toContain('321');
    expect(output.element.parentElement).toBe(wrapper.element);
  });

  it('renders content from the additional slot', () => {
    const wrapper = mount(Component, {
      props: { label: 'Label' },
      global: { stubs: { ButtonAction: ButtonActionStub } },
      slots: {
        additional: '<span data-testid="additional">+</span>',
      },
    });

    expect(wrapper.find('[data-testid="additional"]').exists()).toBe(true);
  });
});
