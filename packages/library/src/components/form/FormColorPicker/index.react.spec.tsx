/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import FormColorPicker from './index';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const baseProps = {
  id: 'brand-color-react',
  label: 'Kolor marki',
  name: 'brandColor',
} as const;

describe('FormColorPicker React', () => {
  it('używa systemowej strzałki selecta jako osobnej ikony SVG', () => {
    render(<FormColorPicker {...baseProps} defaultValue="#4C9A2A" />);
    const toggle = screen.getByRole('button', { name: 'Otwórz wybór koloru' });
    const icon = toggle.querySelector('svg.peaui-form-color-picker__toggle-icon');

    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('viewBox', '0 0 24 24');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(toggle).not.toHaveTextContent('⌄');
  });

  it('renderuje natywny combobox i nazwany dialog zgodne z Vue', () => {
    render(<FormColorPicker {...baseProps} defaultOpen defaultValue="#4C9A2A" />);
    const input = screen.getByRole('combobox', { name: /^Kolor marki/ });
    expect(input).toHaveValue('#4C9A2A');
    expect(input).toHaveAttribute('aria-controls', 'brand-color-react-panel');
    expect(input).toHaveAttribute('aria-expanded', 'true');
    const dialog = screen.getByRole('dialog', { name: 'Wybierz kolor' });
    expect(
      within(dialog).getByRole('slider', { name: 'Nasycenie i jasność koloru' }),
    ).toHaveAttribute('aria-valuetext');
    expect(within(dialog).getByRole('slider', { name: 'Odcień' })).toBeInTheDocument();
  });

  it('zachowuje niepoprawny wpis do zatwierdzenia i zgłasza przyczynę', () => {
    const onInvalid = vi.fn();
    render(<FormColorPicker {...baseProps} defaultValue="#4C9A2A" onInvalid={onInvalid} />);
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'nie-kolor' } });
    expect(input).toHaveValue('nie-kolor');
    fireEvent.blur(input);
    expect(input).toHaveValue('nie-kolor');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(onInvalid).toHaveBeenLastCalledWith({ input: 'nie-kolor', reason: 'format' });
  });

  it('normalizuje ręczny wpis do wybranego formatu i emituje commit raz', () => {
    const onCommit = vi.fn();
    const onValueChange = vi.fn();
    render(
      <FormColorPicker
        {...baseProps}
        defaultValue="#4C9A2A"
        format="rgb"
        onCommit={onCommit}
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: '#FF0000' } });
    fireEvent.blur(input);
    expect(input).toHaveValue('rgb(255, 0, 0)');
    expect(onValueChange).toHaveBeenLastCalledWith('rgb(255, 0, 0)');
    expect(onCommit).toHaveBeenCalledTimes(1);
  });

  it('obsługuje klawiaturę dwuwymiarowej powierzchni i commit', () => {
    const onChange = vi.fn();
    const onCommit = vi.fn();
    render(
      <FormColorPicker
        {...baseProps}
        defaultOpen
        defaultValue="#4C9A2A"
        onChange={onChange}
        onCommit={onCommit}
      />,
    );
    const saturation = screen.getByRole('slider', { name: 'Nasycenie i jasność koloru' });
    fireEvent.keyDown(saturation, { key: 'ArrowLeft' });
    fireEvent.keyDown(saturation, { key: 'ArrowUp', shiftKey: true });
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onCommit).toHaveBeenCalledTimes(2);
    expect(saturation).toHaveAttribute('aria-valuenow');
  });

  it('zwalnia aktywny pointer capture podczas odmontowania', () => {
    const { unmount } = render(
      <FormColorPicker {...baseProps} defaultValue="#4C9A2A" variant="inline" />,
    );
    const saturation = screen.getByRole('slider', {
      name: 'Nasycenie i jasność koloru',
    }) as HTMLDivElement;
    const setPointerCapture = vi.fn();
    const releasePointerCapture = vi.fn();
    Object.assign(saturation, {
      getBoundingClientRect: () => ({
        bottom: 100,
        height: 100,
        left: 0,
        right: 100,
        top: 0,
        width: 100,
      }),
      hasPointerCapture: () => true,
      releasePointerCapture,
      setPointerCapture,
    });
    fireEvent.pointerDown(saturation, { clientX: 25, clientY: 25, pointerId: 7 });
    expect(setPointerCapture).toHaveBeenCalledWith(7);
    unmount();
    expect(releasePointerCapture).toHaveBeenCalledWith(7);
  });

  it('filtruje wadliwe próbki i udostępnia ich znaczenie bez polegania na barwie', () => {
    render(
      <FormColorPicker
        {...baseProps}
        defaultOpen
        defaultValue="#4C9A2A"
        savedColors={[
          { label: 'Zieleń marki', value: '#4C9A2A' },
          { label: 'Wadliwy', value: 'brak' },
        ]}
      />,
    );
    expect(screen.getByRole('button', { name: 'Zieleń marki' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Wadliwy' })).not.toBeInTheDocument();
  });

  it('pokazuje bezpieczny fallback, gdy EyeDropper API jest niedostępne', () => {
    render(<FormColorPicker {...baseProps} defaultOpen defaultValue="#4C9A2A" showEyedropper />);
    expect(screen.getByRole('button', { name: 'Pobierz kolor z ekranu' })).toBeDisabled();
    expect(screen.getByText(/EyeDropper jest niedostępny/)).toBeVisible();
  });

  it.each(['disabled', 'readonly', 'loading'] as const)(
    'blokuje zmianę i otwarcie w stanie %s',
    (state) => {
      render(<FormColorPicker {...baseProps} defaultValue="#4C9A2A" {...{ [state]: true }} />);
      const input = screen.getByRole('combobox');
      fireEvent.click(input);
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      if (state === 'readonly') expect(input).toHaveAttribute('aria-readonly', 'true');
      else expect(input).toBeDisabled();
      if (state === 'loading') expect(screen.getByRole('status')).toBeVisible();
    },
  );
});
