# Meldunek: szkielet skali stron (site-starter)

Data: 2026-11-09 · gałąź `feat/szkielet-skali` w osobnym drzewie `site-starter-szkielet` · bez pushu, bez wdrożeń.
Zleceniodawca: Baza (`HANDOFF-2026-11-09-szkielet-skali-stron.md`).

## Co powstało, po ludzku

Nowa strona z szablonu wygląda porządnie od pierwszej chwili, a odstępy, wielkości tekstu i kolory
zmienia się w jednym miejscu: na górze pliku `app/skala.css`. Kilka liczb (baza odstępów, skoki,
tekst podstawowy, kolor marki, kroje) i cała reszta wylicza się sama, płynnie od telefonu do komputera,
także na podstronach, które dopiero powstaną.

1. **Plik skali** `app/skala.css` (czysty CSS, bez nowych zależności). Wejścia i domyślne liczby zgodnie ze
   zleceniem: odstęp bazowy 30/24 px, skok 1,5/1,333, sekcje ×3/×2 (sekcja średnia 90/48 px),
   margines boczny 80/16 px, tekst 18/17 px, skok tekstu 1,333/1,2. Stopnie `xs s m l xl xxl`,
   sekcje `sekcja-s/m/l`, wysokość wiersza wzorem (`6px + 2ex`, nagłówki `4px + 2ex`),
   wyważone łamanie nagłówków i tekstu. Tekst ma twardy dół 12 px (bez niego najmniejszy stopień
   miałby 11,8 px na telefonie i 10,1 px na komputerze).
2. **Kolory** z jednego koloru marki w OKLCH: marka, po najechaniu, jasny, blady, ciemny, marka jako tekst
   (linki) i tekst na marce (sam wybiera biały albo czarny). Do tego role: tło, tło inne, tekst,
   tekst stonowany, obramowanie.
3. **Klasy Tailwinda** z polskimi, krótkimi nazwami: `p-m`, `gap-l`, `py-sekcja-m`, `px-margines`,
   `text-l`, `bg-marka`, `text-stonowany`, `max-w-miara`. Domyślne rozmiary tekstu Tailwinda
   (`text-sm`, `text-2xl`) są wyłączone, żeby nie kusiły.
4. **Rytm tekstu**: klasa `tresc` na rodzicu i zwykły wklejony tekst ma odstępy (akapit 1em,
   przed nagłówkiem 1,2em, punkt listy 0,5em), punktory, podkreślone linki i wygodną szerokość wiersza.
   Dodałem od siebie jedno: tekst tuż po nagłówku ma 0,5em, żeby nagłówek trzymał się swojej treści.
5. **Domyślne zachowania**: widoczna ramka przy obsłudze klawiaturą, wyciszenie animacji dla osób,
   które tak ustawiły system, strona zawsze jasna (usunięty blok ciemnego motywu i wszystkie klasy `dark:`,
   do tego `color-scheme: light`, więc pola formularzy też zostają jasne).
6. **Strażnik skali**: `npm run skala`, dołączony do `npm run lint`, kopiuje się z szablonem.
   Łapie `py-16`, `gap-4`, `p-[37px]`, `text-2xl`, `text-[22px]`, `bg-zinc-50`, `bg-[#abc]`, `dark:`,
   liczby w `padding`/`margin`/`gap`/`font-size` i kolory liczbą w CSS, `@apply` i `style={{ }}`.
   Czyta tylko klasy, nie zwykły tekst na stronie. Mówi plik, linię, co znalazł i którego stopnia użyć.
   Wyjątek: komentarz `skala-ok: <powód>` w tej samej linii (pusty powód nie przechodzi).
   Przepuszcza świadomie `p-0`, `m-0`, `gap-0`, `mx-auto`, szerokości i wysokości spoza skali (np. `w-[158px]`).
7. **Instrukcja**: sekcja „Skala strony” w `README.md` i `AGENTS.md` (wczytywany przez `CLAUDE.md`), z obowiązkowym
   zdaniem: przy starcie strony ustaw własne wartości wejściowe, bo strony nie mogą wyglądać jak siostry.
   Uczciwie napisane, że zmiana liczby w pliku wchodzi po przebudowie, a na żywo można ją podejrzeć w DevTools.
8. **Strona próbna** `/skala-proba` (katalog `app/skala-proba/`, oznaczona w kodzie jako do usunięcia, wyłączona
   z wyszukiwarek): nagłówki, tekst, dwie listy, cytat, trzy sekcje na stopniach, próbki odstępów, tekstu i kolorów.
   Elementy do mierzenia mają atrybut `data-pomiar`.
9. Komponenty `button.tsx`, `card.tsx` i strona startowa przepięte na stopnie i kolory skali.

Uwagi drugiego oka (Codex) zrobione wszystkie: `calc()` mnoży najwyżej przez jeden składnik z jednostką i dzieli
tylko przez liczby, twardy dół tekstu, usunięte klasy `dark:` także z `page.tsx`, strażnik ograniczony do klas
i deklaracji ze skali z jawną listą wyjątków, kontrast sprawdzany liczbowo.

## Wyniki (zmierzone u mnie)

- `npm test`: **20 z 20 zielonych**. Sprawdzają:
  - strażnika w obie strony: podłożone naruszenia dają czerwono (także kod wyjścia 1 z prawdziwego polecenia),
    czysty szablon daje zielono, wyjątek z powodem przechodzi, bez powodu nie;
  - liczby skali wyliczone wprost z `app/skala.css` przy 320 i 1440 px (i poza zakresem: 280 i 2560 px się nie rozjeżdżają);
  - zmianę samej bazy: `--baza-odstep-pc` z 30 na 40 daje odstęp średni 40 px, sekcję średnią 120 px,
    a tekst i margines zostają bez zmian;
  - tekst nigdy poniżej 12 px, treść na telefonie nigdy poniżej 17 px;
  - kontrast dla marki domyślnej i trzech skrajnych (bardzo jasna żółta, bardzo ciemny fiolet, nasycona czerwień):
    tekst na tle co najmniej 7:1, tekst stonowany i linki co najmniej 4,5:1, tekst na przycisku marki co najmniej 4,5:1;
  - tekst na kolorze marki przy 1368 próbkach marek (każda jasność, sześć odcieni, trzy nasycenia): wszędzie co najmniej 4,5:1.
- `npm run lint`: zielono, strażnik: „czysto (przejrzane pliki: 7)”.
- `npm run build`: zielono, trzy strony statyczne (`/`, `/skala-proba`, 404). W gotowym CSS są klasy skali,
  wzory przeszły bez zmian, nie ma `text-sm` ani śladu ciemnego motywu.

## Co znalazłem i naprawiłem po drodze

- **Tekst na przycisku w kolorze marki**: pierwszy, prosty wzór (po jasności koloru) dawał za słaby kontrast
  dla marek o średniej jasności. Teraz przeglądarka liczy prawdziwą jasność koloru i wybiera biały albo czarny.
  Stare przeglądarki (sprzed ok. 2024) zostają przy prostym wzorze; tam w wąskim pasie średnich jasności kontrast
  spada do ok. 4:1 zamiast 4,5:1. Test pilnuje, żeby to był tylko ten pas.
- **Jasny odcień marki** przy bardzo ciemnej marce był za ciemny pod czarny tekst (2,9:1). Teraz ma stały jasny zakres.
- **Śmieci w CSS**: Tailwind wciągał przykładowe złe klasy z pliku testów. Wyłączyłem katalog `scripts` ze skanowania.
- **Język strony**: szablon miał `lang="en"`, przestawiłem na `lang="pl"` (dzielenie wyrazów, czytniki ekranu).

## Co zostaje dla Bazy (pomiar w przeglądarce, ja nie uruchamiam serwera)

Strona próbna jest gotowa: `npm run dev`, potem `http://localhost:3000/skala-proba`.

1. Szerokość 320 i 1440 px, odczyt `getComputedStyle` z elementów:
   - `[data-pomiar="sekcja-m"]` górny odstęp: **48 px** przy 320, **90 px** przy 1440;
   - `[data-pomiar="odstep-m"]` wysokość: **24 px** i **30 px**;
   - `[data-pomiar="tekst-m"]` wielkość tekstu: **17 px** i **18 px**; `[data-pomiar="tekst-xs"]`: **12 px** w obu.
2. Zmiana samej bazy, bez przebudowy: w konsoli
   `document.documentElement.style.setProperty('--baza-odstep-pc', '40')`, przy 1440 px:
   sekcja średnia **120 px**, odstęp średni **40 px**.
3. Ciemny motyw systemu (emulacja `prefers-color-scheme: dark`): tło dalej prawie białe, tekst ciemny.

## Co zostało poza zleceniem

- Kroje Geist bez polskich liter we własnym pliku (reguła z 30.10): wpisane do `TABLICA.md`, nie ruszałem.
  Wejście `--kroj-tekst` w pliku skali jest gotowe na podmianę.
- Tytuł i opis strony w `app/layout.tsx` wciąż z Create Next App: wpisane do `TABLICA.md`.
- Strona próbna `/skala-proba` do usunięcia przed scaleniem albo przy starcie nowej strony.
- Scalenie gałęzi do `main` i wypchnięcie: czeka na słowo Piotrka.
- Żadna odmowa uprawnień nie zablokowała zlecenia. Dwie drobne odmowy (podgląd zawartości katalogu przez pętlę w powłoce)
  obszedłem wyszukiwarką plików, bez zmiany sensu.

**Nic od Ciebie nie potrzebuję.** Scalenie do głównej gałęzi zrobię po Twoim słowie, a pomiar w przeglądarce robi Baza.

A gdybyśmy poszli dalej: dołożę do szablonu automatyczną kontrolę w GitHubie, która przy każdym wypchnięciu odpala testy i strażnika skali.
Każda nowa strona dostanie ją w prezencie, więc ręcznie wpisany odstęp nie przejdzie niezauważony, nawet gdy nikt nie pamięta o `npm run lint`.
Koszt to jeden mały plik i kilka minut, bez Twojej ręki; `/tak` dopisze go na tej gałęzi przed scaleniem.
