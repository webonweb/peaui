/** @jsxImportSource react */
import { cleanup, render } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import SectionDivider from './index';
afterEach(cleanup);
it('matches the Vue horizontal default and vertical separator semantics', () => {
  const { container, rerender } = render(<SectionDivider />);
  expect(container.querySelector('hr')?.className).toContain('--size-s');
  rerender(<SectionDivider direction="vertical" size="xl" />);
  expect(container.querySelector('hr')).toBeNull();
  expect(container.querySelector('[role="separator"]')?.getAttribute('aria-orientation')).toBe(
    'vertical',
  );
});
