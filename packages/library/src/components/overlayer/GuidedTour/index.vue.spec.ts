import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

import GuidedTour from './index.vue';

const rect = (left = 100, top = 100, width = 120, height = 40): DOMRect =>
  ({
    x: left,
    y: top,
    top,
    right: left + width,
    bottom: top + height,
    left,
    width,
    height,
    toJSON: () => ({}),
  }) as DOMRect;

describe('GuidedTour', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      },
    );
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: false })),
    );
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('renders an accessible step and emits controlled navigation intents', async () => {
    const target = document.createElement('button');
    target.id = 'guided-target';
    target.getBoundingClientRect = vi.fn(() => rect());
    target.scrollIntoView = vi.fn();
    document.body.appendChild(target);
    const wrapper = mount(GuidedTour, {
      attachTo: document.body,
      props: {
        open: true,
        step: 0,
        steps: [
          { id: 'first', target, title: 'First step', description: 'First description' },
          { id: 'second', target, title: 'Second step' },
        ],
        dataTestId: 'guided-tour',
      },
    });
    await flushPromises();
    const dialog = wrapper.get('[role="dialog"]');
    expect(dialog.attributes('aria-labelledby')).toBeTruthy();
    expect(wrapper.text()).toContain('First step');
    expect(wrapper.text()).toContain('Step 1 of 2');
    await wrapper.findAll('button').at(-1)!.trigger('click');
    await flushPromises();
    expect(wrapper.emitted('next')?.[0]?.[0]).toMatchObject({ index: 0, step: { id: 'first' } });
    expect(wrapper.emitted('update:step')?.[0]).toEqual([1]);
  });

  it('reports a missing target and keeps an accessible exit', async () => {
    const wrapper = mount(GuidedTour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [{ id: 'missing', target: '#does-not-exist', title: 'Missing target' }],
        targetTimeout: 0,
        missingTargetStrategy: 'block',
      },
    });
    await flushPromises();
    expect(wrapper.emitted('targetMissing')).toHaveLength(1);
    expect(wrapper.get('[role="status"]').text()).toContain('not available');
    expect(wrapper.findAll('button').some((button) => button.text().includes('Close tour'))).toBe(
      true,
    );
  });

  it('closes on Escape and restores focus after the controlled state changes', async () => {
    const trigger = document.createElement('button');
    const target = document.createElement('button');
    target.getBoundingClientRect = vi.fn(() => rect());
    document.body.append(trigger, target);
    trigger.focus();
    const wrapper = mount(GuidedTour, {
      attachTo: document.body,
      props: { open: true, steps: [{ id: 'step', target, title: 'Step' }] },
    });
    await flushPromises();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await flushPromises();
    expect(wrapper.emitted('skip')).toHaveLength(1);
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false]);
    await wrapper.setProps({ open: false });
    await flushPromises();
    expect(document.activeElement).toBe(trigger);
  });

  it('blocks next when the current step guard returns false', async () => {
    const target = document.createElement('button');
    target.getBoundingClientRect = vi.fn(() => rect());
    document.body.appendChild(target);
    const wrapper = mount(GuidedTour, {
      attachTo: document.body,
      props: {
        open: true,
        steps: [{ id: 'required', target, title: 'Required', canAdvance: () => false }],
      },
    });
    await flushPromises();
    await wrapper.findAll('button').at(-1)!.trigger('click');
    await flushPromises();
    expect(wrapper.emitted('complete')).toBeUndefined();
    expect(wrapper.text()).toContain('Complete the required action');
  });
});
