import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import InfoTooltip from '../overlayer/InfoTooltip/index.vue';

const cleanups: (() => void)[] = [];
afterEach(() => cleanups.splice(0).forEach((cleanup) => cleanup()));
describe('interaction contracts: Vue', () => {
  it('dismisses a focused tooltip with Escape without removing focus', async () => {
    const wrapper = mount(InfoTooltip, {
      attachTo: document.body,
      slots: { default: 'Details', description: 'Help' },
    });
    cleanups.push(() => wrapper.unmount());
    const trigger = wrapper.get('.peaui-info-tooltip');
    (trigger.element as HTMLElement).focus();
    await trigger.trigger('focusin');
    expect(trigger.attributes('data-open')).toBe('true');
    await trigger.trigger('keydown', { key: 'Escape' });
    expect(trigger.attributes('data-open')).not.toBe('true');
    expect(document.activeElement).toBe(trigger.element);
  });
});
