<script setup lang="ts">
import { computed } from "vue";

import type { StoryContentSettings } from "./shared";
import StoryExample from "./StoryExample.vue";
import StoryPreview from "./StoryPreview.vue";
import StoryProps from "./StoryProps.vue";
import StorySettings from "./StorySettings.vue";

const props = defineProps<{
  settings: StoryContentSettings;
}>();

const componentName = computed(
  () => props.settings.name?.trim() || "Komponent PEAUI",
);
const description = computed(
  () =>
    props.settings.description?.trim() ||
    "Komponent interfejsu PEAUI. Zobacz działanie, dostępne dane wejściowe i przykłady użycia.",
);
const category = computed(() => props.settings.category?.trim() || "Komponent");
const exampleCode = computed(() => props.settings.code?.trim() || "");
const documentedProps = computed(() => props.settings.props ?? []);
</script>

<template>
  <article class="story-content">
    <header id="overview" class="story-hero">
      <div class="story-hero__eyebrow">
        <span class="story-hero__brand">PEAUI</span>
        <span aria-hidden="true">/</span>
        <span>{{ category }}</span>
      </div>

      <h1 class="story-hero__title">{{ componentName }}</h1>
      <p class="story-hero__description">{{ description }}</p>

      <div class="story-hero__meta" aria-label="Informacje o komponencie">
        <span class="story-badge story-badge--primary">Vue 3</span>
        <span class="story-badge">TypeScript</span>
        <span class="story-badge">WCAG</span>
        <span class="story-badge"
          >{{ documentedProps.length }} danych wejściowych</span
        >
      </div>

      <nav class="story-nav" aria-label="Sekcje dokumentacji">
        <a href="#overview">Opis</a>
        <a href="#preview">Podgląd</a>
        <a href="#example">Kod</a>
        <a href="#api">API</a>
      </nav>
    </header>

    <section id="preview" class="story-section">
      <div class="story-section__heading">
        <div>
          <span class="story-section__index">01</span>
          <h2>Interaktywny podgląd</h2>
          <p>
            Zobacz zachowanie komponentu. Propsami możesz sterować również z
            panelu
            <strong>Controls</strong> w Storybooku.
          </p>
        </div>
        <StorySettings />
      </div>

      <StoryPreview>
        <slot />
      </StoryPreview>
    </section>

    <section v-if="exampleCode" id="example" class="story-section">
      <div class="story-section__heading">
        <div>
          <span class="story-section__index">02</span>
          <h2>Przykład użycia</h2>
          <p>
            Gotowy fragment możesz skopiować i dopasować do swojej aplikacji.
          </p>
        </div>
      </div>

      <StoryExample language="vue" :code="exampleCode" />
    </section>

    <section id="api" class="story-section">
      <div class="story-section__heading">
        <div>
          <span class="story-section__index">03</span>
          <h2>Dane wejściowe i API</h2>
          <p>
            Lista obsługiwanych propsów wraz z przeznaczeniem, typem, wartością
            domyślną i sposobem edycji.
          </p>
        </div>
      </div>

      <StoryProps :props-list="documentedProps" />
    </section>
  </article>
</template>

<style lang="scss" scoped>
.story-content {
  --docs-accent: #326a04;
  --docs-accent-soft: #f4fbe8;
  --docs-border: #dce3ec;
  --docs-muted: #5d6878;
  --docs-surface: #ffffff;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-width: 0;
  width: min(70rem, calc(100% - 2rem));
  margin: 0 auto;
  padding: 3.5rem 0 5rem;
  gap: 4rem;
  color: #111827;
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.story-hero {
  min-width: 0;
  display: grid;
  gap: 1.25rem;
  padding: 2.25rem;
  border: 1px solid var(--docs-border);
  border-radius: 1.25rem;
  background:
    radial-gradient(circle at 90% 0%, rgba(63, 130, 5, 0.15), transparent 34%),
    var(--docs-surface);
  box-shadow: 0 1.25rem 3.5rem rgba(21, 35, 54, 0.08);
}

.story-hero__eyebrow,
.story-hero__meta,
.story-nav {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.story-hero__eyebrow {
  gap: 0.5rem;
  color: var(--docs-muted);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.story-hero__brand {
  color: var(--docs-accent);
}

.story-hero__title {
  margin: 0;
  min-width: 0;
  overflow-wrap: anywhere;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 750;
  letter-spacing: -0.055em;
  line-height: 0.98;
}

.story-hero__description {
  max-width: 52rem;
  margin: 0;
  overflow-wrap: anywhere;
  color: var(--docs-muted);
  font-size: 1.08rem;
  line-height: 1.75;
}

.story-hero__meta {
  gap: 0.55rem;
}

.story-badge {
  box-sizing: border-box;
  max-width: 100%;
  padding: 0.38rem 0.7rem;
  border: 1px solid var(--docs-border);
  border-radius: 999px;
  background: #fff;
  color: #3b4655;
  font-size: 0.75rem;
  font-weight: 650;
}

.story-badge--primary {
  border-color: #d0ef8b;
  background: var(--docs-accent-soft);
  color: var(--docs-accent);
}

.story-nav {
  gap: 0.25rem;
  margin-top: 0.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--docs-border);
}

.story-nav a {
  padding: 0.55rem 0.75rem;
  border-radius: 0.55rem;
  color: #394657;
  font-size: 0.875rem;
  font-weight: 650;
  text-decoration: none;
}

.story-nav a:hover,
.story-nav a:focus-visible {
  background: var(--docs-accent-soft);
  color: var(--docs-accent);
  outline: none;
}

.story-section {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-width: 0;
  gap: 1.25rem;
  scroll-margin-top: 1rem;
}

.story-section__heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
}

.story-section__index {
  display: block;
  margin-bottom: 0.35rem;
  color: var(--docs-accent);
  font-size: 0.75rem;
  font-weight: 750;
  letter-spacing: 0.1em;
}

.story-section h2 {
  margin: 0;
  font-size: clamp(1.65rem, 3vw, 2.15rem);
  letter-spacing: -0.035em;
}

.story-section p {
  max-width: 48rem;
  margin: 0.55rem 0 0;
  color: var(--docs-muted);
  line-height: 1.65;
}

@media (max-width: 48rem) {
  .story-content {
    width: min(100% - 1rem, 70rem);
    padding-top: 1rem;
    gap: 3rem;
  }

  .story-hero {
    padding: 1.35rem;
    border-radius: 0.9rem;
  }

  .story-section__heading {
    align-items: flex-start;
    flex-direction: column;
  }
}

:global(body.dark-mode) .story-content {
  --docs-accent: #afe34b;
  --docs-accent-soft: #1d3f03;
  --docs-border: #29364a;
  --docs-muted: #aab5c4;
  --docs-surface: #111827;
  color: #f4f7fb;
}

:global(body.dark-mode) .story-badge {
  background: #172033;
  color: #dce5f2;
}
</style>
