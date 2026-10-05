/** @jsxImportSource react */
import { cleanup, fireEvent, render, act } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { computeAccessibleName } from 'dom-accessibility-api';
import FormNumber from '../form/FormNumber';
import FormInput from '../form/FormInput';
import FormCheckbox from '../form/FormCheckbox';
import FormSelect from '../form/FormSelect';
import FormMultiSelect from '../form/FormMultiSelect';
import ModalDialog from '../overlayer/ModalDialog';
import DrawerPanel from '../overlayer/DrawerPanel';

afterEach(cleanup);
describe('regressions: React form contracts', () => {
  it('commits a clamped numeric value on blur and preserves empty input', () => {
    const change = vi.fn();
    const { container } = render(
      <FormNumber
        id="number"
        name="number"
        defaultValue={1}
        min={0}
        max={10}
        onValueChange={change}
      />,
    );
    const input = container.querySelector('input')!;
    fireEvent.change(input, { target: { value: '15' } });
    fireEvent.blur(input);
    expect(change).toHaveBeenLastCalledWith(10);
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);
    expect(change).toHaveBeenLastCalledWith(undefined);
  });
  it('forwards native input attributes and composes native callbacks', () => {
    const focus = vi.fn(),
      inputEvent = vi.fn(),
      keydown = vi.fn();
    const { container } = render(
      <>
        <form id="external" />
        <FormInput
          id="email"
          name="email"
          {...{
            type: 'email',
            autoComplete: 'email',
            pattern: '.+@example.com',
            form: 'external',
            onFocus: focus,
            onInput: inputEvent,
            onKeyDown: keydown,
          }}
        />
      </>,
    );
    const input = container.querySelector('input')!;
    expect(input.type).toBe('email');
    expect(input.autocomplete).toBe('email');
    expect(input.pattern).toBe('.+@example.com');
    expect(input.form?.id).toBe('external');
    fireEvent.focus(input);
    fireEvent.input(input, { target: { value: 'a' } });
    fireEvent.keyDown(input, { key: 'ArrowLeft' });
    expect(focus).toHaveBeenCalledTimes(1);
    expect(inputEvent).toHaveBeenCalledTimes(1);
    expect(keydown).toHaveBeenCalledTimes(1);
  });
  for (const checkbox of [false, true]) {
    it(`resets uncontrolled ${checkbox ? 'checkbox' : 'input'} state beyond the next render`, async () => {
      const { container, rerender } = render(
        <form>
          {checkbox ? (
            <FormCheckbox id="field" name="field" defaultValue={false} />
          ) : (
            <FormInput id="field" name="field" defaultValue="Alpha" />
          )}
        </form>,
      );
      const input = container.querySelector('input')!;
      if (checkbox) fireEvent.click(input);
      else fireEvent.change(input, { target: { value: 'Beta' } });
      await act(async () => {
        container.querySelector('form')!.reset();
        await new Promise<void>((resolve) => setTimeout(resolve, 0));
      });
      rerender(
        <form>
          {checkbox ? (
            <FormCheckbox id="field" name="field" aria-label="Changed" defaultValue={false} />
          ) : (
            <FormInput id="field" name="field" label="Changed" defaultValue="Alpha" />
          )}
        </form>,
      );
      expect(checkbox ? input.checked : input.value).toBe(checkbox ? false : 'Alpha');
    });
  }
  for (const multi of [false, true]) {
    it(`serializes ${multi ? 'multiple' : 'single'} values`, () => {
      const options = [
        { value: 'a', label: 'Alpha' },
        { value: 'b', label: 'Beta' },
      ];
      const { container } = render(
        <form>
          {multi ? (
            <FormMultiSelect id="choice" name="choice" value={['a', 'b']} options={options} />
          ) : (
            <FormSelect id="choice" name="choice" value="b" options={options} />
          )}
        </form>,
      );
      expect(new FormData(container.querySelector('form')!).getAll('choice')).toEqual(
        multi ? ['a', 'b'] : ['b'],
      );
    });
  }
  it('enforces required for select-only mode and focuses the combobox', () => {
    const { container, rerender } = render(
      <form>
        <FormSelect id="choice" name="choice" required searchable={false} options={[]} />
      </form>,
    );
    act(() => {
      expect(container.querySelector('form')!.reportValidity()).toBe(false);
    });
    expect(container.querySelector('input')?.getAttribute('aria-invalid')).toBe('true');
    expect(document.activeElement).toBe(container.querySelector('input[role="combobox"]'));
    rerender(
      <form>
        <FormSelect
          id="choice"
          name="choice"
          required
          searchable={false}
          options={[{ value: 'a', label: 'Alpha' }]}
          value="a"
        />
      </form>,
    );
    expect(container.querySelector('input')?.getAttribute('aria-invalid')).not.toBe('true');
  });
  for (const Component of [ModalDialog, DrawerPanel]) {
    it(`preserves standard aria-label in ${Component.displayName}`, () => {
      const { container } = render(<Component open={false} aria-label="Explicit title" />);
      const dialog = container.querySelector('dialog')!;
      dialog.setAttribute('open', '');
      expect(computeAccessibleName(dialog)).toBe('Explicit title');
    });
  }
});
