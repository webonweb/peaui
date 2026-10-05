import { createStoryContent } from '@peaui/storybook-shell/src/components';
import type { Meta, StoryObj } from '@storybook/web-components';

import { ImageViewElement, defineImageView } from './index.wc';

defineImageView();

type StoryArgs = {
  alt?: string;
  dataTestId?: string;
  max?: string;
  size?: 'auto' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'full';
  src?: string;
};

const meta = {
  title: '1. Basic/ImageView',
  component: ImageViewElement.tagName,
  parameters: {
    name: 'ImageView',
    description:
      'Komponent do wyswietlania obrazu z fallbackiem dla `alt`, obsluga dekoracyjnego `alt=""` oraz rozmiarami przez atrybut `size`.',
    code: `
<script type="module">
  import "@peaui/ui/basic/ImageView";
</script>

<peaui-image-view
  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
  alt="Gorski krajobraz"
  size="m"
  max="24rem"
  data-testid="image-view"
></peaui-image-view>
    `,
  },
  argTypes: {
    src: {
      control: { type: 'text' },
      description: 'Adres obrazu przekazywany do elementu `img`.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    alt: {
      control: { type: 'text' },
      description:
        'Alternatywny opis obrazu. Gdy nie jest podany, komponent tworzy fallback z `aria-label`, `title`, nazwy pliku lub tekstu "Obraz".',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    size: {
      control: { type: 'select' },
      options: ['auto', 'xs', 's', 'm', 'l', 'xl', 'full'],
      description: 'Rozmiar wrappera obrazu.',
      table: {
        type: { summary: '"auto" | "xs" | "s" | "m" | "l" | "xl" | "full"' },
        defaultValue: { summary: 'auto' },
      },
    },
    max: {
      control: { type: 'text' },
      description: 'Opcjonalny maksymalny rozmiar wrappera ustawiany jako inline `max-width`.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Opcjonalny atrybut `data-testid` przypinany do obrazu.',
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

function createImageView(args: Partial<StoryArgs> = {}): ImageViewElement {
  const element = document.createElement(ImageViewElement.tagName) as ImageViewElement;

  if (args.src !== undefined) {
    element.src = args.src;
  }

  if (args.alt !== undefined) {
    element.alt = args.alt;
  }

  if (args.size !== undefined) {
    element.size = args.size;
  }

  if (args.max !== undefined) {
    element.max = args.max;
  }

  if (args.dataTestId !== undefined) {
    element.dataTestId = args.dataTestId;
  }

  return element;
}

function createPreviewShell(content: Node): HTMLDivElement {
  const wrapper = document.createElement('div');

  wrapper.style.width = '100%';
  wrapper.style.maxWidth = '720px';
  wrapper.style.boxSizing = 'border-box';
  wrapper.style.padding = '24px';
  wrapper.style.borderRadius = '16px';
  wrapper.style.background = '#f8fafc';
  wrapper.appendChild(content);

  return wrapper;
}

function createSizesPreview(): HTMLDivElement {
  const preview = document.createElement('div');
  const sizes: StoryArgs['size'][] = ['xs', 's', 'm', 'l', 'xl', 'full'];

  preview.style.display = 'grid';
  preview.style.boxSizing = 'border-box';
  preview.style.gap = '20px';
  preview.style.gridTemplateColumns = 'minmax(0, 1fr)';
  preview.style.minWidth = '0';
  preview.style.width = '100%';
  preview.style.maxWidth = '920px';
  preview.style.padding = '24px';
  preview.style.borderRadius = '16px';
  preview.style.background = '#f8fafc';

  for (const size of sizes) {
    if (!size) {
      continue;
    }

    const row = document.createElement('div');
    const label = document.createElement('code');

    row.style.display = 'grid';
    row.style.gap = '12px';
    row.style.maxWidth = '100%';
    row.style.minWidth = '0';

    label.textContent = `size="${size}"`;
    label.style.fontSize = '12px';
    label.style.color = '#475569';

    row.appendChild(label);
    row.appendChild(
      createImageView({
        src: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80',
        alt: 'Przykladowe zdjecie krajobrazu',
        size,
        dataTestId: `image-view-${size}`,
      }),
    );

    preview.appendChild(row);
  }

  return preview;
}

export const ImageView: Story = {
  render: (args) =>
    createStoryContent({
      settings: getSettings(meta),
      preview: createPreviewShell(createImageView(args)),
    }),
  args: {
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    alt: 'Gorski krajobraz',
    size: 'm',
    max: '24rem',
    dataTestId: 'image-view',
  },
};

export const FallbackAlt: Story = {
  render: () =>
    createStoryContent({
      settings: getSettings(meta),
      preview: createPreviewShell(
        createImageView({
          src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee/fallback-landscape-photo.jpg',
          size: 'l',
          dataTestId: 'image-view-fallback',
        }),
      ),
    }),
};

export const Decorative: Story = {
  render: () =>
    createStoryContent({
      settings: getSettings(meta),
      preview: createPreviewShell(
        createImageView({
          src: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80',
          alt: '',
          size: 'full',
          dataTestId: 'image-view-decorative',
        }),
      ),
    }),
};

export const Sizes: Story = {
  render: () =>
    createStoryContent({
      settings: getSettings(meta),
      preview: createSizesPreview(),
    }),
};

export const MaxWidth: Story = {
  render: () =>
    createStoryContent({
      settings: getSettings(meta),
      preview: createPreviewShell(
        createImageView({
          src: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
          alt: 'Panorama miasta',
          size: 'full',
          max: '28rem',
          dataTestId: 'image-view-max-width',
        }),
      ),
    }),
};
