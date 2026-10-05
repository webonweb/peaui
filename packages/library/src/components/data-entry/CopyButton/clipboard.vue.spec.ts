import { afterEach, describe, expect, it, vi } from 'vitest';

import { copyToClipboard } from '@/helpers/functions.helper';

const clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
const execCommandDescriptor = Object.getOwnPropertyDescriptor(document, 'execCommand');

function setClipboard(value: { writeText: (text: string) => Promise<void> } | undefined): void {
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value });
}

function setExecCommand(implementation: () => boolean): ReturnType<typeof vi.fn> {
  const command = vi.fn(implementation);
  Object.defineProperty(document, 'execCommand', { configurable: true, value: command });
  return command;
}

afterEach(() => {
  document.body.replaceChildren();
  if (clipboardDescriptor) Object.defineProperty(navigator, 'clipboard', clipboardDescriptor);
  else Reflect.deleteProperty(navigator, 'clipboard');
  if (execCommandDescriptor) Object.defineProperty(document, 'execCommand', execCommandDescriptor);
  else Reflect.deleteProperty(document, 'execCommand');
});

describe('copyToClipboard', () => {
  it('uses the Clipboard API with the exact supplied value', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard({ writeText });

    await expect(copyToClipboard('PEA-2026-022')).resolves.toBe('api');
    expect(writeText).toHaveBeenCalledWith('PEA-2026-022');
  });

  it('falls back after an API rejection and restores focus and selection artifacts', async () => {
    setClipboard({ writeText: vi.fn().mockRejectedValue(new Error('denied')) });
    const execCommand = setExecCommand(() => true);
    const trigger = document.createElement('button');
    document.body.append(trigger);
    trigger.focus();

    await expect(copyToClipboard('fallback')).resolves.toBe('fallback');

    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(document.querySelector('textarea')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('reports unsupported environments without leaving temporary DOM', async () => {
    setClipboard(undefined);
    setExecCommand(() => false);

    await expect(copyToClipboard('unavailable')).rejects.toMatchObject({
      code: 'unavailable',
      name: 'ClipboardError',
    });
    expect(document.querySelector('textarea')).toBeNull();
  });

  it('reports fallback exceptions as write failures and still performs cleanup', async () => {
    setClipboard(undefined);
    setExecCommand(() => {
      throw new Error('blocked');
    });

    await expect(copyToClipboard('failure')).rejects.toMatchObject({
      code: 'write-failed',
    });
    expect(document.querySelector('textarea')).toBeNull();
  });
});
