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

| Status | Znaczenie |
| --- | --- |
| `TODO` | Pozycja opisana i oczekująca na zaplanowanie implementacji. Stan początkowy wszystkich nowych komponentów. |
| `PLANNED` | Zakres i API zostały zweryfikowane, zależności są znane, a praca ma zatwierdzony plan. |
| `IN_PROGRESS` | Trwa implementacja komponentu albo jawnie wskazanego kamienia milowego. |
| `BLOCKED` | Pracy nie można kontynuować bez decyzji, zależności lub zmiany zewnętrznej; przyczyna musi być wpisana w notatce. |
| `DONE` | Kod, parytet frameworków, dokumentacja, testy i wszystkie kryteria ukończenia są kompletne. |
| `DEPRECATED` | Pozycja została wycofana albo zastąpiona; dokument musi wskazywać następcę i strategię migracji. |

## 4. Skala złożoności

| Poziom | Znaczenie |
| --- | --- |
| `S` | Mały, samodzielny komponent z niewielką liczbą stanów. |
| `M` | Średni komponent z kilkoma wariantami lub interakcjami. |
| `L` | Duży komponent, złożone zarządzanie stanem, klawiaturą albo kompozycją. |
| `XL` | Komponent flagowy lub rodzina komponentów wymagająca etapowej realizacji. |

## 5. Priorytety

| Priorytet | Znaczenie |
| --- | --- |
| `P0` | Fundament potrzebny wielu kolejnym pozycjom. |
| `P1` | Wysoki priorytet i duża wartość dla typowych produktów. |
| `P2` | Średni priorytet albo bardziej wyspecjalizowane zastosowanie. |
| `P3` | Funkcja eksperymentalna, opcjonalna lub późniejsze rozszerzenie. |

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

| ID | Komponent | Etap | Status | Priorytet | Złożoność | Zależności |
| --- | --- | ---: | --- | --- | --- | --- |
| PEA-COMP-001 | Avatar | 1 | TODO | P0 | S | ImageView, SvgIcon |
| PEA-COMP-002 | AvatarGroup | 1 | TODO | P1 | M | Avatar, InfoTooltip/PopoverOverlayer |
| PEA-COMP-003 | DropdownMenu | 1 | TODO | P0 | L | PopoverOverlayer, ButtonAction |
| PEA-COMP-004 | ContextMenu | 1 | TODO | P1 | L | DropdownMenu lub wspólne menu, PopoverOverlayer |
| PEA-COMP-005 | MenuBar | 1 | TODO | P2 | L | DropdownMenu lub wspólne menu |
| PEA-COMP-006 | SwitchToggle | 1 | TODO | P0 | S | FieldLabel/MessageText |
| PEA-COMP-007 | ToggleButton | 1 | TODO | P0 | S | ButtonAction, SvgIcon |
| PEA-COMP-008 | ToggleGroup | 1 | TODO | P1 | M | ToggleButton |
| PEA-COMP-009 | SegmentedControl | 1 | TODO | P1 | M | ToggleGroup lub wspólne prymitywy wyboru |
| PEA-COMP-010 | SplitButton | 1 | TODO | P1 | M | ButtonAction, DropdownMenu |
| PEA-COMP-011 | DateRangePicker | 1 | TODO | P1 | L | FormDatePicker, PopoverOverlayer |
| PEA-COMP-012 | TimePicker | 1 | TODO | P1 | L | FormField, PopoverOverlayer |
| PEA-COMP-013 | DateTimePicker | 1 | TODO | P2 | L | FormDatePicker, TimePicker |
| PEA-COMP-014 | ColorPicker | 1 | TODO | P2 | L | FormInput, InputSlider, PopoverOverlayer |
| PEA-COMP-015 | PinInput | 1 | TODO | P1 | M | FormField/FormInput |
| PEA-COMP-016 | TagsInput | 1 | TODO | P1 | L | TagChip, FormInput, PopoverOverlayer |
| PEA-COMP-017 | RatingInput | 1 | TODO | P2 | M | SvgIcon, FieldLabel |
| PEA-COMP-018 | TransferList | 1 | TODO | P2 | L | SearchInput, FormCheckbox, ButtonAction |
| PEA-COMP-019 | ScrollArea | 1 | TODO | P0 | M | Brak |
| PEA-COMP-020 | VirtualList | 1 | TODO | P1 | L | ScrollArea, EmptyState, SpinnerLoader |
| PEA-COMP-021 | InlineEdit | 1 | TODO | P1 | M | FormInput/FormNumber/FormSelect/FormTextarea |
| PEA-COMP-022 | CopyButton | 1 | TODO | P1 | S | ButtonAction, SvgIcon, ToastAlert/MessageText |
| PEA-COMP-023 | KeyboardKey | 1 | TODO | P1 | S | Brak |
| PEA-COMP-024 | CommandPalette | 2 | TODO | P1 | XL | ModalDialog, SearchInput, KeyboardKey, VirtualList |
| PEA-COMP-025 | GuidedTour | 2 | TODO | P2 | XL | PopoverOverlayer, ButtonAction, ProgressIndicator |
| PEA-COMP-026 | NotificationCenter | 2 | TODO | P2 | L | ScrollArea, CounterBadge, EmptyState |
| PEA-COMP-027 | KeyboardShortcutMap | 2 | TODO | P2 | M | KeyboardKey, ModalDialog, SearchInput |
| PEA-COMP-028 | ContextActionBar | 2 | TODO | P2 | M | ButtonAction, DropdownMenu |
| PEA-COMP-029 | UndoRedoTimeline | 2 | TODO | P2 | L | ButtonAction, KeyboardKey, ScrollArea |
| PEA-COMP-030 | RadialActionMenu | 2 | TODO | P3 | L | ContextMenu lub wspólne menu |
| PEA-COMP-031 | JsonExplorer | 3 | TODO | P2 | L | TreeList, CopyButton, SearchInput, VirtualList |
| PEA-COMP-032 | DiffViewer | 3 | TODO | P1 | XL | ScrollArea, VirtualList, CopyButton |
| PEA-COMP-033 | ActivityTimeline | 3 | TODO | P2 | L | Avatar, TagChip, ScrollArea |
| PEA-COMP-034 | MetricCard | 3 | TODO | P1 | M | CardPanel, InfoTooltip, SkeletonLoading |
| PEA-COMP-035 | CalendarHeatmap | 3 | TODO | P2 | L | InfoTooltip, ScrollArea |
| PEA-COMP-036 | StatusFlow | 3 | TODO | P2 | L | NavigationStepper, TagChip |
| PEA-COMP-037 | OrganizationChart | 3 | TODO | P2 | XL | TreeList, SearchInput, ScrollArea |
| PEA-COMP-038 | RelationshipGraph | 3 | TODO | P2 | XL | FullscreenContainer, SearchInput |
| PEA-COMP-039 | ImageAnnotation | 4 | TODO | P2 | XL | ImageView, ButtonAction, SvgIcon |
| PEA-COMP-040 | BeforeAfterSlider | 4 | TODO | P2 | M | ImageView, InputSlider |
| PEA-COMP-041 | HotspotViewer | 4 | TODO | P2 | L | ImageView, InfoTooltip/PopoverOverlayer |
| PEA-COMP-042 | FilePreview | 4 | TODO | P1 | XL | ImageView, JsonExplorer, EmptyState |
| PEA-COMP-043 | AudioWaveform | 4 | TODO | P2 | XL | ButtonAction, InputSlider |
| PEA-COMP-044 | ColorPaletteExtractor | 4 | TODO | P3 | L | ImageView, CopyButton, ColorPicker |
| PEA-COMP-045 | MentionInput | 5 | TODO | P1 | L | FormTextarea/FormInput, PopoverOverlayer, VirtualList |
| PEA-COMP-046 | CommentThread | 5 | TODO | P2 | XL | MentionInput, Avatar, InlineEdit |
| PEA-COMP-047 | PresenceGroup | 5 | TODO | P2 | M | Avatar, AvatarGroup, PopoverOverlayer |
| PEA-COMP-048 | VersionHistory | 5 | TODO | P2 | L | ActivityTimeline, DiffViewer, DrawerPanel |
| PEA-COMP-049 | ReviewChanges | 5 | TODO | P2 | L | DiffViewer, ContextActionBar |
| PEA-COMP-050 | QueryBuilder | 6 | TODO | P1 | XL | FormSelect, FormInput, FormNumber, FormDatePicker |
| PEA-COMP-051 | PermissionMatrix | 6 | TODO | P1 | XL | FormCheckbox, TableList, SearchInput |
| PEA-COMP-052 | FormulaBuilder | 6 | TODO | P2 | XL | FormInput, DropdownMenu, MessageText |
| PEA-COMP-053 | FormWizard | 6 | TODO | P1 | XL | NavigationStepper, FormContainer |
| PEA-COMP-054 | FileExplorer | 6 | TODO | P1 | XL | TreeList, ContextMenu, InlineEdit, VirtualList |
| PEA-COMP-055 | ResizableWorkspace | 6 | TODO | P2 | XL | FullscreenContainer, KeyboardKey |
| PEA-COMP-056 | DashboardGrid | 6 | TODO | P2 | XL | GridItem, GridSection, ResizableWorkspace |
| PEA-COMP-057 | SmartDataGrid | 6 | TODO | P1 | XL | TableList/prymitywy tabeli, VirtualList, InlineEdit |
| PEA-COMP-058 | WorkflowCanvas | 7 | TODO | P2 | XL | FullscreenContainer, ContextMenu, KeyboardShortcutMap |
| PEA-COMP-059 | RelationshipGraph Advanced | 7 | TODO | P3 | XL | RelationshipGraph |
| PEA-COMP-060 | OrganizationChart Advanced | 7 | TODO | P3 | XL | OrganizationChart |

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

- Status: TODO
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

<!-- NEXT -->
