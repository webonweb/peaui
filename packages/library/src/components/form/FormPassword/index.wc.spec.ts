import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { copyToClipboardMock } = vi.hoisted(() => ({
  copyToClipboardMock: vi.fn(),
}));

vi.mock('@/helpers/functions.helper', () => ({
  copyToClipboard: copyToClipboardMock,
}));

vi.mock('@/components/form/FormField/index.wc', () => {
  class MockFormFieldElement extends HTMLElement {
    static readonly tagName = 'peaui-form-field';

    set beforeText(value: string | undefined) {
      this.#setStringAttribute('before', value);
    }

    set disabled(value: boolean) {
      this.setAttribute('disabled', String(value));
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

    set value(value: string | undefined) {
      this.#setStringAttribute('value', value);
    }

    connectedCallback(): void {
      this.render();
    }

    render(): void {
      const input = this.querySelector<HTMLInputElement>('input');

      if (input) {
        input.id = `${this.id}-control`;
        input.setAttribute('name', this.getAttribute('name') ?? '');
        input.setAttribute('placeholder', this.getAttribute('placeholder') ?? '');
        input.style.setProperty('--pl', '12px');
        input.style.setProperty('--pr', '12px');

        const currentClassNames = new Set(input.className.split(/\s+/).filter(Boolean));

        currentClassNames.add('field-element');
        input.className = Array.from(currentClassNames).join(' ');

        const value = this.getAttribute('value');

        if (value !== null) {
          input.value = value;
          input.setAttribute('value', value);
        }
      }
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

    connectedCallback(): void {
      this.render();
    }

    render(): void {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

      svg.setAttribute('data-icon', this.name);
      svg.setAttribute('class', this.getAttribute('class') ?? '');
      this.replaceChildren(svg);
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

import { FormPasswordElement, defineFormPassword } from './index.wc';

defineFormPassword();

type MountOptions = {
  attrs?: Record<string, string>;
  before?: string;
  canCopy?: boolean;
  canVisible?: boolean;
  dataTestId?: string;
  description?: HTMLElement | string;
  disabled?: boolean;
  enablePasswordStrengthMeter?: boolean;
  error?: HTMLElement | string;
  hint?: HTMLElement | string;
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
  element: FormPasswordElement,
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

function mountFormPassword(options: MountOptions = {}): FormPasswordElement {
  const element = document.createElement(FormPasswordElement.tagName) as FormPasswordElement;

  element.id = options.id ?? 'user-password';
  element.name = options.name ?? 'userPassword';

  if (options.before !== undefined) {
    element.beforeText = options.before;
  }

  if (options.canCopy !== undefined) {
    element.canCopy = options.canCopy;
  }

  if (options.canVisible !== undefined) {
    element.canVisible = options.canVisible;
  }

  if (options.dataTestId !== undefined) {
    element.dataTestId = options.dataTestId;
  }

  if (options.disabled !== undefined) {
    element.disabled = options.disabled;
  }

  if (options.enablePasswordStrengthMeter !== undefined) {
    element.enablePasswordStrengthMeter = options.enablePasswordStrengthMeter;
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

async function flushState() {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

describe('FormPassword (index.wc.ts)', () => {
  beforeEach(() => {
    copyToClipboardMock.mockReset();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('does not render password strength meter by default', async () => {
    const element = mountFormPassword({
      dataTestId: 'form-password',
      value: 'TajneHaslo123!',
    });

    await flushState();

    expect(element.querySelector('[data-testid="form-password-strength-meter"]')).toBeFalsy();
  });

  it('renders password input with derived test ids and action buttons', async () => {
    const element = mountFormPassword({
      dataTestId: 'form-password',
      value: 'TajneHaslo123!',
      placeholder: 'Wpisz haslo',
      attrs: {
        title: 'Pole hasla',
      },
    });

    await flushState();

    const input = element.querySelector<HTMLInputElement>('[data-testid="form-password-element"]');
    const toggleButton = element.querySelector<HTMLButtonElement>(
      '[data-testid="form-password-toggle-button"]',
    );
    const copyButton = element.querySelector<HTMLButtonElement>(
      '[data-testid="form-password-copy-button"]',
    );

    expect(input?.getAttribute('type')).toBe('password');
    expect(input?.getAttribute('id')).toBe('user-password-field-control');
    expect(input?.getAttribute('name')).toBe('userPassword');
    expect(input?.getAttribute('placeholder')).toBe('Wpisz haslo');
    expect(input?.getAttribute('title')).toBe('Pole hasla');
    expect(input?.classList.contains('field-element')).toBe(true);
    expect(input?.getAttribute('style')).toContain('--pr: 5.75rem;');
    expect(toggleButton?.getAttribute('aria-controls')).toBe('user-password-field-control');
    expect(copyButton?.getAttribute('aria-label')).toBe('Kopiuj haslo');
  });

  it('renders password strength meter and marks a compliant password as strong', async () => {
    const element = mountFormPassword({
      dataTestId: 'form-password',
      enablePasswordStrengthMeter: true,
      value: 'BezpieczneHaslo34!$',
    });

    await flushState();

    const input = element.querySelector<HTMLInputElement>('[data-testid="form-password-element"]');
    const meter = element.querySelector<HTMLElement>(
      '[data-testid="form-password-strength-meter"]',
    );
    const label = element.querySelector<HTMLElement>(
      '[data-testid="form-password-strength-label"]',
    );
    const activeSegments = element.querySelectorAll(
      '.peaui-form-field-password__strength-segment[data-active="true"]',
    );

    expect(meter?.getAttribute('data-tone')).toBe('success');
    expect(label?.textContent).toBe('Silne');
    expect(activeSegments).toHaveLength(4);
    expect(input?.validationMessage).toBe('');
    expect(input?.getAttribute('aria-describedby')).toContain('user-password-strength-status');
  });

  it('shows validation feedback for a weak password when strength meter is enabled', async () => {
    const element = mountFormPassword({
      dataTestId: 'form-password',
      enablePasswordStrengthMeter: true,
      value: 'abc',
    });

    await flushState();

    const input = element.querySelector<HTMLInputElement>('[data-testid="form-password-element"]');
    const label = element.querySelector<HTMLElement>(
      '[data-testid="form-password-strength-label"]',
    );
    const activeSegments = element.querySelectorAll(
      '.peaui-form-field-password__strength-segment[data-active="true"]',
    );

    expect(label?.textContent).toBe('Slabe');
    expect(activeSegments).toHaveLength(2);
    expect(input?.validationMessage).toContain('co najmniej 12 znakow');
  });

  it('keeps the input before action buttons in DOM order', async () => {
    const element = mountFormPassword({
      dataTestId: 'form-password',
      value: 'TajneHaslo123!',
    });

    await flushState();

    const input = element.querySelector<HTMLInputElement>('[data-testid="form-password-element"]');
    const toggleButton = element.querySelector<HTMLButtonElement>(
      '[data-testid="form-password-toggle-button"]',
    );

    expect(input?.compareDocumentPosition(toggleButton ?? document.body)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it('generates a fallback input id when host id is empty', async () => {
    const element = mountFormPassword({
      id: '',
      dataTestId: 'form-password',
      value: 'TajneHaslo123!',
    });

    await flushState();

    const input = element.querySelector<HTMLInputElement>('[data-testid="form-password-element"]');
    const toggleButton = element.querySelector<HTMLButtonElement>(
      '[data-testid="form-password-toggle-button"]',
    );

    expect(input?.getAttribute('id')).toMatch(/^peaui-form-field-password-\d+-field-control$/);
    expect(toggleButton?.getAttribute('aria-controls')).toBe(input?.getAttribute('id'));
  });

  it('emits update:value on input', async () => {
    const element = mountFormPassword({
      value: 'TajneHaslo123!',
    });
    const updateSpy = vi.fn();

    element.addEventListener('update:value', updateSpy);
    await flushState();

    const input = element.querySelector<HTMLInputElement>('input');

    if (!input) {
      throw new Error('Input not rendered');
    }

    input.value = 'NoweHaslo456!';
    input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));

    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect((updateSpy.mock.calls[0]?.[0] as CustomEvent<string>).detail).toBe('NoweHaslo456!');
  });

  it('does not re-render the host component on each input event and keeps copy button state in sync', async () => {
    const element = mountFormPassword({
      dataTestId: 'form-password',
      value: '',
    });

    await flushState();

    const input = element.querySelector<HTMLInputElement>('input');
    const copyButton = element.querySelector<HTMLButtonElement>(
      '[data-testid="form-password-copy-button"]',
    );

    if (!input || !copyButton) {
      throw new Error('Password input actions not rendered');
    }

    const renderSpy = vi.spyOn(element, 'render');

    expect(copyButton.disabled).toBe(true);

    input.value = 'NoweHaslo456!';
    input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));

    expect(renderSpy).not.toHaveBeenCalled();
    expect(element.value).toBe('NoweHaslo456!');
    expect(copyButton.disabled).toBe(false);
  });

  it('updates the strength meter on input without forcing a full render', async () => {
    const element = mountFormPassword({
      dataTestId: 'form-password',
      enablePasswordStrengthMeter: true,
      value: 'abc',
    });

    await flushState();

    const input = element.querySelector<HTMLInputElement>('input');
    const label = () =>
      element.querySelector<HTMLElement>('[data-testid="form-password-strength-label"]');

    if (!input) {
      throw new Error('Input not rendered');
    }

    const renderSpy = vi.spyOn(element, 'render');

    expect(label()?.textContent).toBe('Slabe');

    input.value = 'BezpieczneHaslo34!$';
    input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    await flushState();

    expect(renderSpy).not.toHaveBeenCalled();
    expect(label()?.textContent).toBe('Silne');
  });

  it('toggles password visibility and updates accessibility state', async () => {
    const element = mountFormPassword({
      dataTestId: 'form-password',
      value: 'TajneHaslo123!',
    });

    await flushState();

    const input = element.querySelector<HTMLInputElement>('[data-testid="form-password-element"]');
    const toggleButton = element.querySelector<HTMLButtonElement>(
      '[data-testid="form-password-toggle-button"]',
    );

    expect(toggleButton?.getAttribute('aria-label')).toBe('Pokaz haslo');
    expect(toggleButton?.getAttribute('aria-pressed')).toBe('false');

    toggleButton?.click();
    await flushState();

    expect(input?.getAttribute('type')).toBe('text');
    expect(toggleButton?.getAttribute('aria-label')).toBe('Ukryj haslo');
    expect(toggleButton?.getAttribute('aria-pressed')).toBe('true');
  });

  it('hides copy button when canCopy is false and reduces input padding to a single action', async () => {
    const element = mountFormPassword({
      canCopy: false,
      dataTestId: 'form-password',
      value: 'TajneHaslo123!',
    });

    await flushState();

    const input = element.querySelector<HTMLInputElement>('[data-testid="form-password-element"]');

    expect(element.querySelector('[data-testid="form-password-toggle-button"]')).toBeTruthy();
    expect(element.querySelector('[data-testid="form-password-copy-button"]')).toBeFalsy();
    expect(input?.getAttribute('style')).toContain('--pr: 2.875rem;');
  });

  it('hides toggle button when canVisible is false and keeps the password masked', async () => {
    const element = mountFormPassword({
      canVisible: false,
      dataTestId: 'form-password',
      value: 'TajneHaslo123!',
    });

    await flushState();

    const input = element.querySelector<HTMLInputElement>('[data-testid="form-password-element"]');

    expect(element.querySelector('[data-testid="form-password-toggle-button"]')).toBeFalsy();
    expect(element.querySelector('[data-testid="form-password-copy-button"]')).toBeTruthy();
    expect(input?.getAttribute('type')).toBe('password');
    expect(input?.getAttribute('style')).toContain('--pr: 2.875rem;');
  });

  it('copies current password value and announces success', async () => {
    copyToClipboardMock.mockResolvedValue(undefined);

    const element = mountFormPassword({
      dataTestId: 'form-password',
      value: 'TajneHaslo123!',
    });

    await flushState();
    element.querySelector<HTMLButtonElement>('[data-testid="form-password-copy-button"]')?.click();
    await flushState();

    expect(copyToClipboardMock).toHaveBeenCalledWith('TajneHaslo123!');
    expect(
      element.querySelector<HTMLElement>('[data-testid="form-password-copy-status"]')?.textContent,
    ).toBe('Haslo skopiowano do schowka.');
  });

  it('announces copy error when clipboard write fails', async () => {
    copyToClipboardMock.mockRejectedValue(new Error('Clipboard unavailable'));

    const element = mountFormPassword({
      dataTestId: 'form-password',
      value: 'TajneHaslo123!',
    });

    await flushState();
    element.querySelector<HTMLButtonElement>('[data-testid="form-password-copy-button"]')?.click();
    await flushState();

    expect(
      element.querySelector<HTMLElement>('[data-testid="form-password-copy-status"]')?.textContent,
    ).toBe('Nie udalo sie skopiowac hasla.');
  });

  it('disables action buttons when field is disabled', async () => {
    const element = mountFormPassword({
      disabled: true,
      dataTestId: 'form-password',
      value: 'TajneHaslo123!',
    });

    await flushState();

    const input = element.querySelector<HTMLInputElement>('[data-testid="form-password-element"]');
    const toggleButton = element.querySelector<HTMLButtonElement>(
      '[data-testid="form-password-toggle-button"]',
    );
    const copyButton = element.querySelector<HTMLButtonElement>(
      '[data-testid="form-password-copy-button"]',
    );

    expect(toggleButton?.disabled).toBe(true);
    expect(copyButton?.disabled).toBe(true);

    toggleButton?.click();
    await flushState();

    expect(input?.getAttribute('type')).toBe('password');
  });

  it('does not render the actions container when canCopy and canVisible are false', async () => {
    const element = mountFormPassword({
      canCopy: false,
      canVisible: false,
      dataTestId: 'form-password',
      value: 'TajneHaslo123!',
    });

    await flushState();

    const input = element.querySelector<HTMLInputElement>('[data-testid="form-password-element"]');

    expect(element.querySelector('.peaui-form-field-password__actions')).toBeFalsy();
    expect(element.querySelector('[data-testid="form-password-toggle-button"]')).toBeFalsy();
    expect(element.querySelector('[data-testid="form-password-copy-button"]')).toBeFalsy();
    expect(input?.getAttribute('style')).not.toContain('2.875rem');
    expect(input?.getAttribute('style')).not.toContain('5.75rem');
  });

  it('forwards hint, description, error and success slots', async () => {
    const element = mountFormPassword({
      value: 'TajneHaslo123!',
      hint: 'Hint content',
      description: 'Description content',
      error: 'Error content',
      success: 'Success content',
    });

    await flushState();

    expect(element.textContent).toContain('Hint content');
    expect(element.textContent).toContain('Description content');
    expect(element.textContent).toContain('Error content');
    expect(element.textContent).toContain('Success content');
  });
});
