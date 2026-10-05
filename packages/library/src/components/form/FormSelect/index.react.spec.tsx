/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import FormSelect from './index';
import FormMultiSelect from '../FormMultiSelect';

afterEach(cleanup);
describe('Select native form regressions', () => {
  it.each([FormSelect, FormMultiSelect])(
    'validates selected values while search is open',
    (Component) => {
      const props = {
        id: 'choice',
        name: 'choice',
        required: true,
        canErase: true,
        options: [{ value: 'a', label: 'Alpha' }],
      };
      const { container } = render(
        <form>
          {Component === FormSelect ? (
            <FormSelect {...props} defaultValue="a" />
          ) : (
            <FormMultiSelect {...props} defaultValue={['a']} />
          )}
        </form>,
      );
      const form = container.querySelector('form')!;
      const input = screen.getByRole('combobox');
      expect(form.checkValidity()).toBe(true);
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      expect(input).toHaveValue('');
      expect(input).toHaveAttribute('aria-required', 'true');
      expect(form.checkValidity()).toBe(true);
      fireEvent.change(input, { target: { value: 'No match' } });
      expect(form.checkValidity()).toBe(true);
      expect(new FormData(form).getAll('choice')).toEqual(['a']);
      fireEvent.click(container.querySelector('.peaui-form-field__erase-button')!);
      act(() => expect(form.reportValidity()).toBe(false));
      expect(input).toHaveFocus();
      expect(input).toHaveAttribute('aria-invalid', 'true');
    },
  );

  it('preserves and submits writable values after Tab, Escape and reopening', () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <form>
        <FormSelect
          id="choice"
          name="choice"
          canWrite
          required
          options={[{ value: 'a', label: 'Alpha' }]}
          onValueChange={onValueChange}
        />
      </form>,
    );
    const form = container.querySelector('form')!;
    const input = screen.getByRole('combobox');
    fireEvent.click(input);
    fireEvent.change(input, { target: { value: 'Custom choice' } });
    expect(onValueChange).toHaveBeenLastCalledWith('Custom choice');
    fireEvent.keyDown(input, { key: 'Tab' });
    expect(input).toHaveValue('Custom choice');
    expect(new FormData(form).get('choice')).toBe('Custom choice');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input).toHaveValue('Custom choice');
    fireEvent.change(input, { target: { value: '' } });
    expect(onValueChange).toHaveBeenLastCalledWith('');
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(input).toHaveValue('');
    act(() => expect(form.checkValidity()).toBe(false));
  });

  it.each([{ disabled: true }, { readonly: true }, { searchable: false }])(
    'blocks manual entry for %s',
    (state) => {
      const onValueChange = vi.fn();
      render(
        <FormSelect
          id="choice"
          name="choice"
          canWrite
          options={[]}
          onValueChange={onValueChange}
          {...state}
        />,
      );
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Ignored' } });
      expect(onValueChange).not.toHaveBeenCalled();
    },
  );
});
describe('Select performance regressions', () => {
  it('selects only filtered enabled options and can deselect all with disabled options', () => {
    const onValueChange = vi.fn();
    render(
      <FormMultiSelect
        id="filter"
        name="filter"
        withSelectAll
        options={[
          { label: 'Alpha', value: 'a' },
          { label: 'Beta', value: 'b' },
          { label: 'Gamma', value: 'c', disabled: true },
        ]}
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByRole('combobox');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.change(input, { target: { value: 'Alpha' } });
    fireEvent.click(screen.getByRole('button', { name: 'Zaznacz wszystkie' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['a']);
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Zaznacz wszystkie' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['a', 'b']);
    fireEvent.click(screen.getByRole('button', { name: 'Odznacz wszystkie' }));
    expect(onValueChange).toHaveBeenLastCalledWith([]);
  });

  it.each([FormSelect, FormMultiSelect])('does not mount options while closed', (Component) => {
    const { container } = render(
      <Component
        id="large"
        name="large"
        options={Array.from({ length: 1000 }, (_, value) => ({ label: String(value), value }))}
      />,
    );
    expect(container.querySelectorAll('[role="option"]')).toHaveLength(0);
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });
    expect(container.querySelectorAll('[role="option"]').length).toBeGreaterThan(0);
  });
});
const options = [
  { label: 'Alpha', value: 'Alpha' },
  { label: 'Blocked', value: 'Blocked', disabled: true },
  { label: 'Omega', value: 'Omega' },
];

describe.each([FormSelect, FormMultiSelect])('React select keyboard contract', (Component) => {
  it('uses consumer-provided search and empty-state labels', () => {
    render(
      <Component
        id="localized"
        name="localized"
        options={[]}
        labels={{ placeholder: 'Choose', searchPlaceholder: 'Search', empty: 'No matches' }}
      />,
    );
    const input = screen.getByRole('combobox');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input).toHaveAttribute('placeholder', 'Search');
    expect(screen.getByRole('status')).toHaveTextContent('No matches');
  });

  it('opens, skips disabled choices, selects with Enter and exposes the active option', () => {
    const onValueChange = vi.fn();
    render(
      <Component
        id="select"
        name="select"
        label="Choice"
        options={options}
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByRole('combobox');
    input.focus();
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    const first = screen.getByRole('option', { name: 'Alpha' });
    expect(input).toHaveAttribute('aria-activedescendant', first.id);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    const last = screen.getByRole('option', { name: 'Omega' });
    expect(input).toHaveAttribute('aria-activedescendant', last.id);
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onValueChange).toHaveBeenCalledWith(Component === FormSelect ? 'Omega' : ['Omega']);
    expect(input).toHaveFocus();
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).not.toHaveAttribute('aria-activedescendant');
  });

  it('supports Home, End and Tab and blocks readonly changes', () => {
    const { rerender } = render(<Component id="select" name="select" options={options} />);
    const input = screen.getByRole('combobox');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'End' });
    expect(input).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Omega' }).id,
    );
    fireEvent.keyDown(input, { key: 'Home' });
    expect(input).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Alpha' }).id,
    );
    fireEvent.keyDown(input, { key: 'Tab' });
    expect(input).toHaveAttribute('aria-expanded', 'false');
    rerender(<Component id="select" name="select" options={options} readonly />);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });
});
