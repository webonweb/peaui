/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';

import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ClipboardError } from '@/helpers/functions.helper';

import CopyButton from './index';

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
  cleanup();
  vi.clearAllMocks();
  vi.useRealTimers();
});

describe('CopyButton React', () => {
  it('copies the exact value and exposes the same ordered callback contract', async () => {
    const order: string[] = [];
    const onCopy = vi.fn(() => order.push('copy'));
    const onStatusChange = vi.fn((status: string) => order.push(status));
    const onSuccess = vi.fn(() => order.push('success'));
    render(
      <CopyButton
        dataTestId="copy"
        text="PEA-2026-022"
        onCopy={onCopy}
        onStatusChange={onStatusChange}
        onSuccess={onSuccess}
      />,
    );
    const button = screen.getByRole('button', { name: 'Kopiuj' });
    button.focus();
    fireEvent.click(button);

    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce());
    expect(copyToClipboardMock).toHaveBeenCalledWith('PEA-2026-022');
    expect(onCopy).toHaveBeenCalledWith({ text: 'PEA-2026-022' });
    expect(onSuccess).toHaveBeenCalledWith({ method: 'api', text: 'PEA-2026-022' });
    expect(order).toEqual(['copying', 'copy', 'copied', 'success']);
    expect(button).toHaveAccessibleName('Kopiuj');
    expect(button).toHaveTextContent('Skopiowano');
    expect(button).toHaveFocus();
  });

  it('awaits an asynchronous resolver while exposing focus-safe busy semantics', async () => {
    let resolveText: ((value: string) => void) | undefined;
    const getText = vi.fn(() => new Promise<string>((resolve) => (resolveText = resolve)));
    render(<CopyButton getText={getText} text="ignored" />);
    const button = screen.getByRole('button', { name: 'Kopiuj' });
    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).not.toBeDisabled();
    resolveText?.('resolved exactly');
    await waitFor(() => expect(copyToClipboardMock).toHaveBeenCalledWith('resolved exactly'));
  });

  it('distinguishes unsupported clipboard from source errors and announces both', async () => {
    copyToClipboardMock.mockRejectedValueOnce(new ClipboardError('unavailable'));
    const onError = vi.fn();
    const { rerender } = render(<CopyButton showStatus text="value" onError={onError} />);
    fireEvent.click(screen.getByRole('button', { name: 'Kopiuj' }));
    await waitFor(() => expect(onError).toHaveBeenCalledOnce());
    expect(onError.mock.calls[0]?.[0]).toMatchObject({
      status: 'unsupported',
      text: 'value',
    });
    expect(screen.getByRole('alert')).toHaveTextContent('Nie udało się skopiować');

    onError.mockClear();
    rerender(
      <CopyButton
        showStatus
        getText={() => Promise.reject(new Error('source failed'))}
        onError={onError}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Kopiuj' }));
    await waitFor(() => expect(onError).toHaveBeenCalledOnce());
    expect(onError.mock.calls[0]?.[0]).toMatchObject({ status: 'error' });
  });

  it('resets status through a replaceable timer', async () => {
    vi.useFakeTimers();
    render(<CopyButton dataTestId="copy" resetDelay={500} text="value" />);
    const button = screen.getByRole('button', { name: 'Kopiuj' });
    fireEvent.click(button);
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(screen.getByTestId('copy')).toHaveAttribute('data-status', 'copied');
    await act(() => vi.advanceTimersByTimeAsync(300));
    fireEvent.click(button);
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    await act(() => vi.advanceTimersByTimeAsync(300));
    expect(screen.getByTestId('copy')).toHaveAttribute('data-status', 'copied');
    await act(() => vi.advanceTimersByTimeAsync(201));
    expect(screen.getByTestId('copy')).toHaveAttribute('data-status', 'idle');
  });

  it.each([
    ['disabled', { disabled: true }],
    ['loading', { loading: true }],
  ] as const)('blocks activation while %s', async (_name, state) => {
    render(<CopyButton text="value" {...state} />);
    const button = screen.getByRole('button', { name: 'Kopiuj' });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(copyToClipboardMock).not.toHaveBeenCalled();
  });

  it('supports icon and status renderers without sourcing text from children', async () => {
    render(
      <CopyButton
        ariaLabel="Kopiuj kod"
        content="icon"
        copiedIcon={({ status }) => <span data-testid="copied-icon">{status}</span>}
        icon={<span data-testid="copy-icon" />}
        renderStatus={({ message }) => <strong>{message}</strong>}
        text="source"
      >
        Nie kopiuj tej treści
      </CopyButton>,
    );
    const button = screen.getByRole('button', { name: 'Kopiuj kod' });
    expect(screen.getByTestId('copy-icon')).toBeInTheDocument();
    fireEvent.click(button);
    await waitFor(() => expect(screen.getByTestId('copied-icon')).toHaveTextContent('copied'));
    expect(copyToClipboardMock).toHaveBeenCalledWith('source');
    expect(button).not.toHaveTextContent('Nie kopiuj tej treści');
  });

  it('ignores an asynchronous result after unmount', async () => {
    let resolveText: ((value: string) => void) | undefined;
    const onSuccess = vi.fn();
    const { unmount } = render(
      <CopyButton
        getText={() => new Promise<string>((resolve) => (resolveText = resolve))}
        onSuccess={onSuccess}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Kopiuj' }));
    unmount();
    resolveText?.('late');
    await Promise.resolve();
    await Promise.resolve();
    expect(copyToClipboardMock).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
