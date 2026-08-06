import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it } from 'vitest';

import TagColumn from './TagColumn.vue';

const TagChipStub = defineComponent({
  name: 'TagChip',
  props: {
    label: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: undefined,
    },
    variant: {
      type: String,
      default: undefined,
    },
  },
  setup(props) {
    return () =>
      h('span', {
        'data-label': props.label,
        'data-size': props.size,
        'data-variant': props.variant,
      });
  },
});

describe('TagColumn.vue', () => {
  it('uses statusDictionary passed from the column definition for tag variants', () => {
    const wrapper = mount(TagColumn, {
      props: {
        column: {
          key: 'workflowStatus',
          label: 'Status procesu',
          statusDictionary: {
            Roboczy: 'orange',
            Zatwierdzony: 'green',
          },
          type: 'tag',
        },
        value: 'Roboczy',
      },
      global: {
        stubs: {
          TagChip: TagChipStub,
        },
      },
    });

    const tag = wrapper.get('span');

    expect(tag.attributes('data-label')).toBe('Roboczy');
    expect(tag.attributes('data-size')).toBe('xs');
    expect(tag.attributes('data-variant')).toBe('orange');
  });

  it('falls back to green when the column does not provide a statusDictionary', () => {
    const wrapper = mount(TagColumn, {
      props: {
        column: {
          key: 'workflowStatus',
          label: 'Status procesu',
          type: 'tag',
        },
        value: 'Dowolny status',
      },
      global: {
        stubs: {
          TagChip: TagChipStub,
        },
      },
    });

    expect(wrapper.get('span').attributes('data-variant')).toBe('green');
  });

  it('falls back to green when the dictionary does not include the current status', () => {
    const wrapper = mount(TagColumn, {
      props: {
        column: {
          key: 'workflowStatus',
          label: 'Status procesu',
          statusDictionary: {
            Roboczy: 'orange',
          },
          type: 'tag',
        },
        value: 'Nieznany status',
      },
      global: {
        stubs: {
          TagChip: TagChipStub,
        },
      },
    });

    expect(wrapper.get('span').attributes('data-variant')).toBe('green');
  });
});
