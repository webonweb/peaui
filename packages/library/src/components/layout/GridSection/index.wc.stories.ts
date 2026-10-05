import { createStoryContent } from '@peaui/storybook-shell/src/components';
import type { Meta, StoryObj } from '@storybook/web-components';

import { GridSectionElement, defineGridSection } from './index.wc';

defineGridSection();

type GridSectionStoryArgs = {
  columns?: number;
  gap?: number;
};

const meta = {
  title: '6. Layout/GridSection',
  component: GridSectionElement.tagName,
  parameters: {
    name: 'GridSection',
    description: 'Layoutowy grid z opcjonalnym slotem additional nad contentem.',
    code: `
<script type="module">
  import "@peaui/ui/layout/GridSection";
</script>

<peaui-grid-section columns="4" gap="6">
  <div slot="additional">Additional</div>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</peaui-grid-section>
    `,
  },
  argTypes: {
    columns: {
      control: { type: 'number' },
      description: 'Liczba kolumn (responsywnie).',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: '4' },
      },
    },
    gap: {
      control: { type: 'number' },
      description: 'Pionowy odstep miedzy elementami (gap-y-*) w content.',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: '6' },
      },
    },
  },
} satisfies Meta<GridSectionStoryArgs>;

export default meta;

type Story = StoryObj<GridSectionStoryArgs>;

function getSettings(storyMeta: Meta<GridSectionStoryArgs>) {
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

function createItem(label: string): HTMLDivElement {
  const item = document.createElement('div');

  item.textContent = label;
  item.style.padding = '0.75rem';
  item.style.borderRadius = '0.5rem';
  item.style.border = '1px solid var(--peaui-color-grey-100)';
  item.style.background = 'var(--peaui-color-grey-50)';

  return item;
}

function createGridSection(args: Partial<GridSectionStoryArgs>): GridSectionElement {
  const element = document.createElement(GridSectionElement.tagName) as GridSectionElement;
  const additional = document.createElement('div');

  if (args.columns !== undefined) {
    element.columns = args.columns;
  }

  if (args.gap !== undefined) {
    element.gap = args.gap;
  }

  additional.setAttribute('slot', 'additional');
  additional.textContent = 'Additional';
  additional.style.padding = '0.75rem';
  additional.style.borderRadius = '0.5rem';
  additional.style.border = '1px dashed var(--peaui-color-grey-200)';
  additional.style.background = 'var(--peaui-color-grey-25)';
  element.appendChild(additional);

  ['Item 1', 'Item 2', 'Item 3', 'Item 4'].forEach((label) => {
    element.appendChild(createItem(label));
  });

  return element;
}

export const GridSection: Story = {
  render: (args) => {
    const wrapper = document.createElement('div');
    const element = createGridSection(args);

    wrapper.style.width = '100%';
    wrapper.style.maxWidth = '64rem';
    wrapper.style.minWidth = '0';
    wrapper.style.margin = '0 auto';
    element.style.width = '100%';
    wrapper.appendChild(element);

    return createStoryContent({
      settings: getSettings(meta),
      preview: wrapper,
    });
  },
  args: {
    columns: 4,
    gap: 6,
  },
};
