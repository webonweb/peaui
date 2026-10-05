import { describe, expect, it } from 'vitest';

import {
  calculateGuidedTourPosition,
  expandGuidedTourRect,
  resolveGuidedTourTarget,
} from './guided-tour.shared';

describe('GuidedTour shared behavior', () => {
  it('supports edge-aligned overlays without moving them outside the viewport', () => {
    const position = calculateGuidedTourPosition(
      { top: 80, right: 94, bottom: 104, left: 16, width: 78, height: 24 },
      { width: 240, height: 150 },
      'bottom',
      900,
      600,
      8,
      16,
      'end',
    );
    expect(position).toEqual({ left: 16, top: 112, placement: 'bottom' });
  });
  it('expands and clamps the spotlight rectangle to the viewport', () => {
    expect(
      expandGuidedTourRect(
        { top: 4, right: 104, bottom: 54, left: 4, width: 100, height: 50 },
        12,
        320,
        200,
      ),
    ).toEqual({ top: 0, right: 116, bottom: 66, left: 0, width: 116, height: 66 });
  });

  it('flips a card when the preferred placement does not fit', () => {
    const position = calculateGuidedTourPosition(
      { top: 8, right: 180, bottom: 48, left: 80, width: 100, height: 40 },
      { width: 160, height: 100 },
      'top',
      400,
      300,
    );
    expect(position.placement).toBe('bottom');
    expect(position.top).toBe(60);
  });

  it('resolves selector and function targets without modifying the source', async () => {
    const element = document.createElement('button');
    element.id = 'tour-target';
    document.body.appendChild(element);
    await expect(resolveGuidedTourTarget('#tour-target', { timeout: 0 })).resolves.toBe(element);
    await expect(resolveGuidedTourTarget(() => element, { timeout: 0 })).resolves.toBe(element);
    element.remove();
  });
});
