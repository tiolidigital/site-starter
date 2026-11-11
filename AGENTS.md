<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

## Reguły Odlewni obowiązujące też w tym repo

To repo nie trzyma u siebie katalogu `conventions/`, ale reguły warsztatu (Odlewni,
czyli `App_Factory/factory-kit`) obowiązują tu tak samo. Nośnikiem dla sesji Claude Code
jest globalny `~/.claude/CLAUDE.md`; ten akapit jest po to, żeby widział je także agent,
który czyta wyłącznie pliki repo (Codex, Cursor) oraz człowiek zaglądający tu pierwszy raz.

- **„A gdybyśmy poszli dalej”** — każde domknięcie roboty niesie JEDNĄ propozycję: co zrobimy,
  co to daje Piotrkowi, ile kosztuje. Nigdy bramka (cisza znaczy „nie teraz”), nigdy wypełniacz
  (brak pomysłu to legalna odpowiedź). Niepodjęta idzie linijką do „pomysłów” w `TABLICA.md`.
  Wyłącznik: plik `.claude/bez-propozycji`. Kanon: `factory-kit/conventions/propozycja-dalej.md`.
- **Porzucona robota zapisuje się sama** — niezapisane zmiany nietknięte od ≥3 dni dostają
  lokalny commit `WIP: porzucona robota z <data>` (koniec tury + 03:20 w nocy). Nic nie jest
  pushowane ani wdrażane, cofnięcie jedną komendą. Wypisanie repo: `.claude/zamiatanie-off`.
  Kanon: `factory-kit/conventions/zamiatanie-porzuconej-roboty.md`.
- **Po ludzku do właściciela** — skutek zamiast nazwy kodowej, liczba zawsze ze znaczeniem,
  osobny punkt „od Ciebie potrzebuję”. Pełna lista: `factory-kit/conventions/README.md`.

## Skala strony – obowiązuje przy każdej zmianie wyglądu

- Odstępy, rozmiary tekstu i kolory biorą się wyłącznie ze skali w `app/skala.css`.
  **Przy starcie nowej strony ustaw własne wartości wejściowe** (blok `WEJŚCIA`: baza, skoki,
  kolor marki, kroje), bo jeden wzór to jedna strona w portfelu i strony nie mogą wyglądać jak siostry.
- Klasy: odstępy `p-m`, `gap-l` (stopnie `xs s m l xl xxl`), sekcje `py-sekcja-s/m/l`,
  margines boczny `px-margines`, tekst `text-xs … text-xxl`, kolory według roli (`bg-tlo`,
  `text-tekst`, `text-stonowany`, `border-obramowanie`, `bg-marka` + `text-na-marce`…).
  Treść z akapitami i listami owijaj w `className="tresc"`.
- Kształty: `rounded-s/m/l/pelne`, `shadow-s/m/l`, `border-linia`. Przyciski i pola tylko gotowymi klasami
  `przycisk`, `przycisk-akcent`, `przycisk-drugi`, `przycisk-jasny`, `przycisk-cichy`, `pole` (bez własnych wysokości, zaokrągleń i cieni).
- Wielki tytuł pierwszego ekranu: `text-tytul`. Wielkość h1–h3, grubości kroju, akcent i odcień szarości
  ustawia się wejściami w `app/skala.css` (`--naglowek-1`, `--grubosc-naglowki`, `--akcent-l/c/h`, `--odcien-szarosci`).
- Własne reguły bazowe strony (`a { … }`, `ul { … }`, `*` …) tylko w `@layer base { … }`. Luzem wygrywają
  z klasami Skali i np. zabierają napis z przycisku; strażnik to łapie.
- Nie wpisuj liczb z ręki (`py-16`, `p-[37px]`, `text-2xl`, `bg-zinc-50`, `#abc`, `padding: 16px`,
  `rounded-lg`, `shadow-md`, `border-radius: 8px`)
  ani wariantu `dark:` – strony są zawsze jasne. Pilnuje tego `npm run skala` (część `npm run lint`).
  Świadomy wyjątek: komentarz `skala-ok: <powód>` w tej samej linii.
- Zmiana liczb w `app/skala.css` wymaga przebudowy strony; testy liczb i strażnika: `npm test`.

## Sierotki i wdowy – z automatu, nie ręcznie

- `<Typografia />` w `app/layout.tsx` poprawia cały tekst strony po załadowaniu (lib/typografia.ts).
  Nie wpisuj twardych spacji (`&nbsp;`, `\u00a0`) w treści i nie pisz własnego helpera; nie usuwaj komponentu z layoutu.
- Tekst poza stroną (meta, mail, PDF): `bezSierot(tekst)`. Fragment do pominięcia: `data-bez-typografii`.
- Wdowę zgłoszoną przez bramkę w wąskiej kolumnie poprawia się tekstem, nie kodem.
