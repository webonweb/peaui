import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it } from 'vitest';

import TableHeadColumn from './TableHeadColumn.vue';

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

const InfoTooltipStub = defineComponent({
  template: '<span><slot /><slot name="description" /></span>',
});

describe('TableHeadColumn.vue', () => {
  it('applies aria-sort, disables static columns and emits only for sortable ones', async () => {
    const wrapper = mount(TableHeadColumn, {
      props: {
        columns: [
          { key: 'name', label: 'Nazwa', canSort: true },
          { key: 'status', label: 'Status', canSort: false },
        ],
        dataTestId: 'table-head',
        sortColumn: 'name',
        sortType: 'ASC',
      },
      global: {
        stubs: {
          InfoTooltip: InfoTooltipStub,
          SvgIcon: SvgIconStub,
        },
      },
    });

    expect(
      wrapper.get('[data-testid="table-head-head-cell-name-nazwa"]').attributes('aria-sort'),
    ).toBe('ascending');
    expect(
      wrapper
        .get('[data-testid="table-head-head-button-status-status"]')
        .attributes('aria-disabled'),
    ).toBe('true');

    await wrapper.get('[data-testid="table-head-head-button-name-nazwa"]').trigger('click');
    await wrapper.get('[data-testid="table-head-head-button-status-status"]').trigger('click');

    expect(wrapper.emitted('on:sort')).toEqual([['name']]);
  });

  it('marks up to two active sort columns when canMultiSort is enabled', () => {
    const wrapper = mount(TableHeadColumn, {
      props: {
        canMultiSort: true,
        columns: [
          { key: 'name', label: 'Nazwa', canSort: true },
          { key: 'updatedAt', label: 'Data aktualizacji', canSort: true },
          { key: 'status', label: 'Status', canSort: true },
        ],
        dataTestId: 'table-head',
        sortColumns: [{ name: 'ASC' }, { updatedAt: 'DESC' }],
        sortType: 'ASC',
      },
      global: {
        stubs: {
          InfoTooltip: InfoTooltipStub,
          SvgIcon: SvgIconStub,
        },
      },
    });

    const nameCell = wrapper.get('[data-testid="table-head-head-cell-name-nazwa"]');
    const updatedAtCell = wrapper.get(
      '[data-testid="table-head-head-cell-updatedat-data-aktualizacji"]',
    );
    const statusCell = wrapper.get('[data-testid="table-head-head-cell-status-status"]');

    expect(nameCell.attributes('aria-sort')).toBe('ascending');
    expect(nameCell.attributes('data-sort-priority')).toBe('1');
    expect(nameCell.attributes('data-sort-type')).toBe('asc');
    expect(updatedAtCell.attributes('aria-sort')).toBe('descending');
    expect(updatedAtCell.attributes('data-sort-priority')).toBe('2');
    expect(updatedAtCell.attributes('data-sort-type')).toBe('desc');
    expect(statusCell.attributes('aria-sort')).toBe('none');
    expect(statusCell.attributes('data-sort-priority')).toBeUndefined();
  });

  it('updates lock icon and tooltip text when column lock state changes', async () => {
    const wrapper = mount(TableHeadColumn, {
      props: {
        columns: [{ key: 'name', label: 'Nazwa', canSort: true, withLock: true }],
        dataTestId: 'table-head',
        lockedState: {},
        sortColumn: 'name',
        sortType: 'ASC',
      },
      global: {
        stubs: {
          InfoTooltip: InfoTooltipStub,
          SvgIcon: SvgIconStub,
        },
      },
    });

    const lockButton = wrapper.get('[data-testid="table-head-head-lock-button-name-nazwa"]');

    expect(lockButton.attributes('aria-pressed')).toBe('false');
    expect(lockButton.attributes('aria-label')).toBe('Zablokuj kolumne');
    expect(lockButton.find('svg').attributes('data-icon-name')).toBe('lock-open');
    expect(wrapper.text()).toContain('Zablokuj kolumne');

    await wrapper.setProps({
      lockedColumns: {
        name: {
          offset: 48,
          side: 'right',
        },
      },
      lockedState: {
        name: true,
      },
    });

    const headCell = wrapper.get('[data-testid="table-head-head-cell-name-nazwa"]');
    const updatedLockButton = wrapper.get('[data-testid="table-head-head-lock-button-name-nazwa"]');

    expect(headCell.classes()).toContain('peaui-table-list__head-cell--locked');
    expect(headCell.classes()).toContain('peaui-table-list__head-cell--locked-right');
    expect(headCell.attributes('style')).toContain('right: 48px;');
    expect(updatedLockButton.attributes('aria-pressed')).toBe('true');
    expect(updatedLockButton.attributes('aria-label')).toBe('Odblokuj kolumne');
    expect(updatedLockButton.find('svg').attributes('data-icon-name')).toBe('lock-closed');
    expect(wrapper.text()).toContain('Odblokuj kolumne');

    await updatedLockButton.trigger('click');

    expect(wrapper.emitted('on:lock')).toEqual([['name']]);
  });

  it('provides an accessible fallback for a column hint', () => {
    const wrapper = mount(TableHeadColumn, {
      props: {
        columns: [
          {
            key: 'name',
            label: 'Nazwa',
            hint: true,
            hintColumn: 'Pełna nazwa rekordu.',
          },
        ],
        sortType: 'ASC',
      },
      global: {
        stubs: {
          InfoTooltip: InfoTooltipStub,
          SvgIcon: SvgIconStub,
        },
      },
    });

    expect(wrapper.text()).toContain('Pełna nazwa rekordu.');
  });

  it('applies semantic border classes for left and right column dividers', () => {
    const wrapper = mount(TableHeadColumn, {
      props: {
        columns: [
          { key: 'name', label: 'Nazwa', border: 'left' },
          { key: 'status', label: 'Status', border: 'right' },
        ],
        dataTestId: 'table-head',
        sortType: 'ASC',
      },
      global: {
        stubs: {
          InfoTooltip: InfoTooltipStub,
          SvgIcon: SvgIconStub,
        },
      },
    });

    expect(wrapper.get('[data-testid="table-head-head-cell-name-nazwa"]').classes()).toContain(
      'peaui-table-list__head-cell--border-left',
    );
    expect(wrapper.get('[data-testid="table-head-head-cell-status-status"]').classes()).toContain(
      'peaui-table-list__head-cell--border-right',
    );
  });

  it('does not interpret HTML from column labels', () => {
    const label = '<img src=x onerror="alert(1)">Name';
    const wrapper = mount(TableHeadColumn, {
      props: { columns: [{ key: 'name', label }], sortType: 'ASC' },
      global: { stubs: { InfoTooltip: InfoTooltipStub, SvgIcon: SvgIconStub } },
    });

    expect(wrapper.get('.peaui-table-list__head-label').text()).toBe(label);
    expect(wrapper.find('.peaui-table-list__head-label img').exists()).toBe(false);
  });
});
