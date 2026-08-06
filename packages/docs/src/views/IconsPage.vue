<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { useRoute } from 'vue-router';

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
let copyResetTimer: ReturnType<typeof setTimeout> | undefined;

const vueUsageCode = computed(
  () => `<script setup lang="ts">
import { SvgIcon } from '@peaui/ui';
import '@peaui/ui/styles.css';
<\/script>

<template>
  <button type="button" aria-label="${localize({ en: 'Save', pl: 'Zapisz' })}">
    <SvgIcon name="checkCircle" />
  </button>
</template>`,
);

const reactUsageCode = `import SvgIcon from '@peaui/ui/react/basic/SvgIcon';
import '@peaui/ui/styles.css';

export function ConfirmIcon() {
  return <SvgIcon name="checkCircle" aria-hidden="true" />;
}`;

const webComponentUsageCode = computed(
  () => `import '@peaui/ui/styles.css';
import '@peaui/ui/wc/basic/SvgIcon';

document.body.innerHTML = \`
  <button type="button" aria-label="${localize({ en: 'Save', pl: 'Zapisz' })}">
    <peaui-svg-icon name="checkCircle"></peaui-svg-icon>
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

const visibleIcons = computed(() => {
  if (!normalizedFilter.value) return localizedIcons.value;

  return localizedIcons.value.filter((icon) =>
    [icon.name, icon.label, icon.description, ...icon.keywords]
      .join(' ')
      .toLocaleLowerCase(locale.value)
      .includes(normalizedFilter.value),
  );
});

const groupedIcons = computed(() =>
  iconCategories
    .map(getIconCategory)
    .map((category) => ({
      ...category,
      icons: visibleIcons.value.filter((icon) => icon.category === category.id),
    }))
    .filter((category) => category.icons.length > 0),
);
const copy = computed(() =>
  localize({
    en: {
      resources: 'Resources',
      title: 'PEAUI icons',
      intro:
        'The complete icon catalog included with the library. Every entry contains a real preview, the name passed to the component and a usage description.',
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
      results: 'results',
      empty: 'No icon found',
      emptyText: 'Try searching by name, function or English description.',
      copyName: 'Copy icon name',
    },
    pl: {
      resources: 'Zasoby',
      title: 'Ikony PEAUI',
      intro:
        'Pełny katalog ikon dostępnych w bibliotece. Każda pozycja zawiera rzeczywisty podgląd, nazwę przekazywaną do komponentu i opis zastosowania.',
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
        <span>{{ visibleIcons.length }}/{{ icons.length }}</span>
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

    <section class="icon-catalog-section" aria-live="polite">
      <div class="section-heading-row">
        <div>
          <span class="eyebrow">{{ copy.catalog }}</span>
          <h2>{{ copy.all }}</h2>
        </div>
        <span>{{ visibleIcons.length }} {{ copy.results }}</span>
      </div>

      <div v-if="groupedIcons.length === 0" class="icon-empty-state">
        <strong>{{ copy.empty }}</strong>
        <span>{{ copy.emptyText }}</span>
      </div>

      <section v-for="category in groupedIcons" :key="category.id" class="icon-category">
        <header>
          <div>
            <h3>{{ category.label }}</h3>
            <p>{{ category.description }}</p>
          </div>
          <span>{{ category.icons.length }}</span>
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
              <component
                :is="icon.component"
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
    </section>
  </article>
</template>
