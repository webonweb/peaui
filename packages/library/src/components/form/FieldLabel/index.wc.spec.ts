import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { FieldLabelElement, defineFieldLabel } from './index.wc';

defineFieldLabel();

type MountOptions = {
  attrs?: Record<string, string>;
  dataTestId?: string;
  for?: string;
  hint?: Node | string;
  readonly?: boolean;
  required?: boolean;
  text?: string;
};

function mountFieldLabel(options: MountOptions = {}): FieldLabelElement {
  const element = document.createElement(FieldLabelElement.tagName) as FieldLabelElement;

  element.setAttribute('for', options.for ?? 'first-name');
  element.text = options.text ?? 'Imie';

  if (options.readonly !== undefined) {
    element['readonly'] = options.readonly;
  }

  if (options.required !== undefined) {
    element.required = options.required;
  }

  if (options.dataTestId !== undefined) {
    element.dataTestId = options.dataTestId;
  }

  if (options.attrs) {
    for (const [name, value] of Object.entries(options.attrs)) {
      element.setAttribute(name, value);
    }
  }

  if (options.hint !== undefined) {
    if (typeof options.hint === 'string') {
      const hint = document.createElement('span');

      hint.setAttribute('slot', 'hint');
      hint.textContent = options.hint;
      element.appendChild(hint);
    } else {
      options.hint.setAttribute('slot', 'hint');
      element.appendChild(options.hint);
    }
  }

  document.body.appendChild(element);

  return element;
}

async function syncFieldLabelState() {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

const originalMutationObserver = globalThis.MutationObserver;
const mutationObserverInstances: MutationObserverStub[] = [];

class MutationObserverStub {
  readonly callback: MutationCallback;

  constructor(callback: MutationCallback) {
    this.callback = callback;
    mutationObserverInstances.push(this);
  }

  observe() {}
  disconnect() {}

  trigger(records: MutationRecord[]): void {
    this.callback(records, this as unknown as MutationObserver);
  }
}

beforeEach(() => {
  mutationObserverInstances.length = 0;
  globalThis.MutationObserver = MutationObserverStub as unknown as typeof MutationObserver;
});

afterEach(() => {
  document.body.innerHTML = '';

  if (originalMutationObserver) {
    globalThis.MutationObserver = originalMutationObserver;
  } else {
    delete (globalThis as Record<string, unknown>).MutationObserver;
  }
});

describe('FieldLabel (index.wc.ts)', () => {
  it('renders a label with correct class, id and for', async () => {
    const element = mountFieldLabel({
      for: 'first-name',
      text: 'Imie',
    });

    await syncFieldLabelState();

    const wrapper = element.firstElementChild;
    const label = element.querySelector('label');

    expect(wrapper?.classList.contains('peaui-form-label')).toBe(true);
    expect(label?.getAttribute('for')).toBe('first-name');
    expect(label?.getAttribute('id')).toBe('label-first-name');
  });

  it('renders text using innerHTML and sets data-testid for text when dataTestId is provided', async () => {
    const element = mountFieldLabel({
      for: 'email',
      text: 'E-mail <strong>firmowy</strong>',
      dataTestId: 'my-label',
    });

    await syncFieldLabelState();

    const text = element.querySelector<HTMLElement>('[data-testid="my-label-text"]');

    expect(text?.innerHTML).toContain('<strong>firmowy</strong>');
    expect(text?.classList.contains('peaui-form-label__text')).toBe(true);
  });

  it('shows optional note only when required is false and readonly is false', async () => {
    const element = mountFieldLabel({
      for: 'middle-name',
      text: 'Drugie imie',
      required: false,
      readonly: false,
      dataTestId: 'label',
    });

    await syncFieldLabelState();

    const optional = element.querySelector<HTMLElement>('[data-testid="label-optional"]');

    expect(optional?.textContent).toBe('(pole niewymagane)');
    expect(optional?.classList.contains('peaui-form-label__optional')).toBe(true);
  });

  it('does not show optional note when required is true or undefined', async () => {
    const requiredElement = mountFieldLabel({
      for: 'last-name',
      text: 'Nazwisko',
      required: true,
      readonly: false,
      dataTestId: 'label',
    });

    await syncFieldLabelState();

    expect(requiredElement.querySelector('[data-testid="label-optional"]')).toBeNull();

    const undefinedRequiredElement = mountFieldLabel({
      for: 'city',
      text: 'Miasto',
      readonly: false,
      dataTestId: 'label',
    });

    await syncFieldLabelState();

    expect(undefinedRequiredElement.querySelector('[data-testid="label-optional"]')).toBeNull();
  });

  it('adds readonly modifier class to text when readonly is true and hides optional note', async () => {
    const element = mountFieldLabel({
      for: 'id',
      text: 'ID',
      readonly: true,
      required: false,
      dataTestId: 'label',
    });

    await syncFieldLabelState();

    const text = element.querySelector<HTMLElement>('[data-testid="label-text"]');

    expect(text?.classList.contains('peaui-form-label__text--readonly')).toBe(true);
    expect(element.querySelector('[data-testid="label-optional"]')).toBeNull();
  });

  it('renders InfoTooltip only when hint slot is provided and passes computed hint data-test-id', async () => {
    const withoutHint = mountFieldLabel({
      for: 'phone',
      text: 'Telefon',
      dataTestId: 'label',
    });

    await syncFieldLabelState();

    expect(withoutHint.querySelector('peaui-info-tooltip')).toBeNull();

    const hint = document.createElement('span');

    hint.textContent = 'To pole jest opcjonalne.';

    const withHint = mountFieldLabel({
      for: 'phone',
      text: 'Telefon',
      dataTestId: 'label',
      hint,
    });

    await syncFieldLabelState();

    const tooltip = withHint.querySelector('peaui-info-tooltip');
    const label = withHint.querySelector('label');

    expect(tooltip?.getAttribute('data-test-id')).toBe('label-hint');
    expect(tooltip?.getAttribute('placement')).toBe('right');
    expect(label?.querySelector('peaui-info-tooltip')).toBeNull();
    expect(withHint.textContent).toContain('To pole jest opcjonalne.');
  });

  it('forwards attrs and merges custom class on the internal label element', async () => {
    const element = mountFieldLabel({
      attrs: {
        class: 'custom-label',
        'data-foo': 'bar',
      },
    });

    await syncFieldLabelState();

    const wrapper = element.firstElementChild;
    const label = element.querySelector('label');

    expect(wrapper?.classList.contains('peaui-form-label')).toBe(true);
    expect(wrapper?.classList.contains('custom-label')).toBe(true);
    expect(label?.getAttribute('data-foo')).toBe('bar');
  });

  it('ignores managed mutations to avoid an internal render loop', async () => {
    const renderSpy = vi.spyOn(FieldLabelElement.prototype, 'render');
    const hint = document.createElement('span');

    hint.textContent = 'To pole jest opcjonalne.';

    const element = mountFieldLabel({
      dataTestId: 'label',
      hint,
    });

    await syncFieldLabelState();

    const mutationObserver = mutationObserverInstances[0];
    const label = element.querySelector('label');
    const content = element.querySelector('.peaui-form-label__content');
    const tooltip = element.querySelector('peaui-info-tooltip');
    const managedNodes = [content, tooltip].filter(Boolean) as Node[];

    renderSpy.mockClear();
    mutationObserver?.trigger([
      {
        addedNodes: managedNodes as unknown as NodeList,
        attributeName: null,
        attributeNamespace: null,
        nextSibling: null,
        oldValue: null,
        previousSibling: null,
        removedNodes: [] as unknown as NodeList,
        target: label as Node,
        type: 'childList',
      },
    ] as MutationRecord[]);

    expect(renderSpy).not.toHaveBeenCalled();
  });
});
