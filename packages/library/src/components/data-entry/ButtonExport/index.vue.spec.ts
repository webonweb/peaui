import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ButtonAction from '@/components/data-entry/ButtonAction/index.vue';

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

const PopoverButtonStub = defineComponent({
  name: 'PopoverButton',
  inheritAttrs: false,
  props: {
    disabled: { type: Boolean, required: false },
    ariaLabel: { type: String, required: false },
    dataTestId: { type: String, required: false },
  },
  emits: ['keydown', 'pointerdown'],
  setup(props, { attrs, slots, emit }) {
    return () =>
      h('div', { class: 'popover-button-stub' }, [
        h(
          'button',
          {
            ...attrs,
            type: 'button',
            disabled: props.disabled,
            'data-testid': props.dataTestId,
            onKeydown: (event: KeyboardEvent) => emit('keydown', event),
            onPointerdown: (event: PointerEvent) => emit('pointerdown', event),
          },
          slots.default?.(),
        ),
        h('div', { popover: 'manual', class: 'popover-content-stub' }, slots.content?.()),
      ]);
  },
});

const AccessiblePopoverButtonStub = defineComponent({
  name: 'PopoverButton',
  inheritAttrs: false,
  props: {
    disabled: { type: Boolean, required: false },
    ariaLabel: { type: String, required: false },
    dataTestId: { type: String, required: false },
    useAriaLabel: { type: Boolean, required: false },
    size: { type: String, required: false },
    variant: { type: String, required: false },
  },
  emits: ['keydown', 'pointerdown'],
  setup(props, { attrs, slots, emit }) {
    return () =>
      h('div', { class: 'popover-button-a11y-stub' }, [
        h(
          ButtonAction,
          {
            ...attrs,
            size: props.size,
            variant: props.variant,
            disabled: props.disabled,
            ariaLabel: props.ariaLabel,
            useAriaLabel: props.useAriaLabel,
            dataTestId: props.dataTestId ? `${props.dataTestId}-trigger` : undefined,
            onKeydown: (event: KeyboardEvent) => emit('keydown', event),
            onPointerdown: (event: PointerEvent) => emit('pointerdown', event),
          },
          slots,
        ),
        h(
          'div',
          {
            popover: 'manual',
            'data-test-id': props.dataTestId ? `${props.dataTestId}-content` : undefined,
          },
          slots.content?.(),
        ),
      ]);
  },
});

const ModalDialogStub = defineComponent({
  name: 'ModalDialog',
  props: {
    open: { type: Boolean, required: false },
    ariaLabel: { type: String, required: false },
  },
  emits: ['update:open'],
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        {
          'data-testid': 'modal-dialog',
          'data-open': String(props.open),
          'aria-label': props.ariaLabel,
        },
        [slots.header?.(), slots.default?.()],
      );
  },
});

const FormContainerStub = defineComponent({
  name: 'FormContainer',
  props: {
    submitButtonLabel: { type: String, required: false },
    label: { type: String, required: false },
    dataTestId: { type: String, required: false },
  },
  emits: ['on:submit', 'on:cancel'],
  setup(props, { emit, slots }) {
    return () =>
      h(
        'form',
        {
          'data-testid': props.dataTestId,
        },
        [
          h('div', { class: 'form-container-label' }, props.label),
          h(
            'button',
            {
              type: 'button',
              'data-testid': 'confirm-export',
              onClick: () => emit('on:submit'),
            },
            props.submitButtonLabel,
          ),
          h(
            'button',
            {
              type: 'button',
              'data-testid': 'cancel-export',
              onClick: () => emit('on:cancel'),
            },
            'Anuluj',
          ),
          slots.default?.(),
        ],
      );
  },
});

const SvgIconStub = defineComponent({
  name: 'SvgIcon',
  props: {
    name: { type: String, required: true },
    dataTestId: { type: String, required: false },
  },
  setup(props, { attrs }) {
    return () =>
      h('span', {
        ...attrs,
        'data-icon': props.name,
        'data-testid': props.dataTestId,
      });
  },
});

const CounterBadgeStub = defineComponent({
  name: 'CounterBadge',
  props: {
    value: { type: [String, Number], required: false },
  },
  setup(props) {
    return () => h('span', { 'data-testid': 'counter-badge-stub' }, String(props.value ?? ''));
  },
});

import ButtonExport from './index.vue';

const mountComponent = (props: Record<string, unknown> = {}) =>
  mount(ButtonExport, {
    attachTo: document.body,
    props: {
      ariaLabel: 'Eksport danych',
      dataTestId: 'button-export',
      ...props,
    },
    slots: {
      default: 'Eksportuj',
    },
    global: {
      stubs: {
        PopoverButton: PopoverButtonStub,
        ModalDialog: ModalDialogStub,
        FormContainer: FormContainerStub,
        SvgIcon: SvgIconStub,
        CounterBadge: CounterBadgeStub,
      },
    },
  });

const mountWithAccessiblePopoverButton = (
  props: Record<string, unknown> = {},
  options: { defaultSlot?: string } = {},
) =>
  mount(ButtonExport, {
    attachTo: document.body,
    props: {
      dataTestId: 'button-export',
      ...props,
    },
    ...(options.defaultSlot !== undefined
      ? {
          slots: {
            default: options.defaultSlot,
          },
        }
      : {}),
    global: {
      stubs: {
        PopoverButton: AccessiblePopoverButtonStub,
        ModalDialog: ModalDialogStub,
        FormContainer: FormContainerStub,
        SvgIcon: SvgIconStub,
        CounterBadge: CounterBadgeStub,
      },
    },
  });

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ButtonExport (index.vue)', () => {
  it('renders trigger button, export options and selected items count', () => {
    const wrapper = mountComponent({
      selectedItemsCount: 3,
    });

    const trigger = wrapper.get('button[data-testid="button-export"]');

    expect(trigger.attributes('aria-label')).toBeUndefined();
    expect(wrapper.get('[data-testid="button-export-icon"]').attributes('data-icon')).toBe(
      'download',
    );
    expect(wrapper.get('[data-testid="button-export-arrow"]').attributes('data-icon')).toBe(
      'arrow',
    );
    expect(wrapper.text()).toContain('Eksportuj');
    expect(wrapper.get('[data-testid="counter-badge-stub"]').text()).toBe('3');
    expect(wrapper.get('[data-testid="button-export-button-type-0"]').text()).toContain('Do CSV');
    expect(
      wrapper.get('[data-testid="button-export-button-type-0"]').attributes('aria-label'),
    ).toBe('Do CSV. Wyeksportuj rekordy do pliku CSV');
  });

  it('emits on:export immediately when selected items exist', async () => {
    const wrapper = mountComponent({
      selectedItemsCount: 2,
    });

    await wrapper.get('[data-testid="button-export-button-type-0"]').trigger('click');

    expect(wrapper.emitted('on:export')).toEqual([['csv']]);
    expect(wrapper.get('[data-testid="modal-dialog"]').attributes('data-open')).toBe('false');
  });

  it('does not bind custom keyup.enter to export option buttons', async () => {
    const wrapper = mountComponent({
      selectedItemsCount: 2,
    });

    await wrapper.get('[data-testid="button-export-button-type-0"]').trigger('keyup', {
      key: 'Enter',
    });

    expect(wrapper.emitted('on:export')).toBeUndefined();
    expect(wrapper.get('[data-testid="modal-dialog"]').attributes('data-open')).toBe('false');
  });

  it('opens confirmation modal instead of exporting when selectedItemsCount is zero', async () => {
    const wrapper = mountComponent({
      selectedItemsCount: 0,
    });

    await wrapper.get('[data-testid="button-export-button-type-1"]').trigger('click');

    expect(wrapper.emitted('on:export')).toBeUndefined();
    expect(wrapper.get('[data-testid="modal-dialog"]').attributes('data-open')).toBe('true');
    expect(wrapper.get('[data-testid="modal-dialog"]').attributes('aria-label')).toBe(
      'Potwierdzenie eksportu rekordow',
    );
    expect(wrapper.get('[data-testid="button-export-prompt"]').text()).toContain(
      'Potwierdzenie czy wyeksportować wszystkie rekordy',
    );
  });

  it('exports after confirmation submit when modal is opened', async () => {
    const wrapper = mountComponent({
      selectedItemsCount: 0,
    });

    await wrapper.get('[data-testid="button-export-button-type-2"]').trigger('click');
    await wrapper.get('[data-testid="confirm-export"]').trigger('click');

    expect(wrapper.emitted('on:export')).toEqual([['pdf']]);
    expect(wrapper.get('[data-testid="modal-dialog"]').attributes('data-open')).toBe('false');
  });

  it('skips confirmation when forceExport is enabled', async () => {
    const wrapper = mountComponent({
      selectedItemsCount: 0,
      forceExport: true,
    });

    await wrapper.get('[data-testid="button-export-button-type-1"]').trigger('click');

    expect(wrapper.emitted('on:export')).toEqual([['xlsx']]);
    expect(wrapper.get('[data-testid="modal-dialog"]').attributes('data-open')).toBe('false');
  });

  it('focuses first export option when popover is opened from keyboard', async () => {
    const wrapper = mountComponent();
    const trigger = wrapper.get('button[data-testid="button-export"]');
    const popover = wrapper.get('[popover]');

    await trigger.trigger('keydown', { key: 'Enter' });

    const event = new Event('toggle') as Event & { newState?: 'open' | 'closed' };
    event.newState = 'open';
    popover.element.dispatchEvent(event);

    await nextTick();
    await nextTick();

    expect(document.activeElement).toBe(
      wrapper.get('[data-testid="button-export-button-type-0"]').element,
    );
  });

  it('inherits icon-only accessible name fallback on trigger when used without slot text and ariaLabel', () => {
    const wrapper = mountWithAccessiblePopoverButton();

    expect(
      wrapper.get('button[data-testid="button-export-trigger"]').attributes('aria-label'),
    ).toBe('Przycisk akcji');
  });
});
