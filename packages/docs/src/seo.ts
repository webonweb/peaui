import { watchEffect } from 'vue';
import { useRoute } from 'vue-router';

import { findFrameworkComponent } from './data/catalog';
import { getCategoryLabel } from './data/localized-content';
import { locale, translateForLocale, type Locale } from './i18n';
import { stripLocaleRoutePrefix } from './router';
import type { FrameworkId } from './types';
import { isFrameworkId } from './utils/preferred-framework';

export const PUBLIC_SITE_URL = 'https://webonweb.github.io/peaui';
export const SOCIAL_IMAGE_URL = `${PUBLIC_SITE_URL}/favicon.png`;

export interface SeoRouteContext {
  category?: string;
  component?: string;
  framework?: FrameworkId;
  name?: string;
  path: string;
}

export interface SeoMetadata {
  canonicalUrl: string;
  description: string;
  imageUrl: string;
  locale: Locale;
  title: string;
}

const frameworkSeoLabels: Record<FrameworkId, string> = {
  vue: 'Vue 3',
  react: 'React',
  'web-components': 'Web Components',
};

function normalizePath(path: string): string {
  if (path === '/' || !path) return '';
  return `${path.replace(/^\/+|\/+$/g, '')}/`;
}

export function getCanonicalUrl(path: string, targetLocale: Locale): string {
  const localePrefix = targetLocale === 'pl' ? 'pl/' : '';
  return `${PUBLIC_SITE_URL}/${localePrefix}${normalizePath(path)}`;
}

export function createSeoMetadata(context: SeoRouteContext, targetLocale: Locale): SeoMetadata {
  const framework = context.framework ? frameworkSeoLabels[context.framework] : 'Vue';
  const values = {
    category: context.category ?? '',
    component: context.component ?? '',
    framework,
  };
  let titleKey: Parameters<typeof translateForLocale>[0] = 'seo.home.title';
  let descriptionKey: Parameters<typeof translateForLocale>[0] = 'seo.home.description';

  if (context.name === 'start') {
    titleKey = 'seo.start.title';
    descriptionKey = 'seo.start.description';
  } else if (context.name === 'components') {
    titleKey = 'seo.components.title';
    descriptionKey = 'seo.components.description';
  } else if (context.name === 'component-category') {
    titleKey = 'seo.category.title';
    descriptionKey = 'seo.category.description';
  } else if (context.name === 'component') {
    titleKey = 'seo.component.title';
    descriptionKey = 'seo.component.description';
  } else if (context.name === 'icons') {
    titleKey = 'seo.icons.title';
    descriptionKey = 'seo.icons.description';
  }

  return {
    canonicalUrl: getCanonicalUrl(context.path, targetLocale),
    description: translateForLocale(descriptionKey, targetLocale, values),
    imageUrl: SOCIAL_IMAGE_URL,
    locale: targetLocale,
    title: translateForLocale(titleKey, targetLocale, values),
  };
}

function setMeta(
  selector: string,
  attribute: 'name' | 'property',
  value: string,
  content: string,
): void {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, value);
    document.head.append(element);
  }
  element.content = content;
}

function setLink(rel: string, href: string, hrefLang?: string): void {
  const selector = hrefLang
    ? `link[rel="${rel}"][hreflang="${hrefLang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    if (hrefLang) element.hreflang = hrefLang;
    document.head.append(element);
  }
  element.href = href;
}

export function applySeoMetadata(metadata: SeoMetadata, routePath: string): void {
  document.documentElement.lang = metadata.locale;
  document.title = metadata.title;
  setMeta('meta[name="description"]', 'name', 'description', metadata.description);
  setMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
  setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'PeaUI');
  setMeta('meta[property="og:title"]', 'property', 'og:title', metadata.title);
  setMeta('meta[property="og:description"]', 'property', 'og:description', metadata.description);
  setMeta('meta[property="og:url"]', 'property', 'og:url', metadata.canonicalUrl);
  setMeta('meta[property="og:image"]', 'property', 'og:image', metadata.imageUrl);
  setMeta(
    'meta[property="og:locale"]',
    'property',
    'og:locale',
    metadata.locale === 'pl' ? 'pl_PL' : 'en_US',
  );
  setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
  setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', metadata.title);
  setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', metadata.description);
  setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', metadata.imageUrl);
  setLink('canonical', metadata.canonicalUrl);
  setLink('alternate', getCanonicalUrl(routePath, 'en'), 'en');
  setLink('alternate', getCanonicalUrl(routePath, 'pl'), 'pl');
  setLink('alternate', getCanonicalUrl(routePath, 'en'), 'x-default');
}

export function useRouteSeo(): void {
  const route = useRoute();

  watchEffect(() => {
    const rawFramework = route.params.framework;
    const framework = isFrameworkId(rawFramework) ? rawFramework : undefined;
    const categorySlug = typeof route.params.category === 'string' ? route.params.category : '';
    const componentSlug = typeof route.params.component === 'string' ? route.params.component : '';
    const definition = framework
      ? findFrameworkComponent(framework, categorySlug, componentSlug)
      : undefined;
    const category = categorySlug
      ? getCategoryLabel(categorySlug, definition?.categoryLabel ?? categorySlug)
      : undefined;
    const publicRoutePath = stripLocaleRoutePrefix(route.path);
    const metadata = createSeoMetadata(
      {
        category,
        component: definition?.name ?? componentSlug,
        framework,
        name: typeof route.name === 'string' ? route.name : undefined,
        path: publicRoutePath,
      },
      locale.value,
    );
    applySeoMetadata(metadata, publicRoutePath);
  });
}
