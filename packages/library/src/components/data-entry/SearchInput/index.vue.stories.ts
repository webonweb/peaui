import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import SearchInputComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';

const { getSettings } = useSettingsStorie();

const meta: Meta<typeof SearchInputComponent> = {
  title: '3. Data Entry/SearchInput',
  component: SearchInputComponent,
  parameters: {
    name: 'SearchInput',
    description:
      'Komponent wyszukiwania zbudowany w stylistyce biblioteki. ' +
      'Korzysta z ButtonAction, obsluguje debounce od minimum 3 znakow, ' +
      'v-model:value oraz aria dla pola wyszukiwania.',
    code: `
<script lang="ts" setup>
  import SearchInput from "@peaui/ui/data-entry/SearchInput";
  import { ref } from "vue";

  const value = ref("");

  const handleSearch = (phrase: string) => {
    console.log(phrase);
  };
</script>

<template>
  <SearchInput
    v-model:value="value"
    @on:search="handleSearch"
  />
</template>
    `,
  },
  argTypes: {
    value: {
      control: { type: 'text' },
      description: 'Aktualna fraza wyszukiwania (v-model:value).',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Etykieta aria dla pola wyszukiwania i regionu search.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: "'Pole wyszukiwania'" },
      },
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder pola.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: "'Wpisz czego szukasz'" },
      },
    },
    debounceTime: {
      control: { type: 'number' },
      description:
        'Czas debounce dla automatycznego wyszukiwania po wpisywaniu. Automatyczne wyszukiwanie uruchamia sie od 3 znakow.',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: '1000' },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Bazowy data-testid komponentu.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof SearchInputComponent>;

export const SearchInput: Story = {
  render: (args) => ({
    components: { SearchInputComponent, StoryContent },
    setup() {
      const value = ref(args.value ?? '');
      const searchedPhrase = ref('');

      return {
        args,
        value,
        searchedPhrase,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings>
        <SearchInputComponent
          v-bind="args"
          v-model:value="value"
          @on:search="searchedPhrase = $event"
        />
      </StoryContent>
    `,
  }),
  args: {
    value: '',
    ariaLabel: 'Wyszukaj dokument',
    placeholder: 'Wpisz czego szukasz',
    debounceTime: 1000,
    dataTestId: 'search-input',
  },
};

export const Debounced: Story = { args: { debounceTime: 250, ariaLabel: 'Wyszukaj dokument' } };
export const Disabled: Story = { args: { disabled: true, value: 'Zablokowane' } };
export const Readonly: Story = { args: { readonly: true, value: 'Tylko do odczytu' } };
