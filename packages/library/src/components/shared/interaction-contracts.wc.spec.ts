import { afterEach, expect, it } from 'vitest';
import { defineInfoTooltip, InfoTooltipElement } from '../overlayer/InfoTooltip/index.wc';
defineInfoTooltip();
afterEach(() => document.body.replaceChildren());
it('dismisses a hovered tooltip with Escape even when focus is outside it', () => {
  const tooltip = document.createElement(InfoTooltipElement.tagName);
  tooltip.innerHTML = '<span>Details</span><span slot="description">Help</span>';
  document.body.append(tooltip);
  tooltip.dispatchEvent(new MouseEvent('mouseenter'));
  expect(tooltip.getAttribute('data-open')).toBe('true');
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  expect(tooltip.getAttribute('data-open')).not.toBe('true');
});
