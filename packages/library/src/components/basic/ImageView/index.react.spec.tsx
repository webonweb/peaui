/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ImageView from './index';

describe('ImageView React image contract', () => {
  it('forwards responsive image and loading attributes to the image', () => {
    const onLoad = vi.fn();
    const onError = vi.fn();
    render(
      <ImageView
        alt="Portrait"
        decoding="async"
        data-testid="portrait"
        fetchPriority="low"
        height={100}
        id="image-wrapper"
        loading="lazy"
        sizes="(max-width: 600px) 100vw, 200px"
        src="/portrait.png"
        srcSet="/portrait.png 1x, /portrait-2x.png 2x"
        width={200}
        onError={onError}
        onLoad={onLoad}
      />,
    );
    const image = screen.getByRole('img', { name: 'Portrait' });
    expect(screen.getByTestId('portrait')).toBe(image);
    for (const [name, value] of Object.entries({
      loading: 'lazy',
      decoding: 'async',
      fetchpriority: 'low',
      width: '200',
      height: '100',
      srcset: '/portrait.png 1x, /portrait-2x.png 2x',
      sizes: '(max-width: 600px) 100vw, 200px',
    })) {
      expect(image).toHaveAttribute(name, value);
      expect(image.parentElement).not.toHaveAttribute(name);
    }
    expect(image.parentElement).toHaveAttribute('id', 'image-wrapper');
    fireEvent.load(image);
    fireEvent.error(image);
    expect(onLoad).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('keeps an explicit empty alt decorative and derives missing alt from the source', () => {
    const { container, rerender } = render(<ImageView alt="" src="/user-profile.png" />);
    expect(container.querySelector('img')).toHaveAttribute('role', 'presentation');
    expect(container.querySelector('img')).toHaveAttribute('aria-hidden', 'true');
    rerender(<ImageView src="/user-profile.png" />);
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'user profile');
  });
});
