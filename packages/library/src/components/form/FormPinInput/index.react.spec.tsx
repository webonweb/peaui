/** @jsxImportSource react */
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import FormPinInput from './index';

afterEach(cleanup);

describe('FormPinInput React', () => {
  it('scrolls an externally focused cell into view', () => {
    render(<FormPinInput length={12} />);
    const last = screen.getAllByRole('textbox').at(-1)!;
    const scroll = vi.fn();
    last.scrollIntoView = scroll;
    fireEvent.focus(last);
    expect(scroll).toHaveBeenCalledWith({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
  });

  it('renderuje identyczną nazwaną grupę, relacje błędu i etykiety komórek', () => {
    render(
      <FormPinInput
        dataTestId="pin"
        description="Wpisz kod z wiadomości."
        error="Kod jest niepoprawny."
        label="Kod weryfikacyjny"
        required
      />,
    );
    const group = screen.getByRole('group', { name: 'Kod weryfikacyjny' });
    const cells = screen.getAllByRole('textbox');
    expect(group.getAttribute('aria-describedby')).toContain('-description');
    expect(group.getAttribute('aria-describedby')).toContain('-error');
    expect(group).toHaveAttribute('aria-invalid', 'true');
    expect(cells).toHaveLength(6);
    expect(cells[0]).toHaveAccessibleName('Cyfra 1 z 6');
    expect(cells[5]).toHaveAccessibleName('Cyfra 6 z 6');
  });

  it('zachowuje zera, aktualizuje model i przesuwa fokus', () => {
    const onValueChange = vi.fn();
    render(<FormPinInput dataTestId="pin" onValueChange={onValueChange} />);
    const first = screen.getByTestId('pin-cell-0');
    fireEvent.focus(first);
    fireEvent.keyDown(first, { key: '0' });
    expect(onValueChange).toHaveBeenLastCalledWith('0');
    expect(screen.getByTestId('pin-cell-1')).toHaveFocus();
    fireEvent.keyDown(screen.getByTestId('pin-cell-1'), { key: '0' });
    expect(onValueChange).toHaveBeenLastCalledWith('00');
  });

  it('filtruje paste, zgłasza znaki i nadmiar oraz kończy kod raz', () => {
    const onComplete = vi.fn();
    const onInvalidInput = vi.fn();
    render(
      <FormPinInput dataTestId="pin" onComplete={onComplete} onInvalidInput={onInvalidInput} />,
    );
    fireEvent.paste(screen.getByTestId('pin-cell-0'), {
      clipboardData: { getData: () => '12a345678' },
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete.mock.calls[0]?.[0]).toBe('123456');
    expect(onInvalidInput.mock.calls[0]?.[0]).toMatchObject({ rejected: 'a78' });
  });

  it('deduplikuje complete i emituje ponownie po realnej zmianie', () => {
    const onComplete = vi.fn();
    render(<FormPinInput dataTestId="pin" length={2} onComplete={onComplete} />);
    fireEvent.keyDown(screen.getByTestId('pin-cell-0'), { key: '1' });
    fireEvent.keyDown(screen.getByTestId('pin-cell-1'), { key: '2' });
    expect(onComplete).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(screen.getByTestId('pin-cell-1'), { key: '2' });
    expect(onComplete).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(screen.getByTestId('pin-cell-1'), { key: '3' });
    expect(onComplete).toHaveBeenCalledTimes(2);
  });

  it('edytuje środek oraz obsługuje Delete i Backspace bez utraty prefiksu', () => {
    const onValueChange = vi.fn();
    render(<FormPinInput dataTestId="pin" defaultValue="1234" onValueChange={onValueChange} />);
    fireEvent.keyDown(screen.getByTestId('pin-cell-1'), { key: 'Delete' });
    expect(onValueChange).toHaveBeenLastCalledWith('134');
    fireEvent.keyDown(screen.getByTestId('pin-cell-3'), { key: 'Backspace' });
    expect(onValueChange).toHaveBeenLastCalledWith('13');
  });

  it('obsługuje strzałki, Home i End w jednym tab stopie', () => {
    render(<FormPinInput dataTestId="pin" />);
    const first = screen.getByTestId('pin-cell-0');
    fireEvent.focus(first);
    fireEvent.keyDown(first, { key: 'End' });
    expect(screen.getByTestId('pin-cell-5')).toHaveFocus();
    expect(screen.getByTestId('pin-cell-5')).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(screen.getByTestId('pin-cell-5'), { key: 'Home' });
    expect(first).toHaveFocus();
  });

  it('maskuje wartość i zachowuje natywne pole formularza', () => {
    const { container } = render(
      <FormPinInput dataTestId="pin" defaultValue="0123" mask name="otp" />,
    );
    expect(screen.getByTestId('pin-cell-0')).toHaveAttribute('type', 'password');
    const hidden = container.querySelector<HTMLInputElement>('input[type="hidden"]');
    expect(hidden).toHaveValue('0123');
    expect(hidden).toHaveAttribute('name', 'otp');
  });

  it('renderuje separator z tym samym kontraktem indeksu', () => {
    render(
      <FormPinInput
        dataTestId="pin"
        length={6}
        renderSeparator={({ index }) => <strong data-separator-index={index}>·</strong>}
        separatorEvery={3}
      />,
    );
    expect(document.querySelector('.peaui-form-pin-input__separator')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(document.querySelector('[data-separator-index="2"]')).toHaveTextContent('·');
  });

  it.each(['disabled', 'readonly', 'loading'] as const)('blokuje zmianę w stanie %s', (state) => {
    const onValueChange = vi.fn();
    const props = { [state]: true };
    render(<FormPinInput dataTestId="pin" onValueChange={onValueChange} {...props} />);
    fireEvent.keyDown(screen.getByTestId('pin-cell-0'), { key: '1' });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('emituje blur tylko po opuszczeniu całej grupy', () => {
    const onBlur = vi.fn();
    render(<FormPinInput dataTestId="pin" onBlur={onBlur} />);
    const first = screen.getByTestId('pin-cell-0');
    const second = screen.getByTestId('pin-cell-1');
    fireEvent.blur(first, { relatedTarget: second });
    expect(onBlur).not.toHaveBeenCalled();
    fireEvent.blur(second, { relatedTarget: document.body });
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});
