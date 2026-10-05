/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import TreeList from './index';

afterEach(cleanup);
it('preserves branch connectors and emphasized labels at the same tree levels as Vue', () => {
  render(
    <TreeList
      tree={{
        label: 'root',
        children: {
          first: { label: 'branch', children: { leaf: { label: 'leaf', children: {} } } },
          last: { label: 'last', children: {} },
        },
      }}
    />,
  );
  const root = screen.getByRole('button', { name: 'Root' });
  expect(root.querySelector('svg')).toBeNull();
  expect(root.previousElementSibling).toHaveClass('peaui-tree-list__toggle-icon');
  fireEvent.click(root);
  const branch = screen.getByRole('button', { name: 'Branch' });
  expect(branch.querySelector('.peaui-tree-list__label')).toHaveClass(
    'peaui-tree-list__label--emphasized',
  );
  expect(
    screen
      .getByText('Last')
      .closest('.peaui-tree-list__row')
      ?.querySelector('.peaui-tree-list__connector-spacer'),
  ).not.toBeNull();
  fireEvent.click(branch);
  expect(
    branch.closest('.peaui-tree-list')?.querySelector('.peaui-tree-list__branch-line'),
  ).not.toBeNull();
});
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
