/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import CommandPalette from './index';
import type { CommandPaletteCommand } from './command-palette.shared';

afterEach(cleanup);

const commands: readonly CommandPaletteCommand[] = [
  { id: 'alpha', label: 'Alpha command' },
  { id: 'disabled', label: 'Disabled command', disabled: true },
  { id: 'nested', label: 'Nested', children: [{ id: 'child', label: 'Child command' }] },
];

describe('CommandPalette React', () => {
  it('matches the Vue combobox/listbox contract and skips disabled commands', () => {
    render(
      <CommandPalette commands={commands} defaultOpen mode="embedded" registerShortcut={false} />,
    );
    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('aria-controls');
    expect(input).toHaveAttribute('aria-activedescendant', expect.stringContaining('alpha'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('Disabled command').closest('[role="option"]')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('filters and executes once while an async command is pending', async () => {
    let resolveAction: (() => void) | undefined;
    const execute = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveAction = resolve;
        }),
    );
    const success = vi.fn();
    render(
      <CommandPalette
        commands={[{ id: 'settings', label: 'Open settings', keywords: ['preferences'], execute }]}
        closeOnExecute={false}
        defaultOpen
        mode="embedded"
        registerShortcut={false}
        onExecutionSuccess={success}
      />,
    );
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'pref' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(execute).toHaveBeenCalledTimes(1);
    resolveAction?.();
    await waitFor(() => expect(success).toHaveBeenCalledTimes(1));
  });

  it('supports nested levels and Escape back navigation', () => {
    const levelChange = vi.fn();
    render(
      <CommandPalette
        commands={commands}
        defaultOpen
        mode="embedded"
        registerShortcut={false}
        onLevelChange={levelChange}
      />,
    );
    fireEvent.click(screen.getByText('Nested'));
    expect(screen.getByText('Child command')).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' });
    expect(screen.getByText('Alpha command')).toBeInTheDocument();
    expect(levelChange).toHaveBeenCalledTimes(2);
  });

  it('does not intercept Mod+K from an editable field', () => {
    render(
      <>
        <input aria-label="Editor" />
        <CommandPalette commands={commands} mode="embedded" />
      </>,
    );
    fireEvent.keyDown(screen.getByLabelText('Editor'), { ctrlKey: true, key: 'k' });
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('does not nest option roles when results are virtualized', () => {
    render(
      <CommandPalette
        commands={commands}
        defaultOpen
        mode="embedded"
        registerShortcut={false}
        virtual
      />,
    );

    const listbox = screen.getByRole('listbox');
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(commands.length);
    for (const option of options) {
      expect(option.parentElement).toBe(listbox);
      expect(option.querySelector('[role="option"]')).toBeNull();
    }
  });
});
