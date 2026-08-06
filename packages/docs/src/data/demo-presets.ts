import type { ApiEntry, ComponentDefinition, DemoPreset, DemoVariant } from '../types';
import { t } from '../i18n';
import { localizeDemoData } from './demo-localization';

type DemoDefinition = Pick<
  ComponentDefinition,
  'importPath' | 'models' | 'name' | 'props' | 'slug'
>;

const selectOptions = [
  { id: 'formal', label: 'Formalny', value: 'formalny' },
  { id: 'technical', label: 'Techniczny', value: 'techniczny' },
  { id: 'archive', label: 'Archiwalny', value: 'archiwalny', disabled: true },
];

const formIdentity = { id: 'example-field', name: 'exampleField' };

const componentPresets: Record<string, DemoPreset> = {
  ImageView: {
    props: {
      alt: 'Abstrakcyjny podgląd interfejsu PEAUI',
      size: 'l',
      src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"%3E%3Cdefs%3E%3ClinearGradient id="g" x2="1" y2="1"%3E%3Cstop stop-color="%23005ad4"/%3E%3Cstop offset="1" stop-color="%235be0ba"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="640" height="360" rx="32" fill="url(%23g)"/%3E%3Ccircle cx="510" cy="74" r="120" fill="%23fff" opacity=".12"/%3E%3Cpath d="M82 255 202 135l74 74 52-52 150 150H82z" fill="%23fff" opacity=".82"/%3E%3Ccircle cx="390" cy="102" r="32" fill="%23fff" opacity=".9"/%3E%3C/svg%3E',
    },
  },
  PhotoEditor: { props: { image: undefined, ariaLabel: 'Edytor przykładowego zdjęcia' } },
  SvgIcon: { props: { name: 'checkCircle' } },
  CalculationResults: {
    props: { label: 'Szacowany wynik', result: '128,40 kWh/m²/rok', showCalculateButton: true },
  },
  CardCarousel: {
    props: { ariaLabel: 'Polecane sekcje', defaultVisibleSlides: 3, isNavigationDotsVisible: true },
    defaultSlot: ['Pierwsza karta', 'Druga karta', 'Trzecia karta', 'Czwarta karta'],
  },
  CounterBadge: { props: { value: 12, variant: 'info', size: 'm' } },
  DescriptionField: { props: { label: 'Status wniosku' }, defaultSlot: 'Gotowy do wysłania' },
  DisclosurePanel: {
    props: { title: 'Szczegóły techniczne', open: true },
    defaultSlot: 'Tutaj znajduje się dodatkowa treść, którą można rozwinąć lub zwinąć.',
  },
  SectionHeading: {
    props: { as: 'section', size: 'heading-s', variant: 'default' },
    slots: { title: 'Dane podstawowe', description: 'Najważniejsze informacje dotyczące rekordu.' },
  },
  TableList: {
    props: {
      id: 'applications',
      columns: [
        { key: 'name', label: 'Nazwa', type: 'text', canSort: true },
        { key: 'updatedAt', label: 'Aktualizacja', type: 'date' },
        {
          key: 'status',
          label: 'Status',
          type: 'tag',
          statusDictionary: { Aktywny: 'green', Roboczy: 'orange' },
        },
      ],
      records: [
        { id: '1', name: 'Wniosek Alfa', updatedAt: '2026-08-04', status: 'Aktywny' },
        { id: '2', name: 'Wniosek Beta', updatedAt: '2026-07-28', status: 'Roboczy' },
        { id: '3', name: 'Wniosek Gamma', updatedAt: '2026-07-21', status: 'Aktywny' },
      ],
      rowsPerPage: 10,
      canCreate: false,
      ariaLabel: 'Tabela danych',
      buttonEditableCreateText: 'Dodaj',
      titleRemoveLabel: 'Czy na pewno chcesz usunąć wybrany rekord?',
      descriptionRemoveLabel: 'Usunięcie spowoduje trwałe usunięcie rekordu.',
    },
  },
  TableListFooter: { props: { rowsNumber: 10, rowsPerPage: 10, page: 2, total: 47 } },
  TableListHeader: {
    props: {
      canCreate: true,
      canExport: true,
      canFilter: true,
      canSearch: true,
      totalRecords: 47,
      countFilters: 2,
      buttonCreateLabel: 'Dodaj rekord',
      searchPlaceholder: 'Wpisz czego szukasz',
    },
  },
  TagChip: { props: { label: 'Aktywny', variant: 'green', size: 's', as: 'span' } },
  TreeList: {
    props: {
      id: 'root',
      canRemove: true,
      tree: {
        label: 'Województwo mazowieckie',
        children: {
          warsaw: { label: 'Warszawa', children: {} },
          radom: { label: 'Radom', children: {} },
        },
      },
    },
    defaultSlot: 'Jednostka administracyjna',
  },
  ButtonAction: { props: { variant: 'primary', size: 'm' }, defaultSlot: 'Zapisz zmiany' },
  ButtonExport: { props: { variant: 'outline', selectedItemsCount: 3 }, defaultSlot: 'Eksportuj' },
  InputSlider: { props: { name: 'completion', value: 64, ariaLabel: 'Poziom ukończenia' } },
  SearchInput: { props: { value: '', placeholder: 'Szukaj komponentu…', ariaLabel: 'Szukaj' } },
  SelectableCard: {
    props: { active: true, ariaLabel: 'Wybierz wariant standardowy' },
    defaultSlot: 'Wariant standardowy',
  },
  EmptyState: {
    props: {
      title: 'Brak wyników',
      description: 'Zmień kryteria wyszukiwania i spróbuj ponownie.',
    },
  },
  MessageText: {
    props: { id: 'message-demo', variant: 'info', withIcon: true },
    defaultSlot: 'Dane zostały zapisane automatycznie.',
  },
  ProgressIndicator: { props: { steps: 5, active: 3, size: 96, strokeWidth: 8 } },
  SkeletonLoading: { props: { size: 'm', rounded: true, ariaLabel: 'Ładowanie zawartości' } },
  SpinnerLoader: {},
  ToastAlert: {
    props: {
      variant: 'success',
      title: 'Zmiany zapisane',
      description: 'Nowa wersja danych jest już dostępna.',
      canClose: true,
      withShadow: true,
    },
  },
  FieldLabel: { props: { for: 'demo-name', text: 'Nazwa inwestycji', required: true } },
  FormButtonCheckbox: {
    props: { ...formIdentity, value: true, ariaLabel: 'Zaznacz zgodę' },
    defaultSlot: 'Akceptuję warunki',
  },
  FormButtonGroup: {
    props: {
      ...formIdentity,
      label: 'Tryb widoku',
      value: 'list',
      options: [
        { key: 'list', label: 'Lista' },
        { key: 'grid', label: 'Kafelki' },
        { key: 'map', label: 'Mapa', disabled: true },
      ],
    },
  },
  FormCheckbox: {
    props: { ...formIdentity, value: true },
    defaultSlot: 'Chcę otrzymywać powiadomienia',
  },
  FormContainer: {
    props: {
      label: 'Dane kontaktowe',
      submitButtonLabel: 'Zapisz',
      cancelButtonLabel: 'Anuluj',
      showCancelButton: true,
    },
    defaultSlot: 'Miejsce na pola formularza',
  },
  FormDatePicker: {
    props: { ...formIdentity, label: 'Data rozpoczęcia', value: '2026-08-05', canErase: true },
  },
  FormField: {
    props: { ...formIdentity, label: 'Przykładowe pole', value: 'Treść pola', required: true },
    defaultSlot: 'Własna kontrolka formularza',
  },
  FormFileUpload: {
    props: {
      file: undefined,
      allowedTypes: ['application/pdf', 'image/png'],
      maxFileSize: 5242880,
    },
  },
  FormFileUploadSimple: {
    props: { files: [], allowedTypes: ['application/pdf'], maxFiles: 3, maxFileSize: 5242880 },
  },
  FormInput: {
    props: {
      ...formIdentity,
      label: 'Nazwa inwestycji',
      value: 'Budynek usługowy',
      canErase: true,
      placeholder: 'Wpisz nazwę',
    },
  },
  FormMultiSelect: {
    props: {
      ...formIdentity,
      label: 'Kategorie',
      options: selectOptions,
      value: ['formalny'],
      searchable: true,
      withSelectAll: true,
      placeholder: 'wybierz/wyszukaj',
    },
  },
  FormNumber: {
    props: {
      ...formIdentity,
      label: 'Powierzchnia',
      value: 128,
      min: 0,
      max: 500,
      step: 1,
      after: 'm²',
      isRangeVisible: true,
    },
  },
  FormPassword: {
    props: {
      ...formIdentity,
      label: 'Hasło',
      value: 'PeaUI-2026!',
      canVisible: true,
      enablePasswordStrengthMeter: true,
      showPasswordLabel: 'Pokaz haslo',
      hidePasswordLabel: 'Ukryj haslo',
      copyPasswordLabel: 'Kopiuj haslo',
      copySuccessMessage: 'Haslo skopiowano do schowka.',
      copyErrorMessage: 'Nie udalo sie skopiowac hasla.',
    },
  },
  FormRadio: {
    props: { ...formIdentity, optionValue: 'email', value: 'email' },
    defaultSlot: 'Powiadomienie e-mail',
  },
  FormSelect: {
    props: {
      ...formIdentity,
      label: 'Kategoria',
      options: selectOptions,
      value: 'formalny',
      searchable: true,
      placeholder: 'wybierz/wyszukaj',
    },
  },
  FormTextarea: {
    props: {
      ...formIdentity,
      label: 'Opis',
      value: 'Krótki opis inwestycji.',
      rows: 4,
      maxLength: 240,
    },
  },
  FormYearPicker: {
    props: {
      ...formIdentity,
      label: 'Rok zakończenia',
      value: 2026,
      minYear: 2000,
      maxYear: 2040,
      placeholder: 'wybierz rok',
    },
  },
  CardPanel: {
    props: { size: 'm', isShadowEnabled: true, backgroundColor: 'default' },
    defaultSlot: 'Zawartość pogrupowana wewnątrz panelu.',
  },
  FullscreenContainer: {
    props: {
      ariaLabel: 'Podgląd dokumentu',
      openLabel: 'Otwórz tryb pełnoekranowy',
      closeLabel: 'Zamknij tryb pełnoekranowy',
    },
    defaultSlot: 'Obszar, który można rozwinąć na cały ekran.',
  },
  GridItem: { props: { colspan: 1, grid: false }, defaultSlot: 'Element siatki' },
  GridSection: {
    props: { columns: 3, gap: 4 },
    defaultSlot: ['Pierwsza kolumna', 'Druga kolumna', 'Trzecia kolumna'],
  },
  PageLayout: {
    props: { ariaLabel: 'Nagłówek przykładowej strony', isHeaderSticky: false },
    defaultSlot: 'Główna treść strony',
    slots: { top: 'Nagłówek strony', additional: 'Panel pomocniczy', footer: 'Stopka strony' },
  },
  SectionDivider: { props: { direction: 'horizontal', size: 'm' } },
  Breadcrumbs: {
    props: {
      items: [
        { key: 'home', label: 'Start', path: '/' },
        { key: 'components', label: 'Komponenty', path: '/components' },
        { key: 'current', label: 'Breadcrumbs' },
      ],
      ariaLabel: 'Ścieżka dokumentacji',
    },
  },
  ListLimitControl: {
    props: { id: 'limit-demo', label: 'Elementów na stronie', limitList: [10, 20, 50], limit: 20 },
  },
  NavigationCard: {
    props: {
      title: 'Formularze',
      description: 'Komponenty do zbierania i walidowania danych.',
      path: '#/components',
      variant: 'default',
    },
  },
  NavigationDisclosureCard: {
    props: {
      id: 'navigation-disclosure',
      title: 'Zaawansowane ustawienia',
      description: 'Dodatkowe opcje konfiguracji widoku.',
      open: true,
    },
    defaultSlot: 'Treść rozwiniętej karty',
  },
  NavigationIconCard: {
    props: {
      icon: 'cogs',
      text: 'Ustawienia',
      path: '#/components',
      ariaLabel: 'Przejdź do ustawień',
    },
  },
  NavigationLink: {
    props: { path: '#/components', variant: 'primary', size: 'm' },
    defaultSlot: 'Zobacz komponenty',
  },
  NavigationStepper: {
    props: {
      ariaLabel: 'Postęp wniosku',
      options: [
        { key: 'data', label: 'Dane podstawowe', number: '1', status: 'complete' },
        { key: 'attachments', label: 'Załączniki', number: '2', status: 'during', active: true },
        { key: 'summary', label: 'Podsumowanie', number: '3', status: 'default' },
        { key: 'send', label: 'Wysłanie', number: '4', status: 'disabled' },
      ],
    },
  },
  NavigationTabs: {
    props: {
      ariaLabel: 'Sekcje rekordu',
      tabs: [
        { key: 'details', label: 'Szczegóły', active: true },
        { key: 'history', label: 'Historia' },
        { key: 'files', label: 'Załączniki' },
      ],
    },
  },
  PaginationControl: { props: { ariaLabel: 'Strony wyników', totalPages: 12, page: 4 } },
  DrawerPanel: {
    props: { ariaLabel: 'Panel filtrów', open: false },
    defaultSlot: 'Zawartość panelu bocznego',
    slots: { header: 'Filtry wyników' },
  },
  InfoTooltip: {
    props: { placement: 'top', variant: 'default' },
    defaultSlot: 'Najedź albo ustaw fokus',
    slots: { title: 'Podpowiedź', description: 'Krótka informacja pomocnicza dotycząca elementu.' },
  },
  ModalDialog: {
    props: { ariaLabel: 'Potwierdzenie operacji', open: false },
    defaultSlot: 'Czy na pewno chcesz kontynuować?',
    slots: { header: 'Potwierdź operację' },
  },
  PopoverButton: {
    props: { placement: 'bottom', variant: 'primary' },
    defaultSlot: 'Otwórz menu',
    slots: { content: 'Zawartość podręcznego menu' },
  },
  PopoverOverlayer: {
    props: { placement: 'bottom', ariaLabel: 'Otwórz informacje' },
    defaultSlot: 'Kliknij, aby otworzyć',
    slots: { content: 'Dodatkowe informacje w warstwie popover.' },
  },
};

function parseDefault(entry: ApiEntry): unknown {
  if (entry.default === undefined) return undefined;
  if (entry.default === 'true') return true;
  if (entry.default === 'false') return false;
  if (entry.default === 'undefined' || entry.default === 'null') return undefined;
  if (/^-?\d+(\.\d+)?$/.test(entry.default)) return Number(entry.default);
  if (entry.default === '[]') return [];
  return entry.default;
}

function inferValue(entry: ApiEntry, component: DemoDefinition): unknown {
  const parsedDefault = parseDefault(entry);
  if (parsedDefault !== undefined) return parsedDefault;

  const fixedValues: Record<string, unknown> = {
    ariaLabel: `Przykład komponentu ${component.name}`,
    id: `${component.slug}-demo`,
    label: `Przykładowa etykieta`,
    name: component.slug,
    title: `Przykładowy tytuł`,
    description: 'Przykładowy opis komponentu.',
  };

  if (entry.name in fixedValues) return fixedValues[entry.name];
  if (entry.type.includes('[]')) return [];
  if (entry.type.includes('boolean')) return false;
  if (entry.type.includes('number')) return entry.name === 'page' ? 1 : 0;
  if (entry.type === 'string' || entry.type.includes('string |')) return 'Przykładowa wartość';
  if (entry.type.includes('Record<')) return {};
  return undefined;
}

export function getDemoPreset(component: DemoDefinition): Required<DemoPreset> {
  const configured = componentPresets[component.name] ?? {};
  const inferredProps: Record<string, unknown> = {};

  for (const entry of [...component.props, ...component.models]) {
    if (entry.name in (configured.props ?? {})) continue;

    const parsedDefault = parseDefault(entry);
    if (parsedDefault !== undefined) {
      inferredProps[entry.name] = parsedDefault;
    } else if (entry.required) {
      inferredProps[entry.name] = inferValue(entry, component);
    }
  }

  return localizeDemoData({
    props: { ...inferredProps, ...configured.props },
    defaultSlot: configured.defaultSlot ?? '',
    slots: configured.slots ?? {},
  });
}

function unionValues(type: string): string[] {
  const matches = [...type.matchAll(/['\"]([^'\"]+)['\"]/g)].map((match) => match[1]);
  return [...new Set(matches)].filter((value) => !value.startsWith('on:'));
}

export function getDemoVariants(component: DemoDefinition): DemoVariant[] {
  const preset = getDemoPreset(component);
  const variants: DemoVariant[] = [
    {
      id: 'default',
      label: t('demo.default'),
      description: t('demo.defaultDescription'),
      props: { ...preset.props },
    },
  ];

  const enumEntry = component.props
    .map((entry) => ({ entry, values: unionValues(entry.type) }))
    .find(({ values }) => values.length >= 2 && values.length <= 8);

  if (enumEntry) {
    for (const value of enumEntry.values.slice(0, 6)) {
      variants.push({
        id: `${enumEntry.entry.name}-${value}`,
        label: value,
        description: t('demo.variantDescription', { name: enumEntry.entry.name, value }),
        props: { ...preset.props, [enumEntry.entry.name]: value },
      });
    }
  }

  const booleanPriorities = [
    'disabled',
    'readonly',
    'isLoading',
    'active',
    'open',
    'withShadow',
    'withBorder',
    'isSimple',
    'editable',
    'range',
    'searchable',
    'rounded',
    'isHeaderSticky',
  ];
  const booleanEntries = [...component.props, ...component.models]
    .filter((entry) => entry.type.includes('boolean'))
    .sort(
      (left, right) => booleanPriorities.indexOf(left.name) - booleanPriorities.indexOf(right.name),
    );

  for (const entry of booleanEntries.slice(0, enumEntry ? 2 : 3)) {
    if (variants.some((variant) => variant.id === entry.name)) continue;
    variants.push({
      id: entry.name,
      label: entry.name,
      description: t('demo.stateDescription', { name: entry.name }),
      props: { ...preset.props, [entry.name]: !preset.props[entry.name] },
    });
  }

  return variants;
}

export function getExampleCode(component: DemoDefinition, props: Record<string, unknown>): string {
  const modelNames = new Set(component.models.map((model) => model.name));
  const scriptModels = component.models
    .filter((model) => props[model.name] !== undefined)
    .map((model) => `const ${model.name} = ref(${JSON.stringify(props[model.name], null, 2)});`)
    .join('\n');
  const attributes = Object.entries(props)
    .filter(([name, value]) => value !== undefined && !modelNames.has(name))
    .slice(0, 8)
    .map(([name, value]) => {
      const kebabName = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
      if (value === true) return `  ${kebabName}`;
      if (typeof value === 'string') return `  ${kebabName}="${value}"`;
      return `  :${kebabName}='${JSON.stringify(value)}'`;
    });
  const models = component.models
    .filter((model) => props[model.name] !== undefined)
    .map((model) => `  v-model:${model.name}="${model.name}"`);
  const hasContent = Boolean(getDemoPreset(component).defaultSlot);
  const opening = `<${component.name}${[...models, ...attributes].length ? `\n${[...models, ...attributes].join('\n')}\n` : ''}>`;
  const template = hasContent
    ? `${opening}\n  ${getDemoPreset(component).defaultSlot}\n</${component.name}>`
    : opening.replace(/>$/, ' />');

  return `<script setup lang="ts">\nimport { ${component.name} } from '@peaui/ui';${scriptModels ? `\nimport { ref } from 'vue';\n\n${scriptModels}` : ''}\n<\/script>\n\n<template>\n${template}\n</template>`;
}

function reactPropValue(value: unknown): string {
  if (typeof value === 'string') return JSON.stringify(value);
  return `{${JSON.stringify(value, null, 2)}}`;
}

export function getReactExampleCode(
  component: DemoDefinition,
  props: Record<string, unknown>,
): string {
  const modelNames = new Set(component.models.map((model) => model.name));
  const activeModels = component.models.filter((model) => props[model.name] !== undefined);
  const state = activeModels
    .map((model) => {
      const capitalized = model.name.charAt(0).toUpperCase() + model.name.slice(1);
      return `  const [${model.name}, set${capitalized}] = useState(${JSON.stringify(props[model.name], null, 2)});`;
    })
    .join('\n');
  const attributes = Object.entries(props)
    .filter(([name, value]) => value !== undefined && !modelNames.has(name))
    .slice(0, 8)
    .map(([name, value]) => `      ${name}=${reactPropValue(value)}`);
  const models = activeModels.flatMap((model) => {
    const capitalized = model.name.charAt(0).toUpperCase() + model.name.slice(1);
    return [
      `      ${model.name}={${model.name}}`,
      `      on${capitalized}Change={set${capitalized}}`,
    ];
  });
  const preset = getDemoPreset(component);
  const namedSlots = Object.entries(preset.slots).map(
    ([name, value]) =>
      `      ${name.replace(/[-:]([a-z])/g, (_, character: string) => character.toUpperCase())}=${reactPropValue(value)}`,
  );
  const allAttributes = [...models, ...attributes, ...namedSlots];
  const content = Array.isArray(preset.defaultSlot)
    ? preset.defaultSlot.join('\n')
    : preset.defaultSlot;
  const opening = `<${component.name}${allAttributes.length ? `\n${allAttributes.join('\n')}\n    ` : ''}>`;
  const jsx = content
    ? `${opening}\n      ${content}\n    </${component.name}>`
    : opening.replace(/>$/, ' />');

  return `import ${component.name} from '${component.importPath}';\nimport '@peaui/ui/styles.css';${activeModels.length ? "\nimport { useState } from 'react';" : ''}\n\nexport function Example() {${state ? `\n${state}\n` : ''}\n  return (\n    ${jsx}\n  );\n}`;
}
