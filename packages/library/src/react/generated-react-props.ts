// Ten plik jest generowany przez scripts/generate-react-components.mjs.
// Źródłem kontraktu są publiczne propsy, modele, zdarzenia i sloty komponentów Vue.

import type {
  FormFileUploadValue,
  FileUploadValueMode,
} from '../components/form/FormFileUpload/file-upload.shared';
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ImgHTMLAttributes,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  HTMLAttributes,
  CSSProperties,
  FocusEvent as ReactFocusEvent,
  FocusEventHandler,
  KeyboardEvent,
  KeyboardEventHandler,
  MouseEvent,
  MouseEventHandler,
  PointerEventHandler,
  ReactNode,
} from 'react';

export type ReactComponentName =
  | 'ImageView'
  | 'SvgIcon'
  | 'Avatar'
  | 'AvatarGroup'
  | 'CalculationResults'
  | 'CardCarousel'
  | 'CounterBadge'
  | 'DescriptionField'
  | 'DisclosurePanel'
  | 'KeyboardKey'
  | 'SectionHeading'
  | 'TableList'
  | 'TableListFooter'
  | 'TableListHeader'
  | 'TagChip'
  | 'TreeList'
  | 'VirtualList'
  | 'ButtonAction'
  | 'ButtonExport'
  | 'CopyButton'
  | 'InlineEdit'
  | 'InputSlider'
  | 'SearchInput'
  | 'SegmentedControl'
  | 'SelectableCard'
  | 'SplitButton'
  | 'ToggleButton'
  | 'ToggleGroup'
  | 'TransferList'
  | 'EmptyState'
  | 'MessageText'
  | 'NotificationCenter'
  | 'ProgressIndicator'
  | 'SkeletonLoading'
  | 'SpinnerLoader'
  | 'ToastAlert'
  | 'FormButtonCheckbox'
  | 'FormButtonGroup'
  | 'FormCheckbox'
  | 'FormColorPicker'
  | 'FormContainer'
  | 'FormDatePicker'
  | 'FormDateRangePicker'
  | 'FormDateTimePicker'
  | 'FormField'
  | 'FormFieldLabel'
  | 'FormFileUpload'
  | 'FormFileUploadSimple'
  | 'FormInput'
  | 'FormMultiSelect'
  | 'FormNumber'
  | 'FormPassword'
  | 'FormPinInput'
  | 'FormRadio'
  | 'FormRatingInput'
  | 'FormSelect'
  | 'FormSwitchToggle'
  | 'FormTagsInput'
  | 'FormTextarea'
  | 'FormTimePicker'
  | 'FormYearPicker'
  | 'CardPanel'
  | 'FullscreenContainer'
  | 'GridItem'
  | 'GridSection'
  | 'PageLayout'
  | 'ScrollArea'
  | 'SectionDivider'
  | 'Breadcrumbs'
  | 'CommandPalette'
  | 'ContextMenu'
  | 'DropdownMenu'
  | 'ListLimitControl'
  | 'MenuBar'
  | 'NavigationCard'
  | 'NavigationDisclosureCard'
  | 'NavigationIconCard'
  | 'NavigationLink'
  | 'NavigationStepper'
  | 'NavigationTabs'
  | 'PaginationControl'
  | 'DrawerPanel'
  | 'GuidedTour'
  | 'InfoTooltip'
  | 'ModalDialog'
  | 'PopoverButton'
  | 'PopoverOverlayer';

import type { SelectLabels, SelectValueMode } from '../components/form/FormSelect/select.shared';
export type PeauiSelectLabels = SelectLabels;

import type { TableColumn } from '../components/data-display/TableList/table.types';
export type PeauiReactBaseProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  role?: string;
  tabIndex?: number;
  onClick?: MouseEventHandler<HTMLElement>;
  onFocus?: FocusEventHandler<HTMLElement>;
  onBlur?: FocusEventHandler<HTMLElement>;
  onKeyDown?: KeyboardEventHandler<HTMLElement>;
  onPointerDown?: PointerEventHandler<HTMLElement>;
  'aria-label'?: string;
  'aria-hidden'?: boolean | 'false' | 'true';
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
  'data-testid'?: string;
};

export type PeauiRecord = Record<string, unknown>;
export type PeauiAvatarGroupItem = {
  id: string | number;
  name?: string;
  src?: string;
  alt?: string;
  initials?: string;
  status?: 'online' | 'offline' | 'away' | 'busy' | 'none';
  disabled?: boolean;
  metadata?: unknown;
};
export type PeauiToggleGroupValue = string | number;
export type PeauiToggleGroupModelValue = PeauiToggleGroupValue | PeauiToggleGroupValue[] | null;
export type PeauiToggleGroupItem = {
  value: PeauiToggleGroupValue;
  label: string;
  ariaLabel?: string;
  pressedLabel?: string;
  icon?: string;
  pressedIcon?: string;
  content?: 'text' | 'icon' | 'icon-text';
  disabled?: boolean;
  readonly?: boolean;
  loading?: boolean;
  metadata?: unknown;
};
export type PeauiSegmentedControlValue = string | number;
export type PeauiSegmentedControlModelValue = PeauiSegmentedControlValue | null;
export type PeauiSegmentedControlItem = {
  value: PeauiSegmentedControlValue;
  label: string;
  icon?: string;
  ariaLabel?: string;
  disabled?: boolean;
  metadata?: unknown;
};
export type PeauiTimePickerParts = { hour: number; minute: number; second: number };
export type PeauiTimePickerFormatContext = {
  format: '12h' | '24h';
  locale: string;
  showSeconds: boolean;
};
export type PeauiTimePickerOption = {
  disabled: boolean;
  label: string;
  value: number | 'am' | 'pm';
};
export type PeauiTimePickerInvalidDetail = {
  input: string;
  reason: 'empty' | 'format' | 'range' | 'step';
};
export type PeauiTimePickerParser = (
  input: string,
  context: PeauiTimePickerFormatContext,
) => string | PeauiTimePickerParts | null | undefined;
export type PeauiTimePickerFormatter = (
  value: string,
  context: PeauiTimePickerFormatContext,
) => string;
export type PeauiLocalDateTimeValue = { date: string; time: string };
export type PeauiDateTimePickerInvalidDetail = {
  input: string | Partial<PeauiLocalDateTimeValue> | undefined;
  reason: 'empty' | 'partial' | 'date' | 'time' | 'range' | 'disabled';
  section: 'date' | 'time' | 'value';
};
export type PeauiDateRangeValue = [string | undefined, string | undefined];
export type PeauiDateRangePreset = {
  disabled?: boolean;
  id: string;
  label: string;
  value: PeauiDateRangeValue;
};
export type PeauiDateRangeFormatContext = { endpoint: 'start' | 'end'; locale: string };
export type PeauiDateRangeFormatter = (
  value: string,
  context: PeauiDateRangeFormatContext,
) => string;
export type PeauiDateRangeParser = (
  input: string,
  context: PeauiDateRangeFormatContext,
) => string | undefined;
export type PeauiDateRangePickerInvalidDetail = {
  input: string | PeauiDateRangeValue | undefined;
  reason: 'empty' | 'partial' | 'format' | 'order' | 'range' | 'disabled';
  section: 'start' | 'end' | 'value';
};
export type PeauiFormColorPickerSwatch = { value: string; label?: string };
export type PeauiFormColorPickerInvalidDetail = { input: string; reason: 'empty' | 'format' };
export type PeauiFormColorPickerEyedropperErrorDetail = {
  error?: unknown;
  reason: 'unavailable' | 'cancelled' | 'failed';
};
export type PeauiFormPinInputInvalidDetail = {
  input: string;
  rejected: string;
  reason: 'character' | 'pattern' | 'transform' | 'overflow';
  index: number;
};
export type PeauiFormPinInputTransform =
  'none' | 'uppercase' | 'lowercase' | ((character: string, index: number) => string);
export type PeauiFormTagsInputItem = {
  id?: string | number;
  label: string;
  value?: unknown;
  disabled?: boolean;
};
export type PeauiFormTagsInputTag = string | PeauiFormTagsInputItem;
export type PeauiFormTagsInputInvalidDetail = {
  input: string;
  reason: 'duplicate' | 'empty' | 'invalid' | 'max' | 'suggestion-only';
  message: string;
  index: number;
};
export type PeauiFormTagsInputNormalizer = (input: string) => PeauiFormTagsInputTag;
export type PeauiFormTagsInputValidator = (
  tag: PeauiFormTagsInputTag,
  tags: readonly PeauiFormTagsInputTag[],
) => boolean | string;
export type PeauiFormTagsInputKeyGetter = (
  tag: PeauiFormTagsInputTag,
  index: number,
) => string | number;
export type PeauiFormTagsInputSerializer = (tag: PeauiFormTagsInputTag, index: number) => string;
export type PeauiFormTagsInputSuggestionProvider = (
  query: string,
  signal: AbortSignal,
) => Promise<readonly PeauiFormTagsInputTag[]>;
export type PeauiDropdownMenuItem = {
  id: string | number;
  type?: 'item' | 'checkbox' | 'radio' | 'separator' | 'group' | 'submenu';
  label?: string;
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
  checked?: boolean;
  value?: unknown;
  group?: string;
  children?: PeauiDropdownMenuItem[];
  variant?: 'default' | 'danger';
  closeOnSelect?: boolean;
  metadata?: unknown;
};
export type PeauiMenuBarMenu = {
  id: string | number;
  label: string;
  icon?: string;
  disabled?: boolean;
  items: PeauiDropdownMenuItem[];
};
export type PeauiContextMenuOpenDetail = {
  context: unknown;
  source: 'pointer' | 'keyboard' | 'long-press' | 'programmatic';
  x: number;
  y: number;
};
export type PeauiContextMenuCloseReason =
  'programmatic' | 'dismiss' | 'select' | 'scroll' | 'target-removed' | 'disabled';
export type PeauiContextMenuLongPressCancelReason =
  'move' | 'release' | 'pointer-cancel' | 'disabled' | 'target-removed';
export type PeauiOption = {
  id?: string;
  key?: string | number;
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
export type PeauiTableColumn = Omit<TableColumn, 'label'> & { label?: string; sortable?: boolean };
export type PeauiTreeNode = PeauiRecord & {
  id?: string | number;
  label?: string;
  children?: PeauiTreeNode[] | Record<string, PeauiTreeNode>;
};
export type PeauiSortDescriptor = { key: string; direction?: 'asc' | 'desc' };
export type PeauiLegacyRangeValue<Value> = { from?: Value; to?: Value; start?: Value; end?: Value };
export type PeauiPickerRangeValue<Value> = [Value, Value] | PeauiLegacyRangeValue<Value>;
/** @deprecated Prefer PeauiPickerRangeValue for picker models. */
export type PeauiRangeValue<Value> = PeauiLegacyRangeValue<Value>;

export type PeauiFileUploadModel =
  | { valueMode?: 'object'; onFileChange?: (value: FormFileUploadValue | undefined) => void }
  | { valueMode: 'file'; onFileChange?: (value: File | undefined) => void };

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
  SvgIcon: PeauiReactBaseProps & {
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Nazwa pola używana przez formularz lub nazwa zasobu. */
    name: string;
  };
  Avatar: PeauiReactBaseProps & {
    /** Adres obrazu prezentowanego w awatarze. */
    src?: string;
    /** Alternatywny opis obrazu. Pusty tekst oznacza obraz dekoracyjny. */
    alt?: string;
    /** Nazwa używana do wyliczenia inicjałów i nazwy dostępnej fallbacku. */
    name?: string;
    /** Jawne inicjały mają pierwszeństwo przed inicjałami wyliczonymi z name. */
    initials?: string;
    /** Wariant rozmiaru awatara. */
    size?: 'xs' | 's' | 'm' | 'l' | 'xl';
    /** Kształt awatara. */
    shape?: 'circle' | 'rounded';
    /** Status obecności prezentowany wizualnie i tekstowo. */
    status?: 'online' | 'offline' | 'away' | 'busy' | 'none';
    /** Własna dostępna etykieta statusu. */
    statusLabel?: string;
    /** Strategia ładowania natywnego obrazu. */
    loading?: 'eager' | 'lazy';
    /** Nazwa ikony używanej, gdy obraz i inicjały nie są dostępne. */
    fallbackIcon?: string;
    /** Renderuje semantyczny przycisk zamiast prezentacyjnego awatara. */
    interactive?: boolean;
    /** Wyłącza interaktywny awatar. */
    disabled?: boolean;
    /** Dostępna nazwa awatara lub przycisku. */
    ariaLabel?: string;
    /** Stabilny identyfikator używany w testach automatycznych. */
    dataTestId?: string;
    /** Emitowane po poprawnym załadowaniu obrazu. */
    onLoad?: (...args: unknown[]) => void;
    /** Emitowane, gdy operacja komponentu kończy się błędem. */
    onError?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „status”. */
    statusContent?: ReactNode;
  };
  AvatarGroup: PeauiReactBaseProps & {
    /** Osoby prezentowane w stabilnej kolejności wejściowej. */
    items?: PeauiAvatarGroupItem[];
    /** Maksymalna liczba awatarów widocznych przed licznikiem nadmiaru. */
    maxVisible?: number;
    /** Rozmiar awatarów i licznika. */
    size?: 'xs' | 's' | 'm' | 'l' | 'xl';
    /** Kształt awatarów i licznika. */
    shape?: 'circle' | 'rounded';
    /** Włącza kompaktowy układ z nachodzącymi na siebie elementami. */
    overlap?: boolean;
    /** Określa, która krawędź stosu znajduje się wizualnie na wierzchu. */
    direction?: 'start' | 'end';
    /** Sposób prezentacji pozycji poza limitem. */
    overflowMode?: 'count' | 'popover' | 'none';
    /** Pole lub funkcja zwracająca stabilny klucz elementu. */
    itemKey?:
      keyof PeauiAvatarGroupItem | ((item: PeauiAvatarGroupItem, index: number) => string | number);
    /** Dostępna nazwa listy widocznych osób. */
    ariaLabel?: string;
    /** Wyłącza wszystkie akcje grupy. */
    disabled?: boolean;
    /** Sygnalizuje ładowanie szczegółowej listy w popoverze. */
    loading?: boolean;
    /** Stabilny identyfikator używany w testach automatycznych. */
    dataTestId?: string;
    /** Stan otwarcia kontrolowany przez v-model:open. */
    open?: boolean;
    /** Początkowa niekontrolowana wartość właściwości open. */
    defaultOpen?: boolean;
    /** Callback React wywoływany po zmianie właściwości open. */
    onOpenChange?: (value: boolean) => void;
    /** Zwraca wybraną osobę oraz jej indeks w źródłowej tablicy. */
    onSelect?: (item: PeauiAvatarGroupItem, index: number) => void;
    /** Informuje o aktywowaniu licznika nadmiaru. */
    onOverflowClick?: (items: PeauiAvatarGroupItem[]) => void;
    /** Treść osadzana w nazwanym slocie „item”. */
    renderItem?: (item: PeauiAvatarGroupItem, index: number) => ReactNode;
    /** Treść osadzana w nazwanym slocie „overflow”. */
    renderOverflow?: (count: number, items: PeauiAvatarGroupItem[]) => ReactNode;
    /** Treść osadzana w nazwanym slocie „popover-header”. */
    popoverHeader?: ReactNode;
    /** Treść osadzana w nazwanym slocie „popover-item”. */
    renderPopoverItem?: (item: PeauiAvatarGroupItem, index: number) => ReactNode;
    /** Treść osadzana w nazwanym slocie „empty”. */
    empty?: ReactNode;
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
    /** Konfiguruje właściwość „pause label” komponentu. */
    pauseLabel?: string;
    /** Konfiguruje właściwość „resume label” komponentu. */
    resumeLabel?: string;
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
    /** Keeps the panel expanded and disables its toggle interaction. */
    alwaysOpen?: boolean;
    /** @deprecated Use `alwaysOpen`. */
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
  KeyboardKey: PeauiReactBaseProps & {
    /** Klawisz albo uporządkowana kombinacja tokenów. String rozdziela tokeny znakiem plus. */
    keys: string | readonly string[];
    /** Platforma używana do mapowania przenośnego tokenu Mod i symboli modyfikatorów. */
    platform?: 'auto' | 'windows' | 'mac' | 'linux' | 'generic';
    /** Symbole skracają zapis wizualny; pełne nazwy pozostają dostępne dla AT. */
    format?: 'symbol' | 'text';
    /** Rozmiar keycapów zgodny ze skalą kompaktowych komponentów PeaUI. */
    size?: 'xs' | 's' | 'm';
    /** Wariant inline dopasowuje komponent do wiersza tekstu; false tworzy osobny blok. */
    inline?: boolean;
    /** Wyłącznie wizualny separator kolejnych klawiszy. */
    separator?: string;
    /** Pełna dostępna nazwa zastępująca automatycznie złożoną frazę. */
    ariaLabel?: string;
    /** Ogranicza kontrast nieaktywnej wizualnie wskazówki bez dodawania semantyki disabled. */
    muted?: boolean;
    /** Stabilny selektor testowy elementu głównego. */
    dataTestId?: string;
    /** Treść osadzana w nazwanym slocie „key”. */
    renderKey?: (state: {
      accessibleLabel: string;
      index: number;
      key: string;
      platform: 'windows' | 'mac' | 'linux' | 'generic';
      token: string;
      visualLabel: string;
    }) => ReactNode;
    /** Treść osadzana w nazwanym slocie „separator”. */
    renderSeparator?: (state: { index: number; separator: string }) => ReactNode;
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
    /** Enables expandable detail rows. */
    isDetails?: boolean;
    /** @deprecated Use `isDetails`. */
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
    columns?: PeauiTableColumn[];
    /** Włącza tryb edycji danych. */
    editable?: boolean;
    /** Konfiguruje właściwość „empty description” komponentu. */
    emptyDescription?: boolean;
    /** Konfiguruje właściwość „empty description inline” komponentu. */
    emptyDescriptionInline?: string;
    /** Kolekcja rekordów prezentowanych przez komponent. */
    records?: PeauiRecord[];
    /** Liczba rekordów wyświetlanych na jednej stronie. */
    rowsPerPage?: number;
    /** Render one client-side page of records. Leave false for server-side pagination. */
    paginate?: boolean;
    /** Konfiguruje właściwość „pagination label” komponentu. */
    paginationLabel?: string;
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
    /** Aktualna strona kontrolowana przez v-model:page. */
    page?: number;
    /** Początkowa niekontrolowana wartość właściwości page. */
    defaultPage?: number;
    /** Callback React wywoływany po zmianie właściwości page. */
    onPageChange?: (value: number) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „on:action”. */
    onAction?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „on:createRecord”. */
    onCreateRecord?: (...args: unknown[]) => void;
    /** Prefer this correctly spelled event for row double-clicks. */
    onRowDoubleClick?: (...args: unknown[]) => void;
    /** @deprecated Use `on:dblclick`. Kept for backwards compatibility. */
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
    /** Emitowane po zmianie wartości komórki; przekazuje identyfikator rekordu i nową wartość. */
    onChangeValue?: (...args: unknown[]) => void;
    /** Emitowane po zmianie modelu „page”; przekaż nową wartość do v-model:page. */
    onUpdatePage?: (...args: unknown[]) => void;
    /** Renderuje niestandardową zawartość komórki tabeli. */
    renderCell?: (columnKey: string, record: PeauiRecord, rowIndex: number) => ReactNode;
    /** Treść osadzana w nazwanym slocie „details-record”. */
    detailsRecord?: ReactNode;
    /** Treść osadzana w nazwanym slocie „detials-record”. */
    detialsRecord?: ReactNode;
    /** Treść osadzana w nazwanym slocie „additionalRow”. */
    additionalRow?: ReactNode;
  };
  TableListFooter: PeauiReactBaseProps & {
    /** Total record count used to calculate the visible range and page count. */
    rowsNumber: number;
    /** Liczba rekordów wyświetlanych na jednej stronie. */
    rowsPerPage: number;
    /** Numer aktualnie wybranej strony. */
    page: number;
    /** Total page count; zero suppresses pagination. Pages are derived from rowsNumber/rowsPerPage. */
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
    /** Emitowane po zmianie modelu „filters-open”; przekaż nową wartość do v-model:filters-open. */
    onUpdateFiltersOpen?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „filters-drawer”. */
    filtersDrawer?: ReactNode;
    /** Treść osadzana w nazwanym slocie „additional-buttons”. */
    additionalButtons?: ReactNode;
    /** Treść osadzana w nazwanym slocie „additional-content”. */
    additionalContent?: ReactNode;
    /** Treść osadzana w nazwanym slocie „addtional-content”. */
    addtionalContent?: ReactNode;
    /** Treść osadzana w nazwanym slocie „additional-description”. */
    additionalDescription?: ReactNode;
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
    /** Emitowane po zmianie modelu „tree”; przekaż nową wartość do v-model:tree. */
    onUpdateTree?: (...args: unknown[]) => void;
  };
  VirtualList: PeauiReactBaseProps & {
    /** Kolekcja danych. W DOM pozostaje wyłącznie widoczny zakres z overscanem. */
    items?: PeauiOption[];
    /** Stała wysokość pojedynczego elementu w pikselach. */
    itemSize?: number;
    /** Liczba dodatkowych elementów renderowanych przed i za viewportem. */
    overscan?: number;
    /** Wysokość viewportu jako liczba pikseli albo poprawna wartość CSS. */
    height?: number | string;
    /** Pole lub funkcja zwracająca stabilny klucz string/number. */
    itemKey?: unknown;
    /** Pole lub funkcja zwracająca domyślną widoczną etykietę. */
    itemLabel?: unknown;
    /** Semantyka neutralnej listy albo interaktywnego listboxa. */
    semanticRole?: 'list' | 'listbox';
    /** Dostępna nazwa viewportu i listboxa. */
    ariaLabel?: string;
    /** Pokazuje początkowy albo przyrostowy stan ładowania. */
    loading?: boolean;
    /** Informuje, że aplikacja może dołączyć kolejne elementy po zdarzeniu reachEnd. */
    hasMore?: boolean;
    /** Jawny komunikat błędu prezentowany zamiast pustego stanu. */
    error?: string;
    /** Tytuł domyślnego pustego stanu. */
    emptyTitle?: string;
    /** Opis domyślnego pustego stanu. */
    emptyDescription?: string;
    /** Tekst wyświetlany po osiągnięciu kompletnego końca listy. */
    endLabel?: string;
    /** Stabilny selektor testowy elementu głównego. */
    dataTestId?: string;
    /** Indeks aktywnego elementu kontrolowany przez v-model:activeIndex. */
    activeIndex?: number | null;
    /** Początkowa niekontrolowana wartość właściwości activeIndex. */
    defaultActiveIndex?: number | null;
    /** Callback React wywoływany po zmianie właściwości activeIndex. */
    onActiveIndexChange?: (value: number | null) => void;
    /** Emitowane po zmianie renderowanego i rzeczywiście widocznego zakresu. */
    onVisibleRangeChange?: (...args: unknown[]) => void;
    /** Emitowane raz dla danego rozmiaru kolekcji po dotarciu do końca z hasMore. */
    onReachEnd?: (...args: unknown[]) => void;
    /** Emitowane podczas przewijania po obliczeniu nowego zakresu. */
    onScroll?: (...args: unknown[]) => void;
    /** Emitowane, gdy element albo jego interaktywny potomek otrzyma fokus. */
    onItemFocus?: (...args: unknown[]) => void;
    /** Emitowane dla niepoprawnych parametrów pomiaru zastąpionych bezpiecznym fallbackiem. */
    onMeasureError?: (...args: unknown[]) => void;
    /** Emitowane po zmianie modelu „activeIndex”; przekaż nową wartość do v-model:activeIndex. */
    onUpdateActiveIndex?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „item”. */
    item?: ReactNode;
    /** Treść osadzana w nazwanym slocie „empty”. */
    empty?: ReactNode;
    /** Treść osadzana w nazwanym slocie „before”. */
    before?: ReactNode;
    /** Treść osadzana w nazwanym slocie „after”. */
    after?: ReactNode;
    /** Treść osadzana w nazwanym slocie „footer”. */
    footer?: ReactNode;
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
  CopyButton: PeauiReactBaseProps & {
    /** Dokładna wartość tekstowa kopiowana, gdy getText nie został przekazany. */
    text?: string;
    /** Pobiera wartość w chwili aktywacji; obsługuje również źródła asynchroniczne. */
    getText?: unknown;
    /** Czas powrotu ukończonej operacji do stanu początkowego; zero zachowuje stan. */
    resetDelay?: number;
    /** Stała dostępna nazwa akcji i domyślna widoczna etykieta. */
    label?: string;
    /** Widoczny i ogłaszany komunikat powodzenia. */
    copiedLabel?: string;
    /** Widoczny i ogłaszany komunikat błędu. */
    errorLabel?: string;
    /** Widoczny tekst podczas trwającej operacji asynchronicznej. */
    loadingLabel?: string;
    /** Określa, czy przycisk wyświetla ikonę, tekst, czy oba elementy. */
    content?: 'icon' | 'text' | 'icon-text';
    /** Wariant wizualny zgodny z ButtonAction. */
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    /** Rozmiar zgodny ze skalą ButtonAction. */
    size?: 'xxs' | 'xs' | 's' | 'm' | 'l';
    /** Stan zajętości kontrolowany z zewnątrz. */
    loading?: boolean;
    /** Blokuje aktywację. */
    disabled?: boolean;
    /** Wyświetla komunikat stanu obok akcji zamiast wyłącznie dla czytnika ekranu. */
    showStatus?: boolean;
    /** Opcjonalna stała dostępna nazwa zastępująca label. */
    ariaLabel?: string;
    /** Natywny typ przycisku. */
    type?: 'button' | 'submit' | 'reset';
    /** Stały identyfikator używany w testach automatycznych. */
    dataTestId?: string;
    /** Emitowane po rozwiązaniu dokładnego tekstu i przed próbą zapisu do schowka. */
    onCopy?: (...args: unknown[]) => void;
    /** Emitowane po poprawnym zakończeniu operacji komponentu. */
    onSuccess?: (...args: unknown[]) => void;
    /** Emitowane, gdy operacja komponentu kończy się błędem. */
    onError?: (...args: unknown[]) => void;
    /** Emitowane po każdej wewnętrznej zmianie statusu operacji. */
    onStatusChange?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „icon”. */
    icon?: ReactNode;
    /** Treść osadzana w nazwanym slocie „copied-icon”. */
    copiedIcon?: ReactNode;
    /** Treść osadzana w nazwanym slocie „status”. */
    status?: ReactNode;
  };
  InlineEdit: PeauiReactBaseProps & {
    /** Rodzaj wbudowanego edytora albo własna kontrolka ze slotu editor. */
    editor?: 'text' | 'number' | 'select' | 'textarea' | 'custom';
    /** Właściwości przekazywane do istniejącego komponentu formularza. */
    editorProps?: Record<string, unknown>;
    /** Dodatkowy sposób rozpoczęcia edycji; przycisk pozostaje zawsze dostępny. */
    activation?: 'button' | 'click' | 'dblclick';
    /** Widoczne przyciski, skróty klawiaturowe albo oba mechanizmy zapisu. */
    actions?: 'buttons' | 'keyboard' | 'both';
    /** Układ dopasowany do tekstu lub zajmujący pełną szerokość. */
    display?: 'inline' | 'block';
    /** Zachowanie klawisza Tab podczas edycji. */
    tabBehavior?: 'commit' | 'cancel' | 'stay';
    /** Zapis lokalny albo asynchroniczny sterowany przez aplikację. */
    saveMode?: 'sync' | 'async';
    /** Synchroniczna walidacja szkicu przed zapisem. */
    validate?: unknown;
    /** Oczekiwanie na zewnętrzny zapis. */
    loading?: boolean;
    /** Błąd zwrócony przez zewnętrzny zapis. */
    error?: string;
    /** Wyłącza komponent i blokuje jego interakcje. */
    disabled?: boolean;
    /** Ustawia komponent w trybie tylko do odczytu. */
    readonly?: boolean;
    /** Konfiguruje właściwość „empty text” komponentu. */
    emptyText?: string;
    /** Konfiguruje właściwość „edit aria label” komponentu. */
    editAriaLabel?: string;
    /** Konfiguruje właściwość „save label” komponentu. */
    saveLabel?: string;
    /** Konfiguruje właściwość „cancel label” komponentu. */
    cancelLabel?: string;
    /** Dostępny komunikat opisujący trwającą operację. */
    loadingLabel?: string;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Bieżąca wartość kontrolowana przez v-model:value. */
    value?: unknown;
    /** Początkowa niekontrolowana wartość właściwości value. */
    defaultValue?: unknown;
    /** Callback React wywoływany po zmianie właściwości value. */
    onValueChange?: (value: unknown) => void;
    /** Wartość kontrolowana przez v-model:editing. */
    editing?: boolean;
    /** Początkowa niekontrolowana wartość właściwości editing. */
    defaultEditing?: boolean;
    /** Callback React wywoływany po zmianie właściwości editing. */
    onEditingChange?: (value: boolean) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „edit”. */
    onEdit?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „save”. */
    onSave?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „cancel”. */
    onCancel?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „invalid”. */
    onInvalid?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „draftChange”. */
    onDraftChange?: (...args: unknown[]) => void;
    /** Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value. */
    onUpdateValue?: (...args: unknown[]) => void;
    /** Emitowane po zmianie modelu „editing”; przekaż nową wartość do v-model:editing. */
    onUpdateEditing?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „empty”. */
    empty?: ReactNode;
  };
  InputSlider: PeauiReactBaseProps & {
    /** Unikalny identyfikator elementu w dokumencie. */
    id?: string;
    /** Identyfikator natywnego formularza będącego właścicielem kontrolki. */
    form?: string;
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
    /** Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value. */
    onUpdateValue?: (...args: unknown[]) => void;
  };
  SearchInput: PeauiReactBaseProps & {
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel?: string;
    /** Tekst pomocniczy widoczny przed wprowadzeniem wartości. */
    placeholder?: string;
    /** Konfiguruje właściwość „debounce time” komponentu. */
    debounceTime?: number;
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
    /** Emitowane, gdy komponent zgłasza zdarzenie „on:search”. */
    onSearch?: (...args: unknown[]) => void;
    /** Emitowane po wybraniu akcji usunięcia. */
    onRemove?: (...args: unknown[]) => void;
    /** Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value. */
    onUpdateValue?: (...args: unknown[]) => void;
  };
  SegmentedControl: PeauiReactBaseProps & {
    /** Identyfikator grupy radio. */
    id?: string;
    /** Nazwa ukrytego pola wysyłanego z formularzem. */
    name?: string;
    /** Niewielki zestaw wzajemnie wykluczających się pozycji. */
    items?: PeauiSegmentedControlItem[];
    /** Rozmiar wszystkich segmentów. */
    size?: 's' | 'm' | 'l';
    /** Równy albo naturalny rozkład szerokości segmentów. */
    distribution?: 'equal' | 'auto';
    /** Rozciąga kontrolkę do szerokości kontenera. */
    fullWidth?: boolean;
    /** Prezentuje tekst, ikonę albo oba elementy. */
    content?: 'text' | 'icon' | 'icon-text';
    /** Wyłącza całą kontrolkę i usuwa ją z kolejności tabulatora. */
    disabled?: boolean;
    /** Kierunek układu oraz nawigacji klawiaturą. */
    orientation?: 'horizontal' | 'vertical';
    /** Określa, czy nawigacja od razu wybiera segment, czy tylko przenosi fokus. */
    activation?: 'automatic' | 'manual';
    /** Zapętla nawigację pomiędzy skrajnymi dostępnymi segmentami. */
    loop?: boolean;
    /** Dostępna nazwa grupy radio. */
    ariaLabel?: string;
    /** Stabilny selektor do testów integracyjnych. */
    dataTestId?: string;
    /** Bieżąca wartość kontrolowana przez v-model:value. */
    value?: PeauiSegmentedControlModelValue;
    /** Początkowa niekontrolowana wartość właściwości value. */
    defaultValue?: PeauiSegmentedControlModelValue;
    /** Callback React wywoływany po zmianie właściwości value. */
    onValueChange?: (value: PeauiSegmentedControlModelValue) => void;
    /** Emitowany po skutecznym wyborze innego segmentu. */
    onChange?: (
      value: PeauiSegmentedControlValue,
      item: PeauiSegmentedControlItem,
      event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>,
    ) => void;
    /** Emitowany po przeniesieniu aktywnego fokusu. */
    onFocusChange?: (item: PeauiSegmentedControlItem, index: number) => void;
    /** Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value. */
    onUpdateValue?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „item”. */
    renderItem?: (
      item: PeauiSegmentedControlItem,
      state: { selected: boolean; disabled: boolean; index: number },
    ) => ReactNode;
    /** Treść osadzana w nazwanym slocie „item-icon”. */
    renderItemIcon?: (
      item: PeauiSegmentedControlItem,
      state: { selected: boolean; index: number },
    ) => ReactNode;
    /** Treść osadzana w nazwanym slocie „indicator”. */
    renderIndicator?: (item: PeauiSegmentedControlItem | null, index: number) => ReactNode;
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
  SplitButton: PeauiReactBaseProps & {
    /** Widoczna etykieta oraz awaryjna dostępna nazwa głównej akcji. */
    label: string;
    /** Akcje alternatywne renderowane przez DropdownMenu. */
    items?: PeauiDropdownMenuItem[];
    /** Opcjonalna nazwa ikony PeaUI poprzedzającej etykietę. */
    icon?: string;
    /** Wariant kolorystyczny obu części kontrolki. */
    variant?: 'primary' | 'secondary' | 'danger';
    /** Rozmiar zgodny z ButtonAction. */
    size?: 'xxs' | 'xs' | 's' | 'm' | 'l';
    /** Natywny typ przycisku głównej akcji. */
    type?: 'button' | 'submit' | 'reset';
    /** Wyrównanie powierzchni menu do początku lub końca kontrolki. */
    menuAlign?: 'start' | 'end';
    /** Wyłącza obie części kontrolki. */
    disabled?: boolean;
    /** Wyłącza wyłącznie główną akcję. */
    primaryDisabled?: boolean;
    /** Wyłącza wyłącznie trigger menu i zamyka otwarte menu. */
    menuDisabled?: boolean;
    /** Blokuje główną akcję i pokazuje jej stan zajętości; menu pozostaje niezależne. */
    loading?: boolean;
    /** Pokazuje dostępny stan ładowania wewnątrz otwartego menu. */
    menuLoading?: boolean;
    /** Dostępna nazwa grupy dwóch przycisków. */
    ariaLabel?: string;
    /** Dostępna nazwa przycisku otwierającego menu. */
    menuAriaLabel?: string;
    /** Tekst statusu głównej akcji przekazywany technologiom asystującym. */
    loadingLabel?: string;
    /** Tekst dostępnego stanu ładowania menu. */
    menuLoadingLabel?: string;
    /** Tekst pustego stanu menu. */
    emptyLabel?: string;
    /** Stabilny identyfikator używany w testach automatycznych. */
    dataTestId?: string;
    /** Stan otwarcia kontrolowany przez v-model:open. */
    open?: boolean;
    /** Początkowa niekontrolowana wartość właściwości open. */
    defaultOpen?: boolean;
    /** Callback React wywoływany po zmianie właściwości open. */
    onOpenChange?: (value: boolean) => void;
    /** Emitowane wyłącznie po aktywowaniu lewej, głównej części. */
    onPrimaryClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    /** Emitowane po wyborze dostępnej pozycji menu. */
    onSelect?: (item: PeauiDropdownMenuItem, path: number[]) => void;
    /** Treść osadzana w nazwanym slocie „label”. */
    labelContent?: ReactNode;
    /** Treść osadzana w nazwanym slocie „icon”. */
    iconContent?: ReactNode;
    /** Treść osadzana w nazwanym slocie „menu-trigger-icon”. */
    menuTriggerIconContent?: ReactNode;
    /** Treść osadzana w nazwanym slocie „menu-item”. */
    renderMenuItem?: (item: PeauiDropdownMenuItem, path: number[]) => ReactNode;
    /** Treść osadzana w nazwanym slocie „menu-item-icon”. */
    renderMenuItemIcon?: (item: PeauiDropdownMenuItem, path: number[]) => ReactNode;
    /** Treść osadzana w nazwanym slocie „menu-item-shortcut”. */
    renderMenuItemShortcut?: (item: PeauiDropdownMenuItem, path: number[]) => ReactNode;
    /** Treść osadzana w nazwanym slocie „group-label”. */
    renderGroupLabel?: (item: PeauiDropdownMenuItem, path: number[]) => ReactNode;
    /** Treść osadzana w nazwanym slocie „empty”. */
    emptyContent?: ReactNode;
    /** Treść osadzana w nazwanym slocie „menu-loading”. */
    menuLoadingContent?: ReactNode;
  };
  ToggleButton: PeauiReactBaseProps & {
    /** Identyfikator natywnego przycisku. */
    id?: string;
    /** Stała etykieta widoczna w stanie nieaktywnym i używana jako dostępna nazwa. */
    label?: string;
    /** Opcjonalna etykieta widoczna po włączeniu; nie zmienia dostępnej nazwy. */
    pressedLabel?: string;
    /** Nazwa dekoracyjnej ikony SvgIcon. */
    icon?: string;
    /** Opcjonalna ikona dekoracyjna widoczna po włączeniu. */
    pressedIcon?: string;
    /** Określa, czy przycisk pokazuje tekst, ikonę czy oba elementy. */
    content?: 'text' | 'icon' | 'icon-text';
    /** Wariant wizualny powierzchni. */
    variant?: 'default' | 'outline' | 'ghost';
    /** Rozmiar zgodny ze skalą ButtonAction; cel dotykowy zachowuje minimum 44 px. */
    size?: 'xxs' | 'xs' | 's' | 'm' | 'l';
    /** Typ natywnego przycisku. */
    type?: 'button' | 'submit' | 'reset';
    /** Pozwala jawnie zawijać długi tekst zamiast utrzymywać go w jednym wierszu. */
    allowWrap?: boolean;
    /** Wyłącza kontrolkę i usuwa ją z kolejności fokusu. */
    disabled?: boolean;
    /** Blokuje zmianę, ale pozostawia kontrolkę w kolejności fokusu. */
    readonly?: boolean;
    /** Blokuje zmianę i eksponuje stan zajętości. */
    loading?: boolean;
    /** Stała dostępna nazwa, wymagana dla przycisku wyłącznie ikonowego bez label. */
    ariaLabel?: string;
    /** Dostępny komunikat stanu ładowania. */
    loadingLabel?: string;
    /** Stabilny identyfikator używany w testach automatycznych. */
    dataTestId?: string;
    /** Bieżąca wartość kontrolowana przez v-model:value. */
    value?: boolean;
    /** Początkowa niekontrolowana wartość właściwości value. */
    defaultValue?: boolean;
    /** Callback React wywoływany po zmianie właściwości value. */
    onValueChange?: (value: boolean) => void;
    /** Emitowane po zmianie wraz z nowym stanem i natywnym zdarzeniem. */
    onChange?: (...args: unknown[]) => void;
    /** Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value. */
    onUpdateValue?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „icon”. */
    iconContent?: ReactNode;
    /** Treść osadzana w nazwanym slocie „pressed-icon”. */
    pressedIconContent?: ReactNode;
  };
  ToggleGroup: PeauiReactBaseProps & {
    /** Identyfikator grupy i powiązanych opisów. */
    id?: string;
    /** Nazwa ukrytych pól przekazywanych z formularzem. */
    name?: string;
    /** Pozycje zarządzane przez komponent. */
    items?: PeauiToggleGroupItem[];
    /** Tryb pojedynczego albo wielokrotnego wyboru. */
    type?: 'single' | 'multiple';
    /** Kierunek układu i nawigacji klawiaturą. */
    orientation?: 'horizontal' | 'vertical';
    /** Oddzielny albo połączony wygląd przycisków. */
    appearance?: 'separate' | 'attached';
    /** Semantyka dostępności grupy. */
    semanticRole?: 'toolbar' | 'group';
    /** Zachowanie grupy przy braku miejsca. */
    overflow?: 'wrap' | 'scroll';
    /** Empty selection blocks native form submission; readonly and disabled are exempt. */
    required?: boolean;
    /** Pozwala wyłączyć ostatnią aktywną pozycję, gdy grupa nie jest wymagana. */
    allowEmpty?: boolean;
    /** Zapętla nawigację strzałkami pomiędzy skrajnymi pozycjami. */
    loop?: boolean;
    /** Wyłącza całą grupę i usuwa ją z kolejności tabulatora. */
    disabled?: boolean;
    /** Blokuje zmianę wartości, zachowując możliwość odczytu i fokusu. */
    readonly?: boolean;
    /** Widoczna etykieta grupy. */
    label?: string;
    /** Zewnętrzny komunikat błędu. */
    error?: string;
    /** Komunikat używany dla pustej wymaganej grupy. */
    requiredMessage?: string;
    /** Dostępna nazwa, gdy widoczna etykieta nie jest potrzebna. */
    ariaLabel?: string;
    /** Rozmiar wszystkich przycisków. */
    size?: 'xxs' | 'xs' | 's' | 'm' | 'l';
    /** Wariant wizualny wszystkich przycisków. */
    variant?: 'default' | 'outline' | 'ghost';
    /** Stabilny selektor do testów integracyjnych. */
    dataTestId?: string;
    /** Bieżąca wartość kontrolowana przez v-model:value. */
    value?: PeauiToggleGroupModelValue;
    /** Początkowa niekontrolowana wartość właściwości value. */
    defaultValue?: PeauiToggleGroupModelValue;
    /** Callback React wywoływany po zmianie właściwości value. */
    onValueChange?: (value: PeauiToggleGroupModelValue) => void;
    /** Emitowany po zaakceptowanej zmianie wyboru. */
    onChange?: (
      value: PeauiToggleGroupModelValue,
      item: PeauiToggleGroupItem,
      event: MouseEvent<HTMLButtonElement>,
    ) => void;
    /** Emitowany po przeniesieniu aktywnego fokusu w grupie. */
    onFocusChange?: (item: PeauiToggleGroupItem, index: number) => void;
    /** Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value. */
    onUpdateValue?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „item”. */
    renderItem?: (
      item: PeauiToggleGroupItem,
      state: { pressed: boolean; disabled: boolean; index: number },
    ) => ReactNode;
    /** Treść osadzana w nazwanym slocie „label”. */
    labelContent?: ReactNode;
    /** Treść osadzana w nazwanym slocie „error”. */
    errorContent?: ReactNode;
  };
  TransferList: PeauiReactBaseProps & {
    /** Render a bounded fixed-height window in each panel. */
    virtual?: boolean;
    /** Height of a virtual row, in pixels. */
    optionHeight?: number;
    /** Stabilny identyfikator komponentu i jego relacji ARIA. */
    id?: string;
    /** Pełny katalog elementów. Pierwszy element o danym kluczu wygrywa. */
    items?: PeauiOption[];
    /** Pole lub funkcja zwracająca stabilny klucz string/number. */
    itemKey?: unknown;
    /** Pole lub funkcja zwracająca widoczną etykietę. */
    itemLabel?: unknown;
    /** Pokazuje niezależny filtr w obu panelach. */
    searchable?: boolean;
    /** Sortowanie widoku; false zachowuje kolejność źródłową. */
    sort?: unknown;
    /** Zachowuje kolejność tablicy value w panelu docelowym. */
    preserveOrder?: boolean;
    /** Klucze blokowane niezależnie od pola disabled elementu. */
    disabledKeys?: unknown;
    /** Stan ładowania całego komponentu albo wybranego panelu. */
    loading?: unknown;
    /** Lokalizowane teksty interfejsu. */
    labels?: unknown;
    /** Wyłącza wszystkie operacje i usuwa listy z kolejności Tab. */
    disabled?: boolean;
    /** Preferowany układ; horizontal automatycznie składa się na mobile. */
    orientation?: 'horizontal' | 'vertical';
    /** Standardowa lub kompaktowa gęstość wierszy. */
    size?: 'compact' | 'standard';
    /** Locale filtrowania i sortowania. */
    locale?: string;
    /** Dostępna nazwa całego przepływu. */
    ariaLabel?: string;
    /** Opcjonalny błąd wspólny dla obu list. */
    error?: string;
    /** Stabilny selektor testowy. */
    dataTestId?: string;
    /** Bieżąca wartość kontrolowana przez v-model:value. */
    value?: unknown;
    /** Początkowa niekontrolowana wartość właściwości value. */
    defaultValue?: unknown;
    /** Callback React wywoływany po zmianie właściwości value. */
    onValueChange?: (value: unknown) => void;
    /** Wartość kontrolowana przez v-model:sourceSelected. */
    sourceSelected?: unknown;
    /** Początkowa niekontrolowana wartość właściwości sourceSelected. */
    defaultSourceSelected?: unknown;
    /** Callback React wywoływany po zmianie właściwości sourceSelected. */
    onSourceSelectedChange?: (value: unknown) => void;
    /** Wartość kontrolowana przez v-model:targetSelected. */
    targetSelected?: unknown;
    /** Początkowa niekontrolowana wartość właściwości targetSelected. */
    defaultTargetSelected?: unknown;
    /** Callback React wywoływany po zmianie właściwości targetSelected. */
    onTargetSelectedChange?: (value: unknown) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „move”. */
    onMove?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „search”. */
    onSearch?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „selectionChange”. */
    onSelectionChange?: (...args: unknown[]) => void;
    /** Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value. */
    onUpdateValue?: (...args: unknown[]) => void;
    /** Emitowane po zmianie modelu „sourceSelected”; przekaż nową wartość do v-model:sourceSelected. */
    onUpdateSourceSelected?: (...args: unknown[]) => void;
    /** Emitowane po zmianie modelu „targetSelected”; przekaż nową wartość do v-model:targetSelected. */
    onUpdateTargetSelected?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „source-header”. */
    sourceHeader?: ReactNode;
    /** Treść osadzana w nazwanym slocie „target-header”. */
    targetHeader?: ReactNode;
    /** Treść osadzana w nazwanym slocie „item”. */
    item?: ReactNode;
    /** Treść osadzana w nazwanym slocie „source-empty”. */
    sourceEmpty?: ReactNode;
    /** Treść osadzana w nazwanym slocie „target-empty”. */
    targetEmpty?: ReactNode;
    /** Treść osadzana w nazwanym slocie „controls”. */
    controls?: ReactNode;
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
      | 'heading-s'
      | 'heading-m'
      | 'heading-l';
    /** Wariant wizualny komponentu. */
    variant?: 'info' | 'error' | 'success' | 'danger' | 'default' | 'white';
    /** Konfiguruje właściwość „with icon” komponentu. */
    withIcon?: boolean;
    /** Konfiguruje właściwość „own icon” komponentu. */
    ownIcon?: string;
  };
  NotificationCenter: PeauiReactBaseProps & {
    /** Notifications rendered in their supplied order. The component never mutates them. */
    items: PeauiOption[];
    /** Optional controlled unread count, useful when not all pages are loaded. */
    unreadCount?: number;
    /** Custom filter definitions. Defaults to All and Unread. */
    filters?: unknown;
    /** Groups visible notifications without changing their order. */
    groupBy?: 'none' | 'date' | 'type';
    /** Shows the initial loading state. */
    loading?: boolean;
    /** Shows the incremental loading state. */
    loadingMore?: boolean;
    /** Enables requesting another page. */
    hasMore?: boolean;
    /** Error message displayed without modifying the supplied items. */
    error?: string | null;
    /** Locale used by the default date formatter. */
    locale?: string;
    /** Optional application date formatter. */
    formatDate?: unknown;
    /** Accessible name of the notification center. */
    ariaLabel?: string;
    /** Stable test selector. */
    dataTestId?: string;
    /** Surface treatment for a panel, drawer body, or full page. */
    variant?: 'panel' | 'drawer-content' | 'page';
    /** Vertical spacing density. */
    density?: 'compact' | 'comfortable';
    /** How additional data is requested. */
    paginationMode?: 'pagination' | 'infinite';
    /** Disables the mark-all intent while the application processes it. */
    markAllPending?: boolean;
    /** Item identifiers with an application-side action in progress. */
    pendingItemIds?: unknown;
    /** Stable reference date for deterministic relative formatting. */
    referenceDate?: string | number | Date;
    /** User-facing text overrides. */
    labels?: unknown;
    /** Optional maximum height of the scrollable list. */
    maxHeight?: string;
    /** Wartość kontrolowana przez v-model:activeFilter. */
    activeFilter?: string;
    /** Początkowa niekontrolowana wartość właściwości activeFilter. */
    defaultActiveFilter?: string;
    /** Callback React wywoływany po zmianie właściwości activeFilter. */
    onActiveFilterChange?: (value: string) => void;
    /** Wartość kontrolowana przez v-model:selectedId. */
    selectedId?: unknown;
    /** Początkowa niekontrolowana wartość właściwości selectedId. */
    defaultSelectedId?: unknown;
    /** Callback React wywoływany po zmianie właściwości selectedId. */
    onSelectedIdChange?: (value: unknown) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „update:activeFilter”. */
    onUpdateActiveFilter?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „update:selectedId”. */
    onUpdateSelectedId?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „select”. */
    onSelect?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „action”. */
    onAction?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „markRead”. */
    onMarkRead?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „markUnread”. */
    onMarkUnread?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „markAllRead”. */
    onMarkAllRead?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „loadMore”. */
    onLoadMore?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „filterChange”. */
    onFilterChange?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „retry”. */
    onRetry?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „header”. */
    header?: ReactNode;
    /** Treść osadzana w nazwanym slocie „empty”. */
    empty?: ReactNode;
    /** Treść osadzana w nazwanym slocie „group-header”. */
    groupHeader?: ReactNode;
    /** Treść osadzana w nazwanym slocie „item”. */
    item?: ReactNode;
    /** Treść osadzana w nazwanym slocie „item-icon”. */
    itemIcon?: ReactNode;
    /** Treść osadzana w nazwanym slocie „item-actions”. */
    itemActions?: ReactNode;
    /** Treść osadzana w nazwanym slocie „footer”. */
    footer?: ReactNode;
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
    /** Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value. */
    onUpdateValue?: (...args: unknown[]) => void;
  };
  FormButtonGroup: PeauiReactBaseProps & {
    /** Unikalny identyfikator elementu w dokumencie. */
    id?: string;
    /** Nazwa pola używana przez formularz lub nazwa zasobu. */
    name?: string;
    /** Widoczna etykieta opisująca element lub pole formularza. */
    label?: string;
    /** Wariant rozmiaru komponentu. */
    size?: 'xs' | 's' | 'm' | 'l';
    /** Konfiguruje właściwość „is toggle” komponentu. */
    isToggle?: boolean;
    /** Empty selection blocks native form submission; readonly and disabled are exempt. */
    required?: boolean;
    /** Wyłącza komponent i blokuje jego interakcje. */
    disabled?: boolean;
    /** Ustawia komponent w trybie tylko do odczytu. */
    readonly?: boolean;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Lista opcji dostępnych do wyświetlenia lub wyboru. */
    options?: PeauiOption[];
    /** Bieżąca wartość kontrolowana przez v-model:value. */
    value?: string | number | undefined;
    /** Początkowa niekontrolowana wartość właściwości value. */
    defaultValue?: string | number | undefined;
    /** Callback React wywoływany po zmianie właściwości value. */
    onValueChange?: (value: string | number | undefined) => void;
    /** Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value. */
    onUpdateValue?: (...args: unknown[]) => void;
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
    /** Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value. */
    onUpdateValue?: (...args: unknown[]) => void;
  };
  FormColorPicker: PeauiReactBaseProps & {
    /** Konfiguruje właściwość „alpha” komponentu. */
    alpha?: boolean;
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel?: string;
    /** Pokazuje akcję pozwalającą wyczyścić bieżącą wartość. */
    canErase?: boolean;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Konfiguruje właściwość „density” komponentu. */
    density?: 'compact' | 'full';
    /** Dodatkowy opis objaśniający zawartość albo stan komponentu. */
    description?: string;
    /** Wyłącza komponent i blokuje jego interakcje. */
    disabled?: boolean;
    /** Komunikat błędu powiązany z polem lub operacją. */
    error?: string;
    /** Konfiguruje właściwość „format” komponentu. */
    format?: 'hex' | 'rgb' | 'hsl';
    /** Unikalny identyfikator elementu w dokumencie. */
    id: string;
    /** Widoczna etykieta opisująca element lub pole formularza. */
    label?: string;
    /** Włącza stan ładowania i informuje o trwającej operacji. */
    loading?: boolean;
    /** Dostępny komunikat opisujący trwającą operację. */
    loadingLabel?: string;
    /** Nazwa pola używana przez formularz lub nazwa zasobu. */
    name: string;
    /** Konfiguruje właściwość „panel aria label” komponentu. */
    panelAriaLabel?: string;
    /** Konfiguruje właściwość „placement” komponentu. */
    placement?: 'top' | 'bottom';
    /** Tekst pomocniczy widoczny przed wprowadzeniem wartości. */
    placeholder?: string;
    /** Ustawia komponent w trybie tylko do odczytu. */
    readonly?: boolean;
    /** Konfiguruje właściwość „recent colors” komponentu. */
    recentColors?: ReadonlyArray<PeauiFormColorPickerSwatch>;
    /** Oznacza wartość jako wymaganą. */
    required?: boolean;
    /** Konfiguruje właściwość „saved colors” komponentu. */
    savedColors?: ReadonlyArray<PeauiFormColorPickerSwatch>;
    /** Konfiguruje właściwość „show eyedropper” komponentu. */
    showEyedropper?: boolean;
    /** Wariant wizualny komponentu. */
    variant?: 'popover' | 'inline';
    /** Bieżąca wartość kontrolowana przez v-model:value. */
    value?: string;
    /** Początkowa niekontrolowana wartość właściwości value. */
    defaultValue?: string;
    /** Callback React wywoływany po zmianie właściwości value. */
    onValueChange?: (value: string) => void;
    /** Stan otwarcia kontrolowany przez v-model:open. */
    open?: boolean;
    /** Początkowa niekontrolowana wartość właściwości open. */
    defaultOpen?: boolean;
    /** Callback React wywoływany po zmianie właściwości open. */
    onOpenChange?: (value: boolean) => void;
    /** Emitowane po zmianie wartości przez użytkownika. */
    onChange?: (value: string) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „close”. */
    onClose?: () => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „commit”. */
    onCommit?: (value: string) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „eyedropperError”. */
    onEyedropperError?: (detail: PeauiFormColorPickerEyedropperErrorDetail) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „eyedropperStart”. */
    onEyedropperStart?: () => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „invalid”. */
    onInvalid?: (detail: PeauiFormColorPickerInvalidDetail) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „open”. */
    onOpen?: () => void;
    /** Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value. */
    onUpdateValue?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „description”. */
    descriptionContent?: ReactNode;
    /** Treść osadzana w nazwanym slocie „error”. */
    errorContent?: ReactNode;
    /** Treść osadzana w nazwanym slocie „footer”. */
    renderFooter?: (state: { color: string }) => ReactNode;
    /** Treść osadzana w nazwanym slocie „hint”. */
    hintContent?: ReactNode;
    /** Treść osadzana w nazwanym slocie „recent-color”. */
    renderRecentColor?: (state: { color: PeauiFormColorPickerSwatch; index: number }) => ReactNode;
    /** Treść osadzana w nazwanym slocie „saved-color”. */
    renderSavedColor?: (state: { color: PeauiFormColorPickerSwatch; index: number }) => ReactNode;
    /** Treść osadzana w nazwanym slocie „swatch”. */
    renderSwatch?: (state: { color: string }) => ReactNode;
    /** Treść osadzana w nazwanym slocie „trigger”. */
    renderTrigger?: (state: { color: string; open: boolean; toggle: () => void }) => ReactNode;
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
    /** Empty selection blocks native form submission; readonly and disabled are exempt. */
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
    value?: string | PeauiPickerRangeValue<string> | undefined;
    /** Początkowa niekontrolowana wartość właściwości value. */
    defaultValue?: string | PeauiPickerRangeValue<string> | undefined;
    /** Callback React wywoływany po zmianie właściwości value. */
    onValueChange?: (value: string | PeauiPickerRangeValue<string> | undefined) => void;
    /** Emitowane po wybraniu akcji usunięcia. */
    onRemove?: (...args: unknown[]) => void;
    /** Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value. */
    onUpdateValue?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „hint”. */
    hint?: ReactNode;
    /** Treść osadzana w nazwanym slocie „description”. */
    description?: ReactNode;
    /** Treść osadzana w nazwanym slocie „error”. */
    error?: ReactNode;
    /** Treść osadzana w nazwanym slocie „success”. */
    success?: ReactNode;
  };
  FormDateRangePicker: PeauiReactBaseProps & {
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel?: string;
    /** Konfiguruje właściwość „calendars” komponentu. */
    calendars?: 1 | 2;
    /** Pokazuje akcję pozwalającą wyczyścić bieżącą wartość. */
    canErase?: boolean;
    /** Konfiguruje właściwość „confirm” komponentu. */
    confirm?: boolean;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Konfiguruje właściwość „date format” komponentu. */
    dateFormat?: 'iso' | 'locale';
    /** Dodatkowy opis objaśniający zawartość albo stan komponentu. */
    description?: string;
    /** Wyłącza komponent i blokuje jego interakcje. */
    disabled?: boolean;
    /** Konfiguruje właściwość „end label” komponentu. */
    endLabel?: string;
    /** Konfiguruje właściwość „end placeholder” komponentu. */
    endPlaceholder?: string;
    /** Komunikat błędu powiązany z polem lub operacją. */
    error?: string;
    /** Konfiguruje właściwość „format” komponentu. */
    format?: PeauiDateRangeFormatter;
    /** Unikalny identyfikator elementu w dokumencie. */
    id: string;
    /** Konfiguruje właściwość „is date disabled” komponentu. */
    isDateDisabled?: (date: string) => boolean;
    /** Widoczna etykieta opisująca element lub pole formularza. */
    label?: string;
    /** Włącza stan ładowania i informuje o trwającej operacji. */
    loading?: boolean;
    /** Dostępny komunikat opisujący trwającą operację. */
    loadingLabel?: string;
    /** Konfiguruje właściwość „locale” komponentu. */
    locale?: string;
    /** Konfiguruje właściwość „max date” komponentu. */
    maxDate?: string;
    /** Konfiguruje właściwość „min date” komponentu. */
    minDate?: string;
    /** Nazwa pola używana przez formularz lub nazwa zasobu. */
    name: string;
    /** Konfiguruje właściwość „panel aria label” komponentu. */
    panelAriaLabel?: string;
    /** Konfiguruje właściwość „parse” komponentu. */
    parse?: PeauiDateRangeParser;
    /** Konfiguruje właściwość „placement” komponentu. */
    placement?: 'top' | 'bottom';
    /** Tekst pomocniczy widoczny przed wprowadzeniem wartości. */
    placeholder?: string;
    /** Konfiguruje właściwość „presets” komponentu. */
    presets?: ReadonlyArray<PeauiDateRangePreset>;
    /** Ustawia komponent w trybie tylko do odczytu. */
    readonly?: boolean;
    /** Oznacza wartość jako wymaganą. */
    required?: boolean;
    /** Konfiguruje właściwość „selection order” komponentu. */
    selectionOrder?: 'swap' | 'reject' | 'resetEnd';
    /** Konfiguruje właściwość „show presets” komponentu. */
    showPresets?: boolean;
    /** Konfiguruje właściwość „start label” komponentu. */
    startLabel?: string;
    /** Konfiguruje właściwość „start placeholder” komponentu. */
    startPlaceholder?: string;
    /** Wariant wizualny komponentu. */
    variant?: 'single-input' | 'two-inputs';
    /** Bieżąca wartość kontrolowana przez v-model:value. */
    value?: PeauiDateRangeValue | undefined;
    /** Początkowa niekontrolowana wartość właściwości value. */
    defaultValue?: PeauiDateRangeValue | undefined;
    /** Callback React wywoływany po zmianie właściwości value. */
    onValueChange?: (value: PeauiDateRangeValue | undefined) => void;
    /** Stan otwarcia kontrolowany przez v-model:open. */
    open?: boolean;
    /** Początkowa niekontrolowana wartość właściwości open. */
    defaultOpen?: boolean;
    /** Callback React wywoływany po zmianie właściwości open. */
    onOpenChange?: (value: boolean) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „apply”. */
    onApply?: (value: [string, string]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „cancel”. */
    onCancel?: () => void;
    /** Emitowane po zmianie wartości przez użytkownika. */
    onChange?: (value: PeauiDateRangeValue | undefined) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „close”. */
    onClose?: () => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „endChange”. */
    onEndChange?: (value: string | undefined) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „invalid”. */
    onInvalid?: (detail: PeauiDateRangePickerInvalidDetail) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „monthChange”. */
    onMonthChange?: (value: { month: number; year: number }) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „open”. */
    onOpen?: () => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „startChange”. */
    onStartChange?: (value: string | undefined) => void;
    /** Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value. */
    onUpdateValue?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „day”. */
    day?: ReactNode;
    /** Treść osadzana w nazwanym slocie „footer”. */
    footer?: ReactNode;
    /** Treść osadzana w nazwanym slocie „hint”. */
    hint?: ReactNode;
    /** Treść osadzana w nazwanym slocie „preset”. */
    preset?: ReactNode;
    /** Treść osadzana w nazwanym slocie „trigger”. */
    trigger?: ReactNode;
  };
  FormDateTimePicker: PeauiReactBaseProps & {
    /** Konfiguruje właściwość „allow off step” komponentu. */
    allowOffStep?: boolean;
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel?: string;
    /** Pokazuje akcję pozwalającą wyczyścić bieżącą wartość. */
    canErase?: boolean;
    /** Konfiguruje właściwość „confirm” komponentu. */
    confirm?: boolean;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Konfiguruje właściwość „date format” komponentu. */
    dateFormat?: 'iso' | 'locale';
    /** Dodatkowy opis objaśniający zawartość albo stan komponentu. */
    description?: string;
    /** Wyłącza komponent i blokuje jego interakcje. */
    disabled?: boolean;
    /** Komunikat błędu powiązany z polem lub operacją. */
    error?: string;
    /** Konfiguruje właściwość „format” komponentu. */
    format?: '12h' | '24h';
    /** Konfiguruje właściwość „hour step” komponentu. */
    hourStep?: number;
    /** Unikalny identyfikator elementu w dokumencie. */
    id: string;
    /** Konfiguruje właściwość „is date time disabled” komponentu. */
    isDateTimeDisabled?: (value: PeauiLocalDateTimeValue) => boolean;
    /** Widoczna etykieta opisująca element lub pole formularza. */
    label?: string;
    /** Konfiguruje właściwość „layout” komponentu. */
    layout?: 'side-by-side' | 'stacked';
    /** Włącza stan ładowania i informuje o trwającej operacji. */
    loading?: boolean;
    /** Dostępny komunikat opisujący trwającą operację. */
    loadingLabel?: string;
    /** Konfiguruje właściwość „locale” komponentu. */
    locale?: string;
    /** Maksymalna dozwolona wartość albo szerokość. */
    max?: PeauiLocalDateTimeValue | undefined;
    /** Minimalna dozwolona wartość. */
    min?: PeauiLocalDateTimeValue | undefined;
    /** Konfiguruje właściwość „minute step” komponentu. */
    minuteStep?: number;
    /** Nazwa pola używana przez formularz lub nazwa zasobu. */
    name: string;
    /** Konfiguruje właściwość „panel aria label” komponentu. */
    panelAriaLabel?: string;
    /** Tekst pomocniczy widoczny przed wprowadzeniem wartości. */
    placeholder?: string;
    /** Konfiguruje właściwość „placement” komponentu. */
    placement?: 'top' | 'bottom';
    /** Ustawia komponent w trybie tylko do odczytu. */
    readonly?: boolean;
    /** Oznacza wartość jako wymaganą. */
    required?: boolean;
    /** Konfiguruje właściwość „second step” komponentu. */
    secondStep?: number;
    /** Konfiguruje właściwość „show seconds” komponentu. */
    showSeconds?: boolean;
    /** Konfiguruje właściwość „show time zone” komponentu. */
    showTimeZone?: boolean;
    /** Konfiguruje właściwość „time zone” komponentu. */
    timeZone?: string;
    /** Wariant wizualny komponentu. */
    variant?: 'single-input' | 'split-input';
    /** Bieżąca wartość kontrolowana przez v-model:value. */
    value?: PeauiLocalDateTimeValue | undefined;
    /** Początkowa niekontrolowana wartość właściwości value. */
    defaultValue?: PeauiLocalDateTimeValue | undefined;
    /** Callback React wywoływany po zmianie właściwości value. */
    onValueChange?: (value: PeauiLocalDateTimeValue | undefined) => void;
    /** Stan otwarcia kontrolowany przez v-model:open. */
    open?: boolean;
    /** Początkowa niekontrolowana wartość właściwości open. */
    defaultOpen?: boolean;
    /** Callback React wywoływany po zmianie właściwości open. */
    onOpenChange?: (value: boolean) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „apply”. */
    onApply?: (value: PeauiLocalDateTimeValue) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „cancel”. */
    onCancel?: () => void;
    /** Emitowane po zmianie wartości przez użytkownika. */
    onChange?: (value: PeauiLocalDateTimeValue | undefined) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „close”. */
    onClose?: () => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „dateChange”. */
    onDateChange?: (date: string | undefined) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „invalid”. */
    onInvalid?: (detail: PeauiDateTimePickerInvalidDetail) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „open”. */
    onOpen?: () => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „timeChange”. */
    onTimeChange?: (time: string | undefined) => void;
    /** Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value. */
    onUpdateValue?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „date”. */
    renderDate?: (state: { date: string | undefined }) => ReactNode;
    /** Treść osadzana w nazwanym slocie „description”. */
    descriptionContent?: ReactNode;
    /** Treść osadzana w nazwanym slocie „error”. */
    errorContent?: ReactNode;
    /** Treść osadzana w nazwanym slocie „footer”. */
    footerContent?: ReactNode;
    /** Treść osadzana w nazwanym slocie „hint”. */
    hint?: ReactNode;
    /** Treść osadzana w nazwanym slocie „time”. */
    renderTime?: (state: { time: string | undefined }) => ReactNode;
    /** Treść osadzana w nazwanym slocie „time-zone”. */
    renderTimeZone?: (state: { timeZone: string }) => ReactNode;
    /** Treść osadzana w nazwanym slocie „trigger”. */
    renderTrigger?: (state: {
      displayValue: string;
      open: boolean;
      toggle: () => void;
    }) => ReactNode;
  };
  FormField: PeauiReactBaseProps & {
    /** Treść wyświetlana za właściwą wartością pola. */
    after?: string;
    /** Treść wyświetlana przed właściwą wartością pola. */
    before?: string;
    /** Pokazuje akcję pozwalającą wyczyścić bieżącą wartość. */
    canErase?: boolean;
    /** Konfiguruje właściwość „clear label” komponentu. */
    clearLabel?: string;
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
  FormFieldLabel: PeauiReactBaseProps & {
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
  FormFileUpload: Omit<
    PeauiReactBaseProps & {
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
      /** Konfiguruje właściwość „value mode” komponentu. */
      valueMode?: FileUploadValueMode;
      /** Wybrany plik kontrolowany przez v-model:file. */
      file?: FormFileUploadValue | File | undefined;
      /** Początkowa niekontrolowana wartość właściwości file. */
      defaultFile?: FormFileUploadValue | File | undefined;
      /** Callback React wywoływany po zmianie właściwości file. */
      onFileChange?: (value: FormFileUploadValue | File | undefined) => void;
      /** Emitowane po wybraniu akcji usunięcia. */
      onRemove?: (...args: unknown[]) => void;
      /** Emitowane po zmianie modelu „file”; przekaż nową wartość do v-model:file. */
      onUpdateFile?: (...args: unknown[]) => void;
    },
    'valueMode' | 'onFileChange'
  > &
    PeauiFileUploadModel;
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
    /** Emitowane po zmianie modelu „files”; przekaż nową wartość do v-model:files. */
    onUpdateFiles?: (...args: unknown[]) => void;
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
    /** Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value. */
    onUpdateValue?: (...args: unknown[]) => void;
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
    /** Konfiguruje właściwość „labels” komponentu. */
    labels?: Partial<PeauiSelectLabels>;
    /** Value is the default; label preserves the pre-3.0 Vue/WC model contract. */
    valueMode?: SelectValueMode;
    /** Render only visible fixed-height options for large lists. */
    virtual?: boolean;
    /** Row height in pixels when virtual is enabled (minimum 24). */
    optionHeight?: number;
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
    /** Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value. */
    onUpdateValue?: (...args: unknown[]) => void;
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
    /** Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value. */
    onUpdateValue?: (...args: unknown[]) => void;
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
    /** Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value. */
    onUpdateValue?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „hint”. */
    hint?: ReactNode;
    /** Treść osadzana w nazwanym slocie „description”. */
    description?: ReactNode;
    /** Treść osadzana w nazwanym slocie „error”. */
    error?: ReactNode;
    /** Treść osadzana w nazwanym slocie „success”. */
    success?: ReactNode;
  };
  FormPinInput: PeauiReactBaseProps & {
    /** Unikalny identyfikator grupy. */
    id?: string;
    /** Nazwa wartości wysyłanej z natywnym formularzem. */
    name?: string;
    /** Identyfikator formularza właściciela. */
    form?: string;
    /** Liczba komórek kodu od 1 do 32. */
    length?: number;
    /** Zbiór znaków akceptowanych przez komponent. */
    type?: 'numeric' | 'alphanumeric';
    /** Maskuje wizualnie wpisane znaki. */
    mask?: boolean;
    /** Rozmiar wizualny komórek; cel dotykowy zawsze ma minimum 44 px. */
    size?: 's' | 'm' | 'l';
    /** Dodatkowy wzorzec wyrażenia regularnego sprawdzany dla każdego znaku. */
    pattern?: string;
    /** Transformacja wykonywana przed walidacją znaku. */
    transform?: PeauiFormPinInputTransform;
    /** Co ile komórek renderowany jest separator; 0 wyłącza grupowanie. */
    separatorEvery?: number;
    /** Wartość autocomplete pierwszej komórki. */
    autocomplete?: string;
    /** Podpowiedź klawiatury ekranowej. Domyślnie wynika z typu. */
    inputmode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
    /** Ustawia początkowy fokus na pierwszej nieuzupełnionej komórce. */
    autoFocus?: boolean;
    /** Wyłącza kontrolkę. */
    disabled?: boolean;
    /** Blokuje edycję bez usuwania kontrolki z kolejności fokusu. */
    readonly?: boolean;
    /** Blokuje edycję i udostępnia stan zajętości. */
    loading?: boolean;
    /** Oznacza każdą komórkę jako wymaganą. */
    required?: boolean;
    /** Widoczna etykieta całej grupy. */
    label?: string;
    /** Tekst instrukcji powiązany z grupą i komórkami. */
    description?: string;
    /** Komunikat błędu powiązany przez aria-describedby. */
    error?: string;
    /** Dostępna nazwa używana, gdy nie ma widocznej etykiety. */
    ariaLabel?: string;
    /** Tekst stanu ładowania dla technologii asystujących. */
    loadingLabel?: string;
    /** Stabilny identyfikator używany w testach. */
    dataTestId?: string;
    /** Bieżąca wartość kontrolowana przez v-model:value. */
    value?: string;
    /** Początkowa niekontrolowana wartość właściwości value. */
    defaultValue?: string;
    /** Callback React wywoływany po zmianie właściwości value. */
    onValueChange?: (value: string) => void;
    /** Emitowane po każdej zaakceptowanej zmianie kodu. */
    onChange?: (value: string, event: Event) => void;
    /** Emitowane raz dla każdej nowej, kompletnej wartości. */
    onComplete?: (value: string, event: Event) => void;
    /** Emitowane po odrzuceniu znaku, wzorca, transformacji lub nadmiaru. */
    onInvalidInput?: (detail: PeauiFormPinInputInvalidDetail, event: Event) => void;
    /** Emitowane po wejściu fokusu do komórki. */
    onFocus?: (event: ReactFocusEvent<HTMLInputElement>, index: number) => void;
    /** Emitowane po opuszczeniu całej grupy komórek. */
    onBlur?: (event: ReactFocusEvent<HTMLDivElement>) => void;
    /** Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value. */
    onUpdateValue?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „label”. */
    labelContent?: ReactNode;
    /** Treść osadzana w nazwanym slocie „hint”. */
    hintContent?: ReactNode;
    /** Treść osadzana w nazwanym slocie „separator”. */
    renderSeparator?: (state: { index: number }) => ReactNode;
    /** Treść osadzana w nazwanym slocie „description”. */
    descriptionContent?: ReactNode;
    /** Treść osadzana w nazwanym slocie „error”. */
    errorContent?: ReactNode;
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
    /** Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value. */
    onUpdateValue?: (...args: unknown[]) => void;
  };
  FormRatingInput: PeauiReactBaseProps & {
    /** Unikalny identyfikator kontrolki. */
    id?: string;
    /** Nazwa wartości wysyłanej z formularzem. */
    name?: string;
    /** Identyfikator formularza właściciela. */
    form?: string;
    /** Najwyższa ocena; wartości są normalizowane do zakresu 1–100. */
    max?: number;
    /** Precyzja pełnej lub połówkowej oceny. */
    step?: 0.5 | 1;
    /** Pozwala wyczyścić ocenę klawiszem Delete/Backspace lub ponownym kliknięciem. */
    allowClear?: boolean;
    /** Wyświetla nietabowalny odczyt zamiast kontrolki. */
    readonly?: boolean;
    /** Wyłącza kontrolkę. */
    disabled?: boolean;
    /** Empty selection blocks native form submission; readonly and disabled are exempt. */
    required?: boolean;
    /** Mapa tekstowych opisów indeksowana wartością, np. `{ '4': 'Dobra' }`. */
    labels?: Readonly<Record<string, string>>;
    /** Funkcja tworząca tekstowy opis wartości. */
    getLabel?: (value: number | null, max: number) => string | undefined;
    /** Nazwa ikony z katalogu PeaUI. */
    icon?: string;
    /** Rozmiar wizualny ikon; cel dotykowy zachowuje co najmniej 44 px. */
    size?: 's' | 'm' | 'l';
    /** Widoczna etykieta pola. */
    label?: string;
    /** Tekst pomocniczy powiązany przez aria-describedby. */
    description?: string;
    /** Komunikat błędu powiązany przez aria-describedby i aria-invalid. */
    error?: string;
    /** Dostępna nazwa, gdy nie ma widocznej etykiety. */
    ariaLabel?: string;
    /** Lokalizowany tekst używany dla pustej oceny. */
    emptyLabel?: string;
    /** Locale używane do formatowania wartości połówkowych. */
    locale?: string;
    /** Pokazuje widoczny tekst bieżącej wartości. */
    showValueLabel?: boolean;
    /** Stabilny identyfikator dla testów automatycznych. */
    dataTestId?: string;
    /** Bieżąca wartość kontrolowana przez v-model:value. */
    value?: number | null;
    /** Początkowa niekontrolowana wartość właściwości value. */
    defaultValue?: number | null;
    /** Callback React wywoływany po zmianie właściwości value. */
    onValueChange?: (value: number | null) => void;
    /** Emitowane po zatwierdzeniu wartości. */
    onChange?: (value: number | null, event: Event) => void;
    /** Emitowane wyłącznie dla podglądu wskaźnikiem; null oznacza jego koniec. */
    onPreviewChange?: (value: number | null) => void;
    /** Emitowane po jawnym wyczyszczeniu wartości. */
    onClear?: (event: Event) => void;
    /** Emitowane przy ustawieniu fokusu na pojedynczym suwaku. */
    onFocus?: (event: ReactFocusEvent<HTMLInputElement>) => void;
    /** Emitowane po opuszczeniu pojedynczego suwaka. */
    onBlur?: (event: ReactFocusEvent<HTMLInputElement>) => void;
    /** Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value. */
    onUpdateValue?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „label”. */
    labelContent?: ReactNode;
    /** Treść osadzana w nazwanym slocie „icon”. */
    renderIcon?: (state: { fill: 0 | 50 | 100; index: number; value: number | null }) => ReactNode;
    /** Treść osadzana w nazwanym slocie „value-label”. */
    renderValueLabel?: (state: { text: string; value: number | null }) => ReactNode;
    /** Treść osadzana w nazwanym slocie „description”. */
    descriptionContent?: ReactNode;
    /** Treść osadzana w nazwanym slocie „error”. */
    errorContent?: ReactNode;
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
    /** Konfiguruje właściwość „labels” komponentu. */
    labels?: Partial<PeauiSelectLabels>;
    /** Value is the default; label preserves the pre-3.0 Vue/WC model contract. */
    valueMode?: SelectValueMode;
    /** Render only visible fixed-height options for large lists. */
    virtual?: boolean;
    /** Row height in pixels when virtual is enabled (minimum 24). */
    optionHeight?: number;
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
    /** Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value. */
    onUpdateValue?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „hint”. */
    hint?: ReactNode;
    /** Treść osadzana w nazwanym slocie „description”. */
    description?: ReactNode;
    /** Treść osadzana w nazwanym slocie „error”. */
    error?: ReactNode;
    /** Treść osadzana w nazwanym slocie „success”. */
    success?: ReactNode;
  };
  FormSwitchToggle: PeauiReactBaseProps & {
    /** Unikalny identyfikator kontrolki. Generowany automatycznie, jeśli nie zostanie podany. */
    id?: string;
    /** Nazwa pola używana podczas natywnego wysyłania formularza. */
    name?: string;
    /** Identyfikator formularza właściciela, również gdy kontrolka znajduje się poza formularzem. */
    form?: string;
    /** Widoczna etykieta przełącznika. */
    label?: string;
    /** Tekst pomocniczy powiązany z kontrolką przez aria-describedby. */
    description?: string;
    /** Komunikat błędu powiązany z kontrolką i aria-invalid. */
    error?: string;
    /** Wartość modelu reprezentująca stan włączony. */
    trueValue?: unknown;
    /** Wartość modelu reprezentująca stan wyłączony. */
    falseValue?: unknown;
    /** Rozmiar wizualny szyny; obszar dotykowy zawsze ma co najmniej 44 px. */
    size?: 's' | 'm' | 'l';
    /** Pozycja etykiety względem szyny. */
    labelPosition?: 'start' | 'end';
    /** Wyłącza kontrolkę i usuwa ją z kolejności fokusu. */
    disabled?: boolean;
    /** Blokuje zmianę, zachowując kontrolkę w kolejności fokusu. */
    readonly?: boolean;
    /** Blokuje zmianę i udostępnia stan zajętości technologiom asystującym. */
    loading?: boolean;
    /** Oznacza pole jako wymagane dla formularza i technologii asystujących. */
    required?: boolean;
    /** Pokazuje tekstowy stan obok szyny bez polegania wyłącznie na kolorze. */
    showStateLabel?: boolean;
    /** Tekst widoczny dla stanu włączonego. */
    onLabel?: string;
    /** Tekst widoczny dla stanu wyłączonego. */
    offLabel?: string;
    /** Dostępna nazwa używana, gdy nie ma widocznej etykiety. */
    ariaLabel?: string;
    /** Dostępny komunikat stanu ładowania. */
    loadingLabel?: string;
    /** Stabilny identyfikator używany w testach automatycznych. */
    dataTestId?: string;
    /** Bieżąca wartość kontrolowana przez v-model:value. */
    value?: unknown;
    /** Początkowa niekontrolowana wartość właściwości value. */
    defaultValue?: unknown;
    /** Callback React wywoływany po zmianie właściwości value. */
    onValueChange?: (value: unknown) => void;
    /** Emitowane po zmianie wraz z nową wartością domenową i natywnym zdarzeniem. */
    onChange?: (...args: unknown[]) => void;
    /** Emitowane po ustawieniu fokusu na natywnej kontrolce. */
    onFocus?: (...args: unknown[]) => void;
    /** Emitowane po opuszczeniu natywnej kontrolki. */
    onBlur?: (...args: unknown[]) => void;
    /** Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value. */
    onUpdateValue?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „label”. */
    labelContent?: ReactNode;
    /** Treść osadzana w nazwanym slocie „thumb”. */
    renderThumb?: (state: { checked: boolean; loading: boolean }) => ReactNode;
    /** Treść osadzana w nazwanym slocie „on-label”. */
    onLabelContent?: ReactNode;
    /** Treść osadzana w nazwanym slocie „off-label”. */
    offLabelContent?: ReactNode;
    /** Treść osadzana w nazwanym slocie „description”. */
    descriptionContent?: ReactNode;
    /** Treść osadzana w nazwanym slocie „error”. */
    errorContent?: ReactNode;
  };
  FormTagsInput: PeauiReactBaseProps & {
    /** Unikalny identyfikator pola. */
    id?: string;
    /** Nazwa używana przez natywny formularz; każdy tag tworzy osobną wartość. */
    name?: string;
    /** Identyfikator formularza właściciela. */
    form?: string;
    /** Widoczna etykieta pola. */
    label?: string;
    /** Tekst pomocniczy powiązany z polem. */
    description?: string;
    /** Komunikat błędu powiązany przez aria-describedby. */
    error?: string;
    /** Placeholder edytora. */
    placeholder?: string;
    /** Dostępna nazwa, gdy nie podano widocznej etykiety. */
    ariaLabel?: string;
    /** Układ tagów i edytora. */
    layout?: 'inline' | 'stacked';
    /** Tryb swobodny albo ograniczony do sugestii. */
    mode?: 'freeform' | 'suggestions-only';
    /** Pozwala utworzyć tag spoza listy sugestii. */
    allowCreate?: boolean;
    /** Pozwala dodać tag o tym samym kluczu więcej niż raz. */
    allowDuplicates?: boolean;
    /** Maksymalna liczba tagów. */
    max?: number;
    /** Separatory używane podczas wpisywania i wklejania. */
    separators?: ReadonlyArray<string>;
    /** Kontrolowana lista sugestii. */
    suggestions?: ReadonlyArray<PeauiFormTagsInputTag>;
    /** Opcjonalny dostawca sugestii z anulowaniem nieaktualnych zapytań. */
    suggestionProvider?: PeauiFormTagsInputSuggestionProvider;
    /** Zewnętrzny stan ładowania sugestii. */
    loading?: boolean;
    /** Położenie panelu sugestii. */
    placement?: 'auto' | 'top' | 'bottom';
    /** Normalizuje tekst przed walidacją. */
    normalizeTag?: PeauiFormTagsInputNormalizer;
    /** Waliduje pojedynczy tag przed zmianą modelu. */
    validateTag?: PeauiFormTagsInputValidator;
    /** Wyznacza stabilny klucz i regułę duplikatów. */
    getTagKey?: PeauiFormTagsInputKeyGetter;
    /** Serializuje wartości do natywnych pól formularza. */
    serializeTag?: PeauiFormTagsInputSerializer;
    /** Klucze lub etykiety tagów, których nie można edytować ani usunąć. */
    disabledTags?: ReadonlyArray<string | number>;
    /** Wyłącza całą kontrolkę. */
    disabled?: boolean;
    /** Pozwala odczytać i kopiować zawartość bez jej zmiany. */
    readonly?: boolean;
    /** Oznacza pole jako wymagane. */
    required?: boolean;
    /** Tekst prezentowany podczas ładowania sugestii. */
    loadingLabel?: string;
    /** Tekst pustego wyniku wyszukiwania. */
    emptyLabel?: string;
    /** Stabilny identyfikator używany w testach. */
    dataTestId?: string;
    /** Bieżąca wartość kontrolowana przez v-model:value. */
    value?: PeauiFormTagsInputTag[];
    /** Początkowa niekontrolowana wartość właściwości value. */
    defaultValue?: PeauiFormTagsInputTag[];
    /** Callback React wywoływany po zmianie właściwości value. */
    onValueChange?: (value: PeauiFormTagsInputTag[]) => void;
    /** Wartość kontrolowana przez v-model:inputValue. */
    inputValue?: string;
    /** Początkowa niekontrolowana wartość właściwości inputValue. */
    defaultInputValue?: string;
    /** Callback React wywoływany po zmianie właściwości inputValue. */
    onInputValueChange?: (value: string) => void;
    /** Emitowane po dodaniu zaakceptowanego tagu. */
    onAdd?: (tag: PeauiFormTagsInputTag, index: number, event: Event) => void;
    /** Emitowane po usunięciu tagu. */
    onRemove?: (tag: PeauiFormTagsInputTag, index: number, event: Event) => void;
    /** Emitowane po zatwierdzeniu edycji tagu. */
    onEdit?: (
      previous: PeauiFormTagsInputTag,
      next: PeauiFormTagsInputTag,
      index: number,
      event: Event,
    ) => void;
    /** Emitowane dla każdej odrzuconej wartości. */
    onInvalidTag?: (detail: PeauiFormTagsInputInvalidDetail, event: Event) => void;
    /** Emitowane przy zmianie tekstu wyszukiwania. */
    onSearch?: (query: string, requestId: number) => void;
    /** Emitowane, gdy próba dodania przekracza limit. */
    onMaxReached?: (max: number, event: Event) => void;
    /** Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value. */
    onUpdateValue?: (...args: unknown[]) => void;
    /** Emitowane po zmianie modelu „inputValue”; przekaż nową wartość do v-model:inputValue. */
    onUpdateInputValue?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „label”. */
    renderLabel?: (state: { count: number }) => ReactNode;
    /** Treść osadzana w nazwanym slocie „hint”. */
    renderHint?: (state: { count: number; max?: number }) => ReactNode;
    /** Treść osadzana w nazwanym slocie „tag”. */
    renderTag?: (state: {
      tag: PeauiFormTagsInputTag;
      index: number;
      selected: boolean;
      editing: boolean;
      disabled: boolean;
    }) => ReactNode;
    /** Treść osadzana w nazwanym slocie „tag-content”. */
    renderTagContent?: (state: { tag: PeauiFormTagsInputTag; index: number }) => ReactNode;
    /** Treść osadzana w nazwanym slocie „suggestion”. */
    renderSuggestion?: (state: {
      suggestion: PeauiFormTagsInputTag;
      index: number;
      active: boolean;
    }) => ReactNode;
    /** Treść osadzana w nazwanym slocie „empty-suggestions”. */
    renderEmptySuggestions?: (state: { query: string }) => ReactNode;
    /** Treść osadzana w nazwanym slocie „loading”. */
    loadingContent?: ReactNode;
    /** Treść osadzana w nazwanym slocie „prefix”. */
    prefixContent?: ReactNode;
    /** Treść osadzana w nazwanym slocie „suffix”. */
    suffixContent?: ReactNode;
    /** Treść osadzana w nazwanym slocie „description”. */
    descriptionContent?: ReactNode;
    /** Treść osadzana w nazwanym slocie „error”. */
    errorContent?: ReactNode;
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
    /** Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value. */
    onUpdateValue?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „hint”. */
    hint?: ReactNode;
    /** Treść osadzana w nazwanym slocie „description”. */
    description?: ReactNode;
    /** Treść osadzana w nazwanym slocie „error”. */
    error?: ReactNode;
    /** Treść osadzana w nazwanym slocie „success”. */
    success?: ReactNode;
  };
  FormTimePicker: PeauiReactBaseProps & {
    /** Stabilny identyfikator pola i powiązanych elementów ARIA. */
    id: string;
    /** Nazwa pola używana przy wysyłaniu formularza. */
    name: string;
    /** Widoczna etykieta pola. */
    label?: string;
    /** Tekst pomocy wyświetlany pod polem. */
    description?: string;
    /** Zewnętrzny komunikat błędu; ma pierwszeństwo przed walidacją wewnętrzną. */
    error?: string;
    /** Placeholder opisujący oczekiwany format. */
    placeholder?: string;
    /** Edytowalne pole tekstowe albo zestaw dostępnych segmentów. */
    variant?: 'input' | 'segmented';
    /** Lista opcji albo kompaktowe kontrolki spinbutton w panelu. */
    panelMode?: 'dropdown' | 'spinbutton';
    /** Preferowane położenie panelu; komponent może odwrócić je przy krawędzi viewportu. */
    placement?: 'top' | 'bottom';
    /** Format prezentacji. Model zawsze pozostaje wartością 24-godzinną. */
    format?: '12h' | '24h';
    /** Dodaje segment sekund do pola, modelu i panelu. */
    showSeconds?: boolean;
    /** Krok godzin wykorzystywany przez opcje i klawiaturę. */
    hourStep?: number;
    /** Krok minut wykorzystywany przez opcje i klawiaturę. */
    minuteStep?: number;
    /** Krok sekund wykorzystywany przez opcje i klawiaturę. */
    secondStep?: number;
    /** Najwcześniejsza dozwolona wartość w formacie HH:mm[:ss]. */
    min?: string;
    /** Najpóźniejsza dozwolona wartość w formacie HH:mm[:ss]. */
    max?: string;
    /** Pozwala zatwierdzić ręcznie wpisaną wartość, która nie leży na siatce kroków. */
    allowOffStep?: boolean;
    /** Locale używany do prezentacji okresu dnia w formacie 12h. */
    locale?: string;
    /** Opcjonalny parser tekstu zastępujący parser wbudowany. */
    parse?: PeauiTimePickerParser;
    /** Opcjonalny formatter prezentacji zastępujący formatter wbudowany. */
    formatValue?: PeauiTimePickerFormatter;
    /** Pozwala usunąć bieżącą wartość przyciskiem pola. */
    canErase?: boolean;
    /** Pole musi zawierać poprawną wartość. */
    required?: boolean;
    /** Całkowicie blokuje kontrolkę. */
    disabled?: boolean;
    /** Pozwala odczytać wartość bez jej zmiany. */
    readonly?: boolean;
    /** Blokuje interakcje i udostępnia stan oczekiwania technologiom asystującym. */
    loading?: boolean;
    /** Dostępna nazwa pola, gdy nie ma widocznej etykiety. */
    ariaLabel?: string;
    /** Dostępna nazwa panelu wyboru czasu. */
    panelAriaLabel?: string;
    /** Dostępna nazwa przycisku panelu w wariancie segmented. */
    triggerAriaLabel?: string;
    /** Tekst ogłaszany podczas ładowania. */
    loadingLabel?: string;
    /** Stabilny identyfikator używany w testach automatycznych. */
    dataTestId?: string;
    /** Bieżąca wartość kontrolowana przez v-model:value. */
    value?: string | undefined;
    /** Początkowa niekontrolowana wartość właściwości value. */
    defaultValue?: string | undefined;
    /** Callback React wywoływany po zmianie właściwości value. */
    onValueChange?: (value: string | undefined) => void;
    /** Stan otwarcia kontrolowany przez v-model:open. */
    open?: boolean;
    /** Początkowa niekontrolowana wartość właściwości open. */
    defaultOpen?: boolean;
    /** Callback React wywoływany po zmianie właściwości open. */
    onOpenChange?: (value: boolean) => void;
    /** Emitowane po zatwierdzeniu poprawnej wartości. */
    onChange?: (value: string | undefined, parts: PeauiTimePickerParts | undefined) => void;
    /** Emitowane po odrzuceniu pustej, błędnej, poza zakresem lub poza krokiem wartości. */
    onInvalid?: (detail: PeauiTimePickerInvalidDetail) => void;
    /** Emitowane po faktycznym otwarciu panelu. */
    onOpen?: () => void;
    /** Emitowane po faktycznym zamknięciu panelu. */
    onClose?: () => void;
    /** Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value. */
    onUpdateValue?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „trigger”. */
    renderTrigger?: (state: {
      displayValue: string;
      open: boolean;
      toggle: () => void;
    }) => ReactNode;
    /** Treść osadzana w nazwanym slocie „hour-option”. */
    renderHourOption?: (option: PeauiTimePickerOption, selected: boolean) => ReactNode;
    /** Treść osadzana w nazwanym slocie „minute-option”. */
    renderMinuteOption?: (option: PeauiTimePickerOption, selected: boolean) => ReactNode;
    /** Treść osadzana w nazwanym slocie „second-option”. */
    renderSecondOption?: (option: PeauiTimePickerOption, selected: boolean) => ReactNode;
    /** Treść osadzana w nazwanym slocie „period-option”. */
    renderPeriodOption?: (option: PeauiTimePickerOption, selected: boolean) => ReactNode;
    /** Treść osadzana w nazwanym slocie „footer”. */
    footerContent?: ReactNode;
    /** Treść osadzana w nazwanym slocie „error”. */
    errorContent?: ReactNode;
    /** Treść osadzana w nazwanym slocie „description”. */
    descriptionContent?: ReactNode;
    /** Treść osadzana w nazwanym slocie „hint”. */
    hint?: ReactNode;
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
    /** Empty selection blocks native form submission; readonly and disabled are exempt. */
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
    value?: number | PeauiPickerRangeValue<number> | undefined;
    /** Początkowa niekontrolowana wartość właściwości value. */
    defaultValue?: number | PeauiPickerRangeValue<number> | undefined;
    /** Callback React wywoływany po zmianie właściwości value. */
    onValueChange?: (value: number | PeauiPickerRangeValue<number> | undefined) => void;
    /** Emitowane po wybraniu akcji usunięcia. */
    onRemove?: (...args: unknown[]) => void;
    /** Emitowane po zmianie modelu „value”; przekaż nową wartość do v-model:value. */
    onUpdateValue?: (...args: unknown[]) => void;
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
    /** Liczba kolumn: domyślnie 2; 0 dobiera liczbę do dzieci. */
    columns?: number;
    /** Odstęp pomiędzy elementami układu. */
    gap?: number;
    /** Konfiguruje właściwość „grid” komponentu. */
    grid?: boolean;
  };
  GridSection: PeauiReactBaseProps & {
    /** Liczba kolumn siatki; domyślnie 4. */
    columns?: number;
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
  ScrollArea: PeauiReactBaseProps & {
    /** Stabilny identyfikator komponentu, relacji ARIA i opcjonalnie zapisanej pozycji. */
    id?: string;
    /** Natywne paski systemowe albo dostępne paski stylowane przez PeaUI. */
    type?: 'native' | 'styled';
    /** Osie, na których zawartość może być przewijana. */
    orientation?: 'vertical' | 'horizontal' | 'both';
    /** Sposób widoczności stylowanych pasków przewijania. */
    scrollbarVisibility?: 'auto' | 'always' | 'hover';
    /** Grubość paska w pikselach, ograniczona do zakresu 6–20. */
    scrollbarSize?: number;
    /** Opóźnienie ukrycia automatycznego paska w milisekundach, maksymalnie 10000. */
    autoHideDelay?: number;
    /** Nadpisuje tabindex viewportu. Tryb native domyślnie dodaje przystanek Tab (0). */
    tabindex?: number;
    /** Dostępna nazwa przewijanego regionu. */
    ariaLabel?: string;
    /** Blokuje publiczne metody i sterowanie stylowanymi paskami, zachowując natywny scroll. */
    disabled?: boolean;
    /** Przywraca pozycję po ponownym montażu, gdy przekazano stabilne id. */
    restorePosition?: boolean;
    /** Stabilny selektor testowy elementu głównego. */
    dataTestId?: string;
    /** Emitowane, gdy komponent zgłasza zdarzenie „scroll”. */
    onScroll?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „scrollStart”. */
    onScrollStart?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „scrollEnd”. */
    onScrollEnd?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „reachStart”. */
    onReachStart?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „reachEnd”. */
    onReachEnd?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „resize”. */
    onResize?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „scrollbar”. */
    scrollbar?: ReactNode;
    /** Treść osadzana w nazwanym slocie „start-indicator”. */
    startIndicator?: ReactNode;
    /** Treść osadzana w nazwanym slocie „end-indicator”. */
    endIndicator?: ReactNode;
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
    items?: PeauiOption[];
    /** Konfiguruje właściwość „separator” komponentu. */
    separator?: string;
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel?: string;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Emitowane, gdy komponent zgłasza zdarzenie „on:navigate”. */
    onNavigate?: (...args: unknown[]) => void;
  };
  CommandPalette: PeauiReactBaseProps & {
    /** Konfiguruje właściwość „commands” komponentu. */
    commands?: unknown;
    /** Konfiguruje właściwość „recent ids” komponentu. */
    recentIds?: unknown;
    /** Konfiguruje właściwość „shortcut” komponentu. */
    shortcut?: unknown;
    /** Konfiguruje właściwość „register shortcut” komponentu. */
    registerShortcut?: boolean;
    /** Konfiguruje właściwość „filter” komponentu. */
    filter?: unknown;
    /** Konfiguruje właściwość „groups” komponentu. */
    groups?: unknown;
    /** Włącza stan ładowania i informuje o trwającej operacji. */
    loading?: boolean;
    /** Tekst pomocniczy widoczny przed wprowadzeniem wartości. */
    placeholder?: string;
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel?: string;
    /** Konfiguruje właściwość „close on execute” komponentu. */
    closeOnExecute?: boolean;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Konfiguruje właściwość „mode” komponentu. */
    mode?: 'modal' | 'embedded';
    /** Konfiguruje właściwość „virtual” komponentu. */
    virtual?: boolean;
    /** Konfiguruje właściwość „virtual threshold” komponentu. */
    virtualThreshold?: number;
    /** Konfiguruje właściwość „virtual height” komponentu. */
    virtualHeight?: number;
    /** Konfiguruje właściwość „empty title” komponentu. */
    emptyTitle?: string;
    /** Konfiguruje właściwość „empty description” komponentu. */
    emptyDescription?: string;
    /** Stan otwarcia kontrolowany przez v-model:open. */
    open?: boolean;
    /** Początkowa niekontrolowana wartość właściwości open. */
    defaultOpen?: boolean;
    /** Callback React wywoływany po zmianie właściwości open. */
    onOpenChange?: (value: boolean) => void;
    /** Wartość kontrolowana przez v-model:query. */
    query?: string;
    /** Początkowa niekontrolowana wartość właściwości query. */
    defaultQuery?: string;
    /** Callback React wywoływany po zmianie właściwości query. */
    onQueryChange?: (value: string) => void;
    /** Wartość kontrolowana przez v-model:activeId. */
    activeId?: string | null;
    /** Początkowa niekontrolowana wartość właściwości activeId. */
    defaultActiveId?: string | null;
    /** Callback React wywoływany po zmianie właściwości activeId. */
    onActiveIdChange?: (value: string | null) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „update:query”. */
    onUpdateQuery?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „update:activeId”. */
    onUpdateActiveId?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „select”. */
    onSelect?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „execute”. */
    onExecute?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „executionSuccess”. */
    onExecutionSuccess?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „executionError”. */
    onExecutionError?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „levelChange”. */
    onLevelChange?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „trigger”. */
    trigger?: ReactNode;
    /** Treść osadzana w nazwanym slocie „header”. */
    header?: ReactNode;
    /** Treść osadzana w nazwanym slocie „command”. */
    command?: ReactNode;
    /** Treść osadzana w nazwanym slocie „group”. */
    group?: ReactNode;
    /** Treść osadzana w nazwanym slocie „empty”. */
    empty?: ReactNode;
    /** Treść osadzana w nazwanym slocie „error”. */
    error?: ReactNode;
    /** Treść osadzana w nazwanym slocie „footer”. */
    footer?: ReactNode;
    /** Treść osadzana w nazwanym slocie „breadcrumb”. */
    breadcrumb?: ReactNode;
  };
  ContextMenu: PeauiReactBaseProps & {
    /** Pozycje współdzielące pełny kontrakt semantyczny z DropdownMenu. */
    items?: PeauiDropdownMenuItem[];
    /** Dane domenowe bieżącego celu przekazywane w zdarzeniach akcji. */
    context?: unknown;
    /** Wyłącza wyłącznie menu kontekstowe, bez blokowania podstawowej funkcji celu. */
    disabled?: boolean;
    /** Dozwolony sposób otwierania menu. */
    trigger?: 'pointer' | 'keyboard' | 'both';
    /** Pozycjonuje menu przy kursorze albo przy prostokącie aktywnego celu. */
    position?: 'cursor' | 'target';
    /** Włącza otwieranie dotykiem po bezruchowym przytrzymaniu. */
    longPress?: boolean;
    /** Czas przytrzymania w milisekundach; wartości są ograniczane do bezpiecznego zakresu. */
    longPressDelay?: number;
    /** Maksymalny ruch wskaźnika w pikselach przed anulowaniem long press. */
    longPressMoveThreshold?: number;
    /** Zamyka otwarte menu po przewinięciu dokumentu lub kontenera celu. */
    closeOnScroll?: boolean;
    /** Odstęp powierzchni menu od punktu albo celu w pikselach. */
    offset?: number;
    /** Zamyka menu po zwykłej akcji. */
    closeOnSelect?: boolean;
    /** Pozwala zapętlać nawigację strzałkami. */
    loop?: boolean;
    /** Gęstość pionowa pozycji menu. */
    density?: 'compact' | 'comfortable';
    /** Dostępna nazwa powierzchni menu. */
    ariaLabel?: string;
    /** Pokazuje stan ładowania zamiast pozycji. */
    loading?: boolean;
    /** Stabilny identyfikator używany w testach automatycznych. */
    dataTestId?: string;
    /** Stan otwarcia kontrolowany przez v-model:open. */
    open?: boolean;
    /** Początkowa niekontrolowana wartość właściwości open. */
    defaultOpen?: boolean;
    /** Callback React wywoływany po zmianie właściwości open. */
    onOpenChange?: (value: boolean) => void;
    /** Emitowane po skutecznym otwarciu menu. */
    onOpen?: (detail: PeauiContextMenuOpenDetail) => void;
    /** Emitowane po zamknięciu menu wraz z przyczyną. */
    onClose?: (reason: PeauiContextMenuCloseReason) => void;
    /** Emitowane po aktywowaniu dostępnej pozycji. */
    onSelect?: (item: PeauiDropdownMenuItem, path: number[], context: unknown) => void;
    /** Emitowane po zmianie intencji pozycji checkbox lub radio. */
    onCheckedChange?: (
      item: PeauiDropdownMenuItem,
      checked: boolean,
      path: number[],
      context: unknown,
    ) => void;
    /** Emitowane po wyborze pozycji posiadającej wartość. */
    onValueChange?: (
      item: PeauiDropdownMenuItem,
      value: unknown,
      path: number[],
      context: unknown,
    ) => void;
    /** Emitowane, gdy aktywacja wskazuje nowy kontekst danych. */
    onContextChange?: (context: unknown) => void;
    /** Emitowane, gdy oczekujący long press został świadomie anulowany. */
    onLongPressCancel?: (reason: PeauiContextMenuLongPressCancelReason) => void;
    /** Treść osadzana w nazwanym slocie „trigger”. */
    renderTarget?: (state: { open: boolean; disabled: boolean; context: unknown }) => ReactNode;
    /** Treść osadzana w nazwanym slocie „item”. */
    renderItem?: (item: PeauiDropdownMenuItem, path: number[]) => ReactNode;
    /** Treść osadzana w nazwanym slocie „item-icon”. */
    renderItemIcon?: (item: PeauiDropdownMenuItem, path: number[]) => ReactNode;
    /** Treść osadzana w nazwanym slocie „item-shortcut”. */
    renderItemShortcut?: (item: PeauiDropdownMenuItem, path: number[]) => ReactNode;
    /** Treść osadzana w nazwanym slocie „group-label”. */
    renderGroupLabel?: (item: PeauiDropdownMenuItem, path: number[]) => ReactNode;
    /** Treść osadzana w nazwanym slocie „empty”. */
    empty?: ReactNode;
    /** Treść osadzana w nazwanym slocie „loading”. */
    loadingContent?: ReactNode;
  };
  DropdownMenu: PeauiReactBaseProps & {
    /** Deklaratywna kolekcja akcji, grup, separatorów i podmenu. */
    items?: PeauiDropdownMenuItem[];
    /** Wyłącza trigger i wszystkie akcje menu. */
    disabled?: boolean;
    /** Strona triggera zachowywana także przy kolizji; powierzchnia jest ograniczana do viewportu. */
    placement?: 'top' | 'right' | 'bottom' | 'left';
    /** Wyrównanie menu na osi poprzecznej. */
    align?: 'start' | 'center' | 'end';
    /** Odstęp menu od triggera w pikselach. */
    offset?: number;
    /** Zamyka menu po zwykłej akcji; checkbox i radio pozostają domyślnie otwarte. */
    closeOnSelect?: boolean;
    /** Pozwala zapętlać nawigację strzałkami między skrajnymi pozycjami. */
    loop?: boolean;
    /** Gęstość pionowa pozycji menu. */
    density?: 'compact' | 'comfortable';
    /** Dostępna nazwa powierzchni menu. */
    ariaLabel?: string;
    /** Widoczna i dostępna etykieta domyślnego triggera. */
    triggerLabel?: string;
    /** Pokazuje stan ładowania zamiast pozycji. */
    loading?: boolean;
    /** Stabilny identyfikator używany w testach automatycznych. */
    dataTestId?: string;
    /** Stan otwarcia kontrolowany przez v-model:open. */
    open?: boolean;
    /** Początkowa niekontrolowana wartość właściwości open. */
    defaultOpen?: boolean;
    /** Callback React wywoływany po zmianie właściwości open. */
    onOpenChange?: (value: boolean) => void;
    /** Emitowane po aktywowaniu dostępnej pozycji. */
    onSelect?: (item: PeauiDropdownMenuItem, path: number[]) => void;
    /** Emitowane po zmianie intencji pozycji checkbox lub radio. */
    onCheckedChange?: (item: PeauiDropdownMenuItem, checked: boolean, path: number[]) => void;
    /** Emitowane po wyborze pozycji posiadającej wartość. */
    onValueChange?: (item: PeauiDropdownMenuItem, value: unknown, path: number[]) => void;
    /** Emitowane po zamknięciu klawiszem Escape. */
    onEscape?: () => void;
    /** Emitowane po zamknięciu kliknięciem poza komponentem. */
    onOutsideClick?: () => void;
    /** Treść osadzana w nazwanym slocie „trigger”. */
    renderTrigger?: (state: { open: boolean; disabled: boolean }) => ReactNode;
    /** Treść osadzana w nazwanym slocie „item”. */
    renderItem?: (item: PeauiDropdownMenuItem, path: number[]) => ReactNode;
    /** Treść osadzana w nazwanym slocie „item-icon”. */
    renderItemIcon?: (item: PeauiDropdownMenuItem, path: number[]) => ReactNode;
    /** Treść osadzana w nazwanym slocie „item-shortcut”. */
    renderItemShortcut?: (item: PeauiDropdownMenuItem, path: number[]) => ReactNode;
    /** Treść osadzana w nazwanym slocie „group-label”. */
    renderGroupLabel?: (item: PeauiDropdownMenuItem, path: number[]) => ReactNode;
    /** Treść osadzana w nazwanym slocie „empty”. */
    empty?: ReactNode;
    /** Treść osadzana w nazwanym slocie „loading”. */
    loadingContent?: ReactNode;
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
    /** Emitowane po zmianie modelu „limit”; przekaż nową wartość do v-model:limit. */
    onUpdateLimit?: (...args: unknown[]) => void;
  };
  MenuBar: PeauiReactBaseProps & {
    /** Uporządkowane sekcje poziomego menu aplikacyjnego. */
    menus?: PeauiMenuBarMenu[];
    /** Wyłącza cały pasek i zamyka aktywną sekcję. */
    disabled?: boolean;
    /** Pozwala zapętlać fokus między pierwszym i ostatnim dostępnym triggerem. */
    loop?: boolean;
    /** Gęstość wizualna triggerów i pozycji menu. */
    variant?: 'default' | 'compact';
    /** Dostępna nazwa elementu z rolą menubar. */
    ariaLabel?: string;
    /** Stabilny identyfikator używany w testach automatycznych. */
    dataTestId?: string;
    /** Wartość kontrolowana przez v-model:openMenu. */
    openMenu?: string | number | null;
    /** Początkowa niekontrolowana wartość właściwości openMenu. */
    defaultOpenMenu?: string | number | null;
    /** Callback React wywoływany po zmianie właściwości openMenu. */
    onOpenMenuChange?: (value: string | number | null) => void;
    /** Emitowane po aktywowaniu pozycji wraz z sekcją nadrzędną. */
    onSelect?: (item: PeauiDropdownMenuItem, path: number[], menu: PeauiMenuBarMenu) => void;
    /** Emitowane po przeniesieniu fokusu roving tabindex na inny trigger. */
    onFocusChange?: (menu: PeauiMenuBarMenu, index: number) => void;
    /** Przekazuje intencję zmiany pozycji checkbox lub radio. */
    onCheckedChange?: (
      item: PeauiDropdownMenuItem,
      checked: boolean,
      path: number[],
      menu: PeauiMenuBarMenu,
    ) => void;
    /** Przekazuje wartość wybranej pozycji wraz z sekcją nadrzędną. */
    onValueChange?: (
      item: PeauiDropdownMenuItem,
      value: unknown,
      path: number[],
      menu: PeauiMenuBarMenu,
    ) => void;
    /** Emitowane po zmianie modelu „openMenu”; przekaż nową wartość do v-model:openMenu. */
    onUpdateOpenMenu?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „menu-trigger”. */
    renderMenuTrigger?: (
      menu: PeauiMenuBarMenu,
      state: { open: boolean; disabled: boolean },
    ) => ReactNode;
    /** Treść osadzana w nazwanym slocie „item”. */
    renderItem?: (item: PeauiDropdownMenuItem, path: number[], menu: PeauiMenuBarMenu) => ReactNode;
    /** Treść osadzana w nazwanym slocie „group-label”. */
    renderGroupLabel?: (
      item: PeauiDropdownMenuItem,
      path: number[],
      menu: PeauiMenuBarMenu,
    ) => ReactNode;
    /** Treść osadzana w nazwanym slocie „shortcut”. */
    renderShortcut?: (
      item: PeauiDropdownMenuItem,
      path: number[],
      menu: PeauiMenuBarMenu,
    ) => ReactNode;
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
    icon?: string;
    /** Konfiguruje właściwość „text” komponentu. */
    text?: string;
    /** Konfiguruje właściwość „path” komponentu. */
    path?: string;
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
    /** Renderuje zawartość przed etykietą zakładki; odpowiednik dynamicznego slotu Vue navigation-tabs-{key}-before. */
    renderTabBefore?: (tab: PeauiOption, index: number) => ReactNode;
    /** Renderuje zawartość za etykietą zakładki; odpowiednik dynamicznego slotu Vue navigation-tabs-{key}-after. */
    renderTabAfter?: (tab: PeauiOption, index: number) => ReactNode;
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
    /** Emitowane po zmianie modelu „page”; przekaż nową wartość do v-model:page. */
    onUpdatePage?: (...args: unknown[]) => void;
  };
  DrawerPanel: PeauiReactBaseProps & {
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel?: string;
    /** Stan otwarcia kontrolowany przez v-model:open. */
    open?: boolean;
    /** Początkowa niekontrolowana wartość właściwości open. */
    defaultOpen?: boolean;
    /** Callback React wywoływany po zmianie właściwości open. */
    onOpenChange?: (value: boolean) => void;
    /** Treść osadzana w nazwanym slocie „header”. */
    header?: ReactNode;
  };
  GuidedTour: PeauiReactBaseProps & {
    /** Konfiguruje właściwość „steps” komponentu. */
    steps: unknown;
    /** Konfiguruje właściwość „mode” komponentu. */
    mode?: 'spotlight' | 'modal';
    /** Konfiguruje właściwość „card variant” komponentu. */
    cardVariant?: 'card' | 'tooltip';
    /** Konfiguruje właściwość „linear” komponentu. */
    linear?: boolean;
    /** Konfiguruje właściwość „show mask” komponentu. */
    showMask?: boolean;
    /** Konfiguruje właściwość „allow skip” komponentu. */
    allowSkip?: boolean;
    /** Konfiguruje właściwość „close on escape” komponentu. */
    closeOnEscape?: boolean;
    /** Konfiguruje właściwość „scroll behavior” komponentu. */
    scrollBehavior?: 'auto' | 'smooth';
    /** Konfiguruje właściwość „target timeout” komponentu. */
    targetTimeout?: number;
    /** Konfiguruje właściwość „missing target strategy” komponentu. */
    missingTargetStrategy?: 'skip' | 'block' | 'close';
    /** Konfiguruje właściwość „spotlight padding” komponentu. */
    spotlightPadding?: number;
    /** Konfiguruje właściwość „pending” komponentu. */
    pending?: boolean;
    /** Konfiguruje właściwość „labels” komponentu. */
    labels?: unknown;
    /** Konfiguruje właściwość „persist” komponentu. */
    persist?: unknown;
    /** Dostępna nazwa elementu przekazywana przez aria-label. */
    ariaLabel?: string;
    /** Stabilny identyfikator data-testid przeznaczony dla testów automatycznych. */
    dataTestId?: string;
    /** Stan otwarcia kontrolowany przez v-model:open. */
    open?: boolean;
    /** Początkowa niekontrolowana wartość właściwości open. */
    defaultOpen?: boolean;
    /** Callback React wywoływany po zmianie właściwości open. */
    onOpenChange?: (value: boolean) => void;
    /** Wartość kontrolowana przez v-model:step. */
    step?: number;
    /** Początkowa niekontrolowana wartość właściwości step. */
    defaultStep?: number;
    /** Callback React wywoływany po zmianie właściwości step. */
    onStepChange?: (value: number) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „update:step”. */
    onUpdateStep?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „start”. */
    onStart?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „stepEnter”. */
    onStepEnter?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „stepLeave”. */
    onStepLeave?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „next”. */
    onNext?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „back”. */
    onBack?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „skip”. */
    onSkip?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „complete”. */
    onComplete?: (...args: unknown[]) => void;
    /** Emitowane, gdy komponent zgłasza zdarzenie „targetMissing”. */
    onTargetMissing?: (...args: unknown[]) => void;
    /** Emitowane, gdy operacja komponentu kończy się błędem. */
    onError?: (...args: unknown[]) => void;
    /** Treść osadzana w nazwanym slocie „title”. */
    title?: ReactNode;
    /** Treść osadzana w nazwanym slocie „progress”. */
    progress?: ReactNode;
    /** Treść osadzana w nazwanym slocie „missing-target”. */
    missingTarget?: ReactNode;
    /** Treść osadzana w nazwanym slocie „content”. */
    content?: ReactNode;
    /** Treść osadzana w nazwanym slocie „description”. */
    description?: ReactNode;
    /** Treść osadzana w nazwanym slocie „actions”. */
    actions?: ReactNode;
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
    ariaLabel?: string;
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
    /** Konfiguruje właściwość „manage trigger accessibility” komponentu. */
    manageTriggerAccessibility?: boolean;
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

export type PeauiReactProps<Name extends ReactComponentName> = ReactComponentPropsMap[Name] &
  Omit<
    Name extends 'ButtonAction'
      ? ButtonHTMLAttributes<HTMLButtonElement>
      : Name extends 'CardPanel' | 'NavigationLink' | 'NavigationCard' | 'NavigationIconCard'
        ? AnchorHTMLAttributes<HTMLAnchorElement>
        : Name extends 'ImageView'
          ? ImgHTMLAttributes<HTMLImageElement>
          : Name extends 'FormInput' | 'FormNumber' | 'FormPassword' | 'SearchInput' | 'InputSlider'
            ? InputHTMLAttributes<HTMLInputElement>
            : Name extends 'FormTextarea'
              ? TextareaHTMLAttributes<HTMLTextAreaElement>
              : HTMLAttributes<HTMLElement>,
    keyof ReactComponentPropsMap[Name]
  >;
