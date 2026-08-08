import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ClipboardError } from '@/helpers/functions.helper';

import CopyButton from './index.vue';

const { copyToClipboardMock } = vi.hoisted(() => ({
  copyToClipboardMock: vi.fn(),
}));

vi.mock('@/helpers/functions.helper', async () => {
  const actual = await vi.importActual<typeof import('@/helpers/functions.helper')>(
    '@/helpers/functions.helper',
  );
  return { ...actual, copyToClipboard: copyToClipboardMock };
});

beforeEach(() => {
  copyToClipboardMock.mockResolvedValue('api');
});

afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
});

describe('CopyButton Vue', () => {
  it('copies the exact value, keeps focus and emits the ordered public contract', async () => {
    const wrapper = mount(CopyButton, {
      props: { dataTestId: 'copy', text: 'PEA-2026-022' },
      attachTo: document.body,
    });
    const button = wrapper.get('button');
    button.element.focus();

    await button.trigger('click');
    await flushPromises();

    expect(copyToClipboardMock).toHaveBeenCalledWith('PEA-2026-022');
    expect(wrapper.emitted('copy')?.[0]?.[0]).toEqual({ text: 'PEA-2026-022' });
    expect(wrapper.emitted('success')?.[0]?.[0]).toEqual({
      method: 'api',
      text: 'PEA-2026-022',
    });
    expect(wrapper.emitted('statusChange')?.map(([status]) => status)).toEqual([
      'copying',
      'copied',
    ]);
    expect(button.attributes('aria-label')).toBe('Kopiuj');
    expect(button.text()).toContain('Skopiowano');
    expect(document.activeElement).toBe(button.element);
    wrapper.unmount();
  });

  it('awaits getText, exposes busy semantics and copies its activation-time result', async () => {
    let resolveText: ((value: string) => void) | undefined;
    const getText = vi.fn(() => new Promise<string>((resolve) => (resolveText = resolve)));
    const wrapper = mount(CopyButton, { props: { getText, text: 'ignored' } });

    await wrapper.get('button').trigger('click');
    expect(wrapper.get('button').attributes('aria-busy')).toBe('true');
    expect(wrapper.get('button').attributes('aria-disabled')).toBe('true');
    expect(wrapper.get('button').attributes()).not.toHaveProperty('disabled');
    resolveText?.('resolved exactly');
    await flushPromises();

    expect(copyToClipboardMock).toHaveBeenCalledWith('resolved exactly');
    expect(wrapper.emitted('copy')?.[0]?.[0]).toEqual({ text: 'resolved exactly' });
  });

  it('distinguishes unsupported clipboard from resolver and write errors', async () => {
    copyToClipboardMock.mockRejectedValueOnce(new ClipboardError('unavailable'));
    const unsupported = mount(CopyButton, { props: { text: 'value' } });
    await unsupported.get('button').trigger('click');
    await flushPromises();
    expect(unsupported.attributes('data-status')).toBe('unsupported');
    expect(unsupported.get('[role="alert"]').text()).toBe('Nie udało się skopiować');
    expect(unsupported.emitted('error')?.[0]?.[0]).toMatchObject({
      status: 'unsupported',
      text: 'value',
    });

    const failure = mount(CopyButton, {
      props: { getText: () => Promise.reject(new Error('source failed')) },
    });
    await failure.get('button').trigger('click');
    await flushPromises();
    expect(failure.attributes('data-status')).toBe('error');
    expect(failure.emitted('copy')).toBeUndefined();
    expect(failure.emitted('error')?.[0]?.[0]).toMatchObject({ status: 'error' });
  });

  it('resets a completed state without leaking or shortening replacement timers', async () => {
    vi.useFakeTimers();
    const wrapper = mount(CopyButton, { props: { resetDelay: 1000, text: 'value' } });

    await wrapper.get('button').trigger('click');
    await Promise.resolve();
    await Promise.resolve();
    expect(wrapper.attributes('data-status')).toBe('copied');
    await vi.advanceTimersByTimeAsync(700);
    await wrapper.get('button').trigger('click');
    await Promise.resolve();
    await Promise.resolve();
    await vi.advanceTimersByTimeAsync(700);
    expect(wrapper.attributes('data-status')).toBe('copied');
    await vi.advanceTimersByTimeAsync(301);
    expect(wrapper.attributes('data-status')).toBe('idle');
  });

  it.each([
    ['disabled', { disabled: true }],
    ['loading', { loading: true }],
  ] as const)('blocks activation while %s', async (_name, state) => {
    const wrapper = mount(CopyButton, { props: { text: 'value', ...state } });
    await wrapper.get('button').trigger('click');
    await flushPromises();
    expect(copyToClipboardMock).not.toHaveBeenCalled();
    expect(wrapper.get('button').attributes()).toHaveProperty('disabled');
  });

  it('keeps icon-only controls named and never treats slot text as the copy source', async () => {
    const wrapper = mount(CopyButton, {
      props: { ariaLabel: 'Kopiuj kod', content: 'icon', text: 'source' },
      slots: { default: 'Nie kopiuj tego tekstu' },
    });
    const button = wrapper.get('button');
    expect(button.attributes('aria-label')).toBe('Kopiuj kod');
    expect(button.text()).not.toContain('Nie kopiuj tego tekstu');
    expect(button.get('.peaui-copy-button__icon').attributes('aria-hidden')).toBe('true');
    await button.trigger('click');
    await flushPromises();
    expect(copyToClipboardMock).toHaveBeenCalledWith('source');
  });

  it('ignores late asynchronous work after unmount and clears pending state', async () => {
    let resolveText: ((value: string) => void) | undefined;
    const wrapper = mount(CopyButton, {
      props: { getText: () => new Promise<string>((resolve) => (resolveText = resolve)) },
    });
    await wrapper.get('button').trigger('click');
    wrapper.unmount();
    resolveText?.('late');
    await flushPromises();
    expect(copyToClipboardMock).not.toHaveBeenCalled();
    expect(wrapper.emitted('success')).toBeUndefined();
  });
});
