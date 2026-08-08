import { describe, expect, it } from 'vitest';

import {
  filterTransferListItems,
  findTransferListEdgeIndex,
  findTransferListEnabledIndex,
  getTransferListPanelItems,
  getTransferListRangeKeys,
  moveTransferListItems,
  normalizeTransferListItems,
  normalizeTransferListKeys,
  normalizeTransferListLoading,
  normalizeTransferListSelection,
} from './transfer-list.shared';

const items = normalizeTransferListItems([
  { key: 'b', label: 'Billing' },
  { key: 'a', label: 'Analytics' },
  { key: 'c', label: 'Ćwiczenia', disabled: true },
  { key: 'a', label: 'Duplikat' },
  { label: 'Bez klucza' },
]);

describe('TransferList shared model', () => {
  it('normalizuje stabilne klucze i odrzuca duplikaty oraz niekompletne elementy', () => {
    expect(items.map((item) => item.key)).toEqual(['b', 'a', 'c']);
    expect(normalizeTransferListKeys(['a', 'a', 2, Number.NaN, null])).toEqual(['a', 2]);
  });

  it('dzieli panele bez utraty kolejności value i sortuje stabilnie', () => {
    expect(getTransferListPanelItems(items, ['a', 'b'], 'target').map((item) => item.key)).toEqual([
      'a',
      'b',
    ]);
    expect(
      getTransferListPanelItems(items, [], 'source', { sort: 'asc' }).map((item) => item.key),
    ).toEqual(['a', 'b', 'c']);
  });

  it('filtruje bez rozróżniania wielkości liter i znaków diakrytycznych', () => {
    expect(filterTransferListItems(items, 'cwic').map((item) => item.key)).toEqual(['c']);
    expect(filterTransferListItems(items, 'ANAL').map((item) => item.key)).toEqual(['a']);
  });

  it('egzekwuje disabled w zaznaczeniu, zakresie i nawigacji', () => {
    expect(normalizeTransferListSelection(['a', 'c'], items)).toEqual(['a']);
    expect(getTransferListRangeKeys(items, 0, 2)).toEqual(['b', 'a']);
    expect(findTransferListEdgeIndex(items, 'last')).toBe(1);
    expect(findTransferListEnabledIndex(items, 0, 1)).toBe(1);
  });

  it('przenosi atomowo tylko dozwolone klucze i zachowuje klucze spoza items', () => {
    expect(
      moveTransferListItems({
        direction: 'to-target',
        items,
        keys: ['b', 'c'],
        value: ['unknown', 'a'],
      }),
    ).toEqual({ movedKeys: ['b'], value: ['unknown', 'a', 'b'] });
    expect(
      moveTransferListItems({
        direction: 'to-source',
        items,
        keys: ['a', 'c'],
        value: ['unknown', 'a', 'c'],
      }),
    ).toEqual({ movedKeys: ['a'], value: ['unknown', 'c'] });
  });

  it('opcjonalnie odtwarza kolejność items i normalizuje loading per panel', () => {
    expect(
      moveTransferListItems({
        direction: 'to-target',
        items,
        keys: ['b'],
        preserveOrder: false,
        value: ['a', 'unknown'],
      }).value,
    ).toEqual(['b', 'a', 'unknown']);
    expect(normalizeTransferListLoading(true)).toEqual({ source: true, target: true });
    expect(normalizeTransferListLoading({ target: true })).toEqual({
      source: false,
      target: true,
    });
  });
});
