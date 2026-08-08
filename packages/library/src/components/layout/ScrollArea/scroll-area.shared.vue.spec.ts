import { describe, expect, it } from 'vitest';

import {
  calculateScrollAreaThumb,
  getLogicalScrollLeft,
  getRawScrollLeft,
  getScrollAreaEdgeAxes,
  getScrollAreaPosition,
} from './scroll-area.shared';

describe('ScrollArea shared model', () => {
  it('calculates a bounded proportional thumb', () => {
    expect(calculateScrollAreaThumb(200, 1_000, 100, 400)).toEqual({
      offset: 38,
      size: 24,
      travel: 76,
    });
    expect(calculateScrollAreaThumb(200, 200, 100, 0)).toEqual({
      offset: 0,
      size: 100,
      travel: 0,
    });
  });

  it.each(['negative', 'reverse', 'default'] as const)(
    'round-trips logical RTL coordinates in %s mode',
    (mode) => {
      const raw = getRawScrollLeft(120, 300, 'rtl', mode);
      expect(getLogicalScrollLeft(raw, 300, 'rtl', mode)).toBe(120);
    },
  );

  it('detects overflow edges with a one-pixel tolerance', () => {
    const position = getScrollAreaPosition({
      clientHeight: 100,
      clientWidth: 100,
      scrollHeight: 300,
      scrollLeft: 0,
      scrollTop: 199.5,
      scrollWidth: 100,
    });

    expect(position).toMatchObject({ overflowX: false, overflowY: true, atEndY: true });
    expect(getScrollAreaEdgeAxes(position, 'end')).toEqual(['vertical']);
    expect(getScrollAreaEdgeAxes(position, 'start')).toEqual([]);
  });
});
