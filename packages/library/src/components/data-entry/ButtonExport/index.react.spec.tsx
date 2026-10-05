/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import ButtonExport from './index';

afterEach(cleanup);

it('uses the shared small counter badge inside every export button size', () => {
  const { rerender } = render(<ButtonExport selectedItemsCount={3}>Export</ButtonExport>);
  expect(screen.getByRole('status')).toHaveClass('peaui-counter-badge--size-s');
  expect(screen.getByRole('status')).toHaveTextContent('3');
  rerender(
    <ButtonExport size="s" selectedItemsCount={12}>
      Export
    </ButtonExport>,
  );
  expect(screen.getByRole('status')).toHaveClass('peaui-counter-badge--size-s');
  expect(screen.getByRole('status')).toHaveTextContent('12');
});
