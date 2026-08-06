<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';

import BrandMark from './components/BrandMark.vue';
import LocaleSwitcher from './components/LocaleSwitcher.vue';
import SearchPalette from './components/SearchPalette.vue';
import ThemeToggle from './components/ThemeToggle.vue';
import { getFrameworkCategories, getFrameworkComponents } from './data/catalog';
import { frameworkOrder, getFrameworkDefinition, normalizeFramework } from './data/frameworks';
import { icons } from './data/icons';
import { getCategoryLabel } from './data/localized-content';
import { useI18n } from './i18n';

const route = useRoute();
const { t } = useI18n();
const searchOpen = ref(false);
const menuOpen = ref(false);
const framework = computed(() => normalizeFramework(route.params.framework));
const frameworkDefinition = computed(() => getFrameworkDefinition(framework.value));
const components = computed(() => getFrameworkComponents(framework.value));
const categories = computed(() => getFrameworkCategories(framework.value));
const startPath = computed(() => `/${framework.value}/start`);
const componentsPath = computed(() => `/${framework.value}/components`);
const iconsPath = computed(() => `/${framework.value}/icons`);

function handleKeydown(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === 'k') {
    event.preventDefault();
    searchOpen.value = true;
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown));
</script>

<template>
  <div class="docs-shell">
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
          class="icon-button menu-toggle"
          type="button"
          :aria-label="t('nav.openMenu')"
          @click="menuOpen = !menuOpen"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
      </div>
    </header>

    <aside class="docs-sidebar" :class="{ 'docs-sidebar--open': menuOpen }">
      <div class="sidebar-scroll">
        <div class="sidebar-framework">
          <span>{{ t('nav.technology') }}</span>
          <strong>{{ frameworkDefinition.label }}</strong>
          <small
            >{{ components.length }} {{ t('nav.componentCount') }} ·
            {{ frameworkDefinition.availability }}</small
          >
          <div class="sidebar-framework__links">
            <RouterLink
              v-for="frameworkId in frameworkOrder"
              :key="frameworkId"
              :to="`/${frameworkId}/start`"
              :class="{ active: framework === frameworkId }"
              @click="menuOpen = false"
            >
              {{ getFrameworkDefinition(frameworkId).compactLabel }}
            </RouterLink>
          </div>
        </div>

        <RouterLink class="sidebar-intro" :to="startPath" @click="menuOpen = false">
          <span class="sidebar-icon">✦</span>
          <span
            ><strong>{{ t('nav.gettingStarted') }}</strong
            ><small>{{ t('nav.installation') }}</small></span
          >
        </RouterLink>

        <RouterLink
          class="sidebar-components-link sidebar-icons-link"
          :to="iconsPath"
          @click="menuOpen = false"
        >
          {{ t('nav.iconCatalog') }} <span>{{ icons.length }}</span>
        </RouterLink>

        <RouterLink class="sidebar-components-link" :to="componentsPath" @click="menuOpen = false">
          {{ t('nav.allComponents') }} <span>{{ components.length }}</span>
        </RouterLink>

        <nav class="component-nav" :aria-label="t('nav.componentList')">
          <section v-for="category in categories" :key="category.slug">
            <h2>{{ getCategoryLabel(category.slug, category.label) }}</h2>
            <RouterLink
              v-for="component in category.components"
              :key="component.slug"
              :to="`/${framework}/components/${category.slug}/${component.slug}`"
              @click="menuOpen = false"
            >
              {{ component.name }}
            </RouterLink>
          </section>
        </nav>
      </div>
    </aside>

    <main class="docs-main" @click="menuOpen = false">
      <RouterView :key="route.fullPath" />
    </main>

    <button
      v-if="menuOpen"
      class="mobile-backdrop"
      type="button"
      :aria-label="t('nav.closeMenu')"
      @click="menuOpen = false"
    />
    <SearchPalette :open="searchOpen" :framework="framework" @close="searchOpen = false" />
  </div>
</template>
