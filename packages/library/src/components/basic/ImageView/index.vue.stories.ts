import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import ImageViewComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';

const { getSettings } = useSettingsStorie();

type StoryArgs = {
  alt?: string;
  dataTestId?: string;
  max?: string;
  size?: 'auto' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'full';
  src?: string;
};

const meta: Meta<typeof ImageViewComponent> = {
  title: '1. Basic/ImageView',
  component: ImageViewComponent,
  parameters: {
    name: 'ImageView',
    description:
      'Komponent do wyswietlania obrazu z fallbackiem dla `alt`, obsluga dekoracyjnego `alt=""` oraz rozmiarami przez prop `size`.',
    code: `
<script lang="ts" setup>
  import ImageView from "@peaui/ui/basic/ImageView";
</script>

<template>
  <ImageView
    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
    alt="Gorski krajobraz"
    size="m"
    max="24rem"
    dataTestId="image-view"
  />
</template>
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
};

export default meta;

type Story = StoryObj<typeof ImageViewComponent>;

function createPreviewTemplate(template: string) {
  return (args: StoryArgs) => ({
    components: { ImageViewComponent, StoryContent },
    setup() {
      return {
        args,
        settings: getSettings(meta),
      };
    },
    template,
  });
}

const baseTemplate = `
  <StoryContent :settings>
    <div
      style="
        width:100%;
        max-width:720px;
        padding:24px;
        border-radius:16px;
        background:#f8fafc;
      "
    >
      <ImageViewComponent v-bind="args" />
    </div>
  </StoryContent>
`;

export const ImageView: Story = {
  render: createPreviewTemplate(baseTemplate),
  args: {
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    alt: 'Gorski krajobraz',
    size: 'm',
    max: '24rem',
    dataTestId: 'image-view',
  },
};

export const FallbackAlt: Story = {
  render: createPreviewTemplate(baseTemplate),
  args: {
    src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee/fallback-landscape-photo.jpg',
    size: 'l',
    dataTestId: 'image-view-fallback',
  },
};

export const Decorative: Story = {
  render: createPreviewTemplate(baseTemplate),
  args: {
    src: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80',
    alt: '',
    size: 'full',
    dataTestId: 'image-view-decorative',
  },
};

export const Sizes: Story = {
  render: () => ({
    components: { ImageViewComponent, StoryContent },
    setup() {
      return {
        settings: getSettings(meta),
        sizes: ['xs', 's', 'm', 'l', 'xl', 'full'],
        src: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80',
      };
    },
    template: `
      <StoryContent :settings>
        <div
          style="
            display:grid;
            gap:20px;
            width:100%;
            max-width:920px;
            padding:24px;
            border-radius:16px;
            background:#f8fafc;
          "
        >
          <div
            v-for="size in sizes"
            :key="size"
            style="
              display:grid;
              gap:12px;
            "
          >
            <code style="font-size:12px; color:#475569;">size="{{ size }}"</code>
            <ImageViewComponent
              :src="src"
              alt="Przykladowe zdjecie krajobrazu"
              :size="size"
              :dataTestId="\`image-view-\${size}\`"
            />
          </div>
        </div>
      </StoryContent>
    `,
  }),
};

export const MaxWidth: Story = {
  render: createPreviewTemplate(baseTemplate),
  args: {
    src: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
    alt: 'Panorama miasta',
    size: 'full',
    max: '28rem',
    dataTestId: 'image-view-max-width',
  },
};
