import { mount } from '@vue/test-utils';
import { createSSRApp, nextTick } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { describe, expect, it } from 'vitest';

import KeyboardKey from './index.vue';

describe('KeyboardKey Vue', () => {
  it('renders ordered semantic keycaps and one complete accessible phrase', () => {
    const wrapper = mount(KeyboardKey, {
      props: { keys: ['Mod', 'Shift', 'K'], platform: 'mac', dataTestId: 'shortcut' },
    });

    expect(wrapper.findAll('kbd').map((key) => key.text())).toEqual(['⌘', '⇧', 'K']);
    expect(wrapper.get('.peaui-keyboard-key__accessible').text()).toBe('Command plus Shift plus K');
    expect(wrapper.get('[data-testid="shortcut"]').attributes('data-platform')).toBe('mac');
  });

  it('is static, absent from tab order and does not claim an active shortcut', () => {
    const wrapper = mount(KeyboardKey, {
      attrs: { 'aria-keyshortcuts': 'Control+K', role: 'button', tabindex: '0' },
      props: { keys: 'Ctrl + K', platform: 'windows' },
    });
    const root = wrapper.get('.peaui-keyboard-key');

    expect(root.attributes('tabindex')).toBeUndefined();
    expect(root.attributes('role')).toBeUndefined();
    expect(root.attributes('aria-keyshortcuts')).toBeUndefined();
    expect(wrapper.findAll('button')).toHaveLength(0);
  });

  it('keeps custom visual slots separate from the accessible name', () => {
    const wrapper = mount(KeyboardKey, {
      props: { keys: ['Control', 'K'], platform: 'windows' },
      slots: {
        key: ({ visualLabel }: { visualLabel: string }) => `Visual ${visualLabel}`,
        separator: () => 'then',
      },
    });

    expect(wrapper.get('.peaui-keyboard-key__accessible').text()).toBe('Control plus K');
    expect(wrapper.findAll('kbd').map((key) => key.text())).toEqual(['Visual Ctrl', 'Visual K']);
    expect(wrapper.get('.peaui-keyboard-key__separator').text()).toBe('then');
  });

  it('honors a custom accessible label without duplicating aria-label on the root', () => {
    const wrapper = mount(KeyboardKey, {
      props: { ariaLabel: 'Zapisz dokument', keys: ['Mod', 'S'], platform: 'mac' },
    });
    expect(wrapper.get('.peaui-keyboard-key__accessible').text()).toBe('Zapisz dokument');
    expect(wrapper.get('.peaui-keyboard-key').attributes('aria-label')).toBeUndefined();
  });

  it('reacts to format, platform and array changes without changing token order', async () => {
    const wrapper = mount(KeyboardKey, {
      props: { format: 'symbol', keys: ['Mod', 'Enter'], platform: 'mac' },
    });
    await wrapper.setProps({ format: 'text', keys: ['Alt', 'ArrowRight'], platform: 'windows' });
    await nextTick();

    expect(wrapper.findAll('kbd').map((key) => key.text())).toEqual(['Alt', 'Right']);
    expect(wrapper.get('.peaui-keyboard-key__accessible').text()).toBe('Alt plus Right Arrow');
  });

  it('renders auto deterministically as generic during SSR', async () => {
    const html = await renderToString(
      createSSRApp(KeyboardKey, { keys: ['Mod', 'K'], platform: 'auto' }),
    );
    expect(html).toContain('data-platform="generic"');
    expect(html).toContain('Control plus K');
    expect(html).not.toContain('tabindex');
  });
});
