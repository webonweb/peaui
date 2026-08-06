import { createStoryContent } from '@peaui/storybook-shell/src/components';
import type { Meta, StoryObj } from '@storybook/web-components';

import { MessageTextElement, defineMessageText } from './index.wc';

defineMessageText();

type MessageTextStoryArgs = {
  dataTestId?: string;
  id: string;
  ownIcon?: string;
  size?:
    | 'xxs'
    | 'xs'
    | 's'
    | 'm'
    | 'l'
    | 'xl'
    | 'heading-xs'
    | 'heading-s'
    | 'heading-m'
    | 'heading-l';
  variant?: 'default' | 'info' | 'error' | 'success' | 'danger' | 'white';
  withIcon?: boolean;
};

const meta = {
  title: '4. Feedback/MessageText',
  component: MessageTextElement.tagName,
  parameters: {
    name: 'MessageText',
    description:
      'Tekst komunikatu z wariantem, rozmiarem oraz opcjonalna ikona wariantowa lub wlasna.',
    code: `
<script type="module">
  import "@peaui/ui/feedback/MessageText";
</script>

<peaui-message-text
  id="message-text"
  variant="default"
  size="s"
  own-icon="plus"
>
  Tresc komunikatu
</peaui-message-text>
    `,
  },
  argTypes: {
    id: {
      control: { type: 'text' },
      description: 'Wymagane. Uzywane do zbudowania id root: `${id}-${variant}`.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'data-testid na root. Dodatkowo: -icon, -title.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'info', 'error', 'success', 'danger', 'white'],
      description:
        'Wariant stylu. Dla wariantow statusowych renderuje sie ikona wariantowa, a wariant white ustawia jasny tekst.',
      table: {
        type: { summary: "'info' | 'error' | 'success' | 'danger' | 'default' | 'white'" },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: { type: 'select' },
      options: [
        'xxs',
        'xs',
        's',
        'm',
        'l',
        'xl',
        'heading-xs',
        'heading-s',
        'heading-m',
        'heading-l',
      ],
      description: 'Rozmiar tekstu.',
      table: {
        type: {
          summary:
            "'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'heading-xs' | 'heading-s' | 'heading-m' | 'heading-l'",
        },
        defaultValue: { summary: 's' },
      },
    },
    ownIcon: {
      control: { type: 'text' },
      description: 'Opcjonalna nazwa ikony renderowanej przez komponent SvgIcon.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    withIcon: {
      control: { type: 'boolean' },
      description: 'Pozwala ukryc wowbudowana ikone wariantowa.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
  },
} satisfies Meta<MessageTextStoryArgs>;

export default meta;

type Story = StoryObj<MessageTextStoryArgs>;

const messageVariants = [
  { variant: 'default', text: 'Wariant domyslny bez ikony statusowej.' },
  { variant: 'info', text: 'Wariant informacyjny z ikona.' },
  { variant: 'success', text: 'Wariant sukcesu z ikona.' },
  { variant: 'error', text: 'Wariant bledu z ikona.' },
  { variant: 'danger', text: 'Wariant ostrzegawczy z ikona.' },
] as const;

function getSettings(storyMeta: Meta<MessageTextStoryArgs>) {
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

function createMessageText(
  args: Partial<MessageTextStoryArgs>,
  content = 'Tresc komunikatu',
): MessageTextElement {
  const element = document.createElement(MessageTextElement.tagName) as MessageTextElement;

  if (args.id !== undefined) {
    element.id = args.id;
  }

  if (args.dataTestId !== undefined) {
    element.dataTestId = args.dataTestId;
  }

  if (args.variant !== undefined) {
    element.variant = args.variant;
  }

  if (args.size !== undefined) {
    element.size = args.size;
  }

  if (args.ownIcon !== undefined) {
    element.ownIcon = args.ownIcon;
  }

  if (args.withIcon !== undefined) {
    element.withIcon = args.withIcon;
  }

  element.append(content);

  return element;
}

function createRender(factory?: (args: Partial<MessageTextStoryArgs>) => Node) {
  return (args: Partial<MessageTextStoryArgs>) =>
    createStoryContent({
      settings: getSettings(meta),
      preview: (factory ?? ((nextArgs) => createMessageText(nextArgs)))(args),
    });
}

export const MessageText: Story = {
  render: createRender(),
  args: {
    id: 'message-text',
    variant: 'default',
    size: 's',
    dataTestId: 'message-text',
  },
};

export const OwnIcon: Story = {
  render: createRender(),
  args: {
    id: 'message-text-own-icon',
    variant: 'default',
    size: 's',
    ownIcon: 'plus',
    dataTestId: 'message-text-own-icon',
  },
};

export const WhiteVariant: Story = {
  render: createRender((args) => {
    const wrapper = document.createElement('div');

    wrapper.style.padding = '1.5rem';
    wrapper.style.borderRadius = '0.75rem';
    wrapper.style.background = '#1f2937';
    wrapper.appendChild(createMessageText(args, 'Tresc komunikatu na ciemnym tle'));

    return wrapper;
  }),
  args: {
    id: 'message-text-white',
    variant: 'white',
    size: 's',
    ownIcon: 'plus',
    dataTestId: 'message-text-white',
  },
};

export const Variants: Story = {
  render: createRender(() => {
    const preview = document.createElement('div');

    preview.style.display = 'grid';
    preview.style.gap = '12px';

    for (const item of messageVariants) {
      preview.appendChild(
        createMessageText(
          {
            id: 'message-text-variants',
            size: 's',
            variant: item.variant,
          },
          item.text,
        ),
      );
    }

    return preview;
  }),
};
