/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import TreeList from './index';

afterEach(cleanup);
it('starts collapsed and forwards a nested dictionary key through the public callback', () => {
  const onRemove = vi.fn();
  const tree = { label: 'Root', children: { stable: { label: 'Child', children: {} } } };
  render(<TreeList tree={tree} canRemove onRemove={onRemove} />);
  const toggle = screen.getByRole('button', { name: 'Root' });
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  fireEvent.click(toggle);
  expect(document.getElementById(toggle.getAttribute('aria-controls') ?? '')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Child/ }));
  expect(onRemove).toHaveBeenCalledExactlyOnceWith('stable');
  expect(tree.children.stable.label).toBe('Child');
});
