// Ten plik jest generowany przez scripts/generate-component-api.mjs.
// Nie edytuj go ręcznie — źródłem prawdy są implementacje React i Web Components.

import type { FrameworkComponentApi } from '../types';
import { generatedComponentApi } from './component-api';

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
      generatedComponentApi[0].props[0],
      generatedComponentApi[86].props[1],
      generatedComponentApi[41].props[13],
      generatedComponentApi[0].props[3],
      generatedComponentApi[0].props[4],
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
    props: [generatedComponentApi[86].props[1], generatedComponentApi[60].props[4]],
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
      generatedComponentApi[2].props[0],
      generatedComponentApi[2].props[1],
      generatedComponentApi[2].props[2],
      generatedComponentApi[2].props[3],
      generatedComponentApi[2].props[4],
      generatedComponentApi[2].props[5],
      generatedComponentApi[2].props[6],
      generatedComponentApi[2].props[7],
      generatedComponentApi[2].props[8],
      generatedComponentApi[2].props[9],
      generatedComponentApi[2].props[10],
      generatedComponentApi[2].props[11],
      generatedComponentApi[2].props[12],
      generatedComponentApi[73].props[5],
    ],
    models: [],
    events: [
      {
        name: 'onLoad',
        type: '(...args: unknown[]) => void',
        description: 'Emitowane po poprawnym załadowaniu obrazu.',
      },
      {
        name: 'onError',
        type: '(...args: unknown[]) => void',
        description: 'Emitowane, gdy operacja komponentu kończy się błędem.',
      },
    ],
    slots: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop children.',
      },
      {
        name: 'statusContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop statusContent.',
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
        type: 'PeauiAvatarGroupItem[]',
        required: false,
        default: '[]',
        description: 'Osoby prezentowane w stabilnej kolejności wejściowej.',
      },
      generatedComponentApi[3].props[1],
      generatedComponentApi[3].props[2],
      generatedComponentApi[3].props[3],
      generatedComponentApi[3].props[4],
      generatedComponentApi[3].props[5],
      generatedComponentApi[3].props[6],
      {
        name: 'itemKey',
        type: 'keyof PeauiAvatarGroupItem | ((item: PeauiAvatarGroupItem, index: number) => string | number)',
        required: false,
        default: 'id',
        description: 'Pole lub funkcja zwracająca stabilny klucz elementu.',
      },
      generatedComponentApi[3].props[8],
      generatedComponentApi[3].props[9],
      generatedComponentApi[69].props[6],
      generatedComponentApi[73].props[5],
      {
        name: 'defaultOpen',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Początkowa niekontrolowana wartość właściwości open.',
      },
    ],
    models: [
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Kontrolowana wartość open; aktualizuj ją przez onOpenChange. Dla stanu niekontrolowanego użyj defaultOpen.',
      },
    ],
    events: [
      {
        name: 'onOpenChange',
        type: '(value: boolean) => void',
        description: 'Callback React wywoływany po zmianie właściwości open.',
      },
      {
        name: 'onSelect',
        type: '(item: PeauiAvatarGroupItem, index: number) => void',
        description: 'Zwraca wybraną osobę oraz jej indeks w źródłowej tablicy.',
      },
      {
        name: 'onOverflowClick',
        type: '(items: PeauiAvatarGroupItem[]) => void',
        description: 'Informuje o aktywowaniu licznika nadmiaru.',
      },
    ],
    slots: [
      {
        name: 'renderItem',
        type: '(item: PeauiAvatarGroupItem, index: number) => ReactNode',
        description:
          'Funkcja renderująca renderItem; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderOverflow',
        type: '(count: number, items: PeauiAvatarGroupItem[]) => ReactNode',
        description:
          'Funkcja renderująca renderOverflow; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'popoverHeader',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop popoverHeader.',
      },
      {
        name: 'renderPopoverItem',
        type: '(item: PeauiAvatarGroupItem, index: number) => ReactNode',
        description:
          'Funkcja renderująca renderPopoverItem; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'empty',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop empty.',
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
      generatedComponentApi[4].props[0],
      generatedComponentApi[60].props[12],
      generatedComponentApi[4].props[2],
      generatedComponentApi[72].props[1],
      generatedComponentApi[86].props[1],
      generatedComponentApi[4].props[5],
      generatedComponentApi[4].props[6],
    ],
    models: [],
    events: [
      {
        name: 'onSimulate',
        type: '(...args: unknown[]) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:simulate”.',
      },
    ],
    slots: [
      {
        name: 'additional',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop additional.',
      },
      {
        name: 'hint',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop hint.',
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
      generatedComponentApi[86].props[3],
      generatedComponentApi[5].props[1],
      generatedComponentApi[86].props[1],
      generatedComponentApi[5].props[3],
      generatedComponentApi[5].props[4],
      generatedComponentApi[5].props[5],
      generatedComponentApi[5].props[6],
      generatedComponentApi[5].props[7],
      generatedComponentApi[5].props[8],
      generatedComponentApi[5].props[9],
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
      generatedComponentApi[6].props[0],
      generatedComponentApi[86].props[1],
      generatedComponentApi[35].props[0],
      generatedComponentApi[74].props[3],
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
    props: [generatedComponentApi[72].props[1], generatedComponentApi[86].props[1]],
    models: [],
    events: [],
    slots: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop children.',
      },
      {
        name: 'additionalBefore',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop additionalBefore.',
      },
      {
        name: 'hint',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop hint.',
      },
      {
        name: 'additionalAfter',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop additionalAfter.',
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
      generatedComponentApi[35].props[1],
      generatedComponentApi[86].props[3],
      generatedComponentApi[86].props[1],
      generatedComponentApi[86].props[2],
      generatedComponentApi[8].props[4],
      generatedComponentApi[8].props[5],
      {
        name: 'defaultOpen',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Początkowa niekontrolowana wartość właściwości open.',
      },
    ],
    models: [
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Kontrolowana wartość open; aktualizuj ją przez onOpenChange. Dla stanu niekontrolowanego użyj defaultOpen.',
      },
    ],
    events: [
      {
        name: 'onOpenChange',
        type: '(value: boolean) => void',
        description: 'Callback React wywoływany po zmianie właściwości open.',
      },
    ],
    slots: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop children.',
      },
      {
        name: 'additional',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop additional.',
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
      generatedComponentApi[9].props[0],
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
      generatedComponentApi[9].props[4],
      generatedComponentApi[9].props[5],
      generatedComponentApi[9].props[6],
      generatedComponentApi[9].props[7],
      generatedComponentApi[66].props[10],
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'renderKey',
        type: '(state: KeyboardKeySlotState) => ReactNode',
        description:
          'Funkcja renderująca renderKey; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderSeparator',
        type: '(state: { index: number; separator: string }) => ReactNode',
        description:
          'Funkcja renderująca renderSeparator; argumenty i zwracana treść są opisane w sygnaturze.',
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
      generatedComponentApi[10].props[0],
      generatedComponentApi[10].props[1],
      generatedComponentApi[86].props[1],
      generatedComponentApi[10].props[3],
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'title',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop title.',
      },
      {
        name: 'hint',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop hint.',
      },
      {
        name: 'description',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop description.',
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
      generatedComponentApi[21].props[0],
      generatedComponentApi[11].props[1],
      generatedComponentApi[11].props[2],
      generatedComponentApi[11].props[3],
      generatedComponentApi[11].props[4],
      generatedComponentApi[11].props[5],
      generatedComponentApi[11].props[6],
      generatedComponentApi[11].props[7],
      generatedComponentApi[11].props[8],
      generatedComponentApi[11].props[9],
      {
        name: 'columns',
        type: 'PeauiTableColumn[]',
        required: false,
        default: '[]',
        description: 'Definicje kolumn określające ich etykiety, klucze i sposób renderowania.',
      },
      generatedComponentApi[11].props[11],
      generatedComponentApi[11].props[12],
      generatedComponentApi[11].props[13],
      {
        name: 'records',
        type: 'PeauiRecord[]',
        required: false,
        default: '[]',
        description: 'Kolekcja rekordów prezentowanych przez komponent.',
      },
      generatedComponentApi[11].props[15],
      generatedComponentApi[11].props[16],
      generatedComponentApi[11].props[17],
      generatedComponentApi[11].props[18],
      generatedComponentApi[11].props[19],
      generatedComponentApi[11].props[20],
      generatedComponentApi[11].props[21],
      {
        name: 'sortColumns',
        type: 'PeauiSortDescriptor[]',
        required: false,
        default: '[]',
        description: 'Konfiguruje właściwość „sort columns” komponentu.',
      },
      {
        name: 'sortType',
        type: "'asc' | 'desc' | undefined",
        required: false,
        default: 'DESC',
        description: 'Konfiguruje właściwość „sort type” komponentu.',
      },
      generatedComponentApi[11].props[24],
      generatedComponentApi[11].props[25],
      generatedComponentApi[11].props[26],
      generatedComponentApi[40].props[2],
      generatedComponentApi[11].props[28],
      generatedComponentApi[86].props[1],
      {
        name: 'defaultPage',
        type: 'number',
        required: false,
        default: '1',
        description: 'Początkowa niekontrolowana wartość właściwości page.',
      },
    ],
    models: [
      {
        name: 'page',
        type: 'number',
        required: false,
        default: '1',
        description:
          'Kontrolowana wartość page; aktualizuj ją przez onPageChange. Dla stanu niekontrolowanego użyj defaultPage.',
      },
    ],
    events: [
      {
        name: 'onPageChange',
        type: '(value: number) => void',
        description: 'Callback React wywoływany po zmianie właściwości page.',
      },
      {
        name: 'onAction',
        type: '(...args: unknown[]) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:action”.',
      },
      {
        name: 'onCreateRecord',
        type: '(...args: unknown[]) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:createRecord”.',
      },
      {
        name: 'onRowDoubleClick',
        type: '(...args: unknown[]) => void',
        description: 'Prefer this correctly spelled event for row double-clicks.',
      },
      {
        name: 'onDbclick',
        type: '(...args: unknown[]) => void',
        description: '@deprecated Use `on:dblclick`. Kept for backwards compatibility.',
      },
      {
        name: 'onSelectRow',
        type: '(...args: unknown[]) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:select:row”.',
      },
      {
        name: 'onSort',
        type: '(...args: unknown[]) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:sort”.',
      },
      {
        name: 'onCancel',
        type: '(...args: unknown[]) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:cancel”.',
      },
      {
        name: 'onCheckRow',
        type: '(...args: unknown[]) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:check:row”.',
      },
      {
        name: 'onSubmit',
        type: '(...args: unknown[]) => void',
        description: 'Emitowane po zatwierdzeniu danych.',
      },
      {
        name: 'onChangeValue',
        type: '(...args: unknown[]) => void',
        description:
          'Emitowane po zmianie wartości komórki; przekazuje identyfikator rekordu i nową wartość.',
      },
      {
        name: 'onUpdatePage',
        type: '(...args: unknown[]) => void',
        description:
          'Emitowane po zmianie modelu „page”; przekaż nową wartość do kontrolowany prop.',
      },
    ],
    slots: [
      {
        name: 'renderCell',
        type: '(columnKey: string, record: PeauiRecord, rowIndex: number) => ReactNode',
        description:
          'Funkcja renderująca renderCell; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'detailsRecord',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop detailsRecord.',
      },
      {
        name: 'detialsRecord',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop detialsRecord.',
      },
      {
        name: 'additionalRow',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop additionalRow.',
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
      generatedComponentApi[12].props[0],
      generatedComponentApi[12].props[1],
      generatedComponentApi[12].props[2],
      generatedComponentApi[12].props[3],
      generatedComponentApi[12].props[4],
      generatedComponentApi[12].props[5],
      generatedComponentApi[86].props[1],
    ],
    models: [],
    events: [
      {
        name: 'onChangePage',
        type: '(...args: unknown[]) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:change:page”.',
      },
      {
        name: 'onChangeLimit',
        type: '(...args: unknown[]) => void',
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
    framework: 'react',
    importPath: '@peaui/ui/react/data-display/TableListHeader',
    status: 'stable',
    props: [
      generatedComponentApi[13].props[0],
      generatedComponentApi[13].props[1],
      generatedComponentApi[13].props[2],
      generatedComponentApi[13].props[3],
      generatedComponentApi[13].props[4],
      generatedComponentApi[13].props[5],
      generatedComponentApi[13].props[6],
      generatedComponentApi[13].props[7],
      generatedComponentApi[13].props[8],
      generatedComponentApi[13].props[9],
      generatedComponentApi[13].props[10],
      {
        name: 'defaultFiltersOpen',
        type: 'boolean',
        required: false,
        description: 'Początkowa niekontrolowana wartość właściwości filtersOpen.',
      },
    ],
    models: [
      {
        name: 'filtersOpen',
        type: 'boolean',
        required: false,
        description:
          'Kontrolowana wartość filtersOpen; aktualizuj ją przez onFiltersOpenChange. Dla stanu niekontrolowanego użyj defaultFiltersOpen.',
      },
    ],
    events: [
      {
        name: 'onFiltersOpenChange',
        type: '(value: boolean) => void',
        description: 'Callback React wywoływany po zmianie właściwości filtersOpen.',
      },
      {
        name: 'onSearch',
        type: '(...args: unknown[]) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:search”.',
      },
      {
        name: 'onResetFilters',
        type: '(...args: unknown[]) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:reset-filters”.',
      },
      {
        name: 'onCreate',
        type: '(...args: unknown[]) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:create”.',
      },
      {
        name: 'onExport',
        type: '(...args: unknown[]) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:export”.',
      },
      {
        name: 'onUpdateFiltersOpen',
        type: '(...args: unknown[]) => void',
        description:
          'Emitowane po zmianie modelu „filters-open”; przekaż nową wartość do kontrolowany prop.',
      },
    ],
    slots: [
      {
        name: 'filtersDrawer',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop filtersDrawer.',
      },
      {
        name: 'additionalButtons',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop additionalButtons.',
      },
      {
        name: 'additionalContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop additionalContent.',
      },
      {
        name: 'addtionalContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop addtionalContent.',
      },
      {
        name: 'additionalDescription',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop additionalDescription.',
      },
      {
        name: 'addtionalDescription',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop addtionalDescription.',
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
      generatedComponentApi[14].props[0],
      generatedComponentApi[14].props[1],
      generatedComponentApi[24].props[2],
      generatedComponentApi[72].props[1],
      generatedComponentApi[86].props[1],
      generatedComponentApi[14].props[5],
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
      generatedComponentApi[21].props[0],
      generatedComponentApi[86].props[2],
      generatedComponentApi[15].props[2],
      generatedComponentApi[15].props[3],
      generatedComponentApi[15].props[4],
      generatedComponentApi[86].props[1],
      {
        name: 'defaultTree',
        type: 'PeauiTreeNode | PeauiTreeNode[]',
        required: false,
        default: "{ children: {}, label: '' }",
        description: 'Początkowa niekontrolowana wartość właściwości tree.',
      },
    ],
    models: [
      {
        name: 'tree',
        type: 'PeauiTreeNode | PeauiTreeNode[]',
        required: false,
        default: "{ children: {}, label: '' }",
        description:
          'Kontrolowana wartość tree; aktualizuj ją przez onTreeChange. Dla stanu niekontrolowanego użyj defaultTree.',
      },
    ],
    events: [
      {
        name: 'onTreeChange',
        type: '(value: PeauiTreeNode | PeauiTreeNode[]) => void',
        description: 'Callback React wywoływany po zmianie właściwości tree.',
      },
      {
        name: 'onRemove',
        type: '(...args: unknown[]) => void',
        description: 'Emitowane po wybraniu akcji usunięcia.',
      },
      {
        name: 'onUpdateTree',
        type: '(...args: unknown[]) => void',
        description:
          'Emitowane po zmianie modelu „tree”; przekaż nową wartość do kontrolowany prop.',
      },
    ],
    slots: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop children.',
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
      generatedComponentApi[16].props[0],
      generatedComponentApi[16].props[1],
      generatedComponentApi[16].props[2],
      generatedComponentApi[16].props[3],
      generatedComponentApi[16].props[4],
      generatedComponentApi[16].props[5],
      {
        name: 'semanticRole',
        type: 'VirtualListRole',
        required: false,
        default: 'list',
        description: 'Semantyka neutralnej listy albo interaktywnego listboxa.',
      },
      generatedComponentApi[16].props[7],
      generatedComponentApi[69].props[6],
      generatedComponentApi[16].props[9],
      generatedComponentApi[16].props[10],
      generatedComponentApi[16].props[11],
      generatedComponentApi[16].props[12],
      generatedComponentApi[16].props[13],
      generatedComponentApi[66].props[10],
      {
        name: 'defaultActiveIndex',
        type: 'number | null',
        required: false,
        default: 'null',
        description: 'Konfiguruje właściwość „default active index” komponentu.',
      },
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Konfiguruje właściwość „class name” komponentu.',
      },
      {
        name: 'style',
        type: 'CSSProperties',
        required: false,
        description: 'Konfiguruje właściwość „style” komponentu.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description: 'Konfiguruje właściwość „data testid” komponentu.',
      },
    ],
    models: [
      {
        name: 'activeIndex',
        type: 'number | null',
        required: false,
        default: 'null',
        description:
          'Kontrolowana wartość activeIndex; aktualizuj ją przez onActiveIndexChange. Dla stanu niekontrolowanego użyj defaultActiveIndex.',
      },
    ],
    events: [
      {
        name: 'onActiveIndexChange',
        type: '(index: number | null) => void',
        description: 'Konfiguruje właściwość „on active index change” komponentu.',
      },
      {
        name: 'onVisibleRangeChange',
        type: '(detail: VirtualListRange) => void',
        description: 'Konfiguruje właściwość „on visible range change” komponentu.',
      },
      {
        name: 'onReachEnd',
        type: '(detail: VirtualListReachEndDetail) => void',
        description: 'Konfiguruje właściwość „on reach end” komponentu.',
      },
      {
        name: 'onScroll',
        type: '(detail: VirtualListScrollDetail) => void',
        description: 'Konfiguruje właściwość „on scroll” komponentu.',
      },
      {
        name: 'onItemFocus',
        type: '(detail: VirtualListItemFocusDetail) => void',
        description: 'Konfiguruje właściwość „on item focus” komponentu.',
      },
      {
        name: 'onMeasureError',
        type: '(detail: VirtualListMeasureErrorDetail) => void',
        description: 'Konfiguruje właściwość „on measure error” komponentu.',
      },
    ],
    slots: [
      {
        name: 'renderItem',
        type: '(state: VirtualListItemSlotState) => ReactNode',
        description:
          'Funkcja renderująca renderItem; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'empty',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop empty.',
      },
      {
        name: 'loadingContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop loadingContent.',
      },
      {
        name: 'before',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop before.',
      },
      {
        name: 'after',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop after.',
      },
      {
        name: 'footer',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop footer.',
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
      generatedComponentApi[36].props[5],
      generatedComponentApi[85].props[1],
      generatedComponentApi[17].props[2],
      generatedComponentApi[86].props[2],
      generatedComponentApi[86].props[3],
      generatedComponentApi[86].props[1],
      generatedComponentApi[85].props[8],
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop children.',
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
      generatedComponentApi[85].props[0],
      generatedComponentApi[18].props[1],
      generatedComponentApi[18].props[2],
      generatedComponentApi[86].props[2],
      generatedComponentApi[86].props[3],
      {
        name: 'placement',
        type: "| 'top'\n      | 'right'\n      | 'bottom'\n      | 'left'\n      | 'top-left'\n      | 'top-right'\n      | 'bottom-left'\n      | 'bottom-right'",
        required: false,
        default: 'bottom',
        description: 'Konfiguruje właściwość „placement” komponentu.',
      },
      generatedComponentApi[86].props[1],
      generatedComponentApi[18].props[7],
      generatedComponentApi[18].props[8],
      generatedComponentApi[85].props[8],
    ],
    models: [],
    events: [
      {
        name: 'onExport',
        type: '(...args: unknown[]) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:export”.',
      },
    ],
    slots: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop children.',
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
      generatedComponentApi[19].props[0],
      {
        name: 'getText',
        type: 'CopyButtonTextResolver',
        required: false,
        description: 'Pobiera wartość w chwili aktywacji; obsługuje również źródła asynchroniczne.',
      },
      generatedComponentApi[19].props[2],
      generatedComponentApi[19].props[3],
      generatedComponentApi[19].props[4],
      generatedComponentApi[19].props[5],
      generatedComponentApi[19].props[6],
      {
        name: 'content',
        type: 'CopyButtonContent',
        required: false,
        default: 'icon-text',
        description: 'Określa, czy przycisk wyświetla ikonę, tekst, czy oba elementy.',
      },
      {
        name: 'variant',
        type: 'CopyButtonVariant',
        required: false,
        default: 'secondary',
        description: 'Wariant wizualny zgodny z ButtonAction.',
      },
      {
        name: 'size',
        type: 'CopyButtonSize',
        required: false,
        default: 'm',
        description: 'Rozmiar zgodny ze skalą ButtonAction.',
      },
      generatedComponentApi[69].props[6],
      generatedComponentApi[19].props[11],
      generatedComponentApi[19].props[12],
      generatedComponentApi[19].props[13],
      generatedComponentApi[19].props[14],
      generatedComponentApi[19].props[15],
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Konfiguruje właściwość „class name” komponentu.',
      },
      {
        name: 'style',
        type: 'CSSProperties',
        required: false,
        description: 'Konfiguruje właściwość „style” komponentu.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description: 'Konfiguruje właściwość „aria label” komponentu.',
      },
      {
        name: 'aria-labelledby',
        type: 'string',
        required: false,
        description: 'Konfiguruje właściwość „aria labelledby” komponentu.',
      },
      {
        name: 'aria-describedby',
        type: 'string',
        required: false,
        description: 'Konfiguruje właściwość „aria describedby” komponentu.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description: 'Konfiguruje właściwość „data testid” komponentu.',
      },
    ],
    models: [],
    events: [
      {
        name: 'onCopy',
        type: '(detail: CopyButtonCopyDetail) => void',
        description: 'Konfiguruje właściwość „on copy” komponentu.',
      },
      {
        name: 'onSuccess',
        type: '(detail: CopyButtonSuccessDetail) => void',
        description: 'Konfiguruje właściwość „on success” komponentu.',
      },
      {
        name: 'onError',
        type: '(detail: CopyButtonErrorDetail) => void',
        description: 'Konfiguruje właściwość „on error” komponentu.',
      },
      {
        name: 'onStatusChange',
        type: '(status: CopyButtonStatus) => void',
        description: 'Konfiguruje właściwość „on status change” komponentu.',
      },
    ],
    slots: [
      {
        name: 'children',
        type: 'ReactNode | ((state: CopyButtonStatusSlotState) => ReactNode)',
        description:
          'Funkcja renderująca children; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'icon',
        type: 'ReactNode | ((state: CopyButtonStatusSlotState) => ReactNode)',
        description:
          'Funkcja renderująca icon; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'copiedIcon',
        type: 'ReactNode | ((state: CopyButtonStatusSlotState) => ReactNode)',
        description:
          'Funkcja renderująca copiedIcon; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderStatus',
        type: '(state: CopyButtonStatusSlotState) => ReactNode',
        description:
          'Funkcja renderująca renderStatus; argumenty i zwracana treść są opisane w sygnaturze.',
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
        name: 'defaultValue',
        type: 'InlineEditValue',
        required: false,
        description: 'Konfiguruje właściwość „default value” komponentu.',
      },
      {
        name: 'defaultEditing',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „default editing” komponentu.',
      },
      {
        name: 'editor',
        type: 'InlineEditEditor',
        required: false,
        default: 'text',
        description: 'Rodzaj wbudowanego edytora albo własna kontrolka ze slotu editor.',
      },
      generatedComponentApi[20].props[1],
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
      generatedComponentApi[20].props[7],
      generatedComponentApi[69].props[6],
      generatedComponentApi[20].props[9],
      generatedComponentApi[86].props[2],
      generatedComponentApi[45].props[2],
      generatedComponentApi[20].props[12],
      generatedComponentApi[20].props[13],
      generatedComponentApi[20].props[14],
      generatedComponentApi[20].props[15],
      generatedComponentApi[20].props[16],
      generatedComponentApi[86].props[1],
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Konfiguruje właściwość „class name” komponentu.',
      },
      {
        name: 'style',
        type: 'CSSProperties',
        required: false,
        description: 'Konfiguruje właściwość „style” komponentu.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description: 'Konfiguruje właściwość „data testid” komponentu.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'InlineEditValue',
        required: false,
        description:
          'Kontrolowana wartość value; aktualizuj ją przez onValueChange. Dla stanu niekontrolowanego użyj defaultValue.',
      },
      {
        name: 'editing',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Kontrolowana wartość editing; aktualizuj ją przez onEditingChange. Dla stanu niekontrolowanego użyj defaultEditing.',
      },
    ],
    events: [
      {
        name: 'onValueChange',
        type: '(value: InlineEditValue) => void',
        description: 'Konfiguruje właściwość „on value change” komponentu.',
      },
      {
        name: 'onEditingChange',
        type: '(editing: boolean) => void',
        description: 'Konfiguruje właściwość „on editing change” komponentu.',
      },
      {
        name: 'onEdit',
        type: '(value: InlineEditValue) => void',
        description: 'Konfiguruje właściwość „on edit” komponentu.',
      },
      {
        name: 'onSave',
        type: '(detail: InlineEditSaveDetail) => void',
        description: 'Konfiguruje właściwość „on save” komponentu.',
      },
      {
        name: 'onCancel',
        type: '(value: InlineEditValue) => void',
        description: 'Konfiguruje właściwość „on cancel” komponentu.',
      },
      {
        name: 'onInvalid',
        type: '(detail: InlineEditInvalidDetail) => void',
        description: 'Konfiguruje właściwość „on invalid” komponentu.',
      },
      {
        name: 'onDraftChange',
        type: '(value: InlineEditValue) => void',
        description: 'Konfiguruje właściwość „on draft change” komponentu.',
      },
    ],
    slots: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop children.',
      },
      {
        name: 'empty',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop empty.',
      },
      {
        name: 'displayContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop displayContent.',
      },
      {
        name: 'renderDisplay',
        type: '(value: InlineEditValue) => ReactNode',
        description:
          'Funkcja renderująca renderDisplay; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderEditor',
        type: '(state: InlineEditSlotState) => ReactNode',
        description:
          'Funkcja renderująca renderEditor; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderActions',
        type: '(state: {\n    cancel: () => void;\n    dirty: boolean;\n    loading: boolean;\n    save: () => void;\n  }) => ReactNode',
        description:
          'Funkcja renderująca renderActions; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderError',
        type: '(message: string) => ReactNode',
        description:
          'Funkcja renderująca renderError; argumenty i zwracana treść są opisane w sygnaturze.',
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
      generatedComponentApi[21].props[0],
      generatedComponentApi[21].props[1],
      generatedComponentApi[60].props[4],
      generatedComponentApi[86].props[3],
      generatedComponentApi[86].props[2],
      generatedComponentApi[86].props[1],
      {
        name: 'defaultValue',
        type: 'number',
        required: false,
        default: '0',
        description: 'Początkowa niekontrolowana wartość właściwości value.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'number',
        required: false,
        default: '0',
        description:
          'Kontrolowana wartość value; aktualizuj ją przez onValueChange. Dla stanu niekontrolowanego użyj defaultValue.',
      },
    ],
    events: [
      {
        name: 'onValueChange',
        type: '(value: number) => void',
        description: 'Callback React wywoływany po zmianie właściwości value.',
      },
      {
        name: 'onUpdateValue',
        type: '(...args: unknown[]) => void',
        description:
          'Emitowane po zmianie modelu „value”; przekaż nową wartość do kontrolowany prop.',
      },
    ],
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
      generatedComponentApi[22].props[0],
      generatedComponentApi[22].props[1],
      generatedComponentApi[22].props[2],
      generatedComponentApi[86].props[2],
      generatedComponentApi[45].props[2],
      generatedComponentApi[86].props[1],
      {
        name: 'defaultValue',
        type: 'string | undefined',
        required: false,
        description: 'Początkowa niekontrolowana wartość właściwości value.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string | undefined',
        required: false,
        description:
          'Kontrolowana wartość value; aktualizuj ją przez onValueChange. Dla stanu niekontrolowanego użyj defaultValue.',
      },
    ],
    events: [
      {
        name: 'onValueChange',
        type: '(value: string | undefined) => void',
        description: 'Callback React wywoływany po zmianie właściwości value.',
      },
      {
        name: 'onSearch',
        type: '(...args: unknown[]) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:search”.',
      },
      {
        name: 'onRemove',
        type: '(...args: unknown[]) => void',
        description: 'Emitowane po wybraniu akcji usunięcia.',
      },
      {
        name: 'onUpdateValue',
        type: '(...args: unknown[]) => void',
        description:
          'Emitowane po zmianie modelu „value”; przekaż nową wartość do kontrolowany prop.',
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
        name: 'defaultValue',
        type: 'PeauiSegmentedControlValue | null',
        required: false,
        default: 'null',
        description: 'Konfiguruje właściwość „default value” komponentu.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'PeauiSegmentedControlValue | null',
        required: false,
        default: 'null',
        description:
          'Kontrolowana wartość value; aktualizuj ją przez onValueChange. Dla stanu niekontrolowanego użyj defaultValue.',
      },
    ],
    events: [
      {
        name: 'onValueChange',
        type: '(value: PeauiSegmentedControlValue) => void',
        description: 'Konfiguruje właściwość „on value change” komponentu.',
      },
      {
        name: 'onChange',
        type: '(\n    value: PeauiSegmentedControlValue,\n    item: PeauiSegmentedControlItem,\n    event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>,\n  ) => void',
        description: 'Konfiguruje właściwość „on change” komponentu.',
      },
    ],
    slots: [],
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
      generatedComponentApi[86].props[2],
      generatedComponentApi[45].props[2],
      generatedComponentApi[24].props[2],
      generatedComponentApi[86].props[1],
      generatedComponentApi[86].props[3],
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'title',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop title.',
      },
      {
        name: 'description',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop description.',
      },
      {
        name: 'additional',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop additional.',
      },
      {
        name: 'hint',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop hint.',
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
    props: [],
    models: [],
    events: [
      {
        name: 'onPrimaryClick',
        type: '(event: MouseEvent<HTMLButtonElement>) => void',
        description: 'Konfiguruje właściwość „on primary click” komponentu.',
      },
      {
        name: 'onSelect',
        type: '(item: PeauiDropdownMenuItem, path: number[]) => void',
        description: 'Konfiguruje właściwość „on select” komponentu.',
      },
    ],
    slots: [],
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
      generatedComponentApi[26].props[0],
      generatedComponentApi[26].props[1],
      generatedComponentApi[26].props[2],
      generatedComponentApi[26].props[3],
      generatedComponentApi[26].props[4],
      generatedComponentApi[26].props[5],
      generatedComponentApi[26].props[6],
      generatedComponentApi[26].props[7],
      generatedComponentApi[26].props[8],
      generatedComponentApi[26].props[9],
      generatedComponentApi[56].props[10],
      generatedComponentApi[26].props[11],
      generatedComponentApi[69].props[6],
      generatedComponentApi[26].props[13],
      generatedComponentApi[56].props[18],
      generatedComponentApi[73].props[5],
      {
        name: 'defaultValue',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Początkowa niekontrolowana wartość właściwości value.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Kontrolowana wartość value; aktualizuj ją przez onValueChange. Dla stanu niekontrolowanego użyj defaultValue.',
      },
    ],
    events: [
      {
        name: 'onValueChange',
        type: '(value: boolean) => void',
        description: 'Callback React wywoływany po zmianie właściwości value.',
      },
      {
        name: 'onChange',
        type: '(...args: unknown[]) => void',
        description: 'Emitowane po zmianie wraz z nowym stanem i natywnym zdarzeniem.',
      },
      {
        name: 'onUpdateValue',
        type: '(...args: unknown[]) => void',
        description:
          'Emitowane po zmianie modelu „value”; przekaż nową wartość do kontrolowany prop.',
      },
    ],
    slots: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop children.',
      },
      {
        name: 'iconContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop iconContent.',
      },
      {
        name: 'pressedIconContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop pressedIconContent.',
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
      generatedComponentApi[27].props[3],
      {
        name: 'defaultValue',
        type: 'PeauiToggleGroupValue | null | PeauiToggleGroupValue[]',
        required: false,
        default: 'null',
        description: 'Konfiguruje właściwość „default value” komponentu.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'PeauiToggleGroupValue | null | PeauiToggleGroupValue[]',
        required: false,
        default: 'null',
        description:
          'Kontrolowana wartość value; aktualizuj ją przez onValueChange. Dla stanu niekontrolowanego użyj defaultValue.',
      },
    ],
    events: [
      {
        name: 'onChange',
        type: '(\n    value: PeauiToggleGroupValue | PeauiToggleGroupValue[] | null,\n    item: PeauiToggleGroupItem,\n    event: MouseEvent<HTMLButtonElement>,\n  ) => void',
        description: 'Konfiguruje właściwość „on change” komponentu.',
      },
      {
        name: 'onValueChange',
        type: '(value: PeauiToggleGroupValue | null) => void | (value: PeauiToggleGroupValue[]) => void',
        description: 'Konfiguruje właściwość „on value change” komponentu.',
      },
    ],
    slots: [],
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
      generatedComponentApi[28].props[3],
      generatedComponentApi[28].props[4],
      generatedComponentApi[28].props[5],
      generatedComponentApi[28].props[7],
      generatedComponentApi[28].props[8],
      generatedComponentApi[28].props[9],
      generatedComponentApi[28].props[10],
      generatedComponentApi[28].props[11],
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
        name: 'defaultValue',
        type: 'TransferListKey[]',
        required: false,
        default: '[]',
        description: 'Konfiguruje właściwość „default value” komponentu.',
      },
      {
        name: 'defaultSourceSelected',
        type: 'TransferListKey[]',
        required: false,
        default: '[]',
        description: 'Konfiguruje właściwość „default source selected” komponentu.',
      },
      {
        name: 'defaultTargetSelected',
        type: 'TransferListKey[]',
        required: false,
        default: '[]',
        description: 'Konfiguruje właściwość „default target selected” komponentu.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'TransferListKey[]',
        required: false,
        default: '[]',
        description:
          'Kontrolowana wartość value; aktualizuj ją przez onValueChange. Dla stanu niekontrolowanego użyj defaultValue.',
      },
      {
        name: 'sourceSelected',
        type: 'TransferListKey[]',
        required: false,
        default: '[]',
        description:
          'Kontrolowana wartość sourceSelected; aktualizuj ją przez onSourceSelectedChange. Dla stanu niekontrolowanego użyj defaultSourceSelected.',
      },
      {
        name: 'targetSelected',
        type: 'TransferListKey[]',
        required: false,
        default: '[]',
        description:
          'Kontrolowana wartość targetSelected; aktualizuj ją przez onTargetSelectedChange. Dla stanu niekontrolowanego użyj defaultTargetSelected.',
      },
    ],
    events: [
      {
        name: 'onValueChange',
        type: '(value: TransferListKey[]) => void',
        description: 'Konfiguruje właściwość „on value change” komponentu.',
      },
      {
        name: 'onSourceSelectedChange',
        type: '(value: TransferListKey[]) => void',
        description: 'Konfiguruje właściwość „on source selected change” komponentu.',
      },
      {
        name: 'onTargetSelectedChange',
        type: '(value: TransferListKey[]) => void',
        description: 'Konfiguruje właściwość „on target selected change” komponentu.',
      },
      {
        name: 'onMove',
        type: '(detail: TransferListMoveDetail) => void',
        description: 'Konfiguruje właściwość „on move” komponentu.',
      },
      {
        name: 'onSearch',
        type: '(detail: TransferListSearchDetail) => void',
        description: 'Konfiguruje właściwość „on search” komponentu.',
      },
      {
        name: 'onSelectionChange',
        type: '(detail: TransferListSelectionDetail) => void',
        description: 'Konfiguruje właściwość „on selection change” komponentu.',
      },
    ],
    slots: [
      {
        name: 'renderSourceHeader',
        type: '(state: { count: number; selectedCount: number }) => ReactNode',
        description:
          'Funkcja renderująca renderSourceHeader; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderTargetHeader',
        type: '(state: { count: number; selectedCount: number }) => ReactNode',
        description:
          'Funkcja renderująca renderTargetHeader; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderItem',
        type: '(state: {\n    item: TransferListItem;\n    itemKey: TransferListKey;\n    label: string;\n    description?: string;\n    panel: TransferListPanel;\n    selected: boolean;\n    disabled: boolean;\n  }) => ReactNode',
        description:
          'Funkcja renderująca renderItem; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderSourceEmpty',
        type: '(state: { query: string }) => ReactNode',
        description:
          'Funkcja renderująca renderSourceEmpty; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderTargetEmpty',
        type: '(state: { query: string }) => ReactNode',
        description:
          'Funkcja renderująca renderTargetEmpty; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderLoading',
        type: '(state: { panel: TransferListPanel }) => ReactNode',
        description:
          'Funkcja renderująca renderLoading; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderControls',
        type: '(actions: {\n    moveSelectedToTarget: () => void;\n    moveSelectedToSource: () => void;\n    moveAllToTarget: () => void;\n    moveAllToSource: () => void;\n  }) => ReactNode',
        description:
          'Funkcja renderująca renderControls; argumenty i zwracana treść są opisane w sygnaturze.',
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
      generatedComponentApi[86].props[1],
      generatedComponentApi[35].props[1],
      generatedComponentApi[43].props[6],
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'additional',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop additional.',
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
      generatedComponentApi[75].props[2],
      generatedComponentApi[86].props[1],
      {
        name: 'size',
        type: "| 'xxs'\n      | 'xs'\n      | 's'\n      | 'm'\n      | 'l'\n      | 'xl'\n      | 'heading-xs'\n      | 'heading-s'\n      | 'heading-m'\n      | 'heading-l'",
        required: false,
        default: 's',
        description: 'Wariant rozmiaru komponentu.',
      },
      generatedComponentApi[30].props[3],
      generatedComponentApi[30].props[4],
      generatedComponentApi[30].props[5],
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop children.',
      },
    ],
  },
  {
    category: 'feedback',
    categoryLabel: 'Informacje zwrotne',
    name: 'NotificationCenter',
    sourceName: 'NotificationCenter',
    framework: 'react',
    importPath: '@peaui/ui/react/feedback/NotificationCenter',
    status: 'stable',
    props: [
      generatedComponentApi[31].props[0],
      generatedComponentApi[31].props[1],
      generatedComponentApi[31].props[2],
      {
        name: 'groupBy',
        type: 'NotificationCenterGroupBy',
        required: false,
        default: 'none',
        description: 'Groups visible notifications without changing their order.',
      },
      generatedComponentApi[69].props[6],
      generatedComponentApi[31].props[5],
      generatedComponentApi[31].props[6],
      generatedComponentApi[31].props[7],
      generatedComponentApi[31].props[8],
      generatedComponentApi[31].props[9],
      generatedComponentApi[31].props[10],
      generatedComponentApi[31].props[11],
      {
        name: 'variant',
        type: 'NotificationCenterVariant',
        required: false,
        default: 'panel',
        description: 'Surface treatment for a panel, drawer body, or full page.',
      },
      {
        name: 'density',
        type: 'NotificationCenterDensity',
        required: false,
        default: 'comfortable',
        description: 'Vertical spacing density.',
      },
      {
        name: 'paginationMode',
        type: 'NotificationCenterPaginationMode',
        required: false,
        default: 'pagination',
        description: 'How additional data is requested.',
      },
      generatedComponentApi[31].props[15],
      generatedComponentApi[31].props[16],
      {
        name: 'referenceDate',
        type: 'NotificationCenterDate',
        required: false,
        default: 'new Date()',
        description: 'Stable reference date for deterministic relative formatting.',
      },
      generatedComponentApi[31].props[18],
      generatedComponentApi[31].props[19],
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Konfiguruje właściwość „class name” komponentu.',
      },
      {
        name: 'style',
        type: 'CSSProperties',
        required: false,
        description: 'Konfiguruje właściwość „style” komponentu.',
      },
    ],
    models: [
      {
        name: 'activeFilter',
        type: 'string',
        required: false,
        default: 'all',
        description: 'Kontrolowana wartość activeFilter; aktualizuj ją przez onActiveFilterChange.',
      },
      {
        name: 'selectedId',
        type: 'NotificationCenterItemId | null',
        required: false,
        default: 'null',
        description: 'Kontrolowana wartość selectedId; aktualizuj ją przez onSelectedIdChange.',
      },
    ],
    events: [
      {
        name: 'onActiveFilterChange',
        type: '(filterId: string) => void',
        description: 'Konfiguruje właściwość „on active filter change” komponentu.',
      },
      {
        name: 'onSelectedIdChange',
        type: '(id: NotificationCenterItemId) => void',
        description: 'Konfiguruje właściwość „on selected id change” komponentu.',
      },
      {
        name: 'onSelect',
        type: '(payload: NotificationCenterSelectPayload) => void',
        description: 'Konfiguruje właściwość „on select” komponentu.',
      },
      {
        name: 'onAction',
        type: '(payload: NotificationCenterActionPayload) => void',
        description: 'Konfiguruje właściwość „on action” komponentu.',
      },
      {
        name: 'onMarkRead',
        type: '(item: NotificationCenterItem) => void',
        description: 'Konfiguruje właściwość „on mark read” komponentu.',
      },
      {
        name: 'onMarkUnread',
        type: '(item: NotificationCenterItem) => void',
        description: 'Konfiguruje właściwość „on mark unread” komponentu.',
      },
      {
        name: 'onMarkAllRead',
        type: '() => void',
        description: 'Konfiguruje właściwość „on mark all read” komponentu.',
      },
      {
        name: 'onLoadMore',
        type: '(payload: NotificationCenterLoadMorePayload) => void',
        description: 'Konfiguruje właściwość „on load more” komponentu.',
      },
      {
        name: 'onFilterChange',
        type: '(filterId: string) => void',
        description: 'Konfiguruje właściwość „on filter change” komponentu.',
      },
      {
        name: 'onRetry',
        type: '() => void',
        description: 'Konfiguruje właściwość „on retry” komponentu.',
      },
    ],
    slots: [
      {
        name: 'renderHeader',
        type: '(context: {\n    unreadCount: number;\n    markAllRead: () => void;\n    pending: boolean;\n  }) => ReactNode',
        description:
          'Funkcja renderująca renderHeader; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderFilters',
        type: '(context: {\n    filters: readonly NotificationCenterFilter[];\n    activeFilter: string;\n    selectFilter: (filterId: string) => void;\n  }) => ReactNode',
        description:
          'Funkcja renderująca renderFilters; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderGroupHeader',
        type: '(group: NotificationCenterGroup) => ReactNode',
        description:
          'Funkcja renderująca renderGroupHeader; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderItem',
        type: '(context: NotificationCenterItemRenderContext) => ReactNode',
        description:
          'Funkcja renderująca renderItem; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderItemIcon',
        type: '(item: NotificationCenterItem) => ReactNode',
        description:
          'Funkcja renderująca renderItemIcon; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderItemActions',
        type: '(context: {\n    item: NotificationCenterItem;\n    emitAction: (action: NotificationCenterAction) => void;\n  }) => ReactNode',
        description:
          'Funkcja renderująca renderItemActions; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderEmpty',
        type: '(filtered: boolean) => ReactNode',
        description:
          'Funkcja renderująca renderEmpty; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderLoading',
        type: '() => ReactNode',
        description:
          'Funkcja renderująca renderLoading; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderError',
        type: '(context: { error: string; retry: () => void }) => ReactNode',
        description:
          'Funkcja renderująca renderError; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderFooter',
        type: '(context: { hasMore: boolean; loadMore: () => void }) => ReactNode',
        description:
          'Funkcja renderująca renderFooter; argumenty i zwracana treść są opisane w sygnaturze.',
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
      generatedComponentApi[32].props[0],
      generatedComponentApi[32].props[1],
      generatedComponentApi[32].props[2],
      generatedComponentApi[32].props[3],
      generatedComponentApi[32].props[4],
      generatedComponentApi[86].props[1],
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
      generatedComponentApi[85].props[0],
      generatedComponentApi[33].props[1],
      generatedComponentApi[33].props[2],
      generatedComponentApi[86].props[1],
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
    props: [generatedComponentApi[86].props[1]],
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
      generatedComponentApi[35].props[0],
      generatedComponentApi[35].props[1],
      generatedComponentApi[43].props[6],
      generatedComponentApi[86].props[1],
      generatedComponentApi[35].props[4],
      generatedComponentApi[35].props[5],
      generatedComponentApi[35].props[6],
      generatedComponentApi[35].props[7],
    ],
    models: [],
    events: [
      {
        name: 'onClose',
        type: '(...args: unknown[]) => void',
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
    framework: 'react',
    importPath: '@peaui/ui/react/form/FormButtonCheckbox',
    status: 'stable',
    props: [
      generatedComponentApi[75].props[2],
      generatedComponentApi[60].props[4],
      generatedComponentApi[53].props[3],
      generatedComponentApi[58].props[5],
      generatedComponentApi[60].props[12],
      generatedComponentApi[36].props[5],
      generatedComponentApi[86].props[3],
      generatedComponentApi[86].props[1],
      {
        name: 'defaultValue',
        type: 'boolean | undefined',
        required: false,
        description: 'Początkowa niekontrolowana wartość właściwości value.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'boolean | undefined',
        required: false,
        description:
          'Kontrolowana wartość value; aktualizuj ją przez onValueChange. Dla stanu niekontrolowanego użyj defaultValue.',
      },
    ],
    events: [
      {
        name: 'onValueChange',
        type: '(value: boolean | undefined) => void',
        description: 'Callback React wywoływany po zmianie właściwości value.',
      },
      {
        name: 'onUpdateValue',
        type: '(...args: unknown[]) => void',
        description:
          'Emitowane po zmianie modelu „value”; przekaż nową wartość do kontrolowany prop.',
      },
    ],
    slots: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop children.',
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
      generatedComponentApi[37].props[0],
      generatedComponentApi[37].props[1],
      generatedComponentApi[60].props[5],
      generatedComponentApi[85].props[0],
      generatedComponentApi[37].props[4],
      generatedComponentApi[60].props[7],
      generatedComponentApi[60].props[12],
      generatedComponentApi[60].props[13],
      generatedComponentApi[86].props[1],
      {
        name: 'options',
        type: 'PeauiOption[]',
        required: false,
        default: '[]',
        description: 'Lista opcji dostępnych do wyświetlenia lub wyboru.',
      },
      {
        name: 'defaultValue',
        type: 'string | number | undefined',
        required: false,
        default: 'undefined',
        description: 'Początkowa niekontrolowana wartość właściwości value.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string | number | undefined',
        required: false,
        default: 'undefined',
        description:
          'Kontrolowana wartość value; aktualizuj ją przez onValueChange. Dla stanu niekontrolowanego użyj defaultValue.',
      },
    ],
    events: [
      {
        name: 'onValueChange',
        type: '(value: string | number | undefined) => void',
        description: 'Callback React wywoływany po zmianie właściwości value.',
      },
      {
        name: 'onUpdateValue',
        type: '(...args: unknown[]) => void',
        description:
          'Emitowane po zmianie modelu „value”; przekaż nową wartość do kontrolowany prop.',
      },
    ],
    slots: [
      {
        name: 'hint',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop hint.',
      },
      {
        name: 'additionalHint',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop additionalHint.',
      },
      {
        name: 'description',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop description.',
      },
      {
        name: 'error',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop error.',
      },
      {
        name: 'success',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop success.',
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
      generatedComponentApi[75].props[2],
      generatedComponentApi[60].props[4],
      generatedComponentApi[53].props[3],
      generatedComponentApi[58].props[5],
      generatedComponentApi[60].props[12],
      generatedComponentApi[86].props[1],
      {
        name: 'defaultValue',
        type: 'boolean | undefined',
        required: false,
        description: 'Początkowa niekontrolowana wartość właściwości value.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'boolean | undefined',
        required: false,
        description:
          'Kontrolowana wartość value; aktualizuj ją przez onValueChange. Dla stanu niekontrolowanego użyj defaultValue.',
      },
    ],
    events: [
      {
        name: 'onValueChange',
        type: '(value: boolean | undefined) => void',
        description: 'Callback React wywoływany po zmianie właściwości value.',
      },
      {
        name: 'onUpdateValue',
        type: '(...args: unknown[]) => void',
        description:
          'Emitowane po zmianie modelu „value”; przekaż nową wartość do kontrolowany prop.',
      },
    ],
    slots: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop children.',
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
        name: 'defaultValue',
        type: 'string',
        required: false,
        default: '#4C9A2A',
        description: 'Konfiguruje właściwość „default value” komponentu.',
      },
      {
        name: 'description',
        type: 'ReactNode',
        required: false,
        description: 'Dodatkowy opis objaśniający zawartość albo stan komponentu.',
      },
      {
        name: 'error',
        type: 'ReactNode',
        required: false,
        description: 'Komunikat błędu powiązany z polem lub operacją.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string',
        required: false,
        default: '#4C9A2A',
        description:
          'Kontrolowana wartość value; aktualizuj ją przez onValueChange. Dla stanu niekontrolowanego użyj defaultValue.',
      },
    ],
    events: [
      {
        name: 'onValueChange',
        type: '(value: string) => void',
        description: 'Konfiguruje właściwość „on value change” komponentu.',
      },
      {
        name: 'onOpenChange',
        type: '(open: boolean) => void',
        description: 'Konfiguruje właściwość „on open change” komponentu.',
      },
      {
        name: 'onChange',
        type: '(value: string) => void',
        description: 'Konfiguruje właściwość „on change” komponentu.',
      },
      {
        name: 'onCommit',
        type: '(value: string) => void',
        description: 'Konfiguruje właściwość „on commit” komponentu.',
      },
      {
        name: 'onInvalid',
        type: '(detail: FormColorPickerInvalidDetail) => void',
        description: 'Konfiguruje właściwość „on invalid” komponentu.',
      },
      {
        name: 'onEyedropperError',
        type: '(detail: FormColorPickerEyedropperErrorDetail) => void',
        description: 'Konfiguruje właściwość „on eyedropper error” komponentu.',
      },
      {
        name: 'onEyedropperStart',
        type: '() => void',
        description: 'Konfiguruje właściwość „on eyedropper start” komponentu.',
      },
      {
        name: 'onOpen',
        type: '() => void',
        description: 'Konfiguruje właściwość „on open” komponentu.',
      },
      {
        name: 'onClose',
        type: '() => void',
        description: 'Konfiguruje właściwość „on close” komponentu.',
      },
    ],
    slots: [
      {
        name: 'renderTrigger',
        type: '(state: { color: string; open: boolean; toggle: () => void }) => ReactNode',
        description:
          'Funkcja renderująca renderTrigger; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderSwatch',
        type: '(state: { color: string }) => ReactNode',
        description:
          'Funkcja renderująca renderSwatch; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderSavedColor',
        type: '(state: { color: FormColorPickerSwatch; index: number }) => ReactNode',
        description:
          'Funkcja renderująca renderSavedColor; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderRecentColor',
        type: '(state: { color: FormColorPickerSwatch; index: number }) => ReactNode',
        description:
          'Funkcja renderująca renderRecentColor; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderFooter',
        type: '(state: { color: string }) => ReactNode',
        description:
          'Funkcja renderująca renderFooter; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'footerContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop footerContent.',
      },
      {
        name: 'hintContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop hintContent.',
      },
      {
        name: 'descriptionContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop descriptionContent.',
      },
      {
        name: 'errorContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop errorContent.',
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
      generatedComponentApi[72].props[1],
      generatedComponentApi[40].props[1],
      generatedComponentApi[40].props[2],
      generatedComponentApi[40].props[3],
      generatedComponentApi[86].props[1],
      generatedComponentApi[60].props[12],
      generatedComponentApi[40].props[6],
      generatedComponentApi[40].props[7],
      generatedComponentApi[40].props[8],
      generatedComponentApi[40].props[9],
      generatedComponentApi[40].props[10],
    ],
    models: [],
    events: [
      {
        name: 'onCancel',
        type: '(...args: unknown[]) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:cancel”.',
      },
      {
        name: 'onSubmit',
        type: '(...args: unknown[]) => void',
        description: 'Emitowane po zatwierdzeniu danych.',
      },
    ],
    slots: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop children.',
      },
      {
        name: 'additionalBefore',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop additionalBefore.',
      },
      {
        name: 'additionalAfter',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop additionalAfter.',
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
      generatedComponentApi[75].props[2],
      generatedComponentApi[60].props[1],
      generatedComponentApi[60].props[2],
      generatedComponentApi[60].props[3],
      generatedComponentApi[60].props[4],
      generatedComponentApi[60].props[5],
      generatedComponentApi[60].props[6],
      generatedComponentApi[60].props[7],
      generatedComponentApi[41].props[8],
      generatedComponentApi[60].props[9],
      generatedComponentApi[42].props[19],
      generatedComponentApi[42].props[18],
      generatedComponentApi[41].props[12],
      generatedComponentApi[41].props[13],
      generatedComponentApi[60].props[12],
      generatedComponentApi[60].props[13],
      generatedComponentApi[86].props[1],
      {
        name: 'defaultValue',
        type: 'string | PeauiPickerRangeValue<string> | undefined',
        required: false,
        description: 'Początkowa niekontrolowana wartość właściwości value.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string | PeauiPickerRangeValue<string> | undefined',
        required: false,
        description:
          'Kontrolowana wartość value; aktualizuj ją przez onValueChange. Dla stanu niekontrolowanego użyj defaultValue.',
      },
    ],
    events: [
      {
        name: 'onValueChange',
        type: '(value: string | PeauiPickerRangeValue<string> | undefined) => void',
        description: 'Callback React wywoływany po zmianie właściwości value.',
      },
      {
        name: 'onRemove',
        type: '(...args: unknown[]) => void',
        description: 'Emitowane po wybraniu akcji usunięcia.',
      },
      {
        name: 'onUpdateValue',
        type: '(...args: unknown[]) => void',
        description:
          'Emitowane po zmianie modelu „value”; przekaż nową wartość do kontrolowany prop.',
      },
    ],
    slots: [
      {
        name: 'hint',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop hint.',
      },
      {
        name: 'description',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop description.',
      },
      {
        name: 'error',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop error.',
      },
      {
        name: 'success',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop success.',
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
        name: 'defaultValue',
        type: 'DateRangeValue',
        required: false,
        description: 'Konfiguruje właściwość „default value” komponentu.',
      },
      generatedComponentApi[42].props[25],
      {
        name: 'description',
        type: 'ReactNode',
        required: false,
        description: 'Dodatkowy opis objaśniający zawartość albo stan komponentu.',
      },
      {
        name: 'error',
        type: 'ReactNode',
        required: false,
        description: 'Komunikat błędu powiązany z polem lub operacją.',
      },
      generatedComponentApi[42].props[11],
      generatedComponentApi[42].props[22],
      generatedComponentApi[42].props[13],
    ],
    models: [
      {
        name: 'value',
        type: 'DateRangeValue',
        required: false,
        description:
          'Kontrolowana wartość value; aktualizuj ją przez onValueChange. Dla stanu niekontrolowanego użyj defaultValue.',
      },
    ],
    events: [
      {
        name: 'onValueChange',
        type: '(value: DateRangeValue | undefined) => void',
        description: 'Konfiguruje właściwość „on value change” komponentu.',
      },
      {
        name: 'onChange',
        type: '(value: DateRangeValue | undefined) => void',
        description: 'Konfiguruje właściwość „on change” komponentu.',
      },
      {
        name: 'onApply',
        type: '(value: [string, string]) => void',
        description: 'Konfiguruje właściwość „on apply” komponentu.',
      },
      {
        name: 'onInvalid',
        type: '(detail: FormDateRangePickerInvalidDetail) => void',
        description: 'Konfiguruje właściwość „on invalid” komponentu.',
      },
      {
        name: 'onStartChange',
        type: '(value: string | undefined) => void',
        description: 'Konfiguruje właściwość „on start change” komponentu.',
      },
      {
        name: 'onEndChange',
        type: '(value: string | undefined) => void',
        description: 'Konfiguruje właściwość „on end change” komponentu.',
      },
    ],
    slots: [
      {
        name: 'renderTrigger',
        type: '(state: { displayValue: string; open: boolean; toggle: () => void }) => ReactNode',
        description:
          'Funkcja renderująca renderTrigger; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderDay',
        type: '(state: { day: DateRangeCalendarDay; select: () => void }) => ReactNode',
        description:
          'Funkcja renderująca renderDay; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderPreset',
        type: '(state: { preset: DateRangePreset; select: () => void }) => ReactNode',
        description:
          'Funkcja renderująca renderPreset; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'footerContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop footerContent.',
      },
      {
        name: 'startLabelContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop startLabelContent.',
      },
      {
        name: 'endLabelContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop endLabelContent.',
      },
      {
        name: 'descriptionContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop descriptionContent.',
      },
      {
        name: 'errorContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop errorContent.',
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
        name: 'defaultValue',
        type: 'LocalDateTimeValue',
        required: false,
        description: 'Konfiguruje właściwość „default value” komponentu.',
      },
      generatedComponentApi[43].props[19],
      generatedComponentApi[43].props[18],
      {
        name: 'description',
        type: 'ReactNode',
        required: false,
        description: 'Dodatkowy opis objaśniający zawartość albo stan komponentu.',
      },
      {
        name: 'error',
        type: 'ReactNode',
        required: false,
        description: 'Komunikat błędu powiązany z polem lub operacją.',
      },
      generatedComponentApi[43].props[12],
    ],
    models: [
      {
        name: 'value',
        type: 'LocalDateTimeValue',
        required: false,
        description:
          'Kontrolowana wartość value; aktualizuj ją przez onValueChange. Dla stanu niekontrolowanego użyj defaultValue.',
      },
    ],
    events: [
      {
        name: 'onValueChange',
        type: '(value: LocalDateTimeValue | undefined) => void',
        description: 'Konfiguruje właściwość „on value change” komponentu.',
      },
      {
        name: 'onChange',
        type: '(value: LocalDateTimeValue | undefined) => void',
        description: 'Konfiguruje właściwość „on change” komponentu.',
      },
      {
        name: 'onApply',
        type: '(value: LocalDateTimeValue) => void',
        description: 'Konfiguruje właściwość „on apply” komponentu.',
      },
      {
        name: 'onInvalid',
        type: '(detail: FormDateTimePickerInvalidDetail) => void',
        description: 'Konfiguruje właściwość „on invalid” komponentu.',
      },
    ],
    slots: [
      {
        name: 'renderTrigger',
        type: '(state: { displayValue: string; open: boolean; toggle: () => void }) => ReactNode',
        description:
          'Funkcja renderująca renderTrigger; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderDate',
        type: '(state: { date: string | undefined }) => ReactNode',
        description:
          'Funkcja renderująca renderDate; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderTime',
        type: '(state: { time: string | undefined }) => ReactNode',
        description:
          'Funkcja renderująca renderTime; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderTimeZone',
        type: '(state: { timeZone: string }) => ReactNode',
        description:
          'Funkcja renderująca renderTimeZone; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'footerContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop footerContent.',
      },
      {
        name: 'descriptionContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop descriptionContent.',
      },
      {
        name: 'errorContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop errorContent.',
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
      generatedComponentApi[60].props[2],
      generatedComponentApi[60].props[3],
      generatedComponentApi[55].props[1],
      generatedComponentApi[44].props[3],
      generatedComponentApi[60].props[12],
      generatedComponentApi[50].props[7],
      generatedComponentApi[60].props[6],
      generatedComponentApi[75].props[2],
      generatedComponentApi[60].props[5],
      generatedComponentApi[58].props[4],
      generatedComponentApi[60].props[4],
      generatedComponentApi[55].props[9],
      generatedComponentApi[60].props[13],
      generatedComponentApi[58].props[5],
      generatedComponentApi[86].props[1],
      generatedComponentApi[44].props[15],
      generatedComponentApi[44].props[16],
    ],
    models: [],
    events: [
      {
        name: 'onRemove',
        type: '(...args: unknown[]) => void',
        description: 'Emitowane po wybraniu akcji usunięcia.',
      },
    ],
    slots: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop children.',
      },
      {
        name: 'hint',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop hint.',
      },
      {
        name: 'additional',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop additional.',
      },
      {
        name: 'description',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop description.',
      },
      {
        name: 'error',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop error.',
      },
      {
        name: 'success',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop success.',
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
      generatedComponentApi[45].props[0],
      generatedComponentApi[45].props[1],
      generatedComponentApi[45].props[2],
      generatedComponentApi[58].props[5],
      generatedComponentApi[86].props[1],
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop children.',
      },
      {
        name: 'hint',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop hint.',
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
      generatedComponentApi[82].props[15],
      generatedComponentApi[86].props[2],
      generatedComponentApi[46].props[3],
      generatedComponentApi[46].props[0],
      generatedComponentApi[47].props[3],
      {
        name: 'defaultFile',
        type: 'FormFileUploadValue | File | undefined',
        required: false,
        description: 'Początkowa niekontrolowana wartość właściwości file.',
      },
      generatedComponentApi[46].props[5],
    ],
    models: [
      {
        name: 'file',
        type: 'FormFileUploadValue | File | undefined',
        required: false,
        description:
          'Kontrolowana wartość file; aktualizuj ją przez onFileChange. Dla stanu niekontrolowanego użyj defaultFile.',
      },
    ],
    events: [
      {
        name: 'onRemove',
        type: '(...args: unknown[]) => void',
        description: 'Emitowane po wybraniu akcji usunięcia.',
      },
      {
        name: 'onUpdateFile',
        type: '(...args: unknown[]) => void',
        description:
          'Emitowane po zmianie modelu „file”; przekaż nową wartość do kontrolowany prop.',
      },
      {
        name: 'onFileChange',
        type: '(value: FormFileUploadValue | undefined) => void | (value: File | undefined) => void',
        description: 'Konfiguruje właściwość „on file change” komponentu.',
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
      generatedComponentApi[47].props[0],
      generatedComponentApi[47].props[1],
      generatedComponentApi[86].props[2],
      generatedComponentApi[47].props[3],
      generatedComponentApi[47].props[4],
      generatedComponentApi[82].props[15],
      {
        name: 'defaultFiles',
        type: 'File[]',
        required: false,
        description: 'Początkowa niekontrolowana wartość właściwości files.',
      },
    ],
    models: [
      {
        name: 'files',
        type: 'File[]',
        required: false,
        description:
          'Kontrolowana wartość files; aktualizuj ją przez onFilesChange. Dla stanu niekontrolowanego użyj defaultFiles.',
      },
    ],
    events: [
      {
        name: 'onFilesChange',
        type: '(value: File[]) => void',
        description: 'Callback React wywoływany po zmianie właściwości files.',
      },
      {
        name: 'onUpdateFiles',
        type: '(...args: unknown[]) => void',
        description:
          'Emitowane po zmianie modelu „files”; przekaż nową wartość do kontrolowany prop.',
      },
    ],
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
      generatedComponentApi[75].props[2],
      generatedComponentApi[55].props[1],
      generatedComponentApi[60].props[2],
      generatedComponentApi[60].props[3],
      generatedComponentApi[60].props[4],
      generatedComponentApi[60].props[5],
      generatedComponentApi[60].props[6],
      generatedComponentApi[50].props[7],
      generatedComponentApi[58].props[4],
      generatedComponentApi[58].props[5],
      generatedComponentApi[58].props[6],
      generatedComponentApi[60].props[12],
      generatedComponentApi[60].props[13],
      generatedComponentApi[86].props[1],
      {
        name: 'defaultValue',
        type: 'string | undefined',
        required: false,
        description: 'Początkowa niekontrolowana wartość właściwości value.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string | undefined',
        required: false,
        description:
          'Kontrolowana wartość value; aktualizuj ją przez onValueChange. Dla stanu niekontrolowanego użyj defaultValue.',
      },
    ],
    events: [
      {
        name: 'onValueChange',
        type: '(value: string | undefined) => void',
        description: 'Callback React wywoływany po zmianie właściwości value.',
      },
      {
        name: 'onRemove',
        type: '(...args: unknown[]) => void',
        description: 'Emitowane po wybraniu akcji usunięcia.',
      },
      {
        name: 'onUpdateValue',
        type: '(...args: unknown[]) => void',
        description:
          'Emitowane po zmianie modelu „value”; przekaż nową wartość do kontrolowany prop.',
      },
    ],
    slots: [
      {
        name: 'hint',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop hint.',
      },
      {
        name: 'description',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop description.',
      },
      {
        name: 'error',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop error.',
      },
      {
        name: 'success',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop success.',
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
      generatedComponentApi[75].props[2],
      generatedComponentApi[55].props[1],
      generatedComponentApi[60].props[2],
      generatedComponentApi[60].props[3],
      generatedComponentApi[60].props[4],
      generatedComponentApi[60].props[5],
      generatedComponentApi[60].props[6],
      generatedComponentApi[58].props[5],
      generatedComponentApi[55].props[9],
      {
        name: 'labels',
        type: 'Partial<PeauiSelectLabels>',
        required: false,
        description: 'Konfiguruje właściwość „labels” komponentu.',
      },
      {
        name: 'valueMode',
        type: 'SelectValueMode',
        required: false,
        default: 'value',
        description: 'Value is the default; label preserves the pre-3.0 Vue/WC model contract.',
      },
      generatedComponentApi[55].props[12],
      generatedComponentApi[55].props[13],
      generatedComponentApi[60].props[12],
      generatedComponentApi[60].props[13],
      generatedComponentApi[55].props[17],
      generatedComponentApi[49].props[16],
      generatedComponentApi[86].props[1],
      {
        name: 'options',
        type: 'PeauiOption[]',
        required: true,
        description: 'Lista opcji dostępnych do wyświetlenia lub wyboru.',
      },
      generatedComponentApi[49].props[19],
      {
        name: 'defaultValue',
        type: 'unknown[] | null | undefined',
        required: false,
        description: 'Początkowa niekontrolowana wartość właściwości value.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'unknown[] | null | undefined',
        required: false,
        description:
          'Kontrolowana wartość value; aktualizuj ją przez onValueChange. Dla stanu niekontrolowanego użyj defaultValue.',
      },
    ],
    events: [
      {
        name: 'onValueChange',
        type: '(value: unknown[] | null | undefined) => void',
        description: 'Callback React wywoływany po zmianie właściwości value.',
      },
      {
        name: 'onRemove',
        type: '(...args: unknown[]) => void',
        description: 'Emitowane po wybraniu akcji usunięcia.',
      },
      {
        name: 'onUpdateValue',
        type: '(...args: unknown[]) => void',
        description:
          'Emitowane po zmianie modelu „value”; przekaż nową wartość do kontrolowany prop.',
      },
    ],
    slots: [
      {
        name: 'hint',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop hint.',
      },
      {
        name: 'description',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop description.',
      },
      {
        name: 'error',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop error.',
      },
      {
        name: 'success',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop success.',
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
      generatedComponentApi[75].props[2],
      generatedComponentApi[55].props[1],
      generatedComponentApi[60].props[2],
      generatedComponentApi[60].props[3],
      generatedComponentApi[60].props[4],
      generatedComponentApi[60].props[5],
      generatedComponentApi[60].props[6],
      generatedComponentApi[50].props[7],
      generatedComponentApi[50].props[8],
      generatedComponentApi[50].props[9],
      generatedComponentApi[50].props[10],
      generatedComponentApi[58].props[5],
      generatedComponentApi[58].props[6],
      generatedComponentApi[60].props[12],
      generatedComponentApi[60].props[13],
      generatedComponentApi[50].props[15],
      generatedComponentApi[86].props[1],
      {
        name: 'defaultValue',
        type: 'number | undefined | string',
        required: false,
        description: 'Początkowa niekontrolowana wartość właściwości value.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'number | undefined | string',
        required: false,
        description:
          'Kontrolowana wartość value; aktualizuj ją przez onValueChange. Dla stanu niekontrolowanego użyj defaultValue.',
      },
    ],
    events: [
      {
        name: 'onValueChange',
        type: '(value: number | undefined | string) => void',
        description: 'Callback React wywoływany po zmianie właściwości value.',
      },
      {
        name: 'onUpdateValue',
        type: '(...args: unknown[]) => void',
        description:
          'Emitowane po zmianie modelu „value”; przekaż nową wartość do kontrolowany prop.',
      },
    ],
    slots: [
      {
        name: 'hint',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop hint.',
      },
      {
        name: 'description',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop description.',
      },
      {
        name: 'error',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop error.',
      },
      {
        name: 'success',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop success.',
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
      generatedComponentApi[75].props[2],
      generatedComponentApi[60].props[3],
      generatedComponentApi[60].props[4],
      generatedComponentApi[60].props[5],
      generatedComponentApi[60].props[6],
      generatedComponentApi[58].props[4],
      generatedComponentApi[51].props[6],
      generatedComponentApi[51].props[7],
      generatedComponentApi[58].props[5],
      generatedComponentApi[58].props[6],
      generatedComponentApi[60].props[12],
      generatedComponentApi[60].props[13],
      generatedComponentApi[86].props[1],
      generatedComponentApi[51].props[13],
      generatedComponentApi[51].props[14],
      generatedComponentApi[51].props[15],
      generatedComponentApi[51].props[16],
      generatedComponentApi[51].props[17],
      generatedComponentApi[51].props[18],
      {
        name: 'defaultValue',
        type: 'string | undefined',
        required: false,
        description: 'Początkowa niekontrolowana wartość właściwości value.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string | undefined',
        required: false,
        description:
          'Kontrolowana wartość value; aktualizuj ją przez onValueChange. Dla stanu niekontrolowanego użyj defaultValue.',
      },
    ],
    events: [
      {
        name: 'onValueChange',
        type: '(value: string | undefined) => void',
        description: 'Callback React wywoływany po zmianie właściwości value.',
      },
      {
        name: 'onUpdateValue',
        type: '(...args: unknown[]) => void',
        description:
          'Emitowane po zmianie modelu „value”; przekaż nową wartość do kontrolowany prop.',
      },
    ],
    slots: [
      {
        name: 'hint',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop hint.',
      },
      {
        name: 'description',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop description.',
      },
      {
        name: 'error',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop error.',
      },
      {
        name: 'success',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop success.',
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
        name: 'defaultValue',
        type: 'string',
        required: false,
        default: '',
        description: 'Konfiguruje właściwość „default value” komponentu.',
      },
      {
        name: 'description',
        type: 'ReactNode',
        required: false,
        default: '',
        description: 'Tekst instrukcji powiązany z grupą i komórkami.',
      },
      {
        name: 'error',
        type: 'ReactNode',
        required: false,
        default: '',
        description: 'Komunikat błędu powiązany przez aria-describedby.',
      },
      generatedComponentApi[52].props[8],
    ],
    models: [
      {
        name: 'value',
        type: 'string',
        required: false,
        default: '',
        description:
          'Kontrolowana wartość value; aktualizuj ją przez onValueChange. Dla stanu niekontrolowanego użyj defaultValue.',
      },
    ],
    events: [
      {
        name: 'onValueChange',
        type: '(value: string) => void',
        description: 'Konfiguruje właściwość „on value change” komponentu.',
      },
      {
        name: 'onChange',
        type: '(value: string, event: Event) => void',
        description: 'Konfiguruje właściwość „on change” komponentu.',
      },
      {
        name: 'onComplete',
        type: '(value: string, event: Event) => void',
        description: 'Konfiguruje właściwość „on complete” komponentu.',
      },
      {
        name: 'onInvalidInput',
        type: '(detail: FormPinInputInvalidDetail, event: Event) => void',
        description: 'Konfiguruje właściwość „on invalid input” komponentu.',
      },
      {
        name: 'onFocus',
        type: '(event: FocusEvent<HTMLInputElement>, index: number) => void',
        description: 'Konfiguruje właściwość „on focus” komponentu.',
      },
      {
        name: 'onBlur',
        type: '(event: FocusEvent<HTMLDivElement>) => void',
        description: 'Konfiguruje właściwość „on blur” komponentu.',
      },
    ],
    slots: [
      {
        name: 'renderSeparator',
        type: '(state: { index: number }) => ReactNode',
        description:
          'Funkcja renderująca renderSeparator; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'labelContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop labelContent.',
      },
      {
        name: 'hintContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop hintContent.',
      },
      {
        name: 'descriptionContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop descriptionContent.',
      },
      {
        name: 'errorContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop errorContent.',
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
      generatedComponentApi[75].props[2],
      generatedComponentApi[60].props[4],
      generatedComponentApi[53].props[2],
      generatedComponentApi[53].props[3],
      generatedComponentApi[58].props[5],
      generatedComponentApi[60].props[12],
      generatedComponentApi[86].props[1],
      {
        name: 'defaultValue',
        type: 'string | number | boolean | undefined',
        required: false,
        description: 'Początkowa niekontrolowana wartość właściwości value.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string | number | boolean | undefined',
        required: false,
        description:
          'Kontrolowana wartość value; aktualizuj ją przez onValueChange. Dla stanu niekontrolowanego użyj defaultValue.',
      },
    ],
    events: [
      {
        name: 'onValueChange',
        type: '(value: string | number | boolean | undefined) => void',
        description: 'Callback React wywoływany po zmianie właściwości value.',
      },
      {
        name: 'onUpdateValue',
        type: '(...args: unknown[]) => void',
        description:
          'Emitowane po zmianie modelu „value”; przekaż nową wartość do kontrolowany prop.',
      },
    ],
    slots: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop children.',
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
        name: 'defaultValue',
        type: 'RatingValue',
        required: false,
        default: 'null',
        description: 'Konfiguruje właściwość „default value” komponentu.',
      },
      generatedComponentApi[54].props[9],
      generatedComponentApi[54].props[10],
      {
        name: 'description',
        type: 'ReactNode',
        required: false,
        default: '',
        description: 'Tekst pomocniczy powiązany przez aria-describedby.',
      },
      {
        name: 'error',
        type: 'ReactNode',
        required: false,
        default: '',
        description: 'Komunikat błędu powiązany przez aria-describedby i aria-invalid.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'RatingValue',
        required: false,
        default: 'null',
        description:
          'Kontrolowana wartość value; aktualizuj ją przez onValueChange. Dla stanu niekontrolowanego użyj defaultValue.',
      },
    ],
    events: [
      {
        name: 'onValueChange',
        type: '(value: RatingValue) => void',
        description: 'Konfiguruje właściwość „on value change” komponentu.',
      },
      {
        name: 'onChange',
        type: '(\n    value: RatingValue,\n    event: PointerEvent<HTMLElement> | KeyboardEvent<HTMLInputElement> | Event,\n  ) => void',
        description: 'Konfiguruje właściwość „on change” komponentu.',
      },
      {
        name: 'onPreviewChange',
        type: '(value: RatingValue) => void',
        description: 'Konfiguruje właściwość „on preview change” komponentu.',
      },
      {
        name: 'onClear',
        type: '(event: KeyboardEvent<HTMLInputElement> | PointerEvent<HTMLElement> | Event) => void',
        description: 'Konfiguruje właściwość „on clear” komponentu.',
      },
      {
        name: 'onFocus',
        type: '(event: FocusEvent<HTMLInputElement>) => void',
        description: 'Konfiguruje właściwość „on focus” komponentu.',
      },
      {
        name: 'onBlur',
        type: '(event: FocusEvent<HTMLInputElement>) => void',
        description: 'Konfiguruje właściwość „on blur” komponentu.',
      },
    ],
    slots: [
      {
        name: 'renderIcon',
        type: '(state: { fill: 0 | 50 | 100; index: number; value: RatingValue }) => ReactNode',
        description:
          'Funkcja renderująca renderIcon; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'labelContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop labelContent.',
      },
      {
        name: 'descriptionContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop descriptionContent.',
      },
      {
        name: 'errorContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop errorContent.',
      },
      {
        name: 'renderValueLabel',
        type: '(state: { text: string; value: RatingValue }) => ReactNode',
        description:
          'Funkcja renderująca renderValueLabel; argumenty i zwracana treść są opisane w sygnaturze.',
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
      generatedComponentApi[75].props[2],
      generatedComponentApi[55].props[1],
      generatedComponentApi[60].props[2],
      generatedComponentApi[60].props[3],
      generatedComponentApi[60].props[4],
      generatedComponentApi[60].props[5],
      generatedComponentApi[60].props[6],
      generatedComponentApi[58].props[5],
      generatedComponentApi[55].props[8],
      generatedComponentApi[55].props[9],
      {
        name: 'labels',
        type: 'Partial<PeauiSelectLabels>',
        required: false,
        description: 'Konfiguruje właściwość „labels” komponentu.',
      },
      {
        name: 'valueMode',
        type: 'SelectValueMode',
        required: false,
        default: 'value',
        description: 'Value is the default; label preserves the pre-3.0 Vue/WC model contract.',
      },
      generatedComponentApi[55].props[12],
      generatedComponentApi[55].props[13],
      generatedComponentApi[60].props[12],
      generatedComponentApi[60].props[13],
      generatedComponentApi[55].props[16],
      generatedComponentApi[55].props[17],
      generatedComponentApi[85].props[0],
      generatedComponentApi[86].props[1],
      {
        name: 'options',
        type: 'PeauiOption[]',
        required: true,
        description: 'Lista opcji dostępnych do wyświetlenia lub wyboru.',
      },
      {
        name: 'defaultValue',
        type: 'unknown',
        required: false,
        description: 'Początkowa niekontrolowana wartość właściwości value.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'unknown',
        required: false,
        description:
          'Kontrolowana wartość value; aktualizuj ją przez onValueChange. Dla stanu niekontrolowanego użyj defaultValue.',
      },
    ],
    events: [
      {
        name: 'onValueChange',
        type: '(value: unknown) => void',
        description: 'Callback React wywoływany po zmianie właściwości value.',
      },
      {
        name: 'onRemove',
        type: '(...args: unknown[]) => void',
        description: 'Emitowane po wybraniu akcji usunięcia.',
      },
      {
        name: 'onUpdateValue',
        type: '(...args: unknown[]) => void',
        description:
          'Emitowane po zmianie modelu „value”; przekaż nową wartość do kontrolowany prop.',
      },
    ],
    slots: [
      {
        name: 'hint',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop hint.',
      },
      {
        name: 'description',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop description.',
      },
      {
        name: 'error',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop error.',
      },
      {
        name: 'success',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop success.',
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
        name: 'defaultValue',
        type: 'Value',
        required: false,
        description: 'Konfiguruje właściwość „default value” komponentu.',
      },
      generatedComponentApi[56].props[6],
      generatedComponentApi[56].props[7],
    ],
    models: [
      {
        name: 'value',
        type: 'Value',
        required: false,
        description:
          'Kontrolowana wartość value; aktualizuj ją przez onValueChange. Dla stanu niekontrolowanego użyj defaultValue.',
      },
    ],
    events: [
      {
        name: 'onValueChange',
        type: '(value: Value) => void',
        description: 'Konfiguruje właściwość „on value change” komponentu.',
      },
      {
        name: 'onChange',
        type: '(value: Value, event: ChangeEvent<HTMLInputElement>) => void',
        description: 'Konfiguruje właściwość „on change” komponentu.',
      },
      {
        name: 'onFocus',
        type: '(event: FocusEvent<HTMLInputElement>) => void',
        description: 'Konfiguruje właściwość „on focus” komponentu.',
      },
      {
        name: 'onBlur',
        type: '(event: FocusEvent<HTMLInputElement>) => void',
        description: 'Konfiguruje właściwość „on blur” komponentu.',
      },
    ],
    slots: [],
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
        name: 'defaultValue',
        type: 'FormTagsInputTag[]',
        required: false,
        default: '[]',
        description: 'Konfiguruje właściwość „default value” komponentu.',
      },
      {
        name: 'defaultInputValue',
        type: 'string',
        required: false,
        default: '',
        description: 'Konfiguruje właściwość „default input value” komponentu.',
      },
      generatedComponentApi[57].props[14],
      generatedComponentApi[57].props[15],
      generatedComponentApi[57].props[18],
      generatedComponentApi[57].props[19],
      generatedComponentApi[57].props[20],
      generatedComponentApi[57].props[21],
      {
        name: 'description',
        type: 'ReactNode',
        required: false,
        default: '',
        description: 'Tekst pomocniczy powiązany z polem.',
      },
      {
        name: 'error',
        type: 'ReactNode',
        required: false,
        default: '',
        description: 'Komunikat błędu powiązany przez aria-describedby.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'FormTagsInputTag[]',
        required: false,
        default: '[]',
        description:
          'Kontrolowana wartość value; aktualizuj ją przez onValueChange. Dla stanu niekontrolowanego użyj defaultValue.',
      },
      {
        name: 'inputValue',
        type: 'string',
        required: false,
        default: '',
        description:
          'Kontrolowana wartość inputValue; aktualizuj ją przez onInputValueChange. Dla stanu niekontrolowanego użyj defaultInputValue.',
      },
    ],
    events: [
      {
        name: 'onValueChange',
        type: '(value: FormTagsInputTag[]) => void',
        description: 'Konfiguruje właściwość „on value change” komponentu.',
      },
      {
        name: 'onInputValueChange',
        type: '(value: string) => void',
        description: 'Konfiguruje właściwość „on input value change” komponentu.',
      },
      {
        name: 'onAdd',
        type: '(tag: FormTagsInputTag, index: number, event: Event) => void',
        description: 'Konfiguruje właściwość „on add” komponentu.',
      },
      {
        name: 'onRemove',
        type: '(tag: FormTagsInputTag, index: number, event: Event) => void',
        description: 'Konfiguruje właściwość „on remove” komponentu.',
      },
      {
        name: 'onEdit',
        type: '(\n    previous: FormTagsInputTag,\n    next: FormTagsInputTag,\n    index: number,\n    event: Event,\n  ) => void',
        description: 'Konfiguruje właściwość „on edit” komponentu.',
      },
      {
        name: 'onInvalidTag',
        type: '(detail: FormTagsInputInvalidDetail, event: Event) => void',
        description: 'Konfiguruje właściwość „on invalid tag” komponentu.',
      },
      {
        name: 'onSearch',
        type: '(query: string, requestId: number) => void',
        description: 'Konfiguruje właściwość „on search” komponentu.',
      },
      {
        name: 'onMaxReached',
        type: '(max: number, event: Event) => void',
        description: 'Konfiguruje właściwość „on max reached” komponentu.',
      },
    ],
    slots: [
      {
        name: 'renderLabel',
        type: '(state: { count: number }) => ReactNode',
        description:
          'Funkcja renderująca renderLabel; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderHint',
        type: '(state: { count: number; max?: number }) => ReactNode',
        description:
          'Funkcja renderująca renderHint; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderTag',
        type: '(state: {\n    tag: FormTagsInputTag;\n    index: number;\n    selected: boolean;\n    editing: boolean;\n    disabled: boolean;\n  }) => ReactNode',
        description:
          'Funkcja renderująca renderTag; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderTagContent',
        type: '(state: { tag: FormTagsInputTag; index: number }) => ReactNode',
        description:
          'Funkcja renderująca renderTagContent; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderSuggestion',
        type: '(state: {\n    suggestion: FormTagsInputTag;\n    index: number;\n    active: boolean;\n  }) => ReactNode',
        description:
          'Funkcja renderująca renderSuggestion; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderEmptySuggestions',
        type: '(state: { query: string }) => ReactNode',
        description:
          'Funkcja renderująca renderEmptySuggestions; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'labelContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop labelContent.',
      },
      {
        name: 'hintContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop hintContent.',
      },
      {
        name: 'emptySuggestionsContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop emptySuggestionsContent.',
      },
      {
        name: 'loadingContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop loadingContent.',
      },
      {
        name: 'prefixContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop prefixContent.',
      },
      {
        name: 'suffixContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop suffixContent.',
      },
      {
        name: 'descriptionContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop descriptionContent.',
      },
      {
        name: 'errorContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop errorContent.',
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
      generatedComponentApi[75].props[2],
      generatedComponentApi[60].props[4],
      generatedComponentApi[58].props[2],
      generatedComponentApi[60].props[5],
      generatedComponentApi[58].props[4],
      generatedComponentApi[58].props[5],
      generatedComponentApi[58].props[6],
      generatedComponentApi[60].props[12],
      generatedComponentApi[60].props[13],
      generatedComponentApi[86].props[1],
      {
        name: 'defaultValue',
        type: 'string | undefined',
        required: false,
        description: 'Początkowa niekontrolowana wartość właściwości value.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string | undefined',
        required: false,
        description:
          'Kontrolowana wartość value; aktualizuj ją przez onValueChange. Dla stanu niekontrolowanego użyj defaultValue.',
      },
    ],
    events: [
      {
        name: 'onValueChange',
        type: '(value: string | undefined) => void',
        description: 'Callback React wywoływany po zmianie właściwości value.',
      },
      {
        name: 'onUpdateValue',
        type: '(...args: unknown[]) => void',
        description:
          'Emitowane po zmianie modelu „value”; przekaż nową wartość do kontrolowany prop.',
      },
    ],
    slots: [
      {
        name: 'hint',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop hint.',
      },
      {
        name: 'description',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop description.',
      },
      {
        name: 'error',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop error.',
      },
      {
        name: 'success',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop success.',
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
        name: 'description',
        type: 'ReactNode',
        required: false,
        description: 'Tekst pomocy wyświetlany pod polem.',
      },
      {
        name: 'error',
        type: 'ReactNode',
        required: false,
        description: 'Zewnętrzny komunikat błędu; ma pierwszeństwo przed walidacją wewnętrzną.',
      },
      generatedComponentApi[59].props[18],
      generatedComponentApi[59].props[19],
    ],
    models: [],
    events: [
      {
        name: 'onChange',
        type: '(value: string | undefined, parts: TimePickerParts | undefined) => void',
        description: 'Konfiguruje właściwość „on change” komponentu.',
      },
      {
        name: 'onInvalid',
        type: '(detail: TimePickerInvalidDetail) => void',
        description: 'Konfiguruje właściwość „on invalid” komponentu.',
      },
    ],
    slots: [
      {
        name: 'renderTrigger',
        type: '(state: { displayValue: string; open: boolean; toggle: () => void }) => ReactNode',
        description:
          'Funkcja renderująca renderTrigger; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderHourOption',
        type: '(option: TimePickerOption, selected: boolean) => ReactNode',
        description:
          'Funkcja renderująca renderHourOption; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderMinuteOption',
        type: '(option: TimePickerOption, selected: boolean) => ReactNode',
        description:
          'Funkcja renderująca renderMinuteOption; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderSecondOption',
        type: '(option: TimePickerOption, selected: boolean) => ReactNode',
        description:
          'Funkcja renderująca renderSecondOption; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderPeriodOption',
        type: '(option: TimePickerOption, selected: boolean) => ReactNode',
        description:
          'Funkcja renderująca renderPeriodOption; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'footerContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop footerContent.',
      },
      {
        name: 'errorContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop errorContent.',
      },
      {
        name: 'descriptionContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop descriptionContent.',
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
      generatedComponentApi[75].props[2],
      generatedComponentApi[60].props[1],
      generatedComponentApi[60].props[2],
      generatedComponentApi[60].props[3],
      generatedComponentApi[60].props[4],
      generatedComponentApi[60].props[5],
      generatedComponentApi[60].props[6],
      generatedComponentApi[60].props[7],
      generatedComponentApi[60].props[8],
      generatedComponentApi[60].props[9],
      generatedComponentApi[60].props[10],
      generatedComponentApi[60].props[11],
      generatedComponentApi[60].props[12],
      generatedComponentApi[60].props[13],
      generatedComponentApi[86].props[1],
      {
        name: 'defaultValue',
        type: 'number | PeauiPickerRangeValue<number> | undefined',
        required: false,
        description: 'Początkowa niekontrolowana wartość właściwości value.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'number | PeauiPickerRangeValue<number> | undefined',
        required: false,
        description:
          'Kontrolowana wartość value; aktualizuj ją przez onValueChange. Dla stanu niekontrolowanego użyj defaultValue.',
      },
    ],
    events: [
      {
        name: 'onValueChange',
        type: '(value: number | PeauiPickerRangeValue<number> | undefined) => void',
        description: 'Callback React wywoływany po zmianie właściwości value.',
      },
      {
        name: 'onRemove',
        type: '(...args: unknown[]) => void',
        description: 'Emitowane po wybraniu akcji usunięcia.',
      },
      {
        name: 'onUpdateValue',
        type: '(...args: unknown[]) => void',
        description:
          'Emitowane po zmianie modelu „value”; przekaż nową wartość do kontrolowany prop.',
      },
    ],
    slots: [
      {
        name: 'hint',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop hint.',
      },
      {
        name: 'description',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop description.',
      },
      {
        name: 'error',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop error.',
      },
      {
        name: 'success',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop success.',
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
      generatedComponentApi[86].props[3],
      generatedComponentApi[61].props[1],
      generatedComponentApi[61].props[2],
      generatedComponentApi[86].props[1],
      {
        name: 'as',
        type: 'unknown',
        required: false,
        default: 'div',
        description: 'Konfiguruje właściwość „as” komponentu.',
      },
      generatedComponentApi[61].props[5],
      generatedComponentApi[61].props[6],
      generatedComponentApi[85].props[0],
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop children.',
      },
      {
        name: 'header',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop header.',
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
      generatedComponentApi[86].props[3],
      generatedComponentApi[86].props[1],
      generatedComponentApi[62].props[2],
      generatedComponentApi[62].props[3],
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop children.',
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
      generatedComponentApi[63].props[0],
      generatedComponentApi[63].props[1],
      generatedComponentApi[64].props[1],
      generatedComponentApi[63].props[3],
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop children.',
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
    props: [generatedComponentApi[64].props[0], generatedComponentApi[64].props[1]],
    models: [],
    events: [],
    slots: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop children.',
      },
      {
        name: 'additional',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop additional.',
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
      generatedComponentApi[86].props[1],
      generatedComponentApi[86].props[3],
      generatedComponentApi[65].props[2],
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop children.',
      },
      {
        name: 'top',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop top.',
      },
      {
        name: 'additional',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop additional.',
      },
      {
        name: 'footer',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop footer.',
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
        name: 'tabIndex',
        type: 'number',
        required: false,
        description:
          'Nadpisuje tabindex viewportu. Tryb native domyślnie dodaje przystanek Tab (0).',
      },
    ],
    models: [],
    events: [
      {
        name: 'onScroll',
        type: '(detail: ScrollAreaPosition) => void',
        description: 'Konfiguruje właściwość „on scroll” komponentu.',
      },
      {
        name: 'onScrollStart',
        type: '(detail: ScrollAreaPosition) => void',
        description: 'Konfiguruje właściwość „on scroll start” komponentu.',
      },
      {
        name: 'onScrollEnd',
        type: '(detail: ScrollAreaPosition) => void',
        description: 'Konfiguruje właściwość „on scroll end” komponentu.',
      },
      {
        name: 'onReachStart',
        type: '(detail: ScrollAreaEdgeDetail) => void',
        description: 'Konfiguruje właściwość „on reach start” komponentu.',
      },
      {
        name: 'onReachEnd',
        type: '(detail: ScrollAreaEdgeDetail) => void',
        description: 'Konfiguruje właściwość „on reach end” komponentu.',
      },
      {
        name: 'onResize',
        type: '(detail: ScrollAreaResizeDetail) => void',
        description: 'Konfiguruje właściwość „on resize” komponentu.',
      },
    ],
    slots: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop children.',
      },
      {
        name: 'renderScrollbar',
        type: '(state: ScrollAreaScrollbarSlotState) => ReactNode',
        description:
          'Funkcja renderująca renderScrollbar; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'startIndicator',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop startIndicator.',
      },
      {
        name: 'endIndicator',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop endIndicator.',
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
      generatedComponentApi[86].props[1],
      generatedComponentApi[67].props[1],
      generatedComponentApi[67].props[2],
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
        type: 'PeauiOption[]',
        required: false,
        default: '[]',
        description: 'Konfiguruje właściwość „items” komponentu.',
      },
      generatedComponentApi[68].props[1],
      generatedComponentApi[68].props[2],
      generatedComponentApi[86].props[1],
    ],
    models: [],
    events: [
      {
        name: 'onNavigate',
        type: '(...args: unknown[]) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:navigate”.',
      },
    ],
    slots: [],
  },
  {
    category: 'navigation',
    categoryLabel: 'Nawigacja',
    name: 'CommandPalette',
    sourceName: 'CommandPalette',
    framework: 'react',
    importPath: '@peaui/ui/react/navigation/CommandPalette',
    status: 'stable',
    props: [
      generatedComponentApi[69].props[0],
      {
        name: 'defaultOpen',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Konfiguruje właściwość „default open” komponentu.',
      },
      {
        name: 'defaultQuery',
        type: 'string',
        required: false,
        default: '',
        description: 'Konfiguruje właściwość „default query” komponentu.',
      },
      {
        name: 'defaultActiveId',
        type: 'string | null',
        required: false,
        default: 'null',
        description: 'Konfiguruje właściwość „default active id” komponentu.',
      },
      generatedComponentApi[69].props[1],
      generatedComponentApi[69].props[2],
      generatedComponentApi[69].props[3],
      generatedComponentApi[69].props[4],
      generatedComponentApi[69].props[5],
      generatedComponentApi[69].props[6],
      generatedComponentApi[69].props[7],
      generatedComponentApi[69].props[8],
      generatedComponentApi[69].props[9],
      generatedComponentApi[86].props[1],
      {
        name: 'mode',
        type: 'CommandPaletteMode',
        required: false,
        default: 'modal',
        description: 'Konfiguruje właściwość „mode” komponentu.',
      },
      generatedComponentApi[69].props[12],
      generatedComponentApi[69].props[13],
      generatedComponentApi[69].props[14],
      generatedComponentApi[69].props[15],
      generatedComponentApi[69].props[16],
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Konfiguruje właściwość „class name” komponentu.',
      },
      {
        name: 'style',
        type: 'CSSProperties',
        required: false,
        description: 'Konfiguruje właściwość „style” komponentu.',
      },
    ],
    models: [
      {
        name: 'open',
        type: 'boolean',
        required: false,
        description:
          'Kontrolowana wartość open; aktualizuj ją przez onOpenChange. Dla stanu niekontrolowanego użyj defaultOpen.',
      },
      {
        name: 'query',
        type: 'string',
        required: false,
        description:
          'Kontrolowana wartość query; aktualizuj ją przez onQueryChange. Dla stanu niekontrolowanego użyj defaultQuery.',
      },
      {
        name: 'activeId',
        type: 'string | null',
        required: false,
        description:
          'Kontrolowana wartość activeId; aktualizuj ją przez onActiveIdChange. Dla stanu niekontrolowanego użyj defaultActiveId.',
      },
    ],
    events: [
      {
        name: 'onOpenChange',
        type: '(value: boolean) => void',
        description: 'Konfiguruje właściwość „on open change” komponentu.',
      },
      {
        name: 'onQueryChange',
        type: '(value: string) => void',
        description: 'Konfiguruje właściwość „on query change” komponentu.',
      },
      {
        name: 'onActiveIdChange',
        type: '(value: string | null) => void',
        description: 'Konfiguruje właściwość „on active id change” komponentu.',
      },
      {
        name: 'onSelect',
        type: '(command: CommandPaletteCommand) => void',
        description: 'Konfiguruje właściwość „on select” komponentu.',
      },
      {
        name: 'onExecute',
        type: '(command: CommandPaletteCommand) => void',
        description: 'Konfiguruje właściwość „on execute” komponentu.',
      },
      {
        name: 'onExecutionSuccess',
        type: '(detail: CommandPaletteExecutionSuccessDetail) => void',
        description: 'Konfiguruje właściwość „on execution success” komponentu.',
      },
      {
        name: 'onExecutionError',
        type: '(detail: CommandPaletteExecutionErrorDetail) => void',
        description: 'Konfiguruje właściwość „on execution error” komponentu.',
      },
      {
        name: 'onLevelChange',
        type: '(detail: CommandPaletteLevelChangeDetail) => void',
        description: 'Konfiguruje właściwość „on level change” komponentu.',
      },
    ],
    slots: [
      {
        name: 'renderTrigger',
        type: '(state: CommandPaletteTriggerState) => ReactNode',
        description:
          'Funkcja renderująca renderTrigger; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'header',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop header.',
      },
      {
        name: 'renderCommand',
        type: '(state: {\n    active: boolean;\n    command: CommandPaletteCommand;\n    executing: boolean;\n    query: string;\n  }) => ReactNode',
        description:
          'Funkcja renderująca renderCommand; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderGroup',
        type: '(section: CommandPaletteSection) => ReactNode',
        description:
          'Funkcja renderująca renderGroup; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'empty',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop empty.',
      },
      {
        name: 'loadingContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop loadingContent.',
      },
      {
        name: 'renderError',
        type: '(error: string) => ReactNode',
        description:
          'Funkcja renderująca renderError; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'footer',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop footer.',
      },
      {
        name: 'renderBreadcrumb',
        type: '(path: readonly CommandPaletteCommand[], goBack: () => void) => ReactNode',
        description:
          'Funkcja renderująca renderBreadcrumb; argumenty i zwracana treść są opisane w sygnaturze.',
      },
    ],
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
        type: 'PeauiDropdownMenuItem[]',
        required: false,
        default: '[]',
        description: 'Pozycje współdzielące pełny kontrakt semantyczny z DropdownMenu.',
      },
      generatedComponentApi[70].props[2],
      generatedComponentApi[70].props[3],
      generatedComponentApi[70].props[4],
      generatedComponentApi[70].props[5],
      generatedComponentApi[70].props[6],
      generatedComponentApi[70].props[7],
      generatedComponentApi[70].props[8],
      generatedComponentApi[70].props[9],
      generatedComponentApi[70].props[10],
      generatedComponentApi[70].props[11],
      generatedComponentApi[71].props[7],
      generatedComponentApi[70].props[13],
      generatedComponentApi[69].props[6],
      generatedComponentApi[73].props[5],
      {
        name: 'defaultOpen',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Początkowa niekontrolowana wartość właściwości open.',
      },
    ],
    models: [
      {
        name: 'context',
        type: 'unknown',
        required: false,
        description: 'Kontrolowana wartość context; aktualizuj ją przez onContextChange.',
      },
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Kontrolowana wartość open; aktualizuj ją przez onOpenChange. Dla stanu niekontrolowanego użyj defaultOpen.',
      },
    ],
    events: [
      {
        name: 'onOpenChange',
        type: '(value: boolean) => void',
        description: 'Callback React wywoływany po zmianie właściwości open.',
      },
      {
        name: 'onOpen',
        type: '(detail: PeauiContextMenuOpenDetail) => void',
        description: 'Emitowane po skutecznym otwarciu menu.',
      },
      {
        name: 'onClose',
        type: '(reason: PeauiContextMenuCloseReason) => void',
        description: 'Emitowane po zamknięciu menu wraz z przyczyną.',
      },
      {
        name: 'onSelect',
        type: '(item: PeauiDropdownMenuItem, path: number[], context: unknown) => void',
        description: 'Emitowane po aktywowaniu dostępnej pozycji.',
      },
      {
        name: 'onCheckedChange',
        type: '(\n      item: PeauiDropdownMenuItem,\n      checked: boolean,\n      path: number[],\n      context: unknown,\n    ) => void',
        description: 'Emitowane po zmianie intencji pozycji checkbox lub radio.',
      },
      {
        name: 'onValueChange',
        type: '(\n      item: PeauiDropdownMenuItem,\n      value: unknown,\n      path: number[],\n      context: unknown,\n    ) => void',
        description: 'Emitowane po wyborze pozycji posiadającej wartość.',
      },
      {
        name: 'onContextChange',
        type: '(context: unknown) => void',
        description: 'Emitowane, gdy aktywacja wskazuje nowy kontekst danych.',
      },
      {
        name: 'onLongPressCancel',
        type: '(reason: PeauiContextMenuLongPressCancelReason) => void',
        description: 'Emitowane, gdy oczekujący long press został świadomie anulowany.',
      },
    ],
    slots: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop children.',
      },
      {
        name: 'renderTarget',
        type: '(state: { open: boolean; disabled: boolean; context: unknown }) => ReactNode',
        description:
          'Funkcja renderująca renderTarget; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderItem',
        type: '(item: PeauiDropdownMenuItem, path: number[]) => ReactNode',
        description:
          'Funkcja renderująca renderItem; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderItemIcon',
        type: '(item: PeauiDropdownMenuItem, path: number[]) => ReactNode',
        description:
          'Funkcja renderująca renderItemIcon; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderItemShortcut',
        type: '(item: PeauiDropdownMenuItem, path: number[]) => ReactNode',
        description:
          'Funkcja renderująca renderItemShortcut; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderGroupLabel',
        type: '(item: PeauiDropdownMenuItem, path: number[]) => ReactNode',
        description:
          'Funkcja renderująca renderGroupLabel; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'empty',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop empty.',
      },
      {
        name: 'loadingContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop loadingContent.',
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
        type: 'PeauiDropdownMenuItem[]',
        required: false,
        default: '[]',
        description: 'Deklaratywna kolekcja akcji, grup, separatorów i podmenu.',
      },
      generatedComponentApi[71].props[1],
      generatedComponentApi[71].props[2],
      generatedComponentApi[71].props[3],
      generatedComponentApi[71].props[4],
      generatedComponentApi[71].props[5],
      generatedComponentApi[71].props[6],
      generatedComponentApi[71].props[7],
      generatedComponentApi[71].props[8],
      generatedComponentApi[71].props[9],
      generatedComponentApi[69].props[6],
      generatedComponentApi[73].props[5],
      {
        name: 'defaultOpen',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Początkowa niekontrolowana wartość właściwości open.',
      },
    ],
    models: [
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Kontrolowana wartość open; aktualizuj ją przez onOpenChange. Dla stanu niekontrolowanego użyj defaultOpen.',
      },
    ],
    events: [
      {
        name: 'onOpenChange',
        type: '(value: boolean) => void',
        description: 'Callback React wywoływany po zmianie właściwości open.',
      },
      {
        name: 'onSelect',
        type: '(item: PeauiDropdownMenuItem, path: number[]) => void',
        description: 'Emitowane po aktywowaniu dostępnej pozycji.',
      },
      {
        name: 'onCheckedChange',
        type: '(item: PeauiDropdownMenuItem, checked: boolean, path: number[]) => void',
        description: 'Emitowane po zmianie intencji pozycji checkbox lub radio.',
      },
      {
        name: 'onValueChange',
        type: '(item: PeauiDropdownMenuItem, value: unknown, path: number[]) => void',
        description: 'Emitowane po wyborze pozycji posiadającej wartość.',
      },
      {
        name: 'onEscape',
        type: '() => void',
        description: 'Emitowane po zamknięciu klawiszem Escape.',
      },
      {
        name: 'onOutsideClick',
        type: '() => void',
        description: 'Emitowane po zamknięciu kliknięciem poza komponentem.',
      },
    ],
    slots: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop children.',
      },
      {
        name: 'renderTrigger',
        type: '(state: { open: boolean; disabled: boolean }) => ReactNode',
        description:
          'Funkcja renderująca renderTrigger; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderItem',
        type: '(item: PeauiDropdownMenuItem, path: number[]) => ReactNode',
        description:
          'Funkcja renderująca renderItem; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderItemIcon',
        type: '(item: PeauiDropdownMenuItem, path: number[]) => ReactNode',
        description:
          'Funkcja renderująca renderItemIcon; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderItemShortcut',
        type: '(item: PeauiDropdownMenuItem, path: number[]) => ReactNode',
        description:
          'Funkcja renderująca renderItemShortcut; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderGroupLabel',
        type: '(item: PeauiDropdownMenuItem, path: number[]) => ReactNode',
        description:
          'Funkcja renderująca renderGroupLabel; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'empty',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop empty.',
      },
      {
        name: 'loadingContent',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop loadingContent.',
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
      generatedComponentApi[75].props[2],
      generatedComponentApi[72].props[1],
      generatedComponentApi[72].props[2],
      generatedComponentApi[72].props[3],
      generatedComponentApi[86].props[1],
      {
        name: 'defaultLimit',
        type: 'number',
        required: false,
        description: 'Początkowa niekontrolowana wartość właściwości limit.',
      },
    ],
    models: [
      {
        name: 'limit',
        type: 'number',
        required: false,
        description:
          'Kontrolowana wartość limit; aktualizuj ją przez onLimitChange. Dla stanu niekontrolowanego użyj defaultLimit.',
      },
    ],
    events: [
      {
        name: 'onLimitChange',
        type: '(value: number) => void',
        description: 'Callback React wywoływany po zmianie właściwości limit.',
      },
      {
        name: 'onUpdateLimit',
        type: '(...args: unknown[]) => void',
        description:
          'Emitowane po zmianie modelu „limit”; przekaż nową wartość do kontrolowany prop.',
      },
    ],
    slots: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop children.',
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
        type: 'PeauiMenuBarMenu[]',
        required: false,
        default: '[]',
        description: 'Uporządkowane sekcje poziomego menu aplikacyjnego.',
      },
      generatedComponentApi[73].props[1],
      generatedComponentApi[73].props[2],
      generatedComponentApi[73].props[3],
      generatedComponentApi[73].props[4],
      generatedComponentApi[73].props[5],
      {
        name: 'defaultOpenMenu',
        type: 'string | number | null',
        required: false,
        default: 'null',
        description: 'Początkowa niekontrolowana wartość właściwości openMenu.',
      },
    ],
    models: [
      {
        name: 'openMenu',
        type: 'string | number | null',
        required: false,
        default: 'null',
        description:
          'Kontrolowana wartość openMenu; aktualizuj ją przez onOpenMenuChange. Dla stanu niekontrolowanego użyj defaultOpenMenu.',
      },
    ],
    events: [
      {
        name: 'onOpenMenuChange',
        type: '(value: string | number | null) => void',
        description: 'Callback React wywoływany po zmianie właściwości openMenu.',
      },
      {
        name: 'onSelect',
        type: '(item: PeauiDropdownMenuItem, path: number[], menu: PeauiMenuBarMenu) => void',
        description: 'Emitowane po aktywowaniu pozycji wraz z sekcją nadrzędną.',
      },
      {
        name: 'onFocusChange',
        type: '(menu: PeauiMenuBarMenu, index: number) => void',
        description: 'Emitowane po przeniesieniu fokusu roving tabindex na inny trigger.',
      },
      {
        name: 'onCheckedChange',
        type: '(\n      item: PeauiDropdownMenuItem,\n      checked: boolean,\n      path: number[],\n      menu: PeauiMenuBarMenu,\n    ) => void',
        description: 'Przekazuje intencję zmiany pozycji checkbox lub radio.',
      },
      {
        name: 'onValueChange',
        type: '(\n      item: PeauiDropdownMenuItem,\n      value: unknown,\n      path: number[],\n      menu: PeauiMenuBarMenu,\n    ) => void',
        description: 'Przekazuje wartość wybranej pozycji wraz z sekcją nadrzędną.',
      },
      {
        name: 'onUpdateOpenMenu',
        type: '(...args: unknown[]) => void',
        description:
          'Emitowane po zmianie modelu „openMenu”; przekaż nową wartość do kontrolowany prop.',
      },
    ],
    slots: [
      {
        name: 'renderMenuTrigger',
        type: '(\n      menu: PeauiMenuBarMenu,\n      state: { open: boolean; disabled: boolean },\n    ) => ReactNode',
        description:
          'Funkcja renderująca renderMenuTrigger; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderItem',
        type: '(item: PeauiDropdownMenuItem, path: number[], menu: PeauiMenuBarMenu) => ReactNode',
        description:
          'Funkcja renderująca renderItem; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderGroupLabel',
        type: '(\n      item: PeauiDropdownMenuItem,\n      path: number[],\n      menu: PeauiMenuBarMenu,\n    ) => ReactNode',
        description:
          'Funkcja renderująca renderGroupLabel; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderShortcut',
        type: '(\n      item: PeauiDropdownMenuItem,\n      path: number[],\n      menu: PeauiMenuBarMenu,\n    ) => ReactNode',
        description:
          'Funkcja renderująca renderShortcut; argumenty i zwracana treść są opisane w sygnaturze.',
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
      generatedComponentApi[75].props[0],
      generatedComponentApi[75].props[3],
      generatedComponentApi[75].props[1],
      generatedComponentApi[74].props[3],
      generatedComponentApi[74].props[4],
      generatedComponentApi[86].props[3],
      generatedComponentApi[86].props[1],
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
      generatedComponentApi[75].props[0],
      generatedComponentApi[75].props[1],
      generatedComponentApi[75].props[2],
      generatedComponentApi[75].props[3],
      generatedComponentApi[75].props[4],
      generatedComponentApi[86].props[1],
      generatedComponentApi[86].props[3],
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop children.',
      },
      {
        name: 'titleAdditional',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop titleAdditional.',
      },
      {
        name: 'descriptionAdditional',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop descriptionAdditional.',
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
      generatedComponentApi[76].props[0],
      generatedComponentApi[76].props[1],
      generatedComponentApi[76].props[2],
      generatedComponentApi[86].props[3],
      generatedComponentApi[86].props[1],
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
      generatedComponentApi[77].props[0],
      generatedComponentApi[86].props[3],
      generatedComponentApi[86].props[1],
      generatedComponentApi[77].props[3],
      generatedComponentApi[77].props[4],
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop children.',
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
        type: 'PeauiOption[]',
        required: false,
        default: '[]',
        description: 'Lista opcji dostępnych do wyświetlenia lub wyboru.',
      },
      generatedComponentApi[78].props[1],
      generatedComponentApi[86].props[1],
    ],
    models: [],
    events: [
      {
        name: 'onSelect',
        type: '(...args: unknown[]) => void',
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
    framework: 'react',
    importPath: '@peaui/ui/react/navigation/NavigationTabs',
    status: 'stable',
    props: [
      {
        name: 'tabs',
        type: 'PeauiOption[]',
        required: false,
        default: '[]',
        description: 'Konfiguruje właściwość „tabs” komponentu.',
      },
      generatedComponentApi[86].props[1],
      generatedComponentApi[80].props[0],
      generatedComponentApi[79].props[3],
    ],
    models: [],
    events: [
      {
        name: 'onSelect',
        type: '(...args: unknown[]) => void',
        description: 'Emitowane po wybraniu elementu.',
      },
    ],
    slots: [
      {
        name: 'renderTabBefore',
        type: '(tab: PeauiOption, index: number) => ReactNode',
        description:
          'Funkcja renderująca renderTabBefore; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderTabAfter',
        type: '(tab: PeauiOption, index: number) => ReactNode',
        description:
          'Funkcja renderująca renderTabAfter; argumenty i zwracana treść są opisane w sygnaturze.',
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
      generatedComponentApi[80].props[0],
      generatedComponentApi[80].props[1],
      generatedComponentApi[86].props[1],
      {
        name: 'defaultPage',
        type: 'number',
        required: false,
        default: '1',
        description: 'Początkowa niekontrolowana wartość właściwości page.',
      },
    ],
    models: [
      {
        name: 'page',
        type: 'number',
        required: false,
        default: '1',
        description:
          'Kontrolowana wartość page; aktualizuj ją przez onPageChange. Dla stanu niekontrolowanego użyj defaultPage.',
      },
    ],
    events: [
      {
        name: 'onPageChange',
        type: '(value: number) => void',
        description: 'Callback React wywoływany po zmianie właściwości page.',
      },
      {
        name: 'onUpdatePage',
        type: '(...args: unknown[]) => void',
        description:
          'Emitowane po zmianie modelu „page”; przekaż nową wartość do kontrolowany prop.',
      },
    ],
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
      generatedComponentApi[86].props[1],
      generatedComponentApi[86].props[3],
      {
        name: 'defaultOpen',
        type: 'boolean',
        required: false,
        description: 'Początkowa niekontrolowana wartość właściwości open.',
      },
    ],
    models: [
      {
        name: 'open',
        type: 'boolean',
        required: false,
        description:
          'Kontrolowana wartość open; aktualizuj ją przez onOpenChange. Dla stanu niekontrolowanego użyj defaultOpen.',
      },
    ],
    events: [
      {
        name: 'onOpenChange',
        type: '(value: boolean) => void',
        description: 'Callback React wywoływany po zmianie właściwości open.',
      },
    ],
    slots: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop children.',
      },
      {
        name: 'header',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop header.',
      },
    ],
  },
  {
    category: 'overlayer',
    categoryLabel: 'Warstwy i okna',
    name: 'GuidedTour',
    sourceName: 'GuidedTour',
    framework: 'react',
    importPath: '@peaui/ui/react/overlayer/GuidedTour',
    status: 'stable',
    props: [
      generatedComponentApi[82].props[0],
      {
        name: 'mode',
        type: 'GuidedTourMode',
        required: false,
        default: 'spotlight',
        description: 'Konfiguruje właściwość „mode” komponentu.',
      },
      {
        name: 'cardVariant',
        type: 'GuidedTourCardVariant',
        required: false,
        default: 'card',
        description: 'Konfiguruje właściwość „card variant” komponentu.',
      },
      generatedComponentApi[82].props[3],
      generatedComponentApi[82].props[4],
      generatedComponentApi[82].props[5],
      generatedComponentApi[82].props[6],
      {
        name: 'scrollBehavior',
        type: 'GuidedTourScrollBehavior',
        required: false,
        default: 'smooth',
        description: 'Konfiguruje właściwość „scroll behavior” komponentu.',
      },
      generatedComponentApi[82].props[8],
      {
        name: 'missingTargetStrategy',
        type: 'GuidedTourMissingTargetStrategy',
        required: false,
        default: 'block',
        description: 'Konfiguruje właściwość „missing target strategy” komponentu.',
      },
      generatedComponentApi[82].props[10],
      generatedComponentApi[82].props[11],
      generatedComponentApi[82].props[12],
      {
        name: 'persist',
        type: '(state: GuidedTourPersistState) => GuidedTourMaybePromise<void>',
        required: false,
        default: 'undefined',
        description: 'Konfiguruje właściwość „persist” komponentu.',
      },
      generatedComponentApi[82].props[14],
      generatedComponentApi[82].props[15],
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Konfiguruje właściwość „class name” komponentu.',
      },
      {
        name: 'style',
        type: 'CSSProperties',
        required: false,
        description: 'Konfiguruje właściwość „style” komponentu.',
      },
    ],
    models: [
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Kontrolowana wartość open; aktualizuj ją przez onOpenChange.',
      },
      {
        name: 'step',
        type: 'number',
        required: false,
        default: '0',
        description: 'Kontrolowana wartość step; aktualizuj ją przez onStepChange.',
      },
    ],
    events: [
      {
        name: 'onOpenChange',
        type: '(value: boolean) => void',
        description: 'Konfiguruje właściwość „on open change” komponentu.',
      },
      {
        name: 'onStepChange',
        type: '(value: number) => void',
        description: 'Konfiguruje właściwość „on step change” komponentu.',
      },
      {
        name: 'onStart',
        type: '(payload: GuidedTourStepPayload) => void',
        description: 'Konfiguruje właściwość „on start” komponentu.',
      },
      {
        name: 'onStepEnter',
        type: '(payload: GuidedTourStepPayload) => void',
        description: 'Konfiguruje właściwość „on step enter” komponentu.',
      },
      {
        name: 'onStepLeave',
        type: '(payload: GuidedTourStepPayload) => void',
        description: 'Konfiguruje właściwość „on step leave” komponentu.',
      },
      {
        name: 'onNext',
        type: '(payload: GuidedTourStepPayload) => void',
        description: 'Konfiguruje właściwość „on next” komponentu.',
      },
      {
        name: 'onBack',
        type: '(payload: GuidedTourStepPayload) => void',
        description: 'Konfiguruje właściwość „on back” komponentu.',
      },
      {
        name: 'onSkip',
        type: '(payload: GuidedTourStepPayload) => void',
        description: 'Konfiguruje właściwość „on skip” komponentu.',
      },
      {
        name: 'onComplete',
        type: '(payload: GuidedTourStepPayload) => void',
        description: 'Konfiguruje właściwość „on complete” komponentu.',
      },
      {
        name: 'onTargetMissing',
        type: '(payload: { step: GuidedTourStep; index: number }) => void',
        description: 'Konfiguruje właściwość „on target missing” komponentu.',
      },
      {
        name: 'onError',
        type: '(payload: GuidedTourErrorPayload) => void',
        description: 'Konfiguruje właściwość „on error” komponentu.',
      },
    ],
    slots: [
      {
        name: 'children',
        type: 'ReactNode | ((context: GuidedTourRenderContext) => ReactNode)',
        description:
          'Funkcja renderująca children; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderTitle',
        type: '(context: GuidedTourRenderContext) => ReactNode',
        description:
          'Funkcja renderująca renderTitle; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderDescription',
        type: '(context: GuidedTourRenderContext) => ReactNode',
        description:
          'Funkcja renderująca renderDescription; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderProgress',
        type: '(context: GuidedTourRenderContext) => ReactNode',
        description:
          'Funkcja renderująca renderProgress; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderActions',
        type: '(context: GuidedTourRenderContext) => ReactNode',
        description:
          'Funkcja renderująca renderActions; argumenty i zwracana treść są opisane w sygnaturze.',
      },
      {
        name: 'renderMissingTarget',
        type: '(context: GuidedTourRenderContext) => ReactNode',
        description:
          'Funkcja renderująca renderMissingTarget; argumenty i zwracana treść są opisane w sygnaturze.',
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
        type: "| 'top'\n      | 'right'\n      | 'bottom'\n      | 'left'\n      | 'top-left'\n      | 'top-right'\n      | 'bottom-left'\n      | 'bottom-right'",
        required: false,
        default: 'top',
        description: 'Konfiguruje właściwość „placement” komponentu.',
      },
      generatedComponentApi[86].props[1],
      generatedComponentApi[83].props[2],
      generatedComponentApi[86].props[2],
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop children.',
      },
      {
        name: 'title',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop title.',
      },
      {
        name: 'description',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop description.',
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
      generatedComponentApi[86].props[1],
      generatedComponentApi[86].props[3],
      {
        name: 'defaultOpen',
        type: 'boolean',
        required: false,
        description: 'Początkowa niekontrolowana wartość właściwości open.',
      },
    ],
    models: [
      {
        name: 'open',
        type: 'boolean',
        required: false,
        description:
          'Kontrolowana wartość open; aktualizuj ją przez onOpenChange. Dla stanu niekontrolowanego użyj defaultOpen.',
      },
    ],
    events: [
      {
        name: 'onOpenChange',
        type: '(value: boolean) => void',
        description: 'Callback React wywoływany po zmianie właściwości open.',
      },
    ],
    slots: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop children.',
      },
      {
        name: 'header',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop header.',
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
      generatedComponentApi[85].props[0],
      generatedComponentApi[85].props[1],
      {
        name: 'placement',
        type: "| 'top'\n      | 'right'\n      | 'bottom'\n      | 'left'\n      | 'top-left'\n      | 'top-right'\n      | 'bottom-left'\n      | 'bottom-right'",
        required: false,
        default: 'top',
        description: 'Konfiguruje właściwość „placement” komponentu.',
      },
      generatedComponentApi[86].props[1],
      generatedComponentApi[86].props[2],
      generatedComponentApi[86].props[3],
      generatedComponentApi[86].props[6],
      generatedComponentApi[85].props[7],
      generatedComponentApi[85].props[8],
    ],
    models: [],
    events: [],
    slots: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop children.',
      },
      {
        name: 'content',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop content.',
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
        type: "| 'top'\n      | 'right'\n      | 'bottom'\n      | 'left'\n      | 'top-left'\n      | 'top-right'\n      | 'bottom-left'\n      | 'bottom-right'",
        required: false,
        default: 'top',
        description: 'Konfiguruje właściwość „placement” komponentu.',
      },
      generatedComponentApi[86].props[1],
      generatedComponentApi[86].props[2],
      generatedComponentApi[86].props[3],
      generatedComponentApi[86].props[4],
      generatedComponentApi[86].props[5],
      generatedComponentApi[86].props[6],
      generatedComponentApi[86].props[7],
    ],
    models: [],
    events: [
      {
        name: 'onOpenChange',
        type: '(...args: unknown[]) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „update:open”.',
      },
    ],
    slots: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop children.',
      },
      {
        name: 'content',
        type: 'ReactNode',
        description: 'Treść React przekazywana przez prop content.',
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
          'Osoby prezentowane w stabilnej kolejności wejściowej. Property JavaScript: items. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'max-visible',
        type: 'number',
        required: false,
        default: '3',
        description:
          'Maksymalna liczba awatarów widocznych przed licznikiem nadmiaru. Property JavaScript: maxVisible. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'size',
        type: "'xs' | 's' | 'm' | 'l' | 'xl'",
        required: false,
        default: 'm',
        description:
          'Rozmiar awatarów i licznika. Property JavaScript: size. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'shape',
        type: "'circle' | 'rounded'",
        required: false,
        default: 'circle',
        description:
          'Kształt awatarów i licznika. Property JavaScript: shape. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'overlap',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Włącza kompaktowy układ z nachodzącymi na siebie elementami. Property JavaScript: overlap. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'direction',
        type: "'start' | 'end'",
        required: false,
        default: 'end',
        description:
          'Określa, która krawędź stosu znajduje się wizualnie na wierzchu. Property JavaScript: direction. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'overflow-mode',
        type: "'count' | 'popover' | 'none'",
        required: false,
        default: 'count',
        description:
          'Sposób prezentacji pozycji poza limitem. Property JavaScript: overflowMode. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'item-key',
        type: 'keyof AvatarGroupItem | ((item: AvatarGroupItem, index: number) => string | number)',
        required: false,
        default: 'id',
        description:
          'Pole lub funkcja zwracająca stabilny klucz elementu. Property JavaScript: itemKey. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: 'Członkowie grupy',
        description:
          'Dostępna nazwa listy widocznych osób. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza wszystkie akcje grupy. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Sygnalizuje ładowanie szczegółowej listy w popoverze. Property JavaScript: loading. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator używany w testach automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Kontrolowana właściwość open; synchronizuj ją przez zdarzenie update:open. Property JavaScript: open. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'select',
        type: '(item: AvatarGroupItem, index: number) => void',
        description: 'Zwraca wybraną osobę oraz jej indeks w źródłowej tablicy.',
      },
      {
        name: 'overflowClick',
        type: '(hiddenItems: AvatarGroupItem[]) => void',
        description: 'Informuje o aktywowaniu licznika nadmiaru.',
      },
      {
        name: 'update:open',
        type: '(value: boolean) => void',
        description: 'Emitowane po zmianie modelu „open”; przekaż nową wartość do v-model:open.',
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
          'Włącza stan ładowania i informuje o trwającej operacji. Property JavaScript: isLoading. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description:
          'Wyłącza komponent i blokuje jego interakcje. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'result',
        type: 'string',
        required: false,
        default: '-/-',
        description:
          'Konfiguruje właściwość „result” komponentu. Property JavaScript: result. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'label',
        type: 'string',
        required: true,
        description:
          'Widoczna etykieta opisująca element lub pole formularza. Property JavaScript: label. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'is-simple',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „is simple” komponentu. Property JavaScript: isSimple. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'show-calculate-button',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „show calculate button” komponentu. Property JavaScript: showCalculateButton. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [],
    events: [
      {
        name: 'on:simulate',
        type: '() => void',
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
        name: 'pause-label',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „pause-label” konfigurujący komponent CardCarousel.',
      },
      {
        name: 'resume-label',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „resume-label” konfigurujący komponent CardCarousel.',
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
        required: false,
        description: 'Bieżąca wartość kontrolowana przez v-model.',
      },
      {
        name: 'variant',
        type: 'BadgeVariant',
        required: false,
        description: 'Wariant wizualny komponentu.',
      },
      {
        name: 'size',
        type: 'BadgeSize',
        required: false,
        description: 'Wariant rozmiaru komponentu.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „data-testid” konfigurujący komponent CounterBadge.',
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
          'Główny tytuł prezentowany w komponencie. Property JavaScript: title. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza komponent i blokuje jego interakcje. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'always-open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Keeps the panel expanded and disables its toggle interaction. Property JavaScript: alwaysOpen. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'allways-open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          '@deprecated Use `alwaysOpen`. Property JavaScript: allwaysOpen. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Kontrolowana właściwość open; synchronizuj ją przez zdarzenie update:open. Property JavaScript: open. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'update:open',
        type: '(value: boolean) => void',
        description: 'Emitowane po zmianie modelu „open”; przekaż nową wartość do v-model:open.',
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
          'Klawisz albo uporządkowana kombinacja tokenów. String rozdziela tokeny znakiem plus. Property JavaScript: keys. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'platform',
        type: "'auto' | 'windows' | 'mac' | 'linux' | 'generic'",
        required: false,
        default: 'auto',
        description:
          'Platforma używana do mapowania przenośnego tokenu Mod i symboli modyfikatorów. Property JavaScript: platform. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'format',
        type: "'symbol' | 'text'",
        required: false,
        default: 'symbol',
        description:
          'Symbole skracają zapis wizualny; pełne nazwy pozostają dostępne dla AT. Property JavaScript: format. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'size',
        type: "'xs' | 's' | 'm'",
        required: false,
        default: 's',
        description:
          'Rozmiar keycapów zgodny ze skalą kompaktowych komponentów PeaUI. Property JavaScript: size. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'inline',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Wariant inline dopasowuje komponent do wiersza tekstu; false tworzy osobny blok. Property JavaScript: inline. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'separator',
        type: 'string',
        required: false,
        default: '+',
        description:
          'Wyłącznie wizualny separator kolejnych klawiszy. Property JavaScript: separator. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: '',
        description:
          'Pełna dostępna nazwa zastępująca automatycznie złożoną frazę. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'muted',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Ogranicza kontrast nieaktywnej wizualnie wskazówki bez dodawania semantyki disabled. Property JavaScript: muted. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny selektor testowy elementu głównego. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
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
        description:
          'Unikalny identyfikator elementu w dokumencie. Property JavaScript: id. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: 'Tabela danych',
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'is-details',
        type: 'boolean',
        required: false,
        description:
          'Enables expandable detail rows. Property JavaScript: isDetails. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'is-detials',
        type: 'boolean',
        required: false,
        description:
          '@deprecated Use `isDetails`. Property JavaScript: isDetials. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'additional',
        type: 'Record<string, unknown>',
        required: false,
        description:
          'Konfiguruje właściwość „additional” komponentu. Property JavaScript: additional. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'can-create',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Włącza możliwość dodawania nowych rekordów. Property JavaScript: canCreate. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'can-select-rows',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Włącza możliwość zaznaczania wierszy. Property JavaScript: canSelectRows. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'can-check-rows',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „can check rows” komponentu. Property JavaScript: canCheckRows. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'can-hide-columns',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Pozwala użytkownikowi sterować widocznością kolumn. Property JavaScript: canHideColumns. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'can-multi-sort',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „can multi sort” komponentu. Property JavaScript: canMultiSort. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'columns',
        type: 'TableColumn[]',
        required: false,
        default: '[]',
        description:
          'Definicje kolumn określające ich etykiety, klucze i sposób renderowania. Property JavaScript: columns. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'editable',
        type: 'boolean',
        required: false,
        description:
          'Włącza tryb edycji danych. Property JavaScript: editable. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'empty-description',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „empty description” komponentu. Property JavaScript: emptyDescription. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'empty-description-inline',
        type: 'string',
        required: false,
        description:
          'Konfiguruje właściwość „empty description inline” komponentu. Property JavaScript: emptyDescriptionInline. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'records',
        type: 'Record<string, unknown>[]',
        required: false,
        default: '[]',
        description:
          'Kolekcja rekordów prezentowanych przez komponent. Property JavaScript: records. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'rows-per-page',
        type: 'number',
        required: false,
        default: '10',
        description:
          'Liczba rekordów wyświetlanych na jednej stronie. Property JavaScript: rowsPerPage. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'paginate',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Render one client-side page of records. Leave false for server-side pagination. Property JavaScript: paginate. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'pagination-label',
        type: 'string',
        required: false,
        default: 'Strony tabeli',
        description:
          'Konfiguruje właściwość „pagination label” komponentu. Property JavaScript: paginationLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'current-checked-row',
        type: 'number | string',
        required: false,
        description:
          'Konfiguruje właściwość „current checked row” komponentu. Property JavaScript: currentCheckedRow. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'rows-total',
        type: 'number',
        required: false,
        description:
          'Konfiguruje właściwość „rows total” komponentu. Property JavaScript: rowsTotal. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'selected-rows',
        type: 'string[]',
        required: false,
        default: '[]',
        description:
          'Identyfikatory aktualnie zaznaczonych wierszy. Property JavaScript: selectedRows. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'sort-column',
        type: 'string',
        required: false,
        default: 'updatedAt',
        description:
          'Konfiguruje właściwość „sort column” komponentu. Property JavaScript: sortColumn. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'sort-columns',
        type: 'TableSortState[]',
        required: false,
        default: '[]',
        description:
          'Konfiguruje właściwość „sort columns” komponentu. Property JavaScript: sortColumns. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'sort-type',
        type: "'ASC' | 'DESC'",
        required: false,
        default: 'DESC',
        description:
          'Konfiguruje właściwość „sort type” komponentu. Property JavaScript: sortType. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'button-editable-create-text',
        type: 'string',
        required: false,
        default: 'Dodaj',
        description:
          'Konfiguruje właściwość „button editable create text” komponentu. Property JavaScript: buttonEditableCreateText. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'title-remove-label',
        type: 'string',
        required: false,
        default: 'Czy na pewno chcesz usunąć wybrany rekord?',
        description:
          'Konfiguruje właściwość „title remove label” komponentu. Property JavaScript: titleRemoveLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'description-remove-label',
        type: 'string',
        required: false,
        default: 'Usunięcie spowoduje trwałe usunięcie rekordu.',
        description:
          'Konfiguruje właściwość „description remove label” komponentu. Property JavaScript: descriptionRemoveLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'is-loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Włącza stan ładowania i informuje o trwającej operacji. Property JavaScript: isLoading. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'scroll',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „scroll” komponentu. Property JavaScript: scroll. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'page',
        type: 'number',
        required: false,
        default: '1',
        description:
          'Kontrolowana właściwość page; synchronizuj ją przez zdarzenie update:page. Property JavaScript: page. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'on:action',
        type: '(record: string | number | undefined, action: string, currentRecord?: Record<string, unknown>) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:action”.',
      },
      {
        name: 'on:createRecord',
        type: '() => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:createRecord”.',
      },
      {
        name: 'on:dblclick',
        type: '(record: string | number | undefined, currentRecord?: Record<string, unknown>) => void',
        description: 'Prefer this correctly spelled event for row double-clicks.',
      },
      {
        name: 'on:dbclick',
        type: '(record: string | number | undefined, currentRecord?: Record<string, unknown>) => void',
        description: '@deprecated Use `on:dblclick`. Kept for backwards compatibility.',
      },
      {
        name: 'on:select:row',
        type: '(records: string[]) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:select:row”.',
      },
      {
        name: 'on:sort',
        type: '(column: string) => void | (columns: TableSortState[]) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:sort”.',
      },
      {
        name: 'on:cancel',
        type: '() => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:cancel”.',
      },
      {
        name: 'on:check:row',
        type: '(record: Record<string, unknown>) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:check:row”.',
      },
      {
        name: 'on:submit',
        type: '(record: Record<string, unknown>) => void',
        description: 'Emitowane po zatwierdzeniu danych.',
      },
      {
        name: 'on:changeValue',
        type: '(recordId: string | number | undefined, value: string | number | undefined) => void',
        description:
          'Emitowane po zmianie wartości komórki; przekazuje identyfikator rekordu i nową wartość.',
      },
      {
        name: 'update:page',
        type: '(value: number) => void',
        description: 'Emitowane po zmianie modelu „page”; przekaż nową wartość do v-model:page.',
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
          'Total record count used to calculate the visible range and page count. Property JavaScript: rowsNumber. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'rows-per-page',
        type: 'number',
        required: true,
        description:
          'Liczba rekordów wyświetlanych na jednej stronie. Property JavaScript: rowsPerPage. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'page',
        type: 'number',
        required: true,
        description:
          'Numer aktualnie wybranej strony. Property JavaScript: page. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'total',
        type: 'number',
        required: true,
        description:
          'Total page count; zero suppresses pagination. Pages are derived from rowsNumber/rowsPerPage. Property JavaScript: total. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'under',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „under” komponentu. Property JavaScript: under. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'is-flex',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „is flex” komponentu. Property JavaScript: isFlex. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [],
    events: [
      {
        name: 'on:change:page',
        type: '(page: number) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:change:page”.',
      },
      {
        name: 'on:change:limit',
        type: '(limit: number) => void',
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
          'Konfiguruje właściwość „button create label” komponentu. Property JavaScript: buttonCreateLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'can-create',
        type: 'boolean',
        required: false,
        description:
          'Włącza możliwość dodawania nowych rekordów. Property JavaScript: canCreate. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'can-export',
        type: 'boolean',
        required: false,
        description:
          'Konfiguruje właściwość „can export” komponentu. Property JavaScript: canExport. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'can-filter',
        type: 'boolean',
        required: false,
        description:
          'Konfiguruje właściwość „can filter” komponentu. Property JavaScript: canFilter. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'can-search',
        type: 'boolean',
        required: false,
        description:
          'Konfiguruje właściwość „can search” komponentu. Property JavaScript: canSearch. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'count-filters',
        type: 'number',
        required: false,
        description:
          'Konfiguruje właściwość „count filters” komponentu. Property JavaScript: countFilters. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'count-selected-records',
        type: 'number',
        required: false,
        description:
          'Konfiguruje właściwość „count selected records” komponentu. Property JavaScript: countSelectedRecords. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'search-placeholder',
        type: 'string',
        required: false,
        description:
          'Konfiguruje właściwość „search placeholder” komponentu. Property JavaScript: searchPlaceholder. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'total-records',
        type: 'number',
        required: false,
        description:
          'Konfiguruje właściwość „total records” komponentu. Property JavaScript: totalRecords. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'user-id',
        type: 'string',
        required: false,
        description:
          'Konfiguruje właściwość „user id” komponentu. Property JavaScript: userId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'force-export',
        type: 'boolean',
        required: false,
        description:
          'Konfiguruje właściwość „force export” komponentu. Property JavaScript: forceExport. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'filters-open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Kontrolowana właściwość filters-open; synchronizuj ją przez zdarzenie update:filters-open. Property JavaScript: filters-open. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'on:search',
        type: '(pharse: string) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:search”.',
      },
      {
        name: 'on:reset-filters',
        type: '() => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:reset-filters”.',
      },
      {
        name: 'on:create',
        type: '() => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:create”.',
      },
      {
        name: 'on:export',
        type: '(type: string) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:export”.',
      },
      {
        name: 'update:filters-open',
        type: '(value: boolean) => void',
        description:
          'Emitowane po zmianie modelu „filters-open”; przekaż nową wartość do v-model:filters-open.',
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
          'Unikalny identyfikator elementu w dokumencie. Property JavaScript: id. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza komponent i blokuje jego interakcje. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'level',
        type: 'number',
        required: false,
        default: '1',
        description:
          'Konfiguruje właściwość „level” komponentu. Property JavaScript: level. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'is-last',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „is last” komponentu. Property JavaScript: isLast. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'can-remove',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „can remove” komponentu. Property JavaScript: canRemove. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'tree',
        type: 'TreeListType',
        required: false,
        default: "{ children: {}, label: '' }",
        description:
          'Kontrolowana właściwość tree; synchronizuj ją przez zdarzenie update:tree. Property JavaScript: tree. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'on:remove',
        type: '(id: string) => void',
        description: 'Emitowane po wybraniu akcji usunięcia.',
      },
      {
        name: 'update:tree',
        type: '(value: TreeListType) => void',
        description: 'Emitowane po zmianie modelu „tree”; przekaż nową wartość do v-model:tree.',
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
          'Kolekcja danych. W DOM pozostaje wyłącznie widoczny zakres z overscanem. Property JavaScript: items. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'item-size',
        type: 'number',
        required: false,
        default: '64',
        description:
          'Stała wysokość pojedynczego elementu w pikselach. Property JavaScript: itemSize. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'overscan',
        type: 'number',
        required: false,
        default: '4',
        description:
          'Liczba dodatkowych elementów renderowanych przed i za viewportem. Property JavaScript: overscan. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'height',
        type: 'number | string',
        required: false,
        default: '320',
        description:
          'Wysokość viewportu jako liczba pikseli albo poprawna wartość CSS. Property JavaScript: height. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'item-key',
        type: 'VirtualListItemKeyResolver',
        required: false,
        default: 'id',
        description:
          'Pole lub funkcja zwracająca stabilny klucz string/number. Property JavaScript: itemKey. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'item-label',
        type: 'VirtualListItemLabelResolver',
        required: false,
        default: 'label',
        description:
          'Pole lub funkcja zwracająca domyślną widoczną etykietę. Property JavaScript: itemLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'semantic-role',
        type: "'list' | 'listbox'",
        required: false,
        default: 'list',
        description:
          'Semantyka neutralnej listy albo interaktywnego listboxa. Property JavaScript: semanticRole. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: 'Lista wirtualna',
        description:
          'Dostępna nazwa viewportu i listboxa. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Pokazuje początkowy albo przyrostowy stan ładowania. Property JavaScript: loading. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'has-more',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Informuje, że aplikacja może dołączyć kolejne elementy po zdarzeniu reachEnd. Property JavaScript: hasMore. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        default: '',
        description:
          'Jawny komunikat błędu prezentowany zamiast pustego stanu. Property JavaScript: error. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'empty-title',
        type: 'string',
        required: false,
        default: 'Brak elementów',
        description:
          'Tytuł domyślnego pustego stanu. Property JavaScript: emptyTitle. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'empty-description',
        type: 'string',
        required: false,
        default: 'Lista nie zawiera jeszcze żadnych elementów.',
        description:
          'Opis domyślnego pustego stanu. Property JavaScript: emptyDescription. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'end-label',
        type: 'string',
        required: false,
        default: 'Koniec listy',
        description:
          'Tekst wyświetlany po osiągnięciu kompletnego końca listy. Property JavaScript: endLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny selektor testowy elementu głównego. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'active-index',
        type: 'number | null',
        required: false,
        default: 'null',
        description:
          'Kontrolowana właściwość activeIndex; synchronizuj ją przez zdarzenie update:activeIndex. Property JavaScript: activeIndex. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'visibleRangeChange',
        type: '(detail: VirtualListRange) => void',
        description: 'Emitowane po zmianie renderowanego i rzeczywiście widocznego zakresu.',
      },
      {
        name: 'reachEnd',
        type: '(detail: VirtualListReachEndDetail) => void',
        description: 'Emitowane raz dla danego rozmiaru kolekcji po dotarciu do końca z hasMore.',
      },
      {
        name: 'scroll',
        type: '(detail: VirtualListScrollDetail) => void',
        description: 'Emitowane podczas przewijania po obliczeniu nowego zakresu.',
      },
      {
        name: 'itemFocus',
        type: '(detail: VirtualListItemFocusDetail) => void',
        description: 'Emitowane, gdy element albo jego interaktywny potomek otrzyma fokus.',
      },
      {
        name: 'measureError',
        type: '(detail: VirtualListMeasureErrorDetail) => void',
        description:
          'Emitowane dla niepoprawnych parametrów pomiaru zastąpionych bezpiecznym fallbackiem.',
      },
      {
        name: 'update:activeIndex',
        type: '(value: number | null) => void',
        description:
          'Emitowane po zmianie modelu „activeIndex”; przekaż nową wartość do v-model:activeIndex.',
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
          'Wariant rozmiaru komponentu. Property JavaScript: size. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'ghost' | 'danger'",
        required: false,
        default: 'secondary',
        description:
          'Wariant wizualny komponentu. Property JavaScript: variant. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'type',
        type: "'button' | 'submit' | 'reset'",
        required: false,
        description:
          'Wariant funkcjonalny lub wizualny komponentu. Property JavaScript: type. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza komponent i blokuje jego interakcje. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'placement',
        type: "'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
        required: false,
        default: 'bottom',
        description:
          'Konfiguruje właściwość „placement” komponentu. Property JavaScript: placement. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'selected-items-count',
        type: 'number',
        required: false,
        default: '0',
        description:
          'Konfiguruje właściwość „selected items count” komponentu. Property JavaScript: selectedItemsCount. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'force-export',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „force export” komponentu. Property JavaScript: forceExport. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'use-aria-label',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „use aria label” komponentu. Property JavaScript: useAriaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [],
    events: [
      {
        name: 'on:export',
        type: '(type: string) => void',
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
          'Dokładna wartość tekstowa kopiowana, gdy getText nie został przekazany. Property JavaScript: text. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'get-text',
        type: '() => string | Promise<string>',
        required: false,
        description:
          'Pobiera wartość w chwili aktywacji; obsługuje również źródła asynchroniczne. Property JavaScript: getText. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'reset-delay',
        type: 'number',
        required: false,
        default: '2000',
        description:
          'Czas powrotu ukończonej operacji do stanu początkowego; zero zachowuje stan. Property JavaScript: resetDelay. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        default: 'Kopiuj',
        description:
          'Stała dostępna nazwa akcji i domyślna widoczna etykieta. Property JavaScript: label. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'copied-label',
        type: 'string',
        required: false,
        default: 'Skopiowano',
        description:
          'Widoczny i ogłaszany komunikat powodzenia. Property JavaScript: copiedLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'error-label',
        type: 'string',
        required: false,
        default: 'Nie udało się skopiować',
        description:
          'Widoczny i ogłaszany komunikat błędu. Property JavaScript: errorLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loading-label',
        type: 'string',
        required: false,
        default: 'Kopiowanie',
        description:
          'Widoczny tekst podczas trwającej operacji asynchronicznej. Property JavaScript: loadingLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'content',
        type: "'icon' | 'text' | 'icon-text'",
        required: false,
        default: 'icon-text',
        description:
          'Określa, czy przycisk wyświetla ikonę, tekst, czy oba elementy. Property JavaScript: content. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'ghost' | 'danger'",
        required: false,
        default: 'secondary',
        description:
          'Wariant wizualny zgodny z ButtonAction. Property JavaScript: variant. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'size',
        type: "'xxs' | 'xs' | 's' | 'm' | 'l'",
        required: false,
        default: 'm',
        description:
          'Rozmiar zgodny ze skalą ButtonAction. Property JavaScript: size. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Stan zajętości kontrolowany z zewnątrz. Property JavaScript: loading. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Blokuje aktywację. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'show-status',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyświetla komunikat stanu obok akcji zamiast wyłącznie dla czytnika ekranu. Property JavaScript: showStatus. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: '',
        description:
          'Opcjonalna stała dostępna nazwa zastępująca label. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'type',
        type: "'button' | 'submit' | 'reset'",
        required: false,
        default: 'button',
        description:
          'Natywny typ przycisku. Property JavaScript: type. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stały identyfikator używany w testach automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [],
    events: [
      {
        name: 'copy',
        type: '(detail: CopyButtonCopyDetail) => void',
        description: 'Emitowane po rozwiązaniu dokładnego tekstu i przed próbą zapisu do schowka.',
      },
      {
        name: 'success',
        type: '(detail: CopyButtonSuccessDetail) => void',
        description: 'Emitowane po poprawnym zakończeniu operacji komponentu.',
      },
      {
        name: 'error',
        type: '(detail: CopyButtonErrorDetail) => void',
        description: 'Emitowane, gdy operacja komponentu kończy się błędem.',
      },
      {
        name: 'statusChange',
        type: '(status: CopyButtonStatus) => void',
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
        type: "'text' | 'number' | 'select' | 'textarea' | 'custom'",
        required: false,
        default: 'text',
        description:
          'Rodzaj wbudowanego edytora albo własna kontrolka ze slotu editor. Property JavaScript: editor. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'editor-props',
        type: 'Record<string, unknown>',
        required: false,
        default: '{}',
        description:
          'Właściwości przekazywane do istniejącego komponentu formularza. Property JavaScript: editorProps. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'activation',
        type: "'button' | 'click' | 'dblclick'",
        required: false,
        default: 'button',
        description:
          'Dodatkowy sposób rozpoczęcia edycji; przycisk pozostaje zawsze dostępny. Property JavaScript: activation. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'actions',
        type: "'buttons' | 'keyboard' | 'both'",
        required: false,
        default: 'both',
        description:
          'Widoczne przyciski, skróty klawiaturowe albo oba mechanizmy zapisu. Property JavaScript: actions. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'display',
        type: "'inline' | 'block'",
        required: false,
        default: 'inline',
        description:
          'Układ dopasowany do tekstu lub zajmujący pełną szerokość. Property JavaScript: display. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'tab-behavior',
        type: "'commit' | 'cancel' | 'stay'",
        required: false,
        default: 'commit',
        description:
          'Zachowanie klawisza Tab podczas edycji. Property JavaScript: tabBehavior. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'save-mode',
        type: "'sync' | 'async'",
        required: false,
        default: 'sync',
        description:
          'Zapis lokalny albo asynchroniczny sterowany przez aplikację. Property JavaScript: saveMode. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'validate',
        type: 'InlineEditValidate',
        required: false,
        description:
          'Synchroniczna walidacja szkicu przed zapisem. Property JavaScript: validate. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Oczekiwanie na zewnętrzny zapis. Property JavaScript: loading. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        description:
          'Błąd zwrócony przez zewnętrzny zapis. Property JavaScript: error. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza komponent i blokuje jego interakcje. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Ustawia komponent w trybie tylko do odczytu. Property JavaScript: readonly. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'empty-text',
        type: 'string',
        required: false,
        default: 'Brak wartości',
        description:
          'Konfiguruje właściwość „empty text” komponentu. Property JavaScript: emptyText. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'edit-aria-label',
        type: 'string',
        required: false,
        default: 'Edytuj wartość',
        description:
          'Konfiguruje właściwość „edit aria label” komponentu. Property JavaScript: editAriaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'save-label',
        type: 'string',
        required: false,
        default: 'Zapisz',
        description:
          'Konfiguruje właściwość „save label” komponentu. Property JavaScript: saveLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'cancel-label',
        type: 'string',
        required: false,
        default: 'Anuluj',
        description:
          'Konfiguruje właściwość „cancel label” komponentu. Property JavaScript: cancelLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loading-label',
        type: 'string',
        required: false,
        default: 'Zapisywanie zmian',
        description:
          'Dostępny komunikat opisujący trwającą operację. Property JavaScript: loadingLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'InlineEditValue',
        required: true,
        description:
          'Kontrolowana właściwość value; synchronizuj ją przez zdarzenie update:value. Property JavaScript: value. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'editing',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Kontrolowana właściwość editing; synchronizuj ją przez zdarzenie update:editing. Property JavaScript: editing. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'edit',
        type: '[value: InlineEditValue]',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „edit”.',
      },
      {
        name: 'save',
        type: '[detail: InlineEditSaveDetail]',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „save”.',
      },
      {
        name: 'cancel',
        type: '[value: InlineEditValue]',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „cancel”.',
      },
      {
        name: 'invalid',
        type: '[detail: InlineEditInvalidDetail]',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „invalid”.',
      },
      {
        name: 'draftChange',
        type: '[value: InlineEditValue]',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „draftChange”.',
      },
      {
        name: 'update:value',
        type: '(value: InlineEditValue) => void',
        description: 'Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value.',
      },
      {
        name: 'update:editing',
        type: '(value: boolean) => void',
        description:
          'Emitowane po zmianie modelu „editing”; przekaż nową wartość do v-model:editing.',
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
        name: 'id',
        type: 'string',
        required: false,
        description:
          'Unikalny identyfikator elementu w dokumencie. Property JavaScript: id. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'form',
        type: 'string',
        required: false,
        description:
          'Identyfikator natywnego formularza będącego właścicielem kontrolki. Property JavaScript: form. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description:
          'Nazwa pola używana przez formularz lub nazwa zasobu. Property JavaScript: name. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza komponent i blokuje jego interakcje. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'number',
        required: false,
        default: '0',
        description:
          'Kontrolowana właściwość value; synchronizuj ją przez zdarzenie update:value. Property JavaScript: value. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'update:value',
        type: '(value: number) => void',
        description: 'Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value.',
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
          'Dostępna nazwa elementu przekazywana przez aria-label. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: 'Wpisz czego szukasz',
        description:
          'Tekst pomocniczy widoczny przed wprowadzeniem wartości. Property JavaScript: placeholder. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'debounce-time',
        type: 'number',
        required: false,
        default: '1000',
        description:
          'Konfiguruje właściwość „debounce time” komponentu. Property JavaScript: debounceTime. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza komponent i blokuje jego interakcje. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Ustawia komponent w trybie tylko do odczytu. Property JavaScript: readonly. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string | undefined',
        required: false,
        description:
          'Kontrolowana właściwość value; synchronizuj ją przez zdarzenie update:value. Property JavaScript: value. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'on:search',
        type: '(phrase: string) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:search”.',
      },
      {
        name: 'on:remove',
        type: '() => void',
        description: 'Emitowane po wybraniu akcji usunięcia.',
      },
      {
        name: 'update:value',
        type: '(value: string | undefined) => void',
        description: 'Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value.',
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
          'Identyfikator grupy radio. Property JavaScript: id. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'name',
        type: 'string',
        required: false,
        default: '',
        description:
          'Nazwa ukrytego pola wysyłanego z formularzem. Property JavaScript: name. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'items',
        type: 'SegmentedControlItem[]',
        required: false,
        default: '[]',
        description:
          'Niewielki zestaw wzajemnie wykluczających się pozycji. Property JavaScript: items. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'size',
        type: "'s' | 'm' | 'l'",
        required: false,
        default: 'm',
        description:
          'Rozmiar wszystkich segmentów. Property JavaScript: size. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'distribution',
        type: "'equal' | 'auto'",
        required: false,
        default: 'equal',
        description:
          'Równy albo naturalny rozkład szerokości segmentów. Property JavaScript: distribution. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'full-width',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Rozciąga kontrolkę do szerokości kontenera. Property JavaScript: fullWidth. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'content',
        type: "'text' | 'icon' | 'icon-text'",
        required: false,
        default: 'text',
        description:
          'Prezentuje tekst, ikonę albo oba elementy. Property JavaScript: content. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza całą kontrolkę i usuwa ją z kolejności tabulatora. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        required: false,
        default: 'horizontal',
        description:
          'Kierunek układu oraz nawigacji klawiaturą. Property JavaScript: orientation. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'activation',
        type: "'automatic' | 'manual'",
        required: false,
        default: 'automatic',
        description:
          'Określa, czy nawigacja od razu wybiera segment, czy tylko przenosi fokus. Property JavaScript: activation. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loop',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Zapętla nawigację pomiędzy skrajnymi dostępnymi segmentami. Property JavaScript: loop. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: 'Wybór opcji',
        description:
          'Dostępna nazwa grupy radio. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        default: '',
        description:
          'Stabilny selektor do testów integracyjnych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'SegmentedControlValue | null',
        required: false,
        default: 'null',
        description:
          'Kontrolowana właściwość value; synchronizuj ją przez zdarzenie update:value. Property JavaScript: value. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'change',
        type: '(value: SegmentedControlValue, item: SegmentedControlItem, nativeEvent: MouseEvent | KeyboardEvent) => void',
        description: 'Emitowany po skutecznym wyborze innego segmentu.',
      },
      {
        name: 'focusChange',
        type: '(item: SegmentedControlItem, index: number) => void',
        description: 'Emitowany po przeniesieniu aktywnego fokusu.',
      },
      {
        name: 'update:value',
        type: '(value: SegmentedControlValue | null) => void',
        description: 'Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value.',
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
          'Wyłącza komponent i blokuje jego interakcje. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Ustawia komponent w trybie tylko do odczytu. Property JavaScript: readonly. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'active',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Określa aktywny element albo aktywny krok. Property JavaScript: active. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
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
          'Widoczna etykieta oraz awaryjna dostępna nazwa głównej akcji. Property JavaScript: label. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'items',
        type: 'DropdownMenuItem[]',
        required: false,
        default: '[]',
        description:
          'Akcje alternatywne renderowane przez DropdownMenu. Property JavaScript: items. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'icon',
        type: 'string',
        required: false,
        description:
          'Opcjonalna nazwa ikony PeaUI poprzedzającej etykietę. Property JavaScript: icon. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'danger'",
        required: false,
        default: 'primary',
        description:
          'Wariant kolorystyczny obu części kontrolki. Property JavaScript: variant. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'size',
        type: "'xxs' | 'xs' | 's' | 'm' | 'l'",
        required: false,
        default: 'm',
        description:
          'Rozmiar zgodny z ButtonAction. Property JavaScript: size. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'type',
        type: "'button' | 'submit' | 'reset'",
        required: false,
        default: 'button',
        description:
          'Natywny typ przycisku głównej akcji. Property JavaScript: type. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'menu-align',
        type: "'start' | 'end'",
        required: false,
        default: 'end',
        description:
          'Wyrównanie powierzchni menu do początku lub końca kontrolki. Property JavaScript: menuAlign. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza obie części kontrolki. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'primary-disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza wyłącznie główną akcję. Property JavaScript: primaryDisabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'menu-disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza wyłącznie trigger menu i zamyka otwarte menu. Property JavaScript: menuDisabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Blokuje główną akcję i pokazuje jej stan zajętości; menu pozostaje niezależne. Property JavaScript: loading. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'menu-loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Pokazuje dostępny stan ładowania wewnątrz otwartego menu. Property JavaScript: menuLoading. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa grupy dwóch przycisków. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'menu-aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa przycisku otwierającego menu. Property JavaScript: menuAriaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loading-label',
        type: 'string',
        required: false,
        default: 'Trwa wykonywanie głównej akcji',
        description:
          'Tekst statusu głównej akcji przekazywany technologiom asystującym. Property JavaScript: loadingLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'menu-loading-label',
        type: 'string',
        required: false,
        default: 'Ładowanie menu…',
        description:
          'Tekst dostępnego stanu ładowania menu. Property JavaScript: menuLoadingLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'empty-label',
        type: 'string',
        required: false,
        default: 'Brak dostępnych akcji',
        description:
          'Tekst pustego stanu menu. Property JavaScript: emptyLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator używany w testach automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Kontrolowana właściwość open; synchronizuj ją przez zdarzenie update:open. Property JavaScript: open. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'primaryClick',
        type: '(nativeEvent: MouseEvent) => void',
        description: 'Emitowane wyłącznie po aktywowaniu lewej, głównej części.',
      },
      {
        name: 'select',
        type: '(item: DropdownMenuItem, path: number[]) => void',
        description: 'Emitowane po wyborze dostępnej pozycji menu.',
      },
      {
        name: 'update:open',
        type: '(value: boolean) => void',
        description: 'Emitowane po zmianie modelu „open”; przekaż nową wartość do v-model:open.',
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
          'Identyfikator natywnego przycisku. Property JavaScript: id. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        default: 'Przełącz',
        description:
          'Stała etykieta widoczna w stanie nieaktywnym i używana jako dostępna nazwa. Property JavaScript: label. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'pressed-label',
        type: 'string',
        required: false,
        default: '',
        description:
          'Opcjonalna etykieta widoczna po włączeniu; nie zmienia dostępnej nazwy. Property JavaScript: pressedLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'icon',
        type: 'string',
        required: false,
        default: '',
        description:
          'Nazwa dekoracyjnej ikony SvgIcon. Property JavaScript: icon. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'pressed-icon',
        type: 'string',
        required: false,
        default: '',
        description:
          'Opcjonalna ikona dekoracyjna widoczna po włączeniu. Property JavaScript: pressedIcon. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'content',
        type: "'text' | 'icon' | 'icon-text'",
        required: false,
        default: 'icon-text',
        description:
          'Określa, czy przycisk pokazuje tekst, ikonę czy oba elementy. Property JavaScript: content. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'variant',
        type: "'default' | 'outline' | 'ghost'",
        required: false,
        default: 'default',
        description:
          'Wariant wizualny powierzchni. Property JavaScript: variant. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'size',
        type: "'xxs' | 'xs' | 's' | 'm' | 'l'",
        required: false,
        default: 'm',
        description:
          'Rozmiar zgodny ze skalą ButtonAction; cel dotykowy zachowuje minimum 44 px. Property JavaScript: size. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'type',
        type: "'button' | 'submit' | 'reset'",
        required: false,
        default: 'button',
        description:
          'Typ natywnego przycisku. Property JavaScript: type. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'allow-wrap',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Pozwala jawnie zawijać długi tekst zamiast utrzymywać go w jednym wierszu. Property JavaScript: allowWrap. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza kontrolkę i usuwa ją z kolejności fokusu. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Blokuje zmianę, ale pozostawia kontrolkę w kolejności fokusu. Property JavaScript: readonly. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Blokuje zmianę i eksponuje stan zajętości. Property JavaScript: loading. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: '',
        description:
          'Stała dostępna nazwa, wymagana dla przycisku wyłącznie ikonowego bez label. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loading-label',
        type: 'string',
        required: false,
        default: 'Trwa aktualizowanie ustawienia',
        description:
          'Dostępny komunikat stanu ładowania. Property JavaScript: loadingLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator używany w testach automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Kontrolowana właściwość value; synchronizuj ją przez zdarzenie update:value. Property JavaScript: value. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'change',
        type: '(value: boolean, nativeEvent: MouseEvent) => void',
        description: 'Emitowane po zmianie wraz z nowym stanem i natywnym zdarzeniem.',
      },
      {
        name: 'click',
        type: '(nativeEvent: MouseEvent) => void',
        description: 'Emitowane raz po skutecznej aktywacji kontrolki.',
      },
      {
        name: 'update:value',
        type: '(value: boolean) => void',
        description: 'Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value.',
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
          'Identyfikator grupy i powiązanych opisów. Property JavaScript: id. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'name',
        type: 'string',
        required: false,
        default: '',
        description:
          'Nazwa ukrytych pól przekazywanych z formularzem. Property JavaScript: name. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'items',
        type: 'ToggleGroupItem[]',
        required: false,
        default: '[]',
        description:
          'Pozycje zarządzane przez komponent. Property JavaScript: items. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'type',
        type: "'single' | 'multiple'",
        required: false,
        default: 'single',
        description:
          'Tryb pojedynczego albo wielokrotnego wyboru. Property JavaScript: type. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        required: false,
        default: 'horizontal',
        description:
          'Kierunek układu i nawigacji klawiaturą. Property JavaScript: orientation. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'appearance',
        type: "'separate' | 'attached'",
        required: false,
        default: 'separate',
        description:
          'Oddzielny albo połączony wygląd przycisków. Property JavaScript: appearance. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'semantic-role',
        type: "'toolbar' | 'group'",
        required: false,
        default: 'toolbar',
        description:
          'Semantyka dostępności grupy. Property JavaScript: semanticRole. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'overflow',
        type: "'wrap' | 'scroll'",
        required: false,
        default: 'wrap',
        description:
          'Zachowanie grupy przy braku miejsca. Property JavaScript: overflow. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Empty selection blocks native form submission; readonly and disabled are exempt. Property JavaScript: required. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'allow-empty',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Pozwala wyłączyć ostatnią aktywną pozycję, gdy grupa nie jest wymagana. Property JavaScript: allowEmpty. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loop',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Zapętla nawigację strzałkami pomiędzy skrajnymi pozycjami. Property JavaScript: loop. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza całą grupę i usuwa ją z kolejności tabulatora. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Blokuje zmianę wartości, zachowując możliwość odczytu i fokusu. Property JavaScript: readonly. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        default: '',
        description:
          'Widoczna etykieta grupy. Property JavaScript: label. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        default: '',
        description:
          'Zewnętrzny komunikat błędu. Property JavaScript: error. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'required-message',
        type: 'string',
        required: false,
        default: 'Wybierz co najmniej jedną opcję.',
        description:
          'Komunikat używany dla pustej wymaganej grupy. Property JavaScript: requiredMessage. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: '',
        description:
          'Dostępna nazwa, gdy widoczna etykieta nie jest potrzebna. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'size',
        type: "'xxs' | 'xs' | 's' | 'm' | 'l'",
        required: false,
        default: 'm',
        description:
          'Rozmiar wszystkich przycisków. Property JavaScript: size. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'variant',
        type: "'default' | 'outline' | 'ghost'",
        required: false,
        default: 'outline',
        description:
          'Wariant wizualny wszystkich przycisków. Property JavaScript: variant. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        default: '',
        description:
          'Stabilny selektor do testów integracyjnych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'ToggleGroupModelValue',
        required: false,
        default: 'null',
        description:
          'Kontrolowana właściwość value; synchronizuj ją przez zdarzenie update:value. Property JavaScript: value. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'change',
        type: '(value: ToggleGroupModelValue, item: ToggleGroupItem, nativeEvent: MouseEvent) => void',
        description: 'Emitowany po zaakceptowanej zmianie wyboru.',
      },
      {
        name: 'focusChange',
        type: '(item: ToggleGroupItem, index: number) => void',
        description: 'Emitowany po przeniesieniu aktywnego fokusu w grupie.',
      },
      {
        name: 'update:value',
        type: '(value: ToggleGroupModelValue) => void',
        description: 'Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value.',
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
        name: 'virtual',
        type: 'boolean',
        required: false,
        description:
          'Render a bounded fixed-height window in each panel. Property JavaScript: virtual. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'option-height',
        type: 'number',
        required: false,
        description:
          'Height of a virtual row, in pixels. Property JavaScript: optionHeight. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'id',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator komponentu i jego relacji ARIA. Property JavaScript: id. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'items',
        type: 'readonly TransferListItem[]',
        required: false,
        default: '[]',
        description:
          'Pełny katalog elementów. Pierwszy element o danym kluczu wygrywa. Property JavaScript: items. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'item-key',
        type: 'TransferListKeyResolver',
        required: false,
        default: 'key',
        description:
          'Pole lub funkcja zwracająca stabilny klucz string/number. Property JavaScript: itemKey. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'item-label',
        type: 'TransferListLabelResolver',
        required: false,
        default: 'label',
        description:
          'Pole lub funkcja zwracająca widoczną etykietę. Property JavaScript: itemLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'searchable',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Pokazuje niezależny filtr w obu panelach. Property JavaScript: searchable. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'sort',
        type: 'TransferListSort',
        required: false,
        default: 'false',
        description:
          'Sortowanie widoku; false zachowuje kolejność źródłową. Property JavaScript: sort. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'preserve-order',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Zachowuje kolejność tablicy value w panelu docelowym. Property JavaScript: preserveOrder. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled-keys',
        type: 'readonly TransferListKey[]',
        required: false,
        default: '[]',
        description:
          'Klucze blokowane niezależnie od pola disabled elementu. Property JavaScript: disabledKeys. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loading',
        type: 'boolean | TransferListLoadingState',
        required: false,
        default: 'false',
        description:
          'Stan ładowania całego komponentu albo wybranego panelu. Property JavaScript: loading. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'labels',
        type: 'Partial<TransferListLabels>',
        required: false,
        default: '{}',
        description:
          'Lokalizowane teksty interfejsu. Property JavaScript: labels. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza wszystkie operacje i usuwa listy z kolejności Tab. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        required: false,
        default: 'horizontal',
        description:
          'Preferowany układ; horizontal automatycznie składa się na mobile. Property JavaScript: orientation. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'size',
        type: "'compact' | 'standard'",
        required: false,
        default: 'standard',
        description:
          'Standardowa lub kompaktowa gęstość wierszy. Property JavaScript: size. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'locale',
        type: 'string',
        required: false,
        default: 'pl-PL',
        description:
          'Locale filtrowania i sortowania. Property JavaScript: locale. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: 'Przenoszenie elementów między listami',
        description:
          'Dostępna nazwa całego przepływu. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        default: '',
        description:
          'Opcjonalny błąd wspólny dla obu list. Property JavaScript: error. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny selektor testowy. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'TransferListKey[]',
        required: false,
        default: '[]',
        description:
          'Kontrolowana właściwość value; synchronizuj ją przez zdarzenie update:value. Property JavaScript: value. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'source-selected',
        type: 'TransferListKey[]',
        required: false,
        default: '[]',
        description:
          'Kontrolowana właściwość sourceSelected; synchronizuj ją przez zdarzenie update:sourceSelected. Property JavaScript: sourceSelected. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'target-selected',
        type: 'TransferListKey[]',
        required: false,
        default: '[]',
        description:
          'Kontrolowana właściwość targetSelected; synchronizuj ją przez zdarzenie update:targetSelected. Property JavaScript: targetSelected. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'move',
        type: '(detail: TransferListMoveDetail) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „move”.',
      },
      {
        name: 'search',
        type: '(detail: TransferListSearchDetail) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „search”.',
      },
      {
        name: 'selectionChange',
        type: '(detail: TransferListSelectionDetail) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „selectionChange”.',
      },
      {
        name: 'update:value',
        type: '(value: TransferListKey[]) => void',
        description: 'Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value.',
      },
      {
        name: 'update:sourceSelected',
        type: '(value: TransferListKey[]) => void',
        description:
          'Emitowane po zmianie modelu „sourceSelected”; przekaż nową wartość do v-model:sourceSelected.',
      },
      {
        name: 'update:targetSelected',
        type: '(value: TransferListKey[]) => void',
        description:
          'Emitowane po zmianie modelu „targetSelected”; przekaż nową wartość do v-model:targetSelected.',
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
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'title',
        type: 'string',
        required: false,
        description:
          'Główny tytuł prezentowany w komponencie. Property JavaScript: title. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        description:
          'Dodatkowy opis objaśniający zawartość albo stan komponentu. Property JavaScript: description. Wartości złożone i funkcje ustawiaj jako properties.',
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
    name: 'NotificationCenter',
    sourceName: 'NotificationCenter',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/feedback/NotificationCenter',
    tagName: 'peaui-notification-center',
    status: 'stable',
    props: [
      {
        name: 'items',
        type: 'readonly NotificationCenterItem[]',
        required: true,
        description:
          'Notifications rendered in their supplied order. The component never mutates them. Property JavaScript: items. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'unread-count',
        type: 'number',
        required: false,
        description:
          'Optional controlled unread count, useful when not all pages are loaded. Property JavaScript: unreadCount. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'filters',
        type: 'readonly NotificationCenterFilter[]',
        required: false,
        description:
          'Custom filter definitions. Defaults to All and Unread. Property JavaScript: filters. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'group-by',
        type: "'none' | 'date' | 'type'",
        required: false,
        default: 'none',
        description:
          'Groups visible notifications without changing their order. Property JavaScript: groupBy. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Shows the initial loading state. Property JavaScript: loading. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loading-more',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Shows the incremental loading state. Property JavaScript: loadingMore. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'has-more',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Enables requesting another page. Property JavaScript: hasMore. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'error',
        type: 'string | null',
        required: false,
        default: 'null',
        description:
          'Error message displayed without modifying the supplied items. Property JavaScript: error. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'locale',
        type: 'string',
        required: false,
        default: 'en',
        description:
          'Locale used by the default date formatter. Property JavaScript: locale. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'format-date',
        type: '(date: NotificationCenterDate, item: NotificationCenterItem) => string',
        required: false,
        description:
          'Optional application date formatter. Property JavaScript: formatDate. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: 'Notifications',
        description:
          'Accessible name of the notification center. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stable test selector. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'variant',
        type: "'panel' | 'drawer-content' | 'page'",
        required: false,
        default: 'panel',
        description:
          'Surface treatment for a panel, drawer body, or full page. Property JavaScript: variant. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'density',
        type: "'compact' | 'comfortable'",
        required: false,
        default: 'comfortable',
        description:
          'Vertical spacing density. Property JavaScript: density. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'pagination-mode',
        type: "'pagination' | 'infinite'",
        required: false,
        default: 'pagination',
        description:
          'How additional data is requested. Property JavaScript: paginationMode. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'mark-all-pending',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Disables the mark-all intent while the application processes it. Property JavaScript: markAllPending. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'pending-item-ids',
        type: 'readonly NotificationCenterItemId[]',
        required: false,
        description:
          'Item identifiers with an application-side action in progress. Property JavaScript: pendingItemIds. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'reference-date',
        type: 'string | number | Date',
        required: false,
        default: 'new Date()',
        description:
          'Stable reference date for deterministic relative formatting. Property JavaScript: referenceDate. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'labels',
        type: 'Partial<NotificationCenterLabels>',
        required: false,
        description:
          'User-facing text overrides. Property JavaScript: labels. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'max-height',
        type: 'string',
        required: false,
        default: '32rem',
        description:
          'Optional maximum height of the scrollable list. Property JavaScript: maxHeight. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'active-filter',
        type: 'string',
        required: false,
        default: 'all',
        description:
          'Kontrolowana właściwość activeFilter; synchronizuj ją przez zdarzenie update:activeFilter. Property JavaScript: activeFilter. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'selected-id',
        type: 'NotificationCenterItemId | null',
        required: false,
        default: 'null',
        description:
          'Kontrolowana właściwość selectedId; synchronizuj ją przez zdarzenie update:selectedId. Property JavaScript: selectedId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'update:activeFilter',
        type: '(value: string) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „update:activeFilter”.',
      },
      {
        name: 'update:selectedId',
        type: '(value: NotificationCenterItemId) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „update:selectedId”.',
      },
      {
        name: 'select',
        type: '(payload: NotificationCenterSelectPayload) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „select”.',
      },
      {
        name: 'action',
        type: '(payload: NotificationCenterActionPayload) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „action”.',
      },
      {
        name: 'markRead',
        type: '(item: NotificationCenterItem) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „markRead”.',
      },
      {
        name: 'markUnread',
        type: '(item: NotificationCenterItem) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „markUnread”.',
      },
      {
        name: 'markAllRead',
        type: '() => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „markAllRead”.',
      },
      {
        name: 'loadMore',
        type: '(payload: NotificationCenterLoadMorePayload) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „loadMore”.',
      },
      {
        name: 'filterChange',
        type: '(filterId: string) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „filterChange”.',
      },
      {
        name: 'retry',
        type: '() => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „retry”.',
      },
    ],
    slots: [
      {
        name: 'header',
        description: 'Treść osadzana w nazwanym slocie „header”.',
      },
      {
        name: 'filters',
        description: 'Treść osadzana w nazwanym slocie „filters”.',
      },
      {
        name: 'loading',
        description: 'Treść osadzana w nazwanym slocie „loading”.',
      },
      {
        name: 'error',
        description: 'Treść osadzana w nazwanym slocie „error”.',
      },
      {
        name: 'empty',
        description: 'Treść osadzana w nazwanym slocie „empty”.',
      },
      {
        name: 'group-header',
        description: 'Treść osadzana w nazwanym slocie „group-header”.',
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
        name: 'item-actions',
        description: 'Treść osadzana w nazwanym slocie „item-actions”.',
      },
      {
        name: 'footer',
        description: 'Treść osadzana w nazwanym slocie „footer”.',
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
          'Konfiguruje właściwość „steps” komponentu. Property JavaScript: steps. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'active',
        type: 'number',
        required: false,
        description:
          'Określa aktywny element albo aktywny krok. Property JavaScript: active. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'size',
        type: 'number',
        required: false,
        description:
          'Wariant rozmiaru komponentu. Property JavaScript: size. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'stroke-width',
        type: 'number',
        required: false,
        description:
          'Konfiguruje właściwość „stroke width” komponentu. Property JavaScript: strokeWidth. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'remove-active',
        type: 'boolean',
        required: false,
        description:
          'Konfiguruje właściwość „remove active” komponentu. Property JavaScript: removeActive. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
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
          'Wariant rozmiaru komponentu. Property JavaScript: size. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'rounded',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „rounded” komponentu. Property JavaScript: rounded. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: 'Trwa ladowanie tresci.',
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
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
        description: 'Atrybut HTML „data-testid” konfigurujący komponent SpinnerLoader.',
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
          'Unikalny identyfikator elementu w dokumencie. Property JavaScript: id. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description:
          'Nazwa pola używana przez formularz lub nazwa zasobu. Property JavaScript: name. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'is-valid',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „is valid” komponentu. Property JavaScript: isValid. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description:
          'Oznacza wartość jako wymaganą. Property JavaScript: required. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description:
          'Wyłącza komponent i blokuje jego interakcje. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'size',
        type: "'xxs' | 'xs' | 's' | 'm' | 'l'",
        required: false,
        default: 'm',
        description:
          'Wariant rozmiaru komponentu. Property JavaScript: size. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'boolean | undefined',
        required: true,
        description:
          'Kontrolowana właściwość value; synchronizuj ją przez zdarzenie update:value. Property JavaScript: value. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'update:value',
        type: '(value: boolean | undefined) => void',
        description: 'Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value.',
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
          'Unikalny identyfikator elementu w dokumencie. Property JavaScript: id. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'name',
        type: 'string',
        required: false,
        default: 'formButtonGroup',
        description:
          'Nazwa pola używana przez formularz lub nazwa zasobu. Property JavaScript: name. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description:
          'Widoczna etykieta opisująca element lub pole formularza. Property JavaScript: label. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'size',
        type: "'xs' | 's' | 'm' | 'l'",
        required: false,
        default: 'm',
        description:
          'Wariant rozmiaru komponentu. Property JavaScript: size. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'is-toggle',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „is toggle” komponentu. Property JavaScript: isToggle. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description:
          'Empty selection blocks native form submission; readonly and disabled are exempt. Property JavaScript: required. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description:
          'Wyłącza komponent i blokuje jego interakcje. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description:
          'Ustawia komponent w trybie tylko do odczytu. Property JavaScript: readonly. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'options',
        type: 'ButtonGroupOption[]',
        required: false,
        default: '[]',
        description:
          'Lista opcji dostępnych do wyświetlenia lub wyboru. Property JavaScript: options. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string | number | undefined',
        required: false,
        default: 'undefined',
        description:
          'Kontrolowana właściwość value; synchronizuj ją przez zdarzenie update:value. Property JavaScript: value. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'update:value',
        type: '(value: string | number | undefined) => void',
        description: 'Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value.',
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
          'Unikalny identyfikator elementu w dokumencie. Property JavaScript: id. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description:
          'Nazwa pola używana przez formularz lub nazwa zasobu. Property JavaScript: name. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'is-valid',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „is valid” komponentu. Property JavaScript: isValid. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description:
          'Oznacza wartość jako wymaganą. Property JavaScript: required. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description:
          'Wyłącza komponent i blokuje jego interakcje. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'boolean | undefined',
        required: true,
        description:
          'Kontrolowana właściwość value; synchronizuj ją przez zdarzenie update:value. Property JavaScript: value. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'update:value',
        type: '(value: boolean | undefined) => void',
        description: 'Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value.',
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
          'Konfiguruje właściwość „alpha” komponentu. Property JavaScript: alpha. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'can-erase',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Pokazuje akcję pozwalającą wyczyścić bieżącą wartość. Property JavaScript: canErase. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'density',
        type: "'compact' | 'full'",
        required: false,
        default: 'full',
        description:
          'Konfiguruje właściwość „density” komponentu. Property JavaScript: density. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        description:
          'Dodatkowy opis objaśniający zawartość albo stan komponentu. Property JavaScript: description. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description:
          'Wyłącza komponent i blokuje jego interakcje. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        description:
          'Komunikat błędu powiązany z polem lub operacją. Property JavaScript: error. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'format',
        type: "'hex' | 'rgb' | 'hsl'",
        required: false,
        default: 'hex',
        description:
          'Konfiguruje właściwość „format” komponentu. Property JavaScript: format. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'id',
        type: 'string',
        required: true,
        description:
          'Unikalny identyfikator elementu w dokumencie. Property JavaScript: id. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description:
          'Widoczna etykieta opisująca element lub pole formularza. Property JavaScript: label. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Włącza stan ładowania i informuje o trwającej operacji. Property JavaScript: loading. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loading-label',
        type: 'string',
        required: false,
        default: 'Ładowanie wyboru koloru',
        description:
          'Dostępny komunikat opisujący trwającą operację. Property JavaScript: loadingLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description:
          'Nazwa pola używana przez formularz lub nazwa zasobu. Property JavaScript: name. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'panel-aria-label',
        type: 'string',
        required: false,
        default: 'Wybierz kolor',
        description:
          'Konfiguruje właściwość „panel aria label” komponentu. Property JavaScript: panelAriaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'placement',
        type: "'top' | 'bottom'",
        required: false,
        default: 'bottom',
        description:
          'Konfiguruje właściwość „placement” komponentu. Property JavaScript: placement. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: '',
        description:
          'Tekst pomocniczy widoczny przed wprowadzeniem wartości. Property JavaScript: placeholder. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description:
          'Ustawia komponent w trybie tylko do odczytu. Property JavaScript: readonly. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'recent-colors',
        type: 'ReadonlyArray<string | FormColorPickerSwatch>',
        required: false,
        default: '[]',
        description:
          'Konfiguruje właściwość „recent colors” komponentu. Property JavaScript: recentColors. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description:
          'Oznacza wartość jako wymaganą. Property JavaScript: required. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'saved-colors',
        type: 'ReadonlyArray<string | FormColorPickerSwatch>',
        required: false,
        default: '[]',
        description:
          'Konfiguruje właściwość „saved colors” komponentu. Property JavaScript: savedColors. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'show-eyedropper',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „show eyedropper” komponentu. Property JavaScript: showEyedropper. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'variant',
        type: "'popover' | 'inline'",
        required: false,
        default: 'popover',
        description:
          'Wariant wizualny komponentu. Property JavaScript: variant. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string',
        required: false,
        default: '#4C9A2A',
        description:
          'Kontrolowana właściwość value; synchronizuj ją przez zdarzenie update:value. Property JavaScript: value. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Kontrolowana właściwość open; synchronizuj ją przez zdarzenie update:open. Property JavaScript: open. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'change',
        type: '(value: string) => void',
        description: 'Emitowane po zmianie wartości przez użytkownika.',
      },
      {
        name: 'close',
        type: '() => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „close”.',
      },
      {
        name: 'commit',
        type: '(value: string) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „commit”.',
      },
      {
        name: 'eyedropperError',
        type: '(detail: FormColorPickerEyedropperErrorDetail) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „eyedropperError”.',
      },
      {
        name: 'eyedropperStart',
        type: '() => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „eyedropperStart”.',
      },
      {
        name: 'invalid',
        type: '(detail: FormColorPickerInvalidDetail) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „invalid”.',
      },
      {
        name: 'open',
        type: '() => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „open”.',
      },
      {
        name: 'update:value',
        type: '(value: string) => void',
        description: 'Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value.',
      },
      {
        name: 'update:open',
        type: '(value: boolean) => void',
        description: 'Emitowane po zmianie modelu „open”; przekaż nową wartość do v-model:open.',
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
          'Widoczna etykieta opisująca element lub pole formularza. Property JavaScript: label. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'submit-button-label',
        type: 'string',
        required: false,
        default: 'Zapisz',
        description:
          'Konfiguruje właściwość „submit button label” komponentu. Property JavaScript: submitButtonLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'is-loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Włącza stan ładowania i informuje o trwającej operacji. Property JavaScript: isLoading. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'show-actions',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „show actions” komponentu. Property JavaScript: showActions. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description:
          'Wyłącza komponent i blokuje jego interakcje. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'cancel-button-label',
        type: 'string',
        required: false,
        default: 'Anuluj',
        description:
          'Konfiguruje właściwość „cancel button label” komponentu. Property JavaScript: cancelButtonLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'actions-position',
        type: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
        required: false,
        default: 'bottom-left',
        description:
          'Konfiguruje właściwość „actions position” komponentu. Property JavaScript: actionsPosition. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'show-cancel-button',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „show cancel button” komponentu. Property JavaScript: showCancelButton. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'size-button',
        type: "'xxs' | 'xs' | 's' | 'm' | 'l'",
        required: false,
        default: 'xs',
        description:
          'Konfiguruje właściwość „size button” komponentu. Property JavaScript: sizeButton. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'use-aria-labelledby',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „use aria labelledby” komponentu. Property JavaScript: useAriaLabelledby. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [],
    events: [
      {
        name: 'on:cancel',
        type: '() => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:cancel”.',
      },
      {
        name: 'on:submit',
        type: '() => void',
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
          'Unikalny identyfikator elementu w dokumencie. Property JavaScript: id. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'can-erase',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Pokazuje akcję pozwalającą wyczyścić bieżącą wartość. Property JavaScript: canErase. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'after',
        type: 'string',
        required: false,
        description:
          'Treść wyświetlana za właściwą wartością pola. Property JavaScript: after. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'before',
        type: 'string',
        required: false,
        description:
          'Treść wyświetlana przed właściwą wartością pola. Property JavaScript: before. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description:
          'Nazwa pola używana przez formularz lub nazwa zasobu. Property JavaScript: name. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description:
          'Widoczna etykieta opisująca element lub pole formularza. Property JavaScript: label. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'icon-before',
        type: 'string',
        required: false,
        description:
          'Nazwa ikony wyświetlanej przed treścią pola. Property JavaScript: iconBefore. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description:
          'Empty selection blocks native form submission; readonly and disabled are exempt. Property JavaScript: required. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: 'wybierz date',
        description:
          'Tekst pomocniczy widoczny przed wprowadzeniem wartości. Property JavaScript: placeholder. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'range',
        type: 'boolean',
        required: false,
        description:
          'Konfiguruje właściwość „range” komponentu. Property JavaScript: range. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'min-date',
        type: 'string',
        required: false,
        description:
          'Konfiguruje właściwość „min date” komponentu. Property JavaScript: minDate. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'max-date',
        type: 'string',
        required: false,
        description:
          'Konfiguruje właściwość „max date” komponentu. Property JavaScript: maxDate. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'min',
        type: 'string',
        required: false,
        description:
          'Minimalna dozwolona wartość. Property JavaScript: min. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'max',
        type: 'string',
        required: false,
        description:
          'Maksymalna dozwolona wartość albo szerokość. Property JavaScript: max. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description:
          'Wyłącza komponent i blokuje jego interakcje. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description:
          'Ustawia komponent w trybie tylko do odczytu. Property JavaScript: readonly. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string | DatePickerRangeValue | undefined',
        required: true,
        description:
          'Kontrolowana właściwość value; synchronizuj ją przez zdarzenie update:value. Property JavaScript: value. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'on:remove',
        type: '() => void',
        description: 'Emitowane po wybraniu akcji usunięcia.',
      },
      {
        name: 'update:value',
        type: '(value: string | DatePickerRangeValue | undefined) => void',
        description: 'Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value.',
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
          'Dostępna nazwa elementu przekazywana przez aria-label. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'calendars',
        type: '1 | 2',
        required: false,
        default: '2',
        description:
          'Konfiguruje właściwość „calendars” komponentu. Property JavaScript: calendars. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'can-erase',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Pokazuje akcję pozwalającą wyczyścić bieżącą wartość. Property JavaScript: canErase. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'confirm',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „confirm” komponentu. Property JavaScript: confirm. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'date-format',
        type: 'FormDateRangePickerDateFormat',
        required: false,
        default: 'locale',
        description:
          'Konfiguruje właściwość „date format” komponentu. Property JavaScript: dateFormat. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        description:
          'Dodatkowy opis objaśniający zawartość albo stan komponentu. Property JavaScript: description. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description:
          'Wyłącza komponent i blokuje jego interakcje. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'end-label',
        type: 'string',
        required: false,
        default: 'Data końcowa',
        description:
          'Konfiguruje właściwość „end label” komponentu. Property JavaScript: endLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'end-placeholder',
        type: 'string',
        required: false,
        default: '',
        description:
          'Konfiguruje właściwość „end placeholder” komponentu. Property JavaScript: endPlaceholder. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        description:
          'Komunikat błędu powiązany z polem lub operacją. Property JavaScript: error. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'format',
        type: 'DateRangeFormatter',
        required: false,
        description:
          'Konfiguruje właściwość „format” komponentu. Property JavaScript: format. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'id',
        type: 'string',
        required: true,
        description:
          'Unikalny identyfikator elementu w dokumencie. Property JavaScript: id. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'is-date-disabled',
        type: '(date: string) => boolean',
        required: false,
        description:
          'Konfiguruje właściwość „is date disabled” komponentu. Property JavaScript: isDateDisabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description:
          'Widoczna etykieta opisująca element lub pole formularza. Property JavaScript: label. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Włącza stan ładowania i informuje o trwającej operacji. Property JavaScript: loading. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loading-label',
        type: 'string',
        required: false,
        default: 'Ładowanie wyboru zakresu dat',
        description:
          'Dostępny komunikat opisujący trwającą operację. Property JavaScript: loadingLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'locale',
        type: 'string',
        required: false,
        default: 'pl-PL',
        description:
          'Konfiguruje właściwość „locale” komponentu. Property JavaScript: locale. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'max-date',
        type: 'string',
        required: false,
        description:
          'Konfiguruje właściwość „max date” komponentu. Property JavaScript: maxDate. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'min-date',
        type: 'string',
        required: false,
        description:
          'Konfiguruje właściwość „min date” komponentu. Property JavaScript: minDate. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description:
          'Nazwa pola używana przez formularz lub nazwa zasobu. Property JavaScript: name. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'panel-aria-label',
        type: 'string',
        required: false,
        default: 'Wybierz zakres dat',
        description:
          'Konfiguruje właściwość „panel aria label” komponentu. Property JavaScript: panelAriaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'parse',
        type: 'DateRangeParser',
        required: false,
        description:
          'Konfiguruje właściwość „parse” komponentu. Property JavaScript: parse. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'placement',
        type: "'top' | 'bottom'",
        required: false,
        default: 'bottom',
        description:
          'Konfiguruje właściwość „placement” komponentu. Property JavaScript: placement. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: '',
        description:
          'Tekst pomocniczy widoczny przed wprowadzeniem wartości. Property JavaScript: placeholder. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'presets',
        type: 'DateRangePreset[]',
        required: false,
        default: '[]',
        description:
          'Konfiguruje właściwość „presets” komponentu. Property JavaScript: presets. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description:
          'Ustawia komponent w trybie tylko do odczytu. Property JavaScript: readonly. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description:
          'Oznacza wartość jako wymaganą. Property JavaScript: required. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'selection-order',
        type: "'swap' | 'reject' | 'resetEnd'",
        required: false,
        default: 'swap',
        description:
          'Konfiguruje właściwość „selection order” komponentu. Property JavaScript: selectionOrder. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'show-presets',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „show presets” komponentu. Property JavaScript: showPresets. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'start-label',
        type: 'string',
        required: false,
        default: 'Data początkowa',
        description:
          'Konfiguruje właściwość „start label” komponentu. Property JavaScript: startLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'start-placeholder',
        type: 'string',
        required: false,
        default: '',
        description:
          'Konfiguruje właściwość „start placeholder” komponentu. Property JavaScript: startPlaceholder. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'variant',
        type: "'single-input' | 'two-inputs'",
        required: false,
        default: 'two-inputs',
        description:
          'Wariant wizualny komponentu. Property JavaScript: variant. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'DateRangeValue | undefined',
        required: false,
        description:
          'Kontrolowana właściwość value; synchronizuj ją przez zdarzenie update:value. Property JavaScript: value. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Kontrolowana właściwość open; synchronizuj ją przez zdarzenie update:open. Property JavaScript: open. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'apply',
        type: '(value: [string, string]) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „apply”.',
      },
      {
        name: 'cancel',
        type: '() => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „cancel”.',
      },
      {
        name: 'change',
        type: '(value: DateRangeValue | undefined) => void',
        description: 'Emitowane po zmianie wartości przez użytkownika.',
      },
      {
        name: 'close',
        type: '() => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „close”.',
      },
      {
        name: 'endChange',
        type: '(value: string | undefined) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „endChange”.',
      },
      {
        name: 'invalid',
        type: '(detail: FormDateRangePickerInvalidDetail) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „invalid”.',
      },
      {
        name: 'monthChange',
        type: '(value: { month: number; year: number }) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „monthChange”.',
      },
      {
        name: 'open',
        type: '() => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „open”.',
      },
      {
        name: 'startChange',
        type: '(value: string | undefined) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „startChange”.',
      },
      {
        name: 'update:value',
        type: '(value: DateRangeValue | undefined) => void',
        description: 'Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value.',
      },
      {
        name: 'update:open',
        type: '(value: boolean) => void',
        description: 'Emitowane po zmianie modelu „open”; przekaż nową wartość do v-model:open.',
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
          'Konfiguruje właściwość „allow off step” komponentu. Property JavaScript: allowOffStep. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'can-erase',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Pokazuje akcję pozwalającą wyczyścić bieżącą wartość. Property JavaScript: canErase. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'confirm',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „confirm” komponentu. Property JavaScript: confirm. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'date-format',
        type: "'iso' | 'locale'",
        required: false,
        default: 'locale',
        description:
          'Konfiguruje właściwość „date format” komponentu. Property JavaScript: dateFormat. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        description:
          'Dodatkowy opis objaśniający zawartość albo stan komponentu. Property JavaScript: description. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description:
          'Wyłącza komponent i blokuje jego interakcje. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        description:
          'Komunikat błędu powiązany z polem lub operacją. Property JavaScript: error. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'format',
        type: "'12h' | '24h'",
        required: false,
        default: '24h',
        description:
          'Konfiguruje właściwość „format” komponentu. Property JavaScript: format. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'hour-step',
        type: 'number',
        required: false,
        default: '1',
        description:
          'Konfiguruje właściwość „hour step” komponentu. Property JavaScript: hourStep. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'id',
        type: 'string',
        required: true,
        description:
          'Unikalny identyfikator elementu w dokumencie. Property JavaScript: id. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'is-date-time-disabled',
        type: '(value: LocalDateTimeValue) => boolean',
        required: false,
        description:
          'Konfiguruje właściwość „is date time disabled” komponentu. Property JavaScript: isDateTimeDisabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description:
          'Widoczna etykieta opisująca element lub pole formularza. Property JavaScript: label. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'layout',
        type: "'side-by-side' | 'stacked'",
        required: false,
        default: 'side-by-side',
        description:
          'Konfiguruje właściwość „layout” komponentu. Property JavaScript: layout. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Włącza stan ładowania i informuje o trwającej operacji. Property JavaScript: loading. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loading-label',
        type: 'string',
        required: false,
        default: 'Ładowanie wyboru daty i czasu',
        description:
          'Dostępny komunikat opisujący trwającą operację. Property JavaScript: loadingLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'locale',
        type: 'string',
        required: false,
        default: 'pl-PL',
        description:
          'Konfiguruje właściwość „locale” komponentu. Property JavaScript: locale. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'max',
        type: 'LocalDateTimeValue',
        required: false,
        description:
          'Maksymalna dozwolona wartość albo szerokość. Property JavaScript: max. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'min',
        type: 'LocalDateTimeValue',
        required: false,
        description:
          'Minimalna dozwolona wartość. Property JavaScript: min. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'minute-step',
        type: 'number',
        required: false,
        default: '5',
        description:
          'Konfiguruje właściwość „minute step” komponentu. Property JavaScript: minuteStep. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description:
          'Nazwa pola używana przez formularz lub nazwa zasobu. Property JavaScript: name. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'panel-aria-label',
        type: 'string',
        required: false,
        default: 'Wybierz datę i czas',
        description:
          'Konfiguruje właściwość „panel aria label” komponentu. Property JavaScript: panelAriaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: '',
        description:
          'Tekst pomocniczy widoczny przed wprowadzeniem wartości. Property JavaScript: placeholder. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'placement',
        type: "'top' | 'bottom'",
        required: false,
        default: 'bottom',
        description:
          'Konfiguruje właściwość „placement” komponentu. Property JavaScript: placement. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description:
          'Ustawia komponent w trybie tylko do odczytu. Property JavaScript: readonly. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description:
          'Oznacza wartość jako wymaganą. Property JavaScript: required. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'second-step',
        type: 'number',
        required: false,
        default: '5',
        description:
          'Konfiguruje właściwość „second step” komponentu. Property JavaScript: secondStep. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'show-seconds',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „show seconds” komponentu. Property JavaScript: showSeconds. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'show-time-zone',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „show time zone” komponentu. Property JavaScript: showTimeZone. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'time-zone',
        type: 'string',
        required: false,
        description:
          'Konfiguruje właściwość „time zone” komponentu. Property JavaScript: timeZone. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'variant',
        type: "'single-input' | 'split-input'",
        required: false,
        default: 'single-input',
        description:
          'Wariant wizualny komponentu. Property JavaScript: variant. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'LocalDateTimeValue | undefined',
        required: false,
        description:
          'Kontrolowana właściwość value; synchronizuj ją przez zdarzenie update:value. Property JavaScript: value. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Kontrolowana właściwość open; synchronizuj ją przez zdarzenie update:open. Property JavaScript: open. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'apply',
        type: '(value: LocalDateTimeValue) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „apply”.',
      },
      {
        name: 'cancel',
        type: '() => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „cancel”.',
      },
      {
        name: 'change',
        type: '(value: LocalDateTimeValue | undefined) => void',
        description: 'Emitowane po zmianie wartości przez użytkownika.',
      },
      {
        name: 'close',
        type: '() => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „close”.',
      },
      {
        name: 'dateChange',
        type: '(date: string | undefined) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „dateChange”.',
      },
      {
        name: 'invalid',
        type: '(detail: FormDateTimePickerInvalidDetail) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „invalid”.',
      },
      {
        name: 'open',
        type: '() => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „open”.',
      },
      {
        name: 'timeChange',
        type: '(time: string | undefined) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „timeChange”.',
      },
      {
        name: 'update:value',
        type: '(value: LocalDateTimeValue | undefined) => void',
        description: 'Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value.',
      },
      {
        name: 'update:open',
        type: '(value: boolean) => void',
        description: 'Emitowane po zmianie modelu „open”; przekaż nową wartość do v-model:open.',
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
        name: 'clear-label',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „clear-label” konfigurujący komponent FormField.',
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
      {
        name: 'aria-describedby',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „aria-describedby” konfigurujący komponent FormField.',
      },
      {
        name: 'aria-invalid',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „aria-invalid” konfigurujący komponent FormField.',
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
        name: 'id',
        type: 'string',
        required: false,
        description: 'Unikalny identyfikator elementu w dokumencie.',
      },
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
          'Konfiguruje właściwość „allowed types” komponentu. Property JavaScript: allowedTypes. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza komponent i blokuje jego interakcje. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'max-file-size',
        type: 'number',
        required: false,
        default: '5 * 1024 * 1024',
        description:
          'Konfiguruje właściwość „max file size” komponentu. Property JavaScript: maxFileSize. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'variant',
        type: "'primary' | 'danger'",
        required: false,
        default: 'primary',
        description:
          'Wariant wizualny komponentu. Property JavaScript: variant. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        default: 'undefined',
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'value-mode',
        type: "'object' | 'file'",
        required: false,
        default: 'object',
        description:
          'Konfiguruje właściwość „value mode” komponentu. Property JavaScript: valueMode. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'file',
        type: 'FormFileUploadValue | File | undefined',
        required: false,
        description:
          'Kontrolowana właściwość file; synchronizuj ją przez zdarzenie update:file. Property JavaScript: file. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'on:remove',
        type: '() => void',
        description: 'Emitowane po wybraniu akcji usunięcia.',
      },
      {
        name: 'update:file',
        type: '(value: FormFileUploadValue | File | undefined) => void',
        description: 'Emitowane po zmianie modelu „file”; przekaż nową wartość do v-model:file.',
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
          'Konfiguruje właściwość „allowed types” komponentu. Property JavaScript: allowedTypes. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'context',
        type: 'string',
        required: false,
        default: 'undefined',
        description:
          'Konfiguruje właściwość „context” komponentu. Property JavaScript: context. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza komponent i blokuje jego interakcje. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'max-file-size',
        type: 'number',
        required: false,
        default: '5 * 1024 * 1024',
        description:
          'Konfiguruje właściwość „max file size” komponentu. Property JavaScript: maxFileSize. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'max-files',
        type: 'number',
        required: false,
        default: '4',
        description:
          'Konfiguruje właściwość „max files” komponentu. Property JavaScript: maxFiles. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        default: 'undefined',
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'files',
        type: 'File[]',
        required: true,
        description:
          'Kontrolowana właściwość files; synchronizuj ją przez zdarzenie update:files. Property JavaScript: files. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'update:files',
        type: '(value: File[]) => void',
        description: 'Emitowane po zmianie modelu „files”; przekaż nową wartość do v-model:files.',
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
      {
        name: 'type',
        type: 'string',
        required: false,
        description: 'Wariant funkcjonalny lub wizualny komponentu.',
      },
      {
        name: 'autocomplete',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „autocomplete” konfigurujący komponent FormInput.',
      },
      {
        name: 'pattern',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „pattern” konfigurujący komponent FormInput.',
      },
      {
        name: 'form',
        type: 'string',
        required: false,
        description: 'Identyfikator natywnego formularza będącego właścicielem kontrolki.',
      },
      {
        name: 'inputmode',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „inputmode” konfigurujący komponent FormInput.',
      },
      {
        name: 'minlength',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „minlength” konfigurujący komponent FormInput.',
      },
      {
        name: 'maxlength',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „maxlength” konfigurujący komponent FormInput.',
      },
      {
        name: 'multiple',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „multiple” konfigurujący komponent FormInput.',
      },
      {
        name: 'size',
        type: 'string',
        required: false,
        description: 'Wariant rozmiaru komponentu.',
      },
      {
        name: 'spellcheck',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „spellcheck” konfigurujący komponent FormInput.',
      },
      {
        name: 'autocapitalize',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „autocapitalize” konfigurujący komponent FormInput.',
      },
      {
        name: 'enterkeyhint',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „enterkeyhint” konfigurujący komponent FormInput.',
      },
      {
        name: 'title',
        type: 'string',
        required: false,
        description: 'Główny tytuł prezentowany w komponencie.',
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
        description: 'Atrybut HTML „aria-labelledby” konfigurujący komponent FormInput.',
      },
      {
        name: 'aria-describedby',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „aria-describedby” konfigurujący komponent FormInput.',
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
          'Unikalny identyfikator elementu w dokumencie. Property JavaScript: id. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'can-erase',
        type: 'boolean',
        required: false,
        description:
          'Pokazuje akcję pozwalającą wyczyścić bieżącą wartość. Property JavaScript: canErase. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'after',
        type: 'string',
        required: false,
        description:
          'Treść wyświetlana za właściwą wartością pola. Property JavaScript: after. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'before',
        type: 'string',
        required: false,
        description:
          'Treść wyświetlana przed właściwą wartością pola. Property JavaScript: before. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description:
          'Nazwa pola używana przez formularz lub nazwa zasobu. Property JavaScript: name. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description:
          'Widoczna etykieta opisująca element lub pole formularza. Property JavaScript: label. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'icon-before',
        type: 'string',
        required: false,
        description:
          'Nazwa ikony wyświetlanej przed treścią pola. Property JavaScript: iconBefore. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description:
          'Oznacza wartość jako wymaganą. Property JavaScript: required. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        description:
          'Tekst pomocniczy widoczny przed wprowadzeniem wartości. Property JavaScript: placeholder. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'labels',
        type: 'Partial<SelectLabels>',
        required: false,
        description:
          'Konfiguruje właściwość „labels” komponentu. Property JavaScript: labels. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'value-mode',
        type: "'value' | 'label'",
        required: false,
        default: 'value',
        description:
          'Value is the default; label preserves the pre-3.0 Vue/WC model contract. Property JavaScript: valueMode. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'virtual',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Render only visible fixed-height options for large lists. Property JavaScript: virtual. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'option-height',
        type: 'number',
        required: false,
        default: '48',
        description:
          'Row height in pixels when virtual is enabled (minimum 24). Property JavaScript: optionHeight. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description:
          'Wyłącza komponent i blokuje jego interakcje. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description:
          'Ustawia komponent w trybie tylko do odczytu. Property JavaScript: readonly. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'searchable',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „searchable” komponentu. Property JavaScript: searchable. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'with-select-all',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „with select all” komponentu. Property JavaScript: withSelectAll. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'options',
        type: 'MultiSelectFieldOption<unknown>[]',
        required: true,
        description:
          'Lista opcji dostępnych do wyświetlenia lub wyboru. Property JavaScript: options. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'placement',
        type: "'top' | 'bottom'",
        required: false,
        description:
          'Konfiguruje właściwość „placement” komponentu. Property JavaScript: placement. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'unknown[] | null | undefined',
        required: true,
        description:
          'Kontrolowana właściwość value; synchronizuj ją przez zdarzenie update:value. Property JavaScript: value. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'on:remove',
        type: '() => void',
        description: 'Emitowane po wybraniu akcji usunięcia.',
      },
      {
        name: 'update:value',
        type: '(value: unknown[] | null | undefined) => void',
        description: 'Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value.',
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
          'Unikalny identyfikator elementu w dokumencie. Property JavaScript: id. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'can-erase',
        type: 'boolean',
        required: false,
        description:
          'Pokazuje akcję pozwalającą wyczyścić bieżącą wartość. Property JavaScript: canErase. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'after',
        type: 'string',
        required: false,
        description:
          'Treść wyświetlana za właściwą wartością pola. Property JavaScript: after. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'before',
        type: 'string',
        required: false,
        description:
          'Treść wyświetlana przed właściwą wartością pola. Property JavaScript: before. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description:
          'Nazwa pola używana przez formularz lub nazwa zasobu. Property JavaScript: name. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description:
          'Widoczna etykieta opisująca element lub pole formularza. Property JavaScript: label. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'icon-before',
        type: 'string',
        required: false,
        description:
          'Nazwa ikony wyświetlanej przed treścią pola. Property JavaScript: iconBefore. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'icon-after',
        type: 'string',
        required: false,
        description:
          'Nazwa ikony wyświetlanej za treścią pola. Property JavaScript: iconAfter. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'max',
        type: 'number',
        required: false,
        description:
          'Maksymalna dozwolona wartość albo szerokość. Property JavaScript: max. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'min',
        type: 'number',
        required: false,
        description:
          'Minimalna dozwolona wartość. Property JavaScript: min. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'step',
        type: 'number',
        required: false,
        description:
          'Krok zmiany wartości liczbowej. Property JavaScript: step. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description:
          'Oznacza wartość jako wymaganą. Property JavaScript: required. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: 'wpisz',
        description:
          'Tekst pomocniczy widoczny przed wprowadzeniem wartości. Property JavaScript: placeholder. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description:
          'Wyłącza komponent i blokuje jego interakcje. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description:
          'Ustawia komponent w trybie tylko do odczytu. Property JavaScript: readonly. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'is-range-visible',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „is range visible” komponentu. Property JavaScript: isRangeVisible. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'number | undefined | string',
        required: true,
        description:
          'Kontrolowana właściwość value; synchronizuj ją przez zdarzenie update:value. Property JavaScript: value. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'update:value',
        type: '(value: number | undefined | string) => void',
        description: 'Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value.',
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
          'Unikalny identyfikator grupy. Property JavaScript: id. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'name',
        type: 'string',
        required: false,
        description:
          'Nazwa wartości wysyłanej z natywnym formularzem. Property JavaScript: name. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'form',
        type: 'string',
        required: false,
        description:
          'Identyfikator formularza właściciela. Property JavaScript: form. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'length',
        type: 'number',
        required: false,
        default: '6',
        description:
          'Liczba komórek kodu od 1 do 32. Property JavaScript: length. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'type',
        type: "'numeric' | 'alphanumeric'",
        required: false,
        default: 'numeric',
        description:
          'Zbiór znaków akceptowanych przez komponent. Property JavaScript: type. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'mask',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Maskuje wizualnie wpisane znaki. Property JavaScript: mask. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'size',
        type: "'s' | 'm' | 'l'",
        required: false,
        default: 'm',
        description:
          'Rozmiar wizualny komórek; cel dotykowy zawsze ma minimum 44 px. Property JavaScript: size. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'pattern',
        type: 'string',
        required: false,
        description:
          'Dodatkowy wzorzec wyrażenia regularnego sprawdzany dla każdego znaku. Property JavaScript: pattern. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'transform',
        type: 'FormPinInputTransform',
        required: false,
        default: 'none',
        description:
          'Transformacja wykonywana przed walidacją znaku. Property JavaScript: transform. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'separator-every',
        type: 'number',
        required: false,
        default: '0',
        description:
          'Co ile komórek renderowany jest separator; 0 wyłącza grupowanie. Property JavaScript: separatorEvery. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'autocomplete',
        type: 'string',
        required: false,
        default: 'one-time-code',
        description:
          'Wartość autocomplete pierwszej komórki. Property JavaScript: autocomplete. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'inputmode',
        type: "'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'",
        required: false,
        description:
          'Podpowiedź klawiatury ekranowej. Domyślnie wynika z typu. Property JavaScript: inputmode. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'auto-focus',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Ustawia początkowy fokus na pierwszej nieuzupełnionej komórce. Property JavaScript: autoFocus. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza kontrolkę. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Blokuje edycję bez usuwania kontrolki z kolejności fokusu. Property JavaScript: readonly. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Blokuje edycję i udostępnia stan zajętości. Property JavaScript: loading. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Oznacza każdą komórkę jako wymaganą. Property JavaScript: required. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        default: '',
        description:
          'Widoczna etykieta całej grupy. Property JavaScript: label. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        default: '',
        description:
          'Tekst instrukcji powiązany z grupą i komórkami. Property JavaScript: description. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        default: '',
        description:
          'Komunikat błędu powiązany przez aria-describedby. Property JavaScript: error. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: '',
        description:
          'Dostępna nazwa używana, gdy nie ma widocznej etykiety. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loading-label',
        type: 'string',
        required: false,
        default: 'Trwa przygotowywanie pola kodu',
        description:
          'Tekst stanu ładowania dla technologii asystujących. Property JavaScript: loadingLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator używany w testach. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string',
        required: false,
        default: '',
        description:
          'Kontrolowana właściwość value; synchronizuj ją przez zdarzenie update:value. Property JavaScript: value. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'change',
        type: '(value: string, nativeEvent: Event) => void',
        description: 'Emitowane po każdej zaakceptowanej zmianie kodu.',
      },
      {
        name: 'complete',
        type: '(value: string, nativeEvent: Event) => void',
        description: 'Emitowane raz dla każdej nowej, kompletnej wartości.',
      },
      {
        name: 'invalidInput',
        type: '(detail: FormPinInputInvalidDetail, nativeEvent: Event) => void',
        description: 'Emitowane po odrzuceniu znaku, wzorca, transformacji lub nadmiaru.',
      },
      {
        name: 'focus',
        type: '(nativeEvent: FocusEvent, index: number) => void',
        description: 'Emitowane po wejściu fokusu do komórki.',
      },
      {
        name: 'blur',
        type: '(nativeEvent: FocusEvent) => void',
        description: 'Emitowane po opuszczeniu całej grupy komórek.',
      },
      {
        name: 'update:value',
        type: '(value: string) => void',
        description: 'Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value.',
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
          'Unikalny identyfikator elementu w dokumencie. Property JavaScript: id. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description:
          'Nazwa pola używana przez formularz lub nazwa zasobu. Property JavaScript: name. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'option-value',
        type: 'string | number | boolean',
        required: true,
        description:
          'Konfiguruje właściwość „option value” komponentu. Property JavaScript: optionValue. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'is-valid',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „is valid” komponentu. Property JavaScript: isValid. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description:
          'Oznacza wartość jako wymaganą. Property JavaScript: required. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description:
          'Wyłącza komponent i blokuje jego interakcje. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string | number | boolean | undefined',
        required: true,
        description:
          'Kontrolowana właściwość value; synchronizuj ją przez zdarzenie update:value. Property JavaScript: value. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'update:value',
        type: '(value: string | number | boolean | undefined) => void',
        description: 'Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value.',
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
          'Unikalny identyfikator kontrolki. Property JavaScript: id. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'name',
        type: 'string',
        required: false,
        description:
          'Nazwa wartości wysyłanej z formularzem. Property JavaScript: name. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'form',
        type: 'string',
        required: false,
        description:
          'Identyfikator formularza właściciela. Property JavaScript: form. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'max',
        type: 'number',
        required: false,
        default: '5',
        description:
          'Najwyższa ocena; wartości są normalizowane do zakresu 1–100. Property JavaScript: max. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'step',
        type: '0.5 | 1',
        required: false,
        default: '1',
        description:
          'Precyzja pełnej lub połówkowej oceny. Property JavaScript: step. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'allow-clear',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Pozwala wyczyścić ocenę klawiszem Delete/Backspace lub ponownym kliknięciem. Property JavaScript: allowClear. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyświetla nietabowalny odczyt zamiast kontrolki. Property JavaScript: readonly. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza kontrolkę. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Empty selection blocks native form submission; readonly and disabled are exempt. Property JavaScript: required. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'labels',
        type: 'RatingLabels',
        required: false,
        default: '{}',
        description:
          "Mapa tekstowych opisów indeksowana wartością, np. `{ '4': 'Dobra' }`. Property JavaScript: labels. Wartości złożone i funkcje ustawiaj jako properties.",
      },
      {
        name: 'get-label',
        type: 'RatingLabelGetter',
        required: false,
        description:
          'Funkcja tworząca tekstowy opis wartości. Property JavaScript: getLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'icon',
        type: 'string',
        required: false,
        default: 'core/star',
        description:
          'Nazwa ikony z katalogu PeaUI. Property JavaScript: icon. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'size',
        type: "'s' | 'm' | 'l'",
        required: false,
        default: 'm',
        description:
          'Rozmiar wizualny ikon; cel dotykowy zachowuje co najmniej 44 px. Property JavaScript: size. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        default: '',
        description:
          'Widoczna etykieta pola. Property JavaScript: label. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        default: '',
        description:
          'Tekst pomocniczy powiązany przez aria-describedby. Property JavaScript: description. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        default: '',
        description:
          'Komunikat błędu powiązany przez aria-describedby i aria-invalid. Property JavaScript: error. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: '',
        description:
          'Dostępna nazwa, gdy nie ma widocznej etykiety. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'empty-label',
        type: 'string',
        required: false,
        default: 'Brak oceny',
        description:
          'Lokalizowany tekst używany dla pustej oceny. Property JavaScript: emptyLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'locale',
        type: 'string',
        required: false,
        default: 'pl-PL',
        description:
          'Locale używane do formatowania wartości połówkowych. Property JavaScript: locale. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'show-value-label',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Pokazuje widoczny tekst bieżącej wartości. Property JavaScript: showValueLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'number | null',
        required: false,
        default: 'null',
        description:
          'Kontrolowana właściwość value; synchronizuj ją przez zdarzenie update:value. Property JavaScript: value. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'change',
        type: '(value: RatingValue, nativeEvent: Event) => void',
        description: 'Emitowane po zatwierdzeniu wartości.',
      },
      {
        name: 'previewChange',
        type: '(value: RatingValue) => void',
        description: 'Emitowane wyłącznie dla podglądu wskaźnikiem; null oznacza jego koniec.',
      },
      {
        name: 'clear',
        type: '(nativeEvent: Event) => void',
        description: 'Emitowane po jawnym wyczyszczeniu wartości.',
      },
      {
        name: 'focus',
        type: '(nativeEvent: FocusEvent) => void',
        description: 'Emitowane przy ustawieniu fokusu na pojedynczym suwaku.',
      },
      {
        name: 'blur',
        type: '(nativeEvent: FocusEvent) => void',
        description: 'Emitowane po opuszczeniu pojedynczego suwaka.',
      },
      {
        name: 'update:value',
        type: '(value: number | null) => void',
        description: 'Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value.',
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
          'Unikalny identyfikator elementu w dokumencie. Property JavaScript: id. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'can-erase',
        type: 'boolean',
        required: false,
        description:
          'Pokazuje akcję pozwalającą wyczyścić bieżącą wartość. Property JavaScript: canErase. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'after',
        type: 'string',
        required: false,
        description:
          'Treść wyświetlana za właściwą wartością pola. Property JavaScript: after. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'before',
        type: 'string',
        required: false,
        description:
          'Treść wyświetlana przed właściwą wartością pola. Property JavaScript: before. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description:
          'Nazwa pola używana przez formularz lub nazwa zasobu. Property JavaScript: name. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description:
          'Widoczna etykieta opisująca element lub pole formularza. Property JavaScript: label. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'icon-before',
        type: 'string',
        required: false,
        description:
          'Nazwa ikony wyświetlanej przed treścią pola. Property JavaScript: iconBefore. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description:
          'Oznacza wartość jako wymaganą. Property JavaScript: required. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'placement',
        type: "'top' | 'bottom'",
        required: false,
        description:
          'Preferred list placement. The list flips when the preferred side has insufficient space. Property JavaScript: placement. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        description:
          'Tekst pomocniczy widoczny przed wprowadzeniem wartości. Property JavaScript: placeholder. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'labels',
        type: 'Partial<SelectLabels>',
        required: false,
        description:
          'Konfiguruje właściwość „labels” komponentu. Property JavaScript: labels. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'value-mode',
        type: "'value' | 'label'",
        required: false,
        default: 'value',
        description:
          'Value is the default; label preserves the pre-3.0 Vue/WC model contract. Property JavaScript: valueMode. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'virtual',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Render only visible fixed-height options for large lists. Property JavaScript: virtual. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'option-height',
        type: 'number',
        required: false,
        default: '48',
        description:
          'Row height in pixels when virtual is enabled (minimum 24). Property JavaScript: optionHeight. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description:
          'Wyłącza komponent i blokuje jego interakcje. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description:
          'Ustawia komponent w trybie tylko do odczytu. Property JavaScript: readonly. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'can-write',
        type: 'boolean',
        required: false,
        description:
          'Konfiguruje właściwość „can write” komponentu. Property JavaScript: canWrite. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'searchable',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „searchable” komponentu. Property JavaScript: searchable. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'size',
        type: "'xs' | 's' | 'm' | 'l'",
        required: false,
        default: 'm',
        description:
          'Wariant rozmiaru komponentu. Property JavaScript: size. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'options',
        type: 'SelectFieldOption<unknown>[]',
        required: true,
        description:
          'Lista opcji dostępnych do wyświetlenia lub wyboru. Property JavaScript: options. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'unknown',
        required: true,
        description:
          'Kontrolowana właściwość value; synchronizuj ją przez zdarzenie update:value. Property JavaScript: value. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'on:remove',
        type: '() => void',
        description: 'Emitowane po wybraniu akcji usunięcia.',
      },
      {
        name: 'update:value',
        type: '(value: unknown) => void',
        description: 'Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value.',
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
          'Unikalny identyfikator kontrolki. Generowany automatycznie, jeśli nie zostanie podany. Property JavaScript: id. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'name',
        type: 'string',
        required: false,
        description:
          'Nazwa pola używana podczas natywnego wysyłania formularza. Property JavaScript: name. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'form',
        type: 'string',
        required: false,
        description:
          'Identyfikator formularza właściciela, również gdy kontrolka znajduje się poza formularzem. Property JavaScript: form. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        default: '',
        description:
          'Widoczna etykieta przełącznika. Property JavaScript: label. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        default: '',
        description:
          'Tekst pomocniczy powiązany z kontrolką przez aria-describedby. Property JavaScript: description. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        default: '',
        description:
          'Komunikat błędu powiązany z kontrolką i aria-invalid. Property JavaScript: error. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'true-value',
        type: 'Value',
        required: false,
        description:
          'Wartość modelu reprezentująca stan włączony. Property JavaScript: trueValue. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'false-value',
        type: 'Value',
        required: false,
        description:
          'Wartość modelu reprezentująca stan wyłączony. Property JavaScript: falseValue. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'size',
        type: "'s' | 'm' | 'l'",
        required: false,
        default: 'm',
        description:
          'Rozmiar wizualny szyny; obszar dotykowy zawsze ma co najmniej 44 px. Property JavaScript: size. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'label-position',
        type: "'start' | 'end'",
        required: false,
        default: 'end',
        description:
          'Pozycja etykiety względem szyny. Property JavaScript: labelPosition. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza kontrolkę i usuwa ją z kolejności fokusu. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Blokuje zmianę, zachowując kontrolkę w kolejności fokusu. Property JavaScript: readonly. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Blokuje zmianę i udostępnia stan zajętości technologiom asystującym. Property JavaScript: loading. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Oznacza pole jako wymagane dla formularza i technologii asystujących. Property JavaScript: required. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'show-state-label',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Pokazuje tekstowy stan obok szyny bez polegania wyłącznie na kolorze. Property JavaScript: showStateLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'on-label',
        type: 'string',
        required: false,
        default: 'Włączone',
        description:
          'Tekst widoczny dla stanu włączonego. Property JavaScript: onLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'off-label',
        type: 'string',
        required: false,
        default: 'Wyłączone',
        description:
          'Tekst widoczny dla stanu wyłączonego. Property JavaScript: offLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: '',
        description:
          'Dostępna nazwa używana, gdy nie ma widocznej etykiety. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loading-label',
        type: 'string',
        required: false,
        default: 'Trwa aktualizowanie ustawienia',
        description:
          'Dostępny komunikat stanu ładowania. Property JavaScript: loadingLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator używany w testach automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'Value',
        required: true,
        description:
          'Kontrolowana właściwość value; synchronizuj ją przez zdarzenie update:value. Property JavaScript: value. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'change',
        type: '(value: Value, nativeEvent: Event) => void',
        description: 'Emitowane po zmianie wraz z nową wartością domenową i natywnym zdarzeniem.',
      },
      {
        name: 'focus',
        type: '(nativeEvent: FocusEvent) => void',
        description: 'Emitowane po ustawieniu fokusu na natywnej kontrolce.',
      },
      {
        name: 'blur',
        type: '(nativeEvent: FocusEvent) => void',
        description: 'Emitowane po opuszczeniu natywnej kontrolki.',
      },
      {
        name: 'update:value',
        type: '(value: Value) => void',
        description: 'Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value.',
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
          'Unikalny identyfikator pola. Property JavaScript: id. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'name',
        type: 'string',
        required: false,
        description:
          'Nazwa używana przez natywny formularz; każdy tag tworzy osobną wartość. Property JavaScript: name. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'form',
        type: 'string',
        required: false,
        description:
          'Identyfikator formularza właściciela. Property JavaScript: form. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        default: '',
        description:
          'Widoczna etykieta pola. Property JavaScript: label. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        default: '',
        description:
          'Tekst pomocniczy powiązany z polem. Property JavaScript: description. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        default: '',
        description:
          'Komunikat błędu powiązany przez aria-describedby. Property JavaScript: error. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: 'Dodaj tag',
        description:
          'Placeholder edytora. Property JavaScript: placeholder. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: '',
        description:
          'Dostępna nazwa, gdy nie podano widocznej etykiety. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'layout',
        type: "'inline' | 'stacked'",
        required: false,
        default: 'inline',
        description:
          'Układ tagów i edytora. Property JavaScript: layout. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'mode',
        type: "'freeform' | 'suggestions-only'",
        required: false,
        default: 'freeform',
        description:
          'Tryb swobodny albo ograniczony do sugestii. Property JavaScript: mode. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'allow-create',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Pozwala utworzyć tag spoza listy sugestii. Property JavaScript: allowCreate. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'allow-duplicates',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Pozwala dodać tag o tym samym kluczu więcej niż raz. Property JavaScript: allowDuplicates. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'max',
        type: 'number',
        required: false,
        description:
          'Maksymalna liczba tagów. Property JavaScript: max. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'separators',
        type: 'readonly string[]',
        required: false,
        default: "[',', ';', '\\n']",
        description:
          'Separatory używane podczas wpisywania i wklejania. Property JavaScript: separators. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'suggestions',
        type: 'readonly FormTagsInputTag[]',
        required: false,
        default: '[]',
        description:
          'Kontrolowana lista sugestii. Property JavaScript: suggestions. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'suggestion-provider',
        type: 'FormTagsInputSuggestionProvider',
        required: false,
        description:
          'Opcjonalny dostawca sugestii z anulowaniem nieaktualnych zapytań. Property JavaScript: suggestionProvider. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Zewnętrzny stan ładowania sugestii. Property JavaScript: loading. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'placement',
        type: "'auto' | 'top' | 'bottom'",
        required: false,
        default: 'auto',
        description:
          'Położenie panelu sugestii. Property JavaScript: placement. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'normalize-tag',
        type: 'FormTagsInputNormalizer',
        required: false,
        description:
          'Normalizuje tekst przed walidacją. Property JavaScript: normalizeTag. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'validate-tag',
        type: 'FormTagsInputValidator',
        required: false,
        description:
          'Waliduje pojedynczy tag przed zmianą modelu. Property JavaScript: validateTag. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'get-tag-key',
        type: 'FormTagsInputKeyGetter',
        required: false,
        description:
          'Wyznacza stabilny klucz i regułę duplikatów. Property JavaScript: getTagKey. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'serialize-tag',
        type: 'FormTagsInputSerializer',
        required: false,
        description:
          'Serializuje wartości do natywnych pól formularza. Property JavaScript: serializeTag. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled-tags',
        type: 'readonly (string | number)[]',
        required: false,
        default: '[]',
        description:
          'Klucze lub etykiety tagów, których nie można edytować ani usunąć. Property JavaScript: disabledTags. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza całą kontrolkę. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Pozwala odczytać i kopiować zawartość bez jej zmiany. Property JavaScript: readonly. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Oznacza pole jako wymagane. Property JavaScript: required. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loading-label',
        type: 'string',
        required: false,
        default: 'Ładowanie sugestii',
        description:
          'Tekst prezentowany podczas ładowania sugestii. Property JavaScript: loadingLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'empty-label',
        type: 'string',
        required: false,
        default: 'Brak pasujących sugestii',
        description:
          'Tekst pustego wyniku wyszukiwania. Property JavaScript: emptyLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator używany w testach. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'FormTagsInputTag[]',
        required: false,
        default: '[]',
        description:
          'Kontrolowana właściwość value; synchronizuj ją przez zdarzenie update:value. Property JavaScript: value. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'input-value',
        type: 'string',
        required: false,
        default: '',
        description:
          'Kontrolowana właściwość inputValue; synchronizuj ją przez zdarzenie update:inputValue. Property JavaScript: inputValue. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'add',
        type: '(tag: FormTagsInputTag, index: number, nativeEvent: Event) => void',
        description: 'Emitowane po dodaniu zaakceptowanego tagu.',
      },
      {
        name: 'remove',
        type: '(tag: FormTagsInputTag, index: number, nativeEvent: Event) => void',
        description: 'Emitowane po usunięciu tagu.',
      },
      {
        name: 'edit',
        type: '(previous: FormTagsInputTag, next: FormTagsInputTag, index: number, nativeEvent: Event) => void',
        description: 'Emitowane po zatwierdzeniu edycji tagu.',
      },
      {
        name: 'invalidTag',
        type: '(detail: FormTagsInputInvalidDetail, nativeEvent: Event) => void',
        description: 'Emitowane dla każdej odrzuconej wartości.',
      },
      {
        name: 'search',
        type: '(query: string, requestId: number) => void',
        description: 'Emitowane przy zmianie tekstu wyszukiwania.',
      },
      {
        name: 'maxReached',
        type: '(max: number, nativeEvent: Event) => void',
        description: 'Emitowane, gdy próba dodania przekracza limit.',
      },
      {
        name: 'update:value',
        type: '(value: FormTagsInputTag[]) => void',
        description: 'Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value.',
      },
      {
        name: 'update:inputValue',
        type: '(value: string) => void',
        description:
          'Emitowane po zmianie modelu „inputValue”; przekaż nową wartość do v-model:inputValue.',
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
          'Unikalny identyfikator elementu w dokumencie. Property JavaScript: id. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description:
          'Nazwa pola używana przez formularz lub nazwa zasobu. Property JavaScript: name. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'rows',
        type: 'number',
        required: false,
        default: '5',
        description:
          'Konfiguruje właściwość „rows” komponentu. Property JavaScript: rows. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description:
          'Widoczna etykieta opisująca element lub pole formularza. Property JavaScript: label. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'max-length',
        type: 'number',
        required: false,
        description:
          'Maksymalna liczba znaków możliwa do wprowadzenia. Property JavaScript: maxLength. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description:
          'Oznacza wartość jako wymaganą. Property JavaScript: required. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: 'wpisz',
        description:
          'Tekst pomocniczy widoczny przed wprowadzeniem wartości. Property JavaScript: placeholder. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description:
          'Wyłącza komponent i blokuje jego interakcje. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description:
          'Ustawia komponent w trybie tylko do odczytu. Property JavaScript: readonly. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string | undefined',
        required: true,
        description:
          'Kontrolowana właściwość value; synchronizuj ją przez zdarzenie update:value. Property JavaScript: value. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'update:value',
        type: '(value: string | undefined) => void',
        description: 'Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value.',
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
          'Stabilny identyfikator pola i powiązanych elementów ARIA. Property JavaScript: id. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description:
          'Nazwa pola używana przy wysyłaniu formularza. Property JavaScript: name. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description:
          'Widoczna etykieta pola. Property JavaScript: label. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        description:
          'Tekst pomocy wyświetlany pod polem. Property JavaScript: description. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'error',
        type: 'string',
        required: false,
        description:
          'Zewnętrzny komunikat błędu; ma pierwszeństwo przed walidacją wewnętrzną. Property JavaScript: error. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: 'undefined',
        description:
          'Placeholder opisujący oczekiwany format. Property JavaScript: placeholder. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'variant',
        type: "'input' | 'segmented'",
        required: false,
        default: 'input',
        description:
          'Edytowalne pole tekstowe albo zestaw dostępnych segmentów. Property JavaScript: variant. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'panel-mode',
        type: "'dropdown' | 'spinbutton'",
        required: false,
        default: 'dropdown',
        description:
          'Lista opcji albo kompaktowe kontrolki spinbutton w panelu. Property JavaScript: panelMode. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'placement',
        type: "'top' | 'bottom'",
        required: false,
        default: 'bottom',
        description:
          'Preferowane położenie panelu; komponent może odwrócić je przy krawędzi viewportu. Property JavaScript: placement. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'format',
        type: "'12h' | '24h'",
        required: false,
        default: '24h',
        description:
          'Format prezentacji. Model zawsze pozostaje wartością 24-godzinną. Property JavaScript: format. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'show-seconds',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Dodaje segment sekund do pola, modelu i panelu. Property JavaScript: showSeconds. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'hour-step',
        type: 'number',
        required: false,
        default: '1',
        description:
          'Krok godzin wykorzystywany przez opcje i klawiaturę. Property JavaScript: hourStep. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'minute-step',
        type: 'number',
        required: false,
        default: '5',
        description:
          'Krok minut wykorzystywany przez opcje i klawiaturę. Property JavaScript: minuteStep. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'second-step',
        type: 'number',
        required: false,
        default: '5',
        description:
          'Krok sekund wykorzystywany przez opcje i klawiaturę. Property JavaScript: secondStep. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'min',
        type: 'string',
        required: false,
        description:
          'Najwcześniejsza dozwolona wartość w formacie HH:mm[:ss]. Property JavaScript: min. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'max',
        type: 'string',
        required: false,
        description:
          'Najpóźniejsza dozwolona wartość w formacie HH:mm[:ss]. Property JavaScript: max. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'allow-off-step',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Pozwala zatwierdzić ręcznie wpisaną wartość, która nie leży na siatce kroków. Property JavaScript: allowOffStep. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'locale',
        type: 'string',
        required: false,
        default: 'pl-PL',
        description:
          'Locale używany do prezentacji okresu dnia w formacie 12h. Property JavaScript: locale. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'parse',
        type: 'TimePickerParser',
        required: false,
        description:
          'Opcjonalny parser tekstu zastępujący parser wbudowany. Property JavaScript: parse. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'format-value',
        type: 'TimePickerFormatter',
        required: false,
        description:
          'Opcjonalny formatter prezentacji zastępujący formatter wbudowany. Property JavaScript: formatValue. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'can-erase',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Pozwala usunąć bieżącą wartość przyciskiem pola. Property JavaScript: canErase. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Pole musi zawierać poprawną wartość. Property JavaScript: required. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Całkowicie blokuje kontrolkę. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Pozwala odczytać wartość bez jej zmiany. Property JavaScript: readonly. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Blokuje interakcje i udostępnia stan oczekiwania technologiom asystującym. Property JavaScript: loading. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa pola, gdy nie ma widocznej etykiety. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'panel-aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa panelu wyboru czasu. Property JavaScript: panelAriaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'trigger-aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa przycisku panelu w wariancie segmented. Property JavaScript: triggerAriaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loading-label',
        type: 'string',
        required: false,
        default: 'Ładowanie wyboru czasu',
        description:
          'Tekst ogłaszany podczas ładowania. Property JavaScript: loadingLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator używany w testach automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'string | undefined',
        required: false,
        default: 'undefined',
        description:
          'Kontrolowana właściwość value; synchronizuj ją przez zdarzenie update:value. Property JavaScript: value. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Kontrolowana właściwość open; synchronizuj ją przez zdarzenie update:open. Property JavaScript: open. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'change',
        type: '(value: string | undefined, parts: TimePickerParts | undefined) => void',
        description: 'Emitowane po zatwierdzeniu poprawnej wartości.',
      },
      {
        name: 'invalid',
        type: '(detail: TimePickerInvalidDetail) => void',
        description:
          'Emitowane po odrzuceniu pustej, błędnej, poza zakresem lub poza krokiem wartości.',
      },
      {
        name: 'open',
        type: '() => void',
        description: 'Emitowane po faktycznym otwarciu panelu.',
      },
      {
        name: 'close',
        type: '() => void',
        description: 'Emitowane po faktycznym zamknięciu panelu.',
      },
      {
        name: 'update:value',
        type: '(value: string | undefined) => void',
        description: 'Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value.',
      },
      {
        name: 'update:open',
        type: '(value: boolean) => void',
        description: 'Emitowane po zmianie modelu „open”; przekaż nową wartość do v-model:open.',
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
          'Unikalny identyfikator elementu w dokumencie. Property JavaScript: id. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'can-erase',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Pokazuje akcję pozwalającą wyczyścić bieżącą wartość. Property JavaScript: canErase. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'after',
        type: 'string',
        required: false,
        description:
          'Treść wyświetlana za właściwą wartością pola. Property JavaScript: after. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'before',
        type: 'string',
        required: false,
        description:
          'Treść wyświetlana przed właściwą wartością pola. Property JavaScript: before. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        description:
          'Nazwa pola używana przez formularz lub nazwa zasobu. Property JavaScript: name. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description:
          'Widoczna etykieta opisująca element lub pole formularza. Property JavaScript: label. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'icon-before',
        type: 'string',
        required: false,
        description:
          'Nazwa ikony wyświetlanej przed treścią pola. Property JavaScript: iconBefore. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'required',
        type: 'boolean',
        required: false,
        description:
          'Empty selection blocks native form submission; readonly and disabled are exempt. Property JavaScript: required. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: 'wybierz rok',
        description:
          'Tekst pomocniczy widoczny przed wprowadzeniem wartości. Property JavaScript: placeholder. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'range',
        type: 'boolean',
        required: false,
        description:
          'Konfiguruje właściwość „range” komponentu. Property JavaScript: range. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'min-year',
        type: 'number',
        required: false,
        description:
          'Konfiguruje właściwość „min year” komponentu. Property JavaScript: minYear. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'max-year',
        type: 'number',
        required: false,
        description:
          'Konfiguruje właściwość „max year” komponentu. Property JavaScript: maxYear. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description:
          'Wyłącza komponent i blokuje jego interakcje. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        required: false,
        description:
          'Ustawia komponent w trybie tylko do odczytu. Property JavaScript: readonly. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'value',
        type: 'number | YearPickerRangeValue | undefined',
        required: true,
        description:
          'Kontrolowana właściwość value; synchronizuj ją przez zdarzenie update:value. Property JavaScript: value. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'on:remove',
        type: '() => void',
        description: 'Emitowane po wybraniu akcji usunięcia.',
      },
      {
        name: 'update:value',
        type: '(value: number | YearPickerRangeValue | undefined) => void',
        description: 'Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value.',
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
        name: 'download',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „download” konfigurujący komponent CardPanel.',
      },
      {
        name: 'hreflang',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „hreflang” konfigurujący komponent CardPanel.',
      },
      {
        name: 'referrerpolicy',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „referrerpolicy” konfigurujący komponent CardPanel.',
      },
      {
        name: 'ping',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „ping” konfigurujący komponent CardPanel.',
      },
      {
        name: 'type',
        type: 'string',
        required: false,
        description: 'Wariant funkcjonalny lub wizualny komponentu.',
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
          'Dostępna nazwa elementu przekazywana przez aria-label. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'open-label',
        type: 'string',
        required: false,
        default: 'Otwórz tryb pełnoekranowy',
        description:
          'Konfiguruje właściwość „open label” komponentu. Property JavaScript: openLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'close-label',
        type: 'string',
        required: false,
        default: 'Zamknij tryb pełnoekranowy',
        description:
          'Konfiguruje właściwość „close label” komponentu. Property JavaScript: closeLabel. Wartości złożone i funkcje ustawiaj jako properties.',
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
          'Stabilny identyfikator komponentu, relacji ARIA i opcjonalnie zapisanej pozycji. Property JavaScript: id. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'type',
        type: "'native' | 'styled'",
        required: false,
        default: 'styled',
        description:
          'Natywne paski systemowe albo dostępne paski stylowane przez PeaUI. Property JavaScript: type. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'orientation',
        type: "'vertical' | 'horizontal' | 'both'",
        required: false,
        default: 'vertical',
        description:
          'Osie, na których zawartość może być przewijana. Property JavaScript: orientation. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'scrollbar-visibility',
        type: "'auto' | 'always' | 'hover'",
        required: false,
        default: 'auto',
        description:
          'Sposób widoczności stylowanych pasków przewijania. Property JavaScript: scrollbarVisibility. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'scrollbar-size',
        type: 'number',
        required: false,
        default: '10',
        description:
          'Grubość paska w pikselach, ograniczona do zakresu 6–20. Property JavaScript: scrollbarSize. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'auto-hide-delay',
        type: 'number',
        required: false,
        default: '700',
        description:
          'Opóźnienie ukrycia automatycznego paska w milisekundach, maksymalnie 10000. Property JavaScript: autoHideDelay. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'tabindex',
        type: 'number',
        required: false,
        description:
          'Nadpisuje tabindex viewportu. Tryb native domyślnie dodaje przystanek Tab (0). Property JavaScript: tabindex. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa przewijanego regionu. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Blokuje publiczne metody i sterowanie stylowanymi paskami, zachowując natywny scroll. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'restore-position',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Przywraca pozycję po ponownym montażu, gdy przekazano stabilne id. Property JavaScript: restorePosition. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny selektor testowy elementu głównego. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [],
    events: [
      {
        name: 'scroll',
        type: '(detail: ScrollAreaPosition) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „scroll”.',
      },
      {
        name: 'scrollStart',
        type: '(detail: ScrollAreaPosition) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „scrollStart”.',
      },
      {
        name: 'scrollEnd',
        type: '(detail: ScrollAreaPosition) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „scrollEnd”.',
      },
      {
        name: 'reachStart',
        type: '(detail: ScrollAreaEdgeDetail) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „reachStart”.',
      },
      {
        name: 'reachEnd',
        type: '(detail: ScrollAreaEdgeDetail) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „reachEnd”.',
      },
      {
        name: 'resize',
        type: '(detail: ScrollAreaResizeDetail) => void',
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
        name: 'direction',
        type: "'horizontal' | 'vertical'",
        required: false,
        description: 'Atrybut HTML „direction” konfigurujący komponent SectionDivider.',
      },
      {
        name: 'size',
        type: "'s' | 'm' | 'l' | 'xl'",
        required: false,
        description: 'Wariant rozmiaru komponentu.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description: 'Atrybut HTML „data-testid” konfigurujący komponent SectionDivider.',
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
          'Konfiguruje właściwość „items” komponentu. Property JavaScript: items. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'separator',
        type: 'string',
        required: false,
        default: '/',
        description:
          'Konfiguruje właściwość „separator” komponentu. Property JavaScript: separator. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: 'Ścieżka nawigacji',
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [],
    events: [
      {
        name: 'on:navigate',
        type: '(item: BreadcrumbItem) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „on:navigate”.',
      },
    ],
    slots: [],
  },
  {
    category: 'navigation',
    categoryLabel: 'Nawigacja',
    name: 'CommandPalette',
    sourceName: 'CommandPalette',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/navigation/CommandPalette',
    tagName: 'peaui-command-palette',
    status: 'stable',
    props: [
      {
        name: 'commands',
        type: 'readonly CommandPaletteCommand[]',
        required: false,
        default: '[]',
        description:
          'Konfiguruje właściwość „commands” komponentu. Property JavaScript: commands. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'recent-ids',
        type: 'readonly string[]',
        required: false,
        default: '[]',
        description:
          'Konfiguruje właściwość „recent ids” komponentu. Property JavaScript: recentIds. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'shortcut',
        type: 'CommandPaletteShortcut',
        required: false,
        default: "['Mod', 'K']",
        description:
          'Konfiguruje właściwość „shortcut” komponentu. Property JavaScript: shortcut. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'register-shortcut',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „register shortcut” komponentu. Property JavaScript: registerShortcut. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'filter',
        type: 'CommandPaletteFilter',
        required: false,
        description:
          'Konfiguruje właściwość „filter” komponentu. Property JavaScript: filter. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'groups',
        type: 'readonly CommandPaletteGroup[]',
        required: false,
        default: '[]',
        description:
          'Konfiguruje właściwość „groups” komponentu. Property JavaScript: groups. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Włącza stan ładowania i informuje o trwającej operacji. Property JavaScript: loading. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        default: 'Type a command',
        description:
          'Tekst pomocniczy widoczny przed wprowadzeniem wartości. Property JavaScript: placeholder. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: 'Command palette',
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'close-on-execute',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „close on execute” komponentu. Property JavaScript: closeOnExecute. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'mode',
        type: "'modal' | 'embedded'",
        required: false,
        default: 'modal',
        description:
          'Konfiguruje właściwość „mode” komponentu. Property JavaScript: mode. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'virtual',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „virtual” komponentu. Property JavaScript: virtual. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'virtual-threshold',
        type: 'number',
        required: false,
        default: '200',
        description:
          'Konfiguruje właściwość „virtual threshold” komponentu. Property JavaScript: virtualThreshold. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'virtual-height',
        type: 'number',
        required: false,
        default: '384',
        description:
          'Konfiguruje właściwość „virtual height” komponentu. Property JavaScript: virtualHeight. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'empty-title',
        type: 'string',
        required: false,
        default: 'No commands found',
        description:
          'Konfiguruje właściwość „empty title” komponentu. Property JavaScript: emptyTitle. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'empty-description',
        type: 'string',
        required: false,
        default: 'Try another phrase.',
        description:
          'Konfiguruje właściwość „empty description” komponentu. Property JavaScript: emptyDescription. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'open',
        type: 'boolean',
        required: false,
        description:
          'Kontrolowana właściwość open; synchronizuj ją przez zdarzenie update:open. Property JavaScript: open. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'query',
        type: 'string',
        required: false,
        description:
          'Kontrolowana właściwość query; synchronizuj ją przez zdarzenie update:query. Property JavaScript: query. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'active-id',
        type: 'string | null',
        required: false,
        description:
          'Kontrolowana właściwość activeId; synchronizuj ją przez zdarzenie update:activeId. Property JavaScript: activeId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'update:open',
        type: '(value: boolean) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „update:open”.',
      },
      {
        name: 'update:query',
        type: '(value: string) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „update:query”.',
      },
      {
        name: 'update:activeId',
        type: '(value: string | null) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „update:activeId”.',
      },
      {
        name: 'select',
        type: '(value: CommandPaletteCommand) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „select”.',
      },
      {
        name: 'execute',
        type: '(value: CommandPaletteCommand) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „execute”.',
      },
      {
        name: 'executionSuccess',
        type: '(value: CommandPaletteExecutionSuccessDetail) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „executionSuccess”.',
      },
      {
        name: 'executionError',
        type: '(value: CommandPaletteExecutionErrorDetail) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „executionError”.',
      },
      {
        name: 'levelChange',
        type: '(value: CommandPaletteLevelChangeDetail) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „levelChange”.',
      },
    ],
    slots: [
      {
        name: 'trigger',
        description: 'Treść osadzana w nazwanym slocie „trigger”.',
      },
      {
        name: 'header',
        description: 'Treść osadzana w nazwanym slocie „header”.',
      },
      {
        name: 'command',
        description: 'Treść osadzana w nazwanym slocie „command”.',
      },
      {
        name: 'group',
        description: 'Treść osadzana w nazwanym slocie „group”.',
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
        name: 'error',
        description: 'Treść osadzana w nazwanym slocie „error”.',
      },
      {
        name: 'footer',
        description: 'Treść osadzana w nazwanym slocie „footer”.',
      },
      {
        name: 'breadcrumb',
        description: 'Treść osadzana w nazwanym slocie „breadcrumb”.',
      },
    ],
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
          'Pozycje współdzielące pełny kontrakt semantyczny z DropdownMenu. Property JavaScript: items. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'context',
        type: 'unknown',
        required: false,
        description:
          'Dane domenowe bieżącego celu przekazywane w zdarzeniach akcji. Property JavaScript: context. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza wyłącznie menu kontekstowe, bez blokowania podstawowej funkcji celu. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'trigger',
        type: "'pointer' | 'keyboard' | 'both'",
        required: false,
        default: 'both',
        description:
          'Dozwolony sposób otwierania menu. Property JavaScript: trigger. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'position',
        type: "'cursor' | 'target'",
        required: false,
        default: 'cursor',
        description:
          'Pozycjonuje menu przy kursorze albo przy prostokącie aktywnego celu. Property JavaScript: position. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'long-press',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Włącza otwieranie dotykiem po bezruchowym przytrzymaniu. Property JavaScript: longPress. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'long-press-delay',
        type: 'number',
        required: false,
        default: '550',
        description:
          'Czas przytrzymania w milisekundach; wartości są ograniczane do bezpiecznego zakresu. Property JavaScript: longPressDelay. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'long-press-move-threshold',
        type: 'number',
        required: false,
        default: '10',
        description:
          'Maksymalny ruch wskaźnika w pikselach przed anulowaniem long press. Property JavaScript: longPressMoveThreshold. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'close-on-scroll',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Zamyka otwarte menu po przewinięciu dokumentu lub kontenera celu. Property JavaScript: closeOnScroll. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'offset',
        type: 'number',
        required: false,
        default: '4',
        description:
          'Odstęp powierzchni menu od punktu albo celu w pikselach. Property JavaScript: offset. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'close-on-select',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Zamyka menu po zwykłej akcji. Property JavaScript: closeOnSelect. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loop',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Pozwala zapętlać nawigację strzałkami. Property JavaScript: loop. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'density',
        type: 'DropdownMenuDensity',
        required: false,
        default: 'comfortable',
        description:
          'Gęstość pionowa pozycji menu. Property JavaScript: density. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: 'Menu kontekstowe',
        description:
          'Dostępna nazwa powierzchni menu. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Pokazuje stan ładowania zamiast pozycji. Property JavaScript: loading. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator używany w testach automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Kontrolowana właściwość open; synchronizuj ją przez zdarzenie update:open. Property JavaScript: open. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'open',
        type: '(detail: ContextMenuOpenDetail) => void',
        description: 'Emitowane po skutecznym otwarciu menu.',
      },
      {
        name: 'close',
        type: '(reason: ContextMenuCloseReason) => void',
        description: 'Emitowane po zamknięciu menu wraz z przyczyną.',
      },
      {
        name: 'select',
        type: '(item: DropdownMenuItem, path: number[], context: unknown) => void',
        description: 'Emitowane po aktywowaniu dostępnej pozycji.',
      },
      {
        name: 'checkedChange',
        type: '(item: DropdownMenuItem, checked: boolean, path: number[], context: unknown) => void',
        description: 'Emitowane po zmianie intencji pozycji checkbox lub radio.',
      },
      {
        name: 'valueChange',
        type: '(item: DropdownMenuItem, value: unknown, path: number[], context: unknown) => void',
        description: 'Emitowane po wyborze pozycji posiadającej wartość.',
      },
      {
        name: 'contextChange',
        type: '(context: unknown) => void',
        description: 'Emitowane, gdy aktywacja wskazuje nowy kontekst danych.',
      },
      {
        name: 'longPressCancel',
        type: '(reason: ContextMenuLongPressCancelReason) => void',
        description: 'Emitowane, gdy oczekujący long press został świadomie anulowany.',
      },
      {
        name: 'update:open',
        type: '(value: boolean) => void',
        description: 'Emitowane po zmianie modelu „open”; przekaż nową wartość do v-model:open.',
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
          'Deklaratywna kolekcja akcji, grup, separatorów i podmenu. Property JavaScript: items. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza trigger i wszystkie akcje menu. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'placement',
        type: "'top' | 'right' | 'bottom' | 'left'",
        required: false,
        default: 'bottom',
        description:
          'Strona triggera zachowywana także przy kolizji; powierzchnia jest ograniczana do viewportu. Property JavaScript: placement. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'align',
        type: "'start' | 'center' | 'end'",
        required: false,
        default: 'start',
        description:
          'Wyrównanie menu na osi poprzecznej. Property JavaScript: align. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'offset',
        type: 'number',
        required: false,
        default: '8',
        description:
          'Odstęp menu od triggera w pikselach. Property JavaScript: offset. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'close-on-select',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Zamyka menu po zwykłej akcji; checkbox i radio pozostają domyślnie otwarte. Property JavaScript: closeOnSelect. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loop',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Pozwala zapętlać nawigację strzałkami między skrajnymi pozycjami. Property JavaScript: loop. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'density',
        type: "'compact' | 'comfortable'",
        required: false,
        default: 'comfortable',
        description:
          'Gęstość pionowa pozycji menu. Property JavaScript: density. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: 'Menu akcji',
        description:
          'Dostępna nazwa powierzchni menu. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'trigger-label',
        type: 'string',
        required: false,
        default: 'Otwórz menu',
        description:
          'Widoczna i dostępna etykieta domyślnego triggera. Property JavaScript: triggerLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Pokazuje stan ładowania zamiast pozycji. Property JavaScript: loading. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator używany w testach automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Kontrolowana właściwość open; synchronizuj ją przez zdarzenie update:open. Property JavaScript: open. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'select',
        type: '(item: DropdownMenuItem, path: number[]) => void',
        description: 'Emitowane po aktywowaniu dostępnej pozycji.',
      },
      {
        name: 'checkedChange',
        type: '(item: DropdownMenuItem, checked: boolean, path: number[]) => void',
        description: 'Emitowane po zmianie intencji pozycji checkbox lub radio.',
      },
      {
        name: 'valueChange',
        type: '(item: DropdownMenuItem, value: unknown, path: number[]) => void',
        description: 'Emitowane po wyborze pozycji posiadającej wartość.',
      },
      {
        name: 'openChange',
        type: '(value: boolean) => void',
        description: 'Emitowane przy każdej intencji otwarcia lub zamknięcia.',
      },
      {
        name: 'escape',
        type: '() => void',
        description: 'Emitowane po zamknięciu klawiszem Escape.',
      },
      {
        name: 'outsideClick',
        type: '() => void',
        description: 'Emitowane po zamknięciu kliknięciem poza komponentem.',
      },
      {
        name: 'update:open',
        type: '(value: boolean) => void',
        description: 'Emitowane po zmianie modelu „open”; przekaż nową wartość do v-model:open.',
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
          'Unikalny identyfikator elementu w dokumencie. Property JavaScript: id. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'label',
        type: 'string',
        required: true,
        description:
          'Widoczna etykieta opisująca element lub pole formularza. Property JavaScript: label. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'limit-list',
        type: 'number[]',
        required: false,
        default: '[5, 10, 25, 50]',
        description:
          'Konfiguruje właściwość „limit list” komponentu. Property JavaScript: limitList. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'position',
        type: "'top' | 'bottom'",
        required: false,
        default: 'bottom',
        description:
          'Preferred list placement; it flips automatically when the selected side has insufficient space. Property JavaScript: position. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'limit',
        type: 'number',
        required: true,
        description:
          'Kontrolowana właściwość limit; synchronizuj ją przez zdarzenie update:limit. Property JavaScript: limit. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'update:limit',
        type: '(value: number) => void',
        description: 'Emitowane po zmianie modelu „limit”; przekaż nową wartość do v-model:limit.',
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
          'Uporządkowane sekcje poziomego menu aplikacyjnego. Property JavaScript: menus. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza cały pasek i zamyka aktywną sekcję. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'loop',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Pozwala zapętlać fokus między pierwszym i ostatnim dostępnym triggerem. Property JavaScript: loop. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'variant',
        type: "'default' | 'compact'",
        required: false,
        default: 'default',
        description:
          'Gęstość wizualna triggerów i pozycji menu. Property JavaScript: variant. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: 'Menu aplikacji',
        description:
          'Dostępna nazwa elementu z rolą menubar. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator używany w testach automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'open-menu',
        type: 'string | number | null',
        required: false,
        default: 'null',
        description:
          'Kontrolowana właściwość openMenu; synchronizuj ją przez zdarzenie update:openMenu. Property JavaScript: openMenu. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'select',
        type: '(item: DropdownMenuItem, path: number[], menu: MenuBarMenu) => void',
        description: 'Emitowane po aktywowaniu pozycji wraz z sekcją nadrzędną.',
      },
      {
        name: 'focusChange',
        type: '(menu: MenuBarMenu, index: number) => void',
        description: 'Emitowane po przeniesieniu fokusu roving tabindex na inny trigger.',
      },
      {
        name: 'checkedChange',
        type: '(item: DropdownMenuItem, checked: boolean, path: number[], menu: MenuBarMenu) => void',
        description: 'Przekazuje intencję zmiany pozycji checkbox lub radio.',
      },
      {
        name: 'valueChange',
        type: '(item: DropdownMenuItem, value: unknown, path: number[], menu: MenuBarMenu) => void',
        description: 'Przekazuje wartość wybranej pozycji wraz z sekcją nadrzędną.',
      },
      {
        name: 'update:openMenu',
        type: '(value: string | number | null) => void',
        description:
          'Emitowane po zmianie modelu „openMenu”; przekaż nową wartość do v-model:openMenu.',
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
          'Główny tytuł prezentowany w komponencie. Property JavaScript: title. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'path',
        type: 'string',
        required: false,
        description:
          'Konfiguruje właściwość „path” komponentu. Property JavaScript: path. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'description',
        type: 'string',
        required: true,
        description:
          'Dodatkowy opis objaśniający zawartość albo stan komponentu. Property JavaScript: description. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'size',
        type: "'s' | 'm' | 'l'",
        required: false,
        default: 's',
        description:
          'Wariant rozmiaru komponentu. Property JavaScript: size. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'variant',
        type: "'default' | 'complete' | 'during' | 'disabled' | 'hidden'",
        required: false,
        default: 'default',
        description:
          'Wariant wizualny komponentu. Property JavaScript: variant. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
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
          'Główny tytuł prezentowany w komponencie. Property JavaScript: title. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'description',
        type: 'string',
        required: true,
        description:
          'Dodatkowy opis objaśniający zawartość albo stan komponentu. Property JavaScript: description. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'id',
        type: 'string',
        required: true,
        description:
          'Unikalny identyfikator elementu w dokumencie. Property JavaScript: id. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'path',
        type: 'string',
        required: false,
        description:
          'Konfiguruje właściwość „path” komponentu. Property JavaScript: path. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Steruje widocznością rozwijanego elementu albo warstwy. Property JavaScript: open. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
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
          'Nazwa ikony prezentowanej przez komponent. Property JavaScript: icon. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'text',
        type: 'string',
        required: false,
        default: '',
        description:
          'Konfiguruje właściwość „text” komponentu. Property JavaScript: text. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'path',
        type: 'string',
        required: false,
        default: '',
        description:
          'Konfiguruje właściwość „path” komponentu. Property JavaScript: path. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
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
          'Lista opcji dostępnych do wyświetlenia lub wyboru. Property JavaScript: options. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: 'Nawigacja kroków',
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [],
    events: [
      {
        name: 'on:select',
        type: '(element: NavStepper) => void',
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
          'Konfiguruje właściwość „tabs” komponentu. Property JavaScript: tabs. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: true,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'with-backround',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „with backround” komponentu. Property JavaScript: withBackround. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [],
    events: [
      {
        name: 'on:select',
        type: '(tab: Tab) => void',
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
          'Dostępna nazwa elementu przekazywana przez aria-label. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'total-pages',
        type: 'number',
        required: true,
        description:
          'Łączna liczba stron dostępnych w paginacji. Property JavaScript: totalPages. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'page',
        type: 'number',
        required: true,
        default: '1',
        description:
          'Kontrolowana właściwość page; synchronizuj ją przez zdarzenie update:page. Property JavaScript: page. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'update:page',
        type: '(value: number) => void',
        description: 'Emitowane po zmianie modelu „page”; przekaż nową wartość do v-model:page.',
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
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'open',
        type: 'boolean',
        required: true,
        description:
          'Kontrolowana właściwość open; synchronizuj ją przez zdarzenie update:open. Property JavaScript: open. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'update:open',
        type: '(value: boolean) => void',
        description: 'Emitowane po zmianie modelu „open”; przekaż nową wartość do v-model:open.',
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
    name: 'GuidedTour',
    sourceName: 'GuidedTour',
    framework: 'web-components',
    importPath: '@peaui/ui/wc/overlayer/GuidedTour',
    tagName: 'peaui-guided-tour',
    status: 'stable',
    props: [
      {
        name: 'steps',
        type: 'GuidedTourStep[]',
        required: true,
        description:
          'Konfiguruje właściwość „steps” komponentu. Property JavaScript: steps. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'mode',
        type: "'spotlight' | 'modal'",
        required: false,
        default: 'spotlight',
        description:
          'Konfiguruje właściwość „mode” komponentu. Property JavaScript: mode. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'card-variant',
        type: "'card' | 'tooltip'",
        required: false,
        default: 'card',
        description:
          'Konfiguruje właściwość „card variant” komponentu. Property JavaScript: cardVariant. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'linear',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „linear” komponentu. Property JavaScript: linear. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'show-mask',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „show mask” komponentu. Property JavaScript: showMask. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'allow-skip',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „allow skip” komponentu. Property JavaScript: allowSkip. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'close-on-escape',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „close on escape” komponentu. Property JavaScript: closeOnEscape. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'scroll-behavior',
        type: "'auto' | 'smooth'",
        required: false,
        default: 'smooth',
        description:
          'Konfiguruje właściwość „scroll behavior” komponentu. Property JavaScript: scrollBehavior. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'target-timeout',
        type: 'number',
        required: false,
        default: '2000',
        description:
          'Konfiguruje właściwość „target timeout” komponentu. Property JavaScript: targetTimeout. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'missing-target-strategy',
        type: "'skip' | 'block' | 'close'",
        required: false,
        default: 'block',
        description:
          'Konfiguruje właściwość „missing target strategy” komponentu. Property JavaScript: missingTargetStrategy. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'spotlight-padding',
        type: 'number',
        required: false,
        default: '8',
        description:
          'Konfiguruje właściwość „spotlight padding” komponentu. Property JavaScript: spotlightPadding. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'pending',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „pending” komponentu. Property JavaScript: pending. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'labels',
        type: 'Partial<GuidedTourLabels>',
        required: false,
        default: '{}',
        description:
          'Konfiguruje właściwość „labels” komponentu. Property JavaScript: labels. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'persist',
        type: '(state: GuidedTourPersistState) => void | Promise<void>',
        required: false,
        default: 'undefined',
        description:
          'Konfiguruje właściwość „persist” komponentu. Property JavaScript: persist. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        default: 'Guided tour',
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        default: 'undefined',
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'open',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Kontrolowana właściwość open; synchronizuj ją przez zdarzenie update:open. Property JavaScript: open. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'step',
        type: 'number',
        required: false,
        default: '0',
        description:
          'Kontrolowana właściwość step; synchronizuj ją przez zdarzenie update:step. Property JavaScript: step. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'update:open',
        type: '(value: boolean) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „update:open”.',
      },
      {
        name: 'update:step',
        type: '(value: number) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „update:step”.',
      },
      {
        name: 'start',
        type: '(payload: GuidedTourStepPayload) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „start”.',
      },
      {
        name: 'stepEnter',
        type: '(payload: GuidedTourStepPayload) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „stepEnter”.',
      },
      {
        name: 'stepLeave',
        type: '(payload: GuidedTourStepPayload) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „stepLeave”.',
      },
      {
        name: 'next',
        type: '(payload: GuidedTourStepPayload) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „next”.',
      },
      {
        name: 'back',
        type: '(payload: GuidedTourStepPayload) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „back”.',
      },
      {
        name: 'skip',
        type: '(payload: GuidedTourStepPayload) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „skip”.',
      },
      {
        name: 'complete',
        type: '(payload: GuidedTourStepPayload) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „complete”.',
      },
      {
        name: 'targetMissing',
        type: '(payload: { step: GuidedTourStep; index: number }) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „targetMissing”.',
      },
      {
        name: 'error',
        type: '(payload: GuidedTourErrorPayload) => void',
        description: 'Emitowane, gdy operacja komponentu kończy się błędem.',
      },
    ],
    slots: [
      {
        name: 'title',
        description: 'Treść osadzana w nazwanym slocie „title”.',
      },
      {
        name: 'progress',
        description: 'Treść osadzana w nazwanym slocie „progress”.',
      },
      {
        name: 'missing-target',
        description: 'Treść osadzana w nazwanym slocie „missing-target”.',
      },
      {
        name: 'content',
        description: 'Treść osadzana w nazwanym slocie „content”.',
      },
      {
        name: 'description',
        description: 'Treść osadzana w nazwanym slocie „description”.',
      },
      {
        name: 'actions',
        description: 'Treść osadzana w nazwanym slocie „actions”.',
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
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [
      {
        name: 'open',
        type: 'boolean',
        required: true,
        description:
          'Kontrolowana właściwość open; synchronizuj ją przez zdarzenie update:open. Property JavaScript: open. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    events: [
      {
        name: 'update:open',
        type: '(value: boolean) => void',
        description: 'Emitowane po zmianie modelu „open”; przekaż nową wartość do v-model:open.',
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
          'Wariant rozmiaru komponentu. Property JavaScript: size. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'ghost' | 'danger'",
        required: false,
        default: 'primary',
        description:
          'Wariant wizualny komponentu. Property JavaScript: variant. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'placement',
        type: "'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
        required: false,
        default: 'top',
        description:
          'Konfiguruje właściwość „placement” komponentu. Property JavaScript: placement. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza komponent i blokuje jego interakcje. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'match-trigger-width',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „match trigger width” komponentu. Property JavaScript: matchTriggerWidth. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'popup-type',
        type: "'menu' | 'listbox' | 'tree' | 'grid' | 'dialog' | 'true'",
        required: false,
        description:
          'Konfiguruje właściwość „popup type” komponentu. Property JavaScript: popupType. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'use-aria-label',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „use aria label” komponentu. Property JavaScript: useAriaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [],
    events: [
      {
        name: 'keydown',
        type: '(event: KeyboardEvent) => void',
        description: 'Emitowane, gdy komponent zgłasza zdarzenie „keydown”.',
      },
      {
        name: 'pointerdown',
        type: '(event: PointerEvent) => void',
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
        type: "'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
        required: false,
        default: 'top',
        description:
          'Konfiguruje właściwość „placement” komponentu. Property JavaScript: placement. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'data-testid',
        type: 'string',
        required: false,
        description:
          'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. Property JavaScript: dataTestId. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Wyłącza komponent i blokuje jego interakcje. Property JavaScript: disabled. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description:
          'Dostępna nazwa elementu przekazywana przez aria-label. Property JavaScript: ariaLabel. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'content-class',
        type: 'string',
        required: false,
        description:
          'Konfiguruje właściwość „content class” komponentu. Property JavaScript: contentClass. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'manage-trigger-accessibility',
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          'Konfiguruje właściwość „manage trigger accessibility” komponentu. Property JavaScript: manageTriggerAccessibility. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'match-trigger-width',
        type: 'boolean',
        required: false,
        default: 'false',
        description:
          'Konfiguruje właściwość „match trigger width” komponentu. Property JavaScript: matchTriggerWidth. Wartości złożone i funkcje ustawiaj jako properties.',
      },
      {
        name: 'popup-type',
        type: "'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'",
        required: false,
        description:
          'Konfiguruje właściwość „popup type” komponentu. Property JavaScript: popupType. Wartości złożone i funkcje ustawiaj jako properties.',
      },
    ],
    models: [],
    events: [
      {
        name: 'update:open',
        type: '(value: boolean) => void',
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
