import { createElement } from 'react';

import { avatarDemoProps } from '@/components/data-display/Avatar/avatar.demo';
import { avatarGroupDemoProps } from '@/components/data-display/AvatarGroup/avatar-group.demo';
import { keyboardKeyDemoProps } from '@/components/data-display/KeyboardKey/keyboard-key.demo';
import { virtualListDemoItems } from '@/components/data-display/VirtualList/virtual-list.demo';
import { inlineEditDemoProps } from '@/components/data-entry/InlineEdit/inline-edit.demo';
import { copyButtonDemoProps } from '@/components/data-entry/CopyButton/copy-button.demo';
import { contextMenuDemoProps } from '@/components/navigation/ContextMenu/context-menu.demo';
import { dropdownMenuDemoItems } from '@/components/navigation/DropdownMenu/dropdown-menu.demo';
import { menuBarDemoProps } from '@/components/navigation/MenuBar/menu-bar.demo';
import { formSwitchToggleDemoProps } from '@/components/form/FormSwitchToggle/form-switch-toggle.demo';
import { formRatingInputDemoProps } from '@/components/form/FormRatingInput/form-rating-input.demo';
import { formTimePickerDemoProps } from '@/components/form/FormTimePicker/form-time-picker.demo';
import { formDateTimePickerDemoProps } from '@/components/form/FormDateTimePicker/form-date-time-picker.demo';
import { formDateRangePickerDemoProps } from '@/components/form/FormDateRangePicker/form-date-range-picker.demo';
import { formColorPickerDemoProps } from '@/components/form/FormColorPicker/form-color-picker.demo';
import { formPinInputDemoProps } from '@/components/form/FormPinInput/form-pin-input.demo';
import { formTagsInputDemoProps } from '@/components/form/FormTagsInput/form-tags-input.demo';
import { toggleButtonDemoProps } from '@/components/data-entry/ToggleButton/toggle-button.demo';
import { toggleGroupViewItems } from '@/components/data-entry/ToggleGroup/toggle-group.demo';
import { segmentedControlViewItems } from '@/components/data-entry/SegmentedControl/segmented-control.demo';
import { splitButtonDemoProps } from '@/components/data-entry/SplitButton/split-button.demo';
import {
  transferListDemoValue,
  transferListItems,
} from '@/components/data-entry/TransferList/transfer-list.demo';

import type { PeauiReactProps, ReactComponentName } from './generated-react-props';

const card = (title: string) =>
  createElement('article', { key: title, style: { minHeight: 140, minWidth: 220, padding: 24 } }, [
    createElement('strong', { key: 'title' }, title),
    createElement('p', { key: 'body' }, 'Przykładowa treść komponentu PEAUI.'),
  ]);

const presets: Record<ReactComponentName, Record<string, unknown>> = {
  ImageView: { alt: 'Zielony groszek PEAUI', max: '18rem', size: 'm', src: '/peaui-logo.png' },
  SvgIcon: { name: 'checkCircle' },
  Avatar: { ...avatarDemoProps },
  AvatarGroup: { ...avatarGroupDemoProps },
  CalculationResults: {
    additional: 'Wynik orientacyjny',
    hint: 'Na podstawie podanych danych',
    label: 'Zapotrzebowanie na energię',
    result: '42 kWh/m²',
  },
  CardCarousel: {
    children: [card('Pierwsza karta'), card('Druga karta'), card('Trzecia karta')],
    isNavigationDotsVisible: true,
    isNavigationVisible: true,
  },
  CounterBadge: { size: 'm', value: 8, variant: 'success' },
  DescriptionField: { children: 'Warszawa', hint: 'Wartość przykładowa', label: 'Miejscowość' },
  DisclosurePanel: { children: 'Treść rozwijanego panelu.', defaultOpen: true, title: 'Szczegóły' },
  SectionHeading: {
    description: 'Opis sekcji i jej zawartości.',
    hint: 'Informacja dodatkowa',
    title: 'Tytuł sekcji',
  },
  TableList: {
    ariaLabel: 'Lista budynków',
    canSelectRows: true,
    columns: [
      { key: 'name', label: 'Nazwa', sortable: true },
      { key: 'status', label: 'Status' },
    ],
    records: [
      { id: 1, name: 'Budynek A', status: 'Aktywny' },
      { id: 2, name: 'Budynek B', status: 'Roboczy' },
    ],
  },
  TableListFooter: { page: 1, rowsNumber: 10, rowsPerPage: 10, total: 48 },
  TableListHeader: {
    buttonCreateLabel: 'Dodaj rekord',
    canCreate: true,
    canExport: true,
    canFilter: true,
    canSearch: true,
    countFilters: 2,
    totalRecords: 48,
  },
  TagChip: { label: 'Aktywny', size: 'm', variant: 'green' },
  TreeList: {
    canRemove: true,
    defaultTree: [
      { id: '1', label: 'Dokumentacja' },
      { id: '2', label: 'Komponenty' },
    ],
    id: 'tree-demo',
  },
  KeyboardKey: { ...keyboardKeyDemoProps },
  VirtualList: {
    ariaLabel: 'Wyniki wyszukiwania',
    height: 320,
    items: virtualListDemoItems,
    itemSize: 64,
    overscan: 4,
  },
  ButtonAction: { children: 'Zapisz zmiany', variant: 'primary' },
  ButtonExport: { children: 'Eksportuj dane', selectedItemsCount: 3, variant: 'secondary' },
  InputSlider: { ariaLabel: 'Poziom', defaultValue: 0.5, name: 'level' },
  InlineEdit: { ...inlineEditDemoProps },
  CopyButton: { ...copyButtonDemoProps },
  SearchInput: { ariaLabel: 'Szukaj komponentu', defaultValue: '', placeholder: 'Szukaj…' },
  SelectableCard: {
    additional: 'Dodatkowa informacja',
    description: 'Opis dostępnej opcji.',
    title: 'Wybierz wariant',
  },
  ToggleButton: {
    defaultValue: toggleButtonDemoProps.value,
    ariaLabel: toggleButtonDemoProps.ariaLabel,
    content: toggleButtonDemoProps.content,
    icon: toggleButtonDemoProps.icon,
    label: toggleButtonDemoProps.label,
    pressedIcon: toggleButtonDemoProps.pressedIcon,
    pressedLabel: toggleButtonDemoProps.pressedLabel,
    variant: toggleButtonDemoProps.variant,
  },
  ToggleGroup: {
    ariaLabel: 'Sposób wyświetlania',
    defaultValue: 'grid',
    items: toggleGroupViewItems,
    label: 'Widok wyników',
  },
  SegmentedControl: {
    ariaLabel: 'Sposób wyświetlania',
    defaultValue: 'grid',
    items: segmentedControlViewItems,
  },
  SplitButton: { ...splitButtonDemoProps },
  TransferList: {
    defaultValue: [...transferListDemoValue],
    items: transferListItems,
  },
  EmptyState: {
    additional: createElement('button', { type: 'button' }, 'Dodaj element'),
    description: 'Dodaj pierwszy element, aby rozpocząć.',
    title: 'Brak danych',
  },
  MessageText: {
    children: 'To jest pomocniczy komunikat.',
    id: 'message-demo',
    variant: 'info',
    withIcon: true,
  },
  ProgressIndicator: { active: 2, steps: 4 },
  SkeletonLoading: { ariaLabel: 'Ładowanie', rounded: true, size: 'm' },
  SpinnerLoader: {},
  ToastAlert: {
    canClose: true,
    description: 'Operacja zakończyła się powodzeniem.',
    title: 'Gotowe',
    variant: 'success',
    withShadow: true,
  },
  FormFieldLabel: {
    for: 'demo-field',
    hint: 'Pole wymagane',
    required: true,
    text: 'Nazwa budynku',
  },
  FormButtonCheckbox: {
    children: 'Włącz powiadomienia',
    defaultValue: false,
    id: 'notifications',
    name: 'notifications',
  },
  FormButtonGroup: {
    defaultValue: 'a',
    id: 'type',
    label: 'Typ obiektu',
    name: 'type',
    options: [
      { label: 'Mieszkalny', value: 'a' },
      { label: 'Usługowy', value: 'b' },
    ],
  },
  FormCheckbox: {
    children: 'Akceptuję regulamin',
    defaultValue: true,
    id: 'terms',
    name: 'terms',
    required: true,
  },
  FormContainer: {
    children: card('Pola formularza'),
    label: 'Dane budynku',
    showActions: true,
    showCancelButton: true,
  },
  FormDatePicker: { defaultValue: '2026-08-05', id: 'date', label: 'Data wykonania', name: 'date' },
  FormTimePicker: { ...formTimePickerDemoProps, defaultValue: formTimePickerDemoProps.value },
  FormDateTimePicker: {
    ...formDateTimePickerDemoProps,
    defaultValue: formDateTimePickerDemoProps.value,
    value: undefined,
  },
  FormDateRangePicker: {
    ...formDateRangePickerDemoProps,
    defaultValue: formDateRangePickerDemoProps.value,
    value: undefined,
  },
  FormColorPicker: {
    ...formColorPickerDemoProps,
    defaultValue: formColorPickerDemoProps.value,
    value: undefined,
  },
  FormPinInput: {
    ...formPinInputDemoProps,
    defaultValue: formPinInputDemoProps.value,
    value: undefined,
  },
  FormTagsInput: {
    ...formTagsInputDemoProps,
    defaultValue: [...formTagsInputDemoProps.value],
    suggestions: [...formTagsInputDemoProps.suggestions],
    value: undefined,
  },
  FormField: {
    canErase: true,
    children: createElement('input', { id: 'custom-field', placeholder: 'Własna kontrolka' }),
    id: 'custom-field',
    label: 'Pole niestandardowe',
    name: 'custom',
    value: 'Przykładowa wartość',
  },
  FormFileUpload: {},
  FormFileUploadSimple: { context: 'Wybierz maksymalnie 3 pliki', defaultFiles: [], maxFiles: 3 },
  FormInput: {
    canErase: true,
    defaultValue: 'Przykładowa wartość',
    id: 'name',
    label: 'Nazwa',
    name: 'name',
  },
  FormMultiSelect: {
    canErase: true,
    defaultValue: ['vue', 'react'],
    id: 'frameworks',
    label: 'Frameworki',
    name: 'frameworks',
    options: [
      { label: 'Vue', value: 'vue' },
      { label: 'React', value: 'react' },
      { label: 'Web Components', value: 'wc' },
    ],
  },
  FormNumber: {
    canErase: true,
    defaultValue: 42,
    id: 'area',
    label: 'Powierzchnia',
    min: 0,
    name: 'area',
  },
  FormPassword: {
    canVisible: true,
    defaultValue: 'BezpieczneHaslo123',
    id: 'password',
    label: 'Hasło',
    name: 'password',
  },
  FormRadio: {
    children: 'Wariant podstawowy',
    defaultValue: 'basic',
    id: 'basic',
    name: 'variant',
    optionValue: 'basic',
  },
  FormSelect: {
    canErase: true,
    defaultValue: 'active',
    id: 'status',
    label: 'Status',
    name: 'status',
    options: [
      { label: 'Aktywny', value: 'active' },
      { label: 'Nieaktywny', value: 'inactive' },
    ],
  },
  FormTextarea: {
    defaultValue: 'Opis przykładowego obiektu.',
    id: 'description',
    label: 'Opis',
    name: 'description',
    rows: 4,
  },
  FormYearPicker: { defaultValue: 2026, id: 'year', label: 'Rok budowy', name: 'year' },
  FormSwitchToggle: {
    defaultValue: formSwitchToggleDemoProps.value,
    description: formSwitchToggleDemoProps.description,
    id: formSwitchToggleDemoProps.id,
    label: formSwitchToggleDemoProps.label,
    name: formSwitchToggleDemoProps.name,
    showStateLabel: formSwitchToggleDemoProps.showStateLabel,
  },
  FormRatingInput: {
    allowClear: true,
    defaultValue: formRatingInputDemoProps.value,
    description: formRatingInputDemoProps.description,
    id: formRatingInputDemoProps.id,
    label: formRatingInputDemoProps.label,
    labels: formRatingInputDemoProps.labels,
    max: formRatingInputDemoProps.max,
    name: formRatingInputDemoProps.name,
    step: 0.5,
  },
  CardPanel: {
    children: card('Zawartość panelu'),
    header: 'Nagłówek karty',
    isShadowEnabled: true,
  },
  FullscreenContainer: { ariaLabel: 'Podgląd pełnoekranowy', children: card('Podgląd') },
  GridItem: { children: card('Element siatki'), colspan: 6 },
  GridSection: { children: [card('Kolumna 1'), card('Kolumna 2')], columns: 2, gap: '1rem' },
  PageLayout: {
    additional: 'Nawigacja dodatkowa',
    children: card('Główna zawartość'),
    footer: 'Stopka',
    top: 'Nagłówek strony',
  },
  SectionDivider: { direction: 'horizontal', size: 'm' },
  ScrollArea: {
    ariaLabel: 'Lista przykładowych elementów',
    children: [card('Sekcja 1'), card('Sekcja 2'), card('Sekcja 3')],
    orientation: 'vertical',
    style: { blockSize: '18rem' },
    tabIndex: 0,
  },
  Breadcrumbs: {
    ariaLabel: 'Okruszki nawigacyjne',
    items: [
      { label: 'Start', value: '/' },
      { label: 'Komponenty', value: '/components' },
      { active: true, label: 'Przycisk' },
    ],
  },
  ContextMenu: {
    ...contextMenuDemoProps,
    children: 'Kliknij prawym przyciskiem lub naciśnij Shift+F10',
  },
  DropdownMenu: {
    ariaLabel: 'Akcje profilu',
    items: dropdownMenuDemoItems,
    triggerLabel: 'Opcje',
  },
  MenuBar: { ...menuBarDemoProps },
  ListLimitControl: {
    defaultLimit: 20,
    id: 'limit',
    label: 'Na stronie',
    limitList: [10, 20, 50, 100],
  },
  NavigationCard: {
    description: 'Przejdź do katalogu komponentów.',
    path: '#components',
    title: 'Komponenty',
  },
  NavigationDisclosureCard: {
    children: 'Rozwinięta treść nawigacyjna.',
    description: 'Kliknij, aby rozwinąć.',
    id: 'nav-card',
    open: true,
    title: 'Dokumentacja',
  },
  NavigationIconCard: { icon: 'components', path: '#icons', text: 'Katalog ikon' },
  NavigationLink: { children: 'Pierwsze kroki', path: '#start', variant: 'primary' },
  NavigationStepper: {
    options: [
      { key: 'data', label: 'Dane', status: 'complete' },
      { active: true, key: 'verify', label: 'Weryfikacja', status: 'during' },
      { key: 'summary', label: 'Podsumowanie', status: 'default' },
    ],
  },
  NavigationTabs: {
    ariaLabel: 'Sekcje dokumentacji',
    tabs: [
      { active: true, label: 'Podgląd', value: 'preview' },
      { label: 'API', value: 'api' },
    ],
  },
  PaginationControl: { ariaLabel: 'Strony wyników', defaultPage: 3, totalPages: 12 },
  DrawerPanel: {
    ariaLabel: 'Panel filtrów',
    children: card('Filtry'),
    defaultOpen: true,
    header: 'Filtry',
  },
  InfoTooltip: {
    children: createElement('button', { type: 'button' }, 'Najedź lub ustaw fokus'),
    description: 'Pomocniczy opis elementu.',
    title: 'Podpowiedź',
  },
  ModalDialog: {
    ariaLabel: 'Przykładowe okno',
    children: card('Treść okna'),
    defaultOpen: true,
    header: 'Potwierdzenie',
  },
  PopoverButton: { children: 'Otwórz menu', content: card('Zawartość popovera') },
  PopoverOverlayer: { children: 'Otwórz warstwę', content: card('Dowolna zawartość warstwy') },
};

export function getReactStoryArgs<Name extends ReactComponentName>(
  name: Name,
): Partial<PeauiReactProps<Name>> {
  return presets[name] as Partial<PeauiReactProps<Name>>;
}
