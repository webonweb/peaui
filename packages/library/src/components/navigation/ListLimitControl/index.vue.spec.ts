import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import Component from './index.vue';

vi.mock('@/constants', () => ({ UIKIT_NAME: 'uikit' }));
vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

const SelectFieldStub = defineComponent({
  name: 'SelectField',
  props: {
    id: String,
    name: String,
    label: String,
    placement: String,
    value: String,
    searchable: Boolean,
    dataTestId: String,
    options: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:value'],
  setup(props, { attrs, emit }) {
    return () =>
      h('div', {
        ...attrs,
        id: props.id,
        'data-testid': props.dataTestId,
        'data-name': props.name,
        'data-value': props.value,
        'data-placement': props.placement,
        'data-searchable': String(props.searchable),
        'data-options': JSON.stringify(props.options),
        onClick: () => emit('update:value', '25'),
      });
  },
});

function factory(props?: Partial<InstanceType<typeof Component>['$props']>) {
  return mount(Component, {
    props: {
      id: 'results',
      label: 'Pokaz na stronie',
      limit: 10,
      dataTestId: 'list-limit-control',
      ...props,
    } as never,
    slots: {
      default: () => 'Pokaz na stronie',
    },
    global: {
      stubs: {
        SelectField: SelectFieldStub,
      },
    },
  });
}

describe('ListLimitControl (index.vue)', () => {
  it('renders root classes, group semantics and data test ids', () => {
    const wrapper = factory();
    const root = wrapper.get('div[data-testid="list-limit-control"]');
    const label = wrapper.get('[data-testid="list-limit-control-label"]');
    const select = wrapper.get('[data-testid="list-limit-control-select"]');

    expect(root.classes()).toContain('uikit-list-limit-control');
    expect(root.attributes('role')).toBe('group');
    expect(root.attributes('aria-labelledby')).toBe(label.attributes('id'));
    expect(label.attributes('for')).toBe('page-size-results');
    expect(select.attributes('id')).toBe('page-size-results');
  });

  it('passes non-searchable string options to SelectField', () => {
    const wrapper = factory({ limit: 25, limitList: [10, 25, 50] });
    const select = wrapper.get('[data-testid="list-limit-control-select"]');
    const options = JSON.parse(select.attributes('data-options') ?? '[]') as Array<{
      value: string;
      active: boolean;
    }>;

    expect(select.attributes('data-searchable')).toBe('false');
    expect(select.attributes('data-placement')).toBe('bottom');
    expect(select.attributes('data-value')).toBe('25');
    expect(options).toEqual([
      expect.objectContaining({ value: '10', active: false }),
      expect.objectContaining({ value: '25', active: true }),
      expect.objectContaining({ value: '50', active: false }),
    ]);
  });

  it('emits update:limit when select value changes', async () => {
    const wrapper = factory({ limit: 10 });

    await wrapper.get('[data-testid="list-limit-control-select"]').trigger('click');

    expect(wrapper.emitted('update:limit')).toEqual([[25]]);
  });

  it('uses prop label as fallback visible content when slot is not provided', () => {
    const wrapper = mount(Component, {
      props: {
        id: 'results',
        label: 'Liczba rekordow na stronie',
        limit: 10,
      } as never,
      global: {
        stubs: {
          SelectField: SelectFieldStub,
        },
      },
    });

    expect(wrapper.get('label').text()).toBe('Liczba rekordow na stronie');
  });
});
