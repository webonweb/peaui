import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import SplitButtonComponent from './index.vue';
import { splitButtonDemoItems, splitButtonDemoProps } from './split-button.demo';

const meta = {
  title: '3. Data Entry/SplitButton',
  component: SplitButtonComponent,
  parameters: {
    name: 'SplitButton',
    description:
      'Dwie wyraźnie rozdzielone akcje: główna i menu alternatywne. Wspiera niezależne blokady, stany loading oraz pełną obsługę klawiatury.',
  },
  argTypes: {
    menuAlign: { control: 'select', options: ['start', 'end'] },
    size: { control: 'select', options: ['xxs', 'xs', 's', 'm', 'l'] },
    variant: { control: 'select', options: ['primary', 'secondary', 'danger'] },
  },
} satisfies Meta<typeof SplitButtonComponent>;

export default meta;
type Story = StoryObj<typeof meta>;
const { getSettings } = useSettingsStorie();

export const Playground: Story = {
  render: (args) => ({
    components: { SplitButtonComponent, StoryContent },
    setup: () => ({ args, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <SplitButtonComponent v-bind="args" v-model:open="args.open" />
      </StoryContent>
    `,
  }),
  args: { ...splitButtonDemoProps, dataTestId: 'split-button-default', open: false },
};

export const VariantsAndSizes: Story = {
  render: () => ({
    components: { SplitButtonComponent, StoryContent },
    setup: () => ({ splitButtonDemoItems, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div data-split-button-parity style="display:grid;gap:1rem;justify-items:start">
          <SplitButtonComponent v-for="variant in ['primary','secondary','danger']" :key="variant"
            :aria-label="'Akcje ' + variant" :items="splitButtonDemoItems" label="Eksportuj" menu-aria-label="Więcej opcji eksportu"
            :variant="variant" />
          <SplitButtonComponent v-for="size in ['xxs','xs','s','m','l']" :key="size"
            :aria-label="'Rozmiar ' + size" :items="splitButtonDemoItems" label="Pobierz raport" menu-aria-label="Więcej opcji pobierania"
            :size="size" variant="secondary" />
        </div>
      </StoryContent>
    `,
  }),
};

export const LoadingAndDisabled: Story = {
  render: () => ({
    components: { SplitButtonComponent, StoryContent },
    setup: () => ({ splitButtonDemoItems, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:flex-start">
          <SplitButtonComponent aria-label="Eksportowanie" :items="splitButtonDemoItems" label="Eksportuj" loading loading-label="Trwa eksportowanie" />
          <SplitButtonComponent aria-label="Pobieranie opcji" :items="splitButtonDemoItems" label="Eksportuj" menu-loading menu-loading-label="Pobieranie formatów…" open />
          <SplitButtonComponent aria-label="Główna akcja niedostępna" :items="splitButtonDemoItems" label="Eksportuj" primary-disabled />
          <SplitButtonComponent aria-label="Menu niedostępne" :items="splitButtonDemoItems" label="Eksportuj" menu-disabled />
          <SplitButtonComponent aria-label="Całość niedostępna" :items="splitButtonDemoItems" label="Eksportuj" disabled />
        </div>
      </StoryContent>
    `,
  }),
};

export const Controlled: Story = {
  render: () => ({
    components: { SplitButtonComponent, StoryContent },
    setup() {
      const open = ref(false);
      const selection = ref('Brak');
      return { open, selection, settings: getSettings(meta), splitButtonDemoItems };
    },
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:.75rem;justify-items:start">
          <SplitButtonComponent v-model:open="open" aria-label="Kontrolowane akcje eksportu" :items="splitButtonDemoItems"
            label="Eksportuj" menu-aria-label="Wybierz format eksportu" @primary-click="selection = 'Główna akcja'"
            @select="selection = $event.label" />
          <output>Otwarte: {{ open ? 'tak' : 'nie' }}; wybrano: {{ selection }}</output>
        </div>
      </StoryContent>
    `,
  }),
};

export const MobileAndLongLabel: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    components: { SplitButtonComponent },
    setup: () => ({ splitButtonDemoItems }),
    template: `
      <div data-split-button-mobile style="inline-size:18rem;max-inline-size:100%;padding-block:1rem">
        <SplitButtonComponent aria-label="Akcje bardzo długiego raportu" :items="splitButtonDemoItems"
          label="Eksportuj bardzo długi raport podsumowujący cały kwartał" menu-aria-label="Więcej opcji eksportu raportu"
          data-test-id="split-button-mobile" />
      </div>
    `,
  }),
};
