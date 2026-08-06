import { createElement } from 'react';

import type { PeauiReactProps, ReactComponentName } from './generated-react-props';

const card = (title: string) =>
  createElement('article', { style: { minHeight: 140, minWidth: 220, padding: 24 } }, [
    createElement('strong', { key: 'title' }, title),
    createElement('p', { key: 'body' }, 'Przykładowa treść komponentu PEAUI.'),
  ]);

const presets: Record<ReactComponentName, Record<string, unknown>> = {
  ImageView: { alt: 'Zielony groszek PEAUI', max: '18rem', size: 'm', src: '/peaui-logo.png' },
  PhotoEditor: { ariaLabel: 'Edytor zdjęcia' },
  SvgIcon: { name: 'checkCircle' },
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
  ButtonAction: { children: 'Zapisz zmiany', variant: 'primary' },
  ButtonExport: { children: 'Eksportuj dane', selectedItemsCount: 3, variant: 'secondary' },
  InputSlider: { ariaLabel: 'Poziom', defaultValue: 0.5, name: 'level' },
  SearchInput: { ariaLabel: 'Szukaj komponentu', defaultValue: '', placeholder: 'Szukaj…' },
  SelectableCard: {
    additional: 'Dodatkowa informacja',
    description: 'Opis dostępnej opcji.',
    title: 'Wybierz wariant',
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
  FieldLabel: { for: 'demo-field', hint: 'Pole wymagane', required: true, text: 'Nazwa budynku' },
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
  FormField: {
    children: createElement('input', { id: 'custom-field', placeholder: 'Własna kontrolka' }),
    id: 'custom-field',
    label: 'Pole niestandardowe',
    name: 'custom',
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
  FormNumber: { defaultValue: 42, id: 'area', label: 'Powierzchnia', min: 0, name: 'area' },
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
  Breadcrumbs: {
    ariaLabel: 'Okruszki nawigacyjne',
    items: [
      { label: 'Start', value: '/' },
      { label: 'Komponenty', value: '/components' },
      { active: true, label: 'Przycisk' },
    ],
  },
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
