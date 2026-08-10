<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import CodeBlock from '../components/CodeBlock.vue';
import { iconCategories, icons } from '../data/icons';
import { getFrameworkDefinition, normalizeFramework } from '../data/frameworks';
import { getIcon, getIconCategory } from '../data/localized-content';
import { useI18n } from '../i18n';

const route = useRoute();
const { locale, localize } = useI18n();
const framework = computed(() => normalizeFramework(route.params.framework));
const frameworkDefinition = computed(() => getFrameworkDefinition(framework.value));
const filter = ref(typeof route.query.search === 'string' ? route.query.search : '');
const copiedIcon = ref('');
const catalogResults = ref<HTMLElement>();
const ICONS_PER_PAGE = 96;
const initialCategory =
  typeof route.query.category === 'string' &&
  iconCategories.some((category) => category.id === route.query.category)
    ? route.query.category
    : 'all';
const activeCategory = ref(initialCategory);
const currentPage = ref(1);
let copyResetTimer: ReturnType<typeof setTimeout> | undefined;

const vueUsageCode = computed(
  () => `<script setup lang="ts">
import SvgIcon from '@peaui/ui/vue/basic/SvgIcon';
<\/script>

<template>
  <button type="button" aria-label="${localize({ en: 'Save', pl: 'Zapisz' })}">
    <SvgIcon name="core/check-circle" />
  </button>
</template>`,
);

const reactUsageCode = `import SvgIcon from '@peaui/ui/react/basic/SvgIcon';

export function ConfirmIcon() {
  return <SvgIcon name="core/check-circle" aria-hidden="true" />;
}`;

const webComponentUsageCode = computed(
  () => `import '@peaui/ui/wc/basic/SvgIcon';

document.body.innerHTML = \`
  <button type="button" aria-label="${localize({ en: 'Save', pl: 'Zapisz' })}">
    <peaui-svg-icon name="core/check-circle"></peaui-svg-icon>
  </button>
\`;`,
);

const usageCode = computed(() => {
  if (framework.value === 'react') return reactUsageCode;
  if (framework.value === 'web-components') return webComponentUsageCode.value;
  return vueUsageCode.value;
});

const usageLanguage = computed(() => {
  if (framework.value === 'react') return 'tsx';
  if (framework.value === 'web-components') return 'ts';
  return 'vue';
});

const localizedIcons = computed(() => icons.map(getIcon));
const normalizedFilter = computed(() => filter.value.trim().toLocaleLowerCase(locale.value));

const searchResults = computed(() => {
  if (!normalizedFilter.value) return localizedIcons.value;

  return localizedIcons.value.filter((icon) =>
    [icon.name, icon.label, icon.description, ...icon.keywords]
      .join(' ')
      .toLocaleLowerCase(locale.value)
      .includes(normalizedFilter.value),
  );
});

const categories = computed(() =>
  iconCategories.map(getIconCategory).map((category) => ({
    ...category,
    total: searchResults.value.filter((icon) => icon.category === category.id).length,
  })),
);

const categoryResults = computed(() =>
  activeCategory.value === 'all'
    ? searchResults.value
    : searchResults.value.filter((icon) => icon.category === activeCategory.value),
);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(categoryResults.value.length / ICONS_PER_PAGE)),
);
const pageStart = computed(() => (currentPage.value - 1) * ICONS_PER_PAGE);
const rangeStart = computed(() => (categoryResults.value.length > 0 ? pageStart.value + 1 : 0));
const pageEnd = computed(() =>
  Math.min(pageStart.value + ICONS_PER_PAGE, categoryResults.value.length),
);
const displayedIcons = computed(() => categoryResults.value.slice(pageStart.value, pageEnd.value));

const activeCategoryDefinition = computed(() =>
  activeCategory.value === 'all'
    ? undefined
    : categories.value.find((category) => category.id === activeCategory.value),
);

type PaginationItem = number | 'ellipsis-start' | 'ellipsis-end';

const paginationItems = computed<PaginationItem[]>(() => {
  const total = totalPages.value;

  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);

  const pages = new Set<number>([
    1,
    total,
    currentPage.value - 1,
    currentPage.value,
    currentPage.value + 1,
  ]);

  if (currentPage.value <= 4) [2, 3, 4, 5].forEach((page) => pages.add(page));
  if (currentPage.value >= total - 3) {
    [total - 4, total - 3, total - 2, total - 1].forEach((page) => pages.add(page));
  }

  const sortedPages = [...pages].filter((page) => page > 0 && page <= total).sort((a, b) => a - b);
  const items: PaginationItem[] = [];

  sortedPages.forEach((page, index) => {
    const previousPage = sortedPages[index - 1];

    if (previousPage !== undefined && page - previousPage > 1) {
      items.push(index === 1 ? 'ellipsis-start' : 'ellipsis-end');
    }

    items.push(page);
  });

  return items;
});

watch([normalizedFilter, activeCategory], () => {
  currentPage.value = 1;
});

watch(totalPages, (pages) => {
  if (currentPage.value > pages) currentPage.value = pages;
});

const groupedIcons = computed(() =>
  categories.value
    .map((category) => ({
      ...category,
      icons: displayedIcons.value.filter((icon) => icon.category === category.id),
    }))
    .filter((category) => category.icons.length > 0),
);

async function selectCategory(category: string) {
  activeCategory.value = category;
  await scrollToCatalogStart();
}

async function goToPage(page: number) {
  const nextPage = Math.min(Math.max(page, 1), totalPages.value);

  if (nextPage === currentPage.value) return;

  currentPage.value = nextPage;
  await scrollToCatalogStart();
}

async function scrollToCatalogStart() {
  await nextTick();
  catalogResults.value?.scrollIntoView({ block: 'start' });
}
const copy = computed(() =>
  localize({
    en: {
      resources: 'Resources',
      title: 'PEAUI icons',
      source:
        'The catalog contains the supplied PeaUI Outline Icons Mega 0.3.0 assets, uses category/icon-name paths and loads icons on demand in small bundles.',
      showing: 'shown',
      intro: `The complete set of ${icons.length} PeaUI outline icons. Every entry contains a real preview, the name passed to the component and a usage description.`,
      summary: 'Icon catalog summary',
      available: 'available icons',
      vector: 'vector format',
      inherited: 'inherited color',
      search: 'Search by name or purpose…',
      filter: 'Filter icons',
      usage: 'Usage',
      usageTitle: 'Using an icon in',
      reactNote:
        'The native SvgIcon component exposes the same icon names and currentColor inheritance in React as in Vue.',
      name: 'Name',
      nameText:
        'Pass the exact value displayed under an icon to the name property. Names are case-sensitive.',
      sizeColor: 'Size and color',
      sizeColorText:
        'Icons inherit currentColor. Set their size with width and height; the default is 1 rem.',
      accessibility: 'Accessibility',
      accessibilityText:
        'Decorative icons are hidden from screen readers by default. An icon-only button needs its own aria-label.',
      catalog: 'Catalog',
      all: 'All icons',
      categories: 'Icon categories',
      categoryFilter: 'Filter the catalog by category',
      orderNote: 'Icons are ordered alphabetically inside the selected category.',
      range: 'Showing',
      of: 'of',
      page: 'Page',
      pagination: 'Icon catalog pages',
      previousPage: 'Previous page',
      nextPage: 'Next page',
      searchAllCategories: 'Search all categories',
      results: 'results',
      empty: 'No icon found',
      emptyText: 'Try searching by name, function or English description.',
      copyName: 'Copy icon name',
    },
    pl: {
      resources: 'Zasoby',
      title: 'Ikony PEAUI',
      source:
        'Katalog zawiera dostarczone zasoby PeaUI Outline Icons Mega 0.3.0, używa nazw kategoria/nazwa-ikony i ładuje ikony na żądanie w małych paczkach.',
      showing: 'widocznych',
      intro: `Pełny zestaw ${icons.length} ikon outline PEAUI. Każda pozycja zawiera rzeczywisty podgląd, nazwę przekazywaną do komponentu i opis zastosowania.`,
      summary: 'Podsumowanie katalogu ikon',
      available: 'dostępnych ikon',
      vector: 'format wektorowy',
      inherited: 'dziedziczony kolor',
      search: 'Szukaj po nazwie lub zastosowaniu…',
      filter: 'Filtruj ikony',
      usage: 'Użycie',
      usageTitle: 'Jak użyć ikony w',
      reactNote:
        'Natywny komponent SvgIcon udostępnia w React ten sam katalog nazw i dziedziczenie koloru przez currentColor co implementacja Vue.',
      name: 'Nazwa',
      nameText:
        'Przekaż dokładną wartość widoczną pod ikoną do właściwości name. Wielkość liter ma znaczenie.',
      sizeColor: 'Rozmiar i kolor',
      sizeColorText:
        'Ikony dziedziczą currentColor. Rozmiar ustaw przez width i height; domyślnie wynosi 1 rem.',
      accessibility: 'Dostępność',
      accessibilityText:
        'Ikony dekoracyjne są domyślnie ukryte przed czytnikiem ekranu. Przycisk z samą ikoną musi mieć własne aria-label.',
      catalog: 'Katalog',
      all: 'Wszystkie ikony',
      categories: 'Kategorie ikon',
      categoryFilter: 'Filtruj katalog według kategorii',
      orderNote: 'Ikony są ułożone alfabetycznie w obrębie wybranej kategorii.',
      range: 'Wyświetlane',
      of: 'z',
      page: 'Strona',
      pagination: 'Strony katalogu ikon',
      previousPage: 'Poprzednia strona',
      nextPage: 'Następna strona',
      searchAllCategories: 'Szukaj we wszystkich kategoriach',
      results: 'wyników',
      empty: 'Nie znaleziono ikony',
      emptyText: 'Spróbuj wyszukać po nazwie, funkcji albo polskim opisie.',
      copyName: 'Skopiuj nazwę ikony',
    },
  }),
);

async function copyName(name: string) {
  if (!navigator.clipboard) return;

  await navigator.clipboard.writeText(name);
  copiedIcon.value = name;

  if (copyResetTimer) clearTimeout(copyResetTimer);
  copyResetTimer = setTimeout(() => {
    copiedIcon.value = '';
  }, 1800);
}

onBeforeUnmount(() => {
  if (copyResetTimer) clearTimeout(copyResetTimer);
});
</script>

<template>
  <article class="article-page icons-page">
    <header class="article-hero icons-hero">
      <span class="eyebrow">{{ copy.resources }} · {{ frameworkDefinition.label }}</span>
      <h1>{{ copy.title }}</h1>
      <p>{{ copy.intro }}</p>
      <p class="icon-source-note">{{ copy.source }}</p>

      <div class="icon-catalog-summary" :aria-label="copy.summary">
        <div>
          <strong>{{ icons.length }}</strong
          ><span>{{ copy.available }}</span>
        </div>
        <div>
          <strong>SVG</strong><span>{{ copy.vector }}</span>
        </div>
        <div>
          <strong>currentColor</strong><span>{{ copy.inherited }}</span>
        </div>
      </div>

      <label class="catalog-search icons-search">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m21 21-4.5-4.5m2.5-5A7.5 7.5 0 1 1 4 11.5a7.5 7.5 0 0 1 15 0Z" />
        </svg>
        <input
          v-model="filter"
          type="search"
          :placeholder="copy.search"
          :aria-label="copy.filter"
        />
        <span>{{ searchResults.length }}/{{ icons.length }}</span>
      </label>
    </header>

    <section class="icon-usage-section">
      <div class="section-heading-row">
        <div>
          <span class="eyebrow">{{ copy.usage }}</span>
          <h2>{{ copy.usageTitle }} {{ frameworkDefinition.label }}</h2>
        </div>
      </div>

      <p v-if="framework === 'react'" class="icon-framework-note">
        {{ copy.reactNote }}
      </p>
      <CodeBlock :code="usageCode" :language="usageLanguage" />

      <div class="icon-guidance-grid">
        <article>
          <strong>{{ copy.name }}</strong>
          <p>{{ copy.nameText }}</p>
        </article>
        <article>
          <strong>{{ copy.sizeColor }}</strong>
          <p>{{ copy.sizeColorText }}</p>
        </article>
        <article>
          <strong>{{ copy.accessibility }}</strong>
          <p>{{ copy.accessibilityText }}</p>
        </article>
      </div>
    </section>

    <section ref="catalogResults" class="icon-catalog-section">
      <p class="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {{ rangeStart }}–{{ pageEnd }} {{ copy.of }} {{ categoryResults.length }}
        {{ copy.results }}. {{ copy.page }} {{ currentPage }} {{ copy.of }} {{ totalPages }}.
      </p>
      <div class="section-heading-row">
        <div>
          <span class="eyebrow">{{ copy.catalog }}</span>
          <h2>{{ activeCategoryDefinition?.label ?? copy.all }}</h2>
        </div>
        <span>{{ categoryResults.length }} {{ copy.results }}</span>
      </div>

      <nav class="icon-category-filter" :aria-label="copy.categoryFilter">
        <button
          type="button"
          :class="{ 'icon-category-filter__button--active': activeCategory === 'all' }"
          :aria-pressed="activeCategory === 'all'"
          aria-controls="icon-catalog-results"
          @click="selectCategory('all')"
        >
          <span>{{ copy.all }}</span>
          <strong>{{ searchResults.length }}</strong>
        </button>
        <button
          v-for="category in categories"
          :key="category.id"
          type="button"
          :class="{ 'icon-category-filter__button--active': activeCategory === category.id }"
          :aria-pressed="activeCategory === category.id"
          aria-controls="icon-catalog-results"
          @click="selectCategory(category.id)"
        >
          <span>{{ category.label }}</span>
          <strong>{{ category.total }}</strong>
        </button>
      </nav>

      <div class="icon-catalog-toolbar">
        <div>
          <strong v-if="categoryResults.length > 0">
            {{ copy.range }} {{ rangeStart }}–{{ pageEnd }} {{ copy.of }}
            {{ categoryResults.length }}
          </strong>
          <span>{{ copy.orderNote }}</span>
        </div>

        <nav v-if="totalPages > 1" class="icon-pagination" :aria-label="copy.pagination">
          <button
            type="button"
            :disabled="currentPage === 1"
            :aria-label="copy.previousPage"
            @click="goToPage(currentPage - 1)"
          >
            <span aria-hidden="true">←</span>
          </button>
          <span class="icon-pagination__mobile-status">
            {{ copy.page }} {{ currentPage }} / {{ totalPages }}
          </span>
          <template v-for="item in paginationItems" :key="item">
            <span
              v-if="typeof item !== 'number'"
              class="icon-pagination__ellipsis"
              aria-hidden="true"
            >
              …
            </span>
            <button
              v-else
              type="button"
              class="icon-pagination__page"
              :class="{ 'icon-pagination__page--active': currentPage === item }"
              :aria-current="currentPage === item ? 'page' : undefined"
              :aria-label="`${copy.page} ${item}`"
              @click="goToPage(item)"
            >
              {{ item }}
            </button>
          </template>
          <button
            type="button"
            :disabled="currentPage === totalPages"
            :aria-label="copy.nextPage"
            @click="goToPage(currentPage + 1)"
          >
            <span aria-hidden="true">→</span>
          </button>
        </nav>
      </div>

      <div id="icon-catalog-results">
        <div v-if="groupedIcons.length === 0" class="icon-empty-state">
          <strong>{{ copy.empty }}</strong>
          <span>{{ copy.emptyText }}</span>
          <button v-if="activeCategory !== 'all'" type="button" @click="selectCategory('all')">
            {{ copy.searchAllCategories }}
          </button>
        </div>

        <section v-for="category in groupedIcons" :key="category.id" class="icon-category">
          <header>
            <div>
              <h3>{{ category.label }}</h3>
              <p>{{ category.description }}</p>
            </div>
            <span>{{ category.total }}</span>
          </header>

          <div class="icon-grid">
            <button
              v-for="icon in category.icons"
              :key="icon.name"
              type="button"
              class="icon-card"
              :aria-label="`${copy.copyName} ${icon.name}`"
              @click="copyName(icon.name)"
            >
              <span class="icon-card__preview">
                <SvgIcon
                  :name="icon.name"
                  class="peaui-svg-icon"
                  aria-hidden="true"
                  focusable="false"
                />
              </span>
              <span class="icon-card__content">
                <strong>{{ icon.label }}</strong>
                <code>{{ icon.name }}</code>
                <small>{{ icon.description }}</small>
              </span>
              <span
                class="icon-card__copy"
                :class="{ 'icon-card__copy--done': copiedIcon === icon.name }"
              >
                {{
                  copiedIcon === icon.name
                    ? localize({ en: 'Copied', pl: 'Skopiowano' })
                    : copy.copyName
                }}
              </span>
            </button>
          </div>
        </section>
      </div>

      <nav
        v-if="totalPages > 1"
        class="icon-pagination icon-pagination--footer"
        :aria-label="copy.pagination"
      >
        <button
          type="button"
          :disabled="currentPage === 1"
          :aria-label="copy.previousPage"
          @click="goToPage(currentPage - 1)"
        >
          <span aria-hidden="true">←</span>
        </button>
        <span class="icon-pagination__mobile-status">
          {{ copy.page }} {{ currentPage }} / {{ totalPages }}
        </span>
        <template v-for="item in paginationItems" :key="item">
          <span
            v-if="typeof item !== 'number'"
            class="icon-pagination__ellipsis"
            aria-hidden="true"
          >
            …
          </span>
          <button
            v-else
            type="button"
            class="icon-pagination__page"
            :class="{ 'icon-pagination__page--active': currentPage === item }"
            :aria-current="currentPage === item ? 'page' : undefined"
            :aria-label="`${copy.page} ${item}`"
            @click="goToPage(item)"
          >
            {{ item }}
          </button>
        </template>
        <button
          type="button"
          :disabled="currentPage === totalPages"
          :aria-label="copy.nextPage"
          @click="goToPage(currentPage + 1)"
        >
          <span aria-hidden="true">→</span>
        </button>
      </nav>
    </section>
  </article>
</template>
