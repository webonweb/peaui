/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ToggleButton from './index';

afterEach(cleanup);

describe('ToggleButton React', () => {
  it('renderuje natywny przycisk i przełącza model niekontrolowany', () => {
    const onValueChange = vi.fn();
    render(
      <ToggleButton
        defaultValue={false}
        icon="eye"
        label="Podgląd"
        onValueChange={onValueChange}
      />,
    );
    const button = screen.getByRole('button', { name: 'Podgląd' });

    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button.querySelector('.peaui-toggle-button__icon')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(button.querySelector('.peaui-toggle-button__state-marker')).not.toBeInTheDocument();

    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('data-pressed', 'true');
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('zachowuje kontrolowaną wartość do czasu aktualizacji propsów', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <ToggleButton label="Przypnij" value={false} onValueChange={onValueChange} />,
    );
    const button = screen.getByRole('button', { name: 'Przypnij' });

    fireEvent.click(button);
    expect(onValueChange).toHaveBeenCalledWith(true);
    expect(button).toHaveAttribute('aria-pressed', 'false');

    rerender(<ToggleButton label="Przypnij" value onValueChange={onValueChange} />);
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('emituje zmianę przed click dokładnie raz i przekazuje ref', () => {
    const order: string[] = [];
    const onChange = vi.fn(() => order.push('change'));
    const onClick = vi.fn(() => order.push('click'));
    const onValueChange = vi.fn(() => order.push('value'));
    const ref = createRef<HTMLButtonElement>();
    render(
      <ToggleButton
        ariaLabel="Ulubione"
        content="icon"
        icon="lock"
        ref={ref}
        onChange={onChange}
        onClick={onClick}
        onValueChange={onValueChange}
      />,
    );

    fireEvent.click(ref.current!);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(onValueChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange.mock.calls[0]?.[0]).toBe(true);
    expect(onChange.mock.calls[0]?.[1]).toMatchObject({ nativeEvent: expect.any(MouseEvent) });
    expect(onClick).toHaveBeenCalledOnce();
    expect(order).toEqual(['value', 'change', 'click']);
  });

  it('utrzymuje stałą dostępną nazwę mimo zmiany widocznej treści i ikony', () => {
    render(
      <ToggleButton
        defaultValue={false}
        icon="eye"
        label="Podgląd"
        pressedIcon="checkCircle"
        pressedLabel="Podgląd widoczny"
      />,
    );
    const button = screen.getByRole('button', { name: 'Podgląd' });

    fireEvent.click(button);

    expect(button).toHaveAccessibleName('Podgląd');
    expect(screen.getByText('Podgląd widoczny')).toBeInTheDocument();
    expect(button.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it.each(['disabled', 'readonly', 'loading'] as const)(
    'blokuje model i zdarzenia w stanie %s',
    (state) => {
      const onChange = vi.fn();
      const onClick = vi.fn();
      const onValueChange = vi.fn();
      render(
        <ToggleButton
          ariaLabel="Widoczność"
          defaultValue={false}
          onChange={onChange}
          onClick={onClick}
          onValueChange={onValueChange}
          {...{ [state]: true }}
        />,
      );
      const button = screen.getByRole('button', { name: 'Widoczność' });

      fireEvent.click(button);

      expect(button).toHaveAttribute('aria-pressed', 'false');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(onValueChange).not.toHaveBeenCalled();
      expect(onChange).not.toHaveBeenCalled();
      expect(onClick).not.toHaveBeenCalled();
      if (state === 'readonly') expect(button).not.toBeDisabled();
      else expect(button).toBeDisabled();
    },
  );

  it('łączy zewnętrzny opis ze stanem ładowania', () => {
    render(
      <>
        <span id="external-help">Opis zewnętrzny</span>
        <ToggleButton
          aria-describedby="external-help"
          ariaLabel="Synchronizacja"
          loading
          loadingLabel="Zapisywanie ustawienia"
        />
      </>,
    );
    const button = screen.getByRole('button', { name: 'Synchronizacja' });
    const ids = button.getAttribute('aria-describedby')?.split(' ') ?? [];

    expect(ids).toContain('external-help');
    expect(ids).toContain(screen.getByRole('status').id);
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAccessibleDescription('Opis zewnętrzny Zapisywanie ustawienia');
  });

  it('obsługuje własne ikony bez tworzenia dodatkowego punktu tabulacji', () => {
    const { container } = render(
      <ToggleButton
        defaultValue
        ariaLabel="Wyróżnienie"
        content="icon"
        iconContent={<span data-icon>☆</span>}
        pressedIconContent={<span data-pressed-icon>★</span>}
      />,
    );

    expect(container.querySelector('[data-pressed-icon]')).toBeInTheDocument();
    expect(container.querySelector('[data-icon]')).not.toBeInTheDocument();
    expect(container.querySelectorAll('button')).toHaveLength(1);
  });
});
