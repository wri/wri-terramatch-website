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
