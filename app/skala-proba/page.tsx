// STRONA PRÓBNA SKALI (część 3: tytuł, nagłówki, grubości, akcent, dolna granica tekstu,
// warstwy) – do usunięcia przed scaleniem (cały katalog app/skala-proba). Elementy
// z atrybutem data-stan dostają w zrzutach wymuszony stan (hover albo focus-visible).
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import "./proba.css";

export const metadata: Metadata = {
  title: "Strona próbna skali: część 3",
  robots: { index: false, follow: false },
};

const stany = [
  ["zwykły", undefined, false],
  ["najechany", "hover", false],
  ["fokus z klawiatury", "focus", false],
  ["wyłączony", undefined, true],
] as const;

const przyciski = [
  ["Marka (.przycisk)", "przycisk"],
  ["Akcent (.przycisk-akcent), tu bursztyn z proba.css", "przycisk-akcent"],
] as const;

const stopnie = [
  ["text-xs", "text-xs"],
  ["text-s", "text-s"],
  ["text-m", "text-m"],
] as const;

export default function SkalaProba() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="px-margines py-sekcja-l">
        <div className="mx-auto flex max-w-strona flex-col gap-m">
          <p className="text-s text-stonowany">Tytuł pierwszego ekranu (klasa text-tytul)</p>
          <h1 className="text-tytul">Szafy na wymiar z jednego warsztatu</h1>
          <p className="max-w-miara text-l text-stonowany">
            Tytuł ma własny stopień ponad xxl (wejścia --baza-tytul-tel i --baza-tytul-pc).
            Zwykły h1 zostaje przy xxl, dopóki --naglowek-1 tego nie zmieni.
          </p>
        </div>
      </section>

      <section className="bg-tlo-inne px-margines py-sekcja-m">
        <div className="tresc mx-auto">
          <h1>Nagłówek h1 (domyślnie xxl)</h1>
          <p>
            Akapit treści w stopniu m. Wyróżnienie <strong>w grubości mocnej</strong> bierze się
            z wejścia --grubosc-mocna, a nagłówki z --grubosc-naglowki.
          </p>
          <h2>Nagłówek h2 (domyślnie xl)</h2>
          <p>Nagłówki biorą stopnie z wejść --naglowek-1, --naglowek-2 i --naglowek-3.</p>
          <h3>Nagłówek h3 (domyślnie l)</h3>
          <p>Treść pod nagłówkiem trzeciego stopnia.</p>
        </div>
      </section>

      <section className="px-margines py-sekcja-m">
        <div className="mx-auto flex max-w-strona flex-col gap-m">
          <h2>Mały tekst: dolna granica 15 px</h2>
          {stopnie.map(([nazwa, klasa]) => (
            <p key={nazwa} className={klasa}>
              {nazwa}: dopisek pod formularzem i zgoda na kontakt nie schodzą poniżej granicy.
            </p>
          ))}
        </div>
      </section>

      <section className="px-margines py-sekcja-m">
        <div className="mx-auto flex max-w-strona flex-col gap-l">
          <h2>Przyciski marki i akcentu</h2>
          {przyciski.map(([nazwa, klasa]) => (
            <div key={klasa} className="flex flex-col gap-s">
              <h3>{nazwa}</h3>
              <div className="flex flex-wrap gap-s">
                {stany.map(([stan, wymus, wylaczony]) => (
                  <button key={stan} type="button" className={klasa} data-stan={wymus} disabled={wylaczony}>
                    {stan}
                  </button>
                ))}
                <a href="#formularz" className={klasa}>
                  link jako przycisk
                </a>
              </div>
            </div>
          ))}
          <p className="max-w-miara text-stonowany">
            Strona zeruje odnośniki („a {"{"} color: inherit {"}"}”) w warstwie base, więc napis na
            linku-przycisku zostaje. Ta sama reguła luzem zabrałaby go.
          </p>
          <div className="flex flex-wrap gap-s">
            <Button variant="accent">Button accent</Button>
            <Button>Button primary</Button>
          </div>
        </div>
      </section>

      <section id="formularz" className="bg-tlo-inne px-margines py-sekcja-m">
        <div className="mx-auto flex max-w-strona flex-col gap-l">
          <h2>Pole z błędem i komunikat</h2>
          <form className="grid gap-m md:grid-cols-2">
            <div className="flex flex-col gap-xs">
              <label htmlFor="pole-imie">Imię</label>
              <input id="pole-imie" className="pole" placeholder="np. Anna" />
            </div>
            <div className="flex flex-col gap-xs">
              <label htmlFor="pole-telefon">Telefon</label>
              <input
                id="pole-telefon"
                type="tel"
                className="pole"
                defaultValue="12 34"
                aria-invalid="true"
                aria-describedby="pole-telefon-komunikat"
              />
              <p id="pole-telefon-komunikat" className="pole-komunikat">
                Numer ma za mało cyfr. Wpisz 9 cyfr, np. 600 123 456.
              </p>
            </div>
            <div className="flex flex-col gap-xs md:col-span-2">
              <label htmlFor="pole-wiadomosc">Wiadomość</label>
              <textarea id="pole-wiadomosc" className="pole" placeholder="W czym możemy pomóc?" />
              <p className="text-s text-stonowany">
                Wysyłając formularz, zgadzasz się na kontakt w sprawie zapytania.
              </p>
            </div>
            <div>
              <button type="button" className="przycisk-akcent">
                Wyślij zapytanie
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
