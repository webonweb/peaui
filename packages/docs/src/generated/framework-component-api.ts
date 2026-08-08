// Ten plik jest generowany przez scripts/generate-component-api.mjs.
// Nie edytuj go ręcznie — źródłem prawdy są implementacje React i Web Components.

import type { FrameworkComponentApi } from '../types';

export const generatedReactComponentApi = [
  {
    category: 'basic',
    categoryLabel: 'Podstawowe',
    name: 'ImageView',
    sourceName: 'ImageView',
    framework: 'react',
    importPath: '@peaui/ui/react/basic/ImageView',
    status: 'stable',
    props: [
      {
        name: 'alt',
        type: 'string',
        required: false,
        description: 'Alternatywny opis obrazu używany przez technologie asystujące.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'max',
        type: 'string',
        required: false,
        description: 'Maksymalna dozwolona wartość albo szerokość.',
      },
      {
        name: 'size',
        type: "'auto' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'full'",
        required: false,
        default: 'auto',
        description: 'Wariant rozmiaru komponentu.',
      },
      {
        name: 'src',
        type: 'string',
        required: false,
        description: 'Adres źródłowy obrazu albo innego zasobu.',
      },
    ],
    models: [],
    events: [],
    slots: [],
  },
  {
    category: 'basic',
    categoryLabel: 'Podstawowe',
    name: 'SvgIcon',
    sourceName: 'SvgIcon',
    framework: 'react',
    importPath: '@peaui/ui/react/basic/SvgIcon',
    status: 'stable',
    props: [
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description: 'Nazwa pola używana przez formularz lub nazwa zasobu.',
      },
    ],
    models: [],
    events: [],
    slots: [],
  },
  {
    category: 'data-display',
    categoryLabel: 'Prezentacja danych',
    name: 'Avatar',
    sourceName: 'Avatar',
    framework: 'react',
    importPath: '@peaui/ui/react/data-display/Avatar',
    status: 'stable',
    props: [
      {
        name: 'src',
        type: 'string',
        required: false,
        description: 'Adres obrazu prezentowanego w awatarze.',
      },
      {
        name: 'alt',
        type: 'string',
        required: false,
        description: 'Alternatywny opis obrazu. Pusty tekst oznacza obraz dekoracyjny.',
      },
      {
        name: 'name',
        type: 'string',
        required: false,
        description: 'Nazwa używana do wyliczenia inicjałów i nazwy dostępnej fallbacku.',
      },
      {
        name: 'initials',
        type: 'string',
        required: false,
        description: 'Jawne inicjały mają pierwszeństwo przed inicjałami wyliczonymi z name.',
      },
      {
        name: 'size',
        type: "'xs' | 's' | 'm' | 'l' | 'xl'",
        required: false,
        default: 'm',
        description: 'Wariant rozmiaru awatara.',
      },
      {
        name: 'shape',
        type: "'circle' | 'rounded'",
        required: false,
        default: 'circle',
        description: 'Kształt awatara.',
      },
      {
        name: 'status',
        type: "'online' | 'offline' | 'away' | 'busy' | 'none'",
        required: false,
        default: 'none',
        description: 'Status obecności prezentowany wizualnie i tekstowo.',
      },
      {
        name: 'statusLabel',
        type: 'string',
        required: false,
        description: 'Własna dostępna etykieta statusu.',
      },
      {
        name: 'loading',
        type: "'eager' | 'lazy'",
        required: false,
        default: 'lazy',
        description: 'Strategia ładowania natywnego obrazu.',
      },
      {
        name: 'fallbackIcon',
        type: 'string',
        required: false,
        default: 'users',
        description: 'Nazwa ikony używanej, gdy obraz i inicjały nie są dostępne.',
      },
      {
        name: 'interactive',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Renderuje semantyczny przycisk zamiast prezentacyjnego awatara.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wyłącza interaktywny awatar.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        description: 'Dostępna nazwa awatara lub przycisku.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator używany w testach automatycznych.',
      },
    ],
    models: [],
    events: [
      {
        name: 'onLoad',
        description: 'Emitowane po poprawnym załadowaniu obrazu. W React przekaż callback onLoad.',
      },
      {
        name: 'onError',
        description:
          'Emitowane, gdy operacja komponentu kończy się błędem. W React przekaż callback onError.',
      },
    ],
    slots: [
      {
        name: 'children',
        description: 'Główna treść React przekazywana przez children.',
      },
      {
        name: 'statusContent',
        description:
          'Treść osadzana w nazwanym slocie „status”. W React jest to prop ReactNode „statusContent”.',
      },
    ],
  },
  {
    category: 'data-display',
    categoryLabel: 'Prezentacja danych',
    name: 'AvatarGroup',
    sourceName: 'AvatarGroup',
    framework: 'react',
    importPath: '@peaui/ui/react/data-display/AvatarGroup',
    status: 'stable',
    props: [
      {
        name: 'items',
        type: 'AvatarGroupItem[]',
        required: false,
        default: '[]',
        description: 'Osoby prezentowane w stabilnej kolejności wejściowej.',
      },
      {
        name: 'maxVisible',
        type: 'number',
        required: false,
        default: '3',
        description: 'Maksymalna liczba awatarów widocznych przed licznikiem nadmiaru.',
      },
      {
        name: 'size',
        type: "'xs' | 's' | 'm' | 'l' | 'xl'",
        required: false,
        default: 'm',
        description: 'Rozmiar awatarów i licznika.',
      },
      {
        name: 'shape',
        type: "'circle' | 'rounded'",
        required: false,
        default: 'circle',
        description: 'Kształt awatarów i licznika.',
      },
      {
        name: 'overlap',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Włącza kompaktowy układ z nachodzącymi na siebie elementami.',
      },
      {
        name: 'direction',
        type: "'start' | 'end'",
        required: false,
        default: 'end',
        description: 'Określa, która krawędź stosu znajduje się wizualnie na wierzchu.',
      },
      {
        name: 'overflowMode',
        type: "'count' | 'popover' | 'none'",
        required: false,
        default: 'count',
        description: 'Sposób prezentacji pozycji poza limitem.',
      },
      {
        name: 'itemKey',
        type: 'keyof AvatarGroupItem | ((item: AvatarGroupItem, index: number) => string | number)',
        required: false,
        default: 'id',
        description: 'Pole lub funkcja zwracająca stabilny klucz elementu.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        default: 'Członkowie grupy',
        description: 'Dostępna nazwa listy widocznych osób.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wyłącza wszystkie akcje grupy.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Sygnalizuje ładowanie szczegółowej listy w popoverze.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator używany w testach automatycznych.',
      },
    ],
    models: [
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Stan otwarcia kontrolowany przez v-model:open. W React dostępne są propsy open, defaultOpen i onOpenChange.',
      },
    ],
    events: [
      {
        name: 'onSelect',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „select”. W React przekaż callback onSelect.',
      },
      {
        name: 'onOverflowClick',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „overflowClick”. W React przekaż callback onOverflowClick.',
      },
    ],
    slots: [
      {
        name: 'renderItem',
        description:
          'Treść osadzana w nazwanym slocie „item”. W React jest to prop ReactNode „renderItem”.',
      },
      {
        name: 'renderOverflow',
        description:
          'Treść osadzana w nazwanym slocie „overflow”. W React jest to prop ReactNode „renderOverflow”.',
      },
      {
        name: 'popoverHeader',
        description:
          'Treść osadzana w nazwanym slocie „popover-header”. W React jest to prop ReactNode „popoverHeader”.',
      },
      {
        name: 'renderPopoverItem',
        description:
          'Treść osadzana w nazwanym slocie „popover-item”. W React jest to prop ReactNode „renderPopoverItem”.',
      },
      {
        name: 'empty',
        description:
          'Treść osadzana w nazwanym slocie „empty”. W React jest to prop ReactNode „empty”.',
      },
    ],
  },
  {
    category: 'data-display',
    categoryLabel: 'Prezentacja danych',
    name: 'CalculationResults',
    sourceName: 'CalculationResults',
    framework: 'react',
    importPath: '@peaui/ui/react/data-display/CalculationResults',
    status: 'stable',
    props: [
      {
        name: 'isLoading',
        type: 'boolean',
        required: false,
        description: 'Włącza stan ładowania i informuje o trwającej operacji.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'result',
        type: 'string',
        required: false,
        default: '-/-',
        description: 'Konfiguruje właściwość „result” komponentu.',
      },
      {
        name: 'label',
        type: 'string',
        required: true,
        description: 'Widoczna etykieta opisująca element lub pole formularza.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'isSimple',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „is simple” komponentu.',
      },
      {
        name: 'showCalculateButton',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Konfiguruje właściwość „show calculate button” komponentu.',
      },
    ],
    models: [],
    events: [
      {
        name: 'onSimulate',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „on:simulate”. W React przekaż callback onSimulate.',
      },
    ],
    slots: [
      {
        name: 'additional',
        description:
          'Treść osadzana w nazwanym slocie „additional”. W React jest to prop ReactNode „additional”.',
      },
      {
        name: 'hint',
        description:
          'Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”.',
      },
    ],
  },
  {
    category: 'data-display',
    categoryLabel: 'Prezentacja danych',
    name: 'CardCarousel',
    sourceName: 'CardCarousel',
    framework: 'react',
    importPath: '@peaui/ui/react/data-display/CardCarousel',
    status: 'stable',
    props: [
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
      {
        name: 'animationDelay',
        type: 'number',
        required: false,
        default: '2000',
        description: 'Konfiguruje właściwość „animation delay” komponentu.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'defaultVisibleSlides',
        type: 'number',
        required: false,
        description: 'Konfiguruje właściwość „default visible slides” komponentu.',
      },
      {
        name: 'defualtVisibleSlides',
        type: 'number',
        required: false,
        description: 'Konfiguruje właściwość „defualt visible slides” komponentu.',
      },
      {
        name: 'isNavigationDotsVisible',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Konfiguruje właściwość „is navigation dots visible” komponentu.',
      },
      {
        name: 'isNavigationVisible',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Konfiguruje właściwość „is navigation visible” komponentu.',
      },
      {
        name: 'withAnimation',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „with animation” komponentu.',
      },
    ],
    models: [],
    events: [],
    slots: [],
  },
  {
    category: 'data-display',
    categoryLabel: 'Prezentacja danych',
    name: 'CounterBadge',
    sourceName: 'CounterBadge',
    framework: 'react',
    importPath: '@peaui/ui/react/data-display/CounterBadge',
    status: 'stable',
    props: [
      {
        name: 'value',
        type: 'number',
        required: true,
        description: 'Bieżąca wartość kontrolowana przez v-model.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'variant',
        type: "'info' | 'error' | 'success' | 'danger'",
        required: false,
        default: 'info',
        description: 'Wariant wizualny komponentu.',
      },
      {
        name: 'size',
        type: "'s' | 'm' | 'l'",
        required: false,
        default: 's',
        description: 'Wariant rozmiaru komponentu.',
      },
    ],
    models: [],
    events: [],
    slots: [],
  },
  {
    category: 'data-display',
    categoryLabel: 'Prezentacja danych',
    name: 'DescriptionField',
    sourceName: 'DescriptionField',
    framework: 'react',
    importPath: '@peaui/ui/react/data-display/DescriptionField',
    status: 'stable',
    props: [
      {
        name: 'label',
        type: 'string',
        required: true,
        description: 'Widoczna etykieta opisująca element lub pole formularza.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'additionalBefore',
        description:
          'Treść osadzana w nazwanym slocie „additional-before”. W React jest to prop ReactNode „additionalBefore”.',
      },
      {
        name: 'hint',
        description:
          'Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”.',
      },
      {
        name: 'children',
        description: 'Główna treść React przekazywana przez children.',
      },
      {
        name: 'additionalAfter',
        description:
          'Treść osadzana w nazwanym slocie „additional-after”. W React jest to prop ReactNode „additionalAfter”.',
      },
    ],
  },
  {
    category: 'data-display',
    categoryLabel: 'Prezentacja danych',
    name: 'DisclosurePanel',
    sourceName: 'DisclosurePanel',
    framework: 'react',
    importPath: '@peaui/ui/react/data-display/DisclosurePanel',
    status: 'stable',
    props: [
      {
        name: 'title',
        type: 'string',
        required: false,
        description: 'Główny tytuł prezentowany w komponencie.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'alwaysOpen',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Keeps the panel expanded and disables its toggle interaction.',
      },
      {
        name: 'allwaysOpen',
        type: 'boolean',
        required: false,
        default: 'false',
        description: '@deprecated Use `alwaysOpen`.',
      },
    ],
    models: [
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Stan otwarcia kontrolowany przez v-model:open. W React dostępne są propsy open, defaultOpen i onOpenChange.',
      },
    ],
    events: [],
    slots: [
      {
        name: 'title',
        description:
          'Treść osadzana w nazwanym slocie „title”. W React jest to prop ReactNode „title”.',
      },
      {
        name: 'additional',
        description:
          'Treść osadzana w nazwanym slocie „additional”. W React jest to prop ReactNode „additional”.',
      },
      {
        name: 'children',
        description: 'Główna treść React przekazywana przez children.',
      },
    ],
  },
  {
    category: 'data-display',
    categoryLabel: 'Prezentacja danych',
    name: 'KeyboardKey',
    sourceName: 'KeyboardKey',
    framework: 'react',
    importPath: '@peaui/ui/react/data-display/KeyboardKey',
    status: 'stable',
    props: [
      {
        name: 'keys',
        type: 'string | readonly string[]',
        required: true,
        description:
          'Klawisz albo uporządkowana kombinacja tokenów. String rozdziela tokeny znakiem plus.',
      },
      {
        name: 'platform',
        type: 'KeyboardKeyPlatform',
        required: false,
        default: 'auto',
        description:
          'Platforma używana do mapowania przenośnego tokenu Mod i symboli modyfikatorów.',
      },
      {
        name: 'format',
        type: 'KeyboardKeyFormat',
        required: false,
        default: 'symbol',
        description: 'Symbole skracają zapis wizualny; pełne nazwy pozostają dostępne dla AT.',
      },
      {
        name: 'size',
        type: 'KeyboardKeySize',
        required: false,
        default: 's',
        description: 'Rozmiar keycapów zgodny ze skalą kompaktowych komponentów PeaUI.',
      },
      {
        name: 'inline',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Wariant inline dopasowuje komponent do wiersza tekstu; false tworzy osobny blok.',
      },
      {
        name: 'separator',
        type: 'string',
        required: false,
        default: '+',
        description: 'Wyłącznie wizualny separator kolejnych klawiszy.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        default: '',
        description: 'Pełna dostępna nazwa zastępująca automatycznie złożoną frazę.',
      },
      {
        name: 'muted',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Ogranicza kontrast nieaktywnej wizualnie wskazówki bez dodawania semantyki disabled.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny selektor testowy elementu głównego.',
      },
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'renderKey',
        description:
          'Treść osadzana w nazwanym slocie „key”. W React funkcja renderKey otrzymuje token, pełną nazwę, etykietę wizualną, platformę i indeks.',
      },
      {
        name: 'renderSeparator',
        description:
          'Treść osadzana w nazwanym slocie „separator”. W React funkcja renderSeparator otrzymuje separator i indeks kolejnego klawisza.',
      },
    ],
  },
  {
    category: 'data-display',
    categoryLabel: 'Prezentacja danych',
    name: 'SectionHeading',
    sourceName: 'SectionHeading',
    framework: 'react',
    importPath: '@peaui/ui/react/data-display/SectionHeading',
    status: 'stable',
    props: [
      {
        name: 'size',
        type: "'heading-l' | 'heading-m' | 'heading-s' | 'heading-xs' | 'xl' | 'l' | 'm' | 's'",
        required: false,
        default: 'l',
        description: 'Wariant rozmiaru komponentu.',
      },
      {
        name: 'as',
        type: "'section' | 'div' | 'header'",
        required: false,
        default: 'div',
        description: 'Konfiguruje właściwość „as” komponentu.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'variant',
        type: "'default' | 'primary' | 'secondary'",
        required: false,
        default: 'default',
        description: 'Wariant wizualny komponentu.',
      },
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'title',
        description:
          'Treść osadzana w nazwanym slocie „title”. W React jest to prop ReactNode „title”.',
      },
      {
        name: 'hint',
        description:
          'Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”.',
      },
      {
        name: 'description',
        description:
          'Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „description”.',
      },
    ],
  },
  {
    category: 'data-display',
    categoryLabel: 'Prezentacja danych',
    name: 'TableList',
    sourceName: 'TableList',
    framework: 'react',
    importPath: '@peaui/ui/react/data-display/TableList',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: false,
        default: 'list',
        description: 'Unikalny identyfikator elementu w dokumencie.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        default: 'Tabela danych',
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
      {
        name: 'isDetails',
        type: 'boolean',
        required: false,
        description: 'Enables expandable detail rows.',
      },
      {
        name: 'isDetials',
        type: 'boolean',
        required: false,
        description: '@deprecated Use `isDetails`.',
      },
      {
        name: 'additional',
        type: 'Record<string, any>',
        required: false,
        description: 'Konfiguruje właściwość „additional” komponentu.',
      },
      {
        name: 'canCreate',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Włącza możliwość dodawania nowych rekordów.',
      },
      {
        name: 'canSelectRows',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Włącza możliwość zaznaczania wierszy.',
      },
      {
        name: 'canCheckRows',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „can check rows” komponentu.',
      },
      {
        name: 'canHideColumns',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Pozwala użytkownikowi sterować widocznością kolumn.',
      },
      {
        name: 'canMultiSort',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „can multi sort” komponentu.',
      },
      {
        name: 'columns',
        type: 'TableColumn[] | any[]',
        required: false,
        default: '[]',
        description: 'Definicje kolumn określające ich etykiety, klucze i sposób renderowania.',
      },
      {
        name: 'editable',
        type: 'boolean',
        required: false,
        description: 'Włącza tryb edycji danych.',
      },
      {
        name: 'emptyDescription',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Konfiguruje właściwość „empty description” komponentu.',
      },
      {
        name: 'emptyDescriptionInline',
        type: 'string',
        required: false,
        description: 'Konfiguruje właściwość „empty description inline” komponentu.',
      },
      {
        name: 'records',
        type: 'any[]',
        required: false,
        default: '[]',
        description: 'Kolekcja rekordów prezentowanych przez komponent.',
      },
      {
        name: 'rowsPerPage',
        type: 'number',
        required: false,
        default: '10',
        description: 'Liczba rekordów wyświetlanych na jednej stronie.',
      },
      {
        name: 'currentCheckedRow',
        type: 'number | string',
        required: false,
        description: 'Konfiguruje właściwość „current checked row” komponentu.',
      },
      {
        name: 'rowsTotal',
        type: 'number',
        required: false,
        description: 'Konfiguruje właściwość „rows total” komponentu.',
      },
      {
        name: 'selectedRows',
        type: 'string[]',
        required: false,
        default: '[]',
        description: 'Identyfikatory aktualnie zaznaczonych wierszy.',
      },
      {
        name: 'sortColumn',
        type: 'string',
        required: false,
        default: 'updatedAt',
        description: 'Konfiguruje właściwość „sort column” komponentu.',
      },
      {
        name: 'sortColumns',
        type: 'TableSortState[]',
        required: false,
        default: '[]',
        description: 'Konfiguruje właściwość „sort columns” komponentu.',
      },
      {
        name: 'sortType',
        type: 'TableSortDirection',
        required: false,
        default: 'DESC',
        description: 'Konfiguruje właściwość „sort type” komponentu.',
      },
      {
        name: 'buttonEditableCreateText',
        type: 'string',
        required: false,
        default: 'Dodaj',
        description: 'Konfiguruje właściwość „button editable create text” komponentu.',
      },
      {
        name: 'titleRemoveLabel',
        type: 'string',
        required: false,
        default: 'Czy na pewno chcesz usunąć wybrany rekord?',
        description: 'Konfiguruje właściwość „title remove label” komponentu.',
      },
      {
        name: 'descriptionRemoveLabel',
        type: 'string',
        required: false,
        default: 'Usunięcie spowoduje trwałe usunięcie rekordu.',
        description: 'Konfiguruje właściwość „description remove label” komponentu.',
      },
      {
        name: 'isLoading',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Włącza stan ładowania i informuje o trwającej operacji.',
      },
      {
        name: 'scroll',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „scroll” komponentu.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
    ],
    models: [],
    events: [
      {
        name: 'onAction',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „on:action”. W React przekaż callback onAction.',
      },
      {
        name: 'onCreateRecord',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „on:createRecord”. W React przekaż callback onCreateRecord.',
      },
      {
        name: 'onRowDoubleClick',
        description:
          'Emitowane po dwukrotnym kliknięciu wiersza; przekazuje identyfikator i rekord. W React przekaż callback onRowDoubleClick.',
      },
      {
        name: 'onDbclick',
        description:
          'Przestarzała nazwa zdarzenia dwukrotnego kliknięcia. Użyj „on:dblclick”. W React przekaż callback onDbclick.',
      },
      {
        name: 'onSelectRow',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „on:select:row”. W React przekaż callback onSelectRow.',
      },
      {
        name: 'onSort',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „on:sort”. W React przekaż callback onSort.',
      },
      {
        name: 'onCancel',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „on:cancel”. W React przekaż callback onCancel.',
      },
      {
        name: 'onCheckRow',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „on:check:row”. W React przekaż callback onCheckRow.',
      },
      {
        name: 'onSubmit',
        description: 'Emitowane po zatwierdzeniu danych. W React przekaż callback onSubmit.',
      },
      {
        name: 'onChangeValue',
        description:
          'Emitowane po zmianie wartości komórki; przekazuje identyfikator rekordu i nową wartość. W React przekaż callback onChangeValue.',
      },
    ],
    slots: [
      {
        name: 'renderCell',
        description:
          'Funkcja renderCell pozwala renderować niestandardową zawartość komórki tabeli.',
      },
      {
        name: 'detailsRecord',
        description:
          'Treść osadzana w nazwanym slocie „details-record”. W React jest to prop ReactNode „detailsRecord”.',
      },
      {
        name: 'detialsRecord',
        description:
          'Treść osadzana w nazwanym slocie „detials-record”. W React jest to prop ReactNode „detialsRecord”.',
      },
      {
        name: 'additionalRow',
        description:
          'Treść osadzana w nazwanym slocie „additionalRow”. W React jest to prop ReactNode „additionalRow”.',
      },
    ],
  },
  {
    category: 'data-display',
    categoryLabel: 'Prezentacja danych',
    name: 'TableListFooter',
    sourceName: 'TableListFooter',
    framework: 'react',
    importPath: '@peaui/ui/react/data-display/TableListFooter',
    status: 'stable',
    props: [
      {
        name: 'rowsNumber',
        type: 'number',
        required: true,
        description: 'Konfiguruje właściwość „rows number” komponentu.',
      },
      {
        name: 'rowsPerPage',
        type: 'number',
        required: true,
        description: 'Liczba rekordów wyświetlanych na jednej stronie.',
      },
      {
        name: 'page',
        type: 'number',
        required: true,
        description: 'Numer aktualnie wybranej strony.',
      },
      {
        name: 'total',
        type: 'number',
        required: true,
        description: 'Łączna liczba elementów.',
      },
      {
        name: 'under',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „under” komponentu.',
      },
      {
        name: 'isFlex',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „is flex” komponentu.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
    ],
    models: [],
    events: [
      {
        name: 'onChangePage',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „on:change:page”. W React przekaż callback onChangePage.',
      },
      {
        name: 'onChangeLimit',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „on:change:limit”. W React przekaż callback onChangeLimit.',
      },
    ],
    slots: [],
  },
  {
    category: 'data-display',
    categoryLabel: 'Prezentacja danych',
    name: 'TableListHeader',
    sourceName: 'TableListHeader',
    framework: 'react',
    importPath: '@peaui/ui/react/data-display/TableListHeader',
    status: 'stable',
    props: [
      {
        name: 'buttonCreateLabel',
        type: 'string',
        required: false,
        default: 'Dodaj rekord',
        description: 'Konfiguruje właściwość „button create label” komponentu.',
      },
      {
        name: 'canCreate',
        type: 'boolean',
        required: false,
        description: 'Włącza możliwość dodawania nowych rekordów.',
      },
      {
        name: 'canExport',
        type: 'boolean',
        required: false,
        description: 'Konfiguruje właściwość „can export” komponentu.',
      },
      {
        name: 'canFilter',
        type: 'boolean',
        required: false,
        description: 'Konfiguruje właściwość „can filter” komponentu.',
      },
      {
        name: 'canSearch',
        type: 'boolean',
        required: false,
        description: 'Konfiguruje właściwość „can search” komponentu.',
      },
      {
        name: 'countFilters',
        type: 'number',
        required: false,
        description: 'Konfiguruje właściwość „count filters” komponentu.',
      },
      {
        name: 'countSelectedRecords',
        type: 'number',
        required: false,
        description: 'Konfiguruje właściwość „count selected records” komponentu.',
      },
      {
        name: 'searchPlaceholder',
        type: 'string',
        required: false,
        description: 'Konfiguruje właściwość „search placeholder” komponentu.',
      },
      {
        name: 'totalRecords',
        type: 'number',
        required: false,
        description: 'Konfiguruje właściwość „total records” komponentu.',
      },
      {
        name: 'userId',
        type: 'string',
        required: false,
        description: 'Konfiguruje właściwość „user id” komponentu.',
      },
      {
        name: 'forceExport',
        type: 'boolean',
        required: false,
        description: 'Konfiguruje właściwość „force export” komponentu.',
      },
    ],
    models: [
      {
        name: 'filtersOpen',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wartość kontrolowana przez v-model:filters-open. W React dostępne są propsy filtersOpen, defaultFiltersOpen i onFiltersOpenChange.',
      },
    ],
    events: [
      {
        name: 'onSearch',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „on:search”. W React przekaż callback onSearch.',
      },
      {
        name: 'onResetFilters',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „on:reset-filters”. W React przekaż callback onResetFilters.',
      },
      {
        name: 'onCreate',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „on:create”. W React przekaż callback onCreate.',
      },
      {
        name: 'onExport',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „on:export”. W React przekaż callback onExport.',
      },
    ],
    slots: [
      {
        name: 'filtersDrawer',
        description:
          'Treść osadzana w nazwanym slocie „filters-drawer”. W React jest to prop ReactNode „filtersDrawer”.',
      },
      {
        name: 'additionalButtons',
        description:
          'Treść osadzana w nazwanym slocie „additional-buttons”. W React jest to prop ReactNode „additionalButtons”.',
      },
      {
        name: 'additionalContent',
        description:
          'Treść osadzana w nazwanym slocie „additional-content”. W React jest to prop ReactNode „additionalContent”.',
      },
      {
        name: 'addtionalContent',
        description:
          'Treść osadzana w nazwanym slocie „addtional-content”. W React jest to prop ReactNode „addtionalContent”.',
      },
      {
        name: 'additionalDescription',
        description:
          'Treść osadzana w nazwanym slocie „additional-description”. W React jest to prop ReactNode „additionalDescription”.',
      },
      {
        name: 'addtionalDescription',
        description:
          'Treść osadzana w nazwanym slocie „addtional-description”. W React jest to prop ReactNode „addtionalDescription”.',
      },
    ],
  },
  {
    category: 'data-display',
    categoryLabel: 'Prezentacja danych',
    name: 'TagChip',
    sourceName: 'TagChip',
    framework: 'react',
    importPath: '@peaui/ui/react/data-display/TagChip',
    status: 'stable',
    props: [
      {
        name: 'size',
        type: "'xxs' | 'xs' | 's'",
        required: false,
        default: 'xs',
        description: 'Wariant rozmiaru komponentu.',
      },
      {
        name: 'variant',
        type: "'blue' | 'green' | 'red' | 'orange' | 'grey' | 'violet' | 'outline'",
        required: false,
        default: 'outline',
        description: 'Wariant wizualny komponentu.',
      },
      {
        name: 'active',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Określa aktywny element albo aktywny krok.',
      },
      {
        name: 'label',
        type: 'string',
        required: true,
        description: 'Widoczna etykieta opisująca element lub pole formularza.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'as',
        type: "'span' | 'button'",
        required: false,
        default: 'button',
        description: 'Konfiguruje właściwość „as” komponentu.',
      },
    ],
    models: [],
    events: [],
    slots: [],
  },
  {
    category: 'data-display',
    categoryLabel: 'Prezentacja danych',
    name: 'TreeList',
    sourceName: 'TreeList',
    framework: 'react',
    importPath: '@peaui/ui/react/data-display/TreeList',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: false,
        description: 'Unikalny identyfikator elementu w dokumencie.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'level',
        type: 'number',
        required: false,
        default: '1',
        description: 'Konfiguruje właściwość „level” komponentu.',
      },
      {
        name: 'isLast',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „is last” komponentu.',
      },
      {
        name: 'canRemove',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „can remove” komponentu.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
    ],
    models: [
      {
        name: 'tree',
        type: 'TreeListType',
        required: false,
        default: "({ children: {}, label: '' })",
        description:
          'Dane drzewa kontrolowane przez v-model:tree. W React dostępne są propsy tree, defaultTree i onTreeChange.',
      },
    ],
    events: [
      {
        name: 'onRemove',
        description: 'Emitowane po wybraniu akcji usunięcia. W React przekaż callback onRemove.',
      },
    ],
    slots: [
      {
        name: 'children',
        description: 'Główna treść React przekazywana przez children.',
      },
    ],
  },
  {
    category: 'data-display',
    categoryLabel: 'Prezentacja danych',
    name: 'VirtualList',
    sourceName: 'VirtualList',
    framework: 'react',
    importPath: '@peaui/ui/react/data-display/VirtualList',
    status: 'stable',
    props: [
      {
        name: 'items',
        type: 'readonly VirtualListItem[]',
        required: false,
        default: '[]',
        description: 'Kolekcja danych. W DOM pozostaje wyłącznie widoczny zakres z overscanem.',
      },
      {
        name: 'itemSize',
        type: 'number',
        required: false,
        default: '64',
        description: 'Stała wysokość pojedynczego elementu w pikselach.',
      },
      {
        name: 'overscan',
        type: 'number',
        required: false,
        default: '4',
        description: 'Liczba dodatkowych elementów renderowanych przed i za viewportem.',
      },
      {
        name: 'height',
        type: 'number | string',
        required: false,
        default: '320',
        description: 'Wysokość viewportu jako liczba pikseli albo poprawna wartość CSS.',
      },
      {
        name: 'itemKey',
        type: 'VirtualListItemKeyResolver',
        required: false,
        default: 'id',
        description: 'Pole lub funkcja zwracająca stabilny klucz string/number.',
      },
      {
        name: 'itemLabel',
        type: 'VirtualListItemLabelResolver',
        required: false,
        default: 'label',
        description: 'Pole lub funkcja zwracająca domyślną widoczną etykietę.',
      },
      {
        name: 'semanticRole',
        type: 'VirtualListRole',
        required: false,
        default: 'list',
        description: 'Semantyka neutralnej listy albo interaktywnego listboxa.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        default: 'Lista wirtualna',
        description: 'Dostępna nazwa viewportu i listboxa.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Pokazuje początkowy albo przyrostowy stan ładowania.',
      },
      {
        name: 'hasMore',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Informuje, że aplikacja może dołączyć kolejne elementy po zdarzeniu reachEnd.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        default: '',
        description: 'Jawny komunikat błędu prezentowany zamiast pustego stanu.',
      },
      {
        name: 'emptyTitle',
        type: 'string',
        required: false,
        default: 'Brak elementów',
        description: 'Tytuł domyślnego pustego stanu.',
      },
      {
        name: 'emptyDescription',
        type: 'string',
        required: false,
        default: 'Lista nie zawiera jeszcze żadnych elementów.',
        description: 'Opis domyślnego pustego stanu.',
      },
      {
        name: 'endLabel',
        type: 'string',
        required: false,
        default: 'Koniec listy',
        description: 'Tekst wyświetlany po osiągnięciu kompletnego końca listy.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny selektor testowy elementu głównego.',
      },
    ],
    models: [
      {
        name: 'activeIndex',
        type: 'number | null',
        required: false,
        default: 'null',
        description:
          'Indeks aktywnego elementu kontrolowany przez v-model:activeIndex. W React dostępne są propsy activeIndex, defaultActiveIndex i onActiveIndexChange.',
      },
    ],
    events: [
      {
        name: 'onVisibleRangeChange',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „visibleRangeChange”. W React przekaż callback onVisibleRangeChange.',
      },
      {
        name: 'onReachEnd',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „reachEnd”. W React przekaż callback onReachEnd.',
      },
      {
        name: 'onScroll',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „scroll”. W React przekaż callback onScroll.',
      },
      {
        name: 'onItemFocus',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „itemFocus”. W React przekaż callback onItemFocus.',
      },
      {
        name: 'onMeasureError',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „measureError”. W React przekaż callback onMeasureError.',
      },
    ],
    slots: [
      {
        name: 'item',
        description:
          'Treść osadzana w nazwanym slocie „item”. W React jest to prop ReactNode „item”.',
      },
      {
        name: 'empty',
        description:
          'Treść osadzana w nazwanym slocie „empty”. W React jest to prop ReactNode „empty”.',
      },
      {
        name: 'loading',
        description:
          'Treść osadzana w nazwanym slocie „loading”. W React jest to prop ReactNode „loading”.',
      },
      {
        name: 'before',
        description:
          'Treść osadzana w nazwanym slocie „before”. W React jest to prop ReactNode „before”.',
      },
      {
        name: 'after',
        description:
          'Treść osadzana w nazwanym slocie „after”. W React jest to prop ReactNode „after”.',
      },
      {
        name: 'footer',
        description:
          'Treść osadzana w nazwanym slocie „footer”. W React jest to prop ReactNode „footer”.',
      },
    ],
  },
  {
    category: 'data-entry',
    categoryLabel: 'Wprowadzanie danych',
    name: 'ButtonAction',
    sourceName: 'ButtonAction',
    framework: 'react',
    importPath: '@peaui/ui/react/data-entry/ButtonAction',
    status: 'stable',
    props: [
      {
        name: 'size',
        type: "'xxs' | 'xs' | 's' | 'm' | 'l'",
        required: false,
        default: 'm',
        description: 'Wariant rozmiaru komponentu.',
      },
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'ghost' | 'danger'",
        required: false,
        default: 'primary',
        description: 'Wariant wizualny komponentu.',
      },
      {
        name: 'type',
        type: "'button' | 'submit' | 'reset'",
        required: false,
        default: 'button',
        description: 'Wariant funkcjonalny lub wizualny komponentu.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'useAriaLabel',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „use aria label” komponentu.',
      },
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'children',
        description: 'Główna treść React przekazywana przez children.',
      },
    ],
  },
  {
    category: 'data-entry',
    categoryLabel: 'Wprowadzanie danych',
    name: 'ButtonExport',
    sourceName: 'ButtonExport',
    framework: 'react',
    importPath: '@peaui/ui/react/data-entry/ButtonExport',
    status: 'stable',
    props: [
      {
        name: 'size',
        type: "'xs' | 's' | 'm' | 'l'",
        required: false,
        default: 'm',
        description: 'Wariant rozmiaru komponentu.',
      },
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'ghost' | 'danger'",
        required: false,
        default: 'secondary',
        description: 'Wariant wizualny komponentu.',
      },
      {
        name: 'type',
        type: "'button' | 'submit' | 'reset'",
        required: false,
        description: 'Wariant funkcjonalny lub wizualny komponentu.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
      {
        name: 'placement',
        type: "| 'top'\n  | 'right'\n  | 'bottom'\n  | 'left'\n  | 'top-left'\n  | 'top-right'\n  | 'bottom-left'\n  | 'bottom-right'",
        required: false,
        default: 'bottom',
        description: 'Konfiguruje właściwość „placement” komponentu.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'selectedItemsCount',
        type: 'number',
        required: false,
        default: '0',
        description: 'Konfiguruje właściwość „selected items count” komponentu.',
      },
      {
        name: 'forceExport',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „force export” komponentu.',
      },
      {
        name: 'useAriaLabel',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „use aria label” komponentu.',
      },
    ],
    models: [],
    events: [
      {
        name: 'onExport',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „on:export”. W React przekaż callback onExport.',
      },
    ],
    slots: [
      {
        name: 'children',
        description: 'Główna treść React przekazywana przez children.',
      },
    ],
  },
  {
    category: 'data-entry',
    categoryLabel: 'Wprowadzanie danych',
    name: 'CopyButton',
    sourceName: 'CopyButton',
    framework: 'react',
    importPath: '@peaui/ui/react/data-entry/CopyButton',
    status: 'stable',
    props: [
      {
        name: 'text',
        type: 'string',
        required: false,
        default: '',
        description: 'Dokładna wartość tekstowa kopiowana, gdy getText nie został przekazany.',
      },
      {
        name: 'getText',
        type: '() => string | Promise<string>',
        required: false,
        description: 'Pobiera wartość w chwili aktywacji; obsługuje również źródła asynchroniczne.',
      },
      {
        name: 'resetDelay',
        type: 'number',
        required: false,
        default: '2000',
        description: 'Czas powrotu ukończonej operacji do stanu początkowego; zero zachowuje stan.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        default: 'Kopiuj',
        description: 'Stała dostępna nazwa akcji i domyślna widoczna etykieta.',
      },
      {
        name: 'copiedLabel',
        type: 'string',
        required: false,
        default: 'Skopiowano',
        description: 'Widoczny i ogłaszany komunikat powodzenia.',
      },
      {
        name: 'errorLabel',
        type: 'string',
        required: false,
        default: 'Nie udało się skopiować',
        description: 'Widoczny i ogłaszany komunikat błędu.',
      },
      {
        name: 'loadingLabel',
        type: 'string',
        required: false,
        default: 'Kopiowanie',
        description: 'Widoczny tekst podczas trwającej operacji asynchronicznej.',
      },
      {
        name: 'content',
        type: "'icon' | 'text' | 'icon-text'",
        required: false,
        default: 'icon-text',
        description: 'Określa, czy przycisk wyświetla ikonę, tekst, czy oba elementy.',
      },
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'ghost' | 'danger'",
        required: false,
        default: 'secondary',
        description: 'Wariant wizualny zgodny z ButtonAction.',
      },
      {
        name: 'size',
        type: "'xxs' | 'xs' | 's' | 'm' | 'l'",
        required: false,
        default: 'm',
        description: 'Rozmiar zgodny ze skalą ButtonAction.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Stan zajętości kontrolowany z zewnątrz.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Blokuje aktywację.',
      },
      {
        name: 'showStatus',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wyświetla komunikat stanu obok akcji zamiast wyłącznie dla czytnika ekranu.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        default: '',
        description: 'Opcjonalna stała dostępna nazwa zastępująca label.',
      },
      {
        name: 'type',
        type: "'button' | 'submit' | 'reset'",
        required: false,
        default: 'button',
        description: 'Natywny typ przycisku.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stały identyfikator używany w testach automatycznych.',
      },
    ],
    models: [],
    events: [
      {
        name: 'onCopy',
        description:
          'Emitowane po rozwiązaniu dokładnego tekstu i przed próbą zapisu do schowka. W React przekaż callback onCopy.',
      },
      {
        name: 'onSuccess',
        description:
          'Emitowane po poprawnym zakończeniu operacji komponentu. W React przekaż callback onSuccess.',
      },
      {
        name: 'onError',
        description:
          'Emitowane, gdy operacja komponentu kończy się błędem. W React przekaż callback onError.',
      },
      {
        name: 'onStatusChange',
        description:
          'Emitowane po każdej wewnętrznej zmianie statusu operacji. W React przekaż callback onStatusChange.',
      },
    ],
    slots: [
      {
        name: 'children',
        description: 'Główna treść React przekazywana przez children.',
      },
      {
        name: 'icon',
        description:
          'Treść osadzana w nazwanym slocie „icon”. W React jest to prop ReactNode „icon”.',
      },
      {
        name: 'copiedIcon',
        description:
          'Treść osadzana w nazwanym slocie „copied-icon”. W React jest to prop ReactNode „copiedIcon”.',
      },
      {
        name: 'status',
        description:
          'Treść osadzana w nazwanym slocie „status”. W React jest to prop ReactNode „status”.',
      },
    ],
  },
  {
    category: 'data-entry',
    categoryLabel: 'Wprowadzanie danych',
    name: 'InlineEdit',
    sourceName: 'InlineEdit',
    framework: 'react',
    importPath: '@peaui/ui/react/data-entry/InlineEdit',
    status: 'stable',
    props: [
      {
        name: 'editor',
        type: 'InlineEditEditor',
        required: false,
        default: 'text',
        description: 'Rodzaj wbudowanego edytora albo własna kontrolka ze slotu editor.',
      },
      {
        name: 'editorProps',
        type: 'Record<string, unknown>',
        required: false,
        default: '{}',
        description: 'Właściwości przekazywane do istniejącego komponentu formularza.',
      },
      {
        name: 'activation',
        type: 'InlineEditActivation',
        required: false,
        default: 'button',
        description: 'Dodatkowy sposób rozpoczęcia edycji; przycisk pozostaje zawsze dostępny.',
      },
      {
        name: 'actions',
        type: 'InlineEditActions',
        required: false,
        default: 'both',
        description: 'Widoczne przyciski, skróty klawiaturowe albo oba mechanizmy zapisu.',
      },
      {
        name: 'display',
        type: 'InlineEditDisplay',
        required: false,
        default: 'inline',
        description: 'Układ dopasowany do tekstu lub zajmujący pełną szerokość.',
      },
      {
        name: 'tabBehavior',
        type: 'InlineEditTabBehavior',
        required: false,
        default: 'commit',
        description: 'Zachowanie klawisza Tab podczas edycji.',
      },
      {
        name: 'saveMode',
        type: 'InlineEditSaveMode',
        required: false,
        default: 'sync',
        description: 'Zapis lokalny albo asynchroniczny sterowany przez aplikację.',
      },
      {
        name: 'validate',
        type: 'InlineEditValidate',
        required: false,
        description: 'Synchroniczna walidacja szkicu przed zapisem.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Oczekiwanie na zewnętrzny zapis.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        description: 'Błąd zwrócony przez zewnętrzny zapis.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Ustawia komponent w trybie tylko do odczytu.',
      },
      {
        name: 'emptyText',
        type: 'string',
        required: false,
        default: 'Brak wartości',
        description: 'Konfiguruje właściwość „empty text” komponentu.',
      },
      {
        name: 'editAriaLabel',
        type: 'string',
        required: false,
        default: 'Edytuj wartość',
        description: 'Konfiguruje właściwość „edit aria label” komponentu.',
      },
      {
        name: 'saveLabel',
        type: 'string',
        required: false,
        default: 'Zapisz',
        description: 'Konfiguruje właściwość „save label” komponentu.',
      },
      {
        name: 'cancelLabel',
        type: 'string',
        required: false,
        default: 'Anuluj',
        description: 'Konfiguruje właściwość „cancel label” komponentu.',
      },
      {
        name: 'loadingLabel',
        type: 'string',
        required: false,
        default: 'Zapisywanie zmian',
        description: 'Dostępny komunikat opisujący trwającą operację.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'InlineEditValue',
        required: false,
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange.',
      },
      {
        name: 'editing',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wartość kontrolowana przez v-model:editing. W React dostępne są propsy editing, defaultEditing i onEditingChange.',
      },
    ],
    events: [],
    slots: [
      {
        name: 'display',
        description:
          'Treść osadzana w nazwanym slocie „display”. W React jest to prop ReactNode „display”.',
      },
      {
        name: 'empty',
        description:
          'Treść osadzana w nazwanym slocie „empty”. W React jest to prop ReactNode „empty”.',
      },
      {
        name: 'editor',
        description:
          'Treść osadzana w nazwanym slocie „editor”. W React jest to prop ReactNode „editor”.',
      },
      {
        name: 'error',
        description:
          'Treść osadzana w nazwanym slocie „error”. W React jest to prop ReactNode „error”.',
      },
      {
        name: 'actions',
        description:
          'Treść osadzana w nazwanym slocie „actions”. W React jest to prop ReactNode „actions”.',
      },
    ],
  },
  {
    category: 'data-entry',
    categoryLabel: 'Wprowadzanie danych',
    name: 'InputSlider',
    sourceName: 'InputSlider',
    framework: 'react',
    importPath: '@peaui/ui/react/data-entry/InputSlider',
    status: 'stable',
    props: [
      {
        name: 'name',
        type: 'string',
        required: true,
        description: 'Nazwa pola używana przez formularz lub nazwa zasobu.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'number',
        required: false,
        default: '0',
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange.',
      },
    ],
    events: [],
    slots: [],
  },
  {
    category: 'data-entry',
    categoryLabel: 'Wprowadzanie danych',
    name: 'SearchInput',
    sourceName: 'SearchInput',
    framework: 'react',
    importPath: '@peaui/ui/react/data-entry/SearchInput',
    status: 'stable',
    props: [
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        default: 'Pole wyszukiwania',
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: 'Wpisz czego szukasz',
        description: 'Tekst pomocniczy widoczny przed wprowadzeniem wartości.',
      },
      {
        name: 'debounceTime',
        type: 'number',
        required: false,
        default: '1000',
        description: 'Konfiguruje właściwość „debounce time” komponentu.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string | undefined',
        required: false,
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange.',
      },
    ],
    events: [
      {
        name: 'onSearch',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „on:search”. W React przekaż callback onSearch.',
      },
      {
        name: 'onRemove',
        description: 'Emitowane po wybraniu akcji usunięcia. W React przekaż callback onRemove.',
      },
    ],
    slots: [],
  },
  {
    category: 'data-entry',
    categoryLabel: 'Wprowadzanie danych',
    name: 'SegmentedControl',
    sourceName: 'SegmentedControl',
    framework: 'react',
    importPath: '@peaui/ui/react/data-entry/SegmentedControl',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: false,
        description: 'Identyfikator grupy radio.',
      },
      {
        name: 'name',
        type: 'string',
        required: false,
        default: '',
        description: 'Nazwa ukrytego pola wysyłanego z formularzem.',
      },
      {
        name: 'items',
        type: 'SegmentedControlItem[]',
        required: false,
        default: '[]',
        description: 'Niewielki zestaw wzajemnie wykluczających się pozycji.',
      },
      {
        name: 'size',
        type: "'s' | 'm' | 'l'",
        required: false,
        default: 'm',
        description: 'Rozmiar wszystkich segmentów.',
      },
      {
        name: 'distribution',
        type: "'equal' | 'auto'",
        required: false,
        default: 'equal',
        description: 'Równy albo naturalny rozkład szerokości segmentów.',
      },
      {
        name: 'fullWidth',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Rozciąga kontrolkę do szerokości kontenera.',
      },
      {
        name: 'content',
        type: "'text' | 'icon' | 'icon-text'",
        required: false,
        default: 'text',
        description: 'Prezentuje tekst, ikonę albo oba elementy.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wyłącza całą kontrolkę i usuwa ją z kolejności tabulatora.',
      },
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        required: false,
        default: 'horizontal',
        description: 'Kierunek układu oraz nawigacji klawiaturą.',
      },
      {
        name: 'activation',
        type: "'automatic' | 'manual'",
        required: false,
        default: 'automatic',
        description: 'Określa, czy nawigacja od razu wybiera segment, czy tylko przenosi fokus.',
      },
      {
        name: 'loop',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Zapętla nawigację pomiędzy skrajnymi dostępnymi segmentami.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        default: 'Wybór opcji',
        description: 'Dostępna nazwa grupy radio.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        default: '',
        description: 'Stabilny selektor do testów integracyjnych.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'SegmentedControlValue | null',
        required: false,
        default: 'null',
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange.',
      },
    ],
    events: [
      {
        name: 'onChange',
        description:
          'Emitowane po zmianie wartości przez użytkownika. W React przekaż callback onChange.',
      },
      {
        name: 'onFocusChange',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „focusChange”. W React przekaż callback onFocusChange.',
      },
    ],
    slots: [
      {
        name: 'renderItem',
        description:
          'Treść osadzana w nazwanym slocie „item”. W React jest to funkcja renderItem otrzymująca element oraz stan selected, disabled i index.',
      },
      {
        name: 'renderItemIcon',
        description:
          'Treść osadzana w nazwanym slocie „item-icon”. W React jest to funkcja renderItemIcon otrzymująca element oraz stan selected i index.',
      },
      {
        name: 'renderIndicator',
        description:
          'Treść osadzana w nazwanym slocie „indicator”. W React jest to funkcja renderIndicator otrzymująca wybrany element i index.',
      },
    ],
  },
  {
    category: 'data-entry',
    categoryLabel: 'Wprowadzanie danych',
    name: 'SelectableCard',
    sourceName: 'SelectableCard',
    framework: 'react',
    importPath: '@peaui/ui/react/data-entry/SelectableCard',
    status: 'stable',
    props: [
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Ustawia komponent w trybie tylko do odczytu.',
      },
      {
        name: 'active',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Określa aktywny element albo aktywny krok.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'title',
        description:
          'Treść osadzana w nazwanym slocie „title”. W React jest to prop ReactNode „title”.',
      },
      {
        name: 'description',
        description:
          'Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „description”.',
      },
      {
        name: 'additional',
        description:
          'Treść osadzana w nazwanym slocie „additional”. W React jest to prop ReactNode „additional”.',
      },
      {
        name: 'hint',
        description:
          'Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”.',
      },
    ],
  },
  {
    category: 'data-entry',
    categoryLabel: 'Wprowadzanie danych',
    name: 'SplitButton',
    sourceName: 'SplitButton',
    framework: 'react',
    importPath: '@peaui/ui/react/data-entry/SplitButton',
    status: 'stable',
    props: [
      {
        name: 'label',
        type: 'string',
        required: true,
        description: 'Widoczna etykieta oraz awaryjna dostępna nazwa głównej akcji.',
      },
      {
        name: 'items',
        type: 'DropdownMenuItem[]',
        required: false,
        default: '[]',
        description: 'Akcje alternatywne renderowane przez DropdownMenu.',
      },
      {
        name: 'icon',
        type: 'string',
        required: false,
        description: 'Opcjonalna nazwa ikony PeaUI poprzedzającej etykietę.',
      },
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'danger'",
        required: false,
        default: 'primary',
        description: 'Wariant kolorystyczny obu części kontrolki.',
      },
      {
        name: 'size',
        type: "'xxs' | 'xs' | 's' | 'm' | 'l'",
        required: false,
        default: 'm',
        description: 'Rozmiar zgodny z ButtonAction.',
      },
      {
        name: 'type',
        type: "'button' | 'submit' | 'reset'",
        required: false,
        default: 'button',
        description: 'Natywny typ przycisku głównej akcji.',
      },
      {
        name: 'menuAlign',
        type: "'start' | 'end'",
        required: false,
        default: 'end',
        description: 'Wyrównanie powierzchni menu do początku lub końca kontrolki.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wyłącza obie części kontrolki.',
      },
      {
        name: 'primaryDisabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wyłącza wyłącznie główną akcję.',
      },
      {
        name: 'menuDisabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wyłącza wyłącznie trigger menu i zamyka otwarte menu.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Blokuje główną akcję i pokazuje jej stan zajętości; menu pozostaje niezależne.',
      },
      {
        name: 'menuLoading',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Pokazuje dostępny stan ładowania wewnątrz otwartego menu.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        description: 'Dostępna nazwa grupy dwóch przycisków.',
      },
      {
        name: 'menuAriaLabel',
        type: 'string',
        required: false,
        description: 'Dostępna nazwa przycisku otwierającego menu.',
      },
      {
        name: 'loadingLabel',
        type: 'string',
        required: false,
        default: 'Trwa wykonywanie głównej akcji',
        description: 'Tekst statusu głównej akcji przekazywany technologiom asystującym.',
      },
      {
        name: 'menuLoadingLabel',
        type: 'string',
        required: false,
        default: 'Ładowanie menu…',
        description: 'Tekst dostępnego stanu ładowania menu.',
      },
      {
        name: 'emptyLabel',
        type: 'string',
        required: false,
        default: 'Brak dostępnych akcji',
        description: 'Tekst pustego stanu menu.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator używany w testach automatycznych.',
      },
    ],
    models: [
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Stan otwarcia kontrolowany przez v-model:open. W React dostępne są propsy open, defaultOpen i onOpenChange.',
      },
    ],
    events: [
      {
        name: 'onPrimaryClick',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „primaryClick”. W React przekaż callback onPrimaryClick.',
      },
      {
        name: 'onSelect',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „select”. W React przekaż callback onSelect.',
      },
    ],
    slots: [
      {
        name: 'children',
        description: 'Główna treść React przekazywana przez children.',
      },
      {
        name: 'labelContent',
        description:
          'Treść osadzana w nazwanym slocie „label”. W React jest to prop ReactNode „labelContent”.',
      },
      {
        name: 'iconContent',
        description:
          'Treść osadzana w nazwanym slocie „icon”. W React jest to prop ReactNode „iconContent”.',
      },
      {
        name: 'menuTriggerIconContent',
        description:
          'Treść osadzana w nazwanym slocie „menu-trigger-icon”. W React jest to prop ReactNode „menuTriggerIconContent”.',
      },
      {
        name: 'renderMenuItem',
        description:
          'Treść osadzana w nazwanym slocie „menu-item”. W React jest to funkcja renderująca otrzymująca pozycję menu i jej ścieżkę.',
      },
      {
        name: 'renderMenuItemIcon',
        description:
          'Treść osadzana w nazwanym slocie „menu-item-icon”. W React jest to funkcja renderująca otrzymująca pozycję menu i jej ścieżkę.',
      },
      {
        name: 'renderMenuItemShortcut',
        description:
          'Treść osadzana w nazwanym slocie „menu-item-shortcut”. W React jest to funkcja renderująca otrzymująca pozycję menu i jej ścieżkę.',
      },
      {
        name: 'renderGroupLabel',
        description:
          'Treść osadzana w nazwanym slocie „group-label”. W React jest to funkcja renderująca otrzymująca pozycję menu i jej ścieżkę.',
      },
      {
        name: 'emptyContent',
        description:
          'Treść osadzana w nazwanym slocie „empty”. W React jest to prop ReactNode „emptyContent”.',
      },
      {
        name: 'menuLoadingContent',
        description:
          'Treść osadzana w nazwanym slocie „menu-loading”. W React jest to prop ReactNode „menuLoadingContent”.',
      },
    ],
  },
  {
    category: 'data-entry',
    categoryLabel: 'Wprowadzanie danych',
    name: 'ToggleButton',
    sourceName: 'ToggleButton',
    framework: 'react',
    importPath: '@peaui/ui/react/data-entry/ToggleButton',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: false,
        description: 'Identyfikator natywnego przycisku.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        default: 'Przełącz',
        description: 'Stała etykieta widoczna w stanie nieaktywnym i używana jako dostępna nazwa.',
      },
      {
        name: 'pressedLabel',
        type: 'string',
        required: false,
        default: '',
        description: 'Opcjonalna etykieta widoczna po włączeniu; nie zmienia dostępnej nazwy.',
      },
      {
        name: 'icon',
        type: 'string',
        required: false,
        default: '',
        description: 'Nazwa dekoracyjnej ikony SvgIcon.',
      },
      {
        name: 'pressedIcon',
        type: 'string',
        required: false,
        default: '',
        description: 'Opcjonalna ikona dekoracyjna widoczna po włączeniu.',
      },
      {
        name: 'content',
        type: "'text' | 'icon' | 'icon-text'",
        required: false,
        default: 'icon-text',
        description: 'Określa, czy przycisk pokazuje tekst, ikonę czy oba elementy.',
      },
      {
        name: 'variant',
        type: "'default' | 'outline' | 'ghost'",
        required: false,
        default: 'default',
        description: 'Wariant wizualny powierzchni.',
      },
      {
        name: 'size',
        type: "'xxs' | 'xs' | 's' | 'm' | 'l'",
        required: false,
        default: 'm',
        description: 'Rozmiar zgodny ze skalą ButtonAction; cel dotykowy zachowuje minimum 44 px.',
      },
      {
        name: 'type',
        type: "'button' | 'submit' | 'reset'",
        required: false,
        default: 'button',
        description: 'Typ natywnego przycisku.',
      },
      {
        name: 'allowWrap',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Pozwala jawnie zawijać długi tekst zamiast utrzymywać go w jednym wierszu.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wyłącza kontrolkę i usuwa ją z kolejności fokusu.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Blokuje zmianę, ale pozostawia kontrolkę w kolejności fokusu.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Blokuje zmianę i eksponuje stan zajętości.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        default: '',
        description: 'Stała dostępna nazwa, wymagana dla przycisku wyłącznie ikonowego bez label.',
      },
      {
        name: 'loadingLabel',
        type: 'string',
        required: false,
        default: 'Trwa aktualizowanie ustawienia',
        description: 'Dostępny komunikat stanu ładowania.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator używany w testach automatycznych.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange.',
      },
    ],
    events: [
      {
        name: 'onChange',
        description:
          'Emitowane po zmianie wartości przez użytkownika. W React przekaż callback onChange.',
      },
      {
        name: 'onClick',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „click”. W React przekaż callback onClick.',
      },
    ],
    slots: [
      {
        name: 'children',
        description: 'Główna treść React przekazywana przez children.',
      },
      {
        name: 'iconContent',
        description:
          'Treść osadzana w nazwanym slocie „icon”. W React jest to prop ReactNode „iconContent”.',
      },
      {
        name: 'pressedIconContent',
        description:
          'Treść osadzana w nazwanym slocie „pressed-icon”. W React jest to prop ReactNode „pressedIconContent”.',
      },
    ],
  },
  {
    category: 'data-entry',
    categoryLabel: 'Wprowadzanie danych',
    name: 'ToggleGroup',
    sourceName: 'ToggleGroup',
    framework: 'react',
    importPath: '@peaui/ui/react/data-entry/ToggleGroup',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: false,
        description: 'Identyfikator grupy i powiązanych opisów.',
      },
      {
        name: 'name',
        type: 'string',
        required: false,
        default: '',
        description: 'Nazwa ukrytych pól przekazywanych z formularzem.',
      },
      {
        name: 'items',
        type: 'ToggleGroupItem[]',
        required: false,
        default: '[]',
        description: 'Pozycje zarządzane przez komponent.',
      },
      {
        name: 'type',
        type: "'single' | 'multiple'",
        required: false,
        default: 'single',
        description: 'Tryb pojedynczego albo wielokrotnego wyboru.',
      },
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        required: false,
        default: 'horizontal',
        description: 'Kierunek układu i nawigacji klawiaturą.',
      },
      {
        name: 'appearance',
        type: "'separate' | 'attached'",
        required: false,
        default: 'separate',
        description: 'Oddzielny albo połączony wygląd przycisków.',
      },
      {
        name: 'semanticRole',
        type: "'toolbar' | 'group'",
        required: false,
        default: 'toolbar',
        description: 'Semantyka dostępności grupy.',
      },
      {
        name: 'overflow',
        type: "'wrap' | 'scroll'",
        required: false,
        default: 'wrap',
        description: 'Zachowanie grupy przy braku miejsca.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wymaga co najmniej jednej wybranej pozycji.',
      },
      {
        name: 'allowEmpty',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Pozwala wyłączyć ostatnią aktywną pozycję, gdy grupa nie jest wymagana.',
      },
      {
        name: 'loop',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Zapętla nawigację strzałkami pomiędzy skrajnymi pozycjami.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wyłącza całą grupę i usuwa ją z kolejności tabulatora.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Blokuje zmianę wartości, zachowując możliwość odczytu i fokusu.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        default: '',
        description: 'Widoczna etykieta grupy.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        default: '',
        description: 'Zewnętrzny komunikat błędu.',
      },
      {
        name: 'requiredMessage',
        type: 'string',
        required: false,
        default: 'Wybierz co najmniej jedną opcję.',
        description: 'Komunikat używany dla pustej wymaganej grupy.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        default: '',
        description: 'Dostępna nazwa, gdy widoczna etykieta nie jest potrzebna.',
      },
      {
        name: 'size',
        type: "'xxs' | 'xs' | 's' | 'm' | 'l'",
        required: false,
        default: 'm',
        description: 'Rozmiar wszystkich przycisków.',
      },
      {
        name: 'variant',
        type: "'default' | 'outline' | 'ghost'",
        required: false,
        default: 'outline',
        description: 'Wariant wizualny wszystkich przycisków.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        default: '',
        description: 'Stabilny selektor do testów integracyjnych.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'ToggleGroupModelValue',
        required: false,
        default: 'null',
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange.',
      },
    ],
    events: [
      {
        name: 'onChange',
        description:
          'Emitowane po zmianie wartości przez użytkownika. W React przekaż callback onChange.',
      },
      {
        name: 'onFocusChange',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „focusChange”. W React przekaż callback onFocusChange.',
      },
    ],
    slots: [
      {
        name: 'renderItem',
        description:
          'Treść osadzana w nazwanym slocie „item”. W React jest to funkcja renderItem otrzymująca element oraz stan pressed, disabled i index.',
      },
      {
        name: 'labelContent',
        description:
          'Treść osadzana w nazwanym slocie „label”. W React jest to prop ReactNode „labelContent”.',
      },
      {
        name: 'errorContent',
        description:
          'Treść osadzana w nazwanym slocie „error”. W React jest to prop ReactNode „errorContent”.',
      },
    ],
  },
  {
    category: 'data-entry',
    categoryLabel: 'Wprowadzanie danych',
    name: 'TransferList',
    sourceName: 'TransferList',
    framework: 'react',
    importPath: '@peaui/ui/react/data-entry/TransferList',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator komponentu i jego relacji ARIA.',
      },
      {
        name: 'items',
        type: 'readonly TransferListItem[]',
        required: false,
        default: '[]',
        description: 'Pełny katalog elementów. Pierwszy element o danym kluczu wygrywa.',
      },
      {
        name: 'itemKey',
        type: 'TransferListKeyResolver',
        required: false,
        default: 'key',
        description: 'Pole lub funkcja zwracająca stabilny klucz string/number.',
      },
      {
        name: 'itemLabel',
        type: 'TransferListLabelResolver',
        required: false,
        default: 'label',
        description: 'Pole lub funkcja zwracająca widoczną etykietę.',
      },
      {
        name: 'searchable',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Pokazuje niezależny filtr w obu panelach.',
      },
      {
        name: 'sort',
        type: 'TransferListSort',
        required: false,
        default: 'false',
        description: 'Sortowanie widoku; false zachowuje kolejność źródłową.',
      },
      {
        name: 'preserveOrder',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Zachowuje kolejność tablicy value w panelu docelowym.',
      },
      {
        name: 'disabledKeys',
        type: 'readonly TransferListKey[]',
        required: false,
        default: '[]',
        description: 'Klucze blokowane niezależnie od pola disabled elementu.',
      },
      {
        name: 'loading',
        type: 'boolean | TransferListLoadingState',
        required: false,
        default: 'false',
        description: 'Stan ładowania całego komponentu albo wybranego panelu.',
      },
      {
        name: 'labels',
        type: 'Partial<TransferListLabels>',
        required: false,
        default: '({})',
        description: 'Lokalizowane teksty interfejsu.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wyłącza wszystkie operacje i usuwa listy z kolejności Tab.',
      },
      {
        name: 'orientation',
        type: 'TransferListOrientation',
        required: false,
        default: 'horizontal',
        description: 'Preferowany układ; horizontal automatycznie składa się na mobile.',
      },
      {
        name: 'size',
        type: 'TransferListSize',
        required: false,
        default: 'standard',
        description: 'Standardowa lub kompaktowa gęstość wierszy.',
      },
      {
        name: 'locale',
        type: 'string',
        required: false,
        default: 'pl-PL',
        description: 'Locale filtrowania i sortowania.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        default: 'Przenoszenie elementów między listami',
        description: 'Dostępna nazwa całego przepływu.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        default: '',
        description: 'Opcjonalny błąd wspólny dla obu list.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny selektor testowy.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'TransferListKey[]',
        required: false,
        default: '[]',
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange.',
      },
      {
        name: 'sourceSelected',
        type: 'TransferListKey[]',
        required: false,
        default: '[]',
        description:
          'Wartość kontrolowana przez v-model:sourceSelected. W React dostępne są propsy sourceSelected, defaultSourceSelected i onSourceSelectedChange.',
      },
      {
        name: 'targetSelected',
        type: 'TransferListKey[]',
        required: false,
        default: '[]',
        description:
          'Wartość kontrolowana przez v-model:targetSelected. W React dostępne są propsy targetSelected, defaultTargetSelected i onTargetSelectedChange.',
      },
    ],
    events: [
      {
        name: 'onMove',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „move”. W React przekaż callback onMove.',
      },
      {
        name: 'onSearch',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „search”. W React przekaż callback onSearch.',
      },
      {
        name: 'onSelectionChange',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „selectionChange”. W React przekaż callback onSelectionChange.',
      },
    ],
    slots: [
      {
        name: 'renderSourceHeader',
        description:
          'Treść osadzana w nazwanym slocie „source-header”. W React jest to funkcja „renderSourceHeader” otrzymująca stan właściwy dla panelu lub elementu.',
      },
      {
        name: 'renderTargetHeader',
        description:
          'Treść osadzana w nazwanym slocie „target-header”. W React jest to funkcja „renderTargetHeader” otrzymująca stan właściwy dla panelu lub elementu.',
      },
      {
        name: 'renderItem',
        description:
          'Treść osadzana w nazwanym slocie „item”. W React jest to funkcja „renderItem” otrzymująca stan właściwy dla panelu lub elementu.',
      },
      {
        name: 'renderSourceEmpty',
        description:
          'Treść osadzana w nazwanym slocie „source-empty”. W React jest to funkcja „renderSourceEmpty” otrzymująca stan właściwy dla panelu lub elementu.',
      },
      {
        name: 'renderTargetEmpty',
        description:
          'Treść osadzana w nazwanym slocie „target-empty”. W React jest to funkcja „renderTargetEmpty” otrzymująca stan właściwy dla panelu lub elementu.',
      },
      {
        name: 'renderControls',
        description:
          'Treść osadzana w nazwanym slocie „controls”. W React jest to funkcja „renderControls” otrzymująca stan właściwy dla panelu lub elementu.',
      },
      {
        name: 'renderLoading',
        description:
          'Treść osadzana w nazwanym slocie „loading”. W React jest to funkcja „renderLoading” otrzymująca stan właściwy dla panelu lub elementu.',
      },
    ],
  },
  {
    category: 'feedback',
    categoryLabel: 'Informacje zwrotne',
    name: 'EmptyState',
    sourceName: 'EmptyState',
    framework: 'react',
    importPath: '@peaui/ui/react/feedback/EmptyState',
    status: 'stable',
    props: [
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'title',
        type: 'string',
        required: false,
        description: 'Główny tytuł prezentowany w komponencie.',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        description: 'Dodatkowy opis objaśniający zawartość albo stan komponentu.',
      },
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'additional',
        description:
          'Treść osadzana w nazwanym slocie „additional”. W React jest to prop ReactNode „additional”.',
      },
    ],
  },
  {
    category: 'feedback',
    categoryLabel: 'Informacje zwrotne',
    name: 'MessageText',
    sourceName: 'MessageText',
    framework: 'react',
    importPath: '@peaui/ui/react/feedback/MessageText',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Unikalny identyfikator elementu w dokumencie.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'size',
        type: "| 'xxs'\n    | 'xs'\n    | 's'\n    | 'm'\n    | 'l'\n    | 'xl'\n    | 'heading-xs'\n    | ' heading-s'\n    | 'heading-m'\n    | 'heading-l'",
        required: false,
        default: 's',
        description: 'Wariant rozmiaru komponentu.',
      },
      {
        name: 'variant',
        type: "'info' | 'error' | 'success' | 'danger' | 'default' | 'white'",
        required: false,
        default: 'default',
        description: 'Wariant wizualny komponentu.',
      },
      {
        name: 'withIcon',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Konfiguruje właściwość „with icon” komponentu.',
      },
      {
        name: 'ownIcon',
        type: 'string',
        required: false,
        description: 'Konfiguruje właściwość „own icon” komponentu.',
      },
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'children',
        description: 'Główna treść React przekazywana przez children.',
      },
    ],
  },
  {
    category: 'feedback',
    categoryLabel: 'Informacje zwrotne',
    name: 'ProgressIndicator',
    sourceName: 'ProgressIndicator',
    framework: 'react',
    importPath: '@peaui/ui/react/feedback/ProgressIndicator',
    status: 'stable',
    props: [
      {
        name: 'steps',
        type: 'number',
        required: true,
        description: 'Konfiguruje właściwość „steps” komponentu.',
      },
      {
        name: 'active',
        type: 'number',
        required: false,
        description: 'Określa aktywny element albo aktywny krok.',
      },
      {
        name: 'size',
        type: 'number',
        required: false,
        description: 'Wariant rozmiaru komponentu.',
      },
      {
        name: 'strokeWidth',
        type: 'number',
        required: false,
        description: 'Konfiguruje właściwość „stroke width” komponentu.',
      },
      {
        name: 'removeActive',
        type: 'boolean',
        required: false,
        description: 'Konfiguruje właściwość „remove active” komponentu.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
    ],
    models: [],
    events: [],
    slots: [],
  },
  {
    category: 'feedback',
    categoryLabel: 'Informacje zwrotne',
    name: 'SkeletonLoading',
    sourceName: 'SkeletonLoading',
    framework: 'react',
    importPath: '@peaui/ui/react/feedback/SkeletonLoading',
    status: 'stable',
    props: [
      {
        name: 'size',
        type: "'xs' | 's' | 'm' | 'l'",
        required: false,
        default: 'm',
        description: 'Wariant rozmiaru komponentu.',
      },
      {
        name: 'rounded',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „rounded” komponentu.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        default: 'Trwa ladowanie tresci.',
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
    ],
    models: [],
    events: [],
    slots: [],
  },
  {
    category: 'feedback',
    categoryLabel: 'Informacje zwrotne',
    name: 'SpinnerLoader',
    sourceName: 'SpinnerLoader',
    framework: 'react',
    importPath: '@peaui/ui/react/feedback/SpinnerLoader',
    status: 'stable',
    props: [
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
    ],
    models: [],
    events: [],
    slots: [],
  },
  {
    category: 'feedback',
    categoryLabel: 'Informacje zwrotne',
    name: 'ToastAlert',
    sourceName: 'ToastAlert',
    framework: 'react',
    importPath: '@peaui/ui/react/feedback/ToastAlert',
    status: 'stable',
    props: [
      {
        name: 'variant',
        type: "'info' | 'error' | 'success' | 'danger'",
        required: false,
        default: 'info',
        description: 'Wariant wizualny komponentu.',
      },
      {
        name: 'title',
        type: 'string',
        required: false,
        description: 'Główny tytuł prezentowany w komponencie.',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        description: 'Dodatkowy opis objaśniający zawartość albo stan komponentu.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'size',
        type: "'s' | 'm' | 'l'",
        required: false,
        default: 'm',
        description: 'Wariant rozmiaru komponentu.',
      },
      {
        name: 'withShadow',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „with shadow” komponentu.',
      },
      {
        name: 'withBorder',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „with border” komponentu.',
      },
      {
        name: 'canClose',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „can close” komponentu.',
      },
    ],
    models: [],
    events: [
      {
        name: 'onClose',
        description: 'Emitowane podczas zamykania komponentu. W React przekaż callback onClose.',
      },
    ],
    slots: [],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormButtonCheckbox',
    sourceName: 'FormButtonCheckbox',
    framework: 'react',
    importPath: '@peaui/ui/react/form/FormButtonCheckbox',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Unikalny identyfikator elementu w dokumencie.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description: 'Nazwa pola używana przez formularz lub nazwa zasobu.',
      },
      {
        name: 'isValid',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Konfiguruje właściwość „is valid” komponentu.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description: 'Oznacza wartość jako wymaganą.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'size',
        type: "'xxs' | 'xs' | 's' | 'm' | 'l'",
        required: false,
        default: 'm',
        description: 'Wariant rozmiaru komponentu.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'boolean | undefined',
        required: false,
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange.',
      },
    ],
    events: [],
    slots: [
      {
        name: 'children',
        description: 'Główna treść React przekazywana przez children.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormButtonGroup',
    sourceName: 'FormButtonGroup',
    framework: 'react',
    importPath: '@peaui/ui/react/form/FormButtonGroup',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: false,
        default: 'form-button-group',
        description: 'Unikalny identyfikator elementu w dokumencie.',
      },
      {
        name: 'name',
        type: 'string',
        required: false,
        default: 'formButtonGroup',
        description: 'Nazwa pola używana przez formularz lub nazwa zasobu.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description: 'Widoczna etykieta opisująca element lub pole formularza.',
      },
      {
        name: 'size',
        type: "'xs' | 's' | 'm' | 'l'",
        required: false,
        default: 'm',
        description: 'Wariant rozmiaru komponentu.',
      },
      {
        name: 'isToggle',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „is toggle” komponentu.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description: 'Oznacza wartość jako wymaganą.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description: 'Ustawia komponent w trybie tylko do odczytu.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'options',
        type: 'ButtonGroupOption[]',
        required: false,
        default: '[]',
        description: 'Lista opcji dostępnych do wyświetlenia lub wyboru.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string | number | undefined',
        required: false,
        default: 'undefined',
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange.',
      },
    ],
    events: [],
    slots: [
      {
        name: 'hint',
        description:
          'Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”.',
      },
      {
        name: 'additionalHint',
        description:
          'Treść osadzana w nazwanym slocie „additionalHint”. W React jest to prop ReactNode „additionalHint”.',
      },
      {
        name: 'description',
        description:
          'Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „description”.',
      },
      {
        name: 'error',
        description:
          'Treść osadzana w nazwanym slocie „error”. W React jest to prop ReactNode „error”.',
      },
      {
        name: 'success',
        description:
          'Treść osadzana w nazwanym slocie „success”. W React jest to prop ReactNode „success”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormCheckbox',
    sourceName: 'FormCheckbox',
    framework: 'react',
    importPath: '@peaui/ui/react/form/FormCheckbox',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Unikalny identyfikator elementu w dokumencie.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description: 'Nazwa pola używana przez formularz lub nazwa zasobu.',
      },
      {
        name: 'isValid',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Konfiguruje właściwość „is valid” komponentu.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description: 'Oznacza wartość jako wymaganą.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'boolean | undefined',
        required: false,
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange.',
      },
    ],
    events: [],
    slots: [
      {
        name: 'children',
        description: 'Główna treść React przekazywana przez children.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormColorPicker',
    sourceName: 'FormColorPicker',
    framework: 'react',
    importPath: '@peaui/ui/react/form/FormColorPicker',
    status: 'stable',
    props: [
      {
        name: 'alpha',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „alpha” komponentu.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
      {
        name: 'canErase',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Pokazuje akcję pozwalającą wyczyścić bieżącą wartość.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'density',
        type: 'FormColorPickerDensity',
        required: false,
        default: 'full',
        description: 'Konfiguruje właściwość „density” komponentu.',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        description: 'Dodatkowy opis objaśniający zawartość albo stan komponentu.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        description: 'Komunikat błędu powiązany z polem lub operacją.',
      },
      {
        name: 'format',
        type: 'FormColorPickerFormat',
        required: false,
        default: 'hex',
        description: 'Konfiguruje właściwość „format” komponentu.',
      },
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Unikalny identyfikator elementu w dokumencie.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description: 'Widoczna etykieta opisująca element lub pole formularza.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wybiera natywną strategię ładowania obrazu.',
      },
      {
        name: 'loadingLabel',
        type: 'string',
        required: false,
        default: 'Ładowanie wyboru koloru',
        description: 'Dostępny komunikat opisujący trwającą operację.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description: 'Nazwa pola używana przez formularz lub nazwa zasobu.',
      },
      {
        name: 'panelAriaLabel',
        type: 'string',
        required: false,
        default: 'Wybierz kolor',
        description: 'Konfiguruje właściwość „panel aria label” komponentu.',
      },
      {
        name: 'placement',
        type: 'FormColorPickerPlacement',
        required: false,
        default: 'bottom',
        description: 'Konfiguruje właściwość „placement” komponentu.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: '',
        description: 'Tekst pomocniczy widoczny przed wprowadzeniem wartości.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description: 'Ustawia komponent w trybie tylko do odczytu.',
      },
      {
        name: 'recentColors',
        type: 'ReadonlyArray<string | FormColorPickerSwatch>',
        required: false,
        default: '[]',
        description: 'Konfiguruje właściwość „recent colors” komponentu.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description: 'Oznacza wartość jako wymaganą.',
      },
      {
        name: 'savedColors',
        type: 'ReadonlyArray<string | FormColorPickerSwatch>',
        required: false,
        default: '[]',
        description: 'Konfiguruje właściwość „saved colors” komponentu.',
      },
      {
        name: 'showEyedropper',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „show eyedropper” komponentu.',
      },
      {
        name: 'variant',
        type: 'FormColorPickerVariant',
        required: false,
        default: 'popover',
        description: 'Wariant wizualny komponentu.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string',
        required: false,
        default: '#4C9A2A',
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange.',
      },
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Stan otwarcia kontrolowany przez v-model:open. W React dostępne są propsy open, defaultOpen i onOpenChange.',
      },
    ],
    events: [
      {
        name: 'onChange',
        description:
          'Emitowane po zmianie wartości przez użytkownika. W React przekaż callback onChange.',
      },
      {
        name: 'onClose',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „close”. W React przekaż callback onClose.',
      },
      {
        name: 'onCommit',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „commit”. W React przekaż callback onCommit.',
      },
      {
        name: 'onEyedropperError',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „eyedropperError”. W React przekaż callback onEyedropperError.',
      },
      {
        name: 'onEyedropperStart',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „eyedropperStart”. W React przekaż callback onEyedropperStart.',
      },
      {
        name: 'onInvalid',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „invalid”. W React przekaż callback onInvalid.',
      },
      {
        name: 'onOpen',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „open”. W React przekaż callback onOpen.',
      },
    ],
    slots: [
      {
        name: 'descriptionContent',
        description:
          'Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „descriptionContent”.',
      },
      {
        name: 'errorContent',
        description:
          'Treść osadzana w nazwanym slocie „error”. W React jest to prop ReactNode „errorContent”.',
      },
      {
        name: 'renderFooter',
        description:
          'Treść osadzana w nazwanym slocie „footer”. W React funkcja renderFooter otrzymuje znormalizowany kolor.',
      },
      {
        name: 'hintContent',
        description:
          'Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hintContent”.',
      },
      {
        name: 'renderRecentColor',
        description:
          'Treść osadzana w nazwanym slocie „recent-color”. W React funkcja renderująca otrzymuje próbkę koloru i jej indeks.',
      },
      {
        name: 'renderSavedColor',
        description:
          'Treść osadzana w nazwanym slocie „saved-color”. W React funkcja renderująca otrzymuje próbkę koloru i jej indeks.',
      },
      {
        name: 'renderSwatch',
        description:
          'Treść osadzana w nazwanym slocie „swatch”. W React funkcja renderSwatch otrzymuje znormalizowany kolor.',
      },
      {
        name: 'renderTrigger',
        description:
          'Treść osadzana w nazwanym slocie „trigger”. W React funkcja renderTrigger otrzymuje kolor, stan open i funkcję toggle.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormContainer',
    sourceName: 'FormContainer',
    framework: 'react',
    importPath: '@peaui/ui/react/form/FormContainer',
    status: 'stable',
    props: [
      {
        name: 'label',
        type: 'string',
        required: true,
        description: 'Widoczna etykieta opisująca element lub pole formularza.',
      },
      {
        name: 'submitButtonLabel',
        type: 'string',
        required: false,
        default: 'Zapisz',
        description: 'Konfiguruje właściwość „submit button label” komponentu.',
      },
      {
        name: 'isLoading',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Włącza stan ładowania i informuje o trwającej operacji.',
      },
      {
        name: 'showActions',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Konfiguruje właściwość „show actions” komponentu.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'cancelButtonLabel',
        type: 'string',
        required: false,
        default: 'Anuluj',
        description: 'Konfiguruje właściwość „cancel button label” komponentu.',
      },
      {
        name: 'actionsPosition',
        type: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
        required: false,
        default: 'bottom-left',
        description: 'Konfiguruje właściwość „actions position” komponentu.',
      },
      {
        name: 'showCancelButton',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Konfiguruje właściwość „show cancel button” komponentu.',
      },
      {
        name: 'sizeButton',
        type: "'xxs' | 'xs' | 's' | 'm' | 'l'",
        required: false,
        default: 'xs',
        description: 'Konfiguruje właściwość „size button” komponentu.',
      },
      {
        name: 'useAriaLabelledby',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Konfiguruje właściwość „use aria labelledby” komponentu.',
      },
    ],
    models: [],
    events: [
      {
        name: 'onCancel',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „on:cancel”. W React przekaż callback onCancel.',
      },
      {
        name: 'onSubmit',
        description: 'Emitowane po zatwierdzeniu danych. W React przekaż callback onSubmit.',
      },
    ],
    slots: [
      {
        name: 'children',
        description: 'Główna treść React przekazywana przez children.',
      },
      {
        name: 'additionalBefore',
        description:
          'Treść osadzana w nazwanym slocie „additional-before”. W React jest to prop ReactNode „additionalBefore”.',
      },
      {
        name: 'additionalAfter',
        description:
          'Treść osadzana w nazwanym slocie „additional-after”. W React jest to prop ReactNode „additionalAfter”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormDatePicker',
    sourceName: 'FormDatePicker',
    framework: 'react',
    importPath: '@peaui/ui/react/form/FormDatePicker',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Unikalny identyfikator elementu w dokumencie.',
      },
      {
        name: 'canErase',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Pokazuje akcję pozwalającą wyczyścić bieżącą wartość.',
      },
      {
        name: 'after',
        type: 'string',
        required: false,
        description: 'Treść wyświetlana za właściwą wartością pola.',
      },
      {
        name: 'before',
        type: 'string',
        required: false,
        description: 'Treść wyświetlana przed właściwą wartością pola.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description: 'Nazwa pola używana przez formularz lub nazwa zasobu.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description: 'Widoczna etykieta opisująca element lub pole formularza.',
      },
      {
        name: 'iconBefore',
        type: 'string',
        required: false,
        description: 'Nazwa ikony wyświetlanej przed treścią pola.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description: 'Oznacza wartość jako wymaganą.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: 'wybierz date',
        description: 'Tekst pomocniczy widoczny przed wprowadzeniem wartości.',
      },
      {
        name: 'range',
        type: 'boolean',
        required: false,
        description: 'Konfiguruje właściwość „range” komponentu.',
      },
      {
        name: 'minDate',
        type: 'string',
        required: false,
        description: 'Konfiguruje właściwość „min date” komponentu.',
      },
      {
        name: 'maxDate',
        type: 'string',
        required: false,
        description: 'Konfiguruje właściwość „max date” komponentu.',
      },
      {
        name: 'min',
        type: 'string',
        required: false,
        description: 'Minimalna dozwolona wartość.',
      },
      {
        name: 'max',
        type: 'string',
        required: false,
        description: 'Maksymalna dozwolona wartość albo szerokość.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description: 'Ustawia komponent w trybie tylko do odczytu.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string | DatePickerRangeValue | undefined',
        required: false,
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange.',
      },
    ],
    events: [
      {
        name: 'onRemove',
        description: 'Emitowane po wybraniu akcji usunięcia. W React przekaż callback onRemove.',
      },
    ],
    slots: [
      {
        name: 'hint',
        description:
          'Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”.',
      },
      {
        name: 'description',
        description:
          'Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „description”.',
      },
      {
        name: 'error',
        description:
          'Treść osadzana w nazwanym slocie „error”. W React jest to prop ReactNode „error”.',
      },
      {
        name: 'success',
        description:
          'Treść osadzana w nazwanym slocie „success”. W React jest to prop ReactNode „success”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormDateRangePicker',
    sourceName: 'FormDateRangePicker',
    framework: 'react',
    importPath: '@peaui/ui/react/form/FormDateRangePicker',
    status: 'stable',
    props: [
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
      {
        name: 'calendars',
        type: 'FormDateRangePickerCalendars',
        required: false,
        default: '2',
        description: 'Konfiguruje właściwość „calendars” komponentu.',
      },
      {
        name: 'canErase',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Pokazuje akcję pozwalającą wyczyścić bieżącą wartość.',
      },
      {
        name: 'confirm',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „confirm” komponentu.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'dateFormat',
        type: 'FormDateRangePickerDateFormat',
        required: false,
        default: 'locale',
        description: 'Konfiguruje właściwość „date format” komponentu.',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        description: 'Dodatkowy opis objaśniający zawartość albo stan komponentu.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'endLabel',
        type: 'string',
        required: false,
        default: 'Data końcowa',
        description: 'Konfiguruje właściwość „end label” komponentu.',
      },
      {
        name: 'endPlaceholder',
        type: 'string',
        required: false,
        default: '',
        description: 'Konfiguruje właściwość „end placeholder” komponentu.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        description: 'Komunikat błędu powiązany z polem lub operacją.',
      },
      {
        name: 'format',
        type: 'DateRangeFormatter',
        required: false,
        description: 'Konfiguruje właściwość „format” komponentu.',
      },
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Unikalny identyfikator elementu w dokumencie.',
      },
      {
        name: 'isDateDisabled',
        type: '(date: string) => boolean',
        required: false,
        description: 'Konfiguruje właściwość „is date disabled” komponentu.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description: 'Widoczna etykieta opisująca element lub pole formularza.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wybiera natywną strategię ładowania obrazu.',
      },
      {
        name: 'loadingLabel',
        type: 'string',
        required: false,
        default: 'Ładowanie wyboru zakresu dat',
        description: 'Dostępny komunikat opisujący trwającą operację.',
      },
      {
        name: 'locale',
        type: 'string',
        required: false,
        default: 'pl-PL',
        description: 'Konfiguruje właściwość „locale” komponentu.',
      },
      {
        name: 'maxDate',
        type: 'string',
        required: false,
        description: 'Konfiguruje właściwość „max date” komponentu.',
      },
      {
        name: 'minDate',
        type: 'string',
        required: false,
        description: 'Konfiguruje właściwość „min date” komponentu.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description: 'Nazwa pola używana przez formularz lub nazwa zasobu.',
      },
      {
        name: 'panelAriaLabel',
        type: 'string',
        required: false,
        default: 'Wybierz zakres dat',
        description: 'Konfiguruje właściwość „panel aria label” komponentu.',
      },
      {
        name: 'parse',
        type: 'DateRangeParser',
        required: false,
        description: 'Konfiguruje właściwość „parse” komponentu.',
      },
      {
        name: 'placement',
        type: 'FormDateRangePickerPlacement',
        required: false,
        default: 'bottom',
        description: 'Konfiguruje właściwość „placement” komponentu.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: '',
        description: 'Tekst pomocniczy widoczny przed wprowadzeniem wartości.',
      },
      {
        name: 'presets',
        type: 'DateRangePreset[]',
        required: false,
        default: '[]',
        description: 'Konfiguruje właściwość „presets” komponentu.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description: 'Ustawia komponent w trybie tylko do odczytu.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description: 'Oznacza wartość jako wymaganą.',
      },
      {
        name: 'selectionOrder',
        type: 'FormDateRangePickerSelectionOrder',
        required: false,
        default: 'swap',
        description: 'Konfiguruje właściwość „selection order” komponentu.',
      },
      {
        name: 'showPresets',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Konfiguruje właściwość „show presets” komponentu.',
      },
      {
        name: 'startLabel',
        type: 'string',
        required: false,
        default: 'Data początkowa',
        description: 'Konfiguruje właściwość „start label” komponentu.',
      },
      {
        name: 'startPlaceholder',
        type: 'string',
        required: false,
        default: '',
        description: 'Konfiguruje właściwość „start placeholder” komponentu.',
      },
      {
        name: 'variant',
        type: 'FormDateRangePickerVariant',
        required: false,
        default: 'two-inputs',
        description: 'Wariant wizualny komponentu.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'DateRangeValue | undefined',
        required: false,
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange.',
      },
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Stan otwarcia kontrolowany przez v-model:open. W React dostępne są propsy open, defaultOpen i onOpenChange.',
      },
    ],
    events: [
      {
        name: 'onApply',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „apply”. W React przekaż callback onApply.',
      },
      {
        name: 'onCancel',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „cancel”. W React przekaż callback onCancel.',
      },
      {
        name: 'onChange',
        description:
          'Emitowane po zmianie wartości przez użytkownika. W React przekaż callback onChange.',
      },
      {
        name: 'onClose',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „close”. W React przekaż callback onClose.',
      },
      {
        name: 'onEndChange',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „endChange”. W React przekaż callback onEndChange.',
      },
      {
        name: 'onInvalid',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „invalid”. W React przekaż callback onInvalid.',
      },
      {
        name: 'onMonthChange',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „monthChange”. W React przekaż callback onMonthChange.',
      },
      {
        name: 'onOpen',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „open”. W React przekaż callback onOpen.',
      },
      {
        name: 'onStartChange',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „startChange”. W React przekaż callback onStartChange.',
      },
    ],
    slots: [
      {
        name: 'day',
        description:
          'Treść osadzana w nazwanym slocie „day”. W React jest to prop ReactNode „day”.',
      },
      {
        name: 'description',
        description:
          'Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „description”.',
      },
      {
        name: 'endLabel',
        description:
          'Treść osadzana w nazwanym slocie „end-label”. W React jest to prop ReactNode „endLabel”.',
      },
      {
        name: 'error',
        description:
          'Treść osadzana w nazwanym slocie „error”. W React jest to prop ReactNode „error”.',
      },
      {
        name: 'footer',
        description:
          'Treść osadzana w nazwanym slocie „footer”. W React jest to prop ReactNode „footer”.',
      },
      {
        name: 'hint',
        description:
          'Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”.',
      },
      {
        name: 'preset',
        description:
          'Treść osadzana w nazwanym slocie „preset”. W React jest to prop ReactNode „preset”.',
      },
      {
        name: 'startLabel',
        description:
          'Treść osadzana w nazwanym slocie „start-label”. W React jest to prop ReactNode „startLabel”.',
      },
      {
        name: 'trigger',
        description:
          'Treść osadzana w nazwanym slocie „trigger”. W React jest to prop ReactNode „trigger”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormDateTimePicker',
    sourceName: 'FormDateTimePicker',
    framework: 'react',
    importPath: '@peaui/ui/react/form/FormDateTimePicker',
    status: 'stable',
    props: [
      {
        name: 'allowOffStep',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „allow off step” komponentu.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
      {
        name: 'canErase',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Pokazuje akcję pozwalającą wyczyścić bieżącą wartość.',
      },
      {
        name: 'confirm',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „confirm” komponentu.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'dateFormat',
        type: 'FormDateTimePickerDateFormat',
        required: false,
        default: 'locale',
        description: 'Konfiguruje właściwość „date format” komponentu.',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        description: 'Dodatkowy opis objaśniający zawartość albo stan komponentu.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        description: 'Komunikat błędu powiązany z polem lub operacją.',
      },
      {
        name: 'format',
        type: 'FormTimePickerFormat',
        required: false,
        default: '24h',
        description: 'Konfiguruje właściwość „format” komponentu.',
      },
      {
        name: 'hourStep',
        type: 'number',
        required: false,
        default: '1',
        description: 'Konfiguruje właściwość „hour step” komponentu.',
      },
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Unikalny identyfikator elementu w dokumencie.',
      },
      {
        name: 'isDateTimeDisabled',
        type: '(value: LocalDateTimeValue) => boolean',
        required: false,
        description: 'Konfiguruje właściwość „is date time disabled” komponentu.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description: 'Widoczna etykieta opisująca element lub pole formularza.',
      },
      {
        name: 'layout',
        type: 'FormDateTimePickerLayout',
        required: false,
        default: 'side-by-side',
        description: 'Konfiguruje właściwość „layout” komponentu.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wybiera natywną strategię ładowania obrazu.',
      },
      {
        name: 'loadingLabel',
        type: 'string',
        required: false,
        default: 'Ładowanie wyboru daty i czasu',
        description: 'Dostępny komunikat opisujący trwającą operację.',
      },
      {
        name: 'locale',
        type: 'string',
        required: false,
        default: 'pl-PL',
        description: 'Konfiguruje właściwość „locale” komponentu.',
      },
      {
        name: 'max',
        type: 'LocalDateTimeValue',
        required: false,
        description: 'Maksymalna dozwolona wartość albo szerokość.',
      },
      {
        name: 'min',
        type: 'LocalDateTimeValue',
        required: false,
        description: 'Minimalna dozwolona wartość.',
      },
      {
        name: 'minuteStep',
        type: 'number',
        required: false,
        default: '5',
        description: 'Konfiguruje właściwość „minute step” komponentu.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description: 'Nazwa pola używana przez formularz lub nazwa zasobu.',
      },
      {
        name: 'panelAriaLabel',
        type: 'string',
        required: false,
        default: 'Wybierz datę i czas',
        description: 'Konfiguruje właściwość „panel aria label” komponentu.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: '',
        description: 'Tekst pomocniczy widoczny przed wprowadzeniem wartości.',
      },
      {
        name: 'placement',
        type: 'FormDateTimePickerPlacement',
        required: false,
        default: 'bottom',
        description: 'Konfiguruje właściwość „placement” komponentu.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description: 'Ustawia komponent w trybie tylko do odczytu.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description: 'Oznacza wartość jako wymaganą.',
      },
      {
        name: 'secondStep',
        type: 'number',
        required: false,
        default: '5',
        description: 'Konfiguruje właściwość „second step” komponentu.',
      },
      {
        name: 'showSeconds',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „show seconds” komponentu.',
      },
      {
        name: 'showTimeZone',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „show time zone” komponentu.',
      },
      {
        name: 'timeZone',
        type: 'string',
        required: false,
        description: 'Konfiguruje właściwość „time zone” komponentu.',
      },
      {
        name: 'variant',
        type: 'FormDateTimePickerVariant',
        required: false,
        default: 'single-input',
        description: 'Wariant wizualny komponentu.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'LocalDateTimeValue | undefined',
        required: false,
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange.',
      },
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Stan otwarcia kontrolowany przez v-model:open. W React dostępne są propsy open, defaultOpen i onOpenChange.',
      },
    ],
    events: [
      {
        name: 'onApply',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „apply”. W React przekaż callback onApply.',
      },
      {
        name: 'onCancel',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „cancel”. W React przekaż callback onCancel.',
      },
      {
        name: 'onChange',
        description:
          'Emitowane po zmianie wartości przez użytkownika. W React przekaż callback onChange.',
      },
      {
        name: 'onClose',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „close”. W React przekaż callback onClose.',
      },
      {
        name: 'onDateChange',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „dateChange”. W React przekaż callback onDateChange.',
      },
      {
        name: 'onInvalid',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „invalid”. W React przekaż callback onInvalid.',
      },
      {
        name: 'onOpen',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „open”. W React przekaż callback onOpen.',
      },
      {
        name: 'onTimeChange',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „timeChange”. W React przekaż callback onTimeChange.',
      },
    ],
    slots: [
      {
        name: 'renderDate',
        description:
          'Treść osadzana w nazwanym slocie „date”. W React jest to prop ReactNode „renderDate”.',
      },
      {
        name: 'descriptionContent',
        description:
          'Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „descriptionContent”.',
      },
      {
        name: 'errorContent',
        description:
          'Treść osadzana w nazwanym slocie „error”. W React jest to prop ReactNode „errorContent”.',
      },
      {
        name: 'footerContent',
        description:
          'Treść osadzana w nazwanym slocie „footer”. W React jest to prop ReactNode „footerContent”.',
      },
      {
        name: 'hint',
        description:
          'Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”.',
      },
      {
        name: 'renderTime',
        description:
          'Treść osadzana w nazwanym slocie „time”. W React jest to prop ReactNode „renderTime”.',
      },
      {
        name: 'renderTimeZone',
        description:
          'Treść osadzana w nazwanym slocie „time-zone”. W React jest to prop ReactNode „renderTimeZone”.',
      },
      {
        name: 'renderTrigger',
        description:
          'Treść osadzana w nazwanym slocie „trigger”. W React jest to prop ReactNode „renderTrigger”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormField',
    sourceName: 'FormField',
    framework: 'react',
    importPath: '@peaui/ui/react/form/FormField',
    status: 'stable',
    props: [
      {
        name: 'after',
        type: 'string',
        required: false,
        description: 'Treść wyświetlana za właściwą wartością pola.',
      },
      {
        name: 'before',
        type: 'string',
        required: false,
        description: 'Treść wyświetlana przed właściwą wartością pola.',
      },
      {
        name: 'canErase',
        type: 'boolean',
        required: false,
        description: 'Pokazuje akcję pozwalającą wyczyścić bieżącą wartość.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'iconAfter',
        type: 'string',
        required: false,
        description: 'Nazwa ikony wyświetlanej za treścią pola.',
      },
      {
        name: 'iconBefore',
        type: 'string',
        required: false,
        description: 'Nazwa ikony wyświetlanej przed treścią pola.',
      },
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Unikalny identyfikator elementu w dokumencie.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description: 'Widoczna etykieta opisująca element lub pole formularza.',
      },
      {
        name: 'maxLength',
        type: 'number',
        required: false,
        description: 'Maksymalna liczba znaków możliwa do wprowadzenia.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description: 'Nazwa pola używana przez formularz lub nazwa zasobu.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        description: 'Tekst pomocniczy widoczny przed wprowadzeniem wartości.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description: 'Ustawia komponent w trybie tylko do odczytu.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description: 'Oznacza wartość jako wymaganą.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'rightErasePosition',
        type: 'number',
        required: false,
        description: 'Konfiguruje właściwość „right erase position” komponentu.',
      },
      {
        name: 'value',
        type: 'string | number | string[] | null',
        required: false,
        description: 'Bieżąca wartość kontrolowana przez v-model.',
      },
    ],
    models: [],
    events: [
      {
        name: 'onRemove',
        description: 'Emitowane po wybraniu akcji usunięcia. W React przekaż callback onRemove.',
      },
    ],
    slots: [
      {
        name: 'hint',
        description:
          'Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”.',
      },
      {
        name: 'additional',
        description:
          'Treść osadzana w nazwanym slocie „additional”. W React jest to prop ReactNode „additional”.',
      },
      {
        name: 'children',
        description: 'Główna treść React przekazywana przez children.',
      },
      {
        name: 'description',
        description:
          'Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „description”.',
      },
      {
        name: 'error',
        description:
          'Treść osadzana w nazwanym slocie „error”. W React jest to prop ReactNode „error”.',
      },
      {
        name: 'success',
        description:
          'Treść osadzana w nazwanym slocie „success”. W React jest to prop ReactNode „success”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormFieldLabel',
    sourceName: 'FormFieldLabel',
    framework: 'react',
    importPath: '@peaui/ui/react/form/FormFieldLabel',
    status: 'stable',
    props: [
      {
        name: 'for',
        type: 'string',
        required: true,
        description: 'Konfiguruje właściwość „for” komponentu.',
      },
      {
        name: 'text',
        type: 'string',
        required: true,
        description: 'Konfiguruje właściwość „text” komponentu.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Ustawia komponent w trybie tylko do odczytu.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description: 'Oznacza wartość jako wymaganą.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'children',
        description: 'Główna treść React przekazywana przez children.',
      },
      {
        name: 'hint',
        description:
          'Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormFileUpload',
    sourceName: 'FormFileUpload',
    framework: 'react',
    importPath: '@peaui/ui/react/form/FormFileUpload',
    status: 'stable',
    props: [
      {
        name: 'allowedTypes',
        type: 'string[]',
        required: false,
        default: "['image/jpeg', 'image/png', 'image/jpg']",
        description: 'Konfiguruje właściwość „allowed types” komponentu.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'maxFileSize',
        type: 'number',
        required: false,
        default: '5 * 1024 * 1024',
        description: 'Konfiguruje właściwość „max file size” komponentu.',
      },
      {
        name: 'variant',
        type: "'primary' | 'danger'",
        required: false,
        default: 'primary',
        description: 'Wariant wizualny komponentu.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        default: 'undefined',
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
    ],
    models: [
      {
        name: 'file',
        type: 'FormFileUploadValue | undefined',
        required: false,
        description:
          'Wybrany plik kontrolowany przez v-model:file. W React dostępne są propsy file, defaultFile i onFileChange.',
      },
    ],
    events: [
      {
        name: 'onRemove',
        description: 'Emitowane po wybraniu akcji usunięcia. W React przekaż callback onRemove.',
      },
    ],
    slots: [],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormFileUploadSimple',
    sourceName: 'FormFileUploadSimple',
    framework: 'react',
    importPath: '@peaui/ui/react/form/FormFileUploadSimple',
    status: 'stable',
    props: [
      {
        name: 'allowedTypes',
        type: 'string[]',
        required: false,
        default:
          "[\n      'application/msword',\n      'application/pdf',\n      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',\n      'image/jpeg',\n      'image/jpg',\n      'image/png',\n    ]",
        description: 'Konfiguruje właściwość „allowed types” komponentu.',
      },
      {
        name: 'context',
        type: 'string',
        required: false,
        default: 'undefined',
        description: 'Konfiguruje właściwość „context” komponentu.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'maxFileSize',
        type: 'number',
        required: false,
        default: '5 * 1024 * 1024',
        description: 'Konfiguruje właściwość „max file size” komponentu.',
      },
      {
        name: 'maxFiles',
        type: 'number',
        required: false,
        default: '4',
        description: 'Konfiguruje właściwość „max files” komponentu.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        default: 'undefined',
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
    ],
    models: [
      {
        name: 'files',
        type: 'File[]',
        required: false,
        description:
          'Lista wybranych plików kontrolowana przez v-model:files. W React dostępne są propsy files, defaultFiles i onFilesChange.',
      },
    ],
    events: [],
    slots: [],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormInput',
    sourceName: 'FormInput',
    framework: 'react',
    importPath: '@peaui/ui/react/form/FormInput',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Unikalny identyfikator elementu w dokumencie.',
      },
      {
        name: 'canErase',
        type: 'boolean',
        required: false,
        description: 'Pokazuje akcję pozwalającą wyczyścić bieżącą wartość.',
      },
      {
        name: 'after',
        type: 'string',
        required: false,
        description: 'Treść wyświetlana za właściwą wartością pola.',
      },
      {
        name: 'before',
        type: 'string',
        required: false,
        description: 'Treść wyświetlana przed właściwą wartością pola.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description: 'Nazwa pola używana przez formularz lub nazwa zasobu.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description: 'Widoczna etykieta opisująca element lub pole formularza.',
      },
      {
        name: 'iconBefore',
        type: 'string',
        required: false,
        description: 'Nazwa ikony wyświetlanej przed treścią pola.',
      },
      {
        name: 'iconAfter',
        type: 'string',
        required: false,
        description: 'Nazwa ikony wyświetlanej za treścią pola.',
      },
      {
        name: 'maxLength',
        type: 'number',
        required: false,
        description: 'Maksymalna liczba znaków możliwa do wprowadzenia.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description: 'Oznacza wartość jako wymaganą.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: 'wpisz',
        description: 'Tekst pomocniczy widoczny przed wprowadzeniem wartości.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description: 'Ustawia komponent w trybie tylko do odczytu.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string | undefined',
        required: false,
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange.',
      },
    ],
    events: [
      {
        name: 'onRemove',
        description: 'Emitowane po wybraniu akcji usunięcia. W React przekaż callback onRemove.',
      },
    ],
    slots: [
      {
        name: 'hint',
        description:
          'Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”.',
      },
      {
        name: 'description',
        description:
          'Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „description”.',
      },
      {
        name: 'error',
        description:
          'Treść osadzana w nazwanym slocie „error”. W React jest to prop ReactNode „error”.',
      },
      {
        name: 'success',
        description:
          'Treść osadzana w nazwanym slocie „success”. W React jest to prop ReactNode „success”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormMultiSelect',
    sourceName: 'FormMultiSelect',
    framework: 'react',
    importPath: '@peaui/ui/react/form/FormMultiSelect',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Unikalny identyfikator elementu w dokumencie.',
      },
      {
        name: 'canErase',
        type: 'boolean',
        required: false,
        description: 'Pokazuje akcję pozwalającą wyczyścić bieżącą wartość.',
      },
      {
        name: 'after',
        type: 'string',
        required: false,
        description: 'Treść wyświetlana za właściwą wartością pola.',
      },
      {
        name: 'before',
        type: 'string',
        required: false,
        description: 'Treść wyświetlana przed właściwą wartością pola.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description: 'Nazwa pola używana przez formularz lub nazwa zasobu.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description: 'Widoczna etykieta opisująca element lub pole formularza.',
      },
      {
        name: 'iconBefore',
        type: 'string',
        required: false,
        description: 'Nazwa ikony wyświetlanej przed treścią pola.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description: 'Oznacza wartość jako wymaganą.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: 'wybierz/wyszukaj',
        description: 'Tekst pomocniczy widoczny przed wprowadzeniem wartości.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description: 'Ustawia komponent w trybie tylko do odczytu.',
      },
      {
        name: 'searchable',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Konfiguruje właściwość „searchable” komponentu.',
      },
      {
        name: 'withSelectAll',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „with select all” komponentu.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'options',
        type: 'MultiSelectFieldOption[]',
        required: true,
        description: 'Lista opcji dostępnych do wyświetlenia lub wyboru.',
      },
      {
        name: 'placement',
        type: "'top' | 'bottom'",
        required: false,
        description: 'Konfiguruje właściwość „placement” komponentu.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'unknown[] | null | undefined',
        required: false,
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange.',
      },
    ],
    events: [
      {
        name: 'onRemove',
        description: 'Emitowane po wybraniu akcji usunięcia. W React przekaż callback onRemove.',
      },
    ],
    slots: [
      {
        name: 'hint',
        description:
          'Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”.',
      },
      {
        name: 'description',
        description:
          'Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „description”.',
      },
      {
        name: 'error',
        description:
          'Treść osadzana w nazwanym slocie „error”. W React jest to prop ReactNode „error”.',
      },
      {
        name: 'success',
        description:
          'Treść osadzana w nazwanym slocie „success”. W React jest to prop ReactNode „success”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormNumber',
    sourceName: 'FormNumber',
    framework: 'react',
    importPath: '@peaui/ui/react/form/FormNumber',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Unikalny identyfikator elementu w dokumencie.',
      },
      {
        name: 'canErase',
        type: 'boolean',
        required: false,
        description: 'Pokazuje akcję pozwalającą wyczyścić bieżącą wartość.',
      },
      {
        name: 'after',
        type: 'string',
        required: false,
        description: 'Treść wyświetlana za właściwą wartością pola.',
      },
      {
        name: 'before',
        type: 'string',
        required: false,
        description: 'Treść wyświetlana przed właściwą wartością pola.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description: 'Nazwa pola używana przez formularz lub nazwa zasobu.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description: 'Widoczna etykieta opisująca element lub pole formularza.',
      },
      {
        name: 'iconBefore',
        type: 'string',
        required: false,
        description: 'Nazwa ikony wyświetlanej przed treścią pola.',
      },
      {
        name: 'iconAfter',
        type: 'string',
        required: false,
        description: 'Nazwa ikony wyświetlanej za treścią pola.',
      },
      {
        name: 'max',
        type: 'number',
        required: false,
        description: 'Maksymalna dozwolona wartość albo szerokość.',
      },
      {
        name: 'min',
        type: 'number',
        required: false,
        description: 'Minimalna dozwolona wartość.',
      },
      {
        name: 'step',
        type: 'number',
        required: false,
        description: 'Krok zmiany wartości liczbowej.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description: 'Oznacza wartość jako wymaganą.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: 'wpisz',
        description: 'Tekst pomocniczy widoczny przed wprowadzeniem wartości.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description: 'Ustawia komponent w trybie tylko do odczytu.',
      },
      {
        name: 'isRangeVisible',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Konfiguruje właściwość „is range visible” komponentu.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'number | undefined | string',
        required: false,
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange.',
      },
    ],
    events: [],
    slots: [
      {
        name: 'hint',
        description:
          'Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”.',
      },
      {
        name: 'description',
        description:
          'Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „description”.',
      },
      {
        name: 'error',
        description:
          'Treść osadzana w nazwanym slocie „error”. W React jest to prop ReactNode „error”.',
      },
      {
        name: 'success',
        description:
          'Treść osadzana w nazwanym slocie „success”. W React jest to prop ReactNode „success”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormPassword',
    sourceName: 'FormPassword',
    framework: 'react',
    importPath: '@peaui/ui/react/form/FormPassword',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Unikalny identyfikator elementu w dokumencie.',
      },
      {
        name: 'before',
        type: 'string',
        required: false,
        description: 'Treść wyświetlana przed właściwą wartością pola.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description: 'Nazwa pola używana przez formularz lub nazwa zasobu.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description: 'Widoczna etykieta opisująca element lub pole formularza.',
      },
      {
        name: 'iconBefore',
        type: 'string',
        required: false,
        description: 'Nazwa ikony wyświetlanej przed treścią pola.',
      },
      {
        name: 'maxLength',
        type: 'number',
        required: false,
        description: 'Maksymalna liczba znaków możliwa do wprowadzenia.',
      },
      {
        name: 'canCopy',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Konfiguruje właściwość „can copy” komponentu.',
      },
      {
        name: 'canVisible',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Konfiguruje właściwość „can visible” komponentu.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description: 'Oznacza wartość jako wymaganą.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: 'wpisz',
        description: 'Tekst pomocniczy widoczny przed wprowadzeniem wartości.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description: 'Ustawia komponent w trybie tylko do odczytu.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'showPasswordAriaLabel',
        type: 'string',
        required: false,
        default: 'Pokaz haslo',
        description: 'Konfiguruje właściwość „show password aria label” komponentu.',
      },
      {
        name: 'hidePasswordAriaLabel',
        type: 'string',
        required: false,
        default: 'Ukryj haslo',
        description: 'Konfiguruje właściwość „hide password aria label” komponentu.',
      },
      {
        name: 'copyPasswordAriaLabel',
        type: 'string',
        required: false,
        default: 'Kopiuj haslo',
        description: 'Konfiguruje właściwość „copy password aria label” komponentu.',
      },
      {
        name: 'copySuccessMessage',
        type: 'string',
        required: false,
        default: 'Haslo skopiowano do schowka.',
        description: 'Konfiguruje właściwość „copy success message” komponentu.',
      },
      {
        name: 'copyErrorMessage',
        type: 'string',
        required: false,
        default: 'Nie udalo sie skopiowac hasla.',
        description: 'Konfiguruje właściwość „copy error message” komponentu.',
      },
      {
        name: 'enablePasswordStrengthMeter',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „enable password strength meter” komponentu.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string | undefined',
        required: false,
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange.',
      },
    ],
    events: [],
    slots: [
      {
        name: 'hint',
        description:
          'Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”.',
      },
      {
        name: 'description',
        description:
          'Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „description”.',
      },
      {
        name: 'error',
        description:
          'Treść osadzana w nazwanym slocie „error”. W React jest to prop ReactNode „error”.',
      },
      {
        name: 'success',
        description:
          'Treść osadzana w nazwanym slocie „success”. W React jest to prop ReactNode „success”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormPinInput',
    sourceName: 'FormPinInput',
    framework: 'react',
    importPath: '@peaui/ui/react/form/FormPinInput',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: false,
        description: 'Unikalny identyfikator grupy.',
      },
      {
        name: 'name',
        type: 'string',
        required: false,
        description: 'Nazwa wartości wysyłanej z natywnym formularzem.',
      },
      {
        name: 'form',
        type: 'string',
        required: false,
        description: 'Identyfikator formularza właściciela.',
      },
      {
        name: 'length',
        type: 'number',
        required: false,
        default: '6',
        description: 'Liczba komórek kodu od 1 do 32.',
      },
      {
        name: 'type',
        type: 'FormPinInputType',
        required: false,
        default: 'numeric',
        description: 'Zbiór znaków akceptowanych przez komponent.',
      },
      {
        name: 'mask',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Maskuje wizualnie wpisane znaki.',
      },
      {
        name: 'size',
        type: 'FormPinInputSize',
        required: false,
        default: 'm',
        description: 'Rozmiar wizualny komórek; cel dotykowy zawsze ma minimum 44 px.',
      },
      {
        name: 'pattern',
        type: 'string',
        required: false,
        description: 'Dodatkowy wzorzec wyrażenia regularnego sprawdzany dla każdego znaku.',
      },
      {
        name: 'transform',
        type: 'FormPinInputTransform',
        required: false,
        default: 'none',
        description: 'Transformacja wykonywana przed walidacją znaku.',
      },
      {
        name: 'separatorEvery',
        type: 'number',
        required: false,
        default: '0',
        description: 'Co ile komórek renderowany jest separator; 0 wyłącza grupowanie.',
      },
      {
        name: 'autocomplete',
        type: 'string',
        required: false,
        default: 'one-time-code',
        description: 'Wartość autocomplete pierwszej komórki.',
      },
      {
        name: 'inputmode',
        type: 'FormPinInputInputMode',
        required: false,
        description: 'Podpowiedź klawiatury ekranowej. Domyślnie wynika z typu.',
      },
      {
        name: 'autoFocus',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Ustawia początkowy fokus na pierwszej nieuzupełnionej komórce.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wyłącza kontrolkę.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Blokuje edycję bez usuwania kontrolki z kolejności fokusu.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Blokuje edycję i udostępnia stan zajętości.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Oznacza każdą komórkę jako wymaganą.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        default: '',
        description: 'Widoczna etykieta całej grupy.',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        default: '',
        description: 'Tekst instrukcji powiązany z grupą i komórkami.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        default: '',
        description: 'Komunikat błędu powiązany przez aria-describedby.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        default: '',
        description: 'Dostępna nazwa używana, gdy nie ma widocznej etykiety.',
      },
      {
        name: 'loadingLabel',
        type: 'string',
        required: false,
        default: 'Trwa przygotowywanie pola kodu',
        description: 'Tekst stanu ładowania dla technologii asystujących.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator używany w testach.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string',
        required: false,
        default: '',
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange.',
      },
    ],
    events: [
      {
        name: 'onChange',
        description:
          'Emitowane po zmianie wartości przez użytkownika. W React przekaż callback onChange.',
      },
      {
        name: 'onComplete',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „complete”. W React przekaż callback onComplete.',
      },
      {
        name: 'onInvalidInput',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „invalidInput”. W React przekaż callback onInvalidInput.',
      },
      {
        name: 'onFocus',
        description:
          'Emitowane po ustawieniu fokusu na kontrolce. W React przekaż callback onFocus.',
      },
      {
        name: 'onBlur',
        description:
          'Emitowane po opuszczeniu kontrolki przez fokus. W React przekaż callback onBlur.',
      },
    ],
    slots: [
      {
        name: 'labelContent',
        description:
          'Treść osadzana w nazwanym slocie „label”. W React przekaż treść przez labelContent.',
      },
      {
        name: 'hintContent',
        description:
          'Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hintContent”.',
      },
      {
        name: 'renderSeparator',
        description:
          'Treść osadzana w nazwanym slocie „separator”. W React funkcja renderSeparator otrzymuje indeks komórki poprzedzającej separator.',
      },
      {
        name: 'descriptionContent',
        description:
          'Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „descriptionContent”.',
      },
      {
        name: 'errorContent',
        description:
          'Treść osadzana w nazwanym slocie „error”. W React jest to prop ReactNode „errorContent”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormRadio',
    sourceName: 'FormRadio',
    framework: 'react',
    importPath: '@peaui/ui/react/form/FormRadio',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Unikalny identyfikator elementu w dokumencie.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description: 'Nazwa pola używana przez formularz lub nazwa zasobu.',
      },
      {
        name: 'optionValue',
        type: 'string | number | boolean',
        required: true,
        description: 'Konfiguruje właściwość „option value” komponentu.',
      },
      {
        name: 'isValid',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Konfiguruje właściwość „is valid” komponentu.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description: 'Oznacza wartość jako wymaganą.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string | number | boolean | undefined',
        required: false,
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange.',
      },
    ],
    events: [],
    slots: [
      {
        name: 'children',
        description: 'Główna treść React przekazywana przez children.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormRatingInput',
    sourceName: 'FormRatingInput',
    framework: 'react',
    importPath: '@peaui/ui/react/form/FormRatingInput',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: false,
        description: 'Unikalny identyfikator kontrolki.',
      },
      {
        name: 'name',
        type: 'string',
        required: false,
        description: 'Nazwa wartości wysyłanej z formularzem.',
      },
      {
        name: 'form',
        type: 'string',
        required: false,
        description: 'Identyfikator formularza właściciela.',
      },
      {
        name: 'max',
        type: 'number',
        required: false,
        default: '5',
        description: 'Najwyższa ocena; wartości są normalizowane do zakresu 1–100.',
      },
      {
        name: 'step',
        type: 'FormRatingInputStep',
        required: false,
        default: '1',
        description: 'Precyzja pełnej lub połówkowej oceny.',
      },
      {
        name: 'allowClear',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Pozwala wyczyścić ocenę klawiszem Delete/Backspace lub ponownym kliknięciem.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wyświetla nietabowalny odczyt zamiast kontrolki.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wyłącza kontrolkę.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Oznacza ocenę jako wymaganą.',
      },
      {
        name: 'labels',
        type: 'RatingLabels',
        required: false,
        default: '({})',
        description: "Mapa tekstowych opisów indeksowana wartością, np. `{ '4': 'Dobra' }`.",
      },
      {
        name: 'getLabel',
        type: 'RatingLabelGetter',
        required: false,
        description: 'Funkcja tworząca tekstowy opis wartości.',
      },
      {
        name: 'icon',
        type: 'string',
        required: false,
        default: 'core/star',
        description: 'Nazwa ikony z katalogu PeaUI.',
      },
      {
        name: 'size',
        type: 'FormRatingInputSize',
        required: false,
        default: 'm',
        description: 'Rozmiar wizualny ikon; cel dotykowy zachowuje co najmniej 44 px.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        default: '',
        description: 'Widoczna etykieta pola.',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        default: '',
        description: 'Tekst pomocniczy powiązany przez aria-describedby.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        default: '',
        description: 'Komunikat błędu powiązany przez aria-describedby i aria-invalid.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        default: '',
        description: 'Dostępna nazwa, gdy nie ma widocznej etykiety.',
      },
      {
        name: 'emptyLabel',
        type: 'string',
        required: false,
        default: 'Brak oceny',
        description: 'Lokalizowany tekst używany dla pustej oceny.',
      },
      {
        name: 'locale',
        type: 'string',
        required: false,
        default: 'pl-PL',
        description: 'Locale używane do formatowania wartości połówkowych.',
      },
      {
        name: 'showValueLabel',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Pokazuje widoczny tekst bieżącej wartości.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator dla testów automatycznych.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'number | null',
        required: false,
        default: 'null',
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange.',
      },
    ],
    events: [
      {
        name: 'onChange',
        description:
          'Emitowane po zmianie wartości przez użytkownika. W React przekaż callback onChange.',
      },
      {
        name: 'onPreviewChange',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „previewChange”. W React przekaż callback onPreviewChange.',
      },
      {
        name: 'onClear',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „clear”. W React przekaż callback onClear.',
      },
      {
        name: 'onFocus',
        description:
          'Emitowane po ustawieniu fokusu na kontrolce. W React przekaż callback onFocus.',
      },
      {
        name: 'onBlur',
        description:
          'Emitowane po opuszczeniu kontrolki przez fokus. W React przekaż callback onBlur.',
      },
    ],
    slots: [
      {
        name: 'label',
        description:
          'Treść osadzana w nazwanym slocie „label”. W React jest to prop ReactNode „label”.',
      },
      {
        name: 'icon',
        description:
          'Treść osadzana w nazwanym slocie „icon”. W React jest to prop ReactNode „icon”.',
      },
      {
        name: 'valueLabel',
        description:
          'Treść osadzana w nazwanym slocie „value-label”. W React jest to prop ReactNode „valueLabel”.',
      },
      {
        name: 'description',
        description:
          'Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „description”.',
      },
      {
        name: 'error',
        description:
          'Treść osadzana w nazwanym slocie „error”. W React jest to prop ReactNode „error”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormSelect',
    sourceName: 'FormSelect',
    framework: 'react',
    importPath: '@peaui/ui/react/form/FormSelect',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Unikalny identyfikator elementu w dokumencie.',
      },
      {
        name: 'canErase',
        type: 'boolean',
        required: false,
        description: 'Pokazuje akcję pozwalającą wyczyścić bieżącą wartość.',
      },
      {
        name: 'after',
        type: 'string',
        required: false,
        description: 'Treść wyświetlana za właściwą wartością pola.',
      },
      {
        name: 'before',
        type: 'string',
        required: false,
        description: 'Treść wyświetlana przed właściwą wartością pola.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description: 'Nazwa pola używana przez formularz lub nazwa zasobu.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description: 'Widoczna etykieta opisująca element lub pole formularza.',
      },
      {
        name: 'iconBefore',
        type: 'string',
        required: false,
        description: 'Nazwa ikony wyświetlanej przed treścią pola.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description: 'Oznacza wartość jako wymaganą.',
      },
      {
        name: 'placement',
        type: "'top' | 'bottom'",
        required: false,
        description:
          'Preferred list placement. The list flips when the preferred side has insufficient space.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: 'wybierz/wyszukaj',
        description: 'Tekst pomocniczy widoczny przed wprowadzeniem wartości.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description: 'Ustawia komponent w trybie tylko do odczytu.',
      },
      {
        name: 'canWrite',
        type: 'boolean',
        required: false,
        description: 'Konfiguruje właściwość „can write” komponentu.',
      },
      {
        name: 'searchable',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Konfiguruje właściwość „searchable” komponentu.',
      },
      {
        name: 'size',
        type: "'xs' | 's' | 'm' | 'l'",
        required: false,
        default: 'm',
        description: 'Wariant rozmiaru komponentu.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'options',
        type: 'SelectFieldOption[]',
        required: true,
        description: 'Lista opcji dostępnych do wyświetlenia lub wyboru.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'unknown',
        required: false,
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange.',
      },
    ],
    events: [
      {
        name: 'onRemove',
        description: 'Emitowane po wybraniu akcji usunięcia. W React przekaż callback onRemove.',
      },
    ],
    slots: [
      {
        name: 'hint',
        description:
          'Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”.',
      },
      {
        name: 'description',
        description:
          'Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „description”.',
      },
      {
        name: 'error',
        description:
          'Treść osadzana w nazwanym slocie „error”. W React jest to prop ReactNode „error”.',
      },
      {
        name: 'success',
        description:
          'Treść osadzana w nazwanym slocie „success”. W React jest to prop ReactNode „success”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormSwitchToggle',
    sourceName: 'FormSwitchToggle',
    framework: 'react',
    importPath: '@peaui/ui/react/form/FormSwitchToggle',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: false,
        description:
          'Unikalny identyfikator kontrolki. Generowany automatycznie, jeśli nie zostanie podany.',
      },
      {
        name: 'name',
        type: 'string',
        required: false,
        description: 'Nazwa pola używana podczas natywnego wysyłania formularza.',
      },
      {
        name: 'form',
        type: 'string',
        required: false,
        description:
          'Identyfikator formularza właściciela, również gdy kontrolka znajduje się poza formularzem.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        default: '',
        description: 'Widoczna etykieta przełącznika.',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        default: '',
        description: 'Tekst pomocniczy powiązany z kontrolką przez aria-describedby.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        default: '',
        description: 'Komunikat błędu powiązany z kontrolką i aria-invalid.',
      },
      {
        name: 'trueValue',
        type: 'Value',
        required: false,
        description: 'Wartość modelu reprezentująca stan włączony.',
      },
      {
        name: 'falseValue',
        type: 'Value',
        required: false,
        description: 'Wartość modelu reprezentująca stan wyłączony.',
      },
      {
        name: 'size',
        type: "'s' | 'm' | 'l'",
        required: false,
        default: 'm',
        description: 'Rozmiar wizualny szyny; obszar dotykowy zawsze ma co najmniej 44 px.',
      },
      {
        name: 'labelPosition',
        type: "'start' | 'end'",
        required: false,
        default: 'end',
        description: 'Pozycja etykiety względem szyny.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wyłącza kontrolkę i usuwa ją z kolejności fokusu.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Blokuje zmianę, zachowując kontrolkę w kolejności fokusu.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Blokuje zmianę i udostępnia stan zajętości technologiom asystującym.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Oznacza pole jako wymagane dla formularza i technologii asystujących.',
      },
      {
        name: 'showStateLabel',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Pokazuje tekstowy stan obok szyny bez polegania wyłącznie na kolorze.',
      },
      {
        name: 'onLabel',
        type: 'string',
        required: false,
        default: 'Włączone',
        description: 'Tekst widoczny dla stanu włączonego.',
      },
      {
        name: 'offLabel',
        type: 'string',
        required: false,
        default: 'Wyłączone',
        description: 'Tekst widoczny dla stanu wyłączonego.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        default: '',
        description: 'Dostępna nazwa używana, gdy nie ma widocznej etykiety.',
      },
      {
        name: 'loadingLabel',
        type: 'string',
        required: false,
        default: 'Trwa aktualizowanie ustawienia',
        description: 'Dostępny komunikat stanu ładowania.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator używany w testach automatycznych.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'Value',
        required: false,
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange.',
      },
    ],
    events: [
      {
        name: 'onChange',
        description:
          'Emitowane po zmianie wartości przez użytkownika. W React przekaż callback onChange.',
      },
      {
        name: 'onFocus',
        description:
          'Emitowane po ustawieniu fokusu na kontrolce. W React przekaż callback onFocus.',
      },
      {
        name: 'onBlur',
        description:
          'Emitowane po opuszczeniu kontrolki przez fokus. W React przekaż callback onBlur.',
      },
    ],
    slots: [
      {
        name: 'labelContent',
        description:
          'Treść osadzana w nazwanym slocie „label”. W React jest to prop ReactNode „labelContent”.',
      },
      {
        name: 'renderThumb',
        description:
          'Treść osadzana w nazwanym slocie „thumb”. W React jest to funkcja renderThumb otrzymująca stan checked i loading.',
      },
      {
        name: 'onLabelContent',
        description:
          'Treść osadzana w nazwanym slocie „on-label”. W React jest to prop ReactNode „onLabelContent”.',
      },
      {
        name: 'offLabelContent',
        description:
          'Treść osadzana w nazwanym slocie „off-label”. W React jest to prop ReactNode „offLabelContent”.',
      },
      {
        name: 'descriptionContent',
        description:
          'Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „descriptionContent”.',
      },
      {
        name: 'errorContent',
        description:
          'Treść osadzana w nazwanym slocie „error”. W React jest to prop ReactNode „errorContent”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormTagsInput',
    sourceName: 'FormTagsInput',
    framework: 'react',
    importPath: '@peaui/ui/react/form/FormTagsInput',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: false,
        description: 'Unikalny identyfikator pola.',
      },
      {
        name: 'name',
        type: 'string',
        required: false,
        description: 'Nazwa używana przez natywny formularz; każdy tag tworzy osobną wartość.',
      },
      {
        name: 'form',
        type: 'string',
        required: false,
        description: 'Identyfikator formularza właściciela.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        default: '',
        description: 'Widoczna etykieta pola.',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        default: '',
        description: 'Tekst pomocniczy powiązany z polem.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        default: '',
        description: 'Komunikat błędu powiązany przez aria-describedby.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: 'Dodaj tag',
        description: 'Placeholder edytora.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        default: '',
        description: 'Dostępna nazwa, gdy nie podano widocznej etykiety.',
      },
      {
        name: 'layout',
        type: 'FormTagsInputLayout',
        required: false,
        default: 'inline',
        description: 'Układ tagów i edytora.',
      },
      {
        name: 'mode',
        type: 'FormTagsInputMode',
        required: false,
        default: 'freeform',
        description: 'Tryb swobodny albo ograniczony do sugestii.',
      },
      {
        name: 'allowCreate',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Pozwala utworzyć tag spoza listy sugestii.',
      },
      {
        name: 'allowDuplicates',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Pozwala dodać tag o tym samym kluczu więcej niż raz.',
      },
      {
        name: 'max',
        type: 'number',
        required: false,
        description: 'Maksymalna liczba tagów.',
      },
      {
        name: 'separators',
        type: 'readonly string[]',
        required: false,
        default: "[',', ';', '\\n']",
        description: 'Separatory używane podczas wpisywania i wklejania.',
      },
      {
        name: 'suggestions',
        type: 'readonly FormTagsInputTag[]',
        required: false,
        default: '[]',
        description: 'Kontrolowana lista sugestii.',
      },
      {
        name: 'suggestionProvider',
        type: 'FormTagsInputSuggestionProvider',
        required: false,
        description: 'Opcjonalny dostawca sugestii z anulowaniem nieaktualnych zapytań.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Zewnętrzny stan ładowania sugestii.',
      },
      {
        name: 'placement',
        type: 'FormTagsInputPlacement',
        required: false,
        default: 'auto',
        description: 'Położenie panelu sugestii.',
      },
      {
        name: 'normalizeTag',
        type: 'FormTagsInputNormalizer',
        required: false,
        description: 'Normalizuje tekst przed walidacją.',
      },
      {
        name: 'validateTag',
        type: 'FormTagsInputValidator',
        required: false,
        description: 'Waliduje pojedynczy tag przed zmianą modelu.',
      },
      {
        name: 'getTagKey',
        type: 'FormTagsInputKeyGetter',
        required: false,
        description: 'Wyznacza stabilny klucz i regułę duplikatów.',
      },
      {
        name: 'serializeTag',
        type: 'FormTagsInputSerializer',
        required: false,
        description: 'Serializuje wartości do natywnych pól formularza.',
      },
      {
        name: 'disabledTags',
        type: 'readonly (string | number)[]',
        required: false,
        default: '[]',
        description: 'Klucze lub etykiety tagów, których nie można edytować ani usunąć.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wyłącza całą kontrolkę.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Pozwala odczytać i kopiować zawartość bez jej zmiany.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Oznacza pole jako wymagane.',
      },
      {
        name: 'loadingLabel',
        type: 'string',
        required: false,
        default: 'Ładowanie sugestii',
        description: 'Tekst prezentowany podczas ładowania sugestii.',
      },
      {
        name: 'emptyLabel',
        type: 'string',
        required: false,
        default: 'Brak pasujących sugestii',
        description: 'Tekst pustego wyniku wyszukiwania.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator używany w testach.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'FormTagsInputTag[]',
        required: false,
        default: '[]',
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange.',
      },
      {
        name: 'inputValue',
        type: 'string',
        required: false,
        default: '',
        description:
          'Wartość kontrolowana przez v-model:inputValue. W React dostępne są propsy inputValue, defaultInputValue i onInputValueChange.',
      },
    ],
    events: [
      {
        name: 'onAdd',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „add”. W React przekaż callback onAdd.',
      },
      {
        name: 'onRemove',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „remove”. W React przekaż callback onRemove.',
      },
      {
        name: 'onEdit',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „edit”. W React przekaż callback onEdit.',
      },
      {
        name: 'onInvalidTag',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „invalidTag”. W React przekaż callback onInvalidTag.',
      },
      {
        name: 'onSearch',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „search”. W React przekaż callback onSearch.',
      },
      {
        name: 'onMaxReached',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „maxReached”. W React przekaż callback onMaxReached.',
      },
    ],
    slots: [
      {
        name: 'renderLabel',
        description:
          'Treść osadzana w nazwanym slocie „label”. W React jest to prop ReactNode „renderLabel”.',
      },
      {
        name: 'renderHint',
        description:
          'Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „renderHint”.',
      },
      {
        name: 'renderTag',
        description:
          'Treść osadzana w nazwanym slocie „tag”. W React jest to prop ReactNode „renderTag”.',
      },
      {
        name: 'renderTagContent',
        description:
          'Treść osadzana w nazwanym slocie „tag-content”. W React jest to prop ReactNode „renderTagContent”.',
      },
      {
        name: 'renderSuggestion',
        description:
          'Treść osadzana w nazwanym slocie „suggestion”. W React jest to prop ReactNode „renderSuggestion”.',
      },
      {
        name: 'renderEmptySuggestions',
        description:
          'Treść osadzana w nazwanym slocie „empty-suggestions”. W React jest to prop ReactNode „renderEmptySuggestions”.',
      },
      {
        name: 'loadingContent',
        description:
          'Treść osadzana w nazwanym slocie „loading”. W React jest to prop ReactNode „loadingContent”.',
      },
      {
        name: 'prefixContent',
        description:
          'Treść osadzana w nazwanym slocie „prefix”. W React jest to prop ReactNode „prefixContent”.',
      },
      {
        name: 'suffixContent',
        description:
          'Treść osadzana w nazwanym slocie „suffix”. W React jest to prop ReactNode „suffixContent”.',
      },
      {
        name: 'descriptionContent',
        description:
          'Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „descriptionContent”.',
      },
      {
        name: 'errorContent',
        description:
          'Treść osadzana w nazwanym slocie „error”. W React jest to prop ReactNode „errorContent”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormTextarea',
    sourceName: 'FormTextarea',
    framework: 'react',
    importPath: '@peaui/ui/react/form/FormTextarea',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Unikalny identyfikator elementu w dokumencie.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description: 'Nazwa pola używana przez formularz lub nazwa zasobu.',
      },
      {
        name: 'rows',
        type: 'number',
        required: false,
        default: '5',
        description: 'Konfiguruje właściwość „rows” komponentu.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description: 'Widoczna etykieta opisująca element lub pole formularza.',
      },
      {
        name: 'maxLength',
        type: 'number',
        required: false,
        description: 'Maksymalna liczba znaków możliwa do wprowadzenia.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description: 'Oznacza wartość jako wymaganą.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: 'wpisz',
        description: 'Tekst pomocniczy widoczny przed wprowadzeniem wartości.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description: 'Ustawia komponent w trybie tylko do odczytu.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string | undefined',
        required: false,
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange.',
      },
    ],
    events: [],
    slots: [
      {
        name: 'hint',
        description:
          'Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”.',
      },
      {
        name: 'description',
        description:
          'Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „description”.',
      },
      {
        name: 'error',
        description:
          'Treść osadzana w nazwanym slocie „error”. W React jest to prop ReactNode „error”.',
      },
      {
        name: 'success',
        description:
          'Treść osadzana w nazwanym slocie „success”. W React jest to prop ReactNode „success”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormTimePicker',
    sourceName: 'FormTimePicker',
    framework: 'react',
    importPath: '@peaui/ui/react/form/FormTimePicker',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Stabilny identyfikator pola i powiązanych elementów ARIA.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description: 'Nazwa pola używana przy wysyłaniu formularza.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description: 'Widoczna etykieta pola.',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        description: 'Tekst pomocy wyświetlany pod polem.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        description: 'Zewnętrzny komunikat błędu; ma pierwszeństwo przed walidacją wewnętrzną.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: 'undefined',
        description: 'Placeholder opisujący oczekiwany format.',
      },
      {
        name: 'variant',
        type: 'FormTimePickerVariant',
        required: false,
        default: 'input',
        description: 'Edytowalne pole tekstowe albo zestaw dostępnych segmentów.',
      },
      {
        name: 'panelMode',
        type: 'FormTimePickerPanelMode',
        required: false,
        default: 'dropdown',
        description: 'Lista opcji albo kompaktowe kontrolki spinbutton w panelu.',
      },
      {
        name: 'placement',
        type: 'FormTimePickerPlacement',
        required: false,
        default: 'bottom',
        description:
          'Preferowane położenie panelu; komponent może odwrócić je przy krawędzi viewportu.',
      },
      {
        name: 'format',
        type: 'FormTimePickerFormat',
        required: false,
        default: '24h',
        description: 'Format prezentacji. Model zawsze pozostaje wartością 24-godzinną.',
      },
      {
        name: 'showSeconds',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Dodaje segment sekund do pola, modelu i panelu.',
      },
      {
        name: 'hourStep',
        type: 'number',
        required: false,
        default: '1',
        description: 'Krok godzin wykorzystywany przez opcje i klawiaturę.',
      },
      {
        name: 'minuteStep',
        type: 'number',
        required: false,
        default: '5',
        description: 'Krok minut wykorzystywany przez opcje i klawiaturę.',
      },
      {
        name: 'secondStep',
        type: 'number',
        required: false,
        default: '5',
        description: 'Krok sekund wykorzystywany przez opcje i klawiaturę.',
      },
      {
        name: 'min',
        type: 'string',
        required: false,
        description: 'Najwcześniejsza dozwolona wartość w formacie HH:mm[:ss].',
      },
      {
        name: 'max',
        type: 'string',
        required: false,
        description: 'Najpóźniejsza dozwolona wartość w formacie HH:mm[:ss].',
      },
      {
        name: 'allowOffStep',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Pozwala zatwierdzić ręcznie wpisaną wartość, która nie leży na siatce kroków.',
      },
      {
        name: 'locale',
        type: 'string',
        required: false,
        default: 'pl-PL',
        description: 'Locale używany do prezentacji okresu dnia w formacie 12h.',
      },
      {
        name: 'parse',
        type: 'TimePickerParser',
        required: false,
        description: 'Opcjonalny parser tekstu zastępujący parser wbudowany.',
      },
      {
        name: 'formatValue',
        type: 'TimePickerFormatter',
        required: false,
        description: 'Opcjonalny formatter prezentacji zastępujący formatter wbudowany.',
      },
      {
        name: 'canErase',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Pozwala usunąć bieżącą wartość przyciskiem pola.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Pole musi zawierać poprawną wartość.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Całkowicie blokuje kontrolkę.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Pozwala odczytać wartość bez jej zmiany.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Blokuje interakcje i udostępnia stan oczekiwania technologiom asystującym.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        description: 'Dostępna nazwa pola, gdy nie ma widocznej etykiety.',
      },
      {
        name: 'panelAriaLabel',
        type: 'string',
        required: false,
        description: 'Dostępna nazwa panelu wyboru czasu.',
      },
      {
        name: 'triggerAriaLabel',
        type: 'string',
        required: false,
        description: 'Dostępna nazwa przycisku panelu w wariancie segmented.',
      },
      {
        name: 'loadingLabel',
        type: 'string',
        required: false,
        default: 'Ładowanie wyboru czasu',
        description: 'Tekst ogłaszany podczas ładowania.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator używany w testach automatycznych.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string | undefined',
        required: false,
        default: 'undefined',
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange.',
      },
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Stan otwarcia kontrolowany przez v-model:open. W React dostępne są propsy open, defaultOpen i onOpenChange.',
      },
    ],
    events: [
      {
        name: 'onChange',
        description:
          'Emitowane po zmianie wartości przez użytkownika. W React przekaż callback onChange.',
      },
      {
        name: 'onInvalid',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „invalid”. W React przekaż callback onInvalid.',
      },
      {
        name: 'onOpen',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „open”. W React przekaż callback onOpen.',
      },
      {
        name: 'onClose',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „close”. W React przekaż callback onClose.',
      },
    ],
    slots: [
      {
        name: 'renderTrigger',
        description:
          'Treść osadzana w nazwanym slocie „trigger”. W React jest to prop ReactNode „renderTrigger”.',
      },
      {
        name: 'renderHourOption',
        description:
          'Treść osadzana w nazwanym slocie „hour-option”. W React jest to prop ReactNode „renderHourOption”.',
      },
      {
        name: 'renderMinuteOption',
        description:
          'Treść osadzana w nazwanym slocie „minute-option”. W React jest to prop ReactNode „renderMinuteOption”.',
      },
      {
        name: 'renderSecondOption',
        description:
          'Treść osadzana w nazwanym slocie „second-option”. W React jest to prop ReactNode „renderSecondOption”.',
      },
      {
        name: 'renderPeriodOption',
        description:
          'Treść osadzana w nazwanym slocie „period-option”. W React jest to prop ReactNode „renderPeriodOption”.',
      },
      {
        name: 'footerContent',
        description:
          'Treść osadzana w nazwanym slocie „footer”. W React jest to prop ReactNode „footerContent”.',
      },
      {
        name: 'errorContent',
        description:
          'Treść osadzana w nazwanym slocie „error”. W React jest to prop ReactNode „errorContent”.',
      },
      {
        name: 'descriptionContent',
        description:
          'Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „descriptionContent”.',
      },
      {
        name: 'hint',
        description:
          'Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormYearPicker',
    sourceName: 'FormYearPicker',
    framework: 'react',
    importPath: '@peaui/ui/react/form/FormYearPicker',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Unikalny identyfikator elementu w dokumencie.',
      },
      {
        name: 'canErase',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Pokazuje akcję pozwalającą wyczyścić bieżącą wartość.',
      },
      {
        name: 'after',
        type: 'string',
        required: false,
        description: 'Treść wyświetlana za właściwą wartością pola.',
      },
      {
        name: 'before',
        type: 'string',
        required: false,
        description: 'Treść wyświetlana przed właściwą wartością pola.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description: 'Nazwa pola używana przez formularz lub nazwa zasobu.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description: 'Widoczna etykieta opisująca element lub pole formularza.',
      },
      {
        name: 'iconBefore',
        type: 'string',
        required: false,
        description: 'Nazwa ikony wyświetlanej przed treścią pola.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description: 'Oznacza wartość jako wymaganą.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: 'wybierz rok',
        description: 'Tekst pomocniczy widoczny przed wprowadzeniem wartości.',
      },
      {
        name: 'range',
        type: 'boolean',
        required: false,
        description: 'Konfiguruje właściwość „range” komponentu.',
      },
      {
        name: 'minYear',
        type: 'number',
        required: false,
        description: 'Konfiguruje właściwość „min year” komponentu.',
      },
      {
        name: 'maxYear',
        type: 'number',
        required: false,
        description: 'Konfiguruje właściwość „max year” komponentu.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description: 'Ustawia komponent w trybie tylko do odczytu.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'number | YearPickerRangeValue | undefined',
        required: false,
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange.',
      },
    ],
    events: [
      {
        name: 'onRemove',
        description: 'Emitowane po wybraniu akcji usunięcia. W React przekaż callback onRemove.',
      },
    ],
    slots: [
      {
        name: 'hint',
        description:
          'Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”.',
      },
      {
        name: 'description',
        description:
          'Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „description”.',
      },
      {
        name: 'error',
        description:
          'Treść osadzana w nazwanym slocie „error”. W React jest to prop ReactNode „error”.',
      },
      {
        name: 'success',
        description:
          'Treść osadzana w nazwanym slocie „success”. W React jest to prop ReactNode „success”.',
      },
    ],
  },
  {
    category: 'layout',
    categoryLabel: 'Układ',
    name: 'CardPanel',
    sourceName: 'CardPanel',
    framework: 'react',
    importPath: '@peaui/ui/react/layout/CardPanel',
    status: 'stable',
    props: [
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
      {
        name: 'isShadowEnabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „is shadow enabled” komponentu.',
      },
      {
        name: 'isHoverEnabled',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Konfiguruje właściwość „is hover enabled” komponentu.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'as',
        type: "'div' | 'section' | 'article' | 'a' | Component",
        required: false,
        default: 'div',
        description: 'Konfiguruje właściwość „as” komponentu.',
      },
      {
        name: 'backgroundColor',
        type: "'default' | 'primary' | 'grey'",
        required: false,
        default: 'default',
        description: 'Konfiguruje właściwość „background color” komponentu.',
      },
      {
        name: 'borderColor',
        type: "'default' | 'primary' | 'grey'",
        required: false,
        default: 'default',
        description: 'Konfiguruje właściwość „border color” komponentu.',
      },
      {
        name: 'size',
        type: "'xs' | 's' | 'm' | 'l'",
        required: false,
        default: 'm',
        description: 'Wariant rozmiaru komponentu.',
      },
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'header',
        description:
          'Treść osadzana w nazwanym slocie „header”. W React jest to prop ReactNode „header”.',
      },
      {
        name: 'children',
        description: 'Główna treść React przekazywana przez children.',
      },
    ],
  },
  {
    category: 'layout',
    categoryLabel: 'Układ',
    name: 'FullscreenContainer',
    sourceName: 'FullscreenContainer',
    framework: 'react',
    importPath: '@peaui/ui/react/layout/FullscreenContainer',
    status: 'stable',
    props: [
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'openLabel',
        type: 'string',
        required: false,
        default: 'Otwórz tryb pełnoekranowy',
        description: 'Konfiguruje właściwość „open label” komponentu.',
      },
      {
        name: 'closeLabel',
        type: 'string',
        required: false,
        default: 'Zamknij tryb pełnoekranowy',
        description: 'Konfiguruje właściwość „close label” komponentu.',
      },
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'children',
        description: 'Główna treść React przekazywana przez children.',
      },
    ],
  },
  {
    category: 'layout',
    categoryLabel: 'Układ',
    name: 'GridItem',
    sourceName: 'GridItem',
    framework: 'react',
    importPath: '@peaui/ui/react/layout/GridItem',
    status: 'stable',
    props: [
      {
        name: 'colspan',
        type: 'number',
        required: false,
        description: 'Konfiguruje właściwość „colspan” komponentu.',
      },
      {
        name: 'columns',
        type: 'number',
        required: false,
        default: '2',
        description: 'Definicje kolumn określające ich etykiety, klucze i sposób renderowania.',
      },
      {
        name: 'gap',
        type: 'number',
        required: false,
        default: '6',
        description: 'Odstęp pomiędzy elementami układu.',
      },
      {
        name: 'grid',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Konfiguruje właściwość „grid” komponentu.',
      },
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'children',
        description: 'Główna treść React przekazywana przez children.',
      },
    ],
  },
  {
    category: 'layout',
    categoryLabel: 'Układ',
    name: 'GridSection',
    sourceName: 'GridSection',
    framework: 'react',
    importPath: '@peaui/ui/react/layout/GridSection',
    status: 'stable',
    props: [
      {
        name: 'columns',
        type: 'number',
        required: false,
        default: '4',
        description: 'Definicje kolumn określające ich etykiety, klucze i sposób renderowania.',
      },
      {
        name: 'gap',
        type: 'number',
        required: false,
        default: '6',
        description: 'Odstęp pomiędzy elementami układu.',
      },
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'additional',
        description:
          'Treść osadzana w nazwanym slocie „additional”. W React jest to prop ReactNode „additional”.',
      },
      {
        name: 'children',
        description: 'Główna treść React przekazywana przez children.',
      },
    ],
  },
  {
    category: 'layout',
    categoryLabel: 'Układ',
    name: 'PageLayout',
    sourceName: 'PageLayout',
    framework: 'react',
    importPath: '@peaui/ui/react/layout/PageLayout',
    status: 'stable',
    props: [
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
      {
        name: 'isHeaderSticky',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „is header sticky” komponentu.',
      },
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'top',
        description:
          'Treść osadzana w nazwanym slocie „top”. W React jest to prop ReactNode „top”.',
      },
      {
        name: 'additional',
        description:
          'Treść osadzana w nazwanym slocie „additional”. W React jest to prop ReactNode „additional”.',
      },
      {
        name: 'children',
        description: 'Główna treść React przekazywana przez children.',
      },
      {
        name: 'footer',
        description:
          'Treść osadzana w nazwanym slocie „footer”. W React jest to prop ReactNode „footer”.',
      },
    ],
  },
  {
    category: 'layout',
    categoryLabel: 'Układ',
    name: 'ScrollArea',
    sourceName: 'ScrollArea',
    framework: 'react',
    importPath: '@peaui/ui/react/layout/ScrollArea',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator komponentu, relacji ARIA i opcjonalnie zapisanej pozycji.',
      },
      {
        name: 'type',
        type: 'ScrollAreaType',
        required: false,
        default: 'styled',
        description: 'Natywne paski systemowe albo dostępne paski stylowane przez PeaUI.',
      },
      {
        name: 'orientation',
        type: 'ScrollAreaOrientation',
        required: false,
        default: 'vertical',
        description: 'Osie, na których zawartość może być przewijana.',
      },
      {
        name: 'scrollbarVisibility',
        type: 'ScrollAreaScrollbarVisibility',
        required: false,
        default: 'auto',
        description: 'Sposób widoczności stylowanych pasków przewijania.',
      },
      {
        name: 'scrollbarSize',
        type: 'number',
        required: false,
        default: '10',
        description: 'Grubość paska w pikselach, ograniczona do zakresu 6–20.',
      },
      {
        name: 'autoHideDelay',
        type: 'number',
        required: false,
        default: '700',
        description: 'Opóźnienie ukrycia automatycznego paska w milisekundach, maksymalnie 10000.',
      },
      {
        name: 'tabIndex',
        type: 'number',
        required: false,
        description:
          'Opcjonalny tabindex natywnego viewportu; bez niego komponent nie dodaje przystanku Tab. W React użyj standardowego propa tabIndex.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        description: 'Dostępna nazwa przewijanego regionu.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Blokuje publiczne metody i sterowanie stylowanymi paskami, zachowując natywny scroll.',
      },
      {
        name: 'restorePosition',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Przywraca pozycję po ponownym montażu, gdy przekazano stabilne id.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny selektor testowy elementu głównego.',
      },
    ],
    models: [],
    events: [
      {
        name: 'onScroll',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „scroll”. W React przekaż callback onScroll.',
      },
      {
        name: 'onScrollStart',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „scrollStart”. W React przekaż callback onScrollStart.',
      },
      {
        name: 'onScrollEnd',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „scrollEnd”. W React przekaż callback onScrollEnd.',
      },
      {
        name: 'onReachStart',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „reachStart”. W React przekaż callback onReachStart.',
      },
      {
        name: 'onReachEnd',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „reachEnd”. W React przekaż callback onReachEnd.',
      },
      {
        name: 'onResize',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „resize”. W React przekaż callback onResize.',
      },
    ],
    slots: [
      {
        name: 'children',
        description: 'Główna treść React przekazywana przez children.',
      },
      {
        name: 'renderScrollbar',
        description:
          'Treść osadzana w nazwanym slocie „scrollbar”. W React funkcja renderScrollbar otrzymuje orientację paska.',
      },
      {
        name: 'startIndicator',
        description:
          'Treść osadzana w nazwanym slocie „start-indicator”. W React jest to prop ReactNode „startIndicator”.',
      },
      {
        name: 'endIndicator',
        description:
          'Treść osadzana w nazwanym slocie „end-indicator”. W React jest to prop ReactNode „endIndicator”.',
      },
    ],
  },
  {
    category: 'layout',
    categoryLabel: 'Układ',
    name: 'SectionDivider',
    sourceName: 'SectionDivider',
    framework: 'react',
    importPath: '@peaui/ui/react/layout/SectionDivider',
    status: 'stable',
    props: [
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'direction',
        type: "'horizontal' | 'vertical'",
        required: false,
        default: 'horizontal',
        description: 'Konfiguruje właściwość „direction” komponentu.',
      },
      {
        name: 'size',
        type: "'s' | 'm' | 'l' | 'xl'",
        required: false,
        default: 's',
        description: 'Wariant rozmiaru komponentu.',
      },
    ],
    models: [],
    events: [],
    slots: [],
  },
  {
    category: 'navigation',
    categoryLabel: 'Nawigacja',
    name: 'Breadcrumbs',
    sourceName: 'Breadcrumbs',
    framework: 'react',
    importPath: '@peaui/ui/react/navigation/Breadcrumbs',
    status: 'stable',
    props: [
      {
        name: 'items',
        type: 'BreadcrumbItem[]',
        required: false,
        default: '[]',
        description: 'Konfiguruje właściwość „items” komponentu.',
      },
      {
        name: 'separator',
        type: 'string',
        required: false,
        default: '/',
        description: 'Konfiguruje właściwość „separator” komponentu.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        default: 'Ścieżka nawigacji',
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
    ],
    models: [],
    events: [
      {
        name: 'onNavigate',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „on:navigate”. W React przekaż callback onNavigate.',
      },
    ],
    slots: [],
  },
  {
    category: 'navigation',
    categoryLabel: 'Nawigacja',
    name: 'ContextMenu',
    sourceName: 'ContextMenu',
    framework: 'react',
    importPath: '@peaui/ui/react/navigation/ContextMenu',
    status: 'stable',
    props: [
      {
        name: 'items',
        type: 'DropdownMenuItem[]',
        required: false,
        default: '[]',
        description: 'Pozycje współdzielące pełny kontrakt semantyczny z DropdownMenu.',
      },
      {
        name: 'context',
        type: 'unknown',
        required: false,
        description: 'Dane domenowe bieżącego celu przekazywane w zdarzeniach akcji.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wyłącza wyłącznie menu kontekstowe, bez blokowania podstawowej funkcji celu.',
      },
      {
        name: 'trigger',
        type: "'pointer' | 'keyboard' | 'both'",
        required: false,
        default: 'both',
        description: 'Dozwolony sposób otwierania menu.',
      },
      {
        name: 'position',
        type: "'cursor' | 'target'",
        required: false,
        default: 'cursor',
        description: 'Pozycjonuje menu przy kursorze albo przy prostokącie aktywnego celu.',
      },
      {
        name: 'longPress',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Włącza otwieranie dotykiem po bezruchowym przytrzymaniu.',
      },
      {
        name: 'longPressDelay',
        type: 'number',
        required: false,
        default: '550',
        description:
          'Czas przytrzymania w milisekundach; wartości są ograniczane do bezpiecznego zakresu.',
      },
      {
        name: 'longPressMoveThreshold',
        type: 'number',
        required: false,
        default: '10',
        description: 'Maksymalny ruch wskaźnika w pikselach przed anulowaniem long press.',
      },
      {
        name: 'closeOnScroll',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Zamyka otwarte menu po przewinięciu dokumentu lub kontenera celu.',
      },
      {
        name: 'offset',
        type: 'number',
        required: false,
        default: '4',
        description: 'Odstęp powierzchni menu od punktu albo celu w pikselach.',
      },
      {
        name: 'closeOnSelect',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Zamyka menu po zwykłej akcji.',
      },
      {
        name: 'loop',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Pozwala zapętlać nawigację strzałkami.',
      },
      {
        name: 'density',
        type: 'DropdownMenuDensity',
        required: false,
        default: 'comfortable',
        description: 'Gęstość pionowa pozycji menu.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        default: 'Menu kontekstowe',
        description: 'Dostępna nazwa powierzchni menu.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Pokazuje stan ładowania zamiast pozycji.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator używany w testach automatycznych.',
      },
    ],
    models: [
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Stan otwarcia kontrolowany przez v-model:open. W React dostępne są propsy open, defaultOpen i onOpenChange.',
      },
    ],
    events: [
      {
        name: 'onOpen',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „open”. W React przekaż callback onOpen.',
      },
      {
        name: 'onClose',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „close”. W React przekaż callback onClose.',
      },
      {
        name: 'onSelect',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „select”. W React przekaż callback onSelect.',
      },
      {
        name: 'onCheckedChange',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „checkedChange”. W React przekaż callback onCheckedChange.',
      },
      {
        name: 'onValueChange',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „valueChange”. W React przekaż callback onValueChange.',
      },
      {
        name: 'onContextChange',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „contextChange”. W React przekaż callback onContextChange.',
      },
      {
        name: 'onLongPressCancel',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „longPressCancel”. W React przekaż callback onLongPressCancel.',
      },
    ],
    slots: [
      {
        name: 'children',
        description: 'Główna treść React przekazywana przez children.',
      },
      {
        name: 'trigger',
        description:
          'Treść osadzana w nazwanym slocie „trigger”. W React jest to prop ReactNode „trigger”.',
      },
      {
        name: 'item',
        description:
          'Treść osadzana w nazwanym slocie „item”. W React jest to prop ReactNode „item”.',
      },
      {
        name: 'itemIcon',
        description:
          'Treść osadzana w nazwanym slocie „item-icon”. W React jest to prop ReactNode „itemIcon”.',
      },
      {
        name: 'itemShortcut',
        description:
          'Treść osadzana w nazwanym slocie „item-shortcut”. W React jest to prop ReactNode „itemShortcut”.',
      },
      {
        name: 'groupLabel',
        description:
          'Treść osadzana w nazwanym slocie „group-label”. W React jest to prop ReactNode „groupLabel”.',
      },
      {
        name: 'empty',
        description:
          'Treść osadzana w nazwanym slocie „empty”. W React jest to prop ReactNode „empty”.',
      },
      {
        name: 'loading',
        description:
          'Treść osadzana w nazwanym slocie „loading”. W React jest to prop ReactNode „loading”.',
      },
    ],
  },
  {
    category: 'navigation',
    categoryLabel: 'Nawigacja',
    name: 'DropdownMenu',
    sourceName: 'DropdownMenu',
    framework: 'react',
    importPath: '@peaui/ui/react/navigation/DropdownMenu',
    status: 'stable',
    props: [
      {
        name: 'items',
        type: 'DropdownMenuItem[]',
        required: false,
        default: '[]',
        description: 'Deklaratywna kolekcja akcji, grup, separatorów i podmenu.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wyłącza trigger i wszystkie akcje menu.',
      },
      {
        name: 'placement',
        type: "'top' | 'right' | 'bottom' | 'left'",
        required: false,
        default: 'bottom',
        description:
          'Strona triggera zachowywana także przy kolizji; powierzchnia jest ograniczana do viewportu.',
      },
      {
        name: 'align',
        type: "'start' | 'center' | 'end'",
        required: false,
        default: 'start',
        description: 'Wyrównanie menu na osi poprzecznej.',
      },
      {
        name: 'offset',
        type: 'number',
        required: false,
        default: '8',
        description: 'Odstęp menu od triggera w pikselach.',
      },
      {
        name: 'closeOnSelect',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Zamyka menu po zwykłej akcji; checkbox i radio pozostają domyślnie otwarte.',
      },
      {
        name: 'loop',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Pozwala zapętlać nawigację strzałkami między skrajnymi pozycjami.',
      },
      {
        name: 'density',
        type: "'compact' | 'comfortable'",
        required: false,
        default: 'comfortable',
        description: 'Gęstość pionowa pozycji menu.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        default: 'Menu akcji',
        description: 'Dostępna nazwa powierzchni menu.',
      },
      {
        name: 'triggerLabel',
        type: 'string',
        required: false,
        default: 'Otwórz menu',
        description: 'Widoczna i dostępna etykieta domyślnego triggera.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Pokazuje stan ładowania zamiast pozycji.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator używany w testach automatycznych.',
      },
    ],
    models: [
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Stan otwarcia kontrolowany przez v-model:open. W React dostępne są propsy open, defaultOpen i onOpenChange.',
      },
    ],
    events: [
      {
        name: 'onSelect',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „select”. W React przekaż callback onSelect.',
      },
      {
        name: 'onCheckedChange',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „checkedChange”. W React przekaż callback onCheckedChange.',
      },
      {
        name: 'onValueChange',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „valueChange”. W React przekaż callback onValueChange.',
      },
      {
        name: 'onOpenChange',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „openChange”. W React przekaż callback onOpenChange.',
      },
      {
        name: 'onEscape',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „escape”. W React przekaż callback onEscape.',
      },
      {
        name: 'onOutsideClick',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „outsideClick”. W React przekaż callback onOutsideClick.',
      },
    ],
    slots: [
      {
        name: 'children',
        description: 'Główna treść React przekazywana przez children.',
      },
      {
        name: 'renderTrigger',
        description:
          'Treść osadzana w nazwanym slocie „trigger”. W React jest to prop ReactNode „renderTrigger”.',
      },
      {
        name: 'renderItem',
        description:
          'Treść osadzana w nazwanym slocie „item”. W React jest to prop ReactNode „renderItem”.',
      },
      {
        name: 'renderItemIcon',
        description:
          'Treść osadzana w nazwanym slocie „item-icon”. W React jest to prop ReactNode „renderItemIcon”.',
      },
      {
        name: 'renderItemShortcut',
        description:
          'Treść osadzana w nazwanym slocie „item-shortcut”. W React jest to prop ReactNode „renderItemShortcut”.',
      },
      {
        name: 'renderGroupLabel',
        description:
          'Treść osadzana w nazwanym slocie „group-label”. W React jest to prop ReactNode „renderGroupLabel”.',
      },
      {
        name: 'empty',
        description:
          'Treść osadzana w nazwanym slocie „empty”. W React jest to prop ReactNode „empty”.',
      },
      {
        name: 'loadingContent',
        description:
          'Treść osadzana w nazwanym slocie „loading”. W React jest to prop ReactNode „loadingContent”.',
      },
    ],
  },
  {
    category: 'navigation',
    categoryLabel: 'Nawigacja',
    name: 'ListLimitControl',
    sourceName: 'ListLimitControl',
    framework: 'react',
    importPath: '@peaui/ui/react/navigation/ListLimitControl',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Unikalny identyfikator elementu w dokumencie.',
      },
      {
        name: 'label',
        type: 'string',
        required: true,
        description: 'Widoczna etykieta opisująca element lub pole formularza.',
      },
      {
        name: 'limitList',
        type: 'number[]',
        required: false,
        default: '[5, 10, 25, 50]',
        description: 'Konfiguruje właściwość „limit list” komponentu.',
      },
      {
        name: 'position',
        type: "'top' | 'bottom'",
        required: false,
        default: 'bottom',
        description:
          'Preferred list placement; it flips automatically when the selected side has insufficient space.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
    ],
    models: [
      {
        name: 'limit',
        type: 'number',
        required: false,
        description:
          'Wybrany limit elementów kontrolowany przez v-model:limit. W React dostępne są propsy limit, defaultLimit i onLimitChange.',
      },
    ],
    events: [],
    slots: [
      {
        name: 'children',
        description: 'Główna treść React przekazywana przez children.',
      },
    ],
  },
  {
    category: 'navigation',
    categoryLabel: 'Nawigacja',
    name: 'MenuBar',
    sourceName: 'MenuBar',
    framework: 'react',
    importPath: '@peaui/ui/react/navigation/MenuBar',
    status: 'stable',
    props: [
      {
        name: 'menus',
        type: 'MenuBarMenu[]',
        required: false,
        default: '[]',
        description: 'Uporządkowane sekcje poziomego menu aplikacyjnego.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wyłącza cały pasek i zamyka aktywną sekcję.',
      },
      {
        name: 'loop',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Pozwala zapętlać fokus między pierwszym i ostatnim dostępnym triggerem.',
      },
      {
        name: 'variant',
        type: "'default' | 'compact'",
        required: false,
        default: 'default',
        description: 'Gęstość wizualna triggerów i pozycji menu.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        default: 'Menu aplikacji',
        description: 'Dostępna nazwa elementu z rolą menubar.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator używany w testach automatycznych.',
      },
    ],
    models: [
      {
        name: 'openMenu',
        type: 'string | number | null',
        required: false,
        default: 'null',
        description:
          'Wartość kontrolowana przez v-model:openMenu. W React dostępne są propsy openMenu, defaultOpenMenu i onOpenMenuChange.',
      },
    ],
    events: [
      {
        name: 'onSelect',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „select”. W React przekaż callback onSelect.',
      },
      {
        name: 'onFocusChange',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „focusChange”. W React przekaż callback onFocusChange.',
      },
      {
        name: 'onCheckedChange',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „checkedChange”. W React przekaż callback onCheckedChange.',
      },
      {
        name: 'onValueChange',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „valueChange”. W React przekaż callback onValueChange.',
      },
    ],
    slots: [
      {
        name: 'menuTrigger',
        description:
          'Treść osadzana w nazwanym slocie „menu-trigger”. W React jest to prop ReactNode „menuTrigger”.',
      },
      {
        name: 'item',
        description:
          'Treść osadzana w nazwanym slocie „item”. W React jest to prop ReactNode „item”.',
      },
      {
        name: 'groupLabel',
        description:
          'Treść osadzana w nazwanym slocie „group-label”. W React jest to prop ReactNode „groupLabel”.',
      },
      {
        name: 'shortcut',
        description:
          'Treść osadzana w nazwanym slocie „shortcut”. W React jest to prop ReactNode „shortcut”.',
      },
    ],
  },
  {
    category: 'navigation',
    categoryLabel: 'Nawigacja',
    name: 'NavigationCard',
    sourceName: 'NavigationCard',
    framework: 'react',
    importPath: '@peaui/ui/react/navigation/NavigationCard',
    status: 'stable',
    props: [
      {
        name: 'title',
        type: 'string',
        required: true,
        description: 'Główny tytuł prezentowany w komponencie.',
      },
      {
        name: 'path',
        type: 'string',
        required: false,
        description: 'Konfiguruje właściwość „path” komponentu.',
      },
      {
        name: 'description',
        type: 'string',
        required: true,
        description: 'Dodatkowy opis objaśniający zawartość albo stan komponentu.',
      },
      {
        name: 'size',
        type: "'s' | 'm' | 'l'",
        required: false,
        default: 's',
        description: 'Wariant rozmiaru komponentu.',
      },
      {
        name: 'variant',
        type: "'default' | 'complete' | 'during' | 'disabled' | 'hidden'",
        required: false,
        default: 'default',
        description: 'Wariant wizualny komponentu.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
    ],
    models: [],
    events: [],
    slots: [],
  },
  {
    category: 'navigation',
    categoryLabel: 'Nawigacja',
    name: 'NavigationDisclosureCard',
    sourceName: 'NavigationDisclosureCard',
    framework: 'react',
    importPath: '@peaui/ui/react/navigation/NavigationDisclosureCard',
    status: 'stable',
    props: [
      {
        name: 'title',
        type: 'string',
        required: true,
        description: 'Główny tytuł prezentowany w komponencie.',
      },
      {
        name: 'description',
        type: 'string',
        required: true,
        description: 'Dodatkowy opis objaśniający zawartość albo stan komponentu.',
      },
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Unikalny identyfikator elementu w dokumencie.',
      },
      {
        name: 'path',
        type: 'string',
        required: false,
        description: 'Konfiguruje właściwość „path” komponentu.',
      },
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Steruje widocznością rozwijanego elementu albo warstwy.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'titleAdditional',
        description:
          'Treść osadzana w nazwanym slocie „title-additional”. W React jest to prop ReactNode „titleAdditional”.',
      },
      {
        name: 'descriptionAdditional',
        description:
          'Treść osadzana w nazwanym slocie „description-additional”. W React jest to prop ReactNode „descriptionAdditional”.',
      },
      {
        name: 'children',
        description: 'Główna treść React przekazywana przez children.',
      },
    ],
  },
  {
    category: 'navigation',
    categoryLabel: 'Nawigacja',
    name: 'NavigationIconCard',
    sourceName: 'NavigationIconCard',
    framework: 'react',
    importPath: '@peaui/ui/react/navigation/NavigationIconCard',
    status: 'stable',
    props: [
      {
        name: 'icon',
        type: 'string',
        required: false,
        default: 'info',
        description: 'Nazwa ikony prezentowanej przez komponent.',
      },
      {
        name: 'text',
        type: 'string',
        required: false,
        default: '',
        description: 'Konfiguruje właściwość „text” komponentu.',
      },
      {
        name: 'path',
        type: 'string',
        required: false,
        default: '',
        description: 'Konfiguruje właściwość „path” komponentu.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
    ],
    models: [],
    events: [],
    slots: [],
  },
  {
    category: 'navigation',
    categoryLabel: 'Nawigacja',
    name: 'NavigationLink',
    sourceName: 'NavigationLink',
    framework: 'react',
    importPath: '@peaui/ui/react/navigation/NavigationLink',
    status: 'stable',
    props: [
      {
        name: 'path',
        type: 'string',
        required: true,
        description: 'Konfiguruje właściwość „path” komponentu.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'size',
        type: "'m' | 's' | 'xs'",
        required: false,
        default: 's',
        description: 'Wariant rozmiaru komponentu.',
      },
      {
        name: 'variant',
        type: "'default' | 'primary'",
        required: false,
        default: 'default',
        description: 'Wariant wizualny komponentu.',
      },
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'children',
        description: 'Główna treść React przekazywana przez children.',
      },
    ],
  },
  {
    category: 'navigation',
    categoryLabel: 'Nawigacja',
    name: 'NavigationStepper',
    sourceName: 'NavigationStepper',
    framework: 'react',
    importPath: '@peaui/ui/react/navigation/NavigationStepper',
    status: 'stable',
    props: [
      {
        name: 'options',
        type: 'NavStepper[]',
        required: false,
        default: '[]',
        description: 'Lista opcji dostępnych do wyświetlenia lub wyboru.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        default: 'Nawigacja kroków',
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
    ],
    models: [],
    events: [
      {
        name: 'onSelect',
        description: 'Emitowane po wybraniu elementu. W React przekaż callback onSelect.',
      },
    ],
    slots: [],
  },
  {
    category: 'navigation',
    categoryLabel: 'Nawigacja',
    name: 'NavigationTabs',
    sourceName: 'NavigationTabs',
    framework: 'react',
    importPath: '@peaui/ui/react/navigation/NavigationTabs',
    status: 'stable',
    props: [
      {
        name: 'tabs',
        type: 'Tab[]',
        required: false,
        default: '[]',
        description: 'Konfiguruje właściwość „tabs” komponentu.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: true,
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
      {
        name: 'withBackround',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Konfiguruje właściwość „with backround” komponentu.',
      },
    ],
    models: [],
    events: [
      {
        name: 'onSelect',
        description: 'Emitowane po wybraniu elementu. W React przekaż callback onSelect.',
      },
    ],
    slots: [
      {
        name: 'getSlotName(tab.key, ',
        description:
          'Treść osadzana w nazwanym slocie „getSlotName(tab.key, ”. W React jest to prop ReactNode „getSlotName(tab.key, ”.',
      },
    ],
  },
  {
    category: 'navigation',
    categoryLabel: 'Nawigacja',
    name: 'PaginationControl',
    sourceName: 'PaginationControl',
    framework: 'react',
    importPath: '@peaui/ui/react/navigation/PaginationControl',
    status: 'stable',
    props: [
      {
        name: 'ariaLabel',
        type: 'string',
        required: true,
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
      {
        name: 'totalPages',
        type: 'number',
        required: true,
        description: 'Łączna liczba stron dostępnych w paginacji.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
    ],
    models: [
      {
        name: 'page',
        type: 'number',
        required: false,
        default: '1',
        description:
          'Aktualna strona kontrolowana przez v-model:page. W React dostępne są propsy page, defaultPage i onPageChange.',
      },
    ],
    events: [],
    slots: [],
  },
  {
    category: 'overlayer',
    categoryLabel: 'Warstwy i okna',
    name: 'DrawerPanel',
    sourceName: 'DrawerPanel',
    framework: 'react',
    importPath: '@peaui/ui/react/overlayer/DrawerPanel',
    status: 'stable',
    props: [
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: true,
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
    ],
    models: [
      {
        name: 'open',
        type: 'boolean',
        required: false,
        description:
          'Stan otwarcia kontrolowany przez v-model:open. W React dostępne są propsy open, defaultOpen i onOpenChange.',
      },
    ],
    events: [],
    slots: [
      {
        name: 'header',
        description:
          'Treść osadzana w nazwanym slocie „header”. W React jest to prop ReactNode „header”.',
      },
      {
        name: 'children',
        description: 'Główna treść React przekazywana przez children.',
      },
    ],
  },
  {
    category: 'overlayer',
    categoryLabel: 'Warstwy i okna',
    name: 'InfoTooltip',
    sourceName: 'InfoTooltip',
    framework: 'react',
    importPath: '@peaui/ui/react/overlayer/InfoTooltip',
    status: 'stable',
    props: [
      {
        name: 'placement',
        type: "| 'top'\n  | 'right'\n  | 'bottom'\n  | 'left'\n  | 'top-left'\n  | 'top-right'\n  | 'bottom-left'\n  | 'bottom-right'",
        required: false,
        default: 'top',
        description: 'Konfiguruje właściwość „placement” komponentu.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'variant',
        type: "'default' | 'disabled'",
        required: false,
        default: 'default',
        description: 'Wariant wizualny komponentu.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'children',
        description: 'Główna treść React przekazywana przez children.',
      },
      {
        name: 'title',
        description:
          'Treść osadzana w nazwanym slocie „title”. W React jest to prop ReactNode „title”.',
      },
      {
        name: 'description',
        description:
          'Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „description”.',
      },
    ],
  },
  {
    category: 'overlayer',
    categoryLabel: 'Warstwy i okna',
    name: 'ModalDialog',
    sourceName: 'ModalDialog',
    framework: 'react',
    importPath: '@peaui/ui/react/overlayer/ModalDialog',
    status: 'stable',
    props: [
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: true,
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
    ],
    models: [
      {
        name: 'open',
        type: 'boolean',
        required: false,
        description:
          'Stan otwarcia kontrolowany przez v-model:open. W React dostępne są propsy open, defaultOpen i onOpenChange.',
      },
    ],
    events: [],
    slots: [
      {
        name: 'header',
        description:
          'Treść osadzana w nazwanym slocie „header”. W React jest to prop ReactNode „header”.',
      },
      {
        name: 'children',
        description: 'Główna treść React przekazywana przez children.',
      },
    ],
  },
  {
    category: 'overlayer',
    categoryLabel: 'Warstwy i okna',
    name: 'PopoverButton',
    sourceName: 'PopoverButton',
    framework: 'react',
    importPath: '@peaui/ui/react/overlayer/PopoverButton',
    status: 'stable',
    props: [
      {
        name: 'size',
        type: "'xs' | 's' | 'm' | 'l'",
        required: false,
        default: 'm',
        description: 'Wariant rozmiaru komponentu.',
      },
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'ghost' | 'danger'",
        required: false,
        default: 'primary',
        description: 'Wariant wizualny komponentu.',
      },
      {
        name: 'placement',
        type: "| 'top'\n  | 'right'\n  | 'bottom'\n  | 'left'\n  | 'top-left'\n  | 'top-right'\n  | 'bottom-left'\n  | 'bottom-right'",
        required: false,
        default: 'top',
        description: 'Konfiguruje właściwość „placement” komponentu.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
      {
        name: 'matchTriggerWidth',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „match trigger width” komponentu.',
      },
      {
        name: 'popupType',
        type: "'menu' | 'listbox' | 'tree' | 'grid' | 'dialog' | 'true'",
        required: false,
        description: 'Konfiguruje właściwość „popup type” komponentu.',
      },
      {
        name: 'useAriaLabel',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „use aria label” komponentu.',
      },
    ],
    models: [],
    events: [
      {
        name: 'onKeydown',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „keydown”. W React przekaż callback onKeydown.',
      },
      {
        name: 'onPointerdown',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „pointerdown”. W React przekaż callback onPointerdown.',
      },
    ],
    slots: [
      {
        name: 'children',
        description: 'Główna treść React przekazywana przez children.',
      },
      {
        name: 'content',
        description:
          'Treść osadzana w nazwanym slocie „content”. W React jest to prop ReactNode „content”.',
      },
    ],
  },
  {
    category: 'overlayer',
    categoryLabel: 'Warstwy i okna',
    name: 'PopoverOverlayer',
    sourceName: 'PopoverOverlayer',
    framework: 'react',
    importPath: '@peaui/ui/react/overlayer/PopoverOverlayer',
    status: 'stable',
    props: [
      {
        name: 'placement',
        type: "| 'top'\n  | 'right'\n  | 'bottom'\n  | 'left'\n  | 'top-left'\n  | 'top-right'\n  | 'bottom-left'\n  | 'bottom-right'",
        required: false,
        default: 'top',
        description: 'Konfiguruje właściwość „placement” komponentu.',
      },
      {
        name: 'dataTestId',
        type: 'string',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
      {
        name: 'contentClass',
        type: 'string',
        required: false,
        description: 'Konfiguruje właściwość „content class” komponentu.',
      },
      {
        name: 'manageTriggerAccessibility',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Konfiguruje właściwość „manage trigger accessibility” komponentu.',
      },
      {
        name: 'matchTriggerWidth',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „match trigger width” komponentu.',
      },
      {
        name: 'popupType',
        type: "'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'",
        required: false,
        description: 'Konfiguruje właściwość „popup type” komponentu.',
      },
    ],
    models: [],
    events: [
      {
        name: 'onOpenChange',
        description:
          'Emitowane, gdy komponent zgłasza zdarzenie „update:open”. W React przekaż callback onOpenChange.',
      },
    ],
    slots: [
      {
        name: 'children',
        description: 'Główna treść React przekazywana przez children.',
      },
      {
        name: 'content',
        description:
          'Treść osadzana w nazwanym slocie „content”. W React jest to prop ReactNode „content”.',
      },
    ],
  },
] as const satisfies readonly FrameworkComponentApi[];

export const generatedWebComponentApi = [
  {
    category: 'basic',
    categoryLabel: 'Podstawowe',
    name: 'ImageView',
    sourceName: 'ImageView',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/basic/ImageView',
    tagName: 'peaui-image-view',
    status: 'stable',
    props: [
      {
        name: 'src',
        type: 'string | undefined',
        required: false,
        description: 'Adres źródłowy obrazu albo innego zasobu.',
      },
      {
        name: 'alt',
        type: 'string | undefined',
        required: false,
        description: 'Alternatywny opis obrazu używany przez technologie asystujące.',
      },
      {
        name: 'size',
        type: 'ImageViewSize',
        required: false,
        description: 'Wariant rozmiaru komponentu.',
      },
      {
        name: 'max',
        type: 'string | undefined',
        required: false,
        description: 'Maksymalna dozwolona wartość albo szerokość.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „data-testid” konfigurujący komponent ImageView.',
      },
      {
        name: 'class',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „class” konfigurujący komponent ImageView.',
      },
      {
        name: 'style',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „style” konfigurujący komponent ImageView.',
      },
    ],
    models: [],
    events: [],
    slots: [],
  },
  {
    category: 'basic',
    categoryLabel: 'Podstawowe',
    name: 'SvgIcon',
    sourceName: 'SvgIcon',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/basic/SvgIcon',
    tagName: 'peaui-svg-icon',
    status: 'stable',
    props: [
      {
        name: 'name',
        type: 'string',
        required: false,
        description: 'Nazwa pola używana przez formularz lub nazwa zasobu.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „data-testid” konfigurujący komponent SvgIcon.',
      },
    ],
    models: [],
    events: [],
    slots: [],
  },
  {
    category: 'data-display',
    categoryLabel: 'Prezentacja danych',
    name: 'Avatar',
    sourceName: 'Avatar',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/data-display/Avatar',
    tagName: 'peaui-avatar',
    status: 'stable',
    props: [
      {
        name: 'alt',
        type: 'string | undefined',
        required: false,
        description: 'Alternatywny opis obrazu używany przez technologie asystujące.',
      },
      {
        name: 'aria-describedby',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „aria-describedby” konfigurujący komponent Avatar.',
      },
      {
        name: 'aria-label',
        type: 'string | null',
        required: false,
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
      {
        name: 'aria-labelledby',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „aria-labelledby” konfigurujący komponent Avatar.',
      },
      {
        name: 'class',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „class” konfigurujący komponent Avatar.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „data-testid” konfigurujący komponent Avatar.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'fallback-icon',
        type: 'string',
        required: false,
        description: 'Nazwa ikony używanej, gdy obraz ani inicjały nie są dostępne.',
      },
      {
        name: 'initials',
        type: 'string | undefined',
        required: false,
        description: 'Jawne inicjały wyświetlane przed fallbackiem ikonowym.',
      },
      {
        name: 'interactive',
        type: 'boolean',
        required: false,
        description: 'Renderuje komponent jako natywną kontrolkę interaktywną.',
      },
      {
        name: 'loading',
        type: 'AvatarLoading',
        required: false,
        description: 'Wybiera natywną strategię ładowania obrazu.',
      },
      {
        name: 'name',
        type: 'string | undefined',
        required: false,
        description: 'Nazwa pola używana przez formularz lub nazwa zasobu.',
      },
      {
        name: 'role',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „role” konfigurujący komponent Avatar.',
      },
      {
        name: 'shape',
        type: 'AvatarShape',
        required: false,
        description: 'Wariant kształtu komponentu.',
      },
      {
        name: 'size',
        type: 'AvatarSize',
        required: false,
        description: 'Wariant rozmiaru komponentu.',
      },
      {
        name: 'src',
        type: 'string | undefined',
        required: false,
        description: 'Adres źródłowy obrazu albo innego zasobu.',
      },
      {
        name: 'status',
        type: 'AvatarStatus',
        required: false,
        description: 'Stan wizualny i semantyczny komponentu.',
      },
      {
        name: 'status-label',
        type: 'string | undefined',
        required: false,
        description: 'Dostępna etykieta tekstowa opisująca status.',
      },
      {
        name: 'style',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „style” konfigurujący komponent Avatar.',
      },
    ],
    models: [],
    events: [
      {
        name: 'load',
        description: 'Emitowane po poprawnym załadowaniu obrazu.',
      },
      {
        name: 'error',
        description: 'Emitowane, gdy operacja komponentu kończy się błędem.',
      },
    ],
    slots: [
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
      {
        name: 'status',
        description: 'Treść osadzana w nazwanym slocie „status”.',
      },
    ],
  },
  {
    category: 'data-display',
    categoryLabel: 'Prezentacja danych',
    name: 'AvatarGroup',
    sourceName: 'AvatarGroup',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/data-display/AvatarGroup',
    tagName: 'peaui-avatar-group',
    status: 'stable',
    props: [
      {
        name: 'items',
        type: 'AvatarGroupItem[]',
        required: false,
        default: '[]',
        description:
          'Osoby prezentowane w stabilnej kolejności wejściowej. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'max-visible',
        type: 'number',
        required: false,
        default: '3',
        description:
          'Maksymalna liczba awatarów widocznych przed licznikiem nadmiaru. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'size',
        type: "'xs' | 's' | 'm' | 'l' | 'xl'",
        required: false,
        default: 'm',
        description:
          'Rozmiar awatarów i licznika. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'shape',
        type: "'circle' | 'rounded'",
        required: false,
        default: 'circle',
        description:
          'Kształt awatarów i licznika. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'overlap',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Włącza kompaktowy układ z nachodzącymi na siebie elementami. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'direction',
        type: "'start' | 'end'",
        required: false,
        default: 'end',
        description:
          'Określa, która krawędź stosu znajduje się wizualnie na wierzchu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'overflow-mode',
        type: "'count' | 'popover' | 'none'",
        required: false,
        default: 'count',
        description:
          'Sposób prezentacji pozycji poza limitem. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'item-key',
        type: 'keyof AvatarGroupItem | ((item: AvatarGroupItem, index: number) => string | number)',
        required: false,
        default: 'id',
        description:
          'Pole lub funkcja zwracająca stabilny klucz elementu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: 'Członkowie grupy',
        description:
          'Dostępna nazwa listy widocznych osób. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza wszystkie akcje grupy. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Sygnalizuje ładowanie szczegółowej listy w popoverze. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator używany w testach automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Stan otwarcia kontrolowany przez v-model:open. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'select',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „select”.',
      },
      {
        name: 'overflowClick',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „overflowClick”.',
      },
      {
        name: 'update:open',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „open”.',
      },
    ],
    slots: [
      {
        name: 'item',
        description: 'Treść osadzana w nazwanym slocie „item”.',
      },
      {
        name: 'overflow',
        description: 'Treść osadzana w nazwanym slocie „overflow”.',
      },
      {
        name: 'popover-header',
        description: 'Treść osadzana w nazwanym slocie „popover-header”.',
      },
      {
        name: 'popover-item',
        description: 'Treść osadzana w nazwanym slocie „popover-item”.',
      },
      {
        name: 'empty',
        description: 'Treść osadzana w nazwanym slocie „empty”.',
      },
    ],
  },
  {
    category: 'data-display',
    categoryLabel: 'Prezentacja danych',
    name: 'CalculationResults',
    sourceName: 'CalculationResults',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/data-display/CalculationResults',
    tagName: 'peaui-calculation-results',
    status: 'stable',
    props: [
      {
        name: 'is-loading',
        type: 'boolean',
        required: false,
        description:
          'Włącza stan ładowania i informuje o trwającej operacji. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description:
          'Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'result',
        type: 'string',
        required: false,
        default: '-/-',
        description:
          'Konfiguruje właściwość „result” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'label',
        type: 'string',
        required: true,
        description:
          'Widoczna etykieta opisująca element lub pole formularza. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'is-simple',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „is simple” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'show-calculate-button',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „show calculate button” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [],
    events: [
      {
        name: 'on:simulate',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:simulate”.',
      },
    ],
    slots: [
      {
        name: 'additional',
        description: 'Treść osadzana w nazwanym slocie „additional”.',
      },
      {
        name: 'hint',
        description: 'Treść osadzana w nazwanym slocie „hint”.',
      },
    ],
  },
  {
    category: 'data-display',
    categoryLabel: 'Prezentacja danych',
    name: 'CardCarousel',
    sourceName: 'CardCarousel',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/data-display/CardCarousel',
    tagName: 'peaui-card-carousel',
    status: 'stable',
    props: [
      {
        name: 'aria-label',
        type: 'string | null',
        required: false,
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
      {
        name: 'aria-labelledby',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „aria-labelledby” konfigurujący komponent CardCarousel.',
      },
      {
        name: 'animation-delay',
        type: 'number',
        required: false,
        description: 'Atrybut HTML „animation-delay” konfigurujący komponent CardCarousel.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „data-testid” konfigurujący komponent CardCarousel.',
      },
      {
        name: 'default-visible-slides',
        type: 'number | undefined',
        required: false,
        description: 'Atrybut HTML „default-visible-slides” konfigurujący komponent CardCarousel.',
      },
      {
        name: 'defualt-visible-slides',
        type: 'number | undefined',
        required: false,
        description: 'Atrybut HTML „defualt-visible-slides” konfigurujący komponent CardCarousel.',
      },
      {
        name: 'is-navigation-dots-visible',
        type: 'boolean',
        required: false,
        description:
          'Atrybut HTML „is-navigation-dots-visible” konfigurujący komponent CardCarousel.',
      },
      {
        name: 'is-navigation-visible',
        type: 'boolean',
        required: false,
        description: 'Atrybut HTML „is-navigation-visible” konfigurujący komponent CardCarousel.',
      },
      {
        name: 'with-animation',
        type: 'boolean',
        required: false,
        description: 'Atrybut HTML „with-animation” konfigurujący komponent CardCarousel.',
      },
      {
        name: 'id',
        type: 'string',
        required: false,
        description: 'Unikalny identyfikator elementu w dokumencie.',
      },
      {
        name: 'tabindex',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „tabindex” konfigurujący komponent CardCarousel.',
      },
    ],
    models: [],
    events: [],
    slots: [],
  },
  {
    category: 'data-display',
    categoryLabel: 'Prezentacja danych',
    name: 'CounterBadge',
    sourceName: 'CounterBadge',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/data-display/CounterBadge',
    tagName: 'peaui-counter-badge',
    status: 'stable',
    props: [
      {
        name: 'value',
        type: 'number',
        required: true,
        description:
          'Bieżąca wartość kontrolowana przez v-model. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'variant',
        type: "'info' | 'error' | 'success' | 'danger'",
        required: false,
        default: 'info',
        description:
          'Wariant wizualny komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'size',
        type: "'s' | 'm' | 'l'",
        required: false,
        default: 's',
        description:
          'Wariant rozmiaru komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [],
    events: [],
    slots: [],
  },
  {
    category: 'data-display',
    categoryLabel: 'Prezentacja danych',
    name: 'DescriptionField',
    sourceName: 'DescriptionField',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/data-display/DescriptionField',
    tagName: 'peaui-description-field',
    status: 'stable',
    props: [
      {
        name: 'label',
        type: 'string',
        required: false,
        description: 'Widoczna etykieta opisująca element lub pole formularza.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „data-testid” konfigurujący komponent DescriptionField.',
      },
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'additional-before',
        description: 'Treść osadzana w nazwanym slocie „additional-before”.',
      },
      {
        name: 'hint',
        description: 'Treść osadzana w nazwanym slocie „hint”.',
      },
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
      {
        name: 'additional-after',
        description: 'Treść osadzana w nazwanym slocie „additional-after”.',
      },
    ],
  },
  {
    category: 'data-display',
    categoryLabel: 'Prezentacja danych',
    name: 'DisclosurePanel',
    sourceName: 'DisclosurePanel',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/data-display/DisclosurePanel',
    tagName: 'peaui-disclosure-panel',
    status: 'stable',
    props: [
      {
        name: 'title',
        type: 'string',
        required: false,
        description:
          'Główny tytuł prezentowany w komponencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'always-open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Keeps the panel expanded and disables its toggle interaction. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'allways-open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          '@deprecated Use `alwaysOpen`. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Stan otwarcia kontrolowany przez v-model:open. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'update:open',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „open”.',
      },
    ],
    slots: [
      {
        name: 'title',
        description: 'Treść osadzana w nazwanym slocie „title”.',
      },
      {
        name: 'additional',
        description: 'Treść osadzana w nazwanym slocie „additional”.',
      },
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
    ],
  },
  {
    category: 'data-display',
    categoryLabel: 'Prezentacja danych',
    name: 'KeyboardKey',
    sourceName: 'KeyboardKey',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/data-display/KeyboardKey',
    tagName: 'peaui-keyboard-key',
    status: 'stable',
    props: [
      {
        name: 'keys',
        type: 'string | readonly string[]',
        required: true,
        description:
          'Klawisz albo uporządkowana kombinacja tokenów. String rozdziela tokeny znakiem plus. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'platform',
        type: 'KeyboardKeyPlatform',
        required: false,
        default: 'auto',
        description:
          'Platforma używana do mapowania przenośnego tokenu Mod i symboli modyfikatorów. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'format',
        type: 'KeyboardKeyFormat',
        required: false,
        default: 'symbol',
        description:
          'Symbole skracają zapis wizualny; pełne nazwy pozostają dostępne dla AT. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'size',
        type: 'KeyboardKeySize',
        required: false,
        default: 's',
        description:
          'Rozmiar keycapów zgodny ze skalą kompaktowych komponentów PeaUI. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'inline',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Wariant inline dopasowuje komponent do wiersza tekstu; false tworzy osobny blok. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'separator',
        type: 'string',
        required: false,
        default: '+',
        description:
          'Wyłącznie wizualny separator kolejnych klawiszy. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: '',
        description:
          'Pełna dostępna nazwa zastępująca automatycznie złożoną frazę. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'muted',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Ogranicza kontrast nieaktywnej wizualnie wskazówki bez dodawania semantyki disabled. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny selektor testowy elementu głównego. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'key',
        description: 'Treść osadzana w nazwanym slocie „key”.',
      },
      {
        name: 'separator',
        description: 'Treść osadzana w nazwanym slocie „separator”.',
      },
    ],
  },
  {
    category: 'data-display',
    categoryLabel: 'Prezentacja danych',
    name: 'SectionHeading',
    sourceName: 'SectionHeading',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/data-display/SectionHeading',
    tagName: 'peaui-section-heading',
    status: 'stable',
    props: [
      {
        name: 'size',
        type: 'SectionHeadingSize',
        required: false,
        description: 'Wariant rozmiaru komponentu.',
      },
      {
        name: 'as',
        type: 'SectionHeadingAs',
        required: false,
        description: 'Atrybut HTML „as” konfigurujący komponent SectionHeading.',
      },
      {
        name: 'variant',
        type: 'SectionHeadingVariant',
        required: false,
        description: 'Wariant wizualny komponentu.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „data-testid” konfigurujący komponent SectionHeading.',
      },
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'title',
        description: 'Treść osadzana w nazwanym slocie „title”.',
      },
      {
        name: 'hint',
        description: 'Treść osadzana w nazwanym slocie „hint”.',
      },
      {
        name: 'description',
        description: 'Treść osadzana w nazwanym slocie „description”.',
      },
    ],
  },
  {
    category: 'data-display',
    categoryLabel: 'Prezentacja danych',
    name: 'TableList',
    sourceName: 'TableList',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/data-display/TableList',
    tagName: 'peaui-table-list',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: false,
        default: 'list',
        description:
          'Unikalny identyfikator elementu w dokumencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: 'Tabela danych',
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'is-details',
        type: 'boolean',
        required: false,
        description:
          'Enables expandable detail rows. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'is-detials',
        type: 'boolean',
        required: false,
        description:
          '@deprecated Use `isDetails`. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'additional',
        type: 'Record<string, any>',
        required: false,
        description:
          'Konfiguruje właściwość „additional” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'can-create',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Włącza możliwość dodawania nowych rekordów. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'can-select-rows',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Włącza możliwość zaznaczania wierszy. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'can-check-rows',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „can check rows” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'can-hide-columns',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Pozwala użytkownikowi sterować widocznością kolumn. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'can-multi-sort',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „can multi sort” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'columns',
        type: 'TableColumn[] | any[]',
        required: false,
        default: '[]',
        description:
          'Definicje kolumn określające ich etykiety, klucze i sposób renderowania. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'editable',
        type: 'boolean',
        required: false,
        description:
          'Włącza tryb edycji danych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'empty-description',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „empty description” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'empty-description-inline',
        type: 'string',
        required: false,
        description:
          'Konfiguruje właściwość „empty description inline” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'records',
        type: 'any[]',
        required: false,
        default: '[]',
        description:
          'Kolekcja rekordów prezentowanych przez komponent. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'rows-per-page',
        type: 'number',
        required: false,
        default: '10',
        description:
          'Liczba rekordów wyświetlanych na jednej stronie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'current-checked-row',
        type: 'number | string',
        required: false,
        description:
          'Konfiguruje właściwość „current checked row” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'rows-total',
        type: 'number',
        required: false,
        description:
          'Konfiguruje właściwość „rows total” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'selected-rows',
        type: 'string[]',
        required: false,
        default: '[]',
        description:
          'Identyfikatory aktualnie zaznaczonych wierszy. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'sort-column',
        type: 'string',
        required: false,
        default: 'updatedAt',
        description:
          'Konfiguruje właściwość „sort column” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'sort-columns',
        type: 'TableSortState[]',
        required: false,
        default: '[]',
        description:
          'Konfiguruje właściwość „sort columns” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'sort-type',
        type: 'TableSortDirection',
        required: false,
        default: 'DESC',
        description:
          'Konfiguruje właściwość „sort type” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'button-editable-create-text',
        type: 'string',
        required: false,
        default: 'Dodaj',
        description:
          'Konfiguruje właściwość „button editable create text” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'title-remove-label',
        type: 'string',
        required: false,
        default: 'Czy na pewno chcesz usunąć wybrany rekord?',
        description:
          'Konfiguruje właściwość „title remove label” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'description-remove-label',
        type: 'string',
        required: false,
        default: 'Usunięcie spowoduje trwałe usunięcie rekordu.',
        description:
          'Konfiguruje właściwość „description remove label” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'is-loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Włącza stan ładowania i informuje o trwającej operacji. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'scroll',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „scroll” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [],
    events: [
      {
        name: 'on:action',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:action”.',
      },
      {
        name: 'on:createRecord',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:createRecord”.',
      },
      {
        name: 'on:dblclick',
        description:
          'Emitowane po dwukrotnym kliknięciu wiersza; przekazuje identyfikator i rekord.',
      },
      {
        name: 'on:dbclick',
        description: 'Przestarzała nazwa zdarzenia dwukrotnego kliknięcia. Użyj „on:dblclick”.',
      },
      {
        name: 'on:select:row',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:select:row”.',
      },
      {
        name: 'on:sort',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:sort”.',
      },
      {
        name: 'on:cancel',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:cancel”.',
      },
      {
        name: 'on:check:row',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:check:row”.',
      },
      {
        name: 'on:submit',
        description: 'Emitowane po zatwierdzeniu danych.',
      },
      {
        name: 'on:changeValue',
        description:
          'Emitowane po zmianie wartości komórki; przekazuje identyfikator rekordu i nową wartość.',
      },
    ],
    slots: [
      {
        name: '[`hint.${column.key}`]',
        description: 'Treść osadzana w nazwanym slocie „[`hint.${column.key}`]”.',
      },
      {
        name: 'details-record',
        description: 'Treść osadzana w nazwanym slocie „details-record”.',
      },
      {
        name: 'detials-record',
        description: 'Treść osadzana w nazwanym slocie „detials-record”.',
      },
      {
        name: 'additionalRow',
        description: 'Treść osadzana w nazwanym slocie „additionalRow”.',
      },
    ],
  },
  {
    category: 'data-display',
    categoryLabel: 'Prezentacja danych',
    name: 'TableListFooter',
    sourceName: 'TableListFooter',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/data-display/TableListFooter',
    tagName: 'peaui-table-list-footer',
    status: 'stable',
    props: [
      {
        name: 'rows-number',
        type: 'number',
        required: true,
        description:
          'Konfiguruje właściwość „rows number” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'rows-per-page',
        type: 'number',
        required: true,
        description:
          'Liczba rekordów wyświetlanych na jednej stronie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'page',
        type: 'number',
        required: true,
        description:
          'Numer aktualnie wybranej strony. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'total',
        type: 'number',
        required: true,
        description:
          'Łączna liczba elementów. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'under',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „under” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'is-flex',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „is flex” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [],
    events: [
      {
        name: 'on:change:page',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:change:page”.',
      },
      {
        name: 'on:change:limit',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:change:limit”.',
      },
    ],
    slots: [],
  },
  {
    category: 'data-display',
    categoryLabel: 'Prezentacja danych',
    name: 'TableListHeader',
    sourceName: 'TableListHeader',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/data-display/TableListHeader',
    tagName: 'peaui-table-list-header',
    status: 'stable',
    props: [
      {
        name: 'button-create-label',
        type: 'string',
        required: false,
        default: 'Dodaj rekord',
        description:
          'Konfiguruje właściwość „button create label” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'can-create',
        type: 'boolean',
        required: false,
        description:
          'Włącza możliwość dodawania nowych rekordów. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'can-export',
        type: 'boolean',
        required: false,
        description:
          'Konfiguruje właściwość „can export” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'can-filter',
        type: 'boolean',
        required: false,
        description:
          'Konfiguruje właściwość „can filter” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'can-search',
        type: 'boolean',
        required: false,
        description:
          'Konfiguruje właściwość „can search” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'count-filters',
        type: 'number',
        required: false,
        description:
          'Konfiguruje właściwość „count filters” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'count-selected-records',
        type: 'number',
        required: false,
        description:
          'Konfiguruje właściwość „count selected records” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'search-placeholder',
        type: 'string',
        required: false,
        description:
          'Konfiguruje właściwość „search placeholder” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'total-records',
        type: 'number',
        required: false,
        description:
          'Konfiguruje właściwość „total records” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'user-id',
        type: 'string',
        required: false,
        description:
          'Konfiguruje właściwość „user id” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'force-export',
        type: 'boolean',
        required: false,
        description:
          'Konfiguruje właściwość „force export” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'filters-open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wartość kontrolowana przez v-model:filters-open. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'on:search',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:search”.',
      },
      {
        name: 'on:reset-filters',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:reset-filters”.',
      },
      {
        name: 'on:create',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:create”.',
      },
      {
        name: 'on:export',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:export”.',
      },
      {
        name: 'update:filters-open',
        description:
          'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „filters-open”.',
      },
    ],
    slots: [
      {
        name: 'filters-drawer',
        description: 'Treść osadzana w nazwanym slocie „filters-drawer”.',
      },
      {
        name: 'additional-buttons',
        description: 'Treść osadzana w nazwanym slocie „additional-buttons”.',
      },
      {
        name: 'additional-content',
        description: 'Treść osadzana w nazwanym slocie „additional-content”.',
      },
      {
        name: 'addtional-content',
        description: 'Treść osadzana w nazwanym slocie „addtional-content”.',
      },
      {
        name: 'additional-description',
        description: 'Treść osadzana w nazwanym slocie „additional-description”.',
      },
      {
        name: 'addtional-description',
        description: 'Treść osadzana w nazwanym slocie „addtional-description”.',
      },
    ],
  },
  {
    category: 'data-display',
    categoryLabel: 'Prezentacja danych',
    name: 'TagChip',
    sourceName: 'TagChip',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/data-display/TagChip',
    tagName: 'peaui-tag-chip',
    status: 'stable',
    props: [
      {
        name: 'label',
        type: 'string',
        required: false,
        description: 'Widoczna etykieta opisująca element lub pole formularza.',
      },
      {
        name: 'size',
        type: 'TagChipSize',
        required: false,
        description: 'Wariant rozmiaru komponentu.',
      },
      {
        name: 'variant',
        type: 'TagChipVariant',
        required: false,
        description: 'Wariant wizualny komponentu.',
      },
      {
        name: 'active',
        type: 'boolean',
        required: false,
        description: 'Określa aktywny element albo aktywny krok.',
      },
      {
        name: 'as',
        type: 'TagChipAs',
        required: false,
        description: 'Atrybut HTML „as” konfigurujący komponent TagChip.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „data-testid” konfigurujący komponent TagChip.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
    ],
    models: [],
    events: [],
    slots: [],
  },
  {
    category: 'data-display',
    categoryLabel: 'Prezentacja danych',
    name: 'TreeList',
    sourceName: 'TreeList',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/data-display/TreeList',
    tagName: 'peaui-tree-list',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: false,
        description:
          'Unikalny identyfikator elementu w dokumencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'level',
        type: 'number',
        required: false,
        default: '1',
        description:
          'Konfiguruje właściwość „level” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'is-last',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „is last” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'can-remove',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „can remove” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'tree',
        type: 'TreeListType',
        required: false,
        default: "({ children: {}, label: '' })",
        description:
          'Dane drzewa kontrolowane przez v-model:tree. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'on:remove',
        description: 'Emitowane po wybraniu akcji usunięcia.',
      },
      {
        name: 'update:tree',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „tree”.',
      },
    ],
    slots: [
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
    ],
  },
  {
    category: 'data-display',
    categoryLabel: 'Prezentacja danych',
    name: 'VirtualList',
    sourceName: 'VirtualList',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/data-display/VirtualList',
    tagName: 'peaui-virtual-list',
    status: 'stable',
    props: [
      {
        name: 'items',
        type: 'readonly VirtualListItem[]',
        required: false,
        default: '[]',
        description:
          'Kolekcja danych. W DOM pozostaje wyłącznie widoczny zakres z overscanem. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'item-size',
        type: 'number',
        required: false,
        default: '64',
        description:
          'Stała wysokość pojedynczego elementu w pikselach. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'overscan',
        type: 'number',
        required: false,
        default: '4',
        description:
          'Liczba dodatkowych elementów renderowanych przed i za viewportem. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'height',
        type: 'number | string',
        required: false,
        default: '320',
        description:
          'Wysokość viewportu jako liczba pikseli albo poprawna wartość CSS. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'item-key',
        type: 'VirtualListItemKeyResolver',
        required: false,
        default: 'id',
        description:
          'Pole lub funkcja zwracająca stabilny klucz string/number. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'item-label',
        type: 'VirtualListItemLabelResolver',
        required: false,
        default: 'label',
        description:
          'Pole lub funkcja zwracająca domyślną widoczną etykietę. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'semantic-role',
        type: 'VirtualListRole',
        required: false,
        default: 'list',
        description:
          'Semantyka neutralnej listy albo interaktywnego listboxa. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: 'Lista wirtualna',
        description:
          'Dostępna nazwa viewportu i listboxa. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Pokazuje początkowy albo przyrostowy stan ładowania. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'has-more',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Informuje, że aplikacja może dołączyć kolejne elementy po zdarzeniu reachEnd. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        default: '',
        description:
          'Jawny komunikat błędu prezentowany zamiast pustego stanu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'empty-title',
        type: 'string',
        required: false,
        default: 'Brak elementów',
        description:
          'Tytuł domyślnego pustego stanu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'empty-description',
        type: 'string',
        required: false,
        default: 'Lista nie zawiera jeszcze żadnych elementów.',
        description:
          'Opis domyślnego pustego stanu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'end-label',
        type: 'string',
        required: false,
        default: 'Koniec listy',
        description:
          'Tekst wyświetlany po osiągnięciu kompletnego końca listy. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny selektor testowy elementu głównego. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'active-index',
        type: 'number | null',
        required: false,
        default: 'null',
        description:
          'Indeks aktywnego elementu kontrolowany przez v-model:activeIndex. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'visibleRangeChange',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „visibleRangeChange”.',
      },
      {
        name: 'reachEnd',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „reachEnd”.',
      },
      {
        name: 'scroll',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „scroll”.',
      },
      {
        name: 'itemFocus',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „itemFocus”.',
      },
      {
        name: 'measureError',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „measureError”.',
      },
      {
        name: 'update:activeIndex',
        description:
          'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „activeIndex”.',
      },
    ],
    slots: [
      {
        name: 'item',
        description: 'Treść osadzana w nazwanym slocie „item”.',
      },
      {
        name: 'empty',
        description: 'Treść osadzana w nazwanym slocie „empty”.',
      },
      {
        name: 'loading',
        description: 'Treść osadzana w nazwanym slocie „loading”.',
      },
      {
        name: 'before',
        description: 'Treść osadzana w nazwanym slocie „before”.',
      },
      {
        name: 'after',
        description: 'Treść osadzana w nazwanym slocie „after”.',
      },
      {
        name: 'footer',
        description: 'Treść osadzana w nazwanym slocie „footer”.',
      },
    ],
  },
  {
    category: 'data-entry',
    categoryLabel: 'Wprowadzanie danych',
    name: 'ButtonAction',
    sourceName: 'ButtonAction',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/data-entry/ButtonAction',
    tagName: 'peaui-button-action',
    status: 'stable',
    props: [
      {
        name: 'size',
        type: 'ButtonSize',
        required: false,
        description: 'Wariant rozmiaru komponentu.',
      },
      {
        name: 'variant',
        type: 'ButtonVariant',
        required: false,
        description: 'Wariant wizualny komponentu.',
      },
      {
        name: 'type',
        type: 'ButtonType',
        required: false,
        description: 'Wariant funkcjonalny lub wizualny komponentu.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „data-testid” konfigurujący komponent ButtonAction.',
      },
      {
        name: 'use-aria-label',
        type: 'boolean',
        required: false,
        description: 'Atrybut HTML „use-aria-label” konfigurujący komponent ButtonAction.',
      },
      {
        name: 'aria-label',
        type: 'string | null',
        required: false,
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
      {
        name: 'aria-labelledby',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „aria-labelledby” konfigurujący komponent ButtonAction.',
      },
      {
        name: 'class',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „class” konfigurujący komponent ButtonAction.',
      },
      {
        name: 'style',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „style” konfigurujący komponent ButtonAction.',
      },
      {
        name: 'id',
        type: 'string',
        required: false,
        description: 'Unikalny identyfikator elementu w dokumencie.',
      },
      {
        name: 'name',
        type: 'string',
        required: false,
        description: 'Nazwa pola używana przez formularz lub nazwa zasobu.',
      },
      {
        name: 'title',
        type: 'string',
        required: false,
        description: 'Główny tytuł prezentowany w komponencie.',
      },
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
    ],
  },
  {
    category: 'data-entry',
    categoryLabel: 'Wprowadzanie danych',
    name: 'ButtonExport',
    sourceName: 'ButtonExport',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/data-entry/ButtonExport',
    tagName: 'peaui-button-export',
    status: 'stable',
    props: [
      {
        name: 'size',
        type: "'xs' | 's' | 'm' | 'l'",
        required: false,
        default: 'm',
        description:
          'Wariant rozmiaru komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'ghost' | 'danger'",
        required: false,
        default: 'secondary',
        description:
          'Wariant wizualny komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'type',
        type: "'button' | 'submit' | 'reset'",
        required: false,
        description:
          'Wariant funkcjonalny lub wizualny komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'placement',
        type: "| 'top'\n  | 'right'\n  | 'bottom'\n  | 'left'\n  | 'top-left'\n  | 'top-right'\n  | 'bottom-left'\n  | 'bottom-right'",
        required: false,
        default: 'bottom',
        description:
          'Konfiguruje właściwość „placement” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'selected-items-count',
        type: 'number',
        required: false,
        default: '0',
        description:
          'Konfiguruje właściwość „selected items count” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'force-export',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „force export” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'use-aria-label',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „use aria label” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [],
    events: [
      {
        name: 'on:export',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:export”.',
      },
    ],
    slots: [
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
    ],
  },
  {
    category: 'data-entry',
    categoryLabel: 'Wprowadzanie danych',
    name: 'CopyButton',
    sourceName: 'CopyButton',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/data-entry/CopyButton',
    tagName: 'peaui-copy-button',
    status: 'stable',
    props: [
      {
        name: 'text',
        type: 'string',
        required: false,
        default: '',
        description:
          'Dokładna wartość tekstowa kopiowana, gdy getText nie został przekazany. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'get-text',
        type: '() => string | Promise<string>',
        required: false,
        description:
          'Pobiera wartość w chwili aktywacji; obsługuje również źródła asynchroniczne. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'reset-delay',
        type: 'number',
        required: false,
        default: '2000',
        description:
          'Czas powrotu ukończonej operacji do stanu początkowego; zero zachowuje stan. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        default: 'Kopiuj',
        description:
          'Stała dostępna nazwa akcji i domyślna widoczna etykieta. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'copied-label',
        type: 'string',
        required: false,
        default: 'Skopiowano',
        description:
          'Widoczny i ogłaszany komunikat powodzenia. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'error-label',
        type: 'string',
        required: false,
        default: 'Nie udało się skopiować',
        description:
          'Widoczny i ogłaszany komunikat błędu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'loading-label',
        type: 'string',
        required: false,
        default: 'Kopiowanie',
        description:
          'Widoczny tekst podczas trwającej operacji asynchronicznej. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'content',
        type: "'icon' | 'text' | 'icon-text'",
        required: false,
        default: 'icon-text',
        description:
          'Określa, czy przycisk wyświetla ikonę, tekst, czy oba elementy. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'ghost' | 'danger'",
        required: false,
        default: 'secondary',
        description:
          'Wariant wizualny zgodny z ButtonAction. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'size',
        type: "'xxs' | 'xs' | 's' | 'm' | 'l'",
        required: false,
        default: 'm',
        description:
          'Rozmiar zgodny ze skalą ButtonAction. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Stan zajętości kontrolowany z zewnątrz. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Blokuje aktywację. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'show-status',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyświetla komunikat stanu obok akcji zamiast wyłącznie dla czytnika ekranu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: '',
        description:
          'Opcjonalna stała dostępna nazwa zastępująca label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'type',
        type: "'button' | 'submit' | 'reset'",
        required: false,
        default: 'button',
        description:
          'Natywny typ przycisku. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stały identyfikator używany w testach automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [],
    events: [
      {
        name: 'copy',
        description: 'Emitowane po rozwiązaniu dokładnego tekstu i przed próbą zapisu do schowka.',
      },
      {
        name: 'success',
        description: 'Emitowane po poprawnym zakończeniu operacji komponentu.',
      },
      {
        name: 'error',
        description: 'Emitowane, gdy operacja komponentu kończy się błędem.',
      },
      {
        name: 'statusChange',
        description: 'Emitowane po każdej wewnętrznej zmianie statusu operacji.',
      },
    ],
    slots: [
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
      {
        name: 'icon',
        description: 'Treść osadzana w nazwanym slocie „icon”.',
      },
      {
        name: 'copied-icon',
        description: 'Treść osadzana w nazwanym slocie „copied-icon”.',
      },
      {
        name: 'status',
        description: 'Treść osadzana w nazwanym slocie „status”.',
      },
    ],
  },
  {
    category: 'data-entry',
    categoryLabel: 'Wprowadzanie danych',
    name: 'InlineEdit',
    sourceName: 'InlineEdit',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/data-entry/InlineEdit',
    tagName: 'peaui-inline-edit',
    status: 'stable',
    props: [
      {
        name: 'editor',
        type: 'InlineEditEditor',
        required: false,
        default: 'text',
        description:
          'Rodzaj wbudowanego edytora albo własna kontrolka ze slotu editor. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'editor-props',
        type: 'Record<string, unknown>',
        required: false,
        default: '{}',
        description:
          'Właściwości przekazywane do istniejącego komponentu formularza. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'activation',
        type: 'InlineEditActivation',
        required: false,
        default: 'button',
        description:
          'Dodatkowy sposób rozpoczęcia edycji; przycisk pozostaje zawsze dostępny. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'actions',
        type: 'InlineEditActions',
        required: false,
        default: 'both',
        description:
          'Widoczne przyciski, skróty klawiaturowe albo oba mechanizmy zapisu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'display',
        type: 'InlineEditDisplay',
        required: false,
        default: 'inline',
        description:
          'Układ dopasowany do tekstu lub zajmujący pełną szerokość. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'tab-behavior',
        type: 'InlineEditTabBehavior',
        required: false,
        default: 'commit',
        description:
          'Zachowanie klawisza Tab podczas edycji. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'save-mode',
        type: 'InlineEditSaveMode',
        required: false,
        default: 'sync',
        description:
          'Zapis lokalny albo asynchroniczny sterowany przez aplikację. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'validate',
        type: 'InlineEditValidate',
        required: false,
        description:
          'Synchroniczna walidacja szkicu przed zapisem. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Oczekiwanie na zewnętrzny zapis. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        description:
          'Błąd zwrócony przez zewnętrzny zapis. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Ustawia komponent w trybie tylko do odczytu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'empty-text',
        type: 'string',
        required: false,
        default: 'Brak wartości',
        description:
          'Konfiguruje właściwość „empty text” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'edit-aria-label',
        type: 'string',
        required: false,
        default: 'Edytuj wartość',
        description:
          'Konfiguruje właściwość „edit aria label” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'save-label',
        type: 'string',
        required: false,
        default: 'Zapisz',
        description:
          'Konfiguruje właściwość „save label” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'cancel-label',
        type: 'string',
        required: false,
        default: 'Anuluj',
        description:
          'Konfiguruje właściwość „cancel label” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'loading-label',
        type: 'string',
        required: false,
        default: 'Zapisywanie zmian',
        description:
          'Dostępny komunikat opisujący trwającą operację. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'InlineEditValue',
        required: true,
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'editing',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wartość kontrolowana przez v-model:editing. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'update:value',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”.',
      },
      {
        name: 'update:editing',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „editing”.',
      },
    ],
    slots: [
      {
        name: 'display',
        description: 'Treść osadzana w nazwanym slocie „display”.',
      },
      {
        name: 'empty',
        description: 'Treść osadzana w nazwanym slocie „empty”.',
      },
      {
        name: 'editor',
        description: 'Treść osadzana w nazwanym slocie „editor”.',
      },
      {
        name: 'error',
        description: 'Treść osadzana w nazwanym slocie „error”.',
      },
      {
        name: 'actions',
        description: 'Treść osadzana w nazwanym slocie „actions”.',
      },
    ],
  },
  {
    category: 'data-entry',
    categoryLabel: 'Wprowadzanie danych',
    name: 'InputSlider',
    sourceName: 'InputSlider',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/data-entry/InputSlider',
    tagName: 'peaui-input-slider',
    status: 'stable',
    props: [
      {
        name: 'name',
        type: 'string',
        required: true,
        description:
          'Nazwa pola używana przez formularz lub nazwa zasobu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'number',
        required: false,
        default: '0',
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'update:value',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”.',
      },
    ],
    slots: [],
  },
  {
    category: 'data-entry',
    categoryLabel: 'Wprowadzanie danych',
    name: 'SearchInput',
    sourceName: 'SearchInput',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/data-entry/SearchInput',
    tagName: 'peaui-search-input',
    status: 'stable',
    props: [
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: 'Pole wyszukiwania',
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: 'Wpisz czego szukasz',
        description:
          'Tekst pomocniczy widoczny przed wprowadzeniem wartości. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'debounce-time',
        type: 'number',
        required: false,
        default: '1000',
        description:
          'Konfiguruje właściwość „debounce time” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string | undefined',
        required: false,
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'on:search',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:search”.',
      },
      {
        name: 'on:remove',
        description: 'Emitowane po wybraniu akcji usunięcia.',
      },
      {
        name: 'update:value',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”.',
      },
    ],
    slots: [],
  },
  {
    category: 'data-entry',
    categoryLabel: 'Wprowadzanie danych',
    name: 'SegmentedControl',
    sourceName: 'SegmentedControl',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/data-entry/SegmentedControl',
    tagName: 'peaui-segmented-control',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: false,
        description:
          'Identyfikator grupy radio. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'name',
        type: 'string',
        required: false,
        default: '',
        description:
          'Nazwa ukrytego pola wysyłanego z formularzem. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'items',
        type: 'SegmentedControlItem[]',
        required: false,
        default: '[]',
        description:
          'Niewielki zestaw wzajemnie wykluczających się pozycji. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'size',
        type: "'s' | 'm' | 'l'",
        required: false,
        default: 'm',
        description:
          'Rozmiar wszystkich segmentów. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'distribution',
        type: "'equal' | 'auto'",
        required: false,
        default: 'equal',
        description:
          'Równy albo naturalny rozkład szerokości segmentów. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'full-width',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Rozciąga kontrolkę do szerokości kontenera. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'content',
        type: "'text' | 'icon' | 'icon-text'",
        required: false,
        default: 'text',
        description:
          'Prezentuje tekst, ikonę albo oba elementy. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza całą kontrolkę i usuwa ją z kolejności tabulatora. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        required: false,
        default: 'horizontal',
        description:
          'Kierunek układu oraz nawigacji klawiaturą. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'activation',
        type: "'automatic' | 'manual'",
        required: false,
        default: 'automatic',
        description:
          'Określa, czy nawigacja od razu wybiera segment, czy tylko przenosi fokus. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'loop',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Zapętla nawigację pomiędzy skrajnymi dostępnymi segmentami. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: 'Wybór opcji',
        description:
          'Dostępna nazwa grupy radio. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        default: '',
        description:
          'Stabilny selektor do testów integracyjnych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'SegmentedControlValue | null',
        required: false,
        default: 'null',
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'change',
        description: 'Emitowane po zmianie wartości przez użytkownika.',
      },
      {
        name: 'focusChange',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „focusChange”.',
      },
      {
        name: 'update:value',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”.',
      },
    ],
    slots: [
      {
        name: 'item',
        description: 'Treść osadzana w nazwanym slocie „item”.',
      },
      {
        name: 'item-icon',
        description: 'Treść osadzana w nazwanym slocie „item-icon”.',
      },
      {
        name: 'indicator',
        description: 'Treść osadzana w nazwanym slocie „indicator”.',
      },
    ],
  },
  {
    category: 'data-entry',
    categoryLabel: 'Wprowadzanie danych',
    name: 'SelectableCard',
    sourceName: 'SelectableCard',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/data-entry/SelectableCard',
    tagName: 'peaui-selectable-card',
    status: 'stable',
    props: [
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Ustawia komponent w trybie tylko do odczytu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'active',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Określa aktywny element albo aktywny krok. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'title',
        description: 'Treść osadzana w nazwanym slocie „title”.',
      },
      {
        name: 'description',
        description: 'Treść osadzana w nazwanym slocie „description”.',
      },
      {
        name: 'additional',
        description: 'Treść osadzana w nazwanym slocie „additional”.',
      },
      {
        name: 'hint',
        description: 'Treść osadzana w nazwanym slocie „hint”.',
      },
    ],
  },
  {
    category: 'data-entry',
    categoryLabel: 'Wprowadzanie danych',
    name: 'SplitButton',
    sourceName: 'SplitButton',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/data-entry/SplitButton',
    tagName: 'peaui-split-button',
    status: 'stable',
    props: [
      {
        name: 'label',
        type: 'string',
        required: true,
        description:
          'Widoczna etykieta oraz awaryjna dostępna nazwa głównej akcji. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'items',
        type: 'DropdownMenuItem[]',
        required: false,
        default: '[]',
        description:
          'Akcje alternatywne renderowane przez DropdownMenu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'icon',
        type: 'string',
        required: false,
        description:
          'Opcjonalna nazwa ikony PeaUI poprzedzającej etykietę. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'danger'",
        required: false,
        default: 'primary',
        description:
          'Wariant kolorystyczny obu części kontrolki. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'size',
        type: "'xxs' | 'xs' | 's' | 'm' | 'l'",
        required: false,
        default: 'm',
        description:
          'Rozmiar zgodny z ButtonAction. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'type',
        type: "'button' | 'submit' | 'reset'",
        required: false,
        default: 'button',
        description:
          'Natywny typ przycisku głównej akcji. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'menu-align',
        type: "'start' | 'end'",
        required: false,
        default: 'end',
        description:
          'Wyrównanie powierzchni menu do początku lub końca kontrolki. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza obie części kontrolki. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'primary-disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza wyłącznie główną akcję. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'menu-disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza wyłącznie trigger menu i zamyka otwarte menu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Blokuje główną akcję i pokazuje jej stan zajętości; menu pozostaje niezależne. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'menu-loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Pokazuje dostępny stan ładowania wewnątrz otwartego menu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa grupy dwóch przycisków. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'menu-aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa przycisku otwierającego menu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'loading-label',
        type: 'string',
        required: false,
        default: 'Trwa wykonywanie głównej akcji',
        description:
          'Tekst statusu głównej akcji przekazywany technologiom asystującym. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'menu-loading-label',
        type: 'string',
        required: false,
        default: 'Ładowanie menu…',
        description:
          'Tekst dostępnego stanu ładowania menu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'empty-label',
        type: 'string',
        required: false,
        default: 'Brak dostępnych akcji',
        description:
          'Tekst pustego stanu menu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator używany w testach automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Stan otwarcia kontrolowany przez v-model:open. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'primaryClick',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „primaryClick”.',
      },
      {
        name: 'select',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „select”.',
      },
      {
        name: 'update:open',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „open”.',
      },
    ],
    slots: [
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
      {
        name: 'label',
        description: 'Treść osadzana w nazwanym slocie „label”.',
      },
      {
        name: 'icon',
        description: 'Treść osadzana w nazwanym slocie „icon”.',
      },
      {
        name: 'menu-trigger-icon',
        description: 'Treść osadzana w nazwanym slocie „menu-trigger-icon”.',
      },
      {
        name: 'menu-item',
        description: 'Treść osadzana w nazwanym slocie „menu-item”.',
      },
      {
        name: 'menu-item-icon',
        description: 'Treść osadzana w nazwanym slocie „menu-item-icon”.',
      },
      {
        name: 'menu-item-shortcut',
        description: 'Treść osadzana w nazwanym slocie „menu-item-shortcut”.',
      },
      {
        name: 'group-label',
        description: 'Treść osadzana w nazwanym slocie „group-label”.',
      },
      {
        name: 'empty',
        description: 'Treść osadzana w nazwanym slocie „empty”.',
      },
      {
        name: 'menu-loading',
        description: 'Treść osadzana w nazwanym slocie „menu-loading”.',
      },
    ],
  },
  {
    category: 'data-entry',
    categoryLabel: 'Wprowadzanie danych',
    name: 'ToggleButton',
    sourceName: 'ToggleButton',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/data-entry/ToggleButton',
    tagName: 'peaui-toggle-button',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: false,
        description:
          'Identyfikator natywnego przycisku. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        default: 'Przełącz',
        description:
          'Stała etykieta widoczna w stanie nieaktywnym i używana jako dostępna nazwa. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'pressed-label',
        type: 'string',
        required: false,
        default: '',
        description:
          'Opcjonalna etykieta widoczna po włączeniu; nie zmienia dostępnej nazwy. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'icon',
        type: 'string',
        required: false,
        default: '',
        description:
          'Nazwa dekoracyjnej ikony SvgIcon. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'pressed-icon',
        type: 'string',
        required: false,
        default: '',
        description:
          'Opcjonalna ikona dekoracyjna widoczna po włączeniu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'content',
        type: "'text' | 'icon' | 'icon-text'",
        required: false,
        default: 'icon-text',
        description:
          'Określa, czy przycisk pokazuje tekst, ikonę czy oba elementy. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'variant',
        type: "'default' | 'outline' | 'ghost'",
        required: false,
        default: 'default',
        description:
          'Wariant wizualny powierzchni. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'size',
        type: "'xxs' | 'xs' | 's' | 'm' | 'l'",
        required: false,
        default: 'm',
        description:
          'Rozmiar zgodny ze skalą ButtonAction; cel dotykowy zachowuje minimum 44 px. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'type',
        type: "'button' | 'submit' | 'reset'",
        required: false,
        default: 'button',
        description:
          'Typ natywnego przycisku. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'allow-wrap',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Pozwala jawnie zawijać długi tekst zamiast utrzymywać go w jednym wierszu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza kontrolkę i usuwa ją z kolejności fokusu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Blokuje zmianę, ale pozostawia kontrolkę w kolejności fokusu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Blokuje zmianę i eksponuje stan zajętości. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: '',
        description:
          'Stała dostępna nazwa, wymagana dla przycisku wyłącznie ikonowego bez label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'loading-label',
        type: 'string',
        required: false,
        default: 'Trwa aktualizowanie ustawienia',
        description:
          'Dostępny komunikat stanu ładowania. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator używany w testach automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'change',
        description: 'Emitowane po zmianie wartości przez użytkownika.',
      },
      {
        name: 'click',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „click”.',
      },
      {
        name: 'update:value',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”.',
      },
    ],
    slots: [
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
      {
        name: 'icon',
        description: 'Treść osadzana w nazwanym slocie „icon”.',
      },
      {
        name: 'pressed-icon',
        description: 'Treść osadzana w nazwanym slocie „pressed-icon”.',
      },
    ],
  },
  {
    category: 'data-entry',
    categoryLabel: 'Wprowadzanie danych',
    name: 'ToggleGroup',
    sourceName: 'ToggleGroup',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/data-entry/ToggleGroup',
    tagName: 'peaui-toggle-group',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: false,
        description:
          'Identyfikator grupy i powiązanych opisów. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'name',
        type: 'string',
        required: false,
        default: '',
        description:
          'Nazwa ukrytych pól przekazywanych z formularzem. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'items',
        type: 'ToggleGroupItem[]',
        required: false,
        default: '[]',
        description:
          'Pozycje zarządzane przez komponent. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'type',
        type: "'single' | 'multiple'",
        required: false,
        default: 'single',
        description:
          'Tryb pojedynczego albo wielokrotnego wyboru. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        required: false,
        default: 'horizontal',
        description:
          'Kierunek układu i nawigacji klawiaturą. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'appearance',
        type: "'separate' | 'attached'",
        required: false,
        default: 'separate',
        description:
          'Oddzielny albo połączony wygląd przycisków. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'semantic-role',
        type: "'toolbar' | 'group'",
        required: false,
        default: 'toolbar',
        description:
          'Semantyka dostępności grupy. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'overflow',
        type: "'wrap' | 'scroll'",
        required: false,
        default: 'wrap',
        description:
          'Zachowanie grupy przy braku miejsca. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wymaga co najmniej jednej wybranej pozycji. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'allow-empty',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Pozwala wyłączyć ostatnią aktywną pozycję, gdy grupa nie jest wymagana. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'loop',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Zapętla nawigację strzałkami pomiędzy skrajnymi pozycjami. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza całą grupę i usuwa ją z kolejności tabulatora. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Blokuje zmianę wartości, zachowując możliwość odczytu i fokusu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        default: '',
        description:
          'Widoczna etykieta grupy. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        default: '',
        description:
          'Zewnętrzny komunikat błędu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'required-message',
        type: 'string',
        required: false,
        default: 'Wybierz co najmniej jedną opcję.',
        description:
          'Komunikat używany dla pustej wymaganej grupy. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: '',
        description:
          'Dostępna nazwa, gdy widoczna etykieta nie jest potrzebna. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'size',
        type: "'xxs' | 'xs' | 's' | 'm' | 'l'",
        required: false,
        default: 'm',
        description:
          'Rozmiar wszystkich przycisków. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'variant',
        type: "'default' | 'outline' | 'ghost'",
        required: false,
        default: 'outline',
        description:
          'Wariant wizualny wszystkich przycisków. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        default: '',
        description:
          'Stabilny selektor do testów integracyjnych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'ToggleGroupModelValue',
        required: false,
        default: 'null',
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'change',
        description: 'Emitowane po zmianie wartości przez użytkownika.',
      },
      {
        name: 'focusChange',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „focusChange”.',
      },
      {
        name: 'update:value',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”.',
      },
    ],
    slots: [
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
      {
        name: 'item',
        description: 'Treść osadzana w nazwanym slocie „item”.',
      },
      {
        name: 'label',
        description: 'Treść osadzana w nazwanym slocie „label”.',
      },
      {
        name: 'error',
        description: 'Treść osadzana w nazwanym slocie „error”.',
      },
    ],
  },
  {
    category: 'data-entry',
    categoryLabel: 'Wprowadzanie danych',
    name: 'TransferList',
    sourceName: 'TransferList',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/data-entry/TransferList',
    tagName: 'peaui-transfer-list',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator komponentu i jego relacji ARIA. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'items',
        type: 'readonly TransferListItem[]',
        required: false,
        default: '[]',
        description:
          'Pełny katalog elementów. Pierwszy element o danym kluczu wygrywa. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'item-key',
        type: 'TransferListKeyResolver',
        required: false,
        default: 'key',
        description:
          'Pole lub funkcja zwracająca stabilny klucz string/number. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'item-label',
        type: 'TransferListLabelResolver',
        required: false,
        default: 'label',
        description:
          'Pole lub funkcja zwracająca widoczną etykietę. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'searchable',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Pokazuje niezależny filtr w obu panelach. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'sort',
        type: 'TransferListSort',
        required: false,
        default: 'false',
        description:
          'Sortowanie widoku; false zachowuje kolejność źródłową. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'preserve-order',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Zachowuje kolejność tablicy value w panelu docelowym. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled-keys',
        type: 'readonly TransferListKey[]',
        required: false,
        default: '[]',
        description:
          'Klucze blokowane niezależnie od pola disabled elementu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'loading',
        type: 'boolean | TransferListLoadingState',
        required: false,
        default: 'false',
        description:
          'Stan ładowania całego komponentu albo wybranego panelu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'labels',
        type: 'Partial<TransferListLabels>',
        required: false,
        default: '({})',
        description:
          'Lokalizowane teksty interfejsu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza wszystkie operacje i usuwa listy z kolejności Tab. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'orientation',
        type: 'TransferListOrientation',
        required: false,
        default: 'horizontal',
        description:
          'Preferowany układ; horizontal automatycznie składa się na mobile. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'size',
        type: 'TransferListSize',
        required: false,
        default: 'standard',
        description:
          'Standardowa lub kompaktowa gęstość wierszy. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'locale',
        type: 'string',
        required: false,
        default: 'pl-PL',
        description:
          'Locale filtrowania i sortowania. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: 'Przenoszenie elementów między listami',
        description:
          'Dostępna nazwa całego przepływu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        default: '',
        description:
          'Opcjonalny błąd wspólny dla obu list. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny selektor testowy. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'TransferListKey[]',
        required: false,
        default: '[]',
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'source-selected',
        type: 'TransferListKey[]',
        required: false,
        default: '[]',
        description:
          'Wartość kontrolowana przez v-model:sourceSelected. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'target-selected',
        type: 'TransferListKey[]',
        required: false,
        default: '[]',
        description:
          'Wartość kontrolowana przez v-model:targetSelected. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'move',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „move”.',
      },
      {
        name: 'search',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „search”.',
      },
      {
        name: 'selectionChange',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „selectionChange”.',
      },
      {
        name: 'update:value',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”.',
      },
      {
        name: 'update:sourceSelected',
        description:
          'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „sourceSelected”.',
      },
      {
        name: 'update:targetSelected',
        description:
          'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „targetSelected”.',
      },
    ],
    slots: [
      {
        name: 'source-header',
        description: 'Treść osadzana w nazwanym slocie „source-header”.',
      },
      {
        name: 'target-header',
        description: 'Treść osadzana w nazwanym slocie „target-header”.',
      },
      {
        name: 'item',
        description: 'Treść osadzana w nazwanym slocie „item”.',
      },
      {
        name: 'source-empty',
        description: 'Treść osadzana w nazwanym slocie „source-empty”.',
      },
      {
        name: 'target-empty',
        description: 'Treść osadzana w nazwanym slocie „target-empty”.',
      },
      {
        name: 'controls',
        description: 'Treść osadzana w nazwanym slocie „controls”.',
      },
      {
        name: 'loading',
        description: 'Treść osadzana w nazwanym slocie „loading”.',
      },
    ],
  },
  {
    category: 'feedback',
    categoryLabel: 'Informacje zwrotne',
    name: 'EmptyState',
    sourceName: 'EmptyState',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/feedback/EmptyState',
    tagName: 'peaui-empty-state',
    status: 'stable',
    props: [
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'title',
        type: 'string',
        required: false,
        description:
          'Główny tytuł prezentowany w komponencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        description:
          'Dodatkowy opis objaśniający zawartość albo stan komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'additional',
        description: 'Treść osadzana w nazwanym slocie „additional”.',
      },
    ],
  },
  {
    category: 'feedback',
    categoryLabel: 'Informacje zwrotne',
    name: 'MessageText',
    sourceName: 'MessageText',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/feedback/MessageText',
    tagName: 'peaui-message-text',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: false,
        description: 'Unikalny identyfikator elementu w dokumencie.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „data-testid” konfigurujący komponent MessageText.',
      },
      {
        name: 'variant',
        type: 'MessageTextVariant',
        required: false,
        description: 'Wariant wizualny komponentu.',
      },
      {
        name: 'size',
        type: 'MessageTextSize',
        required: false,
        description: 'Wariant rozmiaru komponentu.',
      },
      {
        name: 'with-icon',
        type: 'boolean',
        required: false,
        description: 'Atrybut HTML „with-icon” konfigurujący komponent MessageText.',
      },
      {
        name: 'own-icon',
        type: 'string | undefined',
        required: false,
        description: 'Atrybut HTML „own-icon” konfigurujący komponent MessageText.',
      },
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
    ],
  },
  {
    category: 'feedback',
    categoryLabel: 'Informacje zwrotne',
    name: 'ProgressIndicator',
    sourceName: 'ProgressIndicator',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/feedback/ProgressIndicator',
    tagName: 'peaui-progress-indicator',
    status: 'stable',
    props: [
      {
        name: 'steps',
        type: 'number',
        required: true,
        description:
          'Konfiguruje właściwość „steps” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'active',
        type: 'number',
        required: false,
        description:
          'Określa aktywny element albo aktywny krok. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'size',
        type: 'number',
        required: false,
        description:
          'Wariant rozmiaru komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'stroke-width',
        type: 'number',
        required: false,
        description:
          'Konfiguruje właściwość „stroke width” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'remove-active',
        type: 'boolean',
        required: false,
        description:
          'Konfiguruje właściwość „remove active” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [],
    events: [],
    slots: [],
  },
  {
    category: 'feedback',
    categoryLabel: 'Informacje zwrotne',
    name: 'SkeletonLoading',
    sourceName: 'SkeletonLoading',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/feedback/SkeletonLoading',
    tagName: 'peaui-skeleton-loading',
    status: 'stable',
    props: [
      {
        name: 'size',
        type: "'xs' | 's' | 'm' | 'l'",
        required: false,
        default: 'm',
        description:
          'Wariant rozmiaru komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'rounded',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „rounded” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: 'Trwa ladowanie tresci.',
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [],
    events: [],
    slots: [],
  },
  {
    category: 'feedback',
    categoryLabel: 'Informacje zwrotne',
    name: 'SpinnerLoader',
    sourceName: 'SpinnerLoader',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/feedback/SpinnerLoader',
    tagName: 'peaui-spinner-loader',
    status: 'stable',
    props: [
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [],
    events: [],
    slots: [],
  },
  {
    category: 'feedback',
    categoryLabel: 'Informacje zwrotne',
    name: 'ToastAlert',
    sourceName: 'ToastAlert',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/feedback/ToastAlert',
    tagName: 'peaui-toast-alert',
    status: 'stable',
    props: [
      {
        name: 'variant',
        type: 'ToastAlertVariant',
        required: false,
        description: 'Wariant wizualny komponentu.',
      },
      {
        name: 'title',
        type: 'string',
        required: false,
        description: 'Główny tytuł prezentowany w komponencie.',
      },
      {
        name: 'description',
        type: 'string | undefined',
        required: false,
        description: 'Dodatkowy opis objaśniający zawartość albo stan komponentu.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „data-testid” konfigurujący komponent ToastAlert.',
      },
      {
        name: 'size',
        type: 'ToastAlertSize',
        required: false,
        description: 'Wariant rozmiaru komponentu.',
      },
      {
        name: 'with-shadow',
        type: 'boolean',
        required: false,
        description: 'Atrybut HTML „with-shadow” konfigurujący komponent ToastAlert.',
      },
      {
        name: 'with-border',
        type: 'boolean',
        required: false,
        description: 'Atrybut HTML „with-border” konfigurujący komponent ToastAlert.',
      },
      {
        name: 'can-close',
        type: 'boolean',
        required: false,
        description: 'Atrybut HTML „can-close” konfigurujący komponent ToastAlert.',
      },
    ],
    models: [],
    events: [
      {
        name: 'on:close',
        description: 'Emitowane podczas zamykania komponentu.',
      },
    ],
    slots: [],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormButtonCheckbox',
    sourceName: 'FormButtonCheckbox',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/form/FormButtonCheckbox',
    tagName: 'peaui-form-button-checkbox',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description:
          'Unikalny identyfikator elementu w dokumencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description:
          'Nazwa pola używana przez formularz lub nazwa zasobu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'is-valid',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „is valid” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description:
          'Oznacza wartość jako wymaganą. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description:
          'Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'size',
        type: "'xxs' | 'xs' | 's' | 'm' | 'l'",
        required: false,
        default: 'm',
        description:
          'Wariant rozmiaru komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'boolean | undefined',
        required: true,
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'update:value',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”.',
      },
    ],
    slots: [
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormButtonGroup',
    sourceName: 'FormButtonGroup',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/form/FormButtonGroup',
    tagName: 'peaui-form-button-group',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: false,
        default: 'form-button-group',
        description:
          'Unikalny identyfikator elementu w dokumencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'name',
        type: 'string',
        required: false,
        default: 'formButtonGroup',
        description:
          'Nazwa pola używana przez formularz lub nazwa zasobu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description:
          'Widoczna etykieta opisująca element lub pole formularza. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'size',
        type: "'xs' | 's' | 'm' | 'l'",
        required: false,
        default: 'm',
        description:
          'Wariant rozmiaru komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'is-toggle',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „is toggle” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description:
          'Oznacza wartość jako wymaganą. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description:
          'Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description:
          'Ustawia komponent w trybie tylko do odczytu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'options',
        type: 'ButtonGroupOption[]',
        required: false,
        default: '[]',
        description:
          'Lista opcji dostępnych do wyświetlenia lub wyboru. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string | number | undefined',
        required: false,
        default: 'undefined',
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'update:value',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”.',
      },
    ],
    slots: [
      {
        name: 'hint',
        description: 'Treść osadzana w nazwanym slocie „hint”.',
      },
      {
        name: 'additionalHint',
        description: 'Treść osadzana w nazwanym slocie „additionalHint”.',
      },
      {
        name: 'description',
        description: 'Treść osadzana w nazwanym slocie „description”.',
      },
      {
        name: 'error',
        description: 'Treść osadzana w nazwanym slocie „error”.',
      },
      {
        name: 'success',
        description: 'Treść osadzana w nazwanym slocie „success”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormCheckbox',
    sourceName: 'FormCheckbox',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/form/FormCheckbox',
    tagName: 'peaui-form-checkbox',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description:
          'Unikalny identyfikator elementu w dokumencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description:
          'Nazwa pola używana przez formularz lub nazwa zasobu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'is-valid',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „is valid” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description:
          'Oznacza wartość jako wymaganą. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description:
          'Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'boolean | undefined',
        required: true,
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'update:value',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”.',
      },
    ],
    slots: [
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormColorPicker',
    sourceName: 'FormColorPicker',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/form/FormColorPicker',
    tagName: 'peaui-form-color-picker',
    status: 'stable',
    props: [
      {
        name: 'alpha',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „alpha” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'can-erase',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Pokazuje akcję pozwalającą wyczyścić bieżącą wartość. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'density',
        type: 'FormColorPickerDensity',
        required: false,
        default: 'full',
        description:
          'Konfiguruje właściwość „density” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        description:
          'Dodatkowy opis objaśniający zawartość albo stan komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description:
          'Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        description:
          'Komunikat błędu powiązany z polem lub operacją. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'format',
        type: 'FormColorPickerFormat',
        required: false,
        default: 'hex',
        description:
          'Konfiguruje właściwość „format” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'id',
        type: 'string',
        required: true,
        description:
          'Unikalny identyfikator elementu w dokumencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description:
          'Widoczna etykieta opisująca element lub pole formularza. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wybiera natywną strategię ładowania obrazu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'loading-label',
        type: 'string',
        required: false,
        default: 'Ładowanie wyboru koloru',
        description:
          'Dostępny komunikat opisujący trwającą operację. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description:
          'Nazwa pola używana przez formularz lub nazwa zasobu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'panel-aria-label',
        type: 'string',
        required: false,
        default: 'Wybierz kolor',
        description:
          'Konfiguruje właściwość „panel aria label” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'placement',
        type: 'FormColorPickerPlacement',
        required: false,
        default: 'bottom',
        description:
          'Konfiguruje właściwość „placement” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: '',
        description:
          'Tekst pomocniczy widoczny przed wprowadzeniem wartości. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description:
          'Ustawia komponent w trybie tylko do odczytu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'recent-colors',
        type: 'ReadonlyArray<string | FormColorPickerSwatch>',
        required: false,
        default: '[]',
        description:
          'Konfiguruje właściwość „recent colors” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description:
          'Oznacza wartość jako wymaganą. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'saved-colors',
        type: 'ReadonlyArray<string | FormColorPickerSwatch>',
        required: false,
        default: '[]',
        description:
          'Konfiguruje właściwość „saved colors” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'show-eyedropper',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „show eyedropper” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'variant',
        type: 'FormColorPickerVariant',
        required: false,
        default: 'popover',
        description:
          'Wariant wizualny komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string',
        required: false,
        default: '#4C9A2A',
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Stan otwarcia kontrolowany przez v-model:open. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'change',
        description: 'Emitowane po zmianie wartości przez użytkownika.',
      },
      {
        name: 'close',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „close”.',
      },
      {
        name: 'commit',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „commit”.',
      },
      {
        name: 'eyedropperError',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „eyedropperError”.',
      },
      {
        name: 'eyedropperStart',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „eyedropperStart”.',
      },
      {
        name: 'invalid',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „invalid”.',
      },
      {
        name: 'open',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „open”.',
      },
      {
        name: 'update:value',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”.',
      },
      {
        name: 'update:open',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „open”.',
      },
    ],
    slots: [
      {
        name: 'description',
        description: 'Treść osadzana w nazwanym slocie „description”.',
      },
      {
        name: 'error',
        description: 'Treść osadzana w nazwanym slocie „error”.',
      },
      {
        name: 'footer',
        description: 'Treść osadzana w nazwanym slocie „footer”.',
      },
      {
        name: 'hint',
        description: 'Treść osadzana w nazwanym slocie „hint”.',
      },
      {
        name: 'recent-color',
        description: 'Treść osadzana w nazwanym slocie „recent-color”.',
      },
      {
        name: 'saved-color',
        description: 'Treść osadzana w nazwanym slocie „saved-color”.',
      },
      {
        name: 'swatch',
        description: 'Treść osadzana w nazwanym slocie „swatch”.',
      },
      {
        name: 'trigger',
        description: 'Treść osadzana w nazwanym slocie „trigger”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormContainer',
    sourceName: 'FormContainer',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/form/FormContainer',
    tagName: 'peaui-form-container',
    status: 'stable',
    props: [
      {
        name: 'label',
        type: 'string',
        required: true,
        description:
          'Widoczna etykieta opisująca element lub pole formularza. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'submit-button-label',
        type: 'string',
        required: false,
        default: 'Zapisz',
        description:
          'Konfiguruje właściwość „submit button label” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'is-loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Włącza stan ładowania i informuje o trwającej operacji. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'show-actions',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „show actions” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description:
          'Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'cancel-button-label',
        type: 'string',
        required: false,
        default: 'Anuluj',
        description:
          'Konfiguruje właściwość „cancel button label” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'actions-position',
        type: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
        required: false,
        default: 'bottom-left',
        description:
          'Konfiguruje właściwość „actions position” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'show-cancel-button',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „show cancel button” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'size-button',
        type: "'xxs' | 'xs' | 's' | 'm' | 'l'",
        required: false,
        default: 'xs',
        description:
          'Konfiguruje właściwość „size button” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'use-aria-labelledby',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „use aria labelledby” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [],
    events: [
      {
        name: 'on:cancel',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:cancel”.',
      },
      {
        name: 'on:submit',
        description: 'Emitowane po zatwierdzeniu danych.',
      },
    ],
    slots: [
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
      {
        name: 'additional-before',
        description: 'Treść osadzana w nazwanym slocie „additional-before”.',
      },
      {
        name: 'additional-after',
        description: 'Treść osadzana w nazwanym slocie „additional-after”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormDatePicker',
    sourceName: 'FormDatePicker',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/form/FormDatePicker',
    tagName: 'peaui-form-date-picker',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description:
          'Unikalny identyfikator elementu w dokumencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'can-erase',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Pokazuje akcję pozwalającą wyczyścić bieżącą wartość. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'after',
        type: 'string',
        required: false,
        description:
          'Treść wyświetlana za właściwą wartością pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'before',
        type: 'string',
        required: false,
        description:
          'Treść wyświetlana przed właściwą wartością pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description:
          'Nazwa pola używana przez formularz lub nazwa zasobu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description:
          'Widoczna etykieta opisująca element lub pole formularza. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'icon-before',
        type: 'string',
        required: false,
        description:
          'Nazwa ikony wyświetlanej przed treścią pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description:
          'Oznacza wartość jako wymaganą. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: 'wybierz date',
        description:
          'Tekst pomocniczy widoczny przed wprowadzeniem wartości. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'range',
        type: 'boolean',
        required: false,
        description:
          'Konfiguruje właściwość „range” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'min-date',
        type: 'string',
        required: false,
        description:
          'Konfiguruje właściwość „min date” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'max-date',
        type: 'string',
        required: false,
        description:
          'Konfiguruje właściwość „max date” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'min',
        type: 'string',
        required: false,
        description:
          'Minimalna dozwolona wartość. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'max',
        type: 'string',
        required: false,
        description:
          'Maksymalna dozwolona wartość albo szerokość. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description:
          'Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description:
          'Ustawia komponent w trybie tylko do odczytu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string | DatePickerRangeValue | undefined',
        required: true,
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'on:remove',
        description: 'Emitowane po wybraniu akcji usunięcia.',
      },
      {
        name: 'update:value',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”.',
      },
    ],
    slots: [
      {
        name: 'hint',
        description: 'Treść osadzana w nazwanym slocie „hint”.',
      },
      {
        name: 'description',
        description: 'Treść osadzana w nazwanym slocie „description”.',
      },
      {
        name: 'error',
        description: 'Treść osadzana w nazwanym slocie „error”.',
      },
      {
        name: 'success',
        description: 'Treść osadzana w nazwanym slocie „success”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormDateRangePicker',
    sourceName: 'FormDateRangePicker',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/form/FormDateRangePicker',
    tagName: 'peaui-form-date-range-picker',
    status: 'stable',
    props: [
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'calendars',
        type: 'FormDateRangePickerCalendars',
        required: false,
        default: '2',
        description:
          'Konfiguruje właściwość „calendars” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'can-erase',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Pokazuje akcję pozwalającą wyczyścić bieżącą wartość. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'confirm',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „confirm” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'date-format',
        type: 'FormDateRangePickerDateFormat',
        required: false,
        default: 'locale',
        description:
          'Konfiguruje właściwość „date format” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        description:
          'Dodatkowy opis objaśniający zawartość albo stan komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description:
          'Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'end-label',
        type: 'string',
        required: false,
        default: 'Data końcowa',
        description:
          'Konfiguruje właściwość „end label” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'end-placeholder',
        type: 'string',
        required: false,
        default: '',
        description:
          'Konfiguruje właściwość „end placeholder” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        description:
          'Komunikat błędu powiązany z polem lub operacją. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'format',
        type: 'DateRangeFormatter',
        required: false,
        description:
          'Konfiguruje właściwość „format” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'id',
        type: 'string',
        required: true,
        description:
          'Unikalny identyfikator elementu w dokumencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'is-date-disabled',
        type: '(date: string) => boolean',
        required: false,
        description:
          'Konfiguruje właściwość „is date disabled” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description:
          'Widoczna etykieta opisująca element lub pole formularza. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wybiera natywną strategię ładowania obrazu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'loading-label',
        type: 'string',
        required: false,
        default: 'Ładowanie wyboru zakresu dat',
        description:
          'Dostępny komunikat opisujący trwającą operację. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'locale',
        type: 'string',
        required: false,
        default: 'pl-PL',
        description:
          'Konfiguruje właściwość „locale” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'max-date',
        type: 'string',
        required: false,
        description:
          'Konfiguruje właściwość „max date” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'min-date',
        type: 'string',
        required: false,
        description:
          'Konfiguruje właściwość „min date” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description:
          'Nazwa pola używana przez formularz lub nazwa zasobu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'panel-aria-label',
        type: 'string',
        required: false,
        default: 'Wybierz zakres dat',
        description:
          'Konfiguruje właściwość „panel aria label” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'parse',
        type: 'DateRangeParser',
        required: false,
        description:
          'Konfiguruje właściwość „parse” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'placement',
        type: 'FormDateRangePickerPlacement',
        required: false,
        default: 'bottom',
        description:
          'Konfiguruje właściwość „placement” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: '',
        description:
          'Tekst pomocniczy widoczny przed wprowadzeniem wartości. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'presets',
        type: 'DateRangePreset[]',
        required: false,
        default: '[]',
        description:
          'Konfiguruje właściwość „presets” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description:
          'Ustawia komponent w trybie tylko do odczytu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description:
          'Oznacza wartość jako wymaganą. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'selection-order',
        type: 'FormDateRangePickerSelectionOrder',
        required: false,
        default: 'swap',
        description:
          'Konfiguruje właściwość „selection order” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'show-presets',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „show presets” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'start-label',
        type: 'string',
        required: false,
        default: 'Data początkowa',
        description:
          'Konfiguruje właściwość „start label” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'start-placeholder',
        type: 'string',
        required: false,
        default: '',
        description:
          'Konfiguruje właściwość „start placeholder” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'variant',
        type: 'FormDateRangePickerVariant',
        required: false,
        default: 'two-inputs',
        description:
          'Wariant wizualny komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'DateRangeValue | undefined',
        required: false,
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Stan otwarcia kontrolowany przez v-model:open. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'apply',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „apply”.',
      },
      {
        name: 'cancel',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „cancel”.',
      },
      {
        name: 'change',
        description: 'Emitowane po zmianie wartości przez użytkownika.',
      },
      {
        name: 'close',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „close”.',
      },
      {
        name: 'endChange',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „endChange”.',
      },
      {
        name: 'invalid',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „invalid”.',
      },
      {
        name: 'monthChange',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „monthChange”.',
      },
      {
        name: 'open',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „open”.',
      },
      {
        name: 'startChange',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „startChange”.',
      },
      {
        name: 'update:value',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”.',
      },
      {
        name: 'update:open',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „open”.',
      },
    ],
    slots: [
      {
        name: 'day',
        description: 'Treść osadzana w nazwanym slocie „day”.',
      },
      {
        name: 'description',
        description: 'Treść osadzana w nazwanym slocie „description”.',
      },
      {
        name: 'end-label',
        description: 'Treść osadzana w nazwanym slocie „end-label”.',
      },
      {
        name: 'error',
        description: 'Treść osadzana w nazwanym slocie „error”.',
      },
      {
        name: 'footer',
        description: 'Treść osadzana w nazwanym slocie „footer”.',
      },
      {
        name: 'hint',
        description: 'Treść osadzana w nazwanym slocie „hint”.',
      },
      {
        name: 'preset',
        description: 'Treść osadzana w nazwanym slocie „preset”.',
      },
      {
        name: 'start-label',
        description: 'Treść osadzana w nazwanym slocie „start-label”.',
      },
      {
        name: 'trigger',
        description: 'Treść osadzana w nazwanym slocie „trigger”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormDateTimePicker',
    sourceName: 'FormDateTimePicker',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/form/FormDateTimePicker',
    tagName: 'peaui-form-date-time-picker',
    status: 'stable',
    props: [
      {
        name: 'allow-off-step',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „allow off step” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'can-erase',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Pokazuje akcję pozwalającą wyczyścić bieżącą wartość. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'confirm',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „confirm” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'date-format',
        type: 'FormDateTimePickerDateFormat',
        required: false,
        default: 'locale',
        description:
          'Konfiguruje właściwość „date format” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        description:
          'Dodatkowy opis objaśniający zawartość albo stan komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description:
          'Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        description:
          'Komunikat błędu powiązany z polem lub operacją. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'format',
        type: 'FormTimePickerFormat',
        required: false,
        default: '24h',
        description:
          'Konfiguruje właściwość „format” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'hour-step',
        type: 'number',
        required: false,
        default: '1',
        description:
          'Konfiguruje właściwość „hour step” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'id',
        type: 'string',
        required: true,
        description:
          'Unikalny identyfikator elementu w dokumencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'is-date-time-disabled',
        type: '(value: LocalDateTimeValue) => boolean',
        required: false,
        description:
          'Konfiguruje właściwość „is date time disabled” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description:
          'Widoczna etykieta opisująca element lub pole formularza. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'layout',
        type: 'FormDateTimePickerLayout',
        required: false,
        default: 'side-by-side',
        description:
          'Konfiguruje właściwość „layout” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wybiera natywną strategię ładowania obrazu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'loading-label',
        type: 'string',
        required: false,
        default: 'Ładowanie wyboru daty i czasu',
        description:
          'Dostępny komunikat opisujący trwającą operację. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'locale',
        type: 'string',
        required: false,
        default: 'pl-PL',
        description:
          'Konfiguruje właściwość „locale” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'max',
        type: 'LocalDateTimeValue',
        required: false,
        description:
          'Maksymalna dozwolona wartość albo szerokość. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'min',
        type: 'LocalDateTimeValue',
        required: false,
        description:
          'Minimalna dozwolona wartość. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'minute-step',
        type: 'number',
        required: false,
        default: '5',
        description:
          'Konfiguruje właściwość „minute step” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description:
          'Nazwa pola używana przez formularz lub nazwa zasobu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'panel-aria-label',
        type: 'string',
        required: false,
        default: 'Wybierz datę i czas',
        description:
          'Konfiguruje właściwość „panel aria label” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: '',
        description:
          'Tekst pomocniczy widoczny przed wprowadzeniem wartości. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'placement',
        type: 'FormDateTimePickerPlacement',
        required: false,
        default: 'bottom',
        description:
          'Konfiguruje właściwość „placement” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description:
          'Ustawia komponent w trybie tylko do odczytu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description:
          'Oznacza wartość jako wymaganą. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'second-step',
        type: 'number',
        required: false,
        default: '5',
        description:
          'Konfiguruje właściwość „second step” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'show-seconds',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „show seconds” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'show-time-zone',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „show time zone” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'time-zone',
        type: 'string',
        required: false,
        description:
          'Konfiguruje właściwość „time zone” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'variant',
        type: 'FormDateTimePickerVariant',
        required: false,
        default: 'single-input',
        description:
          'Wariant wizualny komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'LocalDateTimeValue | undefined',
        required: false,
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Stan otwarcia kontrolowany przez v-model:open. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'apply',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „apply”.',
      },
      {
        name: 'cancel',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „cancel”.',
      },
      {
        name: 'change',
        description: 'Emitowane po zmianie wartości przez użytkownika.',
      },
      {
        name: 'close',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „close”.',
      },
      {
        name: 'dateChange',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „dateChange”.',
      },
      {
        name: 'invalid',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „invalid”.',
      },
      {
        name: 'open',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „open”.',
      },
      {
        name: 'timeChange',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „timeChange”.',
      },
      {
        name: 'update:value',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”.',
      },
      {
        name: 'update:open',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „open”.',
      },
    ],
    slots: [
      {
        name: 'date',
        description: 'Treść osadzana w nazwanym slocie „date”.',
      },
      {
        name: 'description',
        description: 'Treść osadzana w nazwanym slocie „description”.',
      },
      {
        name: 'error',
        description: 'Treść osadzana w nazwanym slocie „error”.',
      },
      {
        name: 'footer',
        description: 'Treść osadzana w nazwanym slocie „footer”.',
      },
      {
        name: 'hint',
        description: 'Treść osadzana w nazwanym slocie „hint”.',
      },
      {
        name: 'time',
        description: 'Treść osadzana w nazwanym slocie „time”.',
      },
      {
        name: 'time-zone',
        description: 'Treść osadzana w nazwanym slocie „time-zone”.',
      },
      {
        name: 'trigger',
        description: 'Treść osadzana w nazwanym slocie „trigger”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormField',
    sourceName: 'FormField',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/form/FormField',
    tagName: 'peaui-form-field',
    status: 'stable',
    props: [
      {
        name: 'after',
        type: 'string',
        required: false,
        description: 'Treść wyświetlana za właściwą wartością pola.',
      },
      {
        name: 'before',
        type: 'string',
        required: false,
        description: 'Treść wyświetlana przed właściwą wartością pola.',
      },
      {
        name: 'can-erase',
        type: 'boolean',
        required: false,
        description: 'Pokazuje akcję pozwalającą wyczyścić bieżącą wartość.',
      },
      {
        name: 'class',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „class” konfigurujący komponent FormField.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „data-testid” konfigurujący komponent FormField.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'icon-after',
        type: 'string | undefined',
        required: false,
        description: 'Nazwa ikony wyświetlanej za treścią pola.',
      },
      {
        name: 'icon-before',
        type: 'string | undefined',
        required: false,
        description: 'Nazwa ikony wyświetlanej przed treścią pola.',
      },
      {
        name: 'id',
        type: 'string',
        required: false,
        description: 'Unikalny identyfikator elementu w dokumencie.',
      },
      {
        name: 'label',
        type: 'string | undefined',
        required: false,
        description: 'Widoczna etykieta opisująca element lub pole formularza.',
      },
      {
        name: 'max-length',
        type: 'number | undefined',
        required: false,
        description: 'Maksymalna liczba znaków możliwa do wprowadzenia.',
      },
      {
        name: 'name',
        type: 'string',
        required: false,
        description: 'Nazwa pola używana przez formularz lub nazwa zasobu.',
      },
      {
        name: 'placeholder',
        type: 'string | undefined',
        required: false,
        description: 'Tekst pomocniczy widoczny przed wprowadzeniem wartości.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description: 'Ustawia komponent w trybie tylko do odczytu.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description: 'Oznacza wartość jako wymaganą.',
      },
      {
        name: 'right-erase-position',
        type: 'number | undefined',
        required: false,
        description: 'Atrybut HTML „right-erase-position” konfigurujący komponent FormField.',
      },
      {
        name: 'value',
        type: 'FormFieldValue',
        required: false,
        description: 'Bieżąca wartość kontrolowana przez v-model.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
      {
        name: 'aria-labelledby',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „aria-labelledby” konfigurujący komponent FormField.',
      },
    ],
    models: [],
    events: [
      {
        name: 'on:remove',
        description: 'Emitowane po wybraniu akcji usunięcia.',
      },
    ],
    slots: [
      {
        name: 'hint',
        description: 'Treść osadzana w nazwanym slocie „hint”.',
      },
      {
        name: 'additional',
        description: 'Treść osadzana w nazwanym slocie „additional”.',
      },
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
      {
        name: 'description',
        description: 'Treść osadzana w nazwanym slocie „description”.',
      },
      {
        name: 'error',
        description: 'Treść osadzana w nazwanym slocie „error”.',
      },
      {
        name: 'success',
        description: 'Treść osadzana w nazwanym slocie „success”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormFieldLabel',
    sourceName: 'FormFieldLabel',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/form/FormFieldLabel',
    tagName: 'peaui-form-field-label',
    status: 'stable',
    props: [
      {
        name: 'for',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „for” konfigurujący komponent FormFieldLabel.',
      },
      {
        name: 'text',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „text” konfigurujący komponent FormFieldLabel.',
      },
      {
        name: 'readonly',
        type: 'string',
        required: false,
        description: 'Ustawia komponent w trybie tylko do odczytu.',
      },
      {
        name: 'required',
        type: 'boolean | undefined',
        required: false,
        description: 'Oznacza wartość jako wymaganą.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „data-testid” konfigurujący komponent FormFieldLabel.',
      },
      {
        name: 'class',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „class” konfigurujący komponent FormFieldLabel.',
      },
      {
        name: "['for']",
        type: 'string',
        required: false,
        description: "Atrybut HTML „['for']” konfigurujący komponent FormFieldLabel.",
      },
      {
        name: "['readonly']",
        type: 'boolean',
        required: false,
        description: "Atrybut HTML „['readonly']” konfigurujący komponent FormFieldLabel.",
      },
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
      {
        name: 'hint',
        description: 'Treść osadzana w nazwanym slocie „hint”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormFileUpload',
    sourceName: 'FormFileUpload',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/form/FormFileUpload',
    tagName: 'peaui-form-file-upload',
    status: 'stable',
    props: [
      {
        name: 'allowed-types',
        type: 'string[]',
        required: false,
        default: "['image/jpeg', 'image/png', 'image/jpg']",
        description:
          'Konfiguruje właściwość „allowed types” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'max-file-size',
        type: 'number',
        required: false,
        default: '5 * 1024 * 1024',
        description:
          'Konfiguruje właściwość „max file size” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'variant',
        type: "'primary' | 'danger'",
        required: false,
        default: 'primary',
        description:
          'Wariant wizualny komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        default: 'undefined',
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'file',
        type: 'FormFileUploadValue | undefined',
        required: false,
        description:
          'Wybrany plik kontrolowany przez v-model:file. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'on:remove',
        description: 'Emitowane po wybraniu akcji usunięcia.',
      },
      {
        name: 'update:file',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „file”.',
      },
    ],
    slots: [],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormFileUploadSimple',
    sourceName: 'FormFileUploadSimple',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/form/FormFileUploadSimple',
    tagName: 'peaui-form-file-upload-simple',
    status: 'stable',
    props: [
      {
        name: 'allowed-types',
        type: 'string[]',
        required: false,
        default:
          "[\n      'application/msword',\n      'application/pdf',\n      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',\n      'image/jpeg',\n      'image/jpg',\n      'image/png',\n    ]",
        description:
          'Konfiguruje właściwość „allowed types” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'context',
        type: 'string',
        required: false,
        default: 'undefined',
        description:
          'Konfiguruje właściwość „context” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'max-file-size',
        type: 'number',
        required: false,
        default: '5 * 1024 * 1024',
        description:
          'Konfiguruje właściwość „max file size” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'max-files',
        type: 'number',
        required: false,
        default: '4',
        description:
          'Konfiguruje właściwość „max files” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        default: 'undefined',
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'files',
        type: 'File[]',
        required: true,
        description:
          'Lista wybranych plików kontrolowana przez v-model:files. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'update:files',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „files”.',
      },
    ],
    slots: [],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormInput',
    sourceName: 'FormInput',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/form/FormInput',
    tagName: 'peaui-form-input',
    status: 'stable',
    props: [
      {
        name: 'after',
        type: 'string',
        required: false,
        description: 'Treść wyświetlana za właściwą wartością pola.',
      },
      {
        name: 'before',
        type: 'string',
        required: false,
        description: 'Treść wyświetlana przed właściwą wartością pola.',
      },
      {
        name: 'can-erase',
        type: 'boolean',
        required: false,
        description: 'Pokazuje akcję pozwalającą wyczyścić bieżącą wartość.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „data-testid” konfigurujący komponent FormInput.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'icon-after',
        type: 'string | undefined',
        required: false,
        description: 'Nazwa ikony wyświetlanej za treścią pola.',
      },
      {
        name: 'icon-before',
        type: 'string | undefined',
        required: false,
        description: 'Nazwa ikony wyświetlanej przed treścią pola.',
      },
      {
        name: 'id',
        type: 'string',
        required: false,
        description: 'Unikalny identyfikator elementu w dokumencie.',
      },
      {
        name: 'label',
        type: 'string | undefined',
        required: false,
        description: 'Widoczna etykieta opisująca element lub pole formularza.',
      },
      {
        name: 'max-length',
        type: 'number | undefined',
        required: false,
        description: 'Maksymalna liczba znaków możliwa do wprowadzenia.',
      },
      {
        name: 'name',
        type: 'string',
        required: false,
        description: 'Nazwa pola używana przez formularz lub nazwa zasobu.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        description: 'Tekst pomocniczy widoczny przed wprowadzeniem wartości.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description: 'Ustawia komponent w trybie tylko do odczytu.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description: 'Oznacza wartość jako wymaganą.',
      },
      {
        name: 'value',
        type: 'string | undefined',
        required: false,
        description: 'Bieżąca wartość kontrolowana przez v-model.',
      },
    ],
    models: [],
    events: [
      {
        name: 'update:value',
        description: 'Natywne zdarzenie CustomEvent „update:value” emitowane przez element.',
      },
      {
        name: 'on:remove',
        description: 'Emitowane po wybraniu akcji usunięcia.',
      },
    ],
    slots: [
      {
        name: 'hint',
        description: 'Treść osadzana w nazwanym slocie „hint”.',
      },
      {
        name: 'description',
        description: 'Treść osadzana w nazwanym slocie „description”.',
      },
      {
        name: 'error',
        description: 'Treść osadzana w nazwanym slocie „error”.',
      },
      {
        name: 'success',
        description: 'Treść osadzana w nazwanym slocie „success”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormMultiSelect',
    sourceName: 'FormMultiSelect',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/form/FormMultiSelect',
    tagName: 'peaui-form-multi-select',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description:
          'Unikalny identyfikator elementu w dokumencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'can-erase',
        type: 'boolean',
        required: false,
        description:
          'Pokazuje akcję pozwalającą wyczyścić bieżącą wartość. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'after',
        type: 'string',
        required: false,
        description:
          'Treść wyświetlana za właściwą wartością pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'before',
        type: 'string',
        required: false,
        description:
          'Treść wyświetlana przed właściwą wartością pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description:
          'Nazwa pola używana przez formularz lub nazwa zasobu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description:
          'Widoczna etykieta opisująca element lub pole formularza. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'icon-before',
        type: 'string',
        required: false,
        description:
          'Nazwa ikony wyświetlanej przed treścią pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description:
          'Oznacza wartość jako wymaganą. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: 'wybierz/wyszukaj',
        description:
          'Tekst pomocniczy widoczny przed wprowadzeniem wartości. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description:
          'Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description:
          'Ustawia komponent w trybie tylko do odczytu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'searchable',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „searchable” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'with-select-all',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „with select all” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'options',
        type: 'MultiSelectFieldOption[]',
        required: true,
        description:
          'Lista opcji dostępnych do wyświetlenia lub wyboru. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'placement',
        type: "'top' | 'bottom'",
        required: false,
        description:
          'Konfiguruje właściwość „placement” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'unknown[] | null | undefined',
        required: true,
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'on:remove',
        description: 'Emitowane po wybraniu akcji usunięcia.',
      },
      {
        name: 'update:value',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”.',
      },
    ],
    slots: [
      {
        name: 'hint',
        description: 'Treść osadzana w nazwanym slocie „hint”.',
      },
      {
        name: 'description',
        description: 'Treść osadzana w nazwanym slocie „description”.',
      },
      {
        name: 'error',
        description: 'Treść osadzana w nazwanym slocie „error”.',
      },
      {
        name: 'success',
        description: 'Treść osadzana w nazwanym slocie „success”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormNumber',
    sourceName: 'FormNumber',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/form/FormNumber',
    tagName: 'peaui-form-number',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description:
          'Unikalny identyfikator elementu w dokumencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'can-erase',
        type: 'boolean',
        required: false,
        description:
          'Pokazuje akcję pozwalającą wyczyścić bieżącą wartość. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'after',
        type: 'string',
        required: false,
        description:
          'Treść wyświetlana za właściwą wartością pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'before',
        type: 'string',
        required: false,
        description:
          'Treść wyświetlana przed właściwą wartością pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description:
          'Nazwa pola używana przez formularz lub nazwa zasobu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description:
          'Widoczna etykieta opisująca element lub pole formularza. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'icon-before',
        type: 'string',
        required: false,
        description:
          'Nazwa ikony wyświetlanej przed treścią pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'icon-after',
        type: 'string',
        required: false,
        description:
          'Nazwa ikony wyświetlanej za treścią pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'max',
        type: 'number',
        required: false,
        description:
          'Maksymalna dozwolona wartość albo szerokość. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'min',
        type: 'number',
        required: false,
        description:
          'Minimalna dozwolona wartość. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'step',
        type: 'number',
        required: false,
        description:
          'Krok zmiany wartości liczbowej. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description:
          'Oznacza wartość jako wymaganą. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: 'wpisz',
        description:
          'Tekst pomocniczy widoczny przed wprowadzeniem wartości. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description:
          'Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description:
          'Ustawia komponent w trybie tylko do odczytu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'is-range-visible',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „is range visible” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'number | undefined | string',
        required: true,
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'update:value',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”.',
      },
    ],
    slots: [
      {
        name: 'hint',
        description: 'Treść osadzana w nazwanym slocie „hint”.',
      },
      {
        name: 'description',
        description: 'Treść osadzana w nazwanym slocie „description”.',
      },
      {
        name: 'error',
        description: 'Treść osadzana w nazwanym slocie „error”.',
      },
      {
        name: 'success',
        description: 'Treść osadzana w nazwanym slocie „success”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormPassword',
    sourceName: 'FormPassword',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/form/FormPassword',
    tagName: 'peaui-form-password',
    status: 'stable',
    props: [
      {
        name: 'before',
        type: 'string',
        required: false,
        description: 'Treść wyświetlana przed właściwą wartością pola.',
      },
      {
        name: 'can-copy',
        type: 'boolean',
        required: false,
        description: 'Atrybut HTML „can-copy” konfigurujący komponent FormPassword.',
      },
      {
        name: 'can-visible',
        type: 'boolean',
        required: false,
        description: 'Atrybut HTML „can-visible” konfigurujący komponent FormPassword.',
      },
      {
        name: 'copy-error-message',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „copy-error-message” konfigurujący komponent FormPassword.',
      },
      {
        name: 'copy-password-aria-label',
        type: 'string',
        required: false,
        description:
          'Atrybut HTML „copy-password-aria-label” konfigurujący komponent FormPassword.',
      },
      {
        name: 'copy-success-message',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „copy-success-message” konfigurujący komponent FormPassword.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „data-testid” konfigurujący komponent FormPassword.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'enable-password-strength-meter',
        type: 'boolean',
        required: false,
        description:
          'Atrybut HTML „enable-password-strength-meter” konfigurujący komponent FormPassword.',
      },
      {
        name: 'hide-password-aria-label',
        type: 'string',
        required: false,
        description:
          'Atrybut HTML „hide-password-aria-label” konfigurujący komponent FormPassword.',
      },
      {
        name: 'icon-before',
        type: 'string | undefined',
        required: false,
        description: 'Nazwa ikony wyświetlanej przed treścią pola.',
      },
      {
        name: 'id',
        type: 'string',
        required: false,
        description: 'Unikalny identyfikator elementu w dokumencie.',
      },
      {
        name: 'label',
        type: 'string | undefined',
        required: false,
        description: 'Widoczna etykieta opisująca element lub pole formularza.',
      },
      {
        name: 'max-length',
        type: 'number | undefined',
        required: false,
        description: 'Maksymalna liczba znaków możliwa do wprowadzenia.',
      },
      {
        name: 'name',
        type: 'string',
        required: false,
        description: 'Nazwa pola używana przez formularz lub nazwa zasobu.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        description: 'Tekst pomocniczy widoczny przed wprowadzeniem wartości.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description: 'Ustawia komponent w trybie tylko do odczytu.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description: 'Oznacza wartość jako wymaganą.',
      },
      {
        name: 'show-password-aria-label',
        type: 'string',
        required: false,
        description:
          'Atrybut HTML „show-password-aria-label” konfigurujący komponent FormPassword.',
      },
      {
        name: 'value',
        type: 'string | undefined',
        required: false,
        description: 'Bieżąca wartość kontrolowana przez v-model.',
      },
    ],
    models: [],
    events: [
      {
        name: 'update:value',
        description: 'Natywne zdarzenie CustomEvent „update:value” emitowane przez element.',
      },
    ],
    slots: [
      {
        name: 'hint',
        description: 'Treść osadzana w nazwanym slocie „hint”.',
      },
      {
        name: 'description',
        description: 'Treść osadzana w nazwanym slocie „description”.',
      },
      {
        name: 'error',
        description: 'Treść osadzana w nazwanym slocie „error”.',
      },
      {
        name: 'success',
        description: 'Treść osadzana w nazwanym slocie „success”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormPinInput',
    sourceName: 'FormPinInput',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/form/FormPinInput',
    tagName: 'peaui-form-pin-input',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: false,
        description:
          'Unikalny identyfikator grupy. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'name',
        type: 'string',
        required: false,
        description:
          'Nazwa wartości wysyłanej z natywnym formularzem. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'form',
        type: 'string',
        required: false,
        description:
          'Identyfikator formularza właściciela. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'length',
        type: 'number',
        required: false,
        default: '6',
        description:
          'Liczba komórek kodu od 1 do 32. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'type',
        type: 'FormPinInputType',
        required: false,
        default: 'numeric',
        description:
          'Zbiór znaków akceptowanych przez komponent. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'mask',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Maskuje wizualnie wpisane znaki. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'size',
        type: 'FormPinInputSize',
        required: false,
        default: 'm',
        description:
          'Rozmiar wizualny komórek; cel dotykowy zawsze ma minimum 44 px. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'pattern',
        type: 'string',
        required: false,
        description:
          'Dodatkowy wzorzec wyrażenia regularnego sprawdzany dla każdego znaku. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'transform',
        type: 'FormPinInputTransform',
        required: false,
        default: 'none',
        description:
          'Transformacja wykonywana przed walidacją znaku. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'separator-every',
        type: 'number',
        required: false,
        default: '0',
        description:
          'Co ile komórek renderowany jest separator; 0 wyłącza grupowanie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'autocomplete',
        type: 'string',
        required: false,
        default: 'one-time-code',
        description:
          'Wartość autocomplete pierwszej komórki. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'inputmode',
        type: 'FormPinInputInputMode',
        required: false,
        description:
          'Podpowiedź klawiatury ekranowej. Domyślnie wynika z typu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'auto-focus',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Ustawia początkowy fokus na pierwszej nieuzupełnionej komórce. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza kontrolkę. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Blokuje edycję bez usuwania kontrolki z kolejności fokusu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Blokuje edycję i udostępnia stan zajętości. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Oznacza każdą komórkę jako wymaganą. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        default: '',
        description:
          'Widoczna etykieta całej grupy. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        default: '',
        description:
          'Tekst instrukcji powiązany z grupą i komórkami. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        default: '',
        description:
          'Komunikat błędu powiązany przez aria-describedby. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: '',
        description:
          'Dostępna nazwa używana, gdy nie ma widocznej etykiety. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'loading-label',
        type: 'string',
        required: false,
        default: 'Trwa przygotowywanie pola kodu',
        description:
          'Tekst stanu ładowania dla technologii asystujących. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator używany w testach. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string',
        required: false,
        default: '',
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'change',
        description: 'Emitowane po zmianie wartości przez użytkownika.',
      },
      {
        name: 'complete',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „complete”.',
      },
      {
        name: 'invalidInput',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „invalidInput”.',
      },
      {
        name: 'focus',
        description: 'Emitowane po ustawieniu fokusu na kontrolce.',
      },
      {
        name: 'blur',
        description: 'Emitowane po opuszczeniu kontrolki przez fokus.',
      },
      {
        name: 'update:value',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”.',
      },
    ],
    slots: [
      {
        name: 'label',
        description: 'Treść osadzana w nazwanym slocie „label”.',
      },
      {
        name: 'hint',
        description: 'Treść osadzana w nazwanym slocie „hint”.',
      },
      {
        name: 'separator',
        description: 'Treść osadzana w nazwanym slocie „separator”.',
      },
      {
        name: 'description',
        description: 'Treść osadzana w nazwanym slocie „description”.',
      },
      {
        name: 'error',
        description: 'Treść osadzana w nazwanym slocie „error”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormRadio',
    sourceName: 'FormRadio',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/form/FormRadio',
    tagName: 'peaui-form-radio',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description:
          'Unikalny identyfikator elementu w dokumencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description:
          'Nazwa pola używana przez formularz lub nazwa zasobu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'option-value',
        type: 'string | number | boolean',
        required: true,
        description:
          'Konfiguruje właściwość „option value” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'is-valid',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „is valid” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description:
          'Oznacza wartość jako wymaganą. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description:
          'Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string | number | boolean | undefined',
        required: true,
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'update:value',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”.',
      },
    ],
    slots: [
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormRatingInput',
    sourceName: 'FormRatingInput',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/form/FormRatingInput',
    tagName: 'peaui-form-rating-input',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: false,
        description:
          'Unikalny identyfikator kontrolki. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'name',
        type: 'string',
        required: false,
        description:
          'Nazwa wartości wysyłanej z formularzem. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'form',
        type: 'string',
        required: false,
        description:
          'Identyfikator formularza właściciela. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'max',
        type: 'number',
        required: false,
        default: '5',
        description:
          'Najwyższa ocena; wartości są normalizowane do zakresu 1–100. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'step',
        type: 'FormRatingInputStep',
        required: false,
        default: '1',
        description:
          'Precyzja pełnej lub połówkowej oceny. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'allow-clear',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Pozwala wyczyścić ocenę klawiszem Delete/Backspace lub ponownym kliknięciem. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyświetla nietabowalny odczyt zamiast kontrolki. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza kontrolkę. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Oznacza ocenę jako wymaganą. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'labels',
        type: 'RatingLabels',
        required: false,
        default: '({})',
        description:
          "Mapa tekstowych opisów indeksowana wartością, np. `{ '4': 'Dobra' }`. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.",
      },
      {
        name: 'get-label',
        type: 'RatingLabelGetter',
        required: false,
        description:
          'Funkcja tworząca tekstowy opis wartości. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'icon',
        type: 'string',
        required: false,
        default: 'core/star',
        description:
          'Nazwa ikony z katalogu PeaUI. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'size',
        type: 'FormRatingInputSize',
        required: false,
        default: 'm',
        description:
          'Rozmiar wizualny ikon; cel dotykowy zachowuje co najmniej 44 px. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        default: '',
        description:
          'Widoczna etykieta pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        default: '',
        description:
          'Tekst pomocniczy powiązany przez aria-describedby. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        default: '',
        description:
          'Komunikat błędu powiązany przez aria-describedby i aria-invalid. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: '',
        description:
          'Dostępna nazwa, gdy nie ma widocznej etykiety. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'empty-label',
        type: 'string',
        required: false,
        default: 'Brak oceny',
        description:
          'Lokalizowany tekst używany dla pustej oceny. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'locale',
        type: 'string',
        required: false,
        default: 'pl-PL',
        description:
          'Locale używane do formatowania wartości połówkowych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'show-value-label',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Pokazuje widoczny tekst bieżącej wartości. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'number | null',
        required: false,
        default: 'null',
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'change',
        description: 'Emitowane po zmianie wartości przez użytkownika.',
      },
      {
        name: 'previewChange',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „previewChange”.',
      },
      {
        name: 'clear',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „clear”.',
      },
      {
        name: 'focus',
        description: 'Emitowane po ustawieniu fokusu na kontrolce.',
      },
      {
        name: 'blur',
        description: 'Emitowane po opuszczeniu kontrolki przez fokus.',
      },
      {
        name: 'update:value',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”.',
      },
    ],
    slots: [
      {
        name: 'label',
        description: 'Treść osadzana w nazwanym slocie „label”.',
      },
      {
        name: 'icon',
        description: 'Treść osadzana w nazwanym slocie „icon”.',
      },
      {
        name: 'value-label',
        description: 'Treść osadzana w nazwanym slocie „value-label”.',
      },
      {
        name: 'description',
        description: 'Treść osadzana w nazwanym slocie „description”.',
      },
      {
        name: 'error',
        description: 'Treść osadzana w nazwanym slocie „error”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormSelect',
    sourceName: 'FormSelect',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/form/FormSelect',
    tagName: 'peaui-form-select',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description:
          'Unikalny identyfikator elementu w dokumencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'can-erase',
        type: 'boolean',
        required: false,
        description:
          'Pokazuje akcję pozwalającą wyczyścić bieżącą wartość. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'after',
        type: 'string',
        required: false,
        description:
          'Treść wyświetlana za właściwą wartością pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'before',
        type: 'string',
        required: false,
        description:
          'Treść wyświetlana przed właściwą wartością pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description:
          'Nazwa pola używana przez formularz lub nazwa zasobu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description:
          'Widoczna etykieta opisująca element lub pole formularza. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'icon-before',
        type: 'string',
        required: false,
        description:
          'Nazwa ikony wyświetlanej przed treścią pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description:
          'Oznacza wartość jako wymaganą. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'placement',
        type: "'top' | 'bottom'",
        required: false,
        description:
          'Preferred list placement. The list flips when the preferred side has insufficient space. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: 'wybierz/wyszukaj',
        description:
          'Tekst pomocniczy widoczny przed wprowadzeniem wartości. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description:
          'Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description:
          'Ustawia komponent w trybie tylko do odczytu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'can-write',
        type: 'boolean',
        required: false,
        description:
          'Konfiguruje właściwość „can write” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'searchable',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „searchable” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'size',
        type: "'xs' | 's' | 'm' | 'l'",
        required: false,
        default: 'm',
        description:
          'Wariant rozmiaru komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'options',
        type: 'SelectFieldOption[]',
        required: true,
        description:
          'Lista opcji dostępnych do wyświetlenia lub wyboru. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'unknown',
        required: true,
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'on:remove',
        description: 'Emitowane po wybraniu akcji usunięcia.',
      },
      {
        name: 'update:value',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”.',
      },
    ],
    slots: [
      {
        name: 'hint',
        description: 'Treść osadzana w nazwanym slocie „hint”.',
      },
      {
        name: 'description',
        description: 'Treść osadzana w nazwanym slocie „description”.',
      },
      {
        name: 'error',
        description: 'Treść osadzana w nazwanym slocie „error”.',
      },
      {
        name: 'success',
        description: 'Treść osadzana w nazwanym slocie „success”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormSwitchToggle',
    sourceName: 'FormSwitchToggle',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/form/FormSwitchToggle',
    tagName: 'peaui-form-switch-toggle',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: false,
        description:
          'Unikalny identyfikator kontrolki. Generowany automatycznie, jeśli nie zostanie podany. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'name',
        type: 'string',
        required: false,
        description:
          'Nazwa pola używana podczas natywnego wysyłania formularza. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'form',
        type: 'string',
        required: false,
        description:
          'Identyfikator formularza właściciela, również gdy kontrolka znajduje się poza formularzem. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        default: '',
        description:
          'Widoczna etykieta przełącznika. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        default: '',
        description:
          'Tekst pomocniczy powiązany z kontrolką przez aria-describedby. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        default: '',
        description:
          'Komunikat błędu powiązany z kontrolką i aria-invalid. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'true-value',
        type: 'Value',
        required: false,
        description:
          'Wartość modelu reprezentująca stan włączony. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'false-value',
        type: 'Value',
        required: false,
        description:
          'Wartość modelu reprezentująca stan wyłączony. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'size',
        type: "'s' | 'm' | 'l'",
        required: false,
        default: 'm',
        description:
          'Rozmiar wizualny szyny; obszar dotykowy zawsze ma co najmniej 44 px. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'label-position',
        type: "'start' | 'end'",
        required: false,
        default: 'end',
        description:
          'Pozycja etykiety względem szyny. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza kontrolkę i usuwa ją z kolejności fokusu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Blokuje zmianę, zachowując kontrolkę w kolejności fokusu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Blokuje zmianę i udostępnia stan zajętości technologiom asystującym. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Oznacza pole jako wymagane dla formularza i technologii asystujących. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'show-state-label',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Pokazuje tekstowy stan obok szyny bez polegania wyłącznie na kolorze. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'on-label',
        type: 'string',
        required: false,
        default: 'Włączone',
        description:
          'Tekst widoczny dla stanu włączonego. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'off-label',
        type: 'string',
        required: false,
        default: 'Wyłączone',
        description:
          'Tekst widoczny dla stanu wyłączonego. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: '',
        description:
          'Dostępna nazwa używana, gdy nie ma widocznej etykiety. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'loading-label',
        type: 'string',
        required: false,
        default: 'Trwa aktualizowanie ustawienia',
        description:
          'Dostępny komunikat stanu ładowania. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator używany w testach automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'Value',
        required: true,
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'change',
        description: 'Emitowane po zmianie wartości przez użytkownika.',
      },
      {
        name: 'focus',
        description: 'Emitowane po ustawieniu fokusu na kontrolce.',
      },
      {
        name: 'blur',
        description: 'Emitowane po opuszczeniu kontrolki przez fokus.',
      },
      {
        name: 'update:value',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”.',
      },
    ],
    slots: [
      {
        name: 'label',
        description: 'Treść osadzana w nazwanym slocie „label”.',
      },
      {
        name: 'thumb',
        description: 'Treść osadzana w nazwanym slocie „thumb”.',
      },
      {
        name: 'on-label',
        description: 'Treść osadzana w nazwanym slocie „on-label”.',
      },
      {
        name: 'off-label',
        description: 'Treść osadzana w nazwanym slocie „off-label”.',
      },
      {
        name: 'description',
        description: 'Treść osadzana w nazwanym slocie „description”.',
      },
      {
        name: 'error',
        description: 'Treść osadzana w nazwanym slocie „error”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormTagsInput',
    sourceName: 'FormTagsInput',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/form/FormTagsInput',
    tagName: 'peaui-form-tags-input',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: false,
        description:
          'Unikalny identyfikator pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'name',
        type: 'string',
        required: false,
        description:
          'Nazwa używana przez natywny formularz; każdy tag tworzy osobną wartość. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'form',
        type: 'string',
        required: false,
        description:
          'Identyfikator formularza właściciela. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        default: '',
        description:
          'Widoczna etykieta pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        default: '',
        description:
          'Tekst pomocniczy powiązany z polem. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        default: '',
        description:
          'Komunikat błędu powiązany przez aria-describedby. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: 'Dodaj tag',
        description:
          'Placeholder edytora. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: '',
        description:
          'Dostępna nazwa, gdy nie podano widocznej etykiety. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'layout',
        type: 'FormTagsInputLayout',
        required: false,
        default: 'inline',
        description:
          'Układ tagów i edytora. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'mode',
        type: 'FormTagsInputMode',
        required: false,
        default: 'freeform',
        description:
          'Tryb swobodny albo ograniczony do sugestii. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'allow-create',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Pozwala utworzyć tag spoza listy sugestii. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'allow-duplicates',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Pozwala dodać tag o tym samym kluczu więcej niż raz. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'max',
        type: 'number',
        required: false,
        description:
          'Maksymalna liczba tagów. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'separators',
        type: 'readonly string[]',
        required: false,
        default: "[',', ';', '\\n']",
        description:
          'Separatory używane podczas wpisywania i wklejania. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'suggestions',
        type: 'readonly FormTagsInputTag[]',
        required: false,
        default: '[]',
        description:
          'Kontrolowana lista sugestii. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'suggestion-provider',
        type: 'FormTagsInputSuggestionProvider',
        required: false,
        description:
          'Opcjonalny dostawca sugestii z anulowaniem nieaktualnych zapytań. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Zewnętrzny stan ładowania sugestii. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'placement',
        type: 'FormTagsInputPlacement',
        required: false,
        default: 'auto',
        description:
          'Położenie panelu sugestii. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'normalize-tag',
        type: 'FormTagsInputNormalizer',
        required: false,
        description:
          'Normalizuje tekst przed walidacją. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'validate-tag',
        type: 'FormTagsInputValidator',
        required: false,
        description:
          'Waliduje pojedynczy tag przed zmianą modelu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'get-tag-key',
        type: 'FormTagsInputKeyGetter',
        required: false,
        description:
          'Wyznacza stabilny klucz i regułę duplikatów. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'serialize-tag',
        type: 'FormTagsInputSerializer',
        required: false,
        description:
          'Serializuje wartości do natywnych pól formularza. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled-tags',
        type: 'readonly (string | number)[]',
        required: false,
        default: '[]',
        description:
          'Klucze lub etykiety tagów, których nie można edytować ani usunąć. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza całą kontrolkę. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Pozwala odczytać i kopiować zawartość bez jej zmiany. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Oznacza pole jako wymagane. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'loading-label',
        type: 'string',
        required: false,
        default: 'Ładowanie sugestii',
        description:
          'Tekst prezentowany podczas ładowania sugestii. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'empty-label',
        type: 'string',
        required: false,
        default: 'Brak pasujących sugestii',
        description:
          'Tekst pustego wyniku wyszukiwania. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator używany w testach. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'FormTagsInputTag[]',
        required: false,
        default: '[]',
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'input-value',
        type: 'string',
        required: false,
        default: '',
        description:
          'Wartość kontrolowana przez v-model:inputValue. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'add',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „add”.',
      },
      {
        name: 'remove',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „remove”.',
      },
      {
        name: 'edit',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „edit”.',
      },
      {
        name: 'invalidTag',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „invalidTag”.',
      },
      {
        name: 'search',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „search”.',
      },
      {
        name: 'maxReached',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „maxReached”.',
      },
      {
        name: 'update:value',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”.',
      },
      {
        name: 'update:inputValue',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „inputValue”.',
      },
    ],
    slots: [
      {
        name: 'label',
        description: 'Treść osadzana w nazwanym slocie „label”.',
      },
      {
        name: 'hint',
        description: 'Treść osadzana w nazwanym slocie „hint”.',
      },
      {
        name: 'tag',
        description: 'Treść osadzana w nazwanym slocie „tag”.',
      },
      {
        name: 'tag-content',
        description: 'Treść osadzana w nazwanym slocie „tag-content”.',
      },
      {
        name: 'suggestion',
        description: 'Treść osadzana w nazwanym slocie „suggestion”.',
      },
      {
        name: 'empty-suggestions',
        description: 'Treść osadzana w nazwanym slocie „empty-suggestions”.',
      },
      {
        name: 'loading',
        description: 'Treść osadzana w nazwanym slocie „loading”.',
      },
      {
        name: 'prefix',
        description: 'Treść osadzana w nazwanym slocie „prefix”.',
      },
      {
        name: 'suffix',
        description: 'Treść osadzana w nazwanym slocie „suffix”.',
      },
      {
        name: 'description',
        description: 'Treść osadzana w nazwanym slocie „description”.',
      },
      {
        name: 'error',
        description: 'Treść osadzana w nazwanym slocie „error”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormTextarea',
    sourceName: 'FormTextarea',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/form/FormTextarea',
    tagName: 'peaui-form-textarea',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description:
          'Unikalny identyfikator elementu w dokumencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description:
          'Nazwa pola używana przez formularz lub nazwa zasobu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'rows',
        type: 'number',
        required: false,
        default: '5',
        description:
          'Konfiguruje właściwość „rows” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description:
          'Widoczna etykieta opisująca element lub pole formularza. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'max-length',
        type: 'number',
        required: false,
        description:
          'Maksymalna liczba znaków możliwa do wprowadzenia. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description:
          'Oznacza wartość jako wymaganą. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: 'wpisz',
        description:
          'Tekst pomocniczy widoczny przed wprowadzeniem wartości. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description:
          'Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description:
          'Ustawia komponent w trybie tylko do odczytu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string | undefined',
        required: true,
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'update:value',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”.',
      },
    ],
    slots: [
      {
        name: 'hint',
        description: 'Treść osadzana w nazwanym slocie „hint”.',
      },
      {
        name: 'description',
        description: 'Treść osadzana w nazwanym slocie „description”.',
      },
      {
        name: 'error',
        description: 'Treść osadzana w nazwanym slocie „error”.',
      },
      {
        name: 'success',
        description: 'Treść osadzana w nazwanym slocie „success”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormTimePicker',
    sourceName: 'FormTimePicker',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/form/FormTimePicker',
    tagName: 'peaui-form-time-picker',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description:
          'Stabilny identyfikator pola i powiązanych elementów ARIA. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description:
          'Nazwa pola używana przy wysyłaniu formularza. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description:
          'Widoczna etykieta pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        description:
          'Tekst pomocy wyświetlany pod polem. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        description:
          'Zewnętrzny komunikat błędu; ma pierwszeństwo przed walidacją wewnętrzną. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: 'undefined',
        description:
          'Placeholder opisujący oczekiwany format. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'variant',
        type: 'FormTimePickerVariant',
        required: false,
        default: 'input',
        description:
          'Edytowalne pole tekstowe albo zestaw dostępnych segmentów. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'panel-mode',
        type: 'FormTimePickerPanelMode',
        required: false,
        default: 'dropdown',
        description:
          'Lista opcji albo kompaktowe kontrolki spinbutton w panelu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'placement',
        type: 'FormTimePickerPlacement',
        required: false,
        default: 'bottom',
        description:
          'Preferowane położenie panelu; komponent może odwrócić je przy krawędzi viewportu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'format',
        type: 'FormTimePickerFormat',
        required: false,
        default: '24h',
        description:
          'Format prezentacji. Model zawsze pozostaje wartością 24-godzinną. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'show-seconds',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Dodaje segment sekund do pola, modelu i panelu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'hour-step',
        type: 'number',
        required: false,
        default: '1',
        description:
          'Krok godzin wykorzystywany przez opcje i klawiaturę. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'minute-step',
        type: 'number',
        required: false,
        default: '5',
        description:
          'Krok minut wykorzystywany przez opcje i klawiaturę. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'second-step',
        type: 'number',
        required: false,
        default: '5',
        description:
          'Krok sekund wykorzystywany przez opcje i klawiaturę. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'min',
        type: 'string',
        required: false,
        description:
          'Najwcześniejsza dozwolona wartość w formacie HH:mm[:ss]. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'max',
        type: 'string',
        required: false,
        description:
          'Najpóźniejsza dozwolona wartość w formacie HH:mm[:ss]. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'allow-off-step',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Pozwala zatwierdzić ręcznie wpisaną wartość, która nie leży na siatce kroków. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'locale',
        type: 'string',
        required: false,
        default: 'pl-PL',
        description:
          'Locale używany do prezentacji okresu dnia w formacie 12h. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'parse',
        type: 'TimePickerParser',
        required: false,
        description:
          'Opcjonalny parser tekstu zastępujący parser wbudowany. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'format-value',
        type: 'TimePickerFormatter',
        required: false,
        description:
          'Opcjonalny formatter prezentacji zastępujący formatter wbudowany. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'can-erase',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Pozwala usunąć bieżącą wartość przyciskiem pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Pole musi zawierać poprawną wartość. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Całkowicie blokuje kontrolkę. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Pozwala odczytać wartość bez jej zmiany. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Blokuje interakcje i udostępnia stan oczekiwania technologiom asystującym. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa pola, gdy nie ma widocznej etykiety. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'panel-aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa panelu wyboru czasu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'trigger-aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa przycisku panelu w wariancie segmented. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'loading-label',
        type: 'string',
        required: false,
        default: 'Ładowanie wyboru czasu',
        description:
          'Tekst ogłaszany podczas ładowania. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator używany w testach automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string | undefined',
        required: false,
        default: 'undefined',
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Stan otwarcia kontrolowany przez v-model:open. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'change',
        description: 'Emitowane po zmianie wartości przez użytkownika.',
      },
      {
        name: 'invalid',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „invalid”.',
      },
      {
        name: 'open',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „open”.',
      },
      {
        name: 'close',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „close”.',
      },
      {
        name: 'update:value',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”.',
      },
      {
        name: 'update:open',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „open”.',
      },
    ],
    slots: [
      {
        name: 'trigger',
        description: 'Treść osadzana w nazwanym slocie „trigger”.',
      },
      {
        name: 'hour-option',
        description: 'Treść osadzana w nazwanym slocie „hour-option”.',
      },
      {
        name: 'minute-option',
        description: 'Treść osadzana w nazwanym slocie „minute-option”.',
      },
      {
        name: 'second-option',
        description: 'Treść osadzana w nazwanym slocie „second-option”.',
      },
      {
        name: 'period-option',
        description: 'Treść osadzana w nazwanym slocie „period-option”.',
      },
      {
        name: 'footer',
        description: 'Treść osadzana w nazwanym slocie „footer”.',
      },
      {
        name: 'error',
        description: 'Treść osadzana w nazwanym slocie „error”.',
      },
      {
        name: 'description',
        description: 'Treść osadzana w nazwanym slocie „description”.',
      },
      {
        name: 'hint',
        description: 'Treść osadzana w nazwanym slocie „hint”.',
      },
    ],
  },
  {
    category: 'form',
    categoryLabel: 'Formularze',
    name: 'FormYearPicker',
    sourceName: 'FormYearPicker',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/form/FormYearPicker',
    tagName: 'peaui-form-year-picker',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description:
          'Unikalny identyfikator elementu w dokumencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'can-erase',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Pokazuje akcję pozwalającą wyczyścić bieżącą wartość. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'after',
        type: 'string',
        required: false,
        description:
          'Treść wyświetlana za właściwą wartością pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'before',
        type: 'string',
        required: false,
        description:
          'Treść wyświetlana przed właściwą wartością pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description:
          'Nazwa pola używana przez formularz lub nazwa zasobu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description:
          'Widoczna etykieta opisująca element lub pole formularza. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'icon-before',
        type: 'string',
        required: false,
        description:
          'Nazwa ikony wyświetlanej przed treścią pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description:
          'Oznacza wartość jako wymaganą. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: 'wybierz rok',
        description:
          'Tekst pomocniczy widoczny przed wprowadzeniem wartości. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'range',
        type: 'boolean',
        required: false,
        description:
          'Konfiguruje właściwość „range” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'min-year',
        type: 'number',
        required: false,
        description:
          'Konfiguruje właściwość „min year” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'max-year',
        type: 'number',
        required: false,
        description:
          'Konfiguruje właściwość „max year” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description:
          'Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description:
          'Ustawia komponent w trybie tylko do odczytu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'number | YearPickerRangeValue | undefined',
        required: true,
        description:
          'Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'on:remove',
        description: 'Emitowane po wybraniu akcji usunięcia.',
      },
      {
        name: 'update:value',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”.',
      },
    ],
    slots: [
      {
        name: 'hint',
        description: 'Treść osadzana w nazwanym slocie „hint”.',
      },
      {
        name: 'description',
        description: 'Treść osadzana w nazwanym slocie „description”.',
      },
      {
        name: 'error',
        description: 'Treść osadzana w nazwanym slocie „error”.',
      },
      {
        name: 'success',
        description: 'Treść osadzana w nazwanym slocie „success”.',
      },
    ],
  },
  {
    category: 'layout',
    categoryLabel: 'Układ',
    name: 'CardPanel',
    sourceName: 'CardPanel',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/layout/CardPanel',
    tagName: 'peaui-card-panel',
    status: 'stable',
    props: [
      {
        name: 'aria-label',
        type: 'string | null',
        required: false,
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
      {
        name: 'as',
        type: 'CardPanelTag',
        required: false,
        description: 'Atrybut HTML „as” konfigurujący komponent CardPanel.',
      },
      {
        name: 'background-color',
        type: 'CardPanelColor',
        required: false,
        description: 'Atrybut HTML „background-color” konfigurujący komponent CardPanel.',
      },
      {
        name: 'border-color',
        type: 'CardPanelColor',
        required: false,
        description: 'Atrybut HTML „border-color” konfigurujący komponent CardPanel.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „data-testid” konfigurujący komponent CardPanel.',
      },
      {
        name: 'href',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „href” konfigurujący komponent CardPanel.',
      },
      {
        name: 'is-hover-enabled',
        type: 'boolean',
        required: false,
        description: 'Atrybut HTML „is-hover-enabled” konfigurujący komponent CardPanel.',
      },
      {
        name: 'is-shadow-enabled',
        type: 'boolean',
        required: false,
        description: 'Atrybut HTML „is-shadow-enabled” konfigurujący komponent CardPanel.',
      },
      {
        name: 'rel',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „rel” konfigurujący komponent CardPanel.',
      },
      {
        name: 'size',
        type: 'CardPanelSize',
        required: false,
        description: 'Wariant rozmiaru komponentu.',
      },
      {
        name: 'target',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „target” konfigurujący komponent CardPanel.',
      },
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'header',
        description: 'Treść osadzana w nazwanym slocie „header”.',
      },
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
    ],
  },
  {
    category: 'layout',
    categoryLabel: 'Układ',
    name: 'FullscreenContainer',
    sourceName: 'FullscreenContainer',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/layout/FullscreenContainer',
    tagName: 'peaui-fullscreen-container',
    status: 'stable',
    props: [
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'open-label',
        type: 'string',
        required: false,
        default: 'Otwórz tryb pełnoekranowy',
        description:
          'Konfiguruje właściwość „open label” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'close-label',
        type: 'string',
        required: false,
        default: 'Zamknij tryb pełnoekranowy',
        description:
          'Konfiguruje właściwość „close label” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
    ],
  },
  {
    category: 'layout',
    categoryLabel: 'Układ',
    name: 'GridItem',
    sourceName: 'GridItem',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/layout/GridItem',
    tagName: 'peaui-grid-item',
    status: 'stable',
    props: [
      {
        name: 'colspan',
        type: 'number | undefined',
        required: false,
        description: 'Atrybut HTML „colspan” konfigurujący komponent GridItem.',
      },
      {
        name: 'columns',
        type: 'number | undefined',
        required: false,
        description: 'Definicje kolumn określające ich etykiety, klucze i sposób renderowania.',
      },
      {
        name: 'gap',
        type: 'number',
        required: false,
        description: 'Odstęp pomiędzy elementami układu.',
      },
      {
        name: 'grid',
        type: 'boolean',
        required: false,
        description: 'Atrybut HTML „grid” konfigurujący komponent GridItem.',
      },
      {
        name: 'class',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „class” konfigurujący komponent GridItem.',
      },
      {
        name: 'style',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „style” konfigurujący komponent GridItem.',
      },
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
    ],
  },
  {
    category: 'layout',
    categoryLabel: 'Układ',
    name: 'GridSection',
    sourceName: 'GridSection',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/layout/GridSection',
    tagName: 'peaui-grid-section',
    status: 'stable',
    props: [
      {
        name: 'columns',
        type: 'number',
        required: false,
        description: 'Definicje kolumn określające ich etykiety, klucze i sposób renderowania.',
      },
      {
        name: 'gap',
        type: 'number',
        required: false,
        description: 'Odstęp pomiędzy elementami układu.',
      },
      {
        name: 'class',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „class” konfigurujący komponent GridSection.',
      },
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'additional',
        description: 'Treść osadzana w nazwanym slocie „additional”.',
      },
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
    ],
  },
  {
    category: 'layout',
    categoryLabel: 'Układ',
    name: 'PageLayout',
    sourceName: 'PageLayout',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/layout/PageLayout',
    tagName: 'peaui-page-layout',
    status: 'stable',
    props: [
      {
        name: 'aria-label',
        type: 'string | null',
        required: false,
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „data-testid” konfigurujący komponent PageLayout.',
      },
      {
        name: 'is-header-sticky',
        type: 'boolean',
        required: false,
        description: 'Atrybut HTML „is-header-sticky” konfigurujący komponent PageLayout.',
      },
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'top',
        description: 'Treść osadzana w nazwanym slocie „top”.',
      },
      {
        name: 'additional',
        description: 'Treść osadzana w nazwanym slocie „additional”.',
      },
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
      {
        name: 'footer',
        description: 'Treść osadzana w nazwanym slocie „footer”.',
      },
    ],
  },
  {
    category: 'layout',
    categoryLabel: 'Układ',
    name: 'ScrollArea',
    sourceName: 'ScrollArea',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/layout/ScrollArea',
    tagName: 'peaui-scroll-area',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator komponentu, relacji ARIA i opcjonalnie zapisanej pozycji. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'type',
        type: 'ScrollAreaType',
        required: false,
        default: 'styled',
        description:
          'Natywne paski systemowe albo dostępne paski stylowane przez PeaUI. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'orientation',
        type: 'ScrollAreaOrientation',
        required: false,
        default: 'vertical',
        description:
          'Osie, na których zawartość może być przewijana. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'scrollbar-visibility',
        type: 'ScrollAreaScrollbarVisibility',
        required: false,
        default: 'auto',
        description:
          'Sposób widoczności stylowanych pasków przewijania. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'scrollbar-size',
        type: 'number',
        required: false,
        default: '10',
        description:
          'Grubość paska w pikselach, ograniczona do zakresu 6–20. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'auto-hide-delay',
        type: 'number',
        required: false,
        default: '700',
        description:
          'Opóźnienie ukrycia automatycznego paska w milisekundach, maksymalnie 10000. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'tabindex',
        type: 'number',
        required: false,
        description:
          'Opcjonalny tabindex natywnego viewportu; bez niego komponent nie dodaje przystanku Tab. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa przewijanego regionu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Blokuje publiczne metody i sterowanie stylowanymi paskami, zachowując natywny scroll. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'restore-position',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Przywraca pozycję po ponownym montażu, gdy przekazano stabilne id. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny selektor testowy elementu głównego. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [],
    events: [
      {
        name: 'scroll',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „scroll”.',
      },
      {
        name: 'scrollStart',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „scrollStart”.',
      },
      {
        name: 'scrollEnd',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „scrollEnd”.',
      },
      {
        name: 'reachStart',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „reachStart”.',
      },
      {
        name: 'reachEnd',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „reachEnd”.',
      },
      {
        name: 'resize',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „resize”.',
      },
    ],
    slots: [
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
      {
        name: 'scrollbar',
        description: 'Treść osadzana w nazwanym slocie „scrollbar”.',
      },
      {
        name: 'start-indicator',
        description: 'Treść osadzana w nazwanym slocie „start-indicator”.',
      },
      {
        name: 'end-indicator',
        description: 'Treść osadzana w nazwanym slocie „end-indicator”.',
      },
    ],
  },
  {
    category: 'layout',
    categoryLabel: 'Układ',
    name: 'SectionDivider',
    sourceName: 'SectionDivider',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/layout/SectionDivider',
    tagName: 'peaui-section-divider',
    status: 'stable',
    props: [
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'direction',
        type: "'horizontal' | 'vertical'",
        required: false,
        default: 'horizontal',
        description:
          'Konfiguruje właściwość „direction” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'size',
        type: "'s' | 'm' | 'l' | 'xl'",
        required: false,
        default: 's',
        description:
          'Wariant rozmiaru komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [],
    events: [],
    slots: [],
  },
  {
    category: 'navigation',
    categoryLabel: 'Nawigacja',
    name: 'Breadcrumbs',
    sourceName: 'Breadcrumbs',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/navigation/Breadcrumbs',
    tagName: 'peaui-breadcrumbs',
    status: 'stable',
    props: [
      {
        name: 'items',
        type: 'BreadcrumbItem[]',
        required: false,
        default: '[]',
        description:
          'Konfiguruje właściwość „items” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'separator',
        type: 'string',
        required: false,
        default: '/',
        description:
          'Konfiguruje właściwość „separator” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: 'Ścieżka nawigacji',
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [],
    events: [
      {
        name: 'on:navigate',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:navigate”.',
      },
    ],
    slots: [],
  },
  {
    category: 'navigation',
    categoryLabel: 'Nawigacja',
    name: 'ContextMenu',
    sourceName: 'ContextMenu',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/navigation/ContextMenu',
    tagName: 'peaui-context-menu',
    status: 'stable',
    props: [
      {
        name: 'items',
        type: 'DropdownMenuItem[]',
        required: false,
        default: '[]',
        description:
          'Pozycje współdzielące pełny kontrakt semantyczny z DropdownMenu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'context',
        type: 'unknown',
        required: false,
        description:
          'Dane domenowe bieżącego celu przekazywane w zdarzeniach akcji. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza wyłącznie menu kontekstowe, bez blokowania podstawowej funkcji celu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'trigger',
        type: "'pointer' | 'keyboard' | 'both'",
        required: false,
        default: 'both',
        description:
          'Dozwolony sposób otwierania menu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'position',
        type: "'cursor' | 'target'",
        required: false,
        default: 'cursor',
        description:
          'Pozycjonuje menu przy kursorze albo przy prostokącie aktywnego celu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'long-press',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Włącza otwieranie dotykiem po bezruchowym przytrzymaniu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'long-press-delay',
        type: 'number',
        required: false,
        default: '550',
        description:
          'Czas przytrzymania w milisekundach; wartości są ograniczane do bezpiecznego zakresu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'long-press-move-threshold',
        type: 'number',
        required: false,
        default: '10',
        description:
          'Maksymalny ruch wskaźnika w pikselach przed anulowaniem long press. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'close-on-scroll',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Zamyka otwarte menu po przewinięciu dokumentu lub kontenera celu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'offset',
        type: 'number',
        required: false,
        default: '4',
        description:
          'Odstęp powierzchni menu od punktu albo celu w pikselach. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'close-on-select',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Zamyka menu po zwykłej akcji. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'loop',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Pozwala zapętlać nawigację strzałkami. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'density',
        type: 'DropdownMenuDensity',
        required: false,
        default: 'comfortable',
        description:
          'Gęstość pionowa pozycji menu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: 'Menu kontekstowe',
        description:
          'Dostępna nazwa powierzchni menu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Pokazuje stan ładowania zamiast pozycji. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator używany w testach automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Stan otwarcia kontrolowany przez v-model:open. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'open',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „open”.',
      },
      {
        name: 'close',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „close”.',
      },
      {
        name: 'select',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „select”.',
      },
      {
        name: 'checkedChange',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „checkedChange”.',
      },
      {
        name: 'valueChange',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „valueChange”.',
      },
      {
        name: 'contextChange',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „contextChange”.',
      },
      {
        name: 'longPressCancel',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „longPressCancel”.',
      },
      {
        name: 'update:open',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „open”.',
      },
    ],
    slots: [
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
      {
        name: 'trigger',
        description: 'Treść osadzana w nazwanym slocie „trigger”.',
      },
      {
        name: 'item',
        description: 'Treść osadzana w nazwanym slocie „item”.',
      },
      {
        name: 'item-icon',
        description: 'Treść osadzana w nazwanym slocie „item-icon”.',
      },
      {
        name: 'item-shortcut',
        description: 'Treść osadzana w nazwanym slocie „item-shortcut”.',
      },
      {
        name: 'group-label',
        description: 'Treść osadzana w nazwanym slocie „group-label”.',
      },
      {
        name: 'empty',
        description: 'Treść osadzana w nazwanym slocie „empty”.',
      },
      {
        name: 'loading',
        description: 'Treść osadzana w nazwanym slocie „loading”.',
      },
    ],
  },
  {
    category: 'navigation',
    categoryLabel: 'Nawigacja',
    name: 'DropdownMenu',
    sourceName: 'DropdownMenu',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/navigation/DropdownMenu',
    tagName: 'peaui-dropdown-menu',
    status: 'stable',
    props: [
      {
        name: 'items',
        type: 'DropdownMenuItem[]',
        required: false,
        default: '[]',
        description:
          'Deklaratywna kolekcja akcji, grup, separatorów i podmenu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza trigger i wszystkie akcje menu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'placement',
        type: "'top' | 'right' | 'bottom' | 'left'",
        required: false,
        default: 'bottom',
        description:
          'Strona triggera zachowywana także przy kolizji; powierzchnia jest ograniczana do viewportu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'align',
        type: "'start' | 'center' | 'end'",
        required: false,
        default: 'start',
        description:
          'Wyrównanie menu na osi poprzecznej. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'offset',
        type: 'number',
        required: false,
        default: '8',
        description:
          'Odstęp menu od triggera w pikselach. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'close-on-select',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Zamyka menu po zwykłej akcji; checkbox i radio pozostają domyślnie otwarte. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'loop',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Pozwala zapętlać nawigację strzałkami między skrajnymi pozycjami. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'density',
        type: "'compact' | 'comfortable'",
        required: false,
        default: 'comfortable',
        description:
          'Gęstość pionowa pozycji menu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: 'Menu akcji',
        description:
          'Dostępna nazwa powierzchni menu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'trigger-label',
        type: 'string',
        required: false,
        default: 'Otwórz menu',
        description:
          'Widoczna i dostępna etykieta domyślnego triggera. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Pokazuje stan ładowania zamiast pozycji. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator używany w testach automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Stan otwarcia kontrolowany przez v-model:open. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'select',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „select”.',
      },
      {
        name: 'checkedChange',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „checkedChange”.',
      },
      {
        name: 'valueChange',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „valueChange”.',
      },
      {
        name: 'openChange',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „openChange”.',
      },
      {
        name: 'escape',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „escape”.',
      },
      {
        name: 'outsideClick',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „outsideClick”.',
      },
      {
        name: 'update:open',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „open”.',
      },
    ],
    slots: [
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
      {
        name: 'trigger',
        description: 'Treść osadzana w nazwanym slocie „trigger”.',
      },
      {
        name: 'item',
        description: 'Treść osadzana w nazwanym slocie „item”.',
      },
      {
        name: 'item-icon',
        description: 'Treść osadzana w nazwanym slocie „item-icon”.',
      },
      {
        name: 'item-shortcut',
        description: 'Treść osadzana w nazwanym slocie „item-shortcut”.',
      },
      {
        name: 'group-label',
        description: 'Treść osadzana w nazwanym slocie „group-label”.',
      },
      {
        name: 'empty',
        description: 'Treść osadzana w nazwanym slocie „empty”.',
      },
      {
        name: 'loading',
        description: 'Treść osadzana w nazwanym slocie „loading”.',
      },
    ],
  },
  {
    category: 'navigation',
    categoryLabel: 'Nawigacja',
    name: 'ListLimitControl',
    sourceName: 'ListLimitControl',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/navigation/ListLimitControl',
    tagName: 'peaui-list-limit-control',
    status: 'stable',
    props: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description:
          'Unikalny identyfikator elementu w dokumencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'label',
        type: 'string',
        required: true,
        description:
          'Widoczna etykieta opisująca element lub pole formularza. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'limit-list',
        type: 'number[]',
        required: false,
        default: '[5, 10, 25, 50]',
        description:
          'Konfiguruje właściwość „limit list” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'position',
        type: "'top' | 'bottom'",
        required: false,
        default: 'bottom',
        description:
          'Preferred list placement; it flips automatically when the selected side has insufficient space. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'limit',
        type: 'number',
        required: true,
        description:
          'Wybrany limit elementów kontrolowany przez v-model:limit. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'update:limit',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „limit”.',
      },
    ],
    slots: [
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
    ],
  },
  {
    category: 'navigation',
    categoryLabel: 'Nawigacja',
    name: 'MenuBar',
    sourceName: 'MenuBar',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/navigation/MenuBar',
    tagName: 'peaui-menu-bar',
    status: 'stable',
    props: [
      {
        name: 'menus',
        type: 'MenuBarMenu[]',
        required: false,
        default: '[]',
        description:
          'Uporządkowane sekcje poziomego menu aplikacyjnego. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza cały pasek i zamyka aktywną sekcję. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'loop',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Pozwala zapętlać fokus między pierwszym i ostatnim dostępnym triggerem. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'variant',
        type: "'default' | 'compact'",
        required: false,
        default: 'default',
        description:
          'Gęstość wizualna triggerów i pozycji menu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: 'Menu aplikacji',
        description:
          'Dostępna nazwa elementu z rolą menubar. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator używany w testach automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'open-menu',
        type: 'string | number | null',
        required: false,
        default: 'null',
        description:
          'Wartość kontrolowana przez v-model:openMenu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'select',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „select”.',
      },
      {
        name: 'focusChange',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „focusChange”.',
      },
      {
        name: 'checkedChange',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „checkedChange”.',
      },
      {
        name: 'valueChange',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „valueChange”.',
      },
      {
        name: 'update:openMenu',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „openMenu”.',
      },
    ],
    slots: [
      {
        name: 'menu-trigger',
        description: 'Treść osadzana w nazwanym slocie „menu-trigger”.',
      },
      {
        name: 'item',
        description: 'Treść osadzana w nazwanym slocie „item”.',
      },
      {
        name: 'group-label',
        description: 'Treść osadzana w nazwanym slocie „group-label”.',
      },
      {
        name: 'shortcut',
        description: 'Treść osadzana w nazwanym slocie „shortcut”.',
      },
    ],
  },
  {
    category: 'navigation',
    categoryLabel: 'Nawigacja',
    name: 'NavigationCard',
    sourceName: 'NavigationCard',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/navigation/NavigationCard',
    tagName: 'peaui-navigation-card',
    status: 'stable',
    props: [
      {
        name: 'title',
        type: 'string',
        required: true,
        description:
          'Główny tytuł prezentowany w komponencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'path',
        type: 'string',
        required: false,
        description:
          'Konfiguruje właściwość „path” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'description',
        type: 'string',
        required: true,
        description:
          'Dodatkowy opis objaśniający zawartość albo stan komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'size',
        type: "'s' | 'm' | 'l'",
        required: false,
        default: 's',
        description:
          'Wariant rozmiaru komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'variant',
        type: "'default' | 'complete' | 'during' | 'disabled' | 'hidden'",
        required: false,
        default: 'default',
        description:
          'Wariant wizualny komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [],
    events: [],
    slots: [],
  },
  {
    category: 'navigation',
    categoryLabel: 'Nawigacja',
    name: 'NavigationDisclosureCard',
    sourceName: 'NavigationDisclosureCard',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/navigation/NavigationDisclosureCard',
    tagName: 'peaui-navigation-disclosure-card',
    status: 'stable',
    props: [
      {
        name: 'title',
        type: 'string',
        required: true,
        description:
          'Główny tytuł prezentowany w komponencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'description',
        type: 'string',
        required: true,
        description:
          'Dodatkowy opis objaśniający zawartość albo stan komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'id',
        type: 'string',
        required: true,
        description:
          'Unikalny identyfikator elementu w dokumencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'path',
        type: 'string',
        required: false,
        description:
          'Konfiguruje właściwość „path” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Steruje widocznością rozwijanego elementu albo warstwy. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'title-additional',
        description: 'Treść osadzana w nazwanym slocie „title-additional”.',
      },
      {
        name: 'description-additional',
        description: 'Treść osadzana w nazwanym slocie „description-additional”.',
      },
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
    ],
  },
  {
    category: 'navigation',
    categoryLabel: 'Nawigacja',
    name: 'NavigationIconCard',
    sourceName: 'NavigationIconCard',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/navigation/NavigationIconCard',
    tagName: 'peaui-navigation-icon-card',
    status: 'stable',
    props: [
      {
        name: 'icon',
        type: 'string',
        required: false,
        default: 'info',
        description:
          'Nazwa ikony prezentowanej przez komponent. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'text',
        type: 'string',
        required: false,
        default: '',
        description:
          'Konfiguruje właściwość „text” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'path',
        type: 'string',
        required: false,
        default: '',
        description:
          'Konfiguruje właściwość „path” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [],
    events: [],
    slots: [],
  },
  {
    category: 'navigation',
    categoryLabel: 'Nawigacja',
    name: 'NavigationLink',
    sourceName: 'NavigationLink',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/navigation/NavigationLink',
    tagName: 'peaui-navigation-link',
    status: 'stable',
    props: [
      {
        name: 'path',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „path” konfigurujący komponent NavigationLink.',
      },
      {
        name: 'size',
        type: 'NavigationLinkSize',
        required: false,
        description: 'Wariant rozmiaru komponentu.',
      },
      {
        name: 'variant',
        type: 'NavigationLinkVariant',
        required: false,
        description: 'Wariant wizualny komponentu.',
      },
      {
        name: 'aria-label',
        type: 'string | null',
        required: false,
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „data-testid” konfigurujący komponent NavigationLink.',
      },
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
    ],
  },
  {
    category: 'navigation',
    categoryLabel: 'Nawigacja',
    name: 'NavigationStepper',
    sourceName: 'NavigationStepper',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/navigation/NavigationStepper',
    tagName: 'peaui-navigation-stepper',
    status: 'stable',
    props: [
      {
        name: 'options',
        type: 'NavStepper[]',
        required: false,
        default: '[]',
        description:
          'Lista opcji dostępnych do wyświetlenia lub wyboru. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: 'Nawigacja kroków',
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [],
    events: [
      {
        name: 'on:select',
        description: 'Emitowane po wybraniu elementu.',
      },
    ],
    slots: [],
  },
  {
    category: 'navigation',
    categoryLabel: 'Nawigacja',
    name: 'NavigationTabs',
    sourceName: 'NavigationTabs',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/navigation/NavigationTabs',
    tagName: 'peaui-navigation-tabs',
    status: 'stable',
    props: [
      {
        name: 'tabs',
        type: 'Tab[]',
        required: false,
        default: '[]',
        description:
          'Konfiguruje właściwość „tabs” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: true,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'with-backround',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „with backround” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [],
    events: [
      {
        name: 'on:select',
        description: 'Emitowane po wybraniu elementu.',
      },
    ],
    slots: [
      {
        name: 'getSlotName(tab.key, ',
        description: 'Treść osadzana w nazwanym slocie „getSlotName(tab.key, ”.',
      },
    ],
  },
  {
    category: 'navigation',
    categoryLabel: 'Nawigacja',
    name: 'PaginationControl',
    sourceName: 'PaginationControl',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/navigation/PaginationControl',
    tagName: 'peaui-pagination-control',
    status: 'stable',
    props: [
      {
        name: 'aria-label',
        type: 'string',
        required: true,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'total-pages',
        type: 'number',
        required: true,
        description:
          'Łączna liczba stron dostępnych w paginacji. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'page',
        type: 'number',
        required: true,
        default: '1',
        description:
          'Aktualna strona kontrolowana przez v-model:page. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'update:page',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „page”.',
      },
    ],
    slots: [],
  },
  {
    category: 'overlayer',
    categoryLabel: 'Warstwy i okna',
    name: 'DrawerPanel',
    sourceName: 'DrawerPanel',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/overlayer/DrawerPanel',
    tagName: 'peaui-drawer-panel',
    status: 'stable',
    props: [
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: true,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'open',
        type: 'boolean',
        required: true,
        description:
          'Stan otwarcia kontrolowany przez v-model:open. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'update:open',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „open”.',
      },
    ],
    slots: [
      {
        name: 'header',
        description: 'Treść osadzana w nazwanym slocie „header”.',
      },
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
    ],
  },
  {
    category: 'overlayer',
    categoryLabel: 'Warstwy i okna',
    name: 'InfoTooltip',
    sourceName: 'InfoTooltip',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/overlayer/InfoTooltip',
    tagName: 'peaui-info-tooltip',
    status: 'stable',
    props: [
      {
        name: 'placement',
        type: 'Placement',
        required: false,
        description: 'Atrybut HTML „placement” konfigurujący komponent InfoTooltip.',
      },
      {
        name: 'variant',
        type: 'Variant',
        required: false,
        description: 'Wariant wizualny komponentu.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description: 'Wyłącza komponent i blokuje jego interakcje.',
      },
      {
        name: 'data-test-id',
        type: 'string | undefined',
        required: false,
        description: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „data-testid” konfigurujący komponent InfoTooltip.',
      },
      {
        name: 'role',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „role” konfigurujący komponent InfoTooltip.',
      },
      {
        name: 'tabindex',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „tabindex” konfigurujący komponent InfoTooltip.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description: 'Dostępna nazwa elementu przekazywana przez aria-label.',
      },
      {
        name: 'aria-labelledby',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „aria-labelledby” konfigurujący komponent InfoTooltip.',
      },
      {
        name: 'aria-describedby',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „aria-describedby” konfigurujący komponent InfoTooltip.',
      },
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
      {
        name: 'title',
        description: 'Treść osadzana w nazwanym slocie „title”.',
      },
      {
        name: 'description',
        description: 'Treść osadzana w nazwanym slocie „description”.',
      },
    ],
  },
  {
    category: 'overlayer',
    categoryLabel: 'Warstwy i okna',
    name: 'ModalDialog',
    sourceName: 'ModalDialog',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/overlayer/ModalDialog',
    tagName: 'peaui-modal-dialog',
    status: 'stable',
    props: [
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: true,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [
      {
        name: 'open',
        type: 'boolean',
        required: true,
        description:
          'Stan otwarcia kontrolowany przez v-model:open. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    events: [
      {
        name: 'update:open',
        description: 'Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „open”.',
      },
    ],
    slots: [
      {
        name: 'header',
        description: 'Treść osadzana w nazwanym slocie „header”.',
      },
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
    ],
  },
  {
    category: 'overlayer',
    categoryLabel: 'Warstwy i okna',
    name: 'PopoverButton',
    sourceName: 'PopoverButton',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/overlayer/PopoverButton',
    tagName: 'peaui-popover-button',
    status: 'stable',
    props: [
      {
        name: 'size',
        type: "'xs' | 's' | 'm' | 'l'",
        required: false,
        default: 'm',
        description:
          'Wariant rozmiaru komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'ghost' | 'danger'",
        required: false,
        default: 'primary',
        description:
          'Wariant wizualny komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'placement',
        type: "| 'top'\n  | 'right'\n  | 'bottom'\n  | 'left'\n  | 'top-left'\n  | 'top-right'\n  | 'bottom-left'\n  | 'bottom-right'",
        required: false,
        default: 'top',
        description:
          'Konfiguruje właściwość „placement” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'match-trigger-width',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „match trigger width” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'popup-type',
        type: "'menu' | 'listbox' | 'tree' | 'grid' | 'dialog' | 'true'",
        required: false,
        description:
          'Konfiguruje właściwość „popup type” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'use-aria-label',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „use aria label” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [],
    events: [
      {
        name: 'keydown',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „keydown”.',
      },
      {
        name: 'pointerdown',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „pointerdown”.',
      },
    ],
    slots: [
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
      {
        name: 'content',
        description: 'Treść osadzana w nazwanym slocie „content”.',
      },
    ],
  },
  {
    category: 'overlayer',
    categoryLabel: 'Warstwy i okna',
    name: 'PopoverOverlayer',
    sourceName: 'PopoverOverlayer',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/overlayer/PopoverOverlayer',
    tagName: 'peaui-popover-overlayer',
    status: 'stable',
    props: [
      {
        name: 'placement',
        type: "| 'top'\n  | 'right'\n  | 'bottom'\n  | 'left'\n  | 'top-left'\n  | 'top-right'\n  | 'bottom-left'\n  | 'bottom-right'",
        required: false,
        default: 'top',
        description:
          'Konfiguruje właściwość „placement” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'content-class',
        type: 'string',
        required: false,
        description:
          'Konfiguruje właściwość „content class” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'manage-trigger-accessibility',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „manage trigger accessibility” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'match-trigger-width',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „match trigger width” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
      {
        name: 'popup-type',
        type: "'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'",
        required: false,
        description:
          'Konfiguruje właściwość „popup type” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.',
      },
    ],
    models: [],
    events: [
      {
        name: 'update:open',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „update:open”.',
      },
    ],
    slots: [
      {
        name: 'default',
        description: 'Główna treść przekazywana do komponentu.',
      },
      {
        name: 'content',
        description: 'Treść osadzana w nazwanym slocie „content”.',
      },
    ],
  },
] as const satisfies readonly FrameworkComponentApi[];
