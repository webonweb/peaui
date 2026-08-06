import { afterEach, describe, expect, it } from 'vitest';

import { FormFieldElement, defineFormField } from './index.wc';

defineFormField();

function mountFormFieldWithDescription(): FormFieldElement {
  const element = document.createElement(FormFieldElement.tagName) as FormFieldElement;
  const description = document.createElement('span');
  const input = document.createElement('input');

  element.id = 'first-name';
  element.name = 'firstName';
  description.setAttribute('slot', 'description');
  description.textContent = 'Opis pola';
  input.setAttribute('data-testid', 'field-element');

  element.append(description, input);
  document.body.appendChild(element);

  return element;
}

async function syncFormFieldState() {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('FormField integration (index.wc.ts)', () => {
  it('keeps the MessageText wrapper and xs size classes after parent re-render', async () => {
    const element = mountFormFieldWithDescription();

    await syncFormFieldState();
    element.render();
    await syncFormFieldState();

    const messageHost = element.querySelector('peaui-message-text');
    const messageRoot = messageHost?.querySelector('.peaui-message-text');
    const messageContent = messageHost?.querySelector('.peaui-message-text__content');

    expect(messageHost).not.toBeNull();
    expect(messageRoot?.classList.contains('peaui-message-text--size-xs')).toBe(true);
    expect(messageContent?.textContent).toContain('Opis pola');
    expect(messageHost?.firstElementChild).toBe(messageRoot);
  });
});
