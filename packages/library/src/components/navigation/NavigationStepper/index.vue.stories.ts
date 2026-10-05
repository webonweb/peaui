import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import NavigationStepperComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
const { getSettings } = useSettingsStorie();

const meta: Meta<typeof NavigationStepperComponent> = {
  title: '7. Navigation/NavigationStepper',
  component: NavigationStepperComponent,
  parameters: {
    name: 'NavigationStepper',
    description:
      'Poziomy stepper nawigacyjny z przewijaniem, statusami krokow i obsluga klawiatury. Korzysta z ButtonAction i SvgIcon, a status complete pokazuje ikone progressFinish.',
    code: `
<script lang="ts" setup>
  import NavigationStepper from "@peaui/ui/navigation/NavigationStepper";

  const options = [
    {
      key: 'schedule',
      label: '1. Harmonogram uzytkowania',
      status: 'complete',
    },
    {
      key: 'ventilation',
      label: '2. Przenoszenie przez wentylacje',
      status: 'during',
    },
    {
      key: 'permeation',
      label: '3. Przenoszenie przez przenikanie',
      status: 'default',
    },
  ];
</script>

<template>
  <NavigationStepper :options="options" />
</template>
    `,
  },
  argTypes: {
    options: {
      control: { type: 'object' },
      description: 'Lista krokow steppera.',
      table: {
        type: {
          summary:
            "Array<{ key: string; label: string; number?: string; status: 'default' | 'complete' | 'during' | 'disabled' | 'hidden' }>",
        },
      },
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Aria-label dla obszaru nav.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: 'Nawigacja kroków' },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Bazowe data-testid dla komponentu.',
      table: {
        type: { summary: 'string | undefined' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof NavigationStepperComponent>;

export const NavigationStepper: Story = {
  render: (args) => ({
    components: { NavigationStepperComponent, StoryContent },
    setup() {
      return {
        args,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings="settings">
        <NavigationStepperComponent v-bind="args" />
      </StoryContent>
    `,
  }),
  args: {
    ariaLabel: 'Nawigacja kroków',
    dataTestId: 'navigation-stepper',
    options: [
      {
        key: 'schedule',
        label: '1. Harmonogram uzytkowania',
        status: 'complete',
      },
      {
        key: 'ventilation',
        label: '2. Przenoszenie przez wentylacje',
        status: 'during',
      },
      {
        key: 'permeation',
        label: '3. Przenoszenie przez przenikanie',
        status: 'default',
      },
      {
        key: 'internal-gains',
        label: '4. Zyski wewnetrzne',
        status: 'default',
      },
      {
        key: 'solar-gains',
        label: '5. Zyski sloneczne',
        status: 'disabled',
      },
      {
        key: 'summary',
        label: '6. Podsumowanie',
        status: 'hidden',
        additional: 'Krok chwilowo niedostepny',
      },
    ],
  },
};

export const RtlResizableContainer: Story = {
  render: () => ({
    components: { NavigationStepperComponent },
    setup: () => ({
      options: Array.from({ length: 8 }, (_, i) => ({
        key: `step-${i}`,
        label: `Long step ${i + 1}`,
        status: 'complete' as const,
      })),
    }),
    template:
      '<div dir="rtl" style="resize:horizontal;overflow:auto;width:24rem;max-width:100%"><NavigationStepperComponent :options="options" /></div>',
  }),
};
