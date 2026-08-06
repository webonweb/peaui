import { createStoryContent } from '@peaui/storybook-shell/src/components';
import type { Meta, StoryObj } from '@storybook/web-components';

import { ToastAlertElement, defineToastAlert } from './index.wc';

defineToastAlert();

type ToastAlertStoryArgs = {
  canClose?: boolean;
  dataTestId?: string;
  description?: string;
  size?: 's' | 'm' | 'l';
  title?: string;
  variant?: 'info' | 'success' | 'error' | 'danger';
  withBorder?: boolean;
  withShadow?: boolean;
};

const meta = {
  title: '4. Feedback/ToastAlert',
  component: ToastAlertElement.tagName,
  parameters: {
    name: 'ToastAlert',
    description:
      'Komponent ToastAlert sluzy do wyswietlania krotkich komunikatow w wariantach info, success, error i danger.',
    code: `
<script type="module">
  import "@peaui/ui/feedback/ToastAlert";
</script>

<peaui-toast-alert
  variant="info"
  title="Informacja"
  description="To jest przykladowy komunikat."
  size="m"
  data-testid="toast-alert"
></peaui-toast-alert>
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
} satisfies Meta<ToastAlertStoryArgs>;

export default meta;

type Story = StoryObj<ToastAlertStoryArgs>;

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

function getSettings(storyMeta: Meta<ToastAlertStoryArgs>) {
  const argTypes = storyMeta.argTypes ?? {};

  return {
    ...storyMeta.parameters,
    props: Object.keys(argTypes).map((key) => {
      const argType = argTypes[key] as Record<string, unknown> & {
        type?: unknown;
        types?: unknown;
      };

      return {
        ...argType,
        prop: key,
        type: argType.types ?? argType.type,
      };
    }),
  };
}

function createToastAlert(args: Partial<ToastAlertStoryArgs>): ToastAlertElement {
  const element = document.createElement(ToastAlertElement.tagName) as ToastAlertElement;

  if (args.variant !== undefined) {
    element.variant = args.variant;
  }

  if (args.title !== undefined) {
    element.title = args.title;
  }

  if (args.description !== undefined) {
    element.description = args.description;
  }

  if (args.dataTestId !== undefined) {
    element.dataTestId = args.dataTestId;
  }

  if (args.size !== undefined) {
    element.size = args.size;
  }

  if (args.withShadow !== undefined) {
    element.withShadow = args.withShadow;
  }

  if (args.withBorder !== undefined) {
    element.withBorder = args.withBorder;
  }

  if (args.canClose !== undefined) {
    element.canClose = args.canClose;
  }

  return element;
}

function createRender(factory?: (args: Partial<ToastAlertStoryArgs>) => Node) {
  return (args: Partial<ToastAlertStoryArgs>) =>
    createStoryContent({
      settings: getSettings(meta),
      preview: (factory ?? ((nextArgs) => createToastAlert(nextArgs)))(args),
    });
}

export const ToastAlert: Story = {
  render: createRender(),
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
  render: createRender(),
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
  render: createRender(),
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
  render: createRender(),
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
  render: createRender(),
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
  render: createRender(),
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
  render: createRender(() => {
    const preview = document.createElement('div');

    preview.style.display = 'grid';
    preview.style.gap = '12px';

    for (const item of toastVariants) {
      preview.appendChild(
        createToastAlert({
          variant: item.variant,
          title: item.title,
          description: item.description,
          size: 'm',
        }),
      );
    }

    return preview;
  }),
};
