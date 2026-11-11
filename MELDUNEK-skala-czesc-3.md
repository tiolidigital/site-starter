# MELDUNEK: Skala część 3 (wejścia z makiety Manusa, dolna granica tekstu, warstwy)

**Gałąź:** `feat/skala-czesc-3` w `site-starter-skala3`. Bez pushu i bez scalania, zgodnie ze zleceniem.
**Zlecenie:** `HANDOFF-2026-11-11-skala-czesc-3.md` (Baza, karta baza-f0). Zrobione wszystkie 8 punktów.

## W skrócie

Szablon stron umie teraz to, czego zabrakło przy makiecie Manusa: wielki tytuł pierwszego ekranu,
wybór wielkości nagłówków, grubości kroju (ważne przy krojach z jedną grubością), drugi kolor na
przycisk i ściszenie odcienia szarości. Nazwy są te same co w makiecie, więc Manus podmieni import
i wpisze swoje liczby. Mały tekst nie spada już poniżej 15 px. Strażnik łapie regułę strony,
która po cichu zabierała napis z przycisku.

## Nowe wejścia i klasy (w `app/skala.css`, blok WEJŚCIA)

| Wejście | Domyślnie | Co robi | U Manusa |
|---|---|---|---|
| `--tekst-min` | 15 | dolna granica stopni xs i s (twardy dół 12 px zostaje) | nowe, nie było |
| `--baza-tytul-tel`, `--baza-tytul-pc` | 36, 64 | wielki tytuł, płynnie od telefonu do komputera; klasa `text-tytul`, w CSS `var(--tekst-tytul)` | 36, 124 |
| `--naglowek-1`, `-2`, `-3` | `var(--tekst-xxl)`, `-xl`, `-l` | który stopień biorą h1, h2, h3 | tytuł, xxl, l |
| `--grubosc-tekst`, `-mocna`, `-naglowki` | 400, 650, 650 | grubość zwykłego tekstu, `<strong>` w `.tresc`, nagłówków | 400, 500, 400 |
| `--akcent-l`, `-c`, `-h` | równe marce | drugi kolor; klasa `przycisk-akcent`, kolory `bg-akcent`, `text-na-akcencie`, `hover:bg-akcent-hover`, w Reakcie `<Button variant="accent">` | 0,443 · 0,14 · 261 |
| `--odcien-szarosci` | 1 | ile odcienia marki mają tła, tekst, linie i cień (0 = czysta szarość) | 0,35 |

Wyliczane kolory akcentu: `--kolor-akcent`, `--kolor-na-akcencie`, `--kolor-akcent-hover`
(plus pomocniczy `--kolor-przeciw-akcentowi`). Napis na akcencie wybiera się dokładnie po luminancji,
tak jak na marce. **Najechanie liczone z przepisu przycisku marki, nie z makiety:** kolor odsuwa się
od napisu (ciemnieje pod białym, jaśnieje pod czarnym). Wzór z makiety zawsze przyciemnia i przy
jasnym akcencie z czarnym napisem obniżał kontrast. Osobny test pokazuje to w liczbach.

Dla niebieskiego akcentu Manusa różnica jest mała: napis biały, po najechaniu jasność 0,354 zamiast 0,363.

**Warstwy:** Skala już trzymała reset w warstwie `base`, a składniki w `components`. Doszło:
- strażnik (`npm run skala`, część `npm run lint`) łapie regułę bez klasy (`a`, `ul`, `*`, `html`) wpisaną
  poza `@layer`, w plikach `.css` i w `<style>` plików `.astro`, z podpowiedzią „włóż ją do @layer base”;
  same zmienne (`:root { --x: … }`) i reguły z klasą przechodzą;
- w `app/globals.css` komentarz z przykładem, gdzie wkładać własne reguły bazowe;
- zasada z przykładem w README (sekcja Skali) i jedna linijka w AGENTS.md;
- jedyna reguła luzem w samej Skali (`color-scheme: light` na `:root`) przeszła do warstwy `base`.
  Na wygląd to nie wpływa.

## Co zmienia wygląd istniejących stron

**Tylko mały tekst** (świadomy wyjątek z pkt 6 zlecenia):

| Stopień | Telefon (320 px) | Komputer (1440 px) |
|---|---|---|
| xs | 12 → 15 px | 12 → 15 px |
| s | 14,2 → 15 px | 13,5 → 15 px |

Przy domyślnych liczbach xs i s są więc równe. Zlecenie na to pozwala. Komunikat błędu pod polem
(stopień s) ma teraz 15 px zamiast ok. 13,5. Granica liczy się w rem, więc rośnie razem z powiększonym
tekstem w ustawieniach przeglądarki. Twardy dół 12 px działał w pikselach i dalej obowiązuje.

Wszystko inne ma domyślnie te same wartości co przed częścią 3: nagłówki (xxl, xl, l, grubość 650),
zwykły tekst 400, `<strong>` w `.tresc` 650, szarości z tym samym odcieniem, przyciski i pola bez zmian.

## Wyniki sprawdzeń (zrobione tutaj)

- `npm test`: **55 z 55 zielonych.** Nowe testy: tytuł przy 280, 320, 880, 1440 i 2560 px (zawsze większy niż xxl),
  nagłówki domyślnie i w układzie Manusa przy 320 i 1440 px, granica 15 px przy 7 szerokościach ekranu
  i przy skoku Manusa (tam bez granicy było 13 px), grubości bez liczb w regułach, akcent przy 1368 próbkach
  koloru (napis i najechanie co najmniej 4,5:1, wersja zgrubna dla starych przeglądarek słaba tylko
  w wąskim pasie jasności, jak u marki), odcień szarości 0, 0,35 i 1 z kontrastem wszystkich ról przy
  czterech markach, kaskada z warstwami (reguła luzem zabiera napis przycisku i ramkę pola, w `@layer base`
  już nie, większa swoistość nie pomaga), strażnik warstw na 20-linijkowym przykładzie, podpowiedzi
  strażnika (`text-[13px]` → `text-s` z dopiskiem o 15 px, `text-[80px]` → `text-tytul`).
- `npm run lint`: czysto (ESLint i strażnik, 8 plików).
- `npm run build`: zielony, 3 strony (główna, 404, strona próbna). W zbudowanym CSS sprawdzone: klasa
  `text-tytul`, przycisk akcentu z dokładnym kolorem napisu, granica tekstu, `color-scheme` w warstwie base,
  zerowanie odnośników strony próbnej w `@layer base`.
- Sonda: plik roboczy z `a { color: inherit; }` luzem i `ul` w warstwie. `npm run lint` zatrzymał się
  z kodem 1 i wskazał tylko linię z `a`. Plik skasowany, lint znów czysto.

## Do obejrzenia oczami (Baza, zrzuty 320 i 1440 px)

Strona próbna `/skala-proba` (katalog `app/skala-proba/`, **do usunięcia przed scaleniem**, razem z `proba.css`):
- tytuł `text-tytul` nad zwykłym h1, h2, h3 w `.tresc`;
- trzy linie małego tekstu (xs, s, m): xs i s mają wyjść równe, 15 px;
- przyciski marki i akcentu w czterech stanach (atrybut `data-stan` jak w części 2); akcent na tej stronie
  to bursztyn z `proba.css` (czarny napis, po najechaniu jaśnieje), bo domyślny akcent jest równy marce;
- „link jako przycisk” przy włączonym zerowaniu odnośników w `@layer base`: napis ma być widoczny;
- pole telefonu z błędem i komunikatem, dopisek o zgodzie w stopniu s, przycisk akcentu „Wyślij zapytanie”.

Prawdziwego zakupu ani kliknięcia Piotrka ta robota nie wymaga.

## Decyzje podjęte po drodze

- **Akcent domyślnie równy marce.** Nowa strona, która go nie ustawi, nie dostanie przypadkowego drugiego koloru.
- **Tytuł domyślnie 36 i 64 px**, nie 124 jak u Manusa: 124 px to decyzja jednej strony, nie szablonu.
- **Granica tekstu działa tylko w górę:** stopnie m i wyższe i tak są większe niż 15 px.
- **Grubości nie trafiły do klas Tailwinda** (`font-…`): nazwa `font-naglowki` jest już zajęta przez krój nagłówków.
- Wariant `accent` w komponencie `Button` dopisany, bo inne warianty też tam są (5 linijek).

## Zauważone przy okazji (wpisane do `TABLICA.md`)

- Krój z jedną grubością dalej będzie pogrubiany sztucznie w dwóch miejscach: `<strong>` poza `.tresc`
  (reset Tailwinda daje 700) i tytuł karty `CardTitle` (`font-semibold`, 600). Naprawa zmieniłaby wygląd
  o włos, a zlecenie zabrania innych zmian wyglądu, więc zostało jako wpis i propozycja niżej.
- Stary wpis o stronie próbnej części 2 uzupełniony: tamta jest usunięta, w tym samym miejscu stoi strona części 3.

## Odmowy uprawnień

Dwa polecenia dostały odmowę: `caffeinate -i npm run build` i samo `npm run skala`. Build przeszedł
zwykłym `npm run build`, a strażnik w ramach `npm run lint`. Nic przez to nie czeka.

## Dla Bazy

Zrzuty strony próbnej, usunięcie `app/skala-proba/` przed scaleniem, scalenie do main. Potem Manus:
podmiana Skali w makiecie na import z szablonu i wpisanie swoich liczb z tabeli wyżej (kolumna „U Manusa”).

**Nic od Ciebie nie potrzebuję.**

---

**A gdybyśmy poszli dalej:** grubości tylko z wejść. `<strong>` w całej stronie i tytuł karty biorą grubość
z `app/skala.css`, a strażnik łapie `font-semibold` i `font-bold` z podpowiedzią.
Daje to tyle, że przy kroju z jedną grubością (jak DM Serif Display u Manusa) jedna liczba wystarczy
i nigdzie na stronie litery nie wyjdą sztucznie pogrubione.
Ok. pół godziny jednej sesji, bez Twojej ręki; zmienia wygląd o włos (pogrubienie poza treścią 700 → 650). `/tak` dopisze to jako część 4 do kolejki Bazy.
