import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import type { YearPickerValue } from './index.vue';

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));
vi.mock('./picker-button.scss', () => ({}));
vi.mock('./picker-navigation.scss', () => ({}));
vi.mock('@/helpers/functions.helper', () => ({
  getPaddingRight: () => 44,
}));

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

const FormFieldStub = defineComponent({
  name: 'FormField',
  props: {
    id: { type: String, required: false },
    label: { type: String, required: false },
    name: { type: String, required: false },
    placeholder: { type: String, required: false },
    value: { type: [String, Number, Array, Object], required: false },
  },
  emits: ['on:remove'],
  setup(props, { slots, emit }) {
    return () =>
      h('div', { 'data-testid': 'form-field-stub' }, [
        slots.hint?.(),
        slots.default?.({
          props: {
            'aria-label': props.label ? undefined : props.name,
            id: props.id,
            name: props.name,
            class: 'field-element',
            placeholder: props.placeholder,
            value: props.value,
            style: '--pr:32px;',
          },
        }),
        h(
          'button',
          {
            type: 'button',
            'data-testid': 'remove-button',
            onClick: () => emit('on:remove'),
          },
          'remove',
        ),
        slots.description?.(),
        slots.error?.(),
        slots.success?.(),
      ]);
  },
});

const PickerButtonStub = defineComponent({
  name: 'PickerButton',
  props: {
    variant: { type: String, required: false },
    disabled: { type: Boolean, required: false },
    dataTestId: { type: String, required: false },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        'button',
        {
          ...attrs,
          type: 'button',
          disabled: props.disabled,
          'data-testid': props.dataTestId,
          'data-variant': props.variant,
        },
        slots.default?.(),
      );
  },
});

const PickerNavigationStub = defineComponent({
  name: 'PickerNavigation',
  props: {
    previousLabel: { type: String, required: true },
    nextLabel: { type: String, required: true },
    previousDisabled: { type: Boolean, required: false },
    nextDisabled: { type: Boolean, required: false },
    dataTestId: { type: String, required: false },
  },
  emits: ['on:previous', 'on:next'],
  setup(props, { emit }) {
    return () =>
      h('div', { 'data-testid': props.dataTestId }, [
        h(
          'button',
          {
            type: 'button',
            'aria-label': props.previousLabel,
            'data-testid': props.dataTestId ? `${props.dataTestId}-previous-button` : undefined,
            disabled: props.previousDisabled,
            onClick: () => emit('on:previous'),
          },
          'previous',
        ),
        h(
          'button',
          {
            type: 'button',
            'aria-label': props.nextLabel,
            'data-testid': props.dataTestId ? `${props.dataTestId}-next-button` : undefined,
            disabled: props.nextDisabled,
            onClick: () => emit('on:next'),
          },
          'next',
        ),
      ]);
  },
});

const PopoverOverlayerStub = defineComponent({
  name: 'PopoverOverlayer',
  props: {
    placement: { type: String, required: false },
    disabled: { type: Boolean, required: false },
    dataTestId: { type: String, required: false },
    contentClass: { type: String, required: false },
    matchTriggerWidth: { type: Boolean, required: false },
  },
  emits: ['update:open'],
  setup(props, { slots, emit, expose, attrs }) {
    const isOpen = ref(false);

    const showPopover = () => {
      if (props.disabled) {
        return;
      }

      isOpen.value = true;
      emit('update:open', true);
    };

    const hidePopover = () => {
      isOpen.value = false;
      emit('update:open', false);
    };

    const togglePopover = () => {
      if (isOpen.value) {
        hidePopover();
        return;
      }

      showPopover();
    };

    expose({
      hidePopover,
      showPopover,
      togglePopover,
    });

    return () =>
      h(
        'div',
        {
          ...attrs,
          'data-testid': props.dataTestId ? `${props.dataTestId}-trigger` : undefined,
          onClick: togglePopover,
        },
        [
          slots.default?.(),
          isOpen.value
            ? h(
                'div',
                {
                  class: props.contentClass,
                  'data-testid': props.dataTestId ? `${props.dataTestId}-content` : undefined,
                  onClick: (event: Event) => event.stopPropagation(),
                },
                slots.content?.(),
              )
            : null,
        ],
      );
  },
});

import FormYearPicker from './index.vue';

const mountComponent = (
  props: Record<string, unknown> = {},
  attrs: Record<string, unknown> = {},
) => {
  let wrapper: ReturnType<typeof mount>;

  wrapper = mount(FormYearPicker, {
    props: {
      id: 'year',
      name: 'year',
      value: 2024,
      dataTestId: 'form-year-picker',
      'onUpdate:value': async (value: YearPickerValue) => {
        await wrapper.setProps({ value });
      },
      ...props,
    },
    attrs,
    global: {
      stubs: {
        FormField: FormFieldStub,
        PickerButton: PickerButtonStub,
        PickerNavigation: PickerNavigationStub,
        PopoverOverlayer: PopoverOverlayerStub,
      },
    },
  });

  return wrapper;
};

describe('FormYearPicker (index.vue)', () => {
  it('renders readonly input with dialog aria bindings and selected year value', () => {
    const wrapper = mountComponent();

    const input = wrapper.get('input');

    expect(input.attributes('type')).toBe('text');
    expect(input.attributes('role')).toBe('combobox');
    expect(input.attributes('aria-haspopup')).toBe('dialog');
    expect(input.attributes('aria-controls')).toBe('year-dialog');
    expect(input.attributes('placeholder')).toBe('wybierz rok');
    expect(input.attributes('data-testid')).toBe('form-year-picker-element');
    expect(input.classes()).toContain('field-element');
    expect(input.classes()).toContain('peaui-form-year-picker__input');
    expect(input.attributes()).toHaveProperty('readonly');
    expect((input.element as HTMLInputElement).value).toBe('2024');
  });

  it('uses explicit aria attrs or name fallback for input accessible name', () => {
    const wrapperWithoutLabel = mountComponent({
      label: undefined,
    });

    expect(wrapperWithoutLabel.get('input').attributes('aria-label')).toBe('year');
    expect(wrapperWithoutLabel.get('input').attributes('aria-labelledby')).toBeUndefined();

    const wrapperWithExplicitLabel = mountComponent(
      {
        label: undefined,
      },
      {
        'aria-label': 'Wybierz rok',
      },
    );

    expect(wrapperWithExplicitLabel.get('input').attributes('aria-label')).toBe('Wybierz rok');

    const wrapperWithExplicitLabelledBy = mountComponent(
      {
        label: undefined,
      },
      {
        'aria-labelledby': 'year-label',
      },
    );

    expect(wrapperWithExplicitLabelledBy.get('input').attributes('aria-label')).toBeUndefined();
    expect(wrapperWithExplicitLabelledBy.get('input').attributes('aria-labelledby')).toBe(
      'year-label',
    );
  });

  it('opens dialog panel and updates model after selecting year button', async () => {
    const wrapper = mountComponent();
    const input = wrapper.get('input');

    await input.trigger('click');
    await nextTick();

    expect(input.attributes('aria-expanded')).toBe('true');
    expect(wrapper.get('[data-testid="form-year-picker-panel"]')).toBeTruthy();
    expect(wrapper.get('[data-testid="form-year-picker-grid"]')).toBeTruthy();
    expect(wrapper.get('[data-testid="form-year-picker-range"]').text()).toContain('2020 - 2029');

    const yearButton = wrapper.get('[data-testid="form-year-picker-year-2026"]');

    await yearButton.trigger('click');
    await nextTick();

    expect(wrapper.emitted('update:value')?.at(-1)).toEqual([2026]);
    expect(wrapper.get('input').attributes('aria-expanded')).toBe('false');
    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('2026');
  });

  it('changes visible decade with navigation component', async () => {
    const wrapper = mountComponent();
    const input = wrapper.get('input');

    await input.trigger('click');
    await nextTick();

    await wrapper.get('[data-testid="form-year-picker-navigation-next-button"]').trigger('click');
    await nextTick();

    expect(wrapper.get('[data-testid="form-year-picker-range"]').text()).toContain('2030 - 2039');

    await wrapper
      .get('[data-testid="form-year-picker-navigation-previous-button"]')
      .trigger('click');
    await nextTick();

    expect(wrapper.get('[data-testid="form-year-picker-range"]').text()).toContain('2020 - 2029');
  });

  it('supports keyboard navigation between years and selects active year with enter', async () => {
    const wrapper = mountComponent();
    const input = wrapper.get('input');

    await input.trigger('keydown', { key: 'Enter' });
    await nextTick();

    const activeButton = wrapper.get('[data-testid="form-year-picker-year-2024"]');
    expect(activeButton.attributes('tabindex')).toBe('0');

    await activeButton.trigger('keydown', { key: 'ArrowRight' });
    await nextTick();

    const nextButton = wrapper.get('[data-testid="form-year-picker-year-2025"]');
    expect(nextButton.attributes('tabindex')).toBe('0');

    await nextButton.trigger('keydown', { key: 'Enter' });
    await nextTick();

    expect(wrapper.emitted('update:value')?.at(-1)).toEqual([2025]);
    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('2025');
  });

  it('clears value and emits remove event when erase is triggered', async () => {
    const wrapper = mountComponent({
      canErase: true,
    });

    await wrapper.get('[data-testid="remove-button"]').trigger('click');

    expect(wrapper.emitted('update:value')?.[0]).toEqual([undefined]);
    expect(wrapper.emitted('on:remove')).toEqual([[]]);
  });

  it('does not open dialog when readonly', async () => {
    const wrapper = mountComponent({
      readonly: true,
    });

    const input = wrapper.get('input');

    await input.trigger('click');
    await nextTick();

    expect(input.attributes('aria-expanded')).toBe('false');
    expect(wrapper.find('[data-testid="form-year-picker-panel"]').exists()).toBe(false);
  });

  it('disables years outside minYear and maxYear and blocks selecting them', async () => {
    const wrapper = mountComponent({
      minYear: 2025,
      maxYear: 2027,
    });

    await wrapper.get('input').trigger('click');
    await nextTick();

    const disabledYearButton = wrapper.get('[data-testid="form-year-picker-year-2024"]');
    const enabledYearButton = wrapper.get('[data-testid="form-year-picker-year-2026"]');

    expect(disabledYearButton.attributes()).toHaveProperty('disabled');
    expect(enabledYearButton.attributes('disabled')).toBeUndefined();

    await disabledYearButton.trigger('click');

    expect(wrapper.emitted('update:value')).toBeUndefined();
  });

  it('disables navigation when the next or previous decade has no selectable years', async () => {
    const wrapper = mountComponent({
      value: 2026,
      minYear: 2025,
      maxYear: 2027,
    });

    await wrapper.get('input').trigger('click');
    await nextTick();

    expect(
      wrapper.get('[data-testid="form-year-picker-navigation-previous-button"]').attributes(),
    ).toHaveProperty('disabled');
    expect(
      wrapper.get('[data-testid="form-year-picker-navigation-next-button"]').attributes(),
    ).toHaveProperty('disabled');
  });

  it('renders formatted year range when range mode is enabled and value contains two years', () => {
    const wrapper = mountComponent({
      range: true,
      value: [2021, 2024],
    });

    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('2021 - 2024');
  });

  it('selects start and end year in range mode and emits ordered tuple', async () => {
    const wrapper = mountComponent({
      range: true,
      value: undefined,
    });

    await wrapper.get('input').trigger('click');
    await nextTick();

    await wrapper.get('[data-testid="form-year-picker-year-2026"]').trigger('click');
    await nextTick();

    expect(wrapper.emitted('update:value')).toBeUndefined();
    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('2026 - ');
    expect(wrapper.get('input').attributes('aria-expanded')).toBe('true');

    await wrapper.get('[data-testid="form-year-picker-year-2023"]').trigger('click');
    await nextTick();

    expect(wrapper.emitted('update:value')?.at(-1)).toEqual([[2023, 2026]]);
    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('2023 - 2026');
    expect(wrapper.get('input').attributes('aria-expanded')).toBe('false');
  });
});
