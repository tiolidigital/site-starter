# HANDOFF 2026-11-11: Skala, część 2 – zaokrąglenia, cienie, przyciski, pola formularzy

**Zleceniodawca:** baza (karta baza-f0) · App_Factory/BAZA
**Gałąź:** `feat/skala-ksztalty` w drzewie `../site-starter-ksztalty`. Bez pushu, bez scalania: to robi Baza po słowie Piotrka.

## Po co

Framework stron nazywa się od dziś **Skala** (nazwa Piotrka, ta sama co plik `app/skala.css`). Zasada wzięta z Automatic CSS
(prototyp, wtyczka do WordPressa; zasady w `BAZA/dziennik/rozmowy/2026-11-09-framework-css.md`): kilka liczb na górze
wylicza całą resztę, a w komponentach nie ma ani jednej wartości wpisanej z ręki. Dobre wartości domyślne są ważniejsze niż suwaki.

Część 1 (c715b84) ma odstępy, tekst, kolory według roli i strażnika. Brakuje kształtów. Magwer ma przez to `--zaokr: 2px`
wpisane na stronie, a Manus (wersja PL) chce przejąć Skalę i potrzebuje tych samych tokenów. Ta część je dodaje,
żeby obie strony wzięły je z szablonu i nie wymyślały własnych nazw.

## Co zrobić

1. **Wejścia w bloku WEJŚCIA** `app/skala.css` (krótko, z komentarzem po polsku jak reszta):
   - zaokrąglenie bazowe (px) i z niego stopnie `s m l` plus `pelne` (pigułka). Domyślnie skromne (np. 4 px dla m).
     Żadnych łuków w tle ani ramek o kształcie łuku (w Polsce kojarzą się z nagrobkami);
   - grubość linii (obramowanie, kreska) jako jedno wejście;
   - cień: jedno wejście „siła cienia” (0 = bez cieni) i z niego stopnie `s m l`, kolor wyliczony z koloru tekstu,
     delikatny, bo strona jest zawsze jasna;
   - przycisk: wysokość (min. 44 px na telefonie, dotyk), wcięcie poziome ze stopni odstępów, grubość kroju,
     zaokrąglenie ze stopni powyżej, odstępy liter;
   - pole formularza: wysokość, wcięcie, obramowanie, zaokrąglenie, kolor obramowania przy fokusie z koloru marki.
2. **Klasy** w `@theme inline` w tym samym duchu co odstępy: `rounded-s/m/l/pelne`, `shadow-s/m/l`, `border-linia`.
   Domyślne Tailwinda (`rounded-lg`, `rounded-[…]`, `shadow-md` itd.) wyłączone, jak wyłączone są `text-2xl`.
3. **Gotowe składniki CSS** (bez Reacta, żeby działały też przy CSS modules, np. Manus): `.przycisk` (główny: marka),
   `.przycisk-drugi` (obrys), `.przycisk-jasny` (na ciemnym tle lub zdjęciu), `.pole` (input, textarea, select)
   ze stanami hover, focus-visible (widoczny obrys), disabled. Wszystko na zmiennych Skali, kontrast zgodny z testem kontrastu.
4. **Strażnik** (`scripts/skala.mjs`): łapie też `rounded-lg`, `rounded-[8px]`, `shadow-md`, `shadow-[…]`,
   `border-radius: 8px` i `box-shadow:` z liczbami w CSS i w `style={{}}` (także w `*.module.css`). Podpowiada stopień.
   Wyjątek dalej przez `skala-ok: <powód>`.
5. **Testy** (`scripts/skala.test.mjs`): strażnik w obie strony dla nowych reguł, wartości stopni przy 320 i 1440 px,
   kontrast przycisku głównego i tekstu na marce, zmiana jednego wejścia (np. zaokrąglenie bazowe) zmienia wszystkie stopnie.
6. **README**, sekcja „Skala strony”: nagłówek „Skala (framework stron)”, jednym zdaniem skąd zasada (Automatic CSS),
   nowe wejścia i klasy w tym samym stylu co dotychczasowe punkty, przykład przycisku i pola.
7. **Plik z listą paczek:** `npm ci` w czystej kopii odmawia (`package-lock.json` nie zgadza się z `package.json`:
   `@emnapi/runtime`, `@emnapi/core`, `@emnapi/wasi-threads`). Jeśli da się naprawić bez internetu, napraw; jeśli nie,
   tylko opisz w meldunku (w tej kopii `node_modules` to dowiązanie do głównej kopii szablonu).

## Czego nie robić

Nie zmieniaj dotychczasowych wartości odstępów, tekstu i kolorów (Magwer i inne strony już na nich stoją).
Nie dotykaj innych repo. Bez kolorowych pasków akcentu na kartach.

## Dowód

`npm test`, `npm run lint` (ze strażnikiem) i `npm run build` zielono. Na stronie próbnej (np. `app/skala-proba/`,
do usunięcia przed scaleniem) przyciski i pola we wszystkich wariantach i stanach. Zrzuty przy 320 i 1440 px
i ich obejrzenie, nie tylko liczby (lekcja z części 1: liczby się zgadzały, a nagłówki były płaskie).
Meldunek: `MELDUNEK-skala-ksztalty.md` w katalogu głównym tego drzewa, z listą nowych wejść i klas i ścieżkami zrzutów.
