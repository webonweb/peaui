import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';

import { getDemoPreset } from '../data/demo-presets';
import { setLocale } from '../i18n';
import GuidedTourDemoScene from './GuidedTourDemoScene.vue';

describe('GuidedTour documentation demo', () => {
  beforeEach(() => setLocale('en', false));

  it('renders all spotlight targets and emits an explicit start action', async () => {
    const wrapper = mount(GuidedTourDemoScene, {
      props: {
        backLabel: 'Previous',
        completeLabel: 'Finish',
        nextLabel: 'Continue',
        skipLabel: 'Not now',
      },
    });

    expect(wrapper.findAll('[data-guided-tour-demo]')).toHaveLength(3);
    expect(wrapper.text()).toContain('Start guided tour');
    expect(
      wrapper
        .findAll('.tour-scene__label-controls input')
        .map((input) => (input.element as HTMLInputElement).value),
    ).toEqual(['Previous', 'Continue', 'Not now', 'Finish']);

    await wrapper.get('.tour-scene__start').trigger('click');
    expect(wrapper.emitted('start')).toHaveLength(1);

    await wrapper.findAll('.tour-scene__label-controls input')[1]?.setValue('Keep going');
    expect(wrapper.emitted('labelChange')?.at(-1)).toEqual(['next', 'Keep going']);
  });

  it('provides a closed, controlled three-step preset', () => {
    const preset = getDemoPreset({
      importPath: '@peaui/ui/overlayer/GuidedTour',
      models: [],
      name: 'GuidedTour',
      props: [],
      slug: 'guided-tour',
    });

    expect(preset.props.open).toBe(false);
    expect(preset.props.step).toBe(0);
    expect(preset.props.labels).toEqual({
      back: 'Back',
      complete: 'Complete',
      next: 'Next',
      skip: 'Skip tour',
    });
    expect(preset.props.steps).toEqual([
      expect.objectContaining({ target: '[data-guided-tour-demo="navigation"]' }),
      expect.objectContaining({ target: '[data-guided-tour-demo="search"]' }),
      expect.objectContaining({ target: '[data-guided-tour-demo="profile"]' }),
    ]);
  });
});
