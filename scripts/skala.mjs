#!/usr/bin/env node
// Strażnik skali – pilnuje, żeby odstępy, rozmiary tekstu, kolory, zaokrąglenia,
// cienie i grubość linii brały się ze skali (app/skala.css), a nie z liczb wpisanych z ręki.
//
// Uruchomienie: npm run skala   (też w ramach npm run lint)
// Wyjątek świadomy: w tej samej linii komentarz „skala-ok: <powód>”.
// Wyjście z kodem 1, gdy są naruszenia.
import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { pathToFileURL } from "node:url";

export const PLIK_SKALI = "app/skala.css";

const POMIJANE_KATALOGI = new Set([
  "node_modules",
  ".next",
  ".git",
  ".vercel",
  "out",
  "build",
  "dist",
  "public",
  "coverage",
]);
const ROZSZERZENIA_KODU = [".tsx", ".jsx", ".astro"];

// Stopnie przy domyślnych wejściach skali, na komputerze (px). Tylko do podpowiedzi.
const STOPNIE_ODSTEPU = { xs: 13, s: 20, m: 30, l: 45, xl: 68, xxl: 101 };
const STOPNIE_SEKCJI = { "sekcja-s": 60, "sekcja-m": 90, "sekcja-l": 135 };
const STOPNIE_TEKSTU = { xs: 12, s: 13.5, m: 18, l: 24, xl: 32, xxl: 42.6 };
const ROZMIARY_TAILWINDA = {
  sm: "s",
  base: "m",
  lg: "l",
  "2xl": "xl",
  "3xl": "xxl",
  "4xl": "xxl",
  "5xl": "xxl",
  "6xl": "xxl",
  "7xl": "xxl",
  "8xl": "xxl",
  "9xl": "xxl",
};
const RADA_KOLOR =
  "użyj koloru według roli: tlo, tlo-inne, tekst, stonowany, obramowanie, obramowanie-mocne, marka, marka-hover, marka-jasny, marka-blady, marka-ciemny, marka-tekst, na-marce (np. bg-tlo, text-stonowany)";

// Kształty przy domyślnych wejściach (px). Tylko do podpowiedzi.
const STOPNIE_ZAOKR = { s: 2, m: 4, l: 8 };
const ZAOKR_TAILWINDA = { xs: "s", sm: "s", md: "m", lg: "l", xl: "l", "2xl": "l", "3xl": "l", "4xl": "l" };
const CIEN_TAILWINDA = { "2xs": "s", xs: "s", sm: "s", md: "m", lg: "l", xl: "l", "2xl": "l" };
const RADA_LINIA = "użyj border-linia (grubość linii ze skali, wejście --grubosc-linii)";
const RADA_CIEN = "użyj shadow-s, shadow-m albo shadow-l (siła cienia ze skali, wejście --sila-cienia)";

const RE_ZAOKR = /^rounded(?:-(ss|se|es|ee|tl|tr|br|bl|s|e|t|r|b|l))?(?:-(.+))?$/;
const RE_CIEN = /^(shadow|inset-shadow|drop-shadow|text-shadow)(?:-(.+))?$/;
const RE_LINIA = /^border(?:-[xytrblse])?-(.+)$/;

// Sam procent (np. 50% na koło albo elipsę) to nie liczba ze skali.
function tylkoProcenty(wartosc) {
  return /^(\s*-?\d*\.?\d+%\s*)+(\/(\s*-?\d*\.?\d+%\s*)+)?$/.test(wartosc);
}

function radaZaokr(px, prefiks = "rounded") {
  if (px == null) return `użyj stopnia zaokrąglenia: ${prefiks}-s, -m, -l albo ${prefiks}-pelne (pigułka)`;
  if (px >= 100) return `użyj ${prefiks}-pelne (pigułka; na koło rounded-full)`;
  const [nazwa, wartosc] = najblizszy(px, STOPNIE_ZAOKR);
  return `użyj ${prefiks}-${nazwa} (ok. ${wartosc} px przy domyślnej bazie zaokrąglenia)`;
}

const RE_ODSTEP =
  /^(gap-x|gap-y|space-x|space-y|gap|p[xytrblse]?|m[xytrblse]?)-(.+)$/;
const RE_KOLOROWE =
  /^(bg|border(?:-[xytrblse])?|ring|ring-offset|outline|fill|stroke|from|via|to|divide|decoration|accent|caret|placeholder|shadow)-(.+)$/;
const PALETA =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|mauve|olive|mist|taupe";
const RE_PALETA = new RegExp(`^(${PALETA})-\\d+(/.*)?$`);
const RE_WYJATEK = /skala-ok:\s*(?!\*\/|-->|\}|$)\S/;

function bezZmiennych(wartosc) {
  return wartosc.replace(/var\(\s*--[\w-]+\s*(,[^)]*)?\)/g, "").replace(/\(--[\w-]+\)/g, "");
}

// Czy w wartości jest liczba inna niż samo 0 (np. „0 auto” przechodzi, „16px” nie).
function maLiczbe(wartosc) {
  const reszta = bezZmiennych(wartosc)
    .replace(/!important/g, "")
    .replace(/\*\s*-1\b/g, "") // odwrócenie stopnia: calc(var(--odstep-m) * -1)
    .replace(/(^|[^\w.])-?0(?![\w.])/g, "$1");
  return /\d/.test(reszta);
}

// Kolor wpisany liczbą: #abc albo rgb()/oklch()… z liczbami (nie ze zmiennymi).
function kolorWpisany(wartosc) {
  const v = bezZmiennych(wartosc);
  if (/#[0-9a-f]{3,8}\b/i.test(v)) return true;
  const re = /\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb|color)\(([^)]*)\)/gi;
  let m;
  while ((m = re.exec(v))) if (/\d/.test(m[1])) return true;
  return false;
}

function naPiksele(tekst) {
  const m = /^(-?\d*\.?\d+)(px|rem|em)?$/.exec(tekst.trim());
  if (!m) return null;
  const n = parseFloat(m[1]);
  return m[2] === "rem" || m[2] === "em" ? n * 16 : n;
}

function najblizszy(px, stopnie) {
  let najlepszy = null;
  for (const [nazwa, wartosc] of Object.entries(stopnie)) {
    if (!najlepszy || Math.abs(wartosc - px) < Math.abs(najlepszy[1] - px)) {
      najlepszy = [nazwa, wartosc];
    }
  }
  return najlepszy;
}

function radaOdstep(prefiks, px) {
  if (px == null) {
    return `użyj stopnia: ${prefiks}-xs, -s, -m, -l, -xl, -xxl albo ${prefiks}-sekcja-s/m/l`;
  }
  const pionowy = /^(p|m|py|my|pt|pb|mt|mb)$/.test(prefiks);
  const stopnie = pionowy && px >= 55 ? STOPNIE_SEKCJI : STOPNIE_ODSTEPU;
  const [nazwa, wartosc] = najblizszy(px, stopnie);
  return `użyj ${prefiks}-${nazwa} (ok. ${wartosc} px na komputerze, płynnie mniej na telefonie)`;
}

function radaTekst(px) {
  if (px == null) return "użyj stopnia tekstu: text-xs, text-s, text-m, text-l, text-xl, text-xxl";
  const [nazwa, wartosc] = najblizszy(px, STOPNIE_TEKSTU);
  return `użyj text-${nazwa} (ok. ${wartosc} px na komputerze)`;
}

// Sprawdza jedną klasę Tailwinda. Zwraca radę albo null, gdy klasa jest w porządku.
export function sprawdzKlase(klasa) {
  let k = klasa.replace(/^!|!$/g, "");
  // Warianty (md:, hover:, dark:) oddzielone dwukropkiem poza nawiasami.
  const czesci = [];
  let glebokosc = 0;
  let biezaca = "";
  for (const znak of k) {
    if (znak === "[" || znak === "(") glebokosc++;
    if (znak === "]" || znak === ")") glebokosc--;
    if (znak === ":" && glebokosc === 0) {
      czesci.push(biezaca);
      biezaca = "";
    } else {
      biezaca += znak;
    }
  }
  const warianty = czesci;
  k = biezaca.replace(/^!|!$/g, "").replace(/^-/, "");

  if (warianty.includes("dark")) {
    return "strony są zawsze jasne: usuń wariant dark:";
  }

  const zaokr = RE_ZAOKR.exec(k);
  if (zaokr) {
    if (/^rounded-(s|m|l|pelne|full|none)$/.test(k)) return null;
    const [, strona, wartosc] = zaokr;
    const prefiks = strona ? `rounded-${strona}` : "rounded";
    if (wartosc == null) return `użyj ${prefiks}-m (domyślne zaokrąglenie Tailwinda jest wyłączone)`;
    if (/^(s|m|l|pelne|full|none)$/.test(wartosc)) return null;
    if (ZAOKR_TAILWINDA[wartosc]) {
      return `użyj ${prefiks}-${ZAOKR_TAILWINDA[wartosc]} (domyślne zaokrąglenia Tailwinda są wyłączone)`;
    }
    const nawias = /^\[(.*)\]$/.exec(wartosc);
    if (nawias && maLiczbe(nawias[1]) && !tylkoProcenty(nawias[1].replace(/_/g, " "))) {
      return radaZaokr(naPiksele(nawias[1]), prefiks);
    }
    return null;
  }

  const cien = RE_CIEN.exec(k);
  if (cien) {
    const [, rodzaj, wartosc] = cien;
    if (wartosc == null) {
      return rodzaj === "shadow" ? `użyj shadow-m (domyślny cień Tailwinda jest wyłączony)` : RADA_CIEN;
    }
    if (wartosc === "none") return null;
    if (rodzaj === "shadow" && /^(s|m|l)$/.test(wartosc)) return null;
    if (CIEN_TAILWINDA[wartosc] || wartosc === "inner") {
      return rodzaj === "shadow" && CIEN_TAILWINDA[wartosc]
        ? `użyj shadow-${CIEN_TAILWINDA[wartosc]} (domyślne cienie Tailwinda są wyłączone)`
        : RADA_CIEN;
    }
    const nawias = /^\[(.*)\]$/.exec(wartosc);
    // Cień z liczbami (np. [0_1px_2px_#000]); sam kolor w nawiasie sprawdza niżej reguła kolorów.
    if (nawias && /[_\s]/.test(nawias[1].trim()) && maLiczbe(nawias[1].replace(/_/g, " "))) return RADA_CIEN;
    if (nawias && !kolorWpisany(nawias[1]) && maLiczbe(nawias[1])) return RADA_CIEN;
  }

  const linia = RE_LINIA.exec(k);
  if (linia) {
    const wartosc = linia[1];
    if (/^\d+$/.test(wartosc) && wartosc !== "0") return RADA_LINIA;
    const nawias = /^\[(.*)\]$/.exec(wartosc);
    if (nawias && !kolorWpisany(nawias[1]) && maLiczbe(nawias[1])) return RADA_LINIA;
  }

  const odstep = RE_ODSTEP.exec(k);
  if (odstep) {
    const [, prefiks, wartosc] = odstep;
    if (/^\d+(\.\d+)?$/.test(wartosc) && wartosc !== "0") {
      return radaOdstep(prefiks, parseFloat(wartosc) * 4);
    }
    if (wartosc === "px") return radaOdstep(prefiks, 1);
    const nawias = /^\[(.*)\]$/.exec(wartosc);
    if (nawias && maLiczbe(nawias[1])) {
      return radaOdstep(prefiks, naPiksele(nawias[1]));
    }
    return null;
  }

  const tekst = /^text-(.+)$/.exec(k);
  if (tekst) {
    const wartosc = tekst[1];
    if (ROZMIARY_TAILWINDA[wartosc]) {
      return `użyj text-${ROZMIARY_TAILWINDA[wartosc]} (domyślne rozmiary Tailwinda są wyłączone)`;
    }
    if (RE_PALETA.test(wartosc)) return RADA_KOLOR;
    const nawias = /^\[(.*)\]$/.exec(wartosc);
    if (nawias) {
      if (kolorWpisany(nawias[1])) return RADA_KOLOR;
      if (maLiczbe(nawias[1])) return radaTekst(naPiksele(nawias[1]));
    }
    return null;
  }

  const kolor = RE_KOLOROWE.exec(k);
  if (kolor) {
    const wartosc = kolor[2];
    if (RE_PALETA.test(wartosc)) return RADA_KOLOR;
    const nawias = /^\[(.*)\]$/.exec(wartosc);
    if (nawias && kolorWpisany(nawias[1])) return RADA_KOLOR;
    return null;
  }

  return null;
}

// Łańcuch wygląda jak lista klas (same małe litery, cyfry i znaki klas),
// a nie zwykły tekst, adres czy nazwa pliku.
function wygladaJakKlasy(tekst) {
  const tokeny = tekst.split(/\s+/).filter(Boolean);
  if (tokeny.length === 0) return false;
  return tokeny.every((t) =>
    /^[a-z0-9!:_\-/.%@*&>~+]+$/.test(t.replace(/\[[^\]]*\]/g, "").replace(/\([^)]*\)/g, "")),
  );
}

// Usuwa ${...} z szablonu (z zagnieżdżonymi klamrami). Zwraca tekst bez wstawek
// i listę wstawek [pozycja, treść], żeby sprawdzić też łańcuchy w ich środku.
function bezWstawek(tekst) {
  let wynik = "";
  const wstawki = [];
  let i = 0;
  while (i < tekst.length) {
    if (tekst[i] === "$" && tekst[i + 1] === "{") {
      const start = i + 2;
      let glebokosc = 0;
      while (i < tekst.length) {
        if (tekst[i] === "{") glebokosc++;
        if (tekst[i] === "}") {
          glebokosc--;
          if (glebokosc === 0) break;
        }
        i++;
      }
      wstawki.push([start, tekst.slice(start, i)]);
      wynik += " ".repeat(i + 1 - (start - 2));
      i++;
    } else {
      wynik += tekst[i];
      i++;
    }
  }
  return { wynik, wstawki };
}

function liniaZ(poczatkiLinii, indeks) {
  let lewo = 0;
  let prawo = poczatkiLinii.length - 1;
  while (lewo < prawo) {
    const srodek = (lewo + prawo + 1) >> 1;
    if (poczatkiLinii[srodek] <= indeks) lewo = srodek;
    else prawo = srodek - 1;
  }
  return lewo + 1;
}

function poczatki(tresc) {
  const wynik = [0];
  for (let i = 0; i < tresc.length; i++) if (tresc[i] === "\n") wynik.push(i + 1);
  return wynik;
}

const STYLE_ODSTEP = /^(padding\w*|margin\w*|gap|rowGap|columnGap|fontSize)$/;
const STYLE_ZAOKR = /^border\w*Radius$/;
const STYLE_CIEN = /^(boxShadow|textShadow)$/;
const RADA_CIEN_ZMIENNA = "użyj zmiennej cienia: var(--cien-s), var(--cien-m), var(--cien-l) (albo none)";

function radaZaokrZmienna(px) {
  if (px == null) return "użyj zmiennej zaokrąglenia: var(--zaokr-s), var(--zaokr-m), var(--zaokr-l), var(--zaokr-pelne)";
  if (px >= 100) return "użyj var(--zaokr-pelne) (pigułka; na koło 50%)";
  const [nazwa, wartosc] = najblizszy(px, STOPNIE_ZAOKR);
  return `użyj var(--zaokr-${nazwa}) (ok. ${wartosc} px przy domyślnej bazie zaokrąglenia)`;
}
const STYLE_KOLOR =
  /^(color|background|backgroundColor|border\w*Color|outlineColor|fill|stroke|accentColor|caretColor|textDecorationColor)$/;

function sprawdzKod(tresc, naruszenia) {
  const linie = poczatki(tresc);

  // 1. Klasy w łańcuchach znaków (także w środku wstawek ${...} szablonów).
  const skanujLancuchy = (fragment, przesuniecie) => {
    const reLancuch = /"([^"\n]*)"|'([^'\n]*)'|`([^`]*)`/g;
    let m;
    while ((m = reLancuch.exec(fragment))) {
      const surowy = m[1] ?? m[2] ?? m[3];
      const poczatek = przesuniecie + m.index + 1;
      const { wynik: czysty, wstawki } = bezWstawek(surowy);
      for (const [pozycja, wnetrze] of wstawki) skanujLancuchy(wnetrze, poczatek + pozycja);
      if (!wygladaJakKlasy(czysty)) continue;
      const reToken = /\S+/g;
      let t;
      while ((t = reToken.exec(czysty))) {
        const rada = sprawdzKlase(t[0]);
        if (rada) naruszenia.push({ linia: liniaZ(linie, poczatek + t.index), co: t[0], rada });
      }
    }
  };
  skanujLancuchy(tresc, 0);
  let m;

  // 2. Liczby w style={{ ... }}.
  const reStyl = /style=\{\{([\s\S]*?)\}\}/g;
  while ((m = reStyl.exec(tresc))) {
    const wnetrze = m[1];
    const poczatek = m.index + "style={{".length;
    const reWlasnosc = /([A-Za-z]+)\s*:\s*([^,\n}]+)/g;
    let w;
    while ((w = reWlasnosc.exec(wnetrze))) {
      const [, nazwa, surowa] = w;
      const wartosc = surowa.trim();
      const literal = /^-?\d*\.?\d+$/.test(wartosc) || /^["'`]/.test(wartosc);
      if (!literal) continue; // zmienna albo wyrażenie – nie zgadujemy
      const wnetrzeWartosci = wartosc.replace(/^["'`]|["'`]$/g, "");
      let rada = null;
      if (STYLE_ODSTEP.test(nazwa) && maLiczbe(wnetrzeWartosci)) {
        rada = nazwa === "fontSize"
          ? radaTekst(naPiksele(wnetrzeWartosci))
          : "użyj zmiennej skali, np. var(--odstep-m), var(--sekcja-m)";
      } else if (STYLE_ZAOKR.test(nazwa) && maLiczbe(wnetrzeWartosci) && !tylkoProcenty(wnetrzeWartosci)) {
        rada = radaZaokrZmienna(naPiksele(wnetrzeWartosci));
      } else if (STYLE_CIEN.test(nazwa) && maLiczbe(wnetrzeWartosci)) {
        rada = RADA_CIEN_ZMIENNA;
      } else if (STYLE_KOLOR.test(nazwa) && kolorWpisany(wnetrzeWartosci)) {
        rada = "użyj zmiennej koloru, np. var(--kolor-tekst), var(--kolor-marka)";
      }
      if (rada) {
        naruszenia.push({
          linia: liniaZ(linie, poczatek + w.index),
          co: `${nazwa}: ${wartosc}`,
          rada,
        });
      }
    }
  }
}

const CSS_ODSTEP = /^(padding(-[a-z-]+)?|margin(-[a-z-]+)?|gap|row-gap|column-gap|font-size)$/;
const CSS_ZAOKR = /^border(-[a-z]+)*-radius$/;
const CSS_CIEN = /^(box-shadow|text-shadow)$/;
const CSS_KOLOR =
  /^(color|background(-color)?|border(-[a-z-]+)?|outline(-color)?|fill|stroke|accent-color|caret-color|text-decoration-color|box-shadow)$/;

// Sprawdza CSS; przesuniecie = numer linii, od której zaczyna się fragment (dla .astro).
function sprawdzCss(tresc, naruszenia, przesuniecie = 0) {
  let wKomentarzu = false;
  tresc.split("\n").forEach((surowaLinia, i) => {
    // Komentarze /* */ wycinamy, także te na wiele linii.
    let linia = "";
    for (let j = 0; j < surowaLinia.length; j++) {
      if (!wKomentarzu && surowaLinia.startsWith("/*", j)) {
        wKomentarzu = true;
        j++;
      } else if (wKomentarzu && surowaLinia.startsWith("*/", j)) {
        wKomentarzu = false;
        j++;
      } else if (!wKomentarzu) {
        linia += surowaLinia[j];
      }
    }
    const numer = przesuniecie + i + 1;

    const apply = /@apply\s+([^;]+)/.exec(linia);
    if (apply) {
      for (const klasa of apply[1].trim().split(/\s+/)) {
        const rada = sprawdzKlase(klasa);
        if (rada) naruszenia.push({ linia: numer, co: klasa, rada });
      }
    }

    const reDeklaracja = /(?:^|[{;\s])([a-z-]+)\s*:\s*([^;{}]+)/g;
    let d;
    while ((d = reDeklaracja.exec(linia))) {
      const [, wlasnosc, surowa] = d;
      const wartosc = surowa.trim();
      let rada = null;
      if (CSS_ODSTEP.test(wlasnosc) && maLiczbe(wartosc)) {
        rada = wlasnosc === "font-size"
          ? radaTekst(naPiksele(wartosc))
          : "użyj zmiennej skali, np. var(--odstep-m), var(--sekcja-m), var(--margines)";
      } else if (CSS_ZAOKR.test(wlasnosc) && maLiczbe(wartosc) && !tylkoProcenty(bezZmiennych(wartosc))) {
        rada = radaZaokrZmienna(naPiksele(wartosc));
      } else if (CSS_CIEN.test(wlasnosc) && maLiczbe(wartosc)) {
        rada = RADA_CIEN_ZMIENNA;
      } else if (wlasnosc === "font" && /\d(px|rem|em|pt)\b/.test(bezZmiennych(wartosc))) {
        rada = "rozmiar w skrócie font: użyj var(--tekst-m) i pokrewnych";
      } else if (CSS_KOLOR.test(wlasnosc) && kolorWpisany(wartosc)) {
        rada = "użyj zmiennej koloru, np. var(--kolor-tekst), var(--kolor-obramowanie)";
      }
      if (rada) naruszenia.push({ linia: numer, co: `${wlasnosc}: ${wartosc}`, rada });
    }
  });
}

// Sprawdza treść jednego pliku. Zwraca listę { linia, co, rada }.
export function sprawdzPlik(sciezka, tresc) {
  const naruszenia = [];
  if (sciezka.endsWith(".css")) {
    sprawdzCss(tresc, naruszenia);
  } else {
    sprawdzKod(tresc, naruszenia);
    if (sciezka.endsWith(".astro")) {
      const reStyle = /<style[^>]*>([\s\S]*?)<\/style>/g;
      let m;
      while ((m = reStyle.exec(tresc))) {
        const start = m.index + m[0].indexOf(">") + 1;
        const linia = tresc.slice(0, start).split("\n").length - 1;
        sprawdzCss(m[1], naruszenia, linia);
      }
    }
  }
  const linie = tresc.split("\n");
  return naruszenia.filter((n) => !RE_WYJATEK.test(linie[n.linia - 1] ?? ""));
}

function* pliki(katalog, korzen) {
  for (const wpis of readdirSync(katalog, { withFileTypes: true })) {
    if (wpis.isDirectory()) {
      if (!POMIJANE_KATALOGI.has(wpis.name)) yield* pliki(join(katalog, wpis.name), korzen);
    } else if (wpis.isFile()) {
      const pelna = join(katalog, wpis.name);
      const wzgledna = relative(korzen, pelna).split(sep).join("/");
      if (wzgledna === PLIK_SKALI) continue;
      if (wpis.name.endsWith(".css") || ROZSZERZENIA_KODU.some((r) => wpis.name.endsWith(r))) {
        yield wzgledna;
      }
    }
  }
}

// Przegląda całe drzewo. Zwraca { przejrzane, naruszenia: [{ plik, linia, co, rada }] }.
export function skanuj(korzen) {
  const naruszenia = [];
  let przejrzane = 0;
  for (const plik of pliki(korzen, korzen)) {
    przejrzane++;
    const tresc = readFileSync(join(korzen, plik), "utf8");
    for (const n of sprawdzPlik(plik, tresc)) naruszenia.push({ plik, ...n });
  }
  return { przejrzane, naruszenia };
}

function odmiana(n) {
  if (n === 1) return "naruszenie";
  const d = n % 10;
  const s = n % 100;
  return d >= 2 && d <= 4 && (s < 12 || s > 14) ? "naruszenia" : "naruszeń";
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const korzen = process.argv[2] ?? process.cwd();
  const { przejrzane, naruszenia } = skanuj(korzen);
  if (naruszenia.length === 0) {
    console.log(`Strażnik skali: czysto (przejrzane pliki: ${przejrzane}).`);
  } else {
    console.error(`Strażnik skali: ${naruszenia.length} ${odmiana(naruszenia.length)}.\n`);
    for (const n of naruszenia) {
      console.error(`  ${n.plik}:${n.linia}  ${n.co}\n    → ${n.rada}`);
    }
    console.error(
      `\nStopnie i kolory są w ${PLIK_SKALI}. Wyjątek świadomy: dopisz w tej samej linii komentarz „skala-ok: <powód>”.`,
    );
    process.exitCode = 1;
  }
}
