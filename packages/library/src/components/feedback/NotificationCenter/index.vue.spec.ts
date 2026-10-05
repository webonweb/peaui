import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import NotificationCenter from './index.vue';
import type { NotificationCenterItem } from './notification-center.shared';

const items: readonly NotificationCenterItem[] = [
  {
    id: 'one',
    title: 'First notification',
    description: 'First description',
    createdAt: '2026-08-10T08:00:00Z',
    read: false,
    type: 'system',
    actions: [{ id: 'open', label: 'Open' }],
  },
  {
    id: 'two',
    title: 'Second notification',
    createdAt: '2026-08-09T08:00:00Z',
    read: true,
    type: 'message',
  },
];

describe('NotificationCenter Vue', () => {
  it('keeps date-group heading relationships unique across instances', () => {
    const wrapper = mount({
      render: () =>
        h(
          'div',
          ['First today', 'Second today'].map((today) =>
            h(NotificationCenter, {
              items,
              groupBy: 'date',
              referenceDate: '2026-08-10T12:00:00Z',
              labels: { today },
            }),
          ),
        ),
    });
    const groups = wrapper.findAll('.peaui-notification-center__group');
    const ids = groups.map((group) => group.attributes('aria-labelledby'));
    expect(new Set(ids).size).toBe(ids.length);
    groups.forEach((group) =>
      expect(group.find('h3').attributes('id')).toBe(group.attributes('aria-labelledby')),
    );
    wrapper.unmount();
  });
  it('renders controlled items and exposes unread state semantically', () => {
    const wrapper = mount(NotificationCenter, {
      props: { items, referenceDate: '2026-08-10T12:00:00Z' },
    });

    expect(wrapper.text()).toContain('First notification');
    expect(wrapper.text()).toContain('Unread notification');
    expect(wrapper.find('time').attributes('datetime')).toBe('2026-08-10T08:00:00.000Z');
  });

  it('emits selection and read intents without mutating items', async () => {
    const snapshot = JSON.stringify(items);
    const wrapper = mount(NotificationCenter, { props: { items } });

    await wrapper.get('.peaui-notification-center__item-main').trigger('click');
    const markRead = wrapper.findAll('button').find((button) => button.text() === 'Mark as read');
    await markRead?.trigger('click');

    expect(wrapper.emitted('update:selectedId')?.[0]).toEqual(['one']);
    expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ item: items[0], index: 0 });
    expect(wrapper.emitted('markRead')?.[0]).toEqual([items[0]]);
    expect(JSON.stringify(items)).toBe(snapshot);
  });

  it('emits filter and item action payloads', async () => {
    const wrapper = mount(NotificationCenter, { props: { items } });
    await wrapper.findAll('.peaui-notification-center__filter')[1]?.trigger('click');
    const open = wrapper.findAll('button').find((button) => button.text() === 'Open');
    await open?.trigger('click');

    expect(wrapper.emitted('update:activeFilter')?.[0]).toEqual(['unread']);
    expect(wrapper.emitted('filterChange')?.[0]).toEqual(['unread']);
    expect(wrapper.emitted('action')?.[0]?.[0]).toMatchObject({
      item: items[0],
      action: items[0]?.actions?.[0],
      index: 0,
    });
  });

  it('deduplicates load-more requests until controlled state changes', async () => {
    const wrapper = mount(NotificationCenter, { props: { items, hasMore: true } });
    const loadButton = wrapper.findAll('button').find((button) => button.text() === 'Load more');
    await loadButton?.trigger('click');
    await loadButton?.trigger('click');

    expect(wrapper.emitted('loadMore')).toHaveLength(1);
    expect(wrapper.emitted('loadMore')?.[0]).toEqual([{ mode: 'pagination', visibleCount: 2 }]);
  });

  it('keeps pending item intents disabled', async () => {
    const wrapper = mount(NotificationCenter, { props: { items, pendingItemIds: ['one'] } });
    await wrapper.get('.peaui-notification-center__item-main').trigger('click');

    expect(wrapper.emitted('select')).toBeUndefined();
    expect(
      wrapper.get('.peaui-notification-center__item-main').attributes('disabled'),
    ).toBeDefined();
  });
});
