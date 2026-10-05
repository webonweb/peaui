/** @jsxImportSource react */
import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { computeAccessibleName } from 'dom-accessibility-api';
import FormCheckbox from '../form/FormCheckbox';
import FormRadio from '../form/FormRadio';
import FormButtonCheckbox from '../form/FormButtonCheckbox';
import ModalDialog from '../overlayer/ModalDialog';
import DrawerPanel from '../overlayer/DrawerPanel';

afterEach(cleanup);

for (const Component of [FormCheckbox, FormRadio, FormButtonCheckbox]) {
  it(`${Component.displayName} updates its accessible label when children change`, () => {
    const { container, rerender } = render(
      <Component id="choice" name="choice" value={false} optionValue={true} />,
    );
    const input = container.querySelector('input')!;
    expect(computeAccessibleName(input)).toBe('choice');
    rerender(
      <Component id="choice" name="choice" value={false} optionValue={true}>
        Accept terms
      </Component>,
    );
    expect(computeAccessibleName(input)).toBe('Accept terms');
    rerender(<Component id="choice" name="choice" value={false} optionValue={true} />);
    expect(computeAccessibleName(input)).toBe('choice');
  });
}

for (const Component of [ModalDialog, DrawerPanel]) {
  it(`${Component.displayName} updates its accessible name relationship when its header changes`, () => {
    const { container, rerender } = render(<Component open={false} ariaLabel="Fallback" />);
    const dialog = container.querySelector('dialog')!;
    rerender(<Component open={false} ariaLabel="Fallback" header="Confirm changes" />);
    expect(container.querySelector('header')?.textContent).toBe('Confirm changes');
    expect(dialog.getAttribute('aria-labelledby')).toBe(container.querySelector('header')?.id);
    rerender(<Component open={false} ariaLabel="Fallback" />);
    expect(container.querySelector('header')).toBeNull();
    expect(dialog.getAttribute('aria-label')).toBe('Fallback');
  });
}

it('preserves a controlled checkbox value when its consumer rejects the change', () => {
  const onValueChange = vi.fn();
  const { container } = render(
    <FormCheckbox id="choice" name="choice" value={true} onValueChange={onValueChange} />,
  );
  const input = container.querySelector('input')!;
  fireEvent.click(input);
  expect(onValueChange).toHaveBeenCalledWith(false);
  expect(input.checked).toBe(true);
});
