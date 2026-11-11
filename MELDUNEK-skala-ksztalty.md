# Meldunek: Skala, część 2 (zaokrąglenia, cienie, przyciski, pola)

Data: 2026-11-11 · gałąź `feat/skala-ksztalty` w drzewie `site-starter-ksztalty` · bez pushu, bez scalania, bez wdrożeń.
Zleceniodawca: Baza (`HANDOFF-2026-11-11-skala-ksztalty-przyciski-pola.md`).

## Co powstało, po ludzku

Skala umie teraz kształty. Kilka nowych liczb na górze `app/skala.css` ustala zaokrąglenia, grubość linii,
cienie, przyciski i pola formularzy na całej stronie. Magwer może wyrzucić swoje `--zaokr: 2px`, a Manus
bierze te same nazwy z szablonu, zamiast wymyślać własne. Dotychczasowe liczby odstępów, tekstu i kolorów
są nietknięte (testy z części 1 przechodzą bez zmian).

### Nowe wejścia (blok WEJŚCIA)

| Wejście | Domyślnie | Co robi |
|---|---|---|
| `--baza-zaokr` | 4 | zaokrąglenie m w px; s to połowa (2), l dwa razy tyle (8), `pelne` to pigułka; 0 = wszystko kanciaste, łącznie z pigułką |
| `--grubosc-linii` | 1 | grubość obramowań i obrysu przycisku w px |
| `--sila-cienia` | 1 | 0 = bez cieni, 1 = delikatny (krycie 6–10%), 2 = wyraźniejszy; kolor cienia z koloru tekstu |
| `--przycisk-wysokosc` | 48 | wysokość przycisku w px, nigdy poniżej 44 px (palec) |
| `--przycisk-wciecie` | `var(--odstep-m)` | wcięcie z boku, stopień odstępu (płynie 24 → 30 px) |
| `--przycisk-kroj` | 600 | grubość kroju napisu |
| `--przycisk-zaokr` | `var(--zaokr-m)` | zaokrąglenie przycisku, stopień zaokrąglenia |
| `--przycisk-litery` | 0.01em | odstępy między literami |
| `--pole-wysokosc` | 48 | wysokość pola, też nigdy poniżej 44 px |
| `--pole-wciecie` | `var(--odstep-s)` | wcięcie tekstu w polu |
| `--pole-obramowanie` | `var(--kolor-obramowanie-mocne)` | kolor ramki pola |
| `--pole-zaokr` | `var(--zaokr-m)` | zaokrąglenie pola |
| `--pole-fokus` | `var(--kolor-marka-tekst)` | kolor ramki i obrysu po kliknięciu w pole, z koloru marki |

Wyliczone z nich: `--zaokr-s/m/l/pelne`, `--linia`, `--cien-s/m/l`, `--przycisk-h`, `--pole-h`,
`--przycisk-hover`, nowy kolor roli `--kolor-obramowanie-mocne` (ramka, którą musi być widać: co najmniej 3:1 do tła).

### Nowe klasy

- Tailwind: `rounded-s`, `rounded-m`, `rounded-l`, `rounded-pelne`, `shadow-s`, `shadow-m`, `shadow-l`, `border-linia`,
  `border-obramowanie-mocne`. Działają też z bokami (`rounded-t-m`, `border-x-linia`).
- Wyłączone domyślne Tailwinda: `rounded`, `rounded-lg`, `rounded-md`…, `shadow`, `shadow-md`…, `inset-shadow-*`,
  `drop-shadow-*`, `text-shadow-*` (nie dają żadnego CSS). Zostały świadomie `rounded-full` (koło), `rounded-none`, `shadow-none`.
- Gotowe składniki (zwykły CSS, bez Reacta, działają przy CSS modules i na `<a>`):
  `przycisk` (kolor marki), `przycisk-drugi` (obrys w kolorze marki), `przycisk-jasny` (biały, na ciemnym tle lub zdjęciu,
  z cieniem s i jasnym obrysem z klawiatury), `pole` (input, textarea, select z własną strzałką).
  Stany: najechanie, widoczny obrys z klawiatury, wyłączony; pole ma też podpowiedź w kolorze stonowanym.
- `components/ui/button.tsx` korzysta teraz z tych klas (doszedł wariant `light`), `card.tsx` ma `rounded-l border-linia`.

### Jedna rzecz zrobiona inaczej niż „na oko”, z powodem

Przycisk marki po najechaniu **nie** używa `--kolor-marka-hover`. Ten kolor zawsze ciemnieje, a przy jasnej marce
napis jest czarny, więc ciemniejsze tło osłabiało kontrast poniżej normy (test to pokazuje na prawdziwych markach).
Nowy `--przycisk-hover` odsuwa kolor od napisu: ciemnieje pod białym napisem, jaśnieje pod czarnym. Kontrast po najechaniu
tylko rośnie. `--kolor-marka-hover` zostawiłam bez zmian, bo inne strony już na nim stoją.

### Strażnik

Łapie dodatkowo: `rounded`, `rounded-lg`, `rounded-[8px]`, `rounded-t-lg`, `shadow`, `shadow-md`, `shadow-[0_1px_2px_…]`,
`drop-shadow-md`, `border-2`, `border-[3px]`, a w CSS (także `*.module.css`) i w `style={{}}` liczby w `border-radius`
(i jego odmianach), `box-shadow` i `text-shadow`. Podpowiada stopień, np. `rounded-lg` → `rounded-l`, `shadow-md` → `shadow-m`,
`border-radius: 8px` → `var(--zaokr-l)`, `9999px` → pigułka. Przepuszcza procenty (`border-radius: 50%` na koło),
zera, zmienne i `none`. Wyjątek dalej przez `skala-ok: <powód>`.
Grubości linii w zwykłym CSS (`border: 1px solid …`) strażnik celowo nie rusza, bo zlecenie tego nie obejmowało,
a strony mają tego dużo; łapie tylko klasy Tailwinda.

## Wyniki (zmierzone u mnie)

- `npm test`: **37 z 37 zielonych** (było 20). Nowe sprawdzają:
  - strażnika w obie strony dla kształtów: 28 złych klas złapanych, 28 dobrych przepuszczonych, CSS, `.module.css`
    i `style={{}}` z dokładnymi numerami linii, podpowiedzi stopnia, wyjątek `skala-ok` z powodem i bez;
  - liczby przy 320 i 1440 px: zaokrąglenia 2/4/8 px, linia 1 px, przycisk i pole 48 px, wcięcie przycisku 24 → 30 px,
    wcięcie pola 18 → 20 px;
  - jedno wejście zmienia wszystko: `--baza-zaokr` 6 daje 3/6/12 px oraz 6 px w przycisku i polu, 0 daje kanciaste
    wszystko łącznie z pigułką, a odstępy i tekst stoją w miejscu; `--grubosc-linii` 2 daje linię 2 px;
  - przycisk i pole przy wpisanych 30 i 36 px i tak mają 44 px;
  - cienie: kolor ten sam co tekst, krycie 6–10%, siła 0 daje zero, krycie nie wychodzi ponad 100%, rozmycie s < m < l;
  - kontrast: napis na przycisku marki i **po najechaniu** co najmniej 4,5:1 przy 1368 markach (każda jasność, 6 odcieni,
    3 nasycenia); napis jasnego przycisku po najechaniu 15,9:1; ramka pola do tła 3,9:1, do innego tła 3,6:1 (norma 3:1);
  - składniki mają stany najechania, wyłączenia i obrys z klawiatury i nie mają ani jednego piksela ani koloru wpisanego z ręki.
- `npm run lint`: zielono, strażnik „czysto (przejrzane pliki: 7)”.
- `npm run build`: zielono, trzy strony statyczne (`/`, `/skala-proba`, 404). W gotowym CSS są `rounded-s/m/l/pelne`,
  `shadow-s/m/l`, `border-linia`, a nie ma `rounded-lg` ani `shadow-md`.

## Co znalazłam i naprawiłam po drodze

- **Czarna smuga zamiast cienia w starych przeglądarkach.** Pierwsza wersja liczyła kolor cienia przez `color-mix()`.
  Przy budowie narzędzie dokleiło starym przeglądarkom zastępczy, pełny kolor tekstu, czyli cień byłby nieprzezroczysty.
  Zobaczyłam to w gotowym CSS i przepisałam kolor cienia tak, że stara przeglądarka po prostu nie pokaże cienia.
  Przycisk marki po najechaniu w przeglądarkach sprzed ok. 2023 nie zmieni koloru (to samo zabezpieczenie przy budowie); poza tym działa.

## Czego nie zrobiłam, bo nie było mi wolno

- **Zrzuty przy 320 i 1440 px i ich obejrzenie.** Przeglądarka do zrzutów była dla mnie zablokowana (odmowa uprawnień),
  tak samo uruchomienie serwera strony w tle. Zgodnie z zasadą karty nie obchodziłam tego inną drogą. **Ścieżek zrzutów
  więc nie ma.** Strona próbna jest gotowa i zbudowana, czeka na Bazę albo Piotrka:
  1. W tym drzewie `npm run dev`, potem `http://localhost:3000/skala-proba`.
  2. Zrzuty całej strony przy szerokości 320 i 1440 px.
  3. Na stronie są przyciski trzech rodzajów i pola w czterech stanach (zwykły, najechany, fokus z klawiatury, wyłączony),
     lista wyboru, pole tekstowe, formularz z przyciskiem w jednym rzędzie, próbki zaokrągleń, cieni, karta i komponent `Button`.
     Elementy, które mają pokazać stan najechania albo fokusu, mają atrybut `data-stan="hover"` lub `data-stan="focus"`:
     w Playwright wystarczy na nich `hover()` albo `focus()` z klawiatury, w DevTools przełącznik `:hov`.
  4. Do obejrzenia przede wszystkim: czy przycisk i pole stoją równo w jednym rzędzie (oba 48 px), czy strzałka listy wyboru
     jest trójkątem w dół, czy cienie są delikatne, a obrys z klawiatury widoczny także na ciemnym tle.
- **Plik z listą paczek (`npm ci`).** Odmowa potwierdzona: brakuje `@emnapi/runtime@1.11.3` i `@emnapi/core@1.11.3`,
  a `@emnapi/wasi-threads` ma 1.2.2 zamiast 1.2.3. Naprawa bez internetu się nie udała (brak tych paczek w pamięci
  podręcznej npm). Naprawi to jedno `npm install` z internetem i commit samego `package-lock.json`. Wpisane do `TABLICA.md`.

## Poprawki po oględzinach Bazy (2026-11-11)

Baza obejrzała zrzuty 1440 i 320 px i zgłosiła dwie rzeczy. Obie poprawione, zrzutów nie robiłam (ogląda Baza).

1. **Strzałka listy wyboru rozjeżdżała się przy 1440 px** na dwa przesunięte trójkąciki. Przyczyna: składała się
   z dwóch osobnych gradientów, a ich rozmiar i pozycja wychodziły na ułamkach piksela, więc każda połówka
   zaokrąglała się inaczej. Teraz strzałka to **jeden gradient stożkowy**, czyli jeden kształt, który nie ma się na co
   rozjechać; kolor dalej bierze z koloru tekstu (także szary w polu wyłączonym). Do tego w przeglądarkach, które znają
   `round()`, kafelek ma parzystą szerokość w pełnych pikselach i wysokość równą połowie, a odsunięcie od prawej i od góry
   też jest w pełnych pikselach, więc krawędzie są ostre przy każdej szerokości. Starsze przeglądarki zostają przy jednym
   trójkącie bez zaokrąglenia. Jedyne liczby w pikselach to kroki siatki ekranu (1 px, 2 px) w `app/skala.css`.
   Nowy test pilnuje, że w tle jest dokładnie jeden gradient i że wersja z `round()` istnieje (stara wersja go nie przechodzi).
2. **Przycisk ghost wyglądał jak drobny dopisek** (napis ok. 13 px, własne małe wcięcia). Doszła klasa Skali
   `przycisk-cichy`: stoi na tej samej wspólnej regule co pozostałe przyciski (wysokość 48 px, wcięcie, krój 600,
   napis `--tekst-m`, zaokrąglenie), bez tła i obrysu, napis w kolorze marki, po najechaniu blade tło marki, stan wyłączony
   jak u innych. `Button variant="ghost"` używa teraz tej klasy. Test sprawdza, że wszystkie cztery odmiany stoją na wspólnej
   regule i że cichy nie ma tła ani obrysu. Na stronie próbnej doszedł rząd „Cichy” we wszystkich czterech stanach.

Po poprawkach: `npm test` **38 z 38**, `npm run lint` czysto, `npm run build` zielono; w gotowym CSS obie wersje strzałki są
nietknięte.

Do obejrzenia przez Bazę: strzałka listy wyboru przy 1440 i 320 px (pole zwykłe i wyłączone) oraz rząd „Cichy”
na stronie próbnej obok przycisku głównego.

## Stan błędu pola (2026-11-11, po /tak Piotrka)

- **Kolor roli `--kolor-blad`:** `oklch(0.5 0.19 27)`, czerwień o stałych liczbach, bez zależności od marki.
  Kontrast do tła 6,5:1, do innego tła 6,1:1; najsłabszy wynik przy 72 próbkach marek (24 odcienie, 3 jasności) to 6,06:1
  (wymagane 4,5 dla komunikatu i 3 dla ramki). Klasy `text-blad`, `border-blad`. Zmiennej `--kolor-blad-tlo` nie dodałam,
  bo nic z niej nie korzysta.
- **Pole z błędem:** `aria-invalid="true"` (zalecane, czytnik ekranu to ogłasza) albo klasa `pole-blad`. Ramka w kolorze błędu
  w każdym stanie: zwykłym, najechanym, z obrysem z klawiatury i w obu naraz. Obrys z klawiatury też w kolorze błędu.
  Uwaga Codexa była trafna: sama reguła błędu ma mniejszą swoistość niż reguła najechania zwykłego pola, więc stan najechany ma
  własną regułę błędu.
- **Komunikat `pole-komunikat`:** tekst pod polem w kolorze błędu, stopień tekstu s, bez paska, ramki i tła.
- **Testy (42 z 42, było 38):** test liczy kaskadę jak przeglądarka (swoistość, potem kolejność w pliku) dla `input`,
  `textarea` i `select`, obu selektorów i czterech stanów. Najpierw sprawdza, że dla zwykłego pola wychodzi to, co wiadomo
  (zwykła ramka, ciemniejsza po najechaniu, ramka marki przy fokusie). Sprawdziłam też, że test działa: po usunięciu
  reguły najechania dla błędu test padł z komunikatem „najechany: ramka z .pole:hover:not(:disabled)”, a po przywróceniu
  znowu przeszedł. Do tego kontrast przy wielu markach, brak `--kolor-blad-tlo` i brak liczb z ręki w nowych regułach.
- **README i strona próbna:** opis i przykład z `aria-describedby`. Na `/skala-proba` są trzy pola telefonu z błędem
  (zwykłe, `data-stan="hover"`, `data-stan="focus"`) z komunikatami oraz pole tekstowe z klasą `pole-blad`.
- Dotychczasowe wartości i strażnik bez zmian. `npm run lint` czysto, `npm run build` zielono. Zrzutów nie robiłam.

## Co zostaje

- Strona próbna `app/skala-proba/` do usunięcia przed scaleniem (po zrzutach). Wpisane do `TABLICA.md`.
- Scalenie do `main` i wypchnięcie robi Baza po słowie Piotrka.
- Pliki robocze (sondy) usunięte; pusty katalog `src/` mógł zostać na dysku, bo usunięcie katalogu dostało odmowę.
  Git go nie widzi, nic nie trafia do commitu.

**Nic od Ciebie nie potrzebuję.** Zrzuty i obejrzenie strony próbnej zrobi Baza; scalenie po Twoim słowie.

A gdybyśmy poszli dalej: dołożę do Skali stan błędu pola formularza (czerwona ramka i komunikat pod polem, kolor błędu wyliczony
w skali i sprawdzony testem kontrastu).
Formularze kontaktowe Magweru i Manusa dostaną go gotowego, zamiast każda strona wymyślała własną czerwień.
Koszt to około godziny pracy karty, bez Twojej ręki; `/tak` dopisze to na tej gałęzi przed scaleniem.
