import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it } from 'vitest';

import StepperColumn from './StepperColumn.vue';

const ProgressIndicatorStub = defineComponent({
  name: 'ProgressIndicator',
  setup() {
    return () => h('div', { 'data-testid': 'progress-indicator' });
  },
});

const SvgIconStub = defineComponent({
  name: 'SvgIcon',
  props: {
    class: {
      type: [String, Array, Object],
      default: undefined,
    },
  },
  setup(props) {
    return () => h('span', { class: props.class, 'data-testid': 'stepper-icon' });
  },
});

const InfoTooltipStub = defineComponent({
  name: 'InfoTooltip',
  setup(_, { slots }) {
    return () => h('div', slots.default?.());
  },
});

function factory(
  isExpanded: boolean,
  steps: Array<Record<string, any>> = [
    {
      key: 'verification',
      label: 'Weryfikacja',
      status: 'current',
      collapse: {
        activeElements: 1,
        count: 3,
      },
    },
  ],
) {
  return mount(StepperColumn, {
    props: {
      isExpanded,
      column: {
        key: 'workflow',
        label: 'Workflow',
        type: 'stepper',
        steps: () => steps,
      },
      record: {
        id: '1',
      },
    },
    global: {
      stubs: {
        InfoTooltip: InfoTooltipStub,
        ProgressIndicator: ProgressIndicatorStub,
        SvgIcon: SvgIconStub,
      },
    },
  });
}

describe('StepperColumn.vue', () => {
  it('renders collapsed arrow when row is not expanded', () => {
    const wrapper = factory(false);

    expect(wrapper.get('.peaui-table-list__stepper-arrow').classes()).toContain(
      'peaui-table-list__stepper-arrow--collapsed',
    );
  });

  it('renders expanded arrow when row is expanded', () => {
    const wrapper = factory(true);

    expect(wrapper.get('.peaui-table-list__stepper-arrow').classes()).toContain(
      'peaui-table-list__stepper-arrow--expanded',
    );
  });

  it('adds separate modifier to step marked as separate', () => {
    const wrapper = factory(false, [
      {
        key: 'draft',
        label: 'Roboczy',
        status: 'complete',
      },
      {
        key: 'publication',
        label: 'Publikacja',
        isSeparate: true,
        status: 'current',
      },
    ]);

    expect(wrapper.get('[data-testid="publication"]').classes()).toContain(
      'peaui-table-list__stepper-button--separate',
    );
    expect(wrapper.get('[data-testid="draft"]').classes()).toContain(
      'peaui-table-list__stepper-button--last',
    );
    expect(wrapper.get('[data-testid="draft"]').classes()).not.toContain(
      'peaui-table-list__stepper-button--separate',
    );
    expect(wrapper.get('.peaui-table-list__stepper-separator').text()).toBe('|');
    expect(wrapper.get('.peaui-table-list__stepper-separator').attributes('aria-hidden')).toBe(
      'true',
    );
    expect(wrapper.get('.peaui-table-list__stepper-separator').attributes('role')).toBe(
      'presentation',
    );
  });

  it('does not render duplicated ids for repeated step labels', () => {
    const wrapper = mount(
      defineComponent({
        components: {
          StepperColumn,
        },
        data() {
          return {
            column: {
              key: 'workflow',
              label: 'Workflow',
              type: 'stepper',
              steps: () => [
                {
                  key: 'verification',
                  label: 'Weryfikacja',
                  status: 'current',
                },
              ],
            },
          };
        },
        template: `
          <table>
            <tbody>
              <tr>
                <StepperColumn :column="column" :record="{ id: '1' }" :is-expanded="false" />
              </tr>
              <tr>
                <StepperColumn :column="column" :record="{ id: '2' }" :is-expanded="false" />
              </tr>
            </tbody>
          </table>
        `,
      }),
      {
        global: {
          stubs: {
            InfoTooltip: InfoTooltipStub,
            ProgressIndicator: ProgressIndicatorStub,
            SvgIcon: SvgIconStub,
          },
        },
      },
    );

    const buttons = wrapper.findAll('[data-testid="verification"]');

    expect(buttons).toHaveLength(2);
    expect(buttons[0].attributes('id')).toBeUndefined();
    expect(buttons[1].attributes('id')).toBeUndefined();
  });
});
