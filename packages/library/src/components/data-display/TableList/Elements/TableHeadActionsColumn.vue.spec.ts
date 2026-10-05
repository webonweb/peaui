import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it } from 'vitest';

import TableHeadActionsColumn from './TableHeadActionsColumn.vue';

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
    dataTestId: {
      type: String,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    return () =>
      h('div', [
        h('div', { 'data-testid': props.dataTestId ? `${props.dataTestId}-trigger` : undefined }, [
          slots.default?.(),
        ]),
        h('div', { 'data-test-id': props.dataTestId ? `${props.dataTestId}-content` : undefined }, [
          slots.content?.(),
        ]),
      ]);
  },
});

describe('TableHeadActionsColumn.vue', () => {
  it('renders cogs trigger and emits column visibility change', async () => {
    const wrapper = mount(TableHeadActionsColumn, {
      props: {
        canHideColumns: true,
        columns: [
          { key: 'name', label: 'Nazwa', visible: true },
          { key: 'status', label: 'Status', visible: true },
          { key: 'city', label: 'Miasto', visible: true },
          { key: 'owners', label: 'Opiekunowie', visible: true },
        ],
        dataTestId: 'head-actions',
      },
      global: {
        stubs: {
          PopoverOverlayer: PopoverOverlayerStub,
          SvgIcon: SvgIconStub,
        },
      },
    });

    expect(wrapper.find('[data-testid="head-actions-column-visibility-trigger"]').exists()).toBe(
      true,
    );
    expect(wrapper.get('svg').attributes('data-icon-name')).toBe('cogs');

    await wrapper
      .get('[data-testid="head-actions-column-visibility-checkbox-name"]')
      .setValue(false);

    expect(wrapper.emitted('on:toggle:column')).toEqual([['name', false]]);
  });

  it('uses subKey to distinguish columns with duplicated key values', async () => {
    const wrapper = mount(TableHeadActionsColumn, {
      props: {
        canHideColumns: true,
        columns: [
          { key: 'status', subKey: 'status-primary', label: 'Status podstawowy', visible: true },
          { key: 'status', subKey: 'status-secondary', label: 'Status dodatkowy', visible: true },
          { key: 'city', label: 'Miasto', visible: true },
          { key: 'owners', label: 'Opiekunowie', visible: true },
        ],
        dataTestId: 'head-actions',
      },
      global: {
        stubs: {
          PopoverOverlayer: PopoverOverlayerStub,
          SvgIcon: SvgIconStub,
        },
      },
    });

    expect(
      wrapper
        .find('[data-testid="head-actions-column-visibility-checkbox-status-primary"]')
        .exists(),
    ).toBe(true);
    expect(
      wrapper
        .find('[data-testid="head-actions-column-visibility-checkbox-status-secondary"]')
        .exists(),
    ).toBe(true);

    await wrapper
      .get('[data-testid="head-actions-column-visibility-checkbox-status-secondary"]')
      .setValue(false);

    expect(wrapper.emitted('on:toggle:column')).toEqual([['status-secondary', false]]);
  });

  it('disables hiding visible columns when only minimum three remain and keeps hidden columns enabled', () => {
    const wrapper = mount(TableHeadActionsColumn, {
      props: {
        canHideColumns: true,
        columns: [
          { key: 'name', label: 'Nazwa', visible: true },
          { key: 'status', label: 'Status', visible: true },
          { key: 'city', label: 'Miasto', visible: true },
          { key: 'owners', label: 'Opiekunowie', visible: false },
        ],
        dataTestId: 'head-actions',
        minimumVisibleColumns: 3,
      },
      global: {
        stubs: {
          PopoverOverlayer: PopoverOverlayerStub,
          SvgIcon: SvgIconStub,
        },
      },
    });

    expect(
      wrapper.get('[data-testid="head-actions-column-visibility-checkbox-name"]').attributes(),
    ).toHaveProperty('disabled');
    expect(
      wrapper.get('[data-testid="head-actions-column-visibility-checkbox-status"]').attributes(),
    ).toHaveProperty('disabled');
    expect(
      wrapper.get('[data-testid="head-actions-column-visibility-checkbox-city"]').attributes(),
    ).toHaveProperty('disabled');
    expect(
      wrapper
        .get('[data-testid="head-actions-column-visibility-checkbox-owners"]')
        .attributes('disabled'),
    ).toBeUndefined();
    expect(
      (
        wrapper.get('[data-testid="head-actions-column-visibility-checkbox-owners"]')
          .element as HTMLInputElement
      ).checked,
    ).toBe(false);
  });

  it('disables hiding currently locked visible columns', () => {
    const wrapper = mount(TableHeadActionsColumn, {
      props: {
        canHideColumns: true,
        columns: [
          { key: 'name', label: 'Nazwa', visible: true },
          { key: 'status', label: 'Status', visible: true, withLock: true },
          { key: 'city', label: 'Miasto', visible: true },
          { key: 'owners', label: 'Opiekunowie', visible: true },
        ],
        dataTestId: 'head-actions',
        lockedState: {
          status: true,
        },
      },
      global: {
        stubs: {
          PopoverOverlayer: PopoverOverlayerStub,
          SvgIcon: SvgIconStub,
        },
      },
    });

    expect(
      wrapper.get('[data-testid="head-actions-column-visibility-checkbox-status"]').attributes(),
    ).toHaveProperty('disabled');
    expect(
      wrapper
        .get('[data-testid="head-actions-column-visibility-checkbox-name"]')
        .attributes('disabled'),
    ).toBeUndefined();
  });

  it('does not render column visibility trigger when canHideColumns is false', () => {
    const wrapper = mount(TableHeadActionsColumn, {
      props: {
        columns: [
          { key: 'name', label: 'Nazwa', visible: true },
          { key: 'status', label: 'Status', visible: true },
          { key: 'city', label: 'Miasto', visible: true },
          { key: 'owners', label: 'Opiekunowie', visible: true },
        ],
        dataTestId: 'head-actions',
      },
      global: {
        stubs: {
          PopoverOverlayer: PopoverOverlayerStub,
          SvgIcon: SvgIconStub,
        },
      },
    });

    expect(wrapper.find('[data-testid="head-actions-column-visibility-trigger"]').exists()).toBe(
      false,
    );
  });

  it('does not interpret HTML from column labels in the visibility menu', () => {
    const wrapper = mount(TableHeadActionsColumn, {
      props: {
        canHideColumns: true,
        columns: [
          { key: 'name', label: '<img src=x onerror="alert(1)">Name', visible: true },
          { key: 'status', label: 'Status', visible: true },
          { key: 'city', label: 'City', visible: true },
          { key: 'owners', label: 'Owners', visible: true },
        ],
      },
      global: { stubs: { PopoverOverlayer: PopoverOverlayerStub, SvgIcon: SvgIconStub } },
    });

    const label = wrapper.get('.peaui-table-list__head-actions-option-label');
    expect(label.text()).toBe('Name');
    expect(label.find('img').exists()).toBe(false);
  });
});
