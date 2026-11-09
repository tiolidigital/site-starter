// Testy skali: strażnik (czerwono / zielono / wyjątek) oraz liczby z app/skala.css
// policzone przy 320 i 1440 px, łącznie z kontrastem kolorów.
// Uruchomienie: npm test
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { PLIK_SKALI, skanuj, sprawdzKlase, sprawdzPlik } from "./skala.mjs";

const KORZEN = join(dirname(fileURLToPath(import.meta.url)), "..");
const STRAZNIK = join(KORZEN, "scripts", "skala.mjs");
const CSS_SKALI = readFileSync(join(KORZEN, PLIK_SKALI), "utf8");

// ---------- Strażnik ----------

test("strażnik łapie odstępy i rozmiary spoza skali", () => {
  for (const klasa of ["py-16", "gap-4", "mt-2.5", "-mx-8", "md:p-6", "p-px", "p-[37px]", "gap-x-[2rem]", "text-2xl", "text-sm", "text-base", "text-[22px]"]) {
    assert.ok(sprawdzKlase(klasa), `powinno złapać ${klasa}`);
  }
});

test("strażnik łapie kolory wpisane liczbą i paletę Tailwinda", () => {
  for (const klasa of ["bg-[#abc]", "text-[#383838]", "border-[rgb(0_0_0)]", "bg-zinc-50", "text-zinc-600", "hover:bg-[#1a1a1a]", "border-gray-200/50"]) {
    assert.ok(sprawdzKlase(klasa), `powinno złapać ${klasa}`);
  }
});

test("strażnik łapie wariant dark:", () => {
  assert.ok(sprawdzKlase("dark:bg-black"));
  assert.ok(sprawdzKlase("md:dark:text-tekst"));
});

test("strażnik przepuszcza stopnie skali i jawne wyjątki", () => {
  for (const klasa of [
    "p-m", "px-margines", "py-sekcja-m", "gap-l", "gap-x-xs", "-mt-s", "mx-auto", "p-0", "gap-0", "m-0",
    "text-xs", "text-s", "text-m", "text-l", "text-xl", "text-xxl", "text-tekst", "text-stonowany",
    "text-center", "text-na-marce", "bg-marka", "hover:bg-marka-hover", "border-obramowanie", "bg-tekst/5",
    "p-[var(--odstep-m)]", "p-(--odstep-m)", "w-[158px]", "h-12", "rounded-full", "leading-8", "border",
    "bg-[url(/tlo.png)]", "text-black", "bg-white",
  ]) {
    assert.equal(sprawdzKlase(klasa), null, `nie powinno łapać ${klasa}`);
  }
});

test("strażnik podpowiada stopień", () => {
  assert.match(sprawdzKlase("py-16"), /py-sekcja-s/);
  assert.match(sprawdzKlase("gap-4"), /gap-xs/);
  assert.match(sprawdzKlase("text-2xl"), /text-xl/);
  assert.match(sprawdzKlase("bg-[#abc]"), /bg-tlo/);
});

test("strażnik w .tsx czyta klasy, a nie zwykły tekst", () => {
  const kod = [
    'export const A = () => (',
    '  <div className="flex py-16 gap-m">', // 2: naruszenie
    '    <p>Zwykły tekst o text-2xl i py-16 nie jest klasą.</p>',
    '    <a href="https://example.com/?p-4=1" title="Pole gap-4 w zdaniu">x</a>',
    '    <span className={`rounded ${a ? "text-sm" : ""} p-6`} />', // 5: dwa naruszenia
    '    <i style={{ padding: 16, color: "#fff", margin: "var(--odstep-m)", fontSize: rozmiar }} />', // 6: dwa
    '  </div>',
    ');',
    'const warianty = { duzy: "px-8 text-tekst" };', // 9: naruszenie
  ].join("\n");
  const wynik = sprawdzPlik("app/x.tsx", kod).map((n) => `${n.linia}:${n.co}`).sort();
  assert.deepEqual(wynik, ["2:py-16", "5:p-6", "5:text-sm", "6:color: \"#fff\"", "6:padding: 16", "9:px-8"].sort());
});

test("strażnik w .css łapie liczby w odstępach, czcionkach i kolorach", () => {
  const css = [
    ".a { padding: 16px; }", // 1
    ".b { margin: 0 auto; gap: var(--odstep-m); }",
    ".c { font-size: 22px; }", // 3
    ".d { color: #333; border: 1px solid var(--kolor-obramowanie); }", // 4
    "/* padding: 99px w komentarzu się nie liczy */",
    ".e { background-color: oklch(0.5 0.1 200); }", // 6
    ".f { margin-top: calc(var(--odstep-m) * -1); color: var(--kolor-tekst); }",
    ".g { @apply px-4 py-sekcja-m; }", // 8
    ".h { border: 1px solid #ccc; }", // 9
    "  --wlasna: 12px;",
  ].join("\n");
  const wynik = sprawdzPlik("app/x.module.css", css).map((n) => n.linia);
  assert.deepEqual(wynik, [1, 3, 4, 6, 8, 9]);
});

test("strażnik w .astro sprawdza klasy i blok <style>", () => {
  const astro = ["---", "---", '<div class="py-16">x</div>', "<style>", "  .x { padding: 12px; }", "</style>"].join("\n");
  assert.deepEqual(sprawdzPlik("src/x.astro", astro).map((n) => n.linia).sort(), [3, 5]);
});

test("wyjątek skala-ok z powodem przechodzi, bez powodu nie", () => {
  const zPowodem = '<div className="py-16" /> {/* skala-ok: baner partnera ma stałą wysokość */}';
  const bezPowodu = '<div className="py-16" /> {/* skala-ok: */}';
  assert.equal(sprawdzPlik("a.tsx", zPowodem).length, 0);
  assert.equal(sprawdzPlik("a.tsx", bezPowodu).length, 1);
  assert.equal(sprawdzPlik("a.css", ".a { padding: 7px; } /* skala-ok: ikona */").length, 0);
});

test("czysty szablon przechodzi strażnika", () => {
  const { przejrzane, naruszenia } = skanuj(KORZEN);
  assert.ok(przejrzane >= 5, `przejrzane pliki: ${przejrzane}`);
  assert.deepEqual(naruszenia, []);
});

test("polecenie: kod 1 przy naruszeniu, 0 na czysto, plik skali pominięty", () => {
  const katalog = mkdtempSync(join(tmpdir(), "skala-"));
  try {
    mkdirSync(join(katalog, "app"));
    writeFileSync(join(katalog, "app", "skala.css"), ".x { padding: 99px; }");
    writeFileSync(join(katalog, "app", "page.tsx"), 'export default () => <div className="p-m" />;');
    let wynik = spawnSync(process.execPath, [STRAZNIK, katalog], { encoding: "utf8" });
    assert.equal(wynik.status, 0, wynik.stderr);
    assert.match(wynik.stdout, /czysto/);

    writeFileSync(join(katalog, "app", "page.tsx"), 'export default () => <div className="p-[37px]" />;');
    wynik = spawnSync(process.execPath, [STRAZNIK, katalog], { encoding: "utf8" });
    assert.equal(wynik.status, 1);
    assert.match(wynik.stderr, /app\/page\.tsx:1 {2}p-\[37px\]/);
    assert.match(wynik.stderr, /skala-ok/);
  } finally {
    rmSync(katalog, { recursive: true, force: true });
  }
});

// ---------- Liczby skali ----------

// Zmienne z bloku :root pliku skali (z możliwością podmiany wejść).
function zmienne(css, podmiany = {}) {
  const root = /:root\s*\{([\s\S]*?)\n\}/.exec(css)[1].replace(/\/\*[\s\S]*?\*\//g, "");
  const wynik = {};
  for (const deklaracja of root.split(";")) {
    const m = /^\s*(--[\w-]+)\s*:\s*([\s\S]+?)\s*$/.exec(deklaracja);
    if (m) wynik[m[1]] = m[2];
  }
  return { ...wynik, ...podmiany };
}

function rozwin(wyrazenie, zm, glebokosc = 0) {
  assert.ok(glebokosc < 30, "za głębokie zmienne");
  return wyrazenie.replace(/var\((--[\w-]+)\)/g, (_, nazwa) => {
    assert.ok(nazwa in zm, `brak zmiennej ${nazwa}`);
    return `(${rozwin(zm[nazwa], zm, glebokosc + 1)})`;
  });
}

// Liczy wyrażenie CSS (calc/clamp/min/max, px/rem/vw) w pikselach przy szerokości ekranu.
function policz(wyrazenie, szerokosc) {
  let e = wyrazenie
    .replace(/(\d*\.?\d+)(px|rem|vw)\b/g, (_, n, j) => `(${n}*${j === "px" ? 1 : j === "rem" ? 16 : szerokosc / 100})`)
    .replace(/\bcalc\(/g, "(")
    .replace(/\bclamp\(/g, "K(")
    .replace(/\bmin\(/g, "Math.min(")
    .replace(/\bmax\(/g, "Math.max(");
  assert.match(e.replace(/Math\.(min|max)|K/g, ""), /^[\d\s.+\-*/(),]*$/, `nieznane wyrażenie: ${e}`);
  return Function("K", `return ${e}`)((a, b, c) => Math.max(a, Math.min(b, c)));
}

function wartosc(nazwa, szerokosc, podmiany) {
  const zm = zmienne(CSS_SKALI, podmiany);
  return policz(rozwin(`var(${nazwa})`, zm), szerokosc);
}

const blisko = (a, b, opis) => assert.ok(Math.abs(a - b) < 0.05, `${opis}: ${a.toFixed(2)} zamiast ${b}`);

test("skala na krańcach: telefon 320 px i komputer 1440 px", () => {
  const oczekiwane = {
    "--odstep-m": [24, 30],
    "--odstep-s": [24 / 1.333, 20],
    "--odstep-l": [24 * 1.333, 45],
    "--odstep-xxl": [24 * 1.333 ** 3, 30 * 1.5 ** 3],
    "--sekcja-m": [48, 90],
    "--sekcja-s": [2 * 24 / 1.333, 60],
    "--sekcja-l": [2 * 24 * 1.333, 135],
    "--margines": [16, 80],
    "--tekst-m": [17, 18],
    "--tekst-l": [17 * 1.2, 18 * 1.333],
    "--tekst-xxl": [17 * 1.2 ** 3, 18 * 1.333 ** 3],
  };
  for (const [nazwa, [tel, pc]] of Object.entries(oczekiwane)) {
    blisko(wartosc(nazwa, 320), tel, `${nazwa} przy 320`);
    blisko(wartosc(nazwa, 1440), pc, `${nazwa} przy 1440`);
    // Poza zakresem wartości się nie rozjeżdżają.
    blisko(wartosc(nazwa, 280), tel, `${nazwa} przy 280`);
    blisko(wartosc(nazwa, 2560), pc, `${nazwa} przy 2560`);
  }
});

test("skala płynie między telefonem a komputerem", () => {
  const srodek = wartosc("--odstep-m", 880);
  blisko(srodek, 27, "--odstep-m przy 880");
  let poprzedni = 0;
  for (const s of ["xs", "s", "m", "l", "xl", "xxl"]) {
    const v = wartosc(`--odstep-${s}`, 880);
    assert.ok(v > poprzedni, `stopnie rosną: ${s}`);
    poprzedni = v;
  }
});

test("tekst nigdy poniżej 12 px, treść na telefonie co najmniej 17 px", () => {
  for (const szerokosc of [280, 320, 375, 768, 1024, 1440, 1920]) {
    for (const s of ["xs", "s", "m", "l", "xl", "xxl"]) {
      assert.ok(wartosc(`--tekst-${s}`, szerokosc) >= 12, `--tekst-${s} przy ${szerokosc}`);
    }
    assert.ok(wartosc("--tekst-m", szerokosc) >= 17, `--tekst-m przy ${szerokosc}`);
  }
  // Bez twardego dołu xs na telefonie miałby ok. 11,8 px, a na komputerze ok. 10,1 px.
  blisko(wartosc("--tekst-xs", 320), 12, "--tekst-xs przy 320");
  blisko(wartosc("--tekst-xs", 1440), 12, "--tekst-xs przy 1440");
});

test("zmiana samej liczby bazowej zmienia odstępy całej strony", () => {
  const podmiany = { "--baza-odstep-pc": "40", "--baza-odstep-tel": "28" };
  blisko(wartosc("--odstep-m", 1440, podmiany), 40, "--odstep-m");
  blisko(wartosc("--odstep-l", 1440, podmiany), 60, "--odstep-l");
  blisko(wartosc("--sekcja-m", 1440, podmiany), 120, "--sekcja-m");
  blisko(wartosc("--sekcja-m", 320, podmiany), 56, "--sekcja-m tel");
  // Tekst i margines zostają bez zmian.
  blisko(wartosc("--tekst-m", 1440, podmiany), 18, "--tekst-m");
  blisko(wartosc("--margines", 1440, podmiany), 80, "--margines");
});

test("Tailwind dostaje stopnie, a domyślne rozmiary tekstu są wyłączone", () => {
  const motyw = /@theme inline\s*\{([\s\S]*?)\n\}/.exec(CSS_SKALI)[1];
  for (const klucz of ["--spacing-m", "--spacing-sekcja-m", "--spacing-margines", "--text-l", "--color-marka", "--color-tlo"]) {
    assert.match(motyw, new RegExp(`${klucz}:`), klucz);
  }
  assert.match(motyw, /--text-\*: initial;/);
});

test("jasny motyw na sztywno: brak ciemnego w stylach i klasach", () => {
  const globalny = readFileSync(join(KORZEN, "app", "globals.css"), "utf8");
  assert.doesNotMatch(globalny + CSS_SKALI, /prefers-color-scheme/);
  assert.match(CSS_SKALI, /color-scheme: light/);
  const { naruszenia } = skanuj(KORZEN);
  assert.equal(naruszenia.filter((n) => n.co.includes("dark:")).length, 0);
});

// ---------- Kontrast kolorów ----------

function argumentyOklch(wyrazenie) {
  const m = /oklch\(([\s\S]*)\)\s*$/.exec(wyrazenie.trim());
  assert.ok(m, `to nie oklch: ${wyrazenie}`);
  const czesci = [];
  let glebokosc = 0;
  let biezaca = "";
  for (const znak of m[1].trim()) {
    if (znak === "(") glebokosc++;
    if (znak === ")") glebokosc--;
    if (/\s/.test(znak) && glebokosc === 0) {
      if (biezaca) czesci.push(biezaca);
      biezaca = "";
    } else {
      biezaca += znak;
    }
  }
  if (biezaca) czesci.push(biezaca);
  assert.equal(czesci.length, 3, `oklch ma 3 składowe: ${m[1]}`);
  return czesci.map((c) => policz(c, 1440));
}

function liniowyRgb(L, C, h) {
  const a = C * Math.cos((h * Math.PI) / 180);
  const b = C * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

// Luminancja WCAG; kolor spoza sRGB przycinany jak w przeglądarce (mniejsze nasycenie, ta sama jasność).
function luminancja([L, C, h]) {
  L = Math.min(1, Math.max(0, L));
  const wGamucie = (c) => liniowyRgb(L, c, h).every((x) => x >= -1e-4 && x <= 1 + 1e-4);
  let c = C;
  if (!wGamucie(c)) {
    let dol = 0;
    let gora = C;
    for (let i = 0; i < 30; i++) {
      const srodek = (dol + gora) / 2;
      if (wGamucie(srodek)) dol = srodek;
      else gora = srodek;
    }
    c = dol;
  }
  const [r, g, b] = liniowyRgb(L, c, h).map((x) => Math.min(1, Math.max(0, x)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function kontrast(kolorA, kolorB, podmiany) {
  const zm = zmienne(CSS_SKALI, podmiany);
  const ya = luminancja(argumentyOklch(rozwin(zm[kolorA], zm)));
  const yb = luminancja(argumentyOklch(rozwin(zm[kolorB], zm)));
  return (Math.max(ya, yb) + 0.05) / (Math.min(ya, yb) + 0.05);
}

const MARKI = {
  "domyślna (niebieska)": {},
  "skrajnie jasna (żółta)": { "--marka-l": "0.92", "--marka-c": "0.18", "--marka-h": "100" },
  "skrajnie ciemna (fiolet)": { "--marka-l": "0.2", "--marka-c": "0.1", "--marka-h": "290" },
  "nasycona czerwień": { "--marka-l": "0.6", "--marka-c": "0.24", "--marka-h": "28" },
};

const PARY = [
  ["--kolor-tekst", "--kolor-tlo", 7],
  ["--kolor-tekst", "--kolor-tlo-inne", 7],
  ["--kolor-stonowany", "--kolor-tlo", 4.5],
  ["--kolor-stonowany", "--kolor-tlo-inne", 4.5],
  ["--kolor-marka-tekst", "--kolor-tlo", 4.5],
  ["--kolor-marka-tekst", "--kolor-marka-blady", 4.5],
  ["--kolor-na-marce", "--kolor-marka", 4.5],
  ["--kolor-tekst", "--kolor-marka-jasny", 4.5],
];

test("kontrast ról: domyślna marka i skrajne", (t) => {
  for (const [nazwa, podmiany] of Object.entries(MARKI)) {
    for (const [a, b, prog] of PARY) {
      const k = kontrast(a, b, podmiany);
      t.diagnostic(`${nazwa}: ${a} na ${b} = ${k.toFixed(2)}`);
      assert.ok(k >= prog, `${nazwa}: ${a} na ${b} ma ${k.toFixed(2)}, wymagane ${prog}`);
    }
  }
});

// Dokładna wersja z @supports: kanały r, g, b liniowego sRGB podstawione do wzoru z CSS.
function naMarceDokladnie(podmiany) {
  const zm = zmienne(CSS_SKALI, podmiany);
  const blok = /@supports[^{]*\{\s*:root\s*\{\s*--kolor-na-marce:\s*color\(\s*from var\(--kolor-marka\) srgb-linear([\s\S]*?)\);/.exec(CSS_SKALI);
  assert.ok(blok, "brak dokładnej wersji --kolor-na-marce w @supports");
  const [L, C, h] = argumentyOklch(rozwin(zm["--kolor-marka"], zm));
  const [r, g, b] = liniowyRgb(L, C, h);
  const kanaly = blok[1].trim().split(/\n\s*/);
  assert.equal(kanaly.length, 3);
  const szary = policz(kanaly[0].replace(/\br\b/g, `(${r})`).replace(/\bg\b/g, `(${g})`).replace(/\bb\b/g, `(${b})`), 1440);
  return 0.2126 * szary + 0.7152 * szary + 0.0722 * szary; // szary: luminancja = kanał
}

function przemiatanieMarek(sprawdz) {
  const slabe = [];
  for (let l = 0.2; l <= 0.95; l += 0.01) {
    for (const h of [30, 100, 145, 200, 255, 320]) {
      for (const c of [0.04, 0.12, 0.2]) {
        const podmiany = { "--marka-l": l.toFixed(2), "--marka-c": String(c), "--marka-h": String(h) };
        const k = sprawdz(podmiany);
        if (k < 4.5) slabe.push(`L ${l.toFixed(2)} C ${c} H ${h}: ${k.toFixed(2)}`);
      }
    }
  }
  return slabe;
}

test("tekst na kolorze marki czytelny przy każdej jasności marki (wersja dokładna)", () => {
  const slabe = przemiatanieMarek((podmiany) => {
    const zm = zmienne(CSS_SKALI, podmiany);
    const yMarki = luminancja(argumentyOklch(rozwin(zm["--kolor-marka"], zm)));
    const yTekstu = naMarceDokladnie(podmiany);
    return (Math.max(yMarki, yTekstu) + 0.05) / (Math.min(yMarki, yTekstu) + 0.05);
  });
  assert.deepEqual(slabe, []);
});

test("wersja zgrubna (stare przeglądarki) słaba tylko w wąskim pasie jasności 0,55–0,59", (t) => {
  const slabe = przemiatanieMarek((podmiany) => kontrast("--kolor-na-marce", "--kolor-marka", podmiany));
  t.diagnostic(`zgrubnie poniżej 4,5: ${slabe.length} z ${76 * 18} próbek`);
  for (const wpis of slabe) {
    const l = parseFloat(wpis.slice(2));
    assert.ok(l >= 0.55 && l <= 0.59, wpis);
    assert.ok(parseFloat(wpis.split(": ")[1]) >= 3.9, wpis);
  }
});

// ---------- Nagłówki kontra reset Tailwinda ----------

// Reguły najwyższego poziomu z bloku @layer <nazwa> { … } (selektor + deklaracje).
function regulyWarstwy(css, warstwa) {
  const bez = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const start = bez.indexOf(`@layer ${warstwa} {`);
  assert.ok(start >= 0, `brak @layer ${warstwa}`);
  let glebokosc = 1;
  let bufor = "";
  const reguly = [];
  for (let i = bez.indexOf("{", start) + 1; i < bez.length && glebokosc > 0; i++) {
    const znak = bez[i];
    if (znak === "{") {
      glebokosc++;
      if (glebokosc === 2) {
        reguly.push({ selektor: bufor.trim(), deklaracje: "" });
        bufor = "";
      }
      continue;
    }
    if (znak === "}") {
      glebokosc--;
      continue;
    }
    if (glebokosc === 2) reguly[reguly.length - 1].deklaracje += znak;
    else if (glebokosc === 1) bufor += znak;
  }
  return reguly;
}

// Reguły nagłówków (h1–h6) z wielkością albo grubością, które stoją w :where(),
// czyli mają wagę zero i przegrywają z resetem Tailwinda w tej samej warstwie.
function naglowkiWWhere(css) {
  return regulyWarstwy(css, "base").filter(
    (r) => /\bh[1-6]\b/.test(r.selektor) && /font-(size|weight)\s*:/.test(r.deklaracje) && r.selektor.includes(":where("),
  );
}

test("wielkość i grubość nagłówków nie stoi w :where() (wygrywa z resetem Tailwinda)", () => {
  // Fragment starej wersji (commit 32844ce): ten sam sprawdzian musi ją odrzucić.
  const staraWersja = [
    "@layer base {",
    "  :where(h1, h2, h3, h4, h5, h6) {",
    "    font-weight: 650;",
    "  }",
    "  :where(h1) { font-size: var(--tekst-xxl); }",
    "}",
  ].join("\n");
  assert.equal(naglowkiWWhere(staraWersja).length, 2, "sprawdzian nie łapie starej wersji");

  assert.deepEqual(naglowkiWWhere(CSS_SKALI).map((r) => r.selektor), []);
  const reguly = regulyWarstwy(CSS_SKALI, "base");
  for (const [h, stopien] of [["h1", "xxl"], ["h2", "xl"], ["h3", "l"], ["h4", "m"]]) {
    const regula = reguly.find(
      (r) => r.selektor.split(",").map((s) => s.trim()).includes(h) && r.deklaracje.includes("font-size"),
    );
    assert.ok(regula, `brak wielkości dla ${h}`);
    assert.match(regula.deklaracje, new RegExp(`font-size:\\s*var\\(--tekst-${stopien}\\)`), h);
  }
  assert.ok(
    reguly.some((r) => r.selektor.split(",").map((s) => s.trim()).includes("h1") && /font-weight:\s*\d/.test(r.deklaracje)),
    "brak grubości nagłówków",
  );
});

test("w warstwie base żadna reguła nie stoi w :where() (ten sam konflikt z resetem)", () => {
  const zWhere = regulyWarstwy(CSS_SKALI, "base").filter((r) => r.selektor.includes(":where("));
  assert.deepEqual(zWhere.map((r) => r.selektor), []);
});

test("cytat bez kolorowego paska z boku", () => {
  const cytat = regulyWarstwy(CSS_SKALI, "components").filter((r) => /blockquote/.test(r.selektor));
  assert.ok(cytat.length > 0, "brak stylu cytatu");
  for (const r of cytat) assert.doesNotMatch(r.deklaracje, /border/, r.selektor);
});
