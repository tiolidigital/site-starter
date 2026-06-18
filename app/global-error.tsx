"use client";

// Globalny error boundary App Routera — łapie błędy renderowania na poziomie
// root layout i raportuje je do Sentry. Wymagany do pełnego pokrycia błędów React.
import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
