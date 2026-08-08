import { describe, expect, it } from 'vitest';

import {
  calculateVirtualListRange,
  getVirtualListScrollOffset,
  normalizeVirtualListItems,
} from './virtual-list.shared';

describe('VirtualList shared range calculator', () => {
  it('calculates visible and overscan ranges without exceeding collection bounds', () => {
    expect(
      calculateVirtualListRange({
        itemCount: 10_000,
        itemSize: 64,
        overscan: 4,
        scrollOffset: 0,
        viewportSize: 320,
      }),
    ).toEqual({
      startIndex: 0,
      endIndex: 8,
      visibleStartIndex: 0,
      visibleEndIndex: 4,
      total: 10_000,
    });

    expect(
      calculateVirtualListRange({
        itemCount: 10_000,
        itemSize: 64,
        overscan: 4,
        scrollOffset: 320_016,
        viewportSize: 320,
      }),
    ).toMatchObject({
      startIndex: 4_996,
      endIndex: 5_009,
      visibleStartIndex: 5_000,
      visibleEndIndex: 5_005,
    });
  });

  it('aligns the beginning, center and end while clamping to scroll boundaries', () => {
    const common = {
      currentOffset: 0,
      index: 50,
      itemCount: 100,
      itemSize: 40,
      viewportSize: 200,
    };

    expect(getVirtualListScrollOffset({ ...common, align: 'start' })).toBe(2_000);
    expect(getVirtualListScrollOffset({ ...common, align: 'center' })).toBe(1_920);
    expect(getVirtualListScrollOffset({ ...common, align: 'end' })).toBe(1_840);
    expect(getVirtualListScrollOffset({ ...common, align: 'start', index: 999 })).toBe(3_800);
  });

  it('produces deterministic unique keys and readable labels', () => {
    const items = normalizeVirtualListItems([
      { id: 'same', label: 'Pierwszy' },
      { id: 'same', label: 'Drugi' },
      'Trzeci',
    ]);

    expect(items.map((item) => item.key)).toEqual(['same', 'same-1', 'Trzeci']);
    expect(items.map((item) => item.label)).toEqual(['Pierwszy', 'Drugi', 'Trzeci']);
  });
});
