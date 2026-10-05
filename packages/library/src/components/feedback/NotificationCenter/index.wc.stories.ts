import type { Meta, StoryObj } from '@storybook/web-components';
import { UIKIT_NAME } from '../../../constants';
import { defineNotificationCenter } from './index.wc';
import {
  notificationCenterDemoItems,
  notificationCenterDemoProps,
} from './notification-center.demo';
import type { NotificationCenterBaseProps } from './notification-center.shared';

type StoryArgs = NotificationCenterBaseProps & { style?: string };

defineNotificationCenter();

function renderNotificationCenter(args: StoryArgs): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.style.width = args.style || '100%';
  wrapper.style.maxWidth = '44rem';
  wrapper.style.minWidth = '0';
  const element = document.createElement(`${UIKIT_NAME}-notification-center`);
  Object.assign(element, args);
  const eventValue = <Value>(event: Event): Value => {
    const detail = (event as CustomEvent<Value | [Value]>).detail;
    return (Array.isArray(detail) ? detail[0] : detail) as Value;
  };
  const updateItem = (event: Event, read: boolean) => {
    const item = eventValue<{ id: string | number }>(event);
    const currentItems = (
      element as HTMLElement & { items: readonly { id: string | number; read: boolean }[] }
    ).items;
    Object.assign(element, {
      items: currentItems.map((candidate) =>
        candidate.id === item.id ? { ...candidate, read } : candidate,
      ),
    });
  };
  element.addEventListener('update:activeFilter', (event) => {
    Object.assign(element, { activeFilter: eventValue<string>(event) });
  });
  element.addEventListener('update:selectedId', (event) => {
    Object.assign(element, { selectedId: eventValue<string | number>(event) });
  });
  element.addEventListener('markRead', (event) => updateItem(event, true));
  element.addEventListener('markUnread', (event) => updateItem(event, false));
  element.addEventListener('markAllRead', () => {
    const currentItems = (element as HTMLElement & { items: readonly { read: boolean }[] }).items;
    Object.assign(element, { items: currentItems.map((item) => ({ ...item, read: true })) });
  });
  wrapper.append(element);
  return wrapper;
}

const meta = {
  title: 'Feedback/NotificationCenter/Web Components',
  render: renderNotificationCenter,
  args: notificationCenterDemoProps,
  parameters: { layout: 'centered' },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<StoryArgs>;

export const Default: Story = {};
export const MultipleInstances: Story = {
  render: (args) => {
    const wrapper = document.createElement('div');
    for (const today of ['First today', 'Second today'])
      wrapper.append(renderNotificationCenter({ ...args, groupBy: 'date', labels: { today } }));
    return wrapper;
  },
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
    style: '100%',
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
