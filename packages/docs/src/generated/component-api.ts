// Ten plik jest generowany przez scripts/generate-component-api.mjs.
// Nie edytuj go ręcznie — źródłem prawdy są publiczne komponenty Vue.

import type { ComponentApi } from '../types';

export const generatedComponentApi = [
  {
    "name": "ImageView",
    "category": "basic",
    "categoryLabel": "Podstawowe",
    "importPath": "@peaui/ui/basic/ImageView",
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
    "name": "PhotoEditior",
    "category": "basic",
    "categoryLabel": "Podstawowe",
    "importPath": "@peaui/ui/basic/PhotoEditior",
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
        "description": "Edytowany obraz kontrolowany przez v-model:image."
      }
    ],
    "events": [
      {
        "name": "on:cancel",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:cancel”."
      }
    ],
    "slots": []
  },
  {
    "name": "SvgIcon",
    "category": "basic",
    "categoryLabel": "Podstawowe",
    "importPath": "@peaui/ui/basic/SvgIcon",
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
    "name": "CalculationResults",
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "importPath": "@peaui/ui/data-display/CalculationResults",
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
    "name": "CardCarousel",
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "importPath": "@peaui/ui/data-display/CardCarousel",
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
    "name": "CounterBadge",
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "importPath": "@peaui/ui/data-display/CounterBadge",
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
    "name": "DescriptionField",
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "importPath": "@peaui/ui/data-display/DescriptionField",
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
    "name": "DisclosurePanel",
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "importPath": "@peaui/ui/data-display/DisclosurePanel",
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
        "description": "Stan otwarcia kontrolowany przez v-model:open."
      }
    ],
    "events": [],
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
    "name": "SectionHeading",
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "importPath": "@peaui/ui/data-display/SectionHeading",
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
    "name": "TableList",
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "importPath": "@peaui/ui/data-display/TableList",
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
        "name": "on:action",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:action”."
      },
      {
        "name": "on:createRecord",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:createRecord”."
      },
      {
        "name": "on:dbclick",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:dbclick”."
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
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:changeValue”."
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
    "name": "TableListFooter",
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "importPath": "@peaui/ui/data-display/TableListFooter",
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
    "name": "TableListHeader",
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "importPath": "@peaui/ui/data-display/TableListHeader",
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
        "name": "filters-open",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Wartość kontrolowana przez v-model:filters-open."
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
    "name": "TagChip",
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "importPath": "@peaui/ui/data-display/TagChip",
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
    "name": "TreeList",
    "category": "data-display",
    "categoryLabel": "Prezentacja danych",
    "importPath": "@peaui/ui/data-display/TreeList",
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
        "required": true,
        "description": "Dane drzewa kontrolowane przez v-model:tree."
      }
    ],
    "events": [
      {
        "name": "on:remove",
        "description": "Emitowane po wybraniu akcji usunięcia."
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
    "name": "ButtonAction",
    "category": "data-entry",
    "categoryLabel": "Wprowadzanie danych",
    "importPath": "@peaui/ui/data-entry/ButtonAction",
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
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      }
    ]
  },
  {
    "name": "ButtonExport",
    "category": "data-entry",
    "categoryLabel": "Wprowadzanie danych",
    "importPath": "@peaui/ui/data-entry/ButtonExport",
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
    "name": "InputSlider",
    "category": "data-entry",
    "categoryLabel": "Wprowadzanie danych",
    "importPath": "@peaui/ui/data-entry/InputSlider",
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
        "description": "Bieżąca wartość kontrolowana przez v-model:value."
      }
    ],
    "events": [],
    "slots": []
  },
  {
    "name": "SearchInput",
    "category": "data-entry",
    "categoryLabel": "Wprowadzanie danych",
    "importPath": "@peaui/ui/data-entry/SearchInput",
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
        "description": "Bieżąca wartość kontrolowana przez v-model:value."
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
      }
    ],
    "slots": []
  },
  {
    "name": "SelectableCard",
    "category": "data-entry",
    "categoryLabel": "Wprowadzanie danych",
    "importPath": "@peaui/ui/data-entry/SelectableCard",
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
    "name": "EmptyState",
    "category": "feedback",
    "categoryLabel": "Informacje zwrotne",
    "importPath": "@peaui/ui/feedback/EmptyState",
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
        "description": "Treść osadzana w nazwanym slocie „additional”."
      }
    ]
  },
  {
    "name": "MessageText",
    "category": "feedback",
    "categoryLabel": "Informacje zwrotne",
    "importPath": "@peaui/ui/feedback/MessageText",
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
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      }
    ]
  },
  {
    "name": "ProgressIndicator",
    "category": "feedback",
    "categoryLabel": "Informacje zwrotne",
    "importPath": "@peaui/ui/feedback/ProgressIndicator",
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
    "name": "SkeletonLoading",
    "category": "feedback",
    "categoryLabel": "Informacje zwrotne",
    "importPath": "@peaui/ui/feedback/SkeletonLoading",
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
    "name": "SpinnerLoader",
    "category": "feedback",
    "categoryLabel": "Informacje zwrotne",
    "importPath": "@peaui/ui/feedback/SpinnerLoader",
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
    "name": "ToastAlert",
    "category": "feedback",
    "categoryLabel": "Informacje zwrotne",
    "importPath": "@peaui/ui/feedback/ToastAlert",
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
        "name": "on:close",
        "description": "Emitowane podczas zamykania komponentu."
      }
    ],
    "slots": []
  },
  {
    "name": "FieldLabel",
    "category": "form",
    "categoryLabel": "Formularze",
    "importPath": "@peaui/ui/form/FieldLabel",
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
        "description": "Treść osadzana w nazwanym slocie „hint”."
      }
    ]
  },
  {
    "name": "FormButtonCheckbox",
    "category": "form",
    "categoryLabel": "Formularze",
    "importPath": "@peaui/ui/form/FormButtonCheckbox",
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
        "required": true,
        "description": "Bieżąca wartość kontrolowana przez v-model:value."
      }
    ],
    "events": [],
    "slots": [
      {
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      }
    ]
  },
  {
    "name": "FormButtonGroup",
    "category": "form",
    "categoryLabel": "Formularze",
    "importPath": "@peaui/ui/form/FormButtonGroup",
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
        "required": true,
        "description": "Bieżąca wartość kontrolowana przez v-model:value."
      }
    ],
    "events": [],
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
    "name": "FormCheckbox",
    "category": "form",
    "categoryLabel": "Formularze",
    "importPath": "@peaui/ui/form/FormCheckbox",
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
        "required": true,
        "description": "Bieżąca wartość kontrolowana przez v-model:value."
      }
    ],
    "events": [],
    "slots": [
      {
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      }
    ]
  },
  {
    "name": "FormContainer",
    "category": "form",
    "categoryLabel": "Formularze",
    "importPath": "@peaui/ui/form/FormContainer",
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
    "name": "FormDatePicker",
    "category": "form",
    "categoryLabel": "Formularze",
    "importPath": "@peaui/ui/form/FormDatePicker",
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
        "required": true,
        "description": "Bieżąca wartość kontrolowana przez v-model:value."
      }
    ],
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
    "name": "FormField",
    "category": "form",
    "categoryLabel": "Formularze",
    "importPath": "@peaui/ui/form/FormField",
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
    "name": "FormFileUpload",
    "category": "form",
    "categoryLabel": "Formularze",
    "importPath": "@peaui/ui/form/FormFileUpload",
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
        "description": "Wybrany plik kontrolowany przez v-model:file."
      }
    ],
    "events": [
      {
        "name": "on:remove",
        "description": "Emitowane po wybraniu akcji usunięcia."
      }
    ],
    "slots": []
  },
  {
    "name": "FormFileUploadSimple",
    "category": "form",
    "categoryLabel": "Formularze",
    "importPath": "@peaui/ui/form/FormFileUploadSimple",
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
        "required": true,
        "description": "Lista wybranych plików kontrolowana przez v-model:files."
      }
    ],
    "events": [],
    "slots": []
  },
  {
    "name": "FormInput",
    "category": "form",
    "categoryLabel": "Formularze",
    "importPath": "@peaui/ui/form/FormInput",
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
        "required": true,
        "description": "Bieżąca wartość kontrolowana przez v-model:value."
      }
    ],
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
    "name": "FormMultiSelect",
    "category": "form",
    "categoryLabel": "Formularze",
    "importPath": "@peaui/ui/form/FormMultiSelect",
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
        "required": true,
        "description": "Bieżąca wartość kontrolowana przez v-model:value."
      }
    ],
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
    "name": "FormNumber",
    "category": "form",
    "categoryLabel": "Formularze",
    "importPath": "@peaui/ui/form/FormNumber",
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
        "required": true,
        "description": "Bieżąca wartość kontrolowana przez v-model:value."
      }
    ],
    "events": [],
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
    "name": "FormPassword",
    "category": "form",
    "categoryLabel": "Formularze",
    "importPath": "@peaui/ui/form/FormPassword",
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
        "required": true,
        "description": "Bieżąca wartość kontrolowana przez v-model:value."
      }
    ],
    "events": [],
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
    "name": "FormRadio",
    "category": "form",
    "categoryLabel": "Formularze",
    "importPath": "@peaui/ui/form/FormRadio",
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
        "required": true,
        "description": "Bieżąca wartość kontrolowana przez v-model:value."
      }
    ],
    "events": [],
    "slots": [
      {
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      }
    ]
  },
  {
    "name": "FormSelect",
    "category": "form",
    "categoryLabel": "Formularze",
    "importPath": "@peaui/ui/form/FormSelect",
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
        "description": "Konfiguruje właściwość „placement” komponentu."
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
        "required": true,
        "description": "Bieżąca wartość kontrolowana przez v-model:value."
      }
    ],
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
    "name": "FormTextarea",
    "category": "form",
    "categoryLabel": "Formularze",
    "importPath": "@peaui/ui/form/FormTextarea",
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
        "required": true,
        "description": "Bieżąca wartość kontrolowana przez v-model:value."
      }
    ],
    "events": [],
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
    "name": "FormYearPicker",
    "category": "form",
    "categoryLabel": "Formularze",
    "importPath": "@peaui/ui/form/FormYearPicker",
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
        "required": true,
        "description": "Bieżąca wartość kontrolowana przez v-model:value."
      }
    ],
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
    "name": "CardPanel",
    "category": "layout",
    "categoryLabel": "Układ",
    "importPath": "@peaui/ui/layout/CardPanel",
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
        "description": "Treść osadzana w nazwanym slocie „header”."
      },
      {
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      }
    ]
  },
  {
    "name": "FullscreenContainer",
    "category": "layout",
    "categoryLabel": "Układ",
    "importPath": "@peaui/ui/layout/FullscreenContainer",
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
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      }
    ]
  },
  {
    "name": "GridItem",
    "category": "layout",
    "categoryLabel": "Układ",
    "importPath": "@peaui/ui/layout/GridItem",
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
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      }
    ]
  },
  {
    "name": "GridSection",
    "category": "layout",
    "categoryLabel": "Układ",
    "importPath": "@peaui/ui/layout/GridSection",
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
        "description": "Treść osadzana w nazwanym slocie „additional”."
      },
      {
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      }
    ]
  },
  {
    "name": "PageLayout",
    "category": "layout",
    "categoryLabel": "Układ",
    "importPath": "@peaui/ui/layout/PageLayout",
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
    "name": "SectionDivider",
    "category": "layout",
    "categoryLabel": "Układ",
    "importPath": "@peaui/ui/layout/SectionDivider",
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
    "name": "Breadcrumbs",
    "category": "navigation",
    "categoryLabel": "Nawigacja",
    "importPath": "@peaui/ui/navigation/Breadcrumbs",
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
        "name": "on:navigate",
        "description": "Emitowane, gdy komponent zgłasza zdarzenie „on:navigate”."
      }
    ],
    "slots": []
  },
  {
    "name": "ListLimitControl",
    "category": "navigation",
    "categoryLabel": "Nawigacja",
    "importPath": "@peaui/ui/navigation/ListLimitControl",
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
        "description": "Konfiguruje właściwość „position” komponentu."
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
        "required": true,
        "description": "Wybrany limit elementów kontrolowany przez v-model:limit."
      }
    ],
    "events": [],
    "slots": [
      {
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      }
    ]
  },
  {
    "name": "NavigationCard",
    "category": "navigation",
    "categoryLabel": "Nawigacja",
    "importPath": "@peaui/ui/navigation/NavigationCard",
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
    "name": "NavigationDisclosureCard",
    "category": "navigation",
    "categoryLabel": "Nawigacja",
    "importPath": "@peaui/ui/navigation/NavigationDisclosureCard",
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
    "name": "NavigationIconCard",
    "category": "navigation",
    "categoryLabel": "Nawigacja",
    "importPath": "@peaui/ui/navigation/NavigationIconCard",
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
    "name": "NavigationLink",
    "category": "navigation",
    "categoryLabel": "Nawigacja",
    "importPath": "@peaui/ui/navigation/NavigationLink",
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
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      }
    ]
  },
  {
    "name": "NavigationStepper",
    "category": "navigation",
    "categoryLabel": "Nawigacja",
    "importPath": "@peaui/ui/navigation/NavigationStepper",
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
        "name": "on:select",
        "description": "Emitowane po wybraniu elementu."
      }
    ],
    "slots": []
  },
  {
    "name": "NavigationTabs",
    "category": "navigation",
    "categoryLabel": "Nawigacja",
    "importPath": "@peaui/ui/navigation/NavigationTabs",
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
    "name": "PaginationControl",
    "category": "navigation",
    "categoryLabel": "Nawigacja",
    "importPath": "@peaui/ui/navigation/PaginationControl",
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
        "required": true,
        "default": "1",
        "description": "Aktualna strona kontrolowana przez v-model:page."
      }
    ],
    "events": [],
    "slots": []
  },
  {
    "name": "DrawerPanel",
    "category": "overlayer",
    "categoryLabel": "Warstwy i okna",
    "importPath": "@peaui/ui/overlayer/DrawerPanel",
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
        "required": true,
        "description": "Stan otwarcia kontrolowany przez v-model:open."
      }
    ],
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
    "name": "InfoTooltip",
    "category": "overlayer",
    "categoryLabel": "Warstwy i okna",
    "importPath": "@peaui/ui/overlayer/InfoTooltip",
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
        "name": "default",
        "description": "Główna treść przekazywana do komponentu."
      },
      {
        "name": "title",
        "description": "Treść osadzana w nazwanym slocie „title”."
      },
      {
        "name": "description",
        "description": "Treść osadzana w nazwanym slocie „description”."
      }
    ]
  },
  {
    "name": "ModalDialog",
    "category": "overlayer",
    "categoryLabel": "Warstwy i okna",
    "importPath": "@peaui/ui/overlayer/ModalDialog",
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
        "required": true,
        "description": "Stan otwarcia kontrolowany przez v-model:open."
      }
    ],
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
    "name": "PopoverButton",
    "category": "overlayer",
    "categoryLabel": "Warstwy i okna",
    "importPath": "@peaui/ui/overlayer/PopoverButton",
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
    "name": "PopoverOverlayer",
    "category": "overlayer",
    "categoryLabel": "Warstwy i okna",
    "importPath": "@peaui/ui/overlayer/PopoverOverlayer",
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
] as const satisfies readonly ComponentApi[];
