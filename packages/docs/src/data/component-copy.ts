import type { ComponentCopy } from '../types';

const copy = (description: string, purpose: string[], input: string): ComponentCopy => ({
  description,
  purpose,
  input,
});

export const componentCopy: Record<string, ComponentCopy> = {
  ImageView: copy(
    'Responsywny kontener obrazu z kontrolą rozmiaru, maksymalnej szerokości i poprawnego tekstu alternatywnego.',
    [
      'Prezentuje obrazy w spójnych rozmiarach.',
      'Zapewnia bezpieczny fallback tekstu alternatywnego.',
    ],
    'Adres obrazu, opis alternatywny oraz opcjonalny wariant rozmiaru.',
  ),
  PhotoEditior: copy(
    'Edytor zdjęcia umożliwiający wybranie, wykadrowanie i przygotowanie obrazu przed zapisaniem.',
    [
      'Prowadzi użytkownika przez prostą edycję zdjęcia.',
      'Zwraca gotowy obraz przez v-model:image.',
    ],
    'Obiekt obrazu przekazany przez v-model:image; komponent może również rozpocząć pracę bez obrazu.',
  ),
  SvgIcon: copy(
    'Lekki renderer ikon SVG dostępnych w zestawie PEAUI.',
    ['Ładuje ikonę po nazwie.', 'Ukrywa dekoracyjną grafikę przed czytnikami ekranu.'],
    'Nazwa pliku ikony bez rozszerzenia, na przykład „check”, „edit” albo „search”.',
  ),
  Avatar: copy(
    'Awatar użytkownika z obrazem, inicjałami lub ikoną zastępczą oraz opcjonalnym statusem obecności.',
    [
      'Zapewnia stabilny rozmiar i przewidywalną kolejność fallbacków: obraz, inicjały, ikona.',
      'Używa neutralnej powierzchni fallbacku i identycznych tokenów wizualnych w Vue, React i Web Components.',
      'Obsługuje wariant prezentacyjny oraz semantyczny przycisk dostępny z klawiatury.',
      'Udostępnia tekstowy opis statusu technologiom asystującym bez automatycznych komunikatów live.',
    ],
    'Adres obrazu i opis alternatywny albo nazwa lub inicjały; opcjonalnie rozmiar, kształt, status i tryb interaktywny.',
  ),
  CalculationResults: copy(
    'Panel wyniku obliczeń z opcjonalną akcją ponownego przeliczenia.',
    [
      'Eksponuje wynik i jego etykietę.',
      'Obsługuje stan ładowania, blokady oraz tryb uproszczony.',
    ],
    'Etykieta i tekst wyniku, a opcjonalnie flagi stanu oraz widoczności przycisku.',
  ),
  CardCarousel: copy(
    'Karuzela kart z nawigacją, wskaźnikami stron i opcjonalnym automatycznym przesuwaniem.',
    [
      'Porządkuje większy zestaw kart w ograniczonej przestrzeni.',
      'Dostosowuje liczbę slajdów do szerokości widoku.',
    ],
    'Karty przekazane w domyślnym slocie oraz ustawienia nawigacji, animacji i liczby widocznych slajdów.',
  ),
  CounterBadge: copy(
    'Kompaktowy licznik do oznaczania liczby elementów, powiadomień albo aktywnych filtrów.',
    ['Wyświetla krótką wartość liczbową.', 'Oferuje warianty koloru i rozmiaru.'],
    'Liczba oraz opcjonalne właściwości variant i size.',
  ),
  DescriptionField: copy(
    'Pole opisu łączące stałą etykietę z dowolną treścią przekazaną w slocie.',
    [
      'Buduje czytelną parę etykieta–wartość.',
      'Nadaje się do podsumowań i widoków tylko do odczytu.',
    ],
    'Etykieta oraz treść w domyślnym slocie.',
  ),
  DisclosurePanel: copy(
    'Rozwijany panel, który pokazuje lub ukrywa dodatkową treść.',
    [
      'Oszczędza miejsce przy rozbudowanych informacjach.',
      'Udostępnia kontrolowany stan otwarcia przez v-model:open.',
    ],
    'Tytuł, treść slotu oraz stan otwarcia; panel może być wyłączony albo stale otwarty.',
  ),
  SectionHeading: copy(
    'Nagłówek sekcji z kontrolą poziomu wizualnego, znacznika HTML i wariantu koloru.',
    ['Buduje hierarchię treści.', 'Oddziela semantykę HTML od rozmiaru wizualnego.'],
    'Treść nagłówka w slocie oraz właściwości size, as i variant.',
  ),
  TableList: copy(
    'Rozbudowana tabela danych z sortowaniem, wyborem wierszy, edycją i zarządzaniem kolumnami.',
    [
      'Prezentuje rekordy według deklaratywnych kolumn.',
      'Obsługuje stany puste i ładowania oraz akcje na rekordach.',
      'Zapewnia obsługę klawiatury oraz spójne zdarzenia wyboru, edycji i dwukrotnego kliknięcia.',
    ],
    'Tablica records i definicje columns; opcjonalnie konfiguracja sortowania, zaznaczeń, edycji i paginacji.',
  ),
  TableListFooter: copy(
    'Stopka tabeli pokazująca zakres rekordów i informacje o stronie.',
    ['Podsumowuje widoczne dane.', 'Może układać zawartość standardowo albo elastycznie.'],
    'Liczba rekordów, rozmiar strony, bieżąca strona i liczba wszystkich rekordów.',
  ),
  TableListHeader: copy(
    'Pasek narzędzi tabeli z wyszukiwaniem, filtrowaniem, eksportem i tworzeniem rekordów.',
    [
      'Grupuje najważniejsze akcje nad tabelą.',
      'Pokazuje liczniki filtrów i zaznaczonych rekordów.',
    ],
    'Flagi dostępnych akcji, liczniki oraz opcjonalny stan panelu filtrów przez v-model:filters-open.',
  ),
  TagChip: copy(
    'Krótka etykieta statusu lub kategorii renderowana jako tekst albo przycisk.',
    ['Wyróżnia metadane i stany.', 'Udostępnia warianty kolorystyczne, rozmiary i stan aktywny.'],
    'Tekst label oraz opcjonalne właściwości variant, size, active i as.',
  ),
  TreeList: copy(
    'Interaktywna lista drzewiasta do edycji danych zagnieżdżonych.',
    ['Pokazuje relacje nadrzędny–podrzędny.', 'Pozwala aktualizować i usuwać elementy drzewa.'],
    'Obiekt drzewa kontrolowany przez v-model:tree oraz ustawienia poziomu i dozwolonych akcji.',
  ),
  ButtonAction: copy(
    'Podstawowy przycisk akcji biblioteki PEAUI.',
    ['Uruchamia działania użytkownika.', 'Obsługuje warianty wizualne, rozmiary i stan disabled.'],
    'Treść przycisku w slocie oraz opcjonalne size, variant, type i ariaLabel.',
  ),
  ButtonExport: copy(
    'Przycisk eksportu z menu wyboru zakresu danych.',
    [
      'Uruchamia eksport całości albo zaznaczonych elementów.',
      'Informuje o liczbie zaznaczonych rekordów.',
    ],
    'Treść przycisku, liczba zaznaczeń oraz ustawienia rozmiaru, wariantu i położenia menu.',
  ),
  InputSlider: copy(
    'Suwak pozwalający wybrać wartość liczbową.',
    ['Zapewnia szybkie sterowanie liczbą.', 'Synchronizuje wartość przez v-model:value.'],
    'Nazwa pola, wartość liczbowa oraz opcjonalna dostępna etykieta i stan disabled.',
  ),
  SearchInput: copy(
    'Pole wyszukiwania z opóźnieniem wywołania i możliwością czyszczenia.',
    ['Zbiera frazę wyszukiwania.', 'Ogranicza częstotliwość aktualizacji przez debounce.'],
    'Fraza kontrolowana przez v-model:value, placeholder i opcjonalny czas debounce.',
  ),
  SelectableCard: copy(
    'Klikalna karta wyboru z aktywnym, wyłączonym i tylko do odczytu stanem.',
    ['Pozwala wybierać złożone opcje.', 'Komunikuje stan zaznaczenia wizualnie i semantycznie.'],
    'Zawartość w slocie oraz flagi active, disabled i readonly.',
  ),
  EmptyState: copy(
    'Widok pustego stanu z tytułem, opisem i miejscem na akcję.',
    ['Wyjaśnia brak danych.', 'Może wskazać użytkownikowi następny krok.'],
    'Tytuł, opis oraz opcjonalna treść i akcje w slotach.',
  ),
  MessageText: copy(
    'Semantyczny komunikat tekstowy dla informacji, sukcesu, ostrzeżenia lub błędu.',
    ['Nadaje komunikatom spójny wygląd.', 'Może automatycznie dodać ikonę dopasowaną do wariantu.'],
    'Identyfikator, treść slotu oraz wariant, rozmiar i ustawienia ikony.',
  ),
  ProgressIndicator: copy(
    'Okrągły wskaźnik postępu podzielony na kroki.',
    ['Pokazuje pozycję w procesie.', 'Pozwala dobrać rozmiar i grubość obrysu.'],
    'Liczba wszystkich kroków, aktywny krok oraz opcjonalne wymiary.',
  ),
  SkeletonLoading: copy(
    'Animowany placeholder zastępujący treść w czasie ładowania.',
    ['Zmniejsza wizualne przeskoki interfejsu.', 'Sygnalizuje przygotowywanie danych.'],
    'Rozmiar, zaokrąglenie i dostępna etykieta stanu ładowania.',
  ),
  SpinnerLoader: copy(
    'Kompaktowy animowany wskaźnik trwającej operacji.',
    ['Informuje, że interfejs pracuje.', 'Może być osadzony w przycisku, panelu lub formularzu.'],
    'Komponent nie wymaga danych; opcjonalnie przyjmuje dataTestId.',
  ),
  ToastAlert: copy(
    'Powiadomienie typu toast z tytułem, opisem i opcjonalnym zamknięciem.',
    [
      'Przekazuje wynik operacji bez blokowania widoku.',
      'Rozróżnia semantyczne warianty komunikatów.',
    ],
    'Tytuł, opis, wariant oraz opcjonalne ustawienia rozmiaru, obramowania, cienia i zamykania.',
  ),
  FieldLabel: copy(
    'Dostępna etykieta pola formularza ze wskaźnikiem wymagalności i trybu odczytu.',
    ['Łączy tekst etykiety z kontrolką przez atrybut for.', 'Komunikuje wymagany charakter pola.'],
    'Identyfikator kontrolki w for, tekst etykiety i opcjonalne flagi required oraz readonly.',
  ),
  FormButtonCheckbox: copy(
    'Checkbox prezentowany w formie wyraźnego przycisku wyboru.',
    ['Pozwala włączać pojedynczą opcję.', 'Synchronizuje stan przez v-model:value.'],
    'Id, name, wartość logiczna i treść slotu; opcjonalnie rozmiar i stany formularza.',
  ),
  FormButtonGroup: copy(
    'Grupa przycisków służąca do wyboru jednej z dostępnych opcji.',
    [
      'Prezentuje niewielki zestaw opcji obok siebie.',
      'Może działać jako wybór jednokrotny albo przełącznik.',
    ],
    'Lista options, identyfikatory pola i wartość kontrolowana przez v-model:value.',
  ),
  FormCheckbox: copy(
    'Klasyczne pole wyboru z obsługą walidacji i stanów formularza.',
    ['Zbiera odpowiedź tak/nie.', 'Synchronizuje stan przez v-model:value.'],
    'Id, name, wartość logiczna oraz tekst etykiety w slocie.',
  ),
  FormContainer: copy(
    'Kontener formularza z nagłówkiem, stanem ładowania i zestawem akcji.',
    [
      'Porządkuje pola w kompletny formularz.',
      'Obsługuje zatwierdzenie, anulowanie i pozycję przycisków.',
    ],
    'Etykieta formularza i jego pola w slocie; opcjonalne podpisy i widoczność akcji.',
  ),
  FormDatePicker: copy(
    'Pole wyboru daty albo zakresu dat z kalendarzem.',
    [
      'Pozwala wybrać datę bez ręcznego formatowania.',
      'Ogranicza zakres przez daty minimalne i maksymalne.',
    ],
    'Id, name i v-model:value; opcjonalnie tryb zakresu, limity, etykieta i stany pola.',
  ),
  FormField: copy(
    'Niskopoziomowa obudowa wspólna dla pól formularza.',
    [
      'Łączy etykietę, kontrolkę, podpowiedź i walidację.',
      'Zapewnia spójne stany disabled, readonly i required.',
    ],
    'Id i name, kontrolka przekazana w slocie oraz opcjonalne teksty, ikony i komunikaty.',
  ),
  FormFileUpload: copy(
    'Pole przesyłania pojedynczego pliku z walidacją typu i rozmiaru.',
    ['Pozwala wybrać albo usunąć załącznik.', 'Zwraca dane pliku przez v-model:file.'],
    'Plik kontrolowany przez v-model:file, dozwolone typy, limit rozmiaru i wariant prezentacji.',
  ),
  FormFileUploadSimple: copy(
    'Uproszczony uploader jednego lub wielu plików.',
    ['Obsługuje wybór wielu załączników.', 'Waliduje typ, rozmiar i maksymalną liczbę plików.'],
    'Tablica File przez v-model:files oraz ograniczenia allowedTypes, maxFileSize i maxFiles.',
  ),
  FormInput: copy(
    'Jednowierszowe pole tekstowe osadzone w kompletnej obudowie formularza.',
    [
      'Zbiera krótkie dane tekstowe.',
      'Obsługuje etykietę, ikony, czyszczenie i komunikaty walidacji.',
    ],
    'Id, name i tekst przez v-model:value; opcjonalnie etykieta, placeholder i stany pola.',
  ),
  FormMultiSelect: copy(
    'Wielokrotny wybór z listą opcji, wyszukiwaniem i zaznaczaniem wszystkich pozycji.',
    ['Zbiera wiele wartości w jednym polu.', 'Obsługuje filtrowanie długiej listy opcji.'],
    'Lista options i tablica wybranych wartości przez v-model:value oraz standardowe dane pola.',
  ),
  FormNumber: copy(
    'Pole liczbowe z kontrolą zakresu, kroku i opcjonalnym suwakiem.',
    ['Zbiera wartości numeryczne.', 'Pilnuje ograniczeń min, max i step.'],
    'Id, name i liczba przez v-model:value; opcjonalnie zakres, krok, etykieta i stany.',
  ),
  FormPassword: copy(
    'Pole hasła z opcją podglądu, kopiowania i miernikiem siły.',
    ['Bezpiecznie zbiera hasło.', 'Może pomóc w ocenie i obsłudze wprowadzonej wartości.'],
    'Id, name i hasło przez v-model:value oraz opcjonalne etykiety akcji i ustawienia miernika.',
  ),
  FormRadio: copy(
    'Pojedynczy przycisk radiowy przeznaczony do grupy opcji.',
    ['Pozwala wybrać jedną wartość z grupy.', 'Obsługuje walidację i stan disabled.'],
    'Id, wspólna nazwa grupy, optionValue i bieżąca wartość przez v-model:value.',
  ),
  FormSelect: copy(
    'Pole pojedynczego wyboru z listą rozwijaną i opcjonalnym wyszukiwaniem.',
    [
      'Pozwala wybrać jedną pozycję.',
      'Obsługuje listy wyszukiwalne, własne wpisy i bezpieczne pozycjonowanie przy krawędzi ekranu.',
    ],
    'Lista options, id, name i wybrana wartość przez v-model:value.',
  ),
  FormTextarea: copy(
    'Wielowierszowe pole tekstowe z etykietą i licznikiem długości.',
    ['Zbiera dłuższą wypowiedź.', 'Obsługuje limit znaków i komunikaty walidacji.'],
    'Id, name i tekst przez v-model:value; opcjonalnie liczba wierszy, limit i stany pola.',
  ),
  FormYearPicker: copy(
    'Pole wyboru roku albo zakresu lat.',
    [
      'Ułatwia wybór roku bez pełnego kalendarza.',
      'Ogranicza wybór wartościami minYear i maxYear.',
    ],
    'Id, name i v-model:value; opcjonalnie tryb zakresu, limity lat i stany pola.',
  ),
  CardPanel: copy(
    'Uniwersalny panel-karta do grupowania powiązanej treści.',
    ['Buduje wizualne sekcje interfejsu.', 'Oferuje warianty tła, obramowania, rozmiaru i cienia.'],
    'Treść w domyślnym slocie oraz opcjonalne ustawienia wyglądu i znacznika HTML.',
  ),
  FullscreenContainer: copy(
    'Kontener pozwalający przełączyć zawartość do trybu pełnoekranowego.',
    [
      'Zwiększa obszar pracy dla złożonego widoku.',
      'Zapewnia akcje wejścia i wyjścia z pełnego ekranu.',
    ],
    'Treść w slocie oraz dostępna etykieta i własne podpisy przycisków.',
  ),
  GridItem: copy(
    'Element siatki kontrolujący szerokość i opcjonalne zagnieżdżenie kolejnej siatki.',
    [
      'Rozmieszcza pojedynczy fragment treści w gridzie.',
      'Pozwala określić liczbę zajmowanych kolumn.',
    ],
    'Treść slotu oraz colspan, columns, gap i flaga grid.',
  ),
  GridSection: copy(
    'Responsywna sekcja oparta na CSS Grid.',
    ['Układa elementy w kolumnach.', 'Zapewnia spójne odstępy pomiędzy dziećmi.'],
    'Elementy w domyślnym slocie oraz liczba kolumn i odstęp.',
  ),
  PageLayout: copy(
    'Główny szkielet strony ze slotami na nagłówek, treść i elementy pomocnicze.',
    ['Ujednolica układ widoków aplikacji.', 'Może utrzymywać nagłówek podczas przewijania.'],
    'Sekcje strony przekazane w slotach oraz opcjonalna dostępna etykieta i sticky header.',
  ),
  SectionDivider: copy(
    'Separator treści renderowany poziomo albo pionowo.',
    ['Rozdziela logiczne grupy elementów.', 'Oferuje kilka wariantów grubości lub rozmiaru.'],
    'Kierunek i rozmiar separatora.',
  ),
  Breadcrumbs: copy(
    'Okruszki nawigacyjne pokazujące położenie bieżącej strony w hierarchii.',
    ['Pomagają zrozumieć strukturę serwisu.', 'Pozwalają szybko przejść do poziomów nadrzędnych.'],
    'Tablica items z etykietami i ścieżkami oraz opcjonalny separator.',
  ),
  ListLimitControl: copy(
    'Kontrolka wyboru liczby elementów prezentowanych na stronie.',
    [
      'Zmienia rozmiar strony listy.',
      'Synchronizuje wybór i utrzymuje rozwiniętą listę w obszarze ekranu.',
    ],
    'Id, etykieta, lista dostępnych limitów i bieżący limit.',
  ),
  NavigationCard: copy(
    'Karta nawigacyjna z tytułem, opisem i opcjonalnym odnośnikiem.',
    ['Promuje ważne miejsce lub funkcję.', 'Łączy objaśnienie z dużym obszarem aktywacji.'],
    'Tytuł i opis, a opcjonalnie ścieżka, rozmiar, wariant i ariaLabel.',
  ),
  NavigationDisclosureCard: copy(
    'Karta nawigacyjna z rozwijaną treścią.',
    ['Łączy nawigację z dodatkowym objaśnieniem.', 'Może być domyślnie otwarta.'],
    'Id, tytuł i opis oraz opcjonalne path, open i ariaLabel.',
  ),
  NavigationIconCard: copy(
    'Kompaktowa karta-link oparta na ikonie i krótkim tekście.',
    ['Tworzy wizualny skrót do funkcji.', 'Zapewnia duży, czytelny obszar kliknięcia.'],
    'Nazwa ikony, tekst, ścieżka i opcjonalna dostępna etykieta.',
  ),
  NavigationLink: copy(
    'Spójny link nawigacyjny PEAUI z wariantami rozmiaru i koloru.',
    [
      'Przenosi użytkownika pod wskazaną ścieżkę.',
      'Stylizuje tekst lub treść przekazaną w slocie.',
    ],
    'Ścieżka, treść slotu i opcjonalne ariaLabel, size oraz variant.',
  ),
  NavigationStepper: copy(
    'Pozioma nawigacja po krokach procesu ze statusami i obsługą klawiatury.',
    [
      'Pokazuje postęp wieloetapowego procesu.',
      'Pozwala wracać do ukończonych lub aktywnych kroków.',
    ],
    'Tablica options opisująca numery, etykiety i statusy kroków.',
  ),
  NavigationTabs: copy(
    'Pasek zakładek do przełączania pomiędzy powiązanymi widokami.',
    ['Organizuje treść w równoległe sekcje.', 'Emituje wybór aktywnej zakładki.'],
    'Tablica tabs i dostępna etykieta całej nawigacji.',
  ),
  PaginationControl: copy(
    'Nawigacja stronicowania z wyborem poprzedniej, następnej i konkretnej strony.',
    ['Dzieli długie listy na strony.', 'Synchronizuje aktywną stronę przez v-model:page.'],
    'Łączna liczba stron, dostępna etykieta i bieżąca strona.',
  ),
  DrawerPanel: copy(
    'Panel boczny wyświetlany ponad aktualną zawartością.',
    [
      'Pokazuje dodatkowy formularz lub szczegóły bez zmiany strony.',
      'Kontroluje widoczność przez v-model:open.',
    ],
    'Stan otwarcia, ariaLabel oraz treść przekazana w slotach.',
  ),
  InfoTooltip: copy(
    'Dymek z krótką informacją kontekstową.',
    ['Objaśnia ikonę, etykietę albo pojęcie.', 'Obsługuje różne położenia i warianty.'],
    'Treść wyzwalacza i dymka w slotach oraz placement, variant i disabled.',
  ),
  ModalDialog: copy(
    'Modalne okno dialogowe oparte na natywnym elemencie dialog.',
    ['Skupia uwagę na krótkim zadaniu lub decyzji.', 'Zarządza otwarciem przez v-model:open.'],
    'Stan otwarcia, dostępna etykieta oraz nagłówek i treść w slotach.',
  ),
  PopoverButton: copy(
    'Przycisk otwierający zakotwiczone menu albo niewielki panel.',
    [
      'Łączy wyzwalacz i popover w jedną kontrolkę.',
      'Obsługuje położenie oraz dopasowanie szerokości.',
    ],
    'Treść przycisku i popovera w slotach oraz ustawienia wyglądu, placement i popupType.',
  ),
  PopoverOverlayer: copy(
    'Niskopoziomowa warstwa popover pozycjonowana względem własnego wyzwalacza.',
    [
      'Buduje menu, podpowiedzi i małe panele kontekstowe.',
      'Kontroluje pozycję i szerokość treści.',
    ],
    'Wyzwalacz i zawartość w slotach oraz placement, popupType i opcjonalne klasy.',
  ),
};

export const fallbackCopy = (name: string): ComponentCopy =>
  copy(
    `Komponent ${name} należący do biblioteki PEAUI.`,
    [
      'Realizuje spójny wzorzec interfejsu.',
      'Korzysta ze wspólnych stylów i zasad dostępności PEAUI.',
    ],
    'Szczegółowy zestaw wejść znajduje się w tabeli API poniżej.',
  );
