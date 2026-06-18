// Sentry — runtime Node.js (Server Components, Route Handlers, Server Actions).
// Ładowane przez instrumentation.ts (register) gdy NEXT_RUNTIME === "nodejs".
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // Wysyłaj tylko z produkcji — żeby nie zaśmiecać Sentry błędami z lokalnej maszyny
  // ani nie zjadać darmowego limitu (5k zdarzeń/mc).
  enabled: process.env.NODE_ENV === "production",
  // 10% tras w produkcji (performance), 100% lokalnie.
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,
  debug: false,
});
