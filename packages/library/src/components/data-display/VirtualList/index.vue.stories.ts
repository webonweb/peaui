import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import VirtualListComponent from './index.vue';
import { virtualListDemoItems } from './virtual-list.demo';
import type { VirtualListHandle } from './virtual-list.shared';

const meta = {
  title: '4. Data Display/VirtualList',
  component: VirtualListComponent,
  args: {
    ariaLabel: 'Wyniki wyszukiwania',
    dataTestId: 'virtual-list-default',
    height: 320,
    items: virtualListDemoItems,
    itemSize: 64,
    overscan: 4,
  },
  argTypes: {
    semanticRole: { control: 'select', options: ['list', 'listbox'] },
    height: { control: 'text' },
    itemSize: { control: { type: 'range', min: 24, max: 120, step: 4 } },
    overscan: { control: { type: 'range', min: 0, max: 20, step: 1 } },
  },
  parameters: {
    name: 'VirtualList',
    description:
      'Wydajna lista stałej wysokości oparta na ScrollArea, z ograniczonym DOM, stabilnym focusem i kompletnym API przewijania.',
  },
} satisfies Meta<typeof VirtualListComponent>;

export default meta;
type Story = StoryObj<typeof meta>;
const { getSettings } = useSettingsStorie();

export const LargeDataset: Story = {
  render: (args) => ({
    components: { StoryContent, VirtualListComponent },
    setup: () => ({ args, settings: getSettings(meta) }),
    template: `<StoryContent :settings><VirtualListComponent v-bind="args" /></StoryContent>`,
  }),
};

export const ListboxKeyboard: Story = {
  args: { semanticRole: 'listbox' },
  render: (args) => ({
    components: { StoryContent, VirtualListComponent },
    setup() {
      const activeIndex = ref<number | null>(0);
      return { activeIndex, args, settings: getSettings(meta) };
    },
    template: `<StoryContent :settings><VirtualListComponent v-bind="args" v-model:active-index="activeIndex" /></StoryContent>`,
  }),
};

export const Programmatic: Story = {
  render: (args) => ({
    components: { StoryContent, VirtualListComponent },
    setup() {
      const list = ref<VirtualListHandle>();
      return { args, list, settings: getSettings(meta) };
    },
    template: `<StoryContent :settings><div style="display:grid;gap:.75rem"><button type="button" @click="list?.scrollToIndex(7500, 'center')">Przejdź do wyniku 7501</button><VirtualListComponent ref="list" v-bind="args" /></div></StoryContent>`,
  }),
};

export const Empty: Story = { args: { items: [] } };
export const InitialLoading: Story = { args: { items: [], loading: true } };
export const LoadingMore: Story = { args: { hasMore: true, loading: true } };
export const Error: Story = { args: { error: 'Nie udało się pobrać kolejnej strony.' } };

export const DynamicCollection: Story = {
  render: (args) => ({
    components: { StoryContent, VirtualListComponent },
    setup() {
      const count = ref(100);
      return { args, count, items: virtualListDemoItems, settings: getSettings(meta) };
    },
    template: `<StoryContent :settings><div style="display:grid;gap:.75rem"><button type="button" @click="count = count === 100 ? 250 : 100">Zmień liczbę elementów</button><VirtualListComponent v-bind="args" :items="items.slice(0, count)" /></div></StoryContent>`,
  }),
};

export const LongContentMobile: Story = {
  args: {
    height: 280,
    items: virtualListDemoItems.slice(0, 500).map((item) => ({
      ...item,
      label: `${item.label} — bardzo długa nazwa tolerująca wąski kontener i powiększony tekst`,
    })),
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: (args) => ({
    components: { VirtualListComponent },
    setup: () => ({ args }),
    template: `<div data-virtual-list-narrow style="inline-size:18rem;max-inline-size:100%"><VirtualListComponent v-bind="args" /></div>`,
  }),
};

export const CustomItem: Story = {
  render: (args) => ({
    components: { VirtualListComponent },
    setup: () => ({ args }),
    template: `<VirtualListComponent v-bind="args"><template #item="{ item, index }"><strong>{{ index + 1 }}. {{ item.label }}</strong><small>{{ item.description }}</small></template></VirtualListComponent>`,
  }),
};
