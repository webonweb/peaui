import { afterEach, describe, expect, it } from 'vitest';

import { DescriptionFieldElement, defineDescriptionField } from './index.wc';

defineDescriptionField();

type MountOptions = {
  after?: Node | string;
  before?: Node | string;
  dataTestId?: string;
  hint?: Node | string;
  label?: string;
  value?: Node | string;
};

function appendSlotNode(
  element: DescriptionFieldElement,
  slotName: string,
  value: Node | string,
): void {
  if (typeof value === 'string') {
    const slotElement = document.createElement('span');

    slotElement.setAttribute('slot', slotName);
    slotElement.textContent = value;
    element.appendChild(slotElement);
    return;
  }

  if (value instanceof Element) {
    value.setAttribute('slot', slotName);
  }

  element.appendChild(value);
}

function mountDescriptionField(options: MountOptions = {}): DescriptionFieldElement {
  const element = document.createElement(
    DescriptionFieldElement.tagName,
  ) as DescriptionFieldElement;

  if (options.label !== undefined) {
    element.label = options.label;
  }

  if (options.dataTestId !== undefined) {
    element.dataTestId = options.dataTestId;
  }

  if (options.before !== undefined) {
    appendSlotNode(element, 'additional-before', options.before);
  }

  if (options.value !== undefined) {
    if (typeof options.value === 'string') {
      element.append(options.value);
    } else {
      element.appendChild(options.value);
    }
  }

  if (options.after !== undefined) {
    appendSlotNode(element, 'additional-after', options.after);
  }

  if (options.hint !== undefined) {
    appendSlotNode(element, 'hint', options.hint);
  }

  document.body.appendChild(element);

  return element;
}

async function syncDescriptionFieldState() {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('DescriptionField (index.wc.ts)', () => {
  it('renders <dl> with UIKIT-based class and displays the label', async () => {
    const element = mountDescriptionField({
      label: 'My label',
      value: 'My value',
    });

    await syncDescriptionFieldState();

    const dl = element.querySelector('dl');
    const dt = element.querySelector('dt');
    const value = element.querySelector('dd.peaui-description-field__value');

    expect(dl?.classList.contains('peaui-description-field')).toBe(true);
    expect(dt?.textContent).toBe('My label');
    expect(value?.textContent).toBe('My value');
  });

  it('connects value dd with dt using aria-labelledby and dt id', async () => {
    const element = mountDescriptionField({
      label: 'Label',
      value: 'Value',
    });

    await syncDescriptionFieldState();

    const dt = element.querySelector('dt');
    const valueDd = element.querySelector('dd.peaui-description-field__value');

    expect(dt?.id).toBeTruthy();
    expect(valueDd?.getAttribute('aria-labelledby')).toBe(dt?.id);
  });

  it('renders additional-before and additional-after slots', async () => {
    const before = document.createElement('span');
    const value = document.createElement('span');
    const after = document.createElement('span');

    before.setAttribute('data-testid', 'before-slot');
    before.textContent = 'B';
    value.setAttribute('data-testid', 'value-slot');
    value.textContent = 'V';
    after.setAttribute('data-testid', 'after-slot');
    after.textContent = 'A';

    const element = mountDescriptionField({
      label: 'Label',
      before,
      value,
      after,
    });

    await syncDescriptionFieldState();

    expect(element.querySelector('[data-testid="before-slot"]')?.textContent).toBe('B');
    expect(element.querySelector('[data-testid="value-slot"]')?.textContent).toBe('V');
    expect(element.querySelector('[data-testid="after-slot"]')?.textContent).toBe('A');
  });

  it('sets data-testid attributes when dataTestId prop is provided', async () => {
    const element = mountDescriptionField({
      label: 'Label',
      value: 'Value',
      dataTestId: 'desc',
    });

    await syncDescriptionFieldState();

    expect(element.querySelector('dl[data-testid="desc"]')).not.toBeNull();
    expect(element.querySelector('dt[data-testid="desc-label"]')).not.toBeNull();
    expect(element.querySelector('dd[data-testid="desc-value"]')).not.toBeNull();
    expect(element.querySelector('dd[data-testid="desc-addon-before"]')).toBeNull();
    expect(element.querySelector('dd[data-testid="desc-addon-after"]')).toBeNull();
  });

  it('does not render data-testid attributes when dataTestId prop is not provided', async () => {
    const element = mountDescriptionField({
      label: 'Label',
      value: 'Value',
    });

    await syncDescriptionFieldState();

    const dl = element.querySelector('dl');
    const dt = element.querySelector('dt');
    const valueDd = element.querySelector('dd.peaui-description-field__value');

    expect(dl?.getAttribute('data-testid')).toBeNull();
    expect(dt?.getAttribute('data-testid')).toBeNull();
    expect(valueDd?.getAttribute('data-testid')).toBeNull();
  });

  it('keeps the definition list order starting with dt and skips empty addon containers', async () => {
    const element = mountDescriptionField({
      label: 'Label',
      value: 'Value',
    });

    await syncDescriptionFieldState();

    expect(element.querySelector('dl')?.firstElementChild?.tagName.toLowerCase()).toBe('dt');
    expect(element.querySelector('dd.peaui-description-field__addon--before')).toBeNull();
    expect(element.querySelector('dd.peaui-description-field__addon--after')).toBeNull();
  });

  it('renders hint tooltip only when hint slot is provided', async () => {
    const element = mountDescriptionField({
      label: 'Label',
      value: 'Value',
      dataTestId: 'desc',
      hint: 'Hint content',
    });

    await syncDescriptionFieldState();

    expect(element.querySelector('[data-testid="desc-tooltip-tooltip"]')).not.toBeNull();
    expect(element.querySelector('[data-testid="desc-tooltip-description"]')?.textContent).toBe(
      'Hint content',
    );
  });
});
