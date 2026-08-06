// Ten plik jest generowany przez scripts/generate-component-api.mjs.
// Nie edytuj go ręcznie — źródłem prawdy są implementacje React i Web Components.

import type { FrameworkComponentApi } from '../types';

export const generatedReactComponentApi = [
  {
    "category": "basic",
    "categoryLabel": "Podstawowe",
    "name": "ImageView",
    "sourceName": "ImageView",
    "framework": "react",
    "importPath": "@peaui/ui/react/basic/ImageView",
    "status": "stable",
    "props": [
      {
        "name": "alt",
        "type": "string",
        "required": false,
        "description": "Alternatywny opis obrazu używany przez technologie asystujące."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "max",
        "type": "string",
        "required": false,
        "description": "Maksymalna dozwolona wartość albo szerokość."
      },
      {
        "name": "size",
        "type": "'auto' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'full'",
        "required": false,
        "default": "auto",
        "description": "Wariant rozmiaru komponentu."
      },
      {
        "name": "src",
        "type": "string",
        "required": false,
        "description": "Adres źródłowy obrazu albo innego zasobu."
      }
    ],
    "models": [],
    "events": [],
    "slots": []
  },
  {
    "category": "basic",
    "categoryLabel": "Podstawowe",
    "name": "PhotoEditor",
    "sourceName": "PhotoEditior",
    "framework": "react",
    "importPath": "@peaui/ui/react/basic/PhotoEditor",
    "status": "stable",
    "props": [
      {
        "name": "ariaLabel",
        "type": "string",
        "required": false,
        "default": "Edytor zdjęcia",
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      }
    ],
    "models": [
      {
        "name": "image",
        "type": "PhotoType | undefined",
        "required": false,
        "description": "Edytowany obraz kontrolowany przez v-model:image. W React dostępne są propsy image, defaultImage i onImageChange."
      }
    ],
    "events": [
      {
        "name": "onCancel",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:cancel”. W React przekaż callback onCancel."
      }
    ],
    "slots": []
  },
  {
    "category": "basic",
    "categoryLabel": "Podstawowe",
    "name": "SvgIcon",
    "sourceName": "SvgIcon",
    "framework": "react",
    "importPath": "@peaui/ui/react/basic/SvgIcon",
    "status": "stable",
    "props": [
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Nazwa pola używana przez formularz lub nazwa zasobu."
      }
    ],
    "models": [],
    "events": [],
    "slots": []
  },
  {
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "name": "Avatar",
    "sourceName": "Avatar",
    "framework": "react",
    "importPath": "@peaui/ui/react/data-display/Avatar",
    "status": "stable",
    "props": [
      {
        "name": "src",
        "type": "string",
        "required": false,
        "description": "Adres obrazu prezentowanego w awatarze."
      },
      {
        "name": "alt",
        "type": "string",
        "required": false,
        "description": "Alternatywny opis obrazu. Pusty tekst oznacza obraz dekoracyjny."
      },
      {
        "name": "name",
        "type": "string",
        "required": false,
        "description": "Nazwa używana do wyliczenia inicjałów i nazwy dostępnej fallbacku."
      },
      {
        "name": "initials",
        "type": "string",
        "required": false,
        "description": "Jawne inicjały mają pierwszeństwo przed inicjałami wyliczonymi z name."
      },
      {
        "name": "size",
        "type": "'xs' | 's' | 'm' | 'l' | 'xl'",
        "required": false,
        "default": "m",
        "description": "Wariant rozmiaru awatara."
      },
      {
        "name": "shape",
        "type": "'circle' | 'rounded'",
        "required": false,
        "default": "circle",
        "description": "Kształt awatara."
      },
      {
        "name": "status",
        "type": "'online' | 'offline' | 'away' | 'busy' | 'none'",
        "required": false,
        "default": "none",
        "description": "Status obecności prezentowany wizualnie i tekstowo."
      },
      {
        "name": "statusLabel",
        "type": "string",
        "required": false,
        "description": "Własna dostępna etykieta statusu."
      },
      {
        "name": "loading",
        "type": "'eager' | 'lazy'",
        "required": false,
        "default": "lazy",
        "description": "Strategia ładowania natywnego obrazu."
      },
      {
        "name": "fallbackIcon",
        "type": "string",
        "required": false,
        "default": "users",
        "description": "Nazwa ikony używanej, gdy obraz i inicjały nie są dostępne."
      },
      {
        "name": "interactive",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Renderuje semantyczny przycisk zamiast prezentacyjnego awatara."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Wyłącza interaktywny awatar."
      },
      {
        "name": "ariaLabel",
        "type": "string",
        "required": false,
        "description": "Dostępna nazwa awatara lub przycisku."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator używany w testach automatycznych."
      }
    ],
    "models": [],
    "events": [
      {
        "name": "onLoad",
        "description": "Emitowane po poprawnym załadowaniu obrazu. W React przekaż callback onLoad."
      },
      {
        "name": "onError",
        "description": "Emitowane, gdy nie udało się załadować obrazu. W React przekaż callback onError."
      }
    ],
    "slots": [
      {
        "name": "children",
        "description": "Główna treść React przekazywana przez children."
      },
      {
        "name": "statusContent",
        "description": "Treść osadzana w nazwanym slocie „status”. W React jest to prop ReactNode „statusContent”."
      }
    ]
  },
  {
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "name": "AvatarGroup",
    "sourceName": "AvatarGroup",
    "framework": "react",
    "importPath": "@peaui/ui/react/data-display/AvatarGroup",
    "status": "stable",
    "props": [
      {
        "name": "items",
        "type": "AvatarGroupItem[]",
        "required": false,
        "default": "[]",
        "description": "Osoby prezentowane w stabilnej kolejności wejściowej."
      },
      {
        "name": "maxVisible",
        "type": "number",
        "required": false,
        "default": "3",
        "description": "Maksymalna liczba awatarów widocznych przed licznikiem nadmiaru."
      },
      {
        "name": "size",
        "type": "'xs' | 's' | 'm' | 'l' | 'xl'",
        "required": false,
        "default": "m",
        "description": "Rozmiar awatarów i licznika."
      },
      {
        "name": "shape",
        "type": "'circle' | 'rounded'",
        "required": false,
        "default": "circle",
        "description": "Kształt awatarów i licznika."
      },
      {
        "name": "overlap",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Włącza kompaktowy układ z nachodzącymi na siebie elementami."
      },
      {
        "name": "direction",
        "type": "'start' | 'end'",
        "required": false,
        "default": "end",
        "description": "Określa, która krawędź stosu znajduje się wizualnie na wierzchu."
      },
      {
        "name": "overflowMode",
        "type": "'count' | 'popover' | 'none'",
        "required": false,
        "default": "count",
        "description": "Sposób prezentacji pozycji poza limitem."
      },
      {
        "name": "itemKey",
        "type": "keyof AvatarGroupItem | ((item: AvatarGroupItem, index: number) => string | number)",
        "required": false,
        "default": "id",
        "description": "Pole lub funkcja zwracająca stabilny klucz elementu."
      },
      {
        "name": "ariaLabel",
        "type": "string",
        "required": false,
        "default": "Członkowie grupy",
        "description": "Dostępna nazwa listy widocznych osób."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Wyłącza wszystkie akcje grupy."
      },
      {
        "name": "loading",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Sygnalizuje ładowanie szczegółowej listy w popoverze."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator używany w testach automatycznych."
      }
    ],
    "models": [
      {
        "name": "open",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Stan otwarcia kontrolowany przez v-model:open. W React dostępne są propsy open, defaultOpen i onOpenChange."
      }
    ],
    "events": [
      {
        "name": "onSelect",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „select”. W React przekaż callback onSelect."
      },
      {
        "name": "onOverflowClick",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „overflowClick”. W React przekaż callback onOverflowClick."
      }
    ],
    "slots": [
      {
        "name": "renderItem",
        "description": "Treść osadzana w nazwanym slocie „item”. W React jest to prop ReactNode „renderItem”."
      },
      {
        "name": "renderOverflow",
        "description": "Treść osadzana w nazwanym slocie „overflow”. W React jest to prop ReactNode „renderOverflow”."
      },
      {
        "name": "popoverHeader",
        "description": "Treść osadzana w nazwanym slocie „popover-header”. W React jest to prop ReactNode „popoverHeader”."
      },
      {
        "name": "renderPopoverItem",
        "description": "Treść osadzana w nazwanym slocie „popover-item”. W React jest to prop ReactNode „renderPopoverItem”."
      },
      {
        "name": "empty",
        "description": "Treść osadzana w nazwanym slocie „empty”. W React jest to prop ReactNode „empty”."
      }
    ]
  },
  {
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "name": "CalculationResults",
    "sourceName": "CalculationResults",
    "framework": "react",
    "importPath": "@peaui/ui/react/data-display/CalculationResults",
    "status": "stable",
    "props": [
      {
        "name": "isLoading",
        "type": "boolean",
        "required": false,
        "description": "Włącza stan ładowania i informuje o trwającej operacji."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje."
      },
      {
        "name": "result",
        "type": "string",
        "required": false,
        "default": "-/-",
        "description": "Konfiguruje właściwość „result” komponentu."
      },
      {
        "name": "label",
        "type": "string",
        "required": true,
        "description": "Widoczna etykieta opisująca element lub pole formularza."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "isSimple",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „is simple” komponentu."
      },
      {
        "name": "showCalculateButton",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Konfiguruje właściwość „show calculate button” komponentu."
      }
    ],
    "models": [],
    "events": [
      {
        "name": "onSimulate",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:simulate”. W React przekaż callback onSimulate."
      }
    ],
    "slots": [
      {
        "name": "additional",
        "description": "Treść osadzana w nazwanym slocie „additional”. W React jest to prop ReactNode „additional”."
      },
      {
        "name": "hint",
        "description": "Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”."
      }
    ]
  },
  {
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "name": "CardCarousel",
    "sourceName": "CardCarousel",
    "framework": "react",
    "importPath": "@peaui/ui/react/data-display/CardCarousel",
    "status": "stable",
    "props": [
      {
        "name": "ariaLabel",
        "type": "string",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      },
      {
        "name": "animationDelay",
        "type": "number",
        "required": false,
        "default": "2000",
        "description": "Konfiguruje właściwość „animation delay” komponentu."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "defaultVisibleSlides",
        "type": "number",
        "required": false,
        "description": "Konfiguruje właściwość „default visible slides” komponentu."
      },
      {
        "name": "defualtVisibleSlides",
        "type": "number",
        "required": false,
        "description": "Konfiguruje właściwość „defualt visible slides” komponentu."
      },
      {
        "name": "isNavigationDotsVisible",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Konfiguruje właściwość „is navigation dots visible” komponentu."
      },
      {
        "name": "isNavigationVisible",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Konfiguruje właściwość „is navigation visible” komponentu."
      },
      {
        "name": "withAnimation",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „with animation” komponentu."
      }
    ],
    "models": [],
    "events": [],
    "slots": []
  },
  {
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "name": "CounterBadge",
    "sourceName": "CounterBadge",
    "framework": "react",
    "importPath": "@peaui/ui/react/data-display/CounterBadge",
    "status": "stable",
    "props": [
      {
        "name": "value",
        "type": "number",
        "required": true,
        "description": "Bieżąca wartość kontrolowana przez v-model."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "variant",
        "type": "'info' | 'error' | 'success' | 'danger'",
        "required": false,
        "default": "info",
        "description": "Wariant wizualny komponentu."
      },
      {
        "name": "size",
        "type": "'s' | 'm' | 'l'",
        "required": false,
        "default": "s",
        "description": "Wariant rozmiaru komponentu."
      }
    ],
    "models": [],
    "events": [],
    "slots": []
  },
  {
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "name": "DescriptionField",
    "sourceName": "DescriptionField",
    "framework": "react",
    "importPath": "@peaui/ui/react/data-display/DescriptionField",
    "status": "stable",
    "props": [
      {
        "name": "label",
        "type": "string",
        "required": true,
        "description": "Widoczna etykieta opisująca element lub pole formularza."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      }
    ],
    "models": [],
    "events": [],
    "slots": [
      {
        "name": "additionalBefore",
        "description": "Treść osadzana w nazwanym slocie „additional-before”. W React jest to prop ReactNode „additionalBefore”."
      },
      {
        "name": "hint",
        "description": "Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”."
      },
      {
        "name": "children",
        "description": "Główna treść React przekazywana przez children."
      },
      {
        "name": "additionalAfter",
        "description": "Treść osadzana w nazwanym slocie „additional-after”. W React jest to prop ReactNode „additionalAfter”."
      }
    ]
  },
  {
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "name": "DisclosurePanel",
    "sourceName": "DisclosurePanel",
    "framework": "react",
    "importPath": "@peaui/ui/react/data-display/DisclosurePanel",
    "status": "stable",
    "props": [
      {
        "name": "title",
        "type": "string",
        "required": false,
        "description": "Główny tytuł prezentowany w komponencie."
      },
      {
        "name": "ariaLabel",
        "type": "string",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Wyłącza komponent i blokuje jego interakcje."
      },
      {
        "name": "allwaysOpen",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „allways open” komponentu."
      }
    ],
    "models": [
      {
        "name": "open",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Stan otwarcia kontrolowany przez v-model:open. W React dostępne są propsy open, defaultOpen i onOpenChange."
      }
    ],
    "events": [],
    "slots": [
      {
        "name": "title",
        "description": "Treść osadzana w nazwanym slocie „title”. W React jest to prop ReactNode „title”."
      },
      {
        "name": "additional",
        "description": "Treść osadzana w nazwanym slocie „additional”. W React jest to prop ReactNode „additional”."
      },
      {
        "name": "children",
        "description": "Główna treść React przekazywana przez children."
      }
    ]
  },
  {
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "name": "SectionHeading",
    "sourceName": "SectionHeading",
    "framework": "react",
    "importPath": "@peaui/ui/react/data-display/SectionHeading",
    "status": "stable",
    "props": [
      {
        "name": "size",
        "type": "'heading-l' | 'heading-m' | 'heading-s' | 'heading-xs' | 'xl' | 'l' | 'm' | 's'",
        "required": false,
        "default": "l",
        "description": "Wariant rozmiaru komponentu."
      },
      {
        "name": "as",
        "type": "'section' | 'div' | 'header'",
        "required": false,
        "default": "div",
        "description": "Konfiguruje właściwość „as” komponentu."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "variant",
        "type": "'default' | 'primary' | 'secondary'",
        "required": false,
        "default": "default",
        "description": "Wariant wizualny komponentu."
      }
    ],
    "models": [],
    "events": [],
    "slots": [
      {
        "name": "title",
        "description": "Treść osadzana w nazwanym slocie „title”. W React jest to prop ReactNode „title”."
      },
      {
        "name": "hint",
        "description": "Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”."
      },
      {
        "name": "description",
        "description": "Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „description”."
      }
    ]
  },
  {
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "name": "TableList",
    "sourceName": "TableList",
    "framework": "react",
    "importPath": "@peaui/ui/react/data-display/TableList",
    "status": "stable",
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": false,
        "default": "list",
        "description": "Unikalny identyfikator elementu w dokumencie."
      },
      {
        "name": "ariaLabel",
        "type": "string",
        "required": false,
        "default": "Tabela danych",
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      },
      {
        "name": "isDetials",
        "type": "boolean",
        "required": false,
        "description": "Konfiguruje właściwość „is detials” komponentu."
      },
      {
        "name": "additional",
        "type": "Record<string, any>",
        "required": false,
        "description": "Konfiguruje właściwość „additional” komponentu."
      },
      {
        "name": "canCreate",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Włącza możliwość dodawania nowych rekordów."
      },
      {
        "name": "canSelectRows",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Włącza możliwość zaznaczania wierszy."
      },
      {
        "name": "canCheckRows",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „can check rows” komponentu."
      },
      {
        "name": "canHideColumns",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Pozwala użytkownikowi sterować widocznością kolumn."
      },
      {
        "name": "canMultiSort",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „can multi sort” komponentu."
      },
      {
        "name": "columns",
        "type": "TableColumn[] | any[]",
        "required": true,
        "description": "Definicje kolumn określające ich etykiety, klucze i sposób renderowania."
      },
      {
        "name": "editable",
        "type": "boolean",
        "required": false,
        "description": "Włącza tryb edycji danych."
      },
      {
        "name": "emptyDescription",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Konfiguruje właściwość „empty description” komponentu."
      },
      {
        "name": "emptyDescriptionInline",
        "type": "string",
        "required": false,
        "description": "Konfiguruje właściwość „empty description inline” komponentu."
      },
      {
        "name": "records",
        "type": "any[]",
        "required": true,
        "description": "Kolekcja rekordów prezentowanych przez komponent."
      },
      {
        "name": "rowsPerPage",
        "type": "number",
        "required": false,
        "default": "10",
        "description": "Liczba rekordów wyświetlanych na jednej stronie."
      },
      {
        "name": "currentCheckedRow",
        "type": "number | string",
        "required": false,
        "description": "Konfiguruje właściwość „current checked row” komponentu."
      },
      {
        "name": "rowsTotal",
        "type": "number",
        "required": false,
        "description": "Konfiguruje właściwość „rows total” komponentu."
      },
      {
        "name": "selectedRows",
        "type": "string[]",
        "required": false,
        "default": "[]",
        "description": "Identyfikatory aktualnie zaznaczonych wierszy."
      },
      {
        "name": "sortColumn",
        "type": "string",
        "required": false,
        "default": "updatedAt",
        "description": "Konfiguruje właściwość „sort column” komponentu."
      },
      {
        "name": "sortColumns",
        "type": "TableSortState[]",
        "required": false,
        "default": "[]",
        "description": "Konfiguruje właściwość „sort columns” komponentu."
      },
      {
        "name": "sortType",
        "type": "TableSortDirection",
        "required": false,
        "default": "DESC",
        "description": "Konfiguruje właściwość „sort type” komponentu."
      },
      {
        "name": "buttonEditableCreateText",
        "type": "string",
        "required": false,
        "default": "Dodaj",
        "description": "Konfiguruje właściwość „button editable create text” komponentu."
      },
      {
        "name": "titleRemoveLabel",
        "type": "string",
        "required": false,
        "default": "Czy na pewno chcesz usunąć wybrany rekord?",
        "description": "Konfiguruje właściwość „title remove label” komponentu."
      },
      {
        "name": "descriptionRemoveLabel",
        "type": "string",
        "required": false,
        "default": "Usunięcie spowoduje trwałe usunięcie rekordu.",
        "description": "Konfiguruje właściwość „description remove label” komponentu."
      },
      {
        "name": "isLoading",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Włącza stan ładowania i informuje o trwającej operacji."
      },
      {
        "name": "scroll",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „scroll” komponentu."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      }
    ],
    "models": [],
    "events": [
      {
        "name": "onAction",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:action”. W React przekaż callback onAction."
      },
      {
        "name": "onCreateRecord",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:createRecord”. W React przekaż callback onCreateRecord."
      },
      {
        "name": "onRowDoubleClick",
        "description": "Emitowane po dwukrotnym kliknięciu wiersza; przekazuje identyfikator i rekord. W React przekaż callback onRowDoubleClick."
      },
      {
        "name": "onDbclick",
        "description": "Przestarzała nazwa zdarzenia dwukrotnego kliknięcia. Użyj „on:dblclick”. W React przekaż callback onDbclick."
      },
      {
        "name": "onSelectRow",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:select:row”. W React przekaż callback onSelectRow."
      },
      {
        "name": "onSort",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:sort”. W React przekaż callback onSort."
      },
      {
        "name": "onCancel",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:cancel”. W React przekaż callback onCancel."
      },
      {
        "name": "onCheckRow",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:check:row”. W React przekaż callback onCheckRow."
      },
      {
        "name": "onSubmit",
        "description": "Emitowane po zatwierdzeniu danych. W React przekaż callback onSubmit."
      },
      {
        "name": "onChangeValue",
        "description": "Emitowane po zmianie wartości komórki; przekazuje identyfikator rekordu i nową wartość. W React przekaż callback onChangeValue."
      }
    ],
    "slots": [
      {
        "name": "renderCell",
        "description": "Funkcja renderCell pozwala renderować niestandardową zawartość komórki tabeli."
      },
      {
        "name": "detialsRecord",
        "description": "Treść osadzana w nazwanym slocie „detials-record”. W React jest to prop ReactNode „detialsRecord”."
      },
      {
        "name": "additionalRow",
        "description": "Treść osadzana w nazwanym slocie „additionalRow”. W React jest to prop ReactNode „additionalRow”."
      }
    ]
  },
  {
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "name": "TableListFooter",
    "sourceName": "TableListFooter",
    "framework": "react",
    "importPath": "@peaui/ui/react/data-display/TableListFooter",
    "status": "stable",
    "props": [
      {
        "name": "rowsNumber",
        "type": "number",
        "required": true,
        "description": "Konfiguruje właściwość „rows number” komponentu."
      },
      {
        "name": "rowsPerPage",
        "type": "number",
        "required": true,
        "description": "Liczba rekordów wyświetlanych na jednej stronie."
      },
      {
        "name": "page",
        "type": "number",
        "required": true,
        "description": "Numer aktualnie wybranej strony."
      },
      {
        "name": "total",
        "type": "number",
        "required": true,
        "description": "Łączna liczba elementów."
      },
      {
        "name": "under",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „under” komponentu."
      },
      {
        "name": "isFlex",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „is flex” komponentu."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      }
    ],
    "models": [],
    "events": [
      {
        "name": "onChangePage",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:change:page”. W React przekaż callback onChangePage."
      },
      {
        "name": "onChangeLimit",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:change:limit”. W React przekaż callback onChangeLimit."
      }
    ],
    "slots": []
  },
  {
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "name": "TableListHeader",
    "sourceName": "TableListHeader",
    "framework": "react",
    "importPath": "@peaui/ui/react/data-display/TableListHeader",
    "status": "stable",
    "props": [
      {
        "name": "buttonCreateLabel",
        "type": "string",
        "required": false,
        "default": "Dodaj rekord",
        "description": "Konfiguruje właściwość „button create label” komponentu."
      },
      {
        "name": "canCreate",
        "type": "boolean",
        "required": false,
        "description": "Włącza możliwość dodawania nowych rekordów."
      },
      {
        "name": "canExport",
        "type": "boolean",
        "required": false,
        "description": "Konfiguruje właściwość „can export” komponentu."
      },
      {
        "name": "canFilter",
        "type": "boolean",
        "required": false,
        "description": "Konfiguruje właściwość „can filter” komponentu."
      },
      {
        "name": "canSearch",
        "type": "boolean",
        "required": false,
        "description": "Konfiguruje właściwość „can search” komponentu."
      },
      {
        "name": "countFilters",
        "type": "number",
        "required": false,
        "description": "Konfiguruje właściwość „count filters” komponentu."
      },
      {
        "name": "countSelectedRecords",
        "type": "number",
        "required": false,
        "description": "Konfiguruje właściwość „count selected records” komponentu."
      },
      {
        "name": "searchPlaceholder",
        "type": "string",
        "required": false,
        "description": "Konfiguruje właściwość „search placeholder” komponentu."
      },
      {
        "name": "totalRecords",
        "type": "number",
        "required": false,
        "description": "Konfiguruje właściwość „total records” komponentu."
      },
      {
        "name": "userId",
        "type": "string",
        "required": false,
        "description": "Konfiguruje właściwość „user id” komponentu."
      },
      {
        "name": "forceExport",
        "type": "boolean",
        "required": false,
        "description": "Konfiguruje właściwość „force export” komponentu."
      }
    ],
    "models": [
      {
        "name": "filtersOpen",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Wartość kontrolowana przez v-model:filters-open. W React dostępne są propsy filtersOpen, defaultFiltersOpen i onFiltersOpenChange."
      }
    ],
    "events": [
      {
        "name": "onSearch",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:search”. W React przekaż callback onSearch."
      },
      {
        "name": "onResetFilters",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:reset-filters”. W React przekaż callback onResetFilters."
      },
      {
        "name": "onCreate",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:create”. W React przekaż callback onCreate."
      },
      {
        "name": "onExport",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:export”. W React przekaż callback onExport."
      }
    ],
    "slots": [
      {
        "name": "filtersDrawer",
        "description": "Treść osadzana w nazwanym slocie „filters-drawer”. W React jest to prop ReactNode „filtersDrawer”."
      },
      {
        "name": "additionalButtons",
        "description": "Treść osadzana w nazwanym slocie „additional-buttons”. W React jest to prop ReactNode „additionalButtons”."
      },
      {
        "name": "addtionalContent",
        "description": "Treść osadzana w nazwanym slocie „addtional-content”. W React jest to prop ReactNode „addtionalContent”."
      },
      {
        "name": "addtionalDescription",
        "description": "Treść osadzana w nazwanym slocie „addtional-description”. W React jest to prop ReactNode „addtionalDescription”."
      }
    ]
  },
  {
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "name": "TagChip",
    "sourceName": "TagChip",
    "framework": "react",
    "importPath": "@peaui/ui/react/data-display/TagChip",
    "status": "stable",
    "props": [
      {
        "name": "size",
        "type": "'xxs' | 'xs' | 's'",
        "required": false,
        "default": "xs",
        "description": "Wariant rozmiaru komponentu."
      },
      {
        "name": "variant",
        "type": "'blue' | 'green' | 'red' | 'orange' | 'grey' | 'violet' | 'outline'",
        "required": false,
        "default": "outline",
        "description": "Wariant wizualny komponentu."
      },
      {
        "name": "active",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Określa aktywny element albo aktywny krok."
      },
      {
        "name": "label",
        "type": "string",
        "required": true,
        "description": "Widoczna etykieta opisująca element lub pole formularza."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "as",
        "type": "'span' | 'button'",
        "required": false,
        "default": "button",
        "description": "Konfiguruje właściwość „as” komponentu."
      }
    ],
    "models": [],
    "events": [],
    "slots": []
  },
  {
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "name": "TreeList",
    "sourceName": "TreeList",
    "framework": "react",
    "importPath": "@peaui/ui/react/data-display/TreeList",
    "status": "stable",
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": false,
        "description": "Unikalny identyfikator elementu w dokumencie."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Wyłącza komponent i blokuje jego interakcje."
      },
      {
        "name": "level",
        "type": "number",
        "required": false,
        "default": "1",
        "description": "Konfiguruje właściwość „level” komponentu."
      },
      {
        "name": "isLast",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „is last” komponentu."
      },
      {
        "name": "canRemove",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „can remove” komponentu."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      }
    ],
    "models": [
      {
        "name": "tree",
        "type": "TreeListType",
        "required": false,
        "description": "Dane drzewa kontrolowane przez v-model:tree. W React dostępne są propsy tree, defaultTree i onTreeChange."
      }
    ],
    "events": [
      {
        "name": "onRemove",
        "description": "Emitowane po wybraniu akcji usunięcia. W React przekaż callback onRemove."
      }
    ],
    "slots": [
      {
        "name": "children",
        "description": "Główna treść React przekazywana przez children."
      }
    ]
  },
  {
    "category": "data-entry",
    "categoryLabel": "Wprowadzanie danych",
    "name": "ButtonAction",
    "sourceName": "ButtonAction",
    "framework": "react",
    "importPath": "@peaui/ui/react/data-entry/ButtonAction",
    "status": "stable",
    "props": [
      {
        "name": "size",
        "type": "'xxs' | 'xs' | 's' | 'm' | 'l'",
        "required": false,
        "default": "m",
        "description": "Wariant rozmiaru komponentu."
      },
      {
        "name": "variant",
        "type": "'primary' | 'secondary' | 'ghost' | 'danger'",
        "required": false,
        "default": "primary",
        "description": "Wariant wizualny komponentu."
      },
      {
        "name": "type",
        "type": "'button' | 'submit' | 'reset'",
        "required": false,
        "default": "button",
        "description": "Wariant funkcjonalny lub wizualny komponentu."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Wyłącza komponent i blokuje jego interakcje."
      },
      {
        "name": "ariaLabel",
        "type": "string",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "useAriaLabel",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „use aria label” komponentu."
      }
    ],
    "models": [],
    "events": [],
    "slots": [
      {
        "name": "children",
        "description": "Główna treść React przekazywana przez children."
      }
    ]
  },
  {
    "category": "data-entry",
    "categoryLabel": "Wprowadzanie danych",
    "name": "ButtonExport",
    "sourceName": "ButtonExport",
    "framework": "react",
    "importPath": "@peaui/ui/react/data-entry/ButtonExport",
    "status": "stable",
    "props": [
      {
        "name": "size",
        "type": "'xs' | 's' | 'm' | 'l'",
        "required": false,
        "default": "m",
        "description": "Wariant rozmiaru komponentu."
      },
      {
        "name": "variant",
        "type": "'primary' | 'secondary' | 'ghost' | 'danger'",
        "required": false,
        "default": "secondary",
        "description": "Wariant wizualny komponentu."
      },
      {
        "name": "type",
        "type": "'button' | 'submit' | 'reset'",
        "required": false,
        "description": "Wariant funkcjonalny lub wizualny komponentu."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Wyłącza komponent i blokuje jego interakcje."
      },
      {
        "name": "ariaLabel",
        "type": "string",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      },
      {
        "name": "placement",
        "type": "| 'top'\n  | 'right'\n  | 'bottom'\n  | 'left'\n  | 'top-left'\n  | 'top-right'\n  | 'bottom-left'\n  | 'bottom-right'",
        "required": false,
        "default": "bottom",
        "description": "Konfiguruje właściwość „placement” komponentu."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "selectedItemsCount",
        "type": "number",
        "required": false,
        "default": "0",
        "description": "Konfiguruje właściwość „selected items count” komponentu."
      },
      {
        "name": "forceExport",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „force export” komponentu."
      },
      {
        "name": "useAriaLabel",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „use aria label” komponentu."
      }
    ],
    "models": [],
    "events": [
      {
        "name": "onExport",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:export”. W React przekaż callback onExport."
      }
    ],
    "slots": [
      {
        "name": "children",
        "description": "Główna treść React przekazywana przez children."
      }
    ]
  },
  {
    "category": "data-entry",
    "categoryLabel": "Wprowadzanie danych",
    "name": "InputSlider",
    "sourceName": "InputSlider",
    "framework": "react",
    "importPath": "@peaui/ui/react/data-entry/InputSlider",
    "status": "stable",
    "props": [
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Nazwa pola używana przez formularz lub nazwa zasobu."
      },
      {
        "name": "ariaLabel",
        "type": "string",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Wyłącza komponent i blokuje jego interakcje."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      }
    ],
    "models": [
      {
        "name": "value",
        "type": "number",
        "required": false,
        "default": "0",
        "description": "Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange."
      }
    ],
    "events": [],
    "slots": []
  },
  {
    "category": "data-entry",
    "categoryLabel": "Wprowadzanie danych",
    "name": "SearchInput",
    "sourceName": "SearchInput",
    "framework": "react",
    "importPath": "@peaui/ui/react/data-entry/SearchInput",
    "status": "stable",
    "props": [
      {
        "name": "ariaLabel",
        "type": "string",
        "required": false,
        "default": "Pole wyszukiwania",
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      },
      {
        "name": "placeholder",
        "type": "string",
        "required": false,
        "default": "Wpisz czego szukasz",
        "description": "Tekst pomocniczy widoczny przed wprowadzeniem wartości."
      },
      {
        "name": "debounceTime",
        "type": "number",
        "required": false,
        "default": "1000",
        "description": "Konfiguruje właściwość „debounce time” komponentu."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      }
    ],
    "models": [
      {
        "name": "value",
        "type": "string | undefined",
        "required": false,
        "description": "Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange."
      }
    ],
    "events": [
      {
        "name": "onSearch",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:search”. W React przekaż callback onSearch."
      },
      {
        "name": "onRemove",
        "description": "Emitowane po wybraniu akcji usunięcia. W React przekaż callback onRemove."
      }
    ],
    "slots": []
  },
  {
    "category": "data-entry",
    "categoryLabel": "Wprowadzanie danych",
    "name": "SelectableCard",
    "sourceName": "SelectableCard",
    "framework": "react",
    "importPath": "@peaui/ui/react/data-entry/SelectableCard",
    "status": "stable",
    "props": [
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Wyłącza komponent i blokuje jego interakcje."
      },
      {
        "name": "readonly",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Ustawia komponent w trybie tylko do odczytu."
      },
      {
        "name": "active",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Określa aktywny element albo aktywny krok."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "ariaLabel",
        "type": "string",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      }
    ],
    "models": [],
    "events": [],
    "slots": [
      {
        "name": "title",
        "description": "Treść osadzana w nazwanym slocie „title”. W React jest to prop ReactNode „title”."
      },
      {
        "name": "description",
        "description": "Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „description”."
      },
      {
        "name": "additional",
        "description": "Treść osadzana w nazwanym slocie „additional”. W React jest to prop ReactNode „additional”."
      },
      {
        "name": "hint",
        "description": "Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”."
      }
    ]
  },
  {
    "category": "feedback",
    "categoryLabel": "Informacje zwrotne",
    "name": "EmptyState",
    "sourceName": "EmptyState",
    "framework": "react",
    "importPath": "@peaui/ui/react/feedback/EmptyState",
    "status": "stable",
    "props": [
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "title",
        "type": "string",
        "required": false,
        "description": "Główny tytuł prezentowany w komponencie."
      },
      {
        "name": "description",
        "type": "string",
        "required": false,
        "description": "Dodatkowy opis objaśniający zawartość albo stan komponentu."
      }
    ],
    "models": [],
    "events": [],
    "slots": [
      {
        "name": "additional",
        "description": "Treść osadzana w nazwanym slocie „additional”. W React jest to prop ReactNode „additional”."
      }
    ]
  },
  {
    "category": "feedback",
    "categoryLabel": "Informacje zwrotne",
    "name": "MessageText",
    "sourceName": "MessageText",
    "framework": "react",
    "importPath": "@peaui/ui/react/feedback/MessageText",
    "status": "stable",
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": true,
        "description": "Unikalny identyfikator elementu w dokumencie."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "size",
        "type": "| 'xxs'\n    | 'xs'\n    | 's'\n    | 'm'\n    | 'l'\n    | 'xl'\n    | 'heading-xs'\n    | ' heading-s'\n    | 'heading-m'\n    | 'heading-l'",
        "required": false,
        "default": "s",
        "description": "Wariant rozmiaru komponentu."
      },
      {
        "name": "variant",
        "type": "'info' | 'error' | 'success' | 'danger' | 'default' | 'white'",
        "required": false,
        "default": "default",
        "description": "Wariant wizualny komponentu."
      },
      {
        "name": "withIcon",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Konfiguruje właściwość „with icon” komponentu."
      },
      {
        "name": "ownIcon",
        "type": "string",
        "required": false,
        "description": "Konfiguruje właściwość „own icon” komponentu."
      }
    ],
    "models": [],
    "events": [],
    "slots": [
      {
        "name": "children",
        "description": "Główna treść React przekazywana przez children."
      }
    ]
  },
  {
    "category": "feedback",
    "categoryLabel": "Informacje zwrotne",
    "name": "ProgressIndicator",
    "sourceName": "ProgressIndicator",
    "framework": "react",
    "importPath": "@peaui/ui/react/feedback/ProgressIndicator",
    "status": "stable",
    "props": [
      {
        "name": "steps",
        "type": "number",
        "required": true,
        "description": "Konfiguruje właściwość „steps” komponentu."
      },
      {
        "name": "active",
        "type": "number",
        "required": false,
        "description": "Określa aktywny element albo aktywny krok."
      },
      {
        "name": "size",
        "type": "number",
        "required": false,
        "description": "Wariant rozmiaru komponentu."
      },
      {
        "name": "strokeWidth",
        "type": "number",
        "required": false,
        "description": "Konfiguruje właściwość „stroke width” komponentu."
      },
      {
        "name": "removeActive",
        "type": "boolean",
        "required": false,
        "description": "Konfiguruje właściwość „remove active” komponentu."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      }
    ],
    "models": [],
    "events": [],
    "slots": []
  },
  {
    "category": "feedback",
    "categoryLabel": "Informacje zwrotne",
    "name": "SkeletonLoading",
    "sourceName": "SkeletonLoading",
    "framework": "react",
    "importPath": "@peaui/ui/react/feedback/SkeletonLoading",
    "status": "stable",
    "props": [
      {
        "name": "size",
        "type": "'xs' | 's' | 'm' | 'l'",
        "required": false,
        "default": "m",
        "description": "Wariant rozmiaru komponentu."
      },
      {
        "name": "rounded",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „rounded” komponentu."
      },
      {
        "name": "ariaLabel",
        "type": "string",
        "required": false,
        "default": "Trwa ladowanie tresci.",
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      }
    ],
    "models": [],
    "events": [],
    "slots": []
  },
  {
    "category": "feedback",
    "categoryLabel": "Informacje zwrotne",
    "name": "SpinnerLoader",
    "sourceName": "SpinnerLoader",
    "framework": "react",
    "importPath": "@peaui/ui/react/feedback/SpinnerLoader",
    "status": "stable",
    "props": [
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      }
    ],
    "models": [],
    "events": [],
    "slots": []
  },
  {
    "category": "feedback",
    "categoryLabel": "Informacje zwrotne",
    "name": "ToastAlert",
    "sourceName": "ToastAlert",
    "framework": "react",
    "importPath": "@peaui/ui/react/feedback/ToastAlert",
    "status": "stable",
    "props": [
      {
        "name": "variant",
        "type": "'info' | 'error' | 'success' | 'danger'",
        "required": false,
        "default": "info",
        "description": "Wariant wizualny komponentu."
      },
      {
        "name": "title",
        "type": "string",
        "required": false,
        "description": "Główny tytuł prezentowany w komponencie."
      },
      {
        "name": "description",
        "type": "string",
        "required": false,
        "description": "Dodatkowy opis objaśniający zawartość albo stan komponentu."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "size",
        "type": "'s' | 'm' | 'l'",
        "required": false,
        "default": "m",
        "description": "Wariant rozmiaru komponentu."
      },
      {
        "name": "withShadow",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „with shadow” komponentu."
      },
      {
        "name": "withBorder",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „with border” komponentu."
      },
      {
        "name": "canClose",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „can close” komponentu."
      }
    ],
    "models": [],
    "events": [
      {
        "name": "onClose",
        "description": "Emitowane podczas zamykania komponentu. W React przekaż callback onClose."
      }
    ],
    "slots": []
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FieldLabel",
    "sourceName": "FieldLabel",
    "framework": "react",
    "importPath": "@peaui/ui/react/form/FieldLabel",
    "status": "stable",
    "props": [
      {
        "name": "for",
        "type": "string",
        "required": true,
        "description": "Konfiguruje właściwość „for” komponentu."
      },
      {
        "name": "text",
        "type": "string",
        "required": true,
        "description": "Konfiguruje właściwość „text” komponentu."
      },
      {
        "name": "readonly",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Ustawia komponent w trybie tylko do odczytu."
      },
      {
        "name": "required",
        "type": "boolean",
        "required": false,
        "description": "Oznacza wartość jako wymaganą."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      }
    ],
    "models": [],
    "events": [],
    "slots": [
      {
        "name": "hint",
        "description": "Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”."
      }
    ]
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FormButtonCheckbox",
    "sourceName": "FormButtonCheckbox",
    "framework": "react",
    "importPath": "@peaui/ui/react/form/FormButtonCheckbox",
    "status": "stable",
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": true,
        "description": "Unikalny identyfikator elementu w dokumencie."
      },
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Nazwa pola używana przez formularz lub nazwa zasobu."
      },
      {
        "name": "isValid",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Konfiguruje właściwość „is valid” komponentu."
      },
      {
        "name": "required",
        "type": "boolean",
        "required": false,
        "description": "Oznacza wartość jako wymaganą."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje."
      },
      {
        "name": "size",
        "type": "'xxs' | 'xs' | 's' | 'm' | 'l'",
        "required": false,
        "default": "m",
        "description": "Wariant rozmiaru komponentu."
      },
      {
        "name": "ariaLabel",
        "type": "string",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      }
    ],
    "models": [
      {
        "name": "value",
        "type": "boolean | undefined",
        "required": false,
        "description": "Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange."
      }
    ],
    "events": [],
    "slots": [
      {
        "name": "children",
        "description": "Główna treść React przekazywana przez children."
      }
    ]
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FormButtonGroup",
    "sourceName": "FormButtonGroup",
    "framework": "react",
    "importPath": "@peaui/ui/react/form/FormButtonGroup",
    "status": "stable",
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": true,
        "description": "Unikalny identyfikator elementu w dokumencie."
      },
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Nazwa pola używana przez formularz lub nazwa zasobu."
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "description": "Widoczna etykieta opisująca element lub pole formularza."
      },
      {
        "name": "size",
        "type": "'xs' | 's' | 'm' | 'l'",
        "required": false,
        "default": "m",
        "description": "Wariant rozmiaru komponentu."
      },
      {
        "name": "isToggle",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „is toggle” komponentu."
      },
      {
        "name": "required",
        "type": "boolean",
        "required": false,
        "description": "Oznacza wartość jako wymaganą."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje."
      },
      {
        "name": "readonly",
        "type": "boolean",
        "required": false,
        "description": "Ustawia komponent w trybie tylko do odczytu."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "options",
        "type": "ButtonGroupOption[]",
        "required": true,
        "description": "Lista opcji dostępnych do wyświetlenia lub wyboru."
      }
    ],
    "models": [
      {
        "name": "value",
        "type": "string | number | undefined",
        "required": false,
        "description": "Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange."
      }
    ],
    "events": [],
    "slots": [
      {
        "name": "hint",
        "description": "Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”."
      },
      {
        "name": "additionalHint",
        "description": "Treść osadzana w nazwanym slocie „additionalHint”. W React jest to prop ReactNode „additionalHint”."
      },
      {
        "name": "description",
        "description": "Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „description”."
      },
      {
        "name": "error",
        "description": "Treść osadzana w nazwanym slocie „error”. W React jest to prop ReactNode „error”."
      },
      {
        "name": "success",
        "description": "Treść osadzana w nazwanym slocie „success”. W React jest to prop ReactNode „success”."
      }
    ]
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FormCheckbox",
    "sourceName": "FormCheckbox",
    "framework": "react",
    "importPath": "@peaui/ui/react/form/FormCheckbox",
    "status": "stable",
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": true,
        "description": "Unikalny identyfikator elementu w dokumencie."
      },
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Nazwa pola używana przez formularz lub nazwa zasobu."
      },
      {
        "name": "isValid",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Konfiguruje właściwość „is valid” komponentu."
      },
      {
        "name": "required",
        "type": "boolean",
        "required": false,
        "description": "Oznacza wartość jako wymaganą."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      }
    ],
    "models": [
      {
        "name": "value",
        "type": "boolean | undefined",
        "required": false,
        "description": "Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange."
      }
    ],
    "events": [],
    "slots": [
      {
        "name": "children",
        "description": "Główna treść React przekazywana przez children."
      }
    ]
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FormContainer",
    "sourceName": "FormContainer",
    "framework": "react",
    "importPath": "@peaui/ui/react/form/FormContainer",
    "status": "stable",
    "props": [
      {
        "name": "label",
        "type": "string",
        "required": true,
        "description": "Widoczna etykieta opisująca element lub pole formularza."
      },
      {
        "name": "submitButtonLabel",
        "type": "string",
        "required": false,
        "default": "Zapisz",
        "description": "Konfiguruje właściwość „submit button label” komponentu."
      },
      {
        "name": "isLoading",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Włącza stan ładowania i informuje o trwającej operacji."
      },
      {
        "name": "showActions",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Konfiguruje właściwość „show actions” komponentu."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje."
      },
      {
        "name": "cancelButtonLabel",
        "type": "string",
        "required": false,
        "default": "Anuluj",
        "description": "Konfiguruje właściwość „cancel button label” komponentu."
      },
      {
        "name": "actionsPosition",
        "type": "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
        "required": false,
        "default": "bottom-left",
        "description": "Konfiguruje właściwość „actions position” komponentu."
      },
      {
        "name": "showCancelButton",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Konfiguruje właściwość „show cancel button” komponentu."
      },
      {
        "name": "sizeButton",
        "type": "'xxs' | 'xs' | 's' | 'm' | 'l'",
        "required": false,
        "default": "xs",
        "description": "Konfiguruje właściwość „size button” komponentu."
      },
      {
        "name": "useAriaLabelledby",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Konfiguruje właściwość „use aria labelledby” komponentu."
      }
    ],
    "models": [],
    "events": [
      {
        "name": "onCancel",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:cancel”. W React przekaż callback onCancel."
      },
      {
        "name": "onSubmit",
        "description": "Emitowane po zatwierdzeniu danych. W React przekaż callback onSubmit."
      }
    ],
    "slots": [
      {
        "name": "children",
        "description": "Główna treść React przekazywana przez children."
      },
      {
        "name": "additionalBefore",
        "description": "Treść osadzana w nazwanym slocie „additional-before”. W React jest to prop ReactNode „additionalBefore”."
      },
      {
        "name": "additionalAfter",
        "description": "Treść osadzana w nazwanym slocie „additional-after”. W React jest to prop ReactNode „additionalAfter”."
      }
    ]
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FormDatePicker",
    "sourceName": "FormDatePicker",
    "framework": "react",
    "importPath": "@peaui/ui/react/form/FormDatePicker",
    "status": "stable",
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": true,
        "description": "Unikalny identyfikator elementu w dokumencie."
      },
      {
        "name": "canErase",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Pokazuje akcję pozwalającą wyczyścić bieżącą wartość."
      },
      {
        "name": "after",
        "type": "string",
        "required": false,
        "description": "Treść wyświetlana za właściwą wartością pola."
      },
      {
        "name": "before",
        "type": "string",
        "required": false,
        "description": "Treść wyświetlana przed właściwą wartością pola."
      },
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Nazwa pola używana przez formularz lub nazwa zasobu."
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "description": "Widoczna etykieta opisująca element lub pole formularza."
      },
      {
        "name": "iconBefore",
        "type": "string",
        "required": false,
        "description": "Nazwa ikony wyświetlanej przed treścią pola."
      },
      {
        "name": "required",
        "type": "boolean",
        "required": false,
        "description": "Oznacza wartość jako wymaganą."
      },
      {
        "name": "placeholder",
        "type": "string",
        "required": false,
        "default": "wybierz date",
        "description": "Tekst pomocniczy widoczny przed wprowadzeniem wartości."
      },
      {
        "name": "range",
        "type": "boolean",
        "required": false,
        "description": "Konfiguruje właściwość „range” komponentu."
      },
      {
        "name": "minDate",
        "type": "string",
        "required": false,
        "description": "Konfiguruje właściwość „min date” komponentu."
      },
      {
        "name": "maxDate",
        "type": "string",
        "required": false,
        "description": "Konfiguruje właściwość „max date” komponentu."
      },
      {
        "name": "min",
        "type": "string",
        "required": false,
        "description": "Minimalna dozwolona wartość."
      },
      {
        "name": "max",
        "type": "string",
        "required": false,
        "description": "Maksymalna dozwolona wartość albo szerokość."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje."
      },
      {
        "name": "readonly",
        "type": "boolean",
        "required": false,
        "description": "Ustawia komponent w trybie tylko do odczytu."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      }
    ],
    "models": [
      {
        "name": "value",
        "type": "string | DatePickerRangeValue | undefined",
        "required": false,
        "description": "Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange."
      }
    ],
    "events": [
      {
        "name": "onRemove",
        "description": "Emitowane po wybraniu akcji usunięcia. W React przekaż callback onRemove."
      }
    ],
    "slots": [
      {
        "name": "hint",
        "description": "Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”."
      },
      {
        "name": "description",
        "description": "Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „description”."
      },
      {
        "name": "error",
        "description": "Treść osadzana w nazwanym slocie „error”. W React jest to prop ReactNode „error”."
      },
      {
        "name": "success",
        "description": "Treść osadzana w nazwanym slocie „success”. W React jest to prop ReactNode „success”."
      }
    ]
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FormField",
    "sourceName": "FormField",
    "framework": "react",
    "importPath": "@peaui/ui/react/form/FormField",
    "status": "stable",
    "props": [
      {
        "name": "after",
        "type": "string",
        "required": false,
        "description": "Treść wyświetlana za właściwą wartością pola."
      },
      {
        "name": "before",
        "type": "string",
        "required": false,
        "description": "Treść wyświetlana przed właściwą wartością pola."
      },
      {
        "name": "canErase",
        "type": "boolean",
        "required": false,
        "description": "Pokazuje akcję pozwalającą wyczyścić bieżącą wartość."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje."
      },
      {
        "name": "iconAfter",
        "type": "string",
        "required": false,
        "description": "Nazwa ikony wyświetlanej za treścią pola."
      },
      {
        "name": "iconBefore",
        "type": "string",
        "required": false,
        "description": "Nazwa ikony wyświetlanej przed treścią pola."
      },
      {
        "name": "id",
        "type": "string",
        "required": true,
        "description": "Unikalny identyfikator elementu w dokumencie."
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "description": "Widoczna etykieta opisująca element lub pole formularza."
      },
      {
        "name": "maxLength",
        "type": "number",
        "required": false,
        "description": "Maksymalna liczba znaków możliwa do wprowadzenia."
      },
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Nazwa pola używana przez formularz lub nazwa zasobu."
      },
      {
        "name": "placeholder",
        "type": "string",
        "required": false,
        "description": "Tekst pomocniczy widoczny przed wprowadzeniem wartości."
      },
      {
        "name": "readonly",
        "type": "boolean",
        "required": false,
        "description": "Ustawia komponent w trybie tylko do odczytu."
      },
      {
        "name": "required",
        "type": "boolean",
        "required": false,
        "description": "Oznacza wartość jako wymaganą."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "rightErasePosition",
        "type": "number",
        "required": false,
        "description": "Konfiguruje właściwość „right erase position” komponentu."
      },
      {
        "name": "value",
        "type": "string | number | string[] | null",
        "required": false,
        "description": "Bieżąca wartość kontrolowana przez v-model."
      }
    ],
    "models": [],
    "events": [
      {
        "name": "onRemove",
        "description": "Emitowane po wybraniu akcji usunięcia. W React przekaż callback onRemove."
      }
    ],
    "slots": [
      {
        "name": "hint",
        "description": "Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”."
      },
      {
        "name": "additional",
        "description": "Treść osadzana w nazwanym slocie „additional”. W React jest to prop ReactNode „additional”."
      },
      {
        "name": "children",
        "description": "Główna treść React przekazywana przez children."
      },
      {
        "name": "description",
        "description": "Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „description”."
      },
      {
        "name": "error",
        "description": "Treść osadzana w nazwanym slocie „error”. W React jest to prop ReactNode „error”."
      },
      {
        "name": "success",
        "description": "Treść osadzana w nazwanym slocie „success”. W React jest to prop ReactNode „success”."
      }
    ]
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FormFileUpload",
    "sourceName": "FormFileUpload",
    "framework": "react",
    "importPath": "@peaui/ui/react/form/FormFileUpload",
    "status": "stable",
    "props": [
      {
        "name": "allowedTypes",
        "type": "string[]",
        "required": false,
        "default": "['image/jpeg', 'image/png', 'image/jpg']",
        "description": "Konfiguruje właściwość „allowed types” komponentu."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Wyłącza komponent i blokuje jego interakcje."
      },
      {
        "name": "maxFileSize",
        "type": "number",
        "required": false,
        "default": "5 * 1024 * 1024",
        "description": "Konfiguruje właściwość „max file size” komponentu."
      },
      {
        "name": "variant",
        "type": "'primary' | 'danger'",
        "required": false,
        "default": "primary",
        "description": "Wariant wizualny komponentu."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "default": "undefined",
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      }
    ],
    "models": [
      {
        "name": "file",
        "type": "FormFileUploadValue | undefined",
        "required": false,
        "description": "Wybrany plik kontrolowany przez v-model:file. W React dostępne są propsy file, defaultFile i onFileChange."
      }
    ],
    "events": [
      {
        "name": "onRemove",
        "description": "Emitowane po wybraniu akcji usunięcia. W React przekaż callback onRemove."
      }
    ],
    "slots": []
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FormFileUploadSimple",
    "sourceName": "FormFileUploadSimple",
    "framework": "react",
    "importPath": "@peaui/ui/react/form/FormFileUploadSimple",
    "status": "stable",
    "props": [
      {
        "name": "allowedTypes",
        "type": "string[]",
        "required": false,
        "default": "[\n      'application/msword',\n      'application/pdf',\n      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',\n      'image/jpeg',\n      'image/jpg',\n      'image/png',\n    ]",
        "description": "Konfiguruje właściwość „allowed types” komponentu."
      },
      {
        "name": "context",
        "type": "string",
        "required": false,
        "default": "undefined",
        "description": "Konfiguruje właściwość „context” komponentu."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Wyłącza komponent i blokuje jego interakcje."
      },
      {
        "name": "maxFileSize",
        "type": "number",
        "required": false,
        "default": "5 * 1024 * 1024",
        "description": "Konfiguruje właściwość „max file size” komponentu."
      },
      {
        "name": "maxFiles",
        "type": "number",
        "required": false,
        "default": "4",
        "description": "Konfiguruje właściwość „max files” komponentu."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "default": "undefined",
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      }
    ],
    "models": [
      {
        "name": "files",
        "type": "File[]",
        "required": false,
        "description": "Lista wybranych plików kontrolowana przez v-model:files. W React dostępne są propsy files, defaultFiles i onFilesChange."
      }
    ],
    "events": [],
    "slots": []
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FormInput",
    "sourceName": "FormInput",
    "framework": "react",
    "importPath": "@peaui/ui/react/form/FormInput",
    "status": "stable",
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": true,
        "description": "Unikalny identyfikator elementu w dokumencie."
      },
      {
        "name": "canErase",
        "type": "boolean",
        "required": false,
        "description": "Pokazuje akcję pozwalającą wyczyścić bieżącą wartość."
      },
      {
        "name": "after",
        "type": "string",
        "required": false,
        "description": "Treść wyświetlana za właściwą wartością pola."
      },
      {
        "name": "before",
        "type": "string",
        "required": false,
        "description": "Treść wyświetlana przed właściwą wartością pola."
      },
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Nazwa pola używana przez formularz lub nazwa zasobu."
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "description": "Widoczna etykieta opisująca element lub pole formularza."
      },
      {
        "name": "iconBefore",
        "type": "string",
        "required": false,
        "description": "Nazwa ikony wyświetlanej przed treścią pola."
      },
      {
        "name": "iconAfter",
        "type": "string",
        "required": false,
        "description": "Nazwa ikony wyświetlanej za treścią pola."
      },
      {
        "name": "maxLength",
        "type": "number",
        "required": false,
        "description": "Maksymalna liczba znaków możliwa do wprowadzenia."
      },
      {
        "name": "required",
        "type": "boolean",
        "required": false,
        "description": "Oznacza wartość jako wymaganą."
      },
      {
        "name": "placeholder",
        "type": "string",
        "required": false,
        "default": "wpisz",
        "description": "Tekst pomocniczy widoczny przed wprowadzeniem wartości."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje."
      },
      {
        "name": "readonly",
        "type": "boolean",
        "required": false,
        "description": "Ustawia komponent w trybie tylko do odczytu."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      }
    ],
    "models": [
      {
        "name": "value",
        "type": "string | undefined",
        "required": false,
        "description": "Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange."
      }
    ],
    "events": [
      {
        "name": "onRemove",
        "description": "Emitowane po wybraniu akcji usunięcia. W React przekaż callback onRemove."
      }
    ],
    "slots": [
      {
        "name": "hint",
        "description": "Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”."
      },
      {
        "name": "description",
        "description": "Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „description”."
      },
      {
        "name": "error",
        "description": "Treść osadzana w nazwanym slocie „error”. W React jest to prop ReactNode „error”."
      },
      {
        "name": "success",
        "description": "Treść osadzana w nazwanym slocie „success”. W React jest to prop ReactNode „success”."
      }
    ]
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FormMultiSelect",
    "sourceName": "FormMultiSelect",
    "framework": "react",
    "importPath": "@peaui/ui/react/form/FormMultiSelect",
    "status": "stable",
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": true,
        "description": "Unikalny identyfikator elementu w dokumencie."
      },
      {
        "name": "canErase",
        "type": "boolean",
        "required": false,
        "description": "Pokazuje akcję pozwalającą wyczyścić bieżącą wartość."
      },
      {
        "name": "after",
        "type": "string",
        "required": false,
        "description": "Treść wyświetlana za właściwą wartością pola."
      },
      {
        "name": "before",
        "type": "string",
        "required": false,
        "description": "Treść wyświetlana przed właściwą wartością pola."
      },
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Nazwa pola używana przez formularz lub nazwa zasobu."
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "description": "Widoczna etykieta opisująca element lub pole formularza."
      },
      {
        "name": "iconBefore",
        "type": "string",
        "required": false,
        "description": "Nazwa ikony wyświetlanej przed treścią pola."
      },
      {
        "name": "required",
        "type": "boolean",
        "required": false,
        "description": "Oznacza wartość jako wymaganą."
      },
      {
        "name": "placeholder",
        "type": "string",
        "required": false,
        "default": "wybierz/wyszukaj",
        "description": "Tekst pomocniczy widoczny przed wprowadzeniem wartości."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje."
      },
      {
        "name": "readonly",
        "type": "boolean",
        "required": false,
        "description": "Ustawia komponent w trybie tylko do odczytu."
      },
      {
        "name": "searchable",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Konfiguruje właściwość „searchable” komponentu."
      },
      {
        "name": "withSelectAll",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „with select all” komponentu."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "options",
        "type": "MultiSelectFieldOption[]",
        "required": true,
        "description": "Lista opcji dostępnych do wyświetlenia lub wyboru."
      },
      {
        "name": "placement",
        "type": "'top' | 'bottom'",
        "required": false,
        "description": "Konfiguruje właściwość „placement” komponentu."
      }
    ],
    "models": [
      {
        "name": "value",
        "type": "unknown[] | null | undefined",
        "required": false,
        "description": "Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange."
      }
    ],
    "events": [
      {
        "name": "onRemove",
        "description": "Emitowane po wybraniu akcji usunięcia. W React przekaż callback onRemove."
      }
    ],
    "slots": [
      {
        "name": "hint",
        "description": "Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”."
      },
      {
        "name": "description",
        "description": "Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „description”."
      },
      {
        "name": "error",
        "description": "Treść osadzana w nazwanym slocie „error”. W React jest to prop ReactNode „error”."
      },
      {
        "name": "success",
        "description": "Treść osadzana w nazwanym slocie „success”. W React jest to prop ReactNode „success”."
      }
    ]
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FormNumber",
    "sourceName": "FormNumber",
    "framework": "react",
    "importPath": "@peaui/ui/react/form/FormNumber",
    "status": "stable",
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": true,
        "description": "Unikalny identyfikator elementu w dokumencie."
      },
      {
        "name": "canErase",
        "type": "boolean",
        "required": false,
        "description": "Pokazuje akcję pozwalającą wyczyścić bieżącą wartość."
      },
      {
        "name": "after",
        "type": "string",
        "required": false,
        "description": "Treść wyświetlana za właściwą wartością pola."
      },
      {
        "name": "before",
        "type": "string",
        "required": false,
        "description": "Treść wyświetlana przed właściwą wartością pola."
      },
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Nazwa pola używana przez formularz lub nazwa zasobu."
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "description": "Widoczna etykieta opisująca element lub pole formularza."
      },
      {
        "name": "iconBefore",
        "type": "string",
        "required": false,
        "description": "Nazwa ikony wyświetlanej przed treścią pola."
      },
      {
        "name": "iconAfter",
        "type": "string",
        "required": false,
        "description": "Nazwa ikony wyświetlanej za treścią pola."
      },
      {
        "name": "max",
        "type": "number",
        "required": false,
        "description": "Maksymalna dozwolona wartość albo szerokość."
      },
      {
        "name": "min",
        "type": "number",
        "required": false,
        "description": "Minimalna dozwolona wartość."
      },
      {
        "name": "step",
        "type": "number",
        "required": false,
        "description": "Krok zmiany wartości liczbowej."
      },
      {
        "name": "required",
        "type": "boolean",
        "required": false,
        "description": "Oznacza wartość jako wymaganą."
      },
      {
        "name": "placeholder",
        "type": "string",
        "required": false,
        "default": "wpisz",
        "description": "Tekst pomocniczy widoczny przed wprowadzeniem wartości."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje."
      },
      {
        "name": "readonly",
        "type": "boolean",
        "required": false,
        "description": "Ustawia komponent w trybie tylko do odczytu."
      },
      {
        "name": "isRangeVisible",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Konfiguruje właściwość „is range visible” komponentu."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      }
    ],
    "models": [
      {
        "name": "value",
        "type": "number | undefined | string",
        "required": false,
        "description": "Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange."
      }
    ],
    "events": [],
    "slots": [
      {
        "name": "hint",
        "description": "Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”."
      },
      {
        "name": "description",
        "description": "Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „description”."
      },
      {
        "name": "error",
        "description": "Treść osadzana w nazwanym slocie „error”. W React jest to prop ReactNode „error”."
      },
      {
        "name": "success",
        "description": "Treść osadzana w nazwanym slocie „success”. W React jest to prop ReactNode „success”."
      }
    ]
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FormPassword",
    "sourceName": "FormPassword",
    "framework": "react",
    "importPath": "@peaui/ui/react/form/FormPassword",
    "status": "stable",
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": true,
        "description": "Unikalny identyfikator elementu w dokumencie."
      },
      {
        "name": "before",
        "type": "string",
        "required": false,
        "description": "Treść wyświetlana przed właściwą wartością pola."
      },
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Nazwa pola używana przez formularz lub nazwa zasobu."
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "description": "Widoczna etykieta opisująca element lub pole formularza."
      },
      {
        "name": "iconBefore",
        "type": "string",
        "required": false,
        "description": "Nazwa ikony wyświetlanej przed treścią pola."
      },
      {
        "name": "maxLength",
        "type": "number",
        "required": false,
        "description": "Maksymalna liczba znaków możliwa do wprowadzenia."
      },
      {
        "name": "canCopy",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Konfiguruje właściwość „can copy” komponentu."
      },
      {
        "name": "canVisible",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Konfiguruje właściwość „can visible” komponentu."
      },
      {
        "name": "required",
        "type": "boolean",
        "required": false,
        "description": "Oznacza wartość jako wymaganą."
      },
      {
        "name": "placeholder",
        "type": "string",
        "required": false,
        "default": "wpisz",
        "description": "Tekst pomocniczy widoczny przed wprowadzeniem wartości."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje."
      },
      {
        "name": "readonly",
        "type": "boolean",
        "required": false,
        "description": "Ustawia komponent w trybie tylko do odczytu."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "showPasswordAriaLabel",
        "type": "string",
        "required": false,
        "default": "Pokaz haslo",
        "description": "Konfiguruje właściwość „show password aria label” komponentu."
      },
      {
        "name": "hidePasswordAriaLabel",
        "type": "string",
        "required": false,
        "default": "Ukryj haslo",
        "description": "Konfiguruje właściwość „hide password aria label” komponentu."
      },
      {
        "name": "copyPasswordAriaLabel",
        "type": "string",
        "required": false,
        "default": "Kopiuj haslo",
        "description": "Konfiguruje właściwość „copy password aria label” komponentu."
      },
      {
        "name": "copySuccessMessage",
        "type": "string",
        "required": false,
        "default": "Haslo skopiowano do schowka.",
        "description": "Konfiguruje właściwość „copy success message” komponentu."
      },
      {
        "name": "copyErrorMessage",
        "type": "string",
        "required": false,
        "default": "Nie udalo sie skopiowac hasla.",
        "description": "Konfiguruje właściwość „copy error message” komponentu."
      },
      {
        "name": "enablePasswordStrengthMeter",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „enable password strength meter” komponentu."
      }
    ],
    "models": [
      {
        "name": "value",
        "type": "string | undefined",
        "required": false,
        "description": "Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange."
      }
    ],
    "events": [],
    "slots": [
      {
        "name": "hint",
        "description": "Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”."
      },
      {
        "name": "description",
        "description": "Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „description”."
      },
      {
        "name": "error",
        "description": "Treść osadzana w nazwanym slocie „error”. W React jest to prop ReactNode „error”."
      },
      {
        "name": "success",
        "description": "Treść osadzana w nazwanym slocie „success”. W React jest to prop ReactNode „success”."
      }
    ]
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FormRadio",
    "sourceName": "FormRadio",
    "framework": "react",
    "importPath": "@peaui/ui/react/form/FormRadio",
    "status": "stable",
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": true,
        "description": "Unikalny identyfikator elementu w dokumencie."
      },
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Nazwa pola używana przez formularz lub nazwa zasobu."
      },
      {
        "name": "optionValue",
        "type": "string | number | boolean",
        "required": true,
        "description": "Konfiguruje właściwość „option value” komponentu."
      },
      {
        "name": "isValid",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Konfiguruje właściwość „is valid” komponentu."
      },
      {
        "name": "required",
        "type": "boolean",
        "required": false,
        "description": "Oznacza wartość jako wymaganą."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      }
    ],
    "models": [
      {
        "name": "value",
        "type": "string | number | boolean | undefined",
        "required": false,
        "description": "Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange."
      }
    ],
    "events": [],
    "slots": [
      {
        "name": "children",
        "description": "Główna treść React przekazywana przez children."
      }
    ]
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FormSelect",
    "sourceName": "FormSelect",
    "framework": "react",
    "importPath": "@peaui/ui/react/form/FormSelect",
    "status": "stable",
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": true,
        "description": "Unikalny identyfikator elementu w dokumencie."
      },
      {
        "name": "canErase",
        "type": "boolean",
        "required": false,
        "description": "Pokazuje akcję pozwalającą wyczyścić bieżącą wartość."
      },
      {
        "name": "after",
        "type": "string",
        "required": false,
        "description": "Treść wyświetlana za właściwą wartością pola."
      },
      {
        "name": "before",
        "type": "string",
        "required": false,
        "description": "Treść wyświetlana przed właściwą wartością pola."
      },
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Nazwa pola używana przez formularz lub nazwa zasobu."
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "description": "Widoczna etykieta opisująca element lub pole formularza."
      },
      {
        "name": "iconBefore",
        "type": "string",
        "required": false,
        "description": "Nazwa ikony wyświetlanej przed treścią pola."
      },
      {
        "name": "required",
        "type": "boolean",
        "required": false,
        "description": "Oznacza wartość jako wymaganą."
      },
      {
        "name": "placement",
        "type": "'top' | 'bottom'",
        "required": false,
        "description": "Preferred list placement. The list flips when the preferred side has insufficient space."
      },
      {
        "name": "placeholder",
        "type": "string",
        "required": false,
        "default": "wybierz/wyszukaj",
        "description": "Tekst pomocniczy widoczny przed wprowadzeniem wartości."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje."
      },
      {
        "name": "readonly",
        "type": "boolean",
        "required": false,
        "description": "Ustawia komponent w trybie tylko do odczytu."
      },
      {
        "name": "canWrite",
        "type": "boolean",
        "required": false,
        "description": "Konfiguruje właściwość „can write” komponentu."
      },
      {
        "name": "searchable",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Konfiguruje właściwość „searchable” komponentu."
      },
      {
        "name": "size",
        "type": "'xs' | 's' | 'm' | 'l'",
        "required": false,
        "default": "m",
        "description": "Wariant rozmiaru komponentu."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "options",
        "type": "SelectFieldOption[]",
        "required": true,
        "description": "Lista opcji dostępnych do wyświetlenia lub wyboru."
      }
    ],
    "models": [
      {
        "name": "value",
        "type": "unknown",
        "required": false,
        "description": "Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange."
      }
    ],
    "events": [
      {
        "name": "onRemove",
        "description": "Emitowane po wybraniu akcji usunięcia. W React przekaż callback onRemove."
      }
    ],
    "slots": [
      {
        "name": "hint",
        "description": "Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”."
      },
      {
        "name": "description",
        "description": "Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „description”."
      },
      {
        "name": "error",
        "description": "Treść osadzana w nazwanym slocie „error”. W React jest to prop ReactNode „error”."
      },
      {
        "name": "success",
        "description": "Treść osadzana w nazwanym slocie „success”. W React jest to prop ReactNode „success”."
      }
    ]
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FormTextarea",
    "sourceName": "FormTextarea",
    "framework": "react",
    "importPath": "@peaui/ui/react/form/FormTextarea",
    "status": "stable",
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": true,
        "description": "Unikalny identyfikator elementu w dokumencie."
      },
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Nazwa pola używana przez formularz lub nazwa zasobu."
      },
      {
        "name": "rows",
        "type": "number",
        "required": false,
        "default": "5",
        "description": "Konfiguruje właściwość „rows” komponentu."
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "description": "Widoczna etykieta opisująca element lub pole formularza."
      },
      {
        "name": "maxLength",
        "type": "number",
        "required": false,
        "description": "Maksymalna liczba znaków możliwa do wprowadzenia."
      },
      {
        "name": "required",
        "type": "boolean",
        "required": false,
        "description": "Oznacza wartość jako wymaganą."
      },
      {
        "name": "placeholder",
        "type": "string",
        "required": false,
        "default": "wpisz",
        "description": "Tekst pomocniczy widoczny przed wprowadzeniem wartości."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje."
      },
      {
        "name": "readonly",
        "type": "boolean",
        "required": false,
        "description": "Ustawia komponent w trybie tylko do odczytu."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      }
    ],
    "models": [
      {
        "name": "value",
        "type": "string | undefined",
        "required": false,
        "description": "Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange."
      }
    ],
    "events": [],
    "slots": [
      {
        "name": "hint",
        "description": "Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”."
      },
      {
        "name": "description",
        "description": "Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „description”."
      },
      {
        "name": "error",
        "description": "Treść osadzana w nazwanym slocie „error”. W React jest to prop ReactNode „error”."
      },
      {
        "name": "success",
        "description": "Treść osadzana w nazwanym slocie „success”. W React jest to prop ReactNode „success”."
      }
    ]
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FormYearPicker",
    "sourceName": "FormYearPicker",
    "framework": "react",
    "importPath": "@peaui/ui/react/form/FormYearPicker",
    "status": "stable",
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": true,
        "description": "Unikalny identyfikator elementu w dokumencie."
      },
      {
        "name": "canErase",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Pokazuje akcję pozwalającą wyczyścić bieżącą wartość."
      },
      {
        "name": "after",
        "type": "string",
        "required": false,
        "description": "Treść wyświetlana za właściwą wartością pola."
      },
      {
        "name": "before",
        "type": "string",
        "required": false,
        "description": "Treść wyświetlana przed właściwą wartością pola."
      },
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Nazwa pola używana przez formularz lub nazwa zasobu."
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "description": "Widoczna etykieta opisująca element lub pole formularza."
      },
      {
        "name": "iconBefore",
        "type": "string",
        "required": false,
        "description": "Nazwa ikony wyświetlanej przed treścią pola."
      },
      {
        "name": "required",
        "type": "boolean",
        "required": false,
        "description": "Oznacza wartość jako wymaganą."
      },
      {
        "name": "placeholder",
        "type": "string",
        "required": false,
        "default": "wybierz rok",
        "description": "Tekst pomocniczy widoczny przed wprowadzeniem wartości."
      },
      {
        "name": "range",
        "type": "boolean",
        "required": false,
        "description": "Konfiguruje właściwość „range” komponentu."
      },
      {
        "name": "minYear",
        "type": "number",
        "required": false,
        "description": "Konfiguruje właściwość „min year” komponentu."
      },
      {
        "name": "maxYear",
        "type": "number",
        "required": false,
        "description": "Konfiguruje właściwość „max year” komponentu."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje."
      },
      {
        "name": "readonly",
        "type": "boolean",
        "required": false,
        "description": "Ustawia komponent w trybie tylko do odczytu."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      }
    ],
    "models": [
      {
        "name": "value",
        "type": "number | YearPickerRangeValue | undefined",
        "required": false,
        "description": "Bieżąca wartość kontrolowana przez v-model:value. W React dostępne są propsy value, defaultValue i onValueChange."
      }
    ],
    "events": [
      {
        "name": "onRemove",
        "description": "Emitowane po wybraniu akcji usunięcia. W React przekaż callback onRemove."
      }
    ],
    "slots": [
      {
        "name": "hint",
        "description": "Treść osadzana w nazwanym slocie „hint”. W React jest to prop ReactNode „hint”."
      },
      {
        "name": "description",
        "description": "Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „description”."
      },
      {
        "name": "error",
        "description": "Treść osadzana w nazwanym slocie „error”. W React jest to prop ReactNode „error”."
      },
      {
        "name": "success",
        "description": "Treść osadzana w nazwanym slocie „success”. W React jest to prop ReactNode „success”."
      }
    ]
  },
  {
    "category": "layout",
    "categoryLabel": "Układ",
    "name": "CardPanel",
    "sourceName": "CardPanel",
    "framework": "react",
    "importPath": "@peaui/ui/react/layout/CardPanel",
    "status": "stable",
    "props": [
      {
        "name": "ariaLabel",
        "type": "string",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      },
      {
        "name": "isShadowEnabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „is shadow enabled” komponentu."
      },
      {
        "name": "isHoverEnabled",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Konfiguruje właściwość „is hover enabled” komponentu."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "as",
        "type": "'div' | 'section' | 'article' | 'a' | Component",
        "required": false,
        "default": "div",
        "description": "Konfiguruje właściwość „as” komponentu."
      },
      {
        "name": "backgroundColor",
        "type": "'default' | 'primary' | 'grey'",
        "required": false,
        "default": "default",
        "description": "Konfiguruje właściwość „background color” komponentu."
      },
      {
        "name": "borderColor",
        "type": "'default' | 'primary' | 'grey'",
        "required": false,
        "default": "default",
        "description": "Konfiguruje właściwość „border color” komponentu."
      },
      {
        "name": "size",
        "type": "'xs' | 's' | 'm' | 'l'",
        "required": false,
        "default": "m",
        "description": "Wariant rozmiaru komponentu."
      }
    ],
    "models": [],
    "events": [],
    "slots": [
      {
        "name": "header",
        "description": "Treść osadzana w nazwanym slocie „header”. W React jest to prop ReactNode „header”."
      },
      {
        "name": "children",
        "description": "Główna treść React przekazywana przez children."
      }
    ]
  },
  {
    "category": "layout",
    "categoryLabel": "Układ",
    "name": "FullscreenContainer",
    "sourceName": "FullscreenContainer",
    "framework": "react",
    "importPath": "@peaui/ui/react/layout/FullscreenContainer",
    "status": "stable",
    "props": [
      {
        "name": "ariaLabel",
        "type": "string",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "openLabel",
        "type": "string",
        "required": false,
        "default": "Otwórz tryb pełnoekranowy",
        "description": "Konfiguruje właściwość „open label” komponentu."
      },
      {
        "name": "closeLabel",
        "type": "string",
        "required": false,
        "default": "Zamknij tryb pełnoekranowy",
        "description": "Konfiguruje właściwość „close label” komponentu."
      }
    ],
    "models": [],
    "events": [],
    "slots": [
      {
        "name": "children",
        "description": "Główna treść React przekazywana przez children."
      }
    ]
  },
  {
    "category": "layout",
    "categoryLabel": "Układ",
    "name": "GridItem",
    "sourceName": "GridItem",
    "framework": "react",
    "importPath": "@peaui/ui/react/layout/GridItem",
    "status": "stable",
    "props": [
      {
        "name": "colspan",
        "type": "number",
        "required": false,
        "description": "Konfiguruje właściwość „colspan” komponentu."
      },
      {
        "name": "columns",
        "type": "number",
        "required": false,
        "default": "2",
        "description": "Definicje kolumn określające ich etykiety, klucze i sposób renderowania."
      },
      {
        "name": "gap",
        "type": "number",
        "required": false,
        "default": "6",
        "description": "Odstęp pomiędzy elementami układu."
      },
      {
        "name": "grid",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Konfiguruje właściwość „grid” komponentu."
      }
    ],
    "models": [],
    "events": [],
    "slots": [
      {
        "name": "children",
        "description": "Główna treść React przekazywana przez children."
      }
    ]
  },
  {
    "category": "layout",
    "categoryLabel": "Układ",
    "name": "GridSection",
    "sourceName": "GridSection",
    "framework": "react",
    "importPath": "@peaui/ui/react/layout/GridSection",
    "status": "stable",
    "props": [
      {
        "name": "columns",
        "type": "number",
        "required": false,
        "default": "4",
        "description": "Definicje kolumn określające ich etykiety, klucze i sposób renderowania."
      },
      {
        "name": "gap",
        "type": "number",
        "required": false,
        "default": "6",
        "description": "Odstęp pomiędzy elementami układu."
      }
    ],
    "models": [],
    "events": [],
    "slots": [
      {
        "name": "additional",
        "description": "Treść osadzana w nazwanym slocie „additional”. W React jest to prop ReactNode „additional”."
      },
      {
        "name": "children",
        "description": "Główna treść React przekazywana przez children."
      }
    ]
  },
  {
    "category": "layout",
    "categoryLabel": "Układ",
    "name": "PageLayout",
    "sourceName": "PageLayout",
    "framework": "react",
    "importPath": "@peaui/ui/react/layout/PageLayout",
    "status": "stable",
    "props": [
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "ariaLabel",
        "type": "string",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      },
      {
        "name": "isHeaderSticky",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „is header sticky” komponentu."
      }
    ],
    "models": [],
    "events": [],
    "slots": [
      {
        "name": "top",
        "description": "Treść osadzana w nazwanym slocie „top”. W React jest to prop ReactNode „top”."
      },
      {
        "name": "additional",
        "description": "Treść osadzana w nazwanym slocie „additional”. W React jest to prop ReactNode „additional”."
      },
      {
        "name": "children",
        "description": "Główna treść React przekazywana przez children."
      },
      {
        "name": "footer",
        "description": "Treść osadzana w nazwanym slocie „footer”. W React jest to prop ReactNode „footer”."
      }
    ]
  },
  {
    "category": "layout",
    "categoryLabel": "Układ",
    "name": "SectionDivider",
    "sourceName": "SectionDivider",
    "framework": "react",
    "importPath": "@peaui/ui/react/layout/SectionDivider",
    "status": "stable",
    "props": [
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "direction",
        "type": "'horizontal' | 'vertical'",
        "required": false,
        "default": "horizontal",
        "description": "Konfiguruje właściwość „direction” komponentu."
      },
      {
        "name": "size",
        "type": "'s' | 'm' | 'l' | 'xl'",
        "required": false,
        "default": "s",
        "description": "Wariant rozmiaru komponentu."
      }
    ],
    "models": [],
    "events": [],
    "slots": []
  },
  {
    "category": "navigation",
    "categoryLabel": "Nawigacja",
    "name": "Breadcrumbs",
    "sourceName": "Breadcrumbs",
    "framework": "react",
    "importPath": "@peaui/ui/react/navigation/Breadcrumbs",
    "status": "stable",
    "props": [
      {
        "name": "items",
        "type": "BreadcrumbItem[]",
        "required": true,
        "description": "Konfiguruje właściwość „items” komponentu."
      },
      {
        "name": "separator",
        "type": "string",
        "required": false,
        "default": "/",
        "description": "Konfiguruje właściwość „separator” komponentu."
      },
      {
        "name": "ariaLabel",
        "type": "string",
        "required": false,
        "default": "Ścieżka nawigacji",
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      }
    ],
    "models": [],
    "events": [
      {
        "name": "onNavigate",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:navigate”. W React przekaż callback onNavigate."
      }
    ],
    "slots": []
  },
  {
    "category": "navigation",
    "categoryLabel": "Nawigacja",
    "name": "ListLimitControl",
    "sourceName": "ListLimitControl",
    "framework": "react",
    "importPath": "@peaui/ui/react/navigation/ListLimitControl",
    "status": "stable",
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": true,
        "description": "Unikalny identyfikator elementu w dokumencie."
      },
      {
        "name": "label",
        "type": "string",
        "required": true,
        "description": "Widoczna etykieta opisująca element lub pole formularza."
      },
      {
        "name": "limitList",
        "type": "number[]",
        "required": false,
        "default": "[5, 10, 25, 50]",
        "description": "Konfiguruje właściwość „limit list” komponentu."
      },
      {
        "name": "position",
        "type": "'top' | 'bottom'",
        "required": false,
        "default": "bottom",
        "description": "Preferred list placement; it flips automatically when the selected side has insufficient space."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      }
    ],
    "models": [
      {
        "name": "limit",
        "type": "number",
        "required": false,
        "description": "Wybrany limit elementów kontrolowany przez v-model:limit. W React dostępne są propsy limit, defaultLimit i onLimitChange."
      }
    ],
    "events": [],
    "slots": [
      {
        "name": "children",
        "description": "Główna treść React przekazywana przez children."
      }
    ]
  },
  {
    "category": "navigation",
    "categoryLabel": "Nawigacja",
    "name": "NavigationCard",
    "sourceName": "NavigationCard",
    "framework": "react",
    "importPath": "@peaui/ui/react/navigation/NavigationCard",
    "status": "stable",
    "props": [
      {
        "name": "title",
        "type": "string",
        "required": true,
        "description": "Główny tytuł prezentowany w komponencie."
      },
      {
        "name": "path",
        "type": "string",
        "required": false,
        "description": "Konfiguruje właściwość „path” komponentu."
      },
      {
        "name": "description",
        "type": "string",
        "required": true,
        "description": "Dodatkowy opis objaśniający zawartość albo stan komponentu."
      },
      {
        "name": "size",
        "type": "'s' | 'm' | 'l'",
        "required": false,
        "default": "s",
        "description": "Wariant rozmiaru komponentu."
      },
      {
        "name": "variant",
        "type": "'default' | 'complete' | 'during' | 'disabled' | 'hidden'",
        "required": false,
        "default": "default",
        "description": "Wariant wizualny komponentu."
      },
      {
        "name": "ariaLabel",
        "type": "string",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      }
    ],
    "models": [],
    "events": [],
    "slots": []
  },
  {
    "category": "navigation",
    "categoryLabel": "Nawigacja",
    "name": "NavigationDisclosureCard",
    "sourceName": "NavigationDisclosureCard",
    "framework": "react",
    "importPath": "@peaui/ui/react/navigation/NavigationDisclosureCard",
    "status": "stable",
    "props": [
      {
        "name": "title",
        "type": "string",
        "required": true,
        "description": "Główny tytuł prezentowany w komponencie."
      },
      {
        "name": "description",
        "type": "string",
        "required": true,
        "description": "Dodatkowy opis objaśniający zawartość albo stan komponentu."
      },
      {
        "name": "id",
        "type": "string",
        "required": true,
        "description": "Unikalny identyfikator elementu w dokumencie."
      },
      {
        "name": "path",
        "type": "string",
        "required": false,
        "description": "Konfiguruje właściwość „path” komponentu."
      },
      {
        "name": "open",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Steruje widocznością rozwijanego elementu albo warstwy."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "ariaLabel",
        "type": "string",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      }
    ],
    "models": [],
    "events": [],
    "slots": [
      {
        "name": "titleAdditional",
        "description": "Treść osadzana w nazwanym slocie „title-additional”. W React jest to prop ReactNode „titleAdditional”."
      },
      {
        "name": "descriptionAdditional",
        "description": "Treść osadzana w nazwanym slocie „description-additional”. W React jest to prop ReactNode „descriptionAdditional”."
      },
      {
        "name": "children",
        "description": "Główna treść React przekazywana przez children."
      }
    ]
  },
  {
    "category": "navigation",
    "categoryLabel": "Nawigacja",
    "name": "NavigationIconCard",
    "sourceName": "NavigationIconCard",
    "framework": "react",
    "importPath": "@peaui/ui/react/navigation/NavigationIconCard",
    "status": "stable",
    "props": [
      {
        "name": "icon",
        "type": "string",
        "required": true,
        "description": "Nazwa ikony prezentowanej przez komponent."
      },
      {
        "name": "text",
        "type": "string",
        "required": true,
        "description": "Konfiguruje właściwość „text” komponentu."
      },
      {
        "name": "path",
        "type": "string",
        "required": true,
        "description": "Konfiguruje właściwość „path” komponentu."
      },
      {
        "name": "ariaLabel",
        "type": "string",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      }
    ],
    "models": [],
    "events": [],
    "slots": []
  },
  {
    "category": "navigation",
    "categoryLabel": "Nawigacja",
    "name": "NavigationLink",
    "sourceName": "NavigationLink",
    "framework": "react",
    "importPath": "@peaui/ui/react/navigation/NavigationLink",
    "status": "stable",
    "props": [
      {
        "name": "path",
        "type": "string",
        "required": true,
        "description": "Konfiguruje właściwość „path” komponentu."
      },
      {
        "name": "ariaLabel",
        "type": "string",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "size",
        "type": "'m' | 's' | 'xs'",
        "required": false,
        "default": "s",
        "description": "Wariant rozmiaru komponentu."
      },
      {
        "name": "variant",
        "type": "'default' | 'primary'",
        "required": false,
        "default": "default",
        "description": "Wariant wizualny komponentu."
      }
    ],
    "models": [],
    "events": [],
    "slots": [
      {
        "name": "children",
        "description": "Główna treść React przekazywana przez children."
      }
    ]
  },
  {
    "category": "navigation",
    "categoryLabel": "Nawigacja",
    "name": "NavigationStepper",
    "sourceName": "NavigationStepper",
    "framework": "react",
    "importPath": "@peaui/ui/react/navigation/NavigationStepper",
    "status": "stable",
    "props": [
      {
        "name": "options",
        "type": "NavStepper[]",
        "required": false,
        "default": "[]",
        "description": "Lista opcji dostępnych do wyświetlenia lub wyboru."
      },
      {
        "name": "ariaLabel",
        "type": "string",
        "required": false,
        "default": "Nawigacja kroków",
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      }
    ],
    "models": [],
    "events": [
      {
        "name": "onSelect",
        "description": "Emitowane po wybraniu elementu. W React przekaż callback onSelect."
      }
    ],
    "slots": []
  },
  {
    "category": "navigation",
    "categoryLabel": "Nawigacja",
    "name": "NavigationTabs",
    "sourceName": "NavigationTabs",
    "framework": "react",
    "importPath": "@peaui/ui/react/navigation/NavigationTabs",
    "status": "stable",
    "props": [
      {
        "name": "tabs",
        "type": "Tab[]",
        "required": false,
        "default": "[]",
        "description": "Konfiguruje właściwość „tabs” komponentu."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "ariaLabel",
        "type": "string",
        "required": true,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      },
      {
        "name": "withBackround",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Konfiguruje właściwość „with backround” komponentu."
      }
    ],
    "models": [],
    "events": [
      {
        "name": "onSelect",
        "description": "Emitowane po wybraniu elementu. W React przekaż callback onSelect."
      }
    ],
    "slots": [
      {
        "name": "getSlotName(tab.key, ",
        "description": "Treść osadzana w nazwanym slocie „getSlotName(tab.key, ”. W React jest to prop ReactNode „getSlotName(tab.key, ”."
      }
    ]
  },
  {
    "category": "navigation",
    "categoryLabel": "Nawigacja",
    "name": "PaginationControl",
    "sourceName": "PaginationControl",
    "framework": "react",
    "importPath": "@peaui/ui/react/navigation/PaginationControl",
    "status": "stable",
    "props": [
      {
        "name": "ariaLabel",
        "type": "string",
        "required": true,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      },
      {
        "name": "totalPages",
        "type": "number",
        "required": true,
        "description": "Łączna liczba stron dostępnych w paginacji."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      }
    ],
    "models": [
      {
        "name": "page",
        "type": "number",
        "required": false,
        "default": "1",
        "description": "Aktualna strona kontrolowana przez v-model:page. W React dostępne są propsy page, defaultPage i onPageChange."
      }
    ],
    "events": [],
    "slots": []
  },
  {
    "category": "overlayer",
    "categoryLabel": "Warstwy i okna",
    "name": "DrawerPanel",
    "sourceName": "DrawerPanel",
    "framework": "react",
    "importPath": "@peaui/ui/react/overlayer/DrawerPanel",
    "status": "stable",
    "props": [
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "ariaLabel",
        "type": "string",
        "required": true,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      }
    ],
    "models": [
      {
        "name": "open",
        "type": "boolean",
        "required": false,
        "description": "Stan otwarcia kontrolowany przez v-model:open. W React dostępne są propsy open, defaultOpen i onOpenChange."
      }
    ],
    "events": [],
    "slots": [
      {
        "name": "header",
        "description": "Treść osadzana w nazwanym slocie „header”. W React jest to prop ReactNode „header”."
      },
      {
        "name": "children",
        "description": "Główna treść React przekazywana przez children."
      }
    ]
  },
  {
    "category": "overlayer",
    "categoryLabel": "Warstwy i okna",
    "name": "InfoTooltip",
    "sourceName": "InfoTooltip",
    "framework": "react",
    "importPath": "@peaui/ui/react/overlayer/InfoTooltip",
    "status": "stable",
    "props": [
      {
        "name": "placement",
        "type": "| 'top'\n  | 'right'\n  | 'bottom'\n  | 'left'\n  | 'top-left'\n  | 'top-right'\n  | 'bottom-left'\n  | 'bottom-right'",
        "required": false,
        "default": "top",
        "description": "Konfiguruje właściwość „placement” komponentu."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "variant",
        "type": "'default' | 'disabled'",
        "required": false,
        "default": "default",
        "description": "Wariant wizualny komponentu."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Wyłącza komponent i blokuje jego interakcje."
      }
    ],
    "models": [],
    "events": [],
    "slots": [
      {
        "name": "children",
        "description": "Główna treść React przekazywana przez children."
      },
      {
        "name": "title",
        "description": "Treść osadzana w nazwanym slocie „title”. W React jest to prop ReactNode „title”."
      },
      {
        "name": "description",
        "description": "Treść osadzana w nazwanym slocie „description”. W React jest to prop ReactNode „description”."
      }
    ]
  },
  {
    "category": "overlayer",
    "categoryLabel": "Warstwy i okna",
    "name": "ModalDialog",
    "sourceName": "ModalDialog",
    "framework": "react",
    "importPath": "@peaui/ui/react/overlayer/ModalDialog",
    "status": "stable",
    "props": [
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "ariaLabel",
        "type": "string",
        "required": true,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      }
    ],
    "models": [
      {
        "name": "open",
        "type": "boolean",
        "required": false,
        "description": "Stan otwarcia kontrolowany przez v-model:open. W React dostępne są propsy open, defaultOpen i onOpenChange."
      }
    ],
    "events": [],
    "slots": [
      {
        "name": "header",
        "description": "Treść osadzana w nazwanym slocie „header”. W React jest to prop ReactNode „header”."
      },
      {
        "name": "children",
        "description": "Główna treść React przekazywana przez children."
      }
    ]
  },
  {
    "category": "overlayer",
    "categoryLabel": "Warstwy i okna",
    "name": "PopoverButton",
    "sourceName": "PopoverButton",
    "framework": "react",
    "importPath": "@peaui/ui/react/overlayer/PopoverButton",
    "status": "stable",
    "props": [
      {
        "name": "size",
        "type": "'xs' | 's' | 'm' | 'l'",
        "required": false,
        "default": "m",
        "description": "Wariant rozmiaru komponentu."
      },
      {
        "name": "variant",
        "type": "'primary' | 'secondary' | 'ghost' | 'danger'",
        "required": false,
        "default": "primary",
        "description": "Wariant wizualny komponentu."
      },
      {
        "name": "placement",
        "type": "| 'top'\n  | 'right'\n  | 'bottom'\n  | 'left'\n  | 'top-left'\n  | 'top-right'\n  | 'bottom-left'\n  | 'bottom-right'",
        "required": false,
        "default": "top",
        "description": "Konfiguruje właściwość „placement” komponentu."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Wyłącza komponent i blokuje jego interakcje."
      },
      {
        "name": "ariaLabel",
        "type": "string",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      },
      {
        "name": "matchTriggerWidth",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „match trigger width” komponentu."
      },
      {
        "name": "popupType",
        "type": "'menu' | 'listbox' | 'tree' | 'grid' | 'dialog' | 'true'",
        "required": false,
        "description": "Konfiguruje właściwość „popup type” komponentu."
      },
      {
        "name": "useAriaLabel",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „use aria label” komponentu."
      }
    ],
    "models": [],
    "events": [
      {
        "name": "onKeydown",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „keydown”. W React przekaż callback onKeydown."
      },
      {
        "name": "onPointerdown",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „pointerdown”. W React przekaż callback onPointerdown."
      }
    ],
    "slots": [
      {
        "name": "children",
        "description": "Główna treść React przekazywana przez children."
      },
      {
        "name": "content",
        "description": "Treść osadzana w nazwanym slocie „content”. W React jest to prop ReactNode „content”."
      }
    ]
  },
  {
    "category": "overlayer",
    "categoryLabel": "Warstwy i okna",
    "name": "PopoverOverlayer",
    "sourceName": "PopoverOverlayer",
    "framework": "react",
    "importPath": "@peaui/ui/react/overlayer/PopoverOverlayer",
    "status": "stable",
    "props": [
      {
        "name": "placement",
        "type": "| 'top'\n  | 'right'\n  | 'bottom'\n  | 'left'\n  | 'top-left'\n  | 'top-right'\n  | 'bottom-left'\n  | 'bottom-right'",
        "required": false,
        "default": "top",
        "description": "Konfiguruje właściwość „placement” komponentu."
      },
      {
        "name": "dataTestId",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Wyłącza komponent i blokuje jego interakcje."
      },
      {
        "name": "ariaLabel",
        "type": "string",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      },
      {
        "name": "contentClass",
        "type": "string",
        "required": false,
        "description": "Konfiguruje właściwość „content class” komponentu."
      },
      {
        "name": "matchTriggerWidth",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „match trigger width” komponentu."
      },
      {
        "name": "popupType",
        "type": "'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'",
        "required": false,
        "description": "Konfiguruje właściwość „popup type” komponentu."
      }
    ],
    "models": [],
    "events": [
      {
        "name": "onOpenChange",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „update:open”. W React przekaż callback onOpenChange."
      }
    ],
    "slots": [
      {
        "name": "children",
        "description": "Główna treść React przekazywana przez children."
      },
      {
        "name": "content",
        "description": "Treść osadzana w nazwanym slocie „content”. W React jest to prop ReactNode „content”."
      }
    ]
  }
] as const satisfies readonly FrameworkComponentApi[];

export const generatedWebComponentApi = [
  {
    "category": "basic",
    "categoryLabel": "Podstawowe",
    "name": "ImageView",
    "sourceName": "ImageView",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/basic/ImageView",
    "tagName": "peaui-image-view",
    "status": "stable",
    "props": [
      {
        "name": "src",
        "type": "string | undefined",
        "required": false,
        "description": "Adres źródłowy obrazu albo innego zasobu."
      },
      {
        "name": "alt",
        "type": "string | undefined",
        "required": false,
        "description": "Alternatywny opis obrazu używany przez technologie asystujące."
      },
      {
        "name": "size",
        "type": "ImageViewSize",
        "required": false,
        "description": "Wariant rozmiaru komponentu."
      },
      {
        "name": "max",
        "type": "string | undefined",
        "required": false,
        "description": "Maksymalna dozwolona wartość albo szerokość."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „data-testid” konfigurujący komponent ImageView."
      },
      {
        "name": "class",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „class” konfigurujący komponent ImageView."
      },
      {
        "name": "style",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „style” konfigurujący komponent ImageView."
      }
    ],
    "models": [],
    "events": [],
    "slots": []
  },
  {
    "category": "basic",
    "categoryLabel": "Podstawowe",
    "name": "PhotoEditor",
    "sourceName": "PhotoEditior",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/basic/PhotoEditior",
    "tagName": "peaui-photo-editor",
    "status": "stable",
    "props": [
      {
        "name": "aria-label",
        "type": "string",
        "required": false,
        "default": "Edytor zdjęcia",
        "description": "Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [
      {
        "name": "image",
        "type": "PhotoType | undefined",
        "required": false,
        "description": "Edytowany obraz kontrolowany przez v-model:image. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "events": [
      {
        "name": "on:cancel",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:cancel”."
      },
      {
        "name": "update:image",
        "description": "Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „image”."
      }
    ],
    "slots": []
  },
  {
    "category": "basic",
    "categoryLabel": "Podstawowe",
    "name": "SvgIcon",
    "sourceName": "SvgIcon",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/basic/SvgIcon",
    "tagName": "peaui-svg-icon",
    "status": "stable",
    "props": [
      {
        "name": "name",
        "type": "string",
        "required": false,
        "description": "Nazwa pola używana przez formularz lub nazwa zasobu."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „data-testid” konfigurujący komponent SvgIcon."
      }
    ],
    "models": [],
    "events": [],
    "slots": []
  },
  {
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "name": "Avatar",
    "sourceName": "Avatar",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/data-display/Avatar",
    "tagName": "peaui-avatar",
    "status": "stable",
    "props": [
      {
        "name": "alt",
        "type": "string | undefined",
        "required": false,
        "description": "Alternatywny opis obrazu używany przez technologie asystujące."
      },
      {
        "name": "aria-describedby",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „aria-describedby” konfigurujący komponent Avatar."
      },
      {
        "name": "aria-label",
        "type": "string | null",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      },
      {
        "name": "aria-labelledby",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „aria-labelledby” konfigurujący komponent Avatar."
      },
      {
        "name": "class",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „class” konfigurujący komponent Avatar."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „data-testid” konfigurujący komponent Avatar."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje."
      },
      {
        "name": "fallback-icon",
        "type": "string",
        "required": false,
        "description": "Nazwa ikony używanej, gdy obraz ani inicjały nie są dostępne."
      },
      {
        "name": "initials",
        "type": "string | undefined",
        "required": false,
        "description": "Jawne inicjały wyświetlane przed fallbackiem ikonowym."
      },
      {
        "name": "interactive",
        "type": "boolean",
        "required": false,
        "description": "Renderuje komponent jako natywną kontrolkę interaktywną."
      },
      {
        "name": "loading",
        "type": "AvatarLoading",
        "required": false,
        "description": "Wybiera natywną strategię ładowania obrazu."
      },
      {
        "name": "name",
        "type": "string | undefined",
        "required": false,
        "description": "Nazwa pola używana przez formularz lub nazwa zasobu."
      },
      {
        "name": "role",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „role” konfigurujący komponent Avatar."
      },
      {
        "name": "shape",
        "type": "AvatarShape",
        "required": false,
        "description": "Wariant kształtu komponentu."
      },
      {
        "name": "size",
        "type": "AvatarSize",
        "required": false,
        "description": "Wariant rozmiaru komponentu."
      },
      {
        "name": "src",
        "type": "string | undefined",
        "required": false,
        "description": "Adres źródłowy obrazu albo innego zasobu."
      },
      {
        "name": "status",
        "type": "AvatarStatus",
        "required": false,
        "description": "Stan wizualny i semantyczny komponentu."
      },
      {
        "name": "status-label",
        "type": "string | undefined",
        "required": false,
        "description": "Dostępna etykieta tekstowa opisująca status."
      },
      {
        "name": "style",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „style” konfigurujący komponent Avatar."
      }
    ],
    "models": [],
    "events": [
      {
        "name": "load",
        "description": "Emitowane po poprawnym załadowaniu obrazu."
      },
      {
        "name": "error",
        "description": "Emitowane, gdy nie udało się załadować obrazu."
      }
    ],
    "slots": [
      {
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      },
      {
        "name": "status",
        "description": "Treść osadzana w nazwanym slocie „status”."
      }
    ]
  },
  {
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "name": "AvatarGroup",
    "sourceName": "AvatarGroup",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/data-display/AvatarGroup",
    "tagName": "peaui-avatar-group",
    "status": "stable",
    "props": [
      {
        "name": "items",
        "type": "AvatarGroupItem[]",
        "required": false,
        "default": "[]",
        "description": "Osoby prezentowane w stabilnej kolejności wejściowej. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "max-visible",
        "type": "number",
        "required": false,
        "default": "3",
        "description": "Maksymalna liczba awatarów widocznych przed licznikiem nadmiaru. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "size",
        "type": "'xs' | 's' | 'm' | 'l' | 'xl'",
        "required": false,
        "default": "m",
        "description": "Rozmiar awatarów i licznika. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "shape",
        "type": "'circle' | 'rounded'",
        "required": false,
        "default": "circle",
        "description": "Kształt awatarów i licznika. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "overlap",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Włącza kompaktowy układ z nachodzącymi na siebie elementami. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "direction",
        "type": "'start' | 'end'",
        "required": false,
        "default": "end",
        "description": "Określa, która krawędź stosu znajduje się wizualnie na wierzchu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "overflow-mode",
        "type": "'count' | 'popover' | 'none'",
        "required": false,
        "default": "count",
        "description": "Sposób prezentacji pozycji poza limitem. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "item-key",
        "type": "keyof AvatarGroupItem | ((item: AvatarGroupItem, index: number) => string | number)",
        "required": false,
        "default": "id",
        "description": "Pole lub funkcja zwracająca stabilny klucz elementu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "aria-label",
        "type": "string",
        "required": false,
        "default": "Członkowie grupy",
        "description": "Dostępna nazwa listy widocznych osób. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Wyłącza wszystkie akcje grupy. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "loading",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Sygnalizuje ładowanie szczegółowej listy w popoverze. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator używany w testach automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [
      {
        "name": "open",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Stan otwarcia kontrolowany przez v-model:open. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "events": [
      {
        "name": "select",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „select”."
      },
      {
        "name": "overflowClick",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „overflowClick”."
      },
      {
        "name": "update:open",
        "description": "Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „open”."
      }
    ],
    "slots": [
      {
        "name": "item",
        "description": "Treść osadzana w nazwanym slocie „item”."
      },
      {
        "name": "overflow",
        "description": "Treść osadzana w nazwanym slocie „overflow”."
      },
      {
        "name": "popover-header",
        "description": "Treść osadzana w nazwanym slocie „popover-header”."
      },
      {
        "name": "popover-item",
        "description": "Treść osadzana w nazwanym slocie „popover-item”."
      },
      {
        "name": "empty",
        "description": "Treść osadzana w nazwanym slocie „empty”."
      }
    ]
  },
  {
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "name": "CalculationResults",
    "sourceName": "CalculationResults",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/data-display/CalculationResults",
    "tagName": "peaui-calculation-results",
    "status": "stable",
    "props": [
      {
        "name": "is-loading",
        "type": "boolean",
        "required": false,
        "description": "Włącza stan ładowania i informuje o trwającej operacji. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "result",
        "type": "string",
        "required": false,
        "default": "-/-",
        "description": "Konfiguruje właściwość „result” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "label",
        "type": "string",
        "required": true,
        "description": "Widoczna etykieta opisująca element lub pole formularza. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "is-simple",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „is simple” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "show-calculate-button",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Konfiguruje właściwość „show calculate button” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [],
    "events": [
      {
        "name": "on:simulate",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:simulate”."
      }
    ],
    "slots": [
      {
        "name": "additional",
        "description": "Treść osadzana w nazwanym slocie „additional”."
      },
      {
        "name": "hint",
        "description": "Treść osadzana w nazwanym slocie „hint”."
      }
    ]
  },
  {
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "name": "CardCarousel",
    "sourceName": "CardCarousel",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/data-display/CardCarousel",
    "tagName": "peaui-card-carousel",
    "status": "stable",
    "props": [
      {
        "name": "aria-label",
        "type": "string | null",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      },
      {
        "name": "aria-labelledby",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „aria-labelledby” konfigurujący komponent CardCarousel."
      },
      {
        "name": "animation-delay",
        "type": "number",
        "required": false,
        "description": "Atrybut HTML „animation-delay” konfigurujący komponent CardCarousel."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „data-testid” konfigurujący komponent CardCarousel."
      },
      {
        "name": "default-visible-slides",
        "type": "number | undefined",
        "required": false,
        "description": "Atrybut HTML „default-visible-slides” konfigurujący komponent CardCarousel."
      },
      {
        "name": "defualt-visible-slides",
        "type": "number | undefined",
        "required": false,
        "description": "Atrybut HTML „defualt-visible-slides” konfigurujący komponent CardCarousel."
      },
      {
        "name": "is-navigation-dots-visible",
        "type": "boolean",
        "required": false,
        "description": "Atrybut HTML „is-navigation-dots-visible” konfigurujący komponent CardCarousel."
      },
      {
        "name": "is-navigation-visible",
        "type": "boolean",
        "required": false,
        "description": "Atrybut HTML „is-navigation-visible” konfigurujący komponent CardCarousel."
      },
      {
        "name": "with-animation",
        "type": "boolean",
        "required": false,
        "description": "Atrybut HTML „with-animation” konfigurujący komponent CardCarousel."
      },
      {
        "name": "id",
        "type": "string",
        "required": false,
        "description": "Unikalny identyfikator elementu w dokumencie."
      },
      {
        "name": "tabindex",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „tabindex” konfigurujący komponent CardCarousel."
      }
    ],
    "models": [],
    "events": [],
    "slots": []
  },
  {
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "name": "CounterBadge",
    "sourceName": "CounterBadge",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/data-display/CounterBadge",
    "tagName": "peaui-counter-badge",
    "status": "stable",
    "props": [
      {
        "name": "value",
        "type": "number",
        "required": true,
        "description": "Bieżąca wartość kontrolowana przez v-model. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "variant",
        "type": "'info' | 'error' | 'success' | 'danger'",
        "required": false,
        "default": "info",
        "description": "Wariant wizualny komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "size",
        "type": "'s' | 'm' | 'l'",
        "required": false,
        "default": "s",
        "description": "Wariant rozmiaru komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [],
    "events": [],
    "slots": []
  },
  {
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "name": "DescriptionField",
    "sourceName": "DescriptionField",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/data-display/DescriptionField",
    "tagName": "peaui-description-field",
    "status": "stable",
    "props": [
      {
        "name": "label",
        "type": "string",
        "required": false,
        "description": "Widoczna etykieta opisująca element lub pole formularza."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „data-testid” konfigurujący komponent DescriptionField."
      }
    ],
    "models": [],
    "events": [],
    "slots": [
      {
        "name": "additional-before",
        "description": "Treść osadzana w nazwanym slocie „additional-before”."
      },
      {
        "name": "hint",
        "description": "Treść osadzana w nazwanym slocie „hint”."
      },
      {
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      },
      {
        "name": "additional-after",
        "description": "Treść osadzana w nazwanym slocie „additional-after”."
      }
    ]
  },
  {
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "name": "DisclosurePanel",
    "sourceName": "DisclosurePanel",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/data-display/DisclosurePanel",
    "tagName": "peaui-disclosure-panel",
    "status": "stable",
    "props": [
      {
        "name": "title",
        "type": "string",
        "required": false,
        "description": "Główny tytuł prezentowany w komponencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "aria-label",
        "type": "string",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "allways-open",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „allways open” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [
      {
        "name": "open",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Stan otwarcia kontrolowany przez v-model:open. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "events": [
      {
        "name": "update:open",
        "description": "Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „open”."
      }
    ],
    "slots": [
      {
        "name": "title",
        "description": "Treść osadzana w nazwanym slocie „title”."
      },
      {
        "name": "additional",
        "description": "Treść osadzana w nazwanym slocie „additional”."
      },
      {
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      }
    ]
  },
  {
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "name": "SectionHeading",
    "sourceName": "SectionHeading",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/data-display/SectionHeading",
    "tagName": "peaui-section-heading",
    "status": "stable",
    "props": [
      {
        "name": "size",
        "type": "SectionHeadingSize",
        "required": false,
        "description": "Wariant rozmiaru komponentu."
      },
      {
        "name": "as",
        "type": "SectionHeadingAs",
        "required": false,
        "description": "Atrybut HTML „as” konfigurujący komponent SectionHeading."
      },
      {
        "name": "variant",
        "type": "SectionHeadingVariant",
        "required": false,
        "description": "Wariant wizualny komponentu."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „data-testid” konfigurujący komponent SectionHeading."
      }
    ],
    "models": [],
    "events": [],
    "slots": [
      {
        "name": "title",
        "description": "Treść osadzana w nazwanym slocie „title”."
      },
      {
        "name": "hint",
        "description": "Treść osadzana w nazwanym slocie „hint”."
      },
      {
        "name": "description",
        "description": "Treść osadzana w nazwanym slocie „description”."
      }
    ]
  },
  {
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "name": "TableList",
    "sourceName": "TableList",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/data-display/TableList",
    "tagName": "peaui-table-list",
    "status": "stable",
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": false,
        "default": "list",
        "description": "Unikalny identyfikator elementu w dokumencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "aria-label",
        "type": "string",
        "required": false,
        "default": "Tabela danych",
        "description": "Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "is-detials",
        "type": "boolean",
        "required": false,
        "description": "Konfiguruje właściwość „is detials” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "additional",
        "type": "Record<string, any>",
        "required": false,
        "description": "Konfiguruje właściwość „additional” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "can-create",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Włącza możliwość dodawania nowych rekordów. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "can-select-rows",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Włącza możliwość zaznaczania wierszy. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "can-check-rows",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „can check rows” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "can-hide-columns",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Pozwala użytkownikowi sterować widocznością kolumn. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "can-multi-sort",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „can multi sort” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "columns",
        "type": "TableColumn[] | any[]",
        "required": true,
        "description": "Definicje kolumn określające ich etykiety, klucze i sposób renderowania. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "editable",
        "type": "boolean",
        "required": false,
        "description": "Włącza tryb edycji danych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "empty-description",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Konfiguruje właściwość „empty description” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "empty-description-inline",
        "type": "string",
        "required": false,
        "description": "Konfiguruje właściwość „empty description inline” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "records",
        "type": "any[]",
        "required": true,
        "description": "Kolekcja rekordów prezentowanych przez komponent. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "rows-per-page",
        "type": "number",
        "required": false,
        "default": "10",
        "description": "Liczba rekordów wyświetlanych na jednej stronie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "current-checked-row",
        "type": "number | string",
        "required": false,
        "description": "Konfiguruje właściwość „current checked row” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "rows-total",
        "type": "number",
        "required": false,
        "description": "Konfiguruje właściwość „rows total” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "selected-rows",
        "type": "string[]",
        "required": false,
        "default": "[]",
        "description": "Identyfikatory aktualnie zaznaczonych wierszy. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "sort-column",
        "type": "string",
        "required": false,
        "default": "updatedAt",
        "description": "Konfiguruje właściwość „sort column” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "sort-columns",
        "type": "TableSortState[]",
        "required": false,
        "default": "[]",
        "description": "Konfiguruje właściwość „sort columns” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "sort-type",
        "type": "TableSortDirection",
        "required": false,
        "default": "DESC",
        "description": "Konfiguruje właściwość „sort type” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "button-editable-create-text",
        "type": "string",
        "required": false,
        "default": "Dodaj",
        "description": "Konfiguruje właściwość „button editable create text” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "title-remove-label",
        "type": "string",
        "required": false,
        "default": "Czy na pewno chcesz usunąć wybrany rekord?",
        "description": "Konfiguruje właściwość „title remove label” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "description-remove-label",
        "type": "string",
        "required": false,
        "default": "Usunięcie spowoduje trwałe usunięcie rekordu.",
        "description": "Konfiguruje właściwość „description remove label” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "is-loading",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Włącza stan ładowania i informuje o trwającej operacji. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "scroll",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „scroll” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [],
    "events": [
      {
        "name": "on:action",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:action”."
      },
      {
        "name": "on:createRecord",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:createRecord”."
      },
      {
        "name": "on:dblclick",
        "description": "Emitowane po dwukrotnym kliknięciu wiersza; przekazuje identyfikator i rekord."
      },
      {
        "name": "on:dbclick",
        "description": "Przestarzała nazwa zdarzenia dwukrotnego kliknięcia. Użyj „on:dblclick”."
      },
      {
        "name": "on:select:row",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:select:row”."
      },
      {
        "name": "on:sort",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:sort”."
      },
      {
        "name": "on:cancel",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:cancel”."
      },
      {
        "name": "on:check:row",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:check:row”."
      },
      {
        "name": "on:submit",
        "description": "Emitowane po zatwierdzeniu danych."
      },
      {
        "name": "on:changeValue",
        "description": "Emitowane po zmianie wartości komórki; przekazuje identyfikator rekordu i nową wartość."
      }
    ],
    "slots": [
      {
        "name": "[`hint.${column.key}`]",
        "description": "Treść osadzana w nazwanym slocie „[`hint.${column.key}`]”."
      },
      {
        "name": "detials-record",
        "description": "Treść osadzana w nazwanym slocie „detials-record”."
      },
      {
        "name": "additionalRow",
        "description": "Treść osadzana w nazwanym slocie „additionalRow”."
      }
    ]
  },
  {
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "name": "TableListFooter",
    "sourceName": "TableListFooter",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/data-display/TableListFooter",
    "tagName": "peaui-table-list-footer",
    "status": "stable",
    "props": [
      {
        "name": "rows-number",
        "type": "number",
        "required": true,
        "description": "Konfiguruje właściwość „rows number” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "rows-per-page",
        "type": "number",
        "required": true,
        "description": "Liczba rekordów wyświetlanych na jednej stronie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "page",
        "type": "number",
        "required": true,
        "description": "Numer aktualnie wybranej strony. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "total",
        "type": "number",
        "required": true,
        "description": "Łączna liczba elementów. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "under",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „under” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "is-flex",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „is flex” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [],
    "events": [
      {
        "name": "on:change:page",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:change:page”."
      },
      {
        "name": "on:change:limit",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:change:limit”."
      }
    ],
    "slots": []
  },
  {
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "name": "TableListHeader",
    "sourceName": "TableListHeader",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/data-display/TableListHeader",
    "tagName": "peaui-table-list-header",
    "status": "stable",
    "props": [
      {
        "name": "button-create-label",
        "type": "string",
        "required": false,
        "default": "Dodaj rekord",
        "description": "Konfiguruje właściwość „button create label” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "can-create",
        "type": "boolean",
        "required": false,
        "description": "Włącza możliwość dodawania nowych rekordów. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "can-export",
        "type": "boolean",
        "required": false,
        "description": "Konfiguruje właściwość „can export” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "can-filter",
        "type": "boolean",
        "required": false,
        "description": "Konfiguruje właściwość „can filter” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "can-search",
        "type": "boolean",
        "required": false,
        "description": "Konfiguruje właściwość „can search” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "count-filters",
        "type": "number",
        "required": false,
        "description": "Konfiguruje właściwość „count filters” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "count-selected-records",
        "type": "number",
        "required": false,
        "description": "Konfiguruje właściwość „count selected records” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "search-placeholder",
        "type": "string",
        "required": false,
        "description": "Konfiguruje właściwość „search placeholder” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "total-records",
        "type": "number",
        "required": false,
        "description": "Konfiguruje właściwość „total records” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "user-id",
        "type": "string",
        "required": false,
        "description": "Konfiguruje właściwość „user id” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "force-export",
        "type": "boolean",
        "required": false,
        "description": "Konfiguruje właściwość „force export” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [
      {
        "name": "filters-open",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Wartość kontrolowana przez v-model:filters-open. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "events": [
      {
        "name": "on:search",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:search”."
      },
      {
        "name": "on:reset-filters",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:reset-filters”."
      },
      {
        "name": "on:create",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:create”."
      },
      {
        "name": "on:export",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:export”."
      },
      {
        "name": "update:filters-open",
        "description": "Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „filters-open”."
      }
    ],
    "slots": [
      {
        "name": "filters-drawer",
        "description": "Treść osadzana w nazwanym slocie „filters-drawer”."
      },
      {
        "name": "additional-buttons",
        "description": "Treść osadzana w nazwanym slocie „additional-buttons”."
      },
      {
        "name": "addtional-content",
        "description": "Treść osadzana w nazwanym slocie „addtional-content”."
      },
      {
        "name": "addtional-description",
        "description": "Treść osadzana w nazwanym slocie „addtional-description”."
      }
    ]
  },
  {
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "name": "TagChip",
    "sourceName": "TagChip",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/data-display/TagChip",
    "tagName": "peaui-tag-chip",
    "status": "stable",
    "props": [
      {
        "name": "label",
        "type": "string",
        "required": false,
        "description": "Widoczna etykieta opisująca element lub pole formularza."
      },
      {
        "name": "size",
        "type": "TagChipSize",
        "required": false,
        "description": "Wariant rozmiaru komponentu."
      },
      {
        "name": "variant",
        "type": "TagChipVariant",
        "required": false,
        "description": "Wariant wizualny komponentu."
      },
      {
        "name": "active",
        "type": "boolean",
        "required": false,
        "description": "Określa aktywny element albo aktywny krok."
      },
      {
        "name": "as",
        "type": "TagChipAs",
        "required": false,
        "description": "Atrybut HTML „as” konfigurujący komponent TagChip."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „data-testid” konfigurujący komponent TagChip."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje."
      }
    ],
    "models": [],
    "events": [],
    "slots": []
  },
  {
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "name": "TreeList",
    "sourceName": "TreeList",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/data-display/TreeList",
    "tagName": "peaui-tree-list",
    "status": "stable",
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": false,
        "description": "Unikalny identyfikator elementu w dokumencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "level",
        "type": "number",
        "required": false,
        "default": "1",
        "description": "Konfiguruje właściwość „level” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "is-last",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „is last” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "can-remove",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „can remove” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [
      {
        "name": "tree",
        "type": "TreeListType",
        "required": true,
        "description": "Dane drzewa kontrolowane przez v-model:tree. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "events": [
      {
        "name": "on:remove",
        "description": "Emitowane po wybraniu akcji usunięcia."
      },
      {
        "name": "update:tree",
        "description": "Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „tree”."
      }
    ],
    "slots": [
      {
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      }
    ]
  },
  {
    "category": "data-entry",
    "categoryLabel": "Wprowadzanie danych",
    "name": "ButtonAction",
    "sourceName": "ButtonAction",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/data-entry/ButtonAction",
    "tagName": "peaui-button-action",
    "status": "stable",
    "props": [
      {
        "name": "size",
        "type": "ButtonSize",
        "required": false,
        "description": "Wariant rozmiaru komponentu."
      },
      {
        "name": "variant",
        "type": "ButtonVariant",
        "required": false,
        "description": "Wariant wizualny komponentu."
      },
      {
        "name": "type",
        "type": "ButtonType",
        "required": false,
        "description": "Wariant funkcjonalny lub wizualny komponentu."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „data-testid” konfigurujący komponent ButtonAction."
      },
      {
        "name": "use-aria-label",
        "type": "boolean",
        "required": false,
        "description": "Atrybut HTML „use-aria-label” konfigurujący komponent ButtonAction."
      },
      {
        "name": "aria-label",
        "type": "string | null",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      },
      {
        "name": "aria-labelledby",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „aria-labelledby” konfigurujący komponent ButtonAction."
      },
      {
        "name": "class",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „class” konfigurujący komponent ButtonAction."
      },
      {
        "name": "style",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „style” konfigurujący komponent ButtonAction."
      },
      {
        "name": "id",
        "type": "string",
        "required": false,
        "description": "Unikalny identyfikator elementu w dokumencie."
      },
      {
        "name": "name",
        "type": "string",
        "required": false,
        "description": "Nazwa pola używana przez formularz lub nazwa zasobu."
      },
      {
        "name": "title",
        "type": "string",
        "required": false,
        "description": "Główny tytuł prezentowany w komponencie."
      }
    ],
    "models": [],
    "events": [],
    "slots": [
      {
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      }
    ]
  },
  {
    "category": "data-entry",
    "categoryLabel": "Wprowadzanie danych",
    "name": "ButtonExport",
    "sourceName": "ButtonExport",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/data-entry/ButtonExport",
    "tagName": "peaui-button-export",
    "status": "stable",
    "props": [
      {
        "name": "size",
        "type": "'xs' | 's' | 'm' | 'l'",
        "required": false,
        "default": "m",
        "description": "Wariant rozmiaru komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "variant",
        "type": "'primary' | 'secondary' | 'ghost' | 'danger'",
        "required": false,
        "default": "secondary",
        "description": "Wariant wizualny komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "type",
        "type": "'button' | 'submit' | 'reset'",
        "required": false,
        "description": "Wariant funkcjonalny lub wizualny komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "aria-label",
        "type": "string",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "placement",
        "type": "| 'top'\n  | 'right'\n  | 'bottom'\n  | 'left'\n  | 'top-left'\n  | 'top-right'\n  | 'bottom-left'\n  | 'bottom-right'",
        "required": false,
        "default": "bottom",
        "description": "Konfiguruje właściwość „placement” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "selected-items-count",
        "type": "number",
        "required": false,
        "default": "0",
        "description": "Konfiguruje właściwość „selected items count” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "force-export",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „force export” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "use-aria-label",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „use aria label” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [],
    "events": [
      {
        "name": "on:export",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:export”."
      }
    ],
    "slots": [
      {
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      }
    ]
  },
  {
    "category": "data-entry",
    "categoryLabel": "Wprowadzanie danych",
    "name": "InputSlider",
    "sourceName": "InputSlider",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/data-entry/InputSlider",
    "tagName": "peaui-input-slider",
    "status": "stable",
    "props": [
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Nazwa pola używana przez formularz lub nazwa zasobu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "aria-label",
        "type": "string",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [
      {
        "name": "value",
        "type": "number",
        "required": false,
        "default": "0",
        "description": "Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "events": [
      {
        "name": "update:value",
        "description": "Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”."
      }
    ],
    "slots": []
  },
  {
    "category": "data-entry",
    "categoryLabel": "Wprowadzanie danych",
    "name": "SearchInput",
    "sourceName": "SearchInput",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/data-entry/SearchInput",
    "tagName": "peaui-search-input",
    "status": "stable",
    "props": [
      {
        "name": "aria-label",
        "type": "string",
        "required": false,
        "default": "Pole wyszukiwania",
        "description": "Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "placeholder",
        "type": "string",
        "required": false,
        "default": "Wpisz czego szukasz",
        "description": "Tekst pomocniczy widoczny przed wprowadzeniem wartości. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "debounce-time",
        "type": "number",
        "required": false,
        "default": "1000",
        "description": "Konfiguruje właściwość „debounce time” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [
      {
        "name": "value",
        "type": "string | undefined",
        "required": false,
        "description": "Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "events": [
      {
        "name": "on:search",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:search”."
      },
      {
        "name": "on:remove",
        "description": "Emitowane po wybraniu akcji usunięcia."
      },
      {
        "name": "update:value",
        "description": "Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”."
      }
    ],
    "slots": []
  },
  {
    "category": "data-entry",
    "categoryLabel": "Wprowadzanie danych",
    "name": "SelectableCard",
    "sourceName": "SelectableCard",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/data-entry/SelectableCard",
    "tagName": "peaui-selectable-card",
    "status": "stable",
    "props": [
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "readonly",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Ustawia komponent w trybie tylko do odczytu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "active",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Określa aktywny element albo aktywny krok. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "aria-label",
        "type": "string",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [],
    "events": [],
    "slots": [
      {
        "name": "title",
        "description": "Treść osadzana w nazwanym slocie „title”."
      },
      {
        "name": "description",
        "description": "Treść osadzana w nazwanym slocie „description”."
      },
      {
        "name": "additional",
        "description": "Treść osadzana w nazwanym slocie „additional”."
      },
      {
        "name": "hint",
        "description": "Treść osadzana w nazwanym slocie „hint”."
      }
    ]
  },
  {
    "category": "feedback",
    "categoryLabel": "Informacje zwrotne",
    "name": "EmptyState",
    "sourceName": "EmptyState",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/feedback/EmptyState",
    "tagName": "peaui-empty-state",
    "status": "stable",
    "props": [
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "title",
        "type": "string",
        "required": false,
        "description": "Główny tytuł prezentowany w komponencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "description",
        "type": "string",
        "required": false,
        "description": "Dodatkowy opis objaśniający zawartość albo stan komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [],
    "events": [],
    "slots": [
      {
        "name": "additional",
        "description": "Treść osadzana w nazwanym slocie „additional”."
      }
    ]
  },
  {
    "category": "feedback",
    "categoryLabel": "Informacje zwrotne",
    "name": "MessageText",
    "sourceName": "MessageText",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/feedback/MessageText",
    "tagName": "peaui-message-text",
    "status": "stable",
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": false,
        "description": "Unikalny identyfikator elementu w dokumencie."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „data-testid” konfigurujący komponent MessageText."
      },
      {
        "name": "variant",
        "type": "MessageTextVariant",
        "required": false,
        "description": "Wariant wizualny komponentu."
      },
      {
        "name": "size",
        "type": "MessageTextSize",
        "required": false,
        "description": "Wariant rozmiaru komponentu."
      },
      {
        "name": "with-icon",
        "type": "boolean",
        "required": false,
        "description": "Atrybut HTML „with-icon” konfigurujący komponent MessageText."
      },
      {
        "name": "own-icon",
        "type": "string | undefined",
        "required": false,
        "description": "Atrybut HTML „own-icon” konfigurujący komponent MessageText."
      }
    ],
    "models": [],
    "events": [],
    "slots": [
      {
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      }
    ]
  },
  {
    "category": "feedback",
    "categoryLabel": "Informacje zwrotne",
    "name": "ProgressIndicator",
    "sourceName": "ProgressIndicator",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/feedback/ProgressIndicator",
    "tagName": "peaui-progress-indicator",
    "status": "stable",
    "props": [
      {
        "name": "steps",
        "type": "number",
        "required": true,
        "description": "Konfiguruje właściwość „steps” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "active",
        "type": "number",
        "required": false,
        "description": "Określa aktywny element albo aktywny krok. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "size",
        "type": "number",
        "required": false,
        "description": "Wariant rozmiaru komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "stroke-width",
        "type": "number",
        "required": false,
        "description": "Konfiguruje właściwość „stroke width” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "remove-active",
        "type": "boolean",
        "required": false,
        "description": "Konfiguruje właściwość „remove active” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [],
    "events": [],
    "slots": []
  },
  {
    "category": "feedback",
    "categoryLabel": "Informacje zwrotne",
    "name": "SkeletonLoading",
    "sourceName": "SkeletonLoading",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/feedback/SkeletonLoading",
    "tagName": "peaui-skeleton-loading",
    "status": "stable",
    "props": [
      {
        "name": "size",
        "type": "'xs' | 's' | 'm' | 'l'",
        "required": false,
        "default": "m",
        "description": "Wariant rozmiaru komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "rounded",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „rounded” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "aria-label",
        "type": "string",
        "required": false,
        "default": "Trwa ladowanie tresci.",
        "description": "Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [],
    "events": [],
    "slots": []
  },
  {
    "category": "feedback",
    "categoryLabel": "Informacje zwrotne",
    "name": "SpinnerLoader",
    "sourceName": "SpinnerLoader",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/feedback/SpinnerLoader",
    "tagName": "peaui-spinner-loader",
    "status": "stable",
    "props": [
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [],
    "events": [],
    "slots": []
  },
  {
    "category": "feedback",
    "categoryLabel": "Informacje zwrotne",
    "name": "ToastAlert",
    "sourceName": "ToastAlert",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/feedback/ToastAlert",
    "tagName": "peaui-toast-alert",
    "status": "stable",
    "props": [
      {
        "name": "variant",
        "type": "ToastAlertVariant",
        "required": false,
        "description": "Wariant wizualny komponentu."
      },
      {
        "name": "title",
        "type": "string",
        "required": false,
        "description": "Główny tytuł prezentowany w komponencie."
      },
      {
        "name": "description",
        "type": "string | undefined",
        "required": false,
        "description": "Dodatkowy opis objaśniający zawartość albo stan komponentu."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „data-testid” konfigurujący komponent ToastAlert."
      },
      {
        "name": "size",
        "type": "ToastAlertSize",
        "required": false,
        "description": "Wariant rozmiaru komponentu."
      },
      {
        "name": "with-shadow",
        "type": "boolean",
        "required": false,
        "description": "Atrybut HTML „with-shadow” konfigurujący komponent ToastAlert."
      },
      {
        "name": "with-border",
        "type": "boolean",
        "required": false,
        "description": "Atrybut HTML „with-border” konfigurujący komponent ToastAlert."
      },
      {
        "name": "can-close",
        "type": "boolean",
        "required": false,
        "description": "Atrybut HTML „can-close” konfigurujący komponent ToastAlert."
      }
    ],
    "models": [],
    "events": [
      {
        "name": "on:close",
        "description": "Emitowane podczas zamykania komponentu."
      }
    ],
    "slots": []
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FieldLabel",
    "sourceName": "FieldLabel",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/form/FieldLabel",
    "tagName": "peaui-field-label",
    "status": "stable",
    "props": [
      {
        "name": "for",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „for” konfigurujący komponent FieldLabel."
      },
      {
        "name": "text",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „text” konfigurujący komponent FieldLabel."
      },
      {
        "name": "readonly",
        "type": "string",
        "required": false,
        "description": "Ustawia komponent w trybie tylko do odczytu."
      },
      {
        "name": "required",
        "type": "boolean | undefined",
        "required": false,
        "description": "Oznacza wartość jako wymaganą."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „data-testid” konfigurujący komponent FieldLabel."
      },
      {
        "name": "class",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „class” konfigurujący komponent FieldLabel."
      },
      {
        "name": "['for']",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „['for']” konfigurujący komponent FieldLabel."
      },
      {
        "name": "['readonly']",
        "type": "boolean",
        "required": false,
        "description": "Atrybut HTML „['readonly']” konfigurujący komponent FieldLabel."
      }
    ],
    "models": [],
    "events": [],
    "slots": [
      {
        "name": "hint",
        "description": "Treść osadzana w nazwanym slocie „hint”."
      }
    ]
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FormButtonCheckbox",
    "sourceName": "FormButtonCheckbox",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/form/FormButtonCheckbox",
    "tagName": "peaui-form-button-checkbox",
    "status": "stable",
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": true,
        "description": "Unikalny identyfikator elementu w dokumencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Nazwa pola używana przez formularz lub nazwa zasobu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "is-valid",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Konfiguruje właściwość „is valid” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "required",
        "type": "boolean",
        "required": false,
        "description": "Oznacza wartość jako wymaganą. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "size",
        "type": "'xxs' | 'xs' | 's' | 'm' | 'l'",
        "required": false,
        "default": "m",
        "description": "Wariant rozmiaru komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "aria-label",
        "type": "string",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [
      {
        "name": "value",
        "type": "boolean | undefined",
        "required": true,
        "description": "Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "events": [
      {
        "name": "update:value",
        "description": "Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”."
      }
    ],
    "slots": [
      {
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      }
    ]
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FormButtonGroup",
    "sourceName": "FormButtonGroup",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/form/FormButtonGroup",
    "tagName": "peaui-form-button-group",
    "status": "stable",
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": true,
        "description": "Unikalny identyfikator elementu w dokumencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Nazwa pola używana przez formularz lub nazwa zasobu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "description": "Widoczna etykieta opisująca element lub pole formularza. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "size",
        "type": "'xs' | 's' | 'm' | 'l'",
        "required": false,
        "default": "m",
        "description": "Wariant rozmiaru komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "is-toggle",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „is toggle” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "required",
        "type": "boolean",
        "required": false,
        "description": "Oznacza wartość jako wymaganą. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "readonly",
        "type": "boolean",
        "required": false,
        "description": "Ustawia komponent w trybie tylko do odczytu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "options",
        "type": "ButtonGroupOption[]",
        "required": true,
        "description": "Lista opcji dostępnych do wyświetlenia lub wyboru. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [
      {
        "name": "value",
        "type": "string | number | undefined",
        "required": true,
        "description": "Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "events": [
      {
        "name": "update:value",
        "description": "Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”."
      }
    ],
    "slots": [
      {
        "name": "hint",
        "description": "Treść osadzana w nazwanym slocie „hint”."
      },
      {
        "name": "additionalHint",
        "description": "Treść osadzana w nazwanym slocie „additionalHint”."
      },
      {
        "name": "description",
        "description": "Treść osadzana w nazwanym slocie „description”."
      },
      {
        "name": "error",
        "description": "Treść osadzana w nazwanym slocie „error”."
      },
      {
        "name": "success",
        "description": "Treść osadzana w nazwanym slocie „success”."
      }
    ]
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FormCheckbox",
    "sourceName": "FormCheckbox",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/form/FormCheckbox",
    "tagName": "peaui-form-checkbox",
    "status": "stable",
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": true,
        "description": "Unikalny identyfikator elementu w dokumencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Nazwa pola używana przez formularz lub nazwa zasobu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "is-valid",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Konfiguruje właściwość „is valid” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "required",
        "type": "boolean",
        "required": false,
        "description": "Oznacza wartość jako wymaganą. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [
      {
        "name": "value",
        "type": "boolean | undefined",
        "required": true,
        "description": "Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "events": [
      {
        "name": "update:value",
        "description": "Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”."
      }
    ],
    "slots": [
      {
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      }
    ]
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FormContainer",
    "sourceName": "FormContainer",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/form/FormContainer",
    "tagName": "peaui-form-container",
    "status": "stable",
    "props": [
      {
        "name": "label",
        "type": "string",
        "required": true,
        "description": "Widoczna etykieta opisująca element lub pole formularza. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "submit-button-label",
        "type": "string",
        "required": false,
        "default": "Zapisz",
        "description": "Konfiguruje właściwość „submit button label” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "is-loading",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Włącza stan ładowania i informuje o trwającej operacji. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "show-actions",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Konfiguruje właściwość „show actions” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "cancel-button-label",
        "type": "string",
        "required": false,
        "default": "Anuluj",
        "description": "Konfiguruje właściwość „cancel button label” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "actions-position",
        "type": "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
        "required": false,
        "default": "bottom-left",
        "description": "Konfiguruje właściwość „actions position” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "show-cancel-button",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Konfiguruje właściwość „show cancel button” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "size-button",
        "type": "'xxs' | 'xs' | 's' | 'm' | 'l'",
        "required": false,
        "default": "xs",
        "description": "Konfiguruje właściwość „size button” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "use-aria-labelledby",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Konfiguruje właściwość „use aria labelledby” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [],
    "events": [
      {
        "name": "on:cancel",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:cancel”."
      },
      {
        "name": "on:submit",
        "description": "Emitowane po zatwierdzeniu danych."
      }
    ],
    "slots": [
      {
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      },
      {
        "name": "additional-before",
        "description": "Treść osadzana w nazwanym slocie „additional-before”."
      },
      {
        "name": "additional-after",
        "description": "Treść osadzana w nazwanym slocie „additional-after”."
      }
    ]
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FormDatePicker",
    "sourceName": "FormDatePicker",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/form/FormDatePicker",
    "tagName": "peaui-form-date-picker",
    "status": "stable",
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": true,
        "description": "Unikalny identyfikator elementu w dokumencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "can-erase",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Pokazuje akcję pozwalającą wyczyścić bieżącą wartość. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "after",
        "type": "string",
        "required": false,
        "description": "Treść wyświetlana za właściwą wartością pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "before",
        "type": "string",
        "required": false,
        "description": "Treść wyświetlana przed właściwą wartością pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Nazwa pola używana przez formularz lub nazwa zasobu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "description": "Widoczna etykieta opisująca element lub pole formularza. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "icon-before",
        "type": "string",
        "required": false,
        "description": "Nazwa ikony wyświetlanej przed treścią pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "required",
        "type": "boolean",
        "required": false,
        "description": "Oznacza wartość jako wymaganą. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "placeholder",
        "type": "string",
        "required": false,
        "default": "wybierz date",
        "description": "Tekst pomocniczy widoczny przed wprowadzeniem wartości. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "range",
        "type": "boolean",
        "required": false,
        "description": "Konfiguruje właściwość „range” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "min-date",
        "type": "string",
        "required": false,
        "description": "Konfiguruje właściwość „min date” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "max-date",
        "type": "string",
        "required": false,
        "description": "Konfiguruje właściwość „max date” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "min",
        "type": "string",
        "required": false,
        "description": "Minimalna dozwolona wartość. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "max",
        "type": "string",
        "required": false,
        "description": "Maksymalna dozwolona wartość albo szerokość. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "readonly",
        "type": "boolean",
        "required": false,
        "description": "Ustawia komponent w trybie tylko do odczytu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [
      {
        "name": "value",
        "type": "string | DatePickerRangeValue | undefined",
        "required": true,
        "description": "Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "events": [
      {
        "name": "on:remove",
        "description": "Emitowane po wybraniu akcji usunięcia."
      },
      {
        "name": "update:value",
        "description": "Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”."
      }
    ],
    "slots": [
      {
        "name": "hint",
        "description": "Treść osadzana w nazwanym slocie „hint”."
      },
      {
        "name": "description",
        "description": "Treść osadzana w nazwanym slocie „description”."
      },
      {
        "name": "error",
        "description": "Treść osadzana w nazwanym slocie „error”."
      },
      {
        "name": "success",
        "description": "Treść osadzana w nazwanym slocie „success”."
      }
    ]
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FormField",
    "sourceName": "FormField",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/form/FormField",
    "tagName": "peaui-form-field",
    "status": "stable",
    "props": [
      {
        "name": "after",
        "type": "string",
        "required": false,
        "description": "Treść wyświetlana za właściwą wartością pola."
      },
      {
        "name": "before",
        "type": "string",
        "required": false,
        "description": "Treść wyświetlana przed właściwą wartością pola."
      },
      {
        "name": "can-erase",
        "type": "boolean",
        "required": false,
        "description": "Pokazuje akcję pozwalającą wyczyścić bieżącą wartość."
      },
      {
        "name": "class",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „class” konfigurujący komponent FormField."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „data-testid” konfigurujący komponent FormField."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje."
      },
      {
        "name": "icon-after",
        "type": "string | undefined",
        "required": false,
        "description": "Nazwa ikony wyświetlanej za treścią pola."
      },
      {
        "name": "icon-before",
        "type": "string | undefined",
        "required": false,
        "description": "Nazwa ikony wyświetlanej przed treścią pola."
      },
      {
        "name": "id",
        "type": "string",
        "required": false,
        "description": "Unikalny identyfikator elementu w dokumencie."
      },
      {
        "name": "label",
        "type": "string | undefined",
        "required": false,
        "description": "Widoczna etykieta opisująca element lub pole formularza."
      },
      {
        "name": "max-length",
        "type": "number | undefined",
        "required": false,
        "description": "Maksymalna liczba znaków możliwa do wprowadzenia."
      },
      {
        "name": "name",
        "type": "string",
        "required": false,
        "description": "Nazwa pola używana przez formularz lub nazwa zasobu."
      },
      {
        "name": "placeholder",
        "type": "string | undefined",
        "required": false,
        "description": "Tekst pomocniczy widoczny przed wprowadzeniem wartości."
      },
      {
        "name": "readonly",
        "type": "boolean",
        "required": false,
        "description": "Ustawia komponent w trybie tylko do odczytu."
      },
      {
        "name": "required",
        "type": "boolean",
        "required": false,
        "description": "Oznacza wartość jako wymaganą."
      },
      {
        "name": "right-erase-position",
        "type": "number | undefined",
        "required": false,
        "description": "Atrybut HTML „right-erase-position” konfigurujący komponent FormField."
      },
      {
        "name": "value",
        "type": "FormFieldValue",
        "required": false,
        "description": "Bieżąca wartość kontrolowana przez v-model."
      },
      {
        "name": "aria-label",
        "type": "string",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      },
      {
        "name": "aria-labelledby",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „aria-labelledby” konfigurujący komponent FormField."
      }
    ],
    "models": [],
    "events": [
      {
        "name": "on:remove",
        "description": "Emitowane po wybraniu akcji usunięcia."
      }
    ],
    "slots": [
      {
        "name": "hint",
        "description": "Treść osadzana w nazwanym slocie „hint”."
      },
      {
        "name": "additional",
        "description": "Treść osadzana w nazwanym slocie „additional”."
      },
      {
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      },
      {
        "name": "description",
        "description": "Treść osadzana w nazwanym slocie „description”."
      },
      {
        "name": "error",
        "description": "Treść osadzana w nazwanym slocie „error”."
      },
      {
        "name": "success",
        "description": "Treść osadzana w nazwanym slocie „success”."
      }
    ]
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FormFileUpload",
    "sourceName": "FormFileUpload",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/form/FormFileUpload",
    "tagName": "peaui-form-file-upload",
    "status": "stable",
    "props": [
      {
        "name": "allowed-types",
        "type": "string[]",
        "required": false,
        "default": "['image/jpeg', 'image/png', 'image/jpg']",
        "description": "Konfiguruje właściwość „allowed types” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "max-file-size",
        "type": "number",
        "required": false,
        "default": "5 * 1024 * 1024",
        "description": "Konfiguruje właściwość „max file size” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "variant",
        "type": "'primary' | 'danger'",
        "required": false,
        "default": "primary",
        "description": "Wariant wizualny komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "default": "undefined",
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [
      {
        "name": "file",
        "type": "FormFileUploadValue | undefined",
        "required": false,
        "description": "Wybrany plik kontrolowany przez v-model:file. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "events": [
      {
        "name": "on:remove",
        "description": "Emitowane po wybraniu akcji usunięcia."
      },
      {
        "name": "update:file",
        "description": "Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „file”."
      }
    ],
    "slots": []
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FormFileUploadSimple",
    "sourceName": "FormFileUploadSimple",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/form/FormFileUploadSimple",
    "tagName": "peaui-form-file-upload-simple",
    "status": "stable",
    "props": [
      {
        "name": "allowed-types",
        "type": "string[]",
        "required": false,
        "default": "[\n      'application/msword',\n      'application/pdf',\n      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',\n      'image/jpeg',\n      'image/jpg',\n      'image/png',\n    ]",
        "description": "Konfiguruje właściwość „allowed types” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "context",
        "type": "string",
        "required": false,
        "default": "undefined",
        "description": "Konfiguruje właściwość „context” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "max-file-size",
        "type": "number",
        "required": false,
        "default": "5 * 1024 * 1024",
        "description": "Konfiguruje właściwość „max file size” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "max-files",
        "type": "number",
        "required": false,
        "default": "4",
        "description": "Konfiguruje właściwość „max files” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "default": "undefined",
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [
      {
        "name": "files",
        "type": "File[]",
        "required": true,
        "description": "Lista wybranych plików kontrolowana przez v-model:files. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "events": [
      {
        "name": "update:files",
        "description": "Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „files”."
      }
    ],
    "slots": []
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FormInput",
    "sourceName": "FormInput",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/form/FormInput",
    "tagName": "peaui-form-input",
    "status": "stable",
    "props": [
      {
        "name": "after",
        "type": "string",
        "required": false,
        "description": "Treść wyświetlana za właściwą wartością pola."
      },
      {
        "name": "before",
        "type": "string",
        "required": false,
        "description": "Treść wyświetlana przed właściwą wartością pola."
      },
      {
        "name": "can-erase",
        "type": "boolean",
        "required": false,
        "description": "Pokazuje akcję pozwalającą wyczyścić bieżącą wartość."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „data-testid” konfigurujący komponent FormInput."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje."
      },
      {
        "name": "icon-after",
        "type": "string | undefined",
        "required": false,
        "description": "Nazwa ikony wyświetlanej za treścią pola."
      },
      {
        "name": "icon-before",
        "type": "string | undefined",
        "required": false,
        "description": "Nazwa ikony wyświetlanej przed treścią pola."
      },
      {
        "name": "id",
        "type": "string",
        "required": false,
        "description": "Unikalny identyfikator elementu w dokumencie."
      },
      {
        "name": "label",
        "type": "string | undefined",
        "required": false,
        "description": "Widoczna etykieta opisująca element lub pole formularza."
      },
      {
        "name": "max-length",
        "type": "number | undefined",
        "required": false,
        "description": "Maksymalna liczba znaków możliwa do wprowadzenia."
      },
      {
        "name": "name",
        "type": "string",
        "required": false,
        "description": "Nazwa pola używana przez formularz lub nazwa zasobu."
      },
      {
        "name": "placeholder",
        "type": "string",
        "required": false,
        "description": "Tekst pomocniczy widoczny przed wprowadzeniem wartości."
      },
      {
        "name": "readonly",
        "type": "boolean",
        "required": false,
        "description": "Ustawia komponent w trybie tylko do odczytu."
      },
      {
        "name": "required",
        "type": "boolean",
        "required": false,
        "description": "Oznacza wartość jako wymaganą."
      },
      {
        "name": "value",
        "type": "string | undefined",
        "required": false,
        "description": "Bieżąca wartość kontrolowana przez v-model."
      }
    ],
    "models": [],
    "events": [
      {
        "name": "update:value",
        "description": "Natywne zdarzenie CustomEvent „update:value” emitowane przez element."
      },
      {
        "name": "on:remove",
        "description": "Emitowane po wybraniu akcji usunięcia."
      }
    ],
    "slots": [
      {
        "name": "hint",
        "description": "Treść osadzana w nazwanym slocie „hint”."
      },
      {
        "name": "description",
        "description": "Treść osadzana w nazwanym slocie „description”."
      },
      {
        "name": "error",
        "description": "Treść osadzana w nazwanym slocie „error”."
      },
      {
        "name": "success",
        "description": "Treść osadzana w nazwanym slocie „success”."
      }
    ]
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FormMultiSelect",
    "sourceName": "FormMultiSelect",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/form/FormMultiSelect",
    "tagName": "peaui-form-multi-select",
    "status": "stable",
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": true,
        "description": "Unikalny identyfikator elementu w dokumencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "can-erase",
        "type": "boolean",
        "required": false,
        "description": "Pokazuje akcję pozwalającą wyczyścić bieżącą wartość. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "after",
        "type": "string",
        "required": false,
        "description": "Treść wyświetlana za właściwą wartością pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "before",
        "type": "string",
        "required": false,
        "description": "Treść wyświetlana przed właściwą wartością pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Nazwa pola używana przez formularz lub nazwa zasobu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "description": "Widoczna etykieta opisująca element lub pole formularza. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "icon-before",
        "type": "string",
        "required": false,
        "description": "Nazwa ikony wyświetlanej przed treścią pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "required",
        "type": "boolean",
        "required": false,
        "description": "Oznacza wartość jako wymaganą. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "placeholder",
        "type": "string",
        "required": false,
        "default": "wybierz/wyszukaj",
        "description": "Tekst pomocniczy widoczny przed wprowadzeniem wartości. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "readonly",
        "type": "boolean",
        "required": false,
        "description": "Ustawia komponent w trybie tylko do odczytu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "searchable",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Konfiguruje właściwość „searchable” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "with-select-all",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „with select all” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "options",
        "type": "MultiSelectFieldOption[]",
        "required": true,
        "description": "Lista opcji dostępnych do wyświetlenia lub wyboru. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "placement",
        "type": "'top' | 'bottom'",
        "required": false,
        "description": "Konfiguruje właściwość „placement” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [
      {
        "name": "value",
        "type": "unknown[] | null | undefined",
        "required": true,
        "description": "Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "events": [
      {
        "name": "on:remove",
        "description": "Emitowane po wybraniu akcji usunięcia."
      },
      {
        "name": "update:value",
        "description": "Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”."
      }
    ],
    "slots": [
      {
        "name": "hint",
        "description": "Treść osadzana w nazwanym slocie „hint”."
      },
      {
        "name": "description",
        "description": "Treść osadzana w nazwanym slocie „description”."
      },
      {
        "name": "error",
        "description": "Treść osadzana w nazwanym slocie „error”."
      },
      {
        "name": "success",
        "description": "Treść osadzana w nazwanym slocie „success”."
      }
    ]
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FormNumber",
    "sourceName": "FormNumber",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/form/FormNumber",
    "tagName": "peaui-form-number",
    "status": "stable",
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": true,
        "description": "Unikalny identyfikator elementu w dokumencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "can-erase",
        "type": "boolean",
        "required": false,
        "description": "Pokazuje akcję pozwalającą wyczyścić bieżącą wartość. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "after",
        "type": "string",
        "required": false,
        "description": "Treść wyświetlana za właściwą wartością pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "before",
        "type": "string",
        "required": false,
        "description": "Treść wyświetlana przed właściwą wartością pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Nazwa pola używana przez formularz lub nazwa zasobu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "description": "Widoczna etykieta opisująca element lub pole formularza. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "icon-before",
        "type": "string",
        "required": false,
        "description": "Nazwa ikony wyświetlanej przed treścią pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "icon-after",
        "type": "string",
        "required": false,
        "description": "Nazwa ikony wyświetlanej za treścią pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "max",
        "type": "number",
        "required": false,
        "description": "Maksymalna dozwolona wartość albo szerokość. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "min",
        "type": "number",
        "required": false,
        "description": "Minimalna dozwolona wartość. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "step",
        "type": "number",
        "required": false,
        "description": "Krok zmiany wartości liczbowej. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "required",
        "type": "boolean",
        "required": false,
        "description": "Oznacza wartość jako wymaganą. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "placeholder",
        "type": "string",
        "required": false,
        "default": "wpisz",
        "description": "Tekst pomocniczy widoczny przed wprowadzeniem wartości. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "readonly",
        "type": "boolean",
        "required": false,
        "description": "Ustawia komponent w trybie tylko do odczytu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "is-range-visible",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Konfiguruje właściwość „is range visible” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [
      {
        "name": "value",
        "type": "number | undefined | string",
        "required": true,
        "description": "Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "events": [
      {
        "name": "update:value",
        "description": "Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”."
      }
    ],
    "slots": [
      {
        "name": "hint",
        "description": "Treść osadzana w nazwanym slocie „hint”."
      },
      {
        "name": "description",
        "description": "Treść osadzana w nazwanym slocie „description”."
      },
      {
        "name": "error",
        "description": "Treść osadzana w nazwanym slocie „error”."
      },
      {
        "name": "success",
        "description": "Treść osadzana w nazwanym slocie „success”."
      }
    ]
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FormPassword",
    "sourceName": "FormPassword",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/form/FormPassword",
    "tagName": "peaui-form-password",
    "status": "stable",
    "props": [
      {
        "name": "before",
        "type": "string",
        "required": false,
        "description": "Treść wyświetlana przed właściwą wartością pola."
      },
      {
        "name": "can-copy",
        "type": "boolean",
        "required": false,
        "description": "Atrybut HTML „can-copy” konfigurujący komponent FormPassword."
      },
      {
        "name": "can-visible",
        "type": "boolean",
        "required": false,
        "description": "Atrybut HTML „can-visible” konfigurujący komponent FormPassword."
      },
      {
        "name": "copy-error-message",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „copy-error-message” konfigurujący komponent FormPassword."
      },
      {
        "name": "copy-password-aria-label",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „copy-password-aria-label” konfigurujący komponent FormPassword."
      },
      {
        "name": "copy-success-message",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „copy-success-message” konfigurujący komponent FormPassword."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „data-testid” konfigurujący komponent FormPassword."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje."
      },
      {
        "name": "enable-password-strength-meter",
        "type": "boolean",
        "required": false,
        "description": "Atrybut HTML „enable-password-strength-meter” konfigurujący komponent FormPassword."
      },
      {
        "name": "hide-password-aria-label",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „hide-password-aria-label” konfigurujący komponent FormPassword."
      },
      {
        "name": "icon-before",
        "type": "string | undefined",
        "required": false,
        "description": "Nazwa ikony wyświetlanej przed treścią pola."
      },
      {
        "name": "id",
        "type": "string",
        "required": false,
        "description": "Unikalny identyfikator elementu w dokumencie."
      },
      {
        "name": "label",
        "type": "string | undefined",
        "required": false,
        "description": "Widoczna etykieta opisująca element lub pole formularza."
      },
      {
        "name": "max-length",
        "type": "number | undefined",
        "required": false,
        "description": "Maksymalna liczba znaków możliwa do wprowadzenia."
      },
      {
        "name": "name",
        "type": "string",
        "required": false,
        "description": "Nazwa pola używana przez formularz lub nazwa zasobu."
      },
      {
        "name": "placeholder",
        "type": "string",
        "required": false,
        "description": "Tekst pomocniczy widoczny przed wprowadzeniem wartości."
      },
      {
        "name": "readonly",
        "type": "boolean",
        "required": false,
        "description": "Ustawia komponent w trybie tylko do odczytu."
      },
      {
        "name": "required",
        "type": "boolean",
        "required": false,
        "description": "Oznacza wartość jako wymaganą."
      },
      {
        "name": "show-password-aria-label",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „show-password-aria-label” konfigurujący komponent FormPassword."
      },
      {
        "name": "value",
        "type": "string | undefined",
        "required": false,
        "description": "Bieżąca wartość kontrolowana przez v-model."
      }
    ],
    "models": [],
    "events": [
      {
        "name": "update:value",
        "description": "Natywne zdarzenie CustomEvent „update:value” emitowane przez element."
      }
    ],
    "slots": [
      {
        "name": "hint",
        "description": "Treść osadzana w nazwanym slocie „hint”."
      },
      {
        "name": "description",
        "description": "Treść osadzana w nazwanym slocie „description”."
      },
      {
        "name": "error",
        "description": "Treść osadzana w nazwanym slocie „error”."
      },
      {
        "name": "success",
        "description": "Treść osadzana w nazwanym slocie „success”."
      }
    ]
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FormRadio",
    "sourceName": "FormRadio",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/form/FormRadio",
    "tagName": "peaui-form-radio",
    "status": "stable",
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": true,
        "description": "Unikalny identyfikator elementu w dokumencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Nazwa pola używana przez formularz lub nazwa zasobu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "option-value",
        "type": "string | number | boolean",
        "required": true,
        "description": "Konfiguruje właściwość „option value” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "is-valid",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Konfiguruje właściwość „is valid” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "required",
        "type": "boolean",
        "required": false,
        "description": "Oznacza wartość jako wymaganą. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [
      {
        "name": "value",
        "type": "string | number | boolean | undefined",
        "required": true,
        "description": "Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "events": [
      {
        "name": "update:value",
        "description": "Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”."
      }
    ],
    "slots": [
      {
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      }
    ]
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FormSelect",
    "sourceName": "FormSelect",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/form/FormSelect",
    "tagName": "peaui-form-select",
    "status": "stable",
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": true,
        "description": "Unikalny identyfikator elementu w dokumencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "can-erase",
        "type": "boolean",
        "required": false,
        "description": "Pokazuje akcję pozwalającą wyczyścić bieżącą wartość. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "after",
        "type": "string",
        "required": false,
        "description": "Treść wyświetlana za właściwą wartością pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "before",
        "type": "string",
        "required": false,
        "description": "Treść wyświetlana przed właściwą wartością pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Nazwa pola używana przez formularz lub nazwa zasobu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "description": "Widoczna etykieta opisująca element lub pole formularza. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "icon-before",
        "type": "string",
        "required": false,
        "description": "Nazwa ikony wyświetlanej przed treścią pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "required",
        "type": "boolean",
        "required": false,
        "description": "Oznacza wartość jako wymaganą. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "placement",
        "type": "'top' | 'bottom'",
        "required": false,
        "description": "Preferred list placement. The list flips when the preferred side has insufficient space. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "placeholder",
        "type": "string",
        "required": false,
        "default": "wybierz/wyszukaj",
        "description": "Tekst pomocniczy widoczny przed wprowadzeniem wartości. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "readonly",
        "type": "boolean",
        "required": false,
        "description": "Ustawia komponent w trybie tylko do odczytu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "can-write",
        "type": "boolean",
        "required": false,
        "description": "Konfiguruje właściwość „can write” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "searchable",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Konfiguruje właściwość „searchable” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "size",
        "type": "'xs' | 's' | 'm' | 'l'",
        "required": false,
        "default": "m",
        "description": "Wariant rozmiaru komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "options",
        "type": "SelectFieldOption[]",
        "required": true,
        "description": "Lista opcji dostępnych do wyświetlenia lub wyboru. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [
      {
        "name": "value",
        "type": "unknown",
        "required": true,
        "description": "Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "events": [
      {
        "name": "on:remove",
        "description": "Emitowane po wybraniu akcji usunięcia."
      },
      {
        "name": "update:value",
        "description": "Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”."
      }
    ],
    "slots": [
      {
        "name": "hint",
        "description": "Treść osadzana w nazwanym slocie „hint”."
      },
      {
        "name": "description",
        "description": "Treść osadzana w nazwanym slocie „description”."
      },
      {
        "name": "error",
        "description": "Treść osadzana w nazwanym slocie „error”."
      },
      {
        "name": "success",
        "description": "Treść osadzana w nazwanym slocie „success”."
      }
    ]
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FormTextarea",
    "sourceName": "FormTextarea",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/form/FormTextarea",
    "tagName": "peaui-form-textarea",
    "status": "stable",
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": true,
        "description": "Unikalny identyfikator elementu w dokumencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Nazwa pola używana przez formularz lub nazwa zasobu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "rows",
        "type": "number",
        "required": false,
        "default": "5",
        "description": "Konfiguruje właściwość „rows” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "description": "Widoczna etykieta opisująca element lub pole formularza. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "max-length",
        "type": "number",
        "required": false,
        "description": "Maksymalna liczba znaków możliwa do wprowadzenia. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "required",
        "type": "boolean",
        "required": false,
        "description": "Oznacza wartość jako wymaganą. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "placeholder",
        "type": "string",
        "required": false,
        "default": "wpisz",
        "description": "Tekst pomocniczy widoczny przed wprowadzeniem wartości. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "readonly",
        "type": "boolean",
        "required": false,
        "description": "Ustawia komponent w trybie tylko do odczytu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [
      {
        "name": "value",
        "type": "string | undefined",
        "required": true,
        "description": "Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "events": [
      {
        "name": "update:value",
        "description": "Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”."
      }
    ],
    "slots": [
      {
        "name": "hint",
        "description": "Treść osadzana w nazwanym slocie „hint”."
      },
      {
        "name": "description",
        "description": "Treść osadzana w nazwanym slocie „description”."
      },
      {
        "name": "error",
        "description": "Treść osadzana w nazwanym slocie „error”."
      },
      {
        "name": "success",
        "description": "Treść osadzana w nazwanym slocie „success”."
      }
    ]
  },
  {
    "category": "form",
    "categoryLabel": "Formularze",
    "name": "FormYearPicker",
    "sourceName": "FormYearPicker",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/form/FormYearPicker",
    "tagName": "peaui-form-year-picker",
    "status": "stable",
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": true,
        "description": "Unikalny identyfikator elementu w dokumencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "can-erase",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Pokazuje akcję pozwalającą wyczyścić bieżącą wartość. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "after",
        "type": "string",
        "required": false,
        "description": "Treść wyświetlana za właściwą wartością pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "before",
        "type": "string",
        "required": false,
        "description": "Treść wyświetlana przed właściwą wartością pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Nazwa pola używana przez formularz lub nazwa zasobu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "description": "Widoczna etykieta opisująca element lub pole formularza. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "icon-before",
        "type": "string",
        "required": false,
        "description": "Nazwa ikony wyświetlanej przed treścią pola. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "required",
        "type": "boolean",
        "required": false,
        "description": "Oznacza wartość jako wymaganą. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "placeholder",
        "type": "string",
        "required": false,
        "default": "wybierz rok",
        "description": "Tekst pomocniczy widoczny przed wprowadzeniem wartości. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "range",
        "type": "boolean",
        "required": false,
        "description": "Konfiguruje właściwość „range” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "min-year",
        "type": "number",
        "required": false,
        "description": "Konfiguruje właściwość „min year” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "max-year",
        "type": "number",
        "required": false,
        "description": "Konfiguruje właściwość „max year” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "readonly",
        "type": "boolean",
        "required": false,
        "description": "Ustawia komponent w trybie tylko do odczytu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [
      {
        "name": "value",
        "type": "number | YearPickerRangeValue | undefined",
        "required": true,
        "description": "Bieżąca wartość kontrolowana przez v-model:value. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "events": [
      {
        "name": "on:remove",
        "description": "Emitowane po wybraniu akcji usunięcia."
      },
      {
        "name": "update:value",
        "description": "Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „value”."
      }
    ],
    "slots": [
      {
        "name": "hint",
        "description": "Treść osadzana w nazwanym slocie „hint”."
      },
      {
        "name": "description",
        "description": "Treść osadzana w nazwanym slocie „description”."
      },
      {
        "name": "error",
        "description": "Treść osadzana w nazwanym slocie „error”."
      },
      {
        "name": "success",
        "description": "Treść osadzana w nazwanym slocie „success”."
      }
    ]
  },
  {
    "category": "layout",
    "categoryLabel": "Układ",
    "name": "CardPanel",
    "sourceName": "CardPanel",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/layout/CardPanel",
    "tagName": "peaui-card-panel",
    "status": "stable",
    "props": [
      {
        "name": "aria-label",
        "type": "string | null",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      },
      {
        "name": "as",
        "type": "CardPanelTag",
        "required": false,
        "description": "Atrybut HTML „as” konfigurujący komponent CardPanel."
      },
      {
        "name": "background-color",
        "type": "CardPanelColor",
        "required": false,
        "description": "Atrybut HTML „background-color” konfigurujący komponent CardPanel."
      },
      {
        "name": "border-color",
        "type": "CardPanelColor",
        "required": false,
        "description": "Atrybut HTML „border-color” konfigurujący komponent CardPanel."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „data-testid” konfigurujący komponent CardPanel."
      },
      {
        "name": "href",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „href” konfigurujący komponent CardPanel."
      },
      {
        "name": "is-hover-enabled",
        "type": "boolean",
        "required": false,
        "description": "Atrybut HTML „is-hover-enabled” konfigurujący komponent CardPanel."
      },
      {
        "name": "is-shadow-enabled",
        "type": "boolean",
        "required": false,
        "description": "Atrybut HTML „is-shadow-enabled” konfigurujący komponent CardPanel."
      },
      {
        "name": "rel",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „rel” konfigurujący komponent CardPanel."
      },
      {
        "name": "size",
        "type": "CardPanelSize",
        "required": false,
        "description": "Wariant rozmiaru komponentu."
      },
      {
        "name": "target",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „target” konfigurujący komponent CardPanel."
      }
    ],
    "models": [],
    "events": [],
    "slots": [
      {
        "name": "header",
        "description": "Treść osadzana w nazwanym slocie „header”."
      },
      {
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      }
    ]
  },
  {
    "category": "layout",
    "categoryLabel": "Układ",
    "name": "FullscreenContainer",
    "sourceName": "FullscreenContainer",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/layout/FullscreenContainer",
    "tagName": "peaui-fullscreen-container",
    "status": "stable",
    "props": [
      {
        "name": "aria-label",
        "type": "string",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "open-label",
        "type": "string",
        "required": false,
        "default": "Otwórz tryb pełnoekranowy",
        "description": "Konfiguruje właściwość „open label” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "close-label",
        "type": "string",
        "required": false,
        "default": "Zamknij tryb pełnoekranowy",
        "description": "Konfiguruje właściwość „close label” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [],
    "events": [],
    "slots": [
      {
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      }
    ]
  },
  {
    "category": "layout",
    "categoryLabel": "Układ",
    "name": "GridItem",
    "sourceName": "GridItem",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/layout/GridItem",
    "tagName": "peaui-grid-item",
    "status": "stable",
    "props": [
      {
        "name": "colspan",
        "type": "number | undefined",
        "required": false,
        "description": "Atrybut HTML „colspan” konfigurujący komponent GridItem."
      },
      {
        "name": "columns",
        "type": "number | undefined",
        "required": false,
        "description": "Definicje kolumn określające ich etykiety, klucze i sposób renderowania."
      },
      {
        "name": "gap",
        "type": "number",
        "required": false,
        "description": "Odstęp pomiędzy elementami układu."
      },
      {
        "name": "grid",
        "type": "boolean",
        "required": false,
        "description": "Atrybut HTML „grid” konfigurujący komponent GridItem."
      },
      {
        "name": "class",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „class” konfigurujący komponent GridItem."
      },
      {
        "name": "style",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „style” konfigurujący komponent GridItem."
      }
    ],
    "models": [],
    "events": [],
    "slots": [
      {
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      }
    ]
  },
  {
    "category": "layout",
    "categoryLabel": "Układ",
    "name": "GridSection",
    "sourceName": "GridSection",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/layout/GridSection",
    "tagName": "peaui-grid-section",
    "status": "stable",
    "props": [
      {
        "name": "columns",
        "type": "number",
        "required": false,
        "description": "Definicje kolumn określające ich etykiety, klucze i sposób renderowania."
      },
      {
        "name": "gap",
        "type": "number",
        "required": false,
        "description": "Odstęp pomiędzy elementami układu."
      },
      {
        "name": "class",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „class” konfigurujący komponent GridSection."
      }
    ],
    "models": [],
    "events": [],
    "slots": [
      {
        "name": "additional",
        "description": "Treść osadzana w nazwanym slocie „additional”."
      },
      {
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      }
    ]
  },
  {
    "category": "layout",
    "categoryLabel": "Układ",
    "name": "PageLayout",
    "sourceName": "PageLayout",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/layout/PageLayout",
    "tagName": "peaui-page-layout",
    "status": "stable",
    "props": [
      {
        "name": "aria-label",
        "type": "string | null",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „data-testid” konfigurujący komponent PageLayout."
      },
      {
        "name": "is-header-sticky",
        "type": "boolean",
        "required": false,
        "description": "Atrybut HTML „is-header-sticky” konfigurujący komponent PageLayout."
      }
    ],
    "models": [],
    "events": [],
    "slots": [
      {
        "name": "top",
        "description": "Treść osadzana w nazwanym slocie „top”."
      },
      {
        "name": "additional",
        "description": "Treść osadzana w nazwanym slocie „additional”."
      },
      {
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      },
      {
        "name": "footer",
        "description": "Treść osadzana w nazwanym slocie „footer”."
      }
    ]
  },
  {
    "category": "layout",
    "categoryLabel": "Układ",
    "name": "SectionDivider",
    "sourceName": "SectionDivider",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/layout/SectionDivider",
    "tagName": "peaui-section-divider",
    "status": "stable",
    "props": [
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "direction",
        "type": "'horizontal' | 'vertical'",
        "required": false,
        "default": "horizontal",
        "description": "Konfiguruje właściwość „direction” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "size",
        "type": "'s' | 'm' | 'l' | 'xl'",
        "required": false,
        "default": "s",
        "description": "Wariant rozmiaru komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [],
    "events": [],
    "slots": []
  },
  {
    "category": "navigation",
    "categoryLabel": "Nawigacja",
    "name": "Breadcrumbs",
    "sourceName": "Breadcrumbs",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/navigation/Breadcrumbs",
    "tagName": "peaui-breadcrumbs",
    "status": "stable",
    "props": [
      {
        "name": "items",
        "type": "BreadcrumbItem[]",
        "required": true,
        "description": "Konfiguruje właściwość „items” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "separator",
        "type": "string",
        "required": false,
        "default": "/",
        "description": "Konfiguruje właściwość „separator” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "aria-label",
        "type": "string",
        "required": false,
        "default": "Ścieżka nawigacji",
        "description": "Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [],
    "events": [
      {
        "name": "on:navigate",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:navigate”."
      }
    ],
    "slots": []
  },
  {
    "category": "navigation",
    "categoryLabel": "Nawigacja",
    "name": "ListLimitControl",
    "sourceName": "ListLimitControl",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/navigation/ListLimitControl",
    "tagName": "peaui-list-limit-control",
    "status": "stable",
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": true,
        "description": "Unikalny identyfikator elementu w dokumencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "label",
        "type": "string",
        "required": true,
        "description": "Widoczna etykieta opisująca element lub pole formularza. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "limit-list",
        "type": "number[]",
        "required": false,
        "default": "[5, 10, 25, 50]",
        "description": "Konfiguruje właściwość „limit list” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "position",
        "type": "'top' | 'bottom'",
        "required": false,
        "default": "bottom",
        "description": "Preferred list placement; it flips automatically when the selected side has insufficient space. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [
      {
        "name": "limit",
        "type": "number",
        "required": true,
        "description": "Wybrany limit elementów kontrolowany przez v-model:limit. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "events": [
      {
        "name": "update:limit",
        "description": "Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „limit”."
      }
    ],
    "slots": [
      {
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      }
    ]
  },
  {
    "category": "navigation",
    "categoryLabel": "Nawigacja",
    "name": "NavigationCard",
    "sourceName": "NavigationCard",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/navigation/NavigationCard",
    "tagName": "peaui-navigation-card",
    "status": "stable",
    "props": [
      {
        "name": "title",
        "type": "string",
        "required": true,
        "description": "Główny tytuł prezentowany w komponencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "path",
        "type": "string",
        "required": false,
        "description": "Konfiguruje właściwość „path” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "description",
        "type": "string",
        "required": true,
        "description": "Dodatkowy opis objaśniający zawartość albo stan komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "size",
        "type": "'s' | 'm' | 'l'",
        "required": false,
        "default": "s",
        "description": "Wariant rozmiaru komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "variant",
        "type": "'default' | 'complete' | 'during' | 'disabled' | 'hidden'",
        "required": false,
        "default": "default",
        "description": "Wariant wizualny komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "aria-label",
        "type": "string",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [],
    "events": [],
    "slots": []
  },
  {
    "category": "navigation",
    "categoryLabel": "Nawigacja",
    "name": "NavigationDisclosureCard",
    "sourceName": "NavigationDisclosureCard",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/navigation/NavigationDisclosureCard",
    "tagName": "peaui-navigation-disclosure-card",
    "status": "stable",
    "props": [
      {
        "name": "title",
        "type": "string",
        "required": true,
        "description": "Główny tytuł prezentowany w komponencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "description",
        "type": "string",
        "required": true,
        "description": "Dodatkowy opis objaśniający zawartość albo stan komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "id",
        "type": "string",
        "required": true,
        "description": "Unikalny identyfikator elementu w dokumencie. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "path",
        "type": "string",
        "required": false,
        "description": "Konfiguruje właściwość „path” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "open",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Steruje widocznością rozwijanego elementu albo warstwy. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "aria-label",
        "type": "string",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [],
    "events": [],
    "slots": [
      {
        "name": "title-additional",
        "description": "Treść osadzana w nazwanym slocie „title-additional”."
      },
      {
        "name": "description-additional",
        "description": "Treść osadzana w nazwanym slocie „description-additional”."
      },
      {
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      }
    ]
  },
  {
    "category": "navigation",
    "categoryLabel": "Nawigacja",
    "name": "NavigationIconCard",
    "sourceName": "NavigationIconCard",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/navigation/NavigationIconCard",
    "tagName": "peaui-navigation-icon-card",
    "status": "stable",
    "props": [
      {
        "name": "icon",
        "type": "string",
        "required": true,
        "description": "Nazwa ikony prezentowanej przez komponent. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "text",
        "type": "string",
        "required": true,
        "description": "Konfiguruje właściwość „text” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "path",
        "type": "string",
        "required": true,
        "description": "Konfiguruje właściwość „path” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "aria-label",
        "type": "string",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [],
    "events": [],
    "slots": []
  },
  {
    "category": "navigation",
    "categoryLabel": "Nawigacja",
    "name": "NavigationLink",
    "sourceName": "NavigationLink",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/navigation/NavigationLink",
    "tagName": "peaui-navigation-link",
    "status": "stable",
    "props": [
      {
        "name": "path",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „path” konfigurujący komponent NavigationLink."
      },
      {
        "name": "size",
        "type": "NavigationLinkSize",
        "required": false,
        "description": "Wariant rozmiaru komponentu."
      },
      {
        "name": "variant",
        "type": "NavigationLinkVariant",
        "required": false,
        "description": "Wariant wizualny komponentu."
      },
      {
        "name": "aria-label",
        "type": "string | null",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „data-testid” konfigurujący komponent NavigationLink."
      }
    ],
    "models": [],
    "events": [],
    "slots": [
      {
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      }
    ]
  },
  {
    "category": "navigation",
    "categoryLabel": "Nawigacja",
    "name": "NavigationStepper",
    "sourceName": "NavigationStepper",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/navigation/NavigationStepper",
    "tagName": "peaui-navigation-stepper",
    "status": "stable",
    "props": [
      {
        "name": "options",
        "type": "NavStepper[]",
        "required": false,
        "default": "[]",
        "description": "Lista opcji dostępnych do wyświetlenia lub wyboru. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "aria-label",
        "type": "string",
        "required": false,
        "default": "Nawigacja kroków",
        "description": "Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [],
    "events": [
      {
        "name": "on:select",
        "description": "Emitowane po wybraniu elementu."
      }
    ],
    "slots": []
  },
  {
    "category": "navigation",
    "categoryLabel": "Nawigacja",
    "name": "NavigationTabs",
    "sourceName": "NavigationTabs",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/navigation/NavigationTabs",
    "tagName": "peaui-navigation-tabs",
    "status": "stable",
    "props": [
      {
        "name": "tabs",
        "type": "Tab[]",
        "required": false,
        "default": "[]",
        "description": "Konfiguruje właściwość „tabs” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "aria-label",
        "type": "string",
        "required": true,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "with-backround",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Konfiguruje właściwość „with backround” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [],
    "events": [
      {
        "name": "on:select",
        "description": "Emitowane po wybraniu elementu."
      }
    ],
    "slots": [
      {
        "name": "getSlotName(tab.key, ",
        "description": "Treść osadzana w nazwanym slocie „getSlotName(tab.key, ”."
      }
    ]
  },
  {
    "category": "navigation",
    "categoryLabel": "Nawigacja",
    "name": "PaginationControl",
    "sourceName": "PaginationControl",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/navigation/PaginationControl",
    "tagName": "peaui-pagination-control",
    "status": "stable",
    "props": [
      {
        "name": "aria-label",
        "type": "string",
        "required": true,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "total-pages",
        "type": "number",
        "required": true,
        "description": "Łączna liczba stron dostępnych w paginacji. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [
      {
        "name": "page",
        "type": "number",
        "required": true,
        "default": "1",
        "description": "Aktualna strona kontrolowana przez v-model:page. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "events": [
      {
        "name": "update:page",
        "description": "Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „page”."
      }
    ],
    "slots": []
  },
  {
    "category": "overlayer",
    "categoryLabel": "Warstwy i okna",
    "name": "DrawerPanel",
    "sourceName": "DrawerPanel",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/overlayer/DrawerPanel",
    "tagName": "peaui-drawer-panel",
    "status": "stable",
    "props": [
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "aria-label",
        "type": "string",
        "required": true,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [
      {
        "name": "open",
        "type": "boolean",
        "required": true,
        "description": "Stan otwarcia kontrolowany przez v-model:open. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "events": [
      {
        "name": "update:open",
        "description": "Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „open”."
      }
    ],
    "slots": [
      {
        "name": "header",
        "description": "Treść osadzana w nazwanym slocie „header”."
      },
      {
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      }
    ]
  },
  {
    "category": "overlayer",
    "categoryLabel": "Warstwy i okna",
    "name": "InfoTooltip",
    "sourceName": "InfoTooltip",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/overlayer/InfoTooltip",
    "tagName": "peaui-info-tooltip",
    "status": "stable",
    "props": [
      {
        "name": "placement",
        "type": "Placement",
        "required": false,
        "description": "Atrybut HTML „placement” konfigurujący komponent InfoTooltip."
      },
      {
        "name": "variant",
        "type": "Variant",
        "required": false,
        "description": "Wariant wizualny komponentu."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "description": "Wyłącza komponent i blokuje jego interakcje."
      },
      {
        "name": "data-test-id",
        "type": "string | undefined",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „data-testid” konfigurujący komponent InfoTooltip."
      },
      {
        "name": "role",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „role” konfigurujący komponent InfoTooltip."
      },
      {
        "name": "tabindex",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „tabindex” konfigurujący komponent InfoTooltip."
      },
      {
        "name": "aria-label",
        "type": "string",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label."
      },
      {
        "name": "aria-labelledby",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „aria-labelledby” konfigurujący komponent InfoTooltip."
      },
      {
        "name": "aria-describedby",
        "type": "string",
        "required": false,
        "description": "Atrybut HTML „aria-describedby” konfigurujący komponent InfoTooltip."
      }
    ],
    "models": [],
    "events": [],
    "slots": []
  },
  {
    "category": "overlayer",
    "categoryLabel": "Warstwy i okna",
    "name": "ModalDialog",
    "sourceName": "ModalDialog",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/overlayer/ModalDialog",
    "tagName": "peaui-modal-dialog",
    "status": "stable",
    "props": [
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "aria-label",
        "type": "string",
        "required": true,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [
      {
        "name": "open",
        "type": "boolean",
        "required": true,
        "description": "Stan otwarcia kontrolowany przez v-model:open. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "events": [
      {
        "name": "update:open",
        "description": "Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „open”."
      }
    ],
    "slots": [
      {
        "name": "header",
        "description": "Treść osadzana w nazwanym slocie „header”."
      },
      {
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      }
    ]
  },
  {
    "category": "overlayer",
    "categoryLabel": "Warstwy i okna",
    "name": "PopoverButton",
    "sourceName": "PopoverButton",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/overlayer/PopoverButton",
    "tagName": "peaui-popover-button",
    "status": "stable",
    "props": [
      {
        "name": "size",
        "type": "'xs' | 's' | 'm' | 'l'",
        "required": false,
        "default": "m",
        "description": "Wariant rozmiaru komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "variant",
        "type": "'primary' | 'secondary' | 'ghost' | 'danger'",
        "required": false,
        "default": "primary",
        "description": "Wariant wizualny komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "placement",
        "type": "| 'top'\n  | 'right'\n  | 'bottom'\n  | 'left'\n  | 'top-left'\n  | 'top-right'\n  | 'bottom-left'\n  | 'bottom-right'",
        "required": false,
        "default": "top",
        "description": "Konfiguruje właściwość „placement” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "aria-label",
        "type": "string",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "match-trigger-width",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „match trigger width” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "popup-type",
        "type": "'menu' | 'listbox' | 'tree' | 'grid' | 'dialog' | 'true'",
        "required": false,
        "description": "Konfiguruje właściwość „popup type” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "use-aria-label",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „use aria label” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [],
    "events": [
      {
        "name": "keydown",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „keydown”."
      },
      {
        "name": "pointerdown",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „pointerdown”."
      }
    ],
    "slots": [
      {
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      },
      {
        "name": "content",
        "description": "Treść osadzana w nazwanym slocie „content”."
      }
    ]
  },
  {
    "category": "overlayer",
    "categoryLabel": "Warstwy i okna",
    "name": "PopoverOverlayer",
    "sourceName": "PopoverOverlayer",
    "framework": "web-components",
    "importPath": "@peaui/ui/wc/overlayer/PopoverOverlayer",
    "tagName": "peaui-popover-overlayer",
    "status": "stable",
    "props": [
      {
        "name": "placement",
        "type": "| 'top'\n  | 'right'\n  | 'bottom'\n  | 'left'\n  | 'top-left'\n  | 'top-right'\n  | 'bottom-left'\n  | 'bottom-right'",
        "required": false,
        "default": "top",
        "description": "Konfiguruje właściwość „placement” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "data-testid",
        "type": "string",
        "required": false,
        "description": "Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Wyłącza komponent i blokuje jego interakcje. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "aria-label",
        "type": "string",
        "required": false,
        "description": "Dostępna nazwa elementu przekazywana przez aria-label. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "content-class",
        "type": "string",
        "required": false,
        "description": "Konfiguruje właściwość „content class” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "match-trigger-width",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Konfiguruje właściwość „match trigger width” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      },
      {
        "name": "popup-type",
        "type": "'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'",
        "required": false,
        "description": "Konfiguruje właściwość „popup type” komponentu. W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property."
      }
    ],
    "models": [],
    "events": [
      {
        "name": "update:open",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „update:open”."
      }
    ],
    "slots": [
      {
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      },
      {
        "name": "content",
        "description": "Treść osadzana w nazwanym slocie „content”."
      }
    ]
  }
] as const satisfies readonly FrameworkComponentApi[];
