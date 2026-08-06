import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import FormNumberComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';

const { getSettings } = useSettingsStorie();

const meta: Meta<typeof FormNumberComponent> = {
  title: '5. Form/FormNumber',
  component: FormNumberComponent,
  parameters: {
    name: 'FormNumber',
    description:
      'Bazowy komponent input type="number" opakowany w FormField. ' +
      'Obsluguje v-model:value, ograniczenia min/max, step oraz kontrolki liczby.',
    code: `
<script lang="ts" setup>
  import FormNumber from "@peaui/ui/form/FormNumber";
  import { ref } from "vue";

  const value = ref(10);
</script>

<template>
  <FormNumber
    v-model:value="value"
    id="building-count"
    name="buildingCount"
    label="Liczba budynkow"
    :min="0"
    :max="100"
    :step="1"
    placeholder="Podaj liczbe"
  >
    <template #hint>
      Tutaj mozesz dodac podpowiedz do pola.
    </template>
  </FormNumber>
</template>
    `,
  },
  argTypes: {
    id: {
      control: { type: 'text' },
      description: 'ID pola formularza.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
    name: {
      control: { type: 'text' },
      description: 'Nazwa pola formularza.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
    value: {
      control: { type: 'number' },
      description: 'Aktualna wartosc pola (v-model:value).',
      table: {
        type: { summary: 'number | string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    label: {
      control: { type: 'text' },
      description: 'Etykieta renderowana nad polem.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder inputa.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: "'wpisz'" },
      },
    },
    required: {
      control: { type: 'boolean' },
      description: 'Oznacza pole jako wymagane.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    readonly: {
      control: { type: 'boolean' },
      description: 'Przelacza komponent w tryb tylko do odczytu.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Blokuje interakcje z polem.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    before: {
      control: { type: 'text' },
      description: 'Tekst wyswietlany przed polem.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    after: {
      control: { type: 'text' },
      description: 'Tekst wyswietlany po polu.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    iconBefore: {
      control: { type: 'text' },
      description: 'Nazwa ikony wyswietlanej przed polem.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    iconAfter: {
      control: { type: 'text' },
      description: 'Nazwa ikony wyswietlanej po polu.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    canErase: {
      control: { type: 'boolean' },
      description: 'Pokazuje mozliwosc wyczyszczenia wartosci.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    min: {
      control: { type: 'number' },
      description: 'Minimalna dozwolona wartosc.',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    max: {
      control: { type: 'number' },
      description: 'Maksymalna dozwolona wartosc.',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    step: {
      control: { type: 'number' },
      description: 'Krok zmiany wartosci.',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    isRangeVisible: {
      control: { type: 'boolean' },
      description: 'Steruje widocznoscia natywnych kontrolek liczby.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: 'true' },
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

type Story = StoryObj<typeof FormNumberComponent>;

export const FormNumber: Story = {
  render: (args) => ({
    components: { FormNumberComponent, StoryContent },
    setup() {
      return { args, settings: getSettings(meta) };
    },
    template: `
      <StoryContent :settings>
        <FormNumberComponent v-bind="args" v-model:value="args.value">
          <template #hint>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ullamcorper finibus augue ut feugiat.
          </template>

          <template #description>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </template>
        </FormNumberComponent>
      </StoryContent>
    `,
  }),
  args: {
    id: 'lorem-ipsum',
    name: 'loremIpsum',
    value: 10,
    label: 'Lorem ipsum',
    required: true,
    readonly: false,
    disabled: false,
    before: undefined,
    after: undefined,
    iconBefore: undefined,
    iconAfter: undefined,
    canErase: false,
    min: 0,
    max: 100,
    step: 1,
    isRangeVisible: true,
    dataTestId: 'form-number',
  },
};
