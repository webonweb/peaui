import '@testing-library/jest-dom/vitest';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { defineFormRatingInput, FormRatingInputElement } from './index.wc';
import type { RatingLabels, RatingValue } from './rating-input.shared';

type TestElement = InstanceType<typeof FormRatingInputElement> & {
  allowClear: boolean;
  disabled: boolean;
  id: string;
  label: string;
  labels: RatingLabels;
  max: number;
  name: string;
  readonly: boolean;
  step: 0.5 | 1;
  value: RatingValue;
};

const flush = async (): Promise<void> => {
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
};

function createRating(properties: Partial<TestElement> = {}): TestElement {
  const element = document.createElement(FormRatingInputElement.tagName) as TestElement;
  Object.assign(
    element,
    { id: 'quality-rating-wc', label: 'Ocena jakości', name: 'quality' },
    properties,
  );
  document.body.append(element);
  return element;
}

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe('FormRatingInput Web Component', () => {
  it('rejestruje element i zachowuje light-DOM ARIA', async () => {
    expect(defineFormRatingInput()).toBe(FormRatingInputElement);
    expect(customElements.get(FormRatingInputElement.tagName)).toBe(FormRatingInputElement);
    const element = createRating({ labels: { '3.5': 'Bardzo dobra' }, step: 0.5, value: 3.5 });
    await flush();
    const input = element.querySelector('input[type="range"]') as HTMLInputElement;
    expect(input).toHaveAccessibleName('Ocena jakości');
    expect(input).toHaveAttribute('aria-valuetext', '3,5 z 5 — Bardzo dobra');
    expect(element.querySelectorAll('.peaui-form-rating-input__item')).toHaveLength(5);
    expect(element.querySelector('.peaui-form-rating-input__value-label')).toHaveAttribute(
      'title',
      '3,5 z 5 — Bardzo dobra',
    );
  });

  it('synchronizuje property value po klawiaturze', async () => {
    const element = createRating({ step: 0.5, value: 2.5 });
    const onValue = vi.fn();
    element.addEventListener('update:value', onValue);
    await flush();
    const input = element.querySelector('input[type="range"]') as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }));
    await flush();
    expect(element.value).toBe(3);
    expect((onValue.mock.calls.at(-1)?.[0] as CustomEvent).detail).toBe(3);
  });

  it('oddziela preview i zatwierdza kliknięcie połówki', async () => {
    const element = createRating({ step: 0.5, value: 2 });
    const onPreview = vi.fn();
    element.addEventListener('previewChange', onPreview);
    await flush();
    const item = element.querySelectorAll('.peaui-form-rating-input__item')[2] as HTMLElement;
    vi.spyOn(item, 'getBoundingClientRect').mockReturnValue({
      bottom: 44,
      height: 44,
      left: 0,
      right: 44,
      top: 0,
      width: 44,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    item.dispatchEvent(
      new PointerEvent('pointermove', { bubbles: true, clientX: 10, pointerType: 'mouse' }),
    );
    expect((onPreview.mock.calls.at(-1)?.[0] as CustomEvent).detail).toBe(2.5);
    expect(element.value).toBe(2);
    item.dispatchEvent(
      new PointerEvent('pointerdown', { bubbles: true, clientX: 10, pointerType: 'mouse' }),
    );
    await flush();
    expect(element.value).toBe(2.5);
  });

  it('czyści wartość przez Delete tylko z allowClear', async () => {
    const element = createRating({ allowClear: true, value: 4 });
    const onClear = vi.fn();
    element.addEventListener('clear', onClear);
    await flush();
    const input = element.querySelector('input[type="range"]') as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Delete' }));
    await flush();
    expect(element.value).toBeNull();
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('readonly jest nietabowalnym odczytem, a disabled wyłącza suwak', async () => {
    const readonly = createRating({ readonly: true, value: 4 });
    await flush();
    expect(readonly.querySelector('input[type="range"]')).toBeNull();
    expect(readonly.querySelector('meter')).not.toHaveAttribute('tabindex');
    readonly.remove();

    const disabled = createRating({ disabled: true, value: 4 });
    await flush();
    expect(disabled.querySelector('input[type="range"]')).toBeDisabled();
  });
});
