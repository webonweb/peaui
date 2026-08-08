import { computed, readonly, ref } from 'vue';

import seoMessages from './data/seo-messages.json';

export type Locale = 'en' | 'pl';

type MessageValues = Record<string, string | number>;
type Translation = Record<Locale, string>;

const STORAGE_KEY = 'peaui-docs-locale';
const activeLocale = ref<Locale>('en');

const messages = {
  ...seoMessages,
  'language.label': { en: 'Documentation language', pl: 'Język dokumentacji' },
  'language.english': { en: 'English', pl: 'Angielski' },
  'language.polish': { en: 'Polish', pl: 'Polski' },
  'nav.chooseTechnology': { en: 'Choose technology', pl: 'Wybierz technologię' },
  'nav.main': { en: 'Main navigation', pl: 'Główna nawigacja' },
  'nav.start': { en: 'Start', pl: 'Start' },
  'nav.components': { en: 'Components', pl: 'Komponenty' },
  'nav.componentCount': { en: 'components', pl: 'komponentów' },
  'nav.icons': { en: 'Icons', pl: 'Ikony' },
  'nav.technology': { en: 'Technology', pl: 'Technologia' },
  'nav.stable': { en: 'Stable', pl: 'Stabilne' },
  'nav.gettingStarted': { en: 'Getting started', pl: 'Pierwsze kroki' },
  'nav.installation': { en: 'Installation and setup', pl: 'Instalacja i konfiguracja' },
  'nav.iconCatalog': { en: 'Icon catalog', pl: 'Katalog ikon' },
  'nav.allComponents': { en: 'All components', pl: 'Wszystkie komponenty' },
  'nav.componentList': { en: 'Component list', pl: 'Lista komponentów' },
  'nav.openMenu': { en: 'Open navigation', pl: 'Otwórz nawigację' },
  'nav.closeMenu': { en: 'Close navigation', pl: 'Zamknij nawigację' },
  'nav.skip': { en: 'Skip to documentation', pl: 'Przejdź do dokumentacji' },
  'nav.homeLabel': {
    en: 'PEAUI — documentation home page',
    pl: 'PEAUI — strona główna dokumentacji',
  },
  'search.action': { en: 'Search', pl: 'Wyszukaj' },
  'search.dialog': { en: 'Search the documentation', pl: 'Wyszukaj w dokumentacji' },
  'search.placeholder': {
    en: 'Search for a component or icon…',
    pl: 'Wyszukaj komponent lub ikonę…',
  },
  'search.noResults': { en: 'No results found.', pl: 'Nie znaleziono wyniku.' },
  'search.icon': { en: 'Icon', pl: 'Ikona' },
  'search.navigation': { en: 'navigate', pl: 'nawigacja' },
  'search.open': { en: 'open', pl: 'otwórz' },
  'theme.dark': { en: 'Enable dark mode', pl: 'Włącz tryb ciemny' },
  'theme.light': { en: 'Enable light mode', pl: 'Włącz tryb jasny' },
  'common.copy': { en: 'Copy', pl: 'Kopiuj' },
  'common.copied': { en: 'Copied', pl: 'Skopiowano' },
  'common.preview': { en: 'Preview', pl: 'Podgląd' },
  'common.code': { en: 'Code', pl: 'Kod' },
  'common.reset': { en: 'Reset', pl: 'Resetuj' },
  'common.required': { en: 'required', pl: 'wymagane' },
  'common.name': { en: 'Name', pl: 'Nazwa' },
  'common.type': { en: 'Type', pl: 'Typ' },
  'common.default': { en: 'Default', pl: 'Domyślnie' },
  'common.description': { en: 'Description', pl: 'Opis' },
  'common.invalidJson': { en: 'Invalid JSON', pl: 'Niepoprawny JSON' },
  'home.version': { en: 'Documentation v{version}', pl: 'Dokumentacja v{version}' },
  'home.title': {
    en: 'One UI system. Three native integrations.',
    pl: 'Jeden system UI. Trzy natywne integracje.',
  },
  'home.intro': {
    en: 'Accessible, fully typed and customizable components for Vue, React and Web Components — powered by one consistent design system.',
    pl: 'Dostępne, w pełni typowane i łatwe do dostosowania komponenty dla Vue, React i Web Components — oparte na jednym spójnym systemie projektowym.',
  },
  'home.browseComponents': { en: 'Browse components', pl: 'Przeglądaj komponenty' },
  'home.getStarted': { en: 'Get started', pl: 'Zacznij' },
  'home.github': { en: 'GitHub', pl: 'GitHub' },
  'home.npm': { en: 'View on npm', pl: 'Zobacz w npm' },
  'home.githubLabel': {
    en: 'Open the PeaUI repository on GitHub in a new tab',
    pl: 'Otwórz repozytorium PeaUI w GitHubie w nowej karcie',
  },
  'home.npmLabel': {
    en: 'Open the @peaui/ui package on npm in a new tab',
    pl: 'Otwórz paczkę @peaui/ui w npm w nowej karcie',
  },
  'home.frameworkChoice': {
    en: 'Choose a technology to personalize the documentation links',
    pl: 'Wybierz technologię, aby dopasować linki dokumentacji',
  },
  'home.frameworkChoiceHint': {
    en: 'No choice yet — the documentation links will take you to the technology section.',
    pl: 'Nie wybrano jeszcze technologii — linki dokumentacji prowadzą do sekcji wyboru.',
  },
  'home.frameworkSelected': {
    en: '{framework} documentation selected.',
    pl: 'Wybrano dokumentację {framework}.',
  },
  'home.installLabel': { en: 'Install PeaUI', pl: 'Zainstaluj PeaUI' },
  'home.copyCommand': {
    en: 'Copy the npm installation command',
    pl: 'Skopiuj komendę instalacji npm',
  },
  'home.copyError': {
    en: 'The command could not be copied. Select and copy it manually.',
    pl: 'Nie udało się skopiować komendy. Zaznacz ją i skopiuj ręcznie.',
  },
  'home.previewLabel': {
    en: 'Interactive PeaUI component preview',
    pl: 'Interaktywny podgląd komponentów PeaUI',
  },
  'home.previewEyebrow': { en: 'Live component preview', pl: 'Podgląd komponentów na żywo' },
  'home.previewTitle': { en: 'Workspace preferences', pl: 'Ustawienia obszaru roboczego' },
  'home.previewBadge': {
    en: 'Real PeaUI components',
    pl: 'Prawdziwe komponenty PeaUI',
  },
  'home.previewDescription': {
    en: 'Try the real controls below. No backend is required.',
    pl: 'Wypróbuj prawdziwe kontrolki poniżej. Backend nie jest potrzebny.',
  },
  'home.previewName': { en: 'Workspace name', pl: 'Nazwa obszaru roboczego' },
  'home.previewNamePlaceholder': { en: 'Product team', pl: 'Zespół produktu' },
  'home.previewNotifications': {
    en: 'Send accessibility review updates',
    pl: 'Wysyłaj informacje o przeglądzie dostępności',
  },
  'home.previewPlan': { en: 'Density', pl: 'Gęstość' },
  'home.previewPlanComfortable': { en: 'Comfortable', pl: 'Wygodna' },
  'home.previewPlanCompact': { en: 'Compact', pl: 'Kompaktowa' },
  'home.previewSave': { en: 'Save preferences', pl: 'Zapisz ustawienia' },
  'home.previewSaved': { en: 'Preferences saved', pl: 'Ustawienia zapisane' },
  'home.previewSavedMessage': {
    en: 'The preview is interactive — your settings were updated locally.',
    pl: 'Podgląd jest interaktywny — ustawienia zostały zaktualizowane lokalnie.',
  },
  'home.docsInfo': { en: 'Library catalog summary', pl: 'Podsumowanie katalogu biblioteki' },
  'home.vueComponents': { en: 'Vue components', pl: 'komponentów Vue' },
  'home.reactComponents': { en: 'React components', pl: 'komponentów React' },
  'home.webComponents': { en: 'Web Components', pl: 'Web Components' },
  'home.availableIcons': { en: 'available icons', pl: 'dostępnych ikon' },
  'home.integrationEyebrow': { en: 'Technology', pl: 'Technologia' },
  'home.integrationTitle': {
    en: 'Choose your native integration',
    pl: 'Wybierz natywną integrację',
  },
  'home.integrationDescription': {
    en: 'Each integration uses the same design system while keeping the API natural for its ecosystem.',
    pl: 'Każda integracja korzysta z tego samego systemu projektowego, zachowując API naturalne dla swojego ekosystemu.',
  },
  'home.integrationLink': {
    en: 'Open {framework} documentation',
    pl: 'Otwórz dokumentację {framework}',
  },
  'home.components': { en: 'components', pl: 'komponentów' },
  'home.featuredEyebrow': { en: 'From the catalog', pl: 'Z katalogu' },
  'home.featuredTitle': { en: 'Featured components', pl: 'Wyróżnione komponenty' },
  'home.featuredDescription': {
    en: 'Explore some of the components that make PeaUI useful in real applications.',
    pl: 'Poznaj komponenty PeaUI przydatne w rzeczywistych aplikacjach.',
  },
  'home.featuredLink': {
    en: 'Explore {component} documentation',
    pl: 'Poznaj dokumentację komponentu {component}',
  },
  'home.showAll': { en: 'Show all components', pl: 'Pokaż wszystkie komponenty' },
  'home.trustEyebrow': { en: 'Built for real products', pl: 'Do rzeczywistych produktów' },
  'home.trustTitle': {
    en: 'A foundation you can verify',
    pl: 'Podstawa, którą możesz zweryfikować',
  },
  'home.trustDescription': {
    en: 'The package, source code and interactive documentation expose the same public contract.',
    pl: 'Paczka, kod źródłowy i interaktywna dokumentacja pokazują ten sam publiczny kontrakt.',
  },
  'home.trustMit': { en: 'MIT licensed', pl: 'Licencja MIT' },
  'home.trustTypescript': { en: 'TypeScript included', pl: 'TypeScript w zestawie' },
  'home.trustTreeShaking': {
    en: 'Tree-shakable entry points',
    pl: 'Punkty wejścia wspierające tree-shaking',
  },
  'home.trustDarkMode': { en: 'Dark mode', pl: 'Tryb ciemny' },
  'home.trustKeyboard': { en: 'Keyboard accessible', pl: 'Obsługa klawiatury' },
  'home.trustFrameworks': {
    en: 'Vue, React and Web Components',
    pl: 'Vue, React i Web Components',
  },
  'home.finalTitle': {
    en: 'Start building with PeaUI',
    pl: 'Zacznij tworzyć z PeaUI',
  },
  'home.finalDescription': {
    en: 'Explore the components, install the package and build consistent interfaces across Vue, React and Web Components.',
    pl: 'Poznaj komponenty, zainstaluj paczkę i twórz spójne interfejsy dla Vue, React i Web Components.',
  },
  'home.finalGithub': { en: 'View on GitHub', pl: 'Zobacz na GitHubie' },
  'home.finalNpm': { en: 'Install from npm', pl: 'Zainstaluj z npm' },
  'footer.navigation': { en: 'PeaUI resources', pl: 'Zasoby PeaUI' },
  'footer.documentation': { en: 'Component documentation', pl: 'Dokumentacja komponentów' },
  'footer.issues': { en: 'Report an issue', pl: 'Zgłoś błąd' },
  'footer.license': { en: 'MIT license', pl: 'Licencja MIT' },
  'footer.externalLabel': {
    en: '{name} — opens in a new tab',
    pl: '{name} — otwiera się w nowej karcie',
  },
  'demo.variants': { en: 'Component variants', pl: 'Warianty komponentu' },
  'demo.reactVariants': { en: 'React component variants', pl: 'Warianty komponentu React' },
  'demo.wcVariants': { en: 'Web Component variants', pl: 'Warianty Web Component' },
  'demo.default': { en: 'Default', pl: 'Podstawowy' },
  'demo.defaultDescription': {
    en: 'Recommended starting configuration with example data.',
    pl: 'Rekomendowana konfiguracja startowa z przykładowymi danymi.',
  },
  'tableList.demo.default': {
    en: 'A practical starting point with sortable text and date columns, a status tag and a row actions menu.',
    pl: 'Praktyczny punkt wyjścia: sortowany tekst i data, tag statusu oraz menu akcji wiersza.',
  },
  'tableList.demo.selectionLabel': { en: 'Multiple selection', pl: 'Wybór wielu' },
  'tableList.demo.selection': {
    en: 'Checkbox selection with a controlled selectedRows collection and an initially selected row.',
    pl: 'Wybór checkboxami z kontrolowaną tablicą selectedRows i początkowo zaznaczonym wierszem.',
  },
  'tableList.demo.singleLabel': { en: 'Single selection', pl: 'Wybór pojedynczy' },
  'tableList.demo.single': {
    en: 'Radio-style selection driven by canCheckRows and currentCheckedRow.',
    pl: 'Wybór pojedynczego wiersza sterowany przez canCheckRows i currentCheckedRow.',
  },
  'tableList.demo.sortLabel': { en: 'Multi-column sorting', pl: 'Sortowanie wielu kolumn' },
  'tableList.demo.sort': {
    en: 'Independent sort controls with an initial multi-column sort order and a scrollable table.',
    pl: 'Niezależne kontrolki sortowania, początkowa kolejność wielu kolumn i przewijana tabela.',
  },
  'tableList.demo.typesLabel': { en: 'All column types', pl: 'Wszystkie typy kolumn' },
  'tableList.demo.types': {
    en: 'Index, text, date, boolean status, tag, array, link, quick action, inline edit action and empty columns.',
    pl: 'Kolumny: indeks, tekst, data, status logiczny, tag, tablica, link, szybka akcja, edycja inline i pusta wartość.',
  },
  'tableList.demo.workflowLabel': { en: 'Workflow and details', pl: 'Proces i szczegóły' },
  'tableList.demo.workflow': {
    en: 'A stepper column and expandable row details for process-oriented tables.',
    pl: 'Kolumna etapów i rozwijane szczegóły wiersza dla tabel procesowych.',
  },
  'tableList.demo.layoutLabel': { en: 'Borders and sticky columns', pl: 'Obramowanie i sticky' },
  'tableList.demo.layout': {
    en: 'Column widths, borders, horizontal scrolling and columns that users can pin.',
    pl: 'Szerokości i obramowania kolumn, przewijanie poziome oraz kolumny przypinane przez użytkownika.',
  },
  'tableList.demo.visibilityLabel': { en: 'Column visibility', pl: 'Widoczność kolumn' },
  'tableList.demo.visibility': {
    en: 'A column manager that lets users hide optional columns while keeping required columns visible.',
    pl: 'Menedżer pozwalający ukrywać opcjonalne kolumny przy zachowaniu kolumn wymaganych.',
  },
  'tableList.demo.editableLabel': { en: 'Editable records', pl: 'Edycja rekordów' },
  'tableList.demo.editable': {
    en: 'Create and edit flows using text, number and select field definitions with validation constraints.',
    pl: 'Tworzenie i edycja przez pola tekstowe, liczbowe i select wraz z ograniczeniami walidacji.',
  },
  'tableList.demo.actionsLabel': { en: 'Row actions', pl: 'Akcje wiersza' },
  'tableList.demo.actions': {
    en: 'Quick action, inline edit action and a contextual action menu in one table.',
    pl: 'Szybka akcja, akcja edycji inline oraz kontekstowe menu akcji w jednej tabeli.',
  },
  'tableList.demo.emptyLabel': { en: 'Empty state', pl: 'Brak danych' },
  'tableList.demo.empty': {
    en: 'An empty result with an explanatory message and an enabled create action.',
    pl: 'Pusty wynik z komunikatem wyjaśniającym i dostępną akcją utworzenia rekordu.',
  },
  'tableList.demo.loadingLabel': { en: 'Loading', pl: 'Ładowanie' },
  'tableList.demo.loading': {
    en: 'A busy state that preserves the table layout and announces progress to assistive technology.',
    pl: 'Stan zajętości zachowujący układ tabeli i ogłaszający postęp technologiom asystującym.',
  },
  'demo.variantDescription': {
    en: 'Variant with the {name} property set to “{value}”.',
    pl: 'Wariant z właściwością {name} ustawioną na „{value}”.',
  },
  'demo.stateDescription': {
    en: 'Component state with the {name} property enabled.',
    pl: 'Stan komponentu po włączeniu właściwości {name}.',
  },
  'demo.propsPlayground': { en: 'Props playground', pl: 'Playground propsów' },
  'demo.propsHint': {
    en: 'Change the data and see the result without reloading the page.',
    pl: 'Zmień dane i zobacz wynik bez przeładowania strony.',
  },
  'demo.reactPlayground': { en: 'React props playground', pl: 'Playground propsów React' },
  'demo.reactHint': {
    en: 'Change props and see the result without reloading the page.',
    pl: 'Zmień propsy i zobacz wynik bez przeładowania strony.',
  },
  'demo.wcPlayground': {
    en: 'Attributes and properties playground',
    pl: 'Playground atrybutów i properties',
  },
  'demo.wcHint': {
    en: 'Change the native element data without reloading the page.',
    pl: 'Zmieniaj dane natywnego elementu bez przeładowania strony.',
  },
  'demo.events': { en: 'Latest events', pl: 'Ostatnie zdarzenia' },
  'demo.callbacks': { en: 'Latest callbacks', pl: 'Ostatnie callbacki' },
  'demo.customEvents': { en: 'Latest CustomEvents', pl: 'Ostatnie zdarzenia CustomEvent' },
  'demo.reactMissing': {
    en: 'The React implementation of this component was not found.',
    pl: 'Nie znaleziono implementacji React tego komponentu.',
  },
  'demo.wcModuleMissing': {
    en: 'The Web Component module was not found.',
    pl: 'Nie znaleziono modułu Web Component.',
  },
  'demo.previewFailed': {
    en: 'The preview could not be started.',
    pl: 'Nie udało się uruchomić podglądu.',
  },
  'demo.loadingPreview': {
    en: 'Loading the component preview…',
    pl: 'Ładowanie podglądu komponentu…',
  },
  'demo.inputError': {
    en: 'The preview requires different input data.',
    pl: 'Podgląd wymaga innych danych wejściowych.',
  },
  'demo.example': { en: 'Example {number}', pl: 'Przykład {number}' },
  'demo.interactiveItem': {
    en: 'An interactive PEAUI component demonstration item.',
    pl: 'Interaktywny element demonstracyjny komponentu PEAUI.',
  },
} satisfies Record<string, Translation>;

export type TranslationKey = keyof typeof messages;

function interpolate(message: string, values?: MessageValues): string {
  if (!values) return message;
  return message.replace(/\{(\w+)\}/g, (match, name: string) => String(values[name] ?? match));
}

export function t(key: TranslationKey, values?: MessageValues): string {
  return interpolate(messages[key][activeLocale.value], values);
}

export function translateForLocale(
  key: TranslationKey,
  targetLocale: Locale,
  values?: MessageValues,
): string {
  return interpolate(messages[key][targetLocale], values);
}

export function localize<T>(value: Record<Locale, T>): T {
  return value[activeLocale.value];
}

export function setLocale(locale: Locale, persist = true): void {
  activeLocale.value = locale;
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale;
  }
  if (persist && typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, locale);
}

export function initializeLocale(): void {
  const saved = typeof localStorage === 'undefined' ? null : localStorage.getItem(STORAGE_KEY);
  let requested: string | null = null;

  if (typeof window !== 'undefined') {
    requested = new URLSearchParams(window.location.search).get('lang');
    const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
    const routePath =
      basePath && window.location.pathname.startsWith(basePath)
        ? window.location.pathname.slice(basePath.length) || '/'
        : window.location.pathname;
    if (!requested && /^\/pl(?:\/|$)/.test(routePath)) requested = 'pl';
  }

  setLocale(
    requested === 'pl' || requested === 'en'
      ? requested
      : saved === 'pl' || saved === 'en'
        ? saved
        : 'en',
    false,
  );
}

export function useI18n() {
  return {
    locale: readonly(activeLocale),
    isEnglish: computed(() => activeLocale.value === 'en'),
    localize,
    setLocale,
    t,
  };
}

export const locale = readonly(activeLocale);
