import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import TagChip from '../data-display/TagChip/index.vue';
import CounterBadge from '../data-display/CounterBadge/index.vue';
import SectionHeading from '../data-display/SectionHeading/index.vue';
import FormFieldLabel from '../form/FormFieldLabel/index.vue';
const cleanups: (() => void)[] = [];
afterEach(() => cleanups.splice(0).forEach((fn) => fn()));
describe('regressions: Vue composition parity', () => {
  it('keeps the shared defaults and live region', () => {
    const chip = mount(TagChip, {
      props: { label: 'Chip', active: true },
      attrs: { onClick: () => undefined },
    });
    cleanups.push(() => chip.unmount());
    expect(chip.element.tagName).toBe('BUTTON');
    expect(chip.classes()).toContain('peaui-tag-chip--size-xs');
    expect(chip.attributes('aria-pressed')).toBe('true');
    const badge = mount(CounterBadge, { props: { value: 2 } });
    cleanups.push(() => badge.unmount());
    expect(badge.attributes('role')).toBe('status');
    expect(badge.classes()).toContain('peaui-counter-badge--size-s');
    const heading = mount(SectionHeading, { slots: { title: 'Title' } });
    cleanups.push(() => heading.unmount());
    expect(heading.find('h3').exists()).toBe(true);
  });
  it('prefers the default label slot over fallback text', () => {
    const label = mount(FormFieldLabel, {
      props: { for: 'field', text: 'Fallback' },
      slots: { default: '<strong>Rich label</strong>' },
    });
    cleanups.push(() => label.unmount());
    expect(label.get('label strong').text()).toBe('Rich label');
    expect(label.text()).not.toContain('Fallback');
  });
});
