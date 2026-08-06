import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import LinkColumn from './LinkColumn.vue';

function factory(
  value: string | undefined | Record<string, string> = 'Szczegoly rekordu',
  deep?: string,
) {
  return mount(LinkColumn, {
    props: {
      column: {
        key: 'resourceLink',
        label: 'Powiazanie',
        type: 'link',
      },
      deep,
      value,
    },
  });
}

describe('LinkColumn.vue', () => {
  it('renders button semantics for js-only action and emits click on activation', async () => {
    const wrapper = factory();
    const button = wrapper.get('button');

    expect(button.classes()).toContain('peaui-table-list__link-column');
    expect(button.attributes('aria-label')).toBe('Otworz powiazanie Szczegoly rekordu');
    expect(wrapper.find('a').exists()).toBe(false);

    await button.trigger('click');

    expect(wrapper.emitted('on:click')).toEqual([[]]);
  });

  it('uses string value as href when it already looks like a path or url and keeps native link activation', () => {
    const wrapper = factory('/rekord/1');
    const link = wrapper.get('a');
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });

    expect(link.attributes('href')).toBe('/rekord/1');
    expect(wrapper.find('button').exists()).toBe(false);
    expect(link.element.dispatchEvent(clickEvent)).toBe(true);
    expect(wrapper.emitted('on:click')).toEqual([[]]);
  });

  it('resolves nested display value when deep key is provided', () => {
    const wrapper = factory({ label: 'Podglad sprawy' }, 'label');

    expect(wrapper.text()).toContain('Podglad sprawy');
    expect(wrapper.get('button').attributes('aria-label')).toBe('Otworz powiazanie Podglad sprawy');
  });
});
