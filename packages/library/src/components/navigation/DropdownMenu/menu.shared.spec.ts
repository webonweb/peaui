import { describe, expect, it } from 'vitest';

import {
  calculateRootMenuPosition,
  calculateSubmenuPosition,
  type MenuAlign,
  type MenuPlacement,
  type MenuRect,
} from './menu.shared';

const trigger: MenuRect = {
  bottom: 340,
  height: 40,
  left: 500,
  right: 620,
  top: 300,
  width: 120,
};
const surface: MenuRect = {
  bottom: 260,
  height: 220,
  left: 0,
  right: 240,
  top: 40,
  width: 240,
};
const viewport = { height: 800, width: 1200 };

describe('DropdownMenu shared positioning', () => {
  it.each<[MenuPlacement, number, number]>([
    ['top', 440, 72],
    ['right', 628, 210],
    ['bottom', 440, 348],
    ['left', 252, 210],
  ])('keeps explicit %s placement and centers the cross axis', (placement, left, top) => {
    expect(
      calculateRootMenuPosition({
        align: 'center',
        offset: 8,
        placement,
        surface,
        trigger,
        viewport,
      }),
    ).toMatchObject({ left, placement, top });
  });

  it.each<[MenuPlacement, MenuAlign, number, number]>([
    ['right', 'start', 628, 300],
    ['right', 'end', 628, 120],
    ['left', 'start', 252, 300],
    ['left', 'end', 252, 120],
  ])(
    'aligns %s/%s against the vertical trigger edge instead of the bottom placement axis',
    (placement, align, left, top) => {
      expect(
        calculateRootMenuPosition({
          align,
          offset: 8,
          placement,
          surface,
          trigger,
          viewport,
        }),
      ).toMatchObject({ left, placement, top });
    },
  );

  it('constrains the requested side rather than silently flipping it', () => {
    const result = calculateRootMenuPosition({
      align: 'start',
      offset: 8,
      placement: 'left',
      surface,
      trigger: { ...trigger, left: 130, right: 250 },
      viewport,
    });

    expect(result).toMatchObject({ left: 8, maxWidth: 114, minWidth: 114, placement: 'left' });
  });

  it.each<[MenuPlacement, Partial<MenuRect>, Record<string, number>]>([
    ['left', { left: 30, right: 150 }, { left: 8, maxWidth: 14, minWidth: 14 }],
    ['right', { left: 1050, right: 1170 }, { left: 1178, maxWidth: 14, minWidth: 14 }],
    ['top', { bottom: 70, top: 30 }, { maxHeight: 14, top: 8 }],
    ['bottom', { bottom: 770, top: 730 }, { maxHeight: 14, top: 778 }],
  ])('keeps a constrained %s surface inside its requested edge', (placement, edge, expected) => {
    expect(
      calculateRootMenuPosition({
        align: 'center',
        offset: 8,
        placement,
        surface,
        trigger: { ...trigger, ...edge },
        viewport,
      }),
    ).toMatchObject({ ...expected, placement });
  });

  it('uses visual viewport offsets while shifting the cross axis', () => {
    const result = calculateRootMenuPosition({
      align: 'end',
      offset: 8,
      placement: 'bottom',
      surface,
      trigger: { ...trigger, left: 220, right: 340 },
      viewport: { height: 500, left: 200, top: 100, width: 500 },
    });

    expect(result).toMatchObject({ left: 208, placement: 'bottom', top: 348 });
  });

  it('places a submenu on the roomier side and constrains it to the viewport', () => {
    const result = calculateSubmenuPosition({
      parent: { ...trigger, left: 1020, right: 1140 },
      surface,
      viewport,
    });

    expect(result).toMatchObject({ left: 776, placement: 'left', top: 294 });
  });
});
