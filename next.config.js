const { withSentryConfig } = require("@sentry/nextjs/config");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ["en", "en-US", "es", "es-MX", "fr-FR", "pt-BR"],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: "en-US",
    localeDetection: false
  },
  // Only files with these extensions under src/pages are routes, so components can live next to the pages
  // that use them. This also applies to the instrumentation hook (src/instrumentation.page.ts).
  pageExtensions: ["page.tsx", "page.ts"],
  images: { domains: process.env.IMAGE_DOMAINS?.split(",") ?? ["s3-eu-west-1.amazonaws.com"] },
  // webpack5: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack", "url-loader"]
    });

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false
    };

    return config;
  },
  transpilePackages: [
    "mapbox-gl-draw-circle",
    "@chakra-ui/react",
    "@ark-ui/react",
    "@zag-js/date-picker",
    "@internationalized/date"
  ],
  eslint: {
    ignoreDuringBuilds: true
  }
};

/** @type {import('@sentry/nextjs/config').SentryBuildOptions} */
const sentryOptions = {
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/build/

  // Suppresses source map uploading logs during build
  silent: true,

  org: process.env.SENTRY_ORG ?? "world-resources-institute-data-lab",
  project: process.env.SENTRY_PROJECT ?? "terramatch-frontend",
  authToken: process.env.SENTRY_AUTH_TOKEN,

  release: {
    deploy: {
      env: process.env.NEXT_PUBLIC_TARGET_ENV ?? "local"
    }
  },

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
  tunnelRoute: "/monitoring",

  webpack: {
    // Automatically tree-shake Sentry logger statements to reduce bundle size
    treeshake: {
      removeDebugLogging: true
    }
  }
};

module.exports = withSentryConfig(nextConfig, sentryOptions);
