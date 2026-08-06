import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import FormPasswordComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';

const { getSettings } = useSettingsStorie();

const meta: Meta<typeof FormPasswordComponent> = {
  title: '5. Form/FormPassword',
  component: FormPasswordComponent,
  parameters: {
    name: 'FormPassword',
    description:
      'Pole hasla oparte o FormField z obsluga v-model:value, etykiety, opcjonalnymi akcjami po prawej stronie oraz opcjonalnym meterem sily hasla.',
    code: `
<script lang="ts" setup>
  import FormPassword from "@peaui/ui/form/FormPassword";
  import { ref } from "vue";

  const value = ref("SuperTajneHaslo123!");
</script>

<template>
  <FormPassword
    v-model:value="value"
    id="user-password"
    name="userPassword"
    label="Haslo"
    placeholder="Wpisz haslo"
    :enablePasswordStrengthMeter="true"
  >
    <template #hint>
      Uzyj przycisku po prawej, aby pokazac lub skopiowac haslo.
    </template>
  </FormPassword>
</template>
    `,
  },
  argTypes: {
    id: {
      control: { type: 'text' },
      description: 'ID pola formularza.',
      table: {
        type: { summary: 'string' },
      },
    },
    name: {
      control: { type: 'text' },
      description: 'Nazwa pola formularza.',
      table: {
        type: { summary: 'string' },
      },
    },
    value: {
      control: { type: 'text' },
      description: 'Aktualna wartosc pola (v-model:value).',
      table: {
        type: { summary: 'string | undefined' },
      },
    },
    label: {
      control: { type: 'text' },
      description: 'Etykieta renderowana nad polem.',
      table: {
        type: { summary: 'string | undefined' },
      },
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder pola hasla.',
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
      },
    },
    readonly: {
      control: { type: 'boolean' },
      description: 'Przelacza komponent w tryb tylko do odczytu.',
      table: {
        type: { summary: 'boolean | undefined' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Blokuje interakcje z polem i przyciskami akcji.',
      table: {
        type: { summary: 'boolean | undefined' },
      },
    },
    before: {
      control: { type: 'text' },
      description: 'Tekst wyswietlany przed polem.',
      table: {
        type: { summary: 'string | undefined' },
      },
    },
    iconBefore: {
      control: { type: 'text' },
      description: 'Nazwa ikony wyswietlanej przed polem.',
      table: {
        type: { summary: 'string | undefined' },
      },
    },
    maxLength: {
      control: { type: 'number' },
      description: 'Maksymalna liczba znakow.',
      table: {
        type: { summary: 'number | undefined' },
      },
    },
    canCopy: {
      control: { type: 'boolean' },
      description: 'Decyduje, czy pokazywac przycisk kopiowania hasla.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: 'true' },
      },
    },
    canVisible: {
      control: { type: 'boolean' },
      description: 'Decyduje, czy pokazywac przycisk pokazywania i ukrywania hasla.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: 'true' },
      },
    },
    enablePasswordStrengthMeter: {
      control: { type: 'boolean' },
      description:
        'Pokazuje meter sily hasla oraz wymusza spelnienie zasad bezpieczenstwa przez custom validity.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: 'false' },
      },
    },
    showPasswordAriaLabel: {
      control: { type: 'text' },
      description: 'Etykieta dostepnosci dla przycisku pokazywania hasla.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: "'Pokaz haslo'" },
      },
    },
    hidePasswordAriaLabel: {
      control: { type: 'text' },
      description: 'Etykieta dostepnosci dla przycisku ukrywania hasla.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: "'Ukryj haslo'" },
      },
    },
    copyPasswordAriaLabel: {
      control: { type: 'text' },
      description: 'Etykieta dostepnosci dla przycisku kopiowania hasla.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: "'Kopiuj haslo'" },
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

type Story = StoryObj<typeof FormPasswordComponent>;

export const FormPassword: Story = {
  render: (args) => ({
    components: { FormPasswordComponent, StoryContent },
    setup() {
      return { args, settings: getSettings(meta) };
    },
    template: `
      <StoryContent :settings>
        <FormPasswordComponent v-bind="args" v-model:value="args.value" />
      </StoryContent>
    `,
  }),
  args: {
    id: 'user-password',
    name: 'userPassword',
    value: 'SuperTajneHaslo123!',
    label: ' ',
    required: true,
    readonly: false,
    disabled: false,
    before: undefined,
    canCopy: true,
    canVisible: true,
    enablePasswordStrengthMeter: false,
  },
};

export const ReadonlyPassword: Story = {
  render: (args) => ({
    components: { FormPasswordComponent, StoryContent },
    setup() {
      return { args, settings: getSettings(meta) };
    },
    template: `
      <StoryContent :settings>
        <FormPasswordComponent v-bind="args" v-model:value="args.value" />
      </StoryContent>
    `,
  }),
  args: {
    id: 'readonly-password',
    name: 'readonlyPassword',
    value: 'ReadonlyHaslo789!',
    label: 'Haslo techniczne',
    readonly: true,
    disabled: false,
    canCopy: true,
    canVisible: true,
  },
};

export const WithoutActions: Story = {
  render: (args) => ({
    components: { FormPasswordComponent, StoryContent },
    setup() {
      return { args, settings: getSettings(meta) };
    },
    template: `
      <StoryContent :settings>
        <FormPasswordComponent v-bind="args" v-model:value="args.value" />
      </StoryContent>
    `,
  }),
  args: {
    id: 'password-without-actions',
    name: 'passwordWithoutActions',
    value: 'UkryteHaslo321!',
    label: 'Haslo bez akcji',
    readonly: false,
    disabled: false,
    canCopy: false,
    canVisible: false,
  },
};

export const WithStrengthMeter: Story = {
  render: (args) => ({
    components: { FormPasswordComponent, StoryContent },
    setup() {
      return { args, settings: getSettings(meta) };
    },
    template: `
      <StoryContent :settings>
        <FormPasswordComponent v-bind="args" v-model:value="args.value" />
      </StoryContent>
    `,
  }),
  args: {
    id: 'password-with-strength-meter',
    name: 'passwordWithStrengthMeter',
    value: 'BezpieczneHaslo34!$',
    label: 'Haslo z meterem sily',
    readonly: false,
    disabled: false,
    canCopy: true,
    canVisible: true,
    enablePasswordStrengthMeter: true,
  },
};
