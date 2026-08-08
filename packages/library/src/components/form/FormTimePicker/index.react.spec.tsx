/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';

import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import FormTimePicker from './index';

afterEach(cleanup);

const baseProps = {
  id: 'meeting-time-react',
  label: 'Godzina spotkania',
  name: 'meetingTime',
  minuteStep: 5,
} as const;

describe('FormTimePicker React', () => {
  it('renderuje natywny combobox zgodny wizualnie i semantycznie z Vue', () => {
    render(<FormTimePicker {...baseProps} defaultValue="09:30" description="Czas lokalny" />);
    const input = screen.getByRole('combobox', { name: /^Godzina spotkania/ });

    expect(input).toHaveValue('09:30');
    expect(input).toHaveAttribute('aria-haspopup', 'dialog');
    expect(input).toHaveAttribute('aria-controls', 'meeting-time-react-time-panel');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).toHaveAttribute('aria-describedby', 'meeting-time-react-help-description');
  });

  it('parsuje tekst i emituje neutralną wartość oraz części czasu', () => {
    const onValueChange = vi.fn();
    const onChange = vi.fn();
    render(
      <FormTimePicker
        {...baseProps}
        defaultValue="09:30"
        onChange={onChange}
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: '14:45' } });
    fireEvent.blur(input);

    expect(onValueChange).toHaveBeenLastCalledWith('14:45');
    expect(onChange).toHaveBeenLastCalledWith('14:45', {
      hour: 14,
      minute: 45,
      second: 0,
    });
    expect(input).toHaveValue('14:45');
  });

  it('nie nadpisuje kontrolowanej wartości przed zmianą propsów', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <FormTimePicker {...baseProps} value="09:30" onValueChange={onValueChange} />,
    );
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: '10:00' } });
    fireEvent.blur(input);
    expect(onValueChange).toHaveBeenCalledWith('10:00');

    rerender(<FormTimePicker {...baseProps} value="09:30" onValueChange={onValueChange} />);
    expect(input).toHaveValue('09:30');
  });

  it.each([
    ['tekst', 'format'],
    ['07:30', 'range'],
    ['09:32', 'step'],
  ] as const)('odrzuca %s z precyzyjnym powodem %s', (draft, reason) => {
    const onInvalid = vi.fn();
    const onValueChange = vi.fn();
    render(
      <FormTimePicker
        {...baseProps}
        defaultValue="09:30"
        max="18:00"
        min="08:00"
        onInvalid={onInvalid}
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: draft } });
    fireEvent.blur(input);

    expect(onInvalid).toHaveBeenCalledWith({ input: draft, reason });
    expect(onValueChange).not.toHaveBeenCalled();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'meeting-time-react-error');
  });

  it('otwiera listy ArrowDown, wybiera opcję i przywraca focus po Escape', async () => {
    const onOpenChange = vi.fn();
    const onValueChange = vi.fn();
    render(
      <FormTimePicker
        {...baseProps}
        defaultValue="09:30"
        onOpenChange={onOpenChange}
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByRole('combobox');
    input.focus();
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    const dialog = await screen.findByRole('dialog', { name: 'Wybór czasu: Godzina spotkania' });
    await waitFor(() => expect(within(dialog).getByRole('option', { name: '09' })).toHaveFocus());
    fireEvent.click(within(dialog).getByRole('option', { name: '35' }));
    expect(onValueChange).toHaveBeenLastCalledWith('09:35');

    fireEvent.keyDown(dialog, { key: 'Escape' });
    await waitFor(() => expect(input).toHaveFocus());
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('obsługuje 12h, sekundy i okres dnia bez zmiany formatu modelu', () => {
    const onValueChange = vi.fn();
    render(
      <FormTimePicker
        {...baseProps}
        defaultValue="13:05:09"
        format="12h"
        minuteStep={1}
        onValueChange={onValueChange}
        secondStep={1}
        showSeconds
      />,
    );
    const input = screen.getByRole('combobox');
    expect(input).toHaveValue('01:05:09 PM');
    fireEvent.change(input, { target: { value: '11:10:07 PM' } });
    fireEvent.blur(input);
    expect(onValueChange).toHaveBeenLastCalledWith('23:10:07');
  });

  it('wariant segmented ma spinbuttony, roving focus i zmianę krokową', () => {
    const onValueChange = vi.fn();
    render(
      <FormTimePicker
        {...baseProps}
        defaultValue="09:30"
        onValueChange={onValueChange}
        variant="segmented"
      />,
    );
    const group = screen.getByRole('group', { name: 'Godzina spotkania' });
    const spinbuttons = within(group).getAllByRole('spinbutton');
    expect(spinbuttons).toHaveLength(2);
    expect(spinbuttons[0]).toHaveAttribute('aria-valuenow', '9');

    fireEvent.keyDown(spinbuttons[1]!, { key: 'ArrowUp' });
    expect(onValueChange).toHaveBeenLastCalledWith('09:35');
    fireEvent.keyDown(spinbuttons[0]!, { key: 'ArrowRight' });
    expect(spinbuttons[1]).toHaveFocus();
  });

  it.each(['disabled', 'readonly', 'loading'] as const)(
    'blokuje zmianę i panel w stanie %s',
    (state) => {
      const onOpenChange = vi.fn();
      const onValueChange = vi.fn();
      render(
        <FormTimePicker
          {...baseProps}
          defaultValue="09:30"
          onOpenChange={onOpenChange}
          onValueChange={onValueChange}
          {...{ [state]: true }}
        />,
      );
      const input = screen.getByRole('combobox');
      fireEvent.click(input);
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(onOpenChange).not.toHaveBeenCalled();
      expect(onValueChange).not.toHaveBeenCalled();
      if (state === 'readonly') expect(input).toHaveAttribute('aria-readonly', 'true');
      else expect(input).toBeDisabled();
      if (state === 'loading') expect(screen.getByRole('status')).toHaveTextContent('Ładowanie');
    },
  );

  it('udostępnia renderery opcji, footer oraz ref do właściwej kontrolki', async () => {
    const ref = createRef<HTMLElement>();
    render(
      <FormTimePicker
        {...baseProps}
        defaultOpen
        defaultValue="09:30"
        footerContent={<button type="button">Gotowe</button>}
        ref={ref}
        renderHourOption={(option, selected) => `${option.label}${selected ? ' wybrana' : ''}`}
      />,
    );
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('option', { name: '09 wybrana' })).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: 'Gotowe' })).toBeInTheDocument();
    expect(ref.current).toBe(screen.getByRole('combobox'));
  });
});
