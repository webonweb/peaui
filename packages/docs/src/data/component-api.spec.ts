import { describe, expect, it } from 'vitest';
import { generatedComponentApi } from '../generated/component-api';
import {
  generatedReactComponentApi,
  generatedWebComponentApi,
} from '../generated/framework-component-api';
import type { ComponentApi } from '../types';

function component(api: readonly ComponentApi[], name: string): ComponentApi {
  const entry = api.find((entry) => entry.name === name);
  if (!entry) throw new Error(`Missing component: ${name}`);
  return entry;
}

describe('generated component documentation', () => {
  it('documents model update events and manually declared controlled props', () => {
    expect(
      component(generatedComponentApi, 'FormInput').events.map((entry) => entry.name),
    ).toContain('update:value');
    expect(
      component(generatedComponentApi, 'CommandPalette').models.map((entry) => entry.name),
    ).toEqual(expect.arrayContaining(['open', 'query', 'activeId']));
  });

  it('reads native React render props and callbacks from their public declarations', () => {
    const palette = component(generatedReactComponentApi, 'CommandPalette');
    expect(palette.slots.map((entry) => entry.name)).toContain('renderCommand');
    expect(palette.props.map((entry) => entry.name)).toContain('defaultQuery');
    expect(palette.events.map((entry) => entry.name)).toContain('onQueryChange');
    const tour = component(generatedReactComponentApi, 'GuidedTour');
    expect(tour.slots.map((entry) => entry.name)).toContain('renderMissingTarget');
    expect(tour.events.map((entry) => entry.name)).toContain('onStepChange');
    expect(tour.props.map((entry) => entry.name)).not.toContain('defaultStep');
    expect(
      component(generatedReactComponentApi, 'FormInput').events.map((entry) => entry.name),
    ).toContain('onValueChange');
  });

  it('documents equal component coverage and framework-specific model instructions', () => {
    const names = (api: readonly ComponentApi[]) => api.map((entry) => entry.name).sort();
    expect(names(generatedReactComponentApi)).toEqual(names(generatedComponentApi));
    expect(names(generatedWebComponentApi)).toEqual(names(generatedComponentApi));
    for (const entry of generatedWebComponentApi) {
      for (const model of entry.models) expect(model.description).not.toContain('v-model');
    }
  });
});
