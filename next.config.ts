import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Supabase Storage — zastąp <project-ref> przy podpięciu projektu.
        // Tryb static: usuń tę sekcję wraz z lib/supabase/* (patrz README opt-out).
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  // Publiczne identyfikatory projektu Sentry (nie sekrety — OK w repo).
  // Wypełnij przy podpięciu: {{SENTRY_ORG}} i {{SENTRY_PROJECT}}.
  org: "{{SENTRY_ORG}}",
  project: "{{SENTRY_PROJECT}}",
  silent: !process.env.CI,
  authToken: process.env.SENTRY_AUTH_TOKEN,
});
