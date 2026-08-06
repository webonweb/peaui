import { createStoryContent } from '@peaui/storybook-shell/src/components';
import type { Meta, StoryObj } from '@storybook/web-components';

import { CardPanelElement, defineCardPanel } from './index.wc';

defineCardPanel();

type StoryArgs = {
  ariaLabel?: string;
  as?: 'div' | 'section' | 'article';
  backgroundColor?: 'default' | 'primary' | 'grey';
  borderColor?: 'default' | 'primary' | 'grey';
  dataTestId?: string;
  isHoverEnabled?: boolean;
  isShadowEnabled?: boolean;
  size?: 'xs' | 's' | 'm' | 'l';
};

const meta = {
  title: '6. Layout/CardPanel',
  component: CardPanelElement.tagName,
  parameters: {
    name: 'CardPanel',
    description:
      'CardPanel to kontener layoutowy. Obsluguje semantyczny wrapper (`as`), opcjonalny aria-label, cien (`isShadowEnabled`), styl hover (`isHoverEnabled`), rozmiar, niezalezne kolory tla i obramowania oraz opcjonalny slot `header` z separatorem.',
    code: `
<script type="module">
  import "@peaui/ui/layout/CardPanel";
</script>

<peaui-card-panel
  as="section"
  size="l"
  aria-label="Przykladowa sekcja"
  is-shadow-enabled="true"
  is-hover-enabled="true"
  background-color="grey"
  border-color="primary"
  data-testid="card-panel"
>
  <div slot="header"><strong>Panel naglowka</strong></div>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
</peaui-card-panel>
    `,
  },
  argTypes: {
    ariaLabel: {
      control: { type: 'text' },
      description: 'ARIA label dla panelu. Uzywaj tylko gdy panel jest logiczna sekcja UI.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
    isShadowEnabled: {
      control: { type: 'boolean' },
      description: 'Wlacza cien panelu.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    isHoverEnabled: {
      control: { type: 'boolean' },
      description: 'Wlacza styl hover dla panelu.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Bazowy data-test-id do testow.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
    backgroundColor: {
      control: { type: 'select' },
      options: ['default', 'primary', 'grey'],
      description: 'Kolor tla panelu.',
      table: {
        type: { summary: "'default' | 'primary' | 'grey'" },
        defaultValue: { summary: 'default' },
      },
    },
    borderColor: {
      control: { type: 'select' },
      options: ['default', 'primary', 'grey'],
      description: 'Kolor obramowania panelu.',
      table: {
        type: { summary: "'default' | 'primary' | 'grey'" },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 's', 'm', 'l'],
      description: 'Rozmiar panelu, wplywajacy na gestosc i padding.',
      table: {
        type: { summary: "'xs' | 's' | 'm' | 'l'" },
        defaultValue: { summary: 'm' },
      },
    },
    as: {
      control: { type: 'select' },
      options: ['div', 'section', 'article'],
      description: 'Element HTML uzywany jako wrapper.',
      table: {
        type: { summary: "'div' | 'section' | 'article'" },
        defaultValue: { summary: 'div' },
      },
    },
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<StoryArgs>;

function getSettings(storyMeta: Meta<StoryArgs>) {
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

function createCardPanel(
  args: Partial<StoryArgs>,
  options: {
    content?: Node | string;
    header?: Node | string;
  } = {},
): CardPanelElement {
  const element = document.createElement(CardPanelElement.tagName) as CardPanelElement;

  if (args.as !== undefined) {
    element.as = args.as;
  }

  if (args.ariaLabel !== undefined) {
    element.ariaLabel = args.ariaLabel;
  }

  if (args.isShadowEnabled !== undefined) {
    element.isShadowEnabled = args.isShadowEnabled;
  }

  if (args.isHoverEnabled !== undefined) {
    element.isHoverEnabled = args.isHoverEnabled;
  }

  if (args.dataTestId !== undefined) {
    element.dataTestId = args.dataTestId;
  }

  if (args.backgroundColor !== undefined) {
    element.backgroundColor = args.backgroundColor;
  }

  if (args.borderColor !== undefined) {
    element.borderColor = args.borderColor;
  }

  if (args.size !== undefined) {
    element.size = args.size;
  }

  if (options.header !== undefined) {
    const headerNode =
      typeof options.header === 'string'
        ? (() => {
            const wrapper = document.createElement('div');

            wrapper.setAttribute('slot', 'header');
            wrapper.textContent = options.header;
            return wrapper;
          })()
        : options.header;

    if (headerNode instanceof Element) {
      headerNode.setAttribute('slot', 'header');
    }

    element.appendChild(headerNode);
  }

  const content =
    options.content ??
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eget sapien vel tortor porta luctus sed nec diam.';

  if (typeof content === 'string') {
    element.append(content);
  } else {
    element.appendChild(content);
  }

  return element;
}

function createRender(factory?: (args: Partial<StoryArgs>) => Node) {
  return (args: Partial<StoryArgs>) =>
    createStoryContent({
      settings: getSettings(meta),
      preview: (factory ?? ((nextArgs) => createCardPanel(nextArgs)))(args),
    });
}

export const CardPanel: Story = {
  render: createRender(),
  args: {
    as: 'div',
    ariaLabel: undefined,
    isShadowEnabled: false,
    isHoverEnabled: true,
    backgroundColor: 'default',
    borderColor: 'default',
    size: 'm',
    dataTestId: 'card-panel',
  },
};

export const Sizes: Story = {
  render: createRender(() => {
    const preview = document.createElement('div');
    const sizes: Array<'xs' | 's' | 'm' | 'l'> = ['xs', 's', 'm', 'l'];

    preview.style.display = 'grid';
    preview.style.gap = '1rem';

    for (const size of sizes) {
      const panel = createCardPanel(
        {
          size,
          backgroundColor: 'grey',
          borderColor: 'primary',
          as: 'section',
        },
        {
          content: (() => {
            const wrapper = document.createElement('div');
            const title = document.createElement('strong');
            const paragraph = document.createElement('p');

            title.textContent = `Size ${size}`;
            paragraph.style.margin = '0.5rem 0 0';
            paragraph.textContent = `Przyklad panelu dla rozmiaru ${size}.`;
            wrapper.append(title, paragraph);

            return wrapper;
          })(),
        },
      );

      preview.appendChild(panel);
    }

    return preview;
  }),
};

export const Colors: Story = {
  render: createRender(() => {
    const preview = document.createElement('div');
    const combinations = [
      { title: 'Default', backgroundColor: 'default', borderColor: 'default' },
      { title: 'Primary Border', backgroundColor: 'default', borderColor: 'primary' },
      { title: 'Grey Surface', backgroundColor: 'grey', borderColor: 'grey' },
      { title: 'Primary Surface', backgroundColor: 'primary', borderColor: 'primary' },
    ] as const;

    preview.style.display = 'grid';
    preview.style.gap = '1rem';

    for (const item of combinations) {
      const panel = createCardPanel(
        {
          backgroundColor: item.backgroundColor,
          borderColor: item.borderColor,
        },
        {
          content: (() => {
            const wrapper = document.createElement('div');
            const title = document.createElement('strong');
            const paragraph = document.createElement('p');

            title.textContent = item.title;
            paragraph.style.margin = '0.5rem 0 0';
            paragraph.textContent = `backgroundColor=${item.backgroundColor}, borderColor=${item.borderColor}`;
            wrapper.append(title, paragraph);

            return wrapper;
          })(),
        },
      );

      preview.appendChild(panel);
    }

    return preview;
  }),
};

export const WithHeader: Story = {
  render: createRender((args) =>
    createCardPanel(args, {
      header: (() => {
        const wrapper = document.createElement('div');
        const title = document.createElement('strong');
        const status = document.createElement('span');

        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.justifyContent = 'space-between';
        wrapper.style.gap = '1rem';
        title.textContent = 'Dane budynku';
        status.style.color = 'var(--peaui-color-grey-500)';
        status.textContent = 'Stan: roboczy';
        wrapper.append(title, status);

        return wrapper;
      })(),
      content: (() => {
        const paragraph = document.createElement('p');

        paragraph.style.margin = '0';
        paragraph.textContent =
          'Zawartosc panelu pozostaje w osobnej sekcji, a separator pod naglowkiem rozciaga sie na cala szerokosc contentu.';

        return paragraph;
      })(),
    }),
  ),
  args: {
    as: 'section',
    ariaLabel: 'Panel z naglowkiem',
    isShadowEnabled: false,
    isHoverEnabled: true,
    backgroundColor: 'default',
    borderColor: 'grey',
    size: 'm',
    dataTestId: 'card-panel-header',
  },
};
