import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import SegmentedControlComponent from './index.vue';
import { segmentedControlPeriodItems, segmentedControlViewItems } from './segmented-control.demo';

const meta = {
  title: '3. Data Entry/SegmentedControl',
  component: SegmentedControlComponent,
  parameters: {
    name: 'SegmentedControl',
    description:
      'Kompaktowa radiogroup do wyboru dokładnie jednej natychmiastowej opcji. Do przełączania paneli treści użyj NavigationTabs.',
  },
  argTypes: {
    activation: { control: 'select', options: ['automatic', 'manual'] },
    content: { control: 'select', options: ['text', 'icon', 'icon-text'] },
    distribution: { control: 'select', options: ['equal', 'auto'] },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    size: { control: 'select', options: ['s', 'm', 'l'] },
  },
} satisfies Meta<typeof SegmentedControlComponent>;

export default meta;
type Story = StoryObj<typeof meta>;
const { getSettings } = useSettingsStorie();

export const Playground: Story = {
  render: (args) => ({
    components: { SegmentedControlComponent, StoryContent },
    setup: () => ({ args, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <SegmentedControlComponent v-bind="args" v-model:value="args.value" />
      </StoryContent>
    `,
  }),
  args: {
    ariaLabel: 'Sposób wyświetlania',
    dataTestId: 'segmented-control-default',
    items: segmentedControlViewItems,
    value: 'grid',
  },
};

export const DistributionAndWidth: Story = {
  render: () => ({
    components: { SegmentedControlComponent, StoryContent },
    setup: () => ({ segmentedControlPeriodItems, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:1.5rem;inline-size:min(100%,42rem)">
          <SegmentedControlComponent aria-label="Równy rozkład" :items="segmentedControlPeriodItems" :value="30" />
          <SegmentedControlComponent aria-label="Naturalny rozkład" distribution="auto" :items="segmentedControlPeriodItems" :value="90" />
          <SegmentedControlComponent aria-label="Pełna szerokość" full-width :items="segmentedControlPeriodItems" :value="365" />
        </div>
      </StoryContent>
    `,
  }),
};

export const ContentAndSizes: Story = {
  render: () => ({
    components: { SegmentedControlComponent, StoryContent },
    setup: () => ({ segmentedControlViewItems, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:1.5rem;justify-items:start">
          <SegmentedControlComponent aria-label="Ikony" content="icon" :items="segmentedControlViewItems" size="s" value="list" />
          <SegmentedControlComponent aria-label="Ikony i tekst" content="icon-text" :items="segmentedControlViewItems" size="m" value="grid" />
          <SegmentedControlComponent aria-label="Tekst" :items="segmentedControlViewItems" size="l" value="compact" />
        </div>
      </StoryContent>
    `,
  }),
};

export const DisabledStates: Story = {
  render: () => ({
    components: { SegmentedControlComponent, StoryContent },
    setup: () => ({ segmentedControlViewItems, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:1.5rem;justify-items:start">
          <SegmentedControlComponent aria-label="Wyłączona pozycja" :items="segmentedControlViewItems.map((item, index) => ({ ...item, disabled: index === 1 }))" value="list" />
          <SegmentedControlComponent aria-label="Wyłączona grupa" disabled :items="segmentedControlViewItems" value="grid" />
          <SegmentedControlComponent aria-label="Niepoprawna wartość" :items="segmentedControlViewItems" value="missing" />
        </div>
      </StoryContent>
    `,
  }),
};

export const Controlled: Story = {
  render: () => ({
    components: { SegmentedControlComponent, StoryContent },
    setup() {
      const value = ref<string | number | null>('list');
      return { segmentedControlViewItems, settings: getSettings(meta), value };
    },
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:.75rem;justify-items:start">
          <SegmentedControlComponent v-model:value="value" aria-label="Kontrolowany widok" :items="segmentedControlViewItems" />
          <output>Wybrano: {{ value }}</output>
        </div>
      </StoryContent>
    `,
  }),
};

export const ManualActivation: Story = {
  args: {
    activation: 'manual',
    ariaLabel: 'Ręczna aktywacja',
    items: segmentedControlViewItems,
    value: 'list',
  },
};

export const VerticalAndRtl: Story = {
  render: () => ({
    components: { SegmentedControlComponent, StoryContent },
    setup: () => ({ segmentedControlViewItems, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div style="display:flex;flex-wrap:wrap;gap:2rem;align-items:start;max-width:100%;min-width:0;width:100%">
          <div style="flex:1 1 14rem;max-width:100%;min-width:0">
            <SegmentedControlComponent aria-label="Układ pionowy" :items="segmentedControlViewItems" orientation="vertical" value="grid" />
          </div>
          <div dir="rtl" style="flex:1 1 14rem;max-width:100%;min-width:0">
            <SegmentedControlComponent aria-label="Kierunek RTL" :items="segmentedControlViewItems" value="grid" />
          </div>
        </div>
      </StoryContent>
    `,
  }),
};

export const MobileOverflow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    components: { SegmentedControlComponent },
    setup: () => ({
      items: Array.from({ length: 8 }, (_, index) => ({
        value: index,
        label: `Bardzo długa opcja ${index + 1}`,
      })),
    }),
    template: `<div data-segmented-control-mobile style="inline-size:20rem;max-inline-size:100%"><SegmentedControlComponent aria-label="Zakres raportu" data-test-id="segmented-control-mobile" full-width :items="items" :value="0" /></div>`,
  }),
};

export const ReducedMotion: Story = {
  args: {
    ariaLabel: 'Ograniczony ruch',
    items: segmentedControlViewItems,
    value: 'grid',
  },
  parameters: {
    description: 'W trybie prefers-reduced-motion wskaźnik zmienia pozycję bez animacji.',
  },
};

export const DarkMode: Story = {
  args: {
    ariaLabel: 'Widok w ciemnym motywie',
    content: 'icon-text',
    items: segmentedControlViewItems,
    value: 'grid',
  },
  parameters: { backgrounds: { default: 'dark' } },
};
