<script setup lang="ts">
import { computed } from 'vue';

import { useI18n } from '../i18n';

const props = withDefaults(
  defineProps<{
    backLabel?: string;
    completeLabel?: string;
    nextLabel?: string;
    skipLabel?: string;
  }>(),
  {
    backLabel: 'Back',
    completeLabel: 'Complete',
    nextLabel: 'Next',
    skipLabel: 'Skip tour',
  },
);
const emit = defineEmits<{
  labelChange: [name: 'back' | 'complete' | 'next' | 'skip', value: string];
  start: [];
}>();
const { localize } = useI18n();

const copy = computed(() =>
  localize({
    en: {
      ariaLabel: 'Interactive GuidedTour example',
      eyebrow: 'Interactive workspace',
      title: 'Project Atlas',
      description: 'Start the tour to see how spotlight mode explains an application interface.',
      start: 'Start guided tour',
      labelsAriaLabel: 'Tour action labels',
      backLabel: 'Back button text',
      completeLabel: 'Complete button text',
      nextLabel: 'Next button text',
      skipLabel: 'Skip button text',
      navigation: 'Workspace navigation',
      overview: 'Overview',
      tasks: 'Tasks',
      reports: 'Reports',
      searchLabel: 'Search the workspace',
      searchPlaceholder: 'Search projects, reports and people',
      profile: 'Open Anna Kowalska profile',
      profileName: 'Anna Kowalska',
      profileRole: 'Project owner',
      summary: 'Weekly progress',
      metric: '12 tasks completed',
    },
    pl: {
      ariaLabel: 'Interaktywny przykład GuidedTour',
      eyebrow: 'Interaktywny obszar roboczy',
      title: 'Projekt Atlas',
      description: 'Uruchom tour, aby zobaczyć, jak tryb spotlight objaśnia interfejs aplikacji.',
      start: 'Uruchom przewodnik',
      labelsAriaLabel: 'Etykiety akcji toura',
      backLabel: 'Tekst przycisku Wstecz',
      completeLabel: 'Tekst przycisku Zakończ',
      nextLabel: 'Tekst przycisku Dalej',
      skipLabel: 'Tekst przycisku Pomiń',
      navigation: 'Nawigacja obszaru roboczego',
      overview: 'Przegląd',
      tasks: 'Zadania',
      reports: 'Raporty',
      searchLabel: 'Przeszukaj obszar roboczy',
      searchPlaceholder: 'Szukaj projektów, raportów i osób',
      profile: 'Otwórz profil Anny Kowalskiej',
      profileName: 'Anna Kowalska',
      profileRole: 'Właścicielka projektu',
      summary: 'Postęp tygodnia',
      metric: '12 ukończonych zadań',
    },
  }),
);
</script>

<template>
  <section class="tour-scene" :aria-label="copy.ariaLabel">
    <header class="tour-scene__header">
      <div>
        <span class="tour-scene__eyebrow">{{ copy.eyebrow }}</span>
        <h3>{{ copy.title }}</h3>
        <p>{{ copy.description }}</p>
      </div>
      <button class="tour-scene__start" type="button" @click="emit('start')">
        <span aria-hidden="true">▶</span>
        {{ copy.start }}
      </button>
    </header>

    <fieldset class="tour-scene__label-controls">
      <legend>{{ copy.labelsAriaLabel }}</legend>
      <label>
        <span>{{ copy.backLabel }}</span>
        <input
          type="text"
          :value="props.backLabel"
          @input="emit('labelChange', 'back', ($event.target as HTMLInputElement).value)"
        />
      </label>
      <label>
        <span>{{ copy.nextLabel }}</span>
        <input
          type="text"
          :value="props.nextLabel"
          @input="emit('labelChange', 'next', ($event.target as HTMLInputElement).value)"
        />
      </label>
      <label>
        <span>{{ copy.skipLabel }}</span>
        <input
          type="text"
          :value="props.skipLabel"
          @input="emit('labelChange', 'skip', ($event.target as HTMLInputElement).value)"
        />
      </label>
      <label>
        <span>{{ copy.completeLabel }}</span>
        <input
          type="text"
          :value="props.completeLabel"
          @input="emit('labelChange', 'complete', ($event.target as HTMLInputElement).value)"
        />
      </label>
    </fieldset>

    <div class="tour-scene__workspace">
      <nav data-guided-tour-demo="navigation" :aria-label="copy.navigation">
        <span class="tour-scene__brand" aria-hidden="true">P</span>
        <button type="button" class="tour-scene__nav-item tour-scene__nav-item--active">
          <span aria-hidden="true">01</span>{{ copy.overview }}
        </button>
        <button type="button" class="tour-scene__nav-item">
          <span aria-hidden="true">02</span>{{ copy.tasks }}
        </button>
        <button type="button" class="tour-scene__nav-item">
          <span aria-hidden="true">03</span>{{ copy.reports }}
        </button>
      </nav>

      <div class="tour-scene__content">
        <div class="tour-scene__topbar">
          <label data-guided-tour-demo="search">
            <span class="sr-only">{{ copy.searchLabel }}</span>
            <span aria-hidden="true">⌕</span>
            <input type="search" :placeholder="copy.searchPlaceholder" />
            <kbd>⌘ K</kbd>
          </label>

          <button
            data-guided-tour-demo="profile"
            class="tour-scene__profile"
            type="button"
            :aria-label="copy.profile"
          >
            <span aria-hidden="true">AK</span>
            <span
              ><strong>{{ copy.profileName }}</strong
              ><small>{{ copy.profileRole }}</small></span
            >
          </button>
        </div>

        <article class="tour-scene__summary">
          <span>{{ copy.summary }}</span>
          <strong>78%</strong>
          <div aria-hidden="true"><i /></div>
          <small>{{ copy.metric }}</small>
        </article>
      </div>
    </div>

    <slot />
  </section>
</template>

<style scoped>
.tour-scene {
  display: grid;
  gap: 1rem;
  width: 100%;
  color: var(--docs-text);
}

.tour-scene__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.tour-scene__header h3,
.tour-scene__header p {
  margin: 0;
}

.tour-scene__header h3 {
  margin-top: 0.18rem;
  font-family: Manrope, sans-serif;
  font-size: 1.1rem;
}

.tour-scene__header p {
  max-width: 35rem;
  margin-top: 0.25rem;
  color: var(--docs-text-soft);
  font-size: 0.76rem;
}

.tour-scene__eyebrow {
  color: var(--docs-primary);
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.tour-scene__start {
  display: inline-flex;
  min-height: 2.5rem;
  flex: 0 0 auto;
  align-items: center;
  gap: 0.48rem;
  padding: 0.62rem 0.9rem;
  border: 0;
  border-radius: 0.65rem;
  color: var(--docs-on-primary);
  background: var(--docs-primary);
  box-shadow: 0 8px 20px color-mix(in srgb, var(--docs-primary) 24%, transparent);
  font:
    700 0.72rem Manrope,
    sans-serif;
  cursor: pointer;
}

.tour-scene__start:hover {
  background: var(--docs-primary-strong);
}

.tour-scene__start:focus-visible,
.tour-scene button:focus-visible,
.tour-scene input:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--docs-primary) 32%, transparent);
  outline-offset: 2px;
}

.tour-scene__label-controls {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
  margin: 0;
  padding: 0.75rem;
  border: 1px solid var(--docs-border-soft);
  border-radius: 0.7rem;
  background: var(--docs-surface-soft);
}

.tour-scene__label-controls legend {
  padding: 0 0.35rem;
  color: var(--docs-text-faint);
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.tour-scene__label-controls label {
  display: grid;
  gap: 0.28rem;
  color: var(--docs-text-soft);
  font-size: 0.65rem;
  font-weight: 700;
}

.tour-scene__label-controls input {
  width: 100%;
  min-height: 2.25rem;
  padding: 0.45rem 0.58rem;
  border: 1px solid var(--docs-border);
  border-radius: 0.48rem;
  color: var(--docs-text);
  background: var(--docs-surface);
  font: inherit;
}

.tour-scene__workspace {
  display: grid;
  min-height: 18rem;
  grid-template-columns: minmax(9rem, 0.34fr) minmax(0, 1fr);
  overflow: hidden;
  border: 1px solid var(--docs-border);
  border-radius: var(--docs-radius);
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--docs-primary-soft) 70%, transparent),
      transparent 55%
    ),
    var(--docs-surface);
  box-shadow: var(--docs-shadow);
}

.tour-scene__workspace nav {
  display: flex;
  flex-direction: column;
  gap: 0.42rem;
  padding: 1rem;
  border-right: 1px solid var(--docs-border-soft);
  background: color-mix(in srgb, var(--docs-surface-soft) 82%, transparent);
}

.tour-scene__brand {
  display: grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  margin-bottom: 0.65rem;
  border-radius: 0.55rem;
  color: var(--docs-on-primary);
  background: var(--docs-primary);
  font:
    800 0.85rem Manrope,
    sans-serif;
}

.tour-scene__nav-item {
  display: flex;
  min-height: 2.3rem;
  align-items: center;
  gap: 0.55rem;
  padding: 0.5rem 0.58rem;
  border: 0;
  border-radius: 0.5rem;
  color: var(--docs-text-soft);
  background: transparent;
  font:
    600 0.72rem 'DM Sans',
    sans-serif;
  text-align: left;
  cursor: pointer;
}

.tour-scene__nav-item span {
  color: var(--docs-text-faint);
  font-size: 0.58rem;
}

.tour-scene__nav-item--active {
  color: var(--docs-primary-strong);
  background: var(--docs-primary-soft);
}

.tour-scene__content {
  display: grid;
  align-content: start;
  gap: 1.25rem;
  padding: 1rem;
}

.tour-scene__topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.tour-scene__topbar label {
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: center;
  gap: 0.45rem;
  padding: 0.52rem 0.65rem;
  border: 1px solid var(--docs-border);
  border-radius: 0.58rem;
  background: var(--docs-surface);
}

.tour-scene__topbar input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  color: var(--docs-text);
  background: transparent;
  font: inherit;
  font-size: 0.7rem;
}

.tour-scene__topbar kbd {
  padding: 0.14rem 0.32rem;
  border: 1px solid var(--docs-border);
  border-radius: 0.28rem;
  color: var(--docs-text-faint);
  background: var(--docs-surface-soft);
  font-size: 0.56rem;
}

.tour-scene__profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.28rem;
  border: 0;
  color: var(--docs-text);
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.tour-scene__profile > span:first-child {
  display: grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  border-radius: 50%;
  color: var(--docs-primary-strong);
  background: var(--docs-primary-soft);
  font-size: 0.62rem;
  font-weight: 800;
}

.tour-scene__profile > span:last-child {
  display: grid;
}

.tour-scene__profile strong,
.tour-scene__profile small {
  white-space: nowrap;
}

.tour-scene__profile strong {
  font-size: 0.68rem;
}

.tour-scene__profile small {
  color: var(--docs-text-faint);
  font-size: 0.56rem;
}

.tour-scene__summary {
  display: grid;
  gap: 0.45rem;
  padding: 1.2rem;
  border: 1px solid var(--docs-border-soft);
  border-radius: 0.8rem;
  background: color-mix(in srgb, var(--docs-surface) 90%, var(--docs-primary-soft));
}

.tour-scene__summary span,
.tour-scene__summary small {
  color: var(--docs-text-soft);
  font-size: 0.68rem;
}

.tour-scene__summary strong {
  font:
    800 2rem Manrope,
    sans-serif;
}

.tour-scene__summary div {
  height: 0.45rem;
  overflow: hidden;
  border-radius: 999px;
  background: var(--docs-surface-strong);
}

.tour-scene__summary i {
  display: block;
  width: 78%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--docs-primary), var(--docs-mint));
}

@media (max-width: 680px) {
  .tour-scene__header,
  .tour-scene__topbar {
    align-items: stretch;
    flex-direction: column;
  }

  .tour-scene__start {
    justify-content: center;
  }

  .tour-scene__workspace {
    grid-template-columns: 1fr;
  }

  .tour-scene__label-controls {
    grid-template-columns: 1fr;
  }

  .tour-scene__workspace nav {
    flex-direction: row;
    overflow-x: auto;
    border-right: 0;
    border-bottom: 1px solid var(--docs-border-soft);
  }

  .tour-scene__brand {
    flex: 0 0 auto;
    margin: 0 0.35rem 0 0;
  }

  .tour-scene__nav-item {
    flex: 0 0 auto;
  }

  .tour-scene__profile > span:last-child {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tour-scene__start {
    scroll-behavior: auto;
  }
}
</style>
