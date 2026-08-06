import { computed, readonly, ref } from 'vue';

export type Locale = 'en' | 'pl';

type MessageValues = Record<string, string | number>;
type Translation = Record<Locale, string>;

const STORAGE_KEY = 'peaui-docs-locale';
const activeLocale = ref<Locale>('en');

const messages = {
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
  'nav.openMenu': { en: 'Open menu', pl: 'Otwórz menu' },
  'nav.closeMenu': { en: 'Close menu', pl: 'Zamknij menu' },
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
  'demo.variants': { en: 'Component variants', pl: 'Warianty komponentu' },
  'demo.reactVariants': { en: 'React component variants', pl: 'Warianty komponentu React' },
  'demo.wcVariants': { en: 'Web Component variants', pl: 'Warianty Web Component' },
  'demo.default': { en: 'Default', pl: 'Podstawowy' },
  'demo.defaultDescription': {
    en: 'Recommended starting configuration with example data.',
    pl: 'Rekomendowana konfiguracja startowa z przykładowymi danymi.',
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

export function localize<T>(value: Record<Locale, T>): T {
  return value[activeLocale.value];
}

export function setLocale(locale: Locale, persist = true): void {
  activeLocale.value = locale;
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale;
    document.title =
      locale === 'en' ? 'PEAUI — component documentation' : 'PEAUI — dokumentacja komponentów';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        locale === 'en'
          ? 'PEAUI component documentation — examples, variants and complete API reference.'
          : 'Dokumentacja komponentów PEAUI — przykłady, warianty i kompletne API.',
      );
  }
  if (persist && typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, locale);
}

export function initializeLocale(): void {
  const saved = typeof localStorage === 'undefined' ? null : localStorage.getItem(STORAGE_KEY);
  setLocale(saved === 'pl' || saved === 'en' ? saved : 'en', false);
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
