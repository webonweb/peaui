import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { beforeEach, describe, expect, it } from 'vitest';

import { generatedReactComponentApi } from '../generated/framework-component-api';
import { setLocale } from '../i18n';
import type { ComponentDefinition } from '../types';
import DemoCanvas from './DemoCanvas.vue';

const GuidedTourStub = defineComponent({
  name: 'GuidedTourStub',
  props: {
    open: { type: Boolean, default: false },
    step: { type: Number, default: 0 },
  },
  emits: ['update:open', 'update:step'],
  setup(props, { emit }) {
    return () =>
      h('div', [
        h('output', { 'data-testid': 'controlled-step' }, String(props.step)),
        h(
          'button',
          {
            'data-testid': 'next-step',
            onClick: () => emit('update:step', props.step + 1),
            type: 'button',
          },
          'Next',
        ),
      ]);
  },
});

const definition: ComponentDefinition = {
  category: 'overlayer',
  categoryLabel: 'Overlayer',
  component: GuidedTourStub,
  copy: { description: 'Tour', input: 'Steps', purpose: ['Guide users'] },
  events: [
    { name: 'update:open', description: 'Updates open state.' },
    { name: 'update:step', description: 'Updates active step.' },
  ],
  importPath: '@peaui/ui/overlayer/GuidedTour',
  models: [],
  name: 'GuidedTour',
  props: [
    { name: 'steps', type: 'GuidedTourStep[]', required: true, description: 'Tour steps.' },
    { name: 'open', type: 'boolean', required: false, description: 'Open state.' },
    { name: 'step', type: 'number', required: false, description: 'Active step.' },
    {
      name: 'labels',
      type: 'Partial<GuidedTourLabels>',
      required: false,
      description: 'Action labels.',
    },
  ],
  slug: 'guided-tour',
  slots: [],
};

describe('DemoCanvas controlled examples', () => {
  beforeEach(() => setLocale('en', false));

  it('writes update events back to props even when generated models are empty', async () => {
    const wrapper = mount(DemoCanvas, { props: { definition } });

    await wrapper.get('[data-testid="next-step"]').trigger('click');
    await nextTick();

    expect(wrapper.get('[data-testid="controlled-step"]').text()).toBe('1');
  });

  it('documents update:step with the native React callback name', () => {
    const guidedTour = generatedReactComponentApi.find(
      (component) => component.name === 'GuidedTour',
    );
    const eventNames = guidedTour?.events.map((event) => String(event.name)) ?? [];

    expect(eventNames).toContain('onStepChange');
    expect(eventNames).not.toContain('onUpdateStep');
  });
});
