// Extract Chakra UI Design System colors from theme.ts for Tailwind CSS
// Compiles TypeScript on-the-fly using esbuild-register

const { register } = require("esbuild-register/dist/node");

/**
 * Register esbuild once to support importing TypeScript files.
 */
function registerTypeScript() {
  if (!process.env.__ESBUILD_REGISTERED__) {
    register({ target: "node14" });
    process.env.__ESBUILD_REGISTERED__ = "true";
  }
}

/**
 * Recursively transforms Chakra token objects
 * from { value: "#fff" } to "#fff"
 *
 * @param {Record<string, any>} tokens
 * @returns {Record<string, any>}
 */
function transformTokens(tokens) {
  if (!tokens || typeof tokens !== "object") return tokens;

  return Object.entries(tokens).reduce((acc, [key, value]) => {
    if (Array.isArray(value)) {
      acc[key] = value.map(transformTokens);
      return acc;
    }

    if (typeof value === "object" && value !== null) {
      acc[key] = "value" in value ? value.value : transformTokens(value);
      return acc;
    }

    acc[key] = value;
    return acc;
  }, {});
}

/**
 * Loads Chakra UI colors from theme.ts
 *
 * @returns {Record<string, any>}
 */
function loadThemeColors() {
  try {
    registerTypeScript();

    const { system } = require("./src/lib/theme.ts");

    const colors = system?._config?.theme?.tokens?.colors;

    if (!colors) {
      console.warn("⚠️  Theme loaded, but no colors were found in tokens");
      return {};
    }

    console.log("Chakra UI theme colors loaded successfully");
    return transformTokens(colors);
  } catch (error) {
    console.error(" Failed to load Chakra UI theme colors");
    console.error("   Reason:", error.message);
    console.error("   Check that @chakra-ui/react and @worldresources/wri-design-systems are installed");
    return {};
  }
}

const themeColors = loadThemeColors();

module.exports = {
  themeColors,
  loadThemeColors
};
