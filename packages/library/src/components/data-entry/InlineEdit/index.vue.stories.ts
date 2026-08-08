import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import InlineEdit from './index.vue';
import { inlineEditDemoProps, inlineEditOptions } from './inline-edit.demo';

const meta = {
  title: '3. Data Entry/InlineEdit',
  component: InlineEdit,
  args: inlineEditDemoProps,
  argTypes: {
    actions: { control: 'select', options: ['buttons', 'keyboard', 'both'] },
    activation: { control: 'select', options: ['button', 'click', 'dblclick'] },
    display: { control: 'select', options: ['inline', 'block'] },
    editor: { control: 'select', options: ['text', 'number', 'select', 'textarea', 'custom'] },
    saveMode: { control: 'select', options: ['sync', 'async'] },
    tabBehavior: { control: 'select', options: ['commit', 'cancel', 'stay'] },
  },
  parameters: {
    layout: 'padded',
    name: 'InlineEdit',
    description:
      'Edycja w miejscu oparta na istniejących polach formularza i ButtonAction, z kontrolowanym szkicem, walidacją, zapisem async i pełną obsługą klawiatury.',
  },
} satisfies Meta<typeof InlineEdit>;

export default meta;
type Story = StoryObj<typeof meta>;
const { getSettings } = useSettingsStorie();

export const Text: Story = {
  render: (args) => ({
    components: { InlineEdit, StoryContent },
    setup() {
      const value = ref(args.value);
      return { args, settings: getSettings(meta), value };
    },
    template: `<StoryContent :settings><InlineEdit v-bind="args" v-model:value="value" /></StoryContent>`,
  }),
};

export const NumberEditor: Story = { args: { editor: 'number', value: 12 } };

export const SelectEditor: Story = {
  args: {
    editor: 'select',
    editorProps: { options: inlineEditOptions, searchable: false },
    value: 'review',
  },
};

export const TextareaKeyboard: Story = {
  args: { actions: 'keyboard', editor: 'textarea', value: 'Opis projektu i jego zakres.' },
};

export const Validation: Story = {
  args: {
    validate: (value: unknown) =>
      String(value).trim().length >= 3 ? true : 'Wpisz co najmniej 3 znaki.',
  },
};

export const AsyncSave: Story = {
  render: (args) => ({
    components: { InlineEdit },
    setup() {
      const value = ref(args.value);
      const editing = ref(false);
      const loading = ref(false);
      const error = ref<string>();
      const save = ({ value: next }: { value: unknown }) => {
        loading.value = true;
        error.value = undefined;
        window.setTimeout(() => {
          value.value = next;
          loading.value = false;
          editing.value = false;
        }, 800);
      };
      return { args, editing, error, loading, save, value };
    },
    template: `<InlineEdit v-bind="args" v-model:value="value" v-model:editing="editing" save-mode="async" :loading :error @save="save" />`,
  }),
};

export const Empty: Story = { args: { value: '' } };
export const Readonly: Story = { args: { readonly: true } };
export const Disabled: Story = { args: { disabled: true } };

export const DoubleClickWithVisibleButton: Story = {
  args: { activation: 'dblclick' },
};

export const NarrowContainer: Story = {
  args: { display: 'block', value: 'Długa nazwa projektu w responsywnym kontenerze' },
  render: (args) => ({
    components: { InlineEdit },
    setup: () => ({ args }),
    template: `<div style="inline-size:14rem;max-inline-size:100%"><InlineEdit v-bind="args" /></div>`,
  }),
};

export const CustomEditor: Story = {
  args: { editor: 'custom', value: 'PL-2026' },
  render: (args) => ({
    components: { InlineEdit },
    setup: () => ({ args }),
    template: `<InlineEdit v-bind="args"><template #editor="{ draft, updateDraft }"><input data-inline-edit-control aria-label="Kod projektu" :value="draft" @input="updateDraft($event.target.value)" /></template></InlineEdit>`,
  }),
};
