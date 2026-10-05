<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

import ApiTable from '../components/ApiTable.vue';
import CodeBlock from '../components/CodeBlock.vue';
import { findComponent, findFrameworkComponent, getFrameworkComponents } from '../data/catalog';
import { getFrameworkDefinition, normalizeFramework } from '../data/frameworks';
import { getCategoryLabel, getComponentCopy, localizeApiEntries } from '../data/localized-content';
import { useI18n } from '../i18n';

const DemoCanvas = defineAsyncComponent(() => import('../components/DemoCanvas.vue'));
const ReactDemoCanvas = defineAsyncComponent(() => import('../components/ReactDemoCanvas.vue'));
const WebComponentDemo = defineAsyncComponent(() => import('../components/WebComponentDemo.vue'));

const route = useRoute();
const { localize } = useI18n();
const framework = computed(() => normalizeFramework(route.params.framework));
const frameworkDefinition = computed(() => getFrameworkDefinition(framework.value));
const definition = computed(() =>
  findFrameworkComponent(
    framework.value,
    String(route.params.category),
    String(route.params.component),
  ),
);
const vueDefinition = computed(() =>
  framework.value === 'vue'
    ? findComponent(String(route.params.category), String(route.params.component))
    : undefined,
);
const components = computed(() => getFrameworkComponents(framework.value));
const componentIndex = computed(() =>
  definition.value
    ? components.value.findIndex((component) => component.slug === definition.value?.slug)
    : -1,
);
const previous = computed(() => components.value[componentIndex.value - 1]);
const next = computed(() => components.value[componentIndex.value + 1]);
const componentBasePath = computed(() => `/${framework.value}/components`);
const inputEntries = computed(() =>
  definition.value
    ? localizeApiEntries(
        [...definition.value.props, ...definition.value.models],
        'input',
        framework.value,
      )
    : [],
);
const eventEntries = computed(() =>
  definition.value ? localizeApiEntries(definition.value.events, 'event', framework.value) : [],
);
const slotEntries = computed(() =>
  definition.value ? localizeApiEntries(definition.value.slots, 'slot', framework.value) : [],
);
const localizedComponentCopy = computed(() =>
  definition.value ? getComponentCopy(definition.value.name, definition.value.copy) : undefined,
);
const categoryLabel = computed(() =>
  definition.value
    ? getCategoryLabel(definition.value.category, definition.value.categoryLabel)
    : '',
);
const copy = computed(() =>
  localize({
    en: {
      breadcrumbs: 'Documentation path',
      components: 'components',
      stable: 'stable',
      experimental: 'experimental',
      what: 'What is this component?',
      input: 'Input',
      purpose: 'What does it do?',
      usage: 'Usage and preview',
      variants: 'Variants and behavior',
      vueDemo:
        'Switch variants, open the props playground and edit values live. The Code tab shows a ready-to-use configuration.',
      wcDemo:
        'Switch variants, edit native Custom Element attributes and properties, then copy the ready HTML. Component events appear in the log below the playground.',
      reactDemo:
        'This is a real React component. Switch variants, edit props and controlled values, then copy the ready TSX.',
      attributes: 'Attributes and properties',
      props: 'Props and input data',
      vueProps:
        'This table is generated automatically from the component TypeScript declaration. Required entries must be provided.',
      wcProps:
        'Use kebab-case HTML attributes and camelCase JavaScript properties. Assign arrays, objects, functions and explicit false values through properties. A present boolean attribute enables the option. Browser and bundler component imports include their required styles.',
      reactProps:
        'Props come from the exported React TypeScript declarations. Pair controlled values with their on…Change callback. Use default… only when it appears in this table, and avoid passing a controlled value at the same time. Standard native attributes follow the component element. Browser and bundler component imports include their required styles.',
      noInput: 'This component does not require any input data.',
      callbacks: 'Callbacks',
      events: 'Events',
      wcEvents:
        'Listen with addEventListener using the exact event name. event.detail is the single emitted argument, or an array when multiple arguments are emitted. Keep controlled properties synchronized in update:… listeners.',
      vueEvents:
        'Use @event-name or v-model:property for update:property events. Event signatures list the emitted arguments in order.',
      reactEvents:
        'Pass callbacks as props. Callback and render-function signatures below describe the public React API.',
      htmlSlots: 'HTML slots',
      reactContent: 'ReactNode content',
      slots: 'Slots',
      neighbors: 'Adjacent components',
      previous: 'Previous',
      next: 'Next',
      onPage: 'On this page',
      usageShort: 'Usage',
      variantsShort: 'Variants',
      sourceApi: 'API from source',
      sourceNote: 'Refreshed every time the documentation starts.',
      notFound: 'Component not found',
      back: 'Back to catalog',
    },
    pl: {
      breadcrumbs: 'Ścieżka dokumentacji',
      components: 'Komponenty',
      stable: 'stabilny',
      experimental: 'eksperymentalny',
      what: 'Co to za komponent',
      input: 'Wejście',
      purpose: 'Co robi',
      usage: 'Użycie i podgląd',
      variants: 'Warianty i działanie',
      vueDemo:
        'Przełącz wariant, otwórz playground propsów i zmieniaj wartości na żywo. Zakładka „Kod” pokazuje konfigurację gotową do użycia.',
      wcDemo:
        'Przełącz wariant, zmieniaj atrybuty i properties natywnego Custom Elementu, a następnie skopiuj gotowy kod HTML. Zdarzenia komponentu pojawią się w logu pod playgroundem.',
      reactDemo:
        'To jest rzeczywisty komponent React. Przełącz wariant, zmieniaj propsy i wartości kontrolowane, a następnie skopiuj gotowy kod TSX.',
      attributes: 'Atrybuty i właściwości',
      props: 'Propsy i dane wejściowe',
      vueProps:
        'Tabela powstaje automatycznie z deklaracji TypeScript komponentu. Pozycje oznaczone jako wymagane muszą zostać przekazane.',
      wcProps:
        'Atrybuty HTML mają nazwy z myślnikami, a właściwości JavaScript używają camelCase. Tablice, obiekty, funkcje i jawne false ustawiaj przez properties. Obecność atrybutu boolean włącza opcję. Importy komponentów dla przeglądarki i bundlera dołączają wymagane style.',
      reactProps:
        'Props pochodzą z eksportowanych deklaracji TypeScript dla Reacta. Kontrolowaną wartość połącz z callbackiem on…Change. Używaj default… tylko wtedy, gdy występuje w tabeli, bez jednoczesnego przekazywania wartości kontrolowanej. Natywne atrybuty zależą od elementu komponentu. Importy dla przeglądarki i bundlera dołączają wymagane style.',
      noInput: 'Ten komponent nie wymaga żadnych danych wejściowych.',
      callbacks: 'Callbacki',
      events: 'Zdarzenia',
      wcEvents:
        'Używaj addEventListener z dokładną nazwą zdarzenia. event.detail zawiera pojedynczy argument albo tablicę argumentów, jeśli emitowano ich kilka. Synchronizuj kontrolowane właściwości w listenerach update:….',
      vueEvents:
        'Używaj @nazwa-zdarzenia lub v-model:właściwość dla zdarzeń update:właściwość. Sygnatury pokazują emitowane argumenty w kolejności.',
      reactEvents:
        'Przekazuj callbacki jako propsy. Sygnatury callbacków i funkcji renderujących poniżej opisują publiczne API Reacta.',
      htmlSlots: 'Sloty HTML',
      reactContent: 'Treść ReactNode',
      slots: 'Sloty',
      neighbors: 'Sąsiednie komponenty',
      previous: 'Poprzedni',
      next: 'Następny',
      onPage: 'Na tej stronie',
      usageShort: 'Użycie',
      variantsShort: 'Warianty',
      sourceApi: 'API ze źródła',
      sourceNote: 'Odświeżane przy każdym starcie dokumentacji.',
      notFound: 'Nie znaleziono komponentu',
      back: 'Wróć do katalogu',
    },
  }),
);
const inputLabel = computed(() =>
  framework.value === 'web-components' ? copy.value.attributes : copy.value.props,
);

const importCode = computed(() => {
  if (!definition.value) return '';
  if (framework.value === 'vue') {
    return `import ${definition.value.name} from '${definition.value.importPath}';`;
  }
  if (framework.value === 'react') {
    return `import ${definition.value.name} from '${definition.value.importPath}';`;
  }
  return `import '${definition.value.importPath}';`;
});
</script>

<template>
  <article v-if="definition" class="component-page">
    <div class="component-article">
      <nav class="breadcrumbs-docs" :aria-label="copy.breadcrumbs">
        <RouterLink :to="componentBasePath"
          >{{ copy.components }} {{ frameworkDefinition.label }}</RouterLink
        ><span>/</span> <span>{{ categoryLabel }}</span
        ><span>/</span><strong>{{ definition.name }}</strong>
      </nav>

      <header class="component-hero">
        <div class="component-hero__meta">
          <span
            class="status-badge"
            :class="{ 'status-badge--experimental': definition.status === 'experimental' }"
            ><i /> {{ definition.status === 'stable' ? copy.stable : copy.experimental }}</span
          >
          <span>{{ frameworkDefinition.badge }}</span>
          <code v-if="definition.tagName">&lt;{{ definition.tagName }}&gt;</code>
        </div>
        <h1>{{ definition.name }}</h1>
        <p>{{ localizedComponentCopy?.description }}</p>
      </header>

      <CodeBlock :code="importCode" language="ts" />

      <section id="co-to-jest" class="docs-section">
        <span class="section-index">01</span>
        <div>
          <h2>{{ copy.what }}</h2>
          <p>{{ localizedComponentCopy?.description }}</p>
          <div class="info-card">
            <span>{{ copy.input }}</span>
            <strong>{{ localizedComponentCopy?.input }}</strong>
          </div>
        </div>
      </section>

      <section id="co-robi" class="docs-section">
        <span class="section-index">02</span>
        <div>
          <h2>{{ copy.purpose }}</h2>
          <ul class="purpose-list">
            <li v-for="item in localizedComponentCopy?.purpose" :key="item">
              <span>✓</span>{{ item }}
            </li>
          </ul>
        </div>
      </section>

      <section id="warianty" class="docs-section docs-section--stacked">
        <span class="section-index">03</span>
        <div>
          <h2>
            {{ framework === 'web-components' ? copy.usage : copy.variants }}
          </h2>
          <template v-if="framework === 'vue' && vueDefinition">
            <p>{{ copy.vueDemo }}</p>
            <DemoCanvas :definition="vueDefinition" />
          </template>
          <template v-else-if="framework === 'web-components'">
            <p>{{ copy.wcDemo }}</p>
            <WebComponentDemo :definition="definition" />
          </template>
          <template v-else>
            <p>{{ copy.reactDemo }}</p>
            <ReactDemoCanvas :definition="definition" />
          </template>
        </div>
      </section>

      <section id="props" class="docs-section docs-section--stacked">
        <span class="section-index">04</span>
        <div>
          <h2>{{ inputLabel }}</h2>
          <p v-if="framework === 'vue'">{{ copy.vueProps }}</p>
          <p v-else-if="framework === 'web-components'">{{ copy.wcProps }}</p>
          <p v-else>{{ copy.reactProps }}</p>
          <ApiTable v-if="inputEntries.length" :entries="inputEntries" kind="input" />
          <div v-else class="empty-api">{{ copy.noInput }}</div>
        </div>
      </section>

      <section
        v-if="definition.events.length"
        id="events"
        class="docs-section docs-section--stacked"
      >
        <span class="section-index">05</span>
        <div>
          <h2>{{ framework === 'react' ? copy.callbacks : copy.events }}</h2>
          <p v-if="framework === 'web-components'">{{ copy.wcEvents }}</p>
          <p v-else-if="framework === 'react'">{{ copy.reactEvents }}</p>
          <p v-else>{{ copy.vueEvents }}</p>
          <ApiTable :entries="eventEntries" kind="event" />
        </div>
      </section>

      <section v-if="definition.slots.length" id="slots" class="docs-section docs-section--stacked">
        <span class="section-index">06</span>
        <div>
          <h2>
            {{
              framework === 'web-components'
                ? copy.htmlSlots
                : framework === 'react'
                  ? copy.reactContent
                  : copy.slots
            }}
          </h2>
          <ApiTable :entries="slotEntries" kind="slot" />
        </div>
      </section>

      <nav class="page-neighbors" :aria-label="copy.neighbors">
        <RouterLink
          v-if="previous"
          :to="`${componentBasePath}/${previous.category}/${previous.slug}`"
          ><span>← {{ copy.previous }}</span
          ><strong>{{ previous.name }}</strong></RouterLink
        >
        <span v-else />
        <RouterLink v-if="next" :to="`${componentBasePath}/${next.category}/${next.slug}`"
          ><span>{{ copy.next }} →</span><strong>{{ next.name }}</strong></RouterLink
        >
      </nav>
    </div>

    <aside class="page-toc">
      <strong>{{ copy.onPage }}</strong>
      <a href="#co-to-jest">{{ copy.what }}</a>
      <a href="#co-robi">{{ copy.purpose }}</a>
      <a href="#warianty">{{
        framework === 'web-components' ? copy.usageShort : copy.variantsShort
      }}</a>
      <a href="#props">{{ inputLabel }}</a>
      <a v-if="definition.events.length" href="#events">{{
        framework === 'react' ? copy.callbacks : copy.events
      }}</a>
      <a v-if="definition.slots.length" href="#slots">{{
        framework === 'react' ? copy.reactContent : copy.slots
      }}</a>
      <div class="toc-note">
        <span>✦</span>
        <p>
          <strong>{{ copy.sourceApi }}</strong
          >{{ copy.sourceNote }}
        </p>
      </div>
    </aside>
  </article>

  <article v-else class="not-found">
    <span>404</span>
    <h1>{{ copy.notFound }}</h1>
    <RouterLink :to="componentBasePath">{{ copy.back }}</RouterLink>
  </article>
</template>
