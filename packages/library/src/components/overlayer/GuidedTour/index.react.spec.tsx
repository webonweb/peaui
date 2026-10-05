/** @jsxImportSource react */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import GuidedTour from './index.tsx';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('GuidedTour React', () => {
  it('renders an accessible modal and completes the final step', async () => {
    const onComplete = vi.fn();
    const onOpenChange = vi.fn();
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      },
    );

    render(
      <GuidedTour
        mode="modal"
        open
        step={0}
        steps={[{ id: 'welcome', title: 'Welcome', description: 'React tour' }]}
        onComplete={onComplete}
        onOpenChange={onOpenChange}
      />,
    );

    const dialog = await screen.findByRole('dialog', { name: 'Welcome' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveTextContent('Welcome');

    fireEvent.click(screen.getByRole('button', { name: 'Complete' }));

    await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('exposes controlled navigation and blocks a guarded step', async () => {
    const onStepChange = vi.fn();
    render(
      <GuidedTour
        mode="modal"
        open
        step={0}
        steps={[
          { id: 'guarded', title: 'Guarded', canAdvance: async () => false },
          { id: 'next', title: 'Next' },
        ]}
        onStepChange={onStepChange}
      />,
    );

    fireEvent.click(await screen.findByRole('button', { name: 'Next' }));

    expect(onStepChange).not.toHaveBeenCalled();
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Complete the required action before continuing.',
    );
  });
});
