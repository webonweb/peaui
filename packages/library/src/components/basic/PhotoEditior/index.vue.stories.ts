import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import PhotoEditiorComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
const { getSettings } = useSettingsStorie();

const meta: Meta<typeof PhotoEditiorComponent> = {
  title: '1. Basic/PhotoEditior',
  component: PhotoEditiorComponent,
  parameters: {
    name: 'PhotoEditior',
    description:
      'Komponent do kadrowania zdjecia oparty o vue-advanced-cropper, z obrotem, suwakami ustawien i akcjami zapisu.',
    code: `
<script lang="ts" setup>
  import PhotoEditior from "@peaui/ui/basic/PhotoEditior";

  const image = {
    file: new File([''], 'photo.png', { type: 'image/png' }),
    image: 'https://images.freeimages.com/slides/4f53a54c6e114a76a99b9df9573a8259.webp',
  };
</script>

<template>
  <PhotoEditior :image="image" />
</template>
    `,
  },
  argTypes: {
    image: {
      control: { type: 'object' },
      description: 'Model zdjecia przekazywany przez v-model:image.',
      table: {
        type: {
          summary: '{ file: File; image: string } | undefined',
        },
      },
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Aria-label dla calego edytora.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: 'Edytor zdjęcia' },
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

type Story = StoryObj<typeof PhotoEditiorComponent>;

export const PhotoEditior: Story = {
  render: (args) => ({
    components: { PhotoEditiorComponent, StoryContent },
    setup() {
      return {
        args,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings="settings">
        <div style="width: 100%; max-width: 56rem;">
          <PhotoEditiorComponent v-bind="args" />
        </div>
      </StoryContent>
    `,
  }),
  args: {
    ariaLabel: 'Edytor zdjęcia',
    dataTestId: 'photo-editor',
    image: {
      file: new File([''], 'photo.png', { type: 'image/png' }),
      image: 'https://images.freeimages.com/slides/4f53a54c6e114a76a99b9df9573a8259.webp',
    },
  },
};
