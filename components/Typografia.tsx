"use client";

// Polska typografia na całej stronie bez ruszania komponentów (Z343). Wstaw raz w app/layout.tsx:
//   <body>{children}<Typografia /></body>
// Reguły i wyjaśnienie: lib/typografia.ts. Fragment do pominięcia: atrybut `data-bez-typografii`.
import { useEffect } from "react";
import { poprawDrzewo } from "@/lib/typografia";

export function Typografia() {
  useEffect(() => {
    let obserwator: MutationObserver | null = null;
    let anulowane = false;

    const start = () => {
      if (anulowane) return;
      poprawDrzewo(document.body);
      obserwator = new MutationObserver((zmiany) => {
        for (const z of zmiany) {
          if (z.type === "characterData") poprawDrzewo(z.target);
          else z.addedNodes.forEach((n) => poprawDrzewo(n));
        }
      });
      obserwator.observe(document.body, { subtree: true, childList: true, characterData: true });
    };

    // Po pełnym załadowaniu, żeby nie zmieniać tekstu, którego React jeszcze nie przejął (hydratacja),
    // i po fontach, bo szerokość pary słów przy wdowach zależy od kroju.
    const poLoad = () =>
      (window.requestIdleCallback ?? ((f: () => void) => setTimeout(f, 1)))(() => {
        document.fonts.ready.then(start, start);
      });
    if (document.readyState === "complete") poLoad();
    else window.addEventListener("load", poLoad, { once: true });

    return () => {
      anulowane = true;
      window.removeEventListener("load", poLoad);
      obserwator?.disconnect();
    };
  }, []);
  return null;
}
