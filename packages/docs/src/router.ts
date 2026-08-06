import { createRouter, createWebHashHistory } from 'vue-router';

import ComponentPage from './views/ComponentPage.vue';
import ComponentsIndexPage from './views/ComponentsIndexPage.vue';
import GettingStartedPage from './views/GettingStartedPage.vue';
import HomePage from './views/HomePage.vue';
import IconsPage from './views/IconsPage.vue';

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    {
      path: '/:framework(vue|react|web-components)/start',
      name: 'start',
      component: GettingStartedPage,
    },
    {
      path: '/:framework(vue|react|web-components)/components',
      name: 'components',
      component: ComponentsIndexPage,
    },
    {
      path: '/:framework(vue|react|web-components)/icons',
      name: 'icons',
      component: IconsPage,
    },
    {
      path: '/:framework(vue|react|web-components)/components/:category/:component',
      name: 'component',
      component: ComponentPage,
    },
    { path: '/start', redirect: '/vue/start' },
    { path: '/components', redirect: '/vue/components' },
    { path: '/icons', redirect: '/vue/icons' },
    {
      path: '/components/:category/:component',
      redirect: (to) => `/vue/components/${to.params.category}/${to.params.component}`,
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 88 };
    return { top: 0 };
  },
});
