import { afterEach, describe, expect, it, vi } from 'vitest';
import { FormInputElement } from './index.wc';
import { FormFieldElement } from '../FormField/index.wc';
import { FormFieldLabelElement } from '../FormFieldLabel/index.wc';

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe('Native form update cost', () => {
  it('does no render work for an unchanged attribute and preserves the focused input', () => {
    const element = new FormInputElement();
    element.label = 'Name';
    element.value = 'Alice';
    document.body.append(element);
    const input = element.querySelector('input')!;
    input.focus();
    input.setSelectionRange(1, 3);
    const spies = [FormInputElement, FormFieldElement, FormFieldLabelElement].map((Component) =>
      vi.spyOn(Component.prototype, 'render'),
    );
    element.setAttribute('label', 'Name');
    element.value = 'Alice';
    expect(spies.every((spy) => spy.mock.calls.length === 0)).toBe(true);
    expect(document.activeElement).toBe(input);
    expect([input.selectionStart, input.selectionEnd]).toEqual([1, 3]);
  });
});
