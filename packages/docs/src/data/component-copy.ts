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
  AvatarGroup: copy(
    'Kompaktowa grupa awatarów ze stabilną kolejnością, kontrolowanym limitem i dostępną listą pozostałych osób.',
    [
      'Pokazuje zespół w układzie nakładającym się lub z odstępami bez zmiany kolejności DOM.',
      'Udostępnia każdą osobę i licznik nadmiaru jako natywną akcję klawiaturową.',
      'Opcjonalny popover prezentuje wyłącznie ukryte osoby i przywraca fokus po zamknięciu.',
      'Zachowuje identyczne klasy, tokeny i zachowanie w Vue, React i Web Components.',
    ],
    'Tablica osób z identyfikatorami i nazwami; opcjonalnie limit, rozmiar, kształt, kierunek, sposób obsługi nadmiaru i sterowany stan open.',
  ),
  ContextMenu: copy(
    'Dostępne menu kontekstowe pozycjonowane przy kursorze lub aktywnym celu, z bezpiecznym long press i pełną alternatywą klawiaturową.',
    [
      'Otwiera akcje prawym przyciskiem, klawiszem Menu, Shift+F10 albo konfigurowalnym przytrzymaniem dotykowym.',
      'Anuluje natywne menu wyłącznie po skutecznej aktywacji i nie blokuje przewijania ani systemowego zoomu.',
      'Współdzieli z DropdownMenu role ARIA, typeahead, grupy, checkboxy, radio i dwupoziomowe podmenu.',
      'Utrzymuje powierzchnię w granicach viewportu oraz ten sam wygląd w Vue, React i Web Components.',
    ],
    'Tablica pozycji i treść celu; opcjonalnie kontekst danych, sposób wywołania, pozycjonowanie, long press, polityka scroll oraz kontrolowany stan open.',
  ),
  DropdownMenu: copy(
    'Dostępne menu akcji z grupami, separatorami, checkboxami, radiami, skrótami i podmenu do dwóch poziomów.',
    [
      'Realizuje wzorzec ARIA menu z poprawnymi rolami oraz pełną obsługą klawiatury i typeahead.',
      'Pomija wyłączone pozycje w nawigacji, przywraca fokus po zamknięciu i nie tworzy pułapki Tab.',
      'Zachowuje wskazaną stronę top/right/bottom/left i ogranicza powierzchnię do dostępnego viewportu.',
      'Zachowuje identyczny wygląd, klasy i zachowanie w Vue, React i Web Components.',
    ],
    'Tablica pozycji z identyfikatorami i typami; opcjonalnie placement, align, density, polityka zamykania oraz kontrolowany stan open.',
  ),
  SplitButton: copy(
    'Złożony przycisk z niezależną akcją główną oraz menu akcji alternatywnych.',
    [
      'Rozdziela aktywację głównej akcji od otwierania menu, także podczas ładowania i częściowego wyłączenia.',
      'Udostępnia dwie natywne kontrolki w nazwanej grupie oraz pełny wzorzec ARIA menu z przywracaniem fokusu.',
      'Obsługuje Enter, Space, ArrowDown i Escape, pozostawiając Tab do naturalnej nawigacji strony.',
      'Zapewnia rosnącą skalę typografii xxs–l, cele dotykowe 44 px, bezpieczne skracanie długiej etykiety i menu utrzymywane w granicach viewportu.',
      'Zachowuje identyczne klasy, tokeny, wymiary i zachowanie w Vue, React i Web Components.',
    ],
    'Etykieta akcji głównej i tablica pozycji DropdownMenu; opcjonalnie ikona, wariant, rozmiar, wyrównanie, kontrolowany stan open oraz niezależne stany disabled i loading.',
  ),
  TransferList: copy(
    'Dwie powiązane listy wielokrotnego wyboru do bezpiecznego przypisywania i wycofywania elementów.',
    [
      'Przenosi wybrane albo wszystkie widoczne elementy bez zmiany stabilnych kluczy i kolejności.',
      'Zapewnia niezależne wyszukiwanie, sortowanie, liczniki, loading per panel i blokowanie pozycji.',
      'Realizuje wzorzec ARIA multiselectable listbox ze strzałkami, Home, End, Shift i Ctrl/Cmd+A.',
      'Składa panele pionowo w wąskim kontenerze, utrzymuje wewnętrzny scroll i wygląd 1:1 w Vue, React oraz Web Components.',
    ],
    'Tablica obiektów ze stabilnym kluczem i etykietą oraz tablica kluczy docelowych; opcjonalnie zaznaczenia obu paneli, filtry, sortowanie, disabled keys, loading i lokalizowane etykiety.',
  ),
  InlineEdit: copy(
    'Dostępna edycja wartości w miejscu z kontrolowanym szkicem, jawnym zapisem i bezpiecznym anulowaniem.',
    [
      'Komponuje istniejące FormInput, FormNumber, FormSelect, FormTextarea i ButtonAction zamiast powielać pola oraz przyciski.',
      'Obsługuje walidację, kontrolowany zapis asynchroniczny, błędy serwera i stan aria-busy bez samodzielnego zatwierdzania wartości.',
      'Zapewnia Enter lub Ctrl/Cmd+Enter, Escape, F2 i konfigurowalne zachowanie Tab wraz z deterministycznym powrotem fokusu.',
      'Pozostawia widoczny przycisk edycji również przy aktywacji kliknięciem albo podwójnym kliknięciem.',
      'Zawija akcje w wąskich kontenerach i zachowuje wygląd, klasy oraz zachowanie 1:1 w Vue, React i Web Components.',
    ],
    'Wartość i opcjonalnie kontrolowany stan editing; rodzaj edytora, editorProps, walidator, tryb zapisu, aktywacja, akcje, obsługa Tab i stany disabled/readonly/loading/error.',
  ),
  CopyButton: copy(
    'Dostępny przycisk kopiowania tekstu do schowka z bezpiecznym fallbackiem i jednoznacznym potwierdzeniem wyniku.',
    [
      'Komponuje istniejące ButtonAction i SvgIcon, zachowując skalę rozmiarów, warianty oraz minimum 44 px dla celu dotykowego.',
      'Pobiera dokładną wartość z text albo synchronicznego lub asynchronicznego getText dopiero w chwili aktywacji.',
      'Rozróżnia sukces, błąd zapisu i brak obsługi schowka, sprząta fallback DOM oraz bezpiecznie resetuje timer.',
      'Utrzymuje focus na natywnym przycisku, stałą nazwę akcji i ogłasza wynik przez atomowy live region.',
      'Zapewnia warianty icon, text i icon-text oraz identyczne zachowanie i wygląd w Vue, React i Web Components.',
    ],
    'Tekst albo funkcja getText oraz opcjonalnie czas resetu, etykiety, sposób prezentacji treści, wariant i rozmiar ButtonAction, widoczność statusu oraz stany loading/disabled.',
  ),
  KeyboardKey: copy(
    'Semantyczna prezentacja pojedynczego klawisza lub kombinacji skrótu z czytelnym mapowaniem platformy.',
    [
      'Renderuje każdy klawisz jako natywne kbd, zachowując kolejność i zawijanie wyłącznie między keycapami.',
      'Mapuje przenośny token Mod oraz modyfikatory dla Windows, macOS, Linux i platformy ogólnej.',
      'Oddziela skrócony zapis wizualny od pełnej frazy dla technologii asystujących, również przy własnych slotach.',
      'Pozostaje statyczny, nie wchodzi do kolejności Tab i nie deklaruje aria-keyshortcuts bez aktywnej rejestracji skrótu.',
      'Zapewnia identyczny kontrakt, SSR, wygląd i responsywność w Vue, React oraz Web Components.',
    ],
    'Klawisz lub uporządkowana kombinacja tokenów; opcjonalnie platforma, format symbol/text, rozmiar, wariant inline/block, separator, muted i własna dostępna etykieta.',
  ),
  ScrollArea: copy(
    'Responsywny obszar przewijania oparty na natywnym overflow, z opcjonalnymi paskami PeaUI i spójnym API programowym.',
    [
      'Zachowuje natywne przewijanie kółkiem, dotykiem, klawiaturą i momentum bez przechwytywania gestów.',
      'Udostępnia pionowy, poziomy lub dwuosiowy viewport oraz tryby native i styled.',
      'Stylowane paski realizują wzorzec ARIA scrollbar, pełną klawiaturę, przeciąganie i poprawną pozycję logiczną RTL.',
      'Deduplikuje zdarzenia krawędzi, ogranicza aktualizacje do klatek animacji i sprząta obserwatory po odmontowaniu.',
      'Zachowuje identyczny DOM, wygląd, zdarzenia i publiczne metody w Vue, React oraz Web Components.',
    ],
    'Treść slotu lub children oraz opcjonalnie osie, typ pasków, sposób ich widoczności, dostępna nazwa i stabilne id do przywracania pozycji.',
  ),
  VirtualList: copy(
    'Wydajna lista stałej wysokości, która renderuje wyłącznie widoczny zakres dużej kolekcji wraz z kontrolowanym overscanem.',
    [
      'Obsługuje 10 000 i więcej rekordów bez tworzenia równoważnej liczby elementów DOM.',
      'Komponuje istniejący ScrollArea, EmptyState i SpinnerLoader oraz zachowuje wspólne tokeny PeaUI.',
      'Udostępnia tryb list i listbox, pełne metadane aria-setsize/aria-posinset oraz nawigację strzałkami, Home, End, PageUp i PageDown.',
      'Utrzymuje fokusowany wiersz w DOM, deduplikuje reachEnd i zachowuje pozycję przy dołączaniu albo poprzedzaniu danych.',
      'Zapewnia identyczny zakres, DOM, wygląd, zdarzenia i metody przewijania w Vue, React i Web Components.',
    ],
    'Tablica danych, stały itemSize i wysokość viewportu; opcjonalnie overscan, resolver klucza i etykiety, semanticRole listbox, loading, hasMore oraz kontrolowany activeIndex.',
  ),
  MenuBar: copy(
    'Responsywny pasek menu aplikacyjnego, który łączy wiele dostępnych sekcji DropdownMenu w jeden przepływ klawiaturowy.',
    [
      'Realizuje wzorzec ARIA menubar z roving tabindex, strzałkami, Home, End i typeahead.',
      'Przełącza otwarte sekcje nadrzędne bez opuszczania trybu menu i zachowuje obsługę podmenu.',
      'Na małej szerokości przewija się poziomo, dosuwa fokusowany trigger i nie zmienia samodzielnie wzorca na hamburger.',
      'Zachowuje identyczną strukturę, tokeny i zachowanie w Vue, React i Web Components.',
    ],
    'Uporządkowana tablica sekcji z identyfikatorami, etykietami i pozycjami DropdownMenu; opcjonalnie wariant, zapętlenie i kontrolowany stan openMenu.',
  ),
  FormSwitchToggle: copy(
    'Dostępny przełącznik ustawienia boolean lub wartości domenowej, oparty na natywnym checkboxie z rolą switch.',
    [
      'Działa w natywnym formularzu, obsługuje wymagalność i mapuje trueValue oraz falseValue bez utraty typowania.',
      'Łączy etykietę, opis, błąd i stan ładowania poprawnymi relacjami ARIA.',
      'Rozróżnia disabled, fokusowalny readonly oraz loading i nie zmienia wartości w żadnym stanie blokującym.',
      'Zapewnia obszar aktywacji minimum 44 px, zawijanie długiej treści i identyczny wygląd w Vue, React oraz Web Components.',
    ],
    'Kontrolowana wartość przez v-model:value albo value/onValueChange; opcjonalnie wartości domenowe, etykieta, opis, błąd, rozmiar i stany formularza.',
  ),
  FormRatingInput: copy(
    'Dostępna kontrolka do wyboru lub prezentacji oceny na dyskretnej skali z pełnym albo połówkowym krokiem.',
    [
      'Udostępnia jeden natywny suwak i jednoznaczny aria-valuetext zamiast wielu anonimowych przycisków.',
      'Oddziela podgląd hover od zatwierdzonego modelu i pozwala jawnie wyczyścić wartość.',
      'Obsługuje strzałki, Home, End, Delete i Backspace oraz nietabowalny tryb readonly.',
      'Zapewnia cele dotykowe minimum 44 px, zawijanie przy dużym max i identyczny wygląd w Vue, React oraz Web Components.',
    ],
    'Wartość number lub null, dodatnie max, krok 1 albo 0.5 oraz opcjonalne opisy wartości, własna ikona, etykieta, opis, błąd i stany formularza.',
  ),
  ToggleButton: copy(
    'Dostępny przycisk przełączalny do trwałych ustawień włącz/wyłącz, oparty na natywnym button z aria-pressed.',
    [
      'Obsługuje natywnie Enter i Spację oraz kontrolowany model boolean bez dodatkowego punktu tabulacji dla ikony.',
      'Utrzymuje stałą dostępną nazwę nawet wtedy, gdy widoczna etykieta lub ikona zmienia się wraz ze stanem.',
      'Rozróżnia disabled, fokusowalny readonly i loading, a stan aktywny pokazuje spójną powierzchnią i obramowaniem bez dodatkowej ikony wyboru.',
      'Zapewnia cel dotykowy minimum 44 px, opcjonalne zawijanie tekstu i identyczny wygląd w Vue, React oraz Web Components.',
    ],
    'Kontrolowana wartość boolean przez v-model:value albo value/onValueChange; opcjonalnie etykiety, ikony, tryb treści, wariant, rozmiar i stany blokujące.',
  ),
  ToggleGroup: copy(
    'Dostępna grupa powiązanych przycisków przełączalnych z wyborem pojedynczym lub wielokrotnym.',
    [
      'Utrzymuje najwyżej jeden punkt tabulacji i pozwala przechodzić między pozycjami strzałkami, Home oraz End.',
      'Egzekwuje required i allowEmpty bez mieszania aria-pressed z semantyką radio.',
      'Obsługuje orientację poziomą i pionową, RTL, wyłączone pozycje oraz deterministyczne przenoszenie fokusu po zmianie danych.',
      'Zapewnia układ separate lub attached, pięć rozmiarów, wyśrodkowaną treść bez pustego miejsca po ikonie, zawijanie albo przewijanie mobilne i identyczny wygląd w Vue, React oraz Web Components.',
    ],
    'Tablica pozycji z unikalnymi wartościami string lub number oraz model scalar/null dla single albo tablica wartości dla multiple; opcjonalnie etykieta, wymaganie, orientacja, wygląd, wariant i rozmiar xxs–l.',
  ),
  SegmentedControl: copy(
    'Kompaktowa kontrolka do wyboru dokładnie jednej opcji z niewielkiego, wzajemnie wykluczającego się zestawu.',
    [
      'Używa semantyki radiogroup/radio oraz utrzymuje pojedynczy punkt tabulacji bez dublowania NavigationTabs.',
      'Obsługuje automatyczną lub ręczną aktywację, Home/End, orientację pionową i poziomą, RTL oraz pomijanie wyłączonych pozycji.',
      'Aktualizuje wskaźnik po zmianie wartości, rozmiaru i fontu bez powodowania layout shift, a przy reduced motion wyłącza animację.',
      'Zapewnia równy albo naturalny rozkład, tekst i ikony, pełną szerokość oraz mobilny overflow z aktywną pozycją w widoku.',
    ],
    'Tablica pozycji z unikalną wartością string lub number, etykietą i opcjonalną ikoną; pojedynczy model value oraz ustawienia rozkładu, treści, rozmiaru, orientacji i aktywacji.',
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
  FormFieldLabel: copy(
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
      'Udostępnia siatkę kalendarza z nawigacją klawiaturową, widokami miesiąca i roku oraz poprawnym przywracaniem fokusu.',
      'Stosuje tę samą wysokość komórek 44 px, promień, hover, subtelny obrys dzisiejszej daty i wypełnienie zaznaczenia co FormDateTimePicker.',
      'Przy polu o szerokości nawet 200 px zachowuje czytelny overlay minimum 320 px, o ile pozwala na to viewport, dzięki czemu siatka i nawigacja nie są ściskane.',
      'Korzysta ze wspólnej powierzchni pickerów i zachowuje parytet Vue, React oraz Web Components.',
    ],
    'Id, name i v-model:value; opcjonalnie tryb zakresu, limity, etykieta i stany pola.',
  ),
  FormField: copy(
    'Niskopoziomowa obudowa wspólna dla pól formularza.',
    [
      'Łączy etykietę, kontrolkę, podpowiedź i walidację.',
      'Zapewnia spójne stany disabled, readonly i required.',
      'Dla canErase rezerwuje osobny pas akcji z celem 32 × 32 px, dzięki czemu przycisk czyszczenia nie nachodzi na tekst, ikony ani pozostałe kontrolki pola.',
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
    [
      'Zbiera wiele wartości w jednym polu.',
      'Obsługuje filtrowanie długiej listy opcji.',
      'Utrzymuje panel w granicach viewportu na wspólnej powierzchni overlayów PEAUI.',
    ],
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
      'Współdzieli promień, obramowanie, cień, odstęp i responsywne ograniczenia z pozostałymi pickerami.',
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
      'Zapewnia nawigację siatki dekady klawiaturą oraz prawidłowe role, nazwy i stan zaznaczenia.',
      'Używa tych samych stanów wizualnych komórek co pozostałe kalendarze i pickery daty.',
      'Przy polu o szerokości nawet 200 px utrzymuje czytelny overlay minimum 320 px i bezpiecznie przesuwa go przy krawędzi viewportu.',
      'Korzysta ze wspólnej powierzchni pickerów we wszystkich trzech frameworkach.',
    ],
    'Id, name i v-model:value; opcjonalnie tryb zakresu, limity lat i stany pola.',
  ),
  FormTimePicker: copy(
    'Dostępne pole wyboru czasu z ręcznym wpisywaniem, segmentami oraz panelem opcji.',
    [
      'Synchronizuje tekst i wybór z neutralnym modelem HH:mm[:ss] niezależnym od locale.',
      'Obsługuje format 12/24h, sekundy, jawne kroki, ograniczenia min/max i wartości spoza siatki.',
      'Udostępnia wzorce combobox, listbox i spinbutton z pełną klawiaturą oraz przywracaniem fokusu.',
      'Przy polu o szerokości nawet 200 px utrzymuje czytelny panel minimum 320 px, bez ściskania i nachodzenia kontrolek.',
      'Utrzymuje panel w granicach viewportu, cele dotykowe minimum 44 px i parytet Vue, React oraz Web Components.',
    ],
    'Id, name oraz kontrolowana wartość i stan otwarcia; opcjonalnie format, wariant, tryb panelu, kroki, zakres, parser, formatter i stany formularza.',
  ),
  FormDateTimePicker: copy(
    'Dostępne pole wyboru lokalnej daty i czasu we wspólnym, responsywnym panelu.',
    [
      'Synchronizuje datę i czas w jednym jawnym modelu bez niejawnej konwersji strefy czasowej.',
      'Obsługuje pojedyncze lub dzielone pole, układ poziomy i pionowy oraz zatwierdzanie natychmiastowe albo przyciskiem.',
      'Waliduje wartość częściową, granice całego terminu, wyłączone terminy i interwały czasu.',
      'Zapewnia siatkę kalendarza i kontrolki spinbutton z pełną klawiaturą, czytelnymi nazwami, wysokością 44 px i minimalnym celem 24 × 24 px także w najwęższym panelu.',
      'Definiuje wspólne dla pickerów stany dnia: hover, bieżącą datę, zaznaczenie i wyłączenie.',
      'Przy polu o szerokości nawet 200 px zachowuje panel minimum 320 px, czytelną siatkę dni i bezpieczne położenie przy krawędzi viewportu.',
      'Automatycznie układa sekcje pionowo lub obok siebie zależnie od dostępnego miejsca.',
    ],
    'Id, name i kontrolowana wartość { date, time }; opcjonalnie granice, locale, informacyjna strefa, formaty, układ, tryb zatwierdzania i stany formularza.',
  ),
  FormDateRangePicker: copy(
    'Dostępne pole wyboru pełnego zakresu dat z ręcznym wpisem, presetami oraz jednym lub dwoma kalendarzami.',
    [
      'Synchronizuje dwa pola lub jedno pole tekstowe z podglądem zakresu i kanonicznym modelem [start, end].',
      'Obsługuje polityki odwróconej kolejności swap, reject i resetEnd oraz tryb natychmiastowy lub zatwierdzany.',
      'Waliduje minDate, maxDate, wyłączone daty, wartość częściową i kolejność końców bez niejawnej konwersji strefy czasowej.',
      'Zapewnia siatkę kalendarza z roving tabindex, pełną klawiaturą, nazwanym dialogiem, statusem live i opisem początku oraz końca zakresu.',
      'Układa dwa kalendarze jeden pod drugim w wąskim panelu, nie ściska komórek przy triggerze 200 px i utrzymuje overlay w granicach viewportu.',
      'Rozszerza zastosowania prostego trybu range w FormDatePicker o ręczne pola, presety, walidację kolejności i transakcyjne apply/cancel; FormDatePicker pozostaje kompatybilny dla prostych zakresów.',
      'Zachowuje identyczny model, klasy, wygląd i działanie w Vue, React i Web Components.',
    ],
    'Id, name i kontrolowana wartość [start, end]; opcjonalnie liczba kalendarzy, wariant pól, presety, granice, wyłączone daty, locale, parser, formatter, polityka kolejności, zatwierdzanie i stany formularza.',
  ),
  FormColorPicker: copy(
    'Dostępne pole wyboru koloru z ręcznym wpisywaniem, panelem 2D i opcjonalną przezroczystością.',
    [
      'Przechowuje kolor w jednym kanonicznym modelu i bez dryfu prezentuje go jako HEX, RGB lub HSL.',
      'Obsługuje panel rozwijany i inline, zapisane oraz ostatnie kolory, kanał alpha i progressive enhancement EyeDroppera.',
      'Zapewnia opisane suwaki, klawiaturę dla powierzchni nasycenia i jasności, komunikaty niezależne od barwy oraz cele dotykowe 44 px.',
      'Skaluje panel w wąskim viewporcie i zachowuje identyczny kontrakt oraz wygląd w Vue, React i Web Components.',
    ],
    'Id, name i kontrolowana wartość koloru; opcjonalnie format, wariant, gęstość, alpha, palety, EyeDropper, położenie i stany formularza.',
  ),
  FormPinInput: copy(
    'Dostępna grupa pól do wpisywania krótkiego kodu PIN, OTP lub identyfikatora.',
    [
      'Zachowuje wartość jako string, włącznie z zerami początkowymi, i emituje complete wyłącznie dla nowej pełnej wartości.',
      'Obsługuje cyfry lub znaki alfanumeryczne, maskowanie, transformację, grupowanie oraz natywne one-time-code.',
      'Rozdziela wklejony tekst, odrzuca niedozwolone znaki i umożliwia bezpieczną edycję środka kodu.',
      'Zapewnia pojedynczy punkt wejścia Tab, nawigację strzałkami, jednoznaczne etykiety komórek i cele dotykowe minimum 44 px.',
    ],
    'Id, name i kontrolowany string; opcjonalnie długość, typ, maskowanie, pattern, transformacja, grupowanie, autocomplete i stany formularza.',
  ),
  FormTagsInput: copy(
    'Dostępne pole do wprowadzania, edytowania i usuwania wielu krótkich wartości jako tagów.',
    [
      'Waliduje normalizację, duplikaty i limit przed każdą zmianą modelu, również podczas paste i edycji.',
      'Obsługuje tryb swobodny i suggestions-only, obiekty jako wartości oraz anulowalne sugestie asynchroniczne.',
      'Zapewnia combobox/listbox, opisane przyciski usuwania, stabilny fokus z subtelnym dwupikselowym ringiem i pełną obsługę klawiatury.',
      'Panel sugestii korzysta ze wspólnej warstwy popover PEAUI, obsługuje light dismiss i zachowuje szerokość pola.',
      'Zawija długie wartości bez overflow i zachowuje identyczny wygląd oraz działanie w Vue, React i Web Components.',
    ],
    'Id, name i kontrolowane value/inputValue; opcjonalnie sugestie, provider, separatory, normalizacja, walidacja, klucze, serializacja, limit i stany formularza.',
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
      'Kontroluje pozycję, szerokość i odwrócenie panelu przy pionowej krawędzi viewportu.',
      'Zapewnia wspólną powierzchnię, odstęp i wymuszone kolory dla wszystkich opartych na nim pickerów.',
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
