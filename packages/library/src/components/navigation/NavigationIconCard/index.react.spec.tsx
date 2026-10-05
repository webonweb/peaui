/** @jsxImportSource react */
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import NavigationIconCard from './index';

afterEach(cleanup);
it('keeps the whole card keyboard reachable and respects an explicit tabIndex', () => {
  const { rerender } = render(<NavigationIconCard path="/profile" icon="info" text="Profile" />);
  expect(screen.getByRole('link').getAttribute('tabindex')).toBe('0');
  rerender(<NavigationIconCard path="/profile" icon="info" text="Profile" tabIndex={-1} />);
  expect(screen.getByRole('link').getAttribute('tabindex')).toBe('-1');
});
