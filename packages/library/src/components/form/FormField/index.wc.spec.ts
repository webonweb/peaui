import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/components/form/FieldLabel/index.wc', () => {
  class MockFieldLabelElement extends HTMLElement {
    static readonly tagName = 'peaui-field-label';

    connectedCallback(): void {
      this.render();
    }

    get text(): string {
      return this.getAttribute('text') ?? '';
    }

    set text(value: string) {
      this.setAttribute('text', value);
      this.render();
    }

    get dataTestId(): string | undefined {
      return this.getAttribute('data-testid') ?? undefined;
    }

    set dataTestId(value: string | null | undefined) {
      if (value === null || value === undefined) {
        this.removeAttribute('data-testid');
      } else {
        this.setAttribute('data-testid', value);
      }

      this.render();
    }

    set required(value: boolean) {
      this.setAttribute('required', String(value));
    }

    set readonly(value: boolean) {
      this.setAttribute('readonly', String(value));
    }

    render(): void {
      const label = document.createElement('label');
      const text = document.createElement('span');

      label.setAttribute('for', this.getAttribute('for') ?? '');
      text.innerHTML = this.text;
      label.append(text, ...Array.from(this.childNodes));
      this.replaceChildren(label);
    }
  }

  function defineFieldLabel(): typeof MockFieldLabelElement {
    if (!window.customElements.get(MockFieldLabelElement.tagName)) {
      window.customElements.define(MockFieldLabelElement.tagName, MockFieldLabelElement);
    }

    return MockFieldLabelElement;
  }

  defineFieldLabel();

  return {
    FieldLabelElement: MockFieldLabelElement,
    defineFieldLabel,
    default: MockFieldLabelElement,
  };
});

vi.mock('@/components/basic/SvgIcon/index.wc', () => {
  class MockSvgIconElement extends HTMLElement {
    static readonly tagName = 'peaui-svg-icon';

    get name(): string {
      return this.getAttribute('name') ?? '';
    }

    set name(value: string) {
      this.setAttribute('name', value);
      this.render();
    }

    render(): void {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

      svg.setAttribute('data-icon', this.name);
      svg.setAttribute('class', this.getAttribute('class') ?? '');
      this.replaceChildren(svg);
    }

    connectedCallback(): void {
      this.render();
    }
  }

  function defineSvgIcon(): typeof MockSvgIconElement {
    if (!window.customElements.get(MockSvgIconElement.tagName)) {
      window.customElements.define(MockSvgIconElement.tagName, MockSvgIconElement);
    }

    return MockSvgIconElement;
  }

  defineSvgIcon();

  return {
    SvgIconElement: MockSvgIconElement,
    defineSvgIcon,
    default: MockSvgIconElement,
  };
});

vi.mock('@/components/feedback/MessageText/index.wc', () => {
  class MockMessageTextElement extends HTMLElement {
    static readonly tagName = 'peaui-message-text';

    connectedCallback(): void {
      this.render();
    }

    get variant(): string {
      return this.getAttribute('variant') ?? 'default';
    }

    set variant(value: string) {
      this.setAttribute('variant', value);
      this.render();
    }

    get size(): string {
      return this.getAttribute('size') ?? 's';
    }

    set size(value: string) {
      this.setAttribute('size', value);
      this.render();
    }

    get dataTestId(): string | undefined {
      return this.getAttribute('data-testid') ?? undefined;
    }

    set dataTestId(value: string | null | undefined) {
      if (value === null || value === undefined) {
        this.removeAttribute('data-testid');
      } else {
        this.setAttribute('data-testid', value);
      }

      this.render();
    }

    render(): void {
      const root = document.createElement('div');

      if (this.id) {
        root.id = this.id;
      }

      if (this.dataTestId) {
        root.setAttribute('data-testid', this.dataTestId);
      }

      root.setAttribute('data-variant', this.variant);
      root.setAttribute('data-size', this.size);
      root.append(...Array.from(this.childNodes));
      this.replaceChildren(root);
    }
  }

  function defineMessageText(): typeof MockMessageTextElement {
    if (!window.customElements.get(MockMessageTextElement.tagName)) {
      window.customElements.define(MockMessageTextElement.tagName, MockMessageTextElement);
    }

    return MockMessageTextElement;
  }

  defineMessageText();

  return {
    MessageTextElement: MockMessageTextElement,
    defineMessageText,
    default: MockMessageTextElement,
  };
});

import { FormFieldElement, defineFormField } from './index.wc';

defineFormField();

type MountOptions = {
  after?: string;
  attrs?: Record<string, string>;
  before?: string;
  canErase?: boolean;
  dataTestId?: string;
  description?: Node | string;
  disabled?: boolean;
  error?: Node | string;
  field?: HTMLElement;
  hint?: Node | string;
  iconAfter?: string;
  iconBefore?: string;
  id?: string;
  label?: string;
  maxLength?: number;
  name?: string;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  rightErasePosition?: number;
  success?: Node | string;
  value?: number | string | string[] | null;
};

function appendSlottedNode(
  element: FormFieldElement,
  slotName: string,
  content: Node | string | undefined,
) {
  if (content === undefined) {
    return;
  }

  if (typeof content === 'string') {
    const node = document.createElement('span');

    node.setAttribute('slot', slotName);
    node.textContent = content;
    element.appendChild(node);
    return;
  }

  content.setAttribute('slot', slotName);
  element.appendChild(content);
}

function mountFormField(options: MountOptions = {}): FormFieldElement {
  const element = document.createElement(FormFieldElement.tagName) as FormFieldElement;
  const field = options.field ?? document.createElement('input');

  if (options.after !== undefined) {
    element.afterText = options.after;
  }

  if (options.before !== undefined) {
    element.beforeText = options.before;
  }

  if (options.canErase !== undefined) {
    element.canErase = options.canErase;
  }

  if (options.dataTestId !== undefined) {
    element.dataTestId = options.dataTestId;
  }

  if (options.disabled !== undefined) {
    element.disabled = options.disabled;
  }

  if (options.iconAfter !== undefined) {
    element.iconAfter = options.iconAfter;
  }

  if (options.iconBefore !== undefined) {
    element.iconBefore = options.iconBefore;
  }

  element.id = options.id ?? 'first-name';
  element.name = options.name ?? 'firstName';

  if (options.label !== undefined) {
    element.label = options.label;
  }

  if (options.maxLength !== undefined) {
    element.maxLength = options.maxLength;
  }

  if (options.placeholder !== undefined) {
    element.placeholder = options.placeholder;
  }

  if (options.readonly !== undefined) {
    element.readonly = options.readonly;
  }

  if (options.required !== undefined) {
    element.required = options.required;
  }

  if (options.rightErasePosition !== undefined) {
    element.rightErasePosition = options.rightErasePosition;
  }

  if (options.value !== undefined) {
    element.value = options.value;
  }

  if (options.attrs) {
    for (const [name, value] of Object.entries(options.attrs)) {
      element.setAttribute(name, value);
    }
  }

  appendSlottedNode(element, 'hint', options.hint);
  appendSlottedNode(element, 'description', options.description);
  appendSlottedNode(element, 'error', options.error);
  appendSlottedNode(element, 'success', options.success);

  field.setAttribute('data-testid', 'field-element');
  element.appendChild(field);
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

describe('FormField (index.wc.ts)', () => {
  it('renders label and hint slot when label is provided', async () => {
    const element = mountFormField({
      label: 'Imie',
      hint: 'Podpowiedz',
    });

    await syncFormFieldState();

    expect(element.textContent).toContain('Imie');
    expect(element.textContent).toContain('Podpowiedz');
  });

  it('passes bindings to field element and renders before/after text with icons', async () => {
    const element = mountFormField({
      value: 'Jan',
      placeholder: 'Wpisz imie',
      maxLength: 20,
      required: true,
      readonly: true,
      disabled: true,
      before: 'PL',
      after: 'kg',
      iconBefore: 'cross',
      iconAfter: 'plus',
    });

    await syncFormFieldState();

    const input = element.querySelector<HTMLInputElement>('[data-testid="field-element"]');

    expect(input?.getAttribute('id')).toBe('first-name');
    expect(input?.getAttribute('name')).toBe('firstName');
    expect(input?.getAttribute('placeholder')).toBe('Wpisz imie');
    expect(input?.getAttribute('maxlength')).toBe('20');
    expect(input?.getAttribute('aria-required')).toBe('true');
    expect(input?.getAttribute('aria-disabled')).toBe('true');
    expect(input?.getAttribute('aria-invalid')).toBe('false');
    expect(input?.hasAttribute('readonly')).toBe(true);
    expect(input?.hasAttribute('disabled')).toBe(true);
    expect(input?.classList.contains('peaui-form-field__element')).toBe(true);
    expect(input?.classList.contains('peaui-form-field__element--medium')).toBe(true);
    expect(input?.classList.contains('peaui-form-field__element--disabled')).toBe(true);
    expect(input?.classList.contains('peaui-form-field__element--readonly')).toBe(true);

    expect(element.querySelector('[data-before="PL"]')).toBeTruthy();
    expect(element.querySelector('[data-after="kg"]')).toBeTruthy();
    expect(
      Array.from(element.querySelectorAll('peaui-svg-icon svg')).map((icon) =>
        icon.getAttribute('data-icon'),
      ),
    ).toEqual(['cross', 'plus']);
  });

  it('falls back to name for accessible name only when label and explicit aria attrs are missing', async () => {
    const withoutLabel = mountFormField();

    await syncFormFieldState();

    expect(
      withoutLabel.querySelector('[data-testid="field-element"]')?.getAttribute('aria-label'),
    ).toBe('firstName');
    expect(
      withoutLabel.querySelector('[data-testid="field-element"]')?.getAttribute('aria-labelledby'),
    ).toBeNull();

    const withExplicitLabel = mountFormField({
      attrs: {
        'aria-label': 'Imie',
      },
    });

    await syncFormFieldState();

    expect(
      withExplicitLabel.querySelector('[data-testid="field-element"]')?.getAttribute('aria-label'),
    ).toBe('Imie');

    const withExplicitLabelledBy = mountFormField({
      attrs: {
        'aria-labelledby': 'name-label',
      },
    });

    await syncFormFieldState();

    expect(
      withExplicitLabelledBy
        .querySelector('[data-testid="field-element"]')
        ?.getAttribute('aria-label'),
    ).toBeNull();
    expect(
      withExplicitLabelledBy
        .querySelector('[data-testid="field-element"]')
        ?.getAttribute('aria-labelledby'),
    ).toBe('name-label');
  });

  it('renders erase button and emits on:remove for filled values', async () => {
    const element = mountFormField({
      value: 'Jan',
      canErase: true,
      dataTestId: 'form-field',
      rightErasePosition: 44,
      after: 'kg',
    });
    const removeSpy = vi.fn();

    element.addEventListener('on:remove', removeSpy);
    await syncFormFieldState();

    const button = element.querySelector<HTMLButtonElement>(
      '[data-testid="form-field-erase-button"]',
    );

    expect(button?.getAttribute('style')).toContain('--right: 44px');
    button?.click();

    expect(removeSpy).toHaveBeenCalledTimes(1);
  });

  it('keeps focus on the input when value updates trigger a parent re-render', async () => {
    const element = mountFormField({
      canErase: true,
      dataTestId: 'form-field',
      value: '',
    });

    await syncFormFieldState();

    const input = element.querySelector<HTMLInputElement>('[data-testid="field-element"]');

    if (!input) {
      throw new Error('Input not rendered');
    }

    input.focus();
    expect(document.activeElement).toBe(input);

    element.value = 'A';
    await syncFormFieldState();

    expect(document.activeElement).toBe(input);
    expect(input.value).toBe('A');
    expect(element.querySelector('[data-testid="form-field-erase-button"]')).toBeTruthy();
  });

  it('does not emit on:remove on manual Enter keypress for native erase button', async () => {
    const element = mountFormField({
      value: 'Jan',
      canErase: true,
      dataTestId: 'form-field',
    });
    const removeSpy = vi.fn();

    element.addEventListener('on:remove', removeSpy);
    await syncFormFieldState();

    element
      .querySelector<HTMLButtonElement>('[data-testid="form-field-erase-button"]')
      ?.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', bubbles: true }));

    expect(removeSpy).not.toHaveBeenCalled();
  });

  it('renders description message and sets aria-describedby when description slot exists', async () => {
    const element = mountFormField({
      dataTestId: 'form-field',
      description: 'Opis pola',
    });

    await syncFormFieldState();

    expect(
      element.querySelector('[data-testid="form-field-help-description"]')?.textContent,
    ).toContain('Opis pola');
    expect(
      element.querySelector('[data-testid="field-element"]')?.getAttribute('aria-describedby'),
    ).toBe('first-name-help-description');
  });

  it('generates a fallback control id when the host id is empty', async () => {
    const element = mountFormField({
      id: '',
      label: 'Imie',
    });

    await syncFormFieldState();

    const input = element.querySelector<HTMLInputElement>('[data-testid="field-element"]');
    const label = element.querySelector('peaui-field-label');

    expect(input?.getAttribute('id')).toMatch(/^peaui-form-field-\d+$/);
    expect(label?.getAttribute('for')).toBe(input?.getAttribute('id'));
  });

  it('renders error message, marks field as invalid and hides description', async () => {
    const element = mountFormField({
      dataTestId: 'form-field',
      error: 'Pole jest niepoprawne',
      description: 'Opis pola',
    });

    await syncFormFieldState();

    const input = element.querySelector('[data-testid="field-element"]');

    expect(element.querySelector('[data-testid="form-field-error"]')?.textContent).toContain(
      'Pole jest niepoprawne',
    );
    expect(element.querySelector('[data-testid="form-field-help-description"]')).toBeNull();
    expect(input?.getAttribute('aria-invalid')).toBe('true');
    expect(input?.getAttribute('aria-describedby')).toBe(
      'first-name-error first-name-assistive-description',
    );
    expect(input?.classList.contains('peaui-form-field__element--error')).toBe(true);
  });

  it('keeps additional assistive descriptions when a higher-priority message is visible', async () => {
    const element = mountFormField({
      dataTestId: 'form-field',
      value: 'abcd',
      maxLength: 8,
      description: 'Opis pola',
      error: 'Pole jest niepoprawne',
    });

    await syncFormFieldState();

    const input = element.querySelector('[data-testid="field-element"]');
    const describedBy = input?.getAttribute('aria-describedby')?.split(' ') ?? [];

    expect(describedBy).toContain('first-name-error');
    expect(describedBy).toContain('first-name-assistive-description');
    expect(
      element.querySelector('[data-testid="form-field-assistive-description"]')?.textContent,
    ).toContain('Opis pola');
    expect(
      element.querySelector('[data-testid="form-field-assistive-description"]')?.textContent,
    ).toContain('Dlugosc tekstu: 4 / 8 znakow');
  });

  it('renders max length message with info variant when value reaches limit', async () => {
    const element = mountFormField({
      value: 'abcd',
      maxLength: 4,
      dataTestId: 'form-field',
    });

    await syncFormFieldState();

    const message = element.querySelector('[data-testid="form-field-help-max-length-description"]');

    expect(message?.textContent).toContain('4 / 4');
    expect(message?.querySelector('[data-variant]')?.getAttribute('data-variant')).toBe('info');
    expect(message?.getAttribute('role')).toBe('status');
    expect(message?.getAttribute('aria-live')).toBe('polite');
    expect(
      element.querySelector('[data-testid="field-element"]')?.getAttribute('aria-describedby'),
    ).toBe('first-name-help-max-length-description');
  });
});
