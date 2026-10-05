<p align="center">
  <img src="./packages/storybook/shell/public/peaui-ui-logo.png" alt="PEAUI" width="360" />
</p>

<h1 align="center">@peaui/ui</h1>

<p align="center">
  An accessible, typed and framework-flexible component library for Vue, React and Web Components.
</p>

<p align="center">
  <a href="#english">English</a> · <a href="#polski">Polski</a>
</p>

<p align="center">
  <a href="https://webonweb.github.io/peaui/"><strong>Documentation / Dokumentacja</strong></a>
</p>

---

<a id="english"></a>

# PEAUI component library

PEAUI is a continuously developed UI component library for building consistent, readable and accessible web interfaces. It provides one visual language and a shared styling layer across three integration targets:

- Vue 3 components;
- native React components;
- standards-based Web Components.

The component catalog is generated directly from the public source. The documentation always shows the current count for Vue, React and Web Components.

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

All three implementations use the same PEAUI design tokens and component styles. This keeps spacing, typography, colors, states and responsive behavior aligned across frameworks.

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
| Vue            | `^3.5.0`                                     | `@peaui/ui` or `@peaui/ui/vue/...` |
| React          | `^19.2.0`                                    | `@peaui/ui/react/...`              |
| React DOM      | `^19.2.0`                                    | used with React components         |
| Web Components | Modern browsers with Custom Elements support | `@peaui/ui/wc/...`                 |

Vue, React and React DOM are optional peer dependencies at package-install time. Install the runtime required by the entry points you use: Vue for Vue components and Vue-backed Web Components, or React and React DOM for React components. The optional `@peaui/ui/vite` import transform supports Vite `^6.4.0 || ^7.0.0`; component imports work with other bundlers too. The shared styles require modern CSS support, including `light-dark()`.

## Installation

Install the package with the runtime for the selected target:

```bash
# Vue
npm install @peaui/ui "vue@^3.5.0"

# Web Components (the adapter uses the Vue runtime)
npm install @peaui/ui "vue@^3.5.0"
```

For a React application:

```bash
npm install @peaui/ui "react@^19.2.0" "react-dom@^19.2.0"
```

Browser and bundler per-component entry points load their required styles automatically. You do not need a separate CSS import in this setup. These package-name imports require a bundler or configured module resolution; a browser does not resolve npm names by itself.

The complete stylesheet remains available through `@peaui/ui/styles.css` and the backward-compatible `@peaui/ui/style.css` path when you intentionally want to load styles for the entire catalog.

Node and SSR resolve a style-free `node` export so both `require()` and native `import()` work without a CSS loader. Import `@peaui/ui/styles.css` in the client application or bundler entry when the same entry is also used directly by Node.

Use the same initial props and children on the server and client. React and Vue overlays preserve their native `popover` attributes during hydration, so closed content remains hidden and opening and outside-click dismissal continue to work after hydration. Browsers without the native Popover API use the existing visibility fallback.

## Using PEAUI with Vue

Use a per-component Vue entry point to load only that component and its required styles:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import FormInput from '@peaui/ui/vue/form/FormInput';

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

The aggregate Vue API is available at the root and at the explicit Vue alias:

```ts
import { FormInput } from '@peaui/ui';
// Equivalent: import { FormInput } from '@peaui/ui/vue';
```

For a small production bundle, prefer the direct paths above. Aggregate Vue imports can retain the catalog's CSS in Vite. To keep named imports with component-sized CSS, enable the import transform:

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { peauiImports } from '@peaui/ui/vite';

export default defineConfig({ plugins: [vue(), peauiImports()] });
```

This supports `@peaui/ui`, `@peaui/ui/vue` and `@peaui/ui/react`. The root API contains Vue components; importing React directly does not import Vue. Keep the existing framework plugin; a React application uses its React plugin in place of `vue()`. Avoid namespace imports when only a few components are needed.

The root entry is the backward-compatible aggregate Vue API. Prefer per-component Vue paths in production applications for the smallest dependency graph.

Existing framework-less component paths remain Vue-compatible:

```ts
import FormInput from '@peaui/ui/form/FormInput';
```

Vue components expose typed props, named slots, emitted events and model bindings. The exact API for every component is available in the documentation portal.

## Using PEAUI with React

PEAUI provides native React implementations with typed props, callbacks, JSX children and React lifecycle behavior.

```tsx
import { useState } from 'react';
import FormInput from '@peaui/ui/react/form/FormInput';

export function ProfileForm() {
  const [name, setName] = useState('');

  return (
    <FormInput
      id="first-name"
      name="firstName"
      label="First name"
      placeholder="Enter your first name"
      value={name}
      onValueChange={(value) => setName(value ?? '')}
    />
  );
}
```

React components use model-specific props and callbacks, such as `value`/`onValueChange`, `open`/`onOpenChange`, `page`/`onPageChange` and `file`/`onFileChange`. Components that support uncontrolled state expose initial-value props such as `defaultValue`; check the component API before assuming a model or initial-value prop exists. A controlled component requires the application to accept changes in its callback.

Use `@peaui/ui/react/<category>/<Component>` for individual components or `import { FormInput } from '@peaui/ui/react'` for named aggregate imports. The root `@peaui/ui` and framework-less component paths expose Vue.

## Using PEAUI as Web Components

Web Components can be used with plain HTML and JavaScript or in any environment that supports Custom Elements.

23 elements, including SectionDivider, CounterBadge and SpinnerLoader, have native DOM implementations. The remaining 64 use the shared Vue implementation and require Vue `^3.5.0`; a bundler includes that runtime once. Install Vue when using the full WC catalog, and import individual WC paths to load the elements needed by the application.

Importing a component module registers its `peaui-*` element. Registration is idempotent, so loading the same module more than once is safe:

```ts
import type {} from '@peaui/ui/web-components';
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

Primitive values can be passed as HTML attributes. Use an empty boolean attribute to enable a flag and remove it to disable it. Legacy native elements also interpret `"false"`, `"0"`, `"no"` and `"off"` as false; Vue-backed elements follow Vue/HTML boolean semantics. Assign boolean properties when toggling state at runtime, and use properties for objects, arrays and other complex values:

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

Named content uses the HTML `slot` attribute. PEAUI projects these nodes into light DOM and shares its styles with the page:

```html
<peaui-form-input id="email" name="email" label="Email">
  <span slot="hint">We will only use this address to contact you.</span>
</peaui-form-input>
```

HTML slots carry DOM content, not Vue scoped-slot arguments or React render-function context. Assign complex properties after registration, or wait for `customElements.whenDefined('peaui-form-input')` before initializing an element. Register WC modules in the browser when using SSR.

Each Web Component module also exports its element class and a `define<ComponentName>` registration function for explicit registration scenarios.

The non-registering `@peaui/ui/web-components` entry exports `PEAUI_WEB_COMPONENT_TAG_NAMES` and global `HTMLElementTagNameMap` declarations. Include `import type {} from '@peaui/ui/web-components'` when using typed DOM queries. Tooling can discover the public API through the packaged `custom-elements.json` manifest. Importing this catalog entry does not register components.

Manifest module paths also have public package exports, so tooling can import `@peaui/ui/${module.path}` directly. The `dist/components/wc/*.js` aliases resolve to the same JavaScript and types as the documented `wc/*` entries.

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

Browser and bundler Vue, React and Web Component entry points import the shared design tokens, their own styles and styles required by component dependencies:

```ts
import FormInput from '@peaui/ui/react/form/FormInput';
```

Bundlers such as Vite and Webpack deduplicate repeated module imports. The complete stylesheet remains optional:

```ts
import '@peaui/ui/styles.css';
```

Published JavaScript includes source maps for production debugging. Maps reference deduplicated files in `dist/sources/`; preserve that directory if serving the distribution and its maps directly. Both ESM and CommonJS remain supported. Browser builds use native HTML entity decoding; Node/SSR uses the complete server decoder through a private conditional import. Per-component imports remain the recommended way to keep application bundles focused on the components actually used.

## Select models and large lists

FormSelect emits `option.value`; FormMultiSelect emits an array of these values in Vue, React and Web Components. When an option omits `value`, its label is used. Values retain their types: `1` and `"1"` are distinct. Labels remain the displayed text. Select-all affects only filtered, enabled options and preserves selections outside the current filter.

With `canWrite`, FormSelect updates its model on every typed change, including empty text. Custom text remains selected after Tab or Escape and when reopening the popup. Controlled React consumers must update `value` from `onValueChange`, just as Vue consumers use `v-model:value`.

Native form submission and `required` validation use the selected model value, including writable text. Opening the popup or filtering options leaves a valid selection valid. The visible combobox keeps `aria-required`; invalid submissions focus that control. Clearing the selection makes a required field invalid again.

This changes the previous Vue/WC label model. During migration, set `valueMode="label"` (Vue: `value-mode="label"`; WC: property `valueMode` or attribute `value-mode`). That mode returns labels and accepts the previous label/value matching behavior. Migrate stored models to option values, then remove the mode. Table select editors expose the same setting as `column.manage.valueMode`.

FormSelect, FormMultiSelect and TransferList support `virtual` for large datasets. Set `optionHeight` to the fixed row height in pixels (default 48 for selects, 64 for TransferList; minimum 24). Only the visible range and a small buffer are mounted. Select popups mount their options on opening even without virtualization. Keyboard navigation, search, selection and `aria-posinset`/`aria-setsize` work across the complete filtered list.

```vue
<FormMultiSelect
  id="teams"
  name="teams"
  v-model:value="selectedTeamIds"
  :options="teams"
  virtual
  :option-height="48"
  with-select-all
/>
```

```tsx
<FormMultiSelect
  id="teams"
  name="teams"
  options={teams}
  virtual
  optionHeight={48}
  value={selectedTeamIds}
  onValueChange={setSelectedTeamIds}
  withSelectAll
/>
```

For Web Components assign `element.virtual = true` and `element.optionHeight = 48`. Fixed-height virtualization clips content that exceeds the row height; use a suitable height for descriptions or custom item slots, or keep virtualization disabled for rows of different heights. Offscreen rows are exposed through their list position and count; an active ARIA reference is emitted only while its option exists in the DOM.

## Form contracts and migration

- Native form submission requires a control's `name`. MultiSelect creates one string entry per selected value; read them with `FormData.getAll(name)`. FormDateTimePicker `variant="split-input"` also submits its date and time as separate entries under the same name. Disabled controls are excluded from submission.
- Uncontrolled React fields restore their initial values on form reset. Controlled React values and Vue models must be reset by the application. WC restore their initial state; synchronize any external store as well. Canceled resets preserve the current value, and pickers discard unconfirmed drafts on reset.
- FormNumber commits typed input on blur. Empty typed input produces `undefined`, while the explicit clear action preserves the historical empty string. `step`, `min` and `max` normalize the committed value, including limits equal to zero.
- FormFileUpload's `file` model emits `{ file: File, image: string }` across all frameworks. Use Vue `v-model:file`, React `file`/`onFileChange`, or WC `file`/`update:file`. Both a `File` and the object are accepted as input. Use `valueMode="file"` to preserve an older callback receiving a raw File. FormFileUploadSimple instead uses `files: File[]`; upload transport remains application-owned.
- TableList edits preserve nested data without mutating the supplied record. Cell editors validate before `manage.onUpdate`; record editors emit `submit`/`onSubmit`. Use stable unique row keys: reordering preserves the draft, while removal, ambiguous identity or leaving the page cancels editing. The application persists accepted changes.
- TableList renders all supplied rows when pagination is disabled. NotificationCenter and expanded TreeList do not virtualize their data. Use pagination or incremental loading for large collections; `maxHeight` limits the viewport, not the number of mounted items.
- FullscreenContainer expands content inside the page and manages Escape and focus. Browser-level fullscreen requires application use of the native Fullscreen API. Native ScrollArea is keyboard-focusable by default; an explicit `tabindex`/`tabIndex` overrides that behavior. Its `disabled` state preserves native scrolling while disabling programmatic and styled-scrollbar controls.
- CardCarousel rotates only when `withAnimation` is enabled. Focus stops rotation until the user resumes it; `pauseLabel` and `resumeLabel` localize the controls. Defaults are four visible cards and an `animationDelay` of 2000 ms.

Select and MultiSelect accept a `labels` object for `placeholder`, `searchPlaceholder`, `selectPlaceholder`, `empty`, `emptyWritable`, `clear`, `selectAll` and `deselectAll`. Polish defaults remain available. FormField exposes `clearLabel`; other components document their own localization inputs.

## Theme tokens

The visual system is configurable through CSS custom properties. The primary PEAUI palette is green, and semantic palettes such as success, warning and danger remain independent.

```css
:root {
  --peaui-color-primary-400: light-dark(#86cb16, #5fa907);
  --peaui-color-primary-500: light-dark(#5fa907, #86cb16);
  --peaui-color-primary-600: light-dark(#3f8205, #afe34b);
}
```

Override the complete `50`–`900` scale when introducing a custom brand palette so that hover, focus, active and contrast states stay coherent. The documentation includes the complete token reference for primary, success, warning, danger, violet, grey and typography variables.

PEAUI follows the browser color scheme through `light-dark()`. Dark mode can also be selected explicitly:

```ts
document.body.classList.add('dark-mode');
```

SectionHeading `variant="secondary"` and MessageText `variant="white"` use inverse text tokens. Pair them with an inverse surface such as `background: var(--peaui-color-grey-900)` so that text and background respond to the theme together. SectionHeading `as` sets the outer container; `size` determines the title's heading level, so choose it to match the document hierarchy.

## Accessibility

PEAUI is designed around accessible interface patterns. Depending on the component, this includes semantic HTML, keyboard navigation, focus states, accessible names, ARIA attributes and screen-reader announcements.

WCAG 2.2 AA is the design target, not a certification of every application using the library. Consumers must provide meaningful labels, alternative text, translations and document structure. Validate the final product with keyboard, screen reader, touch and zoom. Automated checks cover only the states and rules they exercise.

## Icons

`SvgIcon` includes the compatibility icons and 1348 supplied PeaUI Outline Icons Mega 0.3.0 assets. Catalog names use the `category/icon-name` format, for example `core/search`, `ring/ring-check` and `tile/tile-sparkles`. Every catalog SVG uses a 24 x 24 coordinate grid, a 1.8 px stroke, rounded caps and joins, and `currentColor`; icons are loaded on demand in small bundles.

```vue
<SvgIcon name="core/sparkles" aria-label="New feature" />
```

Decorative icons are hidden from assistive technologies by default. Add `aria-label` or `aria-labelledby` only when the icon itself conveys information; icon-only buttons still need an accessible name on the button.

## TypeScript and package formats

The package includes TypeScript declarations for the root API and every Vue, React and Web Component entry point. It provides ESM and CommonJS builds, plus per-component imports that allow applications to include only the components they use.

## Documentation

**Live documentation:** [https://webonweb.github.io/peaui/](https://webonweb.github.io/peaui/)

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

Use Node.js 22.12 or later in the 22.x line and npm 11.6.0, matching CI and the repository's `packageManager`. Install all workspaces from the monorepo root:

```bash
npm install --global npm@11.6.0
npm ci
npm run library:build
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

# Build all Storybooks
npm run storybook:build

# Install browsers, then run framework browser tests separately from check
npx playwright install chromium firefox webkit
npm run test:vue:browser
npm run test:react:browser
npm run test:wc:browser
npm run docs:test:browser

# After library:build: native forms, production interactions and SSR hydration
# PEAUI_BROWSER selects chromium (default), firefox or webkit
npm run test:production
npm run test:hydration
npm run test:browser:contracts

# After storybook:build: validate the component catalog
npm run storybook:check:catalog
```

`npm run check` covers source and test types, lint, formatting, unit tests and application/package builds. Storybook builds and browser suites have separate commands. For import contracts, migrations and development details, see [Installation and component contracts](https://github.com/webonweb/peaui/blob/main/docs/IMPORTY_I_KONTRAKTY.md) (Polish).

Framework browser suites start a development Storybook by default. CI builds the Storybooks first and sets `STORYBOOK_TEST_STATIC=1` to test those files without Vite compilation during a test. To reproduce this locally after `npm run storybook:build`, run `npx cross-env STORYBOOK_TEST_STATIC=1 PEAUI_BROWSER=firefox npm run test:react:browser` (the same applies to Vue and Web Components). Rebuild after source changes. `STORYBOOK_PORT` overrides the local server port; `STORYBOOK_URL` uses an already running server.

## Releasing to npm

The project follows semantic versioning and supports Changesets. Before publishing, run the complete release verification:

```bash
npm run release:check
```

The release check starts with `npm run security:check`, which checks production and development dependencies and fails on high or critical vulnerabilities. The same check runs in CI, before preparing a release artifact and before publishing the workspace package. Resolve reported dependencies before releasing; a production-only check does not cover the build and release tools.

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

Report defects and feature requests in the [project issue tracker](https://github.com/webonweb/peaui/issues).

## License

PEAUI is available under the [MIT license](./LICENSE).

---

<a id="polski"></a>

# Biblioteka komponentów PEAUI

PEAUI to stale rozwijana biblioteka komponentów interfejsu przeznaczona do budowania spójnych, czytelnych i dostępnych aplikacji internetowych. Zapewnia jeden język wizualny i wspólną warstwę stylów dla trzech sposobów integracji:

- komponentów Vue 3;
- natywnych komponentów React;
- zgodnych ze standardami Web Components.

Katalog komponentów jest generowany bezpośrednio z publicznego kodu źródłowego. Dokumentacja zawsze pokazuje aktualną liczbę dla Vue, React i Web Components.

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

Wszystkie trzy implementacje korzystają z tych samych tokenów projektowych PEAUI i stylów komponentów. Dzięki temu odstępy, typografia, kolory, stany oraz zachowanie responsywne pozostają zgodne niezależnie od użytej technologii.

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
| Vue            | `^3.5.0`                                             | `@peaui/ui` lub `@peaui/ui/vue/...` |
| React          | `^19.2.0`                                            | `@peaui/ui/react/...`               |
| React DOM      | `^19.2.0`                                            | używany razem z komponentami React  |
| Web Components | współczesne przeglądarki obsługujące Custom Elements | `@peaui/ui/wc/...`                  |

Vue, React i React DOM są opcjonalnymi peer dependencies podczas instalowania paczki. Zainstaluj runtime wymagany przez używane wejścia: Vue dla komponentów Vue i adapterów WC albo React i React DOM dla komponentów Reacta. Opcjonalna transformacja importów `@peaui/ui/vite` obsługuje Vite `^6.4.0 || ^7.0.0`; same komponenty działają również z innymi bundlerami. Wspólne style wymagają nowoczesnego CSS, w tym `light-dark()`.

## Instalacja

Zainstaluj paczkę razem z runtime'em wybranej technologii:

```bash
# Vue
npm install @peaui/ui "vue@^3.5.0"

# Web Components (adapter korzysta z runtime'u Vue)
npm install @peaui/ui "vue@^3.5.0"
```

W aplikacji React:

```bash
npm install @peaui/ui "react@^19.2.0" "react-dom@^19.2.0"
```

Wejścia przeglądarkowe i bundlera dla pojedynczych komponentów automatycznie ładują wymagane style. Osobny import CSS nie jest wtedy potrzebny. Importy nazw paczek wymagają bundlera albo skonfigurowanego rozwiązywania modułów; przeglądarka sama nie rozwiązuje nazw npm.

Pełny arkusz pozostaje dostępny przez `@peaui/ui/styles.css` oraz zachowaną dla zgodności ścieżkę `@peaui/ui/style.css`, gdy celowo chcesz załadować style całego katalogu.

Node i SSR korzystają z bezstylowego warunku eksportu `node`, dzięki czemu zarówno `require()`, jak i natywny `import()` działają bez loadera CSS. Gdy ten sam entry point jest uruchamiany bezpośrednio przez Node, zaimportuj `@peaui/ui/styles.css` w wejściu aplikacji klienckiej lub bundlera.

Po stronie serwera i klienta przekaż te same początkowe właściwości i treść. Warstwy Vue i React zachowują natywne atrybuty `popover` podczas hydratacji: zamknięta treść pozostaje ukryta, a otwieranie i zamykanie kliknięciem poza panelem działa po hydratacji. Przeglądarki bez natywnego Popover API korzystają z istniejącej obsługi widoczności.

## Korzystanie z PEAUI w Vue

Użyj entry pointu konkretnego komponentu Vue, aby załadować tylko ten komponent i wymagane przez niego style:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import FormInput from '@peaui/ui/vue/form/FormInput';

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

Zbiorcze API Vue jest dostępne w głównym wejściu i przez jawny alias Vue:

```ts
import { FormInput } from '@peaui/ui';
// Równoważnie: import { FormInput } from '@peaui/ui/vue';
```

Główny entry point jest zachowanym dla zgodności, zbiorczym API Vue. W aplikacjach produkcyjnych preferuj ścieżki pojedynczych komponentów Vue, aby ograniczyć graf zależności.

Zbiorcze wejścia zachowują pełny CSS. Aby w Vite używać importów nazwanych ze stylami pojedynczych komponentów, dodaj transformację do istniejącej konfiguracji:

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { peauiImports } from '@peaui/ui/vite';

export default defineConfig({ plugins: [vue(), peauiImports()] });
```

Zachowaj także istniejący plugin Vue albo Reacta. Transformacja obsługuje `@peaui/ui`, `@peaui/ui/vue` i `@peaui/ui/react`. Importy namespace zachowują wejście zbiorcze; inne bundlery mogą korzystać bezpośrednio ze ścieżek komponentów.

Dotychczasowe ścieżki bez nazwy frameworka pozostają zgodne z Vue:

```ts
import FormInput from '@peaui/ui/form/FormInput';
```

Komponenty Vue udostępniają typowane propsy, nazwane sloty, emitowane zdarzenia oraz powiązania modeli. Dokładne API każdego komponentu znajduje się w portalu dokumentacji.

## Korzystanie z PEAUI w React

PEAUI udostępnia natywne implementacje Reacta z typowanymi propsami, callbackami, JSX children i cyklem życia Reacta.

```tsx
import { useState } from 'react';
import FormInput from '@peaui/ui/react/form/FormInput';

export function ProfileForm() {
  const [name, setName] = useState('');

  return (
    <FormInput
      id="first-name"
      name="firstName"
      label="Imię"
      placeholder="Wpisz imię"
      value={name}
      onValueChange={(value) => setName(value ?? '')}
    />
  );
}
```

React używa propsów i callbacków zależnych od modelu, np. `value`/`onValueChange`, `open`/`onOpenChange`, `page`/`onPageChange` i `file`/`onFileChange`. Komponenty obsługujące tryb niekontrolowany udostępniają wartości początkowe, np. `defaultValue`; sprawdź API konkretnego komponentu. Model kontrolowany wymaga przyjęcia nowej wartości przez aplikację w callbacku.

Używaj `@peaui/ui/react/<kategoria>/<Komponent>` dla pojedynczych komponentów albo `import { FormInput } from '@peaui/ui/react'` dla importów zbiorczych. Główne wejście `@peaui/ui` i ścieżki bez nazwy frameworka udostępniają Vue.

## Korzystanie z PEAUI jako Web Components

Web Components mogą być używane w zwykłym HTML-u i JavaScripcie oraz w dowolnym środowisku obsługującym Custom Elements.

23 elementy, w tym SectionDivider, CounterBadge i SpinnerLoader, mają natywną implementację DOM. Pozostałe 64 wykorzystują wspólną implementację Vue i wymagają Vue `^3.5.0`; bundler dołącza ten runtime raz. Zainstaluj Vue, aby korzystać z całego katalogu WC, i importuj tylko potrzebne elementy.

Import modułu komponentu rejestruje odpowiadający mu element `peaui-*`. Rejestracja jest idempotentna, więc wielokrotne załadowanie tego samego modułu jest bezpieczne:

```ts
import type {} from '@peaui/ui/web-components';
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

Wartości proste można przekazywać jako atrybuty HTML. Flagi włączaj pustym atrybutem, a wyłączaj przez jego usunięcie. Starsze natywne elementy interpretują także teksty `"false"`, `"0"`, `"no"` i `"off"` jako fałsz; adaptery Vue stosują reguły boolean Vue/HTML. Przy zmianie stanu w runtime oraz dla obiektów, tablic i innych danych złożonych używaj właściwości DOM:

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

Nazwana zawartość korzysta z atrybutu HTML `slot`. PEAUI przenosi te węzły do light DOM i współdzieli style ze stroną:

```html
<peaui-form-input id="email" name="email" label="E-mail">
  <span slot="hint">Adres wykorzystamy wyłącznie do kontaktu.</span>
</peaui-form-input>
```

Sloty HTML przekazują zawartość DOM, a nie argumenty scoped slots Vue ani funkcji renderujących Reacta. Dane złożone przypisuj po rejestracji lub po `customElements.whenDefined('peaui-form-input')`. W aplikacji SSR rejestruj moduły WC po stronie przeglądarki.

Każdy moduł Web Component eksportuje także klasę elementu oraz funkcję rejestrującą `define<NazwaKomponentu>`, przeznaczoną do scenariuszy wymagających jawnej rejestracji.

Nierejestrujące wejście `@peaui/ui/web-components` eksportuje `PEAUI_WEB_COMPONENT_TAG_NAMES` oraz globalne deklaracje `HTMLElementTagNameMap`. Dodaj `import type {} from '@peaui/ui/web-components'`, aby typować zapytania DOM. Narzędzia mogą odczytać publiczne API z dołączonego manifestu `custom-elements.json`. Import katalogu nie rejestruje komponentów.

Ścieżki modułów manifestu mają publiczne eksporty paczki, więc narzędzia mogą importować bezpośrednio `@peaui/ui/${module.path}`. Aliasy `dist/components/wc/*.js` wskazują ten sam JavaScript i typy co opisane wejścia `wc/*`.

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

Wejścia przeglądarkowe i bundlera dla Vue, Reacta i WC importują wspólne tokeny projektowe, własne style oraz style wymagane przez zależności komponentowe:

```ts
import FormInput from '@peaui/ui/react/form/FormInput';
```

Bundlery takie jak Vite i Webpack deduplikują powtarzające się importy modułów. Pełny arkusz pozostaje opcjonalny:

```ts
import '@peaui/ui/styles.css';
```

Opublikowany JavaScript zawiera source mapy ułatwiające debugowanie produkcyjne. Mapy odwołują się do wspólnych źródeł w `dist/sources/`; zachowaj ten katalog, jeżeli udostępniasz pliki dystrybucji i ich mapy bezpośrednio. ESM i CommonJS pozostają obsługiwane. Przeglądarka korzysta z natywnego dekodowania encji HTML, a Node/SSR z pełnego dekodera serwerowego. Importy pojedynczych komponentów pozostają zalecanym sposobem ograniczania bundla aplikacji do faktycznie używanych elementów.

## Modele Select i duże listy

FormSelect zwraca `option.value`, a FormMultiSelect tablicę takich wartości we wszystkich trzech technologiach. Gdy opcja nie ma `value`, używana jest etykieta. Liczba `1` i tekst `"1"` pozostają różnymi wartościami; wyświetlany tekst nadal pochodzi z etykiety. Zaznaczenie wszystkich obejmuje tylko dostępne opcje pasujące do filtra i zachowuje zaznaczenia spoza filtra.

Przy `canWrite` FormSelect aktualizuje model po każdej zmianie wpisanego tekstu, także po jego usunięciu. Własna wartość pozostaje wybrana po Tab, Escape i ponownym otwarciu listy. Kontrolowany komponent React wymaga aktualizowania `value` przez `onValueChange`, podobnie jak `v-model:value` w Vue.

Natywne wysyłanie formularza i walidacja `required` korzystają z wartości modelu, także wpisanej ręcznie. Otwarcie listy i filtrowanie opcji nie unieważniają poprawnego wyboru. Widoczny combobox zachowuje `aria-required` i otrzymuje fokus przy błędzie walidacji. Usunięcie wyboru ponownie unieważnia wymagane pole.

To zmiana dotychczasowego modelu Vue/WC. Na czas migracji ustaw `valueMode="label"` w React, `value-mode="label"` w Vue albo właściwość `valueMode` / atrybut `value-mode` w WC. Ten tryb zwraca etykiety i zachowuje dotychczasowe dopasowanie label/value. Po migracji zapisanych danych do wartości opcji usuń tryb migracyjny. Edytory tabeli udostępniają go przez `column.manage.valueMode`.

FormSelect, FormMultiSelect i TransferList obsługują opcjonalne `virtual`. Parametr `optionHeight` określa stałą wysokość wiersza w pikselach: domyślnie 48 dla selektorów i 64 dla TransferList, minimum 24. Montowany jest tylko widoczny fragment listy z niewielkim zapasem. Zamknięte selektory nie montują opcji również bez wirtualizacji.

W Vue użyj `virtual :option-height="48"`, w React `virtual optionHeight={48}`, a w WC ustaw `element.virtual = true` i `element.optionHeight = 48`. Dla opisów i własnych slotów dobierz wystarczającą wysokość; nadmiar treści jest przycinany. Przy różnych wysokościach wierszy pozostaw wirtualizację wyłączoną. Klawiatura i wyszukiwanie obejmują cały przefiltrowany zbiór, a ARIA przekazuje pozycję i łączną liczbę opcji. Odwołanie do aktywnej opcji istnieje tylko wtedy, gdy opcja jest zamontowana.

## Kontrakty formularzy i migracja

- Natywne wysyłanie formularza wymaga `name` kontrolki. MultiSelect tworzy osobny wpis tekstowy dla każdej wartości; odczytuj je przez `FormData.getAll(name)`. FormDateTimePicker `variant="split-input"` również wysyła datę i czas jako dwa wpisy pod wspólną nazwą. Wyłączone kontrolki nie uczestniczą w wysyłaniu.
- Niekontrolowane pola React przywracają wartości początkowe po resecie. Kontrolowane wartości React i modele Vue resetuje aplikacja. WC przywracają stan początkowy; zsynchronizuj również ewentualny zewnętrzny store. Anulowany reset zachowuje bieżącą wartość, a pickery odrzucają niezapisany draft podczas resetu.
- FormNumber zatwierdza wpis przy utracie fokusu. Pusty wpis daje `undefined`, a jawna akcja czyszczenia zachowuje historyczny pusty string. `step`, `min` i `max` normalizują wynik, także gdy granica wynosi zero.
- Model `file` FormFileUpload domyślnie emituje `{ file: File, image: string }` we wszystkich frameworkach. Użyj Vue `v-model:file`, React `file`/`onFileChange` albo WC `file`/`update:file`. Na wejściu akceptowany jest obiekt i sam `File`. `valueMode="file"` zachowuje wcześniejszy callback otrzymujący surowy File. FormFileUploadSimple używa modelu `files: File[]`; wysyłanie plików na serwer należy do aplikacji.
- Edycja TableList zachowuje zagnieżdżone dane bez mutowania przekazanego rekordu. Edytor komórki waliduje przed `manage.onUpdate`, a edytor rekordu emituje `submit`/`onSubmit`. Zapewnij stabilne, unikalne klucze: zmiana kolejności zachowuje draft, ale usunięcie, niejednoznaczna tożsamość lub opuszczenie strony anuluje edycję. Aplikacja zapisuje zaakceptowane zmiany.
- TableList bez paginacji renderuje wszystkie przekazane rekordy. NotificationCenter i rozwinięte TreeList nie wirtualizują danych. Duże zbiory obsługuj paginacją lub pobieraniem kolejnych stron; `maxHeight` ogranicza viewport, nie liczbę zamontowanych elementów.
- FullscreenContainer powiększa treść w obrębie strony i zarządza Escape oraz fokusem. Pełny ekran przeglądarki wymaga użycia natywnego Fullscreen API w aplikacji. Natywny ScrollArea jest domyślnie fokusowalny; jawny `tabindex`/`tabIndex` ma pierwszeństwo. `disabled` zachowuje natywne przewijanie, blokując sterowanie programowe i stylowane paski.
- CardCarousel obraca slajdy po włączeniu `withAnimation`. Fokus zatrzymuje rotację do jawnego wznowienia; `pauseLabel` i `resumeLabel` lokalizują sterowanie. Domyślnie widoczne są cztery karty, a `animationDelay` wynosi 2000 ms.

Select i MultiSelect przyjmują obiekt `labels` dla `placeholder`, `searchPlaceholder`, `selectPlaceholder`, `empty`, `emptyWritable`, `clear`, `selectAll` i `deselectAll`. Polskie wartości domyślne pozostają dostępne. FormField ma `clearLabel`; pozostałe komponenty opisują własne ustawienia lokalizacji w API.

## Konfiguracja tokenów

Warstwę wizualną można konfigurować przez zmienne CSS. Podstawowa paleta PEAUI jest zielona, a palety semantyczne, takie jak success, warning i danger, pozostają od niej niezależne.

```css
:root {
  --peaui-color-primary-400: light-dark(#86cb16, #5fa907);
  --peaui-color-primary-500: light-dark(#5fa907, #86cb16);
  --peaui-color-primary-600: light-dark(#3f8205, #afe34b);
}
```

Przy wprowadzaniu własnej kolorystyki marki należy nadpisać pełną skalę `50`–`900`, aby stany hover, focus, active oraz kontrast pozostały spójne. Dokumentacja zawiera pełny spis zmiennych dla primary, success, warning, danger, violet, grey oraz typografii.

PEAUI respektuje ustawienie kolorystyki przeglądarki dzięki `light-dark()`. Tryb ciemny można również włączyć jawnie:

```ts
document.body.classList.add('dark-mode');
```

## Dostępność

PEAUI jest projektowane z uwzględnieniem dostępnych wzorców interfejsu. Zależnie od komponentu obejmuje to semantyczny HTML, obsługę klawiatury, widoczne stany focus, dostępne nazwy, atrybuty ARIA oraz komunikaty dla czytników ekranu.

WCAG 2.2 AA jest celem projektowym, a nie certyfikatem każdej aplikacji korzystającej z biblioteki. Konsument dostarcza znaczące etykiety, teksty alternatywne, tłumaczenia i strukturę dokumentu. Sprawdź gotowy produkt klawiaturą, czytnikiem ekranu, dotykiem i przy powiększeniu. Testy automatyczne obejmują wyłącznie sprawdzane stany i reguły.

SectionHeading `variant="secondary"` i MessageText `variant="white"` korzystają z odwracanych tokenów tekstu. Stosuj je na powierzchni reagującej na motyw, np. `background: var(--peaui-color-grey-900)`. W SectionHeading `as` określa zewnętrzny kontener, a `size` — poziom tytułu; dobierz go do hierarchii nagłówków dokumentu.

## Ikony

SvgIcon udostępnia nazwy kompatybilności oraz 1348 ikon PeaUI Outline Icons Mega 0.3.0. Nazwy katalogowe mają format `kategoria/nazwa`, np. `core/search`, `ring/ring-check` i `tile/tile-sparkles`. Ikony są ładowane na żądanie w małych paczkach; używają siatki 24 × 24, linii 1,8 px i `currentColor`.

Domyślnie ikona jest dekoracyjna. Dodaj `aria-label` lub `aria-labelledby`, gdy sama przekazuje informację. Przycisk ikonowy nadal wymaga własnej nazwy dostępnej.

## TypeScript i formaty paczki

Paczka zawiera deklaracje TypeScript dla głównego API oraz każdego punktu wejścia Vue, React i Web Components. Udostępnia buildy ESM i CommonJS, a także importy pojedynczych komponentów pozwalające aplikacji korzystać tylko z potrzebnych elementów.

## Dokumentacja

**Dokumentacja online:** [https://webonweb.github.io/peaui/](https://webonweb.github.io/peaui/)

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

Używaj Node.js 22.12 lub nowszego z linii 22.x oraz npm 11.6.0 zgodnie z CI i `packageManager`. Zainstaluj wszystkie workspace'y z głównego katalogu monorepo:

```bash
npm install --global npm@11.6.0
npm ci
npm run library:build
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

# Zbuduj wszystkie Storybooki
npm run storybook:build

# Zainstaluj przeglądarki i uruchom testy przeglądarkowe osobno od check
npx playwright install chromium firefox webkit
npm run test:vue:browser
npm run test:react:browser
npm run test:wc:browser
npm run docs:test:browser

# Po library:build: formularze natywne, interakcje i hydratacja SSR
# PEAUI_BROWSER wybiera chromium (domyślnie), firefox albo webkit
npm run test:production
npm run test:hydration
npm run test:browser:contracts

# Po storybook:build: kontrola katalogu komponentów
npm run storybook:check:catalog
```

`npm run check` obejmuje typy źródeł i testów, lint, format, testy jednostkowe oraz buildy aplikacji i paczki. Buildy Storybooka i testy przeglądarkowe mają osobne polecenia. Szczegóły importów, migracji i pracy z repozytorium opisuje [Instalacja i kontrakty komponentów](https://github.com/webonweb/peaui/blob/main/docs/IMPORTY_I_KONTRAKTY.md).

Testy przeglądarkowe frameworków domyślnie uruchamiają deweloperski Storybook. CI najpierw buduje Storybooki i ustawia `STORYBOOK_TEST_STATIC=1`, aby testować gotowe pliki bez kompilacji Vite podczas testu. Lokalnie po `npm run storybook:build` uruchom np. `npx cross-env STORYBOOK_TEST_STATIC=1 PEAUI_BROWSER=firefox npm run test:react:browser` (analogicznie dla Vue i Web Components). Po zmianie źródeł ponów build. `STORYBOOK_PORT` zmienia port lokalnego serwera, a `STORYBOOK_URL` wskazuje już działający serwer.

## Publikowanie na NPM-ie

Projekt korzysta z wersjonowania semantycznego i obsługuje Changesets. Przed publikacją uruchom pełną kontrolę release'u:

```bash
npm run release:check
```

Kontrola wydania zaczyna się od `npm run security:check`, które obejmuje zależności produkcyjne i deweloperskie oraz zatrzymuje proces przy podatnościach wysokich lub krytycznych. Ta sama kontrola działa w CI, przed przygotowaniem archiwum wydania i przed publikacją paczki z workspace. Przed wydaniem popraw zgłoszone zależności; kontrola samych zależności produkcyjnych nie obejmuje narzędzi budowania i publikacji.

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

Błędy oraz propozycje nowych funkcji można zgłaszać w [systemie zgłoszeń projektu](https://github.com/webonweb/peaui/issues).

## Licencja

PEAUI jest dostępne na licencji [MIT](./LICENSE).
