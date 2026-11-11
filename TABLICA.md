# TABLICA – site-starter

## Zauważone

- Kroje Geist ładowane przez `next/font/google` z podzbiorem `latin` (bez `latin-ext`): polskie ą, ę, ś idą z kroju zastępczego. Reguła Piotrka z 30.10: polskie litery z własnego pliku woff2 na grubość, inaczej są krzywe w Safari. Do zmiany osobnym zleceniem (wejście `--kroj-tekst` w `app/skala.css` jest już gotowe na podmianę). · zauważone 2026-11-09
- `metadata` w `app/layout.tsx` ma jeszcze tytuł i opis z Create Next App. · zauważone 2026-11-09
- `npm ci` w czystej kopii odmawia: `package-lock.json` nie ma `@emnapi/runtime@1.11.3`, `@emnapi/core@1.11.3`, a `@emnapi/wasi-threads` ma 1.2.2 zamiast 1.2.3. Bez internetu nie do naprawienia (brak paczek w pamięci podręcznej npm). Naprawa: `npm install` z internetem w tym repo i commit samego `package-lock.json`. · zauważone 2026-11-11
- Strona próbna `app/skala-proba/` (część 2) czeka na zrzuty 320 i 1440 px i jest do usunięcia przed scaleniem. · zauważone 2026-11-11 · część 2 usunięta przed scaleniem; teraz w tym samym miejscu strona próbna części 3 (z `proba.css`), też do usunięcia przed scaleniem
- Krój z jedną grubością dalej pogrubiany sztucznie w dwóch miejscach poza wejściami grubości: `<strong>` poza `.tresc` (reset Tailwinda daje „bolder”, czyli 700) i tytuł karty `CardTitle` (`font-semibold`, 600). Ujednolicenie z `--grubosc-mocna` / `--grubosc-naglowki` zmieniłoby wygląd o włos (700 → 650, 600 → 650), więc nie weszło do części 3. · zauważone 2026-11-11

## Pomysły

- Automatyczna kontrola w GitHubie przy każdym wypchnięciu (`npm test` + `npm run lint` ze strażnikiem skali), kopiowana z szablonem do każdej nowej strony. · zaproponowane 2026-11-09
- Stan błędu pola formularza w Skali: kolor błędu wyliczony w skali (z kontrastem w teście), `.pole[aria-invalid="true"]` i klasa komunikatu pod polem. Formularze kontaktowe Magweru i Manusa dostają go gotowego zamiast wymyślać własną czerwień. · zaproponowane 2026-11-11 · zatwierdzone 2026-11-11 (/tak) · zrobione 2026-11-11 na `feat/skala-ksztalty`
- Grubości tylko z wejść: `<strong>` wszędzie i `CardTitle` biorą `--grubosc-mocna` / `--grubosc-naglowki`, a strażnik łapie `font-semibold`, `font-bold`, `font-weight: 700` i podpowiada wejście. Wtedy jedna liczba w `app/skala.css` wystarcza, żeby krój z jedną grubością nigdzie nie był sztucznie pogrubiany. · zaproponowane 2026-11-11
