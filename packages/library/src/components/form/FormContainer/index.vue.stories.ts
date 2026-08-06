import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import FormContainerComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
const { getSettings } = useSettingsStorie();

const meta: Meta<typeof FormContainerComponent> = {
  title: '5. Form/FormContainer',
  component: FormContainerComponent,
  parameters: {
    name: 'FormContainer',
    description: 'Kontener formularza z opcjonalnym labelem i akcjami.',
    code: `
<script lang="ts" setup>
  import FormContainer from "@peaui/ui/form/FormContainer";
</script>

<template>
  <FormContainer
    label="Dane formularza"
    submitButtonLabel="Zapisz"
    cancelButtonLabel="Wroc"
    sizeButton="xs"
    :showActions="true"
    :disabled="false"
    :isLoading="false"
    dataTestId="form-container"
  >
    <div>Content</div>

    <template #additional-before>
      <div>Additional before</div>
    </template>

    <template #additional-after>
      <div>Additional after</div>
    </template>
  </FormContainer>
</template>
    `,
  },
  argTypes: {
    actionsPosition: {
      control: { type: 'select' },
      options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      description: 'Pozycja przycisków akcji dla formularza.',
      table: {
        type: {
          summary: "'top-left' | 'top-right' | 'bottom-left' |  'bottom-right'",
        },
        defaultValue: { summary: 'bottom-left' },
      },
    },
    label: {
      control: { type: 'text' },
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    submitButtonLabel: {
      control: { type: 'text' },
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    cancelButtonLabel: {
      control: { type: 'text' },
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: 'Anuluj' },
      },
    },
    showActions: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: 'true' },
      },
    },
    showCancelButton: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: 'true' },
      },
    },
    sizeButton: {
      control: { type: 'select' },
      options: ['xxs', 'xs', 's', 'm', 'l'],
      table: {
        type: { summary: "'xxs' | 'xs' | 's' | 'm' | 'l'" },
        defaultValue: { summary: 'xs' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: 'false' },
      },
    },
    isLoading: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: 'false' },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof FormContainerComponent>;

export const FormContainer: Story = {
  render: (args) => ({
    components: { FormContainerComponent, StoryContent },
    setup() {
      return { args, settings: getSettings(meta) };
    },
    template: `
      <StoryContent :settings>
        <FormContainerComponent v-bind="args">
          <div>Content</div>

          <template #additional-before>
            <div>Additional</div>
          </template>
          <template #additional-after>
            <div>Additional</div>
          </template>
        </FormContainerComponent>
      </StoryContent>
    `,
  }),
  args: {
    label: 'Dane formularza',
    submitButtonLabel: 'Zapisz',
    cancelButtonLabel: 'Anuluj',
    sizeButton: 'xs',
    showActions: true,
    disabled: false,
    isLoading: false,
    dataTestId: 'form-container',
  },
};

export const CustomCancelLabel: Story = {
  ...FormContainer,
  args: {
    ...FormContainer.args,
    cancelButtonLabel: 'Wroc do listy',
  },
};

export const LargeButtons: Story = {
  ...FormContainer,
  args: {
    ...FormContainer.args,
    sizeButton: 'm',
  },
};
