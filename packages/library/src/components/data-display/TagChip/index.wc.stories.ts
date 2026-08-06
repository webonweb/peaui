import { createStoryContent } from '@peaui/storybook-shell/src/components';
import type { Meta, StoryObj } from '@storybook/web-components';

import { TagChipElement, defineTagChip } from './index.wc';

defineTagChip();

type TagChipStoryArgs = {
  active?: boolean;
  as?: 'button' | 'span';
  dataTestId?: string;
  label: string;
  size?: 'xxs' | 'xs' | 's';
  variant?: 'blue' | 'green' | 'red' | 'orange' | 'grey' | 'violet' | 'outline';
};

const meta = {
  title: '2. Data Display/TagChip',
  component: TagChipElement.tagName,
  parameters: {
    name: 'TagChip',
    description:
      'Komponent TagChip sluzy do wyswietlania pojedynczego taga jako chip z tekstem, stanem aktywnym oraz mozliwoscia wyboru wrappera przez prop `as`.',
    code: `
<script type="module">
  import "@peaui/ui/data-display/TagChip";
</script>

<peaui-tag-chip
  label="Lorem ipsum"
  as="button"
></peaui-tag-chip>
    `,
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['xxs', 'xs', 's'],
      description: 'Rozmiar komponentu.',
      table: {
        type: { summary: "'xxs' | 'xs' | 's'" },
        defaultValue: { summary: 'xs' },
      },
    },
    variant: {
      control: { type: 'select' },
      options: ['blue', 'green', 'red', 'orange', 'grey', 'violet', 'outline'],
      description: 'Wariant kolorystyczny komponentu.',
      table: {
        type: {
          summary: "'blue' | 'green' | 'red' | 'orange' | 'grey' | 'violet' | 'outline'",
        },
        defaultValue: { summary: 'outline' },
      },
    },
    label: {
      control: { type: 'text' },
      description: 'Tekst etykiety.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
        required: true,
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
    active: {
      control: { type: 'boolean' },
      description: 'Czy stan aktywny jest wlaczony.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    as: {
      control: { type: 'select' },
      options: ['button', 'span'],
      description: 'Element HTML uzywany jako wrapper komponentu.',
      table: {
        type: { summary: "'button' | 'span'" },
        defaultValue: { summary: 'button' },
      },
    },
  },
} satisfies Meta<TagChipStoryArgs>;

export default meta;

type Story = StoryObj<TagChipStoryArgs>;

const tagVariants = [
  { variant: 'blue', label: 'Blue' },
  { variant: 'green', label: 'Green' },
  { variant: 'red', label: 'Red' },
  { variant: 'orange', label: 'Orange' },
  { variant: 'grey', label: 'Grey' },
  { variant: 'violet', label: 'Violet' },
  { variant: 'outline', label: 'Outline' },
] as const;

function getSettings(storyMeta: Meta<TagChipStoryArgs>) {
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

function createTagChip(args: Partial<TagChipStoryArgs> = {}): TagChipElement {
  const element = document.createElement(TagChipElement.tagName) as TagChipElement;

  if (args.size !== undefined) {
    element.size = args.size;
  }

  if (args.variant !== undefined) {
    element.variant = args.variant;
  }

  if (args.label !== undefined) {
    element.label = args.label;
  }

  if (args.dataTestId !== undefined) {
    element.dataTestId = args.dataTestId;
  }

  if (args.active !== undefined) {
    element.active = args.active;
  }

  if (args.as !== undefined) {
    element.as = args.as;
  }

  return element;
}

function renderStory(args: Partial<TagChipStoryArgs> = {}) {
  return createStoryContent({
    settings: getSettings(meta),
    preview: createTagChip(args),
  });
}

export const TagChip: Story = {
  render: (args) => renderStory(args),
  args: {
    label: 'Lorem ipsum',
    as: 'button',
  },
};

export const AsSpan: Story = {
  render: (args) => renderStory(args),
  args: {
    label: 'Lorem ipsum',
    as: 'span',
    variant: 'blue',
    active: true,
  },
};

export const Variants: Story = {
  render: () => {
    const preview = document.createElement('div');

    preview.style.display = 'flex';
    preview.style.gap = '12px';
    preview.style.flexWrap = 'wrap';
    preview.style.alignItems = 'center';

    for (const item of tagVariants) {
      preview.appendChild(
        createTagChip({
          label: item.label,
          variant: item.variant,
          as: 'button',
        }),
      );
    }

    return createStoryContent({
      settings: getSettings(meta),
      preview,
    });
  },
};
