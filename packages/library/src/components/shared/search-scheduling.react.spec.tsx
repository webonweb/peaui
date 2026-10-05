/** @jsxImportSource react */
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import SearchInput from '../data-entry/SearchInput';
beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
it('debounces eligible queries, cancels shorter queries, and searches once on Enter', () => {
  const onSearch = vi.fn();
  render(<SearchInput onSearch={onSearch} debounceTime={200} />);
  const input = screen.getByRole('searchbox');
  fireEvent.change(input, { target: { value: 'ab' } });
  act(() => vi.advanceTimersByTime(300));
  expect(onSearch).not.toHaveBeenCalled();
  fireEvent.change(input, { target: { value: 'abc' } });
  expect(onSearch).not.toHaveBeenCalled();
  act(() => vi.advanceTimersByTime(200));
  expect(onSearch).toHaveBeenCalledExactlyOnceWith('abc');
  onSearch.mockClear();
  fireEvent.change(input, { target: { value: 'abcd' } });
  fireEvent.keyDown(input, { key: 'Enter' });
  act(() => vi.advanceTimersByTime(300));
  expect(onSearch).toHaveBeenCalledExactlyOnceWith('abcd');
});
it('cancels pending search on clear and on unmount', () => {
  const onSearch = vi.fn();
  const view = render(<SearchInput onSearch={onSearch} debounceTime={200} />);
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'abc' } });
  fireEvent.click(screen.getByRole('button', { name: 'Wyczyść' }));
  act(() => vi.advanceTimersByTime(300));
  expect(onSearch).toHaveBeenCalledExactlyOnceWith('');
  onSearch.mockClear();
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'abcd' } });
  view.unmount();
  act(() => vi.advanceTimersByTime(300));
  expect(onSearch).not.toHaveBeenCalled();
});

it('cancels a pending query when debounce configuration changes', () => {
  const onSearch = vi.fn();
  const view = render(<SearchInput onSearch={onSearch} debounceTime={200} />);
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'abc' } });
  view.rerender(<SearchInput onSearch={onSearch} debounceTime={500} />);
  act(() => vi.advanceTimersByTime(600));
  expect(onSearch).not.toHaveBeenCalled();
});
