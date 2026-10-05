/** @jsxImportSource react */
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ButtonExport from '../data-entry/ButtonExport';
import FormButtonGroup from '../form/FormButtonGroup';
import InfoTooltip from '../overlayer/InfoTooltip';
import FormInput from '../form/FormInput';
import { computeAccessibleDescription } from 'dom-accessibility-api';

afterEach(cleanup);

describe('interaction contracts: React', () => {
  it('dismisses a focused tooltip with Escape and keeps focus', () => {
    render(<InfoTooltip description="Help">Details</InfoTooltip>);
    const trigger = screen.getByRole('button', { name: 'Details' });
    fireEvent.focus(trigger);
    expect(trigger.getAttribute('data-open')).toBe('true');
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(trigger.getAttribute('data-open')).not.toBe('true');
  });
  it('connects the field hint to its focusable trigger and renders an icon', () => {
    const { container } = render(
      <FormInput id="hinted-input" name="field" label="Field" hint="Helpful explanation" />,
    );
    const trigger = container.querySelector<HTMLElement>('.peaui-info-tooltip')!;
    expect(computeAccessibleDescription(trigger)).toBe('Helpful explanation');
    expect(trigger.querySelector('svg path')).toBeTruthy();
  });
  it('requires confirmation before exporting all records', () => {
    const onExport = vi.fn();
    render(<ButtonExport onExport={onExport} />);
    fireEvent.click(screen.getByRole('button', { name: 'Eksportuj' }));
    fireEvent.click(screen.getByRole('menuitem', { name: /CSV/ }));
    expect(onExport).not.toHaveBeenCalled();
    const dialog = screen.getByRole('dialog', { name: /Potwierdzenie/ });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Eksportuj' }));
    expect(onExport).toHaveBeenCalledExactlyOnceWith('csv');
  });
  it.each([{ selectedItemsCount: 2 }, { forceExport: true }])(
    'exports immediately with %j',
    (props) => {
      const onExport = vi.fn();
      render(<ButtonExport {...props} onExport={onExport} />);
      fireEvent.click(screen.getByRole('button', { name: /Eksportuj/ }));
      fireEvent.click(screen.getByRole('menuitem', { name: /PDF/ }));
      expect(onExport).toHaveBeenCalledExactlyOnceWith('pdf');
    },
  );
  it('opens, navigates and dismisses the export menu with the keyboard', () => {
    render(<ButtonExport />);
    const trigger = screen.getByRole('button', { name: 'Eksportuj' });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    const options = screen.getAllByRole('menuitem');
    expect(document.activeElement).toBe(options[0]);
    fireEvent.keyDown(options[0]!, { key: 'End' });
    expect(document.activeElement).toBe(options[2]);
    fireEvent.keyDown(options[2]!, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(options[0]);
    fireEvent.keyDown(options[0]!, { key: 'Escape' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);
  });
  it('uses one tab stop and skips disabled radios while selecting by keyboard', () => {
    const onValueChange = vi.fn();
    render(
      <FormButtonGroup
        name="choice"
        label="Choice"
        options={[
          { key: 'a', label: 'Alpha' },
          { key: 'b', label: 'Beta', disabled: true },
          { key: 'c', label: 'Charlie' },
        ]}
        onValueChange={onValueChange}
      />,
    );
    const radios = screen.getAllByRole('radio');
    expect(radios.map((radio) => radio.tabIndex)).toEqual([0, -1, -1]);
    radios[0]!.focus();
    fireEvent.keyDown(radios[0]!, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(radios[2]);
    expect(onValueChange).toHaveBeenLastCalledWith('c');
    expect(radios.map((radio) => radio.tabIndex)).toEqual([-1, -1, 0]);
    fireEvent.keyDown(radios[2]!, { key: 'Home' });
    expect(onValueChange).toHaveBeenLastCalledWith('a');
  });
  it('allows deselecting an optional toggle group but preserves a required choice', () => {
    const onValueChange = vi.fn();
    const props = {
      name: 'choice',
      options: [{ key: 'a', label: 'Alpha' }],
      value: 'a',
      isToggle: true,
      onValueChange,
    };
    const view = render(<FormButtonGroup {...props} />);
    fireEvent.click(screen.getByRole('radio'));
    expect(onValueChange).toHaveBeenLastCalledWith(undefined);
    onValueChange.mockClear();
    view.rerender(<FormButtonGroup {...props} required />);
    fireEvent.click(screen.getByRole('radio'));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

it('cancels export confirmation without emitting and returns focus to the trigger', async () => {
  const onExport = vi.fn();
  render(<ButtonExport onExport={onExport} />);
  const trigger = screen.getByRole('button', { name: 'Eksportuj' });
  fireEvent.click(trigger);
  fireEvent.click(screen.getByRole('menuitem', { name: /CSV/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Anuluj' }));
  expect(onExport).not.toHaveBeenCalled();
  await waitFor(() => expect(document.activeElement).toBe(trigger));
});
