<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

import CodeBlock from '../components/CodeBlock.vue';
import { getCatalogComponents } from '../data/catalog-summary';
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
const availableComponents = computed(() => getCatalogComponents(framework.value));

const installCode = computed(() => {
  if (framework.value === 'react') {
    return 'npm install @peaui/ui "react@^19.2.0" "react-dom@^19.2.0"';
  }

  return 'npm install @peaui/ui "vue@^3.5.0"';
});

const vueSetupCode = `import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');`;
const vueUsageCode = computed(
  () => `<script setup lang="ts">
import FormInput from '@peaui/ui/vue/form/FormInput';
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
// ${localize({ en: 'The component module loads its required CSS automatically.', pl: 'Moduł komponentu automatycznie ładuje wymagany CSS.' })}
// ${localize({ en: 'Backward-compatible Vue path:', pl: 'Zgodna wstecznie ścieżka Vue:' })}
import ButtonActionLegacy from '@peaui/ui/data-entry/ButtonAction';`,
);

const reactUsageCode = computed(
  () => `import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import FormInput from '@peaui/ui/react/form/FormInput';

function App() {
  const [name, setName] = useState('');

  return (
    <FormInput
      id="name"
      name="name"
      label="${localize({ en: 'Name', pl: 'Nazwa' })}"
      value={name}
      onValueChange={(value) => setName(value ?? '')}
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

const webComponentSetupCode = computed(
  () => `// ${localize({ en: 'A module registers its element and required child elements. Repeated imports are safe.', pl: 'Moduł rejestruje element i wymagane elementy potomne. Ponowny import jest bezpieczny.' })}
import '@peaui/ui/wc/data-entry/ButtonAction';
import '@peaui/ui/wc/form/FormInput';

// ${localize({ en: 'This catalog entry provides tag names and types without registering all elements.', pl: 'Ten moduł udostępnia nazwy i typy tagów bez rejestrowania wszystkich elementów.' })}
import { PEAUI_WEB_COMPONENT_TAG_NAMES } from '@peaui/ui/web-components';

console.log(PEAUI_WEB_COMPONENT_TAG_NAMES);`,
);
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
  () => `import type { FormInputElement } from '@peaui/ui/wc/form/FormInput';

const input = document.querySelector<FormInputElement>('peaui-form-input');

input?.addEventListener('update:value', (event) => {
  const value = (event as CustomEvent<string>).detail;
  console.log('${localize({ en: 'New value:', pl: 'Nowa wartość:' })}', value);
});

// ${localize({ en: 'Boolean attribute presence means true; assign properties when toggling:', pl: 'Obecność atrybutu logicznego oznacza true; przy zmianie używaj properties:' })}
if (input) {
  input.disabled = true;
  input.disabled = false;
}`,
);

const namedImportsCode = computed(
  () => `import { defineConfig } from 'vite';
import { peauiImports } from '@peaui/ui/vite';

// ${localize({ en: 'Add peauiImports() alongside your existing Vue or React plugin.', pl: 'Dodaj peauiImports() obok używanego pluginu Vue albo React.' })}
export default defineConfig({ plugins: [peauiImports()] });

// ${localize({ en: 'The transform rewrites named component imports to direct paths:', pl: 'Transformacja zamienia nazwane importy komponentów na ścieżki bezpośrednie:' })}
import { FormInput } from '@peaui/ui/${framework.value === 'react' ? 'react' : 'vue'}';`,
);

const clientStylesCode = `// Client/bundler entry
import '@peaui/ui/styles.css';`;
const webComponentLazyCode = computed(
  () => `// ${localize({ en: 'In an SSR app, register elements only on the client.', pl: 'W aplikacji SSR rejestruj elementy wyłącznie po stronie klienta.' })}
if (typeof window !== 'undefined') {
  await import('@peaui/ui/wc/feedback/ToastAlert');
}`,
);

const themeImportOrderCode = computed(() => {
  const componentImport =
    framework.value === 'react'
      ? `import FormInput from '@peaui/ui/react/form/FormInput';`
      : framework.value === 'web-components'
        ? `import '@peaui/ui/wc/form/FormInput';`
        : `import FormInput from '@peaui/ui/vue/form/FormInput';`;

  return `${componentImport}
import './peaui-theme.css'; // ${localize({ en: 'custom tokens must follow the component import', pl: 'własne tokeny muszą być za importem komponentu' })}`;
});

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
      reactTitle: `${availableComponents.value.length} native React components`,
      reactNotice:
        'The React catalog uses native React implementations. Models expose value/onValueChange, open/onOpenChange or other documented pairs. Use defaultValue or defaultOpen only where the component API lists them.',
      installTitle: '1. Installation',
      requirements:
        'Vue and the complete Web Components catalog require Vue ^3.5.0. React requires react and react-dom ^19.2.0. The optional Vite import plugin supports Vite ^6.4.0 or ^7.0.0. Package installation assumes an existing application and bundler; bare npm specifiers do not run directly in an HTML module without resolution.',
      modelsTitle: 'State, content and forms',
      modelsText:
        'Vue uses named v-model bindings and slots; React uses documented model/callback pairs, children and named content or render props. Web Components use properties, update:* events and light-DOM slots. A change notification is not a replacement for updating controlled application state. Supply localized labels, descriptions and errors, and choose keyboard and focus behavior from the component guide.',
      formsText:
        'Set a unique id and a submission name on form fields. Native reset restores initial values in supported uncontrolled controls; reset controlled Vue/React application state in the form handler. Pass form when a control exposes it and belongs to a form elsewhere in the document. Prefer component label props; a Web Component host ID is not necessarily the native input ID.',
      namedImportsTitle: 'Named imports with Vite',
      namedImportsText:
        'Aggregate imports can retain CSS from the full catalog. Keep named imports and component-sized CSS with the optional peauiImports transform. It supports @peaui/ui, @peaui/ui/vue and @peaui/ui/react; add it to your existing Vite configuration.',
      nodeTitle: 'Node and server rendering',
      nodeText:
        'Vue and React node exports omit CSS so they can be imported by Node without a CSS loader. Include the stylesheet in the client/bundler entry if your server integration uses those exports. Keep initial props and content identical on server and client; browser actions and custom-element registration belong on the client.',
      installText:
        'In an existing application, install PEAUI with the supported runtime for your target. Framework runtimes are optional peers, so install the one you use explicitly. Browser/bundler component entries automatically include required styles and child-component dependencies.',
      vueSetupTitle: '2. Vue setup',
      vueSetupText: 'No global stylesheet import is required before mounting the application.',
      firstTitle: '3. First component',
      vueFirstText:
        'An explicit Vue component entry provides a default export and automatically includes its required styles.',
      directTitle: '4. Direct imports',
      directText:
        'Import one component from an explicit Vue path to load only its code, styles and component dependencies. The root @peaui/ui entry remains a backward-compatible aggregate Vue API.',
      reactRunTitle: '2. Run in React',
      reactRunText:
        'Import a component from the explicit @peaui/ui/react subtree. Its required CSS is included automatically.',
      importRulesTitle: '3. Import rules',
      importRulesText:
        'The main @peaui/ui entry and @peaui/ui/vue export Vue components. React exposes direct paths and named exports through @peaui/ui/react. Direct imports keep the dependency and CSS graph limited to the selected components.',
      fullCatalogTitle: '4. Full catalog and documentation',
      fullCatalogText: `The documentation covers all ${availableComponents.value.length} components with variants, a props editor, ready TSX, callbacks and ReactNode content.`,
      viewReact: 'View React components',
      registerTitle: '2. Register elements',
      registerText: `A module registers its element and required child elements, with required CSS included by the bundler. Import only the elements you use. The catalog combines native DOM elements with Vue-backed adapters; install Vue to use the complete catalog. The public API uses standard Custom Elements and light DOM.`,
      htmlTitle: '3. Use in HTML',
      htmlText:
        'After registration, use native peaui-* tags. Pass simple values as HTML attributes. For booleans, attribute presence means true and absence means false.',
      eventsTitle: '4. Properties and events',
      eventsText:
        'Events are native CustomEvents. A single emitted argument is event.detail; multiple arguments are an array in declaration order. Assign arrays, objects and callbacks as element properties, never JSON attributes. Boolean attribute presence means true: disabled="false" still disables. Consult the component API for event names and signatures.',
      ssrTitle: '5. SSR and lazy loading',
      ssrText:
        'In server-rendered environments, register elements on the client. Modules can be loaded dynamically with the view that uses them.',
      availabilityTitle: '6. Current availability',
      availabilityText:
        'Every catalog entry has a registered peaui-* element. @peaui/ui/web-components exports tag-name metadata without registering the catalog; the package custom-elements.json describes attributes, properties, events and slots. Default and named light-DOM children remain application-owned nodes.',
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
        'Import a PEAUI component first and your theme file afterwards. Variables with the same names then replace the defaults. The optional @peaui/ui/styles.css entry remains available when you intentionally need the full catalog stylesheet.',
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
      reactTitle: `${availableComponents.value.length} natywnych komponentów React`,
      reactNotice:
        'Katalog React używa natywnych implementacji React. Modele udostępniają pary value/onValueChange, open/onOpenChange lub inne opisane w API. Używaj defaultValue lub defaultOpen tylko tam, gdzie wymienia je API komponentu.',
      installTitle: '1. Instalacja',
      requirements:
        'Vue i pełny katalog Web Components wymagają Vue ^3.5.0. React wymaga react i react-dom ^19.2.0. Opcjonalny plugin importów obsługuje Vite ^6.4.0 albo ^7.0.0. Instalacja zakłada istniejącą aplikację i bundler; specyfikatory npm nie działają bezpośrednio w module HTML bez mechanizmu ich rozwiązywania.',
      modelsTitle: 'Stan, treść i formularze',
      modelsText:
        'Vue korzysta z nazwanych wiązań v-model i slotów; React z opisanych par model/callback, children oraz propsów treści i funkcji renderujących. Web Components korzystają z properties, zdarzeń update:* i slotów light DOM. Powiadomienie o zmianie wymaga aktualizacji kontrolowanego stanu aplikacji. Podaj lokalizowane etykiety, opisy i błędy; zachowanie klawiatury i fokusu sprawdź w przewodniku komponentu.',
      formsText:
        'Nadaj polom unikalne id i name używane podczas wysyłania. Natywny reset przywraca stan początkowy obsługiwanych pól niekontrolowanych; kontrolowany stan Vue/React resetuj w obsłudze formularza. Użyj form, jeśli kontrolka je udostępnia i należy do formularza poza swoim drzewem DOM. Preferuj prop label; id hosta Web Component nie musi być identyfikatorem natywnego inputa.',
      namedImportsTitle: 'Nazwane importy w Vite',
      namedImportsText:
        'Import zbiorczy może zachować CSS całego katalogu. Opcjonalna transformacja peauiImports pozwala używać nazwanych importów ze stylami wybranych komponentów. Obsługuje @peaui/ui, @peaui/ui/vue i @peaui/ui/react; dodaj ją do obecnej konfiguracji Vite.',
      nodeTitle: 'Node i renderowanie na serwerze',
      nodeText:
        'Eksporty node dla Vue i React pomijają CSS, aby Node mógł je importować bez loadera stylów. Dołącz arkusz w punkcie wejścia klienta lub bundlera, jeśli integracja serwerowa korzysta z tych eksportów. Utrzymuj identyczne początkowe propsy i treść na serwerze oraz kliencie; akcje przeglądarki i rejestrację custom elements wykonuj po stronie klienta.',
      installText:
        'W istniejącej aplikacji zainstaluj PEAUI z obsługiwaną wersją runtime’u wybranej technologii. Runtime’y są opcjonalnymi peer dependencies, dlatego jawnie zainstaluj używany. Entry pointy dla przeglądarki i bundlera dołączają wymagane style oraz zależności komponentów potomnych.',
      vueSetupTitle: '2. Konfiguracja Vue',
      vueSetupText:
        'Przed zamontowaniem aplikacji nie musisz importować globalnego arkusza stylów.',
      firstTitle: '3. Pierwszy komponent',
      vueFirstText:
        'Jawny entry point komponentu Vue udostępnia domyślny eksport i automatycznie dołącza wymagane style.',
      directTitle: '4. Importy bezpośrednie',
      directText:
        'Importuj pojedynczy komponent z jawnej ścieżki Vue, aby załadować tylko jego kod, style i zależności komponentowe. Główny entry point @peaui/ui pozostaje zbiorczym API Vue zachowanym dla zgodności.',
      reactRunTitle: '2. Uruchomienie w React',
      reactRunText:
        'Importuj komponent z jawnego poddrzewa @peaui/ui/react. Wymagany CSS zostanie dołączony automatycznie.',
      importRulesTitle: '3. Zasady importowania',
      importRulesText:
        'Główne API @peaui/ui i @peaui/ui/vue eksportuje komponenty Vue. React udostępnia ścieżki bezpośrednie i nazwane eksporty przez @peaui/ui/react. Importy bezpośrednie ograniczają zależności i CSS do wybranych komponentów.',
      fullCatalogTitle: '4. Pełny katalog i dokumentacja',
      fullCatalogText: `Dokumentacja pokazuje wszystkie ${availableComponents.value.length} komponentów z wariantami, edytorem propsów, gotowym kodem TSX, callbackami oraz treścią ReactNode.`,
      viewReact: 'Zobacz komponenty React',
      registerTitle: '2. Rejestracja elementów',
      registerText: `Moduł rejestruje element oraz wymagane elementy potomne; bundler dołącza wymagany CSS. Importuj używane elementy. Katalog łączy implementacje oparte na natywnym DOM z adapterami Vue, dlatego pełny katalog wymaga instalacji Vue. Publiczne API korzysta ze standardu Custom Elements i light DOM.`,
      htmlTitle: '3. Użycie w HTML',
      htmlText:
        'Po rejestracji korzystasz z natywnych znaczników peaui-*. Proste wartości przekazuj jako atrybuty HTML. Dla wartości logicznych obecność atrybutu oznacza true, a jego brak false.',
      eventsTitle: '4. Properties i zdarzenia',
      eventsText:
        'Zdarzenia są natywnymi CustomEvent. Jeden argument znajduje się w event.detail, a wiele argumentów tworzy tablicę w kolejności deklaracji. Tablice, obiekty i callbacki przypisuj jako properties, bez atrybutów JSON. Obecność atrybutu logicznego oznacza true: disabled="false" nadal wyłącza kontrolkę. Nazwy i sygnatury zdarzeń sprawdzaj w API komponentu.',
      ssrTitle: '5. SSR i lazy loading',
      ssrText:
        'W środowisku renderowanym na serwerze wykonuj rejestrację po stronie klienta. Moduły można ładować dynamicznie razem z widokiem, który ich potrzebuje.',
      availabilityTitle: '6. Aktualna dostępność',
      availabilityText:
        'Każda pozycja katalogu ma element peaui-*. @peaui/ui/web-components eksportuje metadane nazw tagów bez rejestracji katalogu; plik custom-elements.json opisuje atrybuty, properties, zdarzenia i sloty. Dzieci domyślne i z nazwanym slotem pozostają węzłami light DOM należącymi do aplikacji.',
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
        'Najpierw zaimportuj komponent PEAUI, a dopiero później własny plik motywu. Zmienne o tej samej nazwie zastąpią wtedy wartości domyślne. Opcjonalny entry point @peaui/ui/styles.css pozostaje dostępny, gdy celowo potrzebujesz stylów całego katalogu.',
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
      <p>{{ copy.requirements }}</p>
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

    <section id="modele-formularze">
      <h2>{{ copy.modelsTitle }}</h2>
      <p>{{ copy.modelsText }}</p>
      <p>{{ copy.formsText }}</p>
    </section>

    <template v-if="framework !== 'web-components'">
      <section id="vite-imports">
        <h2>{{ copy.namedImportsTitle }}</h2>
        <p>{{ copy.namedImportsText }}</p>
        <CodeBlock :code="namedImportsCode" language="ts" />
      </section>
      <section id="node-ssr">
        <h2>{{ copy.nodeTitle }}</h2>
        <p>{{ copy.nodeText }}</p>
        <CodeBlock :code="clientStylesCode" language="ts" />
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
