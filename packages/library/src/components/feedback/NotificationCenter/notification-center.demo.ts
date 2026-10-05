import type {
  NotificationCenterBaseProps,
  NotificationCenterItem,
} from './notification-center.shared';

export const notificationCenterDemoItems: readonly NotificationCenterItem[] = [
  {
    id: 'deployment',
    title: 'Deployment completed',
    description: 'Production version 2.4.0 is available.',
    createdAt: '2026-08-10T08:45:00.000Z',
    read: false,
    type: 'system',
    typeLabel: 'System',
    priority: 'high',
    actions: [{ id: 'details', label: 'View details' }],
  },
  {
    id: 'mention',
    title: 'Anna mentioned you',
    description: 'Can you review the new dashboard before release?',
    createdAt: '2026-08-10T07:20:00.000Z',
    read: false,
    type: 'message',
    typeLabel: 'Messages',
    actions: [
      { id: 'open', label: 'Open conversation' },
      { id: 'mute', label: 'Mute' },
    ],
  },
  {
    id: 'invoice',
    title: 'Invoice needs attention',
    description: 'Invoice FV/08/2026 is due tomorrow.',
    createdAt: '2026-08-09T14:10:00.000Z',
    read: true,
    type: 'billing',
    typeLabel: 'Billing',
    priority: 'urgent',
    actions: [{ id: 'pay', label: 'Open invoice' }],
  },
  {
    id: 'report',
    title: 'Weekly report is ready',
    description: 'Traffic increased by 12% compared with last week.',
    createdAt: '2026-08-06T09:00:00.000Z',
    read: true,
    type: 'system',
    typeLabel: 'System',
  },
];

export const notificationCenterDemoProps: NotificationCenterBaseProps = {
  items: notificationCenterDemoItems,
  activeFilter: 'all',
  selectedId: null,
  groupBy: 'date',
  variant: 'panel',
  density: 'comfortable',
  paginationMode: 'pagination',
  hasMore: true,
  locale: 'en',
  referenceDate: '2026-08-10T12:00:00.000Z',
  ariaLabel: 'Example notification center',
};
