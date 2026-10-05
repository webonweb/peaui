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
      'Przekazuje atrybuty loading, srcset i sizes do obrazu.',
    ],
    'Podaj src i alt opisujący znaczenie obrazu albo alt="" dla dekoracji. Opcjonalne size i max kontrolują układ. Pominięty alt korzysta z wartości zastępczej, która nie zastępuje opisu dopasowanego do kontekstu.',
  ),
  SvgIcon: copy(
    'Lekki renderer ikon SVG dostępnych w zestawie PEAUI.',
    ['Ładuje ikonę po nazwie.', 'Ukrywa dekoracyjną grafikę przed czytnikami ekranu.'],
    'Nazwa category/icon-name z katalogu ikon albo obsługiwana nazwa zgodności, np. check, edit lub search. Ikona jest domyślnie dekoracyjna; podaj aria-label lub aria-labelledby, jeśli samodzielnie przekazuje informację.',
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
      'Usunięcie osoby z fokusem w otwartym panelu przenosi fokus na dostępną osobę lub wyzwalacz; Escape nadal działa.',
      'Opcjonalny popover montuje ukryte osoby dopiero po otwarciu i pozostaje w granicach widocznego obszaru.',
      'Wyłączenie otwartego panelu zamyka go i zachowuje fokus na grupie; loading przenosi fokus na panel, z którego nadal działa Escape.',
      'Małe awatary zachowują rozmiar obrazu, a ich obszary interakcji są większe, aby umożliwić precyzyjny wybór.',
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
      'Utrzymuje fokus na natywnym przycisku, stałą nazwę akcji i ogłasza wynik przez atomowy live region.',
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
  CommandPalette: copy(
    'Globalna lub osadzona paleta do szybkiego wyszukiwania i wykonywania poleceń aplikacji.',
    [
      'Zapewnia deterministyczne fuzzy search, stabilny ranking, grupy, historię recent i dynamiczną aktualizację rejestru poleceń.',
      'Obsługuje synchroniczne i asynchroniczne akcje, blokuje podwójne wykonanie oraz prezentuje stany loading, empty i error.',
      'Udostępnia poziomy zagnieżdżone, kontrolowane open/query/activeId i adapter nawigacji przez callback execute.',
      'Realizuje wzorzec dialog + combobox + listbox z aria-activedescendant, grupami, disabled, live status i pełną obsługą klawiatury.',
      'Przywraca fokus, ignoruje globalny skrót w polach edycyjnych i może używać VirtualList dla dziesiątek tysięcy komend.',
      'Zachowuje równoważny kontrakt, wygląd i zachowanie w Vue, natywnym React i Web Components.',
    ],
    'Tablica komend z id i label; opcjonalnie keywords, group, shortcut, disabled, children, execute i metadata oraz kontrolowane open, query i activeId.',
  ),
  ScrollArea: copy(
    'Responsywny obszar przewijania oparty na natywnym overflow, z opcjonalnymi paskami PeaUI i spójnym API programowym.',
    [
      'Zachowuje natywne przewijanie kółkiem, dotykiem, klawiaturą i momentum bez przechwytywania gestów.',
      'Udostępnia pionowy, poziomy lub dwuosiowy viewport oraz tryby native i styled.',
      'Tryb native domyślnie dodaje tabindex=0 także dla tekstowej zawartości; jawny tabindex/tabIndex pozwala nadpisać tę wartość.',
      'Stylowane paski realizują wzorzec ARIA scrollbar, pełną klawiaturę, przeciąganie i poprawną pozycję logiczną RTL.',
      'Deduplikuje zdarzenia krawędzi, ogranicza aktualizacje do klatek animacji i sprząta obserwatory po odmontowaniu.',
      'Zachowuje spójną semantykę, wygląd, zdarzenia i publiczne metody w Vue, React oraz Web Components.',
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
      'Kotwiczy widoczny rekord po stabilnym kluczu. ReachEnd emituje raz dla danej liczby pozycji, niezależnie od zmian fokusu i tożsamości callbacku.',
      'Zapewnia identyczny renderowany zakres i wygląd, zdarzenia i metody przewijania w Vue, React i Web Components.',
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
      'Właściwość form wskazuje właściciela kontrolki i resetu także wtedy, gdy pole znajduje się poza formularzem.',
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
      'Wiąże etykietę z wynikiem i ogłasza aktualizacje przez status live.',
      'Domyślnie pokazuje przycisk obliczania; blokuje go podczas ładowania. Obsługuje również tryb uproszczony.',
      'Renderuje wartości tekstowe bez wykonywania przekazanego kodu HTML.',
    ],
    'Etykieta i tekst wyniku, a opcjonalnie flagi stanu oraz widoczności przycisku.',
  ),
  CardCarousel: copy(
    'Karuzela kart z nawigacją, wskaźnikami stron i opcjonalnym automatycznym przesuwaniem.',
    [
      'Porządkuje większy zestaw kart w ograniczonej przestrzeni.',
      'Dostosowuje liczbę slajdów do szerokości widoku.',
      'Dodanie, usunięcie lub przestawienie kart aktualizuje slajdy i strony; Web Components zachowują tożsamość istniejących węzłów oraz ich zdarzenia.',
      'Rotację zatrzymuje przycisk pauzy, fokus klawiatury i najechanie kursorem. Po wejściu fokusu wymaga jawnego wznowienia; respektuje ograniczenie ruchu. Etykiety zmienisz przez pauseLabel i resumeLabel.',
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
      'Traktuje etykietę jako tekst; formatowaną treść przyjmuje przez slot lub children.',
    ],
    'Etykieta oraz treść w domyślnym slocie.',
  ),
  DisclosurePanel: copy(
    'Rozwijany panel, który pokazuje lub ukrywa dodatkową treść.',
    [
      'Oszczędza miejsce przy rozbudowanych informacjach.',
      'Udostępnia kontrolowany stan otwarcia przez model open.',
    ],
    'Tytuł, treść slotu oraz stan otwarcia; panel może być wyłączony albo stale otwarty. Bez tytułu ariaLabel nazywa kontrolkę summary w Vue, React i Web Components. Dynamicznie dodany tytuł zastępuje nazwę zastępczą.',
  ),
  SectionHeading: copy(
    'Nagłówek sekcji z kontrolą poziomu wizualnego, znacznika HTML i wariantu koloru.',
    ['Buduje hierarchię treści.', 'Oddziela semantykę HTML od rozmiaru wizualnego.'],
    'Treść nagłówka w slocie oraz właściwości size, as i variant. Wariant secondary korzysta z odwracanych tokenów: stosuj go na powierzchni var(--peaui-color-grey-900), która reaguje na zmianę motywu.',
  ),
  TableList: copy(
    'Rozbudowana tabela danych z sortowaniem, wyborem wierszy, edycją i zarządzaniem kolumnami.',
    [
      'Prezentuje rekordy według deklaratywnych kolumn.',
      'Zwykłe komórki tekstowe mają zwarty DOM; mutacje rekordów i formatterów pozostają widoczne po przekazaniu nowej tablicy records.',
      'Obsługuje stany puste i ładowania oraz akcje na rekordach.',
      'Akcje rekordu otwierają wspólne menu; pojedyncza akcja z simple=true jest przyciskiem ikony. withLock udostępnia przycisk blokowania kolumny. Szczegóły rozwijanego wiersza przekazuj przez details-record w Vue/WC lub detailsRecord w React.',
      'Pusta lista domyślnie pokazuje EmptyState. Jego przycisk dodawania otwiera edytor przy editable=true i emituje zdarzenie tworzenia rekordu. Aby zachować tabelę z komunikatem w wierszu, ustaw emptyDescription=false i emptyDescriptionInline. Podczas ładowania SpinnerLoader zasłania nieaktywną tabelę.',
      'canHideColumns udostępnia menu widoczności również bez akcji rekordu, w ostatnim nagłówku danych. canCopy obsługuje także wartości 0 i false; pomija wyłącznie null, undefined i pusty tekst.',
      'Zapewnia obsługę klawiatury oraz spójne zdarzenia wyboru, edycji i dwukrotnego kliknięcia.',
      'Renderuje etykiety kolumn i kroków jako tekst, bez wykonywania HTML z danych.',
      'Kolumny type="editable" zatwierdzają zmianę po walidacji i zapisie; manage.onUpdate otrzymuje zmieniony rekord. Podpowiedzi kolumn są dostępne z klawiatury.',
      'Edycja zachowuje szkic po przestawieniu rekordu z unikatowym id; bez id korzysta z tożsamości obiektu. Submit przekazuje aktualny indeks records. Usunięcie, powielony klucz lub zmiana strony ukrywająca rekord anuluje edycję.',
    ],
    'Tablica records i definicje columns. Dla dużych zbiorów włącz paginate i ustaw rowsPerPage. Kontroluj page przez v-model:page w Vue, page/onPageChange w React albo property page i update:page w WC. Zaznacz wszystko dotyczy bieżącej strony. Przy paginacji serwerowej pozostaw paginate=false.',
  ),
  TableListFooter: copy(
    'Stopka tabeli pokazująca zakres rekordów i informacje o stronie.',
    ['Podsumowuje widoczne dane.', 'Może układać zawartość standardowo albo elastycznie.'],
    'rowsNumber to liczba wszystkich rekordów; rowsPerPage to rozmiar strony, page to bieżąca strona, a total to liczba stron (zero ukrywa paginację). Wspólne limity: 5, 10, 25 i 50.',
  ),
  TableListHeader: copy(
    'Pasek narzędzi tabeli z wyszukiwaniem, filtrowaniem, eksportem i tworzeniem rekordów.',
    [
      'Grupuje najważniejsze akcje nad tabelą.',
      'Pokazuje licznik przy filtrach i liczbę zaznaczonych rekordów na przycisku eksportu. totalRecords steruje dostępnością eksportu.',
      'Układa wyszukiwanie i filtry razem, a tworzenie i eksport w grupie akcji. Dodatkowa zawartość oraz opis znajdują się pod przyciskami.',
    ],
    'Flagi dostępnych akcji, liczniki oraz opcjonalny stan panelu filtrów przez model filtersOpen. Używaj slotów additional-content i additional-description w Vue/WC oraz propsów additionalContent i additionalDescription w React.',
  ),
  TagChip: copy(
    'Krótka etykieta statusu lub kategorii renderowana jako tekst albo przycisk.',
    ['Wyróżnia metadane i stany.', 'Udostępnia warianty kolorystyczne, rozmiary i stan aktywny.'],
    'Tekst label oraz opcjonalne właściwości variant, size, active i as.',
  ),
  TreeList: copy(
    'Interaktywna lista drzewiasta do edycji danych zagnieżdżonych.',
    ['Pokazuje relacje nadrzędny–podrzędny.', 'Pozwala aktualizować i usuwać elementy drzewa.'],
    'Obiekt drzewa kontrolowany przez model tree oraz ustawienia poziomu i dozwolonych akcji.',
  ),
  ButtonAction: copy(
    'Podstawowy przycisk akcji biblioteki PEAUI.',
    ['Uruchamia działania użytkownika.', 'Obsługuje warianty wizualne, rozmiary i stan disabled.'],
    'Treść przycisku w slocie oraz opcjonalne size, variant, type i ariaLabel. W Web Components id identyfikuje host, a natywny przycisk ma id z sufiksem -control. Zewnętrzny label musi wskazywać ten natywny identyfikator; można też użyć aria-labelledby. Host nie jest natywną kontrolką formularza.',
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
    ['Zapewnia szybkie sterowanie liczbą.', 'Synchronizuje wartość przez model value.'],
    'Nazwa pola, wartość liczbowa oraz opcjonalna dostępna etykieta i stan disabled.',
  ),
  SearchInput: copy(
    'Pole wyszukiwania z opóźnieniem wywołania i możliwością czyszczenia.',
    ['Zbiera frazę wyszukiwania.', 'Ogranicza częstotliwość aktualizacji przez debounce.'],
    'Fraza kontrolowana przez v-model:value (Vue), value/onValueChange (React) albo value/update:value (WC). Wyszukiwanie obejmuje co najmniej 3 znaki; Enter uruchamia je od razu. debounceTime domyślnie wynosi 1000 ms. Czyszczenie, zmiana opóźnienia, disabled, readonly i odmontowanie anulują oczekujące wyszukiwanie.',
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
    'Identyfikator, treść slotu oraz wariant, rozmiar i ustawienia ikony. Wariant white korzysta z odwracanych tokenów: stosuj go na powierzchni var(--peaui-color-grey-900), która reaguje na zmianę motywu.',
  ),
  ProgressIndicator: copy(
    'Okrągły wskaźnik postępu podzielony na kroki.',
    [
      'Pokazuje pozycję w procesie; domyślna wartość active wynosi 0 we wszystkich frameworkach.',
      'Pozwala dobrać rozmiar i grubość obrysu.',
    ],
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
      'Łączy tytuł i opis z regionem status/alert oraz nazywa przycisk zamknięcia tytułem powiadomienia. Cień i obramowanie są domyślnie wyłączone.',
      'Traktuje tytuł i opis jako tekst, dzięki czemu dane komunikatu nie wykonują HTML.',
    ],
    'Tytuł, opis, wariant oraz opcjonalne ustawienia rozmiaru, obramowania, cienia i zamykania.',
  ),
  NotificationCenter: copy(
    'Kontrolowane centrum powiadomień z filtrami, grupowaniem, akcjami i pobieraniem kolejnych stron.',
    [
      'Prezentuje stan przeczytania i priorytet bez mutowania danych należących do aplikacji.',
      'Obsługuje panel, treść szuflady i pełną stronę w Vue, React oraz Web Components.',
      'Udostępnia dostępne stany loading, empty i error oraz intencje retry i loadMore.',
      'Nagłówki grup są unikalne dla każdej instancji. Load more blokuje się od razu po wysłaniu żądania, aż zakończy się loadingMore, zmieni liczba pozycji lub wywołasz resetLoadRequest.',
    ],
    'Elementy powiadomień, opcjonalny licznik, filtry, grupowanie, kontrolowany wybór, stany żądań, lokalizacja etykiet i formatowanie dat.',
  ),
  FormFieldLabel: copy(
    'Dostępna etykieta pola formularza ze wskaźnikiem wymagalności i trybu odczytu.',
    [
      'Łączy tekst etykiety z kontrolką przez atrybut for.',
      'Komunikuje wymagany charakter pola.',
      'Traktuje prop text jako tekst; formatowaną treść przyjmuje przez slot lub children.',
    ],
    'Identyfikator natywnej kontrolki w for, tekst etykiety i opcjonalne flagi required oraz readonly. W Web Components jawne id należy do hosta; wewnętrzna etykieta używa sufiksu -control, aby identyfikatory pozostały unikalne.',
  ),
  FormButtonCheckbox: copy(
    'Checkbox prezentowany w formie wyraźnego przycisku wyboru.',
    ['Pozwala włączać pojedynczą opcję.', 'Synchronizuje stan przez model value.'],
    'Id, name, wartość logiczna i treść slotu; opcjonalnie rozmiar i stany formularza.',
  ),
  FormButtonGroup: copy(
    'Grupa przycisków służąca do wyboru jednej z dostępnych opcji.',
    [
      'Prezentuje niewielki zestaw opcji obok siebie.',
      'Może działać jako wybór jednokrotny albo przełącznik.',
      'Bez przekazanego modelu pierwsza opcja active ustala początkową wartość i dane formularza. Jawne puste value pozostawia wybór pusty; późniejsze odznaczenie nie przywraca automatycznie opcji początkowej.',
    ],
    'Lista options, identyfikatory pola i kontrolowany model value.',
  ),
  FormCheckbox: copy(
    'Klasyczne pole wyboru z obsługą walidacji i stanów formularza.',
    ['Zbiera odpowiedź tak/nie.', 'Synchronizuje stan przez model value.'],
    'Id, name, wartość logiczna oraz tekst etykiety w slocie.',
  ),
  FormContainer: copy(
    'Kontener formularza z nagłówkiem, stanem ładowania i zestawem akcji.',
    [
      'Porządkuje pola w kompletny formularz.',
      'Obsługuje zatwierdzenie, anulowanie i pozycję przycisków.',
      'Disabled blokuje również zatwierdzenie klawiszem Enter; sizeButton ustala rozmiar obu akcji.',
    ],
    'Etykieta formularza i jego pola w slocie; opcjonalne podpisy i widoczność akcji. Natywny reset przywraca defaultValue niekontrolowanych pól React. Dla kontrolowanego value lub v-model stan przywraca właściciel formularza; anulowany reset nie zmienia modelu.',
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
    'Id, name i model value; opcjonalnie tryb zakresu, limity, etykieta i stany pola.',
  ),
  FormField: copy(
    'Niskopoziomowa obudowa wspólna dla pól formularza.',
    [
      'Łączy etykietę, kontrolkę, podpowiedź i walidację.',
      'Zapewnia spójne stany disabled, readonly i required.',
      'Vue udostępnia bindings jako props w slocie domyślnym; przekaż je kontrolce przez v-bind. Web Components synchronizuje te same bindings z kontrolką w slocie.',
      'React przekazuje pojedynczemu elementowi children klasy, style, wartość, stany natywne i atrybuty ARIA. Jawne props kontrolki mają pierwszeństwo; className i style są łączone, a handlery i defaultValue pozostają zachowane. Własne id kontrolki staje się celem etykiety i podstawą identyfikatorów komunikatów.',
      'Dla canErase rezerwuje osobny pas akcji z celem 32 × 32 px, dzięki czemu przycisk czyszczenia nie nachodzi na tekst, ikony ani pozostałe kontrolki pola.',
    ],
    'Id i name, kontrolka przekazana w slocie oraz opcjonalne teksty, ikony i komunikaty.',
  ),
  FormFileUpload: copy(
    'Pole przesyłania pojedynczego pliku z walidacją typu i rozmiaru.',
    [
      'Pozwala wybrać albo usunąć załącznik.',
      'Domyślny model to { file: File, image: string } we wszystkich frameworkach. valueMode="file" zachowuje wcześniejszy model React oparty na File.',
      'Odrzucenie pliku pokazuje błąd i zachowuje poprzedni poprawny wybór.',
    ],
    'Plik kontrolowany przez model file, dozwolone typy, limit rozmiaru i wariant prezentacji.',
  ),
  FormFileUploadSimple: copy(
    'Uproszczony uploader jednego lub wielu plików.',
    ['Obsługuje wybór wielu załączników.', 'Waliduje typ, rozmiar i maksymalną liczbę plików.'],
    'Tablica File przez model files oraz ograniczenia allowedTypes, maxFileSize i maxFiles.',
  ),
  FormInput: copy(
    'Jednowierszowe pole tekstowe osadzone w kompletnej obudowie formularza.',
    [
      'Zbiera krótkie dane tekstowe.',
      'Przekazuje natywne atrybuty inputa. Reset przywraca defaultValue w niekontrolowanym React; dla kontrolowanego value lub v-model stan resetuje właściciel formularza.',
      'Obsługuje etykietę, ikony, czyszczenie i komunikaty walidacji.',
    ],
    'Id, name i tekst w modelu value; opcjonalnie etykieta, placeholder i stany pola.',
  ),
  FormMultiSelect: copy(
    'Wielokrotny wybór z listą opcji, wyszukiwaniem i zaznaczaniem wszystkich pozycji.',
    [
      'Zbiera wiele wartości w jednym polu.',
      'FormData zawiera osobny wpis pod name dla każdej wartości opcji. valueMode="label" pozostaje trybem migracji. Wymagane pole podlega natywnej walidacji również bez wyszukiwania.',
      'Obsługuje filtrowanie długiej listy opcji.',
      'Utrzymuje panel w granicach viewportu na wspólnej powierzchni overlayów PEAUI.',
    ],
    'Lista options i tablica wybranych wartości w modelu value oraz standardowe dane pola.',
  ),
  FormNumber: copy(
    'Pole liczbowe z kontrolą zakresu, kroku i opcjonalnym suwakiem.',
    [
      'Zbiera wartości numeryczne.',
      'Zatwierdza wpis przy utracie fokusu: pusty wpis daje undefined, krok ustala precyzję, min/max ograniczają wynik także dla zera. Strzałki zmieniają wartość o krok.',
    ],
    'Id, name i liczba w modelu value; opcjonalnie zakres, krok, etykieta i stany.',
  ),
  FormPassword: copy(
    'Pole hasła z opcją podglądu, kopiowania i miernikiem siły.',
    ['Bezpiecznie zbiera hasło.', 'Może pomóc w ocenie i obsłudze wprowadzonej wartości.'],
    'Id, name i hasło w modelu value oraz opcjonalne etykiety akcji i ustawienia miernika.',
  ),
  FormRadio: copy(
    'Pojedynczy przycisk radiowy przeznaczony do grupy opcji.',
    ['Pozwala wybrać jedną wartość z grupy.', 'Obsługuje walidację i stan disabled.'],
    'Id, wspólna nazwa grupy, optionValue i bieżąca wartość w modelu value.',
  ),
  FormSelect: copy(
    'Pole pojedynczego wyboru z listą rozwijaną i opcjonalnym wyszukiwaniem.',
    [
      'Pozwala wybrać jedną pozycję.',
      'Obsługuje listy wyszukiwalne, własne wpisy i bezpieczne pozycjonowanie przy krawędzi ekranu.',
      'Współdzieli promień, obramowanie, cień, odstęp i responsywne ograniczenia z pozostałymi pickerami.',
    ],
    'Lista options, id, name i wybrana wartość w modelu value.',
  ),
  FormTextarea: copy(
    'Wielowierszowe pole tekstowe z etykietą i licznikiem długości.',
    ['Zbiera dłuższą wypowiedź.', 'Obsługuje limit znaków i komunikaty walidacji.'],
    'Id, name i tekst w modelu value; opcjonalnie liczba wierszy (domyślnie 5), limit i stany pola.',
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
    'Id, name i model value; opcjonalnie tryb zakresu, limity lat i stany pola.',
  ),
  FormTimePicker: copy(
    'Dostępne pole wyboru czasu z ręcznym wpisywaniem, segmentami oraz panelem opcji.',
    [
      'Synchronizuje tekst i wybór z neutralnym modelem HH:mm[:ss] niezależnym od locale.',
      'Obsługuje format 12/24h, sekundy, jawne kroki, ograniczenia min/max i wartości spoza siatki.',
      'Wariant segmentowy uczestniczy w natywnej walidacji required, pomija disabled podczas wysyłania i respektuje readonly.',
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
      'Wariant split-input wysyła datę i czas pod wspólnym name: FormData.getAll(name) zwraca [date, time]. Required obejmuje oba pola. React korzysta z tego samego kontraktu zamiast dawnych sufiksów -date i -time.',
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
      'Właściwość form wiąże komórki, walidację oraz wysyłaną wartość z podanym formularzem, również poza jego drzewem DOM.',
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
      'Właściwość form wskazuje formularz odpowiedzialny za wartość i walidację. Indeks wybranych kluczy eliminuje powtarzane porównywanie każdej sugestii ze wszystkimi tagami.',
      'Zawija długie wartości bez overflow i zachowuje identyczny wygląd oraz działanie w Vue, React i Web Components.',
    ],
    'Id, name i kontrolowane value/inputValue; opcjonalnie sugestie, provider, separatory, normalizacja, walidacja, klucze, serializacja, limit i stany formularza.',
  ),
  CardPanel: copy(
    'Uniwersalny panel-karta do grupowania powiązanej treści.',
    [
      'Buduje wizualne sekcje interfejsu; domyślnie używa div, efektu hover i wyłączonego cienia.',
      'Obsługuje dynamiczny nagłówek oraz link as="a" z natywnymi href, target, rel i download we wszystkich frameworkach.',
      'W Web Components zmiana slot na header albo usunięcie atrybutu slot przenosi ten sam węzeł między nagłówkiem a treścią, zachowując zdarzenia.',
    ],
    'Treść w domyślnym slocie oraz opcjonalne ustawienia wyglądu i znacznika HTML.',
  ),
  FullscreenContainer: copy(
    'Kontener pozwalający przełączyć zawartość do trybu pełnoekranowego.',
    [
      'Zwiększa obszar pracy dla złożonego widoku.',
      'Powiększa zawartość w obrębie strony we wszystkich frameworkach. Tab i Shift+Tab pozostają wewnątrz pełnego ekranu. Escape zamyka widok i przywraca fokus; kilka instancji współdzieli blokadę przewijania.',
    ],
    'Treść w slocie oraz dostępna etykieta i własne podpisy przycisków.',
  ),
  GridItem: copy(
    'Element siatki kontrolujący szerokość i opcjonalne zagnieżdżenie kolejnej siatki.',
    [
      'Rozmieszcza pojedynczy fragment treści w gridzie.',
      'Domyślnie używa wewnętrznej siatki z 2 kolumnami i gap=6. columns=0 dobiera kolumny do dzieci; colspan określa zajęte kolumny.',
    ],
    'Treść slotu oraz colspan, columns, gap i flaga grid.',
  ),
  GridSection: copy(
    'Responsywna sekcja oparta na CSS Grid.',
    [
      'Domyślnie układa elementy w 4 kolumnach z gap=6 we wszystkich frameworkach.',
      'Obsługuje dynamiczne dodatkowe kontrolki i spójne odstępy pomiędzy dziećmi.',
    ],
    'Elementy w domyślnym slocie oraz liczba kolumn i odstęp.',
  ),
  PageLayout: copy(
    'Główny szkielet strony ze slotami na nagłówek, treść i elementy pomocnicze.',
    [
      'Ujednolica układ widoków z semantycznym header, main i footer; ariaLabel nazywa nagłówek.',
      'Może utrzymywać nagłówek podczas przewijania.',
    ],
    'Sekcje strony przekazane w slotach oraz opcjonalna dostępna etykieta i sticky header.',
  ),
  SectionDivider: copy(
    'Separator treści renderowany poziomo albo pionowo.',
    ['Rozdziela logiczne grupy elementów.', 'Oferuje kilka wariantów grubości lub rozmiaru.'],
    'Kierunek i rozmiar separatora.',
  ),
  Breadcrumbs: copy(
    'Okruszki nawigacyjne pokazujące położenie bieżącej strony w hierarchii.',
    [
      'Pomagają zrozumieć strukturę serwisu.',
      'Pozwalają szybko przejść do poziomów nadrzędnych.',
      'Renderują etykiety jako tekst, bez interpretowania HTML z danych routingu.',
    ],
    'Tablica items z etykietami i ścieżkami oraz opcjonalny separator. Na wąskim ekranie przycisk otwiera listę poziomów nadrzędnych; wybór przekazuje oryginalny element items. Web Component zachowuje natywną semantykę nawigacji.',
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
    [
      'Promuje ważne miejsce lub funkcję.',
      'Łączy objaśnienie z dużym obszarem aktywacji.',
      'Renderuje opis jako tekst, bez interpretowania HTML z danych.',
    ],
    'Tytuł i opis, a opcjonalnie ścieżka, rozmiar, wariant i ariaLabel. Domyślny rozmiar tytułu to s. Link przyjmuje natywne target, rel i download także w React.',
  ),
  NavigationDisclosureCard: copy(
    'Karta nawigacyjna z rozwijaną treścią.',
    ['Łączy nawigację z dodatkowym objaśnieniem.', 'Może być domyślnie otwarta.'],
    'Id, tytuł i opis oraz opcjonalne path, open i ariaLabel.',
  ),
  NavigationIconCard: copy(
    'Kompaktowa karta-link oparta na ikonie i krótkim tekście.',
    ['Tworzy wizualny skrót do funkcji.', 'Zapewnia duży, czytelny obszar kliknięcia.'],
    'Nazwa ikony, tekst, ścieżka i opcjonalna dostępna etykieta oraz natywne target, rel i download. Pusta ścieżka oznacza niedostępny link: zachowuje nazwę i stan aria-disabled, nie ma href i pozostaje poza kolejnością Tab.',
  ),
  NavigationLink: copy(
    'Spójny link nawigacyjny PEAUI z wariantami rozmiaru i koloru.',
    [
      'Przenosi użytkownika pod wskazaną ścieżkę.',
      'Stylizuje tekst lub treść przekazaną w slocie.',
    ],
    'Ścieżka, treść slotu i opcjonalne ariaLabel, size oraz variant. Domyślny size to s we wszystkich trzech implementacjach. Natywne target, rel i download trafiają na link również w React.',
  ),
  NavigationStepper: copy(
    'Pozioma nawigacja po krokach procesu ze statusami i obsługą klawiatury.',
    [
      'Pokazuje postęp wieloetapowego procesu.',
      'Pozwala wracać do ukończonych lub aktywnych kroków.',
    ],
    'Tablica options opisująca numery, etykiety i statusy kroków. Strzałki lewo/prawo oraz Home/End przenoszą fokus między dostępnymi krokami. Przyciski przewijania respektują logiczny kierunek RTL i reagują również na zmianę szerokości samego kontenera.',
  ),
  NavigationTabs: copy(
    'Pasek zakładek do przełączania pomiędzy powiązanymi widokami.',
    ['Organizuje treść w równoległe sekcje.', 'Emituje wybór aktywnej zakładki.'],
    'Tablica tabs i dostępna etykieta całej nawigacji. Strzałki lewo/prawo oraz Home/End omijają wyłączone pozycje; Enter lub Spacja wybiera pozycję. Zdarzenie wyboru przekazuje oryginalny obiekt zakładki z key w Vue, React i Web Components. Treść przed i za etykietą przekazuje się w Vue/WC przez sloty navigation-tabs-{key}-before/after, a w React przez renderTabBefore(tab, index) i renderTabAfter(tab, index).',
  ),
  PaginationControl: copy(
    'Nawigacja stronicowania z wyborem poprzedniej, następnej i konkretnej strony.',
    ['Dzieli długie listy na strony.', 'Synchronizuje aktywną stronę przez model page.'],
    'Łączna liczba stron, dostępna etykieta i bieżąca strona.',
  ),
  DrawerPanel: copy(
    'Panel boczny wyświetlany ponad aktualną zawartością.',
    [
      'Pokazuje dodatkowy formularz lub szczegóły bez zmiany strony.',
      'Kontroluje widoczność przez model open.',
    ],
    'Stan otwarcia, ariaLabel oraz treść przekazana w slotach.',
  ),
  GuidedTour: copy(
    'Przewodnik krok po kroku wskazujący elementy interfejsu i objaśniający kolejne działania.',
    [
      'Zarządza przejściami między krokami, pozycją panelu i przywracaniem fokusu.',
      'Escape najpierw zamyka zagnieżdżony popover lub dialog. Tab pozostaje w przewodniku; zagnieżdżony natywny dialog modalny zarządza własnym fokusem.',
      'Respektuje preventDefault w kontrolkach potomnych i lokalizowane etykiety akcji.',
    ],
    'Tablica steps ze stabilnym id, celem i treścią; kontrolowane open i step oraz opcjonalne ustawienia pozycjonowania, maski, nawigacji i obsługi brakującego celu.',
  ),
  InfoTooltip: copy(
    'Dymek z krótką informacją kontekstową.',
    ['Objaśnia ikonę, etykietę albo pojęcie.', 'Obsługuje różne położenia i warianty.'],
    'Treść wyzwalacza i dymka w slotach oraz placement, variant i disabled. Hover i fokus pokazują opis powiązany przez aria-describedby; Escape zamyka go bez przenoszenia fokusu. Dymek pozostaje dostępny pod kursorem. Nie umieszczaj w nim interaktywnych kontrolek.',
  ),
  ModalDialog: copy(
    'Modalne okno dialogowe oparte na natywnym elemencie dialog.',
    ['Skupia uwagę na krótkim zadaniu lub decyzji.', 'Zarządza otwarciem przez model open.'],
    'Stan otwarcia, dostępna etykieta oraz nagłówek i treść w slotach. Zmiana atrybutu slot w Web Components przenosi istniejący węzeł między nagłówkiem a treścią, zachowując jego zdarzenia.',
  ),
  PopoverButton: copy(
    'Przycisk otwierający zakotwiczone menu albo niewielki panel.',
    [
      'Łączy wyzwalacz i popover w jedną kontrolkę.',
      'Obsługuje położenie oraz dopasowanie szerokości.',
    ],
    'Treść przycisku i popovera w slotach oraz ustawienia wyglądu, placement i popupType. Widoczny tekst nazywa przycisk także w Web Components. React wiąże dostępną nazwę panelu z wyzwalaczem. W panelu dialog Tab przechodzi pomiędzy kontrolkami bez zamykania. Hydratacja zachowuje zamknięty stan i natywne otwieranie panelu.',
  ),
  PopoverOverlayer: copy(
    'Niskopoziomowa warstwa popover pozycjonowana względem własnego wyzwalacza.',
    [
      'Buduje menu, podpowiedzi i małe panele kontekstowe.',
      'Kontroluje pozycję, szerokość i odwrócenie panelu przy pionowej krawędzi viewportu.',
      'Zapewnia wspólną powierzchnię, odstęp i wymuszone kolory dla wszystkich opartych na nim pickerów.',
    ],
    'Wyzwalacz i zawartość w slotach oraz placement, popupType i opcjonalne klasy. Natywny przycisk w slocie przejmuje aria-controls i aria-expanded; otaczający element nie tworzy drugiej kontrolki. Escape przywraca fokus do wyzwalacza, a Tab w dialogu przechodzi pomiędzy jego kontrolkami. Atrybut popover pozostaje zgodny pomiędzy SSR a hydratacją.',
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
