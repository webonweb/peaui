/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import FormRatingInput from './index';

afterEach(cleanup);

const baseProps = {
  id: 'quality-rating-react',
  label: 'Ocena jakości',
  name: 'quality',
};

describe('FormRatingInput React', () => {
  it('renderuje natywny suwak z takim samym kontraktem ARIA jak Vue', () => {
    const { container } = render(
      <FormRatingInput
        {...baseProps}
        defaultValue={3.5}
        description="Wybierz ocenę."
        error="Ocena jest wymagana."
        labels={{ '3.5': 'Bardzo dobra' }}
        step={0.5}
      />,
    );
    const input = screen.getByRole('slider', { name: 'Ocena jakości' });
    expect(input).toHaveAttribute('aria-valuetext', '3,5 z 5 — Bardzo dobra');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.getAttribute('aria-describedby')).toContain('quality-rating-react-default');
    expect(container.querySelectorAll('.peaui-form-rating-input__item')).toHaveLength(5);
    expect(container.querySelector('input[type="hidden"]')).toHaveValue('3.5');
    expect(container.querySelector('.peaui-form-rating-input__value-label')).toHaveAttribute(
      'title',
      '3,5 z 5 — Bardzo dobra',
    );
  });

  it('oddziela preview od modelu i zatwierdza połówkę wskaźnikiem', () => {
    const onPreviewChange = vi.fn();
    const onValueChange = vi.fn();
    const { container } = render(
      <FormRatingInput
        {...baseProps}
        defaultValue={2}
        onPreviewChange={onPreviewChange}
        onValueChange={onValueChange}
        step={0.5}
      />,
    );
    const item = container.querySelectorAll('.peaui-form-rating-input__item')[2] as HTMLElement;
    vi.spyOn(item, 'getBoundingClientRect').mockReturnValue({
      bottom: 44,
      height: 44,
      left: 0,
      right: 44,
      top: 0,
      width: 44,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    fireEvent.pointerMove(item, { clientX: 10, pointerType: 'mouse' });
    expect(onPreviewChange).toHaveBeenLastCalledWith(2.5);
    expect(onValueChange).not.toHaveBeenCalled();
    fireEvent.pointerDown(item, { clientX: 10, pointerType: 'mouse' });
    expect(onValueChange).toHaveBeenLastCalledWith(2.5);
  });

  it('obsługuje strzałki, Home, End i Delete bez błędów float', () => {
    const onClear = vi.fn();
    const onValueChange = vi.fn();
    render(
      <FormRatingInput
        {...baseProps}
        allowClear
        defaultValue={2.5}
        onClear={onClear}
        onValueChange={onValueChange}
        step={0.5}
      />,
    );
    const input = screen.getByRole('slider');
    fireEvent.keyDown(input, { key: 'ArrowRight' });
    expect(onValueChange).toHaveBeenLastCalledWith(3);
    fireEvent.keyDown(input, { key: 'Home' });
    expect(onValueChange).toHaveBeenLastCalledWith(0.5);
    fireEvent.keyDown(input, { key: 'End' });
    expect(onValueChange).toHaveBeenLastCalledWith(5);
    fireEvent.keyDown(input, { key: 'Delete' });
    expect(onValueChange).toHaveBeenLastCalledWith(null);
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('czyści powtórny wybór tylko gdy allowClear', () => {
    const onClear = vi.fn();
    const onValueChange = vi.fn();
    const { container } = render(
      <FormRatingInput
        {...baseProps}
        allowClear
        defaultValue={3}
        onClear={onClear}
        onValueChange={onValueChange}
      />,
    );
    const item = container.querySelectorAll('.peaui-form-rating-input__item')[2] as HTMLElement;
    fireEvent.pointerDown(item, { clientX: 1, pointerType: 'mouse' });
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it('readonly nie udaje kontrolki, a disabled usuwa suwak z interakcji', () => {
    const { rerender } = render(<FormRatingInput {...baseProps} defaultValue={4} readonly />);
    expect(screen.queryByRole('slider')).not.toBeInTheDocument();
    expect(document.querySelector('meter')).not.toHaveAttribute('tabindex');
    rerender(<FormRatingInput {...baseProps} defaultValue={4} disabled />);
    expect(screen.getByRole('slider')).toBeDisabled();
  });

  it('udostępnia renderery ikony i tekstu wartości', () => {
    const { container } = render(
      <FormRatingInput
        {...baseProps}
        defaultValue={2}
        max={3}
        renderIcon={({ index }) => <span data-custom-icon>{index + 1}</span>}
        renderValueLabel={({ value }) => <strong>{value} punkty</strong>}
      />,
    );
    expect(container.querySelectorAll('[data-custom-icon]')).toHaveLength(6);
    expect(screen.getByText('2 punkty')).toBeInTheDocument();
  });
});
