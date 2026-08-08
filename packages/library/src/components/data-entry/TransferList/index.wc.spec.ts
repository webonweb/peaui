import '@testing-library/jest-dom/vitest';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { defineTransferList, TransferListElement } from './index.wc';
import { transferListItems } from './transfer-list.demo';
import type { TransferListItem, TransferListKey } from './transfer-list.shared';

type TransferListTestElement = InstanceType<typeof TransferListElement> & {
  dataTestId: string;
  disabled: boolean;
  error: string;
  items: readonly TransferListItem[];
  loading: boolean | { source?: boolean; target?: boolean };
  sourceSelected: TransferListKey[];
  targetSelected: TransferListKey[];
  value: TransferListKey[];
};

const flush = async (): Promise<void> => {
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
};

function createTransfer(
  properties: Partial<TransferListTestElement> = {},
): TransferListTestElement {
  const element = document.createElement(TransferListElement.tagName) as TransferListTestElement;
  Object.assign(
    element,
    {
      dataTestId: 'transfer',
      items: transferListItems,
      sourceSelected: [],
      targetSelected: [],
      value: ['analytics', 'security'],
    },
    properties,
  );
  document.body.append(element);
  return element;
}

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe('TransferList Web Component', () => {
  it('rejestruje light-DOM element i dwa poprawnie nazwane listboxy', async () => {
    expect(defineTransferList()).toBe(TransferListElement);
    const element = createTransfer();
    await flush();
    const listboxes = [...element.querySelectorAll('[role="listbox"]')];

    expect(listboxes).toHaveLength(2);
    expect(listboxes[0]).toHaveAccessibleName('Dostępne');
    expect(listboxes[1]).toHaveAccessibleName('Przypisane');
    expect(
      [...element.querySelector('.peaui-transfer-list__layout')!.children].map(
        (child) => child.getAttribute('data-panel') ?? 'controls',
      ),
    ).toEqual(['source', 'controls', 'target']);
    expect(element.querySelector('[data-key="system"]')).toHaveAttribute('aria-disabled', 'true');
  });

  it('synchronizuje value i zaznaczenia po transferze bez podwójnych zdarzeń', async () => {
    const element = createTransfer();
    const onValue = vi.fn();
    const onMove = vi.fn();
    element.addEventListener('update:value', onValue);
    element.addEventListener('move', onMove);
    await flush();

    (element.querySelector('[data-key="billing"]') as HTMLElement).click();
    await flush();
    (
      element.querySelector('[data-testid="transfer-move-selected-target"]') as HTMLButtonElement
    ).click();
    await flush();

    expect(element.value).toEqual(['analytics', 'security', 'billing']);
    expect(element.sourceSelected).toEqual([]);
    expect(onValue).toHaveBeenCalledOnce();
    expect((onMove.mock.calls[0]?.[0] as CustomEvent).detail).toEqual(
      expect.objectContaining({ direction: 'to-target', movedKeys: ['billing'] }),
    );
  });

  it('ogranicza move all do niezależnie przefiltrowanego panelu', async () => {
    const element = createTransfer();
    await flush();
    const input = element.querySelector(
      '[data-testid="transfer-source-search-element"]',
    ) as HTMLInputElement;
    input.value = 'rozliczenia';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await flush();

    expect(
      element.querySelectorAll('.peaui-transfer-list__panel--source [role="option"]'),
    ).toHaveLength(1);
    (
      element.querySelector('[data-testid="transfer-move-all-target"]') as HTMLButtonElement
    ).click();
    await flush();
    expect(element.value).toEqual(['analytics', 'security', 'billing']);
  });

  it('zachowuje listbox keyboard pattern oraz disabled keys', async () => {
    const element = createTransfer({ value: [] });
    await flush();
    const source = element.querySelector('[data-testid="transfer-source-listbox"]') as HTMLElement;
    source.focus();
    source.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'End' }));
    await flush();
    expect(source.getAttribute('aria-activedescendant')).toContain('option-6');
    source.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, ctrlKey: true, key: 'a' }));
    await flush();
    expect(element.sourceSelected).toHaveLength(7);
    expect(element.sourceSelected).not.toContain('system');
  });

  it('wystawia loading per panel i semantycznie wiąże błąd', async () => {
    const element = createTransfer({ error: 'Błąd transferu', loading: { source: true } });
    await flush();
    const error = element.querySelector('[data-testid="transfer-error"]') as HTMLElement;

    expect(element.querySelector('[role="group"]')).toHaveAttribute('aria-invalid', 'true');
    expect(
      element.querySelector('[role="group"]')?.getAttribute('aria-describedby')?.split(' '),
    ).toContain(error.id);
    expect(element.querySelector('[data-testid="transfer-source-loading"]')).toBeInTheDocument();
    expect(
      element.querySelector('[data-testid="transfer-target-loading"]'),
    ).not.toBeInTheDocument();
  });

  it('obsługuje natywną treść nazwanych slotów', async () => {
    const element = document.createElement(TransferListElement.tagName) as TransferListTestElement;
    const header = document.createElement('span');
    header.slot = 'source-header';
    header.textContent = 'Własne źródło';
    element.append(header);
    Object.assign(element, { items: [], sourceSelected: [], targetSelected: [], value: [] });
    document.body.append(element);
    await flush();

    expect(element.querySelector('[role="listbox"]')).toHaveAccessibleName('Własne źródło');
  });
});
