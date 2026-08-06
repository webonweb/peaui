import { afterEach, describe, expect, it } from 'vitest';

import { ImageViewElement, defineImageView } from './index.wc';

defineImageView();

type MountOptions = {
  alt?: string;
  attrs?: Record<string, string>;
  className?: string;
  dataTestId?: string;
  max?: string;
  size?: 'auto' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'full';
  src?: string;
};

function mountImageView(options: MountOptions = {}): ImageViewElement {
  const element = document.createElement(ImageViewElement.tagName) as ImageViewElement;

  if (options.src !== undefined) {
    element.src = options.src;
  }

  if (options.alt !== undefined) {
    element.alt = options.alt;
  }

  if (options.size !== undefined) {
    element.size = options.size;
  }

  if (options.max !== undefined) {
    element.max = options.max;
  }

  if (options.dataTestId !== undefined) {
    element.dataTestId = options.dataTestId;
  }

  if (options.className !== undefined) {
    element.setAttribute('class', options.className);
  }

  if (options.attrs) {
    for (const [name, value] of Object.entries(options.attrs)) {
      element.setAttribute(name, value);
    }
  }

  document.body.appendChild(element);

  return element;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ImageView (index.wc.ts)', () => {
  it('renders image with explicit alt text and default size class', () => {
    const element = mountImageView({
      src: '/images/example-photo.png',
      alt: 'Przykladowe zdjecie',
      dataTestId: 'image-view',
    });
    const image = element.querySelector('img');

    expect(image).not.toBeNull();
    expect(image?.getAttribute('src')).toBe('/images/example-photo.png');
    expect(image?.getAttribute('alt')).toBe('Przykladowe zdjecie');
    expect(image?.getAttribute('data-testid')).toBe('image-view');
    expect(element.classList.contains('peaui-image-view')).toBe(true);
    expect(element.classList.contains('peaui-image-view--size-auto')).toBe(true);
    expect(element.style.maxWidth).toBe('');
  });

  it('creates a fallback alt from the source name when alt is missing', () => {
    const element = mountImageView({
      src: '/images/user-profile_photo.png?version=1',
    });
    const image = element.querySelector('img');

    expect(image?.getAttribute('alt')).toBe('user profile photo');
    expect(image?.getAttribute('aria-hidden')).toBeNull();
    expect(image?.getAttribute('role')).toBeNull();
  });

  it('keeps explicit empty alt as decorative and hides the image from assistive tech', () => {
    const element = mountImageView({
      src: '/images/hero-banner.png',
      alt: '',
    });
    const image = element.querySelector('img');

    expect(image?.getAttribute('alt')).toBe('');
    expect(image?.getAttribute('aria-hidden')).toBe('true');
    expect(image?.getAttribute('role')).toBe('presentation');
  });

  it('forwards image-specific attrs to the inner img and keeps host attrs on the host', () => {
    const element = mountImageView({
      src: '/images/example-photo.png',
      size: 'xl',
      className: 'custom-image',
      attrs: {
        id: 'image-root',
        'data-foo': 'bar',
        loading: 'lazy',
        'aria-label': 'Hero image',
      },
    });
    const image = element.querySelector('img');

    expect(element.getAttribute('id')).toBe('image-root');
    expect(element.getAttribute('data-foo')).toBe('bar');
    expect(element.classList.contains('custom-image')).toBe(true);
    expect(element.classList.contains('peaui-image-view--size-xl')).toBe(true);
    expect(image?.getAttribute('loading')).toBe('lazy');
    expect(image?.getAttribute('aria-label')).toBe('Hero image');
    expect(image?.getAttribute('alt')).toBe('Hero image');
  });

  it('updates the host size modifier when size changes', () => {
    const element = mountImageView({
      src: '/images/example-photo.png',
    });

    element.size = 'full';

    expect(element.classList.contains('peaui-image-view--size-full')).toBe(true);
    expect(element.classList.contains('peaui-image-view--size-auto')).toBe(false);
  });

  it('applies max-width from the max prop and removes it when max is cleared', () => {
    const element = mountImageView({
      src: '/images/example-photo.png',
      max: '18rem',
      attrs: {
        style: 'padding: 1rem; max-width: 14rem;',
      },
    });

    expect(element.style.padding).toBe('1rem');
    expect(element.style.maxWidth).toBe('18rem');

    element.max = '24rem';

    expect(element.style.maxWidth).toBe('24rem');

    element.max = '';

    expect(element.style.padding).toBe('1rem');
    expect(element.style.maxWidth).toBe('14rem');
    expect(element.getAttribute('max')).toBeNull();
  });

  it('clears rendered output when src becomes empty', () => {
    const element = mountImageView({
      src: '/images/example-photo.png',
    });

    element.src = '';

    expect(element.querySelector('img')).toBeNull();
    expect(element.childNodes).toHaveLength(0);
  });
});
