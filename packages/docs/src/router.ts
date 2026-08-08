import { createRouter, createWebHistory, type LocationQueryRaw } from 'vue-router';

import { locale, setLocale } from './i18n';
import {
  getPreferredFramework,
  isFrameworkId,
  setPreferredFramework,
} from './utils/preferred-framework';

const localePrefix = '/:locale(pl)?';

export function stripLocaleRoutePrefix(path: string): string {
  if (path === '/pl' || path === '/pl/') return '/';
  return path.startsWith('/pl/') ? path.slice(3) : path;
}

export function getLocalizedRoutePath(path: string, targetLocale: 'en' | 'pl'): string {
  const routePath = stripLocaleRoutePrefix(path);
  return targetLocale === 'pl' ? `/pl${routePath === '/' ? '' : routePath}` : routePath;
}

function withoutLegacyLocaleQuery(query: LocationQueryRaw): LocationQueryRaw {
  const remainingQuery = { ...query };
  delete remainingQuery.lang;
  return remainingQuery;
}

function redirectWithRouteLocale(path: string, localeParam: unknown): string {
  return getLocalizedRoutePath(path, localeParam === 'pl' ? 'pl' : 'en');
}

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: localePrefix, name: 'home', component: () => import('./views/HomePage.vue') },
    {
      path: `${localePrefix}/:framework(vue|react|web-components)/start`,
      name: 'start',
      component: () => import('./views/GettingStartedPage.vue'),
    },
    {
      path: `${localePrefix}/:framework(vue|react|web-components)/components`,
      name: 'components',
      component: () => import('./views/ComponentsIndexPage.vue'),
    },
    {
      path: `${localePrefix}/:framework(vue|react|web-components)/components/:category`,
      name: 'component-category',
      component: () => import('./views/ComponentsIndexPage.vue'),
    },
    {
      path: `${localePrefix}/:framework(vue|react|web-components)/icons`,
      name: 'icons',
      component: () => import('./views/IconsPage.vue'),
    },
    {
      path: `${localePrefix}/:framework(vue|react|web-components)/components/:category/:component`,
      name: 'component',
      component: () => import('./views/ComponentPage.vue'),
    },
    {
      path: `${localePrefix}/start`,
      redirect: (to) =>
        redirectWithRouteLocale(`/${getPreferredFramework() ?? 'vue'}/start`, to.params.locale),
    },
    {
      path: `${localePrefix}/components`,
      redirect: (to) =>
        redirectWithRouteLocale(
          `/${getPreferredFramework() ?? 'vue'}/components`,
          to.params.locale,
        ),
    },
    {
      path: `${localePrefix}/icons`,
      redirect: (to) =>
        redirectWithRouteLocale(`/${getPreferredFramework() ?? 'vue'}/icons`, to.params.locale),
    },
    {
      path: `${localePrefix}/components/:category/:component`,
      redirect: (to) =>
        redirectWithRouteLocale(
          `/vue/components/${to.params.category}/${to.params.component}`,
          to.params.locale,
        ),
    },
    { path: '/:pathMatch(.*)*', redirect: () => getLocalizedRoutePath('/', locale.value) },
  ],
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 88 };
    return { top: 0 };
  },
});

router.beforeEach((to) => {
  const queryLocale = typeof to.query.lang === 'string' ? to.query.lang : undefined;
  if (queryLocale === 'en' || queryLocale === 'pl') {
    setLocale(queryLocale);
    return {
      path: getLocalizedRoutePath(to.path, queryLocale),
      query: withoutLegacyLocaleQuery(to.query),
      hash: to.hash,
      replace: true,
    };
  }

  if (to.params.locale === 'pl') {
    if (locale.value !== 'pl') setLocale('pl');
    return true;
  }

  if (locale.value === 'pl') {
    return {
      path: getLocalizedRoutePath(to.path, 'pl'),
      query: to.query,
      hash: to.hash,
      replace: true,
    };
  }

  if (locale.value !== 'en') setLocale('en');
  return true;
});

router.afterEach((to) => {
  if (isFrameworkId(to.params.framework)) setPreferredFramework(to.params.framework);
});
