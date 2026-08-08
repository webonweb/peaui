/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import FormDateTimePicker from './index';

afterEach(cleanup);

const baseProps = {
  id: 'meeting-date-time-react',
  label: 'Termin spotkania',
  minuteStep: 5,
  name: 'meetingDateTime',
} as const;

const value = { date: '2026-08-18', time: '09:30' } as const;

describe('FormDateTimePicker React', () => {
  it('renderuje natywny combobox i dialog zgodne z kontraktem Vue', () => {
    render(
      <FormDateTimePicker
        {...baseProps}
        defaultOpen
        defaultValue={value}
        description="Czas lokalny"
        showTimeZone
      />,
    );
    const input = screen.getByRole('combobox', { name: /^Termin spotkania/ });
    expect(input).toHaveValue('18.08.2026 09:30');
    expect(input).toHaveAttribute('aria-controls', 'meeting-date-time-react-panel');
    expect(input).toHaveAttribute('aria-haspopup', 'dialog');
    expect(input).toHaveAttribute('aria-describedby', 'meeting-date-time-react-help-description');
    const dialog = screen.getByRole('dialog', { name: 'Wybierz datę i czas' });
    expect(within(dialog).getByRole('grid')).toBeInTheDocument();
    expect(within(dialog).getAllByRole('spinbutton')).toHaveLength(2);
    expect(dialog).toHaveTextContent('Strefa:');
  });

  it('parsuje wartość ISO bez konwersji strefy czasowej', () => {
    const onValueChange = vi.fn();
    const onChange = vi.fn();
    render(
      <FormDateTimePicker
        {...baseProps}
        dateFormat="iso"
        defaultValue={value}
        onChange={onChange}
        onValueChange={onValueChange}
        timeZone="Europe/Warsaw"
      />,
    );
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: '2026-10-25 02:30' } });
    fireEvent.blur(input);
    expect(onValueChange).toHaveBeenLastCalledWith({ date: '2026-10-25', time: '02:30' });
    expect(onChange).toHaveBeenLastCalledWith({ date: '2026-10-25', time: '02:30' });
  });

  it('publikuje wybór daty i czasu natychmiast w jednym modelu', () => {
    const onValueChange = vi.fn();
    const onDateChange = vi.fn();
    const onTimeChange = vi.fn();
    const { container } = render(
      <FormDateTimePicker
        {...baseProps}
        defaultOpen
        defaultValue={value}
        onDateChange={onDateChange}
        onTimeChange={onTimeChange}
        onValueChange={onValueChange}
      />,
    );
    fireEvent.click(container.querySelector('[data-date="2026-08-20"]')!);
    expect(onDateChange).toHaveBeenLastCalledWith('2026-08-20');
    expect(onValueChange).toHaveBeenLastCalledWith({ date: '2026-08-20', time: '09:30' });

    fireEvent.click(screen.getByRole('button', { name: 'Zwiększ: Godzina' }));
    expect(onTimeChange).toHaveBeenLastCalledWith('10:30');
    expect(onValueChange).toHaveBeenLastCalledWith({ date: '2026-08-20', time: '10:30' });
  });

  it('tryb confirm izoluje szkic, obsługuje cancel i apply', () => {
    const onApply = vi.fn();
    const onCancel = vi.fn();
    const onValueChange = vi.fn();
    const { container } = render(
      <FormDateTimePicker
        {...baseProps}
        confirm
        defaultOpen
        defaultValue={value}
        onApply={onApply}
        onCancel={onCancel}
        onValueChange={onValueChange}
      />,
    );
    fireEvent.click(container.querySelector('[data-date="2026-08-20"]')!);
    expect(onValueChange).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Anuluj' }));
    expect(onCancel).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(container.querySelector('[data-date="2026-08-20"]')!);
    fireEvent.click(screen.getByRole('button', { name: 'Zastosuj' }));
    expect(onApply).toHaveBeenLastCalledWith({ date: '2026-08-20', time: '09:30' });
    expect(onValueChange).toHaveBeenLastCalledWith({ date: '2026-08-20', time: '09:30' });
  });

  it('wariant split ma jednoznaczne nazwy, błędy i naturalny porządek fokusu', () => {
    const onInvalid = vi.fn();
    render(
      <FormDateTimePicker
        {...baseProps}
        defaultValue={value}
        onInvalid={onInvalid}
        variant="split-input"
      />,
    );
    const date = screen.getByRole('combobox', { name: 'Data' });
    const time = screen.getByRole('combobox', { name: 'Czas' });
    expect(date.compareDocumentPosition(time) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    fireEvent.change(time, { target: { value: 'tekst' } });
    fireEvent.blur(time);
    expect(onInvalid).toHaveBeenLastCalledWith({ input: 'tekst', reason: 'time', section: 'time' });
    expect(date).toHaveAttribute('aria-invalid', 'true');
  });

  it.each(['disabled', 'readonly', 'loading'] as const)(
    'blokuje otwarcie i zmianę w stanie %s',
    (state) => {
      render(<FormDateTimePicker {...baseProps} defaultValue={value} {...{ [state]: true }} />);
      const input = screen.getByRole('combobox');
      fireEvent.click(input);
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      if (state === 'readonly') expect(input).toHaveAttribute('aria-readonly', 'true');
      else expect(input).toBeDisabled();
      if (state === 'loading') expect(screen.getByRole('status')).toBeInTheDocument();
    },
  );
});
