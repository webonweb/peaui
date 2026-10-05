<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';

import BrandMark from './components/BrandMark.vue';
import LocaleSwitcher from './components/LocaleSwitcher.vue';
import SearchPalette from './components/SearchPalette.vue';
import ThemeToggle from './components/ThemeToggle.vue';
import { getCatalogCategories, getCatalogComponents } from './data/catalog-summary';
import { frameworkOrder, getFrameworkDefinition } from './data/frameworks';
import { icons } from './data/icons';
import { getCategoryLabel } from './data/localized-content';
import { useI18n } from './i18n';
import { useRouteSeo } from './seo';
import { getPreferredFramework, isFrameworkId } from './utils/preferred-framework';

const GITHUB_URL = 'https://github.com/webonweb/peaui';
const NPM_URL = 'https://www.npmjs.com/package/@peaui/ui';
const ISSUES_URL = 'https://github.com/webonweb/peaui/issues';
const route = useRoute();
const { t } = useI18n();
const searchOpen = ref(false);
const menuOpen = ref(false);
const isMobile = ref(false);
const menuToggle = ref<HTMLButtonElement>();
const sidebar = ref<HTMLElement>();
const mainContent = ref<HTMLElement>();
const framework = computed(() => {
  if (isFrameworkId(route.params.framework)) return route.params.framework;
  return getPreferredFramework() ?? 'vue';
});
const frameworkDefinition = computed(() => getFrameworkDefinition(framework.value));
const components = computed(() => getCatalogComponents(framework.value));
const categories = computed(() => getCatalogCategories(framework.value));
const startPath = computed(() => `/${framework.value}/start`);
const componentsPath = computed(() => `/${framework.value}/components`);
const iconsPath = computed(() => `/${framework.value}/icons`);
let mobileQuery: MediaQueryList | undefined;

useRouteSeo();

function syncMobileState(event?: MediaQueryListEvent): void {
  isMobile.value = event?.matches ?? mobileQuery?.matches ?? false;
  if (!isMobile.value && menuOpen.value) closeMenu(false);
}

function getSidebarFocusables(): HTMLElement[] {
  if (!sidebar.value) return [];
  return Array.from(
    sidebar.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
}

async function openMenu(): Promise<void> {
  menuOpen.value = true;
  await nextTick();
  getSidebarFocusables()[0]?.focus();
}

async function closeMenu(restoreToggle = true): Promise<void> {
  if (!menuOpen.value) return;
  menuOpen.value = false;
  await nextTick();
  if (restoreToggle) menuToggle.value?.focus();
}

async function handleNavigationClick(): Promise<void> {
  if (!menuOpen.value) return;
  await closeMenu(false);
  mainContent.value?.focus();
}

async function toggleMenu(): Promise<void> {
  if (menuOpen.value) await closeMenu();
  else await openMenu();
}

function focusMainContent(): void {
  nextTick(() => mainContent.value?.focus());
}

function trapSidebarFocus(event: KeyboardEvent): void {
  if (!isMobile.value || !menuOpen.value || event.key !== 'Tab') return;
  const focusables = getSidebarFocusables();
  const first = focusables[0];
  const last = focusables.at(-1);
  if (!first || !last) return;

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && menuOpen.value) {
    event.preventDefault();
    void closeMenu();
    return;
  }

  if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === 'k') {
    event.preventDefault();
    searchOpen.value = true;
  }
}

watch(menuOpen, (open) => {
  document.body.classList.toggle('docs-mobile-nav-open', open && isMobile.value);
});

watch(isMobile, (mobile) => {
  document.body.classList.toggle('docs-mobile-nav-open', mobile && menuOpen.value);
});

onMounted(() => {
  mobileQuery = window.matchMedia('(max-width: 900px)');
  syncMobileState();
  mobileQuery.addEventListener('change', syncMobileState);
  window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  document.body.classList.remove('docs-mobile-nav-open');
  mobileQuery?.removeEventListener('change', syncMobileState);
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div class="docs-shell">
    <a class="skip-link" href="#main-content" @click.prevent="focusMainContent">{{
      t('nav.skip')
    }}</a>

    <header class="docs-header">
      <RouterLink class="brand" to="/" :aria-label="t('nav.homeLabel')">
        <BrandMark variant="full" />
        <span class="brand__badge">Docs</span>
      </RouterLink>

      <div class="header-navigation">
        <nav class="framework-nav" :aria-label="t('nav.chooseTechnology')">
          <RouterLink
            v-for="frameworkId in frameworkOrder"
            :key="frameworkId"
            :to="`/${frameworkId}/start`"
            :class="{ active: framework === frameworkId }"
          >
            {{ getFrameworkDefinition(frameworkId).shortLabel }}
          </RouterLink>
        </nav>
        <nav class="header-nav" :aria-label="t('nav.main')">
          <RouterLink :to="startPath">{{ t('nav.start') }}</RouterLink>
          <RouterLink :to="componentsPath">{{ t('nav.components') }}</RouterLink>
          <RouterLink :to="iconsPath">{{ t('nav.icons') }}</RouterLink>
        </nav>
      </div>

      <div class="header-actions">
        <button class="search-trigger" type="button" @click="searchOpen = true">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m21 21-4.5-4.5m2.5-5A7.5 7.5 0 1 1 4 11.5a7.5 7.5 0 0 1 15 0Z" />
          </svg>
          <span>{{ t('search.action') }}</span>
          <kbd>Ctrl K</kbd>
        </button>
        <LocaleSwitcher />
        <ThemeToggle />
        <button
          ref="menuToggle"
          class="icon-button menu-toggle"
          type="button"
          :aria-label="menuOpen ? t('nav.closeMenu') : t('nav.openMenu')"
          :aria-expanded="menuOpen"
          aria-controls="documentation-sidebar"
          @click="toggleMenu"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path v-if="!menuOpen" d="M4 7h16M4 12h16M4 17h16" />
            <path v-else d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
    </header>

    <aside
      id="documentation-sidebar"
      ref="sidebar"
      class="docs-sidebar"
      :class="{ 'docs-sidebar--open': menuOpen }"
      :aria-hidden="isMobile && !menuOpen ? 'true' : undefined"
      :inert="isMobile && !menuOpen"
      @keydown="trapSidebarFocus"
    >
      <div class="sidebar-scroll">
        <div class="sidebar-framework">
          <span>{{ t('nav.technology') }}</span>
          <strong>{{ frameworkDefinition.label }}</strong>
          <small>
            {{ components.length }} {{ t('nav.componentCount') }} ·
            {{ frameworkDefinition.availability }}
          </small>
          <div class="sidebar-framework__links">
            <RouterLink
              v-for="frameworkId in frameworkOrder"
              :key="frameworkId"
              :to="`/${frameworkId}/start`"
              :class="{ active: framework === frameworkId }"
              @click="handleNavigationClick"
            >
              {{ getFrameworkDefinition(frameworkId).compactLabel }}
            </RouterLink>
          </div>
        </div>

        <RouterLink class="sidebar-intro" :to="startPath" @click="handleNavigationClick">
          <span class="sidebar-icon" aria-hidden="true">✦</span>
          <span>
            <strong>{{ t('nav.gettingStarted') }}</strong>
            <small>{{ t('nav.installation') }}</small>
          </span>
        </RouterLink>

        <RouterLink
          class="sidebar-components-link sidebar-icons-link"
          :to="iconsPath"
          @click="handleNavigationClick"
        >
          {{ t('nav.iconCatalog') }} <span>{{ icons.length }}</span>
        </RouterLink>

        <RouterLink
          class="sidebar-components-link"
          :to="componentsPath"
          @click="handleNavigationClick"
        >
          {{ t('nav.allComponents') }} <span>{{ components.length }}</span>
        </RouterLink>

        <nav class="component-nav" :aria-label="t('nav.componentList')">
          <section v-for="category in categories" :key="category.slug">
            <h2>{{ getCategoryLabel(category.slug, category.label) }}</h2>
            <RouterLink
              v-for="component in category.components"
              :key="component.slug"
              :to="`/${framework}/components/${category.slug}/${component.slug}`"
              @click="handleNavigationClick"
            >
              {{ component.name }}
            </RouterLink>
          </section>
        </nav>
      </div>
    </aside>

    <main id="main-content" ref="mainContent" class="docs-main" tabindex="-1">
      <RouterView :key="route.fullPath" />
      <footer class="docs-footer">
        <BrandMark variant="mark" />
        <nav :aria-label="t('footer.navigation')">
          <RouterLink :to="componentsPath">{{ t('footer.documentation') }}</RouterLink>
          <a
            :href="GITHUB_URL"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="t('footer.externalLabel', { name: 'GitHub' })"
            >GitHub</a
          >
          <a
            :href="NPM_URL"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="t('footer.externalLabel', { name: 'npm' })"
            >npm</a
          >
          <a
            :href="ISSUES_URL"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="t('footer.externalLabel', { name: t('footer.issues') })"
            >{{ t('footer.issues') }}</a
          >
          <a
            :href="`${GITHUB_URL}/blob/main/LICENSE`"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="t('footer.externalLabel', { name: t('footer.license') })"
            >{{ t('footer.license') }}</a
          >
        </nav>
      </footer>
    </main>

    <button
      v-if="menuOpen"
      class="mobile-backdrop"
      type="button"
      :aria-label="t('nav.closeMenu')"
      @click="closeMenu()"
    />
    <SearchPalette :open="searchOpen" :framework="framework" @close="searchOpen = false" />
  </div>
</template>
