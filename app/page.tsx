import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="px-margines py-sekcja-l">
        <div className="mx-auto flex max-w-strona flex-col gap-m">
          <h1 className="max-w-miara">Tu zaczyna się nowa strona.</h1>
          <p className="max-w-miara text-l text-stonowany">
            Odstępy, tekst i kolory biorą się ze skali w pliku{" "}
            <code>app/skala.css</code>. Przy starcie strony ustaw tam własne
            liczby i kolor marki.
          </p>
          <div className="flex flex-col gap-s sm:flex-row">
            <Link
              className="inline-flex items-center justify-center rounded-full bg-marka px-m py-s font-medium text-na-marce transition-colors hover:bg-marka-hover"
              href="/skala-proba"
            >
              Zobacz stronę próbną skali
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
