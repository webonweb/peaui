import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it } from 'vitest';

import ExpandableColumn from './ExpandableColumn.vue';

const SvgIconStub = defineComponent({
  name: 'SvgIcon',
  props: {
    class: {
      type: [String, Array, Object],
      default: undefined,
    },
    name: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return () => h('span', { class: props.class, 'data-icon-name': props.name });
  },
});

function factory(isExpanded = false) {
  return mount(ExpandableColumn, {
    props: {
      column: {
        key: 'workflowStatus',
        label: 'Status',
        type: 'expandable',
      },
      isExpanded,
      record: {
        id: '1',
      },
      value: 'Do weryfikacji',
    },
    global: {
      stubs: {
        SvgIcon: SvgIconStub,
      },
    },
  });
}

describe('ExpandableColumn.vue', () => {
  it('renders value and collapsed arrow by default', () => {
    const wrapper = factory(false);

    expect(wrapper.text()).toContain('Do weryfikacji');
    expect(wrapper.get('button').attributes('aria-expanded')).toBe('false');
    expect(wrapper.get('button').attributes('aria-label')).toBe(
      'Do weryfikacji. Rozwin dodatkowy wiersz',
    );
    expect(wrapper.get('.peaui-table-list__expandable-arrow').classes()).toContain(
      'peaui-table-list__expandable-arrow--collapsed',
    );
  });

  it('renders expanded arrow when row is expanded', () => {
    const wrapper = factory(true);

    expect(wrapper.get('button').attributes('aria-expanded')).toBe('true');
    expect(wrapper.get('button').attributes('aria-label')).toBe(
      'Do weryfikacji. Zwin dodatkowy wiersz',
    );
    expect(wrapper.get('.peaui-table-list__expandable-arrow').classes()).toContain(
      'peaui-table-list__expandable-arrow--expanded',
    );
  });

  it('emits record id when toggle button is clicked', async () => {
    const wrapper = factory(false);

    await wrapper.get('button').trigger('click');

    expect(wrapper.emitted('on:click')).toEqual([['1']]);
  });
});
