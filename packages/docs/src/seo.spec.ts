import { beforeEach, describe, expect, it } from 'vitest';

import { applySeoMetadata, createSeoMetadata, getCanonicalUrl } from './seo';

describe('SEO metadata', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });

  it('creates unique English home and component metadata', () => {
    const home = createSeoMetadata({ name: 'home', path: '/' }, 'en');
    const component = createSeoMetadata(
      {
        name: 'component',
        path: '/vue/components/form/form-input',
        framework: 'vue',
        component: 'FormInput',
      },
      'en',
    );

    expect(home.title).toContain('accessible components');
    expect(component.title).toBe('FormInput — Vue 3 component | PeaUI');
    expect(component.description).toContain('props, variants, events and live examples');
    expect(component.title).not.toBe(home.title);
  });

  it('creates Polish route-aware metadata and public canonical URLs', () => {
    const metadata = createSeoMetadata(
      {
        name: 'component',
        path: '/react/components/form/form-input',
        framework: 'react',
        component: 'FormInput',
      },
      'pl',
    );

    expect(metadata.title).toBe('FormInput — komponent dla React | PeaUI');
    expect(metadata.description).toContain('Dostępny i w pełni typowany');
    expect(metadata.canonicalUrl).toBe(
      'https://webonweb.github.io/peaui/pl/react/components/form/form-input/',
    );
    expect(metadata.canonicalUrl).not.toContain('localhost');
  });

  it('updates canonical, Open Graph and Twitter tags', () => {
    const metadata = createSeoMetadata(
      { name: 'icons', path: '/web-components/icons', framework: 'web-components' },
      'en',
    );

    applySeoMetadata(metadata, '/web-components/icons');

    expect(document.title).toBe(metadata.title);
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      metadata.canonicalUrl,
    );
    expect(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe(
      metadata.title,
    );
    expect(document.querySelector('meta[property="og:url"]')?.getAttribute('content')).toBe(
      metadata.canonicalUrl,
    );
    expect(document.querySelector('meta[name="twitter:card"]')?.getAttribute('content')).toBe(
      'summary_large_image',
    );
    expect(document.querySelector('meta[name="twitter:image"]')?.getAttribute('content')).toContain(
      '/peaui/favicon.png',
    );
  });

  it('uses the GitHub Pages base for every canonical URL', () => {
    expect(getCanonicalUrl('/', 'en')).toBe('https://webonweb.github.io/peaui/');
    expect(getCanonicalUrl('/vue/start', 'pl')).toBe(
      'https://webonweb.github.io/peaui/pl/vue/start/',
    );
  });
});
