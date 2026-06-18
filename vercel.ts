// Vercel project configuration (vercel.ts zamiast vercel.json — pełny typing + dynamika).
// Fluid Compute jest domyślny — pełny Node.js, reuse instancji, mniej cold-startów.
// Patrz recipe nextjs-vercel.md §2. Dodaj reguły headers/rewrites/regions gdy potrzebne.

const config = {
  // Fluid Compute: nie nadpisuj runtimeConfig na edge — Fluid daje te same regiony bez braków kompatybilności.
};

export default config;
