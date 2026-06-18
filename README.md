# site-starter

Skeleton Next.js 16 + Tailwind v4 + Supabase + Sentry dla ścieżki **site-build** factory-kit.

> Wygenerowany z `gh repo create <projekt> --template tiolidigital/site-starter`.
> Uzupełnij placeholdery (`{{SENTRY_ORG}}`, `{{SENTRY_PROJECT}}`, `TABLES`, `BUCKET`) i przejdź `/new-project --site`.

## Stack

- **Next.js 16** App Router, TypeScript, Fluid Compute (Vercel)
- **Tailwind v4** token-first (`@theme` w `globals.css`)
- **Supabase** — `lib/supabase/{client,server,public}.ts` (tryby danych: §1)
- **Sentry** — manual wiring (`instrumentation.ts` + konfigi)
- **Backup** — darmowy backup logiczny (`scripts/backup.mjs` + `.github/workflows/backup.yml`)
- **Node 24** LTS (`.nvmrc`)

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
