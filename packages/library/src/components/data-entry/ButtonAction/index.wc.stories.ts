import { createStoryContent } from '@peaui/storybook-shell/src/components';
import type { Meta, StoryObj } from '@storybook/web-components';

import { ButtonActionElement, defineButtonAction } from './index.wc';

defineButtonAction();

type ButtonActionStoryArgs = {
  ariaLabel?: string;
  dataTestId?: string;
  disabled?: boolean;
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l';
  type?: 'button' | 'submit' | 'reset';
  useAriaLabel?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
};

const meta = {
  title: '3. Data Entry/ButtonAction',
  component: ButtonActionElement.tagName,
  parameters: {
    name: 'ButtonAction',
    description:
      'Komponent ButtonAction to dostepny (WCAG) przycisk formularzowy z wariantami i rozmiarami. Obsluguje native disabled, automatyczne aria-label dla icon-only i data-testid do testow.',
    code: `
<script type="module">
  import "@peaui/ui/data-entry/ButtonAction";
</script>

<peaui-button-action aria-label="Zapisz formularz">
  Zapisz
</peaui-button-action>
    `,
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['xxs', 'xs', 's', 'm', 'l'],
      description: 'Rozmiar przycisku.',
      table: {
        type: { summary: "'xxs' | 'xs' | 's' | 'm' | 'l'" },
        defaultValue: { summary: 'm' },
      },
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost', 'danger'],
      description: 'Wariant wizualny przycisku.',
      table: {
        type: { summary: "'primary' | 'secondary' | 'ghost' | 'danger'" },
        defaultValue: { summary: 'primary' },
      },
    },
    type: {
      control: { type: 'select' },
      options: ['button', 'submit', 'reset'],
      description: 'Typ natywnego przycisku w formularzu.',
      table: {
        type: { summary: "'button' | 'submit' | 'reset'" },
        defaultValue: { summary: 'button' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Blokuje interakcje native disabled.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Label dostepnosci uzywany dla icon-only albo gdy useAriaLabel=true.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Atrybut data-testid do testow automatycznych.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    useAriaLabel: {
      control: { type: 'boolean' },
      description: 'Wymusza aria-label nawet gdy przycisk ma widoczny tekst.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
} satisfies Meta<ButtonActionStoryArgs>;

export default meta;

type Story = StoryObj<ButtonActionStoryArgs>;

const buttonVariants = [
  { variant: 'primary', label: 'Primary' },
  { variant: 'secondary', label: 'Secondary' },
  { variant: 'ghost', label: 'Ghost' },
  { variant: 'danger', label: 'Danger' },
] as const;

function getSettings(storyMeta: Meta<ButtonActionStoryArgs>) {
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

function createButtonAction(
  args: Partial<ButtonActionStoryArgs> = {},
  content: Node | string = 'Lorem Ipsum',
): ButtonActionElement {
  const element = document.createElement(ButtonActionElement.tagName) as ButtonActionElement;

  if (args.size !== undefined) {
    element.size = args.size;
  }

  if (args.variant !== undefined) {
    element.variant = args.variant;
  }

  if (args.type !== undefined) {
    element.type = args.type;
  }

  if (args.disabled !== undefined) {
    element.disabled = args.disabled;
  }

  if (args.ariaLabel !== undefined) {
    element.ariaLabel = args.ariaLabel;
  }

  if (args.dataTestId !== undefined) {
    element.dataTestId = args.dataTestId;
  }

  if (args.useAriaLabel !== undefined) {
    element.useAriaLabel = args.useAriaLabel;
  }

  if (typeof content === 'string') {
    element.append(content);
  } else {
    element.appendChild(content);
  }

  return element;
}

function createRender(factory?: (args: Partial<ButtonActionStoryArgs>) => Node) {
  return (args: Partial<ButtonActionStoryArgs>) =>
    createStoryContent({
      settings: getSettings(meta),
      preview: (factory ?? ((nextArgs) => createButtonAction(nextArgs)))(args),
    });
}

export const ButtonAction: Story = {
  render: createRender(),
  args: {
    ariaLabel: 'Lorem ipsum',
  },
};

export const Variants: Story = {
  render: createRender(() => {
    const preview = document.createElement('div');

    preview.style.display = 'flex';
    preview.style.gap = '12px';
    preview.style.flexWrap = 'wrap';
    preview.style.alignItems = 'center';

    for (const item of buttonVariants) {
      preview.appendChild(
        createButtonAction(
          {
            variant: item.variant,
            ariaLabel: 'Przycisk akcji',
          },
          item.label,
        ),
      );
    }

    return preview;
  }),
};
