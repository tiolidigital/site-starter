// Polska typografia na każdej stronie: sierotki, liczby z jednostką, półpauza, wdowy (Z343).
//
// Dwa sposoby użycia:
//   1. <Typografia /> w app/layout.tsx (components/Typografia.tsx): po załadowaniu strony poprawia
//      cały tekst na stronie, także ten z JSON-a i z CMS, bez ruszania komponentów. Domyślny sposób.
//   2. bezSierot(tekst) wprost, gdy tekst idzie poza stronę (meta description, mail, PDF)
//      albo gdy musi być poprawny już w HTML z serwera.
//
// Te same reguły ma factory-kit/scripts/typografia.js (strony statyczne), a factory-kit/scripts/bramka-strony.mjs
// je sprawdza. Zmiana reguły tutaj = zmiana tam (bramka pokaże rozjazd jako sierotki na stronie).

export const TWARDA_SPACJA = "\u00a0";

// Jednoliterowe słowo (a, i, o, u, w, z) nie zostaje na końcu wiersza. Poprzedzający znak sprawdza
// lookbehind, żeby dwa takie słowa z rzędu („i w relacjach”) dostały twardą spację oba (Z343).
// Koniec tekstu też się liczy: w „Spotkania w <strong>gabinecie</strong>” „w ” kończy osobny węzeł tekstu.
const JEDNOLITEROWE = /(?<=^|[\s(„"«'[])([aiouwzAIOUWZ])[ \t\n\r]+(?=\S|$)/g;

// Skróty, które nie zostają same na końcu wiersza: „nr 5”, „ul. Polna”, „ok. 20 osób”, „dr Kowalska”.
const SKROTY = /(?<=^|[\s(„"«'[])(nr|Nr|dr|Dr|mgr|prof\.|Prof\.|ul\.|al\.|pl\.|tel\.|godz\.|ok\.|św\.|im\.)[ \t\n\r]+(?=\S|$)/g;

// Liczba z jednostką razem: „420 m”, „30 zł”, „12 osób”. Ta sama lista co w bramce.
const JEDNOSTKI = "(?:m|km|cm|mm|ha|zł|PLN|kg|g|l|ml|min|h|s|°C?|%|r\\.|szt\\.|osób|os\\.)";
const LICZBA_JEDNOSTKA = new RegExp(`(\\d)[ \\t\\n\\r]+(${JEDNOSTKI})(?![\\p{L}])`, "gu");

// Półpauza i pauza we wtrąceniu nie zaczynają wiersza: „słowo – dalej” → twarda spacja przed kreską.
const KRESKA = /[ \t\n\r]+(?=[–—][ \t\n\r])/g;

export function bezSierot(tekst: string): string {
  return String(tekst)
    .replace(JEDNOLITEROWE, `$1${TWARDA_SPACJA}`)
    .replace(SKROTY, `$1${TWARDA_SPACJA}`)
    .replace(LICZBA_JEDNOSTKA, `$1${TWARDA_SPACJA}$2`)
    .replace(KRESKA, TWARDA_SPACJA);
}

// Wdowa: jedno słowo w ostatnim wierszu akapitu. CSS `text-wrap: pretty` (w app/skala.css) zdejmuje ją w Chrome
// i Safari, ale tylko przy krótkim ostatnim słowie: długie słowo z łącznikiem („poznawczo-behawioralną.”) zostaje
// samo albo łamie się na łączniku (zmierzone 11.11 na 14 szerokościach, Z343). Dlatego funkcja skleja dwa ostatnie
// słowa twardą spacją, a łącznik w ostatnim słowie dostaje niewidoczny znak bez łamania (U+2060), żeby
// „behawioralną.” nie zeszło samo. Para ma najwyżej `maks` znaków. <Typografia /> dodatkowo mierzy parę
// w przeglądarce i skleja ją tylko, gdy zajmuje najwyżej 90% szerokości akapitu, żeby nie wyszła poza kolumnę.
export const WDOWA_MAKS = 36;
const BEZ_LAMANIA = "\u2060";
const DWA_OSTATNIE = /([^ \t\n\r]+)[ \t\n\r]+([^ \t\n\r]+)([ \t\n\r]*)$/;

// Gdzie w tekście stoją dwa ostatnie słowa do sklejenia, albo null, gdy nie ma czego kleić.
// Słowo = ciąg bez zwykłych spacji. Ostatnie słowo już z twardą spacją („w\u00a0domu”) to dwa słowa: nic do roboty,
// a przy okazji drugi przebieg nic nie zmienia (MutationObserver nie wpada w pętlę).
export function paraNaKoncu(tekst: string, maks: number = WDOWA_MAKS): { od: number; do: number } | null {
  const m = DWA_OSTATNIE.exec(String(tekst));
  if (!m || m[2].includes(TWARDA_SPACJA)) return null;
  if (!/[\p{L}\p{N}]/u.test(m[1]) || !/[\p{L}\p{N}]/u.test(m[2])) return null;
  if (m[1].length + 1 + m[2].length > maks) return null;
  return { od: m.index, do: m.index + m[0].length - m[3].length };
}

export function bezWdowy(tekst: string, maks: number = WDOWA_MAKS): string {
  const t = String(tekst);
  if (!paraNaKoncu(t, maks)) return t;
  const m = DWA_OSTATNIE.exec(t)!;
  const ostatnie = m[2].replace(/-(?!\u2060)/g, "-" + BEZ_LAMANIA);
  return t.slice(0, m.index) + m[1] + TWARDA_SPACJA + ostatnie + m[3];
}

// Bloki, w których ostatni wiersz ma mieć co najmniej dwa słowa.
export const BLOKI_TEKSTU = "p, li, h1, h2, h3, h4, h5, h6, blockquote, figcaption, dd, dt";
// Tu tekstu się nie rusza: kod, pola, skrypty i wszystko oznaczone `data-bez-typografii`.
const POMIJANE = /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|TEXTAREA|CODE|PRE|KBD|SAMP|VAR)$/;

// Pomijany jest też tekst w innym języku: najbliższy atrybut `lang` musi zaczynać się od „pl”
// (strona dwujęzyczna, cytat po angielsku). Brak `lang` w ogóle = tekst polski.
function pomijany(wezel: Node): boolean {
  let jezyk: string | null = null;
  for (let el = wezel.parentElement; el; el = el.parentElement) {
    if (POMIJANE.test(el.tagName) || el.isContentEditable || el.hasAttribute("data-bez-typografii")) return true;
    if (jezyk === null && el.hasAttribute("lang")) jezyk = el.getAttribute("lang") ?? "";
  }
  return jezyk !== null && jezyk !== "" && !/^pl\b/i.test(jezyk);
}

// Poprawia tekst w poddrzewie strony. Zapisuje tylko wtedy, gdy coś się zmienia, więc wołanie drugi raz
// na tym samym tekście nic nie robi (MutationObserver w <Typografia /> nie wpada w pętlę).
export function poprawDrzewo(korzen: Node, { wdowy = true }: { wdowy?: boolean } = {}): number {
  const dok = korzen.ownerDocument ?? (korzen as Document);
  let zmiany = 0;
  const popraw = (n: Text, f: (t: string) => string) => {
    const stary = n.nodeValue ?? "";
    const nowy = f(stary);
    if (nowy !== stary) {
      n.nodeValue = nowy;
      zmiany++;
    }
  };
  if (korzen.nodeType === 3) {
    if (!pomijany(korzen)) popraw(korzen as Text, bezSierot);
    return zmiany;
  }
  const walker = dok.createTreeWalker(korzen, 4 /* NodeFilter.SHOW_TEXT */);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (n.nodeValue && /\s/.test(n.nodeValue) && !pomijany(n)) popraw(n as Text, bezSierot);
  }
  if (wdowy) {
    // Blok, w którym leży zmieniony tekst, i wszystkie bloki pod korzeniem.
    const el = korzen.nodeType === 1 ? (korzen as Element) : korzen.parentElement;
    const bloki = new Set<Element>();
    const wyzej = el?.closest(BLOKI_TEKSTU);
    if (wyzej) bloki.add(wyzej);
    if (korzen.nodeType === 1 || korzen.nodeType === 9) (korzen as Element).querySelectorAll(BLOKI_TEKSTU).forEach((b) => bloki.add(b));
    for (const blok of bloki) {
      if (blok.querySelector(BLOKI_TEKSTU)) continue; // tylko najgłębszy blok (li z akapitem → akapit)
      const w = dok.createTreeWalker(blok, 4);
      let ostatni: Text | null = null;
      for (let n = w.nextNode(); n; n = w.nextNode()) if (n.nodeValue?.trim()) ostatni = n as Text;
      if (!ostatni || pomijany(ostatni)) continue;
      const para = paraNaKoncu(ostatni.nodeValue ?? "");
      if (!para) continue;
      // Szerokość pary zmierzona w przeglądarce (suma kawałków, gdy dziś stoi na dwóch wierszach).
      const r = dok.createRange();
      r.setStart(ostatni, para.od);
      r.setEnd(ostatni, para.do);
      let szer = 0;
      for (const k of r.getClientRects()) szer += k.width;
      const cs = dok.defaultView?.getComputedStyle(blok);
      const wnetrze = (blok as HTMLElement).clientWidth - (cs ? parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) : 0);
      if (szer > 0 && wnetrze > 0 && szer <= wnetrze * 0.9) popraw(ostatni, (t) => bezWdowy(t));
    }
  }
  return zmiany;
}
