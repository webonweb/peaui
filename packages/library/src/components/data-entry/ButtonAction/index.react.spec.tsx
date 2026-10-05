/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import ButtonAction from './index';

afterEach(cleanup);
it('forwards native form, global, data and ARIA attributes and focus events', () => {
  const onFocus = vi.fn();
  render(
    <ButtonAction
      id="save"
      name="action"
      value="save"
      form="editor"
      title="Save changes"
      data-analytics="save"
      aria-controls="editor"
      onFocus={onFocus}
    >
      Save
    </ButtonAction>,
  );
  const button = screen.getByRole('button', { name: 'Save' });
  for (const [name, value] of Object.entries({
    id: 'save',
    name: 'action',
    value: 'save',
    form: 'editor',
    title: 'Save changes',
    'data-analytics': 'save',
    'aria-controls': 'editor',
  })) {
    expect(button).toHaveAttribute(name, value);
  }
  fireEvent.focus(button);
  expect(onFocus).toHaveBeenCalledOnce();
});
