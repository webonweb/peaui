import { afterEach, describe, expect, it, vi } from 'vitest';
import { observeControlReset } from '../../helpers/form-reset.helper';

const cleanup: (() => void)[] = [];
const nextTask = () => new Promise<void>((resolve) => setTimeout(resolve, 0));
afterEach(() => {
  cleanup.splice(0).forEach((dispose) => dispose());
  document.body.replaceChildren();
});
function fixture(reset: (input: HTMLInputElement) => void) {
  const form = document.createElement('form');
  const input = document.createElement('input');
  form.append(input);
  document.body.append(form);
  const dispose = observeControlReset(input, () => reset(input));
  cleanup.push(dispose);
  return { form, input, dispose };
}
describe('native reset default action ordering', () => {
  it('restores the model after the browser default action, even with an event microtask checkpoint', async () => {
    const { form, input } = fixture((control) => {
      control.value = 'Initial';
    });
    input.value = 'Changed';
    form.dispatchEvent(new Event('reset', { bubbles: true, cancelable: true }));
    // Trusted reset-button activation can run a microtask checkpoint before the native reset.
    await Promise.resolve();
    input.value = input.defaultValue;
    await nextTask();
    expect(input.value).toBe('Initial');
  });
  it('respects a canceled reset', async () => {
    const reset = vi.fn();
    const { form } = fixture(reset);
    form.addEventListener('reset', (event) => event.preventDefault());
    form.reset();
    await nextTask();
    expect(reset).not.toHaveBeenCalled();
  });
  it('does not call an observer disposed before the native reset finishes', async () => {
    const reset = vi.fn();
    const { form, dispose } = fixture(reset);
    form.reset();
    dispose();
    await nextTask();
    expect(reset).not.toHaveBeenCalled();
  });
});
