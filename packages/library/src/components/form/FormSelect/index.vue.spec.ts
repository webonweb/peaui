import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));
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

const SvgIconStub = defineComponent({
  name: 'SvgIcon',
  props: {
    name: { type: String, required: false },
  },
  setup(props, { attrs }) {
    return () =>
      h('svg', {
        ...attrs,
        'data-icon': props.name,
      });
  },
});

const InfoTooltipStub = defineComponent({
  name: 'InfoTooltip',
  setup(_, { slots, attrs }) {
    return () => h('span', attrs, [slots.default?.(), slots.description?.()]);
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

    const refreshPopoverPosition = vi.fn();

    expose({
      hidePopover,
      refreshPopoverPosition,
      showPopover,
      togglePopover,
    });

    return () =>
      h(
        'div',
        {
          ...attrs,
          'data-testid': props.dataTestId ? `${props.dataTestId}-trigger` : undefined,
          'data-placement': props.placement,
          onClick: togglePopover,
        },
        [
          slots.default?.(),
          isOpen.value
            ? h(
                'div',
                {
                  class: props.contentClass,
                  'data-test-id': props.dataTestId ? `${props.dataTestId}-content` : undefined,
                  onClick: (event: Event) => event.stopPropagation(),
                },
                slots.content?.(),
              )
            : null,
        ],
      );
  },
});

import FormSelect from './index.vue';

const defaultOptions = [
  { label: 'Mazowieckie', value: 'mazowieckie' },
  { label: 'Malopolskie', value: 'malopolskie' },
  { label: 'Pomorskie', value: 'pomorskie' },
];

const mountComponent = (
  props: Record<string, unknown> = {},
  attrs: Record<string, unknown> = {},
) => {
  let wrapper: ReturnType<typeof mount>;

  wrapper = mount(FormSelect, {
    props: {
      id: 'region',
      name: 'region',
      value: '',
      options: defaultOptions,
      dataTestId: 'form-select',
      'onUpdate:value': async (value: string | null | undefined) => {
        await wrapper.setProps({ value });
      },
      ...props,
    },
    attrs,
    global: {
      stubs: {
        FormField: FormFieldStub,
        SvgIcon: SvgIconStub,
        InfoTooltip: InfoTooltipStub,
        PopoverOverlayer: PopoverOverlayerStub,
      },
    },
  });

  return wrapper;
};

describe('FormSelect (index.vue)', () => {
  it('renders combobox input with derived data-testid and base aria attrs', () => {
    const wrapper = mountComponent({
      value: 'mazowieckie',
      size: 'l',
    });

    const input = wrapper.get('input');
    const root = wrapper.get('[data-testid="form-select-popover-trigger"]');

    expect(input.attributes('type')).toBe('text');
    expect(input.attributes('role')).toBe('combobox');
    expect(input.attributes('aria-haspopup')).toBe('listbox');
    expect(input.attributes('aria-autocomplete')).toBe('list');
    expect(input.attributes('placeholder')).toBe('wybierz/wyszukaj');
    expect(input.attributes('data-testid')).toBe('form-select-element');
    expect(input.classes()).toContain('field-element');
    expect(input.classes()).toContain('peaui-form-select__input');
    expect(root.classes()).toContain('peaui-form-select--size-l');
    expect((input.element as HTMLInputElement).value).toBe('Mazowieckie');
  });

  it('does not display literal undefined when model value is undefined', () => {
    const wrapper = mountComponent({
      value: undefined,
    });

    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('');
  });

  it('opens listbox, filters options and updates model with option label while displaying option label', async () => {
    const wrapper = mountComponent();
    const input = wrapper.get('input');

    await input.trigger('click');
    await nextTick();

    expect(input.attributes('aria-expanded')).toBe('true');
    expect(input.attributes('aria-controls')).toBe('region-listbox');
    expect(wrapper.get('[data-testid="form-select-listbox"]')).toBeTruthy();

    await input.setValue('Mal');
    await nextTick();

    const options = wrapper.findAll('[role="option"]');
    expect(options).toHaveLength(1);
    expect(options[0].text()).toContain('Malopolskie');

    await options[0].trigger('mousedown');
    await options[0].trigger('click');
    await nextTick();

    expect(wrapper.emitted('update:value')?.at(-1)).toEqual(['Malopolskie']);
    expect(wrapper.get('input').attributes('aria-expanded')).toBe('false');
    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('Malopolskie');
  });

  it('uses visible label for listbox aria-labelledby when label exists', async () => {
    const wrapperWithLabel = mountComponent({
      label: 'Region',
    });

    await wrapperWithLabel.get('input').trigger('click');
    await nextTick();

    expect(
      wrapperWithLabel.get('[data-testid="form-select-listbox"]').attributes('aria-labelledby'),
    ).toBe('label-region');
    expect(
      wrapperWithLabel.get('[data-testid="form-select-listbox"]').attributes('aria-label'),
    ).toBeUndefined();
  });

  it('falls back to explicit aria attrs or name for listbox accessible name', async () => {
    const wrapperWithExplicitLabelledBy = mountComponent(
      {
        label: undefined,
      },
      {
        'aria-labelledby': 'external-region-label',
      },
    );

    await wrapperWithExplicitLabelledBy.get('input').trigger('click');
    await nextTick();

    expect(
      wrapperWithExplicitLabelledBy
        .get('[data-testid="form-select-listbox"]')
        .attributes('aria-labelledby'),
    ).toBe('external-region-label');
    expect(
      wrapperWithExplicitLabelledBy
        .get('[data-testid="form-select-listbox"]')
        .attributes('aria-label'),
    ).toBeUndefined();

    const wrapperWithExplicitLabel = mountComponent(
      {
        label: undefined,
      },
      {
        'aria-label': 'Wybierz region',
      },
    );

    await wrapperWithExplicitLabel.get('input').trigger('click');
    await nextTick();

    expect(
      wrapperWithExplicitLabel.get('[data-testid="form-select-listbox"]').attributes('aria-label'),
    ).toBe('Wybierz region');
    expect(
      wrapperWithExplicitLabel
        .get('[data-testid="form-select-listbox"]')
        .attributes('aria-labelledby'),
    ).toBeUndefined();

    const wrapperWithoutLabel = mountComponent({
      label: undefined,
    });

    await wrapperWithoutLabel.get('input').trigger('click');
    await nextTick();

    expect(
      wrapperWithoutLabel.get('[data-testid="form-select-listbox"]').attributes('aria-labelledby'),
    ).toBeUndefined();
    expect(
      wrapperWithoutLabel.get('[data-testid="form-select-listbox"]').attributes('aria-label'),
    ).toBe('region');
  });

  it('updates model while typing when manual entry is enabled', async () => {
    const wrapper = mountComponent({
      canWrite: true,
      options: [],
    });

    const input = wrapper.get('input');
    await input.setValue('Wlasna wartosc');

    expect(wrapper.emitted('update:value')?.[0]).toEqual(['Wlasna wartosc']);
    expect(wrapper.get('input').attributes('aria-expanded')).toBe('true');
  });

  it('clears value and emits remove events when erase is triggered', async () => {
    const wrapper = mountComponent({
      value: 'mazowieckie',
      canErase: true,
    });

    await wrapper.get('[data-testid="remove-button"]').trigger('click');

    expect(wrapper.emitted('update:value')?.[0]).toEqual(['']);
    expect(wrapper.emitted('on:remove')).toEqual([[]]);
  });

  it('skips disabled options when calculating active descendant', async () => {
    const wrapper = mountComponent({
      options: [
        { label: 'Disabled', value: 'disabled', disabled: true },
        { label: 'Enabled', value: 'enabled' },
        { label: 'Last', value: 'last' },
      ],
    });

    const input = wrapper.get('input');
    await input.trigger('click');
    await nextTick();

    expect(input.attributes('aria-activedescendant')).toBe('region-option-1');

    await input.trigger('keydown.down');
    await nextTick();

    expect(wrapper.get('input').attributes('aria-activedescendant')).toBe('region-option-2');
  });

  it('supports keyboard navigation and selection with enter', async () => {
    const wrapper = mountComponent();
    const input = wrapper.get('input');

    await input.trigger('keydown.enter');
    await nextTick();

    expect(input.attributes('aria-expanded')).toBe('true');
    expect(input.attributes('aria-activedescendant')).toBe('region-option-0');

    await input.trigger('keydown.down');
    await nextTick();

    expect(input.attributes('aria-activedescendant')).toBe('region-option-1');

    await input.trigger('keydown.enter');
    await nextTick();

    expect(wrapper.emitted('update:value')?.at(-1)).toEqual(['Malopolskie']);
    expect(input.attributes('aria-expanded')).toBe('false');
    expect((input.element as HTMLInputElement).value).toBe('Malopolskie');
  });

  it('supports keyboard selection with space', async () => {
    const wrapper = mountComponent();
    const input = wrapper.get('input');

    await input.trigger('keydown.space');
    await nextTick();

    expect(input.attributes('aria-expanded')).toBe('true');
    expect(input.attributes('aria-activedescendant')).toBe('region-option-0');

    await input.trigger('keydown.down');
    await nextTick();
    await input.trigger('keydown.space');
    await nextTick();

    expect(wrapper.emitted('update:value')?.at(-1)).toEqual(['Malopolskie']);
    expect(input.attributes('aria-expanded')).toBe('false');
  });

  it('closes the listbox on escape and tab', async () => {
    const wrapper = mountComponent();
    const input = wrapper.get('input');

    await input.trigger('keydown.enter');
    await nextTick();

    expect(input.attributes('aria-expanded')).toBe('true');

    await input.trigger('keydown.esc');
    await nextTick();

    expect(input.attributes('aria-expanded')).toBe('false');

    await input.trigger('keydown.enter');
    await nextTick();
    await input.trigger('keydown.tab');
    await nextTick();

    expect(input.attributes('aria-expanded')).toBe('false');
  });

  it('moves to first and last enabled options with home and end', async () => {
    const wrapper = mountComponent({
      options: [
        { label: 'Disabled first', value: 'disabled-first', disabled: true },
        { label: 'Second', value: 'second' },
        { label: 'Third', value: 'third' },
        { label: 'Disabled last', value: 'disabled-last', disabled: true },
      ],
    });

    const input = wrapper.get('input');

    await input.trigger('keydown.enter');
    await nextTick();
    await input.trigger('keydown.end');
    await nextTick();

    expect(input.attributes('aria-activedescendant')).toBe('region-option-2');

    await input.trigger('keydown.home');
    await nextTick();

    expect(input.attributes('aria-activedescendant')).toBe('region-option-1');
  });

  it('keeps select-only mode readonly but still allows opening the list', async () => {
    const wrapper = mountComponent({
      searchable: false,
    });

    const input = wrapper.get('input');

    expect(input.attributes()).toHaveProperty('readonly');

    await input.trigger('click');
    await nextTick();

    expect(wrapper.get('[data-testid="form-select-listbox"]')).toBeTruthy();
  });

  it('recomputes popover placement on window resize while list is open', async () => {
    const originalInnerHeight = window.innerHeight;
    const inputRectSpy = vi.spyOn(HTMLInputElement.prototype, 'getBoundingClientRect');

    inputRectSpy.mockReturnValue({
      x: 0,
      y: 0,
      top: 120,
      right: 320,
      bottom: 168,
      left: 0,
      width: 320,
      height: 48,
      toJSON: () => ({}),
    });

    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 900,
    });

    const wrapper = mountComponent();
    const input = wrapper.get('input');

    await input.trigger('click');
    await nextTick();

    expect(
      wrapper.get('[data-testid="form-select-popover-trigger"]').attributes('data-placement'),
    ).toBe('bottom');

    inputRectSpy.mockReturnValue({
      x: 0,
      y: 0,
      top: 560,
      right: 320,
      bottom: 608,
      left: 0,
      width: 320,
      height: 48,
      toJSON: () => ({}),
    });

    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 700,
    });

    window.dispatchEvent(new Event('resize'));
    await nextTick();
    await nextTick();

    expect(
      wrapper.get('[data-testid="form-select-popover-trigger"]').attributes('data-placement'),
    ).toBe('top');

    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: originalInnerHeight,
    });
  });

  it('does not force active option scroll when the listbox itself is scrolled', async () => {
    const originalScrollIntoView = Element.prototype.scrollIntoView;
    const scrollIntoViewSpy = vi.fn();

    Object.defineProperty(Element.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoViewSpy,
    });

    const wrapper = mountComponent();
    const input = wrapper.get('input');

    await input.trigger('click');
    await nextTick();
    await nextTick();

    scrollIntoViewSpy.mockClear();

    await wrapper.get('[data-testid="form-select-listbox"]').trigger('scroll');
    await nextTick();

    expect(scrollIntoViewSpy).not.toHaveBeenCalled();

    Object.defineProperty(Element.prototype, 'scrollIntoView', {
      configurable: true,
      value: originalScrollIntoView,
    });
  });
});
