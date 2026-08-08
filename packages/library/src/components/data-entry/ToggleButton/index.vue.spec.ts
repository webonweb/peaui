import '@testing-library/jest-dom/vitest';

import { cleanup, fireEvent, render, screen } from '@testing-library/vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, ref } from 'vue';

import ToggleButton from './index.vue';

afterEach(cleanup);

describe('ToggleButton Vue', () => {
  it('renderuje natywny przycisk ze zsynchronizowanym aria-pressed', () => {
    render(ToggleButton, {
      props: { icon: 'eye', label: 'Podgląd', value: false, variant: 'outline' },
    });

    const button = screen.getByRole('button', { name: 'Podgląd' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveClass('peaui-toggle-button--content-icon-text');
    expect(button).toHaveClass('peaui-toggle-button--variant-outline');
    expect(button.querySelector('.peaui-toggle-button__icon')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(button.querySelector('.peaui-toggle-button__state-marker')).not.toBeInTheDocument();
  });

  it('aktualizuje model i emituje zdarzenia dokładnie raz w stabilnej kolejności', async () => {
    const order: string[] = [];
    const onChange = vi.fn(() => order.push('change'));
    const onClick = vi.fn(() => order.push('click'));
    const onValueChange = vi.fn(() => order.push('update'));
    const { emitted } = render(ToggleButton, {
      props: {
        label: 'Przypnij',
        value: false,
        onChange,
        onClick,
        'onUpdate:value': onValueChange,
      },
    });

    await fireEvent.click(screen.getByRole('button', { name: 'Przypnij' }));

    expect(order).toEqual(['update', 'change', 'click']);
    expect(onValueChange).toHaveBeenCalledWith(true);
    expect(onChange.mock.calls[0]?.[0]).toBe(true);
    expect(onChange.mock.calls[0]?.[1]).toBeInstanceOf(MouseEvent);
    expect(onClick.mock.calls[0]?.[0]).toBeInstanceOf(MouseEvent);
    expect(emitted()['update:value']).toHaveLength(1);
    expect(emitted().change).toHaveLength(1);
    expect(emitted().click).toHaveLength(1);
  });

  it('utrzymuje stałą dostępną nazwę mimo zmiany etykiety i ikony', async () => {
    const Harness = defineComponent({
      components: { ToggleButton },
      setup: () => ({ current: ref(false) }),
      template: `
        <ToggleButton
          v-model:value="current"
          aria-label="Pokaż podgląd"
          icon="eye"
          label="Podgląd"
          pressed-icon="checkCircle"
          pressed-label="Podgląd widoczny"
        />
      `,
    });
    render(Harness);
    const button = screen.getByRole('button', { name: 'Pokaż podgląd' });

    await fireEvent.click(button);

    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAccessibleName('Pokaż podgląd');
    expect(button).toHaveTextContent('Podgląd widoczny');
    expect(button).toHaveClass('peaui-toggle-button--pressed');
  });

  it.each(['disabled', 'readonly', 'loading'] as const)(
    'nie zmienia wartości ani nie emituje akcji w stanie %s',
    async (state) => {
      const onChange = vi.fn();
      const onClick = vi.fn();
      const onValueChange = vi.fn();
      render(ToggleButton, {
        props: {
          ariaLabel: 'Funkcja',
          value: false,
          onChange,
          onClick,
          'onUpdate:value': onValueChange,
          [state]: true,
        },
      });
      const button = screen.getByRole('button', { name: 'Funkcja' });

      await fireEvent.click(button);

      expect(button).toHaveAttribute('aria-pressed', 'false');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(onValueChange).not.toHaveBeenCalled();
      expect(onChange).not.toHaveBeenCalled();
      expect(onClick).not.toHaveBeenCalled();
      if (state === 'readonly') expect(button).not.toBeDisabled();
      else expect(button).toBeDisabled();
    },
  );

  it('łączy zewnętrzny opis ze statusem loading i zachowuje bieżący stan', () => {
    render(ToggleButton, {
      attrs: { 'aria-describedby': 'external-help' },
      props: {
        ariaLabel: 'Synchronizacja',
        loading: true,
        loadingLabel: 'Zapisywanie widoku',
        value: true,
      },
    });
    const button = screen.getByRole('button', { name: 'Synchronizacja' });
    const status = screen.getByRole('status');
    const describedBy = button.getAttribute('aria-describedby')?.split(' ') ?? [];

    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(status).toHaveTextContent('Zapisywanie widoku');
    expect(describedBy).toContain('external-help');
    expect(describedBy).toContain(status.id);
  });

  it('obsługuje trzy tryby treści, jawne zawijanie i sloty ikon', () => {
    const { container } = render(ToggleButton, {
      props: {
        allowWrap: true,
        ariaLabel: 'Własna funkcja',
        content: 'icon',
        value: true,
      },
      slots: {
        'pressed-icon': '<span data-custom-icon>!</span>',
      },
    });
    const button = screen.getByRole('button', { name: 'Własna funkcja' });

    expect(button).toHaveClass('peaui-toggle-button--content-icon');
    expect(button).toHaveClass('peaui-toggle-button--wrap');
    expect(container.querySelector('[data-custom-icon]')).toHaveTextContent('!');
    expect(button.querySelector('.peaui-toggle-button__label')).not.toBeInTheDocument();
  });

  it('korzysta z tekstu domyślnego slotu jako dostępnej nazwy', () => {
    render(ToggleButton, {
      props: { content: 'text', label: '' },
      slots: { default: 'Pogrubienie' },
    });

    expect(screen.getByRole('button', { name: 'Pogrubienie' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });
});
