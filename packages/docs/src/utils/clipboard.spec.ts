import { describe, expect, it, vi } from 'vitest';

import { copyText } from './clipboard';

function setClipboard(value: { writeText: (text: string) => Promise<void> } | undefined): void {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value,
  });
}

function setExecCommand(result: boolean): ReturnType<typeof vi.fn> {
  const command = vi.fn(() => result);
  Object.defineProperty(document, 'execCommand', {
    configurable: true,
    value: command,
  });
  return command;
}

describe('copyText', () => {
  it('uses Clipboard API when it is available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard({ writeText });

    await expect(copyText('npm install @peaui/ui')).resolves.toBe('api');
    expect(writeText).toHaveBeenCalledWith('npm install @peaui/ui');
  });

  it('uses the selection fallback when Clipboard API is unavailable', async () => {
    setClipboard(undefined);
    const execCommand = setExecCommand(true);

    await expect(copyText('fallback value')).resolves.toBe('fallback');
    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(document.querySelector('textarea')).toBeNull();
  });

  it('falls back after a Clipboard API rejection', async () => {
    setClipboard({ writeText: vi.fn().mockRejectedValue(new Error('denied')) });
    const execCommand = setExecCommand(true);

    await expect(copyText('fallback value')).resolves.toBe('fallback');
    expect(execCommand).toHaveBeenCalledWith('copy');
  });

  it('reports an error when neither copy method succeeds', async () => {
    setClipboard(undefined);
    setExecCommand(false);

    await expect(copyText('unavailable')).rejects.toThrow('Clipboard is unavailable');
  });
});
