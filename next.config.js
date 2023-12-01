const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ["en", "en-US", "es", "es-MX", "fr-FR", "pt-BR"],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: "en-US",
    localeDetection: false
  },
  //Added "page.tsx", "page.ts" to get middleware.page.ts working
  // https://github.com/vercel/next.js/issues/38233#issuecomment-1172457237
  pageExtensions: ["tsx", "page.tsx", "page.ts"],
  publicRuntimeConfig: {
    TxNativePublicToken: process.env.TRANSIFEX_TOKEN
  },
  images: { domains: ["s3-eu-west-1.amazonaws.com"] },
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
  transpilePackages: ["mapbox-gl-draw-circle"]
};

/** @type {import('@sentry/nextjs').SentryWebpackPluginOptions} */
const userSentryWebpackPluginOptions = {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Suppresses source map uploading logs during build
  silent: true,

  org: process.env.SENTRY_ORG || "3-sided-cube",
  project: process.env.SENTRY_PROJECT || "wri-web-platform-version-2",
  authToken: process.env.SENTRY_AUTH_TOKEN
};

/** @type {import('@sentry/nextjs').UserSentryOptions} */
const userSentryOptions = {
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Transpiles SDK to be compatible with IE11 (increases bundle size)
  transpileClientSDK: true,

  // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
  tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true
};

module.exports = withSentryConfig(nextConfig, userSentryWebpackPluginOptions, userSentryOptions);
