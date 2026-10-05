import { describe, expect, it } from 'vitest';

import {
  buildPublicRoutes,
  parseGeneratedArraySource,
  parseGeneratedValueSource,
  renderNotFoundHtml,
  renderRobots,
  renderRouteHtml,
  renderSitemap,
} from './generate-static-pages.mjs';

const routes = buildPublicRoutes({
  vue: [{ category: 'form', name: 'FormInput' }],
  react: [{ category: 'form', name: 'FormInput' }],
  'web-components': [{ category: 'form', name: 'FormInput' }],
});

describe('static SEO files', () => {
  it('builds routes from the lightweight catalog independently of API row storage', () => {
    const catalog = parseGeneratedValueSource(
      `export const catalog = {
      vue: [{ category: 'form', name: 'FormInput' }],
      react: [{ category: 'form', name: 'FormInput' }],
      'web-components': [{ category: 'form', name: 'FormInput' }],
    } as const;`,
      'catalog',
    );
    expect(buildPublicRoutes(catalog)).toEqual(routes);
  });
  it('reads Prettier-formatted TypeScript arrays without relying on JSON syntax', () => {
    const source = `
      export const generated = [
        { name: 'VirtualList', stable: true, sizes: [64, -1], note: null },
      ] as const satisfies readonly unknown[];
    `;

    expect(parseGeneratedArraySource(source, 'generated')).toEqual([
      { name: 'VirtualList', stable: true, sizes: [64, -1], note: null },
    ]);
  });

  it('includes home, framework, category and component pages', () => {
    expect(routes).toContainEqual({ kind: 'home', path: '/' });
    expect(routes).toContainEqual({
      kind: 'category',
      framework: 'vue',
      category: 'form',
      path: '/vue/components/form',
    });
    expect(routes).toContainEqual({
      kind: 'component',
      framework: 'react',
      category: 'form',
      component: 'FormInput',
      path: '/react/components/form/form-input',
    });
  });

  it('renders an XML sitemap for both languages without hash URLs', () => {
    const sitemap = renderSitemap(routes);

    expect(sitemap).toContain('https://webonweb.github.io/peaui/vue/start/');
    expect(sitemap).toContain('https://webonweb.github.io/peaui/pl/vue/start/');
    expect(sitemap).toContain('/react/components/form/form-input/');
    expect(sitemap).not.toContain('#/');
  });

  it('renders robots.txt with the public sitemap URL', () => {
    expect(renderRobots()).toBe(
      'User-agent: *\nAllow: /peaui/\n\nSitemap: https://webonweb.github.io/peaui/sitemap.xml\n',
    );
  });

  it('keeps generated entry pages on their clean route', () => {
    const template = '<html lang="en"><head><title>PeaUI</title></head><body></body></html>';
    const messages = {
      'seo.start.description': { en: 'Vue documentation', pl: 'Dokumentacja Vue' },
      'seo.start.title': { en: 'Vue | PeaUI', pl: 'Vue | PeaUI' },
    };
    const html = renderRouteHtml(
      template,
      { kind: 'start', framework: 'vue', path: '/vue/start' },
      'en',
      messages,
    );

    expect(html).not.toContain('location.replace');
    expect(html).not.toContain('#/');
  });

  it('renders a hash-free 404 fallback for history routing', () => {
    const html = renderNotFoundHtml('<html><head></head><body></body></html>');

    expect(html).toContain('name="robots" content="noindex"');
    expect(html).not.toContain('#/');
  });
});
