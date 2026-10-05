import { flushPromises, mount } from '@vue/test-utils';
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
          onFocusin: (event: FocusEvent) => {
            const target = event.target as HTMLElement | null;

            // Native auto popovers can be light-dismissed when focus is moved back
            // to the trigger after interacting with content.
            if (isOpen.value && target?.dataset.type === 'multiselect') {
              hidePopover();
            }
          },
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

import FormMultiSelect from './index.vue';

const defaultOptions = [
  { label: 'Mazowieckie', value: 'mazowieckie' },
  { label: 'Malopolskie', value: 'malopolskie' },
  { label: 'Pomorskie', value: 'pomorskie' },
];

const mountComponent = (
  props: Record<string, unknown> = {},
  attrs: Record<string, unknown> = {},
) => {
  const wrapper = mount(FormMultiSelect, {
    props: {
      id: 'regions',
      name: 'regions',
      value: [],
      options: defaultOptions,
      valueMode: 'label',
      dataTestId: 'form-multiselect',
      'onUpdate:value': async (value: unknown[] | null | undefined) => {
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

describe('FormMultiSelect (index.vue)', () => {
  it('returns option values by default and offers the label migration mode', async () => {
    for (const valueMode of [undefined, 'label'] as const) {
      const wrapper = mountComponent({ valueMode, options: [{ label: 'Alpha', value: 'a' }] });
      await wrapper.get('input').trigger('keydown', { key: 'ArrowDown' });
      await wrapper.get('[role="option"]').trigger('click');
      expect(wrapper.emitted('update:value')?.at(-1)).toEqual([
        valueMode === 'label' ? ['Alpha'] : ['a'],
      ]);
      wrapper.unmount();
    }
  });

  it('renders combobox input with base aria attrs and displays selected labels', () => {
    const wrapper = mountComponent({
      value: ['Mazowieckie', 'Pomorskie'],
    });

    const input = wrapper.get('input');

    expect(input.attributes('type')).toBe('text');
    expect(input.attributes('role')).toBe('combobox');
    expect(input.attributes('aria-haspopup')).toBe('listbox');
    expect(input.attributes('aria-autocomplete')).toBe('list');
    expect(input.attributes('placeholder')).toBe('wybierz/wyszukaj');
    expect(input.attributes('data-testid')).toBe('form-multiselect-element');
    expect(input.classes()).toContain('field-element');
    expect(input.classes()).toContain('peaui-form-multiselect__input');
    expect((input.element as HTMLInputElement).value).toBe('Mazowieckie, Pomorskie');
  });

  it('opens listbox, filters options and toggles option label without closing popover', async () => {
    const wrapper = mountComponent();
    const input = wrapper.get('input');

    await input.trigger('click');
    await nextTick();

    expect(input.attributes('aria-expanded')).toBe('true');
    expect(input.attributes('aria-controls')).toBe('regions-listbox');

    const listbox = wrapper.get('[data-testid="form-multiselect-listbox"]');
    expect(listbox.attributes('aria-multiselectable')).toBe('true');

    await input.setValue('Mal');
    await nextTick();

    const options = wrapper.findAll('[role="option"]');
    expect(options).toHaveLength(1);
    expect(options[0]!.text()).toContain('Malopolskie');

    await options[0]!.trigger('mousedown');
    await options[0]!.trigger('click');
    await nextTick();

    expect(wrapper.emitted('update:value')?.at(-1)).toEqual([['Malopolskie']]);
    expect(wrapper.get('input').attributes('aria-expanded')).toBe('true');

    await input.trigger('keydown.esc');
    await nextTick();

    expect(wrapper.get('input').attributes('aria-expanded')).toBe('false');
    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('Malopolskie');
  });

  it('uses visible label for listbox aria-labelledby when label exists', async () => {
    const wrapperWithLabel = mountComponent({
      label: 'Regiony',
    });

    await wrapperWithLabel.get('input').trigger('click');
    await nextTick();

    expect(
      wrapperWithLabel
        .get('[data-testid="form-multiselect-listbox"]')
        .attributes('aria-labelledby'),
    ).toBe('label-regions');
    expect(
      wrapperWithLabel.get('[data-testid="form-multiselect-listbox"]').attributes('aria-label'),
    ).toBeUndefined();
  });

  it('falls back to explicit aria attrs or name for listbox accessible name', async () => {
    const wrapperWithExplicitLabelledBy = mountComponent(
      {
        label: undefined,
      },
      {
        'aria-labelledby': 'external-regions-label',
      },
    );

    await wrapperWithExplicitLabelledBy.get('input').trigger('click');
    await nextTick();

    expect(
      wrapperWithExplicitLabelledBy
        .get('[data-testid="form-multiselect-listbox"]')
        .attributes('aria-labelledby'),
    ).toBe('external-regions-label');
    expect(
      wrapperWithExplicitLabelledBy
        .get('[data-testid="form-multiselect-listbox"]')
        .attributes('aria-label'),
    ).toBeUndefined();

    const wrapperWithExplicitLabel = mountComponent(
      {
        label: undefined,
      },
      {
        'aria-label': 'Wybierz regiony',
      },
    );

    await wrapperWithExplicitLabel.get('input').trigger('click');
    await nextTick();

    expect(
      wrapperWithExplicitLabel
        .get('[data-testid="form-multiselect-listbox"]')
        .attributes('aria-label'),
    ).toBe('Wybierz regiony');
    expect(
      wrapperWithExplicitLabel
        .get('[data-testid="form-multiselect-listbox"]')
        .attributes('aria-labelledby'),
    ).toBeUndefined();

    const wrapperWithoutLabel = mountComponent({
      label: undefined,
    });

    await wrapperWithoutLabel.get('input').trigger('click');
    await nextTick();

    expect(
      wrapperWithoutLabel
        .get('[data-testid="form-multiselect-listbox"]')
        .attributes('aria-labelledby'),
    ).toBeUndefined();
    expect(
      wrapperWithoutLabel.get('[data-testid="form-multiselect-listbox"]').attributes('aria-label'),
    ).toBe('regions');
  });

  it('supports selecting multiple values and displays joined labels after closing', async () => {
    const wrapper = mountComponent({
      value: ['Mazowieckie'],
    });

    const input = wrapper.get('input');
    await input.trigger('click');
    await nextTick();

    const options = wrapper.findAll('[role="option"]');
    await options[2]!.trigger('mousedown');
    await options[2]!.trigger('click');
    await nextTick();

    expect(wrapper.emitted('update:value')?.at(-1)).toEqual([['Mazowieckie', 'Pomorskie']]);

    await input.trigger('keydown.esc');
    await nextTick();

    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('Mazowieckie, Pomorskie');
  });

  it('renders select all action outside listbox and toggles all enabled options', async () => {
    const wrapper = mountComponent({
      options: [
        { label: 'Mazowieckie', value: 'mazowieckie' },
        { label: 'Pomorskie', value: 'pomorskie' },
        { disabled: true, label: 'Disabled', value: 'disabled' },
      ],
      withSelectAll: true,
    });

    const input = wrapper.get('input');
    await input.trigger('click');
    await nextTick();

    const listboxOptions = wrapper.findAll('[role="option"]');
    expect(listboxOptions).toHaveLength(3);
    expect(listboxOptions.some((option) => option.text().includes('Zaznacz wszystkie'))).toBe(
      false,
    );

    const selectAllAction = wrapper.get('[data-testid="form-multiselect-select-all-option"]');
    expect(selectAllAction.element.tagName).toBe('BUTTON');
    expect(selectAllAction.text()).toContain('Zaznacz wszystkie');
    expect(selectAllAction.attributes('aria-pressed')).toBe('false');

    await selectAllAction.trigger('click');
    await flushPromises();

    expect(wrapper.emitted('update:value')?.at(-1)).toEqual([['Mazowieckie', 'Pomorskie']]);
    expect(wrapper.get('[data-testid="form-multiselect-select-all-option"]').text()).toContain(
      'Odznacz wszystkie',
    );
    expect(
      wrapper.get('[data-testid="form-multiselect-select-all-option"]').attributes('aria-pressed'),
    ).toBe('true');

    await wrapper.get('[data-testid="form-multiselect-select-all-option"]').trigger('click');
    await flushPromises();

    expect(wrapper.emitted('update:value')?.at(-1)).toEqual([[]]);
  });

  it('keeps popover open on Tab when select all action is available', async () => {
    const wrapper = mountComponent({
      withSelectAll: true,
    });

    const input = wrapper.get('input');
    await input.trigger('click');
    await nextTick();

    await input.trigger('keydown.tab');
    await nextTick();

    expect(wrapper.get('input').attributes('aria-expanded')).toBe('true');
    expect(wrapper.find('[data-testid="form-multiselect-select-all-option"]').exists()).toBe(true);
  });

  it('restores listbox scroll position after selecting an option', async () => {
    const wrapper = mountComponent({
      options: Array.from({ length: 12 }, (_, index) => ({
        label: `Option ${index + 1}`,
        value: `option-${index + 1}`,
      })),
    });

    const input = wrapper.get('input');
    await input.trigger('click');
    await nextTick();

    const listbox = wrapper.get('[data-testid="form-multiselect-listbox"]').element as HTMLElement;
    let currentScrollTop = 0;
    const assignedScrollTopValues: number[] = [];

    Object.defineProperty(listbox, 'scrollTop', {
      configurable: true,
      get: () => currentScrollTop,
      set: (value: number) => {
        currentScrollTop = value;
        assignedScrollTopValues.push(value);
      },
    });

    listbox.scrollTop = 144;
    assignedScrollTopValues.length = 0;

    const options = wrapper.findAll('[role="option"]');
    await options[10]!.trigger('mouseenter');
    await options[10]!.trigger('mousedown');
    await options[10]!.trigger('click');
    await flushPromises();

    expect(wrapper.emitted('update:value')?.at(-1)).toEqual([['Option 11']]);
    expect(assignedScrollTopValues).toContain(144);
    expect(currentScrollTop).toBe(144);
  });

  it('keeps highlighted option and does not auto-scroll back after selecting when parent refreshes options', async () => {
    const getElementByIdSpy = vi.spyOn(document, 'getElementById');

    const mapOptionsWithActive = (selectedValues: unknown[] | null | undefined) =>
      defaultOptions.map((option) => ({
        ...option,
        active: Array.isArray(selectedValues) && selectedValues.includes(option.label),
      }));

    const wrapper: ReturnType<typeof mount> = mount(FormMultiSelect, {
      props: {
        id: 'regions',
        name: 'regions',
        value: ['Mazowieckie'],
        valueMode: 'label',
        options: mapOptionsWithActive(['Mazowieckie']),
        dataTestId: 'form-multiselect',
        'onUpdate:value': async (value: unknown[] | null | undefined) => {
          await wrapper.setProps({
            value,
            options: mapOptionsWithActive(value),
          });
        },
      },
      global: {
        stubs: {
          FormField: FormFieldStub,
          SvgIcon: SvgIconStub,
          InfoTooltip: InfoTooltipStub,
          PopoverOverlayer: PopoverOverlayerStub,
        },
      },
    });

    const input = wrapper.get('input');
    await input.trigger('click');
    await nextTick();

    expect(input.attributes('aria-activedescendant')).toBe('regions-option-0');
    const scrollLookupCallCountAfterOpen = getElementByIdSpy.mock.calls.length;

    const options = wrapper.findAll('[role="option"]');
    await options[2]!.trigger('mouseenter');
    await nextTick();

    expect(wrapper.get('input').attributes('aria-activedescendant')).toBe('regions-option-2');

    await options[2]!.trigger('mousedown');
    await options[2]!.trigger('click');
    await flushPromises();

    expect(wrapper.emitted('update:value')?.at(-1)).toEqual([['Mazowieckie', 'Pomorskie']]);
    expect(wrapper.get('input').attributes('aria-expanded')).toBe('true');
    expect(wrapper.get('input').attributes('aria-activedescendant')).toBe('regions-option-2');
    expect(getElementByIdSpy.mock.calls).toHaveLength(scrollLookupCallCountAfterOpen);

    getElementByIdSpy.mockRestore();
  });

  it('clears values and emits remove event when erase is triggered', async () => {
    const wrapper = mountComponent({
      value: ['mazowieckie'],
      canErase: true,
    });

    await wrapper.get('[data-testid="remove-button"]').trigger('click');

    expect(wrapper.emitted('update:value')?.[0]).toEqual([[]]);
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

    expect(input.attributes('aria-activedescendant')).toBe('regions-option-1');

    await input.trigger('keydown.down');
    await nextTick();

    expect(wrapper.get('input').attributes('aria-activedescendant')).toBe('regions-option-2');
  });

  it('keeps select-only mode readonly but still allows opening the list', async () => {
    const wrapper = mountComponent({
      searchable: false,
    });

    const input = wrapper.get('input');

    expect(input.attributes()).toHaveProperty('readonly');

    await input.trigger('click');
    await nextTick();

    expect(wrapper.get('[data-testid="form-multiselect-listbox"]')).toBeTruthy();
  });
});
