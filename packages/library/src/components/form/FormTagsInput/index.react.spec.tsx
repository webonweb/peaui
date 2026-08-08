/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';

import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import FormTagsInput from './index';

afterEach(cleanup);

describe('FormTagsInput React', () => {
  it('renderuje ten sam nazwany combobox, opisy i live region', () => {
    const { container } = render(
      <FormTagsInput
        description="Dodaj słowa kluczowe."
        error="Wymagany jest tag."
        id="skills-react"
        label="Umiejętności"
        name="skills"
        required
      />,
    );
    const input = screen.getByRole('combobox', { name: 'Umiejętności' });

    expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('description'));
    expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('error'));
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(container.querySelectorAll('[role="status"]')).toHaveLength(1);
  });

  it('używa wspólnej struktury overlayera i osobnej listy tagów', () => {
    const { container } = render(
      <FormTagsInput
        defaultValue={['Vue', 'React']}
        id="structure-react"
        label="Tagi"
        suggestions={['Vue', 'React', 'TypeScript']}
      />,
    );
    const input = screen.getByRole('combobox', { name: 'Tagi' });
    const overlayer = container.querySelector('.peaui-form-tags-input__overlayer');

    expect(overlayer).toHaveClass('peaui-popover-overlayer');
    expect(overlayer).toHaveClass('peaui-popover-overlayer--match-trigger-width');
    expect(container.querySelector('.peaui-form-tags-input__tags')?.tagName).toBe('UL');
    expect(
      container.querySelectorAll('.peaui-form-tags-input__tags > .peaui-form-tags-input__tag'),
    ).toHaveLength(2);
    expect(input).toHaveAttribute('aria-haspopup', 'listbox');
  });

  it('obsługuje niekontrolowane dodawanie, paste, limit i callbacki', () => {
    const onAdd = vi.fn();
    const onInvalidTag = vi.fn();
    const onMaxReached = vi.fn();
    const onValueChange = vi.fn();
    render(
      <FormTagsInput
        id="tags-react"
        label="Tagi"
        max={3}
        onAdd={onAdd}
        onInvalidTag={onInvalidTag}
        onMaxReached={onMaxReached}
        onValueChange={onValueChange}
        validateTag={(tag) => (typeof tag === 'string' && tag.length >= 3) || 'Minimum 3 znaki.'}
      />,
    );
    const input = screen.getByRole('combobox', { name: 'Tagi' });
    fireEvent.change(input, { target: { value: 'Vue' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    fireEvent.paste(input, {
      clipboardData: { getData: () => 'UI, React; Web Components; TypeScript' },
    });

    expect(screen.getAllByRole('button', { name: /^Edytuj tag/ })).toHaveLength(3);
    expect(onValueChange).toHaveBeenLastCalledWith(['Vue', 'React', 'Web Components']);
    expect(onAdd).toHaveBeenCalledTimes(3);
    expect(onInvalidTag).toHaveBeenCalledWith(
      expect.objectContaining({ reason: 'invalid' }),
      expect.any(Event),
    );
    expect(onMaxReached).toHaveBeenCalledWith(3, expect.any(Event));
  });

  it('nie emituje zduplikowanego modelu po normalizacji', () => {
    const onInvalidTag = vi.fn();
    const onValueChange = vi.fn();
    render(
      <FormTagsInput
        defaultValue={['vue']}
        id="duplicates-react"
        label="Tagi"
        normalizeTag={(input) => input.toLocaleLowerCase()}
        onInvalidTag={onInvalidTag}
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByRole('combobox', { name: 'Tagi' });
    fireEvent.change(input, { target: { value: 'VUE' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onValueChange).not.toHaveBeenCalled();
    expect(onInvalidTag).toHaveBeenCalledWith(
      expect.objectContaining({ reason: 'duplicate' }),
      expect.any(Event),
    );
  });

  it('Backspace wybiera i usuwa dopiero za drugim razem', () => {
    const onRemove = vi.fn();
    render(
      <FormTagsInput
        defaultValue={['Vue', 'React']}
        id="backspace-react"
        label="Tagi"
        onRemove={onRemove}
      />,
    );
    const input = screen.getByRole('combobox', { name: 'Tagi' });
    fireEvent.keyDown(input, { key: 'Backspace' });
    expect(screen.getByRole('button', { name: 'Edytuj tag React' }).closest('li')).toHaveClass(
      'peaui-form-tags-input__tag--selected',
    );
    fireEvent.keyDown(input, { key: 'Backspace' });

    expect(screen.queryByRole('button', { name: 'Edytuj tag React' })).not.toBeInTheDocument();
    expect(onRemove).toHaveBeenCalledWith('React', 1, expect.any(Event));
  });

  it('keeps tag focus when a pending post-removal input focus is cancelled', () => {
    const frames = new Map<number, FrameRequestCallback>();
    let frameId = 0;
    const requestFrame = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback) => {
        frameId += 1;
        frames.set(frameId, callback);
        return frameId;
      });
    const cancelFrame = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
      frames.delete(id);
    });

    render(
      <FormTagsInput
        defaultValue={['Vue', 'React', 'TypeScript']}
        id="stable-focus-react"
        label="Tagi"
      />,
    );
    const input = screen.getByRole('combobox', { name: 'Tagi' });
    act(() => input.focus());

    fireEvent.keyDown(input, { key: 'Backspace' });
    fireEvent.keyDown(input, { key: 'Backspace' });
    fireEvent.keyDown(input, { key: 'ArrowLeft' });

    const focusedTag = screen.getByRole('button', { name: 'Edytuj tag React' });
    act(() => {
      for (const callback of frames.values()) callback(performance.now());
    });

    expect(focusedTag).toHaveFocus();
    expect(cancelFrame).toHaveBeenCalled();

    requestFrame.mockRestore();
    cancelFrame.mockRestore();
  });

  it('edytuje klawiaturą i anuluje edycję Escape', () => {
    const onEdit = vi.fn();
    render(<FormTagsInput defaultValue={['Vue']} id="edit-react" label="Tagi" onEdit={onEdit} />);
    const input = screen.getByRole('combobox', { name: 'Tagi' });
    const tag = screen.getByRole('button', { name: 'Edytuj tag Vue' });
    fireEvent.keyDown(tag, { key: 'F2' });
    fireEvent.change(input, { target: { value: 'Vue 3' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onEdit).toHaveBeenCalledWith('Vue', 'Vue 3', 0, expect.any(Event));

    fireEvent.keyDown(screen.getByRole('button', { name: 'Edytuj tag Vue 3' }), { key: 'F2' });
    fireEvent.change(input, { target: { value: 'Anulowane' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.getByRole('button', { name: 'Edytuj tag Vue 3' })).toBeInTheDocument();
  });

  it('steruje listboxem i wybiera typowaną sugestię klawiaturą', () => {
    const suggestion = { id: 1, label: 'React', value: 'react' };
    const onValueChange = vi.fn();
    render(
      <FormTagsInput
        allowCreate={false}
        id="suggestions-react"
        label="Technologie"
        mode="suggestions-only"
        onValueChange={onValueChange}
        suggestions={[suggestion]}
      />,
    );
    const input = screen.getByRole('combobox', { name: 'Technologie' });
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'rea' } });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input).toHaveAttribute('aria-activedescendant', 'suggestions-react-suggestion-0');
    const option = screen.getByRole('option', { name: 'React' });
    const overlay = option.closest('.peaui-form-tags-input__popover-content');
    expect(option).toHaveAttribute('aria-selected', 'true');
    expect(overlay).toHaveClass('peaui-popover-overlayer__content');
    expect(overlay).toHaveClass('peaui-popover-overlayer__content--match-trigger-width');
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onValueChange).toHaveBeenCalledWith([suggestion]);
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('wspiera kontrolowane value oraz inputValue', () => {
    const onInputValueChange = vi.fn();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <FormTagsInput
        id="controlled-react"
        inputValue="Vu"
        label="Tagi"
        onInputValueChange={onInputValueChange}
        onValueChange={onValueChange}
        value={['React']}
      />,
    );
    const input = screen.getByRole('combobox', { name: 'Tagi' });
    expect(input).toHaveValue('Vu');
    fireEvent.change(input, { target: { value: 'Vue' } });
    expect(onInputValueChange).toHaveBeenCalledWith('Vue');
    expect(input).toHaveValue('Vu');

    rerender(
      <FormTagsInput
        id="controlled-react"
        inputValue="Vue"
        label="Tagi"
        onInputValueChange={onInputValueChange}
        onValueChange={onValueChange}
        value={['React']}
      />,
    );
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onValueChange).toHaveBeenCalledWith(['React', 'Vue']);
  });

  it('chroni disabled tags i serializuje osobne wartości formularza', () => {
    const { container } = render(
      <FormTagsInput
        defaultValue={['Vue', 'React']}
        disabledTags={['Vue']}
        id="form-react"
        label="Tagi"
        name="skills"
        serializeTag={(tag) => `${typeof tag === 'string' ? tag : tag.label}`.toLocaleLowerCase()}
      />,
    );
    expect(screen.queryByRole('button', { name: 'Usuń tag Vue' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tag Vue (niedostępny)' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(
      [...container.querySelectorAll<HTMLInputElement>('input[type="hidden"]')].map(
        (field) => field.value,
      ),
    ).toEqual(['vue', 'react']);
  });

  it('anuluje poprzednie zapytanie dostawcy sugestii', async () => {
    const signals: AbortSignal[] = [];
    const provider = vi.fn((query: string, signal: AbortSignal) => {
      signals.push(signal);
      return Promise.resolve(query ? [query === 'vu' ? 'Vue' : 'Nieaktualne'] : []);
    });
    render(<FormTagsInput id="async-react" label="Tagi" suggestionProvider={provider} />);
    const input = screen.getByRole('combobox', { name: 'Tagi' });
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'v' } });
    fireEvent.change(input, { target: { value: 'vu' } });

    await waitFor(() => expect(screen.getByRole('option', { name: 'Vue' })).toBeInTheDocument());
    expect(signals.some((signal) => signal.aborted)).toBe(true);
  });
});
