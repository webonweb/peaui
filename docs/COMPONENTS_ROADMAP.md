# PeaUI — roadmapa rozwoju komponentów

> Ten dokument jest źródłem prawdy dla planowania nowych komponentów PeaUI. Nie jest specyfikacją zamrożonego API: proponowane interfejsy należy potwierdzić przed rozpoczęciem implementacji, zachowując stałe identyfikatory komponentów.

## 1. Cel dokumentu

Roadmapa porządkuje stopniowy rozwój katalogu PeaUI, opisuje zakres każdego nowego komponentu i pozwala kolejnej sesji Codexa bezpiecznie wybrać pracę, której zależności są gotowe. Należy korzystać równocześnie z tabeli postępu, mapy zależności i pełnego opisu komponentu.

Komponenty powinny być realizowane pojedynczo albo w małych, jawnie wskazanych grupach. Duże pozycje mają kamienie milowe, które mogą stanowić osobne zadania. Po zakończeniu implementacji trzeba zaktualizować status, zależności, kryteria ukończenia i notatkę implementacyjną danego komponentu. Samo rozpoczęcie kolejnego etapu nigdy nie wynika automatycznie z ukończenia poprzedniego.

## 2. Zasady realizacji roadmapy

1. Implementuj tylko komponent albo kamień milowy wskazany przez użytkownika.
2. Gdy użytkownik poprosi o „następny komponent”, wybierz pierwszy komponent ze statusem `TODO`, którego wszystkie wymagane zależności mają status `DONE` albo już istnieją w PeaUI.
3. Nie implementuj automatycznie całego etapu i nie przechodź do kolejnego etapu bez wyraźnego polecenia.
4. Przed implementacją przeczytaj cały opis wybranej pozycji, mapę zależności i aktualne konwencje repozytorium.
5. W pierwszej kolejności wykorzystuj istniejące komponenty, tokeny, helpery i wzorce PeaUI; nie duplikuj rozwiązania pod nową nazwą.
6. Nie dodawaj zależności zewnętrznej bez udokumentowanego uzasadnienia, oceny rozmiaru, licencji, utrzymania, dostępności i wpływu na trzy środowiska docelowe. Preferuj brak nowych zależności.
7. Przed rozpoczęciem kodowania ustaw status na `IN_PROGRESS`. Ustaw `BLOCKED`, jeśli brakuje decyzji lub zależności uniemożliwiającej dalszą pracę.
8. Ustaw `DONE` dopiero po spełnieniu wszystkich kryteriów ukończenia, przejściu testów i zapewnieniu parytetu dokumentacji.
9. Jeżeli implementacja ujawni nową zależność, wariant albo ograniczenie, zaktualizuj odpowiednią sekcję roadmapy.
10. Rozszerzenie istniejącego komponentu jest dopuszczalne, jeśli zachowuje jego odpowiedzialność i kompatybilność. W przeciwnym razie utwórz osobny komponent oparty na wspólnym prymitywie.
11. Nie planuj ani nie implementuj w ramach tej roadmapy komponentów związanych z AI.

## 3. Legenda statusów

| Status        | Znaczenie                                                                                                         |
| ------------- | ----------------------------------------------------------------------------------------------------------------- |
| `TODO`        | Pozycja opisana i oczekująca na zaplanowanie implementacji. Stan początkowy wszystkich nowych komponentów.        |
| `PLANNED`     | Zakres i API zostały zweryfikowane, zależności są znane, a praca ma zatwierdzony plan.                            |
| `IN_PROGRESS` | Trwa implementacja komponentu albo jawnie wskazanego kamienia milowego.                                           |
| `BLOCKED`     | Pracy nie można kontynuować bez decyzji, zależności lub zmiany zewnętrznej; przyczyna musi być wpisana w notatce. |
| `DONE`        | Kod, parytet frameworków, dokumentacja, testy i wszystkie kryteria ukończenia są kompletne.                       |
| `DEPRECATED`  | Pozycja została wycofana albo zastąpiona; dokument musi wskazywać następcę i strategię migracji.                  |

## 4. Skala złożoności

| Poziom | Znaczenie                                                                 |
| ------ | ------------------------------------------------------------------------- |
| `S`    | Mały, samodzielny komponent z niewielką liczbą stanów.                    |
| `M`    | Średni komponent z kilkoma wariantami lub interakcjami.                   |
| `L`    | Duży komponent, złożone zarządzanie stanem, klawiaturą albo kompozycją.   |
| `XL`   | Komponent flagowy lub rodzina komponentów wymagająca etapowej realizacji. |

## 5. Priorytety

| Priorytet | Znaczenie                                                        |
| --------- | ---------------------------------------------------------------- |
| `P0`      | Fundament potrzebny wielu kolejnym pozycjom.                     |
| `P1`      | Wysoki priorytet i duża wartość dla typowych produktów.          |
| `P2`      | Średni priorytet albo bardziej wyspecjalizowane zastosowanie.    |
| `P3`      | Funkcja eksperymentalna, opcjonalna lub późniejsze rozszerzenie. |

## 6. Wnioski z analizy istniejącego repozytorium

- Repozytorium jest monorepo opartym na npm workspaces. Biblioteka znajduje się w `packages/library`, portal dokumentacji w `packages/docs`, a Storybooki mają osobne pakiety dla Vue, React, Web Components i wspólnego shellu.
- Źródłowe komponenty powstają jako Vue 3 SFC z TypeScript, Composition API i `<script setup lang="ts">`. Publiczne API Vue wykorzystuje `defineProps`, `defineEmits`, nazwane `defineModel` (np. `value`, `open`, `page`) oraz, gdy potrzebne, `defineSlots`.
- Nazwy komponentów i katalogów stosują `PascalCase`; pliki komponentu mają zwykle nazwy `index.vue`, `styles.scss`, `index.vue.spec.ts`, `index.vue.stories.ts`, `index.wc.ts`, `index.wc.spec.ts`, `index.wc.stories.ts`, `index.tsx` i `index.react.stories.tsx`.
- Style są wspólne dla trzech targetów, używają BEM z prefiksem `peaui-`, zmiennej `UIKIT_NAME`, lokalnych `styles.scss`, mixinów z `assets/mixins.scss` i tokenów CSS `--peaui-*`. Palety obsługują `light-dark()` oraz klasę `body.dark-mode`; nie należy dodawać kolorów produktowych na sztywno.
- Domyślnym API paczki jest Vue. React 19 ma natywne, generowane entry pointy z idiomatycznymi callbackami i trybem controlled/uncontrolled. Web Components są adapterami Custom Elements `peaui-*`, przekazują dane złożone przez właściwości DOM, sloty przez standard HTML, a eventy jako `CustomEvent.detail`.
- Eksporty zbiorcze są definiowane w `src/index.ts`, a build Vite tworzy osobne entry pointy Vue, React i WC. Każdy przyszły komponent musi zachować parytet publicznego API i dokumentacji dla wszystkich trzech środowisk.
- Testy Vue są współlokowane i używają Vitest oraz Vue Test Utils. WC mają osobne testy adaptera, React korzysta z Testing Library i testów katalogu. Storybook/Playwright obejmuje renderowanie, interakcje, klawiaturę, axe i mobilne przepełnienia.
- Repozytorium nie ma obecnie wydzielonego katalogu composables. Dostępne helpery dotyczą tablic, dat, DOM, funkcji, liczb, obiektów, stringów, notyfikacji oraz adapterów WC. Nowy composable lub utility powinien powstać tylko wtedy, gdy logika jest rzeczywiście wielokrotnego użytku.
- Istniejące zależności funkcjonalne obejmują VeeValidate/Yup oraz `vue-advanced-cropper`. Nowe komponenty nie powinny wiązać neutralnego API PeaUI z konkretnym backendem, routerem, magazynem stanu ani transportem sieciowym.
- Katalog zawiera już 62 komponenty wymienione w poleceniu. Podobieństwa należy traktować jako możliwość kompozycji: `FormDatePicker` dla wyborów daty, `PopoverOverlayer` dla warstw, `TableList` dla danych tabelarycznych, `TreeList` dla hierarchii, `NavigationStepper` dla kroków, `ImageView` dla mediów i `FullscreenContainer` dla dużych obszarów roboczych. Żadna z tych pozycji nie jest ponownie planowana jako nowy komponent.

## 7. Globalne standardy nowych komponentów

Każdy komponent musi spełnić poniższe zasady, o ile jego opis jawnie nie uzasadnia odstępstwa:

- implementacja źródłowa: Vue 3, TypeScript, Composition API i `<script setup>`;
- pełne typowanie propsów, modeli, eventów, slotów, refów i struktur danych; bez `any`, poza wyjątkami opisanymi komentarzem i testem;
- nazwy modeli zgodne z domeną (`v-model:value`, `v-model:open`, `v-model:selected`), a eventy zgodne z aktualnym stylem PeaUI; adaptery React i WC mają zachować naturalne konwencje swoich środowisk;
- stan kontrolowany oraz `v-model`, gdy komponent przechowuje wartość użytkownika; brak ukrytego powiązania z backendem, routerem albo globalnym store;
- sloty dla treści, których konsument może potrzebować semantycznie lub wizualnie dostosować, bez wymuszania kopiowania logiki komponentu;
- style BEM `peaui-<nazwa>`, istniejące mixiny, tokeny oraz CSS custom properties; brak twardo zapisanych kolorów i zachowanie jasnego/ciemnego motywu;
- responsywność od małych viewportów, brak niezamierzonego overflow oraz przewidywalne zachowanie dla długiej treści, zoomu 200–400% i powiększonego tekstu;
- zgodność co najmniej z WCAG 2.2 AA: semantyczny HTML, dostępna nazwa, poprawne role i ARIA, widoczny focus, kontrast, kolejność focusu, obsługa klawiatury oraz komunikaty live tylko wtedy, gdy są potrzebne;
- stany `disabled`, `readonly`, `loading`, `error`, `empty` i `success` tam, gdzie wynikają z funkcji komponentu; stany nie mogą opierać się wyłącznie na kolorze;
- respektowanie `prefers-reduced-motion`; animacje nie mogą blokować interakcji ani przekazywać jedynej informacji o stanie;
- testy jednostkowe logiki i renderowania, testy interakcji, klawiatury, ARIA, edge cases i modeli oraz testy przeglądarkowe axe/overflow dla reprezentatywnych stories;
- Storybook stories Vue, React i WC: podstawowy przykład, wszystkie warianty, stany, interakcje, przypadki dostępności, długie treści i mobile; portal dokumentacji musi pokazywać aktualne API;
- publiczne typy i modele danych powinny być eksportowalne, stabilne i neutralne wobec aplikacji konsumenta;
- wygląd musi dać się dostosować przez istniejące tokeny, klasy, sloty albo jawnie udokumentowane CSS variables;
- przed statusem `DONE` muszą przejść lint, Prettier, typecheck, testy Vue/React/WC, build biblioteki, build dokumentacji i buildy Storybooka.

## 8. Rejestr postępu

| ID           | Komponent                  | Etap | Status | Priorytet | Złożoność | Zależności                                            |
| ------------ | -------------------------- | ---: | ------ | --------- | --------- | ----------------------------------------------------- |
| PEA-COMP-001 | Avatar                     |    1 | IN_PROGRESS | P0        | S         | ImageView, SvgIcon                                    |
| PEA-COMP-002 | AvatarGroup                |    1 | TODO   | P1        | M         | Avatar, InfoTooltip/PopoverOverlayer                  |
| PEA-COMP-003 | DropdownMenu               |    1 | TODO   | P0        | L         | PopoverOverlayer, ButtonAction                        |
| PEA-COMP-004 | ContextMenu                |    1 | TODO   | P1        | L         | DropdownMenu lub wspólne menu, PopoverOverlayer       |
| PEA-COMP-005 | MenuBar                    |    1 | TODO   | P2        | L         | DropdownMenu lub wspólne menu                         |
| PEA-COMP-006 | SwitchToggle               |    1 | TODO   | P0        | S         | FieldLabel/MessageText                                |
| PEA-COMP-007 | ToggleButton               |    1 | TODO   | P0        | S         | ButtonAction, SvgIcon                                 |
| PEA-COMP-008 | ToggleGroup                |    1 | TODO   | P1        | M         | ToggleButton                                          |
| PEA-COMP-009 | SegmentedControl           |    1 | TODO   | P1        | M         | ToggleGroup lub wspólne prymitywy wyboru              |
| PEA-COMP-010 | SplitButton                |    1 | TODO   | P1        | M         | ButtonAction, DropdownMenu                            |
| PEA-COMP-011 | DateRangePicker            |    1 | TODO   | P1        | L         | FormDatePicker, PopoverOverlayer                      |
| PEA-COMP-012 | TimePicker                 |    1 | TODO   | P1        | L         | FormField, PopoverOverlayer                           |
| PEA-COMP-013 | DateTimePicker             |    1 | TODO   | P2        | L         | FormDatePicker, TimePicker                            |
| PEA-COMP-014 | ColorPicker                |    1 | TODO   | P2        | L         | FormInput, InputSlider, PopoverOverlayer              |
| PEA-COMP-015 | PinInput                   |    1 | TODO   | P1        | M         | FormField/FormInput                                   |
| PEA-COMP-016 | TagsInput                  |    1 | TODO   | P1        | L         | TagChip, FormInput, PopoverOverlayer                  |
| PEA-COMP-017 | RatingInput                |    1 | TODO   | P2        | M         | SvgIcon, FieldLabel                                   |
| PEA-COMP-018 | TransferList               |    1 | TODO   | P2        | L         | SearchInput, FormCheckbox, ButtonAction               |
| PEA-COMP-019 | ScrollArea                 |    1 | TODO   | P0        | M         | Brak                                                  |
| PEA-COMP-020 | VirtualList                |    1 | TODO   | P1        | L         | ScrollArea, EmptyState, SpinnerLoader                 |
| PEA-COMP-021 | InlineEdit                 |    1 | TODO   | P1        | M         | FormInput/FormNumber/FormSelect/FormTextarea          |
| PEA-COMP-022 | CopyButton                 |    1 | TODO   | P1        | S         | ButtonAction, SvgIcon, ToastAlert/MessageText         |
| PEA-COMP-023 | KeyboardKey                |    1 | TODO   | P1        | S         | Brak                                                  |
| PEA-COMP-024 | CommandPalette             |    2 | TODO   | P1        | XL        | ModalDialog, SearchInput, KeyboardKey, VirtualList    |
| PEA-COMP-025 | GuidedTour                 |    2 | TODO   | P2        | XL        | PopoverOverlayer, ButtonAction, ProgressIndicator     |
| PEA-COMP-026 | NotificationCenter         |    2 | TODO   | P2        | L         | ScrollArea, CounterBadge, EmptyState                  |
| PEA-COMP-027 | KeyboardShortcutMap        |    2 | TODO   | P2        | M         | KeyboardKey, ModalDialog, SearchInput                 |
| PEA-COMP-028 | ContextActionBar           |    2 | TODO   | P2        | M         | ButtonAction, DropdownMenu                            |
| PEA-COMP-029 | UndoRedoTimeline           |    2 | TODO   | P2        | L         | ButtonAction, KeyboardKey, ScrollArea                 |
| PEA-COMP-030 | RadialActionMenu           |    2 | TODO   | P3        | L         | ContextMenu lub wspólne menu                          |
| PEA-COMP-031 | JsonExplorer               |    3 | TODO   | P2        | L         | TreeList, CopyButton, SearchInput, VirtualList        |
| PEA-COMP-032 | DiffViewer                 |    3 | TODO   | P1        | XL        | ScrollArea, VirtualList, CopyButton                   |
| PEA-COMP-033 | ActivityTimeline           |    3 | TODO   | P2        | L         | Avatar, TagChip, ScrollArea                           |
| PEA-COMP-034 | MetricCard                 |    3 | TODO   | P1        | M         | CardPanel, InfoTooltip, SkeletonLoading               |
| PEA-COMP-035 | CalendarHeatmap            |    3 | TODO   | P2        | L         | InfoTooltip, ScrollArea                               |
| PEA-COMP-036 | StatusFlow                 |    3 | TODO   | P2        | L         | NavigationStepper, TagChip                            |
| PEA-COMP-037 | OrganizationChart          |    3 | TODO   | P2        | XL        | TreeList, SearchInput, ScrollArea                     |
| PEA-COMP-038 | RelationshipGraph          |    3 | TODO   | P2        | XL        | FullscreenContainer, SearchInput                      |
| PEA-COMP-039 | ImageAnnotation            |    4 | TODO   | P2        | XL        | ImageView, ButtonAction, SvgIcon                      |
| PEA-COMP-040 | BeforeAfterSlider          |    4 | TODO   | P2        | M         | ImageView, InputSlider                                |
| PEA-COMP-041 | HotspotViewer              |    4 | TODO   | P2        | L         | ImageView, InfoTooltip/PopoverOverlayer               |
| PEA-COMP-042 | FilePreview                |    4 | TODO   | P1        | XL        | ImageView, JsonExplorer, EmptyState                   |
| PEA-COMP-043 | AudioWaveform              |    4 | TODO   | P2        | XL        | ButtonAction, InputSlider                             |
| PEA-COMP-044 | ColorPaletteExtractor      |    4 | TODO   | P3        | L         | ImageView, CopyButton, ColorPicker                    |
| PEA-COMP-045 | MentionInput               |    5 | TODO   | P1        | L         | FormTextarea/FormInput, PopoverOverlayer, VirtualList |
| PEA-COMP-046 | CommentThread              |    5 | TODO   | P2        | XL        | MentionInput, Avatar, InlineEdit                      |
| PEA-COMP-047 | PresenceGroup              |    5 | TODO   | P2        | M         | Avatar, AvatarGroup, PopoverOverlayer                 |
| PEA-COMP-048 | VersionHistory             |    5 | TODO   | P2        | L         | ActivityTimeline, DiffViewer, DrawerPanel             |
| PEA-COMP-049 | ReviewChanges              |    5 | TODO   | P2        | L         | DiffViewer, ContextActionBar                          |
| PEA-COMP-050 | QueryBuilder               |    6 | TODO   | P1        | XL        | FormSelect, FormInput, FormNumber, FormDatePicker     |
| PEA-COMP-051 | PermissionMatrix           |    6 | TODO   | P1        | XL        | FormCheckbox, TableList, SearchInput                  |
| PEA-COMP-052 | FormulaBuilder             |    6 | TODO   | P2        | XL        | FormInput, DropdownMenu, MessageText                  |
| PEA-COMP-053 | FormWizard                 |    6 | TODO   | P1        | XL        | NavigationStepper, FormContainer                      |
| PEA-COMP-054 | FileExplorer               |    6 | TODO   | P1        | XL        | TreeList, ContextMenu, InlineEdit, VirtualList        |
| PEA-COMP-055 | ResizableWorkspace         |    6 | TODO   | P2        | XL        | FullscreenContainer, KeyboardKey                      |
| PEA-COMP-056 | DashboardGrid              |    6 | TODO   | P2        | XL        | GridItem, GridSection, ResizableWorkspace             |
| PEA-COMP-057 | SmartDataGrid              |    6 | TODO   | P1        | XL        | TableList/prymitywy tabeli, VirtualList, InlineEdit   |
| PEA-COMP-058 | WorkflowCanvas             |    7 | TODO   | P2        | XL        | FullscreenContainer, ContextMenu, KeyboardShortcutMap |
| PEA-COMP-059 | RelationshipGraph Advanced |    7 | TODO   | P3        | XL        | RelationshipGraph                                     |
| PEA-COMP-060 | OrganizationChart Advanced |    7 | TODO   | P3        | XL        | OrganizationChart                                     |

## 9. Mapa zależności i sugerowana kolejność

Strzałka oznacza „wymaga albo powinien wykorzystać”. Zależność opcjonalna może zostać zastąpiona wspólnym prymitywem, jeśli analiza API wykaże, że bezpośrednie złożenie byłoby zbyt ciasne.

```text
AvatarGroup → Avatar
PresenceGroup → Avatar + AvatarGroup
SplitButton → ButtonAction + DropdownMenu
ContextMenu → DropdownMenu lub wspólny mechanizm menu + PopoverOverlayer
MenuBar → DropdownMenu lub wspólne elementy menu
ToggleGroup → ToggleButton
SegmentedControl → ToggleGroup lub wspólny model pojedynczego wyboru
DateRangePicker → FormDatePicker
DateTimePicker → FormDatePicker + TimePicker
TagsInput → TagChip + FormInput
VirtualList → ScrollArea
CommandPalette → ModalDialog + SearchInput + KeyboardKey + VirtualList
NotificationCenter → ScrollArea + CounterBadge
KeyboardShortcutMap → KeyboardKey + ModalDialog
JsonExplorer → TreeList + CopyButton; VirtualList dla dużych danych
DiffViewer → ScrollArea; opcjonalnie VirtualList
ReviewChanges → DiffViewer
FileExplorer → TreeList + ContextMenu + InlineEdit; VirtualList dla dużych katalogów
FormWizard → NavigationStepper + FormContainer
ResizableWorkspace → FullscreenContainer
DashboardGrid → GridItem + GridSection; opcjonalnie prymitywy ResizableWorkspace
ImageAnnotation → ImageView
BeforeAfterSlider → ImageView
HotspotViewer → ImageView + InfoTooltip lub PopoverOverlayer
ColorPaletteExtractor → ImageView + CopyButton
QueryBuilder → FormSelect + FormInput + FormNumber + FormDatePicker
PermissionMatrix → FormCheckbox + TableList lub wspólne prymitywy tabeli
SmartDataGrid → TableList lub wydzielone prymitywy tabeli + VirtualList + InlineEdit
WorkflowCanvas → FullscreenContainer + ContextMenu + KeyboardShortcutMap
RelationshipGraph Advanced → RelationshipGraph
OrganizationChart Advanced → OrganizationChart
```

Rekomendowana kolejność fundamentów w etapie 1: `Avatar`, `SwitchToggle`, `ToggleButton`, `ScrollArea`, `KeyboardKey`, `DropdownMenu`; następnie komponenty zależne. Zależność nie oznacza automatycznego rozpoczęcia pracy — status każdej pozycji zmienia się wyłącznie w ramach jawnego zadania.

## 10. Etap 1 — brakujące komponenty standardowe

Celem etapu jest uzupełnienie podstawowego zestawu PeaUI o powszechne kontrolki, na których będą opierały się późniejsze systemy.

### Avatar

- Status: IN_PROGRESS
- Priorytet: P0
- Złożoność: S
- Kategoria: Data display / Media
- Zależności: istniejące `ImageView`, `SvgIcon`
- Potencjalne komponenty pomocnicze: `AvatarStatus`, utility do inicjałów
- Czy wymaga zewnętrznej biblioteki: Nie
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — `ImageView`, `SvgIcon`, tokeny rozmiarów i statusów

#### Cel

Prezentowanie osoby lub podmiotu przez zdjęcie, inicjały albo ikonę z przewidywalnym fallbackiem.

#### Główne zastosowania

Listy użytkowników, nagłówki profilu, komentarze, członkowie zespołu, autorzy i status obecności.

#### Oczekiwane działanie

Komponent próbuje wyświetlić obraz, podczas ładowania pokazuje stabilny placeholder, a po błędzie przechodzi do inicjałów lub ikony. Zmiana `src` resetuje stan ładowania i błędu. Status jest nakładką, ale nie może zasłaniać istotnej części obrazu.

#### Główne funkcjonalności

Obraz i fallback, automatyczne lub jawne inicjały, kontrola `alt`, wskaźnik statusu, lazy loading, callback błędu/załadowania oraz możliwość renderowania własnej treści.

#### Warianty

Rozmiary `xs | s | m | l | xl`, kształt `circle | rounded`, źródło `image | initials | icon`, status `online | offline | away | busy | none`.

#### Stany komponentu

`idle`, `loading`, `loaded`, `error`, `fallback`, opcjonalnie `disabled` dla klikalnego wariantu.

#### Proponowane API

Propsy: `src`, `alt`, `name`, `initials`, `size`, `shape`, `status`, `statusLabel`, `loading`, `fallbackIcon`, `interactive`, `ariaLabel`, `dataTestId`. `name` służy do wyliczenia inicjałów, ale nie zastępuje świadomej decyzji o tekście alternatywnym.

#### Proponowane sloty

`default` dla własnego fallbacku, `status` dla własnego wskaźnika, opcjonalnie `image` dla kontrolowanego renderera obrazu.

#### Proponowane eventy

`load`, `error`, `click` tylko w wariancie interaktywnym.

#### Obsługa v-model

Nie dotyczy; stan źródła jest kontrolowany przez propsy.

#### Obsługa klawiatury

Avatar prezentacyjny nie trafia do tab order. Wariant interaktywny musi renderować semantyczny przycisk lub link i reagować na standardowe Enter/Spacja bez emulowania kliknięcia na `div`.

#### Dostępność i ARIA

Zdjęcie informacyjne ma znaczący `alt`; zdjęcie dekoracyjne `alt=""`. Fallback powinien mieć równoważną dostępną nazwę. Tekst statusu ma być dostępny dla czytnika, ale zmiana obecności nie powinna automatycznie używać live regionu bez decyzji produktu.

#### Responsywność

Rozmiar pozostaje deterministyczny, avatar nie kurczy się w flexie, długie inicjały są ograniczone i nie powodują overflow przy zoomie.

#### Wymagane Storybook stories

Obraz, inicjały, ikona, wszystkie rozmiary/kształty/statusy, loading, błąd obrazu, długie imię, tryb ciemny i wariant interaktywny.

#### Zakres testów

Kolejność fallbacków, reset po zmianie `src`, eventy obrazu, dostępna nazwa, dekoracyjny obraz, klasy wariantów, brak niepotrzebnego tab stopu i kontrast statusów.

#### Kryteria ukończenia

Fallback nie powoduje skoku layoutu; semantyka obrazu i wariantu interaktywnego jest poprawna; wszystkie statusy spełniają kontrast; API oraz stories mają parytet Vue/React/WC.

#### Poza zakresem pierwszej wersji

Kadrowanie zdjęcia, upload, edycja profilu i pobieranie danych użytkownika.

### AvatarGroup

- Status: TODO
- Priorytet: P1
- Złożoność: M
- Kategoria: Data display
- Zależności: `Avatar`; opcjonalnie `InfoTooltip` lub `PopoverOverlayer`
- Potencjalne komponenty pomocnicze: `AvatarOverflow`, typ `AvatarGroupItem`
- Czy wymaga zewnętrznej biblioteki: Nie
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — `InfoTooltip`, `PopoverOverlayer`, `CounterBadge`

#### Cel

Kompaktowe pokazanie grupy osób przez nachodzące na siebie avatary i kontrolowany licznik nadmiarowych pozycji.

#### Główne zastosowania

Członkowie projektu, uczestnicy, udostępnienia, przypisane osoby oraz obecność w dokumencie.

#### Oczekiwane działanie

Grupa renderuje maksymalnie `maxVisible` elementów w stabilnej kolejności. Pozostałe elementy reprezentuje przycisk `+N`, który może otworzyć pełną listę. Kliknięcie avatara identyfikuje konkretny rekord, a nakładanie nie może uniemożliwiać focusu.

#### Główne funkcjonalności

Limit widocznych pozycji, licznik, kierunek nakładania, kontrolowany popover, etykiety użytkowników, event wyboru oraz możliwość własnego renderowania elementu.

#### Warianty

Rozmiary zgodne z `Avatar`, kierunek `start | end`, układ `overlap | spaced`, overflow `count | popover | none`.

#### Stany komponentu

Pusta grupa, grupa mieszcząca się w limicie, overflow zamknięty/otwarty, element disabled, loading listy szczegółowej.

#### Proponowane API

Propsy: `items`, `maxVisible`, `size`, `shape`, `overlap`, `direction`, `overflowMode`, `open`, `itemKey`, `ariaLabel`, `disabled`, `dataTestId`. Element: `id`, `name`, `src`, `alt`, `initials`, `status`, `disabled`, `metadata`.

#### Proponowane sloty

`item`, `overflow`, `popover-header`, `popover-item`, `empty`.

#### Proponowane eventy

`select`, `overflowClick`, `update:open`.

#### Obsługa v-model

Opcjonalne `v-model:open` steruje panelem pełnej listy; dane grupy pozostają kontrolowane przez `items`.

#### Obsługa klawiatury

Tylko elementy klikalne i przycisk overflow są tabowalne. Enter/Spacja aktywują element; Escape zamyka popover i przywraca focus do `+N`.

#### Dostępność i ARIA

Kontener powinien być listą z etykietą grupy. Nakładające się elementy zachowują kolejność DOM. Przycisk `+N` ma nazwę typu „Pokaż 4 pozostałych użytkowników”, `aria-expanded` i `aria-controls`; pełna lista nie duplikuje niepotrzebnie treści dla czytnika.

#### Responsywność

Komponent może obniżać limit tylko przez jawną konfigurację; nie może ucinać focus ringów ani przekraczać kontenera. Popover mieści się w viewport.

#### Wymagane Storybook stories

Pusta grupa, 1–3 osoby, overflow, kierunki, statusy, kliknięcia, popover, mały viewport i długie nazwy.

#### Zakres testów

Obliczenie widocznych/ukrytych, stabilność kluczy, selekcja, focus po zamknięciu, nazwa licznika, kolejność DOM i responsywny overflow.

#### Kryteria ukończenia

Limit i licznik są poprawne dla wartości brzegowych; każdą akcję da się wykonać klawiaturą; lista jest semantyczna; integracje frameworkowe mają identyczny rezultat.

#### Poza zakresem pierwszej wersji

Pobieranie użytkowników, presence transport, edycja członkostwa i wirtualizacja pełnej listy.

### DropdownMenu

- Status: TODO
- Priorytet: P0
- Złożoność: L
- Kategoria: Navigation / Overlays
- Zależności: `PopoverOverlayer`, `ButtonAction`, `SvgIcon`
- Potencjalne komponenty pomocnicze: `MenuRoot`, `MenuItem`, `MenuGroup`, `MenuSeparator`, `MenuCheckboxItem`, `MenuRadioGroup`, `Submenu`
- Czy wymaga zewnętrznej biblioteki: Nie; ewentualna biblioteka pozycjonowania wymaga osobnej decyzji architektonicznej
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — warstwa i przyciski istnieją, ale mechanizm menu powinien być współdzielony z ContextMenu i MenuBar

#### Cel

Dostępne menu akcji otwierane przez trigger, obsługujące proste i złożone kolekcje poleceń.

#### Główne zastosowania

Menu „więcej”, operacje na rekordzie, wybór ustawień, akcje grupowane oraz podmenu.

#### Oczekiwane działanie

Trigger otwiera menu przy sobie; focus przechodzi na właściwą pozycję, porusza się zgodnie ze wzorcem ARIA menu, omija separatory i nie aktywuje elementów disabled. Wybór zwykłej akcji domyślnie zamyka menu; checkbox/radio może zachować menu otwarte według konfiguracji. Podmenu jest opóźnione na hover, ale natychmiast dostępne z klawiatury.

#### Główne funkcjonalności

Elementy akcji, ikony, skróty, grupy, separatory, disabled, checkbox/radio, zagnieżdżenie, typeahead, kontrola otwarcia, kolizje viewportu i przywracanie focusu.

#### Warianty

`compact | comfortable`, wyrównanie `start | center | end`, strona `top | right | bottom | left`, elementy zwykłe/destrukcyjne/checkbox/radio/submenu.

#### Stany komponentu

Zamknięte, otwarte, focus na elemencie, podmenu otwarte, empty, loading, disabled trigger.

#### Proponowane API

Propsy root: `items`, `open`, `disabled`, `placement`, `align`, `offset`, `closeOnSelect`, `loop`, `ariaLabel`, `dataTestId`. Element: `id`, `type`, `label`, `icon`, `shortcut`, `disabled`, `checked`, `value`, `children`, `variant`, `closeOnSelect`.

#### Proponowane sloty

`trigger`, `item`, `item-icon`, `item-shortcut`, `group-label`, `empty`, `loading`; opcjonalne komponenty potomne dla deklaratywnej kompozycji.

#### Proponowane eventy

`update:open`, `select`, `checkedChange`, `valueChange`, `openChange`, `escape`, `outsideClick`.

#### Obsługa v-model

`v-model:open`; wartości checkbox/radio najlepiej kontrolować w modelu elementów albo przez dedykowane modele grup w API kompozycyjnym.

#### Obsługa klawiatury

Enter/Spacja/ArrowDown otwierają menu; ArrowUp może otworzyć od końca; strzałki poruszają focusem; Home/End skaczą; znaki uruchamiają typeahead; ArrowRight otwiera podmenu, ArrowLeft je zamyka; Escape zamyka bieżący poziom; Tab zamyka menu bez pułapki focusu.

#### Dostępność i ARIA

Role `menu`, `menuitem`, `menuitemcheckbox`, `menuitemradio`, `group`, `separator`; trigger ma `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`. Każdy element ma dostępną nazwę, stan checked i disabled. Logika focusu musi odpowiadać wzorcowi WAI-ARIA APG.

#### Responsywność

Warstwa zmienia stronę i ogranicza wysokość do viewportu; długie etykiety i skróty nie wypychają menu; na dotyku podmenu musi być otwierane jawnie.

#### Wymagane Storybook stories

Proste akcje, ikony/skróty, grupy/separatory, disabled, destrukcyjne, checkbox/radio, zagnieżdżenie, controlled, loading/empty, kolizje krawędzi i pełna nawigacja klawiaturowa.

#### Zakres testów

Otwieranie/zamykanie, focus startowy i powrót, wszystkie klawisze, typeahead, wybór, zachowanie podmenu, outside click, ARIA, pozycjonowanie i brak axe violations.

#### Kryteria ukończenia

Wzorzec APG działa dla wszystkich typów pozycji, maksymalna głębokość jest udokumentowana, fokus nie ginie przy zmianie danych, a wspólny mechanizm może zostać użyty przez ContextMenu/MenuBar.

#### Poza zakresem pierwszej wersji

Dowolne formularze wewnątrz menu, więcej niż dwa poziomy podmenu i automatyczne mapowanie globalnych skrótów.

### ContextMenu

- Status: TODO
- Priorytet: P1
- Złożoność: L
- Kategoria: Navigation / Overlays
- Zależności: `DropdownMenu` lub wspólny mechanizm menu, `PopoverOverlayer`
- Potencjalne komponenty pomocnicze: `ContextMenuTrigger`, composable do long press i pozycji kursora
- Czy wymaga zewnętrznej biblioteki: Nie
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — całą semantykę pozycji menu i pozycjonowanie warstwy

#### Cel

Udostępnienie kontekstowych akcji dla wskazanego obszaru bez uzależniania ich wyłącznie od prawego przycisku myszy.

#### Główne zastosowania

Rekordy tabeli, pliki, węzły drzewa, obszary canvas i elementy multimedialne.

#### Oczekiwane działanie

Menu otwiera się przy współrzędnych zdarzenia `contextmenu`, przez klawisz Menu/Shift+F10 przy aktywnym elemencie albo po konfigurowalnym długim przytrzymaniu. Nowy kontekst zastępuje stary; scroll, usunięcie celu lub utrata ważności kontekstu zamyka warstwę zgodnie z konfiguracją.

#### Główne funkcjonalności

Pozycjonowanie przy punkcie lub celu, dotykowy long press z progiem ruchu, te same typy pozycji co DropdownMenu, kontrolowany kontekst danych, anulowanie natywnego menu tylko po aktywacji komponentu.

#### Warianty

Trigger `pointer | keyboard | both`, pozycja `cursor | target`, dotyk `long-press | disabled`.

#### Stany komponentu

Zamknięte, oczekiwanie long press, otwarte, zmiana kontekstu, cel usunięty, disabled.

#### Proponowane API

Propsy: `items`, `open`, `context`, `disabled`, `longPress`, `longPressDelay`, `closeOnScroll`, `ariaLabel`, `dataTestId`. Metoda/ref: `openAt({ x, y, context })`, `close()`.

#### Proponowane sloty

`trigger` jako scoped slot z handlerami, `item`, `empty`, `loading`.

#### Proponowane eventy

`update:open`, `open`, `close`, `select`, `contextChange`, `longPressCancel`.

#### Obsługa v-model

`v-model:open`; kontekst pozostaje jawnie kontrolowany propem lub payloadem metody.

#### Obsługa klawiatury

Shift+F10 i klawisz Menu otwierają przy fokusowanym celu; dalsza obsługa identyczna z DropdownMenu; Escape przywraca focus do celu, jeśli nadal istnieje.

#### Dostępność i ARIA

Funkcje muszą mieć równoważny widoczny lub klawiaturowy sposób wywołania. Nie wolno blokować natywnego menu globalnie. Role i stany pozycji pochodzą ze wspólnego wzorca menu.

#### Responsywność

Punkt otwarcia jest przesuwany tak, aby warstwa pozostała w viewport; long press nie może kolidować ze scrollem, zaznaczaniem tekstu ani zoomem systemowym.

#### Wymagane Storybook stories

Mysz, Shift+F10/Menu, long press, krawędzie viewportu, podmenu, dynamiczny kontekst, usunięcie celu i disabled.

#### Zakres testów

Współrzędne, anulowanie natywnego eventu, próg long press/ruchu, klawiatura, focus po zamknięciu, zmiana kontekstu, cleanup timerów i ARIA.

#### Kryteria ukończenia

Każda akcja ma alternatywę bez myszy, menu nie otwiera się przypadkowo podczas scrollu dotykowego, a semantyka pozostaje identyczna z DropdownMenu.

#### Poza zakresem pierwszej wersji

Menu radialne, gesty wielodotykowe i globalne przechwytywanie prawego kliknięcia.

### MenuBar

- Status: TODO
- Priorytet: P2
- Złożoność: L
- Kategoria: Navigation
- Zależności: `DropdownMenu` lub wspólne prymitywy menu
- Potencjalne komponenty pomocnicze: `MenuBarRoot`, `MenuBarTrigger`, `MenuBarMenu`
- Czy wymaga zewnętrznej biblioteki: Nie
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — pozycje, grupy, podmenu i warstwę DropdownMenu

#### Cel

Poziomy pasek menu aplikacyjnego z zachowaniem znanym z aplikacji desktopowych.

#### Główne zastosowania

Edytory, narzędzia administracyjne, aplikacje produktywności i rozbudowane przestrzenie robocze.

#### Oczekiwane działanie

Jeden trigger w pasku ma roving tabindex. Po otwarciu sekcji strzałki lewo/prawo przełączają menu nadrzędne bez zamykania trybu menu, a góra/dół poruszają się po pozycjach. Akcje i skróty są przekazywane z zewnątrz.

#### Główne funkcjonalności

Wiele sekcji, zagnieżdżone pozycje, checkbox/radio, aktywny trigger, mnemoniki lub typeahead, controlled open menu i widoczne skróty.

#### Warianty

`default | compact`, orientacja pozioma w v1, trigger tekstowy lub tekst+ikona.

#### Stany komponentu

Brak aktywnego menu, fokus w pasku, sekcja otwarta, podmenu otwarte, sekcja disabled.

#### Proponowane API

Propsy: `menus`, `openMenu`, `loop`, `ariaLabel`, `disabled`, `dataTestId`; menu: `id`, `label`, `icon`, `disabled`, `items`.

#### Proponowane sloty

`menu-trigger`, `item`, `group-label`, `shortcut`.

#### Proponowane eventy

`update:openMenu`, `select`, `focusChange`.

#### Obsługa v-model

`v-model:openMenu` przechowuje identyfikator otwartej sekcji albo `null`.

#### Obsługa klawiatury

Lewo/prawo między triggerami, dół/góra otwierają i wybierają skrajny element, Home/End skaczą po pasku, Escape zamyka poziom, Tab opuszcza cały widget. Zachowanie podmenu zgodne z DropdownMenu.

#### Dostępność i ARIA

Root `menubar`, triggery `menuitem` z `aria-haspopup`, `aria-expanded`, `aria-controls`; pozycje zgodne z APG menubar. Skróty mogą używać `aria-keyshortcuts`, ale tylko gdy rzeczywiście działają w aplikacji.

#### Responsywność

Na małej szerokości pasek może przewijać się poziomo lub przejść do jawnie skonfigurowanego menu overflow; nie może sam zmieniać wzorca na hamburger bez API i dokumentacji.

#### Wymagane Storybook stories

Wiele menu, podmenu, checkbox/radio, disabled, controlled, skróty, overflow oraz kompletna obsługa strzałkami.

#### Zakres testów

Roving tabindex, przełączanie otwartych sekcji, focus, typeahead, eventy, ARIA i zachowanie przy dynamicznej zmianie listy.

#### Kryteria ukończenia

Pełny wzorzec APG menubar działa bez myszy, menu współdzieli prymitywy z DropdownMenu i nie duplikuje logiki focusu.

#### Poza zakresem pierwszej wersji

Automatyczne wykonywanie skrótów, menu systemu operacyjnego i pionowy menubar.

### SwitchToggle

- Status: TODO
- Priorytet: P0
- Złożoność: S
- Kategoria: Form / Data entry
- Zależności: opcjonalnie `FieldLabel`, `MessageText`, `SpinnerLoader`
- Potencjalne komponenty pomocnicze: wspólny wrapper pola formularzowego
- Czy wymaga zewnętrznej biblioteki: Nie
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — etykiety, opis, komunikat błędu i loader

#### Cel

Natychmiastowa zmiana ustawienia boolean za pomocą dostępnego przełącznika.

#### Główne zastosowania

Włączanie funkcji, preferencje, widoczność i zgody, które obowiązują bez osobnego przycisku zapisu.

#### Oczekiwane działanie

Kliknięcie lub Spacja przełącza wartość, chyba że komponent jest disabled albo loading. Etykieta aktywuje kontrolkę. Wartości domenowe mogą zostać zmapowane przez `trueValue` i `falseValue` bez utraty typowania.

#### Główne funkcjonalności

`v-model`, label, opis, błąd, wymaganie, disabled, readonly, loading, rozmiary, własne wartości i stan formularza.

#### Warianty

Rozmiary `s | m | l`, label z lewej/prawej, opcjonalny tekst stanu bez polegania wyłącznie na kolorze.

#### Stany komponentu

On, off, focus, hover, disabled on/off, readonly, loading, error.

#### Proponowane API

Generyczne propsy: `value`, `trueValue`, `falseValue`, `id`, `name`, `label`, `description`, `error`, `size`, `disabled`, `readonly`, `loading`, `required`, `ariaLabel`, `dataTestId`.

#### Proponowane sloty

`label`, `description`, `error`, `thumb`, opcjonalnie `on-label` i `off-label`.

#### Proponowane eventy

`update:value`, `change`, `focus`, `blur`.

#### Obsługa v-model

Wymagane `v-model:value`; wartość typu boolean albo typu wynikającego z `trueValue`/`falseValue`.

#### Obsługa klawiatury

Tab ustawia focus, Spacja przełącza, Enter może przełączać tylko jeśli udokumentowana implementacja przycisku zachowuje tę konwencję. Loading/disabled nie reagują.

#### Dostępność i ARIA

Natywny checkbox stylizowany jako switch albo element `button role="switch"`; `aria-checked`, poprawne `label`, `aria-describedby`, `aria-invalid`, `aria-required`. Loading ma dostępny tekst i nie generuje powtarzających się komunikatów.

#### Responsywność

Cel dotykowy minimum 44×44 CSS px przez obszar label; tekst zawija się, a sama szyna nie kurczy.

#### Wymagane Storybook stories

On/off, wszystkie rozmiary, własne wartości, długie label/description, disabled, readonly, loading, error, dark mode.

#### Zakres testów

Model i mapowanie wartości, klik label, klawiatura, blokady, ARIA relacje, eventy, formularz i kontrasty.

#### Kryteria ukończenia

Kontrolka działa jako switch dla czytnika, ma stabilny model generyczny, nie zmienia wartości w stanach blokujących i przechodzi testy formularza w trzech targetach.

#### Poza zakresem pierwszej wersji

Tri-state, asynchroniczny zapis wykonywany wewnątrz komponentu i automatyczne wycofanie wartości po błędzie API.

### ToggleButton

- Status: TODO
- Priorytet: P0
- Złożoność: S
- Kategoria: Data entry
- Zależności: `ButtonAction`, `SvgIcon`
- Potencjalne komponenty pomocnicze: wspólny prymityw przycisku przełączalnego
- Czy wymaga zewnętrznej biblioteki: Nie
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — style i semantyka `ButtonAction`

#### Cel

Przycisk reprezentujący utrzymywany stan włączony/wyłączony.

#### Główne zastosowania

Pogrubienie tekstu, przypięcie, ulubione, widoczność warstwy i pojedyncze ustawienia narzędzi.

#### Oczekiwane działanie

Aktywacja przełącza model i aktualizuje `aria-pressed`. Tekst, ikona albo ich połączenie zachowują stałą dostępną nazwę niezależnie od stanu.

#### Główne funkcjonalności

Controlled toggle, ikona, label, warianty wizualne, rozmiary, disabled, readonly, loading i możliwość wymuszenia wartości.

#### Warianty

Treść `text | icon | icon-text`, wygląd `default | outline | ghost`, rozmiary zgodne z `ButtonAction`.

#### Stany komponentu

Pressed/unpressed, focus, hover, disabled, loading.

#### Proponowane API

Propsy: `value`, `label`, `pressedLabel`, `icon`, `pressedIcon`, `size`, `variant`, `disabled`, `readonly`, `loading`, `ariaLabel`, `dataTestId`.

#### Proponowane sloty

`default`, `icon`, `pressed-icon`.

#### Proponowane eventy

`update:value`, `change`, `click`.

#### Obsługa v-model

`v-model:value` typu boolean.

#### Obsługa klawiatury

Natywne zachowanie button: Enter i Spacja; brak dodatkowego tab stopu dla ikony.

#### Dostępność i ARIA

Semantyczny `button` z `aria-pressed`; nazwa nie może zmieniać się w sposób utrudniający odnalezienie kontrolki. Sam kolor nie sygnalizuje stanu, a ikony dekoracyjne są ukryte przed AT.

#### Responsywność

Ikonowy wariant zachowuje cel dotykowy; tekst może się zawijać tylko w jawnie dozwolonym wariancie.

#### Wymagane Storybook stories

Tekst, ikona, kombinacja, pressed/unpressed, warianty, controlled, disabled/loading i focus.

#### Zakres testów

Model, `aria-pressed`, klawiatura, accessible name, eventy, blokady i klasy.

#### Kryteria ukończenia

Stan i semantyka pozostają zsynchronizowane, nie występuje podwójna emisja, a komponent może być bezpiecznie użyty przez ToggleGroup.

#### Poza zakresem pierwszej wersji

Wybór wielowartościowy, roving tabindex i logika grupy.

### ToggleGroup

- Status: TODO
- Priorytet: P1
- Złożoność: M
- Kategoria: Data entry
- Zależności: `ToggleButton`
- Potencjalne komponenty pomocnicze: provider kontekstu grupy, utility roving tabindex
- Czy wymaga zewnętrznej biblioteki: Nie
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — `ToggleButton`, `FieldLabel`, `MessageText`

#### Cel

Zarządzanie powiązaną grupą przycisków przełączalnych z pojedynczym lub wielokrotnym wyborem.

#### Główne zastosowania

Formatowanie tekstu, filtry, wybór widoku, narzędzia i zestawy niezależnych opcji.

#### Oczekiwane działanie

Grupa synchronizuje stany potomków, utrzymuje jeden tab stop przez roving tabindex i egzekwuje tryb single/multiple, `required` oraz możliwość odznaczenia. Dynamiczne usunięcie aktywnej pozycji przenosi focus deterministycznie.

#### Główne funkcjonalności

Single/multiple, orientacja, loop, disabled grupy/elementu, obowiązkowy wybór, deselect, controlled model i deklaratywne lub tablicowe elementy.

#### Warianty

Orientacja `horizontal | vertical`, wybór `single | multiple`, wygląd `separate | attached`.

#### Stany komponentu

Brak wyboru, jeden/wiele wybranych, focus wewnątrz, disabled, błąd required.

#### Proponowane API

Propsy: `value`, `type`, `items`, `orientation`, `required`, `allowEmpty`, `loop`, `disabled`, `label`, `error`, `ariaLabel`, `dataTestId`.

#### Proponowane sloty

`default` dla złożenia ToggleButton, `item`, `label`, `error`.

#### Proponowane eventy

`update:value`, `change`, `focusChange`.

#### Obsługa v-model

`v-model:value`: pojedynczy `string | number | null` w trybie single albo tablica identyfikatorów w multiple.

#### Obsługa klawiatury

Strzałki zgodne z orientacją przesuwają focus, Home/End wybierają skrajny focus, Tab wchodzi raz do grupy, Enter/Spacja aktywują. Kierunek RTL musi być świadomie przetestowany.

#### Dostępność i ARIA

Kontener `group` lub `toolbar` zależnie od zastosowania, dostępna etykieta i `aria-orientation`. Potomkowie zachowują `aria-pressed`; jeśli API przyjmie semantykę radio dla single, musi to być osobny jawny wariant, a nie mieszanie ról.

#### Responsywność

Opcjonalne zawijanie lub poziomy scroll; attached border i focus ring nie mogą znikać na łączeniach.

#### Wymagane Storybook stories

Single, multiple, required, allowEmpty, orientacje, attached/separate, disabled item/group, dynamic items, mobile overflow.

#### Zakres testów

Roving tabindex, strzałki, model single/multiple, reguły required/allowEmpty, dynamiczne elementy, ARIA i focus ring.

#### Kryteria ukończenia

Zawsze istnieje najwyżej jeden tab stop, reguły wyboru są deterministyczne, typ modelu odpowiada trybowi i wszystkie interakcje działają bez myszy.

#### Poza zakresem pierwszej wersji

Przeciąganie kolejności i zagnieżdżone grupy.

### SegmentedControl

- Status: TODO
- Priorytet: P1
- Złożoność: M
- Kategoria: Data entry / Navigation
- Zależności: `ToggleGroup` lub wspólny prymityw roving focus
- Potencjalne komponenty pomocnicze: `SegmentItem`, animowany indicator
- Czy wymaga zewnętrznej biblioteki: Nie
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — wzorce wyboru i tokeny przycisków

#### Cel

Kompaktowy wybór dokładnie jednej opcji z niewielkiego, wzajemnie wykluczającego się zestawu.

#### Główne zastosowania

Przełączanie widoku list/grid, zakresu czasu, trybu prezentacji i prostych filtrów.

#### Oczekiwane działanie

Wybór jest zawsze jednoznaczny. Kliknięcie lub klawiatura aktualizują model; animowany wskaźnik podąża za wybraną pozycją, lecz przy reduced motion przeskakuje bez animacji. Disabled item nie może zostać wybrany.

#### Główne funkcjonalności

Tekst/ikony, równy lub naturalny rozkład, single selection, controlled model, animowany indicator, disabled, responsive overflow.

#### Warianty

`equal | auto`, rozmiary `s | m | l`, treść `text | icon | icon-text`, szerokość `content | full`.

#### Stany komponentu

Wybrany segment, hover/focus, disabled segment/grupa, overflow, brak poprawnej wartości.

#### Proponowane API

Propsy: `value`, `items`, `size`, `distribution`, `fullWidth`, `disabled`, `orientation`, `ariaLabel`, `dataTestId`; item: `value`, `label`, `icon`, `disabled`, `ariaLabel`.

#### Proponowane sloty

`item`, `item-icon`, opcjonalnie `indicator` tylko bez naruszania semantyki.

#### Proponowane eventy

`update:value`, `change`, `focusChange`.

#### Obsługa v-model

Wymagane `v-model:value` dla identyfikatora pojedynczej opcji.

#### Obsługa klawiatury

Roving tabindex; strzałki wybierają lub tylko przenoszą focus zgodnie z udokumentowanym trybem `activation`; Home/End. Domyślnie automatic activation dla krótkich, natychmiastowych opcji.

#### Dostępność i ARIA

Domyślnie `radiogroup`/`radio` z `aria-checked`; jeżeli kontrolka przełącza panele treści, należy rozważyć użycie istniejącego `NavigationTabs` zamiast zmiany roli SegmentedControl. Ikonowe segmenty wymagają nazw.

#### Responsywność

`equal` może przejść do poziomego scrollu zamiast zgniatania label; widoczny segment ma zostać przewinięty w obszar. Wskaźnik aktualizuje po resize i zmianie fontu.

#### Wymagane Storybook stories

Equal/auto, full width, tekst/ikony, disabled, controlled, reduced motion, długie etykiety i mały viewport.

#### Zakres testów

Model, role radio, klawiatura, indicator po resize, disabled, RTL, overflow i reduced motion.

#### Kryteria ukończenia

Semantyka nie dubluje Tabs, wybór jest zawsze spójny, wskaźnik nie powoduje layout shift i aktywna pozycja pozostaje widoczna mobilnie.

#### Poza zakresem pierwszej wersji

Multiple selection, dowolna treść formularzowa i przeciąganie segmentów.

### SplitButton

- Status: TODO
- Priorytet: P1
- Złożoność: M
- Kategoria: Data entry / Navigation
- Zależności: `ButtonAction`, `DropdownMenu`
- Potencjalne komponenty pomocnicze: `SplitButtonPrimary`, `SplitButtonTrigger`
- Czy wymaga zewnętrznej biblioteki: Nie
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — główna akcja, ikony i menu

#### Cel

Połączenie często używanej akcji głównej z menu alternatywnych działań w jednym komponencie.

#### Główne zastosowania

Zapisz/Zapisz jako, Utwórz wariant, Eksportuj domyślnie/inny format i Wyślij z opcjami.

#### Oczekiwane działanie

Lewa/główna część emituje własną akcję, prawa otwiera DropdownMenu. Loading głównej akcji nie może przypadkowo uruchamiać menu; polityka blokowania obu części jest jawna. Focus może poruszać się między dwoma natywnymi przyciskami.

#### Główne funkcjonalności

Oddzielne eventy, menu, ikony, warianty ButtonAction, loading, disabled całości lub części, controlled open.

#### Warianty

`primary | secondary | danger`, rozmiary zgodne z ButtonAction, menu `start | end`, ikona opcjonalna.

#### Stany komponentu

Idle, hover/focus każdej części, menu open, primary loading, menu loading, disabled całość/część.

#### Proponowane API

Propsy: `label`, `icon`, `items`, `variant`, `size`, `open`, `disabled`, `primaryDisabled`, `menuDisabled`, `loading`, `menuLoading`, `ariaLabel`, `menuAriaLabel`, `dataTestId`.

#### Proponowane sloty

`default`/`label`, `icon`, `menu-item`, `menu-trigger-icon`.

#### Proponowane eventy

`primaryClick`, `select`, `update:open`.

#### Obsługa v-model

`v-model:open` dla menu; brak modelu dla akcji.

#### Obsługa klawiatury

Tab przechodzi między częściami; Enter/Spacja aktywują fokusowaną część; ArrowDown na menu triggerze otwiera menu. Escape zamyka i zwraca focus do triggera.

#### Dostępność i ARIA

Dwa odrębne przyciski w grupie z dostępną nazwą. Trigger menu ma `aria-haspopup`, `aria-expanded`, `aria-controls`; separator wizualny nie może być jedyną granicą focusu.

#### Responsywność

Label może być skracany tylko z dostępną pełną nazwą; menu pozostaje w viewport. Cel menu nie może spaść poniżej minimalnego rozmiaru dotykowego.

#### Wymagane Storybook stories

Warianty, ikony, loading, częściowo disabled, controlled menu, długie label, mobile, menu z grupami.

#### Zakres testów

Rozdzielenie eventów, brak propagacji, focus, menu ARIA, loading/disabled, klawiatura i pozycjonowanie.

#### Kryteria ukończenia

Akcje nigdy nie są mylone, każda część ma poprawną semantykę i focus, a DropdownMenu zachowuje komplet swoich gwarancji.

#### Poza zakresem pierwszej wersji

Zapamiętywanie ostatniej wybranej akcji jako głównej i więcej niż jedna dodatkowa strefa.

### DateRangePicker

- Status: TODO
- Priorytet: P1
- Złożoność: L
- Kategoria: Form
- Zależności: istniejący `FormDatePicker`, `PopoverOverlayer`, `FormField`
- Potencjalne komponenty pomocnicze: współdzielone prymitywy kalendarza, `DateRangePresetList`
- Czy wymaga zewnętrznej biblioteki: Preferowane Nie; biblioteka dat tylko po analizie locale, stref i rozmiaru
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — `FormDatePicker` już częściowo obsługuje zakres; najpierw ocenić jego rozbudowę zamiast duplikacji

#### Cel

Pełny, walidowany wybór daty początkowej i końcowej z presetami i opcjonalnym widokiem dwóch miesięcy.

#### Główne zastosowania

Raporty, rezerwacje, filtry, okresy rozliczeniowe i zakresy dostępności.

#### Oczekiwane działanie

Pierwszy wybór ustawia początek, drugi koniec; kolejność jest walidowana zgodnie z polityką `swap | reject | resetEnd`. Hover/podgląd zakresu nie zastępuje zatwierdzonego stanu. Ręczne pola i kalendarz są zawsze zsynchronizowane; anulowanie może przywrócić wartość sprzed otwarcia.

#### Główne funkcjonalności

Jeden/dwa kalendarze, min/max, disabled dates, presety, ręczne wpisanie, locale/format, controlled open/value, apply/cancel i błędy kolejności.

#### Warianty

`single-calendar | dual-calendar`, `immediate | confirm`, `single-input | two-inputs`, presety pionowe/ukryte.

#### Stany komponentu

Empty, wybór początku, podgląd zakresu, kompletny zakres, invalid order, partial input, disabled/readonly/loading/error, open/closed.

#### Proponowane API

Propsy: `value`, `open`, `minDate`, `maxDate`, `isDateDisabled`, `presets`, `locale`, `format`, `parse`, `calendars`, `selectionOrder`, `confirm`, `required`, `disabled`, `readonly`, `loading`, `label`, `description`, `error`, `startLabel`, `endLabel`, `dataTestId`. Model: tuple `[string | null, string | null]` albo nazwany typ `DateRangeValue`.

#### Proponowane sloty

`trigger`, `day`, `preset`, `footer`, `start-label`, `end-label`, `error`.

#### Proponowane eventy

`update:value`, `update:open`, `change`, `startChange`, `endChange`, `invalid`, `apply`, `cancel`, `monthChange`.

#### Obsługa v-model

`v-model:value` oraz opcjonalne `v-model:open`; model częściowy musi być jawnie typowany i udokumentowany.

#### Obsługa klawiatury

Pełna siatka kalendarza: strzałki dni/tygodnie, PageUp/PageDown miesiące, Home/End tydzień, Enter/Spacja wybór, Escape zamknięcie, Tab po kontrolkach bez utraty logicznej kolejności. Presety są zwykłymi przyciskami.

#### Dostępność i ARIA

Dialog z nazwą, grid kalendarza i opisem aktualnie wybieranego końca; `aria-selected`, disabled dates i etykiety pełnych dat. Pola mają etykiety, opis formatu, błędy przez `aria-describedby`/`aria-invalid`; status zakresu ogłaszany oszczędnie.

#### Responsywność

Dwa kalendarze przechodzą w jeden lub pionowy układ na mobile; panel nie wychodzi poza viewport, pola zawijają się, presety mogą mieć scroll.

#### Wymagane Storybook stories

Pusty/ustawiony, jeden/dwa kalendarze, presety, min/max, disabled dates, partial/invalid input, locale, confirm, mobile, keyboard-only i dark mode.

#### Zakres testów

Algorytm zakresu, granice, presety, parse/format, pola-kalendarz, apply/cancel, focus, komplet klawiszy, ARIA grid/dialog, timezone-neutral date semantics i responsive layout.

#### Kryteria ukończenia

Najpierw udokumentowano decyzję „rozbudowa FormDatePicker czy nowy zakres odpowiedzialności”; nie istnieją dwa sprzeczne API zakresu; ręczne i wizualne wybory są spójne; wszystkie daty graniczne i locale mają testy.

#### Poza zakresem pierwszej wersji

Godziny, strefy czasowe, reguły cykliczne i logika dostępności rezerwacji pobierana z API.

### TimePicker

- Status: TODO
- Priorytet: P1
- Złożoność: L
- Kategoria: Form
- Zależności: `FormField`, `FormInput`, `PopoverOverlayer`
- Potencjalne komponenty pomocnicze: `TimeSegment`, `TimeOptionList`, helper parsowania czasu
- Czy wymaga zewnętrznej biblioteki: Nie
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — pole, warstwa, przyciski nawigacyjne i komunikaty błędów

#### Cel

Dostępny wybór czasu z możliwością wpisania wartości i precyzyjną kontrolą dozwolonego zakresu.

#### Główne zastosowania

Terminy, harmonogramy, godziny otwarcia, rezerwacje i filtry czasowe.

#### Oczekiwane działanie

Wartość wpisana ręcznie i wybrana z listy pozostają zsynchronizowane. Interwał ogranicza proponowane opcje, lecz polityka akceptacji wartości spoza interwału jest jawna. Format 12h pokazuje i edytuje okres AM/PM; format modelu powinien pozostać neutralnym `HH:mm[:ss]` albo jawnym typem segmentów.

#### Główne funkcjonalności

Godziny/minuty/sekundy, 12/24h, min/max, step dla segmentów, parse/format, ręczne wpisanie, controlled open/value, walidacja i listy opcji.

#### Warianty

`input | segmented`, `dropdown | spinbutton`, `12h | 24h`, z sekundami lub bez.

#### Stany komponentu

Empty, partial, valid, invalid format, out-of-range, open/closed, disabled, readonly, loading, error.

#### Proponowane API

Propsy: `value`, `open`, `format`, `showSeconds`, `hourStep`, `minuteStep`, `secondStep`, `min`, `max`, `allowOffStep`, `locale`, `parse`, `formatValue`, `label`, `description`, `error`, `required`, `disabled`, `readonly`, `loading`, `dataTestId`.

#### Proponowane sloty

`trigger`, `hour-option`, `minute-option`, `second-option`, `period-option`, `footer`, `error`.

#### Proponowane eventy

`update:value`, `update:open`, `change`, `invalid`, `open`, `close`.

#### Obsługa v-model

`v-model:value` i opcjonalne `v-model:open`; niepełny tekst edycji powinien być stanem wewnętrznym albo osobnym modelem tylko po uzasadnieniu.

#### Obsługa klawiatury

Strzałki zwiększają/zmniejszają aktywny segment lub poruszają listą; lewo/prawo zmieniają segment; Home/End granice; cyfry zastępują segment; Enter zatwierdza, Escape anuluje panel. Tab zachowuje zwykłą kolejność formularza.

#### Dostępność i ARIA

Segmenty jako spinbuttony z `aria-valuemin/max/now/text` albo zwykły input z opisem formatu. Panel ma nazwę i właściwe listboxy; błąd jest powiązany z polem, a AM/PM ma czytelną etykietę lokalizowaną.

#### Responsywność

Panel mieści się w viewport, kolumny opcji mają wewnętrzny scroll i odpowiednie cele dotykowe. Układ segmentów nie rozjeżdża się przy dużym tekście.

#### Wymagane Storybook stories

24h, 12h, sekundy, interwały, min/max, wpis ręczny, invalid, controlled, mobile, locale, disabled/readonly/loading.

#### Zakres testów

Parse/format, rollover bez niejawnej zmiany daty, granice, kroki, segmenty, AM/PM, klawiatura, focus, ARIA spinbutton/listbox i eventy.

#### Kryteria ukończenia

Format modelu jest jednoznaczny i niezależny od locale, wszystkie segmenty są dostępne bez myszy, a wartości graniczne i niepełne dane nie prowadzą do cichej korekty.

#### Poza zakresem pierwszej wersji

Data, strefa czasowa, czas trwania i pobieranie wolnych terminów.

### DateTimePicker

- Status: TODO
- Priorytet: P2
- Złożoność: L
- Kategoria: Form
- Zależności: `FormDatePicker`, `TimePicker`, `PopoverOverlayer`
- Potencjalne komponenty pomocnicze: wspólny model `LocalDateTimeValue`, panel sekcji data/czas
- Czy wymaga zewnętrznej biblioteki: Preferowane Nie; obsługa IANA wymaga osobnej analizy
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — bez kopiowania logiki kalendarza i czasu

#### Cel

Spójny wybór lokalnej daty i czasu w jednym polu lub jednym popoverze.

#### Główne zastosowania

Planowanie publikacji, spotkania, daty wykonania i harmonogramy operacji.

#### Oczekiwane działanie

Sekcje daty i czasu aktualizują jeden kontrolowany model. Ograniczenia są oceniane dla całej wartości: np. minimalny czas może zależeć od wybranego dnia. Opcjonalna strefa jest informacją/konfiguracją, a nie niejawnie konwertowaną wartością.

#### Główne funkcjonalności

Wspólny panel, ręczne wpisanie, formatowanie, min/max datetime, disabled values, locale, opcjonalna strefa, confirm/cancel, walidacja częściowa.

#### Warianty

`single-input | split-input`, sekcje `side-by-side | stacked`, `immediate | confirm`, czas 12/24h.

#### Stany komponentu

Empty, tylko data, tylko czas, complete, invalid, out-of-range, open/closed, disabled/readonly/loading/error.

#### Proponowane API

Propsy: `value`, `open`, `min`, `max`, `dateFormat`, `timeFormat`, `locale`, `timeZone`, `showTimeZone`, `isDateTimeDisabled`, `confirm`, `required`, `disabled`, `readonly`, `loading`, `label`, `description`, `error`, `dataTestId`.

#### Proponowane sloty

`date`, `time`, `time-zone`, `footer`, `trigger`, `error`.

#### Proponowane eventy

`update:value`, `update:open`, `change`, `dateChange`, `timeChange`, `invalid`, `apply`, `cancel`.

#### Obsługa v-model

`v-model:value` dla jawnego typu zawierającego lokalną datę i czas oraz opcjonalne `v-model:open`; format string musi być opisany bez dwuznaczności UTC.

#### Obsługa klawiatury

Dziedziczy komplet zachowań FormDatePicker i TimePicker; skrót przejścia między sekcjami nie może zastępować Tab. Escape zamyka panel według trybu commit.

#### Dostępność i ARIA

Dialog ma wspólną nazwę i wyraźnie nazwane regiony „Data” i „Czas”. Błąd całej wartości oraz błędy sekcji mają poprawne relacje. Informacja o strefie jest czytana razem z wartością.

#### Responsywność

Układ boczny przechodzi w pionowy; panel i stopka pozostają dostępne przy zoomie, a przewijanie nie tworzy zagnieżdżonych pułapek.

#### Wymagane Storybook stories

Pełna/pusta wartość, split/single, min/max zależne od dnia, 12/24h, strefa informacyjna, invalid/partial, confirm, mobile.

#### Zakres testów

Kompozycja modeli, ograniczenia całej wartości, synchronizacja pól/panelu, commit/cancel, locale, klawiatura, ARIA sekcji i przypadki DST bez niejawnej konwersji.

#### Kryteria ukończenia

Komponent nie duplikuje mechanizmów zależności, model jasno rozróżnia czas lokalny od instantu, a walidacja min/max działa na granicach dnia.

#### Poza zakresem pierwszej wersji

Wybór zakresu datetime, zaawansowana baza IANA, cykliczność i wyszukiwanie terminów.

### ColorPicker

- Status: TODO
- Priorytet: P2
- Złożoność: L
- Kategoria: Form / Media
- Zależności: `FormInput`, `InputSlider`, `PopoverOverlayer`, `ButtonAction`
- Potencjalne komponenty pomocnicze: `ColorSwatch`, `SaturationArea`, helper konwersji kolorów
- Czy wymaga zewnętrznej biblioteki: Nie dla v1; EyeDropper API wyłącznie jako progressive enhancement
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — pola, slidery, popover i przyciski

#### Cel

Wybór i edycja koloru w popularnych przestrzeniach z kontrolą kanału alpha.

#### Główne zastosowania

Motywy, edytory, konfiguracja wykresów, znaczniki i ustawienia marki.

#### Oczekiwane działanie

Pole tekstowe, obszar nasycenia/jasności i slidery aktualizują jeden kanoniczny model bez dryfu konwersji. Niepoprawny tekst pozostaje edytowalny do blur/commit i pokazuje błąd. EyeDropper jest ukryty lub disabled, gdy API nie istnieje albo wymaga bezpiecznego kontekstu.

#### Główne funkcjonalności

HEX/RGB/HSL, alpha, konwersja, nasycenie, hue, alpha slider, saved/recent colors, eyedropper, controlled open/value i format wyjściowy.

#### Warianty

`popover | inline`, format `hex | rgb | hsl`, alpha on/off, `compact | full`.

#### Stany komponentu

Valid, partial input, invalid, transparent, open/closed, eyedropper unavailable/active, disabled/readonly/loading.

#### Proponowane API

Propsy: `value`, `open`, `format`, `alpha`, `savedColors`, `recentColors`, `showEyedropper`, `disabled`, `readonly`, `required`, `label`, `description`, `error`, `ariaLabel`, `dataTestId`.

#### Proponowane sloty

`trigger`, `swatch`, `saved-color`, `recent-color`, `footer`.

#### Proponowane eventy

`update:value`, `update:open`, `change`, `commit`, `invalid`, `eyedropperStart`, `eyedropperError`.

#### Obsługa v-model

`v-model:value` jako udokumentowany string albo typ `ColorValue`; `v-model:open` dla popoveru. Nie należy emitować setek commit eventów podczas przeciągania — rozdzielić `change` i `commit`.

#### Obsługa klawiatury

Slidery działają strzałkami/PageUp/PageDown/Home/End; obszar 2D ma strzałki z modyfikatorami kroku; pola są edytowalne standardowo; Escape zamyka panel bez utraty ustalonej polityki commit.

#### Dostępność i ARIA

Każda oś ma nazwę i aktualną wartość tekstową. Próbki kolorów mają nazwę zawierającą wartość, nie tylko tło. Wskaźnik wyboru ma kontrast na jasnych i ciemnych kolorach. Informacje nie mogą zależeć od percepcji koloru.

#### Responsywność

Obszar 2D ma minimalny użyteczny rozmiar, ale skaluje się do kontenera; panel przewija się bez obcinania kontrolek i działa dotykiem/pointer capture.

#### Wymagane Storybook stories

HEX/RGB/HSL, alpha, inline/popover, zapisane/ostatnie, invalid input, eyedropper fallback, keyboard-only, mobile i kontrast skrajnych kolorów.

#### Zakres testów

Konwersje i round-trip, parser, alpha, przeciąganie/pointer cleanup, klawiatura 2D/slidery, próbki, API unavailable, ARIA values i event commit.

#### Kryteria ukończenia

Konwersje mają testy tabelaryczne, wartość nie dryfuje przy zmianie formatu, cały wybór jest wykonalny bez pointera, a fallback EyeDropper nie generuje błędów.

#### Poza zakresem pierwszej wersji

Gradienty, palety generowane z obrazu, przestrzenie LAB/OKLCH i zarządzanie profilami kolorów.

### PinInput

- Status: TODO
- Priorytet: P1
- Złożoność: M
- Kategoria: Form
- Zależności: `FormField` lub współdzielone wzorce inputów
- Potencjalne komponenty pomocnicze: `PinInputCell`, utility normalizacji paste
- Czy wymaga zewnętrznej biblioteki: Nie
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — etykieta, opis, błąd i tokeny FormInput

#### Cel

Szybkie i dostępne wpisywanie kodu PIN, OTP lub krótkiego kodu w grupie pól.

#### Główne zastosowania

Weryfikacja dwuskładnikowa, potwierdzenie operacji, kody zaproszeń i krótkie identyfikatory.

#### Oczekiwane działanie

Wpisanie znaku przechodzi do następnej komórki, Backspace usuwa i cofa zgodnie z pozycją, a paste rozdziela poprawne znaki bez wykraczania poza długość. `complete` jest emitowany tylko przy przejściu ze stanu niepełnego do pełnego i ponownie po realnej zmianie.

#### Główne funkcjonalności

Długość, cyfry/alphanumeric, maskowanie, paste, autofill OTP, błąd, disabled/readonly, autoFocus, transform znaków i complete event.

#### Warianty

`numeric | alphanumeric`, `text | masked`, rozmiary `s | m | l`, grupowanie separatorami wizualnymi.

#### Stany komponentu

Empty, partial, complete, invalid character, error, disabled, readonly, focus w komórce.

#### Proponowane API

Propsy: `value`, `length`, `type`, `mask`, `pattern`, `transform`, `autocomplete`, `inputmode`, `autoFocus`, `disabled`, `readonly`, `required`, `label`, `description`, `error`, `dataTestId`.

#### Proponowane sloty

`separator`, `label`, `description`, `error`.

#### Proponowane eventy

`update:value`, `change`, `complete`, `invalidInput`, `focus`, `blur`.

#### Obsługa v-model

`v-model:value` jako string zachowujący ewentualne zera początkowe.

#### Obsługa klawiatury

Znaki wypełniają komórkę; Backspace/Delete, lewo/prawo, Home/End są obsługiwane przewidywalnie; Tab opuszcza grupę lub przechodzi natywnie według wybranego modelu DOM. Paste działa z klawiatury.

#### Dostępność i ARIA

Grupa ma jedną etykietę i instrukcję; komórki mają etykiety „Cyfra 1 z 6” albo stosowany jest jeden wizualnie segmentowany input. Błąd powiązany przez `aria-describedby`; maskowanie nie może sugerować bezpiecznego przechowywania kodu.

#### Responsywność

Komórki mieszczą się na 320 px przez skalowanie/gap lub kontrolowany scroll; cele dotykowe i systemowy zoom nie są blokowane.

#### Wymagane Storybook stories

Numeric, alphanumeric, masked, paste, OTP autocomplete, error, disabled/readonly, różne długości, mobile.

#### Zakres testów

Wpisywanie, paste z nadmiarem/niedozwolonymi znakami, delete/backspace, focus, complete deduplication, zera, ARIA, autofill-style change i model.

#### Kryteria ukończenia

Paste i edycja środka nie gubią znaków, complete nie jest emitowany wielokrotnie bez zmiany, kod jest czytelny dla AT, a wartość zawsze pozostaje stringiem.

#### Poza zakresem pierwszej wersji

Generowanie/wysyłanie OTP, timer ponownej wysyłki i automatyczne wywołanie backendu.

### TagsInput

- Status: TODO
- Priorytet: P1
- Złożoność: L
- Kategoria: Form / Data entry
- Zależności: `TagChip`, `FormInput`, `PopoverOverlayer`
- Potencjalne komponenty pomocnicze: `TagEditor`, `TagSuggestionList`, parser separatorów
- Czy wymaga zewnętrznej biblioteki: Nie
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — tagi, pole, popover i komunikaty

#### Cel

Wprowadzanie, edytowanie i usuwanie wielu krótkich wartości reprezentowanych jako tagi.

#### Główne zastosowania

Słowa kluczowe, adresaci, kategorie, filtry i metadane.

#### Oczekiwane działanie

Enter lub separator zatwierdza poprawny tekst. Paste może utworzyć wiele tagów. Backspace przy pustym polu najpierw zaznacza ostatni tag, a kolejny usuwa; edycja ma jawny tryb i możliwość anulowania. Duplikaty, limit i walidacja są egzekwowane przed emisją modelu.

#### Główne funkcjonalności

Add/remove/edit, separatory, paste, sugestie sync/async, duplicates policy, max, walidacja per tag, transform/serialize i disabled items.

#### Warianty

`freeform | suggestions-only`, `inline | stacked`, tagi removable/readonly, sugestie single/multi provider.

#### Stany komponentu

Empty, typing, suggestion loading/empty/open, tag selected/editing/invalid, max reached, component disabled/readonly/error.

#### Proponowane API

Propsy: `value`, `inputValue`, `suggestions`, `loading`, `allowCreate`, `allowDuplicates`, `max`, `separators`, `validateTag`, `normalizeTag`, `getTagKey`, `disabledTags`, `label`, `description`, `error`, `placeholder`, `disabled`, `readonly`, `dataTestId`.

#### Proponowane sloty

`tag`, `tag-content`, `suggestion`, `empty-suggestions`, `loading`, `prefix`, `suffix`, `error`.

#### Proponowane eventy

`update:value`, `update:inputValue`, `add`, `remove`, `edit`, `invalidTag`, `search`, `maxReached`.

#### Obsługa v-model

`v-model:value` jako typowana tablica tagów; opcjonalne `v-model:inputValue` dla kontrolowanego tekstu wyszukiwania.

#### Obsługa klawiatury

Enter/separatory dodają, Backspace/Delete wybierają/usuwają, lewo/prawo przechodzą między tagami i inputem, F2/Enter edytują zaznaczony, Escape anuluje, strzałki sterują sugestiami. Tab nie powinien niejawnie dodawać tagu bez opcji.

#### Dostępność i ARIA

Pole combobox z listboxem sugestii; tagi jako lista z dostępnymi przyciskami usuwania. Zaznaczenie/edycja i błędy są ogłaszane przez jeden kontrolowany live region. Nazwa przycisku usuwania zawiera wartość tagu.

#### Responsywność

Tagi zawijają się, długie wartości mają kontrolę overflow i pełną nazwę; popover dopasowuje szerokość i viewport; input zachowuje minimalną szerokość.

#### Wymagane Storybook stories

Freeform, suggestions-only, async, paste, edit, duplicate, max, invalid tag, obiekty jako wartości, disabled tag/component, mobile i keyboard-only.

#### Zakres testów

Parser separatorów/paste, duplikaty po normalizacji, max, CRUD, focus między tagami, combobox/listbox ARIA, async race, eventy i serializacja.

#### Kryteria ukończenia

Nie da się obejść walidacji przez paste/edycję, focus jest stabilny po usunięciu, async wyniki nie nadpisują nowszego zapytania, a model obsługuje stringi i jawnie typowane obiekty.

#### Poza zakresem pierwszej wersji

Rich text mentions, drag-and-drop kolejności i pobieranie sugestii bezpośrednio przez komponent.

### RatingInput

- Status: TODO
- Priorytet: P2
- Złożoność: M
- Kategoria: Form / Data entry
- Zależności: `SvgIcon`, `FieldLabel`, `MessageText`
- Potencjalne komponenty pomocnicze: `RatingItem`, formatter dostępnej wartości
- Czy wymaga zewnętrznej biblioteki: Nie
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — ikony i opisy pola

#### Cel

Wybór lub prezentacja oceny na dyskretnej skali z opcjonalnymi połowami.

#### Główne zastosowania

Oceny produktów, satysfakcji, jakości i priorytetu wizualnego.

#### Oczekiwane działanie

Hover pokazuje podgląd bez zmiany modelu; klik/klawiatura zatwierdzają wartość. Opuszczenie kontrolki przywraca zatwierdzony wygląd. Reset jest możliwy tylko, gdy `allowClear`; readonly nie jest interaktywne.

#### Główne funkcjonalności

Dowolne max, pełne/połówkowe kroki, własna ikona, hover preview, readonly, allowClear, tekstowe opisy wartości.

#### Warianty

Rozmiary `s | m | l`, `interactive | readonly`, krok `1 | 0.5`, ikona domyślna/własna.

#### Stany komponentu

Empty, rated, preview, focus, disabled, readonly, error.

#### Proponowane API

Propsy: `value`, `max`, `step`, `allowClear`, `readonly`, `disabled`, `required`, `labels`, `getLabel`, `icon`, `size`, `label`, `description`, `error`, `dataTestId`.

#### Proponowane sloty

`icon`, `label`, `value-label`, `error`.

#### Proponowane eventy

`update:value`, `change`, `previewChange`, `clear`.

#### Obsługa v-model

`v-model:value` typu `number | null`; wartość jest clampowana tylko przy inicjalizacji według jawnej polityki, a nie cicho podczas każdej emisji.

#### Obsługa klawiatury

Jedna tabowalna kontrolka: strzałki zwiększają/zmniejszają o krok, Home ustawia minimum, End maksimum, Delete/Backspace czyści jeśli dozwolone.

#### Dostępność i ARIA

Preferowany pojedynczy slider/radiogroup z nazwą i `aria-valuetext` opisującym np. „3,5 z 5 — Dobra”. Nie tworzyć pięciu nieopisanych przycisków. Readonly może być tekstem/meterem bez tab stopu.

#### Responsywność

Ikony zachowują cele dotykowe w trybie interaktywnym, ale nie wywołują poziomego overflow; długie opisy wartości zawijają się.

#### Wymagane Storybook stories

Pełne/połówki, pusta, custom icon, labels, readonly, disabled, clear, keyboard i mobile.

#### Zakres testów

Kroki, preview vs commit, clear, granice, klawiatura, accessible value text, readonly tab order i eventy.

#### Kryteria ukończenia

Ocena jest jednoznacznie komunikowana bez koloru i kształtu, krok działa precyzyjnie bez błędów float, a readonly nie udaje kontrolki formularza.

#### Poza zakresem pierwszej wersji

Komentarz tekstowy, rozkład ocen i wysyłanie oceny do API.

### TransferList

- Status: TODO
- Priorytet: P2
- Złożoność: L
- Kategoria: Data entry
- Zależności: `SearchInput`, `FormCheckbox`, `ButtonAction`, `EmptyState`
- Potencjalne komponenty pomocnicze: `TransferPanel`, `TransferItem`, `TransferControls`
- Czy wymaga zewnętrznej biblioteki: Nie; drag-and-drop jest rozszerzeniem
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — wyszukiwanie, wybór, przyciski i puste stany

#### Cel

Przenoszenie wybranych elementów między listą dostępnych i przypisanych z pełną obsługą bez drag-and-drop.

#### Główne zastosowania

Przypisywanie uprawnień, członków, pól, kolumn i zasobów.

#### Oczekiwane działanie

Każdy panel ma niezależne zaznaczenie i filtr. Przyciski przenoszą zaznaczone albo wszystkie dozwolone pozycje, zachowując stabilne identyfikatory i ustaloną politykę kolejności. Element disabled nie może być zaznaczony ani przeniesiony.

#### Główne funkcjonalności

Multi-select, move one/all, search, sort, counts, disabled, controlled value, custom item, opcjonalne reorder i async loading.

#### Warianty

`horizontal | vertical`, kompaktowy/standardowy, z wyszukiwaniem lub bez, kolejność `source | target | sorted`.

#### Stany komponentu

Empty source/target, selection per panel, filtered no results, loading per panel, disabled item/component, error.

#### Proponowane API

Propsy: `items`, `value`, `sourceSelected`, `targetSelected`, `itemKey`, `searchable`, `sort`, `preserveOrder`, `disabledKeys`, `loading`, `labels`, `disabled`, `dataTestId`.

#### Proponowane sloty

`source-header`, `target-header`, `item`, `source-empty`, `target-empty`, `controls`, `loading`.

#### Proponowane eventy

`update:value`, `update:sourceSelected`, `update:targetSelected`, `move`, `search`, `selectionChange`, `reorder` (dopiero rozszerzenie).

#### Obsługa v-model

`v-model:value` jako tablica kluczy przypisanych; opcjonalne modele zaznaczeń, jeśli konsument musi je kontrolować.

#### Obsługa klawiatury

Listboxy obsługują strzałki, Home/End, Shift/Ctrl zgodnie z wielokrotnym wyborem; przyciski transferu są dostępne Tab/Enter/Spacja. Opcjonalne udokumentowane skróty nie zastępują przycisków.

#### Dostępność i ARIA

Dwa nazwane listboxy `aria-multiselectable`, status liczby zaznaczonych i wyniku przeniesienia. Przyciski mają kierunkowe nazwy, elementy disabled stan ARIA. Drag-and-drop zawsze ma równoważne kontrolki.

#### Responsywność

Układ poziomy przechodzi w pionowy, a przyciski zmieniają ikonę/kierunek z zachowaniem nazw. Listy mają kontrolowaną wysokość i wewnętrzny scroll.

#### Wymagane Storybook stories

Podstawowy, search/sort, disabled, empty, loading, obiekty, długie label, vertical mobile, controlled selection i keyboard-only.

#### Zakres testów

Transfer one/all, filtry, sort/kolejność, disabled, model, zaznaczenia, klawiatura listbox, live status, responsywny kierunek i duplikaty kluczy.

#### Kryteria ukończenia

Żadna operacja nie gubi elementu ani kolejności, disabled jest egzekwowane w UI i logice, cały przepływ działa bez drag-and-drop, a aktualizacje są atomowe.

#### Poza zakresem pierwszej wersji

Drag-and-drop, wirtualizacja, hierarchiczne elementy i pobieranie stron z API.

### ScrollArea

- Status: TODO
- Priorytet: P0
- Złożoność: M
- Kategoria: Layout
- Zależności: Brak
- Potencjalne komponenty pomocnicze: `ScrollViewport`, `ScrollBar`, `ScrollThumb`, observer utility
- Czy wymaga zewnętrznej biblioteki: Nie
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — tokeny i mixiny; zachowanie ma pozostać możliwie natywne

#### Cel

Kontrolowany obszar przewijania z dostosowanym wyglądem pasków bez utraty natywnej dostępności.

#### Główne zastosowania

Panele, listy, menu, podglądy kodu i duże fragmenty danych.

#### Oczekiwane działanie

Viewport wykorzystuje natywny scroll. Paski odzwierciedlają rozmiar i pozycję, reagują na wheel, touch, keyboard i programowe przewijanie. Auto-hide nie usuwa możliwości odkrycia przewijalności, a w systemach overlay scrollbar komponent nie rezerwuje błędnej przestrzeni.

#### Główne funkcjonalności

Oś pionowa/pozioma/obie, auto/always/hover scrollbar, programowe scrollTo/scrollBy/scrollIntoView, event pozycji, wskaźniki początku/końca i RTL.

#### Warianty

`native | styled`, widoczność `auto | always | hover`, osie `vertical | horizontal | both`.

#### Stany komponentu

Brak overflow, overflow jednej/obu osi, scrolling, start/end, dragging thumb, disabled program controls.

#### Proponowane API

Propsy: `type`, `orientation`, `scrollbarSize`, `autoHideDelay`, `tabindex`, `ariaLabel`, `restorePosition`, `dataTestId`. Ref API: `viewport`, `scrollTo`, `scrollBy`, `scrollIntoView`, `getPosition`.

#### Proponowane sloty

`default`, opcjonalnie `scrollbar`, `start-indicator`, `end-indicator`.

#### Proponowane eventy

`scroll`, `scrollStart`, `scrollEnd`, `reachStart`, `reachEnd`, `resize` z ograniczeniem częstotliwości.

#### Obsługa v-model

Brak domyślnego v-model; dwukierunkowy model pozycji powodowałby pętle. Pozycję kontroluje ref API i eventy.

#### Obsługa klawiatury

Jeśli viewport jest fokusowalny i nazwany: strzałki, PageUp/PageDown, Home/End działają natywnie. Nie dodawać tab stopu, gdy zawartość ma własne fokusowalne elementy i region nie wymaga osobnej nawigacji.

#### Dostępność i ARIA

Preferowany natywny overflow; region tylko z dostępną nazwą i uzasadnionym `tabindex`. Własny scrollbar, jeśli powstanie, wymaga roli scrollbar, wartości i pełnej alternatywy klawiaturowej. W trybie high contrast przewijalność musi pozostać widoczna.

#### Responsywność

ResizeObserver aktualizuje paski bez pętli layoutu; touch scrolling i momentum pozostają natywne; szerokość paska nie zabiera krytycznej treści.

#### Wymagane Storybook stories

Brak overflow, pionowy, poziomy, oba, auto/always, RTL, dynamic content, programmatic scroll, touch-size viewport i zagnieżdżenie.

#### Zakres testów

Obliczenia thumb, resize/content mutation, scroll events, reach deduplication, ref API, RTL, keyboard, reduced motion i cleanup observerów.

#### Kryteria ukończenia

Natywne scrollowanie nie jest blokowane, komponent nie tworzy zbędnych tab stopów, obserwery/timery są sprzątane, a API działa identycznie w trzech targetach.

#### Poza zakresem pierwszej wersji

Scroll snapping layout engine, synchronizacja wielu viewportów i wirtualizacja danych.

### VirtualList

- Status: TODO
- Priorytet: P1
- Złożoność: L
- Kategoria: Data display / Layout
- Zależności: `ScrollArea`, `EmptyState`, `SpinnerLoader`
- Potencjalne komponenty pomocnicze: `VirtualListItem`, measurement cache, range calculator
- Czy wymaga zewnętrznej biblioteki: Preferowane Nie dla stałej wysokości; zmienna wysokość wymaga benchmarku rozwiązania własnego i bibliotek
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — scroll, puste i loading stany

#### Cel

Wydajne renderowanie bardzo długich list przy zachowaniu logicznej nawigacji, focusu i przewidywalnego API.

#### Główne zastosowania

Wyniki wyszukiwania, logi, katalogi, menu komend i duże listy wyboru.

#### Oczekiwane działanie

Komponent oblicza widoczny zakres plus overscan, zachowuje całkowity rozmiar scrollu i stabilne klucze. Programowe przewinięcie do indeksu działa dla początku/środka/końca. Fokusowany element nie może zniknąć z DOM bez świadomego przeniesienia focusu.

#### Główne funkcjonalności

Stała wysokość v1, overscan, scrollToIndex z align, itemKey, loading next, empty, dynamic count, focus retention i opcjonalna zmienna wysokość jako późniejszy milestone.

#### Warianty

Orientacja pionowa w v1, item fixed; później `variable`, układ list/listbox zależnie od semantyki konsumenta.

#### Stany komponentu

Empty, initial loading, populated, loading more, end reached, programmatic scrolling, focused off-range recovery, error.

#### Proponowane API

Propsy: `items`, `itemSize`, `overscan`, `itemKey`, `height`, `estimatedItemSize`, `loading`, `hasMore`, `ariaLabel`, `role`, `dataTestId`. Ref: `scrollToIndex`, `scrollToOffset`, `getVisibleRange`, `viewport`.

#### Proponowane sloty

`item` scoped z `item/index/style`, `empty`, `loading`, `footer`, `before`, `after`.

#### Proponowane eventy

`visibleRangeChange`, `reachEnd`, `scroll`, `itemFocus`, `measureError`.

#### Obsługa v-model

Nie dotyczy pozycji scrollu; wybór należy do komponentu konsumenta. Ewentualny aktywny indeks jest kontrolowany osobnym propem/eventem, nie stanem ukrytym.

#### Obsługa klawiatury

Semantyka listy nie narzuca wyboru. Dla listboxa strzałki mogą przewijać/aktywować element przez jawny tryb. PageUp/PageDown/Home/End muszą renderować cel przed przeniesieniem focusu.

#### Dostępność i ARIA

Wirtualizacja nie może fałszować kolejności; dla listbox/table stosować `aria-setsize`, `aria-posinset` lub indeksy zgodne z wzorcem. Czytnik musi otrzymać informację o pełnym rozmiarze i loading. Zwykła lista może oferować niewirtualizowany fallback do druku/AT, jeśli testy wykażą potrzebę.

#### Responsywność

Viewport przyjmuje szerokość kontenera; wysokość może być liczbą lub CSS size. Resize nie resetuje pozycji bez powodu; elementy nie powodują poziomego overflow.

#### Wymagane Storybook stories

10k items, empty, loading more, dynamic append/remove, scrollToIndex, focus/keyboard, resize, długie treści i mobile.

#### Zakres testów

Range math, overscan i granice, stabilne klucze, scroll API, append/prepend, reachEnd deduplication, focus retention, ARIA set metadata, performance benchmark i cleanup.

#### Kryteria ukończenia

10 000 stałych elementów przewija się płynnie w ustalonym budżecie, liczba DOM pozostaje ograniczona, focus nie trafia do usuniętego węzła, a reachEnd nie tworzy pętli żądań.

#### Poza zakresem pierwszej wersji

Zmienna wysokość, wielokolumnowa siatka, sticky groups i wirtualizacja dwuwymiarowa.

### InlineEdit

- Status: TODO
- Priorytet: P1
- Złożoność: M
- Kategoria: Data entry
- Zależności: `FormInput`, `FormNumber`, `FormSelect`, `FormTextarea`, `ButtonAction`
- Potencjalne komponenty pomocnicze: adapter edytora, `InlineEditActions`
- Czy wymaga zewnętrznej biblioteki: Nie
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — właściwy edytor wybierany bez duplikacji jego walidacji

#### Cel

Edycja wartości bez opuszczania miejsca prezentacji, z jawnym zatwierdzeniem, anulowaniem i obsługą zapisu async.

#### Główne zastosowania

Nazwy rekordów, wartości tabel, opisy, liczby i szybkie ustawienia.

#### Oczekiwane działanie

Akcja edit przełącza prezentację na edytor i ustawia focus. Save emituje proponowaną wartość; w trybie async konsument kontroluje loading i finalną wartość. Escape anuluje draft, a Enter zapisuje tylko dla edytorów, gdzie nie oznacza nowej linii. Po zapisie/anulowaniu focus wraca do triggera.

#### Główne funkcjonalności

Typ text/number/select/textarea/custom, draft, save/cancel, walidacja, async loading/error, controlled editing, readonly/disabled i strategie aktywacji.

#### Warianty

Aktywacja `button | click | dblclick`, akcje `buttons | keyboard | both`, display `inline | block`.

#### Stany komponentu

Display, editing clean/dirty, invalid, saving, save error, disabled, readonly.

#### Proponowane API

Propsy: `value`, `editing`, `editor`, `editorProps`, `validate`, `saveMode`, `loading`, `error`, `disabled`, `readonly`, `emptyText`, `editAriaLabel`, `dataTestId`.

#### Proponowane sloty

`display`, `editor`, `actions`, `error`, `empty`.

#### Proponowane eventy

`update:value`, `update:editing`, `edit`, `save`, `cancel`, `invalid`, `draftChange`.

#### Obsługa v-model

`v-model:value` dla zatwierdzonej wartości i opcjonalne `v-model:editing`; draft pozostaje lokalny, chyba że scoped slot kontroluje edytor.

#### Obsługa klawiatury

Enter/F2 rozpoczyna edycję, Escape anuluje, Enter zapisuje single-line, Ctrl/Cmd+Enter może zapisać textarea. Tab zachowanie (`commit | cancel | stay`) musi być propem z bezpiecznym domyślnym `commit` lub naturalnym opuszczeniem po walidacji.

#### Dostępność i ARIA

Widoczny przycisk edycji z nazwą zawierającą pole; instrukcja skrótów jest powiązana z edytorem. Błąd przez `aria-invalid/describedby`; saving przez `aria-busy` i status. Nie opierać aktywacji wyłącznie na dblclick.

#### Responsywność

Edytor przejmuje dostępną szerokość, akcje zawijają się lub przechodzą pod pole, a komunikat błędu nie przesuwa niekontrolowanie tabeli.

#### Wymagane Storybook stories

Wszystkie typy, custom editor, save/cancel, async success/error, validation, empty, readonly/disabled, click/dblclick plus widoczny button, mobile.

#### Zakres testów

Draft izolacja, save/cancel, brak mutacji przy error, focus return, klawiatura per editor, validation, controlled editing, ARIA status i event order.

#### Kryteria ukończenia

Nie można stracić draftu bez udokumentowanej akcji, async nie aktualizuje wartości samodzielnie, każdy tryb ma widoczną alternatywę aktywacji i focus wraca deterministycznie.

#### Poza zakresem pierwszej wersji

Historia zmian, autosave, konflikty współbieżnej edycji i rich text.

### CopyButton

- Status: TODO
- Priorytet: P1
- Złożoność: S
- Kategoria: Data entry / Feedback
- Zależności: `ButtonAction`, `SvgIcon`, opcjonalnie `MessageText`/`ToastAlert`
- Potencjalne komponenty pomocnicze: clipboard utility z fallbackiem
- Czy wymaga zewnętrznej biblioteki: Nie
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — przycisk, ikony i komunikat

#### Cel

Skopiowanie dostarczonego tekstu do schowka z dostępnym potwierdzeniem i bezpiecznym fallbackiem.

#### Główne zastosowania

Kody, identyfikatory, adresy, wartości tabel i fragmenty konfiguracji.

#### Oczekiwane działanie

Aktywacja pobiera tekst z propa albo funkcji/slotu, próbuje Clipboard API, a przy braku wsparcia używa udokumentowanego fallbacku. Sukces zmienia status na określony czas; kolejne kliknięcie resetuje timer. Błąd nie udaje sukcesu.

#### Główne funkcjonalności

Tekst prop/resolve, success/error, reset delay, icon/label, fallback, disabled/loading i callback.

#### Warianty

`icon | text | icon-text`, warianty ButtonAction, status inline lub tylko dla screen readera.

#### Stany komponentu

Idle, copying, copied, error, unsupported, disabled.

#### Proponowane API

Propsy: `text`, `getText`, `resetDelay`, `label`, `copiedLabel`, `errorLabel`, `variant`, `size`, `disabled`, `showStatus`, `dataTestId`.

#### Proponowane sloty

`default`, `icon`, `copied-icon`, `status`; tekst ze slotu może być źródłem tylko przez jawne API, nie niepewne odczytywanie całego DOM.

#### Proponowane eventy

`copy`, `success`, `error`, `statusChange`.

#### Obsługa v-model

Nie dotyczy; status jest wewnętrzny i obserwowalny eventem.

#### Obsługa klawiatury

Natywny button reaguje na Enter/Spację; focus pozostaje na przycisku po zmianie etykiety.

#### Dostępność i ARIA

Stała nazwa akcji albo kontrolowana zmiana „Skopiuj”→„Skopiowano”; sukces/błąd w `role=status`/odpowiednim live regionie bez duplikowania toasta. Ikony ukryte przed AT.

#### Responsywność

Ikonowy wariant ma odpowiedni hit area, tekst statusu nie rozszerza gwałtownie kontenera, długi tekst źródłowy nie jest renderowany automatycznie.

#### Wymagane Storybook stories

Tekst, icon-only, sukces, error mocked, brak Clipboard API, reset timer, async getText, disabled i mobile.

#### Zakres testów

Clipboard success/reject/unavailable, fallback cleanup, timer reset/unmount, async race, dostępna nazwa/live status i eventy.

#### Kryteria ukończenia

Brak Clipboard API nie rzuca wyjątku, timer nie wycieka, sukces jest ogłoszony raz, a komponent kopiuje dokładnie wartość zwróconą w momencie aktywacji.

#### Poza zakresem pierwszej wersji

Kopiowanie obrazów/HTML, historia schowka i toast globalny tworzony automatycznie.

### KeyboardKey

- Status: TODO
- Priorytet: P1
- Złożoność: S
- Kategoria: Data display
- Zależności: Brak
- Potencjalne komponenty pomocnicze: mapper nazw klawiszy i platform
- Czy wymaga zewnętrznej biblioteki: Nie
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — tokeny typografii i kolorów

#### Cel

Semantyczna, wizualna reprezentacja pojedynczego klawisza lub kombinacji skrótu.

#### Główne zastosowania

Menu, dokumentacja, tooltipy, CommandPalette i KeyboardShortcutMap.

#### Oczekiwane działanie

Komponent normalizuje przenośne tokeny (`Mod`, `Alt`, `Shift`, `Enter`) do wybranej/wykrytej platformy, zachowując pełny tekst dostępny. Kombinacje mają czytelną kolejność i separatory ukryte lub opisane właściwie dla AT.

#### Główne funkcjonalności

Pojedynczy klawisz, kombinacje, mapowanie Ctrl/Command, jawna platforma, symbole/tekst, wariant inline i dostępna etykieta.

#### Warianty

`inline | block`, rozmiary `xs | s | m`, platforma `auto | windows | mac | linux | generic`, format `symbol | text`.

#### Stany komponentu

Statyczny; opcjonalnie muted dla niedostępnego skrótu. Nie ma stanu aktywnego.

#### Proponowane API

Propsy: `keys`, `platform`, `format`, `size`, `inline`, `separator`, `ariaLabel`, `dataTestId`; `keys` jako string tokenów albo tablica.

#### Proponowane sloty

`key` dla renderowania tokenu i `separator`; slot nie może usuwać dostępnej pełnej nazwy.

#### Proponowane eventy

Brak — komponent prezentacyjny.

#### Obsługa v-model

Nie dotyczy.

#### Obsługa klawiatury

Brak interakcji i brak tab stopu. KeyboardKey nie rejestruje ani nie wykonuje skrótu.

#### Dostępność i ARIA

Używa semantycznego `<kbd>`. Czytnik otrzymuje pełną frazę np. „Control plus K”, nawet gdy wizualnie pokazano symbole. Nie używać `aria-keyshortcuts` na samym elemencie prezentacyjnym.

#### Responsywność

Kombinacja może zawijać się tylko między klawiszami; pojedynczy klawisz nie pęka, a wariant inline dopasowuje się do line-height tekstu.

#### Wymagane Storybook stories

Pojedyncze, kombinacje, Mod na platformach, symbole/tekst, inline, długie nazwy i niestandardowa dostępna etykieta.

#### Zakres testów

Mapowanie platform, kolejność, unknown key fallback, semantyka kbd, accessible text, brak tab stopu i SSR-safe wykrywanie platformy.

#### Kryteria ukończenia

Render SSR nie różni się niekontrolowanie od hydration, wszystkie wspierane tokeny mają nazwy, a symbol zawsze posiada pełny odpowiednik dla AT.

#### Poza zakresem pierwszej wersji

Rejestrowanie skrótów, nasłuchiwanie klawiatury i edytor własnych bindingów.

## 11. Etap 2 — komponenty produktywności i doświadczenia użytkownika

Etap łączy fundamenty w większe wzorce aplikacyjne. Komponenty nadal pozostają neutralne wobec routera, backendu i magazynu stanu.

### CommandPalette

- Status: TODO
- Priorytet: P1
- Złożoność: XL
- Kategoria: Productivity / Navigation
- Zależności: `ModalDialog`, `SearchInput`, `KeyboardKey`, `VirtualList`, `EmptyState`, `SpinnerLoader`
- Potencjalne komponenty pomocnicze: `CommandRegistry`, `CommandList`, `CommandGroup`, `CommandItem`, scorer wyszukiwania
- Czy wymaga zewnętrznej biblioteki: Preferowane Nie; fuzzy search wymaga benchmarku jakości i rozmiaru przed wyborem biblioteki
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — dialog, wyszukiwanie, listę, stany i prezentację skrótów

#### Cel

Globalne, szybkie wyszukiwanie i wykonywanie poleceń aplikacji z klawiatury.

#### Główne zastosowania

Nawigacja, tworzenie zasobów, uruchamianie akcji, przełączanie ustawień i odkrywanie funkcji.

#### Oczekiwane działanie

Kontrolowany skrót otwiera paletę, ale rejestrację globalnego skrótu można wyłączyć. Wpis filtruje i grupuje komendy; wybór może wykonać sync/async akcję lub wejść w zagnieżdżony poziom. Async wynik chroni przed podwójnym uruchomieniem i pokazuje status. Zamknięcie przywraca focus do elementu sprzed otwarcia.

#### Główne funkcjonalności

Fuzzy search, grupy, recent, skróty, sync/async, loading/empty/error, hierarchia, rejestr dynamiczny, controlled open/query/active i adapter nawigacji przez callback.

#### Warianty

Modal/embedded, z historią lub bez, pojedynczy/wielopoziomowy, lista zwykła/wirtualna.

#### Stany komponentu

Closed, open idle/searching, results, no results, nested level, executing, execution error, disabled command.

#### Proponowane API

Propsy: `commands`, `open`, `query`, `activeId`, `recentIds`, `shortcut`, `registerShortcut`, `filter`, `groups`, `loading`, `placeholder`, `ariaLabel`, `closeOnExecute`, `dataTestId`. Komenda: `id`, `label`, `keywords`, `group`, `icon`, `shortcut`, `disabled`, `children`, `execute`, `metadata`.

#### Proponowane sloty

`trigger`, `header`, `command`, `group`, `empty`, `loading`, `error`, `footer`, `breadcrumb`.

#### Proponowane eventy

`update:open`, `update:query`, `update:activeId`, `select`, `execute`, `executionSuccess`, `executionError`, `levelChange`.

#### Obsługa v-model

`v-model:open`; opcjonalnie `v-model:query` i `v-model:activeId` dla pełnej kontroli. Historia/recent jest dostarczana z zewnątrz.

#### Obsługa klawiatury

Konfigurowalny Mod+K otwiera; strzałki poruszają aktywną komendą, Home/End, Enter wykonuje/otwiera poziom, Escape cofa poziom lub zamyka, Backspace na pustym query może cofać. Tab pozostaje w focus trap dialogu, ale nie służy do wyboru wyniku.

#### Dostępność i ARIA

Dialog z comboboxem i listboxem albo sprawdzonym wzorcem composite; `aria-activedescendant`, grupy i stan disabled. Liczba wyników/loading/error są ogłaszane z debounce. Skróty są opisem, nie jedynym sposobem uruchomienia.

#### Responsywność

Na mobile panel może być pełnoekranowy, z bezpieczną wysokością dynamic viewport i widocznym inputem przy klawiaturze ekranowej. Lista nie wychodzi poza panel.

#### Wymagane Storybook stories

Podstawowe wyszukiwanie, fuzzy, grupy/recent, async success/error, nested, disabled, virtual 10k, controlled, mobile i keyboard-only.

#### Zakres testów

Scoring/stabilny ranking, debounce i async race, registry update, poziomy, shortcut cleanup, focus restore/trap, combobox/listbox ARIA, wirtualizacja i event order.

#### Kryteria ukończenia

Globalny listener nie przechwytuje pól edycyjnych w niewłaściwych sytuacjach, wyniki są deterministyczne, async nie uruchamia się podwójnie, a pełny przepływ działa bez myszy.

#### Poza zakresem pierwszej wersji

Rozpoznawanie języka naturalnego, makra, synchronizacja recent między urządzeniami i bezpośrednia zależność od konkretnego routera.

### GuidedTour

- Status: TODO
- Priorytet: P2
- Złożoność: XL
- Kategoria: Productivity / Overlays
- Zależności: `PopoverOverlayer`, `ButtonAction`, `ProgressIndicator`, `ModalDialog`
- Potencjalne komponenty pomocnicze: `TourOverlay`, `TourStep`, target resolver, scroll utility
- Czy wymaga zewnętrznej biblioteki: Nie na starcie; pozycjonowanie powinno współdzielić mechanizm warstw PeaUI
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — popover, modal, przyciski i postęp

#### Cel

Kontrolowane oprowadzanie użytkownika po istniejącym interfejsie bez przejmowania logiki produktu.

#### Główne zastosowania

Onboarding, prezentacja nowych funkcji, szkolenia kontekstowe i procesy aktywacyjne.

#### Oczekiwane działanie

Tour rozwiązuje cel bieżącego kroku, czeka na niego do limitu, przewija go w widok, podświetla i pozycjonuje opis. Next/back/skip emitują zmianę, a wymagane interakcje mogą warunkować przejście. Kroki w modalach/drawerach są wspierane bez naruszania ich focus trapów.

#### Główne funkcjonalności

Target element/ref/resolver, spotlight, placement, optional steps, skip/back, auto-scroll, async target, persistence przez callback, lifecycle events i controlled step/open.

#### Warianty

Spotlight/modal, tooltip/card, linear/non-linear, z maską lub bez.

#### Stany komponentu

Idle, resolving target, active, target missing, scrolling, paused, skipped, completed, blocked step.

#### Proponowane API

Propsy: `steps`, `open`, `step`, `allowSkip`, `closeOnEscape`, `scrollBehavior`, `targetTimeout`, `missingTargetStrategy`, `spotlightPadding`, `persist`, `ariaLabel`, `dataTestId`. Krok: `id`, `target`, `title`, `description`, `placement`, `optional`, `canAdvance`, `beforeEnter`, `afterLeave`.

#### Proponowane sloty

`content`, `title`, `description`, `actions`, `progress`, `missing-target`.

#### Proponowane eventy

`update:open`, `update:step`, `start`, `stepEnter`, `stepLeave`, `next`, `back`, `skip`, `complete`, `targetMissing`, `error`.

#### Obsługa v-model

`v-model:open` i `v-model:step`; zapis postępu odbywa się w aplikacji na podstawie eventów.

#### Obsługa klawiatury

Tab porusza się po akcjach opisu i ewentualnie dozwolonym celu według trybu; Escape zamyka, lewo/prawo mogą nawigować tylko gdy nie kolidują z celem. Focus przed tour jest zapamiętywany i przywracany.

#### Dostępność i ARIA

Opis kroku jako dialog lub non-modal dialog z nazwą/opisem; numer kroku dostępny tekstowo. Spotlight nie ukrywa treści przed AT w sposób sprzeczny z widokiem. Nie wolno wymagać interakcji pointerem; cel musi mieć dostępny odpowiednik.

#### Responsywność

Na małych ekranach karta może przechodzić do docku dolnego, a maska i cel są przeliczane po resize/scroll/zoom. Auto-scroll respektuje reduced motion.

#### Wymagane Storybook stories

Podstawowy tour, targety na krawędziach, async target, missing skip/block, modal/drawer target, required interaction, controlled progress, mobile, reduced motion.

#### Zakres testów

Resolver/timeout cleanup, kolejność lifecycle, scroll/resize positioning, focus między krokami i po końcu, skip/back, nested overlays, ARIA dialog i reduced motion.

#### Kryteria ukończenia

Brak celu nie blokuje aplikacji bez wyjścia, wszystkie listenery i obserwery są czyszczone, focus nie ucieka pod maskę, a postęp jest całkowicie kontrolowalny z zewnątrz.

#### Poza zakresem pierwszej wersji

Edytor wizualny tourów, analityka, zdalna konfiguracja i automatyczne podejmowanie decyzji produktowych.

### NotificationCenter

- Status: TODO
- Priorytet: P2
- Złożoność: L
- Kategoria: Feedback / Productivity
- Zależności: `ScrollArea`, `CounterBadge`, `EmptyState`, `SkeletonLoading`, `ButtonAction`
- Potencjalne komponenty pomocnicze: `NotificationItem`, `NotificationGroup`, `NotificationFilters`
- Czy wymaga zewnętrznej biblioteki: Nie
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — liczniki, scroll, loading, puste stany i akcje

#### Cel

Prezentowanie i obsługa pełnej listy powiadomień dostarczanej przez aplikację.

#### Główne zastosowania

Panel powiadomień, drawer aktywności, alerty biznesowe i zadania wymagające reakcji.

#### Oczekiwane działanie

Centrum grupuje i filtruje dane bez modyfikacji źródła. Akcje mark read/all read emitują intencje i mogą wejść w loading kontrolowany przez konsumenta. Paginacja lub infinite scroll proszą o kolejne dane, ale niczego nie pobierają samodzielnie.

#### Główne funkcjonalności

Read/unread, grupy, filtry, priorytety, względne/absolutne daty, item actions, mark all, paging/infinite, empty/loading/error i controlled selection.

#### Warianty

`panel | drawer-content | page`, `pagination | infinite`, grupowanie data/typ/brak, compact/comfortable.

#### Stany komponentu

Initial loading, populated, filtered empty, all read, loading more, action pending/error, global error.

#### Proponowane API

Propsy: `items`, `unreadCount`, `filters`, `activeFilter`, `groupBy`, `loading`, `loadingMore`, `hasMore`, `error`, `selectedId`, `locale`, `formatDate`, `ariaLabel`, `dataTestId`.

#### Proponowane sloty

`header`, `filters`, `group-header`, `item`, `item-icon`, `item-actions`, `empty`, `loading`, `error`, `footer`.

#### Proponowane eventy

`select`, `action`, `markRead`, `markUnread`, `markAllRead`, `loadMore`, `filterChange`, `retry`.

#### Obsługa v-model

Opcjonalne `v-model:activeFilter` i `v-model:selectedId`; stan read jest częścią kontrolowanych `items`, nie mutacją wewnętrzną.

#### Obsługa klawiatury

Naturalna lista linków/przycisków; jeśli wprowadzony zostanie composite listbox, musi mieć pełny wzorzec strzałek. Akcje itemu są osiągalne Tab, a menu dodatkowe korzysta z DropdownMenu.

#### Dostępność i ARIA

Lista i grupy z nagłówkami, unread przekazany tekstem/semantyką, nie tylko kropką. Nowo przychodzące dane nie są automatycznie ogłaszane masowo. Daty względne mają pełny machine-readable `datetime` i dostępny kontekst.

#### Responsywność

Layout itemu przechodzi z wielokolumnowego w pionowy, akcje trafiają do overflow menu, a scroll działa w dostępnej wysokości bez podwójnego body scroll.

#### Wymagane Storybook stories

Unread/read, grupy, filtry, actions, mark all pending/error, pagination/infinite, empty/loading/error, long content, mobile.

#### Zakres testów

Grupowanie/filter bez mutacji, counts, event payloads, loadMore deduplication, async pending, semantyka list/nagłówków, daty i responsive overflow.

#### Kryteria ukończenia

Komponent nie komunikuje się z API, stan kontrolowany nie jest optymistycznie fałszowany bez zgody, liczniki są spójne, a każda akcja ma nazwę i stan pending.

#### Poza zakresem pierwszej wersji

Push/WebSocket, przechowywanie, polityka retencji, uprawnienia i generowanie treści powiadomień.

### KeyboardShortcutMap

- Status: TODO
- Priorytet: P2
- Złożoność: M
- Kategoria: Productivity / Documentation
- Zależności: `KeyboardKey`, `ModalDialog`, `SearchInput`
- Potencjalne komponenty pomocnicze: `ShortcutRegistry`, `ShortcutGroup`
- Czy wymaga zewnętrznej biblioteki: Nie
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — modal, search i klawisze

#### Cel

Przeszukiwalny panel dokumentujący aktywne skróty klawiaturowe aplikacji.

#### Główne zastosowania

Pomoc użytkownika, edytory, narzędzia produktywności i odkrywanie funkcji.

#### Oczekiwane działanie

Panel otrzymuje statyczne lub dynamicznie rejestrowane skróty, grupuje je i filtruje po label/keywords/keys. Platforma wpływa wyłącznie na prezentację przenośnych tokenów. Klik wiersza może emitować wybór, ale nie wykonuje skrótu domyślnie.

#### Główne funkcjonalności

Grupy, search, kategorie, platformy, dynamic registry, konflikty/disabled i modal/panel.

#### Warianty

`modal | panel`, grupowanie category/context, platform auto/manual, compact/table.

#### Stany komponentu

Closed/open, results/no results, registry empty, shortcut disabled/conflict.

#### Proponowane API

Propsy: `shortcuts`, `open`, `query`, `platform`, `groupBy`, `showDisabled`, `showConflicts`, `ariaLabel`, `dataTestId`; wpis: `id`, `label`, `keys`, `category`, `context`, `description`, `disabled`, `keywords`.

#### Proponowane sloty

`header`, `group`, `shortcut`, `empty`, `footer`.

#### Proponowane eventy

`update:open`, `update:query`, `select`, `conflict`.

#### Obsługa v-model

`v-model:open`, opcjonalnie `v-model:query`; rejestr jest dostarczony z zewnątrz albo przez osobny, jawny provider.

#### Obsługa klawiatury

Modal dziedziczy focus trap/Escape; search standardowy; wyniki są zwykłymi semantycznymi wierszami lub linkami/przyciskami, jeśli interaktywne.

#### Dostępność i ARIA

Struktura nagłówków grup i lista/opis; KeyboardKey dostarcza pełne nazwy kombinacji. Konflikt i disabled są komunikowane tekstem. Nie przypisywać `aria-keyshortcuts`, jeśli skrót nie jest aktywny w bieżącym kontekście.

#### Responsywność

Tabela przechodzi w stacked rows, kombinacje nie rozrywają pojedynczych klawiszy, a modal ma scroll treści i stabilny nagłówek.

#### Wymagane Storybook stories

Modal/panel, platformy, grupy, search/no results, dynamic add/remove, disabled/conflict, mobile.

#### Zakres testów

Filter/group, mapper platform, registry update, focus modal, semantyka grup, accessible key text i responsive mode.

#### Kryteria ukończenia

Każdy skrót ma opis i poprawną reprezentację platformy, dynamiczne usunięcie nie zostawia aktywnego wiersza, a mapa nie rejestruje listenerów wykonujących akcje.

#### Poza zakresem pierwszej wersji

Edytowanie bindingów, wykrywanie wszystkich konfliktów systemowych i automatyczna rejestracja skrótów aplikacji bez API.

### ContextActionBar

- Status: TODO
- Priorytet: P2
- Złożoność: M
- Kategoria: Productivity / Data entry
- Zależności: `ButtonAction`, `DropdownMenu`, `CounterBadge`
- Potencjalne komponenty pomocnicze: overflow action calculator
- Czy wymaga zewnętrznej biblioteki: Nie
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — przyciski, menu i licznik

#### Cel

Pokazanie działań odnoszących się do aktualnego zaznaczenia jednego lub wielu elementów.

#### Główne zastosowania

Bulk actions w tabelach/listach, edytory, galerie i zarządzanie plikami.

#### Oczekiwane działanie

Pasek pojawia się, gdy `selectionCount > 0`, zachowując focus i nie zasłaniając aktywnej treści. Najważniejsze akcje pozostają widoczne, reszta przechodzi do DropdownMenu zależnie od konfiguracji lub pomiaru. Clear emituje intencję wyczyszczenia.

#### Główne funkcjonalności

Count, primary/overflow actions, clear, sticky/floating, hidden/disabled actions, loading per action i responsive overflow.

#### Warianty

`sticky | floating | inline`, `top | bottom`, compact/comfortable.

#### Stany komponentu

Hidden, entering/visible/leaving, action pending, overflow open, disabled action, selection change.

#### Proponowane API

Propsy: `selectionCount`, `actions`, `visible`, `mode`, `position`, `maxVisibleActions`, `loadingActionId`, `ariaLabel`, `dataTestId`.

#### Proponowane sloty

`count`, `action`, `overflow`, `leading`, `trailing`.

#### Proponowane eventy

`action`, `clear`, `visibleChange`, `overflowChange`.

#### Obsługa v-model

Opcjonalne `v-model:visible`; zaznaczenie pozostaje własnością komponentu nadrzędnego.

#### Obsługa klawiatury

Naturalne przyciski i menu; pojawienie nie kradnie focusu. Opcjonalny skrót Escape do clear wymaga prop i nie może kolidować z otwartą warstwą.

#### Dostępność i ARIA

Nazwany `toolbar` z tekstem „Wybrano N”. Dynamiczne pojawienie może użyć statusu tylko raz; nie ogłaszać każdej zmiany count agresywnie. Ukryte akcje zachowują te same nazwy w menu.

#### Responsywność

Akcje przechodzą do overflow bez pomiarowej pętli; floating mieści się w safe area i nie zasłania focusu. Count może się skrócić wizualnie, ale nie dostępnie.

#### Wymagane Storybook stories

Single/multi count, sticky/floating, overflow, pending/disabled, dynamic resize, mobile bottom bar i long labels.

#### Zakres testów

Visibility, action payload, clear, overflow calculation, ResizeObserver cleanup, no focus steal, toolbar semantics i safe-area layout.

#### Kryteria ukończenia

Wszystkie akcje pozostają dostępne na małym ekranie, pojawienie nie zmienia aktywnego elementu, a loading jednej akcji nie blokuje pozostałych bez konfiguracji.

#### Poza zakresem pierwszej wersji

Zarządzanie zaznaczeniem, undo wykonanych akcji i autoryzacja.

### UndoRedoTimeline

- Status: TODO
- Priorytet: P2
- Złożoność: L
- Kategoria: Productivity / Data display
- Zależności: `ButtonAction`, `KeyboardKey`, `ScrollArea`, `TagChip`
- Potencjalne komponenty pomocnicze: `HistoryEntry`, `HistoryGroup`
- Czy wymaga zewnętrznej biblioteki: Nie
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — akcje, skróty, scroll i znaczniki

#### Cel

Prezentowanie historii operacji i emitowanie intencji cofnięcia, ponowienia lub przejścia do punktu.

#### Główne zastosowania

Edytory, konfiguratory, workflow i złożone formularze.

#### Oczekiwane działanie

Komponent otrzymuje pełną historię i aktywny indeks. Elementy przed aktywnym są undo branch, po nim redo branch. Klik lub klawiatura emitują `goTo`, ale komponent nie przechowuje snapshotów ani nie wykonuje operacji. Nowa historia może obciąć branch bez animacji wprowadzającej w błąd.

#### Główne funkcjonalności

Lista, active point, undo/redo, goTo, groups, saved markers, readonly, labels/timestamps i controlled pending.

#### Warianty

`vertical | horizontal`, `compact | detailed`, grouped/flat, z kontrolkami lub tylko timeline.

#### Stany komponentu

Empty, initial, canUndo, canRedo, atLatest, pending transition, readonly, invalid active id.

#### Proponowane API

Propsy: `entries`, `activeId`, `savedIds`, `groups`, `orientation`, `readonly`, `pendingId`, `showControls`, `ariaLabel`, `dataTestId`.

#### Proponowane sloty

`entry`, `entry-icon`, `group`, `controls`, `empty`, `saved-marker`.

#### Proponowane eventy

`undo`, `redo`, `goTo`, `select`, `invalidActive`.

#### Obsługa v-model

Opcjonalne `v-model:activeId` tylko jako controlled selection; preferowane eventy intencji, ponieważ aplikacja może odrzucić przejście.

#### Obsługa klawiatury

Kontrolki undo/redo są natywnymi przyciskami. Timeline może być listboxem z roving tabindex, strzałkami zgodnymi z orientacją, Home/End i Enter `goTo`. Globalnych Mod+Z/Shift+Mod+Z nie rejestruje domyślnie.

#### Dostępność i ARIA

Aktualny punkt oznaczony `aria-current="step"`; gałęzie undo/redo i zapisany punkt opisane tekstowo. Readonly nie oferuje fałszywych przycisków. Daty mają semantyczne time.

#### Responsywność

Horizontal ma kontrolowany scroll i utrzymuje aktywny punkt w widoku; detailed przechodzi w compact lub stacked bez utraty opisów.

#### Wymagane Storybook stories

Empty, pełna historia, canUndo/canRedo, groups, saved, pending, readonly, horizontal overflow, dynamic branch.

#### Zakres testów

Klasyfikacja branch, eventy bez mutacji, aktywny missing, focus/scroll active, klawiatura, aria-current, dates i controlled pending.

#### Kryteria ukończenia

Komponent nie przechowuje ani nie wykonuje historii, aktywny punkt jest jednoznaczny, działania niemożliwe są disabled, a przejście do dowolnego stanu jest dostępne bez pointera.

#### Poza zakresem pierwszej wersji

Silnik command/snapshot, merge branchy, persistence i globalne skróty.

### RadialActionMenu

- Status: TODO
- Priorytet: P3
- Złożoność: L
- Kategoria: Experimental / Navigation
- Zależności: `ContextMenu` lub wspólny mechanizm pozycji menu, `SvgIcon`
- Potencjalne komponenty pomocnicze: radial layout calculator, gesture resolver
- Czy wymaga zewnętrznej biblioteki: Nie
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — modele akcji, long press, focus i pozycjonowanie ContextMenu

#### Cel

Eksperymentalny szybki wybór akcji rozmieszczonych wokół punktu otwarcia z pełną alternatywą klawiaturową.

#### Główne zastosowania

Canvas, narzędzia graficzne, dotykowe menu kontekstowe i wyspecjalizowane workflow.

#### Oczekiwane działanie

Menu otwiera się przy kursorze/celu, oblicza dostępne sektory w viewport i wyróżnia sektor pod pointerem. Klik/release zatwierdza dopiero po przekroczeniu bezpiecznego promienia. Klawiatura porusza się po pozycjach logicznie, a tryb listy stanowi równoważny fallback.

#### Główne funkcjonalności

Right click, long press, shortcut, viewport collision, pointer selection, keyboard, opcjonalny drugi pierścień/podmenu, list fallback.

#### Warianty

`full-circle | half-circle | auto`, `icons | icon-label`, trigger pointer/touch/keyboard.

#### Stany komponentu

Closed, long-press pending, open neutral, sector active, submenu, cancelled, disabled item.

#### Proponowane API

Propsy: `items`, `open`, `center`, `radius`, `innerRadius`, `layout`, `longPressDelay`, `fallbackMode`, `disabled`, `ariaLabel`, `dataTestId`.

#### Proponowane sloty

`item`, `center`, `fallback-item`.

#### Proponowane eventy

`update:open`, `select`, `activeChange`, `cancel`, `openAt`, `layoutChange`.

#### Obsługa v-model

`v-model:open`; aktywny sektor może być kontrolowany opcjonalnie, ale nie powinien być stanem biznesowym.

#### Obsługa klawiatury

Strzałki poruszają zgodnie z geometrią, Home/End lub cykl, Enter/Spacja wybierają, Escape zamyka/cofa ring. Shift+F10/Menu daje fallback listę albo otwiera z fokusowanego celu.

#### Dostępność i ARIA

Wizualny układ radialny nie może być jedynym interfejsem: semantyczna kolejność menu/listy, pełne nazwy ikon i standardowe role. Nie wymaga precyzyjnego ruchu pointera; drag można anulować.

#### Responsywność

Layout wybiera półokrąg/obrót przy krawędziach, uwzględnia safe area i duże cele dotykowe; przy braku miejsca automatycznie używa list fallback.

#### Wymagane Storybook stories

Full/half, wszystkie krawędzie, mouse release, long press cancel, keyboard/list fallback, disabled, drugi ring eksperymentalny, mobile.

#### Zakres testów

Geometria sektorów, collision, próg ruchu, pointer capture cleanup, long press, keyboard order, fallback parity, ARIA i reduced motion.

#### Kryteria ukończenia

Eksperyment ma mierzalne kryteria użyteczności, każda akcja jest dostępna w fallbacku listowym, błędny gest nie wykonuje akcji i menu nigdy nie wychodzi poza viewport.

#### Poza zakresem pierwszej wersji

Więcej niż dwa pierścienie, gesture marking bez wyświetlania, personalizacja layoutu przez użytkownika.

## 12. Etap 3 — dane i zaawansowana prezentacja

Etap dostarcza wydajne, dostępne wizualizacje z obowiązkowym tekstowym lub tabelarycznym odpowiednikiem tam, gdzie grafika sama nie przekazuje pełnej informacji.

### JsonExplorer

- Status: TODO
- Priorytet: P2
- Złożoność: L
- Kategoria: Data display
- Zależności: `TreeList`, `CopyButton`, `SearchInput`; opcjonalnie `VirtualList`
- Potencjalne komponenty pomocnicze: `JsonNode`, path utility, safe serializer
- Czy wymaga zewnętrznej biblioteki: Nie
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — drzewo, wyszukiwanie, kopiowanie i wirtualizacja

#### Cel

Czytelny, interaktywny podgląd zagnieżdżonych danych JSON bez wykonywania zawartego w nich kodu.

#### Główne zastosowania

Debugowanie, podgląd API, konfiguracje, audyt danych i dokumentacja.

#### Oczekiwane działanie

Obiekty i tablice rozwijają się do konfigurowanej głębokości. Wyszukiwanie wskazuje dopasowania kluczy/wartości i rozwija ścieżkę wyniku bez utraty ręcznego stanu. Kopiowanie klucza, wartości lub pełnej ścieżki ma jawne akcje. Cykle i wartości spoza JSON mają kontrolowane fallbacki.

#### Główne funkcjonalności

Typy JSON, expand/collapse, initial depth, search, copy key/value/path, type highlighting, large data, readonly i controlled expanded paths.

#### Warianty

`tree | compact`, `light | inherited theme`, path `dot | bracket | json-pointer`, line/row density.

#### Stany komponentu

Empty/null, collapsed/expanded, searching/no results, active result, copying, too-large warning, invalid/circular input.

#### Proponowane API

Propsy: `value`, `expandedPaths`, `defaultDepth`, `searchQuery`, `pathFormat`, `sortKeys`, `showTypes`, `showCopy`, `maxStringLength`, `virtualizeThreshold`, `ariaLabel`, `dataTestId`.

#### Proponowane sloty

`node`, `key`, `value`, `actions`, `empty`, `invalid`, `search-result`.

#### Proponowane eventy

`update:expandedPaths`, `update:searchQuery`, `toggle`, `select`, `copy`, `searchResultChange`, `serializationError`.

#### Obsługa v-model

Opcjonalne `v-model:expandedPaths` i `v-model:searchQuery`; `value` jest readonly i nigdy nie jest mutowane.

#### Obsługa klawiatury

Wzorzec tree: góra/dół między węzłami, prawo rozwija/wchodzi, lewo zwija/wraca, Home/End, Enter wybiera, dedykowane przyciski kopiowania dostępne Tab lub menu akcji.

#### Dostępność i ARIA

`tree/treeitem/group` z poziomem, expanded i nazwą zawierającą klucz, typ oraz skróconą wartość. Kolor typów wsparty tekstem. Wirtualizacja zachowuje `aria-setsize/posinset`; wynik wyszukiwania jest opisany liczbowo.

#### Responsywność

Głębokość używa kontrolowanego wcięcia, poziomy scroll jest dostępny i nie dotyczy całej strony; akcje węzła nie nachodzą na treść.

#### Wymagane Storybook stories

Wszystkie typy, głęboki obiekt, tablice, search, copy, długie stringi, 10k nodes, circular/unsupported, controlled expansion, mobile.

#### Zakres testów

Budowanie ścieżek, depth, search i ujawnianie ścieżki, copy serialization, cykle, brak mutacji, tree keyboard/ARIA, wirtualizacja i wydajność.

#### Kryteria ukończenia

Dane nie są wykonywane ani mutowane, głęboka struktura nie powoduje stack overflow, każda widoczna informacja o typie ma tekstowy odpowiednik, a duży zestaw mieści się w budżecie wydajności.

#### Poza zakresem pierwszej wersji

Edycja, walidacja JSON Schema, diff i wykonywanie wyrażeń na danych.

### DiffViewer

- Status: TODO
- Priorytet: P1
- Złożoność: XL
- Kategoria: Data display
- Zależności: `ScrollArea`, opcjonalnie `VirtualList`, `CopyButton`
- Potencjalne komponenty pomocnicze: `DiffHunk`, `DiffLine`, algorytm tekstowego diffu
- Czy wymaga zewnętrznej biblioteki: Możliwe — algorytm diff wymaga porównania jakości, złożoności, licencji i rozmiaru; renderer pozostaje własny
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — scroll, wirtualizacja, kopiowanie i stany

#### Cel

Porównanie dwóch wersji tekstu w widoku obok siebie lub liniowym, z obsługą dużych plików.

#### Główne zastosowania

Review zmian, historia wersji, porównanie konfiguracji i podgląd importu.

#### Oczekiwane działanie

Silnik tworzy stabilne hunki z liniami context/add/remove/change. Unchanged ranges mogą być zwinięte i rozwinięte. Side-by-side synchronizuje pionowy scroll i mapuje puste placeholdery. Zmiana wejścia anuluje stare obliczenie; bardzo duże dane mogą być liczone asynchronicznie/workerem w późniejszym kroku.

#### Główne funkcjonalności

Inline/side-by-side, line numbers, hunks, collapse context, expand, whitespace option, wrap/no-wrap, large files, copy i readonly.

#### Warianty

`split | unified`, `wrap | scroll`, density, theme inherited, context lines.

#### Stany komponentu

Equal, calculating, changed, no comparable data, too large, error, collapsed/expanded hunk.

#### Proponowane API

Propsy: `before`, `after`, `mode`, `contextLines`, `collapseUnchanged`, `ignoreWhitespace`, `wrap`, `language`, `lineNumbers`, `loading`, `maxSyncSize`, `ariaLabel`, `dataTestId`. Neutralny model `DiffResult` może być przekazany zamiast tekstów.

#### Proponowane sloty

`header-before`, `header-after`, `line`, `hunk-header`, `collapsed`, `loading`, `error`, `empty`.

#### Proponowane eventy

`computed`, `error`, `expandHunk`, `lineSelect`, `copy`, `scroll`.

#### Obsługa v-model

Brak modelu danych; opcjonalne `v-model:expandedHunks` dla kontrolowanego rozwinięcia.

#### Obsługa klawiatury

Przyciski „następna/poprzednia zmiana” i rozwijania są tabowalne; skróty n/p mogą działać tylko po focusie komponentu. Home/End i scroll pozostają natywne. Nie tworzyć tab stopu na każdej linii.

#### Dostępność i ARIA

Komponent ma tekstowe podsumowanie liczby zmian oraz semantyczne regiony before/after. Dodanie/usunięcie jest opisane słowem/ukrytą etykietą, nie tylko kolorem. Linie mają dostępne numery i status; dla bardzo dużego diffu możliwy jest alternatywny linearny widok dla AT.

#### Responsywność

Split może przełączyć się do unified przy małej szerokości zgodnie z propem lub media query udokumentowanym w statusie; horizontal scroll pozostaje wewnątrz. Synchronizacja nie tworzy pętli.

#### Wymagane Storybook stories

Equal, unified/split, wszystkie typy linii, collapsed context, wrap, whitespace, długie/duże pliki, loading/error, mobile i keyboard navigation.

#### Zakres testów

Algorytm na insert/delete/change/Unicode/newline/whitespace, hunki, line mapping, expand, sync scroll, cancellation, ARIA summary/labels, responsive mode i performance.

#### Kryteria ukończenia

Wynik jest deterministyczny, nie gubi końcowych newline, znaczenie zmian jest dostępne bez koloru, duży input nie blokuje UI ponad ustalony budżet, a split/unified pokazują te same dane.

#### Poza zakresem pierwszej wersji

`CodeDiffViewer` z pełnym highlightingiem, `JsonDiffViewer`, `ImageDiffViewer`, `ObjectDiffViewer`, edycja i merge konfliktów.

### ActivityTimeline

- Status: TODO
- Priorytet: P2
- Złożoność: L
- Kategoria: Data display
- Zależności: `Avatar`, `TagChip`, `ScrollArea`, `ButtonAction`
- Potencjalne komponenty pomocnicze: `TimelineItem`, `TimelineGroup`, date grouping utility
- Czy wymaga zewnętrznej biblioteki: Nie
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — avatary, tagi, scroll i akcje

#### Cel

Chronologiczna prezentacja aktywności i historii zdarzeń z różnymi rodzajami treści.

#### Główne zastosowania

Historia rekordu, audyt, aktywność projektu, zdarzenia systemowe i komentarze.

#### Oczekiwane działanie

Elementy są renderowane w dostarczonej kolejności albo sortowane tylko po jawnej opcji. Grupowanie według dnia respektuje locale/timeZone. Load more emituje żądanie na właściwym końcu. Załączniki i akcje są treścią kontrolowaną.

#### Główne funkcjonalności

Typ, autor, data, ikona, opis, dodatkowa treść, attachments, day grouping, filtering, load more, vertical/compact i selected event.

#### Warianty

`default | compact`, `chronological | reverse`, grouped/flat, z linią lub bez.

#### Stany komponentu

Empty, loading initial/more, populated, filtered empty, item pending/error, end reached.

#### Proponowane API

Propsy: `items`, `order`, `groupByDay`, `filters`, `activeFilters`, `loading`, `loadingMore`, `hasMore`, `locale`, `timeZone`, `selectedId`, `ariaLabel`, `dataTestId`.

#### Proponowane sloty

`item`, `icon`, `author`, `content`, `attachments`, `actions`, `group-header`, `empty`, `loading`.

#### Proponowane eventy

`select`, `action`, `filterChange`, `loadMore`, `attachmentOpen`.

#### Obsługa v-model

Opcjonalne `v-model:selectedId` i `v-model:activeFilters`; elementy są readonly.

#### Obsługa klawiatury

Naturalna sekwencja linków/przycisków; timeline nie wymusza composite focus. Przycisk load more oraz akcje itemów dostępne standardowo.

#### Dostępność i ARIA

Uporządkowana lista, nagłówki grup, semantyczne `time datetime`, tekstowe nazwy typów/autorów. Linia i ikony są dekoracyjne, jeśli powtarzają tekst. Nowe elementy nie powodują masowego live announcement.

#### Responsywność

Compact redukuje dekoracje, a nie semantykę; treść/attachments zawijają się, akcje mogą wejść do menu, linia nie nachodzi na tekst.

#### Wymagane Storybook stories

Różne typy, grouped/reverse, attachments/actions, filters, loading more, empty, long content, compact/mobile.

#### Zakres testów

Order/group z timezone, filter bez mutacji, loadMore dedupe, eventy, list/time semantics, sloty, responsive i dynamic prepend focus/scroll.

#### Kryteria ukończenia

Kolejność i grupowanie są deterministyczne, daty mają pełny kontekst, timeline nie pobiera danych sam, a wszystkie typy zdarzeń da się odczytać bez ikon/koloru.

#### Poza zakresem pierwszej wersji

WebSocket, edycja zdarzeń, globalny audit store i automatyczne formatowanie domenowych payloadów.

### MetricCard

- Status: TODO
- Priorytet: P1
- Złożoność: M
- Kategoria: Data display
- Zależności: `CardPanel`, `InfoTooltip`, `SkeletonLoading`, `MessageText`
- Potencjalne komponenty pomocnicze: `MetricTrend`, prosty `Sparkline` renderer
- Czy wymaga zewnętrznej biblioteki: Nie; wykres zewnętrzny wyłącznie przez slot
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — karta, tooltip, loading i komunikaty

#### Cel

Spójna karta KPI z wartością, kontekstem porównawczym i opcjonalnym trendem.

#### Główne zastosowania

Dashboardy, podsumowania raportów, monitoring i cele.

#### Oczekiwane działanie

Karta formatuje lub przyjmuje gotową wartość, pokazuje zmianę wraz z kierunkiem i bazą porównania. Kierunek nie zakłada automatycznie semantyki pozytywnej — `trendTone` jest jawny. Sparkline jest dekoracyjny, chyba że ma opis danych.

#### Główne funkcjonalności

Value, label, delta, direction, comparison, target/progress, sparkline slot/data, tooltip, loading/error/empty i opcjonalna akcja.

#### Warianty

`default | compact | featured`, trend `up | down | neutral`, tone `positive | negative | neutral`, target on/off.

#### Stany komponentu

Data, loading, error, empty, stale/optional, interactive focus.

#### Proponowane API

Propsy: `value`, `formattedValue`, `label`, `description`, `delta`, `deltaLabel`, `trend`, `trendTone`, `comparisonValue`, `target`, `sparklineData`, `loading`, `error`, `emptyText`, `interactive`, `dataTestId`.

#### Proponowane sloty

`value`, `label`, `trend`, `sparkline`, `tooltip`, `actions`, `loading`, `error`, `empty`.

#### Proponowane eventy

`click`, `retry`, `action` tylko gdy odpowiednie elementy są interaktywne.

#### Obsługa v-model

Nie dotyczy.

#### Obsługa klawiatury

Karta statyczna nie jest tabowalna; jeśli prowadzi do szczegółów, używa linku/przycisku obejmującego właściwy obszar bez zagnieżdżania innych akcji.

#### Dostępność i ARIA

Label i value tworzą spójną frazę; trend ma tekst „wzrost/spadek X względem Y”, nie tylko strzałkę/kolor. Tooltip ma dostępny trigger; loading używa `aria-busy`, error jest komunikatem.

#### Responsywność

Wartość skaluje się w tokenach, nie wychodzi poza kartę; actions i comparison zawijają się; sparkline ma stabilny aspect ratio.

#### Wymagane Storybook stories

Trend up/down neutral z różną semantyką, target, sparkline slot/data, compact/featured, loading/error/empty, długie wartości, mobile.

#### Zakres testów

Format/presentation, trend text/tone independence, states, interactive semantics, tooltip, sparkline fallback, contrast i overflow.

#### Kryteria ukończenia

Wartość i porównanie są zrozumiałe bez grafiki, karta nie jest fałszywie fokusowalna, wszystkie stany mają stabilny layout i API nie narzuca biblioteki wykresów.

#### Poza zakresem pierwszej wersji

Pobieranie KPI, rozbudowane wykresy, alerty progowe i automatyczna interpretacja „dobrego” kierunku.

### CalendarHeatmap

- Status: TODO
- Priorytet: P2
- Złożoność: L
- Kategoria: Data display
- Zależności: `InfoTooltip`, `ScrollArea`, `TagChip`
- Potencjalne komponenty pomocnicze: `HeatmapCell`, date grid utility, legend
- Czy wymaga zewnętrznej biblioteki: Nie
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — tooltip, scroll, legenda/tagi

#### Cel

Kalendarzowa mapa intensywności wartości z dostępnym wyborem dnia lub zakresu.

#### Główne zastosowania

Aktywność, obciążenie, zdarzenia, dostępność i kontrybucje.

#### Oczekiwane działanie

Zakres dat jest mapowany do tygodni i dni według locale/startOfWeek. Poziom intensywności wynika z jawnej skali lub funkcji. Hover/focus pokazuje tooltip; wybór aktualizuje dzień/zakres. Brak danych różni się od wartości zero.

#### Główne funkcjonalności

Date range, levels, legend, tooltip, day/range selection, orientation, locale, missing data, controlled value i accessible alternate summary.

#### Warianty

Orientacja `horizontal | vertical`, selection `none | single | range`, skala discrete/custom, label months/weekdays.

#### Stany komponentu

No data, zero, intensity levels, hovered/focused, selected/range, disabled day, loading/error.

#### Proponowane API

Propsy: `data`, `startDate`, `endDate`, `levels`, `getLevel`, `selection`, `value`, `disabledDates`, `locale`, `weekStartsOn`, `orientation`, `showLegend`, `ariaLabel`, `dataTestId`.

#### Proponowane sloty

`cell`, `tooltip`, `legend`, `month-label`, `weekday-label`, `empty`, `loading`.

#### Proponowane eventy

`update:value`, `select`, `rangeChange`, `focusDate`, `cellClick`.

#### Obsługa v-model

`v-model:value` jako data, tuple zakresu albo `null`, zależnie od jawnego `selection`.

#### Obsługa klawiatury

Roving tabindex w gridzie; strzałki dni/tygodnie, Home/End tydzień, PageUp/PageDown miesiąc, Enter/Spacja wybór. Fokusowana komórka jest przewijana w widok.

#### Dostępność i ARIA

Grid z etykietą, komórka ma pełną datę, wartość i poziom tekstowo. Legenda ma opisy, a kolor nie jest jedynym kodem. Alternatywny widok tabeli/listy lub podsumowanie musi umożliwiać odczyt danych przy dużym zakresie.

#### Responsywność

Kontrolowany poziomy scroll zamiast mikroskopijnych komórek; sticky/visible labels; target focus nie jest obcięty.

#### Wymagane Storybook stories

Rok, krótki zakres, wszystkie poziomy, missing vs zero, single/range, locale/week start, disabled, horizontal scroll, mobile.

#### Zakres testów

Date grid/leap year/DST-neutral, level boundaries, selection, keyboard, tooltip focus/hover, accessible labels, scroll-to-focus i legend.

#### Kryteria ukończenia

Każda komórka ma pełny opis, mapowanie dat nie zależy od niejawnej strefy, różnica zero/brak jest widoczna i dostępna, a cały zakres da się nawigować klawiaturą.

#### Poza zakresem pierwszej wersji

Edytowanie wartości, agregacja pobieranych danych i dowolne wizualizacje gradientowe bez dyskretnej legendy.

### StatusFlow

- Status: TODO
- Priorytet: P2
- Złożoność: L
- Kategoria: Data display / Navigation
- Zależności: `NavigationStepper`, `TagChip`, `InfoTooltip`
- Potencjalne komponenty pomocnicze: `StatusNode`, `StatusEdge`, neutralny model grafu przejść
- Czy wymaga zewnętrznej biblioteki: Nie dla liniowego/małego rozgałęzienia
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — liniowy wariant może rozbudować/skomponować NavigationStepper; graf wymaga odrębnej odpowiedzialności

#### Cel

Wizualizacja bieżącego, ukończonych i możliwych etapów procesu, w tym odrzuceń i rozgałęzień.

#### Główne zastosowania

Status dokumentu, zamówienia, wniosku, publikacji i procesu akceptacji.

#### Oczekiwane działanie

Komponent mapuje neutralne węzły i przejścia, oznacza historię oraz aktualny status. Wariant liniowy zachowuje semantykę kroków; rozgałęzienia nie udają osi czasu i mają listowy odpowiednik. Klik statusu tylko emituje wybór, nie zmienia procesu.

#### Główne funkcjonalności

Current/completed/future/rejected/skipped, branches, transition history, descriptions, horizontal/vertical, selectable/read-only.

#### Warianty

`linear | branched`, `horizontal | vertical`, `compact | detailed`, interactive/readonly.

#### Stany komponentu

Initial, in progress, complete, rejected, skipped path, invalid graph/current missing, loading.

#### Proponowane API

Propsy: `statuses`, `transitions`, `currentId`, `history`, `orientation`, `layout`, `interactive`, `loading`, `ariaLabel`, `dataTestId`; status: `id`, `label`, `description`, `state`, `metadata`.

#### Proponowane sloty

`status`, `icon`, `description`, `transition`, `history`, `invalid`.

#### Proponowane eventy

`select`, `transitionSelect`, `invalidGraph`.

#### Obsługa v-model

Opcjonalne `v-model:selectedId` dla inspekcji; `currentId` jest readonly i kontrolowany przez domenę.

#### Obsługa klawiatury

Jeśli selectable: roving tabindex po logicznej kolejności, strzałki zgodne z orientacją i jawna obsługa branch wyboru; Enter otwiera szczegóły. Readonly nie ma tab stopów poza linkami.

#### Dostępność i ARIA

Ordered list dla linear, zagnieżdżone listy/tree lub opis relacji dla branched. `aria-current="step"`, tekstowe stany i historia. Krawędzie/kolory nie są jedynym źródłem relacji; dostępna lista „z X do Y”.

#### Responsywność

Horizontal może przewijać się lub przejść vertical; branch diagram ma kontrolowany scroll/zoom dopiero gdy potrzebny, a list fallback pozostaje widoczny dla AT.

#### Wymagane Storybook stories

Linear wszystkie stany, vertical/horizontal, rejected/skipped, branch, history, invalid graph, selectable, mobile.

#### Zakres testów

State derivation, history/path, cycles/invalid refs, keyboard, list/tree semantics, current state, responsive switch i brak mutacji.

#### Kryteria ukończenia

Aktualny status i przebyta ścieżka są jednoznaczne bez koloru, branch ma pełny tekstowy odpowiednik, a komponent nigdy nie wykonuje przejścia domenowego samodzielnie.

#### Poza zakresem pierwszej wersji

Edytowanie grafu statusów, wykonywanie transition, złożony auto-layout i workflow canvas.

### OrganizationChart

- Status: TODO
- Priorytet: P2
- Złożoność: XL
- Kategoria: Data display / Visualization
- Zależności: `TreeList`, `SearchInput`, `ScrollArea`, `Avatar`
- Potencjalne komponenty pomocnicze: `OrganizationNode`, `ChartViewport`, `ChartControls`, tree layout utility
- Czy wymaga zewnętrznej biblioteki: Możliwe dla wydajnego layoutu; wymaga RFC i dostępnego fallbacku niezależnego od biblioteki
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — TreeList jako alternatywny widok, search, avatary i scroll

#### Cel

Przegląd hierarchii organizacyjnej z możliwością eksploracji dużych struktur i pełnym alternatywnym widokiem drzewa.

#### Główne zastosowania

Struktura firmy, zespoły, raportowanie, katalog stanowisk i zależności nadrzędny–podrzędny.

#### Oczekiwane działanie

Drzewo renderuje stabilny layout, pozwala zwijać gałęzie, wybierać i wyszukiwać węzły. Wynik wyszukiwania ujawnia ścieżkę i centruje widok. Zoom/pan nie zastępują nawigacji drzewa; przełączalny lub równoległy TreeList zapewnia pełny dostęp do danych.

#### Główne funkcjonalności

Hierarchy, expand/collapse, custom node, vertical/horizontal, zoom/pan, search, selection, large data i accessible tree view.

#### Warianty

`chart | tree | split`, orientacja `top-down | left-right`, compact/detailed, controlled/uncontrolled viewport.

#### Stany komponentu

Empty, loading, rendered, branch collapsed, selected, search/no result, layout calculating/error, very large warning.

#### Proponowane API

Propsy: `nodes`, `rootIds`, `expandedIds`, `selectedId`, `query`, `orientation`, `view`, `nodeKey`, `getChildren`, `loading`, `layout`, `minZoom`, `maxZoom`, `ariaLabel`, `dataTestId`.

#### Proponowane sloty

`node`, `node-actions`, `controls`, `search-result`, `empty`, `loading`, `error`, `tree-item`.

#### Proponowane eventy

`update:expandedIds`, `update:selectedId`, `update:query`, `select`, `toggle`, `viewportChange`, `nodeAction`, `layoutError`.

#### Obsługa v-model

`v-model:expandedIds`, `v-model:selectedId`, opcjonalne `v-model:query`; viewport przez event/ref, nie wymagany dwukierunkowy model.

#### Obsługa klawiatury

Widok tree używa pełnego wzorca TreeView. W chart focus porusza się rodzic/dzieci/rodzeństwo strzałkami, Enter wybiera, Spacja rozwija, `+/-` zoomują tylko po focusie viewportu; kontrolki zoom/pan są również przyciskami.

#### Dostępność i ARIA

Każdy węzeł ma nazwę, poziom, stan expanded i relacje. Linie są dekoracyjne; struktura jest dostępna przez tree DOM lub zsynchronizowany TreeList. Zoom nie zmniejsza tekstu poniżej czytelności w alternatywnym widoku.

#### Responsywność

Viewport ma pan/scroll, kontrolki są osiągalne, a na mobile domyślny może być widok tree. Resize zachowuje wybrany węzeł w widoku bez resetu użytkownika.

#### Wymagane Storybook stories

Mała/duża hierarchia, orientacje, custom node, collapse, search reveal, selection, chart/tree/split, loading/error, mobile i keyboard.

#### Zakres testów

Normalizacja/cycles/orphans, layout determinism, expand/search path, selection, viewport controls, tree parity, keyboard/ARIA, 5k nodes benchmark i cleanup.

#### Kamień milowy 1 — model i dostępny widok drzewa

Zdefiniować neutralne typy hierarchii, walidację cykli/sierot oraz widok TreeList. Kryterium: 100% danych i akcji jest dostępne w widoku drzewa z klawiatury.

#### Kamień milowy 2 — podstawowy layout diagramu

Dodać top-down, węzły, połączenia, expand/select i stabilne pozycje. Kryterium: małe i średnie drzewa nie nachodzą na siebie i odpowiadają modelowi tree.

#### Kamień milowy 3 — wyszukiwanie, zoom i pan

Dodać query, ujawnianie ścieżki, centrowanie oraz kontrolki viewportu. Kryterium: wynik jest osiągalny w obu widokach, a każda kontrolka działa klawiaturą.

#### Kamień milowy 4 — duże dane i responsywność

Wprowadzić lazy/ograniczone renderowanie i strategię mobile. Kryterium: benchmark 5 000 węzłów spełnia budżet, a fallback tree nie traci danych.

#### Kamień milowy 5 — stabilizacja API

Zweryfikować sloty, eventy, parytet frameworków, eksport typów i migracje. Kryterium: pełny check/build/docs przechodzi, a kontrakt viewportu i layoutu jest udokumentowany.

#### Kryteria ukończenia

Diagram i TreeList są zsynchronizowane, struktura jest odczytywalna bez linii, wyszukiwanie ujawnia poprawną ścieżkę, duże dane spełniają budżet i wszystkie kamienie milowe są zamknięte.

#### Poza zakresem pierwszej wersji

Zmiana hierarchii drag-and-drop, porównanie struktur, druk/eksport i wiele typów relacji — są przewidziane w OrganizationChart Advanced.

### RelationshipGraph

- Status: TODO
- Priorytet: P2
- Złożoność: XL
- Kategoria: Data display / Visualization
- Zależności: `FullscreenContainer`, `SearchInput`, `InfoTooltip`
- Potencjalne komponenty pomocnicze: `GraphViewport`, `GraphNode`, `GraphEdge`, `GraphControls`, accessible relation list
- Czy wymaga zewnętrznej biblioteki: Prawdopodobnie dla layoutu dużych grafów; wybór wymaga RFC, benchmarku i sprawdzenia licencji
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — fullscreen, search, tooltip i style; nie utożsamiać z WorkflowCanvas

#### Cel

Eksploracyjna wizualizacja relacji między elementami, skupiona na odczycie i filtrowaniu, a nie budowaniu procesu.

#### Główne zastosowania

Powiązania danych, zależności systemowe, sieci podmiotów, impact analysis i katalog relacji.

#### Oczekiwane działanie

Graf przyjmuje neutralne nodes/edges, oblicza lub dostaje layout, obsługuje selection, hover/focus, zoom, pan, filtrowanie i grupy. Wybrany węzeł pokazuje sąsiadów. Równoważna lista relacji umożliwia odczyt i wybór bez canvas/SVG gestów.

#### Główne funkcjonalności

Nodes, edges, relation types, select, hover/focus, zoom/pan, filters, grouping, custom node renderer, accessible list i controlled layout.

#### Warianty

`graph | list | split`, layout `provided | force | hierarchical` po zatwierdzeniu, viewport inline/fullscreen.

#### Stany komponentu

Empty, loading/calculating, rendered, selected node/edge, filtered no results, layout error, too dense.

#### Proponowane API

Propsy: `nodes`, `edges`, `selectedNodeIds`, `selectedEdgeIds`, `filters`, `groups`, `layout`, `positions`, `view`, `minZoom`, `maxZoom`, `loading`, `ariaLabel`, `dataTestId`. Edge: `id`, `source`, `target`, `type`, `label`, `directed`, `metadata`.

#### Proponowane sloty

`node`, `edge-label`, `tooltip`, `controls`, `legend`, `details`, `list-node`, `list-relation`, `empty`, `loading`, `error`.

#### Proponowane eventy

`update:selectedNodeIds`, `update:selectedEdgeIds`, `selectNode`, `selectEdge`, `viewportChange`, `filterChange`, `layoutComplete`, `layoutError`.

#### Obsługa v-model

Modele selection; filtr może być controlled. Pozycje zmieniane tylko, jeśli jawnie włączono controlled layout — v1 jest przede wszystkim readonly visualization.

#### Obsługa klawiatury

Tab/roving focus po węzłach; strzałki wybierają najbliższego logicznego sąsiada, Enter otwiera szczegóły, skrót pokazuje listę relacji. Zoom/pan mają przyciski. Accessible list zapewnia zwykłą nawigację niezależną od geometrii.

#### Dostępność i ARIA

Każdy węzeł i krawędź ma tekstową nazwę; lista opisuje „A — typ relacji → B”, kierunek i grupę. Kolor/linia nie są jedynym kodem typu. Canvas bez odpowiednika DOM jest niedopuszczalny.

#### Responsywność

Viewport nie przejmuje scrollu strony bez aktywacji, wspiera touch pan/pinch bez blokowania zoomu strony poza obszarem, a mobile może domyślnie pokazać split/list.

#### Wymagane Storybook stories

Mały graf, wiele typów, directed/undirected, filters/groups, custom nodes, graph/list/split, fullscreen, layout error, dense graph, mobile i keyboard.

#### Zakres testów

Referential integrity, duplicate/cycle handling, filter/group, selection, geometry navigation, viewport, list parity, accessible relation text, layout cancellation i performance.

#### Kamień milowy 1 — model i lista relacji

Zdefiniować typy nodes/edges, walidację oraz dostępny widok listy. Kryterium: każdy węzeł, połączenie, kierunek i typ można znaleźć oraz wybrać bez diagramu.

#### Kamień milowy 2 — podstawowy diagram i selection

Renderować dostarczone pozycje lub prosty layout, zoom/pan i selection. Kryterium: graf ma stabilne pozycje, nie gubi eventów i jest zsynchronizowany z listą.

#### Kamień milowy 3 — filtrowanie, grupy i renderer

Dodać filtry typów, legendę, grupowanie i slot node. Kryterium: filtrowanie jest odwracalne, selection nie wskazuje ukrytego rekordu bez komunikatu, a typy relacji mają tekstowy odpowiednik.

#### Kamień milowy 4 — dostępność i optymalizacja

Dodać geometryczną klawiaturę, strategie dużych danych i testy wydajności. Kryterium: 1 000 węzłów/ustalona liczba krawędzi spełnia budżet, a wszystkie akcje mają list fallback.

#### Kamień milowy 5 — stabilizacja API

Zweryfikować wybór layoutu/zależności, typy, eventy, framework parity i dokumentację. Kryterium: API nie miesza się z edycją workflow, buildy przechodzą, a granica z wersją Advanced jest opisana.

#### Kryteria ukończenia

Graf pozostaje wizualizatorem, nie edytorem; lista ma pełny parytet informacji, wszystkie typy relacji są dostępne tekstowo, layout jest anulowalny i wszystkie kamienie milowe są ukończone.

#### Poza zakresem pierwszej wersji

Tworzenie/łączenie węzłów, undo/redo, porty i walidacja procesu (WorkflowCanvas) oraz clustering/path finding/lazy branches (RelationshipGraph Advanced).

## 13. Etap 4 — multimedia i adnotacje

Etap obejmuje interakcje z mediami. Dane wejściowe pozostają własnością aplikacji, a ciężkie dekodery i silniki nie powinny być implementowane od zera.

### ImageAnnotation

- Status: TODO
- Priorytet: P2
- Złożoność: XL
- Kategoria: Media / Data entry
- Zależności: `ImageView`, `ButtonAction`, `SvgIcon`, `InfoTooltip`
- Potencjalne komponenty pomocnicze: `AnnotationCanvas`, `AnnotationToolbar`, `AnnotationShape`, coordinate transform utility
- Czy wymaga zewnętrznej biblioteki: Możliwe dla geometrii/transformacji; wybór wymaga RFC, benchmarku i oceny eksportowalności danych
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — obraz, przyciski, ikony, tooltipy i komunikaty

#### Cel

Tworzenie i przeglądanie semantycznych adnotacji powiązanych z obrazem, zapisanych w neutralnym JSON.

#### Główne zastosowania

Review projektów, oznaczanie defektów, inspekcje, edukacja i komentarze wizualne.

#### Oczekiwane działanie

Adnotacje są zapisane w współrzędnych znormalizowanych względem naturalnego obrazu i skalują się z viewportem. Narzędzie tworzy kształt pointerem lub alternatywą klawiaturową/formularzową, pozwala select/edit/delete i emituje nowy model bez mutacji. Readonly zachowuje eksplorację oraz listę adnotacji.

#### Główne funkcjonalności

Point, rectangle, circle, line, arrow, region, labels/comments, select, edit, delete, readonly, zoom-safe scaling, JSON export/import i controlled active tool/selection.

#### Warianty

`edit | readonly`, toolbar compact/full, overlay SVG/canvas po decyzji, adnotacje geometryczne i punktowe.

#### Stany komponentu

Image loading/error, idle, tool active, drawing, selected, editing metadata, invalid shape, readonly, saving external/pending.

#### Proponowane API

Propsy: `src`, `alt`, `annotations`, `selectedIds`, `tool`, `readonly`, `disabled`, `minShapeSize`, `bounds`, `zoom`, `pan`, `showList`, `ariaLabel`, `dataTestId`. Adnotacja: `id`, `type`, `geometry`, `label`, `comment`, `colorToken`, `author`, `metadata`.

#### Proponowane sloty

`toolbar`, `tool`, `annotation`, `label`, `details`, `list`, `list-item`, `empty`, `image-error`.

#### Proponowane eventy

`update:annotations`, `update:selectedIds`, `update:tool`, `create`, `change`, `delete`, `select`, `export`, `invalid`, `viewportChange`.

#### Obsługa v-model

`v-model:annotations`, `v-model:selectedIds`, opcjonalnie `v-model:tool`; model jest immutable i walidowany przed emisją.

#### Obsługa klawiatury

Toolbar ma roving lub naturalny focus. Lista adnotacji umożliwia wybór; formularz pozycji/rozmiaru zapewnia alternatywę dla rysowania. Strzałki przesuwają wybraną adnotację o krok, Shift zwiększa krok, Delete usuwa po potwierdzeniu/polityce, Escape anuluje draft.

#### Dostępność i ARIA

Obraz ma alt. Każda adnotacja ma nazwę, typ, położenie opisowe i komentarz w dostępnej liście zsynchronizowanej z overlay. Kształt/kolor nie są jedyną identyfikacją. Instrukcje trybu narzędzia i zmiany są kontrolowanie ogłaszane.

#### Responsywność

Transformacja korzysta z natural dimensions i ResizeObserver; adnotacje nie dryfują przy zmianie aspect ratio/zoom. Toolbar przechodzi do overflow, a lista może znaleźć się pod obrazem.

#### Wymagane Storybook stories

Każdy typ, create/edit/delete, readonly, keyboard/form geometry, resize/aspect ratio, image error/loading, overlapping annotations, mobile i export JSON.

#### Zakres testów

Transformacje natural↔normalized, clamp/min size, immutable CRUD, pointer capture/cancel, keyboard geometry, list-overlay sync, import validation, ARIA i resize precision.

#### Kamień milowy 1 — model i readonly

Zdefiniować neutralny schema JSON, walidację, ImageView overlay i dostępną listę. Kryterium: wszystkie typy danych można odczytać, zaznaczyć i eksportować bez trybu edycji.

#### Kamień milowy 2 — punkty i prostokąty

Dodać create/select/move/delete dla punktu i prostokąta oraz alternatywny formularz geometrii. Kryterium: pointer i klawiatura prowadzą do równoważnego modelu z tolerancją precyzji.

#### Kamień milowy 3 — pozostałe kształty i metadane

Dodać okręgi, linie, strzałki, regiony, label/comment. Kryterium: każdy typ ma walidację, dostępny opis i pełne testy CRUD.

#### Kamień milowy 4 — skalowanie i optymalizacja

Dodać zoom/pan compatibility, overlap selection i większe zestawy. Kryterium: resize nie zmienia danych, 1 000 adnotacji spełnia budżet, a selected pozostaje widoczny.

#### Kamień milowy 5 — stabilizacja API

Zweryfikować schema versioning, sloty, eventy, WC/React parity i dokumentację. Kryterium: JSON round-trip jest stabilny, migracje formatu opisane, wszystkie buildy przechodzą.

#### Kryteria ukończenia

Model jest neutralny i wersjonowalny, geometria nie dryfuje, każda operacja pointer ma alternatywę, lista i overlay są zsynchronizowane, a wszystkie kamienie milowe zakończone.

#### Poza zakresem pierwszej wersji

Freehand, OCR, współedycja realtime, analiza obrazu, backend komentarzy i rasteryzowanie adnotacji do pliku.

### BeforeAfterSlider

- Status: TODO
- Priorytet: P2
- Złożoność: M
- Kategoria: Media
- Zależności: `ImageView`, wzorce `InputSlider`
- Potencjalne komponenty pomocnicze: `ComparisonHandle`, image fit calculator
- Czy wymaga zewnętrznej biblioteki: Nie
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — renderowanie obrazów i semantyka slidera

#### Cel

Porównanie dwóch obrazów przez przesuwanie separatora w poziomie lub pionie.

#### Główne zastosowania

Retusz, zmiany projektu, postęp prac, mapy i porównanie wariantów.

#### Oczekiwane działanie

Oba obrazy zajmują identyczny viewport z ustaloną polityką `object-fit`. Drag/klik/klawiatura aktualizują procent 0–100. Wartość kontroluje clip jednej warstwy; ładowanie i błąd każdego obrazu są rozróżnione.

#### Główne funkcjonalności

Horizontal/vertical, drag, click-to-position, arrows, initial/controlled position, labels, differing ratios, loading/error i optional reset.

#### Warianty

Orientacja, `contain | cover`, label overlay/visually hidden, handle styles przez tokeny/slot.

#### Stany komponentu

Loading one/both, ready, dragging, focus, at min/max, image error, disabled.

#### Proponowane API

Propsy: `beforeSrc`, `afterSrc`, `beforeAlt`, `afterAlt`, `value`, `orientation`, `fit`, `min`, `max`, `step`, `disabled`, `beforeLabel`, `afterLabel`, `ariaLabel`, `dataTestId`.

#### Proponowane sloty

`before`, `after`, `handle`, `before-label`, `after-label`, `loading`, `error`.

#### Proponowane eventy

`update:value`, `change`, `commit`, `dragStart`, `dragEnd`, `imageLoad`, `imageError`.

#### Obsługa v-model

`v-model:value` jako procent; `change` podczas ruchu i `commit` po zakończeniu.

#### Obsługa klawiatury

Handle jest sliderem: strzałki o step, Page o większy krok, Home/End granice. Klik w obszar nie zabiera focusu bez potrzeby.

#### Dostępność i ARIA

`role=slider`/natywny range z orientacją, min/max/now i value text „60% obrazu Po”. Oba obrazy mają znaczące alt albo wspólny opis; labels nie polegają tylko na położeniu.

#### Responsywność

Stabilny aspect ratio ustalany przez prop/kontener, obraz nie rozciąga się; handle zachowuje hit area, resize nie zmienia value.

#### Wymagane Storybook stories

Horizontal/vertical, cover/contain, różne proporcje, controlled, keyboard, min/max, loading/error, mobile.

#### Zakres testów

Pointer percentage/clamp, orientation, keyboard, commit, resize, image states, slider ARIA, alt/labels i touch.

#### Kryteria ukończenia

Wartość jest stabilna przy resize, obrazy mają zgodny viewport, każdą pozycję da się ustawić klawiaturą, a znaczenie before/after jest dostępne tekstowo.

#### Poza zakresem pierwszej wersji

Więcej niż dwa obrazy, zoom/pan, automatyczne wyrównywanie obrazów i diff pikseli.

### HotspotViewer

- Status: TODO
- Priorytet: P2
- Złożoność: L
- Kategoria: Media / Data display
- Zależności: `ImageView`, `InfoTooltip` lub `PopoverOverlayer`, `SvgIcon`
- Potencjalne komponenty pomocnicze: `HotspotMarker`, hotspot list fallback
- Czy wymaga zewnętrznej biblioteki: Nie
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — obraz, tooltip/popover i ikony

#### Cel

Prezentowanie interaktywnych, dostępnych punktów informacyjnych na responsywnym obrazie.

#### Główne zastosowania

Mapy produktów, instrukcje, plany, prezentacje obiektów i edukacja.

#### Oczekiwane działanie

Punkty używają procentowych współrzędnych, skalują się z obrazem i otwierają tooltip/popover przez klik/focus. Jeden active hotspot może być kontrolowany. Lista alternatywna pozwala znaleźć te same punkty bez przestrzennej eksploracji.

#### Główne funkcjonalności

Percent positions, numbered/custom icons, tooltip/popover, active, keyboard navigation, custom content, readonly i list fallback.

#### Warianty

Marker `number | icon | custom`, content `tooltip | popover | inline panel`, interaction `focus | click`, list visible/AT-only.

#### Stany komponentu

Image loading/error, no hotspots, idle, focused/active, popover open, disabled hotspot.

#### Proponowane API

Propsy: `src`, `alt`, `hotspots`, `activeId`, `contentMode`, `showList`, `readonly`, `ariaLabel`, `dataTestId`; hotspot: `id`, `x`, `y`, `label`, `description`, `icon`, `disabled`, `metadata`.

#### Proponowane sloty

`marker`, `content`, `list`, `list-item`, `image`, `empty`, `loading`, `error`.

#### Proponowane eventy

`update:activeId`, `select`, `open`, `close`, `imageLoad`, `imageError`.

#### Obsługa v-model

`v-model:activeId` jako ID aktywnego punktu lub `null`.

#### Obsługa klawiatury

Tab lub roving focus po punktach w logicznej kolejności danych; strzałki opcjonalnie według geometrii, Enter/Spacja otwierają, Escape zamyka. Lista jest standardowo nawigowalna.

#### Dostępność i ARIA

Marker jest przyciskiem z nazwą, `aria-expanded/controls` dla popover. Numer nie jest jedyną nazwą. Lista odzwierciedla każdy punkt i jego treść; współrzędne nie są potrzebne do zrozumienia.

#### Responsywność

Pozycje odnoszą się do faktycznie renderowanego obszaru obrazu z uwzględnieniem contain/letterbox; popover unika krawędzi, marker ma hit area bez zmiany punktu kotwiczenia.

#### Wymagane Storybook stories

Numbered/icon, tooltip/popover, active controlled, custom content, contain/cover i różne ratio, overlapping/edge hotspots, list, mobile.

#### Zakres testów

Coordinate mapping, resize, fit offsets, focus/order, popover return, list parity, active missing, image states, ARIA i collision.

#### Kryteria ukończenia

Punkty nie dryfują przy resize/fit, każdy ma odpowiednik listowy, treść jest dostępna focus/click, a po zamknięciu focus wraca do markera.

#### Poza zakresem pierwszej wersji

Tworzenie/drag hotspotów, zoom, klastry, geograficzne mapy i pobieranie treści.

### FilePreview

- Status: TODO
- Priorytet: P1
- Złożoność: XL
- Kategoria: Media / Data display
- Zależności: `ImageView`, `JsonExplorer`, `EmptyState`, `SpinnerLoader`, `ButtonAction`
- Potencjalne komponenty pomocnicze: `PreviewRendererRegistry`, `FileMetadata`, renderery image/text/json/csv/audio/video/pdf-embed
- Czy wymaga zewnętrznej biblioteki: Preferowane Nie w v1; PDF tylko natywne osadzenie lub lekki adapter, bez własnego silnika
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — media, JSON, stany, akcja pobrania

#### Cel

Jednolity shell podglądu plików z rozszerzalnym rejestrem rendererów i bez uzależnienia od źródła danych.

#### Główne zastosowania

Załączniki, menedżery dokumentów, review uploadu i podgląd zasobów.

#### Oczekiwane działanie

Komponent dobiera renderer po jawnym MIME/type/adapterze, nie tylko rozszerzeniu. URL/File/Blob są kontrolowane, object URLs sprzątane. Unsupported pokazuje metadane i download. Błędy renderera nie wywracają shellu. Akcja download emituje intencję lub korzysta z bezpiecznego URL według API.

#### Główne funkcjonalności

Adapter registry, image/text/JSON/CSV/audio/video, ograniczony PDF, unsupported, metadata, loading/error, download, fullscreen i size limits.

#### Warianty

`inline | panel | fullscreen`, metadata expanded/compact, renderer built-in/custom.

#### Stany komponentu

Resolving, loading, ready, unsupported, too large, parse error, network/media error, download pending.

#### Proponowane API

Propsy: `file`, `src`, `name`, `mimeType`, `size`, `renderer`, `renderers`, `maxTextSize`, `metadata`, `downloadable`, `loading`, `error`, `ariaLabel`, `dataTestId`. Adapter: `canRender`, `load`, `component`, `dispose`.

#### Proponowane sloty

`toolbar`, `metadata`, `renderer`, `unsupported`, `loading`, `error`, `actions`.

#### Proponowane eventy

`load`, `ready`, `error`, `unsupported`, `download`, `rendererChange`, `fullscreenChange`.

#### Obsługa v-model

Brak modelu pliku; opcjonalne `v-model:fullscreen`. Stan mediów (czas odtwarzania) należy do odpowiedniego renderera.

#### Obsługa klawiatury

Shell i toolbar używają standardowych kontrolek. Renderery zachowują własne dostępne sterowanie; Escape opuszcza fullscreen, download ma button/link. Nie przechwytywać globalnych klawiszy bez focusu.

#### Dostępność i ARIA

Nazwany region z nazwą/typem/rozmiarem. Obrazy alt z danych; text/json semantyczne; audio/video natywne controls lub równoważne; PDF ma link pobrania i komunikat o ograniczeniach. Unsupported jest czytelny bez ikony.

#### Responsywność

Renderer jest ograniczony do kontenera; text/CSV mają wewnętrzny scroll, media zachowują aspect ratio, toolbar overflow, fullscreen safe area.

#### Wymagane Storybook stories

Każdy built-in renderer, custom adapter, unsupported, loading/error/too large, metadata, download, fullscreen, mobile i object URL cleanup scenario.

#### Zakres testów

Resolver priority/MIME, adapter lifecycle/cancellation/dispose, object URL revoke, parse limits, error boundary, actions, semantyka każdego renderera i responsive overflow.

#### Kryteria ukończenia

Renderer jest wymienialny, zasoby zawsze sprzątane, nieobsługiwany plik ma metadane i download, shell nie wykonuje aktywnej treści, a każdy format ma dostępny sposób użycia.

#### Poza zakresem pierwszej wersji

Pełny silnik PDF/Office, edycja, konwersja plików, sandboxowanie niesprawdzonego HTML i pobieranie z autoryzowanego API.

### AudioWaveform

- Status: TODO
- Priorytet: P2
- Złożoność: XL
- Kategoria: Media
- Zależności: `ButtonAction`, `InputSlider`, `SpinnerLoader`, `MessageText`
- Potencjalne komponenty pomocnicze: `WaveformCanvas`, `AudioControls`, `TimeMarker`, peak-data utility
- Czy wymaga zewnętrznej biblioteki: Możliwe dla dekodowania/waveform; wymaga RFC, obsługi Web Audio fallback i oceny rozmiaru
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — przyciski, slidery, loading i błędy

#### Cel

Dostępny podgląd fali audio z odtwarzaniem, seek, zaznaczaniem zakresu i markerami.

#### Główne zastosowania

Podgląd nagrań, transkrypcje, adnotacje czasowe, edycja zakresów i odsłuch załączników.

#### Oczekiwane działanie

Komponent przyjmuje URL/Blob lub gotowe peak data, synchronizuje waveform z media elementem i emituje czas z ograniczoną częstotliwością. Seek/range/markers działają pointerem i kontrolkami klawiaturowymi. Autoplay nie jest domyślny. Zmiana źródła anuluje dekodowanie i sprząta AudioContext/object URL.

#### Główne funkcjonalności

Waveform, play/pause, time/duration, seek, range selection, markers, playback rate, loading/error, controlled currentTime/range i accessible alternate controls.

#### Warianty

`compact | full`, single/multi-channel display, range on/off, controls built-in/custom.

#### Stany komponentu

Idle, loading/decoding, ready, playing, paused, seeking, selecting range, ended, media/decode error, unsupported.

#### Proponowane API

Propsy: `src`, `peaks`, `currentTime`, `range`, `markers`, `playbackRate`, `playing`, `height`, `channels`, `controls`, `disabled`, `ariaLabel`, `dataTestId`.

#### Proponowane sloty

`controls`, `play-button`, `time`, `marker`, `range`, `loading`, `error`, `transcript-link`.

#### Proponowane eventy

`update:currentTime`, `update:range`, `update:playing`, `play`, `pause`, `seek`, `rangeChange`, `rangeCommit`, `markerSelect`, `rateChange`, `load`, `error`, `ended`.

#### Obsługa v-model

Opcjonalne modele `currentTime`, `range`, `playing`; należy unikać pętli przy eventach timeupdate i rozdzielić częste preview od commit.

#### Obsługa klawiatury

Play/pause button, slider czasu, dwa thumb/range controls i marker list. Strzałki/większe kroki, Home/End; Space steruje tylko fokusowaną kontrolką, nie globalnie. Wszystkie funkcje waveform mają tekstowy panel kontrolek.

#### Dostępność i ARIA

Canvas/SVG jest wizualizacją; audio ma natywne lub równoważne controls. Slider czasu ma `aria-valuetext` z czasem, range dwa jednoznacznie nazwane uchwyty, markery listę z timestampami. Status loading/error i link do transkrypcji, jeśli dostarczony.

#### Responsywność

Waveform przelicza próbki do szerokości bez ponownego ciężkiego dekodowania, controls zawijają się, touch hit areas są duże, resize zachowuje czas/range.

#### Wymagane Storybook stories

Ready/play, loading/error, URL/peaks, range, markers, rates, compact/full, keyboard-only, mobile, source change i reduced motion.

#### Zakres testów

Peak normalization/downsampling, media sync, seek/range clamp, time formatting, source cancellation/cleanup, playback lifecycle, keyboard sliders, ARIA, ResizeObserver i mocked media APIs.

#### Kamień milowy 1 — audio i dostępne sterowanie

Natywny media element, play/pause, czas, seek slider, loading/error. Kryterium: całość działa bez waveform i pointera oraz sprząta zasoby po zmianie źródła.

#### Kamień milowy 2 — renderer waveform

Obsłużyć dostarczone peaks i podstawowe rysowanie. Kryterium: resize nie dekoduje ponownie, wizualizacja jest zsynchronizowana z czasem i ma testy próbkowania.

#### Kamień milowy 3 — dekodowanie i markery

Dodać opcjonalne generowanie peaks i listę markerów. Kryterium: anulowanie/limity dużych plików działają, markery są dostępne tekstowo.

#### Kamień milowy 4 — zaznaczanie zakresu i optymalizacja

Dodać dwa uchwyty, pointer selection, playback rate i benchmarki. Kryterium: range spełnia reguły min/max, ma pełną klawiaturę, a UI nie blokuje się przy ustalonym limicie.

#### Kamień milowy 5 — stabilizacja API

Zweryfikować politykę controlled media, adapter peaks, typy, targety i dokumentację. Kryterium: eventy nie tworzą pętli, framework parity i buildy przechodzą, ograniczenia formatów są jawne.

#### Kryteria ukończenia

Audio jest sterowalne bez fali i myszy, zasoby są sprzątane, model czasu/range jest stabilny, duże pliki mają limity, a wszystkie kamienie milowe są ukończone.

#### Poza zakresem pierwszej wersji

Edycja/destrukcyjne cięcie audio, nagrywanie, transkrypcja, streaming wielogodzinnych plików i efekty DSP.

### ColorPaletteExtractor

- Status: TODO
- Priorytet: P3
- Złożoność: L
- Kategoria: Media / Utility
- Zależności: `ImageView`, `CopyButton`, `ColorPicker`, `SpinnerLoader`
- Potencjalne komponenty pomocnicze: `useColorPalette` composable lub niezależny utility, `ColorSwatch`
- Czy wymaga zewnętrznej biblioteki: Możliwe dla kwantyzacji; algorytm musi być wymienialny przez adapter
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — obraz, kopiowanie, prezentacja/edycja koloru i loading

#### Cel

Wyodrębnianie i prezentowanie reprezentatywnej palety kolorów obrazu z możliwością użycia własnego algorytmu.

#### Główne zastosowania

Motywy, analiza assetów, generowanie tokenów, edytory i narzędzia designerskie.

#### Oczekiwane działanie

Po załadowaniu File/URL komponent dekoduje obraz, skaluje dane do limitu, uruchamia wymienialny extractor i pokazuje paletę. Cross-origin/tainted canvas jest obsłużony błędem. Zmiana wejścia anuluje stare obliczenie; wyniki są emitowane, ale nie zapisywane.

#### Główne funkcjonalności

File/URL, color count, palette, HEX/RGB/HSL, copy, CSS variables, loading/errors, algorithm adapter i optional selection.

#### Warianty

`component | headless-composable`, grid/list, format wyświetlania, editable palette jako późniejsza opcja.

#### Stany komponentu

Empty input, image loading, extracting, ready, decode/CORS/algorithm error, copied color/CSS.

#### Proponowane API

Propsy: `src`, `file`, `count`, `extractor`, `formats`, `cssVariablePrefix`, `maxDimension`, `selectedColor`, `ariaLabel`, `dataTestId`. Extractor: async `(imageData, options) => ColorValue[]` z AbortSignal.

#### Proponowane sloty

`image`, `palette`, `color`, `actions`, `loading`, `error`, `empty`.

#### Proponowane eventy

`extract`, `result`, `error`, `copy`, `copyCss`, `select`.

#### Obsługa v-model

Opcjonalne `v-model:selectedColor`; paleta jest wynikiem emitowanym, nie ukrytym modelem.

#### Obsługa klawiatury

Próbki jako przyciski tylko gdy selectable/copy; strzałki mogą używać roving grid, Enter kopiuje/wybiera według jawnej akcji. Akcje CSS są zwykłymi przyciskami.

#### Dostępność i ARIA

Każda próbka ma pełną wartość i opcjonalnie nazwę; kolor nie jest jedyną informacją. Loading/error są ogłaszane, a paleta ma list/grid z etykietą. Podgląd obrazu ma alt dostarczony przez użytkownika.

#### Responsywność

Grid próbek zawija się, tekst wartości nie wychodzi poza komórkę, obraz skaluje się bez wpływu na dane źródłowe, ciężka analiza nie blokuje resize.

#### Wymagane Storybook stories

URL/File mocked, liczby kolorów, formaty, CSS variables, custom extractor, loading, CORS/decode/error, cancellation, keyboard grid, mobile.

#### Zakres testów

Adapter/AbortSignal, downscale, format conversion, deterministic mocked palette, CORS/error, object URL cleanup, copy, sample semantics i race conditions.

#### Kryteria ukończenia

Logika ekstrakcji jest wydzielona i wymienialna, stary wynik nie nadpisuje nowego, zasoby są zwalniane, a wynik ma stabilne typy oraz dostępny tekst.

#### Poza zakresem pierwszej wersji

Generowanie palet harmonii, ocena WCAG całej palety, edycja obrazu i analiza wideo.

## 14. Etap 5 — współpraca i historia zmian

Komponenty tego etapu prezentują dane współpracy oraz emitują intencje. Nie implementują transportu WebSocket, API, persistence ani autoryzacji.

### MentionInput

- Status: TODO
- Priorytet: P1
- Złożoność: L
- Kategoria: Form / Collaboration
- Zależności: `FormTextarea` lub `FormInput`, `PopoverOverlayer`, `VirtualList`, `SpinnerLoader`
- Potencjalne komponenty pomocnicze: `MentionSuggestionList`, token parser, provider adapter, selection/caret utility
- Czy wymaga zewnętrznej biblioteki: Preferowane Nie; złożony rich-text/contenteditable wymaga osobnego RFC
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — pole, popover, listę i stany

#### Cel

Wprowadzanie tekstu ze strukturalnymi wzmiankami uruchamianymi przez różne prefiksy i providerów sugestii.

#### Główne zastosowania

Komentarze, opisy z `@użytkownik`, `#projekt`, `/komenda` i opcjonalnie `:emoji`.

#### Oczekiwane działanie

Parser wykrywa aktywny token przy caret, wybiera provider, emituje query i pokazuje najnowsze wyniki. Wybór zastępuje wyłącznie aktywny zakres tokenu i przesuwa caret. Model ma jawny format: tekst z tokenami i/lub równoległą strukturę mentions; kopiowanie/paste i edycja przed tokenem nie mogą niszczyć serializacji.

#### Główne funkcjonalności

Wiele triggerów/providerów, async results, keyboard, loading/empty, custom suggestion, serialization, controlled value/query, max results i disabled items.

#### Warianty

`single-line | multiline`, `plain-token | structured`, providers user/project/command/emoji.

#### Stany komponentu

Idle, trigger detected, searching, results/no results, active suggestion, inserting, provider error, disabled/readonly/error field.

#### Proponowane API

Propsy: `value`, `mentions`, `providers`, `suggestions`, `loading`, `open`, `serialize`, `parse`, `minQueryLength`, `debounce`, `maxResults`, `multiline`, `label`, `description`, `error`, `disabled`, `readonly`, `dataTestId`. Provider: `id`, `trigger`, `search`, `getKey`, `getLabel`, `serialize`.

#### Proponowane sloty

`suggestion`, `suggestion-icon`, `group`, `loading`, `empty`, `provider-error`, `token` (tylko jeśli bezpieczny renderer to umożliwia).

#### Proponowane eventy

`update:value`, `update:mentions`, `update:open`, `search`, `selectMention`, `removeMention`, `providerError`, `change`.

#### Obsługa v-model

`v-model:value`; opcjonalny `v-model:mentions` dla struktury tokenów i `v-model:open`. Kontrakt musi określić źródło prawdy i sposób reconciliacji, aby modele nie mogły się rozjechać.

#### Obsługa klawiatury

Strzałki poruszają sugestiami, Enter/Tab wybierają według konfiguracji, Escape zamyka, standardowa edycja tekstu pozostaje nienaruszona. IME/composition nie może uruchamiać przedwcześnie wyszukiwania ani wyboru.

#### Dostępność i ARIA

Pole jako combobox z listboxem `aria-activedescendant`, grupami i stanem loading. Sugestia ma pełną nazwę i typ. Wstawienie jest krótko ogłoszone; token musi być czytelny jako tekst, nie tylko chip. Instrukcja triggerów przez opis pola.

#### Responsywność

Popover kotwiczy się możliwie przy caret, ale mieści w viewport i może przejść pod pole. Klawiatura mobilna nie zasłania wyników; długie sugestie zawijają się.

#### Wymagane Storybook stories

Każdy provider, async race/loading/error, no results, keyboard/IME, structured serialization, paste/edit, custom renderer, multiline, mobile.

#### Zakres testów

Token boundaries/Unicode, caret replacement, provider selection, debounce/abort/race, serialization round-trip, IME, combobox ARIA, focus i controlled models.

#### Kryteria ukończenia

Serializacja ma round-trip bez utraty tekstu, starsze wyniki async nie nadpisują nowych, IME działa poprawnie, a wybór sugestii jest w pełni dostępny klawiaturą.

#### Poza zakresem pierwszej wersji

Pełny rich-text editor, wykonywanie slash commands, backend suggestions, emoji picker i collaborative cursors.

### CommentThread

- Status: TODO
- Priorytet: P2
- Złożoność: XL
- Kategoria: Collaboration / Data display
- Zależności: `MentionInput`, `Avatar`, `InlineEdit`, `ButtonAction`, `DropdownMenu`
- Potencjalne komponenty pomocnicze: `CommentItem`, `CommentComposer`, `ThreadActions`, `CommentAttachment`
- Czy wymaga zewnętrznej biblioteki: Nie
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — autor, composer, edycja, akcje i statusy

#### Cel

Prezentowanie i obsługa wątku komentarzy przypisanego do zewnętrznego obiektu bez komunikacji z API.

#### Główne zastosowania

Review dokumentu, komentarze do elementu, dyskusje projektowe i obsługa zgłoszeń.

#### Oczekiwane działanie

Komponent renderuje komentarz główny i odpowiedzi w kontrolowanej kolejności. Dodanie, edycja, usunięcie, resolve/reopen emitują intencje z draftem/ID; aplikacja aktualizuje `comments` i status pending/error. Uprawnienia przychodzą w modelu akcji, nie są wyliczane lokalnie.

#### Główne funkcjonalności

Root/replies, author/date, add/edit/delete, resolve/reopen, mentions, loading/error, readonly, pagination replies, pending per action i custom content.

#### Warianty

`default | compact`, `inline | panel`, composer always/collapsed, resolved visible/collapsed.

#### Stany komponentu

Loading, empty/new thread, open, resolved, reply composing, comment editing, action pending/error, readonly.

#### Proponowane API

Propsy: `thread`, `comments`, `resolved`, `draft`, `replyDraft`, `currentUser`, `permissions`, `pendingActions`, `loading`, `error`, `readonly`, `locale`, `dataTestId`.

#### Proponowane sloty

`header`, `comment`, `author`, `content`, `attachments`, `actions`, `composer`, `resolved`, `loading`, `error`, `empty`.

#### Proponowane eventy

`create`, `reply`, `edit`, `delete`, `resolve`, `reopen`, `loadMoreReplies`, `update:draft`, `update:replyDraft`, `retry`.

#### Obsługa v-model

Modele draftów; dane komentarzy i resolved są kontrolowane przez props/eventy intencji, bez optymistycznej mutacji w komponencie.

#### Obsługa klawiatury

Naturalna kolejność komentarzy i akcji; composer dziedziczy MentionInput. Ctrl/Cmd+Enter może wysłać, Escape anuluje edycję po potwierdzonej polityce. Menu akcji używa DropdownMenu.

#### Dostępność i ARIA

Wątek jako nazwany region/lista, odpowiedzi semantycznie zagnieżdżone tylko o jeden poziom lub opisane. Autor i time są dostępne, resolved ma tekstowy status. Pending/error powiązany z konkretną akcją; usunięcie przenosi focus w sensowne miejsce.

#### Responsywność

Akcje trafiają do menu, metadane zawijają się, odpowiedzi mają ograniczone wcięcie, attachments nie wychodzą poza panel, composer pozostaje dostępny przy klawiaturze mobilnej.

#### Wymagane Storybook stories

Empty/new, root+replies, resolved/reopen, edit/delete pending/error, readonly/permissions, mentions, pagination, long content/attachments, mobile.

#### Zakres testów

Order/nesting, wszystkie payloady intencji, pending bez mutacji, draft lifecycle, focus po delete/resolve, permissions visibility vs disabled, list/time/region semantics i mobile.

#### Kryteria ukończenia

Komponent nie wywołuje API, każda operacja ma kontrolowany pending/error, focus nie ginie po zmianie listy, a resolved/read-only są jednoznaczne dla AT.

#### Poza zakresem pierwszej wersji

Reakcje, live updates, WebSocket, moderation, rich text, upload i wersjonowanie komentarza.

### PresenceGroup

- Status: TODO
- Priorytet: P2
- Złożoność: M
- Kategoria: Collaboration / Data display
- Zależności: `Avatar`, `AvatarGroup`, `PopoverOverlayer`, `CounterBadge`
- Potencjalne komponenty pomocnicze: `PresenceItem`, status formatter
- Czy wymaga zewnętrznej biblioteki: Nie
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — AvatarGroup jako baza prezentacji

#### Cel

Pokazywanie osób obecnych w kontekście aplikacji oraz ich stanu aktywności, pisania lub edycji.

#### Główne zastosowania

Dokumenty współdzielone, pokoje, zadania, formularze i review.

#### Oczekiwane działanie

Komponent mapuje dostarczone presence records do AvatarGroup, ustala widoczny limit i pełną listę w popoverze. Aktualizacja danych zachowuje stabilność focusu/active item. Statusy są prezentacyjne; komponent nie określa timeoutu offline ani transportu.

#### Główne funkcjonalności

Active/inactive, editing/typing, user color token, max visible, overflow list, selected user i grouped status.

#### Warianty

`avatars | avatars-labels | list`, compact/detailed, overflow popover/inline.

#### Stany komponentu

Empty, users present, mixed statuses, overflow open, stale indicator opcjonalny, loading.

#### Proponowane API

Propsy: `users`, `maxVisible`, `selectedId`, `showInactive`, `loading`, `ariaLabel`, `dataTestId`; user: `id`, `name`, `avatar`, `status`, `activity`, `colorToken`, `lastSeen`, `metadata`.

#### Proponowane sloty

`avatar`, `status`, `user`, `overflow`, `empty`, `loading`.

#### Proponowane eventy

`select`, `overflowOpen`, `update:selectedId`.

#### Obsługa v-model

Opcjonalne `v-model:selectedId`; presence list jest kontrolowana z zewnątrz.

#### Obsługa klawiatury

Dziedziczy AvatarGroup; tylko selectable users są interaktywne. Escape zamyka popover, focus wraca do overflow.

#### Dostępność i ARIA

Etykieta grupy zawiera liczbę osób. Każdy status ma tekst „Anna — edytuje”, nie tylko kolor/animację. Zmiany typing nie są ogłaszane przy każdym keystroke; live updates podlegają throttle i opcji.

#### Responsywność

Limit widocznych i popover zachowują zasady AvatarGroup; szczegóły w liście zawijają się, lastSeen nie wypycha nazwy.

#### Wymagane Storybook stories

Empty, active/inactive, typing/editing, custom colors, overflow, dynamic updates, selected, loading, mobile.

#### Zakres testów

Mapping/counts/order, status labels, dynamic focus, overflow, selection, live announcement throttle/disabled, contrast color indicator i no transport.

#### Kryteria ukończenia

Statusy mają tekstowy odpowiednik, dynamiczne aktualizacje nie kradną focusu, limit jest poprawny, a komponent nie tworzy timerów obecności ani połączeń sieciowych.

#### Poza zakresem pierwszej wersji

WebSocket, heartbeat, presence store, cursors użytkowników i rozstrzyganie konfliktów.

### VersionHistory

- Status: TODO
- Priorytet: P2
- Złożoność: L
- Kategoria: Collaboration / Data display
- Zależności: `ActivityTimeline`, `DiffViewer`, `DrawerPanel`, `ButtonAction`
- Potencjalne komponenty pomocnicze: `VersionItem`, `VersionPreview`
- Czy wymaga zewnętrznej biblioteki: Nie
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — timeline/lista, diff, drawer i akcje

#### Cel

Panel wyboru, podglądu i emitowania akcji przywrócenia historycznej wersji.

#### Główne zastosowania

Dokumenty, konfiguracje, projekty, formularze i zasoby wersjonowane.

#### Oczekiwane działanie

Lista wskazuje current i selected version niezależnie. Wybór emituje żądanie podglądu; treść preview jest przekazana/ładowana przez konsumenta. Restore wymaga jawnej akcji i stanu pending, nie zmienia current samodzielnie. Ważne wersje można oznaczać eventem.

#### Główne funkcjonalności

List, author/date/description, current/selected, preview, restore, mark important, filter, loading/empty/error i pagination.

#### Warianty

`panel | drawer | page`, compact/detailed, preview `side | below | external`.

#### Stany komponentu

Initial loading, empty, loaded, selected loading/ready/error, restore pending/error, current selected, filter no results.

#### Proponowane API

Propsy: `versions`, `currentId`, `selectedId`, `preview`, `filters`, `loading`, `previewLoading`, `restorePending`, `error`, `hasMore`, `locale`, `ariaLabel`, `dataTestId`.

#### Proponowane sloty

`version`, `author`, `preview`, `actions`, `filters`, `empty`, `loading`, `error`.

#### Proponowane eventy

`update:selectedId`, `select`, `restore`, `markImportant`, `filterChange`, `loadMore`, `retryPreview`.

#### Obsługa v-model

`v-model:selectedId`; current pozostaje domenowym propem readonly.

#### Obsługa klawiatury

Lista wersji jako listbox lub lista przycisków ze strzałkami/Tab zgodnie z wybranym wzorcem. Restore i mark są odrębnymi akcjami; Escape zamyka DrawerPanel.

#### Dostępność i ARIA

Current oznaczony `aria-current`, selected przez selection. Data i autor są dostępne; preview ma named region i loading/error. Restore ma nazwę wersji i potencjalnie wymaga zewnętrznego potwierdzenia.

#### Responsywność

Side preview przechodzi below lub osobny ekran; lista ma scroll, nagłówek/akcje nie obcinają się, długie opisy zawijają.

#### Wymagane Storybook stories

Current/selected różne, preview DiffViewer/custom, loading/error, restore pending, important, filter/no results, pagination, drawer/mobile.

#### Zakres testów

Selection/current independence, event payload, async preview race, restore no mutation, filter, focus po aktualizacji, aria-current/region i responsive mode.

#### Kryteria ukończenia

Wybór nie zmienia current, starszy preview nie nadpisuje nowszego, restore jest intencją z pending, a current/selected są jednoznaczne wizualnie i dostępnie.

#### Poza zakresem pierwszej wersji

Przechowywanie wersji, tworzenie snapshotów, automatyczny diff, merge i potwierdzenie biznesowe wewnątrz komponentu.

### ReviewChanges

- Status: TODO
- Priorytet: P2
- Złożoność: L
- Kategoria: Collaboration / Data display
- Zależności: `DiffViewer`, `ContextActionBar`, `FormCheckbox`, `TagChip`
- Potencjalne komponenty pomocnicze: `ChangeItem`, `ChangeFilters`, neutralny model zmiany
- Czy wymaga zewnętrznej biblioteki: Nie poza decyzją algorytmu DiffViewer
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — diff, bulk actions, filtry i statusy

#### Cel

Przeglądanie, filtrowanie i emitowanie decyzji akceptacji/odrzucenia pojedynczych lub wszystkich zmian.

#### Główne zastosowania

Review dokumentów, import danych, sugestie zmian i procesy zatwierdzania.

#### Oczekiwane działanie

Komponent renderuje neutralne change records według typu, pokazuje szczegóły/diff i kontrolowany status decyzji. Accept/reject emitują intencję i pending; bulk działa na widocznym albo całym zbiorze według jawnego scope. Readonly nie pokazuje aktywnych kontrolek.

#### Główne funkcjonalności

Added/removed/modified, accept/reject one/all, filters, counts, selection, readonly, pending/error, DiffViewer integration i grouped changes.

#### Warianty

`list | split`, compact/detailed, bulk scope `all | filtered | selected`.

#### Stany komponentu

Loading, empty, pending review, partially reviewed, all decided, action pending/error, filter no results, readonly.

#### Proponowane API

Propsy: `changes`, `selectedId`, `filters`, `decisions`, `pendingIds`, `bulkPending`, `bulkScope`, `readonly`, `loading`, `error`, `ariaLabel`, `dataTestId`. Change: `id`, `type`, `label`, `before`, `after`, `path`, `metadata`.

#### Proponowane sloty

`change`, `details`, `diff`, `actions`, `filters`, `summary`, `empty`, `loading`, `error`.

#### Proponowane eventy

`update:selectedId`, `select`, `accept`, `reject`, `acceptAll`, `rejectAll`, `filterChange`, `retry`.

#### Obsługa v-model

`v-model:selectedId`; decyzje są kontrolowanym propem aktualizowanym przez aplikację po eventach.

#### Obsługa klawiatury

Lista selection ze strzałkami lub przyciskami; akcje accept/reject są fokusowalne i mają skróty tylko po focusie/konfiguracji. Bulk bar dziedziczy ContextActionBar.

#### Dostępność i ARIA

Typ i decyzja są tekstowe; selected/current detail powiązane. Każda akcja zawiera nazwę zmiany, pending przez aria-busy/status, a DiffViewer zapewnia niedyskryminację kolorem.

#### Responsywność

Split przechodzi stacked, akcje do ContextActionBar/overflow, diff do unified, filtry zwijają się bez utraty dostępności.

#### Wymagane Storybook stories

Wszystkie typy, mixed decisions, accept/reject pending/error, bulk scopes, filters/counts, DiffViewer, readonly, empty/loading, mobile.

#### Zakres testów

Counts/filters/scope, event payload bez mutacji, pending concurrency, selected missing, diff integration, focus po decyzji, text states i responsive.

#### Kryteria ukończenia

Zakres bulk jest zawsze widoczny i jednoznaczny, decyzje nie są zmieniane przed aktualizacją propsów, każda zmiana ma dostępny typ/status, a readonly usuwa pozorne akcje.

#### Poza zakresem pierwszej wersji

Generowanie zmian, merge konfliktów, komentarze inline, permissions i zapis decyzji do API.

## 15. Etap 6 — zaawansowane komponenty biznesowe

Etap obejmuje złożone systemy UI. Każdy komponent XL jest implementowany wyłącznie kamieniami milowymi, z neutralnym modelem danych i bez narzucania backendu.

### QueryBuilder

- Status: TODO
- Priorytet: P1
- Złożoność: XL
- Kategoria: Business / Form
- Zależności: `FormSelect`, `FormInput`, `FormNumber`, `FormDatePicker`, `ButtonAction`, `DisclosurePanel`
- Potencjalne komponenty pomocnicze: `QueryGroup`, `QueryRule`, `FieldSelector`, `OperatorSelector`, `ValueEditor`, schema/validation utilities
- Czy wymaga zewnętrznej biblioteki: Nie dla neutralnego modelu; drag-and-drop jest opcjonalne i wymaga analizy
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — edytory wartości i przyciski

#### Cel

Wizualne budowanie zagnieżdżonych reguł filtrowania w neutralnym, walidowalnym modelu JSON.

#### Główne zastosowania

Zaawansowane filtry, segmenty, raporty, reguły widoczności i wyszukiwanie biznesowe.

#### Oczekiwane działanie

Użytkownik dodaje regułę/grupę, wybiera pole, operator zgodny z typem i odpowiedni edytor wartości. Zmiana pola/operatora stosuje jawną politykę zachowania/resetu wartości. Grupy łączą dzieci AND/OR, mają kontrolowaną głębokość i walidację. Reorder ma przyciski góra/dół nawet jeśli dodano drag.

#### Główne funkcjonalności

Rules/groups/nesting, AND/OR, typed fields/operators/editors, add/remove/duplicate/reorder, validation, readonly, neutral JSON i adaptery serializacji później.

#### Warianty

`builder | compact`, layout horizontal/vertical per breakpoint, reorder buttons/optional drag, auto/manual validation.

#### Stany komponentu

Empty root, editing, valid/invalid rule/group, max depth/rules reached, readonly, disabled, loading schema, global error.

#### Proponowane API

Propsy: `value`, `fields`, `operators`, `getOperators`, `editors`, `maxDepth`, `maxRules`, `allowGroups`, `allowEmpty`, `validate`, `errors`, `readonly`, `disabled`, `loading`, `ariaLabel`, `dataTestId`. Model: `QueryGroupNode { id, combinator, children }` i `QueryRuleNode { id, field, operator, value }`.

#### Proponowane sloty

`group`, `rule`, `field-editor`, `operator-editor`, `value-editor`, `actions`, `empty`, `error`, `summary`.

#### Proponowane eventy

`update:value`, `change`, `addRule`, `addGroup`, `remove`, `duplicate`, `move`, `validationChange`, `limitReached`.

#### Obsługa v-model

`v-model:value` jako immutable neutralny AST/JSON; komponent generuje stabilne ID według wstrzykiwalnej funkcji, a kontrolowany konsument może je dostarczyć.

#### Obsługa klawiatury

Naturalne formularze i przyciski; grupy mają nawigowalne nagłówki. Reorder przez jawne przyciski oraz opcjonalne skróty po focusie. Escape nie usuwa draftu bez polityki; focus po add trafia do pierwszego pola nowej reguły, po remove do logicznego sąsiada.

#### Dostępność i ARIA

Zagnieżdżone grupy jako fieldset/legend lub tree z opisem kombinatora. Każdy select/editor ma unikalną etykietę zawierającą numer/ścieżkę reguły. Błędy są powiązane z konkretnym polem; AND/OR nie jest przekazywane samym symbolem.

#### Responsywność

Wiersz reguły przechodzi w grid/stack, wcięcia mają limit i dodatkowy opis poziomu, akcje trafiają do menu, bez poziomego overflow całej strony.

#### Wymagane Storybook stories

Empty, pojedyncza reguła, nested AND/OR, każdy typ pola/operatora, invalid, duplicate/reorder, max limits, readonly/disabled, custom editor, mobile.

#### Zakres testów

Immutable CRUD/tree paths, operator compatibility, reset policy, validation aggregation, limits/cycles/duplicate IDs, focus po zmianach, group semantics, serialization round-trip i responsive.

#### Kamień milowy 1 — neutralny model i pojedyncze reguły

Zdefiniować typy pola/operatora/reguły, podstawowe editory i walidację. Kryterium: wszystkie typy danych tworzą stabilny JSON i przechodzą round-trip bez grup.

#### Kamień milowy 2 — grupy i kombinatory

Dodać AND/OR, nesting, max depth oraz accessible fieldsets. Kryterium: immutable add/remove/duplicate zachowuje ID, a błędy agregują się do grup.

#### Kamień milowy 3 — rozszerzalne operatory i editory

Dodać registry custom editor/operator i zależności od pola. Kryterium: aplikacja może wstrzyknąć nowy typ bez modyfikacji root komponentu, z pełnym typowaniem.

#### Kamień milowy 4 — reorder, responsywność i dostępność

Dodać przyciski zmiany kolejności, opcjonalny drag adapter i mobile layout. Kryterium: wszystkie reorder działają bez pointera, focus jest stabilny i axe/keyboard/mobile testy przechodzą.

#### Kamień milowy 5 — stabilizacja API i adaptery

Zamrozić model neutralny, eksport typów i dokumentację; opisać przyszłe adaptery REST, GraphQL, Prisma, SQL, Elasticsearch poza core. Kryterium: core nie generuje SQL, framework parity i pełny check/build przechodzą.

#### Kryteria ukończenia

Model nie jest związany z backendem, każda operacja jest immutable i dostępna bez drag, walidacja wskazuje dokładne pola, custom editory są typowane, a wszystkie kamienie milowe zamknięte.

#### Poza zakresem pierwszej wersji

Bezpośrednie generowanie SQL/GraphQL/Prisma/Elasticsearch, wykonanie zapytania, pobieranie pól i dowolny parser języka tekstowego.

### PermissionMatrix

- Status: TODO
- Priorytet: P1
- Złożoność: XL
- Kategoria: Business / Data entry
- Zależności: `FormCheckbox`, `TableList` lub wspólne prymitywy tabeli, `SearchInput`, `DisclosurePanel`
- Potencjalne komponenty pomocnicze: `PermissionCell`, `PermissionHeader`, `PermissionSummary`, dependency evaluator
- Czy wymaga zewnętrznej biblioteki: Nie
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — checkboxy, tabela, wyszukiwanie i grupy

#### Cel

Edycja macierzy uprawnień role/użytkownicy × zasoby z obsługą dziedziczenia i zależności.

#### Główne zastosowania

Administracja rolami, ACL, dostęp do modułów, polityki i konfiguracja zespołów.

#### Oczekiwane działanie

Każda komórka pokazuje effective i explicit value osobno. Bulk row/column oblicza nowy kontrolowany model i stan indeterminate, pomijając disabled. Dziedziczenie i zależności są dostarczane jako dane/reguły; konflikt jest komunikowany przed emisją lub eventem validation.

#### Główne funkcjonalności

Rows resources, columns principals/permissions, cell toggle, row/column all, indeterminate, disabled, inheritance, dependencies, filter/group, readonly i change summary.

#### Warianty

`roles-as-columns | permissions-as-columns`, density, sticky headers/first column, explicit/effective view.

#### Stany komponentu

Loading, empty, editable, readonly, cell checked/unchecked/indeterminate/inherited/disabled/conflict, bulk pending, filtered.

#### Proponowane API

Propsy: `resources`, `columns`, `value`, `effectiveValue`, `disabledCells`, `dependencies`, `groups`, `query`, `readonly`, `loading`, `errors`, `sticky`, `ariaLabel`, `dataTestId`. Klucz komórki musi być stabilnym tuple, nie konkatenacją podatną na kolizje.

#### Proponowane sloty

`resource`, `column-header`, `cell`, `cell-hint`, `group`, `summary`, `empty`, `loading`, `error`.

#### Proponowane eventy

`update:value`, `cellChange`, `rowChange`, `columnChange`, `validationChange`, `filterChange`, `conflict`.

#### Obsługa v-model

`v-model:value` jako neutralna mapa/set jawnych przydziałów; effective value jest readonly propem.

#### Obsługa klawiatury

Wzorzec grid: strzałki między komórkami, Home/End, Ctrl+Home/End, Spacja toggle, nagłówki bulk dostępne. Tab wchodzi/wychodzi według APG grid, a tryb uproszczony może użyć tabeli z checkboxami w normalnym Tab order.

#### Dostępność i ARIA

Tabela/grid z nagłówkami wierszy i kolumn powiązanymi z każdą komórką. Checkbox ma nazwę „Edytuj dla Rola Administrator — Zasób Faktury”. Inherited/disabled/conflict mają tekst i opis. Sticky nie zmienia kolejności DOM.

#### Responsywność

Wewnętrzny dwuwymiarowy scroll ze sticky headers, dostępny komunikat o przewijaniu; na mobile opcjonalny widok per resource/column, nie ukrywanie uprawnień.

#### Wymagane Storybook stories

Mała/duża macierz, bulk row/column, indeterminate, inherited, dependencies/conflict, disabled, filters/groups, readonly, sticky scroll, mobile alternate.

#### Zakres testów

Cell keys, bulk z disabled, indeterminate/effective, dependency rules bez mutacji, filters, grid headers/keyboard, focus po rerender, virtualization feasibility i change summary.

#### Kryteria ukończenia

Explicit i effective nie są mylone, bulk nigdy nie zmienia disabled, każda komórka ma pełną nazwę, wszystkie operacje są kontrolowane i macierz jest używalna klawiaturą oraz na mobile.

#### Poza zakresem pierwszej wersji

Silnik autoryzacji, zapis do API, ewaluacja polityk backendowych i automatyczne rozstrzyganie konfliktów.

### FormulaBuilder

- Status: TODO
- Priorytet: P2
- Złożoność: XL
- Kategoria: Business / Form
- Zależności: `FormInput`, `DropdownMenu`, `MessageText`, `KeyboardKey`
- Potencjalne komponenty pomocnicze: tokenizer, parser, AST types, `FormulaToken`, `SuggestionList`, diagnostics panel
- Czy wymaga zewnętrznej biblioteki: Możliwe dla parsera; gramatyka, licencja i bezpieczeństwo wymagają RFC
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — pole, sugestie/menu, błędy i skróty

#### Cel

Bezpieczne budowanie i walidowanie formuł w neutralnym AST bez wykonywania niezaufanego kodu.

#### Główne zastosowania

Pola obliczeniowe, reguły biznesowe, raporty i konfiguratory.

#### Oczekiwane działanie

Użytkownik wpisuje lub wybiera pola, literały, operatory, nawiasy i funkcje. Tokenizer/parser tworzy AST i diagnostics z zakresami tekstu. Preview wyniku pochodzi z bezpiecznego, wstrzykniętego evaluator callbacka albo kontrolowanego propa; core nigdy nie używa `eval`/`Function`.

#### Główne funkcjonalności

Fields, numbers, strings, math/logical operators, parentheses, functions, autocomplete, syntax validation, diagnostics, result preview, text↔AST serialization i readonly.

#### Warianty

`text | tokenized | hybrid`, single/multiline, compact/full with diagnostics.

#### Stany komponentu

Empty, editing, suggesting, parsing, valid, warning, invalid, preview loading/success/error, readonly, disabled.

#### Proponowane API

Propsy: `value`, `ast`, `fields`, `functions`, `operators`, `suggestions`, `diagnostics`, `parse`, `serialize`, `evaluate`, `preview`, `loading`, `readonly`, `disabled`, `ariaLabel`, `dataTestId`.

#### Proponowane sloty

`token`, `suggestion`, `diagnostic`, `preview`, `toolbar`, `empty`, `loading`.

#### Proponowane eventy

`update:value`, `update:ast`, `change`, `parse`, `validityChange`, `diagnosticSelect`, `previewRequest`, `previewResult`, `previewError`.

#### Obsługa v-model

Preferowane `v-model:value` tekstu oraz emitowane/controlled `ast`; kontrakt wyznacza źródło prawdy i gwarantuje round-trip dla poprawnej formuły.

#### Obsługa klawiatury

Standardowa edycja tekstu/IME, strzałki/Enter/Escape w sugestiach, skróty do wstawiania tylko po focusie. Diagnostics list umożliwia przejście do zakresu. Tokenized mode musi pozwalać Backspace/Delete, selekcję i ruch caret bez pułapek.

#### Dostępność i ARIA

Pole z instrukcją składni, combobox sugestii, lista diagnostyk powiązana z zakresem, `aria-invalid` dopiero po odpowiedniej walidacji. Tokeny mają czytelny tekst i typ, nie tylko kolor. Preview ma nazwany region i status async.

#### Responsywność

Edytor przewija się wewnętrznie bez ukrywania caret, toolbar overflow, diagnostics przechodzą pod edytor, długie formuły mają wrap lub jawny horizontal scroll.

#### Wymagane Storybook stories

Każdy typ tokenu, autocomplete, valid/invalid/warnings, nested functions, AST round-trip, preview sync/async/error, readonly, long formula, keyboard/IME, mobile.

#### Zakres testów

Tokenizer/parser precedence/Unicode/escaping, AST serialize round-trip, diagnostics ranges, suggestion context, no eval CSP test, async preview race, keyboard/ARIA i large expression performance.

#### Kamień milowy 1 — gramatyka, tokeny i AST

Zdefiniować ograniczoną gramatykę, typy AST i parser/serializer. Kryterium: zestaw golden tests obejmuje precedence, nawiasy, escaping i round-trip bez `eval`.

#### Kamień milowy 2 — edytor tekstowy i diagnostyka

Dodać controlled input, walidację i listę błędów z zakresami. Kryterium: wybór diagnostyki ustawia caret w poprawnym miejscu, a błędy są dostępne dla AT.

#### Kamień milowy 3 — podpowiedzi i rejestry

Dodać pola/funkcje/operatory z typowanym registry i kontekstowym autocomplete. Kryterium: custom function działa bez zmiany core, a suggestion keyboard/IME przechodzi testy.

#### Kamień milowy 4 — bezpieczny preview i tryb hybrydowy

Dodać wstrzyknięty evaluator/preview oraz opcjonalną prezentację tokenów. Kryterium: core nie wykonuje kodu, async jest anulowalne, a tekst i AST nie rozjeżdżają się.

#### Kamień milowy 5 — stabilizacja API

Zamrozić schema AST/versioning, eksporty, framework parity, docs i limity złożoności. Kryterium: migracja schema jest opisana, CSP tests i pełny check/build przechodzą.

#### Kryteria ukończenia

Nie ma `eval` ani równoważnego wykonania kodu, AST ma stabilny schema, parser/serializer mają round-trip, diagnostyka i sugestie są dostępne, a wszystkie kamienie milowe ukończone.

#### Poza zakresem pierwszej wersji

Pełny język programowania, wykonywanie dowolnego JS, zapytania do backendu, debuger i automatyczna optymalizacja formuł.

### FormWizard

- Status: TODO
- Priorytet: P1
- Złożoność: XL
- Kategoria: Business / Form / Navigation
- Zależności: `NavigationStepper`, `FormContainer`, `ButtonAction`, `MessageText`
- Potencjalne komponenty pomocnicze: `WizardStep`, `WizardNavigation`, `WizardSummary`, validation adapter
- Czy wymaga zewnętrznej biblioteki: Nie; VeeValidate integration przez adapter, bez bezpośredniego uzależnienia core
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — stepper, form wrapper, przyciski i błędy

#### Cel

Orkiestracja wieloetapowego formularza z walidacją, krokami warunkowymi i kontrolowanym stanem.

#### Główne zastosowania

Onboarding, wnioski, konfiguratory, checkout i złożone procesy danych.

#### Oczekiwane działanie

Wizard otrzymuje definicję kroków i aktywny ID. Next wywołuje/emituję walidację bieżącego kroku, oczekuje na wynik i przechodzi tylko po sukcesie. Kroki ukryte/warunkowe są pomijane deterministycznie. Draft save/restore i before-leave są eventami/hookami aplikacji. Back nie usuwa danych.

#### Główne funkcjonalności

Steps, per-step validation async, optional/conditional, blocking, back, draft event, restore state, summary, error list, leave warning hook, orientations i NavigationStepper.

#### Warianty

`linear | non-linear`, `horizontal | vertical`, `page | card`, summary step/custom.

#### Stany komponentu

Initial, active, validating, step invalid, saving draft, draft error, completed, blocked, restoring, leaving confirmation external.

#### Proponowane API

Propsy: `steps`, `activeStep`, `visitedSteps`, `completedSteps`, `errors`, `linear`, `allowBack`, `loading`, `saving`, `restoring`, `orientation`, `validateStep`, `canEnter`, `canLeave`, `ariaLabel`, `dataTestId`. Step: `id`, `label`, `description`, `optional`, `visible`, `disabled`, `metadata`.

#### Proponowane sloty

`step`, nazwane sloty per ID lub scoped renderer, `navigation`, `summary`, `errors`, `header`, `footer`, `loading`.

#### Proponowane eventy

`update:activeStep`, `next`, `back`, `goTo`, `validationStart`, `validationResult`, `saveDraft`, `restore`, `complete`, `leaveRequest`.

#### Obsługa v-model

`v-model:activeStep`; wartości pól pozostają w formularzach aplikacji, nie w nieprzezroczystym store komponentu.

#### Obsługa klawiatury

Stepper dziedziczy zachowanie NavigationStepper, ale Enter w polu nie przechodzi automatycznie dalej. Przy zmianie kroku focus trafia do nagłówka lub pierwszego błędu według wyniku. Nawigacja jest zwykłymi przyciskami.

#### Dostępność i ARIA

Aktualny krok `aria-current=step`, region kroku z nagłówkiem, lista błędów linkuje do pól. Walidacja async używa aria-busy/status. Ukryte warunkowe kroki nie pozostają w tab order; zmiana kroku ma kontrolowane ogłoszenie.

#### Responsywność

Horizontal stepper przechodzi vertical/scroll zgodnie z NavigationStepper, navigation sticky nie zasłania błędów, długie formularze zachowują scroll/focus.

#### Wymagane Storybook stories

Linear/non-linear, optional/conditional, validation sync/async, blocked, back, draft events, restore, summary/error list, vertical/mobile, VeeValidate adapter example bez zależności core.

#### Zakres testów

Visible step sequence, async validation race, active missing, visited/completed, focus after success/error, event order, no field storage, stepper ARIA, leave request i mobile.

#### Kryteria ukończenia

Nie da się ominąć wymaganej walidacji, warunkowe kroki mają deterministyczną kolejność, focus trafia we właściwe miejsce, core nie zależy od VeeValidate i nie przechowuje danych biznesowych.

#### Poza zakresem pierwszej wersji

Router integration, persistence, automatyczny autosave, generator formularzy i modal potwierdzenia opuszczenia tworzony wewnątrz.

### FileExplorer

- Status: TODO
- Priorytet: P1
- Złożoność: XL
- Kategoria: Business / Navigation / Data display
- Zależności: `TreeList`, `ContextMenu`, `InlineEdit`, `VirtualList`, `SvgIcon`, `SpinnerLoader`
- Potencjalne komponenty pomocnicze: `FileTree`, `FileList`, `FileNode`, `FileSelection`, drag adapter
- Czy wymaga zewnętrznej biblioteki: Nie w v1; złożony drag może wymagać późniejszej analizy
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — drzewo, menu, rename, wirtualizacja, ikony i loading

#### Cel

Eksplorowanie kontrolowanej hierarchii plików/folderów w widoku drzewa i opcjonalnej listy.

#### Główne zastosowania

Repozytoria dokumentów, assety, projekty, załączniki i struktury katalogowe.

#### Oczekiwane działanie

Expand foldera emituje toggle i może request children; loading jest per node. Selection single/multi zachowuje anchor/range. Rename używa InlineEdit i emituje intencję z pending/error. ContextMenu działa również z klawiatury. Drag-and-drop, jeśli później dodany, nie zastępuje move actions.

#### Główne funkcjonalności

Folders/files, expand, single/multi selection, inline rename, context menu, optional drag, keyboard alternative, type icons, lazy loading, search, tree/list view i controlled sort.

#### Warianty

`tree | list | split`, selection single/multiple, density, root visible/hidden.

#### Stany komponentu

Empty, root loading, branch loading/error, selected/focused, renaming/pending/error, search/no results, readonly, drag optional.

#### Proponowane API

Propsy: `nodes`, `rootIds`, `expandedIds`, `selectedIds`, `activeId`, `view`, `query`, `loadingIds`, `errorIds`, `renamingId`, `readonly`, `permissions`, `itemKey`, `getChildren`, `ariaLabel`, `dataTestId`. Node: `id`, `parentId`, `name`, `type`, `hasChildren`, `childrenIds`, `icon`, `metadata`.

#### Proponowane sloty

`node`, `icon`, `actions`, `context-menu`, `rename`, `list-header`, `empty`, `loading`, `error`.

#### Proponowane eventy

`update:expandedIds`, `update:selectedIds`, `update:activeId`, `select`, `toggle`, `loadChildren`, `rename`, `move`, `action`, `search`, `viewChange`, `retry`.

#### Obsługa v-model

Modele expanded/selected/active; dane nodes są immutable. `view`/`query` mogą mieć nazwane modele.

#### Obsługa klawiatury

Tree APG: strzałki, Home/End, typeahead, Enter activate, Spacja select, F2 rename, Shift+F10 context menu, Escape cancel rename. Multi-select ma udokumentowany modifier model. Move ma przyciski/dialog wyboru celu jako alternatywę drag.

#### Dostępność i ARIA

`tree/treeitem/group` albo semantyczna tabela/lista; folder `aria-expanded`, loading/błąd powiązany z węzłem. Typ pliku ma tekst, nie tylko ikonę. Selection i focus są rozróżnione. Nazwy context actions zawierają plik.

#### Responsywność

Split przechodzi w jeden widok, nazwy ellipsis z pełną nazwą dostępną, akcje overflow, długie ścieżki nie poszerzają strony, virtual scroll utrzymuje focus.

#### Wymagane Storybook stories

Tree/list/split, lazy branch, error/retry, single/multi/range, rename pending/error, context keyboard, search reveal, permissions/readonly, 10k nodes virtual, mobile.

#### Zakres testów

Tree normalization/cycles/orphans, expand/lazy race, selection modifiers/range, rename focus/draft, context menu, search paths, virtual focus, ARIA tree i no mutation.

#### Kryteria ukończenia

Lazy wynik nie trafia do złego węzła, selection/focus są stabilne, rename i każda context action działają klawiaturą, a komponent nie wykonuje operacji plikowych ani API.

#### Poza zakresem pierwszej wersji

Drag-and-drop przenoszący dane, upload/download manager, filesystem API, podgląd pliku i synchronizacja serwera.

### ResizableWorkspace

- Status: TODO
- Priorytet: P2
- Złożoność: XL
- Kategoria: Business / Layout
- Zależności: `FullscreenContainer`, `ButtonAction`, `KeyboardKey`
- Potencjalne komponenty pomocnicze: `WorkspaceRoot`, `WorkspaceGroup`, `WorkspacePanel`, `WorkspaceResizeHandle`, `WorkspaceToolbar`
- Czy wymaga zewnętrznej biblioteki: Preferowane Nie; istniejąca biblioteka paneli wymaga RFC pod kątem nested layout, SSR, licencji i a11y
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — fullscreen, przyciski i prezentację skrótów

#### Cel

Komponowalny układ zagnieżdżonych, skalowalnych paneli podobny do IDE, zapisujący neutralny model layoutu.

#### Główne zastosowania

Edytory, konsole administracyjne, data workbench, dashboard builders i złożone narzędzia.

#### Oczekiwane działanie

Grupa dzieli dostępną przestrzeń według rozmiarów i ograniczeń. Handle zmienia sąsiednie panele pointerem i klawiaturą; clamp uwzględnia min/max. Collapse/expand/fullscreen/reset emitują nowy layout. Nested groups nie tworzą nieskończonej rekurencji ani ujemnych rozmiarów.

#### Główne funkcjonalności

Horizontal/vertical groups, nesting, resize, min/max, collapse/expand, reset, save/restore serialized layout, panel fullscreen i keyboard handles.

#### Warianty

Orientacje per grupa, handles visible/subtle, panels collapsible/fixed/resizable.

#### Stany komponentu

Initial, resizing pointer/keyboard, panel collapsed, constrained, fullscreen, restoring invalid layout, disabled handle.

#### Proponowane API

Rodzina komponentów i typy: Root `layout`, `defaultLayout`, `onLayout`; Group `id`, `orientation`; Panel `id`, `size`, `minSize`, `maxSize`, `collapsible`, `collapsedSize`; Handle `disabled`, `step`, `ariaLabel`. Ref: reset/focusPanel/resizePanel.

#### Proponowane sloty

`default` kompozycyjny, panel `header`, `toolbar`, `content`, `collapsed`, root `controls`.

#### Proponowane eventy

`update:layout`, `resizeStart`, `resize`, `resizeEnd`, `collapse`, `expand`, `fullscreenChange`, `reset`, `invalidLayout`.

#### Obsługa v-model

`v-model:layout` jako wersjonowalny neutralny model; częste resize events mogą mieć preview, a commit na końcu.

#### Obsługa klawiatury

Handle `role=separator` fokusowalny: strzałki o step, Shift większy, Home/End do min/max, Enter collapse/expand jeśli dozwolone. Toolbar i fullscreen standardowe; focus po collapse przenosi się poza ukryty panel.

#### Dostępność i ARIA

Separator ma `aria-orientation`, `aria-valuemin/max/now`, nazwę obu paneli. Panele są nazwanymi regionami tylko gdy ma to sens. Collapsed content jest usunięty z tab order, fullscreen zarządza focus jak FullscreenContainer.

#### Responsywność

Polityka breakpoint layoutu jest dostarczona/controlled, nie arbitralna; min sizes mogą wymusić collapse/overflow według jawnej strategii. Touch handle ma większy hit area niż linia wizualna.

#### Wymagane Storybook stories

Horizontal/vertical, nested, min/max clamp, collapse, keyboard resize, save/restore/reset, fullscreen, invalid layout, mobile strategy.

#### Zakres testów

Layout solver/suma/procenty/pixels, min/max conflicts, pointer capture, keyboard separator, nested updates, serialization/versioning, focus collapse/fullscreen, ResizeObserver i SSR.

#### Kamień milowy 1 — pojedyncza grupa i solver

Root/Group/Panel/Handle dla dwóch+ paneli, neutralny model i min/max. Kryterium: solver nigdy nie generuje NaN/ujemnych rozmiarów i suma odpowiada kontenerowi z tolerancją.

#### Kamień milowy 2 — pointer i klawiatura

Dodać resize drag oraz separator APG. Kryterium: pointer i klawiatura przestrzegają tych samych clampów, event commit jest jeden, focus ring widoczny.

#### Kamień milowy 3 — zagnieżdżenie, collapse i fullscreen

Dodać nested groups, collapse/expand i panel fullscreen. Kryterium: ukryty panel znika z tab order, restore rozmiaru jest deterministyczny, a nested layout nie pętli.

#### Kamień milowy 4 — persistence i responsywność

Dodać schema/version, reset/restore i jawne strategie breakpoint. Kryterium: invalid/stary layout ma bezpieczny fallback, mobile nie traci panelu ani treści.

#### Kamień milowy 5 — stabilizacja rodziny API

Zweryfikować provide/inject, sloty, ref API, target parity i docs. Kryterium: rodzina działa w Vue/React/WC w naturalny sposób, eksport typów i pełny check/build przechodzą.

#### Kryteria ukończenia

Solver jest stabilny, wszystkie resize działają bez myszy, layout ma wersjonowalną serializację, collapse/fullscreen zarządzają focusem i wszystkie kamienie milowe są ukończone.

#### Poza zakresem pierwszej wersji

Docking/undocking okien, zakładki dokumentów, wielomonitorowość, drag paneli i persistence do storage wykonywane automatycznie.

### DashboardGrid

- Status: TODO
- Priorytet: P2
- Złożoność: XL
- Kategoria: Business / Layout
- Zależności: `GridItem`, `GridSection`, opcjonalne prymitywy `ResizableWorkspace`, `ButtonAction`
- Potencjalne komponenty pomocnicze: `DashboardWidget`, `DashboardPlaceholder`, grid collision/compaction solver, accessible move controls
- Czy wymaga zewnętrznej biblioteki: Możliwe dla drag/resize; wymaga RFC, keyboard parity i serializowalnego layoutu
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — grid, elementy, przyciski i wzorce resize

#### Cel

Edytowalna, responsywna siatka widgetów z kontrolowanym i serializowalnym layoutem.

#### Główne zastosowania

Dashboardy użytkownika, pulpity operacyjne, układy analityczne i strony widgetowe.

#### Oczekiwane działanie

Tryb readonly tylko renderuje layout. Edit umożliwia move/resize z placeholderem, collision/compaction według jawnego algorytmu i immutable commit. Każda operacja drag ma menu/przyciski „przenieś/zmień rozmiar” dostępne klawiaturą. Layout per breakpoint jest kontrolowany i nie nadpisuje się niejawnie.

#### Główne funkcjonalności

Drag, resize, grid positions, compaction, lock position/size, breakpoint layouts, edit/readonly, serialization, placeholder, reset i pełna keyboard alternative.

#### Warianty

Compaction `vertical | horizontal | none`, collision `prevent | push`, edit controls inline/toolbar, responsive layouts.

#### Stany komponentu

Readonly, edit idle, dragging, resizing, invalid/collision, locked widget, saving external, empty, restoring/reset.

#### Proponowane API

Propsy: `widgets`, `layouts`, `breakpoints`, `columns`, `rowHeight`, `gap`, `mode`, `compact`, `collision`, `selectedId`, `disabled`, `ariaLabel`, `dataTestId`. Layout item: `id`, `x`, `y`, `w`, `h`, `minW/H`, `maxW/H`, `static`, `lockPosition`, `lockSize`.

#### Proponowane sloty

`widget`, `widget-header`, `widget-actions`, `placeholder`, `empty`, `controls`, `invalid`.

#### Proponowane eventy

`update:layouts`, `update:selectedId`, `layoutChange`, `layoutCommit`, `moveStart/End`, `resizeStart/End`, `select`, `reset`, `invalidLayout`.

#### Obsługa v-model

`v-model:layouts` i opcjonalne `v-model:selectedId`; częste preview może być osobnym eventem, commit po operacji.

#### Obsługa klawiatury

Widget focus/selection, menu move/resize z krokami grid, strzałki w jawnie aktywowanym trybie, Escape cancel, Enter commit. Nie przechwytywać strzałek wewnątrz widgetu bez trybu. Reorder ma instrukcję i live status pozycji.

#### Dostępność i ARIA

Grid/list widgetów z nazwami i dostępnym opisem pozycji/rozmiaru. Drag ma alternatywę i status „Przeniesiono X do kolumny 2, wiersza 3”. Resize handles mają separator/slider-like wartości. Readonly nie ma edit tab stopów.

#### Responsywność

Breakpoints mają oddzielne layouty lub deterministyczny fallback; widget content odpowiada ResizeObserver, grid nie generuje poziomego overflow poza jawnym canvasem.

#### Wymagane Storybook stories

Readonly/edit, drag/keyboard move, resize/keyboard, collision modes, locked, breakpoint layouts, reset, invalid restore, empty, mobile.

#### Zakres testów

Collision/compaction determinism, bounds/min/max, immutable layouts, breakpoint isolation, pointer cancel, keyboard parity/live status, focus widget content, serialization i performance.

#### Kamień milowy 1 — readonly grid i schema layoutu

Renderować widgety w gridzie, z walidacją pozycji i breakpoint model. Kryterium: layout round-trip jest stabilny, invalid ma bezpieczny fallback, a readonly jest semantyczną listą/gridem.

#### Kamień milowy 2 — selection i dostępne move

Dodać edit mode oraz przyciski/menu przenoszenia. Kryterium: każdy widget można umieścić w dowolnej poprawnej komórce bez pointera, z komunikatem pozycji.

#### Kamień milowy 3 — drag, collision i compaction

Dodać pointer drag, placeholder oraz strategie solvera. Kryterium: wynik pointer/keyboard jest równoważny, collision jest deterministyczne i operację można anulować.

#### Kamień milowy 4 — resize i responsywne layouty

Dodać resize, min/max/locks i breakpoint editing. Kryterium: layout jednego breakpointu nie psuje innych, handles działają klawiaturą, content otrzymuje resize.

#### Kamień milowy 5 — persistence/stabilizacja API

Dodać reset/import/export schema, benchmark, framework parity i docs. Kryterium: schema versioning i migracja są opisane, 100 widgetów spełnia budżet, pełny check/build przechodzi.

#### Kryteria ukończenia

Drag nie jest wymagany do żadnej operacji, solver jest deterministyczny, breakpoint layouts są bezpieczne, readonly nie zawiera edit controls, a wszystkie kamienie milowe zakończone.

#### Poza zakresem pierwszej wersji

Biblioteka gotowych widgetów, pobieranie danych, persistence użytkownika, zagnieżdżone dashboardy i collaborative editing.

### SmartDataGrid

- Status: TODO
- Priorytet: P1
- Złożoność: XL
- Kategoria: Business / Data display / Data entry
- Zależności: `TableList` lub wydzielone prymitywy tabeli, `VirtualList`, `InlineEdit`, `PaginationControl`, `SearchInput`, `FormCheckbox`, `EmptyState`
- Potencjalne komponenty pomocnicze: `GridRoot`, `GridHeader`, `GridRow`, `GridCell`, `ColumnManager`, `FilterModel`, `SelectionModel`, `VirtualGrid`
- Czy wymaga zewnętrznej biblioteki: Możliwe dla wirtualizacji 2D; wymaga RFC i pełnej kontroli a11y/API
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — najpierw ocenić rozbudowę/wydzielenie prymitywów z TableList zamiast tworzenia konkurencyjnych zachowań

#### Cel

Flagowy grid danych rozwijany etapami, obsługujący duże zestawy, edycję i tryby server-side bez narzucania źródła danych.

#### Główne zastosowania

Systemy administracyjne, dane finansowe, katalogi, operacje masowe i analityka tabelaryczna.

#### Oczekiwane działanie

Grid ma stabilny model kolumn/wierszy i zachowuje parytet podstaw z TableList. Sort/filter/page emitują kontrolowane modele; tryb server-side nie przetwarza danych lokalnie. Resize/reorder/hide/pin zapisują ustawienia. Selection/edit mają spójny focus komórki; wirtualizacja nie łamie nagłówków ani pozycji.

#### Główne funkcjonalności

Sort/filter/multisort, resize/reorder/hide/pin columns, row multi-select, inline/cell edit + validation, expandable/master-detail, groups/aggregations, sticky header, virtualization, server pagination/sort/filter, user settings, export intent, loading/error/empty.

#### Warianty

`table | grid`, density, client/server modes per capability, cell/row edit, pagination/infinite, virtual/non-virtual.

#### Stany komponentu

Initial loading, data, sorting/filtering/loading, empty filtered/global, selection, editing valid/invalid/pending, expanded, partial server data, error, stale settings.

#### Proponowane API

Propsy: `rows`, `columns`, `rowKey`, `sort`, `filters`, `pagination`, `selection`, `expandedRows`, `columnState`, `editState`, `loading`, `error`, `total`, `mode`, `virtualization`, `stickyHeader`, `density`, `ariaLabel`, `dataTestId`. Publiczne neutralne typy dla każdego modelu.

#### Proponowane sloty

`cell`, `header`, `filter`, `editor`, `row-actions`, `expanded`, `detail`, `group`, `aggregation`, `toolbar`, `empty`, `loading`, `error`.

#### Proponowane eventy

`update:sort`, `update:filters`, `update:pagination`, `update:selection`, `update:expandedRows`, `update:columnState`, `sortChange`, `filterChange`, `pageChange`, `selectionChange`, `cellEdit`, `rowEdit`, `validation`, `load`, `export`, `settingsChange`.

#### Obsługa v-model

Nazwane modele dla sort/filters/pagination/selection/expanded/columnState; edit commit pozostaje eventem intencji do czasu aktualizacji rows, aby nie mutować danych.

#### Obsługa klawiatury

APG grid: pojedynczy aktywny cell, strzałki, Home/End, Ctrl+Home/End, Page, Enter/F2 edit, Escape cancel, Spacja selection. Header sort/filter/reorder/resize dostępne przyciskami i skrótami po focusie. Interaktywna zawartość cell ma jawny „interaction mode”.

#### Dostępność i ARIA

Semantyczna table dla prostego trybu albo `grid/row/gridcell` dla composite. Nagłówki, sort, row/col indices/counts, selected/expanded i validation są aktualne również przy wirtualizacji. Pinned/reordered kolejność DOM odpowiada wizualnej. Loading nie usuwa kontekstu bez potrzeby.

#### Responsywność

Kontrolowany scroll, pinning i minimum widths; column manager zamiast automatycznego ukrywania danych. Na mobile możliwy udokumentowany card/detail renderer, ale nie może zmieniać modelu ani gubić kolumn bez informacji.

#### Wymagane Storybook stories

Każda funkcja i kombinacje kluczowe: client/server, multisort/filter, column controls, select, edit/validation async, expand/detail, group/aggregate, virtual 100k, loading/error/empty, saved settings, keyboard/mobile.

#### Zakres testów

Modele reducerów, stable row/column IDs, client/server separation, sort/filter edge cases, selection ranges, edit lifecycle, column solver, virtual indices/focus/ARIA, settings migration, event order, performance i browser matrix.

#### Kamień milowy 1 — fundament tabeli i parytet TableList

Zdefiniować wspólne prymitywy/model columns/rows, render, sort single/multi, loading/error/empty. Kryterium: brak regresji TableList, nagłówki i sort ARIA są poprawne, publiczne typy stabilne.

#### Kamień milowy 2 — filtry, paginacja i server modes

Dodać typed filters, client/server flags, pagination i total. Kryterium: w server mode grid nie przetwarza danych lokalnie, każdy request intent ma kompletny model i testy race po stronie UI loading.

#### Kamień milowy 3 — kolumny i ustawienia

Dodać resize/reorder/hide/pin oraz columnState schema. Kryterium: wszystkie operacje mają klawiaturę, kolejność DOM jest zgodna, min/max widths są respektowane i schema round-trip działa.

#### Kamień milowy 4 — selection, expansion i master-detail

Dodać single/multi/range selection, expanded rows i detail. Kryterium: selection ma stabilne keys przy zmianie strony, focus nie ginie, expanded semantics i lazy intent działają.

#### Kamień milowy 5 — edycja i walidacja

Dodać cell/row edit, custom editors, sync/async validation i pending. Kryterium: rows nie są mutowane, cancel przywraca wartość, błędy są powiązane z komórką, focus po commit/cancel poprawny.

#### Kamień milowy 6 — grupy, agregacje i wirtualizacja

Dodać grouping/aggregation, sticky header i wirtualizację (w tym 2D po RFC). Kryterium: 100 000 wierszy spełnia budżet, aria row/col metadata jest prawdziwa, focusowane komórki nie znikają bez obsługi.

#### Kamień milowy 7 — stabilizacja flagowego API

Eksport intent, settings migration, mobile strategy, docs, framework parity, visual/a11y/performance regression. Kryterium: pełny release check przechodzi, wszystkie modele mają wersjonowanie i żaden feature nie zależy od backendu.

#### Kryteria ukończenia

Wszystkie siedem kamieni milowych jest ukończonych osobnymi zadaniami, TableList ma udokumentowaną relację/migrację, tryby client/server są rozdzielone, grid jest w pełni klawiaturowy i spełnia budżety dużych danych.

#### Poza zakresem pierwszej wersji

Arkusz kalkulacyjny, formuły komórek, collaborative editing, pivot OLAP, pobieranie danych, autoryzacja i własny format plików eksportu.

## 16. Etap 7 — komponenty flagowe i canvas

Etap jest realizowany dopiero po stabilizacji fundamentów. Canvas zawsze wymaga dostępnego odpowiednika i nie może być jedynym sposobem obsługi danych.

### WorkflowCanvas

- Status: TODO
- Priorytet: P2
- Złożoność: XL
- Kategoria: Flagship / Canvas / Data entry
- Zależności: `FullscreenContainer`, `ContextMenu`, `KeyboardShortcutMap`, `UndoRedoTimeline`, `ScrollArea`
- Potencjalne komponenty pomocnicze: `WorkflowNode`, `WorkflowEdge`, `WorkflowConnector`, `WorkflowControls`, `WorkflowMinimap`, `WorkflowSelectionArea`, graph command/model utilities
- Czy wymaga zewnętrznej biblioteki: Prawdopodobnie dla viewportu/layoutu/edge routing; wybór dopiero po RFC, prototypie a11y, benchmarku i analizie licencji
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — fullscreen, menu, skróty, historia i tokeny; nie należy opierać modelu domenowego na API zewnętrznej biblioteki

#### Cel

Flagowy edytor procesów oparty na węzłach, portach i krawędziach, z neutralnym modelem grafu i pełną alternatywą dla operacji przestrzennych.

#### Główne zastosowania

Procesy biznesowe, automatyzacje, diagramy przepływu, konfiguratory integracji i edytory zależności wykonawczych.

#### Oczekiwane działanie

Canvas renderuje kontrolowane nodes/edges/ports, pozwala tworzyć tylko połączenia zaakceptowane przez callback walidacyjny i emituje immutable command/intents. Selection single/multi/area, drag, zoom/pan, copy/paste/delete/duplicate oraz undo/redo działają na stabilnych ID. Każda operacja przestrzenna ma panel/listę lub dialog dostępny bez pointera. Readonly nie pozostawia edit handles.

#### Główne funkcjonalności

Nodes, input/output ports, edges, connect/validate/delete, node drag, single/multi/area selection, zoom/pan, minimap, controls, clipboard, delete/duplicate, undo/redo intents, shortcuts, snap-to-grid, custom node/edge, graph serialization, readonly i opcjonalny auto-layout.

#### Warianty

`edit | readonly`, viewport inline/fullscreen, grid visible/hidden, connection straight/step/curve renderers, selection pointer/keyboard, minimap on/off.

#### Stany komponentu

Empty, loading, ready, selected, connecting valid/invalid, dragging, area selecting, panning, read-only, command pending/error, invalid graph, layout calculating.

#### Proponowane API

Propsy: `nodes`, `edges`, `selectedNodeIds`, `selectedEdgeIds`, `viewport`, `tool`, `readonly`, `snapToGrid`, `gridSize`, `connectionMode`, `validateConnection`, `canDelete`, `clipboardAdapter`, `history`, `loading`, `ariaLabel`, `dataTestId`. Node/edge/port typy muszą być neutralne i wersjonowane.

#### Proponowane sloty

`node`, `node-header`, `node-port`, `edge`, `edge-label`, `controls`, `minimap`, `toolbar`, `details`, `empty`, `loading`, `error`, `accessible-list`.

#### Proponowane eventy

`update:nodes`, `update:edges`, `update:selectedNodeIds`, `update:selectedEdgeIds`, `update:viewport`, `connectStart`, `connect`, `connectReject`, `moveNodes`, `select`, `delete`, `duplicate`, `copy`, `paste`, `command`, `undo`, `redo`, `layoutRequest`, `viewportChange`.

#### Obsługa v-model

Nazwane modele danych/selection/viewport są możliwe, ale operacje domenowe powinny emitować commands, aby aplikacja mogła zatwierdzić zmianę. Komponent nigdy nie przechowuje jedynej kopii grafu.

#### Obsługa klawiatury

Roving focus po węzłach/portach, strzałki przemieszczają focus lub wybrane węzły dopiero w jawnym trybie, Enter otwiera szczegóły/tryb connect, lista dialogowa wybiera source/target port bez drag, Escape anuluje bieżące narzędzie, Delete usuwa po polityce, Mod+C/V/D/Z/Shift+Z tylko po focusie canvas i z edytowalnymi target guards. Zoom ma przyciski i skróty.

#### Dostępność i ARIA

Canvas ma dostępny model list/tree: węzeł, typ, porty, incoming/outgoing i krawędzie opisane tekstem. Tworzenie połączenia może odbyć się formularzem „Połącz port A z portem B”. Selection/status connection są ogłaszane kontrolowanie. Kolory i geometria nie są jedyną informacją. Minimap jest dekoracyjna dla AT.

#### Responsywność

Viewport wypełnia kontener, ale nie blokuje scroll/zoom strony poza aktywną interakcją. Toolbar/controls do overflow, minimap może się ukryć, details do drawera, touch gestures mają alternatywy. Resize zachowuje viewport/selection.

#### Wymagane Storybook stories

Empty/basic, custom nodes/ports/edges, valid/invalid connect pointer i dialog, multi/area selection, move/snap, copy/paste/delete/duplicate, undo intents, minimap/controls/fullscreen, readonly, invalid graph, 1k nodes benchmark, keyboard/mobile.

#### Zakres testów

Schema/referential integrity, immutable commands, connection validation, selection reducer, coordinate transforms, pointer capture/cancel, clipboard ID remap, shortcut guards, history intents, accessible list parity, focus, viewport, serialization/versioning i performance.

#### Kamień milowy 1 — model grafu i readonly

Zdefiniować wersjonowane nodes/ports/edges, walidację i dostępny widok listy, render statyczny oraz selection. Kryterium: cały graf i relacje są odczytywalne bez canvas, invalid refs nie crashują, round-trip jest stabilny.

#### Kamień milowy 2 — viewport i ruch węzłów

Dodać zoom/pan, controls, node drag, keyboard move i snap. Kryterium: transformacje są odwracalne, pointer/keyboard mają te same granice, operację można anulować, focus/selection pozostają.

#### Kamień milowy 3 — porty i połączenia

Dodać connect gesture, validate callback, edge create/delete oraz formularz alternatywny. Kryterium: niepoprawne połączenie nigdy nie trafia do modelu, każdą krawędź można utworzyć/usunąć bez pointera.

#### Kamień milowy 4 — selection i commands

Dodać multi/area, copy/paste z remap ID, duplicate/delete, command API i skróty. Kryterium: commands są immutable/deterministyczne, skróty nie przechwytują edytorów tekstu, area ma alternatywę listową.

#### Kamień milowy 5 — historia, minimap i rozszerzalność

Zintegrować undo/redo intents, custom renderers, controls/minimap i szczegóły. Kryterium: core nie przechowuje historii domenowej, slot nie może ominąć wymaganej semantyki, minimap odpowiada viewportowi.

#### Kamień milowy 6 — wydajność, a11y i stabilizacja API

Dodać rendering dużych grafów, opcjonalny auto-layout adapter, mobile/reduced motion, framework parity i pełne docs. Kryterium: 1 000 węzłów/ustalona liczba krawędzi spełnia budżet, accessible list ma parytet, pełny release check przechodzi.

#### Kryteria ukończenia

Każda operacja canvas ma alternatywę bez pointera, graf nie zależy od backendu ani modelu biblioteki zewnętrznej, połączenia są walidowane przed emisją, schema jest wersjonowana i wszystkie sześć kamieni milowych zamknięte.

#### Poza zakresem pierwszej wersji

Wykonywanie workflow, scheduler/backend, collaborative realtime, dowolny skrypt w węźle, analiza procesu oraz auto-layout w core bez adaptera.

### RelationshipGraph Advanced

- Status: TODO
- Priorytet: P3
- Złożoność: XL
- Kategoria: Flagship / Visualization extension
- Zależności: ukończony `RelationshipGraph`
- Potencjalne komponenty pomocnicze: cluster model, lazy branch loader interface, layout adapters, path result panel
- Czy wymaga zewnętrznej biblioteki: Prawdopodobnie dla specjalistycznych layoutów/clustering; każda wymaga oddzielnego RFC
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — jest rozszerzeniem podstawowego RelationshipGraph, nie oddzielnym konkurencyjnym grafem

#### Cel

Rozszerzenie RelationshipGraph dla dużych i gęstych grafów oraz specjalistycznej eksploracji zależności.

#### Główne zastosowania

Grafy zależności systemów, duże sieci relacji, analiza wpływu i odkrywanie ścieżek.

#### Oczekiwane działanie

Funkcje są dodawane jako możliwości/adapters do stabilnego modelu podstawowego. Collapse/lazy load zachowują informację o ukrytych węzłach. Clustering ma dostępną listę członków; path finding przyjmuje algorytm/wynik z zewnątrz albo bezpieczny utility i pokazuje tekstową ścieżkę.

#### Główne funkcjonalności

Groups/clustering, lazy loading, hide branches, multiple layouts, relation legend/filter, path search i dependency highlighting.

#### Warianty

Layout adapters, cluster automatic/provided, lazy/manual, path directed/undirected weighted tylko po zdefiniowaniu modelu.

#### Stany komponentu

Clustered/expanded, branch loading/error, layout calculating/cancelled, path selecting/calculating/found/not found, dense performance fallback.

#### Proponowane API

Rozszerzenia: `clusters`, `collapsedClusterIds`, `hasHiddenChildren`, `loadBranch`, `layoutAdapter`, `pathQuery`, `pathResult`, `highlightedIds`, `legend`; typy muszą rozszerzać, a nie łamać base schema.

#### Proponowane sloty

`cluster`, `cluster-details`, `lazy-state`, `path-result`, `legend`, plus wszystkie zgodne sloty base.

#### Proponowane eventy

`clusterToggle`, `loadBranch`, `layoutRequest/Complete/Error`, `pathRequest`, `pathSelect`, `highlightChange`.

#### Obsługa v-model

Modele collapsed clusters, highlighted IDs i ewentualnie path endpoints; nodes/edges nadal kontrolowane przez base.

#### Obsługa klawiatury

Cluster jest nawigowalnym węzłem z akcją rozwinięcia; lazy retry button; path endpoints wybierane także przez formularz/listę; layout controls jako przyciski.

#### Dostępność i ARIA

Accessible relation list opisuje liczbę ukrytych członków/relacji, cluster contents i znalezioną ścieżkę krok po kroku. Highlight nie opiera się na kolorze. Loading branch jest powiązany z triggerem.

#### Responsywność

Na małym viewport domyślnie cluster/list, layout obliczany poza krytycznym renderem, a path panel może przejść do DrawerPanel.

#### Wymagane Storybook stories

Provided/auto clusters, collapse/lazy/error, layout switch/cancel, legend filters, path found/not found, large benchmark, list parity, mobile.

#### Zakres testów

Base compatibility, cluster membership/counts, lazy races/dedup, layout cancellation, path integrity, highlight/list parity, keyboard i performance budgets.

#### Kryteria ukończenia

Base API pozostaje kompatybilne, ukryte dane są zawsze zakomunikowane, wszystkie operacje mają list/form fallback, duże grafy spełniają nowy budżet, a rozszerzenia są opcjonalne/tree-shakeable.

#### Poza zakresem pierwszej wersji

Edycja grafu, workflow execution, backend graph database, samodzielne pobieranie gałęzi i dowolne uruchamianie algorytmów na serwerze.

### OrganizationChart Advanced

- Status: TODO
- Priorytet: P3
- Złożoność: XL
- Kategoria: Flagship / Visualization extension
- Zależności: ukończony `OrganizationChart`
- Potencjalne komponenty pomocnicze: hierarchy command model, print/export adapter, branch virtualization
- Czy wymaga zewnętrznej biblioteki: Możliwe dla eksportu/dużych layoutów; oddzielne RFC
- Czy może wykorzystać istniejące komponenty PeaUI: Tak — rozszerza OrganizationChart i jego TreeList fallback

#### Cel

Rozbudowa stabilnego OrganizationChart o restrukturyzację, porównania, eksport i bardzo duże hierarchie.

#### Główne zastosowania

Planowanie reorganizacji, scenariusze „przed/po”, duże przedsiębiorstwa, druk i raportowanie struktur.

#### Oczekiwane działanie

Drag hierarchy emituje command z source/target/position i przechodzi walidację cyklu/uprawnień; równoważny dialog pozwala wybrać nowego rodzica. Compare pokazuje added/removed/moved/changed tekstowo. Print/export korzysta z adaptera i nie generuje ciężkiego formatu w core. Virtual branches nie gubią relacji.

#### Główne funkcjonalności

Hierarchy drag + keyboard alternative, structure compare, multiple relation overlays, print/export adapters, large structures i branch virtualization.

#### Warianty

`view | reorganize | compare`, export/print adapter, virtual threshold, relation overlay on/off.

#### Stany komponentu

Reorganizing valid/invalid/pending, compare loading/ready, exporting/printing/error, virtual branch loading, readonly.

#### Proponowane API

Rozszerzenia: `mode`, `baselineNodes`, `draftNodes`, `moveValidation`, `pendingMove`, `relationOverlays`, `virtualization`, `exportAdapter`, `printOptions`.

#### Proponowane sloty

`move-preview`, `move-dialog`, `compare-status`, `relation`, `export-controls`, plus kompatybilne sloty base.

#### Proponowane eventy

`move`, `moveReject`, `compareSelect`, `export`, `exportResult/Error`, `print`, `loadBranch`.

#### Obsługa v-model

Selection/expanded dziedziczone; draft hierarchy pozostaje kontrolowana. Component emituje command, nie mutuje tree.

#### Obsługa klawiatury

Move przez akcję/dialog wyboru parent/position, undo pozostaje w aplikacji; compare list keyboard; export/print buttons. Drag nigdy nie jest jedyną metodą.

#### Dostępność i ARIA

Zmiana hierarchii i compare są przedstawione w TreeList: „Osoba X przeniesiona z A do B”. Relation overlays mają tekstowy wykaz. Print/export status dostępny; wirtualizacja zachowuje poziomy i setsize.

#### Responsywność

Reorganize na mobile preferuje dialog/listę, compare diagram przechodzi do listy, print ma dedykowany layout niebędący stylem ekranowym.

#### Wymagane Storybook stories

Move pointer/dialog/invalid, compare wszystkie typy zmian, overlay relations, export success/error mocked, 20k virtual hierarchy, mobile/list fallback.

#### Zakres testów

Cycle prevention command, source/target integrity, compare classification, base compatibility, export adapter lifecycle, virtual ARIA/focus, print snapshot i performance.

#### Kryteria ukończenia

Base OrganizationChart nie traci kompatybilności, move jest możliwe bez drag i nie mutuje danych, compare ma pełny tekstowy odpowiednik, a export/print są adapterami z cleanup/error handling.

#### Poza zakresem pierwszej wersji

System kadrowy, uprawnienia domenowe, zapis reorganizacji, payroll, realtime collaboration i własny silnik PDF.

## 17. Zakres wykluczony

Ta roadmapa nie obejmuje komponentów ani interfejsów związanych ze sztuczną inteligencją, wyboru modeli, prezentacji rozumowania, wywołań narzędzi, agentów ani czatów. Ewentualny taki kierunek wymaga oddzielnego dokumentu i nie może być dopisywany do identyfikatorów `PEA-COMP-001`–`PEA-COMP-060`.

## 18. Wspólne kryteria ukończenia pozycji

Poza kryteriami opisanymi przy konkretnym komponencie status `DONE` wymaga łącznie:

1. Zatwierdzonego zakresu i API bez nieudokumentowanej zależności zewnętrznej.
2. Źródłowej implementacji Vue oraz parytetu React i Web Components zgodnie z architekturą repozytorium.
3. Pełnych publicznych typów, eksportów i wspólnych stylów opartych na tokenach.
4. Obsługi wszystkich zaplanowanych stanów, klawiatury, focusu, ARIA, reduced motion i responsywności.
5. Testów jednostkowych oraz interakcyjnych Vue/React/WC, testów axe i mobilnego overflow dla stories.
6. Stories podstawowych, wariantów, stanów, edge cases i dostępności w trzech Storybookach.
7. Aktualnej dokumentacji portalu: opis, propsy, modele, eventy, sloty, przykłady Vue/React/WC i ograniczenia.
8. Przejścia lint, Prettier, typecheck, testów, buildów biblioteki/dokumentacji/Storybooków oraz odpowiedniego release check.
9. Braku niezamierzonych zmian API istniejących komponentów; zmiany kompatybilności wymagają osobnego planu migracji.
10. Uzupełnionej notatki implementacyjnej oraz zmiany statusu w tabeli i sekcji komponentu.

## 19. Protokół przyszłych implementacji

Każda przyszła sesja Codexa wykonuje poniższy proces:

1. Odczytaj całe `docs/COMPONENTS_ROADMAP.md`.
2. Znajdź komponent wskazany przez użytkownika po stałym ID i nazwie.
3. Sprawdź jego wymagane zależności oraz ich statusy.
4. Sprawdź aktualną implementację biblioteki, ponieważ repozytorium mogło zmienić się od utworzenia roadmapy.
5. Zmień status komponentu w tabeli i jego sekcji na `IN_PROGRESS`; dla komponentu XL wskaż dokładnie jeden realizowany kamień milowy.
6. Zaimplementuj tylko wskazany komponent albo wskazany kamień milowy.
7. Dodaj wymagane typy, style, testy, stories Vue/React/WC, eksporty i dokumentację portalu zgodnie z konwencjami repozytorium.
8. Uruchom lint, Prettier, typecheck, testy jednostkowe/interakcyjne/przeglądarkowe i wszystkie właściwe buildy.
9. Napraw wszystkie błędy związane z implementacją; nie maskuj regresji przez osłabianie testów.
10. Zmień status na `DONE` dopiero po spełnieniu kryteriów komponentu i wspólnych kryteriów. Jeśli zakończono tylko milestone, pozostaw komponent `IN_PROGRESS` lub `PLANNED` i oznacz stan milestone'u w notatce.
11. Dodaj krótką notatkę implementacyjną w sekcji komponentu według poniższego szablonu.
12. Nie rozpoczynaj automatycznie kolejnego komponentu.

> Jedno polecenie użytkownika powinno domyślnie oznaczać implementację jednego komponentu lub jednego wyraźnie wskazanego kamienia milowego.

### Szablon notatki implementacyjnej

Notatkę dodaje się dopiero po rozpoczęciu rzeczywistej implementacji; nie należy wypełniać jej przewidywaniami.

```markdown
#### Notatka implementacyjna

- Data ukończenia:
- Zrealizowany zakres/kamień milowy:
- Najważniejsze decyzje:
- Utworzone lub zmienione pliki:
- Wyniki testów i buildów:
- Ograniczenia:
- Potencjalne rozszerzenia:
```

## 20. Utrzymanie roadmapy

- Identyfikatory `PEA-COMP-001`–`PEA-COMP-060` są stałe. Nie wolno ich ponownie użyć ani zmieniać po publikacji dokumentu.
- Nowa pozycja otrzymuje kolejny wolny ID, pełny opis w tym samym formacie, wpis w tabeli i mapie zależności.
- Zmiana nazwy zachowuje ID i dodaje notatkę migracyjną. Połączenie pozycji wskazuje następcę; nie usuwa historii.
- Status w tabeli i sekcji komponentu musi być zawsze identyczny.
- Aktualnym pierwszym etapem jest Etap 1. Pierwszym kandydatem bez nieukończonych nowych zależności jest `PEA-COMP-001 Avatar`; wybór zawsze wymaga polecenia użytkownika.
- Roadmapę należy aktualizować w tym samym zadaniu, w którym ukończono komponent lub milestone, ale nie należy zmieniać zakresów niezwiązanych z tym zadaniem.
