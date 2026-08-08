/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import FormDateRangePicker from './index';

afterEach(cleanup);

const baseProps = {
  calendars: 1 as const,
  id: 'report-range-react',
  label: 'Zakres raportu',
  name: 'reportRange',
};

describe('FormDateRangePicker React', () => {
  it('renderuje natywne pola i dialog z tym samym kontraktem ARIA co Vue', () => {
    render(
      <FormDateRangePicker
        {...baseProps}
        defaultOpen
        defaultValue={['2026-08-10', '2026-08-18']}
        description="Okres raportowania"
      />,
    );
    const start = screen.getByRole('combobox', { name: 'Data początkowa' });
    const end = screen.getByRole('combobox', { name: 'Data końcowa' });
    expect(start).toHaveValue('10.08.2026');
    expect(end).toHaveValue('18.08.2026');
    expect(start).toHaveAttribute('aria-controls', 'report-range-react-panel');
    expect(start).toHaveAttribute('aria-haspopup', 'dialog');
    const dialog = screen.getByRole('dialog', { name: 'Wybierz zakres dat' });
    expect(within(dialog).getAllByRole('grid')).toHaveLength(1);
    expect(within(dialog).getAllByRole('gridcell')).toHaveLength(42);
  });

  it('publikuje częściowy i kompletny zakres wraz z eventami końców', () => {
    const onValueChange = vi.fn();
    const onStartChange = vi.fn();
    const onEndChange = vi.fn();
    const { container } = render(
      <FormDateRangePicker
        {...baseProps}
        defaultOpen
        onEndChange={onEndChange}
        onStartChange={onStartChange}
        onValueChange={onValueChange}
      />,
    );
    fireEvent.click(container.querySelector('[data-date="2026-08-10"]')!);
    expect(onStartChange).toHaveBeenLastCalledWith('2026-08-10');
    expect(onValueChange).toHaveBeenLastCalledWith(['2026-08-10', undefined]);
    fireEvent.click(container.querySelector('[data-date="2026-08-18"]')!);
    expect(onEndChange).toHaveBeenLastCalledWith('2026-08-18');
    expect(onValueChange).toHaveBeenLastCalledWith(['2026-08-10', '2026-08-18']);
  });

  it('parsuje ręczny zakres ISO i stosuje politykę swap', () => {
    const onValueChange = vi.fn();
    render(
      <FormDateRangePicker
        {...baseProps}
        dateFormat="iso"
        defaultValue={['2026-08-10', '2026-08-18']}
        onValueChange={onValueChange}
        variant="single-input"
      />,
    );
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: '2026-08-25 – 2026-08-20' } });
    fireEvent.blur(input);
    expect(onValueChange).toHaveBeenLastCalledWith(['2026-08-20', '2026-08-25']);
  });

  it('izoluje szkic w trybie confirm oraz obsługuje cancel i apply', () => {
    const onApply = vi.fn();
    const onCancel = vi.fn();
    const onValueChange = vi.fn();
    const { container } = render(
      <FormDateRangePicker
        {...baseProps}
        confirm
        defaultOpen
        defaultValue={['2026-08-10', '2026-08-18']}
        onApply={onApply}
        onCancel={onCancel}
        onValueChange={onValueChange}
      />,
    );
    fireEvent.click(container.querySelector('[data-date="2026-08-20"]')!);
    fireEvent.click(container.querySelector('[data-date="2026-08-25"]')!);
    expect(onValueChange).not.toHaveBeenCalled();
    const cancelButton = screen.getByRole('button', { name: 'Anuluj' });
    expect(cancelButton).toHaveClass(
      'peaui-button-action',
      'peaui-button-action--size-xs',
      'peaui-button-action--variant-secondary',
    );
    fireEvent.click(cancelButton);
    expect(onCancel).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('combobox', { name: 'Data początkowa' }));
    fireEvent.click(container.querySelector('[data-date="2026-08-20"]')!);
    fireEvent.click(container.querySelector('[data-date="2026-08-25"]')!);
    const applyButton = screen.getByRole('button', { name: 'Zastosuj' });
    expect(applyButton).toHaveClass(
      'peaui-button-action',
      'peaui-button-action--size-xs',
      'peaui-button-action--variant-primary',
    );
    fireEvent.click(applyButton);
    expect(onApply).toHaveBeenLastCalledWith(['2026-08-20', '2026-08-25']);
    expect(onValueChange).toHaveBeenLastCalledWith(['2026-08-20', '2026-08-25']);
  });

  it('respektuje disabled dates i zgłasza odwróconą kolejność w trybie reject', () => {
    const onInvalid = vi.fn();
    const { container } = render(
      <FormDateRangePicker
        {...baseProps}
        defaultOpen
        isDateDisabled={(date) => date === '2026-08-12'}
        onInvalid={onInvalid}
        selectionOrder="reject"
      />,
    );
    expect(container.querySelector('[data-date="2026-08-12"]')).toBeDisabled();
    fireEvent.click(container.querySelector('[data-date="2026-08-18"]')!);
    fireEvent.click(container.querySelector('[data-date="2026-08-10"]')!);
    expect(onInvalid).toHaveBeenLastCalledWith({
      input: ['2026-08-18', undefined],
      reason: 'order',
      section: 'end',
    });
  });

  it('wybiera preset i publikuje ten sam zakres co wariant Vue', () => {
    const onValueChange = vi.fn();
    render(
      <FormDateRangePicker
        {...baseProps}
        defaultOpen
        onValueChange={onValueChange}
        presets={[
          {
            id: 'previous-week',
            label: 'Poprzedni tydzień',
            value: ['2026-08-03', '2026-08-09'],
          },
        ]}
      />,
    );
    const presetButton = screen.getByRole('button', { name: 'Poprzedni tydzień' });
    expect(presetButton).toHaveClass(
      'peaui-button-action',
      'peaui-button-action--size-xxs',
      'peaui-button-action--variant-ghost',
    );
    fireEvent.click(presetButton);
    expect(onValueChange).toHaveBeenLastCalledWith(['2026-08-03', '2026-08-09']);
  });

  it.each(['disabled', 'readonly', 'loading'] as const)('blokuje otwarcie w stanie %s', (state) => {
    render(
      <FormDateRangePicker
        {...baseProps}
        defaultValue={['2026-08-10', '2026-08-18']}
        {...{ [state]: true }}
      />,
    );
    const input = screen.getByRole('combobox', { name: 'Data początkowa' });
    fireEvent.click(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    if (state === 'readonly') expect(input).toHaveAttribute('aria-readonly', 'true');
    else expect(input).toBeDisabled();
    if (state === 'loading') expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
