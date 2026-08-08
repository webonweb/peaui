import { nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ClipboardError } from '@/helpers/functions.helper';

import { CopyButtonElement, defineCopyButton } from './index.wc';

const { copyToClipboardMock } = vi.hoisted(() => ({
  copyToClipboardMock: vi.fn(),
}));

vi.mock('@/helpers/functions.helper', async () => {
  const actual = await vi.importActual<typeof import('@/helpers/functions.helper')>(
    '@/helpers/functions.helper',
  );
  return { ...actual, copyToClipboard: copyToClipboardMock };
});

async function flush(): Promise<void> {
  await nextTick();
  await Promise.resolve();
  await nextTick();
}

async function mountElement(options: Partial<CopyButtonElement> = {}): Promise<CopyButtonElement> {
  const element = document.createElement(CopyButtonElement.tagName) as CopyButtonElement;
  Object.assign(element, options);
  document.body.append(element);
  await flush();
  return element;
}

beforeEach(() => {
  copyToClipboardMock.mockResolvedValue('api');
});

afterEach(() => {
  document.body.replaceChildren();
  vi.clearAllMocks();
  vi.useRealTimers();
});

describe('CopyButton Web Component', () => {
  it('registers, copies exact text and dispatches equivalent composed events', async () => {
    defineCopyButton();
    expect(customElements.get(CopyButtonElement.tagName)).toBe(CopyButtonElement);
    const element = await mountElement({ text: 'PEA-2026-022' });
    const copy = vi.fn();
    const success = vi.fn();
    element.addEventListener('copy', copy);
    element.addEventListener('success', success);
    const button = element.querySelector<HTMLButtonElement>('button');
    if (!button) throw new Error('Missing CopyButton button');
    button.focus();
    button.click();
    await flush();

    expect(copyToClipboardMock).toHaveBeenCalledWith('PEA-2026-022');
    expect((copy.mock.calls[0]?.[0] as CustomEvent).detail).toEqual({ text: 'PEA-2026-022' });
    expect((success.mock.calls[0]?.[0] as CustomEvent).detail).toEqual({
      method: 'api',
      text: 'PEA-2026-022',
    });
    expect(element.getAttribute('data-status')).toBeNull();
    expect(element.querySelector('.peaui-copy-button')?.getAttribute('data-status')).toBe('copied');
    expect(button.getAttribute('aria-label')).toBe('Kopiuj');
    expect(document.activeElement).toBe(button);
  });

  it('awaits getText and exposes the busy state on the native button', async () => {
    let resolveText: ((value: string) => void) | undefined;
    const element = await mountElement({
      getText: () => new Promise<string>((resolve) => (resolveText = resolve)),
      text: 'ignored',
    });
    const button = element.querySelector<HTMLButtonElement>('button');
    button?.click();
    await nextTick();
    expect(button?.disabled).toBe(false);
    expect(button?.getAttribute('aria-busy')).toBe('true');
    expect(button?.getAttribute('aria-disabled')).toBe('true');
    resolveText?.('resolved exactly');
    await flush();
    expect(copyToClipboardMock).toHaveBeenCalledWith('resolved exactly');
  });

  it('announces and dispatches an unsupported clipboard result', async () => {
    copyToClipboardMock.mockRejectedValueOnce(new ClipboardError('unavailable'));
    const element = await mountElement({ showStatus: true, text: 'value' });
    const error = vi.fn();
    element.addEventListener('error', error);
    element.querySelector<HTMLButtonElement>('button')?.click();
    await flush();

    expect(element.querySelector('[role="alert"]')?.textContent).toContain(
      'Nie udało się skopiować',
    );
    expect((error.mock.calls[0]?.[0] as CustomEvent).detail).toMatchObject({
      status: 'unsupported',
      text: 'value',
    });
  });

  it.each([
    ['disabled', { disabled: true }],
    ['loading', { loading: true }],
  ] as const)('blocks activation while %s', async (_name, state) => {
    const element = await mountElement({ text: 'value', ...state });
    const button = element.querySelector<HTMLButtonElement>('button');
    expect(button?.disabled).toBe(true);
    button?.click();
    await flush();
    expect(copyToClipboardMock).not.toHaveBeenCalled();
  });

  it('cancels pending async work and reset timers when disconnected', async () => {
    vi.useFakeTimers();
    let resolveText: ((value: string) => void) | undefined;
    const element = await mountElement({
      getText: () => new Promise<string>((resolve) => (resolveText = resolve)),
      resetDelay: 100,
    });
    const success = vi.fn();
    const statusChange = vi.fn();
    element.addEventListener('success', success);
    element.addEventListener('statusChange', statusChange);
    element.querySelector<HTMLButtonElement>('button')?.click();
    await nextTick();
    element.remove();
    resolveText?.('late');
    await Promise.resolve();
    await vi.runAllTimersAsync();
    expect(copyToClipboardMock).not.toHaveBeenCalled();
    expect(success).not.toHaveBeenCalled();
    expect(statusChange).toHaveBeenCalledTimes(1);
  });
});
