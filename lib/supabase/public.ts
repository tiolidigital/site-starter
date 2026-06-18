import { createClient } from "@supabase/supabase-js";

// Publiczny klient read-only (anon key) — bez cookies, bez autoryzacji.
// Używaj do pobierania opublikowanych danych w Server Components / ISR.
// Tryby danych: public-data i editor-cms. Dla `static` — usuń lib/supabase/ (opt-out).
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } },
);
