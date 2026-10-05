import { describe, expect, it, vi } from 'vitest';
import {
  filterNotificationCenterItems,
  formatNotificationCenterDate,
  getNotificationCenterUnreadCount,
  groupNotificationCenterItems,
  resolveNotificationCenterLabels,
  type NotificationCenterItem,
} from './notification-center.shared';

const items: readonly NotificationCenterItem[] = [
  { id: 1, title: 'Unread system', createdAt: '2026-08-10T08:00:00Z', read: false, type: 'system' },
  { id: 2, title: 'Read message', createdAt: '2026-08-09T08:00:00Z', read: true, type: 'message' },
  {
    id: 3,
    title: 'Urgent system',
    createdAt: '2026-08-10T09:00:00Z',
    read: false,
    type: 'system',
    priority: 'urgent',
  },
];

describe('NotificationCenter shared behavior', () => {
  it('bounds formatter construction independently of item count and preserves date groups', () => {
    const DateFormatter = Intl.DateTimeFormat;
    const RelativeFormatter = Intl.RelativeTimeFormat;
    const dates = vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(function (locales, options) {
      return new DateFormatter(locales, options);
    });
    const relative = vi
      .spyOn(Intl, 'RelativeTimeFormat')
      .mockImplementation(function (locales, options) {
        return new RelativeFormatter(locales, options);
      });
    try {
      const many = Array.from({ length: 1000 }, (_, id) => ({
        id,
        title: 'Item',
        read: false,
        createdAt: '2026-07-01T12:00:00Z',
      }));
      const groups = groupNotificationCenterItems(
        many,
        'date',
        'en-NZ',
        '2026-08-10T12:00:00Z',
        resolveNotificationCenterLabels(),
      );
      many.forEach((item) => {
        formatNotificationCenterDate(item.createdAt, 'en-NZ', '2026-08-10T12:00:00Z');
        formatNotificationCenterDate('2026-08-09T12:00:00Z', 'en-NZ', '2026-08-10T12:00:00Z');
      });
      expect(groups).toHaveLength(1);
      expect(groups[0]?.items).toHaveLength(1000);
      expect(dates.mock.calls.length).toBeLessThanOrEqual(2);
      expect(relative.mock.calls.length).toBeLessThanOrEqual(1);
      expect(
        formatNotificationCenterDate('2026-08-09T12:00:00Z', 'en-NZ', '2026-08-10T12:00:00Z'),
      ).toBe('yesterday');
    } finally {
      dates.mockRestore();
      relative.mockRestore();
    }
  });
  it('filters without mutating the source array', () => {
    const snapshot = JSON.stringify(items);
    const result = filterNotificationCenterItems(items, {
      id: 'unread-system',
      label: 'Unread system',
      unreadOnly: true,
      types: ['system'],
    });

    expect(result.map((item) => item.id)).toEqual([1, 3]);
    expect(JSON.stringify(items)).toBe(snapshot);
    expect(result).not.toBe(items);
  });

  it('groups in first-occurrence order without reordering items', () => {
    const groups = groupNotificationCenterItems(
      items,
      'type',
      'en',
      '2026-08-10T12:00:00Z',
      resolveNotificationCenterLabels(),
    );

    expect(groups.map((group) => group.label)).toEqual(['system', 'message']);
    expect(groups[0]?.items.map((item) => item.id)).toEqual([1, 3]);
  });

  it('calculates unread count from controlled data', () => {
    expect(getNotificationCenterUnreadCount(items)).toBe(2);
  });

  it('formats recent and older dates with the requested locale', () => {
    expect(formatNotificationCenterDate('2026-08-09T08:00:00Z', 'en', '2026-08-10T12:00:00Z')).toBe(
      'yesterday',
    );
    expect(
      formatNotificationCenterDate('2026-07-01T08:00:00Z', 'en', '2026-08-10T12:00:00Z'),
    ).toContain('Jul');
  });
});
