import { flushPromises, mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import CommandPalette from './index.vue';
import type { CommandPaletteCommand } from './command-palette.shared';

const commands: readonly CommandPaletteCommand[] = [
  { id: 'first', label: 'First command', group: 'actions' },
  { id: 'disabled', label: 'Disabled command', disabled: true, group: 'actions' },
  {
    id: 'nested',
    label: 'Nested commands',
    children: [{ id: 'child', label: 'Child command' }],
  },
];

afterEach(() => document.body.replaceChildren());

describe('CommandPalette Vue', () => {
  it('renders an accessible combobox, grouped listbox and active descendant', async () => {
    const wrapper = mount(CommandPalette, {
      attachTo: document.body,
      props: { commands, mode: 'embedded', open: true, registerShortcut: false },
    });
    await nextTick();
    const input = wrapper.get('[role="combobox"]');
    expect(input.attributes('aria-controls')).toBeTruthy();
    expect(input.attributes('aria-activedescendant')).toContain('first');
    expect(wrapper.get('[role="listbox"]')).toBeTruthy();
    expect(wrapper.findAll('[role="group"]')).toHaveLength(2);
    expect(wrapper.get('[aria-disabled="true"]').text()).toContain('Disabled command');
  });

  it('filters immediately and executes the active command from the keyboard', async () => {
    const execute = vi.fn();
    const wrapper = mount(CommandPalette, {
      props: {
        commands: [{ id: 'settings', label: 'Open settings', keywords: ['preferences'], execute }],
        closeOnExecute: false,
        mode: 'embedded',
        open: true,
        registerShortcut: false,
      },
    });
    await wrapper.get('[role="combobox"]').setValue('pref');
    await wrapper.get('[role="combobox"]').trigger('keydown', { key: 'Enter' });
    await flushPromises();
    expect(execute).toHaveBeenCalledTimes(1);
    expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ id: 'settings' });
    expect(wrapper.emitted('execute')).toHaveLength(1);
    expect(wrapper.emitted('executionSuccess')).toHaveLength(1);
  });

  it('enters a nested level and returns with Escape', async () => {
    const wrapper = mount(CommandPalette, {
      props: { commands, mode: 'embedded', open: true, registerShortcut: false },
    });
    const nested = wrapper
      .findAll('[role="option"]')
      .find((item) => item.text().includes('Nested'));
    await nested?.trigger('click');
    expect(wrapper.text()).toContain('Child command');
    await wrapper.get('[role="combobox"]').trigger('keydown', { key: 'Escape' });
    expect(wrapper.text()).toContain('First command');
    expect(wrapper.emitted('levelChange')).toHaveLength(2);
  });

  it('prevents duplicate async execution and exposes an execution error', async () => {
    let rejectAction: ((reason: Error) => void) | undefined;
    const execute = vi.fn(
      () =>
        new Promise<void>((_resolve, reject) => {
          rejectAction = reject;
        }),
    );
    const wrapper = mount(CommandPalette, {
      props: {
        commands: [{ id: 'async', label: 'Async command', execute }],
        closeOnExecute: false,
        mode: 'embedded',
        open: true,
        registerShortcut: false,
      },
    });
    const input = wrapper.get('[role="combobox"]');
    await input.trigger('keydown', { key: 'Enter' });
    await input.trigger('keydown', { key: 'Enter' });
    expect(execute).toHaveBeenCalledTimes(1);
    rejectAction?.(new Error('Network unavailable'));
    await flushPromises();
    expect(wrapper.get('[role="alert"]').text()).toContain('Network unavailable');
    expect(wrapper.emitted('executionError')).toHaveLength(1);
  });

  it('opens with Mod+K outside editable fields and restores trigger focus on close', async () => {
    const wrapper = mount(CommandPalette, {
      attachTo: document.body,
      props: { commands, mode: 'embedded' },
      slots: {
        trigger: ({ openPalette }: { openPalette: () => void }) =>
          h('button', { 'data-testid': 'trigger', onClick: openPalette }, 'Commands'),
      },
    });
    const trigger = wrapper.get('[data-testid="trigger"]');
    (trigger.element as HTMLButtonElement).focus();
    trigger.element.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, ctrlKey: true, key: 'k' }),
    );
    await nextTick();
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([true]);
    expect(wrapper.find('[role="combobox"]').exists()).toBe(true);
    await wrapper.get('[role="combobox"]').trigger('keydown', { key: 'Escape' });
    await nextTick();
    expect(document.activeElement).toBe(trigger.element);
  });
});
