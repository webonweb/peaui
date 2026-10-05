import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import TransferListComponent from './index.vue';
import {
  transferListDemoValue,
  transferListItems,
  transferListLongItems,
} from './transfer-list.demo';

const meta = {
  title: '3. Data Entry/TransferList',
  component: TransferListComponent,
  args: {
    dataTestId: 'transfer-list-default',
    items: transferListItems,
    value: [...transferListDemoValue],
  },
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    size: { control: 'select', options: ['compact', 'standard'] },
    sort: { control: 'select', options: [false, 'asc', 'desc'] },
  },
  parameters: {
    name: 'TransferList',
    description:
      'Dwie dostępne listy wielokrotnego wyboru z niezależnym filtrowaniem, bezpiecznym transferem i responsywnym układem.',
  },
} satisfies Meta<InstanceType<typeof TransferListComponent>['$props']>;

export default meta;
type Story = StoryObj<InstanceType<typeof TransferListComponent>['$props']>;
const { getSettings } = useSettingsStorie();

export const Playground: Story = {
  render: (args) => ({
    components: { StoryContent, TransferListComponent },
    setup() {
      const value = ref([...(args.value ?? [])]);
      return { args, settings: getSettings(meta), value };
    },
    template: `<StoryContent :settings><TransferListComponent v-bind="args" v-model:value="value" /></StoryContent>`,
  }),
};

export const SearchAndSort: Story = { args: { sort: 'asc' } };
export const Compact: Story = { args: { size: 'compact' } };
export const DisabledItems: Story = {
  args: { disabledKeys: ['billing', 'exports'], value: ['analytics'] },
};
export const Empty: Story = { args: { items: [], value: [] } };
export const LoadingPerPanel: Story = { args: { loading: { source: true } } };
export const Error: Story = { args: { error: 'Nie udało się zapisać przypisania.' } };
export const ObjectsAndLongLabels: Story = { args: { items: transferListLongItems } };

export const VerticalMobile: Story = {
  args: { orientation: 'vertical' },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: (args) => ({
    components: { TransferListComponent },
    setup: () => ({ args }),
    template: `<div data-transfer-list-narrow style="inline-size:18rem;max-inline-size:100%"><TransferListComponent v-bind="args" /></div>`,
  }),
};

export const CustomItem: Story = {
  render: (args) => ({
    components: { TransferListComponent },
    setup: () => ({ args }),
    template: `
      <TransferListComponent v-bind="args">
        <template #item="{ label, panel }"><strong>{{ label }}</strong><small>{{ panel }}</small></template>
      </TransferListComponent>
    `,
  }),
};

export const Virtualized: Story = {
  args: {
    virtual: true,
    optionHeight: 64,
    items: Array.from({ length: 5000 }, (_, value) => ({
      key: value,
      value,
      label: `Option ${value}`,
    })),
    value: [0, 1],
  },
};
