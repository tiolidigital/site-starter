# HANDOFF 2026-11-11: Skala część 3 – wejścia z makiety Manusa, dolna granica tekstu, warstwy

**Zleceniodawca:** baza (karta baza-f0) · App_Factory/BAZA · zgoda Piotrka `/tak` 11.11
**Gałąź:** `feat/skala-czesc-3` w drzewie `../site-starter-skala3`. Bez pushu i bez scalania, to robi Baza.

## Po co

Skala (framework stron, `app/skala.css`, części 1 i 2 w main) przy pierwszej prawdziwej stronie (makieta Manusa)
okazała się za ciasna. Źródło: `../manus-de-premium/makiety-premium/skala.css` i `MELDUNEK-B2.md`, sekcja
„Nowe wejścia dopisane do Skali”. Przejmij **ich nazwy**, żeby Manus podmienił potem tylko import.
Domyślne wartości mają nie zmieniać wyglądu istniejących stron, z jednym świadomym wyjątkiem w pkt 6.

## Co zrobić (plan po uwagach Codexa)

1. `--baza-tytul-tel`, `--baza-tytul-pc` i wyliczany `--tekst-tytul`: wielki tytuł pierwszego ekranu, większy niż xxl.
   Dostępny osobno (klasa, np. `text-tytul`), **nie** zmienia domyślnego h1.
2. `--naglowek-1/2/3`: który stopień biorą h1–h3. Domyślnie jak dziś: h1 = xxl, h2 = xl, h3 = l.
3. `--grubosc-tekst`, `--grubosc-mocna`, `--grubosc-naglowki`, domyślnie jak dziś (nagłówki 650). Opisz w README,
   że krój z jedną grubością (np. DM Serif Display 400) wymaga ustawienia grubości na tę jedyną, bo inaczej przeglądarka pogrubia sztucznie.
4. `--akcent-l/c/h` + `--kolor-akcent`, `--kolor-na-akcencie`, `--kolor-akcent-hover` i `.przycisk-akcent`.
   Dobór koloru napisu i kierunek zmiany przy najechaniu **skopiuj z przycisku marki** (`--przycisk-hover` odsuwa kolor od napisu),
   nie z makiety Manusa (ona zawsze przyciemnia, co obniża kontrast pod czarnym napisem). Test kontrastu jak dla marki, po najechaniu też.
5. `--odcien-szarosci` (1 = jak dziś, 0 = szarości bez odcienia marki) ścisza zabarwienie teł, tekstu i linii.
6. `--tekst-min`, domyślnie **15 px**: dolna granica stopni s i xs, żeby przy dużym skoku mały tekst nie spadał do 13 px
   (dziś komunikat błędu pola ma ok. 13 px). Zaktualizuj testy i podpowiedzi strażnika, które zakładają 12 px.
   Przy tej granicy xs i s mogą wyjść równe, to dopuszczalne. To jedyna zmiana wyglądu istniejących stron.
7. **Warstwy (`@layer`)**: zwykła reguła strony spoza warstw, np. `a { color: inherit }`, wygrywa z `.przycisk` i napis znika.
   Większa swoistość tego nie naprawi. Rozwiąż przez warstwy: reset i reguły bazowe strony w warstwie `base`, składniki w `components`.
   Dopisz w README zasadę „własne reguły bazowe strony wkładaj do `@layer base`” z przykładem. Test, który to łapie.
8. Testy dla każdego wejścia przy 320 i 1440 px, README (sekcja Skali, nowe wejścia i klasy w tym samym stylu),
   strona próbna `app/skala-proba/` z tytułem, nagłówkami, przyciskiem akcentu, polem z błędem i komunikatem.

## Czego nie robić

Nie zmieniaj innych domyślnych wartości. Nie dotykaj innych repo. Bez kolorowych pasków akcentu.

## Dowód

`npm test`, `npm run lint`, `npm run build` zielono. Zrzutów nie rób (nie masz przeglądarki), obejrzy je Baza.
Meldunek: `MELDUNEK-skala-czesc-3.md` w katalogu głównym drzewa: nowe wejścia i klasy, co zmienia wygląd istniejących stron, wyniki testów.
