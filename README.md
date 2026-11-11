# site-starter

Skeleton Next.js 16 + Tailwind v4 + Supabase + Sentry dla ścieżki **site-build** factory-kit.

> Wygenerowany z `gh repo create <projekt> --template tiolidigital/site-starter`.
> Uzupełnij placeholdery (`{{SENTRY_ORG}}`, `{{SENTRY_PROJECT}}`, `TABLES`, `BUCKET`) i przejdź `/new-project --site`.

## Stack

- **Next.js 16** App Router, TypeScript, Fluid Compute (Vercel)
- **Tailwind v4** + skala strony w `app/skala.css` (odstępy, tekst, kolory z kilku liczb, opis niżej)
- **Supabase** — `lib/supabase/{client,server,public}.ts` (tryby danych: §1)
- **Sentry** — manual wiring (`instrumentation.ts` + konfigi)
- **Backup** — darmowy backup logiczny (`scripts/backup.mjs` + `.github/workflows/backup.yml`)
- **Node 24** LTS (`.nvmrc`)

---

## Skala strony (odstępy, tekst, kolory, kształty)

### Skala (framework stron)

Zasada wzięta z Automatic CSS: kilka liczb na górze `app/skala.css` wylicza całą resztę, a w komponentach
nie ma ani jednej wartości wpisanej z ręki.

**Przy starcie strony ustaw własne wartości wejściowe** (baza odstępów, skoki, kolor marki, kroje, zaokrąglenie, cień).
Jeden zestaw liczb to jedna strona w portfelu: strony nie mogą wyglądać jak siostry.

- **Gdzie zmienić liczby:** `app/skala.css`, blok `WEJŚCIA` na górze. Reszta wylicza się sama
  i płynnie przechodzi od telefonu (320 px) do komputera (1440 px). Zmiana w pliku wchodzi
  na stronę po przebudowie (`npm run dev` odświeża sam, produkcja po `npm run build`).
  Na żywo można podejrzeć efekt w przeglądarce, nadpisując zmienną w DevTools
  (np. `--baza-odstep-pc` na `:root`).
- **Stopnie odstępów:** `xs s m l xl xxl`, np. `p-m`, `gap-l`, `mt-xs`.
  Sekcje: `py-sekcja-s`, `py-sekcja-m`, `py-sekcja-l`. Margines boczny strony: `px-margines`.
- **Stopnie tekstu:** `text-xs … text-xxl` (treść to `text-m`). Treść na telefonie co najmniej 17 px.
  Nagłówki `h1–h4` mają rozmiary same z siebie. Domyślne `text-sm`, `text-2xl` są wyłączone.
- **Dolna granica małego tekstu:** wejście `--tekst-min` (domyślnie 15 px). Stopnie `xs` i `s` nigdy nie
  schodzą niżej, więc przy dużym skoku dopisek pod formularzem czy komunikat błędu nie spada do 13 px.
  Przy tej granicy `xs` i `s` mogą wyjść równe, to dopuszczalne. Twardy dół 12 px zostaje niezależnie od wejścia.
- **Tytuł pierwszego ekranu:** wejścia `--baza-tytul-tel` i `--baza-tytul-pc` (domyślnie 36 i 64 px),
  stopień ponad `xxl`, klasa `text-tytul` (w CSS `var(--tekst-tytul)`). Domyślnego `h1` nie zmienia.
- **Który stopień biorą nagłówki:** wejścia `--naglowek-1`, `--naglowek-2`, `--naglowek-3`
  (domyślnie `var(--tekst-xxl)`, `var(--tekst-xl)`, `var(--tekst-l)`). Np. `--naglowek-1: var(--tekst-tytul)`
  daje każdemu `h1` wielkość tytułu. `h4–h6` mają zawsze stopień m.
- **Grubości kroju:** wejścia `--grubosc-tekst` (400), `--grubosc-mocna` (650, `<strong>` w `.tresc`)
  i `--grubosc-naglowki` (650). **Krój tylko w jednej grubości** (np. DM Serif Display, który istnieje
  tylko w 400) wymaga ustawienia tu tej jedynej grubości, np. `--grubosc-naglowki: 400`. Inaczej przeglądarka
  pogrubi go sztucznie i litery się rozmażą. To samo dotyczy `--przycisk-kroj`, gdy przyciski idą tym krojem.
- **Kolory według roli:** `bg-tlo`, `bg-tlo-inne`, `text-tekst`, `text-stonowany`, `border-obramowanie`,
  `bg-marka` + `text-na-marce`, `hover:bg-marka-hover`, `bg-marka-jasny`, `bg-marka-blady`, `text-marka-tekst`.
  Wszystkie wyliczone z jednego koloru marki (OKLCH). Strona jest zawsze jasna.
- **Odcień szarości:** wejście `--odcien-szarosci` (domyślnie 1). Tła, tekst, linie i cień mają lekki odcień
  marki; 0 daje czystą szarość, 0,35 tylko ślad odcienia. Przydaje się przy ciepłej albo chłodnej marce,
  przy której jasne tło wychodzi kremowe albo niebieskawe. Kolory marki go nie słuchają.
- **Akcent (drugi kolor):** wejścia `--akcent-l`, `--akcent-c`, `--akcent-h`, ten sam zapis co marka
  (domyślnie równe marce, więc drugi kolor pojawia się dopiero po wpisaniu własnych liczb). Klasa
  `przycisk-akcent` (w Reakcie `<Button variant="accent">`), kolory `bg-akcent`, `text-na-akcencie`,
  `hover:bg-akcent-hover`. Na wyróżniony przycisk, np. wysyłkę formularza, nie na paski czy obwódki.
  Napis biały albo czarny dobiera się sam, a po najechaniu kolor odsuwa się od napisu, jak w przycisku marki,
  więc kontrast tylko rośnie (testy sprawdzają to dla każdej jasności akcentu).
- **Rytm tekstu:** klasa `tresc` na rodzicu i wklejony tekst (akapity, nagłówki, listy, cytaty, linki)
  od razu ma porządne odstępy i szerokość wiersza.
- **Szerokości:** `max-w-miara` (wygodny wiersz tekstu), `max-w-strona` (cała treść).
- **Zaokrąglenia:** jedno wejście `--baza-zaokr` (domyślnie 4 px = stopień m). Klasy `rounded-s`, `rounded-m`,
  `rounded-l`, `rounded-pelne` (pigułka); w CSS `var(--zaokr-m)` i pokrewne. Baza 0 = wszystko kanciaste.
  Skromnie: bez łuków w tle i ramek w kształcie łuku. Na koło dalej `rounded-full`.
  Domyślne `rounded`, `rounded-lg`, `rounded-[8px]` są wyłączone.
- **Linia:** jedno wejście `--grubosc-linii` (1 px). Klasa `border-linia`, w CSS `var(--linia)`.
  Mocniejsze obramowanie, które musi być widać (pola): `border-obramowanie-mocne`.
- **Cienie:** jedno wejście `--sila-cienia` (0 = bez cieni, 1 = delikatny, 2 = wyraźny). Klasy `shadow-s`,
  `shadow-m`, `shadow-l`, w CSS `var(--cien-m)`. Kolor cienia bierze się z koloru tekstu.
  Domyślne `shadow`, `shadow-md`, `drop-shadow-*` są wyłączone.
- **Przyciski:** wejścia `--przycisk-wysokosc` (nigdy mniej niż 44 px), `--przycisk-wciecie` (stopień odstępu),
  `--przycisk-kroj`, `--przycisk-zaokr`, `--przycisk-litery`. Gotowe klasy (zwykły CSS, działają też
  przy CSS modules i na `<a>`): `przycisk` (kolor marki), `przycisk-drugi` (obrys), `przycisk-jasny`
  (na ciemnym tle lub zdjęciu), `przycisk-cichy` (bez tła i obrysu, tło po najechaniu). Wszystkie mają tę samą
  wysokość, krój i wielkość napisu. Stany: najechanie, widoczny obrys z klawiatury, wyłączony.
  Po najechaniu przycisk marki odsuwa się od koloru napisu, więc kontrast tylko rośnie.
- **Pola formularza:** wejścia `--pole-wysokosc`, `--pole-wciecie`, `--pole-obramowanie`, `--pole-zaokr`,
  `--pole-fokus` (kolor obramowania po kliknięciu, z koloru marki). Klasa `pole` na `input`, `textarea`, `select`.

- **Błąd w polu:** `aria-invalid="true"` na polu (albo klasa `pole-blad`) daje ramkę w kolorze błędu
  w każdym stanie, także po najechaniu i przy obrysie z klawiatury. Komunikat pod polem: klasa `pole-komunikat`
  (kolor błędu, tekst stopnia s), połączony z polem przez `aria-describedby`, żeby czytnik ekranu go przeczytał.
  Kolor roli `--kolor-blad` (klasy `text-blad`, `border-blad`) to czerwień niezależna od marki,
  co najmniej 4,5:1 do obu teł.

  ```tsx
  <a href="/kontakt" className="przycisk">Umów rozmowę</a>
  <button type="button" className="przycisk-drugi">Więcej</button>

  <label htmlFor="email">Adres e-mail</label>
  <input id="email" type="email" className="pole" placeholder="adres@przyklad.pl" />

  <label htmlFor="telefon">Telefon</label>
  <input id="telefon" type="tel" className="pole" aria-invalid="true" aria-describedby="telefon-blad" />
  <p id="telefon-blad" className="pole-komunikat">Wpisz 9 cyfr, np. 600 123 456.</p>
  ```
- **Strażnik:** `npm run skala` (jest też w `npm run lint`) wyłapuje liczby wpisane z ręki:
  `py-16`, `p-[37px]`, `text-2xl`, `bg-zinc-50`, `bg-[#abc]`, `dark:`, `rounded-lg`, `rounded-[8px]`,
  `shadow-md`, `shadow-[…]`, `border-2`, `padding: 16px`, `border-radius: 8px` i `box-shadow: 0 4px …` w CSS
  (także `*.module.css`), `style={{ padding: 16, borderRadius: 8 }}`. Podaje plik, linię i stopień do użycia.
  **Świadomy wyjątek:** w tej samej linii komentarz `skala-ok: <powód>`,
  np. `{/* skala-ok: baner partnera ma stałą wysokość */}`.
- **Warstwy (`@layer`): własne reguły bazowe strony wkładaj do `@layer base`.** Skala trzyma reset i reguły
  bazowe w warstwie `base`, a gotowe składniki (`.tresc`, `.przycisk`, `.pole`) w warstwie `components`.
  Reguła napisana luzem, poza warstwami, wygrywa z każdą regułą w warstwie, bez względu na swoistość.
  Zwykłe zerowanie odnośników `a { color: inherit }` wpisane luzem zabiera więc napis z `<a className="przycisk">`,
  a większa swoistość tego nie naprawi. Strażnik wyłapuje taką regułę (selektor bez klasy, np. `a`, `ul`, `*`,
  `html`, poza `@layer`) w plikach `.css` i w `<style>` plików `.astro`. Tak jest dobrze:

  ```css
  /* app/globals.css, pod importami */
  @layer base {
    a { color: inherit; text-decoration: none; }
    ul { list-style: none; }
  }
  ```

  Reguły z klasą (`.stopka a { … }`) i same zmienne (`:root { --moja: … }`) mogą zostać luzem.
- **Testy:** `npm test` (strażnik w obie strony, liczby skali i kształtów przy 320 i 1440 px, kontrast kolorów,
  przycisków marki i akcentu, pól, odcień szarości, granica małego tekstu, kaskada z warstwami).

---

## § 1 — Kiedy to już aplikacja (escape-hatch do pełnej ścieżki)

> **Preset `site-build` to przyspieszenie, NIE zamknięcie drzwi.**

Eskaluj do pełnej ścieżki (`/spec-draft <slug>`, Risk re-ewaluowany) przy **KTÓRYMKOLWIEK** z progów:

| Próg | Opis | Przykład |
|---|---|---|
| **Auth użytkowników końcowych** | Logowanie kont odbiorców/klientów | Sklep, panel subskrybentów |
| **RLS jako reguła biznesowa** | Polityki ponad `anon czyta published` | Dane prywatne per-user, role, widoczność warunkowa |
| **Płatności / kredyty / sklep** | Transakcje finansowe przez UI | Koszyk, bramka płatnicza, XpertHub |
| **Mutacje prod danych przez UI** | Upload przez klienta końcowego poza CMS | Komentarze publiczne, booking, webhooki sklepu |

**Granica PII:** zbieranie danych osobowych (formularz kontakt/newsletter/lead) **NIE eskaluje** do pełnej ścieżki — odpala **gate legal/backbone** (zgoda, privacy policy, retencja). Pełna ścieżka dopiero przy 4 progach wyżej.

**Tryby danych:**

| Tryb | Supabase | Service-role | Kiedy |
|---|---|---|---|
| `static` | usunięte (§2 opt-out) | — | Czysty HTML/CSS, zero danych |
| `public-data` | `lib/supabase/*` obecne | NIGDY w Vercel; `.env.local` + GH Actions | Anon czyta `published` |
| `editor-cms` | + panel edytora | jw. | + allowlista `is_editor()` |
| `app-escalated` | — | — | **→ ESCAPE-HATCH: pełna ścieżka** |

---

## § 2 — Static opt-out (tryb `static` — zero Supabase)

Jeśli wybierasz tryb `static` (brak danych, czyste HTML/CSS/JS), usuń warstwę Supabase:

**Pliki/sekcje do usunięcia:**
- `lib/supabase/` — cały katalog
- `supabase/` — cały katalog (`.gitkeep` + przyszłe migracje)
- `scripts/backup.mjs` + `.github/workflows/backup.yml`
- `next.config.ts` → usuń blok `images.remotePatterns`
- `package.json` → usuń `@supabase/supabase-js`, `@supabase/ssr`
- `.env.example` → usuń `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Weryfikacja po opt-out** — komenda zawężona do kodu/konfiguracji (celowo pomija `README.md`, żeby nie łapać własnych opisów):

```bash
rg "supabase|NEXT_PUBLIC_SUPABASE|remotePatterns" app components lib scripts next.config.* package.json .env.example
```

Oczekiwany wynik: **0 trafień**.

> Automatyczny opt-out (`/new-project --site` przy trybie `static`) dostępny w PHASE-3 factory-kit.
> W tej chwili wykonaj ręcznie powyższe kroki.

---

## § 3 — Wzorzec RLS i security Supabase

### Baseline (tryb `public-data`)

```sql
-- RLS włączone na każdej tabeli publicznej
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Anon czyta tylko opublikowane
CREATE POLICY "anon reads published"
  ON posts FOR SELECT
  TO anon
  USING (published = true);
```

### Rozszerzenie (tryb `editor-cms`)

```sql
-- Funkcja sprawdzająca allowlistę edytorów
CREATE OR REPLACE FUNCTION is_editor()
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.editors WHERE user_id = auth.uid()
  );
$$;

-- Edytor czyta wszystko (też unpublished)
CREATE POLICY "editor reads all"
  ON posts FOR SELECT
  TO authenticated
  USING (is_editor());

-- Edytor może pisać
CREATE POLICY "editor writes"
  ON posts FOR ALL
  TO authenticated
  USING (is_editor())
  WITH CHECK (is_editor());
```

### Service-role — twarda reguła

```
Runtime (Vercel Prod+Dev) → TYLKO publiczne:
  NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SENTRY_DSN

Operacyjne (NIGDY w Vercel) → lokalnie + GH Actions:
  SUPABASE_SERVICE_ROLE_KEY → .env.local + GitHub Actions secret
```

`SUPABASE_SERVICE_ROLE_KEY` **NIGDY** w `.env.example`, `.env.production`, ani w dashboardzie Vercel.
Dozwolony wyłącznie w `.env.local` (seed/backup lokalny) i jako GitHub Actions secret (workflow backup).

---

## Setup (po `gh repo create <projekt> --template tiolidigital/site-starter`)

1. `npm install`
2. Wypełnij `.env.local` (skopiuj `.env.example`, dodaj klucze)
3. Wypełnij placeholdery w `next.config.ts` (`{{SENTRY_ORG}}`, `{{SENTRY_PROJECT}}`)
4. Wypełnij `scripts/backup.mjs` (`TABLES`, `BUCKET`)
5. Ustaw harmonogram w `.github/workflows/backup.yml` (`{{CRON_SCHEDULE}}`)
6. `npm run build` — musi być zielony
7. `vercel link && vercel env pull` — połącz z projektem Vercel

## Backup (jeden bucket)

`scripts/backup.mjs` backupuje **jeden** bucket Storage. Dla wielu bucketów rozszerz pętlę `listAll` o tablicę.
Uruchom lokalnie: `node --env-file=.env.local scripts/backup.mjs`.
