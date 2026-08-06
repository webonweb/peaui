import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it } from 'vitest';

import ActionColumn from './ActionColumn.vue';

const ButtonActionStub = defineComponent({
  name: 'ButtonAction',
  props: {
    ariaLabel: String,
    dataTestId: String,
  },
  emits: ['click'],
  setup(props, { emit, slots }) {
    return () =>
      h(
        'button',
        {
          type: 'button',
          'data-testid': props.dataTestId,
          'data-aria-label': props.ariaLabel,
          onClick: () => emit('click'),
        },
        slots.default?.(),
      );
  },
});

describe('ActionColumn.vue', () => {
  it('renders fallback action label consistently in text and aria label', async () => {
    const wrapper = mount(ActionColumn, {
      props: {
        column: {
          key: 'action',
          label: 'Akcja',
          type: 'action',
        },
        dataTestId: 'table-list-record-1-action',
        record: {
          id: '42',
        },
      },
      global: {
        stubs: {
          ButtonAction: ButtonActionStub,
        },
      },
    });

    const button = wrapper.get('[data-testid="table-list-record-1-action-button"]');

    expect(button.text()).toContain('akcja');
    expect(button.attributes('data-aria-label')).toBe('akcja');

    await button.trigger('click');

    expect(wrapper.emitted('on:click')).toEqual([['42']]);
  });

  it('uses custom actionLabel for both visible text and aria label', () => {
    const wrapper = mount(ActionColumn, {
      props: {
        column: {
          key: 'action',
          label: 'Akcja',
          type: 'action',
          actionLabel: 'Szczegoly',
        },
        dataTestId: 'table-list-record-1-action',
      },
      global: {
        stubs: {
          ButtonAction: ButtonActionStub,
        },
      },
    });

    const button = wrapper.get('[data-testid="table-list-record-1-action-button"]');

    expect(button.text()).toContain('Szczegoly');
    expect(button.attributes('data-aria-label')).toBe('Szczegoly');
  });
});
