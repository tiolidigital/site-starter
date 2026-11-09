**Zleceniodawca:** baza · App_Factory/BAZA

## Po co

Piotrek (2026-11-09) chce, żeby nowa strona wyglądała dobrze od pierwszej chwili, bez ustawiania, a zmiana odstępu, czcionki albo koloru w jednym miejscu działała na całej stronie, także na podstronach, które dopiero powstaną. Jego słowa o wzorze, którego używał na WordPressie (Automatic CSS): „najważniejsze, że nie muszę nic ustawiać, bo out of the box jest zwykle ok”.

Dziś szablon ma 2 kolory i krój, zero skali odstępów i czcionek. W Winnicy-Grono jest 138 ręcznych klas odstępów i 37 klas czcionek w 22 plikach.

Zapis rozmowy: `App_Factory/BAZA/dziennik/rozmowy/2026-11-09-framework-css.md`.

## Co zbudować w site-starter

### 1. Plik skali (czysty CSS, bez SCSS i bez kroku budowania)

Osobny plik, np. `app/skala.css`, importowany z `app/globals.css`. Na górze jeden krótki blok WEJŚĆ, kilka liczb na stronę. Wszystko inne wyliczone z nich przez `calc()` i `clamp()`, tak żeby zmiana jednej liczby działała na całą stronę bez przebudowy.

Wejścia i wartości domyślne (punkt startu, własne liczby szablonu):

| Wejście | Komputer | Telefon |
|---|---|---|
| Odstęp bazowy (stopień m) | 30 px | 24 px |
| Mnożnik odstępów | 1,5 | 1,333 |
| Odstęp sekcji m = baza razy | 3 (90 px) | 2 (48 px) |
| Margines boczny | 80 px | 16 px |
| Tekst podstawowy | 18 px | 17 px |
| Mnożnik tekstu i nagłówków | 1,333 | 1,2 |

- Stopnie odstępów: xs, s, m, l, xl, xxl. Każdy kolejny to poprzedni razy mnożnik, w dół przez dzielenie.
- Sekcje: stopnie s, m, l jako osobna wielkość (mnożnik sekcji razy stopnie odstępów).
- Płynnie między telefonem (320 px) a komputerem (1440 px), z bezpieczną górą i dołem. Wejścia trzymaj bez jednostek, żeby interpolacja była możliwa w czystym CSS (rem + różnica razy `(100vw - 20rem)` przez zakres).
- Wysokość wiersza wzorem: tekst `calc(6px + 2ex)`, nagłówki `calc(4px + 2ex)`.
- `text-wrap: balance` na nagłówkach, `pretty` na tekście.
- Tekst nigdy poniżej 17 px na telefonie w treści, nic poniżej 12 px w ogóle (reguła Piotrka). Dlatego telefon ma 17, a nie 16.

Kolory: jeden kolor marki w OKLCH jako wejście, z niego wyliczone jaśniejsze i ciemniejsze odcienie i wariant po najechaniu (`color-mix` albo składnia względna OKLCH). Do tego nazwy według roli: tło, tekst, tekst stonowany, obramowanie.

Klasy: podepnij skalę pod Tailwind 4 przez `@theme inline`, żeby działały np. `p-m`, `gap-l`, `py-sekcja-m`, `text-l`. Nazewnictwo własne i krótkie.

### 2. Rytm tekstu

Jedna klasa na treść (np. `.tresc`): akapit 1em odstępu, przed nagłówkiem 1.2em, punkt listy .5em, wszystko względem wielkości czcionki. Zwykły wklejony tekst na nowej podstronie ma od razu wyglądać porządnie.

### 3. Domyślne zachowania

Widoczne zaznaczenie przy obsłudze klawiaturą (`:focus-visible`), `prefers-reduced-motion`. Jasny motyw na sztywno: usuń z `globals.css` blok `prefers-color-scheme: dark`, bo strony Piotrka są zawsze jasne, także przy ciemnym systemie.

### 4. Strażnik skali (zatwierdzony `/tak`)

Skrypt w szablonie, uruchamiany `npm run skala` i dołączony do `npm run lint`. Kopiuje się razem z szablonem do każdej nowej strony. Wyłapuje w `.tsx`, `.astro` i `.css`/`.module.css` poza plikiem skali:
- wartości w nawiasach: `p-[37px]`, `text-[22px]`, `bg-[#abc]`,
- domyślne klasy Tailwinda z liczbą lub rozmiarem: `py-16`, `gap-4`, `text-2xl`,
- `padding`, `margin`, `gap`, `font-size` i kolory wpisane liczbą w plikach stylów oraz `style={{ }}`.

Komunikat mówi: plik, linia, co znalazł i którego stopnia użyć. Wyjątek świadomy: komentarz `skala-ok: <powód>` w tej samej linii. Wyjście z kodem 1, gdy są naruszenia.

Test dowodzi działania w obie strony: podłożone naruszenie daje czerwono, czysty szablon daje zielono, wyjątek przechodzi. Uruchamianie przez `npm test` albo `scripts/regression-*`, bo karta w tle ma tylko takie uprawnienia.

### 5. Instrukcja w szablonie

Krótko w `README.md` i `CLAUDE.md`: gdzie zmienić liczby, jak użyć stopni, jak ominąć strażnika. Obowiązkowo zdanie: **przy starcie strony ustaw własne wartości wejściowe** (baza, mnożniki, kolor marki), bo jeden wzór to jedna strona w portfelu i strony nie mogą wyglądać jak siostry.

## Granice

- Wzorzec podpatrzony w Automatic CSS 4.0.2 (licencja GPL), ale **kod piszesz od zera**. Nie kopiuj nazw, plików ani fragmentów wtyczki. Liczby wyżej to punkt startu szablonu.
- Żadnych zmian w istniejących stronach klientów. Ten handoff dotyczy tylko site-starter.
- Bez panelu i suwaków. Bez nowych zależności.
- Praca na gałęzi w osobnym drzewie, bez pushu i bez wdrożeń. Scalenie po słowie Piotrka.

## Zauważone przy okazji, poza zakresem

Szablon ładuje kroje Geist przez `next/font/google`, a reguła Piotrka (30.10) mówi: polskie litery z własnego pliku woff2 na grubość, bo inaczej ą i ę są krzywe w Safari. Nie zmieniaj tego w tym zleceniu, zapisz wierszem w `TABLICA.md` szablonu.

## Dowód ukończenia

1. `npm run build`, `npm run lint`, testy strażnika: zielono, wyniki w meldunku.
2. Strona próbna w szablonie (np. `app/skala-proba/page.tsx`, do usunięcia przed scaleniem albo oznaczona) z nagłówkami, tekstem, listą i sekcjami na stopniach.
3. Dowód działania skali: zmiana samej liczby bazowej zmienia odstępy na tej stronie (zmierzone).
4. `MELDUNEK-szkielet-skali.md` w drzewie: co powstało, wyniki, gdzie zmienić liczby, co zostało.

## Co dalej (nie w tym zleceniu)

Pierwsza strona na szkielecie: nowy Magwer (`App_Factory/magwer-strona`), gdy po szarych szkicach przyjdzie pora na kolory i kroje. Prowadzi karta Bazy od Magweru, osobne zlecenie po scaleniu.

## Uwagi drugiego oka (Codex, 2026-11-09), obowiązują

- `calc()`: mnożenie najwyżej przez jeden składnik z jednostką, dzielenie tylko przez liczby bez jednostek. Skala działa na żywo przez zmienne, ale zmiana w pliku wymaga zbudowania strony; w instrukcji pisz o tym uczciwie.
- Dolne ograniczenie stopni tekstu: przy 17 px i mnożniku 1,2 dwa stopnie w dół to ok. 11,8 px, a nic nie może być poniżej 12 px. Stopnie mają mieć twardy dół.
- Ciemny motyw: oprócz bloku w `globals.css` usuń też klasy `dark:` z `app/page.tsx` i innych plików.
- Strażnik: ogranicz go do klas i deklaracji objętych skalą, z jawną listą wyjątków (np. `gap-0`, `p-0`), nie łap zwykłego tekstu w kodzie. Najpierw dostosuj `app/page.tsx`, `button.tsx`, `card.tsx`, żeby „czysty szablon” rzeczywiście przechodził.
- Kolory: sprawdź kontrast ról tekst na tle dla koloru marki (w teście liczbowo, dla koloru domyślnego i dwóch skrajnych).

## Uprawnienia karty w tle

Bez nowych zależności, więc testy przez `"test": "node --test scripts/"` w `package.json` i `npm test`. Przeglądarki i serwera nie uruchamiasz: pkt 3 dowodu (style obliczone po zmianie jednej liczby przy 320 i 1440 px, jasny wygląd przy ciemnym systemie) zmierzy Baza po Twoim meldunku, Ty zostaw gotową stronę próbną.
