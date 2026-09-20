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
