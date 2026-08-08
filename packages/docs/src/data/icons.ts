import iconCatalogSource from '../../../library/src/assets/icons/catalog.json';

export type IconCategoryId = string;

type IconMetadata = {
  category: IconCategoryId;
  description: string;
  keywords: string[];
  label: string;
};

export type IconDefinition = IconMetadata & {
  name: string;
};

const catalogCategoryMetadata: Record<string, { description: string; label: string }> = {
  core: {
    label: 'Podstawowe',
    description: 'Podstawowe symbole PEAUI oraz ich warianty w okręgach, kwadratach i odznakach.',
  },
  extended: {
    label: 'Rozszerzone',
    description: 'Dodatkowe symbole semantyczne uzupełniające podstawowy katalog.',
  },
  ring: {
    label: 'Warianty ring',
    description: 'Symbole osadzone w lekkim, okrągłym obramowaniu.',
  },
  tile: {
    label: 'Warianty tile',
    description: 'Symbole osadzone w zaokrąglonym, kwadratowym obramowaniu.',
  },
  accessibility: {
    label: 'Dostępność',
    description: 'Symbole wspierające dostępność, napisy i technologie asystujące.',
  },
  actions: {
    label: 'Akcje',
    description: 'Operacje wykonywane przez użytkownika i narzędzia interfejsu.',
  },
  animals: { label: 'Zwierzęta', description: 'Zwierzęta i powiązane symbole.' },
  arrows: { label: 'Strzałki', description: 'Kierunki, cofanie i przemieszczanie elementów.' },
  brands: { label: 'Marki', description: 'Znaki usług, platform i systemów.' },
  buildings: { label: 'Budynki', description: 'Budynki, instytucje i miejsca.' },
  charts: { label: 'Wykresy', description: 'Wizualizacja danych, trendy i statystyki.' },
  communication: {
    label: 'Komunikacja',
    description: 'Rozmowy, telefony, wiadomości i kontakty.',
  },
  connectivity: { label: 'Łączność', description: 'Sieci, sygnały i połączenia urządzeń.' },
  design: { label: 'Projektowanie', description: 'Narzędzia graficzne, kolor i edycja.' },
  development: { label: 'Programowanie', description: 'Kod, dane, serwery i integracje.' },
  devices: { label: 'Urządzenia', description: 'Komputery, ekrany i urządzenia elektroniczne.' },
  files: { label: 'Pliki i dokumenty', description: 'Dokumenty, foldery i operacje na plikach.' },
  finance: { label: 'Finanse', description: 'Płatności, waluty, portfele i rozliczenia.' },
  food: { label: 'Jedzenie i napoje', description: 'Produkty spożywcze, posiłki i napoje.' },
  gaming: { label: 'Gry', description: 'Gry, kontrolery i rozrywka.' },
  home: { label: 'Dom', description: 'Wyposażenie domu i codzienne urządzenia.' },
  interface: { label: 'Interfejs', description: 'Ogólne elementy i obiekty aplikacji.' },
  layout: { label: 'Układ', description: 'Siatki, panele, wyrównanie i rozmieszczenie.' },
  mail: { label: 'Poczta', description: 'E-mail, skrzynki odbiorcze i wysyłanie.' },
  maps: { label: 'Mapy i lokalizacje', description: 'Położenie, trasy, mapy i nawigacja.' },
  math: { label: 'Matematyka', description: 'Działania, symbole i narzędzia matematyczne.' },
  media: { label: 'Multimedia', description: 'Dźwięk, film, odtwarzanie i nagrywanie.' },
  medical: { label: 'Medycyna', description: 'Zdrowie, opieka i wyposażenie medyczne.' },
  nature: { label: 'Natura', description: 'Rośliny, krajobrazy i środowisko.' },
  people: { label: 'Osoby', description: 'Użytkownicy, grupy i profile.' },
  photography: { label: 'Fotografia', description: 'Aparaty, obrazy i obróbka zdjęć.' },
  science: { label: 'Nauka', description: 'Badania, laboratoria i symbole naukowe.' },
  security: { label: 'Bezpieczeństwo', description: 'Dostęp, blokady i zabezpieczenia.' },
  shapes: { label: 'Kształty', description: 'Podstawowe figury i symbole geometryczne.' },
  shopping: { label: 'Zakupy', description: 'Sklepy, produkty, paczki i promocje.' },
  sports: { label: 'Sport', description: 'Dyscypliny, aktywność i wyposażenie sportowe.' },
  status: {
    label: 'Status i komunikaty',
    description: 'Potwierdzenia, alerty i informacje o stanie.',
  },
  text: { label: 'Tekst', description: 'Typografia, formatowanie i redagowanie treści.' },
  time: { label: 'Czas i kalendarz', description: 'Daty, godziny, alarmy i harmonogramy.' },
  tools: { label: 'Narzędzia', description: 'Ustawienia, naprawa i narzędzia techniczne.' },
  transportation: { label: 'Transport', description: 'Pojazdy, podróż i infrastruktura.' },
  weather: { label: 'Pogoda', description: 'Warunki atmosferyczne i temperatura.' },
};

type IconCatalog = {
  catalogVersion: number;
  categories: string[];
  iconSize: number;
  icons: Array<{ category: string; name: string; sourceName: string; tags: string[] }>;
  profile: { generator: string; geometrySource: string; name: string };
  strokeWidth: number;
};

export const iconCatalog = iconCatalogSource as IconCatalog;

export const iconCategories: ReadonlyArray<{
  description: string;
  id: IconCategoryId;
  label: string;
}> = [
  ...iconCatalog.categories.map((id) => ({ id, ...catalogCategoryMetadata[id]! })),
  ...(['actions', 'status', 'interface', 'files', 'security'] as const).map((id) => ({
    id,
    ...catalogCategoryMetadata[id]!,
  })),
  {
    id: 'navigation',
    label: 'Nawigacja',
    description: 'Kierunki, przechodzenie między widokami i sterowanie pozycją.',
  },
  {
    id: 'users',
    label: 'Użytkownicy',
    description: 'Osoby, grupy i odbiorcy.',
  },
];

const iconMetadata: Record<string, IconMetadata> = {
  arrow: {
    label: 'Strzałka',
    description: 'Ogólny kierunek albo przejście do kolejnego elementu.',
    category: 'navigation',
    keywords: ['kierunek', 'dalej', 'nawigacja'],
  },
  arrowRight: {
    label: 'Strzałka w prawo',
    description: 'Przejście dalej, otwarcie szczegółów lub następny krok.',
    category: 'navigation',
    keywords: ['prawo', 'dalej', 'następny'],
  },
  arrowRounded: {
    label: 'Zaokrąglona strzałka',
    description: 'Kierunek przedstawiony zaokrąglonym wariantem strzałki.',
    category: 'navigation',
    keywords: ['kierunek', 'zaokrąglona', 'nawigacja'],
  },
  bag: {
    label: 'Torba',
    description: 'Produkty, zamówienia, zakupy albo zasoby użytkownika.',
    category: 'interface',
    keywords: ['zakupy', 'zamówienie', 'produkt'],
  },
  calculator: {
    label: 'Kalkulator',
    description: 'Obliczenia, kalkulacje i narzędzia liczbowe.',
    category: 'interface',
    keywords: ['obliczenia', 'liczby', 'kalkulacja'],
  },
  calendar: {
    label: 'Kalendarz',
    description: 'Wybór daty, termin albo harmonogram.',
    category: 'interface',
    keywords: ['data', 'termin', 'harmonogram'],
  },
  check: {
    label: 'Znacznik wyboru',
    description: 'Akceptacja, zaznaczenie albo poprawnie wykonana operacja.',
    category: 'status',
    keywords: ['gotowe', 'tak', 'akceptacja'],
  },
  checkCircle: {
    label: 'Potwierdzenie w okręgu',
    description: 'Pozytywny status lub ukończenie operacji.',
    category: 'status',
    keywords: ['sukces', 'gotowe', 'potwierdzenie'],
  },
  clock: {
    label: 'Zegar',
    description: 'Czas, oczekiwanie, historia albo zaplanowana operacja.',
    category: 'interface',
    keywords: ['czas', 'oczekiwanie', 'historia'],
  },
  close: {
    label: 'Zamknięcie',
    description: 'Zamykanie okna, panelu, komunikatu lub widoku.',
    category: 'actions',
    keywords: ['zamknij', 'anuluj', 'okno'],
  },
  'code-branch': {
    label: 'Gałąź kodu',
    description: 'Wariant procesu, rozgałęzienie albo wersja kodu.',
    category: 'interface',
    keywords: ['kod', 'branch', 'wersja'],
  },
  cogs: {
    label: 'Ustawienia',
    description: 'Konfiguracja, automatyzacja albo ustawienia systemowe.',
    category: 'interface',
    keywords: ['koła zębate', 'konfiguracja', 'system'],
  },
  compressArrows: {
    label: 'Zmniejszenie widoku',
    description: 'Wyjście z pełnego ekranu lub zwinięcie obszaru.',
    category: 'actions',
    keywords: ['zmniejsz', 'zwiń', 'pełny ekran'],
  },
  copy: {
    label: 'Kopiowanie',
    description: 'Kopiowanie treści albo wartości do schowka.',
    category: 'actions',
    keywords: ['schowek', 'duplikuj', 'kopiuj'],
  },
  cross: {
    label: 'Krzyżyk',
    description: 'Anulowanie, usunięcie wyboru albo negatywny stan.',
    category: 'actions',
    keywords: ['anuluj', 'usuń', 'nie'],
  },
  dark: {
    label: 'Ciemny motyw',
    description: 'Przełączenie albo oznaczenie ciemnego motywu.',
    category: 'interface',
    keywords: ['dark mode', 'motyw', 'noc'],
  },
  dots: {
    label: 'Więcej opcji',
    description: 'Menu kontekstowe lub dodatkowe, ukryte działania.',
    category: 'actions',
    keywords: ['menu', 'więcej', 'opcje'],
  },
  doubleArrowRounded: {
    label: 'Podwójna zaokrąglona strzałka',
    description: 'Szybkie przejście, przewinięcie albo zmiana o kilka pozycji.',
    category: 'navigation',
    keywords: ['podwójna', 'przewiń', 'szybko'],
  },
  download: {
    label: 'Pobieranie',
    description: 'Pobranie danych lub zapisanie zasobu na urządzeniu.',
    category: 'actions',
    keywords: ['pobierz', 'zapisz', 'eksport'],
  },
  edit: {
    label: 'Edycja',
    description: 'Zmiana danych albo przejście do trybu edycji.',
    category: 'actions',
    keywords: ['ołówek', 'zmień', 'edytuj'],
  },
  edit2: {
    label: 'Edycja — wariant',
    description: 'Alternatywny znak edycji danych lub treści.',
    category: 'actions',
    keywords: ['ołówek', 'zmień', 'edytuj'],
  },
  envelope: {
    label: 'Wiadomość e-mail',
    description: 'Poczta, wiadomość albo adres e-mail.',
    category: 'interface',
    keywords: ['email', 'poczta', 'wiadomość'],
  },
  expandArrows: {
    label: 'Powiększenie widoku',
    description: 'Pełny ekran albo rozszerzenie obszaru roboczego.',
    category: 'actions',
    keywords: ['powiększ', 'rozwiń', 'pełny ekran'],
  },
  eye: {
    label: 'Widoczność',
    description: 'Podgląd, pokazanie treści albo kontrola widoczności.',
    category: 'interface',
    keywords: ['pokaż', 'podgląd', 'widoczność'],
  },
  file: {
    label: 'Dokument',
    description: 'Pojedynczy plik, załącznik albo dokument.',
    category: 'files',
    keywords: ['plik', 'dokument', 'załącznik'],
  },
  fileDownload: {
    label: 'Pobieranie pliku',
    description: 'Pobranie konkretnego dokumentu lub załącznika.',
    category: 'files',
    keywords: ['plik', 'pobierz', 'dokument'],
  },
  'file-search': {
    label: 'Wyszukiwanie pliku',
    description: 'Szukanie dokumentu albo przeglądanie jego szczegółów.',
    category: 'files',
    keywords: ['plik', 'szukaj', 'dokument'],
  },
  filters: {
    label: 'Filtry',
    description: 'Filtrowanie listy, wyników albo zestawu danych.',
    category: 'actions',
    keywords: ['filtruj', 'wyniki', 'lista'],
  },
  font: {
    label: 'Typografia',
    description: 'Ustawienia tekstu, kroju albo formatowania.',
    category: 'interface',
    keywords: ['tekst', 'font', 'formatowanie'],
  },
  help: {
    label: 'Pomoc',
    description: 'Pomoc kontekstowa, pytanie albo dodatkowe objaśnienie.',
    category: 'status',
    keywords: ['pytanie', 'wsparcie', 'informacja'],
  },
  hint: {
    label: 'Wskazówka',
    description: 'Podpowiedź lub uzupełniająca informacja dla użytkownika.',
    category: 'status',
    keywords: ['podpowiedź', 'informacja', 'tooltip'],
  },
  imageUpload: {
    label: 'Wysyłanie obrazu',
    description: 'Dodawanie albo przesyłanie pliku graficznego.',
    category: 'files',
    keywords: ['obraz', 'upload', 'dodaj'],
  },
  lock: {
    label: 'Blokada',
    description: 'Zabezpieczenie, ograniczony dostęp albo pole hasła.',
    category: 'security',
    keywords: ['kłódka', 'hasło', 'bezpieczeństwo'],
  },
  'lock-closed': {
    label: 'Zamknięta kłódka',
    description: 'Zablokowany zasób lub brak dostępu.',
    category: 'security',
    keywords: ['zablokowane', 'brak dostępu', 'bezpieczeństwo'],
  },
  'lock-open': {
    label: 'Otwarta kłódka',
    description: 'Odblokowany zasób lub przyznany dostęp.',
    category: 'security',
    keywords: ['odblokowane', 'dostęp', 'bezpieczeństwo'],
  },
  picture: {
    label: 'Obraz',
    description: 'Grafika, zdjęcie, miniatura albo galeria.',
    category: 'files',
    keywords: ['grafika', 'zdjęcie', 'galeria'],
  },
  plug: {
    label: 'Integracja',
    description: 'Połączenie, wtyczka albo integracja z usługą.',
    category: 'interface',
    keywords: ['wtyczka', 'połączenie', 'usługa'],
  },
  plus: {
    label: 'Dodawanie',
    description: 'Utworzenie nowego elementu albo zwiększenie wartości.',
    category: 'actions',
    keywords: ['dodaj', 'nowy', 'więcej'],
  },
  progressFinish: {
    label: 'Ukończony postęp',
    description: 'Ostatni lub poprawnie ukończony etap procesu.',
    category: 'status',
    keywords: ['postęp', 'koniec', 'gotowe'],
  },
  redo: {
    label: 'Ponów',
    description: 'Ponowienie ostatnio cofniętej operacji.',
    category: 'actions',
    keywords: ['ponów', 'historia', 'przywróć'],
  },
  screen: {
    label: 'Ekran',
    description: 'Widok aplikacji, monitor albo urządzenie.',
    category: 'interface',
    keywords: ['monitor', 'widok', 'urządzenie'],
  },
  search: {
    label: 'Wyszukiwanie',
    description: 'Uruchomienie wyszukiwania lub oznaczenie pola wyszukiwarki.',
    category: 'actions',
    keywords: ['lupa', 'znajdź', 'szukaj'],
  },
  sort: {
    label: 'Sortowanie',
    description: 'Zmiana kolejności danych albo kierunku sortowania.',
    category: 'actions',
    keywords: ['kolejność', 'tabela', 'sortuj'],
  },
  trash: {
    label: 'Usuwanie',
    description: 'Usunięcie elementu lub przeniesienie go do kosza.',
    category: 'actions',
    keywords: ['kosz', 'usuń', 'destrukcyjne'],
  },
  trial: {
    label: 'Okres próbny',
    description: 'Stan wersji próbnej albo fragment wskaźnika trial.',
    category: 'status',
    keywords: ['trial', 'próba', 'wersja'],
  },
  trialCurve: {
    label: 'Krzywa okresu próbnego',
    description: 'Dekoracyjny fragment wskaźnika wersji próbnej.',
    category: 'status',
    keywords: ['trial', 'krzywa', 'dekoracja'],
  },
  undo: {
    label: 'Cofnij',
    description: 'Cofnięcie ostatnio wykonanej operacji.',
    category: 'actions',
    keywords: ['cofnij', 'historia', 'anuluj'],
  },
  univercity: {
    label: 'Instytucja',
    description: 'Urząd, uczelnia albo inna instytucja publiczna.',
    category: 'interface',
    keywords: ['urząd', 'uczelnia', 'budynek'],
  },
  users: {
    label: 'Użytkownicy',
    description: 'Grupa osób, odbiorcy albo członkowie zespołu.',
    category: 'users',
    keywords: ['osoby', 'grupa', 'zespół'],
  },
  'users-alt': {
    label: 'Użytkownicy — wariant',
    description: 'Alternatywny znak grupy osób lub odbiorców.',
    category: 'users',
    keywords: ['osoby', 'grupa', 'zespół'],
  },
};

const catalogMetadata: ReadonlyMap<
  string,
  { category: string; name: string; sourceName: string; tags: string[] }
> = new Map(iconCatalog.icons.map((icon) => [icon.name, icon] as const));

const legacyIconModules = import.meta.glob<string>('../../../library/src/assets/icons/*.svg', {
  import: 'default',
  query: '?raw',
});

function getIconName(path: string): string | undefined {
  return path.match(/\/assets\/icons\/(.+)\.svg$/)?.[1];
}

function humanizeCatalogName(name: string): string {
  const text = (name.split('/').at(-1) ?? name).replace(/-/g, ' ');

  return text.charAt(0).toLocaleUpperCase('en') + text.slice(1);
}

function getMetadata(name: string): IconMetadata | undefined {
  const legacyMetadata = iconMetadata[name];

  if (legacyMetadata) return legacyMetadata;

  const catalogIcon = catalogMetadata.get(name);

  if (!catalogIcon) return undefined;

  const label = humanizeCatalogName(name);

  return {
    category: catalogIcon.category,
    description: `Ikona PEAUI: ${label}.`,
    keywords: [catalogIcon.sourceName, ...catalogIcon.tags],
    label,
  };
}

const legacyIconNames = Object.keys(legacyIconModules)
  .map(getIconName)
  .filter((name): name is string => Boolean(name));
const iconNames = [...legacyIconNames, ...catalogMetadata.keys()];

const missingMetadata = iconNames.filter((name) => !getMetadata(name));
const missingFiles = Object.keys(iconMetadata).filter((name) => !legacyIconNames.includes(name));

if (missingMetadata.length > 0 || missingFiles.length > 0) {
  throw new Error(
    `Katalog ikon PEAUI jest niespójny. Brak opisów: ${missingMetadata.join(', ') || '—'}. Brak plików: ${missingFiles.join(', ') || '—'}.`,
  );
}

export const icons: IconDefinition[] = iconNames
  .map((name) => {
    const metadata = getMetadata(name);

    if (!metadata) return undefined;

    return {
      ...metadata,
      name,
    };
  })
  .filter((icon): icon is IconDefinition => Boolean(icon))
  .sort((first, second) => first.name.localeCompare(second.name, 'en'));
