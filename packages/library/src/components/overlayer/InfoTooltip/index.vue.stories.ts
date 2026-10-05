import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import InfoTooltipComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
const { getSettings } = useSettingsStorie();

type Variant = 'default' | 'disabled';

const meta: Meta<typeof InfoTooltipComponent> = {
  title: '8. Overlayer/InfoTooltip',
  component: InfoTooltipComponent,
  parameters: {
    name: 'InfoTooltip',
    description:
      'Komponent InfoTooltip służy do wyświetlania podpowiedzi kontekstowej (tooltip). ' +
      'Pozycjonowanie ustawiasz przez prop `placement`. Treść jest dostarczana przez sloty: ' +
      'domyślny slot to trigger, a `title` i `description` to zawartość tooltipa. ' +
      'Arrow (triangle) jest dekoracyjny i ma `aria-hidden="true"`.',
    code: `
<script lang="ts" setup>
  import InfoTooltip from "@peaui/ui/overlayer/InfoTooltip";
</script>

<template>
  <InfoTooltip placement="top" dataTestId="info-tooltip">
    <button type="button">Hover / focus</button>

    <template #title>Informacja</template>
    <template #description>To jest przykładowa treść tooltipa.</template>
  </InfoTooltip>
</template>
    `,
  },
  argTypes: {
    placement: {
      control: { type: 'select' },
      options: [
        'top',
        'right',
        'bottom',
        'left',
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
      ],
      description: 'Pozycja tooltipa względem triggera.',
      table: {
        type: {
          summary:
            "'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
        },
        defaultValue: { summary: 'top' },
      },
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'disabled'] satisfies Variant[],
      description: 'Wariant wizualny tooltipa.',
      table: {
        type: { summary: "'default' | 'disabled'" },
        defaultValue: { summary: 'default' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Wyłącza pokazywanie tooltipa i automatyczne zachowania interaktywne.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    dataTestId: {
      control: { type: 'text' },
      description:
        'Bazowe data-test-id; komponent dopina sufiksy -content/-tooltip/-title/-description.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof InfoTooltipComponent>;

const renderStory = (args: InstanceType<typeof InfoTooltipComponent>['$props']) => ({
  components: { StoryContent, InfoTooltipComponent },
  setup() {
    const settings = getSettings(meta);
    return { args, settings };
  },
  template: `
      <StoryContent :settings>
        <InfoTooltipComponent v-bind="args">
          Lorem ipsum

          <template #title>
            Lorem ipsum
          </template>

          <template #description>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ac nulla et ligula elementum viverra. Phasellus ultricies lectus eu accumsan convallis. 
          </template>
        </InfoTooltipComponent>
      </StoryContent>
    `,
});

/**
 * Bazowy przykład – najczęściej używany.
 */
export const InfoTooltip: Story = {
  render: renderStory,
  args: {
    placement: 'top',
    variant: 'default',
    disabled: false,
    dataTestId: 'info-tooltip',
  },
};

export const DisabledVariant: Story = {
  render: renderStory,
  args: {
    placement: 'top',
    variant: 'disabled',
    disabled: false,
    dataTestId: 'info-tooltip-disabled',
  },
};

export const DisabledInteraction: Story = {
  render: renderStory,
  args: {
    placement: 'top',
    variant: 'default',
    disabled: true,
    dataTestId: 'info-tooltip-disabled-interaction',
  },
};
