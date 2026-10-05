import { createStoryContent } from '@peaui/storybook-shell/src/components';
import type { Meta, StoryObj } from '@storybook/web-components';

import { InfoTooltipElement, defineInfoTooltip } from './index.wc';

defineInfoTooltip();

type Placement =
  'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

type Variant = 'default' | 'disabled';

type InfoTooltipStoryArgs = {
  dataTestId?: string;
  disabled?: boolean;
  placement?: Placement;
  variant?: Variant;
};

const meta = {
  title: '8. Overlayer/InfoTooltip',
  component: InfoTooltipElement.tagName,
  parameters: {
    name: 'InfoTooltip',
    description:
      'Komponent InfoTooltip sluzy do wyswietlania podpowiedzi kontekstowej. Pozycjonowanie ustawiasz przez `placement`, a tresc przez trigger oraz sloty `title` i `description`.',
    code: `
<script type="module">
  import "@peaui/ui/overlayer/InfoTooltip";
</script>

<peaui-info-tooltip placement="top" data-test-id="info-tooltip">
  Hover / focus
  <span slot="title">Informacja</span>
  <span slot="description">To jest przykladowa tresc tooltipa.</span>
</peaui-info-tooltip>
    `,
  },
  argTypes: {
    placement: {
      control: { type: 'select' },
      options: [
        'top',
        'right',
        'bottom',
        'left',
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
      ],
      description: 'Pozycja tooltipa wzgledem triggera.',
      table: {
        type: {
          summary:
            "'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
        },
        defaultValue: { summary: 'top' },
      },
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'disabled'] satisfies Variant[],
      description: 'Wariant wizualny tooltipa.',
      table: {
        type: { summary: "'default' | 'disabled'" },
        defaultValue: { summary: 'default' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Wylacza pokazywanie tooltipa i interakcje.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description:
        'Bazowy data-test-id; komponent dopina sufiksy -content/-tooltip/-title/-description.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
  },
} satisfies Meta<InfoTooltipStoryArgs>;

export default meta;

type Story = StoryObj<InfoTooltipStoryArgs>;

function getSettings(storyMeta: Meta<InfoTooltipStoryArgs>) {
  const argTypes = storyMeta.argTypes ?? {};

  return {
    ...storyMeta.parameters,
    props: Object.keys(argTypes).map((key) => {
      const argType = argTypes[key as keyof typeof argTypes] as Record<string, unknown> & {
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

function createTooltip(args: Partial<InfoTooltipStoryArgs>): InfoTooltipElement {
  const element = document.createElement(InfoTooltipElement.tagName) as InfoTooltipElement;
  const title = document.createElement('span');
  const description = document.createElement('span');

  if (args.placement !== undefined) {
    element.placement = args.placement;
  }

  if (args.variant !== undefined) {
    element.variant = args.variant;
  }

  if (args.disabled !== undefined) {
    element.disabled = args.disabled;
  }

  if (args.dataTestId !== undefined) {
    element.dataTestId = args.dataTestId;
  }

  element.textContent = 'Lorem ipsum';

  title.setAttribute('slot', 'title');
  title.textContent = 'Lorem ipsum';

  description.setAttribute('slot', 'description');
  description.textContent =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ac nulla et ligula elementum viverra.';

  element.append(title, description);

  return element;
}

function createRender(argsFactory?: (args: Partial<InfoTooltipStoryArgs>) => InfoTooltipElement) {
  return (args: Partial<InfoTooltipStoryArgs>) =>
    createStoryContent({
      settings: getSettings(meta),
      preview: (() => {
        const wrapper = document.createElement('div');

        wrapper.style.margin = 'auto';
        wrapper.style.boxSizing = 'border-box';
        wrapper.style.width = 'max-content';
        wrapper.style.maxWidth = '100%';
        wrapper.style.minWidth = '0';
        wrapper.appendChild((argsFactory ?? createTooltip)(args));

        return wrapper;
      })(),
    });
}

export const InfoTooltip: Story = {
  render: createRender(),
  args: {
    placement: 'top',
    variant: 'default',
    disabled: false,
    dataTestId: 'info-tooltip',
  },
};

export const DisabledVariant: Story = {
  render: createRender(),
  args: {
    placement: 'top',
    variant: 'disabled',
    disabled: false,
    dataTestId: 'info-tooltip-disabled',
  },
};

export const DisabledInteraction: Story = {
  render: createRender(),
  args: {
    placement: 'top',
    variant: 'default',
    disabled: true,
    dataTestId: 'info-tooltip-disabled-interaction',
  },
};
