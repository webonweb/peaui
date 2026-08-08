/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import InlineEdit from './index';
import { inlineEditOptions } from './inline-edit.demo';

afterEach(cleanup);

describe('InlineEdit React', () => {
  it('saves a draft and follows the same controlled event contract', () => {
    const onDraftChange = vi.fn();
    const onSave = vi.fn();
    const onValueChange = vi.fn();
    render(
      <InlineEdit
        dataTestId="inline"
        defaultValue="Panel klienta"
        onDraftChange={onDraftChange}
        onSave={onSave}
        onValueChange={onValueChange}
      />,
    );
    fireEvent.click(screen.getByTestId('inline-edit'));
    const input = screen.getByRole('textbox', { name: 'Edytuj wartość' });
    expect(input).toHaveFocus();
    fireEvent.change(input, { target: { value: 'Panel partnera' } });
    fireEvent.click(screen.getByTestId('inline-save'));

    expect(onDraftChange).toHaveBeenLastCalledWith('Panel partnera');
    expect(onSave).toHaveBeenCalledWith({
      previousValue: 'Panel klienta',
      value: 'Panel partnera',
    });
    expect(onValueChange).toHaveBeenCalledWith('Panel partnera');
    expect(screen.getByTestId('inline-edit')).toHaveFocus();
  });

  it('supports controlled editing, Escape cancellation and focus restoration', () => {
    function Controlled() {
      const [editing, setEditing] = useState(false);
      return (
        <InlineEdit
          dataTestId="controlled"
          editing={editing}
          onEditingChange={setEditing}
          value="Oryginał"
        />
      );
    }
    render(<Controlled />);
    fireEvent.click(screen.getByTestId('controlled-edit'));
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Szkic' } });
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(screen.getByText('Oryginał')).toBeInTheDocument();
    expect(screen.getByTestId('controlled-edit')).toHaveFocus();
  });

  it('announces validation and does not close an invalid editor', () => {
    const onInvalid = vi.fn();
    render(
      <InlineEdit
        editing
        defaultValue="Nazwa"
        onInvalid={onInvalid}
        validate={(value) => (String(value).trim() ? true : 'Nazwa jest wymagana.')}
      />,
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Zapisz' }));

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.getAttribute('aria-describedby')).toContain('-instructions');
    expect(input.getAttribute('aria-describedby')).toContain('-error');
    expect(screen.getByRole('alert')).toHaveTextContent('Nazwa jest wymagana.');
    expect(onInvalid).toHaveBeenCalledOnce();
  });

  it('keeps async save external and announces loading', () => {
    const onSave = vi.fn();
    const { rerender } = render(
      <InlineEdit
        defaultEditing
        defaultValue={2}
        editor="number"
        onSave={onSave}
        saveMode="async"
      />,
    );
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '3' } });
    fireEvent.click(screen.getByRole('button', { name: 'Zapisz' }));
    expect(onSave).toHaveBeenCalledWith({ previousValue: 2, value: 3 });
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();

    rerender(
      <InlineEdit
        defaultEditing
        defaultValue={2}
        editor="number"
        loading
        onSave={onSave}
        saveMode="async"
      />,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Zapisywanie zmian');
  });

  it('supports textarea shortcuts and custom editors', () => {
    const onSave = vi.fn();
    const { rerender } = render(
      <InlineEdit
        actions="keyboard"
        defaultEditing
        defaultValue="Opis"
        editor="textarea"
        onSave={onSave}
      />,
    );
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Nowy opis' } });
    fireEvent.keyDown(textarea, { key: 'Enter' });
    expect(onSave).not.toHaveBeenCalled();
    fireEvent.keyDown(textarea, { ctrlKey: true, key: 'Enter' });
    expect(onSave).toHaveBeenCalledOnce();

    rerender(
      <InlineEdit
        editing
        defaultValue="custom"
        editor="custom"
        renderEditor={({ draft, updateDraft }) => (
          <input
            aria-label="Własny edytor"
            data-inline-edit-control=""
            value={String(draft)}
            onChange={(event) => updateDraft(event.target.value)}
          />
        )}
      />,
    );
    expect(screen.getByRole('textbox', { name: 'Własny edytor' })).toBeInTheDocument();
  });

  it('resolves select labels and preserves visible activation alternatives', () => {
    render(
      <InlineEdit
        activation="dblclick"
        editor="select"
        editorProps={{ options: inlineEditOptions, searchable: false }}
        value="review"
      />,
    );
    expect(screen.getByText('Do weryfikacji')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edytuj wartość' })).toBeInTheDocument();
  });
});
