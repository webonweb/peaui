import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import NotificationCenter from './index.vue';
import {
  notificationCenterDemoItems,
  notificationCenterDemoProps,
} from './notification-center.demo';
import type { NotificationCenterItem } from './notification-center.shared';

const meta: Meta<InstanceType<typeof NotificationCenter>['$props']> = {
  title: 'Feedback/NotificationCenter/Vue',
  component: NotificationCenter,
  args: notificationCenterDemoProps,
  parameters: { layout: 'centered' },
  render: (args) => ({
    components: { NotificationCenter },
    setup() {
      const items = ref<NotificationCenterItem[]>([...args.items]);
      const activeFilter = ref(args.activeFilter || 'all');
      const selectedId = ref(args.selectedId ?? null);
      const pendingItemIds = ref<(string | number)[]>([]);
      const updateRead = (item: NotificationCenterItem, read: boolean) => {
        pendingItemIds.value = [item.id];
        items.value = items.value.map((candidate) =>
          candidate.id === item.id ? { ...candidate, read } : candidate,
        );
        pendingItemIds.value = [];
      };
      const markAllRead = () => {
        items.value = items.value.map((item) => ({ ...item, read: true }));
      };
      return { args, items, activeFilter, selectedId, pendingItemIds, updateRead, markAllRead };
    },
    template: `
      <div style="width: 100%; max-width: 44rem; min-width: 0">
        <NotificationCenter
          v-bind="args"
          :items="items"
          v-model:active-filter="activeFilter"
          v-model:selected-id="selectedId"
          :pending-item-ids="pendingItemIds"
          @mark-read="updateRead($event, true)"
          @mark-unread="updateRead($event, false)"
          @mark-all-read="markAllRead"
        />
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<InstanceType<typeof NotificationCenter>['$props']>;

export const Default: Story = {};
export const MultipleInstances: Story = {
  render: (args) => ({
    components: { NotificationCenter },
    setup: () => ({ args }),
    template:
      '<div><NotificationCenter v-bind="args" group-by="date" :labels="{today: \'First today\'}" /><NotificationCenter v-bind="args" group-by="date" :labels="{today: \'Second today\'}" /></div>',
  }),
};
export const GroupedByType: Story = { args: { groupBy: 'type' } };
export const CompactDrawerContent: Story = {
  args: { variant: 'drawer-content', density: 'compact' },
};
export const Loading: Story = { args: { items: [], loading: true } };
export const Empty: Story = { args: { items: [], hasMore: false } };
export const Error: Story = {
  args: { items: [], error: 'The notification service is unavailable.', hasMore: false },
};
export const InfiniteLoading: Story = { args: { paginationMode: 'infinite', loadingMore: true } };
export const LongMobileContent: Story = {
  args: {
    items: [
      ...notificationCenterDemoItems,
      {
        id: 'long',
        title:
          'A notification with a very long localized title that must wrap in a narrow container',
        description:
          'Long content remains readable and actions wrap instead of forcing horizontal page overflow.',
        createdAt: '2026-08-05T09:00:00Z',
        read: false,
      },
    ],
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
