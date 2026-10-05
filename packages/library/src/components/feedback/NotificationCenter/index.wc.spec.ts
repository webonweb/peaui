import { nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { UIKIT_NAME } from '../../../constants';
import './index.wc';
import type { NotificationCenterItem } from './notification-center.shared';

const items: readonly NotificationCenterItem[] = [
  {
    id: 'one',
    title: 'Web component notification',
    createdAt: '2026-08-10T08:00:00Z',
    read: false,
  },
];

type NotificationCenterTestElement = HTMLElement & {
  items: readonly NotificationCenterItem[];
  hasMore?: boolean;
};

async function renderElement(
  properties: Partial<NotificationCenterTestElement> = {},
): Promise<NotificationCenterTestElement> {
  const element = document.createElement(
    `${UIKIT_NAME}-notification-center`,
  ) as NotificationCenterTestElement;
  Object.assign(element, { items, ...properties });
  document.body.append(element);
  await nextTick();
  await nextTick();
  return element;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('NotificationCenter Web Component', () => {
  it('keeps group headings unique across separate custom-element instances', async () => {
    const first = await renderElement();
    const second = await renderElement();
    Object.assign(first, {
      groupBy: 'date',
      referenceDate: '2026-08-10T12:00:00Z',
      labels: { today: 'First today' },
    });
    Object.assign(second, {
      groupBy: 'date',
      referenceDate: '2026-08-10T12:00:00Z',
      labels: { today: 'Second today' },
    });
    await nextTick();
    const firstGroup = first.querySelector('.peaui-notification-center__group')!;
    const secondGroup = second.querySelector('.peaui-notification-center__group')!;
    expect(firstGroup.getAttribute('aria-labelledby')).not.toBe(
      secondGroup.getAttribute('aria-labelledby'),
    );
    expect(
      document.getElementById(secondGroup.getAttribute('aria-labelledby')!)?.textContent,
    ).toContain('Second today');
  });
  it('renders items and accessible unread text in light DOM', async () => {
    const element = await renderElement();

    expect(element).toHaveAttribute('role', 'region');
    expect(element.textContent).toContain('Web component notification');
    expect(element.textContent).toContain('Unread notification');
    expect(element.querySelector('time')?.getAttribute('datetime')).toBe(
      '2026-08-10T08:00:00.000Z',
    );
  });

  it('dispatches a composed selection event', async () => {
    const element = await renderElement();
    const listener = vi.fn();
    element.addEventListener('select', listener);
    (element.querySelector('.peaui-notification-center__item-main') as HTMLButtonElement).click();
    await nextTick();

    expect(listener).toHaveBeenCalledTimes(1);
    const event = listener.mock.calls[0]?.[0] as CustomEvent;
    expect(event.composed).toBe(true);
    const detail = Array.isArray(event.detail) ? event.detail[0] : event.detail;
    expect(detail).toMatchObject({ item: items[0], index: 0 });
  });

  it('deduplicates load-more custom events', async () => {
    const element = await renderElement({ hasMore: true });
    const listener = vi.fn();
    element.addEventListener('loadMore', listener);
    const button = [...element.querySelectorAll('button')].find(
      (candidate) => candidate.textContent?.trim() === 'Load more',
    ) as HTMLButtonElement;
    button.click();
    button.click();
    await nextTick();

    expect(listener).toHaveBeenCalledTimes(1);
  });
});
