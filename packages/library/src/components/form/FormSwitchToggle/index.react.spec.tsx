/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import FormSwitchToggle from './index';

afterEach(cleanup);

describe('FormSwitchToggle React', () => {
  it('renderuje natywny checkbox jako switch i obsługuje model niekontrolowany', () => {
    const onValueChange = vi.fn();
    const onChange = vi.fn();
    render(
      <FormSwitchToggle
        defaultValue={false}
        label="Powiadomienia"
        name="notifications"
        onChange={onChange}
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByRole('switch', { name: 'Powiadomienia' });

    fireEvent.click(screen.getByText('Powiadomienia'));

    expect(input).toBeChecked();
    expect(input).toHaveAttribute('aria-checked', 'true');
    expect(input).toHaveAttribute('aria-labelledby');
    expect(document.getElementById(input.getAttribute('aria-labelledby')!)).toHaveTextContent(
      'Powiadomienia',
    );
    expect(onValueChange).toHaveBeenCalledWith(true);
    expect(onChange.mock.calls[0]?.[0]).toBe(true);
  });

  it('zachowuje kontrolowaną wartość do czasu aktualizacji propsów', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <FormSwitchToggle label="Funkcja" value={false} onValueChange={onValueChange} />,
    );
    const input = screen.getByRole('switch', { name: 'Funkcja' });

    fireEvent.click(input);
    expect(onValueChange).toHaveBeenCalledWith(true);
    expect(input).not.toBeChecked();

    rerender(<FormSwitchToggle label="Funkcja" value onValueChange={onValueChange} />);
    expect(input).toBeChecked();
  });

  it('utrzymuje generyczny kontrakt własnych wartości', () => {
    type DomainValue = 'enabled' | 'disabled';
    const onValueChange = vi.fn<(value: DomainValue) => void>();
    render(
      <FormSwitchToggle<DomainValue>
        defaultValue="disabled"
        falseValue="disabled"
        label="Tryb ekspercki"
        trueValue="enabled"
        onValueChange={onValueChange}
      />,
    );

    fireEvent.click(screen.getByRole('switch', { name: 'Tryb ekspercki' }));
    expect(onValueChange).toHaveBeenCalledWith('enabled');
  });

  it.each(['disabled', 'readonly', 'loading'] as const)(
    'blokuje zmianę w stanie %s',
    async (state) => {
      const onValueChange = vi.fn();
      render(
        <FormSwitchToggle
          ariaLabel="Funkcja"
          defaultValue={false}
          onValueChange={onValueChange}
          {...{ [state]: true }}
        />,
      );
      const input = screen.getByRole('switch', { name: 'Funkcja' });

      input.click();

      await waitFor(() => expect(input).not.toBeChecked());
      expect(onValueChange).not.toHaveBeenCalled();
      if (state === 'readonly') {
        expect(input).not.toBeDisabled();
        expect(input).toHaveAttribute('aria-readonly', 'true');
      } else {
        expect(input).toBeDisabled();
      }
    },
  );

  it('buduje kompletne relacje ARIA dla opisu, błędu i ładowania', () => {
    render(
      <FormSwitchToggle
        aria-describedby="external-help"
        ariaLabel="Synchronizacja"
        defaultValue={false}
        description="Opis ustawienia"
        error="Wymagane ustawienie"
        loading
        loadingLabel="Zapisywanie ustawienia"
        required
      />,
    );
    const input = screen.getByRole('switch', { name: 'Synchronizacja' });
    const ids = input.getAttribute('aria-describedby')?.split(' ') ?? [];

    expect(ids).toContain('external-help');
    expect(ids).toContain(screen.getByText('Opis ustawienia').id);
    expect(ids).toContain(screen.getByText('Wymagane ustawienie').id);
    expect(ids).toContain(screen.getByRole('status').id);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(input).toHaveAttribute('aria-busy', 'true');
  });

  it('uczestniczy w FormData i natywnej walidacji required', () => {
    render(
      <>
        <form data-testid="form" id="publication-form" />
        <FormSwitchToggle<'yes' | 'no'>
          ariaLabel="Publikacja"
          defaultValue="yes"
          falseValue="no"
          form="publication-form"
          name="published"
          required
          trueValue="yes"
        />
      </>,
    );
    const form = screen.getByTestId('form') as HTMLFormElement;
    const input = screen.getByRole('switch', { name: 'Publikacja' }) as HTMLInputElement;

    expect(input.checkValidity()).toBe(true);
    expect(input.form).toBe(form);
    expect(new FormData(form).get('published')).toBe('yes');

    fireEvent.click(input);
    expect(new FormData(form).has('published')).toBe(false);
    expect(input.checkValidity()).toBe(false);
  });

  it('obsługuje render props i jawne teksty stanów', () => {
    const renderThumb = vi.fn(({ checked }: { checked: boolean }) => (
      <span data-thumb>{checked ? '✓' : '–'}</span>
    ));
    const { container } = render(
      <FormSwitchToggle
        defaultValue
        descriptionContent={<span>Opis niestandardowy</span>}
        labelContent={<strong>Etykieta niestandardowa</strong>}
        onLabelContent={<em>Aktywne</em>}
        renderThumb={renderThumb}
        showStateLabel
      />,
    );

    expect(screen.getByRole('switch', { name: 'Etykieta niestandardowa' })).toBeChecked();
    expect(screen.getByText('Opis niestandardowy')).toBeInTheDocument();
    expect(screen.getByText('Aktywne')).toBeInTheDocument();
    expect(container.querySelector('[data-thumb]')).toHaveTextContent('✓');
    expect(renderThumb).toHaveBeenCalledWith({ checked: true, loading: false });
  });

  it('przekazuje ref, focus i blur do natywnej kontrolki', () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const ref = createRef<HTMLInputElement>();
    render(
      <FormSwitchToggle
        ariaLabel="Widoczność"
        defaultValue={false}
        ref={ref}
        onBlur={onBlur}
        onFocus={onFocus}
      />,
    );

    ref.current?.focus();
    ref.current?.blur();

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(onFocus).toHaveBeenCalledOnce();
    expect(onBlur).toHaveBeenCalledOnce();
  });
});
