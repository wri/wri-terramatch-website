/**
 * Bridge between the design-system color tokens (`src/lib/theme.tokens.js`) and
 * the Tailwind config.
 *
 * The tokens are authored as plain CommonJS so this file does NOT need any
 * TypeScript transpiler at build time. This used to import `src/lib/theme.ts`
 * via `esbuild-register`, which broke silently under Node 22 in some deploys
 * (e.g. AWS Amplify pinned to 22.14) and produced an empty color map -- causing
 * every `(bg|text|border)-theme-*` class to be dropped from the generated CSS.
 */

const { colors } = require("./src/lib/theme.tokens.js");

if (!colors || Object.keys(colors).length === 0) {
  throw new Error(
    "[tailwind.theme] Failed to load design-system color tokens from src/lib/theme.tokens.js. " +
      "Tailwind would emit no `theme-*` utilities; aborting the build to prevent silent CSS regressions."
  );
}

module.exports = {
  themeColors: colors
};
