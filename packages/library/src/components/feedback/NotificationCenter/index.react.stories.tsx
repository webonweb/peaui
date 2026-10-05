/** @jsxImportSource react */
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import NotificationCenter, { type NotificationCenterProps } from './index';
import {
  notificationCenterDemoItems,
  notificationCenterDemoProps,
} from './notification-center.demo';
import type {
  NotificationCenterItem,
  NotificationCenterItemId,
} from './notification-center.shared';

function ControlledNotificationCenter(props: NotificationCenterProps) {
  const [items, setItems] = useState<readonly NotificationCenterItem[]>(props.items);
  const [activeFilter, setActiveFilter] = useState(props.activeFilter || 'all');
  const [selectedId, setSelectedId] = useState<NotificationCenterItemId | null>(
    props.selectedId ?? null,
  );
  const updateRead = (item: NotificationCenterItem, read: boolean) => {
    setItems((current) =>
      current.map((candidate) => (candidate.id === item.id ? { ...candidate, read } : candidate)),
    );
  };

  return (
    <div style={{ width: '100%', maxWidth: '44rem', minWidth: 0 }}>
      <NotificationCenter
        {...props}
        items={items}
        activeFilter={activeFilter}
        selectedId={selectedId}
        onActiveFilterChange={setActiveFilter}
        onSelectedIdChange={setSelectedId}
        onMarkRead={(item) => updateRead(item, true)}
        onMarkUnread={(item) => updateRead(item, false)}
        onMarkAllRead={() =>
          setItems((current) => current.map((item) => ({ ...item, read: true })))
        }
      />
    </div>
  );
}

const meta = {
  title: 'React/feedback/NotificationCenter',
  component: NotificationCenter,
  args: {
    ...notificationCenterDemoProps,
    onAction: fn(),
    onActiveFilterChange: fn(),
    onFilterChange: fn(),
    onLoadMore: fn(),
    onMarkAllRead: fn(),
    onMarkRead: fn(),
    onMarkUnread: fn(),
    onRetry: fn(),
    onSelect: fn(),
    onSelectedIdChange: fn(),
  },
  parameters: { layout: 'centered' },
  render: (args) => <ControlledNotificationCenter {...args} />,
} satisfies Meta<typeof NotificationCenter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const MultipleInstances: Story = {
  render: (args) => (
    <div>
      <ControlledNotificationCenter {...args} groupBy="date" labels={{ today: 'First today' }} />
      <ControlledNotificationCenter {...args} groupBy="date" labels={{ today: 'Second today' }} />
    </div>
  ),
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
