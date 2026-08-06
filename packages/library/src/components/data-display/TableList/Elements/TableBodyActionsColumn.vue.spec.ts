import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref, watch } from 'vue';
import { describe, expect, it } from 'vitest';

import TableBodyActionsColumn from './TableBodyActionsColumn.vue';

const SvgIconStub = defineComponent({
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

const PopoverOverlayerStub = defineComponent({
  props: {
    ariaLabel: {
      type: String,
      default: undefined,
    },
    popupType: {
      type: String,
      default: undefined,
    },
    dataTestId: {
      type: String,
      default: undefined,
    },
    open: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:open'],
  inheritAttrs: false,
  setup(props, { attrs, emit, expose, slots }) {
    const isOpen = ref(props.open);

    watch(
      () => props.open,
      (value) => {
        isOpen.value = value;
      },
      { immediate: true },
    );

    function showPopover() {
      isOpen.value = true;
      emit('update:open', true);
    }

    function hidePopover() {
      isOpen.value = false;
      emit('update:open', false);
    }

    function togglePopover() {
      if (isOpen.value) {
        hidePopover();
        return;
      }

      showPopover();
    }

    function handleClick(event: MouseEvent) {
      attrs.onClick?.(event);
      togglePopover();
    }

    function handleKeydown(event: KeyboardEvent) {
      attrs.onKeydown?.(event);

      if (['Enter', ' ', 'Spacebar', 'ArrowDown'].includes(event.key)) {
        showPopover();
        return;
      }

      if (event.key === 'Escape') {
        hidePopover();
      }
    }

    expose({
      hidePopover,
      showPopover,
      togglePopover,
    });

    return () =>
      h('div', [
        h(
          'div',
          {
            ...attrs,
            'aria-label': props.ariaLabel,
            'aria-haspopup': props.popupType,
            'data-testid': props.dataTestId ? `${props.dataTestId}-trigger` : undefined,
            onClick: handleClick,
            onKeydown: handleKeydown,
          },
          slots.default?.(),
        ),
        isOpen.value
          ? h(
              'div',
              {
                'data-testid': props.dataTestId ? `${props.dataTestId}-content` : 'popover-content',
              },
              slots.content?.(),
            )
          : null,
      ]);
  },
});

describe('TableBodyActionsColumn.vue', () => {
  it('renders a single simple action as a button and emits selected action', async () => {
    const wrapper = mount(TableBodyActionsColumn, {
      props: {
        dataTestId: 'row-actions',
        record: { id: '1', name: 'Alfa' },
        actionsButtonsColumn: {
          key: 'actions',
          label: 'Akcje',
          resolve: () => [{ key: 'edit', label: 'Edytuj', icon: 'edit', simple: true }],
        } as any,
      },
      global: {
        stubs: {
          SvgIcon: SvgIconStub,
          PopoverOverlayer: PopoverOverlayerStub,
        },
      },
    });

    const button = wrapper.get('[data-testid="row-actions-action-edit"]');
    expect(button.attributes('aria-label')).toContain('Edytuj');

    await button.trigger('click');
    expect(wrapper.emitted('on:fire:action')).toEqual([['edit']]);
  });

  it('renders keyboard-accessible popover trigger and action buttons for multiple actions', async () => {
    const wrapper = mount(TableBodyActionsColumn, {
      props: {
        dataTestId: 'row-actions',
        record: { id: '1', name: 'Alfa' },
        actionsButtonsColumn: {
          key: 'actions',
          label: 'Akcje',
          resolve: () => [
            { key: 'edit', label: 'Edytuj', icon: 'edit' },
            { key: 'copy', label: 'Kopiuj', icon: 'copy' },
          ],
        } as any,
      },
      global: {
        stubs: {
          SvgIcon: SvgIconStub,
          PopoverOverlayer: PopoverOverlayerStub,
        },
      },
    });

    const trigger = wrapper.get('[data-testid="row-actions-popover-trigger"]');
    expect(trigger.attributes('tabindex')).toBe('0');
    expect(trigger.attributes('aria-label')).toBe('Pokaz akcje dla rekordu');
    expect(trigger.attributes('aria-haspopup')).toBeUndefined();

    await trigger.trigger('keydown', { key: 'Enter' });
    await nextTick();

    expect(
      wrapper.get('[data-testid="row-actions-action-edit"]').attributes('role'),
    ).toBeUndefined();
    expect(
      wrapper.get('[data-testid="row-actions-action-copy"]').attributes('role'),
    ).toBeUndefined();
  });

  it('moves focus through actions with keyboard and selects action by space', async () => {
    const wrapper = mount(TableBodyActionsColumn, {
      attachTo: document.body,
      props: {
        dataTestId: 'row-actions',
        record: { id: '1', name: 'Alfa' },
        actionsButtonsColumn: {
          key: 'actions',
          label: 'Akcje',
          resolve: () => [
            { key: 'edit', label: 'Edytuj', icon: 'edit' },
            { key: 'copy', label: 'Kopiuj', icon: 'copy' },
          ],
        } as any,
      },
      global: {
        stubs: {
          SvgIcon: SvgIconStub,
          PopoverOverlayer: PopoverOverlayerStub,
        },
      },
    });

    const trigger = wrapper.get('[data-testid="row-actions-popover-trigger"]');

    await trigger.trigger('keydown', { key: 'Enter' });
    await nextTick();

    const editButton = wrapper.get<HTMLButtonElement>('[data-testid="row-actions-action-edit"]');
    const copyButton = wrapper.get<HTMLButtonElement>('[data-testid="row-actions-action-copy"]');

    expect(document.activeElement).toBe(editButton.element);

    await editButton.trigger('keydown', { key: 'ArrowDown' });
    expect(document.activeElement).toBe(copyButton.element);

    await copyButton.trigger('keydown', { key: 'ArrowUp' });
    expect(document.activeElement).toBe(editButton.element);

    await editButton.trigger('keydown', { key: ' ' });
    expect(wrapper.emitted('on:fire:action')).toEqual([['edit']]);

    wrapper.unmount();
  });
});
