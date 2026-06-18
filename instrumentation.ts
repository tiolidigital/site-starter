// Next.js instrumentation — wpięcie Sentry po stronie serwera.
// register() ładuje właściwy config zależnie od runtime'u; onRequestError
// łapie błędy z Server Components, Route Handlers i middleware.
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
