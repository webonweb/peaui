/** @jsxImportSource react */
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import FormSelect from '../form/FormSelect';
import FormMultiSelect from '../form/FormMultiSelect';
import TransferList from '../data-entry/TransferList';

const options = Array.from({ length: 5000 }, (_, value) => ({
  label: `Option ${value}`,
  value,
  key: value,
}));
afterEach(cleanup);
describe.each([FormSelect, FormMultiSelect])('virtual React select', (Component) => {
  it('bounds DOM and reveals End without dangling ARIA references after scrolling', () => {
    render(<Component id="virtual" name="virtual" options={options} virtual />);
    const input = screen.getByRole('combobox');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(screen.getAllByRole('option').length).toBeLessThan(20);
    fireEvent.keyDown(input, { key: 'End' });
    expect(
      document
        .getElementById(input.getAttribute('aria-activedescendant')!)
        ?.getAttribute('aria-posinset'),
    ).toBe('5000');
    fireEvent.scroll(screen.getByRole('listbox'), { target: { scrollTop: 0 } });
    const activeId = input.getAttribute('aria-activedescendant');
    expect(activeId === null || document.getElementById(activeId) !== null).toBe(true);
    fireEvent.change(input, { target: { value: 'Option 4999' } });
    expect(screen.getAllByRole('option')).toHaveLength(1);
  });
  it('supports the label migration contract', () => {
    const onValueChange = vi.fn();
    render(
      <Component
        id="legacy"
        name="legacy"
        valueMode="label"
        options={[{ label: 'Alpha', value: 'a' }]}
        onValueChange={onValueChange}
      />,
    );
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });
    fireEvent.click(screen.getByRole('option'));
    expect(onValueChange.mock.calls[0]?.[0]).toEqual(
      Component === FormMultiSelect ? ['Alpha'] : 'Alpha',
    );
  });
});
it('virtualizes both React TransferList panels', () => {
  render(<TransferList items={options} value={[0, 1]} virtual />);
  expect(screen.getAllByRole('option').length).toBeLessThan(25);
  const source = screen.getAllByRole('listbox')[0]!;
  fireEvent.keyDown(source, { key: 'End' });
  expect(
    document.getElementById(source.getAttribute('aria-activedescendant')!)?.textContent,
  ).toContain('Option 4999');
});
