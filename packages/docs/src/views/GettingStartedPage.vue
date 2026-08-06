<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

import CodeBlock from '../components/CodeBlock.vue';
import { getFrameworkComponents } from '../data/catalog';
import {
  colorPalettes,
  colorTokenCount,
  colorTokensCode,
  explicitDarkModeTokensCode,
} from '../data/color-tokens';
import { getFrameworkDefinition, normalizeFramework } from '../data/frameworks';
import { useI18n } from '../i18n';

const route = useRoute();
const { localize } = useI18n();
const framework = computed(() => normalizeFramework(route.params.framework));
const frameworkDefinition = computed(() => getFrameworkDefinition(framework.value));
const availableComponents = computed(() => getFrameworkComponents(framework.value));

const installCode = computed(() =>
  framework.value === 'react' ? 'npm install @peaui/ui react react-dom' : 'npm install @peaui/ui',
);

const vueSetupCode = `import { createApp } from 'vue';
import '@peaui/ui/styles.css';
import App from './App.vue';

createApp(App).mount('#app');`;
const vueUsageCode = computed(
  () => `<script setup lang="ts">
import { FormInput } from '@peaui/ui';
import { ref } from 'vue';

const name = ref('');
<\/script>

<template>
  <FormInput
    v-model:value="name"
    id="name"
    name="name"
    label="${localize({ en: 'Name', pl: 'Nazwa' })}"
  />
</template>`,
);
const vueDirectImportCode = computed(
  () => `import ButtonAction from '@peaui/ui/vue/data-entry/ButtonAction';
// ${localize({ en: 'Backward-compatible Vue path:', pl: 'Zgodna wstecznie ścieżka Vue:' })}
import ButtonActionLegacy from '@peaui/ui/data-entry/ButtonAction';`,
);

const reactUsageCode = computed(
  () => `import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import FormInput from '@peaui/ui/react/form/FormInput';
import '@peaui/ui/styles.css';

function App() {
  const [name, setName] = useState('');

  return (
    <FormInput
      id="name"
      name="name"
      label="${localize({ en: 'Name', pl: 'Nazwa' })}"
      value={name}
      onValueChange={setName}
    />
  );
}

createRoot(document.getElementById('root')!).render(<App />);`,
);
const reactImportCode = computed(
  () => `// ${localize({ en: 'React uses explicit component subpaths:', pl: 'React korzysta z jawnych podścieżek komponentów:' })}
import ButtonAction from '@peaui/ui/react/data-entry/ButtonAction';
import FormInput from '@peaui/ui/react/form/FormInput';

// ${localize({ en: 'The main @peaui/ui entry exports Vue components,', pl: 'Główny import @peaui/ui eksportuje komponenty Vue,' })}
// ${localize({ en: 'so do not import React components from the main entry point.', pl: 'dlatego nie importuj komponentów React z głównego entry pointu.' })}`,
);

const webComponentSetupCode = `import '@peaui/ui/styles.css';
import '@peaui/ui/wc/data-entry/ButtonAction';
import '@peaui/ui/wc/form/FormInput';`;
const webComponentHtmlCode = computed(
  () => `<peaui-form-input
  id="name"
  name="name"
  label="${localize({ en: 'Name', pl: 'Nazwa' })}"
  placeholder="${localize({ en: 'Enter a name', pl: 'Wpisz nazwę' })}"
></peaui-form-input>

<peaui-button-action variant="primary" size="m">
  ${localize({ en: 'Save', pl: 'Zapisz' })}
</peaui-button-action>`,
);
const webComponentEventsCode = computed(
  () => `const input = document.querySelector('peaui-form-input') as
  | (HTMLElement & { disabled: boolean })
  | null;

input?.addEventListener('update:value', (event) => {
  const value = (event as CustomEvent<string>).detail;
  console.log('${localize({ en: 'New value:', pl: 'Nowa wartość:' })}', value);
});

// ${localize({ en: 'Assign complex values and flags as properties:', pl: 'Wartości złożone i flagi najlepiej ustawiać jako properties:' })}
if (input) {
  input.disabled = true;
  input.disabled = false;
}`,
);
const webComponentLazyCode = computed(
  () => `// ${localize({ en: 'In an SSR app, register elements only on the client.', pl: 'W aplikacji SSR rejestruj elementy wyłącznie po stronie klienta.' })}
if (typeof window !== 'undefined') {
  await import('@peaui/ui/wc/feedback/ToastAlert');
}`,
);

const themeImportOrderCode = computed(
  () => `import '@peaui/ui/styles.css';
import './peaui-theme.css'; // ${localize({ en: 'custom tokens must follow the library styles', pl: 'własne tokeny muszą być za stylami biblioteki' })}`,
);

const colorOverrideCode = computed(
  () => `:root {
  /* light-dark(${localize({ en: 'light value, dark value', pl: 'wartość jasna, wartość ciemna' })}) */
  --peaui-color-primary-700: light-dark(#2f6b00, #d8ff91);
  --peaui-color-primary-50: light-dark(#f5fde8, #183600);
  --peaui-color-grey-0: light-dark(#ffffff, #0b0f09);
  --peaui-color-grey-700: light-dark(#20251d, #f2f7ed);
}

/* ${localize({ en: 'Also add this selector when the app enforces dark mode with a class.', pl: 'Dodaj również ten selektor, jeżeli aplikacja wymusza dark mode klasą.' })} */
body.dark-mode {
  --peaui-color-primary-700: #d8ff91;
  --peaui-color-primary-50: #183600;
  --peaui-color-grey-0: #0b0f09;
  --peaui-color-grey-700: #f2f7ed;
}`,
);

const paletteDescriptions = computed(() =>
  colorPalettes.map((palette) => ({
    ...palette,
    description: localize({
      en:
        {
          primary: 'Primary actions, CTAs, links, focus rings and PEAUI brand accents.',
          success: 'Confirmations, completed operations and positive statuses.',
          warning: 'States requiring attention that are not errors yet.',
          danger: 'Errors, destructive actions and critical messages.',
          violet: 'Additional accents and selected TagChip variants.',
          grey: 'Text, surfaces, borders, backgrounds and neutral interface states.',
        }[palette.key] ?? palette.description,
      pl: palette.description,
    }),
  })),
);

const copy = computed(() =>
  localize({
    en: {
      gettingStarted: 'Getting started',
      forFramework: 'PEAUI for',
      packageSingular: 'component in the package',
      packagePlural: 'components in the package',
      reactTitle: '62 native React components',
      reactNotice:
        'The React API provides the complete Vue-compatible catalog. Every model supports a controlled value, a default… initial value and an on…Change callback.',
      installTitle: '1. Installation',
      installText:
        'Install one package. Styles and implementations for every technology share one version.',
      vueSetupTitle: '2. Vue setup',
      vueSetupText: 'Include the global styles once before mounting the application.',
      firstTitle: '3. First component',
      vueFirstText: 'The main package entry is intended for Vue 3 and exposes named exports.',
      directTitle: '4. Direct imports',
      directText: 'You can import one component from an explicit Vue path.',
      reactRunTitle: '2. Run in React',
      reactRunText:
        'Import a component from the explicit @peaui/ui/react subtree and include the shared stylesheet.',
      importRulesTitle: '3. Import rules',
      importRulesText:
        'The main package API remains the Vue API. React uses separate, stable subpaths.',
      fullCatalogTitle: '4. Full catalog and documentation',
      fullCatalogText:
        'The documentation covers all 62 components with variants, a props editor, ready TSX, callbacks and ReactNode content.',
      viewReact: 'View React components',
      registerTitle: '2. Register elements',
      registerText:
        'Importing a module registers that element through customElements.define. Import only the elements used by your application. All 62 elements share the Vue rendering layer declared as a peer dependency, while their public interface remains standard Custom Elements.',
      htmlTitle: '3. Use in HTML',
      htmlText:
        'After registration, use native peaui-* tags. Pass simple values as HTML attributes.',
      eventsTitle: '4. Properties and events',
      eventsText:
        'Events are native CustomEvents and their data is available in event.detail. Assign boolean flags and complex values through element properties.',
      ssrTitle: '5. SSR and lazy loading',
      ssrText:
        'In server-rendered environments, register elements on the client. Modules can be loaded dynamically with the view that uses them.',
      availabilityTitle: '6. Current availability',
      availabilityText:
        'The catalog includes only components with a real index.wc.ts implementation, including tag names, attributes and events read from source.',
      viewWc: 'View Web Components',
      colorsTitle: 'Colors and CSS tokens',
      colorsText:
        'Every implementation uses the same public CSS variable set. Override one shade or an entire palette without modifying components. Tokens are shared by Vue, React and Web Components.',
      colorSummary: 'Color token summary',
      palettes: 'color palettes',
      cssTokens: 'CSS tokens',
      themeValues: 'theme values',
      independentTitle: 'Semantic palettes are independent',
      independentText:
        'Changing primary does not change success, warning or error colors. Override success, warning and danger only when required by your visual identity and when WCAG contrast remains sufficient.',
      availablePalettes: 'Available palettes',
      tokens: 'tokens',
      lightTheme: 'light theme',
      darkTheme: 'dark theme',
      light: 'Light',
      dark: 'Dark',
      overrideTitle: 'Override the colors',
      overrideText:
        'Import PEAUI styles first and your theme file afterwards. Variables with the same names then replace the defaults.',
      themesTitle: 'Light and dark themes',
      themesText:
        'Every token uses light-dark(light, dark) and responds to color-scheme. If your application enforces dark mode with body.dark-mode, override the same tokens in that selector too.',
      fullTokens: 'Complete list of {count} tokens to copy',
      generatedTokens: 'This set is generated directly from the library color source file.',
      fullDark: 'Complete values for body.dark-mode',
      darkHint:
        'Use these as a starting point when the theme is switched with a class on the body element.',
    },
    pl: {
      gettingStarted: 'Pierwsze kroki',
      forFramework: 'PEAUI dla',
      packageSingular: 'komponent w paczce',
      packagePlural: 'komponentów w paczce',
      reactTitle: '62 natywne komponenty React',
      reactNotice:
        'API React ma pełny katalog zgodny z Vue. Każdy model obsługuje tryb kontrolowany, wartość początkową default… i callback on…Change.',
      installTitle: '1. Instalacja',
      installText:
        'Zainstaluj jedną paczkę. Style i implementacje wszystkich technologii mają wspólne wersjonowanie.',
      vueSetupTitle: '2. Konfiguracja Vue',
      vueSetupText: 'Dołącz globalne style jeden raz przed zamontowaniem aplikacji.',
      firstTitle: '3. Pierwszy komponent',
      vueFirstText:
        'Główny entry point paczki jest przeznaczony dla Vue 3 i udostępnia nazwane eksporty.',
      directTitle: '4. Importy bezpośrednie',
      directText: 'Możesz importować pojedynczy komponent z jawnej ścieżki Vue.',
      reactRunTitle: '2. Uruchomienie w React',
      reactRunText:
        'Importuj komponent z jawnego poddrzewa @peaui/ui/react i dołącz wspólny arkusz stylów.',
      importRulesTitle: '3. Zasady importowania',
      importRulesText: 'Główne API paczki pozostaje API Vue. React ma osobne, stabilne podścieżki.',
      fullCatalogTitle: '4. Pełny katalog i dokumentacja',
      fullCatalogText:
        'Dokumentacja pokazuje wszystkie 62 komponenty z wariantami, edytorem propsów, gotowym kodem TSX, callbackami oraz treścią ReactNode.',
      viewReact: 'Zobacz komponenty React',
      registerTitle: '2. Rejestracja elementów',
      registerText:
        'Zaimportowanie modułu rejestruje dany element przez customElements.define. Importuj tylko elementy używane w aplikacji. Wszystkie 62 elementy korzystają ze wspólnej warstwy renderującej Vue, deklarowanej przez paczkę jako peer dependency, ale ich publicznym interfejsem pozostaje standard Custom Elements.',
      htmlTitle: '3. Użycie w HTML',
      htmlText:
        'Po rejestracji korzystasz z natywnych znaczników peaui-*. Proste wartości przekazuj jako atrybuty HTML.',
      eventsTitle: '4. Properties i zdarzenia',
      eventsText:
        'Zdarzenia są natywnymi CustomEvent. Dane znajdują się w event.detail. Flagi logiczne i wartości złożone ustawiaj przez właściwości elementu.',
      ssrTitle: '5. SSR i lazy loading',
      ssrText:
        'W środowisku renderowanym na serwerze wykonuj rejestrację po stronie klienta. Moduły można ładować dynamicznie razem z widokiem, który ich potrzebuje.',
      availabilityTitle: '6. Aktualna dostępność',
      availabilityText:
        'Katalog zawiera wyłącznie komponenty z rzeczywistą implementacją index.wc.ts, wraz z nazwą znacznika, atrybutami i zdarzeniami odczytanymi ze źródła.',
      viewWc: 'Zobacz Web Components',
      colorsTitle: 'Kolorystyka i tokeny CSS',
      colorsText:
        'Wszystkie implementacje korzystają z tego samego publicznego zestawu zmiennych CSS. Możesz nadpisać pojedynczy odcień albo całą paletę bez modyfikowania komponentów. Tokeny są wspólne dla Vue, React i Web Components.',
      colorSummary: 'Podsumowanie tokenów kolorystycznych',
      palettes: 'palet kolorów',
      cssTokens: 'tokeny CSS',
      themeValues: 'wartości motywu',
      independentTitle: 'Palety semantyczne są niezależne',
      independentText:
        'Zmiana primary nie zmienia kolorów sukcesu, ostrzeżeń ani błędów. Nadpisuj success, warning i danger tylko wtedy, gdy wymaga tego system identyfikacji wizualnej i zachowujesz odpowiedni kontrast WCAG.',
      availablePalettes: 'Dostępne palety',
      tokens: 'tokenów',
      lightTheme: 'motyw jasny',
      darkTheme: 'motyw ciemny',
      light: 'Jasny',
      dark: 'Ciemny',
      overrideTitle: 'Jak nadpisać kolorystykę',
      overrideText:
        'Najpierw zaimportuj style PEAUI, a dopiero później własny plik motywu. Dzięki temu zmienne o tej samej nazwie zastąpią wartości domyślne.',
      themesTitle: 'Motyw jasny i ciemny',
      themesText:
        'Każdy token korzysta z funkcji light-dark(jasny, ciemny) i reaguje na color-scheme. Jeżeli aplikacja wymusza tryb ciemny klasą body.dark-mode, nadpisz te same tokeny również w tym selektorze.',
      fullTokens: 'Pełna lista {count} tokenów do skopiowania',
      generatedTokens:
        'Poniższy zestaw jest generowany bezpośrednio z pliku źródłowego kolorów biblioteki.',
      fullDark: 'Pełne wartości dla body.dark-mode',
      darkHint: 'Użyj ich jako punktu wyjścia, gdy motyw jest przełączany klasą na elemencie body.',
    },
  }),
);
</script>

<template>
  <article class="article-page prose-page framework-guide">
    <header class="article-hero">
      <span class="eyebrow">{{ copy.gettingStarted }} · {{ frameworkDefinition.label }}</span>
      <h1>{{ copy.forFramework }} {{ frameworkDefinition.label }}</h1>
      <p>{{ frameworkDefinition.description }}</p>
      <div class="guide-summary">
        <span>{{ frameworkDefinition.badge }}</span>
        <strong>{{ availableComponents.length }}</strong>
        <small>{{
          availableComponents.length === 1 ? copy.packageSingular : copy.packagePlural
        }}</small>
      </div>
    </header>

    <div v-if="framework === 'react'" class="framework-notice">
      <strong>{{ copy.reactTitle }}</strong>
      <span>{{ copy.reactNotice }}</span>
    </div>

    <section id="instalacja">
      <h2>{{ copy.installTitle }}</h2>
      <p>{{ copy.installText }}</p>
      <CodeBlock :code="installCode" language="bash" />
    </section>

    <template v-if="framework === 'vue'">
      <section id="style">
        <h2>{{ copy.vueSetupTitle }}</h2>
        <p>{{ copy.vueSetupText }}</p>
        <CodeBlock :code="vueSetupCode" language="ts" />
      </section>
      <section id="uzycie">
        <h2>{{ copy.firstTitle }}</h2>
        <p>{{ copy.vueFirstText }}</p>
        <CodeBlock :code="vueUsageCode" />
      </section>
      <section id="importy">
        <h2>{{ copy.directTitle }}</h2>
        <p>{{ copy.directText }}</p>
        <CodeBlock :code="vueDirectImportCode" language="ts" />
      </section>
    </template>

    <template v-else-if="framework === 'react'">
      <section id="uzycie">
        <h2>{{ copy.reactRunTitle }}</h2>
        <p>{{ copy.reactRunText }}</p>
        <CodeBlock :code="reactUsageCode" language="tsx" />
      </section>
      <section id="importy">
        <h2>{{ copy.importRulesTitle }}</h2>
        <p>{{ copy.importRulesText }}</p>
        <CodeBlock :code="reactImportCode" language="ts" />
      </section>
      <section id="dostepnosc">
        <h2>{{ copy.fullCatalogTitle }}</h2>
        <p>{{ copy.fullCatalogText }}</p>
        <RouterLink class="inline-docs-link" to="/react/components">
          {{ copy.viewReact }} →
        </RouterLink>
      </section>
    </template>

    <template v-else>
      <section id="rejestracja">
        <h2>{{ copy.registerTitle }}</h2>
        <p>{{ copy.registerText }}</p>
        <CodeBlock :code="webComponentSetupCode" language="ts" />
      </section>
      <section id="html">
        <h2>{{ copy.htmlTitle }}</h2>
        <p>{{ copy.htmlText }}</p>
        <CodeBlock :code="webComponentHtmlCode" language="html" />
      </section>
      <section id="zdarzenia">
        <h2>{{ copy.eventsTitle }}</h2>
        <p>{{ copy.eventsText }}</p>
        <CodeBlock :code="webComponentEventsCode" language="ts" />
      </section>
      <section id="ssr">
        <h2>{{ copy.ssrTitle }}</h2>
        <p>{{ copy.ssrText }}</p>
        <CodeBlock :code="webComponentLazyCode" language="ts" />
      </section>
      <section id="dostepnosc">
        <h2>{{ copy.availabilityTitle }}</h2>
        <p>{{ copy.availabilityText }}</p>
        <RouterLink class="inline-docs-link" to="/web-components/components">
          {{ copy.viewWc }} →
        </RouterLink>
      </section>
    </template>

    <section id="kolorystyka">
      <h2>{{ framework === 'web-components' ? '7' : '5' }}. {{ copy.colorsTitle }}</h2>
      <p>{{ copy.colorsText }}</p>

      <div class="color-token-overview" :aria-label="copy.colorSummary">
        <div>
          <strong>{{ colorPalettes.length }}</strong
          ><span>{{ copy.palettes }}</span>
        </div>
        <div>
          <strong>{{ colorTokenCount }}</strong
          ><span>{{ copy.cssTokens }}</span>
        </div>
        <div>
          <strong>2</strong><span>{{ copy.themeValues }}</span>
        </div>
      </div>

      <div class="color-token-note">
        <strong>{{ copy.independentTitle }}</strong>
        <span>{{ copy.independentText }}</span>
      </div>

      <h3>{{ copy.availablePalettes }}</h3>
      <div class="color-palette-list">
        <section
          v-for="palette in paletteDescriptions"
          :key="palette.key"
          class="color-palette-section"
          :aria-labelledby="`palette-${palette.key}`"
        >
          <header class="color-palette-section__header">
            <div>
              <h4 :id="`palette-${palette.key}`">{{ palette.label }}</h4>
              <p>{{ palette.description }}</p>
            </div>
            <span>{{ palette.tokens.length }} {{ copy.tokens }}</span>
          </header>

          <div class="color-token-grid">
            <article v-for="token in palette.tokens" :key="token.cssVariable">
              <div class="color-token-swatches">
                <span
                  role="img"
                  :aria-label="`${palette.label} ${token.level}, ${copy.lightTheme}: ${token.light}`"
                  :style="{ backgroundColor: token.light }"
                />
                <span
                  role="img"
                  :aria-label="`${palette.label} ${token.level}, ${copy.darkTheme}: ${token.dark}`"
                  :style="{ backgroundColor: token.dark }"
                />
              </div>
              <strong>{{ palette.label }} {{ token.level }}</strong>
              <code>{{ token.cssVariable }}</code>
              <dl>
                <div>
                  <dt>{{ copy.light }}</dt>
                  <dd>{{ token.light }}</dd>
                </div>
                <div>
                  <dt>{{ copy.dark }}</dt>
                  <dd>{{ token.dark }}</dd>
                </div>
              </dl>
            </article>
          </div>
        </section>
      </div>

      <h3>{{ copy.overrideTitle }}</h3>
      <p>{{ copy.overrideText }}</p>
      <CodeBlock :code="themeImportOrderCode" language="ts" />
      <CodeBlock :code="colorOverrideCode" language="css" />

      <h3>{{ copy.themesTitle }}</h3>
      <p>{{ copy.themesText }}</p>

      <details class="color-token-code-details">
        <summary>{{ copy.fullTokens.replace('{count}', String(colorTokenCount)) }}</summary>
        <p>{{ copy.generatedTokens }}</p>
        <CodeBlock :code="colorTokensCode" language="css" />
      </details>

      <details class="color-token-code-details">
        <summary>{{ copy.fullDark }}</summary>
        <p>{{ copy.darkHint }}</p>
        <CodeBlock :code="explicitDarkModeTokensCode" language="css" />
      </details>
    </section>
  </article>
</template>
