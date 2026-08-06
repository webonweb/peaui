import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import ToastAlertComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';

const { getSettings } = useSettingsStorie();

const meta: Meta<typeof ToastAlertComponent> = {
  title: '4. Feedback/ToastAlert',
  component: ToastAlertComponent,
  parameters: {
    name: 'ToastAlert',
    description:
      'Komponent ToastAlert sluzy do wyswietlania krotkich komunikatow w wariantach info, success, error i danger.',
    code: `
<script lang="ts" setup>
  import ToastAlert from "@peaui/ui/feedback/ToastAlert";
</script>

<template>
  <ToastAlert
    variant="info"
    title="Informacja"
    description="To jest przykladowy komunikat."
    size="m"
    dataTestId="toast-alert"
  />
</template>
    `,
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['info', 'success', 'error', 'danger'],
      description: 'Wariant komponentu.',
      table: {
        type: { summary: "'info' | 'success' | 'error' | 'danger'" },
        defaultValue: { summary: 'info' },
      },
    },

    title: {
      control: { type: 'text' },
      description: 'Tytul komunikatu.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },

    description: {
      control: { type: 'text' },
      description: 'Opis komunikatu.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },

    size: {
      control: { type: 'select' },
      options: ['s', 'm', 'l'],
      description: 'Rozmiar tytulu komunikatu.',
      table: {
        type: { summary: "'s' | 'm' | 'l'" },
        defaultValue: { summary: 'm' },
      },
    },

    withShadow: {
      control: { type: 'boolean' },
      description: 'Dodaje cien do kontenera komunikatu.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    withBorder: {
      control: { type: 'boolean' },
      description: 'Dodaje obramowanie zgodne z wariantem komponentu.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    canClose: {
      control: { type: 'boolean' },
      description: 'Wyswietla przycisk zamkniecia w prawym gornym rogu.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    dataTestId: {
      control: { type: 'text' },
      description: 'Atrybut do testow automatycznych.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ToastAlertComponent>;

const toastVariants = [
  {
    variant: 'info',
    title: 'Informacja',
    description: 'Neutralny komunikat dla uzytkownika.',
  },
  {
    variant: 'success',
    title: 'Sukces',
    description: 'Operacja zostala zakonczona poprawnie.',
  },
  {
    variant: 'error',
    title: 'Blad',
    description: 'Nie udalo sie wykonac operacji.',
  },
  {
    variant: 'danger',
    title: 'Ostrzezenie',
    description: 'Ta akcja moze wymagac dodatkowej uwagi.',
  },
] as const;

export const ToastAlert: Story = {
  render: (args) => ({
    components: { ToastAlertComponent, StoryContent },
    setup() {
      return {
        args,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings>
        <ToastAlertComponent v-bind="args" />
      </StoryContent>
    `,
  }),
  args: {
    variant: 'info',
    title: 'Informacja',
    description: 'To jest przykladowy komunikat w komponencie ToastAlert.',
    size: 'm',
    withShadow: false,
    withBorder: false,
    canClose: false,
    dataTestId: 'toast-alert',
  },
};

export const SmallTitle: Story = {
  ...ToastAlert,
  args: {
    variant: 'info',
    title: 'Krotki komunikat',
    description: 'Wariant z mniejszym rozmiarem tytulu.',
    size: 's',
    withShadow: false,
    withBorder: false,
    dataTestId: 'toast-alert-small-title',
  },
};

export const LargeTitle: Story = {
  ...ToastAlert,
  args: {
    variant: 'success',
    title: 'Wiekszy komunikat',
    description: 'Wariant prezentujacy rozmiar tytulu l.',
    size: 'l',
    withShadow: false,
    withBorder: false,
    dataTestId: 'toast-alert-large-title',
  },
};

export const WithShadow: Story = {
  ...ToastAlert,
  args: {
    variant: 'danger',
    title: 'Komunikat z cieniem',
    description: 'Wariant z wlaczonym propsem withShadow.',
    size: 'm',
    withShadow: true,
    withBorder: false,
    dataTestId: 'toast-alert-with-shadow',
  },
};

export const WithBorder: Story = {
  ...ToastAlert,
  args: {
    variant: 'success',
    title: 'Komunikat z obramowaniem',
    description: 'Wariant z wlaczonym propsem withBorder.',
    size: 'm',
    withShadow: false,
    withBorder: true,
    canClose: false,
    dataTestId: 'toast-alert-with-border',
  },
};

export const Closable: Story = {
  ...ToastAlert,
  args: {
    variant: 'info',
    title: 'Komunikat z zamknieciem',
    description: 'Wariant z przyciskiem zamkniecia w prawym gornym rogu.',
    size: 'm',
    withShadow: false,
    withBorder: false,
    canClose: true,
    dataTestId: 'toast-alert-closable',
  },
};

export const Variants: Story = {
  render: () => ({
    components: { ToastAlertComponent, StoryContent },
    setup() {
      return {
        settings: getSettings(meta),
        toastVariants,
      };
    },
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:12px;">
          <ToastAlertComponent
            v-for="item in toastVariants"
            :key="item.variant"
            :variant="item.variant"
            :title="item.title"
            :description="item.description"
            size="m"
          />
        </div>
      </StoryContent>
    `,
  }),
};
