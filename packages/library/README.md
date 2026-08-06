<p align="center">
  <img src="./peaui-logo.png" alt="PEAUI" width="360" />
</p>

<h1 align="center">@peaui/ui</h1>

<p align="center">
  An accessible, typed and framework-flexible component library for Vue, React and Web Components.
</p>

<p align="center">
  <a href="#english">English</a> · <a href="#polski">Polski</a>
</p>

---

<a id="english"></a>

# PEAUI component library

PEAUI is a continuously developed UI component library for building consistent, readable and accessible web interfaces. It provides one visual language and a shared styling layer across three integration targets:

- Vue 3 components;
- native React components;
- standards-based Web Components.

The current catalog contains **62 components**. New components, variants and improvements will be added as the library evolves.

## What PEAUI is for

PEAUI helps product teams avoid rebuilding common interface elements in every application. It includes primitives and larger interface patterns for forms, data presentation, navigation, feedback, layout and overlays.

The library is useful when you need:

- a consistent design system across multiple applications;
- the same component appearance in Vue, React and framework-independent projects;
- TypeScript definitions and predictable component APIs;
- reusable form, table, navigation and feedback patterns;
- accessible interaction patterns and keyboard-friendly controls;
- configurable colors, typography and dark mode;
- per-component imports instead of loading the entire catalog.

## How it works

All three implementations use the same PEAUI design tokens and the same published stylesheet. This keeps spacing, typography, colors, states and responsive behavior aligned across frameworks.

The public API follows the conventions of each target:

| Target         | Integration model                                   | State and events                                                    |
| -------------- | --------------------------------------------------- | ------------------------------------------------------------------- |
| Vue 3          | Native Vue single-file components                   | props, slots, emits and `v-model`                                   |
| React 19       | Native React components, not Web Component wrappers | controlled/uncontrolled props and callbacks such as `onValueChange` |
| Web Components | Custom Elements registered under `peaui-*` tags     | attributes, DOM properties, slots and `CustomEvent`                 |

The component behavior and visual result are kept equivalent, while the API remains idiomatic for the selected technology.

## Supported technologies

| Technology     | Required version                             | Import path                        |
| -------------- | -------------------------------------------- | ---------------------------------- |
| Vue            | `^3.4.0`                                     | `@peaui/ui` or `@peaui/ui/vue/...` |
| React          | `^19.2.0`                                    | `@peaui/ui/react/...`              |
| React DOM      | `^19.2.0`                                    | used with React components         |
| Web Components | Modern browsers with Custom Elements support | `@peaui/ui/wc/...`                 |

Vue is currently a required peer dependency of the package and is also used by the Custom Elements runtime. React and React DOM are optional peer dependencies and are only required when React entry points are imported.

## Installation

Install the package from npm:

```bash
npm install @peaui/ui
```

For a React application, make sure the React peers are also installed:

```bash
npm install @peaui/ui react react-dom
```

Import the shared stylesheet once in the application entry point:

```ts
import '@peaui/ui/styles.css';
```

The stylesheet is also available through the backward-compatible `@peaui/ui/style.css` path.

## Using PEAUI with Vue

Components can be imported from the main Vue API:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { FormInput } from '@peaui/ui';
import '@peaui/ui/styles.css';

const name = ref('');
</script>

<template>
  <FormInput
    v-model:value="name"
    id="first-name"
    name="firstName"
    label="First name"
    placeholder="Enter your first name"
  />
</template>
```

Use a per-component entry point when you only need one component:

```ts
import FormInput from '@peaui/ui/vue/form/FormInput';
```

Existing framework-less component paths remain Vue-compatible:

```ts
import FormInput from '@peaui/ui/form/FormInput';
```

Vue components expose typed props, named slots, emitted events and model bindings. The exact API for every component is available in the documentation portal.

## Using PEAUI with React

Yes — PEAUI provides **native React components**. They are React implementations with React props, callbacks, JSX children and React lifecycle behavior. They do not render the PEAUI Web Components as wrappers.

```tsx
import { useState } from 'react';
import FormInput from '@peaui/ui/react/form/FormInput';
import '@peaui/ui/styles.css';

export function ProfileForm() {
  const [name, setName] = useState('');

  return (
    <FormInput
      id="first-name"
      name="firstName"
      label="First name"
      placeholder="Enter your first name"
      value={name}
      onValueChange={setName}
    />
  );
}
```

React model props follow familiar controlled and uncontrolled conventions such as `value`, `defaultValue` and `onValueChange`. Other models use equivalent names, including `open`, `page` and `file`.

The root import `@peaui/ui` is the Vue API. React consumers should use the explicit `@peaui/ui/react/<category>/<Component>` paths.

## Using PEAUI as Web Components

Web Components can be used with plain HTML and JavaScript or in any environment that supports Custom Elements.

Importing a component module registers its `peaui-*` element:

```ts
import '@peaui/ui/styles.css';
import '@peaui/ui/wc/form/FormInput';
```

```html
<peaui-form-input
  id="first-name"
  name="firstName"
  label="First name"
  placeholder="Enter your first name"
  value="Ada"
></peaui-form-input>
```

Primitive values can be passed as HTML attributes. Booleans, objects, arrays and other complex values should be assigned as DOM properties:

```ts
const input = document.querySelector('peaui-form-input');

if (input) {
  input.value = 'Ada';
  input.disabled = false;
}
```

Component events are native `CustomEvent` instances. The emitted value is available through `event.detail`:

```ts
const input = document.querySelector('peaui-form-input');

input?.addEventListener('update:value', (event) => {
  const value = (event as CustomEvent<string>).detail;
  console.log(value);
});
```

Named content uses standard HTML slots:

```html
<peaui-form-input id="email" name="email" label="Email">
  <span slot="hint">We will only use this address to contact you.</span>
</peaui-form-input>
```

Each Web Component module also exports its element class and a `define<ComponentName>` registration function for explicit registration scenarios.

## Components included

The catalog is organized into the following groups:

- **Basic** — images, icons and image editing;
- **Data display** — tables, cards, trees, counters, tags and structured values;
- **Data entry** — actions, search, selection and sliders;
- **Feedback** — alerts, empty states, progress, skeletons and loaders;
- **Form** — inputs, textareas, checkboxes, radios, selects, date pickers and file uploads;
- **Layout** — pages, grids, cards, sections and fullscreen containers;
- **Navigation** — breadcrumbs, links, tabs, pagination, steppers and navigation cards;
- **Overlays** — dialogs, drawers, popovers and tooltips.

The documentation portal is the source of truth for the complete, current component list and each component's props, inputs, events, slots and variants.

## Styling and theming

PEAUI ships one shared stylesheet for Vue, React and Web Components:

```ts
import '@peaui/ui/styles.css';
```

The visual system is configurable through CSS custom properties. The primary PEAUI palette is green, and semantic palettes such as success, warning and danger remain independent.

```css
:root {
  --peaui-color-primary-400: #86cb16;
  --peaui-color-primary-500: #5fa907;
  --peaui-color-primary-600: #3f8205;
}
```

Override the complete `50`–`900` scale when introducing a custom brand palette so that hover, focus, active and contrast states stay coherent. The documentation includes the complete token reference for primary, success, warning, danger, violet, grey and typography variables.

PEAUI follows the browser color scheme through `light-dark()`. Dark mode can also be selected explicitly:

```ts
document.body.classList.add('dark-mode');
```

## Accessibility

PEAUI is designed around accessible interface patterns. Depending on the component, this includes semantic HTML, keyboard navigation, focus states, accessible names, ARIA attributes and screen-reader announcements.

Accessibility still depends on correct application usage. Consumers must provide meaningful labels, alternative text and content, and should validate the final product against their accessibility requirements. The component documentation describes important accessibility inputs where applicable.

## TypeScript and package formats

The package includes TypeScript declarations for the root API and every Vue, React and Web Component entry point. It provides ESM and CommonJS builds, plus per-component imports that allow applications to include only the components they use.

## Documentation

PEAUI has a dedicated documentation portal independent of Storybook. It includes:

- separate Vue, React and Web Components sections;
- installation and first-step guides for every target;
- live component previews and editable props;
- component descriptions, inputs, props, events and slots;
- variants and generated usage examples;
- the complete icon catalog;
- color and design-token documentation;
- English and Polish language versions, with English selected by default;
- search across components and resources.

The documentation application is located in the repository at:

```text
packages/docs
```

Run it from the monorepo root:

```bash
npm install
npm run docs
```

The portal opens at [http://localhost:4174](http://localhost:4174).

Build or preview the production documentation with:

```bash
npm run docs:build
npm run docs:preview
```

Repository: [https://github.com/webonweb/peaui](https://github.com/webonweb/peaui)

## Development

Useful commands, run from the monorepo root:

```bash
# Run the documentation portal
npm run docs

# Run linting, formatting checks, type checks, tests and builds
npm run check

# Build the library and the documentation portal
npm run build

# Build the publishable library
npm run library:build

# Run Vue, React and Web Component test suites
npm run test
```

## Releasing to npm

The project follows semantic versioning and supports Changesets. Before publishing, run the complete release verification:

```bash
npm run release:check
```

Inspect the package without publishing it:

```bash
npm run release:pack:dry-run
npm run release:npm:dry-run
```

Publish the verified public package to npm:

```bash
npm login
npm run release:npm
```

For a Changesets-based release flow, create and publish version changes with:

```bash
npm run changeset
npm run release:version
npm run release:changesets
```

## Project direction

PEAUI is actively developed. The catalog will continue to grow with new components, additional variants, accessibility improvements, documentation and framework-parity updates. Vue, React and Web Components are treated as first-class delivery targets, and shared styles keep their visual output aligned.

## Support and issues

Report defects and feature requests in the [project issue tracker](https://github.com/webonweb/peaui/-/issues).

## License

PEAUI is available under the [MIT license](./LICENSE).

---

<a id="polski"></a>

# Biblioteka komponentów PEAUI

PEAUI to stale rozwijana biblioteka komponentów interfejsu przeznaczona do budowania spójnych, czytelnych i dostępnych aplikacji internetowych. Zapewnia jeden język wizualny i wspólną warstwę stylów dla trzech sposobów integracji:

- komponentów Vue 3;
- natywnych komponentów React;
- zgodnych ze standardami Web Components.

Aktualny katalog zawiera **62 komponenty**. Wraz z rozwojem biblioteki będą pojawiały się kolejne komponenty, warianty oraz ulepszenia.

## Do czego służy PEAUI

PEAUI pozwala zespołom produktowym uniknąć ponownego tworzenia tych samych elementów interfejsu w każdej aplikacji. Zawiera zarówno podstawowe kontrolki, jak i większe wzorce przeznaczone do formularzy, prezentacji danych, nawigacji, komunikatów, układów stron oraz warstw nakładanych.

Biblioteka jest przydatna, gdy potrzebujesz:

- spójnego design systemu w wielu aplikacjach;
- identycznego wyglądu komponentów w Vue, React i projektach niezależnych od frameworka;
- definicji TypeScript i przewidywalnego API komponentów;
- gotowych wzorców formularzy, tabel, nawigacji i komunikatów;
- dostępnych interakcji i obsługi klawiatury;
- konfigurowalnych kolorów, typografii oraz trybu ciemnego;
- importowania pojedynczych komponentów bez ładowania całego katalogu.

## Jak działa biblioteka

Wszystkie trzy implementacje korzystają z tych samych tokenów projektowych PEAUI i tego samego publikowanego arkusza stylów. Dzięki temu odstępy, typografia, kolory, stany oraz zachowanie responsywne pozostają zgodne niezależnie od użytej technologii.

Publiczne API jest dopasowane do konwencji każdego środowiska:

| Technologia    | Model integracji                                        | Stan i zdarzenia                                                          |
| -------------- | ------------------------------------------------------- | ------------------------------------------------------------------------- |
| Vue 3          | Natywne komponenty Single File Components               | propsy, sloty, emitowane zdarzenia i `v-model`                            |
| React 19       | Natywne komponenty React, a nie wrappery Web Components | propsy kontrolowane i niekontrolowane oraz callbacki, np. `onValueChange` |
| Web Components | Custom Elements rejestrowane jako tagi `peaui-*`        | atrybuty, właściwości DOM, sloty i `CustomEvent`                          |

Zachowanie oraz rezultat wizualny komponentów są utrzymywane na równym poziomie, natomiast API pozostaje naturalne dla wybranej technologii.

## Obsługiwane technologie

| Technologia    | Wymagana wersja                                      | Ścieżka importu                     |
| -------------- | ---------------------------------------------------- | ----------------------------------- |
| Vue            | `^3.4.0`                                             | `@peaui/ui` lub `@peaui/ui/vue/...` |
| React          | `^19.2.0`                                            | `@peaui/ui/react/...`               |
| React DOM      | `^19.2.0`                                            | używany razem z komponentami React  |
| Web Components | współczesne przeglądarki obsługujące Custom Elements | `@peaui/ui/wc/...`                  |

Vue jest obecnie wymaganym peer dependency paczki i jest również wykorzystywane przez runtime Custom Elements. React oraz React DOM są opcjonalnymi peer dependencies i są potrzebne wyłącznie podczas korzystania z Reactowych punktów wejścia.

## Instalacja

Zainstaluj paczkę z NPM-a:

```bash
npm install @peaui/ui
```

W aplikacji React upewnij się, że zależności React są również zainstalowane:

```bash
npm install @peaui/ui react react-dom
```

Zaimportuj wspólny arkusz stylów jeden raz w głównym pliku aplikacji:

```ts
import '@peaui/ui/styles.css';
```

Arkusz jest dostępny również przez zachowaną dla zgodności ścieżkę `@peaui/ui/style.css`.

## Korzystanie z PEAUI w Vue

Komponenty można importować z głównego API Vue:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { FormInput } from '@peaui/ui';
import '@peaui/ui/styles.css';

const name = ref('');
</script>

<template>
  <FormInput
    v-model:value="name"
    id="first-name"
    name="firstName"
    label="Imię"
    placeholder="Wpisz imię"
  />
</template>
```

Jeżeli potrzebujesz tylko jednego komponentu, skorzystaj z jego punktu wejścia:

```ts
import FormInput from '@peaui/ui/vue/form/FormInput';
```

Dotychczasowe ścieżki bez nazwy frameworka pozostają zgodne z Vue:

```ts
import FormInput from '@peaui/ui/form/FormInput';
```

Komponenty Vue udostępniają typowane propsy, nazwane sloty, emitowane zdarzenia oraz powiązania modeli. Dokładne API każdego komponentu znajduje się w portalu dokumentacji.

## Korzystanie z PEAUI w React

Tak — PEAUI udostępnia **natywne komponenty Reactowe**. Są to implementacje korzystające z Reactowych propsów, callbacków, JSX children i cyklu życia Reacta. Nie są wrapperami renderującymi Web Components.

```tsx
import { useState } from 'react';
import FormInput from '@peaui/ui/react/form/FormInput';
import '@peaui/ui/styles.css';

export function ProfileForm() {
  const [name, setName] = useState('');

  return (
    <FormInput
      id="first-name"
      name="firstName"
      label="Imię"
      placeholder="Wpisz imię"
      value={name}
      onValueChange={setName}
    />
  );
}
```

Modele React korzystają ze znanych konwencji kontrolowanych i niekontrolowanych, takich jak `value`, `defaultValue` oraz `onValueChange`. Pozostałe modele używają analogicznych nazw, między innymi `open`, `page` i `file`.

Główny import `@peaui/ui` jest API Vue. W React należy korzystać z jawnych ścieżek `@peaui/ui/react/<kategoria>/<Komponent>`.

## Korzystanie z PEAUI jako Web Components

Web Components mogą być używane w zwykłym HTML-u i JavaScripcie oraz w dowolnym środowisku obsługującym Custom Elements.

Import modułu komponentu rejestruje odpowiadający mu element `peaui-*`:

```ts
import '@peaui/ui/styles.css';
import '@peaui/ui/wc/form/FormInput';
```

```html
<peaui-form-input
  id="first-name"
  name="firstName"
  label="Imię"
  placeholder="Wpisz imię"
  value="Ada"
></peaui-form-input>
```

Wartości proste można przekazywać jako atrybuty HTML. Wartości logiczne, obiekty, tablice i inne dane złożone najlepiej ustawiać jako właściwości DOM:

```ts
const input = document.querySelector('peaui-form-input');

if (input) {
  input.value = 'Ada';
  input.disabled = false;
}
```

Zdarzenia komponentów są natywnymi instancjami `CustomEvent`. Emitowana wartość znajduje się w `event.detail`:

```ts
const input = document.querySelector('peaui-form-input');

input?.addEventListener('update:value', (event) => {
  const value = (event as CustomEvent<string>).detail;
  console.log(value);
});
```

Nazwana zawartość korzysta ze standardowych slotów HTML:

```html
<peaui-form-input id="email" name="email" label="E-mail">
  <span slot="hint">Adres wykorzystamy wyłącznie do kontaktu.</span>
</peaui-form-input>
```

Każdy moduł Web Component eksportuje także klasę elementu oraz funkcję rejestrującą `define<NazwaKomponentu>`, przeznaczoną do scenariuszy wymagających jawnej rejestracji.

## Dostępne komponenty

Katalog jest podzielony na następujące grupy:

- **Basic** — obrazy, ikony oraz edycja zdjęć;
- **Data display** — tabele, karty, drzewa, liczniki, tagi i dane strukturalne;
- **Data entry** — akcje, wyszukiwanie, wybór oraz suwaki;
- **Feedback** — alerty, puste stany, postęp, szkielety i loadery;
- **Form** — inputy, textarea, checkboxy, radio, selecty, wybór daty i przesyłanie plików;
- **Layout** — strony, siatki, karty, sekcje oraz kontenery pełnoekranowe;
- **Navigation** — breadcrumbs, linki, zakładki, paginacja, kroki i karty nawigacyjne;
- **Overlays** — dialogi, panele boczne, popovery oraz tooltipy.

Portal dokumentacji jest źródłem prawdy dla pełnej i aktualnej listy komponentów oraz ich propsów, danych wejściowych, zdarzeń, slotów i wariantów.

## Style i kolorystyka

PEAUI dostarcza jeden wspólny arkusz stylów dla Vue, React i Web Components:

```ts
import '@peaui/ui/styles.css';
```

Warstwę wizualną można konfigurować przez zmienne CSS. Podstawowa paleta PEAUI jest zielona, a palety semantyczne, takie jak success, warning i danger, pozostają od niej niezależne.

```css
:root {
  --peaui-color-primary-400: #86cb16;
  --peaui-color-primary-500: #5fa907;
  --peaui-color-primary-600: #3f8205;
}
```

Przy wprowadzaniu własnej kolorystyki marki należy nadpisać pełną skalę `50`–`900`, aby stany hover, focus, active oraz kontrast pozostały spójne. Dokumentacja zawiera pełny spis zmiennych dla primary, success, warning, danger, violet, grey oraz typografii.

PEAUI respektuje ustawienie kolorystyki przeglądarki dzięki `light-dark()`. Tryb ciemny można również włączyć jawnie:

```ts
document.body.classList.add('dark-mode');
```

## Dostępność

PEAUI jest projektowane z uwzględnieniem dostępnych wzorców interfejsu. Zależnie od komponentu obejmuje to semantyczny HTML, obsługę klawiatury, widoczne stany focus, dostępne nazwy, atrybuty ARIA oraz komunikaty dla czytników ekranu.

Końcowa dostępność aplikacji zależy również od poprawnego użycia komponentów. Konsument powinien przekazywać znaczące etykiety, teksty alternatywne i treści oraz zweryfikować gotowy produkt według swoich wymagań dostępności. Dokumentacja komponentów opisuje istotne dane dostępności wszędzie tam, gdzie są potrzebne.

## TypeScript i formaty paczki

Paczka zawiera deklaracje TypeScript dla głównego API oraz każdego punktu wejścia Vue, React i Web Components. Udostępnia buildy ESM i CommonJS, a także importy pojedynczych komponentów pozwalające aplikacji korzystać tylko z potrzebnych elementów.

## Dokumentacja

PEAUI ma oddzielny portal dokumentacyjny, niezależny od Storybooka. Zawiera on:

- osobne sekcje Vue, React i Web Components;
- instalację i pierwsze kroki dla każdej technologii;
- podglądy komponentów na żywo oraz edytowalne propsy;
- opisy komponentów, dane wejściowe, propsy, zdarzenia i sloty;
- warianty oraz generowane przykłady użycia;
- pełny katalog ikon;
- dokumentację kolorów i tokenów projektowych;
- angielską oraz polską wersję językową, domyślnie w języku angielskim;
- wyszukiwarkę komponentów i zasobów.

Aplikacja dokumentacji znajduje się w repozytorium w katalogu:

```text
packages/docs
```

Uruchom ją z głównego katalogu monorepo:

```bash
npm install
npm run docs
```

Portal otworzy się pod adresem [http://localhost:4174](http://localhost:4174).

Build produkcyjny i jego podgląd uruchomisz poleceniami:

```bash
npm run docs:build
npm run docs:preview
```

Repozytorium: [https://github.com/webonweb/peaui](https://github.com/webonweb/peaui)

## Rozwój projektu

Przydatne polecenia uruchamiane z głównego katalogu monorepo:

```bash
# Uruchom portal dokumentacji
npm run docs

# Uruchom lint, formatowanie, sprawdzanie typów, testy i buildy
npm run check

# Zbuduj bibliotekę oraz portal dokumentacji
npm run build

# Zbuduj paczkę biblioteki
npm run library:build

# Uruchom testy Vue, React i Web Components
npm run test
```

## Publikowanie na NPM-ie

Projekt korzysta z wersjonowania semantycznego i obsługuje Changesets. Przed publikacją uruchom pełną kontrolę release'u:

```bash
npm run release:check
```

Sprawdź zawartość paczki bez publikowania:

```bash
npm run release:pack:dry-run
npm run release:npm:dry-run
```

Opublikuj zweryfikowaną publiczną paczkę na NPM-ie:

```bash
npm login
npm run release:npm
```

W przepływie opartym na Changesets utwórz i opublikuj zmiany wersji poleceniami:

```bash
npm run changeset
npm run release:version
npm run release:changesets
```

## Kierunek rozwoju

PEAUI jest aktywnie rozwijane. Katalog będzie rozszerzany o nowe komponenty, dodatkowe warianty, poprawki dostępności, dokumentację oraz aktualizacje utrzymujące zgodność frameworków. Vue, React i Web Components są traktowane jako równorzędne technologie docelowe, a wspólne style zapewniają zgodny wygląd ich implementacji.

## Wsparcie i zgłoszenia

Błędy oraz propozycje nowych funkcji można zgłaszać w [systemie zgłoszeń projektu](https://github.com/webonweb/peaui/-/issues).

## Licencja

PEAUI jest dostępne na licencji [MIT](./LICENSE).
