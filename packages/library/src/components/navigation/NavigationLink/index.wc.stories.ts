import { createStoryContent } from '@peaui/storybook-shell/src/components';
import type { Meta, StoryObj } from '@storybook/web-components';

import { NavigationLinkElement, defineNavigationLink } from './index.wc';

defineNavigationLink();

type StoryArgs = {
  ariaLabel?: string;
  dataTestId?: string;
  path: string;
  size?: 'm' | 's' | 'xs';
  variant?: 'default' | 'primary';
};

const meta = {
  title: '7. Navigation/NavigationLink',
  component: NavigationLinkElement.tagName,
  parameters: {
    name: 'NavigationLink',
    description:
      'Link nawigacyjny renderowany jako anchor z obsluga sciezek wewnetrznych, hasha i zewnetrznych url.',
    code: `
<script type="module">
  import "@peaui/ui/navigation/NavigationLink";
</script>

<peaui-navigation-link
  path="/building"
  variant="default"
  size="s"
  data-testid="navigation-link"
>
  Przejdz do danych budynku
</peaui-navigation-link>
    `,
  },
  argTypes: {
    path: {
      control: { type: 'text' },
      description: 'Sciezka wewnetrzna, hash lub zewnetrzny url.',
      table: {
        type: { summary: 'string' },
      },
    },
    size: {
      control: { type: 'radio' },
      options: ['m', 's', 'xs'],
      description: 'Rozmiar tekstu linku.',
      table: {
        type: { summary: "'m' | 's' | 'xs'" },
        defaultValue: { summary: 's' },
      },
    },
    variant: {
      control: { type: 'radio' },
      options: ['default', 'primary'],
      description: 'Wariant kolorystyczny linku.',
      table: {
        type: { summary: "'default' | 'primary'" },
        defaultValue: { summary: 'default' },
      },
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Opcjonalny aria-label dla linku bez widocznego tekstu.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Opcjonalny atrybut data-testid dla root komponentu.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
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

function createNavigationLink(
  args: Partial<StoryArgs>,
  options: {
    content?: Node | string;
    target?: string;
  } = {},
): NavigationLinkElement {
  const element = document.createElement(NavigationLinkElement.tagName) as NavigationLinkElement;
  const content = options.content ?? 'Przejdz do danych budynku';

  if (args.path !== undefined) {
    element.path = args.path;
  }

  if (args.size !== undefined) {
    element.size = args.size;
  }

  if (args.variant !== undefined) {
    element.variant = args.variant;
  }

  if (args.ariaLabel !== undefined) {
    element.ariaLabel = args.ariaLabel;
  }

  if (args.dataTestId !== undefined) {
    element.dataTestId = args.dataTestId;
  }

  if (options.target) {
    element.setAttribute('target', options.target);
  }

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
      preview: (factory ?? ((nextArgs) => createNavigationLink(nextArgs)))(args),
    });
}

export const NavigationLink: Story = {
  render: createRender(),
  args: {
    path: '/building',
    size: 's',
    variant: 'default',
    ariaLabel: undefined,
    dataTestId: 'navigation-link',
  },
};

export const Variants: Story = {
  render: createRender(() => {
    const preview = document.createElement('div');

    preview.style.display = 'flex';
    preview.style.flexDirection = 'column';
    preview.style.gap = '1rem';
    preview.appendChild(
      createNavigationLink(
        {
          path: '/building',
          variant: 'default',
          size: 's',
        },
        { content: 'Wariant default' },
      ),
    );
    preview.appendChild(
      createNavigationLink(
        {
          path: '/building',
          variant: 'primary',
          size: 's',
        },
        { content: 'Wariant primary' },
      ),
    );

    return preview;
  }),
};

export const Sizes: Story = {
  render: createRender(() => {
    const preview = document.createElement('div');

    preview.style.display = 'flex';
    preview.style.flexDirection = 'column';
    preview.style.gap = '1rem';
    preview.appendChild(
      createNavigationLink(
        {
          path: '/building',
          size: 'm',
          variant: 'default',
        },
        { content: 'Rozmiar m' },
      ),
    );
    preview.appendChild(
      createNavigationLink(
        {
          path: '/building',
          size: 's',
          variant: 'default',
        },
        { content: 'Rozmiar s' },
      ),
    );
    preview.appendChild(
      createNavigationLink(
        {
          path: '/building',
          size: 'xs',
          variant: 'default',
        },
        { content: 'Rozmiar xs' },
      ),
    );

    return preview;
  }),
};

export const Destinations: Story = {
  render: createRender(() => {
    const preview = document.createElement('div');

    preview.style.display = 'flex';
    preview.style.flexDirection = 'column';
    preview.style.gap = '1rem';
    preview.appendChild(
      createNavigationLink(
        {
          path: '/building',
          variant: 'default',
        },
        { content: 'Sciezka wewnetrzna' },
      ),
    );
    preview.appendChild(
      createNavigationLink(
        {
          path: '#summary',
          variant: 'default',
        },
        { content: 'Hash do sekcji' },
      ),
    );
    preview.appendChild(
      createNavigationLink(
        {
          path: 'https://example.com',
          variant: 'primary',
        },
        {
          content: 'Zewnetrzny url',
          target: '_blank',
        },
      ),
    );

    return preview;
  }),
};

export const DownloadLink: Story = {
  render: () => {
    const element = createNavigationLink({ path: '#report' }, { content: 'Download report' });
    for (const [key, value] of Object.entries({
      target: '_blank',
      rel: 'noopener',
      download: 'report.txt',
    }))
      element.setAttribute(key, value);
    return element;
  },
};
