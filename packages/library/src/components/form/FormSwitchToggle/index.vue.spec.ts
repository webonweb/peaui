import '@testing-library/jest-dom/vitest';

import { cleanup, fireEvent, render, screen } from '@testing-library/vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, ref } from 'vue';

import FormSwitchToggle from './index.vue';

afterEach(cleanup);

describe('FormSwitchToggle Vue', () => {
  it('renderuje natywny checkbox jako dostępny switch z widoczną etykietą', () => {
    render(FormSwitchToggle, {
      props: { id: 'updates', label: 'Aktualizacje', name: 'updates', value: true },
    });

    const input = screen.getByRole('switch', { name: 'Aktualizacje' });
    expect(input).toHaveAttribute('type', 'checkbox');
    expect(input).toBeChecked();
    expect(input).toHaveAttribute('aria-checked', 'true');
    expect(input).toHaveAttribute('aria-labelledby', 'updates-label');
    expect(document.getElementById('updates-label')).toHaveTextContent('Aktualizacje');
    expect(input).toHaveAttribute('name', 'updates');
  });

  it('emituje model i change po kliknięciu całej etykiety', async () => {
    const onChange = vi.fn();
    const { emitted } = render(FormSwitchToggle, {
      props: { label: 'Powiadomienia', onChange, value: false },
    });

    await fireEvent.click(screen.getByText('Powiadomienia'));

    expect(emitted()['update:value']?.[0]).toEqual([true]);
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange.mock.calls[0]?.[0]).toBe(true);
    expect(onChange.mock.calls[0]?.[1]).toBeInstanceOf(Event);
  });

  it('mapuje własne wartości bez utraty payloadu', async () => {
    const enabled = { code: 'enabled' };
    const disabled = { code: 'disabled' };
    const { emitted } = render(FormSwitchToggle, {
      props: {
        ariaLabel: 'Tryb ekspercki',
        falseValue: disabled,
        trueValue: enabled,
        value: disabled,
      },
    });

    await fireEvent.click(screen.getByRole('switch', { name: 'Tryb ekspercki' }));
    expect(emitted()['update:value']?.[0]?.[0]).toStrictEqual(enabled);
    expect(emitted().change?.[0]?.[0]).toStrictEqual(enabled);
  });

  it.each(['disabled', 'readonly', 'loading'] as const)(
    'nie zmienia wartości w stanie %s',
    async (state) => {
      const { emitted } = render(FormSwitchToggle, {
        props: { ariaLabel: 'Funkcja', value: false, [state]: true },
      });
      const input = screen.getByRole('switch', { name: 'Funkcja' });

      await fireEvent.click(input);

      expect(emitted()['update:value']).toBeUndefined();
      expect(input).not.toBeChecked();
      if (state === 'readonly') {
        expect(input).not.toBeDisabled();
        expect(input).toHaveAttribute('aria-readonly', 'true');
      } else {
        expect(input).toBeDisabled();
      }
    },
  );

  it('łączy opis, błąd, stan ładowania i zewnętrzne aria-describedby', () => {
    render(FormSwitchToggle, {
      attrs: { 'aria-describedby': 'external-help' },
      props: {
        ariaLabel: 'Synchronizacja',
        description: 'Opis ustawienia',
        error: 'Wybierz ustawienie',
        loading: true,
        loadingLabel: 'Zapisywanie ustawienia',
        required: true,
        value: false,
      },
    });
    const input = screen.getByRole('switch', { name: 'Synchronizacja' });
    const ids = input.getAttribute('aria-describedby')?.split(' ') ?? [];

    expect(ids).toContain('external-help');
    expect(ids).toContain(screen.getByText('Opis ustawienia').id);
    expect(ids).toContain(screen.getByText('Wybierz ustawienie').id);
    expect(ids).toContain(screen.getByRole('status').id);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(input).toHaveAttribute('aria-busy', 'true');
  });

  it('przekazuje focus i blur z natywnej kontrolki', async () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    render(FormSwitchToggle, {
      props: { ariaLabel: 'Widoczność', onBlur, onFocus, value: false },
    });
    const input = screen.getByRole('switch', { name: 'Widoczność' });

    await fireEvent.focus(input);
    await fireEvent.blur(input);

    expect(onFocus).toHaveBeenCalledOnce();
    expect(onBlur).toHaveBeenCalledOnce();
  });

  it('uczestniczy w natywnym formularzu i serializuje trueValue', async () => {
    const Harness = defineComponent({
      components: { FormSwitchToggle },
      setup: () => ({ current: ref('yes') }),
      template: `
        <form id="publication-form" data-testid="form" />
        <FormSwitchToggle
          v-model:value="current"
          aria-label="Publikacja"
          form="publication-form"
          name="published"
          true-value="yes"
          false-value="no"
          required
        />
      `,
    });
    render(Harness);
    const input = screen.getByRole('switch', { name: 'Publikacja' }) as HTMLInputElement;
    const form = screen.getByTestId('form') as HTMLFormElement;

    expect(input.checkValidity()).toBe(true);
    expect(input.form).toBe(form);
    expect(new FormData(form).get('published')).toBe('yes');

    await fireEvent.click(input);
    expect(new FormData(form).has('published')).toBe(false);
    expect(input.checkValidity()).toBe(false);
  });

  it('renderuje sloty oraz jawny tekst stanu', () => {
    const { container } = render(FormSwitchToggle, {
      props: { showStateLabel: true, value: true },
      slots: {
        description: 'Opis ze slotu',
        label: 'Etykieta ze slotu',
        'on-label': 'Aktywne',
        thumb: '<span data-thumb>✓</span>',
      },
    });

    expect(screen.getByRole('switch', { name: 'Etykieta ze slotu' })).toBeChecked();
    expect(screen.getByText('Opis ze slotu')).toBeInTheDocument();
    expect(screen.getByText('Aktywne')).toBeInTheDocument();
    expect(container.querySelector('[data-thumb]')).toHaveTextContent('✓');
  });

  it('generuje stabilną nazwę zastępczą i identyfikator bez etykiety', () => {
    render(FormSwitchToggle, { props: { name: 'featureFlag', value: false } });
    const input = screen.getByRole('switch', { name: 'featureFlag' });

    expect(input.id).toMatch(/^peaui-form-switch-toggle-/);
    expect(input).toHaveAccessibleName('featureFlag');
  });
});
