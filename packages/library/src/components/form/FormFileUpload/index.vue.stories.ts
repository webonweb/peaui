import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import FormFileUploadComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';

const { getSettings } = useSettingsStorie();

const meta: Meta<typeof FormFileUploadComponent> = {
  title: '5. Form/FormFileUpload',
  component: FormFileUploadComponent,
  parameters: {
    name: 'FormFileUpload',
    description:
      'Komponent do przesylania pojedynczego zdjecia z podgladem, walidacja formatu i rozmiaru oraz stanem wymaganym.',
    code: `
<script lang="ts" setup>
  import FormFileUpload from "@peaui/ui/form/FormFileUpload";
  import { ref } from "vue";

  const file = ref();
</script>

<template>
  <FormFileUpload
    v-model:file="file"
    dataTestId="form-file-upload"
  />
</template>
    `,
  },
  argTypes: {
    file: {
      control: { type: 'object' },
      description: 'Model zdjecia przekazywany przez v-model:file.',
      table: {
        type: {
          summary: '{ file: File; image: string } | undefined',
        },
      },
    },
    allowedTypes: {
      control: { type: 'object' },
      description: 'Dozwolone typy MIME dla zdjecia.',
      table: {
        type: { summary: 'string[] | undefined' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Blokuje mozliwosc wgrywania i usuwania zdjecia.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: 'false' },
      },
    },
    maxFileSize: {
      control: { type: 'number' },
      description: 'Maksymalny rozmiar zdjecia w bajtach.',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: '5242880' },
      },
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'danger'],
      description: 'Wariant wizualny pola uploadu.',
      table: {
        type: { summary: "'primary' | 'danger' | undefined" },
        defaultValue: { summary: 'primary' },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Bazowy data-testid komponentu.',
      table: {
        type: { summary: 'string | undefined' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof FormFileUploadComponent>;

export const FormFileUpload: Story = {
  render: (args) => ({
    components: { FormFileUploadComponent, StoryContent },
    setup() {
      return { args, settings: getSettings(meta) };
    },
    template: `
      <StoryContent :settings="settings">
        <div style="width: 100%; max-width: 40rem;">
          <FormFileUploadComponent v-bind="args" v-model:file="args.file" />
        </div>
      </StoryContent>
    `,
  }),
  args: {
    file: undefined,
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    disabled: false,
    maxFileSize: 5 * 1024 * 1024,
    variant: 'primary',
    dataTestId: 'form-file-upload',
  },
};

export const WithPreview: Story = {
  render: FormFileUpload.render,
  args: {
    file: {
      file: new File([''], 'photo.png', { type: 'image/png' }),
      image: 'https://images.freeimages.com/slides/4f53a54c6e114a76a99b9df9573a8259.webp',
    },
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    disabled: false,
    maxFileSize: 5 * 1024 * 1024,
    variant: 'primary',
    dataTestId: 'form-file-upload-preview',
  },
};

export const Danger: Story = {
  render: FormFileUpload.render,
  args: {
    file: undefined,
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    disabled: false,
    maxFileSize: 5 * 1024 * 1024,
    variant: 'danger',
    dataTestId: 'form-file-upload-danger',
  },
};

export const LegacyFileModel: Story = { args: { valueMode: 'file' } };
