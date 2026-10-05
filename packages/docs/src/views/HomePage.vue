<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';

import HomeComponentPreview from '../components/HomeComponentPreview.vue';
import InstallCommand from '../components/InstallCommand.vue';
import { getCatalogComponents } from '../data/catalog-summary';
import { frameworkOrder, getFrameworkDefinition } from '../data/frameworks';
import { icons } from '../data/icons';
import { getCategoryLabel, getComponentCopy } from '../data/localized-content';
import { useI18n } from '../i18n';
import type { ComponentCatalogDefinition, FrameworkId } from '../types';
import { getPreferredFramework, setPreferredFramework } from '../utils/preferred-framework';

const GITHUB_URL = 'https://github.com/webonweb/peaui';
const NPM_URL = 'https://www.npmjs.com/package/@peaui/ui';
const FEATURED_COMPONENT_NAMES = [
  'TableList',
  'TreeList',
  'FormDatePicker',
  'CardCarousel',
  'FormFileUpload',
  'NavigationStepper',
] as const;

const { t } = useI18n();
const libraryVersion = __PEAUI_VERSION__;
const selectedFramework = ref<FrameworkId | null>(getPreferredFramework());
const documentationFramework = computed(() => selectedFramework.value ?? 'vue');
const browseTarget = computed(() =>
  selectedFramework.value
    ? `/${selectedFramework.value}/components`
    : { path: '/', hash: '#frameworks' },
);
const startTarget = computed(() =>
  selectedFramework.value
    ? `/${selectedFramework.value}/start`
    : { path: '/', hash: '#frameworks' },
);
const featuredComponents = computed(() =>
  FEATURED_COMPONENT_NAMES.map((name) =>
    getCatalogComponents(documentationFramework.value).find((component) => component.name === name),
  )
    .filter((component): component is ComponentCatalogDefinition => Boolean(component))
    .map((component) => ({
      ...component,
      categoryLabel: getCategoryLabel(component.category, component.categoryLabel),
      localizedCopy: getComponentCopy(component.name, component.copy),
    })),
);
const trustFeatures = computed(() => [
  t('home.trustMit'),
  t('home.trustTypescript'),
  t('home.trustTreeShaking'),
  t('home.trustDarkMode'),
  t('home.trustKeyboard'),
  t('home.trustFrameworks'),
]);

function chooseFramework(framework: FrameworkId): void {
  selectedFramework.value = framework;
  setPreferredFramework(framework);
}
</script>

<template>
  <div class="home-page">
    <section class="home-hero" aria-labelledby="home-title">
      <div class="home-hero__glow home-hero__glow--one" aria-hidden="true" />
      <div class="home-hero__glow home-hero__glow--two" aria-hidden="true" />
      <div class="home-hero__content">
        <span class="hero-pill">
          <span aria-hidden="true" /> {{ t('home.version', { version: libraryVersion }) }}
        </span>
        <h1 id="home-title">{{ t('home.title') }}</h1>
        <p>{{ t('home.intro') }}</p>

        <div class="hero-framework-choice">
          <span>{{ t('home.frameworkChoice') }}</span>
          <div role="group" :aria-label="t('home.frameworkChoice')">
            <button
              v-for="frameworkId in frameworkOrder"
              :key="frameworkId"
              type="button"
              :aria-pressed="selectedFramework === frameworkId"
              @click="chooseFramework(frameworkId)"
            >
              {{ getFrameworkDefinition(frameworkId).compactLabel }}
            </button>
          </div>
          <small>
            {{
              selectedFramework
                ? t('home.frameworkSelected', {
                    framework: getFrameworkDefinition(selectedFramework).label,
                  })
                : t('home.frameworkChoiceHint')
            }}
          </small>
        </div>

        <div class="home-hero__actions">
          <RouterLink class="primary-link" :to="browseTarget">
            {{ t('home.browseComponents') }} <span aria-hidden="true">→</span>
          </RouterLink>
          <RouterLink class="secondary-link" :to="startTarget">
            {{ t('home.getStarted') }}
          </RouterLink>
          <a
            class="secondary-link"
            :href="GITHUB_URL"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="t('home.githubLabel')"
          >
            {{ t('home.github') }} <span aria-hidden="true">↗</span>
          </a>
          <a
            class="secondary-link"
            :href="NPM_URL"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="t('home.npmLabel')"
          >
            {{ t('home.npm') }} <span aria-hidden="true">↗</span>
          </a>
        </div>

        <InstallCommand :framework="selectedFramework" />
      </div>

      <div class="home-hero__preview">
        <HomeComponentPreview />
      </div>
    </section>

    <section class="home-stats" :aria-label="t('home.docsInfo')">
      <div>
        <strong>{{ getCatalogComponents('vue').length }}</strong>
        <span>{{ t('home.vueComponents') }}</span>
      </div>
      <div>
        <strong>{{ getCatalogComponents('react').length }}</strong>
        <span>{{ t('home.reactComponents') }}</span>
      </div>
      <div>
        <strong>{{ getCatalogComponents('web-components').length }}</strong>
        <span>{{ t('home.webComponents') }}</span>
      </div>
      <div>
        <strong>{{ icons.length }}</strong>
        <span>{{ t('home.availableIcons') }}</span>
      </div>
    </section>

    <section id="frameworks" class="home-section" aria-labelledby="frameworks-title">
      <div class="section-heading-row">
        <div>
          <span class="eyebrow">{{ t('home.integrationEyebrow') }}</span>
          <h2 id="frameworks-title">{{ t('home.integrationTitle') }}</h2>
          <p>{{ t('home.integrationDescription') }}</p>
        </div>
      </div>
      <div class="framework-card-grid">
        <article
          v-for="(frameworkId, index) in frameworkOrder"
          :key="frameworkId"
          class="framework-card"
        >
          <span class="framework-card__number" aria-hidden="true">0{{ index + 1 }}</span>
          <span class="framework-card__badge">{{ getFrameworkDefinition(frameworkId).badge }}</span>
          <h3>{{ getFrameworkDefinition(frameworkId).label }}</h3>
          <p>{{ getFrameworkDefinition(frameworkId).description }}</p>
          <footer>
            <span>
              <strong>{{ getCatalogComponents(frameworkId).length }}</strong>
              {{ t('home.components') }}
            </span>
            <RouterLink :to="`/${frameworkId}/start`" @click="chooseFramework(frameworkId)">
              {{
                t('home.integrationLink', { framework: getFrameworkDefinition(frameworkId).label })
              }}
              <span aria-hidden="true">→</span>
            </RouterLink>
          </footer>
        </article>
      </div>
    </section>

    <section class="home-section home-section--soft" aria-labelledby="featured-title">
      <div class="section-heading-row">
        <div>
          <span class="eyebrow">{{ t('home.featuredEyebrow') }}</span>
          <h2 id="featured-title">{{ t('home.featuredTitle') }}</h2>
          <p>{{ t('home.featuredDescription') }}</p>
        </div>
        <RouterLink :to="`/${documentationFramework}/components`">
          {{ t('home.showAll') }} <span aria-hidden="true">→</span>
        </RouterLink>
      </div>

      <div class="featured-component-grid">
        <RouterLink
          v-for="component in featuredComponents"
          :key="component.name"
          class="featured-component-card"
          :to="`/${documentationFramework}/components/${component.category}/${component.slug}`"
          :aria-label="t('home.featuredLink', { component: component.name })"
        >
          <span class="featured-component-card__preview" aria-hidden="true">
            {{ component.name.slice(0, 2) }}
          </span>
          <span class="featured-component-card__category">{{ component.categoryLabel }}</span>
          <h3>{{ component.name }}</h3>
          <p>{{ component.localizedCopy.description }}</p>
          <span class="featured-component-card__link">
            {{
              t('home.integrationLink', {
                framework: getFrameworkDefinition(documentationFramework).label,
              })
            }}
            <span aria-hidden="true">→</span>
          </span>
        </RouterLink>
      </div>
    </section>

    <section class="home-section home-trust" aria-labelledby="trust-title">
      <div class="section-heading-row">
        <div>
          <span class="eyebrow">{{ t('home.trustEyebrow') }}</span>
          <h2 id="trust-title">{{ t('home.trustTitle') }}</h2>
          <p>{{ t('home.trustDescription') }}</p>
        </div>
      </div>
      <ul class="trust-list">
        <li v-for="feature in trustFeatures" :key="feature">
          <span aria-hidden="true">✓</span>{{ feature }}
        </li>
      </ul>
    </section>

    <section class="home-final-cta" aria-labelledby="final-cta-title">
      <div>
        <h2 id="final-cta-title">{{ t('home.finalTitle') }}</h2>
        <p>{{ t('home.finalDescription') }}</p>
      </div>
      <div class="home-final-cta__actions">
        <RouterLink class="primary-link" :to="browseTarget">{{
          t('home.browseComponents')
        }}</RouterLink>
        <a
          class="secondary-link"
          :href="GITHUB_URL"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="t('home.githubLabel')"
          >{{ t('home.finalGithub') }}</a
        >
        <a
          class="secondary-link"
          :href="NPM_URL"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="t('home.npmLabel')"
          >{{ t('home.finalNpm') }}</a
        >
      </div>
    </section>
  </div>
</template>
