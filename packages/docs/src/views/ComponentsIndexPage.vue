<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

import { getFrameworkCategories } from '../data/catalog';
import { getFrameworkDefinition, normalizeFramework } from '../data/frameworks';
import { getCategoryLabel, getComponentCopy } from '../data/localized-content';
import { useI18n } from '../i18n';

const route = useRoute();
const { localize } = useI18n();
const filter = ref('');
const framework = computed(() => normalizeFramework(route.params.framework));
const frameworkDefinition = computed(() => getFrameworkDefinition(framework.value));
const activeCategory = computed(() =>
  typeof route.params.category === 'string' ? route.params.category : '',
);
const categories = computed(() => {
  const localizedCategories = getFrameworkCategories(framework.value).map((category) => ({
    ...category,
    label: getCategoryLabel(category.slug, category.label),
    components: category.components.map((component) => ({
      ...component,
      copy: getComponentCopy(component.name, component.copy),
    })),
  }));

  return activeCategory.value
    ? localizedCategories.filter((category) => category.slug === activeCategory.value)
    : localizedCategories;
});
const visibleComponentCount = computed(() =>
  categories.value.reduce((total, category) => total + category.components.length, 0),
);
const copy = computed(() =>
  localize({
    en: {
      catalog: 'Catalog',
      title: 'Components',
      componentCount: 'components',
      reactTitle: 'Complete catalog of native React components',
      reactText:
        'Every entry is a standalone React component with typed props, stories, tests and interactive documentation.',
      filter: 'Filter components…',
      filterLabel: 'Filter the component catalog',
    },
    pl: {
      catalog: 'Katalog',
      title: 'Komponenty',
      componentCount: 'komponentów',
      reactTitle: 'Pełny katalog natywnych komponentów React',
      reactText:
        'Każda pozycja jest osobnym komponentem React, ma typowane propsy, historie, testy oraz interaktywną dokumentację.',
      filter: 'Filtruj komponenty…',
      filterLabel: 'Filtruj katalog komponentów',
    },
  }),
);
</script>

<template>
  <article class="article-page components-index">
    <header class="article-hero">
      <span class="eyebrow">{{ copy.catalog }} · {{ frameworkDefinition.label }}</span>
      <h1>
        {{ categories.length === 1 ? categories[0]?.label : copy.title }}
        {{ frameworkDefinition.label }}
      </h1>
      <p>
        {{ frameworkDefinition.description }} {{ visibleComponentCount }} {{ copy.componentCount }}.
      </p>
      <div v-if="framework === 'react'" class="framework-notice">
        <strong>{{ copy.reactTitle }}</strong>
        <span>{{ copy.reactText }}</span>
      </div>
      <label class="catalog-search">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m21 21-4.5-4.5m2.5-5A7.5 7.5 0 1 1 4 11.5a7.5 7.5 0 0 1 15 0Z" />
        </svg>
        <input
          v-model="filter"
          type="search"
          :placeholder="copy.filter"
          :aria-label="copy.filterLabel"
        />
      </label>
    </header>

    <section v-for="category in categories" :key="category.slug" class="catalog-section">
      <div class="catalog-section__heading">
        <h2>{{ category.label }}</h2>
        <span>{{ category.components.length }}</span>
      </div>
      <div class="component-card-grid">
        <RouterLink
          v-for="component in category.components.filter((entry) =>
            entry.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()),
          )"
          :key="component.slug"
          :to="`/${framework}/components/${component.category}/${component.slug}`"
          class="component-card"
        >
          <span class="component-card__preview">{{ component.name.slice(0, 2) }}</span>
          <span
            ><strong>{{ component.name }}</strong
            ><small>{{ component.copy.description }}</small></span
          >
          <span class="component-card__arrow">→</span>
        </RouterLink>
      </div>
    </section>
  </article>
</template>
