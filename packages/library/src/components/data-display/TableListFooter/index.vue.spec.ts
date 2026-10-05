import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';

import Component from './index.vue';

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

const GridWrapperStub = defineComponent({
  name: 'GridWrapper',
  props: {
    columns: Number,
    isFlex: Boolean,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          'data-columns': String(props.columns ?? 0),
          'data-is-flex': String(props.isFlex ?? false),
        },
        slots.default?.(),
      );
  },
});

const PaginationControlStub = defineComponent({
  name: 'PaginationControl',
  props: {
    page: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
    ariaLabel: {
      type: String,
      required: true,
    },
    dataTestId: String,
  },
  emits: ['update:page'],
  setup(props, { emit, attrs }) {
    return () =>
      h(
        'button',
        {
          ...attrs,
          type: 'button',
          'data-testid': props.dataTestId,
          'data-page': String(props.page),
          'data-total-pages': String(props.totalPages),
          'data-aria-label': props.ariaLabel,
          onClick: () => emit('update:page', props.page + 1),
        },
        'pagination',
      );
  },
});

const PageSizeControlStub = defineComponent({
  name: 'PageSizeControl',
  props: {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    limit: {
      type: Number,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    dataTestId: String,
  },
  emits: ['update:limit'],
  setup(props, { emit, attrs, slots }) {
    return () =>
      h(
        'button',
        {
          ...attrs,
          type: 'button',
          'data-testid': props.dataTestId,
          'data-id': props.id,
          'data-label': props.label,
          'data-limit': String(props.limit),
          'data-position': props.position,
          onClick: () => emit('update:limit', props.limit + 15),
        },
        slots.default?.() ?? props.label,
      );
  },
});

function factory(props?: Partial<InstanceType<typeof Component>['$props']>) {
  return mount(Component, {
    props: {
      rowsNumber: 91,
      rowsPerPage: 10,
      page: 3,
      total: 10,
      dataTestId: 'table-list-footer',
      ...props,
    } as never,
    attrs: {
      id: 'footer-root',
      'data-qa': 'table-footer',
    },
    global: {
      stubs: {
        GridWrapper: GridWrapperStub,
        PaginationControl: PaginationControlStub,
        PageSizeControl: PageSizeControlStub,
      },
    },
  });
}

describe('TableListFooter (index.vue)', () => {
  it('renders root semantics, attrs and summary status', () => {
    const wrapper = factory();

    const root = wrapper.get('[data-testid="table-list-footer"]');
    const summary = wrapper.get('[data-testid="table-list-footer-summary"]');

    expect(root.classes()).toContain('peaui-table-list-footer');
    expect(root.attributes('role')).toBe('group');
    expect(root.attributes('aria-label')).toBe('Stopka listy tabeli');
    expect(root.attributes('aria-describedby')).toBe(summary.attributes('id'));
    expect(root.attributes('data-current-page')).toBe('3');
    expect(root.attributes('data-total-pages')).toBe('10');
    expect(root.attributes('id')).toBe('footer-root');
    expect(root.attributes('data-qa')).toBe('table-footer');
    expect(summary.text()).toContain('Wyświetlane: 21-30 / 91');
    expect(summary.attributes('role')).toBe('status');
    expect(summary.attributes('aria-live')).toBe('polite');
  });

  it('generates unique summary ids for multiple footer instances with the same pagination', () => {
    const HostComponent = defineComponent({
      components: { Component },
      template: `
        <div>
          <Component :rowsNumber="91" :rowsPerPage="10" :page="3" :total="10" dataTestId="footer-first" />
          <Component :rowsNumber="91" :rowsPerPage="10" :page="3" :total="10" dataTestId="footer-second" />
        </div>
      `,
    });

    const wrapper = mount(HostComponent, {
      global: {
        stubs: {
          GridWrapper: GridWrapperStub,
          PaginationControl: PaginationControlStub,
          PageSizeControl: PageSizeControlStub,
        },
      },
    });

    expect(wrapper.get('[data-testid="footer-first-summary"]').attributes('id')).not.toBe(
      wrapper.get('[data-testid="footer-second-summary"]').attributes('id'),
    );
  });

  it('renders top pagination and page size control with test ids', () => {
    const wrapper = factory();

    const pagination = wrapper.get('[data-testid="table-list-footer-pagination"]');
    const limit = wrapper.get('[data-testid="table-list-footer-limit"]');

    expect(pagination.attributes('data-page')).toBe('3');
    expect(pagination.attributes('data-total-pages')).toBe('10');
    expect(pagination.attributes('data-aria-label')).toBe('Stronicowanie listy');
    expect(limit.attributes('data-id')).toContain('table-list-footer-limit-');
    expect(limit.attributes('data-label')).toBe('Ilosc rekordow na stronie listy');
    expect(limit.attributes('data-limit')).toBe('10');
    expect(limit.attributes('data-position')).toBe('top');
    expect(limit.text()).toBe('Pokaż na stronie');
  });

  it('passes unique page size control ids for multiple footer instances', () => {
    const HostComponent = defineComponent({
      components: { Component },
      template: `
        <div>
          <Component :rowsNumber="91" :rowsPerPage="10" :page="3" :total="10" dataTestId="footer-first" />
          <Component :rowsNumber="91" :rowsPerPage="10" :page="3" :total="10" dataTestId="footer-second" />
        </div>
      `,
    });

    const wrapper = mount(HostComponent, {
      global: {
        stubs: {
          GridWrapper: GridWrapperStub,
          PaginationControl: PaginationControlStub,
          PageSizeControl: PageSizeControlStub,
        },
      },
    });

    expect(wrapper.get('[data-testid="footer-first-limit"]').attributes('data-id')).not.toBe(
      wrapper.get('[data-testid="footer-second-limit"]').attributes('data-id'),
    );
  });

  it('emits legacy footer events when nested controls update values', async () => {
    const wrapper = factory({ page: 2, rowsPerPage: 25 });

    await wrapper.get('[data-testid="table-list-footer-pagination"]').trigger('click');
    await wrapper.get('[data-testid="table-list-footer-limit"]').trigger('click');

    expect(wrapper.emitted('on:change:page')).toEqual([[3]]);
    expect(wrapper.emitted('on:change:limit')).toEqual([[40]]);
  });

  it('renders placeholder and under pagination when under variant is enabled', () => {
    const wrapper = factory({ under: true, page: 4 });

    expect(wrapper.find('[data-testid="table-list-footer-pagination"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="table-list-footer-placeholder"]').exists()).toBe(true);

    const underPagination = wrapper.get('[data-testid="table-list-footer-pagination-under"]');
    expect(underPagination.classes()).toContain('peaui-table-list-footer__pagination--under');
    expect(underPagination.attributes('data-page')).toBe('4');
  });

  it('hides pagination when there is only one page and applies flex modifier', () => {
    const wrapper = factory({
      rowsNumber: 8,
      rowsPerPage: 10,
      total: 8,
      isFlex: true,
    });

    expect(wrapper.get('[data-testid="table-list-footer"]').classes()).toContain(
      'peaui-table-list-footer--flex',
    );
    expect(wrapper.find('[data-testid="table-list-footer-pagination"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="table-list-footer-placeholder"]').exists()).toBe(true);
  });

  it('does not render footer when rowsNumber is zero', () => {
    const wrapper = factory({ rowsNumber: 0, total: 0 });
    expect(wrapper.find('[data-testid="table-list-footer"]').exists()).toBe(false);
  });
});
