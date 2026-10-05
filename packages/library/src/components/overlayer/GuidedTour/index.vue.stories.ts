import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';

import { guidedTourDemoSteps } from './guided-tour.demo';
import GuidedTour from './index.vue';

const { getSettings } = useSettingsStorie();
const meta: Meta<typeof GuidedTour> = {
  title: '8. Overlayer/GuidedTour',
  component: GuidedTour,
  parameters: {
    name: 'GuidedTour',
    description:
      'Kontrolowany tour aplikacji z resolverem celu, spotlightem, auto-scroll, lifecycle, focus management i strategiami dla brakujacego targetu.',
    code: `
<script setup lang="ts">
import { ref } from 'vue';
import { GuidedTour, type GuidedTourStep } from '@peaui/ui';
const open = ref(false);
const step = ref(0);
const steps: GuidedTourStep[] = [
  { id: 'search', target: '#search', title: 'Search', description: 'Find content quickly.' }
];
</script>
<template>
  <button id="search" @click="open = true">Start tour</button>
  <GuidedTour v-model:open="open" v-model:step="step" :steps="steps" />
</template>`,
  },
  argTypes: {
    mode: { control: 'select', options: ['spotlight', 'modal'] },
    cardVariant: { control: 'select', options: ['card', 'tooltip'] },
    missingTargetStrategy: { control: 'select', options: ['skip', 'block', 'close'] },
    scrollBehavior: { control: 'select', options: ['auto', 'smooth'] },
  },
};

export default meta;
type Story = StoryObj<typeof GuidedTour>;

export const NestedPopoverEscape: Story = {
  render: () => ({
    components: { GuidedTour },
    setup: () => ({ open: ref(true), steps: [{ id: 'nested', title: 'Nested popup' }] }),
    template:
      '<button type="button" @click="open = true">Start tour</button><GuidedTour v-model:open="open" mode="modal" :steps="steps"><template #content><button type="button" popovertarget="tour-nested-popup">Open nested popup</button><div id="tour-nested-popup" popover="auto"><button type="button">Nested action</button></div></template></GuidedTour>',
  }),
};

function renderTour(extraSteps = guidedTourDemoSteps) {
  return (args: InstanceType<typeof GuidedTour>['$props']) => ({
    components: { GuidedTour, StoryContent },
    setup() {
      const settings = getSettings(meta);
      const open = ref(false);
      const step = ref(0);
      return { args, settings, open, step, extraSteps };
    },
    template: `
      <StoryContent :settings>
        <div style="min-height: 24rem; display: grid; grid-template-columns: 1fr auto; gap: 2rem; align-items: start; padding: 2rem;">
          <div>
            <label for="tour-search">Search workspace</label>
            <input id="tour-search" data-tour-target="search" placeholder="Search" style="display: block; margin-top: .5rem; padding: .75rem;" />
          </div>
          <button data-tour-target="actions" type="button" @click="open = true">Start tour</button>
        </div>
        <GuidedTour
          v-bind="args"
          :steps="extraSteps"
          :open="open"
          :step="step"
          @update:open="open = $event"
          @update:step="step = $event"
        />
      </StoryContent>`,
  });
}

export const BasicTour: Story = {
  render: renderTour(),
  args: { mode: 'spotlight', allowSkip: true, showMask: true },
};
export const EdgeTargets: Story = {
  render: renderTour([
    {
      id: 'edge',
      target: '[data-tour-target="actions"]',
      title: 'Edge target',
      placement: 'right',
    },
  ]),
};
export const AsyncTarget: Story = {
  render: renderTour([
    {
      id: 'async',
      target: async () => document.querySelector<HTMLElement>('[data-tour-target="search"]'),
      title: 'Asynchronous resolver',
    },
  ]),
};
export const MissingTargetBlocked: Story = {
  render: renderTour([{ id: 'missing', target: '#missing-tour-target', title: 'Missing target' }]),
  args: { targetTimeout: 0, missingTargetStrategy: 'block' },
};
export const ModalTour: Story = {
  render: renderTour([
    { id: 'modal', title: 'Welcome', description: 'This step does not require a target.' },
  ]),
  args: { mode: 'modal' },
};
export const RequiredInteraction: Story = {
  render: renderTour([
    {
      id: 'required',
      target: '[data-tour-target="search"]',
      title: 'Required action',
      description: 'The guard blocks progression until the application allows it.',
      canAdvance: false,
    },
  ]),
};
export const ControlledProgress: Story = { render: renderTour() };
export const Mobile: Story = {
  render: renderTour(),
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
export const ReducedMotion: Story = {
  render: renderTour(),
  parameters: { reducedMotion: 'reduce' },
};
