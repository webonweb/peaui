# Instalacja, importy i kontrakty komponentów

Dokument opisuje bieżący kod biblioteki. Szczegółowe propsy, zdarzenia, sloty i przykłady wszystkich komponentów znajdują się w [portalu dokumentacji](https://webonweb.github.io/peaui/), osobno dla Vue, Reacta i Web Components. Roadmapa opisuje plany rozwoju, nie publiczne API.

## Instalacja w aplikacji

Paczka `@peaui/ui` udostępnia wszystkie trzy implementacje. Zainstaluj runtime używany przez wybrane wejścia:

```bash
# Vue lub pełny katalog Web Components
npm install @peaui/ui "vue@^3.5.0"

# React
npm install @peaui/ui "react@^19.2.0" "react-dom@^19.2.0"
```

Vue, React i React DOM są opcjonalnymi peer dependencies, ponieważ aplikacja zwykle używa jednego frameworka. Opcjonalność przy instalacji nie oznacza, że komponent może działać bez swojego runtime. W katalogu WC 64 z 87 komponentów korzystają ze wspólnej implementacji Vue, a 23 mają implementację DOM. Import pojedynczego natywnego elementu, np. SectionDivider, nie wymaga Vue. Instalacja Vue pozwala korzystać z całego katalogu WC.

Vite jest opcjonalnym peer dependency wyłącznie dla `@peaui/ui/vite`; obsługiwany zakres to `^6.4.0 || ^7.0.0`. Zwykłe importy komponentów nie wymagają Vite. Style korzystają z nowoczesnego CSS, w tym `light-dark()`, a WC wymagają przeglądarki obsługującej Custom Elements. Przykłady z nazwą paczki wymagają bundlera albo skonfigurowanego rozwiązywania modułów; sam przeglądarkowy `<script type="module">` nie rozwiązuje nazw npm.

## Importy i style

| Wejście                                       | Znaczenie                                                          |
| --------------------------------------------- | ------------------------------------------------------------------ |
| `@peaui/ui`, `@peaui/ui/vue`                  | Zbiorcze eksporty nazwane Vue.                                     |
| `@peaui/ui/react`                             | Zbiorcze eksporty nazwane natywnego Reacta.                        |
| `@peaui/ui/vue/<kategoria>/<Komponent>`       | Domyślny eksport jednego komponentu Vue.                           |
| `@peaui/ui/react/<kategoria>/<Komponent>`     | Domyślny eksport jednego komponentu Reacta.                        |
| `@peaui/ui/wc/<kategoria>/<Komponent>`        | Rejestracja elementu, eksport klasy i funkcji `define<Komponent>`. |
| `@peaui/ui/<kategoria>/<Komponent>`           | Historyczny alias komponentu Vue.                                  |
| `@peaui/ui/web-components`                    | Nazwy tagów i globalne typy DOM; bez rejestracji komponentów.      |
| `@peaui/ui/styles.css`, `@peaui/ui/style.css` | Pełny arkusz stylów wszystkich komponentów.                        |

Przykładowe ścieżki odpowiadają rzeczywistym katalogom źródeł; warstwy mają kategorię `overlayer`:

```ts
// Wybierz import dla używanego frameworka.
import VueButton from '@peaui/ui/vue/data-entry/ButtonAction';
import ReactButton from '@peaui/ui/react/data-entry/ButtonAction';
import '@peaui/ui/wc/data-entry/ButtonAction'; // rejestruje peaui-button-action
```

Przeglądarkowe wejścia automatycznie importują tokeny, style komponentu i jego zależności. Osobny import CSS nie jest wtedy potrzebny. Zbiorcze wejścia zachowują pełny CSS dla zgodności; importy bezpośrednie ograniczają graf zależności. Nie importuj wszystkich frameworków, jeżeli aplikacja ich nie używa. Importy rejestrujące WC mają zadeklarowany efekt uboczny i nie są usuwane podczas tree shakingu.

W istniejącej konfiguracji Vite możesz dodać transformację importów nazwanych:

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { peauiImports } from '@peaui/ui/vite';

export default defineConfig({ plugins: [vue(), peauiImports()] });
```

W aplikacji React zachowaj swój plugin Reacta. Transformacja obsługuje `@peaui/ui`, `@peaui/ui/vue` i `@peaui/ui/react`, zamieniając nazwane importy komponentów na ścieżki bezpośrednie. Nie rejestruje globalnie komponentów. Importy namespace, domyślne i eksporty niebędące komponentami pozostają przy wejściu zbiorczym. Dla innych bundlerów stosuj ścieżki bezpośrednie.

## Modele i zdarzenia

| Koncept           | Vue             | React                     | Web Components                               |
| ----------------- | --------------- | ------------------------- | -------------------------------------------- |
| Wartość pola      | `v-model:value` | `value` + `onValueChange` | właściwość `value`, zdarzenie `update:value` |
| Stan warstwy      | `v-model:open`  | `open` + `onOpenChange`   | właściwość `open`, zdarzenie `update:open`   |
| Strona            | `v-model:page`  | `page` + `onPageChange`   | właściwość `page`, zdarzenie `update:page`   |
| Pojedynczy upload | `v-model:file`  | `file` + `onFileChange`   | właściwość `file`, zdarzenie `update:file`   |

Tabela przedstawia konwencje, nie zestaw propsów każdego komponentu. Sprawdź modele konkretnego komponentu: np. FormFileUploadSimple używa `files`, a NotificationCenter — `activeFilter` i `selectedId`. React udostępnia wartości początkowe, takie jak `defaultValue`, tam, gdzie API danego komponentu obsługuje tryb niekontrolowany. Kontrolowany model wymaga aktualizacji wartości przez aplikację po callbacku. Zdarzenia operacji na danych, np. zapisu tabeli lub oznaczenia powiadomienia jako przeczytanego, nie zapisują danych na serwerze.

## Web Components

- Rejestruj elementy przez ścieżki `wc/*` po stronie przeglądarki; rejestracja jest idempotentna. Każdy moduł eksportuje klasę elementu i funkcję `define<Komponent>`.
- Dane proste przekazuj jako atrybuty, a tablice, obiekty i funkcje jako właściwości DOM. Rejestrację wykonaj przed przypisaniem danych albo poczekaj na `customElements.whenDefined(tag)`.
- Włączaj flagę pustym atrybutem, np. `disabled`. Wyłączaj ją przez usunięcie atrybutu lub `element.disabled = false`. Starsze natywne elementy akceptują również tekstowe `"false"`, `"0"`, `"no"`, `"off"`; adapter Vue stosuje reguły boolean Vue/HTML. `disabled="false"` nie jest przenośnym sposobem wyłączenia flagi.
- Zdarzenia komponentów są `CustomEvent` z `bubbles: true` i `composed: true`. Pojedynczy argument jest bezpośrednio `event.detail`, a wiele argumentów — tablicą. Zachowaj dokładną nazwę zdarzenia, np. `update:value`, `on:search` lub `markRead`.
- Adapter aktualizuje publiczną właściwość przy zdarzeniu modelu. Synchroniczna zmiana właściwości przez konsumenta ma pierwszeństwo. Przy zewnętrznym stanie aplikacji synchronizuj również to źródło danych.
- Elementy korzystają z light DOM i wspólnych stylów. Zawartość z `slot="nazwa"` jest przenoszona do odpowiedniego miejsca. Slot HTML nie udostępnia scoped slot props Vue ani argumentów funkcji renderującej Reacta; dynamiczną treść buduje aplikacja.
- Manifest `packages/library/custom-elements.json` opisuje opublikowane tagi, właściwości i zdarzenia. Jego ścieżki `dist/components/wc/*.js` mają publiczne aliasy eksportów. Zwykły kod aplikacji powinien używać krótszych ścieżek `wc/*`.

TypeScript może korzystać z katalogu bez rejestrowania całej biblioteki:

```ts
import type {} from '@peaui/ui/web-components';
import '@peaui/ui/wc/form/FormInput';

const input = document.querySelector('peaui-form-input');
input?.addEventListener('update:value', (event) => {
  const value = (event as CustomEvent<string>).detail;
  console.log(value);
});
```

## Formularze i migracja modeli

### Select i MultiSelect

`FormSelect` emituje `option.value`, a `FormMultiSelect` tablicę takich wartości. Brak `value` oznacza użycie `label`. Typy pozostają rozróżnione: `1` i `"1"` są różnymi wartościami. Etykieta służy do wyświetlania. Zbiorcze zaznaczenie obejmuje przefiltrowane, dostępne opcje i zachowuje wybory spoza filtra.

Poprzedni model Vue/WC oparty na etykietach można zachować przez `valueMode="label"` (Vue/WC: atrybut `value-mode="label"`, WC: także właściwość `valueMode`). Najpierw zmigruj zapisane dane do wartości opcji, następnie usuń ten tryb. Edytor select w TableList udostępnia odpowiednik przez `column.manage.valueMode`.

Z `canWrite` FormSelect aktualizuje model po każdej zmianie tekstu, również przy jego wyczyszczeniu. Wpis pozostaje po Tab, Escape i ponownym otwarciu listy. React kontrolowany musi przyjąć tę wartość w `onValueChange`.

Natywna reprezentacja formularza przekazuje wartość modelu, niezależnie od tekstu wyszukiwania. `required` weryfikuje wybór, a nie filtr. MultiSelect tworzy osobny wpis dla każdej wartości: odczytuj je przez `FormData.getAll(name)`. Wartości formularza są stringami; dla opcji obiektowych wybierz stabilny identyfikator nadający się do serializacji. Wyłączone kontrolki nie uczestniczą w wysyłaniu.

Strzałki, Home/End, Enter, Escape i Tab obsługują nawigację zgodnie z wariantem kontrolki; pomijane są wyłączone opcje. `readonly` blokuje zmianę wyboru. Własne komunikaty przekaż przez `labels`:

```ts
const labels = {
  placeholder: 'Choose',
  searchPlaceholder: 'Search',
  selectPlaceholder: 'Choose an option',
  empty: 'No matches',
  emptyWritable: 'No matches. Type a value.',
  clear: 'Clear selection',
  selectAll: 'Select all',
  deselectAll: 'Deselect all',
};
```

Vue: `:labels="labels"`; React: `labels={labels}`; WC: `element.labels = labels`. Domyślne polskie etykiety pozostają dostępne. FormField ma również `clearLabel` dla akcji czyszczenia.

### Reset, walidacja i kontrolki złożone

- Niekontrolowane pola React odtwarzają stan początkowy przy resecie formularza. Kontrolowane wartości React i modele Vue resetuje właściciel stanu w obsłudze `reset`; anulowany reset nie powinien zmieniać stanu. WC odtwarzają wartości początkowe; zewnętrzny store należy zsynchronizować osobno. Pickery usuwają również niezapisany draft.
- Przekazuj `name`, jeśli wartość ma wejść do natywnego `FormData`, oraz `form`, gdy obsługiwana kontrolka ma należeć do formularza poza swoim drzewem DOM. Lista propsów określa wymagane `id` i `name`. `disabled` wyłącza interakcję i natywne wysyłanie kontrolki.
- `required` w kontrolkach złożonych blokuje pusty wybór i kieruje fokus na widoczną kontrolkę. Aplikacja nadal odpowiada za własne reguły biznesowe i ich tekstowe komunikaty.
- `FormNumber` zatwierdza wpis przy utracie fokusu. Pusty wpis daje `undefined`, a akcja czyszczenia zachowuje historyczny pusty string. `step` określa precyzję; `min` i `max` ograniczają wynik, także dla granicy równej zero.
- `FormDateTimePicker` w wariancie `split-input` wysyła datę i czas jako dwa wpisy pod wspólnym `name`; odczytuj je przez `FormData.getAll(name)`. Jedno pole `FormData.get(name)` nie zawiera obu części.
- Natywne WC ButtonAction i FormFieldLabel zachowują `id` hosta, a ich wewnętrzny element ma sufiks `-control`. Zewnętrzną etykietę przycisku wiąż z ID natywnej kontrolki, nie hosta.

### Pliki

`FormFileUpload` domyślnie przekazuje `{ file: File, image: string }` we wszystkich implementacjach. `image` jest adresem danych podglądu. Model nazywa się `file`: Vue używa `v-model:file`, React `file`/`onFileChange`, a WC `file`/`update:file`. Oba formaty wejściowe — obiekt i sam `File` — są akceptowane.

Starszy callback React przyjmujący `File` zachowasz przez `valueMode="file"`; Vue/WC mają ten sam tryb. `FormFileUploadSimple` używa odrębnego modelu `files: File[]`. Ograniczenia rozmiaru i typu są sprawdzane przed przyjęciem pliku; niepoprawny wybór pokazuje błąd i nie zastępuje poprzedniego poprawnego pliku. Aplikacja odpowiada za transport na serwer.

## Duże zbiory i edycja danych

- `FormSelect`, `FormMultiSelect` i `TransferList` obsługują `virtual`. `optionHeight` oznacza stałą wysokość wiersza w pikselach: domyślnie 48 dla selektorów i 64 dla TransferList, minimum 24. Wirtualizacja zakłada jednakową wysokość; przy długich opisach dobierz wysokość albo wyłącz ją. Nie jest domyślnie włączona.
- Zamknięte selektory nie montują opcji. Nawigacja i wybór działają na całym filtrowanym zbiorze; `aria-activedescendant` wskazuje opcję tylko wtedy, gdy jest zamontowana.
- `TableList` bez paginacji renderuje cały przekazany zbiór. Przy dużej liczbie rekordów użyj paginacji; `VirtualList` służy do widoku z ograniczoną liczbą zamontowanych wierszy.
- Edycja TableList obsługuje zagnieżdżone klucze bez mutowania rekordu aplikacji. `type="editable"` zatwierdza dane po walidacji przez `manage.onUpdate`; zapis formularza rekordu emituje `submit` / `onSubmit`. Anulowanie odrzuca draft. Zachowuj stabilne, unikalne klucze rekordów: zmiana kolejności utrzymuje edytowany rekord, ale usunięcie, niejednoznaczny klucz lub opuszczenie strony kończy edycję.
- `NotificationCenter` i rozwinięte `TreeList` nie wirtualizują danych. `maxHeight` ogranicza viewport, nie rozmiar DOM. Duże historie powiadomień pobieraj stronami; aplikacja odpowiada za aktualizację `items`, `loadingMore` i `hasMore` oraz zapis stanu odczytu.

## Warstwy, układ i dostępność

ModalDialog, DrawerPanel i tryb modalny GuidedTour zarządzają fokusem i blokadą przewijania. Niemodalny popover pozwala przejść Tab do kolejnych elementów; nie traktuj każdej warstwy jak dialogu. Zapewnij nazwę dostępną warstwy i wyzwalacza. Po zamknięciu fokus powinien wrócić do wyzwalacza, jeśli nadal istnieje i jest dostępny.

FullscreenContainer powiększa zawartość przez CSS w obrębie strony, obsługuje Escape i odtwarzanie fokusu. Nie zastępuje przeglądarkowego Fullscreen API. Natywny ScrollArea jest domyślnie fokusowalny; jawny `tabindex` / `tabIndex` ma pierwszeństwo. `disabled` blokuje sterowanie programowe i stylowane paski, ale zachowuje natywne przewijanie.

CardCarousel zatrzymuje rotację po otrzymaniu fokusu do jawnego wznowienia. `pauseLabel` i `resumeLabel` lokalizują sterowanie. Domyślne cztery karty i interwał 2000 ms można zmienić propsami; układ uwzględnia responsywne style.

SectionHeading dobiera semantyczny tytuł według `size`: `heading-l → h1`, `heading-m/s/xs → h2`, `s → strong`, `m → h4`, `l → h3`, `xl → h2`. `as` zmienia zewnętrzny kontener, nie poziom tytułu. Dobierz rozmiar do hierarchii dokumentu. Wariant `secondary` oraz MessageText `white` wymagają powierzchni odwracającej się razem z motywem, np. `background: var(--peaui-color-grey-900)`; stałe ciemne tło może utracić kontrast po przełączeniu motywu.

Etykiety, alternatywy obrazów, nazwy przycisków ikonowych, tłumaczenia i struktura nagłówków należą do aplikacji. WCAG 2.2 AA jest celem projektowym; testy axe i klawiatury nie stanowią certyfikatu zgodności dowolnego użycia. Zweryfikuj docelowy produkt także czytnikiem ekranu, przy powiększeniu i na urządzeniach dotykowych.

## SSR

Eksporty Vue i React mają warunek `node` bez importów CSS, obsługiwany przez natywne `import()` i `require()`. Dostarcz style przez wejście klienta/bundler, np. `import '@peaui/ui/styles.css'`. Rejestrację WC wykonuj po stronie klienta.

Serwer i klient muszą otrzymać zgodne początkowe propsy, treść, locale i daty referencyjne. Warstwy zachowują natywne atrybuty `popover` podczas hydratacji i korzystają z fallbacku widoczności bez tego API. Dla NotificationCenter przekaż stabilne `referenceDate`, jeżeli formatowanie względem bieżącego czasu mogłoby różnić się między serwerem a klientem.

## Praca z repozytorium

Używaj Node.js 22.12 lub nowszego z linii 22.x oraz npm 11.6.0 zgodnie z CI i `packageManager`. Instalację wszystkich workspace'ów wykonuj z katalogu głównego; nie instaluj oddzielnie pakietów frameworków:

```bash
npm install --global npm@11.6.0
npm ci
npm run library:build
npm run docs
```

Portal działa pod `http://localhost:4174`. `npm run storybook` uruchamia trzy Storybooki oraz shell. Zmiana katalogu wymaga aktualizacji generatorów i testów wszystkich frameworków:

```bash
npm run react:check
npm -w packages/library run package:entries:check
npm -w packages/library run custom-elements:check
npm run check
npm run storybook:build
```

`check` obejmuje lint, format, typy źródeł i testów, testy jednostkowe oraz buildy biblioteki, playgroundów i dokumentacji. Testy przeglądarkowe i Storybook mają oddzielne polecenia:

```bash
npx playwright install chromium firefox webkit
npm run test:vue:browser
npm run test:react:browser
npm run test:wc:browser
npm run docs:test:browser
npm run test:production
npm run test:hydration
npm run test:browser:contracts
npm run storybook:check:catalog
```

`test:production`, hydratacja i kontrakty wymagają zbudowanej biblioteki. Kontrola katalogu wymaga zbudowanych Storybooków. `PEAUI_BROWSER` wybiera silnik przeglądarki obsługiwany przez dany runner; CI uruchamia Chromium, Firefox i WebKit. `test:coverage:wc:behavior` w workspace biblioteki obejmuje również kod Vue wykonywany przez adaptery WC.

Przed wydaniem używaj `npm run release:check`; `npm run release:artifact` przygotowuje i sprawdza archiwum bez publikacji. Oba polecenia zaczynają się od `npm run security:check`, które sprawdza również zależności deweloperskie i blokuje proces przy podatnościach wysokich lub krytycznych. Ta sama kontrola obowiązuje w CI i w `prepublishOnly` paczki. `npm run release:npm` publikuje paczkę i należy do odrębnego procesu wydania. Zmiana dokumentacji nie oznacza, że kod znajdujący się w repozytorium został już opublikowany na npm.
