import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/components/form/FormField/index.wc', () => {
  class MockFormFieldElement extends HTMLElement {
    static readonly tagName = 'peaui-form-field';

    #removeButton = document.createElement('button');

    constructor() {
      super();

      this.#removeButton.type = 'button';
      this.#removeButton.setAttribute('data-testid', 'remove-button');
      this.#removeButton.textContent = 'remove';
      this.#removeButton.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('on:remove', { bubbles: true, composed: true }));
      });
    }

    connectedCallback(): void {
      this.render();
    }

    set afterText(value: string | undefined) {
      this.#setStringAttribute('after', value);
    }

    set beforeText(value: string | undefined) {
      this.#setStringAttribute('before', value);
    }

    set canErase(value: boolean) {
      this.setAttribute('can-erase', String(value));
    }

    set disabled(value: boolean) {
      this.setAttribute('disabled', String(value));
    }

    set iconAfter(value: string | undefined) {
      this.#setStringAttribute('icon-after', value);
    }

    set iconBefore(value: string | undefined) {
      this.#setStringAttribute('icon-before', value);
    }

    set label(value: string | undefined) {
      this.#setStringAttribute('label', value);
    }

    set maxLength(value: number | undefined) {
      if (value === undefined) {
        this.removeAttribute('max-length');
      } else {
        this.setAttribute('max-length', String(value));
      }
    }

    set name(value: string) {
      this.setAttribute('name', value);
    }

    set placeholder(value: string | undefined) {
      this.#setStringAttribute('placeholder', value);
    }

    set readonly(value: boolean) {
      this.setAttribute('readonly', String(value));
    }

    set required(value: boolean) {
      this.setAttribute('required', String(value));
    }

    set dataTestId(value: string | undefined) {
      this.#setStringAttribute('data-testid', value);
    }

    set rightErasePosition(value: number | undefined) {
      if (value === undefined) {
        this.removeAttribute('right-erase-position');
      } else {
        this.setAttribute('right-erase-position', String(value));
      }
    }

    set value(value: string | undefined) {
      this.#setStringAttribute('value', value);
    }

    render(): void {
      const input = this.querySelector<HTMLInputElement>('input');

      if (input) {
        input.type = input.getAttribute('type') ?? 'text';
        input.id = `${this.id}-control`;
        input.setAttribute('name', this.getAttribute('name') ?? '');
        input.setAttribute('placeholder', this.getAttribute('placeholder') ?? '');
        input.style.paddingRight = '28px';

        const currentClassNames = new Set(input.className.split(/\s+/).filter(Boolean));

        currentClassNames.add('field-element');
        input.className = Array.from(currentClassNames).join(' ');

        const value = this.getAttribute('value');

        if (value !== null) {
          input.value = value;
          input.setAttribute('value', value);
        }
      }

      const nodes = Array.from(this.childNodes).filter((node) => node !== this.#removeButton);

      this.replaceChildren(...nodes, this.#removeButton);
    }

    #setStringAttribute(name: string, value: string | undefined): void {
      if (value === undefined) {
        this.removeAttribute(name);
      } else {
        this.setAttribute(name, value);
      }
    }
  }

  function defineFormField(): typeof MockFormFieldElement {
    if (!window.customElements.get(MockFormFieldElement.tagName)) {
      window.customElements.define(MockFormFieldElement.tagName, MockFormFieldElement);
    }

    return MockFormFieldElement;
  }

  defineFormField();

  return {
    FormFieldElement: MockFormFieldElement,
    defineFormField,
    default: MockFormFieldElement,
  };
});

import { FormInputElement, defineFormInput } from './index.wc';

defineFormInput();

type MountOptions = {
  attrs?: Record<string, string>;
  dataTestId?: string;
  after?: string;
  before?: string;
  canErase?: boolean;
  description?: HTMLElement | string;
  disabled?: boolean;
  error?: HTMLElement | string;
  hint?: HTMLElement | string;
  iconAfter?: string;
  iconBefore?: string;
  id?: string;
  label?: string;
  maxLength?: number;
  name?: string;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  success?: HTMLElement | string;
  value?: string;
};

function appendSlottedNode(
  element: FormInputElement,
  slotName: 'description' | 'error' | 'hint' | 'success',
  content: HTMLElement | string | undefined,
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

function mountFormInput(options: MountOptions = {}): FormInputElement {
  const element = document.createElement(FormInputElement.tagName) as FormInputElement;

  element.id = options.id ?? 'first-name';
  element.name = options.name ?? 'firstName';

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

  document.body.appendChild(element);

  return element;
}

async function syncFormInputState() {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('FormInput (index.wc.ts)', () => {
  it('renders text input and merges attrs with FormField bindings', async () => {
    const element = mountFormInput({
      value: 'Jan',
      placeholder: 'Wpisz imie',
      dataTestId: 'form-input',
      attrs: {
        title: 'Pole tekstowe',
      },
    });

    await syncFormInputState();

    const input = element.querySelector<HTMLInputElement>('input');

    expect(input?.getAttribute('type')).toBe('text');
    expect(input?.getAttribute('id')).toBe('first-name-field-control');
    expect(input?.getAttribute('name')).toBe('firstName');
    expect(input?.getAttribute('placeholder')).toBe('Wpisz imie');
    expect(input?.getAttribute('title')).toBe('Pole tekstowe');
    expect(input?.getAttribute('data-testid')).toBe('form-input-element');
    expect(input?.classList.contains('peaui-form-field-input')).toBe(true);
    expect(input?.classList.contains('field-element')).toBe(true);
    expect(input?.value).toBe('Jan');
  });

  it('emits update:value on input', async () => {
    const element = mountFormInput({
      value: 'Jan',
    });
    const updateSpy = vi.fn();

    element.addEventListener('update:value', updateSpy);
    await syncFormInputState();

    const input = element.querySelector<HTMLInputElement>('input');

    if (!input) {
      throw new Error('Input not rendered');
    }

    input.value = 'Anna';
    input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));

    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy.mock.calls[0]?.[0]).toBeInstanceOf(CustomEvent);
    expect((updateSpy.mock.calls[0]?.[0] as CustomEvent<string>).detail).toBe('Anna');
    expect(element.value).toBe('Anna');
  });

  it('does not re-render the host component on each input event', async () => {
    const element = mountFormInput({
      value: 'Jan',
    });

    await syncFormInputState();

    const input = element.querySelector<HTMLInputElement>('input');

    if (!input) {
      throw new Error('Input not rendered');
    }

    const renderSpy = vi.spyOn(element, 'render');

    input.value = 'Anna';
    input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));

    expect(renderSpy).not.toHaveBeenCalled();
    expect(element.value).toBe('Anna');
  });

  it('clears value and emits on:remove when FormField emits remove', async () => {
    const element = mountFormInput({
      value: 'Jan',
    });
    const removeSpy = vi.fn();
    const updateSpy = vi.fn();

    element.addEventListener('on:remove', removeSpy);
    element.addEventListener('update:value', updateSpy);
    await syncFormInputState();

    element.querySelector<HTMLButtonElement>('[data-testid="remove-button"]')?.click();

    expect(removeSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect((updateSpy.mock.calls[0]?.[0] as CustomEvent<string>).detail).toBe('');
    expect(element.value).toBe('');
  });

  it('forwards hint, description, error and success slots', async () => {
    const element = mountFormInput({
      value: 'Jan',
      hint: 'Hint content',
      description: 'Description content',
      error: 'Error content',
      success: 'Success content',
    });

    await syncFormInputState();

    expect(element.textContent).toContain('Hint content');
    expect(element.textContent).toContain('Description content');
    expect(element.textContent).toContain('Error content');
    expect(element.textContent).toContain('Success content');
  });
});
