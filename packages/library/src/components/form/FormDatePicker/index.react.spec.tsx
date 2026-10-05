/** @jsxImportSource react */
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import FormDatePicker from './index';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

it('opens the month containing defaultValue regardless of the current month', () => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2030, 0, 12, 12));
  const { container } = render(<FormDatePicker id="date" name="date" defaultValue="2026-08-05" />);
  fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });
  const selected = container.querySelector('[data-picker-option][data-selected="true"]');
  expect(selected).not.toBeNull();
  expect(selected?.textContent).toBe('5');
});
