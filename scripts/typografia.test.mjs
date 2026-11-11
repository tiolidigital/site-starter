// Testy polskiej typografii (lib/typografia.ts, Z343). Uruchomienie: npm test
import assert from "node:assert/strict";
import { test } from "node:test";
import { bezSierot, bezWdowy, paraNaKoncu, TWARDA_SPACJA as N } from "../lib/typografia.ts";
const WJ = "\u2060";

test("jednoliterowe słowo dostaje twardą spację", () => {
  assert.equal(bezSierot("Dom w lesie"), `Dom w${N}lesie`);
  assert.equal(bezSierot("Z winnicy widać góry"), `Z${N}winnicy widać góry`);
});

test("dwa i trzy jednoliterowe słowa z rzędu (Z343: „i w relacjach”)", () => {
  assert.equal(bezSierot("w domu i w relacjach"), `w${N}domu i${N}w${N}relacjach`);
  assert.equal(bezSierot("tak a i o tym"), `tak a${N}i${N}o${N}tym`);
});

test("po nawiasie i cudzysłowie też", () => {
  assert.equal(bezSierot("(i nie tylko) „a jednak”"), `(i${N}nie tylko) „a${N}jednak”`);
});

test("nie rusza końcówek wyrazów", () => {
  assert.equal(bezSierot("Pola winorośli rosną nad rzeką"), "Pola winorośli rosną nad rzeką");
});

test("jednoliterowe słowo na końcu węzła tekstu („Spotkania w ” przed <strong>)", () => {
  assert.equal(bezSierot("Spotkania w "), `Spotkania w${N}`);
});

test("liczba z jednostką razem, zwykłe słowo po liczbie bez zmian", () => {
  assert.equal(bezSierot("Stok ma 420 m i 1,2 ha"), `Stok ma 420${N}m i${N}1,2${N}ha`);
  assert.equal(bezSierot("Mamy 3 medale"), "Mamy 3 medale");
  assert.equal(bezSierot("Kosztuje 30 zł"), `Kosztuje 30${N}zł`);
});

test("skróty: nr, ul., ok., dr", () => {
  assert.equal(bezSierot("ul. Polna nr 5, ok. 20 osób"), `ul.${N}Polna nr${N}5, ok.${N}20${N}osób`);
  assert.equal(bezSierot("Umów się z dr Kowalską"), `Umów się z${N}dr${N}Kowalską`);
});

test("półpauza we wtrąceniu nie zaczyna wiersza, zakres liczb bez zmian", () => {
  assert.equal(bezSierot("Rano – najlepiej"), `Rano${N}– najlepiej`);
  assert.equal(bezSierot("6–8 tygodni"), "6–8 tygodni");
});

test("drugi przebieg nic nie zmienia", () => {
  const raz = bezSierot("w domu i w relacjach, 420 m – ok. 20 osób");
  assert.equal(bezSierot(raz), raz);
});

test("wdowa: krótkie dwa ostatnie słowa sklejone", () => {
  assert.equal(bezWdowy("Zapraszam na spotkanie w gabinecie."), `Zapraszam na spotkanie w${N}gabinecie.`);
  assert.equal(bezWdowy("To jest koniec."), `To jest${N}koniec.`);
});

test("wdowa: para dłuższa niż limit zostaje", () => {
  const t = "terapii poznawczo-behawioralną.";
  assert.equal(bezWdowy(t, 16), t);
});

test("wdowa: długie słowo z łącznikiem w szerokim akapicie (Z343)", () => {
  assert.equal(
    bezWdowy("schematu i uważności poznawczo-behawioralną."),
    `schematu i uważności${N}poznawczo-${WJ}behawioralną.`,
  );
});

test("wdowa: ostatnie słowo już z twardą spacją to dwa słowa, drugi przebieg nic nie zmienia", () => {
  assert.equal(bezWdowy(`Pracuję w${N}domu`), `Pracuję w${N}domu`);
  const raz = bezWdowy("To jest koniec.");
  assert.equal(bezWdowy(raz), raz);
  const dlugi = bezWdowy("i uważności poznawczo-behawioralną.", 40);
  assert.equal(bezWdowy(dlugi, 40), dlugi);
});

test("wdowa: sama interpunkcja na końcu nie jest słowem", () => {
  assert.equal(bezWdowy("Koniec –"), "Koniec –");
});

test("paraNaKoncu: zakres dwóch ostatnich słów bez spacji na końcu", () => {
  const t = "Zapraszam w gabinecie.  ";
  const p = paraNaKoncu(t);
  assert.equal(t.slice(p.od, p.do), "w gabinecie.");
  assert.equal(paraNaKoncu("jedno"), null);
});
