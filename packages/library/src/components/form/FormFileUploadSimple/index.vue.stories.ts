import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import FormFileUploadSimpleComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';

const { getSettings } = useSettingsStorie();

const meta: Meta<typeof FormFileUploadSimpleComponent> = {
  title: '5. Form/FormFileUploadSimple',
  component: FormFileUploadSimpleComponent,
  parameters: {
    name: 'FormFileUploadSimple',
    description:
      'Komponent do przesylania wielu plikow z walidacja typu i rozmiaru oraz lista dodanych elementow.',
    code: `
<script lang="ts" setup>
  import FormFileUploadSimple from "@peaui/ui/form/FormFileUploadSimple";
  import { ref } from "vue";

  const files = ref<File[]>([]);
</script>

<template>
  <FormFileUploadSimple
    v-model:files="files"
    dataTestId="form-file-upload-simple"
  />
</template>
    `,
  },
  argTypes: {
    files: {
      control: { type: 'object' },
      description: 'Lista plikow przekazywana przez v-model:files.',
      table: {
        type: { summary: 'File[]' },
      },
    },
    allowedTypes: {
      control: { type: 'object' },
      description: 'Dozwolone typy MIME.',
      table: {
        type: { summary: 'string[] | undefined' },
      },
    },
    context: {
      control: { type: 'text' },
      description: 'Opcjonalny kontekst dopisywany do nowych plikow.',
      table: {
        type: { summary: 'string | undefined' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Blokuje dodawanie nowych plikow.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: 'false' },
      },
    },
    maxFileSize: {
      control: { type: 'number' },
      description: 'Maksymalny rozmiar pojedynczego pliku w bajtach.',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: '5242880' },
      },
    },
    maxFiles: {
      control: { type: 'number' },
      description: 'Maksymalna liczba plikow dopuszczona przez komponent.',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: '4' },
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

type Story = StoryObj<typeof FormFileUploadSimpleComponent>;

export const FormFileUploadSimple: Story = {
  render: (args) => ({
    components: { FormFileUploadSimpleComponent, StoryContent },
    setup() {
      return { args, settings: getSettings(meta) };
    },
    template: `
      <StoryContent :settings="settings">
        <div style="width: 100%; max-width: 40rem;">
          <FormFileUploadSimpleComponent v-bind="args" v-model:files="args.files" />
        </div>
      </StoryContent>
    `,
  }),
  args: {
    files: [],
    allowedTypes: [
      'application/msword',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ],
    context: undefined,
    disabled: false,
    maxFileSize: 5 * 1024 * 1024,
    maxFiles: 4,
    dataTestId: 'form-file-upload-simple',
  },
};

export const WithFiles: Story = {
  render: FormFileUploadSimple.render,
  args: {
    files: [
      new File(['document'], 'zalacznik.pdf', { type: 'application/pdf' }),
      new File(['photo'], 'zdjecie.png', { type: 'image/png' }),
    ],
    allowedTypes: [
      'application/msword',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ],
    context: 'attachments',
    disabled: false,
    maxFileSize: 5 * 1024 * 1024,
    maxFiles: 4,
    dataTestId: 'form-file-upload-simple-filled',
  },
};

export const Disabled: Story = {
  render: FormFileUploadSimple.render,
  args: {
    files: [new File(['document'], 'zalacznik.pdf', { type: 'application/pdf' })],
    allowedTypes: [
      'application/msword',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ],
    context: undefined,
    disabled: true,
    maxFileSize: 5 * 1024 * 1024,
    maxFiles: 4,
    dataTestId: 'form-file-upload-simple-disabled',
  },
};
