/** @jsxImportSource react */
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import NotificationCenter from './index';
import type { NotificationCenterItem } from './notification-center.shared';

const items: readonly NotificationCenterItem[] = [
  {
    id: 'one',
    title: 'First notification',
    createdAt: '2026-08-10T08:00:00Z',
    read: false,
    actions: [{ id: 'open', label: 'Open' }],
  },
  { id: 'two', title: 'Second notification', createdAt: '2026-08-09T08:00:00Z', read: true },
];

describe('NotificationCenter React', () => {
  it('renders semantic controlled content and emits selection', () => {
    const onSelect = vi.fn();
    const onSelectedIdChange = vi.fn();
    const { container } = render(
      <NotificationCenter
        items={items}
        referenceDate="2026-08-10T12:00:00Z"
        onSelect={onSelect}
        onSelectedIdChange={onSelectedIdChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /First notification/i }));
    expect(onSelectedIdChange).toHaveBeenCalledWith('one');
    expect(onSelect).toHaveBeenCalledWith({ item: items[0], index: 0 });
    expect(screen.getByText('Unread notification')).toBeInTheDocument();
    expect(container.querySelector('time')).toHaveAttribute('datetime', '2026-08-10T08:00:00.000Z');
  });

  it('emits filter, read, and action intents', () => {
    const onFilterChange = vi.fn();
    const onMarkRead = vi.fn();
    const onAction = vi.fn();
    render(
      <NotificationCenter
        items={items}
        onFilterChange={onFilterChange}
        onMarkRead={onMarkRead}
        onAction={onAction}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Unread' }));
    fireEvent.click(screen.getByRole('button', { name: 'Mark as read' }));
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));

    expect(onFilterChange).toHaveBeenCalledWith('unread');
    expect(onMarkRead).toHaveBeenCalledWith(items[0]);
    expect(onAction).toHaveBeenCalledWith({
      item: items[0],
      action: items[0]?.actions?.[0],
      index: 0,
    });
  });

  it('deduplicates load-more requests', () => {
    const onLoadMore = vi.fn();
    const { rerender } = render(
      <NotificationCenter items={items} hasMore onLoadMore={onLoadMore} />,
    );
    const button = screen.getByRole('button', { name: 'Load more' });
    fireEvent.click(button);
    fireEvent.click(button);

    expect(onLoadMore).toHaveBeenCalledTimes(1);
    expect(onLoadMore).toHaveBeenCalledWith({ mode: 'pagination', visibleCount: 2 });
    expect(button).toBeDisabled();
    rerender(<NotificationCenter items={items} hasMore loadingMore onLoadMore={onLoadMore} />);
    rerender(<NotificationCenter items={items} hasMore onLoadMore={onLoadMore} />);
    expect(button).not.toBeDisabled();
    fireEvent.click(button);
    expect(onLoadMore).toHaveBeenCalledTimes(2);
  });

  it('renders loading, error, and empty states', () => {
    const { rerender } = render(<NotificationCenter items={[]} loading />);
    expect(screen.getByLabelText('Loading notifications')).toBeInTheDocument();

    rerender(<NotificationCenter items={[]} error="Network unavailable" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Network unavailable');

    rerender(<NotificationCenter items={[]} />);
    expect(screen.getByText('No notifications')).toBeInTheDocument();
  });
});
