import { afterEach, describe, expect, it, vi } from 'vitest';

import { ButtonActionElement, defineButtonAction } from './index.wc';

defineButtonAction();

const NESTED_BUTTON_ACTION_TEXT_MUTATION_TAG_NAME = 'test-button-action-text-mutation';

class NestedButtonActionTextMutationElement extends HTMLElement {
  internalTextNode = document.createTextNode('');

  connectedCallback(): void {
    if (this.internalTextNode.parentNode !== this) {
      this.appendChild(this.internalTextNode);
    }
  }

  setInternalText(value: string): void {
    this.internalTextNode.textContent = value;
  }
}

if (!window.customElements.get(NESTED_BUTTON_ACTION_TEXT_MUTATION_TAG_NAME)) {
  window.customElements.define(
    NESTED_BUTTON_ACTION_TEXT_MUTATION_TAG_NAME,
    NestedButtonActionTextMutationElement,
  );
}

type MountOptions = {
  ariaLabel?: string;
  attrs?: Record<string, string>;
  content?: Node | string;
  dataTestId?: string;
  disabled?: boolean;
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l';
  type?: 'button' | 'submit' | 'reset';
  useAriaLabel?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
};

function mountButtonAction(options: MountOptions = {}): ButtonActionElement {
  const element = document.createElement(ButtonActionElement.tagName) as ButtonActionElement;

  if (options.size !== undefined) {
    element.size = options.size;
  }

  if (options.variant !== undefined) {
    element.variant = options.variant;
  }

  if (options.type !== undefined) {
    element.type = options.type;
  }

  if (options.disabled !== undefined) {
    element.disabled = options.disabled;
  }

  if (options.ariaLabel !== undefined) {
    element.ariaLabel = options.ariaLabel;
  }

  if (options.dataTestId !== undefined) {
    element.dataTestId = options.dataTestId;
  }

  if (options.useAriaLabel !== undefined) {
    element.useAriaLabel = options.useAriaLabel;
  }

  if (options.attrs) {
    for (const [name, value] of Object.entries(options.attrs)) {
      element.setAttribute(name, value);
    }
  }

  const content = options.content ?? 'Button';

  if (typeof content === 'string') {
    element.append(content);
  } else {
    element.appendChild(content);
  }

  document.body.appendChild(element);

  return element;
}

function getButton(element: ButtonActionElement): HTMLButtonElement {
  const button = element.querySelector('button');

  if (!(button instanceof HTMLButtonElement)) {
    throw new Error('ButtonAction button was not rendered.');
  }

  return button;
}

async function syncButtonActionState() {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ButtonAction (index.wc.ts)', () => {
  it('renders default slot content', async () => {
    const element = mountButtonAction({
      ariaLabel: 'Przycisk akcji',
      content: 'Zapisz',
    });

    await syncButtonActionState();

    expect(getButton(element).textContent).toContain('Zapisz');
  });

  it('applies default props (size=m, variant=primary, type=button, disabled=false)', async () => {
    const element = mountButtonAction({
      ariaLabel: 'Default button',
      content: 'Button',
    });

    await syncButtonActionState();

    const button = getButton(element);

    expect(button.getAttribute('type')).toBe('button');
    expect(button.getAttribute('aria-label')).toBeNull();
    expect(button.hasAttribute('disabled')).toBe(false);
    expect(button.classList.contains('peaui-button-action')).toBe(true);
    expect(button.classList.contains('peaui-button-action--size-m')).toBe(true);
    expect(button.classList.contains('peaui-button-action--variant-primary')).toBe(true);
    expect(button.classList.contains('peaui-button-action--is-disabled')).toBe(false);
  });

  it('sets size and variant classes from props', async () => {
    const element = mountButtonAction({
      ariaLabel: 'Rozmiar i wariant',
      size: 'l',
      variant: 'danger',
      content: 'Usun',
    });

    await syncButtonActionState();

    const button = getButton(element);

    expect(button.classList.contains('peaui-button-action--size-l')).toBe(true);
    expect(button.classList.contains('peaui-button-action--variant-danger')).toBe(true);
  });

  it('sets type attribute from props', async () => {
    const element = mountButtonAction({
      ariaLabel: 'Submit',
      type: 'submit',
      content: 'Wyslij',
    });

    await syncButtonActionState();

    expect(getButton(element).getAttribute('type')).toBe('submit');
  });

  it('when disabled=true, sets disabled attribute and disabled class', async () => {
    const element = mountButtonAction({
      ariaLabel: 'Disabled',
      disabled: true,
      content: 'Nieaktywny',
    });

    await syncButtonActionState();

    const button = getButton(element);

    expect(button.hasAttribute('disabled')).toBe(true);
    expect(button.classList.contains('peaui-button-action--is-disabled')).toBe(true);
  });

  it('sets data-testid from dataTestId prop', async () => {
    const element = mountButtonAction({
      ariaLabel: 'Test id',
      dataTestId: 'button-action-save',
      content: 'Zapisz',
    });

    await syncButtonActionState();

    expect(getButton(element).getAttribute('data-testid')).toBe('button-action-save');
  });

  it('spreads arbitrary attrs to the button', async () => {
    const element = mountButtonAction({
      ariaLabel: 'Attrs',
      attrs: {
        name: 'saveButton',
        title: 'Kliknij aby zapisac',
        'data-qa': 'save',
      },
      content: 'Zapisz',
    });

    await syncButtonActionState();

    const button = getButton(element);

    expect(button.getAttribute('name')).toBe('saveButton');
    expect(button.getAttribute('title')).toBe('Kliknij aby zapisac');
    expect(button.getAttribute('data-qa')).toBe('save');
  });

  it('does not forward inline click handlers to the inner button', async () => {
    const element = mountButtonAction({
      attrs: {
        onclick: 'window.__buttonActionClicks = (window.__buttonActionClicks ?? 0) + 1',
      },
      content: 'Zapisz',
    });

    await syncButtonActionState();

    const button = getButton(element);

    expect(element.getAttribute('onclick')).toBeTruthy();
    expect(button.getAttribute('onclick')).toBeNull();
  });

  it('does not set aria-label from ariaLabel prop when button has visible text', async () => {
    const element = mountButtonAction({
      ariaLabel: 'Etykieta a11y',
      content: 'OK',
    });

    await syncButtonActionState();

    expect(getButton(element).getAttribute('aria-label')).toBeNull();
  });

  it('sets aria-label automatically when button has no visible text content', async () => {
    const iconOnly = document.createElement('span');

    iconOnly.setAttribute('aria-hidden', 'true');
    iconOnly.className = 'icon-only';

    const element = mountButtonAction({
      ariaLabel: 'Etykieta a11y',
      content: iconOnly,
    });

    await syncButtonActionState();

    expect(getButton(element).getAttribute('aria-label')).toBe('Etykieta a11y');
  });

  it('falls back to a generic accessible name when icon-only button has no explicit label', async () => {
    const iconOnly = document.createElement('span');

    iconOnly.setAttribute('aria-hidden', 'true');
    iconOnly.className = 'icon-only';

    const element = mountButtonAction({
      content: iconOnly,
    });

    await syncButtonActionState();

    expect(getButton(element).getAttribute('aria-label')).toBe('Przycisk akcji');
  });

  it('uses aria-label from attrs when icon-only button has no ariaLabel prop', async () => {
    const iconOnly = document.createElement('span');

    iconOnly.setAttribute('aria-hidden', 'true');
    iconOnly.className = 'icon-only';

    const element = mountButtonAction({
      attrs: {
        'aria-label': 'Filtruj wyniki',
      },
      content: iconOnly,
    });

    await syncButtonActionState();

    expect(getButton(element).getAttribute('aria-label')).toBe('Filtruj wyniki');
  });

  it('uses title as the fallback accessible name for icon-only buttons', async () => {
    const iconOnly = document.createElement('span');

    iconOnly.setAttribute('aria-hidden', 'true');

    const element = mountButtonAction({
      attrs: {
        title: 'Zamknij okno',
      },
      content: iconOnly,
    });

    await syncButtonActionState();

    expect(getButton(element).getAttribute('aria-label')).toBe('Zamknij okno');
  });

  it('preserves aria-labelledby from attrs without adding fallback aria-label', async () => {
    const iconOnly = document.createElement('span');

    iconOnly.setAttribute('aria-hidden', 'true');
    iconOnly.className = 'icon-only';

    const element = mountButtonAction({
      attrs: {
        'aria-labelledby': 'button-action-label',
      },
      content: iconOnly,
    });

    await syncButtonActionState();

    const button = getButton(element);

    expect(button.getAttribute('aria-labelledby')).toBe('button-action-label');
    expect(button.getAttribute('aria-label')).toBeNull();
  });

  it('sets aria-label when useAriaLabel is enabled', async () => {
    const element = mountButtonAction({
      ariaLabel: 'Etykieta a11y',
      useAriaLabel: true,
      content: 'OK',
    });

    await syncButtonActionState();

    expect(getButton(element).getAttribute('aria-label')).toBe('Etykieta a11y');
  });

  it('forwards external class and style to the inner button', async () => {
    const element = mountButtonAction({
      attrs: {
        class: 'external-class',
        style: 'padding: 10px;',
      },
      content: 'OK',
    });

    await syncButtonActionState();

    const button = getButton(element);

    expect(button.getAttribute('class')).toMatch(/external-class/);
    expect(button.getAttribute('class')).toMatch(/peaui-button-action/);
    expect(button.getAttribute('style') ?? '').toContain('padding: 10px');
  });

  it('does not re-render when a nested custom element updates its own text content', async () => {
    const renderSpy = vi.spyOn(ButtonActionElement.prototype, 'render');
    const nestedElement = document.createElement(
      NESTED_BUTTON_ACTION_TEXT_MUTATION_TAG_NAME,
    ) as NestedButtonActionTextMutationElement;

    mountButtonAction({
      content: nestedElement,
    });

    await syncButtonActionState();
    renderSpy.mockClear();

    nestedElement.setInternalText('Updated nested label');
    await syncButtonActionState();

    expect(renderSpy).not.toHaveBeenCalled();
  });
});
