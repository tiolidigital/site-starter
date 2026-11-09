# TABLICA – site-starter

## Zauważone

- Kroje Geist ładowane przez `next/font/google` z podzbiorem `latin` (bez `latin-ext`): polskie ą, ę, ś idą z kroju zastępczego. Reguła Piotrka z 30.10: polskie litery z własnego pliku woff2 na grubość, inaczej są krzywe w Safari. Do zmiany osobnym zleceniem (wejście `--kroj-tekst` w `app/skala.css` jest już gotowe na podmianę). · zauważone 2026-11-09
- `metadata` w `app/layout.tsx` ma jeszcze tytuł i opis z Create Next App. · zauważone 2026-11-09

## Pomysły

- Automatyczna kontrola w GitHubie przy każdym wypchnięciu (`npm test` + `npm run lint` ze strażnikiem skali), kopiowana z szablonem do każdej nowej strony. · zaproponowane 2026-11-09
