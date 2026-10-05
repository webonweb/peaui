import { createStoryContent } from '@peaui/storybook-shell/src/components';
import type { Meta, StoryObj } from '@storybook/web-components';

import { GridItemElement, defineGridItem } from './index.wc';

defineGridItem();

type StoryArgs = {
  colspan?: number;
  columns?: number;
  gap?: number;
  grid?: boolean;
};

const meta = {
  title: '6. Layout/GridItem',
  component: GridItemElement.tagName,
  parameters: {
    name: 'GridItem',
    description: 'Element siatki (grid) z opcjonalnym wewnetrznym gridem i colspan.',
    code: `
<script type="module">
  import "@peaui/ui/layout/GridItem";
</script>

<peaui-grid-item colspan="2" grid="true">
  <div>Content</div>
</peaui-grid-item>
    `,
  },
  argTypes: {
    colspan: {
      control: { type: 'number' },
      description: 'Ile kolumn ma zajmowac element (span).',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: '2' },
      },
    },
    columns: {
      control: { type: 'number' },
      description: 'Liczba kolumn wewnetrznego grida (opcjonalnie).',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    gap: {
      control: { type: 'number' },
      description: 'Gap wewnetrznego grida w skali zgodnej z GridSection.',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: '6' },
      },
    },
    grid: {
      control: { type: 'boolean' },
      description: 'Jesli true, element staje sie gridem wewnetrznym.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: 'true' },
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

function createGridItem(args: Partial<StoryArgs>): GridItemElement {
  const element = document.createElement(GridItemElement.tagName) as GridItemElement;

  if (args.colspan !== undefined) {
    element.colspan = args.colspan;
  }

  if (args.columns !== undefined) {
    element.columns = args.columns;
  }

  if (args.gap !== undefined) {
    element.gap = args.gap;
  }

  if (args.grid !== undefined) {
    element.grid = args.grid;
  }

  for (let index = 0; index < 3; index += 1) {
    const item = document.createElement('div');

    item.textContent = 'Content';
    item.style.padding = '0.75rem';
    item.style.borderRadius = '0.5rem';
    item.style.background = 'var(--peaui-color-grey-50)';
    item.style.border = '1px solid var(--peaui-color-grey-100)';
    element.appendChild(item);
  }

  return element;
}

export const GridItem: Story = {
  render: (args) => {
    const preview = document.createElement('div');
    const grid = document.createElement('div');

    preview.style.width = '100%';
    grid.style.display = 'grid';
    grid.style.gap = '1rem';
    grid.style.gridTemplateColumns = 'repeat(4, minmax(0, 1fr))';

    const element = createGridItem(args);

    element.style.width = '100%';
    grid.appendChild(element);
    preview.appendChild(grid);

    return createStoryContent({
      settings: getSettings(meta),
      preview,
    });
  },
  args: {
    colspan: 3,
    columns: 4,
    gap: 6,
    grid: true,
  },
};
