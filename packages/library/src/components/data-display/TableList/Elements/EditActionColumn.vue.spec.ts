import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import EditActionColumn from './EditActionColumn.vue';

describe('EditActionColumn.vue', () => {
  it('renders value and emits record id after clicking edit icon button', async () => {
    const wrapper = mount(EditActionColumn, {
      props: {
        column: {
          key: 'workflowStatus',
          label: 'Status',
          type: 'editAction',
        },
        dataTestId: 'table-list-record-1-workflow-status',
        record: {
          id: '42',
        },
        value: 'Aktywny',
      },
      global: {
        stubs: {
          SvgIcon: true,
        },
      },
    });

    expect(wrapper.text()).toContain('Aktywny');

    await wrapper
      .get('[data-testid="table-list-record-1-workflow-status-button"]')
      .trigger('click');

    expect(wrapper.emitted('on:click')).toEqual([['42']]);
  });

  it('renders placeholder when value is empty', () => {
    const wrapper = mount(EditActionColumn, {
      props: {
        column: {
          key: 'workflowStatus',
          label: 'Status',
          type: 'EditActionColumn',
        },
        value: '',
      },
      global: {
        stubs: {
          SvgIcon: true,
        },
      },
    });

    expect(wrapper.text()).toContain('-/-');
  });
});
