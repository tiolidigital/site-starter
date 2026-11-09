// STRONA PRÓBNA SKALI – do usunięcia przed scaleniem albo przy starcie nowej strony
// (cały katalog app/skala-proba). Służy do obejrzenia i zmierzenia skali:
// elementy z atrybutem data-pomiar mają odstęp dokładnie na jednym stopniu.
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Strona próbna skali",
  robots: { index: false, follow: false },
};

const stopnie = ["xs", "s", "m", "l", "xl", "xxl"] as const;

// Pełne nazwy klas, żeby Tailwind je znalazł (nie składamy ich z kawałków).
const klasyOdstepu: Record<(typeof stopnie)[number], string> = {
  xs: "pt-xs",
  s: "pt-s",
  m: "pt-m",
  l: "pt-l",
  xl: "pt-xl",
  xxl: "pt-xxl",
};

const klasyTekstu: Record<(typeof stopnie)[number], string> = {
  xs: "text-xs",
  s: "text-s",
  m: "text-m",
  l: "text-l",
  xl: "text-xl",
  xxl: "text-xxl",
};

const kolory = [
  ["marka", "bg-marka"],
  ["marka-hover", "bg-marka-hover"],
  ["marka-jasny", "bg-marka-jasny"],
  ["marka-blady", "bg-marka-blady"],
  ["marka-ciemny", "bg-marka-ciemny"],
  ["tlo", "bg-tlo"],
  ["tlo-inne", "bg-tlo-inne"],
  ["tekst", "bg-tekst"],
  ["stonowany", "bg-stonowany"],
  ["obramowanie", "bg-obramowanie"],
] as const;

export default function SkalaProba() {
  return (
    <main className="flex flex-col">
      <section
        data-pomiar="sekcja-l"
        className="bg-marka-blady px-margines py-sekcja-l"
      >
        <div className="mx-auto max-w-strona">
          <h1>Strona próbna skali</h1>
          <p className="mt-s max-w-miara text-l text-stonowany">
            Nagłówki, tekst, listy i sekcje poniżej nie mają ani jednej liczby
            wpisanej z ręki. Zmień bazę w pliku skala.css, a zmieni się
            wszystko naraz.
          </p>
        </div>
      </section>

      <section data-pomiar="sekcja-m" className="px-margines py-sekcja-m">
        <article className="tresc mx-auto">
          <h2>Zwykły tekst wklejony do treści</h2>
          <p>
            Ten akapit nie ma żadnej klasy. Odstępy między akapitami, przed
            nagłówkami i między punktami listy daje jedna klasa na rodzicu.
            Zażółć gęślą jaźń: polskie litery mają się trzymać linii.
          </p>
          <p>
            Drugi akapit, z <a href="#odstepy">odnośnikiem w kolorze marki</a>{" "}
            i <strong>pogrubieniem</strong>. Długie wiersze kończą się przed
            granicą wygodnego czytania.
          </p>
          <h3>Lista punktowana</h3>
          <ul>
            <li>Pierwszy punkt listy.</li>
            <li>
              Drugi punkt, dłuższy, żeby było widać, jak tekst zawija się pod
              sobą, a nie pod kropką.
            </li>
            <li>Trzeci punkt listy.</li>
          </ul>
          <h3>Lista numerowana</h3>
          <ol>
            <li>Najpierw ustaw liczby wejściowe.</li>
            <li>Potem kolor marki.</li>
            <li>Na końcu kroje pisma.</li>
          </ol>
          <h4>Nagłówek czwartego stopnia</h4>
          <blockquote>
            Cytat wyróżniony wcięciem i stonowanym kolorem tekstu, bez paska z boku.
          </blockquote>
        </article>
      </section>

      <section
        id="odstepy"
        data-pomiar="sekcja-s"
        className="bg-tlo-inne px-margines py-sekcja-s"
      >
        <div className="mx-auto flex max-w-strona flex-col gap-m">
          <h2>Stopnie odstępów</h2>
          <div className="flex flex-wrap items-end gap-s">
            {stopnie.map((s) => (
              <div key={s} className="flex flex-col items-center gap-xs">
                <div
                  data-pomiar={`odstep-${s}`}
                  className={`w-m bg-marka ${klasyOdstepu[s]}`}
                />
                <span className="text-s text-stonowany">{s}</span>
              </div>
            ))}
          </div>

          <h2 className="mt-l">Stopnie tekstu</h2>
          <div className="flex flex-col gap-xs">
            {stopnie.map((s) => (
              <p key={s} data-pomiar={`tekst-${s}`} className={klasyTekstu[s]}>
                {s}: Zażółć gęślą jaźń
              </p>
            ))}
          </div>

          <h2 className="mt-l">Kolory według roli</h2>
          <div className="grid grid-cols-2 gap-s sm:grid-cols-5">
            {kolory.map(([nazwa, klasa]) => (
              <div key={nazwa} className="flex flex-col gap-xs">
                <div
                  className={`h-xl rounded-md border border-obramowanie ${klasa}`}
                />
                <span className="text-s text-stonowany">{nazwa}</span>
              </div>
            ))}
          </div>

          <div className="mt-m flex flex-wrap gap-s">
            <span className="rounded-md bg-marka px-s py-xs text-na-marce">
              Tekst na kolorze marki
            </span>
            <span className="rounded-md bg-marka-blady px-s py-xs text-marka-tekst">
              Kolor marki jako tekst
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
