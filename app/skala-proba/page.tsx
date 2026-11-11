// STRONA PRÓBNA SKALI (część 2: kształty, przyciski, pola) – do usunięcia przed scaleniem
// (cały katalog app/skala-proba). Elementy z atrybutem data-stan dostają w zrzutach
// wymuszony stan (hover albo focus-visible), żeby wszystkie stany było widać naraz.
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Strona próbna skali: kształty",
  robots: { index: false, follow: false },
};

const stany = [
  ["zwykły", undefined, false],
  ["najechany", "hover", false],
  ["fokus z klawiatury", "focus", false],
  ["wyłączony", undefined, true],
] as const;

const przyciski = [
  ["Główny (.przycisk)", "przycisk"],
  ["Drugi, obrys (.przycisk-drugi)", "przycisk-drugi"],
  ["Cichy, bez tła i obrysu (.przycisk-cichy, Button ghost)", "przycisk-cichy"],
] as const;

const zaokraglenia = [
  ["s", "rounded-s"],
  ["m", "rounded-m"],
  ["l", "rounded-l"],
  ["pelne", "rounded-pelne"],
] as const;

const cienie = [
  ["s", "shadow-s"],
  ["m", "shadow-m"],
  ["l", "shadow-l"],
] as const;

export default function SkalaProba() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="px-margines py-sekcja-m">
        <div className="mx-auto flex max-w-strona flex-col gap-l">
          <h1>Kształty, przyciski i pola</h1>

          <h2>Przyciski</h2>
          {przyciski.map(([nazwa, klasa]) => (
            <div key={klasa} className="flex flex-col gap-s">
              <h3>{nazwa}</h3>
              <div className="flex flex-wrap gap-s">
                {stany.map(([stan, wymus, wylaczony]) => (
                  <button key={stan} type="button" className={klasa} data-stan={wymus} disabled={wylaczony}>
                    {stan}
                  </button>
                ))}
                <a href="#przyciski" className={klasa}>
                  link jako przycisk
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="przyciski" className="bg-tekst px-margines py-sekcja-s">
        <div className="mx-auto flex max-w-strona flex-col gap-s">
          <h3 className="text-tlo">Jasny, na ciemnym tle (.przycisk-jasny)</h3>
          <div className="flex flex-wrap gap-s">
            {stany.map(([stan, wymus, wylaczony]) => (
              <button key={stan} type="button" className="przycisk-jasny" data-stan={wymus} disabled={wylaczony}>
                {stan}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-margines py-sekcja-m">
        <div className="mx-auto flex max-w-strona flex-col gap-l">
          <h2>Pola formularza (.pole)</h2>
          <div className="grid gap-m md:grid-cols-2">
            {stany.map(([stan, wymus, wylaczony]) => (
              <div key={stan} className="flex flex-col gap-xs">
                <label htmlFor={`pole-${stan}`}>Imię i nazwisko ({stan})</label>
                <input
                  id={`pole-${stan}`}
                  className="pole"
                  placeholder="np. Anna Kowalska"
                  data-stan={wymus}
                  disabled={wylaczony}
                />
              </div>
            ))}
            {stany.slice(0, 3).map(([stan, wymus]) => (
              <div key={`blad-${stan}`} className="flex flex-col gap-xs">
                <label htmlFor={`pole-blad-${stan}`}>Telefon z błędem ({stan})</label>
                <input
                  id={`pole-blad-${stan}`}
                  type="tel"
                  className="pole"
                  defaultValue="12 34"
                  aria-invalid="true"
                  aria-describedby={`pole-blad-${stan}-komunikat`}
                  data-stan={wymus}
                />
                <p id={`pole-blad-${stan}-komunikat`} className="pole-komunikat">
                  Numer ma za mało cyfr. Wpisz 9 cyfr, np. 600 123 456.
                </p>
              </div>
            ))}
            <div className="flex flex-col gap-xs">
              <label htmlFor="pole-blad-klasa">Wiadomość z błędem (klasa .pole-blad)</label>
              <textarea
                id="pole-blad-klasa"
                className="pole pole-blad"
                aria-describedby="pole-blad-klasa-komunikat"
              />
              <p id="pole-blad-klasa-komunikat" className="pole-komunikat">
                Napisz choć kilka słów.
              </p>
            </div>
            <div className="flex flex-col gap-xs">
              <label htmlFor="pole-wybor">Temat</label>
              <select id="pole-wybor" className="pole" defaultValue="wspolpraca">
                <option value="wspolpraca">Współpraca</option>
                <option value="pytanie">Pytanie o ofertę</option>
              </select>
            </div>
            <div className="flex flex-col gap-xs">
              <label htmlFor="pole-wybor-wyl">Temat (wyłączony)</label>
              <select id="pole-wybor-wyl" className="pole" disabled defaultValue="pytanie">
                <option value="pytanie">Pytanie o ofertę</option>
              </select>
            </div>
            <div className="flex flex-col gap-xs md:col-span-2">
              <label htmlFor="pole-wiadomosc">Wiadomość</label>
              <textarea id="pole-wiadomosc" className="pole" placeholder="W czym możemy pomóc?" />
            </div>
          </div>
          <form className="flex flex-col gap-s md:flex-row md:items-end">
            <div className="flex flex-1 flex-col gap-xs">
              <label htmlFor="pole-email">Adres e-mail</label>
              <input id="pole-email" type="email" className="pole" placeholder="adres@przyklad.pl" />
            </div>
            <button type="button" className="przycisk">
              Zapisz mnie
            </button>
          </form>
        </div>
      </section>

      <section className="bg-tlo-inne px-margines py-sekcja-m">
        <div className="mx-auto flex max-w-strona flex-col gap-l">
          <h2>Zaokrąglenia, cienie, linia</h2>
          <div className="flex flex-wrap gap-m">
            {zaokraglenia.map(([nazwa, klasa]) => (
              <div key={nazwa} className={`${klasa} border-linia border-obramowanie-mocne bg-tlo px-m py-s`}>
                rounded-{nazwa}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-l">
            {cienie.map(([nazwa, klasa]) => (
              <div key={nazwa} className={`${klasa} rounded-m bg-tlo p-m`}>
                shadow-{nazwa}
              </div>
            ))}
          </div>
          <div className="grid gap-m md:grid-cols-2">
            <Card>
              <CardTitle>Karta z komponentu</CardTitle>
              <p className="text-stonowany">Zaokrąglenie l, linia ze skali, bez paska akcentu.</p>
            </Card>
            <div className="flex flex-wrap items-start gap-s">
              <Button>Button primary</Button>
              <Button variant="secondary">secondary</Button>
              <Button variant="ghost">ghost</Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
