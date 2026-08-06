<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

import BrandMark from '../components/BrandMark.vue';
import { categories, frameworkComponents } from '../data/catalog';
import { frameworkOrder, getFrameworkDefinition } from '../data/frameworks';
import { icons } from '../data/icons';
import { getCategoryLabel } from '../data/localized-content';
import { useI18n } from '../i18n';

const { localize } = useI18n();
const copy = computed(() =>
  localize({
    en: {
      version: 'Documentation v1.27.0',
      title: 'Build clear interfaces',
      titleAccent: 'with PEAUI.',
      intro:
        'One library, three clear integration paths: Vue, React and Web Components — with practical guides, real accessibility and an API generated directly from source code.',
      getStarted: 'Get started',
      discoverWc: 'Discover Web Components',
      copyCommand: 'Copy command',
      newComponent: 'New component',
      status: 'Status',
      ready: 'Ready to use',
      checked: 'Verified API and available variants.',
      openDocs: 'Open docs',
      technologies: 'technologies',
      docsInfo: 'Documentation information',
      vueComponents: 'Vue components',
      reactComponents: 'React components',
      availableIcons: 'available icons',
      technology: 'Technology',
      chooseIntegration: 'Choose your integration',
      components: 'components',
      browseApi: 'Browse the complete API',
      showAll: 'Show all',
      categoryDescription: 'components with descriptions and variants.',
      livePreviews: 'Live previews',
      livePreviewsText: 'Change props and immediately inspect the behavior.',
      readyCode: 'Ready-to-use code',
      readyCodeText: 'Copy complete usage examples into your project.',
      realApi: 'Real API',
      realApiText: 'Input documentation is generated directly from the components.',
    },
    pl: {
      version: 'Dokumentacja v1.27.0',
      title: 'Buduj czytelne interfejsy',
      titleAccent: 'z PEAUI.',
      intro:
        'Jedna biblioteka, trzy wyraźne ścieżki integracji: Vue, React i Web Components — z instrukcjami, rzeczywistą dostępnością i API generowanym wprost z kodu źródłowego.',
      getStarted: 'Zacznij korzystać',
      discoverWc: 'Poznaj Web Components',
      copyCommand: 'Skopiuj komendę',
      newComponent: 'Nowy komponent',
      status: 'Status',
      ready: 'Gotowy do użycia',
      checked: 'Sprawdzone API i dostępne warianty.',
      openDocs: 'Otwórz docs',
      technologies: 'technologie',
      docsInfo: 'Informacje o dokumentacji',
      vueComponents: 'komponenty Vue',
      reactComponents: 'komponenty React',
      availableIcons: 'dostępnych ikon',
      technology: 'Technologia',
      chooseIntegration: 'Wybierz sposób integracji',
      components: 'komponentów',
      browseApi: 'Przeglądaj kompletne API',
      showAll: 'Pokaż wszystkie',
      categoryDescription: 'komponentów wraz z opisami i wariantami.',
      livePreviews: 'Podglądy na żywo',
      livePreviewsText: 'Zmieniaj propsy i natychmiast sprawdzaj zachowanie.',
      readyCode: 'Gotowy kod',
      readyCodeText: 'Kopiuj kompletne przykłady użycia do swojego projektu.',
      realApi: 'Rzeczywiste API',
      realApiText: 'Dokumentacja wejść powstaje bezpośrednio z komponentów.',
    },
  }),
);
const localizedCategories = computed(() =>
  categories.map((category) => ({
    ...category,
    label: getCategoryLabel(category.slug, category.label),
  })),
);
</script>

<template>
  <div class="home-page">
    <section class="home-hero">
      <div class="home-hero__glow home-hero__glow--one" />
      <div class="home-hero__glow home-hero__glow--two" />
      <div class="home-hero__content">
        <span class="hero-pill"><span /> {{ copy.version }}</span>
        <h1>
          {{ copy.title }}<br /><em>{{ copy.titleAccent }}</em>
        </h1>
        <p>{{ copy.intro }}</p>
        <div class="home-hero__actions">
          <RouterLink class="primary-link" to="/vue/start"
            >{{ copy.getStarted }} <span>→</span></RouterLink
          >
          <RouterLink class="secondary-link" to="/web-components/start">{{
            copy.discoverWc
          }}</RouterLink>
        </div>
        <div class="install-snippet">
          <span>$</span><code>npm install @peaui/ui</code
          ><button type="button" :aria-label="copy.copyCommand">⌘</button>
        </div>
      </div>
      <div class="home-hero__visual" aria-hidden="true">
        <div class="visual-orbit visual-orbit--one" />
        <div class="visual-orbit visual-orbit--two" />
        <div class="visual-card visual-card--back"><span /><span /><span /></div>
        <div class="visual-card visual-card--main">
          <div class="visual-card__top">
            <BrandMark variant="mark" /><span>{{ copy.newComponent }}</span
            ><i>•••</i>
          </div>
          <div class="visual-card__body">
            <span class="visual-label">{{ copy.status }}</span
            ><strong>{{ copy.ready }}</strong>
            <p>{{ copy.checked }}</p>
          </div>
          <div class="visual-card__footer">
            <span>Vue · React · WC</span><button>{{ copy.openDocs }}</button>
          </div>
        </div>
        <div class="floating-chip floating-chip--a">✓ WCAG</div>
        <div class="floating-chip floating-chip--b">3 {{ copy.technologies }}</div>
      </div>
    </section>

    <section class="home-stats" :aria-label="copy.docsInfo">
      <div>
        <strong>{{ frameworkComponents.vue.length }}</strong
        ><span>{{ copy.vueComponents }}</span>
      </div>
      <div>
        <strong>{{ frameworkComponents['web-components'].length }}</strong
        ><span>Web Components</span>
      </div>
      <div>
        <strong>{{ frameworkComponents.react.length }}</strong
        ><span>{{ copy.reactComponents }}</span>
      </div>
      <div>
        <strong>{{ icons.length }}</strong
        ><span>{{ copy.availableIcons }}</span>
      </div>
    </section>

    <section class="home-section">
      <div class="section-heading-row">
        <div>
          <span class="eyebrow">{{ copy.technology }}</span>
          <h2>{{ copy.chooseIntegration }}</h2>
        </div>
      </div>
      <div class="framework-card-grid">
        <RouterLink
          v-for="(frameworkId, index) in frameworkOrder"
          :key="frameworkId"
          class="framework-card"
          :to="`/${frameworkId}/start`"
        >
          <span class="framework-card__number">0{{ index + 1 }}</span>
          <span class="framework-card__badge">{{ getFrameworkDefinition(frameworkId).badge }}</span>
          <h3>{{ getFrameworkDefinition(frameworkId).label }}</h3>
          <p>{{ getFrameworkDefinition(frameworkId).description }}</p>
          <footer>
            <strong>{{ frameworkComponents[frameworkId].length }}</strong>
            <span>{{ copy.components }}</span>
            <i>{{ getFrameworkDefinition(frameworkId).availability }} →</i>
          </footer>
        </RouterLink>
      </div>
    </section>

    <section class="home-section home-section--soft">
      <div class="section-heading-row">
        <div>
          <span class="eyebrow">Vue</span>
          <h2>{{ copy.browseApi }}</h2>
        </div>
        <RouterLink to="/vue/components">{{ copy.showAll }} <span>→</span></RouterLink>
      </div>
      <div class="category-grid">
        <RouterLink
          v-for="(category, index) in localizedCategories"
          :key="category.slug"
          class="category-card"
          :to="`/vue/components/${category.slug}/${category.components[0]?.slug}`"
        >
          <span class="category-card__number">0{{ index + 1 }}</span>
          <div class="category-card__icon">{{ category.label.slice(0, 1) }}</div>
          <h3>{{ category.label }}</h3>
          <p>{{ category.components.length }} {{ copy.categoryDescription }}</p>
          <span class="category-card__arrow">↗</span>
        </RouterLink>
      </div>
    </section>

    <section class="feature-band">
      <div>
        <span class="feature-icon">⌁</span>
        <h3>{{ copy.livePreviews }}</h3>
        <p>{{ copy.livePreviewsText }}</p>
      </div>
      <div>
        <span class="feature-icon">&lt;/&gt;</span>
        <h3>{{ copy.readyCode }}</h3>
        <p>{{ copy.readyCodeText }}</p>
      </div>
      <div>
        <span class="feature-icon">◎</span>
        <h3>{{ copy.realApi }}</h3>
        <p>{{ copy.realApiText }}</p>
      </div>
    </section>
  </div>
</template>
