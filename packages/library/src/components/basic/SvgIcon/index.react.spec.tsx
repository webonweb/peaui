/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';

import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import SvgIcon from './index';

afterEach(cleanup);

describe('SvgIcon (React)', () => {
  it('lazy-loads normalized catalog markup from a small runtime bucket', async () => {
    render(<SvgIcon dataTestId="catalog-icon" name="core/accessibility" />);

    const icon = screen.getByTestId('catalog-icon');

    expect(icon).toHaveAttribute('viewBox', '0 0 24 24');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toHaveAttribute('focusable', 'false');

    await waitFor(() => {
      expect(icon.querySelector('path')).toBeInTheDocument();
    });

    expect(icon).toHaveAttribute('fill', 'none');
    expect(icon).toHaveAttribute('stroke', 'currentColor');
    expect(icon).toHaveAttribute('stroke-width', '1.8');
    expect(icon.querySelector('circle')).toBeInTheDocument();
  });

  it('derives image semantics from an accessible name', async () => {
    render(
      <SvgIcon
        aria-label="Dostepnosc"
        dataTestId="named-catalog-icon"
        name="ring/ring-accessibility"
      />,
    );

    const icon = screen.getByTestId('named-catalog-icon');

    expect(icon).toHaveAttribute('aria-label', 'Dostepnosc');
    expect(icon).not.toHaveAttribute('aria-hidden');
    expect(icon).toHaveAttribute('role', 'img');

    await waitFor(() => {
      expect(icon.querySelector('circle')).toBeInTheDocument();
    });
  });

  it('lazy-loads a non-essential legacy icon without the full icon payload', async () => {
    render(<SvgIcon dataTestId="legacy-icon" name="cogs" />);

    const icon = screen.getByTestId('legacy-icon');
    await waitFor(() => {
      expect(icon.querySelector('path')).toBeInTheDocument();
    });

    expect(icon).toHaveAttribute('viewBox');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('does not substitute an unrelated icon for an unknown name', () => {
    const { container } = render(<SvgIcon name="missing-icon" />);

    expect(container).toBeEmptyDOMElement();
  });
});
