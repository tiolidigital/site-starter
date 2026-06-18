// Sentry — strona klienta (przeglądarka). Next.js ładuje ten plik automatycznie.
// onRouterTransitionStart instrumentuje nawigacje App Routera (performance).
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === "production",
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,
  debug: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
