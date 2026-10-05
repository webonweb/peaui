# PEAUI documentation portal

The portal documents the current library source in English and Polish. It includes installation, live examples and API tables for Vue, React and Web Components, plus icons and design tokens. All three catalogs currently contain 87 components. For application installation and migration guidance, see the [repository README](../../README.md) and [integration guide](../../docs/IMPORTY_I_KONTRAKTY.md).

## Local development

Use Node.js 22.12+ in the Node 22 line and npm 11.6.0. Install all workspaces from the repository root:

```bash
npm ci
npm run docs
```

The development server runs at `http://localhost:4174`. It regenerates API metadata before startup and loads component source through the existing Vite aliases. To refresh metadata after changing a component API, run `npm -w packages/docs run generate` or restart the server.

```bash
npm run docs:lint
npm run docs:format
npm run docs:typecheck
npm run docs:test
npm run docs:build
npm run docs:preview
```

Browser tests start their own documentation server. Install the matching browser binaries before the first run:

```bash
npm -w packages/docs run test:browser:install
npm run docs:test:browser
```

Chromium is the default. `PEAUI_BROWSER` can select `firefox` or `webkit` after those binaries are installed with the repository's Playwright version. `DOCS_URL` and `DOCS_PORT` configure the test target; see [playwright.config.ts](./playwright.config.ts).

## Keeping content current

- `scripts/generate-component-api.mjs` extracts Vue props, models, events and slots, reads React public declarations, and builds the WC metadata. Do not edit `src/generated/*` by hand.
- `src/data/component-copy.ts` contains Polish component descriptions, use cases and input guidance. English equivalents and API descriptions live in `src/data/localized-content.ts`.
- `src/data/demo-presets.ts` supplies demo values, content and copyable examples. Examples must use actual public framework entry points and supported model/event names.
- `src/views/GettingStartedPage.vue` documents installation and integration. `src/data/frameworks.ts` and `src/i18n.ts` supply shared framework and interface text.
- Color documentation reads the library's SCSS tokens. Icon metadata comes from the library catalog: 1348 grouped icons plus compatibility names. The icon view renders 96 results per page and searches names and semantic tags.

When changing a public API, update the corresponding descriptions, presets and stories for all three technologies, then regenerate metadata. React metadata, package entry points and the Custom Elements Manifest have separate generators in `packages/library`; keep those synchronized too. Syntax and catalog tests check the generated Vue, React and WC examples, while browser tests check interactive documentation behavior.

## Production routing and validation

The portal uses `createWebHistory` with clean URLs under `/peaui/`. English is the default; Polish routes use `/pl/`. Legacy `#/` links redirect to their clean equivalents. `scripts/generate-static-pages.mjs` creates a static `index.html` for every public start, catalog, category, component and icon route, together with `sitemap.xml`, `robots.txt` and `404.html`. Canonical URLs use `https://webonweb.github.io/peaui/`.

Static pages prerender the document head, not the full component body. The interactive portal requires JavaScript. Route, language and framework changes update the page metadata at runtime.

`docs:build` runs metadata generation, TypeScript, the Vite build, static route generation, shared-style validation and size budgets for routes including their static dependencies. Output is written to `packages/docs/dist`. Publishing is handled separately by the repository's Pages workflow; a local build does not publish a site.

## Dokumentacja po polsku

Portal opisuje aktualny kod biblioteki w języku polskim i angielskim. Każdy z trzech katalogów — Vue, React i Web Components — zawiera obecnie 87 komponentów z opisem, tabelami API i przykładami. Instrukcje instalacji w aplikacji oraz migracji znajdują się w [głównym README](../../README.md) i [przewodniku integracji](../../docs/IMPORTY_I_KONTRAKTY.md).

Pracuj z Node.js 22.12+ w linii 22 i npm 11.6.0. Z katalogu głównego wykonaj `npm ci`, następnie `npm run docs`. Portal uruchomi się pod `http://localhost:4174`. Metadane API są generowane przed uruchomieniem; po zmianie API użyj `npm -w packages/docs run generate` lub uruchom serwer ponownie. Podglądy korzystają z kodu źródłowego komponentów.

Polskie opisy są w `src/data/component-copy.ts`, angielskie odpowiedniki w `src/data/localized-content.ts`, a dane i przykłady w `src/data/demo-presets.ts`. Instrukcje startowe zawiera `GettingStartedPage.vue`. Nie poprawiaj ręcznie plików `src/generated/*`: zmień źródło API albo generator, a następnie odśwież metadane. Utrzymuj zgodne scenariusze dla wszystkich frameworków i obu języków. Katalog ikon obejmuje 1348 ikon pogrupowanych oraz nazwy zgodności; widok pokazuje po 96 wyników. Dokumentacja kolorów czyta tokeny SCSS biblioteki.

Walidację uruchamiają `docs:lint`, `docs:format`, `docs:typecheck`, `docs:test` i `docs:build`. Testy przeglądarkowe: `npm -w packages/docs run test:browser:install`, potem `npm run docs:test:browser`. Domyślnym silnikiem jest Chromium; `PEAUI_BROWSER` pozwala wybrać zainstalowany Firefox lub WebKit. Używaj binariów zgodnych z wersją Playwrighta w repozytorium.

Build tworzy `packages/docs/dist`, sprawdza typy, style i budżety rozmiaru oraz generuje statyczne wejścia do tras, `sitemap.xml`, `robots.txt` i `404.html`. Polski adres ma prefiks `/pl/`, a adresy canonical wskazują `https://webonweb.github.io/peaui/`. Bezpośrednie odświeżanie podstron działa bez routingu hash. Prerenderowana jest sekcja `head`; pełna treść i podglądy nadal wymagają JavaScriptu. Lokalny build nie publikuje strony — publikację obsługuje oddzielny workflow Pages.
