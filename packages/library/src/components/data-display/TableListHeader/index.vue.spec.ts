import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import Component from './index.vue';

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

const SearchInputStub = defineComponent({
  name: 'SearchInput',
  props: {
    dataTestId: String,
    placeholder: String,
    ariaLabel: String,
  },
  emits: ['on:search'],
  setup(props, { emit, attrs }) {
    return () =>
      h(
        'button',
        {
          ...attrs,
          type: 'button',
          'data-testid': props.dataTestId,
          'data-placeholder': props.placeholder,
          'data-aria-label': props.ariaLabel,
          onClick: () => emit('on:search', 'raport'),
        },
        'search',
      );
  },
});

const ButtonActionStub = defineComponent({
  name: 'ButtonAction',
  props: {
    dataTestId: String,
    ariaLabel: String,
  },
  emits: ['click', 'keyup'],
  setup(props, { emit, attrs, slots }) {
    return () =>
      h(
        'button',
        {
          ...attrs,
          type: 'button',
          'data-testid': props.dataTestId,
          'data-aria-label': props.ariaLabel,
          onClick: (event: Event) => emit('click', event),
          onKeyup: (event: KeyboardEvent) => emit('keyup', event),
        },
        slots.default?.(),
      );
  },
});

const ButtonExportStub = defineComponent({
  name: 'ButtonExport',
  props: {
    dataTestId: String,
    ariaLabel: String,
    disabled: Boolean,
    selectedItemsCount: Number,
    forceExport: Boolean,
  },
  emits: ['on:export'],
  setup(props, { emit, attrs, slots }) {
    return () =>
      h(
        'button',
        {
          ...attrs,
          type: 'button',
          disabled: props.disabled,
          'data-testid': props.dataTestId,
          'data-aria-label': props.ariaLabel,
          'data-selected-items-count': String(props.selectedItemsCount ?? 0),
          'data-force-export': String(props.forceExport ?? false),
          onClick: () => emit('on:export', 'csv'),
        },
        slots.default?.(),
      );
  },
});

const CounterBadgeStub = defineComponent({
  name: 'CounterBadge',
  props: {
    dataTestId: String,
    value: Number,
  },
  setup(props, { attrs }) {
    return () =>
      h('span', {
        ...attrs,
        'data-testid': props.dataTestId,
        'data-value': String(props.value ?? 0),
      });
  },
});

const DrawerPanelStub = defineComponent({
  name: 'DrawerPanel',
  props: {
    open: Boolean,
    dataTestId: String,
    ariaLabel: String,
  },
  emits: ['update:open'],
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          'data-testid': props.dataTestId,
          'data-open': String(props.open),
          'data-aria-label': props.ariaLabel,
        },
        slots.default?.(),
      );
  },
});

const SvgIconStub = defineComponent({
  name: 'SvgIcon',
  props: {
    name: String,
  },
  setup(props, { attrs }) {
    return () =>
      h('span', {
        ...attrs,
        'data-icon-name': props.name,
      });
  },
});

function factory(props?: Partial<InstanceType<typeof Component>['$props']>) {
  return mountComponent(props);
}

function mountComponent(
  props?: Partial<InstanceType<typeof Component>['$props']>,
  slots?: Parameters<typeof mount<typeof Component>>[0]['slots'],
) {
  let wrapper: ReturnType<typeof mount<typeof Component>>;
  const mergedSlots = {
    'filters-drawer': ({ open }: { open: boolean }) =>
      h('div', { 'data-testid': 'filters-slot' }, `drawer-${String(open)}`),
    'additional-buttons': () => h('div', { 'data-testid': 'extra-button' }, 'extra'),
    'addtional-content': () => h('div', { 'data-testid': 'extra-content' }, 'content'),
    'addtional-description': () => h('div', { 'data-testid': 'extra-description' }, 'description'),
    ...slots,
  };

  for (const [slotName, slotValue] of Object.entries(mergedSlots)) {
    if (slotValue === undefined) {
      delete mergedSlots[slotName as keyof typeof mergedSlots];
    }
  }

  wrapper = mount(Component, {
    props: {
      canCreate: true,
      canExport: true,
      canFilter: true,
      canSearch: true,
      countFilters: 2,
      countSelectedRecords: 3,
      totalRecords: 18,
      filtersOpen: false,
      'onUpdate:filtersOpen': async (value: boolean) => {
        await wrapper.setProps({ filtersOpen: value });
      },
      ...props,
    } as never,
    slots: mergedSlots,
    global: {
      stubs: {
        SearchInput: SearchInputStub,
        ButtonAction: ButtonActionStub,
        ButtonExport: ButtonExportStub,
        CounterBadge: CounterBadgeStub,
        DrawerPanel: DrawerPanelStub,
        SvgIcon: SvgIconStub,
      },
    },
  });

  return wrapper;
}

describe('TableListHeader (index.vue)', () => {
  it('renders root BEM classes, data test ids and description modifier', () => {
    const wrapper = factory();

    const root = wrapper.get('[data-testid="table-list-header"]');

    expect(root.classes()).toContain('peaui-table-list-header');
    expect(root.classes()).toContain('peaui-table-list-header--with-description');
    expect(root.attributes('role')).toBe('region');
    expect(root.attributes('aria-label')).toBe('Nag\u0142\u00f3wek listy tabeli');
    expect(wrapper.get('[data-testid="table-list-header-controls"]').exists()).toBe(true);
    expect(wrapper.get('[data-testid="extra-content"]').exists()).toBe(true);
    expect(wrapper.get('[data-testid="extra-description"]').exists()).toBe(true);
  });

  it('renders search and filter controls with fixed data test ids', async () => {
    const wrapper = factory();
    const filterButton = wrapper.get('[data-testid="table-list-header-filter-button"]');

    expect(
      wrapper.get('[data-testid="table-list-header-search"]').attributes('data-placeholder'),
    ).toBe('Wpisz czego szukasz');
    expect(
      wrapper.get('[data-testid="table-list-header-filter-badge"]').attributes('data-value'),
    ).toBe('2');
    expect(filterButton.attributes('data-aria-label')).toBeUndefined();
    expect(filterButton.text()).toContain('Filtruj');

    await wrapper.get('[data-testid="table-list-header-search"]').trigger('click');
    expect(wrapper.emitted('on:search')).toEqual([['raport']]);
  });

  it('toggles drawer and emits filter reset', async () => {
    const wrapper = factory();

    await wrapper.get('[data-testid="table-list-header-filter-button"]').trigger('click');
    expect(
      wrapper.get('[data-testid="table-list-header-filters-drawer"]').attributes('data-open'),
    ).toBe('true');

    await wrapper.get('[data-testid="table-list-header-filter-reset"]').trigger('click');
    expect(wrapper.emitted('on:reset-filters')).toEqual([[]]);
  });

  it('renders create and export actions using library props', async () => {
    const wrapper = factory({ forceExport: true, countSelectedRecords: 4 });

    const createButton = wrapper.get('[data-testid="table-list-header-create"]');
    const exportButton = wrapper.get('[data-testid="table-list-header-export"]');

    expect(createButton.attributes('data-aria-label')).toBe('Dodaj rekord');
    expect(exportButton.attributes('data-aria-label')).toBe('Eksportuj rekordy listy');
    expect(exportButton.attributes('data-selected-items-count')).toBe('4');
    expect(exportButton.attributes('data-force-export')).toBe('true');

    await createButton.trigger('click');
    await exportButton.trigger('click');

    expect(wrapper.emitted('on:create')).toEqual([[]]);
    expect(wrapper.emitted('on:export')).toEqual([['csv']]);
  });

  it('keeps create button aria label aligned with custom buttonCreateLabel', () => {
    const wrapper = factory({ buttonCreateLabel: 'Dodaj wpis' });

    const createButton = wrapper.get('[data-testid="table-list-header-create"]');

    expect(createButton.attributes('data-aria-label')).toBe('Dodaj wpis');
    expect(createButton.text()).toContain('Dodaj wpis');
  });

  it('does not react to custom keyup.enter on native action buttons', async () => {
    const wrapper = factory();

    await wrapper
      .get('[data-testid="table-list-header-create"]')
      .trigger('keyup', { key: 'Enter' });

    expect(wrapper.emitted('on:create')).toBeUndefined();
  });

  it('hides optional sections when capabilities are disabled', () => {
    const wrapper = mountComponent(
      {
        canSearch: false,
        canFilter: false,
        canCreate: false,
        canExport: false,
      },
      {
        'additional-buttons': undefined,
      },
    );

    expect(rootClasses(wrapper)).toContain('peaui-table-list-header--with-description');
    expect(wrapper.find('[data-testid="table-list-header-search-area"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="table-list-header-actions"]').exists()).toBe(false);
  });
});

function rootClasses(wrapper: ReturnType<typeof mount<typeof Component>>): string[] {
  return wrapper.get('[data-testid="table-list-header"]').classes();
}
