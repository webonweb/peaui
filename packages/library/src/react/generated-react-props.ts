// Ten plik jest generowany przez scripts/generate-react-components.mjs.
// Źródłem kontraktu są publiczne propsy, modele, zdarzenia i sloty komponentów Vue.

import type {
  CSSProperties,
  KeyboardEventHandler,
  MouseEventHandler,
  PointerEventHandler,
  ReactNode,
} from 'react';

export type ReactComponentName =
  | 'ImageView'
  | 'PhotoEditor'
  | 'SvgIcon'
  | 'CalculationResults'
  | 'CardCarousel'
  | 'CounterBadge'
  | 'DescriptionField'
  | 'DisclosurePanel'
  | 'SectionHeading'
  | 'TableList'
  | 'TableListFooter'
  | 'TableListHeader'
  | 'TagChip'
  | 'TreeList'
  | 'ButtonAction'
  | 'ButtonExport'
  | 'InputSlider'
  | 'SearchInput'
  | 'SelectableCard'
  | 'EmptyState'
  | 'MessageText'
  | 'ProgressIndicator'
  | 'SkeletonLoading'
  | 'SpinnerLoader'
  | 'ToastAlert'
  | 'FieldLabel'
  | 'FormButtonCheckbox'
  | 'FormButtonGroup'
  | 'FormCheckbox'
  | 'FormContainer'
  | 'FormDatePicker'
  | 'FormField'
  | 'FormFileUpload'
  | 'FormFileUploadSimple'
  | 'FormInput'
  | 'FormMultiSelect'
  | 'FormNumber'
  | 'FormPassword'
  | 'FormRadio'
  | 'FormSelect'
  | 'FormTextarea'
  | 'FormYearPicker'
  | 'CardPanel'
  | 'FullscreenContainer'
  | 'GridItem'
  | 'GridSection'
  | 'PageLayout'
  | 'SectionDivider'
  | 'Breadcrumbs'
  | 'ListLimitControl'
  | 'NavigationCard'
  | 'NavigationDisclosureCard'
  | 'NavigationIconCard'
  | 'NavigationLink'
  | 'NavigationStepper'
  | 'NavigationTabs'
  | 'PaginationControl'
  | 'DrawerPanel'
  | 'InfoTooltip'
  | 'ModalDialog'
  | 'PopoverButton'
  | 'PopoverOverlayer';

export type PeauiReactBaseProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  role?: string;
  tabIndex?: number;
  onClick?: MouseEventHandler<HTMLElement>;
  onKeyDown?: KeyboardEventHandler<HTMLElement>;
  onPointerDown?: PointerEventHandler<HTMLElement>;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
  'data-testid'?: string;
};

export type PeauiRecord = Record<string, unknown>;
export type PeauiOption = {
  id?: string;
  key?: string;
  label: string;
  value?: unknown;
  active?: boolean;
  disabled?: boolean;
  hint?: string;
  icon?: string;
  path?: string;
  isValid?: boolean;
  number?: string;
  status?: 'default' | 'complete' | 'during' | 'disabled' | 'hidden';
  additional?: ReactNode;
};
export type PeauiTableColumn = PeauiRecord & {
  key: string;
  label?: string;
  sortable?: boolean;
  type?: string;
  actionName?: string;
  inline?: boolean;
  manage?: PeauiRecord;
};
export type PeauiTreeNode = PeauiRecord & {
  id?: string | number;
  label?: string;
  children?: PeauiTreeNode[] | Record<string, PeauiTreeNode>;
};
export type PeauiSortDescriptor = { key: string; direction?: 'asc' | 'desc' };
export type PeauiRangeValue<Value> = { from?: Value; to?: Value; start?: Value; end?: Value };

export type ReactComponentPropsMap = {
  ImageView: PeauiReactBaseProps & {
    /** Alternatywny opis obrazu używany przez technologie asystujące. */
    alt?: string;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Maksymalna dozwolona wartość albo szerokość. */
    max?: string;
    /** Wariant rozmiaru komponentu. */
    size?: 'auto' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'full';
    /** Adres źródłowy obrazu albo innego zasobu. */
    src?: string;
  };
  PhotoEditor: PeauiReactBaseProps & {
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel?: string;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Edytowany obraz kontrolowany przez v-model:image. */
    image?: string | File | Blob | undefined;
    /** Początkowa niekontrolowana wartość właściwości image. */
    defaultImage?: string | File | Blob | undefined;
    /** Callback React wywoływany po zmianie właściwości image. */
    onImageChange?: (value: string | File | Blob | undefined) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „on:cancel”. */
    onCancel?: (...args: unknown[]) => void;
  };
  SvgIcon: PeauiReactBaseProps & {
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Nazwa pola używana przez formularz lub nazwa zasobu. */
    name: string;
  };
  CalculationResults: PeauiReactBaseProps & {
    /** Włącza stan ładowania i informuje o trwającej operacji. */
    isLoading?: boolean;
    /** Wyłącza komponent i blokuje jego interakcje. */
    disabled?: boolean;
    /** Konfiguruje właściwość „result” komponentu. */
    result?: string;
    /** Widoczna etykieta opisująca element lub pole formularza. */
    label: string;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Konfiguruje właściwość „is simple” komponentu. */
    isSimple?: boolean;
    /** Konfiguruje właściwość „show calculate button” komponentu. */
    showCalculateButton?: boolean;
    /** Emitowane, gdy komponent zgłasza zdarzenie „on:simulate”. */
    onSimulate?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „additional”. */
    additional?: ReactNode;
    /** Treść osadzana w nazwanym slocie „hint”. */
    hint?: ReactNode;
  };
  CardCarousel: PeauiReactBaseProps & {
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel?: string;
    /** Konfiguruje właściwość „animation delay” komponentu. */
    animationDelay?: number;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Konfiguruje właściwość „default visible slides” komponentu. */
    defaultVisibleSlides?: number;
    /** Konfiguruje właściwość „defualt visible slides” komponentu. */
    defualtVisibleSlides?: number;
    /** Konfiguruje właściwość „is navigation dots visible” komponentu. */
    isNavigationDotsVisible?: boolean;
    /** Konfiguruje właściwość „is navigation visible” komponentu. */
    isNavigationVisible?: boolean;
    /** Konfiguruje właściwość „with animation” komponentu. */
    withAnimation?: boolean;
  };
  CounterBadge: PeauiReactBaseProps & {
    /** Bieżąca wartość kontrolowana przez v-model. */
    value: number;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Wariant wizualny komponentu. */
    variant?: 'info' | 'error' | 'success' | 'danger';
    /** Wariant rozmiaru komponentu. */
    size?: 's' | 'm' | 'l';
  };
  DescriptionField: PeauiReactBaseProps & {
    /** Widoczna etykieta opisująca element lub pole formularza. */
    label: string;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Treść osadzana w nazwanym slocie „additional-before”. */
    additionalBefore?: ReactNode;
    /** Treść osadzana w nazwanym slocie „hint”. */
    hint?: ReactNode;
    /** Treść osadzana w nazwanym slocie „additional-after”. */
    additionalAfter?: ReactNode;
  };
  DisclosurePanel: PeauiReactBaseProps & {
    /** Główny tytuł prezentowany w komponencie. */
    title?: string;
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel?: string;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Wyłącza komponent i blokuje jego interakcje. */
    disabled?: boolean;
    /** Konfiguruje właściwość „allways open” komponentu. */
    allwaysOpen?: boolean;
    /** Stan otwarcia kontrolowany przez v-model:open. */
    open?: boolean;
    /** Początkowa niekontrolowana wartość właściwości open. */
    defaultOpen?: boolean;
    /** Callback React wywoływany po zmianie właściwości open. */
    onOpenChange?: (value: boolean) => void;
    /** Treść osadzana w nazwanym slocie „additional”. */
    additional?: ReactNode;
  };
  SectionHeading: PeauiReactBaseProps & {
    /** Wariant rozmiaru komponentu. */
    size?: 'heading-l' | 'heading-m' | 'heading-s' | 'heading-xs' | 'xl' | 'l' | 'm' | 's';
    /** Konfiguruje właściwość „as” komponentu. */
    as?: 'section' | 'div' | 'header';
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Wariant wizualny komponentu. */
    variant?: 'default' | 'primary' | 'secondary';
    /** Treść osadzana w nazwanym slocie „title”. */
    title?: ReactNode;
    /** Treść osadzana w nazwanym slocie „hint”. */
    hint?: ReactNode;
    /** Treść osadzana w nazwanym slocie „description”. */
    description?: ReactNode;
  };
  TableList: PeauiReactBaseProps & {
    /** Unikalny identyfikator elementu w dokumencie. */
    id?: string;
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel?: string;
    /** Konfiguruje właściwość „is detials” komponentu. */
    isDetials?: boolean;
    /** Konfiguruje właściwość „additional” komponentu. */
    additional?: Record<string, unknown>;
    /** Włącza możliwość dodawania nowych rekordów. */
    canCreate?: boolean;
    /** Włącza możliwość zaznaczania wierszy. */
    canSelectRows?: boolean;
    /** Konfiguruje właściwość „can check rows” komponentu. */
    canCheckRows?: boolean;
    /** Pozwala użytkownikowi sterować widocznością kolumn. */
    canHideColumns?: boolean;
    /** Konfiguruje właściwość „can multi sort” komponentu. */
    canMultiSort?: boolean;
    /** Definicje kolumn określające ich etykiety, klucze i sposób renderowania. */
    columns: PeauiTableColumn[];
    /** Włącza tryb edycji danych. */
    editable?: boolean;
    /** Konfiguruje właściwość „empty description” komponentu. */
    emptyDescription?: boolean;
    /** Konfiguruje właściwość „empty description inline” komponentu. */
    emptyDescriptionInline?: string;
    /** Kolekcja rekordów prezentowanych przez komponent. */
    records: PeauiRecord[];
    /** Liczba rekordów wyświetlanych na jednej stronie. */
    rowsPerPage?: number;
    /** Konfiguruje właściwość „current checked row” komponentu. */
    currentCheckedRow?: number | string;
    /** Konfiguruje właściwość „rows total” komponentu. */
    rowsTotal?: number;
    /** Identyfikatory aktualnie zaznaczonych wierszy. */
    selectedRows?: string[];
    /** Konfiguruje właściwość „sort column” komponentu. */
    sortColumn?: string;
    /** Konfiguruje właściwość „sort columns” komponentu. */
    sortColumns?: PeauiSortDescriptor[];
    /** Konfiguruje właściwość „sort type” komponentu. */
    sortType?: 'asc' | 'desc' | undefined;
    /** Konfiguruje właściwość „button editable create text” komponentu. */
    buttonEditableCreateText?: string;
    /** Konfiguruje właściwość „title remove label” komponentu. */
    titleRemoveLabel?: string;
    /** Konfiguruje właściwość „description remove label” komponentu. */
    descriptionRemoveLabel?: string;
    /** Włącza stan ładowania i informuje o trwającej operacji. */
    isLoading?: boolean;
    /** Konfiguruje właściwość „scroll” komponentu. */
    scroll?: boolean;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Emitowane, gdy komponent zgłasza zdarzenie „on:action”. */
    onAction?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „on:createRecord”. */
    onCreateRecord?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „on:dblclick”. */
    onRowDoubleClick?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „on:dbclick”. */
    onDbclick?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „on:select:row”. */
    onSelectRow?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „on:sort”. */
    onSort?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „on:cancel”. */
    onCancel?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „on:check:row”. */
    onCheckRow?: (...args: unknown[]) => void;
    /** Emitowane po zatwierdzeniu danych. */
    onSubmit?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „on:changeValue”. */
    onChangeValue?: (...args: unknown[]) => void;
    /** Renderuje niestandardową zawartość komórki tabeli. */
    renderCell?: (columnKey: string, record: PeauiRecord, rowIndex: number) => ReactNode;
    /** Treść osadzana w nazwanym slocie „detials-record”. */
    detialsRecord?: ReactNode;
    /** Treść osadzana w nazwanym slocie „additionalRow”. */
    additionalRow?: ReactNode;
  };
  TableListFooter: PeauiReactBaseProps & {
    /** Konfiguruje właściwość „rows number” komponentu. */
    rowsNumber: number;
    /** Liczba rekordów wyświetlanych na jednej stronie. */
    rowsPerPage: number;
    /** Numer aktualnie wybranej strony. */
    page: number;
    /** Łączna liczba elementów. */
    total: number;
    /** Konfiguruje właściwość „under” komponentu. */
    under?: boolean;
    /** Konfiguruje właściwość „is flex” komponentu. */
    isFlex?: boolean;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Emitowane, gdy komponent zgłasza zdarzenie „on:change:page”. */
    onChangePage?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „on:change:limit”. */
    onChangeLimit?: (...args: unknown[]) => void;
  };
  TableListHeader: PeauiReactBaseProps & {
    /** Konfiguruje właściwość „button create label” komponentu. */
    buttonCreateLabel?: string;
    /** Włącza możliwość dodawania nowych rekordów. */
    canCreate?: boolean;
    /** Konfiguruje właściwość „can export” komponentu. */
    canExport?: boolean;
    /** Konfiguruje właściwość „can filter” komponentu. */
    canFilter?: boolean;
    /** Konfiguruje właściwość „can search” komponentu. */
    canSearch?: boolean;
    /** Konfiguruje właściwość „count filters” komponentu. */
    countFilters?: number;
    /** Konfiguruje właściwość „count selected records” komponentu. */
    countSelectedRecords?: number;
    /** Konfiguruje właściwość „search placeholder” komponentu. */
    searchPlaceholder?: string;
    /** Konfiguruje właściwość „total records” komponentu. */
    totalRecords?: number;
    /** Konfiguruje właściwość „user id” komponentu. */
    userId?: string;
    /** Konfiguruje właściwość „force export” komponentu. */
    forceExport?: boolean;
    /** Wartość kontrolowana przez v-model:filters-open. */
    filtersOpen?: boolean;
    /** Początkowa niekontrolowana wartość właściwości filtersOpen. */
    defaultFiltersOpen?: boolean;
    /** Callback React wywoływany po zmianie właściwości filtersOpen. */
    onFiltersOpenChange?: (value: boolean) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „on:search”. */
    onSearch?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „on:reset-filters”. */
    onResetFilters?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „on:create”. */
    onCreate?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „on:export”. */
    onExport?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „filters-drawer”. */
    filtersDrawer?: ReactNode;
    /** Treść osadzana w nazwanym slocie „additional-buttons”. */
    additionalButtons?: ReactNode;
    /** Treść osadzana w nazwanym slocie „addtional-content”. */
    addtionalContent?: ReactNode;
    /** Treść osadzana w nazwanym slocie „addtional-description”. */
    addtionalDescription?: ReactNode;
  };
  TagChip: PeauiReactBaseProps & {
    /** Wariant rozmiaru komponentu. */
    size?: 'xxs' | 'xs' | 's';
    /** Wariant wizualny komponentu. */
    variant?: 'blue' | 'green' | 'red' | 'orange' | 'grey' | 'violet' | 'outline';
    /** Określa aktywny element albo aktywny krok. */
    active?: boolean;
    /** Widoczna etykieta opisująca element lub pole formularza. */
    label: string;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Konfiguruje właściwość „as” komponentu. */
    as?: 'span' | 'button';
  };
  TreeList: PeauiReactBaseProps & {
    /** Unikalny identyfikator elementu w dokumencie. */
    id?: string;
    /** Wyłącza komponent i blokuje jego interakcje. */
    disabled?: boolean;
    /** Konfiguruje właściwość „level” komponentu. */
    level?: number;
    /** Konfiguruje właściwość „is last” komponentu. */
    isLast?: boolean;
    /** Konfiguruje właściwość „can remove” komponentu. */
    canRemove?: boolean;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Dane drzewa kontrolowane przez v-model:tree. */
    tree?: PeauiTreeNode | PeauiTreeNode[];
    /** Początkowa niekontrolowana wartość właściwości tree. */
    defaultTree?: PeauiTreeNode | PeauiTreeNode[];
    /** Callback React wywoływany po zmianie właściwości tree. */
    onTreeChange?: (value: PeauiTreeNode | PeauiTreeNode[]) => void;
    /** Emitowane po wybraniu akcji usunięcia. */
    onRemove?: (...args: unknown[]) => void;
  };
  ButtonAction: PeauiReactBaseProps & {
    /** Wariant rozmiaru komponentu. */
    size?: 'xxs' | 'xs' | 's' | 'm' | 'l';
    /** Wariant wizualny komponentu. */
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    /** Wariant funkcjonalny lub wizualny komponentu. */
    type?: 'button' | 'submit' | 'reset';
    /** Wyłącza komponent i blokuje jego interakcje. */
    disabled?: boolean;
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel?: string;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Konfiguruje właściwość „use aria label” komponentu. */
    useAriaLabel?: boolean;
  };
  ButtonExport: PeauiReactBaseProps & {
    /** Wariant rozmiaru komponentu. */
    size?: 'xs' | 's' | 'm' | 'l';
    /** Wariant wizualny komponentu. */
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    /** Wariant funkcjonalny lub wizualny komponentu. */
    type?: 'button' | 'submit' | 'reset';
    /** Wyłącza komponent i blokuje jego interakcje. */
    disabled?: boolean;
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel?: string;
    /** Konfiguruje właściwość „placement” komponentu. */
    placement?:
      | 'top'
      | 'right'
      | 'bottom'
      | 'left'
      | 'top-left'
      | 'top-right'
      | 'bottom-left'
      | 'bottom-right';
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Konfiguruje właściwość „selected items count” komponentu. */
    selectedItemsCount?: number;
    /** Konfiguruje właściwość „force export” komponentu. */
    forceExport?: boolean;
    /** Konfiguruje właściwość „use aria label” komponentu. */
    useAriaLabel?: boolean;
    /** Emitowane, gdy komponent zgłasza zdarzenie „on:export”. */
    onExport?: (...args: unknown[]) => void;
  };
  InputSlider: PeauiReactBaseProps & {
    /** Nazwa pola używana przez formularz lub nazwa zasobu. */
    name: string;
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel?: string;
    /** Wyłącza komponent i blokuje jego interakcje. */
    disabled?: boolean;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Bieżąca wartość kontrolowana przez v-model:value. */
    value?: number;
    /** Początkowa niekontrolowana wartość właściwości value. */
    defaultValue?: number;
    /** Callback React wywoływany po zmianie właściwości value. */
    onValueChange?: (value: number) => void;
  };
  SearchInput: PeauiReactBaseProps & {
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel?: string;
    /** Tekst pomocniczy widoczny przed wprowadzeniem wartości. */
    placeholder?: string;
    /** Konfiguruje właściwość „debounce time” komponentu. */
    debounceTime?: number;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Bieżąca wartość kontrolowana przez v-model:value. */
    value?: string | undefined;
    /** Początkowa niekontrolowana wartość właściwości value. */
    defaultValue?: string | undefined;
    /** Callback React wywoływany po zmianie właściwości value. */
    onValueChange?: (value: string | undefined) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „on:search”. */
    onSearch?: (...args: unknown[]) => void;
    /** Emitowane po wybraniu akcji usunięcia. */
    onRemove?: (...args: unknown[]) => void;
  };
  SelectableCard: PeauiReactBaseProps & {
    /** Wyłącza komponent i blokuje jego interakcje. */
    disabled?: boolean;
    /** Ustawia komponent w trybie tylko do odczytu. */
    readonly?: boolean;
    /** Określa aktywny element albo aktywny krok. */
    active?: boolean;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel?: string;
    /** Treść osadzana w nazwanym slocie „title”. */
    title?: ReactNode;
    /** Treść osadzana w nazwanym slocie „description”. */
    description?: ReactNode;
    /** Treść osadzana w nazwanym slocie „additional”. */
    additional?: ReactNode;
    /** Treść osadzana w nazwanym slocie „hint”. */
    hint?: ReactNode;
  };
  EmptyState: PeauiReactBaseProps & {
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Główny tytuł prezentowany w komponencie. */
    title?: string;
    /** Dodatkowy opis objaśniający zawartość albo stan komponentu. */
    description?: string;
    /** Treść osadzana w nazwanym slocie „additional”. */
    additional?: ReactNode;
  };
  MessageText: PeauiReactBaseProps & {
    /** Unikalny identyfikator elementu w dokumencie. */
    id: string;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Wariant rozmiaru komponentu. */
    size?:
      | 'xxs'
      | 'xs'
      | 's'
      | 'm'
      | 'l'
      | 'xl'
      | 'heading-xs'
      | ' heading-s'
      | 'heading-m'
      | 'heading-l';
    /** Wariant wizualny komponentu. */
    variant?: 'info' | 'error' | 'success' | 'danger' | 'default' | 'white';
    /** Konfiguruje właściwość „with icon” komponentu. */
    withIcon?: boolean;
    /** Konfiguruje właściwość „own icon” komponentu. */
    ownIcon?: string;
  };
  ProgressIndicator: PeauiReactBaseProps & {
    /** Konfiguruje właściwość „steps” komponentu. */
    steps: number;
    /** Określa aktywny element albo aktywny krok. */
    active?: number;
    /** Wariant rozmiaru komponentu. */
    size?: number;
    /** Konfiguruje właściwość „stroke width” komponentu. */
    strokeWidth?: number;
    /** Konfiguruje właściwość „remove active” komponentu. */
    removeActive?: boolean;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
  };
  SkeletonLoading: PeauiReactBaseProps & {
    /** Wariant rozmiaru komponentu. */
    size?: 'xs' | 's' | 'm' | 'l';
    /** Konfiguruje właściwość „rounded” komponentu. */
    rounded?: boolean;
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel?: string;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
  };
  SpinnerLoader: PeauiReactBaseProps & {
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
  };
  ToastAlert: PeauiReactBaseProps & {
    /** Wariant wizualny komponentu. */
    variant?: 'info' | 'error' | 'success' | 'danger';
    /** Główny tytuł prezentowany w komponencie. */
    title?: string;
    /** Dodatkowy opis objaśniający zawartość albo stan komponentu. */
    description?: string;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Wariant rozmiaru komponentu. */
    size?: 's' | 'm' | 'l';
    /** Konfiguruje właściwość „with shadow” komponentu. */
    withShadow?: boolean;
    /** Konfiguruje właściwość „with border” komponentu. */
    withBorder?: boolean;
    /** Konfiguruje właściwość „can close” komponentu. */
    canClose?: boolean;
    /** Emitowane podczas zamykania komponentu. */
    onClose?: (...args: unknown[]) => void;
  };
  FieldLabel: PeauiReactBaseProps & {
    /** Konfiguruje właściwość „for” komponentu. */
    for: string;
    /** Konfiguruje właściwość „text” komponentu. */
    text: string;
    /** Ustawia komponent w trybie tylko do odczytu. */
    readonly?: boolean;
    /** Oznacza wartość jako wymaganą. */
    required?: boolean;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Treść osadzana w nazwanym slocie „hint”. */
    hint?: ReactNode;
  };
  FormButtonCheckbox: PeauiReactBaseProps & {
    /** Unikalny identyfikator elementu w dokumencie. */
    id: string;
    /** Nazwa pola używana przez formularz lub nazwa zasobu. */
    name: string;
    /** Konfiguruje właściwość „is valid” komponentu. */
    isValid?: boolean;
    /** Oznacza wartość jako wymaganą. */
    required?: boolean;
    /** Wyłącza komponent i blokuje jego interakcje. */
    disabled?: boolean;
    /** Wariant rozmiaru komponentu. */
    size?: 'xxs' | 'xs' | 's' | 'm' | 'l';
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel?: string;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Bieżąca wartość kontrolowana przez v-model:value. */
    value?: boolean | undefined;
    /** Początkowa niekontrolowana wartość właściwości value. */
    defaultValue?: boolean | undefined;
    /** Callback React wywoływany po zmianie właściwości value. */
    onValueChange?: (value: boolean | undefined) => void;
  };
  FormButtonGroup: PeauiReactBaseProps & {
    /** Unikalny identyfikator elementu w dokumencie. */
    id: string;
    /** Nazwa pola używana przez formularz lub nazwa zasobu. */
    name: string;
    /** Widoczna etykieta opisująca element lub pole formularza. */
    label?: string;
    /** Wariant rozmiaru komponentu. */
    size?: 'xs' | 's' | 'm' | 'l';
    /** Konfiguruje właściwość „is toggle” komponentu. */
    isToggle?: boolean;
    /** Oznacza wartość jako wymaganą. */
    required?: boolean;
    /** Wyłącza komponent i blokuje jego interakcje. */
    disabled?: boolean;
    /** Ustawia komponent w trybie tylko do odczytu. */
    readonly?: boolean;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Lista opcji dostępnych do wyświetlenia lub wyboru. */
    options: PeauiOption[];
    /** Bieżąca wartość kontrolowana przez v-model:value. */
    value?: string | number | undefined;
    /** Początkowa niekontrolowana wartość właściwości value. */
    defaultValue?: string | number | undefined;
    /** Callback React wywoływany po zmianie właściwości value. */
    onValueChange?: (value: string | number | undefined) => void;
    /** Treść osadzana w nazwanym slocie „hint”. */
    hint?: ReactNode;
    /** Treść osadzana w nazwanym slocie „additionalHint”. */
    additionalHint?: ReactNode;
    /** Treść osadzana w nazwanym slocie „description”. */
    description?: ReactNode;
    /** Treść osadzana w nazwanym slocie „error”. */
    error?: ReactNode;
    /** Treść osadzana w nazwanym slocie „success”. */
    success?: ReactNode;
  };
  FormCheckbox: PeauiReactBaseProps & {
    /** Unikalny identyfikator elementu w dokumencie. */
    id: string;
    /** Nazwa pola używana przez formularz lub nazwa zasobu. */
    name: string;
    /** Konfiguruje właściwość „is valid” komponentu. */
    isValid?: boolean;
    /** Oznacza wartość jako wymaganą. */
    required?: boolean;
    /** Wyłącza komponent i blokuje jego interakcje. */
    disabled?: boolean;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Bieżąca wartość kontrolowana przez v-model:value. */
    value?: boolean | undefined;
    /** Początkowa niekontrolowana wartość właściwości value. */
    defaultValue?: boolean | undefined;
    /** Callback React wywoływany po zmianie właściwości value. */
    onValueChange?: (value: boolean | undefined) => void;
  };
  FormContainer: PeauiReactBaseProps & {
    /** Widoczna etykieta opisująca element lub pole formularza. */
    label: string;
    /** Konfiguruje właściwość „submit button label” komponentu. */
    submitButtonLabel?: string;
    /** Włącza stan ładowania i informuje o trwającej operacji. */
    isLoading?: boolean;
    /** Konfiguruje właściwość „show actions” komponentu. */
    showActions?: boolean;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Wyłącza komponent i blokuje jego interakcje. */
    disabled?: boolean;
    /** Konfiguruje właściwość „cancel button label” komponentu. */
    cancelButtonLabel?: string;
    /** Konfiguruje właściwość „actions position” komponentu. */
    actionsPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    /** Konfiguruje właściwość „show cancel button” komponentu. */
    showCancelButton?: boolean;
    /** Konfiguruje właściwość „size button” komponentu. */
    sizeButton?: 'xxs' | 'xs' | 's' | 'm' | 'l';
    /** Konfiguruje właściwość „use aria labelledby” komponentu. */
    useAriaLabelledby?: boolean;
    /** Emitowane, gdy komponent zgłasza zdarzenie „on:cancel”. */
    onCancel?: (...args: unknown[]) => void;
    /** Emitowane po zatwierdzeniu danych. */
    onSubmit?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „additional-before”. */
    additionalBefore?: ReactNode;
    /** Treść osadzana w nazwanym slocie „additional-after”. */
    additionalAfter?: ReactNode;
  };
  FormDatePicker: PeauiReactBaseProps & {
    /** Unikalny identyfikator elementu w dokumencie. */
    id: string;
    /** Pokazuje akcję pozwalającą wyczyścić bieżącą wartość. */
    canErase?: boolean;
    /** Treść wyświetlana za właściwą wartością pola. */
    after?: string;
    /** Treść wyświetlana przed właściwą wartością pola. */
    before?: string;
    /** Nazwa pola używana przez formularz lub nazwa zasobu. */
    name: string;
    /** Widoczna etykieta opisująca element lub pole formularza. */
    label?: string;
    /** Nazwa ikony wyświetlanej przed treścią pola. */
    iconBefore?: string;
    /** Oznacza wartość jako wymaganą. */
    required?: boolean;
    /** Tekst pomocniczy widoczny przed wprowadzeniem wartości. */
    placeholder?: string;
    /** Konfiguruje właściwość „range” komponentu. */
    range?: boolean;
    /** Konfiguruje właściwość „min date” komponentu. */
    minDate?: string;
    /** Konfiguruje właściwość „max date” komponentu. */
    maxDate?: string;
    /** Minimalna dozwolona wartość. */
    min?: string;
    /** Maksymalna dozwolona wartość albo szerokość. */
    max?: string;
    /** Wyłącza komponent i blokuje jego interakcje. */
    disabled?: boolean;
    /** Ustawia komponent w trybie tylko do odczytu. */
    readonly?: boolean;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Bieżąca wartość kontrolowana przez v-model:value. */
    value?: string | PeauiRangeValue<string> | undefined;
    /** Początkowa niekontrolowana wartość właściwości value. */
    defaultValue?: string | PeauiRangeValue<string> | undefined;
    /** Callback React wywoływany po zmianie właściwości value. */
    onValueChange?: (value: string | PeauiRangeValue<string> | undefined) => void;
    /** Emitowane po wybraniu akcji usunięcia. */
    onRemove?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „hint”. */
    hint?: ReactNode;
    /** Treść osadzana w nazwanym slocie „description”. */
    description?: ReactNode;
    /** Treść osadzana w nazwanym slocie „error”. */
    error?: ReactNode;
    /** Treść osadzana w nazwanym slocie „success”. */
    success?: ReactNode;
  };
  FormField: PeauiReactBaseProps & {
    /** Treść wyświetlana za właściwą wartością pola. */
    after?: string;
    /** Treść wyświetlana przed właściwą wartością pola. */
    before?: string;
    /** Pokazuje akcję pozwalającą wyczyścić bieżącą wartość. */
    canErase?: boolean;
    /** Wyłącza komponent i blokuje jego interakcje. */
    disabled?: boolean;
    /** Nazwa ikony wyświetlanej za treścią pola. */
    iconAfter?: string;
    /** Nazwa ikony wyświetlanej przed treścią pola. */
    iconBefore?: string;
    /** Unikalny identyfikator elementu w dokumencie. */
    id: string;
    /** Widoczna etykieta opisująca element lub pole formularza. */
    label?: string;
    /** Maksymalna liczba znaków możliwa do wprowadzenia. */
    maxLength?: number;
    /** Nazwa pola używana przez formularz lub nazwa zasobu. */
    name: string;
    /** Tekst pomocniczy widoczny przed wprowadzeniem wartości. */
    placeholder?: string;
    /** Ustawia komponent w trybie tylko do odczytu. */
    readonly?: boolean;
    /** Oznacza wartość jako wymaganą. */
    required?: boolean;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Konfiguruje właściwość „right erase position” komponentu. */
    rightErasePosition?: number;
    /** Bieżąca wartość kontrolowana przez v-model. */
    value?: string | number | string[] | null;
    /** Emitowane po wybraniu akcji usunięcia. */
    onRemove?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „hint”. */
    hint?: ReactNode;
    /** Treść osadzana w nazwanym slocie „additional”. */
    additional?: ReactNode;
    /** Treść osadzana w nazwanym slocie „description”. */
    description?: ReactNode;
    /** Treść osadzana w nazwanym slocie „error”. */
    error?: ReactNode;
    /** Treść osadzana w nazwanym slocie „success”. */
    success?: ReactNode;
  };
  FormFileUpload: PeauiReactBaseProps & {
    /** Konfiguruje właściwość „allowed types” komponentu. */
    allowedTypes?: string[];
    /** Wyłącza komponent i blokuje jego interakcje. */
    disabled?: boolean;
    /** Konfiguruje właściwość „max file size” komponentu. */
    maxFileSize?: number;
    /** Wariant wizualny komponentu. */
    variant?: 'primary' | 'danger';
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Wybrany plik kontrolowany przez v-model:file. */
    file?: File | undefined;
    /** Początkowa niekontrolowana wartość właściwości file. */
    defaultFile?: File | undefined;
    /** Callback React wywoływany po zmianie właściwości file. */
    onFileChange?: (value: File | undefined) => void;
    /** Emitowane po wybraniu akcji usunięcia. */
    onRemove?: (...args: unknown[]) => void;
  };
  FormFileUploadSimple: PeauiReactBaseProps & {
    /** Konfiguruje właściwość „allowed types” komponentu. */
    allowedTypes?: string[];
    /** Konfiguruje właściwość „context” komponentu. */
    context?: string;
    /** Wyłącza komponent i blokuje jego interakcje. */
    disabled?: boolean;
    /** Konfiguruje właściwość „max file size” komponentu. */
    maxFileSize?: number;
    /** Konfiguruje właściwość „max files” komponentu. */
    maxFiles?: number;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Lista wybranych plików kontrolowana przez v-model:files. */
    files?: File[];
    /** Początkowa niekontrolowana wartość właściwości files. */
    defaultFiles?: File[];
    /** Callback React wywoływany po zmianie właściwości files. */
    onFilesChange?: (value: File[]) => void;
  };
  FormInput: PeauiReactBaseProps & {
    /** Unikalny identyfikator elementu w dokumencie. */
    id: string;
    /** Pokazuje akcję pozwalającą wyczyścić bieżącą wartość. */
    canErase?: boolean;
    /** Treść wyświetlana za właściwą wartością pola. */
    after?: string;
    /** Treść wyświetlana przed właściwą wartością pola. */
    before?: string;
    /** Nazwa pola używana przez formularz lub nazwa zasobu. */
    name: string;
    /** Widoczna etykieta opisująca element lub pole formularza. */
    label?: string;
    /** Nazwa ikony wyświetlanej przed treścią pola. */
    iconBefore?: string;
    /** Nazwa ikony wyświetlanej za treścią pola. */
    iconAfter?: string;
    /** Maksymalna liczba znaków możliwa do wprowadzenia. */
    maxLength?: number;
    /** Oznacza wartość jako wymaganą. */
    required?: boolean;
    /** Tekst pomocniczy widoczny przed wprowadzeniem wartości. */
    placeholder?: string;
    /** Wyłącza komponent i blokuje jego interakcje. */
    disabled?: boolean;
    /** Ustawia komponent w trybie tylko do odczytu. */
    readonly?: boolean;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Bieżąca wartość kontrolowana przez v-model:value. */
    value?: string | undefined;
    /** Początkowa niekontrolowana wartość właściwości value. */
    defaultValue?: string | undefined;
    /** Callback React wywoływany po zmianie właściwości value. */
    onValueChange?: (value: string | undefined) => void;
    /** Emitowane po wybraniu akcji usunięcia. */
    onRemove?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „hint”. */
    hint?: ReactNode;
    /** Treść osadzana w nazwanym slocie „description”. */
    description?: ReactNode;
    /** Treść osadzana w nazwanym slocie „error”. */
    error?: ReactNode;
    /** Treść osadzana w nazwanym slocie „success”. */
    success?: ReactNode;
  };
  FormMultiSelect: PeauiReactBaseProps & {
    /** Unikalny identyfikator elementu w dokumencie. */
    id: string;
    /** Pokazuje akcję pozwalającą wyczyścić bieżącą wartość. */
    canErase?: boolean;
    /** Treść wyświetlana za właściwą wartością pola. */
    after?: string;
    /** Treść wyświetlana przed właściwą wartością pola. */
    before?: string;
    /** Nazwa pola używana przez formularz lub nazwa zasobu. */
    name: string;
    /** Widoczna etykieta opisująca element lub pole formularza. */
    label?: string;
    /** Nazwa ikony wyświetlanej przed treścią pola. */
    iconBefore?: string;
    /** Oznacza wartość jako wymaganą. */
    required?: boolean;
    /** Tekst pomocniczy widoczny przed wprowadzeniem wartości. */
    placeholder?: string;
    /** Wyłącza komponent i blokuje jego interakcje. */
    disabled?: boolean;
    /** Ustawia komponent w trybie tylko do odczytu. */
    readonly?: boolean;
    /** Konfiguruje właściwość „searchable” komponentu. */
    searchable?: boolean;
    /** Konfiguruje właściwość „with select all” komponentu. */
    withSelectAll?: boolean;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Lista opcji dostępnych do wyświetlenia lub wyboru. */
    options: PeauiOption[];
    /** Konfiguruje właściwość „placement” komponentu. */
    placement?: 'top' | 'bottom';
    /** Bieżąca wartość kontrolowana przez v-model:value. */
    value?: unknown[] | null | undefined;
    /** Początkowa niekontrolowana wartość właściwości value. */
    defaultValue?: unknown[] | null | undefined;
    /** Callback React wywoływany po zmianie właściwości value. */
    onValueChange?: (value: unknown[] | null | undefined) => void;
    /** Emitowane po wybraniu akcji usunięcia. */
    onRemove?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „hint”. */
    hint?: ReactNode;
    /** Treść osadzana w nazwanym slocie „description”. */
    description?: ReactNode;
    /** Treść osadzana w nazwanym slocie „error”. */
    error?: ReactNode;
    /** Treść osadzana w nazwanym slocie „success”. */
    success?: ReactNode;
  };
  FormNumber: PeauiReactBaseProps & {
    /** Unikalny identyfikator elementu w dokumencie. */
    id: string;
    /** Pokazuje akcję pozwalającą wyczyścić bieżącą wartość. */
    canErase?: boolean;
    /** Treść wyświetlana za właściwą wartością pola. */
    after?: string;
    /** Treść wyświetlana przed właściwą wartością pola. */
    before?: string;
    /** Nazwa pola używana przez formularz lub nazwa zasobu. */
    name: string;
    /** Widoczna etykieta opisująca element lub pole formularza. */
    label?: string;
    /** Nazwa ikony wyświetlanej przed treścią pola. */
    iconBefore?: string;
    /** Nazwa ikony wyświetlanej za treścią pola. */
    iconAfter?: string;
    /** Maksymalna dozwolona wartość albo szerokość. */
    max?: number;
    /** Minimalna dozwolona wartość. */
    min?: number;
    /** Krok zmiany wartości liczbowej. */
    step?: number;
    /** Oznacza wartość jako wymaganą. */
    required?: boolean;
    /** Tekst pomocniczy widoczny przed wprowadzeniem wartości. */
    placeholder?: string;
    /** Wyłącza komponent i blokuje jego interakcje. */
    disabled?: boolean;
    /** Ustawia komponent w trybie tylko do odczytu. */
    readonly?: boolean;
    /** Konfiguruje właściwość „is range visible” komponentu. */
    isRangeVisible?: boolean;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Bieżąca wartość kontrolowana przez v-model:value. */
    value?: number | undefined | string;
    /** Początkowa niekontrolowana wartość właściwości value. */
    defaultValue?: number | undefined | string;
    /** Callback React wywoływany po zmianie właściwości value. */
    onValueChange?: (value: number | undefined | string) => void;
    /** Treść osadzana w nazwanym slocie „hint”. */
    hint?: ReactNode;
    /** Treść osadzana w nazwanym slocie „description”. */
    description?: ReactNode;
    /** Treść osadzana w nazwanym slocie „error”. */
    error?: ReactNode;
    /** Treść osadzana w nazwanym slocie „success”. */
    success?: ReactNode;
  };
  FormPassword: PeauiReactBaseProps & {
    /** Unikalny identyfikator elementu w dokumencie. */
    id: string;
    /** Treść wyświetlana przed właściwą wartością pola. */
    before?: string;
    /** Nazwa pola używana przez formularz lub nazwa zasobu. */
    name: string;
    /** Widoczna etykieta opisująca element lub pole formularza. */
    label?: string;
    /** Nazwa ikony wyświetlanej przed treścią pola. */
    iconBefore?: string;
    /** Maksymalna liczba znaków możliwa do wprowadzenia. */
    maxLength?: number;
    /** Konfiguruje właściwość „can copy” komponentu. */
    canCopy?: boolean;
    /** Konfiguruje właściwość „can visible” komponentu. */
    canVisible?: boolean;
    /** Oznacza wartość jako wymaganą. */
    required?: boolean;
    /** Tekst pomocniczy widoczny przed wprowadzeniem wartości. */
    placeholder?: string;
    /** Wyłącza komponent i blokuje jego interakcje. */
    disabled?: boolean;
    /** Ustawia komponent w trybie tylko do odczytu. */
    readonly?: boolean;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Konfiguruje właściwość „show password aria label” komponentu. */
    showPasswordAriaLabel?: string;
    /** Konfiguruje właściwość „hide password aria label” komponentu. */
    hidePasswordAriaLabel?: string;
    /** Konfiguruje właściwość „copy password aria label” komponentu. */
    copyPasswordAriaLabel?: string;
    /** Konfiguruje właściwość „copy success message” komponentu. */
    copySuccessMessage?: string;
    /** Konfiguruje właściwość „copy error message” komponentu. */
    copyErrorMessage?: string;
    /** Konfiguruje właściwość „enable password strength meter” komponentu. */
    enablePasswordStrengthMeter?: boolean;
    /** Bieżąca wartość kontrolowana przez v-model:value. */
    value?: string | undefined;
    /** Początkowa niekontrolowana wartość właściwości value. */
    defaultValue?: string | undefined;
    /** Callback React wywoływany po zmianie właściwości value. */
    onValueChange?: (value: string | undefined) => void;
    /** Treść osadzana w nazwanym slocie „hint”. */
    hint?: ReactNode;
    /** Treść osadzana w nazwanym slocie „description”. */
    description?: ReactNode;
    /** Treść osadzana w nazwanym slocie „error”. */
    error?: ReactNode;
    /** Treść osadzana w nazwanym slocie „success”. */
    success?: ReactNode;
  };
  FormRadio: PeauiReactBaseProps & {
    /** Unikalny identyfikator elementu w dokumencie. */
    id: string;
    /** Nazwa pola używana przez formularz lub nazwa zasobu. */
    name: string;
    /** Konfiguruje właściwość „option value” komponentu. */
    optionValue: string | number | boolean;
    /** Konfiguruje właściwość „is valid” komponentu. */
    isValid?: boolean;
    /** Oznacza wartość jako wymaganą. */
    required?: boolean;
    /** Wyłącza komponent i blokuje jego interakcje. */
    disabled?: boolean;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Bieżąca wartość kontrolowana przez v-model:value. */
    value?: string | number | boolean | undefined;
    /** Początkowa niekontrolowana wartość właściwości value. */
    defaultValue?: string | number | boolean | undefined;
    /** Callback React wywoływany po zmianie właściwości value. */
    onValueChange?: (value: string | number | boolean | undefined) => void;
  };
  FormSelect: PeauiReactBaseProps & {
    /** Unikalny identyfikator elementu w dokumencie. */
    id: string;
    /** Pokazuje akcję pozwalającą wyczyścić bieżącą wartość. */
    canErase?: boolean;
    /** Treść wyświetlana za właściwą wartością pola. */
    after?: string;
    /** Treść wyświetlana przed właściwą wartością pola. */
    before?: string;
    /** Nazwa pola używana przez formularz lub nazwa zasobu. */
    name: string;
    /** Widoczna etykieta opisująca element lub pole formularza. */
    label?: string;
    /** Nazwa ikony wyświetlanej przed treścią pola. */
    iconBefore?: string;
    /** Oznacza wartość jako wymaganą. */
    required?: boolean;
    /** Preferred list placement. The list flips when the preferred side has insufficient space. */
    placement?: 'top' | 'bottom';
    /** Tekst pomocniczy widoczny przed wprowadzeniem wartości. */
    placeholder?: string;
    /** Wyłącza komponent i blokuje jego interakcje. */
    disabled?: boolean;
    /** Ustawia komponent w trybie tylko do odczytu. */
    readonly?: boolean;
    /** Konfiguruje właściwość „can write” komponentu. */
    canWrite?: boolean;
    /** Konfiguruje właściwość „searchable” komponentu. */
    searchable?: boolean;
    /** Wariant rozmiaru komponentu. */
    size?: 'xs' | 's' | 'm' | 'l';
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Lista opcji dostępnych do wyświetlenia lub wyboru. */
    options: PeauiOption[];
    /** Bieżąca wartość kontrolowana przez v-model:value. */
    value?: unknown;
    /** Początkowa niekontrolowana wartość właściwości value. */
    defaultValue?: unknown;
    /** Callback React wywoływany po zmianie właściwości value. */
    onValueChange?: (value: unknown) => void;
    /** Emitowane po wybraniu akcji usunięcia. */
    onRemove?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „hint”. */
    hint?: ReactNode;
    /** Treść osadzana w nazwanym slocie „description”. */
    description?: ReactNode;
    /** Treść osadzana w nazwanym slocie „error”. */
    error?: ReactNode;
    /** Treść osadzana w nazwanym slocie „success”. */
    success?: ReactNode;
  };
  FormTextarea: PeauiReactBaseProps & {
    /** Unikalny identyfikator elementu w dokumencie. */
    id: string;
    /** Nazwa pola używana przez formularz lub nazwa zasobu. */
    name: string;
    /** Konfiguruje właściwość „rows” komponentu. */
    rows?: number;
    /** Widoczna etykieta opisująca element lub pole formularza. */
    label?: string;
    /** Maksymalna liczba znaków możliwa do wprowadzenia. */
    maxLength?: number;
    /** Oznacza wartość jako wymaganą. */
    required?: boolean;
    /** Tekst pomocniczy widoczny przed wprowadzeniem wartości. */
    placeholder?: string;
    /** Wyłącza komponent i blokuje jego interakcje. */
    disabled?: boolean;
    /** Ustawia komponent w trybie tylko do odczytu. */
    readonly?: boolean;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Bieżąca wartość kontrolowana przez v-model:value. */
    value?: string | undefined;
    /** Początkowa niekontrolowana wartość właściwości value. */
    defaultValue?: string | undefined;
    /** Callback React wywoływany po zmianie właściwości value. */
    onValueChange?: (value: string | undefined) => void;
    /** Treść osadzana w nazwanym slocie „hint”. */
    hint?: ReactNode;
    /** Treść osadzana w nazwanym slocie „description”. */
    description?: ReactNode;
    /** Treść osadzana w nazwanym slocie „error”. */
    error?: ReactNode;
    /** Treść osadzana w nazwanym slocie „success”. */
    success?: ReactNode;
  };
  FormYearPicker: PeauiReactBaseProps & {
    /** Unikalny identyfikator elementu w dokumencie. */
    id: string;
    /** Pokazuje akcję pozwalającą wyczyścić bieżącą wartość. */
    canErase?: boolean;
    /** Treść wyświetlana za właściwą wartością pola. */
    after?: string;
    /** Treść wyświetlana przed właściwą wartością pola. */
    before?: string;
    /** Nazwa pola używana przez formularz lub nazwa zasobu. */
    name: string;
    /** Widoczna etykieta opisująca element lub pole formularza. */
    label?: string;
    /** Nazwa ikony wyświetlanej przed treścią pola. */
    iconBefore?: string;
    /** Oznacza wartość jako wymaganą. */
    required?: boolean;
    /** Tekst pomocniczy widoczny przed wprowadzeniem wartości. */
    placeholder?: string;
    /** Konfiguruje właściwość „range” komponentu. */
    range?: boolean;
    /** Konfiguruje właściwość „min year” komponentu. */
    minYear?: number;
    /** Konfiguruje właściwość „max year” komponentu. */
    maxYear?: number;
    /** Wyłącza komponent i blokuje jego interakcje. */
    disabled?: boolean;
    /** Ustawia komponent w trybie tylko do odczytu. */
    readonly?: boolean;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Bieżąca wartość kontrolowana przez v-model:value. */
    value?: number | PeauiRangeValue<number> | undefined;
    /** Początkowa niekontrolowana wartość właściwości value. */
    defaultValue?: number | PeauiRangeValue<number> | undefined;
    /** Callback React wywoływany po zmianie właściwości value. */
    onValueChange?: (value: number | PeauiRangeValue<number> | undefined) => void;
    /** Emitowane po wybraniu akcji usunięcia. */
    onRemove?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „hint”. */
    hint?: ReactNode;
    /** Treść osadzana w nazwanym slocie „description”. */
    description?: ReactNode;
    /** Treść osadzana w nazwanym slocie „error”. */
    error?: ReactNode;
    /** Treść osadzana w nazwanym slocie „success”. */
    success?: ReactNode;
  };
  CardPanel: PeauiReactBaseProps & {
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel?: string;
    /** Konfiguruje właściwość „is shadow enabled” komponentu. */
    isShadowEnabled?: boolean;
    /** Konfiguruje właściwość „is hover enabled” komponentu. */
    isHoverEnabled?: boolean;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Konfiguruje właściwość „as” komponentu. */
    as?: unknown;
    /** Konfiguruje właściwość „background color” komponentu. */
    backgroundColor?: 'default' | 'primary' | 'grey';
    /** Konfiguruje właściwość „border color” komponentu. */
    borderColor?: 'default' | 'primary' | 'grey';
    /** Wariant rozmiaru komponentu. */
    size?: 'xs' | 's' | 'm' | 'l';
    /** Treść osadzana w nazwanym slocie „header”. */
    header?: ReactNode;
  };
  FullscreenContainer: PeauiReactBaseProps & {
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel?: string;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Konfiguruje właściwość „open label” komponentu. */
    openLabel?: string;
    /** Konfiguruje właściwość „close label” komponentu. */
    closeLabel?: string;
  };
  GridItem: PeauiReactBaseProps & {
    /** Konfiguruje właściwość „colspan” komponentu. */
    colspan?: number;
    /** Definicje kolumn określające ich etykiety, klucze i sposób renderowania. */
    columns?: PeauiTableColumn[];
    /** Odstęp pomiędzy elementami układu. */
    gap?: number;
    /** Konfiguruje właściwość „grid” komponentu. */
    grid?: boolean;
  };
  GridSection: PeauiReactBaseProps & {
    /** Definicje kolumn określające ich etykiety, klucze i sposób renderowania. */
    columns?: PeauiTableColumn[];
    /** Odstęp pomiędzy elementami układu. */
    gap?: number;
    /** Treść osadzana w nazwanym slocie „additional”. */
    additional?: ReactNode;
  };
  PageLayout: PeauiReactBaseProps & {
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel?: string;
    /** Konfiguruje właściwość „is header sticky” komponentu. */
    isHeaderSticky?: boolean;
    /** Treść osadzana w nazwanym slocie „top”. */
    top?: ReactNode;
    /** Treść osadzana w nazwanym slocie „additional”. */
    additional?: ReactNode;
    /** Treść osadzana w nazwanym slocie „footer”. */
    footer?: ReactNode;
  };
  SectionDivider: PeauiReactBaseProps & {
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Konfiguruje właściwość „direction” komponentu. */
    direction?: 'horizontal' | 'vertical';
    /** Wariant rozmiaru komponentu. */
    size?: 's' | 'm' | 'l' | 'xl';
  };
  Breadcrumbs: PeauiReactBaseProps & {
    /** Konfiguruje właściwość „items” komponentu. */
    items: PeauiOption[];
    /** Konfiguruje właściwość „separator” komponentu. */
    separator?: string;
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel?: string;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Emitowane, gdy komponent zgłasza zdarzenie „on:navigate”. */
    onNavigate?: (...args: unknown[]) => void;
  };
  ListLimitControl: PeauiReactBaseProps & {
    /** Unikalny identyfikator elementu w dokumencie. */
    id: string;
    /** Widoczna etykieta opisująca element lub pole formularza. */
    label: string;
    /** Konfiguruje właściwość „limit list” komponentu. */
    limitList?: number[];
    /** Preferred list placement; it flips automatically when the selected side has insufficient space. */
    position?: 'top' | 'bottom';
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Wybrany limit elementów kontrolowany przez v-model:limit. */
    limit?: number;
    /** Początkowa niekontrolowana wartość właściwości limit. */
    defaultLimit?: number;
    /** Callback React wywoływany po zmianie właściwości limit. */
    onLimitChange?: (value: number) => void;
  };
  NavigationCard: PeauiReactBaseProps & {
    /** Główny tytuł prezentowany w komponencie. */
    title: string;
    /** Konfiguruje właściwość „path” komponentu. */
    path?: string;
    /** Dodatkowy opis objaśniający zawartość albo stan komponentu. */
    description: string;
    /** Wariant rozmiaru komponentu. */
    size?: 's' | 'm' | 'l';
    /** Wariant wizualny komponentu. */
    variant?: 'default' | 'complete' | 'during' | 'disabled' | 'hidden';
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel?: string;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
  };
  NavigationDisclosureCard: PeauiReactBaseProps & {
    /** Główny tytuł prezentowany w komponencie. */
    title: string;
    /** Dodatkowy opis objaśniający zawartość albo stan komponentu. */
    description: string;
    /** Unikalny identyfikator elementu w dokumencie. */
    id: string;
    /** Konfiguruje właściwość „path” komponentu. */
    path?: string;
    /** Steruje widocznością rozwijanego elementu albo warstwy. */
    open?: boolean;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel?: string;
    /** Treść osadzana w nazwanym slocie „title-additional”. */
    titleAdditional?: ReactNode;
    /** Treść osadzana w nazwanym slocie „description-additional”. */
    descriptionAdditional?: ReactNode;
  };
  NavigationIconCard: PeauiReactBaseProps & {
    /** Nazwa ikony prezentowanej przez komponent. */
    icon: string;
    /** Konfiguruje właściwość „text” komponentu. */
    text: string;
    /** Konfiguruje właściwość „path” komponentu. */
    path: string;
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel?: string;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
  };
  NavigationLink: PeauiReactBaseProps & {
    /** Konfiguruje właściwość „path” komponentu. */
    path: string;
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel?: string;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Wariant rozmiaru komponentu. */
    size?: 'm' | 's' | 'xs';
    /** Wariant wizualny komponentu. */
    variant?: 'default' | 'primary';
  };
  NavigationStepper: PeauiReactBaseProps & {
    /** Lista opcji dostępnych do wyświetlenia lub wyboru. */
    options?: PeauiOption[];
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel?: string;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Emitowane po wybraniu elementu. */
    onSelect?: (...args: unknown[]) => void;
  };
  NavigationTabs: PeauiReactBaseProps & {
    /** Konfiguruje właściwość „tabs” komponentu. */
    tabs?: PeauiOption[];
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel: string;
    /** Konfiguruje właściwość „with backround” komponentu. */
    withBackround?: boolean;
    /** Emitowane po wybraniu elementu. */
    onSelect?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „getSlotName(tab.key, ”. */
    'getSlotNameTabKey--'?: ReactNode;
  };
  PaginationControl: PeauiReactBaseProps & {
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel: string;
    /** Łączna liczba stron dostępnych w paginacji. */
    totalPages: number;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Aktualna strona kontrolowana przez v-model:page. */
    page?: number;
    /** Początkowa niekontrolowana wartość właściwości page. */
    defaultPage?: number;
    /** Callback React wywoływany po zmianie właściwości page. */
    onPageChange?: (value: number) => void;
  };
  DrawerPanel: PeauiReactBaseProps & {
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel: string;
    /** Stan otwarcia kontrolowany przez v-model:open. */
    open?: boolean;
    /** Początkowa niekontrolowana wartość właściwości open. */
    defaultOpen?: boolean;
    /** Callback React wywoływany po zmianie właściwości open. */
    onOpenChange?: (value: boolean) => void;
    /** Treść osadzana w nazwanym slocie „header”. */
    header?: ReactNode;
  };
  InfoTooltip: PeauiReactBaseProps & {
    /** Konfiguruje właściwość „placement” komponentu. */
    placement?:
      | 'top'
      | 'right'
      | 'bottom'
      | 'left'
      | 'top-left'
      | 'top-right'
      | 'bottom-left'
      | 'bottom-right';
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Wariant wizualny komponentu. */
    variant?: 'default' | 'disabled';
    /** Wyłącza komponent i blokuje jego interakcje. */
    disabled?: boolean;
    /** Treść osadzana w nazwanym slocie „title”. */
    title?: ReactNode;
    /** Treść osadzana w nazwanym slocie „description”. */
    description?: ReactNode;
  };
  ModalDialog: PeauiReactBaseProps & {
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel: string;
    /** Stan otwarcia kontrolowany przez v-model:open. */
    open?: boolean;
    /** Początkowa niekontrolowana wartość właściwości open. */
    defaultOpen?: boolean;
    /** Callback React wywoływany po zmianie właściwości open. */
    onOpenChange?: (value: boolean) => void;
    /** Treść osadzana w nazwanym slocie „header”. */
    header?: ReactNode;
  };
  PopoverButton: PeauiReactBaseProps & {
    /** Wariant rozmiaru komponentu. */
    size?: 'xs' | 's' | 'm' | 'l';
    /** Wariant wizualny komponentu. */
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    /** Konfiguruje właściwość „placement” komponentu. */
    placement?:
      | 'top'
      | 'right'
      | 'bottom'
      | 'left'
      | 'top-left'
      | 'top-right'
      | 'bottom-left'
      | 'bottom-right';
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Wyłącza komponent i blokuje jego interakcje. */
    disabled?: boolean;
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel?: string;
    /** Konfiguruje właściwość „match trigger width” komponentu. */
    matchTriggerWidth?: boolean;
    /** Konfiguruje właściwość „popup type” komponentu. */
    popupType?: 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog' | 'true';
    /** Konfiguruje właściwość „use aria label” komponentu. */
    useAriaLabel?: boolean;
    /** Treść osadzana w nazwanym slocie „content”. */
    content?: ReactNode;
  };
  PopoverOverlayer: PeauiReactBaseProps & {
    /** Konfiguruje właściwość „placement” komponentu. */
    placement?:
      | 'top'
      | 'right'
      | 'bottom'
      | 'left'
      | 'top-left'
      | 'top-right'
      | 'bottom-left'
      | 'bottom-right';
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Wyłącza komponent i blokuje jego interakcje. */
    disabled?: boolean;
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel?: string;
    /** Konfiguruje właściwość „content class” komponentu. */
    contentClass?: string;
    /** Konfiguruje właściwość „match trigger width” komponentu. */
    matchTriggerWidth?: boolean;
    /** Konfiguruje właściwość „popup type” komponentu. */
    popupType?: 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
    /** Emitowane, gdy komponent zgłasza zdarzenie „update:open”. */
    onOpenChange?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „content”. */
    content?: ReactNode;
  };
};

export type PeauiReactProps<Name extends ReactComponentName> = ReactComponentPropsMap[Name];
