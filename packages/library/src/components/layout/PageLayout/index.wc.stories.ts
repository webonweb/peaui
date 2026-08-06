import { createStoryContent } from '@peaui/storybook-shell/src/components';
import type { Meta, StoryObj } from '@storybook/web-components';

import { PageLayoutElement, definePageLayout } from './index.wc';

definePageLayout();

type StoryArgs = {
  ariaLabel?: string;
  dataTestId?: string;
  isHeaderSticky?: boolean;
};

const meta = {
  title: '6. Layout/PageLayout',
  component: PageLayoutElement.tagName,
  parameters: {
    name: 'PageLayout',
    description:
      'Main layout wrapper with optional top slot and additional slot inside main. Uses semantic header and main.',
    code: `
<script type="module">
  import "@peaui/ui/layout/PageLayout";
</script>

<peaui-page-layout aria-label="Page top" is-header-sticky="true" data-testid="page-layout">
  <div slot="top">Top area</div>
  <div slot="additional">Additional content</div>
  <div>Page content</div>
  <div slot="footer">Footer content</div>
</peaui-page-layout>
    `,
  },
  argTypes: {
    ariaLabel: {
      control: { type: 'text' },
      description: 'ARIA label for the top header section.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    isHeaderSticky: {
      control: { type: 'boolean' },
      description: 'Makes the header stick to the top while scrolling.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: 'false' },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Base data-test-id for tests.',
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

function createSlottedElement(slotName: string, text: string): HTMLDivElement {
  const element = document.createElement('div');

  element.setAttribute('slot', slotName);
  element.textContent = text;

  return element;
}

function createPageLayout(args: Partial<StoryArgs>): PageLayoutElement {
  const element = document.createElement(PageLayoutElement.tagName) as PageLayoutElement;
  const content = document.createElement('div');

  if (args.ariaLabel !== undefined) {
    element.ariaLabel = args.ariaLabel;
  }

  if (args.isHeaderSticky !== undefined) {
    element.isHeaderSticky = args.isHeaderSticky;
  }

  if (args.dataTestId !== undefined) {
    element.dataTestId = args.dataTestId;
  }

  content.textContent = 'Page content';
  content.style.padding = '1rem';
  content.style.borderRadius = '0.5rem';
  content.style.background = 'var(--peaui-color-grey-0)';
  content.style.border = '1px solid var(--peaui-color-grey-100)';

  element.appendChild(createSlottedElement('top', 'Top area'));
  element.appendChild(createSlottedElement('additional', 'Additional content'));
  element.appendChild(content);
  element.appendChild(createSlottedElement('footer', 'Footer content'));

  return element;
}

export const PageLayout: Story = {
  render: (args) => {
    const wrapper = document.createElement('div');

    wrapper.style.width = '100%';
    wrapper.style.maxWidth = '31.25rem';
    wrapper.appendChild(createPageLayout(args));

    return createStoryContent({
      settings: getSettings(meta),
      preview: wrapper,
    });
  },
  args: {
    ariaLabel: 'Page top',
    isHeaderSticky: true,
    dataTestId: 'page-layout',
  },
};
