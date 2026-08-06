import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
import FullscreenContainerComponent from './index.vue';

const { getSettings } = useSettingsStorie();

type StoryArgs = {
  ariaLabel?: string;
  dataTestId?: string;
  openLabel?: string;
  closeLabel?: string;
};

const meta: Meta<typeof FullscreenContainerComponent> = {
  title: '6. Layout/FullscreenContainer',
  component: FullscreenContainerComponent,
  parameters: {
    name: 'FullscreenContainer',
    description:
      'Kontener layoutowy z wbudowanym przyciskiem przejscia do trybu pelnoekranowego. Renderuje slot jako zawartosc, pokazuje przycisk z ikona screen w prawym dolnym rogu i po kliknieciu przechodzi w fixed fullscreen.',
    code: `
<script setup lang="ts">
import FullscreenContainer from '@peaui/ui/layout/FullscreenContainer';
</script>

<template>
  <FullscreenContainer ariaLabel="Przykladowy kontener" dataTestId="fullscreen-container">
    <div>Dowolna zawartosc komponentu.</div>
  </FullscreenContainer>
</template>
    `,
  },
  argTypes: {
    ariaLabel: {
      control: { type: 'text' },
      description: 'Opcjonalny aria-label dla kontenera.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Bazowy data-testid dla root i elementow pomocniczych.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    openLabel: {
      control: { type: 'text' },
      description: 'Etykieta przycisku w stanie domyslnym.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: 'Otwórz tryb pełnoekranowy' },
      },
    },
    closeLabel: {
      control: { type: 'text' },
      description: 'Etykieta przycisku po otwarciu pelnego ekranu.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: 'Zamknij tryb pełnoekranowy' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof FullscreenContainerComponent>;

const renderStory = (args: StoryArgs) => ({
  components: { FullscreenContainerComponent, StoryContent },
  setup() {
    const settings = getSettings(meta);
    return { args, settings };
  },
  template: `
    <StoryContent :settings>
      <div style="width: min(100%, 56rem);">
        <FullscreenContainerComponent v-bind="args">
          <div style="display: grid; gap: 1rem;">
            <div style="padding: 1rem; border-radius: 0.75rem; background: #f4f6f8;">
              Naglowek sekcji
            </div>
            <div style="padding: 1rem; border-radius: 0.75rem; background: #ffffff; border: 1px solid #d7dde3;">
              Dowolna zawartosc komponentu moze byc wyswietlana wewnatrz slotu.
            </div>
            <div style="padding: 1rem; border-radius: 0.75rem; background: #eef5ef;">
              Przykladowy blok pomocniczy.
            </div>
          </div>
        </FullscreenContainerComponent>
      </div>
    </StoryContent>
  `,
});

export const FullscreenContainer: Story = {
  render: renderStory,
  args: {
    ariaLabel: 'Przykladowy kontener fullscreen',
    dataTestId: 'fullscreen-container',
    openLabel: 'Otwórz tryb pełnoekranowy',
    closeLabel: 'Zamknij tryb pełnoekranowy',
  },
};

export const LongContent: Story = {
  render: (args: StoryArgs) => ({
    components: { FullscreenContainerComponent, StoryContent },
    setup() {
      const settings = getSettings(meta);
      const sections = Array.from({ length: 10 }, (_, index) => ({
        id: index + 1,
        title: `Sekcja ${index + 1}`,
        description:
          'Ten wariant pokazuje, jak zachowuje sie komponent przy wiekszej ilosci tresci po otwarciu pelnego ekranu.',
      }));
      return { args, sections, settings };
    },
    template: `
      <StoryContent :settings>
        <div style="width: min(100%, 64rem);">
          <FullscreenContainerComponent v-bind="args">
            <div style="display: grid; gap: 0.75rem;">
              <article
                v-for="section in sections"
                :key="section.id"
                style="padding: 1rem; border-radius: 0.75rem; border: 1px solid #d7dde3; background: #ffffff;"
              >
                <strong>{{ section.title }}</strong>
                <p style="margin: 0.5rem 0 0;">{{ section.description }}</p>
              </article>
            </div>
          </FullscreenContainerComponent>
        </div>
      </StoryContent>
    `,
  }),
  args: {
    ariaLabel: 'Kontener z dluga zawartoscia',
    dataTestId: 'fullscreen-container-long',
    openLabel: 'Otwórz tryb pełnoekranowy',
    closeLabel: 'Zamknij tryb pełnoekranowy',
  },
};
